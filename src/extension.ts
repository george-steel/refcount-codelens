// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window } from 'vscode';
import { CodelensProvider } from './CodelensProvider';
import { documentFilter } from './symbols';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
	const codelensProvider = new CodelensProvider();

	languages.registerCodeLensProvider(documentFilter, codelensProvider);

	commands.registerCommand("refcount-codelens.enableCodeLens", () => {
		workspace.getConfiguration("refcount-codelens").update("enableCodeLens", true, true);
	});

	commands.registerCommand("refcount-codelens.disableCodeLens", () => {
		workspace.getConfiguration("refcount-codelens").update("enableCodeLens", false, true);
	});

	commands.registerCommand("refcount-codelens.codelensAction", (args: any) => {
		window.showInformationMessage(`CodeLens action clicked with args=${args}`);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
