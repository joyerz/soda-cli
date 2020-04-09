import { EChartOption, ECharts } from 'echarts'
import '../../assets/styles/global.scss'
import './index.scss'


export interface EchartRes {
  instance: ECharts
  preData: EChartOption
}

interface MResponse<D = {}> {
  readonly code: number
  readonly msg: string
  data: D
}

export interface CityTopEquipmentResponse extends MResponse<{
  cityName: string
  cityDeviceCount: number
  cityCarTotal: number
}[]> { }