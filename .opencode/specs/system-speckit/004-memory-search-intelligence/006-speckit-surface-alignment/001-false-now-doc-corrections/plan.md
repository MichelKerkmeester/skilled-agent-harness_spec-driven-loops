---
title: "Implementation Plan: False-Now Documentation Corrections"
description: "Apply minimal documentation and code-comment alignment for four confirmed false-now surfaces, then verify with targeted greps and strict spec validation."
trigger_phrases:
  - "implementation plan"
  - "false-now doc corrections"
  - "retention forgetting flag"
  - "Track C supersession"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment/001-false-now-doc-corrections"
    last_updated_at: "2026-07-05T08:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Plan false-now doc corrections"
    next_safe_action: "Run acceptance verification"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/004-memory-search-intelligence/benchmark-status.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "false-now-doc-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: False-Now Documentation Corrections

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and TypeScript comment text |
| **Framework** | system-spec-kit documentation packet |
| **Storage** | None |
| **Testing** | Targeted `rg`, comment hygiene, and strict spec validation |

### Overview
This is a low-blast, reversible documentation alignment. The implementation reads the cited files, fixes only current/live false-now text, and avoids historical phase records that intentionally preserve old flag names and defaults.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] Cited files read before edits.
- [x] Minimal scoped source edit applied.
- [x] Spec packet docs authored from Level 1 template structure.
- [x] Acceptance greps, comment hygiene, scoped alignment drift, and strict spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical documentation correction with no runtime design change.

### Key Components
- **Packet 028 docs**: Own the survivor flag and benchmark-status narrative.
- **System-spec-kit feature catalog**: Describes shipped soft-delete recall filtering behavior.
- **Search-results formatter comment**: Explains the durable default-on, opt-out envelope fragment behavior.

### Data Flow
Readers use the docs and comments to configure or interpret shipped behavior. Correcting the text removes false-now guidance without changing the code path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `feature-flags.md` | Survivor flag table | Confirmed already names `SPECKIT_RETENTION_FORGETTING` at line 23 | Targeted `rg` for stale suffix. |
| `benchmark-status.md` | Benchmark and flag-resolution narrative | Added supersession pointer and changed final tally row to unsuffixed flag | Read lines 112-114 and 179-183 after patch. |
| Soft-delete feature catalog | Current shipped feature behavior | Confirmed already states active-row default exclusion at line 20 | Old-sentence `rg` and new-sentence `rg`. |
| `search-results.ts` comment | Maintainer-facing why for envelope fragment | Confirmed already states default-on opt-out at lines 1350-1352 | `rg` for stale phrases near file. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read cited files and relevant templates.
- [x] Confirm live flag evidence in `ENV_REFERENCE.md` and code.
- [x] Identify current/live `_V1` drift without touching historical records.

### Phase 2: Core Implementation
- [x] Add Track-C supersession pointer to `benchmark-status.md`.
- [x] Change `benchmark-status.md` retention row from `SPECKIT_RETENTION_FORGETTING_V1` to `SPECKIT_RETENTION_FORGETTING`.
- [x] Author Level 1 spec packet docs.

### Phase 3: Verification
- [ ] Run acceptance greps.
- [x] Run comment hygiene on modified comment-capable source.
- [x] Run OpenCode alignment drift verification for changed scope.
- [x] Run strict spec validation after this verification update.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Text grep | Required acceptance strings | `rg` |
| Comment hygiene | Modified TypeScript comment file | `check-comment-hygiene.sh` |
| OpenCode alignment | Changed `.opencode` docs and formatter comment | `verify_alignment_drift.py --root .opencode` |
| Spec validation | New packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `ENV_REFERENCE.md:132` | Internal | Green | Confirms live retention flag spelling. |
| `search-flags.ts` retention and envelope readers | Internal | Green | Confirms runtime reads unsuffixed live flags. |
| system-spec-kit strict validator | Internal | Green | Gates packet completion. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verification command proves the correction contradicts current code or docs policy.
- **Procedure**: Revert the `benchmark-status.md` edits and remove this child spec folder; no runtime state or persisted data is affected.
<!-- /ANCHOR:rollback -->
