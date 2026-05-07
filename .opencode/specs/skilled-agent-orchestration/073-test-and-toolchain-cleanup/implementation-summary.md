---
title: "Implementation Summary: 073 Test + Toolchain Cleanup"
description: "3 toolchain fixes shipped: run-matrix.sh codex/opencode token extractors + opencode 180s timeout; post-save reviewer EISDIR guard. 1 fix (test-alignment-validator ESM) deferred to 074 candidate due to import.meta blocker."
trigger_phrases: ["073 summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/073-test-and-toolchain-cleanup"
    last_updated_at: "2026-05-05T17:20:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "073 final: 3 fixes shipped, 1 deferred"
    next_safe_action: "(packet final after commit + push)"
    blockers: []
    key_files: [.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "073-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 073-test-and-toolchain-cleanup |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Predecessor** | telemetry-schema fix (commit f3338bd59) + 072 (commit aede7ae7b) |
| **Status** | 3 fixes shipped, 1 deferred to 074 candidate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Future router-stress runs (071-style 45-cell matrices) will produce correct per-CLI token counts in deltas without needing Phase 3 re-extraction; future memory-save calls on phase-parent spec folders will log a clean SKIPPED message instead of throwing `EISDIR`. Three mechanical fixes shipped: (1) run-matrix.sh codex token extractor now uses `awk '/tokens used/ {getline; gsub(/[^0-9]/,""); ...}'` and correctly recovers values like 35713 from the 2-line codex stdout pattern (was returning 0); (2) run-matrix.sh opencode token extractor now filters JSONL via `grep -E '^\{'` first then `jq -r 'select(.type=="step_finish") | .part.tokens.total'` then sums via `awk` (returns 40810 on the SD-001 sample, was returning "(json-parse-failed)"); (3) all three CLI timeouts in run-matrix.sh raised from 120s to 180s (opencode regularly hit the 120s cap on 071's matrix). Plus (4) post-save-review.ts has a new directory + missing-file guard before `fs.readFileSync(savedFilePath)` — phase-parent workflows pass the spec folder root as `savedFilePath`, which used to throw EISDIR; now returns SKIPPED with a clear `skipReason`. dist/core/post-save-review.js rebuilt via `tsc --build`.

Fix #1 (test-alignment-validator.js ESM bug) is deferred to a 074 candidate. Initial attempt at the simple `.cjs` rename surfaced a deeper blocker: the validator source uses `import.meta.url` (line 19), an ESM-only feature TypeScript can't transpile to CommonJS. Proper fix requires migrating the test to true ESM (replace `require()` with `import` statements, replace `Module._compile` with dynamic `import()` of a temp `.mjs` file). Estimated 30-60 min of focused refactoring; tracked as 074 candidate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `071/002-matrix-execute/scripts/run-matrix.sh` | Modified | codex awk extractor + opencode JSONL extractor + 3× timeout 120→180 |
| `.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts` | Modified | Directory + missing-file guard before fs.readFileSync |
| `.opencode/skills/system-spec-kit/scripts/dist/core/post-save-review.js` | Regenerated | tsc --build |
| `073/{spec,plan,tasks,implementation-summary}.md` | Created | Packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct Edit-tool fixes. For run-matrix.sh: `sed -i ''` for the 3× timeout substitution; `Edit` tool for the more nuanced regex/jq replacements (sed escape rules made multi-line awk/jq patterns brittle). Each extractor verified against real 071 logs before declaring done. For post-save-review.ts: `Edit` tool to insert the guard block before `fs.readFileSync`; `cd scripts/ && npm run build` to regenerate dist/. Smoke-tested via `generate-context.js` on packet 068 (a phase parent) — confirmed SKIPPED status with clear skipReason instead of REVIEWER_ERROR throw.

Fix #1 took the most investigation time (~10 min) before deferring. The .cjs rename worked at the wrapper level (no more `require is not defined`), but the dynamic-load path fails because TypeScript transpileModule with ModuleKind.CommonJS still emits `import.meta.url` in the output (TS doesn't have a CJS equivalent). Decision: revert the .cjs rename (kept original .js) and document the deeper refactor as a separate packet candidate. The validator itself works fine — only the unit test file needs migration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Defer Fix #1 to 074 candidate | Required scope (full ESM migration of test) exceeds 073's "quick cleanup" theme; better to land 3 verified fixes now than block on 1 bigger one |
| Use awk for codex extractor (not grep-based) | grep -oE doesn't handle multi-line patterns cleanly; awk getline is purpose-built for next-line capture |
| Filter JSONL with grep before jq | jq exits early on first non-JSON line in a stream; grep `^\{` ensures only valid JSON lines reach jq |
| Raise timeout uniformly to 180s (not just opencode) | Consistency; codex/copilot rarely need >120s but the headroom is harmless |
| Add SKIPPED guard (not auto-resolve to a specific file) | Reviewer doesn't know which file was just saved when given a directory path; SKIPPED is honest. A future packet could resolve the canonical save target if needed |
| Rebuild dist/ via tsc immediately | Without rebuild, runtime still uses the broken dist/ JS — the fix would be invisible until next build |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| codex extractor on SD-001/codex.log returns 35713 | PASS |
| opencode extractor on SD-001/opencode.log returns 40810 | PASS |
| `grep -c 'timeout 180' run-matrix.sh` >= 3 | PASS |
| `grep -c 'isDirectory' dist/core/post-save-review.js` >= 1 | PASS |
| generate-context.js on 068 logs SKIPPED (no EISDIR throw) | PASS — `POST-SAVE QUALITY REVIEW -- SKIPPED` with skipReason `'savedFilePath is a directory'` |
| tsc --build exits 0 (no cascading errors) | PASS |
| Branch | main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fix #1 deferred** — test-alignment-validator.js still throws on direct `node` invocation. Doesn't block production runtime (the validator itself works). Tracked as 074 candidate.

2. **post-save reviewer SKIP, not RESOLVE** — when given a directory path, the reviewer cleanly skips rather than resolving to a canonical doc. A more sophisticated fix would inspect the directory for `spec.md` / `implementation-summary.md` and review one of them. Out of scope for 073 (cleanup, not feature).

3. **Token extractor accuracy unverified for failure cases** — extractors verified on a successful cell (SD-001). Edge cases (timeout, non-zero exit, partial output) may produce 0 or empty tokens. Acceptable: deltas record what they can, raw logs are source-of-truth.

4. **No regression test added** — the fixes are verified by manual smoke test, not encoded in vitest. Future-proofing would add a regression test for the directory-guard path. Out of scope here; could fold into 074.
<!-- /ANCHOR:limitations -->
