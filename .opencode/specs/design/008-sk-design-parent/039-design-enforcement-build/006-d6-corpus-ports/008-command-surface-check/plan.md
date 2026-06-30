---
title: "Implementation Plan: design-command-surface-check structural drift audit"
description: "planning. Additive structural/completeness drift stage over the existing /design:* command surface checker — roster reconciliation across wrapper files, metadata records, and route fixtures."
trigger_phrases:
  - "command surface check structural drift"
  - "design command surface completeness audit"
  - "design wrapper roster reconciliation"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/008-command-surface-check"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete; align hubRoute reading to the verified 34/29/5/0"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: design-command-surface-check structural drift audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), `node:fs/promises` only |
| **Target file** | `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` (EXTEND, additive) |
| **Read inputs** | `command-metadata.json`, `mode-registry.json`, `hub-router.json`, `.opencode/commands/design/*.md` |
| **Output** | Deterministic `STATUS=PASS|DRIFT|INVALID` text report + `--json`; `SUMMARY invalid=N drift=N` |
| **Testing** | Inject-mismatch bite runs + clean-surface pass + skill-benchmark hubRoute no-regression |

### Overview
The checker already exists and already enforces every *field-level* invariant the spec names — no surviving `<design request>`, mutation-free modes carry no Write/Edit/Bash, `ownerMode ∈ workflowMode`, aliases unique — by iterating a hardcoded 5-command roster and drift-checking each wrapper against `command-metadata.json`. What it does NOT do is reconcile the surface as a *set*: it never globs `commands/design/*.md`, so an orphan or stale wrapper file is invisible, and it never cross-checks the `hub-router.json` route fixtures, so the command roster and the routing corpus can silently diverge.

This plan adds a single additive **structural/completeness drift stage** that reconciles three rosters — on-disk wrapper files, `command-metadata.json` records, and routable modes (`mode-registry.json` + `hub-router.json`) — flags any asymmetry with a specific drift locus, and resolves R7 handoff/next options against the known roster. The existing field-level checks are preserved unchanged. Spec §3 marks the target "(new)"; in reality R1 (argumentGrammar/choreography) already created it and R7 (handoff/nextOptions) lands before R8 — this is the documented, expected reconciliation, not a contradiction.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec §3 target + §4 build outline + §5 acceptance read in full
- [x] Existing checker behavior mapped (field-level invariants already enforced)
- [x] Net-new gap isolated: roster completeness + route-fixture cross-check + handoff resolution
- [x] Sequencing dependency confirmed: R1 + R7 must land before R8

### Definition of Done
- [x] Structural/completeness stage added, additive (no existing check removed or weakened) — Done: one stage joins the existing `drift[]`; prior field-level checks intact
- [x] Checker reports `STATUS=PASS invalid=0 drift=0` against the clean current surface after R8 — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified)
- [x] Each injected mismatch (incl. R8's new structural cases) fails with a named drift locus — Done: missing-wrapper-DRIFT and orphan-wrapper-DRIFT bites confirmed; prior field bites preserved
- [x] skill-benchmark hubRoute lane unaffected by this phase — Done: lane holds 34/29/5/0; this phase touches no scorer/router file
- [x] New code is evergreen — no spec paths, packet/phase numbers, or R-ids in comments/strings — Done: evergreen scan clean over the one extended file

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-pass deterministic checker. The new stage runs after `validateMetadata()` passes and joins the surface-drift collection, so structural drift and field drift share one sorted `drift[]` and one `SUMMARY` line.

### Key Components
- **Wrapper roster scan**: glob `.opencode/commands/design/*.md` into the actual on-disk command set (replaces sole reliance on the hardcoded `COMMANDS` list as the source of truth for "what exists").
- **Roster reconciliation**: three-way symmetric diff — wrapper files ↔ metadata records ↔ routable modes. Emits `orphan-wrapper` (file with no metadata), `missing-wrapper` (metadata/mode with no file), and `unroutable-command` / `uncommanded-mode` drift loci.
- **Route-fixture cross-check**: assert every metadata `ownerMode` resolves to a `hub-router.json` route and a `mode-registry.json` workflowMode, and that no routable mode lacks a command. This is the spec's "vs route fixtures" comparison.
- **Handoff resolution (consumes R7)**: every `next` / nextOption / handoff target resolves to a command present in the reconciled roster — no dangling handoff, no auto-chain to an unknown recipe.
- **Deterministic emit**: reuse the existing `compareDrift` sort + `emitAndExit`; structural drift carries a `kind` so the locus is greppable.

### Data Flow
1. Load `command-metadata.json`, `mode-registry.json`, `hub-router.json`, glob `commands/design/*.md`.
2. Run existing metadata validation (unchanged) → INVALID short-circuit on field errors.
3. Run existing per-command field/frontmatter/section drift (unchanged).
4. Run NEW roster reconciliation + route-fixture cross-check + handoff resolution.
5. Merge structural drift into the same `drift[]`, sort, emit one `STATUS` + `SUMMARY invalid=N drift=N`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm R1 (argumentGrammar/choreography) and R7 (handoff/nextOptions) have landed in the checker + metadata — Done: both layers verified present before R8
- [x] Capture baseline: current checker `STATUS` + `SUMMARY`, and the hubRoute scorer reading — Done: green baseline + hubRoute 34/29/5/0 captured pre-edit
- [x] Identify the exact insertion seam (post-`validateMetadata`, alongside `collectSurfaceDrift`) — Done: stage inserted at the surface-drift seam

### Phase 2: Core Implementation (additive)
- [x] Add the wrapper-roster glob over `commands/design/*.md` — Done: on-disk command-doc roster globbed
- [x] Add three-way roster reconciliation (files ↔ metadata ↔ modes) with named drift loci — Done: orphan-wrapper / missing-wrapper / unroutable-command / uncommanded-mode loci emitted
- [x] Add route-fixture cross-check against `hub-router.json` + `mode-registry.json` — Done: every ownerMode resolves to a route + workflowMode
- [x] Add R7 handoff/next-option resolution against the reconciled roster — Done: every nextOptions/handoff target resolves; dangling handoff bites
- [x] Wire structural drift into the existing `drift[]` + sort + emit; keep all prior checks intact — Done: one merged `drift[]` + `SUMMARY`; prior field checks unchanged

### Phase 3: Verification
- [x] Bite tests: orphan wrapper, missing wrapper, frontmatter≠metadata, dead `<design request>`, alias collision, route-fixture drift each FAIL — Done: missing-wrapper-DRIFT + orphan-wrapper-DRIFT confirmed; prior field/alias bites preserved
- [x] Clean surface passes: `STATUS=PASS invalid=0 drift=0` — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0
- [x] No-regression: hubRoute lane unaffected by this phase — Done: lane holds 34/29/5/0; no scorer/router file touched
- [x] Evergreen scan: no spec paths / packet ids / R-ids in new code — Done: scan clean over the one extended file
- [x] Honest enforced-vs-advisory note recorded in implementation-summary — Done: roster-symmetry-enforceable vs surface-taste-advisory split recorded

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Bite (negative) | Temp-inject each mismatch class, assert non-zero exit + named drift locus | `node design-command-surface-check.mjs` on a copy/restored fixture |
| Clean (positive) | Unmodified surface yields `STATUS=PASS invalid=0 drift=0` | `node design-command-surface-check.mjs` |
| No-regression | hubRoute scorer lane unchanged at 34/29/5/0 | existing skill-benchmark hubRoute lane |
| Evergreen lint | grep new code for spec paths / `\d{3}-` packet ids / `R\d` ids | `rg` over the changed hunk |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R1 argumentGrammar/choreography in checker+metadata | Internal (sibling) | Required-landed | R8 has no grammar/choreography fields to reconcile |
| R7 handoff/nextOptions in wrappers+metadata | Internal (sibling) | Required-before-R8 | Handoff-resolution clause has nothing to resolve; build R8 last |
| `command-metadata.json` SSOT | Internal | Green | No roster to reconcile against |
| `hub-router.json` + `mode-registry.json` | Internal | Green | No route fixtures to cross-check |
| `node:fs/promises` glob/readdir | External (stdlib) | Green | Cannot enumerate wrapper roster |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New stage emits false-positive drift on the clean surface, or the hubRoute lane regresses from 34/29/5/0.
- **Procedure**: Revert the single additive hunk in `design-command-surface-check.mjs`; the prior field-level checker is fully self-contained and resumes unchanged.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
R1 (grammar/choreography) ──┐
                            ├──> R7 (handoff/nextOptions) ──> R8 (this: structural drift)
                            │
hub-router.json / registry ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| R1 | None | R7, R8 |
| R7 | R1 | R8 |
| R8 (this) | R1, R7 | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + baseline | Low | 30 minutes |
| Roster reconciliation + route-fixture cross-check | Medium | 2-3 hours |
| Handoff resolution (R7 consumption) | Low | 45 minutes |
| Bite tests + no-regression + evergreen scan | Medium | 1.5-2 hours |
| **Total** | | **~5-6 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Clean-surface baseline captured (`STATUS=PASS invalid=0 drift=0`) before edit
- [ ] hubRoute baseline 34/29/5/0 captured before edit
- [ ] Change is a single isolated additive hunk (easy revert)

### Rollback Procedure
1. **Immediate**: `git checkout -- .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`
2. **Verify**: rerun the checker → `STATUS=PASS invalid=0 drift=0` restored
3. **Verify**: rerun hubRoute lane → 34/29/5/0 restored

### Honest enforcement ceiling
- **Code-enforced (deterministic)**: roster symmetry (no orphan/missing wrapper), command↔mode↔route-fixture consistency, dangling-handoff detection, and all prior field-level invariants. Every failure names a specific drift locus.
- **Advisory (NOT proven by this check)**: whether the command surface is *well-designed*, whether a wrapper's prose is good, and whether live NL routes to the right command outside the fixture corpus. The audit proves the surface is structurally consistent, never that it is tasteful or correct on open-ended input.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive single-file checker extension (structural/completeness layer)
- Sequencing R1 -> R7 -> R8; R8 last
- drift=0 contract + hubRoute 34/29/5/0 no-regression + evergreen code
-->
