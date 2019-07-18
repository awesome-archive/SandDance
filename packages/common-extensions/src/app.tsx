// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
declare var vega: SandDanceExplorer.SandDance.VegaDeckGl.types.VegaBase;
declare var deck: SandDanceExplorer.SandDance.VegaDeckGl.types.DeckBase & SandDanceExplorer.SandDance.VegaDeckGl.types.DeckLayerBase;
declare var luma: SandDanceExplorer.SandDance.VegaDeckGl.types.LumaBase;
declare var Fabric: _Fabric.FabricComponents;

SandDanceExplorer.use(Fabric, vega, deck, deck, luma);

function getTextcolor() {
    const cssColor = getComputedStyle(document.body).color;
    return SandDanceExplorer.SandDance.VegaDeckGl.util.colorFromString(cssColor);
}

function getThemePalette(darkTheme: boolean) {
    const theme = darkTheme ? 'dark-theme' : '';
    return SandDanceExplorer.themePalettes[theme];
}

function getViewerOptions() {
    const color = getTextcolor();
    const viewerOptions: Partial<SandDanceExplorer.SandDance.types.ViewerOptions> = {
        colors: {
            axisLine: color,
            axisText: color,
            hoveredCube: color
        }
    };
    return viewerOptions;
}

function getVscodeThemeClassName() {
    const classList = [].slice.apply(document.body.classList) as string[];
    const prefixed = classList.filter(className => className.indexOf('vscode') === 0);
    if (prefixed.length) {
        return prefixed[0];
    }
}

interface State {
    darkTheme: boolean;
}

interface Handlers {
    message: (e: MessageEvent) => void;
    resize: (e: UIEvent) => void;
}

interface Props {
    telemetryLog?: SandDanceExplorer.ITelemetryLog
}

class App extends React.Component<Props, State> {
    private viewerOptions: Partial<SandDanceExplorer.SandDance.types.ViewerOptions>;
    private handlers: Handlers;
    public explorer: SandDanceExplorer.Explorer;

    constructor(props: {}) {
        super(props);
        this.state = {
            darkTheme: null
        };
        this.viewerOptions = getViewerOptions();

        this.handlers = {
            message: event => {
                // Handle the message inside the webview
                const message = event.data as Message;

                switch (message.command) {
                    case 'gotFileContent':
                        this.explorer && this.explorer.load(message.dataFile);

                        //TODO: hydrate state

                        break;
                }
            },
            resize: e => {
                this.explorer && this.explorer.resize();
            }
        };
    }

    private wireEventHandlers(add: boolean) {
        for (let key in this.handlers) {
            if (add) {
                window.addEventListener(key, this.handlers[key]);
            } else {
                window.removeEventListener(key, this.handlers[key]);
            }
        }
    }

    checkForDarkTheme() {
        this.viewerOptions = getViewerOptions();
        let vscodeThemeClassName = getVscodeThemeClassName();
        const darkTheme = vscodeThemeClassName.indexOf('dark') >= 0;
        if (this.state.darkTheme !== darkTheme && this.explorer) {
            this.explorer.updateViewerOptions(this.viewerOptions);
            if (this.explorer.viewer) {
                this.explorer.viewer.renderSameLayout(this.explorer.viewerOptions);
            }
        }
        Fabric.loadTheme({ palette: getThemePalette(darkTheme) });
        this.setState({ darkTheme });
    }

    mounted(explorer: SandDanceExplorer.Explorer) {
        this.explorer = explorer;

        this.wireEventHandlers(true);

        const vscode = acquireVsCodeApi();

        vscode.postMessage({
            command: 'getFileContent'
        })

        this.checkForDarkTheme();

        new MutationObserver((mutationRecords) => {
            this.checkForDarkTheme();
        }).observe(document.body, { attributeFilter: ['class'] });
    }

    render() {
        return (
            <SandDanceExplorer.Explorer
                logoClickUrl="https://microsoft.github.io/SandDance/"
                theme={this.state.darkTheme && 'dark-theme'}
                viewerOptions={this.viewerOptions}
                initialView="2d"
                mounted={e => this.mounted(e)}
                telemetryLog={this.props.telemetryLog} //did this
            />
        );
    }
}

const app = React.createElement(App);
ReactDOM.render(app, document.getElementById('app'));
