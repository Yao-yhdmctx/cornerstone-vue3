<script setup lang="ts">
import { reactive, ref } from "vue";
import mitt from "@/plugins/mitt";
import { titleType } from "@/type/Toolbar";
import { useCounterStore } from "@/store/index";

let flag = ref<boolean>(true);
let playShow = ref<boolean>(true)
let items = reactive<Array<titleType>>([
  { title: "长度测量" },
  { title: "面积测量" },
  { title: "选择多边形" },
  { title: "打开多边形" },
  { title: "角度测量" },
  { title: "脊柱侧弯角" },
  { title: "差值测量" },
  { title: "箭头" },
  { title: "自由画线" },
  { title: "病灶定位" },
]);
let rotation = reactive<Array<titleType>>([
  { title: "逆时针旋转90°" },
  { title: "顺时针旋转90°" },
  { title: "旋转90°" },
  { title: "水平翻转" },
  { title: "垂直翻转" },
  { title: "清除改变" },
]);
let enlarge = reactive<Array<titleType>>([
  { title: "全屏" },
  { title: "100%" },
  { title: "200%" },
  { title: "400%" },
  { title: "800%" },
  { title: "放大" },
  { title: "缩小" },
]);
let windowWidth = reactive<Array<titleType>>([
  { title: "默认窗口" },
  { title: "全部动态范围" },
  { title: "CT 腹窗" },
  { title: "CT 血管窗" },
  { title: "CT 骨窗" },
  { title: "CT 脑窗" },
  { title: "CT 纵膈窗" },
  { title: "CT 肺窗" },
  { title: "负片" },
  { title: "常规窗" },
]);
let inputFile = ref<HTMLInputElement>();
const counter = useCounterStore();
// 点击按钮触发上传的input
function clickInput(): void {
  inputFile.value?.click();
}
// 标尺
function addDraw(item: titleType): void {
  let str: string = "";
  item ? (str = item.title) : (str = "");
  mitt.emit("addDraw", str);
}
//旋转
function rotating(item: titleType): void {
  let str: string = item.title;
  mitt.emit("rotating", str);
}
//局部放大
function amplification(): void {
  mitt.emit("amplification", {});
}
// 整体放大
function bodyAmplification(item: titleType): void {
  let str: string = item.title;
  mitt.emit("bodyAmplification", str);
}
//窗口显示调整
function windowsAdjust(item: titleType): void {
  let str: string = item.title;
  mitt.emit("windowsAdjust", str);
}
//上传文件
function files(e: any): void {
  mitt.emit("files", e);
}
// 滚动工具
function Scrolls(): void {
  mitt.emit("Scrolls", {});
}
//移动工具
function move(): void {
  mitt.emit("move", {});
}
//播放
function play(): void {
  mitt.emit("play", {});
}
// 全屏按钮
function fillScreen(): void {
  if (flag.value) {
    // 全屏
    document.documentElement.webkitRequestFullscreen();
    flag.value = false;
  } else {
    // 退出全屏
    document.webkitExitFullscreen();
    flag.value = true;
  }
}
//显示隐藏文字
function showText(): void {
  mitt.emit("showText", {});
}
//下载
function downloadImg():void{
  mitt.emit('downloadImg',{})
}
//显示隐藏播放
// 展示选择的列表
mitt.on("playShow", (data:boolean) => {
  playShow.value = data
});
</script>

<template >
  <v-sheet class="rightDiv">
    <v-card
      class="d-flex flex-column bg-something"
      width="52px"
      height="100%"
      style="border-radius: 0"
    >
      <v-btn-toggle
        class="d-flex flex-column align-center"
        rounded="0"
        style="height: 100%"
        selected-class="btns"
        shaped
        mandatory
      >
        <v-btn  class="btn mt-1 mb-1" style="position: relative">
          <v-icon
            icon="$mdi-Arrow-ExpandAll"
            size="25"
            @click="fillScreen"
          ></v-icon>
        </v-btn>
        <v-menu location="end">
          <template v-slot:activator="{ props }">
            <v-btn
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
              @click="clickInput"
            >
              <v-icon icon="$mdi-Folder" size="27"></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
            <v-file-input
              @change="files"
              multiple
              persistent-hint
              label="File input"
              variant="filled"
              ref="inputFile"
              style="display: none"
            >
            </v-file-input>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item> 123 </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative" @click="downloadImg">
          <v-icon icon="$mdi-Arrow-Collapse-Down" size="25"></v-icon>
        </v-btn>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon icon="$mdi-Arrow-Up-Bold" size="25"></v-icon>
        </v-btn>
        <v-menu  location="end">
          <template v-slot:activator="{ props }">
            <v-btn
            :disabled="counter.userId ? false : true"
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
            >
              <v-icon
                icon="$mdi-View-Dashboard-Variant-Outline"
                size="27"
              ></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item> 123 </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu  location="end">
          <template v-slot:activator="{ props }">
            <v-btn
            :disabled="counter.userId ? false : true"
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
            >
              <v-icon
                icon="$mdi-Swap-Horizontal-Circle-Outline"
                size="27"
              ></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item> 123 </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon icon="$mdi-Alpha-A" size="25" @click="showText"></v-icon>
        </v-btn>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon
            icon="$mdi-File-Multiple-Outline"
            size="25"
            @click="Scrolls"
          ></v-icon>
        </v-btn>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon icon="$mdi-Arrow-All" size="25" @click="move"></v-icon>
        </v-btn>
        <v-menu location="end">
          <template v-slot:activator="{ props }">
            <v-btn
            :disabled="counter.userId ? false : true"
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
              @click="windowsAdjust"
            >
              <v-icon icon="$mdi-Circle-Slice4" size="27"></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item
                v-for="(item, index) in windowWidth"
                :key="index"
                :value="index"
                @click="windowsAdjust(item)"
              >
                {{ item.title }}
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu   location="end">
          <template v-slot:activator="{ props }">
            <v-btn
            :disabled="counter.userId ? false : true"
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
              @click="bodyAmplification"
            >
              <v-icon icon="$mdi-Magnify" size="27"></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item
                v-for="(item, index) in enlarge"
                :key="index"
                :value="index"
                @click="bodyAmplification(item)"
              >
                {{ item.title }}
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu  location="end">
          <template v-slot:activator="{ props }">
            <v-btn
            :disabled="counter.userId ? false : true"
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
              @click="addDraw"
            >
              <v-icon icon="$mdi-Ruler" size="27"></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :value="index"
                @click="addDraw(item)"
              >
                {{ item.title }}
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu  location="end">
          <template v-slot:activator="{ props }">
            <v-btn
            :disabled="counter.userId ? false : true"
              class="btn mt-2 mb-2"
              v-bind="props"
              style="position: relative"
              @click="rotating"
            >
              <v-icon icon="$mdi-Rotate-Right" size="27"></v-icon>
              <div class="downIcon">
                <v-icon icon="$mdi-Menu-Down" size="12"></v-icon>
              </div>
            </v-btn>
          </template>
          <v-card
            max-width="300"
            class="mx-auto rounded-0 elevation-0"
            color="#535353"
          >
            <v-list
              id="list"
              class="pa-0"
              bg-color="#535353"
              style="border: 1px solid #3d3d3d; color: #fff"
            >
              <v-list-item
                v-for="(item, index) in rotation"
                :key="index"
                :value="index"
                @click="rotating(item)"
              >
                {{ item.title }}
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-btn :disabled="playShow" class="btn mt-1 mb-1" style="position: relative">
          <v-icon icon="$mdi-Play-Box" size="25" @click="play"></v-icon>
        </v-btn>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon
            icon="$mdi-Magnify-Plus"
            size="25"
            @click="amplification"
          ></v-icon>
        </v-btn>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon icon="$mdi-Tablet-Cellphone" size="25"></v-icon>
        </v-btn>
        <v-btn :disabled="counter.userId ? false : true" class="btn mt-1 mb-1" style="position: relative">
          <v-icon icon="$mdi-Cog-Outline" size="25"></v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card>
  </v-sheet>
</template>

<style lang="less" scoped>
.rightDiv {
  position: relative;
  display: flex;
  flex: 1;
  // align-items: stretch;
  height: 100%;
  border-radius: 0px;
  .btn {
    border-radius: 0px;
    background-color: #535353;
    color: white;
    box-shadow: 0px 0px 0px 0px;
    min-width: 40px;
    width: 40px;
    border-radius: 0px;
    // margin:5px 0;
  }
  .btns {
    border-radius: 0px;
    background-color: black;
    color: white;
    box-shadow: 0px 0px 0px 0px;
    min-width: 40px;
    width: 40px;
  }
  .downIcon {
    position: absolute;
    bottom: -5px;
    right: -4px;
    color: #fff;
    transform: rotate(-45deg);
  }
}
</style>
<style>
.v-input__control {
  display: none;
}
/* 修改list下面的item样式 */
#list .v-list-item--density-default.v-list-item--one-line {
  min-height: 0;
  transform: scale(0.9);
  padding: 2px 15px;
}
</style>