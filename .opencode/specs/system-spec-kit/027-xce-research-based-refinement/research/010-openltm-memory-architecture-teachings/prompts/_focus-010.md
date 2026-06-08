
# YOUR NARROW FOCUS — iteration 010 of 10: learn() idempotency + cross-plugin write contract
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/db.ts` — the `learn()` function: `dedup_key` (normalized content hash), `created` vs `reinforced` actions, `confirm_count` reinforcement
- `packages/openltm-core/src/queue/` and `src/__tests__/writeQueue.test.ts` — write serialization
- `packages/adapter-opencode/src/`, `packages/adapter-pi/src/` — cross-runtime adapters
- `docs/internal/PRD.md`, `docs/internal/ROADMAP.md` — the Phase-5 cross-plugin stable write surface / contract vision
Focus on: idempotent learn (reinforce-vs-create via dedup_key + confirm_count) and the cross-plugin write-contract direction. Contrast with our memory_save + 37-tool MCP surface. Is reinforce-vs-create idempotency + a stable cross-tool write contract a genuine delta for us?
