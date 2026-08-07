---
title: "sk-doc Conformance Sweep and Template Cleanup"
description: "A coordinated sweep brought 14 manual_testing_playbook directories, 5 feature_catalog directories, 28 reference markdown files plus the templates folder into strict sk-doc conformance using parallel cli-codex dispatches and deterministic sed/awk passes."
trigger_phrases:
  - "sk-doc conformance sweep"
  - "manual testing playbook conformance"
  - "feature catalog cleanup"
  - "templates sharded removal"
  - "stress-test rename stress_test"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/021-sk-doc-conformance-template-sweep` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Most sk-doc-governed surfaces across the tree had drifted from the canonical format that sk-doc itself defines. An audit by 7 parallel cli-codex agents found that 14 of 15 manual_testing_playbook directories, 5 of 7 feature catalogs plus 25 of 33 system-spec-kit references had structural drift. The templates folder also carried legacy artifacts: a `sharded/` multi-file spec format, a hyphen-cased `stress-test/` directory plus an inconsistently cased `level3plus-govern/` addendum.

A four-tier bounded-wave sweep used deterministic sed/awk for mechanical relabeling (Tiers 2a/2b), parallel cli-codex gpt-5.5 high fast dispatches for content-heavy restructures (Tier 2c) plus targeted git operations for template renames and path-reference sweeps (Tier 3). All 17 modified root surfaces passed `validate_document.py` with 0 issues.

### Added

- `templates/stress_test/README.md` per sk-doc README template (Quick Start, Files table, When to Use, Related)
- `mcp-click-up/manual_testing_playbook/` created from scratch with 6 categories and 12 CLU-NNN scenarios with full RCAF prompts
- `system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/` with 3 categories and 4 SAD-NNN scenarios alongside the reclassified `operator_runbook/`
- 107 net new ANCHOR comments across 28 normalized system-spec-kit and sk-code-review reference files

### Changed

- 215 per-feature `^- Prompt:` labels relabeled to `^- RCAF Prompt:` across 8 playbooks (Tier 2a mechanical sed pass)
- 320 system-spec-kit canonical per-feature playbook files: `REFERENCES` sections renamed to `SOURCE FILES`, RCAF labels standardized plus full SCENARIO CONTRACT fields populated
- 303 system-spec-kit feature_catalog files: 676 packet-history annotations stripped, 272 canonical source lines added, 221 `### Tests` sections renamed to `### Validation And Tests`
- `templates/stress-test/` renamed to `templates/stress_test/` (snake_case convention), with the `validate.sh` sharded bypass guard removed
- `templates/addendum/level3plus-govern/` renamed to `templates/addendum/level3-plus-govern/` (consistent dash convention)
- 19 active code files updated for `level3plus-govern` path references, 4 files updated for `stress-test` references
- `.opencode/plugins/README.md` rewritten per sk-doc README template with TOC, OVERVIEW, Quick Start, Current Entrypoints, Bridge Modules plus Related sections

### Fixed

- `templates/sharded/` deleted: 5 legacy multi-file spec format files removed with zero active callers remaining
- 5 duplicate DRV-IDs in sk-deep-review playbook deduped (DRV-015/016/021/022/023 in `04--convergence-and-recovery` renumbered to DRV-030..034)
- `duplicate 14--` directory in system-spec-kit feature_catalog consolidated into `14--pipeline-architecture`. Non-feature `14--stress-testing/README.md` removed.
- 44 skill_advisor files moved from a misnamed directory to `operator_runbook/` to free the canonical `manual_testing_playbook/` slot
- `templates/changelog/README.md` frontmatter trimmed to title and description only (instantiable templates `root.md` and `phase.md` left intact)

### Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on all 17 modified root surfaces | 17/17 pass, 0 issues each |
| Random per-feature playbook spot-checks (5 files) | 5/5 pass `validate_document.py`, all have RCAF Prompt lines |
| Random reference spot-checks (5 files) | 5/5 pass `validate_document.py` |
| `grep -rIn "level3plus-govern\|templates/stress-test\|templates/sharded" .opencode/skills/` | 0 hits in active code paths |
| Cross-file link spot-check on sk-deep-review §14 | 34 scenario links verified working |
| `validate.sh --strict` on packet folder | Pre-existing 1 error + 3 warnings (SECTION_COUNTS regex, AI_PROTOCOL pattern, custom anchor). Content unaffected and documented at session start. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/` | Modified | 320 per-feature files. REFERENCES to SOURCE FILES, RCAF labels, full SCENARIO CONTRACT fields. |
| `.opencode/skills/system-spec-kit/feature_catalog/` | Modified | 303 files. Packet-history strips, source lines added, Tests renamed, duplicate 14-- resolved. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/` | Modified | 4 new canonical SAD-NNN scenarios added. 44 operator-runbook files reclassified. |
| `.opencode/skills/mcp-click-up/manual_testing_playbook/` (NEW) | Created | 6 categories, 12 CLU-NNN per-feature files with RCAF prompts. |
| `.opencode/skills/system-spec-kit/templates/stress_test/` | Modified | Renamed from `stress-test/`. New `README.md` added. `validate.sh` guard updated. |
| `.opencode/skills/system-spec-kit/templates/sharded/` | Deleted | 5 legacy files removed. Zero active callers confirmed. |
| `.opencode/skills/system-spec-kit/templates/addendum/level3-plus-govern/` | Modified | Renamed from `level3plus-govern/`. 19 path-reference files updated. |
| `.opencode/skills/system-spec-kit/templates/changelog/README.md` | Modified | Frontmatter trimmed to title and description only. |
| `.opencode/plugins/README.md` | Modified | Full rewrite per sk-doc README template. Validates 0 issues. |

### Follow-Ups

- Run `code_graph_scan` and verify fresh status after the 1360-file rename/delete batch (deferred as orthogonal infra task).
- Run `memory_search` smoke tests for renamed paths to confirm advisor recommendations still resolve correctly post-sweep.
- Open a follow-on packet to fix the sk-doc validator `missing_toc` classifier quirk that misclassifies per-feature catalog snippets as readme type. This affects the entire repo, not just this sweep.
- Refresh the `mcp-click-up/manual_testing_playbook/` CLU-001..CLU-012 scenarios when the mcp-click-up parent skill directory is restored to the tree.
