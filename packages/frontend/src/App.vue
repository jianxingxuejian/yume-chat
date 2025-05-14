<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN, type GlobalThemeOverrides } from 'naive-ui'
import { NaiveProvider } from '@/components/'

const themeOverrides: GlobalThemeOverrides = {}
</script>

<style lang="scss"></style>
