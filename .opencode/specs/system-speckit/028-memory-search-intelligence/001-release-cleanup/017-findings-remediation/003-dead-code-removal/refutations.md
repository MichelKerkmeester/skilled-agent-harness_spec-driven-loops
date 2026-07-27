# Phase 003 dispositions — one applied, four withheld

Dead code was the category triage measured at 31% wrong, and it is the only category whose
remediation cannot be undone. Re-verification against current HEAD changed four of five outcomes.

## Applied

| Finding | Action |
|---------|--------|
| `devin-04:F14` | `.env.example` is silently ignored by the `.env.*` pattern. Add a negation so the example file is visible to git again. |

## RF-003-1 — `devin-01:F16` `validate-remote-allowlist` is a documented operator interface

**Claim**: the CLI subcommand has no external caller.

**The claim is true and the conclusion is wrong.** `.opencode/scripts/git-hooks/pre-push:47` sources
`worktree-naming.sh` and calls the *function* `is_remote_push_allowlisted` at line 136. The CLI
subcommand at lines 402 and 427 is the operator-facing entry point to the same gate, documented in
the script's own usage text.

Deleting it removes the only manual way to check the remote-push allowlist before attempting a push,
for a policy the repository treats as ask-first. Absence of a programmatic caller is expected for an
operator CLI; it is not evidence of death.

**Verify**: `grep -n 'is_remote_push_allowlisted' .opencode/scripts/git-hooks/pre-push`

## RF-003-2 — `devin-01:F17` `skill-ids` is a documented operator interface

**Claim**: the CLI subcommand has no external caller.

**Same shape.** `.opencode/skills/sk-git/scripts/README.md:60` lists it explicitly:
`| skill-ids | CLI | List the owner ids the allocator recognizes |`.

This is the identical pattern triage itself refuted as R-006, where a smoke test called
"undocumented with no caller" turned out to be documented as a direct manual invocation.

**Verify**: `grep -n 'skill-ids' .opencode/skills/sk-git/scripts/README.md`

## ESC-003-1 — `devin-04:F11` Copilot hook wrappers are intended-but-unbuilt

**Claim**: `.github/hooks/scripts/` reference a non-existent `dist/hooks/copilot/` directory.

**The reference is genuinely broken**, but two facts change the remediation. The wrappers guard the
call with `if [ -f ... ]`, so the missing path causes no failure — the hook is simply inert for
Copilot. And Copilot is a documented surface across `README.md`, `cli-opencode/SKILL.md`, the sk-git
manual-testing playbook, and a dedicated cross-CLI handback playbook.

The runtime has `claude`, `codex`, `cursor` and `devin` handlers but no `copilot`. Under the
operator's runtime-wins ruling this is the explicit escalation case: documentation describes
something clearly intended and never built. Deleting the wrappers is a capability decision, not a
cleanup. **Escalated, not executed.**

**Verify**: `ls .opencode/skills/system-spec-kit/mcp-server/dist/hooks/`

## DEF-003-1 — `devin-04:F6` karabiner shortcut deferred to phase 005

**Claim**: `karabiner.json` shortcut 5 references a non-existent agent `write.md`.

**True**, and no `write.md` exists anywhere in the repository. But `karabiner.json` is itself an
approved phase 005 finding as personal machine configuration misplaced in a public repository.
Repairing a shortcut inside a file that the next phase may remove is wasted work and risks a
conflicting edit. Deferred until phase 005 decides the file's fate.

## Pattern

Three of the four withheld findings share one structure: the observation is correct, and the
prescribed action does not follow from it. "No caller" is a fact about the call graph. "Delete it"
is a judgement about intent, and intent lives in the documentation the call graph cannot see.
