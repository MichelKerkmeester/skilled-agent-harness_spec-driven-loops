---
title: "Checklist: sk-code subtree rollup gate (020 phase 008/009)"
description: "Blocking SOL verification contract for sibling completion, phase 008 release evidence, the scope-aware sk-code naming census, active-reference closure, and the non-mutating final handoff."
trigger_phrases:
  - "sk-code rollup gate checklist"
  - "sk-code kebab-clean verifier"
  - "sk-code phase 009 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate SOL checklist"
    next_safe_action: "Run the sibling matrix and final naming census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/"
      - ".opencode/skills/sk-code/"
      - ".opencode/skills/sk-code/changelog/"
      - "../008-changelog-verify/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: sk-code subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 009. The verifier pins candidate and BASE SHAs, reads
the 001-008 sibling verdict matrix and map hashes, enumerates the complete sk-code surface, records commands and exit
codes, and fails on any incomplete sibling, unknown in-scope name, stale active reference, or unresolved release finding.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001-008 have completed evidence and their blocking checklist contracts are available, including the phase 008 release handoff.
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, sibling map hashes, final census/reference commands, and the 020 exemption boundary are recorded before the gate runs.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] No sibling phase has an unresolved ownership conflict, stale handoff, incomplete scope, or out-of-scope mutation.
- [ ] CHK-004 [P0] The final scope-aware census classifies every retained non-kebab filesystem name; no in-scope authored name remains without evidence.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All sibling P0 checklist items for phases 001-008 pass, and phase 008 has a matching changelog/version verdict.
- [ ] CHK-006 [P0] The complete `.opencode/skills/sk-code/` surface contains no stale active source path after the child maps are applied.
- [ ] CHK-007 [P0] Every retained Python/package, tool-mandated, generated/lockfile, frozen, or other approved non-kebab name has a recorded disposition; unknown classifications fail the gate.
- [ ] CHK-008 [P1] The final census, map hashes, sibling verdict matrix, commands, exit codes, counts, and unresolved findings are reproducible from the evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Child path maps are complete, non-conflicting, and cover every in-scope authored candidate found by the final census.
- [ ] CHK-010 [P1] The gate performed no new rename, reference rewrite, metadata repair, changelog edit, or content migration.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] The rollup scan did not reinterpret code identifiers, JSON/YAML/TOML keys, frontmatter fields, generated output, lockfiles, tool-mandated names, or frozen history as filesystem candidates.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] The final evidence identifies every sibling packet, path classification, exemption, release verdict, handoff target, and blocking finding.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Only rollup evidence changed during gate execution; no scratch directory or implementation-summary scaffold artifact remains.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree passes only when every sibling contract is green, phase 008 release evidence is coherent, and the final
scope-aware census and active-reference check are clean. An unknown name or stale path routes back to its owner; the
rollup gate does not absorb or implement that work.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the sibling matrix, final naming census, active-reference closure, release
evidence, and central validation result, with a recorded pass/block handoff. No skill-surface migration occurs here.
<!-- /ANCHOR:sign-off -->

