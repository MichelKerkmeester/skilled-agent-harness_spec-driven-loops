# LEANN MCP Server Installation Guide

Install LEANN for semantic **CODE search** with 97% storage savings. Uses MLX + Qwen3 embeddings on Apple Silicon.

> **Part of OpenCode Installation** - See [Master Installation Guide](../README.md) for complete setup.
> **Binary**: `~/.local/bin/leann_mcp` | **Embedding**: MLX + Qwen3 (Apple Silicon only)

---

## TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4--configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🔧 TROUBLESHOOTING](#7--troubleshooting)
8. [📚 RESOURCES](#8--resources)

---

## 1. 📖 OVERVIEW

LEANN (Lean ANNs) provides semantic **CODE search** with 97% storage savings compared to traditional vector databases.

### Key Points

| Property        | Value                                                 |
| --------------- | ----------------------------------------------------- |
| **Purpose**     | Semantic CODE search (src/ folder only)               |
| **Embeddings**  | MLX + Qwen3 (Apple Silicon)                           |
| **GitHub**      | [yichuan-w/LEANN](https://github.com/yichuan-w/LEANN) |
| **Binary**      | `~/.local/bin/leann` and `~/.local/bin/leann_mcp`     |

### What LEANN Is For

- ✅ **CODE search** - Find code by intent ("How does auth work?")
- ✅ **src/ folder only** - Index your source code
- ✅ **Semantic search** - Find by meaning, not keywords

### What LEANN Is NOT For

| Don't Index       | Use Instead          |
| ----------------- | -------------------- |
| `specs/` folder   | Spec Kit Memory MCP  |
| `.opencode/`      | Spec Kit Memory MCP  |
| `docs/` folder    | Grep or Spec Kit     |
| `node_modules/`   | Never index          |

---

## 2. 📋 PREREQUISITES

### Required Software

```bash
# 1. Python 3.9+
python3 --version  # Should show 3.9.x or higher

# 2. uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"

# 3. Homebrew dependencies
brew install libomp boost protobuf zeromq pkgconf

# 4. Ollama (for LLM in ask command)
brew install ollama
brew services start ollama
ollama pull qwen3:8b
```

### Validation

```bash
python3 --version && uv --version && brew list libomp boost protobuf zeromq pkgconf >/dev/null 2>&1 && echo "✅ PASS" || echo "❌ FAIL"
```

---

## 3. 📥 INSTALLATION

### Step 1: Install LEANN with MLX Support

```bash
# Install LEANN with MLX for Apple Silicon
uv tool install leann-core --with leann --with mlx --with mlx-lm

# Verify installation
which leann       # → ~/.local/bin/leann
which leann_mcp   # → ~/.local/bin/leann_mcp
leann --version
```

### Step 2: Set Up Shell Alias

```bash
# Add to ~/.zshrc
echo 'alias leann-build='"'"'leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'"'"'' >> ~/.zshrc

# Reload shell
source ~/.zshrc

# Verify alias
type leann-build
```

### Step 3: Build Your First Index

```bash
# Index your project's src/ folder (ALWAYS src/ only)
leann-build my-project --docs /path/to/your/project/src

# Test search
leann search my-project "authentication flow"
```

### Validation

```bash
leann --version && which leann | grep -q ".local/bin/leann" && type leann-build | grep -q "mlx" && echo "✅ PASS" || echo "❌ FAIL"
```

---

## 4. ⚙️ CONFIGURATION

### OpenCode Configuration

Add to `opencode.json`:

```json
{
  "mcp": {
    "leann": {
      "type": "local",
      "command": ["/Users/YOUR_USERNAME/.local/bin/leann_mcp"],
      "environment": {
        "_NOTE_TOOLS": "Provides: leann_build, leann_search, leann_ask, leann_list, leann_remove",
        "_NOTE_USAGE": "Semantic CODE search - index src/ folder only",
        "_NOTE_DOCS": "https://github.com/yichuan-w/LEANN"
      },
      "enabled": true
    }
  }
}
```

> **Note**: Replace `YOUR_USERNAME` with your actual username (`whoami`).

### Environment Variables

| Variable                | Default                                       | Description             |
| ----------------------- | --------------------------------------------- | ----------------------- |
| `LEANN_INDEX_DIR`       | `~/.leann/indexes`                            | Index storage location  |
| `LEANN_EMBEDDING_MODE`  | `mlx`                                         | Embedding provider      |
| `LEANN_EMBEDDING_MODEL` | `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` | Embedding model         |
| `OLLAMA_HOST`           | `http://localhost:11434`                      | Ollama URL (ask command)|

---

## 5. ✅ VERIFICATION

### Step 1: Restart OpenCode

```bash
opencode
```

### Step 2: Check MCP Tools

Ask your AI assistant:
```
What MCP tools are available?
```

Expected: Should list `leann_build`, `leann_search`, `leann_ask`, `leann_list`, `leann_remove`.

### Step 3: Test Search

```bash
leann search my-project "form validation"
```

### Validation Checklist

- [ ] `leann --version` returns version
- [ ] `leann list` shows your index
- [ ] `leann search` returns results with scores
- [ ] MCP tools appear in OpenCode

---

## 6. 🚀 USAGE

### Daily Workflow

```bash
# Search for code by intent
leann search my-project "authentication flow"

# Ask questions about codebase
leann ask my-project "How does the login system work?"

# List all indexes
leann list

# Rebuild index after code changes
leann-build my-project --docs /path/to/src
```

### Build Command

```bash
# Using shell alias (recommended)
leann-build my-project --docs src/

# Full command (equivalent)
leann build my-project --docs src/ --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"
```

### Build Options

| Option              | Default | Description            |
| ------------------- | ------- | ---------------------- |
| `--backend`         | hnsw    | `hnsw` or `diskann`    |
| `--file-types`      | all     | Filter by extensions   |
| `--use-ast-chunking`| false   | AST-aware code chunks  |

### When to Rebuild

- After significant code changes
- When adding new source files
- When search quality degrades

---

## 7. 🔧 TROUBLESHOOTING

### "Command not found: leann"

```bash
source "$HOME/.local/bin/env"
# Or add to ~/.zshrc: export PATH="$HOME/.local/bin:$PATH"
```

### "No index found"

```bash
leann list  # Check what indexes exist
leann-build my-project --docs /path/to/src
```

### "Cannot connect to Ollama"

```bash
brew services start ollama
ollama list  # Verify models
```

### "MCP server not appearing"

1. Check JSON syntax: `python3 -m json.tool < opencode.json`
2. Verify binary: `ls ~/.local/bin/leann_mcp`
3. Restart OpenCode

### Memory Issues During Build

```bash
# Reduce scope - index only src/
leann-build my-project --docs src/

# Filter file types
leann-build my-project --docs src/ --file-types ".js,.ts,.py"

# Use DiskANN for very large projects
leann-build my-project --docs src/ --backend diskann
```

---

## 8. 📚 RESOURCES

### File Locations

| Path                     | Purpose                 |
| ------------------------ | ----------------------- |
| `~/.local/bin/leann`     | LEANN CLI binary        |
| `~/.local/bin/leann_mcp` | LEANN MCP server binary |
| `~/.leann/indexes/`      | Index storage location  |

### CLI Reference

```bash
# Build index (src/ only)
leann-build <name> --docs src/

# Search
leann search <name> "<query>" [--top-k N]

# Ask (RAG Q&A)
leann ask <name> "<question>"

# List indexes
leann list

# Remove index
leann remove <name>
```

### External Resources

- [LEANN Repository](https://github.com/yichuan-w/LEANN)
- [LEANN Paper](https://arxiv.org/abs/2401.11511)
- [Ollama](https://ollama.com)

### Related Skills

- **mcp-leann** - SKILL.md for AI agent integration
- **system-spec-kit** - For document/spec search (use instead of LEANN)

---

## Quick Start Summary

```bash
# 1. Prerequisites
brew install libomp boost protobuf zeromq pkgconf

# 2. Install LEANN with MLX
uv tool install leann-core --with leann --with mlx --with mlx-lm
source "$HOME/.local/bin/env"

# 3. Set up shell alias
echo 'alias leann-build='"'"'leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'"'"'' >> ~/.zshrc
source ~/.zshrc

# 4. Build index (src/ only)
leann-build my-project --docs /path/to/project/src

# 5. Search
leann search my-project "your query"

# 6. Configure MCP (add to opencode.json - see Configuration section)

# 7. Restart OpenCode and start using!
```

---

**Installation Complete!**

LEANN is for **CODE search only** (src/ folder). For document/spec search, use **Spec Kit Memory MCP** instead.
