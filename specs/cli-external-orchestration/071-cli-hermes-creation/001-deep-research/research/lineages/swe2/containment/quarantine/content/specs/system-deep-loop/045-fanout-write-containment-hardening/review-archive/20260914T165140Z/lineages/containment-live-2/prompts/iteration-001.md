# Iteration Prompt — run 001

*Rendered by the fan-out lineage. The workflow's per-iteration executor-dispatch step is
already satisfied by this process: the lineage IS the executor, so the prompt below is the
contract this run was executed against rather than a payload handed to a child process.*

```
STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 1 | Mode: review
Target: specs/system-deep-loop/045-fanout-write-containment-hardening (spec-folder)
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
  implementation-summary.md, research/synthesis.md); runtime surfaces the criteria cite
  (write-containment.ts, executor-config.ts, write-containment.vitest.ts,
  fanout-pool.vitest.ts, stress/cli-adapter/fanout.vitest.ts); the four /deep:* command
  YAMLs; hub SKILL.md, runtime README, both mode-packet loop protocols, feature catalog entry
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
  specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/containment-live-2/
BANNED OPERATIONS: generate-context.js; validate.sh (including --recursive); every git
  write, checkout, commit, branch and push; any write outside the lineage directory
```

## Focus summary

The packet under review changes the fan-out write-containment remedy after the 2026-09-08
incident. The review's job is not to grade the design — the design was researched over ten
iterations and its open question is answered in `spec.md` §12 — but to establish whether the
packet's documents, the shipped runtime behaviour, and the packet's own closure gate tell the
same story. Three of the packet's requirements have landed with test coverage; three have
not. The review therefore has to hold a hard line between "not built yet", which the packet
tracks honestly, and "built but misdescribed", which it does not.

## Held-risk notes carried into this pass

- The acceptance-criteria evidence cells make specific `file:line` claims. Spot-check a
  sample against source before trusting the table, otherwise a stale table and a false
  closure statement become indistinguishable.
- The packet is mid-flight. A finding that amounts to "a planned phase has no code" is not a
  finding; `AC-002`, `AC-009`, `AC-010` and `AC-011` already record that state.
- `resource-map.md` is absent, so `resource_map_present` is `false` and no Resource Map
  Coverage Gate section is due at synthesis.
- Modification times are admissible evidence for document staleness, but they are not
  sufficient on their own; confirm with a content check before recording the finding.
