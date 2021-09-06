import {Data, Forecast} from "../types/data";

const defaultState: Data = {
    data: [],
    forecast: {
        weekly: [],
        yearly: [],
        y: [],
        trend: []
    } as Forecast
}

export default function (state = defaultState, action): Data {
    switch (action.type) {
        case 'REFRESH_DATA':
            return {data: action.payload.data, forecast: action.payload.forecast}
        default:
            return state
    }
}