<template>
  <div>
    <h1 class="text-2xl font-bold text-center mb-4">Register</h1>
    <AuthRegisterForm />
    <p class="text-center mt-4">
      Already have an account? 
      <NuxtLink to="/login" class="text-blue-500 hover:underline">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>