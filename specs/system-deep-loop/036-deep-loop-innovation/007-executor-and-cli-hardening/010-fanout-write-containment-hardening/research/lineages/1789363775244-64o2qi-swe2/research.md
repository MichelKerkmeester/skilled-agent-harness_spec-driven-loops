---
title: "Lower-cost fan-out lane isolation than per-lineage worktrees — detached research synthesis"
trigger_phrases: []
---
# Lower-cost fan-out lane isolation — detached research synthesis

**Lineage:** `swe2`
**Session:** `fanout-swe2-1789363775244-64o2qi`
**Loop:** `research`, 3 iterations, `max-iterations`, convergence `off`
**Artifact root:** `/Users/michelkerkmeester/worktrees/public/fanout-1789363775244-64o2qi-attempt-1-swe2/specs/system-deep-loop/045-fanout-write-containment-hardening/research/lineages/swe2`
**Stop reason:** `maxIterationsReached`

## 1. Executive Summary

The measured per-lane cost — 1.6 GB of checkout and ~22 s of setup (six lanes at concurrency 3: 149.7 s with worktrees vs 16.5 s without) [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106] — is almost entirely **working-tree materialization**: `git worktree add --detach … HEAD` writes all 82,393 tracked files and builds the lane index. The object store was never the cost — a linked worktree already shares it (this lane's `.git` entry is a 4 KB pointer). Every alternative must therefore be judged on how it materializes *bytes and index*, not objects.

The strongest mechanism found is **`git worktree add --no-checkout` + APFS `cp -Rc` clonefile materialization**: registration (~tens of ms) keeps the per-lane index that makes `git status` attribution exact, and copy-on-write cloning delivers the full working tree in ~1–4 s at ~0 disk, growing only by lane writes. It additionally *strengthens* isolation: the lane's baseline is frozen against concurrent main-checkout writes, the packet seed becomes redundant, and cloning the dependency roots dissolves both the workspace self-link re-anchoring defect and the compiled entry-point guard no-op.

The portable fallback is a **sparse-cone worktree**: a cone covering the packet + runtime + root docs is ~52 MB (~3% of the tree), keeps every lifecycle semantic, and binds only the lane's read surface.

On a **single shared checkout**, exact attribution is structurally unavailable: the guard is a tree diff and "the tree cannot say which writer made a change" [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:14-19]. The only shared-byte options are OS write *denial* (seatbelt/Landlock — cheap, exact by prevention, but turns escapes into lane failures and loses the forensic record) and *observe-by-PID* (EndpointSecurity/fanotify/eBPF — exact but privileged/entitlement-gated). Both change or exceed the question; neither is a drop-in.

## 2. The cost ledger

| Phase | Mechanism | Cost |
|---|---|---|
| Tree materialization + index | `git worktree add --detach … HEAD` [worktree-lifecycle.ts:592-593] | **dominant** — ~22 s, 1.6 GB |
| Dependency roots | 7 `DEFAULT_SHARED_PATHS` split-linked with self-link rewrite [worktree-lifecycle.ts:147-158,407-509] | bounded metadata pass, sub-second |
| Packet seed | working-tree bytes of uncommitted paths [worktree-lifecycle.ts:707-752; fanout-run.cjs:2763-2791] | KB-scale |
| Lease | one file, written last [worktree-lifecycle.ts:617-628] | negligible |
| Publish/teardown | stage+rename in main checkout, `worktree remove --force`, prune [worktree-publish.ts; worktree-lifecycle.ts:808-847] | proportional to lane output |
| Startup sweep | prefix lease + liveness proof + resumable exclusions [worktree-reclaim.ts] | per-run, not per-lane |

Tree composition (measured on this checkout): `specs/` = 1.3 GB and 64,280 of 82,393 tracked files (78%); the packet = 872 KB; the runtime skill trees ≈ 51 MB. A lane reads orders of magnitude less than it is given.

## 3. Mechanism comparison

| Mechanism | Setup | Disk | Attribution exact? | What breaks | `worktree move` |
|---|---|---|---|---|---|
| Full worktree (today) | ~22 s | 1.6 GB | Yes — private index + tree | — (baseline) | Yes |
| Sparse-cone worktree | ~cone fraction (≲5 s at ~52 MB) | cone + output | Yes — private index; out-of-cone writes still surface as untracked | Lane reads outside cone find nothing → bind read surface or add `git show` fallback; dep links/seed unchanged | Yes (cone metadata in worktree gitdir) |
| `--no-checkout` + selective restore | cone-like, finer grain | chosen paths only | Yes | Same read-surface constraint; needs materialization list | Yes |
| `--no-checkout` + APFS clonefile | **~1–4 s (est.)** | **~0 + write deltas** | Yes — and baseline frozen vs foreign writes | `.git` pointer and `.worktrees/` base must be excluded from the clone; index normalization needed (skip bits or index seed); APFS-specific (Linux: `cp --reflink`) | Yes; same-volume keeps CoW |
| Shallow/reference/partial clone | ≥ full materialization | ≥ full tree + own index | Yes but — | Loses worktree registration (remove/prune/move/lease/sweep); alternates liveness coupling | N/A — not a worktree |
| Overlayfs over live checkout | ~ms | deltas | **No** — live lower leaks foreign writes into the lane diff | Attribution itself; macOS lacks overlayfs | N/A |
| Sandboxed dir, no registration | cheap | copies/links | **No** — no per-lane index for `git status` | The entire guard mechanism | N/A |
| Shared checkout + write denial (seatbelt/Landlock) | ~0 | 0 | Vacuously exact (prevention) | Executor writes outside the allowlist become lane failures; no bytes to quarantine; only codex/cursor map sandboxMode to OS confinement today [executor-config.ts:118-124] | N/A |
| Shared checkout + observe-by-PID | ~0 | 0 | Yes (kernel) | EndpointSecurity needs Apple entitlement; eBPF/fanotify need privileges; unreachable for this runner | N/A |
| One shared worktree per run | one setup | 1.6 GB once | **No** — siblings share the tree | The misattribution problem moved down a level [decision-record.md:276] | Yes |

## 4. Breakage surfaces

- **Symlinked dependency roots.** Under links (today, and under sparse cones) a lane writing *through* a dep root mutates the shared install while `git status` sees only unchanged link text — invisible to the lane guard and to the gitignored-root checkout watch: a **write-escape channel in the shipped design** [worktree-lifecycle.ts:520-557; write-containment.ts:1-29]. Under full clonefile the roots are lane-local CoW copies — escape closed, and lane `npm install` writes stay in the lane.
- **Workspace self-links.** Linking reproduces the silent-provenance defect (relative link re-anchors into the main checkout) [research/worktree-symlinks/synthesis.md]; the split-link rewrite is the existing fix. A full clone dissolves it entirely — the link and its target are both inside the lane, so relative text resolves to lane-local CoW-identical bytes.
- **Compiled entry-point guards.** `path.resolve(argv[1])` vs `fileURLToPath(import.meta.url)` diverge through a symlinked `dist` and the CLI exits 0 without running [research/worktree-symlinks/synthesis.md]. Under a full clone both resolve inside the lane's real files — the hazard cannot occur.
- **Churn detector.** Runs unchanged under every private-tree variant, and *improves*: a burst inside a private tree is unambiguously the lane (no foreign writer can exist there). On shared-checkout paths it is the only foreign-writer signal — and it is **shipped burst-only**: REQ-004 specifies 12 newly-dirty per window *or* 40 cumulative [spec.md:121,174]; the implementation has a single per-window threshold defaulting to 3 [fanout-run.cjs:1611-1624; executor-config.ts:701]. A slow drip never latches preserve.
- **Relocation.** `git worktree move` survives all registered variants; absolute dep links target the unmoved main checkout; relative self-links were engineered for this [worktree-lifecycle.ts:466-471]. Moving the *enclosing* checkout breaks all registrations equally — a shared constraint. Publish staging already requires same-filesystem rename [worktree-publish.ts].

## 5. Recommendation

1. **Adopt `git worktree add --no-checkout` + `cp -Rc` clonefile materialization (including the dependency roots)** where the filesystem supports CoW — this host is APFS. Keep registration, lease, publish, reclaim, and move semantics unchanged. Exclude `.git` and the worktree base from the clone; normalize the lane index (clear skip-worktree bits or seed the private index); skip the packet seed. Prototype-measure setup; expected ~1–4 s and ~0 disk per lane. Linux port: `cp --reflink` on btrfs/xfs; degrade to today's checkout elsewhere.
2. **Keep a sparse-cone worktree as the portable low-cost variant** for lanes whose read surface is enumerable; keep split-link provisioning and seeding there.
3. **Treat seatbelt-style write denial as an optional complement** on degraded/shared-checkout paths, not a replacement: it prevents rather than attributes, and pairs with the churn detector as the environmental signal.
4. **Two latent defects worth filing independently of this decision:** the dependency-root write-escape through shared symlinks, and the churn detector's missing cumulative arm plus default 3 vs the specified 12.

## 6. Scope and boundary

This detached lineage wrote only under its bound artifact root. It did not modify the parent spec packet, `.opencode/skills`, continuity/memory state, shared telemetry, or git state. `resolveArtifactRoot` was skipped; `artifact_dir` was bound directly from `config.fanout_lineage_artifact_dir`. Every iteration was executed inline by this session's executor — no nested CLI, agent, or subprocess was dispatched.

## 7. Evidence index

- Runtime: `worktree-lifecycle.ts` (create/link/seed/remove), `worktree-paths.ts` (per-kind levers), `worktree-lease.ts`, `worktree-publish.ts`, `worktree-reclaim.ts`, `write-containment.ts` (detection contract), `executor-config.ts` (sandbox map, concurrency caps, churn default), `fanout-run.cjs` (provisioning, churn sampler, checkout watch, containment call).
- Packet: `implementation-summary.md` (measured costs), `decision-record.md` (scored alternatives, flip rationale), `spec.md` (incident, REQ-004, §7), `tasks.md` (CHK-112/113), `research/worktree-symlinks/synthesis.md` (self-links, entry guards, relocation), `research/open-questions/synthesis.md` (liveness, publish ordering).
- Host: APFS filesystem; this lane tree measured at 1.6 GB with `specs/` = 1.3 GB; `.git` = 4 KB worktree pointer; 82,393 tracked files.
