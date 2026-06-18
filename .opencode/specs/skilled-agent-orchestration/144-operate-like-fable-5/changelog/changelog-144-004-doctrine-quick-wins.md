---
title: "Changelog: Doctrine Quick Wins and Pointer-Resolution Discipline [144-operate-like-fable-5/004-doctrine-quick-wins]"
description: "Chronological changelog for the low-blast doctrine quick-wins phase."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/004-doctrine-quick-wins` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5`

### Summary

This phase shipped the three cheapest doctrine wins from the fable-5 recommendation map: A1, A2 and A3. The dead `AGENTS.md:217` pointer was proven load-bearing because it caused the DeepSeek research lineage to falsely conclude OpenCode has no per-turn hook. Repairing the pointer and adding a fail-loud pointer-resolution check gave the packet a small fix with direct behavioral leverage.

### Added

- None.

### Changed

- Shipped the three cheapest and lowest-blast doctrine wins from the fable-5 recommendation map: A1, A2 and A3.
- Repaired the dead `AGENTS.md:217` pointer.
- Added the section 1 efficiency spine to `AGENTS.md`.
- Added scar-tissue cold-successor handoff discipline to the handover template.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this phase folder | PENDING: strict validation gate defined. |
| `check-doc-pointers.sh` broken-versus-repaired runs | PENDING: pointer-resolution gate defined. |
| `diff -q AGENTS.md CLAUDE.md` byte-sync gate | PENDING: byte-sync gate defined. |
| `wc -l AGENTS.md CLAUDE.md` at or under 500 | PENDING: line-budget gate defined. |
| Relevant vitest suites for touched script tooling | PENDING: vitest gate defined. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `AGENTS.md (≡ CLAUDE.md symlink)` | Updated | Repaired the line 217 pointer and added the section 1 efficiency spine. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh` | Created | Fail-loud assertion that every `AGENTS.md` `references/*.md` pointer resolves. |
| `.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` | Updated | Added the scar-tissue ledger and numbered cold-read order. |

### Follow-Ups

- CHK-001 A1, A2 and A3 requirements documented in `spec.md` with measurable acceptance criteria from REQ-001 to REQ-006.
- CHK-002 Technical approach and ordered steps defined in `plan.md`, with check existence before final verification.
- CHK-003 Dependencies identified: none. The phase is self-contained and land-first. POSIX shell and grep are available.
- CHK-010 `check-doc-pointers.sh` is valid POSIX shell, `bash -n` passes and the script is executable.
- CHK-011 No hyphenated `skill-advisor-hook.md` reference remains in `AGENTS.md` or `CLAUDE.md`. `rg skill-advisor-hook.md` returns nothing.
- CHK-012 The check handles error inputs. A missing input file fails and every unresolved pointer is reported without stopping at the first one.
