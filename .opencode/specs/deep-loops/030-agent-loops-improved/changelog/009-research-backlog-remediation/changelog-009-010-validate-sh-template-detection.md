---
title: "Changelog: Validate.sh Template Detection [009-research-backlog-remediation/010-validate-sh-template-detection]"
description: "Chronological changelog for the Validate.sh Template Detection phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation`

### Summary

Nothing in validate.sh caught a folder that claims Complete while its own docs are still untouched scaffold templates. A new rule closes that gap, confirmed against both synthetic fixtures and a real, previously undetected live instance, and a significant limitation in how new rules reach the default validation path was discovered and documented.

### Added

- Add the `SCAFFOLD_NEVER_TOUCHED` validate.sh rule, checking a Complete folder's required docs for scaffold-signature markers, with clean and violation fixtures and an extended-harness test block.

### Changed

- No changes to existing rule behavior. The new rule is purely additive.

### Fixed

- Fixed a real, previously undetected gap discovered by this new rule itself, one of phase 008's own children, `003-model-benchmark-reducer-ledger`, still carries scaffold markers in all 3 of its own docs.

### Verification

- Extended validation harness run, PASS, 112 of 112 with no regressions to any existing rule.
- Rule run explicitly against `008-loop-systems-remediation`, PASSED at the parent level and correctly flagged its own child `003-model-benchmark-reducer-ledger` as still scaffold-marked.
- Confirmed by direct source read that the default Node-orchestrator validate.sh path does not consult the shell rule registry at all, so this rule and the earlier `COMMENT_HYGIENE_MARKER` rule are only reachable through an explicit `SPECKIT_RULES` invocation.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh` | Added | New standalone validate.sh rule. |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered the new rule. |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/072-scaffold-never-touched-violation/`, `073-scaffold-never-touched-clean/` | Added | Fail-case and pass-case fixtures. |

### Follow-Ups

- The default validate.sh invocation path does not read the shell rule registry at all, so `SCAFFOLD_NEVER_TOUCHED` and `COMMENT_HYGIENE_MARKER` only run through explicit `SPECKIT_RULES` invocation. Porting registry rules into the Node orchestrator, or making it discover them dynamically, is a real, separate follow-up.
- `008/003-model-benchmark-reducer-ledger`'s own scaffold docs remain unfixed, the same class as the many other pre-existing instances across phases 002 through 007, correctly out of scope for this phase.
