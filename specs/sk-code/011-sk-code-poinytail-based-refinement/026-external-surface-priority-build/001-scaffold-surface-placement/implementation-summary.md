---
title: "Implementation Summary: Scaffold surface placement"
description: "The parent-skill scaffold places a new surface after the workflow modes and ahead of the existing surfaces in tieBreak, the two contract references say the same, and its completion report names the canary and commit follow-ups it cannot run."
trigger_phrases:
  - "scaffold surface placement implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement"
    last_updated_at: "2026-10-13T06:40:00Z"
    last_updated_by: "builder"
    recent_action: "Built, proved and reviewed the phase"
    next_safe_action: "Operator merges worktrees/125-surface-placement to main after review"
    blockers: []
    key_files:
      - ".skilled/commands/create/assets/create-skill-parent-confirm.yaml"
      - ".skilled/commands/create/assets/create-skill-parent-auto.yaml"
      - ".skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md"
      - ".skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-026-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Scaffold surface placement

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-scaffold-surface-placement |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
| **Branch** | `worktrees/125-surface-placement`, from origin/main 4b9bf840b0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/create:skill-parent update --surfaces` now writes a new surface mode into `routerPolicy.tieBreak` after the workflow modes and ahead of the existing surface modes, several new surfaces in the order given, and leaves every mode already listed where it is. A surface added this way wins a keyword tie against `sk-code-opencode` instead of losing it. The run's completion report now names the two follow-ups the command cannot run: a canary case with its fixture copy, and a commit with the hooks installed (or a manual refresh and manifest copy).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml`, `create-skill-parent-auto.yaml` | Modified | The rule in the step_4 `hub-router.json` activity on identical lines; two step_6_completion follow-up lines |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modified | Tie-break paragraph states the rule |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modified | Integration checklist row 3 states the rule |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `changelog/v1.5.4.0.md` | Modified, Created | sk-create-skill 1.5.4.0 |
| `.hermes/skills/sk-create-skill/SKILL.md`, the sk-doc activation manifest and its authored twin | Regenerated | Written by `sync-skills-hermes.cjs` and the pre-commit `gate:route-remint` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every edit outside this folder went through DeepSeek V4.1 Flash at `--thinking max` via cli-pi (`llmgateway/deepseek-v4.1-flash`), one literal change per brief, each diff read before commit. Devin answered `resource_exhausted` on its daily quota, so cli-pi was used throughout. In this linked worktree pi needs `-ne`, because the global extension symlink and the worktree's own copy both register `--fast`.

Commits: `17bb342b1c` (build and release), `d500377abc` (review fix and review packet), and the closeout commit that carries this file.

### Ledger

The copy was a full-tree copy under the session scratchpad built by the plan's recipe (`.skilled` without `node_modules`, each `node_modules` symlinked, the 019 archive, `README.md`, `PUBLIC-RELEASE.md`, `.github`, `.opencode` copied with `cp -RP`). Its control run printed doctor exit 0, guard exit 0 and sync `--check` exit 0. DeepSeek ran the auto twin's update workflow for `sk-code-acme` in the copy without being told the position, then followed the two report lines.

| ID | Outcome | Proof |
|----|---------|-------|
| P8-1 | Pass | `A=.skilled/commands/create/assets; R=.skilled/skills/sk-doc/sk-create-skill/references/parent-skill; P='ahead of the existing surface modes'; ... && echo ok` (goal criterion 1) printed `ok` in the worktree; `grep -rlF 'ahead of the existing surface modes' .skilled` lists exactly the four rule sites |
| P8-2 | Pass | `node -e "console.log(JSON.stringify(require('./.skilled/skills/sk-code/hub-router.json').routerPolicy.tieBreak))"` in the copy after the update run printed `["sk-code-quality","sk-code-review","sk-code-acme","sk-code-opencode","sk-code-obsidian","sk-code-webflow"]` |
| P8-3 | Pass | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` in the copy printed `PASS: 5e: routerPolicy.tieBreak covers every registered mode` and `PASS: 5i: tieBreak orders workflow modes before surface/transport modes`; its only failure was `5k-canary: "sk-code-acme": no canary case routes to it` |
| P8-4 | Pass | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "update the typescript config in the acme service"` after refresh and copy-back printed `orderedBundle` with targets `[sk-code-acme, sk-code-opencode]` (policy `aed439d5...`); with `sk-code-acme` moved after `sk-code-webflow` and refreshed, the same prompt printed `[sk-code-opencode, sk-code-acme]` (policy `c6b92b47...`); before the add the prompt routed `sk-code-opencode` alone |
| P8-5 | Pass | `grep -c 'canary-cases.v1.json'` and `grep -c 'install-git-hooks.sh'` on the run's completion report each printed `1`; the report's follow-up section carried both lines with the hub filled in (`001-sk-code`, `--hub sk-code`) |
| P8-6 | Pass | after DeepSeek followed both lines (case `single-acme` added, fixture and manifest copied to their twins, `cmp` silent for both pairs): `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` printed `PASS: 5k-canary` and `all hard invariants passed`, exit 0; `node .skilled/bin/compiled-route-guard.cjs` exit 0; `node .skilled/bin/compiled-route-sync.cjs --check` printed `all 55 served copies match their authored files`, exit 0 |

P8-2 to P8-6 ran on the rule text of `17bb342b1c`. The review fix in `d500377abc` adds only the parenthetical about several new surfaces, which a one-surface run does not read.

### Deep review

`/deep:review :auto`, 5 iterations, cli-pi `deepseek-v4.1-flash` at max reasoning, stop policy `max-iterations`, stop reason `maxIterationsReached`; artifacts and `review-report.md` under `review/`. Verdict PASS with advisories: P0 0, P1 0, P2 2. `verify-iteration.cjs` printed `OK` for all five iterations.

| ID | Severity | Disposition | Proof or reason |
|----|----------|-------------|-----------------|
| RV-1 | P2 | Fixed | R1-P2-001, several new surfaces had no stated order although `spec.md`'s edge case says "in the order given". Fixed in `d500377abc`: `grep -rnF 'several new surfaces in the order given' .skilled \| wc -l` prints 4, one per rule site, and goal criterion 1 still prints ok |
| RV-2 | P2 | Rejected | R4-P2-001, no automated parity test covers the changed twin lines. The spec's file list names no test and C4 forbids a file or option the spec does not name; goal criteria 1 and 2 already compare both twins' rule line byte for byte and check both step_6 blocks. Worth a follow-up that extends `test_skill_parent_router_parity.py` |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The step_6 canary line names the fixture path with `<NNN>-<hub>` rather than the literal `001-sk-code` path in `spec.md` | The scaffold serves every hub; each hub's fixture sits in its own `009-parent-hub-rollout/<NNN>-<hub>/` folder, and a hub with none skips the leg. The literal file name `canary-cases.v1.json` that the goal checks is kept |
| The SKILL.md version was raised by `frontmatter-version.mjs apply`, not typed | It reconciles SKILL.md to its new changelog anchor, which keeps C5's rule that versions are not typed |
| The changelog states the change without the rule phrase | D1 says nothing but the four sites states it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal criteria 1 to 6 | Each printed its expected output from the final state; see `goal.md` log |
| sk-code and sk-doc doctors, `run-all-drift-guards.sh` | exit 0; the wrapper printed `all 4 guards PASSED` |
| `validate_document.py` on both references | 0 issues each |
| Guard and sync `--check` on the worktree | `All hubs fresh or excused`, `all 55 served copies match their authored files` |
| Strict `validate.sh` on this phase | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No parity test for the changed twin lines.** RV-2 was rejected under C4; the twins can drift until a later change extends the parity test.
2. **The copy proof predates the review fix.** P8-2 to P8-6 ran on `17bb342b1c`; the fix adds only the several-surfaces parenthetical.
3. **No phase changelog file.** `spec.md` asks to refresh the matching file in `../changelog/`, and the parent has no `changelog/` folder, so there was nothing to refresh.
<!-- /ANCHOR:limitations -->
