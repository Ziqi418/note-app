<template>
  <div>
    <h1 class="text-2xl font-bold text-center mb-4">Login</h1>
    <AuthLoginForm />
    <p class="text-center mt-4">
      Don't have an account? 
      <NuxtLink to="/register" class="text-blue-500 hover:underline">Register</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>