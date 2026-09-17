---
title: "Implementation Plan: Phase 9: reference-rewrite"
description: "One token-bounded rule rewrites 2,963 files in 62 manifest-bound batches. DeepSeek V4.1 Flash executes each batch and the orchestrator verifies every diff against its manifest. Frozen records are excluded by glob, generators re-run by their owners and a rescan gates the handoff."
trigger_phrases:
  - "reference rewrite rule"
  - "reference rewrite batches"
  - "rewrite batch verification"
  - "reference rewrite delegation"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: reference-rewrite

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | 2,963 files: Markdown 2,177, TypeScript 358, CommonJS 106, shell 63, YAML 63, JSON 46, ESM 41, Python 40, plain text 29, JavaScript 22, templates 10, other 8 |
| **Framework** | system-spec-kit runtime and CLI, system-deep-loop runtime, system-skill-advisor runtime, opencode hooks and plugins, runtime mirror generators |
| **Storage** | None. `council-graph.sqlite` is a regenerate row whose writer is not identified (`002-per-runtime-reference-map/research/research.md:127`) and is never text-edited |
| **Testing** | vitest, node tests through `run-node-tests.mjs`, pytest, `check-markdown-links.cjs` and generator check modes |

### Overview
The map already names every file, so this phase is execution discipline more than discovery. One token-bounded rule, written once as `scratch/rewrite-batch.py` and proven against the pre-move census, turns `.opencode` into `.skilled` only where the next path segment is an entry that moved. DeepSeek V4.1 Flash runs it batch by batch against manifests that exclude frozen, generated and routed rows, decides the lines the rule leaves open and runs the batch's suite. The orchestrator checks each diff against its manifest before the next batch starts. A rescan closes the phase.

All counts below come from `002-per-runtime-reference-map/research/maps/map-c-references.tsv` and `map-b-runtime-files.tsv`, re-derived over the tree at `728c4f3efc`. They match `reconciliation.json:21-26` (C: 2,938 mechanical, 98 manual, 25 regenerate, 968 freeze).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 003 to 008 validate PASSED and every generator check passes on the phase base commit
- [ ] 004's moved list, keep-list and `.opencode/specs` target are read into the rule table
- [ ] `rewrite-batch.py --census` reproduces 14,905 automatic, 790 specs, 646 review and 78 never occurrences on `728c4f3efc`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] The final rescan reports zero unclassified occurrences, confirmed by an independent recount
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-bound batch rewrite. A deterministic rule changes every occurrence it can classify. Judgment is confined to the lines the rule marks for review.

### Key Components
- **`scratch/build-batch-manifests.py`**: translates map rows to post-move paths, drops freeze, regenerate and routed manual rows, forms the batches and records the base SHA and occurrence census of each batch.
- **`scratch/rewrite-batch.py`**: applies the rule to one manifest, lists review lines, checks the diff (`--verify`), prints the census (`--census`) and runs its boundary cases (`--self-test`). Dry run is the default.
- **`scratch/rescan-references.py`**: classifies every remaining occurrence in tracked files outside `specs/` for the handoff gate.
- **Batch brief and report**: one short brief per batch plus one report per batch at `scratch/batch-reports/batch-NN-report.md` holding review decisions, suite output and generator runs.

### Data Flow
Map rows → manifests with exclusions applied → brief → rule run and review decisions → suite and generator checks → orchestrator verification → one commit per batch → final rescan.

### Rewrite Rule
The token is the literal `.opencode`. It becomes `.skilled` only when all three conditions hold:

- the character before it is not a letter, digit or underscore
- the text before it is not `~/`, `$HOME/` or `${HOME}/`
- one of the forms below follows it

| Class | Form | Action | Occurrences | Files |
|-------|------|--------|------------:|------:|
| R1 path | `.opencode/<entry>` or the regex-escaped `\.opencode\/<entry>`, with `<entry>` on the moved list | Rewrite to `.skilled` | 14,626 | 2,684 |
| R1 segment | `'.opencode'` or `".opencode"` followed by a quoted moved entry, the `path.join(ROOT, '.opencode', 'skills')` form | Rewrite to `'.skilled'` | 279 | 133 |
| R2 specs | Either form above with `specs` as the entry | Apply 004's decision inside the same batch | 790 | 290 |
| R3 review | A bare `.opencode` (192), `.opencode/` followed by nothing or by an entry off the moved list (313), a quoted segment alone or before a non-moved entry (141) | Decide per line and record the decision in the batch report | 646 | 268 |
| X never | Identifier (`tool.opencode_goal`, `deps.opencodeDir`: 46), a name that continues past the token (`.opencode-backup-*`: 8), a home-anchored path (`~/.opencode/state/<id>/lock`: 24) | Leave unchanged | 78 | 25 |

The counts assume the parent's in-scope list (`../spec.md:80`) as the moved list: `skills`, `commands`, `agents`, `hooks`, `plugins`, `bin`, `scripts`, `install-guides`, `changelog` and `manual-testing-playbook`. T002 replaces it with 004's frozen list and T005 recomputes the census. The draft layout decides how far the list reaches. Under ADR-001's L1, `.opencode` itself becomes one link to `.skilled`, so every entry moves, `logs` and opencode's install files included. Under L2, opencode's install files can stay in `.opencode/` (`../004-migration-design/decision-record.md:70,82-83`).

**Keep-list precedence.** Before any class applies, the script sets aside every occurrence on a line that 004's keep-list names, as class K. The keep-list is ADR-003 (`../004-migration-design/decision-record.md:279-296`), still Proposed when this plan was written (line 257). Four of its draft positions fall inside the rewrite set and the rule would otherwise change them. K6 names `.opencode/plugins/README.md:16`, `cli-opencode/README.md:47` and `cli-opencode/SKILL.md:214`, all three R1 path forms. K8 names `.gitignore:7-10`, which B01 holds. The class counts above do not subtract class K, so T005 recomputes them once T002 has loaded the accepted list.

**The R3 test.** When a line names the authored source tree, the executor rewrites it. When it names something that stays `.opencode`, the executor keeps it and writes a one-line reason: the opencode runtime's own directory, a list of runtime directories such as `RUNTIME_DIR_ALLOWLIST` in `.opencode/commands/scripts/validate-command-references.cjs` or an entry on 004's keep-list. The most frequent R3 forms are the directory itself (`.opencode/` with nothing after it: 190), `logs` (48), singular `skill` (38) and singular `agent` (10).

### Exceptions
- **Where 004 keeps a compatibility path.** A reference keeps `.opencode` only when it describes the compatibility view itself: what the opencode runtime loads from its own directory, what root discovery probes or what a consumer project links. Those references sit almost entirely in rows routed to 006 (`repo-root.mjs`, `opencode.json`) and 010 (`PUBLIC-RELEASE.md`). Inside the rewrite set they surface as R3 lines, never as R1.
- **Opencode-runtime names are not paths.** `opencode.json`, `cli-opencode` and `sk-code-opencode` carry no leading dot and never match. Dotted names that do match fall in class X by the boundary test, for example `plugin.tool.opencode_goal.execute` in `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs` and `[features].opencode_hooks` in `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md`.
- **`.opencode-local/` is a consumer directory name.** Among tracked files outside `specs/` it appears only in `PUBLIC-RELEASE.md`, on 11 lines (23, 32, 36, 66, 67, 231, 246, 250, 251, 252, 402). That file is 010's row. The name-continues test excludes it wherever it appears.
- **Search scopes in recipes.** `rg ... specs .opencode` in command assets is a bare token, so it is R3. The executor rewrites it to `specs .skilled`, so the recipe searches the real files rather than whatever links 004 leaves at `.opencode/`.

### Freeze Exclusion List
`build-batch-manifests.py` applies these globs before a manifest exists. V4 applies them again to every batch diff before commit. Both root prefixes match, so the globs hold before and after the move.

| ID | Glob | Rows | Note |
|----|------|-----:|------|
| F1 | `{.opencode,.skilled}/skills/**/changelog/**` except `system-spec-kit/templates/changelog/**` | 287 | The carve-out removes the one false positive, `templates/changelog/README.md`, a mechanical template row |
| F2 | `{.opencode,.skilled}/skills/**/benchmark/reports/**` | 676 | Every dated run directory in the map sits under a `benchmark/reports/` folder |
| F3 | `{.opencode,.skilled}/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/**` | 5 | The grader's content-addressed cache |
| F4, proposed | `system-spec-kit/runtime/cli/retrieval/fixtures/` `latency-report.json`, `semantic-probes.json`, `recipe-execution.json`, `daemon-off-proof.json` | 4 | Captured once as acceptance evidence with no runtime reader (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:76-78`). Joins the list only when T036 records the decision |

F1 to F3 match the map's 968 freeze rows exactly, with no false negative. `tests/cache/` is deliberately absent: its two rows are mechanical (`002-per-runtime-reference-map/research/research.md:153`).

### Batch Plan
Partition rule, applied by T008 and reproducible from the map:
1. Code (any file not `.md`, `.txt` or `.tmpl`) groups by area and keeps import clusters whole, so a test travels with the module it imports. The rewrite set holds 342 relative-import edges. A partition by subarea alone split 195 of them across batches, 183 from test files, because the seed files every `tests` path under its own subarea (`002-per-runtime-reference-map/scratch/build-seed-inventory.py:47-48`).
2. Documentation groups by area and fills by subarea, largest first.
3. Caps: 60 files or 400 matching lines per code batch, 80 files or 600 lines per documentation batch. A cluster or single file above the cap stays whole as its own batch.
4. Small groups merge: the code of nine small skills into B22, the scattered root and dot-directory documents into B25, both agent trees into B23.

| Batches | Group | Kind | Files | Lines | Batch sizes | 2F |
|---------|-------|------|------:|------:|-------------|----|
| B01 | Root config: `.gitignore`, `.utcp_config.json`, `.env.example`, `.github/dependabot.yml` | code | 4 | 66 | 4 | yes |
| B02 | `bin` | code | 19 | 54 | 19 | yes |
| B03-B04 | system-skill-advisor | code | 134 | 399 | 83, 51 | yes |
| B05 | `scripts` | code | 9 | 69 | 9 | yes |
| B06 | `hooks` | code | 31 | 69 | 31 | yes |
| B07-B11 | system-spec-kit | code | 245 | 1,029 | 60, 60, 60, 58, 7 | yes |
| B12 | `plugins` | code | 27 | 114 | 27 | yes |
| B13-B14 | system-deep-loop | code | 100 | 438 | 60, 40 | yes |
| B15-B19 | `commands` | code | 77 | 1,526 | 24, 20, 17, 13, 3 | B15 only |
| B20-B21 | sk-doc | code | 57 | 1,083 | 56, 1 | yes |
| B22 | Nine small skills | code | 38 | 111 | 38 | yes |
| B23 | `agents/` with `.claude/agents/` | mixed | 26 | 283 | 26 | no |
| B24 | Authored runtime files | mixed | 14 | 69 | 14 | yes |
| B25 | Root and dot-directory documents | docs | 13 | 212 | 13 | no |
| B26 | `hooks` | docs | 19 | 208 | 19 | no |
| B27 | `commands` | docs | 65 | 481 | 65 | no |
| B28-B32 | system-spec-kit | docs | 297 | 1,773 | 80, 80, 64, 63, 10 | no |
| B33-B40 | system-deep-loop | docs | 580 | 2,465 | 80, 80, 80, 80, 80, 80, 74, 26 | no |
| B41-B43 | system-skill-advisor | docs | 158 | 871 | 79, 48, 31 | no |
| B44-B46 | sk-doc | docs | 184 | 750 | 75, 70, 39 | no |
| B47-B49 | sk-code | docs | 203 | 988 | 71, 68, 64 | no |
| B50-B54 | cli-external-orchestration | docs | 283 | 764 | 70, 64, 61, 58, 30 | no |
| B55-B56 | mcp-tooling | docs | 145 | 372 | 79, 66 | no |
| B57-B62 | sk-design, sk-git, sk-vision, mcp-code-mode, sk-prompt, sk-communication | docs | 235 | 762 | 69, 43, 32, 30, 32, 29 | no |
| **Total** | **62 batches: 22 code, 2 mixed, 38 docs** | | **2,963** | **14,956** | | **19** |

`2F` marks a second-family review. A code or mixed batch gets one when a file in it holds `.opencode` as a whole quoted string (the path-constant form) or when it touches `bin`, `hooks`, `plugins`, `scripts`, `runtime-mirrors`, an MCP registration or the Hermes plugin. B01 gets one for `.gitignore`. T008 recomputes the flag with the manifests.

**The two large skills by subarea.** system-spec-kit code (B07-B11) splits by import cluster across `runtime`, `tests` and `shared`. Its documents split into `runtime` with part of the playbook (B28), feature catalog, tests, templates and the skill root files (B29), the rest of the playbook (B30), `references` with `runtime` (B31) and `shared` (B32). system-deep-loop documents split into `deep-research` (B33), `deep-review` with `deep-research` (B34), `deep-improvement` with `deep-review` (B35), `deep-improvement` with `deep-ai-council` (B36), `deep-ai-council` (B37), `runtime` (B38), `runtime` with the playbook (B39) and the remainder (B40).

**Order.** B01 runs first because every later `git status` check depends on the ignore rules. B02 to B04 run back to back with both suites after B04, since `bin` and the advisor import each other (3 edges one way, 1 the other). B06 and B07-B11 precede B12, because plugins import hooks (3 edges) and spec-kit (4 edges). Spec-kit's 2 edges into `bin` are already covered by B02. Code runs before mixed and mixed before documentation. The manual rows follow documentation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The rewrite changes path handling and generator inputs, so the producers and consumers of rewritten text are listed here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scratch/rewrite-batch.py` | Produces every edit in the phase | Create, then second-family review before B01 | The census on `728c4f3efc` matches 14,905, 790, 646 and 78 |
| Tests asserting emitted paths | Consume the runtime modules they import | Rewritten in the same batch as their subject | The group suite after each batch |
| `sync-runtime-mirrors.cjs`, `sync-hook-registrations.cjs`, `sync-gate1-pointers.cjs` | Render runtime mirrors, hook registrations and Gate 1 blocks from commands, hooks, `hook-registry.json` and `AGENTS.md` | Re-run after B06, B07-B11, B15-B19, B26, B27 and T032 | `--check` exits 0 (`sync-hook-registrations.cjs:14-15`, `sync-gate1-pointers.cjs:14-15`, `sync-runtime-mirrors.cjs:58-61`) |
| `sync-prompts.cjs`, `sync-prompts-pi.cjs`, `sync-prompts-hermes.cjs`, `sync-agents.cjs`, `sync-agents-pi.cjs` | Derive Codex, Pi and Hermes prompts and agents from commands and agents | Re-run after B15-B19, B23 and B27 | `--check` exits 0 |
| `sync-skills-hermes.cjs` | Writes `.hermes/skills` from `.opencode/skills` and mirrors agents from `.opencode/agents` (lines 20-21, 27) | Re-run after every batch that edits a `SKILL.md` or an agent | `--check` exits 0 |
| `generate-trigger-index.mjs` | Writes `trigger-index.json` and three fixtures from document frontmatter (lines 64-67) | Re-run after each documentation batch inside its corpus | Exit 0, with index and manifest committed together (`runtime/cli/retrieval/README.md:78`) |
| `regenerate-skill-derived.cjs` | Repairs skill `graph-metadata.json`, pruning path fields that do not resolve (lines 9-16) | Default dry run after skill documentation batches, `--write` only when nothing is pruned | The dry run lists no pruned field |
| `compile-command-contracts.cjs` | Compiles the deep command contracts. Without `--write` it only prints (lines 703-710) | `--write` for `deep/research`, `deep/review` and `deep/ai-council` after B15-B19 and B27 | `check-contract-drift.cjs` passes. It fails when a compiled body differs from fresh compiler output (lines 450-458) |
| `derive-command-bridges.cjs` | Writes `command-bridges.generated.json` (line 15) | Re-run after command batches | `command-bridges-drift-guard.vitest.ts` passes (it reads the file at line 48) |
| `compiled-route-sync.cjs` | Writes the serving-closure manifest that records the runtime root (`002-per-runtime-reference-map/research/research.md:127`) | `--check` after B02 | Exit 0 |
| `test_readme_verdict_parity.py` | Rebuilds `baseline-readme-verdicts.json` with `--write` (lines 4-6) | `--write` after batches that edit a README | The plain run passes |

Required inventories:
- Same-class producers: `git grep -n -E "['\"]\.opencode['\"]" -- ':!specs/'` finds the quoted-segment form. In the rewrite set, 279 of those occurrences are followed by a moved entry and are R1.
- Consumers of changed paths: the generators above, plus every test inside an import cluster.
- Matrix axes: area group (29 groups) by occurrence class (R1 path, R1 segment, R2, R3, X). Every batch report tabulates its census on both axes.
- Algorithm invariant: `.opencode` changes only at a token boundary before a moved entry. The script's `--self-test` covers `tool.opencode_goal`, `.opencode-local/`, `.opencode-backup-*`, `~/.opencode/state`, `\.opencode\/specs`, `'.opencode', 'logs'`, `specs .opencode"` in an `rg` recipe, `.opencode.json` and an R1 path form on a keep-list line such as `.opencode/plugins/README.md:16`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

After the last batch, re-run phase 008's regeneration runbook unchanged (`../008-links-and-generated-state/plan.md` §4, rows 1 and 3 to 14, then row 15 for this folder). Codex and Pi agents embed agent bodies, Hermes copies embed `SKILL.md` bodies, compiled contracts hash their sources and the trigger index hashes every corpus byte, so the rewrite stales each of them. The six runtime `SYNC.md` manifests under `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes` and `.pi` are inputs of that rewrite too, because generated copies embed their text.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The rule's boundary cases | `rewrite-batch.py --self-test` |
| Integration | Each batch's group suite and generator checks | vitest, node tests, pytest, generator `--check` |
| Regression | Every rewritten concrete path resolves at the tip when its old form resolved at the base | `rewrite-batch.py --verify` |
| Manual | Second-family review of the scripts, the 19 batches marked 2F and the rescan count | GPT-5.6 on cli-codex, read-only |

### Per-Batch Verification
The orchestrator runs all eight checks before committing a batch. Any one failing fails the batch.

| Check | Command or evidence | Pass condition |
|-------|---------------------|----------------|
| V1 Manifest | `git diff --name-only <base>` against the manifest | Changed paths sit inside the manifest, the report and named generator outputs. Every manifest file with an R1 occurrence changed |
| V2 Census | `rewrite-batch.py --census --manifest <m>` | R1 is 0, R2 matches 004's decision, K and X equal the base census and R3 equals the keep decisions in the report |
| V3 Line balance | `git diff --numstat <base>` and `git diff --name-status <base>` | Added lines equal removed lines for every file and no `R` status appears |
| V4 Exclusions | Diff paths against F1-F3, the regenerate list and the routed manual rows | No match, except output written by a named generator command |
| V5 Resolution | `rewrite-batch.py --verify --manifest <m>` | No path in fenced code that resolved at the base fails at the tip. Inline failures are logged, not blocking |
| V6 Suite | The group suite below | Exit 0, with the output tail copied into the report |
| V7 Generators | The checks of every generator the batch feeds | Each exits 0 |
| V8 Review | GPT-5.6 read-only review, batches marked 2F only | No open P0 or P1 |

Markdown gets one extra distinction. Fenced lines are runnable instructions (2,326 lines in map C's mechanical rows), so a resolution regression there blocks the batch. Inline prose (7,216 lines) is rewritten by the same rule and logged when a path fails to resolve, because prose may name example paths.

### Suites By Group
Commands use today's paths. Run each at the location 004's layout gives its entry.

| Batches | Suite |
|---------|-------|
| B01 | `git ls-files -ci --exclude-standard` matches its base output, so no tracked file became ignored. `git status --porcelain --untracked-files=all` lists no build output under a moved entry |
| B02 | `npx vitest run --config .opencode/vitest.config.bin.ts` and `node .opencode/scripts/run-node-tests.mjs`, whose roots include `bin`, `scripts`, `plugins`, `hooks` and `skills` (line 23) |
| B03-B04 | `npm --prefix .opencode/skills/system-skill-advisor/runtime run typecheck`, then `test` in the same package |
| B05, B12 | `node .opencode/scripts/run-node-tests.mjs`, plus `bash -n` on each changed shell file |
| B06 | `npx --prefix .opencode vitest run --config .opencode/hooks/vitest.config.ts`. CI runs hook tests through `npx --prefix .opencode vitest` (`.github/workflows/dispatch-enforcement-guard.yml:44-45`) |
| B07-B11 | `npm --prefix .opencode/skills/system-spec-kit run typecheck`, then `test` in `system-spec-kit/runtime` and in `system-spec-kit/runtime/cli`, the lanes CI runs at `.github/workflows/spec-kit-check.yml:83-114` |
| B13-B14 | `npm --prefix .opencode/skills/system-deep-loop/runtime run typecheck` and `test`, plus the vitest configs in `deep-ai-council/` and `deep-improvement/scripts/` |
| B15-B19, B27 | `node .opencode/commands/scripts/validate-command-references.cjs`, `node .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` and the command generator re-runs |
| B20-B21, B44-B46 | `python3 -m pytest .opencode/skills/sk-doc/scripts/tests`, the runner CI uses at `.github/workflows/naming-standard-guard.yml:50` |
| B22 | `node .opencode/scripts/run-node-tests.mjs` for the batch's skills, plus pytest for any Python file in the batch |
| B23 | `sync-agents.cjs --check`, `sync-agents-pi.cjs --check`, `sync-skills-hermes.cjs --check` and the agent mirror gate from 005 |
| B24 | Parse each MCP registration (JSON and TOML), `python3 -m py_compile .hermes/plugins/repo-guards/__init__.py` and confirm every registered launcher path exists |
| B25-B62 | `node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` (`.github/workflows/markdown-link-integrity.yml:29-37`), V5 and the generator re-runs for the batch's corpus |

### Final Rescan
`scratch/rescan-references.py` runs the seed's pathspec without `-I`: `git grep -c -F .opencode -- . ':!specs/' ':!**/node_modules/**'`. The seed ran with `-I` and missed two binary-detected files (`002-per-runtime-reference-map/research/research.md:161`). Every occurrence found lands in one class.

| Class | Allowed when |
|-------|-------------|
| Freeze | The path matches F1 to F3 (or F4 once T036 records it) |
| Never | The occurrence is class X |
| Kept by design | Any one of three: the occurrence is class K, on a line or entry 004's keep-list names / the line is an R3 keep decision recorded in a batch report / a 005 or 006 contract keeps it, with that phase's decision cited |
| Generated | The file is a regenerate row and its generator check passes at the tip |
| Routed to 010 | `PUBLIC-RELEASE.md`, the launchd plist or the plist's README |
| Unclassified | Anything else. The gate requires zero |

GPT-5.6 on cli-codex then recounts the unclassified class read-only, from the same pathspec with its own classifier. The two counts must agree at zero. Symlink targets are not part of this rescan: 008's link census owns them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:delegation -->
## DELEGATION

Parent D3 assigns execution to DeepSeek V4.1 Flash and verification of every return to the orchestrator (`../goal.md:48`).

| Unit | Executor | Brief carries | Verified by |
|------|----------|---------------|-------------|
| The three phase scripts (T003) | DeepSeek V4.1 Flash at `--thinking max`, cli-pi through the LLM Gateway | The rule table, the freeze globs, the census to reproduce and the boundary cases | The orchestrator reruns the census (T005). GPT-5.6 reviews the code (T004) |
| B01 to B62, one brief each (T011-T031) | DeepSeek V4.1 Flash, same route | The child preamble, the role, the manifest's exact paths, the rule, the R3 test, the suite and generator commands, the report path and the prohibitions | The orchestrator runs V1 to V8. GPT-5.6 reviews the 19 batches marked 2F |
| 39 manual rows (T032-T036) | Orchestrator | None | The suite of each fixture's assertion plus the disposition logged in `goal.md` |
| Entry checks, manifests, generator closeout and rescan (T001-T002, T005-T010, T037-T043) | Orchestrator | None | Output and exit status read. GPT-5.6 recounts the rescan (T039) |

**Dispatch.** `pi -p --model llmgateway/deepseek-v4.1-flash --thinking max`. The gateway route and its `max` pin come from `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:113`. `--model` must carry its provider (`cli-pi/SKILL.md:21`). Set `AI_SESSION_CHILD=1` and paste the child-dispatch preamble at the top of every brief (`cli-pi/SKILL.md:217`). The orchestrator sends each brief from its own session, never from inside a fan-out lineage, which the runtime refuses (`cli-pi/SKILL.md:222`). Reviews run `codex exec` in a read-only sandbox with stdin closed (`cli-codex/SKILL.md:9`). Both `SKILL.md` files are read before the first brief.

**Brief shape.** Short and literal, one change per brief, in the RCAF skeleton: role, context, action, format. The manifest lists exact post-move paths. Write authority is those paths plus `scratch/batch-reports/batch-NN-report.md`. Every output name is kebab-case. The executor adds no comments, renames nothing, never commits and never runs `git add`.

**Containment.** After each return the orchestrator reads `git status --porcelain`. A path outside the manifest, the report and named generator outputs fails the batch and is reverted. If a batch ever runs through the fan-out runner instead, its containment reverts out-of-scope writes and fails the run. Its `containment/` snapshot directories nest untracked, as they sit today under the phase 001 and 002 lineages. Commits stage explicit paths only.

**Dispatch estimate.** 63 DeepSeek briefs (62 batches and the script unit) and 21 GPT-5.6 reviews (19 batches, the scripts and the rescan count), before retries. The only measured DeepSeek latency in this packet is phase 002's lane: 10 iterations in 14 minutes (`002-per-runtime-reference-map/research/research.md:138`).

**No substitution.** When the gateway refuses the model, the queue pauses and the orchestrator reports. A different executor requires an amendment to parent D3.
<!-- /ANCHOR:delegation -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 layout: moved list, keep-list, `.opencode/specs` target | Internal | Yellow: ADR-001 and ADR-003 are drafted but still Proposed, pending the phase 003 probes (`../004-migration-design/decision-record.md:45,257`) | No manifest can be built |
| 005 hooks and CI accept both roots | Internal | Red: draft | Pre-commit may reject content commits |
| 006 dual-root discovery, launchers and installers | Internal | Red: draft | Suites fail on discovery rather than on the rewrite |
| 007 tree under `.skilled/` | Internal | Red: draft | Map paths do not translate |
| 008 links resolve and generated state rebuilt | Internal | Red: draft | Generator drift cannot be attributed to a batch |
| DeepSeek V4.1 Flash through the LLM Gateway | External | Green: live-verified 2026-09-10 (`providers-and-models.md:113`) | The batch queue pauses |
| GPT-5.6 through cli-codex | External | Yellow: variant not chosen | Reviews wait and batches marked 2F cannot commit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite still red after three repairs (parent D2), a V1 to V5 failure the executor cannot fix inside its manifest, a P0 from the second-family review or any change under F1 to F3.
- **Procedure**: before commit, `git checkout -- <manifest paths>` resets the batch. After commit, `git revert --no-edit <batch sha>` removes it, reverting later dependent batches first when the import-cluster order ties them. The group suite and generator checks run again after either.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup T001-T010 ──► Code B01-B22 ──► Mixed B23-B24 ──► Docs B25-B62
                                                           │
Rescan T038-T043 ◄── Generator closeout T037 ◄── Manual rows T032-T036
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 003 to 008 validated | Code batches |
| Code batches | Setup | Mixed and documentation batches |
| Mixed batches | Code batches | Documentation batches |
| Documentation batches | Mixed batches | Manual rows |
| Manual rows | Documentation batches, the contracts 005 and 006 shipped | Generator closeout |
| Generator closeout | Manual rows | Rescan |
| Rescan and closure | Generator closeout | Phase 010 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimates, not measurements.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup, scripts and census proof | Medium | 4-6 hours |
| 62 batches with verification | High | 26-47 hours, at 25-45 minutes per batch including suites |
| Manual rows and generator closeout | Medium | 4-8 hours |
| Rescan and closure | Low | 2-3 hours |
| **Total** | | **36-64 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The phase base SHA and each batch's base SHA are recorded in the manifests
- [ ] The freeze baseline (`git ls-files -s` over the 968 paths) is captured at T010
- [ ] Every generator check passes on the phase base commit

### Rollback Procedure
1. Stop the queue, so no further brief goes out.
2. Revert the single batch commit. For the whole phase, run `git revert --no-edit <first phase sha>^..<last phase sha>`.
3. Rerun the affected group suites, every generator check and the freeze baseline comparison.
4. Log the trigger and the reverted range in `goal.md`. Resend the directive when a decision changed.

A whole-phase revert restores `.opencode/...` references, which resolve only while 004's compatibility layer exists. Once a later phase removes that layer, reverting this phase alone breaks references and recovery becomes a forward fix. Phase 004 names when that point arrives.

### Data Reversal
- **Has data migrations?** No. `council-graph.sqlite` and every other binary file stay untouched.
- **Reversal procedure**: N/A. Git history carries every text change.
<!-- /ANCHOR:enhanced-rollback -->

---
