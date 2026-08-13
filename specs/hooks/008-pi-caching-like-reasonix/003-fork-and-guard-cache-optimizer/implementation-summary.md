---
title: "Implementation Summary: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard"
description: "pi-cache-optimizer is patched with a narrow provider-scoped guard on all 6 model-specific hooks and vendored in-repo; Pi resolves it via a local package source, no external repo dependency. All live verification (non-DeepSeek, opencode-routed DeepSeek-family, real DeepSeek-direct, rollback) passed with real evidence."
trigger_phrases:
  - "pi-cache-optimizer fork status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer"
    last_updated_at: "2026-08-11T06:43:17.952Z"
    last_updated_by: "spec-author"
    recent_action: "Re-confirmed independently after unrelated concurrent repo changes"
    next_safe_action: "None — phase 003 complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md", ".pi/settings.json", ".pi/extensions/pi-cache-optimizer/index.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fork target is the public MichelKerkmeester/pi-cache-optimizer repository at commit 5132d137ce28cb91ec12a5475832df4d5154085a; that fork remains published as the patch's origin."
      - "after_provider_response is covered by the same narrow guard before its 400-retry compatibility path."
      - "model_select's event.model is correct (that event type carries model directly); the other 5 hooks correctly use ctx.model."
      - "2026-08-07: at operator request, the patched source now resolves from an in-repo vendored copy (Pi's local package-source type) instead of the hosted git fork; content is byte-identical, re-verified with a fresh test run and live smoke tests."
      - "2026-08-07 (later): unrelated concurrent work in this repo removed the now-unneeded .pi/git/ runtime clone cache (176MB, the pre-vendoring git-source install artifact; nothing referenced it since the vendored copy replaced it). Re-ran npm test/npm run typecheck directly against .pi/extensions/pi-cache-optimizer/ myself afterward: still 25/25 passing, still exit 0 — the vendored copy was untouched by that unrelated cleanup."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-fork-and-guard-cache-optimizer |
| **Completed** | 2026-08-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`pi-cache-optimizer` no longer touches DeepSeek's direct API. It's patched with a narrow ownership guard across every model-specific hook, and the local Pi install resolves that patched source from inside this repo — no external repository dependency — with live sessions proving the boundary holds exactly where it should and nowhere else.

### The guard

`jiangge/pi-cache-optimizer` v2.8.0 was forked to the public `MichelKerkmeester/pi-cache-optimizer` and patched at commit `5132d137ce28cb91ec12a5475832df4d5154085a`. A new `isDeepPiOwned(model)` predicate matches only `provider === "deepseek"` with `id` `deepseek-v4-flash` or `deepseek-v4-pro` — deliberately narrower than the package's existing `isDeepSeekLikeModel`, which substring-matches any "deepseek" model or provider name. The guard was added as the first statement in all 6 model-specific hooks (`session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, `message_end`); `session_shutdown` was deliberately left untouched since it's global cleanup with no model branching. `tsc --noEmit` exits 0 and the fork's test suite passes 25/25 (24 pre-existing plus one new boundary test).

### The install pointer

`.pi/settings.json`'s `packages` array carries `"extensions/pi-cache-optimizer"` — a bare path with no `npm:`/`git:` prefix, which Pi's package manager treats as its `local` source type (confirmed by reading `@earendil-works/pi-coding-agent`'s `package-manager.js`: `isLocalPath()` accepts any non-prefixed string, resolved directly against the project's `.pi/` directory, no clone or copy involved). `pi list` confirms it resolves to `<repo>/.pi/extensions/pi-cache-optimizer` — the only `pi-cache-optimizer` source active, no duplicate, no stale npm entry.

At operator request, this replaced the earlier `git:github.com/MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a` fork pointer: the patched `index.ts` was copied into `.pi/extensions/pi-cache-optimizer/` (byte-identical, diff-confirmed against the fork commit) along with its `package.json`, `tests/`, `tsconfig.json`, `types/`, `LICENSE`, and `README*`. The public fork stays published as the patch's origin but is no longer read by this install.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `index.ts` (fork, historical) | Modified | Added `isDeepPiOwned` predicate and 6 guard calls |
| `tests/review-findings.test.ts` (fork, historical) | Modified | Added the predicate boundary test |
| `.pi/extensions/pi-cache-optimizer/` | Added | In-repo vendored copy of the patched source (current runtime source) |
| `.pi/settings.json` | Modified | `pi-cache-optimizer` entry now resolves to the local vendored path, not npm or the git fork |
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` | Updated | Recorded Complete status with real command-output evidence, including the vendoring re-verification |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The patch itself was authored and tested by a `gpt-5.6-luna` (max reasoning, fast tier) dispatch inside a `codex exec --sandbox workspace-write` sandbox, scoped to a local clone of the fork — that sandbox has no outbound network and refuses writes under `.git`, so it could do the code edit, typecheck, and test run, but not the actual GitHub fork/clone/push. Those steps, plus every live-session check, were run directly (outside the sandbox) since they genuinely require network access the sandbox structurally does not grant.

Pi's accepted git-source syntax was confirmed two ways before trusting it: `pi install --help`'s examples show the `git:host/path` shorthand, and grepping Pi's own `package-manager.js` confirmed the shorthand supports an `@ref` suffix for pinning (`${shorthand}@${parsed.ref}`) — not a guess, a verified feature. `pi update --extension "git:...@<sha>"` was then run live and genuinely cloned and pinned the fork at the exact commit, confirmed via `pi list`.

Live verification ran real non-interactive Pi sessions (`pi --print`) and read `pi-cache-optimizer-stats.json` before/after each one:
- Non-DeepSeek (`openai-codex/gpt-5.6-luna`): `totalRequests` incremented 31→32, proving the extension is still fully active for every provider it served before.
- `opencode/deepseek-v4-flash-free` (a DeepSeek-family model on a non-`deepseek` provider — the exact edge case this guard exists to protect): a brand-new stats entry appeared (0→1) after the session, proving the narrow predicate does NOT wrongly exclude it.
- `deepseek/deepseek-v4-flash` direct: `pi auth print-api-key` confirmed a real configured credential exists, the session returned a genuine model response, and `pi-cache-optimizer-stats.json` gained zero entry for it — the guard correctly silenced the extension exactly where `deep-pi` (phase 004) will take over.

Rollback was exercised for real: no active Pi sessions were found (`pgrep` returned nothing to quiesce), the settings entry was reverted to `npm:pi-cache-optimizer`, a live session confirmed normal operation, then the pinned fork source was re-applied as the final state.

**Delivery mechanism update (2026-08-07):** the operator asked for the patched source to live in this repo rather than a separately-hosted one. The fork's content at the pinned commit was copied into `.pi/extensions/pi-cache-optimizer/`, `npm install && npm test && npm run typecheck` were re-run in that exact vendored directory (25/25 pass, clean typecheck — a fresh run, not assumed from the earlier fork verification), and `.pi/settings.json` was updated to the bare local path. The same live smoke tests from the original delivery were repeated against the vendored copy: a `deepseek/deepseek-v4-flash` session produced zero new `pi-cache-optimizer-stats.json` entries, and an `openai-codex/gpt-5.6-luna` session incremented its counters normally — the guard behaves identically from its new location.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add a separate narrow `isDeepPiOwned` predicate instead of reusing `isDeepSeekLikeModel` | The existing predicate intentionally matches any "deepseek"-ish model/provider string; `deep-pi` owns only direct `deepseek-v4-flash`/`deepseek-v4-pro`. Reusing the broad one would have wrongly excluded `opencode/deepseek-v4-flash-free` — confirmed as a real, currently-enabled model in this environment, not a hypothetical. |
| Guard all 6 model-specific hooks, not just 2 | An earlier draft only guarded 2 hooks; the full registration audit found 4 more (`session_start`, `model_select`, `after_provider_response`, `message_end`) that also needed the guard to genuinely achieve zero DeepSeek-direct footprint. |
| `model_select` guard uses `event.model`; the other 5 use `ctx.model` | Not an inconsistency — verified against Pi's actual type definitions. `ModelSelectEvent` carries `model` directly on the event; the other 5 event types don't, so their guards correctly resolve it from `ctx`. |
| Require a hosted, pinned fork + `.pi/settings.json` repoint, not a `node_modules` edit | A local `node_modules` patch is silently wiped by the next Pi install/update, quietly reopening the double-mutation problem this phase exists to close. |
| Split implementation between a sandboxed dispatch (code) and direct execution (git/network/live sessions) | `codex exec`'s workspace-write sandbox has no network and blocks `.git` writes — a structural limit, not a policy choice. Splitting kept the code-authoring work inside the intended dispatch while the genuinely network-dependent steps ran where network actually exists. |
| Leave `session_shutdown` unguarded | Confirmed via source read: it's global cleanup (stats flush, cache-hint teardown, env restore) with no model-specific branching. |
| Vendor the patched source in-repo instead of keeping the hosted fork as the operational source | Operator preference: one repository to review and maintain instead of two. Pi's `local` package-source type makes this a supported, first-class mechanism (not a workaround) — the vendored copy is tracked by this repo's own git history, same as the project's other `.pi/extensions/*.ts` files, so it survives reinstall/multi-machine use exactly as well as the hosted-fork approach did. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fork typecheck | PASS — `tsc --noEmit` exit 0 |
| Fork test suite | PASS — 25/25 (24 pre-existing + 1 new boundary test) |
| Diff scope | PASS — only `index.ts` (+11 lines) and `tests/review-findings.test.ts` (+9 lines) changed |
| Git-source syntax verified | PASS — confirmed via `pi install --help` and Pi's own `package-manager.js` source (`@ref` pin support), then proven live via `pi update --extension` |
| Install repointed | PASS — `.pi/settings.json` + `pi list` both show the pinned fork, no duplicate npm entry |
| Non-DeepSeek regression | PASS — live session, stats incremented normally (31→32→33 across checks) |
| `opencode/deepseek-v4-flash-free` stays covered | PASS — live session, new stats entry created (0→1) |
| DeepSeek-direct silenced | PASS — live session with a real API credential and a real model response; zero stats entry created |
| Rollback | PASS — no active sessions to quiesce; reverted, confirmed normal operation, re-applied fork as final state |
| In-repo vendored copy: byte-identical to fork commit | PASS — `diff` against `5132d137ce28cb91ec12a5475832df4d5154085a` shows zero differences |
| In-repo vendored copy: fresh test/typecheck run | PASS — `npm test` 25/25, `npm run typecheck` clean, run directly in `.pi/extensions/pi-cache-optimizer/` |
| In-repo vendored copy: `pi list` resolution | PASS — `extensions/pi-cache-optimizer` → `<repo>/.pi/extensions/pi-cache-optimizer` |
| In-repo vendored copy: live guard smoke test | PASS — DeepSeek-direct session zero new stats entries; non-DeepSeek session incremented normally |
| `validate.sh --strict` | PASS — 0 errors, 0 warnings |
| Re-confirmed after unrelated concurrent repo changes | PASS — `.pi/git/` runtime clone cache (unused since vendoring) was removed by unrelated work; re-ran `npm test`/`npm run typecheck` directly, still 25/25 and exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The historical fork is a personal GitHub repo, not upstreamed.** It's no longer the operational source (superseded by the in-repo vendored copy), but if `jiangge/pi-cache-optimizer` ships fixes worth pulling in, someone still has to manually diff and re-apply them to the vendored copy — the diff is small (one predicate function + 6 one-line guard calls) so re-applying after a version bump is mechanical.
2. **`after_provider_response`'s 400-retry compat path is covered by the same guard** but wasn't separately stress-tested against a live 400 response — the open question in `spec.md` is resolved by design (same predicate, same hook) rather than by a dedicated retry-path test.
3. **Live DeepSeek verification used one real request, not an exhaustive suite.** It's sufficient to prove the guard fires (zero stats entry on a genuine API round-trip), but phase 005's cross-extension verification will exercise this more thoroughly once `deep-pi` is installed.
4. **Two copies of the patched source now exist** (the published fork commit and the in-repo vendored copy). They're diff-confirmed identical as of 2026-08-07, but nothing automatically keeps them in sync — a future edit to one without the other would silently reintroduce drift. The vendored copy in `.pi/extensions/pi-cache-optimizer/` is the one Pi actually reads; the fork is provenance only.
<!-- /ANCHOR:limitations -->
