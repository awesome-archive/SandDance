// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { AlignmentBaseline, TextAnchor, TextLayerDatum } from '@deck.gl/layers/text-layer/text-layer';
import { base } from '../base';
import { colorFromString } from '../color';
import {
    GroupType,
    LabelDatum,
    MarkStager,
    MarkStagerOptions
} from './interfaces';
import {
    Scene,
    SceneText,
    SceneTextAlign,
    SceneTextBaseline
} from 'vega-typings';
import { Stage, TickText } from '../interfaces';

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number, groupType: GroupType) => {

    //scale Deck.Gl text to Vega size
    const fontScale = 6;

    //Deck.gl centers text on Y. TODO: is this correct on x axis?
    const offsetYCenter = 16;

    //change direction of y from SVG to GL
    const ty = -1;

    base.vega.sceneVisit(scene, function (item: SceneText) {
        if (!item.text) return;
        const size = item.fontSize * fontScale;
        const textItem: TextLayerDatum = {
            color: colorFromString(item.fill),
            text: item.text.toString(),
            position: [x + item.x - options.offsetX, ty * (y + item.y + offsetYCenter - options.offsetY), 0],
            size,
            angle: convertAngle(item.angle),
            textAnchor: convertAlignment(item.align),
            alignmentBaseline: convertBaseline(item.baseline)
        };

        if (item.mark.role === 'axis-label') {
            const tickText = textItem as TickText;
            tickText.value = (item.datum as LabelDatum).value;
            options.currAxis.tickText.push(tickText);
        } else if (item.mark.role === 'axis-title') {
            options.currAxis.title = textItem;
        } else if (options.currFacetRect && !options.currFacetRect.facetTitle) {
            options.currFacetRect.facetTitle = textItem;
            textItem.position = [x - options.offsetX, ty * (y + offsetYCenter - options.offsetY), 0];
        } else {
            stage.textData.push(textItem);
        }
    });
};

function convertAngle(vegaTextAngle: number) {
    if (vegaTextAngle && !isNaN(vegaTextAngle)) {
        return 360 - vegaTextAngle;
    }
    return 0;
}

function convertAlignment(textAlign: SceneTextAlign): TextAnchor {
    switch (textAlign) {
        case 'center': return 'middle';
        case 'left': return 'start';
        case 'right': return 'end';
    }
    return 'start';
}

function convertBaseline(baseline: SceneTextBaseline): AlignmentBaseline {
    switch (baseline) {
        case 'middle': return 'center';
    }
    return baseline || 'bottom';
}

export default markStager;
