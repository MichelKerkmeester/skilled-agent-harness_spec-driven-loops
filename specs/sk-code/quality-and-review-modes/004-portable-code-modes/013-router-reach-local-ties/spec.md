---
title: "Feature Specification: Router reach check scores the shipped fleet and notes operator-local ties"
description: "The router reach check fails only on an operator's machine, because a private surface linked there ties two shipped hubs on phrases they declare. CI never has the surface, the tracked allowlist cannot name it, and the gate's verdict flips with what a checkout links."
trigger_phrases:
  - "router reach local ties"
  - "router reach check scores the shipped fleet"
  - "operator-local reach note"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Router reach check scores the shipped fleet and notes operator-local ties

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/244-router-reach-private-ties` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:skill-advisor router-reach` runs `ci-router-vocabulary-reach.cjs`, which prints `RESULT: FAILED` in the main checkout with two outranked rows: `mcp-tooling` declares "browser agent" and `sk-design` declares "css extraction", and an operator-local surface (a gitignored link under `.skilled/skills/` into another project) ranks first on both. Both phrases are already in the declaring hubs' `graph-metadata.json` `intent_signals`. The surface wins because the explicit lane sums its generic one-word author keywords up to the 1.0 clamp, while the shipped hub's single exact phrase match scores 0.88. CI never has the surface, so the check passes there and fails only on that machine. The tracked allowlist cannot name the winner without leaking a private name, and the surface's own files live in another repository.

### Purpose
The reach check gives the same verdict on every machine by judging the shipped fleet, and it still tells the operator, without naming the surface, when a private surface takes a shipped phrase on their machine.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Main checkout, advisor generation 1779, before the change (private surface name redacted here):
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub mcp-tooling
FAIL mcp-tooling   declared= 75 wrong-hub=  0 outranked=  1 no-reach=  0 allowed=  0 probe-error=  0
       outranked  browser agent        <operator-local>=0.8200, mcp-tooling=0.8200
RESULT: FAILED   (exit 1)
# Whole-fleet run, same generation:
FAIL sk-design     declared= 76 wrong-hub=  0 outranked=  1 no-reach=  0 allowed=  1 probe-error=  0
       outranked  css extraction       <operator-local>=0.8357, sk-design=0.8248

# Lane breakdown for "browser agent" (advisor_recommend with includeAttribution):
<operator-local>  score 0.530663  explicit_author raw 1.0 (2 evidence)  lexical 0.333  derived 0.144
mcp-tooling       score 0.529008  explicit_author raw 0.88 (1 evidence) lexical 0.333  derived 0.478

# The worktree advisor has no private link. The shipped hubs score the same there:
browser agent   -> mcp-tooling 0.529007 confidence 0.82   (top)
css extraction  -> sk-design   0.567083 confidence 0.8248 (top)

# Longer prompts on the main checkout already route to the shipped hub:
"use the browser agent"          -> mcp-tooling 0.82 first
"extract the css from this site" -> sk-design 0.9036 first
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rank only the shipped fleet in the reach check: drop every operator-local recommendation before judging the declaring hub.
- Report a private surface that ranks ahead of the shipped leader as a non-failing `operator-local` note that gives its confidence and never its name.
- Describe the new row kind in the doctor router-reach workflow and its playbook scenario.
- Add a test that fails on the old check and passes on the new one.
- Write one changelog entry for each owning skill, step its `SKILL.md` version and resync the Hermes mirrors.

### Out of Scope
- The private surface's vocabulary - it lives in another repository, and its generic one-word keywords are what take the phrase.
- The explicit lane's summing of one-word keyword hits - a scorer calibration change with TS and Python parity and accuracy ratchets, recorded as a follow-up in `decision-record.md`.
- New stage-one vocabulary for `mcp-tooling` or `sk-design` - both phrases are already declared, and the ADR records why a phrase anchor was not added.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modify | Shipped-fleet ranking, `operator-local` note kind, non-failing kinds in one set |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` | Create | Stand-in advisor cases for the tie, the JSON report, a shipped winner and a trailing private surface |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modify | Row for the new test |
| `.skilled/commands/doctor/assets/doctor-router-reach.yaml` | Modify | The new row kind and how to report it |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-router-reach.md` | Modify | The new row kind in the signals and the pass and fail rules |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.11.0.md`, `.skilled/skills/system-skill-advisor/changelog/v0.17.13.0.md` | Create | Changelog entries |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Version carriers |
| `.hermes/skills/sk-create-skill/SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerate | Hermes mirrors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Run from the main checkout against the main advisor, the changed check prints `RESULT: PASSED` and exits 0, with "browser agent" and "css extraction" as `operator-local` notes. |
| REQ-002 | A private surface ranked ahead of a shipped hub that beats the declaring hub does not hide that loss: the row stays `outranked` or `wrong-hub` and the run exits 1. |
| REQ-003 | No output line and no tracked file names a private surface; a note carries only its confidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `ci-router-vocabulary-reach.test.cjs` fails on the unchanged check and passes on the changed one. |
| REQ-005 | The advisor vitest suite, the advisor Python tests, the doctor phrase probe and every sk-create-skill script test pass, with the vitest counts equal to the pre-change baseline. |
| REQ-006 | Each owning skill has a changelog entry with 0 validator issues and its `SKILL.md` version stepped, and the Hermes mirrors are resynced. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The main-checkout run of the changed check prints `outranked=0`, `operator-local=2` and `RESULT: PASSED` at the same advisor generation where the unchanged check printed `RESULT: FAILED`.
- **SC-002**: The worktree run, which has no private link, prints `RESULT: PASSED` with `operator-local=0`, the same verdict CI gets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The private-skill prefix rule shared by every advisor reader and `.gitignore` | A shipped skill that took the prefix would be dropped from the ranking | `.gitignore` excludes every `/.skilled/skills/local-*` entry, so no tracked skill can carry it |
| Risk | Dropping a recommendation could hide a shipped loss | Med | Hit and presence are judged on the shipped list, and a test proves a shipped winner behind a private surface still fails |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The change adds one array filter per probe and no advisor call.

### Security
- **NFR-S01**: A private surface's id never reaches stdout, stderr or the `--json` report.

### Reliability
- **NFR-R01**: The verdict over the shipped fleet is the same with and without private links on the machine.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: only a private surface clears the bar, so the shipped list is empty and the row is `no-reach`, the same row CI gets.
- Maximum input: several private surfaces ahead of the shipped leader each add their confidence to one note row.
- Failure path: a probe that fails is still a `probe-error` and fails the run, whatever the machine links.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One script, one new test, two contract docs, two changelogs |
| Risk | 5/25 | A read-only diagnostic; the advisor and its scorer are unchanged |
| Research | 10/20 | Lane attribution to find why the private surface ties, and the a versus b decision |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the explicit lane stop a sum of one-word keyword hits from outscoring one exact multi-word phrase? Decision: not here; recorded as a follow-up in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
