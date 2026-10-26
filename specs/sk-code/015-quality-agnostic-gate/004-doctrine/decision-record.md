---
title: "Decision Record: Phase 4: doctrine"
description: "Decisions for the sk-code doctrine amendment: Iron Law 3, the SKILLED house checklist, the review-severity column and the verify handoff scope."
trigger_phrases:
  - "phase 4 doctrine decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/004-doctrine"
    last_updated_at: "2026-10-26T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Checked every ADR-003 row against the review contract and added ADR-005"
    next_safe_action: "Operator confirms ADR-001 to ADR-005 at program end"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-doctrine-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 4: doctrine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

The operator set a standing instruction to build autonomously and to verify open decisions at program end. ADR-001 and ADR-002 take the design's recommended default. ADR-004 follows the phase dispatch over the design's phase 5 scope. ADR-003 was checked row by row against the `sk-code-review` contract in this phase, and ADR-005 records why three line anchors moved. All five carry the status line the operator asked for. The alternative and the reversal are recorded in each one. Scores in the alternatives tables are the author's judgement, not measurements.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Amend Iron Law 3 so an UNKNOWN surface gets the universal floor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, under the operator's standing instruction to build autonomously |

---

<!-- ANCHOR:adr-001-context -->
### Context

Iron Law 2 makes the Phase 1.5 quality gate mandatory (`phase-detection.md` line 108). Iron Law 3 forbids any standard or verification command on an UNKNOWN surface (line 109). A repository with no declared surface therefore never completes the gate. The program goal names this case, and the design records it as an open decision for the operator.

### Constraints

- A verification command must stay with the operator, because a discovered command can run repository code that nobody named.
- An UNKNOWN surface must not inherit a SKILLED or other stack's standard.
- The change must be the single amendment that phases 001 to 003 need.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Amend Iron Law 3 so an UNKNOWN surface gets the universal floor and the quality runner's built-in checks, until the operator names its surface and commands.

**How it works**: The law names four sources: the universal floor in `code-quality-standards.md`, the runner's built-in checks, the quality mode's surface-neutral checklists that the runner lists, and the quality checks the repository's quality config names, through `--config`, the git config key `skcode.qualityConfig` or `.sk-code/quality.json`. That config never supplies a verification command, and the spec-folder authoring checklist applies only where the SKILLED surface resolves. The UNKNOWN rows at `stack-detection.md` lines 32 and 49 and at `code-quality-standards.md` line 144 (the number ADR-005 records) state the same rule. Verification commands still come from `workflow-verify.md`, which keeps asking for them. The fix round broadened the law past the spec's two-sentence limit to state the rule exactly.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amend Iron Law 3 (chosen)** | Unblocks UNKNOWN work with the floor and the checks. Keeps surface standards behind a declared surface | UNKNOWN work gets fewer checks than a surface checklist gives | 8/10 |
| Keep Iron Law 3 as written | No doctrine change | An UNKNOWN repository never completes the gate | 3/10 |
| Let the runner run discovered package scripts on UNKNOWN | Runs more checks with no doctrine edit | Runs repository code that nobody named, which the design rejects | 2/10 |
| Apply SKILLED standards to UNKNOWN | Full checklist with no new rule | Applies another stack's house rules to a foreign repository | 1/10 |

**Why this one**: It is the smallest text change that unblocks the gate without running a discovered command or a foreign standard.

**Reversal**: If the operator declines, phases 001 to 003 still ship. The runner then serves SKILLED targets and named checks, and the mode keeps asking on UNKNOWN.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A repository with no declared surface can complete the gate with the floor and its own committed config.
- The envelope reads `unknown` and names the gap, so the next step is visible.

**What it costs**:
- UNKNOWN work gets fewer checks than a surface checklist gives. Mitigation: the agent names the missing surface in its report, and the operator adds a declaration when the work matters.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Iron Law 3 read as licence for surface standards on UNKNOWN | H | AC-001 checks the exact sentence. The text names the four sources, and the spec-folder checklist applies only where the SKILLED surface resolves |
| The committed config names quality checks, and a reader takes them for verification | M | Line 55 of `workflow-verify.md` states that the config supplies no verification commands (T017) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The program goal names the blocked case, and the design records it as a fact |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives are weighed above |
| 3 | **Sufficient?** | PASS | One rule replaces one rule in three places |
| 4 | **Fits Goal?** | PASS | The UNKNOWN case is the gap the goal names |
| 5 | **Open Horizons?** | PASS | Surface declarations stay the route to full checks |

**Checks Summary**: 5/5 PASS, by the author's judgement. Review and the operator confirm it.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `phase-detection.md` line 109, Iron Law 3.
- `stack-detection.md` lines 32 and 49.
- `code-quality-standards.md` line 144, the number ADR-005 records.

**How to roll back**: Run `git revert <landing sha>` on the one landing commit. Iron Law 3 then returns to the text it had before this phase, at line 109.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Make the universal checklist the SKILLED house checklist

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, under the operator's standing instruction to build autonomously |

---

<!-- ANCHOR:adr-002-context -->
### Context

`universal-checklist.md` says it applies to all code files in the OpenCode development environment (lines 3 and 16). Its P0 rows force this framework's file-header form (lines 44 to 53), its numbered ALL-CAPS section headers (lines 93 to 99) and its spec roots (lines 110 to 117). Applied to a foreign repository, those rows reject correct code. ADR-001 of the 014 review remediation already split the quality P0 floor into a baseline and a web overlay (`specs/sk-code/014-code-modes-research/003-review-remediation/implementation-summary.md` lines 26 and 103). This decision narrows that baseline meaning further.

### Constraints

- SKILLED's own checks must still run on SKILLED targets.
- Loading must not depend on a flag that an agent could forget to pass.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Make `universal-checklist.md` the SKILLED house checklist. Its title, description and intro say that it loads only when SKILLED resolves for the target.

**How it works**: The file keeps its rows. Phase 002 changes the loading table in `sk-code-quality/SKILL.md`, so the checklist loads only when `stack-detection.md` resolves SKILLED. Other surfaces use the universal floor and their own checklists.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Make it the SKILLED house checklist (chosen)** | Foreign repositories stop receiving SKILLED's header and spec-root rules. The name matches the loading rule | The word "universal" leaves the file name's meaning, so readers must find the floor in `code-quality-standards.md` | 8/10 |
| Keep the universal name and gate its rows by a marker in the file | No rename | Adds logic to a document, when the loading table already routes by surface | 4/10 |
| Copy the checklist into each foreign surface's packet | Each surface owns its rules | Duplicates the rules, and the copies drift | 2/10 |
| Keep the file as it is | No edit | Foreign repositories keep receiving SKILLED header rules | 1/10 |

**Why this one**: The loading rule already routes by surface, so the name can say what the file is.

**Reversal**: Restore the universal title and description from the pre-phase commit. The loading table change in phase 002 reverts with it when both land together.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Foreign repositories stop receiving SKILLED's header and spec-root rules.

**What it costs**:
- The intro of the checklist must name `code-quality-standards.md` as the floor for other surfaces. Mitigation: T010 adds that pointer.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A SKILLED target resolves through a fallback and misses its checklist | M | Loading follows the labels `stack-detection.md` resolves, and the drift guards in T023 cover the router |
| The 014 remediation wording still reads the baseline as universal | L | This record names the change. The 014 record is not edited |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The header and spec-root rows reject correct code in a foreign repository |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives are weighed above |
| 3 | **Sufficient?** | PASS | The retitle changes four lines and the intro |
| 4 | **Fits Goal?** | PASS | Foreign repositories are the goal's target |
| 5 | **Open Horizons?** | PASS | A later surface can declare its own checklist without touching this file |

**Checks Summary**: 5/5 PASS, by the author's judgement. Review and the operator confirm it.
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `universal-checklist.md` lines 2, 3, 5, 6, 14 and 16.
- The loading table in phase 002, which is not part of this phase.

**How to roll back**: Run `git revert <landing sha>` on the landing commit. The universal title returns.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Add a review-severity column to the rule tables

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author. Each row was checked against the `sk-code-review` contract, its `SKILL.md` and `references/review-core.md` section 2 |

---

<!-- ANCHOR:adr-003-context -->
### Context

Quality tiers and review severities are separate scales. Quality P0 blocks completion, P1 must be fixed or deferred, and P2 is optional. Review P0 blocks a merge, P1 must be fixed before a merge, and P2 is optional (`review-core.md` section 2, lines 32 to 36). Review owns its ids and their meanings (`review-core.md` line 20). An author who reads a quality P0 needs to know how the same defect reads in review.

### Constraints

- Review keeps its ids, its meanings and its judgement on each row.
- A quality P0 cannot map to review P0 by default. Review P0 means an exploitable security issue, an auth bypass or destructive data loss.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Add a `Review severity` column to the rule tables in sections 3 to 5 of `code-quality-standards.md`, carrying the default mapping below. Review confirms each row.

**Default mapping**:
- Quality P0 maps to review P1. Credential signatures map to review P0, as an exploitable security issue. Input validation and initialization safety map to review P0 only when the gap is exploitable or causes data loss.
- Quality P1 maps to review P1 when the defect breaks correctness or a gate. It maps to review P2 when the defect is style or documentation.
- Quality P2 maps to review P2.
- The mechanical floor follows the same rule. Parse failure and merge-conflict markers map to review P1, and credential signatures map to review P0.

**How it works**: The column maps a rule for authors and for review readers. It changes no review id. The design says the lists gain a column. A column needs a table, so each list becomes a table and keeps its wording.

**Review confirmation**: The `sk-code-review` mode was loaded in this phase, its `SKILL.md` and `references/review-core.md`, and every row of the column was checked against the three definitions in `review-core.md` section 2. P0 there is an exploitable security issue, an auth bypass or destructive data loss. P1 is a correctness bug, a spec mismatch or a must-fix gate issue. P2 is a non-blocking improvement, documentation polish or a style or maintainability follow-up. The check reads an unresolved quality P0 as a failed mandatory gate, because Iron Law 2 makes the Phase 1.5 gate mandatory, and that is a must-fix gate issue in review's own words.

| Table | Rule | Column value | Verdict | Reason against `review-core.md` section 2 |
|-------|------|--------------|---------|------------------------------------------|
| Mechanical floor | Parse failure | P1, once a heuristic finding is confirmed | Confirmed | A file that does not parse is a correctness bug. A plain JavaScript finding is heuristic, so it ranks only once the agent confirms it |
| Mechanical floor | Merge-conflict markers | P1 | Confirmed | Conflict lines break the file, a correctness bug |
| Mechanical floor | Credential signature | P0 | Confirmed | A committed credential is an exploitable security issue, and unsafe secrets handling is a security minimum in section 6 |
| P0 | Initialization safety | P1. P0 when the gap is exploitable or causes data loss | Confirmed | A double initialization or a race is a correctness bug. It reaches P0 only through section 2's own P0 cases |
| P0 | Input validation | P1. P0 when the gap is exploitable or causes data loss | Confirmed | Boundary handling is a correctness minimum. An injection path is exploitable, which is P0 |
| P0 | No commented-out code | P1 | Confirmed | An unresolved quality P0 fails the mandatory gate, a must-fix gate issue. A reviewer who reads it as maintainability alone would rank it P2, so the operator may confirm this row at program end |
| P0 | No silent failures | P1 | Confirmed | A swallowed exception hides a wrong result, a correctness bug |
| P0 | No hardcoded secrets | P0 | Confirmed | Same reason as the credential signature row |
| P0 | No ephemeral-artifact pointers in comments | P1 | Confirmed | The pre-commit and CI gates block it, a must-fix gate issue |
| P0 | Accessibility | P1 | Confirmed | A control a keyboard cannot reach is a correctness bug for that user, and the gate requires the fix |
| P1 | Documentation completeness | P2 | Confirmed | Documentation polish |
| P1 | Test coverage at boundaries | P1 | Confirmed | Boundary handling and regression risk are correctness minimums in section 6, so an untested boundary leaves a correctness claim unproven |
| P1 | Error message quality | P2 | Changed from the default | The default rule names two cases, correctness or a gate for P1 and style or documentation for P2. A thin error message is neither, and section 2 names a maintainability follow-up as P2 |
| P1 | Resource cleanup | P1 | Confirmed | A leaked handle or timer is a correctness bug |
| P1 | Type-safety enforcement | P1 when the type check fails, P2 otherwise | Changed from the default | A failing type check is a failed gate, which is P1. A loose type that still compiles is a maintainability follow-up, which is P2 |
| P1 | Naming convention adherence | P2 | Confirmed | Style follow-up |
| P2 | Idiomatic refinements | P2 | Confirmed | Style follow-up |
| P2 | Performance polish | P2 | Confirmed | Non-blocking improvement |
| P2 | Test coverage beyond boundaries | P2 | Confirmed | Non-blocking improvement |
| P2 | Documentation completeness for internal helpers | P2 | Confirmed | Documentation polish |

Twenty rows were checked. Eighteen match the default mapping, and two refine it where the default named no case. No review id or definition changed, and `review-core.md` was not edited.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add the column (chosen)** | An author sees how a finding reads in review before review runs | Four tables grow wider | 7/10 |
| No column. Each reader maps by its own judgement | No doctrine edit | Two severity stories again | 4/10 |
| Quality P0 maps straight to review P0 | Simple rule | Review P0 would cover non-security blockers, which contradicts `review-core.md` section 2 | 2/10 |

**Why this one**: It gives one mapping that review can check row by row, and it keeps review's own scale.

**Reversal**: If review rejects the column, remove the header and the column values. The tables keep their wording.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- An author can predict the review severity of a finding.

**What it costs**:
- Four tables replace four lists, and each table is wider. Mitigation: each table keeps the rule text unchanged.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Review disagrees with a row | M | T021 records each changed row in this record. The column header keeps its name |
| A reader treats the column as review's own ids | M | Section 2 of `code-quality-standards.md` says review keeps its ids and meanings |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both scales already exist, and authors need the mapping |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives are weighed above |
| 3 | **Sufficient?** | PASS | One column per table, no new file |
| 4 | **Fits Goal?** | PASS | The goal's review reader needs one severity story |
| 5 | **Open Horizons?** | PASS | Review can widen its ids later without changing the column's meaning |

**Checks Summary**: 5/5 PASS, by the author's judgement. Every row was checked against review's contract at T021.
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Sections 2 to 5 of `code-quality-standards.md`, with the new mechanical floor table at the top of section 3.

**How to roll back**: Run `git revert <landing sha>` on the landing commit. The tables return to lists.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep the verify handoff line in this phase

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, under the operator's standing instruction to build autonomously |

---

<!-- ANCHOR:adr-004-context -->
### Context

The design lists `workflow-verify.md` line 56 under the shared doctrine (section 5.3). The design's phase 5 scope names "the verify reader rule" (section 7). The phase dispatch assigns the `workflow-verify.md` handoff lines to this phase. One line cannot have two owners.

### Constraints

- Line 56 names envelope fields that exist only after phase 002.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: This phase edits `workflow-verify.md` lines 55 and 56. Phase 005 keeps the `@code` step, the review trigger, the aliases and the routing. Phase 005 does not edit `workflow-verify.md`.

**How it works**: Line 55 states that the quality config supplies no verification commands. Line 56 reads the envelope fields and states the hand-back rule. Both depend on the phase 002 grammar, so this phase lands after phase 002.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Edit the line here (chosen)** | Follows the phase dispatch. The doctrine names the envelope once it exists | This phase depends on the phase 002 grammar, which it already needs | 7/10 |
| Move line 56 to phase 005 | Follows the design's phase 5 scope | The verify doctrine stays silent on the envelope for one more phase | 4/10 |
| Edit line 56 in both phases | No ownership question | Two owners for one line | 1/10 |

**Why this one**: The dispatch assigns the line here, and the envelope fields exist once phase 002 lands.

**Reversal**: Move the reader sentence from line 56 to the phase 005 plan. Remove this decision from the phase 004 scope.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The verify workflow reads the runner's fields in the same phase that defines the doctrine for them.

**What it costs**:
- Phase 005 must drop the verify reader rule from its plan. Mitigation: its plan names this record.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 005 repeats the edit | M | This record names the owner. The phase 005 plan names this record |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The verify handoff needs the envelope read rule |
| 2 | **Beyond Local Maxima?** | PASS | Two alternatives are weighed above |
| 3 | **Sufficient?** | PASS | Two lines in one file |
| 4 | **Fits Goal?** | PASS | The hand-back rule closes the loop the goal describes |
| 5 | **Open Horizons?** | PASS | Phase 005 keeps the consumers |

**Checks Summary**: 5/5 PASS, by the author's judgement. The program owner confirms it.
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `workflow-verify.md` lines 55 and 56.

**How to roll back**: Run `git revert <landing sha>` on the landing commit. Line 56 returns to its pre-phase text.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Check three amended lines at the line they land on

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, under the coordinator's ruling that a task wrong for the tree is done to its intent with the deviation recorded |

---

<!-- ANCHOR:adr-005-context -->
### Context

Three checks name a line number that the phase itself moves, or that an earlier phase moved before this one started.

- AC-003 expects the UNKNOWN row of `code-quality-standards.md` on line 122, and AC-016 expects `quality-gate.cjs` on a line from 131 to 140. T006 to T008 must add the review-severity sentence, the floor definition, the mechanical floor and three tables above both lines, which adds 22 lines above both. Step 2 now spans lines 153 to 155, and its command sits on line 155, where it sat on line 133 before.
- AC-014 expects the P0 table sentence in `sk-code-quality/SKILL.md` on line 192. Phase 002 rewrote that file before this phase started, and the P0 table now opens at line 224, with the sentence before it on line 222.

### Constraints

- AC ids stay stable, and a criterion is never renumbered.
- A Met row must name evidence that was observed.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Check each of the three lines at the line it lands on, and amend the line number in the Verification cell of AC-003, AC-014 and AC-016 and in tasks T005, T009 and T015.

**How it works**: Each grep keeps its pattern and its one-line count. Only the expected line number changes, to 144 for the UNKNOWN row, 155 for step 2 and 222 for the P0 table sentence. T005 also printed line 122 before T006 to T008 ran, which the task records.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amend the line number (chosen)** | Each check still proves its text, on one line, in the right section | The cell no longer matches the number the authoring pass wrote | 8/10 |
| Squeeze the new content to keep line 122 and lines 131 to 140 | No amendment | Impossible without dropping content that T006 to T008 require | 1/10 |
| Mark the three rows Unmet | No amendment | The text is in place, so the rows would read as failures they are not | 2/10 |

**Why this one**: The line numbers were authored against the tree before these edits, and the patterns carry the claim.

**Reversal**: Restore the authored numbers in the three cells and three tasks. The grep then fails, which says only that the line moved.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Every check in `acceptance-criteria.md` runs as written against the final tree.

**What it costs**:
- A reader comparing the cell with the authoring pass sees a different number. Mitigation: this record and the task notes name the old and new numbers.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later phase edits the same file and moves the line again | L | The pattern stays, so a rerun names the new line at once |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, three criteria fail on text that is in place |
| 2 | **Beyond Local Maxima?** | PASS | Two alternatives are weighed above |
| 3 | **Sufficient?** | PASS | Three numbers change, and every pattern stays |
| 4 | **Fits Goal?** | PASS | The criteria keep proving the amended doctrine |
| 5 | **Open Horizons?** | PASS | A later move needs only a new number |

**Checks Summary**: 5/5 PASS, by the author's judgement. The operator confirms it at program end.
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- The Verification cells of AC-003, AC-014 and AC-016, and the Verify clauses of T005, T009 and T015.

**How to roll back**: Restore the three authored numbers in the cells and the tasks.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
