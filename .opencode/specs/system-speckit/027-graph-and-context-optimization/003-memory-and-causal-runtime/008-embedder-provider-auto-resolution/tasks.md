---
title: "Tasks: Robust embedding-provider auto-resolution (ollama-first)"
description: "Research tasks (done) plus the deferred implementation tasks for the (b)+(d) portable fix to EMBEDDINGS_PROVIDER=auto."
trigger_phrases:
  - "embedder provider auto resolution tasks"
  - "research tasks deferred implementation tasks embedder"
  - "factory probe better-sqlite3 regression task"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/008-embedder-provider-auto-resolution"
    last_updated_at: "2026-05-27T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-tasks-research-done-implementation-deferred"
    next_safe_action: "track-deferred-implementation-tasks-in-follow-on-packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000208"
      session_id: "embedder-auto-resolution-008"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Root cause: sqlite3 PATH dependency in querySqliteScalar swallows ENOENT to null"
      - "Ranked portable fix: (b) better-sqlite3 read + (d) generic active_embedder_provider"
---
# Tasks: Robust embedding-provider auto-resolution (ollama-first)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Research-phase work (DONE in this packet).

- [x] T001 Dispatch cli-codex gpt-5.5 high read-only investigation of the `auto` cascade (`shared/embeddings/factory.ts`)
- [x] T002 Verify root cause with `file:line` evidence — sqlite3 PATH dependency in `querySqliteScalar` returns null on ENOENT (`factory.ts:284`)
- [x] T003 Disprove the package-root hypothesis — `resolveSpecKitPackageRoot()` resolves correctly (`research/research.md` §4)
- [x] T004 [P] Rank candidate fixes by robustness + portability (`research/research.md` §5)
- [x] T005 Synthesize findings + recommendation + verification into `research/research.md`


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> DEFERRED — follow-on packet, NOT done here.

- [ ] T006 Replace `execFileSync('sqlite3', …)` metadata probe with a `better-sqlite3` read (`shared/embeddings/factory.ts:284`)
- [ ] T007 Reuse `shared/paths.ts` db-dir resolution for canonical DB path (`shared/paths.ts:71`)
- [ ] T008 Honor `active_embedder_provider` generically; build shard path from provider/model/dim (`mcp_server/lib/embedders/schema.ts:48`, `factory.ts:385`)
- [ ] T009 Add regression test simulating a daemon `PATH` without `sqlite3`
- [ ] T010 Revert interim `EMBEDDINGS_PROVIDER=ollama` config pin to `auto` (launcher / MCP config)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> DEFERRED — follow-on packet.

- [ ] T011 Launch with `EMBEDDINGS_PROVIDER=auto`, PATH excluding `/usr/bin`, no DB env
- [ ] T012 Confirm `memory_health.embeddingProvider.provider === "ollama"`
- [ ] T013 Confirm active shard resolves to `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`
- [ ] T014 Confirm non-ollama hosts still cascade via `auto-select.ts:476` (portability)


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 1 research tasks marked `[x]` (research deliverable shipped in `research/research.md`)
- [ ] Phase 2/3 implementation + verification tasks intentionally deferred to a follow-on packet
- [x] No `[B]` blocked tasks remaining


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research deliverable**: See `research/research.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
