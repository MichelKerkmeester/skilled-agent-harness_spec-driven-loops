---
title: "Feature Specification: Phase 8: routing-and-release-alignment"
description: "Two read-only questions about the trigger index routed to the doctor helper, a review found unused code in the retrieval lane, and no release described the retrieval work."
trigger_phrases:
  - "routing and release alignment"
  - "phase 7 routing and release alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: routing-and-release-alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/337-retrieval-routing-and-release` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-search-routing-followups |
| **Successor** | None |
| **Handoff Criteria** | Six of the seven stored advisor probes route to their expected skill, both suites exit 0 and the v4.0.2.1 entry passes the shape check |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sweet-search integration specification.

**Scope Boundary**: The advisor's read-only route gate, the `system-spec-kit` intent signals, the trims a review of phases 4 to 7 named, and the release notes. No new retrieval behavior.

**Dependencies**:
- Phases 4 to 7 shipped the retrieval code this phase reviews and the release notes describe.

**Deliverables**:
- Three more `intent_signals` and one read-only lift for a prompt that names the trigger index.
- The review's verified trims applied to the fallback module, the lookup script and their tests.
- The retrieval work in its own release entry, `.skilled/changelog/skilled/v4.0.2.1.md`, with a changelog entry per touched skill.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three of the seven prompts stored by the phase 4 to 6 alignment runs routed to the doctor helper instead of `system-spec-kit`. Two were read-only questions: the explainer floor held every skill at 0.25, and the doctor hand-off then claimed the prompt on the words "trigger index". Release v4.0.2.0 was tagged one commit before the retrieval work, so its notes said nothing about it.

### Purpose
A question about a trigger-index lookup reaches the skill that owns the lookup, the retrieval lane carries no code or test without a use, and release v4.0.2.1 describes what a lookup now returns.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Explain which research run-output files the trigger index omits and which of those ripgrep still searches."}' --format json
top skill: command-doctor-helper, confidence 0.8

$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Limit a trigger-index search to two results, then tell me how many total documents matched and whether the results were truncated."}' --format json
top skill: command-doctor-helper, confidence 0.8

$ python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md
PASS (235 lines below the frontmatter, 26 H4 items, both at or one under the ceiling)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `trigger index`, `trigger phrase` and `unindexed spec` to the `system-spec-kit` `intent_signals`, and remove the duplicate `spec docs`.
- Lift `system-spec-kit` off the read-only floor when a read-only prompt names the trigger index and not drift.
- Apply the review findings that hold: one unused sort, three unused exports, one redundant type check, the read count, the missing rejection handler and four redundant tests.
- Describe the retrieval work in a v4.0.2.1 release entry with its own tag, and write the two component entries.
- Apply `--limit` to the wrapper's `path` and `count` recipes and report the cut. Added after the release on the operator's "fix still open"; it was out of scope until then.
- Expand the v4.0.2.1 entry and its GitHub release with how each change works, the fixes and the checks. Added on the operator's request for more detail.

### Out of Scope
- Probe P02 of phase 6 - it asks for a code edit, `sk-code` is a correct answer, and every phrase that broke the tie moved an approved route.
- The `maxFiles` and `cwd` options - only tests pass them, but removing them costs a 501-file fixture and a `chdir` in the tests.
- The wrapper's `truncated` field - the trigger lookup uses the same field name and three tests read it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Read-only lift for a prompt that names the trigger index |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Modify | Four cases for the lift |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modify | Three intent signals, one duplicate removed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompile from the metadata |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs` | Modify | Review trims and the read count |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | Rejection handler that exits 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts`, `rg-wrapper-recipes.vitest.ts` | Modify | Four redundant tests removed |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Create | The retrieval work |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`, `runtime/cli/ops/retrofit-convention.mjs` | Modify | File limit on `path` and `count`; the baseline reads the uncut file total |
| Wrapper docs: conventions, two retrieval READMEs, catalog, playbook, command asset and README; `changelog/v2.12.48.0.md` | Modify, Create | Schema version 3 and the entry |
| `system-spec-kit` `SKILL.md`, `changelog/v2.12.47.0.md`; `system-skill-advisor` `SKILL.md`, `changelog/v0.18.6.0.md` | Modify, Create | Versions and entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A read-only question that names the trigger index routes to `system-spec-kit` | `advisor_recommend` on phase 4 probes P01 and P02 names `system-spec-kit` first, and the advisor suite exits 0 with the divergence ledger unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The review trims change no behavior a test covers | The `system-spec-kit` suite exits 0 |
| REQ-003 | The v4.0.2.1 entry describes the retrieval work inside its limits | `check_changelog_shape.py` prints `PASS` for the release entry and both component entries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Six of the seven stored probes pass, where four passed before.
- **SC-002**: The alignment battery over this change reports `fail=0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor reads the scorer from `dist` | The lift does nothing until a build | Run `npm run build` in `system-skill-advisor/runtime`, then `advisor_rebuild --trusted --force true` |
| Risk | The lift takes a drift question from the doctor | Med | The lift skips a prompt that says `drift`, and a test holds "explain trigger index drift and repair it" at the floor |
| Risk | A published tag and release are public | Med | Delete the `v4.0.2.1` tag and its GitHub release. `v4.0.2.0` stays on its commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None.
<!-- /ANCHOR:questions -->

---


