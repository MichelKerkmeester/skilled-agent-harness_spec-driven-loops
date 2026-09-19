# Iteration 2: Security — CLI dispatch trust boundary + benchmark harness

## Focus

Dimension: Security. Files: `.opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts`, `src/config/enablement.ts`, `.opencode/skills/sk-communication/benchmark/reply-harness/{generate-prompts.mjs,score.mjs}`. Scope: trust-boundary handling for the external-CLI dispatch path (untrusted third-party CLI output, subprocess argv/env construction) and the enablement gate's fail-open/fail-closed default, since these are the security-relevant surfaces `sk-communication`'s routing touches per `spec.md` §3 In Scope ("Changes to sk-communication ... and its routing to the wording standard").

## Scorecard

- Dimensions covered: security
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

None active this iteration.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `spec.md:113-118` Out of Scope note | Confirmed the subprocess/env architecture (`src/transports/cli.ts`) is the frozen packet-001 invariant `spec.md` explicitly excludes from this packet's scope; verified the exclusion is real by reading the actual code rather than taking the exclusion on faith |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: security
- Novelty justification: Confirmed `defaultChildProcessSpawn` (`src/transports/cli.ts:214-282`) uses `child_process.spawn` with an array-form `command`/`args` pair (never `shell: true`, never string-concatenated argv), so untrusted rewrite content delivered via stdin or a `prompt-arg` cannot break out into shell metacharacter injection. Confirmed `isProjectionEnabled()` (`src/config/enablement.ts:47-58`) fails closed: with neither the env var nor the git-ignored local override set, projection stays off, so pulling the repo cannot silently start routing replies through external CLIs. Confirmed the benchmark harness (`generate-prompts.mjs:46,106`, `score.mjs:183`) uses `execFileSync` with array args exclusively, no `exec`/`eval`/shell-string construction anywhere in either file.

## Ruled Out

- **Full `process.env` passthrough to external-CLI subprocesses** (`src/transports/cli.ts:221`, `env: { ...process.env, ...request.env }`): a real broadened trust surface — every external CLI subprocess (including third-party binaries like `cli-cursor`/`cli-devin`) inherits the full parent environment, not a scoped allowlist — but this file is untouched by this packet's diff (`git diff` shows zero changes to `src/transports/cli.ts`) and `spec.md` §3 Out of Scope explicitly freezes "the projection package's byte-safety, privacy and provider invariants" as owned by packet 001. Filing this as an active finding against packet 006 would violate the review's own declared scope boundary (`deep-review-strategy.md` §4 Non-Goals). Recorded here as a pointer for a future security review of packet 001's invariants, not as an active finding of this review.
- Command injection via the benchmark harness's `execFileSync("git", ["show", `${commit}:${p}`], ...)` (`generate-prompts.mjs:46`): ruled out, array-form `execFileSync` never invokes a shell, so a crafted `commit`/`p` value cannot inject shell syntax; worst case is an invalid git ref that fails the call, already handled by the surrounding `try/catch` → `die()`.

## Dead Ends

None this iteration.

## Recommended Next Focus

Iteration 3: Traceability. Run `spec_code` and `checklist_evidence` against the parent `goal.md` completion checklist (one row unchecked — "The 10 reply-shape candidates and the 5 decision, handback and evidence candidates are in their rule files" — while the LOG table below it marks both 006 and 008 phases "Done"; resolve whether this is a stale checkbox or a real gap) and against each child phase's `acceptance-criteria.md`. Also verify the `002-synthesis-and-decisions/decision-record.md` ADR count matches `goal.md`'s "nine ADRs" claim (D1).
