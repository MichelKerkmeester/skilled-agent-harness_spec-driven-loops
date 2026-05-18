---
title: "Feature Specification: Auto-Review Stretch Uplift (phased, 4 children)"
description: "Phase-parent packet adopting the 7 stretch teachings deferred from packet 108 (H-5 3-tier config, H-7 marker dedup, H-9 bounded evidence + M-1, M-2, M-3, M-6) from packet 106 upstream auto-review research. Grouped into 4 phase children by target surface: mk-* plugins, sk-code-review, deep-review, deep-agent-improvement. Council review by gpt-5.5 xhigh fast precedes implementation."
trigger_phrases:
  - "110 auto-review stretch uplift"
  - "auto-review stretch teachings"
  - "h5 3-tier config"
  - "h7 marker dedup"
  - "packet 108 follow-on"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates"
    last_updated_at: "2026-05-16T13:00:00Z"
    last_updated_by: "cli-opencode-deepseek-v4-pro"
    recent_action: "all_4_mvp_phases_implemented_and_pushed"
    next_safe_action: "implement_H9_bounded_evidence_in_packet_111"
    blockers: []
    key_files:
      - "spec.md"
      - "001-mk-plugins-config-uplift/spec.md"
      - "002-sk-code-review-uplift/spec.md"
      - "003-deep-review-uplift/spec.md"
      - "004-deep-agent-improvement-uplift/spec.md"
      - "ai-council/council-report.md (target after review)"
    session_dedup:
      fingerprint: "sha256:4fde3abaec174fe6a1b11c26be70a8e73453a1697c46f93d73cb60d0435ef1e3"
      session_id: "2026-05-16-110-scaffold"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "H-9 bounded-evidence — revisit in packet 111+ if a real interpolation path is identified in deep-review architecture"
    answered_questions:
      - "Council verdict APPROVE-WITH-REVISIONS (5/5 unanimous REQUEST-CHANGES → all 7 spec edits applied)"
      - "Phase grouping: target-surface (council §13 winning strategy A)"
      - "All 4 MVP phases shipped: commits 45c5a7118, baaeaad52, 8b3039a1a, b29640496"
      - "H-9 deferred to packet 111+ — current deep-review prompts use state/metadata pointers, not embedded file contents"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Parent docs stay lean. Detailed plans, tasks, checklists, decisions, and continuity live in child phase folders.
-->

# Feature Specification: Auto-Review Stretch Uplift

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 (stretch goals — not blocking; packet 108 MVP already shipped) |
| **Status** | **MVP COMPLETE** — 4 phases shipped 2026-05-16; H-9 deferred to 111+ |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates` |
| **Active Child** | `004-deep-agent-improvement-uplift` (final phase complete) |
| **Source Findings** | `106-opencode-auto-review-teachings-research/research/review-report.md` (stretch teachings) + `108-auto-review-quick-wins-verdict-markers-logging/004-stretch-goals/spec.md` (deferred list) |
| **Pre-implementation Gate** | deep-ai-council multi-seat review using cli-codex gpt-5.5 xhigh fast → ai-council/council-report.md ✅ COMPLETE (5/5 REQUEST-CHANGES → 7 revisions applied) |
| **Implementation Executor** | cli-opencode + deepseek-v4-pro via `opencode run --model deepseek/deepseek-v4-pro --pure` ✅ ALL 4 PHASES SHIPPED |
| **Phase commits** | 45c5a7118 (001 H-5+M-6), baaeaad52 (002 M-1+M-2), 8b3039a1a (003 H-7), b29640496 (004 M-3) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 108 shipped 5 quick-win teachings (H-1, H-2, H-3, H-4, H-6) from 106's auto-review research, but 6 stretch teachings remain unadopted: H-5 (3-tier config for mk-* plugins), H-7 (marker-based dedup for deep-review multi-dimensional loops), M-1 (PR state dedup for sk-code-review), M-2 (optional min-evidence gate for sk-code-review), M-3 (mutation signature dedup for deep-agent-improvement), M-6 (async config init for mk-* plugins). The 108 packet deferred these to a stretch packet (now this packet 110 — number `109` was taken by parallel `109-subphase-recatalog-and-archive`). Per 110 council verdict (5/5 REQUEST-CHANGES → revisions applied), **H-9 (bounded evidence interpolation) is deferred** — current deep-review prompt packs use state/metadata pointers, not embedded file contents, so H-9's described interpolation point doesn't exist in the current architecture (H-9 may be revisited in a future packet 111+ if a real interpolation path is identified). Implementation cost (post-council revisions): MEDIUM (3-4h) for HIGH-impact items, LOW (~1h) for MEDIUM-impact items — total **~8-10h** after H-9 defer.

### Purpose
Adopt the 6 stretch teachings via 4 implementation phases grouped by target surface (not by impact tier — keeps each child focused on a single skill/plugin). Pre-implementation council review APPROVED-WITH-REVISIONS by `ai-council/council-report.md` (5/5 unanimous REQUEST-CHANGES → all 7 spec edits applied 2026-05-16). Implementation executor: cli-opencode + deepseek-v4-pro via `opencode run --model deepseek/deepseek-v4-pro --pure`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 child phase packets grouped by target surface
- Pre-implementation council review via deep-ai-council skill (executor: cli-codex gpt-5.5 xhigh fast)
- Council artifact persistence to `ai-council/` subdir
- Phase-parent reconciliation post each child completion (derived.last_active_child_id update)
- All 4 phases are OPTIONAL — packet can ship with any subset complete

### Out of Scope
- Re-doing 106 research (this packet builds on 106 findings)
- Reverting any 108 work (108 MVP is stable)
- Implementing 106 REJECT-list patterns (event-driven activation, cross-model selection, child-session isolation, plaintext logging — all architectural mismatches per 106)

### Phase-to-Teaching Mapping

| Phase | Child | Teachings | Target surface | Effort (council-revised) |
|-------|-------|-----------|----------------|--------------------------|
| 1 | `001-mk-plugins-config-uplift` | H-5 (4-tier config: **rawOptions** > file > env > defaults — per council §10.2) + M-6 (await config promise before option-readers; factories ALREADY async per council §6) | `.opencode/plugins/mk-skill-advisor.js` (rawOptions normalization at lines 107-127, env handling at 35-39, async factory at 387) + `.opencode/plugins/mk-code-graph.js` (lines 122-142 + 361-363) | ~3-4h |
| 2 | `002-sk-code-review-uplift` | M-1 (PR-state content-hash dedup) + M-2 (opt-in min-evidence gate with conservative skip taxonomy per council §10.3) | `.opencode/skills/sk-code-review/SKILL.md` + state metadata | ~2-3h |
| 3 | `003-deep-review-uplift` | H-7 (extend EXISTING file:line+normalized_title dedup at `spec_kit_deep-review_auto.yaml:1115-1124` per council §10.4) — **H-9 DEFERRED to packet 111+** per council §10.5 | `.opencode/commands/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml` synthesis dedup step | ~2-3h (revised down after H-9 defer) |
| 4 | `004-deep-agent-improvement-uplift` | M-3 (mutation signature dedup; signatures live in `mutation-coverage.json` per council §10.6 — reducer at `reduce-state.cjs` updated) | `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs` + `scripts/reduce-state.cjs` + `mutation-coverage.json` schema | ~2-4h (council §10.7 expanded estimate) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Pre-implementation council review converges to a verdict | `ai-council/council-report.md` exists with verdict + ≥ 3 seat deliberations |
| REQ-002 | Each phase child has full Level 1 docs (spec/plan/tasks/impl-summary) | Strict validate exit 0 for each child |
| REQ-003 | Council verdict APPROVE before any phase implementation | Implementation gated on council artifact |
| REQ-004 | Each child phase produces commits scoped to its target files only | No cross-phase scope leakage |
| REQ-005 | Strict validate exit 0 on parent + each child after every phase | Validation gate per phase |
| REQ-006 | Each adopted teaching has file:line implementation evidence | Audit trail in commit messages + implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Council report authored with verdict + ≥ 3 seat deliberations + risk assessment.
- **SC-002**: Each child phase strict validate exit 0 at creation and at completion.
- **SC-003**: All adopted teachings have file:line implementation evidence in commits.
- **SC-004**: Packet declared complete if ≥ 2 of the 4 phases ship; remaining phases can defer to packet 110 if needed.
- **SC-005**: No regressions to packet 108's H-1/H-2/H-3/H-4/H-6 implementations — all touched files verified via typecheck + vitest.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | H-5 3-tier config introduces backward-incompatible config schema changes for mk-* plugins | Existing users break | Make file-tier OPTIONAL; env + defaults remain working unchanged; document migration in INSTALL_GUIDE |
| Risk | H-7 marker-based dedup loses findings if signature collides | False-negative review gaps | Use file:line + finding-type + content-hash signature, not just file:line |
| Risk | H-9 bounded evidence truncates critical context | Reviewer misses signal | Apply ONLY when total evidence > 10MB threshold; preserve full evidence for normal packets |
| Risk | M-1 PR state dedup based on commit SHA + diff hash; rebase changes SHA | Re-reviews on no-op rebases | Use content-hash of diff payload, not commit SHA |
| Risk | M-2 min-evidence gate makes trivial-but-important reviews silently skip | False-positive PASS | Make gate OPT-IN (off by default); document conditions |
| Risk | M-3 mutation signature dedup over-aggressive | Skipped legitimate variants | Include dimension + mutationType + targetSection in signature to avoid collision |
| Risk | M-6 async config init introduces race conditions at plugin startup | Plugin fails to bootstrap | Await config promise BEFORE registering tools/handlers |
| Dependency | cli-codex gpt-5.5 xhigh fast available | Council review cannot run | Verify at council dispatch time |
| Dependency | Local skills + plugins under modification (mk-*, sk-code-review, deep-review, deep-agent-improvement) | Phase implementation cannot run without target paths | Verified at phase start |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Council verdict on phase grouping (by target surface) vs alternative groupings (by impact tier or by cost)? — Resolved by `ai-council/council-report.md`.
2. **Q2**: Should H-7 marker-based dedup be applied to deep-research as well, not just deep-review? Council to advise.
3. **Q3**: M-2 min-evidence gate — operator-configurable threshold or fixed at 3 changed lines? Council to advise.
4. **Q4**: Should H-5 config-file path mirror 108's `SKILL_ADVISOR_DEBUG` env var naming (`MK_SKILL_ADVISOR_*`) or use a separate scheme?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

(Phase parent — sub-phases tracked in children. This section summarizes the phase plan; details in each child's spec.md.)

| Phase | Child | Teachings | Effort | Status |
|-------|-------|-----------|--------|--------|
| 1 | `001-mk-plugins-config-uplift` | H-5 + M-6 | ~3-4h | Planned (council-gated) |
| 2 | `002-sk-code-review-uplift` | M-1 + M-2 | ~2-3h | Planned (council-gated) |
| 3 | `003-deep-review-uplift` | H-7 + H-9 | ~3-4h | Planned (council-gated) |
| 4 | `004-deep-agent-improvement-uplift` | M-3 | ~2h | Planned (council-gated) |

**Pre-implementation gate**: deep-ai-council multi-seat review via cli-codex gpt-5.5 xhigh fast. Council artifact persists to `ai-council/council-report.md`.
<!-- /ANCHOR:iteration-plan -->

---

## 9. RELATED DOCUMENTS

- Source findings: `skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/review-report.md`
- Predecessor: `skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/` (5 quick wins shipped)
- Deferred-from: `108-auto-review-quick-wins-verdict-markers-logging/004-stretch-goals/spec.md`
- Phase children: `001-mk-plugins-config-uplift/`, `002-sk-code-review-uplift/`, `003-deep-review-uplift/`, `004-deep-agent-improvement-uplift/`
- Council artifacts: `ai-council/council-report.md` (post-review)
- Upstream pinned SHA: `cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9` (dzianisv/opencode-plugins branch issue-136-package-auto-review)
