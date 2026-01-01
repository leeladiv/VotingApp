<script setup>
import { ref, computed } from 'vue';
import { usePolls } from '../composables/usePolls';
import { useVoting } from '../composables/useVoting';
import CandidateCard from './CandidateCard.vue';

const props = defineProps(['poll']);
defineEmits(['back']);

const { getPollStatus } = usePolls();

// Reactive Wrapper for Composable
const pollRef = computed(() => props.poll);
const { rankedCandidates, addCandidate, addVoter, castVote } = useVoting(pollRef);

// State
const status = computed(() => getPollStatus(props.poll));
const activeTab = ref('candidates');
const voterIdInput = ref(''); 

// Form Data
const newCand = ref({ name: '', photo: '', manifesto: '' });
const newVoter = ref({ name: '', identifier: '' });

// Actions
const submitVote = (candId) => {
  if(!voterIdInput.value) return alert("Please enter your Voter ID");
  try {
    castVote(candId, voterIdInput.value, status.value);
    alert("Vote successful!");
    voterIdInput.value = '';
  } catch(e) { alert(e.message); }
};

const submitCandidate = () => {
  addCandidate(newCand.value);
  newCand.value = { name: '', photo: '', manifesto: '' };
};

const submitVoter = () => {
  try {
    addVoter(newVoter.value);
    newVoter.value = { name: '', identifier: '' };
  } catch(e) { alert(e.message); }
};
</script>

<template>
  <div class="space-y-6">
    <button @click="$emit('back')" class="text-gray-500 hover:text-black">← Back to Dashboard</button>
    
    <!-- Poll Header -->
    <div class="bg-linear-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl shadow-lg">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold">{{ poll.title }}</h1>
          <p class="text-indigo-100 mt-2">{{ poll.description }}</p>
        </div>
        <span class="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-bold border border-white/30">
          {{ status }}
        </span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button @click="activeTab = 'candidates'" :class="`px-6 py-3 font-medium ${activeTab==='candidates' ? 'text-indigo-600 border-b-2 border-white' : 'text-black'}`">Candidates</button>
      <button @click="activeTab = 'voters'" :class="`px-6 py-3 font-medium ${activeTab==='voters' ? 'text-indigo-600 border-b-2 border-white' : 'text-black'}`">Voters</button>
    </div>

    <!-- CANDIDATES TAB -->
    <div v-if="activeTab === 'candidates'" class="space-y-6">
      
      <!-- Add Candidate Form -->
      <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 class="font-bold text-gray-700 mb-2">Add Candidate</h3>
        <div class="space-y-2">
          <input v-model="newCand.name" placeholder="Full Name" class="w-full border p-2 rounded">
          <input v-model="newCand.photo" placeholder="Photo URL" class="w-full border p-2 rounded">
          <textarea v-model="newCand.manifesto" placeholder="Manifesto (Goals)" class="w-full border p-2 rounded"></textarea>
          <button @click="submitCandidate" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Add Candidate</button>
        </div>
      </div>

      <!-- Voting Identity Input (Only visible if Ongoing) -->
      <div v-if="status === 'Ongoing'" class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center gap-4">
        <div class="flex-1">
          <label class="block text-xs font-bold text-yellow-800 uppercase mb-1">Identity Check</label>
          <input v-model="voterIdInput" placeholder="Enter your Unique Voter ID to enable voting buttons below" class="w-full border-yellow-300 border p-2 rounded">
        </div>
      </div>

      <!-- Results Header -->
      <div v-if="status === 'Ended'" class="p-3 bg-indigo-50 text-indigo-800 text-center font-bold rounded border border-indigo-100">
        🏆 Final Rankings
      </div>

      <!-- Candidates List -->
      <div class="grid gap-4">
        <CandidateCard 
          v-for="(cand, index) in rankedCandidates" 
          :key="cand.id"
          :candidate="cand"
          :status="status"
          :rank="index + 1"
          @vote="submitVote"
        />
        <div v-if="rankedCandidates.length === 0" class="text-center text-gray-400 py-4">No candidates yet.</div>
      </div>
    </div>

    <!-- VOTERS TAB -->
    <div v-if="activeTab === 'voters'" class="space-y-6">
      <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
        <h3 class="font-bold text-emerald-800 mb-2">Register Voter</h3>
        <div class="flex gap-2">
          <input v-model="newVoter.name" placeholder="Name" class="flex-1 border p-2 rounded">
          <input v-model="newVoter.identifier" placeholder="Unique ID (Email/Phone)" class="flex-1 border p-2 rounded">
          <button @click="submitVoter" class="bg-emerald-600 text-white px-4 py-2 rounded">Register</button>
        </div>
      </div>

      <div class="bg-white rounded-xl border overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-500 uppercase">
            <tr><th class="px-4 py-3">Name</th><th class="px-4 py-3">ID</th><th class="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in poll.voters" :key="v.id" class="border-b last:border-0">
              <td class="px-4 py-3 font-medium">{{ v.name }}</td>
              <td class="px-4 py-3 text-gray-500 font-mono">{{ v.identifier }}</td>
              <td class="px-4 py-3">
                <span v-if="v.hasVoted" class="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">Voted</span>
                <span v-else class="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>