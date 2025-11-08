<template>
  <BlogPosts v-slot="{ posts }" :limit="limit">
    <div v-for="post in posts" :key="post.id">
      <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
    </div>
  </BlogPosts>
</template>

<script lang="ts" setup>
defineProps({
  limit: {
    type: Number,
    default: null,
  },
});
</script>

<style></style>
