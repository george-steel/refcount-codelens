import { DocumentFilter, DocumentSymbol, SymbolInformation, SymbolKind } from "vscode";

export const supportedLanguages = [
	"typescript",
	"go",
	// TODO: Add more languages once they are confirmed to work
];

export const documentFilter : DocumentFilter[] = supportedLanguages.map(language => ({language, scheme: 'file'}));

// symbol types whose children are not in top-level scope
export const privateScopes = [
	SymbolKind.Function,
	SymbolKind.Method,
	SymbolKind.Variable,
	SymbolKind.Constant,
];

function isDocumentSymbol(sym: SymbolInformation | DocumentSymbol): sym is DocumentSymbol {
	return !! (sym as DocumentSymbol).range;
}

export function flattenOutline(symbols: ReadonlyArray<SymbolInformation | DocumentSymbol>): DocumentSymbol[] {
	const out: DocumentSymbol[] = [];
	function traverse(sym: SymbolInformation | DocumentSymbol) {
		if (!isDocumentSymbol(sym)) return;
		out.push(sym);
		if (!privateScopes.includes(sym.kind)) {
			for (const child of sym.children) {
				traverse(child);
			}
		}
	}

	for (const sym of symbols) {
		traverse(sym);
	}
	return out;
}
