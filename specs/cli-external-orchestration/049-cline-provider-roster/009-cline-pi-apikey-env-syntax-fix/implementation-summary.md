---
title: "Implementation Summary: cline-pass apiKey now resolves from the environment in pi's own syntax"
description: "The provider block used opencode's {env:VAR} placeholder, which pi sends to Cline as a literal key for a 401. A /login credential masked it, so only sessions with their own agent directory failed. Switched to ${VAR}, sourced the key from ~/.zshenv, and proved environment-only authentication against an empty auth store."
trigger_phrases:
  - "cline apiKey syntax fixed"
  - "pi dispatched session 401 resolved"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/009-cline-pi-apikey-env-syntax-fix"
    last_updated_at: "2026-08-25T05:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Fixed cline-pass apiKey placeholder syntax and sourced the key from the environment"
    next_safe_action: "Operator reviews the working-tree changes, then commits and pushes"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/custom-providers.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-cline-pi-apikey-env-syntax-fix |
| **Completed** | 2026-08-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Dispatched and non-interactive pi sessions can now reach the cline-pass models. Before this phase they reported either a Cline `401 Unauthorized` or `No models available. Use /login...`, while the operator's own interactive session ran `x-ai/ox-alpha` normally.

### The root cause

The provider block declared `"apiKey": "{env:CLINE_API_KEY}"`. That is **opencode's** placeholder syntax, and opencode's own cline-pass block is the natural thing to copy from. pi has no `{env:...}` form — its config-value syntax is `$VAR`, `${VAR}`, `!command`, `$$` and `$!` — so pi treated the braced string as a **literal** API key and sent it to Cline verbatim.

Three things kept this invisible. `pi --list-models` lists models without ever contacting the provider. `pi auth check` returned `{"status":"ready"}` because it never sends a completion, so any non-empty `apiKey` reads as healthy. And the operator's `/login`-stored credential in `~/.pi/agent/auth.json` takes precedence over the config value, so every interactive turn succeeded. Only a session that could not see that auth store — its own `PI_CODING_AGENT_DIR`, a different `HOME`, a container, another machine — fell through to the literal. `CLINE_API_KEY` was not exported in any shell or startup file, so the environment route the config claimed to use had never once run.

The two reported symptoms are the same defect at two stages: no provider block visible gives `No models available`, and a visible block with no usable credential gives the 401.

### The fix

The `apiKey` is now `${CLINE_API_KEY}`, and the key is exported from `~/.zshenv` — which zsh reads for non-interactive shells, so dispatched sessions inherit it. `.pi/custom-providers.md` and the cli-pi provider reference now both name `{env:...}` as the wrong syntax, quote the exact 401 it produces, and warn that `pi auth check` cannot detect it. The `/login` credential was left in place as the interactive convenience.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | cline-pass `apiKey` in pi's `${VAR}` syntax |
| `.pi/custom-providers.md` | Modified | Correct syntax, credential precedence and portability, `pi auth check` blind spot |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Credential gotcha in the cline-pass section |
| `~/.zshenv` | Modified | Export `CLINE_API_KEY`; file mode restricted to 600 (operator machine, outside the repo) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Diagnosed by reproducing both symptoms against a disposable `PI_CODING_AGENT_DIR`, then reading pi's own `docs/custom-provider.md`, which states the supported config-value syntax and does not include a `{env:...}` form. The decisive evidence is an A/B under identical conditions — same isolated agent directory, same empty `auth.json`, same exported key, only the placeholder differing: `{env:CLINE_API_KEY}` returned the Cline 401, `${CLINE_API_KEY}` returned the requested token. The fix was then proven end-to-end against the production `.pi/models.json` with an empty auth store, dispatched through a fresh non-interactive zsh so the key could only have come from `~/.zshenv`. All probe directories were removed afterwards.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `${CLINE_API_KEY}` rather than `$CLINE_API_KEY` | Both are supported; the braced form reads unambiguously next to surrounding JSON and matches how the docs present the value |
| Put the export in `~/.zshenv`, not `~/.zshrc` | zsh reads `.zshenv` for non-interactive shells too, which is exactly the case that was failing; `.zshrc` would have fixed only interactive sessions |
| Restrict `~/.zshenv` to mode 600 | The file now holds a live API key; it was world-readable before |
| Keep the `/login` credential | It still works and takes precedence; removing it would change interactive behavior for no benefit |
| Document the trap in both config docs | The defect is a silent literal, not a parse error, and the wrong syntax is one copy-paste away from opencode's equivalent block |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control — isolated dir, empty auth store, key exported, `{env:CLINE_API_KEY}` | PASS (fails as predicted) — `401 "Unauthorized: Please make sure you're using the latest version of Cline and re-authenticate your Cline account."` |
| Positive control — identical conditions, `${CLINE_API_KEY}` | PASS — returned `TOKEN_B` |
| End-to-end — production `.pi/models.json`, empty auth store, fresh non-interactive `zsh -c` | PASS — returned `PI_ENV_CRED_OK` |
| Pre-fix baseline — real agent directory, stored credential | PASS — returned `PI_OX_OK` (confirms the masking, and that interactive use was never broken) |
| `.pi/models.json` parses | PASS (`python3 -c json.load`) |
| `pi --list-models` lists all three cline-pass rows | PASS |
| Probe residue removed | PASS — all disposable agent directories deleted |
| `validate.sh --strict` (this phase) | PASS — recorded in this session |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The key now lives in a shell startup file.** `~/.zshenv` is outside the repo and restricted to mode 600, but it is still a plaintext secret on disk. Rotating the Cline key means editing that file as well as any `/login` store.
2. **Processes that inherit a stripped environment are still unauthenticated.** A child spawned without a shell, or with a scrubbed environment, gets neither the export nor the auth store. Such a caller must pass `CLINE_API_KEY` explicitly.
3. **`pi auth check` remains unreliable for this provider.** It still reports `ready` on any non-empty `apiKey`. Only a round-trip dispatch proves the credential; this is documented rather than fixed, since it is pi's behavior.
<!-- /ANCHOR:limitations -->
