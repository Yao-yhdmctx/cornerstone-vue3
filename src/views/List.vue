<script setup lang="ts">
import mitt from "@/plugins/mitt";
import { ref } from "@vue/reactivity";
import { nextTick, onMounted } from "@vue/runtime-core";
import Hammer from "hammerjs";
import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneTools from "cornerstone-tools";
import { useCounterStore } from "@/store/index";
import {itemType} from '@/type/imagesDisplay'
//对cornerstone库的一些初始化操作
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
if (!cornerstoneWADOImageLoader.initialized) {
  const config = {
    webWorkerPath: "/codecs/cornerstoneWADOImageLoaderWebWorker.js",
    taskConfiguration: {
      decodeTask: {
        codecsPath: "/codecs/cornerstoneWADOImageLoaderCodecs.js",
      },
    },
  };
  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
  cornerstoneWADOImageLoader.initialized = true;
}

let files = ref<itemType[][]>([]);
let dicomListDiv = ref<HTMLDivElement | null>();
const counter = useCounterStore();

//初始化cornerstoneTools
onMounted(() => {
  cornerstoneTools.init();
});
//将数据给到这个组件
mitt.on("forList", (data: itemType[][]) => {
  files.value = data;
  nextTick(() => {
    let element:any = dicomListDiv.value;
    console.log(element);
    
    for (let i = 0; i < element.length; i++) {
      cornerstone.enable(element[i]);
      let image = files.value[i][0].image;
      cornerstone.displayImage(element[i], image);
    }
  });
});
// 点击每个列表就告诉image组件  我点击的是那个index 你就展示哪一个
function clickList(data: number): void {
  mitt.emit("clickList", data);
}

</script>
<template>
  <v-sheet width="100%" class="bg-imageBackColor overflow-auto listDiv">
    <v-sheet class="bg-imageBackColor">
      <v-sheet
        class="borderButtom bg-imageBackColor d-flex flex-column align-center"
      >
        <span style="margin: 10px 0; vertical-align: middle"
          ><v-icon size="20" >$mdi-Account</v-icon> {{counter.userName}} {{counter.userBirthTimeAndAge}}</span
        >
      </v-sheet>
      <v-sheet class="bg-imageBackColor d-flex flex-column align-center">
        <span>{{counter.acquisitionTime}}</span>
        <span>{{counter.description}}</span>
        <!-- <span>{{counter.SeriesDescription}}</span> -->
      </v-sheet>
    </v-sheet>
    <v-sheet
      v-for="(item, index) in files"
      :key="index"
      class="borders bg-imageBackColors"
      style="margin-bottom: 1px"
      @click="clickList(index)"
    >
      <div ref="dicomListDiv" style="width: 100%; height: 100%"></div>
      <div
        style="position: absolute; top: 0; right: 0; width: 100%; height: 100%"
      >
      <span style="color:#fff;position: absolute;right: 0;bottom: 0;">{{item.length}}</span>
      <span class="span02" >{{item[0].SeriesDescription}}</span>
    </div>
    </v-sheet>
  </v-sheet>
</template>
<style lang="less" scoped>
.listDiv {
  height: 100%;
  min-width: 150px;
  font-size: 12px;
  /* 隐藏滚动条 */
  overflow-x: scroll; /* 设置溢出滚动 */
  white-space: nowrap;
  overflow-y: hidden;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .borders {
    position: relative;
    border-top: 40px solid #6b6b6b;
    border-bottom: 40px solid #6b6b6b;
    border-left: 20px solid #6b6b6b;
    border-right: 20px solid #6b6b6b;
    // min-width: 150px;
    height: 200px;
    .span02{
      display: inline-block;
      color: #fff;
      position: absolute;
      text-align: center;
      width: 100px;
      height: 20px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: -30px auto;
    }
  }

  .borderButtom {
    border-bottom: 1px solid #6b6b6b;
    overflow: hidden;
  }
  .father ::-webkit-scrollbar {
    width: 0px;
  }
}
</style>