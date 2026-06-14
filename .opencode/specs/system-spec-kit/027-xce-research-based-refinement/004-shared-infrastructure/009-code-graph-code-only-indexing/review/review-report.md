---
title: "Deep Review Report: 008 + 009 (reelection + config + code-graph code-only)"
description: "5-iteration deep review (cli-opencode openai/gpt-5.5-fast --variant xhigh) of this session's shipped code: daemon re-election default-on, MCP config 1:1 alignment, and code-graph code-only indexing + selectable maintainer mode. Verdict CONDITIONAL: 4 P1 + 4 P2, all verified real against source."
trigger_phrases:
  - "deep review 008 009 report"
  - "code graph review findings"
  - "reelection config review verdict"
importance_tier: "important"
contextType: "implementation"
---
# Deep Review Report — 008 + 009

<!-- SPECKIT_TEMPLATE_SOURCE: review-report | v2.2 -->

## 1. SCOPE & METHOD

5 iterations, executor `cli-opencode openai/gpt-5.5-fast --variant xhigh` (parallel, staggered, ≤2 concurrent). Targets: commits `c67a972b88` (reelection default-on + MCP config 1:1 alignment), `645bd69fb2` (notes restore), `a44e2a29c4` (code-graph code-only indexing + selectable maintainer mode).

- Iter 1 — code-graph markdown-exclusion correctness (`indexer-types.ts` + walk/scope)
- Iter 2 — selectable maintainer-mode resolver correctness + security (`mk-code-index-launcher.cjs`)
- Iter 3 — reelection default flip (`mk-spec-memory-launcher.cjs` + stress tests)
- Iter 4 — config 1:1 alignment + INDEX/notes + the `MK_` rename
- Iter 5 — adversarial: verify/refute iters 1–4 + cross-consumer hunt

Every finding was additionally verified by the orchestrator against current source.

## 2. VERDICT

**CONDITIONAL → RESOLVED (post-review remediation).** The change is sound, well-tested, and the biggest risk (dropping markdown breaking a consumer) is **clear**: no consumer queries the code graph's `'doc'` rows; skill-advisor doc-triggers read `.md` directly (`doc-frontmatter.ts:146-192`), not through the code graph. The **4 P1 gaps** that made the markdown-exclusion and the env rename incomplete are now fixed (F1–F4), the quick P2s are fixed (F5–F7), and F8 was assessed as a non-issue. Both dists rebuilt clean; the code-graph + skill-advisor suites are green. See §5.

## 3. FINDINGS

| # | Sev | File | Issue | Status |
|---|-----|------|-------|--------|
| F1 | **P1** | `system-code-graph/.../lib/structural-indexer.ts:1472-1508` (`collectSpecificFiles`) | The `specificFiles` / incremental reindex path (caller `ensure-ready.ts:733-737`, stale-file reindex) gates only on scope, not `includeGlobs`, so a changed `.md` still indexes as `'doc'`. Markdown exclusion covers the full walk but not this path. | FIXED — `collectSpecificFiles` now rejects any path that matches no `config.includeGlobs` pattern (reuses `globToRegExp`); new indexer test proves a `.md` passed via `specificFiles` is not persisted while `.ts`/`.json` are. |
| F2 | **P1** | `bin/mk-code-index-launcher.cjs:83` | `resolveMaintainerModeCategories` filters with `c in MAINTAINER_CATEGORY_ENV` (prototype chain) — `constructor`/`toString` pass and set junk env keys. | FIXED — switched to `Object.hasOwn(...)`; new resolver test proves `constructor,toString` → `[]`. |
| F3 | **P1** | `system-skill-advisor/.../handlers/advisor-recommend.ts:115,414` + `bin/mk-skill-advisor-launcher.cjs:106` (allowlist) + bridge | `MK_SKILL_ADVISOR_HOOK_DISABLED` rename not honored end-to-end: the daemon path reads/passes only the legacy `SPECKIT_` name. Harmless at value `0`, but the rename's disable capability is legacy-only. | FIXED — handler reads `MK_` OR legacy; `MK_` added to launcher CHILD_ENV_ALLOWLIST and bridge env list (legacy kept); abstain message names the canonical `MK_` var; dist rebuilt. `PLUGIN_DISABLED` confirmed plugin-host-only (plugin already reads `MK_`+legacy; never passed daemon-side) — no daemon gap. |
| F4 | **P1** | skill-advisor disable tests | Tests assert only the legacy disable variable; the `MK_` name has no daemon-path coverage. | FIXED — added daemon-path test for the `MK_` name in `advisor-recommend.vitest.ts` (+ afterEach cleanup). Also fixed a pre-existing red the review missed: `rename-invariants.vitest.ts:65` still asserted the legacy config var after the rename → updated to `MK_SKILL_ADVISOR_HOOK_DISABLED`. |
| F5 | P2 | `bin/mk-spec-memory-launcher.cjs:1449` | Re-election release-path comment says "(default off)" — stale after the flip. | FIXED — comment now reads "(on by default)". |
| F6 | P2 | `code-graph-indexer.vitest.ts` doc-matrix | Fixture uses singular folder names (`agent`/`command`) not real `agents`/`commands` paths. | FIXED — folders now `agents`/`commands` (+ the excluded `.md` fixture path), so the opt-in scope is genuinely exercised; test green. |
| F7 | P2 | the four configs' `_NOTE_3_INDEX_DEFAULTS` | Note still documents maintainer-mode as all-or-nothing (`=true` forces all 5); does not mention the selectable subset. | FIXED — note in `opencode.json`, `.claude/mcp.json` (`.mcp.json` symlink), `.codex/config.toml` now documents `true` (all 5) or a comma subset such as `skills,plugins`; text byte-identical across all three (parity preserved). |
| F8 | P2 | operator docs | A doc still claims a fourth `.vscode/mcp.json` runtime config exists. | ASSESSED — NOT a false claim. `.vscode/mcp.json` is the standard VS Code MCP config target, intentionally wired into `.gitattributes:20` and `scripts/setup-maintainer-filters.sh:43-44`; it is absent here only because the maintainer doesn't run the VS Code runtime, which `README.md:181` explicitly accommodates ("only the runtime you use needs to exist"). No change made (editing it would desync the README from `.gitattributes`/setup script). |

## 4. ADVERSARIAL / CROSS-CONSUMER

No additional markdown regression beyond F1. Skill-advisor doc-frontmatter harvest reads `.md` directly; `detect_changes` reports unknown files with zero symbols rather than dropping them; nothing consumes the code graph's `language='doc'` rows for `.md`. Dropping markdown from the code graph is safe for consumers.

## 5. REMEDIATION

All P1s (F1–F4) and quick P2s (F5–F7) are fixed in the working tree; F8 was assessed as a non-issue (legitimate, intentionally-supported VS Code config — no change). Source + test changes:

- **F1** `lib/structural-indexer.ts` — `collectSpecificFiles` now enforces the same file-type allowlist as the full walk (`config.includeGlobs` via `globToRegExp`); markdown can no longer re-enter through the incremental/stale-file path.
- **F2** `bin/mk-code-index-launcher.cjs` — `Object.hasOwn` own-property check replaces `in`; prototype names dropped.
- **F3** `handlers/advisor-recommend.ts` (+ `bin/mk-skill-advisor-launcher.cjs` allowlist + `mk-skill-advisor-bridge.mjs`) — `MK_` canonical with legacy fallback on the daemon path; `PLUGIN_DISABLED` confirmed to have no daemon-side gap.
- **F4** `tests/handlers/advisor-recommend.vitest.ts` — `MK_` daemon-path coverage added; `tests/rename-invariants.vitest.ts:65` stale legacy-name assertion corrected to `MK_` (a pre-existing red the review missed).
- **F5** `bin/mk-spec-memory-launcher.cjs` — re-election comment corrected to "(on by default)".
- **F6** `tests/code-graph-indexer.vitest.ts` — doc-matrix fixture uses real plural `agents`/`commands` paths.
- **F7** `opencode.json` / `.claude/mcp.json` / `.codex/config.toml` — `_NOTE_3_INDEX_DEFAULTS` documents the selectable subset; identical across all three.

**Verification (run by remediation engineer):** code-graph `tsc --build` clean; skill-advisor build clean; `code-graph-indexer` + `launcher-maintainer-mode` + `tree-sitter-parser` → 84 pass / 1 skip; `advisor-recommend` + `launcher-bootstrap` + `rename-invariants` + `mk-skill-advisor-plugin` + `compat/*` + `hooks/*` → 104 pass; `node --check` + comment-hygiene clean on all edited code files. Both dists rebuilt so the runtime daemons carry the fixes. `launcher-lease.vitest.ts` not relied on (pre-existing environmental red). No git operations performed — edits left in the working tree for the orchestrator to commit.
