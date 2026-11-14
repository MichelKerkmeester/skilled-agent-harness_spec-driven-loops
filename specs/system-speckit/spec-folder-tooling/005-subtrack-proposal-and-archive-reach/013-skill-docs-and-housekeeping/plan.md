---
title: "Implementation Plan: Phase 13: skill-docs-and-housekeeping"
description: "Align SKILL.md, two references, two READMEs and a new v2.13.1.0 changelog entry with the shipped behavior, fix four packet-record defects, and review the phase 009 routing change with the advisor."
trigger_phrases:
  - "skill docs and housekeeping plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: skill-docs-and-housekeeping

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, plus the advisor CLI for the routing review |
| **Framework** | sk-doc skill, README and changelog standards |
| **Storage** | None |
| **Testing** | `rg` checks per requirement, the sk-doc validators, the advisor, and recursive spec validation |

### Overview
This phase finishes the remediation. The skill documents get the sentences the reviews named, written from the code after phases 011 and 012. The changelog gets one new entry. The packet's own records get four corrections. The routing change of phase 009 gets the review it missed, through the advisor and the commit diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 011 and 012 are committed
- [ ] T001 resolved the next-number command and re-read every cited line

### Definition of Done
- [ ] All nine requirements pass their acceptance check
- [ ] The sk-doc validators exit 0 on every changed skill document
- [ ] `validate.sh` on the parent with `--strict --recursive` prints `RESULT: PASSED` 14 times
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment and record correction

### Key Components
- **Skill documents**: one sentence or table row per finding, in the section that already covers the behavior.
- **Changelog**: a new `v2.13.1.0.md` per sk-create-changelog, because `v2.13.0.0` is released. `SKILL.md` frontmatter moves to the same version.
- **Packet records**: Verify clauses in phases 006 to 010 point at `scratch/build-evidence.md` or the file that exists. No task state, criterion or status changes.
- **Routing review**: the diff of `0701a31ae5`, the reworded signal in `graph-metadata.json`, the accepted 161 to 160 drop in `scorer-eval-baseline.json`, and three advisor runs, recorded with a verdict.

### Data Flow
Shipped code → skill documents and changelog. Review findings → packet records. Commit `0701a31ae5` → routing review verdict.

### Shared Contracts
The skill's `version` frontmatter, which the changelog entry must match. The advisor's routing for system-spec-kit, which REQ-008 may change only through `skill-hub-routing.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup resolves the next-number command and re-reads every cited line. Implementation edits the skill documents, writes the changelog entry, corrects the packet records and runs the routing review. Verification runs each requirement's check, the sk-doc validators and the parent's recursive validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

REQ-001 is tested in a `mktemp` copy against `create.sh`, the rule it must match. The routing review runs `node .skilled/bin/skill-advisor.cjs advisor_recommend` on three prompts and saves their output. Every other requirement has an `rg` or `sed` check that prints only once the document states the behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phases 011 and 012 committed. The sk-doc validators and the advisor CLI. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a changed document fails its validator after commit, or the recursive validation fails.
- **Procedure**: revert the one commit that carries this phase. A routing fix, if one was needed, is its own commit and reverts on its own.
<!-- /ANCHOR:rollback -->

---
