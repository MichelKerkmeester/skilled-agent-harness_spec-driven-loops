---
title: "Feature Specification: create-skill-canon-self-consistency"
description: "Docs-only BUILD leaf aligning the sk-create-skill canon, templates, examples, and named fallback surfaces to the executable authorities without changing runtime modules."
trigger_phrases:
  - "create skill canon"
  - "skill root metadata contract"
  - "parent hub doctrine"
  - "canon self contradiction"
  - "sk-doc default routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/002-create-skill-canon-self-consistency"
    last_updated_at: "2026-08-02T08:12:30Z"
    last_updated_by: "skd025-002-build"
    recent_action: "Applied docs-only canon corrections; all required gates passed"
    next_safe_action: "Keep this leaf In Progress for the explicitly excluded follow-on work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "DR-4 — refuted at HEAD; canon and validator already agree."
      - "DR-5 — topology prose is illustrative and defers to the live registry."
      - "Q3 — the 22 requested IDs are retained with explicit terminal dispositions."
---
# Feature Specification: create-skill-canon-self-consistency

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The skill-authoring packet had stale prose around companion metadata, frontmatter, resource directories, naming, version examples, and sibling topology. This BUILD leaf aligns the affected documentation to the executable authorities and records the two requested non-fixes: the validator finding is refuted at HEAD, and alias normalization is deferred because it would require runtime or file renames outside this docs-only scope.

**Key Decisions**: the validator prose fork is refuted at HEAD; topology snapshots are explicitly illustrative and defer to each live registry.

**Critical Dependencies**: the named doc-package and parent-hub gates must still be run and recorded. The packet remains In Progress until those receipts are captured.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

## BUILD LEAF EXECUTION CONTRACT

This execution is deliberately narrower than the inherited proposal above. Editable scope is documentation under the sk-create-skill canon, the explicitly named fallback and related canon surfaces, and this child packet. Executable modules, the packaging gate, naming enforcement, parent-skill-check, scaffold scripts, alias files, and conformance-test creation are not changed.

The authority proof is recorded in `tasks.md`: the metadata contract module, packaging script, naming validator, parent-hub gate, and live sibling registry were read before editing. Every fixed item records doc-before, authority, and doc-after evidence. `RE-009-06` is REFUTED because the canon and validator agree at HEAD. `RE-006-13` is DEFERRED because correcting the mixed-case aliases would require out-of-scope file renames or runtime naming changes. `RE-001-07` is resolved as a doc-authoritative clarification: resource directories are conditional when packets carry source material.

The child status stays **In Progress** by contract. Passing the requested gates verifies the edited docs; it does not claim the excluded conformance test, scaffold rehearsal, alias normalization, or wave-2 notification work.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

At the pre-edit HEAD, the canon had stale statements about companion metadata, frontmatter, resource directories, naming, version examples, and sibling topology. The executable contract and live registries were the authority; this leaf aligned the affected prose and templates to them. The original research narrative remains here as historical problem context, while the BUILD ledger records the current terminal dispositions.

Separately, the hub that owns this canon has the same disease in its own front door: its README and the default fallback resource its router serves for an ambiguous request both describe a directory tree that no longer exists — so the *default* answer to an unclear request is a map of directories that are not there.

This class of defect survived a clean mechanical gate on three hubs with zero warnings, because the gate validates structure and these are narrative contradictions. Text edits alone will re-rot for the same reason.

### Purpose

The executable module is the authority; prose defers to it and never restates it — and a conformance test that reads both sides fails when they diverge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The companion-metadata contradiction across all four prose surfaces that state it, resolved in favour of the executable module.
- The remaining canon self-contradictions in the same packet: frontmatter requirement, resource-directory requirement, naming-rule example, sibling-hub topology.
- The hub's own README and default fallback routing resource, whose directory map is stale.
- A conformance test that parses the prose tables and the module's class sets and fails on disagreement — the durable half of this phase.
- The seven registry-supplementary findings routed here: stale canonical standards, template and example drift, mode-topology restatements, alias case, and an orphaned router document that contradicts the hub's own contract. **[OPERATOR-DECISION: Q3 — supplementary findings]**

### Out of Scope

- Editing the root-metadata contract module or its markdown contract to make the doctrine true. These are the authority; if T001 finds the contract is itself the stale side, this phase halts and escalates rather than proceeding — see the Logic-Sync note below.
- Introducing an empty placeholder file anywhere while repairing prose. One finding exists precisely to guard this: a standalone-class skill correctly has no such file, and repairing prose must not "helpfully" add one.
- Changing the packaging script's required-field list to match the template. The script is closer to the authority than the template is; the template moves.
- Changing the validator's section-requirement behaviour unilaterally. That is DR-4 and the finding carries an explicit warning against a validator-only change.
- Skill documents outside this packet that merely *use* the canon. They are the other phases' work.

### Findings in scope — the 15 registry findings

| ID | Sev | Primary surface | Claim | Verification status at authoring |
|----|-----|-----------------|-------|----------------------------------|
| RE-001-01 | P1 | `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Doctrine requires the companion metadata file; the contract and module say optional for the class | Confirmed by synthesis — a three-way contradiction inside one packet |
| RE-001-02 | P1 | `sk-create-skill/SKILL.md` | Creation workflow repeats the stale requirement | Confirmed before edit; fixed in the BUILD ledger |
| RE-001-03 | P1 | `sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Hub template encodes the obsolete requirement | Confirmed before edit; fixed in the BUILD ledger |
| RE-001-04 | P1 | `sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json` | The scaffold file's own preamble claims the file is mandatory | Confirmed before edit; fixed in the BUILD ledger |
| RE-001-05 | P1 | `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Extension matrix describes a sibling hub's retired mode topology | Confirmed by synthesis against the sibling's registry |
| RE-001-06 | P1 | `sk-create-skill/assets/skill/skill-md-template.md` | Template marks a required frontmatter field optional | Confirmed against `package_skill.py`; fixed in the BUILD ledger |
| RE-001-07 | P2 | `sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Over-states which resource directories are required, contradicting the packet's own prose | Doc-authoritative clarification applied; no executable authority exists |
| RE-001-08 | P2 | `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | The mechanical baseline is clean and still does not prove document currency | Confirmed — this is the evidence for why the conformance test is the real fix |
| RE-003-06 | P2 | `system-spec-kit/` | A standalone-class skill correctly has no companion metadata file | Confirmed — **guardrail, not a repair**: assert absence after editing |
| RE-006-01 | P1 | `sk-doc/README.md`, `sk-doc/shared/references/quick-reference.md` | The hub README and the default fallback resource document a retired directory tree | Confirmed by synthesis |
| RE-009-01 | P1 | `sk-create-skill/SKILL.md` | Workflow still mandates empty command metadata | Confirmed by synthesis (pair with RE-001-01) |
| RE-009-02 | P1 | `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Doctrine contradicts the root metadata contract | Confirmed by synthesis |
| RE-009-03 | P1 | `sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Template encodes the retired requirement | Confirmed before edit; duplicate closed against RE-001-03 |
| RE-009-05 | P2 | `sk-create-skill/assets/skill/skill-reference-template.md` | Labels a kebab-case filename as snake_case; the same name appears in both columns | Confirmed against the naming validator; fixed in the BUILD ledger |
| RE-009-06 | P2 | `sk-create-skill/scripts/package_skill.py` | A section is advisory in validation while the governing prose implies it is required | Confirmed — **DR-4**; the finding warns explicitly against changing the validator alone |

**Note on the five ID pairs.** `RE-001-01`/`RE-009-02`, `RE-001-02`/`RE-009-01` and `RE-001-03`/`RE-009-03` are the same defect found by two independent iterations. They keep separate IDs because the registry holds them separately and the arithmetic must reconcile, but they close together in one edit per surface. This is not double-counting — it is two witnesses to one fact, and it is the strongest evidence in the program that this contradiction is real rather than a reading error.

### Findings in scope — registry-supplementary

These 14 iteration-6 entries sit in the registry's `repeated[]` bucket, outside the 74, because they collided on a file-plus-title dedupe rather than on content. Seven route here. **Each is confirm-first with an explicit re-verify flag: their provenance is a dedupe collision, so neither their currency nor their novelty was ever independently checked.** Marked `§`.

| ID | Sev | Primary surface | Claim | Judgment |
|----|-----|-----------------|-------|----------|
| RE-006-02 § | P1 | `sk-doc/shared/references/core-standards.md` | Defines a section contract the current templates do not use, and links to obsolete resources | Confirmed before edit; fixed in the BUILD ledger |
| RE-006-10 § | P2 | `sk-create-skill/assets/skill/skill-asset-template.md` | Embedded classification example marks retired sections required and uses an outdated version shape | Confirmed before edit; fixed in the BUILD ledger |
| RE-006-11 § | P2 | `sk-create-quality-control/references/workflows.md`, `sk-create-skill/assets/skill/skill-procedure-template.md`, `sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Three documents restate a retired mode topology | Confirmed before edit; all four named surfaces follow DR-5 |
| RE-006-12 § | P2 | `sk-create-skill/references/skill/examples-and-maintenance.md` | Version examples use a component count the metadata contract does not accept | Confirmed before edit; fixed in the BUILD ledger |
| RE-006-13 § | P2 | `sk-doc/mode-registry.json` | Mode aliases use mixed case where the contract requires normalized lowercase | Confirmed; deferred because file/runtime renames are out of scope |
| RE-006-14 § | P2 | `sk-doc/shared/references/smart-routing.md` | An orphaned second-layer router with no frontmatter, describing a topology the hub's own contract disclaims | Confirmed before edit; fixed in the BUILD ledger |
| RE-006-15 § | P2 | `sk-create-quality-control/references/validation-and-enforcement.md` | Quick validation guidance prescribes converting hyphens to underscores against the current convention | Confirmed before edit; fixed in the BUILD ledger |

**Scope-table total for this phase: 15 + 7 = 22 items.**

### Logic-Sync guard

This phase assumes the executable module and its markdown contract are the correct authority and the four prose surfaces are stale. That assumption is load-bearing and it is *an assumption*. T001 re-reads the contract in full specifically to test it. If the contract turns out to be the stale side — if, for example, a later decision reinstated the requirement and only the contract missed it — this phase **halts and escalates with both facts and the decision needed**. It does not pick a side and edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | Companion-metadata policy defers to the module; extension matrix per DR-5 |
| `.opencode/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | Creation workflow stops mandating the placeholder |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Modify | Requirement removed; resource-directory language matched to the packet's own prose |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json` | Modify | Preamble states when the file is warranted, not that it is mandatory |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/{skill-md-template,skill-reference-template,skill-asset-template,skill-procedure-template}.md` | Modify | Frontmatter requirement, naming example, classification example, mode topology |
| `.opencode/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` | Modify | Version examples matched to the metadata contract |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modify | Mode topology example |
| `.opencode/skills/sk-doc/sk-create-quality-control/references/{workflows,validation-and-enforcement}.md` | Modify | Mode topology; filename convention guidance |
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | Modify | Section contract and resource links realigned to the current templates |
| `.opencode/skills/sk-doc/shared/references/smart-routing.md` | Modify or Delete | Orphaned router: rewritten with metadata and an owner, or removed |
| `.opencode/skills/sk-doc/{README.md,shared/references/quick-reference.md}` | Modify | Directory map matched to the tree that exists |
| `.opencode/skills/sk-doc/mode-registry.json` | Not changed | Alias normalization deferred because file/runtime renames are outside this docs-only leaf |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/` | Not changed | Conformance-test creation is outside this docs-only leaf; executable modules remain authority |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding is confirmed against HEAD before it is edited, and the contract's authority status is proven rather than assumed | `tasks.md` T001 produces a per-ID disposition; the contract has been read in full and its authority is recorded as confirmed, or the phase has halted per the Logic-Sync guard |
| REQ-002 | Exactly one statement of the companion-metadata policy exists in the packet's prose, and it defers to the module | Grep across the packet returns one policy statement; the other three surfaces reference it rather than restating it |
| REQ-003 | A conformance test reads both sides and fails on disagreement | The test parses the class sets from the module and the requirement tables from the prose, and a deliberately introduced mismatch makes it fail |
| REQ-004 | No empty placeholder file is introduced anywhere during the repair | Post-edit assertion that the standalone-class skill still has none, and that no new one appeared under any skill root |
| REQ-005 | A hub scaffolded from the repaired template emits no companion metadata file and passes the fleet gate | Scaffold a throwaway command-less hub; assert absence; run the fleet gate on it |
| REQ-006 | The packet validates clean | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0 with Errors: 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The template's frontmatter requirement matches the packaging script's required-field list | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py` over two or three real skills produces no new failures, and the template's optional/required labels match the script's lists |
| REQ-008 | The naming-rule example no longer shows one filename in both the valid and invalid columns | Read the corrected table; the two columns are disjoint |
| REQ-009 | Every restatement of a sibling hub's mode topology is either generated from that hub's registry or explicitly labelled illustrative and non-authoritative | Four surfaces treated identically per DR-5 |
| REQ-010 | The hub's README and default fallback resource describe directories that exist | Path-existence assertion over every directory named in both documents; zero unresolvable |
| REQ-011 | The orphaned router document is resolved, not left as a second contract | Either it is gone, or it carries frontmatter, an owner and language that does not contradict the hub's routing contract |
| REQ-012 | Mode-registry alias normalization lands together with its consumers | Router tests and any generated index updated in the same change; no consumer left reading the old case |
| REQ-013 | The seven supplementary findings each reach a terminal state, individually verified rather than batch-edited | Per-ID disposition in the phase output, each with its own evidence line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One companion-metadata policy statement exists in the packet, and it agrees with the executable module.
- **SC-002**: The conformance test exists, is wired to run, and demonstrably fails on an introduced mismatch.
- **SC-003**: A hub scaffolded from the repaired template passes the fleet gate and carries no placeholder file.
- **SC-004**: Every directory named by the hub README and the default fallback resource exists.
- **SC-005**: Each of the 22 scope items ends in exactly one state: repaired, stale-finding, already-fixed, or deferred-with-reason.
- **SC-006**: `validate.sh --strict` reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The root-metadata contract and its module are genuinely the authority | The whole phase inverts | T001 proves it; the Logic-Sync guard halts rather than guessing |
| Dependency | Two wave-2 phases wait on this phase's rulings | Wave 2 idles or proceeds on a rule about to change | Rulings are scoped small and taken early; wave 2 may run its confirm and baseline tasks meanwhile |
| Risk | Repairing prose "helpfully" adds a placeholder file | High — it recreates the exact defect | Explicit guardrail requirement plus a post-edit absence assertion |
| Risk | The conformance test parses prose brittlely and fails on formatting | Med | The test targets the requirement tables specifically, and reports which document it could not parse rather than passing |
| Risk | DR-4 tempts a validator-only change | Med | The finding's own warning is carried into the decision record; the ruling must cover prose and validator together |
| Risk | Alias normalization silently breaks a case-sensitive consumer | Med | Consumers updated in the same change; router tests run before and after |
| Risk | Supplementary findings are stale — they were never independently verified | Med | Each is confirm-first with its own evidence line; batch editing is explicitly forbidden |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The conformance test must run fast enough to sit in the same gate as the fleet check — seconds, not minutes — or it will be skipped.

### Security
- **NFR-S01**: The scaffolding rehearsal must write only to a throwaway location and must be removed afterwards; it must never scaffold into a live skill root.

### Reliability
- **NFR-R01**: The conformance test must distinguish "the two sides agree" from "I could not read one side". The second is a failure.

---

## 8. EDGE CASES

### Data Boundaries
- A prose table that legitimately describes a *different* class than the one the module names: the test keys on class, not on document order.
- A skill class with no companion file requirement at all: absence is the expected state and must not be reported as drift.

### Error Scenarios
- The module changes shape (a renamed class set): the test fails loudly on the missing symbol rather than silently finding nothing.
- The scaffolding rehearsal leaves residue: the phase's file-organization checks catch it before completion.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | ~16 files in one packet plus the hub front door |
| Risk | 18/25 | Auth: N, API: N, Breaking: yes — this canon is consumed by every future skill and by two sibling phases |
| Research | 10/20 | The authority question must be settled by reading, and seven supplementary findings are unverified |
| Multi-Agent | 5/15 | Runs parallel to one sibling; blocks two |
| Coordination | 9/15 | Soft-blocks wave 2; the alias change has consumers |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The contract is the stale side and this phase edits the wrong documents | H | L | T001 authority proof; Logic-Sync halt |
| R-002 | A placeholder file is reintroduced during prose repair | H | M | Guardrail requirement plus post-edit absence assertion |
| R-003 | The conformance test passes vacuously | M | M | Unreadable side counts as failure; parsed-document count reported |
| R-004 | Wave 2 starts on a canon rule that then changes | M | M | Rulings early and small; wave 2 restricted to non-canon tasks until signed |
| R-005 | Alias normalization breaks a consumer | M | M | Consumers in the same change; tests before and after |
| R-006 | A supplementary finding is already fixed and its "repair" reintroduces the defect | M | M | Confirm-first per ID; already-fixed is a valid terminal state |

---

## 11. USER STORIES

### US-001: Authoring a command-less hub (Priority: P0)

**As an** author scaffolding a hub with no slash commands, **I want** the doctrine, the workflow, the template and the scaffold preamble to agree with the validator, **so that** I do not commit a placeholder file the contract says should not exist.

**Acceptance Criteria**:
1. Given the repaired packet, When I read any of the four surfaces, Then each states the same policy and defers to the module.
2. Given a hub scaffolded from the repaired template, When I run the fleet gate, Then it passes and no placeholder file was created.

### US-002: An ambiguous request to the documentation hub (Priority: P1)

**As an** agent whose request does not clearly match a mode, **I want** the default fallback resource to describe directories that exist, **so that** my first orientation is not a map of a tree that was removed.

**Acceptance Criteria**:
1. Given the default fallback resource, When every directory it names is checked, Then all of them exist.

### US-003: Preventing re-rot (Priority: P0)

**As a** maintainer reviewing a future change to the canon, **I want** a test that reads both the prose and the module, **so that** a divergence fails in review rather than surviving a structurally clean gate with zero warnings.

**Acceptance Criteria**:
1. Given a deliberately introduced mismatch between a prose table and the module, When the test runs, Then it fails and names both sides.

---

## 12. OPEN QUESTIONS

- **[OPERATOR-DECISION: DR-4 — required or recommended]** Is the workflow section required, as the governing prose implies, or advisory, as the packaging script has it? Two of the research loop's open questions are this same question asked twice. The finding's own warning stands: **do not change the validator alone.** Recorded as a decision to be made during execution; it is not pre-decided here.
- **[OPERATOR-DECISION: DR-5 — sibling topology statement]** The hand-maintained per-hub extension matrix is a symptom, not just a stale row: four documents restate another hub's mode set. Rule it either generated from each registry, or explicitly labelled illustrative and non-authoritative. Not pre-decided here.
- **[OPERATOR-DECISION: Q3 — supplementary findings]** The seven `§` items are admitted on the synthesis's recommendation. If the operator declines, they are removed from this phase's arithmetic and the total returns to 15.
- Does the orphaned router document have a consumer? If something still reads it, deletion becomes a migration rather than a removal.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` — scaffolded from the template at copy time; DR-4 and DR-5 are decided during execution, not pre-decided by this spec
- **Parent Spec**: See `../spec.md`
