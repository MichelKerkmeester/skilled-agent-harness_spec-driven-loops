---
title: "Install Guides"
description: "Setup and installation guides for the OpenCode framework including MCP servers, skills, agents and CLI tools."
trigger_phrases:
  - "install guides"
  - "setup"
  - "installation"
  - "getting started"
  - "configuration"
  - "opencode setup"
  - "mcp server install"
importance_tier: "important"
---

# OpenCode Install Guides

> AI-executable guides for the OpenCode dev environment. Covers 8 MCP guides, native skills, 10 custom agents, and optional CLI tools.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1-overview)
2. [GUIDES INVENTORY](#2-guides-inventory)
3. [USAGE](#3-usage)
4. [PRE-FLIGHT CHECK](#4-pre-flight-check)
5. [ENVIRONMENT DETECTION](#5-environment-detection)
6. [VERSION COMPATIBILITY & RESOURCES](#6-version-compatibility--resources)
7. [COMPONENT MATRIX](#7-component-matrix)
8. [PHASE 1: PREREQUISITES](#8-phase-1-prerequisites)
9. [PHASE 2: LOCAL EMBEDDINGS](#9-phase-2-local-embeddings)
10. [PHASE 3: MCP SERVERS](#10-phase-3-mcp-servers)
11. [PHASE 4: PLUGINS](#11-phase-4-plugins)
12. [CONFIGURATION TEMPLATES](#12-configuration-templates)
13. [FINAL VERIFICATION](#13-final-verification)
14. [DISASTER RECOVERY](#14-disaster-recovery)
15. [POST-INSTALLATION CONFIGURATION](#15-post-installation-configuration)
16. [WHAT'S NEXT?](#16-whats-next)
17. [TROUBLESHOOTING](#17-troubleshooting)
18. [QUICK REFERENCE](#18-quick-reference)
19. [RELATED DOCUMENTS](#19-related-documents)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is this directory?

The `install_guides/` directory is the central hub for all OpenCode setup and installation documentation. It contains both this main installation guide and dedicated guides for individual components (MCP servers, agents, skills and CLI tools).

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Guide files | 13 | 6 MCP guides + 2 skill-package install guides, 4 SET-UP guides, 1 index guide (this README) |
| Install scripts | 8 | 3 real + 5 symlinks in `install_scripts/` |
| Registered MCP servers | 5 | Code Mode, Spec Kit Memory, Skill Advisor, System Code Graph, Sequential Thinking (Chrome DevTools is a Code Mode provider / CLI, not a registered native server) |
| Platforms supported | 3 | macOS, Linux, Windows WSL |

### What this guide covers

This README serves as both the **directory index** (listing all available guides) and the **main installation walkthrough** for the full OpenCode environment. Execute phases sequentially. Each includes validation checkpoints.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:guides-inventory -->
## 2. GUIDES INVENTORY

All `.md` guide files in this directory (5 real + 3 symlinks), grouped by type:

| Guide | Type | Purpose |
|-------|------|---------|
| **[README.md](./README.md)** (this file) | Real | Main installation walkthrough and directory index |
| **MCP Guides** | | |
| [MCP - Chrome Dev Tools.md](./MCP%20-%20Chrome%20Dev%20Tools.md) | Symlink | Chrome DevTools MCP server (bdg CLI) |
| [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) | Symlink | Code Mode orchestration MCP |
| [MCP - Sequential Thinking.md](./MCP%20-%20Sequential%20Thinking.md) | Real | Sequential Thinking MCP server |
| [MCP - Spec Kit Memory.md](./MCP%20-%20Spec%20Kit%20Memory.md) | Symlink | Spec Kit Memory MCP server |
| [Skill Advisor INSTALL_GUIDE](../skills/system-skill-advisor/INSTALL_GUIDE.md) | Skill-local | Standalone `mk_skill_advisor` MCP server install |
| [System Code Graph INSTALL_GUIDE](../skills/system-code-graph/INSTALL_GUIDE.md) | Skill-local | Standalone `mk_code_index` MCP server install (8 graph tools) |
| **SET-UP Guides** | | |
| [SET-UP - AGENTS.md](./SET-UP%20-%20AGENTS.md) | Real | AGENTS.md customization and AI agent behavior |
| [SET-UP - Skill Advisor.md](./SET-UP%20-%20Skill%20Advisor.md) | Symlink | Skill advisor configuration |
| **Automation** | | |
| [install_scripts/](./install_scripts/) | Directory | Automated install scripts (7 files) |

---

<!-- /ANCHOR:guides-inventory -->
<!-- ANCHOR:usage -->
## 3. USAGE

### When to use which guide

| Scenario | Start here |
|----------|------------|
| **Fresh install (first time)** | This README, Section 4 (Pre-Flight Check) onwards |
| **Add a specific MCP server** | The corresponding `MCP - *.md` guide |
| **Configure AI agent behavior** | [SET-UP - AGENTS.md](./SET-UP%20-%20AGENTS.md) |
| **Something broke** | Section 14 (Disaster Recovery) or Section 17 (Troubleshooting) |
| **Resume partial install** | Section 4 (Pre-Flight Check) to detect what is missing |

### AI-First Install Prompt

Copy this prompt to your AI assistant to begin a guided installation:

```
I need to install OpenCode components. Please guide me using .opencode/install_guides/README.md

My environment:
- Platform: [macOS / Linux / Windows WSL]
- LLM Provider: [Claude / GitHub Copilot / OpenAI / Gemini]
- Install Mode: [Full / Minimal / Missing only / Custom]
- Components (if custom): [Code Mode, Spec Kit Memory, Sequential Thinking, Chrome DevTools CLI]

Start with Pre-Flight Check to detect what's already installed, then guide me through each phase.
```

---

<!-- /ANCHOR:usage -->
<!-- ANCHOR:pre-flight-check -->
## 4. PRE-FLIGHT CHECK

Run this command to detect what's already installed:

```bash
echo ""
echo "    ┌─────────────────────────────────────────────────────────┐"
echo "    │            ⚡ OPENCODE PRE-FLIGHT CHECK ⚡                │"
echo "    ├─────────────────────────┬───────────────────────────────┤"
echo "    │ Component               │ Status                        │"
echo "    ├─────────────────────────┼───────────────────────────────┤"
printf "  │ %-23s │ %-29s │\n" "Node.js 18+" "$(node -v 2>/dev/null | grep -qE '^v(1[89]|2)' && echo '✅ '$(node -v) || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" "Python 3.10+" "$(python3 -V 2>&1 | grep -qE '3\.(1[0-9]|[2-9][0-9])' && echo '✅ '$(python3 -V 2>&1 | cut -d' ' -f2) || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" "uv" "$(command -v uv >/dev/null && echo '✅ Installed' || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" "Chrome DevTools (bdg)" "$(command -v bdg >/dev/null && echo '✅ Installed' || echo '⚪ Optional')"
echo "    ├─────────────────────────┼───────────────────────────────┤"
printf "  │ %-23s │ %-29s │\n" "opencode.json" "$(test -f opencode.json && echo '✅ Exists' || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" ".utcp_config.json" "$(test -f .utcp_config.json && echo '✅ Exists' || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" "Skills directory" "$(test -d .opencode/skills && echo '✅ '$(ls .opencode/skills 2>/dev/null | wc -l | tr -d ' ')' skills'     || echo '❌ Missing')"
echo "    └─────────────────────────┴───────────────────────────────┘"
echo ""
```

### Installation Modes

| Mode             | Description                                 | Use When                       |
| ---------------- | ------------------------------------------- | ------------------------------ |
| **Full**         | Install all components, reinstall if exists | Fresh setup or reset           |
| **Minimal**      | Code Mode + Spec Kit Memory only            | Quick start, limited resources |
| **Missing only** | Skip already-installed components           | Recommended for most cases     |
| **Custom**       | Select specific components                  | Targeted installation          |

**AI Logic:** Based on pre-flight results:
- All ✅ → Installation complete, verify only
- Mix of ✅/❌ → Use "Missing only" mode to install ❌ items
- All ❌ → Use "Full" mode

---

<!-- /ANCHOR:pre-flight-check -->
<!-- ANCHOR:environment-detection -->
## 5. ENVIRONMENT DETECTION

Answer these questions to configure your installation:

### Q1: Platform
- **macOS** → Full support, Homebrew for dependencies
- **Linux** → Full support, apt/dnf for dependencies
- **Windows WSL** → Full support via WSL2, follow Linux instructions

### Q2: Installation Scope
- **Project-specific** (recommended) → Install in `.opencode/` directory
- **Global** → Install in user home directory

### Q3: LLM Provider
- **Claude (Anthropic)** → Requires `ANTHROPIC_API_KEY`
- **GitHub Copilot** → Requires GitHub authentication
- **OpenAI / Codex** → Requires `OPENAI_API_KEY`
- **Gemini (Google)** → Requires `GEMINI_API_KEY`
> **Note:** Spec Kit Memory embeddings use a local-first `auto` cascade: Ollama (default, local daemon when reachable), HF Local (pure-Node local fallback), Voyage (cloud, opt-in via `VOYAGE_API_KEY`), and OpenAI (cloud, opt-in via `OPENAI_API_KEY`). The default `auto` cascade works out of the box with no API key. See [Section 10.2](#102-spec-kit-memory-context-preservation) for details.

### Windows-Specific Configuration

<details>
<summary><strong>Path Variables</strong></summary>

The `opencode.json` configuration uses `${HOME}` for portable paths. On Windows:

1. **PowerShell**: `${HOME}` works natively
2. **CMD**: Replace `${HOME}` with your actual home path (e.g., `C:/Users/YourName`)
3. **Git Bash**: `${HOME}` works natively

If you encounter path issues, manually replace `${HOME}` in `opencode.json` with your full path.

</details>

<details>
<summary><strong>Shell Scripts</strong></summary>

The SpecKit validation and creation scripts require a Bash shell:

- **Windows**: Install [Git for Windows](https://git-scm.com/download/win) (includes Git Bash) or use WSL
- **macOS/Linux**: Bash is available by default

Run scripts from Git Bash or WSL on Windows:
```bash
# From Git Bash
.opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/<001-feature>/
```

</details>

<details>
<summary><strong>Native Dependencies (Windows)</strong></summary>

Some MCP servers use native Node.js modules that require compilation:

1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Or run: `npm install --global windows-build-tools` (requires admin)

This is needed for:
- `better-sqlite3` (Memory MCP server)
- `sqlite-vec` (Vector search extension)

</details>

<details>
<summary><strong>Line Endings</strong></summary>

This project uses a `.gitattributes` file to enforce consistent line endings:
- Shell scripts (`.sh`) use LF (Unix-style)
- Batch files (`.bat`, `.cmd`) use CRLF (Windows-style)
- Markdown and config files use LF

If you edit files on Windows and encounter "bad interpreter" errors when running shell scripts, the line endings may have been converted to CRLF. Run:
```bash
# Fix line endings (Git Bash or WSL)
dos2unix script.sh

# Or use git to reset
git checkout -- script.sh
```

</details>

### Q4: Component Bundle
- **Full** → All components (3 native MCP servers + CLI tools + plugins)
- **Minimal** → Code Mode + Spec Kit Memory (Skills are built-in)
- **Custom** → Select specific components from matrix below

### Validation: `environment_check`

- [ ] Confirmed platform (macOS/Linux/WSL)
- [ ] Selected installation scope
- [ ] Verified LLM provider access
- [ ] Selected component bundle

**Quick Verification:**
```bash
# Single command to verify this checkpoint
uname -s | grep -E "Darwin|Linux" && echo "✅ PASS" || echo "❌ FAIL"
```

---

<!-- /ANCHOR:environment-detection -->
<!-- ANCHOR:version-compatibility-resources -->
## 6. VERSION COMPATIBILITY & RESOURCES

### 6.1 Version Compatibility Matrix

| OpenCode | Node.js | Python | Key Components                 |
| -------- | ------- | ------ | ------------------------------ |
| 25.x+    | 18-22   | 3.10+  | All MCP servers, native skills |
| 24.x     | 18-20   | 3.10+  | Most MCP servers               |
| 23.x     | 18-20   | 3.9+   | Basic MCP servers only         |

**Notes:**
- Node.js 22+ recommended for best performance
- Python 3.12 recommended for Sequential Thinking
- Spec Kit Memory local embeddings resolve automatically through the active provider profile.

### 6.2 Resource Requirements

| Bundle   | RAM  | Disk | Network  | Components                                |
| -------- | ---- | ---- | -------- | ----------------------------------------- |
| Minimal  | 4GB  | 2GB  | Optional | Code Mode + Spec Kit Memory               |
| Standard | 8GB  | 5GB  | Required | + Sequential Thinking                     |
| Full     | 16GB | 10GB | Required | All + Chrome DevTools CLI                 |

**Disk breakdown:**
- MCP servers: ~500MB
- HF Local fallback model (nomic-embed-text-v1.5, ONNX q8): ~140MB (downloaded only if the HF Local fallback is used)
- Spec Kit Memory database: ~50MB typical (grows with rows)

**Quick Verification:**
```bash
uname -s | grep -E "Darwin|Linux" && echo "✅ PASS" || echo "❌ FAIL"
```

---

<!-- /ANCHOR:version-compatibility-resources -->
<!-- ANCHOR:component-matrix -->
## 7. COMPONENT MATRIX

### 7.1 Component Overview

| Component                          | Type       | Purpose                                                                    | Dependencies                            |
| ---------------------------------- | ---------- | -------------------------------------------------------------------------- | --------------------------------------- |
| Code Mode                          | MCP Server | External tool orchestration (GitHub, your CMS, etc.)                       | Node.js 18+                             |
| Spec Kit Memory (`mk-spec-memory`) | MCP Server | Conversation context preservation                                          | Node.js 20.11+                          |
| Skill Advisor (`mk_skill_advisor`) | MCP Server | Native advisor_recommend + skill_graph_* (8 tools)                         | Node.js 20.11+                          |
| System Code Graph (`mk_code_index`)| MCP Server | Structural AST + blast-radius + neighborhood context (8 tools)             | Node.js 20.11+                          |
| Sequential Thinking                | MCP Server | Complex reasoning chains                                                    | npx (Node.js 18+)                       |
| Native Skills                      | Built-in   | Skill discovery from .opencode/skills/                                      | None (OpenCode v1.0.190+)               |
| Chrome DevTools CLI                | CLI Tool   | Browser debugging & automation                                              | Node.js 18+                             |
| Antigravity Auth                   | Plugin     | Google OAuth for Claude                                                     | Node.js 18+                             |
| OpenAI Codex Auth                  | Plugin     | ChatGPT OAuth                                                               | Node.js 18+                             |

### 7.2 Dependency Graph

```
                    ┌─────────────────────────────────────────┐
                    │           PREREQUISITES                 │
                    │         Node.js 18+ │ Python 3.10+      │
                    └─────────────────────────────────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          ▼                            ▼                            ▼
    ┌──────────┐                ┌───────────┐                ┌───────────┐
    │  Local   │                │    npm    │                │    uv     │
    │Embeddings│                │  (global) │                │  (Python) │
    └────┬─────┘                └─────┬─────┘                └─────┬─────┘
         │                            │                            │
         ▼                            ▼                            ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                     5 NATIVE MCP SERVERS                            │
    │                   (configured in opencode.json)                      │
    └─────────────────────────────────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼──────────────────┐
         ▼                             ▼                  ▼
   ┌───────────┐               ┌───────────┐       ┌───────────┐
   │   Code    │               │ Semantic  │       │Sequential │
   │   Mode    │               │  Memory   │       │ Thinking  │
   └─────┬─────┘               └───────────┘       └───────────┘
         │
         ▼
   ┌───────────────────────────────────┐
   │    EXTERNAL TOOLS (via Code Mode)     │
   │      (.utcp_config.json)              │
   │  GitHub, your CMS...                  │
   └───────────────────────────────────┘

   NATIVE SKILLS: auto-discovered from .opencode/skills/*/SKILL.md
   OPTIONAL: Chrome DevTools CLI (bdg), Gemini CLI, Auth Plugins
```

### 7.3 Installation Bundles

**Full Bundle** (all components):
```
Prerequisites → Local Embeddings → Code Mode → Spec Kit Memory →
Skill Advisor → System Code Graph →
Sequential Thinking → Chrome DevTools CLI →
Antigravity Auth → OpenAI Codex Auth
```

**Minimal Bundle** (essential only):
```
Prerequisites → Code Mode → Spec Kit Memory
```

> **Note:** `mk_code_index` (System Code Graph) is NOT in the Minimal bundle.
> Its 5 `SPECKIT_CODE_GRAPH_INDEX_*` flags default to `false` so end users get
> a quiet, low-disk install — maintainers opt in via `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true`
> in `.env.local` (see the skill-level INSTALL_GUIDE.md).

**Custom Bundle** - Select from:
- [ ] Code Mode (foundation for external tools)
- [ ] Spec Kit Memory (context preservation)
- [ ] Skill Advisor (native advisor_recommend + skill_graph_* — 8 tools)
- [ ] System Code Graph (structural AST + blast-radius + 8 graph tools; default off for end users)
- [ ] Sequential Thinking (complex reasoning)
- [ ] Chrome DevTools CLI (browser debugging)
- [ ] Antigravity Auth (Google OAuth)
- [ ] OpenAI Codex Auth (ChatGPT OAuth)

**Note:** Native Skills are built-in to OpenCode v1.0.190+ and require no installation. Skills are auto-discovered from `.opencode/skills/*/SKILL.md`.

---

<!-- /ANCHOR:component-matrix -->
<!-- ANCHOR:phase-1-prerequisites -->
## 8. PHASE 1: PREREQUISITES

> **Skip Check:** Run `node -v && python3 -V`. If both return versions, skip to Phase 2.

### 8.1 Node.js 18+

**Check:** `node -v` → If v18+ shown, skip to 8.2

**Install if missing:**

<details>
<summary>macOS</summary>

```bash
# Using Homebrew
brew install node@20

# Or using nvm (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```
</details>

<details>
<summary>Linux (Ubuntu/Debian)</summary>

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
</details>

<details>
<summary>Windows WSL</summary>

```bash
# In WSL terminal
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
</details>

### 8.2 Python 3.10+ (for Sequential Thinking)

**Check version:**
```bash
python3 --version  # Should be 3.10.0 or higher
```

**Install if needed:**

<details>
<summary>macOS</summary>

```bash
brew install python@3.12
```
</details>

<details>
<summary>Linux (Ubuntu/Debian)</summary>

```bash
sudo apt update
sudo apt install python3.12 python3.12-venv
```
</details>

### Validation: `prerequisites_check`

- [ ] Node.js version is 18.x or higher
- [ ] Python version is 3.10.x or higher

**Quick Verification:**
```bash
node --version | grep -E "^v(1[89]|2[0-9])" && python3 --version | grep -E "3\.(1[0-9]|[2-9][0-9])" && echo "✅ PASS" || echo "❌ FAIL"
```

---

<!-- /ANCHOR:phase-1-prerequisites -->
<!-- ANCHOR:phase-2-local-embeddings -->
## 9. PHASE 2: LOCAL EMBEDDINGS

Spec Kit Memory resolves the active local embedding profile automatically. The HF Local ONNX profile runs on Node.js without external services. When an Ollama daemon is reachable on `localhost:11434`, the cascade can promote to Ollama.

No separate local model service is required for Memory MCP embeddings. Continue to Phase 3 for MCP server setup.

---

<!-- /ANCHOR:phase-2-local-embeddings -->
<!-- ANCHOR:phase-3-mcp-servers -->
## 10. PHASE 3: MCP SERVERS

> **Skip Check:** Run `grep -q '"code_mode"' opencode.json && grep -q '"mk-spec-memory"' opencode.json && echo "✅ All configured"`. If all configured, skip to Phase 4.

### Installation Order (Important!)

1. **Code Mode** (foundation, install FIRST)
2. Spec Kit Memory (context preservation, **now supports multiple embedding providers**)
3. Sequential Thinking (complex reasoning)

---

### 10.1 Code Mode (Foundation)

Code Mode provides TypeScript execution environment for all external MCP tools.

> **Detailed Guide:** See [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) for comprehensive configuration and provider setup.

**Check:** `npx utcp-mcp --help >/dev/null 2>&1 && echo "Installed"` → If "Installed" shown, skip to config

**Install if missing:**
```bash
# Global install for CLI access
npm install -g utcp-mcp
```

**Configure in `opencode.json`:**
```json
{
  "mcp": {
    "code_mode": {
      "command": "npx",
      "args": ["utcp-mcp"],
      "env": {}
    }
  }
}
```

**Create `.utcp_config.json` in project root:**
```json
{
  "manuals": []
}
```

**Code Mode Providers (External Tools):**

Code Mode enables access to external MCP tools. Each provider has its own detailed install guide:

| Provider | Tools | Install Guide |
|----------|-------|---------------|
| **Chrome DevTools** | 26 | [MCP - Chrome Dev Tools.md](./MCP%20-%20Chrome%20Dev%20Tools.md) - Browser debugging (MCP mode) |
| **GitHub** | 26 | [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) - Repository operations, issues, PRs |
| **Your CMS** (e.g., a CMS-vendor MCP server) | varies | [MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md) - CMS management, site operations |

> **Note**: All Code Mode providers are configured in `.utcp_config.json`, NOT `opencode.json`. See each provider's install guide for configuration details.

### Validation: `code_mode_check`

- [ ] npx utcp-mcp responds to --help
- [ ] .utcp_config.json exists in project root

**Quick Verification:**
```bash
npx utcp-mcp --help >/dev/null 2>&1 && test -f .utcp_config.json && echo "✅ PASS" || echo "❌ FAIL"
```

---

### 10.2 Spec Kit Memory (Context Preservation)

Spec Kit Memory provides conversation context preservation with vector search.

> **Detailed Guide:** See [MCP - Spec Kit Memory.md](./MCP%20-%20Spec%20Kit%20Memory.md) for comprehensive configuration and troubleshooting.

**V12.0: Multiple Embedding Providers**

Spec Kit Memory now supports four providers in cascade:

| Provider | When to use | Dimension | Requirements |
|----------|-------------|-----------|------------|
| **Ollama** | Local default (daemon) | 768 | Ollama on `localhost:11434` |
| **HF Local** | Local fallback, Node.js only | 768 | Node.js only |
| **OpenAI** | Cloud opt-in | 1536/3072 | `OPENAI_API_KEY` |
| **Voyage** | Cloud opt-in | 1024 | `VOYAGE_API_KEY` |

**Default provider:** `auto`. The active default is **Ollama** when its local daemon is reachable; otherwise the cascade falls back to local **HF Local** (pure-Node), then to opt-in cloud. Cloud (OpenAI/Voyage) is never auto-selected silently — it requires an explicit key or `EMBEDDINGS_PROVIDER`.

**Provider selection (local-first cascade order when `EMBEDDINGS_PROVIDER=auto` or unset):**
1. Explicit `EMBEDDINGS_PROVIDER` env var (if set and not `auto`)
2. **Ollama** (default) if the local daemon is reachable on `localhost:11434`
3. **HF Local** (pure-Node local fallback) when Ollama is unavailable
4. **OpenAI** when `OPENAI_API_KEY` is set (cloud, opt-in)
5. **Voyage** when `VOYAGE_API_KEY` is set (cloud, opt-in)
- Manual override: `export EMBEDDINGS_PROVIDER=ollama|hf-local|voyage|openai|auto`

**Location:** Bundled in project at `.opencode/skills/system-spec-kit/`

**Configure in `opencode.json`:**
```json
{
  "mcp": {
    "mk-spec-memory": {
      "command": "node",
      "args": [".opencode/bin/mk-spec-memory-launcher.cjs"],
      "env": {
        "EMBEDDINGS_PROVIDER": "auto"
      }
    }
  }
}
```

**Optional environment variables:**
```bash
# Provider selection (ollama|hf-local|voyage|openai|auto)
export EMBEDDINGS_PROVIDER=auto  # Default: auto-cascade provider selection

# Voyage config (cloud opt-in)
export VOYAGE_API_KEY=pa-...
export VOYAGE_EMBEDDINGS_MODEL=voyage-4  # Default

# OpenAI config (if using OpenAI)
export OPENAI_API_KEY=sk-...
export OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small  # Default

# HF Local config (pure-Node local fallback provider; nomic-only menu)
export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5  # Default
export HF_EMBEDDINGS_DTYPE=q8  # Default (also: fp32, fp16, q4, int8, uint8, bnb4)

# Ollama config (local daemon opt-in)
export OLLAMA_EMBEDDINGS_MODEL=nomic-embed-text-v1.5  # Default

# Database directory (optional - default: .opencode/skills/system-spec-kit/mcp_server/database/)
export MEMORY_DB_DIR=/path/to/database
```

**Note on per-profile DB:**
Each provider+model+dimension combination uses its own SQLite database. This prevents "dimension mismatch" errors and allows switching providers without migrations.

**Initialize database:**
```bash
# The database is created automatically on first run
# Verify the directory exists
ls -la .opencode/skills/system-spec-kit/mcp_server/database/
```

### Validation: `mk_spec_memory_check`

- [ ] Context server JS file exists
- [ ] Database directory exists (or will be created)
- [ ] Embeddings provider loads on first run (auto-cascade: ollama (default, if reachable) -> hf-local (local fallback) -> `OPENAI_API_KEY` -> `VOYAGE_API_KEY`)

**Quick Verification:**
```bash
test -f .opencode/bin/mk-spec-memory-launcher.cjs && grep -q 'mk-spec-memory-launcher' opencode.json && echo "✅ PASS" || echo "❌ FAIL"
```

**Verify active provider:**
Use the `memory_health` tool after starting OpenCode to see which provider is active:
```json
{
  "embeddingProvider": {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "dimension": 1536,
    "healthy": true
  }
}
```

---

### 10.3 Sequential Thinking (Complex Reasoning)

Sequential Thinking provides structured reasoning chains for complex problems.

> **Detailed Guide:** See [MCP - Sequential Thinking.md](./MCP%20-%20Sequential%20Thinking.md) for comprehensive configuration and usage.

**Configure in `opencode.json`:**
```json
{
  "mcp": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    }
  }
}
```

### Validation: `sequential_thinking_check`

- [ ] npx can download and run the package
- [ ] Configuration added to opencode.json

**Quick Verification:**
```bash
grep -q '"sequential_thinking"' opencode.json && echo "✅ PASS" || echo "❌ FAIL"
```

---

### 10.4 System Code Graph (`mk_code_index` — Structural Code Intelligence)

The standalone `mk_code_index` MCP server registers 8 tools for structural AST indexing, blast-radius analysis, neighborhood context, query classification and change detection (`code_graph_scan/query/context/status/verify/apply/classify_query_intent`, `detect_changes`).

> **Detailed Guide:** See [system-code-graph/INSTALL_GUIDE.md](../skills/system-code-graph/INSTALL_GUIDE.md) for full installation, configuration, verification, and troubleshooting.
> **Runtime Diagnostics:** See [SET-UP - Code Graph.md](./SET-UP%20-%20Code%20Graph.md) for `/doctor code-graph` post-install audit.

**Location:** Bundled in this repository at `.opencode/skills/system-code-graph/`.

**Check:**
```bash
test -f .opencode/skills/system-code-graph/mcp_server/dist/index.js && echo "Installed" || echo "Needs build"
```

**Install if missing:**
```bash
npm --prefix .opencode/skills/system-code-graph install
npm --prefix .opencode/skills/system-code-graph run clean
npm --prefix .opencode/skills/system-code-graph run build
```

**Configure in `opencode.json`:**
```json
{
  "mcp": {
    "mk_code_index": {
      "type": "local",
      "command": ["node", ".opencode/bin/mk-code-index-launcher.cjs"],
      "environment": {
        "_NOTE_1_DB": "Database lives at .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite by default; SPECKIT_CODE_GRAPH_DB_DIR overrides.",
        "_NOTE_2_TOOLS": "Registers 8 tools: code_graph_scan/query/context/status/verify/apply/classify_query_intent, detect_changes. MCP namespace: mcp__mk_code_index__*",
        "SPECKIT_CODE_GRAPH_INDEX_SKILLS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_AGENTS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_COMMANDS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_SPECS": "false",
        "SPECKIT_CODE_GRAPH_INDEX_PLUGINS": "false"
      }
    }
  }
}
```

**Maintainer-mode toggle:** End-user defaults keep all 5 `SPECKIT_CODE_GRAPH_INDEX_*` flags `false` so the index stays small. Maintainers who want full coverage set `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` in `.env.local` (gitignored) and the launcher forces all 5 flags to `true` on startup.

### Validation: `mk_code_index_check`

- [ ] Launcher exists: `.opencode/bin/mk-code-index-launcher.cjs`
- [ ] Built entry exists: `.opencode/skills/system-code-graph/mcp_server/dist/index.js`
- [ ] Configuration added to opencode.json (key: `mk_code_index`)

**Quick Verification:**
```bash
test -f .opencode/bin/mk-code-index-launcher.cjs && \
  test -f .opencode/skills/system-code-graph/mcp_server/dist/index.js && \
  grep -q '"mk_code_index"' opencode.json && \
  echo "✅ PASS" || echo "❌ FAIL"
```

---

### 10.5 Skill Advisor (`mk_skill_advisor` — Native Recommendation)

The standalone `mk_skill_advisor` MCP server registers 8 tools (`advisor_recommend/rebuild/status/validate`, `skill_graph_scan/query/status/validate`) for prompt-time skill recommendation and skill-graph queries.

> **Detailed Guide:** See [system-skill-advisor/INSTALL_GUIDE.md](../skills/system-skill-advisor/INSTALL_GUIDE.md) for full installation, configuration, rollback, and operator notes.
> **Runtime Tuning:** See [SET-UP - Skill Advisor.md](./SET-UP%20-%20Skill%20Advisor.md) for post-install adjustments.

**Location:** Bundled in this repository at `.opencode/skills/system-skill-advisor/`.

**Check:**
```bash
test -f .opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js && echo "Installed" || echo "Needs build"
```

**Install if missing:**
```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server install
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

> **Build pipeline note:** `npm run build` builds `@spec-kit/shared`, compiles advisor hooks and MCP server code, then copies `data/*.json` into `dist/mcp_server/data`. Use `bash .opencode/scripts/copy-skill-advisor-dist-data.sh` only as a manual repair helper when dist data is missing or stale.

**Configure in `opencode.json`:**
```json
{
  "mcp": {
    "mk_skill_advisor": {
      "type": "local",
      "command": ["node", ".opencode/bin/mk-skill-advisor-launcher.cjs"],
      "environment": {
        "_NOTE_1_DB": "Database lives at .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite by default; MK_SKILL_ADVISOR_DB_DIR overrides.",
        "_NOTE_2_TOOLS": "Registers 8 tools: advisor_recommend/rebuild/status/validate plus skill_graph_scan/query/status/validate. MCP namespace: mcp__mk_skill_advisor__*",
        "MK_SKILL_ADVISOR_DB_DIR": ".opencode/skills/system-skill-advisor/mcp_server/database",
        "SPECKIT_ADVISOR_SHADOW_MODE": "0",
        "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED": "0"
      }
    }
  }
}
```

### Validation: `mk_skill_advisor_check`

- [ ] Launcher exists: `.opencode/bin/mk-skill-advisor-launcher.cjs`
- [ ] Built entry exists: `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js`
- [ ] Configuration added to opencode.json (key: `mk_skill_advisor`)

**Quick Verification:**
```bash
test -f .opencode/bin/mk-skill-advisor-launcher.cjs && \
  grep -q '"mk_skill_advisor"' opencode.json && \
  echo "✅ PASS" || echo "❌ FAIL"
```

---

### 10.6 Chrome DevTools CLI (Optional)

Chrome DevTools provides browser automation and debugging via CLI.

**Install:**
```bash
npm install -g browser-debugger-cli@alpha
```

**Usage (CLI-first approach):**
```bash
# List available commands
bdg --list

# Describe a specific command
bdg --describe screenshot

# Take screenshot
bdg screenshot --url https://example.com --output screenshot.png
```

### Validation: `chrome_devtools_check`

- [ ] bdg command responds to --list
- [ ] bdg --version shows version number

**Quick Verification:**
```bash
bdg --version >/dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"
```

---

### Phase 3 Complete Validation: `mcp_servers_check`

- [ ] Code Mode: npx utcp-mcp --version responds
- [ ] Spec Kit Memory (`mk-spec-memory`): configured in opencode.json
- [ ] Skill Advisor (`mk_skill_advisor`): configured in opencode.json
- [ ] System Code Graph (`mk_code_index`): configured in opencode.json
- [ ] Sequential Thinking: configured in opencode.json
- [ ] (Optional) Chrome DevTools: bdg --version responds

**Quick Verification:**
```bash
grep -q '"code_mode"' opencode.json && \
  grep -q '"mk-spec-memory"' opencode.json && \
  grep -q '"mk_skill_advisor"' opencode.json && \
  grep -q '"mk_code_index"' opencode.json && \
  grep -q '"sequential_thinking"' opencode.json && \
  echo "✅ PASS" || echo "❌ FAIL"
```

---

<!-- /ANCHOR:phase-3-mcp-servers -->
<!-- ANCHOR:phase-4-plugins -->
## 11. PHASE 4: PLUGINS

### 11.1 Native Skills (Built-in)

OpenCode v1.0.190+ has **native skill support** built-in. No plugin installation required.

Skills are automatically discovered from:
- `.opencode/skills/<name>/SKILL.md` (project-level)
- `~/.opencode/skills/<name>/SKILL.md` (global)
- `.claude/skills/<name>/SKILL.md` (Claude-compatible)

**Current Skills:**
| Skill                      | Version    | Purpose                                              |
| -------------------------- | ---------- | ---------------------------------------------------- |
| mcp-code-mode        | v1.0.7.0   | External tool orchestration                          |
| system-spec-kit      | v2.2.26.0  | Spec folder + template system + context preservation |
| mcp-chrome-devtools  | v1.0.7.0   | Browser debugging                                    |
| cli-codex            | v1.2.0     | OpenAI Codex CLI orchestration for code and research |
| cli-claude-code      | v1.0.0     | Claude Code CLI orchestration                        |
| sk-code  | v1.1.0.0   | Stack-aware code workflow + quality standard (customizable per project) |
| sk-code-review      | v1.2.0.0   | Findings-first baseline code review standards        |
| sk-doc               | v1.1.2.0   | Unified markdown and skill management                |
| sk-git               | v1.1.0.0   | Git workflow orchestrator                            |
| sk-prompt   | v1.2.0.0   | Prompt engineering frameworks and scoring            |

**How it works:**
- OpenCode scans skill folders on startup
- Skills are surfaced as `skills_*` functions (e.g., `skills_mcp_code_mode`)
- Agents read `SKILL.md` files directly when a task matches

**No configuration needed.** Skills in `.opencode/skills/` are automatically available.

### Validation: `native_skills_check`

- [ ] Skills directory exists
- [ ] At least one SKILL.md file present
- [ ] SKILL.md has required frontmatter (name, description)

**Quick Verification:**
```bash
test -d .opencode/skills && ls .opencode/skills/*/SKILL.md >/dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"
```

---

### 11.2 Antigravity Auth (Google OAuth)

Enables Google OAuth authentication for Claude.

**Configure in `opencode.json`:**
```json
{
  "plugins": [
    "opencode-antigravity-auth@1.2.2"
  ]
}
```

**Usage:**
- Plugin activates automatically when OpenCode starts
- Follow OAuth prompts in terminal when authentication is needed

---

### 11.3 OpenAI Codex Auth (ChatGPT OAuth)

Enables ChatGPT OAuth authentication for OpenAI models.

**Configure in `opencode.json`:**
```json
{
  "plugins": [
    "opencode-openai-codex-auth@4.1.1"
  ]
}
```

**Environment variables (optional):**
```bash
export OPENAI_API_KEY="your-api-key"
```

---

### Phase 4 Complete Validation: `plugins_check`

- [ ] Skills directory exists and contains skills
- [ ] (Optional) Auth plugins configured in opencode.json

**Quick Verification:**
```bash
test -d .opencode/skills && [ $(ls -1 .opencode/skills | wc -l) -ge 1 ] && echo "✅ PASS" || echo "❌ FAIL"
```

---

<!-- /ANCHOR:phase-4-plugins -->
<!-- ANCHOR:configuration-templates -->
## 12. CONFIGURATION TEMPLATES

### 12.1 Complete `opencode.json` (Full Bundle)

```json
{
  "$schema": "https://opencode.ai/config.schema.json",
  "mcp": {
    "code_mode": {
      "command": "npx",
      "args": ["utcp-mcp"],
      "env": {}
    },
    "mk-spec-memory": {
      "command": "node",
      "args": [".opencode/bin/mk-spec-memory-launcher.cjs"]
    },
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    }
  },
  "plugins": [
    "opencode-antigravity-auth@1.2.2",
    "opencode-openai-codex-auth@4.1.1"
  ]
}
```

### 12.2 Complete `.utcp_config.json`

```json
{
  "manuals": []
}
```

**Note:** External tools (GitHub, your CMS, etc.) are added to manuals array as needed. See Code Mode skill documentation for configuration examples.

### 12.3 Minimal Bundle Configuration

**`opencode.json`:**
```json
{
  "$schema": "https://opencode.ai/config.schema.json",
  "mcp": {
    "code_mode": {
      "command": "npx",
      "args": ["utcp-mcp"],
      "env": {}
    },
    "mk-spec-memory": {
      "command": "node",
      "args": [".opencode/bin/mk-spec-memory-launcher.cjs"]
    }
  },
  "plugins": []
}
```

**`.utcp_config.json`:**
```json
{
  "manuals": []
}
```

---

<!-- /ANCHOR:configuration-templates -->
<!-- ANCHOR:final-verification -->
## 13. FINAL VERIFICATION

### Checklist

- [ ] Prerequisites: Node.js 18+, Python 3.10+, uv
- [ ] All native MCP servers configured in opencode.json
- [ ] Skills directory exists with native skills
- [ ] Configuration files exist and are valid JSON

### Quick Verification

```bash
# Full verification one-liner
node --version | grep -E "^v(1[89]|2[0-9])" && \
python3 --version | grep -E "3\.(1[0-9]|[2-9][0-9])" && \
test -f opencode.json && \
test -d .opencode/skills && \
echo "✅ INSTALLATION COMPLETE" || echo "❌ VERIFICATION FAILED"
```

### Test Commands

```bash
npx utcp-mcp --list-tools          # Code Mode
ls .opencode/skills/                 # Skills
cat opencode.json | jq '.mcp | keys'  # MCP servers
```

### Run `/doctor` for end-to-end health check (recommended)

After the static checks above pass, run the interactive doctor surface to verify every subsystem ends up in a healthy state:

```text
/doctor                              # Interactive menu — pick a subsystem or "Update everything to match latest release"
/doctor:update                       # Full sweep across every database (8-25 min)
/doctor:mcp debug                    # MCP-infra diagnostic only (~30s)
```

- `/doctor` opens an 11-option menu. **Option 1** is "Update everything to match latest spec-kit release" — the right pick after a fresh install (runs `/doctor:update --migrate`).
- `/doctor:update` rebuilds every database in dependency-safe order with snapshots + auto-rollback. Use it after upgrades or large packet moves.
- `/doctor:mcp debug` checks the native MCP servers (Spec Kit Memory, Skill Advisor, System Code Graph, Code Mode, Sequential Thinking) and offers guided repair with `--fix`.

Full reference: `.opencode/commands/doctor/speckit.md` + `.opencode/commands/doctor/_routes.yaml`. Canonical subsystem targets: memory, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget.

---

<!-- /ANCHOR:final-verification -->
<!-- ANCHOR:disaster-recovery -->
## 14. DISASTER RECOVERY

Emergency procedures for backup, recovery and clean uninstallation of OpenCode components. Use this section when things go wrong or when performing maintenance.

### Quick Reference

| Problem                    | Solution         | Section                      |
| -------------------------- | ---------------- | ---------------------------- |
| **Want to start fresh**    | Clean Uninstall  | [14.2](#142-uninstall-commands) |
| **Installation failed**    | Rollback         | [14.3](#143-rollback)        |
| **MCP server stuck**       | Kill processes   | [14.4](#144-emergency-recovery-commands) |
| **Database corrupted**     | Rebuild database | [14.4](#144-emergency-recovery-commands) |
| **Not sure what's broken** | Run health check | [14.5](#145-health-check)    |
| **About to make changes**  | Backup first     | [14.1](#141-backup--restore) |

---

### 14.1 Backup & Restore

**Quick Commands:**

```bash
# Backup
BACKUP="$HOME/.opencode-backup-$(date +%Y%m%d-%H%M%S)" && mkdir -p "$BACKUP" && cp opencode.json .utcp_config.json "$BACKUP/" 2>/dev/null && cp -r .opencode/skills/system-spec-kit/mcp_server/database "$BACKUP/" 2>/dev/null && echo "✅ Backed up to $BACKUP"

# List backups
ls -lhd ~/.opencode-backup-* 2>/dev/null || echo "No backups found"

# Restore (replace BACKUP path)
BACKUP="$HOME/.opencode-backup-YYYYMMDD-HHMMSS" && cp "$BACKUP/opencode.json" "$BACKUP/.utcp_config.json" ./ 2>/dev/null && cp -r "$BACKUP/database" .opencode/skills/system-spec-kit/ 2>/dev/null && echo "✅ Restored"
```

---

### 14.2 Uninstall Commands

| Component                | Uninstall Command                                      | Notes                                                |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| **Code Mode**            | `npm uninstall -g utcp-mcp`                            | Remove from opencode.json + delete .utcp_config.json |
| **Chrome DevTools CLI**  | `npm uninstall -g browser-debugger-cli`                |                                                      |
| **Spec Kit Memory**      | `rm .opencode/skills/system-spec-kit/mcp_server/database/*.sqlite` | Database will be recreated             |
| **Sequential Thinking**  | Remove from `opencode.json`                            | No files to delete                                   |
| **Skills**               | `rm -rf .opencode/skills/<skill-name>/`                 | Remove specific skill folder                         |
| **All Skills**           | `rm -rf .opencode/skills/`                              | Removes all skills                                   |

**To remove MCP server:** Edit `opencode.json` and delete the corresponding entry from the `mcp` object.

---

### 14.3 Rollback

```bash
# Quick rollback to latest backup
BACKUP=$(ls -td ~/.opencode-backup-* 2>/dev/null | head -1) && [ -n "$BACKUP" ] && cp "$BACKUP/opencode.json" "$BACKUP/.utcp_config.json" ./ 2>/dev/null && echo "✅ Rolled back to $BACKUP" || echo "❌ No backup found"
```

---

### 14.4 Emergency Recovery Commands

| Symptom                      | Recovery Command                                           |
| ---------------------------- | ---------------------------------------------------------- |
| MCP server hangs             | `pkill -f "server-name" && opencode`                       |
| Database corruption (Memory) | `rm -rf .opencode/skills/system-spec-kit/mcp_server/database/` |
| Config invalid JSON          | Restore from backup or regenerate from Section 12 templates |
| npm packages broken          | `npm cache clean --force && npm install -g <package>`      |
| Python/uv issues             | `uv cache clean && uv tool install <tool> --force`         |
| Skills not loading           | Restart OpenCode. Verify SKILL.md frontmatter              |
| All else fails               | Complete clean uninstall (14.2) then reinstall             |

---

### 14.5 Health Check

```bash
# Quick health check one-liner
node -v && python3 -V && [ -f opencode.json ] && [ -d .opencode/skills ] && echo "✅ Core components OK" || echo "❌ Check failed"

# Detailed checks
ls .opencode/skills/           # Skills installed
cat opencode.json | jq '.mcp | keys'  # MCP servers configured
```

---

### 14.6 Troubleshooting Matrix

| Symptom                       | Likely Cause        | Solution                        |
| ----------------------------- | ------------------- | ------------------------------- |
| `Error: ENOENT opencode.json` | Config missing      | Restore from backup or recreate |
| `MCP server timeout`          | Process stuck       | Kill processes (14.4)           |
| `Database locked`             | Multiple processes  | Kill processes, restart         |
| `SQLITE_CORRUPT`              | Database corruption | Delete and rebuild (14.4)       |
| `JSON parse error`            | Invalid config      | Validate with `jq`, fix syntax  |
| `Port already in use`         | Port conflict       | Kill conflicting process        |
| `Permission denied`           | File permissions    | Check ownership, run `chmod`    |
| `Memory not found`            | DB not indexed      | Run `memory_index_scan()`       |

---

### 14.7 Best Practices

1. **Before changes:** Run backup command (14.1)
2. **After failure:** Run rollback (14.3), restart OpenCode
3. **Monthly:** Clean old backups: `ls -td ~/.opencode-backup-* | tail -n +6 | xargs rm -rf`

---

<!-- /ANCHOR:disaster-recovery -->
<!-- ANCHOR:post-installation-configuration -->
## 15. POST-INSTALLATION CONFIGURATION

After installing OpenCode components, customize the AI agent configuration for your project.

> **🎯 This is a public repo template.** Of the shipped skills, `sk-code` is the one that carries stack-specific patterns — start there when adapting to your project. The other shipped skills (`sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`, the deep-research/deep-review loops, the `cli-*` orchestrators) are codebase-agnostic out of the box and work for any project regardless of frontend stack, animation library, CMS, or backend language. Many teams will also add their own skills on top of the shipped set — that's expected. See §15.5 below for the customization map.

### 15.1 AGENTS.md Customization

The `AGENTS (Universal).md` file is a template for AI agent behavior. Customize it for your project:

1. **Rename the file**: `AGENTS (Universal).md` → `AGENTS.md`
2. **Choose project type**: Front-end, Back-end, or Full-stack
3. **Align with installed tools**: Update tool references to match your MCP configuration
4. **Align with available skills**: Update skills table to match `.opencode/skills/`

**Quick customization for project types:**

| Project Type | Primary Tools                   | Primary Skills                           | Remove/De-emphasize           |
| ------------ | ------------------------------- | ---------------------------------------- | ----------------------------- |
| Front-end    | Chrome DevTools, your CMS MCP | mcp-chrome-devtools, sk-code | Database tools, API patterns  |
| Back-end     | API testing, Database tools     | sk-code               | Browser tools, your CMS MCP |
| Full-stack   | All tools                       | All skills                               | Nothing                       |

**Detailed Guide**: [SET-UP - AGENTS.md](./SET-UP%20-%20AGENTS.md)

### 15.2 Skill Advisor Setup

The Skill Advisor (`skill_advisor.py`) powers Gate 2 in AGENTS.md, routing requests to appropriate skills:

```bash
# Verify skill advisor
python .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me write documentation"
```

If confidence > 0.8, the AI agent MUST use the recommended skill.

**Detailed Guide**: [SET-UP - Skill Advisor.md](./SET-UP%20-%20Skill%20Advisor.md)

### 15.3 Skill Creation

Create custom skills to extend AI agent capabilities:

```bash
# Initialize new skill
python .opencode/skills/sk-doc/scripts/init_skill.py my-skill --path .opencode/skills

# Validate skill
python .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/<my-skill>/
```

### 15.4 Agent System

The Agent System provides specialized AI personas with defined authorities, tool permissions and behavioral rules. Unlike skills (knowledge bundles), agents have **authority** to act and **tools** to execute.

**Available Agents (10 total):**
| Agent           | Purpose                         | Key Capability                        |
| --------------- | ------------------------------- | ------------------------------------- |
| **context**     | Context retrieval & analysis    | Exploration dispatch, memory loading  |
| **debug**       | Fresh-perspective debugging     | Systematic 4-phase root cause analysis|
| **deep-research** | Iterative research loops      | Multi-round investigation and convergence |
| **deep-review** | Iterative review loops          | Findings-first release and quality audits |
| **handover**    | Session continuation            | Context preservation, handover docs   |
| **orchestrate** | Task decomposition & delegation | Parallel delegation (up to 20 agents) |
| **review**      | Code review & quality gates     | Pattern validation, quality scoring   |
| **speckit**     | Spec folder creation            | Level 1-3+ documentation, templates  |
| **ai-council** | Multi-strategy planning         | Compare and score alternative solution paths (renamed from multi-ai-council/deep-ai-council 2026-05-21; old names retained as advisor aliases) |
| **write**       | Documentation creation          | Template-first, DQI scoring           |

**Quick Verification:**
```bash
ls .opencode/agents/*.md 2>/dev/null && echo "✅ PASS" || echo "❌ FAIL"
```

### 15.5 Customizing for Your Stack — Start with `sk-code`

This template ships with `sk-code` configured for Webflow + OpenCode + cross-stack Motion.dev. To adapt for your stack:

| Skill / Surface | Out-of-the-box | Notes |
|---|---|---|
| **`sk-code`** | 🎨 Stack-specific (the customization point) | Surface-aware code-quality patterns. Replace shipped surfaces with your own (e.g., Next.js + Tailwind + Postgres, React Native + Reanimated, Go + sqlc). |
| Every other shipped skill | ✅ Codebase-agnostic | `sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`, `mcp-code-mode`, `deep-research`, `deep-review`, `sk-prompt`, `deep-improvement`, `cli-*`, `mcp-chrome-devtools` all work for any project unmodified. |

**What "adapting `sk-code`" looks like:**
1. Replace `references/{webflow,opencode,motion_dev}/` with your stack's references (e.g., `references/nextjs/`, `references/postgres/`).
2. Replace `assets/{webflow,opencode,motion_dev}/` with your stack's assets.
3. Update `SKILL.md` §2 — `STACK_FOLDERS` Python dict + the bash detection block — to match your stack's marker files and CWD signals.
4. Update the `RESOURCE_MAP` intent → file paths to point at your renamed references/assets.
5. Bump `sk-code` version + ship a changelog. Use `assets/opencode/checklists/skill_authoring.md` as your reference.

**Adding your own skills:** the shipped set is intentionally minimal — most teams will add their own (project-specific workflows, ops runbooks, domain-specific reviewers, etc.). Drop them into `.opencode/skills/<your-skill>/` and they'll be picked up by the advisor automatically. The shipped skills above are kept agnostic so upstream updates apply cleanly to your fork.

**Detailed Guide**: [Root README §4 Customizing for Your Stack](../../README.md#customizing-for-your-stack)

---

**Post-Installation Quick Verification:**
```bash
node -v && python3 -V && [ -f opencode.json ] && [ -d .opencode/skills ] && echo "✅ Core components OK" || echo "❌ Check failed"

# Detailed checks
ls .opencode/skills/           # Skills installed
cat opencode.json | jq '.mcp | keys'  # MCP servers configured
```

---

<!-- /ANCHOR:post-installation-configuration -->
<!-- ANCHOR:whats-next -->
## 16. WHAT'S NEXT?

You have completed the installation. Here is your roadmap for getting started.

### 16.1 First Steps (Day 1)

| Step | Action                 | Command/Location                                                 |
| ---- | ---------------------- | ---------------------------------------------------------------- |
| 1    | Verify installation    | Run health check script from Section 14.5                        |
| 2    | Customize AGENTS.md    | Edit `AGENTS.md` for your project type                           |
| 3    | Test skill invocation  | `python .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "your task"`          |
| 4    | Save first memory      | Use `/memory:save` or "save context" in conversation             |

### 16.2 Common Workflows

| Workflow                 | Tools/Commands                | Example                                                   |
| ------------------------ | ----------------------------- | --------------------------------------------------------- |
| **Context Preservation** | Spec Kit Memory               | `/memory:save`, `memory_search()`                         |
| **Browser Debugging**    | Chrome DevTools CLI           | `bdg screenshot --url https://example.com`                |
| **Documentation**        | sk-doc skill | Invoke skill for doc structure                            |
| **Git Operations**       | sk-git skill           | Commit, PR creation workflows                             |
| **Implementation**       | sk-code | 3-phase implementation lifecycle                          |

### 16.3 Available Commands

| Category | Commands                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Create   | `/create:agent`, `/create:changelog`, `/create:feature-catalog`, `/create:folder_readme`, `/create:prompt`, `/create:skill`, `/create:testing-playbook` |
| Memory   | `/memory:search`, `/memory:learn`, `/memory:manage`, `/memory:save` |
| SpecKit  | `/speckit:complete`, `/deep:start-research-loop`, `/deep:start-review-loop`, `/speckit:implement`, `/speckit:plan`, `/speckit:plan --intake-only`, `/speckit:resume` |
| Utility  | `/agent_router` |

For the SpecKit chain, `/speckit:plan --intake-only` is the standalone intake entry, `/speckit:plan` and `/speckit:complete` reuse the shared intake contract in [`../skills/system-spec-kit/references/intake-contract.md`](../skills/system-spec-kit/references/intake-contract.md) when packet state still needs repair, and `/deep:start-research-loop` now anchors each run to `spec.md` through `spec_check_protocol.md`.

### 16.4 Learning Resources

| Resource      | Location                                   | Description                   |
| ------------- | ------------------------------------------ | ----------------------------- |
| OpenCode Docs | https://opencode.ai/docs                   | Official documentation        |
| Memory Skill  | `.opencode/skills/system-spec-kit/SKILL.md` | Context preservation          |
| Code Skill    | `.opencode/skills/sk-code/SKILL.md` | Frontend implementation patterns |
| Code Skill    | `.opencode/skills/sk-code/SKILL.md` | Multi-stack implementation patterns |
| Git Skill     | `.opencode/skills/sk-git/SKILL.md`   | Git workflows                 |
| AGENTS.md     | `AGENTS.md`                                | AI agent behavior reference   |

### 16.5 Next Level (Week 1)

- [ ] Configure external tools in `.utcp_config.json` (GitHub, your CMS, etc.)
- [ ] Create project-specific skills for repeated workflows
- [ ] Set up backup schedule for configurations
- [ ] Practice spec folder workflow for all file modifications

---

<!-- /ANCHOR:whats-next -->
<!-- ANCHOR:troubleshooting -->
## 17. TROUBLESHOOTING

<details>
<summary><strong>Code Mode Issues</strong></summary>

### npx utcp-mcp not found
```bash
# Reinstall globally
npm install -g utcp-mcp

# Or use local installation
npm install utcp-mcp
npx utcp-mcp
```

### Tool not appearing in Code Mode
1. Check `.utcp_config.json` syntax (valid JSON)
2. Restart OpenCode after config changes
3. Verify tool command works standalone

</details>

<details>
<summary><strong>Spec Kit Memory Issues</strong></summary>

### Database not found
```bash
# Create directory if missing
mkdir -p .opencode/skills/system-spec-kit/mcp_server/database

# Database is created on first run when OpenCode starts the MCP server
```

### Embeddings not working
1. Auto-cascade is ollama (default, if reachable) -> hf-local (local fallback) -> `OPENAI_API_KEY` -> `VOYAGE_API_KEY`
2. Clear corrupted model cache: `rm -rf .opencode/skills/system-spec-kit/mcp_server/node_modules/@huggingface/transformers/.cache`
3. Restart MCP server (model re-downloads on first use)
4. If using cloud provider: verify API key is set and `EMBEDDINGS_PROVIDER` matches

### Memory search returns empty
```bash
# Check database has content
# Find the active database file (filename encodes provider, model, dim, and dtype)
ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite
# Then query it (replace path with the file you found):
sqlite3 "$(ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite | head -n 1)" "SELECT COUNT(*) FROM memory_index;"
```

</details>

<details>
<summary><strong>Sequential Thinking Issues</strong></summary>

### Package not found
```bash
# Clear npm cache and retry
npm cache clean --force
npx -y @modelcontextprotocol/server-sequential-thinking --help
```

### Timeout errors
- Sequential thinking is resource-intensive
- Ensure adequate RAM (8GB+ recommended)
- Consider using for complex tasks only

</details>

<details>
<summary><strong>Chrome DevTools Issues</strong></summary>

### bdg command not found
```bash
# Reinstall
npm install -g browser-debugger-cli@alpha
```

### Chrome not launching
1. Ensure Chrome/Chromium is installed
2. Check for running Chrome instances
3. Try with explicit Chrome path:
```bash
bdg screenshot --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

</details>

<details>
<summary><strong>Plugin Issues</strong></summary>

### Skills not loading (Native Skills)
1. Verify skill folder exists: `ls -la .opencode/skills/`
2. Check SKILL.md frontmatter has required `name` and `description` fields
3. Ensure `name` matches folder name exactly
4. Restart OpenCode after adding skills

### Auth plugins not working
1. Check plugin version matches config
2. Restart OpenCode after adding plugin
3. Check for error messages in OpenCode output

</details>

<details>
<summary><strong>General Issues</strong></summary>

### OpenCode doesn't recognize MCP servers
1. Verify `opencode.json` syntax (valid JSON)
2. Check file is in project root
3. Restart OpenCode completely

### Configuration changes not taking effect
```bash
# Kill any running OpenCode processes
pkill -f opencode

# Clear npm cache if needed
npm cache clean --force

# Restart OpenCode
opencode
```

### Permission errors
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

</details>

<details>
<summary><strong>Automated MCP Diagnostics (Recommended)</strong></summary>

### MCP Doctor Commands

Instead of manual troubleshooting, use the built-in diagnostic commands that check all MCP servers automatically:

```bash
# Diagnose all 5 registered MCP servers across all runtimes
/doctor:mcp debug

# Auto-fix detected issues
/doctor:mcp debug --fix

# Fresh install all MCP servers from scratch
/doctor:mcp install

# Diagnose or install a single server
/doctor:mcp debug --server mk_code_index
/doctor:mcp install --server mk-spec-memory
```

The doctor commands read the install guides, check system reality, and offer guided repair. Available across OpenCode, Claude Code, Codex CLI, and Gemini CLI.

Shell script (for direct use outside AI clients):
```bash
bash .opencode/commands/doctor/scripts/mcp-doctor.sh
bash .opencode/commands/doctor/scripts/mcp-doctor.sh --json
bash .opencode/commands/doctor/scripts/mcp-doctor.sh --fix
```

</details>

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:quick-reference -->
## 18. QUICK REFERENCE

### Essential Commands

| Task                 | Command                                                     |
| -------------------- | ----------------------------------------------------------- |
| Check prerequisites  | `node -v && python3 -V`                                     |
| List skills          | `ls .opencode/skills/`                                       |
| Read skill           | `cat .opencode/skills/<skill-name>/SKILL.md`                 |
| Browser screenshot   | `bdg screenshot --url <url> --output out.png`               |
| Run health check     | `node -v && python3 -V && test -f opencode.json`            |

### File Locations

| File                        | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `opencode.json`             | OpenCode MCP server config (4 native servers) |
| `.utcp_config.json`         | Code Mode external tools config               |
| `.opencode/skills/`          | Skill definitions (16 skills)                 |
| `.opencode/agents/`          | Base agent source definitions                 |
| `.opencode/install_guides/` | Installation documentation                    |
| `~/.opencode-backup/`       | Configuration backups                         |
| `AGENTS.md`                 | AI agent behavior configuration               |

### Component Summary

| Category           | Count | Items                                                                                                                    |
| ------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| Native MCP Servers | 5     | code_mode, mk-spec-memory, mk_skill_advisor, mk_code_index, sequential_thinking                                          |
| Skills             | 15    | cli-claude-code, cli-codex, cli-opencode, mcp-chrome-devtools, mcp-code-mode, sk-code, sk-code-review, deep-research, deep-review, sk-doc, sk-git, deep-improvement, sk-prompt, system-spec-kit |
| Commands           | 22    | /create:* (7), /memory:* (6), /speckit:* (8), agent_router (1)                                                         |
| CLI Tools          | 1     | Chrome DevTools (bdg)                                                                                                    |
| Plugins            | 2     | Antigravity Auth, OpenAI Codex Auth                                                                                      |

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-documents -->
## 19. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](../../AGENTS.md) | AI agent behavior configuration and mandatory gates |
| [Spec Kit Framework](../skills/system-spec-kit/README.md) | Spec folder and memory system documentation |
| [sk-doc SKILL.md](../skills/sk-doc/SKILL.md) | Document creation standards and templates |
| [system-skill-advisor INSTALL_GUIDE.md](../skills/system-skill-advisor/INSTALL_GUIDE.md) | Standalone `mk_skill_advisor` MCP server bootstrap |
| [system-code-graph INSTALL_GUIDE.md](../skills/system-code-graph/INSTALL_GUIDE.md) | Standalone `mk_code_index` MCP server bootstrap (8 graph tools) |
| [SET-UP - Code Graph.md](./SET-UP%20-%20Code%20Graph.md) | Runtime diagnostics for `/doctor code-graph` |

### External Resources

| Resource | Description |
|----------|-------------|
| [OpenCode Docs](https://opencode.ai/docs) | Official OpenCode documentation |
| [Model Context Protocol](https://modelcontextprotocol.io) | MCP specification and standards |
<!-- /ANCHOR:related-documents -->
