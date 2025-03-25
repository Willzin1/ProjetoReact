import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import * as actions from './action';
import * as types from '../types';

const requisicao = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

function* exampleRequest() {
  try {
    yield call(requisicao);
    toast.success('LOGOU');
    yield put(actions.clicaBotaoSuccess());
  } catch {
    toast.error('Deu erro =(');
    yield put(actions.clicaBotaoFailure());
  }
}

export default all([takeLatest(types.BOTAO_CLICADO_REQUEST, exampleRequest)]);
