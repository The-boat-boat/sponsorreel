<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import BaseModal from '@/components/base/BaseModal.vue'
import { BaseButton, BaseSelect, BaseTextarea } from '@/components/base'
import type { Event, SponsorshipTier } from '@/types'

interface Props {
  event: Event
  sponsorId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submitted: []
}>()

const eventsStore = useEventsStore()
const authStore = useAuthStore()

const selectedTierId = ref<string>('')
const message = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)

const availableTiers = computed(() => {
  return (props.event.sponsorship_tiers || [])
    .filter(tier => tier.is_active)
    .sort((a, b) => a.display_order - b.display_order)
})

const tierOptions = computed(() => {
  return availableTiers.value.map(tier => ({
    value: tier.id,
    label: `${tier.name} - ${formatPrice(tier.price)}`
  }))
})

const selectedTier = computed(() => {
  return availableTiers.value.find(t => t.id === selectedTierId.value)
})

const canSubmit = computed(() => {
  return selectedTierId.value && message.value.trim().length > 0
})

const formatPrice = (cents: number) => {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

const handleSubmit = async () => {
  if (!canSubmit.value || !authStore.user?.id) return

  submitting.value = true
  error.value = null

  try {
    await eventsStore.submitApplication(
      props.event.id,
      authStore.user.id,
      selectedTierId.value,
      message.value.trim()
    )
    
    emit('submitted')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to submit application'
  } finally {
    submitting.value = false
  }
}

// Auto-select first tier if available
if (availableTiers.value.length > 0 && !selectedTierId.value) {
  selectedTierId.value = availableTiers.value[0].id
}
</script>

<template>
  <BaseModal :open="true" title="Apply to Sponsor" size="lg" @close="emit('close')">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h2 class="text-xl font-bold text-text-main-light dark:text-white">Apply to Sponsor</h2>
          <p class="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
            {{ event.title }}
          </p>
        </div>
        <button 
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          @click="emit('close')"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Tier Selection -->
      <div>
        <BaseSelect
          v-model="selectedTierId"
          :options="tierOptions"
          label="Select Sponsorship Tier"
          required
        />
        
        <!-- Tier Details -->
        <div v-if="selectedTier" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 class="font-bold text-text-main-light dark:text-white mb-2">{{ selectedTier.name }}</h4>
          <p class="text-sm text-text-secondary dark:text-text-secondary-dark mb-3">
            Investment: <span class="font-bold text-primary">{{ formatPrice(selectedTier.price) }}</span>
          </p>
          <div>
            <p class="text-xs font-semibold text-text-secondary dark:text-text-secondary-dark mb-2">Benefits:</p>
            <ul class="space-y-1">
              <li
                v-for="(benefit, i) in selectedTier.benefits"
                :key="i"
                class="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark"
              >
                <span class="material-symbols-outlined text-green-500 text-[16px]">check</span>
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Message -->
      <BaseTextarea
        v-model="message"
        label="Your Message"
        placeholder="Tell the operator why your business would be a great fit for this event..."
        :rows="6"
        required
        hint="This message will be sent to the event operator"
      />

      <!-- Error Message -->
      <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">
        Cancel
      </BaseButton>
      <BaseButton 
        variant="primary"
        :loading="submitting"
        :disabled="!canSubmit"
        @click="handleSubmit"
      >
        Submit Application
      </BaseButton>
    </template>
  </BaseModal>
</template>
