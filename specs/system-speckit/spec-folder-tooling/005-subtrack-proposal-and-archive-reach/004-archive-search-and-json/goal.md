---
title: "Goal: Phase 4: archive-search-and-json"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "archive search and json goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/004-archive-search-and-json"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-archive-search-and-json"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: archive-search-and-json

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let an operator search and validate archived packets on request at every depth, and make archived JSON metadata correct, without changing any default behavior.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The archive mode is one flag, `--include-archive`, in search and in `validate.sh --recursive`. Without it both behave as before. |
| D2 | The trigger index walker in `retrieval/lib/corpus.mjs` is not changed, and resume keeps excluding archives. |
| D3 | Archived metadata is written only by `repair-derived.cjs` and the description cache producer, never by hand. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A phrase that lives only under `specs/sk-doc/z_archive/` exits 1 in `rg-wrapper.mjs` without the flag and exits 0 with `--include-archive`, with every row labeled `archived`
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0
- [ ] `validate.sh specs/sk-doc --recursive --include-archive` prints a `RESULT:` line for an archived packet, and the same run without the flag prints none for it
- [ ] `repair-derived.cjs --roots <archive>` as a dry run exits 0 for every `z_archive/` under `specs`
- [ ] No row in `specs/descriptions.json` names a folder that is missing on disk
- [ ] `rg -c "nothing re-derives it" .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` prints nothing
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

### Deviations and findings

| Item | Note |
|------|------|
| Open question: description cache command | UNKNOWN which command regenerates `specs/descriptions.json`. Phase 001 task T002 resolves it. REQ-006 waits for it. |
| Counts not re-measured | The approved plan records 35 stale `parent_id` records and 1,334 dead cache rows. Tasks T001 and T002 measure both before the first edit. |
| Findings pointer `folder-discovery.ts:470-486` | The misleading doc comment is at lines 469 to 475. Lines 485 to 487 route through `index-scope.ts`, which keeps `z_archive` on purpose. |
| Findings pointer `corpus.mjs` 190-196 and 325-331 | Those lines hold `isExcludedDirectory` and the walker call. The `z_archive` literals are at lines 62 and 106 only. |
<!-- /ANCHOR:log -->
