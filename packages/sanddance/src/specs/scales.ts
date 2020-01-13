// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { ColorBin } from './types';
import { ColorScaleNone, ScaleNames, SignalNames } from './constants';
import {
    LinearScale,
    PointScale,
    QuantileScale,
    QuantizeScale,
    RangeBand,
    RangeScheme,
    ScaleData,
    SignalRef
} from 'vega-typings';

export function linearScale(name: string, data: string, field: string, range: RangeScheme, reverse: boolean, zero: boolean) {
    const scale: LinearScale = {
        name,
        type: 'linear',
        range,
        round: true,
        reverse,
        domain: {
            data,
            field
        },
        zero,
        nice: true
    };
    return scale;
}

export function pointScale(name: string, data: string, range: RangeBand, field: string, reverse?: boolean) {
    const scale: PointScale = {
        name,
        type: 'point',
        range,
        domain: {
            data,
            field,
            sort: true
        },
        padding: 0.5
    };
    if (reverse !== undefined) {
        scale.reverse = reverse;
    }
    return scale;
}

export function binnableColorScale(colorBin: ColorBin, data: string, field: string, scheme?: string) {
    scheme = scheme || ColorScaleNone;
    const name = ScaleNames.Color;
    const domain: ScaleData = {
        data,
        field
    };
    const range: RangeScheme = {
        scheme
    };
    const reverse: SignalRef = { signal: SignalNames.ColorReverse };
    if (colorBin !== 'continuous') {
        range.count = { signal: SignalNames.ColorBinCount };
    }
    switch (colorBin) {
        case 'continuous': {
            const sequentialScale: LinearScale = {
                name,
                type: 'linear',
                domain,
                range,
                reverse
            };
            return sequentialScale;
        }
        case 'quantile': {
            const quantileScale: QuantileScale = {
                name,
                type: 'quantile',
                domain,
                range,
                reverse
            };
            return quantileScale;
        }
        default: {
            const quantizeScale: QuantizeScale = {
                name,
                type: 'quantize',
                domain,
                range,
                reverse
            };
            return quantizeScale;
        }
    }
}
