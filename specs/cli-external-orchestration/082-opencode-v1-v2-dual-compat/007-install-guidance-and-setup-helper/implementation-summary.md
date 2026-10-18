---
title: "Implementation Summary"
description: "A setup helper now builds the OpenCode 1.19.3 and 2.0.32 layouts side by side, v1 only or v2 only under HOME, and an install reference explains each layout, the launcher and the gaps no recipe closes."
trigger_phrases:
  - "install guidance and setup helper implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/007-install-guidance-and-setup-helper"
    last_updated_at: "2026-10-18T23:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase docs from the bracketed proof set"
    next_safe_action: "Phase complete. Start phase 008, doctor and CI"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-install-guidance-and-setup-helper"
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
| **Spec Folder** | 007-install-guidance-and-setup-helper |
| **Status** | Complete |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user can now reproduce any of the three OpenCode layouts with one script and read one reference that says what each layout costs and what none of them can fix.

### Phase 7: install-guidance-and-setup-helper

`opencode-setup.sh` has four modes. `both` installs `opencode-ai@1.19.3` into `~/.local` and `@opencode/cli@2.0.32` into `~/.local/opencode-v2`, then writes the `opencode2` launcher, which sets `OPENCODE_DB` so v2 never opens v1's `opencode.db`. `v1` and `v2` install one version and refuse, with the `both` hint, when the other version already answers to `opencode`. `check` classifies each name by the shape of its `--version` output and changes nothing. Every path derives from HOME, every step prints its rollback line without running it, and a repeat run skips the pinned installs and leaves the launcher alone.

The reference covers the three layouts, the launcher text, why `OPENCODE_DB` is set, the shared config folder, the official v2 channels, Homebrew as a v2-only exclusive channel, the per-version run flags and providers, the `--major` warning, rollback order and the gaps that no recipe closes. Each claim in the prose is labelled confirmed, documented with a source, or unknown.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Created | The setup helper, 501 lines |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Created | The install reference, 417 lines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash wrote the helper and the reference and made each fix, after the operator asked for DeepSeek wherever possible. Luna reviewed the helper, the reference and three verification rounds, and the orchestrator ran every install and proof (decision 0).

Every proof ran under a throwaway HOME in `scratch/home`, with nvm's node first on PATH because Homebrew's node cannot start on this machine (decision 4). Eight fix rounds closed the review findings. The fourth came from Luna's LOGIC-SYNC: the criteria say a repeat run and `check` change no file, while the v2 binary logs every launch. A probe showed that pointing `XDG_DATA_HOME` at a temporary folder moves that log line out of HOME, so the helper now probes that way and the criteria stand as written (decisions 18 and 19). The fifth clears an inherited `PROBE_DATA_DIR` at startup, so a caller cannot redirect the probes (decisions 20 and 21). The sixth makes `probe_shape` return its result instead of setting a global, and routes INT and TERM through the cleanup (decisions 22 and 23). The seventh sets the traps before the folder exists and names its location in `TMPDIR` (decisions 25 and 26), and the eighth ignores INT and TERM for the instant the folder is created (decisions 27 and 28).

The final proof set is bracketed by two snapshots of the operator's installs, taken with a snapshot script that launches no OpenCode binary. No orchestrator command ran under the real HOME between them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probes run with `XDG_DATA_HOME` set to a temporary folder in the system temp area, removed on exit (decisions 18 and 22) | The v2 binary appends to its log on every launch, `--version` included, so a plain probe changes a file under HOME. NFR-S01 is amended to name the folder |
| A symlink at the launcher path is refused, a symlinked `~/.local` is followed (decision 15) | A symlinked parent is a deliberate dotfile layout; a symlinked launcher would write outside it without the user's choice |
| The snapshot launches no binary (decision 16) | A v1 launch opens the shared database and a v2 launch writes its log, so a snapshot that ran `--version` disturbed what it measured |
| The cited captures stay in `scratch/` (CHK-051) | The acceptance rows cite them by file, as phases 2 to 6 decided |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Operator snapshot (T001, T015): `scratch/bracket/before-after.diff` | Only `opencode.db-shm` and `opencode-next.db-shm` differ, the two files the live service moves with nothing else running (decision 16). Service PID 46220 kept its start time |
| Proof of `both` (T010): `scratch/final/both-1.txt` and `scratch/final/launcher-trace.txt` | Exit 0, `1.19.3 [v1]` and `opencode v2.0.32 [v2]`; the launcher trace exports `OPENCODE_DB=opencode-v2.db` |
| Idempotence (T011): `scratch/final/idempotence.txt` | Tree hash c3084e25dcecce17 with 13 files after run 1, run 2 and check |
| Check (T012): `scratch/final/check.txt` | Exit 0, both names shaped, no file changed |
| Refusals (T013): `scratch/final/adversarial.txt` | Exit 1 with the `both` hint each way, nothing written; malformed, CR, joined, empty, npm-missing, spaces and symlink rows as expected |
| Reference validation (T014): `scratch/final/validator.txt` | 0 issues, exit 0 |
| Static checks: `scratch/final/static-checks.txt` | `bash -n` and shellcheck clean; no secret, `sudo` or download pipe; every uninstall hit is a printed rollback line |
| Interrupt: `scratch/interrupt-probe-dir.txt` | SIGTERM during the v2 probe exits 143; the folder is `TMPDIR/opencode-setup-probe.<suffix>` and none is left |
| Review: `scratch/review-verify7-luna.txt` | PASS, no open P0 or P1; two P2s carried (symlinked parents by design, the SKILL.md link deferred to 010) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`--version` proves the version, not that plugins load.** Plugin load on each version is the proof in 008.
2. **v2 lists no `opencode-go` provider here.** A v2 lineage that pins no model fails until that credential is added to v2 (carried from 006).
3. **Only npm was proven for the two-prefix layout.** bun, pnpm and the other v2 channels are documented, not run.
4. **Whether the v2 service outlives an uninstall was not probed.** The reference marks it unknown.
<!-- /ANCHOR:limitations -->

---
