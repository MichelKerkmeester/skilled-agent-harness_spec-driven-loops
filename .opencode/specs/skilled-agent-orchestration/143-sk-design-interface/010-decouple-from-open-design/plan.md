---
title: "Implementation Plan: Phase 10: decouple-from-open-design [template:level_1/plan.md]"
description: "Plan to split the shared parity doc and strip Open Design naming from sk-design-interface so it stands alone, with one-way coupling preserved from mcp-open-design."
trigger_phrases:
  - "decouple open design plan"
  - "split parity doc plan"
  - "phase 010 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/010-decouple-from-open-design"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Split parity doc, stripped Open Design naming, repointed consumers"
    next_safe_action: "Strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/references/design-process/real_ui_loop.md"
      - ".opencode/skills/mcp-open-design/references/design_parity_transport.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-010-decouple-from-open-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: decouple-from-open-design

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
| **Language/Stack** | Markdown skill docs across three skills |
| **Framework** | OpenCode skill contract; sk-doc validators; spec-kit |
| **Storage** | `.opencode/skills/{sk-design-interface,mcp-open-design,sk-prompt}/` |
| **Testing** | grep for residual Open Design naming; sk-doc validators; `validate.sh --strict` |

### Overview
Split the seam doc so the generic design-judgment loop stays in `sk-design-interface` (renamed, vendor-neutral) while the Open Design transport mechanics move into `mcp-open-design`. Then strip every Open Design / `mcp-open-design` name from this skill's content and repoint all consumers, keeping the one-way mandatory coupling from `mcp-open-design` fully intact.
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
- [x] Tests passing (grep clean, validators green)
- [x] Docs updated (split docs, version, changelog)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ownership move: the integration becomes wholly owned by the consumer (`mcp-open-design`), so the judgment skill stays generic and portable.

### Key Components
- **`real_ui_loop.md`** (sk-design-interface): the transport-agnostic loop, vendor-neutral, §6/§7/§8 preserved
- **`design_parity_transport.md`** (mcp-open-design): the `od`/`previewUrl`/`get_run` mechanics, points back to real_ui_loop.md
- **Naming strip**: SKILL.md, README, design_inventory.md, design_references_mcp.md, variation_diversity.md, feature_catalog, manual_testing_playbook, graph-metadata.json
- **Repoints**: mcp-open-design (5), sk-prompt (1)

### Data Flow
A standalone reader of sk-design-interface sees only generic grounding (a real design system you own) + Mobbin/Refero. A framework user doing Open Design work routes through mcp-open-design, which mandates this skill and owns the transport doc that plugs into real_ui_loop.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Split
- [x] `git mv` claude_design_parity.md -> real_ui_loop.md; rewrite vendor-neutral
- [x] Create mcp-open-design/references/design_parity_transport.md

### Phase 2: Strip + repoint
- [x] Strip Open Design naming from sk-design-interface content (primary surfaces + feature_catalog + playbook)
- [x] Repoint mcp-open-design (5 refs) and sk-prompt (1 ref); update internal refs
- [x] graph-metadata.json: drop mcp-open-design edges/related_to

### Phase 3: Version + verify
- [x] Version bumps + changelogs (both skills)
- [x] grep clean; sk-doc validators; strict validate; reconcile parent map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Standalone | No Open Design naming in sk-design-interface live content | `rg -i` over the skill (excl. changelog) |
| Reverse coupling | mcp-open-design still mandates sk-design-interface | `rg 'sk-design-interface' mcp-open-design/SKILL.md` |
| Link integrity | Repointed refs resolve | `rg 'claude_design_parity'` repo-wide; check files exist |
| Structure | Docs + phase validate | sk-doc validators; `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp-open-design` reverse coupling | Internal | Green | Must stay intact; only the parity-doc path moves |
| `sk-prompt` parity citation | Internal | Green | Repoint to real_ui_loop.md |
| sk-doc validators | Tooling | Green | Confirm README/catalog/playbook structure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A standalone or framework consumer breaks on a moved/renamed doc.
- **Procedure**: Revert from git; the change is documentation-only. The split is the one structural move; reverting the rename + the new transport doc restores the prior coupling.
<!-- /ANCHOR:rollback -->
