---
title: "Iteration 5: Synthesis — Ranked Recommendations"
trigger_phrases: []
---
# Iteration 5: Synthesis — Ranked Recommendations

## Focus

Charter angle 5. Rank every recommendation from iterations 1 to 4 by (operator impact × confidence) ÷ cost, group into do now, do next, do not, and cite the file:line that each row changes or defends. Impact, confidence and cost are each scored 1–5; cost is larger when the change needs a decision, a new test harness, or a shape change another surface consumes.

## Method

- Sources: `iterations/iteration-001.md` (F1-H1…F1-H9), `iteration-002.md` (I2-1…I2-5), `iteration-003.md` (U3-1…U3-7), `iteration-004.md` (O4-1…O4-9).
- Overlapping rows are merged before ranking (U3-1 with O4-7; I2-2 with the phase-007 review's F007; O4-1 with F1-H5; U3-7 with F009).
- "Do now" is reserved for small, certain changes: one or two files, no shape change another surface parses, a test that already has a home. "Do next" needs a decision, a new harness, or an injection-shape change. "Do not" is rejected with the caller that defends the current design.

## DO NOW — small, certain

| # | Change | Score (impact×conf÷cost) | Files it touches | Test |
|---|--------|--------------------------|------------------|------|
| 1 | Split the resend reminder by runtime capability: on adapted runtimes the agent renders the slice and repairs the record with `bind` + `resent`; drop "ask the operator to set it". Removes the 4000-character operator paste. | 20 (5×4÷1) | `goal-slice.cjs:137–139`, `opencode-goal.js:2823` | Reminder-text unit test per capability; a fixture asserting a durable edit then bind+resent clears `resendPending` |
| 2 | Align the validator's fence regex with the runtime's tolerant one and pin both against one parity fixture list. | 15 (3×5÷1) | `spec-doc-structure.ts:1028`, `goal-slice.cjs:24` | Fixture with trailing whitespace on each fence; assert equal slices and equal budget count |
| 3 | Report packet truth in `show`: derive `packet_bound` from resolution and add `packet_state=bound\|missing\|unbound` plus a one-line hint when missing. | 15 (3×5÷1) | `bin/goal.cjs:139`, `goal-core.cjs:887–892` | CLI test: bind, delete the document, assert `packet_state=missing` and the hint |
| 4 | Wire the bind into the lifecycle: when the resolved packet has a `goal.md`, the offer's set path calls `bind` (which already writes objective and prompt from the file) instead of `set`. | 12.5 (5×5÷2) | `speckit-plan.yaml:156–186`, `speckit-implement.yaml:118–151`, `speckit-complete.yaml:211–244` | Asset contract test: the set path names bind whenever the packet carries a goal document |
| 5 | Key the packet lock on the packet's realpath so an in-workspace alias and the real path take the same lock. | 12 (3×4÷1) | `goal-core.cjs:894–896` | Two-writer test through alias and real path with an injected delay; both rows survive |
| 6 | Add `log` and `unbind` to the plugin surface and replace the silent unknown-action `show` fallback with a named error. | 10 (4×5÷2) | `opencode-goal.js:168`, `:2943`, `:2951`, `:2960–3024` | Tool test for both actions; negative test asserting an unknown action errors |
| 7 | Archive the prior record on a rebind to a different packet by fixing the identity guard. | 10 (2×5÷1) | `goal-core.cjs:934–937` | Rebinding fixture; `history` shows the archived record |
| 8 | Make the save path's log action the only path on a bound session; keep the hand append for unbound packets. | 10 (2×5÷1) | `save.md:61` | None beyond wording; the guarded path is already tested |
| 9 | Gate the CLI's `injection_preview` behind the option the plugin already uses, and drop the duplicated `last_check`/`verifier_last_verdict` and `usage_source`/`budget_usage_source` lines. | 10 (2×5÷1) | `bin/goal.cjs:137`, `opencode-goal.js:2850`, `:2886–2898` | Envelope snapshot test on both surfaces |
| 10 | Normalize `\r\n?` in both extractors so a CR-only file cannot leak frontmatter. | 8 (2×4÷1) | `goal-slice.cjs:37`, `spec-doc-structure.ts:1027` | CR-only fixture asserting no `session_id` in any slice |
| 11 | Remove the packet projection's unread `content` and `mtimeMs`; the `statSync` throw path goes with them (retires F1-H5). | 8 (2×4÷1) | `goal-slice.cjs:229`, `:236` | Projection-shape test; the deletion is the fix |
| 12 | Remove or render `lastCheckAtMs`; today it is written and normalized and read by nothing. | 4 (1×4÷1) | `opencode-goal.js:1241`, `:1732`, `:2388` | Status envelope test once it is rendered; deletion otherwise |

## DO NEXT — needs a decision, a harness, or a shape change

| # | Change | Score | Decision or work needed | Files |
|---|--------|-------|-------------------------|-------|
| 1 | One canonical workspace resolution shared by core and plugin (live workspace wins, stored workspace only when no live value exists). | 6 (3×4÷2) | Which order is canonical; plugin stops re-deciding (F1-H4 also covers the review's F013). | `goal-core.cjs:889`, `opencode-goal.js:2703` |
| 2 | Render criteria as their own list field instead of flattening them into the objective line. | 6 (3×4÷2) | Injection-shape change; both renderers must move together, and the preview cap must cut at item boundaries. | `goal-core.cjs:273–278`, `:403`; `opencode-goal.js:2722` |
| 3 | Pin the two renderers' shared labels with a parity test and state the intended usage-line differences in one comment each. | 6 (3×4÷2) | Which differences are intended (auto-turn budget versus turn estimate); resolves the review's F014. | `goal-core.cjs:389–448`, `opencode-goal.js:2707–2759` |
| 4 | Compare the three lifecycle assets' `packet_goal` blocks in CI instead of merging them. | 6 (3×4÷2) | Lint placement and failure policy. | `speckit-{plan,implement,complete}.yaml` packet_goal blocks |
| 5 | Make the goal contract documents discoverable: add `.opencode/hooks` to the corpus roots, or accept routing and point the indexed feature catalog at the contract. | 5 (2×5÷2) | Index-growth cost versus doc reach; the phrasings "set the goal", "bind goal", "resend goal" have zero entries today. | `retrieval/lib/corpus.mjs:29`; `README.md:5–11`, `goal-plugin.md:5–10` |
| 6 | Non-UTF8 log appends: refuse with a named error or preserve bytes. | 4 (2×4÷2) | Refusal policy versus byte-level append support. | `goal-core.cjs:1048`, `:1073` |
| 7 | Mirror the runtime's realpath containment in the binding-row check and accept link notation. | 4 (2×4÷2) | Validator behaviour change; keep the `..` fast refusal. | `spec-doc-structure.ts:1065–1070` |
| 8 | Plugin brief cache keys on the slice hash instead of `mtimeMs:size`. | 4 (2×4÷2) | Confirms the review's F004; benign today, so it rides the next plugin change. | `opencode-goal.js:2790` |
| 9 | State the lock's true scope in the docs (workspace state dir, per packet on realpath) and fold the alias fix's contract note in. | 4 (2×4÷1.5) | Doc owner and placement; confirms the review's F006. | `README.md` lock paragraph; `goal-core.cjs:540–583` |
| 10 | Give Claude Code and Codex a resend signal: render the slice when `goal.md`'s mtime is newer than session start, or document prose as the boundary. | 3 (2×3÷2) | Whether a heuristic is honest enough to ship; ADR-005 leaves it open. | `speckit-plan.yaml:183–184` |
| 11 | Fill the cursor/devin reminder's record clause with the exact command the adapter can compose. | 3 (2×3÷2) | Whether the adapter should compose scope flags into a model-directed command line at all. | `goal-slice.cjs:138`; `cursor/goal-inject.mjs:84`, `devin/goal-inject.mjs:70` |
| 12 | Re-verify and close the phase-007 P2 items this lineage did not touch: F008 (set dropping the pointer), F011/F012 (changelog and 009 REQ-010 coherence), F015 (cursor hint). | 3 (2×4÷2.5) | Current state unverified after the phase-007 fixes; F011/F012 fold into the posture/docs row. | `opencode-goal.js:1792`; `CHANGELOG-v4.0.0.0.md:303–305`; `specs/hooks/009-goal-isolation/spec.md:150`; `.cursor/commands/goal-cursor.md:3` |

## DO NOT — rejected, with the caller that defends each

| Item | Reason |
|------|--------|
| Collapse the two-slice projection into one | `objectiveSlice` is stored, budgeted and truncatable by address; `chatSlice` is stripped of anchors and comments for humans. One slice either ships markup into chat or stores prose the runtime cannot budget. (`goal-slice.cjs:67–73`, `:100–112`) |
| Replace the `goalDurableBudget` manifest block with a constant | The runtime resolver, the validator resolver and the validation reference all read the manifest; a constant hardcodes the pair in two implementations that already drifted once. (`goal-slice.cjs:183`, `level-contract-resolver.ts:290`) |
| Stop storing `objective`/`goalPrompt` on bound records | The render fallback after `unbind` and `setGoal`'s refreshed-versus-replaced comparison read them. `unbind` semantics would change with them. (`goal-core.cjs:394–401`, `:1114–1141`) |
| Remove the `legacy-*` actions | Zero records on this checkout, but they are the documented migration path for machines that hold them. (`README.md:62`) |
| Merge the core and plugin renderers | The usage lines differ by design (auto-turn budget versus turn estimate). Merge means porting plugin semantics into the runtime-neutral core for a shared skeleton. (`goal-core.cjs:429`, `opencode-goal.js:2740`) |
| Shorten the reminder text | One line, proportionate; the trailing never-halts clause has no other carrier on the injection path. Only the operator-set mandate moves (do now #1). (`goal-slice.cjs:138`) |
| Reopen ADR-001 to ADR-008 | The charter forbids it, and no finding in four iterations required it. |
| Add per-packet lock files beyond realpath keying | The alias case is a key-naming defect, not a missing resource; realpath keying covers it. (`goal-core.cjs:894–896`) |
| Gate `show`'s machine envelope behind a flag for scripts | The pi adapter parses it; a human mode is an addition, not a replacement. (`pi/goal-context.ts:106–107`) |

## Questions Answered

- **Q5** (synthesis): answered. Twelve do-now rows, twelve do-next rows, nine do-not rows, each citing file:line; overlaps between iterations and with the phase-007 P2 set are merged.

## Ruled Out

- **Ranking by severity label instead of score**: the open P2 items from the phase-007 review are spread across do-now and do-next rather than batched, because their costs differ (a doc line versus a plugin surface change).
- **Treating the two iterations' duplicate-looking items as one**: F1-H5 (a throw) and O4-1 (an unused field) are one deletion but two failure classes; merged for action, kept separate in the tables.

## Edge Cases

- **A do-now row that turns out to need a decision**: #4 (bind wiring) changes which tool call the offer path makes; if the operator wants the text path preserved on a packet with `goal.md`, it moves to do-next. The other eleven rows are mechanical.
- **Score ties**: #2 and #3 tie at 15 and are ordered by blast radius (validator wide, CLI narrow); #8 to #11 tie at 8–10 and are ordered by how many runtimes each touches.

## Sources Consulted

- All four iteration files in this lineage and their cited sources.
- `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review/review-report.md` (F004, F006, F007, F008, F009, F011, F012, F013, F014, F015 as cross-references).

## Assessment

- New information ratio: 0.35
- Novelty justification: synthesis adds the ranking, the merge map and the do-not defences; the underlying findings are all from iterations 1 to 4, so novelty is low by construction.
- Confidence: high for the merges and the do-now/do-not split; medium for do-next cost scores, which depend on decisions not yet made.

## Reflection

- What worked and why: scoring cost explicitly pulled several "obvious" items (the manifest constant, the two slices) into do-not and kept the do-now list to changes a single session can finish.
- What did not work and why: ranking by raw impact alone would have put the bind wiring first, but its cost includes a behaviour question the operator should answer; the score ordering reflects that.

## Recommended Next Focus

Synthesis and closeout: assemble `research.md` with the five charter deliverables, emit `resource-map.md` from converged deltas, record the terminal `maxIterationsReached` state, and update the dashboard and strategy.
