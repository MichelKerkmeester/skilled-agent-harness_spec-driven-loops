---
title: "Implementation Summary: Deferred Code and Checker Fixes"
description: "Fixed the 10a leaf-manifest checker path bug and the two data gaps it surfaced, completed the skill and command Title-Case flip, and recorded evidence-based decisions to not edit the benchmark findings or run a blind repo-wide HVR sweep."
trigger_phrases:
  - "deferred fixes summary"
  - "10a checker fix summary"
  - "skill command flip summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/010-deferred-code-and-checker-fixes"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Shipped the deferred fixes and recorded the not-fixed decisions."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/mcp-tooling/leaf-manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-021-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-deferred-code-and-checker-fixes |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five deferred follow-ups were resolved: three by fixing, two by an evidence-based decision not to edit.

### 10a leaf-manifest checker

`parent-skill-check.cjs` rule `10a-manifest-source` resolved the shared leaf-resource generator and contract library from each hub's own `create-skill/scripts/`. That mode exists only in sk-doc, so every other leaf-manifest hub failed 10a on a missing generator. It now resolves from the canonical `sk-doc/create-skill/scripts/`, and `buildManifestBytes(target)` already accepts an arbitrary hub. Two data gaps surfaced once 10a could run: `sk-code/mode-registry.json` was missing the `resourceContractVersion` its leaf-manifest already declared, and `mcp-tooling/leaf-manifest.json` referenced a pre-kebab `INSTALL-GUIDE.md`. Both were fixed. All seven leaf-manifest hubs now pass 10a, 10b and 10d.

### Skill and command Title-Case flip

The scan found only 2 SKILL.md offenders (`code-opencode`, `create-flowchart`, 11 headers) and 0 command offenders. The two files were uppercased with the same exempt-preserving transform, and `h2UppercaseRequired` was flipped for skill and command. All 49 SKILL.md and 51 command files pass.

### Not fixed, with evidence

The benchmark `RIG_ROOT` in `001-swe-1.6-eval-loop` points at a `002-eval-rig` that never existed, but that packet is an archived benchmark run with no live references, so its scripts are frozen artifacts. The live `003` copy is already correct. `dispatch-swe16.cjs` is referenced only in a credit comment in `dispatch-minimax.cjs`, so it is unused but low-value to remove. The repo-wide HVR sweep spans roughly 4,601 files and about 79,000 em-dash occurrences that serve many grammatical roles, so it is a standalone project needing per-occurrence judgment, not a closeout fix.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each item was checked on disk before any edit. The 10a fix was verified by running `parent-skill-check.cjs` across all seven hubs before and after, and by `node --check`. The skill/command flip was verified by validating all SKILL.md and command files and confirming the diff was header-only. The three not-fixed findings were each traced to their real state (an archived packet, a comment-only reference, a 167,000-occurrence scale) so the decision rests on evidence rather than avoidance.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve shared tooling from sk-doc | The generator is shared; a hub without the create-skill mode still needs to validate |
| Fix the two surfaced data gaps | 10a becoming runnable exposed real registry and manifest drift worth correcting |
| Do not edit the 001 benchmark scripts | The packet is an archived run; the live copy is already correct |
| Do not run a blind HVR sweep | 167,000 em dashes across 4,601 files need grammatical judgment, not a sed |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 10a/10b/10d across 7 hubs | PASS |
| `node --check` on the checker | Pass |
| SKILL.md + command h2-uppercase | 0 failures across 100 files |
| Skill/command diff | Header-only |
| Parent recursive `--strict` | Clean (parent + all children) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **sk-design rule 6a is unaddressed.** Its `styles/` asset tree is an unregistered child, a pre-existing finding unrelated to the 10a fix.
2. **The repo-wide HVR sweep is a separate project.** Recorded, not run, for the reasons above.
3. **Two benchmark quirks remain by design.** The archived `RIG_ROOT` and the unused `dispatch-swe16` were left in place with a documented rationale.

<!-- /ANCHOR:limitations -->
