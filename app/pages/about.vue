<template>
  <article class="prose dark:prose-invert">
    <ContentRenderer v-if="page" :value="page" />
    <div v-else>Post not found</div>
  </article>
</template>

<script setup>
const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("content").path(route.path).first();
});
</script>