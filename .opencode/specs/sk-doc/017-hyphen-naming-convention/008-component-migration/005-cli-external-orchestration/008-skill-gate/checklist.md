---
title: "Checklist: cli-external-orchestration subtree rollup gate (017 phase 005.008)"
description: "Blocking SOL verifier contract for the cli-external-orchestration rollup: sibling completion, full scope-aware naming census, active-reference closure, release-evidence reconciliation, and mutation prohibition."
trigger_phrases:
  - "cli-external subtree rollup gate checklist"
  - "cli-external kebab-clean verifier"
  - "cli-external phase 008 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-external gate verifier"
    next_safe_action: "Run the final subtree gate"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The gate routes new work back to the owning sibling and never repairs the skill surface."
---
# Checklist: cli-external-orchestration subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. The verifier pins candidate and BASE SHAs, reads all sibling verdicts/maps and the phase 007 release matrix, enumerates the complete hub/component/playbook/benchmark surface, records commands and exit codes, and fails on incomplete siblings, unknown paths, stale references, unresolved release findings, or any new migration mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001–007 have completed evidence and their blocking checklist contracts are available
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, sibling map hashes, release matrix, and final census command are recorded before the gate runs
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] No sibling has an unresolved ownership conflict, stale handoff, incomplete map, or out-of-scope mutation
- [ ] CHK-004 [P0] The final scope-aware census classifies every retained non-kebab filesystem name; no in-scope authored name lacks evidence
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All sibling P0 items pass and phase 007 has matching four-surface changelog/version evidence
- [ ] CHK-006 [P0] Hub, three CLI components, four playbook trees, and benchmark contain no stale active source path after child maps are applied
- [ ] CHK-007 [P0] Every retained Python/package, tool-mandated, generated, frozen, or other approved non-kebab name has a recorded disposition; unknown fails
- [ ] CHK-008 [P1] Final census, map hashes, sibling verdict matrix, release matrix, commands, exit codes, and findings are reproducible
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Child maps are complete, non-conflicting, and cover every in-scope authored candidate found by the final census
- [ ] CHK-010 [P1] The gate performed no new rename, reference rewrite, metadata repair, changelog edit, or content migration
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] The rollup scan did not reinterpret code identifiers, JSON/YAML/TOML keys, frontmatter fields, generated output, frozen history, or safety contracts as filesystem candidates
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] Final evidence identifies every sibling packet, path classification, exemption, release verdict, and owner-routed handoff
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Only rollup evidence changed during gate execution; no implementation-summary scaffold file or scratch directory remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree passes only when all sibling contracts and phase 007 release evidence are green, the final scope-aware census is clean, and active references resolve. A discovered unknown or stale path routes back to its owner; the rollup gate does not absorb or implement it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the sibling matrix, final naming census, active-reference closure, release evidence, central validation, and pass/block handoff. No skill-surface migration occurs here.
<!-- /ANCHOR:sign-off -->

