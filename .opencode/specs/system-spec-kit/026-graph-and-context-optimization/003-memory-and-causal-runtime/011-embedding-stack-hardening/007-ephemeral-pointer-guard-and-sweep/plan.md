---
title: "Implementation Plan: Ephemeral-pointer guard + comprehensive comment sweep"
description: "Build a precise dependency-free comment guard for sk-code §4, then sweep the whole tree guard-clean via parallel batches, verified by build + zero dist drift + whole-tree guard run."
trigger_phrases:
  - "ephemeral pointer guard sweep plan"
  - "comment lint guard implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep"
    last_updated_at: "2026-05-29T21:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Guard built + tree swept to 0"
    next_safe_action: "Commit"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/scripts/validation/ephemeral-pointer-audit.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003172"
      session_id: "031-007-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Ephemeral-pointer guard + comprehensive comment sweep

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM guard (stdlib only); TypeScript + CJS + Python comment edits |
| **Framework** | system-spec-kit; sk-code §4 is the rule source |
| **Storage** | None |
| **Testing** | the guard itself (BAD/GOOD fixture + whole-tree run → 0), `npm run build`, `node --check`, zero dist drift |

### Overview
Author a precise comment-region detector, tune out false positives, then drive a comment-only sweep to guard-clean. The guard is both the implementation tool and the acceptance test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] sk-code §4 allowed-vs-forbidden contract understood
- [x] Guard precision validated against the known-clean + known-bad set
- [x] Sweep batched across disjoint roots

### Definition of Done
- [x] Whole-tree guard exits 0
- [x] Builds pass, zero dist drift
- [x] Guard committed for reuse; docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone CLI detector: file-walk → comment extraction (per-language) → forbidden-pattern match minus allow-context suppression → findings + nonzero exit.

### Key Components
- **FORBIDDEN rules**: shape-narrowed regexes per id class (spec-folder/pair/slug, task, checklist, requirement, adr, review-finding, github-issue).
- **ALLOW table**: suppresses durable look-alikes (example/JSDoc, schema tags, rolling windows, runtime paths, external standards, source line ranges, numeric-value context, `Safeguard #N`).

### Data Flow
Comment text only is matched; string/code content is excluded, so the guard never flags `const x = "031-foo"`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a tooling + comment fix. No runtime surface changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Code comments (TS/CJS/MJS/JS/PY) | Carry the WHY + a forbidden id | Strip the id, keep the WHY | Whole-tree guard → 0 |
| The guard script | New detector / CI gate | Create + self-test | BAD/GOOD fixture + zero-violation run |
| Runtime strings / test data | Code/tests read them | Unchanged | Guard inspects comment regions only |

Required inventories:
- Detector run: `node scripts/validation/ephemeral-pointer-audit.mjs .opencode/skills/system-spec-kit .opencode/bin`.
- Carve-out set documented inline in the guard's ALLOW table.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author the guard; tune precision (self-exclude + `Safeguard #N` carve-out)
- [x] Validate against the known clean/bad set

### Phase 2: Core Implementation
- [x] Parallel sweep across disjoint roots (11 agents, self-verifying)
- [x] Fix the 8 whole-tree stragglers in roots the batching missed (telemetry, extractors, optimizer) + 3 fixture-annotation FPs

### Phase 3: Verification
- [x] Whole-tree guard → 0; both workspaces build; zero dist drift; `node --check` touched `.cjs`
- [x] Commit guard + sweep; reconcile packet docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard self-test | BAD vs GOOD fixture | the guard + a /tmp fixture |
| Acceptance | whole tree | `node guard <roots>` → exit 0 |
| Build | both workspaces | `npm run build --workspace=…` |
| Syntax | touched `.cjs` | `node --check` |
| Inertness | compiled output | `git status` on `dist/` → 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code `code_style_guide.md` §4 | Internal rule | Green | None — stable |
| Node stdlib | Runtime | Green | None — no external deps |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a build/syntax failure or a mis-rephrased comment.
- **Procedure**: `git checkout -- <file>` reverts any file; comment-only, no migrations/state. The guard file can be removed with no runtime impact.
<!-- /ANCHOR:rollback -->
