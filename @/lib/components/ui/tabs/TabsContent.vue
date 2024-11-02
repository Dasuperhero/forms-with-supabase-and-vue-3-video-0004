<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsContent } from 'radix-vue'
import { cn } from '@/lib/utils'

interface TabsContentProps {
  class?: HTMLAttributes['class'];
  // Add other properties if necessary
}

// Use the interface in defineProps
const props = defineProps<TabsContentProps>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsContent
    :class="cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </TabsContent>
</template>
