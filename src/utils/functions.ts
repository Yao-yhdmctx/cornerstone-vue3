// import Vector from './LinearAlgebra/Vector'
// import { 
//     isAndroid,
//     isFirefox,
//     isMobile, 
//     isTablet 
//   } from 'react-device-detect'
// import { 
//     SETTINGS_SAVEAS, 
//     SETTINGS_SAVEINTO,
//     SETTINGS_DCMHEADER, 
//     SETTINGS_OVERLAY, 
//     SETTINGS_MEASUREMENT,
//     SETTINGS_FSVIEW,
//     SETTINGS_DICOMDIRVIEW,    
//     SETTINGS_MPRINTERPOLATION,
// } from './constants/settings'
import {imgType} from '@/type/imagesDisplay'

// ---------------------------------------------------------------------------------------------- DICOM
//#region DICOM

export function getDicomPatientName(image:any) {
    const value = image.data.string('x00100010')
    if (value === undefined) {
        return
    }
    return value
}

export function getDicomStudyId(image:any) {
    if (image === null) return null
    const value = image.data.string('x00200010')
    if (value === undefined) {
        return
    }
    return value
}	

export function getDicomStudyDate(image:any) {
    const value = image.data.string('x00080020')
    if (value === undefined) {
        return
    }
    return value
}	

export function getDicomStudyTime(image:any) {
    const value = image.data.string('x00080030')
    if (value === undefined) {
        return
    }
    return value
}	

export function getDicomStudyDescription(image:any) {
    const value = image.data.string('x00081030')
    if (value === undefined) {
        return
    }
    return value
}	
export function getDicomWindowCenter(image:any) {
    const value = image.data.string('x00281050')
    if (value === undefined) {
        return
    }
    return value
}	
export function getDicomWindowWide(image:any) {
    const value = image.data.string('x00281051')
    if (value === undefined) {
        return
    } 
    return value
}	
export function getDicomSeriesDate(image:any) {
    const value = image.data.string('x00080021')
    if (value === undefined) {
        return
    }
    return value
}	

export function getDicomSeriesTime(image:any) {
    const value = image.data.string('x00080031')
    if (value === undefined) {
        return
    }
    return value
}	

export function getDicomSeriesDescription(image:any) {
    const value = image.data.string('x0008103e')
    if (value === undefined) {
        return
    }
    return value
}

export function getDicomSeriesNumber(image:any) {
    const value = image.data.string('x00200011')
    if (value === undefined) {
        return
    }
    return parseFloat(value)
}

export function getDicomModality(image:any) {
    const value = image.data.string('x00080060')
    if (value === undefined) {
        return
    }
    return value
}

export function getDicomIpp(image:any, index:any) {
    const value = image.data.string('x00200032')
    if (value === undefined) {
        return
    }
    const ipp = value.split('\\')
    return parseFloat(ipp[index])
}

export function getDicomFrameOfReferenceUID(image:any) {
    const value = image.data.string('x00200052')
    if (value === undefined) {
        return
    }
    return value
}

export function getDicomPixelSpacing(image:any, index:any) {
    const value = image.data.string('x00280030')
    if (value === undefined) {
        return
    }
    const pixelSpacing = value.split('\\')
    return pixelSpacing[index]
}

export function getDicomSpacingBetweenSlice(image:any) {
    const value = image.data.string('x00180088')
    if (value === undefined) {
        return
    }
    return parseFloat(value)
}

export function getDicomSliceThickness(image:any) {
    const value = image.data.string('x00180050')
    if (value === undefined) {
        return
    }
    return parseFloat(value)
}

export function getDicomEchoNumber(image:any) {
    const value = image.data.string('x00180086')
    if (value === undefined) {
        return
    }
    return parseFloat(value)
}


export function getDicomPatientPosition(image:any) {
    const value = image.data.string('x00185100')
    if (value === undefined) {
        return
    }
    return parseFloat(value)
}

export function getDicomSliceLocation(image:any) {
    const value = image.data.string('x00201041')
    if (value === undefined) {
        return
    }
    return parseFloat(value)
}	

export function getDicomInstanceNumber(image:any) {
    const value = image.data.string('x00200013')
    if (value === undefined) {
        return
    }
    return value
}	

export function getDicomRows(image:any) {
    const value = image.data.uint16('x00280010')
    if (value === undefined) {
        return
    }
    return value    
}

export function getDicomColumns(image:any) {
    const value = image.data.uint16('x00280011')
    if (value === undefined) {
        return
    }
    return value    
} 

export function isLocalizer(image:any) {
    const values = image.data.string('x00080008').split('\\')
    console.log('Localizer: ', values)
    return values.length === 3 && values[2] === 'LOCALIZER'
}

// export function getDicomNearestAxis(image) {
//     const ipp = image.data.string('x00200032').split('\\').map(v => parseFloat(v)) // Image Position Patient - x, y, z of top hand corner
//     const xabs = Math.abs(ipp[0])
//     const yabs = Math.abs(ipp[1])
//     const zabs = Math.abs(ipp[2])
//     let axes = Vector.zero
//     if (xabs >= yabs && xabs >= zabs) 
//         axes.x = (ipp[0] > 0.0) ? 1.0 : -1.0
//     else if (yabs >= zabs) 
//         axes.y = (ipp[1] > 0.0) ? 1.0 : -1.0
//     else 
//         axes.z = (ipp[2] > 0.0) ? 1.0 : -1.0
//     return axes
// }

export function getDicomImageXOnRows(image:any) {
    const iop = image.data.string('x00200037').split('\\').map((v:any) => parseFloat(v))
    if (iop[0] > iop[1]) return true
    else return false
}

// see https://stackoverflow.com/questions/37730772/get-distance-between-slices-in-dicom
//
export function getDicomSliceDistance(image:any) {
    try {
        const ipp = image.data.string('x00200032').split('\\') // Image Position Patient
        //console.log("imagePosition: ", ipp)
        let topLeftCorner = new Array(3).fill(0)
        topLeftCorner[0] = parseFloat(ipp[0]) // X pos of frame (Top left) in real space
        topLeftCorner[1] = parseFloat(ipp[1]) // Y pos of frame (Top left) in real space
        topLeftCorner[2] = parseFloat(ipp[2]) // Z pos of frame (Top left) in real space
        //console.log("topLeftCorner: ", topLeftCorner)

        const iop = image.data.string('x00200037').split('\\') // Image Orientation Patient
        //console.log("values: ", iop)
        let v = new Array(3).fill(0).map(() => new Array(3).fill(0))

        v[0][0] = parseFloat(iop[0]) // the x direction cosines of the first row X
        v[0][1] = parseFloat(iop[1]) // the y direction cosines of the first row X
        v[0][2] = parseFloat(iop[2]) // the z direction cosines of the first row X
        v[1][0] = parseFloat(iop[3]) // the x direction cosines of the first column Y
        v[1][1] = parseFloat(iop[4]) // the y direction cosines of the first column Y
        v[1][2] = parseFloat(iop[5]) // the z direction cosines of the first column Y 

        // calculate the slice normal from IOP
        v[2][0] = v[0][1] * v[1][2] - v[0][2] * v[1][1]
        v[2][1] = v[0][2] * v[1][0] - v[0][0] * v[1][2]
        v[2][2] = v[0][0] * v[1][1] - v[0][1] * v[1][0]
        
        //console.log("slice normal from IOP: ", v[2])

        let dist = 0
        for (let i = 0; i < 3; ++i) 
            dist += v[2][i] * topLeftCorner[i]
        
        return dist
    } catch(error) {
        return 0
    }
}

export function dicomDateToLocale(dcmDate:any) {
    const date = new Date(dcmDate.substring(0, 4)+'-'+dcmDate.substring(4, 6)+'-'+dcmDate.substring(6))
    const localeDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    return localeDate
}

export function dicomTimeToStr(dcmTime:any) {
    const time = dcmTime.substring(0, 2)+':'+dcmTime.substring(2, 4)+':'+dcmTime.substring(4, 6)
    return time
}

export function dicomDateTimeToLocale(dateTime:any) {
    const date = new Date(dateTime.substring(0, 4)+'-'+dateTime.substring(4, 6)+'-'+dateTime.substring(6, 8))
    const time = dateTime.substring(9, 11)+':'+dateTime.substring(11, 13)+':'+dateTime.substring(13, 15)
    const localeDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    return `${localeDate} - ${time}`
}

//#endregion  

// export function groupBy(list:any, keyGetter:any) {
//     const map = new Map()
//     list.forEach((item:any) => {
//         const key = keyGetter(item:any)
//         const collection = map.get(key)
//         if (!collection) {
//             map.set(key, [item])
//         } else {
//             collection.push(item)
//         }
//     })
//     return map
// }

export function objectIsEmpty(obj:any) {
    if (obj === null || obj === undefined || Array.isArray(obj) || typeof obj !== 'object') {
        return true
    }
    return Object.getOwnPropertyNames(obj).length === 0
}

export function capitalize(str:any) {
    if (str === undefined) 
        return ''
    else 
        return str.charAt(0).toUpperCase() + str.slice(1)
}

// To see the console output set the key 'debug-u-dicom-viewer' in 
// 'Storage->Local Storage' panel of your browser Develop Tool
// export function log() {
//     let log = localStorage.getItem('debug-u-dicom-viewer')
//     if (log === null) {
//         console.log = function(){}
//     }
// }

// export function isInputDirSupported() {
//     var tmpInput = document.createElement('input')
//     if ('webkitdirectory' in tmpInput 
//         || 'mozdirectory' in tmpInput 
//         || 'odirectory' in tmpInput 
//         || 'msdirectory' in tmpInput 
//         || 'directory' in tmpInput) return true
//     return false
// }

export function isUrlImage(url:any) {
    if (url === undefined || url === null) return false
    return(url.match(/\.(jpeg|jpg|png)$/) != null)
}

export function isFileImage(file:any) {
    if (file === undefined || file === null) return false 
    const acceptedImageTypes = ['image/jpeg', 'image/png'] // 'image/gif', 
    return file && acceptedImageTypes.includes(file['type'])
}

export function isFsFileImage(fsItem:any) {
    console.log('isFsFileImage: ', fsItem)
    if (fsItem === undefined || fsItem === null) return false
    return fsItem.type.toLowerCase() === 'jpeg' || fsItem.type.toLowerCase() === 'png'
}

// export function getFileExt(file:any) {
//     const re = /(?:\.([^.]+))?$/
//     const ext = re.exec(file)[1]
//     if (ext === undefined) {
//         return 'dcm'
//     }
//     return ext
// }

// export function getFileExtReal(file:any) {
//     const re = /(?:\.([^.]+))?$/
//     const ext = re.exec(file)[1]
//     if (ext === undefined) {
//         return ''
//     }
//     return ext
// }

export function getFileName(file:any) {
    const name = file.replace(/\.[^.$]+$/, '')
    if (name === undefined) {
        return ''
    }
    return name    
}

export function formatBytes(bytes:any, decimals = 2) {
    if (bytes === '') return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}


// ---------------------------------------------------------------------------------------------- SETTINGS 
//#region  SETTINGS

//#endregion

/**
 * Converts a value to a string appropriate for entry into a CSV table.  E.g., a string value will be surrounded by quotes.
 * @param {string|number|object} theValue
 */
function toCsvValue(theValue:any) {
    let t = typeof theValue,
        output

    let sDelimiter = '"'

    if (t === 'undefined' || t === null) {
        output = ''
    } else if (t === 'string') {
        output = sDelimiter + theValue.replace(/"/g, '""') + sDelimiter
    } else {
        output = sDelimiter + String(theValue).replace(/"/g, '""') + sDelimiter
    }

    return output
}

/**
 * Converts an array of objects (with identical schemas) into a CSV table.
 * @param {Array} objArray An array of objects.  Each object in the array must have the same property list.
 * @param {string} cDelimiter The column delimiter.  Defaults to a comma (,) if omitted.
 * @return {string} The CSV equivalent of objArray.
 */
export function toCsv(objArray:any, cDelimiter:any) {
    var i,
        l,
        names = [],
        name,
        value,
        obj,
        row,
        output = '',
        n,
        nl

    // Initialize default parameters.

    let sDelimiter = '"'
    if (typeof cDelimiter === 'undefined' || cDelimiter === null) {
        cDelimiter = ','
    }

    for (i = 0, l = objArray.length; i < l; i += 1) {
        // Get the names of the properties.
        obj = objArray[i]
        row = ''
        if (i === 0) {
            // Loop through the names
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    names.push(name)
                    row += [
                        sDelimiter,
                        name.replace(/"/g, '""'),
                        sDelimiter,
                        cDelimiter,
                    ].join('')
                }
            }
            row = row.substring(0, row.length - 1)
            output += row
        }

        output += '\n'
        row = ''
        for (n = 0, nl = names.length; n < nl; n += 1) {
            name = names[n]
            value = obj[name]
            if (n > 0) {
                row += cDelimiter
            }
            row += toCsvValue(value)
        }
        output += row
    }

    return output
}
// 深拷贝
export function deepClone2(obj:any) {
    var _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
    return objClone;
  }
