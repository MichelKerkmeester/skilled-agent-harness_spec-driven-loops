# Contributing to OpenCode Dev Environment

Welcome! We're excited that you're interested in contributing to the OpenCode Dev Environment. This document provides guidelines and best practices for contributing.

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
git clone https://github.com/YOUR_USERNAME/opencode-dev-environment.git
cd opencode-dev-environment

# Install dependencies (if modifying MCP server)
cd .opencode/skill/system-spec-kit
npm install
```

### Testing Changes

```bash
# Test Spec Kit Memory MCP server
node .opencode/skill/system-spec-kit/mcp_server/context-server.js

# Test embedding providers
node .opencode/skill/system-spec-kit/scripts/test-embeddings-factory.js
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

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description | Example |
|------|-------------|---------|
| **feat** | New feature | `feat: add Voyage embedding provider` |
| **fix** | Bug fix | `fix: correct dimension mismatch in factory` |
| **docs** | Documentation | `docs: update README with new provider options` |
| **chore** | Maintenance | `chore: update dependencies` |
| **refactor** | Code restructuring | `refactor: extract common API logic` |

| Guideline | Rule |
|-----------|------|
| **Length** | Keep the first line under 72 characters |
| **Mood** | Use imperative ("add" not "added") |
| **References** | Reference issues when applicable: `fix: resolve #123` |

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

This PR adds a Voyage AI embedding provider for Spec Kit Memory.

**Key changes:**
- New `voyage.js` provider using voyage-3.5 model
- Updated factory.js with Voyage auto-detection
- Added documentation to opencode.json

## Testing

1. Set `VOYAGE_API_KEY` environment variable
2. Run `node test-embeddings-factory.js`
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

Contributors are recognized in release notes. Thank you for helping improve OpenCode Dev Environment!

---

## 9. 📜 LICENSE

By contributing, you agree that your contributions will be licensed under the same license as the project.
