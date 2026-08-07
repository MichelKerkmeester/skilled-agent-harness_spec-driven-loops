---
title: "Feature Specification: Portability and False-Green Repair"
description: "Seven findings where the code does not merely diverge from a style rule but is non-portable or lies about being verified: hardcoded developer checkout roots, a Python test resolving an advisor from a path that has not existed since the advisor moved, two MCP suites that skip silently and report green for coverage that never ran, a validator that aborts before emitting a verdict, an eval of generated shell assignments, and git-coordination scripts whose missing errexit is deliberate and correctness-critical. Small LOC, high risk — the shell lane mutates git state."
trigger_phrases:
  - "hardcoded checkout root"
  - "silent skip false green test"
  - "errexit git coordination scripts"
  - "flowchart validator no verdict"
  - "portability repair"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/004-portability-and-false-green-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the portability and false-green phase from the track (b) synthesis proposal"
    next_safe_action: "Run T001; this child may start in parallel with child 001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Should the dual-threshold Python test be repointed or retired?"
      - "Do the MCP fixtures move in-tree or become a loud unavailable-fixture contract?"
    answered_questions: []
---
# Feature Specification: Portability and False-Green Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

These seven findings look like small edits and three of them are not. Adding `-e` to the git-coordination scripts is the archetype: those scripts run `set -uo pipefail` deliberately because they tolerate expected non-zero exits from probes, and a blanket errexit will abort a rebase mid-flight. Equally, two MCP Vitest suites currently `skip` when a hardcoded absolute packet path is absent, reporting green for coverage that never ran — repairing them means a skip becomes a failure, which will surface work that was always missing. This child is Level 3 on risk, not on line count.

**Key Decisions**: errexit is adopted command-by-command with each tolerated non-zero exit made an explicit guarded conditional first, never as a blanket flag flip; a skip is a failure for this child.

**Critical Dependencies**: none blocking. This child may run in parallel with child 001.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
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

Four spec-kit audit helpers hard-code the same absolute developer checkout root — seven `/Users/…` literals across four files — so they work on exactly one machine and silently produce wrong or empty results anywhere else, including inside a `git worktree` at a different path. A Python test resolves the skill advisor from `.opencode/skills/scripts/skill_advisor.py`, a path that has not existed since the advisor moved into its own package; the file is absent and the test raises rather than failing cleanly, so it is not part of any package's verification command. Two MCP Vitest suites hard-code an absolute packet path and `skip` when it is not there, which reports green for coverage that never ran — the most expensive kind of false confidence, because it is indistinguishable from a pass on a dashboard. A flowchart validator aborts with exit 1 immediately after "Checking for misaligned boxes…" on any input with no box borders, emitting no verdict at all — reproduced live on a synthetic no-box markdown file. A prerequisites script evaluates generated environment-derived assignments through `eval "$(get_feature_paths)"`. A pre-push test harness runs without errexit.

And three `.opencode/bin` git-coordination scripts run `set -uo pipefail` without `-e`. The alignment verifier reports this as `FAIL` with 3 `SH-STRICT-MODE` errors — reproduced at HEAD in this session — but the omission is deliberate: those scripts tolerate expected non-zero exits from probe commands. Naively adding errexit does not make them conformant; it makes them abort mid-rebase.

### Purpose

Make this code work on any machine and stop it from reporting verification it never performed — repairing each correctness-critical case command by command, so the fix preserves the exit semantics the code actually depends on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Replace the four hardcoded checkout roots with location-derived or argument-derived roots.
- Repoint or explicitly retire the Python test that resolves the advisor from a nonexistent path, and register it in its package's verification command.
- Repair the two MCP Vitest suites so coverage either runs or fails loudly — a skip is a failure for this child.
- Add a no-box regression fixture to the flowchart validator **before** the fix, then make it emit a verdict on every input.
- Replace `eval "$(get_feature_paths)"` with a structured return.
- Adopt errexit in the pre-push test harness.
- Adopt errexit in the three `.opencode/bin` git-coordination scripts **command by command**, guarding each tolerated non-zero exit as an explicit conditional before the flag goes on.

### Out of Scope

- **Headers, strict-mode directives and shebangs** — child 003's, and it explicitly leaves the three git-coordination scripts alone so this child can handle them correctly.
- **Blanket `set -e`** — declined as not behaviour-preserving; the whole point of this child is that the naive form is wrong.
- **Runtime test-harness integrity in the deep-loop runtime** — Vitest double-registration and the `.test.cjs` plus `node --test` runner drift belong to the security register's harness child; this child adopts that program's silent-failure doctrine rather than re-deriving it.
- **The repo-wide test-name vocabulary and the Node runner's discovery contract** — child 001's.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Four spec-kit audit helpers (paths resolved at T001) | Modify | Replace 7 hardcoded `/Users/…` literals with location- or argument-derived roots |
| `test_dual_threshold.py` | Modify/Delete | Repoint at the advisor's real package location and register in that package's verification command, or explicitly retire |
| Two MCP Vitest suites (paths resolved at T001) | Modify | Move fixtures in-tree, or make the unavailable-fixture case an explicit loud failure |
| `validate-flowchart.sh` | Modify | Emit a verdict on every input, including one with no box borders |
| `.opencode/bin/git-sync.sh` | Modify | Guarded errexit adoption, command by command |
| `.opencode/bin/git-live-follow.sh` | Modify | Guarded errexit adoption, command by command |
| `.opencode/bin/worktree-status.sh` | Modify | Guarded errexit adoption, command by command |
| Pre-push test harness (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`) | Modify | Adopt errexit |
| Prerequisites script (path resolved at T001) | Modify | Replace `eval "$(get_feature_paths)"` with a structured return |

### Findings Covered (7)

| ID | Sev | Title | Confirmation status |
|----|-----|-------|---------------------|
| RB-002-03 | P2 | Shell prerequisite setup evaluates generated environment-derived assignments | Unconfirmed by the synthesis author — T001 owns it |
| RB-004-22 | P2 | Flowchart validator exits on an expected no-match pipeline result | **Reproduced live** — exit 1 after "Checking for misaligned boxes…", no verdict emitted |
| RB-005-01 | P1 | Git coordination scripts deliberately omit errexit | **Reproduced at HEAD** — all three are `set -uo pipefail`; `verify_alignment_drift.py --root .opencode/bin` returns FAIL with 3 `SH-STRICT-MODE` errors |
| RB-006-02 | P1 | Pre-push test harness omits errexit | Confirmed by verifier output — `pre-push.test.sh:1 [SH-STRICT-MODE] [WARN]` |
| RB-010-01 | P1 | Spec-kit audit helpers hard-code one checkout root | **Confirmed** — 7 hardcoded literals across four files |
| RB-010-02 | P1 | Dual-threshold test resolves advisor from a nonexistent path | **Confirmed** — resolves `.opencode/skills/scripts/skill_advisor.py`, absent; real file is under the advisor's own package |
| RB-010-03 | P1 | MCP tests use machine-specific spec paths and silently skip coverage | Unconfirmed by the synthesis author — T001 owns it, and must also re-check its interaction with any live spec reorganisation |

**Census note.** The verifier baseline for `.opencode/scripts` also reports two `SH-STRICT-MODE` **errors** on `git-hooks/lib/autostash-orphan-guard.sh` and `git-hooks/lib/memory-drift-marker.sh` that **no finding names**. T001 decides whether they belong here (if their omission is deliberate, like the git-coordination scripts) or to child 003 (if it is simple drift). They must not fall between the two children.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The repaired helpers work from any checkout path | Run them from a temporary `git worktree` at a different path and confirm output identical to a run from the primary checkout |
| REQ-002 | No repaired test may skip | The repaired Python test and both MCP suites execute and pass; a skipped case is recorded as a failure of this child, not a pass |
| REQ-003 | Errexit adoption preserves exit semantics exactly | Failure-injection cases for fetch failure, rebase failure and fast-forward failure in the git-coordination scripts assert the same exit code and the same side effects as before the change |
| REQ-004 | The flowchart validator emits a verdict on every input | The no-box regression fixture, added before the fix, produces a verdict rather than a bare exit 1 |
| REQ-005 | No `eval` of generated assignments remains in the prerequisites script | `grep -n 'eval ' <script>` returns no generated-assignment case; the structured return is covered by a test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The `.opencode/bin` verifier delta is real | `verify_alignment_drift.py --root .opencode/bin` moves from FAIL/3 errors to PASS/0 errors, compared against child 001's captured baseline |
| REQ-007 | Every tolerated non-zero exit is an explicit guarded conditional | For each of the three scripts, a per-command inventory lists which commands may fail, what the tolerated exit means, and the guard now expressing it |
| REQ-008 | The repaired Python test is part of a verification command | The advisor package's documented verification command runs it; running that command exercises the test |
| REQ-009 | Silent-failure doctrine is adopted, not re-derived | The decision record cites the security register's harness child for the doctrine rather than inventing a parallel one |
| REQ-010 | The two unnamed `git-hooks/lib` shell errors are assigned | T001 records which child owns them and why |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four repaired helpers produce byte-identical output when run from the primary checkout and from a `git worktree` at a different path.
- **SC-002**: Zero skipped cases across the repaired Python test and both MCP suites.
- **SC-003**: Failure-injection cases for fetch, rebase and fast-forward failure show unchanged exit codes and unchanged side effects.
- **SC-004**: `verify_alignment_drift.py --root .opencode/bin` reports PASS with 0 errors, against a baseline of FAIL with 3.
- **SC-005**: The no-box flowchart fixture produces a verdict; the fixture is demonstrated failing before the fix.
- **SC-006**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Blanket errexit aborts a rebase mid-flight | High — mutates git state on a developer's working tree | Command-by-command adoption; each tolerated non-zero exit guarded before the flag goes on; failure-injection cases assert unchanged semantics |
| Risk | Repairing a silent skip surfaces a large body of genuinely failing coverage | Medium — may block on work outside this child | Land the loud-failure contract first, triage what it surfaces, and escalate rather than re-muting |
| Risk | The location-derived root resolves differently under a symlinked checkout | Medium | Verify from a worktree *and* through a symlinked path; the defect's own reproduction is the test |
| Risk | Fixing the flowchart validator changes its verdict surface for existing callers | Medium | The no-box fixture lands before the fix; existing callers' expected outputs are captured first |
| Risk | The two unnamed `git-hooks/lib` errors are deliberate like the git-coordination scripts | Medium | T001 reads each script's failure tolerance before deciding which child owns it |
| Dependency | Child 001 | Green — **not blocking**. This child may run in parallel; it does not depend on the comment checker | Uses child 001's baseline for the `.opencode/bin` delta if available, or captures its own and records that it did |
| Dependency | Security register's harness child | Yellow | Adopt its silent-failure semantics; do not re-derive them |
| Dependency | Child 003 | Green | 003 explicitly leaves the three git-coordination scripts alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The git-coordination scripts' wall-clock behaviour is unchanged; guarded conditionals must not introduce extra subprocess invocations in the hot path.
- **NFR-P02**: Repaired test suites must not become materially slower by running coverage that previously skipped — if they do, record the new runtime rather than re-muting.

### Security
- **NFR-S01**: Replacing `eval` removes an injection surface; the structured return must not reintroduce one through word-splitting.
- **NFR-S02**: Location-derived roots must be resolved canonically, so a symlinked checkout cannot escape the intended tree.

### Reliability
- **NFR-R01**: Every script that mutates git state must leave the working tree in a defined state on every failure path exercised by the injection cases.
- **NFR-R02**: A missing fixture must produce a loud failure with an actionable message naming the expected path, never a silent skip.

---

## 8. EDGE CASES

### Data Boundaries
- A checkout path containing a space or a non-ASCII character: the derived root must survive it without word-splitting.
- A `git worktree` whose `.git` is a file rather than a directory: root derivation must handle both forms.
- A symlinked checkout path: canonical resolution, not lexical.
- A flowchart input with zero lines, and one with box characters but no complete box: both must produce a verdict.

### Error Scenarios
- `git fetch` fails: the script must exit with the same code and leave the same state as before errexit was adopted.
- `git rebase` fails mid-way: no new abort path may be introduced; the pre-change behaviour is the specification.
- A probe command returns non-zero as its normal signal: guarded explicitly, never allowed to trip errexit.
- The MCP fixture path is genuinely unavailable in CI: the loud-failure message must name the path and the reason so the failure is actionable.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: ~12, LOC: small |
| Risk | 23/25 | Auth: N, API: N, Breaking: Y — the shell lane mutates git state on a developer's working tree |
| Research | 12/20 | Each tolerated non-zero exit must be understood before it is guarded |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: one external doctrine adoption; one unassigned-file decision shared with child 003 |
| **Total** | **54/100** | **Level 3 by risk override** — LOC alone would suggest Level 1 |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Errexit aborts a rebase mid-flight | H | M | Per-command guarding; failure-injection cases |
| R-002 | Repaired skips surface a wall of real failures | M | H | Triage and escalate; never re-mute |
| R-003 | Root derivation breaks under a symlinked checkout | M | M | Canonical resolution; verified through a symlinked path |
| R-004 | Flowchart verdict surface change breaks a caller | M | M | Capture existing caller expectations before the fix |
| R-005 | Unnamed `git-hooks/lib` errors fall between two children | M | M | T001 assigns them explicitly and records the assignment |
| R-006 | Structured return reintroduces word-splitting | M | L | Quote discipline plus a test with a space-containing path |

---

## 11. USER STORIES

### US-001: The tooling works on my machine too (Priority: P0)

**As a** developer with a checkout at a different path, **I want** the audit helpers to derive their root rather than hard-code one, **so that** they produce correct results instead of silently empty ones.

**Acceptance Criteria**:
1. Given a `git worktree` at an unrelated path, When I run each repaired helper, Then its output is identical to a run from the primary checkout.

### US-002: Green means it ran (Priority: P0)

**As a** reviewer reading a green test run, **I want** an unavailable fixture to fail loudly, **so that** green cannot mean "skipped".

**Acceptance Criteria**:
1. Given a missing fixture path, When the suite runs, Then it fails with a message naming the expected path.
2. Given the repaired suites, When they run normally, Then zero cases are skipped.

### US-003: My rebase is not aborted by a lint fix (Priority: P0)

**As an** operator running the git-coordination scripts, **I want** errexit adopted only where the exit semantics were already checked, **so that** a conformance fix does not abort a rebase.

**Acceptance Criteria**:
1. Given an injected fetch failure, When the script runs, Then its exit code and working-tree state match the pre-change behaviour.
2. Given an injected rebase failure, Then the same holds.

---

## 12. OPEN QUESTIONS

- Should the dual-threshold Python test be repointed at the advisor's real package location, or explicitly retired? Repointing is preferred if the assertions still describe real behaviour; retirement is honest if they do not. Resolved at T001 by reading the test.
- Do the MCP fixtures move in-tree, or does the suite gain an explicit loud unavailable-fixture contract? In-tree is preferable because it removes the dependency entirely; the contract is the fallback where the fixture is genuinely large or generated.
- Do the two unnamed `git-hooks/lib` shell strict-mode errors belong to this child (deliberate tolerance) or child 003 (simple drift)? T001 decides and records.
- Does the MCP suites' absolute-path dependency interact with any in-flight spec reorganisation? T001 re-checks, because the fixture path may be moving underneath the fix.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
