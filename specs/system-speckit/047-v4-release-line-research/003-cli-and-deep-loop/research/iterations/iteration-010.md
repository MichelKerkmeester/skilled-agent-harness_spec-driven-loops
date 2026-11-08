# Iteration 010 — Closing the run: lock clauses, the council's missing dispatch, and three extensions

## Focus

Final iteration (10 of 10, max-iterations ceiling). Three closures named by the reducer:

1. **v4.0.0.3 "Deep-loop runs finish their work"** — verify each clause against the review workflow's lock steps, `loop-lock.cjs` and the library it delegates to.
2. **ai-council** (`deep-ai-council`, `/deep:ai-council`, v4.0.0.0 and v4.0.0.7 three-mode claim) — does its runtime use the same executor dispatch, and does it share the `if_cli_*` defects found for research?
3. **Extension** — name three concrete changes that remove the defects found across this run.

## Actions Taken

1. Read `loop-lock.cjs` subcommand/flags table and its acquire subcommand end to end, then the library functions it calls (`refreshLoopLock`, `releaseLoopLock`, `isStaleLoopLock`, `lockIdentityMatches`, `withFreshAcquireNonce`).
2. Grepped every lock reference in `deep-review-auto.yaml` and read the acquire/refresh/release step blocks with their `on_*` handlers and the inline lock-cleanup contract.
3. Compared the review acquire command with the research variant's acquire line; listed the council assets and checked both council workflow assets for `if_cli_*` / `runAuditedExecutorCommand` / `executor.type`.
4. Read the council seat dispatcher (`multi-seat-dispatch.cjs`) and grepped every `dispatchSeat` supplier in the tree; read `ai-council.md`'s dispatch-ownership and executor-flag rows plus `runtime-capabilities.json`.
5. Located the review variant's `if_cli_opencode` twin and diffed its argv region against the research branch; grepped `convergence.cjs` and `reduce-state.cjs` for `stopPolicy` / `minIterations`.

## Findings

### F1 — P1 — bug + UX: the review acquire step omits `--owner-pid`, so every review lock is `transient` and never reclaimed by a dead-owner check

The workflow acquires with only `--lock-path`, `--packet-id` and `--ttl-ms 1800000` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:322]. The CLI marks a lock `ownerKind: 'transient'` precisely when `--owner-pid` is absent [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:185], and the staleness test then skips the pid probe for transient records — `ownerDead` is hard-`false` for that kind, so only heartbeat age can expire them [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:641].

Consequence: a review run killed without reaching its release steps (`SIGKILL`, host crash, harness timeout) blocks the packet for 2 x TTL = 60 minutes, not until the next attempt. The step's own note promises otherwise — it states a lock is stale "when its owning process is known to be dead" [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:324] — a clause this invocation can never satisfy, because the only lock it can produce is the kind the probe is skipped for. The research variant shares the omission [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:286], so both auto workflows inherit it.

The release half of the claim holds: the three release steps carry the captured pid and nonce, the library rejects a nonce mismatch [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:584], and refresh fails closed on `refreshed:false` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:664].

- Introduced by: v4.0.0.3 (the lock steps and the transient marking land together).
- Confidence: high for the code path; high for the 60-minute window (TTL is passed explicitly as 1800000).
- Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs acquire --lock-path /tmp/probe.lock --packet-id probe --ttl-ms 1800000 && cat /tmp/probe.lock | grep owner_kind` → `"owner_kind": "transient"`.

### F2 — P1 — bug: the review variant's `if_cli_opencode` carries the same argv defects as the research branch (closes iteration 9's narrowed question)

`deep-review-auto.yaml` declares `if_cli_opencode` at [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1418]. Inside it: the model placeholder is passed unguarded as `model: '{config.executor.model}'` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1434] while five later branches use the guarded form `'{config.executor.model}' === 'null' ? null : ...` starting at [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1641]; the argv carries the v1-only `'--pure'` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1547]; and the binary is the literal `command: 'opencode'` [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1570], so `OPENCODE_BIN` and the installed major are ignored here exactly as in research.

The twin is therefore not a copy with one divergence — it is the same four defects, which makes the seam one defect in two files rather than two independent slips.

- Introduced by: v4.0.0.13 for the version rule this branch ignores; the `--pure` flag predates it.
- Confidence: high (four exact lines, plus the guarded-form asymmetry visible in the same file).
- Verify: `grep -n "\-\-pure\|command: 'opencode'\|config.executor.model" .skilled/commands/deep/assets/deep-review-auto.yaml | sed -n '1,12p'`.

### F3 — P1 — drift: the council's `external-cli` mode is a prompt contract with no dispatch runtime behind it

Neither council workflow asset contains a single `if_cli_*` branch, `runAuditedExecutorCommand` call or `executor.type` read (`grep -c 'if_cli' deep-ai-council-confirm.yaml` returns 0; the same grep over `deep-ai-council-auto.yaml` returns nothing). Yet `/deep:ai-council` advertises `--executor-mode in-cli|external-cli` and `--executor TYPE` as bound workflow inputs [SOURCE: .skilled/commands/deep/ai-council.md:88], and the command says dispatch "is handled by the YAML workflow steps" [SOURCE: .skilled/commands/deep/ai-council.md:49].

The seat dispatcher explains why: `dispatchCouncilSeats` requires the caller to inject a `dispatchSeat` function and throws without one [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:140], and no file outside the test suites supplies that function. So the council sits outside the executor registry entirely: it inherits none of the research/review argv defects (F1-F4 of iteration 9 cannot reach it), and equally none of the protections — no `command -v` preflight, no opencode version resolution, no typed failure event. `--executor TYPE` binds a value the runtime never reads, and `runtime-capabilities.json` records the same blind spot as a capability claim rather than a mechanism [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/assets/runtime-capabilities.json:4].

- Introduced by: v4.0.0.0 (council routing) and unchanged by v4.0.0.7's three-mode framing.
- Confidence: high for "no dispatch branch exists"; medium for the operator-visible consequence, which depends on whether the executing agent follows the prose.
- Verify: `grep -rn "dispatchSeat" --include=*.cjs .skilled/skills/system-deep-loop/ | grep -v tests` → no output; `grep -c "if_cli" .skilled/commands/deep/assets/deep-ai-council-auto.yaml` → 0.

### F4 — P2 — UX/improvement: the fan-out summary carries no failure reason, so "a failed run says why it failed" is only true per lineage

`summarizeSnapshots` returns `{results, summary:{total, succeeded, failed, all_failed}}` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:339]. Every datum a caller needs to explain a failure lives in the ledger events and in per-refusal objects, not in the return value; `all_failed` is a boolean with no accompanying cause. A workflow step that reads the summary and reports "2 of 4 lineages failed" has no field to quote.

- Introduced by: pre-v4 fan-out; unaffected by v4.0.0.3.
- Confidence: medium-high (one function read; callers not enumerated).
- Verify: `node -e "const m=require('./.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');" ` is not the test — instead `grep -n "summarizeSnapshots" -A 12 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and read the returned object.

### F5 — P2 — extension: one argv builder for the single-executor branches

Files changed: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (export the existing `resolveOpencodeBinary` + the per-kind argv assembly already used for fan-out) and the two branch call sites [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:1570] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1642]. What breaks without it: `OPENCODE_BIN` is ignored, `--pure` reaches v2, and the model placeholder is unguarded — F1-F4 of iteration 9 plus F2 here, five defects with one cause and four call sites.

### F6 — P2 — extension: give `convergence.cjs` a `--config-json` owner for `stopPolicy` and `minIterations`

Neither `convergence.cjs` nor `reduce-state.cjs` contains the strings `stopPolicy` or `minIterations` (grep over both returns nothing), while both keys are first-class in every run config. Files changed: `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` (accept and apply the two keys) and `reduce-state.cjs` (stop re-deriving them). What breaks without it: the stop rule is asserted in JSON, restated in YAML prose and never enforced by the script that computes convergence — a config edit silently changes nothing. Inference beyond the grep: I did not read the reducer's stop path this iteration, so "silently changes nothing" is scoped to the two scripts named.

### F7 — P2 — extension: an executor-switch event, so a quota failure need not end a run

Files changed: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (emit a typed `executor_switch` status event with the abandoned kind and the reason), `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (a switch target list per kind) and the single-executor branches in both auto YAMLs. What breaks without it: the executor is bound once at config load, so a devin `resource_exhausted` or an unavailable binary terminates rather than migrates, and the council — which has no executor binding at all (F3) — cannot participate in a switch either.

## Questions Answered

- **Extension**: answered with three named changes (F5, F6, F7), each carrying the files it edits and the defect it removes.

## Questions Remaining

- **Executor failure handling** (v4.0.0.3, v4.0.0.16): the switch half is now closed negatively — no switch surface exists in fan-out or the auto branches — but what a single-executor run *records* for a devin quota error is still unread after six iterations of deferral.
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its seven modes remains unproven.
- **UX**: all three `*-presentation.txt` assets are unexamined.
- **Over-engineering**: F3 exposes a removal candidate — `runtime-capabilities.json` plus the un-called `dispatchSeat` seam — whose blast radius was not checked.
- **Carried forward, unresolved**: the substitution engine's unknown-token policy; persona vs `agentPersona`; idea-lifecycle suppression in the auto variant; the `orchestration-status.log` external-consumer question.

## Next Focus

None — iteration 10 of 10 reached the `max-iterations` ceiling. The stop reason is the configured limit, not convergence: the reducer's last two ratios (0.74, 0.72) are well above the 0.05 threshold, so this lineage stops with the questions above open. A continuation should open with the executor failure-recording question and the `package_skill.py --strict` sweep, both cheap and both repeatedly deferred.
