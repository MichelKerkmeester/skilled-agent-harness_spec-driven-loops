---
title: "Decision Record: Phase 7: status-index"
description: "Five decisions for the status index: the SQLite binding, the retention numbers and needs-you item retention (both accepted by the operator), the index key with relink and the stale signal."
trigger_phrases:
  - "status index decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/007-status-index"
    last_updated_at: "2026-11-22T10:48:33Z"
    last_updated_by: "template-author"
    recent_action: "Accepted ADR-005 on operator decision D10 and recorded D9 and D10"
    next_safe_action: "Get the operator answer on ADR-001 before T002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-status-index"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 7: status-index

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse better-sqlite3 as the index binding

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Build owner. Needs operator confirmation |

---

<!-- ANCHOR:adr-001-context -->
### Context

The index needs SQLite in WAL mode (research.md §12). The repository already runs SQLite through two bindings. The deep-loop coverage graph imports `better-sqlite3` (`.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:9`) and sets only `journal_mode = WAL` and `foreign_keys = ON` (lines 342 and 343). The deep-loop runtime declares `"better-sqlite3": "^12.11.1"` in its own `package.json` and says it is a self-contained dependency root, so code does not reach into a sibling skill's `node_modules`. Other code uses the built-in `node:sqlite` module instead: the sk-design style database (`.skilled/skills/sk-design/sk-design-md-generator/styles/lib/database/schema.mjs:5`), the doctor graph freshness check (`.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:114`) and the decision-capture sweeps (`.skilled/hooks/decision-capture/bin/sweep-devin.mjs:346`). The phase plan asks to reuse what the coverage graph uses, so that binding is the recommendation.

### Constraints

- The hub must not import from another skill's `node_modules`, by the rule the deep-loop `package.json` states.
- The local Node is v26.13.0, so the built-in `node:sqlite` module is also available here. Consumer machines may run an older Node.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: declare `better-sqlite3` at the same range, `^12.11.1`, in the hub's own runtime `package.json`.

**How it works**: The index opens one `Database` and sets `journal_mode = WAL`, `busy_timeout = 5000` and `synchronous = FULL`. The last two follow Hermes, because the coverage graph does not set them (research.md §12).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`better-sqlite3` in the hub's own dependency root** | Same binding and version the repository already builds and tests. Synchronous API fits a CLI | A native build per Node major version | 8/10 |
| Built-in `node:sqlite` | No dependency, no native build | Ties the hub to a recent Node on every consumer machine. Used elsewhere in the repository, but not by the coverage graph the phase plan names | 6/10 |
| Import the deep-loop copy | No new install | Breaks the self-contained dependency rule and couples the hub to deep-loop upgrades | 2/10 |

**Why this one**: It reuses a binding the repository already depends on, without crossing a skill boundary.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The same `better-sqlite3` range as the coverage graph.
- The hub installs and upgrades on its own.

**What it costs**:
- A second native install of the same package. Mitigation: pin the same range as deep-loop so both move together.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The native module fails to load after a Node upgrade | M | Status exits non-zero with a message naming the binding. It never falls back to reading run folders |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The index needs SQLite. A JSONL index needs a tail repair before every read (research.md §12) |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | Reuses an existing binding and version |
| 4 | **Fits Goal?** | PASS | `bots status` reads the index on every call |
| 5 | **Open Horizons?** | PASS | Switching to `node:sqlite` later touches one open call |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The hub runtime `package.json` gains `better-sqlite3`.
- `status-index.ts` opens the file and sets three pragmas.

**How to roll back**: Remove the dependency line, revert `status-index.ts` and delete the index file under the state root.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Retention numbers (operator-owned)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, through the question tool on 2026-11-22. Answer: "Proposed defaults (Recommended)". This is research.md §16 Q8 |

---

<!-- ANCHOR:adr-002-context -->
### Context

Retention must be bounded and independent of the checkout. A missing checkout prunes nothing (research.md §12). Hermes keeps 1,000 terminal rows and blanks terminal payloads. That is the only precedent. The research derived no number for the index, the run directories or the skipped-slot summary (research.md §16 Q8).

### Constraints

- An hourly bot writes 24 runs a day, so 1,000 rows cover about six weeks of one such bot.
- Run directories hold the five audit records (research.md §12), so they cost far more disk than index rows.
- Run folders live in the resolved Skilled tree, under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`, which git ignores. That is an operator decision. The index stays under the user-level state root.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep 1,000 terminal index rows per repository identity, the newest 200 run folders per bot, and at most 100 slot times in one skipped-slot summary, with a count of the rest. All three numbers are defaults that `bots/config.json` can change.

**How it works**: Retention runs after each index write. It deletes oldest terminal rows first and never touches a running row. It deletes run folders only under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` in the resolved Skilled tree. It resolves each target path first and refuses any path outside that folder. The numbers were proposed, not derived. The operator accepted them as defaults.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Count bounds per identity and per bot** | Easy to test. Follows Hermes | A noisy bot can push out a quiet bot's history inside one identity | 7/10 |
| Age bounds, such as 30 days | Matches how people think about history | Unbounded for a bot that fires every minute | 5/10 |
| Both, whichever is hit first | Tightest bound | Two numbers to explain and test | 6/10 |

**Why this one**: A count bound is the only one that caps disk in the worst case.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Disk use under the state root has a ceiling.

**What it costs**:
- Old runs are gone for good. Mitigation: each bound is a setting in `bots/config.json`, so an operator can raise it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Retention deletes a run directory the index still points to | M | Delete the row and its directory in one pass, row last |
| Retention deletes a file outside the runs folder | H | Resolve each target path and refuse any path that is not under the identity's runs folder in the Skilled tree |
| Several consumer repos share one symlinked Skilled tree | M | Run folders are split by identity. Retention prunes only the runs folder of the identity it is working on |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | research.md §12 requires bounded retention |
| 2 | **Beyond Local Maxima?** | PASS | Count, age and both compared |
| 3 | **Sufficient?** | PASS | Three numbers, one per store |
| 4 | **Fits Goal?** | PASS | Acceptance criterion 5 of this phase |
| 5 | **Open Horizons?** | PASS | Numbers are configuration, not code |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `status-index.ts` gains a retention pass with three bounds, read from `bots/config.json` with the defaults above.

**How to roll back**: Set the bounds high enough that nothing is deleted. Deleted runs cannot be restored.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Key rows by identity plus last known path, relink only from missing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Build owner. Needs operator confirmation |

---

<!-- ANCHOR:adr-003-context -->
### Context

The index is keyed by repository identity plus last known path (research.md §12). Identity comes from `.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs`, which reads `owner/name` from the environment or the origin remote and returns unknown otherwise. A moved checkout is relinked when another registered root reports the same identity. Two clones of one repository share an identity, which the research does not cover. Phase 1 ADR-002 (proposed) keeps that sharing on purpose and lists each checkout path under the identity in the registered-roots list.

### Constraints

- An unreadable path judges nothing, following `.skilled/bin/worktree-reaper.sh`.
- Phase 1 decides the identity for a repository with no remote (research.md §16 Q5).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: relink a row only when its last known path is `missing` and exactly one other registered root reports the same identity.

**How it works**: Status checks each last known path. Present means no change. Unreadable means the row state `unreadable` and no relink. Missing with one matching root means relink, with the old path kept as the previous path. Missing with zero or several matches means the row state `missing`. Two present roots under one identity are flagged, with both paths named, and no row moves.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Relink only from missing, only on one match** | Never moves rows between two live clones | A moved checkout beside a second clone stays `missing` until the operator acts | 8/10 |
| Relink on any identity match | Fewer missing rows | Can attach one clone's history to another | 3/10 |
| Never relink, show missing only | Simplest | Every move needs a manual fix | 5/10 |

**Why this one**: It follows the rule that a missing path is not a failure and an unreadable one is not missing.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A moved checkout keeps its history without a manual step.

**What it costs**:
- An ambiguous move stays `missing`. Mitigation: status names the matching roots so the operator can unregister one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 1 changes its proposed ADR-002 to a path-hash identity for no-remote repositories | M | Then a moved no-remote checkout never relinks. Status shows it as `missing`, which is honest |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Moved checkouts are a named risk (research.md §7, §12) |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One rule with three outcomes |
| 4 | **Fits Goal?** | PASS | Acceptance criterion 3 of this phase |
| 5 | **Open Horizons?** | PASS | Works with whatever identity phase 1 picks |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `status.ts` gains path checks and the relink rule.

**How to roll back**: Revert `status.ts` and run `bots status --rebuild`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A generation stamp tells status the index is stale

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Build owner |

---

<!-- ANCHOR:adr-004-context -->
### Context

A stale read must say it is stale. Without `builtAt`, "no runs" and "not rebuilt since before the run" look the same (research.md §12). Status may not read run folders, so it needs a cheap signal that a run happened after the last build.

### Constraints

- The signal lives under the state root, not in a checkout.
- Derived files are written to a temp file and renamed (research.md §15 invariants).
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: the runner writes a small generation stamp file under `<state root>/<identity>/` after each run record, and the index stores the stamp it last consumed.

**How it works**: Status compares the two values. When the stamp is newer, status prints `stale` and `builtAt`, then offers `--rebuild`. This adds one write to phase 3's runner, which goes back through phase 3's spec. Phase 3's docs do not list that write yet.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Generation stamp file** | One small read per identity | Needs one write in the runner | 7/10 |
| Runner writes the index row itself | Never stale after a clean run | A crash between record and row still leaves the index behind | 6/10 |
| Compare `builtAt` with the runs folder mtime | No runner change | Reads run folder metadata, which this phase rules out | 3/10 |

**Why this one**: It detects every missed update, including a crash between record and index write.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A stale index always says so.

**What it costs**:
- A change to phase 3's runner. Mitigation: record it in phase 3's spec before this phase builds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The stamp write fails after the record write | L | The index then looks fresh while missing one run. A periodic `--rebuild` repairs it |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Acceptance criterion 2 of this phase |
| 2 | **Beyond Local Maxima?** | PASS | Three signals compared |
| 3 | **Sufficient?** | PASS | One file per identity |
| 4 | **Fits Goal?** | PASS | Keeps status off the run folders |
| 5 | **Open Horizons?** | PASS | Works for any trigger backend |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- The phase 3 runner writes the stamp. `status-index.ts` stores and compares it.

**How to roll back**: Stop writing the stamp. Status then always reports `builtAt` without a stale flag.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Show needs-you items as rows and bound the closed ones

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator chose the decision queue on 2026-11-22 and accepted the retention number as a config key (D10: "Both configurable (Recommended)") |

---

<!-- ANCHOR:adr-005-context -->
### Context

The operator chose a decision queue for runs that need a human. A run that needs a decision ends with the exit `awaiting-decision` and writes one needs-you item under `<state root>/<identity>/needs-you/`. Phase 3 writes items and owns `bots inbox`. Phase 5 owns `bots answer` (operator decision D12). An item is `open`, `answered` or `expired`. Orca's needs-you queue is the prior art (research.md §4). The research did not design this. Status must show what waits on the operator, and closed items must not grow without bound.

### Constraints

- Status reads only the index and `launchctl print` (REQ-001), so items must reach the index.
- The index stores no run output (NFR-S02). The full question belongs to `bots inbox`.
- An item is never answered by status or by retention.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: the index holds one row per needs-you item, and status prints each open item as its own row. Retention keeps the newest 200 answered or expired items per identity, set by `retention.closedNeedsYouPerIdentity` in `bots/config.json` (operator decision D10). It never prunes an open item. A bot with an open item shows the row state `held` (operator decision D9).

**How it works**: A rebuild reads the needs-you folder as well as the run records. Each item row holds the item id, bot id, run id, state, `created_at` and expiry time. It holds no question text. Status prints an open item with the row state `needs-you` and tells the operator to run `bots inbox`. An open item past its expiry time shows as `expired`, and status never writes that state. Retention deletes the oldest closed item rows and their files first. It touches only `<state root>/<identity>/needs-you/`.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Item rows in the index, count bound on closed items** | Status stays off the item folder. Same retention rule as runs | One more table to rebuild | 8/10 |
| Status reads the needs-you folder on each call | No index change | Breaks REQ-001 | 3/10 |
| Show items only in `bots inbox` | Simplest | Status hides what waits on the operator | 4/10 |

**Why this one**: It keeps one read path for status and keeps the operator's queue visible.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Status shows every item that waits on the operator.

**What it costs**:
- Closed items are gone after the bound. Mitigation: the bound is a setting.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 3 does not bump the generation stamp when it writes an item, or phase 5 does not when `bots answer` records one | M | Status then misses the change until a rebuild. Phase 3 owns the stamp writer and phase 5's `bots answer` calls it |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator chose the decision queue and status must show it |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One row per item and one bound |
| 4 | **Fits Goal?** | PASS | Keeps status on the index alone |
| 5 | **Open Horizons?** | PASS | The bound is configuration |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `status-index.ts` gains an item table, item rebuild and item retention.
- `status.ts` prints open items as rows.

**How to roll back**: Revert both modules and run `bots status --rebuild`. Item files are untouched by the revert.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Closed needs-you items are bounded by `retention.closedNeedsYouPerIdentity` in `bots/config.json`, default 200 | Operator answer D10, 2026-11-22. The operator picked the recommended option | ADR-005's Proposed status | ADR-005, REQ-014, AC-014, T022 |
| Q002 | A bot with an open needs-you item is held, and status shows it as `held` | Operator answer D9, 2026-11-22. The operator picked the recommended option. Phase 3 owns the hold | - | ADR-005, REQ-016, AC-016, T024 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** (D10, asked as "How should the needs-you expiry and history be configured?"): "Both configurable (Recommended)".
- **Q002** (D9, asked as "While a bot has an open needs-you item, should its schedule keep firing new runs?"): "Hold new runs (Recommended)".
<!-- /ANCHOR:operator-answers-verbatim -->

---
