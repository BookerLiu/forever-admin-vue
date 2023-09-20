<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { ThemeSwitcherTheme } from '@layouts/types'

const props = defineProps<{
  themes: ThemeSwitcherTheme[]
}>()

const vuetifyTheme = useTheme()
const {
  state: currentTheme,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(
  props.themes.map(t => t.name),
  { initialValue: vuetifyTheme.global.name.value },
)
const changeTheme = () => {
  vuetifyTheme.global.name.value = getNextThemeName()
}

const getThemeIcon = computedWithControl(vuetifyTheme.global.name, () => {
  const nextThemeIndex = currentThemeIndex.value + 1 === props.themes.length ? 0 : currentThemeIndex.value + 1

  return props.themes[nextThemeIndex].icon
})

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme) {
    vuetifyTheme.global.name.value = theme
  }
})

watch(vuetifyTheme.global.name, val => {
  currentTheme.value = val
  localStorage.setItem('theme', val)
})
</script>

<template>
  <VBtn icon
        variant="text"
        color="default"
        size="small"
        @click="changeTheme">
    <VIcon :icon="getThemeIcon"
           size="24" />
  </VBtn>
</template>
