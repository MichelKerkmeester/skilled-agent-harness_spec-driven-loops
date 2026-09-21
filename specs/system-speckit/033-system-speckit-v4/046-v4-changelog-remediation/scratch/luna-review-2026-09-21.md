# LUNA 5.6 MAX FAST — a style review of the v4 changelog

Dispatched 2026-09-21 via cli-codex. Report-only: the changelog, the 045/046 tracked docs and the README are untouched; every finding's disposition below is *deferred* — applying fixes is a separate later decision.

## Dispatch metadata

| Field | Value |
|-------|-------|
| Model / effort / tier | `gpt-5.6-luna` · `model_reasoning_effort="max"` · `service_tier="fast"` (the skill's override-table resolution of "LUNA 5.6 MAX FAST") |
| Executor | `codex` 0.155.1, `exec --sandbox read-only`, `approval_policy=never`, one segment, `</dev/null` closed, leaf depth 1 |
| Prompt | `/tmp/luna-046-review-prompt.md` (394 lines: the child-dispatch preamble, the inlined `markdown` persona, the pinned task + output contract; CLEAR-checked before dispatch) |
| Subject pin | `CHANGELOG-v4.0.0.0.md` sha256 `e3b1b5c1ede77ef5728caa27e13a0face01412cb40ea03c476a4001b407e42b6` (the reviewer verified the pin itself, first line of its verdict) |
| Other pins at dispatch | HEAD `de7c50f222`; the voice standard `README.md` at `3ad5ca25fb` — the same commit the changelog was voiced against, so no voice-baseline drift |
| Return | exit 0 (not trusted); `/tmp/luna-046-review-raw.md`, 52 lines, complete report; `/tmp/luna-046-review-run.log` |

## The reviewer's report (verbatim)

# v4 Release Notes Review

## Verdict

Pin verified: `e3b1b5c1ede77ef5728caa27e13a0face01412cb40ea03c476a4001b407e42b6`, matching the remediation commit blob. It mostly reads like the README author, especially in the opening, glance, safety prose and upgrade notes, but I would not ship it unchanged. Reconcile the internal count and model-default contradictions first, then trim technical density. Later working-tree changes were treated as post-release drift, not stale changelog facts.

## Findings

1. medium · lines 176-181 · "Codex carries GPT-5.5 ... Cursor carries 21 ids across six families ... Mix them freely." · Replace the roster dump with the reader-facing executor benefit and move exact model counts to the appendix.

2. medium · lines 303-316 · "They can be measured, and were, across thirteen requests in one sitting" followed by dollar-rate tables · Keep the caching conclusion in the main text and move rate-card measurements to maintainer evidence.

3. medium · lines 471-483 · "shadcn visual register", "evilcharts Style Reference", "forty-two" check families and "v0.1.0.0 to v0.22.0.0" · Rewrite this around what chart users gain and move corpus metrics and vendor references to the appendix.

4. medium · lines 330, 362, 434, 465, 600 · "narrower and quieter", "not fully standalone", "still awaiting reconciliation", "planned, not shipped" and "Small things, no behavior change" · Move unresolved implementation caveats into the maintainer appendix and keep user-facing sections action-oriented.

5. medium · lines 11-15, 21-41, 47-61 · "This release is about shape" and "Most of the framework's skills stopped standing alone" repeat the same rationale already summarized in the glance · Make Why This Release explain reader benefit and let the glance carry the inventory.

6. low · lines 278-284 · "A Closed Roster" combines Pi's self-invocation carve-out with the six-provider and OpenRouter change · Add a bridging lead sentence or split the folded material into two focused subsections.

7. low · lines 246-249, 275-279, 410-412, 462-465, 498-502, 669-672 · "&nbsp;" is followed by surplus blank lines before several H4s and dividers · Normalize the spacer pattern to one blank line after each `&nbsp;` and one before each divider.

8. high · lines 244, 251 · "most complete runtime integration of the six" conflicts with "seventh runtime" and "eighth deep-loop executor kind" · Define six as a named subset or change the count so the roster has one interpretation.

9. medium · lines 565, 567, 575 · "Goals now follow you across three tools" is followed by "OpenCode, Cursor, Pi and Devin" and "four runtimes" · Change three to four or explain why Devin is excluded from the tool count.

10. medium · lines 176, 704 · "DeepSeek V4 Flash as its default" conflicts with "Pi picker defaults to DeepSeek V4.1 Flash" · Normalize the model name or label each default by executor and provider.

11. medium · lines 1-8, 523-525 · "Every authored markdown file now carries a four-part version" leaves this release note as a visible counterexample because its frontmatter has no `version` · Narrow the claim to in-scope skill documentation or state the changelog exception.

12. low · lines 51, 412 · "cli-jev" appears only in the glance, while `cli-orca` receives a later body mention · Add one short Jev fact to an owning section or remove it from the glance.

13. medium · lines 47-61, 698-704 · The glance spends one of 15 slots on "Two hubs graduated" while higher-impact source-root and removed-surface changes appear only in Upgrade Notes · Replace that niche bullet with the `.skilled/` source-root move or the most important removed surface.

## What already works

- Lines 11-18 lead with the release shape, user impact and two breaking changes in short, direct paragraphs.
- Lines 47-61 use 15 bold-lead bullets that scan quickly and front-load benefits.
- Lines 185-191 explain fan-out risk, changed behavior and operator impact in a clear progression.
- Lines 694-706 group migration work into actionable Renames, Repoint, Drop, Changed defaults and Reconcile categories.
- Lines 710-722 clearly mark the appendix as maintainer-only material and end the document there.

## Top 5 actions

1. Reconcile every count, runtime scope and model default before polishing prose.

2. Remove vendor rosters, exact metrics, rate-card tables and implementation gates from reader-facing sections.

3. Separate Why This Release from the glance and use the freed glance space for the highest-impact migration.

4. Repair the folded Orchestrating subsection and normalize the `&nbsp;` rhythm.

5. Give `cli-jev` an owning mention, narrow the versioning claim and keep unresolved caveats in the appendix.

## Triage (agent-verified, the review treated as claims until checked)

Citation spot-checks — eight, across the highest- and the checkable-est findings; **all eight resolved; zero discrepancies**:

| Finding | Cited | What the committed blob actually says | Resolves? |
|---|---|---|---|
| 8 (high) | 244, 251 | "It is the most complete runtime integration of the six." / "Hermes Agent … is the seventh runtime, as `cli-hermes`." | yes — the roster really does read six/seventh/(eighth) without naming the sets |
| 9 | 565, 567, 575 | "Goals now follow you across three tools" / "Goals in OpenCode, Cursor, Pi and Devin" / "the four runtimes that carry it" | yes — 3 vs 4 in one spread |
| 10 | 176, 704 | "DeepSeek V4 Flash as its default" / "the Pi picker defaults to DeepSeek V4.1 Flash" | yes — two near-identical spellings; note they may be genuinely different model ids, which makes the "label each by executor and provider" fix the right one |
| 11 | 1-8, 523-525 | frontmatter has title + trigger_phrases, no `version` / "Every authored markdown file now carries a four-part `version`" | yes — the document is its own counterexample |
| 12 | 51 | `cli-jev` appears exactly once (the glance bullet) | yes — and it corrects an earlier inference of mine: I had assumed the Orchestrating section still carried a jev paragraph; it does not |
| 7 | 246, 275 | 2 of the 43 `&nbsp;` lines are followed by two blanks (16 lines sit next to a `---`) | yes — mechanically proven, exactly the inconsistency claimed |
| 5 | 21-41 | "Most of the framework's skills stopped standing alone" sits in the Why, the glance's sixth family bullet parallels it | yes |
| 6 | 278-284 | the folded "A Closed Roster" H4 carries both the Pi carve-out and the roster asymmetry | yes — by design (the mandated fold); the reviewer's bridging-lead idea is a fair extra |

Verdicts per finding — *agreed* means the observation stands; every fix is *deferred* to a later, separately-decided edit pass:

| Finding | Verdict | Note |
|---|---|---|
| 1 | agreed, defer | citations verified (176-181 = the executor-roster ¶); the fix is a restructure, bigger than a typo pass |
| 2 | plausible, defer | lines not independently re-read; the Princeton-¶/rate-card material is known 045-kept prose, so the density point fits |
| 3 | agreed, defer | the range matches the known design-corpus paragraph (29 forms / 27 types / forty-two checks) |
| 4 | agreed as taste, defer | the caveats exist as quoted; the report itself mandated the one-sentence caveat, so this is editorial taste |
| 5 | agreed, defer | real overlap; note the 045 research intended the glance as a per-family inventory, so some parallelism was deliberate |
| 6 | agreed, defer | the reviewer's bridging-lead suggestion is the best structural idea in the review |
| 7 | agreed, defer | proven; also the cheapest true fix (two whitespace spots) |
| 8 | agreed, defer | the high-severity call is justified — it is the top action, and rightly so |
| 9 | agreed, defer | verified 3 vs 4; one-word class of fix |
| 10 | agreed with nuance, defer | see the spot-check note: the two spellings may be distinct ids, so labeling (not renaming) is the safer fix |
| 11 | agreed, defer | genuine catch; the 046 research itself recorded the frontmatter-format departure, so narrowing the claim is correct |
| 12 | agreed, defer | verified; folds into action 5 |
| 13 | agreed as taste, defer | folds into action 3 |

The five positives: consistent with the known artifact; the L11-18, L47-61 and L710-722 positives match what the remediation shipped.

## Disposition

All 13 findings and 5 top actions: **deferred** — recorded here as the review of record. Applying any of them changes the 722-line blob, the pinned skeleton and the 046 count record, so it is a separate decision, not part of this report-only dispatch.
