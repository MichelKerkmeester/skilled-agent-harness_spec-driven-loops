---
title: "Implementation Summary: generation and cleanup"
description: "Final state of the G1-G4 + A-W4/A-G2 generation-and-cleanup phase: G1 generator + --check gate, A-W4 table standardization, and the G3/G4 validator-WARN canon shipped; G2 command-local fixes resolved as a confirmed no-op and A-G2 deep-router slimming resolved as evidence-satisfied. All gates green; validate.sh --strict Errors:0."
status: complete
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
    last_updated_at: "2026-07-16T18:23:19Z"
    last_updated_by: "claude"
    recent_action: "Shipped G1-G4 + resolved G2/A-G2 by evidence; gates green"
    next_safe_action: "Merge the worktree and FF-push to origin"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 100
    open_questions:
      - "G3/G4 heuristics are validator-WARN and may need allowlist tuning once noise is measured."
    answered_questions:
      - "Subaction-router routing_source naming is deferred to phase 004, which authors the field."
      - "G2 was a confirmed no-op and A-G2 was resolved by evidence; no router mutation was required."
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
| **Status** | Complete |
| **Completed** | 2026-07-16 — G1/A-W4/G3/G4 shipped; G2 no-op and A-G2 evidence-satisfied; strict gates green |
| **Level** | 3 |
| **Estimated LOC** | ~650 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The generation-and-cleanup phase is complete. `generate-command-routers.cjs` now makes `command_contract.json` the single source for the contract-derivable spans of every command router, with a `--check` drift gate that reports `35/35 routers clean, 0 path-drift, 0 shape-drift` and fails on a staled asset path (`2e21f4eb77`, `164b06a571`). The OWNED ASSETS and EXECUTION TARGETS tables were standardized to `| Purpose | Asset |` and `| Mode | Target |` across families (`164b06a571`, `5fbf223ec8`). The soft `argument-hint` budget WARN (`801c636d7f`) and the command ergonomics canon — loader gating, agent-existence, `User request: $ARGUMENTS` raw-echo deprecation, and the template self-sufficiency invariant (`71ed27a8e9`) — landed as validator-WARN checks in the shared validator, with the canon wired into `create-command/SKILL.md` Steps 6/9/11 and `command_template.md`. Two backlog items resolved without a router mutation: G2 (three command-local mismatches) was a confirmed no-op — the phase-003 adapter returns `[]` and path-drift is zero — and A-G2 (deep-router slimming) was evidence-satisfied because the display content is already externalized to the `deep_*_presentation.txt` assets while the routers' remaining bulk is load-bearing behavioral safeguards the PRESENTATION BOUNDARY does not assign to an asset. All new checks extend the existing validators; no parallel lint engine was added. `validate.sh --strict` on this folder is Errors:0.

<!-- /ANCHOR:exec-summary -->
---

<!-- ANCHOR:what-built -->
## What Was Built

All six requirements are done or resolved-by-evidence. The generator is a new file; the create-family tables and `.txt` assets were the primary reshaped surfaces.

- **A-W4 table standardization (REQ-002) — shipped (`164b06a571`, `5fbf223ec8`).** OWNED ASSETS was standardized to `| Purpose | Asset |` (create×11 + memory×4 collapsed 3-col→2-col) and EXECUTION TARGETS to `| Mode | Target |` (design/speckit/deep headers flipped from `Workflow`; create's 11 numbered procedures reshaped into `| Mode | Target |` tables with routing steps relocated to MODE ROUTING). `validate_document.py --type command` exits 0 on the reshaped routers.
- **G1 generator + drift gate (REQ-001) — shipped (`2e21f4eb77`, `164b06a571`).** A greenfield `generate-command-routers.cjs` (sibling to `sync-prompts.cjs`) reads `command_contract.json` and diffs the contract-derivable spans. `--check` reports `35/35 routers clean, 0 path-drift, 0 shape-drift`; a staled asset path makes `--check` fail with `PATH-DRIFT` (negative test passed); `--write` normalizes table shape + asset-path cells only.
- **G2 command-local fixes (REQ-003) — resolved as a confirmed no-op.** The three asserted mismatches (`deep/research.md` timeout, `memory/save.md` hint/fallback, create-family presentation-ownership labels) were already contract-consistent — fixed by the earlier 001/003 conformance work (the 014 research described the pre-conformance state). Objective evidence: the phase-003 adapter `sk-doc-command.cjs check .opencode/commands` returns `[]` (zero findings) on the whole tree; the generator `--check` path-drift=0.
- **A-G2 deep-router slimming (REQ-004) — evidence-satisfied, operator-approved no mutation.** The display content is already externalized to the 300-470-line `deep_*_presentation.txt` assets (routers §2-6 are thin references). The routers' remaining bulk is load-bearing behavioral safeguards (PHASE 0 dispatch-context gate, MANDATORY INPUT GATE, AUTONOMOUS EXECUTION DIRECTIVE) the PRESENTATION BOUNDARY does not assign to an asset; the one inline `⛔ DIRECT INVOCATION REQUIRED` box is the fail-fast dispatch-gate display (appears in 0/7 presentation assets) and is intentionally inline. Forcing these into assets is high-risk regression for ~zero value.
- **G3 hint-budget WARN + canon (REQ-005) — shipped (`801c636d7f`).** A soft ≤140-char `argument-hint` budget WARN (severity=warning, never blocks) was added to `validate_document.py`; 22 over-budget hints warn (speckit/plan 508, deep/research 540); conformant hints stay silent; exit stays 0. The "hint summarizes, EXECUTION TARGETS enumerates" principle is wired into `create-command/SKILL.md` Step 6 and `command_template.md`.
- **G4 ergonomics canon (REQ-006) — shipped (`71ed27a8e9`).** A `User request: $ARGUMENTS` raw-echo deprecation WARN (14 files warn, 0 hard-blocks) was added to `validate_document.py`. The ergonomics canon (argument-echo deprecation, loader-gating, agent-existence, and the template self-sufficiency invariant) is documented in `create-command/SKILL.md` Step 9 and Step 11. The ergonomics WARNs live in the shared validator (the create-quality-control gate); the subaction-router `routing_source` naming stays deferred to phase 004.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs` | Created | Section-scoped contract→router generator with `--check` drift gate (G1) |
| `.opencode/commands/create/*.md` | Modified | Standardized divergent OWNED ASSETS / EXECUTION TARGETS tables (A-W4) |
| `.opencode/commands/**` (deep/design/speckit/memory routers) | Modified | Normalized OWNED ASSETS / EXECUTION TARGETS table shapes (A-W4) |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Hint-budget WARN (G3) + raw-echo ergonomics WARN (G4) |
| `.opencode/skills/sk-doc/create-command/SKILL.md` | Modified | Hint principle Step 6; loader-gating + raw-echo Step 9; self-sufficiency Step 11 (G3/G4) |
| `.opencode/skills/sk-doc/create-command/assets/command_template.md` | Modified | Documented the hint-budget principle (G3) |
| `.opencode/commands/deep/research.md`, `.opencode/commands/memory/save.md`, `.opencode/commands/create/*_presentation.txt` | No change | G2 no-op — already contract-consistent; adapter `[]` |
| `.opencode/commands/deep/*.md` + deep asset files | No change | A-G2 evidence-satisfied — display already externalized; safeguards stay |
| `.opencode/commands/scripts/validate-command-references.cjs`, `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | No change | T022 scoping — ergonomics WARNs kept in the shared validator, out of the differential-tested conformance adapter by design |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery was gated at each step. A-W4 standardized the OWNED ASSETS and EXECUTION TARGETS tables first so the generator had one uniform parse target; `generate-command-routers.cjs` then landed with its `--check` gate proven clean on the conformant tree (`35/35 routers clean`) and failing on a staled asset path (`PATH-DRIFT`). The three command-local mismatches (G2) were checked against the phase-003 adapter and found already contract-consistent — a confirmed no-op rather than an edit, evidenced by the adapter returning `[]`. The deep-router slimming (A-G2) was resolved by evidence rather than executed: the display is already externalized to the `deep_*_presentation.txt` assets, so slimming would only strip load-bearing behavioral safeguards; the operator approved leaving the routers untouched. The G3 hint-budget WARN and the G4 ergonomics WARN + canon landed last in the shared validator and `create-command/SKILL.md`. Each step was confirmed by a runnable gate before the next began.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Section-scoped generation, not whole-file | Accepted | Generator regenerates and diffs only contract-derivable spans |
| ADR-002 | Greenfield generator composing three precedents; NFR-C02 refined to shape + asset-path drift | Accepted | Reuses the `sync-prompts.cjs` drift-gate, contract reads, and locked grammar; diffs table SHAPE + asset-path cells, not humanized label text |
| ADR-003 | Extend existing validators, no parallel lint engine | Accepted | G3/G4 checks live in the current validator layer |
| ADR-004 | G3/G4 heuristics ship as validator-WARN | Accepted | Hint budget and ergonomics warn, never hard-fail, pending tuning |
| ADR-005 | Defer subaction-router `routing_source` to phase 004 | Accepted | Keeps the contract field with its owning phase |

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
| Generator `--check` clean on conformant tree; staled span fails | PASS | `35/35 routers clean, 0 path-drift, 0 shape-drift`; negative test: staled asset path → `PATH-DRIFT` |
| OWNED ASSETS / EXECUTION TARGETS tables uniform; parser reads all families | PASS | `validate_document.py --type command` exit 0 on reshaped create routers (`164b06a571`, `5fbf223ec8`) |
| G2 fixes pass phase-003 gate-obligation / mode-completeness / reference coverage | PASS (no-op) | phase-003 adapter `sk-doc-command.cjs check .opencode/commands` returns `[]`; already contract-consistent |
| Deep routers behavior-preserving | PASS (no mutation) | A-G2 evidence-satisfied; display already externalized to `deep_*_presentation.txt`; routers untouched |
| Hint budget warns over-budget, silent on conformant; never hard-fail | PASS | 22 over-budget hints WARN (speckit/plan 508, deep/research 540); conformant silent; exit 0 (`801c636d7f`) |
| G4 ergonomics canon in Steps 6/9/11 + create-quality-control gate | PASS | raw-echo WARN 14 files, 0 hard-blocks; canon in Steps 9/11 (`71ed27a8e9`) |
| `validate.sh --strict` on this folder | PASS | Errors:0 (see closing report) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:milestones -->
## Milestone Achievement

| Milestone | Target | Actual | Status |
|-----------|--------|--------|--------|
| M1 Uniform tables | Day 1 | `164b06a571`, `5fbf223ec8` | Done |
| M2 Generator live | Day 2 | `2e21f4eb77` (`--check` 35/35 clean) | Done |
| M3 Command-local clean | Day 2 EOD | G2 no-op; adapter `[]` | Done |
| M4 Routers slimmed | Day 3 AM | A-G2 evidence-satisfied; no mutation | Done |
| M5 Canon + gate green | Day 3 EOD | `801c636d7f`, `71ed27a8e9`; strict Errors:0 | Done |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

Limitations and the load-bearing decisions taken at completion (G2 no-op, A-G2 evidence-satisfied, T022 scoping, routing_source deferral):

1. **G2 was a confirmed no-op, not an edit.** The three asserted command-local mismatches were already contract-consistent (fixed by the earlier 001/003 conformance; the 014 research described the pre-conformance state). Evidence: the phase-003 adapter `sk-doc-command.cjs check .opencode/commands` returns `[]`, and generator `--check` path-drift=0. No router was mutated for G2.
2. **A-G2 was resolved as evidence-satisfied (operator-approved), not by slimming.** The display content is already externalized to the `deep_*_presentation.txt` assets; the routers' remaining bulk is load-bearing behavioral safeguards (PHASE 0 gate, MANDATORY INPUT GATE, AUTONOMOUS EXECUTION DIRECTIVE) the PRESENTATION BOUNDARY does not assign to an asset. The one inline `⛔ DIRECT INVOCATION REQUIRED` box is the fail-fast dispatch-gate display and is intentionally inline — moving it would make a fail-fast gate depend on loading the very asset it cannot assume is loadable when mis-invoked (it appears in 0/7 presentation assets). No router was mutated for A-G2.
3. **T022 adapter scoping — ergonomics WARNs are in the shared validator, not the conformance adapter (by design).** The G3/G4 ergonomics WARNs live in `validate_document.py` (the create-quality-control gate). They are deliberately kept OUT of the differential-tested deep-alignment conformance adapter (`sk-doc-command.cjs`) — a category separation between authoring polish and the conformance gate that also avoids a disproportionate coordinated oracle+fixtures+re-freeze change.
4. **The `routing_source` sub-item is deferred to phase 004.** Naming the subaction-dispatch router via `routing_source` is deferred to phase 004, which authors the field (undefined for all families today); it is not an unmet obligation for this phase (ADR-005).
5. **G3/G4 heuristics are validator-WARN and unmeasured.** The `argument-hint` budget (22 hints over budget; speckit/plan 508, deep/research 540) and the raw-echo check may need allowlist tuning once real noise is measured (ADR-004).

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk ID | Occurred | Impact | Resolution |
|---------|----------|--------|------------|
| R-001 | No | None | Section-scoped generation held; `--write` touched only table-shape + asset-path cells, no prose clobber |
| R-003 | No | None | A-G2 resolved by evidence; no `deep/*` router was mutated, so no dispatch-behavior risk was taken |
| R-004 | No | None | G3/G4 shipped WARN-only (exit 0); allowlist-tuning follow-up recorded |

<!-- /ANCHOR:risks-realized -->
---

## Lessons Learned

### What Went Well
- The dependency spine (000 → 001 → 003 → 005) placed this cleanup last, so the contract and the phase-003 semantic checks already existed to generate against and gate on — which is exactly what let G2 be confirmed a no-op via the adapter returning `[]`.
- A-W4 standardization gave the generator a single uniform parse target before any generation logic was written.
- Checking assertions against real tooling (the phase-003 adapter, the generator `--check`) rather than the 014 research narrative surfaced that two backlog items (G2, A-G2) were already satisfied — avoiding two unnecessary router mutations.

### What To Watch
- NFR-C02 is refined: the generator owns table SHAPE + contract-derived asset-path cells and flags path/shape drift, not a whole-span byte-match — the humanized Purpose/Mode label text is not in the contract (ADR-002).
- G3/G4 WARN noise must be measured before any move toward hard-fail.

### Lessons
- The `deep/*` display was already externalized to `deep_*_presentation.txt`, so A-G2 "slimming" would only have stripped load-bearing behavioral safeguards — the ownership boundary, not raw length, decides what belongs in an asset.

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Repair three command-local mismatches (G2) | No edit — confirmed no-op | Already contract-consistent (fixed by 001/003 conformance); phase-003 adapter `[]`, path-drift=0 |
| Slim the fat `deep/*` routers (A-G2) | No mutation — evidence-satisfied | Display already externalized to `deep_*_presentation.txt`; remaining bulk is load-bearing safeguards the boundary keeps in the router; operator-approved |
| Whole-span byte-match (NFR-C02 as originally worded) | Shape + asset-path drift | Humanized Purpose/Mode label text is not in the contract; the contract is phase-001-owned (ADR-002 refinement, operator-approved) |
| Surface ergonomics WARNs through the `sk-doc-command.cjs` adapter (T022) | WARNs in shared validator only | Category separation: authoring-polish quality-control gate vs the differential-tested conformance adapter; avoids a coordinated oracle+fixtures+re-freeze change |

<!-- /ANCHOR:deviations -->
---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Phase 004 defines the `routing_source` contract field; revisit the subaction-router naming sub-item then
- [ ] Measure G3/G4 WARN noise across the corpus and tune the allowlist (ADR-004)
- [ ] Revisit the 140-char `argument-hint` budget after surveying the ~20 current over-budget hints
- [ ] Phase 006 decides Claude command parity (mirror wiring vs re-scope)

<!-- /ANCHOR:follow-up -->
