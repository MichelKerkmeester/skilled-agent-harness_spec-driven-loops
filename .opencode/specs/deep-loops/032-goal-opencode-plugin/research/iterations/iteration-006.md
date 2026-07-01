# Iteration 006 — `usage_limited` write-path trace

## Focus

**(Carried F-003):** Trace every `status:` write in `mk-goal.js` to confirm whether `usage_limited` is ever set in production paths, or is a dead enum value.

## Actions Taken

1. Grepped `.opencode` for every `usage_limited` occurrence across plugins, docs, specs, and research archives — isolated the production-code surface to a single line in `mk-goal.js`.
2. Grepped `mk-goal.js` for all `status\s*[:=]` writes and cross-referenced with a targeted `usage_limited|budget_exhausted|budget\.status|.status =` pass to avoid missing assignment variants.
3. Read the four status-mutation regions of `mk-goal.js`: the enum/constants block (lines 40–61), `markGoalStatus` + `accountUsage` (lines 879–955), the verifier transition block (lines 1080–1112), and `recordContinuationBudgetStop`/`recordContinuationReason` (lines 1146–1187).
4. Verified `markGoalStatus` call sites (entire repo) and the test suite (`*.cjs`) for any `usage_limited`/`markGoalStatus` reference.

## Findings

### F-003 RESOLVED — `usage_limited` has zero production writers (dead enum value)

Exhaustive enumeration of every `status:` write in `mk-goal.js`:

| # | Line | Context | Value written | Trigger |
|---|------|---------|---------------|---------|
| 1 | 794 | `buildNewGoal` | `'active'` | new goal (user set) |
| 2 | 853 | `setGoal` (objective-change branch) | `'active'` | same objective re-set |
| 3 | 889 | `markGoalStatus` | caller-supplied | **only called with `'complete'` (L1471) and `'paused'` (L1475)** |
| 4 | 944 | `accountUsage` | `nextStatus` | `nextStatus` is `'budget_limited'` or unchanged `current.status` (L941) |
| 5 | 1097 | verifier `met` branch | `'complete'` | supervisor verdict met |
| 6 | 1106 | verifier `blocked` branch | `'blocked'` | supervisor verdict blocked |
| 7 | 1180 | `recordContinuationBudgetStop` | `'budget_limited'` | continuation preflight budget exhausted |

The string `usage_limited` appears exactly **once** in the entire production file — line 54, the `VALID_STATUSES` set declaration. It is:
- **Accepted** as valid by `markGoalStatus` (L880) and the state loader (L622 `status: rawGoal.status`).
- **Never written** by any code path. No `recordContinuationUsageStop`, no external-provider-error detector, nothing in the `session.idle`/`message.updated` event handler maps a provider usage-limit refusal to this status.
- **Never tested.** `rg usage_limited *.cjs` → no files found; `rg markGoalStatus *.cjs` → no files found (tests touch `maybeContinueGoal` directly per iter 5, never the status mutator).

**Verdict: `usage_limited` is dead / unreachable in shipped production code.** F-003 closed.

### F-014 (P2) — `usage_limited` is reserved-but-unwired (design drift)

The design synthesis (archived `research_archive/2026-06-28-goal-design-synthesis/iterations/iteration-010.md` line 21; synthesis `research.md` line 157, fork #6) explicitly reserved `usage_limited`:

> `budget_limited` means our configured goal budget was reached. `usage_limited` means the provider/session/runtime refused further work because of an external usage cap.

The shipped code implements the `budget_limited` half (post-turn accounting L941, continuation preflight L1146–1150, status transition L944/L1180) but **never implements the `usage_limited` half**: there is no detection seam that observes a provider/runtime usage-limit error (e.g. a rate-limit / quota / 429 payload in `session.idle` or `message.updated`) and transitions the goal. The reservation survives only as enum membership.

This is not a regression (the feature was never built), but it is a **planned-but-unimplemented design contract** that leaves the enum value misleading: a reader of `VALID_STATUSES` (or the catalog doc `goal-opencode-plugin.md:35`, which lists it as a first-class status) would infer a runtime capability that does not exist.

**Remediation fork (reported only, not implemented):**
- (A) **Collapse the enum** — remove `usage_limited`, treat all caps as `budget_limited`, and update `goal-opencode-plugin.md` + the catalog. Lowest-cost; loses the external-vs-internal distinction the design wanted.
- (B) **Wire the seam** — add a provider-usage-limit detector on the `session.idle`/`message.updated` event path (analogous to `recordContinuationBudgetStop`) that maps a recognized external cap payload to `status: 'usage_limited'` + `continuationSuppressed: true`. Matches design intent; requires defining the provider-error shape OpenCode exposes.

### Invariant confirmed — dormant-but-safe

If `usage_limited` were set by any means (direct state-file edit, a future caller of `markGoalStatus('usage_limited')`, or external tooling), the shipped gates already handle it correctly and consistently with design intent ("never auto-continue a limited goal"):

- Injection gate: `getActiveGoal` returns the goal only when `status === 'active'` (L1004) → **no injection** for `usage_limited`.
- Verifier gate: transitions only run when `current.status === 'active'` (L1080) → **no verification churn**.
- Continuation gate: `reserveContinuationTurn` requires `status === 'active'` (L1194) → **no auto-continue**.

So the value is dormant-but-safe: it behaves as a quiet terminal status, not a hazard. The defect is absence-of-writer, not mishandling.

## Questions Answered

- **[F-003] Is `usage_limited` ever set in production paths, or dead?** → **Dead.** Enum-declared at L54, accepted by the loader/mutator, but no production writer exists. Confirmed via exhaustive status-write enumeration (7 write sites) + zero call sites passing `usage_limited` + zero test coverage.
- **[Q-status-set] Does the shipped enum match the design?** → Enum *membership* matches Codex's six (fork #6 ✓), but the **runtime contract** for `usage_limited` is unimplemented (F-014). `blocked`/`complete` are supervisor-driven (L1097/L1106); `budget_limited` is accountant + preflight driven (L944/L1180); `paused`/`complete` are user-driven (L1471/L1475); `usage_limited` has no driver at all.

## Questions Remaining

- (Carried) **F-004:** dedicated read of `mk-goal.js` injection/transform wiring (`renderGoalInjection`/`appendGoalBrief`/`experimental.chat.system.transform`) — partially seen at L1350–1676 but not examined as a dedicated axis.
- (Carried) **9 Resolved Design Forks cross-check** against shipped behavior — richest remaining novel axis; forks #1 (autonomy), #5 (completion detection), #6 (status set — now *almost* closable modulo F-014) are well-evidenced, but forks #2 (keying), #3 (state store atomicity), #4 (budget governance), #7 (surfacing), #9 (reuse) deserve a formal pass.
- (Carried) Confirm the opencode command-resolution rule for `.opencode/commands/*.md` (`opencode_goal.md` → `/opencode_goal`?) — refines F-008.
- (Carried) **F-013:** `session.idle` → `maybeContinueGoal` autonomy-enabled seam has zero test coverage (iter 5).
- **NEW:** Decide F-014 remediation direction (collapse vs wire) — needs a design decision, not research.

## Next Focus

Rotate to the **9 Resolved Design Forks cross-check** (longest-carried, highest-novelty axis) and close forks #2 (scope/keying — hex(sessionID)), #3 (state store atomicity — temp+fsync+rename, mutation queue), and #7 (surfacing = injection + `/goal show` + `mk_goal_status`) against shipped code in a single dedicated iteration. This directly serves the core audit question "does shipped code faithfully realize the 9 resolved forks" and is the last major unexamined phase-comparison axis.
