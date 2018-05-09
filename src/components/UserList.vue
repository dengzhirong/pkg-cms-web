<template>
<div class="cms-page-applist cms-p-list cms-user-list">
  <div class="cms-i-nav">
    <div class="nav-title el-icon-location-outline">用户列表</div>
    <div class="button-group fr">
      <el-button class='' type="success" round size="mini" @click="handleEditUser(-1, {}, true)">添加用户</el-button>
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
        <el-input placeholder="账号名" v-model="searchProps.username" clearable maxlength='50'></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="手机号" v-model="searchProps.phone" clearable maxlength='50'></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="邮箱" v-model="searchProps.email" clearable maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable v-model="searchProps.group" placeholder="角色">
          <el-option
            v-for="item in groupList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable v-model="searchProps.isban" placeholder="是否禁用">
          <el-option
            v-for="item in isBanList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable v-model="searchProps.show_contact" placeholder="显示联系方式">
          <el-option
            v-for="item in showContactList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable v-model="searchProps.show_market" placeholder="显示APP市场" width='300px'>
          <el-option
            v-for="item in showMarketList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchUserList">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- app表格 -->
  <el-table class="app-table"
    ref="mainTable" border
    :data="listData" align='center'
    tooltip-effect="dark"
    style="width: 100%; text-align:center;">
    <el-table-column prop="UserName" label="账号名" width="120" align='center' sortable show-overflow-tooltip>
      <template slot-scope="scope">
        <div class='t-username' @click="handleShowUserDetail(scope.$index, scope.row)">{{scope.row.UserName}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="NickName" label="姓名" align='center' sortable show-overflow-tooltip></el-table-column>
    <el-table-column prop="GroupId" label="角色" align='center'
      :filters="groupFilter"
      :filter-method="filterTag">
      <template slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.GroupId"
          :type="scope.row.GroupId == 2 ? 'primary' : scope.row.GroupId == 1 ? 'danger' :'success'"
          close-transition>{{scope.row.GroupName}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="Email" label="邮箱" align='center' sortable show-overflow-tooltip></el-table-column>
    <el-table-column prop="Phone" label="手机" align='center' sortable show-overflow-tooltip></el-table-column>
    <el-table-column prop="QQ" label="QQ" align='center' sortable show-overflow-tooltip></el-table-column>
    <el-table-column prop="IsBan" label="被禁用" align='center'
      :filters="[{ text: '禁用', value: 1 }, { text: '正常', value: 0 }]"
      :filter-method="filterTag">
      <template slot-scope="scope">
        <el-tag size="small"
          :type="scope.row.IsBan ? 'danger' :'success'"
          close-transition>{{scope.row.IsBan ? '禁用' : '正常'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="ShowContact" label="显示联系方式" align='center'
      :filters="[{ text: '是', value: 1 }, { text: '否', value: 0 }]"
      :filter-method="filterTag">
      <template slot-scope="scope">
        <el-tag size="small"
          :type="scope.row.ShowContact ? 'success' :'info'"
          close-transition>{{scope.row.ShowContact ? '显示' : '隐藏'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="ShowMarket" label="显示App市场" align='center'
      :filters="[{ text: '是', value: 1 }, { text: '否', value: 0 }]"
      :filter-method="filterTag">
      <template slot-scope="scope">
        <el-tag size="small"
          :type="scope.row.ShowMarket ? 'success' :'info'"
          close-transition>{{scope.row.ShowMarket ? '显示' : '隐藏'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="115" align='center'>
      <template slot-scope="scope">
      <el-tooltip effect="dark" content="编辑">
        <el-button type="primary" icon="el-icon-edit" circle plain
          @click="handleEditUser(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="禁用" v-if="!scope.row.IsBan">
        <el-button type="warning" icon="el-icon-remove-outline" circle plain
          @click="handleBanUser(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="解除封号" v-if="scope.row.IsBan">
        <el-button type="info" icon="el-icon-check" circle plain
          @click="handleUnBanUser(scope.$index, scope.row)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除">
        <el-button type="danger" icon="el-icon-delete" circle plain
          @click="handleDeleteUser(scope.$index, scope.row)"></el-button>
      </el-tooltip>
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

  <!-- 修改弹窗 -->
  <el-dialog class='i-appmodify-pop'
    :title="isCreateUser ? '添加用户' : '编辑用户'" top="8vh"
    :before-close="handlerCloseModifyPop"
    :visible.sync="isShowEditDialog"
    width="380" center>
    <el-form ref="modifyForm" :model="editingInfo" label-position="left" label-width="110px"
      auto-complete="off" size='mini' :rules="userRules">
      <el-form-item label="账号名：" required>
        <el-input v-model="editingInfo.UserName" placeholder='请输入账号名' clearable
          :disabled="!isCreateUser" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" :required="isCreateUser">
        <el-input v-model="editingInfo.Password" clearable auto-complete="off"
          placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" required>
        <el-input v-model="editingInfo.NickName" placeholder='请输入姓名' clearable></el-input>
      </el-form-item>
      <el-form-item label="角色：" required>
        <el-select filterable v-model="editingInfo.GroupId" placeholder="请选择">
          <el-option
            v-for="(item, index) in groupList"
            v-if="index!=0"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱：" prop="Email">
        <el-input v-model="editingInfo.Email" placeholder='请输入邮箱' clearable></el-input>
      </el-form-item>
      <el-form-item label="手机：" prop="Phone">
        <el-input v-model="editingInfo.Phone" placeholder='请输入手机' clearable></el-input>
      </el-form-item>
      <el-form-item label="QQ：" prop="QQ">
        <el-input v-model="editingInfo.QQ" placeholder='请输入QQ' clearable></el-input>
      </el-form-item>
      <el-form-item label="被禁用：">
        <el-switch v-model="editingInfo.IsBan" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="显示联系方式：">
        <el-switch v-model="editingInfo.ShowContact" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="显示App市场：">
        <el-switch v-model="editingInfo.ShowMarket" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="editingInfo.Remark" type="textarea" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowEditDialog=false">取 消</el-button>
      <el-button type="primary" @click="submitEditInfo">提 交</el-button>
    </span>
  </el-dialog>

  <!-- 详情弹窗 -->
  <el-dialog class='i-appmodify-pop'
    title="用户信息" :top="'10vh'"
    :visible.sync="isShowDetailDialog"
    width="380" center>
    <div class='clearfix'>
      <el-button type="danger" icon="el-icon-edit" size='mini' class='fr'
        style="margin:-9px 0 5px;" @click="handleEditUser(detailInfo._$index, detailInfo)">编辑</el-button>
    </div>
    <ul class='i-appmodify-list'>
      <li><span class='i-m-tag'>账号名：</span><span class='i-m-val'>{{detailInfo.UserName}}</span></li>
      <li><span class='i-m-tag'>姓名：</span><span class='i-m-val'>{{detailInfo.NickName}}</span></li>
      <li><span class='i-m-tag'>密码：</span><span class='i-m-val'>{{detailInfo.Password}}</span></li>
      <li><span class='i-m-tag'>角色：</span><span class='i-m-val'>{{detailInfo.GroupName}}</span></li>
      <li><span class='i-m-tag'>邮箱：</span><span class='i-m-val'>{{detailInfo.Email}}</span></li>
      <li><span class='i-m-tag'>手机：</span><span class='i-m-val'>{{detailInfo.Phone}}</span></li>
      <li><span class='i-m-tag'>QQ：</span><span class='i-m-val'>{{detailInfo.QQ}}</span></li>
      <li><span class='i-m-tag'>被禁用：</span><span class='i-m-val'>{{detailInfo.IsBan? '是' : '否'}}</span></li>
      <li><span class='i-m-tag'>显示联系方式：</span><span class='i-m-val'>{{detailInfo.ShowContact==1? '是' : '否'}}</span></li>
      <li><span class='i-m-tag'>显示App市场：</span><span class='i-m-val'>{{detailInfo.ShowMarket==1? '是' : '否'}}</span></li>
      <li><span class='i-m-tag'>创建时间：</span><span class='i-m-val'>
        {{detailInfo.CreateTime ? new Date(detailInfo.CreateTime).toLocaleDateString() : ''}}
      </span></li>
      <!-- <li><span class='i-m-tag'>最近登录时间：</span><span class='i-m-val'>
        {{detailInfo.LoginTime ? new Date(detailInfo.LoginTime).toLocaleDateString() : ''}}
      </span></li> -->
    </ul>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'UserList',
  data () {
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
      editingInfo: { // 编辑页数据
        UserName: '',
        Password: '',
        Email: '',
        Phone: '',
        QQ: '',
        NickName: ''
      },
      detailInfo: {}, // 详情页数据
      modifyForm: {
        UserName: '',
        Password: '',
        Email: '',
        Phone: '',
        QQ: '',
        NickName: ''
      },

      curPage: 1, // 当前页
      totalPage: 1, // 总页数
      totalRecordNum: 0, // 总条目
      perPageRecordNum: 10, // 每页的条目数

      isShowEditDialog: false, // 是否显示App编辑弹窗
      isShowDetailDialog: false, // 是否显示App详情弹窗

      isCreateUser: false,
      editingInfoIndex: -1,

      searchProps: { // 搜索字段
        username: '',
        phone: '',
        email: '',
        group: '',
        status: '',
        isban: '',
        show_contact: '',
        show_market: ''
      },
      groupList: [],
      groupFilter: [],
      isBanList: [
        {label: '所有', value: null},
        {label: '正常', value: 0},
        {label: '禁用', value: 1}
      ],
      showContactList: [
        {label: '所有', value: null},
        {label: '显示', value: 1},
        {label: '隐藏', value: 0}
      ],
      showMarketList: [
        {label: '所有', value: null},
        {label: '显示', value: 1},
        {label: '隐藏', value: 0}
      ],
      listData: [],
      userRules: {
        Email: [
          { validator: validateRegexpFn('email', '邮箱', false), trigger: 'blur' }
        ],
        Phone: [
          { validator: validateRegexpFn('phone', '手机号码', false), trigger: 'blur' }
        ],
        QQ: [
          { validator: validateRegexpFn('qq', 'QQ', false), trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    '$route' (to, from) {
      if(to.name == 'addUser') { // 添加用户
        this.handleEditUser(-1, {}, true);
      }
    }
  },
  methods: {
    filterTag(value, row, column) { // 筛选标签
      return row[ column['property'] ] == value;
    },
    handlePaginationPageChange(val) { // 导航页码切换
      this.curPage = val;
      this.getUserList();
    },
    handleShowUserDetail(index, row) { // 显示详情信息
      row._$index = index;
      this.detailInfo = Object.assign({}, row); // 防止修改原对象
      this.isShowDetailDialog = true;
    },
    handleEditUser(index, row, isCreateUser) { // 显示app信息编辑弹窗
      this.isCreateUser = !!isCreateUser;
      this.$refs.modifyForm && this.$refs.modifyForm.resetFields(); // 清空表
      if(isCreateUser) { // 添加App
        row.GroupId = window.$store.state.GroupMaps.custom.id;
      } else {
        this.editingInfoIndex = index;
      }
      row.GroupId = parseInt(row.GroupId || 0);
      this.editingInfo = Object.assign({}, row); // 防止修改原对象
      this.isShowEditDialog = true;
    },
    submitEditInfo() { // 上传app编辑数据
      let userInfo = this.editingInfo;
      // let pwd = !userInfo.Password ? null : CryptoJS.AES.encrypt(userInfo.Password, window.$myConfig.PWD_CRYPTO_SALT).toString();
      let info = {
        username: userInfo.UserName,
        nickname: userInfo.NickName,
        pwd: userInfo.Password,
        group_id: userInfo.GroupId,
        email: userInfo.Email,
        phone: userInfo.Phone,
        qq: userInfo.QQ,
        avatar: userInfo.Avatar,
        isban: userInfo.IsBan,
        show_contact: userInfo.ShowContact,
        show_market: userInfo.ShowMarket,
        remark: userInfo.Remark,
      };
      if(this.isCreateUser) {
        this._addUser(info);
      } else {
        info.id = userInfo.Id;
        this._editUser(info);
      }
    },
    _addUser(info, cb) { // 添加新用户
      window.$cmsApi.createUser(info, (res) => {
        cb && cb(res);
        this.isShowEditDialog = false;
        this.$message({ message: '添加成功', type: 'success', showClose: true });
        let editingInfo = this._formatUserInfo(this.editingInfo);
        this.listData.unshift(editingInfo);
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },
    _editUser(info, cb) { // 修改用户
      window.$cmsApi.updateUser(info, (res) => {
        cb && cb(res);
        this.isShowEditDialog = false;
        this.isShowDetailDialog = false;
        this.$message({ message: '修改成功', type: 'success', showClose: true });
        let editingInfo = this._formatUserInfo(this.editingInfo);
        this.listData.splice(this.editingInfoIndex, 1, editingInfo);
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },
    handleDeleteUser(index, row) { // 删除
      this.$confirm(`确认删除用户 ${row.UserName} 吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        window.$cmsApi.deleteUser(row.Id, () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.listData.splice(index, 1);
        }, (msg) => {
          window.$myCommon.toast(msg || '删除失败');
        });
      }).catch(() => {
      });
    },
    handleBanUser(index, row) { // 禁用
      this.$confirm(`确认禁用 ${row.UserName} 吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        window.$cmsApi.banUser(row.Id, () => {
          this.$message({
            type: 'success',
            message: '封号成功!'
          });
          row.IsBan = 1;
          row = this._formatUserInfo(row);
          this.listData.splice(index, 1, row);
        }, (msg) => {
          window.$myCommon.toast(msg || '封号失败');
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    handleUnBanUser(index, row) { // 解封
      this.$confirm(`确认解除 ${row.UserName} 的封号吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        window.$cmsApi.unBanUser(row.Id, () => {
          this.$message({
            type: 'success',
            message: `成功解除 ${row.UserName} 的封号！`
          });
          row.IsBan = 0;
          this.listData.splice(index, 1, row);
        }, (msg) => {
          window.$myCommon.toast('解封失败');
        });
      }).catch(() => {
      });
    },
    handlerCloseModifyPop(done) { // 关闭修改弹窗
      this.$router.push({ name: 'userList' });
      done();
    },
    searchUserList() {
      this.getUserList();
    },
    getSearchParams() {
      let searchProps = this.searchProps || {};
      let options = {
        pageSize: this.perPageRecordNum || 20,
        page: this.curPage || 1,
        usernme: searchProps.username,
        phone: searchProps.phone,
        email: searchProps.email,
        group_id: searchProps.group == 'all' ? '' : searchProps.group,
        // status: searchProps.status == 'all' ? '' : searchProps.status,
        isban: searchProps.isban == 'all' ? '' : searchProps.isban,
        show_contact: searchProps.show_contact,
        show_market: searchProps.show_market,
      };
      return options;
    },
    getUserList(cb) { // 获取用户列表
      let options = this.getSearchParams();
      window.$cmsApi.getUserList(options, (res={}) => {
        cb && cb(res);
        let usersData = res.data || {};
        let userCountData = usersData.count || {};
        this.listData = this._formatUserList(usersData.list || []);
        this.totalPage = userCountData.pageCount || 1;
        this.totalRecordNum = userCountData.totalCount || 0;
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },

    _formatUserInfo(userInfo={}) {
      userInfo.IsBan = userInfo.IsBan !== undefined ? userInfo.IsBan
        : userInfo.Status == -2 ? 1 : 0;
      userInfo.GroupName = window.$myCommon.getGroupNameByGroupId(userInfo.GroupId);
      return userInfo;
    },

    _formatUserList(list=[]) {
      _.each(list, (item, index) => {
        item = this._formatUserInfo(item);
      });
      return list;
    },

    exportCurPageExcel() {
      let options = this.getSearchParams();
      window.$cmsApi.exportUserExcel(options);
    },
    exportAllExcel() {
      window.$cmsApi.exportUserExcel({
        pageSize: 1000,
        page: 1
      });
    },
    initGroupList() { // 初始化角色列表
      let GroupMaps = window.$store.state.GroupMaps;
      this.groupList = [ {label: '所有角色', value: 'all'} ];
      this.groupFilter = [];
      _.each(GroupMaps, group => {
        this.groupList.push({ label: group.name, value: group.id });
        this.groupFilter.push({ text: group.name, value: group.id });
      });
    }
  },
  mounted() {
    this.mainTable = this.$refs.mainTable;
    window.$myCommon.checkLogin((data) => {
      this.getUserList();
      if(this.$route.name == 'addUser') { // 添加App
        this.handleEditUser(-1, {}, true);
      }

      this.initGroupList(); // 初始化角色列表
    }, () => {});

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
  padding: 5px;
}
.app-table .el-button+.el-button {
    margin-left: 2px;
}
.app-table .el-button--mini, .app-table .el-button--mini.is-round {
    padding: 5px 10px;
}
.t-username {
  color: #1f7eab;
  cursor: pointer;
}

.i-appmodify-pop .el-form-item--mini.el-form-item, .i-appmodify-pop .el-form-item--small.el-form-item {
    margin-bottom: 15px;
}
.i-appmodify-list li {
  padding: 7px 10px;
}
.i-appmodify-list li:nth-child(odd) {
  background: #f9f9f9;
}
.i-appmodify-list .i-m-tag {
  color: #777;
  width: 110px;
  display: inline-block;
}
.i-appmodify-list .i-m-val {
  color: #025d7f;
  font-weight: bold;
}
</style>
