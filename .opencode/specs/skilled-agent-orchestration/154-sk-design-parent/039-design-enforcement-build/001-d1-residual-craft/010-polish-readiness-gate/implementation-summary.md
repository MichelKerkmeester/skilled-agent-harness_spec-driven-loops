---
title: "Implementation Summary: Polish Readiness Gate"
description: "A Polish Readiness row in critique_hardening.md plus a stdlib gate turn polish from prose into a checkable verdict: a ready claim now needs a fresh clean unfinished-marker scan, while whether the surface is actually polished stays human review."
trigger_phrases:
  - "polish readiness gate summary"
  - "polish readiness verdict scan implementation"
  - "polish_readiness_check deterministic gate"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/010-polish-readiness-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped Polish Readiness row + polish_readiness_check gate; verified exit 0/1/1/0/0/1/2"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/critique_hardening.md"
      - ".opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic bite as a checker vs prose-only resolved to a new stdlib checker mirroring perf_evidence_check.py"
      - "The report row is defined inside critique_hardening.md, not pre-printed into audit_report_template.md (out of this phase's named scope)"
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
| **Spec Folder** | 010-polish-readiness-gate |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hardening critique narrated polish but never graded it: §6 carried "Polish Checks", a "Visual-Critique Crosswalk", and "Polish As Trust" prose, so a packet could read as polished with no verdict and no scan of unfinished markers. You can now carry polish readiness as a report row with an explicit verdict, and a stdlib gate refuses a `ready` claim unless a fresh unfinished-marker scan ran and came back clean. The "reads polished, never checked" gap closes by a deterministic floor: a `ready` verdict has to be backed by a clean scan, not narration.

This is additive. One new subsection was inserted into the reference and one new checker was created; §§1-7 of `critique_hardening.md` are byte-preserved with no section renumbered, and no sibling doc, asset, or script was touched.

### Polish Readiness row and verdict set

`critique_hardening.md` §6 now ends with a `### Polish Readiness` subsection, after "Polish As Trust" and before §7 Evidence Limits. It defines a report row an auditor emits — `| Polish readiness | <verdict> | scan evidence | judgment evidence |` — and fixes the verdict set to exactly three tokens:

- `ready`: the unfinished-marker scan ran clean and the §6 rendered/state review was walked.
- `blocked`: the scan found unfinished markers, or a named incomplete state remains.
- `not-assessed`: the scan did not run or the surface was unavailable, so readiness is unknown.

The scan evidence cell carries the run command and its marker count; the judgment evidence cell carries the rendered/state review notes or the reason the review could not run. The verdict-mapping rule is stated in plain words: markers present means at most `blocked`; `ready` requires a clean scan; no scan means `not-assessed`, not `ready`.

### The marker-scan-backed `ready` rule

The subsection binds `ready` to a deterministic scan of the resolved surface for `\b(TODO|FIXME|XXX|HACK|WIP)\b`. A `ready` verdict is only honest when that scan ran and found nothing. The subsection states this as a necessary floor, not proof of polish: a clean scan plus `ready` says only that the surface carries no visible unfinished markers and the review was performed. Hierarchy, perceived quality, design-system alignment, and state craft still need rendered evidence and human judgment under §7.

### Deterministic gate

`design-audit/scripts/polish_readiness_check.py` is a stdlib-only checker mirroring the `perf_evidence_check.py` convention (arg parser, optional `--json`, exit 0/1/2). It runs the unfinished-marker scan itself over `--scan <surface>` (file or directory walk) rather than trusting a self-reported count, locates the polish-readiness row in the passed report, extracts and lowercases the verdict token, and grades it. The full exit matrix:

| Case | Exit |
|------|------|
| `ready` + clean scan (satisfied) | 0 |
| `ready` + a marker in the scanned surface | 1 (`ready claimed with N unfinished markers present`) |
| `ready` + report-only / no `--scan` | 1 (`ready claimed without a scan`) |
| `blocked` | 0 |
| `not-assessed` | 0 |
| missing row / verdict outside the three | 1 (`polish readiness row missing or verdict not in {ready, blocked, not-assessed}`) |
| usage: no argument / unreadable report / missing scan path | 2 |

The load-bearing bite is that a `ready` verdict cannot be blessed report-only: a missing scan and a lingering marker both fail loudly.

### Enforcement boundary, stated honestly

The split is written into both artifacts. The checker is deterministic about facts: the unfinished-marker scan is ripgrep-equivalent (same surface, same hits, every run) and the rule "a `ready` verdict cannot stand while markers remain or without a scan" is mechanically checkable. It stays advisory about judgment: a zero-marker clean scan plus `ready` is necessary, not sufficient — it never certifies that the surface is actually polished. The subsection says so in plain words, echoing §7 and impeccable `polish.md` ("a clean detector result is not proof of a strong design").

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-audit/references/critique_hardening.md` | Modified | Inserted a `### Polish Readiness` subsection at the end of §6: the report row, the three-token verdict set, the unfinished-marker scan, the verdict-mapping rule, and the necessary-not-sufficient boundary. Additive — §§1-7 byte-preserved, no renumber |
| `.opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py` | Created | Stdlib gate that runs the marker scan and fails a `ready` verdict claimed with markers present or without a scan |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) inserted the subsection additively at the end of §6 and authored the checker against the `perf_evidence_check.py` pattern. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking against the real `| Polish readiness |` row format and an actual `--scan` surface, and this summary re-ran the same matrix on scratch fixtures: `ready` over a clean scanned surface exits 0; `ready` with a `TODO` introduced into the scanned surface exits 1 (the gate bites); `ready` report-only with no scan exits 1 (a `ready` verdict cannot be blessed without a fresh scan); `blocked` exits 0; `not-assessed` exits 0; a verdict token outside the three and a missing row each exit 1; and a no-argument call plus an unreadable report each exit 2. `py_compile` is clean. The reference edit was confirmed additive (§§1-7 byte-preserved, 0 removed, no renumber), and the change set was grepped for spec or packet identifiers to keep both files evergreen. `validate.sh <folder> --strict` reports the spec-doc rules clean with only the expected generated-metadata fingerprint residual left for orchestrator regeneration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Express the requirement as a subsection inside §6, not a new top-level section | Placing it beside the existing polish prose and the Visual-Critique Crosswalk keeps the rule adjacent to the checks it governs and renumbers nothing |
| Make it bite with a new stdlib checker, not prose alone | The spec acceptance is deterministic; without a checker the rule would be advisory-only, so the gate is the in-scope mechanism, matching the sibling audit-performance-evidence pattern (doc block + new stdlib gate) |
| Have the checker run the scan itself, not trust a self-reported count | A `ready` verdict is only honest against a fresh scan; reading the report's own marker count would let a stale or faked number pass |
| Fail `ready` both with markers AND without a scan | A `ready` claim with no evidence is as dishonest as one contradicted by markers; both are loud, blocking failures |
| Define the report row in `critique_hardening.md`, not in `audit_report_template.md` | The spec names only the reference; the file already defines the Visual-Critique Crosswalk probes that feed the report without owning the template, so pre-printing the row is left to a separate phase |
| Mirror `perf_evidence_check.py` (stdlib, exit 0/1/2, `--json`) | Reuses the established sibling-script convention with no new dependency to unwind |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ready` + clean scanned surface | PASS, exit 0 |
| `ready` + a `TODO` introduced into the scanned surface | FAIL, exit 1, "ready claimed with N unfinished markers present" (gate bites) |
| `ready` report-only / no `--scan` | FAIL, exit 1, "ready claimed without a scan" |
| `blocked` verdict | PASS, exit 0 (honest blocked allowed) |
| `not-assessed` verdict | PASS, exit 0 (honest un-assessment allowed) |
| Missing row / verdict outside {ready, blocked, not-assessed} | FAIL, exit 1, "polish readiness row missing or verdict not in {ready, blocked, not-assessed}" |
| Usage: no argument / unreadable report | Usage error, exit 2 (no false pass) |
| `python3 -m py_compile polish_readiness_check.py` | PASS, compile OK |
| Additive lint: reference diff | Pure insertion; §§1-7 byte-preserved (7 numbered H2 sections), no renumber, 0 removed |
| Evergreen + scope audit | Both files carry skill-relative paths only, no spec or packet IDs; change set is the one edited reference + the one new checker; `audit_report_template.md` / `perf_evidence_check.py` / `audit_contract.md` untouched |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Necessary, not sufficient.** The gate proves a `ready` verdict is backed by a fresh clean unfinished-marker scan. It does not certify the surface is actually polished — design-system alignment, perceived quality, and state craft stay human and rendered review. Both artifacts say so, echoing §7.
2. **Grades a filled report, not the blank skeleton.** The checker reads a completed report's polish-readiness row against a re-run scan. Pointed at a report with an unfilled or placeholder verdict, it surfaces the missing/invalid verdict as exit 1, which is the intended guard against half-filled reports.
3. **A `ready` claim must always carry a scan.** Report-only invocation (no `--scan`) fails any `ready` verdict by design; the honest fallbacks when no scan can run are `blocked` or `not-assessed`, not `ready`.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
