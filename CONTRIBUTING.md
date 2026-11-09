# Contributing to Skilled

Thank you for wanting to contribute to Skilled. This guide covers the setup, the rules the hooks and CI enforce and what a pull request needs.

---

## 1. 🚀 QUICK START

| Step | Action |
|------|--------|
| **1. Fork** | Fork the repository on GitHub |
| **2. Clone** | Clone your fork locally |
| **3. Branch** | Create a branch for your changes. [Branch Names](#branch-names) lists the names the hooks accept |
| **4. Develop** | Make your changes following the guidelines below |
| **5. Submit** | Open a pull request whose description has a `## Summary` and a `## Test Plan` section |

---

## 2. ⚙️ DEVELOPMENT SETUP

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | 24.x for a full install. Code Mode's MCP server needs `>=24.0.0 <25.0.0`, the spec-kit runtime CLI needs 22.12+ and the advisor runtime needs 20.19+ or 22.12+, so Node 24 is the one line every part accepts |
| **npm, Git and a POSIX shell** | Latest |
| **Runtime** | One of the six runtimes Skilled supports: OpenCode, Claude Code, Codex, Cursor, Devin or Pi |

### Installation

Run every command from the repository root.

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops

# Build the Spec Kit first. The session hooks load this build
npm --prefix .skilled/skills/system-spec-kit install
npm --prefix .skilled/skills/system-spec-kit run build

# Then build the Skill Advisor. It uses the Spec Kit's TypeScript compiler
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

Open the clone in your runtime and run `/doctor:setup`. It checks the install without changing anything and names one repair command for each failure. Run `/doctor:mcp install` when your change touches Code Mode. [INSTALL-SKILLED.md](INSTALL-SKILLED.md) has the full setup guide.

Your first AI session in the clone installs this repository's git hooks. [Git Hooks](README.md#git-hooks) in the README says what they block and how to turn them off.

### Testing Changes

```bash
# Test spec-folder retrieval (no server)
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "spec folder question"

# Run the Spec Kit suites (needs the build above)
npm --prefix .skilled/skills/system-spec-kit test

# Run the Skill Advisor suite
npm --prefix .skilled/skills/system-skill-advisor/runtime test
```

Each skill with a runtime keeps its test scripts in its own `package.json`. Run the suite of the skill you changed.

---

## 3. 📝 CODE STYLE

The `sk-code` skill holds the full standards, under `.skilled/skills/sk-code/`. The rules below are the ones reviewers check most often.

| Rule | Description |
|------|-------------|
| **Doc comments** | TSDoc on exported TypeScript functions, classes and interfaces. JSDoc on exported JavaScript functions. Docstrings on public Python functions |
| **Naming** | camelCase functions and UPPER_SNAKE constants in JavaScript and TypeScript. PascalCase TypeScript interfaces, types and enums. snake_case functions in Python and shell |
| **Comments** | Explain why, not what. Leave spec, packet, task and ticket ids out of comments, because the pre-commit hook blocks them |
| **Error handling** | Handle every error and write a message that says what failed |
| **Function scope** | One function, one responsibility |
| **Language** | All code comments and documentation in English |

**TSDoc Example:**

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

> **Note**: If you translate from another language, translate every comment, error message, line of console output and document.

---

## 4. 💬 COMMIT MESSAGES

We follow [Conventional Commits](https://www.conventionalcommits.org/) with a required scope, `type(scope): summary`:

| Type | Description | Example |
|------|-------------|---------|
| **feat** | New feature | `feat(sk-git): add a branch-name check to pre-push` |
| **fix** | Bug fix | `fix(system-spec-kit): reject an index folder outside the host` |
| **docs** | Documentation | `docs(readme): describe the link and copy install paths` |
| **chore** | Maintenance | `chore(deps): update dependencies` |
| **refactor** | Code restructuring | `refactor(system-skill-advisor): extract the scoring step` |

The hook also accepts `build`, `ci`, `merge`, `perf`, `release`, `revert`, `style` and `test`.

| Guideline | Rule |
|-----------|------|
| **Scope** | Name the changed subsystem in lowercase. A file under `.skilled/skills/<name>/` takes the scope `<name>`, such as `sk-git` or `system-spec-kit` |
| **Length** | Aim for a first line of 80 characters or fewer. The hook blocks one over 100 |
| **Mood** | Use imperative ("add" not "added"), starting in lowercase, with no closing punctuation |
| **Body** | Add a prose paragraph below the subject, saying what changed and why |
| **Trailers** | The `prepare-commit-msg` hook stamps a `Commit-Id:` line in the last paragraph. Never type one by hand |
| **References** | Reference issues in the last paragraph: `Fixes #123` |
| **Attribution** | Leave out `Co-Authored-By:` and `Claude-Session:` lines |

The repository's `commit-msg` hook blocks a message that breaks these rules, and `pre-push` checks every pushed commit again, so `--no-verify` does not get one through. There is no bypass variable. The rules live in the `Enforced rules` block of [the commit template](.skilled/skills/sk-git/assets/commit-message-template.md), and each block message names the rule id it failed. [Git Hooks](README.md#git-hooks) in the README lists what each hook blocks.

### Branch Names

The `pre-push` hook checks the name of a new branch when it reaches this repository. It accepts `main`, `skilled/vA.B.C.D`, `worktrees/NNN-slug`, `branches/NNN-slug`, `work/<runtime>/<slug>`, `backup/<name>` and `dependabot/<name>`. CI does not check the branch names of a fork. The rules live in the `Enforced rules` block of [the worktree checklist](.skilled/skills/sk-git/assets/worktree-checklist.md).

---

## 5. 🔄 PULL REQUEST PROCESS

### PR Checklist

CI holds every pull request description to the `Enforced rules` block of [the PR template](.skilled/skills/sk-git/assets/pr-template.md).

| Element | Description |
|---------|-------------|
| **Title** | Clear description of what changed |
| **`## Summary`** | Required. What changes were made and why |
| **`## Test Plan`** | Required. How you tested the changes and how a reviewer repeats it |
| **Placeholders** | Fill or delete every `<placeholder>` line from the template |
| **Attribution** | Leave out AI-tool attribution lines, the same rule commits follow |

**Example PR description:**

```markdown
## Summary

This PR lets a host repository name its own trigger-index folder.

**Key changes:**
- The generator and the lookup read the folder name from the host's settings file
- A folder outside the host root is rejected with exit code 2
- The retrieval README documents the setting

## Test Plan

1. Build the Spec Kit
2. Run the Spec Kit suites from [Testing Changes](#testing-changes)
3. Set the folder name in a scratch repository and confirm the lookup reads the new folder
```

### Review Process

| Step | Timeline |
|------|----------|
| **Automated checks** | Run immediately on PR. Most workflows run only when the paths they guard change. The `message-contract` check runs on every pull request and is the one a merge requires |
| **Maintainer review** | Within 1-3 days |
| **Address feedback** | As requested |
| **Merge** | Once approved |

### What We Look For

| Criteria | Requirement |
|----------|-------------|
| **Patterns** | Code follows existing patterns |
| **Documentation** | Changes are documented |
| **Paths** | No hardcoded paths |
| **Compatibility** | Backward compatibility maintained |
| **Tests** | Tests pass (if applicable) |

### Working With an AI Runtime

[AGENTS.md](AGENTS.md) binds every AI session in this repository. A session that changes files records the work in a spec folder under `specs/`, and it loads [REPO RULES.md](REPO%20RULES.md) before its first write. CI validates each spec packet a pull request touches.

---

## 6. 💡 WHAT TO CONTRIBUTE

| Priority | Area | Description |
|----------|------|-------------|
| **High** | Bug fixes | With clear reproduction steps |
| **High** | Performance | Improvements with benchmarks |
| **High** | Documentation | Improvements and clarifications |
| **Medium** | New skills | Scaffold with `/create:skill`, or `/create:skill-parent` for a skill with nested modes |
| **Medium** | Commands and agents | Scaffold with `/create:command` and `/create:agent` |
| **Medium** | Tests | Test coverage |
| **Always** | Typo fixes | Quick corrections welcome |
| **Always** | Code clarity | Readability improvements |
| **Always** | Translation | Convert non-English content to English |

---

## 7. ❓ QUESTIONS

| Action | When to Use |
|--------|-------------|
| **Open an issue** | Bugs, feature requests, questions and ideas |
| **Check existing issues** | Before creating new ones |
| **Report privately** | Security problems. Follow [SECURITY.md](SECURITY.md) and never open a public issue for one |

---

## 8. 🏆 RECOGNITION

Contributors are recognized in release notes. Thank you for helping improve Skilled!

---

## 9. 📜 LICENSE

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
