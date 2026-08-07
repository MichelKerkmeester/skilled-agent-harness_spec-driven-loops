# Seat opus-regression-code — iteration 1 (global #1)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-regression-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

I've traced the complete durable-write path for my regression angle. Here is my analysis.

## Review: secret scrubbing fail-closed at the atomic-save entry for durable artifacts

**Scope traced (read in full):**
- `lib/parsing/secret-scrubber.ts` (re-export) → canonical `shared/parsing/secret-scrubber.ts` (fail-closed `SecretScrubberError`, `Object.setPrototypeOf` to keep `instanceof` valid post-transpile).
- `handlers/memory-save.ts`: the atomic-save entry `atomicSaveMemory` (3793), `buildCanonicalAtomicPreparedSave` (1471), `processPreparedMemory` durable writes (2511, 2701), `finalizeMemoryFileContent` (595), `indexMemoryFile` (2833), `handleMemorySaveInner` write dispatch (3636/3670), top handler `handleMemorySave` (3061).
- `handlers/save/atomic-index-memory.ts` orchestrator (pending-file write/promote/rollback).
- `lib/parsing/memory-parser.ts` parser scrub (276) reached by both `parseMemoryFile` and `parseMemoryContent`.

**Findings — the durable path scrubs and is not bypassable:**

1. **Entry scrub wiring is correct.** `atomicSaveMemory` scrubs `params.content` at line 3799 *before any branch or write*, reassigning `params` (3804). Both the plan-only branch (`buildCanonicalAtomicPreparedSave` at 3813) and the mutating `atomicIndexMemory` path (3826) consume the scrubbed `params`. The canonical merge payload (1673, 1675), continuity record source (1628, 1636, 1700), and parsed copy (1476) all derive from the scrubbed `params.content`. `persistedContent` → `writePendingFile` (3943) → `promotePendingFile` is the merged-scrubbed text. The orchestrator fallback `ready.persistedContent ?? content` (atomic-index-memory:354) falls back to the *scrubbed* destructured `content`.

2. **Second durable mechanism is also scrubbed.** The non-atomic `indexMemoryFile` write path (3670→2850) parses via `parseMemoryFile`→`parseMemoryContent`, which scrubs at parser:276, so `parsed.content` and the derived `finalizedFileContent` written by `finalizeMemoryFileContent` (2511/2701, fs write at 617) carry redacted text.

3. **Fail-closed holds on scrubber error.** Neither scrub call site is wrapped in a local try/catch that could fall through to a raw write. A thrown `SecretScrubberError` at the entry (3799) occurs before any file write and propagates to `handleMemorySave`'s top-level catch (3069), producing a classified error response with nothing persisted. A throw at parser:276 propagates through `indexMemoryFile` to the catch at 3681. No raw-content fallback exists on either path.

4. **All other fs writers verified safe.** The only durable content writers are the pending-file write (3943, scrubbed) and `finalizeMemoryFileContent` (617, parser-scrubbed). The `restoreOriginalState` writes (memory-save:878, atomic-index-memory:148) only restore previously-captured on-disk content during rollback — they reinstate prior state, not new content, so they introduce no new leak. `spec-folder-mutex:63` writes lock metadata, not memory content.

**One boundary I examined and deliberately do not flag:** the canonical merge preserves the existing target-doc body (`originalTargetContent`, 1604) unscrubbed when merging new content into it. This is pre-existing durable content the save did not author; re-scrubbing whole target bodies on every merge is not what the entry-scrub contract ("scrub what you write") promises, and treating it as a defect would be a false positive — the secret, if any, was already at rest before this write and the *new* payload is scrubbed.

Verdict: the regression is intact. The durable path scrubs via the entry (atomic writes) and the parser (index-file writes), and is fail-closed with no bypass for content `memory_save` persists.

```json
{"seat":"opus-regression-code","model":"claude-opus-4-8","angle":"REGRESSION: secret scrubbing now fail-closed at the atomic-save entry for DURABLE artifacts (not just the parsed/index copy). Verify the durable path actually scrubs and cannot be bypassed.","verdict":"PASS","summary":"Entry scrub (atomicSaveMemory:3799) covers canonical/continuity/pending durable writes; parser scrub (memory-parser:276) covers index-file writes; both fail-closed with no raw-write fallback. No bypass found.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/parsing/secret-scrubber.ts",".opencode/skills/system-spec-kit/shared/parsing/secret-scrubber.ts",".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts",".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts",".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts",".opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts"],"findings":[]}
```
