---
title: "Phase 3 plan - how the skill doc alignment gets done"
description: "The approach for bringing seven sk-code-mobile-cli docs to the sk-create-skill v4 templates, deleting the design-reference folder with its dangler repair, and reconciling the README and playbook to post-migration reality. Four ordered workstreams A-D, structure-first then deletion then the large rewrite, framed around template conformance and link integrity rather than runtime tests. Plan only; no code lands from this repo."
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/003-skill-doc-alignment"
    last_updated_at: "2026-08-27T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the four-workstream approach and ordering rationale."
    next_safe_action: "Operator approves; execute A-D in an isolated Public worktree."
    blockers: []
    completion_pct: 0
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-code-mobile-cli skill doc alignment

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Artifact type** | Markdown skill docs (asset checklists, reference docs, README, playbook) |
| **Templates** | `sk-create-skill/assets/skill/skill-asset-template.md`, `skill-reference-template.md`, `skill-readme-template.md` |
| **Storage** | `.opencode/skills/sk-code/sk-code-mobile-cli` in the Public monorepo (`SKILL_DIR`) |
| **Verification** | `scan-skill-references.mjs` (link integrity), `validate_document.py` if present, literal grep for negative controls |

### Overview

Bring seven straggler docs to their v4 templates, delete the obsolete `design-reference/` folder while
repairing its two live `SKILL.md` danglers, and rewrite the README and one playbook line to the
post-migration SvelteKit topology. The work is docs-only, so proof is template conformance and link
integrity, not runtime tests. It runs as four ordered workstreams A through D: pure structure moves first,
the coupled deletion next, the large prose rewrite last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The three `sk-create-skill` v4 templates and the exemplar `token-retint-checklist.md` are read.
- [ ] The current H2 inventory of each target doc is captured so only missing pieces are added.
- [ ] The OQ-1 `dqi-baseline.md` snapshot decision is answered by the operator.

### Definition of Done

- [ ] All eight REQ acceptance criteria in `spec.md` are met, or a P1 deferral is approved.
- [ ] `scan-skill-references.mjs` against `SKILL.md` reports `broken : 0`.
- [ ] No pre-migration path or stack string and none of the three negative controls appear in the README or playbook.
- [ ] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Template-conformance alignment. Each target doc is edited toward its owning `sk-create-skill` v4 template,
using the already-conformant sibling `token-retint-checklist.md` as the asset exemplar. The skill contract
(a read-only surface leaf) is unchanged; only its documentation structure and current-reality accuracy move.

### Key Components

- **Asset checklists** (Workstream A): four files under `SKILL_DIR/assets/` aligned to the asset template.
- **Reference docs** (Workstream B): three files under `SKILL_DIR/references/` aligned to the reference template.
- **Skill index and folder set** (Workstream C): `SKILL.md` folder map and the deleted `design-reference/` tree.
- **Entry docs** (Workstream D): `README.md` and the manual-testing playbook, reconciled and README-template-aligned.

### Data Flow

Read template plus exemplar, capture the target doc's current H2 inventory, apply only the missing template
pieces, then verify with the scan and the negative-control grep. The drift guard in
`skill-reference-integrity.md` is a fixed boundary: its counter-examples are read as constraints, never edited.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The deletion in Workstream C and the rewrite in Workstream D both touch shared link-integrity and
drift-guard policy, so the affected surfaces are inventoried before editing.

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `SKILL_DIR/references/design-reference/` | Obsolete UI teardown and screens folder | Delete (~9 files) | `ls` confirms the folder is gone |
| `SKILL.md:80` | Live bullet naming `references/design-reference/` | Update: remove the bullet | `scan-skill-references.mjs` reports `broken : 0` |
| `SKILL.md:74` | Folder count "six" in the doc-set intro | Update: change to "five" | grep confirms the count reads five |
| `changelog/v0.1.1.0.md:19`, `changelog/v0.1.0.0.md:31` | Historical mentions of `design-reference/` | Unchanged (historical record) | grep confirms both lines are untouched |
| `references/skill-reference-integrity.md` | Drift guard keeping `apps/pi-remote-web`, `style.css`, `App.tsx` as unresolved counter-examples | Unchanged (fixed boundary) | grep confirms the three literals are absent from README and playbook |
| `README.md`, `manual-testing-playbook/manual-testing-playbook.md` | Pre-migration path and stack references | Update to post-migration reality | Literal grep returns zero pre-migration and negative-control strings |

Required inventories:
- Live danglers to `design-reference/`: `rg -n 'design-reference' SKILL.md` before and after the deletion.
- Pre-migration strings in entry docs: `rg -n 'pi-remote-web|pi-remote-relay|style.css|App.tsx|catalog.html|Vite|React' README.md manual-testing-playbook/manual-testing-playbook.md`.
- Negative-control absence: `rg -n 'apps/pi-remote-web|style.css|App.tsx' README.md manual-testing-playbook/manual-testing-playbook.md` must return nothing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Asset-template alignment (safe first)

Bring the four asset checklists to `skill-asset-template.md`. Per file: add `## 1. OVERVIEW` with `### Purpose`
and `### Usage`, trim the intro to 1-2 short sentences with no subsections, add an H1 `Title - Subtitle`, fold
the bespoke unnumbered `## THE GATE` into the numbered ALL-CAPS pattern while keeping the gate content, and add
a final `## N. RELATED RESOURCES`. For `a11y-parity-checklist.md`, also ALL-CAPS the two lowercase H2
parentheticals (`## 1. AT-TREE (role / name / state)` and `## 5. CONTRAST (both themes)`).

### Phase B: Reference-template alignment

Bring the three reference docs to `skill-reference-template.md`. `code-standards.md`: add `## 1. OVERVIEW`
(Purpose, When-to-Use, Core-Principle, Key-Sources), renumber sections, add `## N. REFERENCES AND RELATED
RESOURCES`. `dqi-baseline.md`: same OVERVIEW and REFERENCES, and resolve OQ-1 (refresh the migration-era
snapshot scores or keep the dated disclaimer). `pi-remote-full-access-runtime-baseline.md`: convert the
unnumbered sentence-case H2s to numbered ALL-CAPS, add `## 1. OVERVIEW`, replace the blockquote intro with a
1-2 sentence plain intro, and add REFERENCES.

### Phase C: design-reference deletion and dangler repair

Delete `SKILL_DIR/references/design-reference/` (the `mobile-chat-apps/` teardown, current-UI map, competitor
research, and screens). In the same change, remove the `SKILL.md:80` design-reference bullet and change the
`SKILL.md:74` folder count from six to five. Leave the two historical changelog mentions untouched. Re-run
`scan-skill-references.mjs` against `SKILL.md` and confirm `broken : 0`.

### Phase D: README and playbook reconciliation (largest, last)

Rewrite `README.md` to current reality and to `skill-readme-template.md`: paths and stack move to `app-mobile/`,
`app-relay/`, `packages/pi-rpc-protocol/`, SvelteKit, `app-mobile/src/app.css`, and the
`feature-catalog/design-system/token-library.md`, `feature-catalog/design-system/designer-editability.md`, and
`app-mobile/catalog.html` targets. Add the one-line blockquote pitch after the H1 and reduce AT A GLANCE from
seven rows to the template's four. Fix `manual-testing-playbook/manual-testing-playbook.md:23`. Throughout,
avoid every pre-migration string and the three drift-guard negative controls.

### Phase E: Verification

Run the objective proof plan: OVERVIEW plus final RELATED-RESOURCES or REFERENCES plus ALL-CAPS numbered H2s
on all seven docs; `design-reference/` gone and scan `broken : 0`; zero pre-migration and negative-control
strings in the README and playbook; README blockquote pitch and 4-row AT A GLANCE present; each edited doc
passes `validate_document.py` when present.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Structure conformance | Seven docs plus README against their v4 templates | Manual diff against template plus H2 grep |
| Link integrity | `SKILL.md` after the deletion | `scan-skill-references.mjs` (expect `broken : 0`) |
| Negative-control absence | README and playbook | Literal `rg` for the pre-migration and negative-control strings |
| Per-doc validation | Each edited doc | `validate_document.py` if present in `SKILL_DIR` |

No runtime, unit, or integration tests apply: this packet changes no executable code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `sk-create-skill` v4 asset, reference, and readme templates | Internal | Green | No alignment target without them |
| Exemplar `token-retint-checklist.md` | Internal | Green | Loses the conformant asset reference model |
| `scan-skill-references.mjs` | Internal | Green | Cannot prove `broken : 0` |
| Isolated-worktree cross-repo landing flow into Public | Internal | Green | The planned edits cannot land |
| OQ-1 operator decision on `dqi-baseline.md` | External | Yellow | REQ-007 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scan reports a broken link, a negative-control string reappears, or a validator fails.
- **Procedure**: Revert the offending doc edit or restore the deleted folder from Git history in the Public worktree, then re-run the scan and the negative-control grep before retrying.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (assets) ─┐
Phase B (refs) ───┤
                  ├──► Phase C (delete + dangler) ──► Phase D (README + playbook) ──► Phase E (verify)
```

| Phase | Depends On | Blocks |
|---|---|---|
| A Assets | None | None (ordered before C) |
| B References | None | None (ordered before C) |
| C Deletion | None (run after A, B) | D |
| D README + playbook | Run after C | E |
| E Verification | A, B, C, D | None |

There are no hard code-level dependencies between A, B, C, and D. The order is kept so the large rewrite in D
reflects the structure and deletions already made in A through C.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|---|---|---|
| A Assets (4 files) | Low | 1-2 hours |
| B References (3 files) | Medium | 2-3 hours |
| C Deletion + dangler | Low | 30-45 minutes |
| D README + playbook rewrite | Medium-High | 2-4 hours |
| E Verification | Low | 30-60 minutes |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Working in an isolated Public worktree, not the shared checkout.
- [ ] Current H2 inventory of each target doc captured for before/after comparison.
- [ ] `scan-skill-references.mjs` baseline recorded before the deletion.

### Rollback Procedure

1. Identify the failing doc or the broken link from the scan or negative-control grep.
2. Revert that single doc edit, or `git checkout` the deleted `design-reference/` tree in the worktree.
3. Re-run `scan-skill-references.mjs` and the negative-control grep to confirm the baseline is restored.
4. Retry the affected workstream.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A; all changes are Git-tracked markdown reverts.
<!-- /ANCHOR:enhanced-rollback -->
