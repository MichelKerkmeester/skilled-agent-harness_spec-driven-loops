# Pi Cache Optimizer Tests

---

## 1. OVERVIEW

Test suite for the pi-cache-optimizer extension, covering the six guarded hooks, cross-fork ownership composition, and the upstream review findings (prompt reordering, DeepSeek Pi-owned model detection, footer stats modes, adaptive-thinking compatibility, explicit compat precedence, and the non-DeepSeek-path hardening findings K1/K2/K5/K9). Tests use Node.js's built-in `node:test` runner and `jiti` for TypeScript module loading.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `hook-guards.test.ts` | Tests exercising the six guarded hooks (`session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, `message_end`) directly. Verifies that each hook suppresses its effects (restore, status, compatibility warnings, payload mutation, diagnostics, cache-stat recording) for DeepSeek-direct owned models, and that the ownership guard is structurally the first operation in each hook (with a negative control that breaks the guard and confirms the test catches it). Uses `node:test` and `jiti`. |
| `ownership-composition.test.ts` | Cross-fork tests proving `deep-pi` and `pi-cache-optimizer` never both react to the same model. Loads both extensions via `jiti`, compares predicates against the shared `deepseek-ownership.json` fixture, composes one owner from both predicates, and observes exactly one extension reacting in a combined host. Also asserts exhaustive allowlist equality between the two forks' DeepSeek ownership lists against the shared fixture, so a future drift between the duplicated lists fails immediately. Uses `node:test`. |
| `review-findings.test.ts` | Tests for upstream review findings: stable prompt reordering (ambiguous candidate preservation, deterministic lifting, dynamic content nesting), `isDeepPiOwned` model detection, footer stats modes (default/env/config precedence, scope selection, router restore, atomic config persistence, interactive menu), Pi 0.83 adaptive-thinking compatibility, and explicit compat precedence (modelOverrides over model over provider). Also covers the non-DeepSeek-path hardening findings: K1's model-scoped `prompt_cache_key` self-heal (generic-400 non-trigger, explicit-signal trigger, per-model opt-out), K2's adapter fallback (resolved-context recovery, virtual-router shell-identity rejection), and K5's TTL-repair gate extension (Anthropic-compatible-format coverage, late-only downgrade for visible conflicts, all-breakpoint fallback for hidden conflicts). Uses `node:test` and `jiti`. |

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
