---
title: "Operator Surface Realignment: INSTALL_GUIDE plus install.sh plus /doctor to post-CocoIndex Reality"
description: "Realigned the system-spec-kit install guide, setup scripts and /doctor command surface (both .opencode and .claude mirror trees) to match post-CocoIndex and post-116 reality. The route-validate.sh F2 gate now runs and passes in both runtime trees."
trigger_phrases:
  - "operator surface realignment"
  - "install guide cross-encoder mmr"
  - "doctor command realignment post-cocoindex"
  - "route-validate f2 gate fix"
  - "doctor mirror .opencode .claude"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/002-operator-surface-realignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment`

### Summary

The system-spec-kit install guide, setup scripts and /doctor command surface had drifted to describe infrastructure that no longer existed. INSTALL_GUIDE.md still advertised cross-encoder reranking and pointed code-graph DB rows at a stale path. The route-validate.sh F2 tool-subset gate was silently skipped because ROUTER_FILE pointed at a deleted file. The /doctor menu listed a "Debug Code Graph (semantic search daemon)" option that referenced the removed CocoIndex daemon.

The INSTALL_GUIDE.md was updated to replace the cross-encoder description with Stage-3 MMR diversity and MPAB. Its three code-graph DB rows now point at the canonical `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`. The install.sh help text dropped the cross-encoder phrase. test-council-matrix.sh was corrected from the renamed-away `sk-ai-council` to `deep-ai-council`. Both /doctor runtime trees (.opencode and .claude full mirror) received aligned updates: code-graph and deep-loop DB paths corrected, advisor tool references updated to `mcp__mk_skill_advisor__advisor_*`, the dead menu option removed and remaining options renumbered, `mpc-doctor.sh` tool count corrected from 11 to 8, includeSkills glob updated to cover renamed deep-* skills. The ROUTER_FILE fix makes the F2 gate run again. Both route validators now pass.

### Added

- None.

### Changed

- INSTALL_GUIDE.md stage-3 reranking description: from cross-encoder to MMR diversity plus MPAB
- INSTALL_GUIDE.md code-graph DB rows: from stale `system-code-graph/database/` path to canonical `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- install.sh help text: removed cross-encoder phrase at line 280
- test-council-matrix.sh council name: from `sk-ai-council` to `deep-ai-council`
- /doctor command surface (both runtime trees): code-graph and deep-loop DB paths, advisor tool namespace, menu option renumbering, mpc-doctor.sh tool count, includeSkills glob and route-validate.sh ROUTER_FILE

### Fixed

- route-validate.sh ROUTER_FILE pointed at `$COMMANDS_DIR/doctor.md` (deleted file). Corrected to `$DOCTOR_DIR/speckit.md` so the F2 tool-subset gate now executes.
- /doctor no-arg menu listed "Debug Code Graph (semantic search daemon)" option referencing the removed CocoIndex daemon. Option removed and remaining options renumbered (7 to 6, 8 to 7).
- mpc-doctor.sh tool count was 11. Corrected to 8 to match the post-CocoIndex tool set.

### Verification

- `.opencode` route-validate.sh: PASS. F2 (tool-subset) now runs and passes.
- `.claude` route-validate.sh: PASS. F2 passes.
- Residual stale-token sweep (both trees + install guide): ZERO. Only the intentional past-tense cross-encoder note in INSTALL_GUIDE:720 remains.
- ASCII box alignment (INSTALL_GUIDE:83): PASS. 71 bytes, matches sibling lines.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Cross-encoder replaced by MMR description. 3 code-graph DB rows updated to canonical `.spec-kit` path. |
| `.opencode/skills/system-spec-kit/scripts/setup/install.sh` | Modified | Removed cross-encoder help phrase at line 280 |
| `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh` | Modified | Council name corrected from `sk-ai-council` to `deep-ai-council` |
| `.opencode/commands/doctor/_routes.yaml` | Modified | DB paths, ROUTER_FILE, advisor tool namespace updated |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml` | Modified | includeSkills glob updated to cover renamed deep-* skills |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Modified | Deep-loop DB paths corrected to `.opencode/skills/deep-loop-runtime/database/` |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Modified | Advisor tools updated to `mcp__mk_skill_advisor__advisor_*` |
| `.opencode/commands/doctor/scripts/mpc-doctor.sh` | Modified | Tool count corrected from 11 to 8 |
| `.opencode/commands/doctor/scripts/route-validate.sh` | Modified | ROUTER_FILE fixed from deleted `doctor.md` to `speckit.md` |
| `.opencode/commands/doctor/speckit.md` | Modified | Dead menu option removed. Remaining options renumbered. |
| `.claude/commands/doctor/**` | Modified | Full mirror of all .opencode doctor changes applied to .claude tree |

### Follow-Ups

- Verify the `.claude` mirror stays in sync with `.opencode` doctor changes when future /doctor updates ship.
- Confirm `test-council-matrix.sh` passes in CI after the `deep-ai-council` rename correction.
