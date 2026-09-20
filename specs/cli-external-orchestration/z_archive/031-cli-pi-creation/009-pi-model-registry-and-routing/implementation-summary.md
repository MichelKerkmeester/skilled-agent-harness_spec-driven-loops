---
title: "Implementation Summary: Pi model registry and routing"
description: "Fail-closed PI_SUPPORTED_MODELS allowlist populated with the operator's own live-confirmed 7-model Pi roster, sk-prompt/prompt-models registry rows added to the 3 already-profiled models, and a new TBD-marked entry for a genuinely new variant - implemented via LUNA in two dispatch passes after an operator correction, reviewed by GLM-5.2."
trigger_phrases:
  - "pi model registry summary"
  - "cli-pi allowlist implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/009-pi-model-registry-and-routing"
    last_updated_at: "2026-07-27T11:26:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via LUNA (2 passes), reviewed by GLM-5.2, all findings addressed"
    next_safe_action: "Commit phase 009; start phase 010"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Pi's own dispatch-time CLI flag/parameter names for reasoning effort and service tier remain unconfirmed - no live pi session was run this phase"]
    answered_questions: ["Branch B resolved twice: a generic pi.dev/models fetch (1,106+ models, 40+ providers, no house model) then stronger operator-supplied evidence (a live configured Pi model picker naming the exact 7-model roster)", "PI_DEFAULT_MODEL is deepseek-v4-pro, a judgment call documented as such"]
---
# Implementation Summary: Pi model registry and routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-pi-model-registry-and-routing |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase gives `cli-pi` a fail-closed model allowlist and a real prompt-craft registry contribution, so a Pi dispatch can never carry an unvetted `--model` value and every allowlisted model has the same prompt-craft guidance every other executor's models get. Unlike phases 004-008, this phase does real code and config work — it mirrors the exact pattern this repo already proved for `cli-cursor` (`CURSOR_SUPPORTED_MODELS`/`CURSOR_DEFAULT_MODEL`/`isCursorModelAllowed()`), and folds the fail-closed hardening into this same phase rather than deferring it to a later hardening pass the way the Cursor precedent originally did.

### Branch resolution, twice

Open Question 1 (does Pi have a native/house model, or is it pure provider pass-through) was resolved via a live fetch of `pi.dev/models`: Pi lists roughly 1,106 models across 40+ providers with no documented default — Branch B. Mid-implementation, the operator supplied stronger, more specific evidence: a screenshot of their own live, configured Pi session's model picker, naming exactly 7 dispatchable ids grouped by provider (`deepseek-v4-pro` [deepseek], `MiniMax-M3` [minimax], `gpt-5.6-luna`/`gpt-5.6-sol`/`gpt-5.6-terra` [openai-codex], `mimo-v2.5-pro-ultraspeed`/`mimo-v2.5-pro` [xiaomi]). This is direct, first-party confirmation of exactly which models this repo's own Pi setup reaches, superseding the generic public catalog. The first LUNA implementation pass (built against the generic catalog) was corrected in a second pass to use this real roster.

### Registry additions, grounded not fabricated

Of the 7 models, `deepseek-v4-pro`, `minimax-m3`, and `mimo-v2.5-pro` already had full sk-prompt/prompt-models profiles (the small-model rotation also used by `cli-opencode`) — each gained a `cli-pi` executor row alongside its existing `cli-opencode` row, reusing that model's existing provider/quota_pool strings rather than inventing new ones. `mimo-v2.5-pro-ultraspeed` is a genuinely new variant with no prior profile anywhere in the repo; rather than copy `mimo-v2.5-pro`'s specs onto it, every unconfirmed field (context length, capability flags, strengths, weaknesses, recommended framework) is explicitly `null`/`"TBD"`/`"unconfirmed"`. The 3 GPT-5.6 models deliberately received **no** sk-prompt profile: `references/models/_index.md` already declares frontier models (including `gpt-5.6-sol-*`) out of scope for this registry, a pre-existing, deliberate boundary this phase respected rather than overrode. Their dispatch documentation instead lives in a new `cli-pi/references/model-dispatch-gpt-5.6.md`, which cites this repo's own `cli-codex/SKILL.md` for the real reasoning-effort ceilings (`gpt-5.6-luna`/`gpt-5.6-terra` up to `max`, `gpt-5.6-sol` up to `ultra`, the only one reaching it) while explicitly flagging Pi's own dispatch-flag syntax for effort/service-tier as unconfirmed — no Pi CLI syntax was invented.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt/prompt-models/assets/model-profiles.json` | Modified | `cli-pi` executor rows on 3 models; new TBD-marked `mimo-v2.5-pro-ultraspeed` entry; version bump + description clause |
| `sk-prompt/prompt-models/references/models/_index.md` | Modified | New row + prose note for the Pi contribution; frontier-scope sentence left untouched |
| `cli-external-orchestration/cli-pi/references/model-dispatch-gpt-5.6.md` | Created | GPT-5.6 dispatch documentation via Pi's `openai-codex` custom provider |
| `cli-external-orchestration/cli-pi/SKILL.md` | Modified | One-line pointer to the new reference file |
| `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modified | `cli-pi` added to all 3 coverage points; a CHECK 2 delegation-pattern fallback and a CHECK 3 unconfirmed-stub exclusion, both verified as genuine fixes, not workarounds |
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS` (7 ids), `PI_DEFAULT_MODEL`, `isPiModelAllowed()` |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Fail-closed allowlist check in `buildPiLineageCommand`, mirrors `buildCursorLineageCommand` |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modified | Identical fail-closed check in the cli-pi case of `buildSpawnSpec` |
| 3 test files (`executor-config.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts`) | Modified | Accept/reject/default coverage for the corrected 7-id roster |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to GPT-5.6-LUNA (xhigh, fast) via cli-codex, in two passes. The first pass implemented the full 9-file change set against the generic `pi.dev/models` catalog; I independently verified every file's diff against the real repo state (not the agent's self-report) before the operator's screenshot arrived mid-review. The second pass corrected only the model-roster-dependent parts (the 7 ids, the 3 real registry rows, the new stub, the new GPT-5.6 reference doc) while keeping the first pass's correctly-shaped allowlist mechanism and CI-gate fixes. I independently re-verified the corrected diff myself — every provider/quota_pool string, every TBD marker, every test assertion — before dispatching GLM-5.2 (via cli-devin) for an independent review. GLM-5.2 returned APPROVE WITH MINOR NOTES: no blocking findings, 2 non-blocking notes (a provider-string wording choice for the mimo-v2.5-pro row, and a git-diff verification gap in its own sandboxed environment), both of which I closed myself — the provider-string choice is grounded in existing prose (not fabrication) and I ran the missing `git diff` directly to confirm the frontier-scope sentence is genuinely untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the operator's live model-picker screenshot as stronger evidence than the generic `pi.dev/models` fetch, and redo the implementation | A first-party screenshot of the operator's own configured Pi session names exactly which models THIS repo's Pi setup reaches; a generic public catalog of 1,106 models says nothing about that |
| Add real `cli-pi` executor rows to 3 already-profiled models, reversing the first pass's "zero new rows" decision | Once the corrected roster showed these 3 specific models ARE dispatchable through Pi, adding rows became the accurate Branch B outcome; leaving them off would have under-documented a real capability |
| Do not author sk-prompt profiles for gpt-5.6-luna/sol/terra | `_index.md` already declares frontier models out of scope for this registry; creating new profiles for them would silently reverse an existing, deliberate policy this phase has no mandate to change |
| Mark `mimo-v2.5-pro-ultraspeed` as fully TBD rather than inheriting `mimo-v2.5-pro`'s specs | It's a distinct id with zero prior documentation in this repo; copying the base model's numbers would be exactly the fabrication risk this phase's own spec.md warns against |
| Default `PI_DEFAULT_MODEL` to `deepseek-v4-pro`, explicitly flagged as a judgment call | No usage history favors any of the 7 ids for Pi specifically; `deepseek-v4-pro` is this registry's first-listed, most broadly adopted small-model-rotation entry |
| Independently re-verify both LUNA passes and GLM's review myself rather than trusting any single report | LUNA's own test-run claims in phase 002 were previously found unreliable; GLM's own environment could not execute shell commands this time (an honest, flagged limitation, not a fabricated result) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-prompt-quality-card-sync.sh` | PASS — GUARD PASS, exit 0, independently re-run twice (once per LUNA pass) |
| `python3 -c "json.load(...)"` on `model-profiles.json` | PASS — parses cleanly, independently re-run |
| `npx vitest run` (executor-config.vitest.ts + fanout-run.vitest.ts) | PASS — 169/169, independently re-run |
| `npx vitest run` (remediation.vitest.ts) | PASS — 30/31; the 1 failure is the pre-existing "rejects a retired executor" test, `git-stash`-confirmed pre-existing in phase 002's closeout, unrelated to this phase |
| `tsc --ignoreDeprecations 6.0 --noEmit` (no `typecheck` npm script exists) | PASS — exit 0, run by LUNA |
| GLM-5.2 independent review | APPROVE WITH MINOR NOTES — 0 blocking findings; 2 non-blocking notes, both closed |
| Comment hygiene grep (spec/phase/task IDs in code comments) | PASS — 0 matches across all touched `.ts`/`.cjs`/`.sh` files |
| Sibling-model regression diff | PASS — `composer-2.5`/`kimi-k2.7-code`/`glm-5.2`/`haiku` byte-identical to HEAD |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree metadata round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live `pi` command has been run for this phase.** The allowlist's model ids are confirmed via the operator's own live model picker (a screenshot, not a captured CLI invocation), and the fail-closed check itself has never been exercised against a real `pi` dispatch. `buildPiLineageCommand`/`buildSpawnSpec`'s cli-pi cases both still throw "headless invocation contract is confirmed" unconditionally past the allowlist check — the allowlist is real and tested, but end-to-end dispatch remains blocked on phase 001's own credential/live-session gap.
2. **Pi's own CLI syntax for selecting reasoning effort or service tier is unconfirmed.** `cli-pi/references/model-dispatch-gpt-5.6.md` documents the Codex-side ceilings (max/ultra) as evidence for what the underlying models support, but explicitly does not claim Pi accepts the same `-c model_reasoning_effort=`/`-c service_tier=` flags — that mapping is an open item for a future execution phase.
3. **The `mimo-v2.5-pro` cli-pi row's provider string (`xiaomi`) differs from the existing opencode row's provider string (`xiaomi-token-plan-ams`).** GLM-5.2 flagged this as worth a closer look: it is grounded in existing prose (the model's own notes already name `xiaomi` as a valid direct-provider slug) and not fabricated, but it is not a byte-identical reuse of the primary row's provider string — a future phase confirming Pi's actual xiaomi integration should double-check which provider string is truly correct.
4. **`mimo-v2.5-pro-ultraspeed` has zero confirmed specs beyond its id and provider grouping.** A future phase must live-verify its context window, pricing, and behavioral differences from the base `mimo-v2.5-pro` id before any of that can be documented as fact.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
