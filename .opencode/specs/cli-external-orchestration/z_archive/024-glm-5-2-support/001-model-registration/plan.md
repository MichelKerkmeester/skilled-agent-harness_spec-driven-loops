---
title: "Implementation Plan: Phase 1: model-registration"
description: "Discover the live Z.AI Coding Plan provider id + GLM-5.2 slug, then apply ~10 scoped edits under .opencode/skills/ to register glm-5.2, following the Adopting a New Provider checklist."
trigger_phrases:
  - "glm-5.2"
  - "zai-coding-plan"
  - "model registration plan"
  - "adopting a new provider"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/001-model-registration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Registration edits applied across 10 surfaces; verified"
    next_safe_action: "Begin 002-framework-bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/sk-prompt-models/references/pattern_index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/001-model-registration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: model-registration

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown + JSON config (skill metadata) |
| **Framework** | sk-prompt-models + cli-opencode skill surfaces |
| **Storage** | None (file-based skill config and routing graph metadata) |
| **Testing** | Card-sync guard shell, node JSON.parse, advisor routing probe, live smoke dispatch |

### Overview
Discover-first, then register. Step one runs `opencode providers list` + `opencode models <provider>` to capture the live Z.AI provider id, GLM-5.2 slug, context window, max output, and billing model — no value is fabricated. Step two applies ~10 scoped edits under `.opencode/skills/` to register `glm-5.2` as a first-class small model, following the canonical "Adopting a New Provider" checklist (pattern_index.md §4, 9 steps) plus the cli-opencode auth/selection surfaces (which the Kimi phase 1 also touched beyond the 9 steps). Verify with the card-sync guard, JSON parsing, advisor re-index, and a live smoke dispatch.

### Expected live values (UNVERIFIED — from Z.AI official docs via research dispatch; phase-1 discovery confirms or corrects)

| Field | Expected (unverified) | Confirm with |
|-------|-----------------------|--------------|
| Provider id | `zai-coding-plan` | `opencode providers list` / `opencode auth login` → "Z.AI Coding Plan (api)" |
| Model slug | `zai-coding-plan/glm-5.2` (raw id `glm-5.2`) | `opencode models zai-coding-plan` |
| Context window | 1,000,000 (1M) | `opencode models <provider>` |
| Max output | 131,072 (128K) | `opencode models <provider>` |
| Billing/auth | Subscription Coding Plan via Z.AI API key + coding endpoint `https://api.z.ai/api/coding/paas/v4` | `opencode providers` |
| Reasoning control | Official `reasoning_effort` (`high`, `max`); map to opencode `--variant` only after live confirm | smoke dispatch with/without `--variant` |

> All of the above are official-doc-sourced expectations, NOT live-confirmed on this install. The discovery step is a P0 gate: if the live id differs, the live id wins and every edit uses it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (provider auth confirmable)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (card-sync exit 0, JSON parses, smoke dispatch returns)
- [x] Docs updated (spec/plan/tasks + implementation-summary written at close)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill-config registration. The two-tier prompt-knowledge layout keeps tables in the registry/profile/index and a pointer-only profile per model; card-sync enforces the split. New-model adoption is a documented checklist, not a code change.

### Key Components
- **model_profiles.json**: The single registry of small-model entries (executor → provider → pool, capability block, recommended frameworks).
- **references/models/**: Per-model prompt-craft profiles plus the ACTIVE `_index.md`.
- **SKILL.md** (both skills): Activation triggers, MODEL_ALIASES resolution, §3 dispatch matrix, and cli-opencode auth/selection surfaces.
- **graph-metadata.json (x2)**: Routing graph metadata that the skill advisor indexes for discovery.
- **assets/prompt_quality_card.md** (cli-opencode): model-selection table linking to the profile — **note a legacy `glm-5.1` row exists here and must be reconciled** (upgrade/replace to glm-5.2 or document why both stay).

### Data Flow
1. A request names GLM-5.2 (slug or alias).
2. SKILL.md MODEL_ALIASES resolves the alias to the registry key `glm-5.2`.
3. model_profiles.json supplies the executor/provider/pool and recommended frameworks.
4. The skill advisor uses graph-metadata trigger_phrases/key_topics to route the request to sk-prompt-models + cli-opencode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a registration change, not a bug fix. The table tracks the surfaces that observe the model registry so the edits stay coherent.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| model_profiles.json | Registry of small-model entries (producer) | Add glm-5.2 entry; update registry description rotation line | node JSON.parse clean; card-sync CHECK |
| references/models/glm-5.2.md | Per-model prompt-craft profile (new) | Create from the per-model template; framework CRAFT default-unverified | card-sync (profile present) |
| references/models/_index.md | ACTIVE index (consumer) | Add glm-5.2 row | card-sync (index complete) |
| SKILL.md MODEL_ALIASES + §3 matrix | Alias + dispatch lookup (consumer) | Add aliases + matrix row + ACTIVE-set rule | card-sync (discoverability) |
| pattern_index.md §3 | Ownership boundary prose | Add GLM/Z.AI to the cli-opencode surface line | review |
| graph-metadata.json (x2) | Advisor routing graph (consumer) | Add trigger_phrases / key_topics / intent_signals | Advisor re-index + routing probe |
| cli-opencode SKILL.md + cli_reference.md | Auth pre-flight + model selection + provider table | Add Z.AI provider rows, login template, selection paragraph | review; smoke dispatch |
| cli-opencode prompt_quality_card.md | Model-selection table | Add glm-5.2 row; reconcile legacy glm-5.1 row | card-sync (thin mirror invariant) |

Inventory used during implementation:
- Same-class producers: `rg -n 'glm-5\.|zai|z\.ai' .opencode/skills/sk-prompt-models .opencode/skills/cli-opencode` to find every existing GLM/Z.AI reference (incl. the legacy glm-5.1 row).
- Consumers of the alias: confirm a bare `glm` alias resolves to glm-5.2 after the edit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery & Setup
- [ ] Confirm the Z.AI Coding Plan provider is authed (`opencode providers list`) — capture the exact provider id
- [ ] Capture live GLM-5.2 facts (`opencode models <provider>`): slug, context window, max output, display name
- [ ] Determine billing (subscription vs pay-per-token) and whether `--variant` maps to `reasoning_effort`
- [ ] Read the "Adopting a New Provider" checklist (pattern_index.md §4, steps 1-9)
- [ ] Inventory existing GLM/Z.AI references (`rg -n 'glm-5\.|zai|z\.ai'`) — note the legacy glm-5.1 row in prompt_quality_card.md

### Phase 2: Core Implementation
- [ ] Add the `glm-5.2` entry to model_profiles.json (capability block, executor → provider → pool, recommended_frameworks CRAFT/TIDD-EC/avoid RACE at `default-unverified`); update the registry description rotation line
- [ ] Create `references/models/glm-5.2.md` from the per-model template (CRAFT default-unverified; fold in Z.AI prompting guidance as guidance + the GLM dispatch quirks: thinking-on-by-default, reasoning_effort high/max, preserved thinking, tool_choice=auto, tool_stream for streaming)
- [ ] Update `_index.md` (ACTIVE row), SKILL.md (frontmatter/keywords/MODEL_ALIASES/§3 matrix/ACTIVE-set rule), and pattern_index.md §3 ownership line
- [ ] Update both graph-metadata.json files (trigger_phrases / key_topics / intent_signals)
- [ ] Update cli-opencode SKILL.md (auth pre-flight grep, login-template list, Model Selection paragraph) + cli_reference.md (provider table, selection examples, variant table) + prompt_quality_card.md (glm-5.2 row, reconcile legacy glm-5.1)

### Phase 3: Verification
- [ ] Live smoke dispatch returns "pong" at exit 0 (`opencode run --model <provider>/glm-5.2`); record billing/cost
- [ ] Card-sync guard exit 0 (`check-prompt-quality-card-sync.sh .`); all edited JSON parses clean
- [ ] Advisor re-indexed (`skill_advisor.py --force-refresh`); routing probe surfaces sk-prompt-models + cli-opencode
- [ ] Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Registry/profile/index/discoverability completeness | `check-prompt-quality-card-sync.sh .` |
| Parse | All edited JSON files | `node` JSON.parse |
| Routing | Advisor surfaces the right skills for a GLM-5.2 prompt | `skill_advisor.py --force-refresh` + routing probe |
| Manual | Live model dispatch | `opencode run --model <provider>/glm-5.2` smoke test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Z.AI Coding Plan provider auth | External | To confirm | No dispatch or smoke test possible |
| Card-sync guard script | Internal | Available | Cannot verify registration completeness |
| Skill advisor index | Internal | Available | Model not routable by name |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Card-sync guard fails, smoke dispatch breaks, or the registration confuses model routing.
- **Procedure**: Revert the edits under `.opencode/skills/` (git checkout the two skill subtrees); the change is config-only with no data migration, so revert fully restores the prior state. Re-run the card-sync guard to confirm green.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
