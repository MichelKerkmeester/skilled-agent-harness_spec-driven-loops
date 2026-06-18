---
title: "Changelog: Fix the four-folder rename and record the shared decision [150-parent-nested-skill-pattern/001-rename-fix-and-shared-decision]"
description: "Chronological changelog for the rename repair and shared decision phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "rename repair"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/150-parent-nested-skill-pattern/001-rename-fix-and-shared-decision` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/150-parent-nested-skill-pattern`

### Summary

This phase repaired the naming seam left by the 152 build. Four deep-loop-workflows mode packets now carry the deep-prefixed folder names that match their own `SKILL.md` names: `context` became `deep-context`, `research` became `deep-research`, `review` became `deep-review` and `improvement` became `deep-improvement`.

The sweep treated path text as the contract. It confirmed `ai-council` remains unchanged, drove old bare-path matches to zero and recorded the remaining advisor drift as the next optimization target rather than hiding it inside a rename.

### Added

- All implementation and verification tasks were marked `[x]`, closing `T009`, `T014` and `T015` in this turn.
- `CHK-030 No secrets introduced` was recorded.

### Changed

- Confirmed the four on-disk renames and confirmed that `ai-council` is unchanged.
- Captured a baseline match count for the old bare paths as the zero-match guard.
- Rewrote `/deep:*` command YAML assets referencing the four old packet paths in `.opencode/commands/deep/assets/`.
- Updated hub `graph-metadata.json` `key_files`, hub `SKILL.md` and hub `README.md` in `.opencode/skills/deep-loop-workflows/`.
- Swept per-packet internal documentation across the four renamed packets in slash form, covering 388 files under `.opencode/skills/deep-loop-workflows/deep-*/`.
- Swept bare-form stragglers for quote-terminated references in 3 files under `.opencode/skills/deep-loop-workflows/deep-*/`.

### Fixed

- Repointed 4 `mode-registry.json` packet keys to the deep-prefixed names in `.opencode/skills/deep-loop-workflows/mode-registry.json`.
- Fixed `buildLoopPrompt` `SKILL.md` paths for context, research and review in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
- Fixed the cross-reference straggler outside the packet file lists, 3 references in 1 file at `.opencode/skills/cli-opencode/references/destructive_scope_violations.md`.
- `CHK-011 Sweep follows existing path conventions`, using deep-prefixed packet folders.
- `CHK-022 Zero double-prefix`, with no `deep-deep-` hits.
- `CHK-062 fanout-run.cjs buildLoopPrompt SKILL.md paths fixed`.

### Verification

| Check | Result |
|-------|--------|
| Task completion | PASS: 21 completed task item(s) recorded. |
| Old bare paths | PASS: Baseline match count captured and swept to the zero-match guard. |
| Deep-prefixed folder convention | PASS: `CHK-011` recorded. |
| Double-prefix guard | PASS: `CHK-022` recorded with zero `deep-deep-` hits. |
| Runtime prompt path repair | PASS: `CHK-062` recorded for `fanout-run.cjs` `buildLoopPrompt` SKILL paths. |
| Secret scan discipline | PASS: `CHK-030 No secrets introduced` recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-workflows/deep-context/` | Updated | Folder and references aligned to the deep-prefixed packet name. |
| `.opencode/skills/deep-loop-workflows/deep-research/` | Updated | Folder and references aligned to the deep-prefixed packet name. |
| `.opencode/skills/deep-loop-workflows/deep-review/` | Updated | Folder and references aligned to the deep-prefixed packet name. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/` | Updated | Folder and references aligned to the deep-prefixed packet name. |
| `.opencode/commands/deep/assets/` | Updated | `/deep:*` command YAML assets repointed from old packet paths. |
| `.opencode/skills/deep-loop-workflows/graph-metadata.json` | Updated | Hub `key_files` aligned to renamed packets. |
| `.opencode/skills/deep-loop-workflows/SKILL.md` | Updated | Hub references aligned to renamed packets. |
| `.opencode/skills/deep-loop-workflows/README.md` | Updated | Hub references aligned to renamed packets. |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Updated | Four packet keys repointed to deep-prefixed names. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Updated | `buildLoopPrompt` SKILL paths fixed for context, research and review. |
| `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` | Updated | Three cross-reference stragglers fixed. |

### Follow-Ups

- The parity claim is reference-integrity plus runtime-test parity, not a full per-mode artifact replay. That is appropriate because the change is path text only and does not touch convergence, state or artifact code.
- The `ai-council` folder and name mismatch is a deliberately accepted and documented exception pending the phase-2 research. It is not resolved here.
- The advisor still routes through hardcoded mode maps in `skill_advisor.py` and `aliases.ts`, not the registry. That drift gap is the central optimization target for phases 2 and 3, and it stayed out of scope for this reference-fix phase.
