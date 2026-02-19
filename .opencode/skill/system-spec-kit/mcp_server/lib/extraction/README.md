---
title: "Extraction"
description: "Post-tool extraction pipeline for automated memory creation. Resolves memory IDs, orchestrates extraction, and gates PII/secret content before insert."
trigger_phrases:
  - "extraction pipeline"
  - "extraction adapter"
  - "redaction gate"
importance_tier: "normal"
---

# Extraction

> Post-tool extraction pipeline for automated memory creation. Resolves memory IDs, orchestrates extraction, and gates PII/secret content before insert.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The extraction module provides the post-tool extraction pipeline for automated memory creation. It handles two distinct concerns: orchestrating extraction with deterministic memory ID resolution (`extraction-adapter.ts`) and blocking PII or secret content before it reaches the memory insert path (`redaction-gate.ts`).

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 2 | `extraction-adapter.ts`, `redaction-gate.ts` |

### Key Features

| Feature | Description |
|---------|-------------|
| **Memory ID Resolution** | Deterministic ID fallback ensures stable identity across extraction runs |
| **Post-Tool Orchestration** | Extraction adapter coordinates the full pipeline from tool output to memory insert |
| **PII Detection** | Pattern-based scanning for personal identifiers before memory insert |
| **Secret Detection** | Pattern-based scanning for API keys, tokens, and credentials |
| **Redaction Gate** | Hard gate: content flagged by pattern detection is blocked from insert |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
extraction/
 extraction-adapter.ts    # Post-tool extraction orchestration with deterministic memory ID resolution
 redaction-gate.ts        # PII/secret redaction gate before memory insert
 README.md                # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `extraction-adapter.ts` | Resolves memory IDs with deterministic fallback; orchestrates post-tool extraction pipeline |
| `redaction-gate.ts` | Scans content for PII and secrets using pattern-based detection; blocks flagged content from insert |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Extraction Adapter (`extraction-adapter.ts`)

**Purpose**: Coordinate the post-tool extraction pipeline from tool result to memory insert.

| Aspect | Details |
|--------|---------|
| **Memory ID Resolution** | Resolves a stable `memory_id` from tool output; falls back to deterministic hash if none provided |
| **Pipeline Orchestration** | Sequences: ID resolution -> content prep -> redaction gate -> memory insert |
| **Deterministic Fallback** | Hash-based ID generation ensures idempotent re-runs produce the same ID |

### Redaction Gate (`redaction-gate.ts`)

**Purpose**: Block PII and secret content before it enters the memory store.

| Aspect | Details |
|--------|---------|
| **PII Patterns** | Email addresses, phone numbers, national IDs, full names in structured fields |
| **Secret Patterns** | API keys, bearer tokens, private keys, connection strings, `.env`-style assignments |
| **Gate Behaviour** | Returns `{ allowed: boolean, reasons: string[] }` — content is blocked if `allowed === false` |
| **Pattern Source** | Regex-based, inline pattern list (no external dependency) |

**Gate result shape:**

| Field | Type | Description |
|-------|------|-------------|
| `allowed` | `boolean` | `true` if content passed all checks, `false` if blocked |
| `reasons` | `string[]` | Human-readable list of matched patterns that triggered a block |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Run the Redaction Gate Before Insert

```typescript
import { checkRedactionGate } from './extraction/redaction-gate';

const content = 'User token: sk-abc123xyz, email: user@example.com';

const result = checkRedactionGate(content);

if (!result.allowed) {
  console.warn('Content blocked before memory insert:', result.reasons);
  // Content blocked before memory insert: ['API key pattern matched', 'Email address detected']
} else {
  // Proceed to memory insert
}
```

### Example 2: Resolve a Memory ID with Deterministic Fallback

```typescript
import { resolveMemoryId } from './extraction/extraction-adapter';

// Tool output may or may not include an explicit memory_id
const toolOutput = { content: 'session summary text', memory_id: undefined };

const memoryId = resolveMemoryId(toolOutput);
// Falls back to deterministic hash of content if memory_id is absent
console.log(`Resolved ID: ${memoryId}`);
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Gate before insert | `checkRedactionGate(content)` | All automated extraction paths |
| Resolve ID | `resolveMemoryId(toolOutput)` | Before any write to memory store |
| Log block reasons | `result.reasons.join(', ')` | Observability / audit logging |

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [lib/contracts/README.md](../contracts/README.md) | Retrieval pipeline contracts |
| [lib/storage/README.md](../storage/README.md) | Storage layer (memory insert, transactions) |

### Related Modules

| Module | Purpose |
|--------|---------|
| `handlers/memory-save.ts` | Downstream consumer after extraction gate passes |
| `hooks/memory-surface.ts` | Triggers extraction pipeline post-tool |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-19
