---
title: "Implementation Summary"
description: "What the machine cutover changed: the seven global git hooks, the Codex hook registration, three home files, four consumer links, and the evidence that each one resolves the new source root."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover"
    last_updated_at: "2026-09-17T20:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Cut this machine and its consumers over to the new source root"
    next_safe_action: "Run the rollout phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-010-cutover"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-machine-and-consumer-cutover |
| **Completed** | 2026-09-17 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repository's tree moved to a new directory nine phases ago, but nothing outside the repository knew. This phase moved the machine: the seven git hooks every repository here runs, the hook registration Codex reads, three files in the home directory and the links four other projects use to borrow this tree. Every one of them now names the real directory, and the old name still resolves, so a project that was never told keeps working.

### Phase 10: machine-and-consumer-cutover

Git skips a hook it cannot resolve, and says nothing when it does. That is the whole reason this phase has a bracket rather than a sequence: the landing rewrites the files the hook links point at, so before it ran, the hooks path moved to a directory of plain copies, and it moved back only once the links had been rebuilt and proven. Between those two moves the machine was never a commit away from running no gates at all.

The rest is one item at a time, each with its own backup taken immediately before its own change and its own check before the next one starts. Nothing was edited that a program writes: the hook links and the Codex registration were rebuilt by their installers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.config/git/hooks/` (7 links) | Modified | Each link names the real hook directory instead of reaching it through the legacy name |
| `~/.codex/hooks.json` | Modified | 18 repository hook identities replaced, 15 third-party entries kept, written by its installer |
| `~/.codex/config.toml` | Modified | The one trust header for this tree names the real directory |
| `~/.pi/agent/SYNC.md` | Modified | Two manifest lines name the real directory, one of which had been stale since an earlier move |
| `~/.hermes/config.yaml` | Unchanged | The launcher argument is relative and consumer projects expose only the legacy name, so it stays |
| `~/.codex/prompts/` | Unchanged | 38 stubs the CLI never loads; records, not configuration |
| 4 consumer roots | Modified | Each gained a link to the real directory and a local exclude line, neither of them tracked |
| `.skilled/scripts/install-git-hooks.sh` | Modified | Resolves the real source directory first, so an installed hook does not depend on the legacy link |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The machine was read before it was touched, twice: once into a census of 38 rows that names paths, keys, line numbers and counts but no value from any home file, and once again afterwards, so the difference is the change. A delegate classified each census, and each return was checked against its input rather than trusted; one return had expanded a value the census had truncated, and that was repaired before it was accepted.

Every item was backed up into a private directory outside every repository, with a manifest that carries the command to put it back. The restore path was then proven without touching a live file: each copy still hashes to its recorded value, each restore command's source exists, and the seven links rebuilt from the manifest into a temporary directory match by target.

Three probes carried the proof. A scratch repository showed the relinked hooks blocking a non-conforming commit message and tracing all seven hooks. A shared clone checked out at the commit before the landing showed the same hooks still gating a checkout that carries only the old layout, which is what another machine will look like until it updates. Every consumer link was walked to a file that only exists inside this tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bridge the hooks path through plain copies for the whole landing | Git skips a hook whose target is missing and reports nothing, so the window where the landing rewrites those targets would otherwise run with no gates at all |
| Move the ignored state out and back rather than copy it | 1.4 GB on one volume; a rename costs nothing and leaves no second copy to drift from the first |
| Leave the Hermes launcher argument alone | It is a relative path resolved from whatever project runs it, and most consumer projects expose only the legacy name |
| Leave the six running code-mode servers and the advisor daemon alone | They belong to other sessions, and the legacy name stays resolvable, so their paths kept working through the landing |
| Treat the Codex prompt stubs as records | The installed CLI offers no `prompts` subcommand and documents no loader, so rewriting them would edit something nothing reads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Checkpoints 1 to 5 | PASS. `entries=7 fail=0` at 19:56:29Z, 19:57:54Z, 20:02:27Z, 20:11:07Z and 20:11:07Z |
| V1 hook targets and scope | PASS. Seven links name the real hook directory, `core.hooksPath` unchanged, no shadowed hook |
| V2 scratch repository | PASS. Non-conforming subject blocked, later commands exit 0, trace names all seven hooks |
| V3 old-layout clone at the pre-landing commit | PASS. Commit exits 0, trace names `pre-commit`, `prepare-commit-msg`, `commit-msg` and `post-commit` |
| V4 consumers | PASS. Every link resolves the root sentinel, eight linked root files and four live paths resolve, no root shows the new link to git |
| V5 Codex registration | PASS. 33 entries, 0 legacy identities, 18 new ones, `--check` OK |
| V6 to V9 config diffs | PASS. Two changed lines in the Codex config, four in the Pi manifest, none in the Hermes config or the prompt stubs |
| V10 unchanged files | PASS. `~/.pi/agent/trust.json` and `~/.zshrc` match their baseline checksums |
| Residue census | PASS. 38 rows, zero `must-fix` |
| Restorability | PASS. Five copies hash to their manifest rows, eight restore sources exist, seven links rebuild to matching targets |
| Generator freshness on the moved checkout | PASS for ten of eleven. The command-router check reports the same three path drifts it reported before this phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other machines are not covered.** This phase changed one machine. Any other checkout keeps its own hook links and home configs, and follows the checklist in `plan.md` until someone runs it there.
2. **Most consumer projects still borrow the legacy name.** Only the four roots that borrow root files from this tree gained a link to the real directory; the rest keep the legacy link, which resolves. Anything that resolves a path from a consumer's own root should keep accepting both names.
3. **The command-router check still reports three path drifts.** They predate this phase: the checker expects a pair of mode files per command where the tree holds one. Left for whoever owns that checker.
4. **The backup root is not pruned.** `~/.skilled-cutover-backup/20260917T195302Z` holds the machine's previous state, including the previous hook links. Delete it once the rollout is settled.
<!-- /ANCHOR:limitations -->

---
