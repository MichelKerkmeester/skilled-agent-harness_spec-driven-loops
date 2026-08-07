# Iteration 4: Workflow YAML, Convergence Threading, And Timeout Caps

## Focus

Audit workflow YAMLs and runtime fan-out code for live comment-hygiene and convergence/timeout threading issues.

## Findings

1. The comment-hygiene violation is live in both workflows. `deep_review_auto.yaml` embeds `# <!-- F-010-B5-04 -->` at the config and state-log steps [SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:385`-`.opencode/commands/deep/assets/deep_review_auto.yaml:410`], and `deep_research_auto.yaml` embeds the same ephemeral marker at its config and state-log steps [SOURCE: `.opencode/commands/deep/assets/deep_research_auto.yaml:290`-`.opencode/commands/deep/assets/deep_research_auto.yaml:321`]. Recommendation: delete the finding-id comments and keep only the durable rationale about honoring the parsed `--no-resource-map` flag.

2. `deep_review_auto.yaml` still initializes config, state-log, and registry `sessionId` from `{ISO_8601_NOW}` instead of `{session_id}` [SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:410`; SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:415`], despite `007-fan-out-hardening` claiming setup bindings and fan-out identity were shipped [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening/implementation-summary.md:51`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening/implementation-summary.md:58`]. Recommendation: verify the intended fix landed in the YAML, not just `fanout-run.cjs`; otherwise detached lineages still lose caller-provided identity at first-run init.

3. The deep-research fan-out path does not thread the resolved convergence threshold into `fanout-run.cjs`. Review fan-out passes `--convergence-threshold {convergence_threshold}` and `--stop-policy {stop_policy}` [SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:174`-`.opencode/commands/deep/assets/deep_review_auto.yaml:181`], but research fan-out passes only spec folder, loop type, research topic, fanout config, and base artifact dir [SOURCE: `.opencode/commands/deep/assets/deep_research_auto.yaml:159`-`.opencode/commands/deep/assets/deep_research_auto.yaml:165`]. In `fanout-run.cjs`, `buildLoopPrompt` includes `config.convergenceThreshold` only when `options.convergenceThreshold` is non-null [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:805`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:807`], and the main path populates that option from parsed `--convergenceThreshold` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1150`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1153`; SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1298`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1302`]. Therefore `/deep:research` fan-out lineages silently omit the resolved threshold unless the runner is invoked manually like this detached task.

4. Existing fanout prompt tests do not catch that threshold propagation bug. The echo tests assert variant behavior and `config.maxIterations` inclusion/omission, but there is no assertion that a `--convergence-threshold` passed to `fanout-run.cjs` appears as `config.convergenceThreshold` in the lineage prompt, nor an integration fixture for `deep_research_auto.yaml` command arguments [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:1376`-`.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:1441`]. Recommendation: add a failing YAML/runner regression for research fan-out with `--convergence=0.01` and assert the lineage prompt contains `config.convergenceThreshold: 0.01`.

5. Per-lineage timeout sizing is structurally inadequate for 30+ high-reasoning iterations. `computeLineageTimeoutMs` defaults to `iters = lineage.iterations || 12`, `perIterSecs = lineage.timeoutSeconds || 900`, doubles it, then hard-caps at 4 hours [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:880`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:888`]. For 35 iterations at the default 900 seconds, the uncapped budget would be 17.5 hours, but the child is killed after 4 hours by `runLineageProcess` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:991`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:994`; SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1369`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1386`]. Recommendation: expose an explicit `lineageTimeoutCapSeconds`/`maxWallClockMinutes` override and record timeout budget in the prompt/status ledger; otherwise high-effort models can be killed before legal convergence or max iterations.

6. `buildLoopPrompt` still frames CLI review/context/research subprocesses as `You are a ${agentName} agent running a fan-out lineage` while asking them to run `phase_init`, `phase_main_loop`, and `phase_synthesis` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:826`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:840`]. For LEAF-owned agents this remains conceptually risky even though comments now say the pool owns full-loop execution [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1191`-`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1194`]. Recommendation: change the prompt header to command-host/orchestrator framing for CLI lineages.

## Sources Consulted

- `.opencode/commands/deep/assets/deep_review_auto.yaml`
- `.opencode/commands/deep/assets/deep_research_auto.yaml`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`

## Assessment

- newInfoRatio: 0.9
- Novelty justification: This found a previously unconfirmed deep-research fan-out threshold propagation bug plus the hard timeout-cap risk.
- Confidence: High for threshold omission and comment hygiene; high for timeout cap math; medium for model adequacy impact because it depends on real iteration latency.

## Reflection

- What worked: Comparing review and research fan-out commands isolated the missing `--convergence-threshold` argument.
- What failed: No single test fixture ties command YAML argument rendering to runner prompt output.
- Ruled out: The runner itself is not the only bug for threshold threading; `buildLoopPrompt` can include the threshold, but research YAML fails to pass it.

## Recommended Next Focus

Audit implementation evidence and metadata for weak-evidence phases and resource-map/key-file coverage.
