---
title: "deep-ai-council Test Suite"
description: "Integration + parity vitests for deep-ai-council orchestration: orchestrate-topic, orchestrate-session, findings-registry, integration e2e."
---

# deep-ai-council Tests

---

## 1. OVERVIEW

vitest harnesses validating deep-ai-council orchestration and registry behavior. Run via the sibling `system-spec-kit` vitest config.

## 2. TEST INVENTORY

| Test File | Coverage |
|-----------|----------|
| `orchestrate-topic.vitest.ts` | Per-topic multi-round orchestration; verdict-stable + max-rounds + saturation termination |
| `orchestrate-session.vitest.ts` | Multi-topic session loop + cross-topic cost guards |
| `findings-registry.vitest.ts` | Canonical fingerprint append + loadRegistry + getCrossTopicPriors |
| `integration-deep-mode-e2e.vitest.ts` | Full session through orchestrators + registry + state hierarchy |

## 3. HOW TO RUN

```bash
cd .opencode/skills/system-spec-kit/mcp_server
node_modules/.bin/vitest run --no-coverage \
  /absolute/path/to/.opencode/skills/deep-loop-workflows/ai-council/scripts/tests/<filename>.vitest.ts
```

## 4. RELATED RESOURCES

- `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md` - skill overview
- `.opencode/skills/deep-loop-workflows/ai-council/scripts/orchestrate-topic.cjs` - primary subject under test
- `.opencode/skills/deep-loop-runtime/lib/council/` - primitives consumed by orchestrators
