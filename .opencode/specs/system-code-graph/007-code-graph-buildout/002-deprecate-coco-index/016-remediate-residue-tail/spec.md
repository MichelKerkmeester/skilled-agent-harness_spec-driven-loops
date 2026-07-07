---
title: "Feature Specification: Close the CocoIndex/rerank deprecation residue tail + record the completeness verdict [template:level_1/spec.md]"
description: "After an exhaustive verify-first sweep (correcting a shell-mangling grep bug that caused prior false-negatives), the 014 deprecation residue is provably closed except a 2-item live-doc tail. This packet fixes those 2, enumerates the deliberately-kept exceptions, and defers one cross-encoder-subsystem comment."
trigger_phrases:
  - "deprecation residue completeness verdict"
  - "coco ccc rerank residue tail closed"
  - "exhaustive residue sweep methodology"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/016-remediate-residue-tail"
    last_updated_at: "2026-05-25T16:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Fixed 2 residue-tail doc refs; recorded completeness verdict"
    next_safe_action: "Commit the residue-tail packet"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/README.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-residue-tail-001"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Close the CocoIndex/rerank deprecation residue tail + record the completeness verdict

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After packets `014-remediate-codegraph-naming` + `015-remediate-cross-surface-residue`, an exhaustive verify-first sweep was run to prove the 014 deprecation residue was fully closed (not just "a grep returned 0"). The sweep first exposed a recurring methodology bug — `-g '!...'` exclude globs built in an unquoted shell variable get mangled by zsh, silently breaking rg under `2>/dev/null` and producing false-negative "0 residue" results. With inline-quoted excludes + per-token greps, the true picture emerged: the deprecation residue is essentially closed, with only a 2-item live-doc tail referencing deleted artifacts.

### Purpose
Every live, non-frozen surface is free of references presenting a deleted CocoIndex / rerank-sidecar / ccc artifact as present or usable; the kept-exceptions are enumerated; the methodology bug is recorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep-loop-runtime/lib/deep-loop/README.md` — remove the "Rerank sidecar: `…/sidecar_ledger.py`" helper-list line (file confirmed deleted, `found:0`).
- `system-spec-kit/manual_testing_playbook.md` — reframe "CCC stubs / CCC trio" → "code_graph status/scan/verify handlers" (stale naming in a live test scenario).
- Record the completeness verdict + kept-exceptions (implementation-summary).

### Out of Scope (deliberately kept / deferred, each with a reason)
- **The live in-process memory-search rerank/MMR pipeline** (`cross-encoder.ts`, `reranker.ts`, `stage3-rerank.ts`, `mmr-reranker.ts`, etc.) — a separate LIVE subsystem (stage3 wired in the orchestrator), NOT 014 residue. Untouched.
- **`sidecar-client.ts:170` JSDoc** referencing the deleted `ensure-rerank-sidecar.cjs` / `SPECKIT_CROSS_ENCODER` — DEFERRED: it sits in the actively-evolving cross-encoder subsystem (a `027-xce-research-based-refinement` arc + a live allowlist entry), where editing risks colliding with in-flight work. Flagged for operator decision.
- **Accurate-history prose** (`embedder_pluggability.md` "⚠️ Obsolete as of 014" banner; `SKILL.md`/`embedder_architecture.md`/`registry.ts` "removed in 014" notes) — correct documentation of the removal; keep.
- **Frozen data** (`benchmarks/**`, `observability/smart-router-measurement-*.{jsonl,md}` with `labelSkill:"mcp-coco-index"`) — historical records; corrupting them falsifies measurements; keep.
- **Generated artifacts** (`scripts/.folder-list.txt`, `.scan-lines.txt`, etc. listing historical spec-folder names) — regenerate; keep.
- **cli-* `pkill ccc search`** orphan-sweep + **`F-AC3-*`/`409-fixture`** — documented operator exceptions; keep.
- **Legit "structural search"** prose (code-graph IS structural search) — keep.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md` | Modify | drop deleted `sidecar_ledger.py` helper line |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | "CCC stubs/trio" → code_graph handler names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both live-doc dead-path refs removed/reframed | `rg sidecar_ledger deep-loop/README.md` == 0; no "CCC stubs/trio" in the playbook scenario |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Kept-exceptions + deferred item documented | implementation-summary enumerates each keep/defer with a reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 2 tail items fixed; both reference live/real targets or are removed. ✅ ACHIEVED
- **SC-002**: Completeness verdict + kept-exceptions recorded for future sessions. ✅ ACHIEVED
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Touching the cross-encoder subsystem (027-evolving) | Med | DEFERRED sidecar-client.ts; only fixed pure-doc dead-path refs |
| Risk | Mis-classifying frozen/accurate-history as residue | Low | Each survivor classified with a named keep-reason, not silently excluded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the in-process cross-encoder (`cross-encoder.ts` + `SPECKIT_CROSS_ENCODER`) is dormant-dead vs conditionally-live is a SEPARATE dead-code question for the rerank pipeline — out of this deprecation-residue scope; operator may want a dedicated review.
<!-- /ANCHOR:questions -->
