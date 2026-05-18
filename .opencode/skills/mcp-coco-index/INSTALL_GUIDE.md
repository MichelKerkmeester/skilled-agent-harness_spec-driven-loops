---
title: "CocoIndex Code Installation Guide"
description: "Complete installation and configuration guide for the CocoIndex Code MCP server providing semantic code search via vector embeddings."
trigger_phrases:
  - "install cocoindex"
  - "setup ccc"
  - "cocoindex install"
---

# CocoIndex Code Installation Guide

Complete installation and configuration guide for CocoIndex Code, a semantic code search engine for AI-assisted development. Provides natural language code search across your entire codebase with configurable embedding models (local or API-based). Runs as an MCP server exposing `search` and `cocoindex_refresh_index` to AI assistants, while `status`, `index`, `reset`, and `daemon` remain CLI commands.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
> **Package:** local editable `cocoindex-code` soft-fork | **Dependencies:** Python 3.11+

**Version:** 1.2.0 | **Updated:** 2026-05-18 | **Protocol:** MCP (stdio)

---

<!-- ANCHOR:ai-first-install-guide -->
## 0. AI-FIRST INSTALL GUIDE

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install CocoIndex Code for semantic code search.

Please help me:
1. Check if I have Python 3.11+ installed
2. Run the install script: bash .opencode/skills/mcp-coco-index/scripts/install.sh
3. Initialize the index with `ccc init` and `ccc index`
4. Configure MCP for my environment (I'm using: [Claude Code / Copilot / Agents CLI / Gemini CLI / Claude CLI / Codex CLI])
5. Verify with a test search: ccc search "error handling"

My project is located at: [your project path]

Guide me through each step with the exact commands needed.
```

The AI will:
- Verify Python 3.11+ is available on your system
- Run the install script to create a venv and install the local editable cocoindex-code fork
- Initialize the semantic index for your project
- Configure the MCP server for your AI platform
- Test with a sample semantic search query

**Expected setup time:** 3 to 5 minutes (plus indexing time depending on codebase size)

### Quick Success Check (30 seconds)

After installation, run these two tests immediately:

1. Open your terminal and run: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc status`
2. Status output appears: CLI is working
3. Run: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc search "hello world"`
4. Search results appear: full system is working

Not working? Go to [Troubleshooting](#9-troubleshooting).

<!-- /ANCHOR:ai-first-install-guide -->

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

CocoIndex Code gives AI assistants the ability to search your codebase by meaning rather than exact text. Ask "how does authentication work" and it finds relevant code across files and languages, even when the word "authentication" never appears in the source.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Source Repository

| Property      | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| **Upstream**  | [cocoindex-io/cocoindex-code](https://github.com/cocoindex-io/cocoindex-code) |
| **Fork**      | Local editable package at `.opencode/skills/mcp-coco-index/mcp_server` |
| **Binary**    | `ccc`                                                                 |
| **License**   | Apache-2.0                                                            |
| **Embedding** | Configurable (default: local EmbeddingGemma 300M; cloud alternatives available) |

### When to Use Semantic Search

| Scenario                                  | Tool           | Why                                              |
| ----------------------------------------- | -------------- | ------------------------------------------------ |
| Find code by meaning or intent            | CocoIndex Code | Understands concepts, not just keywords           |
| Find exact string or regex pattern         | Grep           | Faster for known text patterns                    |
| Find files by name or glob pattern         | Glob           | File discovery by path pattern                    |
| Understand how a feature is implemented    | CocoIndex Code | Finds related code across files                   |
| Find all usages of a specific function     | Grep           | Exact match is more reliable for names            |

Default to Grep for exact matches. Use CocoIndex Code when you need semantic understanding.

### Decision Flowchart

```
Search task received --> Do you know the exact text?
                              |
                      +-------+-------+
                     YES              NO
                      |               |
                      v               v
                  Use Grep       Is ccc available?
                  (fastest)           |
                              +-------+-------+
                             YES              NO
                              |               |
                              v               v
                         Use ccc         Install ccc:
                         (semantic)      bash .opencode/skills/mcp-coco-index/scripts/install.sh
```

### Architecture Diagram

```
+-------------------------------------------------------------+
|                 AI Client (Any CLI Agent)                     |
+--------------------------+----------------------------------+
                           | MCP (stdio)
                           v
+-------------------------------------------------------------+
|              CocoIndex Code MCP Server                       |
|              (ccc mcp)                                       |
|                                                              |
|  MCP Tools: search + cocoindex_refresh_index                |
|  Embedding: configurable (local or API-based)                |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              .cocoindex_code/ (project root)                 |
|              Semantic vector index                            |
|              28+ supported languages                         |
+-------------------------------------------------------------+
```

### Performance Targets

| Operation         | Target | Typical   |
| ----------------- | ------ | --------- |
| Semantic search   | <2s    | ~500ms    |
| Index build       | varies | 1-5 min   |
| Index refresh     | <30s   | ~10s      |
| Status check      | <1s    | ~200ms    |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:prerequisites -->
## 2. PREREQUISITES

### Required Tools

- **Python 3.11 or higher**
  ```bash
  python3.11 --version
  # Should show Python 3.11.x or higher
  ```

- **pip** (comes with Python)
  ```bash
  python3.11 -m pip --version
  ```

### Platform Support

| Platform    | Status         | Notes                              |
| ----------- | -------------- | ---------------------------------- |
| **macOS**   | Native support | Recommended                        |
| **Linux**   | Native support | May need python3.11-venv package   |
| **Windows** | WSL only       | PowerShell and Git Bash not tested |

### Common Setup Issues

**Python 3.11 not found:**
```bash
# macOS (Homebrew)
brew install python@3.11

# Linux (Ubuntu/Debian)
sudo apt install python3.11 python3.11-venv

# Verify
python3.11 --version
```

### Validation: `phase_1_complete`

Run these checks to confirm prerequisites are met:

| Check           | Command                       | Expected                |
| --------------- | ----------------------------- | ----------------------- |
| Python version  | `python3.11 --version`        | `Python 3.11.x`        |
| pip available   | `python3.11 -m pip --version` | pip version output      |
| venv available  | `python3.11 -m venv --help`   | Usage information       |

**STOP if validation fails.** Fix the issue before continuing.

<!-- /ANCHOR:prerequisites -->

---

<!-- ANCHOR:installation -->
## 3. INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Initialize)**.

### Recommended: Venv in Skill Folder

Recommended AI-safe setup:

```bash
bash .opencode/skills/mcp-coco-index/scripts/ensure_ready.sh
```

Lower-level installer:

```bash
bash .opencode/skills/mcp-coco-index/scripts/install.sh
```

The script will:
1. Create a Python 3.11 venv at `.opencode/skills/mcp-coco-index/mcp_server/.venv/`
2. Install the local editable `cocoindex-code` fork into the venv
3. Verify the `ccc` binary works
4. Initialize the index directory if it does not exist

### Alternative: pipx System-Wide

If you prefer a system-wide upstream installation:

```bash
pipx install --python python3.11 cocoindex-code
```

> **Note**: `pipx install cocoindex-code` installs upstream from PyPI, not the spec-kit fork. The MCP configuration examples in this guide use the venv path. Keep the local fork active with `bash .opencode/skills/mcp-coco-index/scripts/install.sh`, which runs `pip install --upgrade --editable ".opencode/skills/mcp-coco-index/mcp_server"`.

### Verify the Binary

```bash
# Confirm installation (venv method)
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc --help
# Should display help text

# Or if using pipx
ccc --help
```

### Validation: `phase_2_complete`

| Check         | Command                                                                        | Expected             |
| ------------- | ------------------------------------------------------------------------------ | -------------------- |
| Binary exists | `ls .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`              | File exists          |
| Help works    | `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc --help`          | Help text            |

**STOP if validation fails.** Check installation output for errors.

### Initialize the Index

```bash
cd /path/to/your/project

# Initialize the project (creates .cocoindex_code/ directory)
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc init

# Build the semantic index (this may take a few minutes)
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc index
```

> **Note**: The `.cocoindex_code/` directory should be gitignored. It stores the semantic vector index locally.

### Validation: `phase_3_complete`

| Check           | Command                                                                  | Expected                   |
| --------------- | ------------------------------------------------------------------------ | -------------------------- |
| Index directory | `ls -d .cocoindex_code/`                                                 | Directory exists           |
| Status works    | `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc status`     | Index stats displayed      |

**STOP if validation fails.** Check initialization output for errors.

<!-- /ANCHOR:installation -->

---

<!-- ANCHOR:configuration -->
## 4. CONFIGURATION

Connect CocoIndex Code to your AI assistant (Phase 4). The MCP server runs via `ccc mcp` in stdio mode.

**Key environment variable:**
- `COCOINDEX_CODE_ROOT_PATH` - The root directory of the project to search. Set this to your project root.

### Tuning + retrieval features (v1.2.0+)

All 10 variables below have safe defaults. Hybrid (BM25+RRF) and cross-encoder rerank are **default-on** as of the v1.10 promotion (2026-05-18); operators opt **out** by setting the flags to `false`. Source of truth: `mcp_server/cocoindex_code/config.py`.

**Chunking (always on, tunable defaults):**

| Variable | Default | Range | Description |
|---|---:|---|---|
| `COCOINDEX_CODE_CHUNK_SIZE` | `1500` | 100–8000 | Max characters per code chunk before splitting. Raised from 1000 → 1500 in v1.2.0 for better function-boundary preservation. |
| `COCOINDEX_CODE_CHUNK_OVERLAP` | `200` | 0–1000 | Character overlap between adjacent chunks for cross-chunk continuity. |
| `COCOINDEX_CODE_MIN_CHUNK_SIZE` | `250` | 50–1000 | Smallest chunk emitted; smaller fragments are merged with neighbors. |

See [`feature_catalog/chunking.md`](feature_catalog/chunking.md) for the tuning rationale and benchmark methodology.

**Hybrid search (default ON):**

Adds SQLite FTS5 lexical channel fused with vector channel via Reciprocal Rank Fusion. Mirrors the proven retrieval-quality stack used by `mk-spec-memory`.

| Variable | Default | Range | Description |
|---|---:|---|---|
| `COCOINDEX_HYBRID` | `true` | bool (`1/true/yes/on` or `0/false/no/off`) | Enable hybrid (vector + FTS5) retrieval. Set `false` to fall back to vector-only. |
| `COCOINDEX_HYBRID_VECTOR_WEIGHT` | `0.7` | 0.0–2.0 | RRF weight for the vector channel. |
| `COCOINDEX_HYBRID_FTS5_WEIGHT` | `0.7` | 0.0–2.0 | RRF weight for the FTS5 lexical channel. |
| `COCOINDEX_HYBRID_RRF_K` | `60` | 1–500 | RRF dampening constant; higher k flattens the influence of top-ranked hits. |

See [`feature_catalog/hybrid-search.md`](feature_catalog/hybrid-search.md) for activation guidance and tuning notes.

**Cross-encoder reranker (default ON):**

Applies a local cross-encoder rerank to the top-K candidates after retrieval. Higher relevance at the cost of additional inference time per query.

| Variable | Default | Range | Description |
|---|---:|---|---|
| `COCOINDEX_RERANK` | `true` | bool | Enable cross-encoder rerank pass over retrieval results. Set `false` to disable. |
| `COCOINDEX_RERANK_MODEL` | `BAAI/bge-reranker-v2-m3` | string | HuggingFace model id for the cross-encoder; first use downloads (~2.3 GB) to `~/.cache/huggingface/hub/`. |
| `COCOINDEX_RERANK_TOP_K` | `20` | 5–100 | Number of retrieval candidates passed to the reranker before final cut. |

> **Model swap (v1.10):** the default reranker was switched from `Alibaba-NLP/gte-multilingual-reranker-base` to `BAAI/bge-reranker-v2-m3` (Apache-2.0, ~568M params) on 2026-05-18. GTE-multilingual currently fails on Apple Silicon MPS with `AcceleratorError: index ... is out of bounds` (sentence-transformers 5.4.1 + transformers 5.8.0 + torch 2.11.0); the reranker module catches the error but silently returns the unranked order, so every prior `COCOINDEX_RERANK=true` query on MPS got zero rerank contribution. Operators on non-MPS backends, or those who want to test future ST/transformers compatibility fixes, can pin GTE via `COCOINDEX_RERANK_MODEL=Alibaba-NLP/gte-multilingual-reranker-base`.

See [`feature_catalog/reranker.md`](feature_catalog/reranker.md) for model trade-offs, RAM requirements, and when to enable.

### Configuration for All 6 CLI Environments

See [Config Templates](assets/config_templates.md) for ready-to-copy snippets for each CLI.

Below are repo-portable patterns that match the checked-in integration.

### Option A: Claude Code (`.mcp.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "disabled": true
    }
  }
}
```

> **Note**: Set `"disabled": true` initially. Enable after verification by changing to `false`.

### Option B: Copilot / OpenCode (`opencode.json`)

```json
{
  "mcp": {
    "cocoindex_code": {
      "type": "local",
      "command": [
        ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc",
        "mcp"
      ],
      "environment": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1_PACKAGE": "Local editable cocoindex-code fork, installed via scripts/install.sh",
        "_NOTE_2_EMBEDDING": "Default: jinaai/jina-embeddings-v2-base-code (local sentence-transformers, no API key needed, 768d)",
        "_NOTE_3_INDEX": "Index stored in .cocoindex_code/ (gitignored)"
      }
    }
  }
}
```

### Option C: Agents CLI (`.agents/settings.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": ".",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "trust": true
    }
  }
}
```

### Option D: Gemini CLI (`.gemini/settings.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": ".",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "trust": true
    }
  }
}
```

### Option E: Claude CLI (`.claude/mcp.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1_PACKAGE": "Local editable cocoindex-code fork, installed via scripts/install.sh",
        "_NOTE_2_EMBEDDING": "Default: jinaai/jina-embeddings-v2-base-code (local sentence-transformers, no API key needed, 768d)",
        "_NOTE_3_INDEX": "Index stored in .cocoindex_code/ (gitignored)"
      }
    }
  }
}
```

> **Note**: Claude CLI supports relative paths. The `.` value for `COCOINDEX_CODE_ROOT_PATH` resolves to the project root.

### Option F: Codex CLI (`.codex/config.toml`)

```toml
[mcp_servers.cocoindex_code]
command = ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
args = ["mcp"]

[mcp_servers.cocoindex_code.env]
COCOINDEX_CODE_ROOT_PATH = "."
_NOTE_1 = "Requires local editable fork: bash .opencode/skills/mcp-coco-index/scripts/install.sh"
_NOTE_2 = "Default embedding: jinaai/jina-embeddings-v2-base-code (local sentence-transformers, no API key needed, 768d)"
_NOTE_3 = "Index stored in .cocoindex_code/ (gitignored)"
```

### Embedding Model Configuration

CocoIndex Code supports multiple embedding models. Configure via `~/.cocoindex_code/global_settings.yml`.

**Default:** `jinaai/jina-embeddings-v2-base-code` via the `sentence-transformers` provider -- local 768-dimensional code search with no API key.

```yaml
# Default local model (no API key, works offline)
embedding:
  provider: sentence-transformers
  model: jinaai/jina-embeddings-v2-base-code
```

**Cloud alternative:** `voyage/voyage-code-3` via LiteLLM provider. Requires `VOYAGE_API_KEY` and a full index rebuild.

```yaml
# Voyage Code 3 (cloud alternative)
embedding:
  provider: litellm
  model: voyage/voyage-code-3
envs:
  VOYAGE_API_KEY: your-key-here
```

**Using Ollama:** `ollama/nomic-embed-text` via LiteLLM provider. Requires a running Ollama daemon and the model pulled locally; no API key is needed.

```bash
# 1. Start Ollama, then pull the embedding model
ollama serve
ollama pull nomic-embed-text

# 2. Point CocoIndex at the local daemon and model
export OLLAMA_API_BASE="http://localhost:11434"
export COCOINDEX_CODE_EMBEDDING_MODEL="ollama/nomic-embed-text"

# 3. Rebuild vectors because the embedding backend changed
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc reset --force
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc index
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc search "test query" --limit 5
```

Equivalent `~/.cocoindex_code/global_settings.yml`:

```yaml
embedding:
  provider: litellm
  model: ollama/nomic-embed-text
envs:
  OLLAMA_API_BASE: http://localhost:11434
```

The registry marks Ollama-backed models with `requires_ollama_daemon=True`, so `ccc index` fails fast with a clear message when the daemon is unreachable or the model has not been pulled.

**Vetted code-tuned alternatives:** see the curated registry below ("Choosing an embedder") or import `from cocoindex_code.registered_embedders import list_embedders` for the programmatic version. Cloud alternatives (OpenAI, Gemini, Cohere) still work via LiteLLM — see [Settings Reference](references/settings_reference.md) for the full list.

> **CRITICAL**: Changing embedding models requires `ccc reset && ccc index` because different models produce different vector dimensions.

### Validation: `phase_4_complete`

| Check             | Method                                 | Expected                       |
| ----------------- | -------------------------------------- | ------------------------------ |
| Config exists     | Open your CLI's config file            | cocoindex_code entry present   |
| Binary path valid | `ls .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc` | File exists |
| JSON syntax valid | `python3 -m json.tool < config.json`   | No syntax errors               |

**STOP if validation fails.** Fix configuration syntax or paths before continuing.

### Choosing an embedder

The default is `sbert/jinaai/jina-embeddings-v2-base-code` (768d, code-tuned, ~280 MB on disk, Metal-accelerated on Apple Silicon). It indexes a typical 8,000-file repo in ~15-30 min and runs purely local — no API key required. **Use the default unless you need different trade-offs.**

If you do want to swap, the registry of vetted candidates lives in `cocoindex_code/registered_embedders.py`:

| Embedder | Dim | RAM | Disk | Cat | When to prefer |
|---|---:|---:|---:|---|---|
| **jinaai/jina-embeddings-v2-base-code** | 768 | ~600 MB | ~280 MB | code | DEFAULT. Multi-language code-tuned, 8192 ctx. |
| google/embeddinggemma-300m | 768 | ~600 MB | ~300 MB | text | Baseline. General-text only. Keep for benchmarks. |
| nomic-ai/CodeRankEmbed | 768 | ~550 MB | ~270 MB | code | Alternative code-tuned. Python-leaning. Try if jina underperforms on your repo. |
| BAAI/bge-code-v1 | 768 | ~700 MB | ~340 MB | code | Multilingual code coverage emphasis. |
| jinaai/jina-embeddings-v2-base-en | 768 | ~600 MB | ~280 MB | text | English-text variant. Docs-heavy repos. |
| ollama/nomic-embed-text | 768 | ~600 MB | ~270 MB | text | Local Ollama option. Requires `ollama serve` + `ollama pull nomic-embed-text`; text-tuned, not code-tuned. |
| Salesforce/SFR-Embedding-Code-2B_R | 2048 | ~4.5 GB | ~4 GB | code | Largest + highest quality. Need GPU/RAM headroom. |

To swap (env var):

```bash
# 1. Choose a model name from the registry
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/nomic-ai/CodeRankEmbed"

# 2. Restart the daemon (graceful)
ps -eo pid,command | grep "ccc run-daemon" | grep -v grep | awk '{print $1}' | xargs kill

# 3. Purge old vectors + reindex with new embedder
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc reset --force
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc index
```

**First-use download**: sentence-transformers pulls the model from HuggingFace on first instantiation (~270-340 MB for the small candidates, 4 GB for SFR-2B). Cached at `~/.cache/huggingface/hub/`.

**Metal auto-detect**: on Apple Silicon, `_resolve_device()` probes `torch.backends.mps.is_available()` and prefers MPS automatically. Override via `COCOINDEX_CODE_DEVICE=cpu` if MPS produces unstable results.

**Dimension mismatch warning**: switching to an embedder with a different `dim` (e.g., gemma 768 → SFR-2B 2048) requires `ccc reset && ccc index` — the on-disk vectors must match the live model's dimensionality.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

### Verify the fork is active

```bash
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc --version
```

Expected output: `0.2.3+spec-kit-fork.0.2.0` (or higher local-version).

If the version does NOT contain `+spec-kit-fork.`, the fork install was overridden by an upstream PyPI install. Re-run `bash scripts/install.sh` to restore the fork.

### One-Command Health Check

```bash
# Complete CLI verification in one command
CCC=".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc" && \
  $CCC status 2>&1 && \
  $CCC search "hello" --limit 3 2>&1 && \
  echo "SUCCESS: All checks passed" || \
  echo "FAILED: Check error output above"
```

### Full Verification Checklist

| #   | Check          | Command                     | Expected Result             |
| --- | -------------- | --------------------------- | --------------------------- |
| 1   | Binary exists  | `ls .../mcp_server/.venv/bin/ccc` | File exists             |
| 2   | Help works     | `ccc --help`                | Help text displayed         |
| 3   | Status works   | `ccc status`                | Index stats output          |
| 4   | Index exists   | `ls -d .cocoindex_code/`    | Directory exists            |
| 5   | Search works   | `ccc search "test"`         | Results returned            |
| 6   | MCP mode       | `ccc mcp` (then Ctrl+C)    | Server starts, no errors    |

### Verify in Your AI Client

In your AI client, ask:
```
Search the codebase for "error handling patterns"
```

Expected result: The AI uses the CocoIndex Code search tool and returns relevant code snippets with file paths and relevance scores.

### Validation: `phase_5_complete`

All 6 checklist items above pass with no errors. Your AI client successfully runs a semantic search on request.

**STOP if validation fails.** Check MCP configuration, restart your AI client, and review [Troubleshooting](#9-troubleshooting).

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:usage -->
## 6. USAGE

### Pattern 1: Basic Semantic Search

```bash
ccc search "authentication middleware"
# Returns code snippets related to authentication, ranked by relevance
```

### Pattern 2: Language-Filtered Search

```bash
ccc search "database connection" --lang python
# Only searches Python files
```

### Pattern 3: Path-Scoped Search

```bash
ccc search "error handling" --path src/api/
# Only searches within the src/api/ directory
```

### Pattern 4: Paginated Results

```bash
ccc search "configuration" --limit 5 --offset 10
# Get results 11-15
```

### Pattern 5: Rebuild Index After Changes

```bash
# Full rebuild
ccc index

# Force refresh during search
ccc search "my query" --refresh
```

### Pattern 6: Check Index Status

```bash
ccc status
# Shows: indexed files, languages, index size, last update
```

### Tool Selection Guide

| Scenario                               | Tool           | Why                            |
| -------------------------------------- | -------------- | ------------------------------ |
| "How does X work?"                     | CocoIndex Code | Semantic understanding         |
| Find exact function name               | Grep           | Exact text match               |
| Find files by extension                | Glob           | Pattern-based file discovery   |
| Understand feature implementation      | CocoIndex Code | Cross-file concept search      |
| Find all TODO comments                 | Grep           | Exact pattern match            |
| "Where is error handling done?"        | CocoIndex Code | Intent-based search            |

<!-- /ANCHOR:usage -->

---

<!-- ANCHOR:features -->
## 7. FEATURES

### Supported Languages (28+)

| Language    | Extension(s)                   | Language     | Extension(s)           |
| ----------- | ------------------------------ | ------------ | ---------------------- |
| Python      | `.py`                          | Kotlin       | `.kt`, `.kts`          |
| TypeScript  | `.ts`                          | Scala        | `.scala`               |
| JavaScript  | `.js`                          | Swift        | `.swift`               |
| TSX         | `.tsx`                         | Dart         | `.dart`                |
| JSX         | `.jsx`                         | Lua          | `.lua`                 |
| Rust        | `.rs`                          | R            | `.r`, `.R`             |
| Go          | `.go`                          | Julia        | `.jl`                  |
| Java        | `.java`                        | Elixir       | `.ex`, `.exs`          |
| C           | `.c`, `.h`                     | Haskell      | `.hs`                  |
| C++         | `.cpp`, `.cc`, `.cxx`, `.hpp`  | OCaml        | `.ml`, `.mli`          |
| C#          | `.cs`                          | Perl         | `.pl`, `.pm`           |
| SQL         | `.sql`                         | PHP          | `.php`                 |
| Bash        | `.sh`, `.bash`                 | Ruby         | `.rb`                  |
| Markdown    | `.md`                          | YAML         | `.yml`, `.yaml`        |
| Text        | `.txt`                         | TOML         | `.toml`                |

### Embedding Model

| Property        | Value                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| **Default**     | `jinaai/jina-embeddings-v2-base-code` (local, no API key, 768 dimensions)            |
| **Cloud option** | Voyage Code 3 via LiteLLM (API key required, rebuild required)             |
| **Flexibility** | 7+ models supported including OpenAI, Gemini, Cohere, Ollama, Nomic         |
| **Config**      | `~/.cocoindex_code/global_settings.yml` (see [Settings Reference](references/settings_reference.md)) |

### CLI Commands

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `ccc search`      | Semantic search across codebase      |
| `ccc index`       | Build or update the semantic index   |
| `ccc status`      | Show project and index statistics    |
| `ccc init`        | Initialize project index directory   |
| `ccc reset`       | Reset databases                      |
| `ccc mcp`         | Run as MCP server (stdio mode)       |
| `ccc daemon`      | Manage background daemon             |

### MCP Tools

| Tool       | Parameters                                          | Description                |
| ---------- | --------------------------------------------------- | -------------------------- |
| `search`   | query (required), lang, path, limit, offset         | Semantic code search       |
| `status`   | none                                                | Index statistics           |
| `index`    | none                                                | Trigger index build/update |
| `reset`    | none                                                | Reset the index            |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:examples -->
## 8. EXAMPLES

### Example 1: Find Authentication Logic

```bash
ccc search "how does user authentication work"
# Returns: login handlers, auth middleware, token validation, session management
```

### Example 2: Search Specific Language

```bash
ccc search "database migration" --lang python
# Returns: only Python files related to database migrations
```

### Example 3: Scoped Search in Directory

```bash
ccc search "API route handlers" --path src/routes/ --limit 5
# Returns: top 5 matches within src/routes/
```

### Example 4: Find Error Handling Patterns

```bash
ccc search "error handling and recovery" --lang typescript
# Returns: try/catch blocks, error boundaries, retry logic in TypeScript files
```

### Example 5: Discover Test Patterns

```bash
ccc search "unit test setup and teardown"
# Returns: test fixtures, beforeEach/afterEach, test helpers across all languages
```

### Example 6: Index Management

```bash
# Check current index state
ccc status

# Rebuild after major changes
ccc index

# Reset and start fresh
ccc reset
ccc init
ccc index
```

<!-- /ANCHOR:examples -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

### Error/Cause/Fix Reference

| Error | Cause | Fix |
| ----- | ----- | --- |
| `command not found: ccc` | Binary not in PATH or venv not activated | Use full path: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc` |
| `Python 3.11 not found` | Python 3.11 not installed | Install with `brew install python@3.11` (macOS) or `apt install python3.11` (Linux) |
| `No such file or directory: .cocoindex_code/` | Index not initialized | Run `ccc init` then `ccc index` from project root |
| `ModuleNotFoundError` | Package not installed in venv | Re-run `bash .opencode/skills/mcp-coco-index/scripts/install.sh` |
| Fork version missing | Upstream PyPI install overrode the local editable fork | Re-run `bash .opencode/skills/mcp-coco-index/scripts/install.sh` and verify `ccc --version` contains `+spec-kit-fork.` |
| `No results found` | Index is empty or stale | Run `ccc index` to rebuild. Check `ccc status` for indexed file count |
| `MCP server not appearing in tools` | Config file error or path incorrect | Verify config JSON syntax and binary path. Restart AI client |
| `COCOINDEX_CODE_ROOT_PATH not set` | Environment variable missing from config | Add `COCOINDEX_CODE_ROOT_PATH` to your MCP config's env section |
| `Permission denied` | Binary not executable | Run `chmod +x .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc` |

### Binary Not Found

```bash
# Use the full venv path
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc --help

# Or add to your shell profile
echo 'alias ccc=".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"' >> ~/.zshrc
source ~/.zshrc
```

### Empty Search Results

```bash
# Check if index has content
ccc status

# If index is empty, rebuild
ccc index

# If still empty, verify COCOINDEX_CODE_ROOT_PATH points to your project
echo $COCOINDEX_CODE_ROOT_PATH
```

### MCP Server Not Connecting

1. Verify the binary path exists:
   ```bash
   ls -la .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc
   ```

2. Test MCP mode directly:
   ```bash
   .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp
   # Should start without errors (Ctrl+C to stop)
   ```

3. Check your config file for syntax errors:
   ```bash
   python3 -m json.tool < .mcp.json
   ```

4. Restart your AI client completely.

### Venv Corrupted

```bash
# Remove and recreate
rm -rf .opencode/skills/mcp-coco-index/mcp_server/.venv
bash .opencode/skills/mcp-coco-index/scripts/install.sh
```

### Fork Version Missing

If `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc --version` does not contain `+spec-kit-fork.`, an upstream PyPI install has overridden the local fork. Re-run:

```bash
bash .opencode/skills/mcp-coco-index/scripts/install.sh
```

### Operator recovery from stale daemon

Use this procedure when `pgrep -fc "ccc run-daemon"` returns more than 1, or when a daemon is unreachable despite `daemon.pid` pointing at a live process.

The daemon resilience patch set made normal startup idempotent. Manual cleanup can still be useful after a forced process kill, a hard shutdown or a stale socket left by older builds.

Before you start:

- Stop active searches that use the same daemon.
- Keep the current `daemon.log` window if you need evidence.
- Run the commands from the same shell that normally runs `ccc`.
- Restart the AI client only after `ccc status` reaches the fresh daemon.

1. `pkill -f "ccc run-daemon"`. Terminate all daemon processes.
2. `pgrep -fc "ccc run-daemon"`. Confirm returns 0.
3. Optional: `pgrep -f multiprocessing.resource_tracker`. Orphan tracker children should self-exit.
4. `ls ~/.cocoindex_code/`. Inspect for stale `daemon.pid`, `daemon.sock`, `daemon.lock` and `daemon.spawn-lock`.
5. `ccc run-daemon`. Start fresh. The Patch 1 pre-flight, Patch 8 sibling-check and Patch 12 claim wait handle stale state automatically.
6. `ccc status` (or equivalent reachability probe). Confirm the new daemon is reachable.

The two lock files are 0-byte placeholders. They can survive across runs. Their content does not matter because the active state lives in the inode lock, so do not clean them up for size or content alone.

Expected result:

- One daemon process remains after step 5.
- `ccc status` reaches the daemon without connection errors.
- `daemon.pid` names the live daemon process.
- `daemon.sock` belongs to that daemon on POSIX systems.
- `daemon.lock` is held by the daemon process, and `daemon.spawn-lock` exists for client spawn coordination.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:resources -->
## 10. RESOURCES

### Related Documentation

| Document            | Location                                                                | Purpose                |
| ------------------- | ----------------------------------------------------------------------- | ---------------------- |
| SKILL.md            | `.opencode/skills/mcp-coco-index/SKILL.md`                          | Complete workflows     |
| Tool Reference      | `.opencode/skills/mcp-coco-index/references/tool_reference.md`       | CLI and MCP tools      |
| Search Patterns     | `.opencode/skills/mcp-coco-index/references/search_patterns.md`      | Query strategies       |
| Settings Reference  | `.opencode/skills/mcp-coco-index/references/settings_reference.md`   | Settings and embedding |
| Config Templates    | `.opencode/skills/mcp-coco-index/assets/config_templates.md`         | All 6 CLI configs      |

### File Locations

| Path                                                            | Purpose                    |
| --------------------------------------------------------------- | -------------------------- |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`  | Binary (venv install)      |
| `.opencode/skills/mcp-coco-index/scripts/install.sh`        | Install script             |
| `.opencode/skills/mcp-coco-index/scripts/update.sh`         | Update script              |
| `.cocoindex_code/`                                              | Semantic index (gitignored)|

### External Resources

- **Upstream**: [cocoindex-io/cocoindex-code](https://github.com/cocoindex-io/cocoindex-code)
- **PyPI upstream package**: [cocoindex-code](https://pypi.org/project/cocoindex-code/)
- **Default Embedding**: [EmbeddingGemma 300M](https://huggingface.co/jinaai/jina-embeddings-v2-base-code)
- **Cloud Embedding Option**: [Voyage Code 3](https://docs.voyageai.com/docs/embeddings)
- **Default Local Embedding**: [EmbeddingGemma 300M](https://huggingface.co/jinaai/jina-embeddings-v2-base-code)

<!-- /ANCHOR:resources -->

---

<!-- ANCHOR:quick-reference-card -->
## QUICK REFERENCE CARD

### Installation

```bash
bash .opencode/skills/mcp-coco-index/scripts/install.sh
```

### Index Management

```bash
ccc init                      # Initialize project
ccc index                     # Build/update index
ccc status                    # Check index stats
ccc reset                     # Reset databases
```

### Search

```bash
ccc search "query"                        # Basic search
ccc search "query" --lang python          # Language filter
ccc search "query" --path src/            # Path filter
ccc search "query" --limit 5             # Limit results
ccc search "query" --offset 10           # Pagination
ccc search "query" --refresh             # Force index refresh
```

### MCP Server

```bash
ccc mcp                       # Run as MCP server (stdio)
ccc daemon restart            # Restart background daemon
ccc daemon stop               # Stop daemon
ccc daemon status             # Check daemon status
```

### Validation Checkpoints Summary

| Checkpoint          | Meaning                              |
| ------------------- | ------------------------------------ |
| `phase_1_complete`  | Python 3.11+ verified                |
| `phase_2_complete`  | Binary installed and working         |
| `phase_3_complete`  | Index initialized and built          |
| `phase_4_complete`  | MCP configuration valid              |
| `phase_5_complete`  | End-to-end search operational        |

<!-- /ANCHOR:quick-reference-card -->

---

<!-- ANCHOR:version-history -->
## VERSION HISTORY

| Version | Date       | Changes                                                      |
| ------- | ---------- | ------------------------------------------------------------ |
| 1.2.1   | 2026-05-18 | Promote hybrid + reranker to default-on; swap reranker default GTE → `BAAI/bge-reranker-v2-m3` (GTE/MPS incompatibility) |
| 1.2.0   | 2026-05-18 | Add chunking tunables, hybrid (FTS5 + RRF), cross-encoder reranker (opt-in at the time) |
| 1.1.0   | 2026-03-18 | Add embedding model config, 28+ languages, settings reference |
| 1.0.0   | 2026-03-18 | Initial installation guide                                    |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or load the `mcp-coco-index` skill for detailed workflows.
<!-- /ANCHOR:version-history -->
