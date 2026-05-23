---
title: "Summary: 010/002 jina swap + reindex (PARTIAL — blocked on 010/004)"
description: "Operator runbook authored; actual swap blocked by writer cross-wiring gap discovered during execution. Deferred to 010/004 follow-on packet."
trigger_phrases:
  - "010/002 summary"
  - "jina swap partial"
  - "skill-graph architecture gap"
  - "010/004 follow-on"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex"
    last_updated_at: "2026-05-17T23:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "010/004 writer cross-wire shipped (c0ec765f4); 010/002 unblocked"
    next_safe_action: "Execute swap per runbook §Swap procedure (post-010/004 wiring shipped); restart daemon + verify"
    blockers: []
    key_files: ["evidence/swap-runbook.md", "../001-pluggable-architecture/review/review-report.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022002"
      session_id: "022-002-jina-swap-and-reindex-impl"
      parent_session_id: "022-002-jina-swap-and-reindex"
    completion_pct: 40
    open_questions:
      - "Should 010/004 wire writer to use NEW adapter exclusively, or keep dual-path for backward compat?"
    answered_questions:
      - "Q: Auto-promote or operator-driven? A: Operator-driven via explicit setActiveEmbedder() call (per spec.md §7)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 010/002 jina swap + reindex — PARTIAL (BLOCKED on 010/004)

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | UNBLOCKED 2026-05-18T00:18 (010/004 shipped at c0ec765f4; swap execution now possible — pending operator runbook execution) |
| Artifact | `evidence/swap-runbook.md` (~200 lines, comprehensive) |
| Owner | main agent (orig); next: operator executes runbook §"Swap procedure" |
| Blockers | RESOLVED — 010/004 writer cross-wiring shipped 2026-05-18 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

**Shipped:**
1. **Comprehensive operator runbook** at `evidence/swap-runbook.md`:
   - Architecture context explaining 010/001's parallel layer + half-wired state
   - Step-by-step swap procedure (assuming 010/004 ships)
   - Rollback procedure
   - Known architecture gap with explicit path forward via 010/004
2. **DB snapshot** at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite.snap-pre-jina-2026-05-17` (4KB, captured during 010/002 execution attempt)
3. **Architecture-gap discovery document** (this file's §"How It Was Delivered")

**Deferred (requires 010/004):**
- R1-R4 from spec.md §4 (active pointer set, reindex, smoke tests)
- vec_1024 table population
- Daemon restart verification
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Execution timeline (2026-05-17 evening, autonomous overnight):**

1. **Discovery phase**: Main agent attempted to execute 010/002 as scoped per spec. Killed 3 stale skill-advisor daemons (PIDs 86491, 60515, 52320). Snapshotted DB.

2. **Architecture mismatch surfaced**: Inspecting `skill-graph-db.ts` revealed:
   - Writer path (`refreshSkillEmbeddings`, line 769): still calls OLD `createEmbeddingsProvider()` factory + writes to legacy `skill_nodes.embedding` BLOB column
   - Reader path (`loadSkillEmbeddings`, line 838): NEW path via `vec_<active.dim>` when `hasActiveEmbedderPointer()` is true
   - OLD factory doesn't support Ollama provider — cannot produce jina-v3 vectors
   - Net: setting active pointer without writer cross-wiring leaves `vec_1024` empty → silent semantic-shadow degradation

3. **Independent confirmation**: E deep-review (concurrent with 010/002 execution) flagged the same defect:
   - P1-1 (regression-risk, iter 3): "active embedder pointer switches reads to vec tables while refresh still writes legacy embeddings"
   - P2-11 (documentation-alignment, iter 8): "docs claim env-var embedder swap but implementation only selects active embedder from vec_metadata"
   - Two reviewers, two perspectives, same finding → high signal

4. **Decision to defer execution**: Given (a) the architectural gap requires modifying load-bearing `skill-graph-db.ts:refreshSkillEmbeddings`, (b) the user requested autonomous-safe overnight execution, (c) the cross-wiring needs its own deep-review per post-implementation mandate, (d) the existing E review recommended Option (c) [SIMPLEST]: operator-discipline approach — main agent chose to ship the runbook + analysis + scaffold 010/004 follow-on instead of attempting risky load-bearing refactor unsupervised.

5. **Runbook authoring**: Comprehensive 200-line operator runbook authored documenting the architectural state, the safe swap procedure (post-010/004), rollback, and cross-references.

**Wall time**: ~30 min (discovery → runbook → commit).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- **D1**: Defer actual swap execution to 010/004 follow-on packet.
  - Rationale: writer cross-wiring requires load-bearing refactor of skill-graph-db.ts; not safe for autonomous execution without prior deep-review
  - Alternative considered: attempt the refactor + smoke-test in autonomous mode — rejected as too risky per state doc's "If you hit a blocker... DOCUMENT it" guidance
  - Confirmation: E review P1-1 Option (c) [SIMPLEST] explicitly recommends operator-discipline approach

- **D2**: Ship comprehensive runbook anyway, even though swap execution deferred.
  - Rationale: 010/004 implementation will need this exact runbook; authoring it now reduces 010/004 scope to "refactor + verify against runbook" instead of "refactor + design swap procedure"
  - Side benefit: documents the architectural gap for future reviewers

- **D3**: Snapshot the DB even though no destructive write occurred.
  - Rationale: snapshot is rollback insurance for 010/004 execution; cheaper to keep than to recreate (4KB)
  - Verified MD5: `504cdc8dd8cbdb209121d9032a78eabe` matches live DB at decision time (no destructive change confirmed)

- **D4**: Operator-driven swap (no auto-promote) per 010/002 spec.md §7 — retained.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Item | Result |
|---|---|
| `evidence/swap-runbook.md` exists + ≥150 lines | ✅ (~200 lines) |
| DB snapshot captured at expected path | ✅ |
| Architecture-gap documented with file:line evidence | ✅ (runbook §"Architecture Context") |
| 010/004 follow-on path described | ✅ (runbook §"Known Architecture Gap") |
| Cross-reference to E review P1-1 + P2-11 | ✅ (runbook §"Cross-references") |
| Strict-validate | (pending — see post-commit step) |

Items NOT verified (deferred to 010/004 + then runbook execution):
- R1: active pointer = jina-embeddings-v3 (DEFERRED)
- R2: reindex success + row count preserved (DEFERRED)
- R3: semantic-shadow non-empty top-3 (DEFERRED)
- R4: `skill_advisor.py recommend` includes expected skills (DEFERRED)
- R5: regression test suite passes (N/A — no code change in this packet)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Swap NOT executed**: Active embedder remains at default (gemma baseline). vec_1024 table not created. No production behavioral change in this packet.

2. **010/004 required**: The complete swap requires the writer cross-wiring refactor. 010/004 should:
   - Modify `refreshSkillEmbeddings()` to use `getAdapter(active.name)` from new layer when `hasActiveEmbedderPointer()` is true
   - Add round-trip integration test
   - Run post-implementation deep-review (5-iter — single-commit tier per `post-implementation-deep-review.md`)

3. **Snapshot age**: The snapshot at `database/skill-graph.sqlite.snap-pre-jina-2026-05-17` will become stale if the DB schema changes before 010/004 ships. 010/004 should re-snapshot before executing the swap.

4. **Documentation-vs-implementation gap (P2-11)**: 010/002 spec.md §3 originally claimed operator runbook would "stop daemon, set env var or call setActiveEmbedder...". This implementation-summary corrects the env-var path (NOT supported by the OLD factory architecture). Future spec revisions should align with the runbook.
<!-- /ANCHOR:limitations -->
