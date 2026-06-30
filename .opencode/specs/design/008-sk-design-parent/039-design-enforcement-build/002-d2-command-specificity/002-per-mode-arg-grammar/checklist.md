---
title: "Verification Checklist: Per-mode arg grammar for /design:* wrappers"
description: "Verification evidence that every /design:* wrapper carries a real, grounded argumentHint sourced from command-metadata.json with no surviving generic placeholder."
trigger_phrases:
  - "arg grammar checklist"
  - "per-mode argument hint checklist"
  - "design command arg grammar"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/002-per-mode-arg-grammar"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all checklist items with evidence; add Fix Completeness section"
    next_safe_action: "Run the D2 invocation-example and return-contract phase next"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r2-per-mode-arg-grammar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Per-mode arg grammar for /design:* wrappers

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

- [x] CHK-001 [P0] Command-metadata SSOT phase (D2-R3) landed: `command-metadata.json` exists with an `argumentHint` key per command and `design-command-surface-check.mjs` runs
  - **Evidence**: both present under `.opencode/skills/sk-design/`; sibling 003-command-metadata-ssot landed them.
- [x] CHK-002 [P0] Per-command grammar grounded in real inputs by reading each command body + matching mode `SKILL.md`
  - **Evidence**: grammar table in plan.md §3 traces each value to the mode's `SKILL.md` positional/flag inputs.
- [x] CHK-003 [P1] Prior `argument-hint` baseline captured (all five identical `<design request>`) for rollback
  - **Evidence**: baseline recorded; all five wrappers read `argument-hint: "<design request>"` before the edit.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No wrapper retains the generic `argument-hint: "<design request>"`
  - **Evidence**: grep over all five `.opencode/commands/design/*.md` returns no `<design request>`.
- [x] CHK-011 [P0] Each wrapper `argument-hint` is byte-equal to its `command-metadata.json` `argumentHint`
  - **Evidence**: checker reports `drift=0`; audit/foundations/interface/md-generator/motion lines all match the SSOT verbatim.
- [x] CHK-012 [P1] Each `argumentHint` is specific and matches the command's real inputs (positional + flags the mode actually consumes)
  - **Evidence**: each value traces to its mode `SKILL.md` per the plan.md §3 grounding column.
- [x] CHK-013 [P1] Only the `argument-hint` line changed per wrapper; `allowed-tools` (owned by D2-R1) and `description` untouched
  - **Evidence**: single-line change per wrapper; `allowed-tools` left exactly as D2-R1 set it.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `design-command-surface-check.mjs` passes its arg-grammar presence check
  - **Evidence**: `STATUS=PASS STAGE=complete`, `SUMMARY invalid=0 drift=0`, `commands=5 aliases=15`.
- [x] CHK-021 [P0] One example invocation per command tokenizes cleanly against its declared grammar
  - **Evidence**: five-row parse table (plan.md §5) tokenizes each invocation against its grammar slots.
- [x] CHK-022 [P1] md-generator grammar `<live-url> --output <dir>` matches `extract.ts` required positional URL + required `--output`
  - **Evidence**: `design-md-generator/SKILL.md` §3 Invocation (`extract.ts <url> --output <dir>`, `--output` REQUIRED).
- [x] CHK-023 [P1] audit `<target> [--scope] [--score]`, motion `<component-state> [--library]`, foundations `<axis> <target>`, interface `<target> [--mode]` each trace to their mode `SKILL.md`
  - **Evidence**: design-{audit,motion,foundations,interface}/SKILL.md confirm each positional/flag.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug`, fixed across the whole command surface
  - **Evidence**: the generic `<design request>` placeholder was replaced on all five wrappers in one pass, not one instance; the producer inventory is the five `/design:*` commands.
- [x] CHK-FIX-002 [P0] Consumer inventory completed for the changed surface
  - **Evidence**: the consumers of `argument-hint` are the OpenCode command loader plus `design-command-surface-check.mjs`; both re-checked, drift cleared to 0 and bridges still load.
- [x] CHK-FIX-003 [P1] Aliases open item fully resolved, with its gating mechanism named
  - **Evidence**: aliases gated as a metadata-internal uniqueness check (each alias owned by one command), kept out of the checker's wrapper `DRIFT_FIELDS`; 15 aliases validated.
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report, not a moving measurement
  - **Evidence**: `STATUS=PASS invalid=0 drift=0` is reproduced from `design-command-surface-check.mjs`, re-runnable on demand; `node --check` on the checker passes.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No mutating behavior introduced — frontmatter-line + JSON-field edits plus an additive aliases-uniqueness gate, no runtime behavior changed
  - **Evidence**: wrapper edits are single `argument-hint` lines; the checker change adds a uniqueness assertion, it does not alter command execution.
- [x] CHK-031 [P1] `argument-hint` change does not alter `allowed-tools` tool surface (D2-R1 boundary respected)
  - **Evidence**: `allowed-tools` byte-unchanged on all five wrappers; the D2-R1 least-privilege set is intact.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Every `argumentHint` value is evergreen — no spec/packet/phase IDs or spec paths embedded
  - **Evidence**: grep of the five metadata values + five wrapper lines returns zero spec IDs or paths.
- [x] CHK-041 [P1] spec.md / plan.md / tasks.md / checklist.md synchronized on the final grammar
  - **Evidence**: all four carry the shipped grammar (`<target> [--scope] [--score]`, `<axis> <target>`, `<target> [--mode]`, `<live-url> --output <dir>`, `<component-state> [--library]`).
- [x] CHK-042 [P2] Sequential coordination with D2-R1 noted so neither phase clobbers the other's frontmatter edits
  - **Evidence**: plan.md §6 Dependencies records that this phase edits only `argument-hint` and leaves `allowed-tools` to D2-R1.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edits confined to the five `.opencode/commands/design/*.md` `argument-hint` lines + the `argumentHint` field in `command-metadata.json` + the checker aliases logic
  - **Evidence**: change set limited to the five wrapper `argument-hint` lines, the metadata `argumentHint`/`aliases`, and `design-command-surface-check.mjs`; no other files touched.
- [x] CHK-051 [P1] No temp files left outside the phase folder / scratch
  - **Evidence**: no temp files created outside scratch during this phase.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: Build verification (five wrappers carry grounded argument-hints matching the SSOT verbatim; surface checker `STATUS=PASS invalid=0 drift=0`; aliases gated by uniqueness; `node --check` passes; evergreen clean)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
