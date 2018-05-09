<template>
<div class="cms-page-applist cms-p-list">
  <div class="cms-i-nav">
    <div class="nav-title el-icon-location-outline">App列表</div>
    <div class="button-group fr">
      <!-- <el-tooltip effect="dark" content="刷新">
        <el-button type="primary" icon="el-icon-refresh" circle></el-button>
      </el-tooltip> -->
      <el-button class='' type="success" round size="mini"
        @click="handleEditApp(-1, {}, true)" v-if="!state.isCustom">添加app</el-button>
      <el-button class='' type="warning" round plain size="mini" icon="el-icon-download" @click='exportCurPageExcel'>导出本页结果</el-button>
      <el-button class='' type="danger" round plain size="mini" icon="el-icon-download" @click='exportAllExcel'>导出全部</el-button>
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
            :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间:">
        <el-date-picker
          v-model="searchProps.startDate" align="center" type="date" placeholder="开始日期" :picker-options="pickerStartDateOptions"
          format="yyyy-MM-dd" value-format="timestamp">
        </el-date-picker><span> - </span>
        <el-date-picker
          v-model="searchProps.endDate" align="center" type="date" placeholder="结束日期" :picker-options="pickerEndDateOptions"
          format="yyyy-MM-dd" value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchProps.showWeb" placeholder="是否跳转">
          <el-option
            v-for="item in appRedirectStatus"
            :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select filterable clearable v-model="searchProps.authorId" placeholder="开发者">
          <el-option
            v-for="item in state.devUserList"
            :key="item.Id" :label="item.NickName + '                       ' +item.UserName" :value="item.Id">
            <span style="float: left;">{{ item.NickName }}</span>
            <span style="float: right;margin-left: 10px;color: #67c23b;font-size: 12px;">{{ item.UserName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select filterable clearable v-model="searchProps.custId" placeholder="所属客户">
          <el-option
            v-for="item in state.custUserList"
            :key="item.Id" :label="item.NickName + '                       ' +item.UserName" :value="item.Id">
            <span style="float: left;">{{ item.NickName }}</span>
            <span style="float: right;margin-left: 10px;color: #67c23b;font-size: 12px;">{{ item.UserName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchProps.isPublish" placeholder="是否已发布">
          <el-option
            v-for="item in isPublishOptions"
            :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchAppList">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 批量操作按钮 -->
  <div class="batch-btns-box">
    <el-row>
      <el-button round size="mini" @click="toggleSelection([], 'selectAll')">全选</el-button>
      <el-button round size="mini" @click="toggleSelection([], 'cancelAll')">取消选择</el-button>
      <el-button type="primary" round size="mini" :disabled="!!hasSelectedItem"
        @click="showBatchShowWebPop">批量跳转/不跳转</el-button>
      <el-button type="primary" round size="mini" :disabled="!!hasSelectedItem"
        @click="showBatchEditUrlPop">一键修改跳转地址</el-button>
      <el-button type="primary" round size="mini" :disabled="!!hasSelectedItem"
        v-if="!state.isCustom" @click="showBatchEditCustomPop">一键分配客户</el-button>
      <el-button type="primary" round size="mini" :disabled="!!hasSelectedItem"
        v-if="!state.isCustom" @click="showBatchEditPublishPop">一键发布到App市场</el-button>
      <el-button type="danger" round size="mini" :disabled="!!hasSelectedItem"
        v-if="!state.isCustom" @click="showBatchPop">批量修改属性</el-button>
      <el-button type="success" round size="mini"
        v-if="!state.isCustom" disabled>批量查询上架状态</el-button>
    </el-row>
  </div>

  <!-- app表格 -->
  <el-table class="app-table"
    ref="appTable" border :data="appListData"
    tooltip-effect="dark" style="width: 100%; text-align:center;"
    @selection-change="handleSelectionChange">
    <el-table-column fixed type="selection" width="35" label="选择"></el-table-column>
    <el-table-column prop="Name" label="App名" width="140" align="center" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        <div class='t-appname' @click="handleShowAppDetail(scope.$index, scope.row)">{{scope.row.Name}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="AppId" label="AppId" align="center" width="180" sortable show-overflow-tooltip></el-table-column>
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
    <el-table-column prop="ShowWebStr" label="是否跳转" width="90" align="center"
      :filters="[{ text: '是', value: '是' }, { text: '否', value: '否' }]"
      :filter-method="filterTag"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.ShowWebStr"
          :type="scope.row.ShowWebStr == '是' ? 'success' :'info'"
          close-transition>{{scope.row.ShowWebStr =='是' ? '跳转' : '不跳转'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="Url" label="跳转地址" show-overflow-tooltip align="center"></el-table-column>
    <el-table-column prop="IsUpdateStr" label="是否强更" width="90" align="center"
      :filters="[{ text: '是', value: '是' }, { text: '否', value: '否' }]"
      :filter-method="filterTag"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.IsUpdateStr"
          :type="scope.row.IsUpdateStr == '是' ? 'success' :'info'"
          close-transition>{{scope.row.IsUpdateStr == '是'? '是' : '否'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="UpdateUrl" label="强更地址" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column prop="PushKey" label="推送Key" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column prop="AppPreviewUrl" label="App预览地址" align="center" width="135" show-overflow-tooltip>
      <template slot-scope="scope">
        <a :href="scope.row.AppPreviewUrl" target="_blank" class="a-url">{{scope.row.AppPreviewUrl}}</a>
      </template>
    </el-table-column>
    <el-table-column prop="IsPublish" label="已发布" width="90" align="center" v-if="!state.isCustom"
      :filters="[{ text: '是', value: 1 }, { text: '否', value: 0 }]"
      :filter-method="filterTag"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag size="mini"
          :type="scope.row.IsPublish? 'success' :'info'"
          close-transition>{{scope.row.IsPublish? '是' : '否'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="AuthorName" label="创建人员" align="center" width="101" sortable show-overflow-tooltip></el-table-column>
    <el-table-column prop="CustName" label="所属客户" align="center" width="101" sortable show-overflow-tooltip></el-table-column>
    <el-table-column prop="IsPublish" label="应用数据" width="90" align="center">
      <template slot-scope="scope">
        <a :href="appDataPreviewUrl + scope.row.AppId" target="_blank"
          style=" color: #a0cfff; font-size: 13px;">应用数据</a>
      </template>
    </el-table-column>
    <el-table-column label="操作" :width="state.isCustom ? 100 : 160" fixed="right">
      <template slot-scope="scope">
      <el-tooltip effect="dark" content="删除" v-if="!state.isCustom">
        <el-button type="danger" icon="el-icon-delete" circle
          @click="handleDeleteApp(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="编辑">
        <el-button type="primary" icon="el-icon-edit" circle
          @click="handleEditApp(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="点击发布到App市场" v-if="!scope.row.IsPublish && !state.isCustom">
        <el-button type="info" icon="el-icon-upload" circle
          @click="handlePublishApp(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="点击撤销发布" v-if="scope.row.IsPublish && !state.isCustom">
        <el-button type="info" icon="el-icon-sold-out" circle
          @click="handleUnPublishApp(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-button type="success" size='mini'
        v-show="!!scope.row.AppPreviewUrl" plain
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

  <!-- app修改弹窗 -->
  <el-dialog class='i-appmodify-pop'
    :title="isCreateApp ? '添加App' : '编辑App'" :top="isCreateApp ? '10vh' : '5vh'"
    :rules="appModifyRules"
    :before-close="handlerCloseModifyAppPop"
    :visible.sync="isShowAppEditDialog"
    width="380" center>
    <el-form ref="appModifyForm" :model="appModifyForm" label-position="left" label-width="110px" size='mini'>
      <el-form-item label="app名称：" required>
        <el-input v-model="appEditInfo.Name" placeholder='请输入app名称'
         :disabled="state.isCustom" clearable></el-input>
      </el-form-item>
      <el-form-item label="appId：" required>
        <el-input v-model="appEditInfo.AppId" placeholder='请输入appId(不可重复)'
         :disabled="state.isCustom" clearable></el-input>
      </el-form-item>
      <el-form-item label="app类型：">
        <el-radio v-model="appEditInfo.Type" label="android" :disabled="state.isCustom">android</el-radio>
        <el-radio v-model="appEditInfo.Type" label="ios" :disabled="state.isCustom">ios</el-radio>
      </el-form-item>
      <el-form-item label="App预览地址：" prop="AppPreviewUrl">
        <el-input v-model="appEditInfo.AppPreviewUrl" placeholder="请输入App预览地址"
          :disabled="state.isCustom" clearable></el-input>
      </el-form-item>
      <el-form-item label="开启跳转：" label-width="85px" class='clearfix'>
        <el-switch v-model="appEditInfo.ShowWeb" :active-value="1" :inactive-value="0"></el-switch>
        <el-input v-model="appEditInfo.Url" prop="Url" style="width:210px;margin-left:5px;" placeholder="请输入跳转地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="强制更新：" label-width="85px" class='clearfix'>
        <el-switch v-model="appEditInfo.IsUpdate" :active-value="1" :inactive-value="0"></el-switch>
        <el-input v-model="appEditInfo.UpdateUrl" prop="UpdateUrl" style="width:210px;margin-left:5px;" placeholder="请输入强制更新地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="极光推送key：">
        <el-input v-model="appEditInfo.PushKey" placeholder="请输入极光推送key" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属客户：" v-if="!isCreateApp">
        <el-select filterable v-model="appEditInfo.CustId"
         :disabled="state.isCustom" clearable placeholder="请选择">
          <el-option
            v-for="item in state.custUserList"
            :key="item.Id" :label="item.NickName + '                                              ' +item.UserName" :value="item.Id">
            <span style="float: left;">{{ item.NickName }}</span>
            <span style="float: right;margin-left: 10px;color: #67c23b;font-size: 12px;">{{ item.UserName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布到App市场：" label-width="130px" class='clearfix'>
        <el-switch v-model="appEditInfo.IsPublish"
         :active-value="1" :inactive-value="0" :disabled="state.isCustom"></el-switch>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="appEditInfo.Remark" type="textarea" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowAppEditDialog=false">取 消</el-button>
      <el-button type="primary" @click="submitAppEditInfo">提 交</el-button>
    </span>
  </el-dialog>

  <!-- app详情弹窗 -->
  <el-dialog class='i-appmodify-pop'
    title="App信息" :top="'5vh'"
    :visible.sync="isShowAppDetailDialog"
    width="380" center>
    <div class='clearfix'>
      <el-button type="danger" icon="el-icon-edit" size='mini' class='fr'
        style="margin:-9px 0 5px;" @click="handleEditApp(appDetailInfo.index, appDetailInfo)">编辑</el-button>
    </div>
    <ul class='i-appmodify-list'>
      <li><span class='i-m-tag'>app名称：</span><span class='i-m-val'>{{appDetailInfo.Name}}</span></li>
      <li><span class='i-m-tag'>appId：</span><span class='i-m-val'>{{appDetailInfo.AppId}}</span></li>
      <li><span class='i-m-tag'>app类型：</span><span class='i-m-val'>{{appDetailInfo.Type}}</span></li>
      <li><span class='i-m-tag'>App预览地址：</span><span class='i-m-val'>{{appDetailInfo.AppPreviewUrl}}</span></li>
      <!-- <li><span class='i-m-tag'>状态：</span><span class='i-m-val'>{{appDetailInfo.StatusName}}</span></li> -->
      <li><span class='i-m-tag'>开启跳转：</span><span class='i-m-val'>{{appDetailInfo.ShowWebStr}}</span></li>
      <li><span class='i-m-tag'>跳转地址：</span><span class='i-m-val'>{{appDetailInfo.Url}}</span></li>
      <li><span class='i-m-tag'>强制更新：</span><span class='i-m-val'>{{appDetailInfo.IsUpdateStr}}</span></li>
      <li><span class='i-m-tag'>强制更新地址：</span><span class='i-m-val'>{{appDetailInfo.UpdateUrl}}</span></li>
      <li><span class='i-m-tag'>极光推送key：</span><span class='i-m-val'>{{appDetailInfo.PushKey}}</span></li>
      <li><span class='i-m-tag'>所属客户：</span><span class='i-m-val'>{{appDetailInfo.CustName}}</span></li>
      <li><span class='i-m-tag'>开发者：</span><span class='i-m-val'>{{appDetailInfo.AuthorName}}</span></li>
      <li><span class='i-m-tag'>发布到App市场：</span><span class='i-m-val'>{{appDetailInfo.IsPublish ? '是' : '否'}}</span></li>
      <li><span class='i-m-tag'>应用数据：</span><a class='i-m-val' :href="appDataPreviewUrl + appDetailInfo.AppId" target="_blank">
        点击查看
      </a></li>
      <li><span class='i-m-tag'>备注：</span><span class='i-m-val'>{{appDetailInfo.Remark}}</span></li>
      <li><span class='i-m-tag'>创建时间：</span><span class='i-m-val'>
        {{appDetailInfo.CreateTime ? new Date(appDetailInfo.CreateTime).toLocaleDateString() : ''}}
      </span></li>
      <li><span class='i-m-tag'>更新时间：</span><span class='i-m-val'>
        {{appDetailInfo.UpdateTime ? new Date(appDetailInfo.UpdateTime).toLocaleDateString() : ''}}
      </span></li>
    </ul>
  </el-dialog>

  <!-- app批量修改弹窗 -->
  <el-dialog class='i-appmodify-pop'
    title="批量修改app属性" top="15vh"
    :visible.sync="isShowBatchEditDialog"
    width="380" center>
    <el-form ref="appBatchModifyForm" label-position="left" label-width="110px" size='mini'>
      <el-form-item label="App预览地址：">
        <el-input v-model="appBatchEditInfo.AppPreviewUrl" placeholder="请输入App预览地址(不修改勿填写)" clearable></el-input>
      </el-form-item>
      <el-form-item label="开启跳转：" label-width="85px" class='clearfix'>
        <el-switch v-model="appBatchEditInfo.ShowWeb" :active-value="1" :inactive-value="0"></el-switch>
        <el-input v-model="appBatchEditInfo.Url" style="width:210px;margin-left:5px;" placeholder="请输入跳转地址(不修改勿填写)" clearable></el-input>
      </el-form-item>
      <el-form-item label="强制更新：" label-width="85px" class='clearfix'>
        <el-switch v-model="appBatchEditInfo.IsUpdate" :active-value="1" :inactive-value="0"></el-switch>
        <el-input v-model="appBatchEditInfo.UpdateUrl" style="width:210px;margin-left:5px;" placeholder="请输入强制更新地址(不修改勿填写)" clearable></el-input>
      </el-form-item>
      <el-form-item label="极光推送key：">
        <el-input v-model="appBatchEditInfo.PushKey" placeholder="请输入极光推送key(不修改勿填写)" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属客户：" v-if="!isCreateApp">
        <el-select filterable clearable v-model="appBatchEditInfo.CustId" placeholder="请选择(不修改勿填写)">
          <el-option
            v-for="item in state.custUserList"
            :key="item.Id" :label="item.NickName + '                                                                     ' +item.UserName" :value="item.Id">
            <span style="float: left;">{{ item.NickName }}</span>
            <span style="float: right;margin-left: 10px;color: #67c23b;font-size: 12px;">{{ item.UserName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布到App市场：" label-width="130px" class='clearfix'>
        <el-switch v-model="appEditInfo.IsPublish" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="appBatchEditInfo.Remark" type="textarea" :rows="2"
          placeholder="备注(不修改勿填写)"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowBatchEditDialog=false">取 消</el-button>
      <el-button type="primary" @click="submitAppBatchEditInfo">批量修改</el-button>
    </span>
  </el-dialog>

  <!-- app批量修改跳转弹窗 -->
  <el-dialog class='i-appmodify-pop'
    title="批量修改跳转/不跳转" top="15vh"
    :visible.sync="isShowBatchUrlDialog"
    width="380" center>
    <el-form label-position="left" label-width="110px" size='mini'>
      <el-form-item label="开启跳转：" label-width="85px" class='clearfix'>
        <el-radio v-model="batchIsShowWeb" :label="false">不跳转</el-radio>
        <el-radio v-model="batchIsShowWeb" :label="true">跳转</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowBatchUrlDialog=false" size="mini" round>取 消</el-button>
      <el-button type="primary" @click="saveBatchShowWeb" size="mini" round>批量修改</el-button>
    </span>
  </el-dialog>

  <!-- app批量修改分配用户 -->
  <el-dialog class='i-appmodify-pop'
    title="批量修改分配用户" top="25vh"
    :visible.sync="isShowBatchCustomDialog"
    width="380" center>
    <el-form label-position="left" label-width="110px" size='mini'>
      <el-form-item>
        <el-select filterable clearable v-model="batchCustomId" placeholder="所属客户">
          <el-option
            v-for="item in state.custUserList"
            :key="item.Id" :label="item.NickName + '                                                                     ' +item.UserName" :value="item.Id">
            <span style="float: left;">{{ item.NickName }}</span>
            <span style="float: right;margin-left: 10px;color: #67c23b;font-size: 12px;">{{ item.UserName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowBatchCustomDialog=false" size="mini" round>取 消</el-button>
      <el-button type="primary" @click="saveBatchCustom" size="mini" round>批量修改</el-button>
    </span>
  </el-dialog>

  <!-- app批量发布到App市场 -->
  <el-dialog class='i-appmodify-pop'
    title="批量发布到App市场：" top="15vh"
    :visible.sync="isShowBatchPublishDialog"
    width="380" center>
    <el-form label-position="left" label-width="110px" size='mini'>
      <el-form-item label="" label-width="85px" class='clearfix'>
        <el-radio v-model="batchIsPublish" :label="false">不发布</el-radio>
        <el-radio v-model="batchIsPublish" :label="true">发布</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowBatchPublishDialog=false" size="mini" round>取 消</el-button>
      <el-button type="primary" @click="saveBatchIsPublish" size="mini" round>批量修改</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
let appBatchEditInfoDefaultVal = {
  ShowWeb: 0, Url: '', AppPreviewUrl: '',
  IsUpdate: 0, UpdateUrl: '', isPublish: 0,
  PushKey: '', CustId: '', Remark: '', IsPublish: ''
};
export default {
  name: 'AppList',
  data () {
    var self = this;
    var ONE_DAY_MIL_SECONDS = 24 * 3600 * 1000;

    let validateRegexpFn = (dataType, valName, required) => {
      return function(rule, value, callback) {
        console.log(`value: ${value}, valName: ${valName}, dataType: ${dataType}, required: ${required}`);
        if (value === '') {
          !required && callback();
          required && callback(new Error('请输入' + valName));
        } else if (!window.$myCommon.testValid(value, dataType)) {
          callback(new Error('请输入正确的' + valName));
        } else {
          callback();
        }
      };
    };

    return {
      state: window.$store.state,
      appDataPreviewUrl: window.API_ROUTER.appDataPreviewUrl,

      appTable: null,
      appDetailInfo: {}, // app详情页信息
      appEditInfo: {},   // app编辑页信息
      appModifyForm: null, // app编辑页Form表单

      curPage: 1, // 当前页
      totalPage: 20, // 总页数
      totalRecordNum: 1000, // 总条目
      perPageRecordNum: 10, // 每页的条目数

      isShowAppEditDialog: false, // 是否显示App编辑弹窗
      isShowAppDetailDialog: false, // 是否显示App详情弹窗
      isShowBatchEditDialog: false, // 是否显示批量修改弹窗
      isShowBatchUrlDialog: false, // 是否显示批量跳转弹窗

      isCreateApp: false,
      appEditInfoIndex: -1,
      selectedIds: [],

      appBatchEditInfo: Object.assign({}, appBatchEditInfoDefaultVal), // 批量修改页信息
      batchIsShowWeb: '',

      isShowBatchCustomDialog: false,
      batchCustomId: '',

      isShowBatchPublishDialog: false,
      batchIsPublish: '',

      searchProps: { // 搜索字段
        appName: '',
        appId: '',
        type: '',
        showWeb: '',
        isUpdate: '',
        startDate: '',
        endDate: '',
        authorId: '',
        custId: '',
        isPublish: ''
      },
      appTypes: [
        {label: '全部机型', value: ''},
        {label: 'android', value: 'android'},
        {label: 'ios', value: 'ios'}
      ],
      appRedirectStatus: [
        {label: '全部跳转', value: ''},
        {label: '跳转', value: 1},
        {label: '不跳转', value: 0}
      ],
      isPublishOptions: [
        {label: '发布情况', value: ''},
        {label: '已发布', value: 1},
        {label: '未发布', value: 0}
      ],
      pickerStartDateOptions: { // 开始时间的选择范围
        disabledDate(time) {
          let timestamp = time.getTime();
          if(timestamp > Date.now()) { return true; }
          let endDate = self.searchProps.endDate;
          if(endDate && timestamp > endDate) { return true;}
          return false;
        }
      },
      pickerEndDateOptions: { // 结束时间的选择范围
        disabledDate(time) {
          let timestamp = time.getTime();
          if(timestamp > Date.now()) { return true; }
          let startDate = self.searchProps.startDate;
          if(startDate && timestamp < startDate) { return true;}
          return false;
        }
      },
      appListData: [],

      appModifyRules: {
        AppPreviewUrl: [
          { validator: validateRegexpFn('url', 'App预览地址', false), trigger: 'blur' }
        ],
        UpdateUrl: [
          { validator: validateRegexpFn('url', '强更地址', false), trigger: 'blur' }
        ],
        Url: [
          { validator: validateRegexpFn('url', '跳转地址', false), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    hasSelectedItem() {
      var appTable = this.appTable;
      return !appTable || appTable.selection.length < 1;
    }
  },
  watch: {
    '$route' (to, from) {
      if(to.name == 'addApp') { // 添加App
        this.$nextTick(() => {
          this.handleEditApp(-1, {}, true);
        });
      }
    }
  },
  methods: {
    filterTag(value, row, column) { // 筛选标签
      return row[ column['property'] ] == value;
    },
    toggleSelection(rows, type='selectAll') { // 全选/取消选择切换
      var appTable = this.$refs.appTable;
      if(rows && rows.length > 0) { // 仅选中部分行
        rows.forEach(row => {
          appTable.toggleRowSelection(row);
        });
        return;
      }
      switch(type) { // 全选、取消选择
        case 'cancelAll':
          appTable.clearSelection();
          break;
        case 'selectAll':
          appTable.data.forEach(row => {
            appTable.toggleRowSelection(row, true);
          });
          break;
        default:
          break;
      }
    },
    handlePaginationPageChange(val) { // 导航页码切换
      this.curPage = val;
      this.getAppList();
    },
    handleShowAppDetail(index, row) { // 显示app详情信息
      // TODO：设置初始化编辑的表数据
      this.appDetailInfo = Object.assign({}, row); // TODO：防止修改原对象
      this.isShowAppDetailDialog = true;
    },
    handleEditApp(index, row, isCreateApp) { // 显示app信息编辑弹窗
      this.$refs.appModifyForm && this.$refs.appModifyForm.resetFields(); // 清空表
      if(isCreateApp) { // 添加App
        row.Type = 'android';
      } else {
        this.appEditInfoIndex = index;
      }
      this.appEditInfo = Object.assign({}, row); // TODO：防止修改原对象
      this.isShowAppEditDialog = true;
      this.isCreateApp = !!isCreateApp;
    },
    submitAppEditInfo() { // 上传app编辑数据
      let appInfo = this.appEditInfo;
      let info = {
        appName: appInfo.Name,
        appId: appInfo.AppId,
        showWeb: appInfo.ShowWeb ? 1: 0,
        url: appInfo.Url,
        isUpdate: appInfo.IsUpdate ? 1: 0,
        updateUrl: appInfo.UpdateUrl,
        remark: appInfo.Remark,
        type: appInfo.Type,
        pushKey: appInfo.PushKey,
        previewUrl: appInfo.AppPreviewUrl,
        custId: appInfo.CustId,
        isPublish: appInfo.IsPublish ? 1: 0
      };
      if(this.isCreateApp) {
        this._addApp(info);
      } else {
        console.log(appInfo);
        info.id = appInfo.Id;
        this._editApp(info);
      }
    },
    _addApp(info, cb) { // 添加新用户
      window.$cmsApi.createApp(info, (res) => {
        cb && cb(res);
        this.isShowAppEditDialog = false;
        this.$message({ message: '添加成功', type: 'success', showClose: true });

        let userInfo = $store.state.userInfo;
        this.appEditInfo.AuthorId = userInfo.Id;
        this.appEditInfo.Id = res.data.Id;
        this.appEditInfo.AuthorName = userInfo.NickName || userInfo.UserName || '';
        this.appEditInfo.CustName = window.$myCommon.getCustNameById(userInfo.CustId);
        let appInfo = this._formatAppItem(this.appEditInfo);
        this.appListData.unshift(appInfo);
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },
    _editApp(info, cb) { // 修改用户
      window.$cmsApi.updateApp(info, (res) => {
        cb && cb(res);
        this.isShowAppEditDialog = false;
        this.isShowAppDetailDialog = false;
        this.$message({ message: '修改成功', type: 'success', showClose: true });
        this.appEditInfo.CustName = window.$myCommon.getCustNameById(this.appEditInfo.CustId);
        let appInfo = this._formatAppItem(this.appEditInfo);
        this.appListData.splice(this.appEditInfoIndex, 1, appInfo);
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },
    handleDeleteApp(index, row) { // 删除App
      this.$confirm(`确认删除app：《${row.Name}》 吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        window.$cmsApi.deleteApp(row.Id, () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.appListData.splice(index, 1);
        }, (msg) => {
          window.$myCommon.toast(msg || '网络连接错误');
        });
      }).catch(() => {
      });
    },
    handlePublishApp(index, row) { // 将app发布到应用市场
      let isPublish = 1;
      this.$confirm(`确认将app：《${row.Name}》 发布到App市场吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        window.$cmsApi.publishApp(row.Id, isPublish, () => {
          this.$message({
            type: 'success',
            message: '已发布到App市场!'
          });
          row.IsPublish = isPublish;
          row.CustName = window.$myCommon.getCustNameById(row.CustId);
          this.appListData.splice(index, 1, row);
        }, (msg) => {
          window.$myCommon.toast(msg || '网络连接错误');
        });
      }).catch(() => {
      });
    },
    handleUnPublishApp(index, row) { // 将app发布到应用市场
      let isPublish = 0;
      this.$confirm(`确认撤销发布app：《${row.Name}》吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        window.$cmsApi.publishApp(row.Id, isPublish, () => {
          this.$message({
            type: 'success',
            message: '已撤销发布!'
          });
          row.IsPublish = isPublish;
          row.CustName = window.$myCommon.getCustNameById(row.CustId);
          this.appListData.splice(index, 1, row);
        }, (msg) => {
          window.$myCommon.toast(msg || '网络连接错误');
        });
      }).catch(() => {
      });
    },
    handlePreviewApp(index, row) { // 跳转预览网页
      let url = row.AppPreviewUrl;
      if(!url) { return; }
      window.open (url, "_blank") ;
    },
    handlerCloseModifyAppPop(done) { // 关闭修改App弹窗
      this.$router.push({ name: 'appList' });
      done();
    },

    showBatchPop() { // 显示批量修改属性弹窗
      this.appBatchEditInfo = Object.assign({}, appBatchEditInfoDefaultVal);
      this.isShowBatchEditDialog = true;
    },
    submitAppBatchEditInfo() { // 批量修改app属性
      // ShowWeb: 0, Url: '', AppPreviewUrl: '',
      // IsUpdate: 0, UpdateUrl: '',
      // PushKey: '', CustName: '', Remark: ''
      let editInfo = this.appBatchEditInfo;
      let updateProp = {
        showWeb: editInfo.ShowWeb ? 1: 0,
        url: editInfo.Url,
        isUpdate: editInfo.IsUpdate ? 1: 0,
        updateUrl: editInfo.UpdateUrl,
        remark: editInfo.Remark,
        type: editInfo.Type,
        pushKey: editInfo.PushKey,
        previewUrl: editInfo.AppPreviewUrl,
        custId: editInfo.CustId,
        isPublish: editInfo.IsPublish ? 1 : 0,
      };
      this.updateBatchProp(updateProp, (res) => {
        this.$message({
          type: 'success',
          message: '已成功批量修改'
        });
        this.isShowBatchEditDialog = false;
        this.appBatchEditInfo = Object.assign({}, appBatchEditInfoDefaultVal);
      });

    },
    showBatchEditUrlPop() { // 批量修改跳转地址
      this.$prompt('请输入跳转地址', '批量修改跳转地址', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
        inputErrorMessage: '地址格式不正确'
      }).then(({ value }) => {
        this.updateBatchProp({url: value}, (res) => {
          this.$message({
            type: 'success',
            message: '已成功批量修改跳转地址为: ' + value
          });
        });
      }).catch(() => {

      });
    },
    showBatchShowWebPop() { // 批量修改是否跳转弹窗
      this.isShowBatchUrlDialog = true;
      this.batchIsShowWeb = '';
    },
    saveBatchShowWeb() { // 批量修改是否跳转
      this.isShowBatchUrlDialog = false;
      var showWeb = this.batchIsShowWeb===true ? 1 : 0;
      this.updateBatchProp({showWeb}, (res) => {
        this.$message({
          type: 'success',
          message: '已成功批量修改为' + (showWeb ? '跳转' : '不跳转')
        });
      });
    },
    showBatchEditCustomPop() { // 批量修改分配客户
      this.isShowBatchCustomDialog = true;
      this.batchCustomId = '';
    },
    saveBatchCustom() { // 提交批量修改分配用户
      let batchCustomId = this.batchCustomId;
      this.updateBatchProp({custId: batchCustomId}, (res) => {
        this.isShowBatchCustomDialog = false;
        let custInfo = _.find(window.$store.state.allUserList, {Id: batchCustomId}) || custInfo;
        this.$message({
          type: 'success',
          message: '已成功批量修改分配用户为' + (custInfo.NickName || custInfo.UserName)
        });
      });
    },
    showBatchEditPublishPop() { // 显示批量修改分配客户
      this.isShowBatchPublishDialog = true;
      this.batchIsPublish = '';
    },
    saveBatchIsPublish() { // 提交批量发布到App市场
      if(this.batchIsPublish === '') {
        return this.$message({
          type: 'error',
          message: '请选择是否发布到App市场'
        });;
      }
      let batchIsPublish = this.batchIsPublish ? 1 : 0;
      this.updateBatchProp({isPublish: batchIsPublish}, (res) => {
        this.isShowBatchPublishDialog = false;
        this.$message({
          type: 'success',
          message: '已成功批量发布到App市场'
        });
      });
    },
    updateBatchProp(info, cb) { // 批量修改属性
      let selectedIds = this.selectedIds || [];
      let selectedIdsStr = selectedIds.join(',');
      if(selectedIds.length < 1) return;

      window.$cmsApi.updateAppByIds(selectedIdsStr, info, (res) => {
        cb && cb(res);
        this.isShowAppEditDialog = false;
        this.isShowAppDetailDialog = false;
        this.$message({ message: '已批量修改成功', type: 'success', showClose: true });

        this.getAppList();
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },

    _getSearchParams() {
      let searchProps = this.searchProps || {};
      let {appName, appId, type, authorId, showWeb, custId, isPublish, startDate, endDate} = searchProps;
      let options = {
        page: this.curPage,
        pageSize: this.perPageRecordNum,
        appName, appId, type, authorId, showWeb, custId, isPublish,
        startDate,
        endDate: endDate ? endDate + 24 * 3600 * 1000 : ''
      };
      return options;
    },
    getAppList() {
      let options = this._getSearchParams();
      window.$cmsApi.getAppList(options, (res) => {
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
      item.ShowWebStr = item.ShowWeb ? '是' : '否';
      item.IsUpdateStr = item.IsUpdate ? '是' : '否';
      return item;
    },
    _formatAppList(list=[]) {
      _.each(list, (item, index) => {
        item = this._formatAppItem(item);
      });
      return list;
    },

    searchAppList() {
      this.getAppList();
    },

    handleSelectionChange(rows) {
      this.selectedIds = _.map(rows || [], 'Id') || [];
    },

    exportCurPageExcel() {
      let options = this._getSearchParams();
      window.$cmsApi.exportAppExcel(options);
    },
    exportAllExcel() {
      let options = {
        pageSize: 1000,
        page: 1
      };
      window.$cmsApi.exportAppExcel(options);
    },
  },
  mounted() {
    this.appTable = this.$refs.appTable;
    if(this.$route.name == 'addApp') { // 添加App
      this.handleEditApp(-1, {}, true);
    }
    window.$myCommon.checkLogin((res) => {
      this.getAppList();
    });
  }
}
</script>

<style scoped>
.cms-i-nav {
  height: 30px;
  line-height: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.batch-btns-box {
  padding: 12px 0 2px;
}
.batch-btns-box .el-button {
  margin-bottom: 10px;
}
.app-table .el-button.is-circle {
  padding: 4px;
  margin: 0 4px;
}
.app-table .el-button+.el-button {
    margin-left: 3px;
    padding: 3px;
}
.app-table .el-button--mini, .app-table .el-button--mini.is-round {
    padding: 5px 10px;
}
.t-appname {
  color: #1f7eab;
  cursor: pointer;
}

.i-appmodify-pop .el-form-item--mini.el-form-item, .i-appmodify-pop .el-form-item--small.el-form-item {

}
.i-appmodify-list li {
  padding: 7px 10px;
}
.i-appmodify-list li:nth-child(odd) {
  background: #f9f9f9;
}
.i-appmodify-list .i-m-tag {
  color: #777;
  width: 115px;
  display: inline-block;
}
.i-appmodify-list .i-m-val {
  color: #025d7f;
  font-weight: bold;
}
.app-table .a-url {
  color: #025d7f;
  text-decoration: underline;
}
</style>
