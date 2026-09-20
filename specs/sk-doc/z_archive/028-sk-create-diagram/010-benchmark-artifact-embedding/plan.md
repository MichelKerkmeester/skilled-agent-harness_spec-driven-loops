---
title: "Implementation Plan: sk-create-diagram benchmark artifact embedding"
description: "Copy 7 real outputs into their report folders and document 2 intentional omissions."
trigger_phrases:
  - "diagram benchmark artifact plan"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/010-benchmark-artifact-embedding"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Execute copies + source.md edits"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram benchmark artifact embedding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown result reports, real HTML/SVG output copies |
| **Framework** | `create-benchmark`'s copied-artifact storage contract |
| **Storage** | `.opencode/skills/sk-doc/sk-create-diagram/benchmark/reports/` (harness-owned) |
| **Testing** | SHA-256 byte-identity checks, `git status` scope confirmation |

### Overview

A 7-file copy plus a 9-file mechanical doc edit with a known, closed-form mapping (scenario -> source path -> destination path). Executed directly, no model dispatch — a copy operation adds risk if delegated (a model can mistype a path) without adding value.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 009's 9 report folders and 7 real `docs/*` output files confirmed to exist.
- [x] `create-benchmark`'s copied-artifact contract read and confirmed as the ground truth (§4 of `sk-create-manual-testing-playbook/SKILL.md`).

### Definition of Done

- [x] 7/7 artifact copies exist and are byte-identical to source.
- [x] 2/2 no-artifact scenarios document why in `source.md`.
- [x] No pre-existing report content altered.
- [x] `implementation-summary.md` and `checklist.md` written.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Copy-verify-document: copy each known source file into its report folder as `artifact.<ext>`, independently recompute SHA-256 against the source rather than trusting `cp`'s exit code, then add a `Produced artifact` row to `source.md` (a link for the 7 real copies, a documented reason for the 2 that produce no diagram output).

### Key Components

- **7 artifact copies**: one per scenario that produced a real HTML/SVG output.
- **2 documented omissions**: `hub-registration` (registry-verification scenario, no diagram by design) and `onboarding-flow` (correct refusal, nothing written).
- **Independent verification**: `shasum -a 256` on every pair, `git status --short` scoped to `benchmark/reports/` to confirm nothing else changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Implementation

- [x] Copy 7 real outputs into their report folders as `artifact.<ext>`.
- [x] Recompute SHA-256 for each copy and its source; confirm exact match.
- [x] Add a `Produced artifact` row to all 9 `source.md` files.
- [x] Diff every other report file per folder to confirm nothing besides `source.md` changed.

### Phase 2: Verification

- [x] Confirm `git status --short` on `benchmark/reports/` shows only the new `artifact.*` files and modified `source.md`.
- [x] Write `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Byte-identity | 7 artifact copies vs their `docs/` source | `shasum -a 256` |
| Scope integrity | All 9 report folders | `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 009's 9 report folders and 7 output files | Internal | Satisfied | No source to copy from |
| `create-benchmark`'s copied-artifact contract | Internal | Satisfied | No ground truth for the required shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A copy diverges from its source, or an unrelated report file gets altered.
- **Procedure**: `git checkout -- <path>` or delete the stray `artifact.*` file; the copy operation is purely additive, so rollback never touches phase 009's original content.
<!-- /ANCHOR:rollback -->
