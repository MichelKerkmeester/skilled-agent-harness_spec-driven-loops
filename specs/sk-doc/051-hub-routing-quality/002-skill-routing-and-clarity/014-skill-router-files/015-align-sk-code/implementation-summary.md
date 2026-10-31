---
title: "Implementation Summary"
description: "The sk-code docs, playbooks and script comments now point at ROUTER.md wherever the router lives, the drift checker falls back to SKILL.md when ROUTER.md is unreadable, and CI runs its 36 tests. Routing did not change."
trigger_phrases:
  - "align sk code implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/015-align-sk-code"
    last_updated_at: "2026-10-29T21:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the sk-code alignment check and its dispositions"
    next_safe_action: "Let the derived recheck failures re-mint at commit"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py"
      - ".github/workflows/sk-code-script-tests.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0274-packet-router-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-align-sk-code |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now follow any sk-code doc or playbook scenario to the router and land in `ROUTER.md`. The alignment drift checker also falls back to `SKILL.md` when a `ROUTER.md` cannot be read, and CI now runs its tests. Routing did not change: all 54 skill routers parse identically to HEAD.

### Phase 15: align-sk-code

An operator-local alignment check ran over the 71 sk-code files changed since base `6a9946a800`. Four read-only lanes found 27 findings (P0 0, P1 3, P2 24), after a critic overturned 2 more. A DeepSeek fix lane applied 26 FIXED lines. The CI workflow `.github/workflows/sk-code-script-tests.yml` gained a step that runs `test_verify_alignment_drift.py`, which prints 36 tests OK locally with `/usr/bin/python3`.

Items not fixed in the fix lane, with their dispositions:

| Item | Kind | Disposition |
|------|------|-------------|
| E-01 | LEFT | Refuted: accepting a router anywhere would flip ten hubs to router-md; the hub shape is already pinned by a test. |
| A-06 | OUTSIDE | Fixed: sk-code-script-tests.yml now runs the alignment drift checker's Python suite. |

### Files Changed

All paths are under `.skilled/skills/sk-code/` unless they start with `.github/`.

| File | Action | Purpose |
|------|--------|---------|
| `sk-code-skilled/assets/scripts/router-file-resolver.cjs`, `router-replay-lib.cjs` | Modified | Docstring names the heading rule and the hub `none` verdict; comment says ROUTER.md is probed first and wins |
| `sk-code-skilled/assets/scripts/verify_alignment_drift.py` | Modified | An unreadable ROUTER.md falls back to SKILL.md |
| `ROUTER.md`, `README.md`, `shared/README.md`, `shared/references/stack-detection.md`, `sk-code-quality/SKILL.md` | Modified | Section citations and router credits |
| `sk-code-skilled/assets/checklists/skill-authoring.md`, `sk-code-skilled/references/shared/alignment-verification-automation.md`, `sk-code-skilled/assets/scripts/README.md` | Modified | ROUTER.md in the checklist, the reference and the script map |
| `manual-testing-playbook/**`, `sk-code-ci/manual-testing-playbook/**`, `sk-code-quality/manual-testing-playbook/**`, `sk-code-skilled/manual-testing-playbook/**` | Modified | Scenarios cite ROUTER.md and the right section owner |
| `sk-code-quality/README.md`, `sk-code-ci/README.md`, packet changelogs, `sk-code-review/changelog/v1.9.14.0.md` | Modified | ROUTER.md rows; unbacked claims removed |
| `.github/workflows/sk-code-script-tests.yml` | Modified | New step runs `test_verify_alignment_drift.py` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The check resolved the file set and ran the battery (`{"pass":112,"not_applicable":4}`); sk-code has no routing probes. Four DeepSeek V4.1 Flash lanes reviewed code, skill docs, READMEs with changelogs and env, and routing. The critic overturned weak findings and the fix lane applied the rest that did not touch routing. The CI step was added, and the recheck reran the full battery against the worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the resolver's hub rule (E-01) | Accepting a router anywhere would flip ten hubs to `router-md`, and a test already pins the hub shape |
| Run the drift tests in CI | The fallback change needs a gate, and the suite ran in no job before |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check --strict` (hub, sk-code-ci, sk-code-quality, sk-code-review, sk-code-skilled) | PASS each |
| `validate_document.py` (41 changed `.md`) | 0 issues; four keep the pre-existing `document_type_fallback` warning seen at HEAD |
| `check-markdown-links.cjs` | 0 broken markdown links |
| `test_verify_alignment_drift.py` with `/usr/bin/python3` | 36 tests OK |
| Recheck battery | `{"pass":126,"not_applicable":4,"fail":4}` |
| Recheck fail S2-skill-package | Derived: the compiled policy hash in the hub manifest re-mints at commit |
| Recheck fail S3-catalog-package | Fixed after this recheck: the sk-design-diagram catalog leaf and root now share one description, and `validate_catalog_package.py` reports 0 fail |
| Recheck fail S7-compiled-route-guard | Derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate |
| Recheck fail S11-hermes-skills | Derived: the Hermes skill copies regenerate from source before the commit |
| Router-file resolver | PASS: all 54 skill routers parse identically to HEAD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three recheck failures stay until commit.** S2, S7 and S11 are derived files that re-mint or regenerate at commit, so they clear only then.
2. **The drift checker's output changed.** The fixture that gave 0 findings at HEAD now gives 1, from the new SKILL.md fallback. Expect that when you compare an old run with a new one.
<!-- /ANCHOR:limitations -->

---
