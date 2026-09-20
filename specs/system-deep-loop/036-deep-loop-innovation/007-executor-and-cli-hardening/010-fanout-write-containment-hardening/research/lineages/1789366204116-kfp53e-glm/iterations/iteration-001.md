# Iteration 001 — Cost decomposition: what the 22.2 s and the 1.6 GB actually are

**Session.** fanout-glm-1789366204116-kfp53e | iteration 1 of 3 | convergenceMode off (telemetry only) | started 2026-09-14T06:28:46Z, gateway-recorded 06:33Z (real timestamps; no fabricated rounds).

**Mandate.** The prior three-lane synthesis (`research/alternatives/synthesis.md`) prices the baseline as "roughly 1.6 GB of checkout and about 22 s of setup" and recommends sparse-cone worktrees. Before challenging the mechanisms, decompose the cost itself: which legs exist, which are measured, which the cone can even reach.

## Focus

Cost decomposition — re-measure today's tree/object/lineage numbers read-only, and decompose the 22.2 s via `worktree-lifecycle.ts` and the runner's lane-prep path.

## Actions Taken

1. Re-measured this worktree read-only (all times 2026-09-14Z): `git ls-files | wc -l`, `du -sh` per top level, `git count-objects -v`, `git worktree list | wc -l`, `git config --list --show-origin | grep sparse`, cold/warm `git status --porcelain` timing, provisioning-link `readlink`s.
2. Read `worktree-lifecycle.ts` provisioning + create/seed/remove sections (lines 120–249, 545–779, plus constant block) and the runner's lane-prep caller (`fanout-run.cjs:2800–2854, 2695–2697, 2926`).
3. Established the provenance of the untracked 101 MB `.opencode/node_modules` (tracked? provisioned? seeded? — all three answered: no/no/no).
4. Checked the prior synthesis's factual anchors against today's tree (tracked count, `.opencode` bytes, pack size, worktree fleet, sparse-config state).

## Findings

### F1 — The baseline numbers are a moving target; the prior synthesis's are already stale

Tracked files **82,572** today vs 82,376 (alternatives synthesis) vs 82,393 (SWE-2's lane) — three counts, none flagged as drifting. `du -sh` today: **1.7 G** total worktree, of which `specs/` 1.3 G and `.opencode/` **353 M** — the synthesis's `.opencode = 216 MB` (tracked) grew by 137 MB (sk-design alone is 148 M) in the interim. The 2.06 GiB pack is stable: `size-pack: 2,163,545` KB today, exactly the synthesis's 2.06 GiB [SOURCE: `git count-objects -v` 2026-09-14T06:29Z; research/alternatives/synthesis.md:23-28]. Consequence: any adopt/reject decision that cites the packet's cost numbers must re-measure, not cite; the checkout share of the cost GREW between the prior measurement and this one.

### F2 — The 22.2 s is underived and uninstrumented

The "~22 s/lane" is (149.7−16.5)/6 = 22.2 s [SOURCE: implementation-summary.md:98-110]. `worktree-lifecycle.ts` (847 lines) contains **zero** timing instrumentation — no `hrtime`, `Date.now`, or `performance.now` calls — and the packet's verification table records only the six-lane totals [SOURCE: worktree-lifecycle.ts:1-847; implementation-summary.md:104]. Every per-leg estimate (the prior lanes' "setup time falls with the materialization ratio") rests on no measurement of any leg. The legs, from code:

| # | Leg | Mechanism + evidence | Size today | Falls with a checkout cone? |
|---|-----|----------------------|-----------|------------------------------|
| L1 | Full checkout | `git worktree add --detach <dir> HEAD` — no `--no-checkout`, no cone, no pathspec [worktree-lifecycle.ts:592-593] | 82,572 tracked files, ~1.56 G | yes — the only leg their cone shrinks |
| L2 | 7 dependency/dist links | `DEFAULT_SHARED_PATHS` = **seven** entries; wholesale `symlinkSync` or split-link; **absolute → MAIN** [worktree-lifecycle.ts:147-158,549] | 7 symlinks, ~0 bytes | no (untracked, outside any cone) |
| L3 | Ungoverned dependency leg | `.opencode/node_modules`: REAL dir, 101 MB, 5,454 entries, gitignored [`.opencode/.gitignore:1`], tracked=0, **not** in DEFAULT_SHARED_PATHS, **not** seeded (seed = packet-uncommitted paths only [fanout-run.cjs:2834-2840]), no bun/npm anywhere in the runner [grep] — created with the worktree by executor/runtime bootstrap ("a fan-out lane... resolves its own tsx, zod and better-sqlite3 from that directory" [worktree-lifecycle.ts:141-144]) | 101 MB, 5,454 entries per lane | no — invisible to the cone, the tracked ledger, and the provisioning contract |
| L4 | Detector/containment status tax | cold `git status` **1.54 s** / warm **0.10 s** [measured 06:29:31Z]; a lane pays it for the pre-dispatch dirty snapshot, the post-lane verification, and the uncommitted-path listing that feeds the seed (`parseStatusPorcelain`) [fanout-run.cjs:2834-2837] | ≥ 1.6 s/lane, ×2+ calls | partially — a cone shrinks the lstat set |
| L5 | Seed | per-file `copyFileSync`, symlink-following, **add-only** [worktree-lifecycle.ts:646-752] | ~0–2 MB today (packet mostly committed); unbounded for uncommitted-heavy states | no — seed paths are untracked, cone-external |
| L6 | Lease + heartbeats | `.fanout-worktree.lock` written at create [worktree-lifecycle.ts:617-626], TTL 180 s, owner pid 32871, heartbeat live at 06:29:31Z | 370 B, periodic | no |
| L7 | Teardown | release-lease → `worktree remove` (force) → `worktree prune` [worktree-lifecycle.ts:772-843; fanout-run.cjs:2926] — 82,572 + 5,454 + lineage unlinks, ~1.7 G walked | ~1.7 G, seconds (unmeasured) | no number exists at all |

### F3 — The provisioning contract is seven, not six — the prior synthesis is stale

`DEFAULT_SHARED_PATHS` carries **seven** entries, including `.opencode/skills/system-spec-kit/shared/dist`, whose code comment explains it was added because `shared`'s export map resolves onto compiled output [SOURCE: worktree-lifecycle.ts:147-158]. The symlink wave's synthesis lists six provisioned paths and states "shared/dist is absent from this list" [SOURCE: research/worktree-symlinks/synthesis.md:95-107]; the alternatives synthesis then says "the six shared dependency roots" [SOURCE: research/alternatives/synthesis.md:53]. Today's code has already closed the gap the earlier wave named as its open fork's precondition. Any cone design keyed to the six-path contract misprovisions the seventh.

### F4 — The redirector ruling's precise mechanism

The runner strips twelve `GIT_*` env redirectors (GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_OBJECT_DIRECTORY, ...) before every git call [SOURCE: worktree-lifecycle.ts:161-183]. This is the code-level reason single-checkout redirection loses: a redirection design adds exactly the class of environment indirection the runner deletes by construction. The prior ruling ("the runner's own `git -C` calls strip the redirectors") is correct in effect; the mechanism is GIT_*-env stripping, not `-C` semantics.

### F5 — Two tracked relative self-links, and a contradiction between the packet's own syntheses

`.opencode/specs → ../specs` and `.opencode/manual-testing-playbook → skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` are tracked, relative, lane-internal — they resolve inside any worktree, any cone, any relocation [SOURCE: `ls -la .opencode` 06:32:57Z]. But the provisioning links are **absolute → MAIN** (readlink: `dist`/`node_modules` = 111–119-char absolute paths into `/Users/.../Public/...`). The alternatives synthesis justifies relocation-safety with "those links are relative" [SOURCE: research/alternatives/synthesis.md:53]; the symlink wave's reproduced evidence says "Both link routines create absolute, wholesale links today" [SOURCE: research/worktree-symlinks/synthesis.md:110]. LOGIC-SYNC: the newer synthesis cites the opposite link shape. The conclusion (relocation survives) is right, the justification is wrong — absolute→MAIN links survive a *lane* move because MAIN never moves; it is the (today: none) *lane-internal* absolute links that would dangle.

### F6 — Shared-store maintenance is observable from a lane

`git count-objects -v` reports garbage: a leftover `tmp_pack_M7QGyh` in MAIN's objects and this worktree's own `refs/` dir [SOURCE: 06:29:31Z]. Evidence the shared store runs (interrupted) maintenance while 29 lanes exist — context for the later worktreeConfig-flip interference question.

### F7 — Fleet denominator: 29 worktrees today

`git worktree list | wc -l` = 29 (prior: 27 in the symlink wave, 28 in ADR-003's verification, "30" in the alternatives synthesis). The flip-interference blast radius quoted in the prior synthesis is already stale in both directions.

### F8 — `extensions.worktreeConfig` unset — verified today

`git config --list --show-origin | grep -iE "sparse|worktreeconfig"` → UNSET [SOURCE: 06:29:31Z]. The prior synthesis's "it is unset today" holds; its hazard (every existing worktree inherits the extension) therefore applies to 29 trees, not 30.

## Questions Answered

- q1, structural half: the 22.2 s = checkout (L1, 82,572 tracked) + links (L2) + ungoverned dependency bootstrap (L3, 101 MB) + ≥2 cold/warm statuses (L4) + seed (L5) + lease (L6) + teardown (L7, unmeasured). **The weights are unmeasurable from existing telemetry** — no instrumentation exists (F2). Carried forward.

## Questions Remaining

- q1 weight split (checkout vs dependency bootstrap vs statuses vs teardown) — blocked on instrumentation or a stub-protocol measurement; the packet's "unmeasured" list gains: the status tax, the dependency leg, teardown, and the 82,572-count drift.
- q2, q3, q4, q5: iterations 2–3.

## What Was Tried and Failed (ruled out)

- Re-deriving leg weights from the runner's own telemetry — ruled out: `worktree-lifecycle.ts` has no timing calls; `fanout-run.cjs` records no per-leg durations; the verification table records totals only [SOURCE: worktree-lifecycle.ts:1-847; implementation-summary.md:98-110].
- Attributing `.opencode/node_modules` to tracked checkout, the 7-path provisioning, or the seed — ruled out each: tracked=0 (`git ls-files`), provision list lacks it (`DEFAULT_SHARED_PATHS`), seed list = packet-uncommitted only (`fanout-run.cjs:2834-2840`).

## SCOPE VIOLATIONS

None. All actions read-only (`git` reads, `du`, `ls`, `readlink`, `find`, `grep`, file reads); the only writes were this lineage's own artifacts and the gateway's.

## Next Focus

Iteration 2 — challenge the mechanism rulings: what the 62%/85% cuts actually govern (tracked-only), whether a no-shared-state materialization (full-index partial materialization) escapes the repository-wide `extensions.worktreeConfig` flip, and what the clonefile variant misses (index/ctime, ignored trees, inodes, first-status).
