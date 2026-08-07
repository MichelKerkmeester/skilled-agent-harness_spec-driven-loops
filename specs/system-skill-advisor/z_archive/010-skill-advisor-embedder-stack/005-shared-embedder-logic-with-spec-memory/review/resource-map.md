---
title: "Resource Map: 003/006 Deep Review"
description: "Files reviewed and findings cross-reference for the deep-review of phase 003/006."
trigger_phrases:
  - "003/006 deep-review resource map"
importance_tier: "normal"
contextType: "review"
---

# Resource Map: 003/006 Deep Review

## Source Files Reviewed

### Shared host (new)
- `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts` — clean
- `.opencode/skills/system-spec-kit/shared/embeddings/types.ts` — clean
- `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` — clean
- `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` — clean
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` — P2-2 (contentType doc-only)

### mk-spec-memory re-export shims (clean)
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts`

### Skill-advisor re-export shims (clean)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts`

### Skill-advisor cascade integration
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — **P1-3** (hardcoded provider), **P2-1** (double-persist), **P2-4** (unused testable export)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts` — **P2-3** (barrel preamble incomplete)
- `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` (lines 230-307) — clean

### Skill-graph writer dispatcher (clean, predecessor phase 004)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` (lines 780-1003)

### Tests
- `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` — clean (5 cases, all pass)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts` — clean
- `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` — clean
- **Missing: `shared-factory-parity.vitest.ts`** — **P1-1**

### Documentation
- `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` (§12 all subsections) — **P1-2** (line 414 cascade ordering contradicts §12.1)
- `.opencode/skills/system-skill-advisor/README.md` (pluggable-layer subsection) — **P2-5** (signature parity)

### Packet docs
- `spec.md` — REQ-006 + §3 Files-to-Change entries un-delivered (linked to **P1-1**)
- `plan.md` — Phase B step 6 un-delivered (linked to **P1-1**)
- `tasks.md` — T011 unchecked (linked to **P1-1**)
- `implementation-summary.md` — silently omits T011/REQ-006, `completion_pct: 95` (linked to **P1-1**)

## Findings Index

| ID | Severity | Anchor file | Anchor line |
|---|---|---|---|
| P1-1 | Required | `spec.md` / `tasks.md` / `plan.md` / `implementation-summary.md` | 107 / 59 / 80 / "What Was Built" |
| P1-2 | Required | `INSTALL_GUIDE.md` | 414 |
| P1-3 | Required | `schema.ts` | 217 |
| P2-1 | Suggestion | `schema.ts` | 227-239 |
| P2-2 | Suggestion | `auto-select.ts` | 56-72 |
| P2-3 | Suggestion | `index.ts` | 1-12 |
| P2-4 | Suggestion | `schema.ts` | 244-247 |
| P2-5 | Suggestion | `README.md` | 222 |

## External References

- ADR-014 (local-first cascade) — referenced in `auto-select.ts:481` + `INSTALL_GUIDE.md §12.1`
- Phase 007 (llama-cpp purge in mk-spec-memory) — predecessor to this packet's purge propagation
- Phase 004 (writer cross-wire in skill-advisor) — predecessor to this packet's `'auto'` default flip
- FOLLOW-UPS #1 (shared factory) — closed by this packet
- FOLLOW-UPS #2 (production active pointer) — partially closed (live smoke remains)
- FOLLOW-UPS #4 (docs parity with mk-spec-memory) — partially in scope; INSTALL_GUIDE §12 rewrite addresses claim drift but P1-2 + P1-3 + P2-5 surface residual gaps
