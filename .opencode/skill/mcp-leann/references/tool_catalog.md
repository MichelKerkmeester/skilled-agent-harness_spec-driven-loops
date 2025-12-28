---
title: LEANN Tool Catalog - Command Reference
description: Reference for all 5 LEANN commands. Uses MLX + Qwen3 embeddings on Apple Silicon.
---

# LEANN Tool Catalog - Command Reference

Reference for all 5 LEANN commands. Use `leann --help` for dynamic discovery.

> **IMPORTANT**: LEANN is for **CODE search only** (index `src/` folder). For document/spec search, use **Spec Kit Memory MCP**.

---

## 1. 📖 OVERVIEW

### CLI Discovery

```bash
leann --help           # List all commands
leann build --help     # Get build parameters
leann search --help    # Get search parameters
leann ask --help       # Get ask parameters
```

### Available Commands

| Command   | Purpose              | Speed |
| --------- | -------------------- | ----- |
| `build`   | Create vector index  | 1-60s |
| `search`  | Semantic search      | <1s   |
| `ask`     | RAG Q&A with LLM     | 2-10s |
| `list`    | Show indexes         | <1s   |
| `remove`  | Delete index         | <1s   |

---

## 2. 🔨 LEANN BUILD

Create a vector index from source code.

### Usage

```bash
# Using shell alias (recommended)
leann-build <name> --docs src/

# Full command
leann build <name> --docs src/ --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"
```

### Parameters

| Parameter            | Type   | Required | Default                               | Description           |
| -------------------- | ------ | -------- | ------------------------------------- | --------------------- |
| `name`               | string | Yes      | -                                     | Index name            |
| `--docs`             | path   | Yes      | -                                     | Directory to index    |
| `--embedding-mode`   | string | No       | mlx                                   | Embedding provider    |
| `--embedding-model`  | string | No       | Qwen3-Embedding-0.6B-4bit-DWQ         | Embedding model       |
| `--backend-name`     | string | No       | hnsw                                  | `hnsw` or `diskann`   |
| `--file-types`       | string | No       | all                                   | Filter by extensions  |
| `--use-ast-chunking` | flag   | No       | false                                 | AST-aware chunking    |
| `--force`            | flag   | No       | false                                 | Force rebuild         |

### Examples

```bash
# Basic (src/ only)
leann-build my-project --docs src/

# With file type filter
leann-build my-project --docs src/ --file-types ".js,.ts,.py"

# With AST chunking
leann-build my-project --docs src/ --use-ast-chunking

# Large project with DiskANN
leann-build my-project --docs src/ --backend-name diskann
```

---

## 3. 🔍 LEANN SEARCH

Semantic search within an index.

### Usage

```bash
leann search <name> "<query>" [--top-k N]
```

### Parameters

| Parameter      | Type   | Required | Default | Description          |
| -------------- | ------ | -------- | ------- | -------------------- |
| `name`         | string | Yes      | -       | Index name           |
| `query`        | string | Yes      | -       | Natural language     |
| `--top-k`      | int    | No       | 5       | Number of results    |
| `--complexity` | int    | No       | 64      | Search complexity    |

### Examples

```bash
leann search my-project "authentication logic"
leann search my-project "error handling" --top-k 20
```

### Output

```
Results for: "authentication logic"

1. [0.89] src/auth/login.ts:45-78
   User authentication with JWT token validation...

2. [0.82] src/middleware/auth.ts:12-34
   Authentication middleware for protected routes...
```

---

## 4. 💬 LEANN ASK

RAG-powered Q&A over your codebase.

### Usage

```bash
leann ask <name> "<question>"
```

### Parameters

| Parameter   | Type   | Required | Default  | Description           |
| ----------- | ------ | -------- | -------- | --------------------- |
| `name`      | string | Yes      | -        | Index name            |
| `question`  | string | Yes      | -        | Natural language      |
| `--llm`     | string | No       | ollama   | LLM provider          |
| `--model`   | string | No       | qwen3:8b | Model name            |
| `--top-k`   | int    | No       | 20       | Context chunks        |

### Examples

```bash
leann ask my-project "How does authentication work?"
leann ask my-project "What are the API endpoints?" --top-k 30
```

---

## 5. 📋 LEANN LIST & REMOVE

### List Indexes

```bash
leann list
```

Output:
```
Available indexes:

  Name             Backend    Chunks    Created
  ─────────────────────────────────────────────
  my-project       hnsw       1,234     2024-12-20
  
Total: 1 indexes
```

### Remove Index

```bash
leann remove <name>
```

---

## 6. ⚙️ CONFIGURATION

### Shell Alias (Required)

```bash
# Add to ~/.zshrc
alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'
```

### Environment Variables

| Variable                | Default                                       | Description        |
| ----------------------- | --------------------------------------------- | ------------------ |
| `LEANN_INDEX_DIR`       | `~/.leann/indexes`                            | Index storage      |
| `LEANN_EMBEDDING_MODE`  | `mlx`                                         | Embedding provider |
| `LEANN_EMBEDDING_MODEL` | `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` | Embedding model    |
| `OLLAMA_HOST`           | `http://localhost:11434`                      | Ollama URL         |

---

## 7. 🔧 TROUBLESHOOTING

### Index Not Found

```bash
leann list
leann-build my-project --docs src/
```

### No Results

```bash
# Verify index has content
leann list  # Check 'Chunks' column

# Try broader query
leann search my-project "login" --top-k 20
```

### Out of Memory

```bash
# Reduce scope
leann-build my-project --docs src/ --file-types ".js,.ts"

# Use DiskANN
leann-build my-project --docs src/ --backend-name diskann
```

### Ollama Connection Error

```bash
brew services start ollama
ollama list
```

---

## 8. 🔗 RELATED RESOURCES

### Reference Files

- [SKILL.md](../SKILL.md) - AI agent instructions
- [MCP - LEANN.md](../../../install_guides/MCP/MCP%20-%20LEANN.md) - Installation guide

### External

- [LEANN Repository](https://github.com/yichuan-w/LEANN)
- [Ollama](https://ollama.com)

---

## Quick Reference

```bash
# Build (src/ only)
leann-build my-project --docs src/

# Search
leann search my-project "authentication logic"

# Ask
leann ask my-project "How does error handling work?"

# List
leann list

# Remove
leann remove old-index
```

**Remember**: LEANN is a **NATIVE MCP tool**. Call directly, not through Code Mode.
