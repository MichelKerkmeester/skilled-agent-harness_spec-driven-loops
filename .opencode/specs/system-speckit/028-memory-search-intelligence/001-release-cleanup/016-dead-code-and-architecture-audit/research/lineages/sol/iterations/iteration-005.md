# Iteration 005: Deep-command representations

## Focus

Audit command router, workflow YAML, fallback body, compiled contract, and render-manifest responsibilities.

## Findings

1. Four deep commands each retain both a legacy body and compiled contract. Fallback emits the legacy body, while fix mode verifies the compiled contract and concatenates it with that same legacy body. This is a live CAT-5/CAT-6 dual-representation system, not deletable CAT-2 residue. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:17] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:83] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:90]

## Sources Consulted

- `.opencode/commands/deep/assets/legacy/README.md:13-21,86-92`
- `.opencode/commands/deep/assets/compiled/README.md`
- `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:17-128`

## Assessment

- New information ratio: 0.62
- Confidence: high that both representations are live; low on whether fallback compatibility can be retired.

## Reflection

Literal references falsified the initial legacy-file hypothesis. The remaining issue is the cost of keeping two command representations plus YAML authority synchronized.

## Recommended Next Focus

Audit agent definitions and runtime mirrors for drift and duplicated maintenance.
