---
title: "Feature Specification: Phase 13: purpose-docs-and-backfill"
description: "No catalog entry, playbook scenario, injection contract or root README passage names the purpose line, and eight phase parents still state a layout note instead of a purpose. This phase writes the docs and the eight purpose sentences, and corrects three earlier ones."
trigger_phrases:
  - "purpose docs and backfill"
  - "phase 13 purpose docs and backfill"
  - "purpose line feature catalog"
  - "purpose line playbook scenarios"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: purpose-docs-and-backfill

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/376-dsh-single-executor-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-purpose-reader-precision |
| **Successor** | None |
| **Handoff Criteria** | `scratch/check-parents.mjs` prints `layout sentence as purpose: 0 of 11`, the catalog and playbook validators pass, and the operator has approved every sentence in `scratch/sentences.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: Documentation and authored sentences only. Eleven parent `spec.md` files, the system-spec-kit feature catalog and playbook, `.skilled/hooks/injection-contract.md`, the root `README.md` and `runtime/lib/README.md`. No code changes.

**Dependencies**:
- Phase 012 is built. The docs describe the reader as phase 012 leaves it, where the opening paragraph of a combined section is the problem.
- The operator approves each sentence in `scratch/sentences.md` before it is applied, as in phase 011.

**Deliverables**:
- Eight layout-sentence parents and three reserved parents with a real purpose sentence
- One feature catalog entry and five playbook scenarios, one per hop
- The `## Packet Purpose` section named in the injection contract, one sentence in each of six root README passages and the corrected library index row
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An operator or a model reading the docs cannot learn that every hop carries the packet's purpose, because no feature catalog entry, playbook scenario, injection contract section or root README passage names it. Eight deep-loop phase parents still state the layout sentence where their purpose belongs, so once phase 012 skips that sentence they carry their grandparent's purpose. Three purpose sentences written in phase 011 also overclaim or describe layout, one of them a fact that the packet's own synthesis contradicts.

### Purpose
Document the purpose line on every hop and give each of the eleven parents a purpose sentence the operator approved, so the feature is findable and what it carries is true.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run from the worktree root on 2026-11-14 at `1bedb33577` with the runtime `dist/` current, before phase 012 is built. The first prints each parent's purpose source and sentence, cut here to the summary line. The other four are the catalog and playbook baselines and the search for any doc that names the purpose line.
```text
$ node <013>/scratch/check-parents.mjs | tail -1
layout sentence as purpose: 8 of 11

$ python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-spec-kit | head -2
PACKAGE system-spec-kit: PASS tier=fail violations=0
NOTE: 4 violation(s) (0 fail, 0 warn, 4 note):

$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook | head -1
PASS package=system-spec-kit tier=FAIL_CLOSED scenarios=119 categories=9 operator=105 routing_gold_excluded=14 violations=0 warnings=2

$ rg -l 'Packet Purpose|packet_purpose|Parent purpose \(' .skilled/skills/system-spec-kit/feature-catalog .skilled/skills/system-spec-kit/manual-testing-playbook .skilled/hooks/injection-contract.md README.md

$ rg -n -F "for the post-compaction context" .skilled/skills/system-spec-kit/runtime/lib/README.md
118:| `spec/packet-purpose.ts` | Reads a packet's one-sentence purpose for the post-compaction context. |
```
The fourth search printed nothing. Each of the eleven parents passes `validate.sh --strict --quiet` today with `errors=0 warnings=0`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope

Each item names its source: Fable for the independent Fable 5.2 review, deep review for the five-iteration `/deep:review` whose report is `../review/review-report.md`.

| Item | Severity | Source | Change |
|------|----------|--------|--------|
| B1 | P1 | Fable A-P1-2 | Replace the layout sentence with an approved purpose sentence in the eight parents under `specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/` |
| B2 | P1 | Fable A-P1-3, deep review R2-P2-002 | Add the `packet-purpose-carry` feature catalog entry and its root catalog section, and link it from the two existing hop entries |
| B3 | P1 | Fable A-P1-3, deep review R2-P2-002 | Add five playbook scenarios, one per hop: resume, relaunch, Claude compaction, Pi compaction and save, with their five root index rows |
| B4 | P1 | Fable A-P1-3 | Name the `## Packet Purpose` section in the injection contract's Session Start Context and Post-Compaction Recovery entries |
| B5 | P1 | Fable A-P1-3, deep review R2-P2-002 | Add one sentence to each of the six root README passages Fable names, lines 45, 522, 548, 1052, 1175 and 1199 |
| B6 | P2 | deep review R4-P2-001 | Name both readers of `packet-purpose.ts` in `runtime/lib/README.md:118` |
| B7 | P2 | Fable, three reservations | Replace the phase 011 sentences in `005-smart-rule-injection`, `001-on-write-quality` and `sk-design/020-chart-and-diagram-review` |

The draft sentences for B1 and B7 are in `scratch/sentences.md`. B7's `sk-design/020` reservation is now checked: its `synthesis.md` names one model that produced reports, so the draft drops "on two models".

### Out of Scope
- Code changes - phase 012 owns the reader, the hooks and the hop rules.
- The three existing relaunch scenarios at `manual-testing-playbook.md:303` - B3's five new scenarios cover the purpose line on every hop, and the relaunch scenarios test the hop mechanics, which did not change.
- The five packets that lose their only line in phase 012 - a purpose for them is new authoring in five unrelated packets. `spec.md` section 10 asks the operator.
- The `sk-design/020` title, which also says "on two models" - one title line in another packet. `spec.md` section 10 asks the operator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/00{1..8}-*/spec.md` | Modify | B1, line 37 of each of the eight |
| `specs/hooks-plugins-extensions/hook-injection-pipeline/005-smart-rule-injection/spec.md` | Modify | B7 |
| `specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/spec.md` | Modify | B7 |
| `specs/sk-design/020-chart-and-diagram-review/spec.md` | Modify | B7 |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/packet-purpose-carry.md` | Create | B2 per-feature entry |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | B2 root section |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modify | B2 one sentence and a link |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` | Modify | B2 one sentence and a link |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/packet-purpose-{resume,relaunch,claude-compaction,pi-compaction,save}.md` | Create | B3, five scenario files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | B3 five root rows |
| `.skilled/hooks/injection-contract.md` | Modify | B4 |
| `README.md` | Modify | B5 |
| `.skilled/skills/system-spec-kit/runtime/lib/README.md` | Modify | B6 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the eleven parents states its own purpose in a sentence the operator approved, and none states the layout sentence (B1, B7) |
| REQ-002 | The feature catalog has one entry for the purpose line, listed in the root catalog and linked from both hop entries, and the package validator still passes (B2) |
| REQ-003 | The playbook has one scenario per hop for the purpose line, listed in the root index, and the package validator passes with five more scenarios (B3) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The injection contract names the `## Packet Purpose` section where it describes the compaction output (B4) |
| REQ-005 | Each of the six root README passages carries one sentence on the purpose line (B5) |
| REQ-006 | The library index names both readers of `packet-purpose.ts` (B6) |
| REQ-007 | Every changed parent still passes `validate.sh --strict --quiet` with its baseline counts, and no doc names a hop that does not print the line |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `check-parents.mjs` goes from `layout sentence as purpose: 8 of 11` to `0 of 11`, with `packet` on all eleven lines.
- **SC-002**: The playbook validator goes from `scenarios=119` to `scenarios=124` with `violations=0`, and the catalog validator stays at `violations=0`.
- **SC-003**: The fourth Measured Behavior search goes from no output to a line for each of the catalog, the playbook, the injection contract and the root README.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 012 | Built out of order, the docs describe a rule the reader does not follow yet | T001 checks that phase 012's reader is built before any doc edit |
| Risk | A drafted sentence misstates what a parent is for | Medium. The line is carried into every hop | The operator approves each sentence before E1 to E11, and each draft names the children it was read from |
| Risk | A runtime list in a doc names a hop that prints no line | Low. Devin and OpenCode print none | T004 reads the adapters and the docs name only Claude, Codex, Pi and DSH for the compaction line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

### Performance
- **NFR-P01**: N/A. Docs and authored sentences only. No code path changes.

### Security
- **NFR-S01**: No doc prints a secret, a home path or a session id. Scenario commands use repo-relative paths.

### Reliability
- **NFR-R01**: Each new sentence follows the voice rules: plain short sentences, no em dash, no semicolon and no serial comma.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: the operator rejects a sentence. That parent keeps its current text, and `goal.md` records it.
- Maximum input: a sentence over 300 characters is cut by the reader. Every draft is under 260.
- Failure path: a validator that loses its PASS line stops the phase. Revert the one file it names.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 25 files, six of them new docs, about 420 lines |
| Risk | 5/25 | Docs only. The sentences are reviewed before they land |
| Research | 6/20 | Each sentence needs its children read, done for the drafts |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does the operator approve the eleven sentences in `scratch/sentences.md`? This blocks E1 to E11.
- Should the five packets that lose their only line in phase 012 get a purpose sentence here? Default taken: no, they are five unrelated packets.
- Should the `sk-design/020` title lose "on two models" as well? Default taken: no, it is outside this phase's file list. It is one line if the operator wants it.
- Deep-review findings: folded in. R2-P2-002 is items B2, B3 and B5 here, and R4-P2-001 is B6. The other five findings of `../review/review-report.md` belong to phase 012.
<!-- /ANCHOR:questions -->

---
