---
title: "Implementation Summary: Audit Performance Evidence"
description: "A Performance Evidence block in the audit report and a stdlib gate make a Performance score above 2 carry a measured number or an explicit not-assessed label, enforced by presence."
trigger_phrases:
  - "audit performance evidence summary"
  - "perf evidence gate implementation"
  - "perf_evidence_check deterministic gate"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/005-audit-performance-evidence"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped Performance Evidence block and perf_evidence_check gate; verified exit 0/1/2 matrix"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic bite as a checker vs prose-only resolved to a new stdlib checker mirroring proof_check.py"
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
| **Spec Folder** | 005-audit-performance-evidence |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The audit report scored Performance from 0 to 4 in its five-dimension table but gave the Performance row nowhere to put a number, so a reviewer could claim a strong optimize score on prose alone. You can now fill a Performance Evidence block right under the Section 5 score table, and a stdlib gate fails the moment a Performance score above 2 carries neither a measured number nor an honest not-assessed label. The "strong-Performance-claim with no evidence" gap is closed by presence: the claim must show a number or admit it was not measured.

This is additive. One new subsection was inserted into the template and one new checker was created; no existing audit section was removed or renumbered, and no sibling doc, asset, or script was touched.

### Performance Evidence block

`audit_report_template.md` now carries a `### Performance Evidence` subsection immediately after the Section 5 score table and its rating-band line, before Section 6 Owner Mapping. It is a fill-in table with the four fields the spec names plus a Metric row and an Evidence-type row: Metric, Baseline, Post-change, Evidence type, Static-risk label, and Measurement needed. The block states the rule in plain words: a Performance score above 2 must carry a numeric metric in Baseline or Post-change, or the explicit `not-assessed` label. It binds to the live evidence model by pointing at `../references/accessibility_performance.md` §5 and `../references/evidence_capture.md` §6, and it carries a footer run-hint so a filler knows the gate exists.

### Deterministic gate

`design-audit/scripts/perf_evidence_check.py` is a stdlib-only checker mirroring the `proof_check.py` convention (arg parser, optional `--json`, exit 0/1/2). It locates the Section 5 score table, reads the Performance row's `Score (0-4)` cell, and classifies it: a clean value above 2 needs evidence; a value of 2 or below passes; a `not-assessed` score passes; a placeholder or blank score fails (`performance score not filled`). When evidence is required, it accepts either a number-with-unit token (or a Core Web Vital with a number) in Baseline or Post-change, or a `not-assessed` label anywhere in the block. Neither present yields a non-zero exit naming `Perf score > 2 without numeric metric or not-assessed label`.

### Enforcement boundary, stated honestly

The split is written into both artifacts. The checker is deterministic about presence: a number-with-unit or the not-assessed label is there, or it is not, and the answer is the same every run. It stays advisory about truth: whether that number came from a real measurement run, the right tool, or a fair baseline is a judgment call the checker cannot and does not assert. That is exactly the spec acceptance, "Whether the metric is real stays advisory."

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` | Modified | Inserted a Performance Evidence subsection inside Section 5; no existing section removed or renumbered |
| `.opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py` | Created | Stdlib gate that fails when a Performance score above 2 carries neither a numeric metric nor a not-assessed label |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh) inserted the block additively after the Section 5 score table and authored the checker against the `proof_check.py` pattern. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking on purpose-built samples, and this summary re-ran the same matrix on scratch fixtures: a report with Performance 4 and a real metric (Baseline 2200ms) exits 0; the same score with an explicit not-assessed label exits 0; the same score with all-placeholder evidence exits 1, so the gate genuinely distinguishes satisfied from violated rather than always failing; a below-threshold Performance 2 exits 0; an unfilled score exits 1; and both a no-argument call and a report with no score table exit 2. `py_compile` is clean. The template edit was confirmed additive (existing sections byte-preserved, no renumber), and the change set was grepped for spec or packet identifiers to keep both files evergreen.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Express the requirement as a block inside Section 5, not a new top-level section | Placing it beside the Performance score keeps the rule adjacent to the number it governs and renumbers nothing |
| Make it bite with a new stdlib checker, not prose alone | The spec acceptance is deterministic; without a checker the rule would be advisory-only, so the gate is the in-scope mechanism, matching the sibling numeric-law-index pattern |
| Accept a number-with-unit OR an explicit not-assessed label | Both are honest outcomes; an un-measured dimension should be labeled, not faked, and the gate rewards the honest label as much as a real number |
| Enforce presence, leave realness advisory | A parser can prove a number is there; it cannot prove the run happened or the baseline was fair, so the template says so in plain words |
| Mirror `proof_check.py` (stdlib, exit 0/1/2, `--json`) | Reuses the established shared-script convention with no new dependency to unwind |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Performance 4 + real metric (Baseline 2200ms) | PASS, exit 0 |
| Performance 4 + explicit not-assessed label | PASS, exit 0 |
| Performance 4 + all-placeholder evidence (no metric, no label) | FAIL, exit 1, "Perf score > 2 without numeric metric or not-assessed label" (gate bites) |
| Below-threshold Performance 2 | PASS, exit 0 (evidence block optional) |
| Unfilled Performance score cell | FAIL, exit 1, "performance score not filled" |
| Usage: no argument / no score table | Usage error, exit 2 (no false pass) |
| `python3 -m py_compile perf_evidence_check.py` | PASS, compile OK |
| Additive lint: template diff | Pure insertion; Sections 1-8 byte-preserved, no renumber |
| Evergreen + scope audit | Both files carry skill-relative paths only, no spec or packet IDs; change set is the one edited template + the one new checker |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Presence, not realness.** The gate proves a number-with-unit or the not-assessed label is present whenever Performance scores above 2. It cannot prove the number came from a real run, the right tool, or a fair baseline; that stays audit judgment, and both artifacts say so.
2. **Grades a filled report, not the blank skeleton.** The checker reads a completed report. Running it against the unfilled template surfaces the placeholder score as unfilled (exit 1), which is the intended guard against half-filled reports.
3. **Metric vocabulary is bounded.** The numeric-metric token recognizes common units (`ms`, `s`, `kb`, `mb`, `gb`, `px`, `fps`, `%`, request counts) and the named Core Web Vitals. An exotic unit with no number would not register as a metric, so the honest fallback is the not-assessed label.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
