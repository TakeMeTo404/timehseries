import * as d3 from 'd3';
import * as React from 'react'
import {FC, useEffect, useRef} from 'react'
import '../../css/LineChart.css'
import {DataPoint, WeeklyDataPoint, YearlyDataPoint} from "../../store/types/data";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import '../../css/WeeklyChart.css'

const width = 450
const height = 150

const LineChart: FC = () => {
    const content = useTypedSelector(state => state.data.forecast.yearly)

    const svgRef = useRef(null)

    useEffect(() => {

        const margin = {left: 30, right: 50, top: 30, bottom: 30}

        const innerWidth = width - (margin.left + margin.right)
        const innerHeight = height - (margin.top + margin.bottom)

        const maxDate = d3.max(content, p => p.ds)
        const minDate = d3.min(content, p => p.ds)

        const maxValue = d3.max(content, p => p.yearly)
        const minValue = d3.min(content, p => p.yearly)

        const y = d3.scaleLinear()
            // @ts-ignore
            .domain([minValue - 0.05, maxValue + 0.05])
            .range([innerHeight, 0])

        const x = d3.scaleTime()
            // @ts-ignore
            .domain([minDate, maxDate])
            .range([0, innerWidth])


        const yAxis = d3.axisLeft(y)
        const xAxis = d3.axisBottom(x)
            .ticks(12)
            .tickFormat(d3.timeFormat('%d %b'))

        const svg = d3.select(svgRef.current)

        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        const line = d3.line<YearlyDataPoint>()
            .x(p => x(p.ds))
            .y(p => y(p.yearly))

        chartGroup.append('path')
            .attr('d', line(content))
            .attr('class', 'line-path')
        chartGroup.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(xAxis)
        chartGroup.append('g')
            .attr('class', 'y axis')
            .call(yAxis)

        return () => {
            chartGroup.remove()
        }
    }, [content])


    return (
        <>
            <svg width={width} height={height} ref={svgRef}/>
        </>

    )
}

export default LineChart