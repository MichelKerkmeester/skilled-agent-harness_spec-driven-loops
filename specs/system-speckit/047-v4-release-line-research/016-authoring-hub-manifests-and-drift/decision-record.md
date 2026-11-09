---
title: "Decision Record: Phase 16: authoring-hub-manifests-and-drift"
description: "Decisions for the authoring hub fixes: the leaf manifest, the added packager scope, the sk-design outcome, the advisor deferral and the review."
trigger_phrases:
  - "authoring hub manifests and drift decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/016-authoring-hub-manifests-and-drift"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 16: authoring-hub-manifests-and-drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Workflow deviations under an absent operator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

`/speckit:plan:auto` step 5 dispatches four `@context` explorers through the Task tool and both workflows end in a continuity save through `generate-context.js`. This orchestrator runs as a leaf that may not dispatch native agents, and goal G4 reserves code writes for CLI workers.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Explore inline from the parent synthesis evidence, run CLI workers one at a time, and keep continuity in the spec docs' `_memory` blocks instead of running the save writer.

**Details**: The plan YAML's own fallback ("Use inline planning activities below") covers the explorers. The research for this phase is the parent synthesis, so no phase `research/research.md` is created. cli-codex rule 15 keeps one CLI dispatch alive at a time without operator approval. The phase commit sets `SPECKIT_SKIP_SPEC_REMINT=1`, and no other hook skip, as the lead approved: the spec-remint pre-commit check refuses a commit that stages 047 docs while another 047 child has unstaged edits, which is always true with two orchestrators in one worktree. `repair-derived.cjs --apply` runs on the parent and this phase under the commit lock first, and the lead makes one final unbypassed commit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inline exploration, serial workers** | Breaks no rule | Slower | 8/10 |
| Parallel CLI workers | Faster | Breaks cli-codex rule 15 without approval | 3/10 |

**Why Chosen**: It is the only option that breaks no rule.

---

### Consequences

**Positive**:
- Every write traces to one brief.

**Negative**:
- Longer wall-clock time. Mitigation: one change per brief keeps each run short.

---

### Implementation

**Affected Systems**: none beyond this phase's files.

**Rollback**: not applicable; process decision.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: V43: the leaf manifest lists typed ids, not disk paths

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The verification probe found five quality-control leaves missing at packet paths. `leaf-aliases.json` maps exactly those five typed ids to `shared/` and `sk-create-with-human-voice/` files, `shared/README.md:23` and `:50` document that the router addresses them as packet-local leaves, and `root-router-contract.cjs` requires the typed pair in the manifest when a router path resolves through an alias.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: No change. The manifest is fresh and correct by design.

**Details**: A first worker removed the aliases; that would break the router contract for `ROUTER.md` paths into `shared/`, so the edit was discarded before any commit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the alias design** | Matches the documented contract | Packet paths do not exist on disk | 8/10 |
| Remove the aliases | Every leaf exists under its packet | Breaks the router-to-manifest contract | 2/10 |

**Why Chosen**: The finding read a typed handle as a file path.

---

### Consequences

**Positive**:
- No routing change.

**Negative**:
- None.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Added scope: the packager needs an explicit output directory

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

The lead added the packager half of V24: `package_skill.py` without `--check` wrote three skill zips into the repository root. Phase 008 covers only write containment.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Packaging with no output directory exits 2; `package_skill()` refuses `None` and a git top level; a repository subdirectory or a non-repo directory still works.

**Details**: `--check` and `--json` are untouched. Every in-tree caller already passes a flag or a directory.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Require a directory and refuse a top level** | No silent writes | Old one-argument form now exits 2 | 8/10 |
| Refuse only the top level | Smaller change | Still writes into any other cwd | 5/10 |

**Why Chosen**: A write location should never be implicit.

---

### Consequences

**Positive**:
- No more stray zips.

**Negative**:
- The one-argument form changes behaviour. Mitigation: its error names `--check` and the output argument.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: sk-design `none` outcome stays; advisor vocabulary deferred

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

`f-iter008-002`: sk-design's hub router declares an outcome `none` nothing defines. Removing it changed the hub's policy hash, and `validate_skill_package.py sk-design` then failed compiled-routing readiness with `stale-manifest`, measured by restoring each file in turn. `f-iter006-001` asks to drop `opencode` tokens from sk-code-skilled's routing vocabulary.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: Both left unchanged and recorded for the operator.

**Details**: The `none` removal needs the compiled-routing activation manifest regenerated, which workers may not do. The vocabulary change needs an advisor rebuild and a routing benchmark, and the lead gave the advisor tree to phase 015.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record both** | No stale manifests, no ownership clash | Two P2s stay open | 8/10 |
| Edit and regenerate | Closes them | Runs generators and edits another owner's tree | 2/10 |

**Why Chosen**: Each fix needs a step this phase is not allowed to take.

---

### Consequences

**Positive**:
- sk-design stays compiled-ready.

**Negative**:
- The undefined outcome remains declared.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Review without a second family

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable) |

---

### Context

GPT quota ran out during the first brief (reset 2026-11-13). The goal allows a DeepSeek fallback for workers; no other family was reachable for review.

### Constraints
- The verified finding set in `../research/research.md` bounds the scope.

---

### Decision

**Summary**: DeepSeek reviewed DeepSeek's diff read-only, and the orchestrator verified the code-path rows by running the checks itself.

**Details**: The review returned PASS with four P2 rows: two stale packager usage docs and the create index's bump values, all fixed, and the sk-design outcome, which ADR-004 covers.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Same-family review plus orchestrator checks** | Work continues with evidence | Not cross-family | 6/10 |
| Wait for GPT | Cross-family | Four days idle | 3/10 |

**Why Chosen**: The checks that matter were run, not reviewed.

---

### Consequences

**Positive**:
- Every row fixed or decided.

**Negative**:
- A second-family read is still owed. Mitigation: listed for the lead.

---

### Implementation

**Affected Systems**: this phase's files

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-005 -->
---

