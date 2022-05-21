// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, workspace } from 'vscode';
import { BrowserSync } from './BrowserSync';

// this method is called when your extension is activated
const browserSync = new BrowserSync();
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "browser-live-server" is now active!');

	vscode.window.showInformationMessage(`Se ha activado la extension "browser-live-server"`);

	let disposableStart = vscode.commands.registerCommand('browser-live-server.startServer', async () => {
		const pathReal = getCurrentPath();
		if (pathReal) {

			await browserSync.start(pathReal);
			console.log(browserSync.urls);

		}

		vscode.window.showInformationMessage(`Se ha activado el servidor`);
	});


	let disposableStop = vscode.commands.registerCommand('browser-live-server.stopServer', () => {
		browserSync.stop();
		vscode.window.showWarningMessage(`Se ha detenido el servidor`);
	});

	context.subscriptions.push(disposableStart);
	context.subscriptions.push(disposableStop);
}
function getCurrentPath() {
	const editor = window.activeTextEditor;
	const path = workspace.getWorkspaceFolder(editor?.document.uri!);
	return path?.uri.path;
}


export function deactivate() {
	browserSync.stop();
}
