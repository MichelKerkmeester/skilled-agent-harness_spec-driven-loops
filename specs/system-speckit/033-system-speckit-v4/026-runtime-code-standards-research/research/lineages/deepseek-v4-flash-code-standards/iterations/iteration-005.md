# Iteration 5: Dead Code & Retired Residue

## Focus
Angle 5 — find unimported exports, unreachable branches, and retired memory-database residue (sqlite, embeddings, MCP memory) across `shared/`, `runtime/lib`, and `runtime/cli`.

## Findings

### F5.1 [P1] `shared/ipc/socket-server.ts` is an unimported module within the audited package
- **Code:** `shared/ipc/socket-server.ts` exports `startIpcSocketServer` (line 525), `IpcSocketServerHandle`, `IpcSocketServerOptions` (lines 530-531). The only reference to `socket-server` anywhere in `system-spec-kit` (excluding `node_modules/` and `dist/`) is a prose comment at `shared/review-research-paths.cjs:262` (`* shared/ipc/socket-server.ts's allowedSocketRoots().`).
- **Standard:** `shared/references/universal/code-quality-standards.md` §3 P0 "No dead/duplicated code" is not literally in the P0 list, but §4 P1 "Documentation completeness" and the restraint ladder §7 rung 1 ("Does this need to exist at all? / YAGNI") cover it; `sk-code-opencode` universal-checklist also flags unimported exports.
- **What is present:** A whole IPC socket-server module with a public API is not imported by anything in the package — no handler, no lib, no test, no CLI. It is exposing sockets and `allowedSocketRoots()` for a consumer that does not exist within the audited surface.
- **Severity:** P1 — maintenance cost (an unexercised network-facing module that would need security review if ever wired) and reader confusion.
- **One-line fix:** **judgment-required** — either confirm it is consumed by `system-skill-advisor`'s MCP server (outside the audited package) and document that cross-package consumer in the module map, or remove it. Do not delete on assertion alone.

### F5.2 [P2] `runtime/cli/lib/embeddings.ts` re-export barrel is not imported within runtime/cli or runtime/lib
- **Code:** `runtime/cli/lib/embeddings.ts:9` (`export * from '@spec-kit/shared/embeddings'`); grep found no `import ... from '.../lib/embeddings'` in `runtime/cli` or `runtime/lib` source.
- **Standard:** same §7 rung 1; `imports-and-exports.md` §3 (barrels should serve a real consumer).
- **What is present:** The CLI-level embeddings barrel re-exports the live `shared/embeddings` subsystem but has no in-package consumer. The shared layer (`shared/embeddings/factory.ts`, `shared/embeddings/providers/*`) is genuinely live (imported by `runtime/tests/embedders/*`, `runtime/tests/api-validation.vitest.ts`, etc.), so this is a stray barrel rather than a retired subsystem.
- **Severity:** P2.
- **One-line fix:** **mechanical** — remove `runtime/cli/lib/embeddings.ts` unless a consumer depends on the `runtime/cli` import path.

### F5.3 [P2] Feature-catalog pointer retained in a code comment, only allowed via `// hygiene-ok`
- **Code:** `shared/embeddings.ts:3` — `// Feature catalog: Hybrid search pipeline // hygiene-ok`.
- **Standard:** (root-doc) Comment Hygiene §"No ephemeral-artifact pointers" — comments must not name a feature-catalog entry; `shared/references/universal/code-quality-standards.md` §7 P0 #7.
- **What is present:** The comment carries a feature-catalog identifier and is exempted by the suppress marker. Given the marker, this is a sanctioned false-positive case, but it is the kind of pointer the rule exists to remove; a comment that says "why this module is here" is the durable alternative.
- **Severity:** P2 (already suppressed, so not a gate failure).
- **One-line fix:** **mechanical** — replace with durable WHY (e.g., the module exists to feed the hybrid retrieval pipeline) and drop the catalog pointer.

## Sources Consulted
- `shared/ipc/socket-server.ts:525,530-531`; `shared/review-research-paths.cjs:262`
- `runtime/cli/lib/embeddings.ts:9`
- `shared/embeddings.ts:3`
- `shared/references/universal/code-quality-standards.md` §7 (restraint ladder), §3 P0#7
- `sk-code-opencode/references/shared/code-organization/imports-and-exports.md` §3

## Assessment
- **newInfoRatio:** 0.75
- **Novelty justification:** The unimported `socket-server.ts` module and the dead `lib/embeddings.ts` barrel are new; the feature-catalog comment is a secondary note. The "retired sqlite/embeddings/MCP-memory residue" probe found the embeddings subsystem still live at the shared layer — a useful negative.
- **Confidence:** High for F5.1/F5.2 (both are whole-package import greps that returned empty). Medium for F5.3. Unreachable-branch detection was not attempted exhaustively (no control-flow walker).

## Reflection
- What worked: Verifying an export is truly dead requires a package-wide import grep, not just a local glance — that confirmed `socket-server.ts` is unimported.
- What failed: The "retired memory-database residue" presumption did not hold — the embedding/model-server subsystem is still live at `shared/` and via runtime tests, so it is not residue.
- Ruled out: Calling `shared/embeddings` "retired residue" — it is live; only the `runtime/cli/lib/embeddings.ts` barrel is orphaned.

## Recommended Next Focus
Angle 6 — naming/structure: snake_case outside Python, mixed `.vitest.ts`/`.test.ts` suffixes, and banner-numbering gaps.
