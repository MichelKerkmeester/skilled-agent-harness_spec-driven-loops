---
title: "AI Council Strategy — 029 Residual-Backlog Closure Roadmap"
description: "Charter for the single-round, 3-seat council deciding how to handle 029's ~24 residual P2/P3 findings and whether 029 is done-enough to close the 027 epic."
trigger_phrases:
  - "ai council strategy 029"
  - "residual backlog roadmap charter"
importance_tier: "normal"
contextType: "implementation"
---
# AI Council Strategy — 029 Residual-Backlog Closure Roadmap

## Purpose
Produce a prioritized, constraint-respecting roadmap for the residual backlog that survives after 029's entire P0/P1 deep-review queue closed (round-2 verdict PASS) and all deferred carefuls were handled. Decide per-cluster disposition (DO-NOW / DESIGN-FIRST / DEFER-BY-DESIGN / ESCALATE) and render one strategic verdict on closing the 027 epic.

## Task framing
- Decision question, not implementation. Output is a plan + `ai-council/**` artifacts.
- Ground-truth-first: the lane `disposition.md` "Code queue (open)" sections are PARTIALLY STALE. Every item recommended for action was spot-verified against current code (file:line), not trusted from disposition text.

## Selected reasoning lenses (3 seats, max per contract)
1. Seat 001 — Pragmatist / Ship-it (temp 0.3): minimize time-to-close, maximize safe throughput, treat residual as follow-on.
2. Seat 002 — Correctness / Safety-hawk (temp 0.2): protect hard invariants (prompt-safety, daemon-lifecycle, DB integrity); refuse historical-failure-class regressions.
3. Seat 003 — Systems / Maintainability (temp 0.4): cluster-level sequencing, interlock handling, structure the follow-on so design-first work stays doable.

## Vantage targets (integrity note)
Depth-1 LEAF dispatch. All three seats are SIMULATED strategy-lens reasoning via inline `sequentialthinking`. No external `cli-*` binary and no `Task`/`Agent` sub-dispatch was invoked. Claims of "multi-AI" are NOT made — this is multi-LENS deliberation in one context.

## Evidence inputs (verified this run)
- `backlog/remediation-backlog.json` (per-item evidence/detail/fix_sketch/verify_proof2).
- Lane dispositions: L4, L6, L7, L9 (read); L1/L2/L3/L5/L8 (referenced).
- CURRENT-CODE spot-verification of: tri-123, tri-124, tri-142 (found CLOSED); tri-080, tri-104, tri-105, tri-106, tri-148, tri-010, tri-007/008/009, tri-011 (found OPEN); cli-offline-smoke.cjs, env-reference-drift.vitest.ts, flag-ceiling.vitest.ts, structural-indexer.ts, the two launcher .cjs files.

## Hard constraints (auto-reject gates)
1. PROMPT-SAFETY: replay-pool / telemetry work MUST NOT store raw prompts or reversible query prefixes. Any "store the query" design is auto-rejected unless hashed/non-reversible.
2. DAEMON-LIFECYCLE DELICACY: launcher/daemon changes (tri-148) are high-blast-radius (DB corrupted 3x historically from dual writers; code-index/advisor launchers EXIT on child SIGTERM). Front-proxy work = code-careful, design-first.
3. VERIFY-FIRST: every fix re-confirmed still-real before implementing, fresh-adversarially verified after, scoped-committed.
4. METHOD PALETTE: doc-only + safe code-small -> fenced `cli-opencode openai/gpt-5.5-fast --variant xhigh` (DO-NOT-COMMIT; orchestrator commits scoped). Storage/security/launcher -> hand-implemented or hard-fenced. Playbook validation -> MiMo `xiaomi/mimo-v2.5-pro --variant high`. Fable 5 RETIRED.
5. Branch `028-mcp-to-cli-tool-transition`; never main; scoped commits only.

## Convergence rule
`two-of-three-agree` on the load-bearing conclusions. Achieved 3/3 on: (a) close-027-with-follow-on, (b) :637 document-and-leave, (c) DO-NOW = doc-wave + tri-080 via fenced seats, storage/launcher/privacy NOT fenced.

## Known limitations
- Single round (no critique-round needed beyond the in-deliberation adversarial pass; 3/3 core agreement).
- v1.2 checksum-bearing `artifact_written` state rows require the node `persist-artifacts.cjs` lib; this scoped-write agent has no Bash, so state events cover the v1 required lifecycle minimum without fabricated checksums.
