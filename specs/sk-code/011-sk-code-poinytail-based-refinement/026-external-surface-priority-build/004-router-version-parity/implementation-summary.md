---
title: "Implementation Summary: Router version parity"
description: "Doctor check 13a no longer compares a hub ROUTER.md version with SKILL.md, one test pins it, the changelog workflow and the versioning standard stop tying ROUTER.md to the release, and six more docs were corrected after a five-iteration review."
trigger_phrases:
  - "router version parity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity"
    last_updated_at: "2026-10-13T07:45:00Z"
    last_updated_by: "builder"
    recent_action: "Built, reviewed and closed the phase"
    next_safe_action: "Operator review and merge of worktrees/128-router-version-parity into main"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs"
    session_dedup:
      fingerprint: "sha256:4bac83119e356ced41fdb6ec50e5ab7746861e8e36132440dc6f331aee9559ac"
      session_id: "build-026-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Router version parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-router-version-parity |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hub `ROUTER.md` now keeps its own version. Doctor check 13a compares only `description.json`, `hub-router.json` and `mode-registry.json` with `SKILL.md`, so a body edit to `ROUTER.md`, whose version the pre-commit gate then raises, leaves the doctor green. A JSON routing file left behind still fails 13a. The global branch of `/create:changelog` no longer writes the release version into `ROUTER.md`, and the versioning standard says what the doctor compares.

The review found six more docs that still called `ROUTER.md` a release copy, one of them the changelog skill's own step 6. All six were corrected and the Hermes copies regenerated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | 13a follower list, its comment and pass line |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | T1 |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml`, `create-changelog-auto.yaml` | Modified | Version-copy list |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modified | Enforcement paragraph, version 1.0.3.0 to 1.0.4.0 by the gate |
| `.skilled/skills/{sk-doc,system-deep-loop,cli-external-orchestration,sk-code}/SKILL.md` | Modified | Version-authority note (review finding RV-1, RV-2) |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | Step 6 version carriers (RV-1) |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` | Modified | Release-bump guidance, version 1.2.0.11 to 1.2.1.0 by the gate (RV-1) |
| `.hermes/skills/*/SKILL.md` (five copies) | Regenerated | `sync-skills-hermes.cjs` |
| Four hubs' `013-live-activation` route manifests (both copies) | Re-minted | The pre-commit route gate, after the hub SKILL.md edits |
| `review/` | Created | Five-iteration review packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Commits on `worktrees/128-router-version-parity`: `9d1168bf3a` doctor check and test, `95698b591b` changelog twins and standard, `695335c9b7` review fixes, then the closeout commit with these docs and the review packet. Every edit outside this folder was made by cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` (Devin's daily quota was out) and checked against its diff.

### Ledger

| ID | State | Proof |
|----|-------|-------|
| VP-1 | Fixed | `grep -c "file: 'ROUTER.md'" .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints 0; the three JSON followers remain |
| VP-2 | Fixed | `node --test --test-name-pattern='ROUTER.md version that differs' .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` exit 0; the `description.json` 13a case still fails the hub |
| VP-3 | Fixed | `cat .skilled/commands/create/assets/create-changelog-confirm.yaml .skilled/commands/create/assets/create-changelog-auto.yaml \| grep -c 'ROUTER.md frontmatter version'` prints 0; the two version-copy blocks diff clean |
| VP-4 | Fixed | `grep 'parent-skill doctor' frontmatter-versioning.md \| grep -c 'ROUTER.md'` prints 0; `validate_document.py` reports 0 issues |

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | a hub ROUTER.md version that differs from SKILL.md is not reported by 13a | before: exit 1 | after: exit 0 |

T1 ran against the unchanged checker first (exit 1, `FAIL: 13a-version: ROUTER.md carries 1.0.0.9 but SKILL.md, the release authority, carries 1.0.0.0`) and after `9d1168bf3a` (exit 0).

### Review

A five-iteration `/deep:review :auto` ran over `455f2a2d8c..95698b591b` on the same executor, with `--no-extensions` added to the cli-pi leaf command because pi refuses to start in this repository without it. It found no P0, two P1 of one class and no P2. Verdict CONDITIONAL, both findings fixed in `695335c9b7`. Artifacts are in `review/`.

| ID | Sev | Disposition | Proof or reason |
|----|-----|-------------|-----------------|
| RV-1 | P1 | Fixed | R1-P1-001, three sk-doc docs still called ROUTER.md a release copy (`sk-create-changelog/SKILL.md:261`, `sk-doc/SKILL.md:17`, `examples-and-maintenance.md:181`): all three corrected; the sweep below finds none left |
| RV-2 | P1 | Fixed | R3-P1-001, the version-authority notes of sk-code, system-deep-loop and cli-external-orchestration made the same claim: corrected, Hermes regenerated, `sync-skills-hermes.cjs --check` reports 68 in sync |

### Same-class inventory

| Site | Outcome |
|------|---------|
| The two YAML twins, `frontmatter-versioning.md` | Corrected in the build |
| Six doc lines in RV-1 and RV-2 | Corrected after the review |
| `sk-doc/sk-create-changelog/changelog/v1.3.4.0.md:24` | Kept: a released changelog entry is history |
| `sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:509` | Kept: the presence and format rule, out of scope |
| `mcp-tooling/SKILL.md:19` | Kept: "hub metadata files" names no Markdown doc |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The 13a pass line now says "all JSON routing files" | "All routing artifacts" would claim a check on ROUTER.md that no longer runs; the six hubs' only changed doctor line is this one |
| The sk-code note also drops `README.md` from the release copies | Fixing only ROUTER.md left a sentence the standard already contradicts; check 13c retired the README comparison |
| No skill release | Goal D5; no changelog entry was added |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Invariants test | 99 of 99 (baseline 98 of 98) |
| `run-all.sh` | 7 suites passed (baseline 7) |
| Six hub doctors | All exit 0 (baseline all exit 0); the only changed line is the 13a pass text |
| `run-all-drift-guards.sh`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs --check`, `ci-skill-root-metadata.cjs` | All exit 0 |
| `/deep:review :auto`, 5 iterations | CONDITIONAL; 0 P0, 2 P1, 0 P2, both fixed. See `review/review-report.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **pi needs `--no-extensions` here.** The review workflow's shared cli-pi builder does not add it, so the leaf command was adjusted in the iteration driver, as in phases 001 to 003.
<!-- /ANCHOR:limitations -->
