<template>
  <el-submenu index="3">
    <template slot="title">
      <i class="el-icon-sold-out"></i>
      <span slot="title">提现管理</span>
    </template>
    <el-menu-item-group>
      <template slot="title">提现相关操作</template>
      <el-menu-item index="3-1" :route="{name: 'MoneyList', params: {cache: false}}">全部佣金</el-menu-item>
      <el-menu-item index="3-2" :route="{name: 'TypeMoneyList', params: {cache: false, type: 'cash'}}">红包管理
      </el-menu-item>
      <el-menu-item index="3-3" :route="{name: 'TypeMoneyList', params: {cache: false, type: 'reward'}}">奖金管理
      </el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</template>
