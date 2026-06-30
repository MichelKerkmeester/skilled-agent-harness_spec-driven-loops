---
title: "Verification Checklist: Strip tool over-grant from the read-and-guide /design:* wrappers"
description: "Verification evidence for aligning the four read-and-guide /design:* wrapper allowed-tools with the command-metadata.json toolPolicy SSOT and clearing the allowed-tools drift."
trigger_phrases:
  - "d2-r1 tool over-grant checklist"
  - "strip write edit bash design wrappers"
  - "tool-policy parity checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/001-strip-tool-over-grant"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all checklist items with evidence; add Fix Completeness section"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r1-strip-tool-over-grant"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Strip tool over-grant from the read-and-guide /design:* wrappers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] D2-R3 dependency satisfied: `command-metadata.json` and `design-command-surface-check.mjs` exist
  - **Evidence**: both present under `.opencode/skills/sk-design/` (sibling 003-command-metadata-ssot landed them).
- [x] CHK-002 [P0] `toolPolicy{mutatesWorkspace}` read as SSOT: interface/foundations/motion/audit = `false`, md-generator = `true`
  - **Evidence**: the four read-and-guide commands are `mutatesWorkspace: false`; md-generator is `true`.
- [x] CHK-003 [P1] All five wrapper `allowed-tools` baselines read before editing
  - **Evidence**: baseline `Read, Write, Edit, Bash, Glob, Grep` on all five wrappers.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] interface wrapper `allowed-tools: Read, Glob, Grep` (no Write/Edit/Bash)
  - **Evidence**: `commands/design/interface.md:4` reads `allowed-tools: Read, Glob, Grep`.
- [x] CHK-011 [P0] foundations wrapper `allowed-tools: Read, Glob, Grep`
  - **Evidence**: `commands/design/foundations.md:4` reads `allowed-tools: Read, Glob, Grep`.
- [x] CHK-012 [P0] motion wrapper `allowed-tools: Read, Glob, Grep`
  - **Evidence**: `commands/design/motion.md:4` reads `allowed-tools: Read, Glob, Grep`.
- [x] CHK-013 [P0] audit wrapper `allowed-tools: Read, Glob, Grep`
  - **Evidence**: `commands/design/audit.md:4` reads `allowed-tools: Read, Glob, Grep`.
- [x] CHK-014 [P0] md-generator wrapper `allowed-tools` UNCHANGED (`Read, Write, Edit, Bash, Glob, Grep`)
  - **Evidence**: `commands/design/md-generator.md:4` still reads `allowed-tools: Read, Write, Edit, Bash, Glob, Grep`.
- [x] CHK-015 [P1] Only the `allowed-tools` line changed per wrapper; bridge prose untouched
  - **Evidence**: single-line frontmatter change per file; PURPOSE / INSTRUCTIONS / Return Status prose intact.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `design-command-surface-check.mjs` no longer reports the four allowed-tools drifts
  - **Evidence**: surface drift dropped 14 → 10; no `mutatesWorkspace:false` command declares Write/Edit/Bash.
- [x] CHK-021 [P0] Each of the four read-and-guide commands still loads its mode as a thin bridge
  - **Evidence**: frontmatter parses for all four; mode-load step intact.
- [x] CHK-022 [P1] md-generator still runs its extract pipeline (mutating tools intact)
  - **Evidence**: md-generator retains `Write, Edit, Bash` in `allowed-tools`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug`, fixed across the whole read-and-guide set
  - **Evidence**: the over-grant was stripped from all four read-and-guide wrappers in one pass, not one instance; the producer inventory is the four `mutatesWorkspace:false` commands.
- [x] CHK-FIX-002 [P0] Consumer inventory completed for the changed surface
  - **Evidence**: the consumer of `allowed-tools` is the OpenCode command loader plus `design-command-surface-check.mjs`; both re-checked, the four drifts cleared and the bridges still load.
- [x] CHK-FIX-003 [P1] Residual drift fully accounted, with its closing phase named
  - **Evidence**: remaining `drift=10` is 5 argument-hint + 5 aliases, owned by sibling D2-R2; not this phase.
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report, not a moving measurement
  - **Evidence**: the 14 → 10 drop is reproduced from `design-command-surface-check.mjs` output, re-runnable on demand.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] md-generator's mutating tools NOT edited (out of scope)
  - **Evidence**: md-generator frontmatter byte-identical to baseline (`Read, Write, Edit, Bash, Glob, Grep`).
- [x] CHK-031 [P0] No file outside the four wrapper frontmatter blocks mutated (`command-metadata.json` read-only)
  - **Evidence**: change set limited to interface/foundations/motion/audit `allowed-tools` lines; SSOT untouched.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
  - **Evidence**: all four describe the same allowed-tools strip, the 14 → 10 drift drop, and the D2-R2 residual handoff.
- [x] CHK-041 [P1] No spec/packet/phase IDs or spec paths embedded in any wrapper file (evergreen)
  - **Evidence**: wrappers carry no numeric spec IDs or spec paths; evergreen clean.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: no temp files created outside scratch during this phase.
- [x] CHK-051 [P2] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts left behind.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: Build verification (four wrappers stripped to `Read, Glob, Grep`; md-generator byte-unchanged; surface drift reduced 14 → 10; evergreen clean; bridges still parse)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
