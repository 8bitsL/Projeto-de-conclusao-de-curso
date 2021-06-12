import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise'; 
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import rootReducer from '../reducers/index';

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
&& window.__REDUX_DEVTOOLS_EXTENSION__()

const store = applyMiddleware(thunk, multi, promise)(createStore)(rootReducer, devTools);

export default store