<script setup>
import { ref } from 'vue';
import { usePolls } from './composables/usePolls';
import PollManager from './components/PollManager.vue';

const { polls, createPoll, getPollStatus } = usePolls();
const view = ref('list');
const selectedPoll = ref(null);
const showModal = ref(false);
const newPoll = ref({ title: '', description: '', startDate: '', endDate: '' });

console.log(polls, getPollStatus)
const openPoll = (poll) => { selectedPoll.value = poll; view.value = 'manager'; };

const handleCreate = () => {
  if(!newPoll.value.title) return alert("Title required");
  createPoll(newPoll.value);
  showModal.value = false;
  newPoll.value = { title: '', description: '', startDate: '', endDate: '' };
};

const statusColors = (s) => ({
  'Upcoming': 'bg-yellow-100 text-yellow-800',
  'Ongoing': 'bg-green-100 text-green-800',
  'Ended': 'bg-red-100 text-red-800'
}[s]);
</script>

<template>
  <div class="min-h-screen bg-slate-500 p-8 font-sans text-gray-900">
    <div class="max-w-5xl mx-auto">
      
      <!-- List View -->
      <div v-if="view === 'list'">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-black text-violet-900">🗳️ Let's Vote</h1>
          <button @click="showModal = true" class="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium shadow">+ Create Poll</button>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="poll in polls" :key="poll.id" class="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition">
            <span :class="['text-xs font-bold px-2 py-1 rounded-full', statusColors(getPollStatus(poll))]">{{ getPollStatus(poll) }}</span>
            <h3 class="text-xl font-bold mt-3 mb-2">{{ poll.title }}</h3>
            <p class="text-gray-600 text-sm line-clamp-2 mb-4">{{ poll.description }}</p>
            <button @click="openPoll(poll)" class="w-full bg-gray-50 text-indigo-600 font-bold py-2 rounded hover:bg-indigo-50">Manage & Vote</button>
          </div>
        </div>
        <div v-if="polls.length === 0" class="text-center text-gray-500 mt-20">No polls yet. Create one to start!</div>
      </div>

      <!-- Detail View -->
      <PollManager v-else :poll="selectedPoll" @back="view = 'list'" />

    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">Create New Poll</h2>
        <div class="space-y-3">
          <input v-model="newPoll.title" placeholder="Title" class="w-full border p-2 rounded">
          <textarea v-model="newPoll.description" placeholder="Description" class="w-full border p-2 rounded"></textarea>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="text-xs font-bold text-gray-500">Start</label><input type="datetime-local" v-model="newPoll.startDate" class="w-full border p-2 rounded text-sm"></div>
            <div><label class="text-xs font-bold text-gray-500">End</label><input type="datetime-local" v-model="newPoll.endDate" class="w-full border p-2 rounded text-sm"></div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="showModal = false" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
          <button @click="handleCreate" class="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>