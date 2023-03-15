# Reference Count CodeLens

Extension to detect unreferenced code across an entire workspace.
Unlike most language tooling, it does not assume that all public/exported methods are live (as in a pubically-released library),
and is useful for working with multi-package application code.


## Running the Sample

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window