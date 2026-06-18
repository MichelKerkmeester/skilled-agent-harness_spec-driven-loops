---
title: "Implementation Plan: Phase 1: model-registration"
description: "Apply eight scoped edits under .opencode/skills/ to register kimi-k2.7-code and retire kimi-k2.6, following the Adopting a New Provider checklist."
trigger_phrases:
  - "kimi-k2.7-code"
  - "kimi-for-coding"
  - "model registration plan"
  - "adopting a new provider"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/001-model-registration"
    last_updated_at: "2026-06-15T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Executed the 8-file registration edit plan, steps 1-8"
    next_safe_action: "Begin 002-framework-bakeoff prompt-framework bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-small-model/references/pattern-index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-model-registration"
      parent_session_id: null
    completion_pct: 100
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
| **Framework** | sk-prompt-small-model + cli-opencode skill surfaces |
| **Storage** | None (file-based skill config and routing graph metadata) |
| **Testing** | Card-sync guard shell, node JSON.parse, advisor routing probe, live smoke dispatch |

### Overview
Apply eight scoped edits under `.opencode/skills/` to register `kimi-k2.7-code` as a first-class small model and retire `kimi-k2.6` in place. The approach follows the canonical "Adopting a New Provider" checklist (steps 1-8) and mirrors the existing minimax-2.7 retire precedent, then verifies with the card-sync guard, JSON parsing, advisor re-index, and a live smoke dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (card-sync exit 0, JSON parses, smoke dispatch returns)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill-config registration. The two-tier prompt-knowledge layout keeps tables in the registry/profile/index and a pointer-only profile per model; card-sync enforces the split.

### Key Components
- **model-profiles.json**: The single registry of small-model entries (executor -> provider -> pool, capability block, recommended frameworks).
- **references/models/**: Per-model prompt-craft profiles plus the ACTIVE/Historical `_index.md`.
- **SKILL.md**: Activation triggers, MODEL_ALIASES resolution, and the §3 dispatch matrix.
- **graph-metadata.json (x2)**: Routing graph metadata that the skill advisor indexes for discovery.

### Data Flow
1. A request names a model (slug or alias).
2. SKILL.md MODEL_ALIASES resolves the alias to a registry key.
3. model-profiles.json supplies the executor/provider/pool and recommended frameworks.
4. The skill advisor uses graph-metadata trigger_phrases/key_topics to route the request to the right skills.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a registration change, not a bug fix or security-class change. The table below tracks the surfaces that observe the model registry so the edits stay coherent rather than to satisfy a fix-class invariant.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| model-profiles.json | Registry of small-model entries (producer) | Update: add kimi-k2.7-code, retire kimi-k2.6 | node JSON.parse clean; card-sync CHECK 3 |
| references/models/_index.md | ACTIVE/Historical index (consumer) | Update: move entries between tables | card-sync CHECK 3 (index complete) |
| SKILL.md MODEL_ALIASES + §3 matrix | Alias + dispatch lookup (consumer) | Update: repoint `kimi`, add aliases + matrix row | card-sync CHECK 4 (discoverability) |
| graph-metadata.json (x2) | Advisor routing graph (consumer) | Update: trigger_phrases / key_topics | Advisor re-index + routing probe surfaces both skills |

Inventory used during implementation:
- Same-class producers: `rg -n 'kimi-k2' .opencode/skills/sk-prompt-small-model .opencode/skills/cli-opencode` to find every Kimi reference touched.
- Consumers of the alias: confirmed the bare `kimi` alias resolves to kimi-k2.7-code after the repoint.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed `kimi-for-coding` provider authed and slug `kimi-for-coding/k2p7` live (`opencode models kimi-for-coding`)
- [x] Read the "Adopting a New Provider" checklist (pattern-index.md §4, steps 1-8)
- [x] Captured live facts: context 262144, output 32768, display name "Kimi K2.7 Code"

### Phase 2: Core Implementation
- [x] Added the `kimi-k2.7-code` entry to model-profiles.json and updated the registry description rotation line
- [x] Created the references profile and added the HISTORICAL banner to kimi-k2.6.md; updated _index.md tables
- [x] Updated SKILL.md (frontmatter, keywords, triggers, MODEL_ALIASES, §3 matrix row) and both graph-metadata.json files
- [x] Retired kimi-k2.6 in place (status historical, bare `kimi` alias repointed, profile + index row kept)

### Phase 3: Verification
- [x] Live smoke dispatch returns "pong" at exit 0, cost 0
- [x] Card-sync guard exit 0; all edited JSON parses clean
- [x] Advisor re-indexed; routing probe surfaces sk-prompt-small-model + cli-opencode
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Registry/profile/index/discoverability completeness | `check-prompt-quality-card-sync.sh .` |
| Parse | All edited JSON files | `node` JSON.parse |
| Routing | Advisor surfaces the right skills for a Kimi prompt | `skill_advisor.py --force-refresh` + routing probe |
| Manual | Live model dispatch | `opencode run --model kimi-for-coding/k2p7` smoke test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `kimi-for-coding` provider | External | Green | No dispatch or smoke test possible |
| Card-sync guard script | Internal | Green | Cannot verify registration completeness |
| Skill advisor index | Internal | Green | Model not routable by name |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Card-sync guard fails, smoke dispatch breaks, or the registration confuses model routing.
- **Procedure**: Revert the eight edits under `.opencode/skills/` (git checkout the two skill subtrees); the change is config-only with no data migration, so revert fully restores the prior state. Re-run the card-sync guard to confirm green.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

