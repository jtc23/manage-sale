<template>
  <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-message"></i>
      <span slot="title"><el-badge is-dot class="menu-badge" :hidden="!messages">消息中心</el-badge></span>
    </template>
    <el-menu-item-group>
      <template slot="title">消息管理中心</template>
      <el-menu-item index="1-1" :route="{name: 'MessageList'}" @click="handleViewMessage">全部消息
      </el-menu-item>
      <el-menu-item index="1-2" :route="{name: 'MessageSingleList', params: {type: 'recommend'}}">
        <el-badge is-dot hidden class="menu-badge">推荐消息</el-badge>
      </el-menu-item>
      <el-menu-item index="1-3" :route="{name: 'MessageSingleList', params: {type: 'reward'}}">
        <el-badge is-dot hidden class="menu-badge">奖金消息</el-badge>
      </el-menu-item>
      <el-menu-item index="1-4" :route="{name: 'MessageSingleList', params: {type: 'cash'}}">
        <el-badge is-dot hidden class="menu-badge">红包消息</el-badge>
      </el-menu-item>
      <el-menu-item index="1-5" :route="{name: 'MessageSingleList', params: {type: 'other'}}">
        <el-badge is-dot hidden class="menu-badge">其他消息</el-badge>
      </el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'messages'
      ])
    },
    methods: {
      handleViewMessage() {
        this.$emit("update:hasMessage", false)
      }
    }
  }
</script>
