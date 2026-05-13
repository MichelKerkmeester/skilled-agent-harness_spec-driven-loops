# Pre-Flight Notes

## Critical Files Read

- `.opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/implementation-summary.md`

## Environment Sanity

- `node -e "require('node-llama-cpp')"` failed on Node 25 with `ERR_REQUIRE_ASYNC_MODULE` because `node-llama-cpp` is ESM/TLA.
- Equivalent ESM sanity check passed: `node -e "import('node-llama-cpp').then(() => console.log('ok'))"` printed `ok`.
- GGUF model exists at `~/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf` with size `328577056` bytes.

## Pre-Refactor `warnIfMigrationPending`

```typescript
function warnIfMigrationPending(profile: EmbeddingProfile): void {
  if (migrationPendingWarned || profile.provider !== 'llama-cpp') {
    return;
  }

  const packageRoot = resolveSpecKitPackageRoot();
  if (!packageRoot) {
    return;
  }

  const databaseDir = path.join(packageRoot, 'mcp_server', 'database');
  const targetRows = countMemoryIndexRows(profile.getDatabasePath(databaseDir));
  if (targetRows !== null && targetRows > 0) {
    return;
  }

  let hfRows = 0;
  try {
    for (const filename of readdirSync(databaseDir)) {
      if (!filename.startsWith('context-index__hf-local__') || !filename.endsWith('.sqlite')) {
        continue;
      }
      const rowCount = countMemoryIndexRows(path.join(databaseDir, filename));
      if (rowCount !== null && rowCount > hfRows) {
        hfRows = rowCount;
      }
    }
  } catch (_error: unknown) {
    return;
  }

  if (hfRows > 0) {
    migrationPendingWarned = true;
    console.warn(
      `MIGRATION_PENDING: hf-local store contains ${hfRows} rows. ` +
      "Run 'tsx .opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts' to migrate.",
    );
  }
}
```
