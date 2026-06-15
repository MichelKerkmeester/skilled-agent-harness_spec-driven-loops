// Code Mode runs every call_tool_chain inside an isolated-vm V8 isolate.
// isolated-vm has no Node 25+ build: it SIGSEGVs at isolate creation under V8 14.1,
// so this server must build and run on Node 24 (module ABI 137). A native segfault
// cannot be caught, so a wrong-ABI build silently kills the whole MCP connection on
// the first tool call. Warn loudly at install time so that failure mode is legible.
const abi = process.versions.modules;
if (abi !== '137') {
  console.warn(
    '\n[code-mode] WARNING: installed under Node ' + process.versions.node +
    ' (module ABI ' + abi + '). This server requires Node 24 (ABI 137). ' +
    'isolated-vm has no Node 25+ build and will SIGSEGV on call_tool_chain. ' +
    'Use Node 24 (see .nvmrc), then: npm rebuild isolated-vm.\n'
  );
}
