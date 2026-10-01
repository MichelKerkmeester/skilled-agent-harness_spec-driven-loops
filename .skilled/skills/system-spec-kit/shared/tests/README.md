---
title: "Shared Tests: Coverage for the Shared Package"
description: "The suites that cover the modules under shared/, from frontmatter parsing and the predicate grammar to the embedding provider stack."
trigger_phrases:
  - "shared tests"
  - "spec kit shared test suites"
  - "shared package coverage"
---

# Shared Tests: Coverage for the Shared Package

---

## 1. OVERVIEW

`tests/` holds one suite per shared module. Each file imports its subject from a sibling source folder (`../frontmatter/`, `../parsing/`, `../utils/`, `../ipc/`, `../embeddings/`, `../predicates/`) or from a top-level module such as `../chunking.js`, and asserts the behavior that module promises today. The folder is flat, so there is no tree to walk.

Current state:

- Two conventions live side by side. Most files are script-style: assertions run at module top level, the first failure throws, and a success line goes to stdout. `chunking.test.ts`, `retry.test.ts` and `readme-env-readers.test.ts` declare `node:test` cases with `node:assert/strict` instead.
- Both conventions run in the same lane, because `npm test` globs every `tests/*.test.ts` file. A script-style file passes by exiting without a throw.
- Coverage is deliberately uneven. The suites that exist hold invariants a refactor could break silently, such as a canonical model fallback, a socket directory the client and the binder both spell out, or a README table generated from code.
- Three suites read past the shared package into `.skilled/bin/` or a `.skilled/commands/` asset, to prove that two declarations of the same literal stay equal.

---

## 2. FILES

| File | Coverage |
|---|---|
| `auto-select.test.ts` | `parseOllamaTags` and `providerResolutionFromAutoSelect` from `../embeddings/auto-select.js`, including missing and malformed tag payloads |
| `boolean-expr.test.ts` | The predicate grammar in `../predicates/boolean-expr.js`: string parsing, object validation, `parseWhenField`, the evaluator and prose-bleed detection. Also reads `.skilled/commands/speckit/assets/speckit-complete.yaml` and checks `write_continuity` keeps prose timing under `after:` rather than `when:` |
| `chunking.test.ts` | `semanticChunk` and `MAX_TEXT_LENGTH` from `../chunking.js`, on text under and over the limit |
| `config.test.ts` | The telemetry store directory from `config.ts`, read in a child process with `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR` and `MEMORY_DB_PATH` removed. It asserts the directory sits under the skill root, not under the shared package |
| `context-types.test.ts` | `resolveCanonicalContextType` and `isLegacyContextType` from `../context-types.js`, including the null result for an unknown value |
| `jsonc-strip.test.ts` | `stripJsoncComments` from `../utils/jsonc-strip.js`, both comment forms and the comment markers that appear inside string values |
| `model-server-constants.test.ts` | The socket directory and owner-lease file literals that the hf-local client, `.skilled/bin/lib/model-server-supervision.cjs` and `.skilled/bin/system-skill-advisor-launcher.cjs` declare separately. Nothing imports across that boundary, so this test is what keeps the copies equal |
| `parse-frontmatter.test.ts` | `parseFrontmatter` from `../frontmatter/parse-frontmatter.js`: no fence, CRLF endings, a fence that is not on line 1, inner `---` lines in the body and an unclosed fence |
| `profile.test.ts` | `resolveActiveProfileModel` fallbacks across the four providers, env override precedence, and a source-text scan of `../embeddings/profile.ts` that rejects the retired model literals in the function body |
| `readme-env-readers.test.ts` | `checkReadme()` from `../scripts/env-reader-table.mjs`, which proves the configuration table in `shared/README.md` still matches the environment reads in the code |
| `registry.test.ts` | `MANIFESTS`, `listManifests` and `getCanonicalFallback` from `../embeddings/registry.js`, including the ban on the legacy model defaults |
| `retry.test.ts` | `calculateBackoff`, `classifyError`, `getBackoffSequence`, `isPermanentError`, `isTransientError` and `retryWithBackoff` from `../utils/retry.js` |
| `secret-scrubber.test.ts` | `scrubSecrets` and `scrubSecretsDetailed` from `../parsing/secret-scrubber.js`, with AWS and Anthropic key samples and prose that carries no credentials |
| `socket-server.test.ts` | `parseMaxClients` and `SOCKET_FILE_NAME` from `../ipc/socket-server.js`. The second half reads `.skilled/bin/skill-advisor.cjs` and `.skilled/bin/system-skill-advisor-launcher.cjs`, which spell the socket file name as a literal because they run before the package is built |
| `spec-doc-health.test.ts` | `evaluateSpecDocHealth` from `../parsing/spec-doc-health.js`, run against fixture documents written to temporary directories |

---

## 3. VALIDATION

```bash
cd .skilled/skills/system-spec-kit/shared
npm test
```

The script is `node --import tsx --test 'tests/*.test.ts'`, so the suites run against the TypeScript sources. Expected result: the run exits zero, every `node:test` case reports as passing, and each script-style suite prints its own line such as `auto-select helpers ok`.

---

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`../../SKILL.md`](../../SKILL.md)
