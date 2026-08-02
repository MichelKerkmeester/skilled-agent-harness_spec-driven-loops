---
title: "Decision Record: Code README Standard And Enforcement"
description: "Accepted decisions governing the code-folder README standard, validator mode, and equivalent orientation handling."
trigger_phrases:
  - "code readme ADR"
  - "directory tree equivalence decision"
  - "code folder validator decision"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-08-02T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded ADR-001 through ADR-005 as Accepted"
    next_safe_action: "Consume accepted decisions in downstream phases"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator rulings Q1, Q2, and Q3 are accepted and applied."
---

# Decision Record: Code README Standard And Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> ADR-001 through ADR-005 are **Accepted**. ADR-001 to ADR-003 record the operator rulings. ADR-004 records the implementer-accepted opt-in boundary and the required parity proof. ADR-005 records the deliberate durability floor for manifest candidacy.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Directory Tree Equivalence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The content model at `readme-code-template.md:47-58` requires a Directory Tree in every multi-file code folder. It does not say whether an exhaustive `CONTENTS`, `FILES` or `Key Files` table satisfies that requirement. Seventy-six of the 88 findings in the sibling sweep phase cite a missing Directory Tree; for 26 of them it is the only defect. Two research findings were refuted on exactly this point: the READMEs navigate fine, they just lack tree syntax.

### Constraints

- The rule must be implementable by a script. Reviewer taste is what produced the unstable findings.
- Flat two-file folders with an exhaustive table already navigate correctly; a mandatory tree adds no information there.
- Folders with subdirectories carry nesting a flat table cannot express.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a shape-conditional Directory Tree rule. A fenced tree is mandatory when the target folder's immediate subdirectory count is greater than zero. When that count is zero, a complete `CONTENTS`, `FILES` or `KEY FILES` table naming every direct file other than the README satisfies the requirement.

**Research recommendation**: require the fenced tree only where it carries information a table cannot — mandatory when the folder has subdirectories or layering, satisfied by a complete file table when the folder is flat.

**How it works**: the validator's tree check reads the folder shape, then applies the tree requirement or the complete-table requirement accordingly. Both branches emit a named rule id.

**Why**: the tree carries nesting information only when subdirectories exist. A complete table is equivalent navigation for a flat folder, and the subdirectory count makes the decision mechanical rather than reviewer-dependent.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Shape-conditional tree (recommended) | Keeps the tree's purpose; exempts ~20 flat folders whose tables are exhaustive; survivors in `003` drop to ~62 | Two code paths; needs a codified definition of "flat" |
| Fenced tree always mandatory | One rule, trivially checkable | All 76 findings stand; repaints ~85 files for no navigational gain; the two refutations return |
| Table always sufficient | Smallest backlog; 26 findings dissolve | Loses nesting information in deep trees; contradicts the template's own content model |

**Why**: the shape-conditional option preserves the information value of a tree while accepting the ruled flat-folder equivalent.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: `003`'s scope becomes decidable and its findings stop oscillating between confirmed and refuted.

**What it costs**: a shape-conditional rule needs a codified definition of "flat". Mitigation: state it as a subdirectory count, not a judgement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The definition of "flat" becomes reviewer taste again | H | Express it as a mechanical condition in `template-rules.json` |
| The ruling arrives after `003` is authored | H | Hard gate: `003` re-triages before `tasks.md` exists |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | It decides the tree/table finding class and removes the ambiguity recorded in the content model. |
| 2 | **Beyond Local Maxima?** | PASS | Shape-conditional, tree-always and table-always options are weighed above. |
| 3 | **Sufficient?** | PASS | Immediate subdirectory count selects exactly one validator branch. |
| 4 | **Fits Goal?** | PASS | It gives `002`, `003` and `036/019` a stable, scriptable rule. |
| 5 | **Open Horizons?** | PASS | Future authors can apply the same count without reviewer taste. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: `sk-create-readme/SKILL.md` §6, `assets/readme-code-template.md`, `shared/assets/template-rules.json`, `shared/scripts/validate_document.py`.

**How to roll back**: revert the validator and rule-data commits; the mode is opt-in so the prior code path returns exactly. The ADR text stays.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Scope Of The General Format Rules

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The format block at `sk-create-readme/SKILL.md:217-229` is titled "General README format rules" and carries the blockquote tagline, numbered ALL-CAPS H2, `---` separators, no-TOC and language-tagged fence requirements. Section 6, which defines the code-folder output shape, never restates them. So roughly 45 heading and separator findings — plus the tagline finding — rest on an inference that the "General" block binds code-folder READMEs. The code template's own scaffold at `:189-193` goes H1 → `---` → `## 1. OVERVIEW` with no tagline, which is evidence the block does not fully bind.

### Constraints

- `template-rules.json` already sets `h2UppercaseRequired: true` for the README type. A ruling that exempts casing would contradict shipped machine rules.
- The template scaffold is what authors actually copy.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: to bind code-folder READMEs to the General README format rules for numbered H2 headings, ALL-CAPS H2 casing, `---` separators, language-tagged fences, no Table of Contents and no anchor-comment navigation. The blockquote tagline is explicitly excluded.

**Research recommendation**: yes for numbering, casing, separators, fences and no-TOC; no for the blockquote tagline. State it explicitly in §6 rather than leaving §6 silent.

**Why**: these rules are already the general authoring contract and the shipped README rule requires uppercase H2 headings. Excluding only the tagline makes the code scaffold and the executable contract agree without duplicating the rule list.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Bind all but the tagline (recommended) | Matches the template scaffold and the shipped machine rule | Needs an explicit §6 statement |
| Bind everything including the tagline | Simplest statement | Contradicts the scaffold; makes every code README non-conformant on day one |
| Bind nothing; §6 is self-contained | Honest to the current text | Discards ~45 findings and the existing `h2UppercaseRequired` rule |

**Why**: binding the structural rules closes the inference gap, while excluding the tagline follows the code-folder scaffold and avoids making every existing code README invalid by default.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**: the heading, separator and fence findings stop being inferences.

**What it costs**: an explicit §6 restatement duplicates text that already exists in the general block. Mitigation: cross-reference rather than copy.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| §6 and the general block drift apart later | M | Cross-reference by anchor, do not duplicate the list |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The heading, separator, fence and navigation classes depend on this applicability decision. |
| 2 | **Beyond Local Maxima?** | PASS | Bind-all, bind-none and bind-all-but-tagline options are weighed above. |
| 3 | **Sufficient?** | PASS | The cross-reference names every binding and the one exception. |
| 4 | **Fits Goal?** | PASS | The validator and code template can implement the same contract. |
| 5 | **Open Horizons?** | PASS | The authoritative general block remains reusable without drift from duplicated prose. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: `SKILL.md` §6, `assets/readme-code-template.md`, `references/readme/quality-and-checklist.md`, `shared/assets/template-rules.json`.

**How to roll back**: revert the authoring-surface commits; no tooling depends on the prose alone.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Content-Defined Equivalent Orientation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Two disposition findings exempt a folder because orientation is supplied under a different filename: `.claude` is covered by `SYNC.md:8-41`. Whether that is a precedent or a one-off decides whether the auditor can ever pass a folder that has no `README.md`, and therefore whether it reports false gaps.

### Constraints

- The auditor must not report a gap where orientation demonstrably exists.
- An open-ended exemption becomes a suppression mechanism.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: to accept a designated orientation file with any filename when it supplies the same Overview plus inventory content required of `README.md`. The manifest records the designation and the auditor records the exemption explicitly.

**Research recommendation**: yes, content-defined. A landing point owes orientation, not a filename. The auditor accepts a designated orientation file that supplies Overview plus inventory, and records the exemption explicitly.

**Why**: orientation is the requirement, while a filename is only one convention. Requiring manifest designation and the same content check prevents the exemption from becoming an unreviewable suppression path.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Content-defined exemption (recommended) | No false gaps; the requirement is orientation, not a filename | Needs a designation mechanism so it is not open-ended |
| `README.md` filename required, no exceptions | Trivially checkable | Forces a duplicate of `SYNC.md`; two known false gaps |
| Case-by-case reviewer exemption | Flexible | Unauditable; drifts into suppression |

**Why**: this avoids false gaps for established orientation files while keeping the exception deterministic and auditable.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**: `RA-001-08` and `RA-007-09` become recorded exemptions rather than permanent open findings.

**What it costs**: a designation mechanism to maintain. Mitigation: designate in the manifest, and require the same Overview-plus-inventory content the README rule requires.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Exemption used to avoid writing READMEs | M | The exempting file must pass the same content check |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | It resolves the equivalent-orientation dispositions and the auditor's no-false-gap condition. |
| 2 | **Beyond Local Maxima?** | PASS | Designation, filename-only and reviewer-exemption options are weighed above. |
| 3 | **Sufficient?** | PASS | A designated file plus the Overview-and-inventory check defines the full exemption. |
| 4 | **Fits Goal?** | PASS | The manifest walk can report an explicit exemption instead of a missing README. |
| 5 | **Open Horizons?** | PASS | The content rule survives future filename conventions. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: `sk-create-readme/scripts/audit_readmes.py` exclusion classifier; `SKILL.md` applicability text.

**How to roll back**: revert the classifier commit; the auditor returns to reporting both folders as gaps.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The Code-Folder Validator Mode Is Opt-In

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-004-context -->
### Context

`validate_document.py` is consumed by CI. Three hundred seventy-nine existing READMEs currently pass its narrow three-check README contract. A default-on code-folder mode would reclassify a large share of them in a single commit, turning a documentation phase into a repo-wide breakage.

### Constraints

- CI must not change verdict on any file this phase does not intend to change.
- `003` needs the mode to be runnable per lane, which opt-in satisfies.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: ship the code-folder mode behind an explicit opt-in, and prove verdict parity by diffing a full verdict dump before and after.

**How it works**: the existing README branch is untouched. The new branch runs only when the caller requests the code-folder document type.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Opt-in mode (chosen) | Zero blast radius; per-lane runnable; reversible by revert | Needs an explicit flip later to become enforcement |
| Default-on | Immediate enforcement | Reclassifies 379 READMEs and any CI consuming them |
| Separate script | Total isolation | Duplicates parsing, rule data and reporting |

**Why this one**: it gives `003` the gate it needs without changing any existing verdict.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**: enforcement becomes available without a migration.

**What it costs**: a future decision is needed to make it default. Mitigation: record that flip as a separate, staged decision with its own baseline.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The mode never gets turned on and enforcement stays theoretical | M | `003`'s durability grep gate runs in CI independently of the flip |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CI consumes the validator today |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | Satisfies `003`'s gate need |
| 4 | **Fits Goal?** | PASS | On the critical path |
| 5 | **Open Horizons?** | PASS | Leaves the default-on flip available as a staged decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: `shared/scripts/validate_document.py`, `shared/assets/template-rules.json`.

**How to roll back**: revert both commits and re-run the verdict dump; it must match the stored baseline exactly.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The Durability Floor Is a Discovery Aid, Not an Exhaustive Oracle

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-02 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-005-context -->
### Context

The durable-directory manifest admits a directory when it has at least five durable files or already has a README. That floor keeps the manifest aligned with the need-based applicability rule instead of surfacing the roughly 1,432 sub-floor folders that a low file-count threshold would add, most of which are exempt under the need-based rule.

The three research-confirmed missing-README folders below the floor therefore do not enter the manifest candidate set:

- `.opencode/skills/sk-design/shared/authored-brand`
- `.opencode/skills/system-spec-kit/scripts/runtime-mirrors`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges`
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: retain the `>= 5 durable files OR has_readme` candidacy rule as a deliberate mechanical proxy for the need-based applicability rule. The manifest is a discovery aid, not an exhaustive missing-README oracle, and it intentionally does not surface sub-floor folders.

**Why**: lowering the floor would flood the audit with folders that do not need standalone orientation, while the current floor preserves a deterministic and reviewable candidate set. The three named sub-floor folders are accepted known exceptions and must be carried from the research specification by downstream phases.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Keep the five-file-or-README floor (chosen) | Preserves the need-based candidate set and avoids broad noise | Does not enumerate sub-floor gaps automatically |
| Lower the floor to include every durable folder | Exhaustive mechanical census | Surfaces roughly 1,432 folders, most exempt under the need-based rule |
| Treat the manifest as exhaustive despite the floor | Simplest handoff language | Overclaims coverage and hides the three known sub-floor folders |

**Why this one**: the floor is a deliberate precision trade-off, so the handoff must name its blind spots rather than imply completeness.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**: the manifest's scope and coverage claim are explicit, and downstream owners have a named source for the three sub-floor folders.

**What it costs**: a manifest-only consumer cannot discover those three folders. Mitigation: phases `002` class (c) and `036/019` must take them from `002`'s specification and must not infer "no gap" from manifest absence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A downstream consumer treats the manifest as exhaustive | H | Handoff language names the floor, the three known exceptions, and the required specification source |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The three research-confirmed folders are below the candidacy floor and otherwise disappear from the handoff. |
| 2 | **Beyond Local Maxima?** | PASS | Retaining the floor, lowering it, and claiming exhaustiveness are weighed above. |
| 3 | **Sufficient?** | PASS | The rule names the proxy, its intentional blind spot, and the three accepted known exceptions. |
| 4 | **Fits Goal?** | PASS | It preserves need-based applicability without overstating manifest coverage. |
| 5 | **Open Horizons?** | PASS | Future sub-floor findings can be added to the explicit specification source without changing the floor. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**: the manifest handoff language and downstream phase inputs. The candidacy threshold remains unchanged.

**How to roll back**: revert this ADR and the corresponding handoff wording. No auditor threshold change is involved.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
