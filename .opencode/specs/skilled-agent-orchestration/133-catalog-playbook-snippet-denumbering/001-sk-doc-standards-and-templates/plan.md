---
title: "Implementation Plan: sk-doc Standards & Templates De-Numbering [133/001/plan]"
description: "Edit the ~12 sk-doc contract surfaces to make the no-prefix snippet-filename convention canonical, via a MiMo authoring pass + DeepSeek review, keeping numbered category folders and the validator logic unchanged."
trigger_phrases:
  - "133 phase 001 plan"
  - "sk-doc contract de-numbering plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/001-sk-doc-standards-and-templates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 001 plan during 133 scaffold"
    next_safe_action: "On approval, run MiMo authoring pass over the 12 contract files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc Standards & Templates De-Numbering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON + Python (doc/config only) |
| **Surface** | sk-doc skill: references, assets/templates, create-commands, validator |
| **Executor** | cli-opencode → MiMo-v2.5-pro (author) + DeepSeek-v4-pro (review) |
| **Testing** | `sk-doc/scripts/tests/test_validator.py`; sk-doc strict validate; targeted grep guards |

### Overview
A bounded, doc-only edit pass over ~12 files. MiMo authors the de-numbering edits (large context, COSTAR + lean framing); DeepSeek reviews the diff against the two guardrails (category folders KEEP numbers; validator logic untouched). The convention is the contract that phases 003–005 conform to, so this phase ships and validates before any file rename.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Parent decisions D1–D4 acknowledged (this phase only defines the convention D4 references)
- [ ] The 12 target files + exact edit anchors enumerated (done in spec §3)

### Definition of Done
- [ ] REQ-001..004 (P0) verified by grep guards
- [ ] `validate_document.py` tests pass (logic unchanged)
- [ ] sk-doc strict validate passes on edited references/templates
- [ ] DeepSeek review confirms category-folder numbering preserved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The convention, stated precisely
- **Snippet file**: `NN--category-name/feature-name.md` — NO numeric prefix on the file.
- **Category folder**: `NN--category-name/` — KEEPS the 2-digit prefix (drives root section order).
- **Ordering**: defined by the **root catalog/playbook listing order**; the filesystem sorts snippets alphabetically and that is cosmetic. The root document is the single source of truth for sequence.
- **Collision rule** (for authors): within one category folder, two features must not reduce to the same slug; if they would, give them distinct descriptive slugs.

### Key Components
- **References** (`feature_catalog_creation.md`, `manual_testing_playbook_creation.md`): prose standard.
- **Templates** (4 files): copy-paste scaffolds with `{...}` placeholders.
- **create-commands** (2 docs + 4 YAML): generation instructions.
- **Validator** (`validate_document.py` + `template_rules.json`): comment/description only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `feature_catalog_creation.md` §3 L71, §4 numbering | Prescribes `NNN-` global sequence | Rewrite to no-prefix + ordering rule | `rg -n 'globally sequential\|NNN-feature' references/` = 0 |
| `manual_testing_playbook_creation.md` §3 L73 | Prescribes `001-feature-name.md` slugs | Rewrite to no-prefix | grep clean |
| `feature_catalog_template.md` L35-38,L63-69,L163,L229,L232,L261 | Numbered examples + scaffold paths | De-number placeholders | `rg '[0-9]{3}-feature-name\|{NN}-{feature' assets/feature_catalog/` = 0 |
| `*_snippet_template.md` (both) | Scaffold path + metadata path + Related refs | De-number `{NN}`/`{NNN}` tokens | grep clean |
| `manual_testing_playbook_template.md` L33-39,L100,L305,L325,L342-343,L350,L431 | Numbered tree + Feature File links | De-number URL paths; keep Feature IDs (`{CAT}-001`) | grep clean; Feature IDs intact |
| `validate_document.py` L123 comment | Says `NNN-feature.md` | Reword (NO logic change) | `test_validator.py` passes; `git diff` shows comment-only |
| `template_rules.json` L556 description | Says `NN--category/` (already fine) | Confirm/clarify file-number not implied | grep clean |

Required inventories:
- Consumers of the numbered convention in sk-doc: `rg -n '[0-9]{3}-feature\|NNN-\|globally sequential\|3-digit' .opencode/skills/sk-doc .opencode/commands/create`.
- Invariant: category folder regex `^\d{2}--` must remain matched by `validate_document.py:129` after edits (it is comment-only, so unaffected — assert via test).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: References (the prose standard)
- [ ] Edit `feature_catalog_creation.md` (naming rule + ordering rule)
- [ ] Edit `manual_testing_playbook_creation.md` (numeric-slug line + tree)

### Phase 2: Templates + create-commands
- [ ] De-number the 4 templates' filename placeholders and examples
- [ ] Align 2 create-command docs + 4 YAML assets

### Phase 3: Validator wording + verify
- [ ] Comment/description de-stale in `validate_document.py` + `template_rules.json`
- [ ] Run validator tests + grep guards + DeepSeek diff review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Validator logic unchanged | `python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py` |
| Structural | Edited references/templates validate | sk-doc strict validate / `validate_document.py` |
| Guard | No numbered-filename guidance remains | `rg` guards from REQ-001/003/005 |
| Review | Category numbering preserved | DeepSeek adversarial diff read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-opencode + Xiaomi/opencode-go auth | External | Green (pre-flight at dispatch) | Fall back to local authoring |
| Decision D1 (script vs hand-edit) | Internal | Pending | Does not block 001 (001 is always doc-edit) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validator tests fail, or review finds category numbering damaged.
- **Procedure**: `git checkout -- <the 12 paths>` (scoped); re-dispatch with a tightened brief. Doc-only, no data risk.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
References ──► Templates + create-commands ──► Validator wording + verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| References | None | Templates |
| Templates + create-commands | References | Verify |
| Verify | Templates | Phase 002 (tooling) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| References | Low | 1 MiMo dispatch |
| Templates + create-commands | Med | 1–2 MiMo dispatches |
| Verify | Low | 1 DeepSeek review + local tests |
| **Total** | | **~3 dispatches** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Dispatch brief invariants (cli-opencode)
- `Spec folder: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/001-sk-doc-standards-and-templates (pre-approved, skip Gate 3)`
- `--model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --format json --dir <repo-root>` (MiMo author); no `--agent`; append `</dev/null`.
- `BANNED OPERATIONS: rename/delete any file; edit category-folder numbers; change validate_document.py logic.`
- `ALLOWED WRITE PATHS:` the 12 enumerated files only.

### Rollback Procedure
1. `git checkout -- <12 paths>`
2. Re-run validator tests to confirm clean baseline
3. Re-dispatch with corrected constraints
<!-- /ANCHOR:enhanced-rollback -->
