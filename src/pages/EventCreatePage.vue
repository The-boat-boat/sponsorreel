<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { interestTags } from '@/services/mock/mockData'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseInput, BaseTextarea, BaseSelect, BaseCard } from '@/components/base'

const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()

const currentStep = ref(1)
const totalSteps = 4

// Step 1: Event Basics
const title = ref('')
const filmTitle = ref('')
const eventDate = ref('')
const startTime = ref('')
const endTime = ref('')
const description = ref('')

// Step 2: Location
const venueName = ref('')
const streetAddress = ref('')
const city = ref('')
const state = ref('')
const zipCode = ref('')
const expectedAttendance = ref<number | ''>('')

// Step 3: Demographics
const ageRangeMin = ref(18)
const ageRangeMax = ref(45)
const selectedInterests = ref<string[]>(['Family Friendly'])

// Step 4: Sponsorship Tiers
const tiers = ref([
  { name: 'Gold', price: 999, benefits: ['Logo on main screen', 'VIP seating', 'Social media shoutout'], maxSponsors: 1 },
  { name: 'Silver', price: 599, benefits: ['Logo on signage', 'Social media mention'], maxSponsors: 3 },
  { name: 'Bronze', price: 299, benefits: ['Logo in program'], maxSponsors: 5 }
])

const filmOptions = [
  { value: 'top-gun', label: 'Top Gun: Maverick (2022)' },
  { value: 'barbie', label: 'Barbie (2023)' },
  { value: 'oppenheimer', label: 'Oppenheimer (2023)' },
  { value: 'mario', label: 'The Super Mario Bros. Movie (2023)' },
  { value: 'other', label: 'Other / Custom' }
]

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return title.value && filmTitle.value && eventDate.value && startTime.value && endTime.value
    case 2:
      return venueName.value && streetAddress.value && city.value && state.value && zipCode.value && expectedAttendance.value
    case 3:
      return selectedInterests.value.length > 0
    case 4:
      return tiers.value.length > 0 && tiers.value.every(t => t.name && t.price > 0)
    default:
      return true
  }
})

const stepLabels = ['Details', 'Location', 'Demographics', 'Review']

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const toggleInterest = (interest: string) => {
  const index = selectedInterests.value.indexOf(interest)
  if (index === -1) {
    selectedInterests.value.push(interest)
  } else {
    selectedInterests.value.splice(index, 1)
  }
}

const handleSubmit = async (asDraft = false) => {
  const eventData = {
    operator_id: authStore.user?.id,
    title: title.value,
    film_title: filmTitle.value,
    event_date: eventDate.value,
    start_time: startTime.value,
    end_time: endTime.value,
    description: description.value,
    venue_name: venueName.value,
    address: {
      street: streetAddress.value,
      city: city.value,
      state: state.value,
      zip: zipCode.value
    },
    expected_attendance: Number(expectedAttendance.value),
    status: asDraft ? 'draft' : 'published',
    demographics: {
      age_range_min: ageRangeMin.value,
      age_range_max: ageRangeMax.value,
      interests: selectedInterests.value,
      custom_tags: []
    },
    sponsorship_tiers: tiers.value.map((t, i) => ({
      name: t.name,
      price: t.price * 100, // Convert to cents
      benefits: t.benefits,
      max_sponsors: t.maxSponsors,
      display_order: i + 1,
      is_active: true
    }))
  }
  
  const result = await eventsStore.createEvent(eventData as any)
  if (result) {
    router.push(`/events/${result.id}`)
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button 
          class="p-2 text-text-secondary hover:text-primary transition-colors"
          @click="router.push('/events')"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            Create New Event
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark text-sm">
            Provide the essential details sponsors need to evaluate your event
          </p>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <BaseCard>
        <div class="flex justify-between mb-2">
          <span class="text-primary font-bold text-sm uppercase tracking-wide">
            Step {{ currentStep }}: {{ stepLabels[currentStep - 1] }}
          </span>
          <span class="text-text-secondary text-sm">Step {{ currentStep }} of {{ totalSteps }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            class="bg-primary h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          />
        </div>
        <div class="flex justify-between mt-3 text-xs text-text-secondary font-medium">
          <span 
            v-for="(label, index) in stepLabels" 
            :key="label"
            :class="{ 'text-text-main-light dark:text-white font-semibold': currentStep === index + 1 }"
          >
            {{ label }}
          </span>
        </div>
      </BaseCard>
      
      <!-- Step 1: Event Basics -->
      <BaseCard v-if="currentStep === 1">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="material-symbols-outlined text-primary">info</span>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white">Event Basics</h3>
        </div>
        <div class="space-y-6">
          <BaseInput
            v-model="title"
            label="Event Title"
            placeholder="e.g., Summer Movie Night: Top Gun Maverick"
            required
          />
          
          <BaseSelect
            v-model="filmTitle"
            :options="filmOptions"
            label="Select Film/Movie"
            placeholder="Search for a movie or select from list..."
            required
          />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              v-model="eventDate"
              type="date"
              label="Date"
              required
            />
            <div class="flex gap-4">
              <BaseInput
                v-model="startTime"
                type="time"
                label="Start Time"
                required
                class="flex-1"
              />
              <BaseInput
                v-model="endTime"
                type="time"
                label="End Time"
                required
                class="flex-1"
              />
            </div>
          </div>
          
          <BaseTextarea
            v-model="description"
            label="Event Description"
            placeholder="Describe the atmosphere, any pre-show activities, and what makes this event special..."
            hint="Markdown supported"
            :rows="4"
          />
        </div>
      </BaseCard>
      
      <!-- Step 2: Location -->
      <BaseCard v-if="currentStep === 2">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white">Location & Venue</h3>
        </div>
        <div class="space-y-6">
          <BaseInput
            v-model="venueName"
            label="Venue Name"
            placeholder="e.g. Central City Park Amphitheater"
            required
          />
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <BaseInput
                v-model="streetAddress"
                label="Street Address"
                placeholder="Start typing address..."
                icon="search"
                required
              />
            </div>
            <BaseInput
              v-model="zipCode"
              label="Zip Code"
              placeholder="10001"
              required
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              v-model="city"
              label="City"
              placeholder="New York"
              required
            />
            <BaseInput
              v-model="state"
              label="State"
              placeholder="NY"
              required
            />
          </div>
          
          <BaseInput
            v-model="expectedAttendance"
            type="number"
            label="Estimated Attendance / Capacity"
            placeholder="500"
            hint="attendees expected"
            required
          />
        </div>
      </BaseCard>
      
      <!-- Step 3: Demographics -->
      <BaseCard v-if="currentStep === 3">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">groups</span>
            <h3 class="text-lg font-bold text-text-main-light dark:text-white">Audience Demographics</h3>
          </div>
          <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">Crucial for Sponsors</span>
        </div>
        <div class="space-y-8">
          <!-- Age Range -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <p class="text-text-main-light dark:text-gray-200 text-sm font-medium">Target Age Group</p>
              <span class="text-primary font-bold text-sm">{{ ageRangeMin }} - {{ ageRangeMax }} years</span>
            </div>
            <div class="px-2 space-y-2">
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="text-xs text-text-secondary">Min Age</label>
                  <input 
                    v-model="ageRangeMin"
                    type="range" 
                    min="0" 
                    max="100"
                    class="w-full"
                  />
                </div>
                <div class="flex-1">
                  <label class="text-xs text-text-secondary">Max Age</label>
                  <input 
                    v-model="ageRangeMax"
                    type="range" 
                    min="0" 
                    max="100"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Interest Tags -->
          <div>
            <p class="text-text-main-light dark:text-gray-200 text-sm font-medium mb-3">
              Audience Interests (Select all that apply)
            </p>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="interest in interestTags"
                :key="interest"
                type="button"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedInterests.includes(interest)
                    ? 'bg-primary text-white border border-primary'
                    : 'bg-background-light dark:bg-gray-800 text-text-secondary border border-input-border dark:border-gray-600 hover:border-primary hover:text-primary'
                ]"
                @click="toggleInterest(interest)"
              >
                {{ interest }}
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Step 4: Review -->
      <BaseCard v-if="currentStep === 4">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="material-symbols-outlined text-primary">fact_check</span>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white">Review & Publish</h3>
        </div>
        
        <!-- Summary -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Event Details</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Title:</span> {{ title }}</p>
                <p><span class="font-medium">Film:</span> {{ filmTitle }}</p>
                <p><span class="font-medium">Date:</span> {{ eventDate }}</p>
                <p><span class="font-medium">Time:</span> {{ startTime }} - {{ endTime }}</p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Venue</h4>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Name:</span> {{ venueName }}</p>
                <p><span class="font-medium">Address:</span> {{ streetAddress }}, {{ city }}, {{ state }} {{ zipCode }}</p>
                <p><span class="font-medium">Attendance:</span> {{ expectedAttendance }} expected</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Target Audience</h4>
            <div class="flex flex-wrap gap-2">
              <span class="text-sm">{{ ageRangeMin }}-{{ ageRangeMax }} years</span>
              <span class="text-gray-300">|</span>
              <span 
                v-for="interest in selectedInterests" 
                :key="interest"
                class="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded"
              >
                {{ interest }}
              </span>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Sponsorship Tiers</h4>
            <div class="space-y-2">
              <div 
                v-for="tier in tiers" 
                :key="tier.name"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <span class="font-semibold">{{ tier.name }}</span>
                  <span class="text-text-secondary ml-2">({{ tier.maxSponsors }} max)</span>
                </div>
                <span class="font-bold text-primary">${{ tier.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-4">
        <BaseButton 
          v-if="currentStep > 1"
          variant="secondary"
          @click="prevStep"
        >
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </BaseButton>
        <div v-else />
        
        <div class="flex gap-3">
          <BaseButton 
            v-if="currentStep === totalSteps"
            variant="secondary"
            :loading="eventsStore.loading"
            @click="handleSubmit(true)"
          >
            Save as Draft
          </BaseButton>
          
          <BaseButton 
            variant="primary"
            :disabled="!canProceed"
            :loading="eventsStore.loading && currentStep === totalSteps"
            @click="currentStep === totalSteps ? handleSubmit(false) : nextStep()"
          >
            {{ currentStep === totalSteps ? 'Publish Event' : 'Next Step' }}
            <span v-if="currentStep < totalSteps" class="material-symbols-outlined text-sm">arrow_forward</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
