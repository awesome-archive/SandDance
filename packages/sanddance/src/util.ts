// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as VegaDeckGl from '@msrvida/vega-deck.gl';
import { FieldNames } from './constants';

const { GL_ORDINAL } = VegaDeckGl.constants;

export { getColumnsFromData, getStats, inferAll } from './specs/inference';
export { ensureSearchExpressionGroupArray } from './searchExpression/group';
export { getPresenterStyle } from './defaults';

export function isInternalFieldName(columnName: string, includeVegaDeckGLFields = false) {
    if (includeVegaDeckGLFields) {
        if (columnName === GL_ORDINAL) return true;
    }
    for (let f in FieldNames) {
        if (columnName === FieldNames[f]) return true;
    }
    return false;
}
