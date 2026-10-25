---
title: "Implementation Summary"
description: "Typing opencode now starts OpenCode 2 on the default database. OpenCode 1 moved to an opencode1 launcher with its own copy of the database, and the setup helper and install reference build and describe that layout."
trigger_phrases:
  - "opencode v2 default name implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/066-opencode-v2-default-name"
    last_updated_at: "2026-10-24T08:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Swapped the OpenCode names on this machine and rebuilt the setup helper and install reference"
    next_safe_action: "Operator reviews and commits the three repo files and this phase folder"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-both.test.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-066-opencode-v2-default-name"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does an npm install or uninstall of opencode-ai in ~/.local replace, refuse or remove an opencode link that points into the v2 prefix?"
    answered_questions:
      - "v1 honours OPENCODE_DB: two opencode1 runs landed in opencode-v1.db"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 066-opencode-v2-default-name |
| **Completed** | 2026-10-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Typing `opencode` now starts OpenCode 2, the version the repository expects. OpenCode 1 is still there as `opencode1`, and it reads its own copy of the session history, so it never opens the database OpenCode 2 migrated.

### Phase 66: opencode-v2-default-name

On this machine, `opencode` and `opencode2` are symlinks to the v2.1.4 binary and use the default `opencode.db`. v2 migrated that file on its first run and now holds the 1,339 v1 sessions as v2 sessions. `opencode1` is a launcher that runs v1.19.3 on `opencode-v1.db`, copied from `opencode.db` before v2 touched it. Dispatch still prefers `opencode2`, which is still v2, so no resolver, playbook or `opencode2 run` line had to change.

`opencode-setup.sh both` now builds the same layout. It moves any file an earlier layout left at a v2 name aside instead of deleting it, and it prints the database copy command rather than running it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modified | `both` links the v2 names and writes the `opencode1` launcher; `check` reports three names |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-both.test.cjs` | Created | Covers the new layout, an idempotent rerun and the aside-copy refusal |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Modified | Describes the new side-by-side layout, launcher and databases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The machine came first. Both earlier names and `opencode.db` with its WAL and SHM were copied byte for byte to `~/.local/share/opencode/pre-v2-default-20261024/` while no OpenCode process ran. v1's copy was made with `sqlite3 .backup`. Then the names were swapped and each version ran a live prompt. The helper and reference followed, and were tested against the layout the machine now has. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| v1 moves to `opencode1`, and `opencode2` stays v2 | The v2 package itself ships `opencode2`, and the resolver and 148 doc lines already treat it as v2, so the repo change stays small |
| v2 adopts `opencode.db` | The operator's choice, made knowing the 271 sessions in `opencode-v2.db` stay behind |
| v1 gets its own copy of the database | Without it, v1 would open a file v2 had already migrated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `--version` on `opencode`, `opencode2`, `opencode1` | PASS: `opencode v2.1.4`, `opencode v2.1.4`, `1.19.3` |
| Live `opencode run --standalone -m openai/gpt-5.6-luna-fast` | PASS: replied `OK` |
| Live `opencode1 run -m openai/gpt-5.6-luna-fast` | PASS: replied `OK` |
| Database separation | PASS: `opencode.db` 1,343 `session_v2` rows; `opencode-v1.db` 1,341 `session` rows and no `session_v2` table |
| `opencode-setup.sh check` on this machine | PASS: v2, v2, v1; exit 0 |
| `opencode-setup-both.test.cjs` negative control | PASS: 0 of 2 pass against the previous helper |
| shellcheck `opencode-setup.sh` | PASS: exit 0 |
| config-shape, battery and cli-opencode unit tests | PASS: 87 of 87 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **v2's earlier sessions are out of view.** The 271 sessions in `opencode-v2.db` stay in that file; neither name opens it.
2. **A v1 npm operation can take the `opencode` name back.** Whether npm replaces or refuses a link into the v2 prefix was not probed. Run `check`, then `both`, after any v1 npm operation.
3. **Pins are stale.** The reference is verified against v2 2.0.32 but 2.1.4 is installed, and it says the v1 channel is frozen at 1.19.3 while npm `latest` is now 1.19.4. Running `both` here would install the 2.0.32 pin over 2.1.4.
<!-- /ANCHOR:limitations -->

---
