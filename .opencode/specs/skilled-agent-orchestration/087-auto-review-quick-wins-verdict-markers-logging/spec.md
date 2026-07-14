---
title: "Feature Specification: sk-code-review Auto-Review Uplift (phased, 4 children)"
description: "Phase-parent packet adopting 5 quick-win teachings (H-1 through H-6) from packet 106 upstream auto-review research. MVP phases 1-3 implemented and pushed. Phase 4 (stretch goals) is backlog, deferred to packet 109."
trigger_phrases:
  - "108 sk-code-review auto-review uplift"
  - "auto-review teachings adoption"
  - "h1 final-line contract"
  - "h2 loop-prevention markers"
  - "h3 async-iife logging"
  - "packet 107 follow-on"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/087-auto-review-quick-wins-verdict-markers-logging"
    last_updated_at: "2026-05-16T09:30:00Z"
    last_updated_by: "cli-opencode-deepseek-v4-pro"
    recent_action: "all_3_mvp_phases_implemented_and_pushed"
    next_safe_action: "backlog_phase_4_stretch_goals_deferred_to_packet_109"
    blockers: []
    key_files:
      - "spec.md"
      - "001-h1-final-line-contract/spec.md"
      - "002-h2-loop-prevention-markers/spec.md"
      - "003-h3-async-iife-h6-lazy-mkdir/spec.md"
      - "004-stretch-goals/spec.md"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-implement"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Phase 4 is BACKLOG — not blocking completion at 80%"
      - "Council verdict APPROVE post-revisions (5/5 unanimous, HIGH confidence)"
      - "All 3 MVP phases implemented and pushed (commits 73e9e361e, 74782acfb, 65e6f0479)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Parent docs stay lean. Detailed plans, tasks, checklists, decisions, and continuity live in child phase folders.
-->

# Feature Specification: sk-code-review Auto-Review Uplift

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — awaiting council review |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/z_archive/087-auto-review-quick-wins-verdict-markers-logging` |
| **Active Child** | `001-h1-final-line-contract` (first phase to implement post-council) |
| **Source Findings** | `106-opencode-auto-review-teachings-research/research/review-report.md` (verdict: TEACHINGS-AVAILABLE, 9 HIGH + 6 MEDIUM teachings) |
| **Pre-implementation Gate** | deep-ai-council multi-seat review using cli-codex gpt-5.5 xhigh fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 106 identified 9 HIGH-impact + 6 MEDIUM-impact reusable patterns from the upstream `dzianisv/opencode-plugins` `auto-review` package. The 5 quick-win teachings (H-1 through H-6, all LOW-cost) can be adopted in 5-8 hours total to deliver CI gate integration, recursion defense, and measurable hook performance improvements across our review skills (sk-code-review, deep-review, deep-research) and OpenCode plugin ecosystem (skill-advisor hooks, code-graph feedback handler). Without adoption, we leave proven mechanisms on the table while our review infrastructure remains weaker than necessary.

### Purpose
Adopt the 5 quick-win teachings via 3 implementation phases (MVP) + 1 stretch-goals phase, gated by a multi-AI council review that validates the phase scoping + ordering + risk profile before any code changes land. Implementation only begins after the council produces a `ai-council/council-report.md` artifact with a clear verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 child phase packets (001-h1, 002-h2, 003-h3-h6, 004-stretch) covering the H-1..H-6 + stretch goals
- Pre-implementation council review via deep-ai-council skill (executor: cli-codex gpt-5.5 xhigh fast)
- Council artifact persistence to `ai-council/` subdir (council-report.md, seats.json, deliberations.jsonl per skill contract)
- Phase-parent reconciliation post each child completion (derived.last_active_child_id update)

### Out of Scope
- Implementing H-1..H-9 BEFORE council review converges (gated)
- Adopting REJECT-list patterns from 106 (event-driven activation, cross-model selection, child-session isolation, plaintext logging)
- Re-doing 106 research (this packet builds on 106's findings)

### Files to Change

| Path | Change Type | Description |
|------|-------------|-------------|
| `001-h1-final-line-contract/` | Create | Phase 1: final-line exact-string contract for sk-code-review + deep-review |
| `002-h2-loop-prevention-markers/` | Create | Phase 2: marker headers for sk-code-review + deep-review + deep-research |
| `003-h3-async-iife-h6-lazy-mkdir/` | Create | Phase 3: async-IIFE logging + lazy mkdir for skill-advisor + code-graph hooks |
| `004-stretch-goals/` | Create | Phase 4: H-4, H-5, H-7, H-8, H-9 + M-1..M-6 |
| `ai-council/council-report.md` | Create (via council) | Multi-seat review verdict + deliberation log |
| `.opencode/skills/sk-code-review/SKILL.md` | Modify (Phase 1) | Replace free-form verdict with exact-string contract |
| `.opencode/skills/deep-review/` YAML synthesis | Modify (Phase 1) | Emit "Review verdict: [PASS/CONDITIONAL/FAIL]" final line |
| `.opencode/skills/sk-code-review/references/` prompt templates | Modify (Phase 2) | Add "CODE-REVIEW\n\n" header marker |
| `.opencode/skills/deep-review/prompt_pack_iteration.md.tmpl` | Modify (Phase 2) | Add "DEEP-REVIEW\n\n" header marker |
| `.opencode/skills/deep-research/prompt_pack_iteration.md.tmpl` | Modify (Phase 2) | Add "DEEP-RESEARCH\n\n" header marker |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:243-248` | Modify (Phase 3) | writeFileSync → async-IIFE |
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63` | Modify (Phase 3) | appendFileSync → async-IIFE |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Pre-implementation council review converges to a verdict | `ai-council/council-report.md` exists with verdict (APPROVE/REQUEST-CHANGES/REJECT) + ≥ 3 seat deliberations |
| REQ-002 | Each phase child has full Level 1 docs (spec/plan/tasks/impl-summary) | Strict validate exit 0 for each child |
| REQ-003 | Council verdict APPROVE before Phase 1 implementation | Implementation gated on council artifact |
| REQ-004 | Each child phase produces commits scoped to its target files only | No cross-phase scope leakage |
| REQ-005 | Strict validate exit 0 on parent + each child after every phase | Validation gate per phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Council report authored at `ai-council/council-report.md` with verdict + ≥ 3 seat deliberations + risk assessment.
- **SC-002**: Each child phase strict validate exit 0 at creation and at completion.
- **SC-003**: 5 quick-win teachings implemented across all target surfaces with file:line evidence.
- **SC-004**: At least 2 of the 3 MVP phases (Phases 1, 2, 3) complete with green tests/validation before Phase 4 begins.
- **SC-005**: Phase 4 (stretch goals) is OPTIONAL — packet declared complete when MVP (Phases 1-3) is done.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Council review identifies a flaw in phase scoping that requires re-design | Delays Phase 1 start | Council runs BEFORE implementation; cost of re-design is just spec edits, not code |
| Risk | H-1 (exact-string contract) breaks downstream consumers that parse review verdicts via regex | Existing automation fails | Phase 1 adds the new line additively; existing regex paths continue to match until consumers migrate |
| Risk | H-2 marker scan creates false positives (e.g. user legitimately writes "CODE-REVIEW" in a comment) | Skipped reviews | Phase 2 dispatcher scan must use marker-as-first-line constraint, not contains-check |
| Risk | H-3 async-IIFE pattern loses log entries under high-concurrency or crash | Diagnostic gaps | Acceptable for diagnostic logs (fire-and-forget contract); add fsync flag option for critical traces |
| Risk | Phase 4 stretch goals expand scope beyond MVP | Schedule slip | Phase 4 is OPTIONAL; MVP completion gates packet close-out, stretch goals deferred to packet 109 if needed |
| Dependency | cli-codex gpt-5.5 xhigh fast available | Council review cannot run | Verify at council dispatch time |
| Dependency | Local skills + plugins under modification (sk-code-review, deep-*, mk-skill-advisor, mk-code-graph) | Phase implementation cannot run without target paths | Verified at phase start |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Council verdict on phase scoping + ordering? — Resolved by `ai-council/council-report.md`.
2. **Q2**: Should H-6 (lazy mkdir) be bundled with H-3 (async-IIFE) in Phase 3, or separated? — Currently bundled because they share target files; council may recommend split.
3. **Q3**: Should Phase 4 stretch goals be a separate packet 109? — Decided at packet close-out based on capacity.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

(Phase parent — sub-phases tracked in children. This section summarizes the phase plan; details in each child's spec.md.)

| Phase | Child | Teachings | Target surfaces | Effort | Status |
|-------|-------|-----------|-----------------|--------|--------|
| 1 | `001-h1-final-line-contract` | H-1 (plain text final lines, no Markdown bold) | sk-code-review, deep-review | 2-3 h | Planned (council-approved) |
| 2 | `002-h2-loop-prevention-markers` | H-2 + H-4 (anti-repetition moved into MVP) | sk-code-review, deep-review, deep-research — at RENDERED-PROMPT BOUNDARY, not in reference frontmatter | 2-3 h | Planned (council-approved) |
| 3 | `003-h3-async-iife-h6-lazy-mkdir` | H-3 (diagnostic-only), H-6 | skill-advisor metrics.ts (PRESERVE bounded retention) + code-graph ccc-feedback.ts (awaited async, NOT fire-and-forget) | 2-3 h | Planned (council-approved with revised semantics) |
| 4 | `004-stretch-goals` (BACKLOG-ONLY) | H-5, H-7, H-9, M-1..M-6 (H-4 promoted to Phase 2; H-8 dropped — duplicates H-1) | Various | n/a | BACKLOG-ONLY — no implementation in packet 108. Future packet 109 if pursued. |

**Pre-implementation gate**: deep-ai-council multi-seat review via cli-codex gpt-5.5 xhigh fast. ✅ Council COMPLETE at `ai-council/council-report.md` — verdict REQUEST-CHANGES (5/5 unanimous, HIGH confidence). 7 spec edits applied 2026-05-16 per Recommended Plan §10. Implementation executor: cli-opencode + deepseek-v4-pro via `opencode run --model deepseek/deepseek-v4-pro --pure`.
<!-- /ANCHOR:iteration-plan -->

---

## 9. RELATED DOCUMENTS

- Source findings: `skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/review-report.md`
- Phase children: `001-h1-final-line-contract/`, `002-h2-loop-prevention-markers/`, `003-h3-async-iife-h6-lazy-mkdir/`, `004-stretch-goals/`
- Council artifacts: `ai-council/council-report.md` (post-review)
- Upstream pinned SHA: `cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9` (dzianisv/opencode-plugins branch issue-136-package-auto-review)
- Target skills: `.opencode/skills/{sk-code-review,deep-review,deep-research}/SKILL.md`
- Target plugins/hooks: `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts`
