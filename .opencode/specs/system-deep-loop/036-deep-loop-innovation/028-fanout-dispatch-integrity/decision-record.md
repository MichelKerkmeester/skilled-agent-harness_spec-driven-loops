---
title: "Decision Record: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "Decision record for 028-fanout-dispatch-integrity: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored ADR-001 through ADR-003 from the WS1 phase-tree proposal"
    next_safe_action: "Operator accepts or rejects ADR-001 through ADR-003"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fulfillment is derived from a per-mode artifact contract, never from report presence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-001-context -->
### Context

`F-010-01` records that a lineage is accepted when one non-empty top-level report exists, with no validation of state JSONL, iteration records, deltas, findings registry or terminal synthesis. `F-010-02` records that under the max-iterations policy a single synthesis record's self-reported `totalIterations` and `stopReason` are trusted over the actual iteration files. The review observed this fabrication mode live: a fan-out lineage emitted formally valid artifacts it had not earned.

### Constraints

- The contract must not reject genuine historical lineages.
- Different modes produce different artifact sets, so the contract must be per mode.
- `031` will add exit-code classification to the same file, so the contract must land first.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A per-mode artifact contract validated before a lineage is fulfilled, with iteration counts derived from actual iteration files.

**How it works**: Each mode declares the artifacts it must produce. Fulfillment validates presence, uniqueness and internal consistency across state JSONL, iteration records, deltas, findings registry and terminal synthesis, and counts iterations from the files rather than from a self-report.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-mode artifact contract** | Fulfillment means the work exists; a self-report cannot fabricate it | Requires enumerating lineage shapes and declaring a contract per mode | 9/10 |
| Keep report-presence fulfillment with a warning on missing artifacts | No contract to write | A warning beside a fulfilled lineage is the status quo failure | 2/10 |
| Validate only the state JSONL | Much cheaper | Catches the missing-state case and misses the self-reported-count case | 5/10 |

**Why this one**: Only a contract over the full artifact set closes both halves: the lineage that produced a report and nothing else, and the lineage that produced a synthesis record claiming work it never did.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A fulfilled lineage means the artifacts exist.
- A synthesis self-report can no longer substitute for iteration files.

**What it costs**:
- A contract must be declared per mode. Mitigation: the lineage-shape census produces most of it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The contract rejects a genuine historical lineage | M | Shape census first; a rejection is investigated as a finding |
| `031` conflicts on the same file | M | Contract lands first; ordering in `MANIFEST.md` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fabrication mode was observed live during the review |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | A contract plus file-derived counts closes both findings |
| 4 | **Fits Goal?** | PASS | Fan-out evidence underpins every mode that uses it |
| 5 | **Open Horizons?** | PASS | A new mode declares a contract rather than inheriting a weak default |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `fanout-run.cjs` fulfillment path.
- A per-mode artifact contract declaration.

**How to roll back**: Revert the fulfillment commit; report-presence fulfillment returns. Record that `F-010-01` and `F-010-02` re-open.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Dispatch moves from shell interpolation to argv

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-016-01` is CONFIRMED-SEVERITY-CALIBRATED: fan-out wrappers interpolate `{research_topic}`, `{config.fanout_json}` and paths straight into a shell command. The values are operator-supplied, so the realistic failure is a broken dispatch from ordinary punctuation rather than an injection incident. The severity label should not be read as a breach risk.

### Constraints

- Some wrappers may rely on shell features that argv removes.
- The calibration must be preserved so a later reader does not escalate this into an incident.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: `execFile` with an argument vector, replacing shell string interpolation in the fan-out wrappers.

**How it works**: Each wrapper builds an argument vector rather than a command string. Any wrapper relying on a shell feature gets an explicit replacement identified during the Phase 1 enumeration.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **argv via `execFile`** | Punctuation cannot break a dispatch; no quoting rules to get right | Wrappers relying on shell features need explicit replacements | 9/10 |
| Shell-quote the interpolated values | Smallest change | Quoting rules are easy to get subtly wrong; the class recurs at the next interpolation site | 5/10 |
| Leave it, document the constraint on topic text | Zero work | Pushes the failure onto the operator with no signal until a dispatch breaks | 2/10 |

**Why this one**: An argument vector removes the class rather than handling it, and the enumeration makes the shell-feature loss explicit rather than silent.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A topic containing quotes, semicolons or spaces dispatches intact.
- No quoting rule to maintain at future interpolation sites.

**What it costs**:
- Wrappers relying on shell features need explicit replacements. Mitigation: enumerated in Phase 1.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A relied-on shell feature is removed silently | M | CHK-012 enumeration with named replacements |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A broken dispatch from ordinary punctuation is a real robustness failure |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | argv removes the class |
| 4 | **Fits Goal?** | PASS | Dispatch must survive ordinary operator input |
| 5 | **Open Horizons?** | PASS | New wrappers inherit the argv pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Fan-out wrapper command construction in the deep command assets.
- `codex-dispatch.cjs` environment filtering.

**How to roll back**: Revert the argv commit per wrapper; shell interpolation returns for that wrapper only.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Containment is uniform across dispatch kinds and detects truncation by content identity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-003-context -->
### Context

Containment is kind-specific and blunt. Native dispatch hardcodes permission bypass and ignores the computed sandbox mode (`F-016-02`, corroborated in part and observed live reverting 15 untracked files belonging to a concurrent session). `cli-opencode` records read-only and workspace-write as effective while emitting no enforcing flag (`F-016-03`). Post-dispatch containment runs only for `cli-codex`. The guard exempts pre-existing dirty paths by pathname, so a child can truncate an already-dirty out-of-scope file (`F-016-04`), and it returns an empty violation list when the artifact realpath falls outside the worktree (`F-016-05`).

### Constraints

- Some dispatch kinds may genuinely be unable to enforce a computed sandbox mode.
- The exemption for pre-existing dirty paths exists for a reason: a concurrent session's in-progress edits must not be reported as violations.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: One containment boundary applied to every dispatch kind, with dirty-path exemption keyed to content identity rather than pathname, and a hard failure when the guard cannot evaluate a scope.

**How it works**: The boundary records content identity for dirty paths before dispatch and compares after, so an exempted path that changed is a violation. A sandbox mode a kind cannot enforce causes a dispatch rejection. An artifact realpath outside the worktree is a hard failure, never an empty violation list.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Uniform boundary + content-identity exemption** | The same protection regardless of kind; truncation of a dirty file is caught; unevaluable scopes fail loudly | A kind that cannot enforce a mode now fails instead of silently proceeding | 9/10 |
| Keep kind-specific containment, extend it to more kinds | Incremental | The next kind added inherits nothing; the class recurs | 4/10 |
| Drop the dirty-path exemption entirely | Simplest rule | A concurrent session's legitimate in-progress edits become violations, which makes the guard unusable | 3/10 |

**Why this one**: Content identity is what distinguishes "this file was already dirty" from "this file was already dirty and the child then truncated it", which is the exact gap the pathname exemption leaves.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A concurrent session is protected from every dispatch kind, not only the one that happens to check.
- Truncation of an already-dirty out-of-scope file is detected.
- An unevaluable scope fails rather than passing vacuously.

**What it costs**:
- A kind that cannot enforce a computed sandbox mode now fails the dispatch. Mitigation: that is the intended behavior; the policy for such kinds is written down.
- Recording content identity for dirty paths costs a pre-dispatch scan. Mitigation: scoped to dirty paths only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A legitimate dispatch is blocked because its kind cannot enforce a mode | M | Policy for such kinds written down rather than emerging from a rejection |
| Pre-dispatch scanning is slow on a large dirty tree | L | Scan scoped to dirty paths; cost recorded in CHK-111 |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A live incident reverted 15 untracked files belonging to a concurrent session |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including dropping the exemption |
| 3 | **Sufficient?** | PASS | Uniformity plus content identity closes all four containment findings |
| 4 | **Fits Goal?** | PASS | Fan-out runs alongside other work and must not damage it |
| 5 | **Open Horizons?** | PASS | A new dispatch kind inherits the boundary |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `write-containment.ts` exemption and scope evaluation.
- `fanout-run.cjs` per-kind containment invocation and sandbox-mode enforcement.

**How to roll back**: Revert the containment commit; kind-specific containment returns. Record that `F-016-02` through `F-016-05` re-open, and note that the live incident this addressed becomes possible again.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
