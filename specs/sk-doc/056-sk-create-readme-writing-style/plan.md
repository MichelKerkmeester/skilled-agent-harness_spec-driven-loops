---
title: "Implementation Plan: Improve sk-create-readme writing-style guidance"
description: "Prose additions to six guidance files plus a changelog entry, carrying the root README's proven patterns into the skill's rules."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Improve sk-create-readme writing-style guidance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | `.skilled` skill-packet layout (SKILL.md + references + assets + changelog) |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `validate.sh --strict` |

### Overview
Add the root README's proven writing-style patterns to `sk-create-readme` as opt-in or correctly-scoped rules: a two-register emoji policy, feature-named headings, per-item inventory descriptions, per-feature H2 structure for large documents and a 2-4 sentence paragraph bound. Six files gain prose, the fillable template demonstrates the itemized-inventory pattern and a changelog entry records the release at v1.2.0.0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation skill packet: one SKILL.md contract plus flat `references/readme/` evidence files, a fillable `assets/` template and a per-release `changelog/` entry.

### Key Components
- **SKILL.md**: the authoritative rule list (format rules, section table) every README run loads.
- **writing-patterns.md / types-and-voice.md / quality-and-checklist.md**: the three reference files carrying section standards, voice registers and review checks.
- **readme-template.md**: the fillable scaffold authors copy.
- **core-standards.md**: shared format table other sk-doc packets also read. One YAML line names the emoji registers.

### Data Flow
Author request → `SKILL.md` routes to the type decision → reference files supply writing detail → template supplies the scaffold → checklist gates delivery. The new rules slot into that flow at the points authors already consult.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` §5 format rules | Authoritative README rules | Updated with four new rules | `validate_document.py` VALID |
| `references/readme/*.md` | Overflow detail authors load | Updated with the new patterns and register | `validate_document.py` VALID |
| `readme-template.md` | Fillable scaffold | Itemized pattern added as opt-in | `validate_document.py` VALID |
| `core-standards.md` README block | Shared format table | Emoji line now names two registers | `validate_document.py` VALID |
| `hvr_scan.py` / audit scripts | Scanners | Unchanged, rules are guidance-level | git diff shows no script edits |
| Existing READMEs | Consumers | Unchanged, additions are opt-in | No README outside scope touched |

Required inventories:
- Same-class producers: every file carrying emoji or section guidance was enumerated before editing (SKILL.md, three references, template, core-standards).
- Consumers of changed wording: `core-standards.md` is the only shared consumer surface. The change tightens, not relaxes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each touched markdown file | `validate_document.py`, `hvr_scan.py` |
| Integration | Packet folder | `validate.sh --strict` |
| Manual | Diff review of every addition | git diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate_document.py`, `hvr_scan.py` | Internal | Green | Validation evidence unavailable |
| `core-standards.md` shared wording | Internal | Green | Other packets inherit the change. Wording tightened so direction is safe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation failures that cannot be reworded, or operator rejection of the new rules.
- **Procedure**: `git checkout` the six touched files and delete `changelog/v1.2.0.0.md` plus the packet folder.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Docs + Template edits ──► Changelog ──► Packet docs ──► Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Doc edits | None | Changelog, packet docs |
| Changelog | Doc edits | Validation |
| Packet docs | Doc edits | Validation |
| Validation | All above | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Doc edits | Low | Bounded prose additions |
| Changelog | Low | One entry, existing format |
| Verification | Low | Existing commands |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes
- [x] No feature flags involved
- [x] Diff reviewed before validation

### Rollback Procedure
1. Revert the six file edits via git.
2. Remove the changelog entry and packet folder.
3. Re-run `validate_document.py` on the reverted files to confirm the pre-change state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
