import * as d3 from 'd3';
import * as React from 'react'
import {FC, useEffect, useRef} from 'react'
import '../../css/LineChart.css'
import {DataPoint, TrendDataPoint, YDataPoint} from "../../store/types/data";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import '../../css/TrendChart.css'

const width = 600
const height = 350

interface Props {
    points: DataPoint[],
    yHatData: YDataPoint[]
}

const YChart: FC<Props> = ({points, yHatData}) => {
    const svgRef = useRef(null)

    useEffect(() => {

        const margin = {left: 30, right: 50, top: 30, bottom: 30}

        const innerWidth = width - (margin.left + margin.right)
        const innerHeight = height - (margin.top + margin.bottom)

        const maxDate: Date = d3.max(yHatData, p => p.ds) as Date
        const minDate: Date = d3.min(yHatData, p => p.ds) as Date

        const maxValue1 = d3.max(points, p => p.value) || 0
        const minValue1 = d3.min(points, p => p.value) || 0
        const maxValue2 = d3.max(yHatData, p => p.yHatUpper) || 0
        const minValue2 = d3.min(yHatData, p => p.yHatLower) || 0

        const maxValue = Math.max(maxValue1, maxValue2)
        const minValue = Math.min(minValue1, minValue2)

        const y = d3.scaleLinear()
            // @ts-ignore
            .domain([minValue, maxValue])
            .range([innerHeight, 0])

        const x = d3.scaleTime()
            // @ts-ignore
            .domain([minDate, maxDate])
            .range([0, innerWidth])

        const areaGenerator = d3.area<YDataPoint>()
            .y1(p => y(p.yHatUpper))
            .y0(p => y(p.yHatLower))
            .x(p => x(p.ds))

        const yAxis = d3.axisLeft(y)
        const xAxis = d3.axisBottom(x)

        const svg = d3.select(svgRef.current)

        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        chartGroup.selectAll('circle').data(points)
            .enter().append('circle')
            .attr('cy', d => y(d.value))
            .attr('cx', d => x(d.ds))
            .attr('r', 1);

        chartGroup.append('path')
            .attr('d', areaGenerator(yHatData))
            .attr('class', 'area')
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
    }, [yHatData, points])


    return (
        <>
            <svg width={width} height={height} ref={svgRef}/>
        </>

    )
}

export default YChart