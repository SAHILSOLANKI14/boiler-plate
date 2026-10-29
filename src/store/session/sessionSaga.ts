import { all, call, put, takeLatest } from 'redux-saga/effects';

import { clearAccessCookie, readAccessCookie, writeAccessCookie } from '@/api-config/authSession';

import { sessionCleared, sessionSet } from './sessionSlice';

function* restoreSession() {
  const accessToken: string | null = yield call(readAccessCookie);
  if (accessToken) {
    yield put(sessionSet(accessToken));
  }
}

function* persistSession(action: ReturnType<typeof sessionSet>) {
  yield call(writeAccessCookie, action.payload);
}

function* removeSession() {
  yield call(clearAccessCookie);
}

export function* sessionSaga() {
  yield call(restoreSession);
  yield all([takeLatest(sessionSet.type, persistSession), takeLatest(sessionCleared.type, removeSession)]);
}
