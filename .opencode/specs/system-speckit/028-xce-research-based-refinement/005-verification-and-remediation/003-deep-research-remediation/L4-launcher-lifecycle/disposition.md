---
title: "L4 Launcher Lifecycle — Disposition"
description: "Docs reconciled with shipped launcher code (10/10 incl. duplicates); the code parity queue remains: lease socketPath/heartbeat for code-index, marker-path env divergence, playbook link check, and the front-proxy/recycle parity that is the lane's one code-careful."
trigger_phrases:
  - "L4 launcher disposition"
  - "launcher parity queue"
importance_tier: "normal"
contextType: "implementation"
---
# L4 Launcher Lifecycle — Disposition

Batch verification: 15/15 STILL-REAL (`../verify/fable-verify-l4-batch-report.md`). Doc half CLOSED 10/10 (verdict `../verify/l3-l4-batch-verdict.md`, two narrow residuals fixed in-commit).

## Launcher-parity cluster — SHIPPED + verified CLOSED 4/4

tri-030/tri-032/tri-043/tri-110 closed as one packet (verdict `../verify/l4-cluster-verdict.md`, 29/29 tests): both code-index leases now record the owner-env socket path and thread it to the bridge (null degrades to the legacy recompute; foreign-uid legacy leases never surface a socket); the owner lease heartbeats at ttl/2 under the repointed child pid and stops — never fights — a superseding reclaim; the spec-memory launcher's unclean-shutdown marker mirrors the layer that actually writes it (raw MEMORY_DB_PATH first, then dir overrides resolved against root). Verifier follow-on on record: core/config.ts carries an inverted dir/file precedence that does not feed the marker path — candidate for a precedence-unification pass.

## Code queue (open)
| Finding | One-line | Class |
|---|---|---|
| tri-148 | code-index owner inherits stdio + exits with child — no front-proxy/transparent recycle (spec-memory parity) | code-careful |

tri-045 CLOSED (verdict `../verify/code-wave2-verdict.md`): the deterministic check now proves root-index linkage and gates orphans on a mutation-tested ratchet baseline (85, may only go down) — the prior zero-orphans claim was false against 85 real orphans and one dead link.

Note: the spec-memory single-writer DB lock module (lib/search/db-instance-lock.ts) is reusable for the mirrored code-graph dual-writer hazard recorded in the L1 disposition; natural companion to tri-148 work.
