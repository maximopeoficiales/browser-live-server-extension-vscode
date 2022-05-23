// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BrowserSync, UrlBrowserSync } from './BrowserSync';
import { Ngrok } from './Ngrok';

// this method is called when your extension is activated
const browserSyncInstance = new BrowserSync();
const ngrokIntance = new Ngrok();
// const token = "1gCdNWAG2JnSW1Ypo02jlvUOLi0_6Ek59WFqADYh7HzYyE12o";
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Se ha activado la extension "browser-live-server');
	// vscode.window.showInformationMessage(`Se ha activado la extension "browser-live-server"`);
	let disposableStartBrowserSync = vscode.commands.registerCommand('browser-live-server.startServer', async () => {
		await initBrowserSync();
	});
	let disposableStopBrowserSync = vscode.commands.registerCommand('browser-live-server.stopServer', async () => {
		await deactivate();
		vscode.window.showWarningMessage(`Se ha detenido el servidor`);
	});

	let disposableStartNgrok = vscode.commands.registerCommand('browser-live-server.startServerNgrok', async () => {
		const config = vscode.workspace.getConfiguration(undefined, null);
		// retrieve values
		// console.log({ config });

		await initBrowserSync(
			async () => {
				await initNgrok();
			}
		);

	});

	let disposableStopNgrok = vscode.commands.registerCommand('browser-live-server.stopServerNgrok', async () => {
		await deactivate();
		vscode.window.showWarningMessage(`Se ha detenido todos los servidores`);
	});

	context.subscriptions.push(disposableStartBrowserSync);
	context.subscriptions.push(disposableStopBrowserSync);
	context.subscriptions.push(disposableStartNgrok);
	context.subscriptions.push(disposableStopNgrok);
}

export async function deactivate() {
	browserSyncInstance.stop();
	await ngrokIntance.stop();
}

const initBrowserSync = async (callback: () => void = () => { }) => {
	const { pathWorkspace, pathUrlIndex } = getCurrentPath();
	if (pathWorkspace) {
		await browserSyncInstance.start(pathWorkspace, pathUrlIndex);
		showMessageWithUrls(browserSyncInstance.urls);
		callback();
	}

};
const initNgrok = async () => {

	const config = vscode.workspace.getConfiguration('browser-live-server');
	const token = config.get("tokenNgrok") as string;
	if (token !== "") {
		console.log({ token });

		const { status, error, url } = await ngrokIntance.start(token, browserSyncInstance.urls.port);
		if (status) {
			console.log({ url });
			vscode.window.showInformationMessage(`El servidor para compartir es: ${url}`);
		} else {
			vscode.window.showErrorMessage(`Error al iniciar ngrok: ${error.message}`);
		}
	} else {
		vscode.window.showErrorMessage(`Por favor configura el token de ngrok en el archivo de configuracion de la extension`);
	}

};
const getCurrentPath = () => {
	const editor = vscode.window.activeTextEditor;
	const pathCurrentDocument = editor?.document.uri!;
	const path = vscode.workspace.getWorkspaceFolder(pathCurrentDocument);
	const pathWorkspace = path?.uri.fsPath;

	const pathUrlIndex = pathCurrentDocument.fsPath.replace(pathWorkspace!, "");
	console.log({ pathWorkspace, pathUrlIndex });

	// const initalPathUrl = path.replace(pathWorkspace, '');

	return { pathWorkspace, pathUrlIndex };
};

const showMessageWithUrls = (urls: UrlBrowserSync) => {
	// vscode.window.showInformationMessage(`El servidor local es: ${urls.local}`);
	vscode.window.showInformationMessage(`El servidor externo es: ${urls.external}`);
	vscode.window.showInformationMessage(`El servidor ui externo es: ${urls.uiExternal}`);
	// vscode.window.showInformationMessage(`El servidor ui es: ${urls.ui}`);

};

