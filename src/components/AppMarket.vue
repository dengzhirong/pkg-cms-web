<template>
<div class="cms-page-applist cms-p-list">
  <div class="cms-i-nav">
    <div class="nav-title el-icon-location-outline">App市场</div>
    <div class="button-group fr">
      <el-button class='' type="warning" round plain size="mini" icon="el-icon-download
" @click='exportCurPageExcel'>导出本页结果</el-button>
      <el-button class='' type="danger" round plain size="mini" icon="el-icon-download
" @click='exportAllExcel'>导出全部</el-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="search-box">
    <el-form :inline="true" class="demo-form-inline" size='mini'>
      <el-form-item>
        <el-input placeholder="应用名称" v-model="searchProps.appName" clearable maxlength='50'></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="应用Id" v-model="searchProps.appId" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchProps.type" placeholder="类型">
          <el-option
            v-for="item in appTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getAppList">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- app表格 -->
  <el-table class="app-table"
    ref="appTable" border
    :data="appListData"
    tooltip-effect="dark"
    style="width: 100%;">
    <el-table-column type="index" label="序号" width="50" align='center' sortable></el-table-column>
    <el-table-column prop="Name" label="App名" width="120" align='center' show-overflow-tooltip>
      <template slot-scope="scope">
        <div class='t-appname'>{{scope.row.Name}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="AppId" label="AppId" align='center' show-overflow-tooltip></el-table-column>
    <el-table-column prop="Type" label="类型" width="90" align="center"
      :filters="[{ text: 'android', value: 'android' }, { text: 'ios', value: 'ios' }]"
      :filter-method="filterTag"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag size="small" v-if="scope.row.Type"
          :type="scope.row.Type == 'android' ? 'danger' :'success'"
          close-transition>{{scope.row.Type}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="ShowWeb" label="是否跳转" width="90" align="center">
      <template slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.ShowWeb"
          :type="scope.row.ShowWeb? 'success' :'info'"
          close-transition>{{scope.row.ShowWeb?'跳转':'不跳转'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="Url" label="跳转地址" align='center' show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.Url || '-'}}
      </template>
    </el-table-column>
    <el-table-column prop="IsUpdate" label="是否强更" width="90" align="center">
      <template slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.IsUpdate"
          :type="scope.row.IsUpdate? 'success' :'info'"
          close-transition>{{scope.row.IsUpdate?'是': '否'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="UpdateUrl" label="跳转地址" align='center' show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.Url || '-'}}
      </template>
    </el-table-column>
    <el-table-column prop="AppPreviewUrl" label="App预览地址" align="center" width="135" show-overflow-tooltip>
      <template slot-scope="scope">
        <a :href="scope.row.AppPreviewUrl" target="_blank" class="a-url">{{scope.row.AppPreviewUrl}}</a>
      </template>
    </el-table-column>
    <el-table-column prop="PushKey" label="推送Key" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column fixed='right' label="操作" width="75">
      <template slot-scope="scope">
        <el-button type="success" plain size='mini'
          v-show="!!scope.row.AppPreviewUrl"
          @click="handlePreviewApp(scope.$index, scope.row)">预览</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 页码 -->
  <div class='i-pagination clearfix'>
    <div class='pagination-info fl'>
    总共<span class='num'> {{totalRecordNum}}</span> 条记录，每页 <span class='num'>{{perPageRecordNum}}</span> 条，总页数：<span class='num'>{{totalPage}}</span>，当前是第 <span class='num'>{{curPage}}</span> 页。</div>
    <el-pagination class='fr'
      background
      @current-change="handlePaginationPageChange"
      layout="prev, pager, next, jumper" :current-page="1"
      :page-count="totalPage||1" :pager-count="5">
    </el-pagination>
  </div>
</div>
</template>
<script>
export default {
  name: 'AppList',
  data () {
    return {
      appTable: null,
      curPage: 1, // 当前页
      totalPage: 10, // 总页数
      totalRecordNum: 1000, // 总条目
      perPageRecordNum: 10, // 每页的条目数
      searchProps: {
        appName: '',
        appId: '',
        type: '',
      },
      appTypes: [
        {label: '全部类型', value: ''},
        {label: 'android', value: 'android'},
        {label: 'ios', value: 'ios'}
      ],
      appListData: []
    }
  },
  computed: {
    hasSelectedItem() {
      var appTable = this.appTable;
      return !appTable || appTable.selection.length < 1;
    }
  },
  methods: {
    filterTag(value, row, column) { // 筛选标签
      return row[ column['property'] ] == value;
    },
    handlePaginationPageChange(val) { // 导航页码切换
      this.curPage = val;
      this.getAppList();
    },
    handlePreviewApp(index, row) { // 跳转预览网页
      let url = row.AppPreviewUrl;
      if(!url) { return; }
      window.open (url, "_blank") ;
    },
    getAppList() {
      let searchProps = this.searchProps || {};
      let {page, pageSize, appName, appId, type} = searchProps;
      let options = {
        page: this.curPage,
        pageSize: this.perPageRecordNum,
        appName, appId, type
      };
      window.$cmsApi.getAppListOfMarket(options, (res) => {
        let data = res.data || {};
        let userCountData = data.count || {};
        this.appListData = this._formatAppList(data.list || []);
        this.totalPage = userCountData.pageCount || 1;
        this.totalRecordNum = userCountData.totalCount || 0;
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },
    _formatAppItem(item) {
      item.IsUpdateStr = item.ShowWeb ? '是' : '否';
      item.IsUpdateStr = item.IsUpdate ? '是' : '否';
      return item;
    },
    _formatAppList(list=[]) {
      _.each(list, (item, index) => {
        item = this._formatAppItem(item);
      });
      return list;
    },

    exportCurPageExcel() {
      let searchProps = this.searchProps || {};
      let {page, pageSize, appName, appId, type} = searchProps;
      let options = {
        page, pageSize, appName, appId, type
      };
      window.$cmsApi.exportAppMarketExcel(options);
    },
    exportAllExcel() {
      let options = {
        pageSize: 1000,
        page: 1
      };
      window.$cmsApi.exportAppMarketExcel(options);
    },
  },
  mounted() {
    this.appTable = this.$refs.appTable;
    window.$myCommon.checkLogin((data) => {
      this.getAppList();
    }, () => {});
  }
}
</script>

<style scoped>
</style>
