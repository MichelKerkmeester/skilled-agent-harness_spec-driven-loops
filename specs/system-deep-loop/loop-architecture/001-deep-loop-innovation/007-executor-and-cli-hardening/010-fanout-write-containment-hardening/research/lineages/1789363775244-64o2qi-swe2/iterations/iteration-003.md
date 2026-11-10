---
title: "Iteration 3: Single-checkout mechanisms, the churn detector, relocation matrix, and verdict"
trigger_phrases: []
---
# Iteration 3: Single-checkout mechanisms, the churn detector, relocation matrix, and verdict

## Focus

The remaining question: can one shared checkout carry *exact* attribution without a per-lane tree — via write redirection, OS-level write denial, or per-process observation? Then: the churn detector's role under each candidate, the `git worktree move`/relocation matrix, and the ranked verdict.

## Actions Taken

- Read the executor sandbox mapping — which `sandboxMode` values reach real OS confinement versus post-hoc containment [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:103-124].
- Read the churn detector's shipped implementation against its specification [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1593-1631; specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:121,174].
- Read the checkout-watch path for isolated lanes whose spawn cwd stays in the shared checkout [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3611-3624,3880-3918].
- Read the decision record's rejected alternatives to avoid re-litigating scored options [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:182,276,495].

## Findings

### Single-checkout mechanisms

1. **Per-lane write *redirection* on one checkout reduces to the mechanisms already ruled out.** Transparent remapping of a lane's writes needs mount namespaces (Linux `unshare -m` + bind/overlay) or a FUSE layer. macOS has no mount namespaces and macFUSE requires a kernel extension; on Linux the only write-redirecting mount is overlayfs — which Iteration 2 showed fails attribution over a live lower. A redirector that shunts only out-of-scope writes into a scratch area makes those writes *invisible* to `git status` — worse observability than the failure it prevents. And `GIT_INDEX_FILE`-per-lane over shared bytes gives a private index over shared bytes: a foreign write still lands in the lane's diff. There is no redirect primitive that is both cheap and attribution-preserving on this host. Ruled out.

2. **OS-level write denial is the one single-checkout option that works — and it changes the question.** Wrapping the lane spawn in a seatbelt profile (macOS `sandbox-exec`) or Landlock (Linux) that permits writes only to the lineage directory plus the executor's known legitimate dirs makes out-of-scope writes impossible — EPERM at the syscall, ~0 setup, ~0 disk, reads fully shared. Attribution becomes vacuously exact: there is no successful out-of-scope write to attribute. What it buys in certainty it pays in semantics: a lane whose executor writes outside the allowlist *fails* rather than producing a contained finding, and a denied write leaves no bytes to quarantine — the forensic record of "what the lane tried to write" disappears. The allowlist is enumerable from machinery the runner already owns (per-kind `stateDir`, `resolvedClaudeConfigDir`, the dispatch-env allowlist) [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3466-3495,3478-3480]. Today only `cli-codex` and `cli-cursor` map `sandboxMode` to real OS confinement; every other kind is post-hoc guard only [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:118-124] — a runner-level sandbox wrapper would be uniform across kinds and would cover `cli-opencode`, which has no sandbox flag at all [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3418-3423]. Verdict: viable and cheapest, but it is a *prevention* answer to an *attribution* question — a policy choice, strongest as a complement to a private-tree mechanism, not a replacement.

3. **Per-process write attribution (observe-by-PID) is exact but unreachable.** macOS EndpointSecurity reports the instigating process on file events — genuinely exact attribution on shared bytes — but requires an Apple entitlement and a signed system extension. `fs_usage`/DTrace need root or SIP-disabled. On Linux, fanotify permission events and eBPF `vfs_write` tracepoints carry the writer's PID — real, but privileged and platform-gated. For a Node runner spawning unprivileged CLIs, this class is ruled out on deployment grounds, not capability.

4. **Every cheaper shared-checkout idea was already scored and stays scored.** One shared worktree for the whole run: 3/10, "the misattribution problem moved one level down" [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:276]. Watch-and-remedy in the shared checkout: 4/10, remedy acts on bytes a concurrent session may own [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:495]. The containment module itself states the invariant: "The tree cannot say which writer made a change" [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:14-19]. Tree-diff attribution on shared bytes is structurally unsound; every carve-out in the code — `unattributableDirs`, `unattributablePaths`, foreign-run discovery — is an admission of that [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3563-3600].

### The churn detector under each mechanism

5. **The shipped detector is burst-only; the spec's cumulative arm was never built.** REQ-004 specifies "twelve newly-dirty tracked paths within one heartbeat window, *or forty cumulative for the lane*" [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:121]. The implementation compares each sample to the previous one and fires only on a per-window burst; there is no cumulative counter [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1611-1624]. A slow neighbour dripping ≤threshold newly-dirty paths per heartbeat never latches preserve — the "slower neighbour that never spikes" case section 7 explicitly motivates [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:174]. Separately, the shipped schema default is 3, not the specified 12 [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:701]. This matters more for the cheap options: in a private lane tree the detector is only a lane-activity tripwire (foreign writers cannot reach the tree), but on the shared-checkout fallback — and under any single-checkout mechanism — it is the *only* foreign-writer signal, and it currently misses the drip.

6. **Under clonefile/sparse lanes the detector's semantics *improve*.** Foreign writers cannot enter a private tree, so a churn burst inside a cloned or coned lane is unambiguously the lane's own out-of-scope churn — a cleaner signal than today's, where the same code path doubles as both foreign-writer detection (shared checkout) and lane tripwire (isolated lane) [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3626-3653]. Under write-denial the detector becomes purely environmental: any observed churn is foreign by construction.

### Relocation matrix

7. **`git worktree move` survives every registered-worktree variant; shared-checkout options have nothing to move.** Move rewrites registration and the `.git` pointer, not link text — so absolute dependency links pointing *at the unmoved main checkout* survive, and the relative self-links were made relative for exactly this reason [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:466-471]. Sparse cones move (cone metadata lives in the worktree gitdir); clonefile trees move with CoW sharing preserved on the same volume. What breaks identically across all worktree variants is moving the *enclosing* main checkout — registrations hold absolute gitdir paths — a shared constraint, not a differentiator. The reclaim sweep, lease, and publish machinery are registration-keyed and unchanged in every variant.

### Verdict

8. **Recommended order:** (a) `git worktree add --no-checkout` + `cp -Rc` clonefile materialization including the dependency roots — ~1–4 s setup, ~0 disk, exact attribution, frozen lane baseline, dep-root write-escape closed, self-link and entry-guard hazards dissolved, seed step eliminated; (b) sparse-cone worktree as the portable fallback — cone ≈ 3% of tree, keeps links+seed, binds the read surface; (c) seatbelt-style write denial as an optional complement on the shared-checkout/degraded path — prevention plus the churn detector as the environmental signal. Linux ports via `cp --reflink` (btrfs/xfs); elsewhere degrade to today's full checkout.

9. **Scale makes the cost decisive.** Fan-out concurrency caps at 8 lanes and 256 expanded lineages [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:635,685]. At the measured cost, 8 concurrent lanes peak at ~12.8 GB of checkout and a 256-lineage run serializes roughly 94 minutes of provisioning; under clonefile both collapse to registration overhead plus write deltas.

## Questions Answered

- Can one checkout carry exact attribution? Only by changing the question: OS write *denial* (prevention) or kernel *observation-by-PID* (privileged). Tree-diff attribution on shared bytes is structurally unsound by the module's own admission.
- Does the churn detector survive? It survives everywhere; it strengthens inside private trees, is load-bearing on shared-checkout paths, and has a shipped gap — no cumulative arm, default 3 vs specified 12.
- Does relocation survive? `git worktree move` survives all registered variants; shared-checkout options have nothing to relocate.

## Questions Remaining

- Prototype measurement of clonefile setup time and index normalization cost on APFS (the ~1–4 s figure is reasoned, not measured).
- Whether the dep-root write-escape and the missing cumulative churn arm should be filed as their own findings against the shipped runtime.

## Ruled Out

- Per-lane write redirection on one checkout (mount namespaces/FUSE/overlay): no usable primitive on APFS; on Linux it is the overlay answer already ruled out for live-lower read-through.
- `GIT_INDEX_FILE`-per-lane over shared bytes: private index cannot hide foreign writes to shared bytes.
- Per-process write attribution (EndpointSecurity/fanotify/eBPF/DTrace): exact but privileged or entitlement-gated; unreachable for this runner.
- One shared worktree per run: already scored 3/10 — misattribution moved down a level.
- Watch-and-remedy in the shared checkout: already scored 4/10 — remedy acts on bytes a neighbour may own.

## Assessment

- `newInfoRatio`: `0.7`
- Novelty justification: Closed the single-checkout question (attribution on shared bytes requires kernel mediation — deny or observe-by-pid — both out of reach or semantics-changing), surfaced the spec-vs-implementation divergence in the churn detector (missing cumulative arm, default 3 vs 12), and produced the relocation matrix and ranked recommendation.
- Confidence: high on mechanism verdicts and the churn-detector gap (code vs spec read directly); medium on platform-portability claims for Linux (`cp --reflink` semantics are well-established but unmeasured here).

## Reflection

- Worked: separating "attribution" from "prevention" made the single-checkout options fall out cleanly — deny works but answers a different question; observe-by-pid answers it exactly but requires privileges the runner does not have.
- Worked: diffing the churn detector against REQ-004 found a concrete spec/implementation divergence, not just a design opinion.
- Failed: nothing blocking; the remaining uncertainty is empirical (clonefile timing), which is a prototype task rather than a research question.
