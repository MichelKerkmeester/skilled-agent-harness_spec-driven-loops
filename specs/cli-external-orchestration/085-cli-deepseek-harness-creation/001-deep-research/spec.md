---
title: "Feature Specification: Phase 1: deep-research"
description: "Two-lineage deep research on adding DeepSeek Harness (dsh 0.2.2-rc.1) as the cli-deepseek-harness runtime mode, ten angles per lineage, merged into one synthesis and a ranked plan for phases 002 to 014."
trigger_phrases:
  - "deep research"
  - "phase 1 deep research"
  - "deepseek harness deep research"
  - "dsh research lineages"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: deep-research

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
| **Phase** | 1 of 15 |
| **Predecessor** | None |
| **Successor** | 002-dsh-offline-contract-pin |
| **Handoff Criteria** | `research/research.md` and `research/phase-plan.md` exist, both lineages succeeded with ten iterations each and the research config status is `complete` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Read-only research of the dsh source clone, the installed package and this repository's runtime surfaces, written only under `research/`. No repository file outside this phase folder changed.

**Dependencies**:
- None. This is the first phase. It used `research-angles.md` and `resource-map.md` as its brief.

**Deliverables**:
- `research/research.md` (merged synthesis) and `research/phase-plan.md` (ranked phases 002 to 014)
- `research/findings-registry.json`, `research/orchestration-summary.json` and the per-lineage iteration files under `research/lineages/`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nobody had mapped how DeepSeek Harness could become a governed runtime mode in this repository. Its headless contract, provider routing, skill loading, plugin seams and fan-out needs were unknown, so no build phase could be scoped without guessing.

### Purpose
One evidence-cited synthesis and one ranked phase plan settle the mode id, the dispatch contract and the build order for phases 002 to 014.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Deep Research Findings

Two ten-iteration lineages, GPT-6 Luna on cli-codex and DeepSeek V4.1 Flash on cli-opencode, covered every angle twice and merged into 145 key findings. Full synthesis: `research/research.md`. Phase plan: `research/phase-plan.md`.

- **Mode id:** `cli-deepseek-harness`, binary `dsh`, repo folder `.dsh/`, because "deepseek" already names a model family on three existing modes.
- **Dispatch:** `dsh --profile headless --json` with the prompt on stdin through a trailing `-`, a route patch and a lineage patch on every call, `--approval-policy never`.
- **Plugins:** a relative plugin path inside a `--patch` file resolves next to that file, so one repo-guards plugin under `.dsh/plugins/` loads with no install. The experimental Claude hook bridge is not in the installed package.
- **Keys:** headless disables the credential store and reads the environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. A dispatch from the repo root would read this repo's `.env`, so lineages run elsewhere.
- **Risks:** no keyed run exists yet, the harness default route is `deepseek-official`, the package is a moving release candidate, and npm skipped the `koffi` and `node-pty` install scripts.
- **Still UNKNOWN until a key is configured:** the OpenCode Go endpoint, sandbox confinement on macOS, whether `bash` spawns, and real latency and cost. Phase 013 answers them.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research
$ node -e 'const s=require("./orchestration-summary.json"),c=require("./deep-research-config.json"),r=require("./findings-registry.json");console.log(JSON.stringify({succeeded:s.succeeded,total:s.total,failed:s.failed,configStatus:c.status,iterations:r.metrics.iterationsCompleted,keyFindings:r.metrics.keyFindings,convergence:r.metrics.convergenceScore}))'
{"succeeded":2,"total":2,"failed":0,"configStatus":"complete","iterations":20,"keyFindings":145,"convergence":0.875}
exit=0
```
Both lineages succeeded, 20 iterations ran and 145 key findings merged (run 2026-11-06).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run two research lineages of ten iterations each, one on `cli-codex` `gpt-6-luna` and one on `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` at `max`.
- Cover ten angles: headless contract, providers and reasoning, profiles and `$DSH_HOME`, skills, agents and commands and goal, plugins and guards, third-party Pi plugins, MCP, deep-loop fan-out and constraints.
- Merge both lineages into one findings registry and resolve their conflicts against the harness source.
- Write `research/research.md` and `research/phase-plan.md`.

### Out of Scope
- Any keyed provider call to dsh - no key was configured, and phase `013-dsh-live-contract-pin` owns live checks.
- Any repository change outside this phase folder - build work starts in phase 002.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-deep-research/research/research.md` | Create | Merged two-lineage synthesis |
| `001-deep-research/research/phase-plan.md` | Create | Ranked phases 002 to 014 with acceptance criteria |
| `001-deep-research/research/lineages/**` | Create | Per-lineage iterations, registries and state |
| `001-deep-research/research/{findings-registry,orchestration-summary,deep-research-config}.json` | Create | Merged registry, run summary and config |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `research/orchestration-summary.json` reports `succeeded` 2 of `total` 2 and `failed` 0 |
| REQ-002 | `research/findings-registry.json` reports `iterationsCompleted` 20 and a non-empty `keyFindings` list |
| REQ-003 | `research/research.md` and `research/phase-plan.md` exist and the plan lists phases 002 to 014 with acceptance criteria |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `research/deep-research-config.json` has `status` `complete` and the state log holds a `synthesis_complete` event |
| REQ-005 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The run summary shows 2 of 2 lineages succeeded with 20 iterations in all.
- **SC-002**: `rg -c '^### 0' research/phase-plan.md` prints 13, one section per planned phase.
- **SC-003**: The merged registry holds 145 key findings with a convergence score of 0.875.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The read-only dsh source clone at commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` | Without it lineage conflicts could not be settled | The synthesis cites the clone for every load-bearing conflict |
| Risk | Lineages disagree on load-bearing facts | Med | Twelve conflicts were recorded and resolved against the source or a live read in research section 10 |
| Risk | A probe writes into `~/.dsh` | Med | Recorded as conflict C11. Every later probe must use a disposable `DSH_HOME` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each lineage stays within ten iterations, enforced by `maxIterations` 20 across two lineages.
- **NFR-P02**: N/A for runtime throughput. The phase produced documents only.

### Security
- **NFR-S01**: No API key or `.env` content appears in `research/`. A scan for key-shaped strings returned no file.
- **NFR-S02**: The research made no keyed provider call to dsh.

### Reliability
- **NFR-R01**: Every load-bearing claim cites the dsh source clone, a repository path or a live read.
- **NFR-R02**: Claims that need a model turn are marked `documented, unconfirmed`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a lineage with no findings would leave the registry short. Both lineages produced findings.
- Maximum input: the run stopped at `maxIterationsReached` after 20 iterations.
- Failure path: a failed lineage would show in `failure_classes`. All classes are 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One research folder, no repository code |
| Risk | 6/25 | Read-only work, home isolation the only hazard |
| Research | 18/20 | Ten angles across two executors and a large harness source |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which OpenCode Go endpoint authenticates for the harness? Kept UNKNOWN and assigned to phase 013.
- Does the bash tool spawn after npm skipped the `koffi` and `node-pty` install scripts? Kept UNKNOWN and assigned to phase 013.
<!-- /ANCHOR:questions -->

---

