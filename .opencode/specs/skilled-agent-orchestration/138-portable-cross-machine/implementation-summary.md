---
title: "Implementation Summary: Portable cross-machine hook paths and Barter framework sync"
description: "Rewrote the Claude, Codex and Devin hook commands to resolve the project root from a runtime env var and run node from PATH, fixing a team member's startup-hook failure on a different machine, and brought the Barter mirror current with the last 100 commits of framework work."
trigger_phrases:
  - "portable hook paths done"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-portable-cross-machine"
    last_updated_at: "2026-06-08T06:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Hook portability fix + surgical Barter sync shipped"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".codex/hooks.json"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-138-portable-cross-machine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 138-portable-cross-machine |
| **Completed** | 2026-06-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A team member running the Barter mirror reported that the Claude startup hook failed with a `cd: ... No such file or directory` error, and that `/opt/homebrew/bin/node` made the hooks unusable on Linux. The hook commands hardcoded the owner's absolute project path and the macOS-only homebrew node, and a prior fix attempt had corrupted the Barter node path into a broken `n/bin/node`.

### The portable form

Every hook command moved from `cd "<hardcoded abs path>" && /opt/homebrew/bin/node <relative script>` to `cd "${RUNTIME_PROJECT_DIR:-$PWD}" && node <relative script>`. The root is resolved from the runtime's own env var (`CLAUDE_PROJECT_DIR`, `CODEX_PROJECT_DIR`, `DEVIN_PROJECT_DIR`) with a `$PWD` fallback, and node comes from PATH. This is the form the working Devin hook already used, so the fix generalizes an established pattern rather than inventing one. The quoted env var also handles the space and pipe in the Barter directory name safely.

### Applied across both repos

An idempotent node fixer normalized every variant, including the corrupted `n/bin/node` and the Barter codex hook that wrongly `cd`-ed into the Public repo. It ran on the Public tracked source (`.codex/hooks.json`, `.devin/hooks.v1.json`, and `.claude/settings.local.json`) and on the three Barter hook configs. A fresh Opus and gpt-5.5 verification pass then caught two real gaps that were fixed in a follow-up: Public's `.claude/settings.local.json` is tracked (not gitignored), so its hardcoded path would ship to anyone cloning Public, and the Devin hooks in both repos lacked the `:-$PWD` fallback the other runtimes use. Both are now portable and uniform.

### Barter mirror brought current

The 322 framework files Public changed in the last 100 commits were copied into Barter with `rsync --files-from`, preserving the one symlink, excluding sk-code, sk-git, the Barter-only skills, the runtime configs, specs and junk. The Barter launcher now carries the reap fix, and sk-code, sk-git and the custom skills were verified unmodified.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.codex/hooks.json` | Modified | Portable cd + PATH node |
| `.devin/hooks.v1.json` | Modified | PATH node (cd already portable) |
| Barter `.claude/settings.local.json` | Modified | Portable cd + PATH node |
| Barter `.codex/hooks.json` | Modified | Portable cd + PATH node |
| Barter `.devin/hooks.v1.json` | Modified | PATH node |
| Barter `.opencode/**` | Synced | 322 changed framework files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was planned with sequential thinking because the bug spanned two repos, three runtimes and a botched prior fix. Reading the framework's own hook doc settled the design: its canonical form is a relative script path with PATH node, which proves the runner already runs hooks from the project root. The Devin hook confirmed the env-var resolver pattern. A small node fixer applied the same normalization everywhere, idempotently, so a reintroduced hardcoding can be cleared by re-running it. The Barter sync was scoped to exactly the files Public changed, not a full rsync, to avoid disturbing the mirror's own content.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the root from a runtime env var with a `$PWD` fallback | Portable across machines and Linux, matching the working Devin pattern, robust if the env var is unset |
| Keep the `cd` rather than drop it | The hook scripts read files by relative path, so cwd must be the project root |
| Do not touch Barter runtime configs or its sk-code/sk-git | Preserved per the Barter mirror convention and the user's instruction |
| Surgical 322-file sync, not a full rsync | Matches the last-100-commits scope and avoids disturbing the mirror |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All five hook configs JSON-valid | PASS |
| No `/opt/homebrew`, `n/bin/node`, or absolute cd remains | PASS |
| Barter launcher has the reap fix | PASS |
| sk-code, sk-git, Barter-only skills unmodified | PASS |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live Barter session may rewrite `settings.local.json`.** The file changed between two reads during the work, so a running session or setup process may regenerate it; the operator should re-run the fixer if hardcoding reappears.
2. **Codex env var unconfirmed.** `CODEX_PROJECT_DIR` may not be set by every codex version; the `$PWD` fallback covers that as long as codex runs hooks from the project root, which the relative script path already requires.
3. **Barter changes are file-level.** Barter's `.opencode` is gitignored in its own repo, so the sync and hook fixes are on disk, not committed in Barter.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
