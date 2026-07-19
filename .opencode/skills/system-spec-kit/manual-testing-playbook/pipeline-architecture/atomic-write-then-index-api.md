---
title: "203 -- Atomic write-then-index API"
description: "This scenario validates Atomic write-then-index API for `203`. It focuses on verifying that the handler writes to a pending path, indexes before promotion, retries transient indexing once, and only renames into place after success."
audited_post_018: true
version: 3.6.0.12
id: pipeline-architecture-atomic-write-then-index-api
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 203 -- Atomic write-then-index API

## 1. OVERVIEW

This scenario validates Atomic write-then-index API for `203`. It focuses on verifying that the handler writes to a pending path, indexes before promotion, retries transient indexing once, and only renames into place after success.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the save flow enforces pending write -> index attempt(s) -> final rename ordering with rollback before promotion on failure.
- Real user request: `Please validate Atomic write-then-index API against the documented validation surface and tell me whether the expected signals are present: Unique pending path is created before promotion; indexing runs before final rename; transient indexing failure gets one retry; successful flow ends with pending-file rename into place; validation/index failure cleans up the pending file and leaves the original target untouched.`
- Prompt: `Validate the atomic write-then-index API against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Unique pending path is created before promotion; indexing runs before final rename; transient indexing failure gets one retry; successful flow ends with pending-file rename into place; validation/index failure cleans up the pending file and leaves the original target untouched
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the handler enforces write/index/rename ordering with cleanup on failure; FAIL if files are promoted before indexing, retries do not occur as documented, or failed saves leave promoted/partial artifacts behind

---

## 3. TEST EXECUTION

### Prompt

```
Validate the atomic write-then-index API against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Trigger a normal save and capture the pending-file path creation before the final file exists
2. Observe that indexing is attempted against the target path before promotion
3. Induce one transient indexing failure and confirm a single retry occurs before success
4. Verify the file is renamed into place only after the successful indexing attempt
5. Run a failing validation or permanent indexing failure case and confirm the pending file is cleaned up with no promoted final artifact

### Expected

Unique pending path is created before promotion; indexing runs before final rename; transient indexing failure gets one retry; successful flow ends with pending-file rename into place; validation/index failure cleans up the pending file and leaves the original target untouched

### Evidence

Preconditions: this scenario file has no explicit `Preconditions` section.

Source surface read:

- `.opencode/skills/system-spec-kit/feature-catalog/pipeline-architecture/atomic-write-then-index-api.md` says `memory_save` delegates the canonical atomic writer to `handlers/save/atomic-index-memory.ts`; it "computes a unique pending path, writes the spec-doc record content to that pending file, runs async indexing against the target file path before promotion, retries indexing once on transient failure, and only then renames the pending file into place. If validation, rejection, or indexing fails, the handler deletes the pending file so the original file remains untouched."
- `.opencode/skills/system-spec-kit/mcp-server/handlers/save/atomic-index-memory.ts` observed ordering: `getPendingPath` at lines 353-358, `writePendingFile` at line 360, `indexPrepared` at line 362, rejected-save pending cleanup at lines 364-367, final promotion via `promotePendingFile` at line 378, retry loop continuation at lines 430-441, and retry-exhaustion failure result at lines 444-450.

Command transcript:

```text
$ npx vitest run tests/atomic-index-memory.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  14:11:50
   Duration  233ms (transform 90ms, setup 18ms, import 124ms, tests 15ms, environment 0ms)
```

Verbose command transcript:

```text
$ npx vitest run tests/atomic-index-memory.vitest.ts --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp-server/tests/atomic-index-memory.vitest.ts
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > writes canonical content and returns a success payload 4ms
 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > promotes routed canonical content into the prepared persisted file path 2ms
 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > rolls back the original file when canonical indexing returns rejected 4ms
 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > surfaces pending cleanup metadata when rejected writes cannot remove the pending file 2ms
 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > retries once when canonical indexing throws and then succeeds 3ms
 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > restores or removes the promoted file after retry exhaustion 2ms
 ✓ mcp-server/tests/atomic-index-memory.vitest.ts > atomicIndexMemory > serializes concurrent writes through the shared spec-folder lock 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  14:15:05
   Duration  236ms (transform 90ms, setup 17ms, import 126ms, tests 19ms, environment 0ms)
```

Specific observed assertion coverage from `.opencode/skills/system-spec-kit/mcp-server/tests/atomic-index-memory.vitest.ts`:

- Success path wrote and promoted final content: `expect(result.success).toBe(true)`, `expect(result.status).toBe('indexed')`, `expect(fs.readFileSync(filePath, 'utf8')).toBe('# normalized canonical content')`, and `expect(fs.readdirSync(path.dirname(filePath)).every((entry) => !entry.includes('_pending'))).toBe(true)` at lines 85-88.
- Routed target promotion kept source untouched and wrote the prepared target: `expect(result.filePath).toBe(targetPath)`, `expect(fs.readFileSync(sourcePath, 'utf8')).toBe('# original source memory')`, and `expect(fs.readFileSync(targetPath, 'utf8')).toBe('# routed canonical summary')` at lines 113-116.
- Rejected indexing did not promote replacement content over the original: `expect(result.status).toBe('rejected')`, `expect(indexPrepared).toHaveBeenCalledTimes(1)`, and `expect(fs.readFileSync(filePath, 'utf8')).toBe('# original content')` at lines 138-142.
- Pending cleanup failure is surfaced rather than hidden: `expect(result.error).toContain('Pending file cleanup failed')` and `expect(result.errorMetadata).toEqual({ pendingCleanupError: 'simulated pending cleanup failure' })` at lines 168-171.
- Transient indexing failure got exactly one retry before success: `mockRejectedValueOnce(new Error('simulated transient canonical indexing failure'))`, `mockResolvedValueOnce(...)`, `expect(prepare).toHaveBeenCalledTimes(2)`, `expect(indexPrepared).toHaveBeenCalledTimes(2)`, and `expect(fs.readFileSync(filePath, 'utf8')).toBe('# second attempt wins')` at lines 185-202.
- Permanent indexing failure did not leave a promoted final artifact: `throw new Error('simulated persistent canonical indexing failure')`, `expect(result.status).toBe('error')`, `expect(result.error).toContain('Indexing failed after retry')`, and `expect(fs.existsSync(filePath)).toBe(false)` at lines 214-223.
- Before-promotion state was observed in the concurrent write test: after the first pending write and before release, `expect(fs.existsSync(filePath)).toBe(false)`, `expect(pendingWrites).toEqual(['# first canonical write'])`, and `expect(promotions).toEqual([])` at lines 280-283; after both saves, `expect(promotions).toEqual(['# first canonical write', '# second canonical write'])` and `expect(fs.readFileSync(filePath, 'utf8')).toBe('# second canonical write')` at lines 297-302.

Additional attempted trace harness output, not used for verdict because the repository runner rejected inline ESM evaluation:

```text
$ npx tsx --eval "..."
sh: tsx: command not found
```

```text
$ npm exec -- ts-node --esm --eval "... import { atomicIndexMemory } from './handlers/save/atomic-index-memory.ts' ..."
[eval].ts(1,117): error TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
```

```text
$ npm exec -- ts-node --esm --eval "... import { atomicIndexMemory } from './handlers/save/atomic-index-memory' ..."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server/[eval].ts:1
import fs from 'node:fs';
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

### Pass / Fail

PASS — `atomic-index-memory.vitest.ts` passed 7/7 focused tests, and the observed assertions cover pending write before promotion, indexing before rename, one retry after transient indexing failure, final rename only after success, and cleanup/no promoted final artifact on rejected or permanently failing indexing paths.

### Failure Triage

Inspect `memory-save.ts` ordering and retry path; verify pending-path generation/cleanup helpers in `transaction-manager.ts`; confirm tool schema and save handler inputs do not bypass the guarded flow

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [pipeline-architecture/atomic-write-then-index-api.md](../../feature-catalog/pipeline-architecture/atomic-write-then-index-api.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 203
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pipeline-architecture/atomic-write-then-index-api.md`
