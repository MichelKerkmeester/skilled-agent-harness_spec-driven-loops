# Decision Record: Code README Standard And Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> All four ADRs are **Proposed**. ADR-001 to ADR-003 are operator rulings and cannot be marked Accepted by an implementer. The recommendation rows carry the track-A research position; a different answer flips the dependent scope in `002` class (c), `003`, and `036/019`.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Directory Tree Equivalence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed — **[OPERATOR-DECISION: Q1 — tree vs table]** |
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

**We chose**: to be recorded at ruling time.

**Research recommendation**: require the fenced tree only where it carries information a table cannot — mandatory when the folder has subdirectories or layering, satisfied by a complete file table when the folder is flat.

**How it works**: the validator's tree check reads the folder shape, then applies the tree requirement or the complete-table requirement accordingly. Both branches emit a named rule id.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Shape-conditional tree (recommended) | Keeps the tree's purpose; exempts ~20 flat folders whose tables are exhaustive; survivors in `003` drop to ~62 | Two code paths; needs a codified definition of "flat" |
| Fenced tree always mandatory | One rule, trivially checkable | All 76 findings stand; repaints ~85 files for no navigational gain; the two refutations return |
| Table always sufficient | Smallest backlog; 26 findings dissolve | Loses nesting information in deep trees; contradicts the template's own content model |

**Why**: to be recorded with the ruling.
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
| 1 | **Necessary?** | Pending | 76 of 88 sweep findings depend on it |
| 2 | **Beyond Local Maxima?** | Pending | Three options weighed above |
| 3 | **Sufficient?** | Pending | Decides the whole class without further rulings |
| 4 | **Fits Goal?** | Pending | On the critical path for `003` and `019` |
| 5 | **Open Horizons?** | Pending | Codified rule survives future authors |

**Checks Summary**: pending the ruling
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
| **Status** | Proposed — **[OPERATOR-DECISION: Q2 — format-rule applicability]** |
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

**We chose**: to be recorded at ruling time.

**Research recommendation**: yes for numbering, casing, separators, fences and no-TOC; no for the blockquote tagline. State it explicitly in §6 rather than leaving §6 silent.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Bind all but the tagline (recommended) | Matches the template scaffold and the shipped machine rule | Needs an explicit §6 statement |
| Bind everything including the tagline | Simplest statement | Contradicts the scaffold; makes every code README non-conformant on day one |
| Bind nothing; §6 is self-contained | Honest to the current text | Discards ~45 findings and the existing `h2UppercaseRequired` rule |

**Why**: to be recorded with the ruling.
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
| 1 | **Necessary?** | Pending | ~45 findings plus `RA-001-04` depend on it |
| 2 | **Beyond Local Maxima?** | Pending | Three options weighed |
| 3 | **Sufficient?** | Pending | Settles the class in one statement |
| 4 | **Fits Goal?** | Pending | Required before the validator can encode heading rules |
| 5 | **Open Horizons?** | Pending | Removes a standing ambiguity |

**Checks Summary**: pending the ruling
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
| **Status** | Proposed — **[OPERATOR-DECISION: Q3 — equivalent orientation]** |
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

**We chose**: to be recorded at ruling time.

**Research recommendation**: yes, content-defined. A landing point owes orientation, not a filename. The auditor accepts a designated orientation file that supplies Overview plus inventory, and records the exemption explicitly.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Content-defined exemption (recommended) | No false gaps; the requirement is orientation, not a filename | Needs a designation mechanism so it is not open-ended |
| `README.md` filename required, no exceptions | Trivially checkable | Forces a duplicate of `SYNC.md`; two known false gaps |
| Case-by-case reviewer exemption | Flexible | Unauditable; drifts into suppression |

**Why**: to be recorded with the ruling.
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
| 1 | **Necessary?** | Pending | Decides two disposition findings and the auditor's pass condition |
| 2 | **Beyond Local Maxima?** | Pending | Three options weighed |
| 3 | **Sufficient?** | Pending | One rule covers the class |
| 4 | **Fits Goal?** | Pending | Required for REQ-006 to report zero false gaps |
| 5 | **Open Horizons?** | Pending | Content-defined rules outlive filename conventions |

**Checks Summary**: pending the ruling
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
| **Status** | Proposed |
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
