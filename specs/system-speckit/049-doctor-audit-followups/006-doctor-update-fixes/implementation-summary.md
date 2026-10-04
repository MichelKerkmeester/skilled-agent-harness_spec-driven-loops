---
title: "Implementation Summary"
description: "All 26 doctor-update research findings are fixed: apply keeps undecided changes, survives interruption, works on copied trees, applies only the approved plan, and every router, workflow and presentation line matches the engine."
trigger_phrases:
  - "doctor update fixes summary"
  - "release-update engine fixes shipped"
  - "doctor update verification evidence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/006-doctor-update-fixes"
    last_updated_at: "2026-10-04T08:00:00Z"
    last_updated_by: "doctor-update-fixes"
    recent_action: "Fixed and verified all 26 doctor-update findings in four phases"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/release-update.cjs"
      - ".skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs"
      - ".skilled/commands/doctor/update.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-update-fixes"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 006-doctor-update-fixes |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:update` now does what the research said it must. An operator's undecided changes are never lost, an interrupted apply no longer strands its lock, a copied or vendored tree can update, and apply writes only the plan the operator approved. Every line of the router, the five workflows and the presentation now matches the engine, and a contract test keeps it that way.

### Doctor-update fixes

The fixes landed in four phases, each committed on its own:

- **Engine integrity (`eb315be211`).** A unit applies only when every changing file has an operator decision, and a prefilled suggestion no longer counts as one. The lock records its owner, a dead owner is reported as stale with the exact recovery, and the new `unlock` subcommand removes only a stale lock.
- **Copied trees (`eaa4b79d26`).** `record-base` saves the framework remote in `base.json`, refuses a release when a nearer one exists unless `--trust-release` is passed, and takes the lock. The engine's own release folder is no longer a unit, a base without a tree fingerprint reads as `recorded-unverified`, and a tracked ignore file keeps run state out of git. A signal held during apply or rollback is re-raised once the lock is released.
- **Approval and recovery (`b4e02411d3`).** The dry-run reports a plan digest that the real apply must match. A bare apply refuses a decided run, a downgrade is reported and skipped, and a dirty release record names its commit. `rollback` and `record-base` are routed actions with approval gates, and the post-apply battery runs every generator the engine names.
- **Contract hygiene (`f67263c396`).** Release renames are linked in the evidence. A new contract test loads the router, the workflows and the presentation, and the documents pass it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modified | Every engine fix above |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modified | 16 new tests, 3 original assertions updated |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Created | Router, workflow and presentation contract, 12 tests |
| `.skilled/commands/doctor/assets/doctor-update-{check,align,apply}.yaml`, `doctor-update-presentation.txt`, `update.md` | Modified | Match the engine |
| `.skilled/commands/doctor/assets/doctor-update-{rollback,record-base}.yaml` | Created | Routed recovery actions |
| `.skilled/commands/doctor/_routes.yaml`, `sk-create-command/assets/command-contract.json`, `.skilled/commands/README.txt`, `README.md`, the scripts and tests READMEs | Modified | Register and describe the actions |
| `.skilled/release/.gitignore` | Created | Ignore run directories and the lock |
| `.skilled/changelog/skilled/README.md` | Modified | Name the untagged `v4.0.0.3` entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fresh Claude Opus 5.5 at xhigh reviewed every finding against the code, settled the open questions and wrote the phased plan. Each phase then ran as two cli-codex `gpt-6-luna` passes at max reasoning on the fast tier: a code pass for the engine and tests, then a markdown pass for the documents. The DeepSeek Flash fallback was never needed. After each phase the parent session reran the engine suite and `run-all.sh`, reviewed the diff, ran the routing and mirror gates, and committed. It also swapped the old engine back in once to watch the Phase B tests fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A prefilled decision is not consent | The align workflow requires an explicit decide per file, and a silent adopt was the loss path |
| Copied and vendored trees are supported | The router and check workflow already address them, and the engine has a copied-tree base path |
| Re-raise a deferred signal after the lock is released | The planned no-op listener kept the lock safe but silently swallowed the operator's Ctrl-C |
| Two passes per phase, code then markdown | The code persona's authoring gate reserves command documents for the markdown agent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` | 72 of 72 pass, exit 0 (56 at the start) |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | 12 of 12 pass, exit 0 |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 8 suites passed, 0 failed, exit 0, node:test over 10 files |
| Fail-first | Every new engine test failed against the engine before its phase, except the DU-22 test, which pins existing behaviour the router now states |
| `verify_alignment_drift.py --fail-on-warn` over the doctor scripts | 0 errors, 0 warnings |
| `route-validate.sh`, compiled route guard, command catalog mirror, the three prompt-sync checks, `validate_document.py` on `update.md` | All exit 0 |
| `generate-command-routers.cjs --check` | Exit 1 on three speckit drifts that predate this phase, no doctor drift |
| Comment hygiene | No finding id, spec path or packet number in the changed code or tests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three speckit router drifts remain.** `generate-command-routers.cjs --check` still fails on `speckit/plan.md`, `implement.md` and `complete.md`. They predate this phase and touch no doctor file.
2. **The engine suite holds 72 tests, not the planned 71.** The extra one proves the signal re-raise, a task added after the diff review of phase A.
<!-- /ANCHOR:limitations -->

---
