<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "@vue/runtime-core";
import { imgType, itemType, viewportType } from "@/type/imagesDisplay";
import mitt from "@/plugins/mitt";
import Hammer from "hammerjs";
import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneTools from "cornerstone-tools";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import { useCounterStore } from "@/store/index";
import {
  getDicomPatientName,
  getDicomStudyDescription,
  getDicomStudyId,
  getDicomSeriesDescription,
  getDicomSliceThickness,
  getDicomStudyDate,
  getDicomIpp,
  getDicomSeriesNumber,
  getDicomInstanceNumber,
  getDicomSliceDistance,
  getDicomSliceLocation,
  getDicomColumns,
  getDicomRows,
  getDicomWindowCenter,
  getDicomWindowWide,
} from "@/utils/functions";

//初始化配置
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
  // eslint-disable-next-line no-import-assign
  cornerstoneWADOImageLoader.initialized = true;
}

let showAddIcon = ref<boolean>(true); //添加dicom图标
let showText = ref<boolean>(true); //显示文本信息
let isShow = ref<boolean>(false); //影藏显示
let layerGroup0 = ref<HTMLDivElement | null>(); //dom节点
let leftValue = ref<number | string>(0);
let rightValue = ref<number | string>(0);
let values = ref<number>(0);
let dicomMax = ref<number>(0);
let num = ref<number>(1);
let imagesId: Array<string> = reactive([]);
let items: itemType[][] = reactive([]);
let arr: itemType[] = reactive([]);
let pixelX = ref<number | string>(0); //x轴
let pixelY = ref<number | string>(0); //y轴
let showXY = ref<boolean>(true);
let thickness = ref<undefined | number>(); //层厚
let oldPosition = ref<undefined | number>(); //层厚
let indexValue = ref<number>(0);
let dicomNum = ref<number>(0)
const counter = useCounterStore();

// 显示隐藏x，y坐标
watch(pixelX, (newValue) => {
  if (newValue <= 0) {
    pixelX.value = 0;
  }
});
watch(pixelY, (newValue) => {
  if (newValue <= 0) {
    pixelY.value = 0;
  }
});
// 滚动条滚动dcm跟着滚动
watch(values, () => {
  const element = layerGroup0.value as HTMLDivElement;
  const scrollToIndex = cornerstoneTools.importInternal("util/scrollToIndex");
  scrollToIndex(element, Number(values.value));
});
// 播放功能
watch(num, (newValue) => {
  const element = layerGroup0.value as HTMLDivElement;
  if (newValue == 0) {
    cornerstoneTools.playClip(element, 7);
  } else {
    cornerstoneTools.stopClip(element);
  }
});

onMounted(() => {
  // 初始化将线条的圆圈给取消了
  cornerstoneTools.init([
    {
      moduleName: "globalConfiguration",
      configuration: {
        showSVGCursors: true,
      },
    },
    {
      moduleName: "segmentation",
      configuration: {
        outlineWidth: 2,
      },
    },
  ]);
  const element = layerGroup0.value as HTMLDivElement;
  cornerstone.enable(element);
  const LengthTool = cornerstoneTools.LengthTool;
  cornerstoneTools.addToolForElement(element, LengthTool, {
    configuration: {
      handleRadius: 2,
    },
  });
  //修改默认工具颜色
  cornerstoneTools.toolColors.setToolColor("#ADFF2F");
  // 切换dcm滚动条就滚动
  element.addEventListener(cornerstoneTools.EVENTS.STACK_SCROLL, (e) => {
    //当前索引
    values.value = e.detail.newImageIdIndex;
  });
  element.addEventListener(cornerstone.EVENTS.NEW_IMAGE, () => {
    const s =
      cornerstoneTools.getElementToolStateManager(element).toolState.stack;
    if (s) {
      values.value = s.data[0].currentImageIdIndex;
      cornerstone.loadImage(imagesId[values.value]).then((image: imgType) => {
        getUserlist(image); //提取dicom上的用户信息
      });
    }
    ///////////////////////////////////////////region
    //下面是监听各种事件
    // element.addEventListener(cornerstoneTools.EVENTS.KEY_DOWN, (e) => {
    //   console.log('KEY_DOWN');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.KEY_PRESS, (e) => {
    //   console.log('KEY_PRESS');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.KEY_UP, (e) => {
    //   console.log('KEY_UP');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_CLICK, (e) => {
    //   console.log('MOUSE_CLICK');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_DOUBLE_CLICK, (e) => {
    //   console.log('MOUSE_DOUBLE_CLICK');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN, (e) => {
    //   console.log('MOUSE_DOWN');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN_ACTIVATE, (e) => {
    //   console.log('MOUSE_DOWN_ACTIVATE');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_MOVE, (e) => {
    //   console.log('MOUSE_MOVE');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_UP, (e) => {
    //   console.log('MOUSE_UP');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_WHEEL, (e) => {
    //   const s = cornerstoneTools.getElementToolStateManager(element).toolState.stack
    //   console.log('MOUSE_WHEEL',s);
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TAP, (e) => {
    //   console.log('TAP');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_PINCH, (e) => {
    //   console.log('TOUCH_PINCH');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_ROTATE, (e) => {
    //   console.log('TOUCH_ROTATE');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_START, (e) => {
    //   console.log('TOUCH_START');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_START_ACTIVE, (e) => {
    //   console.log('TOUCH_START_ACTIVE');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.IMAGE_RENDERED, (e) => {
    //   console.log('IMAGE_RENDERED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.ACTIVE_LAYER_CHANGED, (e) => {
    //   console.log('ACTIVE_LAYER_CHANGED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.ELEMENT_DISABLED, (e) => {
    //   console.log('ELEMENT_DISABLED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.ELEMENT_ENABLED, (e) => {
    //   console.log('ELEMENT_ENABLED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.DOUBLE_TAP, (e) => {
    //   console.log('DOUBLE_TAP');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.LABELMAP_MODIFIED, (e) => {
    //   console.log('LABELMAP_MODIFIED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.CLIP_STOPPED, (e) => {
    //   console.log('CLIP_STOPPED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_ADDED, (e) => {
    //   console.log('MEASUREMENT_ADDED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, (e) => {
    //   console.log('MEASUREMENT_COMPLETED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED, (e) => {
    //   console.log('MEASUREMENT_MODIFIED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_REMOVED, (e) => {
    //   console.log('MEASUREMENT_REMOVED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_DRAG, (e) => {
    //   console.log('MOUSE_DRAG');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MULTI_TOUCH_DRAG, (e) => {
    //   console.log('MULTI_TOUCH_DRAG');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MULTI_TOUCH_START, (e) => {
    //   console.log('MULTI_TOUCH_START');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.MULTI_TOUCH_START_ACTIVE, (e) => {
    //   console.log('MULTI_TOUCH_START_ACTIVE');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.STACK_PREFETCH_DONE, (e) => {
    //   console.log('STACK_PREFETCH_DONE');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.STACK_PREFETCH_IMAGE_LOADED, (e) => {
    //   console.log('STACK_PREFETCH_IMAGE_LOADED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOOL_DEACTIVATED, (e) => {
    //   console.log('TOOL_DEACTIVATED');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_DRAG, (e) => {
    //   console.log('TOUCH_DRAG');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_DRAG_END, (e) => {
    //   console.log('TOUCH_DRAG_END');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_END, (e) => {
    //   console.log('TOUCH_END');
    // })
    // element.addEventListener(cornerstoneTools.EVENTS.TOUCH_PRESS, (e) => {
    //   console.log('TOUCH_PRESS');
    // })

    // console.log(s && s.data && s.data[0].currentImageIdIndex)
    // console.log(s);

    // console.log(chestStack.currentImageIdIndex)
    /////////////////////////////////////////////////////
  });
  console.log(cornerstoneTools, cornerstone);

  dragFile();
});
// 绑定事件
function dragFile() {
  const element = layerGroup0.value as HTMLDivElement;
  element.addEventListener("dragover", defaultHandleDragEvent);
  element.addEventListener("dragleave", defaultHandleDragEvent);
  element.addEventListener("drop", onDrop);
}
// 文件拖拽触发,并展示
function onDrop(event: DragEvent) {
  showAddIcon.value = false;
  showText.value = false;
  defaultHandleDragEvent(event);
  const target = event.dataTransfer as DataTransfer;
  const files = target.files as FileList;
  analysisDicom(files); //处理并展示dicom
}
// 阻止默认事件,好触发drop事
function defaultHandleDragEvent(event: DragEvent) {
  event.stopPropagation();
  event.preventDefault();
}
// 鼠标滑动事件
function setValue() {
  const element = layerGroup0.value as HTMLDivElement;
  element.addEventListener("mousedown", setValues);
}
// 鼠标滑动事件函数
function setValues(e: MouseEvent) {
  const element = layerGroup0.value;
  let lastX = e.pageX;
  let lastY = e.pageY;

  function mouseMoveHandler(e: { pageX: number; pageY: number }) {
    const deltaX = e.pageX - lastX;
    const deltaY = e.pageY - lastY;
    lastX = e.pageX;
    lastY = e.pageY;

    let viewport = cornerstone.getViewport(element);
    viewport.voi.windowWidth += deltaX / viewport.scale;
    viewport.voi.windowCenter += deltaY / viewport.scale;
    cornerstone.setViewport(element, viewport);
    leftValue.value = Math.round(viewport.voi.windowWidth);
    rightValue.value = Math.round(viewport.voi.windowCenter);
  }

  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
}
//移除element绑定的mousedown事件
function removeMousedown(): void {
  const element = layerGroup0.value as HTMLDivElement;
  element.removeEventListener("mousedown", setValues);
}
// 统一获取患者基本信息
function getUserlist(image: imgType) {
  dayjs.extend(objectSupport);
  counter.userId = resolveTag(
    image.data.byteArray,
    image.data.elements["x00100020"].dataOffset,
    image.data.elements["x00100020"].length
  );
  counter.userName = getDicomPatientName(image);
  let datas = resolveTag(
    image.data.byteArray,
    image.data.elements["x00100030"].dataOffset,
    image.data.elements["x00100030"].length
  );
  let age = resolveTag(
    image.data.byteArray,
    image.data.elements["x00100040"].dataOffset,
    image.data.elements["x00100040"].length
  );
  let newData = dayjs(datas).format("YYYY/M/D");
  counter.userBirthTimeAndAge = `${newData} ${age}`;
  counter.institutionName = resolveTag(
    image.data.byteArray,
    image.data.elements["x00080080"].dataOffset,
    image.data.elements["x00080080"].length
  );
  counter.description = getDicomStudyDescription(image);
  counter.studyNumber = getDicomStudyId(image);
  counter.SeriesDescription = getDicomSeriesDescription(image);
  thickness.value = getDicomSliceThickness(image);
  oldPosition.value = getDicomIpp(image, 2);
  let createDate = getDicomStudyDate(image);
  let createTime = resolveTag(
    image.data.byteArray,
    image.data.elements["x00080032"].dataOffset,
    image.data.elements["x00080032"].length
  );
  let newCreateDate = dayjs(createDate).format("YYYY/M/D");
  let newCreateTime = dayjs({
    h: createTime.slice(0, 2),
    m: createTime.slice(2, 4),
    s: createTime.slice(4, 6),
  }).format("H:m:s");
  counter.acquisitionTime = `${newCreateDate} ${newCreateTime}`;
}
// 处理dicom信息方法
function resolveTag(
  byteArray: Array<number>,
  position: number,
  len: number
): string {
  let result = "";
  for (let i = 0; i < len; i++) {
    let temp = byteArray[position + i];
    result += String.fromCharCode(temp);
  }
  return result;
}
//数组分组
function groupArray(item: itemType[]) {
  let newArr = unique(item);
  let newArray: itemType[][] = [];
  for (let i = 0; i < newArr.length; i++) {
    newArray.push([]);
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].seriesNumber == newArr[i].seriesNumber) {
        newArray[i].push(arr[j]);
      }
    }
  }
  newArray.forEach((i) => {
    i.sort((l: itemType, r: itemType) => {
      return l.instanceNumber - r.instanceNumber;
    });
  });
  return newArray;
}
// 对象数组去重
function unique(v: Array<itemType>) {
  let str: Array<itemType> = [];
  v.forEach((item: itemType) => {
    str.push(item);
  });
  for (var i = 0; i < str.length - 1; i++) {
    for (var j = i + 1; j < str.length; j++) {
      if (str[i].seriesNumber == str[j].seriesNumber) {
        str.splice(j, 1);
        // splice删除了一个元素，下标要减一，否则循环会漏掉一个元素(多个相邻的元素 可能会漏掉删除元素)
        j--;
      }
    }
  }
  return str;
}
//处理dicom图片并展示
async function analysisDicom(data: FileList) {
  let file = data;
  const element = layerGroup0.value as HTMLDivElement;
  cornerstone.enable(element);
  let imageIds: Array<string> = [];
  for (const k of file) {
    imageIds.push(cornerstoneWADOImageLoader.wadouri.fileManager.add(k));
  }
  imagesId = imageIds;

  // 将每张图片处理成对应格式并赋值给arr
  for (let i = 0; i < imageIds.length; i++) {
    await cornerstone.loadImage(imageIds[i]).then((image: imgType) => {
      const seriesNumber = getDicomSeriesNumber(image);
      const instanceNumber = getDicomInstanceNumber(image);
      const sliceDistance = getDicomSliceDistance(image);
      const sliceLocation = getDicomSliceLocation(image);
      const columns = getDicomColumns(image);
      const rows = getDicomRows(image);
      const windowCenter = getDicomWindowCenter(image);
      const windowWide = getDicomWindowWide(image);
      const SeriesDescription = getDicomSeriesDescription(image);
      let item = {
        imageId: imageIds[i],
        seriesNumber: seriesNumber,
        instanceNumber: instanceNumber,
        image: image,
        rows: rows,
        columns: columns,
        sliceDistance: sliceDistance,
        sliceLocation: sliceLocation,
        windowCenter: windowCenter,
        windowWide: windowWide,
        SeriesDescription: SeriesDescription,
      };
      arr.push(item);
      arr.sort((l: itemType, r: itemType) => {
        return l.seriesNumber - r.seriesNumber;
      });
      getUserlist(image); //提取dicom上的用户信息
    });
  }
  getDicom();
  mitt.emit("forList", items);
  // x轴和y轴坐标
  element.addEventListener("mousemove", function (event) {
    let pixelCoords = cornerstone.pageToPixel(
      element,
      event.pageX,
      event.pageY
    );
    pixelX.value = Math.floor(pixelCoords.x);
    pixelY.value = Math.floor(pixelCoords.y);
  });
  //添加滚动工具
  const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
  //添加比例叠加工具
  const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool;
  cornerstoneTools.addTool(ScaleOverlayTool, {
    configuration: {
      majorTickLength: 10,
      minorTickLength: 5.5,
    },
  });
  cornerstoneTools.setToolActive("ScaleOverlay", { mouseButtonMask: 1 });
}
// 处理完dicom后展示
function getDicom(index = 0) {
  dicomNum.value = index
  const element = layerGroup0.value as HTMLDivElement;
  indexValue.value = index;
  items = groupArray(arr);
  const oneFile = items[index];
  if (oneFile.length == 1) {
    isShow.value = false;
    mitt.emit("playShow", true);
  } else {
    isShow.value = true;
    mitt.emit("playShow", false);
  }
  const image = oneFile[0].image;
  let imageIds: Array<string> = [];
  oneFile.forEach((item: itemType) => {
    imageIds.push(item.imageId);
  });
  const stack = {
    currentImageIdIndex: 0,
    imageIds,
  };
  dicomMax.value = imageIds.length - 1;
  cornerstone.displayImage(element, image);
  cornerstoneTools.addStackStateManager(element, ["stack"]);
  cornerstoneTools.addToolState(element, "stack", stack);
  const viewport: viewportType = cornerstone.getViewport(element);
  viewport.voi.windowCenter = oneFile[0].windowCenter;
  viewport.voi.windowWidth = oneFile[0].windowWide;
  leftValue.value = Math.round(viewport.voi.windowWidth);
  rightValue.value = Math.round(viewport.voi.windowCenter);
}
// 点击上传文件
mitt.on("files", (data: Event) => {
  showAddIcon.value = false;
  showText.value = false;
  const target = data.target as HTMLInputElement;
  const files = target.files as FileList;
  analysisDicom(files); //处理并展示dicom
});
// 点击测量按钮
mitt.on("addDraw", (data: string) => {
  removeMousedown();
  if (data == "长度测量") {
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.setToolActive("Length", { mouseButtonMask: 1 });
  } else if (data == "面积测量") {
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    cornerstoneTools.addTool(EllipticalRoiTool);
    // let CircleRoiTool = cornerstoneTools.CircleRoiTool;
    // cornerstoneTools.addTool(CircleRoiTool, {
    //         configuration: {
    //             renderDashed: true, //是否渲染虚线
    //             hideHandlesIfMoving: false, //是否显示圆点移动轨迹  true 不显示  false 显示
    //         }
    //     });
    //     cornerstoneTools.setToolActive("CircleRoi", {
    //         mouseButtonMask: 1
    //     });
    cornerstoneTools.setToolActive("EllipticalRoi", { mouseButtonMask: 1 });
  } else if (data == "选择多边形") {
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
    cornerstoneTools.addTool(RectangleRoiTool);
    cornerstoneTools.setToolActive("RectangleRoi", { mouseButtonMask: 1 });
  } else if (data == "角度测量") {
    const AngleTool = cornerstoneTools.AngleTool;
    cornerstoneTools.addTool(AngleTool);
    cornerstoneTools.setToolActive("Angle", { mouseButtonMask: 1 });
  } else if (data == "箭头") {
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    cornerstoneTools.addTool(ArrowAnnotateTool);
    cornerstoneTools.setToolActive("ArrowAnnotate", { mouseButtonMask: 1 });
  } else if (data == "自由画线") {
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;
    cornerstoneTools.addTool(FreehandRoiTool);
    cornerstoneTools.setToolActive("FreehandRoi", { mouseButtonMask: 1 });
  } else {
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.setToolActive("Length", { mouseButtonMask: 1 });
  }
});
// 点击旋转
mitt.on("rotating", (data: string) => {
  removeMousedown();
  const element = layerGroup0.value as HTMLDivElement;
  const RotateTool = cornerstoneTools.RotateTool;
  const viewport: viewportType = cornerstone.getViewport(element);
  if (data == "逆时针旋转90°") {
    viewport.rotation -= 90;
  } else if (data == "顺时针旋转90°") {
    viewport.rotation += 90;
  } else if (data == "旋转90°") {
    viewport.rotation += 90;
  } else if (data == "水平翻转") {
    viewport.hflip = !viewport.hflip;
  } else if (data == "垂直翻转") {
    viewport.vflip = !viewport.vflip;
  }
  cornerstone.setViewport(element, viewport);

  if (data == "清除改变") {
    cornerstone.reset(element);
  }
  cornerstoneTools.addTool(RotateTool);
  cornerstoneTools.setToolActive("Rotate", { mouseButtonMask: 1 });
});
//放大
mitt.on("amplification", () => {
  removeMousedown();
  const MagnifyTool = cornerstoneTools.MagnifyTool;
  cornerstoneTools.addTool(MagnifyTool);
  cornerstoneTools.setToolActive("Magnify", { mouseButtonMask: 1 });
});
//整体放大
mitt.on("bodyAmplification", (data: string) => {
  removeMousedown();
  const element = layerGroup0.value as HTMLDivElement;
  // Add our tool, and set it's mode
  cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
    // Optional configuration
    configuration: {
      invert: false,
      preventZoomOutsideImage: false,
      minScale: 0.1,
      maxScale: 20.0,
    },
  });
  cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 1 });
  const viewport = cornerstone.getViewport(element);
  if (data == "200%") {
    viewport.scale += 2;
    cornerstone.setViewport(element, viewport);
  } else if (data == "400%") {
    viewport.scale += 4;
    cornerstone.setViewport(element, viewport);
  } else if (data == "800%") {
    viewport.scale += 8;
    cornerstone.setViewport(element, viewport);
  } else if (data == "放大") {
    viewport.scale += 0.25;
    cornerstone.setViewport(element, viewport);
  } else if (data == "缩小") {
    viewport.scale -= 0.25;
    cornerstone.setViewport(element, viewport);
  } else if (data == "全屏" || data == "100%") {
    cornerstone.reset(element);
  }
});
//窗口显示调整
mitt.on("windowsAdjust", (data: string) => {
  removeMousedown();
  const element = layerGroup0.value as HTMLDivElement;
  const WwwcTool = cornerstoneTools.WwwcTool;
  cornerstoneTools.addTool(WwwcTool);
  cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
  const viewport = cornerstone.getViewport(element);
  if (data == "默认窗口") {
    cornerstone.setViewport(element, viewport);
    viewport.voi.windowCenter = items[dicomNum.value][0].windowCenter;
    viewport.voi.windowWidth = items[dicomNum.value][0].windowWide;
  } else if (data == "全部动态范围") {
    cornerstone.setViewport(element, viewport);
  } else if (data == "CT 腹窗") {
    viewport.voi.windowCenter = 20;
    viewport.voi.windowWidth = 40;
    cornerstone.setViewport(element, viewport);
  } else if (data == "CT 血管窗") {
    viewport.voi.windowCenter = 40;
    viewport.voi.windowWidth = 80;
    cornerstone.setViewport(element, viewport);
  } else if (data == "CT 骨窗") {
    viewport.voi.windowWidth = 2500;
    viewport.voi.windowCenter = 480;
    cornerstone.setViewport(element, viewport);
  } else if (data == "CT 脑窗") {
    viewport.voi.windowWidth = 80;
    viewport.voi.windowCenter = 40;
    cornerstone.setViewport(element, viewport);
  } else if (data == "CT 纵膈窗") {
    viewport.voi.windowCenter = 320;
    viewport.voi.windowWidth = 640;
    cornerstone.setViewport(element, viewport);
  } else if (data == "CT 肺窗") {
    viewport.voi.windowWidth = 1500;
    viewport.voi.windowCenter = -600;
    cornerstone.setViewport(element, viewport);
  } else if (data == "负片") {
    viewport.invert = !viewport.invert;
    cornerstone.setViewport(element, viewport);
  } else if (data == "常规窗") {
    cornerstone.setViewport(element, viewport);
  }
  setValue();
});
// 鼠标左键滚动效果
mitt.on("Scrolls", () => {
  removeMousedown();
  const StackScrollTool = cornerstoneTools.StackScrollTool;
  cornerstoneTools.addTool(StackScrollTool);
  cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 1 });
});
// 移动工具
mitt.on("move", () => {
  removeMousedown();
  const PanTool = cornerstoneTools.PanTool;
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
});
// 播放
mitt.on("play", () => {
  removeMousedown();
  num.value == 0 ? (num.value = 1) : (num.value = 0);
});
//显示隐藏文字
mitt.on("showText", () => {
  removeMousedown();
  showText.value == true ? (showText.value = false) : (showText.value = true);
});
// 展示选择的列表
mitt.on("clickList", (data: number) => {
  indexValue.value = data;
  values.value = 0;
  getDicom(data);
});
//下载
mitt.on("downloadImg", () => {
  const element = layerGroup0.value as HTMLDivElement;
  cornerstoneTools.SaveAs(element,Date.now() + ".jpg");
});
</script>
<template>
  <v-sheet width="100%" height="100%">
    <!-- 展示部分 -->
    <v-sheet class="leftDiv">
      <v-sheet class="displayArea">
        <div id="layerGroup0" ref="layerGroup0" class="layerGroup0">
          <v-icon
            v-if="showAddIcon"
            class="bg-addIcon text-imageBackColor addIcon"
            icon="$mdi-Plus-Box"
            size="300"
          ></v-icon>
        </div>
        <div v-show="!showText" class="topLeft w">
          <span>图像{{ Number(values) + 1 }}/{{ Number(dicomMax) + 1 }}</span
          ><br />
          <span>序列：{{ indexValue + Number(1) }}</span>
        </div>
        <div v-show="!showText" class="images">
          <img src="~@/assets/img/qrcode_chrome.png" alt="" />
        </div>
        <div v-show="!showText" class="topRight w">
          <span>{{ counter.userName }}</span
          ><br />
          <span>{{ counter.userId }}</span
          ><br />
          <span>{{ counter.userBirthTimeAndAge }}</span
          ><br />
          <span>{{ counter.institutionName }}</span
          ><br />
          <span>{{ counter.studyNumber }}</span
          ><br />
          <span>{{ counter.description }}</span
          ><br />
          <span>{{ counter.SeriesDescription }}</span
          ><br />
        </div>
        <div v-show="!showText" class="bottomLeft w">
          <span v-show="showXY">x:{{ pixelX }} Y:{{ pixelY }} </span>
          <span>测值：184</span><br />
          <span>窗位：{{ leftValue }} 窗宽：{{ rightValue }}</span
          ><br />
          <span>层厚：{{ thickness }}mm 层间距：{{ oldPosition }}mm</span><br />
        </div>
        <div v-show="!showText" class="bottomRight w">
          <span>300mA 120KV</span><br />
          <span>{{ counter.acquisitionTime }}</span
          ><br />
        </div>
        <div v-show="!showText" class="Top f">上</div>
        <div v-show="!showText" class="Left f">左</div>
        <div v-show="!showText" class="Right f">右</div>
        <div v-show="!showText" class="Bottom f">下</div>
      </v-sheet>
      <div v-show="isShow" class="divInput">
        <input v-model="values" type="range" id="sliceRange" :max="dicomMax" />
      </div>
    </v-sheet>
  </v-sheet>
</template>

<style lang="less" scoped>
.leftDiv {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  .displayArea {
    position: relative;
    display: flex;
    flex-grow: 9;
    background-color: black;
    overflow: hidden;
    font-size: 12px;
    .w {
      position: absolute;
      width: 260px;
      // background-color: red;
      color: #fff;
    }
    .images {
      position: absolute;
      top: 0;
      left: 0;
      margin-left: 80px;
      margin-top: 5px;
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .topLeft {
      top: 0;
      left: 5px;
    }
    .topRight {
      text-align: right;
      top: 0;
      right: 5px;
    }
    .bottomLeft {
      bottom: 0;
      left: 5px;
    }
    .bottomRight {
      text-align: right;
      bottom: 0;
      right: 5px;
    }
    .f {
      position: absolute;
      color: #fff;
    }
    .Top {
      top: 10px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .Bottom {
      bottom: 10px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .Left {
      top: 50%;
      left: 30px;
      transform: translate(0, -50%);
    }
    .Right {
      top: 50%;
      right: 30px;
      transform: translate(0, -50%);
    }
  }
  // 滚动条样式
  .divInput {
    position: absolute;
    top: 50px;
    left: 10px;
    width: 760px;
    height: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transform: rotate(90deg);
    transform-origin: left bottom;
    #sliceRange {
      width: 100%;
      // transform: rotate(180deg);
    }
    input[type="range"] {
      border-radius: 15px;
      -webkit-appearance: none;
      height: 10px;
      // background-color: transparent;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      cursor: default;
      top: -5px;
      height: 10px;
      width: 30px;
      transform: translateY(-4px);
      background: none repeat scroll 0 0 rgb(202, 196, 196);
      // border-radius: 15px;
      // -webkit-box-shadow: 0 -1px 1px black inset;
    }
  }

  .layerGroup0 {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
    text-align: center;
    .addIcon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>