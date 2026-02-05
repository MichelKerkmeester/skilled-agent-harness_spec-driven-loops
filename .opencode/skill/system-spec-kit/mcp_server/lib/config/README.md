# Memory Type Configuration

> 9-type cognitive memory system with differentiated half-lives and automatic type inference from file paths, frontmatter, and keywords.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📊 KEY CONCEPTS](#2--key-concepts)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 💡 USAGE](#4--usage)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

### What is the Config Module?

The config module defines the 9 cognitive memory types used in the Spec Kit Memory system. Each type has a differentiated half-life that controls how quickly memories decay, enabling the system to naturally prioritize recent working context while preserving long-term architectural knowledge.

### Key Features

| Feature | Description |
|---------|-------------|
| **9 Memory Types** | From working (1-day half-life) to meta-cognitive (never decays) |
| **Automatic Inference** | Detect memory type from path, frontmatter, or keywords |
| **Tier Mapping** | Link importance tiers to appropriate memory types |
| **Validation** | Verify type assignments and warn on mismatches |

### Module Statistics

| Category | Count | Details |
|----------|-------|---------|
| Memory Types | 9 | Cognitive categories with differentiated decay |
| Path Patterns | 30+ | Regex patterns for type inference |
| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
| Half-Life Range | 1-365 days | Plus null for never-decay |

---

## 2. 📊 KEY CONCEPTS

### Memory Types and Half-Lives

| Type | Half-Life | Auto-Expire | Description |
|------|-----------|-------------|-------------|
| **working** | 1 day | 7 days | Active session context, immediate task state |
| **episodic** | 7 days | 30 days | Event-based: sessions, debugging, discoveries |
| **prospective** | 14 days | 60 days | Future intentions: TODOs, next steps, plans |
| **implicit** | 30 days | 120 days | Learned patterns: code styles, workflows |
| **declarative** | 60 days | 180 days | Facts: implementations, APIs, technical details |
| **procedural** | 90 days | 365 days | How-to: processes, procedures, guides |
| **semantic** | 180 days | Never | Core concepts: architecture, design principles |
| **autobiographical** | 365 days | Never | Project history: milestones, major decisions |
| **meta-cognitive** | Never | Never | Rules about rules: constitutional, invariants |

### Type Inference Priority

The system infers memory type using this precedence:

| Priority | Source | Confidence | Example |
|----------|--------|------------|---------|
| 1 | Frontmatter explicit | 1.0 | `memory_type: procedural` |
| 2 | Importance tier | 0.9 | `importance_tier: constitutional` -> meta-cognitive |
| 3 | File path pattern | 0.8 | `/scratch/` -> working |
| 4 | Keyword analysis | 0.7 | Title contains "how to" -> procedural |
| 5 | Default | 0.5 | Falls back to `declarative` |

### Tier to Type Mapping

| Importance Tier | Inferred Type | Rationale |
|-----------------|---------------|-----------|
| constitutional | meta-cognitive | Rules that never decay |
| critical | semantic | Core concepts, high persistence |
| important | declarative | Important facts |
| normal | declarative | Standard content |
| temporary | working | Session-scoped, fast decay |
| deprecated | episodic | Historical, kept for reference |

### Path Pattern Examples

| Pattern | Type | Example Paths |
|---------|------|---------------|
| `/scratch/`, `/temp/` | working | `specs/scratch/debug.md` |
| `session-\d+`, `debug-log` | episodic | `memory/session-1.md` |
| `todo`, `next-steps` | prospective | `memory/next-steps.md` |
| `guide`, `checklist` | procedural | `docs/install-guide.md` |
| `architecture`, `adr-\d+` | semantic | `docs/adr-001.md` |
| `constitutional`, `claude.md` | meta-cognitive | `AGENTS.md`, `AGENTS.md` |

---

## 3. 📁 STRUCTURE

```
config/
├── index.js              # Module aggregator (re-exports all)
├── memory-types.js       # 9 memory types with half-lives and patterns
├── type-inference.js     # Auto-detect type from path/content
└── README.md             # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `memory-types.js` | Type definitions, half-lives, path/keyword patterns |
| `type-inference.js` | Multi-source inference with confidence scoring |
| `index.js` | Unified exports for both modules |

---

## 4. 💡 USAGE

### Example 1: Get Type Configuration

```javascript
const { get_type_config, get_half_life, is_decay_enabled } = require('./config');

const config = get_type_config('procedural');
// Returns: { halfLifeDays: 90, autoExpireDays: 365, decayEnabled: true, description: '...' }

const halfLife = get_half_life('working');
// Returns: 1

const decays = is_decay_enabled('meta-cognitive');
// Returns: false
```

### Example 2: Infer Memory Type

```javascript
const { infer_memory_type } = require('./config');

// From file path
const result1 = infer_memory_type({
  filePath: 'specs/012-auth/scratch/debug.md',
});
// Returns: { type: 'working', source: 'file_path', confidence: 0.8 }

// From frontmatter
const result2 = infer_memory_type({
  content: '---\nmemory_type: semantic\n---\n# Architecture Overview',
});
// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }

// From keywords
const result3 = infer_memory_type({
  title: 'How to configure authentication',
  triggerPhrases: ['auth guide', 'setup steps'],
});
// Returns: { type: 'procedural', source: 'keywords', confidence: 0.7 }
```

### Example 3: Batch Inference

```javascript
const { infer_memory_types_batch } = require('./config');

const memories = [
  { file_path: 'memory/session-1.md', title: 'Debug Session' },
  { file_path: 'docs/architecture.md', title: 'System Design' },
];

const results = infer_memory_types_batch(memories);
// Returns: Map { 'memory/session-1.md' => { type: 'episodic', ... }, ... }
```

### Example 4: Validate Inferred Type

```javascript
const { validate_inferred_type } = require('./config');

const validation = validate_inferred_type('declarative', '/specs/scratch/temp.md');
// Returns: { valid: false, warnings: ['Temporary file has slow-decay type'] }
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| List valid types | `get_valid_types()` | Validation, UI dropdowns |
| Check type valid | `is_valid_type('working')` | Input validation |
| Get default | `get_default_type()` | Fallback assignment |
| Reset config | `get_default_half_lives()` | Config recovery |

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../scoring/README.md](../scoring/README.md) | Composite scoring with tier integration |
| [../cognitive/README.md](../cognitive/README.md) | Attention decay using half-lives |
| [../../configs/search-weights.json](../../configs/search-weights.json) | Runtime weight configuration |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../../README.md](../../README.md) | MCP server overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
