<template>
<div class="cms-page-settings">
  <div class="cms-i-nav">
    <div class="nav-title el-icon-location-outline">系统设置</div>
  </div>

  <div class="s-panel s-panel-sql">
    <h3 class="s-panel-title"><i class="el-icon-sold-out"></i>一. 数据库备份</h3>
    <div class="s-panel-con">
      <p>自动备份脚本会于每日 <span class="num">凌晨三点</span> 进行数据整体备份，</p>
      <p>脚本备份位置为 <span class="num">D:\web\app_cms\backup_mysql</span> 。</p>
      <p>为避免每日备份日志过多占满服务器存储，目前仅保留最新的 <span class="num">5份</span> 备份数据库。</p>
      <p>&nbsp;</p>
      <p>你还可以下载数据库备份到本地：</p>
      <p>
        <el-button type="success" icon="el-icon-download" size="small" @click="downlaodSqlBackup">立即下载数据库备份</el-button>
      </p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'UserCenter',
  data () {
    return {

    }
  },
  methods: {
    downlaodSqlBackup() {
      window.open (window.API_ROUTER.backupSql, "_blank") ;
    }
  },
  mounted() {
    window.$myCommon.checkLogin((data) => { }, () => {});
  }
}
</script>

<style scoped>
.s-panel {
  padding: 20px;
  border-bottom: 1px solid #ccc;
}
.s-panel:last-child {
  border-bottom: none;
}
.s-panel-title {
  font-size: 18px;
  color: #0d7eb3;
  margin: 10px 0 15px;
}
.s-panel-title i {
  margin-right: 5px;
  font-weight: bold;
}
.s-panel-con {
  line-height: 1.8;
  font-size: 13px;
  color: #666;
}
.s-panel-con .num {
  color: #f36e6e;
  font-weight: bold;
}
</style>
