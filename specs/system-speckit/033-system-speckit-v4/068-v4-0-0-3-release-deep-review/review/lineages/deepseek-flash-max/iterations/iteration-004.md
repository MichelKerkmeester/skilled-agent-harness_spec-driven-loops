---
title: "Deep Review Iteration 004 — spec-kit validation engine and rule scripts"
trigger_phrases: []
---

# Iteration 4: Correctness — spec-kit validation engine and rules

## Focus

Dimension: **correctness**. Slice: the spec-folder validation front end and its rule layer —
`runtime/cli/spec/validate.sh` (argument/env handling, skip switch, recursive child discovery and
exit-code aggregation), `runtime/cli/rules/check-source-tags.sh` + `check-source-tags-helper.mjs`,
`runtime/cli/rules/check-ac-coverage.sh`, `runtime/cli/rules/check-ac-closure.sh`, and the
orchestrator's report/exit surface (`runtime/lib/validation/orchestrator.ts`, CLI sections).
The pass also swept the shell rule scripts for the awk-portability defect class the release fixed
in one of them.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` (full, 1-428)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh` (full, 1-64)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` (lines 1-405)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` (separator/table/citation paths, lines 220-330, 380-420)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` (lines 1120-1180, `applyRecordedFindings`/baseline paths, 930-1020)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh` (separator rows, lines 140-150)
- Bracket-expression portability sweep across `.skilled` shell/awk scripts
- Recursive child-discovery audit against the current spec tree (read-only walk)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

- **F003**: Recursive validation silently skips a numbered child that has content but neither `spec.md` nor `description.json`, so a broken phase can be invisible to the parent's gate — `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:385` — The child loop (`:378-394`) skips any `[0-9][0-9][0-9]-*` directory that is non-empty but has neither marker file, then aggregates only the validated children's exit codes (`:392-397`). The exemption exists for artifact-only children (`review/`, `research/`, as the comment at `:382-384` states), and a read-only walk of `specs/` shows every currently skipped child is exactly that kind (e.g. `specs/system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/006-deep-review` holds only `gpt55 review/`; `specs/hooks/022-smart-rule-injection/004-agents-md-concision` holds only `research/`). The failure scenario the heuristic cannot distinguish: a scaffolded phase whose `spec.md` and `description.json` were both deleted or never written but which still holds `plan.md`/`tasks.md` — the parent run reports `RESULT: PASSED` while a numbered child is invalid, and nothing in the output names the skipped directory.

  Finding class: `instance-only`
  Scope proof: Read the recursive loop and its skip predicate end to end, then walked the spec tree for children matched by the predicate; all observed matches are artifact-only directories, so the gap is latent rather than exercised today.
  Affected surface hints: [`spec/validate.sh`, `rules/check-ac-coverage.sh`]

## Claim Adjudication

No new P0/P1; F003 is an advisory. The skip predicate's intent is documented and its observed matches are legitimate, which is why this is P2 and not P1 — the reported failure needs a phase that lost both marker files, a state the tree does not contain today.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Full traceability pass scheduled for iteration 8; this slice checked behavior against the script comments and the workspace tree. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "The gawk portability defect class the release fixed in `check-ac-coverage.sh` survives elsewhere": ruled out — a sweep for a hyphen immediately after a POSIX bracket expression found only three bracket expressions (`check-ac-coverage.sh:224,328`, `check-ac-closure.sh:146`) and all three now carry the hyphen last, which every awk reads as a literal.
- "`validate.sh` skip-switch handling can print non-JSON prose before a JSON report": ruled out — env overrides and the skip decision run before any notice is printed, and the auto-recursion notice is suppressed in JSON/quiet mode (`validate.sh:404-414`); the skip path emits a complete report object with `skipped: true` (`validate.sh:142-150`).
- "Recursive runs can mask a child's system error (exit 3) behind a validation error (2)": ruled out — the aggregation takes the maximum child exit code (`validate.sh:393`).
- "The source-tag wrapper mis-parses the helper's tab-separated contract": ruled out — the helper documents `WARN <doc>:<line> <citation> <class> <detail>` and emits exactly those five fields (`check-source-tags-helper.mjs:10-16, 396`); the shell's warning line wraps field 3, which is the citation match rather than the whole tag (`sourceTagCitations`, `:244-273`).
- "Recorded baseline findings can hollow out the pass verdict": ruled out on read — `applyRecordedFindings` downgrades only error entries whose exact deduplicated detail counts are recorded, never `NEVER_RECORDED_RULES` outside archived packets, and a malformed baseline means nothing is recorded (`orchestrator.ts:930-1020`).
- "JSON mode can pass while printing no RESULT line": not a defect — JSON mode returns the machine report and deliberately omits the prose RESULT line; the completion gate's documented invocation is plain `--strict` (`orchestrator.ts:1150-1175`).

## Dead Ends

- Running `validate.sh` against a scratch fixture to exercise the skip predicate: not attempted — fixtures and build output would write outside the lineage directory.

## Assessment

- New findings ratio: 1.0 (one new P2; weighted new = weighted total = 1)
- Dimensions addressed: correctness
- Novelty justification: the validation front end, skip path, recursion aggregation, source-tag contract, and AC rule separators were read against their comments and each other; one latent masking advisory (F003) and five explicit ruled-out directions are the output. Carried P1s unchanged.

## Next Focus

Dimension: correctness. Focus area: spec-kit retrieval and trigger index (`runtime/cli/retrieval/**`, `runtime/data/trigger-index.json` consumers, freshness checks). Required evidence: one executed read-only lookup or index read as a positive control for any absence claim. Rotations status: correctness slice 5 of 6.

Review verdict: CONDITIONAL
