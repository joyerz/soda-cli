import { buildRedux } from 'react-redux-creator'
import { LIST_INITALSTATE } from '@src/conf'

export default {}

const LIST = "sampleList"
const ADD = "sampleAdd"
const EDIT = "sampleEdit"
const ITEM = "sampleItem"

export const sampleListRedux = buildRedux(LIST, LIST_INITALSTATE)({
  url: function* (payload, options) {
    yield console.log(payload, options)
  },
  method: 'GET',
  // onResult: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  // onAfter: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  onError: function* (err, payload, options) {
    yield console.log(err, payload, options)
  },
})


export const sampleAddRedux = buildRedux(ADD)({
  url: function* (payload, options) {
    yield console.log(payload, options)
  },
  method: 'GET',
  // onResult: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  // onAfter: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  onError: function* (err, payload, options) {
    yield console.log(err, payload, options)
  },
})

export const sampleEditRedux = buildRedux(EDIT)({
  url: function* (payload, options) {
    yield console.log(payload, options)
  },
  method: 'GET',
  // onResult: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  // onAfter: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  onError: function* (err, payload, options) {
    yield console.log(err, payload, options)
  },
})

export const sampleItemRedux = buildRedux(ITEM)({
  url: function* (payload, options) {
    yield console.log(payload, options)
  },
  method: 'GET',
  // onResult: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  // onAfter: function* (data, payload, options) {
  //   yield console.log(data, payload, options)
  // },
  onError: function* (err, payload, options) {
    yield console.log(err, payload, options)
  },
})

