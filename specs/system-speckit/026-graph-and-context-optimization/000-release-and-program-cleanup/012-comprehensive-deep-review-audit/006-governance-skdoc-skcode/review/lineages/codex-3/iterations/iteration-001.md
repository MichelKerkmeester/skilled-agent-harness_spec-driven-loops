# Iteration 001 - Correctness Validation Gates

## Focus

The first pass checked whether the spec-kit validation and file-existence rules enforce the same completion contract described in the global framework.

## Evidence Reviewed

- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:841-849`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1044`
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:12-15`
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:65-90`
- `AGENTS.md:247-252`
- `AGENTS.md:281`

## Findings

### F001 - P1 - Strict spec validation exits before shell fallback

`run_node_orchestrator` is documented to return `1` when it should fall through to shell validators. In `main`, it is called bare under `set -e`, so that intended fallback becomes process termination. The observed strict validation command on the target packet returned exit 1 with no diagnostics.

Fix: call the orchestrator through an `if run_node_orchestrator; then exit $?; fi` style branch, or otherwise preserve the return-1 fallback without tripping `set -e`.

### F002 - P1 - Level 1 implementation-summary enforcement drift

The global framework and template structure list `implementation-summary.md` as a Level 1 required file. The shell file rule states Level 1 requires only `spec.md`, `plan.md`, and `tasks.md`, then skips `implementation-summary.md` while iterating template docs unless tasks/checklist evidence shows completion.

Fix: align the file rule with the template and framework table, or explicitly document that Level 1 implementation summaries are conditional.

## Claim Adjudication

Both P1 findings were accepted. They are based on direct source inspection plus command evidence, not inference from a single document.

Review verdict: CONDITIONAL
