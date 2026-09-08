---
title: "Feature Specification: Phase 13: gate1-instruction-parity"
description: "Root AGENTS.md carries the only authored Gate 1 trigger-index lookup line in the repository, three of five CLI runtimes have no file of their own to carry a copy and nothing checks that every runtime actually reaches the instruction."
trigger_phrases:
  - "gate 1 instruction parity"
  - "runtime instruction file drift"
  - "codex nodeterm block boundary"
  - "trigger index lookup pointer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: gate1-instruction-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/013-gate1-instruction-parity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 16 |
| **Predecessor** | 012-root-resolver-consolidation |
| **Successor** | 014-registration-schema-unification |
| **Handoff Criteria** | The doctor's Gate 1 parity check exists and reports the true reach of the instruction across all five runtimes before phase 14 begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Recorded findings closure specification.

**Scope Boundary**: Only the surface that carries or checks the Gate 1 trigger-index lookup instruction across the five CLI runtimes (root AGENTS.md, `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md`, the Pi session-start hooks and the retrieval doctor workflow). No change to the lookup script itself, the trigger index generator or the hook adapter internals phase 001 owns.

**Dependencies**:
- The confirmed findings in lane 001 round three (R3-1.1, R3-1.2) under `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/001-ripgrep-search-system/research/confirmed-findings.md`
- The retrieval README's existing single-surface statement at `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:87`
- The doctor workflow this phase extends, `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml`

**Deliverables**:
- A doctor Gate 1 parity check that reads what each of the five runtimes actually consults and reports which ones reach the lookup instruction
- A closed gap for Codex, whose `.codex/AGENTS.md` currently carries no Gate 1 pointer at all
- A resolved, documented answer for Pi, whose instruction-loading behavior for a root `AGENTS.md` is not stated anywhere in this repository's own runtime documentation

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate 1's trigger-index lookup instruction is authored in exactly one place, the root `AGENTS.md` (`AGENTS.md:83`), and `CLAUDE.md` is a symlink to it (`lrwxr-xr-x CLAUDE.md -> AGENTS.md`). Lane 001 round three confirmed this single-surface design and recorded it as documented, not defective (R3-1.2, `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/001-ripgrep-search-system/research/confirmed-findings.md:125`. The retrieval README states it plainly at `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:87`). But the design relies on an assumption that is only confirmed for some of the five CLI runtimes this repository ships hooks and mirrors for. `.pi/AGENTS.md` and `.devin/AGENTS.md` do not exist, and neither `.pi/SYNC.md` nor `.cursor/SYNC.md` documents whether the underlying CLI reads a root-level `AGENTS.md` automatically. Only `.devin/SYNC.md:83` states the inheritance explicitly ("Devin inherits the repo's Cursor rule plus root `CLAUDE.md`/`AGENTS.md`"). `.codex/AGENTS.md` does exist (9,598 bytes, 122 lines) but every one of its lines, from `<!-- nodeterm:get-linked-context:start -->` at line 1 to `<!-- nodeterm:manage-canvas:end -->` at line 122, is a block an external tool (nodeterm) generates and owns. `.codex/SYNC.md:33` documents the file as a "hand-authored global voice/tone doc," yet none of that hand-authored content, including any Gate 1 pointer, currently exists in the file. No doctor activity or validate.sh rule reads any of this: `doctor-speckit-retrieval.yaml`'s phase 0 discovery carries staleness signals for the index, the committed manifest pair and the ripgrep recipe, but none for cross-runtime instruction reach (confirmed by reading the workflow's `staleness_signals` block, which has no such entry).

### Purpose
Every runtime this repository supports either carries the Gate 1 lookup instruction directly, is documented and verified to inherit it or receives it through an existing session-lifecycle channel, and a doctor check makes that claim auditable instead of assumed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A doctor Gate 1 parity check that reads the real instruction surface for each of the five runtimes (root AGENTS.md for the runtimes that natively inherit it, `.codex/AGENTS.md` for Codex and Pi's resolved surface) and reports per-runtime reach
- A generated Gate 1 pointer block for `.codex/AGENTS.md`, placed outside the nodeterm markers so nodeterm's own regeneration cannot clobber it and the generator cannot clobber nodeterm's block
- Confirming, from Pi's own vendor documentation or a live probe, whether the Pi CLI reads a root-level `AGENTS.md` automatically, and if it does not, wiring the pointer into an existing Pi session-start hook rather than inventing a new static file convention
- Adding the Gate 1 pointer to `.cursor/rules/skill-routing.md`, the one hand-authored rules file both Cursor and Devin already read (`.cursor/SYNC.md:29`, `.devin/SYNC.md:83`)
- Updating the retrieval README's single-surface claim at `runtime/cli/retrieval/README.md:87` once the parity check exists

### Out of Scope
- Porting the gate-enforcement hook adapters (`spec-gate-classify.ts`, `spec-gate-enforce.ts`) onto a shared core - that is phase 001's `hook-adapter-thin-transports` charter, a different axis (adapter implementation, not instruction-file reach)
- Editing nodeterm's own generated block inside `.codex/AGENTS.md` - it is owned by an external tool and this phase's generator writes only outside its markers
- Changing the trigger-index generator, the lookup script or the ripgrep recipe conventions - unrelated to instruction-file parity

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modify | Add a `gate1_instruction_parity` staleness signal and a phase 0 activity that reads each runtime's real surface |
| `.codex/AGENTS.md` | Modify | Add a generated Gate 1 pointer block outside the nodeterm markers (currently lines 1-122) |
| `.cursor/rules/skill-routing.md` | Modify | Add the Gate 1 pointer line, read by both Cursor and Devin |
| `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` or `session-start-context.ts` | Modify, conditional on the Pi investigation | Inject the Gate 1 pointer at session start if Pi does not natively read root AGENTS.md |
| A new generator script under `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/` (name to be chosen during implementation, mirroring `sync-runtime-mirrors.cjs`'s `--check` pattern) | Create | Extracts the Gate 1 line from root AGENTS.md and writes the Codex pointer block, so the pointer cannot drift from the canonical line |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Correct line 87's "no runtime-specific instruction file carries a copy" once some do |
| `.cursor/SYNC.md` | Modify | Note that `rules/skill-routing.md` now carries a generated Gate 1 block alongside its hand-authored content |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A doctor Gate 1 parity check reads the actual instruction surface each runtime consults and reports, per runtime, whether the Gate 1 lookup instruction is reachable |
| REQ-002 | `.codex/AGENTS.md` carries a Gate 1 pointer placed strictly outside the nodeterm-owned block, verified by re-running the file's marker boundaries after the change |
| REQ-003 | Pi's actual root-AGENTS.md consumption behavior is confirmed from a source outside assumption (vendor documentation or a live probe) and the answer is recorded in `.pi/SYNC.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The Codex pointer content is produced by a generator script reading the root AGENTS.md Gate 1 line, not hand-duplicated text, with a `--check` mode that reports drift the same way `sync-runtime-mirrors.cjs` and `sync-prompts.cjs` already do |
| REQ-005 | `.cursor/rules/skill-routing.md` carries the Gate 1 pointer, closing the gap for both Cursor and Devin through the one file they already share |
| REQ-006 | The retrieval README's single-surface claim at `runtime/cli/retrieval/README.md:87` is corrected to describe the parity that now exists |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running the new doctor Gate 1 parity check reports zero runtimes with no path to the Gate 1 instruction, where "a path" means a direct pointer, a documented and verified inheritance or a session-start injection
- **SC-002**: The nodeterm-owned block inside `.codex/AGENTS.md` (its 122 lines as observed at spec time) is byte-identical before and after the generator runs, proven by diffing the marker-delimited region
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | nodeterm's own regeneration of `.codex/AGENTS.md` | nodeterm could, at any future run, widen its markers to cover the whole file again and silently remove a pointer placed outside them | The generator's `--check` mode re-verifies placement on every run instead of assuming it once. The doctor parity check also re-reads the file live |
| Risk | Pi's real AGENTS.md consumption is undocumented in this repository | A design decision (static pointer versus hook injection) could be made on an unconfirmed assumption | REQ-003 blocks P0 completion until the behavior is confirmed from outside this repository's own docs |
| Risk | `.cursor/rules/skill-routing.md` is classified "hand-authored" in `.cursor/SYNC.md:29` | Adding a generated block to a file documented as hand-authored changes that classification and could go stale itself if `.cursor/SYNC.md` is not updated alongside it | Files to Change lists `.cursor/SYNC.md` as a required edit in the same phase |
| Dependency | The doctor workflow `doctor-speckit-retrieval.yaml` this phase extends | If its phase 0 structure changes upstream before this phase lands, the new activity and signal need re-anchoring | The new signal is additive (one new key in `staleness_signals`, one new activity in `phase_0_discovery`), minimizing merge surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new doctor activity adds no more than a handful of file reads and one directory-of-symlinks listing (`.pi/extensions/`) to phase 0 discovery. It must not require a network call or a build step
- **NFR-P02**: The generator script that writes the Codex pointer runs in well under a second, matching `sync-prompts.cjs`'s existing per-runtime generation cost

### Security
- **NFR-S01**: The generator never writes inside the nodeterm markers and never deletes content it did not itself generate, since nodeterm is an external tool this repository does not control
- **NFR-S02**: No credential, token or workstation-absolute path is introduced by this phase. The existing workstation-absolute paths inside the nodeterm block (`.codex/AGENTS.md:9-12,30`) are left untouched, since they are nodeterm's own content, not this phase's

### Reliability
- **NFR-R01**: The doctor parity check fails closed on a missing or unreadable instruction file (reports MISSING, not a false pass) the same way `doctor-speckit-retrieval.yaml`'s existing fail-fast rows already do
- **NFR-R02**: A generator run that finds the nodeterm markers already gone or reshaped stops rather than guessing where to place the pointer, and reports the mismatch instead of writing into an unknown structure
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Root AGENTS.md's Gate 1 line changes wording or line number: the generator re-extracts on every run rather than caching a copy, so the pointer tracks the canonical line
- `.codex/AGENTS.md` is entirely replaced by nodeterm with new markers or a different structure: the generator's placement check fails closed and reports drift rather than writing at an assumed offset
- `.pi/extensions/` gains or loses a symlink between doctor runs: the parity check reads the directory listing fresh each run, so it never caches a stale set

### Error Scenarios
- The doctor's file reads hit a runtime file that is missing entirely (for example if `.codex/AGENTS.md` were deleted): reported as MISSING for that runtime, not silently skipped
- The Pi investigation cannot get a definitive answer from vendor documentation: the plan requires a live probe as the fallback, and the answer, whichever it is, is recorded rather than left open
- `.cursor/rules/skill-routing.md` is edited by another session between this phase's planning and its implementation: the plan's first task re-reads the file's current content before appending, consistent with the coordination discipline this program uses elsewhere

### State Transitions
- Partial completion: if only the doctor check ships and the Codex/Cursor pointers do not, the check must still report the true (still-incomplete) state rather than a false pass. The acceptance criteria treat REQ-001 and REQ-002/REQ-005 as independently verifiable
- Nothing in this phase is session-scoped or time-limited, so there is no expiry behavior to define
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Seven files touched, all documentation or thin generator/doctor logic. No runtime code path for the trigger index itself changes |
| Risk | 10/25 | The main risk is colliding with an externally owned generated block (nodeterm). Mitigated by writing strictly outside its markers and re-verifying on every run |
| Research | 14/20 | Requires confirming Pi's undocumented AGENTS.md behavior from outside this repository, which is the one open investigative step |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the Pi CLI read a root-level `AGENTS.md` automatically, the way Codex and (by `.devin/SYNC.md:83`'s own account) Devin's underlying model context does? No document in `.pi/SYNC.md` or `.pi/extensions/README.md` answers this, and it decides whether Pi needs a static pointer or a hook-based injection.
- Should the Codex pointer sit before or after the nodeterm block in `.codex/AGENTS.md`? Either placement satisfies "outside the markers". The implementation should pick whichever keeps the generator's insertion logic simplest to verify.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
