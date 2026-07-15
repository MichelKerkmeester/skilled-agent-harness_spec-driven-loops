---
title: "Feature Specification: refine-hub-cli-connections"
description: "Remediate the hub↔cli-* layering drift found by the 5-iteration deep research: pointer-ize the precedence rule, fix the STAR phantom, extend and CI-wire the sync guard, and apply one coordinated cluster treatment to the four default-unverified models."
trigger_phrases:
  - "refine hub cli connections"
  - "precedence drift fix"
  - "star phantom"
  - "sync guard ci"
  - "cluster treatment default-unverified"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/009-refine-hub-cli-connections"
    last_updated_at: "2026-06-03T06:14:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented C1-C10; guard green"
    next_safe_action: "Run validate --strict, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "C7 dispatch matrix confirmed: kimi/qwen/glm dispatch via cli-opencode; qwen is cli-opencode-exclusive"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: refine-hub-cli-connections

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-validate-sweep-changelog-reindex |
| **Successor** | None |
| **Handoff Criteria** | All C-items implemented; extended sync guard green and CI-wired; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of spec 130. Phases 001–008 delivered the 3-layer prompt-knowledge
architecture; this phase remediates the seam drift that the 5-iteration deep research
(`../research/research.md`) found in the shipped result. The research is the decision record
for this phase — this spec does not restate it.

**Scope Boundary**: documentation + JSON metadata + one guard shell script + its CI/hook wiring,
across `sk-prompt`, `sk-prompt-models`, the five `cli-*` skills, and `system-skill-advisor`.
No application code; no changes to `model-profiles.json` model data beyond the `swe-1.6` prose
fix's mirror.

**Dependencies**: the converged research backlog (C1–C10) and its operator-verified findings.

**Deliverables**: C1–C10 implemented (see §3), the extended + CI-wired sync guard, and
per-skill changelog entries.

**Changelog**: on close, refresh the matching file in `../changelog/` using the parent packet
number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped 3-layer architecture drifted at its seams: the Tier-3 escalation rule was hand-copied
into the 5 `cli-*` SKILL.md and 4 of them lost two trigger conditions ("policy", "or audience");
the non-canonical `STAR` task-shape leaked into the hub as if it were a sk-prompt framework /
registry fallback at three surfaces; the sync guard is manual-only and blind to most drift axes;
four near-identical model profiles form a navigability + discovery dead-spot (with `qwen3.6`
unreachable by name); and the new-provider checklist builds zero-hub-weight entries.

### Purpose
Make "one home per fact" actually hold and self-enforcing: pointer-ize the duplicated rule,
relabel STAR, repair the cluster navigation + discovery, complete the new-provider checklist, and
extend + CI-wire the guard so none of this can silently regress.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (C1–C10 from `../research/research.md` §5)
- **C3 (P1)** — relabel STAR/BUILD as cli-devin task-shapes in hub `SKILL.md`; fix `swe-1.6.md` "registry fallback=STAR" to match `fallback: null`.
- **C4 (P3)** — fix `_index.md` swe-1.6 fallback mis-column.
- **C1 (P1, keystone K1)** — pointer-ize the Tier-3 precedence trigger in all 5 `cli-*/SKILL.md`.
- **C2 (P2, keystone K1)** — pointer-ize cli-devin's RCAF/STAR/BUILD framework restatement.
- **C5 (P2)** — replace embedded `opencode run` wrappers in `mimo-v2.5-pro.md` + `minimax-m3.md` with rule + pointer.
- **C6 (P2, keystone K3)** — cluster DRY note + bidirectional card↔profile links for the 4 clones (no profile merge).
- **C7 (P2, keystone K3)** — add `kimi`/`qwen`/`glm` to `cli-opencode` discovery triggers (confirmed dispatch set).
- **C8 (P1)** — complete + reconcile the new-provider checklist (pattern-index §4 vs SKILL.md §3).
- **C9 (P1, keystone K2)** — extend the sync guard (precedence/pointer, registry↔profile↔_index completeness, discovery reachability) and wire it into CI/hook.
- **C10 (P3)** — refresh hub `graph-metadata.json` (`last_updated_at`, `intent_signals`, `enhances[].context`).

### Out of Scope
- Merging the four cluster profiles — ruled out (each must stay 1:1 with its registry row).
- Re-syncing 5 hand-copies of the precedence rule — ruled out (pointer-ize instead).
- Moving `model-profiles.json` — ruled out (link blast radius).
- Adding STAR/BUILD as sk-prompt frameworks — ruled out (relabel only).
- Re-benchmarking the default-unverified models — separate future work.

### Files to Change

| File Path | Change Type | C-item |
|-----------|-------------|--------|
| `sk-prompt-models/SKILL.md` | Modify | C3, C8 |
| `sk-prompt-models/references/models/swe-1.6.md` | Modify | C3 |
| `sk-prompt-models/references/models/_index.md` | Modify | C4 |
| `cli-{opencode,codex,gemini,claude-code}/SKILL.md` | Modify | C1 |
| `cli-devin/SKILL.md` | Modify | C1, C2 |
| `sk-prompt-models/references/models/{mimo-v2.5-pro,minimax-m3}.md` | Modify | C5 |
| `sk-prompt-models/references/models/{deepseek-v4-pro,kimi-k2.6,qwen3.6,glm-5.1}.md` | Modify | C6 |
| `cli-{opencode,devin}/assets/prompt_quality_card.md` | Modify | C6 |
| `cli-opencode/graph-metadata.json` | Modify | C7 |
| `sk-prompt-models/references/pattern-index.md` | Modify | C8 |
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | C9 |
| CI/hook config | Modify | C9 |
| `sk-prompt-models/graph-metadata.json` | Modify | C10 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
None — the research found no P0s.

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pointer-ize the Tier-3 rule (C1) | No `cli-*/SKILL.md` enumerates the Tier-3 triggers; each points to the canonical card |
| REQ-002 | Fix the STAR phantom (C3) | No hub surface presents STAR as a sk-prompt framework or registry fallback; `swe-1.6.md` agrees with `fallback: null` |
| REQ-003 | Complete the new-provider checklist (C8) | One reconciled checklist that includes author-profile + `_index` row + SKILL.md matrix row |
| REQ-004 | Extend + CI-wire the guard (C9) | Guard catches a planted precedence-inline / missing-`_index`-row / unreachable-model; runs from CI/hook |
| REQ-005 | Repair cluster navigation + discovery (C6, C7) | Each clone has a bidirectional card↔profile link; advisor surfaces cli-opencode for a "qwen3.6" prompt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Extended sync guard exits 0 on the clean tree and non-zero on each planted regression.
- **SC-002**: `grep` confirms no `cli-*/SKILL.md` contains the Tier-3 enumeration or RCAF/STAR/BUILD choices.
- **SC-003**: Every STAR reference reads as a cli-devin task-shape; none as a sk-prompt framework/fallback.
- **SC-004**: The four clone profiles round-trip card↔profile; `cli-opencode` triggers carry deepseek/kimi/qwen/glm.
- **SC-005**: `validate.sh --recursive --strict` on the 130 parent exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pointer-ization loses discoverability-at-point-of-use | Low | Keep a one-line canonical summary + pointer (hybrid, as cli-devin already does) |
| Risk | Guard CI-wiring not reachable in this repo's hook setup | Med | If no CI exists, wire a git pre-commit/hook entry; document the manual fallback |
| Dependency | C9 depends on C1 + C8 landing first | — | Sequence per plan.md |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The C7 dispatch-matrix unknown (which executor dispatches each clone) was resolved before scaffolding: kimi/qwen/glm dispatch via cli-opencode; qwen is cli-opencode-exclusive.
<!-- /ANCHOR:questions -->
