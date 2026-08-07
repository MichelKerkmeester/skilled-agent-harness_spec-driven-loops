---
title: "Implementation Summary: PI input-hook latency"
description: "The PI input hook's blocking spawn chain is gone: the advisor lifecycle runs in-process, repeat prompts resolve from the advisor's own 5-minute cache at ~1 ms, and the build no longer emits pi hook files with type errors."
trigger_phrases:
  - "pi input latency summary"
  - "prompt-advisor summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/036-pi-input-hook-latency"
    last_updated_at: "2026-08-02T15:36:37Z"
    last_updated_by: "implementer"
    recent_action: "PI input hook now in-process; cache invalidation fixed; benchmark recorded"
    next_safe_action: "Follow-up: daemon fast-path or non-gating injection for the cold advisor tail"
    blockers: []
    key_files:
      - ".pi/extensions/prompt-advisor.ts"
      - ".opencode/skills/system-skill-advisor/lib/skill-advisor-brief.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/tsconfig.build.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-036-pi-input-hook-latency"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Git workspace: current branch (operator choice)"
      - "Benchmark methodology: standalone harness reproducing both chains, 5 runs each, min/median + end-to-end pi smoke"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-pi-input-hook-latency |
| **Completed** | 2026-08-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The PI `input` hook no longer blocks message sends on a synchronous multi-process spawn chain. `.pi/extensions/prompt-advisor.ts` (a symlink to `system-skill-advisor/hooks/pi/prompt-advisor.ts`) now imports the compiled advisor lifecycle module and calls `handleClaudeUserPromptSubmit()` in-process — the same code the claude/codex/cursor runtimes execute as a subprocess, with zero adapter/shim process hops on PI's hot path (the advisor's own bounded python subprocess still runs on a cache miss).

Two defects discovered during benchmarking were fixed along the way:

1. **Shared cache invalidation defect** (`system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts`): the cache entry stored ALL recommendation labels including command/registry ids that never exist in the skill-fingerprint map, so `deletedCachedSkills()` reported a false "deleted skill" on every lookup and the cache NEVER hit. The set-site now stores only fingerprint-backed labels, so entries survive while their skills exist and genuinely removed skills still invalidate. This is what makes the ~1 ms repeat-prompt path possible.
2. **Build emission defect** (`mcp-server/tsconfig.build.json`): `hooks/pi/**` was compiled even though pi hook files are runtime-loaded by Pi's loader (and `@earendil-works/pi-coding-agent` is not resolvable from the package build context). The build emitted them with unresolved-type errors. The exclusion matches the system-spec-kit precedent (`hooks/pi/**` excluded there) and `npm run build` now exits 0.

### Files

| File | Action | Purpose |
|------|--------|---------|
| `system-skill-advisor/hooks/pi/prompt-advisor.ts` | Rewritten | In-process advisor call; no spawns on the input path |
| `system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts` | Modified | Cache set-site stores only graph-backed skill labels |
| `system-skill-advisor/mcp-server/tsconfig.build.json` | Modified | Excludes `../hooks/pi/**` from the build |
| `.pi/extensions/README.md`, `.pi/extensions/lib/README.md` | Modified | Wiring docs reflect the in-process path |

**Post-review amendment (2026-08-02): directive hygiene + structure.** Injected hook content is now model-agnostic and labeled. `lib/render.ts` (and the opencode plugin bridge's fallback renderer) emit:

```
Advisor: <freshness>; … pass.
Directives:
- Comment hygiene [HARD BLOCK]: …
- Governor: …
```

The governor capsule deliberately carries no model-family name — model names change, the disposition does not. The token cap now governs the advisor line only; the whole directives block is the always-delivered suffix (same guarantee as before, cleaner semantics). Files: `lib/render.ts`, `plugin-bridges/mk-skill-advisor-bridge.mjs`, the three format-asserting test files, and the claude-hook playbook transcript.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The old chain was reproduced faithfully (adapter `spawnSync` → shim → advisor hook → python subprocess) and timed against the new in-process call with identical prompts, 5 runs each, min/median reported. The advisor's own python subprocess (~1.3 s) is the dominant cost on a cold prompt in both paths; the wins are the removal of the process hops and main-thread freeze, plus the cache now actually resolving repeats.

### Benchmark methodology (reproducible)

- **Prompt (substantive, passes the advisor policy threshold):** `Implement a memory context retrieval tool in the spec kit memory server and verify it with tests`
- **BEFORE harness:** `spawnSync(process.execPath, [system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js], { input: <payload>, timeout: 2800 })` × 5 fresh processes — reproduces the adapter's hop, which internally spawns the advisor hook.
- **AFTER harness:** one process, `import(system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js)` then `handleClaudeUserPromptSubmit(payload)` × 5 same-session calls.
- **Payload:** `{ prompt, cwd: <repo-root>, hook_event_name: "UserPromptSubmit" }`; daemon warm; 2026-08-02.

| Path | Raw samples (ms) | min / median |
|------|------------------|--------------|
| BEFORE (5 fresh messages) | 1368, 1393, 1418, 1468, 1485 | 1368 / 1418 |
| AFTER (one session, 5 calls) | 1302, 2, 1, 1, 1 | 1 / 1 (repeats); 1302 first |

An independent reviewer run on 2026-08-02 reproduced the shape: cold 1171.5 ms, repeats 0.86–1.25 ms; old-chain baseline 1263–1321 ms (run-to-run variance from repo contention explains the range spread vs the 1368–1485 ms first measurement).

Verification: static grep (no spawn token, no child_process import), live `pi --offline --approve -p` smoke (extension loads, advisor diagnostic emitted in-process, turn completes), `npm run build` exit 0, `validate.sh --strict` pass.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| In-process advisor call over async spawn | Zero process hops, effective 5-minute cache, matches the opencode plugin's architecture; the module was already import-safe |
| Fixed the shared cache at its set-site | The alternative (working around it in the adapter) would reimplement lifecycle logic; the filter is one expression and per-process consumers (claude/codex/cursor) are unaffected — they never retained entries across prompts |
| Excluded `hooks/pi/**` from the build instead of vendoring the pi types | Matches the system-spec-kit precedent; pi loads these files directly and never tsc-compiles them |
| Kept `lib/claude-hook-adapter.ts` | Session-start/stop bridges run once per session; the spawn cost there is acceptable and out of scope |
| Worked on the current branch | Operator choice (sk-git ask-first rule) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Static: no spawn token / child_process in the input extension | PASS |
| Live smoke `pi --offline --approve -p` | PASS — extension loads, in-process advisor diagnostic emitted |
| Benchmark before/after | PASS — 1368/1418 ms per message → 1302 ms cold / 1–2 ms repeat |
| `npm run build` (system-skill-advisor) | PASS — exit 0 (was emitting with type errors) |
| Session bridges untouched | PASS — `lib/claude-hook-adapter.ts` unmodified |
| `validate.sh --strict` | PASS — Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ~1.3 s cold-prompt tail remains.** It is the advisor's own Python recommendation subprocess, shared by the claude/codex/opencode hook paths and unchanged by this packet. Follow-up candidates: route the primary path through the warm daemon fast-path, or make the injection non-gating so the send never waits on it.
2. **Benchmark noise.** The before/after cold numbers overlap within run-to-run variance; the reliable signal is the repeat-prompt path (1.37–1.49 s → 1–2 ms) and the removal of the blocking spawns.
3. **Cache TTL is 5 minutes.** A repeat prompt after the TTL (or after any skill-graph change) pays the cold cost again — same behavior as the opencode plugin.
4. **`hooks/pi` dist artifacts are stale-by-design.** The build no longer compiles them; the gitignored `dist/hooks/pi/*.js` files are inert (Pi loads the `.ts` sources through the symlinks).
<!-- /ANCHOR:limitations -->
