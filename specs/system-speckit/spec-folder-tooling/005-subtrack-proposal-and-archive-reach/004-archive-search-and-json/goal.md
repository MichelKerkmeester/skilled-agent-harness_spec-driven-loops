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
| T001 stale parent_id count | Done | Before: 35 of 267 packets directly in a z_archive recorded a non-null parent_id. After the repair pass and the repair-derived.cjs fix: 0 of 267. The dry run exits 0 for all 53 archives |
| T002 dead description rows count | Done | Before: 1334 of 3916 rows in specs/descriptions.json named a folder missing on disk. After the producer run on the real tree: 0 of 5152 rows, 2213 of them under z_archive |
| T003 PHRASE and T004 baseline | Done | PHRASE is skill routing refactor. Default path recipe exit 1 with 0 paths. rg -l -F -i found it in spec.md and timeline.md of specs/sk-doc/z_archive/019-skill-routing-refactor. scratch/baseline.txt: npm test exit 0, 206 files and 2525 tests passed, 0 failed |
| Build: archive search, JSON lane, archive validation and cache hook | Done | DeepSeek V4.1 Flash through the dsh harness on the LLM Gateway route, eight dispatches, one change each. The orchestrator read every diff. Code and reference docs are in commit 05a83a7d88. The four reference docs were edited by a Fable 5.2 documents worker |
| Search verified | Done | Flag off: the vector keeps the z_archive glob, exit 1, no jsonLane and no archived field. Flag on: path recipe exit 0 with 2 paths ending [archived], structured --json 2 rows archived true. JSON lane on the 019 packet id: 308 archived metadata files, 154 graph-metadata.json paths. 44 recipe and parity tests passed |
| Validation verified at track depth | Done | Flag without --recursive: error line and exit 2. specs/sk-doc --recursive --include-archive: 73 RESULT lines including 019-skill-routing-refactor, exit 2 as expected for old archived packets. Without the flag: 25 RESULT lines, none in z_archive, exit 0, identical to the script from before the change |
| Decision: fix repair-derived.cjs | Decided | Operator decision. The first apply left 31 archived packets with their archive as parent, because repairFolder returned before fixRecordedLocation when the report held no derivable rule. The file was not in the phase list. After the fix and apply on those 31 packets, 31 exit 0 |
| Decision: commit the producer rewrites and add the archive.sh hook | Decided | Operator decision. No CLI regenerates specs/descriptions.json. The producer is ensureDescriptionCache, called from the compiled module. Clone: 81 seconds and 5147 per-packet description.json files rewritten. Real tree: 30 seconds. Hook live in a clone: archive exit 0 in 13 seconds, 0 dead rows |
| Full suite | Done | npm test exit 0, 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, 0 failed. Identical to scratch/baseline.txt. npm run build exit 0. No new vitest case, phase 005 owns the suites |
| T020, AC-002 and the trigger index criterion | Open | generate-trigger-index.mjs --check exited 1 during the build because 33 documents of this packet are new since the index was last built, not because of the code of this phase. The orchestrator regenerates and commits the index after these documents are written |
| AC-004 subtrack and phase depth | Open | Only specs/sk-doc, track depth, was run. Needs validate.sh --recursive with and without --include-archive on a subtrack with an archived packet and on a phase parent with an archived phase. CHK-022 is open for the same reason |
| AC-006 restore run | Open | The archive ran live in a clone. No restore was run. restore_spec calls the same refresh_description_cache, read in the diff and not run. Needs one restore in a clone that leaves 0 dead rows |
| Deviation: rows reworded | Done | T006 names the [archived] label. T009 says one level only. T011 names ensureDescriptionCache. CHK-041: only search.md shows a command line. CHK-051: scratch keeps baseline.txt because T004 and T022 cite it |
| Limits and out of scope | Open | Archive validation reads one level only. The hook costs one producer run per move and can rewrite per-packet description.json files. The doc comment on isExcludedFromGeneratedMetadata in index-scope.ts still says z_* staging or archive segment and was left alone |
| spec.md status | Open | Left at Draft, as in phases 001 to 003. Set it when the three open criteria close |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: description cache command | UNKNOWN which command regenerates `specs/descriptions.json`. Phase 001 task T002 resolves it. REQ-006 waits for it. |
| Counts not re-measured | The approved plan records 35 stale `parent_id` records and 1,334 dead cache rows. Tasks T001 and T002 measure both before the first edit. |
| Findings pointer `folder-discovery.ts:470-486` | The misleading doc comment is at lines 469 to 475. Lines 485 to 487 route through `index-scope.ts`, which keeps `z_archive` on purpose. |
| Findings pointer `corpus.mjs` 190-196 and 325-331 | Those lines hold `isExcludedDirectory` and the walker call. The `z_archive` literals are at lines 62 and 106 only. |
<!-- /ANCHOR:log -->
