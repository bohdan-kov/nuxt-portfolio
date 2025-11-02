<template>
  <div v-if="post" class="grid grid-cols-6 gap-16">
    <article
      :class="[
        'prose dark:prose-invert max-w-none',
        'prose-pre:bg-white dark:prose-pre:bg-gray-800',
        'prose-pre:text-gray-700 dark:prose-pre:text-gray-300',
        hasToc ? 'col-span-4' : 'col-span-6',
      ]"
    >
      <ContentRenderer :value="post">
        <template #empty>
          <p>Post not found</p>
        </template>
      </ContentRenderer>
    </article>

    <aside v-if="hasToc" class="col-span-2 not-prose sticky top-8 h-fit">
      <div class="font-semibold mb-2">Table of Contents</div>
      <nav>
        <TocLinks :links="post.body.toc.links" />
      </nav>
    </aside>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join("/")
  : route.params.slug;

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("content").path(`/blog/${slug}`).first()
);

const hasToc = computed(() => post.value?.meta?.toc === true);

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogImage: () => post.value?.meta?.image,
});
</script>
