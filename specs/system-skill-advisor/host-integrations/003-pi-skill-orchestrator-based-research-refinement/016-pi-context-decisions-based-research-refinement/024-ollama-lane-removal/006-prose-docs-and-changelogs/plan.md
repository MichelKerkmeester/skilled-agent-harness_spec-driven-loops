---
title: "Implementation Plan: Phase 6: prose-docs-and-changelogs"
description: "Rewrite 53 docs, identity files and assets and all 23 released changelog entries with one glossary, rename the three five-lane files, delete two catalog leaves, regenerate the advisor leaf manifest, leaf aliases and skill-graph export in the same commit, and write system-skill-advisor v2.0.0.0 for the removal. The proof is the residue check listing only the 20 named 007 and 008 paths while every docs gate and routing ratchet prints its start-commit result."
trigger_phrases:
  - "prose docs and changelogs plan"
  - "changelog rewrite glossary"
  - "lane fusion rename plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: prose-docs-and-changelogs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill identity docs, catalog and playbook leaves, references, changelogs), JSON (`graph-metadata.json`, the leaf manifest and aliases, the skill-graph export), YAML and text (three `/create:command` assets), the root `.env.example`, one TypeScript stress test (a rename and two strings) |
| **Framework** | The sk-doc feature catalog and playbook packages, the `sk-create-changelog` workflow, the advisor skill-graph compiler, the sk-doc leaf manifest generator, the repository pre-commit hook (doc version raise, skill-authoring gate, mirror gate) |
| **Storage** | None. No database, schema or runtime file changes |
| **Testing** | The residue check; the link check; leaf manifest and root metadata checks; the frontmatter guard; the doc version gate and bump check; the catalog, playbook and changelog validators; the mirror check; skill-graph freshness; the four routing ratchets; advisor typecheck, test and stress; `env-reference-drift`; doctor `run-all.sh`; sk-doc `run-script-tests.sh` |

### Overview
The residue check's `--json` live list is the inventory: each of the 79 paths section 3 of `spec.md` classes 006 is rewritten, renamed or deleted, and the paths it classes 007 or allowlist rows are left unedited, the latter covered by REQ-014's rows. Docs get the four-lane wording that phase 004's code already has; changelogs get the fixed glossary in ADR-001, which swaps a term and keeps every version, date, number and fact. The phase is done when the check lists exactly the 20 named paths and every gate in section 2 prints what it printed at the start commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `sweep-lane-residue.mjs repo --json` lists as live exactly the 20 paths on `spec.md`'s 007 and 008 lists; `git ls-files | grep -c five-lane` prints 0; the link check prints `0 broken`; `generate-leaf-manifest.cjs --check` prints `OK` for the advisor and spec-kit; `ci-skill-root-metadata.cjs` prints `failed=0`; the frontmatter guard prints `violations=0`; `frontmatter-version.mjs gate` exits 0 and `bump --check --base "$S"` exits 0; the catalog and playbook validators print `PASS` with 0 violations; the mirror check prints `PASS`; `skill-graph-freshness.cjs --strict` exits 0; the four ratchets print their start-commit counts; advisor `npm run typecheck`, `npm test` and the stress suite print their start-commit counts; `env-reference-drift.vitest.ts`, `run-all.sh` and `run-script-tests.sh` pass; `generate-trigger-index.mjs --check` still exits 1, for phase 007
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory-driven prose sweep: the residue check names each file, one glossary decides each change, and generators rebuild what the sources feed.

### Key Components
- **Residue check** (`K/runtime/cli/retrieval/sweep-lane-residue.mjs`): owns the vocabulary and the exit code. Its `IDENTIFIER_PATTERN` and `PROSE_PATTERN` exports are what every rewrite is tested against. It and its allowlist stay unchanged here.
- **Advisor routing sources** (`A/graph-metadata.json`, `A/ROUTER.md`): four `intent_signals` phrases and one router keyword name the lane. They feed `A/runtime/scripts/skill-graph.json` and the router's intent model, so they change with a regeneration and the ratchets.
- **Advisor docs** (identity files, 22 catalog leaves and the index, 13 playbook entries and the index, 6 references, the stress README): the bulk of the prose. Renames and deletions here drive the leaf manifest and aliases.
- **Shared docs** (`.env.example`, `K/runtime/ENV-REFERENCE.md`, `K/references/config/environment-variables.md`, `K/ARCHITECTURE.md`, the root README, three spec-kit catalog and playbook entries, three sk-code examples, three command assets): name settings and packages phase 005 deletes.
- **Changelogs** (23 entries in five folders, plus the new one): history, edited only by ADR-001's rules and the `sk-create-changelog` workflow.

### Data Flow
The `--json` live list from T001 is the input. Each path's class decides its action. Source edits feed two generators run in this phase: `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` rewrites the leaf manifest and aliases from the doc tree, and `skill_graph_compiler.py --export-json` rewrites `skill-graph.json` from every `graph-metadata.json`. The commit's pre-commit hook raises the frontmatter `version` of each staged skill doc outside `changelog/`, checks the leaf manifest and checks mirror parity. The residue check then reruns on the final tree and must list only the 007 and 008 paths. The trigger index, its three fixtures and the scorer baseline are read by nothing this phase runs, and phase 007 regenerates them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `A/README.md`, `A/ARCHITECTURE.md`, `A/SKILL.md` | Describe five lanes, the semantic health block and the refresh | Update (006); `SKILL.md` version to `2.0.0.0` | Residue check; frontmatter guard; mirror check |
| `A/ROUTER.md` keyword "five-lane", `A/graph-metadata.json` four `intent_signals` | Routing inputs | Update (006) | Four ratchets and the routing corpus print start-commit results |
| `A/runtime/scripts/skill-graph.json` | Compiled routing input that CI compares with every `graph-metadata.json` | Regenerate (006, ADR-005) | `skill-graph-freshness.cjs --strict` exit 0, no signal drift |
| `A/leaf-manifest.json`, `A/leaf-aliases.json` | Leaf index the pre-commit gate checks | Regenerate (006, ADR-005) | `generate-leaf-manifest.cjs --check` prints `OK` |
| Advisor catalog (22 leaves and the index) | Feature inventory | Update; rename one; delete two (ADR-002) | Catalog validator `PASS`, 47 features |
| Advisor playbooks (13 entries and the index) | Manual scenarios with expected output | Update; rename one | Playbook validator `PASS` |
| Advisor references (six files) | Scorer, tuning, freshness, lease and path policy | Update | Residue check; link check |
| `A/runtime/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts` and the stress README | Stress coverage of fusion | Rename, two strings; README rows | Stress suite counts; config glob still matches |
| `.env.example`, `ENV-REFERENCE.md`, `environment-variables.md` | Document settings | Update; delete rows with no reader (ADR-008) | `env-reference-drift.vitest.ts` passes |
| Spec-kit ARCHITECTURE, core and shared READMEs, catalog index, sweeper leaf, two playbooks | Name the deleted package, server and database setting | Update | Residue check; REQ-009 grep |
| sk-code TypeScript examples (three files) | Cite `IEmbeddingProvider`, `IVectorStore` and `EmbeddingProfile` | Update | REQ-009 grep |
| `/create:command` assets (three files) | Tell authors a new command is embedded | Update | Residue check; both YAML files parse with the spec-kit `js-yaml` (T036) |
| 23 changelog entries | Release history | Update (ADR-001, ADR-004) | Pattern grep 0 per file; three validators no worse |
| `A/changelog/v2.0.0.0.md` | Does not exist | Create (ADR-003) | Pattern grep 0; three validators exit 0 |
| Trigger index and three retrieval fixtures | Generated from specs and skill docs | Unchanged (007) | `--check` stays exit 1; new stale entries are only this phase's docs |
| `A/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Frozen score baseline | Unchanged (007) | `git diff` empty for the file |
| The 14 allowlist-row paths and `lane-residue-allowlist.json` | Refusal tests, frozen fixtures, non-lane matches, rows | Paths unchanged; the allowlist gains the REQ-014 rows (conductor decision, superseding ADR-007's routing to 008) | `git diff --name-only` lists the allowlist and none of the 14 paths |
| Published GitHub releases and tags | Public release bodies | Not a consumer here; operator after merge (ADR-006) | `git ls-remote --tags origin` unchanged |
| 21 spec docs that link to the moved files | Packet history | Not a consumer; `specs/` is not link-checked | Unchanged by parent decision D1 |

Required inventories:
- Same-class producers: `node K/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` at the start commit, classified by `spec.md` section 3.
- Consumers of changed names: `git grep -n -E 'five-lane-fusion|background-vector-refresh|command-meaning-matching' -- ':!specs'`, and the `#c-` anchors renamed in each changelog.
- Matrix axes: file kind (identity, catalog, playbook, reference, env, asset, changelog, generated) by class (006, 006-regen, 006 then 008, 007, 008).
- Invariant: a doc names only settings, files, flags and routes that exist after phase 005; a changelog keeps every version, date, number and fact it had. Adversarial cases: a matched term inside a fenced example, a table cell, an anchor id, a frontmatter trigger phrase, a cited spec path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: confirm phase 005 is committed, record the start commit `S`, rerun the residue check and halt if a 005-list path or a path on no list is live, and baseline every gate in section 2.
- **Implementation**: renames and deletions first, then the advisor docs and routing sources, then the shared docs, then the 23 changelog entries, then the new entry through `sk-create-changelog`, then both generators.
- **Verification**: rerun every gate from the final tree, the residue check, the REQ-009 grep and the boundary diff, then validate the packet.

The ordered work and each task's verify command are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each rewritten file against the exported patterns (0 lines); each changelog through `check_changelog_shape.py`, `validate_document.py` and `hvr_scan.py`; the renamed stress file alone | `node` with the check's exported patterns, the three sk-create-changelog validators, `npx vitest run` |
| Integration | The residue check in repo mode; link, leaf manifest, root metadata, frontmatter, doc version, catalog, playbook and mirror checks; skill-graph freshness; the four ratchets and the routing corpus scorer; advisor typecheck, test and stress; `env-reference-drift`; `run-all.sh`; `run-script-tests.sh` | The repository's own check scripts, Vitest, Python 3 |
| Manual | Read each changelog diff and confirm only matched lines, renamed anchors and pointed upgrade steps changed; read the new entry's opening and upgrade steps | `git diff --word-diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 committed | Internal | Yellow | 73 code paths stay live and several docs would describe files that still exist; 005 is being built now |
| Phase 001 gate baselines and phase 004's recorded advisor test counts | Internal | Green | REQ-007 and REQ-008 compare with T003's rerun at `S`, so the older numbers only cross-check |
| The conductor's answer to open question 1 | Internal | Yellow | Goal criterion 1 reads Unmet as worded; this plan measures REQ-001 against the two lists either way |
| `sk-create-changelog` workflow and validators | Internal | Green | The new entry cannot be checked against the contract |
| The operator, after merge, for release bodies | External | Yellow | Published release pages keep the old wording until edited (ADR-006) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a ratchet, the routing corpus result or a score baseline moves, which is a halt and never a recapture; any other gate stays red after three fix rounds; or a changelog diff changes a fact.
- **Procedure**: before the commit, `git restore --staged --worktree` over the changed paths and `git restore` the three renamed and two deleted files from `S` put back every tracked file; no generator writes outside the tree. After the commit, revert the one phase commit. No tag, release, database or runtime file is touched, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (start commit, residue rerun, gate baselines) | Phase 005 committed | Implementation |
| Implementation (renames, deletions, docs, routing sources, changelogs, new entry, generators) | Setup | Verification |
| Verification (every gate, residue check, greps, boundary diff, validate) | Implementation | Phase 007 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Setup: S,    │────►│ Renames, deletes │────►│ Leaf manifest    │
│ residue, gate│     │ and referrers    │     │ and aliases regen│
│ baselines    │     └──────────────────┘     └────────┬─────────┘
└──────┬───────┘                                       │
       │             ┌──────────────────┐     ┌────────▼─────────┐
       ├────────────►│ Routing sources  │────►│ skill-graph.json │
       │             └──────────────────┘     │ regen            │
       │                                      └────────┬─────────┘
       │             ┌──────────────────┐              │
       ├────────────►│ Docs and env     │──────────────┤
       │             └──────────────────┘              │
       │             ┌──────────────────┐     ┌────────▼─────────┐
       └────────────►│ 23 changelogs,   │────►│ Verification     │
                     │ new entry        │     │                  │
                     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 005 commit | `S`, the 99-path list, gate baselines | Everything |
| Renames and deletes | Setup | Three renamed and two deleted files, updated referrers | Leaf regeneration |
| Routing sources | Setup | Four fewer `intent_signals`, one fewer router keyword | Skill-graph regeneration, ratchets |
| Docs and env | Setup, renames | Rewritten advisor, spec-kit, sk-code and asset prose | Verification |
| Changelogs and new entry | Setup | 23 rewritten entries, `A/changelog/v2.0.0.0.md`, `SKILL.md` version | Verification |
| Generators | Renames, routing sources | Leaf manifest, leaf aliases, `skill-graph.json` | Verification |
| Verification | All of the above | Gate output, the 20-path residue list | Phase 007 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup and baselines** - about 30 minutes, most of it the advisor test and stress suites - CRITICAL
2. **Advisor docs, renames and the 23 changelogs** - about 4 hours of reading and rewriting - CRITICAL
3. **Generators and the full gate rerun** - about 40 minutes - CRITICAL

**Total Critical Path**: about 5 hours and 10 minutes, one agent.

**Parallel Opportunities**:
- The shared docs and the changelog rewrites touch no common file and can run in either order after Setup
- The catalog, playbook and changelog validators can run while the advisor test suite runs
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | T001 shows no 005-list path live and every live path on a `spec.md` 006, 007 or 008 list (99 projected), and T002 and T003 record every baseline | Setup |
| M2 | Prose clean | The residue check lists only the 20 named paths and `git ls-files \| grep -c five-lane` prints 0 | Implementation |
| M3 | Gates green | Every section 2 gate prints its start-commit result, and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Rewrite all 23 changelog entries with one glossary; keep every fact

**Status**: Accepted

**Context**: Decision Q002 rewrites all 23 entries rather than allowlisting history. Nine are framework entries (eight tagged, `v4.2.0.0` open) and 14 are component entries. Each changed line must stay true for the release it describes, and an upgrade step that tells a reader to set a removed weight or run a removed route now fails.

**Decision**: Three cases.
- (a) A mention that is not the advisor lane (the memory engine's embedder in `v4.0.0.0` 130 and the spec-kit entries, `sqlite-vec` in `v3.1.2.0`, the embedding model in `v3.5.0.0`, Ollama as an example provider in sk-doc `v1.6.0.0`, the transport in `v4.0.0.0` 1002): swap the term for the glossary word that keeps the fact.
- (b) A lane line in a released entry: keep the version, date, numbers and facts, and swap the term. Rename an anchor that holds a term together with every in-file link to it (`c-ollama-off-the-advisor-prompt-path` in `v4.1.0.0`, `c-how-a-meaning-match-passes` and `c-no-embedder-no-change` in advisor `v1.0.0.0`); no file outside the entry links to them. An upgrade step that now fails becomes one line that names its subject, for example "The embedding provider setting was removed in system-skill-advisor v2.0.0.0." or "Paraphrase matching was removed in system-skill-advisor v2.0.0.0." Frontmatter titles, descriptions and trigger phrases follow the same glossary, for example advisor `v1.2.0.0`'s title becomes "system-skill-advisor v1.2.0.0, the embedding lane off the prompt path".
- (c) The open `v4.2.0.0` entry: ADR-004.

The glossary, each word tested clean against the exported patterns:

| Term in the entry | Replacement |
|-------------------|-------------|
| Ollama, as the lane's or the memory engine's server | the local model server |
| Ollama, as an example provider | a local model runtime |
| semantic lane, `semantic_shadow` | the embedding lane |
| meaning match, command meaning matching | paraphrase match, command paraphrase matching |
| vector refresh, vector coverage | embedding refresh, embedding coverage |
| five-lane, 5-lane, five lanes | lane fusion, the scorer's lanes (no count) |
| embedder | embedding provider |
| nomic-embed, the model id | the embedding model |
| `sqlite-vec` | the SQLite vector extension |
| `@huggingface/transformers` | the transformers package |
| `hf-model-server`, `hf-local` | the local model server, the local model runtime |
| `HF_EMBED_*`, `*EMBED_REFRESH`, `EMBEDDINGS_PROVIDER` | the embedding settings, or the removal pointer in an upgrade step |
| `semanticHealth`, `embeddingText` | the status tool's embedding health block, the command embedding text |
| `shared/embeddings` | the shared embeddings package |

**Consequences**:
- History stays true and searchable by version, date and number; no entry is deleted or renamed.
- A reader searching an entry for "Ollama" finds nothing. The residue check, its allowlist and its test stay the one place the vocabulary lives (research 5.5).
- Seven entries already fail `check_changelog_shape.py`. The bar is no new failure, so this phase does not repair their shape.

**Alternatives Rejected**:
- Allowlist the 23 entries: decision Q002 rejected it, and 23 rows would hide any later lane line in them.
- Delete or rewrite whole sections: removes true history and widens the drift from published release bodies.

---

### ADR-002: Rename to `lane-fusion` names and delete the two lane-only leaves

**Status**: Accepted

**Context**: Goal decision D1 renames the three five-lane files without a lane count. Goal decision D2 deletes the eleven lane-only docs with their router and leaf rows; nine are deleted by earlier phases or by 005, and two catalog leaves remain.

**Decision**: `git mv` `A/feature-catalog/scorer-fusion/five-lane-fusion.md` to `lane-fusion.md` ("Analytical Lane Fusion"), `A/manual-testing-playbook/scorer-fusion/five-lane-fusion.md` to `lane-fusion.md` ("SC-001 Analytical Lane Fusion") and `A/runtime/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts` to `lane-fusion-stress.vitest.ts`, then update the referrers. Of the 25 files outside `specs/` that name `five-lane-fusion`, 21 are edited, renamed or deleted here, the leaf manifest and aliases are regenerated here, and the trigger index and corpus manifest are phase 007's. `git rm` `daemon-and-freshness/background-vector-refresh.md` and `scorer-fusion/command-meaning-matching.md`, drop their index rows 54 and 102, set the index counts to 47 features, 7 and 9, and remove the inbound sentences in `doctor-command-routing.md` 31 and `pasted-reply-stripping.md` 52 and 53.

**Consequences**:
- No name collides, and the stress config glob `stress-test/**/*.{vitest,test}.ts` still matches the renamed file.
- The 21 spec docs that link to the old paths keep broken links; they are history and the link check does not walk `specs/`.
- The trigger index and corpus manifest still name the old paths until phase 007.

**Alternatives Rejected**:
- `fusion.md`: loses the "lane" word that ties the leaf to the attribution and weight leaves.
- Keep the two leaves and rewrite them: each describes only the lane's refresh or paraphrase path, which phase 004 deleted.

---

### ADR-003: Word the removal entry; system-skill-advisor v2.0.0.0, expanded; no allowlist row

**Status**: Accepted

**Context**: The parent left "allowlist versus wording" to this phase. The removal breaks the status contract (the semantic health block and `lane_weight_zero` are gone), the status tool refuses its flag, the embedder route is gone and the old weights JSON key is refused. `sk-create-changelog` closes an entry with its spec-folder line, and the folder of packet `024-ollama-lane-removal`, which holds this work, matches the check.

**Decision**: Run `sk-create-changelog` with the advisor as the primary component and write `A/changelog/v2.0.0.0.md`, a major bump in the expanded format, then set `A/SKILL.md` to `version: 2.0.0.0` (its only version carrier). Every line is written from ADR-001's glossary, and the spec-folder line names `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement`, the parent `C/v4.2.0.0.md` already cites for this track. `How It Was Checked` quotes only numbers the phase's own gate runs printed. Its upgrade step names `/doctor:update apply`, which phase 008 wires and checks. `system-spec-kit` and `system-skilled-doctor` are reported as secondary candidates, not written.

**Consequences**:
- The allowlist stays the home of matches that are not the lane, and no row can hide a later lane line in the entry.
- The spec-folder line names the track folder one level above the packet `024-ollama-lane-removal` and two above this phase, so it is less precise than the packet path.

**Alternatives Rejected**:
- An exact-path allowlist row for the entry, with the child path: the fallback if the conductor wants the exact folder; a row covers the whole file.
- A minor bump: the contract reserves major for breaking changes, and four are breaking.
- Omit the spec-folder line: breaks the contract's closing rule.

---

### ADR-004: Fold the removal into the open `v4.2.0.0` framework entry

**Status**: Accepted

**Context**: `v4.2.0.0` is untagged locally and on origin. Its Skill Advisor section announces "Prompts No Longer Wait on Ollama" and a background vector refresh, both of which this packet removes. `sk-create-changelog` says to fold new work into an open entry and correct any sentence it makes untrue.

**Decision**: Rewrite the entry to describe what it will ship. The two lane H4 items and their glance rows become one item announcing that the advisor no longer has an embedding lane, with a new anchor. The opening, the description, the "advisor background vector refresh" trigger phrase, the important box and the Skill Advisor upgrade group follow. The spec-folder list already names the `016` parent and gains nothing. The title stays, since "a Lighter Advisor" still holds.

**Consequences**:
- `v4.2.0.0` reads true when it is tagged after this branch merges.
- The rewrite changes more than matched lines, so REQ-002's line rule exempts this one entry.

**Alternatives Rejected**:
- Glossary-only rewrite of `v4.2.0.0`: would announce a lane and a refresh the release does not ship. It is the fallback if the operator tags `v4.2.0.0` before this branch merges (open question 4).

---

### ADR-005: Regenerate the leaf manifest, leaf aliases and skill-graph export in this phase

**Status**: Accepted

**Context**: Phase 007 owns generated files. The pre-commit skill-authoring gate runs `generate-leaf-manifest.cjs --check` on staged skills and blocks a stale manifest, and the two deletions and three renames make the advisor's stale. The manifest holds only leaf paths per mode (keys `leaves`, `packet`, `workflowMode`) and the aliases only `workflowMode`, `leafResourceId` and `diskPath`, so frontmatter and body edits never stale them; only adding, renaming or deleting a doc does. CI's `routing-registry-drift.yml` runs `skill-graph-freshness.cjs --strict`, which fails on signal drift between `skill-graph.json` and any `graph-metadata.json`, and this phase edits `intent_signals`.

**Decision**: Run `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` and `skill_graph_compiler.py --export-json` here, after the source edits, so each commit stays green. Phase 007 keeps the trigger index, its three fixtures and `scorer-eval-baseline.json`, and runs the check modes of all generators.

**Consequences**:
- Every commit on the branch passes the hook and the freshness check.
- Phase 007's list shrinks from six to five generated paths.

**Alternatives Rejected**:
- Leave all regeneration to 007: the commit is blocked by the hook, or the freshness gate fails for one phase.
- Move the trigger index into 006 too: its `--check` is already at exit 1 at the start commit for reasons outside this packet, and 007's goal owns it.

---

### ADR-006: Published release bodies and tags wait for the operator

**Status**: Accepted

**Context**: Eight tagged framework entries change. `sk-create-changelog` section 8 says to bring a published release in step with `gh release edit` in the same run, and moving a tag needs the operator's yes. Parent decision D2 says nothing merges to `main` and nothing is pushed.

**Decision**: Run no `gh release` write and move no tag. `implementation-summary.md` lists the eight entries and, for each, `python3 D/sk-create-changelog/scripts/build_release_notes.py <entry> --out <file>` and `gh release edit <tag> --notes-file <file>` for the operator to run after merge.

**Consequences**:
- Published pages keep the old wording until the operator runs the list.
- This is a named deviation from section 8. Proposed amendment, in `D/sk-create-changelog/SKILL.md` section 8: "When the run may not push, list each release edit for the operator instead of running it."

**Alternatives Rejected**:
- Edit the releases now: breaks parent decision D2 and publishes before the code merges.

---

### ADR-007: The 008 list stays live after this phase

**Status**: Proposed

**Context**: Goal criterion 1 and the parent handoff say the check lists only generated paths after 006. Phase 005's plan sends allowlist rows for non-lane matches to phase 008, after 006 and 007, and this phase may not edit the allowlist rows 008 owns.

**Decision**: Measure REQ-001 against `spec.md`'s 007 and 008 lists and raise the conflict as open question 1 with the amendment: goal criterion 1 reads "The residue check lists only the paths on `spec.md`'s 007 and 008 lists." Phase 007's criterion 3 inherits the gap; the conductor decides before 007 is planned.

**Consequences**:
- The 15 non-generated paths stay listed by name, so nothing hides.
- Goal criterion 1 reads Unmet until the conductor answers.

**Alternatives Rejected**:
- Add the 15 rows here: takes 008's decision and its rows' reasons without its review.

---

### ADR-008: Env docs delete a row only when nothing reads the variable

**Status**: Accepted

**Context**: `env-reference-drift.vitest.ts` fails when the runtime reads a `SPECKIT_*` variable that `ENV-REFERENCE.md` does not document. Phase 005 deletes the readers of the model-server, HF and embedding settings; phase 004 deleted the refresh. The lane weights variables still have readers.

**Decision**: For each row and `.env.example` line, `git grep` for a reader outside docs and `specs/`. No reader: delete the row. A reader: rewrite it, for example the lane weights defaults lose their `semantic_shadow` key. `ENV-REFERENCE.md` section 6 and the cascade probe section go whole, and `.env.example` section 7 goes whole once each of its variables shows no reader.

**Consequences**:
- The drift test keeps passing, and no doc names a variable nothing reads.

**Alternatives Rejected**:
- Delete every row the check matches: fails the drift test for any variable still read.

---

### ADR-009: Exploration ran inline, not as four parallel context agents

**Status**: Accepted

**Context**: `speckit-plan.yaml` step 5 dispatches four `@context` agents. This plan was written by a leaf worker that may not dispatch agents.

**Decision**: Use the step's inline fallback: the residue check, a classifier over its `--json` list, per-file match reads and every validator baseline, run in this worker, with their output in `spec.md`'s Measured Behavior.

**Consequences**:
- One reader's view; the Measured Behavior commands are there to be rerun.

**Alternatives Rejected**:
- Dispatch the agents: the worker's brief forbids it.

---

### ADR-010: Non-vocabulary leftovers the earlier phases routed here are fixed; history without residue terms stays

**Status**: Accepted

**Context**: Phases 002 to 005 routed prose leftovers here that the check does not match: `MEMORY_DB_PATH` in four docs, the deleted `lane-weight-sweep.vitest.ts` in `lane-weight-tuning.md`, the dead model-server flag in two playbooks, `IEmbeddingProvider`, `IVectorStore` and `EmbeddingProfile` in three sk-code examples, and "hf-model server" in the spec-kit catalog index. Separately, six changelog entries outside the 23 name the model server or the CI install setting without a residue term.

**Decision**: Fix every routed doc leftover, checked by REQ-009's grep. Leave the six history lines: each is true for its release, and decision Q002 fixed the rewrite at 23 entries.

**Consequences**:
- Docs name nothing phase 005 deletes. The sk-code style guide keeps its rule and loses only the deleted example.

**Alternatives Rejected**:
- Rewrite the six extra entries: no check requires it, and it widens the drift from published bodies.
