export const useAppStore = defineStore('app-store', () => {
  const collapsed = ref(false)

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return {
    collapsed,
    toggleCollapsed,
  }
})
