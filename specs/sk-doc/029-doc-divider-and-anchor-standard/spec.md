---
title: "Feature Specification: Reconcile the numbered-H2 section-divider and TOC/anchor navigation conventions across the structured .md fleet"
description: "The structured .md fleet has drifted from its own formatting standard on two axes: --- dividers between numbered ALL-CAPS H2 sections (1,015 files missing at least one) and TOC/anchor navigation (mixed). The written standard and the enforced validator disagree. This packet reconciles them onto one rule and closes the enforcement gaps."
trigger_phrases:
  - "section divider standard"
  - "readme toc anchor convention"
  - "numbered h2 divider drift"
  - "doc structure reconciliation"
  - "validate_document divider enforcement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/029-doc-divider-and-anchor-standard"
    last_updated_at: "2026-08-13T06:10:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 spec after fleet-wide investigation; operator ratified bare numbered-H2 as the single truth"
    next_safe_action: "Review plan.md, then confirm before touching validate_document.py or normalizing the fleet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/assets/template-rules.json"
      - ".opencode/skills/sk-doc/shared/references/hvr-rules.md"
      - ".opencode/skills/sk-doc/shared/references/core-standards.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-029-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should constitutional memories (Title-Case H2) adopt --- dividers, or stay exempt?"
      - "Confirm GitHub slug behavior (single vs double dash) before normalizing anchors"
    answered_questions:
      - "Which nav convention wins for READMEs? -> Bare numbered-H2 (no TOC, no nav-anchors)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Reconcile the numbered-H2 section-divider and TOC/anchor navigation conventions across the structured .md fleet

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The structured `.md` documentation fleet has drifted from its own documented formatting standard on two axes. Dividers: `---` between numbered ALL-CAPS H2 sections is required by every written standard, but the validator only enforces it on the opt-in code-folder path, so 1,015 of 3,667 numbered-H2 files are missing at least one divider (2,725 gaps total). Navigation: the written standard forbids a Table of Contents and `<!-- ANCHOR -->` nav comments on READMEs, but the general validator neither requires nor forbids them, leaving a mixed fleet where old and new styles both pass.

The deeper cause is a conflict between two authorities that was never reconciled: `core-standards.md` and the `sk-create-readme` suite say "no TOC, no nav-anchors," while `validate_document.py` and `hvr-rules.md` §9 still endorse the old TOC-plus-double-dash-anchor style for general documents.

**Key Decisions**: Bare numbered-H2 wins as the single source of truth (operator-ratified). The functional spec-kit continuity anchor system is explicitly preserved and out of scope.

**Critical Dependencies**: `validate_document.py` runs across the whole doc fleet and in CI, so any rule change has fleet-wide blast radius and needs a negative-control plus dry-run before enforcement.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (enforcement flip T013 operator-deferred) |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two documented conventions are unenforced and have drifted across 8,620 structured `.md` files. First, `---` dividers between numbered ALL-CAPS H2 sections are mandated by `core-standards.md` §4/§6, `writing-patterns.md`, `readme-template.md` and `hvr-rules.md` §9, yet `validate_document.py` only checks them inside the opt-in `--type=code_folder` path. Second, a Table of Contents plus `<!-- ANCHOR -->` nav comments are forbidden for READMEs by the written standard, but the general validation path neither requires nor forbids them, and `hvr-rules.md` §9 plus the validator's `tocAnchorFormat: double_dash` rule still actively endorse the old style. The result is a fleet where both eras coexist and neither is corrected.

### Purpose

One reconciled and mechanically enforced structural standard, so every structured `.md` reads consistently and any future drift fails validation instead of silently accumulating.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reconcile the conflicting authorities (`core-standards.md`, the `sk-create-readme` suite, `hvr-rules.md` §9, `template-rules.json`, `validate_document.py`) onto the operator-ratified "bare numbered-H2" standard.
- Close the divider-enforcement gap: enforce `---` between numbered ALL-CAPS H2 in the general validation path for applicable doc types, not only code-folder.
- Forbid a TOC and `<!-- ANCHOR -->` nav comments on README and skill-doc types in the general path, mirroring the existing code-folder rules.
- Normalize the fleet: add the missing dividers, strip the vestigial TOC and nav-anchors, and normalize any remaining single-dash nav anchors.

### Out of Scope

- The spec-kit continuity anchor system in `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` / `memory/context.md` — it is required, validated at error severity, and must not be touched.
- Constitutional-memory heading style (unnumbered Title-Case H2) — a separate doc class where the numbered-divider rule mostly does not apply. Flagged as an open policy question, not forced into numbered-H2.
- Prose and word-level quality (HVR vocabulary rules) — this packet is structural only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Add general-path `---`-between-numbered-H2 check; add README/skill-doc TOC + nav-anchor prohibition; leave continuity anchors and the code-folder path untouched. |
| `.opencode/skills/sk-doc/shared/assets/template-rules.json` | Modify | Set the README/reference rule flags so the general path enforces the standard. |
| `.opencode/skills/sk-doc/shared/references/hvr-rules.md` | Modify | Reconcile §9 checklist wording so it stops endorsing TOC + anchors on general docs. |
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | Verify | Confirm as the canonical statement; adjust only if it still contradicts. |
| Fleet `.md` files (1,015 divider + TOC/anchor outliers) | Modify | Bulk normalization after the validator change lands. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One documented standard: every authority states "bare numbered-H2 — no TOC, no nav-anchors, `---` between numbered ALL-CAPS H2." | `grep` across the five authority files shows no contradictory statement; `decision-record.md` records the ratification. |
| REQ-002 | The general validation path enforces `---` between numbered ALL-CAPS H2 for applicable doc types. | A negative-control file missing a divider fails `validate_document.py` with `--type=readme` (not only `--type=code_folder`). |
| REQ-003 | The general path flags a TOC and `<!-- ANCHOR -->` nav on README/skill-doc types, while continuity-doc anchors still pass. | A README carrying a TOC fails; the `007-valid-anchors` fixtures still pass unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The fleet is normalized: zero divider gaps in applicable types, zero vestigial TOC/nav-anchors. | The census script reports 0 gaps and 0 vestigial TOC/anchor files. |
| REQ-005 | Drift is caught going forward. | The divider/TOC/anchor checks run in the documentation validation gate used by CI. |
| REQ-006 | Anchor stripping never removes a functional continuity anchor. | An allowlist of doc-types/paths scopes the strip; the `008-invalid-anchors` fixture behavior is unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running the census reports 0 divider gaps across applicable doc types, down from 1,015 files / 2,725 gaps.
- **SC-002**: No structured README or skill doc contains a TOC or a vestigial `<!-- ANCHOR -->` nav comment, and the functional continuity anchors are untouched (`007-valid-anchors` fixtures still pass).
- **SC-003**: A newly created file missing a divider fails the general validation path (negative control reproduced before the fix, passing after).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate_document.py` runs fleet-wide and in CI | A wrong rule blocks the whole doc gate | Add a negative control, then dry-run the new rule across all 8,620 files before enforcing |
| Risk | Mass edit strips a functional continuity anchor | High | Scope anchor-stripping by a doc-type/path allowlist; exempt spec-kit continuity docs; verify against `007`/`008` fixtures |
| Risk | Single-vs-double-dash GitHub-slug assumption is unverified | Medium | Empirically test GitHub rendering of `## 1. OVERVIEW` before touching any anchor slug |
| Risk | Auto-inserting `---` inside fenced code or between H3 subsections | Medium | Reuse the validator's fence-aware line tracking; only act between numbered H2, treat HTML-comment lines as transparent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The added checks must not add meaningful cost to a single-document validation run (target under 5% overhead).

### Reliability
- **NFR-R01**: Enforcement must be deterministic and fence-aware, with no false positives inside code blocks or on anchor-comment lines. The census heuristic that flagged `templates/README.md` (which does have dividers) is the cautionary example.

### Compatibility
- **NFR-C01**: The change must not alter the code-folder path or the continuity-anchor validation, and existing exemptions (for example the `templates/changelog` anchor-contract skip in `validate.sh`) must be respected.

---

## 8. EDGE CASES

### Structural Boundaries
- Anchor comment sitting between `---` and a heading (as in `templates/README.md`): the divider is present; the checker must treat HTML-comment-only lines as transparent.
- Numbered H2 shown inside a fenced code example: it is content, not a section, and must not be counted.

### Doc-Class Boundaries
- Constitutional memories use unnumbered Title-Case H2: excluded from numbered-divider enforcement.
- Changelog folders: already exempt from the anchor contract; keep them exempt.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 1,015+ to normalize, 4 tooling/standard files; Systems: validator, template rules, HVR, fleet |
| Risk | 18/25 | Auth: N; API: N; Breaking: validator contract + CI gate |
| Research | 12/20 | Investigation complete; GitHub-slug empirical check outstanding |
| Multi-Agent | 8/15 | Workstreams: standard, tooling, normalization |
| Coordination | 9/15 | Dependencies: validator change must land before bulk normalization |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Validator rule change blocks the CI doc gate on many files at once | H | M | Dry-run across the fleet; land normalization and enforcement together or behind a flag |
| R-002 | Bulk strip removes a functional continuity anchor | H | L | Doc-type/path allowlist; fixture verification |
| R-003 | Divider auto-insert corrupts a fenced block | M | L | Fence-aware insertion reusing existing validator logic |

---

## 11. USER STORIES

### US-001: One enforced structural standard (Priority: P0)

**As a** documentation maintainer, **I want** a single enforced rule for section dividers and navigation, **so that** I never have to guess whether a given `.md` needs a TOC, anchors, or dividers.

**Acceptance Criteria**:
1. Given a README with a TOC, When I validate it, Then validation fails with a clear message.
2. Given a numbered-H2 file missing a divider, When I validate it on the general path, Then validation fails.

---

### US-002: Consistent, scannable long documents (Priority: P1)

**As a** reader of these docs, **I want** consistent `---` dividers between major sections, **so that** long files are easy to scan.

**Acceptance Criteria**:
1. Given the normalized fleet, When I open any applicable `.md`, Then every numbered ALL-CAPS H2 is preceded by a divider.

---

## 12. OPEN QUESTIONS

- Should constitutional memories (unnumbered Title-Case H2) adopt `---` dividers between sections, or remain a distinct, divider-optional class? This is a separate policy decision.
- Confirm empirically whether GitHub renders `## 1. OVERVIEW` as `#1-overview` (single) or `#1--overview` (double) before normalizing any nav anchors; it decides whether the 7 single-dash files are actually broken links.
- The ~54 files carrying `<!-- ANCHOR -->` comments mix vestigial nav anchors with functional continuity anchors. Triage them into an explicit allowlist before any bulk strip.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Investigation Findings**: See `research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
