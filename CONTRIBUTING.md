# Contributing to Skilled

Welcome! We're excited that you're interested in contributing to Skilled. This document provides guidelines and best practices for contributing.

---

## 1. 🚀 QUICK START

| Step | Action |
|------|--------|
| **1. Fork** | Fork the repository on GitHub |
| **2. Clone** | Clone your fork locally |
| **3. Branch** | Create a branch for your changes |
| **4. Develop** | Make your changes following the guidelines below |
| **5. Submit** | Submit a pull request with a clear description |

---

## 2. ⚙️ DEVELOPMENT SETUP

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | 18+ |
| **Git** | Latest |
| **Editor** | OpenCode-compatible (VS Code, Cursor, etc.) |

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops

# Install dependencies (if modifying MCP server)
cd .skilled/skills/system-spec-kit
npm install
```

Your first AI session in the clone installs this repository's git hooks. [Git Hooks](README.md#git-hooks) in the README says what they block and how to turn them off.

### Testing Changes

```bash
# Test spec-folder retrieval (no server)
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "spec folder question"

# Test embedding providers
cd .skilled/skills/system-spec-kit
npx vitest run --config vitest.config.ts --project root runtime/tests/factory-auto-resolution.vitest.ts runtime/tests/api-validation.vitest.ts runtime/tests/api-key-validation.vitest.ts
```

---

## 3. 📝 CODE STYLE

| Rule | Description |
|------|-------------|
| **JSDoc comments** | All functions with parameters and return types |
| **Naming** | camelCase for variables/functions, PascalCase for classes |
| **Error handling** | Always handle errors gracefully with meaningful messages |
| **Function scope** | One function, one responsibility |
| **Language** | All code comments and documentation in English |

**JSDoc Example:**

```javascript
/**
 * Generate embedding for text
 *
 * @param {string} text - Text to embed
 * @param {string} inputType - 'document' or 'query'
 * @returns {Promise<Float32Array>} Embedding vector
 */
async function generateEmbedding(text, inputType = null) {
  // Implementation
}
```

> **Note**: If translating from another language, ensure complete translation of all comments, error messages, console output, and documentation.

---

## 4. 💬 COMMIT MESSAGES

We follow [Conventional Commits](https://www.conventionalcommits.org/) with a required scope, `type(scope): summary`:

| Type | Description | Example |
|------|-------------|---------|
| **feat** | New feature | `feat(embeddings): add Voyage embedding provider` |
| **fix** | Bug fix | `fix(embeddings): correct dimension mismatch in factory` |
| **docs** | Documentation | `docs(readme): update README with new provider options` |
| **chore** | Maintenance | `chore(deps): update dependencies` |
| **refactor** | Code restructuring | `refactor(api): extract common API logic` |

| Guideline | Rule |
|-----------|------|
| **Scope** | Name the changed subsystem in lowercase, such as `sk-git` or `system-spec-kit` |
| **Length** | Keep the first line under 72 characters. The hook blocks one over 100 |
| **Mood** | Use imperative ("add" not "added"), starting in lowercase |
| **Body** | Add one when four or more files are staged, saying what changed and why |
| **References** | Reference issues in the last paragraph: `Fixes #123` |
| **Attribution** | Leave out `Co-Authored-By:` and `Claude-Session:` lines |

The repository's `commit-msg` hook blocks a message that breaks these rules, and its message names the one-command bypass. [Git Hooks](README.md#git-hooks) in the README lists what each hook blocks.

---

## 5. 🔄 PULL REQUEST PROCESS

### PR Checklist

| Element | Description |
|---------|-------------|
| **Title** | Clear description of what changed |
| **Summary** | What changes were made and why |
| **Testing** | How to test the changes |
| **Key changes** | Bullet points of main modifications |

**Example PR description:**

```markdown
## Summary

This PR adds a Voyage AI embedding provider to the shared embedding stack.

**Key changes:**
- New `voyage.js` provider using voyage-3.5 model
- Updated factory.js with Voyage auto-detection
- Added documentation to opencode.json

## Testing

1. Set `VOYAGE_API_KEY` environment variable
2. Run the embedding provider suites from [Testing Changes](#testing-changes)
3. Verify Voyage is selected as provider
```

### Review Process

| Step | Timeline |
|------|----------|
| **Automated checks** | Run immediately on PR |
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

---

## 6. 💡 WHAT TO CONTRIBUTE

| Priority | Area | Description |
|----------|------|-------------|
| **High** | Bug fixes | With clear reproduction steps |
| **High** | Embedding providers | Following existing patterns |
| **High** | Performance | Improvements with benchmarks |
| **High** | Documentation | Improvements and clarifications |
| **Medium** | New skills | Must follow skill template |
| **Medium** | Commands | Command improvements |
| **Medium** | Tests | Test coverage |
| **Always** | Typo fixes | Quick corrections welcome |
| **Always** | Code clarity | Readability improvements |
| **Always** | Translation | Convert non-English content to English |

---

## 7. ❓ QUESTIONS

| Action | When to Use |
|--------|-------------|
| **Open an issue** | Bugs or feature requests |
| **Start a discussion** | Questions or ideas |
| **Check existing issues** | Before creating new ones |

---

## 8. 🏆 RECOGNITION

Contributors are recognized in release notes. Thank you for helping improve Skilled!

---

## 9. 📜 LICENSE

By contributing, you agree that your contributions will be licensed under the same license as the project.
