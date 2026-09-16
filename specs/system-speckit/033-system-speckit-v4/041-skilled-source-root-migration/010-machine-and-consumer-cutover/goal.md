---
title: "Goal: cut this machine over to .skilled with no hook gap"
description: "The durable directive for the phase that moves this machine's global git hooks, home configs and consumer links from .opencode to .skilled, and the criteria it closes against."
trigger_phrases:
  - "skilled machine cutover goal"
  - "global hooks cutover directive"
  - "machine cutover completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover"
    last_updated_at: "2026-09-16T18:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase directive from a read-only census of this machine"
    next_safe_action: "Run T001 once phases 004 to 009 validate"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-010-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: cut this machine over to .skilled with no hook gap

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every out-of-Git reference on this machine resolves into the main checkout's `.skilled/`, no global hook ever points at a missing file and every consumer project keeps working.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Reads before writes: the census is recorded and verified before the first backup, and every item writes its backup and restore command before it changes. |
| D2 | Global hooks never dangle: while the landing rewrites the main checkout, every repository runs copied hook bodies from `~/.config/git/hooks-bridge/`, and `~/.config/git/hooks/` is relinked only by the installer run from the main checkout, never from a worktree. |
| D3 | The orchestrator makes every change, one item at a time. DeepSeek V4.1 Flash on cli-pi only classifies path-and-count rows the orchestrator produced, and no home-file value reaches a brief, a log or a document. |
| D4 | A relative path in a home config follows the consumer contract: it moves to `.skilled/` only when every project that reads it resolves `.skilled/`. Consumer repositories get untracked links and local excludes, never a tracked edit. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All seven `~/.config/git/hooks` links name the main checkout's `.skilled/scripts/git-hooks/`, `core.hooksPath` is `~/.config/git/hooks` and the bridge directory is gone
- [ ] A scratch-repository commit with a non-conforming subject exits 1, and the probe trace names all seven hooks
- [ ] `install-codex-hooks.mjs --check` prints OK, and `~/.codex/hooks.json` holds 0 `.opencode/` and 18 `.skilled/` hook identities
- [ ] Every changed home file has a backup and a restore command in the manifest, and the residue census holds 0 `must-fix` rows
- [ ] Every consumer `.opencode` link on this machine resolves `skills/system-spec-kit/SKILL.md` after the landing
- [ ] This phase validates with `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this file |
| Read-only census of this machine | Done | `plan.md` evidence ledger E1 to E25, read 2026-09-16 |
| Execution | Pending | Waits for phases 004 to 009 to validate |

### Deviations and findings

| Item | Note |
|------|------|
| Map B home rows change class | `~/.claude.json` holds a recorded prompt, not config (E10), and `~/.zshrc` names `~/.opencode/bin` under an `# opencode CLI` comment, not this checkout (E11). Both are `none`, not `manual`. The Hermes launcher path is relative (E9) |
| Map B missed surfaces | `~/.codex/prompts/` with 38 stubs (E14), six shadowed links in the main checkout's `.git/hooks/` and the local hooks of `anobel.com` (E22) |
| Installer traps | `install-git-hooks.sh` skips a link it did not install (`install-git-hooks.sh:138-142`), and `install-codex-hooks.mjs` keeps a legacy entry whose path still resolves (`install-codex-hooks.mjs:106-109`) |
| Work in the main checkout | Both installers must run from the main checkout, which sits against the parent rule that phases work in the worktree (`../spec.md:134`). T002 records the clarification |
| Main checkout is dirty | `council-graph.sqlite` is modified under `.opencode/` (E23), which blocks the landing until its owner resolves it |
| Phase 004 draft, not yet frozen | Its draft on 2026-09-16 places the landing in this phase (`../004-migration-design/goal.md:49`) and prefers a relative-link `.opencode` (`../004-migration-design/decision-record.md:72`), which is row 1 of this plan's consumer table. The draft says the global hooks survive with no edit. That holds once the landing finishes, not while it rewrites the tree, and the bridge covers that gap. T001 still reads the frozen record |
<!-- /ANCHOR:log -->
