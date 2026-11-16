# Contributing to Skilled

Thank you for wanting to improve Skilled. This guide covers the setup, the rules the git hooks and CI enforce and what a pull request needs.

&nbsp;

## 1. 🧭 OVERVIEW

A contribution takes five steps. Fork the repository on GitHub and clone your fork. Create a branch with a name the hooks accept, as [Branch Names](#branch-names) explains. Write your change and run the tests for the part you touched. Then open a pull request whose description has a `## Summary` and a `## Test Plan` section.

The git hooks check most of the rules below before anything leaves your machine. CI checks them again on the pull request, so a rule you miss locally still shows up as a failed check.

&nbsp;

## 2. ⚙️ DEVELOPMENT SETUP

### Prerequisites

You need Node.js, npm, git and a POSIX shell. Use Node 24.22.1 or a newer 24.x release, because Code Mode runs only on Node 24. Everything else also runs on 22.23.4 or 26.12.1 and newer releases on those lines. To test a change in an AI session, you also need one of the eight runtimes Skilled supports.

### Install

Run every command from the repository root:

```bash
git clone https://github.com/YOUR_USERNAME/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops

npm --prefix .skilled/skills/system-spec-kit install
npm --prefix .skilled/skills/system-spec-kit run build

npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

The Spec Kit comes first, because the session hooks load its build and the advisor build uses its compiler. Open the clone in your runtime and run `/doctor:setup`. It checks the install without changing anything and names one repair command for each failing check. Run `/doctor:mcp install` only when your change touches Code Mode. The [install guide](INSTALL-SKILLED.md) has the full setup.

### Git Hooks

Your first AI session in the clone installs the repository's git hooks. Install them before your first commit, because the pre-push hook blocks a pushed commit with no `Commit-Id:` line and only the installed hooks stamp one. Without an AI session, install them yourself:

```bash
bash .skilled/scripts/install-git-hooks.sh
```

The [Git Hooks](README.md#git-hooks) section of the README says what each hook blocks.

### Testing Changes

Each skill with a runtime keeps its test scripts in its own `package.json`. Run the suite of the part you changed:

```bash
# Spec Kit suites, which need the build above
npm --prefix .skilled/skills/system-spec-kit test

# Skill Advisor suite
npm --prefix .skilled/skills/system-skill-advisor/runtime test

# Spec folder lookup, with no server
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "spec folder question"
```

&nbsp;

## 3. 📝 CODE STYLE

The full standards live in the [sk-code skill](.skilled/skills/sk-code/sk-code-skilled/README.md). Reviewers check these rules most often.

Exported TypeScript functions, classes and interfaces carry TSDoc. Exported JavaScript functions carry JSDoc, and public Python functions carry docstrings. TypeScript names functions in camelCase, types and interfaces in PascalCase and constants in UPPER_SNAKE. JavaScript follows the same rules for functions and constants. Python and shell name functions in snake_case.

Comments explain why, not what. Leave spec, packet, task and ticket ids out of comments, because the pre-commit hook blocks them. Handle every error with a message that says what failed. Give each function one job. Write all code comments and documentation in English, and translate every comment, message and document when you port code from another language.

```typescript
/**
 * Resolve the folder that holds a host's trigger index.
 *
 * @param hostRoot - Absolute path of the host repository
 * @returns The index folder, relative to the host root
 */
export function resolveIndexFolder(hostRoot: string): string {
  // Implementation
}
```

TypeScript carries the types in the signature, so the TSDoc tags leave them out.

&nbsp;

## 4. 💬 COMMIT MESSAGES

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) with a required scope:

```
fix(system-spec-kit): reject an index folder outside the host

The lookup accepted any folder name from the host settings file, so a
typo could point it at a folder outside the repository. It now rejects
that folder with exit code 2.

Fixes #123
```

The type is one of `feat`, `fix`, `docs`, `refactor`, `chore`, `build`, `ci`, `perf`, `test`, `style`, `revert`, `release` or `merge`. The scope names the changed subsystem in lowercase. A file under a skill folder takes the skill's name, such as `sk-git` or `system-spec-kit`. Use the full name, because the hook rejects short aliases such as `spec-kit` and `skill-advisor`.

The summary starts with a lowercase verb in the imperative, such as "add" and not "added". It has no closing punctuation and is not a vague word such as "update" or "fix". Aim for 80 characters or fewer on the first line. The hook blocks one over 100.

A prose body is required. Leave a blank line under the subject, then say what changed and why. End with an issue reference such as `Fixes #123` when there is one. The `prepare-commit-msg` hook adds a `Commit-Id:` line at the end, so never type one yourself. Leave out `Co-Authored-By:` and `Claude-Session:` lines.

The `commit-msg` hook blocks a message that breaks these rules, and each block names the rule it failed. There is no bypass. `--no-verify` only moves the check to `pre-push` and CI. The full rule list lives in the [commit template](.skilled/skills/sk-git/assets/commit-message-template.md).

### Branch Names

The `pre-push` hook checks a new branch's name when you push it. It accepts `main`, `skilled/vA.B.C.D`, `worktrees/NNN-slug`, `branches/NNN-slug`, `work/<runtime>/<slug>`, `backup/<name>` and `dependabot/<name>`. For a fork, `work/<runtime>/<slug>` is the simplest fit, as in `work/codex/index-folder-check`. CI checks branch names only for branches in this repository, never a fork's. The rules live in the [worktree checklist](.skilled/skills/sk-git/assets/worktree-checklist.md).

&nbsp;

## 5. 🔄 PULL REQUESTS

### Description

CI holds every pull request description to the rules in the [PR template](.skilled/skills/sk-git/assets/pr-template.md). A `## Summary` section says what changed and why. A `## Test Plan` section says how you tested it and how a reviewer repeats it. Both are required and neither may be empty. Fill or delete every `<placeholder>` line from the template, and leave out AI-tool attribution lines, as in commits.

```markdown
## Summary

This PR lets a host repository name its own trigger-index folder.

- The generator and the lookup read the folder name from the host's settings file
- A folder outside the host root is rejected with exit code 2
- The retrieval README documents the setting

## Test Plan

1. Build the Spec Kit
2. Run the Spec Kit suites from Testing Changes in CONTRIBUTING.md
3. Set the folder name in a scratch repository and confirm the lookup reads the new folder
```

### Checks

The message contract check runs on every pull request. It checks each commit and the description against the sk-git templates, and the branch name when the branch lives in this repository. Many other workflows run only when the paths they guard change. A pull request that touches a spec folder also gets that folder validated.

### What Reviewers Look For

Reviewers look for code that follows the patterns around it and changes that come with their documentation. They also check for hardcoded paths, for backward compatibility and for passing tests where the change has them.

### Working With An AI Runtime

[AGENTS.md](AGENTS.md) binds every AI session in this repository. A session that changes files records the work in a spec folder, and it loads the [repository rules](REPO%20RULES.md) before its first write.

&nbsp;

## 6. 💡 WHAT TO CONTRIBUTE

Bug fixes with clear steps to reproduce them are the most welcome. Performance work with benchmarks and documentation fixes rank just as high. New skills, commands, agents and tests are welcome too. Scaffold a skill with `/create:sk-skill`, or `/create:skill-parent` for a skill with several modes. Use `/create:command` and `/create:agent` for the others. Typo fixes, clearer code and English translations of non-English content are always welcome.

&nbsp;

## 7. ❓ QUESTIONS AND SECURITY

Open an issue for a bug, a feature request, a question or an idea. Check the existing issues first. Report a security problem privately, as [SECURITY.md](SECURITY.md) describes, and never in a public issue.

&nbsp;

## 8. 📜 LICENSE

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
