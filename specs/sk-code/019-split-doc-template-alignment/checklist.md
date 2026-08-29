---
title: "Checklist: sk-code Split-Doc Template Alignment"
description: "QA verification checklist for the sk-code split-doc conformance, with evidence."
trigger_phrases:
  - "019 checklist sk-code split doc"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/019-split-doc-template-alignment"
    last_updated_at: "2026-08-19T08:29:06Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added mobile-cli app-doc restructure + parent hub freshness increment (verified)"
    next_safe_action: "Commit + push (main + v4)"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: sk-code Split-Doc Template Alignment

---

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a command + result. Deterministic checkers only.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Templates + package_skill.py read as authority [File: `create-skill/scripts/package_skill.py`]
- [x] 027 collision scope confirmed (no active fight) [Source: `027-catalog-naming-convention merged; did not cover ref/asset split files`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Renames are snake_case, path-segment only; content preserved (frontmatter/OVERVIEW added, sections renumbered) [Test: `hyphenated-filename scan = 0`]
- [x] 5-field frontmatter + 4-part version on every conformed file [Test: `validate_document.py 163/163 VALID`]
- [x] Comment hygiene: no spec paths/ids embedded in doc content [Test: `pre-commit comment-hygiene gate pass`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] validate_document.py 0 issues on all 163 sk-code ref+asset files [Test: `validate_document.py 163/163 at 0 issues`]
- [x] 0 hyphenated split filenames remaining [Test: `hyphen scan = 0`]
- [x] 0 broken .md links to/among the renamed files — every conformed file and its referrers resolve [Test: `broken-link scan = 0 among renamed files`]
- [x] 2 pre-existing non-navigational artifacts hub-wide are out of this packet's scope: an illustrative `005-example.com` example path (`webflow_constraints.md`) and a bare filename quoted in changelog prose (`changelog/v3.3.0.0.md`) — both predate this work, neither is a rename referrer [Source: `git blame 78a505441a, b0fcf37600 — both predate this work`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] All in-scope files/packets processed; no partial batch left uncommitted [Commit: `36bba13758`]
- [x] Every verification gate passed before the batch was committed [Test: `per-batch validate_document 0`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] Documentation-only; no executable/tooling changes; no new capabilities [Source: `diff contains no runtime/tooling files`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] Batch commits carry evidence in messages; spec/plan/tasks/summary consistent [Commit: `36bba13758`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] Whole-hub staging captures cross-surface reference-link fixes (process fix after early per-surface staging dropped 2) [Commit: `babefb0586`]
- [x] Zero edits under system-deep-loop/deep-alignment [Test: `git diff --name-only | grep deep-alignment = 0`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| sk-code ref+asset files conformed | 163 | 163/163 at 0 issues |
| Hyphenated split filenames remaining | 0 | 0 |
| Broken .md links to/among renamed files | 0 | 0 (2 pre-existing non-nav artifacts hub-wide out of scope) |
| Batches committed + pushed to v4 | 11 | 11/11 |

**Verification Date**: 2026-07-12
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:increment-mobile-cli -->
## Increment: sk-code-mobile-cli Surface (2026-08-19)
- [x] 10 hand-authored ref/asset files conformed; 3 `workflow-*.md` symlinks correctly excluded [Test: `structural sweep 10/10 PASS`]
- [x] `## 1. OVERVIEW` is the first numbered section on every file [Test: `first-`## N.`-heading == "## 1. OVERVIEW" 10/10`]
- [x] 5-field frontmatter + 4-part version on every file (triad added to the 7 references) [Test: `trigger_phrases/importance_tier/contextType present 10/10; counts 3–8`]
- [x] Content preserved verbatim; only intro compressed + headings renumbered [Test: `git diff non-heading body deletions = 0`]
- [x] 22 cross-file `§N` references bumped +1 for the OVERVIEW shift; all resolve to the intended target section [Test: `ref→section-title resolver 22/22, 0 dangling`]
- [x] `SKILL.md §N` (not realigned) and intra-file refs left correct [Test: `SKILL.md §5 unchanged; intra-refs verified`]
- [x] No renames → leaf-manifest fresh, no in-hub reference churn [Test: `generate-leaf-manifest.cjs --check = OK`]
- [x] `validate_document.py` 10/10 VALID [Test: `validate_document 10 passed, 0 failed`]
- [x] Documentation-only; no `apps/`/`packages/`/tooling changes [Source: `diff scoped to sk-code-mobile-cli/{references,assets}`]
<!-- /ANCHOR:increment-mobile-cli -->

---

<!-- ANCHOR:increment-restructure -->
## Increment 2: App-Doc Restructure + Parent Hub Freshness (2026-08-19)
- [x] `app-guide/` dissolved into 6 purpose-named folders; contents moved verbatim [Test: `find references shows operations/ release/ setup/ standards/ design-reference/ quality/`]
- [x] 2 single-source pointer files removed; catalog+playbook stay canonical at app root [Test: `feature-catalog.md/manual-testing-playbook.md refs in leaf-manifest = 0`]
- [x] 4 relocation-broken sibling cross-links repaired to subfolder-relative paths [Test: `broken-link scan = 10/10 resolve; 1 pre-existing ARCHITECTURE.md out of scope`]
- [x] `---` dividers between numbered sections across relocated app docs + asset checklists [Test: `general_h2_separator issues = 0 across all authored refs+assets`]
- [x] SKILL.md §2 rewritten to 6 folders, pointer links dropped, version 1.0.0.0→1.1.0.0 [Test: `changelog/v1.1.0.0.md present; validate_document SKILL non-authoritative flags pre-existing on HEAD`]
- [x] README gains "Mobile CLI App Repository" subsection locating the app repo [Test: `validate_document README = 0 issues`]
- [x] Parent `leaf-manifest.json` regenerated for relocated leaves + pointer removal [Test: `generate-leaf-manifest.cjs --check = OK; 0 app-guide paths`]
- [x] Parent `description.json` + `graph-metadata.json` de-staled with mobile-cli signals; causal_summary 2→3 surfaces [Test: `ci-skill-root-metadata sk-code = OK [H]; Jaccard NOTE cleared`]
- [x] No app/tooling change; routing behavior unchanged [Source: `diff scoped to sk-code/ metadata + sk-code-mobile-cli/ docs; regenerate-skill-derived unchanged`]
- [x] Validator divider-gap root-caused (validate_document h2DividerRequired not set for ref/asset types) [Source: `validate_document.py:553`]
<!-- /ANCHOR:increment-restructure -->
