<!-- vuetify3 暂时没有VDataTable组件 暂时使用自定义table组件 -->
<template>
  <VCard>

    <div style="max-width:100%">
      <div class="text-center"
           v-if="state.tableData.length === 0 && !tableLoading">
        <div style="margin-top: 5%; margin-bottom: 5%">无数据</div>
      </div>

      <VTable v-if="state.tableData.length > 0 || tableLoading"
              height="300"
              fixed-header
              transition="fade-transition">

        <thead>
          <tr>
            <th v-if="enableCheckBox"
                style="width:36px; max-width: 36px;">
              <VCheckbox :indeterminate="state.partSelected"
                         @click="titleCheckboxClick"
                         v-model="state.titleCheckboxSelected"
                         style="width:36px"
                         color="#9155FD" />
            </th>
            <th class="text-center"
                v-for="conf in tableConf"
                :style="getWidthStyle(conf)">
              {{ conf.header }}
            </th>
          </tr>
        </thead>

        <VFadeTransition>
          <tbody v-show="!tableLoading">
            <tr v-for="data in state.tableData"
                :class="state.lightTheme ? 'dataTr' : 'dataTrDark'"
                @click="rowClick(data)">
              <td v-if="enableCheckBox"
                  style="width: 36px; max-width: 36px;">
                <VCheckbox v-model="state.selectedList"
                           @click.stop=""
                           :value="data"
                           color="#9155FD"
                           style="width: 36px;" />
              </td>
              <td v-for="conf in tableConf"
                  @mouseover="state.hoverRowData = data;state.hoverColum=conf.colum"
                  @mouseleave="state.hoverRowData = {}"
                  class="text-center text-truncate"
                  :style="getWidthStyle(conf)">
                <v-tooltip :text="formatter(conf, data)">
                  <template v-slot:activator="{ props }">
                    <div v-if="state.alterRowData == data && state.alterColum == conf.colum">
                      <VRow align="center"
                            justify="center"
                            cols="12">
                        <VCol lg="9"
                              md="9"
                              cols="7">
                          <VTextField @click.stop=""
                                      v-model="state.newName"></VTextField>
                        </VCol>
                        <VCol lg="3"
                              md="3"
                              cols="5">
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
                        </VCol>

                        <!-- </VCol> -->
                      </VRow>
                    </div>
                    <div v-else>
                      <span v-if="!conf.alter"
                            v-bind="props">{{formatter(conf, data)}}</span>
                      <VRow v-else
                            align="center"
                            justify="center"
                            cols="12">
                        <VCol lg="9"
                              md="9"
                              cols="7"
                              class="text-center text-truncate">
                          <span v-bind="props">{{formatter(conf, data)}}</span>
                        </VCol>
                        <VCol lg="3"
                              md="3"
                              cols="5"
                              right>
                          <VBtn v-if="conf.alter && state.hoverRowData == data && state.hoverColum == conf.colum"
                                style="max-height:45px"
                                right
                                @click.stop="state.alterRowData = data; state.alterColum = conf.colum"
                                variant="text">
                            {{conf.alterText ? conf.alterText : '修改'}}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </div>
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </VFadeTransition>
      </VTable>
      <VRow>
        <VCol v-if="tableLoading"
              align="center"
              style="margin-top: -180px"
              justify="center">
          <v-progress-circular indeterminate
                               color="primary"></v-progress-circular>
        </VCol>
      </VRow>

      <!-- <div class="text-center"> -->

      <!-- </div> -->

    </div>
    <VRow style="margin-top: 20px; margin-bottom: 5px;"
          align="center"
          justify="center">
      <VPagination style="max-width: 250px; text-align:center;"
                   v-model="state.pageNumber"
                   :length="Math.ceil(total / pageSize)"
                   :total-visible="5">
      </VPagination>
      <div style="margin-top: 12px; margin-left: 20px">
        <p>{{state.pageMsg}}</p>
      </div>
      <VSelect style="margin-left: 20px; max-width: 66px;"
               :items="state.pageSizeConf"
               v-model="state.pageSize" />

    </VRow>
  </VCard>
</template>

<script lang="ts" setup>
import { arrayRemove } from '@/@core/utils'
import { useTheme } from 'vuetify'
import SvgIcon from './SvgIcon.vue';

const props = defineProps({
  tableConf: {
    type: Object,
    default: {},
  },
  tableData: {
    type: Array<any>,
    default: () => [],
  },
  tableLoading: {
    type: Boolean,
    default: true,
  },
  pageNumber: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 5
  },
  total: {
    type: Number,
    default: 0
  },
  enableCheckBox: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  tableData: [],
  selectedList: [],
  partSelected: false,
  titleCheckboxSelected: false,
  pageNumber: 1,
  lightTheme: true,
  tableHeight: 0,
  progressStyle: '',
  pageSize: 5,
  pageSizeConf: [5, 10, 20],
  pageMsg: '',
  hoverRowData:{},
  hoverColum:'',
  alterRowData:{},
  alterColum:'',
})


onMounted(async () => {
  state.tableHeight = window.innerHeight * 0.68
  setProgressStyle(state.tableHeight)
  // state.cardStyle = 'height:' + window.innerHeight * 0.8 + 'px'
})

/**
 * 行点击事件
 * @param data row
 */
 const rowClick = (data: never) => {
  if (props.enableCheckBox) {
    const index = state.selectedList.indexOf(data)
  if (index === -1) {
    state.selectedList.push(data)
  } else {
    state.selectedList = arrayRemove(state.selectedList, data)
  }
  }
}

const setProgressStyle = (tableheight: number) => {
  state.progressStyle = 'margin-top: -' + tableheight * 0.75 + 'px'
}

const vuetifyTheme = useTheme()
state.lightTheme = vuetifyTheme.global.name.value === 'light'
watch(
  () => [state.pageNumber, props.tableData, 
  vuetifyTheme.global.name.value, state.pageSize, ...state.selectedList
  ],
  ([newPageNumber, newTableData, newTheme, newPageSize, newList], 
  [oldPageNumber, oldTableData, oldTheme,  oldPageSize, oldList]) => {
    
    if (oldTableData != newTableData) {
      state.tableData = props.tableData
      setPageInfo()
    }
    
    if (newPageNumber != oldPageNumber) {
      pageChanged(newPageNumber)
    }

    if (newPageSize != oldPageSize) {
      pageSizeChanged(newPageSize)
    }


    if (newTheme != oldTheme) {
      state.lightTheme = vuetifyTheme.global.name.value === 'light'
    }
    if (newList && newList != oldList) {
      selectedChanged()
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
      selectedChanged()
      state.titleCheckboxSelected = false
      state.partSelected = false
    }
  },
)

watchEffect(() => {
  state.pageSize = props.pageSize
  state.pageNumber = props.pageNumber
})

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

const getWidthStyle = (conf: any)=> {
  if (conf.width) {
    return 'max-width:' + conf.width + ";min-width:" + conf.width ;
  }
  return ''
}

const formatter = (conf: any, data: any) => {

  let res;
  if (conf.formatter) {
    res = conf.formatter(data)
  } else {
    res = data[conf.colum]
  }
  if (res && res.length > 100) {
    res = res.substring(0,100) + "..."
  }
  return res
}

const setPageInfo = () => {
  let number = state.pageNumber;
  let size = state.pageSize;

  let start = (number - 1)*size + 1
  if (start > props.total) {
    start = props.total
  }

  let end = number * size;
  if (end > props.total) {
    end = props.total
  }
  state.pageMsg = start + '-' + end + " of " + props.total
}

const emit = defineEmits(['pageChanged','selectedChanged', 'pageSizeChanged', 'rowDataChanged']) // 自定义事件的名称
const pageChanged = (newPageNumber: number) => {
  emit('pageChanged', newPageNumber) // 第一个参数是自定义事件的名称，第二个是要传递的参数
}
const pageSizeChanged = (newPageSize: number) => {
  emit('pageSizeChanged', newPageSize) // 第一个参数是自定义事件的名称，第二个是要传递的参数
}
const selectedChanged = () => {
  emit('selectedChanged', state.selectedList)
}
const rowDataChanged = (row: any, colum: string, val: any)=> {
  emit('rowDataChanged', row, colum, val)
}
</script>

<style scoped>
.dataTr:hover {
  background-color: #f2faff;
}
.dataTrDark:hover {
  background-color: #28243d;
}
</style>
