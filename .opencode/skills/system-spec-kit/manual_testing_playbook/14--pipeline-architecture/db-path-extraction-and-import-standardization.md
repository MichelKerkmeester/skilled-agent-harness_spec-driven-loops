---
title: "087 -- DB_PATH extraction and import standardization"
description: "This scenario validates DB_PATH extraction and import standardization for `087`. It focuses on Confirm shared DB path resolution."
audited_post_018: true
version: 3.6.0.16
---

# 087 -- DB_PATH extraction and import standardization

## 1. OVERVIEW

This scenario validates DB_PATH extraction and import standardization for `087`. It focuses on Confirm shared DB path resolution.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm shared DB path resolution.
- Real user request: `Please validate DB_PATH extraction and import standardization against the documented validation surface and tell me whether the expected signals are present: All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge.`
- Prompt: `Validate DB_PATH extraction and import standardization against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all entry points resolve the same DB path and env var precedence is consistent across scripts/tools

---

## 3. TEST EXECUTION

### Prompt

```
Validate DB_PATH extraction and import standardization against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. vary DB env vars
2. run scripts/tools
3. confirm shared resolver output

### Expected

All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge

### Evidence

Real execution transcript and observed values:

```text
$ pwd
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
```

```text
$ node -e "for (const key of ['MEMORY_DB_PATH','SPEC_KIT_DB_DIR','SPECKIT_DB_DIR']) console.log(key + '=' + (process.env[key] ?? '<unset>'))"
MEMORY_DB_PATH=<unset>
SPEC_KIT_DB_DIR=<unset>
SPECKIT_DB_DIR=<unset>
```

```text
$ MEMORY_DB_PATH=.opencode/skills/system-spec-kit/mcp_server/database/manual-memory.sqlite SPEC_KIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a SPECKIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-b node --input-type=module -e "const config = await import('./.opencode/skills/system-spec-kit/shared/dist/config.js'); const paths = await import('./.opencode/skills/system-spec-kit/shared/dist/paths.js'); console.log(JSON.stringify({getDbDir: config.getDbDir(), DB_PATH: paths.DB_PATH}, null, 2));"
{
  "getDbDir": ".opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a",
  "DB_PATH": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/manual-memory.sqlite"
}
```

```text
$ SPEC_KIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a SPECKIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-b node --input-type=module -e "const config = await import('./.opencode/skills/system-spec-kit/shared/dist/config.js'); const paths = await import('./.opencode/skills/system-spec-kit/shared/dist/paths.js'); console.log(JSON.stringify({getDbDir: config.getDbDir(), DB_PATH: paths.DB_PATH}, null, 2));"
{
  "getDbDir": ".opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a",
  "DB_PATH": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a/context-index.sqlite"
}
```

```text
$ SPECKIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-b node --input-type=module -e "const config = await import('./.opencode/skills/system-spec-kit/shared/dist/config.js'); const paths = await import('./.opencode/skills/system-spec-kit/shared/dist/paths.js'); console.log(JSON.stringify({getDbDir: config.getDbDir(), DB_PATH: paths.DB_PATH}, null, 2));"
{
  "getDbDir": ".opencode/skills/system-spec-kit/mcp_server/database/spec-kit-b",
  "DB_PATH": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-b/context-index.sqlite"
}
```

Catalog-listed script/tool tests executed:

```text
$ node .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js
RESULTS: 30 passed, 0 failed, 5 skipped
```

```text
$ node .opencode/skills/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js
📊 TEST SUMMARY
✅ Passed:  53
❌ Failed:  0
⏭️  Skipped: 1
📝 Total:   54

🎉 ALL TESTS PASSED!
```

```text
$ node scripts/node_modules/vitest/vitest.mjs run scripts/tests/import-policy-rules.vitest.ts --config mcp_server/vitest.config.ts --root .
Test Files  1 passed (1)
Tests  4 passed (4)
```

Shared-import evidence from source reads:

```text
shared/config.ts:9: export function getDbDir(): string | undefined {
shared/config.ts:10:   return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
shared/paths.ts:8: import { getDbDir } from './config.js';
shared/paths.ts:107:   const configuredPath = process.env.MEMORY_DB_PATH?.trim();
scripts/memory/cleanup-orphaned-vectors.ts:15: import { DB_PATH } from '@spec-kit/shared/paths';
scripts/spec-folder/folder-detector.ts:19: import { DB_PATH } from '@spec-kit/shared/paths';
```

Contradicting script/tool evidence found while checking for hardcoded fallback divergence:

```text
$ grep equivalent for mcp_server/database/context-index hardcoded paths under scripts
scripts/evals/run-bm25-baseline.ts:39: const DB_DIR = path.resolve(moduleDir, '../../mcp_server/database');
scripts/evals/run-ablation.ts:50: const DB_DIR = path.resolve(SCRIPTS_ROOT, '../mcp_server/database');
scripts/evals/map-ground-truth-ids.ts:34: const DB_DIR = path.resolve(SCRIPTS_ROOT, '../mcp_server/database');
```

```text
$ SPEC_KIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a SPECKIT_DB_DIR=.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-b node --input-type=module -e "import path from 'node:path'; const shared = await import('./.opencode/skills/system-spec-kit/shared/dist/paths.js'); const profile = await import('./.opencode/skills/system-spec-kit/shared/dist/embeddings/profile.js'); const evalDbDir = path.resolve('.opencode/skills/system-spec-kit/scripts', '../mcp_server/database'); console.log(JSON.stringify({shared_DB_PATH: shared.DB_PATH, eval_resolveActiveProfileDbPath_with_explicit_DB_DIR: profile.resolveActiveProfileDbPath(undefined, evalDbDir)}, null, 2));"
{
  "shared_DB_PATH": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a/context-index.sqlite",
  "eval_resolveActiveProfileDbPath_with_explicit_DB_DIR": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
}
```

### Pass / Fail

- **FAIL**: Catalog-listed consumers/tests passed and the shared resolver honors `MEMORY_DB_PATH > SPEC_KIT_DB_DIR > SPECKIT_DB_DIR`, but broader script/tool validation found eval entry points that pass an explicit `mcp_server/database` DB dir and resolve `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` while the shared resolver resolves `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/spec-kit-a/context-index.sqlite` for the same `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` env vars.

### Failure Triage

Verify shared resolver module is imported by all consumers; check env var precedence order; inspect for hardcoded path fallbacks

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/dbpath-extraction-and-import-standardization.md](../../feature_catalog/14--pipeline-architecture/dbpath-extraction-and-import-standardization.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 087
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/db-path-extraction-and-import-standardization.md`
