---
title: "Decision Record: Phase 1: contracts-and-state-root"
description: "Eleven decisions for the contracts phase. Run folder location, identity with no remote and the retention and expiry keys are Accepted by the operator. Code location, language and build, status vocabularies, two clones, missing isolation, state layout, the git-hook key and the needs-you exit are Proposed."
trigger_phrases:
  - "contracts and state root decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root"
    last_updated_at: "2026-11-22T10:48:27Z"
    last_updated_by: "template-author"
    recent_action: "Recorded operator decision D10 and added installs/"
    next_safe_action: "Run setup tasks T001 to T004, T018 and T023"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-contracts-and-state-root"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 1: contracts-and-state-root

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Run folders live in the Skilled tree's gitignored state, the record stays user-level, nothing is committed (research.md §16 Q3)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D2: "preferably inside the skilled repo folder somehow but git ignored"). Recorded in parent ADR-002 |

---

<!-- ANCHOR:adr-001-context -->
### Context

A run leaves a ledger, receipts and a record. The pi lineage assumed the run directory sits in the repository. The Hy4 lineage proposed versioning a small result record beside the definitions. The synthesis recommended neither and put run folders under the user-level state root (research.md §11). This phase first proposed that too. The operator chose a run folder inside the Skilled tree, ignored by git. That overrides research.md §11's inference for run folders only.

### Constraints

- An hourly bot would add 24 files a day to git if each run committed a record (research.md §11).
- The removed Hermes layer generated 177 files for five sessions, and the hub must add nothing generated to a checkout's git status (research.md §4).
- A switch the run can write is no switch (research.md §13). So the queue, leases, switches, needs-you items and registered roots cannot sit where the run writes.
- In this checkout, `.gitignore` lines 134 to 137 ignore `.skilled/skills/.state/*/*` and keep only each subsystem's `README.md`. Lines 273 to 274 ignore nested copies. `git check-ignore -v` on a run folder path prints line 135.
- A vendored `.skilled` in a consumer repository is governed by that repository's `.gitignore`, not this one.
- A doctor overlay re-pin rewrites the vendored tree. A code read of `touchedPaths` in `overlay-engine.cjs` (lines 6198 to 6213) found it copies only upstream blobs and deletes only paths that were blobs in the old commit, so gitignored `.state` files should survive a re-pin. This is inferred, not yet run. A reinstall or a symlink retarget can still lose or hide them.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep each run folder at `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`, ignored by git, and commit nothing per run. The run folder holds evidence files only: ledger, receipts, logs and transcripts. The terminal run record and its request join live user-level at `<state root>/<identity key>/records/<run id>.json`. The queue, leases, switches, needs-you items, registered roots and the index stay under the user-level state root too.

**How it works**:
- "The Skilled tree" is the `.skilled` the registered checkout resolves at run time. In this repository that is the checkout itself. In a consumer it is the vendored or symlinked `.skilled`. It is never the run's worktree, so worktree cleanup cannot delete the evidence.
- With a symlinked `.skilled`, runs from several consumer repositories share one Skilled checkout's `.state`, split by identity key.
- `state-root.ts` asks git whether the run folder path is ignored before it creates it, and refuses with `run-folder-not-ignored` when it is not.
- `run-record.ts` writes the record user-level, with the absolute run folder path inside it. A read whose run folder has vanished returns the record and reports the folder as missing. The index tolerates a vanished folder as a row state, never a crash (phase 7).
- The one exception stays as before: a bot's own work, such as a deep-loop command writing its audit trail into a bound spec folder, stays versioned as the deep loops do today (research.md §11).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Run folders in the Skilled tree's gitignored `.state`, record user-level (chosen)** | Evidence sits beside the tools that made it. No git churn. A lost run folder never loses the record | Run folders can be lost on a reinstall or hidden by a symlink retarget. A consumer must ignore the path | 8/10 |
| Everything under the user-level state root (this phase's first proposal) | Evidence outlives any tree | Evidence sits far from the Skilled tree the operator works in. The operator preferred the tree | 7/10 |
| Run directory in the repository, tracked | Evidence sits beside the code | Dies with the checkout. Adds files to git status | 3/10 |
| Small versioned result record per run | Visible in git history | 24 files a day for an hourly bot | 3/10 |
| Record inside the run folder | One place per run | A lost run folder loses the record and the request join | 4/10 |

**Why this one**: It is the operator's choice. Keeping the record and every run-unwritable file user-level keeps the safety rule of research.md §13 and makes a lost run folder cost only evidence detail.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Zero hub files in git status after any number of runs, in any repository that ignores the path.
- Status can still show runs whose folder was lost, because the record and index are user-level.

**What it costs**:
- Run folder contents are run-writable, so they are evidence, never authority. Nothing the hub decides on is read from a run folder.
- Run history inside the tree is best-effort. Mitigation: the record and the index row survive. Retention is the operator's D5 numbers, applied by phase 7.
- A consumer repository with a vendored tree must ignore `.skilled/skills/.state/`. Mitigation: the refusal `run-folder-not-ignored`, and T023 checks the doctor install flow.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A re-pin wipes `.state` | M | T018 confirms the code read with a staged re-pin. If it wipes, run history stays best-effort and the record survives |
| A consumer repository does not ignore the path | M | Refuse with `run-folder-not-ignored` and name the `.gitignore` line to add |
| A run resolves the run root from its worktree | H | The resolver takes the registered checkout's Skilled tree only, and a test pins it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every run writes evidence somewhere, and phase 3 needs the path |
| 2 | **Beyond Local Maxima?** | PASS | Five placements compared, two from the lineages |
| 3 | **Sufficient?** | PASS | One folder rule and one ignore check, no new mechanism |
| 4 | **Fits Goal?** | PASS | The parent goal bars generated files in git status |
| 5 | **Open Horizons?** | PASS | A later export command can copy a record into git on request |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `state-root.ts` adds the in-tree run root, the ignore check and `records/` under the user-level identity folder.
- `run-record.ts` writes the record user-level with the run folder pointer.

**How to roll back**: Point the run root back at the user-level `<state root>/<identity key>/runs/` in `state-root.ts` and its test. No record has been written by an unattended run yet, so no data moves.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Identity of a repository with no remote (research.md §16 Q5)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D3: "Explicit id in config (Recommended)"). Recorded in parent ADR-003 |

---

<!-- ANCHOR:adr-002-context -->
### Context

`currentRepository` returns `{identity: null, source: null}` for a repository with no remote, as measured in `spec.md`. Two such repositories would share a label prefix and a state folder. The env-secret guard keys its state by a hash of the checkout path, which the index design tried to avoid because a moved checkout then looks like a new repository (research.md §12, §16 Q5). The research did not settle this.

### Constraints

- Identity must be stable across a moved checkout, because status relinks by identity (research.md §12).
- Two repositories must never resolve to one state folder.
- `repository-identity.cjs` is sk-code's file and is imported, not edited.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: read an explicit `identity` field in `bots/config.json` first, then `currentRepository`, and refuse with `identity-unknown` when neither answers. Install and enqueue refuse while identity is unknown.

**How it works**: `identity.ts` checks the config field against the same `owner/name` pattern `currentRepository` uses, and rejects any other value with `identity-invalid`. A repository with no remote declares its identity in that same shape, for example `local/tool`, and the guard returns it. It exports one guard that install (phase 6) and enqueue (phase 5) call, and both refuse while it returns `identity-unknown`. The state folder name is a one-to-one, filesystem-safe encoding of the identity. What two clones of one repository do is a separate decision, ADR-006.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Config field, then remote, else refuse (chosen)** | Stable across moves. No silent collision. The author states it once | An author with no remote must write one line of config | 8/10 |
| Hash of the checkout path | Works with no setup | A moved checkout becomes a new repository. The fallback research.md §16 Q5 warns against | 3/10 |
| Identity plus a checkout discriminator for every repository | Two clones never share state | Every repository pays for a rare case. Relink by identity stops working | 5/10 |

**Why this one**: It never guesses, it survives a move and it costs one config line only in the case that has no remote.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Two remote-less repositories can never collide, because neither resolves.
- A moved checkout keeps its state and history.

**What it costs**:
- A remote-less repository cannot run bots until its author adds an `identity` field. Mitigation: the refusal message names the field and the file.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two unrelated repositories declare the same identity by copy and paste | M | The registered-roots list shows two paths for one identity, and status flags it |
| A later phase enqueues or installs without the guard | M | Phases 5 and 6 import the guard, and their tests cover the refusal |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Measured: no remote resolves to null today |
| 2 | **Beyond Local Maxima?** | PASS | Three rules compared, including the existing path hash |
| 3 | **Sufficient?** | PASS | One optional config field |
| 4 | **Fits Goal?** | PASS | Labels, queues and status all key on identity |
| 5 | **Open Horizons?** | PASS | A remote added later can replace the field without moving state, if both spell the same identity |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `identity.ts` adds the config-first rule and the refusal.
- `repo-config.ts` adds the optional `identity` field and its shape check.

**How to roll back**: Swap the rule in `identity.ts` and its test before any unattended run has written state.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Where the code lives before the hub is wired

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author, checked against the existing skill and advisor checks |

---

<!-- ANCHOR:adr-003-context -->
### Context

The hub registry and modes arrive in phase 8, and nothing may be reported routed before then. Phases 1 to 7 still need a home for runtime code and a CLI entry point (research.md §8, §15).

### Constraints

- A skill folder with no registered modes must not fail the existing skill and advisor checks. Not yet tested.
- The CLI should follow `compiled-route.cjs`: a thin CLI over one resolver that exits loudly on a misspelled option (research.md §8).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: put the libraries in `.skilled/skills/system-skilled-bots/runtime/` and, from phase 3, a thin CLI in `.skilled/bin/`.

**How it works**: This phase creates only `runtime/` and `assets/` in the skill folder. Setup task T003 runs the existing checks against that layout. If a check fails on a folder with no `SKILL.md`, this phase creates the smallest skill root those checks accept, and phase 8 fills it.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skill folder runtime, thin bin CLI (proposed)** | Code sits where phase 8 wires it. Matches the deep-loop layout | Needs the checks to tolerate a partial skill folder | 8/10 |
| A staging folder outside `.skilled/skills/` | No check sees it | Moves every file in phase 8 and breaks import paths | 4/10 |

**Why this one**: Code written in its final place does not move later, and T003 tests the one risk before any code lands.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No file move in phase 8.
- Later phases import from one stable path.

**What it costs**:
- A minimal skill root may be needed early. Mitigation: it holds no mode, so no routing claim is made.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A check fails on a partial skill folder | M | Add the smallest root the check accepts and record the check output |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phases 1 to 7 need a code home |
| 2 | **Beyond Local Maxima?** | PASS | Staging folder considered |
| 3 | **Sufficient?** | PASS | Two folders only |
| 4 | **Fits Goal?** | PASS | Phase 8 wires the same folder |
| 5 | **Open Horizons?** | PASS | No move later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Create `.skilled/skills/system-skilled-bots/runtime/` and `assets/`.

**How to roll back**: Remove the two new folders. Nothing outside them changes.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Language and build for the hub runtime

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author |

---

<!-- ANCHOR:adr-004-context -->
### Context

The pieces the hub reuses are TypeScript libraries plus `.cjs` scripts (research.md §15 recommendation 6). The deep-loop runtime solves the same problem with its own `package.json`, a `tsx` dependency and `runtime-bootstrap.cjs`, which `.cjs` scripts use to load TypeScript.

### Constraints

- `loop-lock.ts`, `atomic-state.ts` and `executor-config.ts` are TypeScript.
- `repository-identity.cjs` is CommonJS.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: write the hub libraries in TypeScript with a self-contained runtime `package.json` that depends on `tsx` and `vitest`, the shape of `.skilled/skills/system-deep-loop/runtime/package.json`.

**How it works**: Libraries import the deep-loop TypeScript modules by relative path and require `repository-identity.cjs`. The phase 3 CLI in `.skilled/bin/` loads them through `tsx`, the way deep-loop `.cjs` scripts do today. Later phases add `.ts` libraries under `runtime/lib/` and vitest tests under `runtime/tests/`, run by `npm test`. A later phase that plans `.cjs` libraries or a `node --test` suite departs from this ADR and must say so.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **TypeScript with its own runtime root (proposed)** | Types shared with reused modules. One proven pattern | A second `node_modules` root | 8/10 |
| Plain `.cjs` | No loader | Cannot import the TypeScript libraries without a build step | 4/10 |
| Add the hub to the deep-loop package | No new root | Couples two skills' dependency roots | 3/10 |

**Why this one**: It reuses a pattern that already runs in this repository and imports the reused modules without copying them.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Type checks cover the record and definition shapes.

**What it costs**:
- An install step for the runtime folder. Mitigation: the same step the deep-loop runtime already needs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A `tsx` version mismatch with deep-loop | L | Pin the same `tsx` version deep-loop pins |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The reused modules are TypeScript |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Copies an existing package shape |
| 4 | **Fits Goal?** | PASS | Every phase builds on it |
| 5 | **Open Horizons?** | PASS | A later build step can replace `tsx` without changing imports |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Create `.skilled/skills/system-skilled-bots/runtime/package.json`.

**How to roll back**: Delete the runtime package root.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Reuse the five existing status vocabularies

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author |

---

<!-- ANCHOR:adr-005-context -->
### Context

Iteration status, stop reasons, dispatch failures, verification reasons and delivery states already exist (research.md §10). A sixth vocabulary would force every reader to map two spellings of one state.

### Constraints

- Failure classes (author, operator, environment, hub) are written beside the raw reason at write time, so old rows keep their meaning (research.md §10).
- Terminal states never change, and an interrupted run ends as `unknown` only after its owner is proved gone (research.md §10).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We propose**: store raw reasons from the existing vocabularies and add only the derived failure class field.

**How it works**: Setup task T004 lists the five vocabularies by file and line. `run-record.ts` imports or names those strings and adds no new status enum. The failure class is a separate field with the four classes from research.md §10. The one operator-decided exception is the exit value `awaiting-decision`, which ADR-010 records and maps to `blockedStop`.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse, add only the class field (proposed)** | One spelling per state | Depends on five files staying stable | 8/10 |
| A hub-owned status enum | Self-contained | A sixth vocabulary. Readers must map two names | 3/10 |

**Why this one**: The research names the five and warns against a sixth.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Status and the deep-loop tools read the same strings.

**What it costs**:
- A change in an upstream vocabulary reaches the record. Mitigation: a test pins each string the record uses.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An upstream rename breaks old records | M | The pinning test fails before the rename ships |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The record must store a state |
| 2 | **Beyond Local Maxima?** | PASS | Own enum considered |
| 3 | **Sufficient?** | PASS | One extra field |
| 4 | **Fits Goal?** | PASS | Status in phase 7 reads these fields |
| 5 | **Open Horizons?** | PASS | A new class can be added without renaming states |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `run-record.ts` exit and delivery fields.

**How to roll back**: Replace the field types in `run-record.ts`. No unattended run has written records yet.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Two clones of one repository share one identity folder

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author. The research does not cover this case |

---

<!-- ANCHOR:adr-006-context -->
### Context

Two clones with the same origin remote get the same identity from `currentRepository`. Labels, the queue, leases and run folders are all keyed by identity, so the clones share them unless a rule says otherwise. Phase 6 and phase 7 both wait on this answer. The research does not cover it.

### Constraints

- Status relinks a moved checkout by identity (research.md §12). A per-clone key would break relink.
- Leases are keyed by workflow, repository and spec target, never by a worktree path (research.md §8, §15).
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We propose**: two clones of one repository share one identity and one identity folder on purpose. `registered-roots` records every checkout path under that identity.

**How it works**: `identity.ts` returns the same key for both clones. `state-root.ts` adds each checkout path to `registered-roots` the first time it resolves. The identity test covers two temp clones of one origin (REQ-010).
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Share one identity folder, list every path (proposed)** | Relink by identity keeps working. One lease per bot across clones | The clones share a queue and labels | 7/10 |
| Identity plus a checkout discriminator | Clones never share state | Every repository pays for a rare case. Relink stops working | 4/10 |

**Why this one**: It keeps relink and the lease key as the research designed them, and the shared queue is visible in `registered-roots`.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Phase 7 can relink a moved clone by identity.

**What it costs**:
- A second install of one label from another clone would replace the first. Mitigation: phase 6 must refuse or report it. Phase 6 does not yet carry that requirement, so this is reported to its owner.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two unrelated repositories declare the same identity by copy and paste | M | `registered-roots` shows two paths for one identity, and status flags it |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phases 6 and 7 name this as an open input |
| 2 | **Beyond Local Maxima?** | PASS | A per-clone key was considered |
| 3 | **Sufficient?** | PASS | One list file, no new key |
| 4 | **Fits Goal?** | PASS | Keeps relink by identity |
| 5 | **Open Horizons?** | PASS | A discriminator can be added later without moving existing folders |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `identity.ts` and `state-root.ts`, with the two-clones test.

**How to roll back**: Add a checkout discriminator to the identity key before any unattended run has written state.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: A bot with no isolation value and no repository default is refused

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author. Inferred from research.md §5, not stated there |

---

<!-- ANCHOR:adr-007-context -->
### Context

Research.md §5 says the agent may never choose between a worktree and the current branch by itself, and an unattended run has nobody to ask, so the definition states the posture. A repository default may come from `bots/config.json`. It does not say what happens when neither is set. Phase 4 AC-006 depends on this rule.

### Constraints

- The three worked shapes of research.md §5 declare no isolation and must still parse (REQ-002). So the rule cannot be a parse rejection.
- The runner refuses a posture it cannot honor (research.md §13).
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We propose**: resolve isolation from the definition's `isolation` field, then the config's `defaultIsolation`, else return the refusal `isolation-undeclared`. Nothing picks `shared` or `worktree` by itself.

**How it works**: `definition.ts` exports one resolver that takes a parsed definition and the config. Phase 2's checker can report the refusal. Phase 3's runner refuses the run before dispatch. Phase 4 asserts that no worktree is made for such a definition.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refuse at posture resolution (proposed)** | Never chooses a workspace. Worked shapes still parse | A bot runs only after its author or the repository states a posture | 8/10 |
| Default to `shared` | No setup | The hub picks a workspace, which research.md §5 bars | 3/10 |
| Reject at parse | Fails early | The three worked shapes would stop parsing | 2/10 |

**Why this one**: It is the only option that keeps the worked shapes valid and never makes the workspace choice for the author.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Phases 2, 3 and 4 share one rule and one reason name.

**What it costs**:
- Phase 3's fixture bots need an explicit `isolation: shared` or a config default. Mitigation: reported to phase 3.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Authors read the refusal as a bug | L | The refusal message names the field and the config key |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 4 AC-006 names it |
| 2 | **Beyond Local Maxima?** | PASS | Three rules compared |
| 3 | **Sufficient?** | PASS | One resolver, one reason |
| 4 | **Fits Goal?** | PASS | Keeps the workspace choice with the author |
| 5 | **Open Horizons?** | PASS | The same resolver can cover sandbox class later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- The isolation resolver in `definition.ts` and its test.

**How to roll back**: Change the resolver's fallback and its test. No run has used it yet.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: State-root folder name and the closed subfolder list

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author, with phase 5 for the `requests/` subtree |

---

<!-- ANCHOR:adr-008-context -->
### Context

Research.md §11 gives the root as `${XDG_STATE_HOME:-$HOME/.local/state}/<tool>/` and lists what lives there: the queue, leases, switches, the status index and the registered-roots list. It leaves the tool name open. Phase 5 ADR-003 needs the queue to be a `requests/` folder of six siblings, with only `inbox/` watched. Operator D2 moves run folders into the Skilled tree (ADR-001), and operator D1 adds needs-you items (ADR-010).

### Constraints

- The env-secret guard uses its own tool name as the folder under the same root.
- `rename` is atomic only within one filesystem, so every queue folder sits under one parent (phase 5 ADR-003).
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We propose**: the tool folder is `system-skilled-bots`, the accepted skill name (parent ADR-007), in both roots. Under the user-level `<state root>/<identity key>/` sit `requests/` (with `inbox/`, `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/`), `leases/`, `switches/`, `needs-you/`, `records/` and `installs/` (phase 6's install records, `installs/<bot-id>.json`). `index/` and `registered-roots` sit at the state root, beside the identity folders. Under the in-tree run root `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/` sits only `runs/<run id>/` (ADR-001).

**How it works**: `state-root.ts` exports one path function per entry and creates folders with mode `0700`. The list is closed. A later phase adds an entry through this spec. Only the run folder function takes a Skilled tree. Every other function resolves under the user-level root.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`system-skilled-bots`, closed list (proposed)** | Same name as the skill. One owner for every path | A rename of the skill means a folder move | 8/10 |
| `bots` as the tool folder | Short | Too generic for a user-level folder | 4/10 |

**Why this one**: The skill name is already accepted and cannot clash with another tool's folder.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Phases 3, 5, 6 and 7 read one layout from one module.

**What it costs**:
- Each new entry needs a change here. Mitigation: the list is short.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A phase writes a path outside the list | M | Later phases call the path functions and never join strings |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research.md §11 leaves the name open |
| 2 | **Beyond Local Maxima?** | PASS | Two names compared |
| 3 | **Sufficient?** | PASS | One module owns every path |
| 4 | **Fits Goal?** | PASS | Nothing lands in a checkout |
| 5 | **Open Horizons?** | PASS | New entries are added by name |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `state-root.ts` and its test.

**How to roll back**: Rename the folder constant and its test before any state is written.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: The git-hook opt-in key in bots/config.json

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 1 author, for phase 5. The research names the opt-in but not the key |

---

<!-- ANCHOR:adr-009-context -->
### Context

Research.md §5 lists `git-hook` as an opt-in trigger kind, and research.md §9 says the post-commit producer is opt-in. Phase 5 REQ-009 acts only when `bots/config.json` turns commit triggers on and a bot declares a commit trigger. It needs a key name from this phase.

### Constraints

- The hook's `hook_enabled` resolver defaults to on, so it cannot be the opt-in (phase 5 REQ-009).
- A missing file or key must mean off.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We propose**: a top-level boolean `gitHookTrigger` in `bots/config.json`, `false` when the key or the file is absent. A bot still fires only when its own trigger is `kind: git-hook`.

**How it works**: `repo-config.ts` reads the key and rejects a non-boolean value by name. Phase 5's hook leg reads it through that reader.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Top-level `gitHookTrigger` boolean (proposed)** | One line to opt in. Matches the `git-hook` kind | One more config key | 8/10 |
| Opt in per bot only | No repository key | Any trusted clone with a `git-hook` bot fires without a repository-level yes | 4/10 |

**Why this one**: It gives the repository one explicit off-by-default switch, as research.md §9 asks.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Phase 5 has one named key to read.

**What it costs**:
- Two places must agree before a commit enqueues. Mitigation: the checker can warn about a `git-hook` bot in a repository with the key off.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 5 spells the key differently | M | Phase 5 T001 reads the name from this spec |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 5 names it as a dependency |
| 2 | **Beyond Local Maxima?** | PASS | Per-bot opt-in considered |
| 3 | **Sufficient?** | PASS | One boolean |
| 4 | **Fits Goal?** | PASS | Keeps the hook opt-in |
| 5 | **Open Horizons?** | PASS | An object form can replace the boolean later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `repo-config.ts` and its test.

**How to roll back**: Rename the key in the reader and its test before phase 5 ships.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: A run that needs a human ends awaiting-decision and writes one needs-you item (research.md §16 Q2)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Operator chose the queue (D1: "Decision queue"). This design is Proposed by this phase. Recorded in parent ADR-001 |

---

<!-- ANCHOR:adr-010-context -->
### Context

An unattended run can reach a point where only a human can decide. The research recommended ending the run blocked. The operator chose a decision queue instead: park the run and keep a needs-you list to answer later, as Orca does (research.md §4). The research did not design the queue. This phase owns three contract parts of it: the exit value, the item record and its folder. Phase 3 writes items and owns `bots inbox` and `bots answer`. Phase 5 owns the `resume` request kind. Phase 7 owns status rows and retention for items.

### Constraints

- Every trigger only writes a run request (research.md §9). An answer must flow through the normal queue, so no process waits.
- No sixth vocabulary (research.md §10, ADR-005). A search of `.skilled` found no use of `awaiting-decision` today.
- The stop-reason vocabulary already has `blockedStop` (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs:48`).
- A run must not be able to forge or clear an item, the same rule as switches (research.md §13).
- Terminal states never change (research.md §10).
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We propose**: a run that needs a decision ends with the terminal exit value `awaiting-decision` and class `operator`. The runner, not the bot, writes one needs-you item, and the lease is released.

**How it works**:
- **Exit**: `exit.reason` is `awaiting-decision`, `exit.class` is `operator` and `exit.needsYouItemId` names the item. A record with that reason and no item id is rejected by name.
- **Mapping**: none of the five vocabularies holds this value. It is one new value in the existing exit field, not a new enum. It is closest to `blockedStop`, and a reader that speaks only the stop-reason vocabulary maps it there. A test pins the mapping. The run stays terminal: a resume is a new request of kind `resume` (phase 5), never a state change on this record.
- **Item**: one JSON file at `<state root>/<identity key>/needs-you/<item id>.json`, user-level, written by temp file and rename. Fields: `id` (the parked run's id, so one run writes at most one item), `runId`, `botId`, `identity`, `question`, `options` (a list or `null`), `createdAt`, `expiresAt`, `evidence` (a list of paths), `answer` (`null` or `{text, answeredAt}`) and `resumeRequestId` (`null` until answered).
- **Item state**: derived, never stored. Answered when `answer` is set. Expired when unanswered at or after `expiresAt`. Open otherwise. So the item adds no stored state vocabulary. An expired item is reported and never answered automatically.
- **Expiry**: the runner sets `expiresAt` to `createdAt` plus `needsYou.expiryDays` from `bots/config.json`, default 7. The operator chose a config key (D10).
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New exit value `awaiting-decision`, mapped to `blockedStop`, derived item state (proposed)** | Status can tell a parked run from a failed one. One value, no new enum | Adds one value the five vocabularies lack | 8/10 |
| Store `blockedStop` as the raw reason and mark the park only by `needsYouItemId` | No new value at all | Status must join two fields to tell a park from another block, and the operator named the exit | 6/10 |
| Store an item `state` field with `open`, `answered`, `expired` | Simple to read | A stored enum that can disagree with `answer` and `expiresAt` | 4/10 |
| End blocked with no queue (the research's recommendation) | Nothing new | Reversed by the operator in D1 | 2/10 |

**Why this one**: It names the park the way the operator asked, keeps the run terminal and adds exactly one value with a pinned mapping.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- No process waits on a human. An answer is one new request.
- Status can show open items as their own rows (phase 7).

**What it costs**:
- One value outside the five vocabularies. Mitigation: REQ-007 names it as the only exception, and a test pins its mapping to `blockedStop`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Later phases add more park-like values | M | Any new exit value reopens this spec |
| An item and its record disagree | M | The item id is the run id, and the record names the item id |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator D1 asks for the queue, and phases 3, 5 and 7 need one shape |
| 2 | **Beyond Local Maxima?** | PASS | Four shapes compared |
| 3 | **Sufficient?** | PASS | One exit value, one file per item |
| 4 | **Fits Goal?** | PASS | Every trigger still only writes a request |
| 5 | **Open Horizons?** | PASS | Multi-question dialogs can add fields later. They are out of scope for the first build |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `needs-you.ts` and its test.
- `run-record.ts` exit field and its test.
- `state-root.ts` adds `needs-you/`.

**How to roll back**: Remove `needs-you.ts`, the exit value and the folder before phase 3 writes an item.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: Retention keys in bots/config.json (research.md §16 Q8)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D5: "Proposed defaults (Recommended)"; D10: "Both configurable (Recommended)"). Recorded in parent ADR-005 and parent D10. The key names are this phase's |

---

<!-- ANCHOR:adr-011-context -->
### Context

The index, the run folders and the skipped-slot summary grow without bound unless capped. The operator accepted 1,000 terminal index rows per identity, the newest 200 run folders per bot and 100 skipped slots per summary, each configurable in `bots/config.json`. Phase 7 applies them. This phase owns the config keys.

### Constraints

- The config key list is closed, and an unknown key is rejected by name.
- A missing file or key must give the defaults.
<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We chose**: one `retention` object with `indexRowsPerIdentity` (default 1000), `runFoldersPerBot` (default 200), `skippedSlotsPerSummary` (default 100) and `closedNeedsYouPerIdentity` (default 200). The fourth key and the separate `needsYou.expiryDays` (default 7) come from operator decision D10.

**How it works**: `repo-config.ts` reads each key, fills a missing one with its default and rejects a value that is not a positive integer by name. Phase 7 reads the four retention numbers through that reader. Phase 3 reads `needsYou.expiryDays`.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One `retention` object (chosen)** | The three numbers read as one group. Room for a fourth key | One level of nesting | 8/10 |
| Three top-level keys | Flat | Crowds the top level and splits one concern | 6/10 |
| Hard-coded numbers | Nothing to read | The operator asked for configurable numbers | 2/10 |

**Why this one**: It groups the operator's numbers in one object, so the closed needs-you bound the operator added in D10 fits as a fourth key.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- Phase 7 has three named keys to read.

**What it costs**:
- A fourth bound, such as closed needs-you items (phase 7 REQ-014), needs a change here. Mitigation: it is an open question in `spec.md`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 7 spells a key differently | M | Phase 7 reads the names from this spec's contracts table |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for configurable numbers |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared |
| 3 | **Sufficient?** | PASS | Three keys |
| 4 | **Fits Goal?** | PASS | Bounded growth for the index and run folders |
| 5 | **Open Horizons?** | PASS | A new key joins the same object |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- `repo-config.ts` and its test.

**How to roll back**: Rename or remove the keys in the reader and its test before phase 7 ships.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Run folders live in the resolved Skilled tree under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`, ignored by git. The record and everything a run must not write stay user-level | The operator wanted run folders inside the Skilled tree but ignored by git. This overrides research.md §11 for run folders | This phase's first proposal for ADR-001 | ADR-001, REQ-001, REQ-003, REQ-004, REQ-014, AC-015, T019 |
| Q002 | A repository with no remote takes an explicit `identity` from `bots/config.json`. Install and enqueue refuse while identity is unknown | The operator picked the recommended option | - | ADR-002, REQ-005, REQ-013, AC-005, AC-014, T022 |
| Q003 | A run that needs a human decision parks in a needs-you queue | The operator picked the decision queue. The exit value and item shape are Proposed | The research's blocked recommendation | ADR-010, REQ-015, AC-016, T020 |
| Q004 | Retention keeps 1,000 index rows per identity, 200 run folders per bot and 100 skipped slots per summary, configurable | The operator picked the recommended option | - | ADR-011, REQ-016, AC-017, T021 |
| Q005 | Both the needs-you expiry and the closed-item history are configurable: `needsYou.expiryDays` (default 7) and `retention.closedNeedsYouPerIdentity` (default 200) in `bots/config.json` | The operator picked the recommended option (D10) | The two open questions on whether either needed a key | ADR-010, ADR-011, REQ-016, AC-017, T021 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** (asked as Q3, where run folders live): "preferably inside the skilled repo folder somehow but git ignored".
- **Q002** (asked as Q5, identity of a repository with no remote): "Explicit id in config (Recommended)".
- **Q003** (asked as Q2, a run that needs a human decision): "Decision queue". The offered option parks the run and adds a needs-you queue the operator answers later, like Orca.
- **Q004** (asked as Q8, retention): "Proposed defaults (Recommended)".
- **Q005** (D10, asked as "How should the needs-you expiry and history be configured?"): "Both configurable (Recommended)".
<!-- /ANCHOR:operator-answers-verbatim -->

---
