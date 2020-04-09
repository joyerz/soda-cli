import * as React from 'react'
import { Divider } from 'antd'

export default () => [
  {
    title: '账号编号',
    dataIndex: 'aa',
    width: 100,
  },
  {
    title: '手机号',
    dataIndex: 'bb',
    width: 120,
  },
  {
    title: '账号类型',
    dataIndex: 'ee',
    width: 120,
    render: (text: string) => <span>...</span>,
  },
  {
    title: '操作',
    width: 200,
    render: () => (
      <div>
        <span>查看</span>
        <Divider type='vertical' />
        <span>编辑</span>
        <Divider type='vertical' />
        <span>禁用/启用</span>
        <Divider type='vertical' />
        <span>删除</span>
      </div>
    ),
  },
]
