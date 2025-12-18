<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { interestTags } from '@/services/mock/mockData'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { BaseButton, BaseInput, BaseTextarea, BaseSelect, BaseCard } from '@/components/base'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const eventId = route.params.id as string

// Form fields
const title = ref('')
const filmTitle = ref('')
const eventDate = ref('')
const startTime = ref('')
const endTime = ref('')
const description = ref('')
const venueName = ref('')
const streetAddress = ref('')
const city = ref('')
const state = ref('')
const zipCode = ref('')
const expectedAttendance = ref<number | ''>('')
const status = ref<'draft' | 'published'>('draft')
const selectedInterests = ref<string[]>([])
const ageRangeMin = ref(18)
const ageRangeMax = ref(45)

const filmOptions = [
  { value: 'top-gun', label: 'Top Gun: Maverick (2022)' },
  { value: 'barbie', label: 'Barbie (2023)' },
  { value: 'oppenheimer', label: 'Oppenheimer (2023)' },
  { value: 'mario', label: 'The Super Mario Bros. Movie (2023)' },
  { value: 'other', label: 'Other / Custom' }
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' }
]

// Load event data
const loadEvent = async () => {
  await eventsStore.fetchEvent(eventId)
  
  if (eventsStore.currentEvent) {
    const event = eventsStore.currentEvent
    title.value = event.title
    filmTitle.value = event.film_title
    eventDate.value = event.event_date
    startTime.value = event.start_time
    endTime.value = event.end_time
    description.value = event.description
    venueName.value = event.venue_name
    streetAddress.value = event.address.street
    city.value = event.address.city
    state.value = event.address.state
    zipCode.value = event.address.zip
    expectedAttendance.value = event.expected_attendance
    status.value = event.status as 'draft' | 'published'
    
    if (event.demographics) {
      selectedInterests.value = [...event.demographics.interests]
      ageRangeMin.value = event.demographics.age_range_min
      ageRangeMax.value = event.demographics.age_range_max
    }
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

const handleSubmit = async () => {
  const eventData = {
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
    status: status.value,
    demographics: {
      age_range_min: ageRangeMin.value,
      age_range_max: ageRangeMax.value,
      interests: selectedInterests.value,
      custom_tags: []
    }
  }
  
  const result = await eventsStore.updateEvent(eventId, eventData as any)
  if (result) {
    router.push(`/events/${eventId}`)
  }
}

onMounted(() => {
  loadEvent()
})
</script>

<template>
  <DefaultLayout>
    <!-- Loading State -->
    <div v-if="eventsStore.loading && !eventsStore.currentEvent" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
    </div>
    
    <div v-else class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button 
          class="p-2 text-text-secondary hover:text-primary transition-colors"
          @click="router.push(`/events/${eventId}`)"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main-light dark:text-text-main-dark">
            Edit Event
          </h1>
          <p class="text-text-sub-light dark:text-text-sub-dark text-sm">
            Update your event details
          </p>
        </div>
      </div>
      
      <!-- Event Basics -->
      <BaseCard>
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="material-symbols-outlined text-primary">info</span>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white">Event Basics</h3>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              v-model="title"
              label="Event Title"
              placeholder="e.g., Summer Movie Night"
              required
            />
            <BaseSelect
              v-model="status"
              :options="statusOptions"
              label="Status"
            />
          </div>
          
          <BaseSelect
            v-model="filmTitle"
            :options="filmOptions"
            label="Select Film/Movie"
            placeholder="Search for a movie..."
          />
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseInput
              v-model="eventDate"
              type="date"
              label="Date"
              required
            />
            <BaseInput
              v-model="startTime"
              type="time"
              label="Start Time"
              required
            />
            <BaseInput
              v-model="endTime"
              type="time"
              label="End Time"
              required
            />
          </div>
          
          <BaseTextarea
            v-model="description"
            label="Event Description"
            placeholder="Describe the event..."
            :rows="4"
          />
        </div>
      </BaseCard>
      
      <!-- Location -->
      <BaseCard>
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white">Location & Venue</h3>
        </div>
        <div class="space-y-6">
          <BaseInput
            v-model="venueName"
            label="Venue Name"
            placeholder="e.g. Central Park"
            required
          />
          
          <BaseInput
            v-model="streetAddress"
            label="Street Address"
            placeholder="123 Main St"
            required
          />
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BaseInput
              v-model="city"
              label="City"
              placeholder="New York"
              required
              class="col-span-2"
            />
            <BaseInput
              v-model="state"
              label="State"
              placeholder="NY"
              required
            />
            <BaseInput
              v-model="zipCode"
              label="Zip Code"
              placeholder="10001"
              required
            />
          </div>
          
          <BaseInput
            v-model="expectedAttendance"
            type="number"
            label="Expected Attendance"
            placeholder="500"
            required
          />
        </div>
      </BaseCard>
      
      <!-- Demographics -->
      <BaseCard>
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span class="material-symbols-outlined text-primary">groups</span>
          <h3 class="text-lg font-bold text-text-main-light dark:text-white">Target Audience</h3>
        </div>
        <div class="space-y-6">
          <div>
            <div class="flex justify-between items-center mb-4">
              <p class="text-sm font-medium text-text-main-light dark:text-white">Age Range</p>
              <span class="text-primary font-bold text-sm">{{ ageRangeMin }} - {{ ageRangeMax }} years</span>
            </div>
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="text-xs text-text-secondary">Min Age</label>
                <input v-model="ageRangeMin" type="range" min="0" max="100" class="w-full" />
              </div>
              <div class="flex-1">
                <label class="text-xs text-text-secondary">Max Age</label>
                <input v-model="ageRangeMax" type="range" min="0" max="100" class="w-full" />
              </div>
            </div>
          </div>
          
          <div>
            <p class="text-sm font-medium text-text-main-light dark:text-white mb-3">Interests</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="interest in interestTags"
                :key="interest"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  selectedInterests.includes(interest)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
                @click="toggleInterest(interest)"
              >
                {{ interest }}
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 pt-4">
        <BaseButton 
          variant="secondary"
          @click="router.push(`/events/${eventId}`)"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          variant="primary"
          :loading="eventsStore.loading"
          @click="handleSubmit"
        >
          Save Changes
        </BaseButton>
      </div>
    </div>
  </DefaultLayout>
</template>
