<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  disabled: false,
  rows: 4
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const textareaClasses = computed(() => [
  'w-full rounded-lg border bg-background-light dark:bg-gray-800 text-text-main-light dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary p-4 placeholder:text-text-secondary transition-colors resize-none',
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
    <textarea
      v-model="inputValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="textareaClasses"
    />
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </label>
</template>
