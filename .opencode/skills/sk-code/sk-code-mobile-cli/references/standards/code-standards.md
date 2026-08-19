---
title: Pi Remote Applied Code Standards
description: The sk-code-opencode standard surface applied to the Pi Remote app, the audit matrix mapping each standard area to conformance, and the drift findings with their resolution status.
trigger_phrases:
  - 'pi remote code standards'
  - 'sk-code-opencode audit'
  - 'code standards audit matrix'
  - 'module header conformance'
  - 'naming and commenting drift'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Applied Code Standards

This document records how the sk-code-opencode skill standards apply to the Pi Remote app, the conformance of each standard area, and the drift findings from the audit. The app is lint-clean, its typecheck passes, and the full test gate is green (95 relay tests plus 5 web tests). Every edit made during this audit is comment-only and behavior-preserving. No logic, control flow, types, or security-critical behavior changed.

---

## 1. APPLIED STANDARD

The audit applies the sk-code-opencode surface to the TypeScript, JavaScript, shell, config, and test code of the four components (packages/pi-rpc-protocol, apps/pi-remote-relay, apps/pi-remote-web, extensions/pi-remote-approval) plus the scripts, release, and deploy trees. The governing references are the TypeScript style guide and checklists, the universal naming and commenting patterns, the code organization and module boundary references, the directory and test conventions, and the JavaScript, shell, and config checklists.

Key requirements carried into the audit:

1. Every TypeScript file starts with a MODULE header block, every shell script carries a COMPONENT block, and every code file identifies its component
2. Functions are camelCase, interfaces and types are PascalCase, constants are UPPER_SNAKE_CASE, files are kebab-case, and booleans read as questions
3. Comments explain WHY, start with a capital letter, stay under three per ten lines, and never embed spec, packet, phase, task, or ticket identifiers
4. Imports follow the built-in, third-party, local, type-only order with node prefixes and emitted .js extensions under NodeNext ESM
5. The type system is strict, public APIs avoid any, catch parameters are unknown and narrowed, and non-null assertions carry justification
6. Modules keep one responsibility, tests live in top-level tests directories with test-file naming, and config JSON uses camelCase keys
7. Security-sensitive code validates input, keeps secrets in environment variables, and fails closed

---

## 2. AUDIT MATRIX

| Standard area                  | Conformance              | Drift                                                                                                                                                                                                                                                |
| ------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File headers (TS, JS, shell)   | Conforms after alignment | 33 TS and TSX files, 9 mjs scripts, 2 browser and config JS files, and 2 shell scripts lacked component headers. All were added as comment-only edits. The single-line ambient declaration apps/pi-remote-web/src/vite-env.d.ts stays bare by design |
| Numbered section organization  | Conforms                 | Code files are small enough that numbered section dividers stay optional. Docs use numbered ALL-CAPS headings                                                                                                                                        |
| Naming conventions             | Conforms                 | The wire-contract keys needs_input, finished, and error use snake_case for protocol compatibility. Documented exception, unchanged                                                                                                                   |
| Commenting philosophy          | Conforms                 | WHY-focused, capitalized, low density, no commented-out code                                                                                                                                                                                         |
| Ephemeral-artifact pointer ban | Conforms                 | No spec, packet, phase, task, or ticket identifiers in any comment                                                                                                                                                                                   |
| Import ordering                | Conforms                 | Built-in, third-party, local, then type-only, with node prefixes and .js specifiers                                                                                                                                                                  |
| Export patterns and barrels    | Conforms                 | Protocol barrel in packages/pi-rpc-protocol/src/index.ts, named exports throughout, one default export at the Pi extension boundary                                                                                                                  |
| Type system strictness         | Conforms                 | strict, noUncheckedIndexedAccess, verbatimModuleSyntax, unknown over any, zero any usage                                                                                                                                                             |
| Non-null assertions            | Conforms after alignment | The single non-null assertion in apps/pi-remote-web/src/App.tsx now carries a justification comment                                                                                                                                                  |
| TSDoc on public API            | Partial                  | Most public classes and key functions carry one-line TSDoc. A few small guards and helpers are undocumented. Recommendation only                                                                                                                     |
| Error handling                 | Conforms                 | Typed unknown catches with instanceof narrowing, context-rich messages                                                                                                                                                                               |
| Async patterns                 | Conforms                 | Typed promises, Promise.all and allSettled, no callback nests                                                                                                                                                                                        |
| tsconfig and module baseline   | Conforms                 | NodeNext ESM across all four workspaces, strict true, .js import specifiers                                                                                                                                                                          |
| Module organization and SRP    | Conforms                 | Domain folders under apps/pi-remote-relay/src, no utils grab bag                                                                                                                                                                                     |
| File length guidelines         | Partial                  | Four files exceed the recommended maxima. Recommendation only                                                                                                                                                                                        |
| Directory and test conventions | Conforms                 | Top-level tests per component, test-file naming by suite, themed subfolders                                                                                                                                                                          |
| Security patterns              | Conforms                 | Default-deny policy, timing-safe comparisons, redaction before persist, secrets from environment, bounded bodies, rate limits, fail-closed loopback                                                                                                  |
| Config standards               | Conforms                 | Valid JSON, camelCase keys, schemaVersion first, logical ordering                                                                                                                                                                                    |
| JavaScript checklist           | Partial                  | Headers added. Guard clauses, constants, and error context conform. Bracketed logging is not used. Recommendation only                                                                                                                               |
| Shell checklist                | Partial                  | COMPONENT headers added. Quoting and function style conform. Strict-mode flags and shebang variants are intentional. Recommendation only                                                                                                             |
| KISS and DRY                   | Conforms                 | No speculative layers. A small opaqueId helper repeats in three relay files. Recommendation only                                                                                                                                                     |

---

## 3. DRIFT FINDINGS

1. Missing component headers (fixed). The MODULE header convention covered roughly half of the source tree while the other half had none. The audit added the missing headers to every TypeScript source, test, and config file, every mjs script, the browser service worker, and both shell scripts. All edits are comment-only.
2. Unjustified non-null assertion (fixed). apps/pi-remote-web/src/App.tsx used config.preferences! without a preceding explanation. A justification comment now names the early-return guarantee.
3. Stale release documentation (fixed). docs/release-verification.md claimed the app has no lint or format scripts. The root package.json defines eslint and prettier scripts and scripts/release-verify.mjs runs both gates. The claim was corrected.
4. TSDoc coverage gap (recommendation). A handful of exported guards and small helpers lack TSDoc. Adding one-line docs is safe but was deferred to keep the audit comment-only and focused.
5. File length (recommendation). apps/pi-remote-relay/src/http/server.ts, apps/pi-remote-relay/src/approval/approval-service.ts, apps/pi-remote-relay/src/store/transcript-projector.ts, and apps/pi-remote-web/src/App.tsx exceed the standard maxima. Splitting is a structural change and was not performed.
6. Bracketed logging (recommendation). The relay writes to process stdout and stderr without the [COMPONENT] prefix. The prefix is optional for single-purpose entrypoints.
7. Shell strict-mode and shebang (recommendation, intentional). deploy/containment/escape-tests.sh uses set -u without -e because it counts failures instead of exiting, and deploy/setup-tailscale-serve.sh is POSIX sh by design. Both are deliberate and were left unchanged.
8. DRY note (recommendation). A local opaqueId helper appears in apps/pi-remote-relay/src/auth/auth-service.ts, apps/pi-remote-relay/src/auth/enrollment.ts, and apps/pi-remote-relay/src/approval/approval-service.ts with different byte lengths. Centralizing changes no behavior but was left as a note.

---

## 4. VERDICT

Of 21 audited standard areas, 17 fully conform after the comment-only alignment edits, and 4 are partial with recorded recommendations only. The partial areas are TSDoc coverage, file length, bracketed logging, and the shell strict-mode and shebang notes. The audit made no change to logic, control flow, types, or the security-critical approval, auth, redaction, and sync behavior. The test gate is unchanged because every edit is a comment or a documentation correction.
