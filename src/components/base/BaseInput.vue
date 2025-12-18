<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'tel'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputClasses = computed(() => [
  'w-full rounded-lg border bg-background-light dark:bg-gray-800 text-text-main-light dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 px-4 placeholder:text-text-secondary transition-colors',
  props.icon ? 'pl-12' : '',
  props.error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
    : 'border-input-border dark:border-gray-600'
])
</script>

<template>
  <label class="block">
    <div v-if="label" class="flex items-center justify-between pb-2">
      <p class="text-text-main-light dark:text-gray-200 text-sm font-medium">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </p>
      <span v-if="hint" class="text-xs text-text-secondary">{{ hint }}</span>
    </div>
    <div class="relative">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span class="material-symbols-outlined text-text-secondary">{{ icon }}</span>
      </div>
      <input
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </label>
</template>
