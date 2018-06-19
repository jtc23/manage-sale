<template>
  <el-submenu index="5">
    <template slot="title">
      <i class="el-icon-tickets"></i>
      <span slot="title">规则管理</span>
    </template>
    <el-menu-item-group>
      <template slot="title">规则管理操作</template>
      <el-menu-item index="5-1" :route="{name: 'ArticleAdd'}">添加规则</el-menu-item>
      <el-menu-item index="5-2" :route="{name: 'ArticleList'}">所有规则</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</template>
