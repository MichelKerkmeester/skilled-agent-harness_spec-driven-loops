---
title: "Implementation Summary: D2-R2 — Per-mode argument grammar for the /design:* wrappers"
description: "The five /design:* wrappers now carry a real, mode-specific argument-hint sourced verbatim from command-metadata.json, the generic <design request> placeholder is gone, and the surface checker reports drift=0 across the whole D2 command surface."
trigger_phrases:
  - "per-mode arg grammar implementation summary"
  - "design wrapper argument hint delivered"
  - "d2-r2 implementation summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/002-per-mode-arg-grammar"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 impl docs for per-mode arg grammar and aliases resolution"
    next_safe_action: "Run the D2 invocation-example and return-contract phase next"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r2-per-mode-arg-grammar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-per-mode-arg-grammar |
| **Completed** | 2026-06-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Every `/design:*` command now tells the caller exactly what to pass. Before this phase all five wrappers shipped the identical placeholder `argument-hint: "<design request>"`, which taught the user nothing about the real inputs each mode consumes. Each wrapper now carries a grounded, mode-specific `argument-hint` that is byte-identical to the `argumentHint` in `command-metadata.json`, and the surface checker confirms the whole D2 command surface matches the SSOT with `drift=0`.

### The five grounded argument-hints

The grammar for each command is sourced from what that mode actually reads, and each wrapper line matches its metadata value verbatim:

| Command | Shipped `argument-hint` |
|---------|-------------------------|
| **audit** | `<target> [--scope] [--score]` |
| **foundations** | `<axis> <target>` |
| **interface** | `<target> [--mode]` |
| **md-generator** | `<live-url> --output <dir>` |
| **motion** | `<component-state> [--library]` |

The edit is frontmatter-only, one `argument-hint` line per wrapper. No bridge prose (PURPOSE / INSTRUCTIONS / Return Status) was touched, and `allowed-tools` — owned by the sibling D2-R1 phase — was left exactly as that phase set it.

### Aliases open item resolved (metadata-internal)

The open item from the surface design was how aliases should be drift-gated. OpenCode command frontmatter has no `aliases` key, so a wrapper-versus-metadata comparison would report a permanent false drift on every command. This phase resolved it by treating aliases as a **metadata-internal uniqueness check** instead of a wrapper-drift comparison: `design-command-surface-check.mjs` keeps `aliases` out of its `DRIFT_FIELDS` (`description`, `argument-hint`, `allowed-tools`) and instead asserts each alias is owned by exactly one command, failing if any alias is claimed twice. The 15 aliases (3 per command) are validated for uniqueness without ever being projected to the wrappers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/design/audit.md` | Modified | `argument-hint` set to `<target> [--scope] [--score]` |
| `.opencode/commands/design/foundations.md` | Modified | `argument-hint` set to `<axis> <target>` |
| `.opencode/commands/design/interface.md` | Modified | `argument-hint` set to `<target> [--mode]` |
| `.opencode/commands/design/md-generator.md` | Modified | `argument-hint` set to `<live-url> --output <dir>` |
| `.opencode/commands/design/motion.md` | Modified | `argument-hint` set to `<component-state> [--library]` |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Aliases treated as a metadata-internal uniqueness check, not a wrapper-drift field |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) set a real `argumentHint` per command in `command-metadata.json`, projected each value into the matching wrapper's `argument-hint` line so they are byte-identical, and resolved the aliases open item by making the checker treat aliases as a metadata-internal uniqueness assertion rather than a wrapper-drift comparison. The orchestrator verified acceptance independently: the surface checker now reports `STATUS=PASS`, `invalid=0`, `drift=0` across all five commands and 15 aliases; no wrapper retains the generic `<design request>`; `node --check` on the checker passes; and the artifacts are evergreen.

This phase completes the **D2 P0 trio**. D2-R3 delivered the `command-metadata.json` SSOT plus `design-command-surface-check.mjs`; D2-R1 brought `allowed-tools` to least privilege; and this phase (D2-R2) added the per-command argument grammar and resolved the aliases gate. Together they turn five identical generic command stubs into a single SSOT-driven, drift-gated surface.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sourced each grammar from the SSOT and projected it byte-for-byte into the wrapper | One source of truth keeps the wrapper hint and the metadata in lockstep; the checker drift-gates the copy |
| Shipped the simpler flag forms (`[--scope]`, `[--mode]`, no `[--validate]`) | The hint names the slots the caller fills; verbose flag-argument forms add noise without teaching more |
| Resolved aliases as a metadata-internal uniqueness check | OpenCode frontmatter has no `aliases` key, so a wrapper-drift comparison would false-positive forever; uniqueness is the real invariant worth gating |
| Edited only the `argument-hint` line per wrapper | Smallest reversible change; `allowed-tools` (D2-R1) and bridge prose stay intact |
| Treated `allowed-tools` as off-limits | That field is owned by the sibling D2-R1 phase; editing it here would clobber a completed phase |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `design-command-surface-check.mjs` STATUS | PASS (`invalid=0 drift=0`, `commands=5 aliases=15`) |
| No wrapper retains `<design request>` | PASS (grep over all five wrappers returns nothing) |
| Each wrapper `argument-hint` byte-equal to metadata `argumentHint` | PASS (all five match `command-metadata.json` verbatim) |
| Aliases uniqueness gate | PASS (15 aliases, 3 per command, each uniquely owned) |
| `node --check` on the checker | PASS |
| Evergreen (no spec/packet/phase IDs in wrappers) | PASS |

### Whole-surface drift cleared

With this phase the surface checker reaches `drift=0` for the first time: the per-command `argument-hint` is grounded and matches metadata, the `allowed-tools` was aligned by D2-R1, and aliases are gated by uniqueness rather than a phantom wrapper comparison. The D2 command surface is now fully SSOT-driven and drift-gated.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Aliases are not surfaced in the wrappers.** OpenCode command frontmatter has no `aliases` key, so aliases live only in `command-metadata.json` and are gated for uniqueness there. If OpenCode later adds frontmatter alias support, the checker would need an aliases drift field to project them.
2. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; after this doc edit `validate.sh` reports a `SOURCE_FINGERPRINT_MISMATCH` residual under `GENERATED_METADATA_INTEGRITY`, and the orchestrator regenerates them rather than hand-editing.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Per-mode argument grammar on five wrappers; aliases resolved as metadata-internal uniqueness
- Completes the D2 P0 trio (D2-R3 + D2-R1 + D2-R2); surface checker drift=0
-->
