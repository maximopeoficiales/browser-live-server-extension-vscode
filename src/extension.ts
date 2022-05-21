// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as browserSync from 'browser-sync';
import { window, workspace } from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "browser-live-server" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('browser-live-server.helloWorld', () => {
		const pathReal = getCurrentPath();
		const bs = browserSync({
			server: {
				baseDir: pathReal?.replace("index.html", ""),
			},
			files: "css/*.css",
			watch: true,

		}, function (err, bs) {
			console.log({ bs });
		});
		setInterval(() => {
			bs.exit();
		}, 5000);
		// console.log({ info });


		vscode.window.showInformationMessage('Hola se activado mi extension!');
	});

	context.subscriptions.push(disposable);
}
function getCurrentPath() {
	const editor = window.activeTextEditor;
	const pathReal = editor?.document.uri?.path;

	console.log({ pathReal });
	return pathReal;
}


// this method is called when your extension is deactivated
export function deactivate() { }
