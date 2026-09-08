---
title: "Feature Specification: v4 state inventory research"
description: "Two ten-iteration deep-research lanes, GPT-5.6 Luna and DeepSeek V4 Flash, inventory what the repository and its main skills actually ship today and measure the old v4.0.0.0 changelog draft against it, so the release notes can be rewritten from evidence rather than memory."
trigger_phrases:
  - "v4 state inventory research"
  - "changelog draft drift"
  - "what does v4 actually ship"
  - "skill inventory luna deepseek"
  - "release notes evidence"
  - "v4.0.0.0 changelog rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/034-v4-state-inventory-research"
    last_updated_at: "2026-09-08T18:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the research lane planning documents"
    next_safe_action: "Launch the two lanes through fanout-run.cjs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-v4-state-inventory"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: v4 state inventory research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Phase** | 34 of 34 |
| **Predecessor** | 033-ci-dependency-hardening |
| **Successor** | None |
| **Handoff Criteria** | Twenty iterations complete across both lanes, the inventory and the draft-drift table synthesized, and every kept drift row reproduced in this session |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 34** of the system-speckit v4 program: a research lane whose only writes land under its own `research/` directory.

**Scope Boundary**: read-only research over the repository; the changelog rewrite is a later child.

**Dependencies**:
- The codex CLI with GPT-5.6 Luna at `xhigh` on the fast tier
- The devin CLI with DeepSeek V4 Flash at its `max` tier
- The system-deep-loop research mode runner (`fanout-run.cjs`)

**Deliverables**:
- `research/lineages/*/research.md`, one per lane, each with a cited inventory and drift findings
- `research/research.md`, the merged inventory plus the draft-versus-reality table the rewrite consumes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`CHANGELOG-v4.0.0.0.md` in the parent folder was drafted before the memory-database decommission, the runtime rename, the simplification program, the recorded-findings closure and the CI hardening landed. It still presents `memory_search` and `memory_save` as the daily commands, an `/interface:*` family, and a memory engine that no longer exists. Nothing today lists what the repository and its main skills actually ship, so any rewrite would start from the same stale memory.

### Purpose
Two independent lanes read the repository as it is on this branch and write, with `path:line` evidence, an inventory of the skills, modes, commands, agents, runtimes, hooks and CI surfaces, and a table of every claim in the draft that is now false, stale or missing, ranked by how badly a reader would be misled.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten iterations per lane over `.opencode/skills/**` (with `system-spec-kit`, `system-deep-loop`, `system-skill-advisor`, `sk-doc`, `cli-external-orchestration` first), `.opencode/commands/**`, `.opencode/agents/**`, `.opencode/hooks/**`, the runtime mirrors `.claude .codex .cursor .devin .pi`, `.github/workflows/**`, `AGENTS.md`, `CLAUDE.md`, `README.md` and the v4 parent's timeline
- A ranked `research/research.md` whose inventory rows and drift findings each carry `[SOURCE: path:line]` evidence
- A reproduction pass in this session that confirms or drops every drift row before the rewrite is planned

### Out of Scope
- Editing the draft, any skill or any code; research is read-only and the rewrite is the next child
- Writing-style review of the draft; this lane checks facts
- Packets under `specs/` other than the v4 parent's `spec.md` and `timeline.md`; they are evidence at most

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/**` | Read | Hubs, modes, registries, READMEs and SKILL.md checked for what ships |
| `.opencode/commands/**`, `.opencode/agents/**`, `.opencode/hooks/**` | Read | Command, agent and hook rosters |
| `.claude .codex .cursor .devin .pi`, `.github/workflows/**` | Read | Runtime mirrors and CI surfaces |
| `../CHANGELOG-v4.0.0.0.md` | Read | The draft whose claims are measured |
| `research/**` | Create | Loop state, iteration files, per-lane research.md and the merged research.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each lane completes ten iterations under `--stop-policy max-iterations` with a non-empty iteration file and one state event per iteration |
| REQ-002 | Every inventory row and drift finding in `research/research.md` cites a `path:line` or a command with its observed output |
| REQ-003 | Each drift finding carries a severity (P0 the draft describes a surface that no longer exists, P1 a name, path or count is wrong, P2 a shipped surface the draft omits) and a one-line correction |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The ten research angles in the charter are each visited by at least one iteration in each lane |
| REQ-005 | The two lanes' findings are merged into one inventory and one drift table, with disagreements between the lanes recorded rather than silently resolved |
| REQ-006 | Drift rows are reproduced in this session before the rewrite child is planned; unreproducible ones are dropped with a note |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with a merged inventory covering every skill hub, its modes, every command family and every agent
- **SC-002**: Every P0 and P1 drift row reproduces from the cited draft line and repository line when opened in this session
- **SC-003**: The reproduced rows are handed to the rewrite child as a numbered table with draft line, actual state and correction
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ChatGPT OAuth for codex and the Devin login | A lane cannot start | Both verified before launch; a lane that fails auth is relaunched after re-login |
| Risk | A lane inventories from a README rather than from the registry or code | Med | The charter names the registries as ground truth and the reproduction pass checks each row against them |
| Risk | A lane goes silent without an exit | Med | Monitor log growth; a lane silent for fifteen minutes is killed and resumed in lineage-resume mode |
| Risk | The two lanes disagree on a count or a name | Low | Disagreements are kept as rows in the merged table and settled in the reproduction pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration finishes within the executor timeout of one hour; both lanes within one working day
- **NFR-P02**: At most twelve tool calls per iteration, matching the leaf agent contract

### Security
- **NFR-S01**: The executors run with the spec gate disabled only because their write authority is the bound research directory
- **NFR-S02**: No credential or token appears in an iteration file; the charter forbids fetching remote content

### Reliability
- **NFR-R01**: Every iteration leaves a parseable state event; a malformed event routes to stuck recovery rather than a silent skip
- **NFR-R02**: Rows without a repository citation are excluded from the merged inventory rather than kept as guesses
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: An iteration that finds nothing new records a low novelty ratio and moves to the next angle instead of restating prior rows
- Maximum length: Iteration files over the leaf budget are truncated by the executor; the reducer keeps the JSONL event as the record of truth
- Invalid format: A row whose citation does not resolve is dropped during the reproduction pass

### Error Scenarios
- External service failure: A lane that fails auth or capacity is relaunched with the same charter after the cause is fixed
- Network timeout: A silent lane is killed after fifteen minutes and resumed; the resumed lineage appends a typed resumed event
- Concurrent access: The two lanes write to different lineage directories, so they never contend for a file

### State Transitions
- Partial completion: A lane that stops short of ten iterations is resumed until it reaches ten; the merge waits for both lanes
- Session expiry: Not applicable; the loop has no interactive session
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Fourteen skill roots, six runtime mirrors, the command and agent rosters, read only |
| Risk | 4/25 | No code changes in this phase |
| Research | 19/20 | Twenty fresh-context iterations across two models with reproduction |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the rewrite keeps the draft's section order or follows the inventory's hub order is decided in the rewrite child
<!-- /ANCHOR:questions -->
