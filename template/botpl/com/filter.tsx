import * as React from 'react'
import FilterBox from '@com/FilterBox/index'
import Form from 'react-conf-form'
import FilterBase from '@com/PageComponents/FilterBase'
import { ActionModifyT } from '@src/@types/actions.d'
import fieldsConf from './filterConf'

type Props = {
  params: {},
  actionList: ActionModifyT,
}

export default class Filter extends FilterBase<Props, {}> {
  prefix = '_ROUTER_BASE_'

  render() {
    return (
      <FilterBox title="过滤" open>
        <Form
          fields={fieldsConf()}
          dataSource={this.props.params}
          onSubmit={this.onSubmit}
          onReset={this.onReset}
        />
      </FilterBox>
    )
  }
}
