# 036 Deep-Loop Innovation — Autonomous Execution Goal Prompt (v2 · 2026-08-12)

> Short operational prompt (<=4000 chars). `goal.md` is the durable plan; `goal-plan-review.md` is the
> unresolved-findings authority until a fresh review supersedes it.

MISSION: drive the 036 epic tail to completion. Claude orchestrates; two external models implement and
cross-check, alternating so the model that did NOT build a change verifies it:
- Model A: GPT-5.6-SOL HIGH FAST (cli-codex).
- Model B: DeepSeek-v4-flash (cli-opencode, opencode-go gateway).

CANDIDATE: fresh isolated worktree `.worktrees/0144-system-deep-loop-036-p0-remediation` at SHA
`ced5fe53cc1`. tsc baseline rc0. NEVER the dirty shared checkout; NEVER touch worktrees 0091/0100/0101 or
lanes 047-050 (another session owns them). `skilled/v4` is a MOVING shared branch — reconcile before any land.

DISPATCH (contracts pre-read; full mechanics in cli-codex / cli-opencode SKILL.md):
- codex: `AI_SESSION_CHILD=1 codex exec --model gpt-5.6-sol -c model_reasoning_effort=high -c service_tier=fast -c approval_policy=never --sandbox <read-only|workspace-write> -o <log> "<prompt>" </dev/null 2>&1`.
- opencode: `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run --model opencode-go/deepseek-v4-flash --pure --format json --dir <wt> "<prompt>" </dev/null > <log> 2>&1`.
- One dispatch at a time; run in the background-wrapper FOREGROUND (no inner &); capture PID, kill only that PID.
- Every prompt carries `Spec folder: specs/system-deep-loop/036-deep-loop-innovation (pre-approved, skip Gate 3)`.

HARD-WON DISCIPLINE (learned this session — non-negotiable):
1. A green test is NOT proof. SOL's first P0 fix passed red-before/green-after/tsc yet was an OVER-DENIAL that
   would break every mode's cutover; caught only because DeepSeek read the packet's design-rationale docs.
2. Before building ANY finding, READ the packet design docs (`hardening-notes.md`, `t001-disposition.md`,
   `implementation-summary.md`, `spec.md`) and check whether the "obvious" fix was DEFERRED or REJECTED there.
   Most P0 residuals are deferred-by-design changes to shipped subsystems, NOT tweaks.
3. The cross-model checker MUST read design docs and try to REFUTE (over-denial / breaks-existing-green / bypass),
   not merely re-run tests.
4. A fix that passes tests but contradicts documented design intent gets REVERTED, not landed.

ENGINEERING GATES (autonomous quality bars — NOT operator asks):
- Per fix: design-doc read -> red-before negative control -> green-after; tsc rc0 from runtime/; per-file vitest
  (fileParallelism:false; never the hanging aggregate); scoped diff = only intended files, nothing deleted;
  rg zero unauthorized `.appendAuthorized(` / cast reach-arounds; comment hygiene (durable WHY, no ids/paths);
  strict validate Errors 0 Warnings 0.
- Cross-model adversarial check against code + design docs before it counts as done.
- Local worktree commit per verified item; push/land deferred to the frontier.

SEQUENCE:
1. Re-scope the 5 open P0s against design docs: F1 reverse-CAS rollback composition, F2 atomic/recoverable
   transition, F3 independent evidence identity, F4 receipt certification, F7 shared-backend partitioning.
   (F5 already fixed; F6 handled-by-design — permanent-lock rows deferred to a distinct PIN disposition; bad fix reverted.)
2. Build each P0 correctly (several are multi-file subsystem changes).
3. Close 6 P1: F8 cert evidence families; F9 closed-world 015 consumer proof; F10 integration freeze before first
   CAS; F11 Stage-B authority-lifecycle matrix; F12 detached-checkout validation; F13 baseline 000->003 (cheap).
4. FRESH independent review (GPT-5.6-SOL) -> must return APPROVE with 0 open P0.
5. [IRREVERSIBLE FRONTIER] 8 mode authority cutovers in frozen order, each a live rollback drill + recorded revert SHA.
6. 015 telemetry/inventory (reversible) -> zero-use proof -> legacy-writer deletion (irreversible; recorded restoration anchor).
7. 016 Stage-B whole-system matrix on a frozen SHA + blocking SOL APPROVE.
8. 017 integrate origin drift, rerun Stage-B on final SHA, reconcile the 178-row ledger + every child's status/metadata.
9. Merge the exact final SHA to main.

FRONTIER STOP: steps 5, 6-deletion, and 9 are irreversible/outward-facing on a moving shared branch. Name the
rollback and get one operator go-ahead when first reached; everything before runs without asking. Legacy stays
authoritative until a mode passes every gate. Proof over appearance: only real command output counts.
