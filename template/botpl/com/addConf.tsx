export default () => [
  {
    span: 12,
    fields: [
      {
        label: '车架号',
        key: 'vin',
        type: 'input',
        props: {
          rules: ['vin'],
        },
      },
      {
        label: '车牌号',
        key: 'license_plate_number',
        type: 'input',
        props: {
          rules: ['license_plate_number', 'required'],
        },
      },
    ],
  },
  {
    fields: [
      {
        span: 12,
        label: '车架号',
        key: 'vin1',
        type: 'input',
        props: {
          rules: ['vin'],
        },
      },
      {
        span: 12,
        label: '车牌号1',
        key: 'license_plate_number',
        type: 'input',
        props: {
          rules: ['license_plate_number', 'required'],
        },
      },
    ],
  },
  {
    type: 'FormButtons' as const,
    align: 'right' as const,
    fields: [
      {
        key: 'reset',
        label: '重置',
      },
      {
        key: 'submit',
        label: '搜索',
        props: {
          type: 'primary',
          icon: 'search',
        },
      },
    ],
  },
]
