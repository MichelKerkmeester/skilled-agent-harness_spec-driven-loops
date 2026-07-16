# Design Unknown Resolutions

## a) RESOLVED - OpenCode prompt-injection insertion point

The compiled command contract should be injected as command-scoped Markdown at the top of the command body, not through an OpenCode plugin or global runtime context.

For `/deep:review`, the concrete seam is inside `.opencode/commands/deep/review.md`, after the YAML frontmatter and H1, before the current router prose and `## 1. ROUTER CONTRACT`. The frontmatter must stay first because it declares command metadata and tool allowance (`.opencode/commands/deep/review.md:1-5`). The command body is already the command-scoped prompt surface: it identifies the file as the thin router (`.opencode/commands/deep/review.md:7-15`), owns setup binding before YAML handoff (`.opencode/commands/deep/review.md:68-75`), and loads the selected workflow only after setup values are bound (`.opencode/commands/deep/review.md:90-97`).

Do not use prompt-time plugins for the compiled contract. The plugin directory auto-loads every `.js` file once per session (`.opencode/plugins/README.md:24-28`), and the live plugins append additive global/system context through `experimental.chat.system.transform`, for example code graph (`.opencode/plugins/mk-code-graph.js:442-467`), memory continuity (`.opencode/plugins/mk-spec-memory.js:404-413`), skill advisor (`.opencode/plugins/mk-skill-advisor.js:610-675`), and active goal (`.opencode/plugins/mk-goal.js:2265-2276`). Those hooks are session-level additive transforms, not the deterministic command-body insertion point needed for a command-specific compiled contract.

Design consequence: the compiler should render or splice the compiled block into the command Markdown immediately before the existing router contract section, while keeping the current asset/YAML handoff semantics intact. This preserves the seed design's requirement that the compiled Markdown be the first prompt block visible to the executor (`design.md:50-52`).

## b) RESOLVED - Checksum ownership across generated Markdown

The compiler owns generated checksums. Maintained source files own the contract truth; the compiled Markdown owns only a generated digest manifest and generated body.

The compiled artifact should carry a generated header containing `sourceDigests` for every maintained source slice and a `compiledBodyDigest` for the normalized generated body. The body digest must exclude the digest header itself to avoid a self-referential hash. The seed schema already reserves `sourceDigests` (`design.md:11-15`), names the compiled Markdown target (`design.md:50`), and defines the source-over-generated drift rule (`design.md:70-72`). The phase requirements require this ownership decision before implementation (`spec.md:69-72`).

Drift guard read path:

1. Read `sourceDigests` from the generated Markdown header.
2. Recompute digests for the live maintained sources and fail when any recorded source digest is stale.
3. Re-render the contract from live sources and recompute the normalized compiled body digest, excluding generated digest metadata.
4. Fail when the current checked-in compiled body differs from the re-rendered body, unless an explicit accept-drift command records the new digest delta.

This keeps the checked-in compiled file grep-checkable and self-describing without making it authoritative over its sources. The recovery command remains the compiler write path described in the seed design (`design.md:70-72`).

## c) RESIDUAL-RISK - CLI-executor receipt/progress parity under fan-out

Receipt/progress parity is not identical across native Task dispatch, single-executor CLI dispatch, and fan-out.

Confirmed receipt support exists for audited single-executor CLI branches. The runtime wrapper supports opt-in receipts through `receiptDir` and `dispatchId` (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:90-108`), writes an intent receipt before dispatch (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:544-555`), writes a completion receipt after dispatch (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:558-582`), and the post-dispatch validator requires and verifies receipt pairs only when `dispatchReceipt` is supplied (`.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:46-50`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:879-924`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1642-1653`). `/deep:review` single-executor CLI branches route through that wrapper and pass receipt paths (`.opencode/commands/deep/assets/deep_review_auto.yaml:905-958`, `.opencode/commands/deep/assets/deep_review_auto.yaml:974-1027`). `/deep:research` does the same for its CLI branches (`.opencode/commands/deep/assets/deep_research_auto.yaml:866-908`, `.opencode/commands/deep/assets/deep_research_auto.yaml:928-981`).

Fan-out does not currently share that receipt path. `/deep:review` fan-out sends all lineages through `fanout-run.cjs` (`.opencode/commands/deep/assets/deep_review_auto.yaml:154-184`), and `/deep:research` fan-out does the same for CLI lineages (`.opencode/commands/deep/assets/deep_research_auto.yaml:150-168`). The fan-out runner builds CLI/native commands itself (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1275-1359`) and executes them through its own async `spawn()` wrapper (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1186-1198`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1655-1669`). It imports `buildExecutorDispatchEnv` and stamps recursion-guard state (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1383-1390`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1626-1632`), but it does not call `runAuditedExecutorCommand` or pass `receiptDir`/`dispatchId` in the fan-out spawn path.

Progress/liveness is also split by mechanism. The shared progress-record contract defines additive `progress_record` events, completion filtering, and valid started/completed pairs (`.opencode/skills/deep-loop-workflows/shared/progress/progress-record.cjs:10-28`, `.opencode/skills/deep-loop-workflows/shared/progress/progress-record.cjs:77-103`). Context fan-out explicitly requires per-seat started/completed progress records (`.opencode/commands/deep/assets/deep_context_auto.yaml:380-388`, `.opencode/commands/deep/assets/deep_context_auto.yaml:430-448`). `fanout-run.cjs` instead uses an orchestration status ledger plus heartbeat and stall-watchdog events (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1111-1155`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:341-386`).

Design consequence: the compiled contract can reference the existing receipt and progress primitives, but it must not claim parity yet. The build phase must either route fan-out subprocesses through the audited receipt writer, or define a fan-out receipt adapter with the same intent/completion validation semantics. Until that is wired, receipt parity remains a residual risk; progress parity should be documented as per-seat `progress_record` for context sweeps and orchestration-ledger liveness for autonomous lineage fan-out.
