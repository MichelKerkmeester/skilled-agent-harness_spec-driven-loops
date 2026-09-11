# Deep Research Synthesis - Git Workflow Run Failures (deepseek lineage)

- Session: `fanout-deepseek-1789120563971-811hh6`
- Executor: cli-pi, model `deepseek-v4.1-flash`, reasoning max
- Topic: Every git workflow in this repository that can fail, revert, block or mislead an automated run: fan-out lineages, detached CLI children, launch-wrapper sessions and hooks with nobody at a prompt. Reproduce each in a throwaway repository, name the producer file and line, and propose the adjustment at the producer.
- Stop reason: `maxIterationsReached` (5/5; convergence was telemetry only)
- Evidence base: five iterations, each reproduced against the shipped producers in throwaway repositories under `scratch/`; no network; no write outside this lineage directory.
- Artifacts: `iterations/iteration-001..005.md`, `deltas/iter-001..005.jsonl`, `findings-registry.json`, `deep-research-state.jsonl`.

## Verdict

38 items recorded: **24 confirmed findings**, **5 ruled out**, and the rest code-confirmed behavioral notes. The failures cluster into two producer families:

1. **Hooks and git-side scripts** (`.opencode/scripts/git-hooks`, `.opencode/bin`, `.opencode/skills/sk-git/scripts`) -- 20 findings. The sharpest are the pi dispatch guard denying ordinary compound commands (bit twice in this run), the worktree reaper deleting a live session's socket dir and marker (and removing a worktree under a live detached child), the autostash orphan guard firing too early to see the orphan, and pre-commit block branches that do not name their bypass.
2. **The deep-loop runtime** (`.opencode/skills/system-deep-loop/runtime`) -- 8 findings. The sharpest are write-containment attributing any tracked out-of-lineage write to the running lineage (reverting it and failing a completed lineage), and the stall watchdog having no process-liveness input (a print-mode child that thinks silently for five minutes reads as a stall). This is the seam: git-facing producers belong to sk-git/hooks; run-supervision producers (containment, watchdog, dispatch) belong to the runtime and cannot be fixed from sk-git.

The single most dangerous pair is containment (B1) and the reaper (A2/A3): both destroy or displace state a live run depends on, both are invisible until they bite, and both have small producer-side fixes.

## Ranked adjustment plan

Full reasoning and per-item evidence are in iteration 5. Order is by bite frequency, then blast radius.

### Fix in hooks or sk-git

1. **A1 -- Pi dispatch guard denies ordinary compound commands** (`dispatch-audit.mjs:42,219-231,258`, `dispatch-preflight-lint.ts:185,248-253`): classify `-p`+`$`-expansion as ambiguous only with an executor token or command-position expansion; name the opt-out in the denial. Test: the R1.5 table in `dispatch-audit.test.mjs`.
2. **A2 -- Reaper deletes a live session's socket dir and marker** (`worktree-reaper.sh:60-70,178,190`): resolve registered worktrees from `git worktree list` before pruning state; persist the wrapper's chosen base. Test: R2.6a/c.
3. **A3 -- Reaper removes a worktree under a live detached child** (`worktree-reaper.sh:82-98`): refuse removal when any live process resolves inside. Test: R2.7.
4. **A4 -- Autostash orphan guard never sees the rebase orphan** (`lib/autostash-orphan-guard.sh:19-43`): anchor the sequencer autostash file at post-rewrite; also run the guard from post-commit and git-sync entry. Test: R2.5.
5. **A5 -- pre-commit block branches omit their bypass** (`pre-commit:416-443,295-303`): print the bypass; treat derived-file-only dirt as re-derivable. Test: R1.2/R1.3.
6. **A6 -- Machine-wide hook shadowing / installer re-point** (`install-git-hooks.sh:30-33,84-99,106-124`): `--status` provenance; harness scenario; README qualification. Test: harness.
7. **A7 -- SHAs rewritten by the diverged publish** (`git-sync.sh:246-263`): log `old=<sha> new=<sha>`. Test: R2.1.
8. **A8 -- Advisory reads the wrong cwd** (`git-rule-checks.mjs:26-28,57-83` + adapters): resolve `-C`/leading `cd` or fail open. Test: R3.2/R3.3.
9. **A9 -- Allocator no-pid lock** (`commit-id-naming.sh:83-126`): reclaim after a short grace, or write the pid atomically. Test: R5.1a.
10. **A10 -- commit-msg trailer length warning** (`commit-msg:126-129`): skip trailer lines. Test: R1.4 case B.

### Fix in the runtime, own packet

1. **B1 -- Containment fails a lineage for a same-packet tracked write by another writer** (`write-containment.ts:510-540,613-638`, `fanout-run.cjs:3048-3105`): same non-fatal advisory + patch treatment the untracked path already gets; keep cross-packet writes fatal. Test: R4.1 variant.
2. **B2 -- Stall watchdog false positive for silent-but-working children** (`fanout-run.cjs:1524-1563,2913-2919`): feed it the existing process liveness plus a CPU-time sample; annotate the event. Test: R4.2 extension.
3. **B3 -- Containment detection inherits host-global git config** (`write-containment.ts:196-210`): pass an explicit env / neutralize global excludes for detection. Test: global-ignore fixture.
4. **B4 -- Detached-child death diagnostics** (`fanout-run.cjs:3028-3036`): record exit signal plus memory context so OOM kills (`observed-failures` #8) are distinguishable from self-exit. Test: kill -9 stub child and assert the settled record.

### Environment notes (no code)

- A session must not assume repository-local git config is what runs: global `core.hooksPath` (iteration 1) and global excludes (iteration 4) both change behavior; global symlinks even sent the machine-wide hooks at the main clone while this worktree edited dead copies.
- Runs that measure the moving live branch must pin a SHA: the follower and autosync move it by design (iteration 2, observed #6).
- Observed death classes not reproducible from inside an automated run: the silent `nohup pi -p` death (detachment itself survived, R5.2) and OS memory-pressure kills. They need executor-level evidence and are recorded as unresolved rather than re-explained.

---

# Iteration records

The five iteration files follow, each under its own heading.

---

