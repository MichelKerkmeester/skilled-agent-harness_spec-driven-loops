---
title: "Feature Specification: Phase 2: changelog-findability"
description: "Every changelog entry in the repository, from release notes to skill and packet-local changelogs, carries the search metadata a spec document carries, and sk-create-changelog and the nested generator write that metadata into every new entry."
trigger_phrases:
  - "changelog-findability"
  - "changelog search metadata"
  - "changelog identity phrases"
  - "born findable changelog entries"
  - "changelog frontmatter retrofit"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: changelog-findability

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Gate 1 can see 1,959 changelog entries, and only 55 of the 587 release and skill entries declare a trigger phrase at all. The 1,372 packet-local entries all declare phrases, but 424 of them carry only the nested template's defaults, so a lookup for "nested changelog" returns 461 exact hits before the workflow reference that explains it. This phase gives every entry the five search keys a spec document carries, derives each entry's identity phrase from its path and teaches sk-create-changelog and the nested generator to write the same metadata into every new entry.

**Key Decisions**: identity phrases are derived from the path by one rule per kind, descriptions are reported from each entry's own opening sentence, and a model writes only the topic phrases and the 12 descriptions that rule cannot report (decision-record.md ADR-001 to ADR-005).

**Critical Dependencies**: phase 001's edits to sk-create-changelog, the release line and system-spec-kit's changelog must be committed, and the parent must release those paths, before Stage 2 writes them.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-release-line-split |
| **Successor** | None |
| **Handoff Criteria** | Every row in acceptance-criteria.md is Met, or Waived by an ADR, and `validate.sh --strict` prints `RESULT: PASSED` on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Skilled release changelog: the framework release line and findable changelogs specification.

**Scope Boundary**: Search metadata on every changelog entry of the three kinds Gate 1 indexes, release notes under `.skilled/changelog/skilled/`, skill changelogs under `.skilled/skills/**/changelog/` and packet-local changelogs under `specs/**/changelog/`. It also covers the writers that produce those entries: sk-create-changelog, its two command YAMLs, the nested generator and its templates. Retrieval code stays unchanged, because the corpus roots already reach all three kinds.

**Dependencies**:
- Phase 001's lanes have stopped and its files are committed, so this phase edits sk-create-changelog, the release line and system-spec-kit's changelog on a stable base.
- The parent releases the locked paths by message before Stage 2 writes them.
- The operator decisions listed in section 12 are answered before the steps they gate.

**Deliverables**:
- A frontmatter contract for changelog entries, enforced by `validate_document.py` and by sk-create-changelog's own checks
- sk-create-changelog and the nested generator writing that contract into every new entry
- All 1,959 existing entries completed to the contract without a changed body byte
- Findability evidence: before-and-after lookups on a scratch index, a negative control and the whole-gate reruns

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A spec document is findable because its frontmatter names it: a title, a description and trigger phrases the Gate 1 index turns into lookups. Changelog entries mostly lack that metadata. 42 of 45 release entries and 490 of 542 skill entries declare no trigger phrase, so a lookup for `mcp-tooling v1.5.2.0` returns no scoring result at all. Packet-local entries declare phrases, but the nested templates hardcode "phase changelog", "nested changelog" and "phase completion" into every entry they render, and those defaults now crowd out the documents that own the words.

### Purpose
A reader who types a changelog's name, version or topic finds that entry first, the way they would find a spec document, whether the entry already exists or sk-create-changelog writes it tomorrow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The metadata contract for the three entry kinds: five canonical keys, identity phrases derived from the path, descriptions reported from the entry
- sk-create-changelog generating and checking that metadata for every global entry it writes, with its template, both command YAMLs, its playbook and its own changelog entry
- The nested generator writing a derived identity phrase in place of the template defaults
- A frontmatter check for changelog entries in `validate_document.py`, with tests
- A deterministic retrofit of all 1,959 existing entries, with model lanes for topic phrases and the 12 residue descriptions
- Proof on a scratch index, since the committed index is the parent's to rebuild

### Out of Scope
- Retrieval code, its tests and `retrieval-conventions.md`. The corpus roots already cover all three kinds and the trial index needed no code change.
- Rewriting any entry's prose. An earlier packet settled the history files, so this phase adds or completes frontmatter only.
- Non-entry documents inside changelog folders, such as READMEs, the nested templates' own README, `before-vs-after.md` and review containment copies. They are not entries and keep their own metadata.
- `.worktrees/**`, `barter/**` and `.hermes/**`. The parent runs the Hermes sync.
- Rebuilding the committed trigger index and its fixtures, which the parent does from committed content.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Frontmatter required in the format contract, generated in step 4 and checked in the validation list |
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | The frontmatter block, identity phrase rule and description rule |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modify | The exemplar note and the examples show the block |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/**` | Create, Modify | A search-metadata category with CHG-011 and CHG-012, and the index section |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.0.0.md` | Create | The mode's own entry, written by the mode with the new block |
| `.skilled/skills/system-spec-kit/changelog/v4.1.2.0.md` | Create | system-spec-kit's entry for the generator change, part of Skilled v4.0.0.2 |
| `.skilled/skills/sk-doc/changelog/v2.2.1.0.md` | Create | The sk-doc hub's entry for the validator check |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, `.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/skills/sk-doc/SKILL.md` | Modify | Each `version:` line names its component's newest entry |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Step 4 generates the block, step 5 checks it |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | The same two steps in the confirm flow |
| `.skilled/skills/system-spec-kit/templates/changelog/phase.md`, `root.md` | Modify | One `{{CHANGELOG_IDENTITY_PHRASE}}` member replaces the three template defaults |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Modify | Derives the identity phrase and renders it |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts` | Modify | Happy path plus the root and ten-token edges |
| `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` | Modify | Documents the identity phrase |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Changelog frontmatter check |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modify | Required frontmatter fields for the changelog type |
| `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Modify | Tests for the new check |
| `.skilled/changelog/skilled/**/v*.md` | Modify | 45 release entries, frontmatter only |
| `.skilled/skills/**/changelog/**/v*.md` | Modify | 542 skill entries, frontmatter only |
| `specs/**/changelog/**/changelog-*.md` | Modify | 1,372 packet-local entries, frontmatter only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every entry of the three kinds opens with a frontmatter block carrying `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType`. Keys that exist keep their values byte for byte, and no body byte changes. |
| REQ-002 | Every entry declares its identity phrases: `<component> v<version>` and `<component> <version>` for a skill entry, `v<version> release notes` and `skilled v<version>` for a release entry, and one owner-qualified slug phrase ending in `changelog` for a packet-local entry. |
| REQ-003 | sk-create-changelog requires, generates and checks the block for every global entry it writes: the format contract, step 4, the validation list, the template and both command YAMLs agree. |
| REQ-004 | The nested generator renders the packet identity phrase and none of the five template defaults, for root and phase mode alike. |
| REQ-005 | The trigger index built from the final tree publishes with zero malformed documents, grows no more than 10 percent over the same-day baseline, adds no negative phrase class and keeps cold lookups under 200 ms at p95 and max. |
| REQ-006 | For each kind, a lookup that misses today ranks the target entry first after the change, and a negative control still scores nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A missing description is reported from the entry's opening sentence. The 15 entries that rule cannot serve get a model-written description of one or two sentences, 250 characters at most, clean under the HVR scan. |
| REQ-008 | A skill or release entry with no trigger phrase gains a topic phrase: its editorial H1 where it has one, else one or two model-proposed phrases that pass the checker in plan.md. |
| REQ-009 | `validate_document.py` blocks a changelog entry that lacks the block, a canonical key, a trigger phrase or, for a version file, a phrase naming its version. Non-entry files in changelog folders stay unchecked. |
| REQ-010 | The playbook gains CHG-011 for a global entry and CHG-012 for a nested entry, and the package validator passes with 12 scenarios in 5 categories. |
| REQ-011 | sk-create-changelog records this change in its own next entry, written by the mode and carrying the block it now requires. |
| REQ-012 | The five template defaults leave the 468 packet-local entries that carry them, if the operator approves. Without approval this row is waived by ADR-005. |
| REQ-013 | The ripgrep lane returns trigger-phrase evidence for an identity phrase of each kind. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A rescan of the final tree finds no entry of the three kinds missing a canonical key, apart from files skipped because another session had them dirty, and each of those is listed.
- **SC-002**: A lookup by identity phrase ranks its entry first for every kind, and the measured trial already shows nine misses turned into first-rank hits.
- **SC-003**: Index growth stays within 10 percent and cold lookups within 200 ms. The trial measured 7.3 percent and a worst max of 109 ms.
- **SC-004**: Every suite and validator baselined before the work passes after it, and the report states each delta.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's commit | Editing its moved notes before it lands breaks its clean renames | Stage 2 starts only after the parent's release message |
| Dependency | DeepSeek V4.1 Flash through cli-devin or cli-pi | Judgment lanes stall and topic phrases wait | Entries keep their identity phrases, which carry the P0 findability, and the lane reruns once |
| Risk | A model-written phrase is generic or unfaithful | Med | A checker rejects it before any file is written, see plan.md |
| Risk | The retrofit touches a file another session has dirty | High | The script skips any path `git status --porcelain` reports and lists it |
| Risk | A strict validator check turns red on entries the retrofit skipped | Low | The check lands after the retrofit, and no CI job or hook runs `validate_document.py` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cold trigger lookups stay under 200 ms at p95 and max, the budget `measure-cold-lookup.mjs` enforces.
- **NFR-P02**: The published index grows no more than 10 percent over a baseline built the same day from the same tree.

### Security
- **NFR-S01**: Judgment lanes receive entry text only and run with no write tools. No brief carries a secret, and no lane opens a `.env` file.
- **NFR-S02**: No lane runs a git write, `generate-context.js`, `validate.sh` or an index, sync, repair or route script.

### Reliability
- **NFR-R01**: The retrofit is idempotent: a second run over the finished tree changes no file.
- **NFR-R02**: Every written entry passes a preimage guard: its body after the closing fence is byte-identical and the trigger reader accepts the new block.

---

## 8. EDGE CASES

### Data Boundaries
- Leading blank lines: 40 packet-local entries open with blank lines before the fence. The retrofit keeps them, as the trigger reader does.
- Valid-empty lists: 5 entries declare `trigger_phrases: []`. The retrofit replaces the empty list with a block list.
- Three-part versions such as `v0.1.0.md` count as version files.
- One owner folder, the deep-loop runtime, has no `SKILL.md`. Its entries name the component `deep-loop-runtime`.
- Long packet names: 107 identity phrases need their qualifier trimmed to fit ten tokens. The entry's own words always survive whole.
- Shared phrases: after qualification, 37 packet phrases still name 83 entries, all of them renumbered or duplicated entries for the same work. The index maps a phrase to many paths, so each lookup returns every copy.
- The `.skilled/changelog/<component>` folders are symlinks into the skill folders. The corpus walker does not follow them, so no entry is counted or written twice.

### Error Scenarios
- A lane returns invalid JSON or a rejected phrase: the batch reruns once, then its entries keep their identity phrases only and the report lists them.
- A lane hangs: `pgrep -fl <brief-name>` finds it and only its captured PID is killed.
- A frontmatter block does not close: the retrofit refuses the file and lists it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 1,975, of which 1,959 are metadata-only entries. Code: two scripts and two test files. Systems: sk-create-changelog, the nested generator, the sk-doc validator |
| Risk | 12/25 | Auth: N. API: N. Breaking: N. A shared tree and locked paths raise the coordination risk |
| Research | 14/20 | Retrieval scoring, corpus coverage and index budgets measured on scratch indexes |
| Multi-Agent | 10/15 | Workstreams: about 17 judgment batches and 13 one-change edit lanes on DeepSeek V4.1 Flash |
| Coordination | 11/15 | Dependencies: phase 001's commit, the parent's releases, three operator decisions |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A body byte changes during the retrofit | H | L | Preimage guard per file, dry run first, diff sample reviewed |
| R-002 | A model lane writes into the repository | H | L | Judgment lanes have no write tools, and a git status diff runs after every lane |
| R-003 | Topic phrases collide across entries | M | M | The checker limits a phrase to three owning documents in the scratch index |
| R-004 | The index outgrows its latency budget | M | L | Measured at 7.3 percent and 109 ms. The final tree is measured again |
| R-005 | A generator placeholder breaks YAML | M | L | The placeholder sits inside quotes, and derived phrases hold only letters, digits and spaces |
| R-006 | The operator declines the generic phrase removal | L | M | ADR-005 waives REQ-012. New entries stop receiving the defaults either way |

---

## 11. USER STORIES

### US-001: Find a changelog by name and version (Priority: P0)

**As a** maintainer, **I want** `mcp-tooling v1.5.2.0` or `v3.6.0.0 release notes` to return that entry first, **so that** I read the change record without browsing folders.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: New entries arrive findable (Priority: P0)

**As a** release author, **I want** sk-create-changelog and the nested generator to write the search metadata for me, **so that** no new entry needs a retrofit.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Find a changelog by topic (Priority: P1)

**As a** reader who remembers what changed but not the version, **I want** a topic phrase such as "harder core longer reach" to reach the entry, **so that** Gate 1 answers the question I can actually ask.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

All four questions were answered in the Stage 2 release, and none is open.

- **Generic phrase removal (operator).** Approved. The strip pass removed the five template defaults from all 468 carriers, and ADR-005 records the decision as accepted by the parent under the operator's request that every changelog be as findable as a spec document.
- **Edit-lane transport (operator).** cli-pi. `--permission-mode dangerous` was not approved, so every edit lane ran on cli-pi through opencode-go with `--tools read,edit,write`, `--offline` and `PI_BLACKHOLE_PASSIVE=true`. Judgment lanes ran on cli-devin with `--permission-mode auto`.
- **Parallel lanes (operator).** Three, for read-only judgment batches only. Edit lanes ran one at a time and never overlapped a judgment round.
- **Component entries (parent).** Yes. system-spec-kit gets 4.1.2.0 for the generator change, the sk-doc hub gets 2.2.1.0 for the validator check, and sk-create-changelog gets 1.3.0.0. Each `SKILL.md` names its newest entry.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
