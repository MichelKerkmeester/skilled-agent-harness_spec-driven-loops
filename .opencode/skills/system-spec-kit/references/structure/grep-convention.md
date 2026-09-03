---
title: Grep Convention for Spec Documents
description: The frontmatter, anchor, naming and body-preservation rules that make active spec documents precise to search with the ripgrep recipes.
trigger_phrases:
  - "grep convention for spec docs"
  - "frontmatter variant taxonomy"
  - "body preservation invariant"
  - "anchor marker grammar"
  - "trigger phrase generic negatives"
  - "canonical frontmatter keys"
  - "retrofit diagnostics schema"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Grep Convention for Spec Documents

What an active spec document must look like so a single ripgrep invocation reaches it without a ranking layer compensating for the corpus.

---

## 1. OVERVIEW

### Core Principle

Once retrieval is ripgrep, retrieval quality is a property of the corpus rather than of a ranking pipeline. Every rule below removes one source of variation that a literal search would otherwise absorb.

### Boundary With the Retrieval Contract

Two documents, one subject, no duplicated content.

| Document | What it owns |
|----------|--------------|
| [retrieval-conventions.md](../retrieval/retrieval-conventions.md) | The invocation contract. Recipes, scoping by track and packet, exit status, the caller-side ranking tuple, ambient configuration and the flags that are not substitutes |
| This document | What the corpus must look like for those recipes to be precise. Frontmatter keys, the variant taxonomy, trigger phrase content, anchor grammar, naming and the body-preservation invariant |

Section 8 carries three commands verbatim, because the convention is required to hold them next to the rules they depend on. For ranking, scoping and the output-mode hazard, read the retrieval contract instead.

### Every Rule Has Two Enforcers

Nothing here is advice. Each rule is applied once across the corpus by the retrofit at `.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs`, then re-checked on every run by the validator rule at `.opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh`, which `validate.sh` invokes. Templates under `.opencode/skills/system-spec-kit/templates/` produce conforming documents with no manual step, so a new document cannot drift back.

### Scope

| In scope | Out of scope |
|----------|--------------|
| Active spec documents under `specs/` | `z_archive/`, which nothing retrieves against |
| Frontmatter, anchor marker lines and naming | Document bodies, frozen byte-exactly by Section 9 |
| | Non-spec markdown. Skill `SKILL.md`, references and READMEs keep their own contracts |

---

## 2. CANONICAL FRONTMATTER KEYS

### The Five Canonical Keys

One spelling is written. The retrofit may create a missing key only where the table permits it, and it reports every key it could not resolve.

| Key | Shape | Missing-key behavior |
|-----|-------|----------------------|
| `title` | scalar string | Created from the first H1 when one exists, else reported |
| `description` | scalar string | Reported, never synthesized from body prose |
| `trigger_phrases` | list of strings | Created as a valid empty list and reported. Never populated by a fallback |
| `importance_tier` | scalar string | Reported |
| `contextType` | scalar string | Reported |

### Accepted Aliases

| Alias | Canonical | Retrofit behavior |
|-------|-----------|-------------------|
| `triggerPhrases` | `trigger_phrases` | Recognized on read, rewritten to the canonical spelling and counted in the alias diagnostic bucket |

Both spellings are read. Only the canonical spelling is written. An alias hit is always reported as `alias-hit`, so the corpus can be shown to converge on one key rather than merely tolerating two.

### Keys Outside the Canonical Five

Active documents also carry `_memory`, `parent`, `status`, `completion_pct` and `created`. Every key outside the canonical five is preserved verbatim, in its original position. The retrofit never reorders a block and never strips a key it does not recognize.

`_memory` belongs to the continuity writer. The retrofit does not read it, which is what keeps this pass and the continuity writer from contending over the same field.

### What the Retrofit Is Allowed to Write

Scalar quoting is preserved as written. A document that quotes its scalars keeps its quotes, and one that does not keeps that too. The retrofit rewrites exactly three things:

1. The alias key line it renames, and only that line.
2. A key it creates, where the missing-key column above permits creation.
3. A list member it removes as a duplicate under Section 3.

Everything else in the block survives byte-for-byte. The convention fixes value shape, not typography, so a mechanical pass over 22,000 documents does not turn a quoting preference into a diff.

### Worked Example: A Conforming Frontmatter Block

```yaml
---
title: "Feature Specification: Phase 4: grep-convention-doc-retrofit"
description: "Define a grep-optimized spec-doc convention, enforce it in templates and validate.sh, and retrofit it across the active spec documents."
trigger_phrases:
  - "grep convention"
  - "spec doc convention"
  - "doc retrofit"
  - "greppable spec docs"
  - "frontmatter normalization"
importance_tier: "important"
contextType: "implementation"
---
```

The block opens on line 1, closes on its own fence, holds all five canonical keys, spells the trigger key `trigger_phrases` and carries a list whose members are all strings. Each phrase is author-chosen and distinctive under Section 4.

---

## 3. FRONTMATTER VARIANT TAXONOMY

Every in-scope document resolves to exactly one label. The retrofit classifies the whole in-scope set against this enumeration before it processes any document.

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

Two consequences follow from the table and both are binding:

- A document matching no label stops the run. Fail closed beats a silent default, so an unclassified document is never treated as skippable.
- `valid-empty` is a conforming state. A well-formed empty list is a distinct variant with its own handling, not malformed input, and the retrofit never populates it to inflate the count.

### What "Normalized" Means for `duplicate`

Two phrases are the same phrase when `normalizeTriggerText` from `.opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs` maps them to the same string. That function lowercases, collapses every run of non-alphanumeric characters to one space, collapses whitespace and trims. The retrofit borrows the index's own comparison rather than inventing a second one, so a pair the index would collapse is the pair the retrofit removes.

The first occurrence in document order is kept. Every removal is reported as a `duplicate` row carrying the removed member.

### The `oversized` Budget

| Measure | Limit | Source |
|---------|-------|--------|
| One phrase | 120 characters | `MAX_PHRASE_LENGTH` in `scripts/retrieval/lib/normalize.mjs`, the value the trigger index already applies |
| One `trigger_phrases` list | 20 members | Declared for this convention |

The live corpus tops out at 100 characters and 14 members, so no current document is `oversized`. The label exists for fail-closed handling of what arrives later, not to flag anything in the corpus today.

One difference matters. The index truncates an over-length phrase and reports it. The retrofit must not: `oversized` skips the document and reports the measured size. Sharing the constant does not mean sharing the handling.

---

## 4. TRIGGER PHRASE RULES

### What May Be Written

A `trigger_phrases` member must be author-controlled and distinctive. The allowlist admits:

- User-searchable domain terms
- Exact decisions
- API and symbol names
- Failure symptoms
- Packet-specific multi-word concepts

### What Is Rejected

The following are rejected and reported as `generic-trigger`, never written.

| Negative class | Examples |
|----------------|----------|
| Generic workflow words | `session`, `context`, `memory`, `summary`, `feature`, `update`, `file`, `document`, `section` |
| Stop-word-only phrases | A phrase whose every token is a stop word |
| Whole prose sentences | A phrase carrying sentence punctuation, or one running past 10 tokens |
| Body-derived fallbacks | Any phrase produced by a body extractor rather than by an author |

The 10-token sentence budget is deliberately not the 120-character budget from Section 3. They catch different defects, and one label must not absorb the other: a long single term is `oversized`, while a short sentence is `generic-trigger`. Folding them together would file each under the other's name.

### How Many Phrases

No minimum, and no maximum below the 20-member budget in Section 3. An author who has one distinctive phrase writes one. An author who has none writes a valid empty list, which Section 3 accepts.

The three-to-eight range in the sk-doc frontmatter contract governs skill references and assets. It does not reach this corpus, and applying it here would force authors to pad.

### The Fallback Rule

The frontmatter editor's folder-token fallback and its `session` and `context` fallbacks belong to the last class. They may continue to exist as editor behavior. A fallback-produced phrase must never silently define index input. The retrofit reports every one it finds instead of adopting it, which is why the field stays worth searching.

The retrieval contract states the same include and warn lists from the caller's side in [retrieval-conventions.md](../retrieval/retrieval-conventions.md) Section 8. This section is the authoring rule the retrofit enforces.

---

## 5. ANCHOR GRAMMAR

### The Exact Pair

Each marker sits on its own line with no leading or trailing content on that line.

```text
<!-- ANCHOR:section-id -->
<!-- /ANCHOR:section-id -->
```

### Rules

- Ordinary section ids are lower-kebab: lowercase ASCII letters, digits and hyphens.
- Typed ids are the one exception. A typed id is an uppercase ASCII token of letters and digits starting with a letter, then a hyphen, then a lower-kebab remainder, as in `DECISION-pipeline-003`. The grammar is fixed. The set of type prefixes is not enumerated, so a packet may introduce one that conforms.
- An id is stable once written. Supersede it, do not renumber it.
- An id appears at most once per document.
- Addresses are one-based line numbers.
- Unmatched openers, orphan closers and duplicated ids are diagnostics. Runtime retrieval may stay fail-soft. The retrofit and the validator do not.

That last rule is the one that surprises people. A marker problem is reported as `anchor-unmatched` or `anchor-duplicate` and left alone. It is never silently repaired, because a silent repair would move a line address that some other document already cites.

### Worked Example: A Conforming Anchor Pair

```markdown
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Draft |
<!-- /ANCHOR:metadata -->
```

The opener and closer carry the same lower-kebab id, each occupies a whole line, the id appears once in the document and the enclosed lines are addressable by one-based line number.

### Anchors In Skill Documentation

This convention governs `specs/` documents. Skill documentation, including the file you are reading, does not use anchor navigation comments at all, per the sk-doc document type rules. The markers above appear here inside fenced blocks as examples, never as live navigation.

---

## 6. ONE FACT PER LINE

One fact per line applies to newly authored structured sections only:

- New decision bullets
- New acceptance rows
- New structured evidence blocks
- Continuity metadata

It does not apply to any prose that already exists. Reflowing legacy prose is out of scope and forbidden by Section 9. The rule earns its place because one-fact-per-line structured evidence is what lets the recipes stay single-line, and `--multiline` stay opt-in.

---

## 7. NAMING AND PATH RULES

- Packet directories are `NNN-short-descriptive-name`: three digits, a hyphen, then lowercase hyphen-separated words. This is what makes a path a deterministic grep input, and it is what the positional scoping in the retrieval contract depends on.
- The document basename carries the document type and stays a separate field from the packet name. `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` are types, not titles.
- Legacy naming exceptions are reported by path as `naming-exception`. This retrofit does not rename them, because a rename during a large frontmatter pass makes the diff unreviewable.

Placement and level requirements for a packet live in [folder-structure.md](folder-structure.md). Phase parent and child folder grammar lives in [phase-definitions.md](phase-definitions.md). This section adds nothing to either. It states which parts of them the search path depends on.

---

## 8. THE RIPGREP RECIPES THIS CONVENTION SERVES

The convention exists to make these commands precise. Each is written with explicit flags and no dependence on ambient configuration.

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

### Exit Mapping

Read on every invocation. Treating a non-zero exit as one failure class conflates a clean no-hit with a broken command.

| Exit | Meaning | Caller behavior |
|------|---------|-----------------|
| `0` | At least one match | Parse the output for the requested mode |
| `1` | No match | A valid empty result, never an error |
| `2` or higher | Execution or configuration error | Abort and surface the stderr text |

### Constraints the Convention Inherits

- `--json` cannot be combined with `--files`, `--files-with-matches`, `--count` or `--count-matches`. Parse match records in the wrapper instead of mixing output modes.
- `--no-config` is mandatory. `.gitignore`, `.ignore`, `.rgignore` and `RIPGREP_CONFIG_PATH` would otherwise inject filtering a caller never wrote.
- Positive and negative globs are explicit, and later globs override earlier ones.
- `-w` is not equivalent to a substring match and must not be used as a parity flag.
- `--sort=path` is path ordering, not relevance. Ranking is the caller's job, over evidence field, then normalized match class, then relative path and one-based line.

Anchor and context search reuses the structured recipe and adds a bounded context option in the caller, labelling each result as anchor or body evidence. `--multiline` stays opt-in, because one-fact-per-line structured evidence does not need it and it costs memory and time.

The full recipe set, the packet-scoping table, the observed exit worked example and the ranking tuple live in [retrieval-conventions.md](../retrieval/retrieval-conventions.md).

---

## 9. BODY PRESERVATION INVARIANT

This section resolves the tension between retrofitting markers and not rewriting bodies. Both hold, because the preimage excludes exactly the lines the retrofit is allowed to touch.

### Preimage Definition

> Before processing a document, the retrofit records `SHA-256` over the body region. The body region is the file content after the closing fence of the frontmatter block, with every line that is wholly an anchor marker removed, and with no other normalization.

### Invariant

After processing, recomputing the body region hash over the same definition yields the identical digest. A mismatch fails the document and the run, and is reported as `preimage-mismatch`.

### Diff Rule

A retrofitted document's diff may contain only two kinds of changed line:

1. A line inside the frontmatter block.
2. A whole-line addition or removal that matches the anchor grammar in Section 5.

Any other changed line is a defect. This is checkable mechanically, so it is the gate rather than a reviewer's judgment.

### Consequence

Marker insertion, marker repair and frontmatter normalization are all permitted. Reflow, rewording, whitespace normalization inside prose, list restructuring and heading edits are all forbidden, including where they would improve the document.

---

## 10. DIAGNOSTICS

### Row Schema

One row per skipped or warned path. The retrofit report and the validator rule emit the same shape, so the two are comparable without translation.

| Field | Type | Meaning |
|-------|------|---------|
| `path` | string | Repository-relative path |
| `line` | integer | One-based line number, or `0` when the finding is whole-file |
| `category` | enum | One of the values below |
| `reason` | string | One line, human-readable, no stack trace |
| `rawKey` | string or null | The observed key or value, echoed only when it is safe and bounded |
| `severity` | enum | `error` or `warn`. An `error` fails the run |

### Category Values

The eight variant labels from Section 3:

`missing`, `malformed-or-unclosed`, `non-yaml`, `wrong-list-type`, `non-string-members`, `valid-empty`, `duplicate`, `oversized`

Plus six categories that report a condition the retrofit does not fix:

| Category | Raised by |
|----------|-----------|
| `anchor-unmatched` | An opener with no matching closer, or an orphan closer (Section 5) |
| `anchor-duplicate` | The same id used more than once in one document (Section 5) |
| `alias-hit` | A `triggerPhrases` spelling found and rewritten (Section 2) |
| `generic-trigger` | A rejected phrase from the negative classes (Section 4) |
| `naming-exception` | A packet directory or basename outside the grammar (Section 7) |
| `preimage-mismatch` | A body region digest that changed across processing (Section 9) |

### Severity by Category

| Severity | Categories |
|----------|------------|
| `error` | The seven non-conforming variant labels: `missing`, `malformed-or-unclosed`, `non-yaml`, `wrong-list-type`, `non-string-members`, `duplicate`, `oversized`. Plus `anchor-unmatched`, `anchor-duplicate`, `generic-trigger` and `preimage-mismatch` |
| `warn` | `alias-hit` and `naming-exception` |
| Not a finding | `valid-empty`. It is a conforming state, counted in the inventory and never emitted as a diagnostic row |

The split follows what a human still has to decide. An `alias-hit` is already fixed by the time it is reported, and a `naming-exception` is deliberately left unrenamed, so neither should fail a run. Everything else names a document the convention cannot vouch for. `preimage-mismatch` fails the run outright under Section 9, not merely the document.

---

## 11. WHERE THE CONVENTION IS SILENT

Two things stay open, and an implementer should treat them as questions rather than as gaps to fill by guessing.

| Open item | What is undefined |
|-----------|-------------------|
| The marker budget | The source specification reports a document that exceeds "the marker budget" without setting a number of anchor markers per document. The phrase and list budgets in Section 3 are separate values and do not cover this one. Until a number exists, no marker-count check can fire |
| Value sets for `importance_tier` and `contextType` | Both are fixed as scalar strings and neither is constrained to a vocabulary, so the validator checks shape and not value. The corpus has drifted accordingly: 10 distinct `importance_tier` values and 35 distinct `contextType` values across the active set, including `high`, `standard`, `useful`, `spec`, `tasks` and `handover` |

One item is open by choice rather than by omission: Section 5 fixes the grammar of a typed anchor id and deliberately leaves the set of type prefixes unenumerated, so a packet can introduce a conforming prefix without amending this document.

The second row is worth a decision rather than a shrug. A field with 35 values in a corpus of 22,000 documents is not a filter anyone can grep against with confidence, and the convention currently gives a retrofit no basis to normalize it.

---

## 12. RELATED RESOURCES

### Reference Files

- [retrieval-conventions.md](../retrieval/retrieval-conventions.md) - The ripgrep invocation contract, scoping, exit status and the caller-side ranking tuple
- [folder-structure.md](folder-structure.md) - Packet placement, naming and level requirements
- [phase-definitions.md](phase-definitions.md) - Phase parent and child folder grammar
- [SKILL.md](../../SKILL.md) - Spec-folder workflow and the validation entry point

### Research

- [research.md](../../../../../specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md) - Section 8 carries the source citations behind the frontmatter, trigger, anchor and naming rules

### Scripts

- `.opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh` - The validator rule that re-checks every rule in this document
- `.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs` - The retrofit that applies the convention and emits the Section 10 diagnostics
- `.opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs` - `normalizeTriggerText` and `MAX_PHRASE_LENGTH`, the shared source of the Section 3 duplicate comparison and phrase budget
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` - The gate that invokes the rule

---
