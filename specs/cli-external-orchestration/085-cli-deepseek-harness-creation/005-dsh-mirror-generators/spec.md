---
title: "Feature Specification: Phase 5: dsh-mirror-generators"
description: "No generator links the repo's 54 SKILL.md packets, its commands or its agents into .dsh/, so a dsh session sees no repo skill and nothing fails when a mirror drifts. This phase adds three generators with --check modes, their tests, a CI job and a runtime-mirrors doctor entry."
trigger_phrases:
  - "dsh mirror generators"
  - "phase 5 dsh mirror generators"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: dsh-mirror-generators

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 15 |
| **Predecessor** | 004-dsh-runtime-folder-and-patches |
| **Successor** | 006-deep-loop-executor-kind |
| **Handoff Criteria** | All three `sync-*-dsh.cjs --check` runs exit 0, `node --test` on the three generator tests passes and `command-tree-parity.yml` carries a `dsh-mirror` job |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Build the skill, prompt and persona generators for `.dsh/` and wire their `--check` modes into CI and the runtime-mirrors doctor. No patch, guard plugin, executor or hub file changes here.

**Dependencies**:
- `004-dsh-runtime-folder-and-patches` must have created `.dsh/`, `.dsh/SYNC.md` and the `/.dsh/skills/local-*` ignore rule

**Deliverables**:
- `.skilled/skills/system-spec-kit/runtime/cli/dsh/` with `sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, `sync-agents-dsh.cjs` and `README.md`
- Three tests under `.skilled/skills/system-spec-kit/runtime/cli/tests/`: `sync-skills-dsh.test.mjs`, `sync-prompts-dsh.test.mjs`, `sync-agents-dsh.test.mjs`
- Generated `.dsh/skills/`, `.dsh/prompts/` and `.dsh/agents/`
- A `dsh-mirror` job in `.github/workflows/command-tree-parity.yml` and the `.dsh/` mirror in the runtime-mirrors doctor asset and contract test
- An updated `.dsh/SYNC.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The harness discovers skills only at `<root>/<name>/SKILL.md` and never walks nested `**/SKILL.md`, so a whole-tree link would expose the 16 hub folders and hide the nested mode packets. It has no file loader for commands or agents either. Without generators the `.dsh/` mirrors would be hand-made and nothing would fail when they drift from `.skilled/`.

### Purpose
Every repo skill, command and agent reaches a dsh session through a generated `.dsh/` mirror, and CI fails when any mirror drifts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ ls .dsh 2>&1; ls .skilled/skills/system-spec-kit/runtime/cli/dsh 2>&1
ls: .dsh: No such file or directory
ls: .skilled/skills/system-spec-kit/runtime/cli/dsh: No such file or directory

$ find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l
      54

$ rg -n 'mirror' .github/workflows/command-tree-parity.yml
100:  hermes-mirror:
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Generate one symlink per `SKILL.md` directory under `.dsh/skills/`, enumerated at run time, with a printed exclusion list and a duplicate-name failure.
- Generate flattened prompt templates from `.skilled/commands/**` under `.dsh/prompts/`.
- Generate one persona patch per `.skilled/agents/*.md` under `.dsh/agents/`, each replacing the `system-prompt` row's `personaPrefix`.
- Give each generator a `--check` mode and wire all three into a `dsh-mirror` CI job and the runtime-mirrors doctor.
- Record the three mirrors in `.dsh/SYNC.md`.

### Out of Scope
- Route, lineage and guards patches - phase 004 and phase 008 own them
- The executor kind and fan-out builder - phase 006 owns them
- Loading the farm in a keyed session to confirm about 54 skills load - phase 013 answers it with a provider key

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs` | Create | Per-skill symlink farm generator with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs` | Create | Flattened prompt template generator with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` | Create | Persona patch generator with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/README.md` | Create | Usage and drift-check notes for the three generators |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-dsh.test.mjs` | Create | Farm tests, including duplicate-name and long-description cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-dsh.test.mjs` | Create | Prompt generator tests |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-dsh.test.mjs` | Create | Persona generator tests |
| `.dsh/skills/`, `.dsh/prompts/`, `.dsh/agents/` | Create | Generated mirrors |
| `.github/workflows/command-tree-parity.yml` | Modify | Add the `dsh-mirror` job beside `hermes-mirror` |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modify | Add the `.dsh/` mirror |
| `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | Modify | Cover the `.dsh/` mirror |
| `.dsh/SYNC.md` | Modify | Name the three generated mirrors with mechanism and source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` exits 0, and the count of `.dsh/skills/*` equals `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' \| wc -l` minus the exclusions the generator prints |
| REQ-002 | `sync-prompts-dsh.cjs --check` and `sync-agents-dsh.cjs --check` both exit 0 |
| REQ-003 | `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs` passes, including a duplicate-name case and an over-500-character description warning case |
| REQ-004 | `ls .dsh/skills/*/SKILL.md \| wc -l` equals `ls -d .dsh/skills/*/ \| wc -l`, so every farm entry resolves through its link |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `rg -n 'dsh-mirror' .github/workflows/command-tree-parity.yml` matches, and `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` passes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: All three generators exit 0 in `--check` mode on a clean tree, and exit non-zero after one mirror entry is deleted.
- **SC-002**: The `dsh-mirror` CI job and the runtime-mirrors doctor contract test both fail on a drifted `.dsh/` mirror and pass on a regenerated one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.dsh/` and its `local-*` ignore rule from phase 004 | The farm has no home and git cannot stage links beneath a symlinked folder | Start only after `ls .dsh/SYNC.md` and `git check-ignore -q .dsh/skills/local-probe` both succeed |
| Risk | Two packets share a frontmatter `name` | One skill silently shadows the other in the harness catalog | The generator exits non-zero on a duplicate name, and a test covers it |
| Risk | A description over 500 characters | The harness truncates it in the catalog | The generator prints a warning per long description, and a test covers it |
| Risk | Nested mode packets are missed | Only the 16 hubs reach the session | Enumerate every `SKILL.md` at run time, never hard-code a count |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each generator's `--check` run finishes in under 5 seconds on the current tree.
- **NFR-P02**: N/A: the generators run on demand and in CI, not as a service, so throughput does not apply.

### Security
- **NFR-S01**: The generators read only `.skilled/` and write only under `.dsh/`, and never read `.env` or `$DSH_HOME`.
- **NFR-S02**: Every farm link is relative and points inside the repository.

### Reliability
- **NFR-R01**: Two consecutive generator runs produce no diff (`git status --porcelain .dsh` prints nothing after the second run).
- **NFR-R02**: `--check` writes nothing and exits non-zero on any drift.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a source tree with no `SKILL.md` produces an empty farm and `--check` exits 0.
- Maximum input: every `SKILL.md` under `.skilled/skills`, 54 today, gets one link, and a description over 500 characters prints a warning without failing.
- Failure path: a duplicate frontmatter `name` or a stale link makes the generator exit non-zero and name the offending path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 11 authored files plus three generated folders, two systems (spec-kit CLI, CI) |
| Risk | 8/25 | Generated output only, no runtime path changes, drift caught by `--check` |
| Research | 4/20 | Settled in phase 001, precedent in the Hermes and Pi generators |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which packets, if any, the skill generator excludes. Decision: the generator prints every exclusion with its reason, and REQ-001 counts against that printed list.
- Whether about 54 linked skills load in one session. Decision: phase 013 answers it with a provider key, this phase does not claim it.
<!-- /ANCHOR:questions -->

---
