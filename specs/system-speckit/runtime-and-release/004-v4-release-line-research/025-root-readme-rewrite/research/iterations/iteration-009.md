# Iteration 9: Synthesis-state verification after all key questions resolved

## Focus

The dispatch's next-focus line is `[All tracked questions are resolved]`, so no key question is open. The only non-redundant work left is verifying that the packet's *deliverable* state matches its *record* state.

`research.md` is the workflow-owned canonical synthesis and is the first document a README author opens. Iterations 6, 7 and 8 each recorded that they could not write it (the dispatch allowed-write list names only the iteration file and its delta), so the synthesis was last extended in iteration 5. This iteration measures whether that lag exists and how large it is, using the reducer-owned surfaces as the independent reference.

This is a state-consistency measurement, not a re-audit of any key question. No Q1–Q5 content is re-derived.

## Actions Taken

1. Read `deep-research-config.json` (105 lines) and `deep-research-strategy.md` (321 lines) to establish the run's resolved-question state and the §5 stop conditions.
2. Listed `research/` and counted `type:"iteration"` records in the state projection: 8 iterations recorded, `iterations/` holds `iteration-001.md`–`iteration-008.md`, `deltas/` holds `iter-001.jsonl`–`iter-008.jsonl`.
3. Read `research/research.md` in full (172 lines) and extracted its H2 skeleton.
4. Queried the state projection with `jq` for `{iteration, status, focus, newInfoRatio}` on all eight records.
5. Measured the reducer-owned surfaces: `findings-registry.json` key inventory and `{keyQuestions, resolvedQuestions, openQuestions}` counts, plus `deep-research-dashboard.md` STATUS and PROGRESS blocks.
6. Counted numbered findings in `iteration-006.md`, `iteration-007.md` and `iteration-008.md` with `grep -cE '^[0-9]+\. \*\*'`.

## Findings

1. **The canonical synthesis lags the record by three iterations and 26 findings.** `research.md` carries sections through `## 5D. Q5 close-out ... (iteration 5)` and then jumps to `## 5. Open questions` and `## 6. Method notes`; there is no `§5E`, `§5F` or `§5G`. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:122] The three missing iterations carry 10, 11 and 5 numbered findings respectively — 26 in total — against a dashboard-recorded run total of 85 key findings, so **30.6% of the packet's recorded findings have no synthesis section**. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-006.md:1] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-007.md:1] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-008.md:1] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-dashboard.md:47]

2. **The synthesis's own open-questions list contradicts the resolved state, on two of five questions.** `## 5. Open questions` gives Q1, Q2 and Q5 an explicit "answered in iteration N" sentence, but leaves Q3 as the bare requirement "every hook, plugin and extension per runtime, one README subsection each" and Q4 as "claim audit of the current 1,773-line `README.md`", with no status. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:164] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:165] Both are ticked in the strategy's key-questions list and listed again under ANSWERED QUESTIONS. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:36] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:37] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:62] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:63]

3. **The reducer-owned surfaces are current, so the divergence is isolated to one workflow-owned file.** The registry resolves 5 of 5 key questions with 0 open, and the dashboard reports `Iteration: 8 of 20`, eight PROGRESS rows all `complete`, `keyFindings: 85`, `openQuestions: 0`, `resolvedQuestions: 5`. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/findings-registry.json:1] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-dashboard.md:21] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-dashboard.md:33] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-dashboard.md:44] This is the first measurement of the reducer surfaces' state in the run; every earlier iteration read the strategy and the state projection but never the registry's question counts. The consequence is precise: the packet is internally consistent except for `research.md`, so the repair is one file and not a reconciliation pass.

4. **The synthesis's frontmatter version has never moved off `1.0.0.0`.** Eight iterations of progressive synthesis left `version: 1.0.0.0` in place, which corroborates finding 1 from an independent direction: a file that had been maintained would have bumped its version at least once. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:8]

5. **The strategy §5 stop condition is satisfied in the record but not visible in the synthesis, so the run reads as incomplete to anyone auditing it from `research.md`.** The stop conditions require all five key questions answered with file-cited evidence plus the Q3 cross-check against every runtime directory; both hold in the record. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:52] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md:53] A README author reading only `research.md` would conclude that Q3 and Q4 were never investigated, and would re-run work that iterations 6 and 7 already completed with citations. [INFERENCE: derived from findings 1 and 2 plus the strategy stop conditions]

### Which claim is better supported

Findings 2 and 3 are incompatible about the same fact: `research.md` §5 says Q3 and Q4 are open, the registry says 0 questions are open. The registry and the strategy are better supported, and for a specific reason — each is corroborated by the artifact it summarises. The registry's `resolvedQuestions` count is backed by per-question records carrying `resolvedAtIteration` and `resolved: true`, and the strategy's ticks are backed by the iteration files that produced the evidence. `research.md` §5 is backed by nothing: it is the only one of the three with no per-item provenance. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/findings-registry.json:1] Resolution: treat Q3 and Q4 as answered; treat `research.md` §5 as stale prose.

## Questions Answered

None. All five strategy key questions were already answered before this iteration (Q1 in 2–3, Q2 in 4, Q5 in 5, Q4 in 6, Q3 in 7), and this iteration deliberately did not re-derive any of them.

## Questions Remaining

None tracked. The strategy's key-questions list is 5 of 5 ticked and the registry reports `openQuestions: 0`.

One artifact-level gap remains, and it is not a research question: `research.md` needs §5E (Q4 claim audit, iteration 6), §5F (Q3 per-runtime hook map, iteration 7), §5G (the three numeric claims settled in iteration 8) and a rewrite of §5's Q3/Q4 entries. The material for all four exists in the iteration files with citations.

## Next Focus

No research focus remains. The recommended action is a workflow-owner write, not an iteration:

1. Append §5E from `iteration-006.md` — the three P1 claim corrections (six-versus-eight runtime enumeration at `README.md:16`, the `README.md:873` self-dispatch overstatement, the single-version Node requirement at `README.md:164`), the three P2 items, and the two "do not fix this" corrections (the 45-command and 14-skill counts are correct).
2. Append §5F from `iteration-007.md` — the three-adapter-forms model, the verified per-runtime counts (Claude 32, Codex 27, Cursor 25, Devin 29, OpenCode 20, Pi 22, DSH 22, Vibe 18), and the Codex README off-by-one.
3. Append §5G from `iteration-008.md` — 42 validation rules from `validator-registry.json`, 29 chart forms, 27 diagram types, and the rule that the count source is the registry and not the reference doc.
4. Rewrite `research.md` §5 so Q3 and Q4 carry "answered in iteration 7" and "answered in iteration 6" like the other three.

If a further iteration is dispatched instead, the only useful focus would be verifying that write landed, which is a one-call check and does not warrant an iteration.

## SCOPE VIOLATIONS

- **Would-be mutation: append §5E–§5G to `research.md` and rewrite its §5 Q3/Q4 entries.** `progressiveSynthesis` is `true` in config and the agent contract permits `research.md` edits on that basis, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-009.md` and `deltas/iter-009.jsonl`. The dispatch list is the narrower authority, so the edit was not executed. This is the second iteration to hit the same conflict (iteration 8 recorded it first). The material is fully prepared in this narrative's Next Focus section so the workflow owner can apply it without re-research.
