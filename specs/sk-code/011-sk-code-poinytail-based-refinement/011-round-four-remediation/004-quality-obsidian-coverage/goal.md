---
title: "Goal: Phase 4: quality-obsidian-coverage"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/004-quality-obsidian-coverage"
    last_updated_at: "2026-10-10T15:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-004-quality-obsidian-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: quality-obsidian-coverage

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the sk-code-quality mode real Obsidian plugin coverage by mapping Obsidian targets to checklists that sk-code-obsidian already ships, then name sk-code-obsidian in every surface list of its SKILL.md and README.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The Target-Path Checklist Map gains four Obsidian rows, one each for `comment-banner-checklist.md`, `folder-docs-checklist.md`, `db-class-rename-checklist.md` and `fixture-authoring-checklist.md`, the four checklists `sk-code-obsidian` files under `CODE_QUALITY`. Its implementation and verification checklists stay out. |
| D2 | The coverage edits run before the list edits, and the eight surface lists add `sk-code-obsidian` in the same wording they use for the other two surfaces. |
| D3 | The skill moves from 1.1.1.0 to 1.2.0.0, a minor bump, with a compact `changelog/v1.2.0.0.md`. |
| D4 | Only `SKILL.md`, `README.md` and the new changelog change. Hub files, the Hermes copy and the compiled and leaf manifests are not edited by this phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '^| Obsidian plugin ' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints `4`, and `(cd .skilled/skills/sk-code/sk-code-quality && grep -ohE '\.\./sk-code-obsidian/assets/[a-z-]+\.md' SKILL.md README.md | sort -u | xargs ls); echo "exit=$?"` prints the four checklist paths and `exit=0`.
- [ ] `grep -n 'sk-code-webflow' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md | grep -v 'sk-code-obsidian'` prints nothing and exits 1, and `grep -n 'sk-code-webflow' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md | wc -l` prints `8`.
- [ ] `grep -h '^version:' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md .skilled/skills/sk-code/sk-code-quality/changelog/v1.2.0.0.md` prints `version: 1.2.0.0` three times, and `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/changelog/v1.2.0.0.md` prints `VALID` and `Total issues: 0` and exits 0.
- [ ] `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `VALID` and `Total issues: 0` and exits 0 for `.skilled/skills/sk-code/sk-code-quality/SKILL.md` and for `.skilled/skills/sk-code/sk-code-quality/README.md --type readme`, `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs --checks 1a,1b,2,3,4` prints `router-sync: 5/5 checks passed` and exits 0, and `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs` prints a `doc-claims: N/N checks passed` line with equal numbers and exits 0.
- [ ] Before the commit, `git status --porcelain -- .skilled/skills/sk-code/sk-code-quality` prints exactly five lines: ` M` for `README.md`, ` M` for `SKILL.md`, ` M` for the two checklists under `assets/code-quality-checklist/` and `??` for `changelog/v1.2.0.0.md`, all under `.skilled/skills/sk-code/sk-code-quality/`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/004-quality-obsidian-coverage --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Four Obsidian map rows whose checklist paths all exist | Done | `grep -c '^| Obsidian plugin '` prints 4; `xargs ls` lists the four paths, exit=0 |
| Every `sk-code-webflow` line also names `sk-code-obsidian`, eight lines in all | Done | `grep -v` prints nothing, exit=1; `wc -l` prints 8 |
| Version 1.2.0.0 in three files and a valid changelog | Done | three `version: 1.2.0.0` lines; changelog `VALID`, `Total issues: 0`, exit=0 |
| Validators, router sync and doc claims pass | Done | Orchestrator rerun after child 002's anchor fix: SKILL.md and README.md `VALID` 0 issues, exit=0; `router-sync: 5/5 checks passed`, exit=0; `doc-claims: 4/4 checks passed`, exit=0. The verifier's run had printed `3/4` for two webflow anchors child 002 owned |
| Only the planned paths changed | Done | `git status --porcelain -- .skilled/skills/sk-code/sk-code-quality` prints five lines (` M` x4, `??` changelog) |
| Folder validates with `RESULT: PASSED` | Done | `validate.sh --strict` prints `Errors: 0  Warnings: 0` and `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Scope criterion amended by the orchestrator | The planned check also read `.hermes/skills/sk-code-quality`, which the orchestrator's Hermes run modifies after every build, so it could never print exactly three lines then. It now reads the quality packet only and runs before the commit |
| Handoff from child 005 | Six stale link labels in two quality checklists joined this child as T057 to T062 (scratch/dispatch-units-handoff.json), so the scope check now expects five lines and the changelog gains one bullet |
| Verifier finding on the doc-claims criterion | `verify_doc_claims.cjs` fails 3/4 because `sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md` lines 33 and 34 link to emoji heading anchors that no longer exist in the target files, already stale in HEAD and now caught by the stricter checker. The files belong to child 002, no line names `sk-code-quality/`, and the criterion turns green once 002 repairs them |
| Compiled sk-code route | `stale-manifest` in the baseline and now, because siblings changed ROUTER.md, SKILL.md, hub-router.json and mode-registry.json. Orchestrator step |
| Verifier review result | 0 defects found, `scratch/fix-units.json` is `[]` |
| Reviewer finding | One stale path-shaped label in `verification-quick-reference-and-related.md` line 130, fixed by T063 through the fix chain |
| Orchestrator rerun | All six criteria rerun on 2026-10-10 after the fix chains, each as written above |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
