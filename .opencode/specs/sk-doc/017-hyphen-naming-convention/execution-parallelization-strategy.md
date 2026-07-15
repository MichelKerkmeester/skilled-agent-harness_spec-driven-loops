# 017 Execution Parallelization Strategy — Epochal Wavefront

> **Status:** Planning reference for the 017 migration EXECUTION (phases 006–011). This is authored guidance, not an
> execution log — no migration runs during this authoring pass. Scope is the `sk-doc/017-hyphen-naming-convention` packet.
>
> **Provenance:** Distilled from a read-only GPT-5.6-SOL (ultra, fast) analysis run on 2026-07-15 and grounded against the
> cited packet specs. The "missing reference-rewrite executor" and "008 scaffold stub" findings were verified directly against
> `005/001`, `005/002`, and the pre-authoring `008/spec.md`. Where a claim is SOL's proposal rather than a verified fact, it is
> marked as such. Supersedes nothing; it names the execution model the phase specs point to.

---

## 1. The model: epochal wavefront

The baseline shape — **foundation → cross-cutting closures → component fan-out → global closeout** — is correct. What changes
for a moving-base migration is that the frozen map is not a one-shot snapshot and lanes are not long-lived:

- **Immutable frozen-map *epochs*** instead of one permanent freeze.
- **Short-lived SCC lanes** so a lane lands before its skill moves again.
- **One serial integration steward** that owns merge order.

You do not fight concurrent drift by freezing the whole repo. You version the map, keep lanes short, and reconcile mechanically.

---

## 2. Execution stages

| Stage | Execution model | Barrier |
|-------|-----------------|---------|
| **Foundation (000–005)** | `000 → 001`, then two controlled tracks: consumer/generator/guard work (002/003/004) and phase-005 tooling. Serialize whenever write sets overlap (e.g. root-consumer and generator both touch `package_skill.py`). | Join both tracks, pass their verifier checks, cut epoch **E0**. |
| **Cross-cutting (006 → 007)** | Materialize the executable SCC DAG (006). Run 007/001–004 discovery in parallel, union graphs, collapse SCCs, execute independent SCCs by level. A closure crossing ≥2 component owners stays ONE 007 transaction. | Re-census, cut epoch **E1** from the post-007 integration head. |
| **Components (008)** | Schedule phase-008 batches from E1's SCC condensation DAG. Default one exclusive skill lease per lane; sub-lanes only where 006 proves disjoint write sets. | After every wave, integrate serially and run the whole-wave guard + reference checks. |
| **Global tail (009 → 010 → 011)** | Serial, on exact integration SHAs. | Any new candidate or cross-component edge reopens reconciliation before closeout. |

---

## 3. Deriving max width

From the phase 006 reference graph:

1. Collapse into dependency-closed **SCCs** — the minimum rerunnable, rollback-safe unit. Never split an SCC.
2. Build the condensation DAG `G`.
3. Level: `level(b) = 0` if `b` has no predecessors, else `1 + max(level(p))` over predecessors `p`.
4. Within a level, build a **conflict graph**. Two batches conflict if they: intersect write sets; one writes what the other
   reads/rewrites; share a symlink endpoint; touch the same generator or generated output; or both change a shared `SKILL.md`,
   README, manifest, or root pointer. *If two same-level batches conflict with no DAG edge explaining it, the map is defective —
   add an ordering edge or collapse them.*

Theoretical width of a level = maximum independent set of its conflict graph. **Operational width:**

```
Wᵢ = min(independent batches, worktree slots, verifier slots, freshness-safe merge capacity)
```

The **merge-capacity throttle** matters under a serial integrator:

```
active lanes / median lane duration  ≤  1 / median merge duration
```

Exceed it and completed lanes queue, age against a moving base, and manufacture rework.

**Structural envelope ≈ 14 skill lanes, not 137 leaf lanes.** Width above 14 is *earned* only when 006 proves disjoint
intra-skill closures — and often it can't: sk-git's `references` and `benchmark` leaves both touch the root `SKILL.md`, and
sk-doc's shared backbone precedes and feeds every `create-*` packet. Under drift, integration *freshness* beats raw lane count.

**Batch sizing:** one SCC → one commit → one verifier receipt. Hot skills: one SCC per short-lived lane, no packing. Cold
skills: a worktree may process several independent SCCs sequentially, retaining a separate commit + receipt each. Target lane
lifetime = apply → verify → integrate in one working session; do not park completed lanes overnight.

**Determinism vs judgment:** scripts own inventory, map validation, collision checks, `git mv`, static reference rewrites,
fingerprints, journals, and idempotent replay. Models own ambiguous classification, exemption/dynamic-reference analysis, and
verifier review. Models do not hand-type filesystem moves or reference rewrites.

---

## 4. Concurrent-drift resilience

### 4a. Three pins

- **`BASE0`** — behavioral baseline from phase 000.
- **`MAP_BASE_E`** — immutable source SHA for frozen-map epoch `E`.
- **`EXEC_BASE`** — the integration SHA a lane actually claimed from.

Drift = `EXEC_BASE` diverging from integration head over the lane's touch-set. Each batch carries: source/target paths; static
reference sites; dynamic-reference dispositions; symlink nodes + targets; producer manifests + generated outputs; complete
read/write sets; dependency + batch hashes. (These are the phase 006 **REQ-008** executable touch-sets.)

### 4b. Drift detection

At lane claim, fingerprint the touched tree:

```sh
git ls-tree -r -z "$EXEC_BASE" -- "${TOUCHSET[@]}" | shasum -a 256
```

Before apply, after apply, and immediately before integration:

```sh
git diff --name-status -M "$EXEC_BASE" "$INTEGRATION_HEAD" -- "${TOUCHSET[@]}"
```

Then rerun the reference checker and the no-new-snake guard against the candidate tree. **Branch diffs are insufficient** —
uncommitted work in another worktree is invisible. The steward MUST also enumerate `git worktree list --porcelain` and inspect
every relevant worktree with `git status --porcelain=v2`, intersecting dirty paths with the batch touch-set. *(This is exactly
the class of miss that produced the stale-base scare during the 066 concurrent-merge earlier in this program.)*

### 4c. Compare-and-swap reference rewrite (the rework-minimizer)

The executor state machine (renames):

- source exists, target absent → **apply**
- source absent, target present with expected classification/content → **already-applied**
- both exist → **collision / fail**
- neither → **drift / fail → re-inventory**

Reference rewrites use equivalent CAS: each planned rewrite stores the **preimage blob hash** + semantic site ID. If the blob
changed, do **not** apply a stale textual patch — rescan and regenerate that batch's rewrite plan. This is what the new phase
**005/004 reference-rewrite executor** owns, and it is what makes a drifted batch *re-derivable* rather than hand-fixed.

Reconciliation then becomes mechanical:

| Drift class | Action |
|-------------|--------|
| No touch-set intersection | Replay the unchanged batch on the new `EXEC_BASE`; rerun verify. |
| Content-only intersection | Integrate the concurrent edit first; discard the generated rename commit; rerun the batch on the newest blob. |
| Add/delete/rename/new reference edge | Delta-inventory the affected paths; recompute the induced SCC. |
| New cross-component edge | Route through a 007 reconciliation lane before either dependent component merges. |
| Unchanged batch hash | Preserve the receipt; reverify only the impacted SCC and downstream dependents. |

The packet's `v4-reconciliation-inventory.md` already demonstrates the need: 222 changed paths, 66 already-applied sk-git
renames, and a late `conformance_benchmark` family absent from earlier counts — the frozen-base assumption no longer holds.

### 4d. Hot / warm / cold ordering (keyed to churn, not a blanket rule)

Let `T` = predicted lane duration.

- **Cold** — no touching commits for ≥ `2T`, no dirty/divergent worktree, no new candidates. Run early; optionally microbatch.
- **Warm** — < 2 content-only touching commits during `T`, no add/delete/rename/graph change. Use continuous reconciliation.
- **Hot** — active foreign writer, dirty worktree, any add/delete/rename/new candidate, or ≥ 2 touching commits during `T`.

For a **hot** skill: run it **first** only when an enforceable freeze window exceeds the measured p95 apply+verify+integrate
duration; otherwise run it **last**, after its feature work hands back. Migrating a hot skill early without a freeze only
guarantees it drifts again. Per the inspected state, **sk-doc, commands, and deep-loop are currently hot** — recompute
immediately before execution; never hard-code.

### 4e. Freeze vs continuous reconciliation

| Volatility | Model |
|-----------|-------|
| Cold | Continuous; re-pin before apply and before merge. Independent SCCs may be packed. |
| Warm | Continuous; one SCC per lane; mandatory pre-merge replay/check. |
| Hot | Short per-skill coordinated freeze. If none is available, defer the skill. |
| Whole-repo gates | Exact-SHA integration freeze while 010/011 run. |

A global multi-day freeze is unnecessary. Short skill-local freezes + exact-SHA global gates give most of the safety without
stopping unrelated development.

### 4f. Epoch cadence

Each epoch is immutable: `epoch_id`, `map_base_sha`, `parent_epoch_hash`, `candidate_set_hash`, `graph_hash`, and per-batch
`batch_id → source/target/read/write/dependencies/batch_hash`. (Phase 006 **REQ-009**.)

1. **E0** after 000–005 integrate.
2. Execute 006 and 007 against E0.
3. **E1** after 007 integrates and a full census passes.
4. Before each 008 topological wave, compare `MAP_BASE_E` to integration head.
5. If the delta is unrelated to all candidate/reference touch-sets → update only lane `EXEC_BASE` pins.
6. If it adds/removes/renames a candidate or changes an edge → issue **E+1**, recompute only the affected subgraph.
7. Before 009, run one final full census and cut the closeout epoch.

This rebuilds nothing for harmless content changes while ensuring a new name (e.g. `conformance_benchmark`,
`sk_doc_command_adapter.md`, `sk_doc_command_known_deviations.md`) cannot escape classification.

---

## 5. Coordination — leases + serial steward

Atomic leases in the shared Git common directory:

```sh
G=$(git rev-parse --path-format=absolute --git-common-dir)
mkdir "$G/017-leases/<skill>.<scc>.lock"   # mkdir is the atomic claim
```

Each lease records owner/session, worktree, branch, epoch, SCC, `EXEC_BASE`, touch-set hash, heartbeat, expiry, and state:

```
CLAIMED → APPLYING → VERIFYING → READY → MERGING → MERGED/RELEASED
```

Rules:

- Default to an **exclusive skill lease**; permit sub-skill leases only after conflict analysis proves no shared
  root/pointer/generated-output writes.
- **Right-of-way to the existing writer.** An active foreign writer must either commit a handback tip or keep the lease; the
  migration NEVER operates over its dirty files.
- Each lane hands the steward one generated commit + its verifier receipt.
- The steward checks lease freshness, ancestry, fingerprints, checker output, and a `git merge-tree` preflight.
- Integrate **one SCC at a time**. On cherry-pick/merge conflict: abort, integrate the competing edit, **regenerate the SCC**, retry.
  Do not hand-resolve generated rename/rewrite patches.
- A foreign handback tip is accepted only when `git merge-base --is-ancestor <tip> <candidate>` holds before closeout.

**Verification split (SOL correction #4).** "Toolchain verification never per worktree" is too broad. Persistent database/index
refresh (memory reindex, code-graph rescan) belongs on the integration worktree AFTER a merged wave — but leaf-local builds,
typechecks, smoke tests, and discovery checks still run **inside each lane** where the component requires them (e.g. the
`system-code-graph` component's lane plan requires them). Defer only the single-global-instance work; keep in-lane the checks
that prove that lane.

---

## 6. Top failure modes

| Failure | Detection signal | Mitigation |
|---------|------------------|-----------|
| Rename races an edit to the same file | Touch-set blob hash changes; another worktree reports the path dirty; pre-merge diff intersects source/target. | Land + verify the concurrent edit first, then regenerate the entire affected SCC from the new blob. |
| Reference rewrite targets a concurrently deleted/moved path | Checker reports unresolved/ambiguous target; source and target both absent; `git diff -M` shows deletion/rename. | Re-inventory the edge, update the epoch, recompute the induced SCC. Never substitute a guessed path. |
| Guard/global gate flaps as base moves | Start SHA ≠ end SHA; identical command alternates pass/fail; candidate-set hash changes mid-gate. | Hold an integration lock for the exact SHA; gate receipts valid only for that SHA; restart after any accepted merge. |
| Merge-back conflict / hidden shared pointer | Write-set intersection; `git merge-tree` conflict; shared `SKILL.md`/README/generated-output change. | Add the missing dependency or collapse batches; keep serial integration; regenerate rather than hand-resolve. |
| Concurrent work lost or silently omitted | Dirty worktree remains; foreign handback tip is not an ancestor of the final candidate; unexpected post-rename content hash. | Mandatory worktree census, commit-based handback, ancestry receipts, content verification after replay. Never delete/overwrite a dirty lane. |

---

## 7. Execution-readiness prerequisites (the 3 things) — and how this packet now addresses them

1. **Materialize phase 006 as an executable SCC DAG** with complete per-batch touch-sets and immutable batch hashes.
   → Added as phase 006 **REQ-008** (executable touch-set) and **REQ-009** (epochal map), with matching checklist gates CHK-013/014.
2. **Add the missing deterministic, CAS-protected reference-rewrite executor** so every drifted SCC can be regenerated.
   → Added as new child **`005/004-reference-rewrite-executor`** (spec/plan/tasks/checklist), consuming the 002 ledger + 006 map,
   with the phase 003 harness extended to prove its compare-and-swap and drift behavior. *(Verified gap: `005/001` is `git mv`
   only; `005/002` is read-only.)*
3. **Enforce skill leases, mandatory handback commits, and one serial integration steward with exact-SHA gates.**
   → Named in the phase 008 fan-out model (§5 here) that replaced the unauthored scaffold stub; the lease/steward/state-machine
   contract lives in this document.

---

## 8. Ownership boundary — 002 / 007 / 008 / 009 (verified)

SOL flagged possible overlapping ownership of dual-name tolerance vs root moves vs alias removal. Verified against the 008
child specs and the on-disk trees (`find .opencode/skills -type d -name 'feature_catalog' -o -name 'manual_testing_playbook'`):
catalog/playbook is a **per-skill** pattern (≈49 snake dirs across ~14 skills; sk-git already piloted to hyphen), not a single
shared root. Ownership is complete — no gap, no double-ownership:

- **Add** the bounded dual-name tolerance in **002** (root-name-consumer-migration) — the shared consumers (classifier, Lane C
  loader/generator, routers, guard) accept both roots, dissolving the cross-skill coupling.
- **Rename** the physical catalog/playbook directories **per-skill in 008** (e.g. `008/001-sk-code/006-manual-testing-playbook`
  owns `sk-code/manual_testing_playbook/**`; `.../002-code-opencode` owns the nested code-opencode playbook). Because 002 already
  made consumers tolerate both names, each skill's directory rename is a local, skill-contained closure — correctly in 008, not 007.
- **007 owns only the cross-skill catalog edges**: the symlink façade `.opencode/skills/sk-doc/scripts/` (`007/002`) and the
  catalog command asset `create_feature_catalog_auto.yaml` (`007/001`) — never the per-skill catalog/playbook directories.
- **Remove** the transition compatibility **exactly once** in **009** (remove-transition-aliases), after 002's window closes and
  the 008 physical renames complete.

No phase removes an alias that another phase still relies on. *(Correction: an earlier draft of this section and `002/spec.md`
attributed the directory rename to "phase 007"; verification showed the per-skill directories are renamed in 008 — both corrected.)*

---

## 9. Open items for the operator before execution

- Recompute the hot/warm/cold classification against live churn immediately before the 008 fan-out.
- Confirm whether any component earns sub-lanes (requires 006 to prove disjoint intra-skill closures).
- ~~SOL flagged possible overlapping 002/007/009 ownership.~~ **Resolved (§8):** verified against the 008 child specs and on-disk
  trees — ownership is complete (tolerance→002, per-skill directory rename→008, cross-skill façade→007, alias removal→009); the
  only defect was imprecise "phase 007" prose in `002` and this doc's §8, both corrected.
