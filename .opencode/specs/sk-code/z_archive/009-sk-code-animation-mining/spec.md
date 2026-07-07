---
title: "Feature Specification: sk-code Animation Surface Mining (web-motion-skill)"
description: "Mine the MIT-licensed Schmandarine/web-motion-skill repo for animation guidance sk-code lacks — the design-principle layer (easing/timing/stagger/anticipation), GSAP-adjacent patterns, and the visual-verification workflow — and add only the genuinely-additive parts to sk-code's Motion.dev/animation references, assets, and routing. The deep analysis + draft implementation are outsourced to gpt-5.5-fast (xhigh) in an isolated worktree; integration into main is reviewed and drift-guard-validated."
trigger_phrases:
  - "sk-code animation mining"
  - "web-motion-skill"
  - "animation principles reference"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/009-sk-code-animation-mining"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Opened the phase; outsourcing analysis + draft impl to gpt-5.5-fast xhigh in a worktree"
    next_safe_action: "Dispatch gpt-5.5 in the wt/0006 worktree; then review the diff + integrate to main"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/motion_dev/"
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/sk-code/assets/motion_dev/snippets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-animation-mining"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which of web-motion-skill's parts are genuinely additive vs already covered by sk-code's 6 motion_dev refs + decision_matrix + performance_and_pitfalls?"
    answered_questions: []
---
# Feature Specification: sk-code Animation Surface Mining (web-motion-skill)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

`Schmandarine/web-motion-skill` (MIT) is an agent-vision animation *debugging* skill (record page → extract frames → contact-sheet → visual analysis). Its portable, sk-code-relevant value is the layer sk-code's API-centric Motion.dev refs do NOT cover: the **"12 Principles, web-adapted"** (easing curves, duration/timing tables, stagger direction + offsets, anticipation ranges, arc/depth), GSAP-adjacent timing vocabulary, and a **visual-verification workflow** for animations. This phase mines that repo and adds ONLY the genuinely-additive parts to sk-code's animation references / assets / routing, additive-only and MIT-attributed.

**Critical Dependencies**: sk-code's current animation surface (`references/motion_dev/*` — quick_start, animate_and_timelines, scroll_and_gestures, integration_patterns, decision_matrix, performance_and_pitfalls; `assets/motion_dev/snippets/*`; `references/webflow/implementation/animation_workflows.md`), the §11 machine-readable router + the `sk-code-router-sync.vitest.ts` drift guard, and the MIT license of the source repo.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 |
| **Status** | Complete — mined + integrated, drift green |
| **Created** | 2026-06-02 |
| **Branch** | `main` (impl staged in `wt/0006-sk-code-animation`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code's Motion.dev surface is strong on *API how-to* (animate/timelines, scroll/gestures, integration, a decision matrix, performance pitfalls) but light on the *design-principle* layer — when/why to use a given easing, concrete duration/stagger values, anticipation/arc guidance — and has no animation-specific visual-verification recipe. web-motion-skill encodes exactly that layer.

### Purpose
Enrich sk-code's animation guidance with the additive, well-sourced parts of web-motion-skill, without duplicating what sk-code already covers, without regressing the router/drift guard, and with proper MIT attribution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- gpt-5.5-fast (xhigh, cli-opencode) clones + deep-analyzes web-motion-skill vs sk-code's animation surface and identifies the additive delta.
- It drafts/implements the additive artifacts in an isolated worktree: a new animation-principles reference (easing/timing/stagger/anticipation), any net-new snippet(s), and an optional visual-verification recipe; plus the `smart_routing.md` §5/§11 wiring.
- Reviewed integration into main + drift-guard validation + MIT attribution.

### Out of Scope
- Re-documenting what sk-code already covers (the 6 motion_dev refs / decision_matrix / performance_and_pitfalls).
- Adopting web-motion-skill's recording/contact-sheet *scripts* wholesale (sk-code already has bdg/chrome-devtools verification) — only the *recipe/guidance* if additive.
- Any non-animation sk-code change.

### Files to Change (staged in worktree, then integrated)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code/references/motion_dev/<new principles ref>.md` | Create | The web-adapted animation principles (easing/timing/stagger/anticipation) |
| `sk-code/assets/motion_dev/snippets/<net-new>.js` | Create (if additive) | Any snippet not already present |
| `sk-code/references/smart_routing.md` | Modify | §5 MOTION_DEV map + §11 RESOURCE_MAP wiring for the new artifacts |
| `129-.../proposals/` | Create | gpt-5.5's analysis + rationale + attribution (audit trail) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Additive-only mining | Every added artifact is genuinely NOT covered by sk-code's existing animation surface; no duplication |
| REQ-002 | Router wiring + drift green | Every new ref/asset is mapped under §11 (ANIMATION/MOTION_DEV/PERFORMANCE) and `sk-code-router-sync.vitest.ts` stays green |
| REQ-003 | RM-8 isolation | The gpt-5.5 `--dangerously-skip-permissions` dispatch runs in a fresh worktree with a scoped BANNED/ALLOWED prompt; main is untouched until reviewed integration |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | MIT attribution | New artifacts credit web-motion-skill (MIT) in a notice line; the decision-record records provenance |
| REQ-005 | Reviewed integration | The worktree diff is human-reviewed before anything lands in main; weak/duplicative drafts are dropped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-code gains a concrete, sourced animation-principles layer (easing/timing/stagger) it lacked, wired into the router, drift guard green.
- **SC-002**: No duplication of existing refs; MIT attribution present; main only changed via reviewed integration of the worktree drafts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | gpt-5.5 duplicates existing refs | Medium | Prompt enumerates sk-code's current surface + mandates additive-delta-only |
| Risk | `--dangerously-skip-permissions` damages the repo | High | RM-8 four-layer: worktree (L2) + scoped BANNED/ALLOWED prompt (L1) + HEAD baseline (L3) + gpt-5.5 not deepseek (L4) |
| Risk | New artifact unmapped → drift red | Medium | gpt-5.5 wires §11; I re-run the drift guard in main on integration |
| Dependency | web-motion-skill MIT license | — | Attribution required (REQ-004) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does web-motion-skill's GSAP focus translate cleanly to sk-code's Motion.dev orientation, or does it need re-framing for the Motion.dev API? (gpt-5.5 to assess.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: New refs follow sk-code's lean per-surface loading; they must not bloat a routed Motion.dev slice (one focused principles doc, not a sprawl).

### Security
- **NFR-S01**: The outsourced dispatch is sandboxed to a worktree; no writes to main during analysis/draft.

### Reliability
- **NFR-R01**: The router drift guard (D5 connectivity) stays green after wiring.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A web-motion-skill concept that overlaps ~50% with an existing ref: fold the additive half into the existing ref rather than create a near-duplicate.

### Error Scenarios
- gpt-5.5 produces weak/hallucinated guidance: the reviewed-integration gate drops it; nothing lands in main unvetted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | one principles ref + maybe a snippet + router wiring |
| Risk | 16/25 | --dangerously-skip-permissions (mitigated by worktree) + prod-skill content quality |
| Research | 10/20 | the analysis IS the work, outsourced to gpt-5.5 |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
