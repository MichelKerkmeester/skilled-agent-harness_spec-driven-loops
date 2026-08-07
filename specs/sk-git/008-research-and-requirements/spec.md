---
title: "Research Charter: Blocker-Free Concurrent Commit and Push to a Shared Branch"
description: "Level 2 research charter and findings defining how many parallel AI sessions commit and push to one shared branch without divergence blockers, keep the primary checkout never behind origin, auto-propose AI conflict resolutions, and use GitKraken MCP as an auxiliary layer."
trigger_phrases:
  - "parallel git research charter"
  - "shared branch autosync research"
  - "concurrent session push without blockers"
  - "primary checkout never behind origin"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/008-research-and-requirements"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Froze reconciled research and the decision record"
    next_safe_action: "Scaffold the first implementation phase"
    blockers:
      - "None for the research phase; implementation phases inherit the BLOCKING prerequisites recorded in decision-record.md (fencing singleton, sole-writer remote enforcement, remote-policy-vs-merge-commit audit, durability, trust boundary)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "research/research.md"
      - "research/fanout-attribution.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "parallel-session-git-autosync-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The deliverable of this phase is an evidence-backed architecture recommendation, not an implementation."
      - "Serialized single-writer publisher + isolated per-session worktrees + a separate clean projection is the recommended default."
      - "Primary never behind is achievable in strict projection-first mode with a sole-writer remote; it trades strictness for possible temporary aheadness."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Charter: Blocker-Free Concurrent Commit and Push to a Shared Branch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (research scaffold) |
| **Priority** | P1 |
| **Status** | Complete (research converged; decision record frozen) |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 1 (research) |
| **Handoff Criteria** | Convergent, evidence-backed architecture recommendation with trade-offs, a chosen default, a decision record, and a testable acceptance matrix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Multiple AI coding sessions run concurrently against one shared long-lived branch. Each session commits locally while the remote branch advances, so sessions repeatedly hit non-fast-forward pushes and "N commits behind" states. Reconciling from a shared, dirty working tree is unsafe because it can overwrite or orphan another session's uncommitted work. The operator sees blockers and the branch is never dependably current in the IDE. A live instance was observed during this very research: the primary checkout sat "behind 1" against origin while concurrent sessions advanced it.

### Purpose

Determine, with evidence, the best architecture and tooling to let many parallel AI sessions commit and push to one shared branch continuously with no operator-visible divergence blockers, while keeping the shared branch and each local checkout current, never losing concurrent work, and holding the operator's **primary checkout so it is never behind origin**.

### Primary Research Question

What architecture lets N concurrent AI sessions commit and push to one shared branch continuously, with zero operator-visible divergence blockers, a primary checkout that is never behind origin, and no loss of concurrent uncommitted work? The detailed sub-questions this phase must answer are enumerated in §7 Open Questions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Evidence on the integration strategies, workspace models, staying-current mechanisms, safety guarantees, automation surfaces, and conflict handling in the research questions.
- A recommended default architecture with explicit trade-offs and a decision record.
- The "primary checkout never behind origin" invariant, its exact mechanism, and its cost.
- Automatic AI-assisted conflict merging as a bounded proposer stage (Request A).
- Placement of the GitKraken MCP as an auxiliary layer (Request B).
- The sk-git worktree/branch naming convention for any worktree the recommended architecture uses (REQ-010).
- Concrete, testable acceptance conditions for a future implementation phase.

### Out of Scope

- Building the implementation (a later phase owns it).
- Replacing Git or supporting external multi-tenant contributors.
- Rewriting shared history or any force-push-over-committed-work design.
- Codifying the sk-git branch-naming rule into the `sk-git` skill or cleaning up the existing local branch tree (folded here as REQ-010; the skill change and cleanup are deferred to a separate sk-git change per operator direction).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Answer every research question with cited evidence. | Each RQ has findings with sources and a confidence label in the synthesized research. |
| REQ-002 | Recommend one default architecture. | The synthesis names a default with its trade-offs versus the runner-up strategies. |
| REQ-003 | Guarantee no concurrent-work loss in the recommendation. | The recommended design documents how it avoids overwriting or orphaning uncommitted work. |
| REQ-004 | Produce a decision record. | A decision record captures the chosen strategy, alternatives, and consequences. |
| REQ-007 | The recommendation must keep the operator's primary checkout never behind origin. | The synthesis states the invariant formally (`origin tip ∈ ancestors(primary projection)`), the projection-first ordering that yields it, the sole-writer remote enforcement it requires, and the honest cost (possible temporary aheadness; strict-never-behind and remote-verified-only are jointly unsatisfiable without a distributed transaction). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Define acceptance conditions for implementation. | Testable conditions (e.g. "no non-fast-forward rejection surfaces to the operator across K concurrent pushers") are listed. |
| REQ-006 | Compare across the research lineages. | Findings note where the SOL and LUNA lineages agree, disagree, and add unique evidence (the planned GLM lineage was dropped for safety; the reduced cross-model coverage is recorded). |
| REQ-008 | Include automatic AI-assisted conflict merging in the design. | The recommendation places an AI resolver as a bounded *proposer* stage that re-enters the same validation pipeline — never a writer or publication authority; confidence is advisory, execution is sandboxed and credential-free, and safety-config paths are default-deny. |
| REQ-009 | Use the GitKraken MCP more, safely. | The recommendation places GitKraken MCP as an auxiliary layer only (read-only observability + human adjudication console + a version-gated resolver adapter), explicitly excluded from the publisher transaction core. |
| REQ-010 | Any worktree in the recommended architecture follows sk-git conventions. | Session and projection worktrees use the sk-git numbered/namespaced scheme, and branches are named on the related skill (`<skill>/…`) or on `skilled/…` (the whole-system alias); the current ad-hoc local tree is recorded as non-conforming. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eight research questions are answered with cited, confidence-labelled evidence.
- **SC-002**: A single default architecture is recommended with documented trade-offs.
- **SC-003**: The recommendation provably avoids concurrent-work loss and operator-visible blockers.
- **SC-004**: A decision record and testable implementation acceptance conditions exist.
- **SC-005**: The two-lineage fan-out is reconciled into one synthesis noting agreement and divergence, with the dropped third lineage recorded as reduced coverage.
- **SC-006**: The "primary never behind origin" invariant is stated formally, its mechanism proven, and its cost disclosed honestly.
- **SC-007**: Request A (auto AI conflict merge), Request B (GitKraken MCP placement), and REQ-010 (worktree/branch convention) are each folded into the recommendation with their safety boundaries.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| `cli-codex` + Codex CLI (GPT-5.6 SOL/LUNA) | External executor | GPT lineages cannot run |
| `cli-opencode` + OpenCode runtime (GLM-5.2) | External executor | GLM lineage cannot run — dropped for safety (see below) |
| Provider auth (ChatGPT OAuth) | External | Dispatches fail at authentication |
| `deep-research` mode packet (`fanout-run.cjs`) | Internal | The sanctioned multi-lineage fan-out mechanism; a raw `codex exec` loop is forbidden |

### Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| A model id fails to resolve in its CLI | Medium | Probe each id with one cheap dispatch before the full fan-out; halt and surface rather than guess |
| A lineage produces thin or unusable findings | Low | Record the gap honestly, continue with the remaining lineages, note reduced cross-model coverage |
| Research contradicts the "single shared branch" premise | Low | Halt and surface the conflict for an operator decision rather than silently redesigning the goal |
| The GLM executor requires `--dangerously-skip-permissions` on the shared dirty tree | Realized | Dropped the GLM lineage for safety on operator direction; recorded reduced cross-model coverage in the synthesis |
| A verification pass is killed by a concurrent session's blanket `pkill` | Realized | Re-dispatched; the three-pass verification chain completed and is captured in the decision record |

### Stop Conditions

- **Convergence**: two consecutive iterations in a lineage add no materially new findings.
- **Iteration cap**: five iterations per lineage (ten total across the two completed lineages).
- **Escalation**: if evidence contradicts the single-shared-branch premise, halt and surface the conflict.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These are the research sub-questions each lineage investigated; §5 success criteria require every one to be answered with cited, confidence-labelled evidence.

- **RQ-1 Integration strategy** — Compare auto-rebase-and-retry push loops, serialized push multiplexing (a push queue/daemon), merge queues, and ref-level fast-forward publishing (scratch-index / `commit-tree` without touching the working tree). Which minimizes blockers at acceptable complexity and safety?
- **RQ-2 Workspace model** — One shared working tree for all sessions versus one isolated worktree or clone per session. How does each interact with "always latest in the IDE" and with safe integration?
- **RQ-3 Staying current** — How is a local checkout kept continuously up to date (auto-fetch/auto-integrate) without disturbing a session's uncommitted changes? Evaluate `pull --rebase --autostash`, watch-based fetch, and fast-forward-only updates.
- **RQ-4 Safety** — What guarantees prevent orphaned autostashes, overwritten uncommitted files, and force-push loss? What is the rollback story?
- **RQ-5 Automation surface** — Git hooks vs. a background sync daemon vs. a launch wrapper vs. a remote-side bot. Triggering, failure modes, and observability.
- **RQ-6 Conflict handling** — Auto-resolution policies and conflict-avoidance (path partitioning, per-session subtrees, additive-only commit discipline). When is human intervention unavoidable? How does an AI-assisted resolver fit safely (Request A)?
- **RQ-7 Existing art** — Prior tooling and patterns (e.g. Kubernetes/simonthum/wei `git-sync`, `git-auto-sync`, `mob`, `syncthing`-style mirroring, GitHub merge queue, git-town, Gerrit) and their fit for the single-operator many-AI-session case.
- **RQ-8 Primary never behind origin** — What exact mechanism keeps the operator's primary checkout never behind origin, and at what cost? (Added after the fan-out; answered at synthesis and hardened through the three-pass verification. Its evidence asymmetry — synthesis-stage rather than lineage-level — is recorded honestly in the decision record.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Methodology: `plan.md`
- Task queue: `tasks.md`
- QA checklist: `checklist.md`
- Decision record: `decision-record.md`
- Implementation summary: `implementation-summary.md`
- Reconciled synthesis: `research/research.md`
- Fan-out attribution: `research/fanout-attribution.md`
