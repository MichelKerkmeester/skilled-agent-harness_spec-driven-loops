---
title: "Decision Record: Phase 4: private-local-skills"
description: "The decisions that fix how the two private skills are restored, where they live, when this phase may start, and what stays out of the tracked tree."
trigger_phrases:
  - "private local skills decision record"
  - "folder mode decision"
  - "private skill restore decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/004-private-local-skills"
    last_updated_at: "2026-10-23T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored seven decision records"
    next_safe_action: "Record the operator's folder mode in ADR-001, then execute the tasks"
    blockers:
      - "ADR-001 folder mode is pending the operator's decision"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-004-private-local-skills"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Real folder or symlink to a private repository?"
    answered_questions: []
---
# Decision Record: Phase 4: private-local-skills

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Restore each private skill as a real folder or as a symlink to a private repository

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Pending operator decision |
| **Folder mode** | Not chosen |
| **Private repository root** | Not chosen |
| **Date** | 2026-10-23 |
| **Deciders** | The operator, who owns the private content; the phase planner records the choice |

---

<!-- ANCHOR:adr-001-context -->
### Context

The two surfaces come back as gitignored skills at `.skilled/skills/local-webflow/` and
`.skilled/skills/local-obsidian/`. Two shapes are legal at those paths, and they differ in where the
bytes live, not in what the advisor sees:

- **Mode A, a real folder.** The 161 Webflow files and the 65 Obsidian files sit inside the checkout,
  under `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`.
- **Mode B, a symlink.** The same trees live in a private repository the operator owns, and each
  `.skilled/skills/local-*` path is a symlink to one folder in that repository.

Phase 1's ignore rules match both shapes because `/.skilled/skills/local-*` carries no trailing slash.
Phase 3's scans follow a top-level `local-*` symlink only when its realpath sits inside the skills
root or a path listed in `SPECKIT_PRIVATE_SKILL_ROOTS`, so Mode B needs that variable set for the
advisor daemon and Mode A needs nothing.

The choice is one decision, taken once, and it changes only the restore task pair the implementer
runs. Everything after the restore addresses `.skilled/skills/local-*`, which resolves in both modes.

### Constraints

- Ignored files never travel between checkouts, so both modes write inside the operator's main
  checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
- Mode B stores an absolute link target, so the private repository must not move after the link is
  created; a moved repository leaves a dangling link that the advisor skips.
- Mode B needs `SPECKIT_PRIVATE_SKILL_ROOTS` in the environment of every advisor process that should
  see the skills; the operator's shell and the daemon inherit it from the same profile.
- Mode A makes the private bytes part of every backup and every local disk copy of the checkout.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: not yet chosen. The status stays `Pending operator decision` until the operator records
one of the two answers below in the metadata table.

**Option A, real folder.** Set `Status` to `Accepted: real folder`, `Folder mode` to `real folder`, and
`Private repository root` to `n/a`. The restore task pair is T003 and T004.

**Option B, symlink to a private repository.** Set `Status` to `Accepted: symlink to a private
repository`, `Folder mode` to `symlink`, and `Private repository root` to the absolute path of the
private repository. The restore task pair is T005 and T006, and every advisor scan exports
`SPECKIT_PRIVATE_SKILL_ROOTS` with that path.

**How it works**: the implementer reads the three cells before the restore and runs exactly one task
pair. A pending status stops the run before any file is written.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A, real folder** | No configuration; the advisor sees the skill with no environment variable; one checkout holds everything; `git check-ignore` and the commit guard cover it unchanged | The private bytes join every local copy and backup of the checkout; a worktree checkout cannot see them | 8/10 |
| **B, symlink to a private repository** | The private repository keeps its own history and remotes; the public checkout holds two links; a second machine can clone the private repository and relink | Needs `SPECKIT_PRIVATE_SKILL_ROOTS` for every advisor process; an absolute target breaks when the repository moves; the link is invisible to any tool that does not follow symlinks | 7/10 |
| **A real folder inside the private repository only, with no link** | Nothing to misconfigure | The advisor never sees the skill, so phase 5's routing probe cannot pass | 2/10 |
| **Copy the trees into both checkouts** | Each checkout is self-contained | Ignored files never travel, so the copies drift with no record of which one is current | 2/10 |

**Why this one**: the operator decides, because the trade is private-data placement against
configuration surface. The phase does not prefer either mode and both paths are written out in full.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The operator keeps the Webflow and Obsidian evidence without shipping it.
- The chosen shape is recorded in one place, so a later session reads the answer instead of asking again.

**What it costs**:
- Mode B adds one environment variable to every advisor process. Mitigation: `plan.md` Step 9 and
  T095 export it, and `implementation-summary.md` records the absolute path.
- Mode A adds roughly 2 MB of ignored content to the checkout. Mitigation: both paths are gitignored
  and the commit guard refuses a staged `local-*` path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A pending decision stalls the phase | M | T002 stops with `BLOCKED` before any write, so nothing is left half-restored |
| A Mode B link points outside the trusted roots | H | T095 exports `SPECKIT_PRIVATE_SKILL_ROOTS` before the scan, and AC-014 fails if the nodes are absent |
| The private repository moves after the link is made | M | `implementation-summary.md` records the absolute path, and the link is recreated from it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent packet requires both skills to exist at `.skilled/skills/local-*`, and phase 5 probes their routing |
| 2 | **Beyond Local Maxima?** | PASS | Four shapes were scored; the two viable ones differ in where the bytes live, not in what the advisor reads |
| 3 | **Sufficient?** | PASS | One metadata table holds the answer, and one task pair consumes it |
| 4 | **Fits Goal?** | PASS | The restore is the phase's first write and everything else edits its output |
| 5 | **Open Horizons?** | PASS | Either mode can be reversed by deleting two ignored paths and re-running the other pair |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `decision-record.md`: three metadata cells record the answer.
- `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`: created as real folders (T003, T004) or as symlinks to the private repository (T005, T006).

**How to roll back**: delete the two paths with `rm -rf .skilled/skills/local-webflow .skilled/skills/local-obsidian`. In Mode B this removes the links and leaves the private repository untouched; then set the three cells back to `Pending operator decision`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: This phase starts only after phase 003's compiler skip is on main

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet planner, following the research synthesis finding on compiler symlink traversal |

---

<!-- ANCHOR:adr-002-context -->
### Context

`discover_graph_metadata` in `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`
lists every entry under the skills directory with `os.listdir` and tests `os.path.isfile(entry/graph-metadata.json)`.
That test follows a symlink. A `local-*` symlink created before phase 003 lands is therefore
discovered by the compiler and exported into the tracked `runtime/scripts/skill-graph.json`, which is
the public fallback graph. The research synthesis records the follow as confirmed at
`skill_graph_compiler.py:200-203` and requires phase 004 not to start before phase 003's skip lands.

Phase 003 adds three lines to that loop, with this exact text:

```python
        # A private skill lives only in the operator's checkout, so compiling it
        # would write its signals into the tracked fallback graph.
        if entry.startswith("local-"):
            continue
```

### Constraints

- The skip must be on `origin/main`, not only in a local branch, because the phase's docs commit pushes to main.
- A real folder is skipped by the same test, so the gate protects both folder modes.
- The gate must be a command a non-interactive implementer can run and read, with an exact expected value.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: make the phase's first task a read-only gate that proves the skip is present on
`origin/main` and in the working tree, and stop the run when either check does not return `1`.

**How it works**: T001 runs `git fetch origin main`, then greps the skip line from the compiler at
`origin/main` and from the checkout's own copy. Two `1` counts let the phase proceed; any
other count stops it with `BLOCKED: phase 003 compiler skip is not on main`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gate on the exact skip text** | Machine-checkable; proves the behavior, not a commit message | Ties the gate to three lines of text that a later refactor could reword | 9/10 |
| Gate on a phase 003 commit SHA | Simple | The planner does not know the SHA before phase 003 lands, and a squash merge changes it | 4/10 |
| Trust the phase order and skip the gate | No work | A phase that runs early exports private signals into a tracked file, and nothing notices until phase 5 | 1/10 |
| Gate on the tracked `skill-graph.json` containing no `local-` id | End-state proof | It proves the last export, not the compiler's next run | 5/10 |

**Why this one**: the skip text is the behavior that protects the tracked graph, and both counts are
exact, so the implementer never has to judge whether phase 003 "looks landed".
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No private skill can reach the tracked fallback graph through a symlink.
- A phase-004 run started too early fails at task one, before any file is written.

**What it costs**:
- Phase 003 must land first, which serializes two phases that could otherwise overlap. Mitigation:
  phase 003 is already the predecessor in the parent's phase map.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 003 rewords the skip and the grep stops matching | M | AC-001's expected count is `1`; a reworded skip fails the gate loudly rather than silently |
| The operator's checkout is behind `origin/main` | L | T001 fetches before it reads, and checks the working copy as well |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The compiler follows a symlink today; the gate is the only thing that keeps private bytes out of the tracked graph |
| 2 | **Beyond Local Maxima?** | PASS | Four gate designs were scored; the text gate is the only one that survives a squash merge |
| 3 | **Sufficient?** | PASS | Two greps and one fetch cover both the remote and the checkout that runs the scan |
| 4 | **Fits Goal?** | PASS | The gate protects the phase's own output from leaking before it exists |
| 5 | **Open Horizons?** | PASS | The same gate shape can be reused by phase 5 for its own ordering checks |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `tasks.md` T001: the gate command, its expected counts, and its stop condition.
- `acceptance-criteria.md` AC-001: the same proof as a closure criterion.

**How to roll back**: nothing to undo; the task is read-only. Delete T001 and AC-001 if the gate is ever withdrawn.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The private trees live only in the operator's main checkout, and only this phase's documents are committed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet planner, following the parent packet's checkout rule |

---

<!-- ANCHOR:adr-003-context -->
### Context

Git ignores are per-worktree in effect: an ignored file created inside
`.worktrees/215-private-surface-level3-plans` stays there. It never appears in
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, which is the checkout the
operator's advisor scans. A restore run in the worktree would therefore produce a skill the operator
cannot route, and removing the worktree would delete the evidence with no trace.

The phase's own documents have the opposite property: they exist only in the worktree, because the
packet is being planned there and the operator's checkout is on `main` without them.

### Constraints

- The advisor daemon scans the operator's main checkout.
- The packet's planning and completion commits go to `main` through the worktree.
- No packet document may be copied between the two checkouts, because two copies drift.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: run every command that creates, reads or edits `.skilled/skills/local-*` in
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, and run every packet-document
edit and the single commit in the authoring worktree
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/215-private-surface-level3-plans`.

**How it works**: each task names its checkout. Evidence is transcribed from readings taken in the
operator's checkout into the worktree copy of `implementation-summary.md`; the commit stages that
worktree copy by name and pushes `HEAD:main`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Split by what each checkout holds** | The advisor sees the skills; the documents stay with the packet; no copy bridge | Every task must name its checkout | 9/10 |
| Restore inside the worktree | One checkout for everything | The operator's advisor never sees the skills, and deleting the worktree deletes them | 1/10 |
| Copy the documents into the operator's checkout | One checkout at commit time | Two copies drift, and the operator's checkout would carry uncommitted packet edits | 3/10 |
| Commit from the operator's checkout after copying the docs back | Familiar git flow | Same drift, plus a copy step nobody verifies | 2/10 |

**Why this one**: the split follows the two facts that cannot be changed, ignored files stay put and
packet documents exist only in the worktree.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The operator's advisor indexes both skills immediately after the restore.
- The commit contains only packet documents, so no private path can ride along.

**What it costs**:
- The implementer works in two directories. Mitigation: every task states its checkout in the first
  line of its command block, and the paths are absolute.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A command runs in the wrong checkout | H | T001, T003 to T012 and T088 to T095 name the operator's checkout; T096 to T109 name the worktree |
| A packet document is edited in the operator's checkout | M | The operator's checkout holds no copy, so the edit fails rather than diverging |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ignored files do not travel between checkouts; the split is forced |
| 2 | **Beyond Local Maxima?** | PASS | Four arrangements were scored; none avoids the two-checkout fact |
| 3 | **Sufficient?** | PASS | Absolute paths in every command block remove the ambiguity |
| 4 | **Fits Goal?** | PASS | The phase exists to give the operator's advisor the skills |
| 5 | **Open Horizons?** | PASS | The same rule applies to phase 5's probes, which run in the operator's checkout |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `tasks.md`: every task names its checkout.
- `plan.md` Step 0 and Step 10: the checkout rule in prose.

**How to roll back**: no state to revert; the rule only chooses where commands run.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Restore with `git archive` piped through `tar --strip-components=4`, pinned to one commit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet planner |

---

<!-- ANCHOR:adr-004-context -->
### Context

Both surfaces exist at commit `42b41dd286` and nowhere else in the working tree after phase 2. The
restore must reproduce the archived tree byte for byte, must not touch the index, and must be
repeatable so a partial run can be repaired by re-running it.

### Constraints

- Phase 2 deletes both surface folders, so a working-tree copy is not a source.
- The destination is gitignored, so a restore that stages anything is a defect.
- `--strip-components=4` must drop `.skilled/skills/sk-code/<surface>/` exactly.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: restore each tree with
`git archive 42b41dd286 .skilled/skills/sk-code/<surface> | tar -x --strip-components=4 -C <destination>`,
pinned to the same commit for both trees.

**How it works**: `git archive` reads the object database, never the index or the working tree, and
`tar` writes the four-level-stripped paths into the destination. Re-running the same pipeline
produces the same bytes.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pinned `git archive` plus `tar --strip-components=4`** | Byte-identical, index-free, idempotent | Needs the commit in the local object database | 9/10 |
| `git checkout 42b41dd286 -- <paths>` | One command | Writes the index and the working tree at the old path, so it stages 226 tracked files | 2/10 |
| `git restore --source` | Familiar | Same index problem, and the old path is what it restores | 2/10 |
| Copy from a second clone at the old commit | No local object requirement | A second clone to keep in sync, and no proof the bytes match | 4/10 |

**Why this one**: it is the only option that cannot stage a path and that reproduces the same bytes on
a second run.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The restored tree matches the archive exactly, including file modes.
- Nothing is staged, so the commit guard has nothing to refuse.

**What it costs**:
- The commit must exist locally. Mitigation: T001 checks `git cat-file -t 42b41dd286` returns `commit`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The commit is absent from a fresh clone | H | T001 stops before any write |
| `--strip-components` is off by one | M | AC-003 counts 161 and 65 entries against the archive's own count |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 2 removes the working-tree source |
| 2 | **Beyond Local Maxima?** | PASS | Four restore mechanisms were scored |
| 3 | **Sufficient?** | PASS | Two pipelines and one count check per tree |
| 4 | **Fits Goal?** | PASS | The restored tree is the phase's input |
| 5 | **Open Horizons?** | PASS | The same pipeline restores either tree on any machine with the commit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`: created by T003 and T004 (Mode A) or T005 and T006 (Mode B).

**How to roll back**: `rm -rf` the two ignored paths and re-run the chosen pair.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Replace the six workflow symlinks with real copies written from the pinned commit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet planner |

---

<!-- ANCHOR:adr-005-context -->
### Context

`git archive` preserves symlinks. Each restored skill therefore carries
`references/workflow-{implement,debug,verify}.md` as links to `../../shared/references/`, a path that
resolved from `.skilled/skills/sk-code/sk-code-<surface>/references/` and does not resolve from
`.skilled/skills/local-<surface>/references/`.

A `cp` onto an existing symlink writes through the link into the tracked hub file, which would modify
a tracked path and leak the phase into the public tree.

### Constraints

- The copy source must be the pinned commit, not the working tree, because phase 2 may have removed or edited the hub tier.
- The link must be removed before the copy, on every one of the six paths.
- The copies must be byte-identical to the archived originals.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: `rm` each symlink, then write the replacement with
`git show 42b41dd286:.skilled/skills/sk-code/shared/references/workflow-<phase>.md > <destination>`.

**How it works**: `rm` removes the link itself, not its target, so the tracked hub file is never
opened for writing. `git show` reads the pinned blob, so the copy is byte-identical whatever the
working tree holds.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`rm` then `git show` redirect** | Cannot write through the link; pinned bytes | Six two-command tasks | 9/10 |
| `cp` from the hub working tree | One command | Writes through the link into a tracked file | 1/10 |
| `cp --remove-destination` | One command, removes the link first | GNU-only flag; macOS `cp` has no equivalent | 3/10 |
| Leave the symlinks and recompute their targets | Fewer files | A private skill depending on a public hub path, and the link breaks when the hub moves | 2/10 |

**Why this one**: it is the only portable form that both removes the link and pins the content.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- No tracked hub file is opened for writing during the phase.
- The three workflow documents travel with each skill.

**What it costs**:
- Six copies of the same three documents, about 40 KB each pair. Mitigation: the copies are ignored
  and never enter the tracked tree.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A copy is made before the `rm` | H | T007 to T012 each run `rm` first, and AC-004 fails if a link survives |
| The hub tier diverges from the pinned blob | L | `git show` reads the commit, and `cmp` proves identity |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The links dangle from the new depth |
| 2 | **Beyond Local Maxima?** | PASS | Four replacement forms were scored |
| 3 | **Sufficient?** | PASS | Six tasks, one per file, each with a `cmp` proof |
| 4 | **Fits Goal?** | PASS | A standalone skill cannot depend on a hub-relative link |
| 5 | **Open Horizons?** | PASS | The same form works for any future copied reference |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `.skilled/skills/local-webflow/references/workflow-{implement,debug,verify}.md`: T007 to T009.
- `.skilled/skills/local-obsidian/references/workflow-{implement,debug,verify}.md`: T010 to T012.

**How to roll back**: delete the six files and re-run the restore pair; the archive recreates the symlinks.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: One skill-root `graph-metadata.json` per skill and no `description.json`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet planner |

---

<!-- ANCHOR:adr-006-context -->
### Context

The advisor's disk scan reads each skill root's `graph-metadata.json` for identity, family, edges and
derived routing fields. `description.json` is a hub-and-parent artifact: the seven files that carry one
are `cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc` and
`system-deep-loop`, and no leaf skill carries one. No consumer reads a leaf `description.json`.

### Constraints

- `skill_id` must equal the folder name or the node registers under the wrong id.
- `family` must be one of `cli`, `mcp`, `sk-code`, `sk-hub`, `deep-loop`, `sk-util`, `system`, the allowlist at `skill-graph-db.ts:48`.
- `derived` arrays must be non-empty, because the generator prunes dead paths and errors on an empty required array.
- `key_files` and `entities[].path` are repository-root-relative; `source_docs` are skill-relative.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: write exactly one `graph-metadata.json` at each skill root and no `description.json`
anywhere under either skill.

**How it works**: the file follows the field table in `plan.md` Step 8, the generator repairs the
`derived` block with `--write`, and a second run without `--write` must report `unchanged`.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One root `graph-metadata.json`, no `description.json`** | Matches every leaf skill; one identity per skill | None observed | 9/10 |
| Add a `description.json` | More metadata | No consumer reads it, and it is a second identity to keep in sync | 2/10 |
| A nested `graph-metadata.json` below the root | Per-folder identity | Registers a second node, which phase 3's ADR-002 treats as a violation | 1/10 |
| No metadata file | Nothing to write | The advisor never indexes the skill, and phase 5's probe fails | 1/10 |

**Why this one**: it is the shape every leaf skill already uses, and the generator proves it.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The advisor indexes both skills in one pass over the existing skills root.
- One identity per skill, with no second file to drift.

**What it costs**:
- Two hand-written JSON files whose `derived` block must be generated. Mitigation: T086 and T087 run
  the generator with `--write` and then a confirming dry run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A `key_files` path is wrong | M | The generator errors on a dead path, and the task's proof reads the status |
| A nested metadata file is added later | M | AC-011 and AC-012 count exactly two files across both roots |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it the advisor cannot score the skill |
| 2 | **Beyond Local Maxima?** | PASS | Four identity shapes were scored |
| 3 | **Sufficient?** | PASS | One file per root, generated and then confirmed |
| 4 | **Fits Goal?** | PASS | Routing the private skills is the phase's second deliverable |
| 5 | **Open Horizons?** | PASS | The shape matches the fleet, so a future CI change applies to it unchanged |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `.skilled/skills/local-webflow/graph-metadata.json`: T086.
- `.skilled/skills/local-obsidian/graph-metadata.json`: T087.

**How to roll back**: delete the two files; the skills keep working as plain folders with no routing.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The evidence trail is paths and counts only, and the commit is by name

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet planner |

---

<!-- ANCHOR:adr-007-context -->
### Context

`implementation-summary.md` is a tracked file. It must record enough evidence to close the phase
without quoting private content, and the commit must not stage any path under `.skilled/skills/local-*`
even though the phase spends most of its commands there.

### Constraints

- `git add -A` or `git add .` would pick up nothing ignored, but it would also pick up any unrelated
  edit in the worktree; the commit names its files.
- The phase-1 guard refuses a staged `local-*` path, and the commit still checks the index itself.
- The summary may name paths and counts, never file content.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: write the summary from command readings only, then commit the phase's documents by name
from the worktree, and prove the index is empty of `local-*` paths before and after the commit.

**How it works**: T096 to T099 fill four summary sections from the readings, T106 stages its phase
documents by name, and T108 pushes `HEAD:main` only after AC-018 passes.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Named `git add` of the phase documents** | Stages exactly what is intended | The file list must be maintained | 9/10 |
| `git add -A` in the worktree | One command | Stages any unrelated edit, and the phase cannot prove the index is clean | 3/10 |
| Commit from the operator's checkout | Familiar | The documents are not there | 1/10 |
| Quote sample file content in the summary | Richer evidence | Puts private bytes into a tracked file | 1/10 |

**Why this one**: a named add is the only form where the staged set is itself the proof.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The commit's file list is a readable assertion about what the phase changed.
- The summary closes the phase without exposing private content.

**What it costs**:
- The summary is less detailed than a content dump. Mitigation: it records every command's count and
  exit state, which is what the criteria check.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A document is forgotten from the named add | L | AC-019 reads the commit's file list against the phase folder |
| A private path is staged with `-f` | H | T106 runs `git diff --cached --name-only` and stops on any `local-` line |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase must record evidence without leaking content |
| 2 | **Beyond Local Maxima?** | PASS | Four commit forms were scored |
| 3 | **Sufficient?** | PASS | Four summary sections plus a named add |
| 4 | **Fits Goal?** | PASS | The phase closes on recorded evidence |
| 5 | **Open Horizons?** | PASS | The same pattern fits phase 5's evidence file |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `implementation-summary.md`: T096 to T099.
- The git index: T106 stages the phase documents, T108 pushes.

**How to roll back**: `git revert <phase-commit>` reverts the documents only; the ignored trees are
removed with `rm -rf` as ADR-001 says.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---
