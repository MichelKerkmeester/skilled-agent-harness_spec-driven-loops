---
title: "Findings: open questions and baseline for OpenCode dual compatibility"
description: "Verdicts with evidence for eleven open questions about OpenCode 1.19.3 and 2.0.32, and the decision changes they cause for the build."
trigger_phrases:
  - "opencode dual compat findings"
  - "opencode v1 v2 open questions"
importance_tier: "normal"
contextType: "research"
---
# Findings: OpenCode v1 1.19.3 and v2 2.0.32, Q1 to Q11

Probe verdicts for Phase 1. Every verdict cites its command and a capture under `scratch/`.
Q11 and the decision changes for the parent are added by the orchestrator. An `unknown`
verdict names the evidence that would settle it. All probes used `nosuchprovider/nosuchmodel`
so no paid model call ran, and every session-writing probe set `OPENCODE_DB` under `scratch/`.
Probe projects were deleted after their captures were saved (phase rule); each project's own
files are preserved as a `*-files.txt` capture so a rerun can recreate it.

### Q1

Verdict: unknown

Command:
- `cd .../scratch/q1q2-probe && OPENCODE_DB=.../scratch/q1-v1.db opencode debug skill </dev/null` (v1 catalog)
- `cd .../scratch/q1q2-probe && OPENCODE_DB=.../scratch/q1-v1.db opencode run -m nosuchprovider/nosuchmodel "Use the write tool to create .../scratch/q1-attempt-marker.txt, then report done." </dev/null` (v1 attempt)
- `opencode2 api GET "/api/skill?location%5Bdirectory%5D=<percent-encoded q1q2-probe>"` (v2 catalog)
- `cd .../scratch/q1q2-probe && AI_SESSION_CHILD=1 OPENCODE_DB=.../scratch/q1-v2.db opencode2 run --standalone -m nosuchprovider/nosuchmodel "Use the write tool ..." </dev/null` (v2 attempt)

Excerpt: v1 catalog entry keys are `name, description, location, content` only (q1-v1-catalog.txt);
the v2 skill entry for `q1-allowed-tools` carries no tools field (q2-v2-catalog-3.json);
both attempts die before any tool, v2: `Error: Model unavailable: nosuchprovider/nosuchmodel`
EXIT:1 (q1-v2-attempt.txt), v1: `UnknownError / Unexpected server error` EXIT:1 (q1-v1-attempt.txt);
no marker file was created, and neither binary contains the string `allowed-tools` (0 hits each,
q1-binary-grep.txt).

Meaning for the build: no model-free run can show a blocked tool, so enforcement stays unknown.
The static evidence leans toward the field being inert: the v1 catalog entry carries only name, description, location and content, and the v2 catalog record carries no tools field (q1-binary-grep.txt, q2-v2-catalog-3.json). The captures do not enumerate the full v2 schema, so this is inferred. The evidence that would settle it: a real model run with
the skill active and the excluded tool requested, on each version.

### Q2

Verdict: confirmed on v2, refuted on v1

Command:
- `opencode2 api GET "/api/skill?location%5Bdirectory%5D=<percent-encoded q1q2-probe>"` (repeated until two reads matched)
- `cd .../scratch/q1q2-probe && OPENCODE_DB=.../scratch/q2-v1.db opencode debug skill </dev/null`
- `grep -a -c 'disable-model-invocation' <v1 binary>` -> 0, `<v2 binary>` -> 2 (q2-binary-grep.txt)

Excerpt: v2 entry (q2-v2-catalog-3.json):
`{"id":"q2-disable-invocation","name":"q2-disable-invocation","description":"...","autoinvoke":false,"path":".../SKILL.md"}`.
v1 entry (q2-v1-catalog.txt) has `name, description, location, content` only, no autoinvoke field.

Meaning for the build: v2 reads `disable-model-invocation: true` into `autoinvoke:false`, which
drops the skill from the auto-invocation guidance list (q2-binary-grep.txt, q2-v2-catalog-3.json). v1's catalog entry has no such field (q2-v1-catalog.txt), so the key does not act as a cross-version control. Whether explicit activation still works on v2, and whether v1 keeps the skill visible to the model, were not tested with a model run.

### Q3

Verdict: refuted (v1 1.19.3 does not accept `-m provider/model#variant` on the run path)

Command:
- `cd .../scratch/q1q2-probe && OPENCODE_DB=.../scratch/q3-v1.db opencode run --print-logs --log-level DEBUG -m nosuchprovider/nosuchmodel "probe" </dev/null`
- `cd .../scratch/q1q2-probe && OPENCODE_DB=.../scratch/q3-v1.db opencode run --print-logs --log-level DEBUG -m 'nosuchprovider/nosuchmodel#high' "probe" </dev/null`

Excerpt: plain -> `ProviderModelNotFoundError: Model not found: nosuchprovider/nosuchmodel.`;
variant -> `ProviderModelNotFoundError: Model not found: nosuchprovider/nosuchmodel#high.`
(q3-v1-plain-debug.txt, q3-v1-variant-debug.txt; both reruns give the same text,
q3-v1-plain-debug-2.txt, q3-v1-variant-debug-2.txt).

Meaning for the build: the `#high` suffix stays inside the model id at v1 resolution, so a dual
dispatch must pass the plain `provider/model` to v1 and reserve the `#variant` form for v2.

### Q4

Verdict: confirmed (the loader accepts a definition with an extra top-level `__test` key)

Command:
- `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<percent-encoded q4-probe>"` (repeated until two reads matched)
- `opencode2 api POST "/api/plugin/check?location%5Bdirectory%5D=<percent-encoded q4-probe>" -d '{}'`
- `opencode2 api POST "/api/plugin/check?location%5Bdirectory%5D=<percent-encoded q4-probe>" -d '{"target":".../q4-probe/.opencode/plugins/q4-extra-key.js"}'`

Excerpt: `{"id":"q4-extra-key","source":{"type":"local","path":".../q4-extra-key.js"},"features":{"server":true},"state":{"status":"active"}}`
(q4-plugin-list-3.json, identical across reads 2-4); the plugin's setup ran , 
`{"ts":...,"pid":46220,"key":"__test accepted"}` (q4-marker.log). The target form answers
`{"_tag":"InvalidRequestError","message":"Plugin package is not in the current server inventory: ...","field":"target"}`
HTTP 400 (q4-check-target.json); the endpoint description is "Check one or all package plugins for
available updates", it checks, it does not install.

Meaning for the build: the repo's `Plugin.__test` pattern can stay on the v2 side, a plain object
definition carrying it loads and activates. Note that `plugin.check`'s `target` addresses package
plugins only; a local file's state comes from the plugin list, not from `plugin.check`.

### Q5

Verdict: unknown

Command:
- `cd .../scratch/q5-q6-probe-b && AI_SESSION_CHILD=1 OPENCODE_DB=.../scratch/q5-q6-b.db opencode2 run --standalone -m nosuchprovider/nosuchmodel "probe" </dev/null`

Excerpt: events delivered live to `ctx.event.subscribe` (q5-q6-events-b.log): `mcp.status.changed`,
`integration.updated`, `model.updated`, `provider.updated`, `vcs.branch.updated`, `plugin.updated`,
`session.inbox.enqueued`, `session.execution.started`, `session.instructions.updated`,
`session.inbox.delivered`, then `session.execution.failed`
`{"type":"provider.no-route","message":"Model unavailable: nosuchprovider/nosuchmodel"}`, and no
`session.idle`. The run itself: `Error: Model unavailable: nosuchprovider/nosuchmodel` EXIT:1
(q5-q6-run-3.txt; the same result twice on the first probe design, q5-q6-run-1/2.txt).

Meaning for the build: the channel works, but a model that never resolves ends the turn in
`session.execution.failed` and never reaches idle, so `session.idle` delivery stays unknown; a real
model run (operator approval) is what would settle it. Port-critical and now proven live:
`ctx.event.subscribe()` returns an async iterable consumed with `for await`; passing a callback is
silently ignored and delivers nothing (first probe, q5-q6-events.log).

### Q6

Verdict: unknown

Command:
- same run command as Q5, plus a direct SSE read of the private server: `curl -sN -u "opencode:<server-password>" http://127.0.0.1:4198/api/event` (private `opencode2 serve --port 4198`, `OPENCODE_DB` under `scratch/`, killed by PID afterwards)

Excerpt: neither capture contains `session.compacted`, the run log (q5-q6-events-b.log) ends at
`session.execution.failed`, and the SSE stream (q5-q6-sse.txt) for an API-driven turn shows
`session.created`, `session.inbox.enqueued`, `session.execution.started`, `session.instructions.updated`,
`session.inbox.delivered`, `session.execution.failed`, no compaction event. Compaction itself needs
a model, so none could occur.

Meaning for the build: the event name exists in the v2 binary, as the orchestrator's binary grep confirmed during research (research/steering-log.md:184), and the delivery channel is proven (Q5), but
live `session.compacted` delivery is unproven; the port can keep the name and must verify it with a
real model run.

### Q7

Verdict: confirmed (a `z.toJSONSchema` output is accepted as the tool `input`)

Command:
- `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<percent-encoded q7-probe>"` (repeated until two reads matched)
- `opencode2 api POST "/api/plugin/check?location%5Bdirectory%5D=<percent-encoded q7-probe>" -d '{}'`
- the negative controls q7-probe-neg and q7-probe-neg2, read with the same GET

Excerpt: the orchestrator generated the real zod 4.1.8 output of `z.toJSONSchema(z.object({text: z.string()}), {io:"input"})` (q7-zod-output.json), which is byte for byte the schema the first probe hand-wrote, and a probe tool built from that literal output registered, with `{"evt":"tool-list","hasQ7z":true,"count":21}` (q7z-marker.log) and the plugin `active` (q7z-plugin.json). The first probe also shows it , 
`{"evt":"tool-list-ok","count":21,"names":[... "q7_echo"],"hasQ7":true}` (q7-marker.log); the plugin
is `"status":"active"` (q7-check.json). The negative control with `input: 42` is silently dropped , 
`{"evt":"after-add","addError":null,"afterCount":20,"hasNeg2":false}` (q7-neg2-marker.log), so
acceptance is meaningful, not an accepts-anything pipeline.

Meaning for the build: one JSON Schema object (a `z.toJSONSchema` output) can serve the v2 tool
`input`; the registry drops an invalid input silently (no error surfaces), so a missing tool is the
failure symptom to watch for. Argument decoding at call time is not covered model-free.

### Q8

Verdict: refuted (no VS Code extension surface exists to load config or plugins)

Command:
- `find .skilled .opencode specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat -name "*.vsix" -not -path "*/node_modules/*"`
- `grep -rln '"vscode"' .skilled .opencode --include=package.json`
- `grep -rn -i "vscode" .skilled/skills/cli-external-orchestration/cli-opencode/`

Excerpt: all three searches return no match (desk-q8-q9.txt); the research record already marks it
UNKNOWN with zero mentions in iterations 1-19 (iteration-020.md:36, :139). The only `vscode`
literals in the host binaries are terminal detection (`TERM_PROGRAM==="vscode"`), the npm
native-modules list (`@vscode/ripgrep`), and v1's TUI action `session.header.open.app.vscode:"VS Code"`
(an external-editor opener).

Meaning for the build: nothing in this repo, and nothing in either host binary, loads OpenCode
config or plugins through a VS Code extension; Q8 needs no build work and no compatibility claim.

### Q9

Verdict: refuted (LSP is a client-side feature; it loads no OpenCode config or plugins)

Command:
- `opencode debug lsp --help`
- binary inspection of `Config.LSP` / `lsp` usage in both hosts, and `grep -rn -i "\blsp\b" opencode.json .skilled .opencode`

Excerpt: v1 `debug lsp` offers diagnostics/symbols/document-symbols, the host as LSP client; v1's
config sample carries `"lsp": false` and `lsp` is a permission key. v2 defines
`Config.LSP.Server {command, extensions, disabled, env, initialization}` with the config key `lsp`
described as "Enable built-in language servers or configure server overrides", and `lsp` is a
built-in tool. The repo's `opencode.json` has no `lsp` key (desk-q8-q9.txt).

Meaning for the build: on both versions LSP is about language servers the host consumes, with no
plugin or config loading path of its own; the repo configures none, so Q9 needs no build work.

### Q10

Verdict: confirmed (v1 loads CLAUDE.md; v2 does not read it at all)

Command:
- binary string inspection of v1's Instruction service and v2's instruction plugin (offsets and excerpts in desk-q10-q11.txt)
- `find . -name CLAUDE.md -not -path "*/node_modules/*" -not -path "./.git/*"`

Excerpt: v1 (offset ~65971143) sets project targets `y=["AGENTS.md", ...CLAUDE.md..., "CONTEXT.md"]`
walked up from cwd to the worktree root, plus global `~/.claude/CLAUDE.md`, all gated by
`OPENCODE_DISABLE_CLAUDE_CODE[_PROMPT]`. v2 (offset ~120992264) sources instructions from
AGENTS.md (config directory plus walk-up) and configured `instructions` entries only; the string
`CLAUDE.md` has no code occurrence in the v2 binary, and `CONTEXT.md` has none either. The repo has
no CLAUDE.md file (desk-q10-q11.txt).

Meaning for the build: keep all durable guidance in AGENTS.md, it reaches both hosts, and treat
CLAUDE.md as v1-only; a CLAUDE.md-only file is silently ignored on v2.

### Q11

Verdict: confirmed (the source lives in `vision-runtime/src`, the bundle builds, it loads on v1 and fails on v2)

Command: `cd .skilled/skills/sk-vision/vision-runtime && bun install && bun run build`, then `node scratch/v1-harness.mjs .` and the v2 `/api/plugin` read.

Excerpt: `built dist/plugin.js + dist/prompt-evidence.js + dist/vision-cli.js + dist/python/runtime.py + hooks/opencode/sk-vision.js`, `exit 0` (scratch/sk-vision-build.txt). v1: `sk-vision loaded command.execute.before` (scratch/v1-harness.jsonl). v2: `Plugin must export a default definition with an id and an effect or setup function.` (scratch/v2-plugin-3.json).

Meaning for the build: phase 3 ports sk-vision in `.skilled/skills/sk-vision/vision-runtime/src/` and rebuilds the bundle with `bun run build`. The build also rewrites `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js`, an untracked artifact that is untracked on main too, so no commit may include it.

## Decision changes for the parent

1. The v1 load check changes. OpenCode 1.19.3 logs no plugin line at INFO or DEBUG level (scratch/v1-trigger-orchestrator.txt, scratch/v1-serve-probe.log, scratch/v1-serve-debug.log), so the research's log-line oracle does not exist. The v1 check is now three parts: `opencode debug config </dev/null` lists the discovered plugins under `plugin`, a private `opencode serve` lists plugin-registered tools at `GET /experimental/tool/ids`, and a node harness imports each plugin and calls its v1 entry with a v1-shaped input (scratch/v1-harness.mjs). Phases 2, 3 and 8 use this check.
2. Every v2 plugin count filters `/api/plugin` to entries whose `source.path` sits under the checkout being tested. A worktree inside a checkout also loads the parent checkout's 16 plugins (scratch/v2-plugin-3.json holds 16 worktree and 16 parent entries).
3. A private v2 server works for checks: `opencode2 serve --port <n>` with a throwaway `OPENCODE_DB` prints a password in its log, and `OPENCODE_PASSWORD=<that value> opencode2 api --server http://127.0.0.1:<n> GET /api/plugin?...` returns the same 121 entries as the shared service after one cold read (scratch/v2-private-provenance.txt, scratch/v2-private-plugin-orchestrator.json, compared with scratch/v2-plugin-3.json). Phase 8's battery uses a private server, so the shared service is never touched.
4. v1 does not parse `-m provider/model#variant` (Q3). The v1 command shape keeps `--variant`, and only the v2 shape uses `#variant`.
5. `ctx.event.subscribe()` on v2 returns an async iterable, and a callback argument receives nothing (Q5, documented from scratch/q5-q6-events-b.log). Every v2 event leg uses `for await`.
6. v2 accepts extra keys on the default export (Q4). Moving `__test` seams out of the plugin modules is therefore optional, and phase 2 removes a seam only where no test reads it.
7. A `z.toJSONSchema` output registers as a v2 tool input (Q7), so one zod shape serves both hosts.
8. Live delivery of `session.idle` and `session.compacted` is still unknown (Q5, Q6), because a model-free run ends in `session.execution.failed`. Phase 3 proves the sentinel and the advisor with one short real-model run each.
9. v2 reads `AGENTS.md` and never `CLAUDE.md` (Q10), and v2 honours `disable-model-invocation` while v1 ignores it (Q2). Phase 10 documents both.
