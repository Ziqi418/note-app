<template>
  <header class="p-4 border-b flex justify-between items-center">
    <h1 class="text-xl font-bold">
      <NuxtLink to="/">Todo App</NuxtLink>
    </h1>
    <div v-if="user">
      <UButton @click="handleLogout" color="red" variant="ghost">Logout</UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>