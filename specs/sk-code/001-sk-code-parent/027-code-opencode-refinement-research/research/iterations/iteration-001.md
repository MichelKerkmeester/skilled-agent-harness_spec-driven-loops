# Iteration 001 — TS/JS language-standard fidelity (Facet 1a)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 1 findings — TS/JS language-standard fidelity

Scope note: the **JavaScript trio is largely accurate for the CJS deep-loop runtime** (`loop-host.cjs` follows the boxed header → `'use strict'` → numbered sections → CommonJS `require`/`module.exports` contract the JS docs prescribe; the plugin ESM example in `js/quality_standards.md` §10 matches `mk-dist-freshness-guard.js`'s 3-line `╠═╣` box). The **TypeScript trio has serious, actionable drift** — almost all of it concentrated in import/emit mechanics the docs get wrong for the very NodeNext/`verbatimModuleSyntax` workspaces they document.

- **[P1] Relative TS imports require `.js` extensions under NodeNext — completely undocumented, and every doc example is wrong**
  - code-opencode doc: `typescript/style_guide.md:510-511` — `import { loadConfig } from './core/config';` / `import { MemoryError } from './errors/core';`; `typescript/quick_reference.md:50-51,286-287`; `quality_standards.md:784-785`. Every relative-import example is extensionless.
  - reality: `system-spec-kit/mcp_server/lib/errors/core.ts:6,16` — `from './recovery-hints.js'`, `from '../runtime/timer-registry.js'`; `shared/embeddings/factory.ts:10-28` — `from './providers/hf-local.js'`, `from './registry.js'`, `from '../types.js'`; `skill-advisor/mcp_server/lib/prompt-policy.ts:5` — `from './shared/unicode-normalization.js'`. 100% of relative imports carry `.js`.
  - recommendation: Add a "NodeNext/`verbatimModuleSyntax`: relative imports MUST include the `.js` extension (the source is `.ts`, the emitted/resolved path is `.js`)" rule to `typescript/style_guide.md` §7 and fix every example across the TS trio. This is load-bearing: copying the doc examples verbatim fails to compile under the documented tsconfig.

- **[P1] `node:` protocol prefix on built-in imports — undocumented**
  - code-opencode doc: `typescript/style_guide.md:502-503` — `import path from 'path';` / `import fs from 'fs';`; `quick_reference.md:45-46`; `quality_standards.md:783-784`. All bare.
  - reality: `skill-advisor/.../prompt-policy.ts:6-8` — `from 'node:fs'`, `from 'node:path'`, `from 'node:url'`; `shared/embeddings/factory.ts:6` — `from 'node:module'`; `plugins/mk-dist-freshness-guard.js:11-14` — all four built-ins prefixed. (Inconsistency note: `factory.ts:5,7,8` itself mixes bare `fs`/`path`/`url` with prefixed `node:module` — a real-code bug to flag separately, not a doc fix.)
  - recommendation: Teach `node:` prefix as the preferred form; update examples. Note the codebase is mid-migration and bare forms still exist.

- **[P1] The doc's `require()` interop pattern is wrong for the ESM workspaces it documents**
  - code-opencode doc: `typescript/style_guide.md:647-660` "Dynamic require() with try-catch" shows `sqliteVec = require('sqlite-vec');` directly in `.ts`; `:626` shows `const config = require('./legacy-config') as LegacyConfig;`.
  - reality: `shared/embeddings/factory.ts:30` — `const require = createRequire(import.meta.url);` then `:308` `require('node:sqlite')`; `plugins/mk-dist-freshness-guard.js:16,20` — same `createRequire(import.meta.url)` then `require('...dist-freshness.cjs')`. Bare `require()` is a SyntaxError under `module:nodenext`.
  - recommendation: Replace the §9 "Mixed JS/TS" require examples with the `createRequire(import.meta.url)` pattern; mark bare `require()` as CommonJS-only.

- **[P2] `enum` is taught; the real codebase uses `as const` objects**
  - code-opencode doc: `typescript/style_guide.md:167-172,219-237` and `quality_standards.md:509-516` prescribe `enum ErrorCode { NotFound = 'NOT_FOUND', ... }`.
  - reality: `system-spec-kit/mcp_server/lib/errors/core.ts:76-102` — `export const ErrorCodes = { EMBEDDING_FAILED: 'E001', ... } as const;`. No `enum` keyword anywhere in the cited error module; type derived via `keyof typeof` (`:107` `type LegacyErrorCodeKey = keyof typeof ErrorCodes`).
  - recommendation: Either switch the canonical examples to `const X = {...} as const` + `keyof typeof`, or add a "prefer `as const` objects over `enum` (avoids runtime enum emission, composes with union types)" rule. The enum examples currently teach a pattern the codebase rejects.

- **[P2] The canonical `MemoryError` example contradicts the file cited as its evidence**
  - code-opencode doc: `typescript/quality_standards.md:475-495` and `quick_reference.md:344-358` — `readonly code: ErrorCode;`, `readonly context: Record<string, unknown>;`, `Object.setPrototypeOf(this, new.target.prototype);`, `this.name = 'MemoryError'`.
  - reality: `system-spec-kit/mcp_server/lib/errors/core.ts:116-119` — `public code: string;` (not `readonly`, typed `string` not an enum), `public details: Record<string, unknown>;` (property is **`details`**, not `context`), `public recoveryHint?: RecoveryHint;` (undocumented third field). The doc literally cites this file as evidence (`js/quality_standards.md:182`).
  - recommendation: Reconcile the example to the real shape (`code: string`, `details`, `recoveryHint?`) or explicitly mark the doc version as the "new-code target" vs the legacy reality. The `context`→`details` name divergence will mislead anyone grepping the real code.

- **[P2] "Type-only imports always last" rule is violated by the codebase's own error module**
  - code-opencode doc: `typescript/style_guide.md:514` — "4. Type-only imports (separate line, always last)"; `code_organization.md:265`.
  - reality: `errors/core.ts:15-16` — `import type { RecoveryHint, Severity } from './recovery-hints.js';` immediately followed by `import { clearRegisteredTimer, registerTimeout } from '../runtime/timer-registry.js';` (value import after type import).
  - recommendation: Either soften to "group type-only imports together; do not interleave value and type imports from the *same* module" or drop the absolute "always last" and acknowledge the codebase interleaves. As written the rule fails its own evidence file.

- **[P3] Built-ins-first import group order is violated**
  - code-opencode doc: `typescript/style_guide.md:500-503` — group 1 = Node built-ins, group 3 = local.
  - reality: `skill-advisor/.../prompt-policy.ts:5-8` — local import (`./shared/unicode-normalization.js`) on line 5 *before* the three `node:` built-ins on lines 6-8.
  - recommendation: Minor — either enforce or relax. Worth a note that the advisor package does not currently lint import group order.

- **[P3] Section-divider format: doc shows 2 formats, real code uses 3 (incl. ASCII hyphens)**
  - code-opencode doc: `typescript/style_guide.md:118-130` — Format A (line-comment box-drawing `─`) and Format B (block-comment box-drawing).
  - reality: `errors/core.ts:21-24,109-112` uses a third variant — two `─` lines with the section name on its *own* line between them (and duplicate `// 2.` numbering at :69 and :110); `shared/embeddings/factory.ts:739-741,1045-1047` uses plain ASCII hyphens `// ---------------` with no box-drawing at all.
  - recommendation: Acknowledge the ASCII-hyphen divider as a tolerated third form, or file a real-code cleanup (separate from docs). The duplicate-`2.` numbering in `errors/core.ts` is a real-code bug.

### Used-but-undocumented (worth ADDING)
- **`Object.freeze` + `Readonly<Record<K,V>>` + `satisfies` calibration** — `factory.ts:152-167` (`VALID_PROVIDER_DIMENSIONS = Object.freeze({ ... } satisfies Record<...>)`). This is the exact "Object.freeze calibration" the charter names; the TS docs mention `Object.freeze` only in a one-off `FROZEN_CONFIG` example and never pair it with `satisfies` + `Readonly`.
- **`createRequire(import.meta.url)`** ESM→CJS interop (see P1 above).
- **`__dirname`/`__filename` in ESM** — `prompt-policy.ts:10-11` (`const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);`). Standard ESM bootstrapping pattern, absent from docs.
- **CJS `__dirname` direct use** — `loop-host.cjs:44` (`const SCRIPTS_ROOT = __dirname;`). The JS docs never mention `__dirname`/`__filename` for `.cjs`.
- **Env-var resolution helpers** — `prompt-policy.ts:30-31` (`process.env.X ?? join(...)`) and the `resolveNumericThreshold(envName, default)` helper (`:46-52`); `factory.ts` is saturated with `process.env.X?.trim()` guards. A real convention worth one paragraph.
- **`catch (_error: unknown)` underscore-unused** convention — `factory.ts:413` (`catch (_error: unknown)`). Docs only show `catch (error: unknown)`.
- **`void error.message;` no-op** — `factory.ts:1112,1281` (`if (error instanceof Error) { void error.message; }`). Looks like a lint/suppression workaround; if intentional, document why; if not, flag as real-code smell (separate from docs).

### Angles to pursue next
1. **Facet 1b — Python + Shell + Config trios.** Same docs-vs-reality treatment for `skill_advisor.py`, `lib/common.sh`, and the JSON/JSONC config docs (the council seed already flags shell interpreter-trap tooling).
2. **Facet 2 — verify-doctrine reality.** The TS trio's `--noCheck --force`, `TS4094`, and `npm run test:cli` claims (`quality_standards.md:681-713`) need checking against the real `package.json` scripts and `tsconfig.build.json` — the charter explicitly suspects stale build claims.
3. **Facet 5 cascade — the `MemoryError`/`ErrorCodes` drift likely infects the JS docs too:** `js/quality_standards.md:163-177` teaches a JS `MemoryError` with `context` + `Error.captureStackTrace`. Verify whether the *compiled* JS output of `errors/core.ts` matches that, or whether the JS doc is describing a codebase that no longer exists.
4. **The `node:` prefix inconsistency inside `factory.ts`** (bare `fs`/`path`/`url` vs prefixed `node:module`) — flag as a real-code bug for the owning surface, and confirm whether an ESLint rule enforces prefixing (if not, that's a verify-doctrine gap).
