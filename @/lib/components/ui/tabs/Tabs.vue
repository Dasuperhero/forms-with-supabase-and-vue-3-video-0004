<script setup lang="ts">
import { TabsRoot, useForwardPropsEmits } from 'radix-vue'
import type { TabsRootEmits, TabsRootProps } from 'radix-vue'

interface LocalTabsRootProps extends TabsRootProps {}
interface LocalTabsRootEmits extends TabsRootEmits {}

const props = defineProps<LocalTabsRootProps>();
const emits = defineEmits<LocalTabsRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
