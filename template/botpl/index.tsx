import * as React from 'react'
import { connect } from 'react-redux-creator'
import { Button } from 'antd'

import PageHeader from '@com/PageHeader'
import PMControl from '@com/PageComponents/PMControl'
import { ActionModifyT } from '@src/@types/actions.d'
import List from './com/list'
import Add from './com/Add'
import {
  sampleAddRedux,
  sampleEditRedux,
  sampleItemRedux,
  sampleListRedux,
} from './redux'

interface Props {
  list: any,
  add: any,
  edit: any,
  item: any,
  actionList: ActionModifyT
  actionAdd: ActionModifyT
  actionEdit: ActionModifyT
  actionItem: ActionModifyT
  type: string,
}

interface State {
  itemId: string | number,
  frameType: string,
}

class Index extends React.PureComponent<Props, State> {
  state = {
    itemId: '',
    frameType: '',
  }

  componentDidMount(): void {
    // do sth.
  }

  showFrame = (frameType: string = '', itemId: string | number = '') =>
    this.setState({ frameType, itemId })

  render() {
    const {
      type,
      actionAdd,
      actionEdit,
      actionItem,
      add,
      edit,
      item,
    } = this.props
    const { frameType, itemId } = this.state
    return (
      <div>
        <PageHeader
          title="账号列表"
          extra={[
            <PMControl key="add" permission="">
              <Button
                key="1"
                size="small"
                icon="plus"
                type="primary"
                onClick={() => this.showFrame('ADD')}
              >
                新建
              </Button>
            </PMControl>,
          ]}
        />

        {type === 'list' && (
          <List
            actionList={this.props.actionList}
            list={this.props.list}
          />
        )}
        {frameType && (
          <Add
            type={frameType}
            itemId={itemId}
            item={item}
            add={add}
            edit={edit}
            readOnly={frameType === 'VIEW'}
            actionSubmit={itemId ? actionAdd : actionEdit}
            actionItem={actionItem}
            onClose={this.showFrame}
          />
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    list: state.accountList,
    add: state.accountAdd,
    edit: state.accountEdit,
    item: state.accountItem,
  }),
  {
    actionList: params => sampleListRedux.start(params),
    actionAdd: params => sampleAddRedux.start(params),
    actionEdit: params => sampleEditRedux.start(params),
    actionItem: params => sampleItemRedux.start(params),
  },
)(Index)
