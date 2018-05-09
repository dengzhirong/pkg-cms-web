<template>
<div class="cms-page-contact">
  <div class="cms-i-nav">
    <div class="nav-title el-icon-location-outline">联系我们</div>
  </div>
  <div class="table-wrap">
    <el-table class=""
      :show-header="false"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="linkType"
        label="联系方式"
        width="180">
      </el-table-column>
      <el-table-column
        prop="linkValue"
        label="号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop=""
        label="打开聊天">
        <template slot-scope="scope">
          <a
            v-if="scope.row.linkValue && scope.row.isQQ"
            :href="'http://wpa.qq.com/msgrd?v=3&uin=' + scope.row.linkValue + '&site=qq&menu=yes'">
            <el-button type="success" round size='mini'>打开聊天</el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <div class="link-text">如需要购买App包，请通过以上方式联系我们。</div>
</div>
</template>

<script>
export default {
  name: "ContactUs",
  data() {
    let getDecryptNum = function(decoded) {
      return CryptoJS.AES.decrypt(
        decoded,
        window.$myConfig.PWD_CRYPTO_SALT
      ).toString(CryptoJS.enc.Utf8);
    };
    let phone = getDecryptNum("U2FsdGVkX1+aAd4gtcIc77hcSbxsvWMj3gsw7v5c+XY=");
    let qq = getDecryptNum("U2FsdGVkX1+lTvYTSImJGx6EiDo0V9O+1iEBHuOkxhc=");
    return {
      tableData: [
        { linkType: "电话：", linkValue: phone, isQQ: false },
        { linkType: "QQ：", linkValue: qq, isQQ: true }
      ]
    };
  },
  methods: {},
  mounted() {
    window.$myCommon.checkLogin(data => {}, () => {});
  }
};
</script>

<style scoped>
.table-wrap {
  width: 480px;
  margin: 30px 20px;
}
.link-text {
  margin-top: 40px;
  margin-left: 25px;
  font-size: 13px;
  color: #666;
}
</style>
