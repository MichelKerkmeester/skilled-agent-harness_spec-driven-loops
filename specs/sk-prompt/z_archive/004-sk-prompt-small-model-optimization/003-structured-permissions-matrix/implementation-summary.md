---
title: "Implementation Summary: cli-opencode permissions-matrix"
description: "Pre-implementation placeholder for Phase B; filled when packet ships."
trigger_phrases:
  - "permissions-matrix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/003-structured-permissions-matrix"
    last_updated_at: "2026-05-18T18:20:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 003 permissions matrix"
    next_safe_action: "Main agent reviews explicit commit handoff paths, then commits"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000012"
      session_id: "114-003-impl-summary-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: cli-opencode permissions-matrix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status**: Implemented with one documented scope deviation: the pre-dispatch integration is exported as a non-invasive helper in `permissions-gate.ts`; no YAML/runtime wrapper file was edited because the user hard rule froze scope to spec.md §3 files plus the test file.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | 114-small-ai-model-optimization/003-structured-permissions-matrix |
| **Level** | 3 |
| **Status** | Implemented with documented hook-scope deviation |
| **Effort** | ~12 hours estimated |
| **Priority** | P0 (RM-8 prevention) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Built

- Created `permissions-matrix.schema.json` as JSON Schema draft-2020-12 with top-level `version`, optional `description`, and flat `rules[]`.
- Created 3 validated matrices: read-only, packet-local, and repo-wide `.opencode`.
- Created `permissions-gate.ts` with `evaluateToolCall()` and `evaluatePreDispatchToolCalls()`.
- Implemented default-deny for malformed/empty matrices, no-match paths, unsupported tools, missing Bash commands, and symlink-resolution failures.
- Implemented cached glob compilation, most-specific-wins resolution, first-in-array tiebreaking, Bash command normalization, `sed -i`/`git rm`/`find -delete` destructive mapping, and symlink resolution with depth cap 10.
- Added Vitest coverage for allow, deny, glob edges, symlink escape, default-deny, first-match tie, depth cap, destructive Bash, and legacy fallback.
- Created `references/permissions-matrix.md` with schema fields, annotated examples, RM-8 walkthrough, migration checklist, and broad-glob warning.
- Updated `cli-opencode/SKILL.md` ALWAYS #13 to make the structured matrix primary when loaded and mark the four-layer prose mitigation as legacy fallback.
- Updated `sk-small-model/references/pattern-index.md` to mark permissions matrix shipped via 003.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Actual sequence

1. Read the Phase 003 spec, plan, tasks, checklist, ADR, RM-8 incident doc, cli-opencode ALWAYS #13, cli-devin structured-permissions analog, post-dispatch validator, and sk-small-model index.
2. Authored the schema and three example matrices.
3. Authored the runtime enforcer and focused Vitest tests.
4. Added the reference doc and narrow SKILL.md / pattern-index edits.
5. Ran schema validation, unit tests, typecheck, RM-8 replay, backward compat simulation, performance benchmark, smell check, and final spec validation.

### Deviations

- `npx ajv` initially failed due a user-level npm cache permission error. Fallback: installed Ajv 8 into `/tmp/ajv-run` and validated with `Ajv2020`; the repo was not modified by dependency install.
- No separate `pre-dispatch-validate.ts` or YAML dispatch wrapper was created. The user hard rule limited edits to spec.md §3 files plus the test file, so the pre-dispatch integration surface is the exported `evaluatePreDispatchToolCalls()` helper in `permissions-gate.ts`.
- T019 full `generate-context.js` memory save was not run because this turn was an implementation handoff with "DO NOT commit", not a `/memory:save` request. Continuity was updated in this implementation-summary frontmatter.
- T020 commit was skipped by explicit instruction. Commit handoff paths are listed in the final report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- ADR-001: Flat rules[] schema with most-specific-wins resolution (Accepted; see decision-record.md)
- Backward compat: matrix is opt-in; absent matrix = fall back to existing four-layer prose
- Default-deny semantics on enforcer error (fail-safe, not fail-open)
- Scope discipline: the hook surface stays non-invasive until a later packet explicitly allows wrapper/YAML edits.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Post-implementation

| Check | Evidence | Result |
| --- | --- | --- |
| Ajv schema validation | `/tmp/ajv-003.log` | PASS: all 3 examples valid with Ajv2020 |
| Unit tests | `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/deep-loop/permissions-gate.vitest.ts` | PASS: 9 tests |
| TypeScript typecheck | `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck -- --pretty false` | PASS |
| RM-8 replay | `/tmp/rm8-replay-003.log` | PASS: blocked 44/44 deletion attempts |
| Backward compat | `/tmp/backward-compat-003.log` | PASS: no matrix returns legacy fallback allowed |
| Performance | `/tmp/perf-003.log` | PASS: 1000 calls, avg 0.028254 ms/call |
| Broad-glob smell check | `/tmp/smell-003.log` | PASS as warning-only smoke check; warnings logged |
| Final strict validate | `/tmp/validate-003.log` | PASS after implementation docs update |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### Current limitations

- No wrapper/YAML hook was edited in this packet due frozen scope. Consumers should call `evaluatePreDispatchToolCalls()` from the pre-dispatch surface in a follow-up wiring change.
- Broad-glob lint is warning-only. The reference doc marks write/edit/delete allow on `**` as a smell; CI enforcement remains future work.
- The RM-8 incident doc records the 44-file damage count and file classes, not a literal 44-path manifest. The replay uses the reconstructed current phase 007/008 file set and recorded classes.
- Matrix authoring tooling is not included; authors copy and edit the three examples.
<!-- /ANCHOR:limitations -->
