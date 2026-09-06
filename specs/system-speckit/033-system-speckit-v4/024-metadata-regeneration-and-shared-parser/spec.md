---
title: "Feature Specification: metadata-regeneration-and-parser-edges"
description: "Run the identity-aware metadata writer over every drifted packet that is clean in git, give system-deep-loop and sk-doc a dependency edge to the spec-kit shared package, and adopt the shared frontmatter parser in their JavaScript callers."
trigger_phrases:
  - "metadata regeneration pass"
  - "drift census"
  - "shared package dependency edge"
  - "sk-doc scripts manifest"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: metadata-regeneration-and-parser-edges

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 24 of 24 |
| **Predecessor** | `../023-trigger-index-root-and-drift-fixes/spec.md` |
| **Successor** | None |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 056 fixed the graph-metadata writer and reported the drift it had left behind: 114 packets whose declared children disagreed with disk and 13 track roots. It also left the shared frontmatter parser unadopted in system-deep-loop and sk-doc because neither had a dependency edge to the spec-kit shared package. Both items were operator decisions and both were approved.

**Purpose:** regenerate every drifted packet that is clean in git, add the missing dependency edges in each package root, and adopt the shared parser where the edge now exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A drift census over `specs/**/graph-metadata.json` marking each folder clean or dirty in git.
- `generate-description.js` and `backfill-graph-metadata.js` over every clean drifted packet; the dirty packet skipped and reported.
- `@spec-kit/shared` as a `file:` dependency in `system-deep-loop/runtime/package.json` and a new manifest for sk-doc's scripts, installed in those package roots only.
- Adoption of the shared parser in deep-loop's and sk-doc's JavaScript callers; Python parsers listed, not rewritten.
- A deep-loop skill-root manifest so the mode packets' scripts outside `runtime/` resolve the shared package, and adoption at the remaining deep-loop, spec-kit-internal and advisor sites.

### Out of Scope
- Track-root `graph-metadata.json` files: no generator owns them; the sweep keeps reporting them.
- Any install at the repository root.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Every drifted packet clean in git is regenerated; dirty packets are skipped and named | P1 |
| REQ-002 | A sample of regenerated packets validates strict, and any failure predates the regeneration | P1 |
| REQ-003 | Both package roots resolve `@spec-kit/shared/frontmatter/parse-frontmatter.js` from their own directory | P1 |
| REQ-004 | Every JavaScript frontmatter parser in the two skills uses the shared one; the remaining parsers are listed with a reason | P2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The census after regeneration shows only packets that are dirty or that declare children no longer on disk.
- Import probes resolve the shared parser from each adopting directory; the adopters' tests pass; deep-loop typechecks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Regeneration rewrites metadata in a packet another session is editing | Folders with any uncommitted change are skipped; the one such packet is named |
| A `file:` dependency breaks in a checkout where the sibling skill is absent | Both skills ship in this repository; the edge is a relative path inside it |
| The ignore rule swallows the new manifests | Manifests and lockfiles are force-tracked, as the CLI's was |
<!-- /ANCHOR:risks -->
