<template>
  <div v-if="!post">
    <h1>Document not found (404)</h1>
    <p>This blog post could not be found.</p>
  </div>
  <div v-else class="grid grid-cols-6 gap-16">
    <article
      :class="[
        'prose dark:prose-invert max-w-none',
        'prose-pre:bg-white dark:prose-pre:bg-gray-800',
        'prose-pre:text-gray-700 dark:prose-pre:text-gray-300',
        hasToc ? 'col-span-4 md:col-span-4' : 'col-span-6',
      ]"
    >
      <ContentRenderer :value="post">
        <template #empty>
          <p>Post not found</p>
        </template>
      </ContentRenderer>
    </article>

    <aside v-if="hasToc" class="hidden md:col-span-2 md:block not-prose sticky top-8 h-fit">
      <div class="font-semibold mb-2">Table of Contents</div>
      <nav>
        <TocLinks :links="post.body.toc.links" :active-id="activeId" />
      </nav>
    </aside>
  </div>
</template>

<script setup>
const activeId = ref(null);
onMounted(() => {
  let elements = [];
  const callback = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id;
        break;
      }
    }
  };
  const observer = new IntersectionObserver(callback, {
    root: null,
    threshold: 0.5,
  });
  setTimeout(() => {
    elements = document.querySelectorAll("h2", "h3");

    for (const element of elements) {
      observer.observe(element);
    }
  }, 150);

  onBeforeUnmount(() => {
    for (const element of elements) {
      observer.unobserve(element);
    }
  });
});
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
