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
| 19 | 2026-05-30 | Closeout | `019-skill-doc-alignment-and-changelog-consolidation/` | Align the skill README + docs to two-lane reality; one comprehensive v1.9.0.0 changelog |
| 18 | 2026-05-29 | Two-lane | `018-fix-opus-review-findings-for-two-lane-code/` | Remediate the 017 Opus deep-review findings (4 P1 + 13 P2) |
| 17 | 2026-05-29 | Two-lane | `017-two-lane-opus-deep-review/` | Independent Opus 4.8 second-opinion review of the post-015 two-lane code |
| 16 | 2026-05-29 | Two-lane | `016-script-subfolder-readmes/` | Code-folder READMEs for every source script subfolder (sk-doc) |
| 15 | 2026-05-29 | Two-lane | `015-fix-deep-review-findings-for-two-lane-code/` | Remediate the 014 gpt-5.5 deep-review findings (1 P0 + 16 P1 + 16 P2) |
| 14 | 2026-05-29 | Two-lane | `014-two-lane-deep-review/` | 10-iter gpt-5.5 deep review of the two-lane program (008–013) |
| 13 | 2026-05-29 | Two-lane | `013-scripts-physical-reorg/` | Move 16 scripts into lane subdirs (closed two-lane build at v1.9.0.0) |
| 12 | 2026-05-29 | Two-lane | `012-catalog-playbook-advisor-lane-labels/` | Lane labels in catalog/playbook + advisor recompile + reduce-state mode mix |
| 11 | 2026-05-29 | Two-lane | `011-agent-lane-note/` | "Mode awareness" -> "Lane awareness" across all 4 agent mirrors |
| 10 | 2026-05-29 | Two-lane | `010-references-assets-lane-reorg/` | Physically split references/ + assets/ into lane subdirs |
| 9 | 2026-05-29 | Two-lane | `009-skill-md-two-lane/` | SKILL.md restructure into two co-equal lanes + router intent |
| 8 | 2026-05-29 | Two-lane | `008-command-lane-asking/` | Command lane question + dedicated `/deep:start-model-benchmark-loop` |
| 7 | 2026-05-29 | Build | `007-benchmark-mode-hardening-review/` | Tri-model hardening review (gpt-5.5 + MiniMax + Opus arbiter) — folded in from packet 122 |
| 6 | 2026-05-29 | Build | `006-deep-loop-empty-archive-dir-fix/` | Maintenance: stop deep-loop init creating empty archive dirs |
| 5 | 2026-05-28 | Build | `005-optin-5dim-scorer-and-skill-docs/` | Opt-in 5-dim scorer flag + model-benchmark SKILL docs |
| 4 | 2026-05-28 | Build | `004-fix-hardening-review-findings-for-benchmark-mode/` | Remediate the 007 hardening-review findings (3 P1 + P2s) |
| 3 | 2026-05-28 | Build | `003-build-benchmark-mode/` | Build the mode: loop-host + dispatch-model + scorer port + TST-1 gate |
| 2 | 2026-05-28 | Build | `002-implementation-deep-research/` | MiniMax M2.7 deep-research of the build (seam contracts + build-delta) |
| 1 | 2026-05-28 | Build | `001-mode-selector-design/` | Design: mode selector + 3 pluggable seams + ADRs + build plan |

> Note on ordering: phase numbers are the canonical sequence and are **not** renumbered (they are the provenance record). Two numbers sit out of strict chronological order by design — phase **004** (remediation, created 05-28) precedes phase **007** (the review it remediates) because that review was authored as **separate packet 122** and folded into 121 as `007` on 05-29. See `context-index.md` for the full account.

## Full paths (newest -> oldest, copy-paste)

```
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/019-skill-doc-alignment-and-changelog-consolidation/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/018-fix-opus-review-findings-for-two-lane-code/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/017-two-lane-opus-deep-review/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/016-script-subfolder-readmes/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/014-two-lane-deep-review/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/013-scripts-physical-reorg/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/012-catalog-playbook-advisor-lane-labels/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/011-agent-lane-note/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/010-references-assets-lane-reorg/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/009-skill-md-two-lane/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/008-command-lane-asking/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/007-benchmark-mode-hardening-review/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir-fix/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/005-optin-5dim-scorer-and-skill-docs/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/004-fix-hardening-review-findings-for-benchmark-mode/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-implementation-deep-research/
specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/001-mode-selector-design/
```
