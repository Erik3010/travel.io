<template>
  <header
    class="flex justify-between border-b border-gray-200 p-4 sticky top-0 bg-white"
  >
    <h1 class="font-bold text-2xl">
      <span class="text-primary-base">Travel</span>
      <span class="text-secondary">.io</span>
    </h1>
    <div class="flex space-x-3">
      <IconButton>
        <SearchIcon />
      </IconButton>
      <IconButton>
        <BookmarkIcon />
      </IconButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconButton from "@/components/Common/IconButton.vue";

import SearchIcon from "@/components/Icon/Search.vue";
import BookmarkIcon from "@/components/Icon/Bookmark.vue";
</script>
