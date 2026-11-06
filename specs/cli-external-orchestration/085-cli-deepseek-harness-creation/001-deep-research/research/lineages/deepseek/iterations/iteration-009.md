# Iteration 9: Deep-loop fan-out fitness and the complete touch list

## Focus

Angle 9: what a lineage command builder for `cli-deepseek` needs — write-permitting headless flags,
approval semantics, timeout, stdin, state isolation, env filters, self-invocation detection,
sandbox and exit-status trust — and every consumer that must learn the new executor kind.

## Actions Taken

- Read the executor-kind tables, defaults and allowlists in `executor-config.ts`.
- Read the Pi and Hermes builders, the adapter map, the dispatch-env builder and the recursion guard.
- Read the runner's exit-status policy and the permission-preset and sandbox references.
- Enumerated consumers with repo-wide searches for `cli-hermes` and `cli-pi`.

## Findings

1. Registering a kind means touching seven tables in `executor-config.ts`: `EXECUTOR_KINDS`,
   `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`, the web-search policy
   map, `EXECUTOR_MCP_SERVER_CAPABILITY`, the per-kind defaults, and the model allowlist plus default
   model and Flash top-tier pin. `cli-deepseek` is a provider pass-through with no per-dispatch model
   flag, so its allowlist must be the set of route patches the repo ships.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:93-122]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:140-148]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:194-209]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:251-276]
2. The builder's command shape is `dsh --profile headless --json --permission-mode <mode>
   --approval-policy never --patch <route.yml> -`, with the prompt on stdin and `input` set to the
   prompt. `-` is required because a positional task makes the harness ignore stdin. There is no
   model, effort, cwd or timeout flag: cwd is the spawn directory, the timeout is the runner's, and
   the route comes from the patch. [SOURCE: dsh-src/docs/cli-help.md:100-132]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:36]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:46]
3. Write permission is explicit: `workspace-write` confines writes to the spawn cwd plus
   `--add-dir` grants, `read-only` denies writes, `danger-full-access` bypasses the sandbox, and a
   host without a usable backend fails `SANDBOX_UNAVAILABLE` rather than running unconfined.
   `--approval-policy never` rejects every call that would need a human, which is the only correct
   setting for an unattended leaf. [SOURCE: dsh-src/packages/sandbox/sandbox/README.md:12]
   [SOURCE: dsh-src/packages/sandbox/sandbox/README.md:58-60]
   [SOURCE: dsh-src/packages/sandbox/sandbox/README.md:134]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:92]
4. There is no turn or time budget in the headless contract. The runner's `timeoutSeconds`, signal
   kill and the artifact check are the only bound, so the lineage patch must also disable `goal`,
   `goal-round-driver` and `plan-mode`: an active goal can auto-continue up to 256 rounds, and plan
   mode fails closed without a review channel. [SOURCE: dsh-src/packages/goal/goal-round-driver/README.md:12-30]
   [SOURCE: dsh-src/packages/plan/plan-mode/README.md:63]
5. Per-lineage state isolation is `DSH_HOME=<lineage>/.dsh-home` in the child environment. The
   directory bootstraps its own `headless` profile and session tree on first use and never reads the
   operator's `~/.dsh`, which keeps locks, sessions and credentials separate across lineages.
   [SOURCE: dsh-src/packages/util/home-paths/README.md:34-40]
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.dsh-home/profiles/headless/cordis.yml]
6. The dispatch-env filter is a strict allowlist: PATH, HOME, LANG, TMPDIR, NODE_PATH, TERM, USER,
   LOGNAME, `__CF_USER_TEXT_ENCODING`, `LC_*`, plus per-kind prefixes and single keys. A
   `cli-deepseek` entry needs `DSH_HOME` as a key, and `LLMGATEWAY_` plus `DEEPSEEK_` as prefixes
   for the two routes; `DSH_*` must not be a blanket prefix, or unrelated deployment knobs leak into
   every leaf. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:129-186]
7. The recursion guard needs two signals: `SPECKIT_FANOUT_LINEAGE_ID` and the executor kind present
   in `SPECKIT_CLI_DISPATCH_STACK`. The builder stamps the stack, and a `dsh` binary mapped to
   `cli-deepseek` makes a nested dsh dispatch fail closed. dsh itself has no native self-invocation
   guard, so this is the only prevention. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3700-3730]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:994-1010]
8. Exit status is trustworthy in a way Pi's is not: `0` only on a completed final turn, `1` on
   abort, error, no owned turn, usage error or unusable session id. The runner can treat any non-zero
   as failure, but should read the `--json` `final.reason` and `error` event to classify it, because
   provider error, denial and timeout all collapse to `1`.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4045-4056]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:12]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:104]
9. The complete consumer list, one row per file and the change each needs:

| File | Change |
|---|---|
| `runtime/lib/deep-loop/executor-config.ts` | Add kind to all seven tables, a three-model allowlist, default model and `max` pin |
| `runtime/scripts/fanout-run.cjs` | Add `buildDeepseekLineageCommand`, adapter entry, binary probe, route map, `SPECKIT_DEEPSEEK_STATE_DIR`, `dsh` recursion binary |
| `runtime/lib/deep-loop/executor-audit.ts` | Add `DSH_HOME` key and `LLMGATEWAY_`/`DEEPSEEK_` prefixes; add `dsh` to the recursion binary map |
| `runtime/tests/unit/{executor-config,fanout-run,combo-matrix,executor-audit,verify-iteration}.vitest.ts` | Add `cli-deepseek` cases and matrix exclusions |
| `runtime/tests/stress/cli-adapter/{matrix-manifest.ts,live-contracts.json,cli-deepseek.vitest.ts,shims/deepseek-shim.cjs,README.md}` | Add the adapter, a shim and a live-contract row |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` + `dispatch-audit.test.mjs` | Recognize `dsh headless` and map it to `cli-deepseek` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Add hard-rule fixtures (stdin `-`, approval `never`, profile preset) |
| `deep-ai-council/scripts/orchestrate-session.cjs` + tests | Add the kind to its accepted list and seat fallback |
| `deep-ai-council/SKILL.md`, `deep-research/SKILL.md`, `deep-review/SKILL.md` | Add the eighth executor kind to the documented roster |
| `.skilled/commands/deep/assets/deep-research-{auto,confirm}.yaml`, `deep-review-{auto,confirm}.yaml`, `deep-ai-council-{auto,confirm}.yaml` | Add a shared-adapter note/branch for `cli-deepseek` |
| Same assets' `*-presentation.txt` and `compiled/*.contract.markdown` | Add `cli-deepseek` to each enum and choice list |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Update the AGENTS.md agent-routing text it mirrors |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/{fixtures/canary-cases.v1.json,harness/build-artifacts.cjs}` | Add the packet to the canary and build fixtures |
| `.skilled/skills/cli-external-orchestration/{SKILL.md,ROUTER.md,README.md,mode-registry.json,hub-router.json,leaf-manifest.json,graph-metadata.json,description.json,feature-catalog/}` | Register the eighth mode and its feature-catalog entry |
| Sibling `cli-*/README.md` mode tables | Add the new row where the seven are listed |
| `system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Add the packet to `cli_skills` |
| `sk-prompt/SKILL.md` + `assets/cli-prompt-quality-card.md` | Add its model row and persona-reach rule |
| `.skilled/agents/orchestrate.md`, `prompt-improver.md` | Add the kind to the executor and model tables |
| `AGENTS.md`, root `README.md`, `SECURITY.md`, `.skilled/skills/README.txt` | Update counts, routing lines and the approval note |
| `system-spec-kit/runtime/data/trigger-index.json` | Regenerate after the packet exists |
| `sk-doc/scripts/tests/code-folder/{durable-directory-manifest.json,baseline-readme-verdicts.json}` | Add the packet's directories and README verdicts |
| `runtime/feature-catalog/fanout/fanout-run.md` | Document the new builder and its flags |

  [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:69-100]
  [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:198-381]
  [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:61-94]
  [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:5-12]
  [SOURCE: README.md:867-871]

## Ruled Out

- A `--model` or `--effort` flag in the builder: headless exposes neither, so the route must be a
  patch and the allowlist a set of patch names.
- Reusing the Pi exit-code exception: dsh's exit status is deterministic, so a non-zero exit is a
  real failure.
- Passing all `DSH_*` variables to the child: only `DSH_HOME` and `DSH_PERMISSION_MODE` are needed.

## Dead Ends

- Looking for a harness-side per-run budget: none exists; the runner owns the timeout, and the
  goal driver is the overrun risk to disable.

## Edge Cases

- Ambiguous input: "write-permitting flags" could mean sandbox mode or approval policy; both are
  required and are recorded separately.
- Contradictory evidence: the harness sandbox defaults to `workspace-write`, which is write-permitting,
  while its fail-safe policy default is `read-only`; headless overrides to `workspace-write`, so a
  read-only leaf must pass the mode explicitly.
- Missing dependencies: no configured key, so no lineage was executed through the builder.
- Partial success: the builder design is source-backed; the touch list is complete for the files
  that name the existing kinds, but a generated index can still surface a missed mention at build
  time.

## Sources Consulted

- `runtime/lib/deep-loop/executor-config.ts:11-276`
- `runtime/scripts/fanout-run.cjs:2884-3120,3620-3730,4045-4056`
- `runtime/lib/deep-loop/executor-audit.ts:129-186,994-1010`
- `dsh-src/docs/cli-help.md:100-132`
- `dsh-src/packages/bundle/headless/README.md:12,46,92,104`
- `dsh-src/packages/sandbox/sandbox/README.md:12,58-60,134`
- `dsh-src/packages/util/home-paths/README.md:34-40`
- `dsh-src/packages/goal/goal-round-driver/README.md:12-30`
- `dsh-src/packages/plan/plan-mode/README.md:63`
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:61-94`
- `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:69-100`
- `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:198-381`
- `.skilled/skills/cli-external-orchestration/mode-registry.json:5-12`
- `README.md:867-871`

## Assessment

- New information ratio: 0.90 (seven fully new builder and isolation findings, one that extends the
  exit-status policy, and one complete touch table)
- Questions addressed: Angle 9 fan-out fitness and cross-repo touch points
- Questions answered: What does a deep-loop fan-out lineage builder need, and which consumers must learn the new executor kind?

## Reflection

- What worked and why: the existing builders are a checklist; every field a kind needs is already a
  constant or a table entry for Pi or Hermes, so the new kind is an enumeration, not a design.
- What did not work and why: searching the whole repo for `cli-hermes` timed out; scoping the
  searches by directory and using the content-search tool produced the same list without the cost.
- What I would do differently: start from `EXECUTOR_KINDS` and follow each table, then grep for the
  kind names in tests, because the tables are the authoritative touch list.

## Recommended Next Focus

Angle 10: constraints and differences versus Pi, hard rules for the packet, the phase plan, and what
stays UNKNOWN until a live contract pin.
