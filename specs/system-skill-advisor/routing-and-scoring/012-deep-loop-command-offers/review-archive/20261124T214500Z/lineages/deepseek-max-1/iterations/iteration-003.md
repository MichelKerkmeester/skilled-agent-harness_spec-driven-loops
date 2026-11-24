# Iteration 3 - traceability

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: `spec_code` for the first two thirds of the requirement table — REQ-001 to REQ-034, each mapped to the code that implements it or the ADR that records it, as the focus asks; REQ-035 to REQ-053 follow in a later pass.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` (REQ-001 to REQ-034 rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (ADR-001 to ADR-009)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:331` (`LOOP_WORDING`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:441` (`LOOP_COUNT`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:451` (`LOOP_NAMES`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:540` (`MODE_CUE_WORDS`, `MODE_CUES`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:689` (`RUN_ASK_REFUSAL_LEADS` and its two companion lists)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:995` (`LOOP_REQUEST`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1016` (`LOOP_EFFORT_LEADS`, `LOOP_EFFORT_WORDS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (stage-one passes rule)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (359 rows)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:1` (near-miss rows)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13` and `.skilled/commands/deep/assets/deep-research-presentation.txt:13` (offer section)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:30` and `.skilled/commands/deep/assets/deep-research-presentation.txt:30` (question tool line)
- `.skilled/commands/deep/assets/deep-review.yaml:2535` and `.skilled/commands/deep/assets/deep-research.yaml:2269` (`/doctor:deep-loop --scope=` next step)
- `.skilled/commands/deep/research.md:86` and `.skilled/commands/deep/review.md:81` (step 0 pointer)
- `.skilled/skills/system-deep-loop/hub-router.json:34` and `.skilled/skills/system-deep-loop/ROUTER.md:63` (research aliases)
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md:303` and `.skilled/skills/system-deep-loop/deep-review/SKILL.md:308` (Gate 2 advisor CLI line)
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1` (compiled contract)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **REQ-011 names `DEPTH_WORDING`, a surface the tree no longer carries** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` -- The requirement says `ask the council`, `convene` and `several models` "leave `DEPTH_WORDING`". No file under `.skilled/` contains that identifier; the depth-wording gate it names was replaced by the loop-ask rule, and the words themselves are absent from `command-attach.ts`, so only the outcome clause is checkable. A reader tracing REQ-011 cannot find the list it names, and a future search for the list returns nothing, which makes the requirement read as stale even though its behaviour holds. Impact is traceability only: the council words are gone and `explicit.ts` carries no `several models` boost, so nothing in the product is wrong.
   - Finding class: docs-drift
   - Scope proof: `spec.md` and `lib/command-attach.ts` are both on `review-scope-files.txt`; the absence was checked by searching `.skilled` for the identifier and reading `LOOP_WORDING` and `LOOP_REQUEST`, the lists that replaced it.
   - Affected surface hints: REQ-011, ADR-007, CHK-011's grep set, the drift guard's list names.
   - Case: a reader checking REQ-011 runs `rg DEPTH_WORDING .skilled`, gets nothing, and cannot tell whether the requirement is stale or the list was renamed; the durable evidence for the same clause is `LOOP_WORDING` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:331` plus the absence of the three council words.
   - Claim adjudication:
     - `type`: `stale_identifier_in_requirement`
     - `claim`: REQ-011 cites an identifier (`DEPTH_WORDING`) that exists in no file under `.skilled/`, so the requirement's first clause cannot be verified against the tree by the name it gives.
     - `evidenceRefs`: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:331`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:995`
     - `counterevidenceSought`: searched `.skilled` for the identifier (no hit), checked whether the list survives under another name by reading the exported word lists near the gate, and confirmed the three council words appear in neither `command-attach.ts` nor `explicit.ts`, so the behaviour the clause describes is real.
     - `alternativeExplanation`: `DEPTH_WORDING` may be the historical name of a list deleted with the depth gate, in which case the requirement is describing a past state and the name is history rather than a live pointer.
     - `finalSeverity`: P2
     - `confidence`: 0.78
     - `downgradeTrigger`: if the packet records `DEPTH_WORDING` as the retired list's name in `decision-record.md` or the plan, the row drops to a wording note and no edit is owed.

## Traceability Checks

- `spec_code` — partial. REQ-001 to REQ-034 are mapped below. The map is one file:line or one ADR section per requirement, read at this revision; the clauses that assert a measured probe outcome (REQ-001 to REQ-004, REQ-008, REQ-014) are traced to the rule and the fixture row that pin them, not re-measured, because the probe result files are outside this review's scope. REQ-035 to REQ-053 are not mapped yet, so the protocol stays partial.

  | Requirement | Evidence anchor | Status |
  |---|---|---|
  | REQ-001 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:331` (`LOOP_WORDING`) + fixture `asksForLoopRun` rows | traced |
  | REQ-002 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:995` (`LOOP_REQUEST` opens on an ask, not on depth wording) | traced |
  | REQ-003 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1580` (`attachCommand` command table) + fixture typed rows | traced |
  | REQ-004 | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` negative rows | traced |
  | REQ-005 | `.skilled/commands/deep/assets/deep-review-presentation.txt:13`, `.skilled/commands/deep/assets/deep-research-presentation.txt:13`, `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81` | traced |
  | REQ-006 | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:539` (depth-word `undefined` cases) + 359-case fixture | traced |
  | REQ-007 | `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1`; `ASK with SINGLE prompt` count 0 across `compiled/` | traced |
  | REQ-008 | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` | traced |
  | REQ-009 | `.skilled/commands/deep/assets/deep-research.yaml:2269`, `.skilled/commands/deep/assets/deep-review.yaml:2535`, both presentation files (11 to 14 matching lines each) | traced |
  | REQ-010 | `.skilled/commands/deep/assets/deep-review-presentation.txt:30` and `:267` and `:277`; the research twin at the same anchors | traced |
  | REQ-011 | `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `ADR-007` (`decision-record.md:603`); `DEPTH_WORDING` absent — see P2 above | traced with a naming defect |
  | REQ-012 | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (`ADR-001`) + 31 `near-miss` rows in the corpus | traced |
  | REQ-013 | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:796` (`ADR-009`) + the `-04` holdout row | traced |
  | REQ-014 | fixture row for the summary prompt + `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1027` (`LOOP_ARTIFACT_NOUNS`) | traced |
  | REQ-015 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:689` (`RUN_ASK_REFUSAL_LEADS`) | traced |
  | REQ-016 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1027` (question readings) + fixture `how-*` rows | traced |
  | REQ-017 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` (curly-apostrophe fold) | traced |
  | REQ-018 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1580` stuck branch + negated-symptom fixture row | traced |
  | REQ-019 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1027` (`LOOP_ARTIFACT_NOUNS`) + `ADR-004` (`decision-record.md:317`) | traced |
  | REQ-020 | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:244` + `ADR-005` (`decision-record.md:412`) + the Python gate at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5743` | traced |
  | REQ-021 | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (359 rows read by both suites) | traced |
  | REQ-022 | `.skilled/changelog/skilled/v4.2.0.0.md:759` + `ADR-003` (`decision-record.md:223`) | traced |
  | REQ-023 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:689` and `:716` (refusal verbs and cancel leads) | traced |
  | REQ-024 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1600` and `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1082` | traced |
  | REQ-025 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` `typedCommandIn`, pinned by `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:176` | traced |
  | REQ-026 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`routedLoopMode`) and the deferred path | traced |
  | REQ-027 | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (subject read before the loop lane) | traced |
  | REQ-028 | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` typed-row render path + `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:353` | traced |
  | REQ-029 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1590` + `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts` | traced |
  | REQ-030 | `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` + `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` | traced |
  | REQ-031 | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` (`VOCABULARY_PAIRS`, 24 rows read by counting the list) | traced |
  | REQ-032 | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1011` | traced |
  | REQ-033 | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` (`AC-040`, still `Unmet`) | traced, outcome open |
  | REQ-034 | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:198` (twelfth-round rows) | traced |

- `checklist_evidence` — partial. The acceptance citation set was verified in iteration 1 and the security checklist rows in iteration 2; the task checklist and the closure counts are scheduled for the next traceability pass.

## Integration Evidence

- Command surface: `.skilled/commands/deep/review.md:81` and `.skilled/commands/deep/research.md:86` each carry the step 0 pointer the offer section needs; both files point at the same presentation section, so the two modes teach one offer.
- Workflow surface: `.skilled/commands/deep/assets/deep-review.yaml:2535` and `.skilled/commands/deep/assets/deep-research.yaml:2269` carry the `/doctor:deep-loop --scope=<mode>` next step, and both YAMLs carry `--extend=N` in their completed-packet and next-step text (11 matching lines each).
- Hub surface: `.skilled/skills/system-deep-loop/hub-router.json:34` and `.skilled/skills/system-deep-loop/ROUTER.md:63` carry `iterative research` and `multi-round research`, and `autonomous research` appears in neither, which is ADR-007's amended scope.
- Skill surface: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:303` and `.skilled/skills/system-deep-loop/deep-review/SKILL.md:308` name the advisor CLI on the Gate 2 line; neither carries `comprehensive research`, `deep investigation`, `audit spec folder` or `pre-release review` any more.

## Edge Cases

- A requirement that asserts a measured probe outcome cannot be re-measured from inside a read-only review, because the probe result files are outside the review scope. Those rows are marked traced-to-rule rather than met, and the distinction is kept in the table above rather than flattened into `pass`.
- `REQ-033` states a rerun must pass its coverage gate, while `AC-040` reads `Unmet`. The pair is consistent with the open review round, so the requirement is traced to its own acceptance row and left open rather than reported as drift.
- `DEPTH_WORDING` absent from the tree is treated as a naming defect in REQ-011 (reported) rather than as a missing implementation, because the behaviour the clause describes is present under the loop-ask rule.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` — 359 cases, the count AC-028, AC-029 and AC-042 state, and the file both suites read.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:1` — 31 `near-miss` rows, which is the count AC-019 says supersedes its 15.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:331` and `:995` — the loop-ask rule is built from exported word lists, so the drift guard can compare each list with its Python twin.

## Ruled Out

- `REQ-006` naming the wrong test file: ruled out. The requirement as amended names the shared fixture and `command-attach-guards.vitest.ts`, and that file holds the depth-word `undefined` cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:539`.
- `REQ-025`'s claim that `typedCommandIn` has no production reader: ruled out as drift. The export exists, the boundary tests import it (`.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:176`), and no production path was found calling it.
- `REQ-011`'s alias clause against the hub: ruled out. Both hub files carry the two aliases and neither carries `autonomous research`, so ADR-007's narrowed clause holds.

## Next Focus

- Dimension: maintainability
- Focus area: the comment-hygiene rule on the changed code, duplication between the two gate copies, and whether the reducer's projections stay readable as the packet grows.
- Reason: three dimensions will be covered after this pass; maintainability is the last canonical dimension the coverage gate needs, and it carries a hard repo rule about comments.
- Rotation status: correctness, security and traceability started; maintainability remains.
- Blocked/productive carry-forward: productive — the requirement table resolves quickly against the gate's exported lists.
- Required evidence: comment scan over the changed code, the list-pair guard, and the reducer's section writers.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS
