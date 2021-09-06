import * as d3 from 'd3';
import * as React from 'react'
import {FC, useEffect, useRef} from 'react'
import '../../css/LineChart.css'
import {DataPoint, TrendDataPoint} from "../../store/types/data";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import '../../css/TrendChart.css'

const width = 450
const height = 150

const TrendChart: FC = () => {
    const content = useTypedSelector(state => state.data.forecast.trend)

    const svgRef = useRef(null)

    useEffect(() => {

        const margin = {left: 30, right: 50, top: 30, bottom: 30}

        const innerWidth = width - (margin.left + margin.right)
        const innerHeight = height - (margin.top + margin.bottom)

        const maxDate: Date = d3.max(content, p => p.ds) as Date
        const minDate: Date = d3.min(content, p => p.ds) as Date

        const maxValue = d3.max(content, p => p.trendUpper)
        const minValue = d3.min(content, p => p.trendLower)

        const y = d3.scaleLinear()
            // @ts-ignore
            .domain([minValue, maxValue])
            .range([innerHeight, 0])

        const x = d3.scaleTime()
            // @ts-ignore
            .domain([minDate, maxDate])
            .range([0, innerWidth])

        const areaGenerator = d3.area<TrendDataPoint>()
            .y1(p => y(p.trendUpper))
            .y0(p => y(p.trendLower))
            .x(p => x(p.ds))

        const upperLine = d3.line<TrendDataPoint>()
            .x(p => x(p.ds))
            .y(p => y(p.trendUpper))

        const lowerLine = d3.line<TrendDataPoint>()
            .x(p => x(p.ds))
            .y(p => y(p.trendLower))

        const yAxis = d3.axisLeft(y)
        const xAxis = d3.axisBottom(x)

        const svg = d3.select(svgRef.current)

        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)


        chartGroup.append('path')
            .attr('d', areaGenerator(content))
            .attr('class', 'area')
        chartGroup.append('path')
            .attr('d', upperLine(content))
            .attr('class', 'line')
        chartGroup.append('path')
            .attr('d', lowerLine(content))
            .attr('class', 'line')
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

export default TrendChart