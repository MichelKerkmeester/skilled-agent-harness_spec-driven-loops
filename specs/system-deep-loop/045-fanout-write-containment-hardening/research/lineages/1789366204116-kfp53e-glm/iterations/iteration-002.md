# Iteration 002 — Challenging the prior synthesis: granularity, shared state, and what the second step secretly already solves

**Session.** fanout-glm-1789366204116-kfp53e | iteration 2 of 3 | started 06:38Z, recorded 06:52Z (real timestamps).

**Mandate.** Challenge `research/alternatives/synthesis.md`: find what it missed, what it got wrong, what remains unmeasured. Iteration 1 decomposed the cost; this iteration attacks the mechanism rulings and the cone's own granularity.

## Focus

What the 62%/85% cuts actually govern; whether a no-shared-state materialization escapes the repository-wide flip; what the clonefile variant misses; whether wholesale-`.opencode` is the right cone at all.

## Actions Taken

1. Measured the tracked materialization of every candidate cone via `git ls-tree -r` (read-only): all `.opencode` = 17,648 files; `skills/system-deep-loop` = 1,627; `skills/system-spec-kit` = 1,867; the 045 packet = 182; agents+commands+bin+hooks+plugins+scripts = 519. Sizing of the roots the prior model never counted: `.pi` 1.9 M, `.cursor` 36 K, `.devin` 28 K, `.github` 108 K — negligible; the tracked-`.opencode` growth (216→252 M tracked / 353 M on disk) is skill-tree growth, sk-design alone 148 M.
2. Read the containment detector (`write-containment.ts:689-780`) to settle, from code, what any materialization variant must satisfy: one porcelain scan, per-**dirty**-path hashing, the unattributable-exempt, and opt-in baseline byte-capture.
3. Grepped the packet's entire research tree for skip-worktree (4 hits, all as implementation detail) and read the agent definition (38,170 bytes, LEAF, read/write/bash-allow) that this lineage's route-proof asserts.

## Findings

### F1 — The 62%/85% govern the tracked tree only, and undersell what is actually addressable

The prior cuts are ratios of the **tracked** tree (1,425 MB). The per-lane cost ALSO contains the ungoverned 101 MB/5,454-entry dependency bootstrap (iteration 1, L3), which no cone touches because it is untracked, unprovisioned, and unseeded. Re-measured TODAY:

| Cone | Tracked files | Tracked bytes | vs 82,572 / ~1.56 G tracked |
|---|---|---|---|
| Wholesale-`.opencode` + packet (their #1) | 17,648 + 182 | ~252 M + 1.9 M | 84.4% checkout cut |
| **Contract closure** (skills/system-deep-loop + agents/commands/bin/hooks/plugins/scripts + the packet + root docs) | **2,328** | **~21.5 M** | **98.5% checkout cut** |

Their "cone = the union of `.opencode/`, the target packet or its family, any other spec path the dispatch names, and the seed path list" (alternatives/synthesis.md:57) spends 11.4× the tracked bytes of the closure cone, because wholesale-`.opencode` drags 15,320 unread tracked files — sk-design alone is 148 M of the 353 M and a research lane reads none of it (this lane's own read set: the deep-loop runtime, the command/YAML assets, the packet, the agent definition; zero bytes of sk-design, sk-doc, sk-code, or any other skill). **[SOURCE: `git ls-tree -r HEAD` counts, 06:44Z; alternatives/synthesis.md:57; this lane's own actions]

### F2 — Skip-worktree is present in the record unassembled: the no-shared-state primary they ranked second's detail

Every prior mention of skip-worktree treats it as a detail of porcelain sparse-checkout or of the clonefile's index problem. Nobody assembled the mechanism:

- The skip bits live **in the lane's own index** (`$GIT_DIR/worktrees/<id>/index`). Setting them requires **no `extensions.worktreeConfig`, no `core.sparseCheckout`, no shared config, no sparse-checkout file, no git-version gate** — the exact shared-state hazards their #1 flags (alternatives/synthesis.md:58) vanish, including the 29-worktree interference (f-108).
- Detector compatibility is by construction: the containment compares **porcelain deltas** against a hashed, baseline-captured pre-dispatch snapshot (write-containment.ts:689-774), and skipped entries never appear in porcelain — a prior lane even wrote it: "(skip-worktree entries are skipped by status; new writes stay visible)" [SOURCE: research/lineages/...deepseek/research.md:73] — and stopped there.
- It dissolves SWE-2's "one real engineering detail" (their #2's index problem): `read-tree HEAD` + skip the ~80,244 unnamed entries + checkout the ~2,328 closure files leaves the index correct **relative to disk by construction** — no reconciliation pass, no foreign-stat content-hash, no copied-MAIN-index.

Recipe (all plumbing, no porcelain): `git worktree add --detach --no-checkout` → `read-tree HEAD` → set skip-worktree on everything outside the closure → `checkout-index` the closure. Cost: one read-tree + ~80,244 bit-writes, once per lane — **unmeasured** (the in-lineage probe is out of this lineage's write surface; it belongs to the packet's stub-executor protocol, exactly like the prior lanes' own unmeasured item). **[SOURCE: worktree-lifecycle.ts:147-183,592-593; write-containment.ts:689-774; swe2/iterations/iteration-002.md:32; deepseek/research.md:73]

### F3 — The cheapest step of all is unlisted: the 8th provision

`.opencode/node_modules` is a REAL 101 MB/5,454-entry directory in this worktree, gitignored (`.opencode/.gitignore:1`), tracked=0, absent from `DEFAULT_SHARED_PATHS` (7 paths), absent from the seed (packet-uncommitted only), and no `bun`/`npm`/`install` call exists anywhere in the runner — it is created by the executor/bootstrap side at worktree birth (provenance otherwise unresolved). It carries **no `@spec-kit/*`** (measured: 3rd-party only), and its `.bin` shims are relative — so under the resolution-containment invariant it is wholesale-linkable, exactly like the 6+1 existing links (external deps are not "repository-internal"; the launch-wrapper precedent sanctions the shape). One symlink: −101 MB, −5,454 entries, −the-install-seconds per lane, for every lane kind. Its precondition is the symlink wave's own open fork (the 14-site entry-point guard must be audited for the `.bin` path) — worktree-symlinks/synthesis.md:160-166. The prior synthesis ranks mechanisms; this one never enters its table. **[SOURCE: measured 06:32-06:46Z; worktree-lifecycle.ts:147-158,141-144; worktree-symlinks/synthesis.md:110-112,160-166]

### F4 — Their own measurement protocol cannot measure their own hazard

The prior synthesis's "unmeasured" item (sparse-cone setup) comes with a prescribed instrument: "a throwaway clone, with the operator's say-so" (alternatives/synthesis.md:64). But the hazard they flag is the **repository-wide flip interacting with 29 existing worktrees** — a throwaway clone has no 29 worktrees, so the prescribed instrument cannot answer the flagged hazard. The packet's own precedent already licenses the correct instrument: the verification table's "Manual shared-checkout run — PASSED on the real main checkout **with other sessions live**" (implementation-summary.md, Verification). The production probe is precedented; the "operator's say-so" was never load-bearing. **[SOURCE: alternatives/synthesis.md:58,64; implementation-summary.md:Verification table]

### F5 — The clonefile variant's three hidden costs, and the one thing its author got right

SWE-2's #2 (`--no-checkout` + `cp -Rc`) claims "~0 disk" and "1–4 s" (swe2/iterations/iteration-002.md:20). What it misses:

- **Inodes**: clonefile shares extents, not directory entries — 82,573+ inodes per lane remain (their "near zero" is true for bytes only).
- **Foreign-stat first status**: their option B (seed the lane's index from MAIN's index) puts MAIN's stat-cache next to freshly-cloned inodes with new ctimes; the first `git status` then re-hashes. Our measured COLD status — the BEST case, where the checkout wrote its own matching stats — is 1.54 s; the foreign-stat case is strictly worse and unmeasured. Their "even a degenerate full content-hash pass is seconds" is asserted, not measured, against 82,572 files.
- **The ignored-tree question**: cloning MAIN's *working tree* drags `node_modules`/`dist` as CoW extents (splitting on later writes); cloning the *checkout* leaves the 7 dependency links and the dependency bootstrap unresolved. Neither variant prices this, and nobody says WHICH they mean.

What SWE-2 got right, now verified from code: ADR-002's baseline-targeted restore makes the uncommitted-content question safe — the containment baseline captures DIRTY-OUT-OF-SCOPE BYTES (captureContentDir, write-containment.ts:694-737), so any flavor of working-tree cloning, ordered before the baseline snapshot, restores to the captured bytes, not to HEAD. The variant survives; its pricing does not. **[SOURCE: swe2/iterations/iteration-002.md:20,32; write-containment.ts:694-737; measured cold/warm 06:29:31Z]

### F6 — The detector's cost shape, from code, decides both variants

The detector is ONE porcelain scan + one hash **per dirty out-of-scope path** + the unattributable-exempt + opt-in baseline capture — it never walks all 82,572 tracked entries per call beyond what `git status` itself does. Therefore: the skip-worktree lane's steady state = warm status (0.10 s measured) + O(dirty) hashes; the porcelain-sparse lane's = the same; neither pays a per-tracked-file detector premium. The 1.54 s COLD status, meanwhile, is already inside the 22.2 s: the runner's own uncommitted-path discovery (the seed's `listPacketUncommittedPaths` → porcelain) pays it. **[SOURCE: write-containment.ts:689-774; fanout-run.cjs:2834-2837; measured 06:29:31Z]

## Questions Answered

- q2: the 62%/85% are tracked-only ratios of a 17,648-file wholesale-`.opencode` cone; the contract closure is 2,328 files / ~21.5 M → 98.5% of the checkout, 93%+ of the true per-lane cost including the ungoverned 101 MB leg (which the 8th provision then removes). Their granularity, not their conclusion, is what needs amendment.
- q3: YES — full-index partial materialization via skip-worktree: zero shared state, detector-compatible by the containment's own porcelain-delta shape, and it dissolves the clonefile's index problem. Costs: read-tree + ~80,244 bit-writes, once, unmeasured.
- q4, half: the clonefile variant misses inodes, the foreign-stat first status, and the ignored-tree question; its ranking (second) is right, its pricing is not, and itsindex detail is solved by the mechanism its author sidelined. The ADR-002-restore compatibility holds.

## Questions Remaining

- q4: which ignored-tree flavor, the foreign-stat hash cost, and the 1–4 s claim — unmeasured (stub-protocol).
- q5: relocation pins, the true unmeasured ledger, and the reordered adoption — iteration 3.

## What Was Tried and Failed (ruled out)

- Timing `read-tree` + the 80,244 skip-bit writes in this worktree — ruled out: it writes MAIN's `$GIT_DIR/worktrees/...`, outside this lineage's write surface; the packet's stub-executor protocol owns the measurement. (This is the same reason every prior lane's number here is a estimate.)
- Counting a "79k deleted entries" penalty for the skip variant — ruled out: skipped entries do not appear in porcelain at all (deepseek's own note; the porcelain-delta design), so no such penalty exists.

## SCOPE VIOLATIONS

None. Every action read-only; the only writes are this lineage's artifacts plus the gateway's.

## Next Focus

Iteration 3 — what they missed in relocation (which surfaces actually pin paths), the consolidated unmeasured ledger (teardown, dependency-leg provenance, foreign-stat, bit-writes, interference), and the reordered adoption path.
