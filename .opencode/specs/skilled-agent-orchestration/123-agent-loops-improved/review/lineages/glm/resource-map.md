# Resource Map — glm Fan-Out Lineage (derived from review delta evidence)

> `resource-map.md` was NOT present at the target spec folder at init, so the formal **Resource Map Coverage Gate was omitted** per deep-review SKILL.md §3 (this is not a failure). This file is emitted from converged review delta evidence as the packet inventory baseline captured during the loop.

## Packet Inventory (observed during review)

| Entry | Path | Touched by review? | Bucket |
|-------|------|--------------------|--------|
| Parent spec | `123-agent-loops-improved/spec.md` | yes (traceability) | touched |
| Phase 009 spec | `123-agent-loops-improved/009-loop-systems-remediation/spec.md` | yes (F001) | touched — drift found |
| Phase 010 | `123-agent-loops-improved/010-gpt-deep-agent-routing/` | yes (coverage sweep) | touched — no finding |
| Changelog | `123-agent-loops-improved/changelog/` | yes (coverage sweep) | touched — no finding |
| Timeline | `123-agent-loops-improved/timeline.md` | yes (coverage sweep) | touched — no finding |
| Before/after | `123-agent-loops-improved/before-vs-after.md` | yes (coverage sweep) | touched — no finding |
| External refs | `123-agent-loops-improved/external/` | yes (trust-boundary sweep) | touched — read-only research input |
| Fan-out orchestrator | `deep-loop-runtime/scripts/fanout-run.cjs` | yes (F002,F003,F004,F006,F007) | touched — multiple findings |
| Review workflow | `commands/deep/assets/deep_review_auto.yaml` | yes (F002,F005) | touched — findings |
| Review agent | `agents/deep-review.md` | yes (F003 contract cross-read) | touched — reference |
| Fan-out tests | `deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | yes (F004) | touched — drift found |
| Phases 001-008 | `123-agent-loops-improved/001-…/008-…` | spot-checked only | expected-by-scope (not deeply audited this lineage) |

## Phase-5 Augmentation (novel logic gaps from delta evidence)

- **F007 (novel)** — salvage recovery re-dispatches the same weak executor on `salvage_miss` without changing prompt structure; deterministic executor failures exhaust retry budget. Source: iteration 7 / 14 / 49. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1382]; [SOURCE: review/orchestration-status.log:5]
- **F006 (novel)** — write boundary is prompt-enforced only; no path-scoped sandbox default for review/research lineages. Source: iteration 6 / 13 / 48. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1287]

All other findings (F001-F005) were independently confirmed by the sibling codex lineage and are therefore cross-model corroborated rather than novel to this lineage.
