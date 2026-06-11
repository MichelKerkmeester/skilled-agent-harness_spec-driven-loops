---
title: "Phase Parent Rollup: command-presentation-workflow-separation"
description: "Rollup of the 4 child phases under 011, which split workflow routing from Markdown presentation contracts across the memory, speckit, create, and doctor command families. A structural refactor with behavior and output unchanged. Children are summarized inline in the Included Phases table."
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

Four command families — memory, speckit, create, and doctor — had their workflow routing tangled with their Markdown presentation contracts in the same command docs. This phase parent split the two concerns across four children, one per family, so routing logic and presentation contracts each live where they belong and can change independently. The refactor is behavior-preserving: command behavior and rendered output are unchanged. This is the structural groundwork that the 010 CLI transition and the 016 CLI-UX work both lean on.

This rollup is the authoritative child inventory for 011. The four children are summarized inline in the Included Phases table below and do not carry separate per-child leaf changelogs, since the split is a behavior-preserving structural refactor.

### Included Phases

| Phase | Outcome |
|-------|---------|
| [001-memory-commands](../../011-command-presentation-workflow-separation/001-memory-commands/spec.md) | Memory command family: workflow routing split from the Markdown presentation contract |
| [002-speckit-commands](../../011-command-presentation-workflow-separation/002-speckit-commands/spec.md) | Speckit command family: workflow routing split from the Markdown presentation contract |
| [003-create-commands](../../011-command-presentation-workflow-separation/003-create-commands/spec.md) | Create command family: workflow routing split from the Markdown presentation contract |
| [004-doctor-commands](../../011-command-presentation-workflow-separation/004-doctor-commands/spec.md) | Doctor command family: workflow routing split from the Markdown presentation contract |

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
| `011-command-presentation-workflow-separation/` (child phases) | n/a | Rollup of 4 child phases, structural refactor, no behavior-facing change at the parent level |

### Follow-Ups

- None.
