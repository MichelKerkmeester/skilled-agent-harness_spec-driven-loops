#!/usr/bin/env node
// The tool-ownership lint compared the MCP tool schema against a generated
// ownership map. Both left with the memory server, so there is nothing to
// lint. This entry point stays only because a pre-commit hook installed from
// an older template still calls it and blocks when the file is missing; it
// can go once every checkout runs the template that no longer names it.
console.log('tool-ownership lint: nothing to lint, the tool schema no longer exists');
process.exit(0);
