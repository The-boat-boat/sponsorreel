<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: Option[]
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option...',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value !== null) {
      emit('update:modelValue', value)
    }
  }
})

const selectClasses = computed(() => [
  'w-full appearance-none rounded-lg border bg-background-light dark:bg-gray-800 text-text-main-light dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 px-4 pr-10 transition-colors',
  props.error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
    : 'border-input-border dark:border-gray-600'
])
</script>

<template>
  <label class="block">
    <div v-if="label" class="pb-2">
      <p class="text-text-main-light dark:text-gray-200 text-sm font-medium">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </p>
    </div>
    <div class="relative">
      <select
        v-model="inputValue"
        :required="required"
        :disabled="disabled"
        :class="selectClasses"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
        <span class="material-symbols-outlined">expand_more</span>
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </label>
</template>
