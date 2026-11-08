---
title: "Feature Specification: Phase 4: advisor-hooks-relaunch"
description: "Forced-depth deep research of the skill advisor, compiled routing, hooks and plugins, session relaunch, compaction history and question-tool capture across the v4.0.0.0 to v4.0.2.0 releases, recording drift, bugs, misalignment, over-engineering and extension findings with file:line evidence."
trigger_phrases:
  - "advisor hooks relaunch"
  - "phase 4 advisor hooks relaunch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: advisor-hooks-relaunch

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-cli-and-deep-loop |
| **Successor** | 005-doctor-git-ci-runtime |
| **Handoff Criteria** | `research/research.md` exists, every release touching the cluster is read and all seven finding types are probed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities specification.

**Scope Boundary**: Read-only research over `.skilled/skills/system-skill-advisor/**`, every skill's compiled routing files, `.skilled/hooks/**` and the runtime adapters in `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks`, `.opencode/plugins`, `.pi/extensions` and `.dsh/plugins`. Writes stay inside this folder.

**Dependencies**:
- The `/deep:research:auto` workflow at `.skilled/commands/deep/assets/deep-research-auto.yaml`
- The `cli-devin` executor with model `deepseek-v4-1-flash-max`, plus the same-family fallbacks recorded in `decision-record.md`

**Deliverables**:
- `research/research.md` with ranked, cited findings
- The iteration trail under `research/iterations/` and `research/deltas/`
- A release-by-finding-type coverage table in `implementation-summary.md`

### Research Context

Deep research is active for this phase through `/deep:research:auto`. `research/research.md` is the canonical synthesis; this spec only frames the run.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor, compiled routing and the hook layer changed in almost every v4 release, from the CLI-only advisor in v4.0.0.0 through session relaunch in v4.0.0.13 and v4.0.0.14, per-skill ROUTER.md files in v4.0.1.0, and compaction history plus question-tool capture in v4.0.2.0. Nobody has checked the release notes, the code and the docs of this cluster against each other, so drift and latent bugs are unmeasured.

### Purpose
Produce a ranked, evidence-backed list of drift, bug, misalignment, improvement, UX, over-engineering and extension findings for this cluster, each tied to the release that introduced it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git diff --shortstat 6a93a2cfeb..51f70a0317 -- .skilled/skills/system-skill-advisor .skilled/hooks .claude/hooks .codex/hooks .cursor/hooks .devin/hooks .opencode/plugins .pi/extensions .dsh/plugins
 383 files changed, 19011 insertions(+), 1908 deletions(-)
$ git diff --shortstat f459b06479..6a93a2cfeb -- (same paths)
 219 files changed, 12683 insertions(+), 2412 deletions(-)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read every release note in `.skilled/changelog/skilled/v4.0.*.md` that touches the cluster and check it against the code
- Probe all seven finding types: drift, misalignment, bugs, improvement, UX, over-engineering and extension
- Verify the strongest citations by opening the cited lines
- Record findings with type, severity, `[SOURCE: path:line]`, introducing release, confidence and a verify command

### Out of Scope
- Any fix to the researched code - this phase only researches
- Clusters owned by sibling phases 001, 002, 003 and 005 - each runs its own loop

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/047-v4-release-line-research/004-advisor-hooks-relaunch/**` | Create/Modify | Research state, iteration trail, synthesis and phase docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run at least 10 iterations through the workflow's `if_cli_*` dispatch, starting on `cli-devin` and falling back within the DeepSeek family | The state log holds 10 or more `"type":"iteration"` records |
| REQ-002 | Every reported finding carries a resolvable citation | The orchestrator opened the top findings' cited lines and they say what the finding claims |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cover every release that touched the cluster and all seven finding types | The coverage table in `implementation-summary.md` has no unread release row |
| REQ-004 | Synthesize the findings | `research/research.md` exists and ranks findings by severity |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c '"type":"iteration"' research/deep-research-state.jsonl` prints 10 or more.
- **SC-002**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin OAuth and the DeepSeek quota | High: no iterations run without them | Fall back within the DeepSeek family: dsh, then pi, then opencode |
| Risk | A shallow or fabricated iteration | Med | Open two citations per iteration and redo the ground when they fail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Research topic: Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the advisor, hooks and relaunch cluster: .skilled/skills/system-skill-advisor/**, compiled routing (each skill's hub-router.json, ROUTER.md, mode-registry.json), .skilled/hooks/** with the runtime adapters in .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions and .dsh/plugins, session relaunch, history after compaction and question-tool decision capture. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.
- The full key-question list lives in `research/deep-research-strategy.md`.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md` (20 distinct generation-2 iterations, stop: maxIterationsReached at the lead's ceiling; depth rule cleared):
- P1 bug: the ask-surface menu detector misses `1.` menus and fires on `1)` how-to steps that end in a question (`ask-surface-core.cjs:39`).
- P1 bug: the Claude ask-surface Stop hook reads stdin with a blocking `readFileSync(0)` and no deadline (`ask-surface-stop.cjs:83`).
- P1 bug: the dispatch-audit hooks resolve their log against the session cwd, so records scatter into gitignored nested `.skilled/logs` folders (`dispatch-audit-posttooluse.mjs:56-57`, `.gitignore:263`).
- P1 drift: Hermes still ships in the doctor AGENTS.md manifest, and `agents-md-manifest.cjs --check` exits 1 at HEAD.
- P1 drift: "my hooks are not firing, what do I run" gets no doctor command, against the v4.0.1.0 note.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
