// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, workspace } from 'vscode';
import { BrowserSync, UrlBrowserSync } from './BrowserSync';

// this method is called when your extension is activated
const browserSyncInstance = new BrowserSync();
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Se ha activado la extension "browser-live-server');
	// vscode.window.showInformationMessage(`Se ha activado la extension "browser-live-server"`);
	let disposableStart = vscode.commands.registerCommand('browser-live-server.startServer', async () => {
		const { pathWorkspace, pathUrlIndex } = getCurrentPath();
		if (pathWorkspace) {
			await browserSyncInstance.start(pathWorkspace,pathUrlIndex);
			showMessageWithUrls(browserSyncInstance.urls);


		}

		// vscode.window.showInformationMessage(`Se ha activado el servidor`);
	});


	let disposableStop = vscode.commands.registerCommand('browser-live-server.stopServer', () => {
		browserSyncInstance.stop();
		vscode.window.showWarningMessage(`Se ha detenido el servidor`);
	});

	context.subscriptions.push(disposableStart);
	context.subscriptions.push(disposableStop);
}

export function deactivate() {
	browserSyncInstance.stop();
}

const getCurrentPath = () => {
	const editor = window.activeTextEditor;
	const pathCurrentDocument = editor?.document.uri!;
	const path = workspace.getWorkspaceFolder(pathCurrentDocument);
	const pathWorkspace = path?.uri.fsPath;

	const pathUrlIndex = pathCurrentDocument.fsPath.replace(pathWorkspace!, "");
	console.log({ pathWorkspace, pathUrlIndex });

	// const initalPathUrl = path.replace(pathWorkspace, '');

	return { pathWorkspace, pathUrlIndex };
};

const showMessageWithUrls = (urls: UrlBrowserSync) => {
	vscode.window.showInformationMessage(`El servidor local es: ${urls.local}`);
	vscode.window.showInformationMessage(`El servidor externo es: ${urls.external}`);
	vscode.window.showInformationMessage(`El servidor ui externo es: ${urls.uiExternal}`);
	// vscode.window.showInformationMessage(`El servidor ui es: ${urls.ui}`);

};

