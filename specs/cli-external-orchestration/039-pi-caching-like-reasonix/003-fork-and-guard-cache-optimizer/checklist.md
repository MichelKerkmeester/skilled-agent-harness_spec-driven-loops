---
title: "Verification Checklist: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard"
description: "Verification gates for the pi-cache-optimizer fork-and-guard phase."
trigger_phrases:
  - "pi-cache-optimizer fork checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer"
    last_updated_at: "2026-08-07T13:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Vendoring update re-verified; all items pass"
    next_safe_action: "None — phase 003 complete"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Full 7-hook registration inventory re-confirmed on the fork's starting commit, not assumed from this doc
  Evidence: the live source inventory returned `7274 session_start`, `7280 session_shutdown`, `7291 model_select`, `7296 before_agent_start`, `7416 before_provider_request`, `7469 after_provider_response`, and `7530 message_end`; the hosted commit diff covers the same registration points.
- [x] CHK-002 [P0] `isDeepPiOwned` predicate boundary matches deep-pi's actual scope, not `isDeepSeekLikeModel`'s broader match
  Evidence: GitHub commit `5132d137ce28cb91ec12a5475832df4d5154085a` returned `function isDeepPiOwned(model: PiModel | undefined): boolean { return model?.provider === "deepseek" && (model.id === "deepseek-v4-flash" || model.id === "deepseek-v4-pro"); }`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Guard clause is the FIRST statement in all 6 model-specific hooks (session_start, model_select, before_agent_start, before_provider_request, after_provider_response, message_end)
  Evidence: the hosted commit diff adds a guard immediately after each of the six `pi.on(...)` openings, before existing statements; no guard is added to `session_shutdown`.
- [x] CHK-011 [P0] Guard reads the model source each hook actually has available, never a nonexistent field
  Evidence: `model_select`'s guard uses `event.model` — verified correct, not a defect: Pi's `ModelSelectEvent` type (`@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts:602-607`) declares `model: Model<any>` directly on the event, and the pre-existing (unpatched) `model_select` handler already read `event.model` before this patch. The other 5 guarded hooks correctly use `ctx.model` (route-resolved) because their event types have no `model` field. An earlier automated pass flagged this as a blocker by applying the "never event.model" rule too literally without checking the actual type definition — corrected here after independent verification.
- [x] CHK-012 [P1] No unrelated files or functional changes differ from upstream `v2.8.0`
  Evidence: GitHub commit `5132d137ce28cb91ec12a5475832df4d5154085a` reports exactly two changed files, `index.ts` and `tests/review-findings.test.ts`; the extra export and boundary test are required support for the new predicate.
- [x] CHK-013 [P1] `session_shutdown` deliberately left unguarded, confirmed model-agnostic
  Evidence: the hosted commit has no `session_shutdown` hunk or guard; the pre-existing handler remains the global cleanup path described in the source audit.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Fork hosted at a reachable, pinned remote and `.pi/settings.json`'s `packages` array resolves the patched source
  Evidence (original): `.pi/settings.json` contained `"git:github.com/MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a"`; `pi list --approve` printed that source and no npm cache-optimizer entry. GitHub connector fetch returned `https://github.com/MichelKerkmeester/pi-cache-optimizer/commit/5132d137ce28cb91ec12a5475832df4d5154085a`.
  Evidence (current, 2026-08-07): `.pi/settings.json` now contains `"extensions/pi-cache-optimizer"` (Pi's local package-source type). `pi list` output confirmed: `extensions/pi-cache-optimizer` → `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer`. See CHK-024.
- [x] CHK-021 [P0] Non-DeepSeek regression check passes against a fresh A/B baseline
  Evidence: `pi --provider openai-codex --model gpt-5.6-luna --print "reply with exactly: ok" --no-session` run live (outside the network-restricted codex sandbox, which is why the automated pass above could not complete this check). `pi-cache-optimizer-stats.json`'s `totalsByModel["openai-codex/gpt-5.6-luna"].totalRequests` incremented 31→32 and `totalInputTokens` increased correspondingly — the extension is actively tracking this model exactly as before the patch. `hitRequests` stayed flat because the prompt was novel (a cache miss is expected for new content, not a regression signal).
- [x] CHK-022 [P0] `opencode/deepseek-v4-flash-free` still gets `pi-cache-optimizer` fully active
  Evidence: `pi --provider opencode --model deepseek-v4-flash-free --print "reply with exactly: ok" --no-session` run live. `pi-cache-optimizer-stats.json` gained a brand-new `totalsByModel["opencode/deepseek-v4-flash-free"]` entry with `totalRequests: 1` after the session (it did not exist before) — direct proof the narrow `isDeepPiOwned` predicate does NOT exclude this DeepSeek-family model on a non-`deepseek` provider. Also independently confirmed as a genuine live round-trip on `deepseek/deepseek-v4-flash` with a real configured API key (`pi auth print-api-key --model deepseek-v4-flash --provider deepseek` returned a live key): after that session, `pi-cache-optimizer-stats.json` gained ZERO entry for `deepseek/deepseek-v4-flash` or in `legacyFamily.deepseek` — the guard correctly silenced the extension for the model `deep-pi` actually owns.
- [x] CHK-023 [P1] Rollback tested with active sessions quiesced
  Evidence: `pgrep -fl "^pi "` / `pgrep -fl pi-coding-agent` returned no matches (no active sessions to quiesce). `.pi/settings.json`'s `packages` entry reverted to `npm:pi-cache-optimizer`, a live session confirmed normal operation (stats incremented 32→33), then re-applied to `git:github.com/MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a` as the final state, confirmed resolving via `pi list`.
- [x] CHK-024 [P0] Delivery-mechanism update (2026-08-07, operator request): patched source vendored in-repo, re-verified functionally identical
  Evidence: `.pi/extensions/pi-cache-optimizer/index.ts` diffed byte-identical against fork commit `5132d137ce28cb91ec12a5475832df4d5154085a`. `npm install && npm test` in the vendored copy: `tests 25`, `pass 25`, `fail 0`. `npm run typecheck`: exits 0, no output. `.pi/settings.json`'s `packages` array updated to `"extensions/pi-cache-optimizer"`. Live re-verification: `pi --print --session-id vendor-smoke-test-003 --model deepseek/deepseek-v4-flash "reply with just the word OK"` produced a genuine model response and zero new `pi-cache-optimizer-stats.json` entries (`totalsByModel["deepseek/deepseek-v4-flash"]` stayed `None`, `legacyFamily.deepseek.totalRequests` stayed `0`); `pi --print --session-id vendor-smoke-test-002 --model openai-codex/gpt-5.6-luna "reply with just the word OK"` incremented `totalsByModel["openai-codex/gpt-5.6-luna"].totalRequests`. Temporary session files removed after verification.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Open questions from `spec.md` §7 (fork hosting target, `after_provider_response` 400-retry guard scope) resolved and recorded before implementation closes
  Evidence: `spec.md` §7 records the public fork target and confirms the narrow guard covers the 400-retry path while preserving non-`deepseek` providers.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced in the fork, the install repoint config, or the vendored copy
  Evidence: `.pi/settings.json`'s `packages` entry now contains only the local path string `"extensions/pi-cache-optimizer"`; no credential fields were added. `grep -rnE` for assigned-secret patterns (`API_KEY=...`, `SECRET=...`, `-----BEGIN`) across `.pi/extensions/pi-cache-optimizer/*.ts`/`*.json`/`*.md`, excluding `node_modules`, returned zero matches (exit 1). `node_modules/` under the vendored path is confirmed gitignored (`git check-ignore` matched `.gitignore:83:**/node_modules`) — it is test tooling only, not committed, and not part of what Pi loads at runtime (Pi reads `index.ts` directly per `package.json`'s `pi.extensions` field).
- [x] CHK-031 [P1] Fork remote visibility (public/private) matches the operator's intent
  Evidence: GitHub connector fetched the public repository commit at `https://github.com/MichelKerkmeester/pi-cache-optimizer/commit/5132d137ce28cb91ec12a5475832df4d5154085a`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md` statuses reflect actual execution state, not the planning-time defaults
  Evidence: `spec.md` Status is Complete; `tasks.md` T001-T016 all marked `[x]` with evidence (T014-T016 added 2026-08-07 for the in-repo vendoring update).
- [x] CHK-041 [P1] Handoff to `004-adopt-deep-pi-deepseek` recorded (fork active, DeepSeek-side ownership now clear to move)
  Evidence: `implementation-summary.md` records the pinned fork, live verification evidence, and the clean handoff — phase 004 can proceed with no open blockers from this phase.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files, if any, confined to `scratch/`
  Evidence: Pi probe directories were created under this packet's `scratch/` directory and removed after each run; the failed `.pi/git/` clone residue was also removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0 |

**Status**: Complete. All items verified with live evidence. The 6-hook patch was authored and unit-tested inside a network-restricted `codex exec` sandbox (which correctly refuses `.git` writes and outbound network); the fork push, live Pi-session regression checks, and rollback test were run directly outside that sandbox since they require GitHub/provider network access the sandbox structurally does not grant. On 2026-08-07, at the operator's request, the patched source was additionally vendored in-repo (CHK-024) and re-verified functionally identical to the hosted fork.
<!-- /ANCHOR:summary -->
