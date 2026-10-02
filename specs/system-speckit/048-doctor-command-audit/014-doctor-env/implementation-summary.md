---
title: "Implementation Summary"
description: "Built /doctor:env as a thin router, workflow and presentation asset that audits the live switch reference, reports set or unset state and writes only an operator-confirmed preference."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/014-doctor-env"
    last_updated_at: "2026-10-02T20:17:16Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase docs"
    next_safe_action: "Commit the packet files on the phase branch"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/env.md"
      - ".skilled/commands/doctor/assets/doctor-env.yaml"
      - ".skilled/commands/doctor/assets/doctor-env-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-doctor-env"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-doctor-env |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: built. The doctor family gained `/doctor:env`, a command that turns the 158-variable switch reference into a guided choice: it audits first and applies only on an explicit yes.

### Phase 14: doctor-env

You can now inspect every documented environment switch by group or by name without opening `ENV-REFERENCE.md`. The command reads that reference at run time, so a switch added there appears with no edit to the command. It shows set or unset state per source and never prints a value. Each switch is classified as secret, per-invocation or preference. Secrets are named with their location, per-invocation switches appear in their one-command form, and only a preference can be saved. A save shows the exact line, the destination and the effect first, then writes one line after you say yes. `--dry-run` shows the same preview and writes nothing. The command writes `hook-flags.env` or the Claude settings env block, prints an export line for shell profiles, and never writes `.env`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/env.md` | Created | Thin router with the six canonical sections and the documented argument hint |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | Created | Workflow: live parse, classification, source inspection, preview, confirmation-gated write |
| `.skilled/commands/doctor/assets/doctor-env-presentation.txt` | Created | Every visible prompt, table, preview, error and status string |
| `.claude/commands/doctor/env.md` | Created | Symlink to the router |
| `.skilled/commands/README.txt` | Modified | Doctor count 3 to 4 and the Environment Switches row, with escaped pipes |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Doctor family entry: router path, argument hint, targets, assets, invariants and write policy |
| `.codex/prompts/doctor-env.md`, `.pi/prompts/doctor-env.md`, `.hermes/prompts/doctor-env.md`, `.cursor/commands/doctor-env.md` | Created | Generated runtime mirrors, with Cursor as a symlink |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran as an audit first and an apply second. Three executors took part. GPT-6 Luna built the router, the workflow and the presentation asset. The Codex mirror generator hit EPERM in Luna's sandbox, so the orchestrator ran `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs` itself, which wrote 1 of 33 prompts and left `--check` reporting 33 in sync. DeepSeek V4.1 Flash (cli-pi) applied three review fixes: the git-hook marker examples now use the source hook's documented `=1` value instead of an invented `=ON` and `=OFF`, the next-step text names concrete next commands, and the secret rule now treats a `TOKEN` segment followed by `THRESHOLD`, `FLOOR`, `BUDGET`, `LIMIT`, `COUNT`, `CHARS` or `VISIBLE` as a text-token count rather than a credential. That last fix restored four token-count thresholds the first draft had hidden. The orchestrator then ran every check and recorded one run in `scratch/doctor-env-run.md`. The packet docs were closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build through sk-create-command as a thin router plus owned assets | Matches the sibling doctor commands and keeps every visible string in one presentation file |
| Read ENV-REFERENCE.md at every run and copy no list into the command | An added row shows up without touching the command, which is the phase's second success criterion |
| Classify before display into secret, per-invocation and preference | The three classes need different handling, and classification decides whether a value can be read at all |
| Treat `TOKEN` followed by a count word as a text-token count | `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` counts text tokens, so calling it a secret hid four real preferences |
| Write only `hook-flags.env` or the Claude settings env block, after the exact line and an explicit yes | Those destinations already have readers in the repository, and the gate keeps a typed value from landing unannounced |
| Print an export line for shell profiles and never write a profile | The command has no safe way to edit an arbitrary profile, and the operator can paste the line |
| Leave the stale reference count unfixed and record it | The count lives in ENV-REFERENCE.md, which this phase does not own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router document validation: `validate_document.py env.md --type command` | VALID, 0 issues |
| Authored-name check: `check_authored_name_kebab.py` | PASS |
| Catalog mirror check: `command-catalog-mirror-check.cjs` | STATUS=OK, 35 of 35 commands listed, exit 0 |
| Route manifest: `route-validate.sh` | exit 0 |
| Symlink: `ls -l .claude/commands/doctor/env.md` | `-> ../../../.skilled/commands/doctor/env.md` |
| Runtime mirror sync: Codex, Pi and Hermes prompt `--check`, `sync-runtime-mirrors --check` | Every mirror in sync |
| Recorded run: `scratch/doctor-env-run.md` | 158 unique variables, 0 malformed rows, 17 sections, 14 per-invocation switches; the added-row copy parsed 159; a dry run showed the exact line and wrote nothing; a confirmed write to a disposable copy changed one line and the repo reader honoured it; no secret value was asked for or written |
| Packet validation: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/014-doctor-env --strict` | Summary: Errors: 0, Warnings: 0; RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The recorded run used probes, not a live slash-command session.** The orchestrator executed the workflow steps with Bash and Node, so the interactive menu rendering was not exercised end to end. The recorded steps cover the parse, the dry run and the confirmed write.
2. **The confirmed write was proven against a disposable copy.** The reader was pointed at that copy through `HOOK_FLAGS_CONFIG`, so the operator's configuration was never touched and the real destination was never written.
3. **Recorded finding: the reference's stated count is stale.** ENV-REFERENCE.md says it documents 144 unique variables, while its tables hold 158. The 14 git-hook marker rows added to section 5 did not update the stated count. The phase records this and leaves it, because the reference is outside its scope.
4. **Shell profiles are never written.** The command prints one export line instead. That is the designed boundary, not a gap.
<!-- /ANCHOR:limitations -->

---
