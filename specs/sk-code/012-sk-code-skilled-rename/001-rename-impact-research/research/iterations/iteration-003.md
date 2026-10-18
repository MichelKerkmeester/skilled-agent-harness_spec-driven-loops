# Iteration 003 — Q2 closed: the identity's spelling set (kebab, bare, spaced, snake, camel, qualified) and the runtime names every match pattern must exclude

- Run: `2026-10-18T17:35:32.240Z` · mode=research · segment 1, iteration 3 of 5
- Status: answered — Q2 closes with a live-tree census and a safe/unsafe match-pattern table. Q3/Q4/Q5 untouched this iteration.

## Focus

Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)?

## Actions Taken

1. State recovery: config, strategy, registry, iteration-002 narrative (4 reads).
2. Repo-wide non-kebab variant sweep (`sk_code[-_]?opencode|sk[-_]?code_opencode|skcodeopencode|code_opencode|codeopencode|sk code opencode`, case-insensitive) — 60-cap hit; tail read from the overflow file.
3. Repo-wide `cli[-_]?opencode` sweep — 6,221 files (history-dominated); live corpus isolated with a `.skilled`-scoped rerun.
4. Bare-form sweeps: `.skilled`-wide (60-cap, then 120-cap) and `.skilled/skills/sk-code`-scoped (80-cap; tail read from overflow).
5. Standalone `opencode` token sweep, `.skilled`-scoped — isolates the runtime brand from the identity.
6. Complete live snake/camel verification sweep (`.skilled`-scoped `code_opencode|codeopencode`) — 14 matches, no cap.
7. Path-form listing: `ls -la` on `.skilled/skills/sk-code`, `.skilled/changelog/sk-code`, and the run-directory trees.

Tool-call note: 20 calls (pack target 12; config budget 24) — 4 state reads, 9 research sweeps, 1 path listing, 2 overflow tails, 4 artifact writes. Global sweeps are history-dominated (2,229 spec files carry the identity); the live layer required separate scoped reruns.

## Findings

### F1 — Spelling census: six identity families, and where each lives

| # | Family | Form | Live carriers | History carriers |
| --- | --- | --- | --- | --- |
| S1 | kebab prefixed | `sk-code-opencode` | packet dir `.skilled/skills/sk-code/sk-code-opencode/`; hub JSONs and scripts; mirrors; 137 non-spec files (seed) | — |
| S2 | kebab bare | `code-opencode` | hub-router routing classes; changelog alias symlink; packet scripts; benchmark ids; fixtures | old routing docs |
| S3 | spaced lowercase | `sk code opencode` | generated retrieval artifacts only (trigger-index, phrase-variants) | spec traceability tags |
| S4 | snake | `CODE_OPENCODE_DIR` | packet script local constant | `D4_maintainability_sk_code_opencode` review dims |
| S5 | camel/Pascal | `codeOpencode` | packet script local const | `CodeOpenCode` in log quotes (no live carrier) |
| S6 | qualified | `sk-code:code-opencode` | verifier concept `qualifiedIdToLeaf` | v1.7.0.0 changelog ("old ... tokens") |

- S1: prefixed kebab is the primary identity — the packet dir and hub key `modeIndex['sk-code-opencode']` both carry it. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:261] Seed counts (137 non-spec files prefixed, 43 bare) recorded at [SOURCE: specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/deep-research-strategy.md:158].
- S2: bare kebab is a live id/alias family, not history residue — routing classes `code-opencode-aliases` / `code-opencode-runtime` / `code-opencode-authoring`, packet benchmark ids, and test fixtures all carry it. [SOURCE: .skilled/skills/sk-code/hub-router.json:38] [SOURCE: .skilled/skills/sk-code/hub-router.json:79] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/benchmark/reports/README.md:11] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:8] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:63]
- S3: spaced lowercase appears only in generated retrieval artifacts — 47 `sk code opencode ...` keys in the trigger index (including version-qualified keys) and 13 entries in the phrase-variants fixture. [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:111848] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:23180]
- S4: the only live snake carrier is a local shell constant inside the packet's drift-guard runner. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:23] The snake prefixed form `D4_maintainability_sk_code_opencode` appears only in archived review configs. [SOURCE: specs/system-skill-advisor/z_archive/006-skill-advisor-routing-engine/004-advisor-hook-surface-integration/review/deep-review-config.json:8]
- S5: the only live camel carrier is a local const inside the packet's router verifier. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:261] The Pascal `CodeOpenCode` form appears only in spec logs quoting an older checkout; the complete 14-match live sweep found no live carrier. [SOURCE: specs/system-skill-advisor/z_archive/009-playbook-run-and-remediation/005-finding-remediation/research/prompts/iteration-1.codexlog:1719]
- S6: the qualified form `sk-code:code-opencode` is recorded as an old surface token, and the verifier still names the mapping concept. [SOURCE: .skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md:29] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:232]

No title-case carrier ("Sk Code Opencode") was observed; the spaced family appears only lowercase, consistent with trigger-phrase normalization.

### F2 — The bare form is a live alias/id family

`ls -la .skilled/changelog/sk-code/` shows six symlinks — `code-opencode`, `code-obsidian`, `code-quality`, `code-review`, `code-webflow`, `parent` — with `code-opencode -> ../../skills/sk-code/sk-code-opencode/changelog`. Bare `code-<leaf>` is the changelog alias convention, and the symlink target embeds the prefixed name (re-point required on rename). [SOURCE: specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/deep-research-strategy.md:163]
The bare form is also the routing surface-packet id: benchmark route tokens read `route / [code-opencode]`. [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:51]

### F3 — Live snake/camel identifiers are confined to the packet's own scripts

The complete live sweep (14 matches, no cap) found `CODE_OPENCODE_DIR` (6 matches in `run-all-drift-guards.sh`), `codeOpencode` (3 in `verify-router-sync.cjs`), and 5 inside embedded benchmark-report logs. The history-quoted `CODE_OPENCODE` test constant and `compareAuditCodeOpenCodePenalty` identifier have no live carrier under `.skilled`. Rename scope for these identifiers is rename-with-packet. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:23] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:261]

### F4 — Exclusion corpus: the runtime's own names

- E1 `.opencode/` — runtime alias dir, evidenced live by path-parsing code and test regexes: `'/.opencode/specs/'`, `\.(?:skilled|opencode)\//`, and the runtime-alternation replace. [SOURCE: .skilled/skills/system-spec-kit/shared/review-research-paths.cjs:70] [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:34] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts:40] Symlink `.opencode/skills -> ../.skilled/skills` recorded in iteration 002 F4.
- E2 `cli-opencode` — live child skill of `cli-external-orchestration`: referenced by a hook policy, listed in the trigger index, and used as ai-council seat filenames. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:53] [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:316] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-rollback.vitest.ts:50] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:924]
- E3 standalone `opencode` / `OpenCode` / `OPENCODE` — runtime brand, runtime id, CLI command, and surface token: `runtime: 'opencode'`, `opencode run "permission probe"`, the `OPENCODE` surface token in the sk-code tables, and "OpenCode Users" doc text. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:1302] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs:70] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/validation/README.md:77] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/research.md.tmpl:73]

### F5 — Match-pattern table (safe vs unsafe)

SAFE patterns:
1. `sk-code-opencode` exact — zero runtime collisions.
2. `(^|[^k_-])(?:sk-)?code-opencode` — covers bare and qualified (`sk-code:code-opencode`) forms; cannot match `.opencode` or `cli-opencode` because neither contains `code-opencode`.
3. Derived-family alternation `sk[_-]?code[_-]?opencode|code[_-]?opencode|codeopencode|sk code opencode` — every identity variant carries `code` immediately before `opencode`; no runtime name does.

UNSAFE patterns (each collides with E1–E3): bare `opencode` token; `-opencode` suffix; `\.opencode`; `OPENCODE` alone.

PATH RULE: segment-scoped replacement — `.opencode/skills/sk-code/sk-code-opencode` keeps the `.opencode` segment and renames only the trailing segment; changelog symlinks are re-pointed, not content-renamed; hub-router classes and leaf ids are routing-layer rename targets whose compiled policy regenerates from the hub JSONs (iteration 002 F2).

### F6 — Residual uncertainty

Uppercase-kebab (`SK-CODE-OPENCODE`) and mixed-separator forms were not isolated — the sweeps excluded `-`-separated shapes by construction to avoid kebab flooding; iteration 2's case-insensitive family sweep bounds them within its 2,378-file total, and no observed carrier suggests they exist.

## Questions Answered

- Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)?

## Questions Remaining

- Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it?
- Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing?
- Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded?

## Next Focus

Q3 — generated-artifact rebuild map (advisor DB, trigger index, graph metadata, mirror re-sync tooling). Carry-forwards from this iteration: the spaced-form retrieval keys (trigger-index.json, phrase-variants.json) are generated artifacts; hub-router classes and bare ids are routing-layer rename targets; `.hermes` remains the only materialized mirror (iteration 002 F4).
