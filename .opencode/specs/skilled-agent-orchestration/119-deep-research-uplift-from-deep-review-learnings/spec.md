---
title: "Feature Specification: 119 — Deep-Research Uplift from Deep-Review Learnings"
description: "Phased deep-research investigation: can the recent upgrades shipped for deep-review (arc 118 FULL_ISOLATE_NO_MCP + sk-doc conformance + 27-finding fix-pack) be applied as learnings or insights to improve the deep-research skill? Three phase children: research / applicability analysis / uplift recommendations."
trigger_phrases:
  - "deep-research uplift"
  - "deep-research from deep-review learnings"
  - "119 deep-research investigation"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-deep-research-uplift-from-deep-review-learnings"
    last_updated_at: "2026-05-22T22:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase parent + 3 child folders."
    next_safe_action: "Run 10-iter deep-research in child 001."
    blockers: []
    completion_pct: 5
    key_files:
      - "001-research-deep-review-changes/research/research.md"
    session_dedup:
      fingerprint: "sha256:1191191191191191191191191191191191191191191191191191191191190000"
      session_id: "119-deep-research-uplift-phase-parent"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 119 — Deep-Research Uplift from Deep-Review Learnings

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (phased program) |
| **Priority** | P2 |
| **Status** | Active; child 001 next |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Predecessor** | 118-deep-loop-full-isolation-no-mcp (arc whose learnings drive this research) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Arc 118 shipped substantial upgrades to deep-review: full isolation of runtime infrastructure into `.opencode/skills/deep-loop-runtime/`, removal of 4 `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools, direct `.cjs` script invocation pattern, sk-doc canonical companions (feature_catalog + manual_testing_playbook + references + graph-metadata), 10-iter cli-devin SWE-1.6 deep-review with 27-finding fix-pack covering documentation accuracy / phase metadata / code hardening / changelog reconciliation. Most of these are bilaterally applicable to deep-research (the symmetric sibling skill), but the 118 arc focused on deep-review only. **Question: which deep-review upgrades should propagate to deep-research, and what are the deep-research-specific gaps not covered by deep-review's roadmap?**

### Purpose

Run a focused phased investigation that (1) surveys all deep-review changes from the 118 arc + adjacent commits, (2) maps each change to whether it applies to deep-research and at what severity, (3) outputs a prioritized uplift plan that deep-research can execute as a follow-on packet.

> **Phase-parent note:** This parent tracks the child phase map only. The 10-iter deep-research lives in child 001.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 10-iter deep-research dispatch via `/spec_kit:deep-research:auto` pattern (per memory rule: per-iter dispatch with kill-between)
- Iters 1-8: cli-devin SWE-1.6 (user-specified)
- Iters 9-10: cli-codex gpt-5.5 high fast (user-specified final-iter polish)
- Applicability analysis: which deep-review changes apply, with what scope, at what priority
- Uplift recommendations: prioritized list of follow-on packets to ship

### Out of Scope

- Implementing the uplift (this packet RESEARCHES; the resulting recommendations spawn separate implementation packets)
- Modifying deep-review (already shipped in 118)
- Modifying deep-loop-runtime (already shipped in 118 — and deep-research is a CONSUMER of that runtime per v1.12.0.0 changelog)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status | Level |
|-------|--------|-------|--------|-------|
| 001 | `001-research-deep-review-changes/` | 10-iter deep-research session investigating deep-review's 118 arc upgrades + applicability | Active | 3 |
| 002 | `002-applicability-analysis/` | Mapping table: each 118 change → deep-research applicability + severity | Planned | 2 |
| 003 | `003-uplift-recommendations/` | Prioritized uplift plan (follow-on packet candidates) | Planned | 2 |

### Phase Transition Rules

- 001 → 002: 10-iter deep-research must produce `research/research.md` synthesis covering all 118 changes
- 002 → 003: applicability mapping must classify every 118 finding/change as Apply / Skip / Adapt
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the deep-research dispatcher mirror cli-devin SWE-1.6 RCAF prompt structure (used for deep-review per cli-devin SKILL.md)? Or keep its own prompt style? **Defer to research outcome.**
- Is there a single bilateral `deep-loop-runtime` v2.0 release that bundles deep-research improvements, or per-skill releases? **Defer.**
- Does the writer-lock infrastructure (added by 118 fix-pack) help deep-research too, or is it review-specific? **Investigate in iter-4 or 5.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `../118-deep-loop-full-isolation-no-mcp/` (the arc this packet investigates)
- **Deep-review review-report** (input): `../118-deep-loop-full-isolation-no-mcp/review/review-report.md`
- **Deep-review changelog**: `../../skills/deep-review/changelog/v1.4.0.0.md`
- **Deep-research changelog (latest)**: `../../skills/deep-research/changelog/v1.12.0.0.md`
- **deep-loop-runtime SKILL.md**: `../../skills/deep-loop-runtime/SKILL.md`
- **Next active phase**: `001-research-deep-review-changes/`
