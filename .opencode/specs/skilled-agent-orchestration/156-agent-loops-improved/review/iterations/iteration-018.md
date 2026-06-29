# Dimension

security: cross-cutting: secrets/log redaction, world-writable paths, TOCTOU, unsafe deserialization across all

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1-469`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:1-585`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts:1-95`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1-217`
- `.opencode/plugins/mk-goal.js:1-1490`
- `.opencode/commands/goal.md:1-62`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1-380`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:1-431`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1-1358`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:1-177`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs:1-145`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs:1-141`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:1-975`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:1-764`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1-1029`
- `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:1-246`
- `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:1-311`
- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:1-797`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:1-767`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1-1172`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:1-150`
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:1-211`
- `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:1-317`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:1-855`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:1-703`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:1-1445`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs:1-172`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:1-374`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:1-398`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:1-427`

# Findings by Severity

## P0

None.

## P1

### R18-P1-001 - Fan-out review subprocesses get repo-wide write power while isolation is only prompt-enforced

- Evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:96`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:620`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:802`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:837`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1018`
- Why: `normalizeSandboxMode` defaults missing sandbox config to `workspace-write`; the lineage prompt says to write only under `lineageDir`; Codex receives `--sandbox workspace-write`; OpenCode is launched with `--dangerously-skip-permissions`; and the implementation comment states the lineage-dir boundary is enforced by the prompt rather than a narrower sandbox. A prompt is not a security boundary, so a buggy or prompt-injected child can modify reviewed files or shared state outside the lineage artifact directory during normal fan-out review.
- Suggested fix direction: fail closed for review/context fan-out unless the executor can be constrained to the lineage artifact directory; otherwise run children in a temporary worktree rooted at `lineageDir`, pass a sandbox that cannot write the source repo, and copy only validated artifacts back.
- Claim: Fan-out CLI lineages can write outside their intended artifact directory by default.
- Counterevidence sought: I looked for path-scoped sandboxing, chroot/worktree isolation, or a caller-enforced default `sandboxMode`, but found the default write sandbox and prompt-only boundary in the command path.
- Alternative explanation: The comment may reflect an accepted product trade-off because current CLIs lack path-scoped write sandboxes; that still leaves the advertised lineage boundary unenforced.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Downgrade if every production fan-out caller always supplies a true path-limited sandbox or isolated worktree outside this module before `fanout-run.cjs` executes.

### R18-P1-002 - Coverage graph metadata is accepted and re-emitted without redaction

- Evidence: `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:221`, `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:269`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:541`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:664`, `.opencode/skills/deep-loop-runtime/scripts/query.cjs:207`, `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts:118`
- Why: `upsert.cjs` copies arbitrary node/edge `metadata` into graph rows, the DB serializes it wholesale, and coverage query helpers parse and return the full metadata object to `query.cjs` responses. The sibling council query surface has an explicit `sanitizeMetadata` allowlist, which confirms the expected prompt-safe boundary exists elsewhere but is missing for coverage graphs. A normal graph event carrying `token`, `api_key`, copied `.env` text, or credentials in metadata will be persisted and emitted into query stdout for downstream prompts/logs.
- Suggested fix direction: add a coverage-graph prompt-safe projection that allowlists known scalar metadata keys and redacts common secret patterns before query output; keep full metadata only in storage if needed, or reject sensitive keys at upsert time.
- Claim: Coverage graph query output can leak secrets from arbitrary metadata.
- Counterevidence sought: I searched for a coverage-graph metadata sanitizer and found only council-scoped sanitization; coverage query branches return raw parsed metadata.
- Alternative explanation: Producers may intend metadata to contain only non-sensitive fields, but that contract is not enforced by `upsert.cjs` or the DB/query layer.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Downgrade if all coverage graph producers validate metadata against a non-sensitive schema before invoking `upsert.cjs` and query output is never sent to prompts or logs.

## P2

### R18-P2-001 - Fan-out persists raw subprocess stdout for salvage without a redaction pass

- Evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:730`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1089`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1100`, `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:28`, `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:124`
- Why: fan-out captures child stdout up to 20 MiB, writes it verbatim to `logs/fanout-lineage.out`, and salvage can copy up to 50k recovered text into an iteration markdown file. If a child prints credential-bearing tool output or source content during a failed lineage, the salvage/debug artifacts retain it unredacted.
- Suggested fix direction: run captured stdout through a shared redaction helper before writing logs or salvaged markdown; persist a bounded raw log only behind an explicit debug flag and outside review artifacts.

# Verdict

CONDITIONAL

# Notes

The goal plugin applies evidence redaction before persistence/output, so I did not report it. The loop-lock host-local socket guard has a predictable temp path, but I found it only on an opt-in API/test path in this slice, so I did not count it as an active defect for this iteration.
