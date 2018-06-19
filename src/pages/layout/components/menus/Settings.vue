<template>
  <el-submenu index="6">
    <template slot="title">
      <i class="el-icon-setting"></i>
      <span slot="title">基础设置</span>
    </template>
    <el-menu-item-group>
      <template slot="title">基础设置</template>
      <el-menu-item index="6-1" :route="{name: 'UserAdd'}">添加管理员</el-menu-item>
      <el-menu-item index="6-2" :route="{name: 'Profile'}">管理员信息编辑</el-menu-item>
      <el-menu-item index="6-3" :route="{name: 'DashBoard'}">推荐信息分布</el-menu-item>
      <el-menu-item index="6-4" :route="{name: 'Setting'}">系统设置</el-menu-item>
      <el-menu-item index="6-5" :route="{name: 'About'}">关于</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</template>
