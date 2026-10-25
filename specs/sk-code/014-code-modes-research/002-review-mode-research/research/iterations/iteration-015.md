# Iteration 15: Second-model re-check 5 of 5 — ranks 7, 8, 9, 10 and 11

## Focus

Final slot of the second-model pass. Two jobs, in order:

1. Re-check the last five ranked rows in `research/research.md` — ranks 7, 8, 9, 10 and 11 — against current disk, opening each row's own source tag and returning CONFIRMED, REFUTED or NOT TESTED per claim.
2. State an independent top five, with every ordering difference from the first-pass list named.

This iteration is not a re-read of the prior model's prose. Each verdict below rests on a file opened now. No reducer-owned file is touched, nothing under `.skilled/` is modified, no network fetch is made, and the sibling phase-001 research folder is not read.

## Actions Taken

1. Read `.skilled/agents/deep-research.md` once as the agent definition, then `research/research.md`, `deep-research-strategy.md` and `deep-research-config.json` for claim text, question state and run identity.
2. Read `iterations/iteration-011.md` and `iterations/iteration-014.md` for the settled claims and the carried-open list.
3. Read `sk-code-review/SKILL.md` lines 330–479 in one block. That window holds the report template (`:350`), the final-line contract, section 4 RULES (`:418`, `:426`) and section 7 INTEGRATION POINTS (`:472`), so it covers rank 7, rank 11 and two of rank 2's anchors in one read.
4. Read `scripts/check-review-final-line.js` end to end (143 lines) for rank 9.
5. Read `benchmark/reports/README.md` end to end (36 lines) for rank 10.
6. Read `parent-skills-nested-packets.md` lines 175–239 for rank 8, including the full eleven-row integration table.
7. Grepped `.skilled/` for the literal `Surface evidence used` to test rank 7's carried consumer question.

## Findings

### F1 — Rank 7: CONFIRMED, and its carried consumer gate is now answered

The row's own anchor still says exactly what it claims.

- OBSERVED. The report template still offers two values only. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:350] `**Surface evidence used**: [SKILLED | UNKNOWN]`
- OBSERVED. The packet's own README example uses the single value form. [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:74] `**Surface evidence used**: SKILLED`
- OBSERVED. The four output fixtures carry `UNKNOWN`. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/list-shape-valid.md:6] `**Surface evidence used**: UNKNOWN`

The open question carried since iteration 11 was whether replacing the label would break report-format consumers named in I-7. A grep of `.skilled/` for the literal returned six matches and no more: `SKILL.md:350`, `README.md:74`, and four files under `scripts/review-output-fixture/` (`list-shape-valid.md:6`, `heading-shape-valid.md:6`, `heading-shape-restart.md:6`, `heading-shape-missing-case.md:6`). Every match is inside `sk-code-review/`. Nothing under `.skilled/agents/`, `.skilled/commands/` or the deep-loop runtime names the line.

- DERIVED. The three I-7 consumers are the final status line, the `CODE-REVIEW` marker and the shared severity doctrine. None of them reads the Surface line. Replacing it therefore touches only the packet's own example and fixtures, which the row already lists as hub files touched.
- Caveat, carried from iteration 13's method note: a zero-match proves no file *names* the literal, not that no reader parses the fourth header line by position. The conclusion is safe here because the consumers that exist by contract parse the final line and the marker, not the header block.

**Verdict: CONFIRMED. The "Decision (report-format consumers, I-7)" gate is answered negatively, so rank 7's readiness moves from Decision to Ready with the same hub-file list.**

### F2 — Rank 8: premise CONFIRMED at the integration table

- OBSERVED. The authoring guide's both-kinds rule is cited correctly. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:207] `register the workflow first and attach surfaces`
- OBSERVED. The eleven-row table at lines 221–233 covers registration (`mode-registry.json`), stage-one signals and tie-break (`hub-router.json`), stage-two intent and inventory (`ROUTER.md`), advisor vocabulary (`graph-metadata.json`), the human-facing contract (`hub SKILL.md` mode table), doctor metadata (`description.json`), the leaf manifest, projection maps/scorer and command mirrors. Row 7 is explicitly a visibility surface: [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:229] `Human-facing contract`.
- DERIVED. Not one row names a data payload exchanged between a user-authored mode and review — what a security surface supplies, or what a consuming workflow may rely on. E-2's "no row says what review reads from it" survives a full read of the table, not a sample of it.
- NOT TESTED. The row's effort rating (M), risk rating (Low) and its "Decision" status, including whether section 7 should gain a twelfth row. Those are assessments, not file facts.

**Verdict: CONFIRMED for the premise and for the absence of a payload row. The proposal itself is unbuilt and untested.**

### F3 — Rank 9: CONFIRMED at code level

The checker is a final-line validator, not a report validator.

- OBSERVED. The accepted vocabulary is the three status values only. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:18] `const EXACT_STATUS = /^Review status: (APPROVED|REQUESTED_CHANGES|COMMENTED)$/;`
- OBSERVED. The test is applied to the last line alone. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:59] `const finalLine = lines[lines.length - 1];` and [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:61] `final line is not an exact status line`
- OBSERVED. After the final-line match, the checker adds only blank-line and `Not checked:` presence/uniqueness rules. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:82] `/^Not checked: +\S/`
- OBSERVED. The report template separately carries an Overall assessment line. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:348] `**Overall assessment**: [APPROVED / REQUESTED_CHANGES / COMMENTED]`
- DERIVED. The 143-line file contains no reference to `Overall assessment`. A report whose summary says APPROVED and whose final line says REQUESTED_CHANGES passes every check the script runs. U-7's "a contradictory summary passes" is therefore confirmed against the implementation, not just the prose.

**Verdict: CONFIRMED. The proposed cross-check and contradictory-report fixture are not implemented, which is the row's point.**

### F4 — Rank 10: source tag CONFIRMED, composite claims partly NOT TESTED

- OBSERVED. The index row the recommendation cites still reads as claimed. [SOURCE: .skilled/skills/sk-code/sk-code-review/benchmark/reports/README.md:27] `7 PASS`
- OBSERVED. The second run reports the same result. [SOURCE: .skilled/skills/sk-code/sk-code-review/benchmark/reports/README.md:28] `7 PASS`
- OBSERVED. Both rows record no provenance. [SOURCE: .skilled/skills/sk-code/sk-code-review/benchmark/reports/README.md:27] `not recorded`. This corroborates U-2's cost-provenance gap at index level: the curated index itself says the source is not recorded.
- NOT TESTED. The D4-unscored claim, the empty `provider_model` column, the missing duration/token columns and the playbook's 30-versus-31 count. Those live in the per-run reports and the playbook, which this iteration did not reopen. The row's action — add live finding-accuracy scenarios — remains a proposal.

**Verdict: the cited tag is CONFIRMED; the row's supporting evidence beyond the index is NOT TESTED here, and iteration 4's U-1/U-2/U-4 remain the operative citations.**

### F5 — Rank 11: CONFIRMED for the cited anchor, second half NOT TESTED

- OBSERVED. The integration section names the repo-bound agent path verbatim. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:472] `Primary review baseline for `@review` agents in `.skilled/agents/review.md``.
- NOT TESTED. The row's second example class — root-relative `.skilled/skills/...` script commands. That evidence lives in `scripts/README.md:31` under RA-4, which was not opened this iteration.

**Verdict: CONFIRMED for the tag the row actually cites. The proposal is a wording change and the anchor for it is real.**

## Re-Check Verdicts

| Prior claim | Verdict | Basis |
| --- | --- | --- |
| Rank 7: template offers only `[SKILLED \| UNKNOWN]` | **CONFIRMED** | `SKILL.md:350`; README and fixtures carry the same two-value form. |
| Rank 7: the label cannot express CI or user surfaces | **CONFIRMED** | Same template; the CI surface exists (iteration 11, F3). |
| Rank 7: replacing it risks report-format consumers (I-7) | **REFUTED as a named risk** | Grep returns six matches, all inside `sk-code-review/`; the I-7 consumers parse the final line and marker. |
| Rank 8: no integration row defines the payload (E-2) | **CONFIRMED** | Full eleven-row table read; rows cover registration and routing, not data exchange. |
| Rank 8: the both-kinds rule is as cited | **CONFIRMED** | `parent-skills-nested-packets.md:207`. |
| Rank 9: the checker validates only the final line | **CONFIRMED** | `check-review-final-line.js:18,59-61,82`; no `Overall assessment` reference in 143 lines. |
| Rank 9: a contradictory summary passes | **CONFIRMED** | Derived from the same read: the summary line is never compared. |
| Rank 10: the index reports `7 PASS` | **CONFIRMED** | `benchmark/reports/README.md:27-28`. |
| Rank 10: D4 unscored, cost unrecorded, 30 vs 31 count | **NOT TESTED** | Per-run reports and playbook not reopened; index's `not recorded` corroborates the cost gap only. |
| Rank 11: examples name `.skilled/agents/review.md` | **CONFIRMED** | `SKILL.md:472`. |
| Rank 11: examples name root-relative `.skilled/skills/...` commands | **NOT TESTED** | `scripts/README.md:31` not opened. |

## My Top Five

Ranked by gain against the three goals, with readiness and evidence strength breaking ties. This is an independent order, not a restatement of section 6.

| My rank | First-pass rank | Recommendation | One-line reason |
| --- | --- | --- | --- |
| 1 | 2 | Write the extension-floors list in `SKILL.md` | Ready, S, and it is the one rule every other recommendation must cite before it can be checked; shipping it first makes the profile and every user mode constrainable. |
| 2 | 1 | Add the repo-owned review profile at a neutral path | Highest gain, but it needs a schema, path and precedence decision, and iteration 12 established that no loader exists today, so it is a new subsystem rather than a tweak. |
| 3 | 12 | Fix path-only workflow routing so a review of `.github/workflows/` bundles CI | The only recommendation whose verification gate is already closed by a replay, and the current behavior silently drops the CI rules from a workflow review. |
| 4 | 5 | Make the M-2 never-skip list extensible by addition only | Ready, S, with a concrete confirmed gap: `go.mod`, `build.gradle`, `pom.xml` and `*.csproj` match no row in the taxonomy. |
| 5 | 9 | Make the final-line checker compare the Overall assessment line | Ready, S, and the code read shows the only automation-parsed contract can contradict the report it terminates. |

### Ordering differences from the first pass

- **Rank 2 is first, rank 1 second** (first pass had 1 then 2). The swap is a readiness judgment: rank 1 is still the largest gain, but rank 2 is the only top row that is Ready and it is a precondition for rank 1's floor safety.
- **Rank 12 enters at 3** (first pass: 12). Its verification gate closed in iteration 11, so it is now an implementable bug fix rather than a replay request.
- **Rank 5 moves 5 → 4** (rank 4 drops out of the top five). Rank 4's fallback absence is confirmed only inside §9.1; whether `pr-state-dedup.md` or runtime code supplies one is still unread, so rank 5's fully section-scoped confirmation outranks it.
- **Rank 9 moves 9 → 5** (rank 3 drops out of the top five). Rank 3 depends on rank 1's schema and adds a routing change; rank 9 is self-contained and confirmed at code level.
- **Ranks 3 and 4 are the two rows displaced from the top five.** Ranks 6, 7, 8, 10 and 11 remain outside it: 6 needs a live scenario, 7 is now Ready but smaller gain than 9, 8 is unbuilt and touches a doc outside the hub, 10 is measurement rather than review behavior, and 11 is cosmetic.

## Questions Answered

- **Rank 7's carried consumer question** (open since iteration 11): no consumer outside `sk-code-review/` names the `Surface evidence used` line. Answered negatively at file level.
- No strategy key question is newly answered. All ten are already marked `[x]` in the strategy; this iteration verifies ranked recommendations, not key questions.

## Questions Remaining

- **Rank 4, framework-wide.** Is a no-origin M-1 fallback documented outside §9.1 — in `references/pr-state-dedup.md` or runtime code? Still NOT TESTED.
- **Rank 5, narrowed.** Does `references/pr-state-dedup.md` restate or extend the never-skip taxonomy? Still NOT TESTED.
- **Rank 2, narrowed.** `SKILL.md:108` and `code-quality-standards.md:54` were not opened, and the full 562-line file was not read, so "no consolidated extension rule" remains partly untested. `:418` and `:426` are now confirmed.
- **Rank 10, narrowed.** D4 scoring, cost columns and the 30-versus-31 playbook count were not reopened.
- **Live runtime handoffs.** Does a quality-then-review run pass the advisory envelope, and can a real user-authored surface mode route into review and exchange evidence? Both remain UNKNOWN; only a live scenario decides them.
- **State discrepancy, carried untouched.** The dispatch context still lists Q2–Q9 as open while the strategy marks them answered. This iteration does not touch reducer-owned state.

## Next Focus

The run is at its cap (iteration 15 of 15), so this is the hand-off rather than a next probe. The implementable order is the top five above. If one live scenario is funded before implementation, make it the user-surface replay: it is the only test that can move rank 8 and the E-3 payload question at the same time.

## Reflection

- **What worked and why:** opening each row's own anchor instead of re-deriving it from `research.md`. The single consumer grep was worth more than a fifth file read — it converted a question carried since iteration 11 into a negative answer in one call, because the literal is distinctive and its absence outside the packet is observable.
- **What did not work and why:** breadth across five rows left three secondary claims untested (rank 10's reports, rank 11's script examples, rank 2's remaining anchors). The slice was five rows wide and the budget was one row deep.
- **What I would do differently:** for a five-row slice, find the shared risk first. Here every row's risk reduced to "who reads this contract", and one grep answered it for the highest-risk row before any individual anchor was opened.

## Sources Consulted

- `.skilled/agents/deep-research.md` (agent definition)
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/research.md` (claim text only, not evidence)
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-strategy.md`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-config.json`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/iterations/iteration-011.md`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/iterations/iteration-014.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md:330-479`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` (full file)
- `.skilled/skills/sk-code/sk-code-review/benchmark/reports/README.md` (full file)
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:175-239`
- Grep of `.skilled/` for `Surface evidence used` (six matches, all inside `sk-code-review/`)

## Assessment

- New information ratio: 0.35
- Novelty justification: four of five rows are confirmations at their own anchors; the new content is the negative consumer result for rank 7, the code-level confirmation of rank 9's gap, and an independent re-ranking that moves rank 12 into the top five and displaces ranks 3 and 4.
- Questions addressed: ranks 7, 8, 9, 10 and 11; rank 7's consumer question
- Questions answered: rank 7's consumer question (none external); no key question
