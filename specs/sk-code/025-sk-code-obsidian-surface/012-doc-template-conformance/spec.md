---
title: "Feature Specification: Doc-Template Conformance"
description: "Auditing every sk-code-obsidian packet markdown against the sk-doc templates it claims to follow, using the real validators, and recording what they find rather than what a manual read would guess."
trigger_phrases:
  - "obsidian doc template conformance"
  - "sk-code-obsidian phase 012 audit"
  - "sk-doc validator findings obsidian surface"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/012-doc-template-conformance"
    last_updated_at: "2026-08-28T23:55:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Doc-template conformance audit"
    next_safe_action: "Surface-reality conformance (phase 013)"
    blockers: []
    key_files:
      - "../../../../Code_Environment/Public/.opencode/skills/sk-doc/scripts/validate_document.py"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether renaming '## 1. WHEN THE HUB BUNDLES THIS' to a generic vocabulary header would fix the missing_required_section findings: yes, but it would break the operator's binding requirement that this packet mirror sk-code-mobile-cli exactly, and every sibling surface shares the same divergence — recorded as a finding, not applied as a fix (operator, 2026-08-28)"
---
# Feature Specification: Doc-Template Conformance

> Phase chain: parent [`../spec.md`](../spec.md), predecessor
> [`../011-changelog-and-verification/spec.md`](../011-changelog-and-verification/spec.md),
> successor [`../013-surface-reality-conformance/spec.md`](../013-surface-reality-conformance/spec.md).

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 011 closed the packet's first ten phases with a live gate re-run, but named two phases still
unstarted: this one and its successor. Nothing had yet run the real `sk-doc` document validators
against every markdown file this packet ships, and nothing had checked whether the packet's own
`SKILL.md` and playbook pass the package-level validators the family relies on. A packet that claims
template conformance without ever having run the validator is asserting a state it has not measured.

### Purpose

Run the real `sk-doc` validators — `validate_skill_package.py`, `validate-playbook-package.cjs`, and
`validate_document.py` — against this packet, record every result exactly as returned, and make an
honest call on any finding that looks like a defect but is actually a validator limitation or a
binding cross-packet consistency requirement. No `/doc:quality` command exists in this runtime and
the owning skill `sk-create-quality-control` ships no runnable script for this purpose, so this audit
uses the validators `sk-doc` actually exposes rather than inventing a substitute.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Running `validate_skill_package.py` against the `sk-code-obsidian` packet directory and recording
  its result verbatim, including its `Detected kind: standalone` misclassification of this hub
  SURFACE packet.
- Running `validate-playbook-package.cjs --package` against
  `sk-code-obsidian/manual-testing-playbook/` and recording its strict-mode, fail-closed result.
- Running `validate_document.py` across every non-symlinked markdown file in the packet and recording
  every `missing_required_section` finding.
- Running the identical `validate_document.py` pass against every sibling SURFACE packet
  (`sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode`) to determine whether this packet's
  findings are a defect unique to it or a shared, structural divergence across the whole SURFACE
  packet class.
- This leaf's own `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, recording the
  results and the reasoning for treating each finding as recorded-not-fixed or as a genuine defect.

### Out of Scope

- Renaming any `SKILL.md` header, including `## 1. WHEN THE HUB BUNDLES THIS`, to satisfy the
  validator's generic section-name expectations. The operator's binding requirement is that this
  packet mirror `sk-code-mobile-cli` exactly; renaming here alone would make this the only surface in
  the family that no longer matches its siblings.
- Modifying `validate_document.py`, `validate_skill_package.py`, or `validate-playbook-package.cjs`
  to correct the `standalone`-classification finding or to recognize the family's actual header
  vocabulary. That is a change to shared `sk-doc` tooling, outside this packet's write boundary.
- Phase 013 (surface-reality conformance): named as the successor, not executed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's spec-kit record of the audit already run |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three real `sk-doc` validators are run against this packet and every result recorded verbatim | `validate_skill_package.py` (rc 0, PASS, with the `standalone`-classification finding noted), `validate-playbook-package.cjs` (rc 0, PASS, strict on, tier=FAIL_CLOSED, scenarios=7, violations=0, warnings=0), `validate_document.py` (34 PASS, 3 `missing_required_section` failures) all appear in this leaf with their exact figures. |
| REQ-002 | The `missing_required_section` findings are checked against every sibling SURFACE packet before being called a defect unique to this one | `sk-code-mobile-cli` (3 missing), `sk-code-webflow` (4 missing), `sk-code-opencode` (4 missing), and the template's own playbook index all diverge the same way; this packet is joint-best of the four. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The reversal condition for the withheld header rename is stated explicitly | This leaf states that if the SURFACE-packet class ever adopts the generic section vocabulary, this packet's `SKILL.md` follows in the same change — not before, and not alone. |
| REQ-004 | No spec path, requirement ID, task ID, or checklist ID is written into any source or skill file | Confirmed: this phase touches only the four spec-kit leaf files; no `SKILL.md`, reference, playbook, or asset file is edited. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three validators have been run against this packet at least once, with exact rc and
  figures recorded in this leaf, not estimated.
- **SC-002**: The `validate_skill_package.py` `standalone`-classification finding is recorded as a
  validator-side finding against a hub SURFACE packet with no `graph-metadata.json`, not miscast as a
  defect in this packet.
- **SC-003**: The `missing_required_section` findings are cross-checked against all three sibling
  SURFACE packets and the template's own playbook index, and the comparison is recorded, not assumed.
- **SC-004**: The decision not to rename `## 1. WHEN THE HUB BUNDLES THIS` is recorded with its
  reasoning and its explicit reversal condition.

### Acceptance Scenarios

- **Scenario 1**: **Given** `validate_skill_package.py` run against the `sk-code-obsidian` packet
  directory, **when** the packet deliberately carries no `graph-metadata.json` (a nested one would be
  a NESTED_IDENTITY violation for a hub SURFACE packet), **then** the validator reports
  `Detected kind: standalone` and still exits 0/PASS — recorded here as a validator classification
  finding, not a packet defect.
- **Scenario 2**: **Given** `validate_document.py` reports three files with
  `missing_required_section` errors (`SKILL.md`: when_to_use, smart_routing, how_it_works;
  `manual-testing-playbook.md`: overview; `references/quality/doc-quality-gate.md`: overview),
  **when** the identical validator is run against `sk-code-mobile-cli`, `sk-code-webflow`, and
  `sk-code-opencode`, **then** every sibling shows the same class of divergence (3, 4, and 4 missing
  respectively) and this packet is joint-best of the four, establishing the divergence as structural
  to the SURFACE packet class rather than a defect isolated to this packet.
- **Scenario 3**: **Given** the operator's binding requirement that this packet mirror
  `sk-code-mobile-cli` exactly, **when** a header rename would silence the validator but break that
  mirror, **then** the rename is not applied, and the reversal condition (the SURFACE-packet class
  adopting the generic vocabulary together) is stated so a future phase can act on it correctly.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Treating a validator's classification limitation as if it were this packet's defect | Would trigger an unnecessary structural change (e.g. adding a spurious `graph-metadata.json`) that itself causes a NESTED_IDENTITY violation | Recorded explicitly as a validator-side finding, with the reason a nested identity file is wrong for a hub SURFACE packet |
| Risk | Renaming `SKILL.md` headers in isolation to silence `missing_required_section` | Breaks the operator's binding requirement that this packet mirror `sk-code-mobile-cli` exactly, making this surface the odd one out in its own family | Not applied; recorded as a finding with an explicit reversal condition tied to family-wide adoption |
| Dependency | `sk-doc`'s three validators (`validate_skill_package.py`, `validate-playbook-package.cjs`, `validate_document.py`) | The only tools this audit is permitted to use, since no `/doc:quality` command or `sk-create-quality-control` script exists | Confirmed absent before falling back to the real validators; not invented |
| Dependency | Sibling SURFACE packets (`sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode`) and the template's playbook index | The comparison set that turns "this packet has 3 missing sections" into "the whole class has this shape" | Each sibling's `validate_document.py` result read directly, not assumed from this packet's own result |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Whether renaming `## 1. WHEN THE HUB BUNDLES THIS` to satisfy the validator's generic vocabulary
  would fix the finding**: yes, but it would break the operator's binding requirement that this
  packet mirror `sk-code-mobile-cli` exactly, and every sibling surface carries the identical
  divergence. Answered: recorded as a finding, not applied as a fix. Reversal condition: if the
  SURFACE-packet class ever adopts the generic vocabulary, this packet follows in the same change,
  not ahead of it (operator, 2026-08-28).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Predecessor**: [`../011-changelog-and-verification/spec.md`](../011-changelog-and-verification/spec.md)
- **Successor**: [`../013-surface-reality-conformance/spec.md`](../013-surface-reality-conformance/spec.md)
- **Validator (skill package)**: `../../../../Code_Environment/Public/.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`
- **Validator (playbook)**: `../../../../Code_Environment/Public/.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
- **Validator (document)**: `../../../../Code_Environment/Public/.opencode/skills/sk-doc/scripts/validate_document.py`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
