---
title: "Implementation Summary"
description: "Dotenv files are now out of every agent's reach on all seven runtimes: one shared guard denies the file tools and the common shell reads, and three value-free answers replace reading the file."
trigger_phrases:
  - "env secret guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard"
    last_updated_at: "2026-11-10T20:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "After-call check, env-only switch, live runs on five runtimes"
    next_safe_action: "Commit and merge after operator review"
    blockers: []
    key_files:
      - ".skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs"
      - ".skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs"
      - ".opencode/plugins/env-secret-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-env-secret-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtimes: all seven, as the operator asked mid-build"
      - "Review route: OpenCode Go after DevPass hit its credit limit, operator choice"
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
| **Spec Folder** | 007-env-secret-guard |
| **Completed** | 2026-11-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent on any of the seven runtimes Skilled supports can no longer read or write a dotenv file through a file tool or the common shell reads. When it needs to know what the file holds, it gets the keys, the bad lines or a keyed fingerprint, never a value.

### Env secret guard for every runtime

One core decides every call. File tools are judged by the base name of every path they name, including patch headers and the real target of a symlink. Shell commands are tokenized the way the shell does it, so quoting, escapes and `dd if=` cannot hide the file, and grep's pattern is never mistaken for a file while its `-f` pattern file is. The body of a `$(...)`, backtick or `<(...)` substitution is judged as its own command, a variable assigned in the same line or a `${X:-default}` is expanded before a word is judged, and a substitution that only echoes text, such as `$(printf .env)`, is judged by what it prints, a `$` inside single quotes stays literal, and a glob counts when it can expand to a dotenv file. Wrapper options such as `sudo -u root` are skipped, a `bash -c` script is judged as a command, an interpreter one-liner that names a dotenv file is refused, and `ln` counts as a reader. PowerShell keeps a backslash as a path separator. An interpreter or shell handed a dotenv file as an argument is refused, inline code or script file alike, as are `env -S`, a read inside an `if`, a loop or a subshell, and a hard link to a dotenv file under any name. Running an app that loads its own `.env` stays allowed.

A second check runs after every shell call, because a call's text does not show everything it does. The guard records the project's dotenv files before the call, puts back any that changed and keeps the rejected version outside the checkout, and looks for a dotenv value in the output. OpenCode and Pi replace a found value before the model reads it; the other runtimes report it. An agent may read the guard's code but its file tools and shell redirections may not change it, and every refusal and finding is appended, without values, to `.skilled/skills/.state/env-secret-guard.log`.

The fingerprint is HMAC-SHA256 keyed by `ENV_SECRET_GUARD_PEPPER` from the environment. The pepper the source branch committed is not reused, and no pepper is ever read from disk.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs` | Created | The policy and the value-free inspection functions |
| `.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs` | Created | The after-call write check and output scan |
| `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard-after.cjs` | Created | After-call entry: the Codex installer allows one registration per script path |
| `.skilled/hooks/env-secret-guard/cli/env-secret.cjs` | Created | `keys`, `validate` and `fingerprint` for any shell |
| `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs` | Created | Claude Code, Codex, Cursor and Devin |
| `.skilled/hooks/env-secret-guard/pi/env-secret-guard.ts`, `dsh/env-secret-guard.mjs` | Created | Pi extension and DSH adapter |
| `.opencode/plugins/env-secret-guard.js` | Created | OpenCode guard and its three tools |
| `manual-testing-playbook/plugins-and-hooks/env-secret-guard-*-conversation.md` | Created | CE-P06 and CE-P07 conversational scenarios for five runtimes |
| `hook-registry.json` and the four generated hook configs | Modified | Registration on Claude Code, Codex, Cursor and Devin |
| `.dsh/plugins/repo-guards/index.mjs`, `.pi/extensions/` link | Modified, Created | DSH and Pi registration |
| Concern README, hooks README, plugin, Pi and DSH READMEs | Created, Modified | Inventory and the kill-switch index |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in worktree `341-env-secret-guard`. Each adapter is tested with its runtime's payload shape, and every gate was run against a `main` baseline. Three independent read-only reviews by DeepSeek v4.1 Flash at max reasoning, one per surface, ran on the OpenCode Go route after LLM Gateway returned a credit-limit error. Every finding was reproduced against the code before it was fixed, and each fix has a test. A `/local-skilled-alignment` run then reviewed the whole change in four lanes plus a critic. It found five more bypasses or parser defects in the core, each reproduced on dummy fixtures and fixed with a test, and documentation the change had left behind across the root README, the env templates, the hooks hub, the runtime mirrors and the DSH references. A four-iteration `/deep:review` by Codex `gpt-6-luna` at xhigh reasoning on the fast tier came back CONDITIONAL with one P1 and three P2s; its report is in `review/lineages/luna/review-report.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One command hook serves four runtimes | All four read stdin JSON. Only the deny envelope differs, and the payload says which one to use |
| Judge shell commands, not only file tools | Codex reads files only through its shell, so file tools alone would protect nothing there |
| Fail open everywhere | A guard bug must never stop an agent. The Pi adapter now says so on stderr when it happens |
| Drop the source's out-of-project rule | It blocked unrelated reads. Matching by name anywhere still catches `../other/.env` |
| No value length in the fingerprint | An exact length narrows an offline search for a short secret |
| Kill switch from the environment only | Operator direction after the live runs. `hook-flags.env` is a file the agent can write, so this guard no longer goes through the shared `isHookEnabled` reader the spec named |
| Undo a dotenv write by default | Operator kept every check enabled by default. `ENV_SECRET_GUARD_WRITE_CHECK=report` is the opt-out for a tool that is meant to write one |
| Backups outside the checkout, owner-only | Undoing a write needs the old content, and a copy of a dotenv file must not sit where an agent or git can reach it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard suites (core, watch, adapters, CLI, DSH, OpenCode v1 and v2) | PASS, 60/60 |
| CI hook node:test collection | PASS, 1543/1543 (main 1489/1489) |
| OpenCode plugin suite | PASS, 581/581 (main 574/574) |
| Hooks vitest tree | PASS, 491/491 (main 491/491) |
| Runtime-mirror tests, DSH bundle tests | PASS, 6/6 and 5/5 |
| `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` | PASS, 35-hook registry, 256 mirrors |
| `/local-skilled-alignment` | First run: 49/49 battery rows, 36 findings, 0 P0, every in-scope P1 fixed with a test. Battery-only rerun after the fixes: 57/57 rows on the widened 55-file scope |
| Luna deep review, 4 iterations | 1 P1 and 3 P2, each reproduced. Fixed: the P1 (a path printed by `$(echo .env)` or `$(printf .env)`), the single-quoted `'$f'` false denial and the DSH table missing `grep`, each code fix with a test. Kept by design: `.env*` is refused in a folder holding only `.env.example`, because an earlier `cd` can move the shell to a folder the guard never lists. Battery after the fixes: 57/57 rows |
| CE-P06 and CE-P07 live runs | Latest result per runtime: CE-P06 and CE-P07 both PASS on Codex, Devin, OpenCode and Pi; CE-P07 PASS on Claude Code in the first pass. The Devin, OpenCode and Pi passes predate the last two fixes. OpenCode and Pi ran on OpenCode Go because LLM Gateway returned a credit-limit error. The runs found four holes, each fixed with a test: Codex read a value with a Python here-document, also reported by the output scan; Devin appended to `.env` with `node -e '...' .env`; Codex read a value with `if [ -f .env ]; then awk ... .env; fi`, which the output scan reported in the same turn; and `grep --exclude=.env*` was falsely refused. Claude Code's CE-P06 was not rerun after a script error of the runner's making, and its after-call hook is proven by tests only |
| DeepSeek reviews | 15 findings, 14 distinct (two reviews found the Write `content` case): 13 confirmed and fixed, 1 partly confirmed (Codex `read_file`) and covered |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live coverage is partial.** Live sessions ran on Claude Code, Codex, Devin, OpenCode and Pi. Cursor and DSH were proven only against their payload shapes in tests, and OpenCode's refusal path was never triggered live.
2. **The shell rule is a list, not a parser.** Loading the file and printing a variable later (`source .env` then `echo $KEY`), interpreter code that loads it without naming it (a dotenv library's default path), `env -S` with a quoted command, a path only a real program prints (`cat $(ls | grep env)`), or a script that hard-codes the path get past the text check. The after-call check undoes such a write and reports such a read, within its own limits: shell calls only, dotenv files within three folders of the root, a value printed as the file spells it, and a report rather than a block on Claude Code, Codex, Cursor, Devin and DSH.
3. **(Closed) The kill switch could be set by the agent.** It is now read from the environment only. Original text: `SYSTEM_ENV_SECRET_GUARD_DISABLED` is read from `.skilled/hooks/hook-flags.env`, a file the agent can write. Every hook concern shares that design.
4. **Scenario coverage has gaps.** Claude Code's CE-P06 has no clean pass on record, Cursor and DSH have no live run, and CE-P07's first message now tells the agent not to ask questions because the runner cannot answer a follow-up dialog on Pi.
6. **The write check can undo a legitimate write.** A command run through the agent that is meant to write a dotenv file is reverted unless `ENV_SECRET_GUARD_WRITE_CHECK=report` is set. The rejected version is kept.
7. **Self-protection is partial.** `sed -i`, `cp` or `rm` aimed at the guard's folder is not judged, and nothing stops an agent from editing a runtime's hook registration.
8. **Not built.** An operating-system deny rule per runtime, and moving real values to a secret manager.
5. **Folded into a tagged release.** The operator chose to add this work to v4.0.2.1, which was already tagged and published. The changelog rule numbers a new entry in that case. The entry now runs past the template's 240-line ceiling, and the operator chose to leave it there, so the changelog shape check fails on length alone. The published release text was updated before the commit, so the tag v4.0.2.1 does not yet hold the guard code; moving it waits on the operator.
<!-- /ANCHOR:limitations -->

---
