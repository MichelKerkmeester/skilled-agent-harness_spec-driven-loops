---
title: "Implementation Plan: 113 z_archive memory indexing"
description: "Two-phase plan: un-exclude z_archive from EXCLUDED_FOR_MEMORY (W1, done) + propagate doc/test updates (W2-W4)."
trigger_phrases:
  - "113 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-z-archive-memory-indexing"
    last_updated_at: "2026-05-16T13:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan.md"
    next_safe_action: "Continue propagation in implementation-summary"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000113001"
      session_id: "113-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 113 z_archive memory indexing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language | TypeScript (mcp_server) + vitest |
| Author | Main agent edits + cli-devin SWE-1.6 deep-research |
| Storage | `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` |
| Testing | vitest tests/index-scope.vitest.ts + tests/full-spec-doc-indexing.vitest.ts |

### Overview

Remove `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY`. Decay multiplier 0.1 in `ARCHIVE_MULTIPLIERS` already handles deprioritization; the exclusion was redundant and overrode the decay design.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator clarified design intent (decay-not-exclusion)
- [x] Decay multiplier exists in `shared/scoring/folder-scoring.ts`

### Definition of Done
- [x] Source edit + rebuild dist
- [x] Re-run reindex (z_archive rows present)
- [x] Tests pass (159 across 2 files)
- [x] Doc propagation complete (12 surfaces updated)
- [x] SSOT section in `lib/utils/README.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source-of-truth: `EXCLUDED_FOR_MEMORY` defines scope-exclusion (binary); `ARCHIVE_MULTIPLIERS` defines scoring decay (multiplicative). Categories with a multiplier stay out of the exclusion list.

### Key Components
- `lib/utils/index-scope.ts` — scope-exclusion SSOT.
- `shared/scoring/folder-scoring.ts` — decay multipliers SSOT.
- `lib/parsing/memory-parser.ts:isMemoryFile()` — composes both.

### Data Flow
Scan walker → `shouldIndexForMemory(path)` → index. Search → `getArchiveMultiplier(path)` applies decay at scoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### W1 — Source fix (done, commit b062b12b4)
Remove z_archive from `EXCLUDED_FOR_MEMORY`. Rebuild dist. Re-run reindex (2618 z_archive rows now indexed).

### W2 — Deep-research propagation audit (done, commit 12302d853)
cli-devin SWE-1.6 5-iter loop converged with 0 new hits beyond Phase 1 baseline. `research/research.md` + `remediation-plan.tsv` synthesized.

### W3 — Apply remediation (done)
- W3.A: BREAKING tests fixed (commit 3909f8202)
- W3.B: STALE-INVARIANT docs updated (commit 296e64b2d)
- W3.C: STALE-DESCRIPTIVE drift fixes (commit aaf509797)
- W3.D: SSOT documentation gap fix (commit 58e3f3646)

### W4 — Verify
- 159 tests pass, 2618 z_archive rows indexed, decay 0.1 intact, packet 113 strict-validate PASS.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npx vitest run tests/index-scope.vitest.ts tests/full-spec-doc-indexing.vitest.ts` exits 0
- DB query: `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/z_archive/%'` returns ≥ 2618
- `getArchiveMultiplier('/foo/z_archive/bar')` returns 0.1
- `validate.sh --strict` on 113 packet exits 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 111 (026 cleanup remediation) — established the workflow pattern.
- cli-devin v1.0.4.1 recipe (deep-research iter).
- `ARCHIVE_MULTIPLIERS` decay system (pre-existing).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If z_archive indexing causes search regression: revert commit b062b12b4 (1-line restore) + run `cleanup-index-scope-violations.ts --apply` to remove the 2618 z_archive rows from memory_index. Tests + docs would also need revert (6 commits total).
<!-- /ANCHOR:rollback -->
