---
title: "Feature Specification: Phase 4: grep-convention-doc-retrofit"
description: "Define a grep-optimized spec-doc convention, enforce it in templates and validate.sh, and retrofit it across the 22,127 active spec documents."
trigger_phrases:
  - "grep convention doc retrofit"
  - "grep convention"
  - "spec doc convention"
  - "doc retrofit"
  - "greppable spec docs"
  - "frontmatter normalization"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: grep-convention-doc-retrofit

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

With retrieval now resting on ripgrep and a frontmatter-derived index, the corpus itself becomes the
retrieval engine. This phase makes 22,127 active spec documents predictable to grep: consistent
frontmatter keys, stable section markers, and a naming grammar — enforced by templates and
`validate.sh` so new documents cannot drift.

**Outcome:** 22,094 documents in scope rather than the 22,127 estimated here, 10,210 rewritten with
every body preimage identical and zero residue, and 63 left reported by design — 55 canonical
documents that need an authored block and 8 policy cards a flow mapping makes unparseable.

**Key Decisions**: Retrofit all active documents rather than new-only, per the operator's scope choice; exclude `z_archive/`.

**Critical Dependencies**: Phases 001-003 complete, so the convention is shaped by the retrieval path that actually exists.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `claude/speckit-memory-db-review-3gheky` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-spec-memory-server-removal |
| **Successor** | None |
| **Handoff Criteria** | Convention enforced by `validate.sh`; retrofit applied with no unresolved variants |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the memory db decommission specification.

**Scope Boundary**: The convention and its application to active spec docs. Archived packets under
`z_archive/` are excluded — 10,584 files that nothing retrieves against and whose rewriting would
only add diff noise.

**Dependencies**:
- Phase 001's `retrieval-conventions.md`, which the doc convention must serve
- Phase 003 complete, so the convention is not shaped around a system being removed

**Deliverables**:
- The written convention
- Template updates so new documents comply by construction
- A `validate.sh` rule enforcing it
- A retrofit tool plus its residue rescan
- 22,127 active documents conforming

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Once retrieval is ripgrep, retrieval quality is a property of the corpus rather than of a ranking
pipeline. Today the corpus is inconsistent: `trigger_phrases` is present in 11,902 of the active
documents but not all, frontmatter keys vary, and section markers differ between template
generations. A grep is only as good as the regularity of what it searches.

### Purpose

Active spec documents share one predictable shape, so a single ripgrep invocation reaches the right
document without a ranking layer compensating for the corpus.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The convention: required frontmatter keys and their value shapes, stable section markers, a
  document naming grammar, and the rule for what belongs in `trigger_phrases`.
- Template updates under `.opencode/skills/system-spec-kit/templates/`.
- A `validate.sh` rule that fails a non-conforming document.
- A retrofit tool that applies the convention mechanically and reports what it could not resolve.
- Application across the 22,127 active spec documents.

### Out of Scope

- `z_archive/` — 10,584 documents, excluded by the scope boundary above.
- Rewriting document *bodies*. The convention governs frontmatter, markers and naming. Prose bytes
  are frozen by the preimage rule in section 15, which is what makes marker retrofit and
  no-body-rewrite compatible rather than contradictory.
- Non-spec markdown: skill `SKILL.md`, references and READMEs keep their own contracts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/structure/grep-convention.md` | Create | The written convention |
| `.opencode/skills/system-spec-kit/templates/**` | Modify | New documents comply by construction |
| `.opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh` | Create | Validator rule |
| `.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs` | Create | Mechanical retrofit plus residue report |
| `specs/**/*.md` (22,127 active) | Modify | Convention applied |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The convention is written down before any document is modified |
| REQ-002 | `validate.sh` fails a document that violates the convention |
| REQ-003 | The retrofit enumerates every in-scope variant first, processes each, then rescans for residue |
| REQ-004 | The retrofit changes no document body text |
| REQ-008 | Canonical frontmatter keys are frozen in section 13.1. `triggerPhrases` is recognized on read, normalized to `trigger_phrases` on write and reported as an alias hit |
| REQ-009 | Every `trigger_phrases` member is author-controlled. Generic negatives from section 13.3 are rejected and reported, never injected by a fallback |
| REQ-010 | Anchor markers match the exact grammar in section 13.4. Unmatched, orphaned or duplicated ids are diagnostics rather than silent repairs |
| REQ-011 | The retrofit classifies every in-scope document into exactly one of the eight frontmatter variants in section 13.2 before it processes any document |
| REQ-012 | The body-preservation invariant in section 15 holds byte-exactly for every processed document |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Templates produce conforming documents with no manual step |
| REQ-006 | The trigger index regenerates cleanly from the retrofitted corpus, with a phrase count at or above the pre-retrofit baseline |
| REQ-007 | The retrofit is idempotent — a second run produces no diff |
| REQ-013 | Packet directories and document basenames follow the naming grammar in section 13.6. Legacy exceptions are reported, not renamed by this retrofit |
| REQ-014 | One fact per line governs newly authored structured sections only, per section 13.5 |
| REQ-015 | The convention document carries the executable `rg` recipes in section 14, each with its exit mapping |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --recursive --strict` passes on the parent packet
- **SC-002**: Residue rescan reports zero unprocessed variants across 22,127 documents
- **SC-003**: Regenerated trigger index covers at least the pre-retrofit phrase count of 97,529
- **SC-004**: Every in-scope document carries a variant label from section 13.2, and the eight labels sum to the enumerated total
- **SC-005**: The body preimage manifest matches after the run for every processed document, with zero non-frontmatter and non-marker changed lines
- **SC-006**: Each `rg` recipe in section 14 was executed once against the retrofitted corpus, and its exit status was read and recorded
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A 22,127-file diff is unreviewable as one change | High | Batch by track; one commit per track with its own residue report |
| Risk | A mechanical retrofit corrupts frontmatter in an unanticipated variant | High | REQ-003's enumerate-first discipline; dry-run diff on one track before the rest |
| Risk | Scope creep from frontmatter into body rewriting | Med | REQ-004 makes it a blocker; the open question below must be closed first |
| Risk | Retrofit and phase 002's continuity-writer decision disagree about `_memory.continuity` | Med | Settle in phase 002; this phase consumes that answer |
| Dependency | Phases 001-003 | Shapes the convention | Sequenced |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A scoped ripgrep over the retrofitted corpus stays within the 0.5s measured today

### Security
- **NFR-S01**: The retrofit tool writes only inside `specs/` and makes no network calls

### Reliability
- **NFR-R01**: Retrofit is idempotent and dry-runnable

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a document with no frontmatter gets one, and is reported rather than silently rewritten
- Maximum length: a document exceeding the marker budget is reported, not truncated
- A valid empty `trigger_phrases` list is not malformed input. It is a distinct variant with its own handling, per section 13.2

### Error Scenarios
- Malformed YAML: reported by path and skipped, never partially rewritten
- A document that is both spec and template fixture: excluded and listed
- The full enumeration the retrofit must classify against lives in section 13.2. An in-scope document that matches no variant is a fail-closed condition, not a default-to-skip

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | Files: 22,127, LOC: frontmatter-scale, Systems: 1 corpus |
| Risk | 12/25 | Auth: N, API: N, Breaking: Y for validation |
| Research | 10/20 | Variant enumeration across template generations |
| Multi-Agent | 8/15 | Workstreams: parallelizable by track |
| Coordination | 8/15 | Dependencies: consumes 001-003 |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Unreviewable mega-diff | H | H | One commit per track |
| R-002 | Frontmatter corruption in an unseen variant | H | M | Enumerate-first, dry-run one track |
| R-003 | Body rewriting creeps in | M | M | REQ-004 blocker |

---

## 11. USER STORIES

### US-001: A corpus that greps predictably (Priority: P0)

**As a** framework operator, **I want** every active spec document to share one shape, **so that** one ripgrep invocation finds what I need without a ranking layer.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: New documents that cannot drift (Priority: P1)

**As a** framework operator, **I want** the templates and the validator to enforce the convention, **so that** the corpus does not decay back to inconsistency.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- ~~Does the convention touch document bodies at all, or strictly frontmatter, markers and naming?~~ **Resolved** by section 15. The convention governs frontmatter, anchor marker lines and naming. Prose bytes are frozen by an exact preimage rule, which is what lets marker retrofit and no-body-rewrite hold at the same time.
- Should `z_archive/` be excluded permanently, or retrofitted once so historical search behaves consistently? Excluded for now on diff-noise grounds, which is a reversible decision.
- Which active documents actually hold valid, empty, malformed, aliased, generic, duplicate or oversized trigger lists? The counts in section 2 are corpus-wide. The per-variant inventory is task T011 and does not exist yet.
<!-- /ANCHOR:questions -->

---

## 13. CONVENTION CONTRACT

The convention has six parts. Each part is a rule the retrofit enforces and `validate.sh` re-checks,
not advice.

### 13.1 Canonical frontmatter keys and accepted aliases

Canonical keys, their value shape and whether the retrofit may create a missing one:

| Key | Shape | Missing-key behavior |
|-----|-------|----------------------|
| `title` | scalar string | Created from the first H1 when one exists, else reported |
| `description` | scalar string | Reported, never synthesized from body prose |
| `trigger_phrases` | list of strings | Created as a valid empty list and reported. Never populated by a fallback |
| `importance_tier` | scalar string | Reported |
| `contextType` | scalar string | Reported |

Accepted aliases:

| Alias | Canonical | Retrofit behavior |
|-------|-----------|-------------------|
| `triggerPhrases` | `trigger_phrases` | Recognized on read, rewritten to the canonical spelling and counted in the alias diagnostic bucket |

One spelling is written. Both spellings are read. An alias hit is always reported, so the corpus can
be shown to converge on the canonical key rather than merely tolerating two.

### 13.2 Frontmatter variant taxonomy

Every in-scope document resolves to exactly one label. This is the enumeration REQ-011 requires the
retrofit to classify against before it processes anything.

| Variant | Definition | Handling |
|---------|------------|----------|
| `missing` | No frontmatter block at all | Insert a conforming block, report the path |
| `malformed-or-unclosed` | An opening fence with no valid closing fence, or a block that does not parse | Skip, report, never partially rewrite |
| `non-yaml` | A block that parses as something other than a YAML mapping | Skip, report |
| `wrong-list-type` | `trigger_phrases` present but scalar, mapping or null | Skip, report the observed type |
| `non-string-members` | A list whose members are not all strings | Skip, report the offending index |
| `valid-empty` | A well-formed empty list | Accept as conforming, report the count. This is not an error |
| `duplicate` | The same normalized phrase appears twice in one document | Deduplicate deterministically, report the removal |
| `oversized` | A phrase or block exceeding the documented budget | Skip, report the measured size. Never truncate |

A well-formed populated list is conforming and carries the `valid-empty` label, since that label
names the accept-and-count handling rather than the list's length; the retrofit sub-counts empty and
populated lists so no artifact claims a populated list was empty.

A document matching no label stops the run. Fail closed beats a silent default.

### 13.3 Trigger allowlist and generic negatives

A `trigger_phrases` member must be author-controlled and distinctive. The allowlist admits
user-searchable domain terms, exact decisions, API and symbol names, failure symptoms and
packet-specific multi-word concepts.

The following are rejected and reported, never written:

| Negative class | Examples |
|----------------|----------|
| Generic workflow words | `session`, `context`, `memory`, `summary`, `feature`, `update`, `file`, `document`, `section` |
| Stop-word-only phrases | A phrase whose every token is a stop word |
| Whole prose sentences | A phrase carrying sentence punctuation or exceeding the phrase budget |
| Body-derived fallbacks | Any phrase produced by a body extractor rather than by an author |

The frontmatter editor's folder-token and `session` / `context` fallbacks are in this class. They may
continue to exist as editor behavior, but a fallback-produced phrase must never silently define index
input. The retrofit reports every one it finds instead of adopting it.

### 13.4 Anchor grammar

The exact pair, on its own line, with no leading or trailing content on that line:

```text
<!-- ANCHOR:section-id -->
<!-- /ANCHOR:section-id -->
```

Rules:

- Ordinary section ids are lower-kebab: lowercase ASCII letters, digits and hyphens.
- Typed ids are the one exception and may carry an uppercase type prefix, as in `DECISION-pipeline-003`.
- An id is stable once written. Supersede it, do not renumber it.
- An id appears at most once per document.
- Addresses are one-based line numbers.
- Unmatched openers, orphan closers and duplicated ids are diagnostics. Runtime retrieval may stay
  fail-soft, but the retrofit and the validator do not.

### 13.5 One fact per line

One fact per line applies to **newly authored** structured sections only: new decision bullets, new
acceptance rows, new structured evidence blocks and continuity metadata. It does not apply to any
prose that already exists. Reflowing legacy prose is out of scope and is forbidden by section 15.

### 13.6 Naming and path rules

- Packet directories are `NNN-short-descriptive-name`: three digits, a hyphen, then lowercase
  hyphen-separated words. This is what makes a path a deterministic grep input.
- The document basename carries the document type and stays a separate field from the packet name.
  `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` are types, not titles.
- Legacy naming exceptions are reported by path. This retrofit does not rename them, because a rename
  during a 22,127-file frontmatter pass makes the diff unreviewable.

### 13.7 Resolved before the first corpus write

The convention document surfaced seven points sections 13.1 to 13.6 left open. Each is decided here
so the retrofit and the validator classify the same way; none changes a decision above.

| Point | Resolution |
|-------|------------|
| Oversized budget | A phrase over 120 characters, the trigger index's existing phrase limit, or a `trigger_phrases` list over 20 members. The live corpus peaks at 100 characters and 14 members, so the label exists for fail-closed handling rather than for current documents |
| Keys outside the canonical five | Preserved verbatim in their original order, never reordered or stripped. `_memory` belongs to the continuity writer and the retrofit does not read it |
| Duplicate | Equal after the trigger index's normalization. The first occurrence in document order is kept and each removal is reported |
| Member count | No minimum or maximum beyond the 20-member budget. The skill-document rule of three to eight phrases does not govern this corpus |
| Typed anchor ids | An uppercase ASCII token of letters and digits starting with a letter, a hyphen, then a lower-kebab remainder. Prefixes are not enumerated |
| Severity | Staged by category. `error` for the seven non-conforming variant labels and for `preimage-mismatch`, which the retrofit resolves or the run fails on; `warn` for `generic-trigger`, `anchor-unmatched`, `anchor-duplicate`, `alias-hit` and `naming-exception`, which this phase reports but never rewrites. A fleet scan before the retrofit put 319 of 2,799 packets in error under a flat mapping, most on the report-only classes, so an always-on error there would fail unrelated packets' completion gates permanently. Escalation is a one-line registry change once their owners fix them. `valid-empty` is not a finding |
| Fallback phrases | The frontmatter editor's folder-token and `session` / `context` fallbacks are `generic-trigger` rows whose reason names the fallback, in both the validator and the retrofit; the retrofit never adopts one |
| Whole prose sentence | A phrase carrying sentence punctuation or more than 10 tokens. The token budget is separate from the 120-character budget so a long single term is reported as `oversized`, never as `generic-trigger` |
| Generic phrases already declared | Reported as `generic-trigger` and left in place. The handler is report-only, so the corpus can carry author-declared generic phrases after the retrofit; the guarantee is that no fallback-produced phrase is ever written, not that the corpus is free of generic phrases |
| In-scope total | The frozen manifest counts 22,094 documents, not the 22,127 estimated here: 184 documents under hidden backup directories are unreachable by the section 14 recipes and are excluded with a recorded reason |
| Phrase-count baseline | The measure for REQ-006 is the count of unique normalized `trigger_phrases` members across the in-scope corpus, recorded by the retrofit's own enumerate stage before processing. The retrofit adds no phrase and removes only duplicates, so this count is invariant by construction; the trigger index's own total can move independently because its corpus also covers `.opencode/skills` and now excludes tooling fixture trees |
| Partial blocks on canonical documents | A canonical document (`spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`) with no frontmatter block is reported as `missing` and refused, not given the minimal block. The frontmatter rule treats a present block with empty required scalars as errors where an absent block is a continuity warning, so the minimal block moved 26 packets from pass or warn to fail. An authored block is the only conforming fix. A missing key on an existing block is still added |
| Unparseable results | Any edit that would leave a block unparseable, such as appending a block key to a flow-mapping block, is refused and reported; eight compiled policy cards fall in this class |
| Scalar quoting | Preserved as written. The retrofit rewrites only the alias key line it renames, the keys it creates and the members it removes as duplicates |

---

## 14. RIPGREP RECIPES THE CONVENTION MUST SERVE

The convention exists to make these commands precise. Each is written with explicit flags and no
dependence on ambient configuration, and each returns exit 0 on match, exit 1 on no match and exit 2
or higher on an execution or configuration error.

Structured search, for line-addressable evidence:

```text
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Path search, for a bounded candidate list:

```text
rg --no-config --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Count, as its own recipe rather than a flag added to either of the above:

```text
rg --no-config --fixed-strings --ignore-case --count \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Anchor and context search reuses the structured recipe and adds a bounded context option in the
caller, labelling the result as anchor or body evidence. `--multiline` stays opt-in because
one-fact-per-line structured evidence does not need it and it costs memory and time.

Constraints the convention inherits:

- `--json` cannot be combined with `--files`, `--files-with-matches`, `--count` or `--count-matches`.
  Parse match records in the wrapper instead of mixing output modes.
- `--no-config` is mandatory. `.gitignore`, `.ignore`, `.rgignore` and `RIPGREP_CONFIG_PATH` would
  otherwise inject filtering a caller never wrote.
- Positive and negative globs are explicit, and later globs override earlier ones.
- `-w` is not equivalent to a substring match and must not be used as a parity flag.
- `--sort=path` is path ordering, not relevance. Ranking is the caller's job, over evidence field,
  then normalized match class, then relative path and one-based line.

---

## 15. BODY PRESERVATION INVARIANT

This section resolves the tension between retrofitting markers and not rewriting bodies. Both hold,
because the preimage excludes exactly the lines the retrofit is allowed to touch.

**Preimage definition.** Before processing a document, the retrofit records `SHA-256` over the body
region. The body region is the file content after the closing fence of the frontmatter block, with
every line that is wholly an anchor marker removed, and with no other normalization.

**Invariant.** After processing, recomputing the body region hash over the same definition yields the
identical digest. A mismatch fails the document and the run.

**Diff rule.** A retrofitted document's diff may contain only two kinds of changed line:

1. A line inside the frontmatter block.
2. A whole-line addition or removal that matches the anchor grammar in section 13.4.

Any other changed line is a defect. This is checkable mechanically, so it is the gate rather than a
reviewer's judgment.

**Consequence.** Marker insertion, marker repair and frontmatter normalization are all permitted.
Reflow, rewording, whitespace normalization inside prose, list restructuring and heading edits are
all forbidden, including where they would improve the document.

---

## 16. RESEARCH SOURCE

The amendments in sections 13 through 15, the variant taxonomy, the trigger negatives and the
ripgrep constraints derive from specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md
