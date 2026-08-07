---
title: "Deep-review report: 020 snake_case→kebab-case migration execution"
description: "Convergence-driven deep-review of the executed repo-wide filesystem-naming migration; GPT-5.6-SOL, read-only, 4 iterations."
contextType: "review"
---

# Deep-Review Report — 020 Migration Execution

<!-- SPECKIT_LEVEL: 3 -->

## Scope

Review target: the **executed** snake_case→kebab-case filesystem-naming migration on branch
`sk-doc/0068-020-migration-exec`, `git diff 1ec0ad2947..HEAD` (BASE→HEAD). At review start: 43
commits (3,697 `git mv` renames + a multi-pass reference completion + phase-009 fail-closed alias
removal + workspace/lockfile fixes). Executor: **cli-codex GPT-5.6-SOL, effort=high, tier=fast**,
read-only sandbox. Method: concurrent independent lineages per iteration, each verifying against
disk (not trusting author claims), findings adjudicated and fixed before the next iteration.

## Verdict

**PASS (converged).** The migration is functionally complete: every consumer/test/build/launcher
resolves to the renamed paths, phase-009 fail-closed behavior holds with all near-match detection
guards intact, and no reference-completion fix introduced a regression. Convergence reached after
4 iterations — functional findings fell iter1(6 classes)→iter2(5)→iter3(4 specific)→iter4(prose/comment only).

## Findings and resolution (all fixed)

The review's central finding: the original spec **under-scoped reference migration**. The site-based
rewriter and the initial targeted passes left many genuine stale references. Each fresh GPT-5.6-SOL
iteration surfaced a distinct class the frozen-map-driven passes structurally miss:

| Iter | Class | Fix commit |
|------|-------|-----------|
| 1 | relative/traversal refs; sentence-boundary prose; bare workflow-asset filenames; special-syntax (regex/placeholder); `path.join`/config-array dir tokens | 59c717e4e1, ee7cff5f7b, 51c5821fe1, 61f48a6096, e2d4c31804 |
| 1 | topology auto-resolution not fail-closed on legacy underscore sibling | ee926e3256 |
| 2 | unquoted asset-load instructions in `.txt` presentation contracts; `.jsonc` config; dir tokens on fs-lines beyond the vetted set; `fileProtection` map key; sk-design dynamic filename constructor; 13 `command-metadata.json` procedure cards; DAB-016 markers | 4481b8c048, 4ba583449e, 0128969d81, cf77514834 |
| 3 | stale generated `.codex/prompts` (regenerated); `PUBLIC_RELEASE.md` instructions; catalog/playbook/intent-detection fixture paths in 5 tests; a test the pass half-hyphenated | 2ea65b36fd |
| 3 | JSDoc filename consistency | 973e812d31 |

Every fix was verified: the fail-closed matrix (`test_root_name_consumer_matrix`) **29 ALL PASS**
(a new topology auto-resolution test was added), `npm run typecheck` **exit 0**, `npm run build`
**exit 0**, `design-command-surface-check.mjs` **exit 0**, `sync-prompts --check` **PASS 38/38**, and
each reviewer repro (runtime-capabilities, council prompt, deep-alignment standards, leaf-manifest
roots, leaf-resource-contract test) now resolves.

## Confirmed clean (adjudicated, not rewritten)

- **Phase-009 detection guards intact** — diff of the nine catalog/playbook consumers shows no
  `startsWith` near-match guard added/removed/weakened; underscore roots fail closed everywhere.
- **Scope respected** — no code identifier, JSON/YAML key, frontmatter field, or enum value
  (`read_only`, level identifiers) was rewritten.
- **Import/require specifiers** — zero stale renamed components.

## Dispositions (accepted, not defects)

1. **Rename-history D+A** — ~20 heavily-rewritten small files show delete+add in the squashed
   `BASE..HEAD --find-renames=50%` view. Per-commit rename lineage IS preserved (`250c3bf2a4` shows
   6,043 `R`); `git log --follow` traces them. The frozen phase-010 aggregate-gate wording is stricter
   than reality; documented difference.
2. **Prose display-text** — basename-only mentions and markdown link *display text* in `.md` docs are
   the documented out-of-scope tradeoff (functional link *targets* were fixed).
3. **Pre-existing test failures** — `resolveMemoryReference` (in-memory fixture DB) and
   `test-embeddings-factory.js` (ESM/CJS from a phase-000-tracked manifest) are content-unchanged by
   the migration; not migration-caused (operator: separate triage).
4. **DAB-016 source SHA-256** — the reference passes legitimately changed `benchmark.md` content;
   re-baselining the benchmark's pinned hashes is benchmark-maintenance, out of naming scope.
5. **Read-only-sandbox artifacts** — the review sandbox blocked tempdir/build finalization, so some
   lineage runs of the matrix/build "failed" spuriously; all pass in writable runs.

## Next

`/deep:review` → PASS → integrate. Remaining program step: **011 integrate** — rebase onto latest
`skilled/v4.0.0.0` (diverged +26 commits / 18k renames since merge-base; ~64 direct file overlaps),
rerun the whole-repo gate, fast-forward-only, **no push without operator go-ahead**.
