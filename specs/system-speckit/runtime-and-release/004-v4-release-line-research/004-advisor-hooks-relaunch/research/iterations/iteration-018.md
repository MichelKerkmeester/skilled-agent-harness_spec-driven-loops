# Iteration 018 — Dispatch-audit log rooting, and the decision-capture / goal hooks

## Focus

The frontier this run had never read: the decision-capture hook, the goal hook under `.skilled/hooks/`, and every writer of `.skilled/logs`. Starting evidence was an artifact outside the repository root's log directory:

`specs/system-speckit/047-v4-release-line-research/.skilled/logs/cli-dispatch-audit.log` — 2,179 bytes, `mtime` 2026-11-08 21:13, first record `"runtime":"claude"`.

A nested `.skilled/logs` tree under a spec folder can only appear if a hook resolved the relative constant `.skilled/logs/cli-dispatch-audit.log` against the session's working directory instead of the repository root. This iteration located the writer and checked the same property across the cluster.

## Actions Taken

1. `rg -n 'cli-dispatch-audit'` across `.skilled .claude .codex .opencode .cursor .devin .pi .dsh`, plus a directory listing of `.skilled/hooks/` — established that the log is written by one shared core with six runtime adapters, and that the shared core exposes only a *relative* constant.
2. Read `.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs` in full (84 lines) — the writer for the observed artifact.
3. Diffed log-path resolution across all six audit adapters and located the repo-root helper they could share.
4. Read the decision-capture root resolution (`lib/capture-core.mjs` §7 PATHS) and the Claude ask-capture adapter's project-directory line.
5. Read the goal hook's root resolution (`lib/goal-core.cjs`, `lib/goal-slice.cjs`).
6. Swept for *every* `.skilled/logs` writer outside the dispatch concern.
7. Read the Claude preflight-lint rules root and its fail-open tail.
8. Verified whether the nested log tree is git-tracked or ignored.

## Findings

### f-iter018-001 — P1, bug: four of six audit adapters root the log at the session cwd, not the repository root

The shared core exports the log as a bare relative path:

`.skilled/hooks/dispatch/lib/dispatch-audit.mjs:1158` → `export const DEFAULT_LOG_RELATIVE_PATH = '.skilled/logs/cli-dispatch-audit.log';`

Each adapter then joins it to its own idea of a project directory. Two anchors are correct:

- OpenCode: `.opencode/plugins/cli-dispatch-audit.js:59` → `const projectDir = findRepoRoot(ctx?.directory || process.cwd());`
- dsh: `.skilled/hooks/dispatch/dsh/dispatch-audit.mjs:51` → `logPath: join(repoRoot, DEFAULT_LOG_RELATIVE_PATH),`

Four are not:

- Claude: `.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs:56` → `const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();`, joined at `:57`.
- Pi: `.skilled/hooks/dispatch/pi/dispatch-audit.ts:32` → `logPath: join(ctx.cwd, audit.DEFAULT_LOG_RELATIVE_PATH),`
- Codex: `.skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs:62` → `const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();`
- Devin: `.skilled/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs:61` → `const projectDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()` … `:63` → `: (process.env.DEVIN_PROJECT_DIR || process.cwd());`

The Claude line is the one that produced the observed artifact, and its ordering is the specific defect: the *least* stable source is consulted first and the *most* stable one second. `payload.cwd` in a Claude Code `PostToolUse` payload is the session's current shell directory, which `cd` mutates and which persists across tool calls; the dispatched commands in the observed log literally contain `cd /Users/.../specs/...`. Once the session's shell sits inside a spec folder, every subsequent dispatch record lands in that folder's own `.skilled/logs/`.

Materiality, stated honestly: the log is observe-only telemetry — `.skilled/logs/README.md:41` says it "never blocks a dispatch" — so nothing is gated on it. What is lost is the audit trail itself: dispatches continue to succeed while their records scatter to paths no operator recipe, doctor check or receipt reader consults. Confidence high on mechanism (a 2 KB file at a nested path is direct evidence); medium on how much downstream tooling assumes the canonical location, which this iteration did not enumerate.

Verify (writes only inside a scratch clone):

```bash
printf '%s' '{"tool_name":"Bash","cwd":"'"$PWD"'/specs/system-speckit/047-v4-release-line-research","session_id":"s","tool_use_id":"t","tool_input":{"command":"opencode run hi"},"tool_response":{"stdout":"x"}}' \
  | node .skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs
find . -path '*/.skilled/logs/cli-dispatch-audit.log'
```

Two rows in the `find` output — root and nested — confirm it.

### f-iter018-002 — P1, bug: the sibling Claude preflight reads the same field in the opposite priority order

`.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs:55` → `const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();`

Two adapters, one directory, same question, opposite precedence. The preflight is the *blocking* half — it denies a `PreToolUse` dispatch that breaks a declaring skill's hard rule (`:56` builds `skillsRoot` from that directory). It is safer only because `CLAUDE_PROJECT_DIR` is consulted at all; when that variable is absent it still falls back to `process.cwd()`, which inside a hook process is the session's directory. A missing `skillsRoot` yields no evaluated rules rather than an error, so the guard degrades to a silent approve — the fail-open tail is `main().catch(() => approve())`. Not exercised this iteration, so confidence is medium on materiality and high on the drift itself.

This is also the sharpest possible improvement signal: the two files disagree about a one-line decision, so neither ordering is load-bearing. The correct fix — `findRepoRoot(payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd())` — is smaller than the disagreement.

### f-iter018-003 — P2, over-engineering masked by a gitignore: the nested trees are *expected* rather than prevented

`.gitignore:263` → `/*/**/.skilled/logs/`

Someone wrote a rule that specifically ignores `.skilled/logs` at every depth below the root. That pattern does nothing for the intended single root-level log (`.skilled/logs/` already matches any other rule) and exists to silence exactly the class of artifact f-iter018-001 produces. `git check-ignore -v` resolves the observed file through this line, and `git ls-files --error-unmatch` reports it untracked.

So the stray tree is invisible to git *and* invisible in review, which is why a P1 path bug could live across a whole release line without anyone noticing. Name what breaks if the rule is removed: nothing functional — the artifact becomes visible as untracked, which is the point. The 8-line trade this finding proposes is: keep the ignore only after the resolver is anchored, because until then the rule is the symptom's anaesthetic. Confidence high (the line is unambiguous and the resolution was run).

### f-iter018-004 — P2, drift: the log README describes one location for a log that has five

`.skilled/logs/README.md:32` attributes `cli-dispatch-audit.log` to six writers in a single row and describes one schema for one file. `.skilled/hooks/dispatch/README.md:102` is accurate in isolation — it says the OpenCode adapter "anchors the log path to the repo root via `findRepoRoot`" — but by claiming anchoring for precisely the one adapter that has it, it invites the reader to assume the other five do too. The operator-facing consequence is concrete: the documented inspection recipe at `.skilled/logs/README.md:58` (`tail -n 1 .skilled/logs/cli-dispatch-audit.log`) keeps printing the last record written *before* the session's cwd drifted, and nothing distinguishes "no dispatches since" from "dispatches recorded elsewhere". Recorded as drift, not as a second bug: the doc was true when the anchor existed only in OpenCode, and became misleading as adapters were added.

### f-iter018-005 — P2, improvement: move the root decision into the shared core, once

The core already owns the path (`:1158`) and already receives the finished `logPath` from every adapter. Give it the root instead:

```js
export function resolveLogPath(projectDir) {
  return join(findRepoRoot(projectDir), DEFAULT_LOG_RELATIVE_PATH);
}
```

and change each adapter's two lines to one. Removes four independent, divergent implementations of the same decision; adds no new dependency, since the OpenCode adapter already imports `findRepoRoot` and the dsh adapter already computes `repoRoot`. Caveat worth naming: `findRepoRoot` exists twice at the same signature — `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:112` and `.skilled/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs:112` — so the shared core must pick one, and a mirror that drifts is a worse outcome than the current duplication. Confidence high that the two exports are identical in shape; whether their bodies are identical was not diffed this iteration.

### f-iter018-006 — P2, extension: a doctor check that fails on a nested `.skilled/logs` tree

Nothing in the doctor or hook-install surface notices the artifact. One `--check`-shaped assertion closes the class permanently:

```bash
find . -type d -name logs -path '*/.skilled/logs' -not -path './.skilled/logs'
```

A non-empty result is a hook that resolved a relative path against a session directory. This is the extension the focus asked for: it is nine words of shell, it needs no new runtime, it catches every future adapter that repeats f-iter018-001, and it is more durable than fixing four files by hand. Severity P2 because it is a guard-rail, not a defect.

### f-iter018-007 — P2, operator UX: telemetry loss is silent in both directions

An operator debugging a bad dispatch has exactly two signals — the log line and the log file. f-iter018-001 breaks the second without breaking the first: the dispatch still returns its normal output, the hook still exits 0, and the canonical log simply stops growing. There is no counter, no stderr note, no doctor row. The cheapest remedy is a single field rather than new machinery: `recordDispatch` already writes `runtime`; adding `logRootSource: 'repo-root' | 'payload-cwd'` to the record makes a drifted write self-describing the next time anyone inspects it, and costs nothing when the anchor is correct.

## Questions Answered

None of the three remaining §3 key questions was closed this iteration; the work landed on the hook-log frontier instead. Recorded here rather than claimed in `answeredQuestions`.

One carried-forward question *was* materially advanced — hook safety, the git-call time limit and the stdin deadline are now located rather than open:

- The git-call time limit is **5,000 ms**, set on the `rev-parse --show-toplevel` call in `.skilled/hooks/decision-capture/lib/capture-core.mjs:256`, inside a helper that caches per input directory (`:242`) so the cost is one subprocess per distinct working directory, not per question.
- The stdin deadline has a **3,000 ms** default, with a **64 MiB** byte cap: `.skilled/hooks/shared/hook-adapter-shared.cjs:29` → `function readStdin({ timeoutMs = 3000, maxBytes = MAX_STDIN_BYTES } = {})`. Both values are bounded and sane, which retires the "unbounded hook stdin" worry for adapters that use the shared reader.

## Questions Remaining

- **The two anchors that are already right are the answer to the fix.** `.skilled/hooks/goal/lib/goal-core.cjs:175` (`resolveRepoRoot`) and `:193` (`join(repoRoot, STATE_SUBDIR)`) anchor the goal state; `.skilled/hooks/goal/lib/goal-slice.cjs:253` walks upward testing for `.git` or `.skilled/skills`. Decision-capture anchors through git itself, with environment scrubbing and a fallback: `.skilled/hooks/decision-capture/lib/capture-core.mjs:242` through `:268`. Three concerns in this cluster solved the same problem three ways and only the dispatch adapters skipped it. Whether the goal and decision-capture implementations agree on a non-git directory is unread.
- **Does anything read the canonical log and act on its absence?** f-iter018-001's severity rests on it. A read of `completion-sentinel` and any receipt/liveness check that tails `.skilled/logs/cli-dispatch-audit.log` would settle P1-vs-P2, and this iteration did not check.
- **Are the two `findRepoRoot` bodies identical?** f-iter018-005 depends on it.
- **Do the Codex and Devin payloads actually drift the way Claude's does?** The Claude drift is evidenced by a file on disk; for the other two it is inferred from identical source shape. A Cursor adapter, by contrast, uses `payload?.workspace_roots?.[0]` (`.skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs:70`) and is likely immune — worth one read to confirm which adapters share the class.
- Carried and untouched: the advisor degraded-daemon path and the two-launcher race (now the run's oldest unexercised claim); which layer drops the advisor redirect; `hook-flags.sh` vs `hook-flags.cjs` differential; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; the generation-1 advisor follow-ups (`sk-create-skill-parent` shared-packet entry, duplicate `package_skill.py`).
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history — still unreached after fifteen iterations. This iteration produced an extension and a UX finding, but in the hook-telemetry cluster, and they should not be counted against that question.

## SCOPE VIOLATIONS

None. Every read was read-only. No fix was applied: the resolver change in f-iter018-005 and the doctor assertion in f-iter018-006 are proposals, and the verify command in f-iter018-001 is written for an operator to run inside a scratch clone, not run here.

## Next Focus

Read what consumes the canonical log — `completion-sentinel`, any receipt reader, any liveness check — to decide whether a fragmented audit trail is P1 or P2, then read the two `findRepoRoot` bodies to make f-iter018-005 safe to propose as a change. Both are single reads. After that the run's largest untested claim is the advisor's degraded daemon and two-launcher race, which has now been carried across ten iterations and is the one item no amount of reading will settle.
