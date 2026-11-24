# Review Iteration 4

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Run: `fanout-deepseek-max-3-1795552859377-13gxwk`, lineage `deepseek-max-3`, generation 1
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Dimension: traceability
- Steer file: absent at dispatch time
- Operator review focus addressed: this is the first of the four traceability iterations the focus leads with. It checks `REQ-001` to `REQ-019` against the implementation or the decision that records them, and the first 29 acceptance rows against evidence that exists in the tree, using the kept probe artifact, the corpus, the documentation and the two gate copies.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:146-300`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56-88`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:16-129`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33-320`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1-69`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-spec-baseline.json:1-69`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:1-30`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:1-247`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1-60`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-62, 223-280, 470-480`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13-62, 237-280`
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`
- `.skilled/commands/deep/assets/deep-research.yaml:220-280, 655-670, 2265-2271`
- `.skilled/commands/deep/assets/deep-review.yaml:50-60, 2528-2536`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:540-560`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. Iteration 1's active P1 keeps the verdict at CONDITIONAL.

### P2 Findings

5. **AC-011's verification cell describes an unresolved reference the reference check no longer reports** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:68` -- the cell says the reference check "reports one unresolved reference, the pre-existing `speckit-resume.yaml` path to the gitignored access telemetry", while the command it names now prints `OK  command references resolve across 84 asset file(s)` and exits 0, and the evidence row it points at has said so all along.
Case: a reader re-runs `node .skilled/commands/scripts/validate-command-references.cjs` to confirm the row and reads a clean pass, not the single violation the cell describes, so the row's evidence no longer reproduces the sentence beside it.
- Finding class: instance-only
- Scope proof: `rg -n "unresolved reference"` finds this one acceptance cell and no other doc; the same claim is not repeated in `implementation-summary.md`, whose "Closure pass: advisor suite" row already says the references resolve.
- Affected surface hints: ["acceptance-criteria.md AC-011", "implementation-summary.md Closure pass: advisor suite"]

## Traceability Checks

- `spec_code` (partial, `REQ-001` to `REQ-019`):
  - `REQ-001` to `REQ-004`: `scratch/probes/results-after.json` holds 69 rows, every one `status: ok` and `freshness: live`. V6, H1a and E3 top `system-deep-loop` with `/deep:review` policy `ask`; H1b and E1 with `/deep:research` policy `ask`; R7 carries no command; V5 tops `sk-code`; all 13 no-gain ids carry no `/deep:*` command in any of their three rows; the 17 keep ids match `results-spec-baseline.json` on top skill, command and policy with zero mismatches; the 17 negative ids match the baseline the same way with zero mismatches; N9 carries no command. Evidence: `scratch/probes/results-after.json:1`, `results-spec-baseline.json:1`.
  - `REQ-005`: both presentation files carry `### Offer From an Advisor Brief` with the three options, a recommended A that runs `:auto` with `--spec-folder=<the Gate 3 answer>`, B on `:confirm`, C on no loop, a native executor by default, and fan-out only on two or more named executors or independent takes (`deep-research-presentation.txt:13-62`, `deep-review-presentation.txt:13-62`); `research.md:86` and `review.md:81` carry step 0. Evidence: `.skilled/commands/deep/assets/deep-review-presentation.txt:13`.
  - `REQ-006`: the shared fixture is the one oracle both suites read (iteration 1 replayed all 359 rows through the fallback with 0 mismatches), the depth-word guard case exists at `command-attach-guards.vitest.ts:546`, and every probe row reads `live`. Evidence: `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:546`.
  - `REQ-007`: observed this iteration: `sync-runtime-mirrors.cjs --check` printed `PASS: 260 mirrors across 10 trees are in sync` and exited 0; `validate-command-references.cjs` printed `OK  command references resolve across 84 asset file(s)` and exited 0; the compiled contracts hold zero `ASK with SINGLE prompt` matches. Evidence: `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1`.
  - `REQ-008` and `REQ-009`: R2 tops `system-spec-kit`, V2/V4/H10 top the hub with `/deep:review`, H7 with `/deep:research` in the kept probe file; the deep-research completed-packet message names `--extend=N` and `--restart` (`deep-research.yaml:663`), both presentation Next Steps tables carry the `--extend=N` row (`deep-research-presentation.txt:477`), and both YAML `next_steps` lists carry the extend line (`deep-research.yaml:2268`, `deep-review.yaml:2534`). Evidence: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1`.
  - `REQ-010`: both presentation files' step 6 names the question tool from `communication-handoff.md` §5, Q2 reads `A) Autonomous (Recommended)` and Q-Exec reads `A) Native (Recommended, default)` in both. Evidence: `.skilled/commands/deep/assets/deep-research-presentation.txt:223`.
  - `REQ-011` to `REQ-014`: both hub files carry `iterative research` and `multi-round research` and neither carries `autonomous research` (`hub-router.json:34`, `ROUTER.md:63`); the depth triggers, the spaced `:auto` form, the `skill_advisor.py` Gate 2 line and the spaced flag examples are absent from both mode packets and the research quick reference; the hub `SKILL.md` names `/doctor:deep-loop` (`SKILL.md:20`); N7, N9, V7, H6 and A3 are `near-miss` rows and D1 is a positive doctor row in the corpus (ADR-001); the three deep-family holdout rows are the `-04` replacements (ADR-009); N9 carries no `/deep:*` command. Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:225`.
  - `REQ-015` to `REQ-019`: every prompt the requirement text names returns its stated result from the fallback gate (`asks_for_loop_run`), including the six REQ-015 refusals plus control, both REQ-016 questions, both REQ-017 spelling variants, the REQ-018 negated symptom, the nine REQ-019 subjects and the three REQ-019 controls. No mismatch. Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5362`.
- `checklist_evidence` (partial, `AC-001` to `AC-029`):
  - `AC-001` to `AC-005`: the kept probe artifact matches the cells (see the `REQ-001` to `REQ-004` lines above).
  - `AC-006` to `AC-008`, `AC-029`: the offer section, the step 0 pointer, the question-tool setup and the changelog row at `v4.2.0.0.md:759` all exist, and AC-008 reads `Waived` with ADR-003.
  - `AC-009`, `AC-010`, `AC-021` to `AC-028`: the cited test titles, fixture fields, hook transcript and probe rows exist. AC-009's `it.each` title is on `command-attach-guards.vitest.ts:546`; the hook transcript carries every REQ-015 to REQ-019 outcome and the typed-policy offers (`scratch/probes/fresh-review-hook.txt:1-30`).
  - `AC-011` reads `Met` but its description is stale (finding 5); the row's command result is a clean pass, so the status stays `Met`.
  - `AC-012` (`REQ-039`): the committed corpus baseline records `false_offer` 0 of 57 (`command-routing-baseline.json`), which is the claim the cell makes.
  - `AC-013`, `AC-016`, `AC-017`, `AC-018`, `AC-019`, `AC-020`: the stage-one probe rows, the council-word absence, the alias state under ADR-002, the removed depth triggers, the near-miss rows under ADR-001 and the holdout waiver under ADR-009 all match.
  - `AC-014`, `AC-015`: the four command assets carry the extend/restart rows and the recommended options; both files carry no `ASK with SINGLE prompt`.
  - `AC-029` and the closure statement: the changelog row quotes 186 files and 3,518 passed, AC-008 reads `Waived` with ADR-003, and `AC-040` reads `Unmet` with `Closeable: No`, which is internally consistent.

Both protocols remain `partial`; iterations 5 to 7 carry `REQ-020` to `REQ-053` and `AC-030` to `AC-061`.

## Integration Evidence

- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exited 0 with `PASS: 260 mirrors across 10 trees are in sync`.
- `node .skilled/commands/scripts/validate-command-references.cjs` exited 0 with `OK  command references resolve across 84 asset file(s) [create, deep, design, doctor, prompt, speckit]`.
- `PYTHONDONTWRITEBYTECODE=1 python3` loaded `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` in place and evaluated every `REQ-015` to `REQ-019` prompt.

## Edge Cases

- The corpus baseline's `capturedAtSha` is `a139ac3b248`, not the pre-packet `2ef3895f753`, because later rounds recaptured it. `REQ-039` asks for a recapture, so the later SHA is consistent with the requirement; the counts are what the cells quote.
- `dist/` is absent, so `REQ-006`'s "dist is rebuilt" clause is confirmed by the kept probe artifact (`freshness: live`) rather than by a file in the tree. That is the artifact the requirement names, so it counts, but a fresh checkout cannot reproduce the probe run without a build.
- `AC-008`'s waiver and `AC-020`'s waiver were read from the table and their ADRs; their observed rates were not re-measured, because the behaviour sessions are recordings, not runnable checks.

## Confirmed-Clean Surfaces

- The 69-row probe artifact is internally consistent: 69 ids, every row `ok`/`live`, and the five gain, thirteen no-gain, seventeen keep and seventeen negative groups each match the cells that cite them.
- No `REQ-015` to `REQ-019` prompt disagrees with its stated result.
- The command assets agree with `REQ-009`: both YAML `next_steps` lists, both presentation Next Steps tables and the completed-packet message carry the extend row and the doctor row.
- The `REQ-011` alias state matches ADR-007: two aliases in both hub files, no `autonomous research`.

## Ruled Out

- A probe-artifact/cell mismatch: every id in the four groups matches, and the baseline comparison shows zero changed rows in the keep and negative groups.
- A missing offer section or step 0 in either command document: both are present, with the three options and the recommended form.
- A `REQ-015` to `REQ-019` gate regression: every prompt the requirement text names returns its stated result from the fallback.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` over `REQ-020` to `REQ-039` and `checklist_evidence` over `AC-030` to `AC-043`, including the ADR-005 typed-on-stuck exception and the ADR-006 bare-loop-name decision
- Reason: the second traceability batch; these are the rounds whose findings the packet's own review history records most densely
- Rotation status: traceability in progress across iterations 4 to 7
- Blocked/productive carry-forward: the fallback gate and the fixture are productive; the kept corpus and hook transcript are productive evidence
- Required evidence: each requirement's stated prompts run against the fallback, plus file:line for the code or decision that implements it

Review verdict: CONDITIONAL
