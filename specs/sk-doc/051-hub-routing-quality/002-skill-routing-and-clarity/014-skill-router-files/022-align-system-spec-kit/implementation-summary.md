---
title: "Implementation Summary"
description: "An operator-local alignment check over system-spec-kit after the router move fixed 26 upheld findings and one router prose item, so the docs, playbooks and measurement scripts read ROUTER.md where the router now lives, and left routing unchanged."
trigger_phrases:
  - "align system spec kit implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/022-align-system-spec-kit"
    last_updated_at: "2026-10-29T22:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the system-spec-kit alignment check, its fixes and its recheck"
    next_safe_action: "Operator commits; pre-commit gates regenerate derived files"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/ROUTER.md"
      - ".skilled/skills/system-spec-kit/README.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts"
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
| **Spec Folder** | 022-align-system-spec-kit |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The system-spec-kit docs and scripts now look for the machine router in ROUTER.md. Twenty-six upheld findings and one router prose item are fixed, and none of them changed what any skill routes to.

### Phase 22: align-system-spec-kit

You can follow any system-spec-kit doc that mentions the router and land in ROUTER.md. README.md, ARCHITECTURE.md, the shared smart-router reference, the rename pattern, the Hermes README and the two authoring-card playbooks all name it. The scripts read it too. The card sync guard reports a missing router once and still runs every check. The smart-router analyzer and measurement harness count and parse ROUTER.md, with SKILL.md as the fallback. The Hermes sync drops a router copy when its source goes away, and it refuses a skill name that would write outside the mirror.

Four of the ten probes missed system-spec-kit. They are advisor vocabulary gaps, and together with D-04 and D-05 they are carried to the routing follow-up in the parent spec.

### Files Changed

Paths are relative to the repository root. `S` is `.skilled/skills/system-spec-kit/`.

| File | Action | Purpose |
|------|--------|---------|
| `S/README.md` | Modified | The package tree, Key Files and Related Documents name ROUTER.md, the SKILL.md row is narrowed to gates and validation, and the routing-rules wording is gone (C1, A-05, A-06, B-03, D-03) |
| `S/ARCHITECTURE.md` | Modified | The SKILL.md line reads as the entry point, and ROUTER.md is added to section 8 (C6) |
| `S/ROUTER.md` | Modified | The spec-script exit-code note points at the taxonomy in `references/cli/daemon-cli-reference.md` section 5 (A-08), and the leaf-manifest command names the full generator path |
| `S/changelog/v2.12.25.0.md` | Modified | The sentence is narrowed to the catalog entry and playbook scenario that shipped (C3) |
| `S/references/cli/shared-smart-router.md` | Modified | The provider dictionary line names the cli-* packet's ROUTER.md, and the MACHINE ROUTER pointer finds the section in each skill's ROUTER.md (A-01, A-02, C2, D-01) |
| `S/references/templates/template-guide.md` | Modified | The pointer links `references/structure/sub-folder-versioning.md` section 3 (C4) |
| `S/references/workflows/rename-pattern.md` | Modified | The pseudocode pointer names ROUTER.md (C5) |
| `S/manual-testing-playbook/template-authoring/authoring-card-router-intents.md` | Modified | The precondition requires ROUTER.md, the file its three awk commands read (A-07, B-02, C7) |
| `S/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md` | Modified | The precondition lists ROUTER.md, the leaf files and the checklist, and the tree run expects eleven `PASS` lines (E-03) |
| `S/runtime/cli/hermes/README.md` | Modified | The sync row names the ROUTER.md copy, its link rewrite and its drop on source removal, and the mirror shape is SKILL.md plus ROUTER.md when the source has one (A-03, A-04) |
| `S/runtime/cli/hermes/sync-skills-hermes.cjs` | Modified | `frontmatterName` throws when the frontmatter name is not one path segment, or is `.` or `..`, since the name becomes a mirror directory and a pruning target (A-11) |
| `S/runtime/cli/observability/smart-router-analyze.ts` | Modified | `isBaselineSkillRead` treats a read of ROUTER.md like SKILL.md, so a baseline run that reads the router is not counted as extra context (E-01) |
| `S/runtime/cli/observability/smart-router-measurement.ts` | Modified | A new `baselineFileBytes` adds SKILL.md and ROUTER.md to the tree and predicted-context byte totals, and `parseRouterModel` reads ROUTER.md first and falls back to SKILL.md (E-02, C8, D-02) |
| `S/runtime/cli/spec/check-card-sync.sh` | Modified | A new `router-exists` check fails once on a missing ROUTER.md, and the intent and guide checks then read `/dev/null` so the guard never aborts on an awk error (A-09) |
| `S/runtime/cli/tests/card-sync.vitest.ts` | Modified | A new test deletes ROUTER.md and expects exit 1, `FAIL router-exists: missing ROUTER.md`, `FAIL intent-PLAN`, `FAIL guide-on-demand-only` and `CARD SYNC FAILED` |
| `S/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modified | The test deletes the source ROUTER.md, then asserts the copy is gone and `--check` prints `PASS: 4` (A-10) |
| `S/runtime/tests/smart-router-analyze.vitest.ts` | Modified | A new test proves a baseline run that reads SKILL.md and ROUTER.md classes as compliant, with no extra record (E-01) |
| `S/runtime/tests/smart-router-measurement.vitest.ts` | Modified | `writeSkill` can write a ROUTER.md, and the fixture moves the machine router out of SKILL.md into it (C8, D-02) |
| This phase's four spec documents | Modified | Record the run, the fixes and the recheck |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scope step resolved 29 system-spec-kit files across 27 first-parent commits from base `6a9946a800`. The battery passed 60 rows with 7 not applicable, and the probes passed 6 of 10. Four DeepSeek V4.1 Flash lanes raised findings, the critic overturned 2, and 33 were upheld. The fix lane applied 26 and marked 3 outside. The router prose pass then fixed the A-08 exit-code note in ROUTER.md. The fix-lane checks passed. The recheck against the worktree read pass 64, cannot run 1, not applicable 7, fail 2, and each non-pass row has a known cause. The fix lane's code changes were then tested by hand, and every test passed. Last, the router-file resolver showed the skill routers parse identically to HEAD.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Change no routing data in this phase | The packet decision is that no skill routes differently, so routing items go to the routing follow-up recorded in the parent spec |
| Fix router prose in a separate pass | The fix lane was barred from the MACHINE ROUTER section, so the A-08 note needed its own pass that left the routing data alone |
| Keep SKILL.md as the router fallback in the measurement harness | A skill that still carries its router inline keeps parsing, so the harness reads the new place without breaking the old one |
| Run the package check by hand | The worktree runtime has no node_modules of its own, so S1 could not run there, and `tsc --noEmit` and eslint covered it instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| First battery, pushed tree | PASS: `{"pass":60,"not_applicable":7}` |
| Probes | FINDINGS: `run-probes: pass=6 fail=4 cannot_run=0`; P05, P07, P08 and P09 are vocabulary gaps carried to the routing follow-up |
| `package_skill.py --check --strict` | PASS: `Result: PASS` |
| `validate_document.py` | PASS: `Total issues: 0` on eight files; ARCHITECTURE.md shows 1 issue, the `document_type_fallback` warning, with exit 0 |
| `check-markdown-links.cjs` | PASS: 0 broken markdown links |
| Fix-lane vitest and node tests | PASS: card-sync, smart-router-analyze and smart-router-measurement `Tests 23 passed (23)`; `sync-skills-hermes.test.mjs` pass 7, fail 0 |
| `tsc --noEmit` and source/dist alignment | PASS: exit 0, and `Source/dist alignment check passed` |
| Recheck battery, worktree | `{"pass":64,"cannot_run":1,"not_applicable":7,"fail":2}`: S1 cannot run (no node_modules in the worktree runtime, run by hand), S7 and S11 derived |
| Hand-run tests on the code changes | PASS: Hermes sync pass 7, fail 0; `check-card-sync.sh` `CARD SYNC OK`, exit 0; card-sync vitest `Tests 11 passed (11)`; smart-router vitest `Tests 12 passed (12)`; `tsc --noEmit` exit 0; eslint on five TypeScript files exit 0 |
| Routing parse | PASS: the skill routers parse identically to HEAD with the router-file resolver |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` with `Warnings: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four probes still miss system-spec-kit.** They need advisor vocabulary, which is routing data, so they wait for the routing follow-up with D-04 and D-05.
2. **Two recheck rows stay red until the commit.** S7-compiled-route-guard and S11-hermes-skills are derived. The pre-commit gates re-mint the activation manifests and regenerate the Hermes copies.
3. **S1-package-check did not run in the worktree.** The worktree runtime has no node_modules of its own. `tsc --noEmit` and eslint on the changed files ran by hand and both exited 0.
<!-- /ANCHOR:limitations -->

---
