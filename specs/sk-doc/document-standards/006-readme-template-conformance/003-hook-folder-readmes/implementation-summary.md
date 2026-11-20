---
title: "Implementation Summary"
description: "The 26 hook folder READMEs now follow the hook template and were fact-checked against their adapters and registration files."
trigger_phrases:
  - "hook folder readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes"
    last_updated_at: "2026-11-17T07:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 003 checks and docs"
    next_safe_action: "Commit, merge origin/main and push, then start phase 004"
    packet_purpose: "Purpose: Each of the 26 hook folder READMEs follows the hook template's folder scaffold, passes the validator and the voice scan with zero hard blockers, and states only runtime rows, paths and switches the code confirms."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/goal.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/decision-record.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes/plan.md"
    session_dedup:
      fingerprint: "sha256:e9b8635fd70cd70262d0783d54389b229f0bed20d56757af933ba6031f350dc4"
      session_id: "scaffold-003-hook-folder-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "c2acc245-beab-494e-a0b1-b175e8447b75"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T07:30:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "env-secret-guard fixes land through a codex session started with SYSTEM_ENV_SECRET_GUARD_DISABLED=1, authorized by the operator once for 15 pairs and once for the expected-result sentence"
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
| **Spec Folder** | 003-hook-folder-readmes |
| **Completed** | 2026-11-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every hook folder README under `.skilled/hooks/` now runs through the hook template's eight sections, with one RUNTIME COVERAGE row for each of the eight runtimes. Each one was fact-checked against its adapters and the files that register them, so a maintainer can trust the event, the entry, the switch and the command it names.

### Phase 3: hook-folder-readmes

The 26 READMEs resolve to 25 files, because `git-message-gate` and `git-preflight` share `.skilled/skills/sk-git/scripts/hooks/README.md`. Three of the 25 sit outside `.skilled/hooks/` and are reached through a symlink: the sk-git hooks README, the skill advisor hook doc and the spec gate README. Before the rewrite, the files ran from 163 to 301 lines, one carried a voice hard blocker and the lowest voice ceiling was 95. After it, they run from 127 to 252 lines, none carries a hard blocker and the lowest ceiling is 98. Reviewers checked 3,371 claims. The main session confirmed 65 reviewer findings against the code and applied them, and rejected 51 with a reason. The blocking review added five more fixes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/<concern>/README.md` (22 files) | Modified | Rewritten to the hook template and checked against each concern's adapters and registrations |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modified | The shared git-message-gate and git-preflight README. Section 3 stays RUNTIME COVERAGE, which `git-setup-check.cjs` points to |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | Rewritten to the folder scaffold. The eight bold runtime rows stay, and the parity test still passes |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | Modified | The spec gate README reached through `.skilled/hooks/spec-gate/README.md` |
| `tasks.md` in phase 002 | Modified | Its checklist rows were ticked at the 002 close and ride in this commit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A canary writer ran first on classifier-injection-screen. It passed every check, so the other 24 went out in waves of four, one README per GPT-6 Luna session through cli-codex. Each writer wave overlapped the previous wave's reviewers. A reviewer never checked a file it wrote. Each one returned its findings with a file and a line, and the main session opened the cited code before applying or rejecting anything.

The codex usage limit stopped the drive once, at 00:25. It resumed at 05:39 on the same provider, with no change of executor. The env-secret-guard README could not be written by a worker, because the guard refuses agent writes inside its own folder. The operator authorized a codex session started with `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` twice, first for 15 replacement pairs and later for one expected-result sentence. Each session ran `apply.py` and nothing else. Its result matched the backup with the pairs applied, byte for byte.

The blocking review approved the phase at 92 of 100 with six P2 findings. Five were applied, and the sixth is listed under Known Limitations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Entry-column findings rejected in five READMEs | The template's column is "Entry in this folder", and the next column already names the registered file. Listing the folder's own symlink is what the template asks for |
| Findings resting on a read-only sandbox rejected after a rerun | Reviewers could not run suites that write temp files. Each such suite was rerun here, and each printed exactly the result its README states |
| Third-party behavior left as written in env-secret-guard | 26 of its 40 findings asked to hedge claims about 1Password, Doppler, Claude Code sandbox flags or host timing. The repository cannot settle those either way, and the README misstates no repository fact |
| Compiled entries named as full-path code spans in skill-advisor-hook.md | The runtimes run the compiled `user-prompt-submit.js`, but `dist/` is gitignored, so a markdown link to it would break on a fresh clone |
| Test counts replaced by "every test passes" in three READMEs | The template asks for an allow comment on any count that drifts. Count-free wording keeps the expected result without a number that goes stale |
| The guard README fixes went through the operator, not a worker that sets the switch itself | The guard names a person as the actor who may change its folder |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Before numbers come from `baseline-003-before.tsv`, taken before the first writer ran. After numbers come from the final tree.

| Check | Result |
|-------|--------|
| `baseline.sh` on the 25 files | Before: 25 of 25 `VALID`, one hard blocker in session-handover. After: 25 of 25 `✅ VALID`, `hard=0` and `emojiH=0` on every line. skill-advisor-hook.md keeps one `document_type_fallback` warning, because no type rule matches its file name. It was there before the rewrite and the validator still prints `VALID` |
| Voice ceilings, before then after | ask-surface-guard 100 to 100, classifier-injection-screen 99 to 100, cli-dispatch 99 to 99, codex-global-hooks-check 100 to 100, completion-evidence 100 to 100, decision-capture 99 to 100, directive-lifecycle 100 to 100, dist-freshness 100 to 100, env-secret-guard 98 to 98, git-hooks-check 100 to 100, git-live-follow 100 to 100, sk-git hooks 100 to 100, git-primary-reconcile 100 to 100, git-worktree-guard 100 to 100, goal 95 to 100, mcp-route-guard 100 to 100, overlay-guard 100 to 100, permission-policy 100 to 100, post-edit-quality 100 to 100, session-cleanup 100 to 100, session-handover 95 to 100, session-lifecycle 98 to 100, skill-advisor-hook 98 to 100, spec-gate 97 to 99, subagent-dispatch-guard 100 to 100. None ends below its baseline |
| Line counts, before then after | ask-surface-guard 219 to 174, classifier-injection-screen 163 to 134, cli-dispatch 280 to 135, codex-global-hooks-check 186 to 171, completion-evidence 228 to 169, decision-capture 174 to 132, directive-lifecycle 175 to 144, dist-freshness 190 to 142, env-secret-guard 249 to 252, git-hooks-check 174 to 150, git-live-follow 167 to 147, sk-git hooks 268 to 175, git-primary-reconcile 188 to 154, git-worktree-guard 174 to 136, goal 265 to 165, mcp-route-guard 181 to 152, overlay-guard 193 to 173, permission-policy 165 to 131, post-edit-quality 205 to 146, session-cleanup 188 to 138, session-handover 284 to 127, session-lifecycle 300 to 142, skill-advisor-hook 301 to 159, spec-gate 253 to 174, subagent-dispatch-guard 202 to 146 |
| `h2model.py` against the folder scaffold | `SUBSET` for all 25. session-handover uses QUICK START in place of HOW IT WORKS, as the template allows |
| `rtcheck.py` | `OK` for all 25: a RUNTIME COVERAGE row for each of the eight runtimes |
| Opening and command blocks | All 25 open with an H1. Every command block is followed by its expected result |
| `readme_links.py . <25 files>` | Before and after: `0 problems`. After: 185 outbound links |
| `check_readme_references.py` and `check_derived_readme_counts.py` | `SUMMARY files=25 pass=25 fail=0` for each |
| `check-markdown-links.cjs` | `7813 files, 15099 links checked, 0 broken`, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty` over 1,246 READMEs, so the verdict baseline needed no rebuild |
| sk-doc `run-script-tests.sh` | Exit 0, 57 PASS and 0 FAIL |
| Consumer tests | `goal-doc-contract.test.cjs` pass 5 fail 0. `completion-evidence-sentinel.vitest.ts` 33 passed. `advisor-runtime-list-parity.vitest.ts` 2 passed. `git-setup-check.test.cjs` pass 86 fail 0 |
| Secret scan over the 25 files | 68 hits on token, secret or API key, all prose about those features. No key-shaped string or user path |
| Blocking `@review` | APPROVED, advisory 92/100, no P0 or P1. Five of its six P2 findings were applied: three drifting test counts, the missing stop events in session-lifecycle and the order of its Pi and DSH rows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-record -->
## Review Record

One line per README. Every reviewer session was separate from the writer of the file it checked.

- **classifier-injection-screen:** 176 claims. 2 applied: `opencode/` and `vibe/` are folders holding one symlink each. 0 rejected.
- **ask-surface-guard:** 76 claims. 2 applied: neither runtime documents a Stop decision, and the adapters pass `askToolCalled` false. 0 rejected.
- **cli-dispatch:** 99 claims. 3 applied: `recordDispatch` returns false for a command with no dispatch shape, and `buildAuditLine` scrubs only the command, model and target. 0 rejected.
- **codex-global-hooks-check:** 180 claims. 2 applied: `isRepoOrphan` and `sourceRootRelative` match only `.skilled/` or `.opencode/` identities. 0 rejected.
- **completion-evidence:** 103 claims. 2 applied: the advise set holds P0 and P1 only, and rotation runs before the append. 0 rejected.
- **decision-capture:** 53 claims. 2 applied: DSH listens on `tools/result`, and OpenCode discovery is worded as the flat plugins folder. 0 rejected.
- **directive-lifecycle:** 152 claims. 6 applied: suppression needs transcript bytes at or above the high-water mark, a boundary advances the epoch or generation, a failed full-delivery write is ignored, `claude/` holds the symlinks, and OpenCode, Vibe and Pi advance or reset outside the switch. 0 rejected.
- **dist-freshness:** 165 claims. 0 applied. 1 rejected: the stderr noise came from the reviewer's sandbox, and the smoke test printed nothing and exited 0 here.
- **env-secret-guard:** 125 claims. 14 findings applied as 15 pairs: the Vibe matcher and judged list, the deleted `.cursorignore` row, the `vibe/` tree entry, the 40-file discovery limit, the local-value skip, the shell-only after-call hook, exit 1, hard-link reach and log line contents. 26 rejected as third-party or host behavior. One more sentence later stated the VALIDATION block's result.
- **git-hooks-check:** 85 claims. 0 applied. 4 rejected: Entry column findings.
- **git-live-follow:** 224 claims. 3 findings applied as 5 pairs: the switches stop a new start but not a running follower, a tracked path can block a fast-forward over an untracked file, and DSH injects nonzero output. 5 rejected: four Entry column findings, and one sentence that already opens with "Without `--live`".
- **git-preflight and git-message-gate (shared sk-git hooks README):** 110 claims over both hooks' columns. 1 applied: the advisory writes the Claude-shaped envelope, not Cursor's. 0 rejected.
- **git-primary-reconcile:** 107 claims. No findings.
- **git-worktree-guard:** 144 claims. 4 findings applied as 3 pairs: direct registration of the shared script, Pi and DSH failure behavior, and the environment-only switches. 4 rejected: Entry column findings.
- **goal:** 69 claims. 7 findings applied as 6 pairs: runtime briefs, the slice module's role, direct-text goals, Vibe turn-start, subfolder READMEs and the OpenCode test path. 0 rejected. `goal-doc-contract` still passes 5 of 5.
- **mcp-route-guard:** 98 claims. 3 applied: the master switch skips the sk-git message gate, and Cursor parses its own input. 2 rejected: both test commands print exactly the stated result.
- **overlay-guard:** 222 claims. 1 applied: five runtime adapters, not five command adapters. 0 rejected.
- **permission-policy:** 79 claims. 2 applied: the master switch exception. 0 rejected.
- **post-edit-quality:** 204 claims. 0 applied. 4 rejected: OpenCode's resolver resolves to the same flags file through the `.opencode/hooks` symlink, and all three suites print the stated counts.
- **session-cleanup:** 193 claims. 1 applied: the detached reconcile has no timeout. 0 rejected.
- **session-handover:** 165 claims. No findings.
- **session-lifecycle:** 78 claims. No findings. The blocking review later added the stop events and the row order.
- **skill-advisor-hook:** 149 claims. 6 applied: the compiled entries, Cursor's unconfirmed delivery and Pi's debug block. 2 rejected: both test commands pass.
- **spec-gate:** 227 claims. 1 applied: the master switch label covers shared-resolver hooks only. 3 rejected: the registry does record Pi extensions, and both suites exit 0 here.
- **subagent-dispatch-guard:** 88 claims. 2 applied: Vibe rejects a mode mismatch by default, and the config check's exact conditions. 0 rejected.
<!-- /ANCHOR:review-record -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **env-secret-guard keeps two template gaps.** It labels its runtime `Claude Code` where the template uses `Claude`, and its CONFIGURATION table has no `SYSTEM_HOOKS_DISABLED` row. Both were there before this phase, and the master switch itself works, which the README's overview states. A third guard-off session for a P2 was not worth the operator's time. A person editing the guard folder can close both.
2. **Third-party claims in env-secret-guard stay as written.** The 1Password, Doppler and Infisical commands and the runtime sandbox notes describe tools the repository cannot test.
3. **Fact checks sampled each README's claims.** Every claim a reviewer named was checked, but long prose can still hold a claim nobody tested.
4. **Adapter defects noted, not fixed.** The Cursor git-message-gate registration prints an allow envelope after the gate's deny. Which envelope Cursor acts on is unconfirmed, and adapters stay unchanged in this phase.
<!-- /ANCHOR:limitations -->
