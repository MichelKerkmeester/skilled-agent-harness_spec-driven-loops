# Iteration 2: Q2 The state store (closure), with the lifecycle clock as the bridge into Q3

## Focus

Q2 from the Research Brief: where the receipt lives (the directive-lifecycle record, a sibling folder beside Vibe's head receipts, or `.skilled/skills/.state/`), and how it stays safe under concurrent writers, with a bound and pruning. Iteration 1 left the location leaning to a sibling folder and left atomicity, the bound and pruning open. While reading the lifecycle store, its per-session epoch clock turned out to be the natural expiry signal, so this iteration also records the Q3 part that follows from it. Q0 is closed and was not rerun.

## Actions Taken

1. Read the Python helper's write, clock, cleanup, evict, evaluate and lock paths (`hooks/lib/directive-lifecycle-store.py:18-36`, `:58-87`, `:185-369`).
2. Read the TypeScript file store that spawns the helper (`hooks/lib/directive-lifecycle-file-store.ts`, all 148 lines) and the session bound and schema version in the contract (`hooks/lib/directive-lifecycle-contract.ts:6-9`).
3. Read the shared decision core and the boundary entry point (`hooks/lib/directive-lifecycle.ts:1-192`, `hooks/claude/directive-lifecycle-boundary.ts`).
4. Read Vibe's head-receipt store and its repeat rule (`hooks/vibe/prompt-advisor.mjs:60-194`).
5. Read the hook's lifecycle mapping and its directive-lifecycle call (`hooks/claude/user-prompt-submit.ts:215-383`).
6. Looked for where hosts register the boundary adapter: `grep -rln directive-lifecycle-boundary` over the runtime folders found only `.skilled/hooks/directive-lifecycle/README.md`, and a grep of `.claude/settings.json` for the session-start entry was inconclusive. See Edge Cases.

## Findings

### Q2: what the existing stores do

1. **The lifecycle record cannot carry a receipt without a helper change.** The helper validates every record field and `schemaVersion` 2 (`record()` and the contract's `DIRECTIVE_LIFECYCLE_SCHEMA_VERSION = 2`) [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:9]. `evaluate` rebuilds the candidate from five fixed keys plus the clock [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:250-256], and `write_record` copies the prior record only for those same keys [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:235-241]. A `skill` field would be dropped on the next matched turn. CONFIRMED from code. This rules out the shared record.

2. **The helper's write is atomic and locked, and that machinery is private to it.** `write_json` opens a temp file with `O_CREAT | O_EXCL | O_NOFOLLOW`, `fsync`s it, `rename`s it in the same directory and `fsync`s the directory [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:121-143]. Every operation runs under one exclusive `flock` on `.store.lock` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:353-362]. It accepts only the ops in `mutate`, and anything else raises `unknown operation` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:276-309]. CONFIRMED. A receipt cannot ride the lock without a new helper op.

3. **Each helper call is a `python3` spawn with a 750 ms cap.** `invokeAt` runs `spawnSync` with `HELPER_TIMEOUT_MS = 750` and returns `null` on any error, non-zero status or empty output [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:22] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:113-145]. CONFIRMED. Every extra helper op the receipt needs adds one process spawn to the turn.

4. **The lifecycle state is split by working directory, not just by session.** `open_state_directory` opens `directive-lifecycle/<sha256(cwd)[:12]>/` under the base [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:79-81]. CONFIRMED. A clock read from a different `cwd` returns that project's tokens, which for a new project are `initial`. Iteration 1's worry that `.skilled/skills/.state/` moves with `cwd` applies to the lifecycle store as well, so that worry does not on its own rule out the repo folder. What rules the repo folder out is that it is repo-scoped and committed-tree-adjacent, while the other two per-session stores live under the temp base. INFERRED.

5. **Vibe's head receipts show the plain-file pattern and its bound.** One `<sha256(sessionId)[:16]>.head` file per session under `<base>/<HEAD_RECEIPT_SUBDIR>`, the same base resolution as the lifecycle store [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:68-77] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:46-48]. It evicts the oldest files by `mtime` only when the target is new and the count reaches the cap [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:89-104]. It writes with a plain `writeFileSync` and swallows every error, on the grounds that a lost receipt only repeats a head [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:105-108]. CONFIRMED. The lifecycle store's bound is the shared constant `MAX_DIRECTIVE_LIFECYCLE_SESSIONS = 64` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:8], evicted by `mtime` the same way [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:215-226], with stale temp files removed after 5 minutes [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:199-212].

6. **The guard's failure direction makes a lock unnecessary.** Under iteration 1's design, a missing, unreadable or stale receipt means the guard does not fire, so the floored route is delivered: today's behavior. The races that a lock-free store allows are (a) two writers on one session id, where either last unfloored route is a valid receipt, (b) an eviction that deletes a live receipt, which costs one guard miss, and (c) a torn file, which temp-file-plus-`rename` prevents and a parse check catches. None of them can suppress a route that today's code would deliver, except by reading a receipt that is valid but older than intended, which the expiry rule bounds. INFERRED from iteration 1's predicate and the POSIX same-directory `rename` guarantee. The 011 concurrency test confirms it: two writers on one session, then a read that parses one of the two skills or none.

### Q2 recommended design

- **Location:** a sibling folder `route-receipts/` under the shared state base, which is `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` or `join(tmpdir(), 'speckit-advisor')`, resolved the same way as the lifecycle and Vibe stores. One `<sha256(sessionId)[:16]>.json` per session, directory mode `0o700`, file mode `0o600`. Not the lifecycle record (finding 1), and not `.skilled/skills/.state/` (finding 4).
- **Writes:** a pure-TypeScript store in `hooks/lib/route-receipt.ts`. Write a temp file in the same folder with the exclusive-create flag (`wx`), then `renameSync` it onto the target. No `flock` and no new Python op (findings 2, 3 and 6). Refuse a base or folder that `lstat` shows to be a symlink, and refuse a receipt file over a small cap, for example 4 KiB, mirroring the helper's `secure_stat` and `MAX_RECORD_BYTES` checks in spirit (`directive-lifecycle-store.py:14`, `:95`). INFERRED: `/tmp` is shared between users on Linux, so the symlink check carries weight there.
- **Reads:** parse, check `version === 1` and the field types, and treat any failure as no receipt, which means deliver.
- **Bound and pruning:** import `MAX_DIRECTIVE_LIFECYCLE_SESSIONS` rather than adding a second `64`. When the target file is new, evict the oldest `*.json` by `mtime` down to the cap minus one, as both existing stores do. Remove temp files older than 5 minutes on the same pass. An eviction race only deletes receipts (finding 6).
- **Lifecycle coupling (bridge into Q3):** the receipt stores the lifecycle clock `{storeGeneration, lifecycleEpoch}` from `state.clock(sessionId)` at write time. The guard reads the current clock and fires only when both tokens match. The clock is already part of the `DirectiveLifecycleState` interface the decision core uses [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:156-162], and both the file store and the in-memory store implement it [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:71-73] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:225-228]. A `null` clock (helper missing, timeout, poisoned failsafe) means no guard. This adds the clock to iteration 1's receipt fields and settles the "lifecycle epoch or boundary token" slot iteration 1 left to Q3.
- **Cost to settle in 011:** a write turn would add one `clock` spawn (finding 3). To keep that off most turns, call `clock` on the read side only after the cheap predicates (b) to (e) hold, and on the write side only on an `ok`, unfloored turn. INFERRED: whether one extra spawn on each delivered turn is acceptable is a latency question nobody has measured. If 011's measurement shows it is too slow, the fallback is to drop the clock from the receipt and expire by transcript shrink plus an age limit only. Q3 decides between them.

### Q3: what the clock gives for free

7. **A boundary rotates the clock the receipt would store.** A boundary with a session id runs `advance-session`, which deletes that session's lifecycle record and writes a fresh random epoch token [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:297-299]. A boundary without one runs `advance-generation`, which deletes every record and epoch and writes a new generation token [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:300-308]. The boundary adapter calls one of the two and ignores its `boundary` field, so any boundary the host sends counts [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:31-37] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:183-191]. CONFIRMED. A receipt that stores the clock expires on every boundary with no change to the boundary path and no deletion of the receipt file.

8. **The prompt hook's dropped `clear` matters less than the brief suggests.** `lifecycleEventFor` maps only `startup`, `resume` and `compact` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:227-237], and that value only feeds the decision core's `forceFull` flag [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:334-343]. Epoch rotation comes from the separate boundary adapter, so a `clear` that reaches that adapter still expires a clock-bound receipt. INFERRED. What is not confirmed is which hosts register the boundary adapter: the registration search in this iteration found only the concern README, which says adapters are registered elsewhere [SOURCE: .skilled/hooks/directive-lifecycle/README.md:25] [SOURCE: .skilled/hooks/directive-lifecycle/README.md:58]. It also says OpenCode, Vibe and Pi advance their lifecycle state on their own paths [SOURCE: .skilled/hooks/directive-lifecycle/README.md:96]. Iteration 3 has to name, per host, whether a boundary reaches `advanceSessionEpoch`.

### 011 changes from Q2

- Rewrite the `hooks/lib/route-receipt.ts` row: a pure-TypeScript file store in `route-receipts/` under the shared state base, temp file with `wx` plus `renameSync`, no lock, the bound from `MAX_DIRECTIVE_LIFECYCLE_SESSIONS`, `mtime` eviction on a new target, temp cleanup after 5 minutes, symlink refusal and a size cap. The receipt also holds `storeGeneration` and `lifecycleEpoch` from `state.clock()`.
- Add a REQ: a receipt that is missing, unreadable, oversized, the wrong version or clock-mismatched, or a `null` clock, means the guard does not fire and the turn delivers as it does today.
- Add a REQ: no edit to `hooks/lib/directive-lifecycle-store.py`, and no change to `DIRECTIVE_LIFECYCLE_SCHEMA_VERSION`.
- Add test rows to `runtime/tests/hooks/route-receipt.vitest.ts`: two writers on one session leave a parseable receipt or none; a write past the bound evicts the oldest; a stale temp file is removed; and an `advanceSessionEpoch` on an `InMemoryDirectiveLifecycleStore` makes the next guard read deliver.

## Questions Answered

- Q2 The state store: reuse the directive-lifecycle store, a sibling folder beside Vibe's head receipts, or `.skilled/skills/.state/`, with atomicity and concurrency. Answered with a recommended design. The lock-free safety argument (finding 6) is inferred and becomes a frozen 011 test. The clock's spawn cost is the one open trade-off, handed to Q3.

## Questions Remaining

- Q3: partly answered. A clock-bound receipt expires on every boundary that reaches the lifecycle store. Still open: which hosts deliver boundaries, whether an age limit or turn count is needed on top, and the clock-versus-age fallback if the spawn cost is too high.
- Q4, Q5: not started.

## Ruled Out

- **Storing the receipt inside the lifecycle record.** The helper rebuilds and copies only fixed keys, so an extra field would not survive a matched turn (finding 1).
- **Riding the helper's `flock`.** It needs a new helper op and an extra spawn, and the guard's fail-to-deliver direction makes a lock unnecessary (findings 2, 3 and 6).
- **Clearing receipts from the boundary adapter.** Storing the clock expires them with no change to the boundary path (finding 7).

## Dead Ends

- None new. The `dist/` probe from iteration 1 was not retried. This iteration needed no runtime probe.

## Edge Cases

- Ambiguous input: "atomicity and concurrency" read as torn writes, two writers on one session id, and eviction races. Cross-machine or networked state bases are out of scope because the base is a local temp path.
- Contradictory evidence: iteration 1 said `.skilled/skills/.state/` splits with `cwd`. That holds, but the lifecycle store splits by `cwd` too (finding 4), so the reason for ruling out the repo folder is restated.
- Missing dependencies: the search for where Claude registers the boundary adapter was inconclusive in this iteration's budget. The finding 8 claim about `clear` is marked inferred.
- Partial success: Q2 closed. Q3 got a first pass. `research/research.md` is not on this dispatch's write list, so progressive synthesis was not written, as in iteration 1.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:14-36, :58-87, :121-145, :185-369
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:1-148
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:6-9
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:1-192, :225-228
- .skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:1-69
- .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:60-194
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:215-383
- .skilled/hooks/directive-lifecycle/README.md:23-96
- specs/.../010-route-receipts-research/spec.md:163-166 (Research Brief Q2 to Q5)
- specs/.../011-route-receipts-build/spec.md:110, :140, :172, :182-183

## Assessment

- New information ratio: 0.81
- Questions addressed: Q2, Q3
- Questions answered: Q2

## Reflection

- What worked and why: reading the helper's `mutate` table before designing the store showed in one place that the record shape is fixed and that the clock is already a public op. That made the location decision and the expiry signal fall out together instead of needing a separate Q3 pass.
- What did not work and why: the registration search used `--include` globs that zsh expanded before `grep` saw them, and the second pass covered too few config files to say which hosts run the boundary adapter.
- What I would do differently: in iteration 3, read each host's hook config directly (`.claude/settings.json` SessionStart, `.codex/hooks.json`, `.vibe/hooks.toml`, `.dsh/patches/guards.patch.yml`, `.pi/extensions/prompt-advisor.ts`) for the boundary adapter, as part of Q4.

## Recommended Next Focus

Iteration 3 has to close Q3, Q4 and Q5 together. Q3 and Q4 share one read: per host, does a boundary reach `advanceSessionEpoch`, and does the prompt path pass `session_id` and `transcript_path`? Use Pi's `hooks/pi/prompt-advisor.ts:56-62`, `:289-294`, DSH `:171`, Vibe `:185`, `:236`, Codex `codex/shared.ts:90-115`, and the OpenCode plugin `:137`, `:229-246`, `:694`. Then Q5: freeze the harness (the pure decision function plus a hook replay with `InMemoryDirectiveLifecycleStore` and an in-memory receipt store on one session id), the threshold on the nine pairs, and the false-carry pair (pair 1's README task, then the refactor task).
