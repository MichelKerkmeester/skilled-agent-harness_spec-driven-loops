---
title: "Goal: Phase 1: relocation-engine"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "relocation engine goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-relocation-engine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: relocation-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give system-spec-kit one deterministic command, `relocate.mjs`, that moves, renumbers or re-parents spec packets and leaves every store that records a packet path correct.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `relocate.mjs` writes nothing without `--apply`, and its exit codes are 0 clean, 1 work found and 2 failure, the same as `repair-derived.cjs`. |
| D2 | Every refusal happens in preflight, before the first write. |
| D3 | The engine calls the existing writers for each store. It adds no second writer for `description.json` or `graph-metadata.json`. |
| D4 | Code and CI files are reported and never rewritten. A moved path found there fails the run with exit 2. |
| D5 | Inbound references change only by whole-id substitution from the map. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --map <sample>` on the real tree exits 1 and `git status --porcelain` is unchanged
- [ ] In a throwaway copy, the same map with `--apply` exits 0 and a second `--apply` run exits 0 with nothing to do
- [ ] A map that leaves a track mixed, collides, nests two subtracks, breaks `NNN-slug` or touches a dirty path exits 2 before any write
- [ ] After the apply, `rg -l '<old packet id>' specs` prints nothing in the throwaway copy
- [ ] `repair-derived.cjs` `DOCS` holds nine file names, including `goal.md`, `acceptance-criteria.md`, `resource-map.md` and `decision-record.md`
- [ ] `relocate.mjs --declare-subtrack demo/sub --apply` creates `description.json`, `graph-metadata.json` and `z_archive/.gitkeep` under `specs/demo/sub`
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure absent from the baseline
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
| Planning documents authored | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` in this folder |
| Implementation | Pending | Not started |
| T001 stale pointers measured | Done | frontmatter packet_pointer not equal to folder path, scratch dirs skipped: goal.md 132 of 913 (129 live), acceptance-criteria.md 217 of 878 (186 live), resource-map.md 113 of 135 (66 live) |
| T002 descriptions.json command | Done | Producer is ensureDescriptionCache (folder-discovery.ts:1486, full rebuild) with no CLI or production caller, and the api does not export it. relocate.mjs renames the moved rows by whole-id substitution, the method the Nov regroup commit 26cc92b728 used; full regeneration stays with phase 004 |
| Implementation T004-T022 | Done | relocate.mjs created; DOCS 9 names; helper list +3; archive.sh restore takes next free number via relocate.mjs; ledger created. Real-tree dry run exit 1, status unchanged. Clone: apply exit 0, rerun exit 0 nothing to do. npm test exit 0, counts equal baseline |
| Finding: restore onto same-named folder | Open | spec.md Files to Change says restore calls the engine when the destination exists; archive-track.vitest.ts:983-996 pins a refusal for that case. Engine is called only when a differently named live sibling holds the number (T019, AC-014). Same-name case needs an operator call and a test change in phase 005 |
| Finding: pointer check reads first hit only | Open | check-metadata-disk-consistency-helper.cjs:51-75 returns the first candidate that has a pointer, so the three added names are read only when earlier docs carry none. Checking every doc would flag the live stale pointers measured in T001 |
| Finding: parent_id on flat-track moves | Open | repair-derived.cjs expectedParentId (373-400) returns known:false for a packet directly in a flat track, so a move from a sub-track or another track into a flat track keeps a stale non-null parent_id and the close validation fails. No existing writer settles it |
| Finding: redirect rebuild scope | Open | cite-drift-scan --rebuild-redirects derives from committed git renames, so it cannot see an uncommitted move and rewrites the whole table to current HEAD history (1016+/626- lines in the clone). The ledger is what records the move |
| Decision: restore onto same-named folder | Decided | Operator kept the refusal; spec.md, plan.md and tasks.md T019 now say the engine runs only when a differently named live sibling holds the number |
| Fix: parent_id on moves into a track root | Done | repair-derived.cjs expectedParentId now clears a recorded parent other than the own track. Clone: sub-track to flat and flat to flat moves each RESULT: PASSED with a clean rerun; sample map no regression; npm test equal to baseline |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: description cache command | UNKNOWN which command regenerates `specs/descriptions.json`. No script under `runtime/cli/` writes it. Task T002 resolves it. |
| Plan pointer `track-roots.mjs:356` `classifyTrackShape` | The function is `trackLayout` at line 359. The docs use the real name. |
| Candidate list already holds `decision-record.md` | `check-metadata-disk-consistency-helper.cjs` line 58. Only three names are added there. |
| Ledger file name | The approved plan names no file. These docs use `relocation-ledger.json` beside `cite-drift-redirects.json`. |
<!-- /ANCHOR:log -->
