---
title: "Implementation Summary"
description: "The repo-root .dsh/ folder ships two route patches and a lineage patch that compose under --dump-config to the roster provider and model with telemetry off, plus SYNC.md, README.md and a .gitignore rule for local skill links."
trigger_phrases:
  - "dsh runtime folder and patches implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches"
    last_updated_at: "2026-11-06T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the .dsh/ folder, its patches and their composition proof"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "evidence/checks.txt"
      - "evidence/dump-config-llmgateway.txt"
      - "evidence/dump-config-opencode-go.txt"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-004-dsh-runtime-folder-and-patches"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live OpenCode Go endpoint, deferred to phase 013-dsh-live-contract-pin"
      - "Whether either gateway accepts reasoning effort max on the wire, deferred to phase 013-dsh-live-contract-pin"
    answered_questions:
      - "The route patches carry compat.supportsDeveloperRole false and compat.thinkingFormat deepseek now"
      - "A checked-in route patch plus the lineage patch composes with exit 0 and no unmatched-target warning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-dsh-runtime-folder-and-patches |
| **Completed** | 2026-11-06 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repository now holds the `--patch` layers a dsh dispatch needs to land on a roster route. Phases 005, 006 and 008 can name `.dsh/patches/` files that exist instead of drafts.

### Phase 4: dsh-runtime-folder-and-patches

You can point a headless dispatch at `.dsh/patches/route-llmgateway-deepseek.patch.yml` or `.dsh/patches/route-opencode-go-deepseek.patch.yml`, add `.dsh/patches/lineage.patch.yml`, and the composed config selects that route's provider and model at reasoning effort `max`. Telemetry is `DISABLED` and `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode` are off. Each route provider carries `compat.thinkingFormat: deepseek` and `compat.supportsDeveloperRole: false` and declares the levels `off`, `high` and `max` for its one model. `.dsh/SYNC.md` lists every entry in the folder with its mechanism and source and gives the drift check. `.dsh/README.md` is the operator entry point. `.gitignore` line 234 ignores `/.dsh/skills/local-*`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | Created | `llm-pi-ai` provider `llmgateway` and `agent-default-model` for `deepseek-v4.1-flash-1017` |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | Created | `llm-pi-ai` provider `opencode-go` and `agent-default-model` for `deepseek-v4.1-flash` |
| `.dsh/patches/lineage.patch.yml` | Created | Telemetry off and four rows disabled |
| `.dsh/SYNC.md`, `.dsh/README.md` | Created | Inventory with drift check, and the operator entry point |
| `.gitignore` | Modified | One line, `/.dsh/skills/local-*`, after `/.cursor/skills/local-*` |
| `evidence/` (8 captures and `checks.txt`) | Created | Composition, keyless boot and rerun checks |
| `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`, `spec.md` | Modified | Results and closure |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. `cli-codex` (log header `model: gpt-6-luna`, `reasoning effort: xhigh`, `approval: never`) wrote the three patches and the `.gitignore` line from a short brief. It copied the phase 002 draft rows and rewrote only each header comment. With comments removed, `diff` against the drafts was empty at that point, and it still is for the lineage patch.
2. The orchestrating Claude session then added three research-recommended fields to both route patches: `compat.supportsDeveloperRole: false`, a per-model `reasoningEfforts` map with `off`, `high` and `max`, and `reasoningEffort: max` on `agent-default-model`. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:182-186] This departs from goal D2 and is logged in `goal.md`.
3. The orchestrating session wrote `.dsh/SYNC.md` and `.dsh/README.md` with `sk-create-readme`.
4. The orchestrating session ran `--dump-config` per route with the lineage patch, then a keyless boot per route (`env -i`, a disposable `DSH_HOME`, a temp cwd, `--json --approval-policy never -`). The literal command lines were not saved.
5. This closeout reran the secret scan, the ignore check, the `SYNC.md` loop, a comment-label scan, a key-value scan and the README validator into `evidence/checks.txt`.

Composed `agent-default-model` row, quoted from both dumps:

```text
evidence/dump-config-llmgateway.txt:57-62
- id: agent-default-model
  name: '@deepseek-ai/dsh-agent-default-model'
  config:
    provider: llmgateway
    model: deepseek-v4.1-flash-1017
    reasoningEffort: max

evidence/dump-config-opencode-go.txt:57-62
- id: agent-default-model
  name: '@deepseek-ai/dsh-agent-default-model'
  config:
    provider: opencode-go
    model: deepseek-v4.1-flash
    reasoningEffort: max
```

Both `dump-config-<route>.stderr.txt` files hold the single line `exit=0`. The keyless boots exit 1 with stderr `dsh: MISSING_CREDENTIAL: llm-pi-ai: no credential for provider route "llmgateway"` and the same for `"opencode-go"`. The harness loaded the patched provider and stopped only at the missing key.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One route patch per roster entry | dsh has no per-call route flag, and one shared profile would let routes cross |
| `.dsh/` is a repo convention passed explicitly, never `$DSH_HOME` | A home carries profiles, sessions and package trees that must not live in the checkout |
| The route patches carry `supportsDeveloperRole: false`, `reasoningEfforts` and `reasoningEffort: max` now | The research recommends them. A hand-declared model has no levels until declared, and a boot with the fields reached the credential check instead of failing on config |
| `command-goal` is disabled with `goal-round-driver` | The phase 002 draft disabled both and composed cleanly, so the shipped patch keeps that row set |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `--dump-config` per route | `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, `reasoningEffort: max`, `mode: DISABLED`, four rows disabled, stderr `exit=0` only |
| Keyless boot per route | exit 1, last line `final` with code `MISSING_CREDENTIAL` naming that route |
| `rg -n -i 'api_?key\|secret\|token' .dsh/patches` | two `apiKeyEnv` lines only, `exit=0` |
| `git check-ignore -q .dsh/skills/local-probe` | `exit=0`, rule `.gitignore:234` |
| `SYNC.md` coverage loop over `ls .dsh` | all three entries found, `exit=0` |
| Comment-label scan over `.dsh/patches` | no match, `exit=1` |
| Key-value scan over `evidence/` | no match, `exit=1` |
| `validate_document.py` | README `VALID` 0 issues, SYNC.md one `document_type_fallback` warning |
| `validate.sh <phase folder> --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Composition is not a live answer.** `--dump-config` and the keyless boot prove the patches select the right rows. Whether each route authenticates and answers stays UNKNOWN until phase `013-dsh-live-contract-pin`.
2. **The OpenCode Go endpoint is a placeholder.** `https://opencode.ai/zen/go/v1` was never called. The research also names `https://opencode.ai/inference/go/openai/v1` from Models.dev as an alternative. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:180]
3. **`max` on the wire is unconfirmed.** The harness accepts the `max` level in config. Whether either gateway accepts it in a request is UNKNOWN until a keyed run.
<!-- /ANCHOR:limitations -->

---

