---
iteration: 1
focus: "correctness — the packet-log lock after the workspace-root rewiring"
dimensions: [correctness, traceability]
started_at: "2026-09-11T12:35:00Z"
status: complete
---

# Iteration 001 — correctness: the packet-log lock after the workspace-root rewiring

## Scope

Third pass. Pass 2 (`lineages/deepseek-review-2`) reported F101: the per-packet log lock was taken in the *session's* state directory, so two sessions that keep their records in different places never contended and silently lost rows. Phase 008 answers with a real-path lock name under the workspace's own state root (`../008-hardening-research/implementation-summary.md:57`, decision row `:93`). This iteration re-derives the mechanism from the current code and reproduces it end to end, then asks what the new root writes outside the session's state directory.

Surfaces read: `.opencode/hooks/goal/lib/goal-core.cjs` (lock name, lock root, state-dir resolution, the append), `.opencode/hooks/goal/README.md` (the lock and override claims), `.opencode/hooks/goal/bin/goal.cjs` (the CLI path). Fixtures live under this lineage's `scratch/`; state is redirected with `OPENCODE_GOAL_STATE_DIR`, so no repository state was touched.

## Findings

### F301 — P2 — The packet-log lock's root escapes the documented state-dir override, so an isolated probe still creates directories in the repository's real `.state/goal/` tree

**Dimension**: correctness | **Bears on**: ADR-004 (a log append is serialized) and the README's two claims about the override and the lock root | **Carry-over**: consequence of the phase-008 fix for pass-2 F101

**Evidence** (read at the cited lines):

- `appendPacketLog` takes the packet lock under `packetLockRoot(root)`, where `root` is the workspace: `.opencode/hooks/goal/lib/goal-core.cjs:1070` — `withFileLocks(packetLockRoot(root), [packetLockName(packet.packetRealPath)], ...)`.
- `packetLockRoot` is the workspace's *default* state subdirectory, not the resolved session state directory: `.opencode/hooks/goal/lib/goal-core.cjs:902-904` — `return join(workspace, STATE_SUBDIR)` with `STATE_SUBDIR = '.opencode/skills/.state/goal'` (`:45`).
- `acquireFileLock` creates that directory tree on every acquisition: `.opencode/hooks/goal/lib/goal-core.cjs:540-543` — `mkdirSync(lockRoot, { recursive: true, mode: 0o700 })`.
- The README documents the override as the isolation device — `.opencode/hooks/goal/README.md:130` — "Override the state root (tests and isolated probes use this to avoid touching the real `.state/goal/` tree)" — while the state row at `.opencode/hooks/goal/README.md:143` correctly says packet-log locks live under the workspace's default state root. The two rows now disagree about the same command.

**Reproduction** (shipped CLI, fixture workspace with its own `.git` marker under this lineage's `scratch/`, `OPENCODE_GOAL_STATE_DIR` pointing at `scratch/state-a` and `scratch/state-b`):

- 40 concurrent `log` invocations from two sessions with *divergent* override directories: `ok=40/40 xRows=20/20 yRows=20/20`. The lock now contends across overrides, so the pass-2 F101 loss is gone.
- 20 concurrent invocations where one session's workspace is a symlink to the other's tree: `ok=20/20 pRows=10/10 qRows=10/10`. The real-path key makes an alias and its target contend.
- `LOCK_TREE_UNDER_WORKSPACE=true`: with both overrides pointing elsewhere, `<workspace>/.opencode/skills/.state/goal/.locks/` was created anyway. The lock directory itself is removed on release (`.opencode/hooks/goal/lib/goal-core.cjs:578-582`); the created `.locks/` directory remains.

**Impact**: a test or probe that relies on the documented override to leave the repository state tree untouched now leaves an empty `.locks/` directory inside it. The path is gitignored (`.gitignore:108`), so nothing is committed, and the serialization requirement is the reason the root moved — the defect is the stale half of the README pair, not the lock design. P2.

**Recommendation**: state the precondition in the override row (`:130`) — "the packet-log lock root always follows the workspace, so a probe against a real workspace still creates `<workspace>/.opencode/skills/.state/goal/.locks/` and should pass a fixture workspace when that matters". Report only; no fix in this review.

## Ruled out

- Two sessions with divergent state directories losing a packet-log row (pass-2 F101): **fixed and re-verified**. 40 of 40 rows landed; the lock name is keyed on the packet's real path (`.opencode/hooks/goal/lib/goal-core.cjs:898-900`) and the lock root no longer follows `resolveStateDir` (`:151-162`).
- An alias workspace and the real workspace missing each other's lock: ruled out. `resolvePacketDir` realpaths (`goal-slice.cjs:188-200`), so both callers hash the same path.
- Lock deadlock between the scope lock and the packet lock: ruled out by reading; `withScopeMutation` and `appendPacketLog` each acquire exactly one lock set and never nest (`.opencode/hooks/goal/lib/goal-core.cjs:600-606`, `:1070`).
- Lock reaping turning a live writer loose: not observed. `LOCK_STALE_MS` is 120 s against a read-modify-write that completes in milliseconds (`.opencode/hooks/goal/lib/goal-core.cjs:56-58`).
- The append changing the durable slice: ruled out. It re-hashes after the row insert and refuses the write on any change (`.opencode/hooks/goal/lib/goal-core.cjs:1096-1098`); the fixture's frontmatter and directive survived 60 appends intact.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | correctness, traceability |
| Files reviewed | `goal-core.cjs:43-61,135-162,540-583,887-910,1054-1101`, `goal-slice.cjs:178-203`, `bin/goal.cjs:196-204`, `README.md:60,130,143` |
| New findings | 1 (P2) |
| Reproduction fidelity | end-to-end through the shipped CLI; fixture workspace, aliases and both state dirs under this lineage's `scratch/` |
| Prior-lineage closure verified | pass-2 F101 (fixed) |

Review verdict: PASS
