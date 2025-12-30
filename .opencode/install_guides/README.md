# OpenCode Dev Environment — Installation Guide

AI-executable guide for the OpenCode dev environment. Installs 4 native MCP servers + Narsil (via Code Mode), 8 native skills, and optional CLI tools. Execute phases sequentially—each includes validation checkpoints.

---

## TABLE OF CONTENTS

0. [🤖 AI-FIRST INSTALL GUIDE](#-ai-first-install-guide)
1. [🔎 PRE-FLIGHT CHECK](#1--pre-flight-check)
2. [🔍 ENVIRONMENT DETECTION](#2--environment-detection)
3. [📋 VERSION COMPATIBILITY & RESOURCES](#3--version-compatibility--resources)
4. [🧩 COMPONENT MATRIX](#4--component-matrix)
5. [📥 PHASE 1: PREREQUISITES](#5--phase-1-prerequisites)
6. [🤖 PHASE 2: OLLAMA & MODELS](#6--phase-2-ollama--models)
7. [⚙️ PHASE 3: MCP SERVERS](#7--phase-3-mcp-servers)
8. [🔌 PHASE 4: PLUGINS](#8--phase-4-plugins)
9. [📝 CONFIGURATION TEMPLATES](#9--configuration-templates)
10. [✅ FINAL VERIFICATION](#10--final-verification)
11. [🚨 DISASTER RECOVERY](#11--disaster-recovery)
12. [⚙️ POST-INSTALLATION CONFIGURATION](#12--post-installation-configuration)
13. [🚀 WHAT'S NEXT?](#13--whats-next)
14. [🔧 TROUBLESHOOTING](#14--troubleshooting)
15. [📖 QUICK REFERENCE](#15--quick-reference)

---

## 0. 🤖 AI-FIRST INSTALL GUIDE

Copy this prompt to your AI assistant:

```
I need to install OpenCode components. Please guide me using .opencode/install_guides/README.md

My environment:
- Platform: [macOS / Linux / Windows WSL]
- LLM Provider: [Claude / GitHub Copilot / OpenAI / Gemini / Ollama]
- Install Mode: [Full / Minimal / Missing only / Custom]
- Components (if custom): [Code Mode, Narsil (via Code Mode), Spec Kit Memory, Sequential Thinking, Chrome DevTools CLI]

Start with Pre-Flight Check to detect what's already installed, then guide me through each phase.
```

---

## 1. 🔎 PRE-FLIGHT CHECK

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
printf "  │ %-23s │ %-29s │\n" "Ollama" "$(command -v ollama >/dev/null && echo '✅ Installed' || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" "nomic-embed-text" "$(ollama list 2>/dev/null | grep -q nomic && echo '✅ Pulled' || echo '❌ Not pulled')"
printf "  │ %-23s │ %-29s │\n" "Narsil (via Code Mode)" "$(grep -q 'narsil' .utcp_config.json 2>/dev/null && echo '✅ Configured' || echo '⚪ Optional')"
printf "  │ %-23s │ %-29s │\n" "Chrome DevTools (bdg)" "$(command -v bdg >/dev/null && echo '✅ Installed' || echo '⚪ Optional')"
echo "    ├─────────────────────────┼───────────────────────────────┤"
printf "  │ %-23s │ %-29s │\n" "opencode.json" "$(test -f opencode.json && echo '✅ Exists' || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" ".utcp_config.json" "$(test -f .utcp_config.json && echo '✅ Exists' || echo '❌ Missing')"
printf "  │ %-23s │ %-29s │\n" "Skills directory" "$(test -d .opencode/skill && echo '✅ '$(ls .opencode/skill 2>/dev/null | wc -l | tr -d ' ')' skills'     || echo '❌ Missing')"
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

## 2. 🔍 ENVIRONMENT DETECTION

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
- **Ollama (Local)** → Optional for local inference

> **Note:** Spec Kit Memory embeddings support multiple providers (OpenAI, HF Local, optional Ollama). HF Local works by default without additional installation. See [Section 7.3](#73-spec-kit-memory-mcp-bundled) for details.

---

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
./scripts/validate-spec.sh specs/001-feature/
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
- **Full** → All components (4 native MCP servers + Narsil via Code Mode + CLI tools + plugins)
- **Minimal** → Code Mode + Spec Kit Memory (Skills are built-in)
- **Custom** → Select specific components from matrix below

---

## 3. 📋 VERSION COMPATIBILITY & RESOURCES

### 3.1 Version Compatibility Matrix

| OpenCode | Node.js | Python | Ollama | Key Components                 |
| -------- | ------- | ------ | ------ | ------------------------------ |
| 25.x+    | 18-22   | 3.10+  | 0.3+   | All MCP servers, native skills |
| 24.x     | 18-20   | 3.10+  | 0.2+   | Most MCP servers (no Narsil)   |
| 23.x     | 18-20   | 3.9+   | 0.1+   | Basic MCP servers only         |

**Notes:**
- Node.js 22+ recommended for best performance
- Python 3.12 recommended for Sequential Thinking
- Ollama 0.3+ optional for local LLM inference

### 3.2 Resource Requirements

| Bundle   | RAM  | Disk | Network  | Components                                |
| -------- | ---- | ---- | -------- | ----------------------------------------- |
| Minimal  | 4GB  | 2GB  | Optional | Code Mode + Spec Kit Memory               |
| Standard | 8GB  | 5GB  | Required | + Narsil + Sequential Thinking            |
| Full     | 16GB | 10GB | Required | All + Ollama models + Chrome DevTools CLI |

**Disk breakdown:**
- MCP servers: ~500MB
- Ollama base: ~1GB
- nomic-embed-text model: ~300MB
- llama3.2 model (optional): ~4GB
- Spec Kit Memory database: ~50MB typical

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

❌ STOP if validation fails - clarify requirements before proceeding

---

## 4. 🧩 COMPONENT MATRIX

### 4.1 Component Overview

| Component           | Type       | Purpose                                               | Dependencies                            |
| ------------------- | ---------- | ----------------------------------------------------- | --------------------------------------- |
| Code Mode           | MCP Server | External tool orchestration (Webflow, Figma, ClickUp) | Node.js 18+                             |
| Narsil              | MCP Server | Structural analysis, security scanning, call graphs   | Via Code Mode                           |
| Spec Kit Memory     | MCP Server | Conversation context preservation                     | Node.js 18+, Ollama (optional)          |
| Sequential Thinking | MCP Server | Complex reasoning chains                              | npx (Node.js 18+)                       |
| Native Skills       | Built-in   | Skill discovery from .opencode/skill/                 | None (OpenCode v1.0.190+)               |
| Chrome DevTools CLI | CLI Tool   | Browser debugging & automation                        | Node.js 18+                             |
| Antigravity Auth    | Plugin     | Google OAuth for Claude                               | Node.js 18+                             |
| OpenAI Codex Auth   | Plugin     | ChatGPT OAuth                                         | Node.js 18+                             |

### 4.2 Dependency Graph

```
                    ┌─────────────────────────────────────────┐
                    │           PREREQUISITES                 │
                    │         Node.js 18+ │ Python 3.10+      │
                    └─────────────────────────────────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          ▼                            ▼                            ▼
    ┌──────────┐                ┌───────────┐                ┌───────────┐
    │  Ollama  │                │    npm    │                │    uv     │
    │  Models  │                │  (global) │                │  (Python) │
    └────┬─────┘                └─────┬─────┘                └─────┬─────┘
         │                            │                            │
         ▼                            ▼                            ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                     3 NATIVE MCP SERVERS                            │
    │                   (configured in opencode.json)                      │
    └─────────────────────────────────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼───────────────┐
         ▼                             ▼               ▼
   ┌───────────┐               ┌───────────┐ ┌───────────┐
   │   Code    │               │ Semantic  │ │Sequential │
   │   Mode    │               │  Memory   │ │ Thinking  │
   └─────┬─────┘               └───────────┘ └───────────┘
         │
         ▼
   ┌───────────────────────────────────┐
   │    EXTERNAL TOOLS (via Code Mode)     │
   │      (.utcp_config.json)              │
   │  Narsil, Webflow, Figma, ClickUp...   │
   └───────────────────────────────────┘

   NATIVE SKILLS: 8 skills auto-discovered from .opencode/skill/*/SKILL.md
   OPTIONAL: Chrome DevTools CLI (bdg), Auth Plugins
```

### 4.3 Installation Bundles

**Full Bundle** (all components):
```
Prerequisites → Ollama → Code Mode → Narsil (via Code Mode) → 
Spec Kit Memory → Sequential Thinking → Chrome DevTools CLI → 
Antigravity Auth → OpenAI Codex Auth
```

**Minimal Bundle** (essential only):
```
Prerequisites → Code Mode → Spec Kit Memory
```

**Custom Bundle** - Select from:
- [ ] Code Mode (foundation for external tools)
- [ ] Narsil (structural analysis, security, semantic search via Code Mode)
- [ ] Spec Kit Memory (context preservation)
- [ ] Sequential Thinking (complex reasoning)
- [ ] Chrome DevTools CLI (browser debugging)
- [ ] Antigravity Auth (Google OAuth)
- [ ] OpenAI Codex Auth (ChatGPT OAuth)

**Note:** Native Skills are built-in to OpenCode v1.0.190+ and require no installation. Skills are auto-discovered from `.opencode/skill/*/SKILL.md`.

---

## 5. 📥 PHASE 1: PREREQUISITES

> **Skip Check:** Run `node -v && python3 -V` — if both return versions, skip to Phase 2.

### 5.1 Node.js 18+

**Check:** `node -v` → If v18+ shown, skip to 5.2

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

### 5.2 Python 3.10+ (for Sequential Thinking)

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

❌ STOP if validation fails - install missing prerequisites before continuing

---

## 6. 🤖 PHASE 2: OLLAMA & MODELS (OPTIONAL)

Ollama provides local LLM inference and embeddings. **No longer required** for Spec Kit Memory.

**Since v12.0:** Spec Kit Memory supports multiple embedding backends:
- **OpenAI** (recommended if you have `OPENAI_API_KEY`) - cloud embeddings
- **HF Local** (default without API key) - local embeddings with HuggingFace Transformers
- **Ollama** (optional) - for local embeddings via Ollama

> **Skip Check:** If you prefer OpenAI or HF local, you can skip this entire phase.

### 6.1 Install Ollama (Only if you'll use Ollama for embeddings)

**Check:** `command -v ollama` → If path shown, skip to 6.2

<details>
<summary>macOS</summary>

```bash
brew install ollama
```
</details>

<details>
<summary>Linux</summary>

```bash
curl -fsSL https://ollama.com/install.sh | sh
```
</details>

### 6.2 Start Ollama Service

```bash
# Start in background
ollama serve &

# Or start as service (macOS)
brew services start ollama
```

### 6.3 Pull Required Models

```bash
# Embedding model (to use Ollama as provider)
ollama pull nomic-embed-text

# Optional: Reasoning model for local inference
ollama pull llama3.2
```

### Validation: `ollama_check`

- [ ] Ollama service is running (only if you chose Ollama)
- [ ] nomic-embed-text model is available (only if you chose Ollama)
- [ ] (Optional) llama3.2 model is available

**Quick Verification:**
```bash
# Only if you will use Ollama:
ollama list | grep -q "nomic-embed-text" && echo "✅ PASS" || echo "❌ FAIL"
```

⚠️ **Note:** Ollama is only required if you set `EMBEDDINGS_PROVIDER=ollama`. By default, the system uses local HF embeddings (without Ollama) or OpenAI if `OPENAI_API_KEY` is set.

---

## 7. ⚙️ PHASE 3: MCP SERVERS

> **Skip Check:** Run `grep -q '"code_mode"' opencode.json && grep -q '"spec_kit_memory"' opencode.json && echo "✅ All configured"` — if all configured, skip to Phase 4.

### Installation Order (Important!)

1. **Code Mode** (foundation - install FIRST)
2. Narsil (structural analysis, security, semantic search - via Code Mode)
3. Spec Kit Memory (context preservation - **now supports multiple embedding providers**)
4. Sequential Thinking (complex reasoning)

---

### 7.1 Code Mode (Foundation)

Code Mode provides TypeScript execution environment for all external MCP tools.

**Check:** `npx utcp-mcp --help >/dev/null 2>&1 && echo "Installed"` → If "Installed" shown, skip to config or 7.2

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
| **Narsil** | 76 | [MCP - Narsil.md](./MCP/MCP%20-%20Narsil.md) - Code intelligence, security scanning |
| **Figma** | 18 | [MCP - Figma.md](./MCP/MCP%20-%20Figma.md) - Design file access, image export |
| **Chrome DevTools** | 26 | [MCP - Chrome Dev Tools.md](./MCP/MCP%20-%20Chrome%20Dev%20Tools.md) - Browser debugging (MCP mode) |
| **Webflow** | 42 | Via Code Mode - CMS management, site operations |
| **ClickUp** | 21 | Via Code Mode - Task management, project tracking |
| **GitHub** | 26 | Via Code Mode - Repository operations, issues, PRs |

> **Note**: All Code Mode providers are configured in `.utcp_config.json`, NOT `opencode.json`. See each provider's install guide for configuration details.

### Validation: `code_mode_check`

- [ ] npx utcp-mcp responds to --help
- [ ] .utcp_config.json exists in project root

**Quick Verification:**
```bash
npx utcp-mcp --help >/dev/null 2>&1 && test -f .utcp_config.json && echo "✅ PASS" || echo "❌ FAIL"
```

❌ STOP if validation fails - Code Mode is required for external tools

---

### 7.2 Narsil (Structural Analysis + Security + Semantic Search)

Narsil provides deep code intelligence with **76 specialized tools** for security scanning, call graph analysis, structural queries, and neural semantic search. It is accessed via Code Mode for token efficiency.

> **Detailed Guide:** See [MCP - Narsil.md](./MCP/MCP%20-%20Narsil.md) for comprehensive installation and usage instructions.

**Core Principle:** Narsil = STRUCTURE + SECURITY + SEMANTICS (unified code intelligence)

| Feature             | Tool Count | Examples                                 |
| ------------------- | ---------- | ---------------------------------------- |
| Security Scanning   | 9          | OWASP Top 10, CWE Top 25, taint analysis |
| Call Graph Analysis | 6          | Callers, callees, function hotspots      |
| Symbol Navigation   | 7          | Find symbols, definitions, references    |
| Supply Chain        | 4          | SBOM generation, CVE checking, licenses  |
| Code Quality        | 5          | Dead code, complexity metrics            |

**Prerequisite:** Code Mode must be installed first (see 7.1).

**Configure in `.utcp_config.json`:**
```json
{
  "mcpServers": {
    "narsil": {
      "transport": "stdio",
      "command": "${NARSIL_PATH}/target/release/narsil-mcp",
      "args": ["--repos", "${workspaceFolder}", "--index-path", ".narsil-index", "--git", "--call-graph", "--persist", "--watch"]
    }
  }
}
```

**Usage via Code Mode:**
```typescript
// Get project structure
call_tool_chain({
  code: `return await narsil.narsil_get_project_structure({})`
});

// Find all functions
call_tool_chain({
  code: `return await narsil.narsil_find_symbols({ kind: "function" })`
});

// Security scan (OWASP)
call_tool_chain({
  code: `return await narsil.narsil_scan_security({ ruleset: "owasp" })`,
  timeout: 120000
});

// Call graph analysis
call_tool_chain({
  code: `return await narsil.narsil_get_call_graph({ function_name: "main" })`
});
```

### Validation: `narsil_check`

- [ ] Code Mode is installed and working
- [ ] Narsil binary exists at configured path
- [ ] `.utcp_config.json` has valid Narsil configuration
- [ ] `search_tools()` returns Narsil tools

**Quick Verification:**
```bash
# Verify Code Mode works
npx utcp-mcp --help >/dev/null 2>&1 && echo "Code Mode: PASS" || echo "Code Mode: FAIL"

# Verify Narsil config exists
grep -q "narsil-mcp" .utcp_config.json 2>/dev/null && echo "Config: PASS" || echo "Config: FAIL"
```

**AI Verification:**
Ask your assistant: "Use Code Mode to search for Narsil tools"
Expected: List of `narsil.narsil_*` tools (76 total)

**Optional: HTTP Visualization**
Narsil includes an HTTP server with React frontend for interactive graph visualization:
```bash
# Backend (port 3000)
narsil-mcp --repos . --http --http-port 3000

# Frontend (port 5173) - separate terminal
cd "${NARSIL_PATH}/frontend" && npm install && npm run dev
```
See [MCP - Narsil.md](./MCP/MCP%20-%20Narsil.md) for detailed visualization setup.

❌ STOP if validation fails - ensure Code Mode is installed and Narsil is configured in `.utcp_config.json`

---

### 7.3 Spec Kit Memory (Context Preservation)

Spec Kit Memory provides conversation context preservation with vector search.

**V12.0: Multiple Embedding Providers**

Spec Kit Memory now supports three embedding backends:

| Provider | When to use | Dimension | Requirements |
|----------|-------------|-----------|------------|
| **OpenAI** | API key available, cloud preference | 1536/3072 | `OPENAI_API_KEY` |
| **HF Local** | No API key, privacy/offline | 768 | Node.js only (default) |
| **Ollama** | Ollama local preference | 768 | Ollama + nomic model |

**Automatic provider configuration:**
- If `OPENAI_API_KEY` exists: uses OpenAI (auto-detected)
- If not: uses HF Local (fallback, no additional installation)
- Manual override: `export EMBEDDINGS_PROVIDER=hf-local` (forces local even with key)

**Location:** Bundled in project at `.opencode/skill/system-spec-kit/`

**Configure in `opencode.json`:**
```json
{
  "mcp": {
    "spec_kit_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/context-server.js"],
      "env": {
        "EMBEDDINGS_PROVIDER": "auto",
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    }
  }
}
```

**Optional environment variables:**
```bash
# Provider selection (auto|openai|hf-local|ollama)
export EMBEDDINGS_PROVIDER=auto  # Default: auto-detect

# OpenAI config (if using OpenAI)
export OPENAI_API_KEY=sk-...
export OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small  # Default

# HF Local config (if using HF local)
export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5  # Default

# Database directory (optional - default: .opencode/skill/system-spec-kit/database/)
export MEMORY_DB_DIR=/path/to/database
```

**Note on per-profile DB:**
Each provider+model+dimension combination uses its own SQLite database. This prevents "dimension mismatch" errors and allows switching providers without migrations.

**Initialize database:**
```bash
# The database is created automatically on first run
# Verify the directory exists
ls -la .opencode/skill/system-spec-kit/database/
```

### Validation: `spec_kit_memory_check`

- [ ] Context server JS file exists
- [ ] Database directory exists (or will be created)
- [ ] Embeddings provider loads on first run (OpenAI or HF local depending on config)

**Quick Verification:**
```bash
test -f .opencode/skill/system-spec-kit/mcp_server/context-server.js && grep -q '"spec_kit_memory"' opencode.json && echo "✅ PASS" || echo "❌ FAIL"
```

**Verify active provider:**
Use the `memory_health` tool after starting OpenCode to see which provider is active:
```json
{
  "embeddingProvider": {
    "provider": "openai",  // or "hf-local"
    "model": "text-embedding-3-small",
    "dimension": 1536,
    "healthy": true
  }
}
```

❌ STOP if validation fails - verify file paths and Node.js installation

---

### 7.4 Sequential Thinking (Complex Reasoning)

Sequential Thinking provides structured reasoning chains for complex problems.

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

❌ STOP if validation fails - verify npm/npx access

---

### 7.5 Chrome DevTools CLI (Optional)

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

❌ STOP if validation fails - verify npm global install path is in PATH

---

### Phase 3 Complete Validation: `mcp_servers_check`

- [ ] Code Mode: npx utcp-mcp --version responds
- [ ] Narsil: accessible via Code Mode
- [ ] Spec Kit Memory: configured in opencode.json
- [ ] Sequential Thinking: configured in opencode.json
- [ ] (Optional) Chrome DevTools: bdg --version responds

**Quick Verification:**
```bash
grep -q '"code_mode"' opencode.json && grep -q '"spec_kit_memory"' opencode.json && echo "✅ PASS" || echo "❌ FAIL"
```

❌ STOP if any required server fails - review individual server troubleshooting

---

## 8. 🔌 PHASE 4: PLUGINS

### 8.1 Native Skills (Built-in)

OpenCode v1.0.190+ has **native skill support** built-in. No plugin installation required.

Skills are automatically discovered from:
- `.opencode/skill/<name>/SKILL.md` (project-level)
- `~/.opencode/skill/<name>/SKILL.md` (global)
- `.claude/skills/<name>/SKILL.md` (Claude-compatible)

**Current Skills (8 total):**
| Skill                     | Version | Purpose                                              |
| ------------------------- | ------- | ---------------------------------------------------- |
| mcp-narsil                | v1.0.x  | Unified code intelligence (semantic + structural + security) |
| mcp-code-mode             | v1.2.0  | External tool orchestration                          |
| system-spec-kit           | v2.0.0  | Spec folder + template system + context preservation |
| workflows-chrome-devtools | v2.1.0  | Browser debugging                                    |
| workflows-code            | v2.0.0  | Implementation orchestrator                          |
| workflows-documentation   | v1.0.0  | Unified markdown and skill management                |
| workflows-git             | v1.5.0  | Git workflow orchestrator                            |

**How it works:**
- OpenCode scans skill folders on startup
- Skills are surfaced as `skills_*` functions (e.g., `skills_mcp_narsil`)
- Agents read `SKILL.md` files directly when a task matches

**No configuration needed** - skills in `.opencode/skill/` are automatically available.

### Validation: `native_skills_check`

- [ ] Skills directory exists
- [ ] At least one SKILL.md file present
- [ ] SKILL.md has required frontmatter (name, description)

**Quick Verification:**
```bash
test -d .opencode/skill && ls .opencode/skill/*/SKILL.md >/dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"
```

❌ STOP if validation fails - verify .opencode/skill/ directory structure

---

### 8.2 Antigravity Auth (Google OAuth)

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

### 8.3 OpenAI Codex Auth (ChatGPT OAuth)

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
test -d .opencode/skill && [ $(ls -1 .opencode/skill | wc -l) -ge 1 ] && echo "✅ PASS" || echo "❌ FAIL"
```

❌ STOP if validation fails - skills are required for full functionality

---

## 9. 📝 CONFIGURATION TEMPLATES

### 9.1 Complete `opencode.json` (Full Bundle)

```json
{
  "$schema": "https://opencode.ai/config.schema.json",
  "mcp": {
    "code_mode": {
      "command": "npx",
      "args": ["utcp-mcp"],
      "env": {}
    },
    "spec_kit_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/context-server.js"]
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

### 9.2 Complete `.utcp_config.json`

```json
{
  "manuals": []
}
```

**Note:** External tools (Webflow, Figma, ClickUp) are added to manuals array as needed. See Code Mode skill documentation for configuration examples.

### 9.3 Minimal Bundle Configuration

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
    "spec_kit_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/context-server.js"]
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

## 10. ✅ FINAL VERIFICATION

### Checklist

- [ ] Prerequisites: Node.js 18+, Python 3.10+, uv
- [ ] Ollama running with nomic-embed-text model
- [ ] All 3 native MCP servers configured in opencode.json
- [ ] Skills directory exists with 7 skills
- [ ] Configuration files exist and are valid JSON

### Quick Verification

```bash
# Full verification one-liner
node --version | grep -E "^v(1[89]|2[0-9])" && \
python3 --version | grep -E "3\.(1[0-9]|[2-9][0-9])" && \
test -f opencode.json && \
test -d .opencode/skill && \
ollama list | grep -q "nomic-embed-text" && \
echo "✅ INSTALLATION COMPLETE" || echo "❌ VERIFICATION FAILED"
```

### Test Commands

```bash
npx utcp-mcp --list-tools          # Code Mode
ls .opencode/skill/                 # Skills
cat opencode.json | jq '.mcp | keys'  # MCP servers
```

❌ If verification fails, review Phase-specific troubleshooting (Section 13)

---

## 11. 🚨 DISASTER RECOVERY

Emergency procedures for backup, recovery, and clean uninstallation of OpenCode components. Use this section when things go wrong or when performing maintenance.

### Quick Reference

| Problem                    | Solution         | Section                                  |
| -------------------------- | ---------------- | ---------------------------------------- |
| **Want to start fresh**    | Clean Uninstall  | [§10.2](#102-clean-uninstall-procedures) |
| **Installation failed**    | Rollback         | [§10.3](#103-rollback-procedures)        |
| **MCP server stuck**       | Kill processes   | [§10.4](#104-emergency-recovery)         |
| **Database corrupted**     | Rebuild database | [§10.4](#database-corruption)            |
| **Not sure what's broken** | Run health check | [§10.5](#105-health-check)               |
| **About to make changes**  | Backup first     | [§10.1](#101-backup-procedures)          |

---

### 11.1 Backup & Restore

**Quick Commands:**

```bash
# Backup
BACKUP="$HOME/.opencode-backup-$(date +%Y%m%d-%H%M%S)" && mkdir -p "$BACKUP" && cp opencode.json .utcp_config.json "$BACKUP/" 2>/dev/null && cp -r .opencode/skill/system-spec-kit/database "$BACKUP/" 2>/dev/null && echo "✅ Backed up to $BACKUP"

# List backups
ls -lhd ~/.opencode-backup-* 2>/dev/null || echo "No backups found"

# Restore (replace BACKUP path)
BACKUP="$HOME/.opencode-backup-YYYYMMDD-HHMMSS" && cp "$BACKUP/opencode.json" "$BACKUP/.utcp_config.json" ./ 2>/dev/null && cp -r "$BACKUP/database" .opencode/skill/system-spec-kit/ 2>/dev/null && echo "✅ Restored"
```

---

### 11.2 Uninstall Commands

| Component                | Uninstall Command                                      | Notes                                                |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| **Code Mode**            | `npm uninstall -g utcp-mcp`                            | Remove from opencode.json + delete .utcp_config.json |

| **Chrome DevTools CLI**  | `npm uninstall -g browser-debugger-cli`                |                                                      |
| **Spec Kit Memory**      | `rm .opencode/skill/system-spec-kit/database/*.sqlite` | Database will be recreated                           |
| **Sequential Thinking**  | Remove from `opencode.json`                            | No files to delete                                   |
| **Narsil**               | Access via Code Mode - no separate config needed       | Accessed through Code Mode                           |
| **Skills**               | `rm -rf .opencode/skill/<skill-name>/`                 | Remove specific skill folder                         |
| **All Skills**           | `rm -rf .opencode/skill/`                              | Removes all skills                                   |

**To remove MCP server:** Edit `opencode.json` and delete the corresponding entry from the `mcp` object.

---

### 11.3 Rollback

```bash
# Quick rollback to latest backup
BACKUP=$(ls -td ~/.opencode-backup-* 2>/dev/null | head -1) && [ -n "$BACKUP" ] && cp "$BACKUP/opencode.json" "$BACKUP/.utcp_config.json" ./ 2>/dev/null && echo "✅ Rolled back to $BACKUP" || echo "❌ No backup found"
```

---

### 11.4 Emergency Recovery Commands

| Symptom                      | Recovery Command                                           |
| ---------------------------- | ---------------------------------------------------------- |
| MCP server hangs             | `pkill -f "server-name" && opencode`                       |
| Ollama not responding        | `pkill ollama && ollama serve &`                           |
| Database corruption (Memory) | `rm -rf .opencode/skill/system-spec-kit/database/`         |

| Config invalid JSON          | Restore from backup or regenerate from Section 8 templates |
| npm packages broken          | `npm cache clean --force && npm install -g <package>`      |
| Python/uv issues             | `uv cache clean && uv tool install <tool> --force`         |
| Skills not loading           | Restart OpenCode; verify SKILL.md frontmatter              |
| All else fails               | Complete clean uninstall (§10.2) then reinstall            |

---

### 11.5 Health Check

```bash
# Quick health check one-liner
node -v && python3 -V && [ -f opencode.json ] && [ -d .opencode/skill ] && echo "✅ Core components OK" || echo "❌ Check failed"

# Detailed checks

ls .opencode/skill/           # Skills installed
cat opencode.json | jq '.mcp | keys'  # MCP servers configured
```

---

### 11.6 Troubleshooting Matrix

| Symptom                       | Likely Cause        | Solution                        |
| ----------------------------- | ------------------- | ------------------------------- |

| `Error: ENOENT opencode.json` | Config missing      | Restore from backup or recreate |
| `MCP server timeout`          | Process stuck       | Kill processes (§10.4)          |
| `Database locked`             | Multiple processes  | Kill processes, restart         |
| `SQLITE_CORRUPT`              | Database corruption | Delete and rebuild (§10.4)      |
| `JSON parse error`            | Invalid config      | Validate with `jq`, fix syntax  |
| `Port already in use`         | Port conflict       | Kill conflicting process        |
| `Permission denied`           | File permissions    | Check ownership, run `chmod`    |
| `Memory not found`            | DB not indexed      | Run `memory_index_scan()`       |


---

### 11.7 Best Practices

1. **Before changes:** Run backup command (§10.1)
2. **After failure:** Run rollback (§10.3), restart OpenCode
3. **Monthly:** Clean old backups: `ls -td ~/.opencode-backup-* | tail -n +6 | xargs rm -rf`

---

## 12. ⚙️ POST-INSTALLATION CONFIGURATION

After installing OpenCode components, customize the AI agent configuration for your project.

### 12.1 AGENTS.md Customization

The `AGENTS (Universal).md` file is a template for AI agent behavior. Customize it for your project:

1. **Rename the file**: `AGENTS (Universal).md` → `AGENTS.md`
2. **Choose project type**: Front-end, Back-end, or Full-stack
3. **Align with installed tools**: Update tool references to match your MCP configuration
4. **Align with available skills**: Update skills table to match `.opencode/skill/`

**Quick customization for project types:**

| Project Type | Primary Tools                   | Primary Skills                           | Remove/De-emphasize           |
| ------------ | ------------------------------- | ---------------------------------------- | ----------------------------- |
| Front-end    | Chrome DevTools, Webflow, Figma | workflows-chrome-devtools, mcp-code-mode | Database tools, API patterns  |
| Back-end     | API testing, Database tools     | workflows-code, mcp-narsil               | Browser tools, Webflow, Figma |
| Full-stack   | All tools                       | All skills                               | Nothing                       |

📖 **Detailed Guide**: [SET-UP - AGENTS.md](./SET-UP%20-%20AGENTS.md)

### 12.2 Skill Advisor Setup

The Skill Advisor (`skill_advisor.py`) powers Gate 2 in AGENTS.md, routing requests to appropriate skills:

```bash
# Verify skill advisor
python .opencode/scripts/skill_advisor.py "help me write documentation"
```

If confidence > 0.8, the AI agent MUST use the recommended skill.

📖 **Detailed Guide**: [SET-UP - Skill Advisor.md](./SET-UP%20-%20Skill%20Advisor.md)

### 12.3 Skill Creation

Create custom skills to extend AI agent capabilities:

```bash
# Initialize new skill
python .opencode/skill/workflows-documentation/scripts/init_skill.py my-skill --path .opencode/skill

# Validate skill
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/my-skill
```

📖 **Detailed Guide**: [SET-UP - Skill Creation.md](./SET-UP%20-%20Skill%20Creation.md)

### 12.4 Agent System

The Agent System provides specialized AI personas with defined authorities, tool permissions, and behavioral rules. Unlike skills (knowledge bundles), agents have **authority** to act and **tools** to execute.

**Available Agents:**
| Agent           | Purpose                         | Key Capability                        |
| --------------- | ------------------------------- | ------------------------------------- |
| **orchestrate** | Task decomposition & delegation | Parallel delegation (up to 20 agents) |
| **write**       | Documentation creation          | Template-first, DQI scoring           |

**Quick Verification:**
```bash
ls .opencode/agent/*.md 2>/dev/null && echo "✅ PASS" || echo "❌ FAIL"
```

📖 **Detailed Guide**: [SET-UP - Opencode Agents.md](./SET-UP%20-%20Opencode%20Agents.md)

---

**Post-Installation Quick Verification:**
```bash
node -v && python3 -V && [ -f opencode.json ] && [ -d .opencode/skill ] && echo "✅ Core components OK" || echo "❌ Check failed"

# Detailed checks
ls .opencode/skill/           # Skills installed
cat opencode.json | jq '.mcp | keys'  # MCP servers configured
```

❌ STOP if validation fails - AGENTS.md, skills, and agents are required for full AI agent functionality

---

## 13. 🚀 WHAT'S NEXT?

Congratulations on completing the installation! Here's your roadmap for getting started.

### 13.1 First Steps (Day 1)

| Step | Action                 | Command/Location                                                 |
| ---- | ---------------------- | ---------------------------------------------------------------- |
| 1    | Verify installation    | Run health check script from Section 10.5                        |
| 2    | Customize AGENTS.md    | Edit `AGENTS.md` for your project type                           |
| 3    | Test skill invocation  | `python .opencode/scripts/skill_advisor.py "your task"`          |
| 4    | Save first memory      | Use `/memory:save` or "save context" in conversation             |

### 13.2 Common Workflows

| Workflow                 | Tools/Commands                | Example                                                   |
| ------------------------ | ----------------------------- | --------------------------------------------------------- |
| **Code Exploration**     | Narsil                        | `narsil.narsil_neural_search({ query: "authentication" })`|
| **Context Preservation** | Spec Kit Memory               | `/memory:save`, `memory_search()`                         |
| **Browser Debugging**    | Chrome DevTools CLI           | `bdg screenshot --url https://example.com`                |
| **Documentation**        | workflows-documentation skill | Invoke skill for doc structure                            |
| **Git Operations**       | workflows-git skill           | Commit, PR creation workflows                             |
| **Implementation**       | workflows-code skill          | 3-phase implementation lifecycle                          |

### 13.3 Available Commands (16 total)

| Category | Commands                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Create   | `/create:skill`, `/create:spec`                                                                         |
| Memory   | `/memory:save`, `/memory:search`                                                                        |
| Prompt   | `/prompt:improve`                                                                                       |
| Search   | `/search:code`, `/search:files`                                                                         |
| SpecKit  | `/spec_kit:complete`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:research`, `/spec_kit:resume` |

### 13.4 Learning Resources

| Resource      | Location                                   | Description                   |
| ------------- | ------------------------------------------ | ----------------------------- |
| OpenCode Docs | https://opencode.ai/docs                   | Official documentation        |
| Narsil Skill  | `.opencode/skill/mcp-narsil/SKILL.md`      | Code intelligence usage       |
| Memory Skill  | `.opencode/skill/system-spec-kit/SKILL.md` | Context preservation          |
| Code Skill    | `.opencode/skill/workflows-code/SKILL.md`  | Implementation patterns       |
| Git Skill     | `.opencode/skill/workflows-git/SKILL.md`   | Git workflows                 |
| AGENTS.md     | `AGENTS.md`                                | AI agent behavior reference   |
| Agent System  | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Agent creation & usage |

### 13.5 Next Level (Week 1)

- [ ] Configure external tools in `.utcp_config.json` (Webflow, Figma, ClickUp)
- [ ] Create project-specific skills for repeated workflows
- [ ] Set up backup schedule for configurations
- [ ] Explore Narsil neural search and security scanning features
- [ ] Practice spec folder workflow for all file modifications

---

## 14. 🔧 TROUBLESHOOTING

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
<summary><strong>Narsil Issues</strong></summary>

### Tool not accessible
1. Ensure Code Mode is installed and working
2. Verify Code Mode can access Narsil tools
3. Check for error messages in Code Mode output

### Security scan errors
```bash
# Verify Code Mode is working
npx utcp-mcp --list-tools
```

</details>

<details>
<summary><strong>Spec Kit Memory Issues</strong></summary>

### Database not found
```bash
# Create directory if missing
mkdir -p .opencode/skill/system-spec-kit/database

# Database is created on first run
node .opencode/skill/system-spec-kit/mcp_server/context-server.js
```

### Embeddings not working
1. Verify Ollama is running: `ollama list`
2. Check nomic-embed-text model: `ollama pull nomic-embed-text`
3. Verify OLLAMA_BASE_URL in config

### Memory search returns empty
```bash
# Check database has content
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "SELECT COUNT(*) FROM memories;"
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
1. Verify skill folder exists: `ls -la .opencode/skill/`
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

---

## 15. 📖 QUICK REFERENCE

### Essential Commands

| Task                 | Command                                                     |
| -------------------- | ----------------------------------------------------------- |
| Check prerequisites  | `node -v && python3 -V`                                     |
| Start Ollama         | `ollama serve`                                              |
| Pull embedding model | `ollama pull nomic-embed-text`                              |
| Search code (Narsil) | `narsil.narsil_neural_search({ query: "your query" })`      |
| List skills          | `ls .opencode/skill/`                                       |
| Read skill           | `cat .opencode/skill/<skill-name>/SKILL.md`                 |
| Browser screenshot   | `bdg screenshot --url <url> --output out.png`               |
| Run health check     | `bash health-check.sh`                                      |

### File Locations

| File                        | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `opencode.json`             | OpenCode MCP server config (3 native servers) |
| `.utcp_config.json`         | Code Mode external tools config               |
| `.opencode/skill/`          | Skill definitions (7 skills)                  |
| `.opencode/agent/`          | Agent definitions (orchestrate, write)        |
| `.opencode/install_guides/` | Installation documentation                    |

| `~/.opencode-backup/`       | Configuration backups                         |
| `AGENTS.md`                 | AI agent behavior configuration               |

### Component Summary

| Category           | Count | Items                                                                                                                    |
| ------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| Native MCP Servers | 3     | code_mode, spec_kit_memory, sequential_thinking                                                                          |
| Code Mode Tools    | 1     | narsil (structural analysis, security, semantic search, call graphs)                                                     |
| Skills             | 7     | mcp-narsil, mcp-code-mode, system-spec-kit, workflows-chrome-devtools, workflows-code, workflows-documentation, workflows-git |
| Commands           | 16    | /create:*, /memory:*, /prompt:improve, /search:*, /spec_kit:*                                                                            |
| CLI Tools          | 1     | Chrome DevTools (bdg)                                                                                                                    |
| Plugins            | 2     | Antigravity Auth, OpenAI Codex Auth                                                                                                      |