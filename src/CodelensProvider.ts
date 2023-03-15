import * as vscode from 'vscode';
import {TextDocument, DocumentSymbol, SymbolInformation, Location, Range, CodeLens} from 'vscode';
import { flattenOutline } from './symbols';

export class CodelensProvider implements vscode.CodeLensProvider {

	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

	constructor() {
		vscode.workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public async provideCodeLenses(document: TextDocument, token: vscode.CancellationToken): Promise<CodeLens[]> {
		if (vscode.workspace.getConfiguration("refcount-codelens").get("enableCodeLens", true)) {
			const showNonzero = vscode.workspace.getConfiguration("refcount-codelens").get<boolean>("showNonzero", false);

			const symbolTree = await vscode.commands.executeCommand<(SymbolInformation | DocumentSymbol)[]>(
				'vscode.executeDocumentSymbolProvider',
				document.uri
			);


			const symbols = flattenOutline(symbolTree);
			const codeLenses: CodeLens[] = [];
			let deadCount = 0;
			for (const sym of symbols) {
				const locations = await vscode.commands.executeCommand<Location[]>(
					'vscode.executeReferenceProvider',
					document.uri,
					sym.selectionRange.start
				);
				const refcount = locations && locations.length - 1;
				
				if (refcount === 0) ++deadCount;
				if (refcount === 0 || showNonzero) {
					let msg: string;
					if (refcount === 1) {
						msg = `1 reference`;
					} else if (refcount === 0) {
						msg = `${sym.name} has NO detectable references`;
					} else {
						msg = `${refcount} references`;
					}
					codeLenses.push(new CodeLens(sym.selectionRange, {
						title: msg,
						command: '',
					}));
				}
			}

			if (!showNonzero){
				codeLenses.push(new CodeLens(new Range(0,0,0,0), {
					title: (deadCount === 0) ? "No dead code detected" : "Possible dead code detected",
					command: "",
				}));
			}
			return codeLenses;
		}
		return [];
	}

	public async resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
		if (vscode.workspace.getConfiguration("refcount-codelens").get("enableCodeLens", true)) {
			return codeLens;
		}
		return null;
	}
}

