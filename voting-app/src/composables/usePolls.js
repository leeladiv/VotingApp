import { computed, ref, onUnmounted } from 'vue';
import { useVotingStore } from '../stores/votingStore';

export function usePolls() {
  const store = useVotingStore();
  const now = ref(Date.now());

  // Update time every second to handle auto-status changes
  const timer = setInterval(() => { now.value = Date.now(); }, 1000);
  onUnmounted(() => clearInterval(timer));

  const getPollStatus = (poll) => {
    if (!poll) return '';
    const start = new Date(poll.startDate).getTime();
    const end = new Date(poll.endDate).getTime();

    // Requirement: Display status automatically
    if (now.value < start) return 'Upcoming';
    if (now.value > end) return 'Ended';
    return 'Ongoing';
  };

  return {
    polls: computed(() => store.polls),
    createPoll: store.createPoll,
    getPollStatus
  };
}