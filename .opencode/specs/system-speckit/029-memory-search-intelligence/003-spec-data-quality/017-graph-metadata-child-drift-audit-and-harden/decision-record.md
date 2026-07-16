---
title: "Decision Record: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk [template:level_3/decision-record.md]"
description: "ADR-001 picks the drift check's severity and remediation mode: a warning under --strict that becomes blocking once the repo is reconciled, and flag-only reconciliation with no auto-regen of children_ids."
trigger_phrases:
  - "drift check severity decision"
  - "children_ids remediation mode"
  - "flag only vs auto regen"
  - "graph-metadata ADR"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/017-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T06:03:21Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored the ADR-001 decision record for graph-metadata child-drift audit + harden"
    next_safe_action: "Author implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh"
      - ".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/051-graph-metadata-child-drift-audit-and-harden"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Drift-check severity and remediation mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-06 |
| **Deciders** | michel-kerkmeester |

---

<!-- ANCHOR:adr-001-context -->
### Context

A phase parent's `children_ids` only updates when someone reruns `backfill-graph-metadata.js` against that exact parent. Add a child folder and nothing tells you the parent forgot about it. `sk-design` proves it today: `children_ids` lists 8 entries while 9 folders sit on disk, missing `009-sk-design-claude-parity`. `003-spec-data-quality` shows the same pattern at larger scale. Once the audit reconciles the current drift, we need the validator to catch the next occurrence instead of waiting for someone to notice.

Two questions come with that: how loud does the check get when it fires, and does it fix the problem itself or just point at it.

### Constraints

- The check has to run inside `validate.sh --strict` without a daemon or embedding dependency, since it is filesystem-only work.
- Existing drift has to be reconciled before the check goes live, or the first run fails every packet in the repo at once.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The drift check surfaces as a warning under `validate.sh --strict` that only becomes blocking once the repo-wide audit shows zero pre-existing drift, and it stays flag-only. It never rewrites `children_ids` on its own.

**How it works**: `check-graph-metadata.sh` calls the same on-disk child-set resolver the audit uses, compares it against `children_ids`, and reports the parent, the missing children and any extras. A human runs `backfill-graph-metadata.js` on the flagged parent to fix it. The check never edits a file.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: warn-then-block, flag-only** | Ships the check without breaking unrelated work on day one; every `children_ids` change stays reviewable | Drift can sit unnoticed until someone reads the warning | 8/10 |
| Hard error from day one | Fastest path to zero tolerance for drift | Fails every packet with pre-existing drift the moment the check ships, before the reconciliation pass finishes | 4/10 |
| Silent auto-regen | Removes the manual reconciliation step entirely | Overwrites a deliberate exclusion (a numbered folder that should not be a tracked phase) as if it were a bug, with no human in the loop | 3/10 |

**Why this one**: The repo has real, already-confirmed drift (`sk-design`, `003-spec-data-quality`) before this check ships. A hard error on day one would fail both of those and anything else still drifted, for a defect the check itself just found. Warn-then-block sequences the rollout correctly: reconcile first, then tighten.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every phase parent's `children_ids` stays current going forward, so graph traversal and `last_active_child_id` resume selection never silently skip a phase.
- A drifted parent gets an exact, actionable report (which children are missing or extra) instead of a generic failure.

**What it costs**:
- The check only blocks after the full repo reconciles, so it does not protect against drift the moment it ships. Mitigation: the repo-wide audit and backfill run in the same phase, immediately before the check goes live.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A parent drifts again after this phase ships, and no one reads the warning | M | The decision-record itself calls out promoting the check to a hard error once the repo has run clean for a stretch, as a fast follow |
| The child-set definition disagrees with `countPhaseChildren`'s existing definition | M | The drift check reuses the same resolver function, not a second implementation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `sk-design` and `003-spec-data-quality` are drifted right now; the check prevents every future occurrence of the same silent gap |
| 2 | **Beyond Local Maxima?** | PASS | Hard-error and silent-auto-regen were both weighed and rejected with specific reasons, not just the first idea that worked |
| 3 | **Sufficient?** | PASS | Reusing the existing child-set resolver and backfill mechanism is the smallest change that closes the gap; no new discovery logic |
| 4 | **Fits Goal?** | PASS | Directly serves the packet's memory-search-intelligence goal: stale `children_ids` degrades graph traversal, which degrades recall |
| 5 | **Open Horizons?** | PASS | Warn-then-block leaves room to tighten to a hard error later without another redesign |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `check-graph-metadata.sh` gains one new comparison branch (children_ids vs on-disk children), gated at warning severity under `--strict`.
- `is-phase-parent.ts` exports the child-name set alongside its existing count.
- Every drifted `graph-metadata.json` under `.opencode/specs/**` (and `sk-design`) gets its `children_ids` backfilled.

**How to roll back**: `git revert` the `check-graph-metadata.sh` commit to remove the new comparison immediately. The backfill commits stand independently (they reconcile real, already-confirmed drift) and do not need reverting unless a specific parent's backfill is shown to be wrong, in which case `git checkout <pre-backfill-sha> -- <parent>/graph-metadata.json` restores that one parent.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
