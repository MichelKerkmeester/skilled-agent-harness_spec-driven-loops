---
title: "Phase 004: Skill advisor docs and code alignment"
description: "Updated skill-advisor docs for hook-first invocation and completed sk-code-opencode audit of Phase 020 TypeScript hook files. Nine minor remediations applied. 118/118 tests green."
trigger_phrases:
  - "phase 004 changelog"
  - "skill advisor docs alignment"
  - "phase 020 code audit"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 2)
> Parent packet: `002-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Phase 022 brought the skill-advisor package into line with the hook surface that Phase 020 shipped. Operators now see prompt-time hook invocation as the primary Gate 2 path, with the direct Python CLI documented as a fallback. A sk-code-opencode TypeScript audit of all 18 scoped Phase 020 files found no major findings and nine minor findings were fixed in place.

### Added

- README `HOOK INVOCATION (PRIMARY)` section with build and runtime registration guidance.
- Feature catalog `HOOK SURFACE` category with 12 Phase 020 entries.
- Manual testing playbook `06--hook-routing` folder and HR-001 through HR-006 smoke steps.
- Setup guide hook-first invocation section.

### Changed

- README now introduces hook invocation as primary and direct CLI as fallback.
- Feature catalog now documents hook adapters, HMAC cache, freshness fingerprints, generation counter, runtime parity, disable flag, observability, privacy contract.
- 9 TypeScript minor findings fixed: untyped catch variables given `unknown`, child-process handle typed explicitly, error messages gained field-path details, comment wording updated.

### Fixed

- `lib/skill-advisor/generation.ts`: untyped catch and generic error message.
- `lib/skill-advisor/subprocess.ts`: loose child handle type, untyped catches, generic JSON errors.
- `lib/skill-advisor/metrics.ts`: generic diagnostic validation errors.
- 5 files with dated/compatibility comment wording rephrased.

### Verification

- Phase 020 vitest: 19 files / 118 tests passed.
- `npx tsc --noEmit` in `mcp_server`: exit 0.
- TS standards grep: no matches for unqualified `any`, untyped `catch (error)`, task-era comments.
- `validate.sh --strict --no-recursive`: errors=0, warnings=0.

### Files Changed

| File | What changed |
|------|--------------|
| `skill-advisor/README.md` | Document hook invocation as primary |
| `skill-advisor/feature_catalog/feature_catalog.md` | Add 12 Phase 020 entries |
| `skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Add hook-routing category |
| `skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md` | New playbook |
| `skill-advisor/SET-UP_GUIDE.md` | Align with hook-first |
| 9 TypeScript files in `lib/skill-advisor/`, `hooks/`, `lib/context/`, `lib/codex-hook-policy.ts` | Minor type/comment fixes |

### Follow-Ups

- Interactive runtime smoke remains manual per the new playbook.
