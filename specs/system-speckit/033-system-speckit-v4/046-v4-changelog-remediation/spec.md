---
title: "Feature Specification: v4 changelog remediation (the 045 research pass)"
description: "Implements the accepted 045 research report (research/research.md Sections 7, 9, 10, 13) against the pinned v4 changelog: the eight path/consistency corrections, the internal Six/Seven and naming fixes, the five count dispositions, and the structural re-order into the report's target outline, with the skeleton counts recorded as baseline-plus-delta."
trigger_phrases:
  - "v4 changelog remediation"
  - "changelog structural edits"
  - "045 research implementation"
  - "changelog count dispositions"
  - "changelog corrections"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/046-v4-changelog-remediation"
    last_updated_at: "2026-09-21T13:32:32Z"
    last_updated_by: "pi-agent"
    recent_action: "Applied the 045 report; all gates green"
    next_safe_action: "None: the packet is complete; the push grant is the only outstanding item"
    blockers: []
    key_files:
      - "../CHANGELOG-v4.0.0.0.md"
      - "scratch/apply-structure.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-21-v4-changelog-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: v4 changelog remediation (the 045 research pass)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 46 of 46 |
| **Predecessor** | 045-v4-changelog-voice-rewrite |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh 046-v4-changelog-remediation --strict` passes, the census/HVR/semicolon gates hold, the report's Section 10-E checks pass, and the count record exists in this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 46** of the v4 packet set, the remediation of the release notes under `033-system-speckit-v4`.

**Scope Boundary**: the changelog, the 033 bookkeeping (parent spec.md rows, timeline milestone, derived metadata), and this packet. The 045 packet stays frozen (Complete); the `sk-create-changelog` skill, the root README, and `.pi/` are read-only; `.pi/settings.json` (a concurrent runtime artifact) stays unstaged.

**Dependencies**:
- The accepted 045 research report: `../045-v4-changelog-voice-rewrite/research/research.md` (Sections 7, 9, 10, 13), anchored to the pinned changelog.

**Deliverables**:
- The remediated changelog, this packet with its evidence, and the parent bookkeeping.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 045 research report established that what still costs the reader is structure and facts, not sentence shape: six `.opencode/*` path mentions are dead at HEAD, the document contradicts itself on the CLI-orchestrator count (Six at L730 vs Seven at L274/L310/L314), counts have drifted (278 commits exist where it says 266; the symlink count measures 101 where it says 102; "178 recommendations" is non-re-derivable), the glance list duplicates the README at five times its volume, and the section order ignores the priorities the root README itself declares.

### Purpose

Apply the report's Sections 7, 9, 10 and 13 exactly, so the changelog reads in the report's target shape with its corrections, its quality gates still true, and the counts recorded as baseline-plus-delta.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Pass A (report 10-A): the eight path/consistency corrections — L101, L188, L463, L660, L716, L717, L168 (verify-only), L742.
- Pass B (report 10-B): Six→Seven at L730, the F-010 agent clause, the F-011 quality-packet spelling, the two F-016 sentence fixes, the F-016 prose trims at their eight listed lines.
- Pass C (report 10-C): the five count dispositions — 178 dropped (L295), 21-ids / 18-of-22 / forked-caches softened (L274 / L35 / L393), 102 dropped or softened (L463).
- Pass D (report 10-D, toward Sections 7 + 9): merge `One Shape for Every Skill` into `Why This Release`; compress the glance 31 → about 15 bullets; reorder to the F-018 order; collapse `Internal Seams` into `Appendix: Under the Hood`; drop `After This Draft` with its four facts deposited to their 033 owners and the two no-owner classes to component records; the report's listed H4 folds.
- Pass E (report 10-E): the post-edit checks; the count record (pinned 18/56/19/44 baseline + measured deltas, F-027 reading A — no REQ-005 amendment to 045); the gates: census 0 walls, HVR 0 hard blockers, semicolons only inside `&nbsp;`.
- The 033 parent: phase-map row 46 and its handoff row (filled), the timeline milestone, derived metadata.

### Out of Scope

- The 045 packet — Complete and frozen; its REQ-005 counts are recorded here as a baseline, not amended (F-027).
- The `sk-create-changelog` skill and template — read-only instruction surface.
- The root README and every other tracked file — a concurrent writer owns them; only `.pi/settings.json` must stay unstaged.
- Pushing to origin — granted separately, after the local commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ../CHANGELOG-v4.0.0.0.md | Modify | Corrections, count dispositions, structural re-order |
| ../spec.md | Modify | Phase-map row 46 and its handoff row (placeholders filled) |
| ../timeline.md | Modify | Phase 46 milestone |
| spec.md, plan.md, tasks.md, implementation-summary.md | Create | This packet |
| scratch/* | Create | changelog-before.md + its sha, facts extraction, the count record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sentinel: before any edit, the changelog hashes to the report's pin, and a before-copy is archived | `shasum -a 256` prints `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`; `scratch/changelog-before.md` exists and hashes identically |
| REQ-002 | The eight report 10-A corrections applied at their lines (L168 verify-only: edit only if it fails) | Each cited line reads the report's corrected target; `node .opencode/bin` and `.opencode/hooks` return 0 hits in the changelog |
| REQ-003 | Report 10-B applied: Six→Seven at L730, the F-010 agent clause, the F-011 spelling, the two F-016 sentence fixes, the F-016 trims at their eight listed lines | The CLI-orchestrator statement reads Seven; no other line moves beyond the enumerated edits |
| REQ-004 | The five report 10-C count dispositions applied | The 178/266/102-class counts are dropped or softened to role language; no new fragile count introduced |
| REQ-005 | The structural pass: F-018 order + Section 9's outline; glance ≤16 bullets; `One Shape` merged; `Internal Seams` → `Appendix: Under the Hood`; `After This Draft` dropped with its facts deposited to their owners | The H2 sequence matches the report's Section 7 table; the extraction diff shows only the enumerated deltas |
| REQ-006 | The 045 gates still hold after the structural edits | Census: 0 walls; HVR: 0 hard blockers; semicolons only inside `&nbsp;` lines |
| REQ-007 | The count record: the pinned 18/56/19/44 recorded as the pre-change baseline; the measured post-edit counts and deltas recorded in this packet | The record appears in this spec and the implementation summary; 045's REQ-005 is not amended |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The 033 parent bookkeeping: phase row 46 and handoff filled, timeline milestone, derived metadata refreshed | `validate.sh` passes for 046; the parent's rows read the shipped work, not placeholders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The report's 10-A/B/C/D/E passes are applied, and every 10-E check passes.
- **SC-002**: Census 0 walls; HVR 0 hard blockers; 0 semicolon lines outside `&nbsp;` lines.
- **SC-003**: The structural result matches the report's Section 7 order and Section 9 outline.
- **SC-004**: `validate.sh 046 --strict` returns RESULT: PASSED, Errors 0, Warnings 0; the 033 parent's own block passes (the known 030 failure disclosed, untouched).
- **SC-005**: One local commit on `skilled/v4.0.0.0`; its scope is the changelog + 033 bookkeeping + 046/** only; the template and 045 are untouched; `.pi/settings.json` stays unstaged; nothing pushed.
- **SC-006**: The count record: baseline 18/56/19/44, the measured post-edit counts, and the deltas explained.

### Count Record (the REQ-007/SC-006 evidence, reading A of F-027: 045's REQ-005 is not amended)

| Measure | 045 pin (pre-change) | Measured post-edit | Delta | Why |
|---------|----------------------|--------------------|-------|-----|
| H2 | 18 | 17 | -1 | `One Shape for Every Skill` merged into `Why This Release` and `After This Draft` dropped; `Internal Seams` renamed to `Appendix: Under the Hood` (a rename, not a removal) |
| H4 | 56 | 55 | -1 | The Pi-Dispatches-Pi / A-Closed-Roster fold: two H4s became one, titled `A Closed Roster`, with the roster mechanism paragraph moved to the appendix |
| `---` | 19 | 18 | -1 | The dropped After This Draft took its section separator with it |
| `&nbsp;` | 44 | 43 | -1 | Every `&nbsp;` separates a paragraph from the next H4; the fold removes exactly one such boundary, and the merged heading takes the section's first-H4 slot, which the measured convention leaves without a spacer |
| Lines | 747 | 722 | -25 | The glance went from 29 bullets to 15; One Shape, After This Draft and the eight repeated Internal Seams bullets went away |

- Baseline: sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19` (the 045 REQ-005 pin), 747 lines, 18/56/19/44. Intermediate post-correction state: sha256 `6e28071fd0c1f66b69947c00ff786981d62983314d474df3aee2cbfe532107ea`, 747 lines, counts unchanged 18/56/19/44 — the correction pass moved no structure. Final: sha256 `e3b1b5c1ede77ef5728caa27e13a0face01412cb40ea03c476a4001b407e42b6`, 722 lines, 17/55/18/43. The deltas come entirely from the structural pass.
- Count dispositions: 178, 102 and 266 are 0 hits; the glance's 18-of-22 bullet was softened to role language and then compressed away, so the count survives exactly once (Hermes body); the Cursor 21-ids and forked-cache counts stay verbatim per F-023's operative table.
- Standing gates after the structural pass: census 0 walls; HVR 0 hard blockers (-20 deductions, 80/100; the 045 baseline was -22/78); 0 semicolon lines outside `&nbsp;` (43 entity lines, 0 others).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The pinned changelog (sha256 `33abcc9a…`) | If it moves, every report L-number goes stale | Sentinel check before the first edit; on mismatch, stop and re-derive F-024 |
| Risk | F-024's anchors are whole-line, not string-unique | A blind edit hits the wrong site | Verify each targeted line before editing; whole-line anchors only |
| Risk | The structural pass shifts later line numbers | Report L-numbers go stale mid-pass | Corrections (A/B/C) before structure (D); in D, locate by content, not line number |
| Risk | A concurrent writer touches tracked files | Unrelated changes slip into the commit | Stage explicit paths; check `git status` before the commit |
| Dependency | The 030 SPECDOC_SUFFICIENCY_005 failure | Recursive 033 validation reports one failing child | Disclose; it is pre-existing and outside this scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
