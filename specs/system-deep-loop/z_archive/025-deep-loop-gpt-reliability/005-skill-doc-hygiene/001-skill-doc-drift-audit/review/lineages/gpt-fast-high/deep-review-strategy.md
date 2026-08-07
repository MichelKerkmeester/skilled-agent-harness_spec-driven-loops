# Deep Review Strategy — gpt-fast-high

## Topic

Skill Documentation Drift Audit (Packet 031 Follow-Up) for `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit`.

## Review Dimensions

- [x] Correctness — direct-agent routing claims and executable command templates.
- [x] Security — unsafe or misleading dispatch guidance that routes around orchestrate/command-owned boundaries.
- [x] Traceability — stale claims against phase 010/011/014 evidence and current files.
- [x] Maintainability — references to absent runtime mirror paths and stale playbook contracts.

## Completed Dimensions

- Correctness: CONDITIONAL, iterations 1, 2, 3, 8, 10.
- Security: PASS with dispatch-boundary caveat, iterations 3 and 10.
- Traceability: CONDITIONAL, iterations 4, 5, 6, 7, 8, 9, 10.
- Maintainability: CONDITIONAL, iterations 5, 7, 9, 10.

## Running Findings

Active counts: P0=0, P1=7, P2=1. Verdict remains CONDITIONAL because active P1 documentation drift exists.

## Files Under Review

| File | Coverage | Notes |
|---|---:|---|
| `.opencode/skills/cli-opencode/SKILL.md` | covered | F001 |
| `.opencode/skills/cli-opencode/README.md` | covered | F002 |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | covered | F004 |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | covered | F003 |
| `.opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md` | covered | F003 |
| `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | covered | F005 |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md` | covered | F006 |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/output_schema.md` | covered | F007 |
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md` | covered | F008 |
| `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md` | covered | F009 |
| `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md` | covered | baseline evidence |
| `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md` | covered | rename baseline |
| `.opencode/agents/ai-council.md` | covered | current `mode: subagent` evidence |

## Cross-Reference Status

| Protocol | Status | Evidence |
|---|---|---|
| spec_code | fail | F001-F009 show current-doc contradictions or absent path claims. |
| checklist_evidence | partial | Phase tasks require fanout synthesis; this lineage completed review synthesis only. |
| feature_catalog_code | partial | `mk-deep-loop-guard` feature catalog/playbook appears current; TOML mirror docs remain stale. |
| playbook_capability | fail | CO-017 expects `--agent ai-council` direct dispatch to exit 0. |

## Known Context

- Packet 031 phase 010 converted `.opencode/agents/ai-council.md:4` from `mode: all` to `mode: subagent` and confirmed direct `opencode run --agent ai-council` is rejected.
- Packet 031 phase 011 renamed `deep-route-guard.js` to `mk-deep-loop-guard.js` and current deep-loop-runtime catalog/playbook references use the new name.
- The 014 packet explicitly identifies removed `.opencode/agents/*.toml` mirror requirements as an audit target.
- `resource-map.md` not present. Skipping coverage gate.

## What Worked

- Exact-token searches for `--agent ai-council`, `mode: subagent`, and `.opencode/agents/*.toml` found high-signal stale claims.
- Reading the phase 010 implementation summary prevented treating old `mode: all` guidance as an ambiguous style preference.

## What Failed

- No valid `.opencode/agents/*.toml` files exist to support mirror-path claims in the current docs.

## Exhausted Approaches

- Treating `.opencode/agents/*.toml` as a current runtime surface is exhausted for this audit: the scoped Glob returned no files.

## Ruled-Out Directions

- `mk-deep-loop-guard` rename drift was ruled out for current deep-loop-runtime feature catalog/playbook entries reviewed in iteration 7.
- Orchestrate registry-backed routing drift was not promoted to a finding in this lineage; phase 009 evidence and current grep hits aligned.

## Next Focus

Synthesis complete. Recommended follow-up is a documentation-only remediation phase for F001-F009, then rerun targeted grep and strict spec validation.

## Review Boundaries

- Max iterations: 10.
- Stop policy: max-iterations.
- Convergence before iteration 10 treated as telemetry only.
- Writes confined to this lineage artifact directory.
