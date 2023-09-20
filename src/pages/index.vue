<template>
  <VCard :style="isMobile() ? 'margin-top:-30px' : ''">
    <VCardTitle>
      LSP Cloud
    </VCardTitle>
    <VCardActions>
      <div v-if="isMobile()">
        <VRow cols="12">
          <VCol lg="1"
                md="1"
                cols="2">
            <VBtn @click="state.dialog.showUpDialog = true">上传</VBtn>
          </VCol>
          <VCol lg="1"
                md="1"
                cols="2">
            <VBtn @click="state.createDir = true">新建目录</VBtn>
          </VCol>
          <VCol lg="1"
                md="1"
                cols="2">
            <VFadeTransition v-show="state.selectedList.length > 0">
              <VBtn @click="downFile">下载</VBtn>
            </VFadeTransition>
          </VCol>
          <VCol lg="1"
                md="1"
                cols="2">
            <VFadeTransition v-show="state.selectedList.length > 0">
              <VBtn @click="deleteFile"
                    color="error">删除</VBtn>
            </VFadeTransition>
          </VCol>
          <VCol lg="1"
                md="1"
                cols="2">
            <VFadeTransition v-show="state.selectedList.length === 1">
              <VBtn @click="rename(state.selectedList[0])">重命名</VBtn>
            </VFadeTransition>
          </VCol>
        </VRow>
      </div>
      <div v-else>
        <VBtn @click="state.dialog.showUpDialog = true">上传</VBtn>
        <VBtn @click="state.createDir = true">新建目录</VBtn>
        <VFadeTransition v-show="state.selectedList.length > 0">
          <VBtn @click="downFile">下载</VBtn>
        </VFadeTransition>
        <VFadeTransition v-show="state.selectedList.length > 0">
          <VBtn @click="deleteFile"
                color="error">删除</VBtn>
        </VFadeTransition>
        <VFadeTransition v-show="state.selectedList.length === 1">
          <VBtn @click="rename(state.selectedList[0])">重命名</VBtn>
        </VFadeTransition>
      </div>

    </VCardActions>
    <VCardActions>
      <div v-for="(item, index) in state.navs"
           :class="index+1 < state.navs.length ? 'customLevelNav' : 'customLevelNavDisbale'"
           @click="navClick(item)">
        {{item.title}}
        <VIcon v-if="index+1 < state.navs.length">mdi-chevron-right</VIcon>
      </div>
    </VCardActions>

    <div class="text-center"
         v-if="(state.tableData.length === 0 && !state.tableLoading && !state.createDir)">
      <div style="margin-top: 5%; margin-bottom: 5%; font-size: 13px;">
        <p style="margin-bottom: -50px">还没有文件, 快去上传吧</p>
        <SvgIcon name="noData"
                 width="250"
                 height="300">
        </SvgIcon>
      </div>
    </div>

    <!-- pc端ui start -->
    <VTable v-if="!isMobile() && (state.tableData.length > 0 || state.tableLoading || state.createDir)"
            :height="state.tableHeight"
            fixed-header
            transition="fade-transition">
      <thead>
        <tr>
          <th style="width:36px; max-width: 36px;">
            <VCheckbox :indeterminate="state.partSelected"
                       @click="titleCheckboxClick"
                       v-model="state.titleCheckboxSelected"
                       style="width:36px"
                       color="#9155FD" />
          </th>

          <th class="text-left"
              v-for="conf in tableConf"
              :style="getWidthStyle(conf)">
            {{ conf.header }}
          </th>
        </tr>
      </thead>

      <VFadeTransition>
        <tbody v-show="!state.tableLoading">
          <VFadeTransition>
            <tr v-show="state.createDir">
              <td></td>
              <td>
                <VRow align="center"
                      justify="start"
                      cols="12">
                  <VCol cols="6"
                        style="margin-top: 5px; margin-bottom: 5px">
                    <!-- <VInput style="width:100%;height:35px" /> -->
                    <VTextField class="cus"
                                v-model="state.newDirName"
                                cols="5"></VTextField>
                  </VCol>
                  <VCol cols="2">
                    <SvgIcon class="createDirIcon"
                             width="32"
                             height="32"
                             name="submit"
                             @click="createDir" />
                    <SvgIcon class="createDirIcon"
                             width="20"
                             height="35"
                             name="cancel"
                             @click="state.createDir = false;state.newDirName=''" />
                  </VCol>
                </VRow>
              </td>
              <td></td>
              <td></td>
            </tr>
          </VFadeTransition>
          <tr v-for="data in state.tableData"
              :class="state.lightTheme ? 'dataTr' : 'dataTrDark'"
              @click.stop="rowClick(data)">
            <td style="width: 36px; max-width: 36px;">
              <VCheckbox v-model="state.selectedList"
                         @click.stop=""
                         :value="data"
                         color="#9155FD"
                         style="width: 36px;" />
            </td>
            <td v-for="conf in tableConf"
                class="text-left"
                :style="getWidthStyle(conf)">
              <VRow>
                <VImg cover
                      min-width="40"
                      :aspect-ratio="12/9"
                      style="margin:auto 0; margin-left: -10px;"
                      v-if="data.thumbnail && conf.colum == 'fileName' && state.renameData.id != data.id"
                      :src="data.thumbnail" />
                <SvgIcon v-if="(conf.colum === 'fileName' && !data.thumbnail && state.renameData.id != data.id)"
                         style="margin:auto 0;"
                         :name="getSVG(data)" />
                <div v-if="conf.colum === 'fileName'">
                  <div v-if="state.renameData.id === data.id">
                    <VRow align="center"
                          cols="12">
                      <VTextField style="max-width: 400px; min-width: 300px; margin-top: 15px; margin-bottom: 15px;"
                                  v-model="state.newName"></VTextField>
                      <SvgIcon class="createDirIcon"
                               width="32"
                               height="32"
                               name="submit"
                               @click.stop="renameConfirm" />
                      <SvgIcon class="createDirIcon"
                               width="20"
                               height="35"
                               name="cancel"
                               @click.stop="state.renameData = {}" />
                      <!-- </VCol> -->
                    </VRow>
                  </div>
                  <div v-else
                       class="folderStyle"
                       style="max-width: 400px; margin-top: 15px; margin-bottom: 15px;"
                       @click.stop="fileClick(data)">
                    {{formatter(conf, data)}}
                  </div>
                </div>
                <div v-else>
                  {{formatter(conf, data)}}
                </div>

              </VRow>
            </td>
          </tr>
        </tbody>
      </VFadeTransition>
    </VTable>
    <!-- pc端UI end -->

    <!-- 移动设备UI start-->
    <VTable v-if="isMobile() && (state.tableData.length > 0 || state.tableLoading || state.createDir)"
            :height="state.tableHeight"
            fixed-header
            transition="fade-transition">
      <thead>
        <tr>
          <th style="width:36px; max-width: 36px;">
            <VCheckbox :indeterminate="state.partSelected"
                       @click="titleCheckboxClick"
                       v-model="state.titleCheckboxSelected"
                       style="width:36px"
                       color="#9155FD" />
          </th>
          <th class="text-left">
            文件
          </th>
        </tr>
      </thead>

      <VFadeTransition>
        <tbody v-show="!state.tableLoading">
          <VFadeTransition>
            <tr v-show="state.createDir">
              <td colspan="2">
                <VRow align="center"
                      justify="start"
                      cols="12">
                  <VCol cols="12"
                        style="margin-top: 5px; margin-bottom: 5px">
                    <VTextField v-model="state.newDirName"
                                dense
                                outlined
                                cols="5"></VTextField>
                  </VCol>
                </VRow>
              </td>
              <td>
                <SvgIcon class="createDirIcon"
                         width="32"
                         height="32"
                         name="submit"
                         @click="createDir" />
              </td>
              <td>
                <SvgIcon class="createDirIcon"
                         width="20"
                         height="20"
                         name="cancel"
                         @click="state.createDir = false;state.newDirName=''" />
              </td>
            </tr>
          </VFadeTransition>
          <tr v-for="data in state.tableData"
              @click.stop="rowClick(data)">
            <td style="width: 36px; max-width: 36px;">
              <VCheckbox v-model="state.selectedList"
                         @click.stop=""
                         :value="data"
                         color="#9155FD"
                         style="width: 36px;" />
            </td>
            <td class="text-left"
                style="max-width: 180px;">
              <VRow cols="12">
                <VCol cols="12"
                      class="phoneData">
                  <VRow>
                    <VImg cover
                          width="40"
                          height="30"
                          style="margin:auto 0;"
                          v-if="data.thumbnail && state.renameData.id !== data.id"
                          :src="data.thumbnail" />
                    <SvgIcon v-if="!data.thumbnail && state.renameData.id !== data.id"
                             style="margin:auto 0"
                             :name="getSVG(data)" />
                    <div>
                      <div v-if="state.renameData.id === data.id">
                        <VRow align="center"
                              cols="12">
                          <VTextField style="max-width: 400px; min-width: 180px; margin: 15px;"
                                      v-model="state.newName"></VTextField>
                          <SvgIcon class="createDirIcon"
                                   width="32"
                                   height="32"
                                   name="submit"
                                   @click.stop="renameConfirm" />
                          <SvgIcon class="createDirIcon"
                                   width="20"
                                   height="35"
                                   name="cancel"
                                   @click.stop="state.renameData = {}" />
                          <!-- </VCol> -->
                        </VRow>
                      </div>
                      <div v-else
                           class="folderStyle"
                           style="max-width:180px"
                           @click.stop="fileClick(data)">
                        {{formatterByColum(tableConf, data, 'fileName')}}
                      </div>
                    </div>
                  </VRow>
                </VCol>
                <VCol cols="12"
                      class="phoneDataSub">
                  <VRow>
                    {{formatterByColum(tableConf, data, 'createDate') 
                  + "&emsp;" +
                   formatterByColum(tableConf, data, 'length')}}
                  </VRow>
                </VCol>
              </VRow>
            </td>
          </tr>
        </tbody>
      </VFadeTransition>
      <!-- 移动设备UI end-->
    </VTable>

    <VRow>
      <VCol v-if="state.tableLoading"
            align="center"
            :style="state.progressStyle"
            justify="center">
        <v-progress-circular indeterminate
                             color="primary"></v-progress-circular>
      </VCol>
    </VRow>

    <DeleteConfirm :show-confirm="state.deleteDialog.showDialog"
                   title="提示"
                   :msg="state.deleteDialog.deleteMsg"
                   @confirm-click="deleteConfirm"
                   @cancel-click="state.deleteDialog.showDialog = false" />

    <Upload title="上传文件"
            :show-up-dialog="state.dialog.showUpDialog"
            @close="upDialogClose" />
  </VCard>

</template>
<script lang="ts" setup>
import panAPI from '@/api/pan'
import fileAPI from '@/api/file'
import Message from '@/layouts/components/message/message'
import { arrayRemove, isMobile } from '@core/utils/index'
import SvgIcon from '@/layouts/components/SvgIcon.vue'
import Upload from '@/layouts/components/uploader/upload.vue'
import DeleteConfirm from '@/layouts/components/DeleteConfirm.vue'
import { useTheme } from 'vuetify'

const state = reactive({
  renameData: {},
  newName: '',
  createDir: false,
  newDirName: '',
  tableData: [],
  tableLoading: false,
  lightTheme: true,
  svgs: [
    {
      sufArr: ['zip', '7z', 'rar', 'war'],
      name: 'pkg',
    },
    {
      sufArr: ['doc', 'docx'],
      name: 'word',
    },
    {
      sufArr: ['xls', 'xlsx'],
      name: 'excel',
    },
    {
      sufArr: ['pdf'],
      name: 'pdf',
    },
    {
      sufArr: ['txt'],
      name: 'txt',
    },
    {
      sufArr: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'],
      name: 'img',
    },
    {
      sufArr: ['exe'],
      name: 'exe',
    },
  ],
  selectedList: [],
  partSelected: false,
  titleCheckboxSelected: false,
  cardStyle: '',
  tableHeight: 0,
  progressStyle: '',
  navs: [
    {
      title: '全部文件',
      id: '',
    },
  ],
  dialog: {
    showUpDialog: false,
  },
  deleteDialog: {
    showDialog: false,
    deleteMsg: '',
  },
})

onMounted(async () => {
  state.tableHeight = window.innerHeight * 0.68
  setProgressStyle(state.tableHeight)
  // state.cardStyle = 'height:' + window.innerHeight * 0.8 + 'px'
  getFileListByParentID(null)
})

const rename = (data: any) => {
  state.renameData = data
  state.newName = data.fileName
}

const renameConfirm = () => {
  const params = {
    id: state.renameData.id,
    fileName: state.newName,
  }
  panAPI.rename(params).then(res => {
    if (res.code === '200') {
      Message.success(res.data)
      state.renameData.fileName = state.newName
      state.renameData = {}
    }
  })
}

const setProgressStyle = (tableheight: number) => {
  state.progressStyle = 'margin-top: -' + tableheight * 0.75 + 'px'
}

const deleteFile = () => {
  let msg = '确认删除吗?'
  for (const data of state.selectedList) {
    if (data.fileFlag === 'N') {
      msg = '此操作会删除目录及目录下所有文件, 确认删除吗?'
      break
    }
  }
  state.deleteDialog.deleteMsg = msg
  state.deleteDialog.showDialog = true
}

const deleteConfirm = (dialogState: any) => {
  let params = {
    permanentFlag: dialogState.permanentFlag ? 'Y' : 'N',
    idList: [],
  }
  for (const data of state.selectedList) {
    params.idList.push(data.id)
  }
  fileAPI.deleteFiles(params).then(res => {
    if (res.code === '200') {
      dialogState.showConfirm = false
      Message.success(res.data)
      getFileListByParentID(state.navs[state.navs.length - 1].id)
    }
    state.deleteDialog.showDialog = false
  })
}

const downFile = () => {
  for (const data of state.selectedList) {
    if (data.fileFlag === 'N') {
      Message.warning('暂不支持下载文件夹')
      return
    }
  }

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

const upDialogClose = (showUpDialog: boolean) => {
  state.dialog.showUpDialog = showUpDialog
}

const createDir = () => {
  const params = {
    fileName: state.newDirName,
    parentId: state.navs[state.navs.length - 1].id,
  }

  if (!state.newDirName) {
    Message.warning('请输入文件夹名称')
    return
  }

  panAPI.createDir(params).then(res => {
    if (res.code === '200') {
      //创建目录成功
      state.newDirName = ''
      state.createDir = false
      state.tableData.unshift(res.data)
    }
  })
}

/**
 * 文件/文件夹点击
 * @param data row
 */
const fileClick = (data: any) => {
  if (data.fileFlag === 'N') {
    state.tableLoading = true
    let nav = {
      title: data.fileName,
      id: data.id,
    }
    const params = {
      pageNumber: 1,
      pageSize: 100,
      parentId: data.id,
    }
    panAPI.getFileListByParentID(params).then(res => {
      if (res.code === '200') {
        state.tableData = res.data.list
        state.navs.push(nav)
      }
      state.tableLoading = false
    })
  } else {
    //选中文件
    rowClick(data)
  }
}

/**
 * 行点击事件
 * @param data row
 */
const rowClick = (data: never) => {
  const index = state.selectedList.indexOf(data)
  if (index === -1) {
    state.selectedList.push(data)
  } else {
    state.selectedList = arrayRemove(state.selectedList, data)
  }
}

/**
 * 导航栏点击
 * @param nav 被点击导航
 */
const navClick = (nav: any) => {
  for (let i = 0; i < state.navs.length; i++) {
    if (state.navs[i].id === nav.id) {
      state.navs = state.navs.slice(0, i + 1)
      getFileListByParentID(nav.id)
      break
    }
  }
}

/**
 * 根据父id查询文件列表
 * @param parentId 父id
 */
const getFileListByParentID = (parentId: string | null) => {
  state.tableLoading = true
  state.selectedList = []
  const params = {
    pageNumber: 1,
    pageSize: 100,
    parentId: parentId,
  }
  panAPI.getFileListByParentID(params).then(res => {
    if (res.code === '200') {
      state.tableData = res.data.list
    }
    state.tableLoading = false
  })
}

// 高度变化
window.onresize = function () {
  state.tableHeight = window.innerHeight * 0.68
  setProgressStyle(state.tableHeight)
  // state.cardStyle = 'height:' + window.innerHeight * 0.8 + 'px'
}

const vuetifyTheme = useTheme()
state.lightTheme = vuetifyTheme.global.name.value === 'light'
watch(
  () => [...state.selectedList, vuetifyTheme.global.name.value],
  ([newList, newTheme], [oldList, oldTheme]) => {
    if (newList && newList != oldList) {
      //监听选中事件
      if (state.selectedList.length > 0 && state.selectedList.length !== state.tableData.length) {
        state.titleCheckboxSelected = false
        state.partSelected = true
      } else if (state.selectedList.length === 0) {
        state.titleCheckboxSelected = false
        state.partSelected = false
      } else if (state.selectedList.length === state.tableData.length) {
        state.partSelected = false
        state.titleCheckboxSelected = true
      }
    } else if (!newList) {
      state.titleCheckboxSelected = false
      state.partSelected = false
    }
    if (newTheme != oldTheme) {
      state.lightTheme = vuetifyTheme.global.name.value === 'light'
    }
  },
)

/**
 * 全选checkbox点击事件
 */
const titleCheckboxClick = () => {
  if (state.partSelected || !state.titleCheckboxSelected) {
    //部分选中 或 没有选中
    state.titleCheckboxSelected = true
    state.partSelected = false
    state.selectedList = []
    for (let data of state.tableData) {
      state.selectedList.push(data)
    }
  } else if (state.titleCheckboxSelected) {
    //已经全部选中 执行全部取消选中
    state.titleCheckboxSelected = false
    state.selectedList = []
  }
}

const getSVG = (data: any) => {
  if (data.fileFlag === 'N') {
    return 'folder'
  } else {
    const fileName = data.fileName
    if (fileName.indexOf('.') != -1 && fileName.indexOf('.') + 1 != fileName.length) {
      const suf: string = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
      for (const svg of state.svgs) {
        if (svg.sufArr.indexOf(suf) != -1) {
          return svg.name
        }
      }
    }
  }
  return 'file'
}

const tableConf = [
  {
    header: '文件名',
    colum: 'fileName',
    width: '300px',
  },
  {
    header: '修改日期',
    colum: 'createDate',
    width: '200px',
  },
  {
    header: '大小',
    colum: 'length',
    width: '180px',
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
]

const getWidthStyle = (conf: any) => {
  if (conf.width) {
    return 'max-width:' + conf.width + ';width:' + conf.width
  }
  return ''
}

const formatter = (conf: any, data: any) => {
  let res
  if (conf.formatter) {
    res = conf.formatter(data)
  } else {
    res = data[conf.colum]
  }

  let sub = 100
  if (isMobile()) {
    sub = 30
  }

  if (res && res.length > sub) {
    res = res.substring(0, sub) + '...'
  }
  return res
}

const formatterByColum = (confArr: any, data: any, colum: string) => {
  let conf
  for (const c of confArr) {
    if (c.colum === colum) {
      conf = c
    }
  }
  return formatter(conf, data)
}
</script>
<style scoped>
.v-responsive {
  max-width: 25px !important;
  margin-right: 5px;
}
.folderStyle {
  margin-left: 5px;
  margin-top: 2px;
}
.folderStyle:hover {
  color: #9155fd;
  text-decoration: underline;
  cursor: pointer;
}

.dataTr:hover {
  background-color: #f2faff;
}
.dataTrDark:hover {
  background-color: #28243d;
}

.customLevelNav {
  font-size: 14px;
  color: #9155fd;
}
.customLevelNavDisbale {
  font-size: 14px;
}
.customLevelNav:hover {
  text-decoration: underline;
  cursor: pointer;
}

.phoneData {
  margin-top: 25px;
}
.phoneDataSub {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}

.createDirIcon {
  margin-right: 10px;
  cursor: pointer;
}

:deep(.v-field__field) {
  max-height: 35px;
}

:deep(.v-input__control) {
  max-height: 35px;
}

:deep(.v-field__input) {
  max-height: 35px;
  min-height: 35px;
}
</style>

