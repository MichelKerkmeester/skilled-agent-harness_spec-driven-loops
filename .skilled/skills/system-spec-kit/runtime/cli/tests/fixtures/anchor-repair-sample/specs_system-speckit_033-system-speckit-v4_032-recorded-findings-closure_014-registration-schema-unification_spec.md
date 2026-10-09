---
title: "Feature Specification: Phase 14: registration-schema-unification"
description: "Five CLI runtimes register the same hook set through five hand-authored, structurally different schemas, and lane 005 recorded the finding without fixing it because the registrations sat outside that packet's write scope."
trigger_phrases:
  - "registration schema unification"
  - "hook registration drift"
  - "one behavioral contract five schemas"
  - "generated hook registration check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: registration-schema-unification

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
| **Branch** | `scaffold/014-registration-schema-unification` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 16 |
| **Predecessor** | 013-gate1-instruction-parity |
| **Successor** | 015-criteria-file-line-enforcement |
| **Handoff Criteria** | The generator's first run against the current, hand-authored registration files reproduces them byte-for-byte, proving the canonical source before anything downstream depends on it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Recorded findings closure specification.

**Scope Boundary**: Only the hook *registration* layer (which event, on which runtime, calls which script) for the four runtimes that register hooks through JSON, plus a verification pass over Pi's symlink-based registration. The hook adapter scripts' own internal implementation (`spec-gate-classify.ts`, `spec-gate-enforce.ts` and their siblings) is phase 001's charter, not this one's.

**Dependencies**:
- Lane 005 round one F12, `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/005-overengineering-simplification/research/confirmed-findings.md:49`
- The existing generate-and-check pattern in `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, which already reads (but does not generate) all four JSON registration files to build discovery-mirror symlinks
- The `mirrors` job in `.github/workflows/spec-kit-check.yml:92-122`, the CI surface a new `--check` call would join

**Deliverables**:
- One canonical hook-set source describing every hook once
- A generator that produces `.claude/settings.json`'s `hooks` key, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` from that source, in each runtime's own shape
- A verification pass confirming Pi's `.pi/extensions/*.ts` symlinks match the same canonical hook set, since Pi has no JSON to generate

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five CLI runtimes each register the same behavioral contract (which script runs on which lifecycle event) through five hand-authored files that disagree on structure, not just syntax. `.claude/settings.json` (204 lines) nests the hooks a runtime's `hooks` object among unrelated settings (`env`, `statusLine`, `skillListingBudgetFraction`) and wraps every command in a `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && ... || { mk-hook-drift envelope }'` shell guard. `.codex/hooks.json` (157 lines) is a pure hooks file with the same nested `{matcher, hooks:[{type,command,timeout}]}` shape but a different project-dir variable and a plain-string matcher (`"exec"`). `.cursor/hooks.json` (106 lines) wraps its hooks object in `{version, hooks}`, uses camelCase event names (`preToolUse`, not `PreToolUse`), stores hooks as a flat array with no `matcher` field at all and runs commands unwrapped, with no `bash -c` shell guard. `.devin/hooks.v1.json` (178 lines) puts the event names directly at the file's top level with no wrapping `hooks` key, and its matcher is a regex-anchored string (`"^exec$"`) where Codex's is a bare tool name. Pi registers no JSON at all: it auto-discovers `.pi/extensions/*.ts` symlinks by file presence, and the event binding (`pi.on("tool_call", handler)`) lives inside the TypeScript file itself, using yet a third event-name vocabulary (`input`, `tool_call`, `session_start`, `turn_end`, `session_shutdown`, `session_compact`). Lane 005 round one confirmed this as finding F12 and recorded it without fixing it, because the registration files sat outside that packet's own write scope (`specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/005-overengineering-simplification/research/confirmed-findings.md:49`). No generator currently produces any of the four JSON files. `sync-runtime-mirrors.cjs` reads them as sources for its own, separate discovery-mirror symlinks (`.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/`) and never writes back to them.

### Purpose
One canonical source describes the hook set once, and the four JSON registration files, plus Pi's symlink set, are produced or verified from it, so a behavioral change to the hook contract requires one edit instead of five hand-synchronized ones.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A canonical hook-set source naming, per hook, the lifecycle concern it serves, the runtime events it binds to (in each runtime's own event-name vocabulary) and the script it invokes
- A generator that writes `.claude/settings.json`'s `hooks` key (leaving the file's other keys untouched), `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` in each runtime's exact existing structural dialect
- A `--check` mode reporting drift without writing, matching `sync-runtime-mirrors.cjs --check`'s convention
- A verification pass (not a generator, since Pi has no file to generate into) confirming every `.pi/extensions/*.ts` symlink the canonical source implies exists and points at the correct real file
- Wiring the new `--check` call into the `mirrors` job of `.github/workflows/spec-kit-check.yml`, alongside the existing four mirror checks

### Out of Scope
- The hook adapter scripts' own internal implementation and the port onto a shared core - phase 001's `hook-adapter-thin-transports` charter, a different axis (what a script does once called, not how it gets registered)
- `sync-runtime-mirrors.cjs`'s existing discovery-mirror symlink generation (`.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/`) - it stays exactly as it is, reading the newly-generated registration files the same way it reads today's hand-authored ones
- Any behavioral change to which script runs on which event - the first generator run must reproduce the current registration files byte-for-byte. Changing what the hook set does is a separate, later decision

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| A new canonical source under `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/` (for example `hook-registration-source.json`, exact name chosen during implementation) | Create | Describes every hook once: concern, per-runtime event name, script path, matcher |
| A new generator script under the same directory (for example `sync-hook-registrations.cjs`) | Create | Produces the four JSON files' hook content and verifies Pi's symlinks, with `--check` |
| `.claude/settings.json` | Modify (generated `hooks` key only) | Its `hooks` object becomes generator output. `env`, `statusLine` and other keys stay hand-authored |
| `.codex/hooks.json` | Modify (generated) | Whole file becomes generator output |
| `.cursor/hooks.json` | Modify (generated) | Whole file becomes generator output |
| `.devin/hooks.v1.json` | Modify (generated) | Whole file becomes generator output |
| `.opencode/skills/system-spec-kit/runtime/hooks/README.md` | Modify | Document the canonical source and the generate-and-check workflow |
| `.github/workflows/spec-kit-check.yml` | Modify | Add the new generator's `--check` call to the `mirrors` job (currently lines 92-122) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | One canonical hook-set source names, for every hook, its concern, its per-runtime event bindings and the script it invokes |
| REQ-002 | A generator produces `.claude/settings.json`'s `hooks` key, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` from that source, in each runtime's own existing nesting shape, matcher dialect and wrapper convention |
| REQ-003 | The generator's first run against the current repository reproduces all four files byte-for-byte, proving the canonical source captures today's behavior exactly before any change is asked of it |
| REQ-004 | A `--check` mode reports drift between the generated output and the committed files without writing, following the `sync-runtime-mirrors.cjs --check` convention |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A verification pass confirms every `.pi/extensions/*.ts` symlink the canonical source implies exists and resolves to the correct file, since Pi has no JSON registration to generate |
| REQ-006 | `sync-runtime-mirrors.cjs`'s existing `hookSourcesFromConfig()` script-path extraction keeps working unmodified against the generated files |
| REQ-007 | The hooks README documents the canonical source and the generate-and-check workflow |
| REQ-008 | The new `--check` call is wired into the `mirrors` job of `.github/workflows/spec-kit-check.yml` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node <generator script> --check` exits 0 against the repository's current state, proving the canonical source and the four hand-authored files describe the same hook set
- **SC-002**: Every hook test named by phase 001's own brief (`directive-lifecycle-adapter-parity`, `completion-evidence` suites and each runtime's per-adapter hook test) passes unchanged after the registration files are regenerated
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The four schemas differ on four independent structural axes: nesting shape (`{hooks:{Event:[...]}}` vs a bare top-level event map), matcher dialect (bare tool name, regex-anchored string or absent), the shell-wrapper convention (`bash -c 'cd "$RUNTIME_PROJECT_DIR" && ...'` present or absent) and the fallback-envelope JSON shape | A generator that treats this as "one JSON shape with renamed keys" will silently produce wrong output for at least one runtime | The generator is designed and reviewed as a per-runtime template, with REQ-003's byte-for-byte round-trip as the proof it modeled each dialect correctly |
| Risk | `.claude/settings.json` carries unrelated hand-authored keys (`env`, `statusLine`, `skillListingBudgetFraction`, `autoCompactEnabled`, `autoCompactWindow`) alongside `hooks` | A generator that owns the whole file would clobber those keys on every run | The generator merges into only the `hooks` key, leaving the rest of the file untouched, verified by a diff of the non-hooks keys before and after |
| Dependency | `sync-runtime-mirrors.cjs`'s `hookSourcesFromConfig()` regex-extracts script paths from the raw text of each config file | If the generator's output formatting changes how paths appear in the JSON (for example different quoting or line wrapping), the existing mirror symlink generator could stop finding them | REQ-006 requires confirming the existing mirror generator's `--check` still passes against the newly-generated files |
| Dependency | CI's `mirrors` job in `.github/workflows/spec-kit-check.yml` | The new `--check` call is additive to an existing job. A structural change to that job upstream would need re-anchoring but would not block the generator itself from being built and tested locally | The new call is one added line, minimizing merge surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The generator runs in well under a second for four small JSON files, matching the existing cost of `sync-runtime-mirrors.cjs` and `sync-prompts.cjs`
- **NFR-P02**: The `--check` call added to CI adds no more than one additional `node` invocation to the existing `mirrors` job

### Security
- **NFR-S01**: The generator never introduces a new secret, token or credential. Every command string it emits is a repo-relative script path plus the existing fallback-envelope text, unchanged in content
- **NFR-S02**: The generator writes only inside the five files this phase names. It never touches `.pi/extensions/` content, only verifies it

### Reliability
- **NFR-R01**: The generator fails closed (non-zero exit, no partial write) if the canonical source is malformed or a referenced script path does not exist on disk
- **NFR-R02**: A `--check` run that finds drift reports which file and which hook diverged, not just a pass/fail boolean, so a human or CI log can act on it without re-deriving the diff by hand
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A hook that exists in one runtime's file but not another's (for example `PermissionRequest` and `PostCompaction`, which only Devin's schema carries): the canonical source models per-runtime applicability explicitly rather than assuming every hook binds to every runtime
- `.cursor/hooks.json`'s lack of a `matcher` field for some events: the generator omits the field for Cursor rather than emitting an empty or null placeholder that was never there before
- Pi's three-word event vocabulary (`tool_call`, `session_start` and so on) has no one-to-one mapping to the PascalCase/camelCase vocabulary the other four runtimes use for the same lifecycle moment: the canonical source's per-runtime event field carries Pi's own event name for the hooks Pi participates in, not a translated guess

### Error Scenarios
- A script path named in the canonical source does not exist on disk: the generator fails closed per NFR-R01 rather than writing a registration that would trigger the `mk-hook-drift` fallback envelope at runtime
- The generator's first run does not reproduce a file byte-for-byte: REQ-003 blocks completion until the mismatch is understood and either the canonical source or the generator's per-runtime template is corrected, since a silent behavioral change here would alter what every hook does at every runtime's next session

### State Transitions
- Nothing in this phase is session-scoped. The registration files are read once per runtime session start, and a generator run between sessions has no partial-state concern
- If the generator run and a hand-edit to one of the four files happen concurrently (for example another session editing `.claude/settings.json`'s non-hooks keys while this phase's generator runs), the merge-into-`hooks`-key-only design in REQ-002 keeps the two changes from colliding, since the generator never touches the other keys
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Four JSON files across four structurally different schemas, one new canonical source, one new generator, plus a CI wiring edit |
| Risk | 15/25 | The main risk is the four-axis structural divergence producing a generator that looks right but emits a subtly wrong shape for one runtime. REQ-003's byte-for-byte proof is the direct mitigation |
| Research | 8/20 | The schemas are already fully characterized in this spec's problem statement. Implementation is templating work, not further investigation |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the canonical source be JSON (matching the runtime files it feeds) or a small TypeScript module (matching `sync-runtime-mirrors.cjs`'s own `HOOK_CONFIGS` constant style)? Either satisfies REQ-001. The choice should follow whichever makes the per-runtime template functions easiest to keep in sync with their four source files during implementation.
- Should `.pi/extensions/`'s symlinks eventually be generated (not just verified) once this phase proves the canonical source is complete? That would fold Pi fully into the same pipeline, but it is a larger change than this phase's verification-only scope and is deliberately deferred rather than assumed.
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
