---
title: "Feature Specification: Phase 23: deep-review-remediation"
description: "The 2026-10-27 two-lineage deep review of packet 054 left two confirmed P1 defects, a placeholder fence miss and a --path symlink escape, plus nine P2 findings in records, docs and code. This phase fixes all of them."
trigger_phrases:
  - "deep review remediation"
  - "phase 23 deep review remediation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 24 |
| **Predecessor** | 022-advisor-routing-and-local-install |
| **Successor** | 024-typed-command-ambiguity |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of packet 054. It fixes every finding of the deep review run after phase 22.

**Scope Boundary**: only the eleven findings in `../review/review-report.md` and the records that name them. No new behavior beyond what a finding needs.

**Dependencies**:
- The adjudicated review report `../review/review-report.md` and the merged registry beside it.

**Deliverables**:
- Two P1 code fixes with tests that fail first, the P2 code fixes, the doc and record corrections, and the phase 020 audit dispositions.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The placeholder gate treats ``` and ~~~ as one fence marker, so a ``` line inside a ~~~ block hides an unfilled value token later in a v2.3 doc. `create.sh --path` checks only the parent of an existing symlink, so a packet can be written outside the repository. Nine P2 findings leave records, docs and one memory path out of step with the shipped code.

### Purpose
Every finding of the 2026-10-27 review is fixed or recorded with its reason, and each code fix has a test that fails without it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type review --artifact-dir specs/system-speckit/054-weak-model-spec-authoring/review
{"status":"ok","loop_type":"review","merged_lineages":2,...,"merged_verdict":"CONDITIONAL","active_p0":0,"active_p1":4}
$ grep -n 'TOKEN_GATE_FENCE_RE\s*=' .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts
794:const TOKEN_GATE_FENCE_RE = /^\s*(```|~~~)/u;
$ sed -n '1240,1242p' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh
        exit 1
    fi
    resolved_target="$resolved_parent/$(basename "$candidate")"
```
The conductor's check kept two of the four P1s and moved two to P2, for 2 P1 and 9 P2 (`../review/review-report.md`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Close a token-gated fence only on its own marker type, in the orchestrator and the shell rule.
- Resolve an existing `--path` target before the containment check in `create.sh`.
- Snapshot only the file types the Draft repair writes, by digest.
- Correct the records and docs the P2 findings name, and give each phase 020 audit finding a disposition.

### Out of Scope
- The legacy (pre-v2.3) fence toggle - changing it would alter verdicts of existing packets, which D2 forbids.
- Refusing a symlinked `--track` - it is a deliberate, tested design; REQ-001 of phase 010 is narrowed instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Fence matching, repair snapshot |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Modify | Fence matching, header, dead branch |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Resolve an existing `--path` target |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Recursive auto-repair sentence |
| `.skilled/commands/speckit/{plan,implement,complete}.md` | Modify | Warn-only rule sentence without changelog tense |
| `../goal.md`, `../spec.md`, `../010-*/spec.md`, `../021-*/*` | Modify | Phase set, push record, REQ-001, commit state |
| `../020-alignment-audit-fixes/scratch/audit/findings.json` | Modify | Disposition per finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In a v2.3 doc, a ``` line inside a ~~~ fence no longer closes it, and an unfilled value token after the fence is reported by both the orchestrator and the shell rule (SOL-002). |
| REQ-002 | `create.sh --path` naming an existing symlink whose target is outside the repository exits non-zero and writes nothing there; a new path under the repository still works (SOL-003). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The Draft repair snapshot reads only the file types the repair writes and keeps a digest, not the bytes (F2-P2-001). |
| REQ-004 | The shell placeholder rule's header says truthfully what runs it, and its unreachable Draft-token branch is gone (F1-P2-002, F1-P2-003). |
| REQ-005 | `validation-rules.md` states that a recursive run repairs each Draft child (F1-P1-001), and the three `/speckit:*` docs describe the warn-only rules without changelog tense (F1-P2-004). |
| REQ-006 | Phase 010 REQ-001 matches the shipped `--track` behavior (SOL-001); the parent goal, spec and phase 021 records match the repository (SOL-004, F3-P2-001); every phase 020 audit finding carries a disposition (F3-P2-002). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new fence and `--path` tests fail on the old code and pass on the new.
- **SC-002**: `validate.sh specs/system-speckit/054-weak-model-spec-authoring --strict --recursive` prints `RESULT: PASSED` for every folder, and the spec-kit runtime suite has no new failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The spec-kit runtime build | Tests of the compiled validator read stale code | Rebuild before the suite runs |
| Risk | A stricter fence rule flips a verdict on an existing v2.3 doc | Med | Run the strict census over `specs/` and compare with the phase 022 tree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the change is a validator and scaffolder fix with no service, and the snapshot change only lowers memory.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a doc with no fence keeps today's findings.
- Maximum input: a four-backtick fence holding a three-backtick line stays open until a four-or-more-backtick line closes it.
- Failure path: a dangling `--path` symlink exits non-zero with the outside-repository message.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 12 files, two scanners and one bash resolver |
| Risk | 8/25 | Validator verdicts; guarded by the census |
| Research | 4/20 | Findings arrive adjudicated |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose on 2026-10-27 to narrow phase 010 REQ-001 rather than refuse symlinked tracks.
<!-- /ANCHOR:questions -->
