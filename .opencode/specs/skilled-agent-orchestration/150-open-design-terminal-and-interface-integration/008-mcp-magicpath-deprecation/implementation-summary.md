---
title: "Implementation Summary: mcp-magicpath deprecation"
description: "Deprecated the mcp-magicpath skill now that mcp-open-design is the live terminal design transport: deleted the 16-file skill folder, rewrote the parity protocol and the prompt design usecase onto mcp-open-design, swept every live reference, dropped the graph sibling edges, bumped three skills, and marked the 147 install packet superseded. Historical records preserved."
trigger_phrases:
  - "mcp-magicpath deprecation summary"
  - "deprecate magicpath outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/008-mcp-magicpath-deprecation"
    last_updated_at: "2026-06-14T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deprecation shipped with package checks and strict validate clean"
    next_safe_action: "Operator reviews the deprecation and the four skill version bumps"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-008-mcp-magicpath-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/008-mcp-magicpath-deprecation |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet deprecated the `mcp-magicpath` skill. mcp-magicpath drove the hosted MagicPath canvas through the `magicpath-ai` CLI. Spec 150 built `mcp-open-design` to drive the installed Open Design desktop app from the terminal, live-verified it in phase 004, and corrected it to the real multi-turn flow in phase 007. With a terminal-native design transport in place, mcp-magicpath is superseded, so this phase removed it and re-centered the shared design protocol on mcp-open-design.

### The removal: the skill folder is gone
The whole `mcp-magicpath` skill folder (16 files) was deleted. mcp-open-design is now the single live design transport, and no live route points at the hosted-canvas mechanism anymore.

### The re-centering: two shared docs onto mcp-open-design
`sk-interface-design/references/claude_design_parity.md` was rewritten so the parity protocol's two members are sk-interface-design (judgment) and mcp-open-design (the Open Design terminal transport). The fidelity check moved off magicpath's `previewImageUrl` and `scripts/design_fidelity.py` and onto mcp-open-design's real `previewUrl`, where the rendered design comes from a completed multi-turn `od run` build and the design files are read with `get_artifact`. `sk-prompt/references/design_generation_patterns.md` dropped the MagicPath canvas-authoring usecase so it now covers the `mcp-open-design` start_run usecase only.

### The sweep: every live reference removed
Live references were swept across sk-interface-design (SKILL.md, README, feature_catalog, manual_testing_playbook, design_inventory.md, graph-metadata), sk-prompt (SKILL.md, README), mcp-open-design (SKILL/README mentions, graph-metadata), mcp-figma (SKILL/README/graph-metadata), and the skills index README. The reciprocal graph sibling edges between mcp-magicpath and the other skills were dropped, and mcp-figma's sibling language was repointed from magicpath to mcp-open-design.

### Version bumps and the superseded packet
sk-interface-design bumped v1.2.0 to v1.3.0, sk-prompt bumped v2.2.0 to v2.3.0, and mcp-open-design bumped v1.1.0 to v1.2.0, each with a matching changelog. The original install packet `147-mcp-magicpath` was marked superseded by spec 150. Historical records were left intact: spec 142 references and the skills' historical changelog entries that mention magicpath were not rewritten.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-magicpath/` | Deleted | The whole skill folder, all 16 files |
| `sk-interface-design/references/claude_design_parity.md` | Modified | Two-member parity onto mcp-open-design, fidelity on previewUrl and get_artifact |
| `sk-interface-design/SKILL.md`, `README.md`, `feature_catalog/*`, `manual_testing_playbook/*`, `design_inventory.md`, `graph-metadata.json` | Modified | Live magicpath references dropped, sibling edge removed, v1.3.0 |
| `sk-interface-design/changelog/v1.3.0.0.md` | Created | Deprecation and re-centering changelog |
| `sk-prompt/references/design_generation_patterns.md` | Modified | mcp-open-design start_run usecase only |
| `sk-prompt/SKILL.md`, `README.md` | Modified | Live magicpath references dropped, v2.3.0 |
| `sk-prompt/changelog/v2.3.0.0.md` | Created | Drop-magicpath-usecase changelog |
| `mcp-open-design/SKILL.md`, `README.md`, `graph-metadata.json` | Modified | magicpath mentions dropped, sibling edge removed, v1.2.0 |
| `mcp-open-design/changelog/v1.2.0.0.md` | Created | Magicpath-deprecation reference changelog |
| `mcp-figma/SKILL.md`, `README.md`, `graph-metadata.json` | Modified | Sibling edge dropped, sibling language repointed to mcp-open-design |
| `.opencode/skills/README.md` | Modified | mcp-magicpath index entry dropped |
| `147-mcp-magicpath/spec.md` | Modified | Marked superseded by spec 150 |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file | Created | Packet control docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A supersede-and-re-center deprecation. mcp-open-design was confirmed as the single live design transport, then the two shared design docs were rewritten onto it, the mcp-magicpath skill folder was deleted, the remaining live references were swept and the graph sibling edges dropped, and the 147 install packet was marked superseded. Each swept reference was classified live or historical first, so removed routing paths and preserved history notes stayed clearly separate. The three skills that changed behavior or routing were version-bumped with a matching changelog each. The MagicPath product and the `magicpath-ai` CLI were untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep both parity members but make the surviving transport mcp-open-design | The parity protocol stays a two-member judgment-plus-transport pair, and only the transport identity changes |
| Move the fidelity check onto the real previewUrl and get_artifact | The mcp-open-design preview is the rendered design from a completed multi-turn build, which is the honest fidelity source |
| Preserve every historical magicpath mention | History is not rewritten, and spec 142 plus historical changelog entries record what the system used to do |
| Defer the skill-advisor sqlite rescan | Dropping the dead node from the graph database is maintenance that can run later without blocking the deprecation |
| Bump only the three skills that changed behavior or routing | mcp-figma's edit is a sibling repoint, not a behavior change, so it carries no version bump |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` (sk-interface-design, sk-prompt, mcp-open-design) | PASS, each skill valid, no warnings |
| Live-reference regression grep | PASS, no live mcp-magicpath reference remains across the skills and the index |
| Historical-record preservation | PASS, spec 142 references and historical changelog entries unchanged |
| Graph sibling edges | PASS, reciprocal mcp-magicpath edges dropped, mcp-figma repointed to mcp-open-design |
| Voice sweep | PASS, no em dashes, no new prose semicolons |
| `validate.sh --strict` (this packet) | PASS, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The skill-advisor sqlite rescan is deferred.** The mcp-magicpath node still lives in `skill-graph.sqlite` until a later rescan drops it. The graph metadata edges are removed now, but the runtime graph database is not yet rebuilt.
2. **Documentation and metadata deprecation, not a code change.** The removal lands by deleting markdown and metadata and re-centering what agents read, not by changing any binary.
3. **Recovery is from version control.** The deleted folder is recoverable only from version-control history, not from a kept copy in the tree.
<!-- /ANCHOR:limitations -->
