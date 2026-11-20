# Iteration 1: F-1-002 cross-CLI execution contract

## Focus

Frontier node F-1-002 (depth 1, scope fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts, runtime/scripts/dispatch-iteration.cjs, .claude .codex .pi .dsh .vibe .opencode mirrors against .skilled): Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences?

The node was read as: enumerate the differences that survive the delivered backlog rows (2, 9, 13, 18a) and propose the smallest contract plus test that retires the rest. The mirror half was checked as an observable gate rather than assumed.

## Actions Taken

1. Read `LINEAGE_COMMAND_ADAPTERS` and all eight builders in `fanout-run.cjs` (lines 2615-3618), including `finalizeLineageCommand` and the capability fields it already publishes.
2. Read `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`, `EXECUTOR_SESSION_ENV_BY_KIND` and `EXECUTOR_STATE_ENV_BY_KIND` in `executor-config.ts` and `executor-audit.ts`.
3. Read the single-executor branches in `dispatch-iteration.cjs` (`runClaude`, `runLineageBuiltin`, `runResearchOpencode`, `runCodex`, `runDeepseekHarness`) and compared their sandbox handling.
4. Read the failure classifiers `detectPendingQuestion` and `classifyLineageFailure` in `lib/cli-guards.cjs`, and the only cost extractor `sumProviderCostFromLog` in `fanout-salvage.cjs`.
5. Read the adapter stress matrix (`tests/stress/cli-adapter/matrix-manifest.ts`) and suite assertions (`fixtures/adapter-suite.ts`), then ran both mirror gates.

## Findings

1. **`--sandbox-mode` round-trips for only three of the eight kinds; five single-executor branches hardcode `workspace-write`.** `runClaude` derives the Claude permission mode from `context.sandboxMode` and `runResearchOpencode` resolves `context.sandboxMode` (falling back to `danger-full-access`), but `runCodex` sets `sandboxMode: 'workspace-write'`, `runLineageBuiltin` (cursor, devin, pi) sets `const sandboxMode = 'workspace-write'`, and `runDeepseekHarness` sets it the same way. A documented `--sandbox-mode=read-only` therefore becomes `workspace-write` on five kinds with no warning, and the audit row records the hardcoded value, not the requested one. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:421] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:483] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:538] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:902]

2. **The iteration prompt travels over three channels and no adapter declares which one it uses.** `promptArgIndexes: [1]` for claude and cursor, `[args.length - 1]` for opencode and pi, `input: prompt` with an empty argv for codex and dsh, and `--prompt-file` with no argv prompt for vibe. The redaction and fingerprint code handles all three, but neither `EXECUTOR_KIND_FLAG_SUPPORT` nor `effective_config` publishes `promptChannel`, and nothing enforces a maximum prompt size on the argv channel (the dogfood prompts were 46k characters). A single contract field would let a dispatch refuse or switch channel before spawn. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2684] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2721] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2792] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3192] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3368] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3587]

3. **Cost observability is one adapter's log shape, and the summary publishes a null without saying which kinds are unknown.** `sumProviderCostFromLog` sums only `{"type":"step_finish","part":{"cost":…}}` rows, which is opencode's shape. Claude and Cursor request `--output-format text`, Codex, Pi and Devin pass no format flag, and Vibe writes a separate export, so `provider_cost_usd.by_lineage` is null for those kinds and `total` is null for the run. That honest roll-up has no per-kind capability statement, so an operator cannot tell "unknown cost" from "kind cannot report cost". [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2713] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2970] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4969]

4. **`needs_input` can only fire on a text transcript, so JSON-log kinds cannot be classified.** `detectPendingQuestion` scans the last twelve non-empty lines and treats a trailing `?` as a pending question; both call sites feed it the saved stdout/stderr. Opencode (`--format json`), dsh (`--json`) and Vibe (export file) end on structured records, so a clean exit that asks a question is classified `artifact_miss` or `exit` instead of `needs_input`, while a prose-ending text run can false-positive. The classifier is one taxonomy, but its input is format-dependent. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:186] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4779]

5. **"Session resume" is artifact resume only, and the code models it for half the kinds.** No builder forwards a resume or session flag: claude runs `-p`, codex runs `exec`, opencode runs `run --standalone`, and the four other builders do the same without a session argument. `EXECUTOR_SESSION_ENV_BY_KIND` names a session env for codex, claude, opencode and cursor and deliberately omits pi, vibe and dsh; `EXECUTOR_STATE_ENV_BY_KIND` names a state dir for every kind. For dsh the gap is structural: one fresh `DSH_HOME` is created per attempt and removed when the attempt settles, so a retry cannot resume the previous attempt's harness state even if a resume flag existed. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:89] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:103] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4262] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4669]

6. **The adapter stress matrix covers failure and isolation but has no row for output observability, prompt channel, resume identity or effort surface, and its per-kind assertions duplicate the builders.** The fourteen rows are auth, model-or-balance, rate-limit, timeout, stdin, child gate, sandbox, transport, budget, partial death, orphan, worktree, node_modules and self-invocation. `expectSuccessArgs` then hard-codes a `switch (kind)` block per adapter, which is a second copy of each builder's flag decisions rather than one declarative contract. The matrix also still marks every non-codex cell `pending` in `CLI_ADAPTER_STRESS_MATRIX`, and per-kind rows live in a separate `CLI_ADAPTER_PHASE_TWO_ROWS`. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:18] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:70] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:92]

7. **The mirror half of the question does not reproduce: both mirror gates pass at HEAD.** `check-agent-mirror-sync.cjs --all` reports "11 agent(s) checked — all comparable mirrors in sync — OK" (exit 0), and `validate-command-tree-parity.sh --quiet` exits 0. The sanctioned differences are structural, not drift: `.codex`, `.pi`, `.dsh` and `.vibe` carry zero command files, while `.skilled` carries eleven, `.claude` eight and `.opencode` eleven. So a new mirror checker would be redundant; the missing conformance surface is executor behaviour. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:1] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:31]

## Questions Answered

- Where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ? Answered in Findings 1-5 with file:line evidence.
- What single adapter contract and conformance test would remove the differences, including the mirrors? Proposal in the Findings 1-6 synthesis: a declarative `ADAPTER_CAPABILITY_MANIFEST` keyed by `ExecutorKind` carrying `promptChannel`, `outputFormat`, `costSource`, `resumeIdentity`, `effortSurface` and `sandboxSurface`, consumed by one table-driven test that iterates `EXECUTOR_KINDS`; mirrors need no new gate.

## Questions Remaining

- Whether the delivered "one executor path" still leaves two argument builders (the fan-out builders and `runClaude`/`runCodex`) or whether `dispatch-iteration.cjs` should call the builders for those two as it does for cursor/devin/pi.
- Whether `EXECUTOR_SESSION_ENV_BY_KIND` is read anywhere to store a rerun identity, or is detection-only prose.

## Recommended Next Focus

Frontier node F-1-004: frontier economics. The Q2 material is now specific enough that the held row 13 question (one executor path) can be answered by the same capability table, so the economics of when to build it belongs to F-1-004. Proposal rows under F-1-002 are limited to the stress-suite gating and session-identity questions below.

## Ruled Out

- **Adding a new mirror-drift checker.** Both existing gates pass at HEAD, and the crosswalk documents the absent command trees as sanctioned. Building another checker adds a second source of truth for a surface that is already green.
- **Reading `--output-format json` support from the CLI help only.** The adapters are already pinned to live-verified flags in comments; a help probe would not prove the runner reads the resulting log shape, which is the actual gap.
- **Treating the stress matrix as already conformant because it names all 14 rows.** The names exist, but the rows do not include the four differences this iteration found, and the non-codex cells are declared pending.

## Dead Ends

- Grepping `fanout-run.cjs` for a per-kind session-id capture that could feed a rerun: only `readStoredLineageSessionId`, which reads the lineage's own config, exists. No provider session id is stored for a retry.
- Looking for a shared `resolveSandboxMode` in the single-executor branches: each branch computes its own, which is the root of Finding 1.

## Edge Cases

- Ambiguous input: none. The node named three files; all three were read.
- Contradictory evidence: the topic says cli-claude-code "still uses --output-format text". Confirmed in both the fan-out builder and the single-executor builder, so no contradiction.
- Missing dependencies: none. The mirror gates and the stress suite are present locally.
- Partial success: none. Every planned read and both gates succeeded.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2615`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2684`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2721`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2792`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3192`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3368`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3587`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4262`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4669`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4969`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:421`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:483`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:538`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:902`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:159`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:89`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:103`
- `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:186`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:18`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:92`
- `.skilled/bin/check-agent-mirror-sync.cjs:1`
- `.skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:1`
- `.skilled/bin/agent-mirror-crosswalk.md:31`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md:39` (46k-character prompts)
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-review-gen2.md:166` (text log carries no tokens or cost)

## Assessment

- New information ratio: 0.79
- Questions addressed: the cross-CLI difference enumeration; the single adapter contract.
- Questions answered: both questions the node named, at the level of concrete file:line differences and a concrete contract shape.
- Finding mix: 4 fully new (sandbox fidelity, prompt channel, needs_input, resume), 3 partially new (cost observability builds on the delivered cost reader; the matrix gap builds on the one-executor-path work; the mirror check confirms a claim rather than adding a mechanism).

## Reflection

- What worked and why: reading the builders and the single-executor branches side by side made the sandbox divergence visible in one pass; the two paths share a name but not a resolver. Running the mirror gates turned a plausible drift claim into a checked negative, which is stronger than another recommendation.
- What did not work and why: grepping for a stored provider session id found nothing, because the runner never stores one. That absence is itself the finding, but it cost a search to establish.
- What I would do differently: read `expectSuccessArgs` before the builders, so the duplication between the test switch and the builders would have been the organizing frame rather than a late observation.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was written.
