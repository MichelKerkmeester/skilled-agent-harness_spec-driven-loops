---
title: "Decision Record: Phase 2: changelog-findability"
description: "Why changelog identity phrases come from the path, why descriptions are reported from each entry's opening sentence, where DeepSeek lanes do judgment work, how the contract is enforced and what happens to the nested template defaults."
trigger_phrases:
  - "changelog findability decisions"
  - "changelog identity phrase decision"
  - "reported changelog descriptions"
  - "changelog template default phrases"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog/002-changelog-findability"
    last_updated_at: "2026-09-27T14:56:00Z"
    last_updated_by: "phase-002-orchestrator"
    recent_action: "Accepted ADR-001 to ADR-005 and recorded the Stage 2 amendments"
    next_safe_action: "Parent commits the phase"
    blockers: []
    key_files:
      - "decision-record.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:118e8d206b7446d8ac6cfdc57a912a2b3091f7b85857217bec043e43a35b4f2e"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the operator approve removing the five template defaults from existing packet-local entries? Yes, and all 468 carriers lost them."
---
# Decision Record: Phase 2: changelog-findability

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Derive identity phrases from the entry's path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-27 |
| **Deciders** | Phase 002 orchestrator. The parent accepted it in the Stage 2 release |

---

<!-- ANCHOR:adr-001-context -->
### Context

A reader asks for a changelog by component and version, or by packet and phase, and the path already holds those names. The Gate 1 lookup scores a phrase 1.0 on an exact match, 0.94 when the phrase contains the query and 0.88 when the query contains the phrase. Token overlap ignores one-character tokens, so the digits of a version only count through containment, and `mcp-tooling 1.5.2.0` never matches a phrase written `mcp-tooling v1.5.2.0`.

### Constraints

- The corpus walker already reaches all three kinds, so the fix lives in the entries and their writers, not in retrieval code.
- The judge rejects phrases over ten tokens as prose, and the lookup returns at most 20 results in path order.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one deterministic rule per kind that turns the path into identity phrases, applied by the retrofit once and by the nested generator for every new entry.

**How it works**: a skill entry declares `<component> v<version>` and `<component> <version>`. A release entry declares `v<version> release notes`, which phase 001 already uses, and `skilled v<version>`. A packet-local entry declares its owner's words followed by its own, trimmed from the owner's end past nine words and closed with `changelog`, as plan.md section 3 sets out.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Path rule per kind, packet phrases always owner-qualified** | No corpus scan at write time, same output from both writers | Packet phrases grow to a median of 8 tokens | 9/10 |
| Qualify packet phrases only when they collide | Shorter phrases | The generator would need a corpus scan to know, and the measured residue is the same 37 shared phrases | 6/10 |
| A component handle such as "sk-doc changelog" | One phrase finds a whole folder | The 20-result cap and path order return the oldest entries first | 3/10 |
| Model-written identity phrases | None worth the cost | Variance in a mechanical field | 2/10 |

**Why this one**: it is the only option both writers can apply without reading the corpus, and containment scoring keeps a query of the entry's own name matching the longer phrase at 0.94.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Nine probes that missed on the baseline index ranked their target first on the trial index, including `mcp-tooling v1.5.2.0`, `v3.6.0.0 release notes` and `opencode native plugin changelog`.
- Two negative controls stayed negative: `mcp-tooling v9.9.9.9 changelog` scored nothing, and `sk-git v1.5.2.0 changelog` returned sk-git's own entry first.

**What it costs**:
- 2,453 more unique phrases and 6.4 percent more index bytes. Mitigation: the cold lookup budget still holds with room to spare.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| 37 packet phrases still name 83 entries | L | Each is a renumbered or duplicated entry for the same work, and the index returns every path |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 532 skill and release entries declare no phrase today |
| 2 | **Beyond Local Maxima?** | PASS | Four options scored above |
| 3 | **Sufficient?** | PASS | A pure function of the path, with no model and no scan |
| 4 | **Fits Goal?** | PASS | Name and version lookups are the P0 findability case |
| 5 | **Open Horizons?** | PASS | New kinds add a rule without touching the others |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `nested-changelog.ts` derives the packet phrase and renders it through the templates' `{{CHANGELOG_IDENTITY_PHRASE}}` member. The placeholder is not `{{TRIGGER_PHRASE}}`, because the templates are in the index corpus and that name would have made them the exact owner of "trigger phrase".
- The retrofit script applies all three rules to the existing entries.

**How to roll back**: revert the phase commit. The dry-run plan lists every file the retrofit wrote.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Report descriptions from each entry's opening sentence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-27 |
| **Deciders** | Phase 002 orchestrator. The parent accepted it in the Stage 2 release |

---

<!-- ANCHOR:adr-002-context -->
### Context

529 skill and release entries have no description. sk-create-changelog's format contract makes every entry open with a summary narrative, and an earlier packet rewrote the history files to that shape, so most entries already state their own summary in their first sentence. The spec-doc retrofit treats a description as reported, never synthesized from body prose.

### Constraints

- An entry's prose is settled and must not change, so the description can quote the entry but never edit it.
- The repository's voice rules ban em dashes and semicolons in new prose.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the first sentence of the entry's first prose paragraph, with inline markdown markers stripped, joined by the next sentence when it runs under 60 characters.

**How it works**: a result of 40 to 250 characters with no em dash and no semicolon becomes the description as it stands. Stage 1 measured 514 of the 529 entries as qualifying and 15 as residue.

**Stage 2 amendment**: the retrofit's sample review found that the Stage 1 sentence rule ended a sentence at every stop, so an opening that named `v1.3` or `SKILL.md` lost its start and 123 descriptions read as fragments. A stop inside a word now stays inside the sentence, and the description must begin where the paragraph begins. Under the corrected rule 517 entries qualify and 12 go to a judgment lane: 11 of the first batch's 15, plus one opening that the corrected rule found too long. Five hand-written rollup changelogs, which have no generator title to rebuild a sentence from, use their opening sentence under the same rule.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Report the opening sentence, model for the residue** | The author's own words, and only 15 model outputs to check | Some opening sentences are plain rather than vivid | 9/10 |
| A model writes every description | Uniform style | 529 outputs to check, restating what the entry already says | 4/10 |
| Cut long sentences at 250 characters | No model at all | A cut sentence misreports the entry | 3/10 |
| Replace dashes in quoted sentences | No model at all | Rewrites the author's words | 2/10 |

**Why this one**: it keeps the description faithful by construction and spends model work only where the rule cannot.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- 517 descriptions need no model and no faithfulness review.
- The ripgrep lane ranks a description hit above a body hit, so a phrase from the summary finds the entry faster.

**What it costs**:
- Descriptions read as the entries do, and some older ones are terse. Mitigation: none needed, since a terse true summary beats a vivid invented one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A sentence splits at an abbreviation | L | The dry-run diff sample is read before apply, and the 40-character floor catches most short splits |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 529 entries lack the field a spec document always has |
| 2 | **Beyond Local Maxima?** | PASS | Four options scored above |
| 3 | **Sufficient?** | PASS | A deterministic rule serves 97 percent of the entries |
| 4 | **Fits Goal?** | PASS | Descriptions feed the ripgrep lane's ranking |
| 5 | **Open Horizons?** | PASS | New entries get a written description from the mode itself |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The retrofit script writes the reported description for 517 entries.
- Judgment lanes write the 12 residue descriptions, and the checker admits them.

**How to roll back**: revert the phase commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Give DeepSeek lanes only the judgment work, behind a checker

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-27 |
| **Deciders** | Phase 002 orchestrator. The parent accepted it in the Stage 2 release |

---

<!-- ANCHOR:adr-003-context -->
### Context

532 skill and release entries declare no trigger phrase. An editorial H1 such as "Harder Core, Longer Reach" gives 124 of them a topic phrase the author already chose. The other 408 have no such title, and choosing one or two distinctive phrases from an entry is judgment. The operator named DeepSeek V4.1 Flash through cli-devin or cli-pi for the build.

### Constraints

- A model must never write straight into the repository without a check in between.
- cli-devin's NEVER rule 1 forbids `--permission-mode dangerous` without explicit user approval, and rule 15 allows parallel dispatches only when the operator authorizes a count.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: read-only judgment lanes that return JSON lines for batches of 25 entries, admitted only by the checker in plan.md section 4.

**How it works**: the brief inlines each entry's path and opening text, so the lane needs no tools. The checker tests shape, length, the phrase judge, a shared content token with the entry, a generic-phrase stoplist, a three-owner cap in a scratch index and the voice scan for descriptions. The retrofit merges only admitted records.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-only lanes plus a checker** | Judgment where it is needed, nothing unchecked reaches a file | About 17 batches of lane time | 8/10 |
| No topic phrases | No model at all | Gate 1 would reach those entries by name and version only, while spec documents are reachable by topic | 5/10 |
| Frequent-word extraction from the body | Deterministic | Not measured, and by construction it picks common words rather than distinctive ones | 3/10 |
| Lanes edit the entries directly | Fewer steps | No checker between the model and the repository | 1/10 |

**Why this one**: topic findability is part of matching a spec document, and the checker makes the model's output as trustworthy as the rules' output.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A reader who remembers what changed but not the version reaches the entry. On the trial index, "harder core longer reach" went from absent to rank 1.

**What it costs**:
- Lane time on the critical path. Mitigation: the writer lanes run beside it, since the judgment lanes write nothing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A batch returns nothing usable | M | One rerun, then its entries keep their identity phrases and the report lists them |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 408 entries have no author-chosen topic |
| 2 | **Beyond Local Maxima?** | PASS | Four options scored above |
| 3 | **Sufficient?** | PASS | The lanes need no tools and no repository access |
| 4 | **Fits Goal?** | PASS | Topic lookups are how a spec document is usually found |
| 5 | **Open Horizons?** | PASS | The checker applies unchanged to any later batch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Judgment briefs and their JSON output live in the session scratch folder.
- Admitted records merge into the retrofit plan before the dry run.

**How to roll back**: drop the merged records and rerun the dry run. No repository file changes before S11.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Enforce the contract in validate_document.py after the retrofit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-27 |
| **Deciders** | Phase 002 orchestrator. The parent accepted it in the Stage 2 release |

---

<!-- ANCHOR:adr-004-context -->
### Context

`validate_document.py` treats any path holding `/changelog/` as a changelog and checks no frontmatter. In Stage 1 it reported a valid document, exit 0, for a skill entry with no frontmatter at all, so a writer that drops the block drifts in silence. sk-create-changelog's validation list names this validator as its shared check.

### Constraints

- No CI workflow and no hook calls `validate_document.py`, so a blocking check bites only when an author runs it.
- The validator's regression test reads a real skill entry, which must carry the block before the check lands.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: a blocking frontmatter check for changelog entries, landed after the retrofit.

**How it works**: the check applies to entry basenames only, `v<version>.md` and `changelog-*.md`. It blocks on a missing block, a missing canonical key or an empty phrase list, and it blocks a version file whose phrases do not name its version. `template-rules.json` lists the required fields, the way it already does for commands.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Blocking check, after the retrofit** | Drift fails where the author writes | Entries skipped as dirty fail until completed | 8/10 |
| A warning | Never blocks anyone | Warnings on an on-demand tool are read once and ignored | 5/10 |
| A rule in `validate.sh` | Runs on every spec save | It scans spec folders only and never sees skill or release entries | 3/10 |
| No enforcement | No work | The drift that caused this phase returns | 1/10 |

**Why this one**: the author's own validation step is the one moment a missing block is cheap to fix.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A changelog entry without search metadata stops validating.

**What it costs**:
- Dirty-skipped entries fail the check until a follow-up pass completes them. Mitigation: the report lists each one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The check catches a non-entry file | L | Basename scoping, and a test that a README in a changelog folder passes |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The validator passes an entry with no frontmatter today |
| 2 | **Beyond Local Maxima?** | PASS | Four options scored above |
| 3 | **Sufficient?** | PASS | One function and one rules entry, mirroring the command check |
| 4 | **Fits Goal?** | PASS | It keeps new entries findable |
| 5 | **Open Horizons?** | PASS | CI can call the same check later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `validate_document.py` gains the check, `template-rules.json` names the fields and `test_changelog_validator.py` covers a missing block, a complete block, a missing version phrase and a README.

**How to roll back**: revert the three files. Entries keep their metadata.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Stop writing the nested template defaults, and remove them only with approval

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-27 |
| **Deciders** | The parent accepted it in the Stage 2 release, under the operator's request that every changelog be as findable as a spec document |

---

<!-- ANCHOR:adr-005-context -->
### Context

The nested templates hardcode "phase changelog", "nested changelog" and "phase completion" for phase entries, and "root changelog", "packet changelog" and "nested changelog" for root entries. 468 packet-local entries carry at least one of them and 424 carry nothing else. A lookup for "nested changelog" returns 461 exact owners, and the workflow reference that explains nested changelogs ranks 462nd.

### Constraints

- The brief allows adding or completing frontmatter on existing entries, not removing values.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: the templates stop writing the defaults in every case, and existing entries lose them only if the operator approves.

**How it works**: with approval, the retrofit's `--strip-defaults` pass removes the five phrases from entries that have gained their identity phrase. Without approval, REQ-012 is waived by this ADR, and the defaults stay beside the new phrase.

**Outcome**: the operator approved. The strip pass removed 1,337 phrase members from all 468 carriers after each had gained its identity phrase, so AC-014 is live and met.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Templates stop, removal waits for approval** | Honors the brief, new entries stop adding to the pile | Existing noise stays until approved | 8/10 |
| Remove without asking | Cleanest index | Edits values the brief did not open | 3/10 |
| Keep the defaults in the templates | No change | Every new entry repeats them | 1/10 |

**Why this one**: it stops the damage now and leaves the one out-of-brief edit to the person who owns the brief.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- No new entry adds a default phrase.
- With approval, "nested changelog" returns the workflow reference instead of 461 entries.

**What it costs**:
- Without approval, the existing 468 carriers keep crowding those lookups. Mitigation: none inside this phase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A default phrase was the only phrase a reader used | L | Every entry gains an identity phrase before any default leaves |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 461 owners for one generic phrase |
| 2 | **Beyond Local Maxima?** | PASS | Three options scored above |
| 3 | **Sufficient?** | PASS | One template edit, one optional pass |
| 4 | **Fits Goal?** | PASS | Generic owners crowd out the documents readers want |
| 5 | **Open Horizons?** | PASS | The optional pass can run later without other changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `templates/changelog/phase.md` and `root.md` carry one `{{CHANGELOG_IDENTITY_PHRASE}}` member.
- With approval, the retrofit strips the defaults from the 468 carriers.

**How to roll back**: revert the phase commit.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
