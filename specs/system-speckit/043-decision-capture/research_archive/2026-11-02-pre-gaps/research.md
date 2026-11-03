---
title: "Research: decision capture series review before the follow-ups"
description: "Three-iteration deep research over the decision-capture series: defects in the 001 build, why hand-written table rows stay pending, the shape of children 002 to 006, the 006 contract with the 065 conversation runner, and what the playbook scenarios prove."
trigger_phrases:
  - "decision capture series research"
  - "decision capture follow-up review"
importance_tier: "important"
contextType: "research"
---
# Research: decision capture series review before the follow-ups

<!-- ANCHOR:deep-research-decision-capture-series -->

## 1. Run Provenance

- Workflow: `/deep:research:auto`, single executor, 3 iterations, stop policy `max-iterations`.
- Executor: cli-pi, `llmgateway/deepseek-v4.1-flash-1017`, `--thinking max`, `--offline`, timeout 1800 s.
- Session: `2026-11-01T21:42:07.374Z`, generation 1.
- Iterations: `iterations/iteration-001.md` (newInfoRatio 0.87), `iteration-002.md` (0.95), `iteration-003.md` (0.92). Each passed `verify-iteration.cjs` (narrative, route proof and delta).
- Section 13 lists the findings the orchestrator checked against the cited lines. The rest come from the DeepSeek iterations only.

## 2. Executive Summary

The series is shaped right and needs no new child, no merge and no drop. It does need changes before 002 is built, in three places.

1. **The pending gap is a missing capability, not a bug.** Pending means the session queue minus `consumed.jsonl`, and only a save writes consumed rows, for ids the writer itself produced. The writer reuses an id only from an appendix item, never from a table row, so an answer recorded by hand as a table row in another packet can never leave pending. 002's read-only matcher plus consumed-row CLI targets that cause correctly. It needs four additions: a one-row-one-answer refusal, counted refusals instead of "pending = 0", rebuild-by-rerun after a re-clone, and an orphan-queue scan with a release path.
2. **006 cannot run as written against 065's format.** S12 needs a second project and `SYSTEM_DECISION_CAPTURE_DISABLED=1`, which one `json conversation` block and one runner invocation cannot express. 006 still requires DEVIATION and N/A marks the runner never writes, and 065 has assigned that mapping to 043/006. `checkpoints.tsv` has no producer. S0 sits outside the turn model.
3. **The three playbook scenarios prove less than 001 claims.** The save-writer scenario would pass with `recordConsumedKeys` broken, and no scenario mentions the nudge or pending at all. 006 is the right harness for those properties, and it already carries the nudge sequence and the process-question rule.

Ordering change: author 006's scenario as soon as 065's `001-scenario-contract` lands, before 002 is built. Only the 006 runs wait for 065's runner. 002 to 005 cannot close until 006 re-proves them, so 006 sits on every child's critical path.

## 3. Why Hand-Written Table Rows Stay Pending (traced cause)

1. Pending is queue minus consumed and nothing else [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334].
2. The only producer of a consumed row is the save, which hands the writer's `result.ids` to `recordConsumedKeys` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:743] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:752].
3. The writer reuses an id only through a `<!-- source: -->` key or a normalized question-plus-answer appendix item [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:695] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:604].
4. The writer's own table has no answer column [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:98], so answer matching is possible only against a foreign hand-written table, and nothing parses one.
5. Live state at iteration 1: 35 queued, 2 consumed, 33 pending, nudge cursor 29, one session queue file (DeepSeek-reported, from gitignored state).

## 4. Defects and Weak Spots in the 001 Build

| # | Finding | Evidence | Severity |
|---|---------|----------|----------|
| D1 | The nudge tells the operator to run `/speckit:save --full-auto`, but a save writes only the entries it is handed and returns silently when none exist. The sweep that produces those entries, and 002's matcher, are not named in the nudge. | [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:107] | High |
| D2 | A session's queue is orphaned once its last save does not consume it. No code enumerates the queue directory, and later sweeps read only the later session. | iteration-001 finding 8 | High |
| D3 | `consumed.jsonl` rows hold only key, packet, id and time, never the answer, so a wrong mapping cannot be detected, and nothing releases a row. | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:778] | Medium |
| D4 | The Claude adapter falls back to `process.cwd()`, contradicting the core's file-locality invariant. | [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:54] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:15] | Medium |
| D5 | Appendix parsing accepts column-0 `Question:` labels only, so a bolded or indented hand-written appendix is invisible to the matching path built for hand-written appendices. | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:85] | Medium |
| D6 | A re-save with a new answer replaces the table row but never rewrites the existing appendix item, so the row and the verbatim record can disagree. | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:231] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:258] | Medium |
| D7 | Capture drops unrecognized payload shapes and process-looking questions without a log line, and joins multi-select answers with `", "`. | iteration-001 finding 15 | Low |
| D8 | The parent and 002 describe a Stop hook that "keeps nudging". `takeNudge` reports once per increase in the pending count. The fix is unaffected, but the acceptance wording is wrong. | [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:344] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:360] | Low |
| D9 | This packet's Q003 and Q004 are in its decision record but not in `consumed.jsonl` (the cause is inferred: they were added without the writer). | iteration-001 finding 7 | Low |

## 5. The Playbook Scenarios Against 001's Claims

- All three are single-question and fixture-fed, which is the limitation the parent names [SOURCE: specs/system-speckit/043-decision-capture/spec.md:66].
- The save-writer scenario checks that `consumed.jsonl` exists, never its row count or `pendingRecords`, and its repository check uses `--untracked-files=no` over a gitignored state directory, so it cannot fail on the write it names [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md:67].
- None of the three files contains "nudge" or "pending".
- `sweep-transcript.mjs` runs only as a unit suite, so chat-candidate detection has no CLI evidence [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:51]. Dedupe is shown for the Devin sweep only [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:56].
- The `process.cwd()` fallback (D4) and the UNKNOWN-and-disabled discipline for runtimes without an answer surface have no scenario coverage.

## 6. The 006 Contract With the 065 Runner

Right: 065's REQ-013 anticipates 006's live-test needs item for item [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:183]. The runtime ids match 006's five rows. 006's `mktemp -d` scratch project with a real state directory satisfies the runner guard [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166].

Wrong or missing:

| # | Gap | Evidence | Owner |
|---|-----|----------|-------|
| C1 | S12 cannot share the file or run: one top-level `env` per script, one `--scenario`/`--scratch` per invocation. 006 REQ-001 and AC-001 (13 stages in one file) are unsatisfiable. | [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/spec.md:145] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md:84] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/acceptance-criteria.md:56] | 006 |
| C2 | The runner writes PASS, FAIL or SKIP only. 006 requires DEVIATION and N/A, and 065 says the mapping is 043/006's to make. Only 006's files carry the four marks. | [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:180] [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/spec.md:152] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md:134] | 006 |
| C3 | `checkpoints.tsv` is not in the runner's evidence list, but AC-005 gates on its 13 rows. | [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:179] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/acceptance-criteria.md:60] | 006 |
| C4 | S0 (build the project, record baselines) runs before any turn, so its row is hand-produced. | iteration-002 finding 9 | 006 |
| C5 | S8 and S9 type `/compact` and `/exit` where the format has `action: compact` and `action: restart`. The DEVIATION retry has no runner mechanism, because the first failed turn ends the run. | [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md:80] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md:81] | 006 |
| C6 | 006's own repository check omits `--ignored`, while the runner's snapshot includes it. | iteration-002 finding 11 | 006 |
| C7 | 006 T001 blocks on all of 065, but authoring needs only `001-scenario-contract`. | [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/tasks.md:38] | 006 |
| C8 | Whether `screen.txt` is written before `check` runs is unstated (inferred, open until the runner exists). | iteration-002 finding 12 | 065 |

## 7. Children 002 to 006

| Child | Verdict | Change |
|-------|---------|--------|
| 002-table-row-matching | Keep, change how | Add: refuse a second, different answer for a row already consumed. Count and report refusals, and make that the handoff criterion instead of "pending = 0". State that rerunning the deterministic matcher rebuilds the mapping after a re-clone. Add an orphan-queue scan and `--release`. Change the nudge text so it names the sweep and the matcher; REQ-009 covers the docs only [SOURCE: specs/system-speckit/043-decision-capture/002-table-row-matching/spec.md:178]. Fix the "keeps nudging" wording (D8). Keep AC-006 [SOURCE: specs/system-speckit/043-decision-capture/002-table-row-matching/acceptance-criteria.md:61], and also give 006 a repeatable check for the same property. |
| 003-codex-and-pi-capture | Keep | Its probe-first approach and its `n/a:` refusal pinned by a test are the series' best pattern. Make that refusal shape the series convention. |
| 004-opencode-devin-live-capture | Keep, change how | REQ-003's real `session_message` fixture can only come from REQ-001's live probe, and 001's live store yielded 0 records. Make the fixture the probe's artifact, with an UNKNOWN escape under REQ-005. Keep REQ-006's cross-runtime nudge inside 004. |
| 005-chat-question-detection | Keep | Its risk row names the real failure: a reply that moves on writes a decision. Put the negative assertion in the 006 stage it adds. |
| 006-live-conversation-test | Keep, split internally | Make S12 a second scenario file and a second runner invocation. Declare S0's row hand-produced. Derive `checkpoints.tsv` from `result.json`, `actions.jsonl` and each turn's `check.txt`. Map DEVIATION to FAIL with the deviation quoted, and N/A to SKIP. Use runner actions for S8 and S9. Choose one inheritance mechanism, because REQ-011 says siblings add stages while every sibling task adds only a matrix row [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md:147]. Re-sequence its authoring ahead of 002's build. |
| New child | None | The unowned gaps land in 002 (consumed-row semantics) and 006 (harness). |

## 8. What the 006 Scenario Must Assert Beyond the Playbook

a) pending reaches zero after the saves, and `consumed.jsonl` gains exactly one row per answer; b) the per-turn nudge sequence and `<session>.nudge` value (already in 006); c) the process question is captured nowhere (already in 006); d) the adapter writes nothing outside the project when `CLAUDE_PROJECT_DIR` is unset; e) state checks use `--ignored`; f) a real-transcript chat candidate reaches the queue through the sweep CLI, and a non-answering reply writes no row; g) a second, different answer is not consumed under the first answer's id; h) refusals are counted; i) the documented save path, or the matcher, did the consuming.

## 9. Ranked Recommendations

1. Fix 006's two blockers before authoring it: split S12 into its own scenario and run, and map the verdicts (C1, C2). Effort: small. Risk if skipped: 006 cannot pass.
2. Re-sequence: author 006 against `001-scenario-contract` now, and run it when the runner ships (C7).
3. Make 006 own `checkpoints.tsv` derivation and declare S0 manual (C3, C4).
4. Add 002's four items and the nudge-text change (Section 7, D1 to D3).
5. Correct the save-writer scenario: count consumed rows, call `pendingRecords`, and add `--ignored` to its repository check (Section 5).
6. Add the D4 `process.cwd()` guard or a test, and the D5 and D6 hardening, as small 002 tasks, or record them as accepted risk.
7. 004: tie the fixture to the probe, with an UNKNOWN escape.
8. 005: put the negative assertion in its 006 stage.

## 10. Eliminated Alternatives

- Pending computed from decision records: ruled out, because `pendingRecords` never opens one.
- A global, all-session sweep that already shows everything: ruled out, because no code enumerates the queue directory.
- Routing a save at the foreign packet: rejected by 002 itself, because it would rewrite the foreign table into the writer's five-column shape.
- Putting S12 in the same `json conversation` block: closed by the format's single `env` and the single-block rule.
- Making 065 emit per-stage rows: the stage table is 006's private data shape.
- A seventh child for the cross-runtime nudge or for the unowned gaps: no independent artifact justifies one.
- The four-mark vocabulary spreading across 002 to 005: refuted, because only 006 carries it.

## 11. Divergence Map

No divergent pivots ran (`convergenceMode` default, `stopPolicy` max-iterations). No saturated directions or audited overrides were recorded. The remaining frontier is the open questions in Section 12.

## 12. Open Questions

- Does the 065 runner write `screen.txt` before `check` runs? This decides whether nudge-line assertions can read the pane (C8).
- Does 002's answer-equality rule already refuse a second, different answer to one row by construction? Iteration 3 says probably yes; a fixture test would settle it.
- Should D4 to D7 be fixed, or recorded as accepted risk? That is the operator's call.

## 13. Verification Addendum (orchestrator, post-synthesis)

Checked against the cited lines by the orchestrating session: Section 3 items 1 to 4; D1, D3, D4, D5, D8; Section 5 bullets 2 to 4 (two `grep -ci nudge|pending` counts of 0 across the three scenario files, and the line 67 command); C1, C2 (065 spec.md:152 assigns the mapping to 043/006, and `grep DEVIATION` across the child acceptance files hits only 006), C3, C5, C7; 006 REQ-011's add-stages clause; 002 REQ-009 and AC-006.

From the DeepSeek iterations only, not rechecked: the live-state counts (35, 2, 33, 29), D2, D6's appendix-never-rewritten behaviour, D7, D9, C4, C6, C8, the 004 and 005 points in Section 7, and every judgment-level verdict.

One correction to the iterations: iteration 1 says "nothing invokes the matcher". 002 already plans the save-doc guidance in REQ-009, so the remaining gap is the nudge text only.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: the 001 build and the table-row pending trace (0.87); run 2: the 006/065 runner contract (0.95); run 3: the child series shape and the playbook scenarios (0.92)
- Convergence threshold: 0.05 (telemetry only under the max-iterations stop policy; the graph decision stayed STOP_BLOCKED on `source_diversity_guard`)
- Divergence summary: no divergent pivots recorded

## 15. References

- Iteration narratives: `research/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`
- Deltas: `research/deltas/iter-001.jsonl` to `iter-003.jsonl`
- Resource map: `research/resource-map.md`

<!-- /ANCHOR:deep-research-decision-capture-series -->
