# Research Synthesis: Spec-Kit Integration Debt Audit (Lineage: sonnet5-high-research)

Workflow-owned canonical synthesis. Read-only repository-wide audit of what
still needs fixing, aligning, or better integrating with system-spec-kit,
the spec-folder workflow, and the continuity runtime. Executed inline by the
`cli-claude-code` (claude-sonnet-5, high reasoning) executor as fan-out
lineage `sonnet5-high-research` under
`.opencode/specs/system-speckit/054-decommission-debt-fixes/research/lineages/sonnet5-high-research/`.

---

## 1. Convergence Report

| Field | Value |
|---|---|
| Stop reason | `maxIterationsReached` |
| Total iterations completed | 10 of 10 (`config.maxIterations`) |
| Questions answered | 10/10 (all ten research angles covered, one per iteration) |
| newInfoRatio trend | 1.00, 0.55, 0.75, 1.00, 0.85, 1.00, 0.60, 0.90, 0.70, 0.15 -- sustained high signal through iteration 9; iteration 10 was a deliberate pure-synthesis pass (see iteration-010.md) |
| Convergence signal | Not used to stop early: `config.stopPolicy = max-iterations` per the operator's explicit instruction; treated as telemetry only |
| Actionable findings | 20 (1 critical, 4 high, 5 medium/high-confirming, 5 medium, 2 low/low-medium, 1 architectural reframing) |
| Verified-clean / ruled-out results | 10 (preserved as negative knowledge) |

---

## 2. Ranked Findings

Most severe first. Every row's full evidence, `file:line` citations, and fix
detail live in the linked iteration file -- this table does not repeat
citations already on record there.

| # | Finding | Severity | Owner surface | Fix sketch | Verification command | Source |
|---|---------|----------|----------------|------------|----------------------|--------|
| 1 | Trigger-index generator's `DEFAULT_REPO_ROOT` resolves one directory level short (`<repo>/.opencode` instead of `<repo>`), silently dropping the entire `.opencode/skills` and `.opencode/install-guides` corpus roots from the published `trigger-index.json`. Masked only because `.opencode/specs` is a symlink to `../specs`. All 1958 skill-doc files declaring `trigger_phrases` are currently invisible to Gate 1's lookup. | **Critical** | `system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Add one more `..` hop to `DEFAULT_REPO_ROOT` (or derive as `path.resolve(SKILL_ROOT,'..','..')`); regenerate `runtime/data/trigger-index.json`; add a regression test asserting each `CORPUS_ROOTS` entry yields >=1 file | `node --input-type=module -e "import {walkCorpus} from './.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs'; console.log(walkCorpus(process.cwd()).files.filter(f=>f.startsWith('.opencode/skills')).length)"` (expect >0; currently `0`) | [iteration-006.md](iterations/iteration-006.md) (F6-1) |
| 2 | `graph-metadata.json` `children_ids` retains phantom entries from a prior packet identity after a rename. Systemic: 127/2707 packets (4.7%) tree-wide show a declared-vs-actual child-count mismatch, several at exactly 2x from an unpruned rename. `check-graph-metadata-child-drift.sh`'s own source comment confirms this is a known, intentional gap: the writer "adds derived children and never prunes." | High | `system-spec-kit/runtime/cli/rules/`, graph-metadata writer | Add `CHECK-GRAPH-METADATA-CHILD-IDENTITY-DRIFT`: flag any `children_ids` entry whose leading path segment doesn't match the packet's own current `packet_id` | `node -e "const gm=require('./.opencode/specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json'); console.log(gm.children_ids.filter(c=>!c.startsWith(gm.packet_id)))"` (expect `[]`; currently 12 phantom `052-...` entries) | [iteration-004.md](iterations/iteration-004.md) (F4-1), [iteration-007.md](iterations/iteration-007.md) (F7-1/F7-2) |
| 3 | Four hand-found defects (rows 1, 2, 4, 6 in this table) map to zero coverage across the full 25-file / 37-entry `validate.sh` rule inventory -- three need a new rule or invocation surface, one (row 1) is structurally outside `validate.sh`'s jurisdiction and needs a code-level regression test instead. | High | `system-spec-kit/runtime/cli/rules/`, `runtime/cli/lib/validator-registry.json` | Add the rules named in rows 2 and 6; add a track-root sweep surface (row 7); add the retrieval regression test (row 1) | `find .opencode/skills/system-spec-kit/runtime/cli/rules -iname "check-improvement*"` (expect a match; currently none) | [iteration-007.md](iterations/iteration-007.md) (F7-1) |
| 4 | `README.md` claims "the 46-rule registry" five times; the authoritative `runtime/cli/lib/validator-registry.json` it names contains exactly 37 entries -- a 24% overstatement, written once and copy-referenced without independent verification. | High | `system-spec-kit/README.md` | Update all five occurrences to "37-rule registry"; add a doc-freshness check comparing the prose count to the registry's actual length | `node -e "console.log(JSON.parse(require('fs').readFileSync('.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json')).length)"` -> `37`; `grep -c "46-rule" .opencode/skills/system-spec-kit/README.md` -> `5` | [iteration-008.md](iterations/iteration-008.md) (F8-1) |
| 5 | `.claude/settings.json` and `.cursor/hooks.json` hook registrations lack the self-diagnosing `mkHookDrift` fallback that `.codex/hooks.json` (17 uses) and `.devin/hooks.v1.json` (4 uses) have. Confirmed **explicitly tracked and deliberately deferred**, not accidental: packet 054's own child phase `005-hook-fallback-failure-signal` (status Complete) states verbatim that Claude/Cursor/Pi/OpenCode's fallback shape is "a different, narrower shape not covered by this problem statement." | Medium-High (known, deferred debt with no successor packet yet) | `.claude/settings.json`, `.cursor/hooks.json` | Apply the same `\|\| { printf ... mkHookDrift:true ... }` wrapper used in Codex/Devin to the `dist/hooks/claude/*.js` and `dist/hooks/cursor/*.js` invocations | `grep -c "mkHookDrift" .claude/settings.json .cursor/hooks.json` (expect >0 each; currently `0`, `0`) | [iteration-003.md](iterations/iteration-003.md) (F3-2), [iteration-004.md](iterations/iteration-004.md) (F4-2) |
| 6 | `improvement/` (used by `/deep:agent-improvement` and `/deep:model-benchmark`) is a live spec-folder artifact family with **no `folder-structure.md` entry and no `validate.sh` rule**, unlike `research/`/`review/` which have both a documented ownership model and a dedicated protocol doc. | Medium | `system-spec-kit/references/structure/folder-structure.md`, `runtime/cli/rules/` | Document `improvement/` in `folder-structure.md` §4 alongside `research/`/`review/`; add a JSON-shape rule for `improvement/*-config.json` | `grep -c "improvement/" .opencode/skills/system-spec-kit/references/structure/folder-structure.md` (expect >0; currently `0`) | [iteration-001.md](iterations/iteration-001.md) (F1-1) |
| 7 | Track-root `graph-metadata.json` files (no `spec.md`, e.g. `specs/cli-external-orchestration/`) are structurally invisible to normal `validate.sh` usage, since ordinary workflows only validate the specific packet being worked on. `specs/cli-external-orchestration` declares 10 children while 36 actually exist. | Medium | `system-spec-kit` doctor/CI tooling | Add a periodic or `doctor:speckit`-routed sweep running the existing child-drift rule logic against every `specs/*/graph-metadata.json` track root | `node -e "console.log(require('./.opencode/specs/cli-external-orchestration/graph-metadata.json').children_ids.length)"` -> `10`; `find specs/cli-external-orchestration -maxdepth 1 -type d -name '0*' \| wc -l` -> `36` | [iteration-004.md](iterations/iteration-004.md) (F4-4) |
| 8 | `@spec-kit/runtime/api` is scoped internally to the `runtime/`<->`scripts/` boundary within `system-spec-kit` itself (its own README: "the supported import surface for the scripts workspace"), not a cross-skill shared library. No repo-wide shared-lib package exists anywhere in `.opencode`. Apparent cross-skill "duplication" of path-containment/level-scoring is therefore convergent independent implementation, not a missed import. | Medium (architecture decision, not a quick patch) | Repo-wide (`.opencode/shared-lib/` if ever built) | Decide whether a minimal shared-lib package is worth building for path-containment + frontmatter parsing; otherwise, no fix beyond documenting the boundary explicitly so future audits don't re-flag it as an oversight | `find .opencode -maxdepth 1 -iname "shared-lib"` (documents current absence either way) | [iteration-005.md](iterations/iteration-005.md) (F5-1) |
| 9 | Hand-rolled frontmatter parsing duplicated across 4+ independent skill families (`sk-doc`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`, 26+ files total); zero skills depend on `gray-matter` or an equivalent shared parser. | Medium | `sk-doc`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` | Add `gray-matter` (or a shared ~20-line fence-splitter) to the highest-churn packages; migrate the others onto it | `grep -rl "gray-matter" .opencode/skills --include="package.json"` (expect matches; currently none) | [iteration-005.md](iterations/iteration-005.md) (F5-3) |
| 10 | Research/review activity never refreshes the owning packet's `description.json`/`graph-metadata.json` unless `spec.md` itself is anchored (the exception path, not the default). Live proof: this very lineage's own target packet (`054-decommission-debt-fixes`) shows `description.json.lastUpdated` roughly 4 hours stale relative to this lineage's own dispatch time into its `research/` folder. | Medium | `system-deep-loop` reducers (`reduce-state.cjs`), `fanout-salvage.cjs` | Call `refreshGraphMetadata`/`generatePerFolderDescription` from the reducer's terminal-state step, or explicitly document that `description.json.lastUpdated` is not a freshness signal during/after deep-loop runs | Compare `description.json.lastUpdated` vs `stat -f "%Sm" research/` on any packet with a recently-completed `/deep:research` run | [iteration-009.md](iterations/iteration-009.md) (F9-1) |
| 11 | Independent realpath-based path-containment primitives in `system-spec-kit` (`isWithinDirectory`/`validateFilePath`) and `system-deep-loop` (`isContainedInArtifact`/`isSubpath`/`canonicalPath`) solve adjacent problems and share no code, each independently handling symlink-safety edge cases (e.g. macOS `/var` -> `/private/var`). | Low-Medium | `system-spec-kit/runtime/cli/core/workflow-path-utils.ts`, `system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Hoist the shared symlink-safe subpath primitive into a shared-lib if row 8's package is ever built | `grep -c "function isSubpath\|function isContainedInArtifact" .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (>0, confirming an independent implementation exists) | [iteration-005.md](iterations/iteration-005.md) (F5-2) |

---

## 3. Verified-Clean and Ruled-Out Results

Preserved as negative knowledge so a future audit does not re-spend
iterations re-checking the same ground:

- Memory-MCP / `scripts/` / `@spec-kit/scripts` / `memory/`-path retirement (packets 052-054's own chartered decommission work): exhaustively swept across every live `SKILL.md`, agent contract (5 runtime mirrors), and `references/` doc -- zero remnants found. [iteration-002.md]
- `.codex/agents` "file-count gap": Codex agents use `.toml` not `.md`; 12/12 parity confirmed across all 5 mirrored runtimes. [iteration-002.md]
- `runtime/dist/hooks` missing `pi/`: intentional `tsconfig.json` exclusion (`hooks/pi/**`); Pi loads `.ts` sources directly via 17 verified `.pi/extensions/` symlinks. [iteration-003.md]
- All 14 CI workflows (`.github/workflows/*.yml`) invoke scripts that exist in the current tree -- no CI-to-script drift found in this sweep. [iteration-003.md]
- `specs/system-speckit/000-release`'s non-table `Status:` line is a legitimate distinct "capture" template, not a defect. [iteration-004.md]
- `create/*.md`, `design/extract.md`, `prompt/improve.md`, `rewrite/response-by-external-agent.md`, `agent-router.md` correctly stay outside spec-kit's `create.sh`/`validate.sh` routing by design, per CLAUDE.md's own Gate 2 routing split. [iteration-001.md]
- `shared/paths.ts` is unrelated to path-containment (it resolves database directories). [iteration-005.md]
- `graph-metadata.json`'s `children_ids` does not wrongly include `research/`/`review/` local-owner folders. [iteration-009.md]
- Five additional README-cited CLI script paths (`check-api-boundary.sh`, `calculate-completeness.sh`, `upgrade-level.sh`, `recommend-level.sh`, `ARCHITECTURE.md`) all exist. [iteration-008.md]
- `feature-catalog.md` carries no aggregate numeric claim equivalent to the README's rule count, so no cross-check was possible for that half of the angle. [iteration-008.md]

---

## 4. Coverage by Research Angle

| # | Angle | Iteration | Headline result |
|---|---|---|---|
| 1 | Commands bypassing spec-kit routing | 1 | `improvement/` folder gap (row 6); rest of command surface routes correctly by design |
| 2 | Retired-surface references in skills/agents | 2 | Verified clean -- no live remnants of the memory-MCP decommission |
| 3 | Hook registrations vs adapters + CI vs invoked scripts | 3 | `mkHookDrift` asymmetry (row 5); CI-to-script mapping verified clean |
| 4 | Generated metadata vs documents (15+ packet sample) | 4 | Systemic stale `children_ids` (row 2), track-root staleness (row 7) |
| 5 | Duplicated helpers vs spec-kit's exported API | 5 | Premise reframed (row 8); concrete frontmatter (row 9) and path-containment (row 11) duplication |
| 6 | Retrieval coverage gaps | 6 | Critical trigger-index root-resolution bug (row 1) |
| 7 | Validation rule gaps | 7 | Synthesis mapping 4 defects to zero rule coverage (row 3) |
| 8 | README/feature-catalog accuracy | 8 | 46-vs-37 rule count (row 4) |
| 9 | Deep-loop integration seams vs metadata generators | 9 | Packet-metadata staleness after autonomous runs (row 10) |
| 10 | Ranked synthesis | 10 | This document |

---

## 5. Method Notes

- Read-only investigation throughout; no repository file outside this
  lineage directory was created, edited, or deleted.
- Every claim above is backed by a direct `file:line` citation, a command
  output, or a live artifact comparison in its source iteration file --
  see [iteration-001.md](iterations/iteration-001.md) through
  [iteration-010.md](iterations/iteration-010.md) for full evidence.
- `config.stopPolicy = max-iterations` was honored: all 10 iterations ran
  regardless of per-iteration `newInfoRatio`, per the operator's explicit
  instruction to broaden angles rather than converge early.
- No fixes were implemented; this is findings + fix sketch only, per the
  deep-research skill's own rule against implementing during research.
