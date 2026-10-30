---
title: "Feature Specification: check engine"
description: "A repository cannot tell whether it still carries the shipped template, which lines are its own, or which of its own lines sit inside a shipped section. This child builds the read-only check engine, its twelve rows and nine synthetic fixtures."
trigger_phrases:
  - "agents md check engine"
  - "install state classification"
  - "unmarked repo unique content"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine"
    last_updated_at: "2026-10-30T12:35:33Z"
    last_updated_by: "markdown-agent"
    recent_action: "Landed the read-only engine, its suite and nine fixtures"
    next_safe_action: "Child 003 composes an embed plan from this report's A4, A7, A8, A9 and A10 rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: check engine

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-manifest-and-template-block |
| **Successor** | 003-embed-engine |
| **Handoff Criteria** | Every check row reports on all nine fixtures with exit codes 0, 1 and 2, and no run writes a byte |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the `/doctor:agents-md` build inside `agents/021-doctor-agents-md`.

**Scope Boundary**: The read-only engine, its suite and its fixtures. It composes nothing and writes nothing.

**Dependencies**:
- `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) must be on `main` before implementation starts, and every phrase, route, bridge and mirror count is re-measured then.
- The manifest and the shared segmenter from child 001 are the engine's only inputs.

**Deliverables**:
- `scripts/agents-md-check.cjs` with the twelve rows, four states per row and exit codes 0, 1 and 2.
- `scripts/tests/agents-md-check.test.cjs` and nine fixture recipes, each composed into a throwaway tree per run.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A repository that took the framework can be in any of seven states, and nothing names which one it is in. Its shipped sections may be current, behind a release, or edited in place; its own content may sit in a marked block or scattered among shipped sections; it may have no `AGENTS.md` at all and only a `CLAUDE.md`. Without a classification there is nothing to plan an embed from, and no way to tell a safe replacement from one that would drop a line somebody wrote.

### Purpose
Report, per row and without writing a byte, what the repository holds against the manifest: which sections are present and current, which pins hold, how much delivery budget is left, what sits outside the markers, and how every runtime copy stands.

### Precondition
Implementation starts only after `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) lands on `main`. That command adds a router, a route and an advisor bridge, so the route, bridge, phrase and mirror counts this packet quotes are re-measured from the branch the child starts on, and recorded in `scratch/baseline.txt` before the first edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d`, before any implementation. These are the numbers this child's criteria are read against.
```text
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
  16368  #### Blast-Radius Management

$ wc -c AGENTS.md
   27888 AGENTS.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Twelve rows, each reporting `PASS`, `FINDING`, `UNKNOWN` or `INFO`, and a `--json` form of the same report.
- Nine synthetic fixture recipes, composed into a throwaway tree per run: `pure`, `adopted`, `stale`, `forked`, `foreign`, `claude-only`, `absent`, `shadowed-pin` and `over-budget`.
- Exit codes 0 for no finding, 1 for at least one finding and 2 for a failed precondition.

### Out of Scope
- Composition, apply, backup and restore, which child 003 owns.
- Any write of any kind: the engine is read-only and a write-spy test proves it.
- Route or workflow plumbing, which child 004 owns.

### The twelve rows

| Row | Reports |
|-----|---------|
| A1 install state | One of `pure` (shipped sections current, block empty or absent), `adopted` (shipped current, block has content), `stale` (shipped sections behind the manifest), `forked` (local edits or unmarked local sections among shipped ones), `foreign` (fewer than half the manifest sections match: the repository's own file), `claude-only` (no `AGENTS.md`, a `CLAUDE.md` present), `absent` |
| A2 sections present | Each manifest section matched by its prefix; lists the missing ids |
| A3 order and numbering | Shipped sections in manifest order, and `## 1.` through `## 10.` unchanged |
| A4 section currency | Per section, sha256 against `derived`: `current`; `stale-known` (matches a release-history body, so replacement is safe); `edited` (matches none but the closest known body is identifiable, so it lists the local-only lines); `unknown-base`. `INFO` when no shipped section matched, because an empty classification is not a verified one |
| A5 pins | Each pin per its rule, including first-occurrence placement, so local text never shadows the gate 1 lookup line. A pin kind with no rule is `UNKNOWN`, never a hold |
| A6 delivery budget | Runs the rule-copy canary and keeps only its `AGENTS.md` lines; `UNKNOWN` when the canary is not installed. Reports the end byte of the last anchor and the total bytes |
| A7 repo-local block | Markers well formed (exactly one start and one end, in order), the block's position among the sections — one written between shipped sections is reported by byte and by the section that follows it — its byte size and its headroom |
| A8 unmarked repo-unique content | Every section outside the markers that matches no manifest entry, with its line range, its byte range and whether it sits in the 16 KB prefix, plus the text above the first heading, which no heading-shaped section covers |
| A9 unmarked local edits | For `edited` and `unknown-base` sections, the lines not present in the current shipped body, once per occurrence, so a line written twice is two lines to keep |
| A10 runtime copies | Each expected copy. The cursor block runs the pointer sync `--check`; `CLAUDE.md` and `.codex/AGENTS.md` are classified as pointer, symlink, identical copy or divergent copy, with the divergent lines listed. A copy whose own tool is missing is `UNKNOWN` and counted in `unknown=` |
| A11 REPO RULES.md | Present or absent, missing shipped trigger and index rows, and the summary line of the repo-rules checker, reused rather than reimplemented |
| A12 template purity | Runs only with `--source`, or when the origin equals the source repository: block empty and `derived` fresh |

### How the document is read

The shared segmenter reads the whole document, not only the part above the block. The block is a hole in it: a heading inside the block is the repository's, the bytes between the markers join no section body, a section the block interrupts carries the text on both sides of the hole, and every section below the block keeps its own body word for word. That is what lets a block written anywhere be read as the block, instead of turning the tail of the document into missing sections and a foreign file. Text above the first heading belongs to no section, so it is reported as unmarked content rather than reading as a pure template.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | Create | The read-only engine |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | Create | The failing-first suite |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/pure/` | Create | The recipe for a tiny tree carrying the current shipped sections and no block |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/adopted/` | Create | The recipe for current sections plus a non-empty block |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/stale/` | Create | The recipe for sections one release behind |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/forked/` | Create | The recipe for local sections among shipped ones and one edited section |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/foreign/` | Create | The recipe for a repository's own file with no shipped section |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/claude-only/` | Create | The recipe for a `CLAUDE.md` and no `AGENTS.md` |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/absent/` | Create | The recipe for no instruction file at all |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/shadowed-pin/` | Create | The recipe for a local lookup line placed before Gate 1 |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/over-budget/` | Create | The recipe for markers out of order and a total above the ceiling |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs` | Create | The composer every recipe is built by, also callable by hand |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every fixture yields its A1 state: `pure`, `adopted`, `stale`, `forked`, `foreign`, `claude-only` and `absent` each classify as named. |
| REQ-002 | `forked` lists its unmarked section with its byte range and its edited section's local-only lines. |
| REQ-003 | `shadowed-pin` fails A5 because its local lookup line sits before Gate 1. |
| REQ-004 | `over-budget` fails A6 and A7. |
| REQ-005 | A missing canary gives A6 `UNKNOWN`, never `PASS`. |
| REQ-006 | A divergent `CLAUDE.md` fails A10 with its divergent lines listed. |
| REQ-007 | Exit codes are 0 for no finding, 1 for at least one finding and 2 for a failed precondition. |
| REQ-008 | A write-spy proves the run makes zero filesystem writes. |
| REQ-012 | A block written anywhere is read as the block: the whole document is segmented, so A7 reports a block that sits before shipped sections, and the sections below it classify as shipped ones. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `--json` prints the same report as the text form, with `state` as a named field. |
| REQ-010 | A11 reuses the repo-rules checker's summary line and never reimplements its checks. |
| REQ-011 | A12 runs only with `--source` or when the origin equals the manifest's source repository, and reports `INFO` otherwise. |
| REQ-013 | A row that could not measure says `UNKNOWN`, never `PASS`: a pin kind with no rule, a copy whose own tool is missing, and the run's `unknown=` counts it. A report with nothing to classify reports `INFO`. |
| REQ-014 | Repository content outside the sections is never silent: a line below the block's end marker is a local edit A9 lists, text above the first heading is unmarked content A8 reports, and a repeated local line is counted once per occurrence. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On this repository the engine exits 0 with `STATUS=OK` and `A1 install state: pure`.
- **SC-002**: On the `forked` fixture it exits 1 and its JSON `state` is `forked`.
- **SC-003**: `git status --porcelain | shasum` is identical before and after a run over every fixture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The manifest's derived bodies from child 001 | The engine cannot classify without them | The suite builds every fixture from the manifest, so a fixture cannot drift from it |
| Risk | A canary that is absent reads as a pass | High: a false all-clear | REQ-005 makes an absent canary `UNKNOWN` and the suite holds the case |
| Risk | The engine grows a write path | Medium: the read-only promise breaks silently | REQ-008's write-spy fails the suite on any write |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A run over this repository finishes in under five seconds, because it reads the root file, the manifest and a handful of copies once.

### Security
- **NFR-S01**: The engine reads files under the target root only, and every path it reports is a path it read.

### Reliability
- **NFR-R01**: A missing manifest exits 2 with a named cause rather than an empty report.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a repository with no instruction file at all classifies as `absent` and exits 1.
- Maximum input: the observed 38 KB fork shape reports its over-budget sections by byte range rather than refusing the run.
- Failure path: an unreadable root file exits 2 and names the path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One engine, one suite and nine fixture trees |
| Risk | 10/25 | A false pass hides drift in every consumer |
| Research | 8/20 | The budget, pin and router rows are read from the tools that own them |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How is the 38 KB fork classified when fewer than half its sections match? The design puts it at `foreign`, and the suite's `foreign` fixture is a small tree rather than the observed file, because that file is private.
- Does A12 belong in a consumer at all? It reports `INFO` there, and the operator decides whether the block must stay empty.
<!-- /ANCHOR:questions -->

---
