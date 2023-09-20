<template>
  <VRow>
    <VCol cols="12">
      <VCard title="文件管理">
        <VCardActions>
          <VBtn @click="state.showUpDialog = true">
            上传文件
          </VBtn>
          <VFadeTransition>
            <div v-show="state.selectedList.length > 0">
              <VBtn @click="downFile">下载</VBtn>
              <VBtn @click="deleteFile"
                    color="error">删除</VBtn>
            </div>
          </VFadeTransition>

        </VCardActions>
        <VRow cols="12"
              style="margin-bottom: 20px; padding: 0px 20px 0px 20px">
          <VCol lg="2"
                cols="12">
            <v-text-field v-model="state.queryParams.fileName"
                          label="文件名"></v-text-field>
          </VCol>
          <VCol lg="2"
                cols="12">
            <v-text-field v-model="state.queryParams.username"
                          label="用户名"></v-text-field>
          </VCol>
          <VCol lg="2"
                cols="12">
            <v-text-field v-model="state.queryParams.upDateStart"
                          label="上传日期"></v-text-field>
          </VCol>
          <span class="text-center"
                style="margin:auto 0">-</span>
          <VCol lg="2"
                cols="12">
            <v-text-field v-model="state.queryParams.upDateEnd"
                          label="上传日期"></v-text-field>
          </VCol>
          <VCol align="right"
                justify="right"
                style="margin-right: 20px">
            <VBtn @click="queryBtnClick">
              查询
            </VBtn>
          </VCol>

        </VRow>

        <VDataTable
          :headers="headers1"
          item-value="name"
          class="elevation-1"
        />
        <BLTable :table-conf="tableConf"
                 :table-data="state.tableData"
                 :table-loading="state.tableLoading"
                 :page-number="state.pageNumber"
                 :page-size="state.pageSize"
                 :total="state.total"
                 :enable-check-box="true"
                 @selected-changed="selectedChanged"
                 @page-changed="pageChanged"
                 @page-size-changed="pageSizeChanged" />
        <DeleteConfirm :show-confirm="state.deleteDialog.showDialog"
                       title="提示"
                       :msg="state.deleteDialog.deleteMsg"
                       @confirm-click="deleteConfirm"
                       @cancel-click="state.deleteDialog.showDialog = false" />
      </VCard>
    </VCol>
    <VCol>
      <Upload :show-up-dialog="state.showUpDialog"
              @close="upDialogClose" />
    </VCol>

  </VRow>

</template>
<script lang="ts" setup>
import fileAPI from '@/api/file'
import adminAPI from '@/api/admin'
import BLTable from '@/layouts/components/BLTable.vue'
import Upload from '@/layouts/components/uploader/upload.vue'
import Message from '@/layouts/components/message/message'
import  {VDataTable, DataTableHeader}  from 'vuetify/labs/VDataTable'

const state = reactive({
  tableData: [],
  tableLoading: true,
  showUpDialog: false,
  total: 0,
  menu: true,
  selectedList: [],
  deleteDialog: {
    showDialog: false,
    deleteMsg: '',
  },
  pageNumber: 1,
  pageSize: 5,
  queryParams: {
    fileName: '',
    username: '',
    upDateStart: '',
    upDateEnd: '',
    pageNumber: 1,
    pageSize: 5,
  },
  
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6,
        },
      ],

  
})


const headers1: DataTableHeader[] = [
        {
          title: 'Dessert (100g serving)',
          align: 'start',
          key: 'name',
          sortable: false,
        },
        { title: 'Calories', key: 'calories' },
        { title: 'Fat (g)', key: 'fat' },
        { title: 'Carbs (g)', key: 'carbs' },
        { title: 'Protein (g)', key: 'protein' },
        { title: 'Iron (%)', key: 'iron' },
      ]
/**
 * 下载文件
 */
const downFile = () => {
  let params = {
    md5: '',
  }
  for (const data of state.selectedList) {
    //先获取授权token
    params.md5 = data.md5
    fileAPI.getDownloadToken(params).then(res => {
      if (res.code === '200') {
        const url = fileAPI.downUrl + '?token=' + res.data
        fileAPI.downloadFile(url)
      }
    })
  }
}

/**
 * 删除文件弹框
 */
const deleteFile = () => {
  let msg = '确认删除吗?'
  state.deleteDialog.deleteMsg = msg
  state.deleteDialog.showDialog = true
}

/**
 * 确认删除
 * @param dialogState
 */
const deleteConfirm = (dialogState: any) => {
  let params = {
    permanentFlag: dialogState.permanentFlag ? 'Y' : 'N',
    idList: [],
  }
  for (const data of state.selectedList) {
    params.idList.push(data.md5)
  }
  fileAPI.deleteFiles(params).then(res => {
    if (res.code === '200') {
      dialogState.showConfirm = false
      Message.success(res.data)
    }
    state.deleteDialog.showDialog = false
  })
}

const upDialogClose = (showUpDialog: boolean) => {
  state.showUpDialog = showUpDialog
}

onMounted(() => {
  queryList(state.queryParams)
})

const queryBtnClick = () => {
  if (state.pageNumber == 1) {
    queryList(state.queryParams)
  } else {
    state.pageNumber = 1
  }
}

//页码监听事件
const pageChanged = (pageNumber: number) => {
  state.queryParams.pageNumber = pageNumber
  queryList(state.queryParams)
}

const pageSizeChanged = (pageSize: number) => {
  console.log(111)
  state.queryParams.pageSize = pageSize
  if (state.pageNumber != 1) {
    state.pageNumber = 1
  } else {
    queryList(state.queryParams)
  }
}

/**
 * 查询文件列表
 * @param params
 */
const queryList = (params: any) => {
  state.tableLoading = true
  adminAPI.fileList(params).then(res => {
    if (res.code === '200') {
      state.tableData = res.data.list
      state.pageNumber = res.data.pageNumber
      state.total = res.data.total
    }
    state.tableLoading = false
  })
}

//选中事件
const selectedChanged = (selectedList: any) => {
  state.selectedList = selectedList
}

const tableConf = [
  {
    header: '文件名',
    colum: 'fileName',
    width: '300px',
    alter: true,
    alterText: '重命名',
  },
  {
    header: '简介',
    colum: 'brief',
    width: '300px',
  },
  {
    header: '大小',
    colum: 'length',
    width: '80px',
    formatter: (row: any) => {
      if (row.length || row.length === 0) {
        let kbLength = row.length / 1024
        let mbLength = kbLength / 1024
        let gbLength = mbLength / 1024
        let suf
        let finalLength
        if (gbLength > 1) {
          finalLength = gbLength
          suf = ' G'
        } else if (mbLength > 1) {
          finalLength = mbLength
          suf = ' M'
        } else {
          finalLength = kbLength
          suf = ' K'
        }
        return finalLength.toFixed(2) + suf
      } else {
        return '-'
      }
    },
  },
  {
    header: '上传人',
    colum: 'username',
    width: '150px',
  },
  {
    header: '上传日期',
    colum: 'upDate',
    width: '120px',
  },
  {
    header: '是否共享',
    colum: 'share',
    width: '50px',
    formatter: (row: any) => {
      return row.ownStatus === 'Y' ? '是' : '否'
    },
  },
]
</script>

<style scoped>
:deep(.v-field__field) {
  max-height: 40px;
}

:deep(.v-input__control) {
  max-height: 40px;
}

:deep(.v-field__input) {
  max-height: 40px;
  min-height: 40px;
}
:deep(.v-field-label) {
  top: 8px;
  /* margin: auto 0; */
}
</style>
