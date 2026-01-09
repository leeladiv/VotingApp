<script setup>
import { ref, computed, watch } from 'vue';
import { usePolls } from '../composables/usePolls';
import { useVoting } from '../composables/useVoting';
import CandidateCard from './CandidateCard.vue';

const { getPollStatus } = usePolls();

const props = defineProps(['poll']);
defineEmits(['back']);

// Reactive Wrapper for Composable
const pollRef = computed(() => props.poll);
const { rankedCandidates, addCandidate, addVoter, castVote } = useVoting(pollRef);

// State
const status = computed(() => getPollStatus(props.poll));
const voterIdInput = ref(''); 

// Form Data
const newCand = ref({ name: '', photo: '', manifesto: '' });
const newVoter = ref({ name: '', identifier: '' });

const currentView = ref('setup'); // 'setup', 'voting', 'results'

watch(status, (newStatus) => {
  if (newStatus === 'Ongoing') {
    currentView.value = 'voting';
  } else if (newStatus === 'Ended') {
    currentView.value = 'results';
  } else {
    currentView.value = 'setup';
  }
}, { immediate: true });

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
    <button @click="$emit('back')" class="text-white hover:text-black">← Back to Dashboard</button>
    
    <!-- Poll Header -->
    <div class="bg-linear-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl shadow-lg">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold">{{ poll.title }}</h1>
          <p class="text-indigo-100 mt-2">{{ poll.description }}</p>
          <!-- Added date display for clarity -->
          <div class="flex gap-4 mt-3 text-sm text-indigo-200">
            <span>Start: {{ new Date(poll.startDate).toLocaleString() }}</span>
            <span>End: {{ new Date(poll.endDate).toLocaleString() }}</span>
          </div>
        </div>
        <span class="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-bold border border-white/30">
          {{ status }}
        </span>
      </div>
    </div>

    <!-- Setup View - Show both candidates and voters forms together -->
    <div v-if="currentView === 'setup'" class="space-y-6">
      <!-- Improved messaging to explain automatic transition -->
      <div class="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
        <p class="text-blue-800 font-medium">Setup your poll by adding candidates and voters below.</p>
        <p class="text-blue-600 text-sm mt-1">The voting interface will open automatically when the poll starts.</p>
      </div>

      <!-- Add Candidate Form -->
      <div class="bg-white p-5 rounded-xl border-2 border-blue-200 shadow-sm">
        <h3 class="font-bold text-gray-900 mb-3 text-lg">Add Candidates</h3>
        <div class="space-y-3">
          <input v-model="newCand.name" placeholder="Full Name" class="w-full border-2 border-gray-300 p-2.5 rounded-lg focus:border-blue-500 focus:outline-none">
          <input v-model="newCand.photo" placeholder="Photo URL" class="w-full border-2 border-gray-300 p-2.5 rounded-lg focus:border-blue-500 focus:outline-none">
          <textarea v-model="newCand.manifesto" placeholder="Manifesto (Goals)" class="w-full border-2 border-gray-300 p-2.5 rounded-lg focus:border-blue-500 focus:outline-none" rows="2"></textarea>
          <button @click="submitCandidate" class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Add Candidate</button>
        </div>

        <!-- Current Candidates List -->
        <div v-if="rankedCandidates.length > 0" class="mt-4 pt-4 border-t">
          <p class="text-sm font-bold text-gray-600 mb-2">Current Candidates ({{ rankedCandidates.length }})</p>
          <div class="space-y-2">
            <div v-for="cand in rankedCandidates" :key="cand.id" class="flex items-center gap-3 bg-gray-50 p-2 rounded">
              <img :src="cand.photo" class="w-10 h-10 rounded-full object-cover bg-gray-200">
              <span class="font-medium text-sm">{{ cand.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Voters Form -->
      <div class="bg-white p-5 rounded-xl border-2 border-emerald-200 shadow-sm">
        <h3 class="font-bold text-gray-900 mb-3 text-lg">Register Voters</h3>
        <div class="flex gap-3">
          <input v-model="newVoter.name" placeholder="Name" class="flex-1 border-2 border-gray-300 p-2.5 rounded-lg focus:border-emerald-500 focus:outline-none">
          <input v-model="newVoter.identifier" placeholder="Unique ID (Email/Phone)" class="flex-1 border-2 border-gray-300 p-2.5 rounded-lg focus:border-emerald-500 focus:outline-none">
          <button @click="submitVoter" class="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 font-medium whitespace-nowrap">Register</button>
        </div>

        <!-- Current Voters List -->
        <div v-if="poll.voters.length > 0" class="mt-4 pt-4 border-t">
          <p class="text-sm font-bold text-gray-600 mb-2">Registered Voters ({{ poll.voters.length }})</p>
          <div class="bg-white rounded-lg border overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold">Name</th>
                  <th class="px-3 py-2 text-left font-semibold">ID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in poll.voters" :key="v.id" class="border-t">
                  <td class="px-3 py-2">{{ v.name }}</td>
                  <td class="px-3 py-2 text-gray-600 font-mono text-xs">{{ v.identifier }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Voting View - Automatically shown when poll is ongoing -->
    <div v-else-if="currentView === 'voting'" class="space-y-6">
      <div class="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
        <p class="text-green-800 font-bold text-lg">Voting is Now Open!</p>
      </div>

      <!-- Voting Identity Input -->
      <div class="bg-yellow-50 border-2 border-yellow-300 p-5 rounded-xl">
        <label class="block text-sm font-bold text-yellow-900 uppercase mb-2">Enter Your Voter ID</label>
        <input v-model="voterIdInput" placeholder="Enter your Unique Voter ID to vote" class="w-full border-2 border-yellow-400 p-3 rounded-lg focus:border-yellow-600 focus:outline-none">
      </div>

      <!-- Candidates List for Voting -->
      <div class="grid gap-4">
        <CandidateCard 
          v-for="cand in rankedCandidates" 
          :key="cand.id"
          :candidate="cand"
          :status="status"
          :rank="0"
          @vote="submitVote"
        />
        <div v-if="rankedCandidates.length === 0" class="text-center text-gray-400 py-8">No candidates available.</div>
      </div>
    </div>

    <!-- Results View - Automatically shown when poll has ended -->
    <div v-else-if="currentView === 'results'" class="space-y-6">
      <div class="p-4 bg-indigo-600 text-white text-center font-bold rounded-xl text-lg shadow-lg">
        🏆 Poll Closed - Final Results
      </div>

      <!-- Final Rankings -->
      <div class="grid gap-4">
        <CandidateCard 
          v-for="(cand, index) in rankedCandidates" 
          :key="cand.id"
          :candidate="cand"
          :status="status"
          :rank="index + 1"
          @vote="submitVote"
        />
        <div v-if="rankedCandidates.length === 0" class="text-center text-gray-400 py-8">No results to display.</div>
      </div>

      <!-- Voter Turnout Stats -->
      <div class="bg-white p-5 rounded-xl border shadow-sm">
        <h3 class="font-bold text-gray-900 mb-3">Voter Turnout</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-indigo-600">{{ poll.voters.length }}</p>
            <p class="text-sm text-gray-600">Registered</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-green-600">{{ poll.voters.filter(v => v.hasVoted).length }}</p>
            <p class="text-sm text-gray-600">Voted</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-600">{{ poll.voters.filter(v => !v.hasVoted).length }}</p>
            <p class="text-sm text-gray-600">Did Not Vote</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
