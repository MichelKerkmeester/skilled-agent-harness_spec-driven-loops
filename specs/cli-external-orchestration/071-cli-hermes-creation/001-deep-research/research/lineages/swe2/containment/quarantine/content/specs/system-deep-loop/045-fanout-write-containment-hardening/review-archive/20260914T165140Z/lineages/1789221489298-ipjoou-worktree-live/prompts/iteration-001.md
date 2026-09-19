# Iteration Prompt — run 001

*Rendered by the fan-out lineage. The workflow's per-iteration executor-dispatch step is
already satisfied by this process: the lineage IS the executor, so the prompt below is the
contract this run was executed against rather than a payload handed to a child process.*

```
STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 1 | Mode: review
Target: specs/system-deep-loop/045-fanout-write-containment-hardening (spec-folder)
Reviewed revision: 2d7439c0a5 (dedicated worktree; tree stable)
Dimensions: 0/4 complete | Next: all four (single-pass ceiling)
Findings: P0:0 P1:0 P2:0 active
Traceability: core=pending overlay=pending
Last 2 ratios: none | Stuck count: 0
Provisional verdict: PENDING | hasAdvisories=false
Next focus: correctness, security, traceability, maintainability

Review Target: specs/system-deep-loop/045-fanout-write-containment-hardening
Review Mode: spec-folder
Iteration: 1 of 1
Focus Dimension: all four (correctness, security, traceability, maintainability)
Focus Files: packet docs (spec.md, acceptance-criteria.md, plan.md, tasks.md,
  implementation-summary.md, goal.md, decision-record.md, research/synthesis.md); runtime
  surfaces the criteria cite (write-containment.ts, executor-config.ts, fanout-run.cjs and
  the HEAD commit diff; write-containment.vitest.ts, fanout-run.vitest.ts,
  stress/cli-adapter/fanout.vitest.ts); the four /deep:* command YAMLs; hub SKILL.md,
  runtime README, both mode-packet loop protocols, feature catalog entry
Traceability Protocols:
  - Core: spec_code, checklist_evidence
  - Overlay: feature_catalog_code, playbook_capability
State Files:
  - Config:   deep-review-config.json
  - State:    deep-review-state.jsonl
  - Registry: deep-review-findings-registry.json
  - Strategy: deep-review-strategy.md
Output: Write findings to iterations/iteration-001.md
CONSTRAINT: LEAF-only -- no nested dispatch, no sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
CONSTRAINT: Every finding cites file:line; inference-only findings are rejected
CONSTRAINT: Every new P0/P1 carries a typed claim-adjudication packet in the iteration file
ALLOWED WRITE PATHS: this lineage directory only
  specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/worktree-live/
BANNED OPERATIONS: generate-context.js; validate.sh (including --recursive); every git
  write, checkout, commit, branch and push; any write outside the lineage directory
```

## Focus summary

The packet under review changes the fan-out write-containment remedy after the 2026-09-08
incident and then moves each lineage into its own worktree. The review's job is not to grade
the design — the design was researched over ten iterations and its open question resolved in
`spec.md` §12 — but to establish whether the packet's documents, its task ledger, its
closure gate and the shipped runtime behaviour at HEAD tell the same story. Four
requirements and most of a fifth are implemented with test coverage; the record around them
is where this pass found its findings, including one false verification claim in the
closure gate and one comment block that contradicts the code beneath it.

## Held-risk notes carried into this pass

- Spot-check the acceptance-criteria evidence citations against source before trusting the
  table; a citation can be stale while the claim behind it is true, and the two readings
  need different repairs.
- The packet is mid-flight. A finding that amounts to "a planned item has no code" is not a
  finding; T028 and T032 already record what remains open.
- `resource-map.md` is absent, so `resource_map_present` is `false` and no Resource Map
  Coverage Gate section is due at synthesis.
- The last commit landed hours after the documents that describe it; read the diff, not the
  commit subject, and check every present-tense claim in the Known Limitations section
  against the tree.
