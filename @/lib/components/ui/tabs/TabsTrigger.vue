<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsTrigger, useForwardProps } from 'radix-vue'
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

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    v-bind="forwardedProps"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      props.class,
    )"
  >
    <span class="truncate">
      <slot />
    </span>
  </TabsTrigger>
</template>
