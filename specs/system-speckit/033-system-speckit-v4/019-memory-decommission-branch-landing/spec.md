---
title: "Feature Specification: memory decommission landing and verification "
description: "The memory-database decommission existed only on a side branch while the release branch and main still carried the memory server, its hooks and its commands; this packet lands the branch, aligns the changed documents with their templates, and proves zero drift through a review loop."
trigger_phrases:
  - "memory decommission landing spec"
  - "release branch still carried memory"
  - "zvec semantic lane vendored"
  - "seventy one commits ahead"
  - "no memory surface left"
  - "ten-iteration review finds P0 P1"
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
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 19 of 24 |
| **Predecessor** | `../018-single-segment-packet-pointer/spec.md` |
| **Successor** | `../020-runtime-package-rename/spec.md` |
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
| `system-spec-kit/references/cli/daemon-cli-reference.md` | Modify | Overview sections the templates require |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/**/{description,graph-metadata}.json` | Modify | Regenerated after the merge |
| `specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing/review/**` | Create | Review loop lineage and report |

### Review Scope

The review reads a bounded list, never a tree. The change set is the diff `5220257bf7..HEAD` outside `specs/`, and its reviewable part is the 438 added or modified files listed one per line in `scratch/review-scope.txt`, grouped as follows. The 1,836 deleted files are verified by absence checks and the commands below, not by reading anything.

| Group in the list | Count | What to verify |
|-------------------|-------|----------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/**` and its tests | 37 | The trigger index generator and lookup, the ripgrep lane, the residue sweep, the retrofit pipeline, the zvec lane: correctness, exit mapping, determinism, no reference to a retired tool |
| `.opencode/skills/system-spec-kit/mcp-server/**` (lib, handlers, hooks, tests, README) | 60 | The surviving engine: validation orchestrator, metadata refresh, continuity writer; nothing serves MCP, no dead import, no doc that presents the retired server as live |
| `.opencode/skills/system-spec-kit/{shared,scripts/core,scripts/ops,templates,references}/**` | 49 | The embedding seam that the skill advisor still uses, the save workflow without a daemon, the templates' trigger phrases, the retrieval and grep conventions |
| `.opencode/commands/{memory,doctor,speckit,deep,create}/**` | 75 | No memory tool in any allow list, the memory family reduced to save and search, contract-shaped frontmatter |
| `.opencode/skills/{system-deep-loop,cli-external-orchestration,system-skill-advisor,sk-doc,sk-code,sk-git,mcp-code-mode,mcp-tooling}/**` | 99 | Live instructions name the successors, never the retired tools; the advisor and model-server seam untouched in behaviour |
| `.opencode/{hooks,bin,plugins,scripts,install-guides}/**`, `AGENTS.md`, `README.md`, `opencode.json`, `.claude/**`, `.pi/**`, `.codex/**`, `.cursor/**` | remainder | No spec-memory hook, plugin, launcher or registration; agent mirrors consistent; install guides describe what exists |

**Reading budget.** Read only files in the list and the modules they import directly. Never expand a directory with a wildcard, and never read `node_modules`, `dist`, `benchmark`, `changelog`, `z_archive`, `manual-testing-playbook`, `feature-catalog`, or `data/trigger-index.json`. Cover a different group in each iteration so ten iterations cover the list roughly once, and spend any remaining iterations on the findings already raised.

**Repository-wide claims come from commands, not reading:**

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs --json          # live must be 0
node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs                 # run twice; hashes must match
NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission --strict --recursive
bash .opencode/commands/doctor/scripts/route-validate.sh
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
grep -c "system_spec_memory\|spec-memory" .claude/mcp.json opencode.json .codex/config.toml .pi/mcp.json .cursor/mcp.json   # all 0
```

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
