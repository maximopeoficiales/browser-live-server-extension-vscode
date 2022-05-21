import * as browserSync from 'browser-sync';

export class BrowserSync {
    bs!: browserSync.BrowserSyncInstance;
    pathReal: string = "";
    constructor() {

    }

    public start() {
        if (this.pathReal !== "") {
            this.stop();
            this.bs = browserSync.create().init({
                server: {
                    baseDir: this.pathReal
                },
                files: "css/*.css",
                watch: true,
            }, function (err, bs) {
                console.log({ bs });
            });
        }
    }

    public stop() {
        if (this.bs) {
            this.bs.cleanup();
        }
    }
}
