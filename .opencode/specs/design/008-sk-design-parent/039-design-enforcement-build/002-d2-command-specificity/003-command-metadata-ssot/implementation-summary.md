---
title: "Implementation Summary: D2-R3 — command-metadata.json SSOT + surface-drift checker"
description: "The design command surface now has one source of truth plus a deterministic drift gate; the gate already proves the wrappers are partially aligned and pins the residual for D2-R2."
trigger_phrases:
  - "command metadata ssot implementation summary"
  - "design command surface check delivered"
  - "d2-r3 implementation summary"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/003-command-metadata-ssot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level 2 packet docs for command-metadata SSOT and surface-drift checker"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases, driving checker drift to zero"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r3-command-metadata-ssot"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does OpenCode command frontmatter support an aliases key, or are metadata aliases a hub-keyword projection only? (D2-R2 resolves)"
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
| **Spec Folder** | 003-command-metadata-ssot |
| **Completed** | 2026-06-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The design command surface now has a single source of truth and a gate that proves it. Before this phase the per-command facts lived in three unsynchronized places: the wrapper frontmatter, the hub, and the registry, so any one could drift without anything failing. You can now read every `/design:*` command's contract in one file and run one deterministic check that tells you exactly where a wrapper has fallen out of step.

### The command-surface SSOT

`command-metadata.json` carries one record per `/design:*` command (five total: audit, foundations, interface, md-generator, motion). Each record pins `command`, `ownerMode`, `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `next`, `proofFields`, `deferToHubWhen`, and `toolPolicy.mutatesWorkspace`. The `ownerMode` of each record is constrained to a real `workflowMode` from `mode-registry.json`, and the registry itself stays routing/identity-only and is never touched. The command-surface `aliases` are a distinct namespace from the registry's routing aliases; the registry aliases were left untouched.

### The surface-drift checker

`design-command-surface-check.mjs` is a stateless two-stage Node validator. Stage 1 validates the metadata itself (every `ownerMode` resolves to a `workflowMode`, no alias is owned by two commands, every required field is present) and exits 2 on any violation. Stage 2 reads each wrapper's frontmatter, projects the expected `description`, `argument-hint`, `aliases`, and `allowed-tools` from the metadata (the tool set is derived from `toolPolicy.mutatesWorkspace`), diffs them, and exits 1 on any drift. It resolves every path from `import.meta.url`, so it embeds no absolute or spec paths. This metadata is the upstream contract that D2-R1 (tool policy) and D2-R2 (argument grammar) generate and drift-check against; this phase freezes that shape.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Created | The command-surface SSOT: five `/design:*` records |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Created | Two-stage metadata-validation + surface-drift gate |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The metadata was authored from each child packet's `SKILL.md` plus the wrapper `## PURPOSE` lines, then validated by running the checker against the live registry and wrappers. The orchestrator verified acceptance independently: the JSON parses with exactly five records, every `ownerMode` is a member of the `workflowMode` set `{interface, foundations, motion, audit, md-generator}`, the checker reports `invalid=0` (no alias collision, no missing field), `mode-registry.json` is byte-unchanged, and `node --check` passes on the checker. The checker is deterministic and the report is sorted by command then field.

The build deliberately stops at the SSOT plus the gate. It does not rewrite the wrappers; that is D2-R1 (allowed-tools) and D2-R2 (argument-hint + aliases). A non-zero drift on the still-incomplete wrappers is therefore the correct, expected outcome, not a defect.

### Drift baseline and current state (reconciled)

| Measurement | Drift | Composition |
|-------------|-------|-------------|
| Implementer baseline (this phase's build) | 14 | 5 argument-hint + 5 aliases + 4 allowed-tools over-grant |
| Current independent re-measurement (2026-06-28) | 10 | 5 argument-hint + 5 aliases |

Between the implementer's baseline and this verification, the four read-and-guide wrappers (audit, foundations, interface, motion) lost the `Write, Edit, Bash` over-grant and `md-generator` kept its mutating set, so `allowed-tools` now matches the SSOT for all five commands and the four allowed-tools drifts cleared. All five `description` values already match the SSOT. The residual `drift=10` is exactly the per-command `argument-hint` (still the generic `<design request>`) and the missing `aliases` that D2-R2 will write, driving the checker to `drift=0`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Made `command-metadata.json` the SSOT and kept `mode-registry.json` routing-only | The registry answers "which mode owns this", not "what is the command surface"; mixing them is what let the surface drift in the first place |
| Derived `allowed-tools` from `toolPolicy.mutatesWorkspace` instead of listing tools per record | One boolean is harder to get wrong than a hand-maintained tool array, and it makes the read-and-guide vs mutating split explicit |
| Treated a missing wrapper `aliases` key as drift, not as a pass | The surface needs explicit aliases; absence is a real gap D2-R2 must close, so the gate should surface it |
| Reported the real `drift=10` and reconciled it to the `14` baseline rather than restating `14` | The wrappers changed under the phase; documenting the stale number as current would hide that D2-R1's allowed-tools fix already landed |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `command-metadata.json` parses, 5 records | PASS (records=5) |
| Every `ownerMode` in the `workflowMode` set | PASS (`audit, foundations, interface, md-generator, motion`) |
| No alias collision, no missing field (Stage 1) | PASS (`SUMMARY invalid=0`) |
| `node --check design-command-surface-check.mjs` | PASS (SYNTAX_OK) |
| Checker against current wrappers (Stage 2) | DRIFT, exit 1, `drift=10` (expected: arg-hint + aliases) |
| `mode-registry.json` byte-unchanged | PASS (identity-only, not mutated) |
| Determinism (sorted command/field report) | PASS (stable order) |
| Evergreen (no spec/packet/phase IDs in artifacts) | PASS |

### Expected vs actual drift

The checker is expected to fail (exit 1) until D2-R2 lands, and it does. The `drift=10` decomposes cleanly as 5 generic `argument-hint` drifts plus 5 missing-`aliases` drifts, one pair per command. Zero drift would be wrong at this point because the wrappers do not yet carry per-command argument grammar.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The wrappers do not yet conform.** The checker reports `drift=10` (exit 1) by design. D2-R2 must write each wrapper's per-command `argument-hint` and `aliases` to reach `drift=0`. This is the expected handoff, not a regression.
2. **OpenCode `aliases` frontmatter support is unconfirmed.** It is not established whether OpenCode command frontmatter honors an `aliases` key. D2-R2 must resolve this: add the key if the loader supports it, otherwise treat the metadata `aliases` as the hub-keyword projection and relax the checker's `aliases` drift rule so absence is no longer counted as wrapper drift.
3. **Generated metadata is regenerated downstream.** `description.json` and `graph-metadata.json` are owned by the generation step; validate.sh reports their integrity/drift as residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- SSOT + checker delivered; wrapper conformance deferred to D2-R1/R2
- Drift baseline reconciled (14 -> 10); residual gated on D2-R2
-->
