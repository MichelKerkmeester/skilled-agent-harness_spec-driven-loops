---
title: "Implementation Summary: Hook Path CLI Spawn Trim"
description: "Hook turns no longer start a compiled-route child the hook never reads, casual prompts no longer spawn the advisor CLI, and a daemon still on the old schema is retried once without the new option instead of costing the brief."
trigger_phrases:
  - "hook path cli spawn summary"
  - "casual prompt gate summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/003-hook-path-cli-spawn-trim"
    last_updated_at: "2026-09-26T13:05:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Shipped R2 with the stale-daemon retry, R5, and the hook-flow docs"
    next_safe_action: "Start 004-headless-fallback-status-and-dedup"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts"
      - ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"
      - ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research Q2: the operator chose to fix the docs to match the CLI-only hook."
      - "Only the OpenCode plugin reads compiledRoute; the hook-side caller never does."
      - "Skipping the compiled-route step saves a median 65 ms per hook turn, measured paired on one build and one daemon."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Hook Path CLI Spawn Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hook-path-cli-spawn-trim |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Hook turns stopped paying for work nobody reads. The hook now asks the advisor to skip the compiled-route child it used to start for every compiled hub in the top results, and prompts the casual-prompt gate declines never spawn the CLI at all. The OpenCode plugin still gets its compiled route, because it never sends the new option.

### Phase 3: hook path CLI spawn trim

- **Request option (R2).** `options.includeCompiledRoute` is an optional boolean in the zod schema, the tool descriptor and the CLI manifest, default true. The handler skips `enrichCompiledRoutes` on both the fresh and the cached return when it is `false`, and the hook's CLI payload always sends `false`.
- **Stale-daemon retry (R2).** A daemon started before this option existed rejects it with JSON-RPC -32602, and the protocol handshake cannot tell the two builds apart. The CLI retries exactly once without the key when the error names `includeCompiledRoute` and the request carried it; every other error path is unchanged.
- **Prompt gate (R5).** `skippedAdvisorResultFor` in `runtime/lib/skill-advisor-brief.ts` is now the one home of the skip result. The builder uses it, and the hook calls it before the CLI, so `/help`, short acknowledgements and prompts below the length threshold return `skipped` without a spawn. An injected full producer stays ungated, as before.
- **Replay guard (R5).** A test replays the gate over the labeled and golden prompt corpora and fails if it declines any prompt whose expected skill is real.
- **Docs.** `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md` now describe the CLI as the hook's front door with the gate in front of it, and say that a no-route or timed-out call emits the directives fallback rather than `{}`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modified | R2 zod option |
| `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts` | Modified | R2 descriptor option |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | Modified | R2 CLI manifest option |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modified | R2 skip enrichment at both returns |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modified | R2 hook payload sends `false` |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | Modified | R2 one retry for a stale daemon |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | Modified | R5 shared skip result |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modified | R5 gate before the CLI |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | Hook flow and fail-open wording |
| `.skilled/skills/system-skill-advisor/ARCHITECTURE.md` | Modified | Hook integration paragraph |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Created | R2 handler test |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Created | R2 retry test |
| `.skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts` | Created | R5 replay |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` | Modified | R2 payload test |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | R5 gate tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort wrote each change from a one-change brief, two at a time on disjoint files: the schema, handler, payload and docs briefs through cli-codex in fast mode, and the gate, retry and replay briefs through cli-pi on the `openai-codex` provider, since the retry test needs a local socket that the Codex sandbox refuses. The orchestrator reread every diff, reran every named test, and confirmed each new test fails with its change reverted. It also wrapped two over-long comments, added module headers to three new test files, and corrected three fail-open sentences in the hook doc that sat outside the docs brief's lines but described the same flow.

The live checks surfaced the risk this phase planned for. The resident daemon had started before the schema change, so every hook turn on the new build was rejected once and served by the retry: 15 of 15 turns routed, at a median of 1,594 ms. The daemon was stopped and cold-started by the next CLI call, which is the documented recovery, and the median fell to 1,066 ms.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The option travels in the request, not in an environment variable | The handler runs in the daemon, where a hook-side variable cannot reach |
| The CLI retries once without the option when an older daemon rejects it | Both sides report protocol `'1'`, so the handshake cannot catch a daemon still running the old strict schema |
| A failed retry falls through to the existing local-scorer path | An unreachable daemon on the retry is the same case the CLI already handles |
| Reconnect the gate rather than delete it | The commit that disconnected it says nothing visible changed, so its loss reads as a side effect |
| Measure REQ-006 paired rather than against the T003 window | Four baseline turns under different load cannot resolve a 65 ms effect; alternating on and off turns on one build and one daemon can |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite, `npx vitest run` | 911 passed, 1 failed, 6 skipped of 918: the 002 baseline plus 8 new tests. The one failure is the routing-divergence ratchet, which failed at baseline |
| Typecheck, `npm run typecheck` | Exit 0 |
| Plugin suite, `node --test .skilled/plugins/tests/system-skill-advisor.test.cjs` | 29 of 29, test file unmodified |
| sk-code drift guards | Both passed |
| Negative controls | With each change reverted, the handler, gate, payload and retry tests failed, then passed with the change restored |
| Gate replay | 195 labeled and 9 golden prompts, 0 declined |
| REQ-002 live | A request without the option returned `sk-code` with its `compiledRoute` attached |
| REQ-005 live | A daemon on the pre-change build served 15 of 15 hook turns through the one retry |
| REQ-006, paired hook A/B | 45 pairs on one build and one daemon: enrichment off saves a median 65 ms per turn and is faster in 35 pairs. Pooled medians 910 ms on, 844.5 ms off |
| CLI A/B, isolated daemon | 20 calls each: 1,097 ms with the compiled-route step, 1,021 ms without; all 20 "with" calls carried a compiled route, no "without" call did |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | Run at phase close, see the parent packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A daemon on an older build pays one extra round trip per hook turn until it restarts.** The retry keeps the brief, but the median was 1,594 ms instead of about 1,000 ms. The launcher's idle monitor appears to stop only an idle daemon (read from code, not observed), so after an upgrade the operator should stop it once and let the next CLI call cold-start it.
2. **The saving is modest.** Each CLI call still costs about 1 s, most of it process start, so dropping the compiled-route child trims about 6 to 7 percent of a hook turn.
3. **The replay proves no lost routes, not that the gate works.** The gate declines none of the corpus prompts; the hook tests with `/help` and "thanks" cover the declines.
<!-- /ANCHOR:limitations -->

---
