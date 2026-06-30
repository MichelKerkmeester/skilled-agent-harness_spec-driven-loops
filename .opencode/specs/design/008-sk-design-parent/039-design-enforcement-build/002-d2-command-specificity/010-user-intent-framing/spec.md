---
title: "D2-R10 — User-intent framing across the five /design:* commands"
description: "Add userIntent{job,ownedSignals} + copyGuard to command-metadata.json, reframe the five wrappers to lead with the user job and relocate mode-binding to an Internal Binding section, and enforce the intent lead + bridge-first ban in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r10 user intent framing"
  - "user intent framing design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/010-user-intent-framing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgraded spec to Level 2; recorded renumber-safety + copyGuard-scope; status complete"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r10-user-intent-framing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "copyGuard scanned in the intent lead region only, so the relocated mode-binding language is never falsely flagged"
      - "Sections matched by name (optional leading number) + anchor, so the renumber is safe"
---
# Feature Specification: D2-R10 — User-intent framing across the five /design:* commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

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
| **Branch** | `010-user-intent-framing` |
| **Dimension** | D2 — Command Specificity |
| **Enforcement class** | hybrid |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every `/design:*` wrapper opened with implementation framing — a "Thin bridge into the `sk-design` parent skill's `<mode>` mode" lead, then a `## 1. PURPOSE` that pinned the mode ("Pin the `<mode>` mode ... loads the `<mode>` mode directly"). The user read the plumbing before they read whether the command served their job. The cited evidence is `commands/design/interface.md:9`, but the bridge-first lead templated across all five commands.

### Purpose
Invert the framing: each wrapper leads with the user's job (the user-voice "I want to ..." it answers, reconciled with the command's aliases and description), projects that job under a `USER INTENT` section, and relocates the mode-binding mechanics into a distinct `INTERNAL BINDING` section — with the bridge-first phrasing banned from the lead and machine-checked.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `userIntent{ job, ownedSignals }` + a `copyGuard` array to all five records in `command-metadata.json`.
- Reframe the five `commands/design/*.md` wrappers (body-only): replace the bridge-first lead with the user job, rename `## 1. PURPOSE` → `## 1. USER INTENT`, add `## 2. INTERNAL BINDING`, renumber the remaining named sections to §3-§7.
- Extend `design-command-surface-check.mjs` with `validateUserIntent` (Stage 1) and a Stage-2 USER INTENT / INTERNAL BINDING / copyGuard-in-lead body channel.

### Out of Scope
- `mode-registry.json` — read-only alias/intent source; not mutated.
- Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) — frozen so existing drift stays 0.
- The prior D2 sections and fields — preserved, never reshaped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `userIntent{job,ownedSignals}` + `copyGuard` to all 5 records |
| `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md` | Modify | Lead with user job, add USER INTENT + INTERNAL BINDING, renumber (body-only) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add userIntent+copyGuard validation + Stage-2 lead / binding / copyGuard channel |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every record carries a valid `userIntent` + `copyGuard` reconciled with `aliases` | `userIntent.job` non-empty string, `ownedSignals` non-empty unique array with every entry ∈ `aliases`, `copyGuard` non-empty unique array; checker `invalid=0` |
| REQ-002 | Every wrapper leads with its user job and isolates mode-binding | `## 1. USER INTENT` carries the job in the lead region; `## 2. INTERNAL BINDING` present; no `copyGuard` phrase in the lead; checker `drift=0` |
| REQ-003 | The checker enforces the framing | `validateUserIntent` (Stage 1) + Stage-2 USER INTENT / INTERNAL BINDING / copyGuard-in-lead channel land additively; a non-alias signal or a bridge-first lead flips the exit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regression on prior D2 surface | Frontmatter drift stays 0; all 8 named sections survive 5/5; overall `invalid=0 drift=0`, exit 0 |
| REQ-005 | Strictly additive non-mutation | `mode-registry.json` byte-unchanged; exactly 7 files changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` reports `STATUS=PASS ... invalid=0 drift=0`, exit 0.
- **SC-002**: A synthetic break (a `userIntent.ownedSignals` entry that is not one of that record's aliases, a dropped `userIntent`, or a re-introduced bridge-first phrase in a lead) flips the checker to a non-zero exit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `command-metadata.json` SSOT (`aliases`, `description`) | Reconciliation anchors must be present | D2-R3 landed; `ownedSignals ⊆ aliases` verified deterministically; `job ↔ description` verified in authoring |
| Dependency | The prior D2 wrapper sections | The renumber must not drop any | The **renumber is safe** because the checker matches sections by name with an optional leading number (`## (\d+\. )?<NAME>`) and the sibling-discriminator by HTML anchor — only the named headers and anchors are load-bearing, not the numbers; proven by 8 sections surviving 5/5 |
| Risk | copyGuard ban false-positives on relocated mode-binding | INTERNAL BINDING legitimately uses `Pin the` / `loads the` | The **copyGuard scan is scoped to the intent lead region only** (H1 down to the first `## INTERNAL BINDING`), so the relocated language is never flagged |
| Risk | Wrapper frontmatter drift | Touching frontmatter would trip the prior D2 gate | Body-only edits keep frontmatter byte-frozen so existing drift stays 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The surface gate is deterministic and re-runnable on demand; output is sorted and stable.

### Evergreen
- **NFR-E01**: No spec/packet/phase ID or spec-folder path appears in the metadata, the wrappers, or the checker.

### Additivity
- **NFR-A01**: All changes are additive; the prior D2 baseline (`invalid=0 drift=0`) is preserved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Metadata Boundaries
- Non-alias signal: a `userIntent.ownedSignals` entry absent from the same record's `aliases` → Stage 1 INVALID (exit 2), message "userIntent.ownedSignals contains non-alias signal".
- Missing `userIntent` or `copyGuard`: REQUIRED_FIELDS miss → Stage 1 INVALID (exit 2).
- Empty `job` or empty `ownedSignals`/`copyGuard`: shape violation → Stage 1 INVALID (exit 2).

### Surface Boundaries
- Wrapper missing the `USER INTENT` section, the `job` text in the lead region, or the `INTERNAL BINDING` section → Stage 2 drift `field: "user-intent"` (exit 1).
- A `copyGuard` phrase present in the intent lead region → Stage 2 drift `field: "user-intent"` naming the phrase (exit 1).
- Frontmatter touched → existing frontmatter-drift gate fires (exit 1).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 7 files: 1 JSON SSOT, 5 wrappers (body-only + renumber), 1 checker |
| Risk | 12/25 | Renumber across 5 files + lead-region copyGuard scoping; additive, frontmatter frozen, no live mutation outside scope |
| Research | 8/20 | Framing strings pre-authored in plan §3 from research §5 (D2-R10) |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None remaining. Two design questions are resolved and recorded in RISKS above: the copyGuard scan is scoped to the intent lead region only (so the relocated mode-binding language is never falsely flagged), and the §2->§3..§7 renumber is safe because sections are matched by name (optional leading number) + anchor.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFR, edge cases, complexity)
- D2-R10: userIntent + copyGuard metadata + reframed wrapper leads + INTERNAL BINDING section + Stage-1/Stage-2 checker channel
- Strictly additive, mode-registry untouched, frontmatter frozen, renumber safe (8 sections 5/5), final surface-check invalid=0 drift=0
-->
