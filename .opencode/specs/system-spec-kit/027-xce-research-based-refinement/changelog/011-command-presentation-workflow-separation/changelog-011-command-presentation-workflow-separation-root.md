---
title: "Phase Parent Rollup: command-presentation-workflow-separation"
description: "Rollup of the 5 child phases under 011, which split workflow routing from Markdown presentation contracts across the memory, speckit, create, doctor, and deep command families. A structural refactor with behavior and output unchanged. Children are summarized inline in the Included Phases table."
trigger_phrases:
  - "011-command-presentation-workflow-separation rollup"
  - "command presentation router split"
  - "027 011 shipped"
  - "command family refactor changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation` (Level 2, Phase Parent)

### Summary

Five command families — memory, speckit, create, doctor, and deep — had their workflow routing tangled with their Markdown presentation contracts in the same command docs. This phase parent split the two concerns across five children, one per family, so routing logic and presentation contracts each live where they belong and can change independently. The refactor is behavior-preserving: command behavior and rendered output are unchanged. This is the structural groundwork that the 010 CLI transition and the 016 CLI-UX work both lean on. The deep family shipped last (epic close): its six mode-based commands already owned `_auto`/`_confirm` workflow YAMLs, so its child extracted the presentation contracts, thinned the routers from 429-573 lines down to 106-160, and aligned the sk-doc command-creation standard to document the split as the canonical pattern.

This rollup is the authoritative child inventory for 011. The five children are summarized inline in the Included Phases table below and do not carry separate per-child leaf changelogs, since the split is a behavior-preserving structural refactor.

### Included Phases

| Phase | Outcome |
|-------|---------|
| [001-memory-commands](../../004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/spec.md) | Memory command family: workflow routing split from the Markdown presentation contract |
| [002-speckit-commands](../../004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/spec.md) | Speckit command family: workflow routing split from the Markdown presentation contract |
| [003-create-commands](../../004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/spec.md) | Create command family: workflow routing split from the Markdown presentation contract |
| [004-doctor-commands](../../004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/spec.md) | Doctor command family: workflow routing split from the Markdown presentation contract |
| [005-deep-commands](../../004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands/spec.md) | Deep command family: six mode-based commands split into thin routers plus `_presentation.md` assets, Fable-parity-verified, plus sk-doc command-standard alignment |

### Added

- None. Detail lives in the child phase spec docs.

### Changed

- None at the parent level. Each child split routing from presentation for its command family, behavior preserved.

### Fixed

- None. Detail lives in the child phase spec docs.

### Verification

- The split was held behavior-preserving: command behavior and rendered output are unchanged. The owed 011 deep review (at least five iterations plus a Fable synthesis check) was completed for this parent.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `011-command-presentation-workflow-separation/` (child phases) | n/a | Rollup of 5 child phases, structural refactor, no behavior-facing change at the parent level |

### Follow-Ups

- None.
