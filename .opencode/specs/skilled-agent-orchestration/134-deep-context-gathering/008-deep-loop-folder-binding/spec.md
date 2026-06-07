---
title: "Feature Specification: Fix deep-loop spec-folder binding: extract a named spec-folder path from the positional scope and add a fail-closed standalone guard across the /deep:* command family [template:level_2/spec.md]"
description: "The /deep:* setup contract never binds a spec folder named inline in the positional scope, and deep-context lets the standalone fallback win even when a folder is identifiable — so a context run pointed at a folder misroutes to a standalone dir."
trigger_phrases:
  - "deep loop folder binding"
  - "spec folder extraction"
  - "standalone guard"
  - "auto mode contract scope"
  - "deep context misroute"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/008-deep-loop-folder-binding"
    last_updated_at: "2026-06-07T10:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fix applied + verified (dry-run + validate green)"
    next_safe_action: "Commit via sk-git when ready"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md"
      - ".opencode/commands/deep/start-context-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-fix-008-deep-loop-folder-binding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fix scope = whole /deep:* family (shared contract + 3 commands)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix deep-loop spec-folder binding: extract a named spec-folder path from the positional scope and add a fail-closed standalone guard across the /deep:* command family

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `008-deep-loop-folder-binding` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared `:auto`/`:confirm` setup contract (`auto_mode_contract.md`) resolves `spec_folder` only from a `--spec-folder` flag, a `PRE-BOUND` marker, or an interactive choice — it never extracts a spec-folder path the user names **inline in the positional scope**. So an inline-named folder is invisible to setup and is treated as ambiguity/absence. `deep-context` compounds this: it offers a standalone-run-dir fallback (Q1 option E + a permissive preflight + the `resolveArtifactRoot` standalone branch) with **no guard** verifying a real folder wasn't identifiable. Net effect: `/deep:start-context-loop "gather context on <…/026 path>"` wrote its packet to a standalone `deep-context-runs/` dir instead of `026/context/`.

### Purpose
A spec folder named inline in the scope is auto-bound at Tier 1 and the packet lands in `{spec_folder}/<loop>/`; standalone is selected only when no folder is named or derivable — fail-closed across the `/deep:*` family.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new Tier-1 resolution source (positional-scope spec-folder extraction) + a fail-closed standalone/fallback guard in the shared `auto_mode_contract.md`.
- deep-context command/skill/YAML edits that consume the new source and guard the standalone option.
- deep-research + deep-review parity (cite the shared source in their `spec_folder` rows).

### Out of Scope
- Changing `resolveArtifactRoot` logic - it already maps a real folder → `{folder}/context/`; it only trusts its input.
- Editing the `@deep-context` agent - it is a read-only analyzer and never chooses output location (ruled out as the defect).
- A runtime/executable extraction helper + fixture test - flagged as optional hardening, not required for this fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md` | Modify | §1 add scope-extract Tier-1 source + fail-closed fallback guard; §3 legend |
| `.opencode/commands/deep/start-context-loop.md` | Modify | spec_folder row + §0 bind-from-scope + Q1 option E guard |
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Modify | preflight `spec_folder_is_within` fail-closed |
| `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` | Modify | preflight `spec_folder_is_within` fail-closed |
| `.opencode/skills/deep-context/SKILL.md` | Modify | explicit host guard line |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | Modify | explicit host guard line |
| `.opencode/commands/deep/start-research-loop.md` | Modify | spec_folder row cites scope-extract (parity) |
| `.opencode/commands/deep/start-review-loop.md` | Modify | spec_folder row cites scope-extract (parity) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `auto_mode_contract.md` §1 adds a Tier-1 "positional-scope spec-folder extraction" source: a path in the scope that canonicalizes to an existing spec folder binds the field and is stripped from scope. | **Given** a scope naming an existing folder, **When** §1 Tier-1 runs, **Then** `spec_folder` resolves confidently (no Tier-2/Tier-3). |
| REQ-002 | `auto_mode_contract.md` adds a fail-closed standalone/fallback guard: standalone is valid only when no folder is named/derivable. | **Given** a folder was identified, **When** a standalone target is bound, **Then** preflight fails closed. |
| REQ-003 | `start-context-loop.md` §0 binds `spec_folder` from a scope-named folder before asking and skips Q1; Q1 option E is offered only when no folder is identifiable. | **Given** the original failing input, **When** §0 runs, **Then** output routes to `026/context/` and E is suppressed. |
| REQ-004 | deep-context `_auto.yaml` + `_confirm.yaml` `step_preflight_contract.spec_folder_is_within` fails closed on standalone-while-identifiable. | **Given** a standalone bind + identifiable folder, **When** preflight runs, **Then** STATUS=FAIL. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | deep-context `SKILL.md` + `loop_protocol.md` state the host guard explicitly (named/derivable folder ⇒ `{spec_folder}/context/`). | Both files contain the fail-closed guard sentence citing the contract. |
| REQ-006 | deep-research + deep-review `spec_folder` rows cite the shared scope-extract source (parity). | **Given** a named folder in their scope/target, **When** Tier-1 runs, **Then** it binds (no standalone — their preflights already exclude it). |
| REQ-007 | This fix makes NO edit to the `@deep-context` agent; it is documented as ruled out (read-only analyzer). | No edit to `deep-context.md` originates here. (It shows modified in the working tree from an unrelated concurrent `/deep:*` refactor — pool-default native-only — not this packet.) |
| REQ-008 | A dry-run of the original failure against the patched contract routes correctly for `:auto` and `:confirm`. | **Given** `"gather context on <026 path>"`, **When** walked through patched §0, **Then** no fail-fast, no standalone. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `/deep:*` run whose scope names an existing spec folder writes its packet under `{that-folder}/<loop>/`, never a standalone dir.
- **SC-002**: When no folder is named or derivable, standalone still works (no regression) and the report is handed to `/speckit:plan`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared `auto_mode_contract.md` (cited by ~12 commands) | A wording error could affect non-`/deep:*` commands | Change is additive (new source + guard); existing sources/semantics unchanged |
| Risk | Prompt-contract artifacts are AI-interpreted, not executable | Guard relies on the runtime AI honoring prose | Phrase as MUST/fail-closed; optional runtime helper noted as hardening |
| Risk | Over-tight extraction binds a wrong folder | Med | Bind only on canonicalized match to an EXISTING discovered folder; flag still wins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Extraction reuses the existing `find specs .opencode/specs` discovery step — no added latency beyond one string match.
- **NFR-P02**: No new process spawns in the setup path.

### Security
- **NFR-S01**: Extraction binds only to paths under `specs/`|`.opencode/specs/` (canonicalized) — no arbitrary filesystem write target.
- **NFR-S02**: The fail-closed guard prevents silently writing packet state outside the intended spec tree.

### Reliability
- **NFR-R01**: Fail-closed default — when in doubt the preflight halts rather than misrouting.
- **NFR-R02**: No behavior change when `--spec-folder` flag or marker is supplied (they still win).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty scope: no path to extract → existing Tier-2/Tier-3 path unchanged.
- Maximum length: long scope with a path token → match the token, strip it, keep the rest as scope.
- Invalid format: a path that does NOT resolve to an existing spec folder → not bound; treated as plain scope text.

### Error Scenarios
- Named folder does not exist: no bind; standalone allowed only if nothing else resolves.
- Two folder paths in scope: bind the first canonicalized existing match; note the ambiguity if both exist.
- `specs/` symlink vs `.opencode/specs/` canonical: canonicalize before matching so either form binds the same inode.

### State Transitions
- Partial completion: preflight halts (fail-closed) before any packet write if standalone-while-identifiable.
- Resume: an already-bound `spec_folder` in config is authoritative; extraction is a setup-time step only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 8 files, ~40 lines, prose/YAML contract edits |
| Risk | 12/25 | Shared contract (12 commands) but additive; no breaking change |
| Research | 6/20 | Root cause already located (two Explore passes + source confirmation) |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the extraction be enforced by a deterministic runtime helper (+fixture test) rather than prose alone? (Flagged as optional hardening.)
- Should the shared guard also be back-cited from the non-`/deep:*` commands that use the contract, or left to the deep family only? (Out of scope here.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
