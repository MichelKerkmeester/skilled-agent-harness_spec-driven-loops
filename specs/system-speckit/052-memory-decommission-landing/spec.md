---
title: "Feature Specification: memory decommission landing and verification "
description: "The memory-database decommission and the zvec retrieval lane existed only on a side branch while the release branch and main still carried the memory server, its hooks and its commands; this packet lands the branch, aligns the changed documents with their templates, and proves zero drift through a review loop."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: memory decommission landing and verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` via `worktrees/044-zvec-grep-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 049, 050 and 051 removed the memory database, replaced it with the trigger index and ripgrep, added a semantic lane and vendored its engine, all on a side branch. The release branch `skilled/v4.0.0.0` and `main` still registered the memory server in every runtime, shipped its hooks, plugin, launchers and commands, and were 71 commits ahead of the branch on unrelated work.

### Purpose
Both branches carry the decommission with no memory surface left, every changed document passes its template validator, and a ten-iteration review with gpt-5.6-luna finds no P0 or P1.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The branch merged into `skilled/v4.0.0.0` and fast-forwarded into `main`, with every conflict resolved toward v4's command contract and the memory removal.
- Every reference, README and command asset changed since `5220257bf7` validated against its sk-create-skill template class, with failures fixed at source.
- A `/deep:review` loop of ten iterations on the landed tree, its findings fixed and re-verified, recorded under this packet.

### Out of Scope
- Pushing either branch - needs a fresh operator go-ahead.
- Renaming the surviving engine package - its own packet, recorded as an open decision.
- Fixing validator class defects found along the way - recorded with owners, outside this packet's scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/**` frontmatter | Modify | v4's contract-shaped hints with memory tools removed from allow lists |
| `.opencode/skills/system-plugins/README.md`, `system-spec-kit/references/cli/daemon-cli-reference.md` | Modify | Overview sections the templates require |
| `specs/system-speckit/049-memory-decommission/**/{description,graph-metadata}.json` | Modify | Regenerated after the merge |
| `specs/system-speckit/052-memory-decommission-landing/review/**` | Create | Review loop lineage and report |

### Review Scope

The review loop reads this packet and must cover the landed tree these surfaces make up, all reachable from the repository root of the branch under review, with the diff `5220257bf7..HEAD` as the change set:

| Surface | What to verify |
|---------|----------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/**` and `data/trigger-index.json` | The trigger index, lookup, ripgrep lane, residue sweep, retrofit pipeline and zvec lane: correctness, exit mapping, determinism, no reference to a retired tool |
| `.opencode/skills/system-spec-kit/mcp-server/**` | The surviving engine: validation orchestrator, metadata refresh, continuity writer; nothing serves MCP, no dead import, no doc describing the retired server |
| `.opencode/commands/**`, `.opencode/agents/**`, `.claude/**`, `.codex/**`, `.pi/**`, `.cursor/**`, `opencode.json` | No memory tool in any allow list, no memory server registration, mirrors in sync, command frontmatter matching the command contract |
| `.opencode/hooks/**`, `.opencode/plugins/**`, `.opencode/bin/**` | No spec-memory hook, plugin or launcher; the skill advisor and model server untouched |
| `.opencode/skills/system-plugins/**` and `.zvec-grep-lane.json` | The vendored fork, its README, the lane config, the resolution order |
| `.opencode/commands/doctor/**` | The zvec route, the retired memory routes gone, the routes validator green |
| `.opencode/skills/**/references/**`, `README.md`, `README.txt`, `install-guides/**` | No document that presents the memory database, daemon, server or tools as existing; template conformance for changed documents |
| `specs/system-speckit/049-memory-decommission/**`, `050-*`, `051-*` | Packets validate strictly; claims match the tree |

Out of the review's write scope: everything in decision D5's preserved set, and any branch other than the one under review.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `skilled/v4.0.0.0` and `main` contain the decommission: no memory server registration, hook, plugin, launcher or retired command, and the residue sweep reports zero live records |
| REQ-002 | `validate.sh --strict` exits 0 on 049 recursively, 050 and 051 from the landed tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every document changed since `5220257bf7` under references, README files and command assets passes `validate_document.py` for its class, or the failure is a recorded validator class defect with an owner |
| REQ-004 | A ten-iteration `/deep:review` with gpt-5.6-luna at max reasoning reports no P0 or P1, each earlier finding naming its fix commit |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The merged tree passes the residue sweep, both trigger-index runs hash identically, doctor routes validate and the skill-root audit passes.
- **SC-002**: The review loop's final report reads PASS with zero P0 and zero P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex CLI logged in through ChatGPT OAuth for gpt-5.6-luna | The review loop cannot run | Ask the operator to run `codex login`; never substitute a model |
| Risk | The operator commits on v4 during the landing | Med, it happened once | Merge again from the branch side; v4 is never rewritten |
| Risk | Review findings touch the preserved set | Low | Record and hand to the owner; D5 forbids the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each review iteration finishes within the executor's 30-minute ceiling.
- **NFR-P02**: The whole loop completes inside the runtime's four-hour lineage lifetime.

### Security
- **NFR-S01**: Nothing is pushed; both branches stay local until the operator says otherwise.
- **NFR-S02**: Review dispatches carry no credentials in prompts.

### Reliability
- **NFR-R01**: Every review iteration writes lineage-local state so a killed run resumes rather than restarts.
- **NFR-R02**: No codex, zg or model-server process survives the run.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a review iteration with no findings still writes its state record.
- Maximum length: the review target is the changed-surface list, bounded by the merge diff.
- Invalid format: a finding without file and line is reported as unverifiable, not fixed blind.

### Error Scenarios
- External service failure: an auth failure halts the loop and asks the operator to log in.
- Network timeout: the runtime's lineage resume continues from the last completed iteration.
- Concurrent access: the operator's commits on v4 are merged, never overwritten.

### State Transitions
- Partial completion: a killed loop resumes with `--lineage-mode=auto`.
- Session expiry: the goal document's log carries the state across sessions.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | A 34-conflict merge, a 187-document validation sweep, a review loop |
| Risk | 12/25 | Release branch and main change; reversible by ref reset, nothing pushed |
| Research | 4/20 | The decommission itself was researched in 049 |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the surviving engine package under `system-spec-kit/mcp-server/` drop its name now that it serves no MCP?
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
