---
title: "Feature Specification: Phase 2: subtrack-proposal"
description: "Nothing in system-spec-kit proposes a subtrack. The spec-folder question has no subtrack wording and no tool detects a cluster in a flat track. This phase adds a read-only proposal tool and the wording that raises a subtrack as a choice."
trigger_phrases:
  - "subtrack proposal"
  - "phase 2 subtrack proposal"
  - "suggest-subtracks.mjs whole-track map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: subtrack-proposal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/364-subtrack-proposal-archive-reach` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-relocation-engine |
| **Successor** | 003-subtrack-archive-and-numbering |
| **Handoff Criteria** | `suggest-subtracks.mjs` emits a map in the `relocate.mjs` format and `git status --porcelain` prints nothing new after a run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: The proposal tool, one advisory line in `create.sh`, one clause in the spec-folder question on every surface that carries option C, and the structure docs. The tool never moves a packet.

**Dependencies**:
- Phase 001 `relocate.mjs`, whose `--map` format and preflight the proposed map must satisfy
- `description.json` keywords and `graph-metadata.json` `trigger_phrases` and `key_topics` as clustering input

**Deliverables**:
- `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs`
- An advisory stderr line in `create.sh`, printed by `advise_sub_track` right after `list_recent_track_packets`
- A subtrack clause in `spec-gate-core.mjs`, `AGENTS.md` option C and every menu file, compiled contract, manifest and fixture that copies option C
- A "when to propose a subtrack" section in `folder-structure.md` and the `--track <track>/<sub>` docs
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator learns that a flat track should be grouped only by noticing it. The spec-folder question in `spec-gate-core.mjs` offers four options and none names a subtrack. `create.sh` prints a hint about series parents only. The one grouping threshold in the repository is a sentence of prose in the regrouping packet.

### Purpose
The tooling proposes a complete whole-track subtrack map for a crowded flat track, and names the best-fitting subtrack when a new packet is created.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs
ls: .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs: No such file or directory
$ grep -c -i "sub-track\|subtrack" .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `suggest-subtracks.mjs`, read-only, with a retroactive mode and a present mode.
- Emit, for a flat track at or above the threshold of 8 live packets, a complete whole-track map in the `relocate.mjs` format with candidate subtrack names.
- Name the best-fitting existing subtrack for a track and a description, or say that none fits.
- Add one advisory stderr line to `create.sh` and one subtrack clause to the spec-folder question wording, on every surface that carries option C. The operator widened this during the build from the five files first listed.
- Document when to propose a subtrack and the `--track <track>/<sub>` form.

### Out of Scope
- Moving packets - `relocate.mjs --map <file> --apply` does that after the operator approves.
- Partial maps - mixed tracks stay forbidden, so a proposal covers the whole track.
- Blocking a scaffold - the `create.sh` line is advisory and never changes the exit code.
- A vitest suite for the tool - phase 005 writes it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` | Create | Retroactive whole-track map and present-time fit, read-only |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | New `advise_sub_track`, called from `resolve_branch_name` right after `list_recent_track_packets`, prints one advisory stderr line and always returns 0 |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | `GATE_3_CHOICE_RELATED`, `GATE_3_QUESTION` option C and `GATE_3_MUTATION_NOTICE` option C gain `new or existing sub-track` |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | Modify | The three pinned strings and `plannedHash` follow the new wording |
| `.skilled/commands/speckit/assets/speckit-plan-presentation.txt` | Modify | Option C at line 73 |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modify | Option C at line 71 |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Option C in `standard_question` at line 71 |
| `.skilled/commands/create/assets/create-agent-presentation.txt`, `create-command-presentation.txt`, `create-feature-catalog-presentation.txt`, `create-manual-testing-playbook-presentation.txt`, `create-skill-parent-presentation.txt`, `create-skill-presentation.txt` | Modify | Option C in six create menus |
| `.skilled/commands/deep/assets/deep-ai-council-presentation.txt`, `deep-research-presentation.txt`, `deep-review-presentation.txt` | Modify | Option C in three deep menus |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown`, `deep-research.contract.markdown`, `deep-review.contract.markdown` | Modify | Regenerated with `compile-command-contracts.cjs --write`, never by hand |
| `AGENTS.md` | Modify | Gate 3 option C at line 80 |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modify | Regenerated from `AGENTS.md`, never by hand |
| `.skilled/skills/system-spec-kit/references/memory/trigger-config.md` | Modify | Its copy of option C |
| `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md` | Modify | Its copy of option C |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` | Modify | The parity fixture's copy of the question text |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modify | New section "When to Propose a Sub-Track" |
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Modify | Pointer to that section |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Document `--track <track>/<sub>` |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Document `--track <track>/<sub>` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `suggest-subtracks.mjs --track <track>` on a flat track with 8 or more live packets prints a JSON map of `[{ "from": "...", "to": "..." }]` that names every live packet of the track exactly once, and exits 0 |
| REQ-002 | The map from REQ-001 passes `relocate.mjs --map <file>` preflight, so the dry run exits 1 and not 2 |
| REQ-003 | `suggest-subtracks.mjs` clusters by overlap of `description.json` keywords and `graph-metadata.json` `trigger_phrases` and `key_topics`, and takes each candidate subtrack name from the cluster's shared terms |
| REQ-004 | On a flat track below the threshold, `suggest-subtracks.mjs` prints no map and says the track is below the threshold. `--threshold <n>` overrides the default of 8 |
| REQ-005 | `suggest-subtracks.mjs --track <track> --describe "<text>"` names the best-fitting existing subtrack, or says none fits and that a new subtrack is the proposal |
| REQ-006 | `suggest-subtracks.mjs` writes no file in either mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `create.sh` prints one advisory stderr line when the target track yields a map, when the new packet fits no subtrack, or when it fits a different subtrack better than the one named. Its exit code and stdout are unchanged |
| REQ-008 | `spec-gate-core.mjs` names a new subtrack as a choice in `GATE_3_CHOICE_RELATED`, `GATE_3_QUESTION` option C and `GATE_3_MUTATION_NOTICE` option C |
| REQ-009 | `speckit-plan-presentation.txt`, `speckit-complete-presentation.txt` and `AGENTS.md` option C carry the subtrack clause, and so does every other file that copies option C, as listed in Files to Change |
| REQ-010 | `folder-structure.md` holds a "when to propose a subtrack" section, `phase-definitions.md` section 2 points to it, and `SKILL.md` and `quick-reference.md` document `--track <track>/<sub>` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a flat track with 8 or more live packets, `suggest-subtracks.mjs --track <track>` exits 0 and its map passes `relocate.mjs --map` preflight. No real flat track is that large, the largest being `cli-classifier` with 6, so the track is a 10-packet fixture named `demo` in a throwaway clone.
- **SC-002**: `git status --porcelain` prints the same lines before and after every `suggest-subtracks.mjs` run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 `relocate.mjs` preflight | REQ-002 cannot be checked without it | Phase 001 hands off first |
| Risk | A cluster of one packet, or a packet that fits no cluster | Med: a map that names a one-packet subtrack reads as noise | Put unmatched packets in one named remainder cluster, so the map still covers the whole track |
| Risk | The advisory line corrupts a `--json` payload | High: callers parse stdout | Write to stderr only, as `list_recent_track_packets` already does, and return 0 on any failure |
| Risk | The spec gate wording is pinned by tests | Med: a wording change fails a suite | Run `rg -l "GATE_3_QUESTION" .skilled` first and update each pinned string in the same change. The parity suite also pins 17 menu files that copy the text without naming the constant, listed in `scratch/gate-consumers.txt` |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The `create.sh` advisory adds one `node` call and no network call.

### Security
- **NFR-S01**: Packet metadata printed to the terminal has control characters stripped, as `list_recent_track_packets` does today.

### Reliability
- **NFR-R01**: The same track state produces the same map on every run.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a track with no packets prints that the track is below the threshold and exits 0.
- Maximum input: a track of several hundred packets still yields one whole-track map.
- Failure path: a track that does not exist exits 2 with the track name.
- Grouped track in retroactive mode: as the source reads, the tool prints that the track is already grouped and no map, and exits 0. No run of this case is on record.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One new script and 27 modified files, mostly one clause of wording |
| Risk | 10/25 | Read-only tool. The gate wording is shared |
| Research | 10/20 | The clustering rule needs tuning on real tracks |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered: `speckit-implement.yaml` line 71 gained the clause. The operator decided during the build that option C changes on every surface that carries it, not only the five files this spec first listed.
- Answered: the flags are `--threshold <n>` and `--describe "<text>"`, as built.
- Answered: no real flat track holds 8 or more live packets. The largest is `cli-classifier` with 6. The whole-track proof ran on a 10-packet fixture track in a throwaway clone.
- Answered: the `create.sh --json --skip-branch` run for AC-007 is on record. In a throwaway clone with the 10-packet track `demo` it exited 0, its stdout parsed as JSON and the advisory line was line 1 of stderr.
<!-- /ANCHOR:questions -->

---
