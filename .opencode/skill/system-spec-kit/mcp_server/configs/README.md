# MCP Server Configuration Files

> Search weight configuration and system parameters for the Spec Kit Memory MCP server.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚙️ CONFIGURATION OPTIONS](#4--configuration-options)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

## 1. 📖 OVERVIEW

### What is this folder?

The `configs/` folder contains JSON configuration files that control search behavior and ranking algorithms for the Spec Kit Memory MCP server. These configurations tune how semantic search results are ranked, weighted, and prioritized.

### Key Features

| Feature | Description |
|---------|-------------|
| **Search Weight Tuning** | Configure recency, access count, and relevance weights for result ranking |
| **Trigger Limits** | Set maximum trigger phrases per memory for performance |
| **Smart Ranking** | Balance between recent activity, access frequency, and semantic relevance |

### Requirements

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | Runtime for MCP server |
| JSON | - | Configuration format |

---

## 2. 🚀 QUICK START

### Viewing Current Configuration

```bash
# View the current search weights
cat .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
```

### Modifying Configuration

```bash
# Edit the configuration file
nano .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json

# Restart the MCP server for changes to take effect
# (Server automatically reloads configuration on restart)
```

### Verify Configuration

```bash
# Use memory_stats tool to verify configuration is loaded
# The tool will reflect updated weights in search results
```

---

## 3. 📁 STRUCTURE

```
configs/
└── search-weights.json    # Search ranking configuration (v1.7.2)
```

### Key Files

| File | Purpose |
|------|---------|
| `search-weights.json` | Controls smart ranking algorithm weights and trigger limits |

---

## 4. ⚙️ CONFIGURATION OPTIONS

### Configuration File

**Location**: `search-weights.json`

```json
{
  "_comment": "Search weight configuration for semantic memory v1.7.2",
  "_version": "1.7.2",
  "maxTriggersPerMemory": 10,
  "smartRanking": {
    "recencyWeight": 0.5,
    "accessWeight": 0.3,
    "relevanceWeight": 0.2
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxTriggersPerMemory` | number | 10 | Maximum trigger phrases to store per memory file |
| `smartRanking.recencyWeight` | number | 0.5 | Weight for temporal recency (0.0-1.0) |
| `smartRanking.accessWeight` | number | 0.3 | Weight for access count popularity (0.0-1.0) |
| `smartRanking.relevanceWeight` | number | 0.2 | Weight for semantic similarity (0.0-1.0) |

### Weight Tuning Guidelines

**Total weights should sum to 1.0 for balanced scoring.**

| Use Case | Recommended Settings |
|----------|---------------------|
| **Prefer recent memories** | `recencyWeight: 0.6`, `accessWeight: 0.2`, `relevanceWeight: 0.2` |
| **Prefer frequently accessed** | `recencyWeight: 0.2`, `accessWeight: 0.6`, `relevanceWeight: 0.2` |
| **Pure semantic search** | `recencyWeight: 0.1`, `accessWeight: 0.1`, `relevanceWeight: 0.8` |
| **Balanced (default)** | `recencyWeight: 0.5`, `accessWeight: 0.3`, `relevanceWeight: 0.2` |

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Increase Relevance Weight

```json
{
  "_comment": "Prioritize semantic similarity over recency",
  "_version": "1.7.2",
  "maxTriggersPerMemory": 10,
  "smartRanking": {
    "recencyWeight": 0.2,
    "accessWeight": 0.2,
    "relevanceWeight": 0.6
  }
}
```

**Result**: Search results prioritize semantic relevance over temporal factors.

### Example 2: Limit Trigger Phrases

```json
{
  "_comment": "Reduce triggers for faster matching",
  "_version": "1.7.2",
  "maxTriggersPerMemory": 5,
  "smartRanking": {
    "recencyWeight": 0.5,
    "accessWeight": 0.3,
    "relevanceWeight": 0.2
  }
}
```

**Result**: Faster trigger matching with fewer phrases per memory (trades recall for speed).

### Example 3: Recency-Focused Configuration

```json
{
  "_comment": "Favor recent memories for active projects",
  "_version": "1.7.2",
  "maxTriggersPerMemory": 10,
  "smartRanking": {
    "recencyWeight": 0.7,
    "accessWeight": 0.2,
    "relevanceWeight": 0.1
  }
}
```

**Result**: Recent memories surface first, useful during active development.

### Common Patterns

| Pattern | Configuration | When to Use |
|---------|--------------|-------------|
| Default | `0.5, 0.3, 0.2` | General purpose search |
| Research | `0.1, 0.1, 0.8` | Deep semantic exploration |
| Active Dev | `0.7, 0.2, 0.1` | Current project focus |
| Popular First | `0.2, 0.7, 0.1` | Frequently referenced docs |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Configuration Not Loading

**Symptom**: Changes to `search-weights.json` have no effect on search results

**Cause**: MCP server caches configuration on startup

**Solution**:
```bash
# Restart the MCP server to reload configuration
# (Stop and restart via your MCP client or opencode.json)
```

#### Invalid Weight Values

**Symptom**: Search results behave unexpectedly or errors occur

**Cause**: Weights are negative, sum to values far from 1.0, or are non-numeric

**Solution**:
```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('configs/search-weights.json', 'utf8'))"

# Ensure weights sum to ~1.0
# Ensure all weights are 0.0-1.0 range
```

#### Trigger Matching Performance

**Symptom**: `memory_match_triggers` is slower than expected

**Cause**: `maxTriggersPerMemory` is too high

**Solution**: Reduce to 5-8 triggers per memory for faster matching.

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Config not loaded | Restart MCP server |
| Invalid JSON | Validate with `node -e` command |
| Poor results | Reset to defaults: `0.5, 0.3, 0.2` |

### Diagnostic Commands

```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json', 'utf8'))"

# View effective configuration (check server logs on startup)
# Server logs: "Loaded search weights: {recencyWeight: 0.5, ...}"
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Complete MCP server documentation |
| [Hybrid Search Module](../lib/search/hybrid-search.js) | Implementation of search weight application |
| [Composite Scoring Module](../lib/scoring/composite-scoring.js) | Score calculation using these weights |

### External Resources

| Resource | Description |
|----------|-------------|
| [Spec Kit Memory Skill](../../SKILL.md) | Parent skill documentation |
| [Memory Search Reference](../../references/memory/save_workflow.md) | Search workflow patterns |

---

*Configuration version: 1.7.2 | Last updated: 2026-01-15*
