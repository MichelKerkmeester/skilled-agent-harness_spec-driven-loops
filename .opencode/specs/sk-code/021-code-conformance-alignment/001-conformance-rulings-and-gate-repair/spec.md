---
title: "Feature Specification: Conformance Rulings and Gate Repair"
description: "The three mechanisms that were supposed to enforce the sk-code code-opencode standard all failed at once: the live post-edit hook stopped parsing, the mandated completion gate scans only one skill tree, and header shape is documented as a permanently manual gate. This phase repairs the enforcement mechanism, closes the comment checker's vocabulary holes with paired fixtures, amends the one documented rule that describes a repository that does not exist, and records six binding scope rulings so no later child re-litigates them. No code sweep runs in this phase."
trigger_phrases:
  - "repair comment hygiene gate"
  - "three guard drift verifier scope"
  - "amend test filename vocabulary"
  - "conformance scope rulings"
  - "post-edit hook dead"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the scoped gate repairs, formalized rulings, and captured failing/full gate evidence"
    next_safe_action: "Verifier to attack the remaining live Write smoke and repo-wide gate backlog"
    blockers:
      - "The live Write-tool smoke was not available to this BUILD leaf"
      - "The widened alignment and router-sync guards still fail on pre-existing backlog/environment"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "frozen-directory-manifest.md"
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Q2 - 020 owns runtime/** only"
      - "Q4 - exact-header checking is opt-in"
      - "Q5 - repository-wide scan with --fail-on-warn withheld"
---
# Feature Specification: Conformance Rulings and Gate Repair

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

Every gate that was supposed to keep this repository conformant to the sk-code `code-opencode` standard was blind at the same time, and the drift population is the consequence rather than the cause. This phase makes the gate real before any batch touches code: it reconciles the duplicated hook pairs down to one installed path each and corrects the standard's pointers to name it, decides and records whether the three-guard completion wrapper should look beyond one skill tree, closes three vocabulary holes in the comment checker behind paired positive/negative fixtures, amends the documented test-filename vocabulary to the convention the repository and its own verifier already use, and records six binding scope rulings.

**Key Decisions**: header shape becomes an opt-in automated check rather than a permanently manual gate (Q4); the three-guard wrapper widens its scan root with warnings non-blocking until the sweep lands (Q5).

**Critical Dependencies**: none inbound. This phase **blocks 002, 003 and 005**; child 004 may run in parallel.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-code/021-code-conformance-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three enforcement mechanisms for the `code-opencode` standard failed independently and simultaneously, and nothing noticed. **First**, the Claude post-edit quality adapter at `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` carried unresolved merge-conflict markers leaked in by a consolidation merge; `node --check` failed with `SyntaxError: Unexpected token '<<'`, and `.claude/settings.json:175` invokes exactly that path on every `Write|Edit`. The comment-hygiene hard gate was dead on the Claude runtime. *That specific breakage was hotfixed and landed as commit `a83080a83b`; `node --check` on the file is now green. What remains is that nothing would have caught it.* **Second**, `run-all-drift-guards.sh:47` invokes the alignment verifier as `--root "${SK_CODE_DIR}"`, and `SK_CODE_DIR` resolves at line 23 to `.opencode/skills/sk-code`, so the rule that every system-code completion claim must run the three-guard entry point has verified sk-code's own tree and nothing else. **Third**, exact header shape, naming, comment quality, and module/package-boundary choice are documented as permanently manual gates, so a mechanical `PASS` never meant conformance — running the verifier against `.opencode/commands/doctor/scripts` returns `PASS` on twelve files while two header-less `.cjs` diagnostics in that same set go unreported.

Two further defects compound this. The standard's own enforcement pointers are wrong: `naming-and-commenting.md:243-244` cites `.opencode/hooks/git/pre-commit` and `sk-code-quality/scripts/hooks/claude-posttooluse.sh`, while the installed hook is `.git/hooks/pre-commit → .opencode/scripts/git-hooks/pre-commit` — a different, larger file — and the wired post-edit adapter is the `.cjs`. Two pre-commit files and two post-edit adapters coexist. And the comment checker's vocabulary has holes: it carries no rule for `Feature catalog:` comments (four are live in the MCP save handler), and it matches three-digit `phase[\s-]\d{3}` and `specs/…` paths while missing generic `Phase 0` and `spec 019` forms.

Separately, the documented test-filename vocabulary at `directory-and-test-conventions.md:292-295` names `*.test.js` — which matches **0** files at HEAD — and omits `*.vitest.ts`, which matches **1,228**. The runner configs and the alignment verifier already recognise the real convention. Here the standard, not the code, is the nonconforming artifact.

### Purpose

Make the gate real and settle the rulings, so that every subsequent child's conformance claim is a verifiable delta against a captured baseline rather than a bare `PASS`, and so that no later child spends its budget re-arguing scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reconcile the two coexisting pre-commit files and the two coexisting post-edit adapters down to one installed path each, and correct the standard's enforcement pointers to name it.
- Add a regression fixture that fails when the post-edit adapter stops parsing, so the failure mode that produced the dead gate is caught next time.
- Decide and record the three-guard wrapper's scan root, and implement the decision **[OPERATOR-DECISION: Q5 — three-guard scan scope]**.
- Decide and record whether exact header shape becomes an opt-in automated verifier check **[OPERATOR-DECISION: Q4 — exact-header automated check]**.
- Close three comment-checker vocabulary holes, each behind a paired positive/negative regression fixture demonstrated failing before its rule lands.
- Amend `directory-and-test-conventions.md` to adopt the real test-filename vocabulary, define one canonical discovery contract across `run-node-tests.mjs` and the Vitest configs including `.opencode/hooks`, and add a discovery canary.
- Record the six binding scope rulings and the two-lane worklist doctrine as decision-record entries.
- Capture the program baseline: the drift verifier's output per lane root, recorded as the number every later child reports its delta against.
- Apply the border amendment to `020-sk-code-opencode-alignment` **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]**.

### Out of Scope

- **Any code sweep** — this phase builds the gate; children 002-005 use it. Touching a drift instance here would land it outside its lane's blast-radius gate.
- **Filename migration** — no `*.vitest.ts` file is renamed; §3.4 of the governing ruling set amends the standard instead.
- **Blanket regex broadening in the comment checker** — the generic-label matcher only widens after the semantic boundary is written into the decision record with fixtures.
- **`system-deep-loop/runtime/**`** — owned by 020.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | Modify | Add or wire the parse-integrity regression fixture; the merge-marker repair itself already landed as `a83080a83b` |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Confirm as the single installed pre-commit path; absorb any rule the other file uniquely carries |
| `.opencode/hooks/git/pre-commit` | Modify/Delete | Retire or explicitly document as non-installed, per the reconciliation decision |
| `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh` | Modify/Delete | Same reconciliation for the post-edit adapter pair |
| `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modify | Add the feature-catalog rule, the numeric-hyphen phase-path shape, and the bounded generic-label rule |
| `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` | Modify | Paired positive/negative fixtures for each new rule |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md` | Modify | Correct the enforcement pointers at lines 243-244 |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` | Modify | Amend the test-filename table and add the discovery contract |
| `.opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | Scan-root change per Q5 |
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | Opt-in exact-header flag per Q4 |
| `.opencode/scripts/run-node-tests.mjs` | Modify | Canonical discovery contract; include `.opencode/hooks`; recognise `.test.cjs` |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment/spec.md` | Modify | Border amendment per `020-amendment.md` |
| `decision-record.md` | Create | Six rulings, the two-lane doctrine, the Q4/Q5 decisions, the generic-label semantic boundary |

### Findings Covered (14)

| ID | Sev | Title | Confirmation status |
|----|-----|-------|---------------------|
| RB-002-01 | P1 | Live Claude post-edit adapter contains unresolved merge markers | Confirmed; the marker removal landed as `a83080a83b` — this phase owns only the regression fixture |
| RB-002-02 | P1 | Feature-catalog comments bypass the hard comment-hygiene gate | Confirmed — four `Feature catalog:` comments live; checker has zero matching rule. Checker-rule half owned here; the four-line edit is executed in 002 |
| RB-002-12 | P2 | Repository test naming is broader than the documented standard | Confirmed by census |
| RB-002-13 | P2 | Generated dist requires a separate freshness and parity lane | Confirmed as a ruling, not a defect — `dist/` carries zero tracked files |
| RB-003-01 | P1 | Planned runtime phase excludes the remaining system-deep-loop code | Confirmed against 020's Non-Goals and Out of Scope |
| RB-003-04 | P1 | Documented test naming excludes the dominant live conventions | Confirmed |
| RB-003-05 | P1 | Mechanical PASS does not clear manual conformance blockers | Confirmed and reproduced — `PASS`, 12 files, 1 warning, with two header-less `.cjs` unreported |
| RB-004-24 | P2 | Fixture subjects and benchmark harnesses lack an explicit conformance boundary | Confirmed as a ruling |
| RB-005-03 | P1 | Existing alignment phase excludes this durable-code slice | Confirmed |
| RB-005-06 | P2 | Live bin tests use undocumented filename conventions | Confirmed by census; the live convention is covered by the amended table |
| RB-006-01 | P1 | Canonical Node test runner misses plugin CJS and hook tests | Confirmed — `ROOTS` omits `.opencode/hooks`; discovery is `endsWith('.test.mjs')` only |
| RB-007-02 | P2 | Comment-hygiene gate does not recognize generic numbered phase or spec pointers | Confirmed |
| RB-007-09 | P2 | Live test filenames substantially exceed the documented vocabulary | Confirmed by census |
| RB-008-01 | P1 | Live test naming and discovery form a false-green contract | Confirmed |

*Plus synthesis findings **SYN-1** (three-guard wrapper scoped to one skill tree) and **SYN-2** (standard's enforcement pointers name uninstalled files), both confirmed at HEAD.*
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The wired post-edit adapter parses and the comment-hygiene gate demonstrably blocks | `node --check .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` exits 0, and a deliberately violating scratch file written through the Write tool produces a comment-hygiene block |
| REQ-002 | The parse-integrity failure mode is covered by a regression fixture | A test asserts the adapter parses; the test is demonstrated failing against a copy of the file with a syntax error reintroduced |
| REQ-003 | Exactly one pre-commit file and exactly one post-edit adapter are installed, and the standard names them | `.git/hooks/pre-commit` resolves to the single retained file; `grep -n "pre-commit\|posttooluse" naming-and-commenting.md` returns only paths that exist and are installed |
| REQ-004 | Each new comment-checker rule is proven by a fixture that fails before the rule lands | For each of the three rules, a recorded run of `check-comment-hygiene.test.sh` shows the fixture failing pre-change and passing post-change |
| REQ-005 | The documented test-filename vocabulary matches the repository | The amended table lists `*.vitest.ts`, `*.test.ts`, `*.test.cjs`, `*.test.mjs`, `*.test.sh`, `test_*.py` with their discovery contracts, and names no pattern with zero matches |
| REQ-006 | The three-guard wrapper's scan root is a recorded decision, not an accident | `run-all-drift-guards.sh` reflects the Q5 decision, and `decision-record.md` states the decision, the rejected alternatives, and the rollback |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | One canonical test-discovery contract spans the Node runner and the Vitest configs | `run-node-tests.mjs` discovers `.opencode/hooks` and the `.test.cjs` form; a discovery canary asserts the runner's file count against an independently-globbed count and fails on divergence |
| REQ-008 | Six scope rulings and the two-lane worklist doctrine are recorded as binding | `decision-record.md` carries one entry per ruling with its evidence and its consequence for named children |
| REQ-009 | The generic-label semantic boundary is written before the matcher widens | The decision record states the boundary — a label is forbidden when it identifies an external artifact, permitted when it names a durable concept — with at least one positive and one negative fixture |
| REQ-010 | The program baseline is captured | Per-lane-root `verify_alignment_drift.py` output is recorded verbatim in `implementation-summary.md`, and each later child's delta claim references it |
| REQ-011 | The 020 border amendment is applied | 020's spec states the resolved scope answer and the cross-reference to this program |
| REQ-012 | Exact header shape has a resolved automation status | Per Q4: either an opt-in verifier flag exists with its documented exception list, or the decision record states why header shape stays manual |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deliberately violating scratch file, written through the Write tool, is blocked by the comment-hygiene gate — the live smoke, not the unit test.
- **SC-002**: `check-comment-hygiene.test.sh` is green, and each of the three new rules has a recorded pre-change failing run of its own fixture.
- **SC-003**: The discovery canary is green, and reintroducing a hidden test directory makes it fail.
- **SC-004**: `run-all-drift-guards.sh` completes with its scan root matching the recorded Q5 decision, and its output is captured as the program baseline.
- **SC-005**: No pattern in the amended test-filename table matches zero files at HEAD.
- **SC-006**: `decision-record.md` carries every ruling a later child would otherwise re-litigate, each with evidence.
- **SC-007**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening the three-guard scan root surfaces the whole backlog on every completion claim | High — could block unrelated work for the duration of the sweep | Q5's recommended middle option: widen with `--fail-on-warn` off until 003 and 004 land, then promote |
| Risk | Broadening the generic-label matcher flags durable domain prose | Medium — false positives in a hard-block gate are worse than misses | The boundary is written and fixtured before the regex changes; a negative fixture guards durable prose |
| Risk | Retiring the wrong hook of a duplicated pair silently disables a rule the other file uniquely carried | High | Diff both files rule-by-rule before retiring either; the retained file must demonstrably carry the union |
| Risk | Amending the standard's test vocabulary conflicts with an in-flight runner change | Low | T001 re-reads both Vitest configs and the runner at HEAD before the amendment is drafted |
| Dependency | Operator decisions Q4 and Q5 | Resolved | Accepted ADR-008 and ADR-009 record the scan-root and exact-header decisions |
| Dependency | Operator decision Q2 | Resolved | The current 020 spec contains the resolved runtime-only border; no separate amendment artifact exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The post-edit adapter stays within its existing per-edit latency budget; the added parse-integrity check runs in CI or in the test suite, never in the hot path of a Write/Edit.
- **NFR-P02**: The widened three-guard wrapper completes within a duration an operator will actually tolerate at a completion claim; if it does not, the repo-wide scan moves to a separate CI job (Q5's third option).

### Security
- **NFR-S01**: No hook change weakens fail-open behaviour into fail-silent. A hook that cannot run must say so on stderr rather than exit 0 quietly.
- **NFR-S02**: The retained pre-commit file carries the union of both files' blocking rules; no rule is dropped in reconciliation.

### Reliability
- **NFR-R01**: The gate's own failure modes are covered: a parse failure, a missing checker script, and a non-executable hook each produce a visible, testable signal.
- **NFR-R02**: The discovery canary fails on divergence rather than warning, so a hidden test directory cannot recur silently.

---

## 8. EDGE CASES

### Data Boundaries
- A comment containing a durable domain term that resembles a phase label (for example, a protocol named `Phase 2` in an external specification) must **not** be flagged — this is the negative fixture.
- A comment containing a packet directory name with no numeric prefix must still be flagged; the matcher cannot depend on digits alone.
- A test file matching two patterns at once (for example `foo.test.cjs` discovered by both the Node runner and a Vitest config) must be counted once, not twice.

### Error Scenarios
- Checker script missing or non-executable: the hook reports on stderr and does not silently pass.
- The verifier's exact-header flag encountering a file in a documented exception class (plugin, fixture, asset, example): skipped with a reason, never a silent pass.
- The three-guard wrapper failing on an unrelated pre-existing error while widened: the output must attribute the failure to a root so an operator can tell backlog noise from a new regression.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: ~12, LOC: moderate, Systems: hooks, verifier, standard docs, Node runner |
| Risk | 21/25 | Auth: N, API: N, Breaking: Y — changes a hard-block gate and a mandated completion gate |
| Research | 12/20 | The semantic boundary for generic labels and the hook reconciliation both need investigation before an edit |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 11/15 | Dependencies: blocks three children; two operator decisions; one cross-packet amendment |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Widened drift gate blocks unrelated completion claims | H | H | Warnings non-blocking until the sweep lands |
| R-002 | Regex broadening produces false positives in a hard-block gate | H | M | Boundary written first; negative fixture required |
| R-003 | Hook reconciliation drops a uniquely-carried rule | H | M | Rule-by-rule diff; retained file must carry the union |
| R-004 | Exact-header flag's exception list is wrong and mass-flags assets | M | M | Opt-in only; exceptions derived from the verifier's existing advisory-downgrade list |
| R-005 | Standard amendment lands while a runner change is in flight | M | L | T001 re-reads runner and configs at HEAD |
| R-006 | Baseline captured against a dirty tree, making later deltas meaningless | H | L | Baseline capture asserts a clean packet-scoped `git status` first |

---

## 11. USER STORIES

### US-001: The gate blocks what it claims to block (Priority: P0)

**As a** developer editing OpenCode system code, **I want** the comment-hygiene gate to actually fire on my edit, **so that** a hard-block rule is not silently optional.

**Acceptance Criteria**:
1. Given a scratch file containing a spec-folder pointer in a comment, When I write it through the Write tool, Then the post-edit gate reports a comment-hygiene violation.
2. Given the adapter is made unparseable, When the test suite runs, Then the parse-integrity fixture fails.

### US-002: A completion claim means something (Priority: P1)

**As a** reviewer reading a completion claim, **I want** the three-guard gate's scan root to be a recorded decision with a captured baseline, **so that** "the gate passed" is a delta against a known number rather than a vacuous PASS.

**Acceptance Criteria**:
1. Given a completion claim in a later child, When I read its evidence, Then it cites the baseline recorded here and states warnings closed and warnings introduced.

### US-003: The standard describes the repository (Priority: P1)

**As an** author following the documented test conventions, **I want** the table to name the patterns the repository actually uses, **so that** following the standard does not produce a file the runner never discovers.

**Acceptance Criteria**:
1. Given the amended table, When I glob each listed pattern at HEAD, Then every pattern matches at least one file.
2. Given a new test written to the documented convention, When the canonical runner runs, Then the file is discovered.

---

## 12. OPEN QUESTIONS

The operator decisions are resolved in ADR-008, ADR-009, and ADR-010. The remaining completion question is procedural: the orchestrator must provide or approve the live Write-tool smoke before this child can claim the P0 manual gate.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
