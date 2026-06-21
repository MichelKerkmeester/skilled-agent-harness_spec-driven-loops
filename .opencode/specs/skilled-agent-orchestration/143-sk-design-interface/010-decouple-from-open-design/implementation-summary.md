---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. sk-design-interface no longer names mcp-open-design or the Open Design app; the shared parity doc was split (generic real_ui_loop.md stays, Open Design transport moved to mcp-open-design). The reverse mandatory coupling is intact."
trigger_phrases:
  - "decouple open design done"
  - "real_ui_loop split status"
  - "standalone interface design"
  - "impl summary core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/010-decouple-from-open-design"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Decoupled sk-design-interface from Open Design (parity doc split)"
    next_safe_action: "Phase complete; proceed to 011"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-decouple-from-open-design |
| **Status** | DONE - sk-design-interface stands alone; parity doc split; reverse coupling intact |
| **Created** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** `sk-design-interface` had ~101 references to the internal `mcp-open-design` skill and the Open Design app across 23 files. They are gone from its live content; the skill now reads as a standalone, Apache-2.0 design skill an external user can adopt alone. The integration is one-way: `mcp-open-design` still names this skill as its mandatory judgment partner, but this skill knows nothing about it.

### Split the seam doc
- `references/design-process/claude_design_parity.md` was renamed (git mv) to `real_ui_loop.md` and rewritten vendor-neutral: the transport-agnostic loop, the revision grammar, the fidelity-check principle, the handoff manifest, the pre-build gate, and the guardrails, with section numbers (§6/§7/§8) preserved.
- The Open-Design transport mechanics (`od` reads, `od ui respond`, `previewUrl`/`get_run`/`get_artifact`, run self-healing) moved into `mcp-open-design/references/design_parity_transport.md`, which points back to `real_ui_loop.md`.

### Stripped Open Design naming
- `SKILL.md`, `README.md`, `references/design-grounding/design_inventory.md`, `references/design-grounding/design_references_mcp.md`, `references/design-process/variation_diversity.md`, and `graph-metadata.json` were reworded to "a real design system you own" and repointed to `real_ui_loop.md`.
- `feature_catalog/` and `manual_testing_playbook/` were generalized: `open-design-grounding.md` -> `design-system-grounding.md`, the `07--claude-design-parity` group -> `07--real-ui-loop`, the `previewUrl` fidelity scenario -> a `mcp-chrome-devtools` render check. Both sk-doc indexes validate 0 issues.

### Repointed consumers
- `mcp-open-design` (SKILL.md, README, INSTALL_GUIDE, feature_catalog) -> its local `design_parity_transport.md` + `real_ui_loop.md`.
- `sk-prompt/references/design_generation_patterns.md` -> `real_ui_loop.md` (§6/§7/§8 citations preserved).

### Files Changed (summary)

| Area | Action | Purpose |
|------|--------|---------|
| sk-design-interface `references/design-process/real_ui_loop.md` | Renamed+rewritten | The vendor-neutral real-UI loop |
| mcp-open-design `references/design_parity_transport.md` | Created | The Open Design transport half |
| sk-design-interface SKILL/README/references/feature_catalog/playbook/graph-metadata | Modified | Open Design naming stripped; links repointed |
| mcp-open-design SKILL/README/INSTALL_GUIDE/feature_catalog | Modified | Parity-doc refs repointed |
| sk-prompt `design_generation_patterns.md` | Modified | Parity-doc citations repointed |
| both skills `changelog/` + SKILL version | Added/bumped | sk-design-interface v1.4.0.0, mcp-open-design v1.4.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coupling was mapped exhaustively first (101 hits / 23 files), which surfaced the crux: `claude_design_parity.md` mixed generic judgment with Open Design transport. The split followed that seam — generic sections stayed (renamed), transport sections moved — so no judgment was lost and external citations (variation_diversity, sk-prompt) survived by keeping section numbers. The primary advisor-facing surfaces and all cross-skill repoints were done directly; the high-volume feature_catalog + manual_testing_playbook generalization was delegated to a scoped subagent that ran the sk-doc validators and a banned-term grep (both clean). The reverse mandatory coupling in `mcp-open-design` was deliberately left untouched except for the parity-doc path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split (not move whole, not in-place) | The doc mixed generic judgment (belongs here) with transport (belongs to mcp-open-design); splitting keeps each in its right owner |
| Keep section numbers in real_ui_loop.md | variation_diversity and sk-prompt cite §6/§7/§8; preserving numbers avoids breaking those citations |
| Leave mcp-figma references | The user scoped this to Open Design only; mcp-figma stays |
| Leave historical changelogs | They are point-in-time records of the prior coupling |
| Drop mcp-open-design from sk-design-interface's graph edges | A standalone skill should not declare a relationship to an internal skill it no longer names; the reverse edge stays in mcp-open-design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| No Open Design naming in sk-design-interface live content | PASS (`rg -i 'mcp-open-design\|open design\|od mcp'` excl. changelog -> 0) |
| Parity doc split exists and cross-references | PASS (`real_ui_loop.md` + `design_parity_transport.md` present; old doc gone) |
| Reverse mandatory coupling intact | PASS (mcp-open-design SKILL.md banner/gate/RULES still name sk-design-interface) |
| No dangling claude_design_parity links | PASS (repo-wide live refs repointed; only historical changelogs retain the old name) |
| feature_catalog + playbook validators | PASS (sk-doc validate 0 issues on both indexes) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical changelogs still name Open Design.** `sk-design-interface/changelog/v1.1.0.0.md` and `v1.3.0.0.md` describe the prior coupling and were intentionally left as point-in-time records.
2. **The skill-advisor index reflects the old graph until a rescan.** `graph-metadata.json` was updated (mcp-open-design edges dropped); refreshing the advisor graph is a separate maintenance step.
3. **`mcp-figma` is still named** in sk-design-interface (correctly — the user scoped this change to Open Design only).
<!-- /ANCHOR:limitations -->
