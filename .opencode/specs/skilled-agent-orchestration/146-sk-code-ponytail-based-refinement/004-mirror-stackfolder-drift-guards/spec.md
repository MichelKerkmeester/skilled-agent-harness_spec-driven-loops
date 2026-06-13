---
title: "Phase 4: Drift Guards — Agent Mirrors + STACK_FOLDERS Binding"
description: "Promote the existing 3-runtime mirror-sync check from a promotion-only gate to a repo-wide pre-commit + CI gate, and add a STACK_FOLDERS-to-on-disk binding check for sk-code. Fixes the two structural drift bugs found during the 146 research."
trigger_phrases:
  - "phase 4 drift guards"
  - "mirror sync promote"
  - "stack folders binding check"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/146-sk-code-ponytail-based-refinement/004-mirror-stackfolder-drift-guards
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 4 stub created from 146 research rec #10 + stack-folders (fixes Bugs 2,3)"
    next_safe_action: "/speckit:plan; reuse Phase 3's CI-workflow scaffolding"
---
# Phase 4: Drift Guards — Agent Mirrors + STACK_FOLDERS Binding

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Parent** | `146-sk-code-ponytail-based-refinement` (phase 4 of 6) |
| **Source recs** | research.md #10 (promote mirror-sync) + STACK_FOLDERS check — fixes Bonus Bugs 2 & 3 |
| **Risk** | Low — reuses existing comparison logic + the Phase 3 CI pattern |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The repo already has a working 3-runtime parity checker (`deep-improvement/scripts/lib/mirror-sync-verify.cjs`, token-set + path-normalized), but it only fires during a guarded agent-definition promotion — a hand edit to a `.claude`/`.codex` agent mirror that diverges from canonical `.opencode` is caught by **nothing** at commit/CI time. Separately, sk-code §1 instructs adopters to "update STACK_FOLDERS to match" the on-disk `references/` trees, but nothing enforces it. Purpose: wire both into the proven pre-commit + CI gate pattern.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Promote `mirror-sync-verify.cjs` to a repo-wide gate (extract an executable bin; iterate all `.opencode/agents/*.md`; fail on drift) wired into `.opencode/hooks/pre-commit` + a `.github/workflows/` job.
- A `verify_stack_folders.py` that asserts every declared `STACK_FOLDERS` surface has its `references/<surface>/`+`assets/<surface>/` tree (and flags orphan undeclared trees + missing `RESOURCE_MAP` targets).

### Out of Scope
- Building an agent-mirror GENERATOR (research found none exists — that is a separate, larger effort; this phase is verify-only).
- Byte-equality comparison (the repo deliberately uses token-set + path normalization).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs` | Update/Wrap | Expose an executable repo-wide entry point. |
| `.opencode/hooks/pre-commit` + `.github/workflows/` | Update/Create | Wire the mirror check as a commit + CI gate. |
| `.opencode/skills/sk-code/assets/scripts/verify_stack_folders.py` | Create | STACK_FOLDERS ↔ on-disk binding check + retarget checklist. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Repo-wide mirror gate | A deliberate divergence in a `.claude`/`.codex` agent mirror fails pre-commit + CI; clean today. |
| REQ-002 | STACK_FOLDERS binding check | The validator fails when a declared surface lacks its on-disk tree, or an on-disk tree is undeclared. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No false positives on legit per-runtime lines | The existing `normalizeRuntimeSpecificText` allowlist is reused/extended so format-only differences don't trip. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A hand-edited agent mirror that drifts is blocked at commit time.
- **SC-002**: A STACK_FOLDERS declaration that doesn't match disk fails the new check.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False-positive drift on runtime-specific lines | CI noise | Reuse/extend the existing normalization allowlist. |
| Dependency | Phase 3 CI-workflow scaffolding | Reuse | Land Phase 3 first, reuse the workflow shape. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: The pre-commit check must be fast (it runs on every commit) — scope to changed agent files where possible.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`.codex` TOML wrapper** vs `.md` frontmatter: compare bodies, not the format wrapper (token-set, not byte).
- **tsconfig-style declared surfaces** with comment-bearing JSON — handle in the STACK_FOLDERS parser.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the mirror gate runs on all agents every commit or only changed ones (perf vs coverage).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research**: `../research/research.md` (rec #10; Bonus Bugs 2, 3)
- **Existing logic**: `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs`
- **Sibling**: `../003-wording-invariant-guards` (shared CI pattern)

<!-- /ANCHOR:related-docs -->
