import * as React from 'react'

import TableList from '@com/TableList'
import paginationInit from '@utils/paginationHelper'
import { ActionModifyT } from '@src/@types/actions.d'
import Filter from './filter'
import listConf from './listConf'

type Props = {
  list: {
    params: any,
    data?: {
      entries: any[],
      page: number,
      per_page: number,
      count: number,
      [name: string]: any
    }
    [name: string]: any
  },
  actionList: ActionModifyT
}

export default class List extends React.PureComponent<Props> {

  render() {
    const { list, actionList } = this.props
    return (
      <>
        <Filter
          params={list.params}
          actionList={actionList}
        />

        <div className="box marginT20">
          <TableList
            name="accountList"
            columns={listConf()}
            dataSource={list.data.entries}
            loading={list.loading}
            showSerialNumber={false}
            pagination={paginationInit(list.data.page, list.data.per_page, list.data.total_count, list.params, actionList)}
          />
        </div>
      </>
    )
  }
}
