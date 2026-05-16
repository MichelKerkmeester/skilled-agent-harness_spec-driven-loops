---
title: "107: 026 restructure execution — Wave 1 (council-approved reduced variant)"
description: "Execute the council-approved first wave of the 026 restructure: 4 top-level renames + 7 PROCEED merges + 8 CONTAINED deletes + 28 DEEP archives + parent-doc rewrites + index refresh. Sources: 999 resource-map.md + council-review.md."
trigger_phrases:
  - "107 spec"
  - "026 restructure wave 1"
  - "execute 026 renames"
  - "council-approved reduced variant"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/107-026-restructure-execution-wave-1"
    last_updated_at: "2026-05-16T06:51:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 107"
    next_safe_action: "Execute Wave 1 renames"
    blockers: []
    key_files:
      - "999-spec-026-restructure-research/resource-map.md"
      - "999-spec-026-restructure-research/research/council-review.md"
    session_dedup:
      fingerprint: "sha256:b8e7a6c5d4f3e2c1a0b9e8d7c6f5a4b3e2d1c0a9b8c7d6e5f4a3b2c1d0e9f8a7"
      session_id: "107-spec"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Recovery baseline: 052558f1b370e6a4c51f2e8845f414c015e0e476"
      - "Council verdict: REVISE_BEFORE_EXECUTING; revised resource-map authored 2026-05-16; reduced variant ready for execution"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 107: 026 restructure execution — Wave 1

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Driver** | 999-spec-026-restructure-research/resource-map.md (post-council 2026-05-16) |
| **Recovery baseline** | `052558f1b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 999 packet's 50-iter deep-research + multi-AI council review produced a reduced first-wave restructure scope (4 renames + 7 merges + 8 deletes + 28 archives + 3 parent-doc rewrites + 3 index refreshes). Council verdict: execute this reduced variant now; defer LOW_PRIORITY / REDESIGN / blocked items to follow-on packets.

### Purpose

Execute the council-approved first wave on `main` with per-operation immediate commit and per-wave recovery baseline. Achieve ~40% effort savings while capturing ~75% of recall benefit (council estimate).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

5 waves per resource-map.md §4 migration plan:

- **Wave 1**: 4 top-level renames (mechanical `git mv` + graph-metadata.json updates)
- **Wave 2**: 7 PROCEED merges (M2, M3, M4, M5, M6, M7, M11) per resource-map §3.3 — primarily deepseek-v4-pro via cli-opencode
- **Wave 3**: 8 CONTAINED deletes + 28 DEEP archives (mechanical `rm -rf` / `git mv`)
- **Wave 4**: 3 parent-doc rewrites — atomic group (`026/spec.md`, `026/resource-map.md`, `026/graph-metadata.json`)
- **Wave 5**: 3 index refreshes (cocoindex re-scan + memory_index_scan + strict-validate sweep)

### Out of Scope

- M1, M8, M9, M10 deferred merges (LOW_PRIORITY / BLOCKED per council)
- 18 SHALLOW + MEDIUM deletes (require per-packet ref-count proof; deferred to follow-on)
- 008-skill-advisor internal phase restructuring (out of scope per iter 038/042)
- Phase lifecycle governance tooling (iter 047; follow-on packet)
- 999 packet deletion (handled separately after this packet ships)
- iter 029 orphan-detection re-dispatch (post-execution monitoring)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | All 4 renames complete with strict-validate exit 0 on each renamed packet |
| REQ-002 | All 7 PROCEED merges complete with per-merge commit + strict-validate exit 0 |
| REQ-003 | All 8 CONTAINED packets deleted; zero external references remain |
| REQ-004 | All 28 DEEP packets archived to `z_archive/`; read-access preserved |
| REQ-005 | 3 parent-doc rewrites commit atomically with strict-validate exit 0 on 026 phase parent |
| REQ-006 | Index refreshes complete with cocoindex coverage + memory_index_scan return |
| REQ-007 | Per-wave HEAD baseline captured before each wave for rollback |
| REQ-008 | Sample queries from resource-map §5.1 return expected results post-execution |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 waves complete on `main` with per-operation lineage
- 026 phase parent strict-validate exits 0 post-Wave-4
- Sample queries (resource-map §5.1) return expected results
- No load-bearing context lost (DEEP-archived packets remain readable)
- 107 packet's own strict-validate exits 0 with implementation-summary backfilled
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Rename breaks downstream graph-metadata `depends_on` references | Medium | Medium | grep for old paths after each rename; update referencing files in same commit |
| Wave 2 merge commits scattered partial content | Low | High | Per-merge atomic group: content union + source removal + graph-metadata update + ref cleanup commit together |
| CONTAINED delete drops live reference not caught by iter 048 | Low | Medium | Re-grep before delete; if hits > 0 outside z_archive + 999, abort delete |
| DEEP archive `z_archive/` path conflicts | Low | Low | Create `z_archive/{wave-1}/` subdir scoped to this wave |
| cli-opencode deepseek-v4-pro dispatch fails | Medium | Medium | Fall back to cli-devin (DeepSeek v4) per implementation-dispatch.md; last resort SWE-1.6 with smaller scoped ops |

### Dependencies

- 999 resource-map.md (revised post-council 2026-05-16)
- 999 research/council-review.md (verdict + adjustments)
- 999 implementation-dispatch.md (executor ladder)
- HEAD baseline: `052558f1b`
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Atomicity**: each merge / parent-doc-rewrite is its own atomic commit. Half-applied state must be impossible.
- **Reversibility**: per-wave HEAD baseline captured before each wave; `git reset --hard <baseline>` on failure
- **Performance**: total wall-clock ~2-4 hours autonomous
- **Cost**: ~$0.50-2.00 in cli-opencode dispatches for the 7 merges + 3 parent-doc rewrites
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Empty z_archive/ subdir**: create if missing on first archive operation
- **Symlink chase**: `git mv` follows symlinks; verify with `git ls-files --stage` post-move
- **graph-metadata.json with stale `manual.depends_on`**: each rename updates ALL referencing files in the same commit
- **CocoIndex daemon offline**: Wave 5 fails gracefully; mark `cocoindex_refresh: skipped` and capture for follow-on
- **Strict-validate warning on 999's research.md**: pre-existing strict-mode false positive (citations exist but in non-standard anchor format); not introduced by this packet
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should 010-template-levels parent be retained for templates 001/002/003 even after children 005/006/009 rehome (M8/M9 deferred)? Resource-map answer: yes, retain.
- Should 015 be renamed to 015-tanstack-security-audit (Wave 1 rename) or absorbed into 000 as nested (Wave 2 M10 deferred)? Resource-map answer: rename in W1, defer absorb.
- Should iter 029 orphan-detection be re-dispatched as part of this packet or follow-on? Resource-map answer: post-execution monitoring (out of W1 scope).
<!-- /ANCHOR:questions -->
