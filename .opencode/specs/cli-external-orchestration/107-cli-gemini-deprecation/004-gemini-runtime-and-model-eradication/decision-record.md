---
title: "Decision Record: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Decisions for the Gemini runtime + model eradication: runtime eradication, swap/rewrite for comparison content, concurrent-session coordination, changelog edits, gate-3 neutrality, and the external-binary boundary."
trigger_phrases:
  - "gemini runtime eradication decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded decisions for Gemini runtime+model eradication"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/skills/system-skill-advisor/**"
      - ".opencode/skills/cli-claude-code/references/claude_tools.md"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:e3eb5574f01857ac504d8215a64bba6715657a1ea080b96c94e966451e379b43"
      session_id: "gemini-deprecation-phase4-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Eradicate Gemini as a host runtime and as a model everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Eradicate Gemini as a host runtime entirely

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

After phases 001-003 removed the `cli-gemini` executor/skill, Gemini still existed as a host runtime: `gemini-cli` was a member of every `RuntimeId` union and its detection logic in system-spec-kit and system-code-graph, `hooks/gemini/**` subsystems lived in two skills (system-spec-kit `mcp_server` and system-skill-advisor), and the `GEMINI.md` root-doc convention treated Gemini as a first-class host. The operator then directed "no Gemini anywhere" outside `specs/**`.

### Constraints

- Remove Gemini from runtime detection, hook subsystems, and the doc convention without breaking the surviving runtimes.
- Keep the hook re-export parity and runtime fixtures internally consistent after the enum narrows.
- Leave `specs/**` and the external Gemini-CLI binary state untouched.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove `gemini-cli` from all runtime-detection enums, delete the `hooks/gemini/` subsystems in both skills, and drop the `GEMINI.md` doc convention.

**How it works**: In system-spec-kit `mcp_server`, the `hooks/gemini/` directory is deleted, `gemini-cli` leaves the `RuntimeId` union and detection in `lib/runtime-detection.ts`, and `hooks/index.ts`, `hooks/README.md`, the runtime fixtures, and five suites are updated. system-code-graph drops `gemini-cli` from its runtime enum and test. system-skill-advisor deletes its own `hooks/gemini/` subsystem with the test and two Gemini docs and de-indexes its feature catalog (37 to 36) and playbook (46 to 45).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Eradicate the runtime surface entirely** | Satisfies "no Gemini anywhere"; clean enums and hooks | Larger blast radius than the executor purge | 10/10 |
| Keep the runtime surface deferred | No further work now | Leaves Gemini as a host runtime against operator direction | 2/10 |

**Why this one**: The operator directed a full eradication outside `specs/**`, so the deferred runtime surface had to go.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Runtime detection and hooks no longer treat Gemini as a supported host.
- The `RuntimeId` unions in both MCP servers are clean and consistent.

**What it costs**:
- A larger blast radius. Mitigation: targeted suites (hooks 59, code-graph 14) and a coordinated concurrent session.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Type narrowing breaks after the union change | H | Update index/parity/fixtures/tests before verification. |
| A hook subsystem deletion leaves a dangling export | M | Update `hooks/index.ts` and run re-export parity. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator directed full eradication; runtime surface still existed. |
| 2 | **Beyond Local Maxima?** | PASS | Considered leaving the runtime deferred. |
| 3 | **Sufficient?** | PASS | Removing enums + hooks + doc convention clears the runtime surface. |
| 4 | **Fits Goal?** | PASS | Directly serves "no Gemini anywhere". |
| 5 | **Open Horizons?** | PASS | Leaves a clean multi-runtime detection surface. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- system-spec-kit `mcp_server`: `hooks/gemini/` deleted; `lib/runtime-detection.ts` `RuntimeId` narrowed; `hooks/index.ts`, README, fixtures, and 5 suites updated.
- system-code-graph `mcp_server/lib/runtime-detection.ts` + test narrowed.
- system-skill-advisor: `hooks/gemini/` + test + 2 docs deleted; catalog/playbook de-indexed.

**How to roll back**: Restore the deleted `hooks/gemini/` subsystems, the enum members, and the 4 deleted advisor/runtime files from git.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Swap or rewrite, not gut, for comparison/example content

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-002-context -->
### Context

Some docs used Gemini as a comparison column or a sample value: `cli-claude-code/references/claude_tools.md` was a 3-way "Claude vs Gemini vs Codex" comparison, and a dashboard sample used Gemini. Deleting these would lose instructional value.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: rewrite comparison/example content rather than delete it.

**How it works**: `claude_tools.md` is rewritten from a 3-way comparison to a 2-way Claude-vs-Codex comparison, preserving the surviving-tool value. The dashboard sample is swapped from Gemini to Codex.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rewrite 3-way to 2-way; swap samples** | Preserves comparison value | More authoring effort | 9/10 |
| Delete the comparison pages | Simplest | Loses the surviving-tool comparison value | 3/10 |

**Why this one**: It satisfies the eradication while keeping the comparison docs coherent and useful.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Comparison docs stay coherent with one fewer column.

**What it costs**:
- More authoring effort than a delete. Mitigation: a single focused rewrite per affected doc.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A rewrite drifts from the original doc intent | L | Keep the comparison shape; only the Gemini column changes. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Eradication requested; comparison docs must still teach. |
| 2 | **Beyond Local Maxima?** | PASS | Considered deleting the pages. |
| 3 | **Sufficient?** | PASS | A 2-way rewrite removes Gemini without coverage loss. |
| 4 | **Fits Goal?** | PASS | Serves the eradication while preserving doc value. |
| 5 | **Open Horizons?** | PASS | Leaves a clean Claude-vs-Codex comparison. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: `cli-claude-code/references/claude_tools.md` rewritten 3-way to 2-way; the dashboard sample swapped Gemini to Codex.

**How to roll back**: Revert the rewritten doc and the dashboard sample from git.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Coordinate-not-thrash with the concurrent devin-removal session

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-003-context -->
### Context

A concurrent session was independently removing `devin` from `system-skill-advisor`, touching the same runtime-value tuple, hook files, and tests that this Gemini eradication needed to edit. Editing all of them unilaterally would clobber the other session's in-flight work.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: merge the Gemini removal cleanly into the shared runtime-value tuple and defer two files to the concurrent session.

**How it works**: Gemini is removed from `advisor-runtime-values.ts`, `metrics.ts`, the tool schemas, the plugin bridge, `skill_advisor.py`, and the parity/observability/plugin-bridge tests so the merged result has Gemini fully gone. Two files are deferred: `mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts` (its Gemini mentions are pro-eradication negative assertions) and `references/decisions/deferred_decisions.md` (historical migration records).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merge tuple cleanly; defer 2 files** | Avoids thrash; Gemini fully gone from the tuple/hooks | Two files cleared by the other session | 9/10 |
| Edit all advisor files unilaterally | One owner | Clobbers the concurrent `devin` removal | 2/10 |

**Why this one**: It removes Gemini from the live surface without racing the concurrent session.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The runtime-value tuple and hooks have Gemini fully gone after the merge.

**What it costs**:
- Two files remain with Gemini mentions until the concurrent session clears them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The deferred files are forgotten | M | Documented here and in the resource map as deferred. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A concurrent session shared the same files. |
| 2 | **Beyond Local Maxima?** | PASS | Considered editing everything unilaterally. |
| 3 | **Sufficient?** | PASS | Clean merge + 2 deferrals clears the live surface. |
| 4 | **Fits Goal?** | PASS | Removes Gemini from the live runtime-value tuple. |
| 5 | **Open Horizons?** | PASS | The 2 deferred files are pro-eradication and historical. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: Gemini removed from the advisor runtime-value tuple, metrics, schemas, bridge, Python script, and 3 tests + bench; 2 files deferred to the concurrent session.

**How to roll back**: Revert the advisor tuple/consumer edits from git; the 2 deferred files were never edited here.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Edit release-history changelogs as part of the eradication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-004-context -->
### Context

Release-history changelogs across ten components named Gemini and carried runtime/mirror counts that included it. Changelogs are normally immutable history, so editing them needs an explicit decision.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: edit the 43 changelog files (plus top-level `PUBLIC_RELEASE.md`) that name Gemini, and reconcile their runtime/mirror counts.

**How it works**: The operator directed "no Gemini anywhere" with only `specs/**` exempt, so the affected changelogs under `.opencode/changelog/**` were edited to remove Gemini, reconcile counts (e.g. 5 to 4, 4 to 3), and remove Gemini-only sections/rows.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Edit changelogs + reconcile counts** | Achieves a truly clean global search | Diverges from as-shipped history | 9/10 |
| Leave changelogs untouched | Preserves history verbatim | Leaves Gemini references; fails the eradication | 2/10 |

**Why this one**: The operator's eradication scope explicitly overrides changelog immutability, with only `specs/**` exempt.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Global `rg` exclusion is clean apart from the 2 documented deferred files.

**What it costs**:
- Slight divergence from as-shipped changelog wording and counts, by operator direction.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| History edits surprise future readers | L | Decision recorded here; `specs/**` retains the full record. |
| A reconciled count drifts | L | Counts reconciled per component (e.g. 5 to 4, 4 to 3). |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required for a near-zero global search. |
| 2 | **Beyond Local Maxima?** | PASS | Considered leaving history untouched. |
| 3 | **Sufficient?** | PASS | Editing 43 changelogs + `PUBLIC_RELEASE.md` clears the references. |
| 4 | **Fits Goal?** | PASS | Directly serves the full eradication. |
| 5 | **Open Horizons?** | PASS | No future history surface points at a removed runtime/model. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: Edit changelogs under `.opencode/changelog/{agent-orchestration,system-spec-kit,deep-ai-council,deep-improvement,deep-research,deep-review,cli-*,sk-doc,sk-prompt-models}/**` and top-level `PUBLIC_RELEASE.md`; reconcile runtime/mirror counts.

**How to roll back**: Revert the changelog and `PUBLIC_RELEASE.md` edits from git.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Treat the gate-3-classifier Gemini token as behavior-neutral

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-005-context -->
### Context

`shared/gate-3-classifier.ts` contained a Gemini reference, which raised the question of whether removing it would change Gate-3 classification behavior.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: remove the Gemini token from `gate-3-classifier.ts` as a behavior-neutral edit.

**How it works**: The Gemini reference was a docs-comment `GEMINI.md` token only, not part of the classification logic. Removing it makes no change to which prompts Gate 3 classifies as writes.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove the docs-comment token (behavior-neutral)** | Clears the reference with no logic change | Requires confirming the token is comment-only | 10/10 |
| Leave the token to avoid touching the classifier | No classifier edit | Leaves a Gemini reference; fails the eradication | 2/10 |

**Why this one**: The token was provably docs-comment only, so removal is safe and required.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The classifier source carries no Gemini reference.

**What it costs**:
- A small confirmation step that the token was comment-only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader assumes Gate-3 logic changed | L | This ADR records that the edit is behavior-neutral. |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A Gemini token remained in the classifier source. |
| 2 | **Beyond Local Maxima?** | PASS | Considered leaving the token. |
| 3 | **Sufficient?** | PASS | Removing the comment clears the reference. |
| 4 | **Fits Goal?** | PASS | Serves the global eradication. |
| 5 | **Open Horizons?** | PASS | No behavior change to revisit later. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**: Remove the `GEMINI.md` docs-comment token from `shared/gate-3-classifier.ts`; no classification logic changes.

**How to roll back**: Restore the comment line from git.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Preserve the external Gemini-CLI binary state in the user home

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-006-context -->
### Context

The user home contains `~/.gemini` and a `.geminiignore` file that belong to the external Gemini-CLI binary, not to this project's runtime. The eradication scope is "everywhere outside specs", which raised whether these external paths should also be removed.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: leave `~/.gemini` and `.geminiignore` intact.

**How it works**: These paths are third-party binary state outside the project's runtime/model surface. The eradication targets only project source, docs, and history, so the external binary state is untouched.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve the external binary state** | Respects the third-party binary boundary | A literal reading of "everywhere" might expect removal | 10/10 |
| Remove `~/.gemini` and `.geminiignore` | Maximally literal | Deletes unrelated third-party binary state | 1/10 |

**Why this one**: The eradication is about the project surface, not the external Gemini-CLI binary's own state.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The third-party Gemini-CLI binary keeps its own user-home state.

**What it costs**:
- The literal "everywhere" scope is qualified to the project surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reviewers expect even external state gone | L | Boundary stated in spec out-of-scope and this ADR. |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Bounds the eradication to the project surface. |
| 2 | **Beyond Local Maxima?** | PASS | Considered removing the external state. |
| 3 | **Sufficient?** | PASS | Project-surface removal meets the operator intent. |
| 4 | **Fits Goal?** | PASS | The goal is the project runtime/model surface. |
| 5 | **Open Horizons?** | PASS | Leaves the external binary boundary clean. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**: Nothing in the user home; only project paths are edited.

**How to roll back**: Not applicable; the external binary state was never touched.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->
