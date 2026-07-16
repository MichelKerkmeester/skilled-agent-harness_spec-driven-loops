---
title: "Implementation Summary: generation and cleanup"
description: "Status of the G1-G4 + A-W4/A-G2 generation-and-cleanup phase: doc set materialized, nothing built yet. Planned order is A-W4 tables, then the section-scoped generator with a --check gate, then G2 command-local fixes, A-G2 deep-router slimming, and the G3/G4 validator-WARN canon."
status: in_progress
trigger_phrases:
  - "generation cleanup status"
  - "command router generator status"
  - "argument-hint budget status"
  - "deep router slimming status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-3 doc set for the generation-and-cleanup phase"
    next_safe_action: "Standardize the OWNED ASSETS and EXECUTION TARGETS tables (A-W4) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 0
    open_questions:
      - "G3/G4 heuristics are validator-WARN and may need allowlist tuning once noise is measured."
    answered_questions:
      - "Subaction-router routing_source naming is deferred to phase 004, which authors the field."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-generation-and-cleanup |
| **Status** | In Progress |
| **Completed** | Not yet — doc set materialized; no code, routers, or validators changed |
| **Level** | 3 |
| **Estimated LOC** | ~650 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The Level-3 doc set for the generation-and-cleanup phase is materialized; nothing is built yet. The phase makes `command_contract.json` the single source for the structural spans of every command router via a section-scoped generator with a `--check` drift gate, standardizes the OWNED ASSETS and EXECUTION TARGETS tables the generator parses, repairs three command-local contract mismatches, slims the fat `deep/*` routers by ownership, and canonizes a soft `argument-hint` budget plus command ergonomics as validator-WARN checks. All new checks extend the existing validators. This section will be reconciled to the built state at completion.

<!-- /ANCHOR:exec-summary -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing is built yet.** The following is the planned build, in order. The `deep/*` families and the create-family tables/`.txt` assets are the primary edit surfaces; the generator is a new file.

- **A-W4 table standardization (REQ-002).** Standardize the OWNED ASSETS table to `| Purpose | Asset |` and EXECUTION TARGETS to `| Mode | Target |` across families, so the create family stops diverging from its own template and the generator has one uniform parse target. Lands first.
- **G1 generator + drift gate (REQ-001).** A greenfield `generate-command-routers.cjs` (sibling to `sync-prompts.cjs`) renders the five contract-derivable spans and diffs only those spans under `--check`.
- **G2 command-local fixes (REQ-003).** Repair the `deep/research.md` timeout claim, the `memory/save.md` hint/fallback text, and the create-family `*_presentation.txt` presentation-ownership labels.
- **A-G2 deep-router slimming (REQ-004).** Move display-box and autonomous-directive prose the router's PRESENTATION BOUNDARY assigns to an asset out of the router and into its asset files, behavior-preserving.
- **G3/G4 canon (REQ-005/006).** A soft `argument-hint` ≤140-char budget WARN and the command ergonomics canon (loader gating, agent-existence, raw-echo deprecation, self-sufficiency), wired into `create-command/SKILL.md` Steps 6/9/11 and the create-quality-control gate.

### Files to Change (planned)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs` | Create (planned) | Section-scoped contract→router generator with `--check` drift gate (G1) |
| `.opencode/commands/create/*.md` | Modify (planned) | Standardize divergent OWNED ASSETS / EXECUTION TARGETS tables (A-W4) |
| `.opencode/commands/deep/research.md` | Modify (planned) | Repair timeout claim (G2) |
| `.opencode/commands/memory/save.md` | Modify (planned) | Repair hint / fallback text (G2) |
| `.opencode/commands/create/*_presentation.txt` | Modify (planned) | Repair presentation-ownership labels (G2) |
| `.opencode/commands/deep/*.md` + deep asset files | Modify (planned) | Ownership-first slimming (A-G2) |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify (planned) | Hint-budget + ergonomics WARN checks (G3/G4) |
| `.opencode/commands/scripts/validate-command-references.cjs` | Modify (planned) | Ergonomics coverage extension (G4) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Modify (planned) | Surface the new WARN checks (G3/G4) |
| `.opencode/skills/sk-doc/create-command/SKILL.md` | Modify (planned) | Wire hint budget + ergonomics canon into Steps 6/9/11 (G3/G4) |
| `.opencode/skills/sk-doc/create-command/assets/command_template.md` | Modify (planned) | Document the hint-budget principle (G3) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Nothing is built yet. The planned delivery is behavior-first and gated at each step: standardize the OWNED ASSETS and EXECUTION TARGETS tables (A-W4) so the generator has one uniform parse target; stand up `generate-command-routers.cjs` and prove its `--check` gate clean on the conformant tree and failing on a staled span; repair the three command-local mismatches and confirm them against the phase-003 semantic checks and the span-diff; capture the `deep/*` dispatch snapshot before slimming and verify behavior-preserving afterward; and wire the G3/G4 WARN checks and canon last. Each step is confirmed by a runnable gate before the next begins.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Section-scoped generation, not whole-file | Proposed | Generator regenerates and diffs only the five contract-derivable spans |
| ADR-002 | Greenfield generator composing three precedents | Proposed | Reuses the `sync-prompts.cjs` drift-gate, contract reads, and locked grammar |
| ADR-003 | Extend existing validators, no parallel lint engine | Proposed | G3/G4 checks live in the current validator layer |
| ADR-004 | G3/G4 heuristics ship as validator-WARN | Proposed | Hint budget and ergonomics warn, never hard-fail, pending tuning |
| ADR-005 | Defer subaction-router `routing_source` to phase 004 | Proposed | Keeps the contract field with its owning phase |

See `decision-record.md` for full ADR documentation.

<!-- /ANCHOR:arch-decisions -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Land A-W4 table standardization before G1 | The tables are the generator's parse target; a uniform schema is a prerequisite for a single parser |
| Generator lives beside `sync-prompts.cjs` | Reuse the proven drift-gate skeleton and keep the `codex/` script neighborhood |
| G2 acceptance co-runs the phase-003 checks | Reuse the shipped semantic checks rather than re-implement gate/mode/coverage detection |
| Deep-router slimming is a behavior-preserving move | Ownership, not rewriting; routers keep gates, binding, mode-selection, and summary |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Details |
|-------|--------|---------|
| Generator `--check` clean on conformant tree; staled span fails | Pending | Build not started |
| OWNED ASSETS / EXECUTION TARGETS tables uniform; parser reads all families | Pending | Build not started |
| G2 fixes pass phase-003 gate-obligation / mode-completeness / reference coverage | Pending | Build not started |
| Deep routers behavior-preserving vs snapshot | Pending | Build not started |
| Hint budget warns over-budget, silent on conformant; never hard-fail | Pending | Build not started |
| G4 ergonomics canon in Steps 6/9/11 + create-quality-control gate | Pending | Build not started |
| `validate.sh --strict` on this folder | Doc-set only | Docs authored; strict validation run against this folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:milestones -->
## Milestone Achievement

| Milestone | Target | Actual | Status |
|-----------|--------|--------|--------|
| M1 Uniform tables | Day 1 | — | Pending |
| M2 Generator live | Day 2 | — | Pending |
| M3 Command-local clean | Day 2 EOD | — | Pending |
| M4 Routers slimmed | Day 3 AM | — | Pending |
| M5 Canon + gate green | Day 3 EOD | — | Pending |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built yet.** This packet is the authored plan; the generator, table standardization, command-local fixes, slimming, and WARN canon are all pending.
2. **G3/G4 heuristics are validator-WARN and unmeasured.** The `argument-hint` budget (~20 hints over budget; `speckit/plan` at 511 chars) and the ergonomics checks may need allowlist tuning once real noise is measured (ADR-004).
3. **The `routing_source` sub-item is out of scope here.** Naming the subaction-dispatch router via `routing_source` is deferred to phase 004, which authors the field; it is not an unmet obligation for this phase (ADR-005).

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk ID | Occurred | Impact | Resolution |
|---------|----------|--------|------------|
| R-001 | Not yet | — | Section-scoped generation guards against prose clobber (build pending) |
| R-003 | Not yet | — | Snapshot verification planned before deep-router slimming |
| R-004 | Not yet | — | G3/G4 ship WARN-only; allowlist tuning follow-up recorded |

<!-- /ANCHOR:risks-realized -->
---

## Lessons Learned

### What Is Going Well
- The dependency spine (000 → 001 → 003 → 005) places this cleanup last, so the contract and the phase-003 semantic checks already exist to generate against and gate on.
- A-W4 standardization gives the generator a single uniform parse target before any generation logic is written.

### What To Watch
- The section parser must key on stable span boundaries so a whole-file clobber never happens.
- G3/G4 WARN noise must be measured before any move toward hard-fail.

### Recommendations for the Build
- Capture the `deep/*` dispatch snapshot during Phase 1, before touching any router.
- Tag the conformant `.opencode/commands/` tree as the `--check` baseline before the generator writes anything.

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| — | — | No deviations yet; build not started |

<!-- /ANCHOR:deviations -->
---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Phase 004 defines the `routing_source` contract field; revisit the subaction-router naming sub-item then
- [ ] Measure G3/G4 WARN noise across the corpus and tune the allowlist (ADR-004)
- [ ] Revisit the 140-char `argument-hint` budget after surveying the ~20 current over-budget hints
- [ ] Phase 006 decides Claude command parity (mirror wiring vs re-scope)

<!-- /ANCHOR:follow-up -->
