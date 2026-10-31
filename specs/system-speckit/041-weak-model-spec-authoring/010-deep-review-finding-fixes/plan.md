---
title: "Implementation Plan: Phase 10: deep-review-finding-fixes"
description: "Fix the nine review P1s and every reproducing P2 at their source files in three parallel lanes, each fix proved by a check that failed first, with a before and after census over specs/."
trigger_phrases:
  - "deep review finding fixes plan"
  - "054 review remediation plan"
  - "required template anchors v2.3"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 10: deep-review-finding-fixes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript on Node 26, Markdown and YAML |
| **Framework** | The system-spec-kit validator (the compiled orchestrator plus its shell rules), the speckit and deep command assets |
| **Storage** | None. Every change is a file in the repository |
| **Testing** | Vitest suites under `runtime/cli/tests/` and `runtime/tests/`, `validate.sh --strict` on seeded fixtures, the two guard scripts and a census over `specs/` |

### Overview
This phase changes `create.sh`, the three placeholder scanners, the anchor check, two guards and the guidance a weak model reads, then corrects the packet records the review flagged. Every change lands in the file its finding names, in one of three lanes that never share a file. Each fix is proved by a test or fixture run that failed before the change, and a census over 4,719 folders in `specs/` must give the same verdicts before and after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The review is committed: `git log -1 --format=%h -- specs/system-speckit/054-weak-model-spec-authoring/review/review-report.md` prints `84887f37f7`.
- [ ] The before census is recorded: `cat scratch/baseline/b-before-*.tsv | wc -l` prints 4719.
- [ ] The per-rule census is recorded: `wc -l < scratch/baseline/rules-before.tsv` prints 4719.
- [ ] The suite baseline is recorded: `tail -2 scratch/baseline/suite-runtime-before.txt` and `tail -2 scratch/baseline/suite-cli-before.txt` each print an `exit=` line.
- [ ] Every registry entry has a verdict: `rg -c '^\| R' scratch/p2-ledger.md` prints 63.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` reads `Met`.
- [ ] The after census matches the before census: `diff <(cut -f1,2 scratch/baseline/b-before.tsv) <(cut -f1,2 scratch/baseline/b-after.tsv)` prints nothing.
- [ ] `validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`.
- [ ] Both closing reviews report no P0 or P1.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at source. Each finding is repaired in the file that produces the behavior, and every reader of that file is checked.

### Key Components
- **`runtime/cli/spec/create.sh`**: makes `specs/<track>` at line 1294 before any path check. It gains a track check that runs before that `mkdir`.
- **`validatePlaceholders` in `runtime/lib/validation/orchestrator.ts`**: the only placeholder gate `validate.sh` runs. The registry shell rule with the same id is skipped because the orchestrator produces that id natively (`orchestrator.ts:423-428`, `:1250-1253`).
- **`runtime/cli/rules/check-placeholders.sh`**: the shell mirror. Only the isolated rule harness and the parity test run it, so it changes only to stay in parity.
- **`runtime/cli/spec/check-placeholders.sh`**: the post-edit scan the hook runs on every spec-doc edit (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:39`). No test covers it today.
- **`validateAnchorIntegrity` in `orchestrator.ts`**: ANCHORS_VALID. It renders each doc's template for the level and today checks anchor integrity only.
- **`runtime/cli/utils/template-structure.js`**: `loadTemplateContract` already splits a template's anchors into required and optional by header prefix, and the drift guard relies on it.
- **The guidance surfaces**: the authoring card, the four example `tasks.md` files, `template-mapping.md`, the speckit plan and implement assets, the `markdown` agent and the playbook leaves.
- **The tooling gaps**: `packet-synopsis.ts`, `gitIgnoredPaths` in `retrieval/lib/corpus.mjs` and `deep-review-auto.yaml` with its compiled contract.

### Data Flow
`validate.sh` checks that the build is fresh, then calls the compiled orchestrator in `runtime/dist/`. The orchestrator runs its native rules first and then every registry rule it does not already produce. A source fix therefore reaches strict validation only after `npm run build`. The post-edit hook calls `spec/check-placeholders.sh` with the edited doc's folder and shows its exit 1 as a warning. `create.sh` composes the templates through `lib/template-utils.sh` into a new folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The rows below come from the Planning Packet in `../review/review-report.md`: its `affectedSurfacesSeed`, the `findingClass` of each active finding and `fixCompletenessRequired: true`. The surfaces the three P2 ledgers and the four explorers found follow them. Imported values are quoted as data. No command was copied from a `scopeProof` field, and each verification below was chosen independently.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/create.sh` | P1-01, class "path-traversal": appends the raw `--track` to `specs/` and runs `mkdir -p` | update | `create-track-containment.vitest.ts` fails before the fix and passes after |
| `runtime/lib/validation/orchestrator.ts` | P1-02 and P1-05, classes "gate-false-negative": the live placeholder gate and ANCHORS_VALID | update | `placeholder-token-gate.vitest.ts` and `required-template-anchors.vitest.ts`, then `validate.sh` on seeded fixtures |
| `runtime/cli/rules/check-placeholders.sh` | P1-02 mirror, used by the harness and the parity test | update | the parity cells in `placeholder-token-gate.vitest.ts` |
| `runtime/cli/spec/check-placeholders.sh` | P1-03 "gate-false-negative" and P1-04 "gate-false-positive": the post-edit scan | update | `post-edit-placeholder-scan.vitest.ts` prints 1 on a token folder and 0 on packet 054 |
| `runtime/cli/lib/validator-registry.json` | P1-05: describes ANCHORS_VALID | update | the ANCHORS_VALID description names the v2.3 required-anchor error |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | P1-06, class "incomplete-alignment": the plan prompt contract | update | `rg -l spec-authoring-card .skilled/commands/speckit/` lists it |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | P1-06: the implement prompt contract | update | the same `rg` lists it |
| `templates/examples/level-2/tasks.md` and the three other example task files | P1-07, class "followability-contradiction" | update | the card's corrected task check prints equal counts per file |
| `assets/template-mapping.md` | P1-08, class "stale-guidance": teaches `[PLACEHOLDER]` | update | `rg -n '\[PLACEHOLDER\]' .skilled/skills/system-spec-kit --glob '*.md'` shows no teaching use |
| `manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` | P1-09, class "unverified-containment" | update | its Pass rule runs `git status --porcelain` before cleanup |
| `runtime/cli/utils/template-structure.js` | owns the required and optional anchor split the drift guard uses | unchanged, it is the contract the new check mirrors | a parity test compares its `requiredAnchors` with the orchestrator's for every level and core doc |
| `templates/spec-kit-docs.json` `sectionGates` | read by SPEC_DOC_SUFFICIENCY for four lazy docs | unchanged | its Level 3 rows name anchors the core templates never emit, so the new check does not read it (ADR-001) |
| `runtime/cli/lib/status-classifier.sh` and `specStatusIsDraft` | read the first Status row only | update for v2.3 docs | a fixture with a Draft row and then a Complete row |
| `runtime/cli/rules/check-scaffold-never-touched.sh` | skips `spec.md` | update for v2.3 docs | a v2.3 fixture with a `[template:` title in `spec.md` fails |
| `runtime/cli/spec/check-example-drift.sh`, `check-card-sync.sh` and their tests | guards that pass without `rg` and miss order and coverage | update | each guard exits non-zero on a seeded defect and on a `PATH` without `rg` |
| `templates/core/*.tmpl`, `templates/packet-types/phase-parent.spec.md.tmpl` and `scaffold-golden-snapshots.vitest.ts.snap` | the text a new scaffold receives | update | the snapshot diff shows only the intended lines |
| `runtime/lib/description/packet-synopsis.ts` | tooling gap: cuts a long first sentence at a word | update | a unit case and a drift census before and after |
| `runtime/cli/retrieval/lib/corpus.mjs` `gitIgnoredPaths` | tooling gap: the one `git` call behind the trigger index generator, also used by `spec/repo-era.mjs`, hangs under fsmonitor | update | a unit case asserts the spawn carries `core.fsmonitor=false` |
| `references/workflows/auto-mode-contract.md` | a whole-file digest source of the compiled deep contracts, and one of the five docs with `/spec_kit:` | update, then recompile the contracts | `check-contract-drift.cjs` exits 0 after the recompile, and again after the commit hook raises the doc's version |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` and its compiled contract | tooling gap: the root resource-map reducer runs at a fan-out root | update, then recompile | `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts` pass |
| `.skilled/agents/markdown.md` and its four mirrors | names the card but not the token rule or the guards | update | the mirror parity check passes |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | asserts the hook's label and folder argument with a stub | not a consumer of the scan's matching | unchanged |

Required inventories:
- **Same-class producers.** The placeholder markers live in three places: `orchestrator.ts:665`, `rules/check-placeholders.sh` and `spec/check-placeholders.sh:99`. `rg -n 'YOUR_VALUE_HERE' .skilled/skills/system-spec-kit/runtime --glob '*.sh' --glob '*.ts' --glob '*.mjs' --glob '*.cjs'` must list no fourth scanner. The status readers are `status-classifier.sh:68-82`, `specStatusIsDraft` in `orchestrator.ts` and `classifyStatus` in `cli/sweep/strict-pass-freshness.ts`.
- **Consumers of changed symbols.** `status-classifier.sh` is sourced by `rules/check-placeholders.sh`, `check-status-cross-doc-consistency.sh` and `check-scaffold-never-touched.sh`. `derivePacketSynopsis` feeds `extractDescription` in `folder-discovery.ts`, `deriveCausalSummary` in `graph-metadata-parser.ts` and the drift check. `deep-review-auto.yaml` is read by the compiled contract and by 14 tests that parse its text.
- **Matrix axes.** The placeholder parity matrix crosses the stamp (v2.2, v2.3), the status (Draft, Complete) and the shape (a bare token, a backticked token, a backticked token then a bare one, a token inside a code span, a backtick fence, a tilde fence, an indented fence, the `<YOUR_VALUE_HERE:` form and a `[template:` title). Every shape gets a v2.3 Complete row, and every shape whose v2.2 verdict the fix keeps gets a v2.2 row.
- **Algorithm invariant for P1-01.** No `--track` value can name a folder outside `$REPO_ROOT/specs/`. The adversarial values are `..`, `../x`, `a/../../x`, an absolute path and `.`, and each is refused before the `mkdir`. An empty value keeps its current meaning, no track. `demo` and `demo/sub` still work. A track folder that already exists as a symlink stays honored, because the check reads the value and never resolves the link: the main checkout keeps `specs/ai-systems`, `specs/anobel.com` and `specs/obsidian` as deliberate links to sibling project folders, which `.skilled/bin/relink-local-specs.sh` maintains.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the ordered tasks and their state. Setup records the baselines, implementation runs the three lanes, and verification proves the result and closes the phase. The four steps below are the plan those tasks follow.

### Step 1: Record the baselines and reproduce every finding

Take the recursive strict census and the per-rule census over `specs/`, run both suites, merge the three P2 ledgers and write a check for each P1 that fails on the unchanged tree.

Acceptance: `scratch/baseline/` holds both censuses for 4,719 folders and both suite logs, `scratch/p2-ledger.md` gives each of the 63 registry entries a verdict, and each P1 check fails before its fix.
Verify: `cat scratch/baseline/b-before-*.tsv | wc -l` prints 4719 and `rg -c '^\| R' scratch/p2-ledger.md` prints 63.

### Step 2: Fix the gate code

Lane A adds the track check to `create.sh`, aligns the three placeholder scanners, adds the v2.3 required-anchor check, fixes the v2.3 scaffold and status checks, ends the synopsis cut at a clause, makes the trigger index's `git` calls skip fsmonitor and rebuilds the runtime and CLI.

Acceptance: each lane A test passes, and `validate.sh --strict` gives each seeded fixture the verdict its acceptance row names.
Verify: `npx vitest run runtime/cli/tests/create-track-containment.vitest.ts runtime/cli/tests/placeholder-token-gate.vitest.ts runtime/cli/tests/post-edit-placeholder-scan.vitest.ts runtime/cli/tests/required-template-anchors.vitest.ts --config vitest.config.ts`, run from `.skilled/skills/system-spec-kit`, prints `Test Files  4 passed`.

### Step 3: Fix the guidance, guards, playbook and records

Lane B aligns the card, the examples, the templates, `template-mapping.md`, the two guards, the speckit assets and the `markdown` agent. Lane C fixes the playbook leaves, the retired command prefix in five reference docs, the benchmark report, the packet records and the deep-review fan-out step.

Acceptance: both guards exit 0 on the tree and non-zero on each seeded defect, the corrected card checks pass on the four examples, scenario 483 checks containment before cleanup, and each record finding has its dated note.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` prints `EXAMPLE_DRIFT_OK` and then `CARD SYNC OK`.

### Step 4: Verify, record and close

Rebuild, rerun both suites and both censuses, regenerate the two stale descriptions, refresh continuity, write the release records, run the closing reviews and commit on the worktree branch.

Acceptance: the after census matches the before census, no suite file fails that passed in the baseline, recursive strict validation of packet 054 passes, and both closing reviews report no P0 or P1.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each changed script and module, one file at a time | `npx vitest run runtime/cli/tests/<file>.vitest.ts --config vitest.config.ts` from `.skilled/skills/system-spec-kit` |
| Integration | `validate.sh --strict --no-recursive --json` on seeded fixture copies, and each guard on a seeded copy | Bash in the session scratchpad |
| Census | The strict verdict of 4,719 folders and the status of six rules per folder, before and after | `scratch/tools/strict-census.mjs` and `scratch/tools/rule-census.mjs` |
| Suite | The full system-spec-kit runtime and CLI suites, before and after | `npm --prefix .skilled/skills/system-spec-kit/runtime test` with `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000`, then the CLI `npm test` |
| Contract | The deep/review compiled contract after the YAML edit | `compile-command-contracts.cjs --command deep/review --write`, then `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts` |
| Review | The phase diff, read-only | cli-devin with DeepSeek V4.1 Flash max, then cli-codex with LUNA 6 MAX FAST |

The unit run must print a failing test before each fix and a passing one after it. The census run must print the same verdict for every folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node, npm and the `tsc` build of runtime and CLI | Internal | Green | `validate.sh` refuses a stale build with exit 3, so no fix is visible to strict validation |
| Vitest | Internal | Green | No unit proof for any fix |
| `rg`, `jq`, `awk` and `bash` | External | Green | The guards and the record checks cannot run |
| `compile-command-contracts.cjs` in system-deep-loop | Internal | Green | The deep/review contract goes stale and fix-mode rendering refuses it |
| The continuity writer `generate-context.js` | Internal | Green | The continuity refresh and the parent's last-active pointer stay stale |
| cli-devin and cli-codex | External | Yellow | No closing review. The phase cannot close and the blocker goes to the operator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the after census gives any folder a different verdict, or a suite file fails that passed in the baseline.
- **Procedure**: each lane lands as its own commit on `worktrees/217-weak-model-spec-authoring`. `git revert <lane commit>` restores that lane's files. Rebuild with `npm run build`, then rerun the census for the affected rule.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines, ledger) ──┬──► Lane A (gate code) ──────────────────┐
                            ├──► Lane B (guidance and guards) ────────┼──► Verify and close
                            └──► Lane C (playbook, records, tooling) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Lanes A, B and C |
| Lane A | Setup | Verify |
| Lane B | Setup | Verify |
| Lane C | Setup | Verify |
| Verify | Lanes A, B and C | None |

No lane edits a file before the before census and both suite baselines finish, because the census runs the rule scripts and templates live.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour, most of it the census and the suites running |
| Lanes A, B and C | High | 2 to 3 hours of wall clock, lanes in parallel |
| Verification | Medium | 2 hours: rebuild, suites, census and two reviews |
| **Total** | | **5 to 6 hours, an assumption from the phase 003 and phase 009 run times** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Baselines   │────►│ Lanes A,B,C  │────►│ Rebuild and  │
│ census, suite│     │  fix at src  │     │ suite after  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                     ┌──────────────┐     ┌──────▼───────┐
                     │  Reviews and │◄────│ Census after │
                     │    commit    │     │  and records │
                     └──────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baselines | None | Before census, rule census, suite logs, P2 ledger | Every lane |
| Lane A | Baselines | Fixed scanners, track check, anchor check, synopsis cut, trigger index calls, rebuilt dist | Rebuild and suite |
| Lane B | Baselines | Card, examples, templates, snapshots, guards, assets, agent and mirrors | Rebuild and suite |
| Lane C | Baselines | Playbook leaves, reference docs, report, dated record notes, fan-out step and contract | Rebuild and suite |
| Close | Lanes A, B and C | After census, regenerated descriptions, continuity, release records, reviews and the commit | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Before census and suite baselines** - 50 minutes - CRITICAL
2. **Lane A** - 2.5 hours - CRITICAL
3. **Rebuild and full suites** - 50 minutes - CRITICAL
4. **After census** - 40 minutes - CRITICAL
5. **Closing reviews, cli-devin then cli-codex** - 45 minutes - CRITICAL

**Total Critical Path**: about 5.5 hours

**Parallel Opportunities**:
- Lanes B and C run beside lane A.
- The per-rule census runs beside each lane A change and takes about two minutes.
- The release records and the dated notes are written while the after census runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines recorded | `cat scratch/baseline/b-before-*.tsv \| wc -l` prints 4719 and the ledger has 63 rows | Setup |
| M2 | Fixes landed | Every lane test passes and both guards print their OK line | Implementation |
| M3 | Phase closed | The censuses match, both suites pass, recursive strict prints `RESULT: PASSED` and both reviews report no P0 or P1 | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Required anchors come from the template, not from `sectionGates`

**Status**: Accepted

**Context**: The review proposed a required-anchor rule fed by `levels.<N>.sectionGates` in `templates/spec-kit-docs.json`. At Level 3 those rows name anchors the core templates never emit: `nfr`, `edge-cases`, `complexity`, `risk-matrix` and `user-stories` for `spec.md`, `ai-execution`, `architecture-overview` and `risk-mitigation` for `plan.md`, `architecture-tasks` for `tasks.md` and `architecture-summary` for `implementation-summary.md`. A check fed by those rows would fail every fresh Level 3 scaffold, this phase's own docs included.

**Decision**: For a doc stamped v2.3 or later, ANCHORS_VALID reports each anchor that the doc's rendered template requires and the doc lacks. An anchor is required when its section's H2 header has no `L2:`, `L3:`, `L3+:` or `FIX ADDENDUM:` prefix. That is the rule `loadTemplateContract` in `template-structure.js` already applies, and the drift guard relies on it for the examples.

**Consequences**:
- The check accepts exactly what `create.sh` scaffolds and what the drift guard accepts in the examples.
- The orchestrator holds a TypeScript twin of one header regex. A parity test pins its required set to `template-structure.js` for every level and core doc.

**Alternatives Rejected**:
- `sectionGates`: it fails fresh scaffolds, as above.
- A new `requiredAnchors` list in `spec-kit-docs.json`: it adds a second list that must be kept in step with the templates by hand.

### ADR-002: Every changed gate binds only docs stamped v2.3 or later

**Status**: Accepted

**Context**: The P2 ledgers name existing packets whose verdict a wider change would flip. Adding `spec.md` to the scaffold check fails four Complete packets, a title check in the orchestrator flags 14 docs, and reading every Status row changes any doc with two of them. The parent's decision D2 and this phase's decision D1 already set the v2.3 boundary for new gates.

**Decision**: The all-matches placeholder scan, the code-span and fence rules, the title check, the `spec.md` scaffold check, the all-Status-rows read and the required-anchor check run only for docs carrying a v2.3 or later stamp, the test `carriesTokenGateStamp` already makes. A v2.2 doc keeps today's code path line for line.

**Consequences**:
- No v2.2 packet changes verdict, which the after census proves.
- A v2.2 packet keeps the old blind spots until it is upgraded. The phase records that limitation.

**Alternatives Rejected**:
- Applying the fixes to every doc: at least four existing verdicts would change, against REQ-005.

### ADR-003: The post-edit scan uses the strict gate's marker set

**Status**: Accepted

**Context**: `spec/check-placeholders.sh` misses `[YOUR_VALUE_HERE: ...]` because its pattern allows no colon, and it reports 55 hits on packet 054, which passes strict validation. The hook shows its exit 1 as a warning on every spec-doc edit.

**Decision**: Rebuild its matching on the four markers PLACEHOLDER_FILLED flags (`<YOUR_VALUE_HERE:`, `[YOUR_VALUE_HERE:`, `[NEEDS_CLARIFICATION:` and `[NEEDS CLARIFICATION:`), with the v2.3 code-span, fence and all-matches rules, and keep its exit codes and `--json` fields.

**Consequences**:
- The hook warns on what strict validation flags in a v2.3 doc.
- It no longer flags bracketed prose such as `[Owner name]`, which strict validation never flagged either.

**Alternatives Rejected**:
- Calling the compiled orchestrator from the hook: every edit would then depend on a fresh build.

### ADR-004: Three Opus lanes, routed by what each file is

**Status**: Accepted

**Context**: The implement workflow's `component_creation_routing` forbids `@code` for skill, agent, command and template authoring under `.skilled/`. The operator asked for Opus agents at medium or high effort.

**Decision**: Three `opus-high` leaf agents. Lane A follows sk-code for scripts, TypeScript and tests. Lanes B and C follow sk-doc and system-spec-kit as direct authoring, and lane B follows sk-code for the two guard scripts. No lane is routed to `@code`. The conductor keeps the parent `goal.md`, the release records, the continuity saves, the censuses, the reviews and the commits.

**Consequences**:
- One owner per file, three lanes in parallel.
- Three agents' token cost. The operator asked for that trade.

**Alternatives Rejected**:
- One sequential agent: about three times the wall clock for the same work.

### ADR-005: A closed phase's record is corrected by a dated note

**Status**: Accepted

**Context**: Ledger C confirms record defects in phases 005, 006, 008 and 009, plus generated files and continuity blocks that went stale.

**Decision**: Add a dated correction note beside each original record. Regenerate a generated file with its generator. Refresh continuity frontmatter through the continuity writer. Phase 009's deliberately unticked CHK-031 stays as recorded.

**Consequences**:
- History stays auditable, and a reader sees both the original and its correction.
- The parent's derived status stays in progress while phase 009's CHK-031 is open. The handback names it.

**Alternatives Rejected**:
- Rewriting the closed records: that erases what each phase recorded about its own run.

### ADR-006: Text a model reads grows only as far as its finding needs

**Status**: Accepted

**Context**: On 2026-10-25 the operator asked that spec authoring stay fast as well as correct, ideally faster and better than before packet 054. Packet 054 grew the four core templates from 4,681 to 7,255 words and added a 1,246-word card. Phase 009 timed DeepSeek runs at a 252-second mean before 054 and 194 to 233 seconds after, under unequal load.

**Decision**: Every edit to text a model reads while authoring takes the smallest form that closes its finding. The card grows by at most 80 words net and each core template by at most 60, against `scratch/baseline/words-before.txt`. The plan and implement assets name the card in one conditional line at their doc-writing step, not as a new reading step. Every new validator error names the file, the missing item and what to restore, so one pass fixes it.

**Consequences**:
- This phase adds no measurable reading load beyond its findings.
- A net speed gain over the pre-054 tree needs a like-for-like benchmark of tokens and seconds, which this phase does not run. The handback proposes it as a follow-up.

**Alternatives Rejected**:
- Trimming the templates and the card in this phase: a separate change that needs its own measurement, outside this phase's frozen scope.
