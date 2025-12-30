<script setup>
defineProps({
  candidate: Object,
  status: String,
  rank: Number
});
defineEmits(['vote']);
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4">
    <img :src="candidate.photo" alt="Candidate" class="w-20 h-20 rounded-full object-cover bg-gray-100">
    
    <div class="flex-1">
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-lg">{{ candidate.name }}</h3>
        
        <!-- Requirement: Rankings/Votes visible ONLY after poll ends -->
        <div v-if="status === 'Ended'" class="text-right">
          <span class="block text-xs font-bold text-gray-500 uppercase">Rank #{{ rank }}</span>
          <span class="text-indigo-600 font-bold">{{ candidate.votes }} Votes</span>
        </div>
      </div>
      
      <p class="text-gray-600 text-sm mt-1 mb-3 italic">"{{ candidate.manifesto }}"</p>
      
      <!-- Requirement: Voting disabled/hidden outside active time -->
      <button 
        v-if="status === 'Ongoing'"
        @click="$emit('vote', candidate.id)"
        class="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        Vote
      </button>
      <div v-else-if="status === 'Upcoming'" class="text-xs text-yellow-600 font-bold">
        Voting starts soon
      </div>
    </div>
  </div>
</template>