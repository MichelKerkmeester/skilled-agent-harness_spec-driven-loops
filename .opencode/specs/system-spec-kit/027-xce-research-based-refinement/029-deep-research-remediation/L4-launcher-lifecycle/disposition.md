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

## Code queue (open)
| Finding | One-line | Class |
|---|---|---|
| tri-030 | code-index lease lacks socketPath (bridge recomputes and can diverge) | code-small |
| tri-032 | code-index owner lease never heartbeats (single post-spawn refresh; ttl×2 reclaim) | code-small |
| tri-043 | bridge divergent-socket guard starved of lease socketPath | code-small (with tri-030) |
| tri-045 | playbook file-count self-check misses broken links/orphans | code-small |
| tri-110 | launcher marker path honors MEMORY_DB_PATH only; daemon honors SPEC_KIT_DB_DIR first | code-small |
| tri-148 | code-index owner inherits stdio + exits with child — no front-proxy/transparent recycle (spec-memory parity) | code-careful |

Note: the spec-memory single-writer DB lock module (lib/search/db-instance-lock.ts) is reusable for the mirrored code-graph dual-writer hazard recorded in the L1 disposition; natural companion to tri-148 work.
