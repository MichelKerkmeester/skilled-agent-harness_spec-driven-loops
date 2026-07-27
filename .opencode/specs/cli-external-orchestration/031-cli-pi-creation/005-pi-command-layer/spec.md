---
title: "Feature Specification: Phase 5: pi-command-layer"
description: "Plan flattening the 36 invokable .opencode/commands/*.md slash commands (of 49 total .md files) into Pi's flat, non-recursive .pi/prompts/*.md prompt-template format, with a naming convention and an $ARGUMENTS-to-$1/$2/$@/${1:-default} translation table."
trigger_phrases:
  - "pi command layer"
  - "pi prompt templates"
  - "command flattening"
  - "argument translation"
  - "pi non-recursive discovery"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T10:01:30Z"
    last_updated_by: "claude-code"
    recent_action: "Design re-verified live, zero drift; phase complete"
    next_safe_action: "Commit; phase 006 proceeds with the Task-dependency list"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Pi's prompt-template loader gracefully ignore unrecognized frontmatter keys (allowed-tools, skill, title, version), or does an unknown key cause a load error?"
      - "Does ${1:-default} behave with exact bash semantics, and does Pi expose a $@-minus-$1 remainder primitive for sub-action-then-flags patterns?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: pi-command-layer

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete - planning doctrine fully verified and re-derived live with zero drift; actual `.pi/prompts/*.md` creation and live Pi dispatch stay out of scope (deferred to a future execution pass) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 11 |
| **Predecessor** | 004-pi-skill-discovery-bridge |
| **Successor** | 006-pi-agent-bridge |
| **Handoff Criteria** | At least one sample command from each of the 8 command groups (top-level, `create/`, `deep/`, `doctor/`, `interface/`, `memory/`, `prompt/`, `speckit/`) dispatches correctly as a flattened `/name` Pi prompt template with working argument substitution |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the CLI Pi creation specification.

**Scope Boundary**: Plan (not execute) the flattening of this repo's 36 invokable Claude-Code-style slash commands into Pi's flat, non-recursive `.pi/prompts/*.md` prompt-template format, plus a translation table from Claude's `$ARGUMENTS`/`argument-hint`/`allowed-tools` conventions to Pi's `$1`/`$2`/`$@`/`${1:-default}` substitution syntax. No direct 029 (Devin) or 030 (Cursor) precedent phase exists for this scope — Devin and Cursor have no native custom-slash-command format at all, so their packets never needed a command-porting phase. This phase is planned on its own merits from the pi.dev docs findings and the real `.opencode/commands/` tree.

**Dependencies**:
- Phase 004 (`pi-skill-discovery-bridge`) establishes whether pointing Pi at a repo directory (`.pi/settings.json` `skills`/`prompts`-style config) behaves as this phase assumes for `.pi/prompts/`; not yet run.
- Phase 001 (`pi-contract-pin`) is the only phase that live-installs Pi and runs a real session. Every claim in this phase about Pi's prompt-template mechanics traces back to the pi.dev docs findings supplied for planning and is UNCONFIRMED until phase 001 (or this phase's own future execution) runs a real `pi` session.
- The real `.opencode/commands/` tree, directly enumerated during authoring (`find .opencode/commands -name "*.md" | wc -l` → 49; `grep -rl "^argument-hint:" .opencode/commands --include="*.md" | wc -l` → 36).

**Deliverables**:
- A concrete flattening/naming convention mapping all 36 invokable commands to unique `.pi/prompts/*.md` filenames (verified zero collisions), satisfying Pi's non-recursive discovery constraint by construction (single flat directory, no subfolders).
- A translation table from Claude's `$ARGUMENTS`/`argument-hint`/`allowed-tools` conventions to Pi's `$1`/`$2`/`$@`/`${1:-default}` substitution syntax, covering every argument-hint pattern actually present in the 36 commands.
- A documented frontmatter-key gap list (`allowed-tools`, `skill`, `title`, `version` — no confirmed Pi analog) with an explicit disposition per key.
- A full 36-row per-group worklist (source path → flattened filename → `/invocation` → Task-tool dependency flag) a future execution pass can apply mechanically.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repository organizes 36 invokable operator commands (plus 13 non-command supporting files) as nested Markdown under `.opencode/commands/{create,deep,doctor,interface,memory,prompt,speckit}/*.md` plus 2 top-level files, using Claude Code's colon-namespaced invocation (`/deep:research`, `/create:skill`) and a single opaque `$ARGUMENTS` string that each command's own router logic parses for flags and mode suffixes. Pi's prompt-template system (per pi.dev docs, `https://pi.dev/docs/latest/prompt-templates`) discovers commands from a single flat, non-recursive directory — `.pi/prompts/*.md` — where "the filename becomes the command name," and arguments substitute positionally via `$1`/`$2`/`$@`/`${1:-default}`. There is no documented colon-namespace or subfolder discovery, and discovery is explicitly non-recursive. Without an explicit flattening and argument-translation plan, the 36 commands cannot be ported into Pi without either colliding names, silently breaking on Pi's non-recursive discovery, or losing the flag-heavy argument grammar every router command's own "MODE ROUTING" logic depends on.

### Purpose
Produce a concrete, collision-free flattening/naming convention and a general-purpose `$ARGUMENTS`-to-`$1`/`$2`/`$@`/`${1:-default}` translation table — grounded in the real 49-file `.opencode/commands/` tree and the pi.dev docs findings — that a later execution pass can apply mechanically, with every unconfirmed pi.dev-only claim flagged for live verification and every cross-phase functional gap (subagent dispatch via phase 006, MCP via phase 007) named rather than silently assumed to already work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate and classify all 49 `.opencode/commands/**/*.md` files into 36 invokable commands (8 groups + 2 top-level) and 13 non-command supporting files, with the classification rule stated: presence of the uniform `description`+`argument-hint`+`allowed-tools` frontmatter triad (all 36 invokable commands carry all three; the 13 supporting files carry none of them — they use a different `title`/`trigger_phrases` frontmatter shape typical of developer-reference docs).
- Define the flattening/naming convention: `<group>-<name>.md` for nested commands (colon namespace `/group:name` → hyphenated flat name `/group-name`), unchanged basenames for the 2 already-flat top-level commands, verified collision-free across all 36 resulting names.
- Define the `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table, covering the 5 argument-hint patterns actually observed: whole-string self-parsing routers (majority), single required positional slots, sub-action enum tokens, GNU-style `--flag=value` grammars, and `:auto`/`:confirm` mode suffixes.
- Document the frontmatter-key gap: `allowed-tools` (36/36 commands), `skill` (2/36: `deep/command-benchmark.md`, `deep/skill-benchmark.md`), `title` (1/36: `deep/ai-council.md`), `version` (1/36: `agent-router.md`) have no confirmed Pi prompt-template frontmatter analog per the pi.dev findings supplied to this phase.
- Flag the cross-phase functional dependency: 14 of the 36 commands list `Task` in `allowed-tools` (subagent dispatch) — they will flatten and register mechanically but stay functionally gated for their subagent-dispatch behavior until phase 006 lands the third-party `pi-subagents` package.
- Produce a per-group worklist (36 rows: source path, flattened filename, `/invocation` name, Task-dependency flag) usable directly by a future execution pass.

### Out of Scope
- Actually creating any `.pi/prompts/*.md` file, installing Pi, or running any `pi` command — this phase is planning-only (Hard Constraints, packet-wide).
- Live-verifying Pi's actual substitution behavior (whether `${1:-default}` behaves bash-like, whether a missing `$1` errors or substitutes empty, whether unrecognized frontmatter keys are ignored or rejected by the loader) — deferred to phase 001 or this phase's own future execution.
- Translating the 13 non-command supporting files (5 developer-reference READMEs, 4 compiled command contracts, 4 legacy router bodies under `deep/assets/`) into Pi prompt templates — they are not user-invokable and stay under `.opencode/commands/` untouched.
- Rewriting the owned YAML workflow assets or presentation-contract `.txt` files the router commands reference (e.g. `create/assets/create-skill-*.yaml`, `speckit/assets/speckit-resume-presentation.txt`) — those stay in place; only the router entry-point `.md` files themselves get ported.
- Wiring `.pi/settings.json`, `.pi/skills/`, `.pi/extensions/`, or `.pi/mcp.json` — those belong to phases 001, 004, 007, and 008 respectively.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/prompts/*.md` (36 files, planned) | Create | Flattened Pi prompt templates, one per invokable command, per the naming convention in plan.md §3 |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/pi-command-layer.md` (planned, path TBD) | Create | Persisted flattening map + translation table doctrine; exact location deferred — see Open Questions |
| `.opencode/commands/**/*.md` (36 source files) | Read-only reference | Source content for each ported prompt; not modified by this phase or by this phase's future execution |
| `.opencode/commands/deep/assets/{compiled,legacy}/*.md`, `**/README.md` (13 files) | Unchanged | Explicitly excluded from porting — internal command-injection plumbing, not user-invokable commands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 49 `.opencode/commands/**/*.md` files are classified into exactly 36 invokable commands and 13 non-command supporting files, with the classification rule stated and falsifiable by re-running the same frontmatter grep. | `grep -rl "^argument-hint:" .opencode/commands --include="*.md" \| wc -l` returns 36 at execution time; the remaining 13 files match the stated supporting-file classes. |
| REQ-002 | The flattening/naming convention produces 36 unique `.pi/prompts/*.md` filenames with zero collisions. | A sorted list of the 36 planned flattened names has no duplicate entries (verified in plan.md §3's worklist). |
| REQ-003 | The naming convention keeps every ported file in the single flat `.pi/prompts/` directory (no subfolders), satisfying Pi's documented non-recursive discovery constraint by construction. | A directory listing of the planned `.pi/prompts/` at execution time shows depth 1 only — no nested group folders. |
| REQ-004 | The `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table covers every argument-hint pattern actually present across the 36 commands, not a hypothetical subset. | Every one of the 36 commands' `argument-hint` lines maps to a stated pattern row in plan.md §3. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The frontmatter-key gap (`allowed-tools`, `skill`, `title`, `version` — no confirmed Pi analog) is documented with an explicit per-key disposition, not silently dropped without a decision recorded. | plan.md §3 (Architecture) lists a stated disposition (drop / fold into body text / defer to live verification) for each of the 4 keys. |
| REQ-006 | The 14-of-36 commands whose `allowed-tools` includes `Task` are enumerated by name, with the phase-006 (`pi-subagents`) functional dependency stated as an explicit, accepted sequencing gap rather than an implied end-to-end capability. | tasks.md lists all 14 file names against the phase-006 dependency note. |
| REQ-007 | A per-group worklist table (8 groups × member commands = 36 rows) exists mapping source path → flattened Pi filename → `/invocation` name → Task-dependency flag, usable directly by a future execution pass. | Worklist row count in plan.md §3 equals 36. |
| REQ-008 | Every claim resting on the pi.dev docs findings rather than confirmed live Pi behavior is explicitly marked UNCONFIRMED and routed to phase 001 or this phase's own future execution. | Grep for "UNCONFIRMED" across this phase's 4 docs returns hits covering each distinct open question in §7. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The naming/translation doctrine in plan.md is complete enough that a future execution pass could flatten all 36 commands mechanically without inventing new naming rules mid-execution.
- **SC-002**: Zero filename collisions across the 36 planned `.pi/prompts/*.md` entries, verified by the worklist.
- **SC-003**: Every one of the 36 commands carries a stated Task-tool dependency flag (yes/no) so the phase-006 sequencing risk is visible before any execution pass starts.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 005-pi-command-layer --strict` reports zero errors attributable to this phase's own docs. Verified 2026-07-27: `Errors: 2, Warnings: 1`, and all three are the expected, explicitly out-of-scope gaps this phase's Hard Constraints mandate — `FILE_EXISTS`/`LEVEL_MATCH` (missing `implementation-summary.md`, which this Planned-status phase is explicitly told not to author) and `GRAPH_METADATA_PRESENT` (missing `description.json`/`graph-metadata.json`, regenerated by a separate metadata backfill pass). No other rule fails.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 live Pi install | Every substitution-syntax claim (`$1`/`$2`/`$@`/`${1:-default}` exact semantics) stays unconfirmed until a real `pi` session runs | Mark every syntax claim UNCONFIRMED in this phase's docs; route live verification to phase 001 or this phase's own future execution |
| Dependency | Phase 006 `pi-subagents` (third-party) | 14/36 ported commands (Task-dependent) may register as `/name` prompts but stay functionally inert for subagent dispatch until phase 006 lands | Document the per-command Task-dependency explicitly in the worklist; never imply end-to-end functionality for those 14 at this phase's completion |
| Risk | Frontmatter feature loss (`allowed-tools`, `skill`, `title`, `version`) | Ported Pi prompts may run with broader effective tool access than Claude's per-command allowlist intended, and lose skill-routing/versioning metadata silently | REQ-005 mandates an explicit disposition per key; flag the tool-access widening as a named security-relevant risk, not a silent drop |
| Risk | `argument-hint` UI-hint text has no confirmed Pi frontmatter analog | Operators lose the autocomplete-style hint Claude Code shows in its command picker; a discoverability regression | Fold a short usage line into each ported prompt's body text as a documented mitigation, pending phase-1 confirmation that Pi has no better mechanism |
| Risk | `${1:-default}` cannot distinguish "arg omitted" from "arg equals the literal default value" | Any ported router logic that branches on presence-vs-value (not confirmed to exist today, but not exhaustively ruled out either) could silently misbehave once positional slots are used | Default to `$@` (whole-string passthrough) wherever a command's router logic parses its own flags, reserving `$1`/`${1:-default}` for the few single-required-token commands; flag as UNCONFIRMED pending live test |
| Dependency | Phase 003 `cli-pi/references/` directory existing | The planned persisted-doctrine file's exact path assumes phase 003's skill packet skeleton has landed first | Treated as an open question (§7); this phase's own spec/plan/tasks/checklist remain authoritative regardless of where a persisted copy eventually lives |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does Pi's prompt-template loader gracefully ignore unrecognized frontmatter keys (`allowed-tools`, `skill`, `title`, `version`), or does an unknown key cause a load error? UNCONFIRMED — route to phase 001.
- Does `${1:-default}` behave with exact bash semantics (unset-vs-empty-string distinction), and does Pi expose a "`$@` minus `$1`" remainder primitive for sub-action-then-flags patterns (e.g. `doctor-mcp`'s `<install|debug> [--server <name>]`)? UNCONFIRMED — route to phase 001 or this phase's own future execution.
- Where should the persisted flattening-map/translation-table doctrine live long-term: `cli-pi/references/` (phase 003's packet, if it has landed by execution time) or a repo-root `.pi/` doc? Deferred — this phase's own spec/plan artifacts are authoritative until decided.
- Should `goal-opencode.md`'s internal title mismatch (its body says "`# /goal`" while the file-path-derived convention used by every other command implies `/goal-opencode`) be preserved as-is in the Pi port, or reconciled? Recommendation: preserve as-is (`/goal-opencode`, matching the convention applied to every other command) — reconciling this pre-existing Claude-side inconsistency is out of this phase's scope.
- Do any of the 36 commands' router logic depend on distinguishing "flag present with no value" from "flag entirely absent" in a way that `$@` passthrough would break under Pi's literal substitution model? Not identified during this planning pass, but not exhaustively verified against every command's full body text — flag for a spot-check at execution time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../004-pi-skill-discovery-bridge/spec.md` (predecessor)
- `../006-pi-agent-bridge/spec.md` (successor)
- `../003-cli-pi-skill-packet/spec.md` (owns the `cli-pi/references/` directory this phase's persisted doctrine may eventually live in)
- `../../030-cli-cursor-creation/003-cli-cursor-skill-packet/spec.md` and `../../029-cli-devin-revival/003-cli-devin-skill-packet/spec.md` (tone/structure calibration only — neither precedent packet needed a command-flattening phase since Devin and Cursor have no native custom-slash-command format)
