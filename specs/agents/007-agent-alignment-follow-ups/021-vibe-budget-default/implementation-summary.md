---
title: "Implementation Summary"
description: "A Mistral Vibe lineage now bills the Vibe budget by default, and a Mistral budget refusal stops it as a quota stop instead of a crash. The Mistral docs in four places now say which key bills which budget."
trigger_phrases:
  - "vibe budget default implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/021-vibe-budget-default"
    last_updated_at: "2026-11-15T17:29:55Z"
    last_updated_by: "generate-context"
    recent_action: "Shipped phase 021 (Vibe budget default) to origin/main 9db9e95fc77"
    next_safe_action: "Plan child 022 for the phase 20 doc findings"
    packet_purpose: "Purpose: A Mistral lineage bills the Vibe budget by default, and an exhausted budget stops it as a quota stop."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:e476e1928251c86f811fee044dd87661bc1ac1ef50d61d08d26397448080fd1b"
      session_id: "scaffold-021-vibe-budget-default"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T17:29:55Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-vibe-budget-default |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-loop lineage on Mistral Vibe now bills the plan's Vibe budget, even when the shell that starts it carries an API key. When a Mistral budget runs out, the runner now records a quota stop instead of a crash.

### Phase 21: vibe-budget-default

Mistral bills two budgets, and the key decides which one pays. The key the Vibe browser sign-in stores in the macOS keychain bills the Vibe budget. Any other key bills the API budget. `buildExecutorDispatchEnv` now reads that keychain item once per process and gives it to every `cli-mistral-vibe` lineage as `MISTRAL_API_KEY`. When the keychain has no such item, the parent's key passes through as before. Both failure classifiers now treat Mistral's `402 API budget exhausted` reply as quota exhaustion. The cli-mistral-vibe, cli-pi and cli-opencode docs and the spec-kit env reference now record the two budgets, and the Vibe skill no longer calls billing UNKNOWN.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | `readMistralVibeSignInKey`, the Vibe override in `buildExecutorDispatchEnv`, the budget marker in `classifyExecutorUnavailable` |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` | Modified | Budget-exhausted quota pattern |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modified | Stubbed keychain reader, three env cases, one marker row |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/cli-guards-needs-input.vitest.ts` | Modified | Quota case for the 402 body |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md`, `references/providers-and-models.md` | Modified | Sign-in key first, two billing budgets |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Mistral billing paragraph |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modified | Mistral billing note |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modified | `MISTRAL_API_KEY` note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built five tasks, one per dispatch. The conductor read every diff. The two doc tasks ran while the baseline suite ran, after a grep showed no runtime test reads those docs. The two `executor-audit.ts` tasks ran one after the other. The full runtime suite ran before and after the change.

The machine side was done by the conductor with the operator's approval and is not in the repo. `~/.zshenv` now exports the keychain sign-in key after its older `MISTRAL_API_KEY` lines. Pi's `auth.json` and OpenCode's `mistral` credential row now hold the sign-in key. Each file has a `.bak-20261115-vibe-budget` backup beside it. One-turn probes through Pi and OpenCode `--standalone` replied `ok`, moved only the Vibe budget, and left the API budget unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Override the inherited key for a Vibe lineage, not only fill a missing one | The failure was an API key in the shell overriding the sign-in key. Filling only a missing key would have left that case broken. |
| Inject the keychain reader as an option | Unit tests must never read the operator's real keychain or put a real key in a test result. |
| No opt-out switch | No current requirement asks to bill a Vibe lineage to the API budget, and that budget is exhausted until 2026-12-01. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime, before | PASS: 177 files, 3,019 passed, 9 skipped |
| `npm test` in the runtime, after | PASS: 177 files, 3,024 passed, 9 skipped. The +5 are the new tests |
| `npm run typecheck` | PASS: exit 0 |
| `detectQuotaExhaustion` on the 402 line | Before: `null`. After: the new test asserts a non-null cause |
| `tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` | PASS: 22 passed, 1 skipped |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Vibe stress fixture is shielded only by its `HOME` override.** It spawns the real runner, which now reads the keychain. `security find-generic-password` exits 44 under the fixture's temporary `HOME`, so the shim still sees its own token. A fixture that keeps the real `HOME` would get the real sign-in key. An env switch that turns the lookup off would close this if it ever matters.
2. **macOS only.** On other platforms the reader returns null and the parent's key passes through.
3. **A long-running `opencode serve` keeps its old credential.** A run against the service started before the change answered `Model unavailable`. Restart it, or use `--standalone`.
<!-- /ANCHOR:limitations -->

---
