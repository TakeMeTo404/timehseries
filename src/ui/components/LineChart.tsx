import * as d3 from 'd3';
import * as React from 'react'
import {FC, useEffect, useRef} from 'react'
import '../../css/LineChart.css'
import {DataPoint} from "../../store/types/data";
import {useTypedSelector} from "../../hooks/useTypedSelector";

const width = 600
const height = 100

const LineChart: FC = () => {
    console.log('rerendering LineChart')
    const points = useTypedSelector(state => state.data.data)
    // const displayRange = useTypedSelector(state => state.display.range)

    const svgRef = useRef(null)

    useEffect(() => {

        const displayRange = [0, points.length - 1]

        const content = points.slice(
            displayRange[0],
            displayRange[1] - displayRange[0] + 1
        ) as DataPoint[]

        console.log(`slice=(${displayRange[0]},${displayRange[1] - displayRange[0] + 1})`)

        console.log('ready to draw points N = ' + content.length)

        const margin = {left: 50, right: 50, top: 30, bottom: 30}

        const innerWidth = width - (margin.left + margin.right)
        const innerHeight = height - (margin.top + margin.bottom)

        const maxDate = d3.max(content, p => p.ds)
        const minDate = d3.min(content, p => p.ds)

        const maxValue = d3.max(content, p => p.value)
        const minValue = d3.min(content, p => p.value)

        console.log(maxDate, minDate, maxValue, minValue)

        const y = d3.scaleLinear()
            // @ts-ignore
            .domain([minValue, maxValue])
            .range([innerHeight, 0])

        const x = d3.scaleTime()
            // @ts-ignore
            .domain([minDate, maxDate])
            .range([0, innerWidth])

        const yAxis = d3.axisLeft(y)
        const xAxis = d3.axisBottom(x)

        const svg = d3.select(svgRef.current)

        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        const line = d3.line<DataPoint>()
            .x(p => x(p.ds))
            .y(p => y(p.value))

        chartGroup.append('path')
            .attr('d', line(content))
        chartGroup.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(xAxis)
        chartGroup.append('g')
            .attr('class', 'y axis')
            .call(yAxis)

        console.log('finished drawing')

        return () => {
            chartGroup.remove()
        }
    }, [points])


    return (
        <>
            <svg width={width} height={height} ref={svgRef}/>
            <ul>
                {points.slice(0, 10).map(p =>
                    <li>
                        {`${p.value} at ${p.ds}`}
                    </li>
                )}
            </ul>
        </>

    )
}

export default LineChart