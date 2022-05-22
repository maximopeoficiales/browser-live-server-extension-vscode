import * as browserSync from 'browser-sync';
import { log } from 'console';
export interface UrlBrowserSync {
    local: string;
    external: string;
    ui: string;
    uiExternal: string;
    port: number;
}

export class BrowserSync {
    bs!: browserSync.BrowserSyncInstance;
    urls: UrlBrowserSync = {
        external: "",
        local: "",
        ui: "",
        uiExternal: "",
        port: 3000,
    };
    constructor() {

    }

    public start(pathReal: string, indexUrl: string): Promise<browserSync.BrowserSyncInstance | Error> {
        return new Promise((resolve, reject) => {
            this.stop();
            this.bs = browserSync.create().init({
                server: {
                    baseDir: pathReal
                },
                open: "external",
                startPath: indexUrl,
                files: "css/*.css",
                watch: true,
            }, (err, bs) => {

                if (err !== null) {
                    console.error(err);
                    resolve(err);
                }

                const urls = bs.getOption('urls');
                const urlsArray = Array.from(urls.values()) as string[];
                this.urls.local = urlsArray[0];
                this.urls.external = urlsArray[1];
                this.urls.ui = urlsArray[2];
                const ipUi = this.urls.external.replace('http://', '');
                const uiExternal = ipUi.split(":")[0];
                const uiExternalPort = ipUi.split(":")[1];
                this.urls.uiExternal = `http://${uiExternal}:${parseInt(uiExternalPort) + 1}`;
                this.urls.port = parseInt(this.urls.local.replace("http://", "").split(":")[1]);
                this.bs = bs;
                resolve(bs);
            });
        });

    }

    public stop() {
        if (this.bs) {
            this.bs.cleanup();
        }
    }
}
