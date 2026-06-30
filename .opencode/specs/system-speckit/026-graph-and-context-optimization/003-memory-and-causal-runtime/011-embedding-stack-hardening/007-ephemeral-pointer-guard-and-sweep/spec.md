---
title: "Feature Specification: Ephemeral-pointer guard + comprehensive comment sweep"
description: "Add a standalone, dependency-free lint guard that enforces sk-code §4 (no ephemeral-artifact pointers in code comments), and use it to drive a comprehensive comment sweep that 006 left ~90% incomplete: 261 violations across 119 files, comment-only, keeping the durable WHY."
trigger_phrases:
  - "ephemeral pointer guard and sweep"
  - "ephemeral-pointer-audit.mjs lint guard"
  - "comprehensive comment ephemeral pointer cleanup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep"
    last_updated_at: "2026-05-29T21:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built + tuned the guard; swept the whole tree to guard-clean (0)"
    next_safe_action: "Commit guard + sweep; then land C1 docs, C2 fixes, C3 cluster"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/validation/ephemeral-pointer-audit.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003171"
      session_id: "031-007-spec"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Scope: full tree (system-spec-kit + bin), all 274 guard hits minus confirmed false positives."
      - "Guard tuning: self-exclusion + Safeguard #N internal-enumeration carve-out."
---
# Feature Specification: Ephemeral-pointer guard + comprehensive comment sweep

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | Enforcement + comprehensive cleanup (follow-on to 006) |
| **Predecessor** | 006-comment-ephemeral-pointer-cleanup |
| **Successor** | None |
| **Handoff Criteria** | The guard runs clean (exit 0) over the whole tree; builds pass; the guard is committed as a reusable detector; diff is comment-only (zero dist drift). |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 006 cleaned ephemeral-artifact pointers from code comments using hand-rolled grep patterns. Those patterns were incomplete: they matched `DR-`, `WS-`, `NNN/NNN`, and `Spec NNN`, but were blind to `P0-/P1-/P2-` review-finding ids, 2-digit/hyphenated task ids (`T73`, `T-02`), no-hyphen checklist ids (`CHK069`), `#NN` issue refs, `NNN-NNN` spec pairs, and `SPRINT N`. A purpose-built detector revealed the true debt: **274 violations across 116 files** — 006 had covered roughly 10%.

### Purpose
Build a precise, dependency-free guard that enforces sk-code §4 so the rule is mechanically verifiable (and can gate CI / pre-commit), then use it to drive a comprehensive comment sweep to guard-clean — keeping the durable WHY in every comment and dropping only the perishable id.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new standalone Node ESM guard (`scripts/validation/ephemeral-pointer-audit.mjs`) that flags ephemeral-artifact pointers in comment regions only, with explicit carve-outs for durable look-alikes (HTTP codes, dims, token tiers, schema-version tags, JSDoc `@example`, runtime paths, external standards, internal `Safeguard #N` enumerations).
- A comment-only sweep of every true violation across `.opencode/skills/system-spec-kit` + `.opencode/bin` (261 fixes / 119 files), verified to guard-clean.

### Out of Scope
- Logic/behavior changes (diff is comment/string text only; confirmed by zero dist drift).
- Markdown / spec docs (legitimately reference packets).
- Test *data* / fixtures / `describe()`/`it()` titles that are a test's subject (left as-is; the guard inspects comment regions only).
- Wiring the guard into CI/pre-commit (proposed in the guard header; a follow-on decision).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/validation/ephemeral-pointer-audit.mjs | Create | The guard (≈470 LOC, dependency-free), tuned for precision |
| mcp_server/** (handlers, lib/*, context-server.ts, tool-schemas.ts, api, scripts) | Modify | Comment-only ephemeral-pointer removal |
| scripts/** (core, lib, utils, renderers, graph, memory, spec-folder, extractors, optimizer, tests) | Modify | Comment-only removal |
| shared/** | Modify | Comment-only removal |
| .opencode/bin/** | Modify | Comment-only removal |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A precise comment-only guard exists and is dependency-free | `node ephemeral-pointer-audit.mjs <paths>` runs on stdlib only; flags a BAD fixture, passes a GOOD one |
| REQ-002 | Whole tree is guard-clean | `node guard .opencode/skills/system-spec-kit .opencode/bin` exits 0 |
| REQ-003 | Zero behavior change | Both workspaces build (exit 0); zero `dist/` drift |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Guard precision: no durable look-alikes flagged | HTTP codes, dims, tiers, `V16:`, JSDoc `@example`, runtime paths, `Safeguard #N` all pass |
| REQ-005 | Every fix keeps the durable WHY | Spot-review confirms the explanatory text survives; only ids dropped |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard reports 0 violations over the whole tree and is committed for reuse.
- **SC-002**: Builds pass with zero dist drift; the guard distinguishes ephemeral ids from durable look-alikes.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Guard false positives over-edit durable info | Loss of meaning | Precision carve-outs + per-agent self-verify + whole-tree review; FPs (Safeguard #N, fixture annotations) reconciled |
| Risk | Large diff (119 files) intermingles with other sessions | Wrong files committed | `git reset` + explicit pathspec-from-file; verify `git show HEAD --name-only` |
| Dependency | sk-code §4 (rule source) | None | Stable, read-only |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Wiring the guard into pre-commit / CI / sk-code verification is proposed but deferred to a follow-on decision.

<!-- /ANCHOR:questions -->
