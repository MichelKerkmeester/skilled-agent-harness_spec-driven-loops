# Research: cheaper per-lane isolation than full git worktrees — the GLM lineage's challenge

**Session.** fanout-glm-1789366204116-kfp53e | lineage `glm` | generation 1 | 3 iterations, convergenceMode off, stopPolicy max-iterations | executed 2026-09-14T06:26–06:55Z (real timestamps throughout; the gateway's receipts carry the ledger's own).
**Mandate.** The prior three lanes (run 1789363775244-64o2qi) synthesized `research/alternatives/synthesis.md`: sparse-cone worktrees first, clonefile-in-a-registered-worktree second. This lineage's mandate: challenge it — what it missed, what it got wrong, what remains unmeasured. Every load-bearing number below was re-measured in this worktree during the run (timestamps in the citations); every mechanism claim was read from the code.

## 1. Executive summary

The prior recommendation survives, but its ordering, its granularity, and half its justification do not. The cost is not "the checkout": it is a checkout (L1) plus six legs the checkout cone never touches — including a **101 MB, 5,454-entry dependency bootstrap that no prior lane counted and that one symlink removes**. The checkout itself is overspecified by 7.6× in files: the lane's contractual read-closure is **2,328 tracked files (~29 M)**, not the 17,648 (~252 M) their wholesale-`.opencode` cone drags. And the shared-state cost they flag against their own #1 (the repository-wide `extensions.worktreeConfig` flip across 29 worktrees) disappears entirely in a variant their record already contained but never assembled: **skip-worktree bits in the lane-private index**. Adoption order: **#0 the 8th provision (one symlink) → #1 the skip-primary closure cone → #2 clonefile-on-top** — with their own default-off-until-measured constraint retained, measured on the production repo their own precedent licenses.

## 2. Question and scope

Per-lane worktrees cost ~1.6 GB of checkout and ~22 s of setup per lane (six lanes, measured). What cheaper mechanism preserves the same parallel fan-out and the same attribution guarantee? Evaluated against this repository: sparse/partial checkouts, shallow/reference clones, overlay/CoW, one-checkout redirection, sandboxed dirs with a shared store, and any one-checkout exact-attribution design — priced on setup cost, disk cost, attribution exactness, the four break-surfaces (symlinked dependency roots, workspace self-links, compiled entry-point guards, the churn detector), and relocation.

## 3. Method

Read-only against the packet and the runtime: `worktree-lifecycle.ts` (provision/create/seed/remove), `fanout-run.cjs` (lane prep, attempt naming, sweep, attribution), `write-containment.ts` (detector/baseline/restore), `verify-iteration.cjs` (this lane's own gate), the prior lanes' records, the runner's state files, and read-only git/du/ls-tree measurements at 06:28–06:48Z. No builds, no checkouts, no git writes: this lineage's write surface is its own directory, which is why every timing that remains open is open by construction (the packet's stub-executor protocol owns those writes).

## 4. Baseline, re-measured today

| Quantity | Prior record | Today (06:28–06:48Z) | Axis |
|---|---|---|---|
| Tracked files | 82,376 / 82,393 | **82,572** | drifting +196–82/round |
| Checkout | 1.6 GB | **1.7 G** (≈1.56 G tracked + 101 M dep-bootstrap + ~2 M other-roots) | grew |
| `.opencode` | 216 MB (tracked) | 353 M on disk / ~252 M tracked (sk-design alone 148 M) | +63% |
| `specs/` | 1,205 MB | 1.3 G | grew |
| `specs/system-deep-loop` (family) | — | **357 M, 12,255 tracked** | their 62% holds: (252+357)/1,560 → 61% |
| Pack (shared) | 2.06 GiB | **2,163,545 KB = 2.06 GiB** | unchanged — the store is lane-immune |
| Worktrees | 27 / 28 / "30" | **29** | the denominator moves |
| `extensions.worktreeConfig` / `core.sparseCheckout` | "unset today" | **UNSET** | their claim verified |
| Cold / warm `git status` | never measured | **1.54 s / 0.10 s** | new |
| [SOURCE: `git ls-files | wc -l`, `du -sh`, `git count-objects -v`, `git worktree list`, `git config --list --show-origin`, `/usr/bin/time -p sh -c 'git status --porcelain'` ×2; research/alternatives/synthesis.md:21-28]

The three prior counts of "tracked" files never agreed (82,376 vs 82,393 vs today's 82,572); the tracked tree is a moving target and every cost ratio below is stamped when it was true.

## 5. What the 22.2 s actually is

(149.7−16.5)/6 = 22.2 s [implementation-summary.md:98-110]. The lifecycle module (847 lines) contains **zero** timing calls — no leg weight exists anywhere in the packet's telemetry. From code + measurement, the legs:

| # | Leg | Evidence | Today's size | Falls with the checkout cone? |
|---|-----|----------|--------------|-------------------------------|
| L1 | Full checkout | `git worktree add --detach <dir> HEAD` — no `--no-checkout`, no cone, no pathspec [worktree-lifecycle.ts:592-593] | 82,572 tracked, ~1.56 G | **yes — the only one** |
| L2 | 7 dependency/dist links | `DEFAULT_SHARED_PATHS` = **seven** entries, wholesale absolute→MAIN [worktree-lifecycle.ts:147-158,549] | 7 symlinks | no |
| L3 | Ungoverned dependency bootstrap | `.opencode/node_modules`: REAL, 101 M, 5,454 entries, gitignored, tracked=0, not in DEFAULT_SHARED_PATHS, not in the seed (packet-uncommitted only [fanout-run.cjs:2834-2840]), no installer in the runner — created at worktree birth by the executor/bootstrap side | 101 M / 5,454 entries | no — invisible to the tracked ledger, the cone, and the provisioning contract |
| L4 | Status tax | cold 1.54 s / warm 0.10 s [06:29:31Z]; paid by the pre-dispatch containment snapshot, the post-lane verification, and the seed's own uncommitted-path discovery | ≥1.6 s ×2+ calls | partially (smaller lstat set) |
| L5 | Seed | per-file `copyFileSync`, symlink-following, **add-only** [worktree-lifecycle.ts:646-752] | ~0–2 MB today; unbounded | no (untracked, cone-external) |
| L6 | Lease + heartbeats | `.fanout-worktree.lock`, TTL 180 s [worktree-lifecycle.ts:617-626] | 370 B, periodic | no |
| L7 | Teardown | release-lease → forced `worktree remove` → `prune` [worktree-lifecycle.ts:772-843; fanout-run.cjs:2926] | ~1.7 G, 82,572+5,454+lineage unlinks — **zero mentions, zero measurements anywhere** | no number exists |

The prior synthesis prices the whole 22.2 s as if it were L1 ("setup time falls with the materialization ratio" — every lane's estimate). Five of seven legs disagree.

## 6. What the prior synthesis got wrong, missed, or left unmeasured

**Got the conclusion right, the justification wrong (two contradictions against its own record):**
- Its relocation safety is justified by "those links are relative" [alternatives/synthesis.md:53]; its own precedent wave proves the provisioning links are "absolute, wholesale" [worktree-symlinks/synthesis.md:110; readlink receipts 06:28:46Z]. Benign — the links are MAIN-anchored and MAIN never moves, which is also *why* they survive — but the newer synthesis cites the opposite link shape.
- Its instrument for its own hazard ("a throwaway clone") cannot reproduce the 29-worktree production interference it flags [alternatives/synthesis.md:58,64] — while the packet's verification precedent ("Manual shared-checkout run — PASSED on the real main checkout **with other sessions live**") already licenses the production probe. The consent excuse was never load-bearing.
- Its "85% packet-granularity" claim: the closure cone measured today is **2,328 tracked files / ~29 M** — 17,648→2,328 = 7.6× by files, ~252 M→~29 M = ~8.7× by tracked bytes; their wholesale-`.opencode` cone drags 15,320 tracked files no research lane opens (this lane read zero bytes of sk-design's 148 M). All-in (including the ungoverned 101 M leg no cone touches and the ~2 M other-roots): **92%**.

**What it missed entirely:**
1. **The 8th provision** (f-203): `.opencode/node_modules` = REAL 101 M/5,454, third-party-only (no `@spec-kit` inside — measured), `.bin` shims relative — wholesale-linkable under the resolution-containment invariant, exactly like the 6+1 sanctioned links. One symlink: −101 M, −5,454 inodes, −the-install-seconds, every lane, today. Its precondition is the symlink wave's own open fork (the 14-site entry-point guard).
2. **The skip-worktree primary** (f-202): the bits live in the lane's own index — no `extensions.worktreeConfig`, no `core.sparseCheckout`, no sparse-checkout file, no version gate, no 29-tree interference. Detector-compatible by construction: the containment compares porcelain deltas against a hashed, content-captured baseline [write-containment.ts:689-774] and skipped entries are porcelain-silent — a prior lane wrote exactly that ("skip-worktree entries are skipped by status" [deepseek/research.md:73]) and did not follow it. `read-tree HEAD` + ~80,244 skip bits + `checkout-index` over the 2,328–4,195-file closure leaves the index correct relative to disk **by construction**, dissolving SWE-2's "one real engineering detail" (the clonefile's index problem) [swe2/iterations/iteration-002.md:32].
3. **Teardown** (L7): the one 1.7 G, 88,000-unlink leg with no number and no mention.
4. **Relocation's runner layer** (f-301): fencing, watermark, lease, and the MAIN-anchored links are all path-free (measured 06:27–06:29Z) — but the runner's discovery/keep/reclaim is **base + prefix + name** [fanout-run.cjs:514-515, 2812-2815, 2882, 3132, 3155-3157], so a worktree moved out of the base becomes invisible to its own sweep; and a mid-run move freezes stale three things at once (the prompt's absolute paths, the executor's cwd, the runner's cached `worktreeDir` [:2830]). Their "relocation survives: yes" is a GIT-layer truth; between attempts, yes; mid-run, untested by anyone.
5. **The attribution hole** (f-302): three lanes published; `research/fanout-attribution.md` says kind/model "unknown" and verdict "n/a" ×3 — the publish manifests carry zero provenance (source_dir + byte/SHA entries only [luna/publish-manifest.json]) while every lane's config, invocation-metadata, and state records carry full executor blocks. Inference (the writer's source was not located in-budget): a receipts/manifest-only read. The fix costs the runner nothing — it holds the provenance at dispatch.

## 7. Mechanism comparison (their table, amended)

| Mechanism | Setup | Disk | Attribution exact | Breaks | Relocation | Verdict (amended) |
|---|---|---|---|---|---|---|
| Full worktree (today) | ~22.2 s, 7 legs, weights unmeasured | 1.7 G (1.56 G tracked + 101 M ungoverned) | yes | — | yes (between attempts) | baseline |
| Their #1: sparse-cone (porcelain) | unmeasured; +2 shared config keys +1 file +29-tree flip +version gate | 62–85% of TRACKED; the 101 M leg untouched | yes | their two "care" items | yes (git layer) | right idea, wrong implementation of it — see #1′ |
| **#1′ skip-primary closure cone** (this lineage) | read-tree + ~80,244 bit-writes, once, unmeasured | 2,328–4,195 tracked files, ~29–52 M; 92% all-in | yes, same registration | none found; detector-compatible by porcelain-delta construction [write-containment.ts:689-774] | same as theirs | **adopt: their #1's benefits, no shared state** |
| **#0 the 8th provision** (this lineage) | one symlink | −101 M, −5,454 inodes, −install-seconds | yes | needs the 14-site guard audit (their own open fork) | yes | **the cheapest step, not in their table** |
| Their #2: `--no-checkout` + `cp -Rc` | unmeasured; their 1–4 s = asserted; +foreign-stat first-status +inodes (82,573+/lane) +the ignored-tree question | ~0 extents, inodes remain | yes | index problem solved by the skip bits it sidelined; ADR-002-restore verified [write-containment.ts:694-737] | yes | second, rescued; price it |
| Shallow / reference | wrong axis — objects already shared (2.06 GiB unchanged) | no gain | adds a repo boundary | the sweep's blindness | n/a | ruled out — their ruling CONFIRMED (f-101: the pack is bit-stable) |
| Partial/blobless clones | needs a transport; every blob is already local | no gain | n/a | promisor coupling | n/a | ruled out — CONFIRMED |
| One-checkout redirection | fights the runner's 12-var GIT_*-env strip [worktree-lifecycle.ts:161-183] | none | no | the detector watches the wrong index | n/a | ruled out — CONFIRMED, mechanism refined (F4, it1) |
| Unregistered CoW/overlay | fast | near-zero | no | not a git working tree | no | ruled out — CONFIRMED |

## 8. Eliminated Alternatives

- **Shallow clone** — history truncation, not tree; the full materialization remains; a new repo boundary the sweep cannot see [alternatives/synthesis.md:41; their ruling, confirmed: the 2.06 GiB pack never participates in the per-lane cost].
- **Reference / shared clone** — the object store is already shared and bit-stable across 29 worktrees (2,163,545 KB today = the prior number) [06:29:31Z]; zero gain; same boundary defect.
- **Partial / blobless** — nothing to fetch lazily from a repo holding every blob; promisor transport couples lane liveness to source location [deepseek ruled-out, it1; confirmed].
- **One-checkout + per-lane redirection** — the runner strips GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE and nine more before every call [worktree-lifecycle.ts:161-183]; GIT_INDEX_FILE + checkout-index scoring (deepseek) confirmed; scored 3/10 in ADR-003.
- **Unregistered CoW/overlay directory** — no git identity; status, the detector, and the sweep cannot see it; move/repair act on registered worktrees only [their ruling, all three lanes; confirmed].
- **Porcelain sparse-checkout as the FIRST step** (their #1, demoted — not eliminated): it implements the same skip-state through 2 shared config keys + 1 per-worktree file + the 29-worktree flip + an unpinned version gate; the plumbing (skip bits in the lane's private index) delivers the same state with zero shared writes. Eliminated as the *primary*; retained as the porcelain-DX variant.
- **The throwaway-clone measurement protocol** — retained as the mechanism test, eliminated as the interference test (it cannot reproduce the 29-worktree production state) [f-204].

## 9. Divergence Map

From the registry: saturated directions — none (convergenceMode=off; no divergent pivots were prepared or taken). Pivot lineage: none yet. Evidence: 19 keyFindings (P1×11, P2×5, P3×3) across 3 iterations; 5 ruled-out directions; sources: 5 runtime/lib+scripts files, 1 prior-lane research tree (deepseek/luna/swe2), 6 runner-state files, 12 measured command batches, 2 prior-packet syntheses. Council artifacts: none (no divergent mode). Remaining frontier: the 10 open questions in §12.

## 10. What the prior lanes' process cost this run (runner defects, continued)

- Their L1 (duplicate state records) reproduced exactly — then went further: the `deep-research.ledger.iteration-completed` event's data schema (nextFocusCausationId, outputDigest, rawNewInfoRatio, ruledOutApproachRefs, status, trustedEvidenceYield) carries **no mode/focus/target_agent/resolved_route**, so the gateway's legacy-V1 projection can never satisfy the route-proof its own validator demands [verify-iteration.cjs:8,128-142,245-266; events/iteration-001.result.json]. The sanctioned working contract is the validator's own: the canonical event in the ledger, the SAME canonical record (real timestamps) in the state log, last-record-wins, ledger-backed. Any fix that does not extend the event schema leaves every future lane choosing between the lossy projection and the duplication.
- Their "lane self-reported timing should not be cited" — reproduced in this lane: it1 −120 s-class, it2 +329 s, it3 stamped at gateway time (the fix, F6/iteration-003). The receipts remain the only trusted clock.
- Their attribution-unknown ×3 (f-302): the manifests are provenance-free while the runner holds provenance at dispatch; the fix is a copy, not a redesign.

## 11. Adoption path (reordered)

1. **#0 — the 8th provision** (`DEFAULT_SHARED_PATHS` += `.opencode/node_modules`): one symlink; −101 M, −5,454 inodes, −the-install-seconds, every lane kind; precondition = the 14-site entry-point-guard audit (the symlink wave's own open fork).
2. **#1 — the skip-primary closure cone**: registered worktree, `read-tree HEAD`, ~80,244 skip bits, checkout the 2,328–4,195-file closure; 98.5% of tracked materialization, 92% all-in; zero shared repo state; detector-compatible by construction. Their porcelain #1 survives as this variant's DX, priced with its shared-state cost.
3. **#2 — clonefile on top** (SWE-2's, rescued): extents for the remaining ~29 M→~0 on APFS; the ADR-002 baseline-restore guarantees verified in code [write-containment.ts:694-737].
4. Measure #0–#2 on the production repo, per the packet's own verification precedent; their "leave the default off until the sparse cone's measured cost is known" is retained, with the stub-executor protocol as the instrument and the nine-item ledger (§12) as its specification.

## 12. Open Questions (the consolidated unmeasured ledger)

1. The 22.2 s leg weights (L1–L7) — needs instrumentation; none exists.
2. Teardown: release + forced remove + prune over ~1.7 G and ~88,000+ unlinks.
3. The dependency bootstrap: which process produces the 101 M/5,454-entry `.opencode/node_modules` (executor plugin loader vs launch wrapper), and its seconds.
4. The skip-primary's one-time cost: read-tree + ~80,244 skip-bit writes.
5. The clonefile's foreign-stat first-status; its 1–4 s claim; WHICH ignored-tree flavor.
6. The 29-worktree production interference of the sparse flip.
7. Mid-run relocation: the three frozen-absolute surfaces vs one `worktree move`.
8. The version gate's actual floor ("older git refuses" — unpinned; 2.50.1 (Apple Git-155) verified here).
9. The 14-site entry-point-guard audit (their open fork; now #0's precondition too).
10. Who closes the attribution gap: manifest provenance (the runner already holds it).

## 13. Limitations

All numbers are point-in-time 2026-06:26–06:55Z, single-worktree, read-only; the tracked tree moved +196 files between the prior lanes' measurement and this one, so every ratio here is stamped. Timing that required writing outside this lineage (worktree add, read-tree, clonefile, teardown) was deliberately not taken — the packet's stub-executor protocol owns those writes; the corresponding prior claims ("1–4 s", "falls with the cone") remain estimates. The attribution-mechanism claim (f-302) is inference from structure; the it2→it3 reconciliation (f-303) means the it2 delta's 21.5 M/11.4×/93%+ figures are superseded, not secret — the deltas are write-once by contract, and the registry carries the correction. The state log of this lane was rebuilt once, mid-loop, to the 7-record compact form after the pretty-JSON direct-append of it3 malformed the projection tail (documented in What Failed; VERIFY_EXIT=0 ×3 after the repair).

## 14. References

All evidence is repository-, packet-, or measurement-sourced; no web sources were used. [SOURCE: worktree-lifecycle.ts:141-183,545-779,514-593] · [SOURCE: fanout-run.cjs:2800-2854,2926,514-519,2812-2815,2882,3132,3155-3157,3476-3569] · [SOURCE: write-containment.ts:689-780] · [SOURCE: verify-iteration.cjs:7-18,128-142,196-320] · [SOURCE: implementation-summary.md:98-110,Verification] · [SOURCE: research/alternatives/synthesis.md:21-64] · [SOURCE: research/worktree-symlinks/synthesis.md:95-112,160-166] · [SOURCE: decision-record.md:234-320 (ADR-003)] · [SOURCE: prior lanes: research/lineages/1789363775244-64o2qi-{deepseek,luna,swe2}/] · [SOURCE: this worktree, read-only: `git ls-files|ls-tree|count-objects|worktree list|config|status`, `du`, `readlink`, cold/warm status timing, 06:28–06:48Z] · [SOURCE: this lane's own runner-state: .fanout-worktree.lock, .git pointer, locks-and-fencing-v1/{coordinator-state,grant-journal}, .legacy-projection-watermarks/research-state.json, invocation-metadata.json, luna/publish-manifest.json, research/fanout-attribution.md, orchestration-summary.json]

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5 (q1 structural-only; its weights carried forward)
- Remaining questions: 10 consolidated, enumerated in §12
- Last 3 iteration summaries: run 1: cost decomposition (ratio 1.0); run 2: mechanism challenge — granularity, shared state, clonefile gaps (ratio 0.85); run 3: relocation pins, the unmeasured ledger, the reordered adoption (ratio 0.75)
- Convergence threshold: 0.05 (mode: off — telemetry only; the loop ran to the cap by policy)
- Divergence summary: no divergent pivots recorded (convergenceMode=off)
