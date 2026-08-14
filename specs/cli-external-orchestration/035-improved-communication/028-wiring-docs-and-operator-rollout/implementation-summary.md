---
title: "Implementation Summary: Phase 028 Wiring Docs and Operator Rollout"
description: "The wired projection now ships an operator story: an enablement guide documents the two opt-in sources and per-runtime setup, a rollout runbook stages enablement behind the capability, privacy and evaluation-gate prerequisites, and a rollback path covers flag disable, OriginalOnlyEmergencyMode, plugin uninstall and stopping the wrappers, all conformed to the sk-doc reference standard."
trigger_phrases:
  - "wiring-docs-and-operator-rollout"
  - "operator enablement guide"
  - "projection rollout runbook"
  - "wired projection rollback"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/028-wiring-docs-and-operator-rollout"
    last_updated_at: "2026-08-14T08:58:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the operator references and closed the phase."
    next_safe_action: "Hand the parent packet its closing-phase handoff for the parent-packet decision."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-028-wiring-docs-rollout-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The enablement sources, precedence and per-machine privacy boundary match the Phase 016 gate."
      - "The per-runtime setup commands match the Phase 019 plugin and the Phase 020 launcher and its five wrapper runtimes."
      - "The doctor and release-gate fields the runbook teaches operators to read match the Phase 005, 007 and 027 surfaces."
      - "Every authored operator doc passes validate_document.py --type reference with zero issues."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 028 Wiring Docs and Operator Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-wiring-docs-and-operator-rollout |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The closing phase turned the wired projection into a safe operator story. Three
operator references now give a fresh operator the single current source of truth
for enablement, rollout and rollback, consuming the seams from Phases 016, 019
and 020 through 025 and the Phase 027 evaluation gate without changing any
runtime, plugin or wrapper behavior.

### Enablement Guide

`docs/enablement.md` documents both opt-in sources from the Phase 016 gate:
`COMMUNICATION_PROJECTION_ENABLED` and the git-ignored `enablement.local.json`
at the package root. It states the precedence rule with the variable winning,
the per-machine privacy boundary, and the prerequisites. It covers installing
the Phase 019 OpenCode plugin and launching each of the five wrapper runtimes
through `bin/cli-output-wrapper.mjs`, and it teaches the enable, launch and
verify loop for every runtime.

### Rollout Runbook

`docs/runbook.md` defines staged enablement in three stages with per-runtime
verification, the capability prerequisites (the compatibility doctor gate) and
the privacy prerequisites (route selection and the canary gate). It teaches the
operator to read the Phase 027 evaluation gate before enabling a runtime: only a
`pass` verdict with `releaseApproved: true`, a `human` evidence class, six
passing runtime smokes, passing privacy canaries and dated unexpired evidence
marks a runtime rollout-ready, and it names the stop condition.

### Rollback Path

`docs/rollback.md` covers all four rollback surfaces: disabling the flag,
`OriginalOnlyEmergencyMode`, uninstalling the plugin, and stopping wrapper use.
It records the no-canonical-change guarantee, the `planRollback` step order, the
`mutatesCanonicalTranscript: false` confirmation, and the per-runtime
independence of each rollback step.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `docs/enablement.md` | Created | Enablement guide: opt-in sources, precedence, privacy boundary and per-runtime setup |
| `docs/runbook.md` | Modified | Rollout runbook: staged enablement, capability and privacy prerequisites, evaluation-gate reading |
| `docs/rollback.md` | Modified | Rollback path: flag disable, `OriginalOnlyEmergencyMode`, plugin uninstall, stopping wrappers |
| `028-wiring-docs-and-operator-rollout/` | Completed | Recorded the Level-2 packet with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each doc was authored against the actual wired seams, never against phase
summaries alone. The enablement names, precedence and file locations were taken
from `src/config/enablement.ts`, the plugin path and kill-switch from
`.opencode/plugins/mk-communication-projection.js`, the launcher usage and
per-runtime launch modes from `bin/cli-output-wrapper.mjs` and the wrapper
registry, and the doctor and release-gate field names from `src/doctor` and
`src/release`. Every command and path was then exercised live through the
launcher before being written into the docs. The docs extend the Phase 014
operator-reference set in the package `docs/` folder and were conformed to the
sk-doc reference standard so `validate_document.py --type reference` passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Author against the wired seams, not phase summaries | Commands and paths must match the actual plugin, wrapper and gate to survive the fresh-operator walkthrough |
| Extend the existing `runbook.md` and `rollback.md` files | The Phase 014 operator-reference set owns the rolling and reversing surfaces, so the closing phase extends those references instead of splitting new files |
| Teach the doctor and release gate as operator-read prerequisites | Enablement is staged behind the capability, privacy and evaluation-gate evidence, matching the Phase 005, 007 and 027 policy |
| Keep every doc HVR-clean and reference-validated | The operator references must pass `validate_document.py --type reference` with zero issues as the conformance gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reference conformance | PASS: `validate_document.py --type reference` reports `Total issues: 0` for `enablement.md`, `runbook.md` and `rollback.md` |
| HVR cleanliness | PASS: zero em-dashes, zero semicolons and zero banned terms across all three docs |
| Launcher smoke | PASS: `bin/cli-output-wrapper.mjs --list` lists all five wrapper runtimes with their launch modes and path identifiers |
| Default-off passthrough | PASS: with no opt-in, the launcher prints `projection disabled; passing through` and emits the byte-exact original with the target exit code |
| Enabled fail-open | PASS: with `COMMUNICATION_PROJECTION_ENABLED=1` and an unparseable stream, the launcher reports `stream not projectable` and passes the bytes through |
| Local override opt-in | PASS: with the env var unset and a temporary `enablement.local.json` holding `{ "enabled": true }`, the launcher takes the enabled path; removing the file restores default-off |
| Unknown runtime | PASS: `bin/cli-output-wrapper.mjs nosuch -- ...` exits with the documented `69` protocol code |
| Doc-source alignment | PASS: plugin path, test path, flag names, wrapper entrypoints and gate field names diff clean against the Phase 016, 019 through 025 and 027 receipts |
| Scoped diff | PASS: `git status` shows only the three operator docs and the 028 phase folder changed |
| Phase 028 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings from the final state |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live projection render stays manual.** Whether a projected assistant message
   renders visibly in a live session still depends on the runtime and provider
   path, so the docs keep the verify step explicit and the byte-exact original
   as the guaranteed fallback.

2. **Wrapper projection config is caller-supplied.** The launcher captures and
   parses but passes the assistant message through byte-exactly at the embedding
   boundary, so an operator who wants a rendered projection wires the context,
   provider and policy config, exactly as the docs' prerequisites describe.

3. **The docs consume the Phase 027 gate.** The evaluation-gate reading rule is
   accurate against the `evaluateReleaseReadiness` surface that shipped before
   this phase; any later change to that surface is caught by the reference
   validator and the operator-reference set.

### Post-Land Continuation

After this phase lands:

1. Hand the parent packet its closing-phase evidence for the parent-packet
   decision.
2. Keep the three operator references current with any later seam change.
3. Rerun `validate_document.py --type reference` whenever the operator docs are
   edited.
<!-- /ANCHOR:limitations -->
