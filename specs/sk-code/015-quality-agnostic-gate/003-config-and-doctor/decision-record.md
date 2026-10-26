---
title: "Decision Record: Phase 3: config-and-doctor"
description: "Decision record for the repository config seam, the configured checks and their trust boundary, the mutation guard, the doctor quality leg and route, and the advisor bridge rename."
trigger_phrases:
  - "config and doctor decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-config-and-doctor"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Recorded the phase 3 decisions"
    next_safe_action: "Confirm the operator-owned records at program end"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-config-and-doctor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 3: config-and-doctor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

ADR-001 to ADR-003 take operator-owned decisions from design section 1.4 at the design's default, and their status line says so. ADR-004 to ADR-010 record this phase's design decisions and two findings. `Q` is `.skilled/skills/sk-code/sk-code-quality`. The requirements are in [spec.md](spec.md), and the work that implements them is in [tasks.md](tasks.md).

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Config file name and discovery order

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing build instruction, recorded by the phase author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The gate needs one committed place for a repository's own checks. Design section 1.4 item 3 and design D16 leave the file name to the operator. sk-git already keeps `.sk-git/` at the repository root and resolves it through git config, so one rule can serve both skills.

### Constraints

- The name must not collide with a folder the framework already uses at the root.
- Discovery must follow the sk-git resolver, so operators learn one rule (`.skilled/skills/sk-git/scripts/lib/message-contract.mjs` lines 283 to 307).
- The file is committed, so it can be reviewed like any other repository setting.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `.sk-code/quality.json` at the repository root, found after `--config PATH` and the file-scoped git config value `skcode.qualityConfig`, and before the shipped defaults.

**How it works**: The resolver returns one source. A named path that does not exist exits 3 with `CONFIG_PATH_MISSING` and never falls back. Command-scope git config values are ignored, as sk-git ignores them (`message-contract.mjs` lines 284 to 291). The chosen source is reported as `config.source`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.sk-code/quality.json`** | A folder leaves room for later companion files, and one rule matches sk-git | Later files join the folder, so the folder name must stay stable | 8/10 |
| `.sk-code.json` at the root | One file, fewer folders | One more root dotfile, and no room for companion files | 6/10 |
| A local override file | Operators can change checks without a commit | A required check could be disabled silently, which the design forbids | 3/10 |

**Why this one**: It matches sk-git's layout and resolver, and it leaves room for companion files without a second rule.

**Reversal**: Change the path constant in `quality-config.cjs`, the discovery list, the template path in `sk-code-quality-config.cjs` and the reference. Tell operators the new path in the changelog.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One committed file, and one discovery rule across the sk-code and sk-git skills.
- The path is reviewable in a pull request, and `init` refuses to overwrite it.

**What it costs**:
- A later rename moves the template path and the reference. Mitigation: one path constant and one test.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A repository already keeps a `.sk-code/` folder for another purpose | M | `init` refuses an existing `quality.json`, and the reference names the folder's purpose |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Design D16 requires one committed config before any configured check can exist |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives were scored above |
| 3 | **Sufficient?** | PASS | One path, one resolver and one test cover every source |
| 4 | **Fits Goal?** | PASS | The configured checks and the doctor route depend on it |
| 5 | **Open Horizons?** | PASS | The folder leaves room for later companion files |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `Q/scripts/lib/quality-config.cjs` holds the discovery function.
- `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` uses the same function for `status`, `init` and `check`.
- `Q/references/quality-config.md` states the rule.

**How to roll back**: Restore the previous discovery list in `quality-config.cjs`, and revert the reference and the template path in the same change.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Merge rule for layered config

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing build instruction, recorded by the phase author |

---

<!-- ANCHOR:adr-002-context -->
### Context

Design section 1.4 item 3 leaves the merge rule to the operator. The shipped base layer and a repository layer both contribute to the gate. A merge rule that lets a repository key replace a core rule would let a repository turn off the Comment Hygiene HARD BLOCK or a required check.

### Constraints

- The core comment patterns enforce the Comment Hygiene HARD BLOCK (`AGENTS.md` lines 32 to 34), so no repository layer can remove them.
- Commands come only from the repository layer (design section 4.5).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a per-field merge. Only the repository layer declares `checks`, and a duplicate `id` is a config error. `checklists` and `generated` append across layers. `commentHygiene` lists append, and the core patterns stay. `sensors` merge per sensor. An `exact` sensor accepts `exclude` only, and `enabled: false` on it is a config error. A heuristic sensor may set `enabled: false`.

**How it works**: The merge function takes the base layer and the repository layer, applies each field's rule, and returns the merged config with every rejected value listed in `config.errors`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-field merge** | Core rules cannot be removed, and each field has one meaning | More rules to test | 9/10 |
| Last layer wins per key | Simple to explain | A repository key can replace a core pattern or disable an exact sensor | 2/10 |
| Union of checks across layers | No duplicate handling | Only one layer declares checks, so the union adds nothing | 5/10 |

**Why this one**: It keeps the enforced core intact, and each merge rule has a test.

**Reversal**: Change the merge function and the matching row in `quality-config.md`. The schema does not change.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A repository can add checks and ticket prefixes, and cannot weaken the core.

**What it costs**:
- Reviewers must read the merge table to know why a sensor refused `enabled: false`. Mitigation: the reference carries the table.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A new sensor field is added without a merge rule | M | The schema test rejects unknown sensor fields |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Design section 4.2 needs a rule for every layered field |
| 2 | **Beyond Local Maxima?** | PASS | Three rules were scored |
| 3 | **Sufficient?** | PASS | One rule per field kind |
| 4 | **Fits Goal?** | PASS | Protects the HARD BLOCK and the trust boundary |
| 5 | **Open Horizons?** | PASS | New fields need one new row |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `Q/scripts/lib/quality-config.cjs` holds the merge function.
- `Q/references/quality-config.md` holds the merge table.

**How to roll back**: Revert the merge function and the table in one change. No stored data depends on the merge.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Config hygiene additions reach the author gate only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, by standing build instruction, recorded by the phase author |

---

<!-- ANCHOR:adr-003-context -->
### Context

Design D6 keeps CI and pre-commit at whole-file scope, and design section 1.4 item 4 leaves a move to changed-line scope to the operator. Design risk 6 says pre-commit runs from a temporary copy of staged blobs, so it cannot read a working-tree config safely.

### Constraints

- The CI and pre-commit layers must not block a commit for a repository value they cannot see.
- The author gate must still apply the repository's ticket prefixes.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: repository hygiene additions tighten only the author gate. CI and pre-commit keep the core set and whole-file scope.

**How it works**: The author gate passes the validated `commentHygiene` values to the checker as arguments. The CI workflow and the pre-commit hook call the checker as they do today.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Author gate only** | No new blocking surface in CI or pre-commit | A repository value can block locally but not on push | 7/10 |
| Pass the config into CI and pre-commit | One rule everywhere | Pre-commit cannot read the working-tree config safely (design risk 6) | 3/10 |
| Changed-line scope for CI and pre-commit | Fewer legacy failures | Operator item 4 is open, and it changes a HARD BLOCK layer | 4/10 |

**Why this one**: It adds no blocking surface where the design says it cannot read safely, and it leaves the operator's open item open.

**Reversal**: Teach the two layers to read the staged config, then pass it through the same arguments.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- CI and pre-commit behavior does not change in this phase.

**What it costs**:
- A repository value can fail locally and pass in CI. Mitigation: the reference names the gap, and the author gate runs before push.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operators assume CI enforces their ticket prefixes | M | The reference states the scope in its first section |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Design D6 and risk 6 require a decision on reach |
| 2 | **Beyond Local Maxima?** | PASS | Three scopes were scored |
| 3 | **Sufficient?** | PASS | No layer change is needed for the author gate |
| 4 | **Fits Goal?** | PASS | Keeps the blocking layers unchanged |
| 5 | **Open Horizons?** | PASS | Teaching the layers to read staged config stays open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `Q/scripts/quality-gate.cjs` passes commentHygiene values to the checker.
- No CI or pre-commit file changes.

**How to roll back**: Remove the argument pass-through in `quality-gate.cjs`. The layers were never changed.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Committed checks run, suggestions never run

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from design D7 |

---

<!-- ANCHOR:adr-004-context -->
### Context

A command read from a manifest, such as a `lint` script, runs repository code that nobody named. Design section 1.4 does not list this. Design D7 settles it.

### Constraints

- An unknown command must never run on an UNKNOWN surface (design section 1.1 and `sk-code` shared stack-detection, UNKNOWN row).
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: a check runs only when the repository config names it. A command read from a manifest appears under `suggested_checks` with the exact config entry that would enable it, and it never runs.

**How it works**: `suggested_checks` is built from the manifest readers. `--no-run` lists the configured checks with state `LISTED`.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Committed only** | The operator names every command | A repository must write its config before the gate runs a check | 9/10 |
| Run discovered scripts by default | Checks run out of the box | Runs repository code nobody named | 2/10 |
| Opt-in `--run-checks` for committed checks | Explicit at every run | Committed checks never run in agent sessions | 4/10 |

**Why this one**: It keeps the operator in charge of every command, and it still tells the operator what to enable.

**Reversal**: Add a `--run-suggested` flag, which the design would need to amend.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- No command runs that the repository did not name.

**What it costs**:
- A new repository needs one `init --apply` before its checks run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A suggestion is enabled without reading it | M | `init` shows each command in its dry-run plan before `--apply` |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Design D7 and section 4.4 |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One rule covers every manifest reader |
| 4 | **Fits Goal?** | PASS | Trust boundary for the gate |
| 5 | **Open Horizons?** | PASS | Flag reversal is open if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `Q/scripts/quality-gate.cjs` builds `suggested_checks`.
- `Q/scripts/lib/run-check.cjs` spawns only configured entries.

**How to roll back**: Stop emitting `suggested_checks` and restore the previous verdict fields. No command ever ran from a suggestion, so no state needs reverting.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Argv arrays, no shell, and a timeout per command

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from design D8 |

---

<!-- ANCHOR:adr-005-context -->
### Context

A shell string is a quoting and injection surface, and it behaves differently across shells. The dist checker runs its rebuild command with `shell=True` and a 180-second budget (`.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` lines 153 to 158), which shows the cost.

### Constraints

- Commands must run the same way under every shell the operator uses.
- A timed-out tool can leave children running.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: each command is an argv array, spawned with `shell: false` under its own timeout, and the runner kills the process group on timeout on POSIX.

**How it works**: The config supplies `argv` as a JSON array. The runner expands `{files}` into file arguments and passes the array to the spawn call without a shell.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Argv array** | No quoting surface, same behavior in every shell | Writers must split arguments themselves | 9/10 |
| Shell string | Short to write | Quoting and injection surface, shell-specific | 3/10 |
| Argv array and a kill of the direct child only | Simpler kill | A forked tool can survive the timeout | 6/10 |

**Why this one**: It removes the injection surface, and the group kill covers forked tools on POSIX.

**Reversal**: Replace the spawn call. No config change is needed because the schema already stores arrays.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A shell metacharacter in a check reaches the program as text.

**What it costs**:
- A config writer must split arguments. Mitigation: the reference gives examples.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Windows `.cmd` shims need their full name in argv | M | Windows stays UNKNOWN in this phase, and the open question says so |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Design D8 |
| 2 | **Beyond Local Maxima?** | PASS | Three spawn styles were scored |
| 3 | **Sufficient?** | PASS | Argv plus timeout plus group kill |
| 4 | **Fits Goal?** | PASS | Trust boundary |
| 5 | **Open Horizons?** | PASS | Windows support is named as open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `Q/scripts/lib/run-check.cjs` holds the spawn call and the group kill.

**How to roll back**: Revert `run-check.cjs` to the phase 002 version, which spawns the built-in checker only.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Content-hash mutation guard and its ownership split

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from design D9 |

---

<!-- ANCHOR:adr-006-context -->
### Context

A porcelain status check misses a second edit to a file that is already modified, because the status code does not change. Design D9 hashes content. The design also places the snapshot helper in phase 2's fixture invariant (design section 6.1) and the runtime guard in phase 3 (design section 7), so the ownership needs a stated split.

### Constraints

- The runner never reverts a file, because reverting is destructive.
- `git hash-object` without `-w` writes nothing to the object store.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: a snapshot made of `git diff --binary HEAD`, the untracked list from `git ls-files --others --exclude-standard -z`, and the `git hash-object` of each untracked file without `-w`. A changed snapshot after a check ends the run with exit 3 `CHECK_MUTATED_WORKSPACE`, listing the changed paths. A repository with no commit diffs against the empty tree `4b825dc642cb6eb9a060e54bf8d69288fbee4904`, which this phase confirms with `git hash-object -t tree /dev/null`. Git writes an object only with `-w`, as the [git-hash-object documentation](https://git-scm.com/docs/git-hash-object) describes. Without git the guard is unavailable, and configured checks report `GUARD_UNAVAILABLE`.

**How it works**: Phase 2 ships the snapshot function, and its fixtures use it as the read-only invariant. Phase 3 wraps each configured spawn with two snapshots and compares them.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Content hash of the working tree** | Catches a second edit to a modified file | Costs time on large diffs (design risk 12) | 9/10 |
| Porcelain status only | Cheap | Misses a second edit to an already modified file | 3/10 |
| Revert the changes after a mutation | Restores the tree | Destructive, and the mode has no authority to revert | 1/10 |

**Why this one**: It detects every content change, and it leaves reverting to the operator.

**Reversal**: Replace the snapshot function. The exit code and the verdict fields stay the same.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A check that rewrites a file ends the run and names the file.

**What it costs**:
- Two snapshots per configured check. Phase 6 measures the cost against the design budget.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A large untracked file slows the snapshot | M | Phase 6 measures it, and the reference notes the cost |
| A repository without git gets no guard | H | Configured checks report `GUARD_UNAVAILABLE` and cannot pass |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Design D9 and risk 3 |
| 2 | **Beyond Local Maxima?** | PASS | Three guard designs were scored |
| 3 | **Sufficient?** | PASS | Content hash covers the cases that status misses |
| 4 | **Fits Goal?** | PASS | Trust boundary for configured commands |
| 5 | **Open Horizons?** | PASS | Cost is measured in phase 6 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `Q/scripts/lib/run-check.cjs` wraps each configured spawn with the snapshot function from phase 2.

**How to roll back**: Remove the wrapper. The configured checks then run without the guard, so the change must not ship that way.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Doctor quality leg is read-only, and the quality route is separate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from design D17 |

---

<!-- ANCHOR:adr-007-context -->
### Context

The setup battery promises that nothing is written (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` lines 17 and 18), and its route is `read-only` (`.skilled/commands/doctor/_routes.yaml` line 232). Writing the config is a separate act, and it needs approval.

### Constraints

- The battery keeps its contract.
- The route follows the `/doctor:git standards` precedent, which dry-runs `init`, then copies once after approval (`_routes.yaml` lines 261 to 275, and `.skilled/commands/doctor/git.md` line 88).
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: a read-only `quality` leg in the battery, and a separate `quality` target with `mutating: mutates`. Its `init` is a dry run until `--apply`. `--apply` writes the file once, through a temporary file hard-linked to the target, so a second apply fails. The design says "refuses" for the second apply, so this phase makes it exit 1 with `CONFIG_EXISTS`, while `git-standards.cjs` reports the file as kept. The design's acceptance wins.

**How it works**: `init` prints the template with each suggestion written as `required: false`, and the approval step shows that list before `--apply`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-only leg and separate route** | The battery contract holds, and the write has its own approval | Two surfaces to learn | 9/10 |
| `--init` flag on the battery | One command | Breaks the read-only contract (design D17) | 2/10 |
| Silent apply on the first run | Fewer steps | Writes without approval | 1/10 |

**Why this one**: It keeps the battery's promise, and it puts the one write behind approval.

**Reversal**: Remove the target from `_routes.yaml` and delete its YAML asset, as the route header describes.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The battery stays read-only, and the route shows the plan before any write.

**What it costs**:
- Two commands to learn. Mitigation: the setup presentation lists both.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Approval fatigue leads to a blind apply | M | The route shows each enabled command before `--apply` |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The route needs a write that the battery cannot make |
| 2 | **Beyond Local Maxima?** | PASS | Three placements were scored |
| 3 | **Sufficient?** | PASS | One write, one approval |
| 4 | **Fits Goal?** | PASS | Config creation on the critical path |
| 5 | **Open Horizons?** | PASS | Other doctor targets can follow the same shape |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.skilled/commands/doctor/_routes.yaml` gains the `quality` target.
- `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` holds the workflow.
- `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` holds `init`.

**How to roll back**: Remove the target, its YAML asset and its script. The battery leg stays read-only and can stay.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Advisor bridge for the two targets replaces the single id

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from the bridge deriver |

---

<!-- ANCHOR:adr-008-context -->
### Context

This decision is a finding the design does not record. The bridge deriver names a command with several targets `command-doctor-<command>-<target>` (`derive-command-bridges.cjs` lines 194 to 199). Adding `quality` to `/doctor:sk-code` turns the existing `command-doctor-sk-code` bridge into two ids. The deriver throws on an unknown inventory id (line 336), and five runtime files and `scoring-compatibility.json` name the old id.

### Constraints

- The advisor must keep recommending `/doctor:sk-code` for setup requests.
- A quality request must reach the quality target, not the setup target.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: replace `command-doctor-sk-code` with `command-doctor-sk-code-setup` and `command-doctor-sk-code-quality`, in `scoring-compatibility.json`, `projection.ts`, `render.ts`, `skill_advisor.py`, the two advisor tests, and the generated bridge file.

**How it works**: The deriver emits one bridge per target. Each bridge carries its own trigger phrases from `_routes.yaml`.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two target bridges** | Matches the git precedent (`command-doctor-git-hooks`, `-setup`, `-standards`) | Touches five runtime files | 9/10 |
| Keep one bridge and route quality through the setup bridge | No runtime change | Quality requests reach the setup target | 2/10 |
| A non-doctor id for the quality bridge | Avoids the rename | The deriver names doctor bridges by command | 3/10 |

**Why this one**: It follows the git precedent, and it routes each request to its own target.

**Reversal**: Restore the single id, drop the quality target from `_routes.yaml`, and regenerate the bridge file.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Quality requests reach the quality target, and the advisor ranks each target on its own phrases.

**What it costs**:
- Five runtime files and two tests change. Mitigation: REQ-015 greps the old id, and the advisor tests run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed reference makes the advisor drop a bridge | H | The grep in AC-015 must print nothing |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The deriver cannot emit the old id once a second target exists |
| 2 | **Beyond Local Maxima?** | PASS | Three placements were scored |
| 3 | **Sufficient?** | PASS | Two ids cover both targets |
| 4 | **Fits Goal?** | PASS | Routing the quality request correctly |
| 5 | **Open Horizons?** | PASS | Later targets follow the same rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- Six advisor files named in the decision change, and the generated bridge file is regenerated.

**How to roll back**: Restore the single id in those files, drop the quality target, and rerun the deriver.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Battery quality leg is one leg with five checks, and the count becomes nine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from design section 5.8 |

---

<!-- ANCHOR:adr-009-context -->
### Context

Design section 5.8 calls the quality part "a read-only quality leg with five checks". The battery prints one line per leg and ends with `STATUS=OK legs=8` (`doctor-sk-code-setup.yaml` lines 49 to 58). The battery test asserts eight PASS lines (`sk-code-setup-check.test.cjs` line 119). The sk-code playbook repeats the eight-leg count in DOC-382 and its battery document.

### Constraints

- The battery prints one PASS, FAIL, SKIP line per leg.
- Every count that describes the battery must match its output.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: one new leg named `quality` with five sub-checks, which raises the count to nine. The count moves in the YAML, the test, the playbook and the battery's last line.

**How it works**: The leg runs its five sub-checks in check-only form. A failing sub-check prints its repair line under the leg.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One leg with five sub-checks** | One line in the leg table, one count change | The sub-check results are in the repair text | 8/10 |
| Five separate legs | Each check has its own line | Five count changes, and the table grows by five rows | 4/10 |
| No count change, quality outside the battery | No test change | The battery would not show quality readiness | 3/10 |

**Why this one**: It shows readiness in one row, and the count change is contained.

**Reversal**: Remove the leg, and restore the count to eight in the YAML, the test and the playbook.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- The battery reports quality readiness in its usual table.

**What it costs**:
- Four documents change their count. Mitigation: AC-020 greps the old count.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The quality leg runs the quality test suite and slows the battery | M | The battery time is recorded before and after, and not gated (NFR-P02) |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Section 5.8 asks for the leg |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes were scored |
| 3 | **Sufficient?** | PASS | One leg carries five checks |
| 4 | **Fits Goal?** | PASS | Doctor readiness |
| 5 | **Open Horizons?** | PASS | More sub-checks can join the leg |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` gains the leg.
- The YAML asset, the battery test, the hub playbook and DOC-382 change their counts.

**How to roll back**: Remove the leg and restore the count of eight in the four documents.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Presentation text extends the existing sk-code presentation file

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Phase author, from the git route precedent |

---

<!-- ANCHOR:adr-010-context -->
### Context

Design section 5.8 says the route has "its presentation text" without naming a file. The doctor precedent puts all targets of one command in one presentation file. `/doctor:git` uses `doctor-git-presentation.txt` for its hooks, standards and setup targets, and `/doctor:sk-code` already has `doctor-sk-code-presentation.txt`.

### Constraints

- The command doc points to one presentation file for visible wording (`sk-code.md` section 5).
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: add the quality sections to `doctor-sk-code-presentation.txt`, and change its argument failure wording from "setup" alone to "setup or quality".

**How it works**: The command doc's presentation boundary keeps pointing to one file, and the quality YAML asset names that file.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend the existing file** | Matches the precedent, one place for wording | The file grows | 9/10 |
| A new `doctor-sk-code-quality-presentation.txt` | Smaller files | Two sources of truth for one command | 3/10 |

**Why this one**: It matches the git precedent, and the command doc keeps one pointer.

**Reversal**: Move the quality sections into a new file and update the pointer in `sk-code.md`.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- One presentation file per command.

**What it costs**:
- The file grows by one section. Mitigation: the section headings keep it navigable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The argument wording drifts from the router | L | The route validator and AC-012 check the router |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The route needs visible wording |
| 2 | **Beyond Local Maxima?** | PASS | Two placements were scored |
| 3 | **Sufficient?** | PASS | One file covers both targets |
| 4 | **Fits Goal?** | PASS | Presentation contract |
| 5 | **Open Horizons?** | PASS | More targets can add a section |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` gains the quality sections.

**How to roll back**: Remove the quality sections and restore the argument wording.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

