// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { FabricComponents } from '@msrvida/office-ui-fabric-react-cdn-typings';
import { SandDance } from '@msrvida/sanddance-react';

/**
 * References to dependency libraries.
 */
export interface Base {
  fabric: FabricComponents;
}

export const base: Base = {
    fabric: null
};

/**
 * Specify the dependency libraries to use for rendering.
 * @param fabric Office UI Fabric React library.
 */
export function use(
    fabric: FabricComponents,
    vega: SandDance.VegaDeckGl.types.VegaBase,
    deck: SandDance.VegaDeckGl.types.DeckBase,
    layers: SandDance.VegaDeckGl.types.DeckLayerBase,
    luma: SandDance.VegaDeckGl.types.LumaBase
) {
    SandDance.VegaDeckGl.use(vega, deck, layers, luma);
    base.fabric = fabric;
}
