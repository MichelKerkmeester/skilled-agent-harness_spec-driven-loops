---
title: "Iteration 6: Shared-Library Integrity — Orphans, Drift, and One CI Guard"
trigger_phrases: []
---
# Iteration 6: Shared-Library Integrity — Orphans, Drift, and One CI Guard

## Focus
Are every `check:` named in a `cli-*` SKILL.md implemented in the registry, and is every registry check reachable from some skill? Name orphans in both directions; identify adapter drift (severity, dispatch-shape detection, rule parsing re-implemented locally); quantify the drift risk; propose one guard that would catch it in CI.

## Findings

1. **There are zero orphans in either direction — verified by running the parser and registry, not by reading.** All seven `cli-*` SKILL.md files declare 17 distinct check ids; `CHECKS` exports exactly the same 17. `declared-but-missing: []`, `implemented-but-undeclared: []`. The shared library is complete and fully reachable today. [SOURCE: probe importing `parseHardRules`/`KNOWN_CHECKS` over `.opencode/skills/cli-external-orchestration/cli-*/SKILL.md`, 2026-09-15]

2. **The CI guard that exists covers one direction only.** `dispatch-rule-checks.test.mjs` enumerates the `cli-*` directories and asserts every declared check id is in `KNOWN_CHECKS` — the declared→implemented direction. Nothing asserts the reverse: a future check added to `CHECKS` and wired into no skill would be invisible to CI (dead code that still fails open). The direction matters less in practice but completes the bijection for one extra assertion. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:29-45]

3. **No adapter re-implements severity mapping, rule parsing, or dispatch-shape detection.** Claude, Codex, and Devin preflight adapters import `readHardRules`, `evaluate`, and `DISPATCH_SHAPES` from the shared library; the Pi adapter does the same and layers only its own authorization policy on top; Cursor's post-tool-use proxy delegates to the Claude audit adapter rather than reimplementing it; the OpenCode plugin uses the shared audit core. The severity partition each adapter performs (`v.severity === 'block'` vs `'warn'`) reads the mapping `evaluate` already applied — it is consumption, not re-implementation. [SOURCE: .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs:21-22,86-88] [SOURCE: .opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs:21-22] [SOURCE: .opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs:20-21] [SOURCE: .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:261-275]

4. **Realized drift #1 — two dispatch-shape registries, already disagreeing.** `DISPATCH_SHAPES` (audit + every preflight) and `HEADLESS_DISPATCH_SHAPES` (the stdin check) are independent lists. The codex entry diverges: the audit registry demands `-p|--print` after `codex exec`, the stdin registry does not, and the real codex dispatch has no print flag. The README calls `DISPATCH_SHAPES` "the single source of truth … shared by both concerns so the before-lint and the after-audit can never disagree about a command's shape" — they disagree today. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-audit.mjs:27-41] [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:78-89] [SOURCE: .opencode/hooks/dispatch/README.md §1]

5. **Realized drift #2 — four model rosters exist as literal duplicates, and one duplicate already disagrees.** `CURSOR_ALLOWED_MODELS`, `PI_ALLOWED_MODELS`, `DEVIN_ALLOWED_MODELS`, `HERMES_ALLOWED_MODELS` in `fanout-run.cjs` each state "Mirrors … in executor-config.ts". The codex builder default (`o4-mini`) does not match the packet's documented codex default (`gpt-5.5`) — a different kind of copy drift in the same file. The rosters are deliberately duplicated to keep the CJS builder import-free, so the drift risk is structural, not accidental. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2242-2244,2279-2282,2395-2397,2591-2595,2070] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:241,262,366,438]

6. **Realized drift #3 — documentation counts.** The dispatch README documents "the five checks currently registered" against a 17-check registry, and the availability block's own comment says "The four availability rules below" above five implementations. Neither affects execution; both mislead the next auditor, as this research already showed in iteration 1. [SOURCE: .opencode/hooks/dispatch/README.md §2 table] [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:162-170]

7. **The fan-out builder is a second enforcement path that never consults the rule engine — by design, with one divergence to account for.** It composes commands that satisfy the declared rules (conditional `--yolo`, explicit `-t` without delegation/memory, `--ignore-rules`, no `--worktree`) but closes stdin through process `stdio`, not through a `</dev/null` token in the command string (`stdio: [process.stdin.isTTY ? 'ignore' : 'pipe', …]`). So the command strings a lineage logs would each trip `stdin-redirect-required` if a human pasted them into a shell, while the lineage itself cannot hang. That is an intentional difference, not a defect; a shape-parity guard must treat the builder's spawn-level stdin handling as satisfying the rule. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:63,1877,2676-2683]

8. **The right reuse pattern already exists as a counter-example to drift: sk-git.** Both transports (OpenCode plugin and Claude/Cursor shell hook) import one shared `evaluate`/`readHardRules` and one shared `GIT_CHECKS`/`GIT_SHAPE` from `git-rule-checks.mjs`; two adapters, one rule source. That is the model the dispatch shapes should follow — one registry, two consumers — instead of the two parallel shape lists in finding 4. [SOURCE: .opencode/plugins/sk-git-preflight-advisory.js:17-21,101-114] [SOURCE: .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs:28]

9. **One guard that would have caught every realized drift above: a table-driven shape-parity + bijection test.** A single test file, three assertions over a fixture table of one documented dispatch command per runtime:
   (a) **shape parity** — for each runtime's documented command, `DISPATCH_SHAPES` resolves it to that runtime's skill AND `HEADLESS_DISPATCH_SHAPES` recognizes it as headless; the codex fixture fails today, catching finding 4;
   (b) **bijection** — declared check ids across `cli-*` skills equal `KNOWN_CHECKS` exactly, both directions; closes finding 2's unguarded half;
   (c) **roster agreement** — each `*_ALLOWED_MODELS` in `fanout-run.cjs` equals its `executor-config.ts` counterpart, and each builder default model is in its own roster; catches finding 5's class without importing TypeScript into the hook tree.
   Severity mapping and rule parsing need no guard: each already has exactly one implementation site. (c) requires exporting the comparison from the runtime tests rather than the hook tests, since only the runtime side can read the TS source.

## Ruled Out
- Suspecting adapter-level re-implementation: every adapter imports the shared engine; the only locally defined registries are domain extensions (sk-git's `GIT_CHECKS`) that share the engine and one rule source between their own transports. [SOURCE: .opencode/plugins/sk-git-preflight-advisory.js:17-21]
- Adding a third copy of the model rosters into the hook engine to enable allowlist checks: finding 5 shows the copy problem is already structural; a third copy multiplies it. [INFERENCE: based on finding 5]

## Dead Ends
- Searching for orphan checks by name: the bijection probe is exhaustive — 17/17 both ways, nothing orphaned. Any claim of an orphan would have to come from a check declared outside the `cli-*` directories, and sk-git's rules use a separate registry by design. [SOURCE: probe 2026-09-15]

## Edge Cases
- Contradictory evidence: the README's "single source of truth" claim versus the two shape lists — resolved in favor of the code (the lists are distinct and disagree), with the README treated as stale documentation. [SOURCE: both cited in finding 4]
- Partial success: the proposed guard's assertion (a) needs one documented command per runtime; the packet documents pinned shapes for all seven (claude/codex/devin/cursor/pi/opencode pins and hermes's executor-kind reference), so fixtures are available. [INFERENCE: based on the SKILL.md default-invocation blocks]
- Missing dependencies: none; the guard reuses `parseHardRules`, `KNOWN_CHECKS`, `DISPATCH_SHAPES`, and the exported check functions.

## Sources Consulted
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
- .opencode/hooks/dispatch/lib/dispatch-audit.mjs
- .opencode/hooks/dispatch/README.md
- .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs
- .opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs
- .opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs
- .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts
- .opencode/plugins/sk-git-preflight-advisory.js
- .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
