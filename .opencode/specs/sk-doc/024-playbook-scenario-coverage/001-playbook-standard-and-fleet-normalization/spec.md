---
title: "Feature Specification: playbook standard enforcement and fleet normalization"
description: "The sk-doc operator-scenario contract has no mechanical check anywhere in the repository, so every playbook coverage claim in the fleet is hand-typed prose that has drifted. This keystone phase settles the corpus-split and verdict rulings, builds the missing operator-contract validator with paired fixtures and fail-closed CI wiring, derives a per-hub coverage map from live registries, and normalizes all 11 playbook roots to a derived census."
trigger_phrases:
  - "playbook package validator"
  - "operator scenario contract gate"
  - "playbook census derivation"
  - "verdict enum migration playbook"
  - "playbook corpus discriminator"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/024-playbook-scenario-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/001-playbook-standard-and-fleet-normalization"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the keystone child spec from the track (d) synthesis proposal"
    next_safe_action: "Run the confirm-against-HEAD task and record the baseline table before any edit"
    blockers:
      - "OPERATOR-DECISION Q2 (corpus split) gates Lane A"
      - "OPERATOR-DECISION Q1 (shared helper ownership) gates the helper's location"
      - "OPERATOR-DECISION Q7 (explicit NOT READY) gates the system-spec-kit reclassification wording"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Q1 shared count-derivation helper ownership"
      - "Q2 corpus split: frontmatter discriminator or file move"
      - "Q7 stating system-spec-kit NOT READY explicitly"
      - "How many fields does the per-feature required-content list actually enumerate?"
    answered_questions:
      - "Verdict enum is already ruled PASS/FAIL/SKIP by the governing standard; only the template and the roots are stale"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Playbook Standard Enforcement and Fleet Normalization

> Phase adjacency under the `024-playbook-scenario-coverage` parent: this is the first child and it blocks both
> siblings. Successors `002-scenario-accuracy-repair-risk-first` and `003-uncovered-workflow-authoring`.

---

## EXECUTIVE SUMMARY

The `sk-doc` operator-scenario contract — the five numbered sections, the per-feature required-content list, the
`PASS`/`FAIL`/`SKIP` verdict enum, kebab-case filenames with no numeric prefix, one file per feature ID, and
root-index bijection — has **zero mechanical enforcement**. The packet that owns the standard ships no `scripts/`
directory, and its own SKILL.md files the section-structure, ID-bijection, and link-resolution checks under the
heading **Manual Checks**. This phase promotes that list to code.

**Key Decisions**: the corpus-split ruling (discriminator vs. move) and the verdict-enum migration (already ruled
by the standard; only the template and 11 roots are stale).

**Critical Dependencies**: the corpus-split ruling is an operator decision that shapes whether Lane A is a label
change or a cutover.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/024-playbook-scenario-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two contracts share one directory name, and only one of them is checked.

**Corpus A — operator scenarios.** The `sk-doc` standard's actual product: five numbered sections, a per-feature
required-content list, exact prompts and commands, evidence requirements, a binary verdict, failure triage.
`sk-git` (42 files) and `system-spec-kit` (~421 executable files) are this.

**Corpus B — Lane-C typed routing gold.** Compact frontmatter plus prompt plus expected behavior, read by the
skill-benchmark loader and gated by `validate-playbook-topology.cjs`. `mcp-tooling`, `system-skill-advisor`,
`sk-doc`, `mcp-code-mode`, `system-deep-loop`, `cli-external-orchestration`, and `sk-prompt` are predominantly this.

The split is mechanically provable. Running the live topology gate across all 11 hubs produces four `FAIL`
verdicts — and `sk-git`, the reference-quality **operator** playbook, scores **0 valid of 42** because that gate
checks the **other** contract. Every `FAIL` still exits 0 unless `--strict` is passed, so nothing in CI has ever
seen it. Meanwhile no check anywhere covers Corpus A, so every root's stated census is a hand-typed number, and
five of them are already wrong.

### Purpose

Give the operator-scenario contract a fail-closed gate, settle the two rulings the fleet is stuck on, derive the
coverage map that replaces hand-maintained gap prose, and normalize all 11 roots to numbers the tree can prove.

### Non-Goals

- Repairing individual scenario content — that is child `002`.
- Authoring new scenarios — that is child `003`.
- Changing what the Lane-C skill-benchmark loader reads, unless the corpus ruling explicitly calls for it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Four lanes.

**Lane A — settle the two rulings.**
*(i) The corpus split.* Decide whether Corpus B moves to a fixtures tree or stays and is labelled by a frontmatter
discriminator (for example `contract: routing-gold | operator-scenario`). **OPERATOR-DECISION Q2.** A move is a
cutover, not a file move: `validate-playbook-topology.cjs` resolves its boundary from `<skill>/manual-testing-playbook`
and the Lane-C loader reads the same path, so the gate, the loader, and the files must move in one commit.
*(ii) The verdict enum.* Not an open question. The governing standard already limits execution status to `PASS`,
`FAIL`, and `SKIP` with a named blocker, and forbids `UNAUTOMATABLE`; the topology gate's own code already collapses
the older `PARTIAL`/`READY` vocabulary into that set. Only the template and the 11 roots are stale. Amend, then sweep.
*(iii) Secondary ruling.* Whether cross-hub coverage is indexed from the owning hub, moved, or declared
dependency-owned — the residual of the refuted finding recorded in the parent's disposition table.

**Lane B — build the operator-contract validator.** See §4 REQUIREMENTS for the concrete check list, location,
and exit-code contract.

**Lane C — the derived coverage map.** Derive an expected feature inventory per hub from `mode-registry.json`
(hubs), `command-metadata.json`, public MCP tool schemas, and registered hooks/adapters; join it to indexed
scenario IDs; emit the **uncovered inventory** as a report. Use `feature-catalog/` as a **widening-only**
cross-check, never as the denominator, because the catalog validator is independently known to be fail-open with
partial package coverage. Single skills without a `mode-registry.json` (`sk-git`, `system-spec-kit`) derive from
commands plus catalog plus `SKILL.md`; record that as a weaker signal. This report is the authoritative worklist
for child `003`.

**Lane D — normalize the fleet.** 5 census corrections; 10 filename migrations (link-safe, IDs unchanged);
verdict-enum migration in 11 roots and the template; version-drift sync against `mode-registry.json`; the retired
placeholder removed from the denominator; the 3 unindexed CLI files indexed; `system-spec-kit`'s dead release
census glob replaced with a category-agnostic derivation; and the advisor hub's baked `BLOCKED` results and
developer-absolute-path scenarios migrated to `<skill>/benchmark/reports/<dated-run>/`, the home the predecessor
packet already built. `system-spec-kit` is reclassified **NOT READY** until its two live contrary results are
repaired by child `002` — **OPERATOR-DECISION Q7** owns whether that is stated explicitly in the root.

### Out of Scope

- Scenario content repair and new scenario authoring — children `002` and `003`.
- Nested playbooks under `system-deep-loop/**` — owned by the WS1 register.
- Fixing the feature catalog itself — owned by the catalog integrity track.

### Findings in Scope (19)

| ID | Sev | Kind | Subject | Lane |
|----|-----|------|---------|------|
| `RD-001-02` | P2 | nonconformance | Template defines `PARTIAL`, contradicting the governing verdict contract | A |
| `RD-001-03` | P2 | nonconformance | `mcp-tooling` hub-routing corpus is benchmark gold, not operator scenarios | A |
| `RD-001-05` | P2 | census-error | `sk-code` root claims 31 files / 10 dirs; tree has 32 / 11 | D |
| `RD-001-06` | P2 | census-error | `sk-design` root claims 35 / 9; tree has 36 / 10 | D |
| `RD-001-07` | P2 | census-error | `system-deep-loop` root claims 20 / 5; tree has 21 / 6 | D |
| `RD-001-08` | P2 | census-error | `system-skill-advisor` has 47 files against a stale 41 note | D |
| `RD-001-09` | P2 | census-error | `sk-git` root says "41-scenario battery"; tree has 42 | D |
| `RD-001-10` | P2 | nonconformance | 10 numeric-prefixed scenario filenames, all in `system-spec-kit` | D |
| `RD-003-01` | P1 | nonconformance | `system-spec-kit` release census glob matches nothing; verdict `UNAUTOMATABLE` used | B + D |
| `RD-003-06` | P1 | nonconformance | Recorded contrary evidence blocks a truthful READY claim | D |
| `RD-004-02` | P1 | nonconformance | `system-deep-loop` root accepts `PARTIAL` | A |
| `RD-004-03` | P1 | nonconformance | Retired placeholder file counted as an executable scenario | D |
| `RD-004-04` | P2 | nonconformance | Playbook version drift against `mode-registry.json` | D |
| `RD-005-01` | P2 | census-error | CLI root omits 3 shipped scenario files from its index | D |
| `RD-005-04` | P2 | nonconformance | CLI hub-routing corpus is benchmark gold | A |
| `RD-007-01` | P1 | nonconformance | `sk-prompt` routing files are benchmark gold | A |
| `RD-007-07` | P1 | nonconformance | Baked run evidence, developer-absolute paths, and forbidden verdicts in evergreen scenarios | D |
| `RD-008-08` | P2 | nonconformance | `mcp-tooling` root permits `PARTIAL` | A |
| `RD-010-05` | P2 | nonconformance | `mcp-route-guard` scenario retains `UNAUTOMATABLE` | A |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Create | The operator-contract validator |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/` | Create | Paired positive/negative fixtures, one pair per check |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modify | §7 Manual Checks promoted to Automated Checks; corpus ruling recorded |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | Modify | Remove scenario- and feature-level `PARTIAL`; derived-census language |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | Modify | Align the per-feature snippet to the enumerated required-content list |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs` | Modify | Strict-default; boundary handling only if Q2 rules "move" |
| `.opencode/skills/sk-doc/shared/scripts/` | Create/Modify | Single-definition-site count-derivation helper (**OPERATOR-DECISION Q1**) |
| `.opencode/skills/*/manual-testing-playbook/manual-testing-playbook.md` | Modify | 11 roots: derived census, verdict migration, index repair |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**/[0-9]*-*.md` | Rename | 10 numeric-prefix removals, link-safe |
| CI workflow / pre-push gate | Modify | Run the validator fail-closed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **The validator exists at a fixed location owned by the standard's packet.** It lives at `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`, beside the SKILL.md that defines the contract it enforces — not under `sk-create-skill`, which owns the *other* contract. | The file exists at that path; `ls .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/` is non-empty where it is empty today. |
| REQ-002 | **It enforces the operator-scenario contract, not the routing-gold contract.** The two are named explicitly in its `--help` output and in SKILL.md so no future reader confuses them. See §4 CONTRACT BOUNDARY below. | `--help` names both contracts and states which one this validator checks; a routing-gold fixture is reported as out-of-contract (per the Q2 ruling), never as a content failure. |
| REQ-003 | **Section-structure check.** Every per-feature file carries the five required numbered sections in order: `## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. REFERENCES` or `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`. | Positive fixture passes; a fixture with sections out of order and a fixture missing section 5 both fail with distinct error codes. |
| REQ-004 | **Frontmatter check.** Every per-feature file has frontmatter with `title`, `description`, and a 4-part `version`. | A fixture with a 3-part `version` fails; a fixture missing `description` fails. |
| REQ-005 | **Required-content check.** Every per-feature file carries the per-feature required-content list from the standard: operator or orchestrator prompt, exact command sequence, expected signals, evidence requirements, pass/fail criteria, failure triage, root-playbook link — plus the conditional items (realistic user request, exact prompt in the scenario table, feature-catalog link) when their condition applies. **The exact enumerable field count is an implementation-time deliverable** — see §12. | Each unconditional field has a negative fixture that removes it and fails; each conditional field has a fixture proving it is required only under its condition. |
| REQ-006 | **Verdict-enum check.** Only `PASS`, `FAIL`, and `SKIP` are accepted. `PARTIAL`, `READY`, `UNAUTOMATABLE`, and `BLOCKED` are rejected. A `SKIP` must name a specific blocker. | The negative fixture is the live worktree-setup scenario that permits `PARTIAL`; a bare `SKIP` with no named blocker fails. |
| REQ-007 | **Filename and layout check.** Per-feature files use kebab-case slugs with no numeric prefix; category directories are kebab-case with no numeric prefix; every feature ID maps to exactly one per-feature file. | A fixture named `01-foo.md` fails; a fixture where two files claim one ID fails. |
| REQ-008 | **Root-index ↔ file bijection.** Every indexed row resolves to a file and every non-root file appears in the index — catching orphans and phantom rows in one check. | A fixture with an unindexed file fails; a fixture with an index row pointing at nothing fails. |
| REQ-009 | **Derived census.** The root's stated scenario and category counts must equal the walked tree. A hand-typed count that disagrees is an error, not a warning. | A fixture whose root says 5 over a tree of 6 fails; after the Lane D sweep, re-running over any root passes. |
| REQ-010 | **Link and path resolution.** Every cited local path in every scenario resolves on disk. | A fixture citing a nonexistent asset path fails. This is the mechanical backstop child `002` consumes. |
| REQ-011 | **Evergreen-truth check.** No developer-absolute path and no baked run transcript may appear in scenario truth. | A fixture containing a `/Users/<name>/` path fails; a fixture with an embedded dated run result fails. |
| REQ-012 | **Placeholder detection.** A file with no execution contract may not sit in the coverage denominator. | The negative fixture is the live retired runtime-and-backend placeholder, which must move from counted to rejected. |
| REQ-013 | **Exit-code contract, strict by default.** `0` = conforming. `1` = one or more contract violations. `2` = usage or boundary error (missing playbook root, unsupported root name, bad arguments). Strict is **on by default**; a `--no-strict` flag exists for local triage only and is never used in CI. This is the deliberate inverse of the topology gate, which exits 0 on FAIL unless `--strict` is passed. | Seeded-violation test asserts exit 1; missing-root test asserts exit 2; clean-tree test asserts exit 0; a test asserts the CI invocation does not pass `--no-strict`. |
| REQ-014 | **Fail-closed in CI.** A seeded contract violation makes the CI job exit non-zero. | Written as a test, not asserted as a claim. |
| REQ-015 | **Baseline reproduction.** Before any edit, the phase reproduces the recorded HEAD baseline — see §5 SC-001 and `plan.md` §2. The validator's first real run must explain every delta against it. | The baseline table is recorded in the packet before the first edit and re-run at close. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | The count-derivation helper is **imported, not copied**, from a single definition site. | A test asserts exactly one definition site across the repository. **OPERATOR-DECISION Q1** sets the location. |
| REQ-021 | The topology gate becomes strict-by-default so its four existing `FAIL` verdicts stop exiting 0. | Running it over a hub with blocked fixtures exits non-zero without an explicit `--strict`. |
| REQ-022 | Filename migration is link-safe across the whole repository, not just the playbook trees; scenario IDs are unchanged. | A repository-wide link-resolution pass shows zero new broken links; an ID diff is empty. |
| REQ-023 | The Lane-C uncovered-inventory report is reproducible: re-running the derivation on an unchanged tree produces a byte-identical report. | Two consecutive runs diff clean. |
| REQ-024 | `system-spec-kit`'s dead release census glob is replaced with a category-agnostic derivation that returns the real file count. | The replacement returns the walked count, not 0. |

### CONTRACT BOUNDARY — THE TWO CONTRACTS, NAMED

This is the single most misread thing in the fleet and the validator must not repeat the confusion.

| | **Operator-scenario contract** (this validator) | **Routing-gold contract** (`validate-playbook-topology.cjs`) |
|---|---|---|
| Defined by | `sk-doc/sk-create-manual-testing-playbook/SKILL.md` §3, §6 | `sk-doc/sk-create-skill/` typed-gold schema |
| Requires | Five numbered sections, 4-part `version`, prompts, commands, evidence, verdict, triage | `expected_workflow_mode` + `expected_leaf_resources` frontmatter |
| Consumer | A human operator running a release battery | The Lane-C skill-benchmark loader |
| New validator | `validate-playbook-package.cjs` (**this phase**) | already exists |
| Baseline at HEAD | **no check exists** | 4 hubs `FAIL`, all exit 0 |

**`sk-git` scores 0 valid of 42 under the routing-gold gate.** That number is not a quality signal about `sk-git`;
it is the measurement error this table exists to prevent. `sk-git` is the fleet's reference-quality **operator**
playbook, and it is being scored against a contract it was never written to satisfy. Any report, dashboard, or
commit message that cites the 0/42 without naming the contract is repeating the defect.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The HEAD baseline is captured **before any edit** and re-run at close, with every delta explained:
  the 11-hub topology table (4 `FAIL`, all exit 0); `PARTIAL` present in 11 of 11 roots; numeric-prefixed
  filenames = 10; census deltas `sk-code` 31→32 / 10→11, `sk-design` 35→36 / 9→10, `system-deep-loop` 20→21 / 5→6,
  `sk-git` 41→42, advisor 41-vs-47; the `system-spec-kit` legacy census glob returning 0 against an asserted 421
  (actual 424 `.md` minus 3 `README.md`); total non-root scenario files = 689 across 93 category directories;
  operator-contract checks in existence = **0**.
- **SC-002**: `validate-playbook-package.cjs` exists, enforces every P0 check, and each check ships a paired
  positive and negative fixture.
- **SC-003**: A seeded contract violation makes CI exit non-zero — proven by a test, not asserted.
- **SC-004**: Every root's stated census is derived from the walked tree; a test fails if any root reintroduces a
  hand-typed count.
- **SC-005**: `grep -rl 'PARTIAL\|UNAUTOMATABLE'` over the 11 roots and the template returns nothing.
- **SC-006**: Zero numeric-prefixed scenario filenames remain; a repository-wide link pass shows zero new broken
  links and scenario IDs are unchanged.
- **SC-007**: The Lane-C uncovered-inventory report exists, is reproducible, and is handed to child `003`.
- **SC-008**: The count-derivation helper has exactly one definition site, proven by a test.
- **SC-009**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | **OPERATOR-DECISION Q2** (corpus split) | Lane A is a label change under "discriminator" and a three-part cutover under "move" | Do not start Lane A until Q2 is answered; author the discriminator path first since it is reversible |
| Dependency | **OPERATOR-DECISION Q1** (helper ownership) | Three tracks could ship three copies | Land the helper here with a single-definition-site test; siblings import |
| Dependency | Catalog integrity track's gated validator | The catalog denominator is only as good as an ungated catalog | Derive primarily from live registries; treat the catalog as widening-only and record the ceiling as a known limitation if that track slips |
| Risk | **A "move" ruling silently empties the topology gate** | The gate resolves its boundary from `<skill>/manual-testing-playbook`, and the Lane-C loader reads the same path | Treat a move as a cutover: gate, loader, and files in one commit, with a pre/post fixture count assertion |
| Risk | Filename migration breaks links outside the playbook trees | Broken docs repository-wide | Repository-wide link pass, not a playbook-scoped one; IDs frozen |
| Risk | The new validator turns four already-failing hubs into a red CI on day one | The program stalls before it starts | Land the validator and the Lane D sweep together, or stage the CI flip after the sweep; record which was chosen |
| Risk | Fixture rot — the negative fixtures are live repository files | A later phase repairs the file and the fixture stops proving anything | Copy live files into `scripts/tests/` as frozen fixtures; cite the live path in the fixture's own header as provenance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full 11-hub validation run completes fast enough to sit in pre-push without operator friction;
  if it does not, CI-only placement is acceptable and the pre-push hook keeps a single-hub scoped invocation.

### Security
- **NFR-S01**: The validator is read-only. It never writes, renames, or deletes; the Lane D sweep is a separate,
  explicitly-invoked step.
- **NFR-S02**: The evergreen-truth check must not echo the developer path it found into logs that ship — it
  reports the file and line, not the matched string.

### Reliability
- **NFR-R01**: The validator is deterministic: same tree in, same report out, no ordering dependence on
  filesystem traversal order.

---

## 8. EDGE CASES

### Data Boundaries
- A hub with no `manual-testing-playbook/` directory: exit 2 with a clear boundary error, not a silent pass.
- A playbook root with an index but zero per-feature files: bijection passes vacuously, derived census reports 0,
  and a distinct warning fires so the vacuum is visible.
- A legacy underscore playbook root name: fail closed, matching the topology gate's existing behavior.

### Error Scenarios
- Mixed-contract hub (both routing gold and operator scenarios in one tree): behavior is defined by the Q2 ruling
  and must be explicit — under the discriminator, files without the discriminator field are an error, not a pass.
- Unparseable frontmatter: a content error with its own code, never an unhandled throw.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | New validator + tests, 2 template amendments, 11 roots, 10 renames, CI wiring |
| Risk | 16/25 | Breaking: possible fixture cutover; shared CI gate; no auth or data surface |
| Research | 10/20 | Two rulings need adjudication; the required-field enumeration needs settling |
| Multi-Agent | 4/15 | Single-workstream, four sequential lanes |
| Coordination | 10/15 | Blocks both siblings; shared helper with three other tracks; consumed by a WS1 packet |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A "move" ruling empties the topology gate and changes what the Lane-C loader reads | H | M | One-commit cutover with pre/post fixture-count assertion |
| R-002 | Filename migration breaks links outside the playbook trees | M | M | Repository-wide link pass; IDs frozen |
| R-003 | Validator lands fail-closed and immediately reds CI for four hubs | M | H | Sequence the CI flip after the Lane D sweep; record the choice |
| R-004 | Three tracks ship three count-derivation helpers | M | M | Single-definition-site test; Q1 ruling |
| R-005 | Negative fixtures rot as later phases repair the live files they were copied from | L | H | Frozen copies under `scripts/tests/` with provenance headers |
| R-006 | The required-content field count is ambiguous, so REQ-005 under- or over-enforces | M | M | Enumerate against SKILL.md §3 as an explicit first-lane deliverable before writing the check |

---

## 11. USER STORIES

### US-001: A release operator trusts a coverage number (Priority: P0)

**As a** release operator, **I want** a playbook root's stated scenario count to be derived from the tree, **so that**
I can read a readiness claim without independently recounting the files.

**Acceptance Criteria**:
1. Given a root whose stated census disagrees with the walked tree, When the validator runs, Then it exits 1 and
   names the file and the two numbers.

### US-002: A playbook author gets told what is wrong before review (Priority: P0)

**As a** playbook author, **I want** the contract checked mechanically, **so that** a missing section or a forbidden
verdict is caught at authoring time rather than by a reviewer's eye or not at all.

**Acceptance Criteria**:
1. Given a new per-feature file missing `## 5. SOURCE METADATA`, When the validator runs, Then it exits 1 with a
   section-structure error naming the missing section.

### US-003: A maintainer distinguishes the two contracts (Priority: P1)

**As a** maintainer reading a red gate, **I want** the report to name which contract it checked, **so that** a
0-of-42 score is never again mistaken for a quality signal.

**Acceptance Criteria**:
1. Given any report from either validator, When it is read, Then the contract it enforces is named in the output.

---

## 12. OPEN QUESTIONS

- **OPERATOR-DECISION Q2** — corpus split: frontmatter discriminator or file move? Gates Lane A's shape.
- **OPERATOR-DECISION Q1** — where does the shared count-derivation helper live, and who builds it?
- **OPERATOR-DECISION Q7** — is `system-spec-kit`'s NOT READY reclassification stated explicitly in its root?
- **How many fields does the per-feature required-content list actually enumerate?** The synthesis calls it a
  "nine-field execution contract". The standard's §3 "Per-Feature File Responsibilities" bullet list reads as
  **11 bullets, 3 of them conditional** ("when it clarifies user intent", "when a table is used", "when
  applicable"). The unconditional set therefore reads as 8 including frontmatter. **This must be enumerated
  against the source and pinned before REQ-005 is coded**, or the check will under- or over-enforce. Recorded as
  a first-lane task, not an assumption.
- Does the CI flip land in the same commit as the Lane D sweep, or staged behind it?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (to be created — records the corpus-split ruling that both
  siblings and the WS1 harness packet cite)
- **Parent**: `sk-doc/024-playbook-scenario-coverage`
- **Governing standard**: `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`
