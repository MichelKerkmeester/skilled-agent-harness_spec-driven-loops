---
title: "Feature Specification: Phase 3: convert-legacy-skilled"
description: "An older Skilled skill keeps its MACHINE ROUTER section inside SKILL.md and fails the strict format check on RS-002, RS-004 and RS-005, and no tool moves it. This phase builds sk-skill-convert.cjs plan and apply for that input, moving the section verbatim into ROUTER.md and proving the parsed router is unchanged."
trigger_phrases:
  - "convert legacy skilled"
  - "phase 3 convert legacy skilled"
  - "move machine router to ROUTER.md"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: convert-legacy-skilled

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 10 |
| **Predecessor** | 002-check-plumbing |
| **Successor** | 004-convert-plain-skill |
| **Handoff Criteria** | The golden test passes with a byte-equal machine section, equal `parseRouter` output and strict PASS; a second `apply` is a no-op |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: Convert core for input (b), an older Skilled skill whose router is still in `SKILL.md`: preflight V0, frontmatter V2, router move V3(b), backups, exclusive create and the `parseRouter` proof. Plain-skill steps are phase 004; integration is phase 005; the convert YAML is phase 006.

**Dependencies**:
- Phase 001: `sk-skill-check.cjs` and `lib/sk-skill-surface.cjs` for the V0 preflight.
- `resolveMachineRouter` (`router-file-resolver.cjs:88-94, 116-131`) and `parseRouter` (`router-replay-lib.cjs:404-430, 856`) in `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/`.
- `skill-router-template.md` (`.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md:1-47`).

**Deliverables**:
- `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` with `plan` (default) and `apply`
- `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` with the V2 and V3(b) transforms
- `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` with the golden fixture

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fleet move to `ROUTER.md` took each trailing `MACHINE ROUTER` section verbatim into `ROUTER.md` under `## 3. MACHINE ROUTER` and added one link line (commit `ca10a236d2`), but no script performs that move for a skill outside the fleet. A pre-move copy of `sk-git` resolves `skill-md` and fails `package_skill.py --json --strict` on RS-002, RS-004 and RS-005 (design section 7).

### Purpose
`sk-skill-convert.cjs apply` moves the section into a new `ROUTER.md`, fills the four-part `version`, and proves `parseRouter` returns the same intents, resource map and default before and after, or rolls the step back.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/commands/doctor/scripts/sk-skill-convert.cjs
ls: .skilled/commands/doctor/scripts/sk-skill-convert.cjs: No such file or directory

$ node -e "const r=require('./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs'); console.log(r.resolveMachineRouter({skillRoot:'.skilled/skills/sk-git'}).verdict)"
router-md
```
The pre-move evidence is the design's own run (design section 7): the `sk-git` copy at `ca10a236d2^` resolved `skill-md`, reported "3 contract requirement(s) unmet" (RS-002 at line 459, RS-004, RS-005), and `parseRouter` returned 5 intents from source `inline` against 5 from `ROUTER.md` on the current tree, with intents, map and default equal.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- V0 preflight: run `check`; refuse a dual declaration, any hub declaration, a half hub declaration (`skill-root-metadata-contract.md:37-46`), nested `SKILL.md` packets, a `local-` prefix and collisions.
- V2 frontmatter: add a four-part `version` (keep an existing one, else `1.0.0.0`), normalize `allowed-tools` to a YAML array, keep `name` and `description` bytes.
- V3(b) router move: take the trailing `## N. MACHINE ROUTER` section, and any machine block left inside SMART ROUTING (RS-002 causes, `package_skill.py:1157-1175`), verbatim into `ROUTER.md` built from the router template frontmatter and heading, under `## 3. MACHINE ROUTER`; append the link line to SMART ROUTING.
- Copy pre-edit bytes to `.skilled/skills/.state/doctor-sk-skill/<name>/<timestamp>/` (gitignored, `.gitignore:132`) before any overwrite; create new files with an exclusive create, as `sk-code-quality-config.cjs:21-22, 85` does.
- `plan` prints every step with each overwrite named; `apply` writes only with `--apply`.

### Out of Scope
- Plain skills, V1 staging, V4 to V8 - phase 004.
- Integration rows I1 to I6 - phase 005.
- The convert YAML and yes gate - phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Create | `plan` and `apply`, `--apply` gate like `sk-code-quality-config.cjs` |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Create | Pure V2 and V3(b) text transforms |
| `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Create | Golden, idempotence and no-replace tests |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/` | Create | Pre-move framework skill copy and its post-move `ROUTER.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Converting the fixture copy of a pre-move framework skill yields a `ROUTER.md` whose machine section is byte-equal to the post-move file. |
| REQ-002 | `parseRouter` on the staged snapshot deep-equals `parseRouter` after the move; a difference rolls the step back. |
| REQ-003 | The converted fixture passes `package_skill.py --check --strict`. |
| REQ-004 | A second `apply` on the converted fixture writes nothing. |
| REQ-005 | An existing target file is never replaced: creates use an exclusive create, and every overwrite has a backup first. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | V0 refuses a dual declaration, a hub declaration, nested `SKILL.md` packets and a `local-` prefixed name, each with a named reason and no write. |
| REQ-007 | `plan` without `--apply` writes nothing and names every overwrite. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` exits 0 with the golden, idempotence and no-replace cases.
- **SC-002**: The converted fixture prints `Result: PASS` from `package_skill.py --check --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parseRouter` and `resolveMachineRouter` in sk-code-skilled (parent D3) | No proof, no move | Exit 2 with a named cause when absent |
| Risk | Routing drift during conversion (design R8) | High | `parseRouter` equality gate; any difference rolls the step back from the backup |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: a one-skill text transform with no latency target.
- **NFR-P02**: N/A: no throughput target applies.

### Security
- **NFR-S01**: No write happens without `--apply`.
- **NFR-S02**: Backups go only under the gitignored `.skilled/skills/.state/` tree.

### Reliability
- **NFR-R01**: A failed step restores its pre-edit bytes from the backup.
- **NFR-R02**: `apply` is idempotent: a second run is a no-op.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with verdict `router-md` skips V3 entirely (design R2).
- Maximum input: a machine block left inside SMART ROUTING as well as the trailing section moves both, in order, verbatim.
- Failure path: verdict `dual-declaration` refuses, because two maps that disagree are a fault to report (`router-file-resolver.cjs:100-110, 128`); `ROUTER.md` present but declaring nothing while SKILL.md declares refuses, prints both and overwrites nothing.
- Hub candidate: nested `SKILL.md` packets, a `mode-registry.json` or a `hub-router.json` refuse; otherwise the plan asks the one-job question once and "several" stops with the `/create:skill-parent` command line (design R3).
- Names: a `.skilled/skills/<name>` that exists and is not the source, a frontmatter name equal to another `SKILL.md` name, or an `agent-` or `local-` prefix refuses (design R1).
- Description over 130 characters: convert stops before the format gate unless the operator accepts a separately named trim (parent D1).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Two new scripts, one test file, one fixture pair |
| Risk | 14/25 | First write path; overwrites skill files |
| Research | 5/20 | The move was replayed in the design |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The design replayed the move on `sk-git` and fixed the proof.
<!-- /ANCHOR:questions -->

---

