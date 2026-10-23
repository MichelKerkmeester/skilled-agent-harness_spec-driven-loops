---
title: "Decision Record: doctor ci review wiring"
description: "Twelve proposed decisions for the /doctor:ci phase: the R28 probe and its D9 answer, the declined-probe fallback, the switch resolver, the rebuild-SHA exclusion, the create-only scaffold, the CI precedence, the message-contract refusal, the syntactic drift subset, the standalone report script, the compiled-route observation, the no-ephemeral-id rule and the phrase replacement rule."
trigger_phrases:
  - "doctor ci review wiring decision record"
  - "ci workflow report decisions"
  - "ci surface precedence decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring"
    last_updated_at: "2026-10-23T15:40:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored twelve proposed decisions for the planned phase"
    next_safe_action: "The R28 probe is pre-approved; execute T001, then T002"
    blockers:
      - "006-sk-code-ci-surface pending"
      - "007-workflow-hygiene-on-off-control pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-009-doctor-ci-review-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: doctor ci review wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Every record here is `Proposed`. A decision becomes `Accepted` only when the
> task it gates has run and its check has passed. Each record names the tasks it
> gates, so a change to a decision names the tasks that must be re-run.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: D9 is answered by the R28 probe, with write as the default

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D9: R28 probe pre-approved 2026-10-23; outcome selects write or print), plan author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The toggle route either writes a repository variable or prints the command for the operator to run. The research inferred that a repository-variable write needs an admin token, and that inference was never exercised. The answer decides the route's mutation class, its `gate3_location` and whether its workflow YAML carries a write step.

### Constraints

- A repository-settings write is a stop-for-yes step, so the probe needs an explicit operator yes.
- The probe must leave no state: it uses a name no workflow reads and deletes it in the same task.
- The route validator rejects a `read-only` route whose YAML declares a write, so the class and the YAML must agree.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: D9 is answered by the R28 probe. `gh variable set` exiting 0 selects `write`; a non-zero exit selects `print`.

**How it works**: T001 runs set, get, delete and get, records the four exit codes in `scratch/r28-probe.md`, and writes one `D9: write` or `D9: print` line in `plan.md`. T011 reads that line and writes the toggle YAML for that shape, and T012 writes the matching `mutating` value and `gate3_location`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Probe, then write (chosen)** | The answer is observed, and the route can write when the token allows it | One repository-settings write, gated by a yes | 9/10 |
| Assume write | No probe, one fewer task | The "admin token" claim stays an inference, and a failed toggle ships | 4/10 |
| Assume print | No repository-settings write at all | The command is weaker than the token allows, and the operator copies a command by hand | 6/10 |

**Why this one**: The probe costs one variable and one delete, and it is the only evidence that separates a working toggle from a printed instruction.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The toggle's shape is decided by an observed exit code, not by an inference.
- The phase records the account's permission and token scopes beside the result, so a later reader can tell why the probe passed or failed.

**What it costs**:
- One repository-settings write during the build. Mitigation: a throwaway name, a delete in the same task, and a recorded post-delete read-back.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The delete fails and the variable survives | H | Stop, delete again, record both results before any other work |
| A later reader treats the probe as a licence to write variables | M | Only the toggle route writes, and only after an operator yes |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The toggle's mutation class cannot be written without the answer |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed: probe, assume write, assume print |
| 3 | **Sufficient?** | PASS | One variable and four commands answer the question |
| 4 | **Fits Goal?** | PASS | It is the first task of the phase and gates the toggle |
| 5 | **Open Horizons?** | PASS | A recorded permission answer serves every later repository-variable feature |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scratch/r28-probe.md` gains four `exit=` lines and both read-backs.
- `plan.md` gains one `D9:` line before the `phases` anchor close.
- `doctor-ci-toggle.yaml` and the toggle route take the shape that line names.

**How to roll back**: `gh variable delete SKILLED_CI_PROBE`, delete `scratch/r28-probe.md`, and remove the `D9:` line.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A declined probe selects print and waives the probe criterion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator, maintainer |

---

<!-- ANCHOR:adr-002-context -->
### Context

The probe changes repository settings, and the operator may decline it. A phase that cannot proceed without a repository write would then be blocked on a permission the operator chose not to grant, even though the command is useful without it.

### Constraints

- A declined write cannot be retried inside the same task.
- The toggle must still be a complete route under the print answer, which the route validator accepts as `read-only`.
- The acceptance criteria must say which row a decline waives, and the waiver must name an ADR.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: A declined probe writes `D9: print`, records the decline, and waives AC-001 by this ADR.

**How it works**: T001 records `declined: operator said no`, writes `D9: print`, and runs no `gh` write. T011 and T012 then produce the print shape: `mutating: read-only`, an `n/a` gate location, and a YAML that prints the command and stops.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Print fallback (chosen)** | The phase completes without a repository write, and the command still works | The probe permission stays unconfirmed | 8/10 |
| Block the phase | No unverified claim ships | A whole phase waits on one permission | 5/10 |
| Ask again in a later phase | The probe may succeed later | The toggle ships unshaped, and the phase has no closure | 4/10 |

**Why this one**: The operator's no is a legitimate answer, and the print route is a complete, testable shape rather than a stub.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The phase has a defined path when the operator declines.
- The print route is still covered by the contract test and the presentation.

**What it costs**:
- AC-001 stays unproven. Mitigation: the waiver names this ADR, and the closure statement records the decline.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A waiver is used to skip a probe that would have passed | M | The decline is recorded in `scratch/r28-probe.md`, so a later reader sees who declined and when |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator may decline, and the phase needs a defined path |
| 2 | **Beyond Local Maxima?** | PASS | Blocking and deferring were both weighed |
| 3 | **Sufficient?** | PASS | One line and one waiver cover the case |
| 4 | **Fits Goal?** | PASS | It keeps the command deliverable without the write |
| 5 | **Open Horizons?** | PASS | A later operator can run the probe and flip the shape |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `scratch/r28-probe.md` records the decline.
- `plan.md` carries `D9: print`.
- `acceptance-criteria.md` marks AC-001 `Waived` with `ADR-002` in its Waiver cell.

**How to roll back**: Remove the decline line and the waiver, and run T001 with an operator yes.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The report resolves a switch from the job `if:` expression

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-003-context -->
### Context

Phase 007 puts a `vars.SKILLED_CI` switch on every job and records the group assignment in its own `scratch/switch-groups.md`. A shipped command cannot read a spec folder: the folder moves, and a clone may not have it.

### Constraints

- The six names are fixed by phase 007 and the workflows README.
- A job's `if:` may be a plain string, a quoted `${{ }}` string or a `>-` block.
- The report must never print a variable value, only a state.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: The report parses each job's `if:` string for `vars.SKILLED_CI` and `vars.SKILLED_CI_<GROUP>` and resolves their values through `gh variable list --json name,value`.

**How it works**: A job is `off` when either value is `off`, `unknown` when either is `unknown`, and `on` otherwise. A workflow is `off`, `on`, `partial` or `missing` from its jobs. The report prints the state and never the value.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parse the `if:` line (chosen)** | The durable source is the workflow file, which every clone has | The parser must handle three `if:` shapes | 9/10 |
| Read `007`'s `scratch/switch-groups.md` | The mapping is explicit | A runtime dependency on a mutable spec folder | 2/10 |
| Hard-code the group table in the script | No parsing | A second copy of a table phase 007 owns | 3/10 |

**Why this one**: The `if:` line is the only copy of the rule that ships with the workflow and cannot drift from it.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The report is correct for any tree that carries the switch, including a fork.
- A switch change needs no report change.

**What it costs**:
- The parser carries the three `if:` shapes. Mitigation: T006 tests the quoted, the ANDed and the plain forms.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An `if:` shape the parser does not recognise | M | The parser looks for the variable names anywhere in the string, not for an exact form |
| `gh` is unavailable | L | Every state reads `unknown` and the inventory still prints |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A clone cannot see the switch state without it |
| 2 | **Beyond Local Maxima?** | PASS | Three sources were weighed |
| 3 | **Sufficient?** | PASS | One regex pair and one `gh` call answer the question |
| 4 | **Fits Goal?** | PASS | It is the report's core behaviour |
| 5 | **Open Horizons?** | PASS | A new group name needs no parser change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `ci-report.cjs` gains the switch resolver and the five-state output.
- `ci-report.test.cjs` fixes the three shapes and the empty-variable case.

**How to roll back**: Revert the command commit; the report and its routes leave together.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The newest non-rebuild SHA is excluded by commit-message trailer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-004-context -->
### Context

After the rebuild fan-out removal, a rebuild commit's SHA carries no statuses of its own: only the rebuild run's skipped row, or no runs at all. A tool that reads `main`'s HEAD therefore sees an empty status set. A rebuild SHA also carries its downstream runs, so filtering the run list by workflow name does not exclude the SHA.

### Constraints

- The trailer is `Trigger-Index-Rebuild: ci`, and the rebuild workflow's own loop guard matches it.
- The report may make a bounded number of `gh api` calls.
- The report must not guess a SHA when none qualifies.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Read the last 100 `main` runs, deduplicate their SHAs newest first, and exclude a SHA whose last non-empty commit-message line is `Trigger-Index-Rebuild: ci`.

**How it works**: For each candidate, `gh api repos/{owner}/{repo}/commits/<sha> --jq .commit.message` returns the message; the report compares the last non-empty line. The first SHA that does not match is `newestNonRebuildSha`. None matching yields `null` with a stated reason.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Commit-message trailer (chosen)** | Reads the same marker the rebuild workflow writes | One `gh api` call per candidate | 9/10 |
| Filter runs by workflow name | No message reads | A rebuild SHA carries downstream runs, so the SHA survives the filter | 3/10 |
| Read the branch's HEAD and accept an empty set | Cheapest | Reports nothing after R1 | 2/10 |

**Why this one**: The trailer is the only marker that identifies the commit itself rather than a run of it.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The report names a SHA whose statuses are meaningful, before and after R1.
- The excluded SHA can be recorded, so a reader sees why it was skipped.

**What it costs**:
- Up to 100 `gh api` reads in the worst case. Mitigation: stop at the first qualifying SHA and accept `--sha=<sha>` to skip the resolution.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A commit message uses the trailer for another purpose | L | The trailer is the rebuild workflow's own loop guard, so a second use would already break the rebuild |
| `gh` rate limit | M | Stop and record the command and the error; never interpolate a SHA |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | N17 makes main's HEAD unusable after R1 |
| 2 | **Beyond Local Maxima?** | PASS | Three identification methods were weighed |
| 3 | **Sufficient?** | PASS | One trailer compare answers it |
| 4 | **Fits Goal?** | PASS | The report's SHA column depends on it |
| 5 | **Open Horizons?** | PASS | A different trailer needs one constant change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `ci-report.cjs` gains the resolution and the `--sha` override.
- `ci-report.test.cjs` fixes one rebuild SHA and one real SHA.

**How to roll back**: Revert the command commit; the report and its routes leave together.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The scaffold creates new files only and refuses a protected name

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-005-context -->
### Context

The command reads the `sk-code-ci` templates and writes a workflow. A template applied over an existing file would replace a guard, and a protected workflow is exactly the file that must not be replaced by a generated one.

### Constraints

- The final review's R29 names `report` and `scaffold` only, with no customize route.
- The protected set lives in `sk-code-ci/references/protected-set.md`.
- The route validator accepts a `mutates` route only when its gate location names a concrete target.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: `scaffold` creates a new `.github/workflows/` file only. It refuses an existing path and any name in the protected set, and it writes only after an explicit yes.

**How it works**: The route resolves the name, checks the path and the protected set, prints the whole proposed file and the README row it needs, and writes on yes. It re-reads the file and prints its first line.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Considered Alternatives

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Create only (chosen)** | A protected guard cannot be replaced | An operator edits an existing workflow by hand | 9/10 |
| Create and overwrite | One route covers both | A template can replace a guard | 2/10 |
| Create with a `--force` flag | The operator can overwrite deliberately | The flag becomes the accident path | 4/10 |

**Why this one**: A generated file is a starting point, and an existing guard is never a starting point.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A protected workflow cannot be replaced by a template.
- The operator sees the whole file before the write.

**What it costs**:
- An existing workflow needs a manual edit. Mitigation: the refusal names the path and says the route creates new workflows only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A protected name is missing from the set | H | The route reads the set from the packet, and the contract test asserts both refusal strings |
| A near-miss name passes the set | M | The set is compared by file name, and the test covers one protected and one unprotected name |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A template over a guard would remove a check |
| 2 | **Beyond Local Maxima?** | PASS | Create, overwrite and force were weighed |
| 3 | **Sufficient?** | PASS | Two refusals and one yes gate cover it |
| 4 | **Fits Goal?** | PASS | It is the scaffold route's whole safety story |
| 5 | **Open Horizons?** | PASS | A customize route can be added later as its own decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `doctor-ci-scaffold.yaml` carries the template reads, the two refusals and the yes gate.
- The contract test asserts both refusal strings and the template paths.

**How to roll back**: Revert the command commit; the scaffold leaves with its route.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: `CI` sits second in the surface precedence, after `SKILLED`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-006-context -->
### Context

`detect_surface_evidence` returns four values today. A `.github/workflows` diff returns `UNKNOWN`, so a workflow review loads no CI evidence. The hub's `routerPolicy.tieBreak` is a bundle order, and it is not the same thing as the single-surface precedence.

### Constraints

- A resolved `.skilled/` path must keep returning `SKILLED`, which is the symlink guard's purpose.
- The precedence must appear once in the shared contract and once in the review router, and both must match.
- The existing SKILLED, OBSIDIAN and WEBFLOW fixtures must keep their values.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: `CI` is the fifth value, and the precedence is `SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN`.

**How it works**: The shared contract gains the row, the precedence and a `.github/workflows/` and `.github/actions/` detection step. The review router gains `CI_PATH_MARKERS`, a `under_ci` helper and a branch after SKILLED. The hub's tie-break sentence is reworded to say it is a bundle order, not the detection precedence.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CI second (chosen)** | A workflow path outranks a Webflow or Obsidian marker in the same diff | A mixed `.skilled/` and workflow diff returns SKILLED | 9/10 |
| CI first | A workflow diff always returns CI | A hub file reached through the symlink would return CI | 3/10 |
| CI last, before UNKNOWN | No existing result changes | A Webflow marker in a workflow diff would outrank CI | 5/10 |

**Why this one**: SKILLED's symlink guard exists because a resolved `.skilled/` path is the strongest evidence of hub work; CI is the next strongest explicit path marker.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A workflow diff reviews with the `sk-code-ci` evidence packet.
- The precedence has one string that every restatement copies.

**What it costs**:
- Six skill docs change and each needs a version bump. Mitigation: T022 runs the bump tool, and T025 runs the drift guards.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A mixed diff routes to CI instead of SKILLED | H | SKILLED returns first, and the test covers the mixed case |
| The two copies drift | M | The test asserts the same string in both |
| A near-miss path matches | M | The helper tests path segments, and the test covers `docs/.github/workflows-notes.md` |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A workflow diff has no surface today |
| 2 | **Beyond Local Maxima?** | PASS | Three positions were weighed |
| 3 | **Sufficient?** | PASS | One value, one branch and one helper |
| 4 | **Fits Goal?** | PASS | It is R30's whole content |
| 5 | **Open Horizons?** | PASS | A sixth value appends after UNKNOWN without reordering |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `stack-detection.md` gains the row, the precedence, the step and four test cases.
- `sk-code-review/SKILL.md` gains the branch, the markers and the docstring.
- Four hub docs restate the new order, and `surface-detection.test.cjs` pins all five values.

**How to roll back**: Revert the sk-code commit; the four-value contract, the old versions and the previous manifest return together.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The toggle reads the message-contract prohibition from the workflows README

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-007-context -->
### Context

`message-contract.yml` holds the only required status context. A skipped job reports Success, so switching it off would let a commit with a wrong message merge. Phase 007 writes the prohibition in the `### On/off switches` section of the workflows README.

### Constraints

- The rule is documented for a clone, and the command must enforce the same sentence.
- The command cannot read a spec folder.
- The six names are fixed.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: The toggle refuses `SKILLED_CI_MESSAGES=off` while the README section contains `SKILLED_CI_MESSAGES must stay unset`.

**How it works**: Before it prints a plan, the route reads the README section and compares the sentence. A match produces the refusal and exit 1 with no write. A missing section means phase 007 has not landed, and the refusal still applies because the name is the message-contract group.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read the README (chosen)** | The rule lives where a clone reads it | The command depends on a documented sentence | 9/10 |
| Hard-code the refusal | No dependency | A second copy of a rule phase 007 owns | 5/10 |
| Allow it and warn | The operator can always disable a check | A skipped required context reports Success | 1/10 |

**Why this one**: The prohibition is already written for a reader, and enforcing the same sentence keeps one source.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The only required context cannot be disabled by the command.
- The refusal quotes the same sentence a reader finds in the README.

**What it costs**:
- The README section must exist. Mitigation: T003 records its absence, and T011 still refuses the name.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The sentence is reworded and the refusal stops matching | H | The contract test asserts the sentence, so a reword fails the test |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A skipped required context reports Success |
| 2 | **Beyond Local Maxima?** | PASS | Three enforcement points were weighed |
| 3 | **Sufficient?** | PASS | One sentence compare covers it |
| 4 | **Fits Goal?** | PASS | It is the toggle's safety rule |
| 5 | **Open Horizons?** | PASS | A second protected context adds one more sentence |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `doctor-ci-toggle.yaml` reads the section and carries the refusal.
- The contract test asserts the sentence and the refusal string.

**How to roll back**: Revert the command commit; the toggle leaves with its route.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: The report checks the syntactic rule subset and names the prose rules `notChecked`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-008-context -->
### Context

The `sk-code-ci` packet holds rules a parser can check and rules it cannot. A report that claimed to check every rule would either invent a second copy of a prose rule or report a false pass.

### Constraints

- The report writes nothing and runs on a clone with no packet present.
- The eight checkable flags must be stated in one place.
- The prose rules must be named so a reader knows what was skipped.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: The report checks eight syntactic flags and names the three prose rules in a `notChecked` list.

**How it works**: The flags are timeout, permissions, concurrency, switch, SHA pin, README row, `pull_request_target` and `${{ github.event` in a `run:`. `notChecked` is the fixed list `path-parity`, `shell-strict-mode`, `matrix-guidance`.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Eight flags plus a stated skip list (chosen)** | Every claim is checkable, and the gap is named | Three rules stay unchecked | 9/10 |
| Parse every rule | No gap | A prose rule cannot be parsed without a second copy | 2/10 |
| Report nothing and point at the packet | No false pass | The report has no drift column | 4/10 |

**Why this one**: A named gap is honest, and a parsed prose rule would drift from the packet.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Every flag the report prints is reproducible from the file.
- The `notChecked` list tells a reader where to look next.

**What it costs**:
- Three rules need a human read. Mitigation: the scaffold and the review surface both load the full packet.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader treats `notChecked` as a pass | M | The output labels the list `not checked`, and the presentation says the packet owns those rules |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A false pass is worse than a named gap |
| 2 | **Beyond Local Maxima?** | PASS | Three scopes were weighed |
| 3 | **Sufficient?** | PASS | Eight flags cover the machine-checkable rules |
| 4 | **Fits Goal?** | PASS | It is the report's drift column |
| 5 | **Open Horizons?** | PASS | A new syntactic rule adds one flag and one test |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `ci-report.cjs` carries the eight flags and the `notChecked` list.
- `ci-report.test.cjs` fixes the four missing flags on the bare fixture.

**How to roll back**: Revert the command commit; the report leaves with its route.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: The report is a standalone Node script, not inline router prose

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-009-context -->
### Context

The report parses 33 YAML files, resolves six variables and walks a run list. The doctor family's other read-only routes run a script from a workflow YAML, and the route validator checks that the YAML names every declared script.

### Constraints

- The report needs `yaml`, which the `.skilled` package already carries.
- The route validator's L1 leg requires the workflow YAML to name the script.
- The report must be testable with a `gh` stub and a fixture tree.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: `ci-report.cjs` is a standalone CommonJS script invoked by `doctor-ci-report.yaml`.

**How it works**: The script resolves `REPO_ROOT` from `__dirname`, reads the tree and `gh`, prints JSON or a table, and exits 0, 1 or 2. The YAML declares `execution: read_only` and names the script in `execution.steps` so L1 passes.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone script (chosen)** | Testable with a stub, and the YAML stays declarative | One more file | 9/10 |
| Inline prose in the workflow YAML | One fewer file | No fixture test, and the parser would be prose | 2/10 |
| A doctor test-only helper | Reuses the test harness | The command would not ship the parser | 3/10 |

**Why this one**: A parser that only exists inside a prompt cannot be tested, and this parser has three edge cases.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- The parser has a fixture test and a `gh` stub.
- The YAML stays a contract rather than a program.

**What it costs**:
- One more file to keep in step with the YAML. Mitigation: the contract test asserts the YAML names the script.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The YAML and the script drift | M | L1 and the contract test both check the path |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three parser edge cases need a test |
| 2 | **Beyond Local Maxima?** | PASS | Three placements were weighed |
| 3 | **Sufficient?** | PASS | One script and one YAML |
| 4 | **Fits Goal?** | PASS | It is the report route's implementation |
| 5 | **Open Horizons?** | PASS | The script can grow a flag without touching the router |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `.skilled/commands/doctor/scripts/ci-report.cjs` and its test are created.
- `doctor-ci-report.yaml` names the script and declares the read-only contract.

**How to roll back**: Revert the command commit; the script, the YAML and the test leave together.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: The compiled-route bundle proof is an observation, not a build task

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-010-context -->
### Context

A workflow prompt should bundle `sk-code-ci`. `compiled-route.cjs` selects a surface from the hub's mode registry and an optional `--surface-hint`; it does not run `detect_surface_evidence`. Today the prompt returns `"selectionKind":"single"` with only `sk-code-review`. Phase 006 owns the surface registration.

### Constraints

- This phase's scope excludes a new `sk-code-ci` packet and its registry entry.
- The proof must still be recorded, or a reader would assume the bundle works.
- A blocked observation must not be repaired by editing a sibling phase.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: T026 records both route outputs and a verdict, and it never edits phase 006.

**How it works**: The task runs the prompt without a hint and with `--surface-hint CI`, writes both JSON lines, and writes `bundles: yes` or `bundles: no`. A `no` leaves the task blocked and the criterion `Unmet`.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Observe and record (chosen)** | The phase boundary holds, and the result is evidence | The criterion may stay Unmet | 8/10 |
| Register the surface here | The proof would pass | It duplicates phase 006 and crosses the scope lock | 1/10 |
| Skip the proof | No blocked task | A reader assumes the bundle works | 3/10 |

**Why this one**: A recorded observation is honest, and the registration belongs to the phase that owns the packet.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- The phase's own boundary is visible in its evidence.
- A missing bundle is recorded rather than hidden.

**What it costs**:
- AC-022 may stay `Unmet` until phase 006 lands. Mitigation: the phase depends on 006, and the observation names the missing registration.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The observation is read as a phase failure | L | The scratch file names phase 006 as the owner of the registration |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A bundle claim needs evidence |
| 2 | **Beyond Local Maxima?** | PASS | Three options were weighed |
| 3 | **Sufficient?** | PASS | Two route runs and one verdict |
| 4 | **Fits Goal?** | PASS | It keeps the phase inside its scope |
| 5 | **Open Horizons?** | PASS | Phase 006's landing turns the verdict to `yes` with no edit here |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `scratch/compiled-route.md` records both outputs and one verdict line.

**How to roll back**: Delete the scratch file.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: No ephemeral id enters code, an asset or a test name

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-011-context -->
### Context

The phase's documents cite R28, R29, R30 and D9. A code comment that carries one of those ids goes stale the moment the spec folder is archived, and the repository's comment-hygiene gate rejects an ephemeral-artifact pointer in a code comment.

### Constraints

- The spec documents must still cite the ids, or the trace is lost.
- The comment-hygiene gate reads `.github` and `.skilled`.
- The contract test must catch an id that slips into a command asset.
<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We chose**: No R-id, D-id or phase number enters a command asset, a script comment, a YAML asset, a test name or a commit message. The durable reason stays in the comment.

**How it works**: The contract test scans every file the phase creates or edits under `.skilled/commands/doctor/` for the three patterns. T031 greps the staged diff before each commit.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Durable reason only (chosen)** | The comment survives the spec folder | A reader cannot follow the id from code | 9/10 |
| Cite the id in the comment | The trace is one hop | The id goes stale, and the gate rejects it | 2/10 |
| Cite a spec path | The trace is one hop | The path moves, and the gate rejects it | 2/10 |

**Why this one**: The spec documents already carry the trace, and a code comment is read by someone who wants the reason.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- A code comment states a reason that does not expire.
- The commit passes the comment-hygiene gate.

**What it costs**:
- The trace lives only in the spec documents. Mitigation: the cross-reference table maps every requirement to its tasks and criteria.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An id slips into a test name | M | The contract test scans the folder, and T031 greps the staged diff |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The gate rejects an ephemeral pointer, and the id goes stale |
| 2 | **Beyond Local Maxima?** | PASS | Three trace forms were weighed |
| 3 | **Sufficient?** | PASS | One scan and one grep |
| 4 | **Fits Goal?** | PASS | REQ-008 requires it |
| 5 | **Open Horizons?** | PASS | The rule holds for every later phase |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- The command assets carry reasons, not ids.
- The contract test scans the folder, and T031 greps the staged diff.

**How to roll back**: No revert is needed; a failing scan names the file and the line.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012: A failed new trigger phrase is replaced, never an existing phrase

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Maintainer |

---

<!-- ANCHOR:adr-012-context -->
### Context

The doctor family has 18 bridges today. `doctor-phrase-reach.cjs` admits a phrase only when it reaches its own bridge as the top pick, or as the second line behind a non-doctor top pick. A new phrase can therefore fail in two ways: it reaches nothing, or it displaces a phrase an existing bridge relies on.

### Constraints

- Every phrase has three or more words.
- An existing route must not become harder to reach.
- The probe prints one row per phrase, so a failure names the phrase.
<!-- /ANCHOR:adr-012-context -->

---

<!-- ANCHOR:adr-012-decision -->
### Decision

**We chose**: When a new phrase fails, replace that phrase with a more specific new one and re-run. Never edit an existing phrase or an existing bridge.

**How it works**: The three new routes carry twelve CI-specific phrases. A failure names the phrase; the replacement must still be three or more words and must name a doctor action.
<!-- /ANCHOR:adr-012-decision -->

---

<!-- ANCHOR:adr-012-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Replace the new phrase (chosen)** | An existing route keeps its reach | A new phrase may need several attempts | 9/10 |
| Edit the existing phrase | The new bridge may win | An existing doctor route becomes harder to reach | 2/10 |
| Drop the failing phrase | No displacement | The bridge is harder to reach, and the row count drops | 5/10 |

**Why this one**: A new command must earn its reach without taking reach from a command that already has it.
<!-- /ANCHOR:adr-012-alternatives -->

---

<!-- ANCHOR:adr-012-consequences -->
### Consequences

**What improves**:
- Every existing doctor route keeps its top pick.
- The new phrases are specific enough to be unambiguous.

**What it costs**:
- A phrase may be replaced more than once. Mitigation: the failure names the phrase and the top pick it lost to.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A replacement phrase still displaces an existing bridge | M | The probe re-runs after each replacement, and T027 stops after two failures |
<!-- /ANCHOR:adr-012-consequences -->

---

<!-- ANCHOR:adr-012-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A new bridge can take an existing route's top pick |
| 2 | **Beyond Local Maxima?** | PASS | Three responses to a failure were weighed |
| 3 | **Sufficient?** | PASS | One replacement rule covers every row |
| 4 | **Fits Goal?** | PASS | It is the bridge registration's safety rule |
| 5 | **Open Horizons?** | PASS | Every later doctor route follows the same rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-012-five-checks -->

---

<!-- ANCHOR:adr-012-impl -->
### Implementation

**What changes**:
- The three new routes carry twelve CI-specific phrases.
- T027 re-runs the probe after each replacement.

**How to roll back**: Delete the three route entries and their activations; the bridge count returns to 18.
<!-- /ANCHOR:adr-012-impl -->
<!-- /ANCHOR:adr-012 -->

---
