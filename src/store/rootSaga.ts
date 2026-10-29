import { all } from 'redux-saga/effects';

import { sessionSaga } from './session/sessionSaga';

export function* rootSaga() {
  yield all([sessionSaga()]);
}
