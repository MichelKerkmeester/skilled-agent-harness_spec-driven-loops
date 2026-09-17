---
title: "Feature Specification: Phase 9: reference-rewrite"
description: "Once the tree sits under .skilled, 2,963 tracked files still name it by its old path. Most of them keep resolving by accident through whatever .opencode keeps. This phase rewrites the mechanical references in reviewable batches and gives every decision row an owner, while frozen records and generated files stay untouched."
trigger_phrases:
  - "skilled reference rewrite"
  - "opencode path reference rewrite"
  - "reference rewrite batch plan"
  - "freeze exclusion globs"
  - "reference rewrite rescan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: reference-rewrite

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 11 |
| **Predecessor** | 008-links-and-generated-state |
| **Successor** | 010-machine-and-consumer-cutover |
| **Handoff Criteria** | A rescan of tracked files outside `specs/` finds no `.opencode` occurrence the design did not keep. Every frozen record is byte-identical to the phase base commit. Every manual row has an owner and a disposition (`../spec.md:148`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the skilled source-root migration (`../spec.md`). It runs after the tree has moved (007) and its links and generated state have been rebuilt (008). Phase 010 then cuts over this machine and consumer projects.

**Scope Boundary**: Text references inside tracked files outside `specs/`. That covers the mechanical rows of map C, the authored runtime files of map B and the manual rows no other phase owns. Symlinks, generated output, home-level configuration and frozen records are outside it.

**Dependencies**:
- Phase 004's frozen layout: which top-level entries moved, what `.opencode/` keeps and what `.opencode/specs` becomes. The rule has open cells without all three. ADR-001 (layout) and ADR-003 (keep-list) exist in `../004-migration-design/decision-record.md`, both still Proposed (lines 45 and 257).
- Phases 005 and 006 validated: hooks, CI, root discovery, launchers and installers accept both roots, so no gate still keyed on `.opencode` rejects a content commit.
- Phases 007 and 008 validated: every map path exists at its `.skilled` location, every link resolves and every generator check passes on the phase base commit.

**Deliverables**:
- 62 batch commits of content edits (22 code, 2 mixed, 38 documentation), each with a manifest, a report and a suite record.
- Dispositions for the 39 manual rows this phase keeps, plus confirmation that the 59 routed rows sit with 005, 006 or 010.
- Three phase scripts in `scratch/`: `build-batch-manifests.py`, `rewrite-batch.py` and `rescan-references.py`.
- A final rescan with zero unclassified occurrences.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 007 moves the authored tree, 2,963 tracked files still name it by its old path: 2,938 mechanical rows in map C carrying 15,648 matching lines plus 27 authored runtime files in map B. Most of those references will keep resolving through whatever `.opencode/` phase 004 keeps. That is the trap. A path that works by accident stays invisible until the compatibility layer shrinks, while 2,326 fenced markdown lines that readers run and path constants such as `path.join(REPO_ROOT, '.opencode', 'skills')` keep pointing at a directory that is no longer the source.

A blind substring replace fails too. 968 rows are records of runs at the old path. 78 occurrences are identifiers or names that only contain the token (`tool.opencode_goal`, `.opencode-backup-*`, `~/.opencode/state`). Five rows are generator output the map did not attribute to a generator.

### Purpose
Every mechanical reference names `.skilled`, every frozen record stays byte-identical and every decision row has an owner with a recorded disposition. A rescan proves nothing else remains.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Rewrite set, 2,963 files and 14,956 matching lines.** 2,936 of map C's 2,938 mechanical rows, plus all 27 mechanical rows of map B: the `.claude/agents` fork, six hook and extension READMEs, five MCP registrations, two Cursor commands and the Hermes repo-guards plugin.
- **Occurrence-level rule.** 14,905 automatic occurrences rewritten, 790 `.opencode/specs` occurrences applied as 004 decides, 646 decided line by line and 78 left alone by rule (counts over the pre-move tree at `728c4f3efc`).
- **39 manual rows.** `AGENTS.md`, four git-hook READMEs, three spec-root documents, 27 recorded fixtures rewritten together with the assertion that reads them, plus four captured-once retrieval records whose disposition is decided and logged.
- **Generator re-runs.** Each generator whose input a batch changed runs by its own command. Its output lands in that batch's commit.
- **Final rescan** of tracked files outside `specs/`.

### Out of Scope
- 968 freeze rows, meaning per-skill `changelog/**`, `benchmark/reports/**` with their dated run directories and the grader's scorer cache - historical records stay frozen under parent D4 (`../goal.md:49`).
- 35 manual rows owned by 005 - the 19 CI workflows, 12 git-hook contract files and 4 gates change with the hook and CI contract.
- 18 manual rows owned by 006 - 11 root-discovery files, 4 launchers and installers, `check-no-spec-imports.cjs` with its negative fixture and `opencode.json` define what `.opencode` means.
- 3 manual rows owned by 010 - `PUBLIC-RELEASE.md` with its `.opencode-local/` consumer convention, the launchd plist and the plist's README describe decisions 010 makes after this phase.
- Generated files - map C's 25 regenerate rows and map B's 198 belong to their generators and to 008.
- Five rows reclassified from the map as generator output - `generate-trigger-index.mjs:65-67` writes `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. `test_readme_verdict_parity.py` rebuilds `baseline-readme-verdicts.json` with `--write` (docstring, lines 4-6). `derive-command-bridges.cjs:15` writes `command-bridges.generated.json`.
- Symlinks from map A - phase 008 retargets them.
- Home-level configuration - phase 010.
- `specs/**` - outside the map's inventory, whose seed pathspec excludes it (`002-per-runtime-reference-map/scratch/build-seed-inventory.py:106,110`).

### Files to Change

Paths assume 004 moves the parent's in-scope entries (`../spec.md:80`). T008 recomputes every count against 004's frozen list.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/**` | Modify | 2,660 files across 13 skills and the skills index |
| `.skilled/commands/**` | Modify | 142 files: command documents, YAML assets, presentation text and scripts |
| `.skilled/hooks/**`, `.skilled/plugins/**`, `.skilled/bin/**`, `.skilled/scripts/**` | Modify | 112 files of hook, plugin, launcher and script code with their READMEs |
| `.skilled/agents/**` with `.claude/agents/**` | Modify | 26 files in one batch, so the agent mirror gate never sees the pair apart |
| `.skilled/install-guides/**` | Modify | 2 files |
| Root `README.md`, `CONTRIBUTING.md`, `.gitignore`, `.utcp_config.json`, `.env.example` | Modify | 5 files. `.gitignore` alone carries 62 matching lines |
| `.github/dependabot.yml`, `.github/workflows/README.md` | Modify | 2 files. The 19 workflow files are 005's |
| Authored files under `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.hermes/`, `.pi/` | Modify | 14 files: hook and extension READMEs, MCP registrations, two Cursor commands and the Hermes plugin |
| `AGENTS.md`, git-hook READMEs, spec-root documents, recorded fixtures | Modify or freeze | 39 manual rows, each with a recorded disposition |
| Generator outputs named in `plan.md` | Regenerate | Re-run by the owning command after the batch that feeds it |
| `scratch/build-batch-manifests.py`, `scratch/rewrite-batch.py`, `scratch/rescan-references.py` | Create | Phase tooling, kept as reproducibility evidence the way phase 002 kept its scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every automatic occurrence in the rewrite set names `.skilled`, every `.opencode/specs` occurrence matches 004's decision and the never-class count stays at its baseline |
| REQ-002 | No freeze row changes: all 968 freeze paths are byte-identical to the phase base commit |
| REQ-003 | Each batch diff equals its manifest: no file outside it, every file with an automatic occurrence changed, added lines equal removed lines per file and no rename |
| REQ-004 | Each batch's suite passes, with output and exit status read, before the next batch starts |
| REQ-005 | The final rescan of tracked files outside `specs/` reports zero unclassified `.opencode` occurrences |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | All 98 manual rows have an owner: the 39 kept here carry a disposition with evidence and the 59 routed rows are confirmed in 005, 006 or 010 |
| REQ-007 | No generated file is text-edited. Every generator fed by a batch runs by its own command and its check passes |
| REQ-008 | The phase scripts, the 19 contract-adjacent batches and the rescan count each get a second-family review with no open P0 or P1 finding |
| REQ-009 | Content commits stay separate from 007's rename commits and never include a containment snapshot or lineage scratch |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rescan-references.py` reports `unclassified=0` over tracked files outside `specs/`. An independent GPT-5.6 recount agrees.
- **SC-002**: Every batch commit (62 as planned or the count T008 recomputes) carries a green suite record and a verified manifest diff.
- **SC-003**: The 968 freeze paths show no change between the phase base commit and the phase tip.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004's moved list, keep-list and `.opencode/specs` target | High: the rule has open cells without them | T002 reads them before any manifest exists and halts on a gap |
| Dependency | 005 and 006 validated | High: a pre-commit hook still keyed on `.opencode` rejects content commits | Entry check at T001 |
| Dependency | 007 and 008 validated | High: map paths do not translate or generator drift predates the first batch | T001 runs every generator check before B01 |
| Risk | A producer and the test asserting its emitted path land in different batches | High: the suite goes red between them | Code batches keep import clusters whole. 342 relative-import edges sit inside the rewrite set. The 13 that cross areas are sequenced |
| Risk | The map names no writer for some generated files | Medium: a hand edit gets overwritten or fails a parity check | Five confirmed. T006 checks the 11 generated-looking data files among the mechanical rows |
| Risk | A substring replace breaks identifiers and names | High: runtime tool names and consumer conventions change | Token-bounded rule, with the 78 never-class occurrences counted before and after |
| Risk | 004's draft keep-list names lines inside the rewrite set, three of them R1 path forms (K6) and one inside B01 (K8, `.gitignore:7-10`) | High: the rule rewrites a reference the design keeps | Keep-list lines are set aside as class K before any other class applies (`plan.md` Rewrite Rule) |
| Risk | The `.gitignore` rewrite changes what git tracks | High | B01 runs first, gets a second-family review and a tracked-and-ignored probe |
| Risk | `regenerate-skill-derived.cjs` prunes path fields that do not resolve instead of rewriting them (lines 9-16) | Medium: skill routing metadata loses entries | Run its default dry run first and write only when it proposes no pruning |
| Risk | Fan-out containment reverts writes outside a lineage and fails the run. Its snapshot directories nest untracked | Medium | Direct dispatch per batch, explicit manifest paths staged, never `git add -A` |
| Risk | The executor adds a comment naming a spec path or task id | Low | Briefs forbid new comments. The pre-commit comment-hygiene checker scans code comments (`system-spec-kit/runtime/cli/rules/check-comment-hygiene.sh:12-13`) |
| Risk | The LLM Gateway refuses DeepSeek mid-queue | Medium: batches stall | Pause the queue and report. A different executor needs an amendment to parent D3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A brief carries only the child preamble, the rule, the manifest, the suite command and the generator commands, so one batch fits one short executor turn.
- **NFR-P02**: Suites run per area group after each batch. The full cross-area suite set runs once, at T042.

### Security
- **NFR-S01**: Write authority is the manifest plus one report path. Any other changed path fails the batch and is reverted.
- **NFR-S02**: No brief, report or review prompt copies content from home-level configuration, the rule phase 002 ran under (`002-per-runtime-reference-map/scratch/topic.txt:63-65`).

### Reliability
- **NFR-R01**: Each batch lands as one commit, reversible with one `git revert`.
- **NFR-R02**: `rewrite-batch.py` is idempotent: a second run over a rewritten batch changes nothing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a manifest file with no automatic occurrence left, because 005 or 006 already rewrote it, is dropped from its batch and logged as handled upstream.
- Maximum length: an import cluster or a single file above the cap stays whole as one batch. B03 holds an 83-file advisor cluster and B21 a single 796-line manifest.
- Invalid format: a translated `.skilled` path that is not a tracked regular file stops that row. The orchestrator resolves it before the batch runs.

### Error Scenarios
- External service failure: a gateway error pauses the queue with the batch unstarted or reset.
- Network timeout: the same brief is retried once, then the repair count of parent D2 applies.
- Concurrent access: a manifest file that changed after the batch base SHA fails the dry run. The manifest is then rebuilt from the current tree.

### State Transitions
- Partial completion: a red suite after the script ran resets the batch with `git checkout -- <manifest paths>`. The batch then reruns from its brief.
- Session expiry: manifests, reports and base SHAs in `scratch/` let the next session resume at the first batch without a commit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | 2,963 files and 14,956 matching lines in 29 area groups: 13 skills, the dot-directory trees, six runtime directories, root and CI |
| Risk | 17/25 | Path constants, test assertions, generator inputs and `.gitignore`. Every batch reverts with one commit |
| Research | 8/20 | The map exists. 004's decisions, the writer check and the fixture assertions remain open |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does ADR-001 resolve to L1 (`.opencode` becomes one link and every entry moves) or to L2 (opencode's install files can stay), per `../004-migration-design/decision-record.md:70,82-83`? And what does `.opencode/specs` become beyond the link K5 keeps? The answers settle the moved list, 790 specs occurrences and the 48 review occurrences naming `logs`.
- Do the four captured-once retrieval records freeze? `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:76-78` files them under frozen acceptance evidence with no runtime reader, so this plan proposes freeze.
- Do the tests beside the 27 recorded fixtures assert absolute paths or path fragments (`002-per-runtime-reference-map/research/research.md:174`)? The answer sets how each fixture is rewritten.
- Settled 2026-09-16 by the orchestrator: `specs/**` is historical record under parent D4 and stays frozen, so the parent's residue criterion excludes it. Generated spec metadata is phase 008's to regenerate, not this phase's to rewrite.
- Can `reference_checker.py` take a root-prefix semantic map at this scale? Its companion executor refuses to apply outside disposable repositories (`.opencode/skills/sk-doc/shared/scripts/reference_rewrite_executor.py:17-18`), so it can only serve as a second lens. T009 tries it on one batch.
- Which GPT-5.6 variant runs the reviews? `cli-codex/SKILL.md:225-227` lists luna, terra and sol. UNKNOWN until the first review dispatch.
<!-- /ANCHOR:questions -->

---
