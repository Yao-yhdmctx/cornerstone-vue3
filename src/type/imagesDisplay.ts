interface imageFrameType {
    bitsAllocated: number
    bitsStored: number
    bluePaletteColorLookupTableData: undefined
    bluePaletteColorLookupTableDescriptor: undefined
    columns: number
    decodeTimeInMS: number
    greenPaletteColorLookupTableData: undefined
    greenPaletteColorLookupTableDescriptor: undefined
    largestPixelValue: number
    photometricInterpretation: string
    pixelData: Array<number>
    pixelDataLength: number
    pixelRepresentation: number
    planarConfiguration: undefined
    redPaletteColorLookupTableData: undefined
    redPaletteColorLookupTableDescriptor: undefined
    rows: number
    samplesPerPixel: number
    smallestPixelValue: number
}
export interface ElementsType {
    dataOffset: number
    length: number
    tag: string
    vr: undefined
}
interface dataType {
    byteArray: Array<number>
    elements: { [key: string]: ElementsType }
}
export interface imgType {
    color: boolean
    columnPixelSpacing: number
    columns: number
    data: dataType
    decodeTimeInMS: number
    floatPixelData: undefined
    getPixelData: object
    height: number
    imageFrame: imageFrameType
    imageId: string
    intercept: number
    invert: boolean
    loadTimeInMS: number
    maxPixelValue: number
    minPixelValue: number
    preScale: undefined
    rgba: boolean
    rowPixelSpacing: number
    rows: number
    sharedCacheKey: string
    sizeInBytes: number
    slope: number
    totalTimeInMS: number
    voiLUTFunction: undefined
    width: number
    windowCenter: number
    windowWidth: number
}


export interface itemType {
    columns: number
    image: imgType
    imageId: string
    instanceNumber: number
    rows: number
    seriesNumber: number
    sliceDistance: number
    sliceLocation: number
    windowCenter: number,
    windowWide: number,
    SeriesDescription: string
}


//viewport类型
export interface viewportType {
    colormap: undefined
    displayedArea: undefined
    hflip: boolean
    invert: boolean
    labelmap: boolean
    modalityLUT: undefined
    pixelReplication: boolean
    rotation: number
    scale: number
    translation: translationType
    vflip: boolean
    voi: voiType
    voiLUT: undefined
}
interface translationType {
    x: number
    y: number
}
interface voiType {
    windowWidth: number
    windowCenter: number
}
