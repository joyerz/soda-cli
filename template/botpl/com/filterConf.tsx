import * as React from 'react'

import { object2labelValue } from '@utils/objectHelper'
import { ACCOUNT_TYPE } from '@conf/enum'

export default () => [
  {
    span: 6,
    gutter: 24,
    type: 'field',
    fields: [
      {
        label: '姓名',
        key: 'aa',
        type: 'input',
        display: true,
        props: {
          rules: [],
        }
      },
      {
        label: '手机号',
        key: 'bb',
        type: 'input',
        display: true,
        props: {
          rules: [],
        }
      },
      {
        label: '类型',
        key: 'cc',
        type: 'select',
        display: true,
        props: {
          options: object2labelValue(ACCOUNT_TYPE),
          rules: [],
        },
      }
    ],
  },
  {
    type: 'button',
    align: 'right',
    fields: [
      {
        label: '重置',
        key: 'reset',
      },
      {
        label: '搜索',
        key: 'submit',
        props: {
          icon: 'search',
          type: 'primary',
        }
      }
    ],
  },
]
