---
title: "Timeline — 121 deep-agent-improvement-benchmark-mode"
description: "All phase folders of packet 121, newest -> oldest, with paths, creation dates, and arc. Navigation aid for the phase parent."
---

# Timeline — 121 deep-agent-improvement-benchmark-mode

All phase folders, **newest → oldest**. Status: **Complete** — 19/19 phases shipped: two arcs (Build = 001–007, Two-lane = 008–018) plus a doc + changelog closeout (019).

- **Base path:** `specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/`
- `specs/` is a symlink to `.opencode/specs/` (same directory; the canonical root is `.opencode/specs/`).
- Dates are the first-commit date for each phase folder. See `context-index.md` for the arc map, rename history, and the 122 → 007 fold-in provenance; see `spec.md` for the Phase Documentation Map.

| Phase | Created | Arc | Folder (under base) | Focus |
|------:|---------|----------|---------------------|-------|
| 19 | 2026-05-30 | Closeout | `019-align-skill-docs-and-consolidate-changelog/` | Align the skill README + docs to two-lane reality; one comprehensive v1.9.0.0 changelog |
| 18 | 2026-05-29 | Two-lane | `018-fix-opus-findings-for-two-lane-code/` | Remediate the 017 Opus deep-review findings (4 P1 + 13 P2) |
| 17 | 2026-05-29 | Two-lane | `017-review-two-lane-workflow-with-opus/` | Independent Opus 4.8 second-opinion review of the post-015 two-lane code |
| 16 | 2026-05-29 | Two-lane | `016-add-readmes-for-script-subfolders/` | Code-folder READMEs for every source script subfolder (sk-doc) |
| 15 | 2026-05-29 | Two-lane | `015-fix-deep-review-findings-for-two-lane-code/` | Remediate the 014 gpt-5.5 deep-review findings (1 P0 + 16 P1 + 16 P2) |
| 14 | 2026-05-29 | Two-lane | `014-review-two-lane-workflow-implementation/` | 10-iter gpt-5.5 deep review of the two-lane program (008–013) |
| 13 | 2026-05-29 | Two-lane | `013-reorganize-script-lane-folders/` | Move 16 scripts into lane subdirs (closed two-lane build at v1.9.0.0) |
| 12 | 2026-05-29 | Two-lane | `012-label-catalog-playbook-and-advisor-lanes/` | Lane labels in catalog/playbook + advisor recompile + reduce-state mode mix |
| 11 | 2026-05-29 | Two-lane | `011-add-agent-lane-awareness-note/` | "Mode awareness" -> "Lane awareness" across all 4 agent mirrors |
| 10 | 2026-05-29 | Two-lane | `010-reorganize-two-lane-references-assets/` | Physically split references/ + assets/ into lane subdirs |
| 9 | 2026-05-29 | Two-lane | `009-restructure-skill-md-two-lane/` | SKILL.md restructure into two co-equal lanes + router intent |
| 8 | 2026-05-29 | Two-lane | `008-add-model-benchmark-lane-selection-prompts/` | Command lane question + dedicated `/deep:start-model-benchmark-loop` |
| 7 | 2026-05-29 | Build | `007-review-model-benchmark-mode-hardening/` | Tri-model hardening review (gpt-5.5 + MiniMax + Opus arbiter) — folded in from packet 122 |
| 6 | 2026-05-29 | Build | `006-deep-loop-empty-archive-dir/` | Maintenance: stop deep-loop init creating empty archive dirs |
| 5 | 2026-05-28 | Build | `005-add-opt-in-5dim-scorer-and-skill-docs/` | Opt-in 5-dim scorer flag + model-benchmark SKILL docs |
| 4 | 2026-05-28 | Build | `004-fix-hardening-findings-for-model-benchmark/` | Remediate the 007 hardening-review findings (3 P1 + P2s) |
| 3 | 2026-05-28 | Build | `003-build-model-benchmark-mode-runtime/` | Build the mode: loop-host + dispatch-model + scorer port + TST-1 gate |
| 2 | 2026-05-28 | Build | `002-research-model-benchmark-implementation/` | MiniMax M2.7 deep-research of the build (seam contracts + build-delta) |
| 1 | 2026-05-28 | Build | `001-design-model-benchmark-mode-selector/` | Design: mode selector + 3 pluggable seams + ADRs + build plan |

> Note on ordering: phase numbers are the canonical sequence and are **not** renumbered (they are the provenance record). Two numbers sit out of strict chronological order by design — phase **004** (remediation, created 05-28) precedes phase **007** (the review it remediates) because that review was authored as **separate packet 122** and folded into 121 as `007` on 05-29. See `context-index.md` for the full account.

## Full paths (newest -> oldest, copy-paste)

```
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/019-align-skill-docs-and-consolidate-changelog/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/018-fix-opus-findings-for-two-lane-code/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/017-review-two-lane-workflow-with-opus/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/016-add-readmes-for-script-subfolders/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/014-review-two-lane-workflow-implementation/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/013-reorganize-script-lane-folders/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/012-label-catalog-playbook-and-advisor-lanes/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/011-add-agent-lane-awareness-note/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/010-reorganize-two-lane-references-assets/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/009-restructure-skill-md-two-lane/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/008-add-model-benchmark-lane-selection-prompts/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/007-review-model-benchmark-mode-hardening/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/005-add-opt-in-5dim-scorer-and-skill-docs/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/004-fix-hardening-findings-for-model-benchmark/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/001-design-model-benchmark-mode-selector/
```
