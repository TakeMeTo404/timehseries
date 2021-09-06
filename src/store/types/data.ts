export interface DataPoint {
    ds: Date,
    value: number
}


export interface WeeklyDataPoint {
    ds: Date,
    weekly: number
}

export interface YearlyDataPoint {
    ds: Date,
    yearly: number
}

export interface YDataPoint {
    ds: Date,
    yHatUpper: number,
    yHatLower: number
}

export interface TrendDataPoint {
    ds: Date,
    trend: number,
    trendUpper: number,
    trendLower: number
}


export interface Forecast {
    weekly: WeeklyDataPoint[],
    yearly: YearlyDataPoint[],
    y: YDataPoint[],
    trend: TrendDataPoint[]
}


export interface Data {
    data: DataPoint[],
    forecast: Forecast
}