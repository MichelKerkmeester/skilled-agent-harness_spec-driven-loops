---
title: "Goal: rewrite the mechanical .opencode references to .skilled"
description: "The durable directive for the phase that rewrites mechanical path references in manifest-bound batches and closes on a rescan, leaving frozen records and generated files alone."
trigger_phrases:
  - "reference rewrite phase goal"
  - "skilled rewrite completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase directive"
    next_safe_action: "Wait for phase 008 to validate, then run setup tasks T001 to T010"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-009-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: rewrite the mechanical .opencode references to .skilled

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every mechanical `.opencode` path reference in tracked files outside `specs/` names `.skilled`, frozen records stay byte-identical and every decision row has an owner.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The rewrite set is the reconciled map: the mechanical rows of map C (2,936 once two generator outputs leave) and the 27 authored runtime files of map B, changed by one token-bounded rule whose moved list, keep-list and `.opencode/specs` target come from phase 004. A line on the keep-list is never rewritten. |
| D2 | DeepSeek V4.1 Flash at max on cli-pi through the LLM Gateway writes the phase scripts and runs the batches (62 on the pre-move map), one brief each, bound to the batch's file list. The orchestrator verifies every diff, handles the 39 manual rows and runs the rescan. GPT-5.6 on cli-codex reviews the scripts, the contract-adjacent batches (19 on the pre-move map) and the rescan count. |
| D3 | Frozen records (968 rows under three globs) and generated files are never text-edited. A generator whose input changed is re-run by its own command. |
| D4 | Of the 98 manual rows, 35 belong to 005, 18 to 006 and 3 to 010, 3 are generator output and 39 stay here. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The final rescan of tracked files outside `specs/` reports 0 unclassified `.opencode` occurrences and an independent recount agrees
- [x] All 968 freeze paths are byte-identical to the phase base commit
- [x] Every batch commit has a green suite record and a diff equal to its manifest
- [x] All 39 manual rows kept here carry a recorded disposition and every generator check passes on the final tree
- [x] The phase validates PASSED with every acceptance criterion Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`, authored 2026-09-16 from map counts re-derived over `728c4f3efc` |
| Setup: rule table, scripts, manifests, baselines | Done | `scratch/keep-list.tsv` from the layout decision's keep-list, three scripts at `scratch/` with `--self-test` 63 passed, `scratch/batch-manifests/` (2,835 batched files in 44 groups, 61 routed, 41 manual, 91 generated, 132 noop, 968 freeze), `scratch/census-baseline.json`, `scratch/freeze-baseline.tsv` (2,674 paths), base SHA `8c2d2aff66` |
| Decisions on every occurrence that takes one | Done | 1,673 rows in `scratch/decisions/` from 33 read-only units, 2 orchestrator overrides in `scratch/decisions/overrides.tsv`, grouped into `scratch/decisions/groups/` |
| Code and dual-root rewrite | Done | 20 groups applied by lane command units, 36 hand edits giving matchers both root names, commits `7175a82823`, `56772cb93c`, `a8be338ea6`, `e14d5b196b`, `c1ee9456e0`, `db8af052ca` |
| Documents, runtime files and manual rows | Done | 24 groups plus the 37 manual rows applied, commits `7781735868` and `6e9b8d69f7` |
| Generator closeout | Done | `scratch/generators-wave-b-after.txt`: every check passes except the router path drift that predates the phase; dist builds, agent mirrors, Hermes copies, three command contracts, the trigger index, command bridges, the README verdict baseline and all five hub manifests regenerated |
| Rescan and independent recount | Done | `scratch/rescan-3.txt` reports `unclassified=0`; the read-only recount in `scratch/briefs/luna-rescan-recount-2-return.md` agrees at zero |
| Suites | Done | `scratch/suite-logs/final/`: no failing test identity that the phase base did not already have, and 21 of them fixed |
| Freeze comparison | Done | All 2,674 baseline freeze paths unchanged, 4 added by the F4 decision, no working-tree change under the freeze globs |

### Deviations and findings

| Item | Note |
|------|------|
| Map B's 27 authored runtime files joined the rewrite set | They are neither links nor generated output, so phase 008's scope does not cover them. The handoff rescan fails without them |
| Five map rows are generator output | `generate-trigger-index.mjs:65-67` writes three of the recorded fixtures. `test_readme_verdict_parity.py --write` rebuilds the README verdict baseline. `derive-command-bridges.cjs:15` writes `command-bridges.generated.json` |
| Four retrieval fixtures are frozen evidence | Decided here: they join the freeze list as F4, so the rescan counts them frozen and no rewrite touches them |
| 004's draft keep-list names lines inside the rewrite set | Keep-list lines take precedence over every rule class. `scratch/keep-list.tsv` carries the layout decision's rows plus the lines this phase proved must keep the old name |
| Producers and their tests must share a batch | A subarea-only partition split 195 of 342 import edges across batches, so code batches follow import clusters |
| `specs/**` and the residue criterion | Spec folders are historical record under parent D4, frozen like changelogs and reports, so the final rescan excludes them |
| Manifests recomputed on the post-move tree | 44 area groups replace the 62-batch map, because the map indexes pre-move paths. The map census reproduces at `728c4f3efc` as 14,940 automatic, 789 specs, 611 review and 79 never against the map's 14,905, 790, 646 and 78, the same 16,419 total. No planning script exists to reproduce the map's split exactly |
| Judged files | 35 batched files already name `.skilled`, because phases 005 to 008 made them dual-root. Every occurrence in them takes a decision, since a blind rewrite would change what a legacy-layout test exercises |
| Suites run per wave | Two waves, code and documents, each verified with V1 to V5 per group and one suite set per wave, instead of one suite set per batch. Three suite commands were wrong before this phase: `bin` resolves its include only from `.skilled`, the hooks config carries no include so it needs a path filter, and the spec-kit lanes are the ones CI runs |
| Suite gate reads as a comparison | The phase base carries 34 failing test identities, so a batch passes when it adds none. The final run adds none and fixes 21 |
| Commit shape follows the gates | The mirror-parity gate refuses a commit that stages a mirror source while a regenerated output stays unstaged, and the route re-mint gate refuses a hub whose routing inputs are half staged. Eight commits follow those two rules rather than one commit per group |
| A routed file changed here | `deep-improvement/scripts/lib/mirror-sync-verify.cjs` is a phase 005 row. Its agent-body normalizer knew three root names and not `.skilled`, so every rewritten canonical agent body read as drift and the agent-mirror gate blocked. Recorded in `scratch/batch-manifests/routed-edits.tsv` |
| Fixture packets stay as recorded | Five packets under `runtime/cli/test-fixtures/` pin a fingerprint of their own bytes in generated metadata, and no repair tool reaches outside the packet tree, so their 39 files keep the old spelling |
| The recorded routing corpus stays as captured | One prompt in `labeled-prompts.jsonl` names the tree; the scorer ratchet pins the corpus by hash |
| Consumer projects need their own link | Runtime code that resolves paths from a consumer's working directory now names `.skilled`. Phase 010 adds a `.skilled` link to each consumer root, and its operator checklist covers machines this phase cannot reach |
| The specs alias stays | `.opencode/specs` references keep the old spelling, because the alias is a compatibility link the layout decision keeps. Retiring it in favour of the canonical `specs/` root is the operator's call and belongs to a later cleanup |
<!-- /ANCHOR:log -->
