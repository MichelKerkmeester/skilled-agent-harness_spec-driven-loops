---
title: "Phase 3: Exact-Wording Guards (canary) + Iron Law Cleanup"
description: "Add a standalone canary guard that locks automation-parsed exact strings (the Review status triplet) and, after canonicalizing the 3-way-drifted Iron Law wording, a minimal Iron Law invariant. Wired as a script + CI workflow (the proven comment-hygiene.yml pattern), not a vitest."
trigger_phrases:
  - "phase 3 canary guard"
  - "review status triplet lock"
  - "iron law canonicalize"
  - "rule invariant guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/003-wording-invariant-guards
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 3 stub created from 146 research recs #3/#8 (fixes Bug 1)"
    next_safe_action: "/speckit:plan; canonicalize Iron Law wording BEFORE adding the canary"
---
# Phase 3: Exact-Wording Guards + Iron Law Cleanup

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
| **Parent** | `142-sk-code-ponytail-based-refinement` (phase 3 of 6) |
| **Source recs** | research.md #3 (Review-status canary), #8 (canonicalize+canary Iron Law) — fixes Bonus Bug 1 |
| **Risk** | Low-medium — must canonicalize wording BEFORE locking |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Downstream automation parses the review final line (`Review status: APPROVED|REQUESTED_CHANGES|COMMENTED`) by exact string match; a typo or stray bold silently breaks gating. Separately, the Iron Law is **already written three different ways** (`sk-code/SKILL.md:45` "fresh verification evidence from the detected surface" / `:137` "surface-appropriate verification" / `CLAUDE.md:11` "stack-appropriate verification"). Purpose: build a ponytail-style canary guard (locks load-bearing wording across files) and use it to fix + freeze both invariants.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A standalone `check-rule-copies.js` (mirrors ponytail's) that asserts the per-file Review-status invariant strings stay verbatim.
- Canonicalize the Iron Law wording across `sk-code/SKILL.md` + `CLAUDE.md`, then canary a minimal stable substring (e.g. `NO COMPLETION CLAIMS WITHOUT`).
- A `.github/workflows/` job running the script (mirroring `comment-hygiene.yml` / `prompt-card-sync.yml`).

### Out of Scope
- Implementing the guard as a vitest (no vitest is CI-gated here — it would silently not block).
- Locking volatile prose / version numbers / file counts / example paths.
- Linking the review-agents' `APPROVE/REQUEST CHANGES/BLOCK` header vocab to the skill's `Review status:` contract (separate surfaces).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code-review/scripts/check-rule-copies.js` | Create | Canary script: Review-status strings (per-file scoped — `pr_state_dedup.md` carries only `COMMENTED`). |
| `.github/workflows/rule-canary-sync.yml` | Create | CI gate running the script (comment-hygiene.yml pattern). |
| `.opencode/skills/sk-code/SKILL.md`, `CLAUDE.md` | Update | Canonicalize the Iron Law wording, then add it to the canary INVARIANTS. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review-status canary | Script fails CI on any spelling/casing/markdown drift of the triplet; scoped to the actual invariant string present in each file. |
| REQ-002 | Iron Law canonicalized first | One canonical wording chosen and applied to `SKILL.md` + `CLAUDE.md` BEFORE any canary on it. |
| REQ-003 | CI-wired, not vitest | A `.github/workflows/` job runs the script and blocks PRs. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Narrow invariant set | Only automation-parsed strings + the Iron Law minimal substring are locked; nothing volatile. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deliberate typo in any `Review status:` string or the Iron Law substring fails CI.
- **SC-002**: The guard passes clean on the canonicalized current text.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Locking before canonicalizing freezes the 3-way Iron Law drift | Guard fails day one | Canonicalize FIRST (REQ-002). |
| Risk | Over-guarding wording blocks legitimate edits | Contributor friction | Keep the INVARIANTS set tiny (parsed strings + safety substring only). |
| Dependency | None on Phases 1/2; shares CI scaffolding with Phase 4 | Reuse | Land the workflow pattern once, reuse in Phase 4. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-C01**: Mirror the existing `check-comment-hygiene.test.sh` run_case fixture style for the script's unit test.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`pr_state_dedup.md`** contains only the `COMMENTED` skip suffix, not the full triplet — canary per-file, do not force a full-triplet assertion there.
- **Casual mentions** of "approved" in prose must not be locked — scope to the contract lines only.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which canonical Iron Law wording wins ("surface-appropriate" vs "stack-appropriate" vs "fresh verification evidence") — decide during plan.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research**: `../research/research.md` (recs #3, #8; Bonus Bug 1)
- **Pattern**: `.github/workflows/comment-hygiene.yml`, `prompt-card-sync.yml`
- **Sibling**: `../004-mirror-stackfolder-drift-guards` (shares CI scaffolding)

<!-- /ANCHOR:related-docs -->
