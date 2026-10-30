---
title: "Feature Specification: manifest and template block"
description: "The shipped template has no machine-readable statement of what it ships. This child adds one manifest with a generated derived key, the shared segmenter both engines use, the line 3 wording, the empty marked block and the CI path filters that make a template edit run the freshness test."
trigger_phrases:
  - "agents md manifest"
  - "agents md template block"
  - "shipped section pins"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the child spec from the approved design"
    next_safe_action: "Wait for the doctor sk-skill command, then write the failing tests first"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: manifest and template block

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-check-engine |
| **Handoff Criteria** | The manifest validates, its derived key matches `AGENTS.md`, and the delivery prefix is inside its byte ceiling |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the `/doctor:agents-md` build inside `agents/021-doctor-agents-md`.

**Scope Boundary**: The manifest, the shared segmenter, the two root-file edits and the CI path filters. It builds no engine and no route.

**Dependencies**:
- `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) must be on `main` before implementation starts, and every phrase, route, bridge and mirror count is re-measured then.
- The rule-copy canary's string list is the authority for the pin set, so this child reads it before authoring pins.

**Deliverables**:
- `assets/agents-md-manifest.json` with authored keys and a generated `derived` key.
- `scripts/lib/agents-md-sections.cjs`, the one segmenter and classifier both engines import.
- The `AGENTS.md` line 3 wording and the empty marked block.
- The two CI path-filter entries.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing in the framework states in machine-readable form what the template ships. The rule-copy canary knows four exact strings, two Iron Law lines and twenty-one delivery anchors; the gate 1 pointer sync knows one line; the repo-rules checker knows one file name. Those lists live inside the tools that consume them, so no command can report whether a repository still carries the shipped text, and a consumer has no copy of the template at all because the root file is not a release unit.

### Purpose
Put the shipped surface in one manifest of authored keys plus a generated copy of the shipped bodies, and give both engines one shared segmenter so a section means the same thing on both sides.

### Precondition
Implementation starts only after `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) lands on `main`. That command adds a router, a route and an advisor bridge, so the route, bridge, phrase and mirror counts this packet quotes are re-measured from the branch the child starts on, and recorded in `scratch/baseline.txt` before the first edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d`, before any implementation. These are the numbers this child's criteria are read against.
```text
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
  16374  #### Blast-Radius Management

$ wc -c AGENTS.md
   27679 AGENTS.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author every manifest key: 44 section ids with their match prefixes, levels and parents; the pins with their consumers; the runtime-copy expectations; the delivery budget; the block markers; the source repository URL.
- Generate the `derived` key from the root `AGENTS.md` and `REPO RULES.md`: each shipped body with its sha256, the release-tag history and the shipped router rows.
- Rewrite `AGENTS.md:3` and append the empty marked block.
- Add `AGENTS.md` and `REPO RULES.md` to both path-filter lists of the spec-kit workflow.

### Out of Scope
- Any engine that reads the manifest, which children 002 and 003 own.
- Any route, workflow or presentation, which child 004 owns.
- Registration in the update engine's generated artifacts, which D10 of the parent phase forbids.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Create | Authored keys plus the generated `derived` key |
| `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` | Create | `--write` and `--check`, source repository only |
| `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` | Create | Shared segmenter, classifier and sha256 helpers |
| `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | Create | The suite written before the script exists |
| `AGENTS.md` | Modify | Line 3 wording, then the empty marked block at the end |
| `.github/workflows/spec-kit-check.yml` | Modify | Both path-filter lists name `AGENTS.md` and `REPO RULES.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The segmenter splits the root file at every heading from level 1 to level 4 into 44 sections whose start bytes match the section table, and gives each a match prefix that finds it. |
| REQ-002 | The generator exits 1 when the root file carries a heading no authored entry matches, and 1 when an authored entry matches nothing. |
| REQ-003 | `--check` exits 1 after a one-byte edit to a temporary copy of the manifest's derived body, and 0 when the derived key matches the root file. It also exits 1 when an authored ceiling disagrees with the canary that enforces it. |
| REQ-004 | Every pin names a consumer file that still contains the pin text, or whose own constant equals it, so the pin list cannot rot. |
| REQ-005 | Every `AGENTS.md` string the rule-copy canary requires appears in the manifest's pin set. |
| REQ-006 | `AGENTS.md:3` carries the measured wording from the parent phase spec, and the file ends with exactly one empty marked block. |
| REQ-010 | `--check` does not fail on a checkout that holds no release tags: it reports that the history was not compared and compares everything else. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The history key holds one body per distinct release-tag section body, deduped by sha256. |
| REQ-008 | The generator's test skips with a printed reason when the origin is not the source repository. |
| REQ-009 | Both path-filter lists in `.github/workflows/spec-kit-check.yml` name the two root instruction files. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0 with a `PASS` line naming the section count, the pin count and a fresh derived key.
- **SC-002**: The delivery prefix still ends at or before byte 16374 and the whole file stays at or under 27,899 bytes.
- **SC-003**: `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` reports `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A release tag must exist on the branch for the history key to fill | The history is empty on a branch with no tags | The key is written empty, and `--check` prints that the history was not compared instead of failing on a tag list that holds nothing |
| Risk | Every future `AGENTS.md` edit must be followed by a manifest write in the same commit or CI goes red | Medium: new friction on a file edited often | Named in the manifest's own `--check` message and in the parents' decisions |
| Risk | The manifest's derived bodies duplicate about 28 KB of text | Low: a generated copy drifts silently | `--check` is the freshness gate and CI runs it |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--check` reads the manifest and the root file once and finishes under two seconds on the current tree.

### Security
- **NFR-S01**: No credential is read, and the only network-shaped value is the public source repository URL.

### Reliability
- **NFR-R01**: A missing root file exits 2 with a named cause instead of writing an empty manifest.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a root file with no `##` heading yields a single section and the generator exits 1 because the authored entries match nothing.
- Maximum input: the observed 38 KB fork shape still segments, and its sections past the delivery prefix are reported rather than refused.
- Failure path: an unregistered heading exits 1 and prints the heading text and its byte offset.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Six files, one of them about 28 KB of generated data |
| Risk | 10/25 | The delivery prefix has 10 bytes of headroom, so a longer line 3 fails CI |
| Research | 8/20 | Section boundaries and pin consumers must be read from the tools that own them |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What is the manifest's final byte count? Report it from this child rather than estimating, and add pruning only if the measured number earns it.
- Does a repository without any release tag still get a usable history key? It gets an empty one, and `--check` reports that the history was not compared instead of failing: a shallow checkout passes, while a tag set that drops a body the manifest records still fails.
<!-- /ANCHOR:questions -->

---
