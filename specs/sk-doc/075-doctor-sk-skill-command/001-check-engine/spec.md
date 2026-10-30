---
title: "Feature Specification: Phase 1: check-engine"
description: "No script reports how far one skill, or the whole fleet, is from the Skilled format, so a conversion has no baseline and no read-only check to close on. This phase builds sk-skill-check.cjs and its shared probe library, which run the existing validators and print rows C1 to C13 in text or JSON."
trigger_phrases:
  - "check engine"
  - "phase 1 check engine"
  - "doctor skill check rows"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: check-engine

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
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None |
| **Successor** | 002-check-plumbing |
| **Handoff Criteria** | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` passes and every shipped root reports its baseline verdict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: The read-only check engine and its shared probe library. No router, route, YAML or mirror (phase 002) and no write path (phases 003 onward).

**Dependencies**:
- None among the phases. It calls existing validators: `package_skill.py`, `ci-skill-root-metadata.cjs`, `regenerate-skill-derived.cjs`, the router resolver and parser in `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/`, the advisor CLI, `sync-skills-hermes.cjs` and `audit_descriptions.py`.

**Deliverables**:
- `.skilled/commands/doctor/scripts/sk-skill-check.cjs` with `check [<name-or-path>] [--json]`
- `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` with the shared probes
- `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` covering plain, pre-migration, canon, dual-declaration, outside-root, reserved-prefix, direct-hub, and nested-packet cases
- A fleet baseline of `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs` results in `scratch/baseline/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each format gate answers one question on its own: `package_skill.py` gives RS codes, `ci-skill-root-metadata.cjs` gives class and RRC codes, the router resolver gives a verdict, and the advisor, Hermes mirror and changelog index have no check at all. An operator cannot see in one report whether a skill is plain, older Skilled, canon, a dual declaration or a hub, and a later convert phase has no baseline to report a delta against.

### Purpose
`sk-skill-check.cjs` prints one report with rows C1 to C13 for a named skill, or a one-row-per-root fleet table with no argument. `findingCount` counts only FINDING rows; `unknownCount` counts UNKNOWN rows, which remain UNKNOWN and never count as PASS. Exit 0 means there are no FINDING rows, exit 1 means at least one FINDING row exists, and exit 2 means the check cannot run.

### Exit Codes

| Exit | Meaning |
|------|---------|
| 0 | No FINDING rows. UNKNOWN rows may be present; when they are the only non-PASS/INFO rows, text prints `Result: NO FINDINGS (<n> UNKNOWN)`. |
| 1 | At least one FINDING row. |
| 2 | The checker cannot run because a required precondition is missing. |
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs
ls: .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs: No such file or directory
ls: .skilled/commands/doctor/scripts/sk-skill-check.cjs: No such file or directory

$ node -e "const r=require('./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs'); for (const s of ['sk-git','sk-prompt','sk-doc']) console.log(s, r.resolveMachineRouter({skillRoot:'.skilled/skills/'+s}).verdict)"
sk-git router-md
sk-prompt router-md
sk-doc none

$ python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-git --check --strict | tail -1
Result: PASS
exit=0

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --skill sk-git
OK   [S] sk-git
checked=1 passed=1 failed=0 fixed=0
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `sk-skill-check.cjs` with rows C1 to C13 (design section 2.1) in text and `--json` output.
- Build `lib/sk-skill-surface.cjs` with the locate, classify, collision and spawn-wrapper probes the convert phases reuse.
- When `PYTHON` is set, use only that interpreter; otherwise select the first distinct `python3` on `PATH` that imports PyYAML, and name attempted interpreters when none can.
- Report preconditions as exit 2: `SHARED_NOT_BUILT` from the root-router contract (`ci-skill-root-metadata.cjs:57-68`), a missing `@spec-kit/shared` for Hermes sync (`sync-skills-hermes.cjs:18`), and an absent resolver.
- Record the fleet baseline before any later phase changes a root.
- Test the fixture scenarios: plain, pre-migration with a trailing `MACHINE ROUTER`, canon, dual declaration, outside the skills root, a name with the `local-` prefix, a direct hub with a nested packet, and nested `SKILL.md` packets.

### Out of Scope
- The `/doctor:sk-skill` router, route, YAML and mirrors - phase 002 owns the command plumbing.
- Any write to a skill folder - `check` writes nothing; convert starts in phase 003.
- The hub gap report `--into-hub` - phase 008.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Create | `check [<name-or-path>] [--json]`, rows C1 to C13, exit 0/1/2 |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Create | Shared probes: locate, classify, collisions, spawn wrappers |
| `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Create | `node --test` suite over the fixture scenarios and report/failure branches, picked up by the node glob in `tests/run-all.sh:87` |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/` | Create | Fixture skills with invented names, including direct and nested hub cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0 with the plain, pre-migration, canon, dual-declaration, outside-root, `local-` prefix and nested-packet fixtures. |
| REQ-002 | Every shipped root reports the same `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs` verdict as the recorded baseline. |
| REQ-003 | `check` writes nothing: a run over the fleet leaves `git status --porcelain` unchanged. |
| REQ-004 | C2 classifies input kind from `resolveMachineRouter` verdicts `router-md`, `skill-md`, `dual-declaration`, `none` (`router-file-resolver.cjs:116-131`) and the gate's `byClass` (`ci-skill-root-metadata.cjs:903-916`); "plain" means no `allowed-tools` or `version` and verdict `none`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | C8 reports UNKNOWN, never a pass, when `advisor_recommend --warm-only` exits 75; UNKNOWN increments `unknownCount` but does not increment `findingCount` or the exit code. |
| REQ-006 | A missing built shared parser, Hermes dependency or resolver exits 2 and names the cause and the provision command. |
| REQ-007 | `--json` output parses with `JSON.parse` and carries one object per row C1 to C13. |
| REQ-008 | When `PYTHON` is set, `check` uses only that value; an empty value reports `PYTHON_MISSING` without PATH fallback. When unset, it probes distinct `python3` executables on `PATH` in order and selects the first that imports `yaml`. If none does, it exits 2 with `PYYAML_MISSING` and names every interpreter tried; explicit-interpreter `PYTHON_MISSING` and `PYYAML_MISSING` behavior remains. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0.
- **SC-002**: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check --json` lists every shipped root with the baseline verdict and no delta.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Router resolver and parser in sk-code's `sk-code-skilled` surface, which an adopter may drop (`upgrading-a-skill-to-v4.md:74-79`) | C2 and C7 cannot run | Use them in place and exit 2 with a named cause when absent (parent D3) |
| Risk | A `local-` root passes every gate by being skipped (`ci-skill-root-metadata.cjs:169`, `audit_descriptions.py:205-208`) | High | C12 flags the prefix, and the test asserts no `local-` path appears in tracked output |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: C8 probes at most three intent signals per skill, as `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:90-94` scopes the advisor check.
- **NFR-P02**: N/A: the fleet table runs once per invocation and has no throughput target.

### Security
- **NFR-S01**: `check` opens no file for writing; REQ-003 proves it.
- **NFR-S02**: No tracked output names a path with the `local-` prefix.

### Reliability
- **NFR-R01**: Exit 2 is never reported as a pass in text or JSON.
- **NFR-R02**: Exit 75 from the advisor maps to UNKNOWN, never PASS. Only FINDING rows increment `findingCount` and determine exit 1; UNKNOWN rows increment `unknownCount`, do not count as findings, and alone produce `Result: NO FINDINGS (<n> UNKNOWN)` with exit 0. Exit 2 remains reserved for a checker that cannot run.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no argument prints the one-row-per-root fleet table and exits 0 when no root has a FINDING.
- Unknown-only report: when all non-PASS/INFO rows are UNKNOWN, text prints `Result: NO FINDINGS (<n> UNKNOWN)`, JSON includes both counters, and the command exits 0.
- Maximum input: a path outside `.skilled/skills` still runs C3 and C4 via `--skills-dir <its parent>` (design R5); C1 reports it outside the advisor's view (`projection.ts:1536-1556`).
- Failure path: a dual declaration reports verdict `dual-declaration` as a finding, exit 1 (design R2); a missing shared parser exits 2 with `SHARED_NOT_BUILT`.
- Collision: a frontmatter name equal to another `SKILL.md` name, or an `agent-` prefix, is a C12 finding, since Hermes flattens by name and throws on a duplicate (`sync-skills-hermes.cjs:224-226, 239-244`).
- Slug defaults: `intent_signals` equal to the `init_skill.py:381-390` defaults are a C5 finding (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:89`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two new scripts, one test file, fixture skills for the C1-C13 scenarios |
| Risk | 6/25 | Read-only; the risk is a false pass |
| Research | 6/20 | Every probe target is cited in design section 2.1 |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The design fixes rows C1 to C13 and the exit codes.
<!-- /ANCHOR:questions -->

---

