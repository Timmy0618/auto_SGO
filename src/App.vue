<script lang="ts" setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>Auto SGO</el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>
