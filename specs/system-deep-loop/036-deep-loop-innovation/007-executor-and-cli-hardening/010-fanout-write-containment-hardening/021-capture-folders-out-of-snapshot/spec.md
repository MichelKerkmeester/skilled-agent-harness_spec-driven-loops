---
title: "Feature Specification: Capture Folders out of the Containment Snapshot"
description: "A fan-out snapshot copied containment capture output into every later baseline, so each run nested the previous captures one level deeper. Tracked capture output grew to 24,582 files under nine roots with paths up to 971 characters, which made git worktree remove fail on a 1,024-character path limit. This phase keeps captures out of the snapshot and out of detection and untracks the capture output."
trigger_phrases:
  - "containment capture snapshot"
  - "capture folders untracked"
  - "worktree remove path limit"
  - "capture never copies capture"
  - "readme verdict baseline parity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Capture Folders out of the Containment Snapshot

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `worktrees/066-ci-cleanup-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-direct-append-sites-through-gateway |
| **Successor** | None |
| **Handoff Criteria** | N/A - last phase of the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the fan-out write-containment hardening specification.

**Scope Boundary**: Only write-containment.ts, its test file, .gitignore, the untrack of the capture output, the sk-doc README baseline, the packet docs and the parent rows may change. Anything outside that list is recorded, not repaired.

**Dependencies**:
- Phase 020-direct-append-sites-through-gateway, the predecessor that routed the direct append sites through the gateway.
- Worktree .worktrees/066-ci-cleanup-follow-ups on branch worktrees/066-ci-cleanup-follow-ups.

**Deliverables**:
- A capture path guard in both the snapshot loop and the detection loop of write-containment.ts.
- Two tests in the baseline content capture group of write-containment.vitest.ts.
- Two ignore patterns in .gitignore, one per capture kind.
- All 24,582 capture files untracked with git rm --cached.
- The sk-doc README verdict baseline pruned from 1,304 entries to 1,058.
- The packet docs and the parent rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fan-out snapshot (snapshotOutOfScopeDirtyPaths in write-containment.ts) copies every untracked path outside a lane into the containment baseline. That included the captures earlier runs had left in the tree, so each run nested the previous captures one level deeper. Commit 3351de5c303 had tracked two research trees lineage capture output and later captures took it to 24,582 files under nine roots with tracked paths up to 971 characters, and inside a worktree those paths pass the macOS 1,024-character path limit, so git worktree remove failed with File name too long on worktree 061 on 2026-09-23 and left the folder behind.

### Purpose
Containment capture output stays out of every later run baseline and out of violation detection, no capture output is tracked, and a worktree of the fixed tree removes cleanly again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A CAPTURE_DIRS list with containment/baseline and the pass quarantine dir plus an isContainmentCapturePath(path) helper in write-containment.ts.
- The snapshot loop skips capture paths after the unattributable skip and the detection forward loop skips capture paths before the baseline lookup.
- Two tests in the baseline content capture group of write-containment.vitest.ts, both red before their guard and green after it.
- Two .gitignore patterns for specs/**/containment/baseline/ and specs/**/containment/quarantine/ with a comment on why.
- The untrack of all 24,582 capture files with git rm --cached.
- The drop of the 246 capture READMEs from the sk-doc README verdict baseline.

### Out of Scope
- The five quarantine generations cited in specs/cli-orca/002-consolidate-official-orca-skills/review/synthesis-remediation-plan.md at line 452 under review/containment/quarantine/ - recorded as a known limitation and the content stays in history.
- The exclude for **/review/containment/** in .github/workflows/dispatch-enforcement-guard.yml - it no longer matches anything in CI and is left in place as harmless.
- Captures already on a local disk from before the fix - filesystem walkers read the disk and not git, so this is recorded and not repaired.
- Rewriting git history to drop the capture content - the content stays in history by design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | A CAPTURE_DIRS list and an isContainmentCapturePath(path) helper guard both the snapshot loop and the detection loop against capture paths |
| `write-containment.vitest.ts` | Modify | Two tests in the baseline content capture group. One proves a capture never copies a capture and one proves an earlier run capture is not reported as a new violation |
| `.gitignore` | Modify | Two patterns, specs/**/containment/baseline/ and specs/**/containment/quarantine/, with a comment on why |
| Capture output under nine roots (24,582 files) | Untrack | git rm --cached on every capture file. The content stays in history |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | The 246 capture READMEs are dropped. 1,304 entries become 1,058 and every other entry is unchanged |
| The packet docs of 021-capture-folders-out-of-snapshot and the parent rows in `../spec.md` | Modify | The packet docs record the phase outcome and the parent rows register phase 21 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The fan-out snapshot never copies a capture folder into the baseline. AC-001 in words: a test proves that a capture folder an earlier run left in the tree is skipped by the snapshot loop. Met, 79 tests passed in write-containment.vitest.ts. |
| REQ-002 | Detection never reports an earlier run capture as a new violation. AC-002 in words: a test proves that capture folders an earlier run left in the tree are not reported as new violations. Met, 79 tests passed in write-containment.vitest.ts. |
| REQ-003 | No capture output is tracked and both capture kinds are ignored. AC-003 in words: git ls-files reports 0 files under both capture kinds and the longest tracked path drops from 971 to 353 characters. Met. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A worktree of the fixed tree removes with a plain git worktree remove. AC-004 in words: a fresh detached worktree of 115,878 tracked files at the final HEAD removes with exit 0 and leaves no folder and no worktree entry. Met. |
| REQ-005 | The sk-doc README verdict baseline stays in parity. AC-005 in words: test_readme_verdict_parity.py reports PARITY PASS over 1,058 files with 0 diffs. Met. |
| REQ-006 | Each guard has a test that failed before it. AC-006 in words: both new tests were red before their guard and pass after it. Met. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No capture path is copied by a later run snapshot and no capture path is reported by a later run detection, proven by the two new tests in the baseline content capture group.
- **SC-002**: No capture output is tracked and a worktree of the fixed tree removes with a plain git worktree remove.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | specs/cli-orca/002-consolidate-official-orca-skills/review/synthesis-remediation-plan.md at line 452 cites five quarantine generations under review/containment/quarantine/ that are now untracked | Low | Recorded, not fixed. The content stays in history |
| Risk | .github/workflows/dispatch-enforcement-guard.yml excludes **/review/containment/** from the dispatch audit suite and the exclude no longer matches anything in CI | Low | Harmless and left in place |
| Risk | Filesystem walkers such as the trigger-index generator read the disk and not git, so ignored captures on a local disk can be picked up by a local regeneration | Medium | Recorded, not fixed |
| Risk | Captures already on a local disk from before the fix stay on that disk | Medium | The .gitignore rules keep them untracked. A local regeneration can still pick them up, so this is recorded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - insufficient source context
- **NFR-P02**: N/A - insufficient source context

### Security
- **NFR-S01**: N/A - insufficient source context
- **NFR-S02**: N/A - insufficient source context

### Reliability
- **NFR-R01**: N/A - insufficient source context
- **NFR-R02**: N/A - insufficient source context
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A - insufficient source context
- Maximum length: N/A - insufficient source context
- Invalid format: N/A - insufficient source context

### Error Scenarios
- External service failure: N/A - insufficient source context
- Network timeout: N/A - insufficient source context
- Concurrent access: N/A - insufficient source context

### State Transitions
- Partial completion: N/A - insufficient source context
- Session expiry: N/A - insufficient source context
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | N/A - insufficient source context | N/A - insufficient source context |
| Risk | N/A - insufficient source context | N/A - insufficient source context |
| Research | N/A - insufficient source context | N/A - insufficient source context |
| **Total** | **N/A - insufficient source context** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


