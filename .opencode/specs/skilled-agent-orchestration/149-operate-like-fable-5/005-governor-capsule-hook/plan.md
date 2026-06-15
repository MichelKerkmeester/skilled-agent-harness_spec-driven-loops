---
title: "Implementation Plan: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder"
description: "Create a canonical governor-rules doc, add a bounded ~90-word capsule constant beside the existing comment-hygiene directive in the skill-advisor render path, append it on the same per-turn reminder emission, rebuild the advisor artifact, and verify by render assertion and word-count test."
trigger_phrases:
  - "fable-5 governor capsule plan"
  - "render.ts governor capsule"
  - "skill-advisor reminder governor"
  - "B2 implementation plan"
  - "fable-governor.md plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-operate-like-fable-5/005-governor-capsule-hook"
    last_updated_at: "2026-06-15T14:06:37Z"
    last_updated_by: "planning-author"
    recent_action: "Authored implementation plan for the B2 governor capsule"
    next_safe_action: "Execute step 1: write fable-governor.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/constitutional/fable-governor.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-skilled-agent-orchestration/149-operate-like-fable-5/005-governor-capsule-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (skill-advisor MCP server) + Markdown (constitutional doc) |
| **Framework** | skill-advisor `render` library; hook carriers in Claude/Codex `user-prompt-submit.ts` and the OpenCode `experimental.chat.system.transform` bridge |
| **Storage** | None (the capsule is a static compiled constant; the doc is a flat file) |
| **Testing** | `vitest` for the render assertion and word-count bound; `validate.sh` for spec-folder discipline |

### Overview
Add a compact, generic, ~90-word 4-rule fable-5 governor capsule to the per-turn skill-advisor reminder by mirroring the exact pattern that already ships the comment-hygiene directive (`render.ts:51-53`): a static constant injected into every advisor brief. A new canonical doc, `fable-governor.md`, holds the human-reviewable rules and names the 3 cross-runtime hook carriers; `render.ts` gains the capsule constant and appends it on the same emission path, after which the advisor artifact is rebuilt and verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (the per-turn channel exists; the doctrine decays on cold surfaces)
- [ ] Success criteria measurable (capsule present in render output; <=~90 words; generic)
- [ ] Dependencies identified (003 baseline before/after; 004 doctrine spine complement; 006 owns the subagent channel)

### Definition of Done
- [ ] The capsule surfaces in the rendered per-turn advisor reminder (REQ-001)
- [ ] `vitest` render + word-count assertions pass and the existing render suite still passes (REQ-003, REQ-007)
- [ ] The advisor artifact is rebuilt and ships the capsule (REQ-004)
- [ ] Spec/plan/tasks/checklist synchronized and `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Static-constant injection on an existing per-turn emission path — the same advisory-text-on-a-hot-surface pattern already used for the comment-hygiene directive. No new component, no new transport.

### Key Components
- **`fable-governor.md` (new doc)**: Canonical, human-reviewable source-of-truth for the 4 generic rules plus the inherited G4 honesty guardrail and the 3 hook-carrier notes.
- **`render.ts` capsule constant + append (edit)**: The runtime source-of-truth string, placed next to `HYGIENE_DIRECTIVE`, appended on the same reminder the advisor already emits.
- **Hook carriers (unchanged, documented)**: Claude/Codex `user-prompt-submit.ts` `additionalContext` and the OpenCode `experimental.chat.system.transform` bridge already relay whatever the render path emits, so they need no edit.

### Data Flow
UserPromptSubmit fires the skill-advisor hook -> the render path builds the advisor brief and appends the comment-hygiene directive plus the new governor capsule -> the carrier (`additionalContext` on Claude/Codex, `chat.system.transform` on OpenCode) injects the reminder into the turn. The capsule is stateless and identical every turn.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `render.ts` reminder path (producer) | Builds the advisor brief and appends `HYGIENE_DIRECTIVE` on every turn | update: add a governor-capsule constant and append it on the same emission | `vitest` assertion that the rendered output contains the capsule |
| `fable-governor.md` (policy doc) | Does not exist yet | create: canonical 4-rule source-of-truth + G4 guardrail + 3 carrier notes | file present; rules match the render constant by review |
| Claude/Codex `user-prompt-submit.ts` `additionalContext` (consumer) | Relays whatever the render path emits | unchanged (carries the new text automatically) | grep that the carrier reads the render output, not a separate hardcoded string |
| OpenCode `experimental.chat.system.transform` bridge (consumer) | Relays the per-turn reminder on OpenCode | unchanged (carries the new text automatically) | grep/doc that the bridge sources from the same render path |
| Existing render `vitest` suite (tests) | Asserts hygiene directive, sanitization, token cap | update: add capsule + word-count assertions; keep prior assertions green | full render suite passes |

Required inventories:
- Same-class producers (other reminder/directive constants): `rg -n "DIRECTIVE|reminder|additionalContext" .opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`.
- Consumers of the reminder string: `rg -n "renderAdvisorBrief|HYGIENE_DIRECTIVE|governor" .opencode/skills/system-skill-advisor --glob '*.ts'` and the two hook entry files.
- Matrix axes: render with (no recommendation) x (ambiguity signal) x (timeout fallback) — capsule must be present on the normal brief in all non-fallback rows.
- Invariant: the capsule is a static, post-sanitization constant; it never depends on user input, so it adds no injection surface.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the canonical governor doc
- [ ] Step 1 — Create `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` with the 4 generic rules (problem-not-self; outcome-over-process / result-first; commit-and-move with `// DECISION:`; minimum honest qualifier), the inherited G4 efficiency-not-capability guardrail, and notes on the 3 hook carriers. Verify: file exists and reads as standalone doctrine.

### Phase 2: Surface the capsule on the hook
- [ ] Step 2 — In `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`, add a `GOVERNOR_CAPSULE` constant directly beside `HYGIENE_DIRECTIVE` (render.ts:51-53), with the comment explaining WHY it ships on the hot path. Verify: `tsc` / typecheck clean.
- [ ] Step 3 — Append the capsule on the same per-turn reminder emission that already carries `HYGIENE_DIRECTIVE`, so all hook-capable runtimes receive it. Verify: render assertion that the brief contains the capsule.
- [ ] Step 4 — Rebuild the compiled advisor artifact. Verify: build succeeds and the built artifact contains the capsule text.

### Phase 3: Verification
- [ ] Step 5 — Add a `vitest` assertion that the capsule is present in the rendered brief and a word-count assertion that the capsule paragraph is <=~90 words and contains no model-family name. Verify: new tests pass.
- [ ] Step 6 — Run the full render `vitest` suite plus `validate.sh --strict`; confirm the hygiene directive and prior reminder behavior are unchanged. Verify: all green, no regressions vs the 003 baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Render output contains the capsule; capsule paragraph is <=~90 words and model-name-free | `vitest` |
| Integration | Existing render suite (hygiene directive present, sanitization, token-cap clamp) still green; rebuilt artifact ships the capsule | `vitest` + build check |
| Manual | Trigger UserPromptSubmit and confirm the reminder text carries the capsule on Claude/Codex/OpenCode | runtime hook inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 measurement baseline (C1) | Internal | Yellow | Without a before-number, the capsule's effect is asserted not proven; capsule still ships but the win is unmeasured. |
| Phase 004 doctrine spine + creed (A2) | Internal | Green | Capsule reads correctly standalone; 004 makes the cold-surface setpoint that this capsule re-asserts. |
| Phase 006 subagent governor (B3) | Internal | Green | Out of scope here; the hook is subagent-blind, so subagent coverage waits on 006. |
| skill-advisor render path + build | Internal | Green | The whole change rides this; it already fires the hygiene directive, so the path is proven. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The capsule causes reminder bloat/truncation, reads as a capability throttle, or the rebuilt artifact regresses an existing render test.
- **Procedure**: Revert the `render.ts` constant + append and rebuild; optionally keep `fable-governor.md` (a standalone doc is harmless). No data, schema, or migration to reverse.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author doc) ──► Phase 2 (Surface on hook + rebuild) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author doc | None | Surface on hook |
| Surface on hook + rebuild | Author doc (rule text is source-of-truth) | Verify |
| Verify | Surface on hook | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author doc | Low | ~30-45 min (write 4 rules + guardrail + carrier notes) |
| Surface on hook + rebuild | Low | ~45-60 min (one constant, one append, rebuild) |
| Verification | Low | ~45 min (render + word-count tests, full suite, validate) |
| **Total** | | **~2-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data change, so no backup required (text-only constant + doc)
- [ ] No feature flag needed (advisory text; revert is a single constant)
- [ ] Render `vitest` suite green before rebuild ships

### Rollback Procedure
1. Remove the `GOVERNOR_CAPSULE` append from the reminder emission in `render.ts`.
2. Rebuild the advisor artifact so the prior reminder string ships again.
3. Run the render `vitest` suite to confirm the hygiene directive and prior behavior are intact.
4. No stakeholder notice needed; the change is internal reminder text.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no persisted state; reverting the constant fully reverses the change)
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

