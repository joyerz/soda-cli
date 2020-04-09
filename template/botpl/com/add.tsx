import * as React from 'react'
import { Modal } from 'antd'

import Form from 'react-conf-form'
import { ActionModifyT, VoidFuncT } from '@src/@types/actions'
import fieldsConf from './addConf'

type Props = {
  type: string,
  readOnly: boolean,
  add: any,
  edit: any,
  item: any,
  itemId: string | number,
  actionItem: ActionModifyT,
  actionSubmit: ActionModifyT,
  onClose: VoidFuncT,
}

export default class Add extends React.PureComponent<Props> {
  typeMap = {
    VIEW: '查看',
    ADD: '添加',
    EDIT: '修改',
  }

  componentDidMount(): void {
    if (this.props.itemId) {
      this.props.actionItem({ id: this.props.itemId })
    }
  }

  onSubmit = (data: any) => {
    this.props.actionSubmit({
      data,
      id: this.props.itemId,
    })
  }

  onReset = () => this.props.onClose()

  render() {
    const {
      readOnly,
      item,
      add,
      edit,
      type = 'ADD',
    } = this.props

    return (
      <Modal
        title={`${this.typeMap[type]}车辆`}
        visible={true}
        footer={null}
        maskClosable={readOnly}
        onCancel={this.onReset}
        width={800}
      >
        <Form
          spinning={add.loading || edit.loading || item.loading}
          fields={fieldsConf()}
          onSubmit={this.onSubmit}
          onReset={this.onReset}
          dataSource={item?.data}
        />
      </Modal>
    )
  }
}
