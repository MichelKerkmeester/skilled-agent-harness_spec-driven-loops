---
title: "Changelog: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces [144-operate-like-fable-5/001-initial-refinement]"
description: "Chronological changelog for the initial Fable-5 operating doctrine distribution phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/001-initial-refinement` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5`

### Summary

The Fable-5 operating doctrine moved out of an external note and into the framework surfaces agents actually read. The phase landed rules for claim verification, confirmed-versus-inferred prose, baseline capture before no-regressions, finding validation and rollback naming without bloating the existing Four Laws. The distribution stayed surgical by cross-referencing existing authority instead of duplicating it.

### Added

- Reached convergence in 5 iterations, answered 5 of 5 questions and reduced newInfoRatio to 0.08.
- Added the Operating Discipline subsection to section 1 of the Public root `AGENTS.md`, plus 13 lines to 446.
- Added the read-only-git variant of the subsection to `Barter/ai-speckit/coder/AGENTS.md`, plus 13 lines to 467.
- Created `regression-baseline-and-delta.md` in the Public and Barter mirrors at `.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md`.
- Created `finding-is-a-hypothesis.md` in the Public and Barter mirrors at `.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md`.
- Added the Baseline and blast-radius line after the Iron Law in `.opencode/skills/sk-code/SKILL.md`.

### Changed

- Ran a deep-research loop over `Fable5.md` and the current stack with `cli-codex gpt-5.5`, `reasoning_effort=xhigh`, `service_tier=fast` and a maximum of 10 iterations.
- Captured the canonical synthesis in `research/research.md`.
- Verified the byte-identical `CLAUDE.md` twin auto-synced.
- Folded a fifth How to apply bullet into `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md` for non-git outward and irreversible actions.
- Confirmed `diff AGENTS.md CLAUDE.md` is clean and both AGENTS files are under the about 500-line budget.
- Confirmed the subsection and both rule files are present across Public, Barter and `.claude` surfaces.

### Fixed

- CHK-FIX-001 Finding class identified as doctrine-distribution policy and doc work, not a code bug. No instance-versus-class ambiguity remains.
- CHK-FIX-002 Same-class surface inventory completed across all three AGENTS surfaces and both constitutional folders.
- CHK-FIX-003 Consumer inventory completed. `.claude` mirrors and Barter mirror were checked for the new rules and subsection.
- CHK-FIX-004 No security, path, parser or redaction logic was in scope. Policy text only.
- CHK-FIX-005 Surface matrix listed for Public AGENTS and CLAUDE, Barter AGENTS, Public, Barter and `.claude` constitutional surfaces and `sk-code`.
- CHK-FIX-006 No process-wide state read was in scope.

### Verification

| Check | Result |
|-------|--------|
| `AGENTS.md` equals `CLAUDE.md` byte-for-byte | PASS: byte-identical. |
| Both AGENTS files under about 500 lines | PASS: Public 446, Barter 467. |
| Operating Discipline subsection present in all 3 AGENTS files | PASS: Public AGENTS, CLAUDE and Barter AGENTS covered. |
| Two new constitutional rules well-formed and present in Public and Barter | PASS: both rule files present. |
| `main-branch-direct-push.md` fifth How to apply bullet | PASS: non-git outward action bullet present. |
| `sk-code/SKILL.md` Baseline and blast-radius line | PASS: line present. |
| `research/research.md` converged synthesis | PASS: synthesis present. |
| Constitutional re-index | PENDING: blocked by pre-existing stale spec-memory dist and will index on next daemon scan. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `AGENTS.md (Public root)` | Updated | Operating Discipline subsection in section 1, plus 13 lines to 446. |
| `CLAUDE.md (Public root)` | Updated | Byte-identical auto-synced twin. |
| `Barter/ai-speckit/coder/AGENTS.md` | Updated | Read-only-git variant of the subsection, plus 13 lines to 467. |
| `.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md` | Created | Baseline-before-no-regressions rule in Public, Barter and `.claude` mirror. |
| `.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md` | Created | Finding-is-a-hypothesis rule in Public, Barter and `.claude` mirror. |
| `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md` | Updated | Fifth How to apply bullet for non-git outward and irreversible actions. |
| `.opencode/skills/sk-code/SKILL.md` | Updated | Baseline and blast-radius line after the Iron Law. |

### Follow-Ups

- Constitutional re-index is deferred. The two new rules are present and well-formed but are not yet indexed into spec-memory because spec-memory dist is stale from pre-existing work. They will be picked up on the next daemon scan.
- Barter git-posture contradiction is unresolved by design. Barter ships `main-branch-direct-push.md`, while its `AGENTS.md` section 1 declares git read-only. This pre-existing contradiction is flagged for the owner's decision and was deliberately not auto-fixed.
- The larger shared evidence contract is out of scope. Research surfaced a machine-checkable evidence contract with `claim_class`, `evidence`, `would_confirm`, `baseline`, `gate_delta`, `scope_state` and `child_result_verified` wired into post-dispatch validation as a high-value follow-up.
