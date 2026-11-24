# Review Iteration 003 — traceability (`spec_code`, requirements REQ-001 to REQ-034)

- Iteration: 3 of 5
- Dimension: traceability
- Operator review focus: finish `spec_code` and `checklist_evidence`; check every REQ against the code that implements it or the decision that records it, including the sixth fix round (REQ-023 to REQ-034).
- How this iteration addressed the focus: every requirement row in `spec.md` was mapped to a predicate, a decision record entry or a recorded probe/corpus result, and the probe groups were compared against their baselines rather than read from prose.

## Dispatcher

Executed inline as `@deep-review` for lineage `deepseek-max-3`. No nested dispatch.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:204-247` (REQ-001 to REQ-034)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33-620` (ADR-001 to ADR-006, D8 record)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/decisions.md:16` (D8, alias amendment)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/probes-spec-baseline.json`, `results-spec-baseline.json`, `results-after.json`, `results-fresh-review.json` (69 rows each)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`, `command-prompts.jsonl` (247 rows, 31 near-miss, 3 `-04` deep holdouts)
- `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt`, `deep-research.yaml:2265-2270`, `deep-review.yaml:2530-2536`
- `.skilled/commands/deep/research.md:86`, `review.md:81`
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`
- `.skilled/skills/system-deep-loop/SKILL.md:20`, `hub-router.json:34`, `ROUTER.md:63`, `deep-research/SKILL.md`, `deep-review/SKILL.md`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:346-1064` (exported lists), `lib/scorer/lanes/explicit.ts:454`, `scripts/skill_advisor.py:4480-5424`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` (limitation 8) remains active, so this iteration's verdict stays CONDITIONAL.

### P2 Findings

3. **REQ-011 names a third hub alias the built tree does not carry, and no ADR amends the requirement text** — `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:223` — REQ-011 states that "The research aliases `iterative research`, `multi-round research` and `autonomous research` reach `hub-router.json` and `ROUTER.md`". Both files carry the first two and not the third `[SOURCE: .skilled/skills/system-deep-loop/hub-router.json:34]`, `[SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:63]`. The drop is an operator decision recorded only in the packet's scratch decision log `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/decisions.md:16]`, and the task that implements the clause still prints a verify line the tree cannot satisfy: "`rg -c ...` prints 3", with its own observation recording 1 `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:69]`. The decision record's ADR-002 covers only the multi-round alias, so a reader of `spec.md` and `decision-record.md` alone cannot see why the third alias is absent. The functional outcome REQ-011 also asks for — K2 topping the hub on the research route — does hold `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1]`.
   Finding class: spec-code-mismatch (recorded decision, unamended requirement)
   Scope proof: the requirement, the two hub files, the task line and the decision log row are all named in the requirement or in the packet; the mismatch is visible by reading the two hub files against the requirement sentence.
   Affected surface hints: `spec.md` REQ-011 and AC-017; `tasks.md` T022; `decision-record.md` (an ADR for the D8 amendment would close it); the hub router's research aliases.
   Case: a maintainer re-reads REQ-011 to decide whether "autonomous research" may be re-added; the requirement says it is present, the tree does not carry it, and only a scratch decision log explains the gap.
   ```json
   {"type":"claim_adjudication","claim":"REQ-011 requires three research aliases in hub-router.json and ROUTER.md, while the tree carries two and no ADR amends the requirement","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:223",".skilled/skills/system-deep-loop/hub-router.json:34",".skilled/skills/system-deep-loop/ROUTER.md:63","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/decisions.md:16","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:69"],"counterevidenceSought":"searched both hub files for 'autonomous research', searched decision-record.md for an ADR that names the alias, and checked whether AC-017 restates the third alias","alternativeExplanation":"the operator decision D8 records the drop after an out-of-domain replay, so the deviation is intentional; only the requirement and task text are stale","finalSeverity":"P2","confidence":"high","downgradeTrigger":"if a decision record entry naming 'autonomous research' is added and REQ-011 is amended, the finding closes"}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence | Note |
|----------|-------|--------|----------|------|
| `spec_code` | core | partial | `spec.md:204-247`; `hub-router.json:34`; `command-attach.ts:346-1064`; `results-after.json` (69 rows) | REQ-001 to REQ-010, REQ-012 to REQ-034 map to a predicate, a recorded result or a decision. REQ-011 is partial: two of its three aliases exist and the third is recorded only in the scratch decision log. REQ-033 is pending this run's own synthesis. |
| `checklist_evidence` | core | not run | - | Runs in iteration 4. |

Requirement map used for `spec_code`:

| Requirement | Evidence read |
|-------------|---------------|
| REQ-001 | gain group 5 of 5 with `/deep:review` or `/deep:research` and `pol=ask` in `results-after.json` (`V6`, `H1a`, `H1b`, `E1`, `E3`) |
| REQ-002 | R7 prints no command; no no-gain row carries a `/deep:*` command in any of its three rows; V5 tops `sk-code` |
| REQ-003 | all 17 keep ids match `results-spec-baseline.json` on command and `pol=ask` |
| REQ-004 | all 17 negative ids match the baseline top skill and `cmd=` |
| REQ-005 | both presentation files carry the offer section, `--spec-folder=<the Gate 3 answer>`, options A/B/C, native default and fan-out condition; `research.md:86` and `review.md:81` carry step 0 `[SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:13]` |
| REQ-006 | gate cases live in `command-attach-guards.vitest.ts`; `dist/` is gitignored, so the build is a recorded observation |
| REQ-007 | compiled contract has no `ASK with SINGLE prompt`; both command docs resolve |
| REQ-008 | R2 tops `system-spec-kit`; V2, V4, H10 top the hub with `/deep:review`; H7 with `/deep:research`; no REQ-004 id moved |
| REQ-009 | completed-packet message names `--extend=N` and `--restart`; both `next_steps` lists carry `--extend=N` and a `/doctor:deep-loop --scope=` row `[SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2265]`, `[SOURCE: .skilled/commands/deep/assets/deep-review.yaml:2530]` |
| REQ-010 | step 6 names `communication-handoff.md`; Q2 and Q-Exec carry `(Recommended)`; `ASK with SINGLE prompt` count 0 in both files |
| REQ-011 | partial: aliases `iterative research` and `multi-round research` present, `autonomous research` absent; council words gone from gate and lane; H3b tops nothing; hub `SKILL.md` names `/doctor:deep-loop` `[SOURCE: .skilled/skills/system-deep-loop/SKILL.md:20]` |
| REQ-012 | 31 `near-miss` rows in `command-prompts.jsonl`, 6 of them the required ids |
| REQ-013 | three deep-family `holdout` ids end in `-04` |
| REQ-014 | N9 prints no command |
| REQ-015 to REQ-019 | the shared fixture pins the six refusals, two questions, hyphen/curly prompts, negated symptom and nine subject prompts; `asksForLoopRun` matches each |
| REQ-020 | `typedReviewKept` column on four prompts plus the control; Python gate drops the three and keeps the control `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5348]` |
| REQ-021 | 69 probes with 0 command differences against `results-fresh-review.json`; corpus `false_offer` 0 of 57 `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1]` |
| REQ-022 | changelog states the refusal rule, names the brief change and quotes 2,696 passed `[SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:759]`; AC-008 reads `Waived` with ADR-003 |
| REQ-023 | refusal leads in both copies; six fixture refusals `false`, five controls `true` |
| REQ-024 | `RUN_REFUSED` and `_RUN_REFUSED_RE`; 26 `doctorWithheld` rows; fused row withholds `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]` |
| REQ-025 | `typedCommandsIn` and `typedCommandForTop`; four `typedRunsKept` rows; Python keeps kept run rows `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274]` |
| REQ-026 | deferred cue blanks the subject loop name; `DEFECT_CHECK` reads -ing; guard cases at `command-attach-guards.vitest.ts:963` |
| REQ-027 | `passesAsked` requires the gate predicates `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454]`; Python `_is_loop_workflow_request` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5424]` |
| REQ-028 | `parseRecommendations` carries command/policy/owner/typed; `degradedRecommendations` marks only the typed row `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1529]` |
| REQ-029 | `attachTypedCommand` sets the typed command over the diagnosis `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428]`; fixture `servedReviewKept: true`; Python marks the kept row `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5349]` |
| REQ-030 | `LEAD_WINDOW` 400 on both copies; `ADVISOR_PROMPT_MAX_CHARS` 10,000 shared; long-prompt cases at `command-attach-guards.vitest.ts:998` |
| REQ-031 | eleven pairs compared; per-entry fixture requirement; arrays at `command-attach.ts:346`, `:405`, `:506`, `:646`, `:809`, `:1000`, `:1064` and tuples at `skill_advisor.py:4480`, `:4508`, `:5028` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62]` |
| REQ-032 | `refinesSameLocation` folds only same file + same declared dimension `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995]` |
| REQ-033 | pending: this run is the rerun the requirement names; its terminal gates are recorded at synthesis |
| REQ-034 | fixture header names the typed layers; limitations 6/7 rewritten; changelog names the exception and verbs; tasks counts agree; packet 013 records its REQ-006 evidence `[SOURCE: specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123]`; limitation 8 is the active iteration-1 P1 |

## Integration Evidence

- Probe runner and baseline: `probes-spec-baseline.json` holds 69 prompts and `results-after.json` 69 rows, each `exit 0` / `status ok` / `freshness live` `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1]`.
- Corpus: 247 rows with 31 `near-miss`, and `false_offer` 0 of 57 in the committed baseline `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1]`.
- Shared fixture: one file read by both suites, 203 cases `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1]`.

## Edge Cases

- **Build artifacts are not in the tree.** `runtime/dist/` is gitignored `[SOURCE: .gitignore:60]`, so the `dist` rebuild claims in REQ-006 cannot be verified from the checkout; recorded as a build-time observation, not as a pass.
- **The 69-probe set and the corpus cannot be re-run here.** The lineage write surface forbids build/test writes, so the rows are compared against their committed results files and the baseline, which is the strongest available evidence.
- **REQ-011's alias clause.** Treated as a recorded-decision mismatch rather than a silent gap; the decision log names the drop.

## Confirmed-Clean Surfaces

- The keep and negative groups match their baselines exactly: 0 command differences across 17 keep ids and 0 top-skill/command differences across 17 negative ids.
- The gain group reaches 5 of 5, and every `/deep:*` row on the rerun keeps `pol=ask`.
- The 69-probe rerun is byte-stable against the fresh-review run on every command.
- The corpus keeps `false_offer` at 0 of 57.

## Ruled Out

- **A probe-group regression.** Ruled out by direct comparison with `results-spec-baseline.json` and `results-fresh-review.json`.
- **A missing near-miss or holdout row.** Ruled out: 31 near-miss rows and three `-04` deep holdout ids are present.
- **A missing completion message or next step.** Ruled out: both YAML lists carry them at the cited lines.

## Next Focus

- Dimension: traceability (`checklist_evidence`)
- Focus area: every ticked task T001 to T085 and every `Met` row AC-001 to AC-042 against evidence that exists; the Verification Summary counts; the waiver cells; closure statement consistency.
- Reason: `spec_code` is finished except for this run's own REQ-033; `checklist_evidence` is the remaining core protocol.
- Rotation status: correctness, security and traceability (`spec_code`) reviewed; `checklist_evidence` and maintainability remain.
- Blocked/productive carry-forward: none blocked. Productive: comparing result files rather than reading prose.
- Required evidence: a `file:line` per checked row, the four ADR waiver cells, and the counts behind the Verification Summary.

Review verdict: CONDITIONAL
