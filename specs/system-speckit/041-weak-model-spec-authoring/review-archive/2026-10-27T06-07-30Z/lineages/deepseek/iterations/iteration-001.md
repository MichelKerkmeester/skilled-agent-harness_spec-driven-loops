# Iteration 1: Correctness - versioned placeholder gate and its shell mirror

## Dimension

Correctness. The v2.3 value-token lifecycle added by phase 003: the orchestrator rule `validatePlaceholders`, the shell mirror `rules/check-placeholders.sh`, the template stamps and manifest versions, and the one parity test that compares the two implementations.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:655-762`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:1-208`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:12-82`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:1-139`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md:28-42`
- `.skilled/skills/system-spec-kit/templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl` (stamp lines)
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:31`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1-22`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md:130-150`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/implementation-summary.md:35-90`

## Findings by Severity

### P0 Findings

None. The orchestrator is the production gate and its four lifecycle cells behave as the phase claims: a stamped Draft warns, a stamped non-Draft errors, an older stamp errors, and an open question errors in every case.

### P1 Findings

None.

### P2 Findings

1. **Catalog leaf asserts a parity the code does not have** -- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md:36` -- The leaf first says the orchestrator reads every present authored document while the shell mirror reads a fixed list and adds `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` only when stamped, then concludes "Both implementations answer with the same verdict." The two sentences contradict each other, and the code confirms the first one: an unstamped `goal.md` carrying `[YOUR_VALUE_HERE: ...]` is an error in `validatePlaceholders` (`orchestrator.ts:720-747`) and is never opened by the mirror (`check-placeholders.sh:107-111`). The leaf's Edge Cases paragraph repeats the same problem for fenced and inline code. The phase 003 requirement REQ-002 (`003-versioned-placeholder-gate/spec.md:140`) and the phase 007 review's recorded P2 (`007-playbook-catalog-readme-alignment/scratch/review/T015.raw.attempt2.txt`) both name this gap, and the shipped leaf still states the stronger claim.
   Finding class: documentation-contract-drift
   Scope proof: the leaf and both implementations were read directly; the doc-set difference is visible in `orchestrator.ts:720` versus `check-placeholders.sh:107-111`.
   Affected surface hints: feature-catalog leaf, orchestrator placeholder rule, shell mirror, phase 003 requirement text
   Case: a v2.3 Draft packet with one `[YOUR_VALUE_HERE: ...]` in an unstamped `goal.md` errors under `validate.sh` and passes under the shell mirror, which is the opposite of "the same verdict".

2. **Parity test pins four cells and none of the divergent shapes** -- `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:91` -- The five tests exercise a v2.3 Draft token, a v2.3 non-Draft token, a v2.2 token and an open question, all on `spec.md` at Level 2. No test covers the doc-set difference, the `<YOUR_VALUE_HERE:` form that only the orchestrator matches (`orchestrator.ts:665` versus `check-placeholders.sh:134`), the `[template:...]` title token that only the shell matches (`check-placeholders.sh:158`), an indented fence (`orchestrator.ts:729` accepts leading whitespace, `check-placeholders.sh:115-119` does not), or a token after text inside an inline span. A regression in any of those keeps the suite green.
   Finding class: test-coverage-gap
   Scope proof: the test file was read end to end; the shell and orchestrator patterns were compared line by line.
   Affected surface hints: placeholder token gate test, shell mirror, orchestrator placeholder rule
   Case: the shell mirror already misses the angle-bracket form today, and `Tests 5 passed (5)` still reports success.

3. **The authoring card's token count covers three documents, the gate covers six** -- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:133` -- Step 8 tells a weak model to prove a finished packet with `rg -o '\[YOUR_VALUE_HERE: ' <packet>/spec.md <packet>/plan.md <packet>/tasks.md | wc -l` and accept a count of 0. The orchestrator also scans `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` whenever they are present and stamped, so a token left in one of those three passes the card's own acceptance line and fails `validate.sh --strict` at any non-Draft status. The card's step 9 validator run catches it later, but the step that calls itself "FILL EVERY TOKEN" declares success too early.
   Finding class: followability-gap
   Scope proof: the card was read end to end; the orchestrator doc list was read at `orchestrator.ts:505-519,720`.
   Affected surface hints: spec authoring card, orchestrator placeholder rule, acceptance-criteria and implementation-summary templates
   Case: a model fills spec, plan and tasks, leaves one token in `acceptance-criteria.md`, sees `0` from the card's command, marks the packet Complete, and then fails validation.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `003-versioned-placeholder-gate/spec.md:140`; `orchestrator.ts:665-747`; `check-placeholders.sh:104-158` | The four lifecycle cells match REQ-002; the unqualified "agree on each case" reading does not survive the doc-set and marker differences above. |
| `checklist_evidence` | pending | hard | `003-versioned-placeholder-gate/acceptance-criteria.md` not yet audited | Deferred to the checklist-evidence pass. |
| `skill_agent` | notApplicable | advisory | - | No skill definition changed by this phase. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition changed by this phase. |
| `feature_catalog_code` | fail | advisory | `versioned-placeholder-gate.md:36` | The leaf's parity claim is contradicted by the code it documents. |
| `playbook_capability` | pending | advisory | `manual-testing-playbook/template-authoring/*` | Scenario claims are audited in a later iteration. |

## Edge Cases

- The orchestrator defers only the bracket form (`match[0] === '[YOUR_VALUE_HERE:'`), which is the phase 003 review fix; the shell never matches the angle form at all, so the two disagree in the opposite direction from the pre-fix bug.
- The shell mirror's fence toggle requires ```` ``` ```` at column 0; the orchestrator accepts leading whitespace, so an indented fence is code to one implementation and prose to the other.
- The orchestrator skips a token only when the immediately preceding character is a backtick; the shell excludes any token followed by `]` then a backtick, so `` `see [YOUR_VALUE_HERE: x]` `` is skipped by the shell and flagged by the orchestrator.
- The coverage graph is empty for this lineage because `upsert.cjs` and `convergence.cjs` write to the shared graph database outside the lineage write authority; graph convergence is therefore recorded as read-only telemetry, not as a persisted snapshot.

## Confirmed-Clean Surfaces

- All five template stamps and the five manifest entries read v2.3; `decision-record.md.tmpl`, `phase-parent.spec.md.tmpl` and `goal.md.tmpl` remain v2.2 as the phase scopes them.
- `spec_status_is_draft` and `specStatusIsDraft` normalize bold marks, backticks, quotes, case and trailing punctuation identically; the Draft word test agrees.
- The stamp reader in both implementations reads only the first 70 lines and compares major/minor numerically, so v2.10 would outrank v2.3 correctly.
- The orchestrator's deferral keeps `[NEEDS CLARIFICATION:` an error in a Draft, matching the shell's line-level exclusion.

## Ruled Out

- A blanket error on every bare hint: ruled out by the phase scope and the census, which keeps existing packets' verdicts fixed.
- A false positive from mustache `{{...}}`: ruled out; neither implementation matches it.

## Next Focus

Iteration 2 - security - trust boundaries and path handling in the same gate family: `check-placeholders.sh` shell word splitting and file iteration, the `awk`/`grep` pipeline under `set -euo pipefail`, `validate.sh` path normalization, and whether a packet path or document content can inject a shell command or escape the folder.

Review verdict: PASS
