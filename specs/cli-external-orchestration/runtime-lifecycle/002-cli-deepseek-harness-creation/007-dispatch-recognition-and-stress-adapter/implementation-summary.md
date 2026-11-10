---
title: "Implementation Summary"
description: "Phase 7 added dsh task recognition, twelve hard-rule checks and a shim-backed stress subject. Acceptance criteria pass. Task-level baseline and test-order checks remain open."
trigger_phrases:
  - "dispatch recognition and stress adapter implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/007-dispatch-recognition-and-stress-adapter"
    last_updated_at: "2026-11-06T08:02:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded strict validation result"
    next_safe_action: "Resolve remaining task-checklist gaps"
    blockers: ["Baseline counts incomplete", "Test-first order unproven"]
    key_files: ["evidence/dispatch-audit-after.txt", "evidence/rule-checks-after.txt", "evidence/stress-dsh-pi-hermes-verbose.txt", "evidence/sibling-diff.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-007-dispatch-recognition-and-stress-adapter"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 007-dispatch-recognition-and-stress-adapter |
| **Status** | In Progress |
| **Completed** | Not complete. The task checklist still has open items |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The dispatch-audit hook recognizes a headless dsh task, including env-wrapped and shell-wrapped forms. Its rule checks cover all twelve ids in `hard-rules.json`. The stress matrix runs dsh through a standalone shim that emits JSON events without starting the real binary.

### Phase 7: dispatch-recognition-and-stress-adapter

Hook paths sit under `.skilled/hooks/dispatch/lib/`. Stress paths sit under `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/`.

| File | Action | Purpose |
|------|--------|---------|
| `dispatch-audit.mjs` | Modify | Matches a headless dsh task through env and shell wrappers. Skips plugin, help, version and dump commands |
| `dispatch-audit.test.mjs` | Modify | Positive and negative dsh cases plus the dsh entry in the shape list |
| `dispatch-rule-checks.mjs` | Modify | Twelve dsh rule checks, each keyed by its `hard-rules.json` id |
| `dispatch-rule-checks.test.mjs` | Modify | Cases for each rule, the expanded-value cases and the pinned-version case |
| `shims/dsh-shim.cjs` | Create | Standalone shim that emits JSON events and sets its exit status on its own |
| `cli-deepseek-harness.vitest.ts` | Create | Registers the shared stress suite for the dsh subject |
| `matrix-manifest.ts` | Modify | Adds the dsh subject to the subject and phase-two lists |
| `fixtures/adapter-fixture.ts` | Modify | Binary, shim, model and reasoning lookups for dsh plus a shim-only live probe |
| `fixtures/adapter-suite.ts` | Modify | dsh argv assertions, a JSON-event scenario test plus denial, error, missing-final and stdin branches |
| `cli-codex.vitest.ts` | Modify | Subject count 8 to 9 and matrix 112 to 126, now listed in spec section 3 |
| `shims/README.md`, `README.md` | Modify | List the shim and the subject. State that dsh coverage uses the shim only |
| `shims/adapter-shim-core.cjs` | Unchanged | Decision D3 keeps the shared core as it is |
| `cli-pi.vitest.ts`, `cli-hermes.vitest.ts` | Unchanged | Confirmed with `git diff --exit-code` against HEAD |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The runs happened in this order. Each output is in `evidence/`.

1. Dependencies: `ls` on `hard-rules.json` and `rg` on `buildDshLineageCommand` (`evidence/dependencies-landed.txt`).
2. Rule checks: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` printed 50 passes and zero failures (`evidence/rule-checks-after.txt`). The older TAP run has the same pass count (`evidence/rule-checks-tap.txt`).
3. Audit: `.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` printed 23 files and 2854 tests passed (`evidence/dispatch-audit-after.txt`). The original `node --test` invocation failed because the file uses Vitest APIs (`evidence/node-test-dispatch-audit.txt`). The spec now names the runner that passes it.
4. Stress directory: `npx vitest run tests/stress/cli-adapter/` from the runtime folder printed 9 files, 169 tests passed and 9 skipped (`evidence/stress-cli-adapter-after.txt`). The nine skips are one live probe per subject.
5. Named suites, verbose: dsh 18 passed and 1 skipped, cli-pi 19 and 1, cli-hermes 17 and 1 (`evidence/stress-dsh-pi-hermes-verbose.txt`).
6. Sibling check: `git diff --exit-code HEAD` exited 0 for cli-pi, cli-hermes and the shared shim core (`evidence/sibling-diff.txt`).
7. Static checks: `node --check` on three files, subject and README greps, the credential grep and the rule-id mapping (`evidence/task-verify-outputs.txt`).

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The dispatch shape skips plugin, help, version and dump commands before it matches a task | Admin commands are not dispatches. Matching them would audit or block commands that run no task. The audit test covers eight negative forms |
| All twelve `hard-rules.json` ids have a check and a test | The sidecar declares twelve ids and the rule-check suite tests the declared-to-implemented mapping (`evidence/rule-checks-after.txt`) |
| `adapter-shim-core.cjs` stays unchanged. dsh gets a standalone shim | The core writes plain text lines. The dsh stream needs JSON event lines and its own exit status. The Pi and Hermes suites depend on the core as it stands |
| The dsh stress subject runs only through the shim | The dsh live probe is marked as shim only. Phase 013 owns the first live run with a provider key |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Rule checks, `node --test` | 50 tests, 50 pass, 0 fail (`evidence/rule-checks-after.txt`) |
| Dispatch audit, Vitest | 23 files, 2854 tests pass (`evidence/dispatch-audit-after.txt`) |
| Original dispatch-audit `node --test` command | Exit 1 because the file uses Vitest APIs (`evidence/node-test-dispatch-audit.txt`). The spec and acceptance row now name Vitest |
| Stress directory, `tests/stress/cli-adapter/` | 9 files, 169 tests pass, 9 skipped (`evidence/stress-cli-adapter-after.txt`) |
| dsh suite, verbose | 18 pass, 1 skipped (its live probe) (`evidence/stress-dsh-pi-hermes-verbose.txt`) |
| cli-pi and cli-hermes suites, verbose | cli-pi 19 pass and 1 skipped. cli-hermes 17 pass and 1 skipped (`evidence/stress-dsh-pi-hermes-verbose.txt`) |
| Sibling files and shared shim core against HEAD | `git diff --exit-code` exit 0 for all three (`evidence/sibling-diff.txt`) |
| `node --check` on the audit, rule checks and shim | Exit 0 for all three (`evidence/task-verify-outputs.txt`) |
| `validate.sh --strict` | `Summary: Errors: 0  Warnings: 0`. `RESULT: PASSED` (`evidence/closeout-validation.txt`) |

Partial pre-edit numbers are in `evidence/part-one-checks.txt`. The rule checks printed 40 passes and 2 failures. The audit file printed 2851 passes and 1 failure. Pi and Hermes pre-edit counts were not recorded, so T002 remains open.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Shim only.** The stress suite proves the adapter against `dsh-shim.cjs`. Phase 013's keyed runs went through `fanout-run.cjs`, not this adapter's live smoke, so the adapter's live leg is still unproven.
2. **Baseline.** Pi and Hermes pre-edit counts were not saved. The acceptance criteria pass, but T002 and CHK-002 remain open.
3. **Stress README.** `tests/stress/cli-adapter/README.md` says dsh uses its shim only and never runs a live binary. It does not say the live smoke waits on a keyed run, so CHK-041 stays open. That README sits outside this closeout's write scope.
4. **Real dsh on PATH.** `dsh` resolves to `/Users/michelkerkmeester/.local/bin/dsh` on this machine. Every fixture copies the shim in first on PATH, but no run recorded that the real binary was never spawned, so CHK-032 stays open.
5. **Test order.** The new dispatch-audit cases pass, but the evidence does not prove they failed before the hook change, so T004 remains open.
6. **Why the status stays In Progress.** T002, T004, CHK-002, CHK-032, CHK-040, CHK-041 and CHK-050 stay open. The spec stays In Progress because the open rows above have no saved evidence in this folder, and a baseline taken before an edit cannot be recaptured afterwards. Each row closes only with a new run. The parent goal's completion criteria are met by phase 013 evidence and the final gate, so these rows do not block the packet goal.
<!-- /ANCHOR:limitations -->

---
