// @flow
import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import useInput from "../../hooks/useInput";
import {useCallback, useEffect, useRef} from "react";
import * as d3 from 'd3';
import useDebounce from "../../hooks/useDebounce";
import {YDataPoint} from "../../store/types/data";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import "../../css/DisplayRangeRegulator.css"

const height = 75
const chartHeight = height - 25
const width = 500

const refreshDisplayRange = ({begin, end}) => {
    console.log(`updated to (${begin}, ${end})`)
}

const drawChart = (g, x, y) => (points, yHatData) => {
    const areaGenerator = d3.area<YDataPoint>()
        .y1(p => y(p.yHatUpper))
        .y0(p => y(p.yHatLower))
        .x(p => x(p.ds))

    g.selectAll('circle').data(points)
        .enter().append('circle')
        .attr('cy', d => y(d.value))
        .attr('cx', d => x(d.ds))
        .attr('r', 1);

    g.append('path')
        .attr('d', areaGenerator(yHatData))
        .attr('class', 'area')

    const xAxis = d3.axisBottom(x)

    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis)
}

const drawRegulators = (g, xScale, yScale) => (refreshCb) => {
    const left = g.append('rect')
        .attr('width', '2')
        .attr('height', chartHeight)

    const right = g.append('rect')
        .attr('width', '2')
        .attr('height', chartHeight)
        .attr('x', width-2)

    const leftDragHandler = d3.drag()
        .on('drag', leftDragged)
    const rightDragHandler = d3.drag()
        .on('drag', rightDragged)

    let leftCur = 0
    let rightCur = width - 2

    const leftRange = () => [0, rightCur - 10]
    const rightRange = () => [leftCur + 10, width - 2]

    const validDrag = (range) => x => {
        return x >= range[0] && x <= range[1]
    }

    function refresh() {
        refreshCb({
            begin: xScale.invert(leftCur) as Date,
            end: xScale.invert(rightCur) as Date,
        })
    }

    function leftDragged({x}) {
        if(!validDrag(leftRange())(x))
            return

        left.attr('x', x)
        leftCur = x

        refresh()
    }

    function rightDragged({x}) {
        if(!validDrag(rightRange())(x))
            return

        right.attr('x', x)
        rightCur = x

        refresh()
    }

    leftDragHandler(left)
    rightDragHandler(right)
}

interface Props {
    onDisplayRangeChange: ({begin, end}) => void
}

export const DisplayRangeRegulator = ({onDisplayRangeChange}) => {
    const debouncedRefreshCb = useDebounce(onDisplayRangeChange, 1000)
    const svgRef = useRef(null)

    const points = useTypedSelector(state => state.data.data)
    const yHatData = useTypedSelector(state => state.data.forecast.y)

    useEffect(() => {
        const svg = d3.select(svgRef.current)

        const g = svg.append('g')

        //region
        const maxDate: Date = d3.max(yHatData, p => p.ds) as Date
        const minDate: Date = d3.min(yHatData, p => p.ds) as Date

        const maxValue = d3.max(points, p => p.value)
        const minValue = d3.min(points, p => p.value)

        //endregion
        const y = d3.scaleLinear()
            // @ts-ignore
            .domain([minValue, maxValue])
            .range([chartHeight, 0])

        const x = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width])

        drawChart(g, x, y)(points, yHatData)

        drawRegulators(g, x, y)(debouncedRefreshCb)

        return () => {
            g.remove()
        }

    }, [debouncedRefreshCb, points, yHatData])


    return (
        <>
            <svg width={width} height={height} ref={svgRef}/>
        </>
    );
};