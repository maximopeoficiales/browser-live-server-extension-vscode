import * as ngrok from "ngrok";
export interface StartNgrok {
    status: boolean;
    url: string;
    error: any;
}
export class Ngrok {
    status: string = "";
    url!: string;
    async start(token: string, port: number): Promise<StartNgrok> {
        try {
            await this.stop();
            await ngrok.connect({
                authtoken: token,
                addr: port,
                region: "us",
                onStatusChange: status => {
                    this.status = status;
                    console.log(status);
                }, // 'closed' - connection is lost, 'connected' - reconnected
                onLogEvent: data => {
                    // console.log(data);
                },
            });
            const api = ngrok.getApi();
            const { tunnels } = await api!.listTunnels();
            // console.log(tunnels);

            if (tunnels.length > 0) {
                this.url = tunnels[0].public_url;
                return { status: true, url: this.url, error: null };
            } else {
                return { status: false, url: "", error: "La ejecucion de ngrok ha fallado al generar una url publica" };
            }
        } catch (error) {
            console.error(error);
            return { status: false, url: this.url, error: error };
        }
    }
    async stop(): Promise<boolean> {
        try {
            await ngrok.disconnect();
            await ngrok.kill();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

