import * as browserSync from 'browser-sync';
import { log } from 'console';
export interface UrlBrowserSync {
    local: string;
    external: string;
    ui: string;
    uiExternal: string;
}

export class BrowserSync {
    bs!: browserSync.BrowserSyncInstance;
    urls!: UrlBrowserSync;
    constructor() {

    }

    public start(pathReal: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.stop();
            this.bs = browserSync.create().init({
                server: {
                    baseDir: pathReal
                },
                files: "css/*.css",
                watch: true,
            }, (err, bs) => {
                if (!err) {
                    console.error(err);
                    reject(null);
                } else {
                    const urls = bs.getOption('urls');
                    this.urls.local = urls.get("local");
                    this.urls.external = urls.get("external");
                    this.urls.ui = urls.get("ui");
                    this.urls.uiExternal = urls.get("ui-external");
                    this.bs = bs;
                    resolve();
                }
            });
        })

    }

    public stop() {
        if (this.bs) {
            this.bs.cleanup();
        }
    }
}
