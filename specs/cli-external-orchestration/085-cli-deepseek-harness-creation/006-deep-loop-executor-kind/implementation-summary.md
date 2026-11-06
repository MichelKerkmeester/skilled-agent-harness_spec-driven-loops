---
title: "Implementation Summary"
description: "Phase 6 added the experimental cli-deepseek-harness executor kind, its fan-out builder and tests. The final unit run passes. Quality review and default-table search remain open."
trigger_phrases:
  - "deep loop executor kind implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/006-deep-loop-executor-kind"
    last_updated_at: "2026-11-06T08:02:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded final unit and validation results"
    next_safe_action: "Resolve the remaining verification gaps"
    blockers: ["Quality review open", "Default-table search open"]
    key_files: ["evidence/focused-suites-after.txt", "evidence/full-unit-current.txt", "evidence/task-verify-outputs.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-006-deep-loop-executor-kind"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-deep-loop-executor-kind |
| **Status** | In Progress |
| **Completed** | Not complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The runtime includes an experimental `cli-deepseek-harness` executor kind and a builder that launches a headless dsh lineage with the prompt on stdin and cwd in the lineage directory. The audit drops inherited `DSH_HOME` and provider keys outside the reviewed allowlist. The runner creates a fresh home under system temp and removes it after the lineage.

### Phase 6: deep-loop-executor-kind

The builder passes the prompt on stdin and sets cwd to the lineage directory. It creates and removes a fresh `DSH_HOME` and admits only reviewed environment keys. A run succeeds on exit 0 with a `final` event whose reason is `completed`. Nested `dsh` dispatch is refused.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/deep-loop/executor-config.ts` | Modify | Adds the experimental kind to executor tables and keeps the default kind native |
| `lib/deep-loop/executor-audit.ts` | Modify | Adds the dsh binary, recursion guard, state checks and env filter |
| `scripts/fanout-run.cjs` | Modify | Builds the dsh command, probes the pinned version, owns the temporary home and validates final JSON events |
| `tests/unit/executor-config.vitest.ts` | Modify | Checks kind configuration, flags and defaults |
| `tests/unit/fanout-run.vitest.ts` | Modify | Checks argv, stdin, cwd, timeout, home lifecycle and final events |
| `tests/unit/combo-matrix.vitest.ts` | Modify | Adds dsh matrix cases and exclusions |
| `tests/unit/executor-audit.vitest.ts` | Modify | Checks env filtering and recursion refusal |
| `feature-catalog/fanout/fanout-run.md` | Modify | Documents the experimental builder |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The baseline run records 139 files and 2503 passing tests (`evidence/baseline-unit.txt`). The four named suites passed 356 tests, followed by a full run with 139 files and 2524 tests passed after the latest code mtime (`evidence/focused-suites-after.txt`, `evidence/full-unit-current.txt`). TypeScript and `node --check` passed (`evidence/tsc-noemit.txt`, `evidence/task-verify-outputs.txt`). The saved config grep does not isolate every default table (`evidence/task-verify-outputs.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Admit `LLMGATEWAY_` and `OPENCODE_API_KEY`. Drop inherited `DSH_HOME` and broad `DEEPSEEK_` and `DSH_` prefixes | `DEEPSEEK_API_KEY` reactivates the official DeepSeek route. The runner creates its own temporary `DSH_HOME` for each lineage. |
| No self-presence exemption for `dsh` | dsh delegates in process, so a nested `dsh` is always recursion |
| Keep MCP at `code_mode` in this phase | Phase 010 owns additional MCP routes and live MCP verification (`evidence/task-verify-outputs.txt`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Four named unit suites | 4 files, 356 tests passed (`evidence/focused-suites-after.txt`) |
| Full unit baseline | 139 files, 2503 tests passed, exit 0 (`evidence/baseline-unit.txt`) |
| Earlier full unit run | 139 files, 2520 tests passed, exit 0, before the latest code mtime (`evidence/after-unit.txt`) |
| Latest full unit run | 139 files, 2524 tests passed, exit 0 after the latest code mtime (`evidence/full-unit-current.txt`) |
| TypeScript and syntax checks | `tsc` and `node --check` exit 0 (`evidence/tsc-noemit.txt`, `evidence/task-verify-outputs.txt`) |
| Default-table search | Not verified. The saved global grep includes expected registry and capability entries (`evidence/task-verify-outputs.txt`) |
| `validate.sh --strict` | `Summary: Errors: 0  Warnings: 0`. `RESULT: PASSED` (`evidence/closeout-validation.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Live run lives in phase 013.** The tests here prove the builder and success checks against fixtures only. Phase 013 then ran the kind live: two fan-out lineages completed on the LLM Gateway route. The kind stays experimental while OpenCode Go is unverified.
2. **Default allowlists.** The evidence does not include a search that isolates every default table, so REQ-005 remains open.
3. **Quality review.** No `sk-code-quality` report is recorded for the three runtime files.
4. **Why the status stays In Progress.** T013, T014, CHK-013, CHK-020, CHK-040, CHK-042 and CHK-050 stay open. The spec stays In Progress because the open rows above have no saved evidence in this folder, and a baseline taken before an edit cannot be recaptured afterwards. Each row closes only with a new run. The parent goal's completion criteria are met by phase 013 evidence and the final gate, so these rows do not block the packet goal.
<!-- /ANCHOR:limitations -->

---
