---
title: "Implementation Plan: sk-design OVERVIEW Conformance [template:level_2/plan.md]"
description: "Content-preserving restructure of 22 sk-design reference and asset files into the sk-doc Section-1 OVERVIEW structure, executed in 4 batches via cli-codex gpt-5.5 xhigh fast with orchestrator verification per batch."
trigger_phrases:
  - "sk-design overview plan"
  - "overview conformance plan"
  - "batch restructure"
  - "gate re-verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/041-sk-design-overview-conformance"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete; 4 batches delivered, 22/22 conformant, gates green"
    next_safe_action: "Regenerate generated metadata; commit the 22-file conformance batch"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-design OVERVIEW Conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-design references + assets) |
| **Framework** | sk-doc templates — `skill_reference_template.md`, `skill_asset_template.md` |
| **Storage** | None (filesystem docs under `.opencode/skills/sk-design/`) |
| **Testing** | naming_doc_check.py, proof_check.py, design-command-surface-check.mjs, skill-benchmark hubRoute |

### Overview
Restructure 22 sk-design files so each opens with a 1-2 sentence header-free intro and a `## 1. OVERVIEW` section matching its sk-doc template type, with all existing sections renumbered contiguously. Work runs in 4 batches; each batch is implemented by cli-codex gpt-5.5 xhigh fast and then orchestrator-verified for section outline, frontmatter-unchanged, and (for the 3 gate-consumed files) gate re-verification. The restructure is content-preserving — only the additive intro/OVERVIEW and heading numbers change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (22 files enumerated in spec.md)
- [x] Success criteria measurable (22/22 conformant + 3 gate re-verifications + 2 standing invariants)
- [x] Dependencies identified (cli-codex executor; the 3 gate scripts)

### Definition of Done
- [x] All 22 files carry the type-correct `## 1. OVERVIEW` with contiguous renumbering — 22/22 grep-confirmed
- [x] naming_doc_check.py exit 0; audit gate + proof_check green; interface pre-flight gate + matrix + VERDICT intact — proof_check triad {ok:True}; VERDICT last at ## 13, matrix at ## 12
- [x] design-command-surface-check STATUS=PASS drift=0; skill-benchmark hubRoute 34/29/5/0 — standing invariants hold; evergreen 0 leaks
- [x] Docs updated (spec/plan/tasks/checklist synchronized) — implementation-summary.md added; all four docs marked complete
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-conformance restructure — apply a fixed sk-doc OVERVIEW shape per file type, preserving body content.

### Key Components
- **Reference OVERVIEW shape**: 1-2 sentence intro + `## 1. OVERVIEW` with Purpose / When to Use / Core Principle (per `skill_reference_template.md`).
- **Asset OVERVIEW shape**: 1-2 sentence intro + `## 1. OVERVIEW` with Purpose / Usage (per `skill_asset_template.md`).
- **Renumber pass**: shift every existing H2 down by one, in original order, starting at `## 2.`.
- **Gate guard**: for the 3 critical files, preserve gate-parsed content (heading text, a11y matrix, findings schema, R4 matrix, VERDICT) and re-verify.

### Data Flow
Source file → identify intro candidate + existing H2 outline → inject intro + `## 1. OVERVIEW` → renumber remaining H2s → orchestrator outline/frontmatter diff → (critical files) gate re-run → next file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The restructure touches three files whose content is parsed by shipped gates. Treat them as consumer-facing surfaces and verify each consumer after the edit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| design-foundations/assets/token_starter.md | Heading TEXT consumed by `naming_doc_check.py` via number-stripped aliases (COLOR RAMP / TYPE SCALE / SPACING SCALE / HAND OFF) | Renumber only; preserve heading text | `python3 design-foundations/scripts/naming_doc_check.py` → exit 0 |
| design-audit/references/audit_contract.md | Parsed by the audit gate + `proof_check.py` observation-triad + 7-layer a11y matrix (text/finding-heading parse) | Renumber headings; preserve matrix + findings schema | Re-run audit gate; `python3 shared/scripts/proof_check.py` triad green |
| design-interface/assets/interface_preflight_card.md | Interface Pre-Flight HARD gate (walked) + R4 interaction-state matrix (## 11) + VERDICT (## 12) | Preserve all 12 sections; shift numbers only | Walk the pre-flight gate; confirm R4 matrix + VERDICT present after shift |
| naming_doc_check.py | Gate consumer of token_starter.md headings | unchanged (not a consumer of other 21 files) | exit 0 post-edit |
| design-command-surface-check.mjs | Standing drift gate over the design command surface | unchanged | STATUS=PASS drift=0 post-restructure |
| skill-benchmark hubRoute | Standing routing invariant (34/29/5/0) | unchanged | hubRoute counts unchanged post-restructure |

Required inventories:
- Section-outline diff per file: confirm `## 1. OVERVIEW` added and remaining headings shifted by exactly one with no gaps/dupes.
- Gate-text invariant: for token_starter.md the alias heading text is unchanged; for audit_contract.md the a11y matrix + findings schema rows are unchanged; for interface_preflight_card.md all 12 sections survive.
- Frontmatter invariant: frontmatter block byte-identical pre/post on all 22 files.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Work is decomposed into 4 implementation batches. Each batch: implement via cli-codex gpt-5.5 xhigh fast, then orchestrator-verify (section outline + frontmatter-unchanged + gate re-verification for any critical file in the batch).

### Phase 1: Setup
- [x] Capture baseline: run naming_doc_check.py, audit gate + proof_check, design-command-surface-check, skill-benchmark hubRoute; record green/counts — baseline captured before edits
- [x] Confirm the reference and asset OVERVIEW shapes from the sk-doc templates — reference triad + asset pair confirmed

### Phase 2: Core Implementation (4 batches)
- [x] **Batch 1 — 8 audit reference files** (no critical files): accessibility_performance, ai_fingerprint_tells, anti_patterns_production, corpus_map, critique_hardening, evidence_capture, hardening_edge_cases, transform_remediation → reference OVERVIEW (Purpose/When to Use/Core Principle) — 8/8 conformant
- [x] **Batch 2 — 5 mixed reference files (incl. audit_contract)**: audit_contract (CRITICAL), worked_examples, redesign_intake, advanced_craft, design_dispatch_boundary → reference OVERVIEW; re-verify audit gate + proof_check on audit_contract — 5/5 conformant; proof_check triad {ok:True}
- [x] **Batch 3 — 7 assets (no critical files)**: register_card, animate_presence_checklist, motion_pattern_cards, motion_performance_failure_card, a11y_quick_fixes, anti_patterns_score_rubric, audit_evidence_worksheet → asset OVERVIEW (Purpose/Usage) — 7/7 conformant
- [x] **Batch 4 — 2 critical assets**: token_starter (CRITICAL — naming_doc_check.py), interface_preflight_card (CRITICAL — pre-flight gate + matrix + VERDICT) → asset OVERVIEW; re-verify both gates — 2/2 conformant; naming_doc_check exit 0; VERDICT last at ## 13

### Phase 3: Verification
- [x] Per-batch orchestrator verification complete (outline + frontmatter-unchanged) — 22/22 outlines + frontmatter byte-unchanged
- [x] 3 gate re-verifications green (naming_doc_check.py, audit/proof_check, interface pre-flight) — exit 0; triad {ok:True}; preflight gate intact
- [x] Standing invariants re-checked: design-command-surface-check STATUS=PASS drift=0; skill-benchmark hubRoute 34/29/5/0 — both hold; evergreen 0 leaks
- [x] spec/plan/tasks/checklist synchronized — implementation-summary.md added; all four docs complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | `## 1. OVERVIEW` present + contiguous renumber per file | grep / section-outline diff |
| Integrity | Frontmatter byte-unchanged; body content preserved | git diff |
| Gate (critical) | token_starter.md heading aliases | `python3 design-foundations/scripts/naming_doc_check.py` (exit 0) |
| Gate (critical) | audit_contract.md triad + a11y matrix | audit gate + `python3 shared/scripts/proof_check.py` |
| Gate (critical) | interface_preflight_card.md gate + R4 + VERDICT | walked pre-flight gate review |
| Standing | command surface + routing invariants | `design-command-surface-check.mjs` (drift=0); skill-benchmark hubRoute (34/29/5/0) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex gpt-5.5 xhigh fast | External (executor) | Green | Orchestrator implements batches directly as fallback |
| design-foundations/scripts/naming_doc_check.py | Internal (gate) | Green | Cannot verify token_starter.md conformance |
| shared/scripts/proof_check.py + audit gate | Internal (gate) | Green | Cannot verify audit_contract.md conformance |
| shared/scripts/design-command-surface-check.mjs | Internal (gate) | Green | Cannot confirm drift=0 standing invariant |
| sk-doc reference/asset templates | Internal (spec) | Green | OVERVIEW shape undefined without templates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate regresses (naming_doc_check.py non-zero, audit gate/proof_check fail, interface pre-flight breaks, drift!=0, or hubRoute counts shift) on a restructured file.
- **Procedure**: `git checkout -- <file>` for the offending file (or `git restore` the batch), re-inspect the section outline against the gate's parse expectations, re-apply with the gate-text invariant preserved.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline gates) ──► Batch 1 (8 audit refs) ──► Batch 2 (5 mixed refs, audit_contract) ──┐
                                                                                                 ├──► Verify (3 gates + standing invariants)
                           Batch 3 (7 assets) ──────► Batch 4 (2 critical assets) ──────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All batches |
| Batch 1 | Setup | Verify |
| Batch 2 | Setup | Verify (audit gate + proof_check) |
| Batch 3 | Setup | Batch 4 ordering convenience, Verify |
| Batch 4 | Setup | Verify (naming_doc_check.py, interface pre-flight) |
| Verify | All batches | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (baseline) | Low | ~0.5 hour |
| Batch 1 (8 audit refs) | Medium | ~1.5-2 hours |
| Batch 2 (5 mixed refs incl. audit_contract) | Medium | ~1.5 hours |
| Batch 3 (7 assets) | Medium | ~1.5 hours |
| Batch 4 (2 critical assets) | High | ~1 hour (gate re-verify heavy) |
| Verification | Low | ~0.5 hour |
| **Total** | | **~6.5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline gate results captured before any edit (naming_doc_check.py, audit/proof_check, design-command-surface-check, hubRoute)
- [x] Clean git working tree per batch so reverts are surgical
- [x] Critical-file gate-text invariants recorded (alias headings, a11y matrix, findings schema, 12 sections)

### Rollback Procedure
1. Identify the file/batch that regressed a gate via the post-batch verification output
2. `git restore <file>` (or the batch) to the pre-edit state
3. Re-run the failing gate to confirm the baseline is restored
4. Re-apply the restructure preserving the gate-parsed content, then re-verify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — markdown-only; git restore is the complete reversal
<!-- /ANCHOR:enhanced-rollback -->
