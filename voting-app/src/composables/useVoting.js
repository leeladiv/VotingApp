import { computed } from 'vue';
import { useVotingStore } from '../stores/votingStore';

export function useVoting(pollRef) {
  const store = useVotingStore();

  // Requirement: Candidates automatically ranked by total votes
  const rankedCandidates = computed(() => {
    if (!pollRef.value?.candidates) return [];
    return [...pollRef.value.candidates].sort((a, b) => b.votes - a.votes);
  });

  const castVote = (candidateId, voterIdentifier, currentStatus) => {
    // Requirement: Voting allowed only during active period
    if (currentStatus !== 'Ongoing') {
      throw new Error("Voting is closed. Poll is " + currentStatus);
    }
    store.castVote(pollRef.value.id, candidateId, voterIdentifier);
  };

  // Delegate add actions
  const addCandidate = (data) => store.addCandidate(pollRef.value.id, data);
  const addVoter = (data) => store.addVoter(pollRef.value.id, data);

  return { rankedCandidates, addCandidate, addVoter, castVote };
}