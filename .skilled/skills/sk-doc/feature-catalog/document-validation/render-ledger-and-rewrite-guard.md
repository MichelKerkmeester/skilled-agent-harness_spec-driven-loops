---
title: "Render Ledger And Rewrite Guard"
description: "Records the render findings a doc may keep and the docs code depends on, and proves before commit that a form-only rewrite kept every claim."
trigger_phrases:
  - "render ledger"
  - "render-known-debt.json"
  - "doc rewrite guard"
  - "render_exempt.py check"
version: 2.9.3.0
---

# Render Ledger And Rewrite Guard (render_exempt.py, doc-rewrite-guard.py)

## 1. OVERVIEW

Records the render findings a doc may keep and the docs code depends on, and proves before commit that a form-only rewrite kept every claim.

The ledger is `sk-create-skill/scripts/render-known-debt.json`, and `render_exempt.py` is its only reader. The guard, `doc-rewrite-guard.py`, compares the changed docs with a base ref and refuses a rewrite that changed what a doc says.

---

## 2. HOW IT WORKS

The ledger holds three records. `debt` lists the render findings a skill may keep, as a count and the finding types; a ratchet test lets it shrink and never grow. `exempt` names docs whose exact text code reads or generates, each with that consumer file; an entry counts only while the consumer exists and names the doc. `pinned` names docs whose strings a code check pins; their render checks still run, and the guard refuses any edit to them. `render_exempt.py --check` prints each record's count and every entry that does not hold, and `--scan-pinned` lists literal reads that may need a pinned entry.

`doc-rewrite-guard.py --base <ref> [paths]` reports `HARD` findings, which set exit code 1: changed frontmatter beyond `version`, an edited or missing fenced block, a dropped citation, a cited anchor or section that was removed or retitled, and any change to an exempt or pinned doc. A cited path resolves from the citing doc's folder or the repository root, and a bare name only to a sibling or the one same-named doc in its skill. A citation renumbered together with its section is not reported. Lost lines and a changed intro are `ADVISORY` and never change the exit code.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/render_exempt.py` | Script | Loads and checks the `exempt` and `pinned` records |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` | Data | The `debt`, `exempt` and `pinned` records |
| `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` | Script | The `HARD` and `ADVISORY` checks against `--base` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test_render_exempt.py` | Unit | Entry rules for `exempt` and `pinned` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` | Node test | `debt` can only shrink |
| `.skilled/skills/sk-doc/scripts/tests/test_doc_rewrite_guard.py` | Unit | Each `HARD` class, citation resolution and the renumbered-section case |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/render-ledger-and-rewrite-guard.md`

Related references:
- [render-checks.md](render-checks.md) - the checks whose findings the ledger records
