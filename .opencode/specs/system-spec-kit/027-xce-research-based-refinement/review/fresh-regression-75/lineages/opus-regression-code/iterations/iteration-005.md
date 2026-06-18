# Seat opus-regression-code — iteration 5 (global #5)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-regression-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

Both fixes verified. Here's my analysis.

## Review: opus-regression-code — PreCompact merge + spec-folder detection

### Fix 1 — Authored-continuity MERGE (preserving authored fields)

**Verified HOLDING.** `authored-continuity-snapshot.ts:110-131` now threads a `currentRecord` into `buildContinuityRecord`:
- `blockers`, `key_files`, `completion_pct`, `open_questions`, `answered_questions`, and `session_dedup` all fall back to the authored record via `currentRecord?.X ?? …` (and conditional spread for `session_dedup`).
- The call site (`:205-219`) reads the live record first with `readThinContinuityRecord(currentSummary)` and passes it only when `currentContinuity.ok`, so a first-write (no record) correctly falls back to ladder/zeroed defaults.
- `??` (not `||`) means an authored empty array (`blockers: []`) is preserved, not clobbered by ladder values — correct nil-coalescing semantics.
- `recent_action`/`next_safe_action` are intentionally recomputed from the ladder (that is the snapshot's purpose), and the whole write is guarded by an earlier `ladder.source === 'none'` → `skipped` return (`:173-182`), so nothing is overwritten when there is no authored context to derive from.
- `upsertThinContinuityInMarkdown` (`thin-continuity-record.ts:1058-1085`) preserves the markdown body and merges only the continuity block into frontmatter — no body loss.

This is locked by a real, non-vacuous regression test (`openltm-continuity-resilience.vitest.ts:223-283`) asserting `completion_pct: 80`, `open_questions:['Q1']`, `answered_questions:['Q2']`, and full `session_dedup` survive while timestamps/actor/recent_action update. The disabled-path test (`:325-341`) confirms byte-for-byte no-op when the flag is off.

### Fix 2 — Spec-folder detection no longer mangles paths

**Verified HOLDING.** `compact-inject.ts:115-131`:
- Capture class widened from `[\w/-]+` (excluded dots → swallowed `…/implementation-summary` minus extension into a bogus folder) to `[^\s"'\`]+`, so dotted doc paths are captured whole.
- Trailing punctuation is stripped (`/[),.;:!?]+$/`) handling markdown parens/sentence punctuation, then the file component is removed only when it ends in `name.ext` (`/\/[^/]+\.[A-Za-z0-9]+$/`), resolving to the containing folder.
- Round-trips cleanly into `normalizeSpecFolder` (strips `.opencode/specs/` prefix) → `resolveSpecFolderPath` (re-joins + existence check). A mis-detected path fails the existence check and the snapshot skips gracefully; the whole hook is wrapped in try/catch + `process.exit(0)`, so no detection error can block compaction.
- Guarded by added test (`hook-precompact.vitest.ts:89-98`) covering both the `…/implementation-summary.md` mention and the bare-folder mention.

### Observation (not a finding)
The widened class `[^\s"'\`]+` is greedy and would over-capture two paths joined with no whitespace/quote between them (`…/spec.md,.opencode/specs/a/b`). In real JSONL transcripts paths are bounded by `"`, the embedded-comma case is contrived, and the outcome is fail-safe (non-existent folder → graceful skip, no data loss). Not elevated to a finding — it is bounded, unreachable in practice, and the trailing/markdown cases are explicitly handled.

Both regression fixes are correct, complete, and test-guarded. No new defects on this angle.

```json
{"seat":"opus-regression-code","model":"claude-opus-4-8","angle":"REGRESSION: PreCompact snapshot now MERGES with the existing record (preserving authored continuity) and spec-folder detection no longer mangles file paths. Verify both fixes hold.","verdict":"PASS","summary":"Both fixes hold: merge preserves authored continuity via ?? fallback + readThinContinuityRecord; spec-folder regex now matches dots and strips file components. Both test-guarded, fail-safe.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/continuity/authored-continuity-snapshot.ts",".opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts",".opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts",".opencode/skills/system-spec-kit/mcp_server/tests/openltm-continuity-resilience.vitest.ts",".opencode/skills/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts"],"findings":[]}
```
