---
title: "Feature Specification: Phase 4: dsh-runtime-folder-and-patches"
description: "Create the repo-root .dsh/ folder with one route patch per roster entry, a lineage patch, SYNC.md, README.md and a .gitignore rule for local skill links, each patch composing cleanly under a disposable DSH_HOME."
trigger_phrases:
  - "dsh runtime folder and patches"
  - "phase 4 dsh runtime folder and patches"
  - "dsh route patch"
  - "dsh lineage patch"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: dsh-runtime-folder-and-patches

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
| **Phase** | 4 of 15 |
| **Predecessor** | 003-cli-deepseek-harness-skill-packet |
| **Successor** | 005-dsh-mirror-generators |
| **Handoff Criteria** | Both route patches compose with the lineage patch under a disposable `DSH_HOME` with the expected provider and model and no unmatched-target warning, and `SYNC.md` names every top-level `.dsh/` entry |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: The `.dsh/` folder skeleton, its two route patches, its lineage patch, its two docs and one `.gitignore` rule. Generated mirrors, the guards patch and the MCP patch belong to phases 005, 008 and 010.

**Dependencies**:
- `002-dsh-offline-contract-pin` (the draft patches and `--dump-config` captures these patches promote)
- `003-cli-deepseek-harness-skill-packet` (the hard rules and `references/runtime-folder-and-sync.md` the folder must match)

**Deliverables**:
- `.dsh/patches/route-llmgateway-deepseek.patch.yml`, `.dsh/patches/route-opencode-go-deepseek.patch.yml`, `.dsh/patches/lineage.patch.yml`
- `.dsh/SYNC.md` and `.dsh/README.md`
- `.gitignore` rule `/.dsh/skills/local-*`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No checked-in patch selects a roster route for dsh today. Without one every dispatch reaches the base default `deepseek-official` route, and a wrong row id in a patch becomes a silent no-op that the loader only warns about. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:81]

### Purpose
The repo holds one reviewed route patch per roster entry and one lineage patch, each proven to compose with the expected provider and model and no unmatched-target warning.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .dsh
patches
README.md
SYNC.md
$ git check-ignore -v .dsh/skills/local-probe; echo $?
.gitignore:234:/.dsh/skills/local-*	.dsh/skills/local-probe
0
```
Rerun 2026-11-06 at closeout and saved in `evidence/checks.txt`. At planning time the same day `ls .dsh` reported no such directory and `git check-ignore` exited 1.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the LLM Gateway and OpenCode Go route patches, each replacing the `agent-default-model` row and supplying one `llm-pi-ai` provider row.
- Write the lineage patch that sets telemetry to `DISABLED` and disables `session-log-deepseek`, `goal-round-driver` and `plan-mode`.
- Write `SYNC.md` naming every top-level `.dsh/` entry with its mechanism and source, and `README.md` as the operator entry point.
- Add `/.dsh/skills/local-*` to `.gitignore`.

### Out of Scope
- Generated `skills/`, `prompts/` and `agents/` mirrors - phase `005-dsh-mirror-generators`.
- `guards.patch.yml` and `plugins/repo-guards/` - phase `008-dsh-repo-guards-safety-wave`.
- `mcp-code-mode.patch.yml` - phase `010-dsh-mcp-code-mode`.
- Live route answers and compat flag tuning - phase `013-dsh-live-contract-pin`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | Create | LLM Gateway provider row and `agent-default-model` for `deepseek-v4.1-flash-1017` |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | Create | OpenCode Go provider row and `agent-default-model` for `deepseek-v4.1-flash` |
| `.dsh/patches/lineage.patch.yml` | Create | Telemetry off, session log off, goal round driver and plan mode off |
| `.dsh/SYNC.md` | Create | Derivation inventory and drift checks |
| `.dsh/README.md` | Create | Operator entry point |
| `.gitignore` | Modify | Add `/.dsh/skills/local-*` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For each route patch, `DSH_HOME=$(mktemp -d) dsh --profile headless --patch .dsh/patches/<route> --patch .dsh/patches/lineage.patch.yml --dump-config </dev/null` shows the expected provider and model and prints no unmatched-target warning on stderr |
| REQ-002 | `rg -n -i 'api_?key\|secret\|token' .dsh/patches` matches only `apiKeyEnv` lines that name `LLMGATEWAY_API_KEY` or `OPENCODE_API_KEY` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `git check-ignore -q .dsh/skills/local-probe` exits 0 |
| REQ-004 | `SYNC.md` names every top-level entry under `.dsh/` with its mechanism and source, proved by a loop of `ls .dsh` against `rg` over `SYNC.md` that exits 0 |
| REQ-005 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two `--dump-config` runs, one per route, each name their route's provider and model and leave stderr free of unmatched-target warnings.
- **SC-002**: The secret scan over `.dsh/patches` returns only the two `apiKeyEnv` lines.
- **SC-003**: `git check-ignore -q .dsh/skills/local-probe` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 draft patches and captures | Without them the row ids are unverified and the patches may be no-ops | Promote the drafts that phase 002 proved, and rerun `--dump-config` against the checked-in files |
| Risk | A wrong row id turns a patch into a silent no-op | Med | Fail the phase on any unmatched-target warning in stderr |
| Risk | A probe writes into `~/.dsh` | Med | Every `--dump-config` runs with `DSH_HOME=$(mktemp -d)` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each `--dump-config` check finishes inside 30 seconds.
- **NFR-P02**: N/A for runtime throughput. The patches add composition rows and no service.

### Security
- **NFR-S01**: Patches name key env variables through `apiKeyEnv` only and never hold a key value.
- **NFR-S02**: `.dsh/` holds no credential, session, profile or `node_modules` tree.

### Reliability
- **NFR-R01**: The base default `deepseek-official` route is never reached when a route patch is passed.
- **NFR-R02**: Each patch uses the documented `id`, `disabled`, `config` and `insert` grammar.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a dispatch with the lineage patch and no route patch keeps the base default route, which `route-patch-required` refuses upstream.
- Maximum input: N/A. Two route patches and one lineage patch are the whole set.
- Failure path: an unknown row id prints an unmatched-target warning on stderr, and REQ-001 fails on it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Five new files under `.dsh/` and one `.gitignore` line |
| Risk | 12/25 | Silent no-op patches and route mix-ups, both caught by `--dump-config` |
| Research | 4/20 | Grammar and row ids pinned in phases 001 and 002 |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which OpenCode Go base URL goes in the route patch? Still open. The patch ships `https://opencode.ai/zen/go/v1` and the alternative stays in the research until phase 013 shows which authenticates.
- Should the route patches carry `compat.supportsDeveloperRole: false` and `compat.thinkingFormat: deepseek` now? Answered: both ship now, with a `reasoningEfforts` map and default effort `max`. Phase 013 confirms or corrects them with a keyed run.
<!-- /ANCHOR:questions -->

---

