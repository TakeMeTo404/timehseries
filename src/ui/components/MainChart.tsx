// @flow
import * as React from 'react';
import {useState} from "react";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {DisplayRangeRegulator} from "./DisplayRangeRegulator";
import YChart from "./YChart";

export const MainChart = () => {
    const points = useTypedSelector(state => state.data.data)
    const yHatData = useTypedSelector(state => state.data.forecast.y)
    const [displayDateRange, setDisplayDateRange] = useState({
        begin: yHatData[0].ds,
        end: yHatData[yHatData.length - 1].ds
    })

    const pointsToDisplay = points.filter(p =>
        p.ds >= displayDateRange.begin &&
        p.ds <= displayDateRange.end
    )

    const yHatDataToDisplay = yHatData.filter(p =>
        p.ds >= displayDateRange.begin &&
        p.ds <= displayDateRange.end
    )

    const refreshDisplayRange = ({begin, end}) => {
        console.log(`updated to (${begin}, ${end})`)

        setDisplayDateRange({begin, end})
    }

    return (
        <div>
            <YChart points={pointsToDisplay} yHatData={yHatDataToDisplay}/>
            <DisplayRangeRegulator onDisplayRangeChange={setDisplayDateRange}/>
        </div>
    );
};