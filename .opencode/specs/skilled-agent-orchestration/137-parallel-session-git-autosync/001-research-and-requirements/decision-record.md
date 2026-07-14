---
title: "Decision Record: Concurrent AI Publication to One Shared Git Branch"
description: "Architecture decisions for packet 137: serialized single-writer publisher, isolated per-session worktrees, projection-first primary-never-behind invariant, AI conflict-resolution proposer, GitKraken MCP auxiliary placement, and sk-git worktree naming, with the blocking prerequisites surfaced by a three-pass verification."
trigger_phrases:
  - "parallel git decision record"
  - "single writer publisher decision"
  - "primary never behind adr"
  - "ai conflict resolver proposer adr"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements"
    last_updated_at: "2026-07-14T06:37:25Z"
    last_updated_by: "claude"
    recent_action: "Froze the architecture decision record"
    next_safe_action: "Carry the prerequisites into the first implementation phase"
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "parallel-session-git-autosync-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Concurrent AI Publication to One Shared Git Branch

<!-- SPECKIT_LEVEL: 2 -->

> These decisions are the frozen output of a two-lineage deep-research fan-out (GPT-5.6-SOL, GPT-5.6-LUNA) reconciled into `research/research.md`, then hardened through a three-pass verification: SOL synthesis → Fable-5 verify → GPT-5.6-SOL verify-of-Fable. Items marked **BLOCKING** are prerequisites the first implementation phase MUST satisfy before it can claim the strict invariant.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Serialized single-writer publisher + isolated worktrees + separate clean projection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator; two research lineages (SOL, LUNA); three-pass verification |
| **Supersedes** | The current per-session `git-sync.sh` + remote-first follower baseline (treated as bounded-lag prototype to be superseded, not extended) |

<!-- ANCHOR:adr-001-context -->
### Context

Many concurrent AI sessions must commit and push to one shared long-lived branch (`v4`) continuously with zero operator-visible divergence blockers and no loss of concurrent uncommitted work. Both lineages independently rejected the four naive strategies: a shared dirty working tree (mutable shared index/files), independent client fetch/rebase/push loops (races, starvation, conflict stops surfaced to the operator), unattended autostash/rebase (orphan hazard), and a hosted merge queue as the whole system (it removes/rebuilds conflicted entries and has no coordinated barrier with the local IDE).

### Constraints

- Never force-push, never rewrite shared history, never mutate another session's worktree.
- A high commit/push volume is explicitly acceptable; seamlessness is the goal.
- The primary checkout must never be behind origin (REQ-007).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Adopt a **four-plane architecture**:

1. **Authoring plane** — one isolated linked worktree + private branch per AI session. The publisher never checks out, resets, rebases, stashes, cleans, or resolves conflicts here.
2. **Capture plane** — sessions submit an immutable source commit `S`; the system pins it under `refs/autosync/pending/<tx>/source` and records a durable append-only journal entry *before* acknowledging. Uncommitted files are never publication input.
3. **Publisher plane** — a single supervised local writer serializes contributions, preflights with `git merge-tree --write-tree`, builds a two-parent integration commit with `git commit-tree` (first parent = observed origin tip `R`, second parent = source `S`), and is the *only* credentialed writer to `refs/heads/v4`.
4. **Projection plane** — a separate clean, non-authoring checkout is the operator's IDE view. It never contains uncommitted work and is switched to a validated candidate before origin advances.

Textual or semantic ambiguity becomes durable `conflict-quarantined` state without touching any session worktree.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Independent client push loops** — optimistic; handle clean patches but retain races, starvation, and operator-visible conflict stops. Rejected as the complete solution; retained only as an internal publisher fast-path (bounded retry).
- **Shared dirty working tree** — cannot be both universally current and lossless while preserving arbitrary overlapping edits. Rejected (both lineages, high confidence).
- **Hosted merge queue (GitHub) / Gerrit** — useful as an optional policy backend for CI-gated staging, but it cannot be the transparent low-latency append service and cannot coordinate a pre-publication barrier with the local projection. Rejected as the whole system.
- **Bundle-based durability** — a verified `git bundle` is acceptable for backup/cross-host transfer but not as the ordinary queue database; live namespaced refs are the default reachability anchor.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- **Positive**: zero non-fast-forward rejections reach the operator; concurrent uncommitted work is structurally protected (never touched); the design composes proven primitives (worktree isolation, merge-tree/commit-tree plumbing, atomic pointer projection).
- **Negative**: serialization caps publication throughput (one ordered update boundary; preflight/validation may still run concurrently); the publisher is a supervised stateful service that must survive crashes; a sole-writer remote policy is load-bearing and must be enforced at the host.
- **Neutral**: this supersedes the existing `git-sync.sh` baseline, which must be labelled a bounded-lag prototype in migration notes.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

- **Simplicity**: Composes standard Git plumbing rather than inventing a VCS; the complexity is inherent to the concurrency+safety requirement, not gold-plating.
- **Systems**: Touches the launch wrapper, a new publisher daemon, the projection worktree, and remote branch protection. Blast radius is high; staged rollout required.
- **Bias**: Solves the actual problem (operator-visible blockers + never-behind), not a symptom; premise verified against a live "behind 1" observation.
- **Sustainability**: Durable journal + live pins make state legible and replayable; the four planes have clean ownership boundaries.
- **Value**: Removes a recurring, real operator blocker on the shared `v4` branch.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

First implementation phase must deliver the publication state machine (`captured → source-pinned → queued → integrating → candidate-pinned → projection-active → push-sent → remote-verified → tracking-reconciled → session-acked → released`, plus `retryable-transport` and `conflict-quarantined`) and the §6 acceptance matrix in `research/research.md`. It MUST also satisfy every BLOCKING prerequisite in ADR-003.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Fast-forward-only publication; never force

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator; SOL final safety contract (stricter than LUNA's `--force-with-lease` allowance) |

### Context

LUNA documented `--force-with-lease=<ref>:<expect>` as a CAS primitive and allowed bounded optimistic retry. SOL's final safety contract rejects every force-capable push form because `--force-with-lease` can authorize a non-fast-forward update, and background fetch can undermine the shorthand lease.

### Decision

Use a **normal, non-force push** of the candidate ref to `refs/heads/v4`. The candidate always descends from the observed tip `R`, so the push is fast-forward-only; a stale remote tip is a CAS miss handled by the server's receive-side ref lock. On a miss: fetch, rebuild the candidate against the new tip, retry internally. Do **not** use `--force`, `--force-with-lease`, or a `+` refspec.

### Consequences

- Client-side detection of an external writer via `git push --porcelain` `<old>..<new> != R` is **incomplete incident telemetry**, not an expected-`R` CAS — the SOL verify pass proved the `=` (already-up-to-date), remote-descendant, and transient advance-and-rewind cases escape it. The real guarantee is server-side sole-writer enforcement (ADR-003) plus mandatory read-after-write containment verification.
- Rollback is forward-only: `git revert -m 1 <integration-commit>` republished through the same path; `v4` never moves backward.

### Five Checks Evaluation

- **Simplicity**: One push form, one retry rule — simpler than reasoning about lease races.
- **Value**: Eliminates the entire class of force-push data-loss failures.

---

## ADR-003: Primary never behind origin — projection-first strict invariant, and its BLOCKING prerequisites

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (invariant) with BLOCKING prerequisites |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (hard requirement); SOL synthesis; Fable-5 + SOL verify-of-Fable (added the prerequisites) |

### Context

The operator's hard requirement: the primary checkout must **never** be behind origin — never "N commits behind", never a manual reconcile. Both lineage defaults were remote-first (push, then fetch-and-fast-forward the primary), which can only offer a bounded-lag freshness SLA. The invariant was added after the fan-out (RQ-8) and answered at synthesis, then hardened by verification.

### Decision

Define the invariant precisely and split the two notions of "primary" (SOL verify N2, directive #1):

- `P_disk` = the durable on-disk primary projection. The hard checkout guarantee is **`O ∈ ancestors(P_disk)`** where `O` is the actual `origin/v4` tip. Temporary local *aheadness* is explicitly allowed.
- `P_ui` = the OID the active IDE has acknowledged displaying. It gets an OID-linked freshness SLA and asynchronous acknowledgement; strict-display mode (fail-closed on ack timeout) is opt-in and its liveness coupling must be admitted.

The mechanism is **projection-first ordering**: build+validate candidate `C` (with `R ∈ ancestors(C)`) → materialize `C` in an immutable revision directory → atomically switch the stable primary pointer to `C` and durably verify it → *then* push `C` to origin → read-back and reconcile. Across every step and crash window, `O` is `R` or `C`, both ancestors-or-equal of `P_disk = C`. A crash can only leave the primary temporarily **ahead**, never behind.

### Alternatives Considered

- **Remote-first (both lineage defaults)** — push then fast-forward the primary. Rejected for strict mode: there is necessarily an interval after the hosted ref changes and before the local filesystem changes. Retained as the labelled **bounded-lag fallback** (p50/p95/p99 SLA) when the operator edits the primary tree directly.
- **Strict-never-behind AND remote-verified-only** — jointly unsatisfiable without a distributed transaction spanning the Git host and local filesystem. One requirement must be weakened; the recommendation weakens "remote-verified-only" (allows showing a validated not-yet-confirmed candidate).

### Consequences — BLOCKING prerequisites for implementation

The invariant holds **only** if the implementation delivers all of these (verification directives #2–#9, #12):

1. **[BLOCKING] Fencing singleton.** One exclusive fence must cover the whole critical section: `authoritative tip observation → final revalidation → durable projection → push → read-back → journal transition`. A compare-before-rename check alone has a TOCTOU race. Single host: OS-backed exclusive lock + journal generation + descendant check. Cross-host failover: a monotonic fencing token enforced at every side-effect sink (an expiring lease cannot stop an old process). Without this, a two-publisher projection-pointer race can make the primary go **behind** — the one genuine hole in a naive design.
2. **[BLOCKING] Sole-writer remote enforcement is a deployment prerequisite.** `receive.denyNonFastForwards` does not stop another *authorized* actor from fast-forwarding `v4`. The host must reject every update except the publisher identity's, including ordinary fast-forwards (e.g. a GitHub ruleset restricting updates to a bypass-listed publisher App/service identity; force-push and deletion blocked; no UI merge, bot, session token, or routine admin bypass; audit as a secondary control). If the host cannot enforce this, downgrade the claim to bounded-lag/incident-detected mode.
3. **[BLOCKING] Reconcile remote policy with commit shape.** Candidates are two-parent **merge commits**. A "require linear history" rule rejects them; required-PR, required-signature, and required-status policies may reject direct publisher commits or unsigned second-parent source commits. Audit the actual `v4` ruleset before freezing; reject incompatible settings unless the architecture changes.
4. **[BLOCKING] Durability across objects, refs, journal, and projection.** Harden Git objects/refs, not just the app journal. Set an explicit `core.fsync` policy (note macOS `writeout-only` ≠ full durability on every stack); fsync the revision and pointer directory before pushing; use checksummed monotonic journal records; reconcile pin-without-journal and journal-without-pin on recovery; fail closed on disk-full / read-only FS / torn journal tail / fsync failure and preserve existing pins; never run aggressive prune/GC concurrently with unpinned object creation.
5. **[BLOCKING] Privilege / trust boundary.** The publisher repository, credentials, journal, pins, and projection are service-owned and **unwritable by session processes** (linked worktrees share the common Git dir, refs, config, hooks, object store — a compromised session must not reach the privileged publisher). Validators, tests, merge drivers, and resolvers run **unprivileged**: executing a candidate's tests is executing untrusted repository code.
6. **[BLOCKING] Freeze the primary topology.** Decide detached-immutable-pointer vs. an actual local `v4` worktree updated under exclusive lock. The former gives stronger atomic projection but appears detached in Git tooling; the latter preserves branch UX but has multi-file-update and IDE-watcher behavior to test. Enforce read-only/non-authoring behavior and a startup path that never exposes a stale projection.
7. **[BLOCKING] External-writer / fencing-violation recovery.** On an unexpected remote descendant not containing `C`: halt admissions, retain pins, classify the remote history, and prefer a validated **bridge** commit `M = merge(R2, C)` with `parents(M) = [R2, C]` (forward for both projection and push). Never silently choose one side or project backward; if the bridge conflicts or the remote is rewound/untrusted, quarantine.
8. **[REQUIRED POLICY] Git edge objects.** State explicit fail-closed or supported behavior for LFS (pointer whose object was never uploaded — hooks are disabled), submodules/`.gitmodules`, symlinks escaping the root, mode/type changes, renames (both ends), case-folding collisions, binary files, hostile/NUL-delimited filenames, filters, and merge drivers.

### Five Checks Evaluation

- **Bias**: The invariant is a genuine one-sided guarantee; the honest framing (aheadness allowed, remote-verified-only sacrificed) prevents a false promise.
- **Systems**: The prerequisites make the true blast radius explicit — this is not a client-side trick but a host-policy + durable-service + fencing contract.

---

## ADR-004: Request A — automatic AI-assisted conflict merging as a bounded proposer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (INCLUDE as a proposer; never a writer) |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (Request A); Fable-5 design; SOL verify-of-Fable corrections |

### Context

The operator asked that automatic (AI) conflict merging be part of the solution. An AI resolver is a *generalized merge policy* — it must produce a proposal that re-enters the SAME validation pipeline, never a new writer or publication authority. Model-reported confidence is advisory routing, **not** proof of correctness.

### Decision

Add a bounded proposer sub-pipeline: `conflict-quarantined → resolution-eligible → resolver-running → proposal-pinned → deterministic-revalidation → normal candidate pipeline | human-required`, governed by ten controls:

1. **Eligibility before inference** — default-deny; start with an allowlist of low-risk formats (docs, narrowly-specified additive records). Binary/LFS/submodule/symlink/rename-topology/build/security-control conflicts stay human-only.
2. **Exact immutable inputs** — `{B,R,S}` OIDs, structured `merge-tree` conflict records, validator output, path policy; every repo file treated as untrusted data.
3. **Disposable confined execution** — a disposable resolver worktree (never a session worktree, publisher repo, journal, projection); no SSH material, no Git remote-write credentials, no host home, no unrestricted network (broker-only egress if a cloud model is required); CPU/memory/time limits.
4. **Trusted commit construction** — the resolver proposes a patch/tree only; a trusted publisher process constructs the commit with exact parents `R` and `S`. Provenance trailers are audit metadata, not a substitute for ancestry.
5. **Scope guard** — preserve every cleanly auto-merged path bit-for-bit; resolver changes stay within the validated conflict paths/hunks and the union of both sides' changed paths (both rename ends, mode/type changes). Generated artifacts change only via an approved regeneration step.
6. **Safety-control default-deny** — no automatic changes to publisher/resolver code, hooks, CI, branch policy, ownership manifest, validator definitions, `.gitattributes`, `.gitmodules`, credentials, or deployment config.
7. **Deterministic gates** — no unmerged entries / no conflict markers / no unexplained one-side-equivalent result; schema+static checks; semantic validators; targeted + full required tests, run in the same unprivileged sandbox.
8. **Fresh-tip gate** — under the publisher fence, reobserve origin and rerun merge/preflight; a proposal prepared for a stale `R` cannot publish just because it was previously accepted.
9. **Confidence is advisory** — it can route to human review; it cannot authorize publication. Automatic eligibility = policy class + deterministic gates.
10. **Bounded operation & recovery** — limit attempts and chain depth (an AI resolution's own conflicts never auto-resolve again); retain original quarantine pins until remote containment is verified; journal model/tool versions + hashes; trip a circuit breaker after a reverted/escaped bad resolution.

### Consequences

- **Honesty line (SOL correction, do NOT weaken):** the honest statement is *"AI may automatically resolve policy-eligible conflicts under bounded validators; passing those validators is acceptance under the configured oracle, not proof of arbitrary human intent."* Do **not** append "unless every validator passes" to the arbitrary-overlap boundary.
- No structural data loss: pin retention + both-inputs ancestry + forward-only rollback.

### Five Checks Evaluation

- **Bias**: Treats AI resolution as a policy that must earn its way through the same gates — avoids the "AI is magic" trap.
- **Sustainability**: Circuit breaker + audit make a bad resolver self-limiting and legible.

---

## ADR-005: Request B — GitKraken MCP as an auxiliary layer, never the transaction core

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (INCLUDE more GitKraken, outside transaction authority) |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (Request B); Fable-5 placement; SOL verify-of-Fable corrections |

### Context

The operator asked to use the GitKraken MCP (`@gitkraken/gk`, registered as `gitkraken` in `.utcp_config.json`) more. `sk-git` already mandates that local git mutations stay on Bash and flags the product as public-preview. The publisher core depends on exact plumbing contracts (expected-old-OID, `--porcelain` per-ref status, exit codes) that the MCP wrappers do not expose.

### Decision

**Hard boundary:** GitKraken MCP must **not** own push CAS, pins, journal transitions, projection changes, candidate construction, or remote verification. **Safe uses:**

- A read-only (`--readonly`) operator-facing instance for status/graph/ancestry/PR context.
- Launchpad/graph/PR tools to augment **human** quarantine adjudication (the custom journal remains transaction truth; GitKraken cannot replace the quarantine console — it does not know the publisher's states or pins).
- GitLens AI conflict resolution used interactively in a disposable resolver worktree, output captured as a proposal through ADR-004's gates.
- Commit Composer as an opt-in session-worktree aid.
- Prohibit `git_push`, `git_pull`, `git_fetch`, branch, worktree, stash, and commit mutations in the publisher workflow. Do not invoke `start_work`/`start_review` unless their created branch/worktree is registered with the session manifest.

### Consequences

- **Do not freeze `git_resolve` as an assumed MCP API** (SOL correction): the repo-local inventory lists it, but GitKraken's current public MCP tool reference does not, and GitLens describes AI Resolve as a preview UI workflow with human review. Treat `git_resolve` as a version-specific experimental adapter only after a pinned-version contract test proves it exists, its I/O is known, it touches only the disposable worktree, it changes no refs/remotes/config/credentials, and its proposal can be inspected before application.
- **Preinstall and pin** the GitKraken CLI for any automated use; do not make an unattended safety path depend on dynamic `npx -y` resolution.

### Five Checks Evaluation

- **Systems**: Keeps the reliability-critical publisher on deterministic plumbing while still using GitKraken where it adds real human/observability value.

---

## ADR-006: Worktree and branch naming follow sk-git conventions (REQ-010)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (charter requirement); sk-git codification + local cleanup DEFERRED |
| **Date** | 2026-07-14 |
| **Deciders** | Operator |

### Context

The operator observed that the current local branch/worktree tree is "a mess" (`backup/`, `wt/0001…0037`, `work/opencode/<timestamp>`, `system-speckit/…`, `wip/…`) and directed that any worktree the recommended architecture uses must follow correct sk-git conventions, with branches named on the related skill (`<skill>/…`) OR on `skilled/…` (the whole-system alias, e.g. `skilled/v4.0.0.0`).

### Decision

Any worktree in the recommended architecture (session authoring worktrees, the projection worktree, disposable validation/resolver worktrees) MUST follow sk-git's worktree discipline: the numbered `.worktrees/{NNNN}-{name}` + `wt/{NNNN}-{name}` scheme for feature worktrees, or the launch-wrapper's auto-managed per-session worktrees, and branches named on the related skill (`<skill>/…`) or on `skilled/…`. The recommended architecture's session branches are system-level and therefore live under `skilled/…`; a skill-scoped effort uses `<skill>/…`.

### Consequences

- Recorded as REQ-010 in the charter and as an acceptance condition. The publisher's projection and resolver worktrees are named under the same scheme and registered with the session manifest (ties to ADR-004 control 3 and ADR-005's `start_work`/`start_review` caution).
- **Deferred (out of this research packet, per operator "fold into 137 only"):** editing the `sk-git` SKILL.md naming rule to mandate `<skill>/…`|`skilled/…` for AI-session branches, and pruning/renaming the existing non-conforming local branches. Those are a separate sk-git change.

### Five Checks Evaluation

- **Scope**: Captured as a requirement without expanding this turn into a skill edit or a destructive branch cleanup — matches the operator's chosen blast radius.

---

<!-- ANCHOR:verification-provenance -->
## Verification Provenance & Honest Caveats

### Three-pass verification chain

| Pass | Reviewer | Verdict | Net effect |
|------|----------|---------|------------|
| 1 | GPT-5.6-SOL (max, fast) synthesis | Recommends four-plane architecture + projection-first invariant | Draft final recommendation (`research/research.md` basis) |
| 2 | Fable-5 (xhigh) | CONFIRMED-WITH-CAVEAT; 8 findings (4 blocking) | Caught the two-publisher projection-pointer race (primary could go behind) + IDE-ack liveness coupling; recommended Request A/B designs |
| 3 | GPT-5.6-SOL (max, fast) verify-of-Fable | AGREE-WITH-ADJUSTMENTS; do NOT freeze verbatim | Refined 3 Fable findings, promoted 2 to blocking, added 6 new blocking findings (trust boundary, projection durability, remote-policy-vs-merge-commit, sole-writer enforcement, invariant precision, edge objects); produced the 17-item directive folded into ADR-002…005 |

### Honest caveats (preserve; do not weaken)

- **Unsaved editor buffers are not protected by Git.** The no-loss guarantee covers saved filesystem state in managed session worktrees and submitted Git objects.
- **Evidence asymmetry.** The strict projection-first proof and its ordering were **synthesis-stage additions**, not independently established by both lineages. The two lineages were separate model runs that shared the charter, core sources, and assumptions — correlated supporting evidence, not three independent confirmations. RQ-8 was absent from both lineage configs.
- **Reduced cross-model coverage.** Only two lineages ran; the planned GLM-5.2 lineage was dropped because its executor required `--dangerously-skip-permissions` on the shared dirty tree. Implementation benchmarks, IDE projection behavior, and operational failure rates remain to be validated empirically.
- **Confidence, not proof.** Validators do not prove arbitrary human intent; the AI resolver's passing gates is acceptance under the configured oracle only.
- **Host loss needs replication.** Live refs protect against Git GC, not host loss — the publisher repository and journal need replication/backup for a host-loss guarantee.
- **The current `git-sync.sh` + remote-first follower baseline is non-compliant with strict mode** and must be superseded, not silently extended.
<!-- /ANCHOR:verification-provenance -->

---

## RELATED DOCUMENTS

- Charter: `spec.md`
- Reconciled synthesis: `research/research.md`
- Fan-out attribution: `research/fanout-attribution.md`
- Implementation summary: `implementation-summary.md`
