# Iteration 003 — Relocation pins, the consolidated unmeasured ledger, and the reordered adoption

**Session.** fanout-glm-1789366204116-kfp53e | iteration 3 of 3 (cap) | recorded at gateway time (see F6).

## Focus

Which surfaces actually pin paths (relocation), what remains unmeasured (the consolidated ledger), and what changes in the prior adoption order.

## Actions Taken

1. Read the runner's worktree-identity and sweep contracts (`fanout-run.cjs:514-519, 2687-2701, 2799-2815, 2882, 3132, 3155-3157`) and the absence of provenance in the publish manifests (compared against the prior lanes' attribution outcomes).
2. Measured the family comparator their "546 MB" rests on: `specs/system-deep-loop` = 357 M, 12,255 tracked files; `git --version` = 2.50.1 (Apple Git-155).
3. Reconciled iterations 1–2 against the registry (three it2 numbers corrected — F3).

## Findings

### F1 — "Relocation survives" is a GIT-layer truth; the runner's relationship to the worktree is name-and-base, not registration

The prior synthesis's mechanism table answers "relocation survives: yes" for every registered-worktree variant. Verified layer by layer:

| Layer | Pins paths? | Evidence |
|---|---|---|
| Git registration | yes, but `worktree move` rewrites both `.git` directions | `.git` = `gitdir: /Users/.../Public/.git/worktrees/fanout-...-attempt-1-glm` [06:29:31Z] |
| Fencing/authority (locks-and-fencing-v1) | **no** — hashes, fence tokens, timestamps, resourceKeys only | coordinator-state.json + grant-journal.jsonl [read 06:27Z] |
| Ledger receipts + projection watermark | **no** — event ids, digests, sequences; the watermark carries ledger_sequence/record hashes, zero paths | `.legacy-projection-watermarks/research-state.json` [06:27:41Z] |
| The lease | **no** — owner_pid, packet_id, dirname-shaped `runtime_kind`, nonce | `.fanout-worktree.lock` [06:29:31Z] |
| Provisioned links (7) | MAIN-anchored; MAIN never moves → they survive a lane move | readlink: 111–119-char absolute→MAIN [06:28:46Z] |
| **The runner's discovery/keep/reclaim** | **base + prefix + name** — "the prefix is what lets a sweep tell the trees this runner made from any other directory" (:514-515); the sweep runs over the worktree base before dispatch (:3155-3157); "a later sweep" reads the deliberate-keep marker the tree carries (:2882) | a worktree moved OUT of the base becomes invisible: never reclaimed, never counted, its keep-marker orphaned with it |
| The dispatch-time bindings | frozen absolute paths: the prompt pack, the executor's cwd, the runner's cached `worktreeDir` (:2830) | this lane's own invocation; nobody re-resolves mid-run |

So: relocation survives **between attempts** (nothing holds the old path: the fencing, watermark, lease, and link layers are path-free — measured) and is **untested mid-run**, where the prompt's promised paths, the process cwd, and the runner's cached dir all go stale simultaneously. Neither the prior synthesis nor ADR-003's risk table (which covers dispatch-time path resolution) covers the mid-run case. **[SOURCE: fanout-run.cjs:514-515,2812-2815,2830,2882,3132,3155-3157; measured fencing/watermark/lease 06:27-06:29Z; alternatives/synthesis.md:36-45]

### F2 — Provenance: three lanes published, the attribution table says "unknown" three times

`research/fanout-attribution.md` records kind/model "unknown" and verdict "n/a" for all three prior lanes — yet luna's state records and config both carry full executor blocks, and every lane's invocation-metadata.json carries the effectiveConfig. What the publish manifests carry: `source_dir`, `published_at`, and a byte/SHA entry list — **no executor, no model, no verdict** [SOURCE: luna publish-manifest.json, read 06:27Z]. Three receipt-less, provenance-free manifests, three "unknown" rows: consistent with a receipts/manifest-only read (the attribution writer's source was not located within this lineage's read budget — recorded as inference, would be confirmed by its source). Meanwhile the provenance exists redundantly in the lane's OWN surfaces: config.executor, invocation-metadata.effectiveConfig, and the canonical iteration records' executor block — this lane's own three. Fix: the runner should copy provenance into the manifest (it already has it in memory at dispatch). The packet's limitation-4 (lane self-reports) is unrelated; this is the RUNNER forgetting what it knew. **[SOURCE: research/fanout-attribution.md; luna/publish-manifest.json; this lineage's events/iteration-00{1,2}.json]

### F3 — The reconciliation: two of my own it2 numbers corrected

The reducer's prerogative, exercised: (a) the closure cone's tracked bytes: the it2 record's "21.5 M" was a sdl-only shortcut — the honest closure (skills/system-deep-loop 20 M + agents/commands/bin/hooks/plugins/scripts ~7 M + the packet 1.9 M + root docs) is **~29 M**, so the granularity ratios are **7.6× by files (17,648/2,328) and ~8.7× by tracked bytes (252 M/29 M)**, not the 11.4× it2 printed; (b) the all-in discount: (1,700−132)/1,700 = **92%**, not "93%+" — 132 M = 29 M closure + 101 M ungoverned bootstrap + ~2 M other-roots. The count-ratio claim (98.5% of tracked materialization) is unchanged and remains the load-bearing number: the closure cone skips 15,320 of the 17,648 wholesale-`.opencode` files, of which the family alone contributes 12,255 tracked files / 357 M that a single-packet lane never opens. Their 62% family figure, re-measured: 252+357 = 609 M against ~1,560 M tracked = 61% — their conclusion survives the drift; their 85% packet-granularity does not survive the closure. **[SOURCE: du 06:44-06:48Z; git ls-tree counts 06:44Z; deltas/iter-002.jsonl (estimates, write-once); this finding = the reconciled values]

### F4 — The consolidated unmeasured ledger (nine items; the prior synthesis had one)

1. Every leg weight of the 22.2 s (zero instrumentation — f-102).
2. **Teardown** (L7): release-lease → forced remove → prune over ~1.7 G, 82,572+5,454+lineage unlinks — not mentioned, let alone measured, by any lane or the packet.
3. The dependency bootstrap's provenance and seconds (101 M/5,454, created at worktree birth; executor-side, installer unidentified).
4. The skip-primary's one-time cost: read-tree + ~80,244 skip-bit writes.
5. The clonefile's foreign-stat first-status hash, its 1–4 s claim, and WHICH ignored-tree flavor.
6. The 29-worktree production interference of the sparse flip — their own hazard, whose prescribed instrument (a throwaway clone) cannot reproduce the 29-worktree state (f-204).
7. **Mid-run relocation behavior** — new in this lineage (F1).
8. The version-gate's "older git refuses" floor — unpinned (git 2.50.1 (Apple Git-155) verified here; the compat floor never stated).
9. The 8th provision's precondition: the 14-site entry-point-guard audit — their own open fork, now also the cheapest step's precondition. **[SOURCE: iterations 1–3 passim]

### F5 — The reordered adoption path

1. **#0 — the 8th provision** (one symlink, `DEFAULT_SHARED_PATHS` += `.opencode/node_modules`): −101 M, −5,454 inodes, −the-install-seconds, every lane, today; needs only the guard audit.
2. **#1 — the skip-primary closure cone** (registered worktree, `read-tree HEAD`, ~80,244 skip bits, checkout the 2,328–4,195-file closure): 98.5% of tracked materialization, 92% all-in, ZERO shared repo state, no version gate, no 29-tree flip, detector-compatible by the porcelain-delta construction. Their #1 (porcelain `git sparse-checkout`) survives as the ready-made DX variant of the same skip state, priced with its 2 shared config keys + 1 file + the 29-tree gate.
3. **#2 — clonefile on top** (their #2, rescued): registration + skip-state + extents for the remaining ~29 M → ~0; the ADR-002 baseline-restore guarantees verified in code.
4. Their constraint stands: leave the default off until the stub-protocol measures #0–#2 **on the production repo** — which its own verification precedent already licenses. **[SOURCE: this + prior iterations; the packet's verification table]

### F6 — Process: timestamp-at-gateway

Iterations 1–2 wrote their state records with self-reported timestamps (it2 drifted +329 s past its commitment — the after-window class). This iteration's record timestamp is derived at gateway time from the delta's first record, one source of truth, no independent copy. The lesson costs nothing and closes the packet's limitation-4 recurrence for this lane. **[SOURCE: this lane's events/iteration-00{1,2,3}.json; orchestration-summary.json:timestamp_anomalies]

## Questions Answered

- q4 (closed): the clonefile's misses are priced as far as this lineage's read-only budget allows; its ranking (second) stands, its pricing does not; the skip-primary dissolves its hardest detail.
- q5 (closed): the pins are enumerated and measured (F1); the unmeasured ledger is consolidated (F4); the adoption order is reordered (F5).

## What Was Tried and Failed (ruled out)

- Locating the attribution writer in the runner within this iteration's read budget — ruled out: the surface was not found; the mechanism is recorded as inference (F2), the effect as observation (unknown ×3).

## SCOPE VIOLATIONS

None.

## Next Focus

None — the cap (3 iterations) is reached; the loop stops with reason `maxIterationsReached` and proceeds to synthesis.
