---
title: "Feature Specification: foundation routing — sentinel sk-small-model skill + AGENTS.md rule + enhances edges"
description: "Phase A of the 114 follow-on roadmap. Create a thin sentinel sk-small-model skill (pattern index only), add the small-model dispatch rule to AGENTS.md, and wire enhances edges from cli-devin/cli-opencode/sk-prompt/sk-code into the sentinel."
trigger_phrases:
  - "sk-small-model sentinel"
  - "small-model dispatch rule"
  - "swe-1.6 dispatch"
  - "kimi dispatch"
  - "deepseek dispatch"
  - "qwen dispatch"
  - "haiku dispatch"
  - "gemini flash dispatch"
  - "foundation routing 114"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/002-sentinel-skill-foundation"
    last_updated_at: "2026-05-18T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 002 spec.md L2"
    next_safe_action: "Author 002 plan.md"
    blockers: []
    key_files:
      - "../001-research-smallcode/research/research.md"
      - "../roadmap/follow-on-phases.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000002"
      session_id: "114-002-spec-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact weight for enhances edges (0.4 like sk-prompt or 0.5 to compensate for narrower scope)"
    answered_questions:
      - "Architecture verdict: HYBRID-with-Anchor (sentinel skill, real patterns distributed)"
---

# Feature Specification: foundation routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase A of the 114 follow-on roadmap. Create a thin sentinel `sk-small-model` skill that holds only philosophy + pattern index pointing at the real patterns living in `cli-devin/references/` and `cli-opencode/references/`. Wire enhances edges from cli-devin, cli-opencode, sk-prompt, and sk-code into the sentinel so the skill-advisor co-surfaces small-model guidance on any small-model dispatch. Add the "Small-model dispatch rule" to AGENTS.md as a sibling to the existing CLI dispatch rule. This phase is the FOUNDATION — every downstream phase (003–006) depends on this routing being in place. Effort: ~6 hours across 2 packets internal to this phase.

**Model scope confirmed (2026-05-18)**: The user's actual small-model usage is SWE-1.6 (Cognition free tier), DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6 (all sharing one Cognition Pro pool via cli-opencode), with optional future additions of Claude Haiku (Anthropic separate quota) and Gemini Flash (Google separate quota). Trigger phrases below name these models explicitly to avoid generic-keyword bloat.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented with documented skips |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
| **Predecessor** | 001-research-smallcode (research; HYBRID-with-Anchor verdict in research.md §RQ5 refined) |
| **Successor** | 003-permissions-matrix, 004-cli-devin-quality (both can start in parallel after 002 ships) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Today the skill-advisor has no routing target for small-model concerns. A prompt like "use cli-devin for SWE-1.6 work" surfaces only cli-devin; it does NOT surface any small-model-specific guidance (context budget, verification, permissions matrix). Per research.md §RQ5 the HYBRID-with-Anchor verdict requires a single sentinel skill operators can discover when they think "small model." Without this foundation, every downstream phase's `references/` files are invisible to the advisor.

### Purpose

Ship the sentinel `sk-small-model` skill (thin) + AGENTS.md dispatch rule + per-skill enhances edges, so the advisor surfaces small-model guidance on any small-model prompt and downstream phases can land their `references/` files in a discoverable home.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `.opencode/skills/sk-small-model/` directory with SKILL.md (1-paragraph philosophy + pattern-index pointer), graph-metadata.json (enhances edges + trigger phrases + key topics), description.json, and a stub references/pattern-index.md
- Add "Small-model dispatch rule" to AGENTS.md §1 as sibling to existing CLI dispatch rule (line ~39)
- Add enhances edges in cli-devin/graph-metadata.json and cli-opencode/graph-metadata.json pointing to sk-small-model (weight 0.5)
- Trigger skill-advisor re-index after metadata edits

### Out of Scope

- The actual content of sk-small-model/references/pattern-index.md is a STUB pointer list; real patterns land in downstream phase packets (003+)
- Per-skill `references/` files (deferred to 003+)
- sk-code or sk-prompt graph-metadata enhances edges — optional, deferred until 004 sk-prompt budget guidance lands
- Validator code changes — none required for this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-small-model/SKILL.md` | Create | New file (target ≤200 LOC) |
| `.opencode/skills/sk-small-model/description.json` | Create | Generated by generate-context.js |
| `.opencode/skills/sk-small-model/graph-metadata.json` | Create | Enhances edges + trigger phrases |
| `.opencode/skills/sk-small-model/references/pattern-index.md` | Create | Stub index of where small-model patterns live |
| `AGENTS.md` | Modify | Insert "Small-model dispatch rule" under §1 |
| `.opencode/skills/cli-devin/graph-metadata.json` | Modify | Add enhances edge to sk-small-model |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | Add enhances edge to sk-small-model |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-small-model skill exists with all required files | `ls .opencode/skills/sk-small-model/{SKILL.md,description.json,graph-metadata.json,references/pattern-index.md}` returns exit 0 |
| REQ-002 | sk-small-model graph-metadata has `enhances` edges to cli-devin AND cli-opencode (weight 0.4–0.5) | `jq '.edges.enhances' .opencode/skills/sk-small-model/graph-metadata.json` lists both targets |
| REQ-003 | AGENTS.md contains "Small-model dispatch rule" | `grep -c "Small-model dispatch rule" AGENTS.md` ≥ 1 |
| REQ-004 | Skill-advisor recommends sk-small-model with confidence ≥ 0.8 on small-model prompts | Manual simulation with `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "dispatch SWE-1.6 to read file X"` confirms sk-small-model in top-3 |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reverse enhances edges from cli-devin and cli-opencode point at sk-small-model | `jq '.edges.enhances' .opencode/skills/cli-devin/graph-metadata.json` includes sk-small-model |
| REQ-006 | Skill-advisor re-index ran successfully after edits | `python3 .../skill_advisor.py --rebuild` exit 0 |
| REQ-007 | Strict-validate passes on the new sk-small-model SKILL.md | sk-doc-derived check or manual structural review (skill SKILL.md is not under spec-folder validate) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill-advisor surfaces sk-small-model (≥ 0.8 confidence) for 3 sample prompts: (a) "dispatch SWE-1.6", (b) "use cli-devin for code review", (c) "what's the small-model output verification pattern"
- **SC-002**: AGENTS.md §1 has the new rule and the existing CLI dispatch rule is unchanged
- **SC-003**: Both cli-devin and cli-opencode graph-metadata.json files validate against the existing graph-metadata schema
- **SC-004**: Spec-kit memory search returns sk-small-model for query "small model optimization patterns"
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Skill-advisor 5-lane scorer logic (fusion.ts:41-200) | Routing won't surface sk-small-model if scorer rejects the new metadata shape | Validate scorer output post-edit via skill_advisor.py |
| Risk | Pattern-index.md goes stale if downstream phases move references/ files | Sentinel becomes misleading | Manual review during each follow-on phase merge; CI check deferred (Phase 007 deleted per user direction 2026-05-18) |
| Risk | Overly-aggressive enhances weight pulls sk-small-model into non-small-model prompts | Operator confusion / advisor noise | Start at 0.4 (matches sk-prompt precedent); tune up if under-surfaced |
| Dependency | AGENTS.md line numbering | Insert location may shift if AGENTS.md is edited concurrently | Use the existing CLI dispatch rule as an anchor (search-and-insert after, not line-number-based) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: sk-small-model SKILL.md ≤ 200 LOC (sentinel is intentionally tiny)
- **NFR-P02**: pattern-index.md ≤ 100 LOC (links only, no content duplication)

### Maintainability

- **NFR-M01**: pattern-index.md uses relative paths so it survives refactors
- **NFR-M02**: enhances edges include a `context` string explaining WHY the edge exists (not just the weight)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Skill Advisor Cold State

- First invocation after creation: advisor must re-index before sk-small-model is discoverable. Document the re-index command in the implementation-summary.

### Concurrent AGENTS.md Edits

- If AGENTS.md changes between research and implementation, the line-number anchor (~39) may shift. Use a content-based search for the existing CLI dispatch rule as the insertion point.

### Stale Pattern Index

- If downstream phases (003+) move a `references/` file, the sentinel's pattern-index becomes wrong. No CI guard planned (Phase 007 deleted 2026-05-18); document the staleness risk in the sentinel SKILL.md and rely on PR review.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | New skill + 2 metadata edits + 1 AGENTS.md edit |
| Risk | 6/25 | Low blast radius; routing changes don't affect existing dispatches |
| Research | 4/20 | Already done in 001-research-smallcode iter-014 HYBRID-with-Anchor |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should sk-small-model also enhance sk-code (weight 0.3) so code reviews surface small-model concerns?
- Exact wording of AGENTS.md rule — match the existing CLI dispatch rule pattern verbatim or extend with small-model-specific clauses?
- Should pattern-index.md ship with placeholder entries (anticipating 003-006 deliverables) or stay empty until each phase actually lands?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Predecessor**: `../001-research-smallcode/research/research.md` §RQ5 (HYBRID-with-Anchor verdict, iters 5/10/14)
- **Roadmap**: `../roadmap/follow-on-phases.md` Phase A
- **Sibling docs**: plan.md, tasks.md, checklist.md, implementation-summary.md
