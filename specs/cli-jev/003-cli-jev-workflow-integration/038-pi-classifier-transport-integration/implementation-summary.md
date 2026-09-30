---
title: "Implementation Summary: Phase 38: pi-classifier-transport-integration"
description: "Planned stub. Nothing is built yet. This phase will add Pi's native classifier runtime as an opt-in transport for Jev `choice` questions beside the jev CLI, with today's default output byte-identical when the switch is off, and it will document the route for Pi workers. The basis is 037's measured `adopt` verdict, held in `../037-pi-native-classifier-transport/scratch/live-run.stdout.txt`."
trigger_phrases:
  - "pi classifier transport summary"
  - "pi transport integration status"
  - "transport switch status"
  - "caller opt-in status"
  - "pi transport follow-up list"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration"
    last_updated_at: "2026-09-30T16:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Stubbed as Planned, nothing is built"
    next_safe_action: "Build the phase, then rewrite this file with the results"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-038-pi-classifier-transport-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-pi-classifier-transport-integration |
| **Status** | Planned |
| **Completed** | Not yet. This file records the plan, not a result |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This is the Planned stub for a phase whose docs were authored on 2026-09-30 from `scratch/context/context.md`, the operator's "Plan the integration" and 037's `adopt` verdict. The module, the caller opt-in and the docs all remain to be written, and every completion criterion is open.

### Phase 38: pi-classifier-transport-integration

The phase will add `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` (proposed), a shared module that answers a `choice` question through Pi's SDK on `openrouter` `typesafe/jev-1.13` and returns the result shape callers read from the jev CLI's JSON today. The `jev` CLI stays the default, Pi is chosen only by an explicit switch, each gate failure prints one skip line and falls back to the CLI, and only the `choice` callers the design approves inside cli-classifier, sk-doc and sk-communication change. Pi's route exists and works today: `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` holds the helpers that call it, and `../037-pi-native-classifier-transport/scratch/live-run.stdout.txt` holds the measured `adopt` verdict this phase builds on.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Planned create | The opt-in transport module. Proposed name |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Planned create | Every public surface, both backends stubbed. Proposed name |
| `.skilled/skills/cli-classifier/cli-usage/SKILL.md` | Planned modify | The Pi route, the switch and the gate rule |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Planned modify | A short classifier section for Pi workers |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` and `feature-catalog/feature-catalog.md` | Planned create and modify | The catalog entry and its index row. Proposed name |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` and `manual-testing-playbook/manual-testing-playbook.md` | Planned create and modify | The playbook scenario and its index row. Proposed name |
| Design-approved `choice` callers inside cli-classifier, sk-doc and sk-communication | Planned modify | One call site each, only after the design approves it |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | The phase record, authored as Planned |
| `description.json`, `graph-metadata.json` | Derived | Refreshed through `repair-derived.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The plan delivers the module first with both backends stubbed, then the caller opt-in behind a byte-for-byte proof, then the docs through sk-doc and a cross-family review, then the closure gates. DeepSeek V4.1 Flash writes and MiMo v2.6 Pro reviews under parent D5 through this phase's D6, with no Claude worker. The session runs the switch-off comparisons and the closure gates, and a live smoke call waits on the operator's yes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The jev CLI stays the default (D1) | 037 measured Pi only for `choice`, and a default change would move every caller's behavior at once |
| Only `choice` moves (D2) | 037's `adopt` covers `choice` over 111 rows, and `bool` and `score` have no measured basis yet |
| The transport returns the CLI's shape (D3) | An opting-in caller then changes one call and keeps its parsing |
| A gate failure prints one skip line and falls back (D4) | A silent switch would make a Pi failure look like a Pi answer |
| Credentials stay in Pi's own store (D5) | The transport then never touches a key, and runtime trees owned by other packets are not edited |
| DeepSeek writes and MiMo reviews (D6) | Parent D5's roster, with the reverse direction for any MiMo fix and no Claude worker |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No build check has run. This phase is Planned, so the table lists the checks the build will run and their expected results. The rows close when the build's own recordings satisfy them.

| Check | Result |
|-------|--------|
| Each changed caller's switch-off `diff` against its pre-change recording | Pending. Expected empty |
| `node --test` on the transport suite | Pending. Expected 0 failed |
| The key grep of REQ-006 on the module | Pending. Expected exit 1 |
| `git diff --stat` on the three runtime trees | Pending. Expected empty |
| `validate_document.py` on each changed doc | Pending. Expected VALID |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` | Pending at build time |
| `check-goal.cjs` and `goal.cjs packet` | Pending at build time |

### Authoring pass (2026-09-30)

These gates ran on the phase docs only. They prove the record is well formed, not that anything is built.

| Check | Result |
|-------|--------|
| `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --apply` | Exit 0, `inspected=1 repaired=1 failed=0` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --strict` | `RESULT: PASSED`, `Errors: 0  Warnings: 0`, exit 0 |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| `node .skilled/hooks/goal/bin/goal.cjs packet specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --workspace "$PWD"` | `STATUS=OK ACTION=packet`, `packet_durable_chars=2121`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration` | `PASS` with zero placeholder patterns, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** The completion criteria are open, and no caller, test or doc exists yet.
2. **`bool` and `score` stay on the CLI.** 037 measured `choice` only, so `noul` and `score` callers keep the CLI route until each passes its own run under 037's keep rule.
3. **The runtime-tree callers are untouched.** The 13 callers listed in `spec.md` section 3 keep the CLI, and a later phase on the operator's call wires the ones it owns.
4. **No live smoke call is scheduled.** Tests stub both backends, and one live `choice` call runs only on the operator's yes.
<!-- /ANCHOR:limitations -->

---
