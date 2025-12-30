import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useVotingStore = defineStore('voting', () => {
  const polls = ref([]);

  // Load from LocalStorage
  if (localStorage.getItem('oreate_polls')) {
    polls.value = JSON.parse(localStorage.getItem('oreate_polls'));
  }

  // Persist to LocalStorage
  watch(polls, (val) => localStorage.setItem('oreate_polls', JSON.stringify(val)), { deep: true });

  // --- ACTIONS ---

  const createPoll = (data) => {
    polls.value.push({
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      candidates: [],
      voters: []
    });
  };

  const addCandidate = (pollId, candidate) => {
    const poll = polls.value.find(p => p.id === pollId);
    if (!poll) return;
    poll.candidates.push({
      id: crypto.randomUUID(),
      name: candidate.name,
      photo: candidate.photo || 'https://via.placeholder.com/150',
      manifesto: candidate.manifesto,
      votes: 0 // Initialize votes
    });
  };

  const addVoter = (pollId, voter) => {
    const poll = polls.value.find(p => p.id === pollId);
    if (!poll) return;

    // Requirement: Enforce voter uniqueness per poll
    const exists = poll.voters.some(v => v.identifier === voter.identifier);
    if (exists) throw new Error("Voter ID already registered in this poll.");

    poll.voters.push({
      id: crypto.randomUUID(),
      name: voter.name,
      identifier: voter.identifier,
      hasVoted: false // Tracking flag
    });
  };

  const castVote = (pollId, candidateId, voterIdentifier) => {
    const poll = polls.value.find(p => p.id === pollId);
    if (!poll) throw new Error("Poll not found");

    const voter = poll.voters.find(v => v.identifier === voterIdentifier);
    const candidate = poll.candidates.find(c => c.id === candidateId);

    if (!voter) throw new Error("Voter ID not found.");
    
    // Requirement: Voter can only vote once per poll
    if (voter.hasVoted) throw new Error("You have already voted.");
    
    if (!candidate) throw new Error("Candidate not found.");

    // Requirement: Vote counts update immediately
    candidate.votes++;
    voter.hasVoted = true;
  };

  return { polls, createPoll, addCandidate, addVoter, castVote };
});