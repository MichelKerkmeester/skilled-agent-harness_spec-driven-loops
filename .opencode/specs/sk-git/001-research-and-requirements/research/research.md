# Reconciled Research: Concurrent AI Publication to One Shared Git Branch

> **Phase:** `skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements`
> **Method:** two independent deep-research lineages (GPT-5.6-SOL, GPT-5.6-LUNA), five iterations each, reconciled here, then hardened through a three-pass verification (SOL synthesis → Fable-5 → SOL verify-of-Fable).
> **Status:** converged; frozen. Architecture decision in `../decision-record.md`; attribution in `fanout-attribution.md`.

---

## 1. Executive summary

The recommended default is a **supervised local single-writer publisher**, **one isolated linked worktree per AI session**, and a **separate clean, non-authoring primary checkout** for the IDE. Sessions never push the shared branch directly; they submit immutable commits that are pinned under durable transaction refs and recorded in an append-only journal before acknowledgement. The publisher serializes contributions, preflights them with `git merge-tree --write-tree`, creates a two-parent integration commit with `git commit-tree`, and performs only normal fast-forward pushes — never force, `--force-with-lease`, or `+` refspecs. Transport failures and stale-tip races remain internal retry states; textual or semantic ambiguity becomes durable conflict quarantine without modifying any session worktree.

The two lineages agree strongly on this architecture and reject shared dirty trees, independent client push loops, unattended autostash/rebase, and hosted merge queues as the *complete* solution. The **primary-never-behind** requirement (REQ-007) adds one ordering constraint absent from both lineage defaults: in strict mode the validated candidate is atomically projected into the primary IDE view *before* the sole publisher advances origin. Therefore the actual origin tip is always equal to or an ancestor of the primary projection; the primary may briefly be *ahead* during push verification, but it is never behind. Exact equality at every instant is impossible across a hosted ref and a local filesystem without a distributed transaction, so a remote-first design can offer only a measured freshness SLA and does not satisfy the strict invariant.

Three-pass verification kept the architecture but **denied a verbatim freeze**: it added a set of BLOCKING prerequisites — a fencing singleton, sole-writer remote enforcement, a remote-policy-vs-merge-commit audit, cross-layer durability, a publisher/session trust boundary, precise `P_disk`/`P_ui` invariant wording, and explicit edge-object policy. Those are recorded as ADR-003's prerequisites and the §6 acceptance matrix.

---

## 2. Per-question synthesis (two lineages)

Sources are primary Git/GitHub/tool documentation cited inline in the lineage iterations under `lineages/parallel-git-sol/` and `lineages/parallel-git-luna/`.

### RQ-1 — Integration strategy

**Agreement.** Both lineages select a **serialized publisher** as the coordination authority. Independent fetch/rebase/retry loops stay optimistic: they handle clean patches but retain races, starvation, and conflict stops. Scratch-index / `merge-tree`+`commit-tree` plumbing is the publisher's checkout-free integration engine; a GitHub merge queue or Gerrit is an optional policy backend, not the whole system.

**Divergence.** LUNA allows bounded optimistic retry as an internal fast path and documents `--force-with-lease=<ref>:<expect>` as a CAS primitive. SOL's final safety contract rejects every force-capable push form. **Resolution:** the stricter SOL rule wins — normal non-force push, stale tip = CAS miss, then fetch/rebuild/retry internally (ADR-002).

**SOL-unique:** `update-ref <ref> <new> <old>` gives *local* CAS but cannot atomically update a *hosted* ref; GitHub merge queue removes/rebuilds conflicted/failed/timed-out entries, making it unsuitable as a transparent low-latency append service. **LUNA-unique:** shorthand force-with-lease can be undermined when background fetch moves a remote-tracking ref (retain an independent expected-OID); queue fairness/starvation needs central retry ownership even when each individual rebase would eventually be safe.

### RQ-2 — Workspace model

**Agreement.** A shared working tree is rejected (mutable shared index/files). Every session needs its own **linked worktree + private branch**; ordinary clones fit across machines or stronger trust boundaries. Worktrees isolate `HEAD`, index, and files but do **not** serialize shared refs.

**Divergence.** None material. SOL prefers linked worktrees as the same-host default; LUNA gives clones more weight where independent maintenance/isolation matters.

**SOL-unique:** `worktree lock` protects administrative records, not dirty files; a long-lived `clone --shared`/`--reference` borrower can lose objects when the source prunes (use an ordinary clone or `--dissociate`). **LUNA-unique:** a shared dirty IDE tree cannot be made unconditionally current while preserving arbitrary overlapping edits — separate authoring and current-view worktrees are *required*, not merely preferred.

### RQ-3 — Staying current safely

**Agreement.** `fetch` is safe in active session worktrees (updates objects + remote-tracking refs without rewriting files). Automatic file updates belong only in a clean current-view projection, using fast-forward-only movement or immutable revision materialization. `pull --rebase --autostash`, reset, checkout, and auto-resolution do **not** belong in session worktrees.

**Divergence.** SOL excludes autostash from the unattended path entirely; LUNA permits it only as an explicit guarded recovery op with recorded old state. **Resolution:** adopt SOL's stronger no-touch invariant; autostash recovery is operator-initiated salvage only. Both lineage sequences were remote-first (SLA-current), which is why RQ-8 required a projection-first addition.

**SOL-unique:** Kubernetes `git-sync` demonstrates immutable revision directories + an atomic stable-pointer switch + idempotent post-refresh notification; a dirty projection is discarded/rebuilt, never repaired through a session worktree. **LUNA-unique:** ref freshness ≠ file freshness; `reset --hard` is disallowed (overwrites tracked changes, removes obstructing untracked files).

### RQ-4 — Safety, recovery, rollback

**Agreement.** Accepted submissions require durable queue records **plus** Git reachability anchors. Ambiguous push results require read-after-write reconciliation. Rollback must preserve subsequent history. Reflogs/stashes/exit codes/dangling objects are insufficient as the primary durability contract.

**Divergence.** SOL requires **live namespaced refs** as the default reachability mechanism and forward-only revert; LUNA allows a verified bundle as an alternative. **Resolution:** live refs are the default (Git's reachability/GC apply directly); bundles are for backup/cross-host transfer only; rollback is forward-only from the current tip.

**SOL-unique:** an OID in an app journal is *not* a reachability root; pins must survive aggressive reflog expiry and prune; "push response received" ≠ "remote state observed" (resolve with `ls-remote`/fetch + ancestry). **LUNA-unique:** `git bundle` preserves reachable commits/refs but not working tree/index/stash/hooks/unsaved editor state; an explicit recovery record should carry old `HEAD`, snapshot identity, target, result, and recovery ref.

### RQ-5 — Automation surface

**Agreement.** The **launch wrapper** owns admission (allocate worktree, assign session identity, establish path scope, register with the service). A **supervised daemon** owns queue order, journal state, auth, fetch, integration, retries, remote reconciliation, projection refresh, and crash replay. Client hooks are guardrails/enqueue hints, **not** transaction truth.

**Divergence.** None material. SOL explores a remote bot as a possible publisher *if* it implements the same durable state machine; LUNA weights merge queue/Gerrit where CI/review dominate latency. **Under strict primary-never-behind, a standard hosted queue cannot directly update `v4`** — it has no coordinated pre-publication barrier with the local projection; the local publisher must remain the only updater.

**SOL-unique:** client hooks can be reconfigured/ignored/bypassed; a GitHub App needs scoped short-lived credentials, authenticated webhook delivery, async processing, and delivery-ID idempotency (webhook delivery is not a journal). **LUNA-unique:** existing autosync daemons watch/notify usefully but stop on rebase conflict; Git Town supplies `continue`/`skip`/`undo` UX; Gerrit supplies pending-change/submit-requirement states.

### RQ-6 — Conflict handling and avoidance

**Agreement.** Enforce a path-ownership manifest; prefer unique per-session subtrees or additive identifiers; derive changed paths before admission (`diff-tree`, no checkout); preflight against the current tip with `merge-tree --write-tree`. Textual conflicts, undeclared paths, dependency violations, and semantic-validator failures become durable quarantined transactions. No unattended "ours"/"theirs" rule is acceptable for non-disposable data.

**Divergence.** LUNA calls disjoint ownership the strongest structural commutativity rule; SOL qualifies that disjoint *files* prevent textual collision but do not prove semantic independence across schemas/APIs/generated indexes. **Resolution:** require both changed-path independence *and* semantic validation.

**SOL-unique:** CODEOWNERS routes review but does not lock/reserve paths; a later transaction may bypass a quarantined queue head only with recorded dependency + path-independence proof. **LUNA-unique:** `rerere` replays a prior resolution but is not proof of semantic correctness; custom merge drivers are acceptable only for narrow formats and must fail closed; sparse checkout is a projection optimization, not an isolation boundary.

**Request A (AI-assisted resolution) sits here** as a bounded proposer — see §5 and ADR-004.

### RQ-7 — Existing art

**Agreement.** No surveyed tool provides all required boundaries (dirty-session isolation, durable capture, single-writer publication, ambiguous-ack reconciliation, semantic quarantine, primary IDE projection). The design **composes** mechanisms rather than adopting one tool.

**Divergence.** The lineages inspect different projects under the overloaded name `git-sync`; implementation must distinguish them:

| Tool | Useful mechanism | Why not the whole answer |
|------|------------------|--------------------------|
| Kubernetes `git-sync` (SOL) | Immutable revision dirs + atomic pointer publication | Read-side sync only |
| `simonthum/git-sync` (LUNA) | Automated fetch/rebase/push | Exits on non-trivial intervention |
| `wei/git-sync` (LUNA) | Repo mirroring | Force-push — incompatible with the safety contract |
| GitJournal `git-auto-sync` (SOL) | Trigger coalescing | Mutates one watched repo; stops on rebase conflict |
| Syncthing (SOL) | Preserve both conflict inputs, atomic materialize | No Git ancestry/ref ordering |
| `mob` (LUNA) | WIP-ref handoff | Serial human handover, not parallel publication |
| Git Town (LUNA) | `undo`/branch-role UX | No shared multi-session publisher |
| Gerrit (both) | Pending patch sets + submit gates | No local dirty-state protection |

### RQ-8 — Primary never behind origin

Answered at synthesis and hardened by verification — see §4. **Evidence asymmetry is recorded honestly:** RQ-8 was absent from both lineage configs; the strict `O ∈ ancestors(P_disk)` proof and projection-first ordering are synthesis-stage additions with lineage-backed *supporting* primitives, subjected only to later review — not three independent confirmations.

---

## 3. Recommended architecture

### Components and ownership

| Component | Responsibility | Hard boundary |
|-----------|----------------|---------------|
| Session launcher | Create a linked worktree/private branch, assign session ID, register allowed paths | Does not publish or own retries |
| Session worktree | Hold staged/unstaged/untracked/ignored/committed session work | Publisher never checks out, resets, rebases, stashes, cleans, or resolves conflicts here |
| Capture API | Accept an immutable source commit + transaction metadata | Acknowledge only after source ref and journal record are durable |
| Publisher repository | Object DB, pending refs, scratch indexes, disposable validation/resolver worktrees | No user authoring; **service-owned, unwritable by sessions** |
| Durable journal | Transaction state, expected base, source/candidate OIDs, attempts, diagnostics, acks | Append-only/transactional; survives process death; checksummed monotonic records |
| Single publisher | Order, preflight, validate, construct commits, project candidates, push, reconcile | Only credentialed writer to `refs/heads/v4`; holds the fencing singleton |
| Primary projection | Clean, non-authoring IDE view of the current shared tip | Never contains user or AI uncommitted work |
| Remote enforcement | Reject unauthorized and non-fast-forward target-branch updates | No admin bypass, UI merge, bot, or session may write `v4` outside the publisher |

### Durable state machine

```text
captured → source-pinned → queued → integrating → candidate-pinned
→ projection-active → push-sent → remote-verified
→ tracking-reconciled → session-acked → released
```

Exceptional states: `retryable-transport`, `conflict-quarantined`. Neither permits early pin deletion. The Request A proposer inserts `resolution-eligible → resolver-running → proposal-pinned → deterministic-revalidation` between `conflict-quarantined` and re-entry (ADR-004).

### Publication algorithm (checkout-free)

1. **Capture immutable source.** Session commits saved work on private-branch tip `S`; submits `S`, tx id, declared base `B`, path/dependency manifest. Uncommitted files untouched, not yet input.
2. **Pin before ack.** `git update-ref --create-reflog refs/autosync/pending/<tx>/source <S> <zero-oid>`; on replay accept an existing ref only if it still equals `S`; fsync the journal record before returning `accepted`.
3. **Observe authoritative tip.** Fetch `refs/heads/v4` into a publisher-private observed ref; record exact `R`. Reject rewind/deletion/unrelated history as a policy incident. (Never derive `R` later from a shared remote-tracking ref an IDE/background fetch may move.)
4. **Validate scope.** Confirm `B` belongs to expected history; derive `B..S` changes; enforce path ownership, rename/delete rules, dependencies, reserved shared artifacts.
5. **Preflight.** `git merge-tree --write-tree <R> <S>`; exit 0 → merged tree `T`; a conflict records `{R,S,B}`, paths, diagnostics → `conflict-quarantined`; nothing moves.
6. **Integration commit.** `C=$(… | git commit-tree <T> -p <R> -p <S>)` — first parent `R`, second parent `S`. If `S` already reachable from `R`, classify already-integrated (no duplicate).
7. **Pin + validate candidate.** `refs/autosync/pending/<tx>/candidate`; materialize `C` only in a **disposable** validation worktree; run unprivileged semantic checks; failure → `conflict-quarantined`.
8. **Project before origin.** Materialize an immutable detached worktree at `C`, verify OID + cleanliness, atomically switch the stable `current` pointer (same filesystem), durably verify `P_disk = C`. `P_ui` acknowledgement is async with an SLA (strict-display mode is opt-in and fail-closed).
9. **Publish — never force.** `git push --porcelain origin refs/autosync/pending/<tx>/candidate:refs/heads/v4`. FF-only because `C` descends from `R`; the server ref lock rejects a changed advertised tip. No `--force`/`--force-with-lease`/`+`.
10. **Reconcile.** Query/fetch the exact remote ref: `=C` published · descendant-containing-`C` published+advanced · still `R` retry same candidate · unexpected descendant not containing `C` → retain pins, fetch, build a **bridge** `M=merge(R2,C)` (ADR-003 prereq 7), alert external-writer/fence violation · rewound/unrelated → halt.
11. **Close.** Update tracking ref, durably record containment, confirm `P_disk` is `C`-or-newer, persist session ack; release pins only when all hold. `S` is a parent of `C`, so it stays reachable.
12. **Rollback forward.** `git revert -m 1 <integration-commit>` through the same path; never move `v4` backward.

Local `update-ref` transactions are conditional but cannot atomically commit the journal + a hosted remote update + a filesystem projection; recovery depends permanently on durable states + observation, not command exit alone.

---

## 4. Primary checkout never behind origin (REQ-007)

### Formal invariant

Let `O` = the actual `origin/v4` tip. Split "primary" (verification directive #1):

- `P_disk` = durable on-disk projection. **Hard guarantee: `O ∈ ancestors(P_disk)`** (origin equal-to-or-ancestor-of primary). Temporary local *aheadness* is allowed.
- `P_ui` = the OID the IDE acknowledges displaying — freshness SLA + async ack; strict-display is opt-in, fail-closed, with admitted liveness coupling.

### Mechanism and proof

Four enforced conditions: (1) primary is clean, non-authoring, disposable; (2) every author works in a separate session worktree; (3) the publisher is the only identity/process that updates `origin/v4`; (4) every candidate descends from the previously observed origin tip. For each publication `R → C` the order is build/validate → materialize → **switch+verify projection** → push → read-back+reconcile. Then:

- Before the switch: `P_disk = O = R`.
- After local switch, before remote update: `O = R`, `R ∈ ancestors(P_disk = C)`.
- After remote update: `P_disk = O = C`.
- If the response is lost: `O ∈ {R, C}`; both satisfy the invariant vs `P_disk = C`.

A crash at any point cannot make the primary behind — only temporarily ahead, the unavoidable cost of a one-sided invariant without a distributed transaction.

### BLOCKING prerequisites (from verification)

The proof holds only with ADR-003's prerequisites: **fencing singleton** (one exclusive fence over observe→revalidate→project→push→read-back→journal; a stale second publisher otherwise re-projects `C_old` after `C_new` and drives the primary *behind*); **sole-writer remote enforcement** (a host ruleset — `receive.denyNonFastForwards` alone does not stop an authorized fast-forward); **remote-policy audit** (two-parent merge commits are rejected by require-linear-history / may be rejected by required-PR/signature); **cross-layer durability** (`core.fsync`, directory fsync, checksummed monotonic journal, pin/journal reconciliation, fail-closed on disk-full/torn-tail, no concurrent prune); **trust boundary** (publisher repo/creds/journal/pins/projection unwritable by sessions; validators run unprivileged); **frozen primary topology** (detached-immutable-pointer vs. locked local `v4` worktree); **bridge recovery** for external writers; **edge-object policy** (LFS/submodule/symlink/mode/rename/binary/hostile-filename fail-closed).

### Atomic projection choice

Preferred backend: an immutable detached worktree per verified candidate + atomic symlink/pointer rename (Kubernetes `git-sync` mechanism). This must be validated against the actual IDE — some IDEs resolve the initial symlink target and do not follow later replacements; then use an IDE extension/reload ack, or a dedicated clean worktree updated to `C` under exclusive lock before push (preserves never-behind, but exposes a brief multi-file refresh instead of an atomic switch).

### Strictly-never vs bounded-lag

Remote-first (push → fetch → fast-forward primary) is **not** strictly never-behind — there is necessarily an interval after the hosted ref changes and before the local filesystem does. It offers "current within X" (p50/p95/p99), a labelled downgrade. Conversely, if the operator *also* requires "primary shows only remote-verified commits," exact equality needs a distributed transaction — one requirement must be weakened. The recommendation weakens remote-verified-only (may show a validated not-yet-confirmed candidate). If the operator insists on continuously editing the primary tree, strict mode is impossible; the safe fallback is fetch-only freshness with explicit lag reporting.

---

## 5. Requests A & B, and REQ-010

### Request A — automatic AI-assisted conflict merging (ADR-004)

INCLUDE as a **bounded proposer**, never a writer. `conflict-quarantined → resolution-eligible → resolver-running → proposal-pinned → deterministic-revalidation → normal pipeline | human-required`. Ten controls: default-deny eligibility (docs/additive allowlist; binary/LFS/submodule/symlink/rename-topology/security-control human-only); immutable `{B,R,S}` + merge-tree records as untrusted data; disposable, credential-free, network-restricted sandbox; **the resolver proposes a patch/tree only — a trusted publisher constructs the commit with exact parents `R,S`**; scope guard (cleanly-merged paths bit-for-bit; changes within the conflict-path union); safety-control default-deny (hooks/CI/policy/ownership/validators/`.gitattributes`/`.gitmodules`/creds); deterministic gates (no markers, no unexplained one-side-equivalence, validators + targeted + full tests, unprivileged); fresh-tip re-observe under the fence; **confidence advisory only**; bounded attempts/chain-depth + pin retention + audit + circuit breaker. **Honest line (do not weaken):** passing bounded validators is acceptance under the configured oracle, not proof of arbitrary human intent.

### Request B — GitKraken MCP (ADR-005)

INCLUDE more, **outside** transaction authority. Never owns push CAS/pins/journal/projection/candidate-construction/remote-verification. Safe uses: read-only (`--readonly`) operator observability (status/graph/ancestry/PR); Launchpad/graph/PR tools to augment **human** quarantine adjudication (the custom journal stays transaction truth); GitLens AI conflict resolution interactively in a disposable resolver worktree, output through Request A's gates; Commit Composer as opt-in session aid. Prohibit `git_push`/`git_pull`/`git_fetch`/branch/worktree/stash/commit mutations in the publisher; register any `start_work`/`start_review` worktree with the session manifest. **`git_resolve` is not assumed** — it is absent from GitKraken's current public MCP reference; treat it as a version-gated experimental adapter after a pinned-version contract test. Preinstall + pin the CLI; no unattended `npx -y`.

### REQ-010 — worktree/branch sk-git convention (ADR-006)

Every worktree the architecture uses (session authoring, projection, disposable validation/resolver) follows sk-git's numbered/namespaced worktree scheme; branches are named on the related skill (`<skill>/…`) or on `skilled/…` (the whole-system alias, e.g. `skilled/v4.0.0.0`). Architecture session branches are system-level → `skilled/…`. The current local tree (`backup/`, `wt/0001…0037`, `work/opencode/<timestamp>`, `wip/…`) is recorded as non-conforming; the sk-git skill edit + local cleanup are deferred to a separate change.

---

## 6. Testable acceptance conditions

| Test | Pass condition |
|------|----------------|
| Concurrent publication | ≥32 disjoint contributions from one base; each acknowledged source reachable exactly once in the serialized history; no session gets a non-fast-forward task. |
| Serialized ref race | A stale publisher attempt after a newer candidate is projected+published is rejected internally, rebuilt against the new tip, retried without force or lost ancestry. |
| Two-publisher projection race | Start a second/stale publisher instance; the fencing singleton prevents it re-projecting stale `C_old`; the primary never goes behind. |
| Unauthorized writer (every window) | Direct session/human/bot/UI/admin-bypass and ordinary-fast-forward updates by non-publisher identities are all rejected by remote enforcement. |
| Remote-policy rejection | Confirm the `v4` ruleset accepts two-parent integration commits (and required signatures/status/direct-push); linear-history/PR-only settings are rejected or the architecture changed. |
| Textual conflict | Incompatible same-line edits: one publishes; the other retains source/candidate refs + `{B,R,S}` OIDs + paths + diagnostics in `conflict-quarantined`. |
| Semantic conflict | A textually clean change failing a cross-file validator moves neither origin nor projection. |
| Crash recovery matrix | Kill the publisher before/after every durable edge (source pin, candidate pin, projection switch, push send, remote update, verification, ack); restart converges idempotently. |
| Power-loss durability | Power loss after pointer update and after remote update; disk-full / fsync-failure / torn journal tail halt admissions and preserve pins; boot never exposes a stale projection. |
| Reachability under GC | Expire reflogs + aggressive prune at each crash point; every unreleased source/candidate still resolves via a live ref or verified remote ancestry; no prune concurrent with unpinned creation. |
| No lost uncommitted work | Seed staged/unstaged/untracked/ignored/renamed/deleted/symlink/mode-change sentinels per session; files, index tree, `HEAD`, porcelain status identical after load + fault tests. |
| Ambiguous push | Drop the client response after the server updates `v4`; restart observes containment and records one publication, no duplicate integration commit. |
| Force prohibition | `--force`/`--force-with-lease`/`+` refspecs rejected by policy; an injected non-fast-forward update rejected by remote enforcement. |
| Primary never behind | Instrument every origin + primary transition; at each event `git merge-base --is-ancestor <origin-tip> <primary-oid>` succeeds. |
| Primary crash windows | Crash after projection switch before push, and after server update before response; the primary stays equal-or-ahead, no manual reconcile. |
| IDE observation | Publication waits for `P_ui` ack of the projected OID (strict mode); repeated reads never observe a mixed revision under the atomic-pointer backend. |
| Dirty-primary defense | A direct edit in the primary fails closed or redirects to an isolated human worktree; no automatic reset/stash/overwrite. |
| Projection failure | Corrupt a revision dir / interrupt a pointer replacement; the controller keeps the last complete projection or rebuilds without touching session worktrees. |
| Trust boundary | A session process attempting to write the publisher repo/refs/hooks/journal/pins/projection is denied. |
| Edge objects | LFS pointer without uploaded object, submodule/`.gitmodules` change, escaping symlink, mode/type change, hostile filename: each fails closed or is human-only until a dedicated validator exists. |
| Quarantine ordering | A conflict at the queue head, followed by dependent + provably independent transactions; only the independent one bypasses, with proof recorded. |
| Forward-only rollback | Publish A, B; roll back A while submitting C; final tip descends from B, contains C once, includes a revert commit — no backward ref movement. |
| Request A safety | Prompt-injection in a conflict hunk cannot exfiltrate or push (sandbox, no creds); a stale AI proposal is rejected by the fresh-tip gate; a reverted bad resolution trips the circuit breaker. |
| Freshness-SLA fallback | If remote-first mode is deliberately selected, measure remote-update→IDE-ack latency p50/p95/p99 and label the mode SLA-current, not strictly never-behind. |

---

## 7. Confidence and coverage

| Claim class | Confidence | Basis |
|-------------|-----------:|-------|
| Git push/worktree/fetch/merge-tree/commit-tree/update-ref/stash/reflog/bundle/GC semantics | High | Both lineages relied on primary Git docs; verification cross-checked |
| Shared dirty tree cannot be both universally current and lossless | High | Direct consequence of guarded update/merge/reset + overlapping-file semantics |
| Serialized publisher + isolated worktrees is the correct default | High | Strong SOL/LUNA convergence under no-force, low-latency, no-worktree-mutation constraints |
| Durable pins + journal replay + read-after-write reconciliation | High conceptually; medium-high operationally | Strong primitive evidence; still needs fault injection |
| Projection-first proof of "primary never behind" | High **under the sole-writer + fencing assumptions** | Simple ancestry invariant; depends critically on excluding all out-of-band origin writers and on a correct singleton |
| Remote-policy compatibility (merge-commit shape) | Medium — must be audited | Host rulesets can reject two-parent commits/signatures/PR-only |
| Atomic IDE projection behavior | Medium | Filesystem pointer replacement established; IDE watcher/reload behavior untested |
| Throughput and freshness latency | Medium–low | Repo size, validators, network, journal backend, IDE behavior not benchmarked |
| Automatic handling of arbitrary semantic overlap | Not claimed | Would require constrained namespaces or silent choice/data loss |

**Cross-model coverage is reduced:** only SOL and LUNA ran; the planned GLM-5.2 lineage was dropped for safety (its executor required `--dangerously-skip-permissions` on the shared dirty tree). The two lineages were separate model runs sharing the charter, sources, and assumptions — correlated support, not three independent confirmations. Implementation benchmarks, IDE projection behavior, and operational failure rates remain to be validated empirically. Full attribution: `fanout-attribution.md`.

---

<!-- ANCHOR:sources -->
## 8. Sources

Primary documentation both lineages relied on (full per-finding `[SOURCE: …]` markers are inline in the lineage iterations under `research/lineages/`):

- [SOURCE: https://git-scm.com/docs/git-push] — push, fast-forward, and receive-side ref-lock semantics
- [SOURCE: https://git-scm.com/docs/git-merge-tree] — checkout-free merge preflight and conflict exit status
- [SOURCE: https://git-scm.com/docs/git-commit-tree] — two-parent integration commit construction
- [SOURCE: https://git-scm.com/docs/git-update-ref] — local CAS (`<new> <old>`), all-zero-OID must-not-exist, `--stdin` transactions
- [SOURCE: https://git-scm.com/docs/git-worktree] — linked-worktree isolation and lock semantics
- [SOURCE: https://git-scm.com/docs/git-fetch] — safe object/remote-tracking updates without file rewrite
- [SOURCE: https://git-scm.com/docs/git-revert] — forward-only rollback (`-m 1` for a merge commit)
- [SOURCE: https://git-scm.com/docs/git-gc] — reachability, prune, and concurrent-writer corruption warning
- [SOURCE: https://git-scm.com/docs/git-config] — `core.fsync` durability policy (macOS `writeout-only` caveat)
- [SOURCE: https://git-scm.com/docs/git-receive-pack] — `receive.denyNonFastForwards` boundary
- [SOURCE: https://github.com/kubernetes/git-sync] — immutable revision directories + atomic pointer projection
- [SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets] — rulesets, linear-history, and update restrictions
<!-- /ANCHOR:sources -->
