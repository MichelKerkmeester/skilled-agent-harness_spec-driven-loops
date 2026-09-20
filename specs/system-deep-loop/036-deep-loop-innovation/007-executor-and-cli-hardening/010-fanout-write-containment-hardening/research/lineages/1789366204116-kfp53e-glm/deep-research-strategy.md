# Deep-Research Strategy

**Topic.** Per-lineage git worktrees give fan-out lanes exact write isolation but cost roughly 1.6 GB of checkout and about 22 seconds of setup per lane, measured at six lanes. Research alternative mechanisms that preserve the same parallel fan-out and the same attribution guarantee at a fraction of that cost.

**Session.** fanout-glm-1789366204116-kfp53e | generation 1 | lineageMode new | convergenceMode off | stopPolicy max-iterations | maxIterations 3 | convergenceThreshold 0.05 (telemetry only: convergenceMode is off, so the loop runs to the cap).

## Known Context

- Prior fan-out (run 1789363775244-64o2qi, three lanes: LUNA/SWE-2/DeepSeek) synthesized `research/alternatives/synthesis.md`: adopt **sparse-cone worktrees** first, **clonefile inside a registered `--no-checkout` worktree** second (APFS only, setup unmeasured); everything else ruled out. This lineage's mandate: challenge that synthesis — find what it missed, what it got wrong, what remains unmeasured.
- Packet baseline (implementation-summary.md:98-110): 16.5 s for six lanes without worktrees vs 149.7 s with, concurrency 3; 1.6 GB checked-out files per tree; object store shared. The "~22 s/lane" derives as (149.7-16.5)/6 = 22.2 s.
- Contracts this research must respect: ADR-003 (detached ephemeral runner-owned worktree; 6 wholesale ABSOLUTE dependency/dist links; uncommitted-packet seeding; copy-back; startup sweep), ADR-004 (isolation default-on), ADR-005 (report-only checkout watch); symlink/dependency contract from `research/worktree-symlinks/synthesis.md` (self-link re-anchoring, the 14-site entry-point guard, `shared/dist` absent from provisioned paths).
- resource-map.md not present; skipping coverage gate. Folder state: spec-present (spec.md exists; pre-init spec-anchor appends are out of this lineage's write surface and therefore deferred, not skipped silently — recorded here).

## Key Questions

- [x] q1: What does the 22.2 s/lane actually consist of? — answered structurally (legs L1–L7); the leg WEIGHTS are carried forward (no instrumentation exists — f-102).
- [x] q2: Does a tighter, closure-computed cone beat the prior 62%/85% cuts? — YES: 2,328 tracked files/~21.5 M vs their 17,648/~252 M — 98.5% of the checkout, 93%+ of the true per-lane cost (f-201); the wholesale-`.opencode` cone drags 15,320 unread files.
- [x] q3: Is there a no-shared-state materialization? — YES: skip-worktree bits in the lane-private index; detector-compatible by the containment's porcelain-delta shape; dissolves the clonefile's index problem (f-202, f-206). The ~80,244 bit-writes' seconds are carried.
- [ ] q2: Does a tighter, closure-computed cone (skill subtree, not wholesale `.opencode/`) beat the prior 62%/85% cuts? What does the lane's true read set cost?
- [ ] q3: Is there a materialization mechanism with no shared repo state (no `extensions.worktreeConfig`, no `core.sparseCheckout`) — e.g. full-index partial materialization — and what does it cost the detector/containment paths?
- [ ] q4: Do the prior mechanism rulings (redirection, CoW, partial/shallow/reference) survive their own code evidence, and what did the clonefile variant miss (inodes, first-status tax, ignored trees, ctime/index)?
- [ ] q5: What does relocation actually pin (fencing, watermarks, receipts, `.git` pointer), what remains unmeasured (teardown, status tax, 28-worktree interference), and what changes in the prior adoption order?

## What Worked

- Read-only re-measurement over citation: today's tree (82,572 tracked, 1.7 G, `.opencode` 353 M, pack 2.06 GiB unchanged, 29 worktrees, sparse/worktreeConfig UNSET) adjudicates every number the prior synthesis cites — three of its counts were already stale.
- Reading the provisioning code before pricing mechanisms: the 22.2 s decomposes into 7 legs, of which the checkout cone touches exactly one.
- Measuring the tracked materialization of every candidate cone with `git ls-tree -r` (2,328 vs 17,648): granularity, not conclusion, was the prior synthesis's weakness — and the size of the miss (11.4×) was invisible without the count.
- Hunting the record for UNASSEMBLED mechanisms: skip-worktree appears 4× in the packet, always as someone's implementation detail; nobody assembled it into the primary.

## What Failed

- Gateway-only state recording: the legacy-V1 projection drops mode/focus/route-proof, so `verify-iteration.cjs` fails `route_proof_missing`. Resolved by the validator's own sanctioned path (verify-iteration.cjs:15-18,254-257): the gateway's canonical event stays in the ledger, and the SAME canonical record (real timestamps) is appended to the state log, which the validator's last-record-wins + ledger-backing gate accepts. Root cause is deeper than the prior synthesis's L1: the `deep-research.ledger.iteration-completed` event schema's data carries no mode/focus/target_agent at all, so NO projection of it can ever pass route-proof. Event record: `events/iteration-001.result.json`.
- Self-reported record timing, it2: the state-record timestamp (06:52:10Z) ran +329 s past its commitment (06:46:41Z) — the after-window anomaly class the runner flags. Fix for it3: stamp the record at gateway time. The prior lanes' far-worse drifts (deepseek +2,177 s) were the same defect, unchecked.
- The it3 direct-append wrote the event's pretty-printed (multi-line) form into the state log, malforming 55 projection lines; the gateway's own projection refreshes had meanwhile rebuilt the lossy rows, orphaning the it1/it2 direct records. One mid-loop repair (rebuilt the 7-record compact state log: the 4 gateway-authored rows + the 3 canonical records), then VERIFY_EXIT=0 ×3. Lesson: the canonical record appended to the state log must be the COMPACT single-line serialization, and the projection must be treated as jointly owned by the gateway's refresh and the sanctioned direct record.

## Exhausted Approaches

- Re-deriving the 22.2 s leg weights from the runner's own telemetry (no timing instrumentation exists).
- Attributing `.opencode/node_modules` to tracked checkout, the 7-path provisioning, or the seed (all three disproven).
- The throwaway-clone instrument for the flip-interference hazard: it cannot reproduce the 29-worktree production state it is meant to measure (f-204).

## Next Focus

Iteration 3: relocation (which surfaces actually pin paths: fencing, watermarks, the lease, the `.git` pointer, the runner's name-keyed reclaim), the consolidated unmeasured ledger, and the reordered adoption path.

## Carried-Forward Open Questions

- q1 weights: L1..L7 magnitudes (checkout vs dependency bootstrap vs statuses vs seed vs teardown) — unmeasurable from existing telemetry (zero instrumentation); needs the packet's stub-executor protocol or instrumentation.
- Where the 101 MB `.opencode/node_modules` bootstrap leg actually comes from (executor plugin loader vs launch wrapper) — provenance unresolved, 5,454 entries, created at worktree birth.
- The skip-worktree variant's one-time cost (read-tree + ~80,244 bit-writes) in seconds — unmeasured; same for the clonefile's foreign-stat first-status hash and its 1–4 s claim.

---

*Machine-owned sections (iteration metrics, convergence signals) are updated by the lineage reducer inline; the workflow reducer at the packet root is out of this lineage's write surface, so this file carries the machine-owned state for this lineage.*
