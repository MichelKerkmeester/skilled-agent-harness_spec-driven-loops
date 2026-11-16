---
title: "Feature Specification: Research the current repository reality for a root README rewrite"
description: "The root README.md runs 1,773 lines and predates the v4.0.1.0, v4.0.2.0 and v4.0.2.1 releases and the work merged on main since. This packet researches what changed and what the repository holds today, so a later rewrite can be shorter and correct."
trigger_phrases:
  - "root readme rewrite"
  - "root readme rewrite research"
importance_tier: "normal"
contextType: "research"
---
# Feature Specification: Research the current repository reality for a root README rewrite

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root `README.md` is 1,773 lines long and was written before the v4.0.1.0, v4.0.2.0 and v4.0.2.1 releases and the commits on main after the v4.0.2.1 tag. Nobody has checked which of its claims about skills, commands, runtimes, hooks and install steps still hold.

### Purpose
A deep-research run produces a cited map of the release delta, the current inventory, every hook, plugin and extension per runtime, the stale README claims and a reader-first section order, so the rewrite can start from evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ wc -l README.md
    1773 README.md
$ git tag --sort=-v:refname | head -4
v4.0.2.1
v4.0.2.0
v4.0.1.0
v4.0.0.16
$ git log --oneline v4.0.2.1..HEAD | wc -l
      37
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

### In Scope
- Map what each release from v4.0.0.0 to v4.0.2.1, and main after the v4.0.2.1 tag, changed.
- Inventory skills, modes, commands, agents, runtimes, CLI executors, doctor commands and Code Mode against files on disk.
- List every dedicated hook, plugin and extension per runtime with its source path.
- Audit the root README's claims against the code and propose a shorter, reader-first section order.

- Rewrite the root `README.md` from the research: shorter sentences, real paragraphs, fewer bullet lists, detail moved to links, a reader-first order with hooks, plugins and extensions directly below skills, and one subsection per hook, plugin and extension.

### Out of Scope
- Any skill, hook or command README other than the root one - the root links to them instead.
- Fixing the stale claims found in other docs, such as the skill advisor hook README's runtime count.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Full rewrite from the research findings |
| `specs/system-speckit/runtime-and-release/004-v4-release-line-research/spec.md` | Modify | Phase map row and transition row for this child |
| `specs/system-speckit/runtime-and-release/004-v4-release-line-research/graph-metadata.json` | Modify | Child id for this packet |
| `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/` | Create | Deep-research state, iterations, `research.md` and `resource-map.md` |
| `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/spec.md` | Create | This seeded spec |
| `INSTALL-SKILLED.md`, `PUBLIC-RELEASE.md`, `SECURITY.md`, `CONTRIBUTING.md`, `.skilled/CROSS-CLI.md` | Modify | Rewrite in the README's style, more technical where the document needs it |
| `.skilled/skills/sk-doc/sk-create-readme/assets/` | Create, Modify | README templates modeled on the rewritten root docs, and the skill README template moved in from sk-create-skill |
| `.skilled/skills/sk-doc/sk-create-skill/` and every live reference to the skill README template | Modify | Point skill README creation at the sk-create-readme mode |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Answer the five research questions with file-cited evidence | `research/research.md` holds an answer for each of Q1 to Q5 with source paths |
| REQ-002 | List every hook, plugin and extension per runtime | The list in `research/research.md` matches a directory listing of each runtime folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cite README line numbers for each stale or wrong claim | Each claim row names a `README.md` line and the contradicting source path |
| REQ-004 | Rewrite `README.md` in the approved order with every verified stale claim corrected | The validator prints valid with no warning, the voice scanner reports 0 hard blockers, and `rg -ci relaunch README.md` finds nothing |
| REQ-005 | Give every shared hook, runtime-only hook and Pi extension package its own subsection | Each folder in `.skilled/hooks/` except `shared` is named in a `###` heading in `README.md`, and closely related hooks such as the session-start git checks may share one heading |
| REQ-006 | Every relative link and in-page anchor in `README.md` resolves | A link check over `README.md` reports no missing target |
| REQ-007 | Rewrite the five root docs in the README's style | Each passes `validate_document.py`, the voice scanner reports 0 hard blockers and every inbound anchor still resolves |
| REQ-008 | Add README templates to sk-create-readme and move the skill README template there | No live file references the old template path, and sk-doc's routing checks pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` and `research/resource-map.md` exist after the run.
- **SC-002**: `git status --porcelain` shows no change outside this packet's folder caused by the run.
- **SC-003**: `README.md` is shorter than the 1,773-line baseline, and its voice-scanner ceiling is at or above the baseline of 81/100.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `devin` CLI with model `deepseek-v4-1-flash-max` | Iterations fail if the executor is unavailable | The workflow halts on an unavailable executor and keeps partial findings |
| Risk | Iteration claims are model output, not verified facts | Medium | Spot-check load-bearing claims against files before reporting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The operator approved adding this child to the 004 phase map.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Research Findings (abridged from `research/research.md`)

- Twenty iterations ran; the stop reason was `maxIterationsReached`, and all five questions were answered.
- Eight runtimes ship (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`). `README.md:16` names only six.
- Inventory: 14 shipped skills, 7 hubs routing 42 modes, 44 canonical commands, 11 agents, 17 doctor commands, 27 hook directories (26 cores plus `shared`) and 7 Code Mode tools.
- Stale README claims are at `:16`, `:873`, `:164`, `:208`, `:214`, `:1174` (partition), `:1408`, `:234-243` and the local-first FAQ answer. Counts at `:801`, `:403`, `:1166` and `:1316` are correct.
- Four catalogs hold 50.6% of the file. The proposed order has five tiers, about 500 to 620 lines, and links skill READMEs instead of repeating them.
- Open: count `/goal-cursor` or not, Vibe MCP support, and README treatment of the vendored Pi extensions.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
