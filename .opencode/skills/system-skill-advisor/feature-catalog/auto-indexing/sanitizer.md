---
title: "A7 Sanitizer at Every Write Boundary"
description: "Skill-label sanitizer applied at every public write boundary (SQLite, graph-metadata derived, envelope, diagnostics) to prevent unsafe labels from crossing trust surfaces."
trigger_phrases:
  - "a7 sanitizer"
  - "sanitizeSkillLabel"
  - "write boundary sanitizer"
  - "skill label hygiene"
version: 0.8.0.13
---

# A7 Sanitizer at Every Write Boundary

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keep malformed or malicious skill labels out of every surface that touches trust: SQLite rows, graph-metadata derived writes, response envelopes and adapter diagnostics. A single sanitizer, applied at every boundary, is the routing surface's anti-injection line.

## 2. HOW IT WORKS

`lib/derived/sanitizer.ts` normalizes skill labels to the slug shape `[a-z0-9][a-z0-9-]*` and rejects control characters, path separators and prompt-shaped content. It runs at four write boundaries:

1. SQLite persistence writes from the daemon.
2. `graph-metadata.json.derived` writes from `lib/derived/sync.ts`.
3. Response envelopes emitted by `handlers/advisor-recommend.ts`.
4. Diagnostic records written by `hooks/*/user-prompt-submit.ts`.

Unsanitized labels never leak to readers.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-privacy.vitest.ts` | Automated test | boundary sanitization |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend.vitest.ts` | Automated test | envelope sanitization |
| `Playbook scenario [AI-002](../../manual-testing-playbook/auto-indexing/sanitizer-boundaries.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `auto-indexing/sanitizer.md`

Related references:

- [01-derived-extraction.md](../../feature-catalog/auto-indexing/derived-extraction.md).
- [05-anti-stuffing.md](../../feature-catalog/auto-indexing/anti-stuffing.md).
- [`mcp-surface/advisor-recommend.md`](../../feature-catalog/mcp-surface/advisor-recommend.md).
