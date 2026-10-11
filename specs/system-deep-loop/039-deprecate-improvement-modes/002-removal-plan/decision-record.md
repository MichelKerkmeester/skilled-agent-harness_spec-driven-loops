---
title: "Decision Record: Phase 2: removal-plan"
description: "Five decisions behind the improvement-modes removal: one-program deletion, the mirror checker's new home, the benchmark families, the DeepSeek worktree method and how history and generated files are treated."
trigger_phrases:
  - "removal plan decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/002-removal-plan"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded ADR-001 to ADR-005 for the removal program"
    next_safe_action: "Apply the decisions in phases 003 to 010"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "039-removal-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 2: removal-plan

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove both modes in one program, without a deprecation stage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-10 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator retired both improvement modes. The two run on one packet, and the agent-improvement lane calls the model-benchmark lane's `run-benchmark.cjs` and default profile. Nothing outside this repository consumes either mode: both owning packages are `private: true`.

### Constraints

- A staged deprecation would keep both lanes alive for a release and keep the carve-out problem
- No external caller needs a transition window
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Delete both modes, the `deep-improvement` agent and the packet in one program, and record the retirement in the hub changelog.

**How it works**: Phases 003 to 008 remove every live reference; phase 010 proves none remains. No `deprecatedModes` entry is added, because no caller would read it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete both now** | No carve-out, one gate pass | Large single change | 9/10 |
| Deprecate, delete later | Softer for unknown callers | No callers exist; the carve-out stays for a release | 4/10 |
| Delete one mode first | Smaller steps | Needs the run-benchmark carve-out | 3/10 |

**Why this one**: Removing both together deletes the hardest seam instead of engineering around it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The Lane A/B carve-out disappears
- One gate pass covers the whole removal

**What it costs**:
- A large diff to review. Mitigation: work units of one change set each, verified one at a time

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed reference keeps a dead route | M | Phase 010 zero-reference search over the full file list |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for full removal, and this decision is on its path |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The smallest option that keeps every gate passing |
| 4 | **Fits Goal?** | PASS | Serves zero live references with green gates |
| 5 | **Open Horizons?** | PASS | Leaves no compatibility layer to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Every file in the per-phase lists

**How to roll back**: Remove the worktree and its branch; main is untouched until merge.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Move the agent mirror checker to .skilled/bin/

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-10 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

`check-agent-mirror-sync.cjs` lives in the packet but guards every agent edit: both pre-commit hooks, the `agent-mirror-sync.yml` workflow, a CI drill and three docs call it.

### Constraints

- The hooks resolve the checker through `$SOURCE_ROOT`, so the new path must sit under `.skilled/`
- `.skilled/agents/` is mirrored as agents, so a doc placed there would be read as one
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Move the checker, `lib/mirror-sync-verify.cjs`, both of their tests and `agent-mirror-crosswalk.md` to `.skilled/bin/`, then repoint every caller.

**How it works**: `.skilled/bin/` already holds repo-level checkers and their vitest suites under `vitest.config.bin.ts`. Phase 003 does the move before phase 005 deletes the packet.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.skilled/bin/`** | Existing home for repo checkers and their tests | Grows bin | 8/10 |
| `.skilled/scripts/git-hooks/` | Next to the hooks | CI and docs also call it; the hooks dir is hook-only | 5/10 |
| Retire the checker | Less code | Drops a guard the hooks and CI rely on | 2/10 |

**Why this one**: The checker is a repository guard, not part of either mode, and bin is where such guards live.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Agent mirror drift stays guarded after the packet is gone

**What it costs**:
- Nine callers to repoint. Mitigation: the hook test suite and the broken-move drill both exercise the path

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| CI still points at the old path | H | The broken-move drill fails on a missing checker; phase 003 runs it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for full removal, and this decision is on its path |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The smallest option that keeps every gate passing |
| 4 | **Fits Goal?** | PASS | Serves zero live references with green gates |
| 5 | **Open Horizons?** | PASS | Leaves no compatibility layer to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Five moves and nine caller edits listed in `../003-agent-mirror-checker-relocation/scratch/`

**How to roll back**: Restore the phase 003 tree snapshot.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Delete the model and agent families of sk-create-benchmark

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-10 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-003-context -->
### Context

`sk-create-benchmark` authors four benchmark families. The model-benchmark and agent-improvement families author inputs for the deleted packet; behavior-benchmark and MCP promotion do not depend on it.

### Constraints

- The family keys are runtime routing keys in the skill and in sk-doc's registry and tests
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Delete the model-benchmark and agent-improvement families and keep behavior-benchmark and MCP promotion.

**How it works**: Phase 007 removes the family assets, references and playbook pages, the two keys from `FAMILIES`, and their rows in sk-doc's hub files and tests.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete the two families** | No authoring for a runner that no longer exists | Loses the templates | 8/10 |
| Keep them as generic templates | Reusable later | They describe a deleted runner's inputs | 3/10 |

**Why this one**: Templates for a runner that no longer exists mislead the next author.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The skill only offers families that something can run

**What it costs**:
- Family registry tests change. Mitigation: phase 007 updates `test_create_benchmark_family_registry.py` with the keys

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A routing key survives in sk-doc's registry | M | sk-doc tests and the zero-reference search |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for full removal, and this decision is on its path |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The smallest option that keeps every gate passing |
| 4 | **Fits Goal?** | PASS | Serves zero live references with green gates |
| 5 | **Open Horizons?** | PASS | Leaves no compatibility layer to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `sk-doc/sk-create-benchmark/` family files and sk-doc hub rows

**How to roll back**: Restore the phase 007 tree snapshot.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: DeepSeek implements in a worktree; the orchestrator verifies and snapshots

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-10 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-004-context -->
### Context

The operator chose DeepSeek agents for implementation and a git worktree for isolation. The cli-opencode skill requires a fresh worktree for any permission-skipping dispatch against a populated tree, after a past DeepSeek dispatch deleted 44 files.

### Constraints

- The harness commits only when the operator asks
- Five other sessions write to the main checkout
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Each work unit is one `opencode run` on `llmgateway/deepseek-v4.1-flash --variant max` with `--dir` set to the worktree, a short literal brief, banned operations and an allowed-path list.

**How it works**: Before each unit the orchestrator records `git add -A && git write-tree` as a rollback point. After it, the orchestrator diffs the touched paths against the unit's list and runs the unit's gate. Merging to main is the operator's call.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Worktree plus tree snapshots** | Isolated, reversible, no unrequested commits | Snapshots are less visible than commits | 8/10 |
| Worktree plus per-unit commits | Clear history | Commits the operator did not ask for | 5/10 |
| Main checkout | No merge step | Mixes with other sessions' work | 2/10 |

**Why this one**: It keeps every unit reversible without committing on the operator's behalf.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A bad unit rolls back with one command

**What it costs**:
- Strict validation and metadata regeneration run on main after merge, per sk-git

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| DevPass hits its limit mid-program | M | Fall back to Cline at xhigh, then wait for the DevPass reset |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for full removal, and this decision is on its path |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The smallest option that keeps every gate passing |
| 4 | **Fits Goal?** | PASS | Serves zero live references with green gates |
| 5 | **Open Horizons?** | PASS | Leaves no compatibility layer to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Dispatch briefs in each phase's `scratch/`

**How to roll back**: `git read-tree -u --reset <snapshot>`; or remove the worktree.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: History stays; generated surfaces are regenerated

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-10 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-005-context -->
### Context

Changelogs, benchmark reports, parser fixtures and the cite-drift redirect table record what happened. Hermes skill mirrors, advisor bridges, the skill graph, the trigger index and retrieval fixtures are built by generators.

### Constraints

- A hand edit to a generated file is overwritten on the next generator run
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Leave history files as they are, and rebuild every generated surface with its generator in phase 010.

**How it works**: Benchmark READMEs keep their archive-status lines but stop describing the modes as live. Phase 010 runs each generator and diffs the result.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep history, regenerate** | Truthful history, stable generated state | Old names stay in history files | 9/10 |
| Scrub history too | Fewer matches | Rewrites the record | 2/10 |

**Why this one**: History is evidence; generated files have one owner, their generator.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The zero-reference search has a clear exclusion list

**What it costs**:
- The search needs exclusions. Mitigation: the exclusion list is fixed in phase 010's plan

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A generator is missed | M | Phase 010 lists every generator and checks its output diff |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for full removal, and this decision is on its path |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | The smallest option that keeps every gate passing |
| 4 | **Fits Goal?** | PASS | Serves zero live references with green gates |
| 5 | **Open Horizons?** | PASS | Leaves no compatibility layer to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Phase 010 regeneration steps

**How to roll back**: Re-run the generators on the restored tree.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
