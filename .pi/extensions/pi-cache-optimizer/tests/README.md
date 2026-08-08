# Pi Cache Optimizer Tests

---

## 1. OVERVIEW

Test suite for the pi-cache-optimizer extension, covering the six guarded hooks, cross-fork ownership composition, and the upstream review findings (prompt reordering, DeepSeek Pi-owned model detection, footer stats modes, adaptive-thinking compatibility, and explicit compat precedence). Tests use Node.js's built-in `node:test` runner and `jiti` for TypeScript module loading.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `hook-guards.test.ts` | Tests exercising the six guarded hooks (`session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, `message_end`) directly. Verifies that each hook suppresses its effects (restore, status, compatibility warnings, payload mutation, diagnostics, cache-stat recording) for DeepSeek-direct owned models. Uses `node:test` and `jiti`. |
| `ownership-composition.test.ts` | Cross-fork tests proving `deep-pi` and `pi-cache-optimizer` never both react to the same model. Loads both extensions via `jiti`, compares predicates against the shared `deepseek-ownership.json` fixture, composes one owner from both predicates, and observes exactly one extension reacting in a combined host. Uses `node:test`. |
| `review-findings.test.ts` | Tests for upstream review findings: stable prompt reordering (ambiguous candidate preservation, deterministic lifting, dynamic content nesting), `isDeepPiOwned` model detection, footer stats modes (default/env/config precedence, scope selection, router restore, atomic config persistence, interactive menu), Pi 0.83 adaptive-thinking compatibility, and explicit compat precedence (modelOverrides over model over provider). Uses `node:test` and `jiti`. |

---

## 3. VALIDATION

```bash
npm test
```

The test suite uses `node --test` with `jiti` for TypeScript transpilation. Run from the `pi-cache-optimizer` extension directory.

---

## 4. RELATED

- [pi-cache-optimizer README](../README.md)
- [Changes from Upstream](../CHANGES-FROM-UPSTREAM.md)
- [types/ README](../types/README.md)
