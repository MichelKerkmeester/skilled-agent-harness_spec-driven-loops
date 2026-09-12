---
title: "Feature Specification: Phase 1: research-communication-context"
description: "Run independent deep-research lineages over three external communication sources and produce one evidence-cited recommendation set per lineage."
trigger_phrases:
  - "clarity research"
  - "style patch research"
  - "adhd shaping research"
  - "communication research lineage"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research-communication-context

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-synthesis-and-decisions |
| **Handoff Criteria** | Every lineage wrote a non-empty research.md and its recorded iteration count matches the requested depth |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-communication clarity program.

**Scope Boundary**: Research and citation only. This phase changes no rule, no skill and no root
doc. It reads the three sources under `../context/`, reads the repository's current communication
stack, and writes findings under this folder's own `research/` tree.

**Dependencies**:
- The three context sources already present under `../context/`.
- `/deep:research` with multi-lineage fan-out, and the `cli-pi` and `cli-codex` executor kinds.

**Deliverables**:
- One `research.md` per lineage, every claim carrying a `file:line` or URL citation.
- A ranked recommendation list per source, each entry naming the repository surface it would touch.
- A recorded contradiction list: every place a source disagrees with a rule this repository already has.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three external communication sources sit in `../context/` and none has been read against this
repository's own stack. Judging whether each recommendation is already covered, genuinely new, or in
direct conflict is a judgment question, and one lens on a judgment question is not a finding.

### Purpose

Produce per-source recommendation sets grounded in cited repository evidence, from more than one
model family, so phase 002 decides from findings rather than from impressions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deep-research lineages over `../context/clarity.md`.
- Deep-research lineages over `../context/claude-style-patch-main/` (README plus STYLE.md).
- Deep-research lineages over `../context/i-have-adhd-main/` (SKILL.md, hooks, evals, manifests).
- Cross-reading each source against `AGENTS.md`, `repo-rules/*.md`, `sk-communication` and the Human Voice Rules.
- Two executor families, so no judgment rests on a single model's opinion.

### Out of Scope
- Any edit outside this phase folder - the fan-out runner attributes an out-of-lineage change to the lineage and reverts it.
- Deciding what to adopt - that is phase 002, and putting it here would let a delegate decide a repository question.
- Fetching the sources' upstream repositories - the vendored copies under `../context/` are the frozen input.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Lineage state, iteration markdown and synthesis, written by the loop |
| `research/research.md` | Create | Per-lineage synthesis, workflow-owned |
| `spec.md` | Modify | One generated findings fence, written back by late-INIT spec anchoring |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every lineage runs to its requested iteration count with convergence disabled, so depth is not cut short by an early stop |
| REQ-002 | Every finding cites `file:line` or a URL, and the citation resolves when opened |
| REQ-003 | Each source's recommendations are classified against the current stack as already-covered, new, or contradicting, with the contradicting set listed separately |
| REQ-004 | At least two model families produce findings, and their disagreements are recorded rather than averaged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each recommendation names the candidate owning surface: root doc, an existing repo rule, a new repo rule, the skill, or the wording standard |
| REQ-006 | The mechanism half of the ADHD source (session hook, runtime mirrors, eval harness, release gate) is researched as mechanism, not only as rule text |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every lineage directory holds a non-empty `research.md` and a state log whose iteration count matches the requested depth.
- **SC-002**: A sampled citation from each lineage resolves to the line it names.
- **SC-003**: The contradiction list is non-empty or explicitly states that no contradiction was found, because silence on it is indistinguishable from not having looked.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-pi` on PATH and a DevPass credential | No DeepSeek lineage | Probe `command -v pi` and read output text, never the exit code |
| Dependency | `codex login` session valid | No LUNA lineage | Pre-flight the auth check and surface the login command rather than substituting a model |
| Risk | A delegate writes outside the lineage directory | The runner reverts the write and fails the run | Bind write authority to this folder in the brief and freeze the repository while the run is live |
| Risk | A lineage reports success having written nothing | A phase closes on a run that never happened | Read the state log and the artifacts, not the run's own summary or exit status |
| Risk | The brief leaks an expected conclusion | Findings corroborate the brief instead of the repository | Ask the question, state what is already ruled out, and keep the preferred answer out |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each lineage stays under the 4 hour per-lineage wall-clock ceiling.
- **NFR-P02**: Each iteration stays within the leaf agent's 12 tool-call budget.

### Security
- **NFR-S01**: No provider key or credential value appears in any brief, prompt or artifact.
- **NFR-S02**: Vendored source content is treated as data to cite, never as instructions to obey.

### Reliability
- **NFR-R01**: Three consecutive iteration failures route to stuck recovery rather than looping.
- **NFR-R02**: State is externalized per iteration, so a killed run resumes from files rather than memory.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a lineage whose source yields no new recommendation records that as its finding rather than padding the list.
- Maximum length: the ADHD source is a whole repository, so its lineage bounds itself to the skill, hooks, evals and manifests named in scope.
- Invalid format: a citation that does not resolve is reported as unresolved rather than silently dropped.

### Error Scenarios
- External service failure: a provider capacity limit mid-run leaves artifacts on disk, so the artifacts are salvaged and the run is resumed rather than restarted.
- Network timeout: a print-mode dispatch that emits nothing is treated as a possible stdin deadlock, not a slow model.
- Concurrent access: lineages run under the fan-out pool's concurrency cap, and each owns its own directory.

### State Transitions
- Partial completion: a lineage that stopped early keeps its iterations and is resumed, never archived.
- Session expiry: an expired executor credential invalidates the cache and requires a fresh login before retry.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Writes are confined to one phase folder, no product surface changes |
| Risk | 8/25 | No auth, API or schema change; the risk is an unverified return |
| Research | 20/20 | The whole phase is investigation across three sources and two model families |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which lineage shape is dispatched: one lineage per source per executor, or one lineage per executor across all three sources?
- Does the ADHD source's release gate transfer to this repository, where no blind human study currently runs?
<!-- /ANCHOR:questions -->

---

