---
title: "Feature Specification: sk-doc Template Alignment"
description: "Corrects sk-doc's feature-catalog and playbook templates against their live enforcement code: removes the false claim that catalog trigger_phrases drive skill-advisor routing (the harvester's HARVEST_SUBDIRS excludes feature-catalog dirs), makes the playbook topology validator quote-tolerant, expands the 2-value test-type taxonomy to a 12-value canonical set matching the live corpus, ships a strict package validator (router + 7-hub root-leaf bijection, source-path existence, taxonomy), and adds both create-skill parent templates to the P4 lockstep directive set so they cannot drift from the seven hub SKILL.md directives. Planning-only; depends on 002; never edits the frozen scorer trio."
trigger_phrases:
  - "sk-doc template alignment"
  - "feature catalog trigger phrases routing claim"
  - "playbook topology quote tolerance"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Feature Specification: sk-doc Template Alignment

## EXECUTIVE SUMMARY

sk-doc's feature-catalog and playbook templates make claims their live enforcement code cannot back. `feature-catalog-snippet-template.md:41` tells authors that `trigger_phrases` "drives skill-advisor routing (doc-trigger harvest...)" — but `doc-frontmatter.ts`'s harvester (`HARVEST_SUBDIRS = ['references', 'assets']`, CONFIRMED) never walks a `feature-catalog/` directory, so the claim is false for every catalog file (CF-TPL-2). `validate-playbook-topology.cjs`'s frontmatter parsing is quote-intolerant while the live Lane C loader (`load-playbook-scenarios.cjs`) already accepts quoted YAML — a copyable-template failure mode (CF-TPL-3). `validate_document.py`'s SOURCE FILES Type-column taxonomy has exactly 2 allowed values (`Automated test`, `Manual playbook`) while the live corpus carries roughly 35 descriptive values; the check is warning-only by the validator's own code comment ("de-facto stale... rather than block a third of catalogs") — CF-TPL-4 requires closing that gap with a real 12-value canonical taxonomy plus a strict package validator (router + 7-hub bijection, source-path existence, taxonomy). And the P4 lockstep directive set — the list of files that must be atomically rewritten together when a hub flips default-on — currently names only "7 SKILL.md directives," omitting both create-skill parent templates (`assets/parent-skill/scaffold/hub-skill-scaffold.md` and `assets/parent-skill/parent-skill-hub-template.md`) that will otherwise keep minting new hubs with stale opt-in wording after the fleet flips (CF-TPL-1). This packet fixes all four.

**Hard invariants:** the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) stay SHA-256-pinned and are never edited by this child; compiled routing stays byte-identical to legacy on every routing field (this child changes no routing decision at all — it corrects documentation, validator behavior, and a lockstep manifest); every change here is additive and/or a doc-truth correction with a named, trivial rollback (plain file revert); no code this child adds or edits reads under `.opencode/specs`. This child depends on `002-runtime-promotion-and-status-foundation` (the P0 foundation) and builds entirely behind the still-off `SPECKIT_COMPILED_ROUTING` flag.

> **Evidence provenance.** Findings are consolidated in `001-research/synthesis-v1.md` §2.7 (CF-TPL-1..5) and independently re-verified in `001-research/verification-v1.md`. Per `review-v1.md` §2, treat every cited `file:line` as ±2–10 and re-anchor on the SYMBOL at build time. `doc-frontmatter.ts`'s `HARVEST_SUBDIRS` exclusion and `feature-catalog-snippet-template.md:41`'s claim, and `validate_document.py`'s 2-value `allowed` taxonomy with its own "de-facto stale" code comment, were independently re-confirmed this session.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 — coverage-closure input in the P0→P4 safety graph; parallelizable with 006/007/008/010 once 002 lands |
| **Status** | Planned |
| **Created** | 2026-07-20 |
| **Branch** | `009-sk-doc-template-alignment` |
| **DAG Stage** | P3 (`001-research/synthesis-v1.md` §5 P0→P4 graph: coverage-closure join gate) |
| **Blast radius** | Low — template, validator, and manifest changes; no runtime routing code touched. The one fork with real blast-shape (REQ-001's remove-vs-extend choice on the trigger_phrases claim) is scoped to advisor routing-effect metadata, not a routing decision |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four of sk-doc's authoring templates and validators are out of sync with the code that actually enforces or consumes them. (1) `feature-catalog-snippet-template.md:41` claims per-feature `trigger_phrases` drive skill-advisor routing; `doc-frontmatter.ts`'s `listSkillDocFiles()` only walks `references/` and `assets/` subdirectories (`HARVEST_SUBDIRS`, CONFIRMED zero-hit on feature-catalog paths), so the claim misleads every catalog author. (2) `validate-playbook-topology.cjs`'s frontmatter/typed-gold regexes are quote-intolerant, while `load-playbook-scenarios.cjs` (the frozen Lane C loader) already accepts quoted YAML scalars — a template that copies quoted syntax fails topology validation even though it would load and run correctly. (3) The SOURCE FILES Type-column taxonomy is hard-capped at 2 canonical values while the live corpus actually carries roughly 35 descriptive values; `validate_document.py`'s own code comment calls this "de-facto stale" and deliberately keeps the check warning-only "rather than block a third of catalogs" — masking real drift instead of resolving it. There is also no strict package-level validator proving the catalog set is complete (router/advisor-central + exactly 7 hub-root catalogs, no orphans) or that every SOURCE FILES path exists on disk. (4) The P4 lockstep directive set — the authoritative list of files an atomic default-on wording rewrite must touch together — is currently scoped to "7 SKILL.md directives" only; both create-skill parent templates encode the same opt-in/off-by-default wording and are not in that set, so a future new hub minted after the P4 flip would still advertise stale wording.

### Purpose

Correct or remove the false trigger_phrases routing claim; make the topology validator quote-tolerant with one documented canonical serialization; replace the stale 2-value test-type taxonomy with a 12-value canonical set derived from the live corpus and ship a strict package validator that proves catalog-set completeness, source-path existence, and taxonomy conformance; and extend the documented P4 lockstep directive set to explicitly include both create-skill parent templates, backed by a normalized-parity fixture test. None of this changes a routing decision — it aligns documentation and validators with the code and corpus that already exist.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove the false `trigger_phrases`-drives-routing claim from `feature-catalog-snippet-template.md:41` (and the equivalent wording anywhere else it recurs in `feature-catalog-template.md`).
- Make `validate-playbook-topology.cjs`'s frontmatter/typed-gold parsing quote-tolerant; document one canonical typed-gold serialization; test both quoted and unquoted fixtures.
- Define a 12-value canonical test-type taxonomy from a fresh census of the live corpus's actual Type-column values; update `validate_document.py`'s `allowed` set and `feature-catalog-snippet-template.md`'s "Type column valid values" line to match.
- Ship a strict package validator: router/advisor-central + 7-hub root-leaf catalog bijection (zero orphans), SOURCE FILES path existence, and taxonomy conformance.
- Extend the documented P4 lockstep directive set to explicitly include both create-skill parent templates (`assets/parent-skill/scaffold/hub-skill-scaffold.md` active scaffold, `assets/parent-skill/parent-skill-hub-template.md` copy-from canonical); add a normalized-parity fixture test across all lockstep surfaces.
- (P1) Extend `doc-frontmatter.ts`'s harvester to feature-catalog leaves with capped, explicitly-scored inclusion, so the trigger_phrases claim can eventually become true instead of only removed.

### Out of Scope

- Editing `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs` (the frozen trio) — [why] hard invariant; `load-playbook-scenarios.cjs`'s quote-accepting behavior is cited only as the target this child's validator must match, never edited.
- Performing the P4 atomic lockstep rewrite itself — [why] that is `011-activation-cutover-p4`'s job; this child only extends the documented set 011 will consume.
- sk-code alignment authority and drift guards — [why] owned by `008-sk-code-alignment-and-drift-guards`; this child consumes 008's interface if a cross-reference is needed, never re-derives it.
- Rollback/audit mechanics and non-hub archetype policy — [why] owned by `010-rollback-audit-and-non-hub-policy`.
- Populating actual per-hub feature catalogs (the 6-of-7-hubs-missing-a-root-catalog gap) — [why] owned by `006-feature-catalogs`; this child ships the validator that will check that population, not the population itself.
- ADR-003 promotion mechanics — [why] owned by `002-runtime-promotion-and-status-foundation`; this child depends on 002 landing but does not perform the promotion.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-snippet-template.md` (~L41, ~L157) | Modify | Remove the false trigger_phrases routing-effect claim; update the Type-column valid-values list to the 12-value taxonomy |
| `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-template.md` | Modify | Sweep for the same trigger_phrases routing-effect wording and taxonomy references; align with the snippet template |
| `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs` (~L95 area, frontmatter/typed-gold regexes) | Modify | Quote-tolerant parsing; document one canonical typed-gold serialization |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` (~L715-745, `allowed` set + `off_taxonomy_validation_type`) | Modify | Replace the 2-value `allowed` set with the 12-value canonical taxonomy (`.opencode/skills/sk-doc/scripts/validate_document.py` is a symlink to this file — no separate edit needed) |
| `.opencode/skills/sk-doc/create-feature-catalog/scripts/validate_catalog_package.py` | Create | New strict package validator: router/advisor-central + 7-hub bijection, source-path existence, taxonomy |
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | Register (no content change) | Add to the P4 lockstep directive-surface manifest as the active-scaffold surface |
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md` | Register (no content change) | Add to the P4 lockstep directive-surface manifest as the copy-from canonical surface |
| `.opencode/skills/sk-doc/create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json` | Create | The authoritative lockstep directive-surface manifest (7 hub SKILL.md + 2 parent templates = 9 surfaces) that `011` will consume |
| `.opencode/skills/sk-doc/create-skill/scripts/tests/compiled-routing-lockstep-parity.test.cjs` | Create | Normalized-parity fixture test across all 9 lockstep surfaces |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts` (~L146, `HARVEST_SUBDIRS`) | Modify (P1) | Add a capped, explicitly-scored feature-catalog leaf path to the harvester |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Remove the false trigger_phrases routing-effect claim (CF-TPL-2 minimum). | `feature-catalog-snippet-template.md`'s frontmatter guidance no longer claims `trigger_phrases` "drives skill-advisor routing" for feature-catalog files; the corrected comment states the actual scope (H3-heading/navigation alignment) and, where useful, points to the surfaces the harvester does scan (`references/`, `assets/`); `feature-catalog-template.md` is swept for the same wording. |
| REQ-002 | Topology validator quote-tolerance (CF-TPL-3). | `validate-playbook-topology.cjs`'s frontmatter/typed-gold parsing accepts both quoted and unquoted YAML scalar values; one canonical typed-gold serialization is documented; a quoted-value fixture and an unquoted-value fixture both pass with identical parsed output. |
| REQ-003 | Strict package validator (CF-TPL-4 structural half). | A new validator checks (a) router/advisor-central + 7-hub root-leaf catalog bijection with zero orphans in either direction, (b) every SOURCE FILES table row's path exists on disk, and (c) every Type-column value is in the canonical taxonomy; the validator exits non-zero on any single violation and names the specific catalog/row. |
| REQ-004 | Add both create-skill parent templates to the P4 lockstep directive set (CF-TPL-1). | The documented lockstep directive-surface list (currently "7 SKILL.md directives" per `012/plan.md:172-179` and `013/spec.md`'s Exact Generated Directive contract) explicitly names both `assets/parent-skill/scaffold/hub-skill-scaffold.md` and `assets/parent-skill/parent-skill-hub-template.md`; a normalized-parity fixture test asserts all 9 lockstep surfaces (7 hub SKILL.md + 2 templates) carry byte-normalized-identical compiled-routing wording at any snapshot, failing by naming the drifted surface on any mismatch. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-005 | Test-type taxonomy 2→12 (CF-TPL-4 taxonomy half). | A fresh census of the live corpus's actual SOURCE FILES Type-column values (currently ~35 descriptive strings per `validate_document.py`'s own advisory comment) is consolidated into exactly 12 canonical buckets with zero unmapped stragglers; `validate_document.py`'s `allowed` set and the snippet template's "Type column valid values" line are both updated to the same 12-value list; the decision to keep the check warning-only or promote it to blocking is explicitly recorded, not assumed. |
| REQ-006 | Extend the frontmatter harvester to feature-catalog leaves (CF-TPL-2 stretch). | `doc-frontmatter.ts`'s `HARVEST_SUBDIRS` gains a capped, explicitly-scored feature-catalog leaf path; an invariance test proves the change does not alter ranking or scoring for any doc currently harvested from `references/` or `assets/`. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No sk-doc catalog template claims `trigger_phrases` drives routing unless the harvester (REQ-006) actually scans that path.
- **SC-002**: The topology validator accepts both quoted and unquoted typed-gold fixtures with identical parsed output; one canonical serialization is documented.
- **SC-003**: The new strict package validator reports zero catalog-bijection orphans, zero missing SOURCE FILES paths, and zero off-taxonomy Type values on a clean corpus, and correctly fails on each seeded violation class.
- **SC-004**: The P4 lockstep directive-surface manifest names all 9 surfaces (7 hub SKILL.md + 2 create-skill parent templates); the normalized-parity fixture test passes on a clean tree and fails by naming the drifted surface when one is seeded out of sync.
- **SC-005** (P1): The 12-value canonical taxonomy accounts for 100% of the live corpus's observed Type-column values with zero unmapped stragglers.
- **SC-006** (P1): The extended harvester includes feature-catalog leaves without changing the score or rank of any previously-harvested `references/`/`assets/` document.
- **SC-007**: No file in this child's diff touches `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs`; pre/post SHA-256 are unchanged.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-runtime-promotion-and-status-foundation` | This child's work is documentation/validator-only and does not strictly require 002's promoted runtime path, but is sequenced after 002 per the Phase Map to keep the P3 coverage-closure children on one consistent baseline | Confirm at build time whether any REQ genuinely blocks on 002; if none do, flag the sequencing as advisory rather than a hard gate |
| Dependency | `011-activation-cutover-p4` (Planned) | REQ-004's lockstep manifest is only useful once 011 consumes it | This child ships the manifest and parity test now; 011 is responsible for reading it during the actual P4 rewrite |
| Dependency | `013-create-skill-alignment` (Planned; renders the actual directive text into both parent templates) | The lockstep manifest (REQ-004) registers the two template *paths* before 013 has rendered their directive content | REQ-004's parity test is written to compare whatever wording exists at run time, not to assume 013's exact literal text; it fails safely (both surfaces still legacy-only) until 013 ships |
| Risk | REQ-001's "remove" choice conflicts with a later REQ-006 "extend harvester" decision | If the harvester is later extended, a prematurely-removed claim would need to be re-added, causing template churn | REQ-001's corrected wording states the *current* scope accurately without foreclosing REQ-006; if REQ-006 ships, the claim can be reinstated as now-true text, not un-reverted as a mistake |
| Risk | The 12-value taxonomy (REQ-005) undercounts or overlaps the live ~35 observed values | A stale or wrong taxonomy just relocates the "de-facto stale" problem instead of fixing it | REQ-005 requires zero unmapped stragglers as an explicit acceptance criterion, verified against a fresh census, not the ~35 figure cited in this planning doc |
| Risk | The new strict package validator (REQ-003) is stricter than the current corpus can pass | Could block a large fraction of existing catalogs on first run | Ship the validator as a reportable check first (dry-run mode listing every violation); only wire it as a blocking gate once the corpus is clean or violations are explicitly triaged |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The strict package validator and the lockstep-parity fixture test run fully offline and deterministically — no network call, no live model dispatch.

### Reversibility
- **NFR-R01**: Every change in this child is additive or a doc-truth correction (a removed/corrected claim, a widened taxonomy, a new validator, a new manifest, a new test); no existing default invocation of any touched tool changes behavior for inputs that already pass.

### Authority
- **NFR-A01**: After this child ships, the 12-value taxonomy and the lockstep directive-surface manifest are each a single source of truth; no later 015 child introduces a second, competing taxonomy or a second lockstep list.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Precondition failures
- A catalog with a SOURCE FILES row pointing at a deleted file: the strict package validator fails, naming the specific catalog and row.
- A Type-column value not in the 12-value taxonomy and not one of the ~35 census-observed strings (a genuinely new value introduced after REQ-005 ships): the validator reports it as off-taxonomy rather than silently accepting it.

### Idempotency and re-runs
- The strict package validator re-run twice on a clean corpus: identical PASS output both times.
- The lockstep-parity fixture test re-run after an unrelated hub's catalog population: passes cleanly as long as the 9 lockstep surfaces are still in sync; no ordering dependency.

### Boundary integrity
- A catalog with no corresponding hub in the 7-hub set (or a hub with no catalog): the bijection check fails, naming the specific orphan.
- A create-skill parent template edited outside the lockstep manifest's awareness: the parity test fails, naming the drifted surface, not a generic diff.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Two doc-truth corrections, one quote-tolerance fix, one taxonomy expansion, one new package validator, one new lockstep manifest + parity test |
| Risk | 8/25 | All changes are additive/doc-truth/validator-only; no routing decision or frozen-scorer edit anywhere in this child |
| Research | 7/20 | The taxonomy census (REQ-005) and the strict validator's exact bijection algorithm are the two items needing build-time investigation rather than being fully specified now |
| **Total** | **28/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the 12-value taxonomy's `off_taxonomy_validation_type` check (currently warning-only by design, per `validate_document.py`'s own comment) be promoted to blocking once REQ-005 ships, or stay advisory indefinitely? Record the decision explicitly rather than defaulting either way.
- Is the new strict package validator (REQ-003) a standalone script, or should its bijection/taxonomy logic be folded into `validate_document.py` as an additional check mode? Decide at build time based on how much cross-file state the bijection check needs versus `validate_document.py`'s current single-file scope.
- Does REQ-006's harvester extension ship in this child, or does it more properly belong to `system-skill-advisor` (the harvester's owning skill)? If the latter, REQ-006 becomes a cross-referenced dependency rather than a delivered item here — resolve before implementation starts.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` §2.7 (CF-TPL-1..5), `../001-research/verification-v1.md`, `../001-research/review-v1.md` §4
