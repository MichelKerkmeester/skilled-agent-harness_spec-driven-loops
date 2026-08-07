---
title: "L3 Idempotency Flag-ON — Disposition"
description: "Lane CLOSED 5/5: force-aware receipt keys, honest store-race conflict semantics mirrored across save/update, receipt TTL sweep, and the replay-claim doc caveat. Deferred by design: replay-time validity for receipts pointing at deleted memories."
trigger_phrases:
  - "L3 idempotency disposition"
  - "receipt key trio disposition"
importance_tier: "normal"
contextType: "implementation"
---
# L3 Idempotency Flag-ON — Disposition

All five findings closed (batch report `../verify/fable-verify-l3-batch-report.md`; fix verdict `../verify/l3-l4-batch-verdict.md`). The interlocked trio (key composition, save store-race, update store-race) shipped as one unit; the TTL sweep and the replay doc caveat rode the same wave. Semantics decision on record: a different-payload store-race loser returns its own response with a visible conflict block — error and winner-replay would both lie, and post-mutation rollback was rejected as the dangerous non-option.

Deferred by design (recorded in the verdict): replay-time validity when a receipt's memory was deleted — design it consistently with the conflict semantics; the TTL sweep bounds the exposure window meanwhile.
