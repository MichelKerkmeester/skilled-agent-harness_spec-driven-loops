---
title: "Implementation Plan: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance"
description: "Derive each level's addendum from the gated templates instead of deleted fragment files, and separate genuine identifiers from reserved words in the vocabulary scan."
trigger_phrases:
  - "restore level upgrade"
  - "upgrade-level fragments"
  - "vocabulary invariance"
  - "template addendum derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/003-restore-level-upgrade-and-vocabulary-invariance"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Restored the level-upgrade path and cleared the vocabulary invariance"
    next_safe_action: "None; both defects are fixed and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh"
    session_dedup:
      fingerprint: "sha256:d0f92dc333072d83d3e058277c6722ff7abfb237688da41e785674424042ee74"
      session_id: "2026-08-29-033-003-restore-level-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2, plus one TypeScript test |
| **Framework** | spec-kit level contract and the inline gate renderer |
| **Storage** | None |
| **Testing** | Throwaway packet driven through the upgrade chain; vitest for the invariance |

### Overview
The per-level addendum is derived by rendering one gated template at two levels and taking what the higher level adds, which reproduces the deleted fragment files without reintroducing them. Sections the document already carries are filtered out so a heading renumbering cannot duplicate them, and an upgrade to Level 2 now also creates the document the closure gate requires.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-derived transformation: the gated templates are the single source for what each level contains, and the upgrade reads them rather than carrying a parallel copy.

### Key Components
- **`derive_addendum_fragment`**: renders a document at two levels and emits the added lines
- **`filter_sections_absent_from`**: drops sections the target document already has, matching on heading text with the number stripped
- **`derive_spec_addendum_pair`**: splits the derived addendum into the lead section and the remainder for the two anchors a spec upgrade injects at

### Data Flow
The upgrade resolves the current level, renders the source and target versions of each document, diffs them, filters the result against the document on disk, then injects at the existing anchors. A backup is taken first and restored if any step fails.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Gated templates (policy) | Own what each level contains | unchanged | Rendered, not edited |
| `upgrade-level.sh` (consumer) | Reads the templates instead of fragment files | update | Chain run exits 0 at every step |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Setup

Establish that the fragment directories are gone rather than relocated, and that the gated templates carry the same per-level content. Capture the failing upgrade first so the same command proves the fix.

### Phase 2: Implementation

Derive each level's addendum from the gated templates, filter out sections the document already carries, split the spec addendum for the two anchors it injects at, and create the closure document when upgrading to Level 2. Then separate real identifiers from reserved words in the vocabulary scan.

### Phase 3: Verification

Drive a throwaway Level 1 packet through every level, confirm each step exits 0, scan for duplicated headings, and re-run the invariance suite including its sentinel.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Vocabulary invariance and its sentinel | vitest |
| Integration | Full L1 to L3+ upgrade chain | Throwaway packet in a temp directory |
| Manual | Duplicate-heading scan of the upgraded documents | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gated templates and inline renderer | Internal | Green | Without them there is no source for the derived addenda |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an upgrade injects wrong or duplicated content on a real packet.
- **Procedure**: revert the two script changes; the upgrade's own backup restores any packet touched in the meantime.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm the fragment directories are gone rather than moved |
| Core Implementation | Medium | Derivation, filtering, prefix/suffix split, closure document |
| Verification | Low | Chain run plus the invariance suite |
| **Total** | | **Part of one session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop using `upgrade-level.sh`; it is an operator command, not a runtime path
2. Revert the changes to `upgrade-level.sh` and the invariance allowlist
3. Re-run the invariance suite and one upgrade against a throwaway packet
4. Note the reversal in the packet changelog; the upgrade path is operator-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Each upgrade takes its own backup before writing.
<!-- /ANCHOR:enhanced-rollback -->

---

