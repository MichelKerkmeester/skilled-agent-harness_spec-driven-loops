### Pass / Fail

- **PASS**: `context-index.sqlite` exists and is nonempty after the run, `memory_index_scan` reports bootstrap or scan completion, and gold-battery verification exits 0.
- **FAIL**: The missing DB causes a hard error, the schema is not created, the DB remains absent or zero bytes, or the gold battery fails without rollback evidence.
- **SKIP**: Runtime cannot invoke the real `/doctor:memory` command or the memory MCP tools are unavailable in the sandbox.
- **UNAUTOMATABLE**: Not expected for this scenario; the behavior is directly runnable in a disposable workspace.

