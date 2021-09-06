import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as d3 from 'd3';
import dateformat from 'dateformat'

import App from './ui/index';
import store from './store/index';
import {DataPoint, Forecast, TrendDataPoint, WeeklyDataPoint, YDataPoint, YearlyDataPoint} from "./store/types/data";

const start = () => ReactDOM.render(
    <React.StrictMode>
        <App store={store}/>
    </React.StrictMode>,
    document.getElementById('root')
);

const weekly = (forecast): WeeklyDataPoint[] => {
    const firstMondayIndex = forecast.findIndex(
        row => row.ds.getDay() === 1
    )

    console.log(firstMondayIndex)

    return forecast
        .slice(firstMondayIndex, 7)
        .map(row => ({
            ds: row.ds,
            weekly: row.weekly
        }) as WeeklyDataPoint)
}

const yearly = (forecast): YearlyDataPoint[] => {
    return forecast
        .slice(0, 365)
        .map(row => ({
            ds: row.ds,
            yearly: row.yearly
        }) as YearlyDataPoint)
}

const trend = (forecast): TrendDataPoint[] => {
    return forecast.map(row => ({
        ds: row.ds,
        trend: row.trend,
        trendUpper: row.trend_upper,
        trendLower: row.trend_lower
    }) as TrendDataPoint)
}

const y = (forecast): YDataPoint[] => {
    return forecast.map(row => ({
        ds: row.ds,
        yHatUpper: row.yhat_upper,
        yHatLower: row.yhat_lower,
    }) as YDataPoint)
}

const parseForecast = (response: any) => {
    response.forEach(d => d.ds = new Date(d.ds))

    return {
        weekly: weekly(response),
        yearly: yearly(response),
        trend: trend(response),
        y: y(response)
    } as Forecast
}


const fetchForecast = async(data) => {
    const reqBody = JSON.stringify(data.map(d => ({
        ds: dateformat(d.ds, "yyyy-mm-dd"),
        y: d.value
    })))

    const response = await fetchForecastJSON()

    return parseForecast(response)
}

const fetchForecastJSON = () => new Promise((resolve, reject) => {
    setTimeout(async() => {
        const response = await fetch('forecast.json')
            .then(data => data.json())
        
        resolve(response)
    }, 4000)
})

const refresh = async (data: DataPoint[]) => {
    console.log('fetching forecast')
    const forecast = await fetchForecast(data) as Forecast
    console.log('done and parsed')

    store.dispatch({
        type: "REFRESH_DATA", payload: {
            data: data,
            forecast: forecast
        }
    })
}

const app = async () => {
    const csv = await d3.csv('/data.csv')

    const data: DataPoint[] = csv.map(row => ({
        ds: new Date(row.ds as string),
        // @ts-ignore
        value: +row.y
    }))

    await refresh(data)

    start()
}

app()