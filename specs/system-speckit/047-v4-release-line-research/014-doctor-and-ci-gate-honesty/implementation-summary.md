---
title: "Implementation Summary"
description: "Doctor and CI gates now fail or report honestly: the symlink check exits 1 on drift, agent parity covers all seven trees, the runtime-mirrors route runs it, and CI runs all five sk-git suites and the AGENTS.md manifest check."
trigger_phrases:
  - "doctor and ci gate honesty implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/014-doctor-and-ci-gate-honesty"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-doctor-and-ci-gate-honesty |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five gates that reported green without checking, or after finding drift, now say what they found.

### Phase 14: doctor-and-ci-gate-honesty

`/doctor:symlink check` exits 1 on a broken or foreign link, a missing source, a tracked absolute link or a broken link inside a merged folder, and stays at 0 for install work such as a missing entry. The agent parity verifier covers opencode, claude, codex, cursor, devin, pi and dsh, reports a mirror that is the canonical file as same-file instead of a match, and runs from `/doctor:runtime-mirrors` with a repair line. CI runs all five sk-git suites, and advisory CI runs the AGENTS.md manifest check report-only. The hooks status no longer calls an alias-linked hook SHADOWED, the containment refusal names its remedy, the parent-skill policy line no longer reads as a result, the orphan scan exits 1 when it could not run, and the install guide names `/doctor:git standards`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `DS/symlink-engine.cjs`, `DA/doctor-symlink-check.yaml`, `DA/doctor-symlink-presentation.txt`, `DA/doctor-install-presentation.txt`, symlink playbook | Modified | Drift exit and contracts |
| `.skilled/bin/lib/mirror-sync-verify.cjs`, `.skilled/bin/check-agent-mirror-sync.cjs` | Modified | Seven trees, same-file |
| `DA/doctor-runtime-mirrors.yaml`, `.skilled/commands/doctor/_routes.yaml` | Modified | Body-parity step |
| `.github/workflows/sk-git-script-tests.yml`, `advisory-checks.yml`, `README.md` | Modified | Suites and manifest step |
| `.skilled/scripts/install-git-hooks.sh`, `DS/parent-skill-check.cjs`, `DS/orphan-process-check.cjs`, two mirror checkers, READMEs, `INSTALL-SKILLED.md` | Modified | P2 messages and exits |
| Tests beside each | Modified | One case per behaviour |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first. cli-codex `gpt-6-luna` high-fast made the P1 code changes (symlink exit, parity trees, runtime-mirrors step); DeepSeek V4.1 Flash max (cli-pi) made the CI, P2 and wording changes. Each family reviewed the other's part read-only: DeepSeek returned FAIL with one P1 and four P2 rows on the Luna part, all fixed by one more Luna brief; Luna returned PASS on the DeepSeek part. Every suite was rerun from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Partial merge with only missing children is not drift | It is the normal pre-install state of a project with `.claude/` |
| Manifest CI step report-only | It stays red until the operator's manifest write |
| Defer V63 and V64 | A contract change and an improvement, not defects |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Doctor node tests | Before 1071 pass / 6 fail. After 1081 pass / 6 fail, same six manifest tests |
| sk-git suites | Before and after: worktree-naming 174/0, commit-id-naming 39/0, stamp-branch 24/0, migrate 3/0, git-timeout 1/0 |
| Bin vitest | Before 13 tests in the two changed files by static count (not run). After 64/0 across the bin config |
| `check-agent-mirror-sync.cjs --all` | Before exit 0. After exit 0, 11 agents |
| `route-validate.sh` | Before exit 0, 76 invocations. After exit 0, 77 |
| Cross-family review | DeepSeek FAIL (1 P1, 4 P2) on Luna's part, all fixed; Luna PASS on DeepSeek's part |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **V63: `release-update check --offline` still prints no RESULT line when every unit is unknown.** Its contract is exit 0 whatever the status; changing it is a separate contract decision.
2. **V64: the runtime-mirrors hook battery stays existence-only.** Content drift is now covered by the sync checkers and the body-parity step.
3. **The new CI steps were run locally, not on a GitHub runner.** The reviewer found no runner-specific dependency.
<!-- /ANCHOR:limitations -->

---
