---
title: "Deterministic diffing"
description: "Deterministic line-level diff with inline word-level highlighting and a move heuristic over canonicalized input."
trigger_phrases:
  - "Deterministic diffing"
  - "line-level document diff"
  - "inline word-level highlighting"
  - "difflib SequenceMatcher diff"
version: 1.0.0.0
---

# Deterministic diffing

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Produces a deterministic line-level diff with inline word-level highlighting and a cheap move heuristic, after canonicalizing both sides (Unicode NFC, newline, trailing-whitespace normalization).

This is the comparison core invoked by both `compare` and `compare-pair` once each side has been extracted to text. Determinism is the contract: identical inputs always yield identical opcodes, which is what makes the report reproducible and safe to review. The heuristics are intentionally cheap — a line-level pass, an inline token pass, and a single move check — so there is no expensive alignment step to tune, and the main behavior a caller notices is an unchanged region collapsing when a run of equal lines is long.

---

## 2. HOW IT WORKS

Before any comparison, both sides are canonicalized: Unicode is normalized to NFC, CRLF and lone CR are converted to LF, and trailing whitespace is stripped per line. This removes cosmetic differences so the diff reflects real content changes.

Line structure comes from Python's `difflib.SequenceMatcher`, which yields the equal/replace/insert/delete opcodes. Within a replaced region, the engine runs a second word-level pass — tokens split on the regex `\s+|\S+` — and renders the changed words inside `<mark>` spans so a caller sees exactly which words changed, not just which lines. Long stretches of identical text stay readable because a run of more than seven equal lines collapses to a single labelled row.

A lightweight move heuristic runs on top: a removed line whose exact text reappears as an added line is counted as a "possible move" rather than an unrelated delete-plus-insert. It is deliberately exact-match only, so it never guesses at near-duplicate reorderings.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | Normalization (NFC, CRLF/CR→LF, trailing-whitespace strip), `difflib.SequenceMatcher` line opcodes, regex word-level inline diff with `<mark>` spans, the >7-equal-line collapse, and the removed→added move heuristic |
| `assets/fixtures/onboarding-before.md`, `assets/fixtures/onboarding-after.md` | Shared | Shipped fixture pair whose full-fidelity run reports +4 −0 ~5 with 12 unchanged lines |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Scenario CMP-001 asserts the deterministic +4 −0 ~5 result and the inline word highlights on the fixtures |

---

## 4. SOURCE METADATA

- Group: COMPARISON ENGINE
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `comparison-engine/deterministic-diffing.md`

Related references:
- [multi-format-extraction.md](multi-format-extraction.md) — produces the normalized text this diff consumes
- [self-contained-report.md](self-contained-report.md) — renders the diff opcodes into unified or side-by-side HTML
