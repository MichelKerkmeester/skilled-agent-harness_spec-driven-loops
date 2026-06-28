---
title: "Implementation Summary: D2-R1 — Strip tool over-grant from the read-and-guide /design:* wrappers"
description: "The four read-and-guide /design:* wrappers are now least-privilege; stripping their Write/Edit/Bash over-grant brought allowed-tools into parity with the command-metadata.json toolPolicy SSOT and cleared four surface drifts."
trigger_phrases:
  - "strip tool over-grant implementation summary"
  - "design wrapper least privilege delivered"
  - "d2-r1 implementation summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/001-strip-tool-over-grant"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 impl docs for the wrapper allowed-tools strip"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r1-strip-tool-over-grant"
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
| **Spec Folder** | 001-strip-tool-over-grant |
| **Completed** | 2026-06-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The four read-and-guide `/design:*` wrappers are now least-privilege. Before this phase all five wrappers shared the same mutating toolset `Read, Write, Edit, Bash, Glob, Grep`, so `audit`, `foundations`, `interface`, and `motion` — modes that only read source and cite the shared design reference base — carried Write/Edit/Bash they never legitimately use. Each of those four wrappers now declares exactly `Read, Glob, Grep`, matching its `command-metadata.json` `toolPolicy.mutatesWorkspace: false`. A mutation-free design command can no longer reach the workspace-mutating tools.

### The least-privilege strip

The edit is frontmatter-only and touches one line per wrapper: the `allowed-tools` line. The `md-generator` wrapper — the only `mutatesWorkspace: true` command, which runs the embedded Playwright extract-write-validate pipeline — keeps its full `Read, Write, Edit, Bash, Glob, Grep` set and was left byte-unchanged. No bridge prose (PURPOSE / INSTRUCTIONS / Return Status) was edited, so each wrapper still loads its mode as a thin bridge.

### SSOT parity

This phase reads `command-metadata.json` `toolPolicy.mutatesWorkspace` as the single source of truth and aligns the wrapper `allowed-tools` projection to it. The metadata is the read-only authority here (it was created by the sibling D2-R3 phase); this phase never edits it. With the strip in place the `allowed-tools` of all five wrappers now match their `toolPolicy`, so `design-command-surface-check.mjs` no longer reports an allowed-tools drift for the four read-and-guide commands.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/design/audit.md` | Modified | `allowed-tools` stripped to `Read, Glob, Grep` |
| `.opencode/commands/design/foundations.md` | Modified | `allowed-tools` stripped to `Read, Glob, Grep` |
| `.opencode/commands/design/interface.md` | Modified | `allowed-tools` stripped to `Read, Glob, Grep` |
| `.opencode/commands/design/motion.md` | Modified | `allowed-tools` stripped to `Read, Glob, Grep` |
| `.opencode/commands/design/md-generator.md` | Unchanged | Mutating wrapper preserved (out of scope) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high) read the SSOT `toolPolicy`, captured the five-wrapper baseline (`Read, Write, Edit, Bash, Glob, Grep` on all five), then rewrote the four read-and-guide `allowed-tools` lines and left `md-generator` alone. The orchestrator verified acceptance independently: the four wrappers show `allowed-tools: Read, Glob, Grep`; `md-generator` is byte-unchanged; `design-command-surface-check.mjs` reports the allowed-tools drift for those four is gone (surface drift dropped from 14 to 10); the wrappers still parse; and the artifacts are evergreen.

The residual `drift=10` is exactly the per-command `argument-hint` (still the generic `<design request>`) plus the missing `aliases` across the five commands. Driving that to `drift=0` is the sibling **D2-R2** phase's responsibility, not this phase's. A non-zero residual is therefore the correct, expected post-phase state, not a defect.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stripped Write/Edit/Bash from the four read-and-guide wrappers only | They read and guide; granting workspace-mutating tools they never use is an over-grant the SSOT marks `mutatesWorkspace: false` |
| Left `md-generator` byte-unchanged | It is the only `mutatesWorkspace: true` mode (Playwright extract-write-validate); its mutating tools are legitimate |
| Edited frontmatter only, one `allowed-tools` line per wrapper | Smallest reversible change that achieves parity; bridge prose stays intact so the modes still load |
| Treated `command-metadata.json` as read-only | The metadata is the SSOT this phase aligns to, authored by D2-R3; editing it here would cross the phase boundary |
| Left the argument-hint + aliases residual to D2-R2 | That drift is a different dimension of the surface; scoping it here would mix two phases' work |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| interface/foundations/motion/audit `allowed-tools: Read, Glob, Grep` | PASS (all four, line 4) |
| md-generator `allowed-tools` byte-unchanged | PASS (`Read, Write, Edit, Bash, Glob, Grep`) |
| No `Write`/`Edit`/`Bash` in the four read-and-guide wrappers | PASS (grep returns nothing) |
| `design-command-surface-check.mjs` allowed-tools drift for the four | PASS (cleared; surface drift 14 → 10) |
| Wrappers still parse / bridges still load | PASS (frontmatter valid; prose intact) |
| Evergreen (no spec/packet/phase IDs in wrappers) | PASS |

### Expected vs actual drift

The checker still exits non-zero by design: the residual `drift=10` decomposes as 5 generic `argument-hint` plus 5 missing `aliases`, one pair per command, all owned by D2-R2. Zero drift would be wrong at this point because the wrappers do not yet carry per-command argument grammar. The four allowed-tools drifts this phase owned are gone.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The surface checker still reports `drift=10` (exit 1) by design.** The remaining drift is the per-command `argument-hint` + `aliases`, owned by the sibling D2-R2 phase. This is the expected handoff, not a regression from this phase.
2. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; validate.sh reports a `SOURCE_FINGERPRINT_MISMATCH` residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Allowed-tools strip on four read-and-guide wrappers; md-generator frozen
- Residual argument-hint + aliases drift owned by sibling D2-R2 (surface drift 14 -> 10)
-->
