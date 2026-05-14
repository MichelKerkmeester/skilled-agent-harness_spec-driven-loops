---
title: "Implementation Plan: Move advisor source DB and tests"
description: "Physically relocate advisor source tree + skill-graph SQLite to system-skill-advisor/mcp_server/; rewrite imports + DB resolver + vitest config; keep MCP tool ids stable."
trigger_phrases:
  - "advisor source move plan"
  - "015/009/003 plan"
  - "physical extraction phases"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/003-move-advisor-source-db-and-tests"
    last_updated_at: "2026-05-14T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Plan authored"
    next_safe_action: "Author tasks"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-move-advisor-source-db-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Move advisor source DB and tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | MCP server (spec_kit_memory) + Vitest |
| **Storage** | SQLite (skill-graph.sqlite) + filesystem |
| **Testing** | Vitest skill_advisor suite |

### Overview
Three-phase physical move: pre-move inventory, batched source move with import rewrites, post-move validation. The MCP server registration stays inside `spec_kit_memory`; only module paths change. DB path resolver gets an env override for tests + future child-004 launcher reuse.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `tsc --noEmit` from `system-spec-kit/mcp_server/` exit-0.
- Vitest skill_advisor parity ≤ 3 failures (down from 4 post-002).
- `git status` shows the move pattern (renames + a small set of edits), no surprise unrelated mutations.
- `grep -rl "system-spec-kit/mcp_server/skill_advisor" .opencode/` returns only historical doc references in spec packets, not live code.
- DB at NEW path is the only active write target (process `lsof` style check or simple file mtime after `advisor_recommend` call).
- Strict-validate green at 003 + 015/009 + 015.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The move is mechanical, not architectural. ADR-001 (015/009/001) already locked the destination shape; this packet executes step 2 of the locked 5-phase migration sequence.

Two judgment calls during the move:
1. **DB path resolver env override** (REQ-007): add `SYSTEM_SKILL_ADVISOR_DB_DIR` as an opt-in. Default remains `<skill-folder>/mcp_server/database/skill-graph.sqlite`. Lets tests run in tmpdir and lets child 004's standalone launcher inject a custom dir.
2. **tsconfig strategy**: new `system-skill-advisor/mcp_server/tsconfig.json` `extends` the spec-kit tsconfig until child 004 splits the build. Keeps path mappings shared, avoids a second `node_modules` install for this packet.

Bench files (`code-graph-parse-latency.bench.ts`, `code-graph-query-latency.bench.ts`) currently live under `skill_advisor/bench/` even though they target code-graph; they relocate with the rest of the tree for this packet. A later cleanup may move them under system-code-graph but that's out of scope here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `system-spec-kit/mcp_server/skill_advisor/**` | Removed (via `git mv`) |
| `system-skill-advisor/mcp_server/**` | Receives source tree |
| `system-spec-kit/mcp_server/database/skill-graph.sqlite{,-shm,-wal}` | Moved to skill folder |
| `system-spec-kit/mcp_server/src/context-server.ts` | Advisor handler import paths rewritten |
| `system-spec-kit/mcp_server/tsconfig.json` | May lose advisor includes |
| `system-skill-advisor/mcp_server/tsconfig.json` | New (extends spec-kit) |
| `system-skill-advisor/mcp_server/vitest.config.*` | New (covers moved tests) |
| `system-skill-advisor/mcp_server/README.md` | Stub updated to reflect landed content |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1 — Pre-move inventory
- Snapshot file list under `skill_advisor/` (excluding `data/shadow-deltas.jsonl` which vitest regenerates).
- Capture the import graph: every file in `skill_advisor/` that imports a sibling, every file outside `skill_advisor/` that imports something inside it.
- List all test fixture paths that hardcode `skill_advisor/`.
- Save the inventory to `scratch/pre-move-inventory.json` (gitignored).

### Phase 2 — Batched move + import rewrite
- Move handlers + lib + tools + schemas (largest dependency cluster) in one batch; rewrite imports inside the moved files; typecheck.
- Move scripts + compat + tests + bench + data in second batch; rewrite imports; typecheck.
- Move DB files (skill-graph.sqlite + -shm + -wal) atomically.
- Rewrite `context-server.ts` advisor handler imports (last cross-tree edit).
- Author the new `system-skill-advisor/mcp_server/tsconfig.json` + `vitest.config.*`.
- Add `SYSTEM_SKILL_ADVISOR_DB_DIR` env override to the DB path resolver.

### Phase 3 — Validation
- `npm run typecheck` from `system-spec-kit/mcp_server/` (the still-registering server).
- `npx vitest run skill_advisor` — confirm parity ≤ 3.
- Smoke: start `spec_kit_memory` MCP server, call `advisor_recommend`, verify shape.
- Grep sweep: no live code outside packet docs references the old `skill_advisor/` path.
- Strict-validate 003 + 015/009 + 015.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- **Unit**: existing vitest skill_advisor suite is the regression gate. Parity must improve from 4 failures to ≤ 3.
- **Integration**: MCP `advisor_recommend` smoke against the running server. New env-override test confirms `SYSTEM_SKILL_ADVISOR_DB_DIR` is honored.
- **Path-discipline**: grep-based test (or shell check) ensuring no live `*.ts` file references the old `skill_advisor/` prefix.
- **DB-isolation**: after move, run `advisor_recommend` and confirm the NEW SQLite file's mtime advanced; the OLD path's file is absent.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- 015/009/001 ADR-001 (shipped 07c612f8a) — locks shape.
- 015/009/002 scaffold (shipped 004c4f2cc) — provides destination skill folder.
- spec_kit_memory MCP server build (`npm run build`) — must succeed after the move so child 004 can take over registration.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

`git reset --hard <pre-move-commit>` is the rollback contract because the move is atomic within a single commit. If the commit is already pushed, revert via `git revert <move-commit>` rather than reset. DB files are large enough that we avoid keeping a `.bak` copy — git history is the recovery path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (inventory) ──> Phase 2 (move + rewrite) ──> Phase 3 (validate)
                                  │
                                  └── batch 1 (handlers/lib/tools/schemas)
                                  └── batch 2 (scripts/compat/tests/bench/data)
                                  └── batch 3 (DB files)
                                  └── batch 4 (context-server.ts + tsconfig + vitest config)
```

Each batch in Phase 2 must complete + typecheck-clean before the next batch starts; partial state is not stable.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Item | Estimate |
|------|----------|
| Phase 1 inventory | 5-10 min |
| Phase 2 batched move | 30-60 min wall (cli-codex gpt-5.5 high) |
| Phase 3 validation | 10-15 min |
| **Total** | **45-85 min** for cli-codex dispatch |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If Phase 2 batch 1 typecheck fails:
- Hard reset to pre-move commit.
- Re-read the batch's import rewrites, identify the broken path, retry.

If Phase 2 batch 3 (DB move) fails mid-way (some files moved, some not):
- Move the remaining files manually; do not commit partial state.
- If recovery is unclear, restore from `git status -u` + `mv` the moved files back.

If Phase 3 vitest regression: parity gets worse (e.g., 4 → 5+):
- Diagnose with the failure list before reverting.
- Most likely cause: missing import rewrite. Fix forward rather than reverting.
<!-- /ANCHOR:enhanced-rollback -->
