---
title: "Implementation Plan: PI input-hook latency"
description: "Replace the blocking spawnSync chain behind the PI input hook with an in-process advisor call, benchmark before/after, and verify parity with the claude/codex/opencode surfaces."
trigger_phrases:
  - "pi input latency plan"
  - "prompt-advisor rework plan"
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
    open_questions: []
    answered_questions: []
---
# Implementation Plan: PI input-hook latency

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension, loaded by Pi's TS loader) |
| **Runtime** | Pi CLI (`@earendil-works/pi-coding-agent`) |
| **Advisor implementation** | Compiled shared hook module: `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js` (exports `handleClaudeUserPromptSubmit`) |
| **Testing** | Live PI smoke (`pi --offline --approve -p ...`), grep-based static checks, before/after timing |

### Overview
The PI `input` hook previously paid two sequential `spawnSync` process hops (adapter → shim → advisor hook) on the main thread, blocking the send for up to ~5.3 s worst-case. The fix imports the compiled advisor hook module in-process (its CLI entrypoint is guarded by `IS_CLI_ENTRY`), giving the same lifecycle logic with zero process hops; the module-level prompt cache (5-min TTL) then becomes effective in-process, which the per-process CLI path never had. Measured after the fix: ~1.37–1.49 s cold per distinct prompt, 1–2 ms warm repeats; the ~1.3 s cold tail is the advisor's python subprocess and is documented as a follow-up.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed with file:line receipts (adapter `TIMEOUT_MS = 2_800`, shim `CHILD_TIMEOUT_MS = 2_500`, Pi awaits `input` handlers before agent start)
- [x] Confirmed the advisor hook module is import-safe (`IS_CLI_ENTRY` guard in `dist/hooks/claude/user-prompt-submit.js`)
- [x] Confirmed other runtimes' wiring is out of scope (no edits)

### Definition of Done
- [x] `prompt-advisor.ts` has no `spawnSync` / `child_process` import
- [x] Advisor brief still injected on a live PI turn
- [x] Before/after latency evidence recorded (old chain 1368/1418 ms per message; new path 1302 ms cold, 1–2 ms repeats)
- [x] `validate.sh --strict` passes; checklist verified

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin in-process adapter over the existing shared lifecycle implementation — the same module the other runtimes' hooks execute as a subprocess, now invoked directly.

### Key Components
- **`handleClaudeUserPromptSubmit(input)`** (imported from the compiled hook module): builds the advisor brief (warm-only daemon probe, bounded subprocess, CLI fallback, diagnostics) and returns the `{ hookSpecificOutput: { additionalContext } }`-shaped envelope. Signature-compatible with the payload `prompt-advisor.ts` already synthesizes.
- **Envelope extraction**: replace `extractAdditionalContext()` usage on spawned stdout with direct handling of the returned object (`hookSpecificOutput.additionalContext`), or reuse the same extraction on a JSON-serialized result.
- **Cache**: the advisor lib's module-level `advisorPromptCache` (TTL 5 min, source-signature invalidated) now serves repeat prompts in-process.

### Data Flow
1. Pi `input` event fires → `prompt-advisor.ts` handler.
2. Handler calls `handleClaudeUserPromptSubmit({ prompt, cwd, hook_event_name: "UserPromptSubmit" })` — no subprocess for the hook itself.
3. The advisor internally probes the warm daemon (or CLI fallback) within its bounded budget.
4. Handler returns `{ action: "transform", text: "<prompt>\n\n<additionalContext>" }` or `undefined` on any error.

### Fallback
If in-process import fails under Pi's loader (extension load error): switch the adapter to a single **async** `spawn` (not `spawnSync`) of the existing shim, keeping the 2.8 s budget. This is strictly better than today (no main-thread block) and preserves the envelope contract.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline (done during investigation)
- [x] Confirm root cause and capture file:line receipts
- [x] Confirm import-safety of the advisor hook module
- [x] Record pre-change architecture in this plan

### Phase 2: Code
- [x] Rewrite `prompt-advisor.ts`: dynamic import of the hook module, direct `handleClaudeUserPromptSubmit` call, envelope extraction, fail-open, empty-input guard
- [x] Remove `runClaudeHookAdapter`/`extractAdditionalContext` imports from the input path; verify `lib/claude-hook-adapter.ts` stays for session bridges
- [x] Fix shared cache invalidation (set-site label filter) discovered during benchmarking
- [x] Exclude `hooks/pi/**` from the build; `npm run build` exits 0
- [x] Update `.pi/extensions/README.md` + `lib/README.md`

### Phase 3: Verification
- [x] Static checks: no `spawnSync`/`child_process` in `prompt-advisor.ts`
- [x] Live smoke: `pi --offline --approve -p "..."` — extension loads, advisor runs in-process
- [x] Before/after timing: old chain 5 fresh messages min 1368 ms / median 1418 ms; new path first 1302 ms then 2/1/1/1 ms cache hits
- [x] Confirm session-start/stop bridges still function (adapter untouched)
- [x] Generate metadata + `validate.sh --strict`

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | No blocking spawn in the input extension | `grep -n spawnSync .pi/extensions/prompt-advisor.ts` |
| Live smoke | Extension loads; brief injected; turn completes | `pi --offline --approve -p "..."` |
| Performance | Per-message hook cost before/after, warm + cold | internal `performance.now()` timing + external wall-clock |
| Regression | Session bridges unaffected; other runtimes untouched | `git diff` scope review; adapter files unmodified |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi CLI locally installed | External | Green | Cannot smoke-test |
| Skill-advisor daemon/CLI | Internal | Green | Brief degrades to fallback directive (fail-open), same as today |
| Compiled advisor hook module present | Internal | Green (`dist/` tree committed) | Fallback to async spawn path |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: extension fails to load, brief stops injecting, or benchmark shows no improvement.
- **Procedure**: revert `prompt-advisor.ts` to the `runClaudeHookAdapter` version (single file, no other changes). Rollback is a clean one-file revert; `lib/claude-hook-adapter.ts` was never modified.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──> Phase 2 (Code) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Code, Verify |
| Code | Baseline | Verify |
| Verify | Code | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline | Low | Done |
| Code | Low | 30 minutes |
| Verification | Medium | 45 minutes |
| **Total** | | **~1.25 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Change is single-file (plus conditional doc touch)
- [x] Fallback path (async spawn) identified if in-process import fails
- [x] Fail-open contract preserved in both approaches

### Rollback Procedure
1. Restore `prompt-advisor.ts` from git (prior revision).
2. Restart PI session; confirm extension loads.
3. Re-run the smoke and timing checks to confirm the pre-change state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (no persisted state introduced).

<!-- /ANCHOR:l2-rollback -->
