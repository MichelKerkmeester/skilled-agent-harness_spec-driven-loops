---
title: "Feature Specification: Phase 6: evidence-gated-provenance"
description: "Ensure template version stamping happens only when exact evidence supports it, not on old or markerless documents."
trigger_phrases:
  - "evidence gated provenance"
  - "phase 6 evidence gated provenance"
  - "template version stamping evidence"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: evidence-gated-provenance

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 16 |
| **Predecessor** | 005-healer-phrase-seeding |
| **Successor** | 007-ci-rule-set-comparison |
| **Handoff Criteria** | Template version stamping requires an exact match against the anchor set rendered for the doc's level. `--auto-upgrade` is retired. Documents never get invented provenance. Tests pass. SH-06 lands before SH-08. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-template-staleness.sh --auto-upgrade` at line 181 uses sed -i '' to bump template versions on any old marker with no structural check, inventing history for documents that changed templates only in version number. Separately, `heal-spec-docs.cjs` at line 80 checks if a document carries a superset of signature anchors (using matchesSignature), then stamps it as if it matches exactly, contradicting the comment "exactly these anchors". MIGRATION.md at line 40 explicitly says "Writers never rewrite old packets only to normalize marker style", yet the auto-upgrade does exactly that. This violates the never-invent-history rule.

Evidence: Section 8.5 of the research, verified at .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:181, .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:80, .skilled/skills/system-spec-kit/templates/MIGRATION.md:40.

The flag has one caller in the repo: `quality-audit.sh --fix` at lines 148-153. That call passes a single spec folder as `--root`, so the staleness script cannot find its templates directory (`check-template-staleness.sh:121-125`) and exits 2 before scanning. The error is swallowed by `2>/dev/null || true`, so the `--fix` branch has never reached the upgrade. Whether scripts outside the repo pass the flag is unknown.

### Purpose
Make provenance stamping evidence-gated so the upgrade path never invents template versions it cannot prove, respecting MIGRATION.md's intent that old documents stay documented as unknown provenance rather than rewritten to normalize style.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retire `check-template-staleness.sh --auto-upgrade`. For one release the flag prints "removed, use upgrade-legacy" and exits 2, so outside scripts fail loudly
- Remove the dead `quality-audit.sh --fix` branch, or point it at `upgrade-legacy`
- Modify `heal-spec-docs.cjs` to stamp a template header only on an exact match against the anchor set rendered for the document's level
- Leave markerless and old-marker documents unmarked. No marker or comment is added to record unknown provenance
- Update MIGRATION.md to state the never-invent-history rule

### Out of Scope
- Changing which templates define or how signatures are calculated
- Retroactively fixing historical packets (that is Phase 13 or ongoing repair)
- Changing phrase-judge or other validation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` | Modify | Retire --auto-upgrade: the flag prints "removed, use upgrade-legacy" and exits 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Exact match against the level's rendered anchor set, not a superset of a fixed list |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` | Modify | Remove the dead `--fix` branch, or point it at upgrade-legacy |
| `.skilled/skills/system-spec-kit/templates/MIGRATION.md` | Modify | State the never-invent-history rule |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts` | Create | Pin the retired flags and the exact-anchor stamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | heal-spec-docs stamps a template header only when the document's anchor set equals the set rendered for its level |
| REQ-002 | `check-template-staleness.sh --auto-upgrade` writes nothing, prints "removed, use upgrade-legacy" and exits 2 |
| REQ-003 | Markerless or old-marker documents keep their current header, and no marker is added to them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | MIGRATION.md documents the never-invent-history rule |
| REQ-005 | `quality-audit.sh --fix` no longer calls `--auto-upgrade` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: validate.sh --strict passes on this packet
- **SC-002**: Tests pass verifying exact anchor match is required for stamping
- **SC-003**: Code diff shows no auto-upgrade version bumping or superset matching
- **SC-004**: MIGRATION.md clarifies never-invent-history rule
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SH-05 and SH-06 must land before SH-08 | External repo upgrade path must not have invented provenance or rejected phrases | Build both before SH-08 |
| Risk | More documents stay unknown provenance | Upgrade output has fewer version stamps | Intended. A missing marker stays detectable by TEMPLATE_SOURCE and the era report |
| Risk | Retiring --auto-upgrade breaks outside scripts | A script passing the flag stops working | For one release the flag fails loudly with a pointer to upgrade-legacy, instead of silently doing nothing |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. Decided 2026-10-08 by the operator:

- **`--auto-upgrade` is retired.** Its only write is a version bump that anchors cannot prove, and its one in-repo caller never reaches it. For one release the flag prints "removed, use upgrade-legacy" and exits 2. Restricting it to an exact anchor match with no bump was considered and rejected, because with no bump the flag has nothing left to do.
- **No marker on unknown-provenance documents.** Adding one would be the rewrite `MIGRATION.md:40` forbids, and a missing marker is already detectable.
- **Build note.** The signatures at `heal-spec-docs.cjs:60-65` list only the six Level 1 spec anchors, so exact equality against them would never match a Level 2 or 3 spec.md. The exact comparison must use the anchor set rendered for the document's level.

Questions answered during the build:

- **The healer reads the level the way the validator does.** `declaredLevel` takes the `SPECKIT_LEVEL` marker first, then the metadata-table `Level` row, then the frontmatter `level:` key. The first version skipped the frontmatter key, which the review caught. A packet that records no level is refused with a named reason, so a document is never compared against a guessed level.
- **The stamped header comes from the rendered template.** The healer imports `loadTemplateContractForDocument` and `normalizeLevel` from `template-structure.js`, compares the document's anchors with the required and optional anchors together, and reads the `SPECKIT_TEMPLATE_SOURCE` line the level actually renders. `TEMPLATE_SIGNATURES` and `matchesSignature` are gone, so no fixed header table remains. `evaluateTemplateGate` and `renderManifestTemplate` are not exported from `template-structure.js`, so the healer carries a local walk that mirrors them, with the same gate grammar (operators case-insensitive, level atom case-sensitive).
- **`quality-audit.sh --fix` was removed and made loud.** The spec allowed removing the branch or pointing it at `upgrade-legacy`. The build removed the branch and also made the flag print "--fix was removed, use upgrade-legacy" and exit 2, the same shape as `--auto-upgrade`, so an outside script gets a clear failure instead of a silent no-op.
- **REQ-003 is read together with REQ-001.** A markerless document whose anchors equal its level's render is still named, as the edge case "Document with an exact level match and no marker" allows. REQ-003 and AC-003 therefore cover every old-marker document, which the healer never touches, and every markerless document that fails the exact check.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Compliance
- **NFR-C01**: Provenance marking must never invent history for documents with no exact evidence
- **NFR-C02**: No tool adds or bumps a marker on an existing document without exact evidence

### Integrity
- **NFR-I01**: An exact match against the level's rendered anchor set is the only condition for template header stamping

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Signature Matching
- Document with no anchors: no match, stay unknown
- Document with some but not all template anchors: no exact match, stay unknown
- Document with an old version marker: the marker is left as it is, never bumped
- Document with additional anchors beyond the level's set: no exact match, stay unknown

### Upgrade Paths
- v3 document with no marker: no stamping, and no marker added
- Old-marked document: left as it is, since legacy markers stay valid
- Document with an exact level match and no marker: the healer may name its template
- Script calling `--auto-upgrade`: gets "removed, use upgrade-legacy" and exit 2

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three files modified, logic is gating/decision, no schema changes |
| Risk | 8/25 | Low-medium: loud break for any outside caller of --auto-upgrade |
| Research | 3/20 | Verified from codebase, MIGRATION.md clear |
| **Total** | **21/70** | **Level 2 small** |
<!-- /ANCHOR:complexity -->

---


