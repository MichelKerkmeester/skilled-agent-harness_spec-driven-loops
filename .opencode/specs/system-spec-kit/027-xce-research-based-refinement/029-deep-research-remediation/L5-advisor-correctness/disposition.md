---
title: "L5 Advisor Correctness — Disposition"
description: "Verified 35/35 still-real; 16 closed (12 docs + corpus-scorer root fix, tool-named trust rejections, CLI/daemon trust-predicate alignment, server-side requiredAction). The code queue carries the routing/freshness/eval-integrity items, headed by the explicit-name misroute and substring-alias matchers."
trigger_phrases:
  - "L5 advisor disposition"
  - "advisor routing code queue"
importance_tier: "normal"
contextType: "implementation"
---
# L5 Advisor Correctness — Disposition

Batch verification 35/35 STILL-REAL (`../verify/l5-still-real-partA.md`, `partB.md`); 16 findings CLOSED (verdict `../verify/l5-batch-verdict.md`).

## Code queue (open)
Code-small: tri-034 (substring alias match), tri-035 (V2 generated_at invisible to age haircut), tri-037 (singular brief on near-tie), tri-038 (lane-weight envs stripped by launcher allowlist), tri-086 (init helper refreshes runtime-ignored JSON), tri-088 (Claude hook timeout knob bypassed), tri-089 (OpenCode bridge renderer lacks ambiguous branch), tri-098 (CLI command-count drift), tri-168 (recommend shadow-sink), tri-172 (validate lacks freshness checks), tri-174 (python ambiguity confidence-only).
Code-careful: tri-033 (explicit-name misroute on local path), tri-036 (no runtime freshness refresh), tri-040/tri-041 (corrupt-DB status/rebuild honesty — interlocked), tri-083 (local/native parity gate; land after tri-033/034), tri-156 (code-graph tool exposure seam), tri-173 (validate corpus has no real-session source), tri-180 (metrics schema).
tri-138 deferred pending consumer-aware design (memory_health budget enforcement; doctor flows read data.routing).
