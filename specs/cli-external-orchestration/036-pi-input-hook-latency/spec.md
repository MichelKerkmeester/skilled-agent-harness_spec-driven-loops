---
title: "Feature Specification: PI input-hook latency (drop the synchronous spawn chain)"
description: "Replace the three-deep synchronous spawnSync chain behind .pi/extensions/prompt-advisor.ts with an in-process advisor call so Pi stops blocking message sends up to ~2.8s per turn (outer adapter timeout), matching the async/in-process behavior of the claude, codex, and opencode surfaces."
trigger_phrases:
  - "pi hook delay"
  - "pi input latency"
  - "prompt-advisor spawnSync"
  - "pi slow message send"
  - "pi hook adapter blocking"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/036-pi-input-hook-latency"
    last_updated_at: "2026-08-02T15:36:37Z"
    last_updated_by: "implementer"
    recent_action: "Packet complete: in-process advisor hook landed; cache fix; benchmark recorded"
    next_safe_action: "Follow-up candidate: daemon fast-path or non-gating injection for the cold advisor tail"
    blockers: []
    key_files:
      - ".pi/extensions/prompt-advisor.ts"
      - ".pi/extensions/lib/claude-hook-adapter.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-036-pi-input-hook-latency"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Git workspace choice for implementation (worktree vs current branch) -- operator decision at implementation start"
    answered_questions: []
---
# Feature Specification: PI input-hook latency (drop the synchronous spawn chain)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — in-process advisor path landed; measured 1.37–1.49 s per message → 1–2 ms repeats; the ~1.3 s cold advisor tail documented as a follow-up |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` (current branch; implementation used the current branch, option B) |
| **Parent Packet** | `cli-external-orchestration/036-pi-input-hook-latency` |
| **Predecessor** | `031-cli-pi-creation` (built the pi extension surface this packet optimizes) |
| **Successor** | None |
| **Handoff Criteria** | PI per-message send no longer blocks on a synchronous multi-process hook chain; the skill-advisor brief is still injected on `input`; fail-open preserved; zero behavior change on claude/codex/opencode surfaces |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator observed that PI CLI adds delay before a message is sent, while the opencode plugin, the codex hooks, and the claude hooks do not. Investigation (2026-08-02) confirmed the cause: **PI is the only runtime whose per-message advisor hook runs as a synchronous, multi-process, main-thread-blocking spawn chain.**

The per-message chain on PI:

1. `.pi/extensions/prompt-advisor.ts` registers `pi.on("input")`. Pi awaits `input` handlers **before agent processing begins** (pi docs, `extensions.md` "Input Events"). The handler calls `runClaudeHookAdapter()` which uses **`spawnSync`** (blocking) to run the Claude shim, with `TIMEOUT_MS = 2_800`.
2. The shim (`system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js`) resolves the real advisor target by walking up the tree, then **`spawnSync`s again** the advisor hook (`system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js`) with `CHILD_TIMEOUT_MS = 2_500`.
3. The advisor hook runs `buildSkillAdvisorBrief()` → `runAdvisorSubprocess()` (spawn of the advisor CLI, warm-only daemon probe; `shouldTrySkillAdvisorCliFallback` may spawn a second process when the daemon is cold), bounded by the *remaining* time budget.

Worst case: **~2.8 s of hard-blocked send** — the outer adapter `spawnSync` timeout (2 800 ms) bounds the whole chain; the shim's inner 2 500 ms child budget runs inside it, so the two are not additive. Happy path: 2–3 sequential Node process boots (~50–200 ms each) plus advisor computation, **per message**, because each invocation is a fresh process — the advisor hook's module-level prompt cache is cold on every message.

The other runtimes avoid this:

- **opencode** — `mk-skill-advisor.js` is an **in-process plugin** (`experimental.chat.system.transform`): async, no spawn for the hook itself, one async bridge spawn, 5-minute TTL cache + in-flight dedup. Repeat prompts ≈ 0 ms.
- **claude** (`.claude/settings.json`) — runs the same shim, but Claude Code executes hook processes **asynchronously**; its event loop and TUI never freeze.
- **codex** (`.codex/hooks.json`) — has the same double-spawn chain (`dist/hooks/codex/user-prompt-submit.js` → `runClaudeHookAdapter`), but Codex CLI does not gate the request on hook completion, so the delay is invisible.

### Purpose
Eliminate the blocking spawn chain on PI's hot input path while keeping the advisor brief, the fail-open contract, and cross-runtime semantic parity with the shared lifecycle hooks.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.pi/extensions/prompt-advisor.ts` to call the advisor **in-process** (dynamic import of the existing compiled hook module `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js`, invoking its exported `handleClaudeUserPromptSubmit()`), removing the two `spawnSync` hops.
- Keep the exact same output contract: `{ action: "transform", text: "<prompt>\n\n<additionalContext>" }` derived from the `hookSpecificOutput.additionalContext` envelope.
- Keep the fail-open try/catch and the empty-input early return.
- Benchmark before/after and record the delta as evidence in this packet.
- Update `.pi/extensions/README.md` only if the adapter table entry for `prompt-advisor.ts` changes meaningfully.

### Out of Scope
- **Shared dist hooks and libs** (`system-spec-kit/mcp-server/dist/hooks/claude/*`, `system-skill-advisor/*`) — unchanged; they are the single lifecycle owner and must stay byte-identical for the other runtimes.
- **claude / codex / opencode wiring** — no changes; their behavior is already correct.
- **`spec-gate-classify.ts`** — in-process, cheap, not the culprit; untouched.
- **`lib/claude-hook-adapter.ts`** — still used by session-start/stop bridges (once per session, acceptable); only its use on the hot input path is removed.
- **Session-start/stop/compact bridges** — unchanged.
- **`SKILL.md` / skill content changes** — none.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .pi/extensions/prompt-advisor.ts (real file: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts) | Rewrite | In-process `handleClaudeUserPromptSubmit` call; no spawnSync |
| .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts | Modify | Cache-set site stores only graph-backed skill labels so command/registry labels cannot poison future lookups with false "deleted skill" misses (discovered during implementation: without it the in-process cache never hits) |
| .opencode/skills/system-skill-advisor/mcp-server/tsconfig.build.json | Modify | Exclude `../hooks/pi/**` from compilation, matching the system-spec-kit precedent: pi hook files are runtime-loaded by Pi's loader, never tsc-compiled; the previous build emitted them with unresolved-type errors |
| .pi/extensions/README.md | Modify | Adapter table + flow docs reflect the in-process wiring |
| .pi/extensions/lib/README.md | Modify | Note that the adapter no longer serves the input path |

**Amendment (2026-08-02, review follow-up + directive hygiene):**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts | Modify | Injected brief restructured: `Advisor:` line, then a labeled `Directives:` block (bulleted comment-hygiene + governor capsule). Governor capsule is model-agnostic — the former model-family name is gone from injected content because model names change; the disposition does not. Cap now governs the advisor line only; the whole directives block is the always-delivered suffix |
| .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs | Modify | Same directive constants + composition in the opencode plugin's fallback renderer (all runtimes: pi, claude, codex, opencode) |
| .opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-renderer.vitest.ts, advisor-brief-producer.vitest.ts, tests/hooks/claude-user-prompt-submit-hook.vitest.ts | Modify | Expectations updated to the structured block; the 4 stale `{}`-contract hook tests now assert the real fallback-directive injection (`brief ?? renderAdvisorFallbackDirective()`), which is why the directives appear on every message |
| .opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md | Modify | Transcript sample matches the new injected shape |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No synchronous subprocess spawn on the input path | `prompt-advisor.ts` contains no `spawnSync`; grep of the extension shows zero blocking child-process calls |
| REQ-002 | Advisor brief still injected on `input` | A live PI session turn shows the skill-advisor additionalContext appended to the prompt (visible via `[MSG]` chat-transform inspection per the injection contract) |
| REQ-003 | Fail-open preserved | A thrown error inside the advisor path returns `undefined` and the turn proceeds unmodified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Latency regression demonstrated | Before/after measurement recorded in `implementation-summary.md`: old chain pays ~1.37–1.49 s on EVERY message; new path pays ~1.3 s on the first distinct prompt (advisor recommendation tail, shared by all runtimes and unchanged by this packet) and ~1–5 ms on repeat prompts within the 5-minute cache TTL |
| REQ-005 | Cross-runtime parity intact | No edits to claude/codex/opencode hook files or shared dist lifecycle modules; the four runtimes still call the same lifecycle implementation |
| REQ-006 | Session-lifecycle bridges unaffected | `session-start-context.ts` / `session-stop-context.ts` still use `lib/claude-hook-adapter.ts` unchanged |
| REQ-007 | Shared-lib cache invalidation fixed | Repeat-prompt lookups report `cacheHit: true` and skip the advisor subprocess |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c spawnSync .pi/extensions/prompt-advisor.ts` is 0; no `child_process` import remains in the file.
- **SC-002**: Live PI smoke (`pi --offline --approve -p "..."`) completes with the advisor brief visible and no extension-load error.
- **SC-003**: Repeat-prompt hook cost ≤ 5 ms in one session (cache hit), vs ~1.4 s per message on the old chain.
- **SC-004**: `validate.sh --strict` passes for this packet.
- **SC-005**: `npm run build` (system-skill-advisor) exits 0 — no more type-error emission for pi hook files.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | In-process import breaks under Pi's TS extension loader | The extension fails to load (session aborts) | Dynamic `import()` inside the handler with try/catch fail-open; fallback plan = async `spawn` of the existing shim (single hop, non-blocking) |
| Risk | Module-level cache in the advisor lib changes semantics | Different brief freshness behavior than the CLI path | The cache is the same module the CLI hook uses; in-process it becomes *more* effective (5-min TTL). Document the difference in the summary |
| Risk | Time budget removal lets a cold advisor subprocess run long | A slow advisor delays the send (async, but still awaited) | Keep a bounded `subprocessTimeoutMs` (2 500 ms default from the hook) — no worse than today's budget, and non-blocking to the event loop/UI |
| Risk | Shared-lib edit (cache invalidation) drifts from intent | Cache misses return for other runtimes' hook paths | The set-site filter only excludes labels absent from the fingerprint map; per-process consumers (claude/codex/cursor) spawn fresh processes and never retained entries across prompts, so their behavior is unchanged |
| Risk | Benchmark noise masks the improvement | Weak evidence | Measure wall time of the full chain before and after with identical prompts; repeat ≥ 3 runs, report min/median |
| Dependency | Skill-advisor daemon or CLI availability | Brief degraded to fallback directive | Already handled by the shared hook's own fail-open chain; no new dependency |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The input hook must never block the PI event loop; any advisor work runs asynchronously.
- **NFR-R02**: Every failure path returns `undefined` (fail open) — a turn must never be altered or dropped by the advisor.

### Maintainability
- **NFR-M01**: The extension stays a thin adapter: no advisor logic reimplemented, only the shared lifecycle module invoked.
- **NFR-M02**: Comment hygiene holds — no packet/phase/task ids in code comments, only the durable WHY.

### Performance
- **NFR-P01**: Happy-path per-message hook cost on the PI input path: repeat prompts (within the 5-min cache TTL) add ≤ 5 ms; the cold first prompt is bounded by the advisor hook's own subprocess budget (default 2 500 ms) and measures ~1.2–1.3 s (advisor recommendation tail, unchanged by this packet and shared by all runtimes).
- **NFR-P02**: No additional process spawns on the input path beyond the advisor's own internal bounded subprocess.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Empty/whitespace prompt**: early return unchanged (existing guard).
- **Large prompt**: `handleClaudeUserPromptSubmit` already clamps to 64 KiB (`MAX_PROMPT_BYTES`) — no change needed.
- **Repeated identical prompts**: the advisor lib's module-level `advisorPromptCache` (5-min TTL) now actually serves cache hits in-process — a correctness-neutral improvement over the per-process CLI path.

### Error Scenarios
- **Advisor module fails to import** (loader friction): catch → `undefined` → turn proceeds without brief. Fallback documented in plan.
- **Daemon cold**: advisor hook's own `--warm-only` probe + CLI fallback chain still applies; budget bounded by `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` (default 2 500 ms).
- **Concurrent input events** (e.g. RPC + interactive): single handler instance per session; the advisor lib is stateless per call (cache aside) — no shared mutable state introduced by this packet.
- **Command-kind recommendations**: previously poisoned the cache ("deleted skill" miss every lookup); the set-site filter stores only fingerprint-backed labels, so cache entries survive while their skills exist.

### Measured Reality (2026-08-02, warm daemon, substantive prompt)
- Old chain, every message: min 1368 ms / median 1418 ms (5 fresh processes).
- New path, one session: first 1302 ms, then 2/1/1/1 ms (cache hits).
- The ~1.3 s cold tail is the advisor's own Python subprocess, shared by the claude/codex/opencode hook paths and out of this packet's scope; follow-up candidates: daemon fast-path routing or non-gating injection.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Git workspace choice for the implementation: worktree (`.worktrees/{NNNN}-{owner}-{slug}`) or current branch. **RESOLVED: current branch** (operator choice).
- Benchmark methodology detail: measure hook cost via extension-internal timing (performance.now around the advisor call, surfaced through the diagnostic stderr) vs external wall-clock of `pi --print`. **RESOLVED: standalone harness reproducing both chains with identical prompts, ≥ 5 runs, min/median reported; plus end-to-end `pi --offline --approve -p` smoke.**
- Follow-up (out of scope, recorded): the ~1.3 s cold advisor tail — daemon fast-path routing or non-gating injection would eliminate the first-prompt delay entirely.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
