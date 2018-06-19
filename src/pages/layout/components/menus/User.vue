<template>
  <el-submenu index="4">
    <template slot="title">
      <i class="el-icon-news"></i>
      <span>注册人管理</span>
    </template>
    <el-menu-item-group>
      <template slot="title">系统注册人操作</template>
      <el-menu-item index="4-1" :route="{name: 'UserList'}">已推荐的注册人</el-menu-item>
      <el-menu-item index="4-2" :route="{name: 'AllUserList'}">所有注册人</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</template>
