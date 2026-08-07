# Reviewed consumer manifest (phase 002)

BASE: `1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe`

The reviewed list of every runtime consumer of the `feature_catalog` / `manual_testing_playbook`
root names, with its current dual-name state and its disposition. Built by scanning runtime code
(`*.py`, `*.cjs`, `*.js`, `*.ts`, `*.mjs`) under `.opencode/skills`, excluding `node_modules`,
`dist`, `z_archive`, and test files.

## Spec-vs-reality corrections

- **`parent-skill-check.cjs` does not exist** as runtime code. The named consumer from the phase spec
  and decision record is not present; only a test fixture `system-skill-advisor/mcp_server/tests/parent-skill-check-fixtures.vitest.ts` exists. The advisor's parent-skill handling routes through `system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`, which IS in the manifest below.
- **`explicit.ts` is not a filesystem-root consumer.** Its matches are routing identifiers and trigger
  phrases. It neither reads nor emits catalog/playbook paths, so the fail-closed filesystem matrix
  records it as identifier-only instead of manufacturing a root boundary that does not exist.
- The named 6 consumers are a subset. The scan discovered **18 runtime consumers**; the extras are recorded below so the phase does not silently miss them.

## Prior partial migration

The classifier (`validate_document.py`) and the Lane C loader (`load-playbook-scenarios.cjs`) already
carry inline dual-name tuples (e.g. `PLAYBOOK_DIR_NAMES = ('manual_testing_playbook', 'manual-testing-playbook')`).
A prior smart-routing effort partially migrated these. Phase 002 centralizes that scattered tolerance
into one bounded resolver, adds fail-closed-on-physical-coexistence, and covers the consumers that are
still underscore-only.

## Consumers and disposition

| # | Consumer | State | Disposition |
|---|----------|-------|-------------|
| 1 | `sk-doc/shared/scripts/validate_document.py` (classifier; symlinked at `sk-doc/scripts/`) | dual (inline tuples) | Route through the shared resolver; keep the type-id `feature_catalog` (identifier, out of scope); preserve symlink mode 120000 |
| 2 | `system-deep-loop/.../skill-benchmark/load-playbook-scenarios.cjs` (Lane C loader) | dual (inline) | Route through the shared resolver; Lane C count+IDs must stay 32/30 |
| 3 | `system-deep-loop/.../skill-benchmark/playbook-generator.cjs` (Lane C generator) | dual | Route through the resolver |
| 4 | `sk-code/code-quality/scripts/lib/post-edit-router.cjs` | underscore-only (`SKILL_SCOPE_SUBTREES` set) | **Add tolerance**: accept both root forms in the scope set |
| 5 | `sk-doc/create-skill/scripts/package_skill.py` | dual | Route through the resolver |
| 6 | `sk-doc/create-skill/scripts/generate-leaf-manifest.cjs` | dual | Route through the resolver |
| 7 | `sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | dual | Route through the resolver |
| 8 | `sk-doc/create-skill/scripts/validate-playbook-topology.cjs` | dual | Route through the resolver |
| 9 | `sk-doc/shared/scripts/frontmatter-version.mjs` | dual | Route through the resolver |
| 10 | `system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | identifier-only | No filesystem migration; retain the stable routing identifiers and exclude this row from the root-boundary matrix |
| 11 | `sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py` (INVERSE guard) | underscore-only | **REQ-005 flip**: reject underscore catalog content, accept hyphenated |
| 12 | `sk-doc/shared/scripts/check_no_numbered_categories.py` (de-numbering guard) | underscore-only (`CATEGORY_ROOTS`) | **Add tolerance**: scan both root forms so it keeps working post-rename |
| 13 | `sk-doc/shared/scripts/check_no_numbered_snippet_files.py` (de-numbering guard) | underscore-only (`CATEGORY_ROOTS`) | **Add tolerance**: scan both root forms |
| 14 | `system-deep-loop/runtime/scripts/check-contract-drift.cjs` | underscore-only (path regexes) | **Add tolerance**: hyphen alternation in the drift regexes |
| 15 | `sk-doc/create-skill/scripts/init_skill.py` | underscore-only (scaffold list) | **Phase 003** (generator emission), not 002; flagged here |
| 16 | `system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | underscore-only (hardcoded corpus path) | **Phase 008** system-spec-kit closure (rename dir + update path together); flagged here |
| 17 | `system-deep-loop/.../skill-benchmark/run-skill-benchmark.cjs` | underscore-only (comment) | Benign mention; optional accuracy update (delegates to the dual loader) |
| 18 | `system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | underscore-only (docstring) | Benign mention; optional accuracy update |

## Phase-002 work set (derived from the manifest)

**Must migrate in phase 002** (filesystem rows 1-9 and 11-14): route the dual consumers through the shared resolver, add
tolerance to the four underscore-only real consumers (rows 4, 12, 13, 14), and flip the inverse guard
(row 11). Then verify the Lane C corpus (32/30 unchanged) and the per-skill fail-closed matrix.

**Deferred** (rows 15, 16): emission is phase 003; the hardcoded stress-corpus path renames in the
phase-008 system-spec-kit closure. Benign mentions (rows 17, 18) get optional accuracy updates.

## The shared resolver (design intent)

One bounded resolver per runtime language (Python + JS/TS) replaces the scattered inline tuples:

- `resolveRoot(name)` accepts either `feature_catalog`/`feature-catalog` (and the playbook pair) and
  returns the canonical hyphen form.
- `resolveExistingRootDir(parent, canonical)` checks disk and **fails closed** if both the underscore
  and hyphen directories physically coexist under the same parent.
- Path handling is correct for POSIX and Windows separators.
- It is the single compatibility boundary: consumers must not bypass it to reinterpret an un-migrated
  or unsupported root, and no consumer may downgrade to `readme`, an empty scenario set, an unrelated
  category, or a guessed path.

Resolver home: the Python resolver lives beside the classifier under `sk-doc/shared/scripts/`. The JS/TS
resolver home is decided when the resolver increment lands (cross-skill import path is the open question,
recorded here rather than guessed).
