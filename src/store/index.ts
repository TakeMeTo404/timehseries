import {createStore, combineReducers} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension';
import dataReducer from "./reducers/dataReducer";

const rootReducer = combineReducers({
    data: dataReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default createStore(rootReducer, composeWithDevTools())