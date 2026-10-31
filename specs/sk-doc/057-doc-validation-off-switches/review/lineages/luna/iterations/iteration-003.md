# Iteration 003 — Traceability

## Focus
Compared REQ-001..008, the affected-surface table, acceptance claims, and direct consumers of `validate.sh` reports. This pass is source-only; packet test evidence was not rerun.

## Files reviewed
- `specs/sk-doc/062-doc-validation-off-switches/spec.md`
- `specs/sk-doc/062-doc-validation-off-switches/plan.md`
- `specs/sk-doc/062-doc-validation-off-switches/acceptance-criteria.md`
- `specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md`
- `specs/sk-doc/062-doc-validation-off-switches/tasks.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts`

## Findings
### P1-LUNA-002 — Progressive JSON mode merges the skip notice into stdout
`validate.sh` correctly writes the skip notice to stderr and a skipped JSON object to stdout. In `progressive-validate.sh` JSON mode, the wrapper captures both streams with `2>&1`; when level 1 is final, it prints that combined string directly. The first line is then the human notice, so stdout is not valid JSON. For aggregate levels, `generate_json_report` bases `passed` on the zero exit code and does not carry a `skipped` field. This conflicts with REQ-005's parseable-JSON requirement and with the plan's description of the wrapper as passthrough. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:262-274] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:610-672] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:142-172] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:138] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/plan.md:78-82]

**Recommendation:** Keep channels separate and include `skipped` in the progressive JSON result. Cover both the level-1 passthrough and aggregate JSON paths.

**Claim adjudication packet**
- Claim: The level-1 JSON branch emits invalid JSON on a skipped run because it merges stderr into the stdout payload.
- Evidence refs: `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:262-274`; `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:142-172`.
- Counterevidence sought: The plan says the wrapper is unchanged and output passes through; direct source shows stderr is merged and no skip field is propagated.
- Alternative explanation: The contract could apply only to `validate.sh`, but the progressive wrapper separately exposes JSON mode and is in the affected-surface map.
- Final severity: P1; confidence 0.94.
- Downgrade trigger: Evidence that skipped progressive JSON is explicitly outside the CLI contract or that consumers receive a separate valid JSON channel.

### P2-LUNA-003 — Local audit consumers report an explicit skip as a pass
The producer marks its report `skipped: true` but also exits 0. `quality-audit.sh` discards the notice and counts exit 0 as pass; `strict-pass-freshness.ts` tests exit and `passed === false` but not `skipped`, then returns `pass`. The summary says a skip is no evidence. The plan records these consumers as unchanged, so I classify the gap as a disclosed status ambiguity rather than a required-flow failure. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:142-172] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:125-150] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:246-272] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md:134-141] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/plan.md:78-82]

**Recommendation:** Expose `skipped` as a distinct audit status so a local opted-out run is not reused as evidence.

## Core protocol status
- `spec_code`: partial — producer path meets the stated report shape, but the listed progressive JSON wrapper breaks parseability on skip.
- `checklist_evidence`: partial — AC-001..008 and task evidence are documented as Met; this review did not rerun the cited suites. No `checklist.md` exists, so the workflow's separate AC_COVERAGE signal is exempt.

## Ruled out in this pass
- The skip producer itself emits a JSON object with `skipped: true` and a `VALIDATION_SKIPPED` info entry after argument parsing. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:139-172]
- The pre-commit repair consumer is not implicated by these findings; the packet cites it as reading error rows from the skipped report. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/plan.md:78-80]

## Convergence telemetry
Two new findings: one P1 and one P2. Weighted novelty ratio 0.857. Continue to the five-iteration cap.

Review verdict: CONDITIONAL
