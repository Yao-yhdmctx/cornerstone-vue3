// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import '@mdi/font/css/materialdesignicons.css'
import {
    mdiArrowExpandAll,
    mdiFolder,
    mdiArrowCollapseDown,
    mdiArrowUpBold,
    mdiViewDashboardVariantOutline,
    mdiSwapHorizontalCircleOutline,
    mdiArrowAll,
    mdiMagnify,
    mdiRuler,
    mdiPlayBox,
    mdiMagnifyPlus,
    mdiTabletCellphone,
    mdiCogOutline,
    mdiChevronLeft,
    mdiChevronRight,
    mdiRotateRight,
    mdiChevronDown,
    mdiAlphaA,
    mdiFileMultipleOutline,
    mdiCircleSlice4,
    mdiPlusBox,
    mdiMenuDown,
    mdiAccount
  } from "@mdi/js";
const vuetify: any= createVuetify({
    components,
    directives,
    ssr: true,
    icons: {
        defaultSet: 'mdi',
        aliases:{
            ...aliases,
            'mdi-Arrow-ExpandAll':mdiArrowExpandAll,
            'mdi-Folder':mdiFolder,
            'mdi-Arrow-Collapse-Down':mdiArrowCollapseDown,
            'mdi-Arrow-Up-Bold':mdiArrowUpBold,
            'mdi-View-Dashboard-Variant-Outline':mdiViewDashboardVariantOutline,
            'mdi-Swap-Horizontal-Circle-Outline':mdiSwapHorizontalCircleOutline,
            'mdi-Arrow-All':mdiArrowAll,
            'mdi-Magnify':mdiMagnify,
            'mdi-Ruler':mdiRuler,
            'mdi-Play-Box':mdiPlayBox,
            'mdi-Magnify-Plus':mdiMagnifyPlus,
            'mdi-Tablet-Cellphone':mdiTabletCellphone,
            'mdi-Cog-Outline':mdiCogOutline,
            'mdi-Chevron-Left':mdiChevronLeft,
            'mdi-Chevron-Right':mdiChevronRight,
            'mdi-Rotate-Right':mdiRotateRight,
            'mdi-Chevron-Down':mdiChevronDown,
            'mdi-Alpha-A':mdiAlphaA,
            'mdi-File-Multiple-Outline':mdiFileMultipleOutline,
            'mdi-Circle-Slice4':mdiCircleSlice4,
            'mdi-Plus-Box':mdiPlusBox,
            'mdi-Menu-Down':mdiMenuDown,
            'mdi-Account':mdiAccount
          },
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: 'myCustomTheme',
        themes: {
            myCustomTheme: {
                dark: false,
                colors: {
                    something: '#535353',
                    imageBackColor:'#424242',
                    addIcon:'#000000'
                }
            }
        }
    }
})
export default vuetify