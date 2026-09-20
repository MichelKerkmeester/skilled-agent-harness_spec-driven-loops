---
title: "Implementation Plan: sk-design reference inventory and dependency map"
description: "Approach: repo-wide rg sweeps, bucket classification, authoritative map artifact, reviewer reconciliation."
trigger_phrases:
  - "sk-design inventory plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/001-inventory-and-dependency-map"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored plan for read-only inventory"
    next_safe_action: "Dispatch cli-devin to produce dependency-map.md"
    blockers: []
    key_files:
      - "dependency-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: sk-design reference inventory and dependency map

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run repository-wide `rg` sweeps for the reference tokens, bucket every hit, and emit `dependency-map.md`. This is a discovery artifact: no referenced file is touched. The map is the single source of truth phases 002-006 execute against, so it must be exhaustive and reviewer-reconcilable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** the reference tokens and bucket rules are fixed in `spec.md §3`.
- **Done:** every hit classified; live-contract paths carry actions; counts reconcile against a fresh `rg` total; `git status` shows only this packet folder changed; `validate.sh --strict` on this folder exits 0 or 1.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Tooling** | `rg` (ripgrep), `git status` |
| **Output** | `dependency-map.md` (classification table + per-bucket counts + live-contract action list) |
| **Buckets** | live-contract / frozen-evidence / generated-artifact / to-extract / to-delete |
| **Directory heuristics** | `**/benchmark/reports/**` + `**/fixtures/sk-design*` + `specs/**` → frozen; `.opencode/bin/lib/compiled-routing/**` + advisor `skill-graph.json`/corpus → generated; `sk-design/sk-design-md-generator/**` + `sk-design/styles/**` → to-extract; `sk-design/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,sk-design-interface/**,shared/**}` → to-delete; other shipping/runtime-read refs → live-contract |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Sweep

Run and capture counts for the five token sweeps; record totals as the reconciliation baseline.

### Phase 2: Classify

Assign each hit to exactly one bucket using the directory heuristics above.

### Phase 3: Emit and reconcile

Write `dependency-map.md`; confirm the bucket-count sum reconciles with the fresh `rg` total (documenting any multi-token overlap); confirm `git status` shows only this packet folder touched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Reviewer re-runs `rg -c` for each token and diffs the totals against the map's per-bucket counts. Spot-check five entries in each of frozen-evidence and generated-artifact to confirm none is a mislabeled live contract. `git status` proves read-only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `rg` available on PATH (confirmed in earlier recon).
- No upstream phase; downstream 002-006 depend on this map.
- Executor: `cli-devin` running `gemini-3-7-flash-high` (fallback `glm-5-2`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Read-only phase. Rollback is `git checkout -- specs/sk-design/016-deprecate-sk-design-interface/001-inventory-and-dependency-map/`. No referenced file is at risk.
<!-- /ANCHOR:rollback -->
