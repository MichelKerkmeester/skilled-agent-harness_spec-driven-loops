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

`tests/` holds one suite per shared module. Each file imports its subject from a sibling source folder (`../frontmatter/`, `../parsing/`, `../utils/`, `../ipc/`, `../predicates/`) or from a top-level module such as `../context-types.ts`, and asserts the behavior that module promises today. The folder is flat, so there is no tree to walk.

Current state:

- Two conventions live side by side. Most files are script-style: assertions run at module top level, the first failure throws, and a success line goes to stdout. `readme-env-readers.test.ts` declares `node:test` cases with `node:assert/strict` instead.
- Both conventions run in the same lane, because `npm test` globs every `tests/*.test.ts` file. A script-style file passes by exiting without a throw.
- Coverage is deliberately uneven. The suites that exist hold invariants a refactor could break silently, such as a socket file name two launchers spell out, or a README table generated from code.
- Two suites read past the shared package into `.skilled/bin/` or a `.skilled/commands/` asset, to prove that two declarations of the same literal stay equal.

---

## 2. FILES

| File | Coverage |
|---|---|
| `boolean-expr.test.ts` | The predicate grammar in `../predicates/boolean-expr.ts`: string parsing, object validation, `parseWhenField`, the evaluator and prose-bleed detection. Also reads `.skilled/commands/speckit/assets/speckit-save-context-tail.yaml` and checks `post_save_write` keeps prose timing under `after:` rather than `when:` |
| `config.test.ts` | The telemetry store directory from `config.ts`, read in a child process with `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR` and `MEMORY_DB_PATH` removed. It asserts the directory sits under the skill root, not under the shared package |
| `context-types.test.ts` | `resolveCanonicalContextType` and `isLegacyContextType` from `../context-types.ts`, including the null result for an unknown value |
| `jsonc-strip.test.ts` | `stripJsoncComments` from `../utils/jsonc-strip.ts`, both comment forms and the comment markers that appear inside string values |
| `parse-frontmatter.test.ts` | `parseFrontmatter` from `../frontmatter/parse-frontmatter.ts`: no fence, CRLF endings, a fence that is not on line 1, inner `---` lines in the body and an unclosed fence |
| `readme-env-readers.test.ts` | `checkReadme()` from `../scripts/env-reader-table.mjs`, which proves the configuration table in `shared/README.md` still matches the environment reads in the code |
| `secret-scrubber.test.ts` | `scrubSecrets` and `scrubSecretsDetailed` from `../parsing/secret-scrubber.ts`, with AWS and Anthropic key samples and prose that carries no credentials |
| `socket-server.test.ts` | `parseMaxClients` and `SOCKET_FILE_NAME` from `../ipc/socket-server.ts`. The second half reads `.skilled/bin/skill-advisor.cjs` and `.skilled/bin/system-skill-advisor-launcher.cjs`, which spell the socket file name as a literal because they run before the package is built |
| `spec-doc-health.test.ts` | `evaluateSpecDocHealth` from `../parsing/spec-doc-health.ts`, run against fixture documents written to temporary directories |

---

## 3. VALIDATION

```bash
cd .skilled/skills/system-spec-kit/shared
npm test
```

The script is `node --import tsx --test 'tests/*.test.ts'`, so the suites run against the TypeScript sources. Expected result: the run exits zero, every `node:test` case reports as passing, and each script-style suite prints its own line such as `PASS: parse-frontmatter`.

---

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`../../SKILL.md`](../../SKILL.md)
