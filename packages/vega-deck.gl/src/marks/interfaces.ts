// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { Axis, FacetRect, Stage } from '../interfaces';
import { Color } from '@deck.gl/core/utils/color';
import { Scene, SceneGroup } from 'vega-typings';

export enum GroupType {
    none = 0,
    legend = 1,
    xAxis = 2,
    yAxis = 3
}

export interface MarkStagerOptions {
    offsetX: number;
    offsetY: number;
    maxOrdinal: number;
    ordinalsSpecified: boolean;
    currAxis: Axis;
    currFacetRect: FacetRect;
    defaultCubeColor: Color
}

//TODO - use vega-typings below
export type SceneGroup2 = SceneGroup & {
    datum?: any;
};
export interface LabelDatum {
    value: any;
}
//TODO - use vega-typings above


export interface MarkStager {
    (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number, groupType: GroupType): void;
}
