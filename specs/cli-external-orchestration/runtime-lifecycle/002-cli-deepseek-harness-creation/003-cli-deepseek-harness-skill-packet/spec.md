---
title: "Feature Specification: Phase 3: cli-deepseek-harness-skill-packet"
description: "Author the cli-deepseek-harness mode packet with sk-create-skill: SKILL.md, ROUTER.md, README.md, eleven fail-closed hard rules, six references that match the phase 002 evidence, prompt templates and a first changelog entry, not yet registered in the hub."
trigger_phrases:
  - "cli deepseek harness skill packet"
  - "phase 3 cli deepseek harness skill packet"
  - "cli-deepseek-harness hard rules"
  - "dsh skill packet references"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: cli-deepseek-harness-skill-packet

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 15 |
| **Predecessor** | 002-dsh-offline-contract-pin |
| **Successor** | 004-dsh-runtime-folder-and-patches |
| **Handoff Criteria** | `sk-skill-check.cjs` reports no errors for the packet, `hard-rules.json` carries all eleven rule ids and every flag in `references/cli-reference.md` appears in the phase 002 help capture |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Create the `cli-deepseek-harness` packet folder and its contents only. Hub registration, advisor routing and the playbook belong to later phases, so no hub file changes here.

**Dependencies**:
- `002-dsh-offline-contract-pin` (the `evidence/headless-help.txt`, `dump-config-*.txt` and keyless failure captures every reference cites)

**Deliverables**:
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`, `ROUTER.md`, `README.md`, `hard-rules.json`
- `references/cli-reference.md`, `providers-and-models.md`, `runtime-folder-and-sync.md`, `guards-and-hooks.md`, `mcp.md`, `fanout-executor.md`
- `assets/` prompt templates and the first `changelog/` entry
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No skill packet tells a caller how to compose a dsh dispatch or which rules a dispatch must obey. Without one, each caller invents its own command line and can miss the route patch, run from the repo root where headless loads `<cwd>/.env`, or reach the base default `deepseek-official` route. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:152]

### Purpose
One packet states the headless dispatch contract, the closed two-route roster and eleven fail-closed hard rules, each claim traceable to phase 002 evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/cli-external-orchestration/cli-deepseek-harness
ls: .skilled/skills/cli-external-orchestration/cli-deepseek-harness: No such file or directory
$ ls -d .skilled/skills/cli-external-orchestration/cli-*/
.skilled/skills/cli-external-orchestration/cli-claude-code/
.skilled/skills/cli-external-orchestration/cli-codex/
.skilled/skills/cli-external-orchestration/cli-cursor/
.skilled/skills/cli-external-orchestration/cli-devin/
.skilled/skills/cli-external-orchestration/cli-hermes/
.skilled/skills/cli-external-orchestration/cli-opencode/
.skilled/skills/cli-external-orchestration/cli-pi/
```
Seven mode packets exist and none for dsh (run 2026-11-06).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `SKILL.md`, `ROUTER.md` and `README.md` for mode `cli-deepseek-harness` with `sk-create-skill`.
- Write `hard-rules.json` with the eleven rule ids from research section 11, each with a check a preflight can run.
- Write six references that cite phase 002 evidence for every flag and composition claim.
- Add prompt templates under `assets/` and the first changelog entry with `sk-create-changelog`.

### Out of Scope
- Hub registration in `mode-registry.json`, `hub-router.json` and the advisor - phase `011-hub-registration-and-routing` owns it after the executor exists.
- The `.dsh/` folder and its patches - phase `004-dsh-runtime-folder-and-patches`.
- The manual testing playbook - phase `014-playbook-docs-and-closeout`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Create | Mode contract, dispatch shape, roster, hard-rule summary |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/ROUTER.md` | Create | Intent to resource map for the packet |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/README.md` | Create | Operator entry point |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Create | Eleven fail-closed rules with check ids |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/*.md` | Create | Six references listed under Deliverables |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/assets/*` | Create | Prompt templates |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/changelog/*` | Create | First changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness` reports no errors |
| REQ-002 | `hard-rules.json` parses with `node -e 'JSON.parse(require("fs").readFileSync(process.argv[1]))' <file>` and `rg` finds all eleven ids: `headless-only`, `stdin-dash-required`, `route-patch-required`, `closed-roster`, `approval-never-required`, `dsh-home-isolated`, `lineage-patch-required`, `json-final-and-exit-required`, `pinned-version-required`, `no-repo-root-dotenv`, `mcp-opt-in-only` |
| REQ-003 | Every flag named in `references/cli-reference.md` appears in `002-dsh-offline-contract-pin/evidence/headless-help.txt`, proved by a scripted `rg` loop that exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `references/providers-and-models.md` lists exactly two roster routes, LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`, and marks the OpenCode Go endpoint UNKNOWN |
| REQ-005 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-skill-check.cjs` on the packet exits 0 with no error lines.
- **SC-002**: `rg -c` for the eleven rule ids over `hard-rules.json` finds each id at least once.
- **SC-003**: The flag loop over `references/cli-reference.md` against the phase 002 help capture exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 evidence under `002-dsh-offline-contract-pin/evidence/` | Without it REQ-003 cannot run and references would cite docs only | Start this phase only after phase 002 closes, and cite each capture by file name |
| Risk | Hard rules drift from observed behavior | Med | Each rule names the evidence file that motivated it, and the flag loop fails on any flag the help text lacks |
| Risk | The packet routes before the executor exists | Low | No hub file changes in this phase, so the mode stays unselectable until phase 011 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `SKILL.md` stays within the size budget `sk-skill-check.cjs` enforces, with detail moved to `references/`.
- **NFR-P02**: The packet loads progressively. Only `SKILL.md` and the CLI reference are needed for a plain dispatch.

### Security
- **NFR-S01**: No API key, `.env` content or credential value appears in the packet. Key names appear only as env variable names.
- **NFR-S02**: The `no-repo-root-dotenv` rule tells callers never to run dsh with the repo root as cwd.

### Reliability
- **NFR-R01**: Every claim only a keyed run can confirm is marked `documented, unconfirmed` until phase 013.
- **NFR-R02**: The packet names the pinned version `0.2.2-rc.1` in one place that `pinned-version-required` checks.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a dispatch with no route patch is refused by `route-patch-required` before dsh starts.
- Maximum input: N/A. The packet documents a contract and runs no workload.
- Failure path: a dsh version other than `0.2.2-rc.1` fails `pinned-version-required` and the caller is told to re-pin.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 15 new files in one packet folder, no edits elsewhere |
| Risk | 8/25 | Docs and JSON only, no runtime behavior changes |
| Research | 4/20 | Settled in phase 001 and pinned in phase 002 |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which OpenCode Go endpoint authenticates for the harness, `/inference/go/openai/v1` or `/zen/go/v1`? The packet marks it UNKNOWN and phase 013 answers it.
- Does the packet need a `benchmark/` index like `cli-pi`? Answered at authoring time: no. `sk-create-skill` pairs `benchmark/` with a `manual-testing-playbook/` once a skill is benchmarked, and the playbook belongs to phase `014-playbook-docs-and-closeout`, so both wait for it.
<!-- /ANCHOR:questions -->

---

