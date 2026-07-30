---
title: "Feature Specification: Comment Hygiene — Durable WHY"
description: "Code comments across the deep-loop scripts, documentation tooling, benchmark rigs, runtime hooks and the MCP save handler embed ephemeral-artifact pointers — requirement ids, phase pointers, packet directory names, spec numbers and feature-catalog entries — which the standard names a HARD-BLOCK gate. This phase replaces each pointer with the durable behavioural reason it stood in for, deleting the comment where that reason is not recoverable from the code. Comment-only diffs; no executable line changes."
trigger_phrases:
  - "ephemeral artifact pointer in comment"
  - "comment hygiene durable why"
  - "replace requirement id comment"
  - "feature catalog comment"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/002-comment-hygiene-durable-why"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the comment-hygiene phase from the track (b) synthesis proposal"
    next_safe_action: "Wait for child 001 to land the repaired checker and the generic-label boundary, then run T001"
    blockers:
      - "Blocked on child 001: the repaired checker and the generic-label semantic boundary"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Q2 - do the five non-runtime deep-loop findings belong to this program or to 020?"
    answered_questions: []
---
# Feature Specification: Comment Hygiene — Durable WHY

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-code/021-code-conformance-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The governing standard states verbatim that ephemeral-artifact pointers in code comments are a **HARD-BLOCK gate**, naming spec paths and ADR, requirement, checklist, task, packet and phase identifiers. Those pointers are nonetheless live across the tree: requirement identifiers appear six times in the agent-improvement scripts; a phase pointer names a capability-matrix document inside a numbered packet directory from a runtime hook; archive and snapshot comments in the documentation tooling name renumberable packet directories; a benchmark loop comment points into a packet spec; a plugin regression test comment names archived packet identifiers; a performance pattern asset carries a spec-local provenance pointer; and the MCP save handler carries four `Feature catalog:` comments that the checker has no rule for at all.

Every one of these is a pointer to something that will be renamed, renumbered, archived or deleted. When that happens the comment does not merely go stale — it actively misdirects the next reader toward a path that no longer exists, while the behavioural reason the comment was written for goes unrecorded. The pointer is standing in for a WHY that was never written down.

### Purpose

Replace each ephemeral pointer with the durable behavioural reason the surrounding code implies, so the comment survives every renumbering; where that reason is not recoverable from the code, delete the comment rather than paraphrase a guess.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Replacement of every ephemeral-artifact pointer in a code comment across the ten owned findings, plus execution of the four-line `Feature catalog:` edit whose checker-rule half belongs to child 001.
- Comment-only diffs, verified as comment-only by a scripted assertion, not by eyeball.
- Deletion, rather than paraphrase, of any comment whose durable reason cannot be recovered from the code it annotates.
- A per-file before/after violation count from the repaired checker.

### Out of Scope

- **Any executable line change** — if a comment's removal would change behaviour, the file is escalated, not edited.
- **The checker rules themselves** — child 001 owns the rule engine; this child only satisfies it.
- **Prose in `README.md` or reference documentation** — a different track owns documentation content; no `README.md` is touched here.
- **`system-deep-loop/runtime/**`** — owned by 020.
- **Files on the security register's active work list** — this child's edits to a shared file land after that program's child, per the file-level collision protocol.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/**` | Modify | Replace six requirement-identifier comments with the behavioural reason each guards |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/**` | Modify | Replace the ephemeral phase pointer |
| `.opencode/skills/sk-doc/scripts/quick_validate.py` | Modify | Replace the packet-local pointer in validator documentation |
| `.opencode/skills/sk-doc/sk-create-benchmark/scripts/*.cjs` | Modify | Replace archive and snapshot comments naming renumberable packet directories |
| `.opencode/skills/sk-prompt/sk-prompt-models/benchmarks/**/loop.cjs` | Modify | Replace the comment pointing into a packet spec |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Modify | Replace the embedded phase-path pointer at lines 5-6 |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Replace archived-packet identifiers in the regression test's comments |
| `.opencode/skills/sk-code/sk-code-webflow/assets/patterns/performance-patterns.js` | Modify | Replace the spec-local provenance pointer |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | Modify | Replace the four `Feature catalog:` comments at lines 212-215 |

### Findings Covered (10)

| ID | Sev | Title | Confirmation status |
|----|-----|-------|---------------------|
| RB-003-02 | P1 | Agent-improvement comments embed requirement-local identifiers | Confirmed — six hits at the cited lines |
| RB-003-03 | P1 | Skill-benchmark comments depend on an ephemeral phase pointer | Unconfirmed by the synthesis author — T001 owns it |
| RB-004-08 | P1 | Packet-local pointer remains in validator documentation | Unconfirmed — T001 owns it |
| RB-004-09 | P1 | Archive comments embed ephemeral runtime packet identifiers | Unconfirmed — T001 owns it |
| RB-004-10 | P1 | Snapshot comments embed renumberable activation packet identifiers | Unconfirmed — T001 owns it |
| RB-004-11 | P1 | Benchmark loop comment points into a packet spec | Unconfirmed — T001 owns it |
| RB-006-03 | P1 | Comment checker misses a phase-path pointer | Confirmed — embedded at lines 5-6 |
| RB-006-04 | P1 | Plugin regression test comment embeds archived packet identifiers | Unconfirmed — T001 owns it |
| RB-007-03 | P2 | Performance pattern embeds a spec-local provenance pointer | Unconfirmed — T001 owns it |
| RB-008-05 | P2 | Ephemeral provenance comments recur outside checker vocabulary | Unconfirmed — T001 owns it; pattern anchor, so its work list is the checker's own output, not a fixed file list |

*This child also executes the four-line comment edit for **RB-002-02**, whose checker-rule half is owned by child 001 and is not double-counted here.*

**[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** RB-003-02 and RB-003-03 sit in `system-deep-loop/deep-improvement/scripts/**`. This spec claims them on the reading that 020 owns `runtime/**` only. If the operator rules that 020 covers the whole skill, both findings move to 020 and this child's count drops to 8.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No touched file contains an ephemeral-artifact pointer in a comment | The repaired checker returns clean on every touched file and on the staged set |
| REQ-002 | Every diff is comment-only | A scripted assertion confirms each changed hunk falls entirely inside a comment; any hunk that does not blocks the file |
| REQ-003 | No file's behaviour changes | Parse check per file, plus the owning-package suite for the two files that are themselves tests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each replacement states a durable reason, not a renamed pointer | Review confirms no replacement comment names a directory, packet, phase, requirement, task or checklist identifier |
| REQ-005 | Unrecoverable reasons produce a deletion, not a guess | Every deleted comment is listed with the reason it could not be recovered from the code |
| REQ-006 | The violation count moves in the right direction and only there | Baseline/delta on the checker's violation count: N closed, zero introduced |
| REQ-007 | Shared-file sequencing is respected | For each touched file, evidence that it is not on the security register's active work list, or that the other child landed first |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The repaired comment checker returns clean on every file this child touched, and on the full staged set at commit time.
- **SC-002**: `git diff --stat` plus the comment-only assertion show zero executable lines changed.
- **SC-003**: The two touched test files still pass their owning suites.
- **SC-004**: The checker's repo-wide violation count drops by exactly the number of pointers closed, with zero new violations introduced.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A "comment-only" edit inside a template literal or heredoc changes emitted output | High | The comment-only assertion is scripted, and every touched file gets a parse check; template-literal contexts are called out per file in `plan.md` |
| Risk | Replacing a pointer with a paraphrase that is subtly wrong | Medium | Where the reason is not recoverable from the code, delete rather than paraphrase, and list the deletion |
| Risk | Racing the security register's rewrites on shared deep-loop files | Medium | Sequencing rule: this child's edit to a shared file lands after that program's child |
| Dependency | Child 001 | Red | The repaired checker and the generic-label semantic boundary do not exist until 001 lands |
| Dependency | Operator decision Q2 | Yellow | Two findings' ownership is unsettled; the rest of the work list is unaffected |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance impact is possible — comment-only edits do not change emitted behaviour. Confirmed by the comment-only assertion rather than assumed.
- **NFR-P02**: The checker's full-tree run stays within the time budget the pre-commit hook already imposes.

### Security
- **NFR-S01**: No comment replacement may introduce a credential, an absolute developer path, or an internal URL.
- **NFR-S02**: Deleting a comment must not remove a security-relevant warning; any comment that documents a hazard is rewritten, never deleted.

### Reliability
- **NFR-R01**: Every touched file parses after the edit, verified per file rather than per batch.
- **NFR-R02**: The two files that are themselves tests still exercise the same assertions after their comments change.

---

## L2: EDGE CASES

### Data Boundaries
- A pointer inside a template literal, heredoc, or embedded documentation string is **not** a comment; touching it changes output and is out of scope for this child.
- A pointer inside a test fixture's expected-output string is subject data, not a comment.
- A comment that names a durable external standard (an RFC, a language specification) is permitted and must not be removed.

### Error Scenarios
- The durable reason is not recoverable from the code: delete the comment and record why, rather than inventing a rationale.
- Removing the comment would orphan a nearby directive comment (a lint suppression, a type assertion): keep the directive, replace only the prose.
- The checker flags a replacement comment: the replacement itself embedded a pointer; rewrite before proceeding.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Files: ~12-15, LOC: small, Systems: 6 packages |
| Risk | 10/25 | Comment-only by construction, but a hard-block gate class and two test files are involved |
| Research | 8/20 | Each replacement requires recovering a behavioural reason from the surrounding code |
| **Total** | **27/70** | **Level 2** |

---

## 10. OPEN QUESTIONS

- **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** Do RB-003-02 and RB-003-03 belong to this program or to 020? *Recommendation: this program; 020's own wording scopes it to `runtime/**`.*
- For RB-008-05, which is a pattern anchor rather than a fixed file list: is the checker's own repo-wide output the authoritative work list for this child, or only the named instances? T001 resolves this by running the repaired checker and reconciling its output against the nine named findings.
- Which of the touched files are on the security register's active work list at execution time? T001 diffs the two lists.
<!-- /ANCHOR:questions -->
