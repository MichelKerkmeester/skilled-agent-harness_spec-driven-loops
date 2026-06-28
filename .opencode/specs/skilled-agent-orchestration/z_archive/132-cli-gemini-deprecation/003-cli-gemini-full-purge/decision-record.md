---
title: "Decision Record: Purge the cli-gemini executor everywhere outside specs"
description: "Decisions for the cli-gemini executor purge: swap-not-delete, changelog edits, executor-only boundary, and the matrix recount."
trigger_phrases:
  - "cli-gemini executor purge decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded decisions for cli-gemini executor purge"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/skills/sk-code-review/manual_testing_playbook/**"
      - ".opencode/skills/sk-git/manual_testing_playbook/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:f159a452875025b0d528c276fb889757f8a4369bc0344f4284289e7a335c33b9"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Purge the cli-gemini executor everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Swap-not-delete for mixed cross-CLI artifacts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

Some artifacts paired `cli-gemini` with another CLI specifically to exercise cross-CLI behavior: the multi-AI council fixture, the sk-code-review CR-018 handback (`cli-opencode` + `cli-gemini`), and the sk-git GIT-022 handback (`cli-gemini` + `cli-copilot`). Deleting these would drop coverage of the surviving CLI in each pairing.

### Constraints

- Preserve cross-CLI coverage of the non-Gemini CLI in each mixed artifact.
- Keep stable scenario IDs (CR-018, GIT-022) and playbook counts (18, 22).
- Delete only artifacts that are purely about `cli-gemini`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: swap `cli-gemini` to another CLI in mixed artifacts and delete only purely-`cli-gemini` artifacts.

**How it works**: In the council fixture and its assertion, `cli-gemini`→`cli-opencode`. In CR-018, rename the handback to `...-cli-codex-handback.md` and swap `cli-gemini`→`cli-codex`. In GIT-022, rename to `cli-codex-and-cli-copilot-handback.md` and swap `cli-gemini`→`cli-codex`. The matrix adapter (`adapter-cli-gemini.ts`) and its test are purely-Gemini, so they are deleted outright.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Swap mixed artifacts, delete pure-Gemini ones** | Preserves other-CLI coverage; keeps IDs/counts stable | Requires per-artifact classification | 10/10 |
| Delete every `cli-gemini` artifact | Simplest | Loses cross-CLI coverage in mixed scenarios | 3/10 |
| Keep `cli-gemini` as a deprecated foil | No coverage loss | Violates the operator's full-purge direction | 2/10 |

**Why this one**: It satisfies the full purge while keeping the cross-CLI test surface intact.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cross-CLI coverage of `cli-codex`/`cli-opencode` survives the purge.
- Stable scenario IDs and counts keep playbook indexes aligned.

**What it costs**:
- Per-artifact classification effort. Mitigation: a single inventory pass tagged each artifact delete or swap.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A swap silently drops the intent of the original scenario | M | Keep the cross-CLI handback shape; only the Gemini side changes. |
| Counts drift after rename | L | Verify CR-018=18 and GIT-022=22 post-rename. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Full purge requested; mixed artifacts must still cover other CLIs. |
| 2 | **Beyond Local Maxima?** | PASS | Considered delete-all and keep-as-foil. |
| 3 | **Sufficient?** | PASS | Swap + targeted delete removes `cli-gemini` without coverage loss. |
| 4 | **Fits Goal?** | PASS | Directly serves the executor purge. |
| 5 | **Open Horizons?** | PASS | Leaves a clean 3-CLI cross-orchestration surface. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Council fixture + assertion swapped to `cli-opencode`.
- CR-018 and GIT-022 handbacks renamed and swapped to `cli-codex`; indexes updated.
- Matrix adapter and its test deleted (source + dist).

**How to roll back**: Restore the deleted adapter/test/dist and revert the swaps from git.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Edit release-history changelogs as part of the purge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-002-context -->
### Context

Release-history changelogs across several components named `cli-gemini` as an executor. Changelogs are normally treated as immutable history, so editing them needs an explicit decision.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: edit the ~13 changelogs that name `cli-gemini` as an executor.

**How it works**: The operator explicitly directed "purge everything" with only `specs/**` exempt, so the affected changelogs under `.opencode/changelog/**` were edited to remove `cli-gemini` executor wording.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Edit changelogs per operator direction** | Achieves a truly clean global search | Diverges from as-shipped history | 9/10 |
| Leave changelogs untouched | Preserves history verbatim | Leaves `cli-gemini` references; fails the purge | 2/10 |

**Why this one**: The operator's purge scope explicitly overrides changelog immutability, with only `specs/**` exempt.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Global `rg` exclusion is truly clean; no surface advertises `cli-gemini`.

**What it costs**:
- Slight divergence from as-shipped changelog wording, by operator direction.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| History edits surprise future readers | L | Decision recorded here; `specs/**` retains the full record. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required for a zero-match global search. |
| 2 | **Beyond Local Maxima?** | PASS | Considered leaving history untouched. |
| 3 | **Sufficient?** | PASS | Editing the ~13 changelogs clears the remaining references. |
| 4 | **Fits Goal?** | PASS | Directly serves the full purge. |
| 5 | **Open Horizons?** | PASS | No future surface points at a deleted executor. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: Edit changelogs under `.opencode/changelog/{agent-orchestration,cli-devin,cli-opencode,deep-research,deep-review,sk-prompt-models,system-skill-advisor,system-spec-kit}/**` that name `cli-gemini` as an executor.

**How to roll back**: Revert the changelog edits from git.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Scope to the executor/skill surface; defer Gemini runtime and model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | User, claude-opus |

---

<!-- ANCHOR:adr-003-context -->
### Context

"Gemini" appears in the repo in three distinct roles: as the `cli-gemini` executor/skill, as a runtime (hooks, runtime-detection, runtime mirrors), and as a model (`gemini-flash`, `gemini-3.1-pro`). The runtime surface alone is roughly 198 files.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: remove the `cli-gemini` executor/skill surface only and leave Gemini-as-runtime and Gemini-as-model intact, flagged for a separate decision.

**How it works**: The purge targets executor references. Runtime detection, hooks, runtime mirrors, and model IDs are left untouched so the ~198-file runtime surface and the model surface can be decided independently.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Executor-only purge, defer runtime/model** | Bounded, verifiable, reversible | Leaves Gemini runtime/model references temporarily | 9/10 |
| Purge executor + runtime + model in one packet | One sweep | ~198-file blast radius; conflates three decisions | 3/10 |

**Why this one**: It keeps this phase bounded and lets the larger runtime/model question get its own decision.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A clean, verifiable executor purge with a small, reversible blast radius.

**What it costs**:
- Gemini runtime/model references remain until a follow-on decision.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reviewers expect all Gemini references gone | M | Boundary stated in spec scope and this ADR. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Bounds the phase to a verifiable scope. |
| 2 | **Beyond Local Maxima?** | PASS | Considered a single all-surface sweep. |
| 3 | **Sufficient?** | PASS | Removes the executor surface fully. |
| 4 | **Fits Goal?** | PASS | The phase goal is the executor purge. |
| 5 | **Open Horizons?** | PASS | Leaves the runtime/model decision open and clean. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: Only executor references are removed. Runtime-detection, hooks, runtime mirrors, and model IDs are untouched.

**How to roll back**: Not applicable; the deferred surfaces were never edited.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Recount the matrix to 39 cells after removing cli-gemini

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-08 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-004-context -->
### Context

The matrix runner manifest enumerated cells as feature × executor. Removing `cli-gemini` (and its F11 applicability and the F8 feature) requires a deterministic recount so `matrix-manifest.json` stays internally consistent.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: recount the matrix to 13 features × 3 executors = 39 cells, with no F8, after removing all `cli-gemini` cells and the F11 applicability.

**How it works**: The surviving executors are `cli-codex`, `cli-claude-code`, and `cli-opencode`. The manifest, `run-matrix.ts` union/array/switch, README, and template README all reflect the 3-executor, 39-cell shape.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Recount to 39 cells (no F8)** | Internally consistent; valid JSON | Requires manifest + code + docs alignment | 10/10 |
| Leave empty `cli-gemini` cells | Less editing | Invalid/misleading manifest | 1/10 |

**Why this one**: A clean recount keeps the matrix tooling and its tests honest.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- `matrix-manifest.json` is valid JSON with a consistent 39-cell count.

**What it costs**:
- Manifest, code, and docs must be kept in lockstep. Mitigation: the matrix-adapter suite (13/13) guards consistency.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manifest count drifts from code | M | matrix-adapter suite GREEN; JSON validated. |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Removing an executor requires a recount. |
| 2 | **Beyond Local Maxima?** | PASS | Considered leaving empty cells. |
| 3 | **Sufficient?** | PASS | 39-cell recount restores consistency. |
| 4 | **Fits Goal?** | PASS | Keeps the matrix tooling honest post-purge. |
| 5 | **Open Horizons?** | PASS | A clean 3-executor matrix is easy to extend. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: `matrix-manifest.json` cells, `run-matrix.ts` union/array/switch, matrix README and template README reflect 13 × 3 = 39 cells, no F8.

**How to roll back**: Restore the prior manifest and `run-matrix.ts` from git.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
