---
title: "Implementation Summary: Phase 2: doctor-git-setup"
description: "A read-only /doctor:git setup target now reports eleven sk-git settings, each with its source and one repair per failure, and writes nothing."
trigger_phrases:
  - "doctor git setup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/002-doctor-git-setup"
    last_updated_at: "2026-10-15T08:10:12Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the read-only /doctor:git setup battery and docs"
    next_safe_action: "Commit and push the build, then plan the git-standards test fix"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs"
      - "specs/sk-git/033-git-setup-customization/002-doctor-git-setup/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:243a0bd7796314d614bae0cb8aed9623b6936354e0407f1e11026f94c25db04b"
      session_id: "scaffold-002-doctor-git-setup"
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
| **Spec Folder** | 002-doctor-git-setup |
| **Completed** | 2026-10-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now run `/doctor:git setup` and see which sk-git rules are live in your repository. Before this, several sk-git paths failed open: a missing contract, an unknown advisory check and an unregistered AI-tool hook all looked healthy. The new target reads eleven settings, prints PASS, FAIL, SKIP or UNKNOWN for each with the source it read, names one repair for each failure and writes nothing.

### Phase 2: doctor-git-setup

The battery script `git-setup-check.cjs` checks the sk-git install, the hook links, hook trust, saved gate switches, the commit, PR and branch contract, the remote branch allowlist, the worktree base and provision list, the Commit-Id policy, the advisory rules, the suppression flags and the active AI tool's advisory registration. It loads every helper from its own install root, so a cloned repository it inspects cannot plant code that it then runs. `--json` gives one object for scripts, and the exit code is 0, 1 or 2.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Created | The read-only battery |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Created | Eleven tests, including the no-write proof and the planted-helper test |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Created | One-step read-only workflow |
| `.skilled/commands/doctor/_routes.yaml`, `git.md`, `assets/doctor-git-presentation.txt` | Modified | The `setup` route, router rows, menu option 3 and the result template |
| `.skilled/commands/doctor/scripts/route-validate.py`, `scripts/tests/route-validate.test.sh` | Modified | Duplicate-target check scoped to one command, since `/doctor:sk-code` also has `setup` |
| Script, test and command READMEs, `command-contract.json`, the spec-kit doctor catalog | Modified | Each list of `/doctor:git` targets names `setup` |
| `.skilled/skills/sk-git/manual-testing-playbook/` with `leaf-manifest.json` and `leaf-aliases.json` | Modified | Scenario DOC-384, its index rows and the menu scenario's option 3 |
| `.skilled/skills/sk-git/README.md`, `README.md` | Modified | The setup target in the troubleshooting row and an sk-git section in the adaptation guide |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 Flash at max thinking, run through cli-pi on the LLM gateway, made the edits outside the spec folder from exact briefs. The orchestrator reviewed each diff against a backup, ran the tests and checked each new test by reverting its fix and watching it fail. Verification found three defects in the first build, and each was fixed and covered by a test: the hooks check first called `install-git-hooks.sh --status`, which runs the inspected repository's own validator. The allowlist row reported release branches as refused, though pre-push exempts them. The ai-tool-hooks and Commit-Id failures named the hook installer as their repair, which fixes neither.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A third target on `/doctor:git`, not a new command | The router already owns sk-git, and the existing targets stay the repair paths |
| Check the hooks in-process instead of calling the installer | The installer runs a validator from the repository it inspects, which an untrusted clone controls |
| Advisory check covers the active AI tool only | The operator chose it, and no uniform probe exists for the other five |
| Scope route-validate's duplicate check to one command | `setup` is a valid target on both `/doctor:sk-code` and `/doctor:git` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git-setup-check.test.cjs` | PASS, 11 of 11. Each fixed defect's test fails with its fix reverted |
| `route-validate.sh` and its self-test | PASS, exit 0, self-test 21 of 21 |
| `run-all.sh` | 6 of 7 suites pass. The node:test group fails 2 tests in `git-standards.test.cjs`, and those 2 fail the same way on an export of HEAD `c05034a20b`, so this work did not cause them |
| `/doctor:git setup` on this checkout | `STATUS=OK checks=11`, exit 0 |
| Battery on a fresh untrusted repository | trust SKIP, ai-tool-hooks FAIL with its repair, exit 1, nothing written |
| HVR scan on the changed docs | No new hard blockers. Each file's count matches HEAD |
| `ci-skill-root-metadata.cjs --fix` | 14 of 14 pass, sk-git regenerated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two failing `git-standards.test.cjs` tests predate this work.** They fail on HEAD too and need their own fix in the `/doctor:git standards` packet.
2. **The advisory check reads one AI tool.** The others are listed as not checked with their file paths.
3. **`hard-rules.json` has no per-repository overlay.** A repository on a shared install cannot add its own advisory rules, as the research noted.
<!-- /ANCHOR:limitations -->

---
