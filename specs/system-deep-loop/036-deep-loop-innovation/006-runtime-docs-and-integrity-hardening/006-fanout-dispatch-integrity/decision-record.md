---
title: "Decision Record: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "Decision record for 006-fanout-dispatch-integrity: the architectural rulings this remediation child depends on, with alternatives and consequences."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-fanout-dispatch-integrity"
    last_updated_at: "2026-08-08T02:30:00Z"
    last_updated_by: "claude"
    recent_action: "Added ADR-004 (Accepted); corrected ADR-003's closeout note superseded by new work"
    next_safe_action: "Landed as 568aa17a40; QA gaps: baseline, rollback, tests, contract; F-016-01/F-016-06 deferred"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator accepted ADR-001 through ADR-003 by proceeding with the d0d8623ddf implementation that follows them."
      - "ADR-004 records the follow-on containment work verified this pass: non-fatal advisory semantics, uniform containment, and cli-opencode's default-vs-explicit sandbox policy."
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
| **Status** | Accepted |
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
| **Status** | Accepted |
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

**Closeout note (2026-08-08)**: The decision is Accepted; the wrapper-side attempt was reverted, not the decision. `fanout-run-wrapper.cjs` plus 4 yaml edits could not remove shell interpolation at the yaml `command:` layer — the fix needs command-runner argv support beneath the wrapper. `F-016-01` stays open as a deferred finding; see `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Containment is uniform across dispatch kinds and detects truncation by content identity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
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

**Closeout note (2026-08-08, superseded in part by ADR-004):** At the `d0d8623ddf` landing, delivery was partial: `F-016-04` (content-identity dirty-path detection) and `F-016-05` (out-of-worktree hard failure) landed in `write-containment.ts`, but the "uniform across dispatch kinds" half of this ADR had NOT landed (`fanout-run.cjs` still gated post-dispatch containment on `lineage.kind === 'cli-codex'` only) and `F-016-03`'s fix only labeled an unenforceable `cli-opencode` sandbox mode `advisory-<mode>` and still dispatched, rather than rejecting as this ADR's Decision states. **A later work session (landed as `568aa17a40`, documented in ADR-004) closed both gaps**: `containmentEnabled` is now unconditionally `true`, and `finalizeLineageCommand()` now throws for an explicit unenforceable `cli-opencode` sandbox mode. See ADR-004 for the design that made uniform containment safe to deliver, and `checklist.md` CHK-021/CHK-FIX-004 for the code- and test-evidence citations. `checklist.md` CHK-032 records the residual gap: containment now runs for every kind, but no dedicated per-kind dispatch test exists yet.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Containment failures are non-fatal-by-default, which is what makes uniform containment and a rejecting cli-opencode policy safe to ship

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-004-context -->
### Context

ADR-003 committed to "uniform containment across dispatch kinds" and "a sandbox mode a kind cannot enforce causes a dispatch rejection," but the `d0d8623ddf` landing did not deliver either half (see ADR-003's closeout note): containment stayed `cli-codex`-only, and an unenforceable `cli-opencode` sandbox mode was labeled `advisory-<mode>` and still dispatched.

The reason ADR-003's "uniform" half was never turned on for every kind is a real prior incident, independent of this packet: on a dirty, multi-actor working tree, `write-containment.ts`'s `revertOutOfScopeViolations()` treated any out-of-scope path that was dirty after dispatch but absent from the pre-dispatch baseline as this leaf's own violation and, for a path not present in HEAD, hard-deleted it with `rmSync`. Files created during the dispatch window by the parent orchestrator or a concurrent sibling session are indistinguishable from the leaf's own untracked writes — a research run deleted 12 untracked files this way, 8 of them from unrelated parallel work, unrecoverable. That fix landed once upstream as `6d762f4393` (2026-08-06). `3372513722` (2026-08-07), packet `020`'s "behavior-preserving" MODULE-header refactor across 13 runtime files, silently reintroduced the `rmSync`/`removed_untracked` deletion path — a regression, not an intended behavior change. `d0d8623ddf` (2026-08-07), this packet's own landing, then built the `F-016-04`/`F-016-05` containment work on top of the reintroduced regression without noticing it had returned. Turning containment on for every dispatch kind while that deletion bug was live would have widened the blast radius of exactly the incident `6d762f4393` was written to prevent — which is why ADR-003's uniform-containment half was deferred rather than shipped unsafe.

Separately, `cli-opencode` exposes no OS-level sandbox or permission-scoping flag: `read-only` and `workspace-write` are indistinguishable to it at the command level, so labeling either "effective" is a false guarantee, and silently downgrading a genuine confinement request to unconfined writes is worse than telling the caller the request cannot be honored.

### Constraints

- Restoring the delete-prevention fix must not simply re-add it in isolation; it must be the reason uniform containment becomes safe to enable, not a parallel unrelated fix.
- A dispatch kind's own legitimate out-of-`lineageDir` write locations (e.g. a repo-local CLI config dir) must stay excluded from attribution once containment runs everywhere, or a legitimate write becomes a false violation.
- `cli-opencode`'s ordinary (unspecified-sandbox) callers must keep dispatching without change; only an explicit, unenforceable confinement request should be rejected.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Never delete an unattributable out-of-scope path — only a git-recoverable, in-HEAD breach is fatal; a not-in-HEAD path is preserved on disk and reported as a non-fatal advisory. That non-fatal-by-default semantics is what makes it safe to enable containment for every dispatch kind, not only `cli-codex`. Separately, `cli-opencode` rejects an explicit, unenforceable sandbox mode (`read-only`/`workspace-write`) with a thrown dispatch failure, while an unspecified sandbox mode defaults to `danger-full-access` — the one mode it can honestly report as effective — so ordinary dispatch is unaffected.

**How it works**: `revertOutOfScopeViolations()` restores an in-HEAD path from HEAD (recoverable, fatal on failure) and, for a not-in-HEAD path, preserves it and marks the action `preserved_untracked` — it never calls a delete. `enforceWriteContainment()` partitions its findings into `violations` (fatal) and `advisories` (non-fatal, logged via a new `containment_advisory` ledger event). `fanout-run.cjs` sets `containmentEnabled = true` unconditionally and excludes each dispatch kind's own known legitimate write locations (currently only `cli-claude-code`'s resolved `configDir`) from attribution the same way sibling lineage directories already were. `finalizeLineageCommand()` throws for `cli-opencode` when an explicit `resolvedSandbox` is not `danger-full-access`; the caller resolves an unspecified `sandboxMode` to `danger-full-access` before reaching that check, so a caller that never asked for confinement is never rejected.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Non-fatal advisory semantics + uniform containment + reject-on-explicit-request** | Turns on the same protection for every kind without reintroducing the delete-incident risk; an unenforceable confinement request fails loudly instead of silently | A not-in-HEAD path this leaf actually DID create incorrectly is also preserved rather than cleaned up — accepted, since attribution cannot distinguish it from a concurrent write | 9/10 |
| Extend `cli-codex`-only containment to every kind without changing delete behavior | Smaller diff | Reproduces the exact incident `6d762f4393` fixed, at a wider blast radius (every kind, not just `cli-codex`) | 1/10 |
| Keep `cli-opencode`'s `advisory-<mode>` label-and-dispatch behavior | No caller-facing behavior change | A caller that explicitly asked for confinement gets an unconfined dispatch with only a label to notice by — the exact false-guarantee ADR-003 identified as the defect | 2/10 |
| Default unspecified `cli-opencode` sandbox to `workspace-write` (the repo-wide default) instead of `danger-full-access` | Consistent with other kinds' default | `cli-opencode` cannot enforce `workspace-write` either — this would make the default itself dishonest and, worse, indistinguishable from an explicit rejected request without special-casing "was it specified" | 3/10 |

**Why this one**: Non-fatal advisory semantics is the single change that makes both other decisions safe: uniform containment no longer risks an incident-class deletion, and `cli-opencode`'s explicit-request rejection can be added without also breaking every caller that never asked for a sandbox mode it can't enforce.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The `6d762f4393` incident class (irreversible deletion of an unattributable concurrent write) cannot recur, for any dispatch kind.
- Containment now genuinely protects every dispatch kind, closing REQ-010/NFR-C01 at the code level.
- A caller that explicitly requests a sandbox mode `cli-opencode` cannot enforce is told so, rather than silently downgraded — closing REQ-003 at the code level.
- Ordinary `cli-opencode` dispatch (no explicit sandbox mode) is unaffected.

**What it costs**:
- A leaf's own genuinely out-of-scope untracked write, if not-in-HEAD, is now preserved rather than cleaned up — it becomes visible as an advisory instead of silently disappearing. Mitigation: this is the intended trade (recoverability over silent cleanup); the advisory is logged for an operator to review.
- No dedicated test yet dispatches a non-`cli-codex` kind through `fanout-run.cjs` and asserts containment engaged for it (`checklist.md` CHK-032). Mitigation: the underlying guard (`write-containment.ts`) is unit-tested at 18/18; the per-kind dispatch-integration gap is named rather than hidden.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An advisory is mistaken for "nothing to worry about" because it never fails the iteration | M | The `containment_advisory` ledger event is distinct from silence; an operator reviewing the state log sees it |
| The `kindLegitimateDirs` exclusion list does not keep pace with a future dispatch kind's own legitimate write locations | M | Currently a single, explicit exclusion (`cli-claude-code`'s `configDir`); a new kind's legitimate writes need the same explicit treatment, not an implicit default |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `020`'s `3372513722` silently reintroduced a real, previously-fixed data-loss regression that `028`'s own `d0d8623ddf` then built on top of |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including two narrower fixes that would have reproduced the incident class or the false-guarantee defect |
| 3 | **Sufficient?** | PASS | Closes both of ADR-003's undelivered halves (uniform containment, REQ-003 rejection) without reopening the delete-incident risk |
| 4 | **Fits Goal?** | PASS | Fan-out runs alongside other work and must not damage it; a sandbox mode label must not misstate what is actually enforced |
| 5 | **Open Horizons?** | PASS | A new dispatch kind inherits non-fatal-by-default containment automatically; only its own legitimate-write exclusions need explicit declaration |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `write-containment.ts`: `revertOutOfScopeViolations()` no longer imports or calls `rmSync`; `ContainmentRevertAction.action` is `'restored_from_head' | 'preserved_untracked'`; `EnforceResult` gains an `advisories` field alongside `violations`.
- `fanout-run.cjs`: `containmentEnabled = true` unconditionally; `kindLegitimateDirs`/`containmentUnattributableDirs` extend the existing sibling-lineage exclusion; a new `containment_advisory` ledger event logs non-fatal findings; `finalizeLineageCommand()` throws for `cli-opencode` on an explicit unenforceable `resolvedSandbox`; an unspecified `cli-opencode` `sandboxMode` resolves to `danger-full-access` before reaching that check.
- `write-containment.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts`: test coverage for all of the above (18/18, 102/102, 2/2 respectively, fresh run).

**How to roll back**: Revert the containment-overhaul commit (`568aa17a40`); `containmentEnabled` reverts to `cli-codex`-only, `cli-opencode` reverts to advisory-label-and-dispatch, and `revertOutOfScopeViolations()` reverts to `rmSync`-deleting not-in-HEAD paths — reopening the `6d762f4393` incident class along with `F-016-02` through `F-016-05` and `F-016-03`'s true-rejection guarantee. Given the incident this fix corrects, a rollback should not be taken without an equivalent delete-prevention safeguard in place first.

**Landing note (2026-08-08)**: The change described here landed as `568aa17a40` on `skilled/v4.0.0.0` — verified against code and a fresh test run. This ADR documents the accepted design; `checklist.md`'s Second Reconciliation Pass ledger carries the landing status forward.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
