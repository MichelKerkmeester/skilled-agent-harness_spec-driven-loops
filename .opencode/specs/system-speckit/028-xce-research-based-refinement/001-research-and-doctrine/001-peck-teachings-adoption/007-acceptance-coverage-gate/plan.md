---
title: "Implementation Plan: 011 — Acceptance-Criteria Coverage Gate"
description: "Plan for the revived T1 acceptance-criteria coverage gate: AC-format normalization (hard prerequisite), an AC traceability table in the checklist template, a warn-first AC_COVERAGE validation rule with a configurable floor and an automation-infeasible escape hatch, and deep-review verdict binding with per-level AND lifecycle opt-in. Rollout copies the SPECKIT_SAVE_QUALITY_GATE warn->error precedent. Depends on 010 fixtures and the pending 001/002 shared-template window."
trigger_phrases:
  - "027 phase 011"
  - "acceptance coverage gate"
  - "AC_COVERAGE rule"
  - "AC traceability table"
  - "AC-format normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate"
    last_updated_at: "2026-06-10T07:17:10Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed opt-in INFO AC coverage source pass"
    next_safe_action: "Plan validator v3 dispatch wiring if approved"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Final SPECKIT_AC_COVERAGE_FLOOR default (proposed 0.9)"
      - "Whether L3 counts story-ACs only or both tables (recommend story-ACs only)"
    answered_questions:
      - "AC-format normalization is a HARD prerequisite, not optional (cross-model verified)"
---
# Implementation Plan: 011 — Acceptance-Criteria Coverage Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (manifest templates, validation docs, deep-review SKILL, CLAUDE.md/AGENTS.md), JSON (validator registry), and one new validation rule script (`ac-coverage.*`, the strict TS-validator seam) |
| **Framework** | OpenCode agent runtime + system-spec-kit validation harness (`validate.sh`, `validator-registry.json`, the strict TS-validator seam) |
| **Storage** | None new - reuses the existing AC classification columns and the `EVIDENCE_CITED` infrastructure; the only new persistence is the flag activation-timestamp pattern copied from `save-quality-gate.ts` |
| **Testing** | Manual template-render review + grep checks; the 010 reviewer-benchmark regression fixtures (AC stale-verdict / under-covered cases); strict spec validation |

### Overview

Phase 011 revives the long-deferred T1 acceptance-criteria coverage gate as a staged, reuse-heavy packet. The five proposal phases are represented here as Implementation Phases 1-5 (single packet, no nested phase-child folders). The integration thesis is zero new infrastructure: AC-format normalization edits the existing `spec.md.tmpl`; the traceability table edits `checklist.md.tmpl`; the `AC_COVERAGE` rule rides `validate.sh` and `validator-registry.json`; deep-review binding rides the existing verdict line; rollout copies `SPECKIT_SAVE_QUALITY_GATE` verbatim. UX and automation are first-class: every coverage shortfall surfaces one aggregated actionable message, the rule auto-counts ACs and parses evidence (SEMI-AUTO), and the net-new opportunity to auto-generate AC stubs from the requirement table removes blank authoring. The packet has a HARD ordering: AC-format normalization (Phase 1) must precede the rule because the rule can count but cannot classify on placeholder AC text. It depends on 010 for the regression fixtures that gate any ERROR promotion, and on the pending `001/002-self-check-templates` shared-manifest-template edit window.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Proposal P011 scope identified in `research/006-peck-source-deep-mining/sub-packet-proposal.md` §3 (Packet 011) + §7.
- [x] Integration model, impact matrix, UX table, automation table, and rollout waves identified in `research/006-peck-source-deep-mining/integration-plan.md`.
- [x] Verdict evidence for T1 identified in `research/006-peck-source-deep-mining/research.md` §2 (T1) and the cross-model classification constraint in §5.
- [x] Rollout precedent identified (`SPECKIT_SAVE_QUALITY_GATE`, `save-quality-gate.ts`).
- [x] 010 reviewer-benchmark fixtures remain a hard dependency for ERROR promotion. [EVIDENCE: ERROR promotion not executed]
- [x] Shared-manifest-template edit window not required for this source-pass. [EVIDENCE: shared templates not modified]

### Definition of Done

- [x] Phase 1: template normalization deferred out of current source-pass scope. [EVIDENCE: `spec.md.tmpl` not modified]
- [x] Phase 2: checklist template traceability table deferred out of current source-pass scope. [EVIDENCE: `checklist.md.tmpl` not modified]
- [x] Phase 3: `AC_COVERAGE` rule added as INFO/default-off with configurable floor and escape hatch; registered and documented. [EVIDENCE: registry JSON parse and docs updated]
- [x] Phase 4: deep-review verdict surface documents advisory coverage signal with lifecycle opt-in; `AGENTS.md` pointer added. [EVIDENCE: SKILL/YAML parse and AGENTS grep checks]
- [x] Phase 5: ERROR promotion documented as deferred and not executed. [EVIDENCE: registry severity `info`; `SPECKIT_AC_COVERAGE_ENFORCE=false`]
- [x] AC-stub auto-generation deferred out of current source-pass scope. [EVIDENCE: no template/generator files modified]
- [x] Rollout uses stricter default-off INFO safety; flags documented. [EVIDENCE: `SPECKIT_AC_COVERAGE` default false and floor 0.9]
- [x] Green fixtures required before any future ERROR promotion. [EVIDENCE: no ERROR promotion shipped]
- [x] Strict spec validation passes for this packet. [EVIDENCE: final validation step]
<!-- /ANCHOR:quality-gates -->

**Source-pass completion note:** The current approved implementation scope intentionally excludes shared manifest templates, auto-stub generation, `CLAUDE.md`, and ERROR promotion. Delivered items are the default-off INFO rule, registry/docs/ENV entries, deep-review advisory signal, `AGENTS.md` pointer, and strict-validation proof that existing valid folders remain clean.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reuse-over-rebuild rule adoption, staged behind a warn-first flag. AC location (columns), evidence parsing (`EVIDENCE_CITED`), and the fresh-context reviewer (deep-review) already exist; this packet wires them into a coverage signal rather than building parallel infrastructure. The ordering is the defining architectural constraint: normalization first (so ACs are classifiable), then the table (so evidence has a home), then the rule (so coverage is measured), then the deep-review binding (so an under-covered folder cannot be silently passed). ERROR promotion is a separate, deferred phase gated on warn-volume evidence and green 010 fixtures.

### Key Components

- **AC-format normalization (Phase 1)**: `spec.md.tmpl` L1/L2 acceptance-criteria cells become `precondition + action -> outcome` assertions; L3 requirement tables are tightened so their criteria are assertion-shaped. This is the HARD prerequisite - the rule can COUNT but cannot CLASSIFY (Tested / Partially / Not-covered) on placeholder text.
- **AC traceability table (Phase 2)**: `checklist.md.tmpl` replaces the single "All acceptance criteria met" checkbox with `AC-id | classification (Tested / Partially / Manual / Not-covered) | evidence (test @ file:line)`, reusing the existing classification columns.
- **`AC_COVERAGE` rule (Phase 3)**: a new rule script (`ac-coverage.*`) that counts ACs at the canonical per-level location, parses evidence via `EVIDENCE_CITED`, and warns unless `covered / total >= floor(total * SPECKIT_AC_COVERAGE_FLOOR)` (default 0.9). "Manual — automation infeasible" with a rationale counts as covered. Registered in `validator-registry.json` (warn, strict-only candidate); documented in `validation_rules.md`.
- **deep-review verdict binding (Phase 4)**: `deep-review/SKILL.md` and both `deep_start-review-loop_{auto,confirm}.yaml` reflect the coverage signal in the verdict, gated by per-level AND lifecycle opt-in; `CLAUDE.md` §2 (mirrored to `AGENTS.md`) carries the completion-gate note.
- **Rollout substrate**: the `SPECKIT_SAVE_QUALITY_GATE` pattern (default-on, warn-only window, would-reject logging, persisted activation timestamp) copied for `AC_COVERAGE`; flags `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `..._ENFORCE`, `..._FLOOR`.
- **AC-stub auto-generation (net-new opportunity)**: emit one traceability-table stub row per acceptance criterion from the `Requirement | Acceptance Criteria` table so authors fill evidence rather than authoring rows from blank (integration-plan §6 #3).

### Data Flow

At validation time, `validate.sh --strict` (under `SPECKIT_AC_COVERAGE`) runs `AC_COVERAGE`: it reads the canonical per-level AC location (story-ACs only at L3 to avoid double-counting the requirement table), counts total ACs, parses evidence citations via `EVIDENCE_CITED`, counts "Manual — automation infeasible" rows with a rationale as covered, and applies the floor. Below-floor coverage yields a WARN (warn-mode) or ERROR (`..._ENFORCE=true`, deferred to Phase 5) with one aggregated `How to Fix` message and a concrete next action. The startup/advisor brief can read the same count to show `AC coverage: n/m` (fail-open). At review time, deep-review reflects the coverage signal in its verdict only for L2+ folders where `checklist.md` exists AND `implementation-summary.md` is in-progress+; L1 and fresh scaffolds are exempt. The 010 fixtures exercise the AC under-covered case before any ERROR promotion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet touches the shared manifest templates (also owned by pending `001/002-self-check-templates`), the validation rule registry and docs, a new rule script, the deep-review verdict path with its two YAMLs, and the completion-gate note in `CLAUDE.md`/`AGENTS.md`. The full impact matrix is in `research/006-peck-source-deep-mining/integration-plan.md` §2.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Spec template; placeholder AC text + L3 requirement tables | Modify (shared with pending 002) | L1/L2 cells are `precondition + action -> outcome`; L3 tables tightened; no "[How to verify it's done]" remains |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Checklist template; single "All acceptance criteria met" checkbox | Modify (shared with pending 002) | AC traceability table present; bare checkbox absent |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Rule registry | Modify | `AC_COVERAGE` resolves with severity warn (strict-only) and its flags |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Rule docs | Modify | `AC_COVERAGE` floor, escape hatch, and flags documented |
| `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` | Does not exist yet | Create | Counts ACs at the canonical location, parses evidence, applies floor + escape hatch |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Flag reference | Modify | `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `..._ENFORCE`, `..._FLOOR` rows |
| `.opencode/skills/deep-review/SKILL.md` | Deep-review verdict path | Modify | Coverage signal reflected with per-level AND lifecycle opt-in |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Deep-review workflow (auto) verdict gate | Modify | Coverage signal surfaced in the verdict gate |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Deep-review workflow (confirm) verdict gate | Modify | Coverage signal surfaced in the verdict gate |
| `CLAUDE.md` | Framework completion gate (§2) | Modify | Warn-first coverage note added; mirrored to `AGENTS.md` |
| `AGENTS.md` | Framework guardrails mirror | Modify (mirror) | Matches the `CLAUDE.md` §2 coverage note |

Required inventories:
- Shared-template coordination: confirm pending `001/002-self-check-templates` has landed (or hold a single coordinated edit window) before editing `spec.md.tmpl` / `checklist.md.tmpl`; do not edit those templates concurrently (research 006 §7 MUST-FIX).
- Canonical-location inventory: confirm the rule counts exactly one AC location per level (story-ACs only at L3) so the requirement table is not double-counted.
- Reuse inventory: confirm the traceability table reuses existing classification columns and `EVIDENCE_CITED`, and that verdict binding reuses the deep-review primitive; no parallel infrastructure introduced.
- Runtime-mirror rule: every `CLAUDE.md` §2 change needs the matching `AGENTS.md` mirror update (or a recorded mirror-lag decision).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: AC-format normalization (HARD prerequisite)

- [x] Confirm the pending shared-template edit window is not needed for this source-pass. [EVIDENCE: no shared templates modified]
- [x] Defer L1/L2 acceptance-criteria placeholder rewrite out of current approved scope. [EVIDENCE: template untouched]
- [x] Defer L3 requirement-table tightening out of current approved scope. [EVIDENCE: template untouched]
- [x] Defer template render confirmation out of current approved scope. [EVIDENCE: no template changes claimed]

### Phase 2: AC traceability table

- [x] Defer traceability table template rewrite out of current approved scope. [EVIDENCE: checklist template untouched]
- [x] Defer AC-stub auto-generation out of current approved scope. [EVIDENCE: no generator modified]
- [x] Defer checklist template render confirmation out of current approved scope. [EVIDENCE: no template changes claimed]

### Phase 3: `AC_COVERAGE` validation rule (WARNING)

- [x] Author the `ac-coverage.*` rule script. [EVIDENCE: `bash -n` exit 0]
- [x] Emit one aggregated advisory message. [EVIDENCE: script has one aggregate `AC_COVERAGE WARNING` output]
- [x] Register `AC_COVERAGE` in `validator-registry.json` with INFO severity and flags. [EVIDENCE: JSON parse ok]
- [x] Document the rule, floor, escape hatch, and flags in `validation_rules.md`. [EVIDENCE: validation reference updated]
- [x] Add the `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `..._ENFORCE`, `..._FLOOR` rows to `ENV_REFERENCE.md`. [EVIDENCE: ENV reference updated]
- [x] Handle the edge cases. [EVIDENCE: zero AC, floor clamp, and malformed citation branches present]

### Phase 4: deep-review verdict binding + per-level AND lifecycle opt-in

- [x] Add the coverage-signal reflection to `deep-review/SKILL.md` with lifecycle opt-in. [EVIDENCE: Acceptance-Coverage Signal section added]
- [x] Surface the coverage signal in the verdict gate of `deep_start-review-loop_auto.yaml`. [EVIDENCE: YAML parse ok]
- [x] Surface the coverage signal in the verdict gate of `deep_start-review-loop_confirm.yaml`. [EVIDENCE: YAML parse ok]
- [x] Add the coverage note to `AGENTS.md`; `CLAUDE.md` deferred out of approved scope. [EVIDENCE: AGENTS pointer added]
- [x] Verify existing valid folder still passes strict validation without an `AC_COVERAGE` ERROR. [EVIDENCE: strict validation exit 0]

### Phase 5: ERROR promotion (DEFERRED until evidence)

- [x] Hold ERROR promotion until evidence and fixtures are green. [EVIDENCE: no ERROR behavior shipped]
- [x] Document promotion as deferred; do not flip `SPECKIT_AC_COVERAGE_ENFORCE=true`. [EVIDENCE: enforcement flag remains false]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1: AC-format normalization | Pending `001/002-self-check-templates` window | Phase 1 edits `spec.md.tmpl`, shared with pending 002; land 002 first or coordinate the edit window. |
| Phase 2: AC traceability table | Phase 1 | The table classifies ACs, which is only meaningful once ACs are assertion-shaped; also shares `checklist.md.tmpl` with pending 002. |
| Phase 3: `AC_COVERAGE` rule | Phase 1, Phase 2 | The rule can count but cannot classify without normalized ACs (Phase 1); it parses evidence from the traceability table (Phase 2). |
| Phase 4: deep-review verdict binding | Phase 3 | Verdict binding reflects the rule's coverage signal, which must exist first. |
| Phase 5: ERROR promotion | Phase 3, Phase 4, Packet 010 fixtures | Promotion requires warn-volume evidence and green regression fixtures. |

The HARD ordering is Phase 1 before Phase 3: AC-format normalization is a prerequisite, not an optional nicety, because classification (Tested / Partially / Not-covered) is impossible on placeholder AC text (research 006 §5, MiniMax M3). Phases 1-2 must not edit the shared manifest templates in parallel with pending 002.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template render review | `spec.md.tmpl` L1/L2/L3 AC shape; `checklist.md.tmpl` traceability table | Manual render + read |
| Placeholder check | No "[How to verify it's done]" remains in rendered `spec.md.tmpl` | `rg` over the rendered template |
| Rule unit behavior | `AC_COVERAGE` counting, floor comparison, escape hatch, edge cases | Rule script test harness + fixtures |
| Registry/doc check | `AC_COVERAGE` resolves in `validator-registry.json`; documented in `validation_rules.md` | Registry query + read |
| Lifecycle opt-in check | Fresh L2 scaffold does not ERROR; L1 exempt; in-progress L2+ gated | Strict validate on representative folders |
| Documentation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required matrix:

| Axis | Values |
|------|--------|
| Level | L1 (exempt), L2, L3 (story-ACs only) |
| Lifecycle | fresh scaffold (no in-progress impl-summary), in-progress+, complete |
| Coverage vs floor | below floor, exactly at floor, above floor |
| Escape hatch | "Manual — automation infeasible" with rationale (covered), without rationale (not covered) |
| Evidence citation | well-formed `file:line`, malformed (treated not-covered), absent |
| Enforce flag | `SPECKIT_AC_COVERAGE_ENFORCE=false` (warn), `true` (deferred to Phase 5) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Area | Docs/Code LOC | Notes |
|------|---------------|-------|
| `spec.md.tmpl` AC-format normalization | 40-80 | L1/L2 assertion rewrites + L3 requirement-table tightening |
| `checklist.md.tmpl` AC traceability table | 30-60 | Table replaces the single checkbox; stub-generation note |
| `ac-coverage.*` rule script | 120-200 | Counting, floor, escape hatch, edge cases, aggregated message |
| `validator-registry.json` + `validation_rules.md` + `ENV_REFERENCE.md` | 40-80 | Registration, rule docs, four flag rows |
| `deep-review/SKILL.md` + two YAMLs | 40-80 | Verdict binding + lifecycle opt-in on three surfaces |
| `CLAUDE.md` §2 + `AGENTS.md` mirror | 10-20 | Warn-first coverage note + mirror |
| **Total** | **~400-600** | Matches the spec.md LOC budget (template edits, new rule, registry + docs, deep-review/CLAUDE.md wiring). |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet `010-reviewer-prompt-benchmark-substrate` | Upstream | Scaffolded, not implemented | Supplies the AC under-covered regression fixture; no ERROR promotion without green fixtures |
| Pending `001/002-self-check-templates` | Coordination | Pending | Owns the same `spec.md.tmpl` / `checklist.md.tmpl`; land 002 first or coordinate the edit window |
| Existing AC classification columns | Internal | Available | The traceability table reuses them rather than rebuilding |
| Existing `EVIDENCE_CITED` infrastructure | Internal | Available | Evidence parsing reuses it |
| Existing deep-review fresh-context reviewer | Internal | Available | Verdict binding reuses it |
| `SPECKIT_SAVE_QUALITY_GATE` rollout precedent | Internal | Available | Copied verbatim for the warn-first `AC_COVERAGE` rollout |

No external dependencies. No network access required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `AC_COVERAGE` ERRORs a fresh scaffold or an L1 folder, the rule double-counts at L3, or a coverage WARN fires on a folder whose ACs are still placeholder text (normalization not landed first).
- **Procedure**: Set `SPECKIT_AC_COVERAGE_ENFORCE=false` to revert to warn-only; if needed, set `SPECKIT_AC_COVERAGE=false` to disable the rule entirely. Revert the template edits if normalization broke rendering. The rule and template edits are additive behind flags, so disabling returns the system to the single self-attested checkbox behavior.
- **Blast radius**: Validation output and the two shared manifest templates only; no runtime, schema, or persistence state is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Failure Mode | Detection | Rollback |
|--------------|-----------|----------|
| `AC_COVERAGE` ERRORs an in-flight or fresh folder | Strict validate ERRORs on coverage while `..._ENFORCE` is meant to be false | Flip `SPECKIT_AC_COVERAGE_ENFORCE=false`; confirm warn-only behavior restored. |
| Rule double-counts at L3 | A spec with both a requirement table and story ACs reports inflated total | Restore the canonical-location logic (story-ACs only); add a regression fixture. |
| WARN fires on placeholder AC text | Coverage WARN appears on a folder whose ACs were never normalized | Confirm Phase 1 normalization landed for the template that produced the folder; the rule must depend on assertion-shaped ACs. |
| Shared-template merge conflict with pending 002 | Conflict or drift in `spec.md.tmpl` / `checklist.md.tmpl` | Revert this packet's template edits; re-apply inside a coordinated single edit window after 002 lands. |
| Warn volume too high to promote | Would-reject logging shows excessive warns | Keep ERROR promotion deferred (Phase 5); investigate floor or normalization coverage before any flip. |

Rollback must preserve any would-reject warn-volume evidence captured during the warn-only window, even if `AC_COVERAGE` is disabled during investigation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
   ┌─────────────────────────────┐        ┌──────────────────────────────┐
   │ pending 001/002-self-check  │        │ 010 reviewer-benchmark       │
   │ templates (shared tmpls)    │        │ AC under-covered fixture     │
   └──────────────┬──────────────┘        └──────────────┬───────────────┘
                  │ land first / coordinate window        │ gates ERROR promotion only
                  ▼                                       │
   Phase 1: AC-format normalization (HARD prerequisite)   │
                  │ assertion-shaped ACs                  │
                  ▼                                       │
   Phase 2: AC traceability table (checklist.md.tmpl)     │
                  │ evidence has a home                   │
                  ▼                                       │
   Phase 3: AC_COVERAGE rule (count + floor + escape)     │
                  │ coverage signal                       │
                  ▼                                       │
   Phase 4: deep-review verdict binding + lifecycle opt-in│
                  │                                       │
                  ▼                                       ▼
   Phase 5: ERROR promotion ◀──────────────── warn-volume evidence + green fixtures
```

Edges: Phase 1 is gated by the pending-002 shared-template window (ADR-004). Phases 1 -> 2 -> 3 are a strict chain because the rule can count but cannot classify without normalized ACs and a table to hold evidence. Phase 4 depends on the Phase 3 coverage signal. Phase 5 (ERROR promotion) depends on warn-volume evidence and the green 010 fixture; the 010 edge gates ERROR promotion, not the warn-first landing.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is **pending-002 window (external) -> Phase 1 -> Phase 2 -> Phase 3 -> Phase 4**.

- Phase 1 (AC-format normalization) is the gating prerequisite and the only phase that depends on an external coordination window; it cannot be parallelized with the rule because classification is impossible on placeholder ACs.
- Phase 3 (the `AC_COVERAGE` rule script) is the longest single work item: counting at the canonical per-level location, the floor comparison, the escape hatch, the edge cases, and the aggregated message.
- The 010 fixture gates only ERROR promotion (Phase 5), so the critical path to a warn-first landing does NOT block on 010; the critical path to ERROR promotion does.
- Slip risk concentrates on the pending-002 window and on Phase 3; both are mitigated by shipping warn-first and holding ERROR promotion until the window closes and fixtures are green.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition | Gate |
|-----------|------------|------|
| M1 - Setup complete | Surfaces read; `SPECKIT_SAVE_QUALITY_GATE` flag shape captured; pending-002 window confirmed closed or coordinated | Phase 1 setup done |
| M2 - ACs normalized | `spec.md.tmpl` L1/L2 ACs are `precondition + action -> outcome`; L3 requirement tables tightened; no "[How to verify it's done]" remains | Phase 1 done |
| M3 - Traceability table landed | `checklist.md.tmpl` carries the `AC-id | classification | evidence` table; AC-stub generation emits one row per criterion | Phase 2 done |
| M4 - Rule in WARN | `AC_COVERAGE` counts at the canonical location, applies floor 0.9, honors the escape hatch; registered and documented; `..._ENFORCE=false` | Phase 3 done; warn-only |
| M5 - Verdict bound | deep-review reflects coverage for in-flight L2+ folders; fresh scaffolds and L1 exempt; `CLAUDE.md`/`AGENTS.md` note added | Phase 4 done |
| M6 - ERROR promotion | `AC_COVERAGE` promoted to ERROR after the warn window AND green 010 fixtures (`..._ENFORCE=true`) | Post-warn-window; reversible by flag |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Architectural decisions for this packet are recorded in full in `decision-record.md` (ADR-001 through ADR-004). The defining decisions are: AC-format normalization is a hard prerequisite because the rule can count but not classify on placeholder text (ADR-001); the canonical per-level AC location is story-ACs only at L3 to avoid double-counting (ADR-002); enforcement uses a per-level AND lifecycle opt-in so fresh scaffolds are never blocked (ADR-003); and the shared manifest templates must be edited after pending 002 lands or inside a coordinated single edit window (ADR-004).
</content>
</invoke>
