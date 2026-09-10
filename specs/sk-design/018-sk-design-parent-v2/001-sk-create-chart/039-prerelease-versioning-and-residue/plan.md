---
title: "Implementation Plan: Chart versions move below 1.0, and the cleanup's residue closes"
description: "A scripted renumber of twenty-two changelog files with a v-prefix-only citation rewrite, an anchor reset driven through the shared version engine on an explicit path list, and three surface repairs the corpus cleanup left behind."
trigger_phrases:
  - "implementation plan"
  - "chart renumber approach"
  - "anchor reset plan"
  - "version engine scoped apply"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Chart versions move below 1.0, and the cleanup's residue closes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents and JSON registries |
| **Framework** | The shared frontmatter version engine, the hub doctor check, the corpus checker |
| **Storage** | None |
| **Testing** | The packet's own node test suite plus the repository version gate |

### Overview
The renumber is scripted rather than hand-edited, because twenty-two files carrying cross-citations is where a manual pass drops one. A short script derives the mapping from the directory itself in release order, rewrites titles, version fields and citations, and writes the mapping out so the renames read from the same source. The anchor then moves by hand on `SKILL.md`, because the engine takes the maximum of the frontmatter and the highest changelog, so a downward move has to be seeded or the old number wins. Every child document follows through the engine on an explicit path list.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The anchor rule read at source, not assumed
- [x] The engine's document scope read, so the apply could be bounded to this packet
- [x] Every citation of an old version located before the first edit

### Definition of Done
- [x] All acceptance criteria met
- [x] Corpus check and unit suite pass from the final state
- [x] Hub doctor check reports no failing invariant
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A scripted rewrite over a derived mapping, then a scoped run of the existing version engine.

### Key Components
- **The mapping**: derived from the changelog directory sorted in release order, never hand-typed
- **The citation rewrite**: a single pass with a callback, so a rewritten value cannot be rewritten again
- **The version engine**: owns every child document version, driven on an explicit path list rather than by skill name

### Data Flow
Directory listing produces the mapping. The mapping drives the content rewrite, then the renames, then the anchor. The engine reads the anchor from the renamed changelog and writes each child document. The hub manifest and the retrieval index are regenerated from the resulting disk state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The deletions in phases 36 and 37 are the producer. Everything below observed the files they removed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/leaf-manifest.json` | The hub's declared leaf inventory | Re-minted from disk | `parent-skill-check.cjs` invariants `10b` and `10c` |
| Three manual-test scenarios | Copy, open or read a deleted delivery | Repointed at `assets/templates/` | No `assets/examples` reference survives under the playbook |
| `sk-design/command-metadata.json` | The description the advisor reads | Count corrected | No `26 forms` survives on a live surface |
| Retrieval corpus manifest and trigger index | Name every indexed document path | Regenerated together | Zero old changelog paths, twenty-two new ones |
| Eight historical spec packets | Record what each phase shipped | Not a consumer, deliberately unchanged | Recorded in `spec.md` section 3 |

Required inventories:
- Citations of a chart version: `rg -n 'v[12]\.[0-9]+\.[0-9]+\.[0-9]+' .opencode/skills/sk-design/sk-design-chart`.
- Surfaces naming a deleted path: `rg -ln 'style-reference/cursor|assets/examples|gallery' .opencode specs`.
- Algorithm invariant: only a `v`-prefixed four-part number is this packet's own version. A bare four-part number may belong to another tool and must survive the rewrite untouched.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The packet's checker and applicator suites | `node --test scripts/tests/` |
| Integration | The corpus contract across all twenty-nine forms | `check-corpus.cjs` |
| Structural | Hub invariants, manifest freshness, version conformance | `parent-skill-check.cjs`, `frontmatter-version.mjs verify`, `check-frontmatter-versions.sh` |
| Manual | A trigger-index lookup resolving a renamed document | `lookup-trigger-index.mjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `frontmatter-version.mjs` | Internal | Yellow | Its explicit-path guard refuses the playbook index file, so that one document is set by hand |
| `generate-leaf-manifest.cjs` | Internal | Green | Without it the hub keeps failing two invariants |
| `generate-trigger-index.mjs` | Internal | Green | Without it a lookup resolves paths that no longer exist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any gate in `spec.md` section 5 failing from the final state
- **Procedure**: `git checkout -- .opencode/skills/sk-design .opencode/skills/system-spec-kit/runtime/data`. Every change is a tracked file and no step leaves the working tree, so one command restores the prior state
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read the rules) ──► Residue repair ──┐
                                            ├──► Verify
                           Renumber ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Residue repair, Renumber |
| Residue repair | Setup | Verify |
| Renumber | Setup | Verify |
| Verify | Residue repair, Renumber | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Reading the anchor rule and the engine scope |
| Residue repair | Low | Four surfaces, each with a named check |
| Renumber | Medium | The citation rewrite is where the errors hide |
| Verification | Low | Five gates, all existing |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every touched file is tracked, so git holds the backup
- [ ] Feature flag configured. Not applicable, no runtime path changes
- [ ] Monitoring alerts set. Not applicable

### Rollback Procedure
1. `git checkout -- .opencode/skills/sk-design`
2. `git checkout -- .opencode/skills/system-spec-kit/runtime/data .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures`
3. Re-run `parent-skill-check.cjs` and `check-corpus.cjs` to confirm the prior state returned
4. No stakeholder notice needed, because nothing was published

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
