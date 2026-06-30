---
title: "Feature Specification: Polish Readiness Gate"
description: "Polish readiness was prose in critique_hardening.md §6, so a packet could read as polished with no verdict and no marker scan. This adds a Polish Readiness report row (ready/blocked/not-assessed) plus a stdlib gate that refuses a ready verdict without a fresh clean unfinished-marker scan, while polish quality stays advisory."
trigger_phrases:
  - "d1-r10 polish readiness"
  - "polish readiness gate design build"
  - "polish readiness verdict scan"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/010-polish-readiness-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record marker-scan-floor vs polish-quality-advisory split"
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
      - "The report row is defined inside critique_hardening.md; pre-printing it into audit_report_template.md is out of this phase's named scope"
---
# Feature Specification: Polish Readiness Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `010-polish-readiness-gate` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`critique_hardening.md` §6 Polish Checks narrated polish: "Polish Checks", a "Visual-Critique Crosswalk" of lenses, and "Polish As Trust" prose. There was no verdict, no fixed vocabulary, and no scan of unfinished markers, so a packet could read as polished while `TODO`/`FIXME` markers still sat in the surface. Impeccable's polish pass is explicitly a readiness gate ("Are there known issues to preserve? Mark with TODOs"; "a clean script result is never proof that the design is strong") — the live critique only narrated that intent.

### Purpose
Turn polish readiness into a structured gate. Carry it as a report row with an explicit verdict drawn from a fixed three-token set, back a `ready` verdict with a deterministic unfinished-marker scan, and ship a stdlib checker that refuses a `ready` claim while markers remain or without a scan. The gate makes a missing verdict and lingering markers loud and blocking. It states honestly that the scan is a necessary floor, not proof of polish: whether the surface is actually well-designed stays advisory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `### Polish Readiness` subsection added at the end of `critique_hardening.md` §6, after "Polish As Trust" and before §7 Evidence Limits.
- The subsection defines a report row (`| Polish readiness | <verdict> | scan evidence | judgment evidence |`), the three-token verdict set `ready` / `blocked` / `not-assessed` with one-line definitions, the deterministic unfinished-marker scan (`\b(TODO|FIXME|XXX|HACK|WIP)\b`), and the verdict-mapping rule, in plain words that name the necessary-not-sufficient boundary.
- A new `design-audit/scripts/polish_readiness_check.py` (stdlib only) that runs the marker scan over `--scan <surface>`, grades the report's polish-readiness verdict, and refuses a `ready` verdict claimed with markers present or without a scan.

### Out of Scope
- Pre-printing the report row into `audit_report_template.md`: the spec target is `critique_hardening.md` alone, which defines the row's shape the way it already defines the Visual-Critique Crosswalk probes; wiring the row into the report template is left to a separate phase.
- Any change to §§1-7 prose, section numbering, the other audit references, assets, or sibling scripts (`perf_evidence_check.py`, `audit_contract.md`).
- Any judgment of whether a clean-scan surface is actually polished; that stays human and rendered review under §7.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-audit/references/critique_hardening.md` | Modify | Insert a `### Polish Readiness` subsection at the end of §6: report row, three-token verdict set, unfinished-marker scan, verdict-mapping rule, necessary-not-sufficient boundary. Additive, §§1-7 byte-preserved, no renumber |
| `sk-design/design-audit/scripts/polish_readiness_check.py` | Create | Stdlib gate that runs the marker scan and fails a `ready` verdict claimed with markers present or without a scan |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `### Polish Readiness` subsection defines the report row and the three-token verdict set | The subsection shows `| Polish readiness | <verdict> | scan evidence | judgment evidence |` and names exactly `ready`, `blocked`, `not-assessed`, each with a one-line definition, inside §6 before §7 |
| REQ-002 | The subsection defines the deterministic unfinished-marker scan and the verdict-mapping rule | The scan is documented for `\b(TODO|FIXME|XXX|HACK|WIP)\b`; the rule states markers ⇒ at most `blocked`, `ready` requires a clean scan, no scan ⇒ `not-assessed` |
| REQ-003 | `polish_readiness_check.py` refuses a `ready` verdict that is contradicted by the scan or unbacked by one | `ready` + a marker in the scanned surface → exit 1; `ready` report-only / no scan → exit 1; `ready` + clean scan → exit 0 |
| REQ-004 | The checker grades the full verdict matrix deterministically | `blocked` → 0, `not-assessed` → 0, missing row / verdict outside the three → 1, usage / unreadable report → 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The necessary-not-sufficient boundary is written into both artifacts | The subsection and the checker docstring state a clean scan plus `ready` is a floor, not proof of polish; design-system alignment, perceived quality, and state craft stay advisory under §7 |
| REQ-006 | Additive, evergreen, and scope-clean | §§1-7 prose byte-preserved with no renumber; no spec/packet/phase IDs or `specs/` paths in the subsection or the checker; the change set is exactly the one reference edit + the one new checker |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `critique_hardening.md` §6 carries a `### Polish Readiness` subsection with the report row, the three-token verdict set, the unfinished-marker scan, and the verdict-mapping rule; §§1-7 are byte-preserved (7 numbered H2 sections, no renumber).
- **SC-002**: `polish_readiness_check.py` grades the full matrix deterministically — `ready`+clean → 0, `ready`+markers → 1, `ready`+no-scan → 1, `blocked` → 0, `not-assessed` → 0, missing/invalid verdict → 1, usage → 2 — verified independently without pipe-masking.
- **SC-003**: Both artifacts state the necessary-not-sufficient boundary; the change set is evergreen and scope-clean (the one reference edit + the one new checker, `audit_report_template.md` untouched).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The marker-scan floor is mechanically enforceable, but whether a clean-scan surface is actually polished is not | Med | State the split in the subsection and the checker docstring: the scan + verdict gate is the deterministic floor; polish quality (design-system alignment, perceived quality, state craft) stays human and rendered review under §7. The gate certifies no taste |
| Risk | A `ready` verdict could be blessed report-only, faking polish without evidence | Med | The checker runs the scan itself over `--scan` and fails `ready` both with markers present and without a scan; a self-reported count never substitutes for a fresh run |
| Risk | Inserting a subsection or rewording §6 could drop or renumber existing prose | Med | Insert additively at the end of §6; verify §§1-7 byte-preserved, 7 numbered H2 sections, no renumber, 0 removed |
| Dependency | `critique_hardening.md` §6 Polish Checks / §7 Evidence Limits (the model the subsection restates) | Internal | The subsection references §6/§7 and restates the live intent rather than inventing one |
| Dependency | `perf_evidence_check.py` / `shared/scripts/proof_check.py` (stdlib checker convention) | Internal | The checker mirrors the established pattern (arg parser, exit 0/1/2, optional `--json`); no new dependency |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The verdict set is a fixed three-token vocabulary and the scan is a single regex, so a new auditor or report inherits the same gate shape without a doc rewrite.

### Reliability
- **NFR-R01**: The unfinished-marker scan is deterministic: scanning the same surface returns the same marker count and locations on every run, and the verdict gate returns the same exit code for the same report + scan.

### Integrity
- **NFR-I01**: The gate asserts no polish quality; the subsection and the checker docstring scope the verdict as a necessary floor so the artifacts carry no false trust signal that a clean-scan `ready` surface is verified well-designed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A `ready` verdict with a clean scan satisfies the floor; whether the surface is truly polished is out of the gate's reach and stays advisory.
- A verdict token outside `{ready, blocked, not-assessed}` is an invalid-verdict failure even when the row is otherwise well-formed.

### Error Scenarios
- A `ready` verdict with one or more markers in the scanned surface fails (`ready claimed with N unfinished markers present`).
- A `ready` verdict run report-only with no `--scan` fails (`ready claimed without a scan`); the honest fallbacks are `blocked` or `not-assessed`.
- A missing polish-readiness row, an unreadable report, or a missing scan path fails deterministically (exit 1 or 2) with no false pass.

### State Transitions
- The three layers stay distinct: the scan proves the marker facts, the verdict records the readiness call, and the judgment-evidence cell carries the rendered/state review; `ready` requires both a clean scan and that review.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One additive subsection in one reference doc plus one new stdlib checker |
| Risk | 6/25 | Additive and reversible (revert the subsection, delete the checker); a checker can misfire on an honest report, mitigated by the matrix tests |
| Research | 6/20 | Re-reading §6/§7, the `perf_evidence_check.py` / `proof_check.py` convention, and impeccable `polish.md` |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the Polish Readiness row eventually be pre-printed into `audit_report_template.md`? Today the row's shape is defined in `critique_hardening.md` (like the Visual-Critique Crosswalk probes) and the checker grades any report carrying it, but the report template does not pre-print the row. Wiring it into the template is the natural follow-up and is recorded here so a later phase can pick it up deliberately rather than as silent scope drift.
- Where does the marker-scan-floor-enforceable vs polish-quality-advisory split land? The floor is mechanically enforceable: the unfinished-marker scan is deterministic and the rule "a `ready` verdict needs a fresh clean scan" is grep-checkable, so a missing verdict and lingering markers are loud and blocking. Whether a clean-scan `ready` surface is actually polished — design-system alignment, perceived quality, and state craft — stays human and rendered review under §7. The gate makes the floor bite; it never certifies taste.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
