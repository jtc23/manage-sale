<template>
  <el-submenu index="2">
    <template slot="title">
      <i class="el-icon-service"></i>
      <span slot="title">投资人管理</span>
    </template>
    <el-menu-item-group>
      <template slot="title">投资人管理操作</template>
      <el-menu-item index="2-1" :route="{name: 'CustomerList', params: {cache: false}}">全部投资人</el-menu-item>
      <el-menu-item index="2-2" :route="{name: 'CustomerTypeList', params: {cache: false, status: 'review'}}">
        待审核
      </el-menu-item>
      <el-menu-item index="2-3" :route="{name: 'CustomerTypeList', params: {cache: false, status: 'process'}}">
        进行中
      </el-menu-item>
      <el-menu-item index="2-4" :route="{name: 'CustomerTypeList', params: {cache: false, status: 'success'}}">
        已成功
      </el-menu-item>
      <el-menu-item index="2-5" :route="{name: 'CustomerTypeList', params: {cache: false, status: 'invalid'}}">
        无效
      </el-menu-item>
      <el-menu-item index="2-6" :route="{name: 'CustomerTypeList', params: {cache: false, status: 'conflict'}}">
        冲突
      </el-menu-item>
    </el-menu-item-group>
  </el-submenu>

</template>
