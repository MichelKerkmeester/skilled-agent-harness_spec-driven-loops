---
title: "Decision Record: Build system-skilled-bots first build (phase parent)"
description: "Cross-phase operator decisions for the system-skilled-bots first build: all seven ADRs Accepted, with the operator answers of 2026-11-22 recorded verbatim."
trigger_phrases:
  - "headless bots first build decision record"
  - "system-skilled-bots operator decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build"
    last_updated_at: "2026-11-22T12:00:00Z"
    last_updated_by: "spec-writer"
    recent_action: "Recorded operator answers D9 to D12"
    next_safe_action: "Carry ADR-001, ADR-002 and ADR-004 into the child phases"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-writer-001-headless-bots-first-build"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "D1 to D13 answered by the operator on 2026-11-22 through the question tool"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Build system-skilled-bots first build (phase parent)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

These decisions span phases, so no single child owns them (`phase-definitions.md` §3). Each one comes from research.md §16. The operator answered all of them on 2026-11-22 through the question tool. The verbatim answers are in the appendix, under ids D1 to D13. ADR-001 maps to D1, ADR-002 to D2, ADR-003 to D3, ADR-004 to D4, ADR-005 to D5 and ADR-006 to D6. D9, D10, D12 and D13 refine ADR-001, and D10 also extends ADR-005. D7, D8 and D11 have no parent ADR.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: An unattended run that needs a human decision parks in a needs-you queue (research.md §16 Q2)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D1) |

---

<!-- ANCHOR:adr-001-context -->
### Context

A bot runs with no one watching. When it reaches a choice only a human can make, it must not guess and must not hang. Round 1 recorded Orca's "needs you" queue as precedent (research.md §4). Neither round researched escalation beyond the existing blocked stop reason (research.md §16 Q2). The phase advice recommended ending blocked with no queue. The operator chose the decision queue instead (D1).

### Constraints

- The answer binds the runner in phase 003, the request kinds in phase 005, the status rows in phase 007 and the command map in phase 008.
- Every trigger only writes a run request (research.md §9). An answer must flow through that same path.
- A run must not be able to forge or clear a needs-you item, the same rule as switches (research.md §13).
- research.md §10 said the first build adds no new status vocabulary. D1 overrides that for one value: the new terminal exit `awaiting-decision`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A decision queue. A run that needs a human decision parks itself and leaves a needs-you item that the operator answers later. The choice of a queue is the operator's (D1). The design below is Proposed for phase work. The research did not design it.

**How it works** (Proposed design):
- The run ends with a new terminal exit `awaiting-decision`, failure class operator. It writes one needs-you item: run id, bot id, question text, options if any, `created_at` and evidence pointers. The lease is released. No process waits.
- Items live under the user-level state root at `<state root>/<identity>/needs-you/`.
- `bots inbox` lists open items. `bots answer <item-id> "<text>"` records the answer and enqueues one run request of kind `resume`, with source `answer` and the item id as idempotency key. The answer flows through the normal queue and runner. Phase 003 owns `bots inbox`. Phase 005 owns `bots answer`, a queue producer, so phase 003 waits on no later phase (D12).
- While a bot has an open item, its scheduled and queued runs are held. The runner refuses them with the cause `awaiting-decision-hold`, drain quarantines a held request as `held-needs-you`, and a held schedule fire records a skipped slot. The hold ends when the item is answered or expires (D9).
- The resumed run gets the original prompt with the question and answer appended. It stays bound to the same spec folder.
- An item expires after `needsYou.expiryDays` in `bots/config.json`, default 7 (D10). It becomes `expired` and is reported. It is never answered automatically. Closed items are bounded by `retention.closedNeedsYouPerIdentity`, default 200 (D10).
- Status shows open items as their own rows. Delivery notifies once when an item opens.
- Out of scope for the first build: dialogs with more than one question, and answering from a phone or a chat channel.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Decision queue the operator answers (chosen)** | The run resumes after the answer; nothing waits in a process | New state, one new exit value, no research behind the design | Operator choice |
| End blocked and surface it (phase advice) | Reuses an existing stop reason; no new state | The operator must notice and restart the run by hand | 8/10 in the advice |
| Let the child decide alone | No operator wait | Unsafe for unattended runs | 2/10 |

**Why this one**: The operator chose it. It turns a dead end into a resumable step and keeps a human on every decision the bot cannot make.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A run never silently guesses a human decision.
- An answered decision resumes the work without a manual rerun.

**What it costs**:
- One new terminal exit, one new item record, one new request kind and two new verbs. Mitigation: the answer reuses the queue and runner, so no second execution path exists.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Open items pile up unnoticed | M | Status shows them as their own rows, delivery notifies once, and items expire visibly |
| A run forges or clears its own item | H | Items sit under the user-level state root, outside what a run can write |
| A resumed run loses context | M | The resume prompt carries the original prompt, the question and the answer, bound to the same spec folder |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A run that stops to ask and exits 0 is a named risk (research.md §8) |
| 2 | **Beyond Local Maxima?** | PASS | Ending blocked was weighed; the operator chose the queue |
| 3 | **Sufficient?** | PASS | One item record and one request kind; the answer reuses the queue |
| 4 | **Fits Goal?** | PASS | Keeps "every trigger only writes a run request" (research.md §9) |
| 5 | **Open Horizons?** | PASS | Other answer channels can write the same item later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 001: the `awaiting-decision` exit value, the item record schema, the `needs-you/` folder in the layout and the keys `needsYou.expiryDays` and `retention.closedNeedsYouPerIdentity` (D10)
- Phase 003: the runner writes the item, holds the bot while it is open (D9) and builds the resumed prompt when it gets a `resume` request; `bots inbox` and expiry
- Phase 005: request kind `resume` and its idempotency key; `bots answer` as a queue producer (D12); quarantine of held requests as `held-needs-you` (D9)
- Phase 006: a schedule fire during a hold records a skipped slot (D9)
- Phase 007: status rows, the `held` row state (D9) and retention for closed items (D10)
- Phase 008: the commands map onto the run and status modes

**How to roll back**: Map `awaiting-decision` back to the blocked stop reason and stop writing items. Existing items stay readable under the state root.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Run folders live in the Skilled tree's gitignored state and nothing is committed (research.md §16 Q3)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D2) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Each run leaves evidence. The pi lineage assumed a run directory in the repository, and the Hy4 lineage proposed a versioned run-result record. research.md §11 recommended the user-level state root and no commit, and marked that part as inference (research.md §16 Q3). The operator asked for run folders "inside the skilled repo folder somehow but git ignored" (D2). This decision overrides research.md §11's inference for run folders only.

### Constraints

- Nothing per run may be committed.
- A run must not be able to write its queue, leases, switches or needs-you items (research.md §13: a switch the run can write is no switch).
- The Skilled repo `.gitignore` ignores `.skilled/skills/.state/*/*` (lines 134 to 137) and nested copies (lines 273 to 274).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Put run folders under the Skilled tree's gitignored runtime state, at `.skilled/skills/.state/system-skilled-bots/<repo identity>/runs/<run id>/`. Commit nothing per run. Only run folders move. Queue, leases, switches, needs-you items, registered roots and the SQLite index stay under the user-level state root.

**How it works**:
- "The Skilled tree" is the `.skilled` the runner resolves at run time. In this repo it is the checkout itself. In a consumer repo it is the vendored or symlinked `.skilled`.
- With a symlinked `.skilled`, runs from several consumer repos share one Skilled checkout's `.state`. Repo identity partitions them.
- The run record keeps a pointer to its run folder. Status and the index treat a vanished run folder as a row state, never a crash.
- Phase 001 checks what an overlay re-pin does to `.skilled/skills/.state/` and records it. Phase 001 also checks whether a consumer's vendored copy ignores `.state/`. If a re-pin wipes it, run history inside the tree is best-effort and the index row survives.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skilled tree's gitignored `.state`, nothing committed (chosen)** | Evidence sits next to the tooling; never in git status | Can be lost on an overlay re-pin; shared across consumers of one symlinked tree | Operator choice |
| User-level state root, nothing committed (research.md §11) | Survives any tree change | Evidence sits away from the tree the operator works in | 8/10 in the advice |
| Run directory in the repository, committed | Shared through git | Generated-file churn, the reason Hermes was removed | 3/10 |
| A versioned run-result record | Durable history | Still adds a committed file per run | 4/10 |

**Why this one**: The operator chose it. It keeps run evidence inside the Skilled tree and out of git, and it keeps every control file out of a run's reach.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No per-run file appears in git status.
- Run evidence sits beside the Skilled tree that produced it.

**What it costs**:
- This is a narrow exception to "nothing writes into a vendored tree": the run folder under gitignored `.state` is the one hub write into that tree. Mitigation: the exception names one path and nothing else.
- History does not travel with the repository. Mitigation: the index and status report per machine, which is where runs happen.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An overlay re-pin replaces the tree and loses run folders | M | Phase 001 records what a re-pin does; the index row survives and status shows the folder as vanished |
| Several consumer repos share one symlinked tree's `.state` | M | Run folders are partitioned by repo identity |
| A consumer's vendored copy does not ignore `.state/` | M | Phase 001 checks it before any run writes there |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 001 must fix the layout before any run |
| 2 | **Beyond Local Maxima?** | PASS | Four placements compared |
| 3 | **Sufficient?** | PASS | One path for run folders; control state stays user-level |
| 4 | **Fits Goal?** | PASS | State layout is phase 001 scope |
| 5 | **Open Horizons?** | PASS | The run record holds a pointer, so the folder root can move later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Phase 001: the layout splits run folders (Skilled tree `.state`) from control state (user-level root), plus the re-pin and vendored-ignore checks
- Phase 003: the runner writes evidence into the run folder
- Phase 007: status and the index tolerate a vanished run folder

**How to roll back**: Move the run folder root back to the user-level state root in the resolver. Runs already written stay readable at their recorded path.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: A repository with no remote gets an explicit identity or is refused (research.md §16 Q5)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D3) |

---

<!-- ANCHOR:adr-003-context -->
### Context

Labels and state folders are keyed by repository identity. The resolver returns unknown for a repository with no remote, so two such repositories would share a label prefix and a state folder. The env-secret guard keys its state by a hash of the checkout path, which is the fallback the index was designed to avoid (research.md §16 Q5). This was not researched.

### Constraints

- Two repositories must never resolve to the same state folder.
- A path-keyed index reads a move as a delete plus a new repository (research.md §12).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Read an explicit `identity` field from `bots/config.json`, and refuse install and enqueue while identity is unknown.

**How it works**: Phase 001 adds the identity field to the config reader and builds on the existing resolver. The installer and the enqueue path check identity first and stop with a named reason when it is unknown.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit config field, refuse when unknown (chosen)** | No collision; survives a move | One more field for the author | 7/10 |
| Hash of the checkout path | Zero setup | A move becomes a new repository; the fallback to avoid | 3/10 |
| Generate and store a random id | Zero setup | Needs a written file, possibly in the checkout | 4/10 |

**Why this one**: It is the only option that never collides and keeps identity stable across a move.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Labels and state folders cannot collide for remote-less repositories.

**What it costs**:
- Authors of remote-less repositories must set the field. Mitigation: the refusal message names the field.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two clones of one repository share an identity | M | Phase 001 decides and tests the clone case |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Collision is a real failure for local repositories |
| 2 | **Beyond Local Maxima?** | PASS | Three identity sources compared |
| 3 | **Sufficient?** | PASS | One field plus a refusal |
| 4 | **Fits Goal?** | PASS | Identity is phase 001 scope |
| 5 | **Open Horizons?** | PASS | A generated id can be added later as a fallback |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Phase 001 config reader and identity module
- Phase 005 enqueue and phase 006 install refuse unknown identity

**How to roll back**: Drop the refusal and fall back to the resolver's value; no stored state is keyed by the new field until install.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A moved checkout or a changed Skilled tree is detected and repaired by reinstalling (research.md §16 Q6)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D4) |

---

<!-- ANCHOR:adr-004-context -->
### Context

Generated plists hold paths resolved at install time. When a checkout moves, those plists point at nothing. research.md §7 recommends reinstalling. A user-level runner shim was proposed by an earlier synthesis and studied by no iteration (research.md §16 Q6). The operator accepted detect and reinstall, and asked that it take notice of the overlay system (D4). In a consumer repo, `.skilled` may be a symlink or a vendored copy managed by the doctor overlay engine. A re-pin, a symlink retarget or a `/doctor:symlink` change can change the resolved runner path without the repo moving.

### Constraints

- Paths are resolved at install time (research.md §7).
- No hard-coded runner path in a plist template.
- The overlay engine belongs to system-skilled-doctor. This hub does not edit it without operator approval.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Detect and reinstall, with overlay awareness. No shim.

**How it works**:
- Plists use the absolute path to the runner `.skilled/bin/bots.cjs`, resolved at install time.
- The installer records the resolved runner path and the `.skilled` kind (checkout, symlink or vendored) in its install record.
- `bots status` flags a schedule whose recorded runner path no longer resolves, or resolves to a different tree, as needing reinstall. A moved or missing checkout is a row state, relinked by identity.
- Phase 006 adds a post-repin check: after an overlay re-pin, the overlay flow or `bots status` reports the bot schedules that need reinstall. Phase 006 names the hook point in the overlay flow and does not edit the overlay engine. That change is a follow-up owned by system-skilled-doctor unless the operator approves it here.
- The operator runs `bots schedule install` from the new location, and the transactional installer replaces the old labels.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Detect and reinstall, overlay-aware (chosen)** | Uses the installer that already exists; catches tree changes as well as moves | The operator must act after a move or re-pin | 8/10 |
| A user-level runner shim | Survives moves silently | Unstudied; a second install surface | 4/10 |

**Why this one**: It reuses the transactional installer, adds no unstudied component and covers the overlay cases the operator named.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Dead plists are visible, not silent, whether the repo moved or its Skilled tree changed.

**What it costs**:
- A move or re-pin needs one manual reinstall. Mitigation: status names the command.
- The overlay engine does not report bot schedules until system-skilled-doctor takes the follow-up. Mitigation: `bots status` reports it in the meantime.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A dead plist fires and fails before the operator reinstalls | L | The fire fails at launchd level and status shows it |
| A re-pin changes the runner path silently | M | The install record holds the resolved path and `.skilled` kind; status compares them |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Moves and re-pins happen and break plists |
| 2 | **Beyond Local Maxima?** | PASS | Shim weighed |
| 3 | **Sufficient?** | PASS | Two install-record fields and one status check |
| 4 | **Fits Goal?** | PASS | Install and status are in scope |
| 5 | **Open Horizons?** | PASS | The overlay engine can call the same check later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Phase 006: the install record holds the resolved runner path and `.skilled` kind; reinstall over existing labels; the post-repin check and its named hook point
- Phase 007: status flags moved checkouts and changed runner paths
- Phase 008: the staged re-pin confirms `bots/` survives and that reinstall is reported when the runner path changes

**How to roll back**: Drop the extra install-record fields and the status comparison. Reinstall stays a valid operator action under any later choice.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Retention numbers for the index, run folders and skipped-slot summary (research.md §16 Q8)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D5) |

---

<!-- ANCHOR:adr-005-context -->
### Context

The index, the run folders and the skipped-slot summary all grow without bound unless capped. Hermes keeps 1,000 terminal rows, which is the only precedent. No number was derived for this hub (research.md §16 Q8). The operator accepted the proposed defaults (D5).

### Constraints

- Terminal rows never change once written (research.md §12).
- Pruning must not follow a vanished checkout.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Keep 1,000 terminal index rows per identity, the newest 200 run folders per bot and 100 skipped slots per summary. Each number is configurable in `bots/config.json`.

**How it works**: Phase 007 implements retention as a bounded sweep with a test for each bound.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Proposed defaults, configurable (chosen)** | Grounded in one working system; the operator can tune them | Precedent may not fit this load | 6/10 |
| No retention in the first build | Simple | Unbounded growth | 2/10 |
| Time-based retention only | Easy to explain | Bursty bots lose recent history | 5/10 |

**Why this one**: The operator accepted the defaults, and each one can be changed in config.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Every store has a tested bound.

**What it costs**:
- The numbers come from precedent, not measurement. Mitigation: each is configurable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A bound prunes evidence an audit needs | M | Terminal rows are never edited, only aged out past the bound |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Unbounded stores are a real failure |
| 2 | **Beyond Local Maxima?** | PASS | Three policies compared |
| 3 | **Sufficient?** | PASS | Three numbers plus a test each |
| 4 | **Fits Goal?** | PASS | Retention is phase 007 scope |
| 5 | **Open Horizons?** | PASS | Numbers can change without a schema change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Phase 001: the three retention keys in `bots/config.json`, plus `retention.closedNeedsYouPerIdentity` (default 200) and `needsYou.expiryDays` (default 7) from D10
- Phase 007: index, run-folder and skipped-slot retention, and retention for closed needs-you items through the fourth key

**How to roll back**: Raise or remove the bound in config; pruned rows are gone, so start high.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The git-hook trigger fires in every checkout, not only linked worktrees (research.md §16 Q9)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator (D6) |

---

<!-- ANCHOR:adr-006-context -->
### Context

The Hy4 lineage copied a linked-worktree-only restriction from the publish leg of the post-commit hook. A bot that reacts to commits on the primary checkout would never fire under that restriction (research.md §16 Q9).

### Constraints

- The hook leg is opt-in, enqueue-only, non-fatal and trust-gated (research.md §9).
- `.skilled/scripts/git-hooks/post-commit` is a shared file.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Do not restrict the git-hook trigger to linked worktrees.

**How it works**: The phase 005 hook leg enqueues a request on any commit in a trusted, opted-in repository. The runner, not the hook, decides whether the bot runs.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No worktree restriction (chosen)** | Commit bots on the primary checkout work | More enqueues | 8/10 |
| Linked worktrees only | Matches the publish leg | Primary-checkout bots never fire | 3/10 |

**Why this one**: The restriction would make the most common commit-triggered bot impossible.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Commit-triggered bots fire wherever commits land.

**What it costs**:
- More requests reach the queue. Mitigation: idempotency keys and the retry bound (research.md §9).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hook noise on busy repositories | L | Opt-in per repository and enqueue-only |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The restriction blocks a real use |
| 2 | **Beyond Local Maxima?** | PASS | Both scopes compared |
| 3 | **Sufficient?** | PASS | No extra condition |
| 4 | **Fits Goal?** | PASS | Hook leg is phase 005 scope |
| 5 | **Open Horizons?** | PASS | A per-bot filter can be added later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- Phase 005 post-commit leg

**How to roll back**: Add the linked-worktree check to the hook leg; queued requests are unaffected.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Names: system-skilled-bots, bots/ and BOT.md (research.md §16 Q10)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-007-context -->
### Context

The skill, the definitions folder and the definition file needed names before any child could name files (research.md §16 Q10).

### Constraints

- Names appear in labels, paths, commands and routing surfaces, so a later rename touches every phase.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Name the skill `system-skilled-bots`, keep definitions in a `bots/` folder at a consumer repository root, and write one `BOT.md` per bot. research.md §16 Q10 records the skill name and `bots/` as settled by the operator. `BOT.md` is the definition format of research.md §15 recommendation 2.

**How it works**: Every child uses these names. Repository policy sits in `bots/config.json`, and the CLI verbs are `bots run|enqueue|drain|disable|enable|pause|resume|status|schedule install|uninstall`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **system-skilled-bots, bots/, BOT.md (chosen)** | Operator choice; short and consistent | None recorded | n/a |
| Workflow-hub naming from the research topic | Matches the research packet | Not the operator's choice | n/a |

**Why this one**: The operator chose these names.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Every phase names files the same way.

**What it costs**:
- None recorded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later rename | L | Names are settled; a rename would be a new decision |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every phase needs the names |
| 2 | **Beyond Local Maxima?** | PASS | Research used a working name first |
| 3 | **Sufficient?** | PASS | Three names, one convention |
| 4 | **Fits Goal?** | PASS | Names gate every file path |
| 5 | **Open Horizons?** | PASS | The names carry no backend-specific word |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- All phases use the settled names

**How to roll back**: A rename would need a new ADR that supersedes this one.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

All thirteen were answered on 2026-11-22 through the question tool. D1 to D8 came first, D9 to D12 came in a second round and D13 in a third round the same day.

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| D1 | Decision queue: a run that needs a human decision parks and leaves a needs-you item answered later. The queue is the operator's choice; the design is Proposed for phase work | Not stated. Orca's needs-you queue is the prior art (research.md §4) | The phase advice to end blocked with no queue; research.md §10's "no new status vocabulary" for the one value `awaiting-decision` | ADR-001; phases 001, 003, 005, 007, 008 |
| D2 | Run folders live in the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/<identity>/runs/`; all control state stays user-level | Not stated. The operator wants run folders inside the Skilled folder but gitignored | research.md §11's inference that run folders live under the user-level state root | ADR-002; phases 001, 003, 007 |
| D3 | Explicit `identity` in `bots/config.json`; refuse install and enqueue while unknown | Not stated | None | ADR-003; phases 001, 005, 006 |
| D4 | Detect and reinstall, with overlay awareness: the install record keeps the resolved runner path and `.skilled` kind, and status flags a changed tree | Not stated. The operator asked to take notice of the overlay system | None | ADR-004; phases 006, 007, 008 |
| D5 | Retention: 1,000 terminal index rows per identity, newest 200 run folders per bot, 100 skipped slots per summary, configurable in `bots/config.json` | Not stated | None | ADR-005; phases 001, 007 |
| D6 | The git-hook trigger fires in every checkout, with no linked-worktree restriction | Not stated | None | ADR-006; phase 005 |
| D7 | Add `SKILLED_BOT_RUN_ID` to the `executor-audit.ts` allowlist; name owner and callers before the edit | Not stated | None | Child 003 ADR-005 (not edited from the parent) |
| D8 | Raise phases 001, 003 and 006 to Level 3 | Not stated | None | Children 001, 003, 006 (not edited from the parent); parent spec.md note |
| D9 | Hold new runs: while a bot has an open needs-you item, its scheduled and queued runs are skipped and reported until the item is answered or expires | The operator picked the recommended option | Runs firing freely while an item is open | ADR-001; child 003 (owner: refusal `awaiting-decision-hold`), 005 (quarantine `held-needs-you`), 006 (skipped slot), 007 (`held` row state) |
| D10 | Both configurable: `needsYou.expiryDays` (default 7) and `retention.closedNeedsYouPerIdentity` (default 200) in `bots/config.json` | The operator picked the recommended option | The proposed fixed 7-day expiry with no key, and the unkeyed closed-item bound | ADR-001, ADR-005; child 001 (owner: config contract), 003 (reads the expiry), 007 (reads the retention key; its ADR-005 Accepted) |
| D11 | Accept all three request-queue defaults: retry bound 3, sibling folder layout, paused requests to quarantine and not replayed | The operator picked the recommended option | None | Child 005 ADR-002, ADR-003 and ADR-004, now Accepted |
| D12 | Move `bots answer` to phase 005 as a queue producer. It records the answer on the user-level needs-you item, enqueues one `resume` request keyed by the item id and bumps the generation stamp. Phase 003 keeps writing items, `bots inbox`, expiry and building the resumed prompt | The operator picked the recommended option. It removes the wait between phases 003 and 005 | Phase 003 owning `bots answer`, and its blocked task for the enqueue | ADR-001; child 005 (owner), child 003; phase map unchanged |
| D13 | Hold a hand-typed `bots run <id>` too while the bot has an open needs-you item. It is refused with `awaiting-decision-hold` and a pointer to `bots inbox` | The operator picked the recommended option. One check covers every trigger | Allowing manual runs, or allowing them with `--force` | ADR-001; child 003 (owner) |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The answers are verbatim. The question text is the orchestrator's summary of the question asked, not its exact wording. Option lists hold only what the orchestrator recorded; the full offered choice set was not captured.

### D1
<!-- source: research.md §16 Q2 -->

Question:
```text
Q2: what an unattended run does when it needs a human decision
```

Options:
```text
Decision queue: park the run and add a needs-you queue you answer later, like Orca
```

Answer:
```text
Decision queue
```

### D2
<!-- source: research.md §16 Q3 -->

Question:
```text
Q3: where run folders live
```

Options: none

Answer:
```text
preferably inside the skilled repo folder somehow but git ignored
```

### D3
<!-- source: research.md §16 Q5 -->

Question:
```text
Q5: identity of a repo with no remote
```

Options:
```text
Explicit id in config (Recommended)
```

Answer:
```text
Explicit id in config (Recommended)
```

### D4
<!-- source: research.md §16 Q6 -->

Question:
```text
Q6: moved checkout
```

Options:
```text
1: detect and reinstall
```

Answer:
```text
1 but take notice of our overlay system
```

### D5
<!-- source: research.md §16 Q8 -->

Question:
```text
Q8: retention
```

Options:
```text
Proposed defaults (Recommended)
```

Answer:
```text
Proposed defaults (Recommended)
```

### D6
<!-- source: research.md §16 Q9 -->

Question:
```text
Q9: git hook scope
```

Options:
```text
Every checkout (Recommended)
```

Answer:
```text
Every checkout (Recommended)
```

### D7
<!-- source: child 003 ADR-005 -->

Question:
```text
003 run marker
```

Options:
```text
Add allowlist entry (Recommended)
```

Answer:
```text
Add allowlist entry (Recommended)
```

### D8
<!-- source: levels -->

Question:
```text
Levels
```

Options:
```text
Raise to Level 3
```

Answer:
```text
Raise to Level 3
```

### D9
<!-- source: second round, needs-you hold -->

Question:
```text
While a bot has an open needs-you item, should its schedule keep firing new runs?
```

Options:
```text
Hold new runs (Recommended)
```

Answer:
```text
Hold new runs (Recommended)
```

### D10
<!-- source: second round, needs-you config -->

Question:
```text
How should the needs-you expiry and history be configured?
```

Options:
```text
Both configurable (Recommended)
```

Answer:
```text
Both configurable (Recommended)
```

### D11
<!-- source: second round, child 005 defaults -->

Question:
```text
Request queue (phase 005): accept its three proposed defaults?
```

Options:
```text
Accept all three (Recommended)
```

Answer:
```text
Accept all three (Recommended)
```

### D12
<!-- source: second round, bots answer ownership -->

Question (as relayed, elided in the middle):
```text
`bots answer` creates a cycle... Move it?
```

Options:
```text
Move to 005 (Recommended)
```

Answer:
```text
Move to 005 (Recommended)
```
### D13
<!-- source: third round, manual run during a hold -->

Question:
```text
While a bot is waiting on your answer, should a hand-typed `bots run <id>` also be held?
```

Options:
```text
Hold it too (Recommended)
Allow manual runs
Allow with --force
```

Answer:
```text
Hold it too (Recommended)
```
<!-- /ANCHOR:operator-answers-verbatim -->

---
