# Iteration 10 (Final): Ranked, Deduplicated Synthesis

## Focus

Consolidate every finding from iterations 1-9 into one ranked,
deduplicated list, each with owner surface, fix sketch, and a one-line
verification command.

## Findings

This iteration performs no new investigation; it synthesizes the 20
actionable findings (plus 10 verified-clean/ruled-out results) produced
across iterations 1-9 into a single ranked list. Full detail, evidence, and
`file:line` citations for every item below live in the iteration file named
in its "Source" column.

### Ranked List (most severe first)

| # | Finding | Severity | Owner surface | Fix sketch | Verification command | Source |
|---|---------|----------|----------------|------------|----------------------|--------|
| 1 | Trigger-index generator's `DEFAULT_REPO_ROOT` resolves one directory level short, silently dropping all `.opencode/skills` and `.opencode/install-guides` corpus roots from the published index (masked by the `.opencode/specs` symlink) | **Critical** | `system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Add one more `..` hop to `DEFAULT_REPO_ROOT`; regenerate `runtime/data/trigger-index.json`; add a regression test | `node --input-type=module -e "import {walkCorpus} from './.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs'; console.log(walkCorpus(process.cwd()).files.filter(f=>f.startsWith('.opencode/skills')).length)"` (expect >0, currently 0) | iteration-006.md (F6-1) |
| 2 | `graph-metadata.json` `children_ids` retains phantom entries from a prior packet identity after a rename, systemic across 127/2707 packets (4.7%) | High | `system-spec-kit/runtime/cli/rules/` + graph-metadata writer | Add `CHECK-GRAPH-METADATA-CHILD-IDENTITY-DRIFT`: flag any `children_ids` entry whose leading path segment doesn't match the packet's own current `packet_id` | `node -e "const gm=require('./.opencode/specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json'); console.log(gm.children_ids.filter(c=>!c.startsWith(gm.packet_id)))"` (expect `[]`, currently 12 phantom `052-...` entries) | iteration-004.md (F4-1), iteration-007.md (F7-1/F7-2) |
| 3 | Four hand-found defects (this row's #2, plus README count, `improvement/` folder, track-root staleness) map to zero coverage across the full 25-file / 37-entry validate.sh rule inventory | High | `system-spec-kit/runtime/cli/rules/`, `runtime/cli/lib/validator-registry.json` | Add the three new rules named in iteration-007.md's table; add a track-root sweep invocation surface; add a retrieval-package regression test for #1 | `find .opencode/skills/system-spec-kit/runtime/cli/rules -iname "check-improvement*"` (expect a match; currently none) | iteration-007.md (F7-1) |
| 4 | `README.md` claims "the 46-rule registry" five times; the authoritative `validator-registry.json` it cites contains 37 entries | High | `system-spec-kit/README.md` | Update all five occurrences to "37-rule registry"; add a doc-freshness check comparing the prose count to the registry length | `node -e "console.log(JSON.parse(require('fs').readFileSync('.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json')).length)"` (37) vs `grep -c "46-rule" .opencode/skills/system-spec-kit/README.md` (5) | iteration-008.md (F8-1) |
| 5 | `.claude/settings.json` and `.cursor/hooks.json` hook registrations lack the self-diagnosing `mkHookDrift` fallback that `.codex/hooks.json`/`.devin/hooks.v1.json` have; explicitly scoped out of packet 054's own child phase 005 as deferred, not fixed | Medium-High (explicitly tracked-but-deferred debt) | `.claude/settings.json`, `.cursor/hooks.json` | Apply the same `\|\| { printf ... mkHookDrift:true ... }` wrapper used in Codex/Devin to the `dist/hooks/claude/*.js` and `dist/hooks/cursor/*.js` invocations | `grep -c "mkHookDrift" .claude/settings.json .cursor/hooks.json` (expect >0 each; currently 0,0) | iteration-003.md (F3-2), iteration-004.md (F4-2) |
| 6 | `improvement/` (deep-agent-improvement, deep-model-benchmark) is a live spec-folder artifact family with no `folder-structure.md` entry and no `validate.sh` rule | Medium | `system-spec-kit/references/structure/folder-structure.md`, `runtime/cli/rules/` | Document `improvement/` in folder-structure.md §4 alongside `research/`/`review/`; add a JSON-shape rule for `improvement/*-config.json` | `grep -c "improvement/" .opencode/skills/system-spec-kit/references/structure/folder-structure.md` (expect >0; currently 0) | iteration-001.md (F1-1) |
| 7 | Track-root `graph-metadata.json` files (no `spec.md`) are structurally invisible to normal `validate.sh` usage; `specs/cli-external-orchestration` declares 10 children vs 36 actual | Medium | `system-spec-kit` doctor/CI tooling | Add a periodic/`doctor:speckit` sweep running `check-graph-metadata-child-drift` logic against every `specs/*/graph-metadata.json` track root | `node -e "console.log(require('./.opencode/specs/cli-external-orchestration/graph-metadata.json').children_ids.length)"` (10) vs `find specs/cli-external-orchestration -maxdepth 1 -type d -name '0*' \| wc -l` (36) | iteration-004.md (F4-4) |
| 8 | `@spec-kit/runtime/api` is scoped internally (`runtime/`<->`scripts/`), not a cross-skill shared library; no repo-wide shared-lib package exists at all, so "duplication" across skills is convergent independent implementation, not a missed import | Medium (architecture decision, not a quick patch) | Repo-wide (`.opencode/shared-lib/` if built) | Decide whether a minimal shared-lib package is worth building for path-containment + frontmatter parsing; if not, no fix needed beyond documenting the boundary explicitly | `find .opencode -maxdepth 1 -iname "shared-lib"` (expect nothing found either way; this documents current state) | iteration-005.md (F5-1) |
| 9 | Hand-rolled frontmatter parsing duplicated across 4+ independent skill families (sk-doc, system-deep-loop, system-skill-advisor, system-spec-kit); zero skills depend on `gray-matter` or an equivalent | Medium | `sk-doc`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` | Add `gray-matter` (or a shared 20-line parser) to the highest-churn packages; migrate the others | `grep -rl "gray-matter" .opencode/skills --include="package.json"` (expect matches; currently none) | iteration-005.md (F5-3) |
| 10 | Research/review activity never refreshes the owning packet's `description.json`/`graph-metadata.json` unless `spec.md` itself is anchored; live ~4h staleness gap observed in this lineage's own target packet during its own dispatch | Medium | `system-deep-loop` reducers (`reduce-state.cjs`), `fanout-salvage.cjs` | Call `refreshGraphMetadata`/`generatePerFolderDescription` from the reducer's terminal-state step, or explicitly document that `description.json.lastUpdated` is not a freshness signal during/after deep-loop runs | Compare `description.json.lastUpdated` vs `stat -f "%Sm" research/` for any packet with a recently-completed `/deep:research` run | iteration-009.md (F9-1) |
| 11 | Independent realpath-based path-containment primitives in `system-spec-kit` (`isWithinDirectory`/`validateFilePath`) and `system-deep-loop` (`isContainedInArtifact`/`isSubpath`) share no code | Low-Medium | `system-spec-kit/runtime/cli/core/workflow-path-utils.ts`, `system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Hoist the shared symlink-safe subpath primitive into a shared-lib if #8 is built | `grep -c "function isSubpath\|function isContainedInArtifact" .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (>0, confirming independent impl) | iteration-005.md (F5-2) |

### Verified-Clean / Ruled-Out Results (negative knowledge, not actionable but worth preserving)

- Memory-MCP/`scripts/`/`@spec-kit/scripts`/`memory/`-path retirement: exhaustively swept, zero live-doc remnants (iteration-002.md, F2-1).
- `.codex/agents` file-count "gap": extension difference (`.toml` vs `.md`), 12/12 parity confirmed (iteration-002.md).
- `runtime/dist/hooks` missing `pi/`: intentional `tsconfig.json` exclusion; Pi loads `.ts` via `.pi/extensions/` symlinks, all 17 verified resolving (iteration-003.md).
- All 14 CI workflows invoke scripts that exist in the current tree (iteration-003.md, F3-3).
- `000-release`'s non-table Status line: a legitimate distinct template, not a defect (iteration-004.md, F4-3).
- `create/*.md`, `design/extract.md`, `prompt/improve.md`, `rewrite/response-by-external-agent.md`, `agent-router.md`: correctly stay outside spec-kit's `create.sh`/`validate.sh` routing by design (iteration-001.md, F1-2).
- `shared/paths.ts`: unrelated to path-containment (database directory resolution) (iteration-005.md).
- `children_ids` does not wrongly include `research/`/`review/` local-owner folders (iteration-009.md, F9-2).
- Five additional README-cited CLI script paths all exist (iteration-008.md, F8-2).
- `feature-catalog.md` carries no equivalent falsifiable numeric claim to check (iteration-008.md, F8-3).

## Sources Consulted

- `iterations/iteration-001.md` through `iterations/iteration-009.md` (this lineage's own prior output; no new file reads this iteration)

## Assessment

- newInfoRatio: 0.15
- Novelty justification: Pure synthesis of prior findings into a ranked, deduplicated, cross-referenced table -- the ranking and consolidation itself is the deliverable, not new evidence.
- Confidence: High for the ranking's internal consistency (every row traces to a specific prior iteration's cited evidence); the severity ordering is this iteration's own judgment call, applied consistently (systemic/root-infrastructure defects rank above single-packet or documentation defects).

## Reflection

- What worked: Treating iteration 10 purely as consolidation (per the workflow's own division of labor between iteration-level and synthesis-level output) avoided diluting the ranked list with last-minute new findings that wouldn't have had a chance to be cross-checked.
- What failed: n/a -- synthesis iteration, no new investigation attempted.
- Ruled out: n/a this iteration (see the Verified-Clean/Ruled-Out section above, consolidated from prior iterations).

## Recommended Next Focus

None -- this is the final iteration (10 of `config.maxIterations: 10`). Loop
proceeds to `phase_synthesis`.
