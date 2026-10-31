---
title: "Goal: Phase 4: caller-rewire"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/004-caller-rewire"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Plan this phase against its completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: caller-rewire

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Repoint every caller of the skill advisor at the CLI while the MCP surface still exists, so that the removal in phase 005 deletes something nothing calls.

### Decisions

Frozen choices. Changing one is an amendment. The parent directive in
`../goal.md` outranks everything here; name a conflict rather than resolving it.

| ID | Decision |
|----|----------|
| D1 | Rewire before removal. MCP stays registered throughout this phase as the fallback |
| D2 | Every caller the phase 001 inventory identified is either rewired or explicitly recorded as needing no change |
| D3 | The prompt brief is proven still arriving after each caller changes, per runtime, not only once at the end |
| D4 | Instruction surfaces change with the code. A doctor route's allowed-tools list and its documented invocation are one change, not two |
| D5 | A plugin CLI spawn that breaches its latency budget is reported as a finding, never absorbed with a workaround |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The Claude prompt hook reaches the advisor only through the CLI and the brief still arrives
- [ ] The pi prompt hook reaches the advisor only through the CLI and the brief still arrives
- [ ] The OpenCode plugin reaches the advisor only through the CLI, with its latency recorded
- [ ] Every doctor route and allowed-tools list names a CLI invocation rather than an MCP tool id
- [ ] A sweep finds no caller reaching the advisor over MCP outside the server tree itself
- [ ] Session start in every runtime shows the routing brief while MCP is still registered
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Caller chain mapped | Done | The Claude hook's primary path is not in-process: it spawns `mcp-server/scripts/skill_advisor.py`, which probes for the native advisor and uses it when reachable. Two hops on every prompt, which is why the hook measures 2096ms against the CLI's 823ms |
| Doctor instruction surfaces rewired | Done | `_routes.yaml` two `mcp_tools` blocks converted to `cli_commands`; `update.md` and `speckit.md` allowed-tools carry zero MCP ids; `doctor-embeddings.yaml` calls the CLI. Both YAML files parse |
| CLI local-scorer fallback | Done and proven | With the daemon forced unreachable the CLI returns `status ok`, `degraded true`, `source local-scorer` and routes a refactor prompt to sk-code at 0.95. On the normal path `degraded` and `source` are absent, so existing readers see no change, and the parity harness still reports 0 differed |
| Warm-only guard | Done | The fallback fired on `--warm-only`, turning a documented retryable refusal into a degraded success. Warm-only is documented to never spawn and the local scorer is a spawn, so the guard went in the CLI rather than the test. The smoke case passes at exit 75 again |
| Plugin and doctor code rewire | Dispatched | Plugin off the bridge and onto the CLI; route validator and its contract test moved to `cli_commands` |
| Shared prompt hook | Rewired; brief verified byte-identical to baseline, 95 hook tests pass, latency 412-610ms against a 1104-1369ms baseline in the same worktree. Fast-fail fix in flight | One file, not two: the pi extension executes the compiled Claude hook module, and codex and cursor do the same, so every runtime routes through `hooks/claude/user-prompt-submit.ts` |
| Pre-change brief baseline captured | Done | `Advisor: live; ambiguous: sk-code 0.82/0.26 vs sk-doc 0.82/0.34 pass.` plus the hygiene directive block, diagnostic `status ok, freshness live, durationMs 1874`. This is the before-image D2 is judged against |
| Caller sweep | Done | No production caller reaches the advisor over MCP outside the server tree. What remains is three test files that depend on the plugin bridge, recorded as phase 5 deletion blockers, one retrieval fixture string for phase 7, and documentation for phase 7 |
| Brief proven in three daemon states | Done | Cold 1975ms full brief with the daemon started, warm 759-1039ms same brief, unreachable 403ms `Advisor: stale; use sk-code 0.95/0.20 pass.` |
| Brief proven per runtime with MCP still registered | Pending | The advisor MCP server is currently failing to connect in this session, so a per-runtime check has to wait for it to be restored or be reframed |

### Deviations and findings

| Item | Note |
|------|------|
| F19. The ambiguity flag was dropped in translation | The CLI payload carries `ambiguous: true`; the helper that maps it never mentioned the word, so the renderer printed the single-skill line instead of the near-tie. Caught only by rebuilding both versions in one worktree and diffing. My first comparison was invalid: I measured the old hook in the main checkout against the new one in the worktree, two different corpora, and the numbers flattered the change. After the fix the full brief is byte-identical to the baseline |
| F21. My own fast-fail fix was worse than the bug | Removing the daemon spawn instead of bounding the wait left every cold session on the local scorer with one recommendation instead of three, and the hook emitted no Advisor line at all. It shipped in `e8d564ca98`. The 209ms that looked like success was the signature of the defect: fast because it had stopped doing the work. Corrected with a 5000ms cold-start bound against a measured 3008ms start, and the helper now treats a degraded answer as usable rather than discarding it |
| Three daemon states now verified | Cold 1975ms, full brief with the ambiguity line, daemon started. Warm 759-1039ms, same brief. Unreachable 403ms, `Advisor: stale; use sk-code 0.95/0.20 pass.` which names a skill and labels itself stale rather than claiming live |
| F20. The fallback worked but took thirty seconds | An unreachable daemon returned the degraded payload in 30317, 30366 and 30332 ms, because the CLI waits its whole 30s tool timeout before falling back. The scoring is not the cost: the local scorer alone runs in about 213 ms. I had proven this path correct without timing it, on a path where latency is the entire point. Being fixed to fail fast on socket-absent and connection-refused, which are knowable immediately and are not timeouts |
| F16. The hook's CLI helper has never reached the daemon | It probes a flat `/tmp/system-skill-advisor/daemon-ipc.sock`. Real sockets sit one level deeper in a scope directory named by sha256 of the database directory truncated to 12 hex; two exist on this machine and the flat path does not. Its own comment admits hooks do not inherit the socket-dir variable. Because it only ran after the Python path failed, it always reported `socket_absent` and nobody noticed. Promoting it to primary exposed it. Phase 3 proved the CLI binary, not this helper |
| F17. The same helper clamps its call below the latency it needs | The single call is clamped to the 250ms fallback default while measured warm CLI latency is about 440ms, so even a reachable daemon would time out. Both defects are being fixed together |
| F18. OPEN: warm-only on the prompt path | The helper passes `--warm-only`, which is right for a fallback that must never pay daemon start, and wrong for a primary that must return a recommendation. With the warm-only guard in place a cold daemon now yields no brief, which D2 forbids. Either the hook drops warm-only and accepts daemon start on a cold first prompt, or the guard is narrowed from "never spawn" to "never start the daemon" so the local scorer may still answer. Needs deciding before phase 4 closes |
| F15. There is one prompt hook, not four | The pi extension does not carry its own advisor call. It executes `mcp-server/dist/hooks/claude/user-prompt-submit.js`, and its own comment records why: a two-process blocking-spawn bridge stalled every send. Codex and cursor share the same module. That makes the rewire one file and one blast radius rather than four, and it makes that file the highest-risk edit in the package |
| F14. A smoke case names a shim that does not exist | `cli-exit-taxonomy-smoke.cjs` asserts `code-index` exits 64 on an unknown command, but no `code-index` shim exists in `.opencode/bin`, so it exits 1 and the case fails. The same case is present two commits before this packet began, so it is not caused by this work. It is a stale case pointing at a removed tool. Left alone as out of scope and raised for the operator rather than fixed silently |
| F13. D4 and D2 are in tension on the prompt hook | D4 wants one CLI front door for every caller. D2 forbids any operator-visible behavior change. The Python scorer the hook calls today is not a delegate: `probe_native_advisor()` uses the native advisor when reachable and otherwise scores locally with its own lexical matcher, verified by running it in two environments and getting `source: native` in one and `source: local` in the other. Removing it from the prompt path without a replacement means a daemon-down session gets no brief at all, which D2 calls a failure. The proposed resolution is to move the fallback behind the front door: the CLI absorbs the local-scorer path, so there is still one caller-facing seam and the resilience survives. That is an amendment and needs the operator |
<!-- /ANCHOR:log -->
