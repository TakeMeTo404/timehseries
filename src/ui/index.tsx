import * as React from 'react'
import {Provider} from "react-redux";
import WeekChart from "./components/WeeklyChart";
import YearlyChart from "./components/YearlyChart";
import TrendChart from "./components/TrendChart";
import {MainChart} from "./components/MainChart";


export default function ({store}) {
    return (
        <Provider store={store}>
            <MainChart/>
            <WeekChart/>
            <YearlyChart/>
            <TrendChart/>
        </Provider>
    )
}