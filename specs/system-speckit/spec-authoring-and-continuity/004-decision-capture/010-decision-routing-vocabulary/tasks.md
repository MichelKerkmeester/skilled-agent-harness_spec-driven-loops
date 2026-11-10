---
title: "Tasks: Phase 10: decision-routing-vocabulary"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "decision routing vocabulary tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: decision-routing-vocabulary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`$SK` is `.skilled/skills/system-spec-kit`. `$ADV` is `node .skilled/bin/skill-advisor.cjs`. `$F` is the `jq` projection defined in `spec.md` Measured Behavior. Every probe line reads `$ADV advisor_recommend --json '{"prompt":"<prompt>"}' --format json | jq -c "$F"`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 008 is Complete before any edit (`../008-project-scoped-state/acceptance-criteria.md`). Verify: `rg -n 'Closeable:\*\* Yes' ../008-project-scoped-state/acceptance-criteria.md` prints one line. Evidence: 2026-11-03, one line, `90:**Closeable:** Yes`.
- [x] T002 Bring the advisor live and record the pre-change control (`implementation-summary.md`). Run `$ADV advisor_rebuild --trusted --force true --format json`, then the six probes from `spec.md` Measured Behavior. Verify: `$ADV advisor_status --workspace-root "$PWD" --format json | jq -r .data.trustState.state` prints `live`, and all six probe lines show `"freshness":"live"`. Evidence: `advisor_rebuild` returned `{"status":"ok","rebuilt":true}` and `advisor_status` printed `live`. Seven live control lines are in `implementation-summary.md` Verification: both decision prompts returned no recommendation, and the four collision prompts plus the edge case returned the lists recorded there.
- [x] T003 Record the check baselines on the live index (`implementation-summary.md`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --skill system-spec-kit | rg '^FAIL|^PASS|^RESULT'` prints a row with `probe-error=  0`, and `sk-skill-check.cjs check system-spec-kit` prints C7 with 21 and 21. Evidence, with a deviation: `sk-skill-check.cjs check system-spec-kit` printed C7 with 21 and 21 before the edit. The reach check baseline was not taken on a live index before the edit, so no pre-change reach row exists; the only pre-change reach run is the stale one in Measured Behavior (39 probe errors).
- [x] T004 Confirm no other skill's metadata is modified, so the graph export carries only this change. Verify: `git status --short .skilled/skills/*/graph-metadata.json` prints nothing. Evidence, with a deviation: the check did not print nothing. `.skilled/skills/sk-doc/graph-metadata.json` carries another session's uncommitted sk-doc change with six new signals (playbook scenario, playbook conversation, multi-turn conversation script, manual test scenario, json conversation, conversation runner). The export in T009 therefore carries those six too, and the commit that lands this child must stage only the system-spec-kit part of `skill-graph.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add "as a decision", "decision record", "operator decision" and "record my answer" to `intent_signals` (`$SK/graph-metadata.json`). Verify: `jq '.intent_signals | length' $SK/graph-metadata.json` prints 35, `jq -r '.intent_signals[]' $SK/graph-metadata.json | rg -cx 'as a decision|decision record|operator decision|record my answer'` prints 4, and `jq -r '.intent_signals[]' $SK/graph-metadata.json | rg -x decision` prints nothing. Evidence: 35, then 4, then nothing (exit 1). Built by `llmgateway/deepseek-v4.1-flash-1017` at max through cli-pi, the parent goal's D6 fallback while `gpt-6-luna` was out of quota.
- [x] T006 Add a DECISION bullet to §2 that names the four phrases and loads `references/memory/save-workflow.md` and `references/validation/decision-format.md` (`$SK/ROUTER.md`). Verify: `rg -n '^- \*\*DECISION\*\*' $SK/ROUTER.md` prints one line naming both references. Evidence: `ROUTER.md:58` is the DECISION bullet naming the four phrases and both references.
- [x] T007 Add `"DECISION": {"weight": 4, "keywords": [...]}` with the four phrases to `INTENT_SIGNALS`, and a `"DECISION"` list with the two references to `RESOURCE_MAP` (`$SK/ROUTER.md`). Verify: `rg -n '"DECISION"' $SK/ROUTER.md` prints two lines, and `sk-skill-check.cjs check system-spec-kit` prints C7 with 22 and 22. Evidence: `ROUTER.md:182` (`INTENT_SIGNALS`, weight 4) and `ROUTER.md:289` (`RESOURCE_MAP`); C7 parsed 22 intent signal groups and 22 resource-map entries.
- [x] T008 Regenerate the Hermes copy (`.hermes/skills/system-spec-kit/ROUTER.md`). Run `node $SK/runtime/cli/hermes/sync-skills-hermes.cjs --check` first. If it reports drift in any skill besides system-spec-kit, stop and ask the orchestrator, because the write mode would rewrite that skill's copy too. Verify: after `node $SK/runtime/cli/hermes/sync-skills-hermes.cjs`, the `--check` run prints `PASS: ... Hermes skill copies in sync`. Evidence: the regenerated Hermes copy changed by six added lines only; `--check` prints `PASS: 65 Hermes skill copies in sync`, exit 0.
- [x] T009 Re-export the skill graph (`.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`). Verify: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json` exits 0, and a `jq -S 'del(.generated_at)'` diff of the file against `git show HEAD:` shows the four phrases added and nothing changed outside system-spec-kit's entry. Evidence: the export exited 0. The scalar-path diff against HEAD shows the four system-spec-kit signals plus the six sk-doc signals from T004's deviation, and nothing else.
- [x] T010 Rebuild the SQLite index (`.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`). Verify: `$ADV advisor_rebuild --trusted --force true --format json` shows `rebuilt: true`, and `advisor_status` prints `live` as in T002. Evidence: `rebuilt: true`; `advisor_status` printed `live`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Probe "Record my chat reply as a decision" and "record this as a decision". Verify: each line lists `system-spec-kit` first with confidence 0.8 or higher, uncertainty 0.35 or lower and `"freshness":"live"`. Evidence: "Record my chat reply as a decision" gives `system-spec-kit` 0.8301, uncertainty 0.12; "record this as a decision" gives `system-spec-kit` 0.8461, uncertainty 0.16; both live.
- [x] T012 Probe "decision tree", "colour decision", "decision branch" and "architecture decision", plus "write an architecture decision record" as the edge case. Verify: the four collision lines show the same ordered skill list as the T002 control, and the edge-case line is recorded in `implementation-summary.md`. Evidence: the four collision lines match the control exactly. The edge case now lists `system-spec-kit` first at 0.9222 ahead of sk-design and sk-doc, recorded in `implementation-summary.md`.
- [x] T013 Run the reach check on the live index. Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --skill system-spec-kit | rg 'as a decision|decision record|operator decision|record my answer'` prints no `wrong-hub`, `outranked` or `probe-error` row. Evidence: the filtered run prints no row for any of the four phrases. The whole check still prints `RESULT: FAILED` for system-spec-kit (declared 43, wrong-hub 10, outranked 1, no-reach 24, probe-error 0, generation 2143), all on older phrases; see Known Limitations.
- [x] T014 Rerun the freshness, doctor, card-sync and leaf-manifest checks. Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none`, `sk-skill-check.cjs check system-spec-kit` prints C6, C7 (22 and 22) and C9 as PASS with `Result: PASS`, `bash $SK/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $SK` prints `leaf-manifest.json OK`. Evidence: freshness exit 0 with `STALE COMPILED: none` and `SIGNAL DRIFT compiled vs disk: none`; sk-skill-check C6 PASS, C7 PASS 22 and 22, C8 INFO fresh, C9 PASS, `Result: PASS`; `CARD SYNC OK`; leaf manifest prints `leaf-manifest.json OK (1fbc9550...)`, exit 0.
- [x] T015 Validate this child. Verify: `bash $SK/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/010-decision-routing-vocabulary --strict` prints RESULT: PASSED. Evidence: `RESULT: PASSED`, Errors 0, Warnings 0, after `repair-derived.cjs --apply` re-derived the graph metadata.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the six probe lines are recorded in `implementation-summary.md`
- [x] Every row of `acceptance-criteria.md` reads Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../research/research.md` §3 and §13, and `../research/synthesis-review.md`
- **Parent goal**: See `../goal.md`, D1 and D6
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task carries `[B]` and the command output that blocks it. A probe line taken on a stale index never counts as evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 8. Evidence: 8.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c YOUR_VALUE_HERE plan.md` prints nothing. Evidence: nothing, exit 1.
- [x] CHK-003 [P1] Dependencies available: `command -v python3 jq node codex` prints four paths. Evidence: python3, jq and node print paths; `codex` resolves as a shell command name rather than a path. The build ran through cli-pi, so codex was not needed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The metadata stays valid JSON: `jq empty $SK/graph-metadata.json` exits 0. Evidence: exit 0.
- [x] CHK-011 [P0] The human and machine projections agree: `rg -c 'as a decision' $SK/ROUTER.md` prints 2, one for the §2 bullet and one for `INTENT_SIGNALS`. Evidence: 2.
- [x] CHK-012 [P1] No bare `decision` keyword: `rg -n '"decision"' $SK/ROUTER.md $SK/graph-metadata.json` prints nothing. Evidence: nothing, exit 1.
- [x] CHK-013 [P1] The DECISION entry follows the router's existing shape: weight 4 as MEMORY uses, and `check-card-sync.sh` still prints `CARD SYNC OK`. Evidence: DECISION and MEMORY both carry weight 4; `CARD SYNC OK`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row of `acceptance-criteria.md` reads Met.
- [x] CHK-021 [P0] The two decision probes meet REQ-003 on a live index. Evidence: 0.8301 and 0.8461, both live, `system-spec-kit` first.
- [x] CHK-022 [P1] Edge case tested: the "write an architecture decision record" probe line is recorded. Evidence: recorded in `implementation-summary.md` Verification.
- [x] CHK-023 [P1] Error scenario understood: a stale advisor makes the reach check print `probe-error` rows and `RESULT: FAILED`, as Measured Behavior shows, and that run is never read as a pass. Evidence: the stale run in Measured Behavior printed 39 probe errors and is not counted; only the live run at generation 2143 is.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: gap 1 missing vocabulary `instance-only`, P2-1 router machine dicts `cross-consumer`, P2-2 citations `instance-only` (fixed in this child's docs), P2-3 collision scan `matrix/evidence`, P2-4 native lane `matrix/evidence`. Evidence: classes as listed.
- [x] CHK-FIX-002 [P0] Same-class producers: the four-phrase `rg` scan over skill metadata and routers in `plan.md` prints nothing. Evidence: the scan in `plan.md` FIX ADDENDUM printed nothing and exited 1 before the edit.
- [x] CHK-FIX-003 [P0] Consumer inventory completed in `plan.md` FIX ADDENDUM. Evidence: `plan.md` FIX ADDENDUM lists every consumer.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction change. Evidence: N/A, routing text only.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: four prompt classes by two index states. Evidence: `plan.md` FIX ADDENDUM names both axes.
- [x] CHK-FIX-006 [P1] Hostile state variant: the probes ran once on a stale index in Measured Behavior, and only live-index lines count toward REQ-003 and REQ-004. Evidence: stale lines stay in Measured Behavior; REQ-003 and REQ-004 cite only live lines.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the commit that lands this child. Evidence: landed in `af931860f8` on 2026-11-03, after the hooks (122 of 122), runtime vitest (52 of 52), Pi (10 of 10) and OpenCode plugin (6 of 6) suites, typecheck and lint all passed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or home paths in changed files: `git diff | rg '^\+.*(/Users/|sk-[A-Za-z0-9]{20})'` prints nothing. Evidence: the diff of the three changed source files prints nothing, exit 1.
- [x] CHK-031 [P0] N/A: no input handling changes. The four phrases are data the scorer already matches on word boundaries. Evidence: N/A.
- [x] CHK-032 [P1] N/A: no auth surface changes. `advisor_rebuild` keeps needing `--trusted`, the maintainer path. Evidence: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same four phrases and the same two references. Evidence: the four phrases and both references appear in all three files.
- [x] CHK-041 [P1] `implementation-summary.md` records the live control and the post-change probe lines. Evidence: both sets of lines are in Verification.
- [x] CHK-042 [P2] The parent `../spec.md` phase map row for 010 reads Complete after close-out. Evidence: the parent row for 010 reads Complete.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp file was written here; probe output sat in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
