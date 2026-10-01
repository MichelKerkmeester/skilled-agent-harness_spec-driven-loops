---
title: "Implementation Summary"
description: "Commit messages, PR descriptions and new branch names are now checked against rules blocks inside each repository's own sk-git templates, at commit, push, agent and CI time, with no bypass."
trigger_phrases:
  - "implementation summary"
  - "message contract shipped"
  - "template-driven enforcement evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement"
    last_updated_at: "2026-10-01T18:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the message contract in worktree 073 (38b2135472 plus the speedup commit)"
    next_safe_action: "Merge worktree 073, then run and require the CI check"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/lib/message-contract.mjs"
      - ".skilled/skills/sk-git/scripts/validate-message.mjs"
      - ".skilled/skills/sk-git/assets/commit-message-template.md"
      - ".skilled/scripts/git-hooks/commit-msg"
      - ".github/workflows/message-contract.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-032-template-driven-message-enforcement"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Creation standards cover PR descriptions and branch and worktree names"
      - "Local bypasses are removed"
      - "A repository with no template gets no enforcement"
      - "Rules sit in a fenced json block in the template body"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-template-driven-message-enforcement |
| **Completed** | Not yet: AC-006 and AC-009 open |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-git templates are now the rulebook. Edit `commit-message-template.md` and the commit hook, the push hook, the agent gate and CI all enforce the change, with nothing else to touch. A repository that carries no templates is left alone.

### Template-driven message enforcement

Each of the three templates has an "Enforced rules" section holding a JSON block. `commit-message-template.md` covers the whole commit standard: subject grammar, the mandatory body, the search trailers `Spec:` and `Commit-Id:`, the attribution ban and the breaking footer. `pr-template.md` requires a filled Summary and Test Plan with no placeholders or attribution, and `worktree-checklist.md` holds the branch grammar. Every rule has an id, and the template prose names each id, so a drift check fails the moment prose and rules disagree.

`validate-message.mjs` finds the templates for the repository being checked: the `skgit.contractDir` git config first, then `.sk-git/` at its root, then its own sk-git assets. The `commit-msg` hook is now a thin shim over it. `pre-push` re-checks every pushed commit and each new branch name, which catches a commit made with `--no-verify`. An agent gate refuses a bad `git commit -m`, `gh pr create` body or branch name before the command runs. `message-contract.yml` runs the same checks in CI. The bypass variable is gone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | Created | Resolve, parse and validate the rules blocks |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Created | CLI every gate calls |
| `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Created | Agent PreToolUse gate |
| `.skilled/skills/sk-git/assets/{commit-message-template,pr-template,worktree-checklist}.md` | Modified | Rules blocks and rule-id tables |
| `.skilled/scripts/git-hooks/commit-msg` | Modified | Shim over the validator, no bypass |
| `.skilled/scripts/git-hooks/pre-push` | Modified | Gate 6: message contract over every pushed range |
| `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | Created | Validator lookup shared by both hooks |
| `.github/workflows/message-contract.yml` | Created | Server-side check for pushes and PRs |
| `hook-registry.json` and the four rendered runtime configs | Modified | Register the agent gate for Claude, Codex, Devin and Cursor |
| Tests: `commit-msg.test.sh`, `pre-push-message-contract.test.sh`, `message-contract.test.mjs` | Modified / Created | 29, 10 and 17 cases |
| sk-git `SKILL.md`, references, feature catalog, READMEs, changelog `v1.8.0.0`, `.env.example` | Modified / Created | Document the contract and drop the bypass |
| sk-git feature catalog entry `workflow-playbooks/message-contract-enforcement.md` and playbook scenario GIT-045 | Created | Catalog the contract and give operators a scratch-repository test of it, registered in `leaf-manifest.json` and `leaf-aliases.json` |
| `.opencode/plugins/sk-git-message-gate.js`, `sk-git/scripts/hooks/pi/git-message-gate.ts`, `.hermes/plugins/repo-guards/__init__.py` | Created / Modified | The agent gate for OpenCode (throws), Pi (`block: true`) and Hermes (`action: block`), each calling the shared `evaluateCommand`, with a test suite each, the `.pi/extensions` link, the registry's `pi` entry and a `.skilled/hooks/git-message-gate/` index |
| Playbook scenario GIT-007 | Modified | It asked for the co-author footer the contract refuses; it now checks that the footer is left out and refused |
| Root `README.md`, `CONTRIBUTING.md`, git-hooks `tests/README.md` | Modified | Describe template-driven rules and drop the bypass wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in worktree `worktrees/073-message-contract-enforcement`, because the machine-wide hooks link into the main checkout and a half-built hook there would have blocked every repository and every running session. The new hook ran first against the 22 original test cases with only the contract wired in. It then ran against the last 40 and the last 500 real commits, which surfaced a too-strict packet check and a slow range scan; both were fixed before closing. Nothing is merged or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The template carries the rules (ADR-001) | The operator wants an edited template to change enforcement, and only this makes the template the source |
| One Node validator for every gate (ADR-002) | A rule exists once, so the four gates cannot disagree |
| "100%" means a required CI check (ADR-003) | Every local hook can be skipped; only a required server-side check cannot |
| Three hook verdicts change on purpose (ADR-004) | The bypass is removed and the `specs/`-prefix rule the template always stated is now enforced |
| A `Spec:` packet counts when the commit's tree or the pushed tip holds it | Real pushes land code commits before the commit that adds the packet docs; checking each commit alone blocked 7 of the last 40 real commits wrongly |
| Exclude `*/HEAD` and the overwritten ref from the Commit-Id scan | git matches `--exclude` against short names, and `origin/HEAD` aliases `origin/main`, so a rebase compared itself with its own old copy |
| The agent gate allows what it cannot read | The hooks and CI stand behind it; blocking unreadable commands would stop real work without adding a guarantee |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `commit-msg.test.sh` | PASS 29/29 (22 updated originals plus 7 new) |
| Parity: original 22 cases through the new hook | 19 identical, 3 deliberate changes (ADR-004) |
| `pre-push-message-contract.test.sh` (real bare remote) | PASS 10/10 |
| `pre-push.test.sh` / `prepare-commit-msg.test.sh` | PASS 43/43 / 56/56, same as baseline |
| `message-contract.test.mjs` | PASS 17/17 |
| `git-rule-checks`, `git-preflight-advisory` node tests | PASS 26/26, 7/7 |
| sk-git shell tests (commit-id, stamp-branch, worktree-naming) | PASS 39/39, 24/24, 83/83 |
| `hook-registration-sync.vitest.ts` | PASS 4/4 after the pinned binding count moved from 81 to 85 |
| `sync-hook-registrations --check`, `sync-runtime-mirrors --check`, `sync-skills-hermes --check` | PASS |
| Skill-root metadata gate | PASS 15/15 |
| sk-doc `validate_document.py` on 10 edited docs, comment hygiene on 9 code files | PASS |
| Agent gate over real payloads | Claude-shape deny envelope, Cursor-shape deny with exit 2, unrelated and garbage input allowed |
| Timing | `commit-msg` 0.23 s (target 0.3 s); 500-commit range 0.67 s, down from 21.69 s with identical verdicts (target 5 s) |
| sk-code-opencode `verify_alignment_drift.py` (headers, sections, folders) over both script roots | 3 errors, all present on `main` (two older guard libraries without headers, `hooks/opencode` without a README); the new files add none |
| `validate-playbook-package.cjs --package sk-git` / `validate_catalog_package.py --package sk-git --strict` | PASS, 38 scenarios, 0 violations / exit 0 with 13 advisory warnings of the kind every existing entry already carries |
| OpenCode, Pi and Hermes gate suites | PASS 5/5, 3/3 and 48/48; alignment over the new adapter files 0 errors |
| GIT-045 and GIT-007 command sequences run in scratch repositories | Every expected signal observed, including `[subject.max-length]` after the edited `maxLength` and `[attribution.forbidden]` on a forced footer |
| `install-git-hooks-worktree-harness.sh` | FAIL, and it fails the same way before this change: it greps for a `HOOK_SOURCE_DIR` line the installer stopped using |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CI has not run on GitHub yet.** Its push-step logic ran locally. Until the owner makes `message-contract` a required status check, CI reports and does not block.
2. **The OpenCode, Pi and Hermes gates are proven by unit tests, not a live session.** Each test drives the real plugin or extension entry point against a throwaway repository, but no OpenCode, Pi or Hermes session has run one yet.
3. **Old history is not re-checked.** The last 500 commits hold 130 that the new rules would block, such as `1430237b9b` (no body) and `8e4b86b247` (`Spec:` without a track). Pushes check only new commits.
4. **Other repositories need the validator to run CI.** The local hooks work for any repository through the machine-wide install, but a repository's own CI needs a copy of `validate-message.mjs` and its library.
<!-- /ANCHOR:limitations -->

---
