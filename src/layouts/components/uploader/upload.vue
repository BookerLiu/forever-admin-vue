<template>
  <VDialog style="margin-bottom: 10%"
           max-width="650px"
           persistent
           v-model="props.showUpDialog">
    <VCard :title="props.title">
      <VCardText>
        <VForm ref="upForm"
               @submit.prevent>
          <VRow>
            <VCol cols="12">
              <v-file-input v-model="state.form.files"
                            dense
                            counter
                            label="选择文件(多选)"
                            required
                            :rules="state.rules.fileRules"
                            multiple
                            prepend-icon=""
                            prepend-inner-icon="mdi-folder-play"
                            variant="outlined"
                            :show-size="1000">
                <template v-slot:selection="{ fileNames }">
                  <template v-for="(fileName, index) in fileNames"
                            :key="fileName">
                    <v-chip v-if="index < 2"
                            color="primary"
                            label
                            size="small"
                            class="mr-2">
                      {{ fileName }}
                    </v-chip>

                    <span v-else-if="index === 2"
                          class="text-overline text-grey-darken-3 mx-2">
                      +{{ form.files.length - 2 }} File(s)
                    </span>
                  </template>
                </template>
              </v-file-input>
              <span v-if="state.upLoading"
                    class="smallFontSize">{{ state.upStatusInfo }}</span>
              <v-progress-linear :active="state.upLoading"
                                 :buffer-value="state.upProgress"
                                 stream
                                 absolute
                                 bottom
                                 color="red"></v-progress-linear>
            </VCol>
            <VCol cols="12">
              <VTextField v-model="state.form.biref"
                          prepend-inner-icon="mdi-clipboard-text"
                          label="简介"
                          placeholder="简介" />
            </VCol>
            <!-- <VCol cols="12">
              <VSelect :v-model="state.form.customType"
                       label="分类"
                       :items="state.types"
                       item-value="val"
                       item-title="title" />
            </VCol> -->

            <VCol cols="12">
              <VSelect v-model="state.form.share"
                       label="是否共享"
                       prepend-inner-icon="mdi-share-variant"
                       :items="state.shareItem"
                       item-value="val"
                       item-title="title" />
            </VCol>

            <VCol cols="12">
              <VTreeview v-model="state.form.dirId">

              </VTreeview>
              <VTextField v-model="state.form.dirId"
                          prepend-inner-icon="mdi-folder"
                          label="目录(待开发,缺少treeview组件)"
                          placeholder="目录" />
              <!-- <v-select v-model="state.selectedFruits"
                        :items="state.fruits"
                        label="Favorite Fruits">
              </v-select> -->
            </VCol>

            <!-- <VCol cols="12">
              <v-treeview activatable
                          :items="state.items"></v-treeview>
            </VCol> -->

            <VCol cols="12">
              <VBtn type="submit"
                    :loading="state.subBtnLoading"
                    :disabled="state.subBtnLoading"
                    @click="upFile"
                    class="me-2">
                {{state.subBtnText}}
              </VBtn>

              <VBtn color="secondary"
                    @click="reset"
                    :disabled="state.subBtnLoading"
                    variant="tonal"
                    class="me-2">
                重置
              </VBtn>

              <VBtn color="secondary"
                    variant="tonal"
                    @click="dialogClose"
                    :disabled="state.subBtnLoading"
                    class="me-2">
                关闭
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
// import videoAPI from '@/api/video'
import fileAPI from '@/api/file'
import FileUtil from '@core/utils/fileUtil'
import Message from '@/layouts/components/message/message'
const props = defineProps({
  showUpDialog: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '上传文件',
  },
})

const state = reactive({
  form: {
    files: [],
    biref: '',
    share: '是',
    dirId: '',
  },
  types: [],
  upProgress: 2,
  upStatusInfo: '',
  upLoading: false,
  subBtnText: '上传',
  subBtnLoading: false,
  showUpDialog: false,
  shareItem: [
    {
      title: '是',
      val: 'Y',
    },
    {
      title: '否',
      val: 'N',
    },
  ],
  rules: {
    fileRules: [
      (value: any) => {
        if (value.length === 0) {
          return '请选择文件'
        }
        return true
      },
    ],
    dirRules: [
      (value: any) => {
        if (!value) {
          return '请选择上传目录'
        }
        return true
      },
    ],
  },
})

watch(
  () => props.showUpDialog,
  () => {
    state.showUpDialog = props.showUpDialog
  },
)

onMounted(() => {
  // videoAPI.getVideoCustomTypes({}).then(res => {
  //   if (res.code === '200') {
  //     state.types = res.data
  //   }
  // })
})

//上传文件
const upFile = async () => {
  if (state.subBtnText === '完成') {
    dialogClose()
    return
  }

  let files: Array<File> = state.form.files

  if (state.form.files.length === 0) {
    return
  }

  //开始提交按钮loading效果 禁用重置关闭按钮
  state.subBtnLoading = true

  //分配块大小
  const chunkSize = 2097152

  let isError = false

  //循环上传文件
  nextFile: for (const file of files) {
    //打开文件上传进度条  并重置默认值
    state.upLoading = true
    state.upProgress = 2
    state.upStatusInfo = '校验文件:' + file.name

    //计算文件MD5
    let md5 = await FileUtil.MD5(file)

    //开始准备上传文件
    state.upStatusInfo = '上传文件:' + file.name
    //定义参数
    let upData = {
      md5: md5,
      blob: {},
      chunkNum: 0,
      chunkCount: 0,
    }

    //第一个分片文件包含完整信息
    let firstUpData = {
      fileName: file.name,
      md5: md5,
      biref: state.form.biref,
      dirId: state.form.dirId,
      length: file.size,
      blob: new Blob(),
      chunkNum: 0,
      chunkCount: 0,
    }

    //检查文件是否已经上传过
    const checkFileRes = await fileAPI.checkFileExits({ md5: md5 })
    if (checkFileRes.code === '200') {
      const fileSize = file.size //文件大小
      //分块数量
      const chunks = Math.ceil(fileSize / chunkSize) === 0 ? 1 : Math.ceil(fileSize / chunkSize)
      let currentChunk = 0

      if (checkFileRes.data.exist === 'Y') {
        //文件已经上传
        //上传此文件的MD5 和 文件名
        const upRes = await fileAPI.upFile(firstUpData)
        if (upRes.code === '200') {
          state.upProgress = 100
          state.upLoading = false
          state.upStatusInfo = file.name + '上传完成'
          Message.success(file.name + ' 上传成功')
        } else {
          isError = true
          Message.error(state.upStatusInfo + '上传失败!')
        }

        continue nextFile
      } else if (checkFileRes.data.cutExist === 'Y') {
        if (checkFileRes.data.cutNum + 1 === chunks) {
          //分片上传完成  但是没有合并文件
          state.upStatusInfo = '合并文件:' + file.name
          const mergeRes = await fileAPI.mergeCutFile({ md5: md5 })
          if (mergeRes.code === '200') {
            state.upStatusInfo = file.name + '上传完成'
            Message.success(file.name + ' 上传成功')
          } else {
            isError = true
            Message.error(state.upStatusInfo + '上传失败!')
          }
        } else {
          //分片上传未完成
          state.upProgress = (checkFileRes.data.cutNum + 1 / chunks) * 100 //使用上一次分片上传的位置进度
          currentChunk = checkFileRes.data.cutNum + 1
        }
      }

      for (let c = currentChunk; c < chunks; c++) {
        //开始分片上传
        const start = c * chunkSize
        const end = start + chunkSize > file.size ? file.size : start + chunkSize
        console.log('start:', start, ',end:', end)
        let blobSlice = file.slice(start, end)

        let upRes
        if (currentChunk == 0) {
          firstUpData.blob = blobSlice
          firstUpData.chunkNum = c
          firstUpData.chunkCount = chunks
          upRes = await fileAPI.upFile(firstUpData)
        } else {
          upData.blob = blobSlice
          upData.chunkNum = c
          upData.chunkCount = chunks
          upRes = await fileAPI.upFile(upData)
        }
        if (upRes.code === '200') {
          state.upProgress = Math.ceil((c + 1) / chunks) * 100 > 100 ? 100 : ((c + 1) / chunks) * 100
          if (c + 1 === chunks && chunks > 1) {
            //分片上传完成  合并文件
            state.upStatusInfo = '合并文件:' + file.name
            const mergeRes = await fileAPI.mergeCutFile({ md5: md5 })
            if (mergeRes.code === '200') {
              state.upStatusInfo = file.name + '上传完成'
              Message.success(file.name + ' 上传成功')
            } else {
              isError = true
              Message.error(state.upStatusInfo + '上传失败!')
            }
          } else if (chunks === 1) {
            state.upStatusInfo = file.name + '上传完成'
            Message.success(file.name + ' 上传成功')
          }
        } else {
          isError = true
          Message.error(state.upStatusInfo + '上传失败!')
          continue nextFile
        }
      }
    } else {
      isError = true
      Message.error(state.upStatusInfo + '上传失败!')
      continue nextFile
    }
  }
  if (!isError) state.subBtnText = '完成'
  state.subBtnLoading = false
}

const emit = defineEmits(['close']) // 自定义事件的名称
const dialogClose = () => {
  reset()
  emit('close', false) // 第一个参数是自定义事件的名称，第二个是要传递的参数
}

//重置参数
const reset = () => {
  state.types = []
  state.upProgress = 2
  state.upStatusInfo = ''
  state.upLoading = false
  state.subBtnText = '上传'
  state.subBtnLoading = false

  state.form.files = []
  state.form.biref = ''
  state.form.share = 'Y'
  state.form.dirId = ''
}
</script>

<style>
.smallFontSize {
  font-size: 13px;
}
</style>
