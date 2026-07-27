---
title: "Feature Specification: Pi docs, agents, governance, and closeout"
description: "Add cli-pi mentions to every roster/governance/hub-doc surface where its 5 siblings (opencode, claude-code, codex, cursor, devin) already appear, using a fresh current-tree grep -- not a replayed touch-list -- then run the terminal validate.sh --recursive --strict closeout across the whole 031-cli-pi-creation packet."
trigger_phrases:
  - "cli-pi closeout"
  - "cli-pi governance docs"
  - "cli-pi agent roster"
  - "pi docs and closeout"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/011-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-27T16:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed at 11 phases; successor field updated post-hoc for the 012/013 extension"
    next_safe_action: "None -- this is the terminal phase; packet 031-cli-pi-creation is closed"
    blockers: []
    key_files: [".opencode/skills/cli-external-orchestration/README.md", "README.md", ".opencode/skills/README.md", ".opencode/agents/deep-improvement.md", ".claude/agents/deep-improvement.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["CONFIRMED rg: hub SKILL.md/registries were already 6-of-6 at implementation time; only hub README.md + 2 catalog rows were stale.", "RESOLVED: dispatch-model.cjs already has a real (throwing-until-confirmed) cli-pi case -- Lane B now names pi with that caveat.", "RESOLVED: devin backfill opportunistic across all 4 stale surfaces; devin already fully wired elsewhere in the hub.", "RESOLVED: hub README.md version left unbumped, matching the no-bump precedent set by cursor/devin additions."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi docs, agents, governance, and closeout

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
| **Status** | Complete - cli-pi (+ opportunistic cli-devin backfill) added to hub README.md, root README.md (x3 locations), and .opencode/skills/README.md; deep-improvement.md (both mirrors) gained an honestly-qualified pi Lane-B mention; leaf-manifest.json regenerated; whole-packet validate.sh --recursive --strict and parent-skill-check.cjs both clean; GLM-5.2 independently verified and APPROVEd |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Phase** | 11 of 13 (originally 11 of 11; the packet was extended post-hoc with `012`/`013` at operator request after this phase closed) |
| **Predecessor** | `../010-pi-manual-testing-playbook/spec.md` |
| **Successor** | `../012-pi-runtime-compatibility/spec.md` (added post-hoc; this phase's own scope stayed the original 11-phase governance closeout) |
| **Handoff Criteria** | **Entry (from 010)**: the playbook's scenario coverage is judged proportional to the sibling CLIs' playbooks (both in count and category breadth) -- reviewed, not re-litigated, at the start of this phase. **Exit (at the time this phase closed)**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/031-cli-pi-creation --recursive --strict` returned `Errors: 0` across the 11-phase packet -- this was the packet's terminal gate at that time; the parent packet's own final gate now covers all 13 phases after the post-hoc extension. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the CLI Pi creation specification.

**Scope Boundary**: Docs/roster/governance mentions plus the terminal whole-packet validation only. No install, no code, no registry edits (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, and the hub's own `SKILL.md` are phase `003-cli-pi-skill-packet`'s responsibility -- confirmed live to already correctly enumerate all 5 existing modes; this phase reads them as ground truth, never edits them).

**Dependencies**:
- Phases `001-pi-contract-pin` through `010-pi-manual-testing-playbook` land first -- this phase documents capabilities they build and cannot describe a system that does not yet exist.
- `validate.sh` and `parent-skill-check.cjs` (system-spec-kit / doctor tooling) stay available and unchanged for the closeout run.

**Deliverables**:
- A fresh `rg` touch-list of every roster/governance/hub-doc surface that currently enumerates the 5 sibling CLI executors, built against the live tree at implementation time (not this planning pass, since the tree can move before execution).
- A symmetric `cli-pi` mention added to each identified surface, in that surface's existing phrasing pattern.
- An explicit, recorded decision on the 3 pre-existing sibling-symmetry gaps discovered during this planning pass (see Open Questions) -- fixed opportunistically or left and documented, never silently picked either way.
- A read-only cross-check that the deep-loop executor tests assert `cli-pi`'s presence, not a stale union.
- The terminal `validate.sh --recursive --strict` run across the whole 11-phase `031-cli-pi-creation` packet plus `parent-skill-check.cjs` against the `cli-external-orchestration` hub.
- Reconciled completion metadata across all 11 phases.

**Changelog**:
- The scaffold instruction to refresh a changelog entry does not have a clean precedent to follow: the hub's own `changelog/` directory (`.opencode/skills/cli-external-orchestration/changelog/{v1.0.0.0,v1.1.0.0,v1.2.0.0}.md`) contains **zero** `cli-cursor` or `cli-devin` mentions -- neither the 029 (Devin) nor the 030 (Cursor) closeout phase added an entry there. This phase follows the same precedent (no changelog edit) unless the operator wants that gap corrected; flagged, not silently resolved, in Open Questions.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Adding pi as a 6th CLI mode is not complete until it appears wherever its 5 siblings (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`) already appear across agent rosters, governance docs, and hub-level catalogs. Because this is a first-time creation like `030-cli-cursor-creation`, not a revival like `029-cli-devin-revival`, there is no archived deletion diff to reverse -- the touch-list must be built by grepping the *current* tree. That current tree is itself already **inconsistent**: a live grep sweep run during this planning pass found the hub's `SKILL.md` correctly enumerates all 5 modes (version 1.2.0.0), but the hub's own `README.md` still says "four workflow modes" at version 1.1.0.0 with zero `cli-devin` hits; the root `README.md` CROSS-AI CLI section lists 4 of 5 (no devin); the root skills-catalog table row and `.opencode/skills/README.md`'s catalog row are further stale still, both listing only 2 of 5 (`cli-opencode` + `cli-claude-code`); and the only agent-roster prose that enumerates dispatch executors (`deep-improvement.md`'s Lane B paragraph) says bare "cursor" (not `cli-cursor`) and omits devin entirely. A mechanical "add pi to the 5-sibling pattern" instruction cannot be applied blindly when no single surface actually shows a clean 5-of-5 baseline to mirror.

### Purpose
Add `cli-pi`/pi to every roster/governance/hub-doc surface where a majority of its siblings are already enumerated -- grounded in a fresh grep of the live tree at implementation time, not this planning pass's snapshot -- explicitly record (never silently resolve) the pre-existing sibling-symmetry gaps discovered along the way, and run the terminal `validate.sh --recursive --strict` across the whole 11-phase `031-cli-pi-creation` packet, proving all 11 phases compose into one coherent, closed-out addition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-run (at implementation time, not from this planning pass alone) `rg -l 'cli-opencode|cli-claude-code|cli-codex|cli-cursor|cli-devin'` over `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, root `README.md`, root `AGENTS.md`/`CLAUDE.md`, `.opencode/skills/README.md`, and the hub's own `README.md`, to confirm the live touch-list before editing.
- Add a symmetric `cli-pi`/pi mention to each identified surface, matching that surface's existing phrasing pattern (bold name, "Use it for", dispatch mechanism, availability-gating note -- mirroring the `cli-cursor`/`cli-devin` bullet shape where those already exist).
- Add `pi` to the `deep-improvement.md` Lane-B lane-awareness paragraph (`.opencode/agents/` + `.claude/` mirror) **only if** phase 002/009 actually wires `cli-pi` into `dispatch-model.cjs`'s `KNOWN_EXECUTORS` set -- cross-check against those phases' `implementation-summary.md` before editing, since that set is confirmed live to be `{cli-opencode, cli-claude-code, cli-cursor}` today (missing `cli-codex` AND `cli-devin`, not just pi).
- Cross-check (read-only, no primary edit) that `executor-config.vitest.ts` and `executor-audit.vitest.ts` assert `cli-pi`'s presence as a typed `ExecutorKind` member, not a stale union that excludes it -- confirming phase 002's work, not re-authoring it.
- Record an explicit decision on whether this phase also backfills the pre-existing `cli-devin` gaps discovered in the hub's own `README.md`, the root `README.md` CROSS-AI section, and `.opencode/skills/README.md`'s catalog row while those files are already open for the pi edit (see Open Questions) -- not a silent default either way.
- Reconcile completion metadata across all 11 phases so no phase doc claims a conflicting completion state.
- Run the terminal closeout: `validate.sh --recursive --strict` on the whole `031-cli-pi-creation` packet, plus `parent-skill-check.cjs` against the `cli-external-orchestration` hub.

### Out of Scope
- Any packet/registry/executor-runtime work -- `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, and the hub's own `SKILL.md` are phase `003-cli-pi-skill-packet`'s responsibility. Confirmed live: `SKILL.md` already correctly lists pi's 4 siblings at "five workflow modes" (it will need its own 6-mode edit, but that edit belongs to 003, not here).
- Adding `'pi'` to `ADVISOR_RUNTIME_VALUES` (`system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts`) -- confirmed live as `['claude', 'copilot', 'opencode']` with no `cursor`/`devin` precedent either (the D5 IDE-runtime-hooks exclusion from 029). Pi is a terminal CLI agent, not an IDE-editor runtime with its own hook surface comparable to Cursor/Copilot, so it stays excluded on the same reasoning.
- Reintroducing a prescriptive default executor into `system-spec-kit/constitutional/post-implementation-deep-review.md` -- confirmed live to remain executor-agnostic per the 029 D4 decision; this phase does not touch it.
- Backfilling the `cli-codex`/`cli-devin` gap in `dispatch-model.cjs`'s `KNOWN_EXECUTORS` set -- that is model-benchmark dispatcher code, owned by phase 002/009, not this docs phase, even though it is a real, confirmed pre-existing gap.
- Any install, `pi`, `npm`, or other mutating command -- this is a planning-only phase; every live-behavior claim about pi stays attributed to phase 001 (or its own designated live-verification phase), never asserted here as already confirmed.
- Fabricating a pi changelog/version-history narrative anywhere in the closeout docs.
- Rewriting any archived (`z_archive/**`) content or historical spec/changelog prose from unrelated packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/README.md` | Modify | Add `cli-pi` to: frontmatter `description`/`trigger_phrases`/`version`, the "N workflow modes" tagline, AT A GLANCE table, OVERVIEW bullet list + routing-policy sentence, QUICK START example. Confirmed live: still says "four workflow modes" / v1.1.0.0 / zero `cli-devin` hits -- pi's addition should land alongside whatever devin-backfill decision this phase records (see Open Questions), not silently assume a stale baseline count. |
| Root `README.md` | Modify | Add `cli-pi` to the CROSS-AI CLI section (confirmed live at ~L919-926: hub summary sentence + a new `cli-pi` bullet, mirroring the `cli-cursor`/`cli-codex` bullet shape) and the `prompt-models` sentence (~L957) if pi ships its own prompt-craft profile. Also update the stale skills-catalog table row (~L1287), confirmed live to still read "routes to `cli-opencode` and `cli-claude-code`" (2 of 5) -- fixing this row to at least reflect the pi addition is in scope; whether it also gets fully backfilled to 6-of-6 is part of the same Open Question as the hub README. |
| `.opencode/skills/README.md` | Modify | Update the `cli-external-orchestration` catalog row (confirmed live at L49: "routes to `cli-opencode`... and `cli-claude-code`", 2 of 5) to include `cli-pi`. |
| `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md` | Modify (conditional) | Add `pi`/`cli-pi` to the Lane B lane-awareness paragraph's dispatch-executor list, only if phase 002/009 confirms `dispatch-model.cjs` actually gained a `cli-pi` case. |
| `AGENTS.md`, `CLAUDE.md` (repo root) | No change (confirmed pattern) | Confirmed live: zero per-CLI mentions for any of the 5 existing siblings, only the generic `cli-X` placeholder pattern (lines ~62, ~151) which already covers pi implicitly. Matches the 030 precedent's "stays executor-agnostic" finding; re-confirm at implementation time in case this has changed. |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `executor-audit.vitest.ts` | Verify only (no primary edit) | Confirm neither test asserts a stale executor union that excludes `cli-pi`; primary widening is phase 002's responsibility. |
| `system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts`, its parity test | No change (regression guard) | Stays `['claude', 'copilot', 'opencode']` -- explicit scope exclusion, confirmed live. |
| `system-spec-kit/constitutional/post-implementation-deep-review.md` | No change (regression guard) | Stays executor-agnostic per the 029 D4 decision, confirmed live. |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` (`KNOWN_EXECUTORS`) | Verify only, cross-reference | Confirmed live to be `{cli-opencode, cli-claude-code, cli-cursor}` -- 3 members, missing `cli-codex` and `cli-devin` too. This phase records the gap; fixing it (if in scope at all) belongs to phase 002/009. |
| Whole packet `031-cli-pi-creation` (parent + all 11 phase children) | Validate | `validate.sh --recursive --strict` must return `Errors: 0`. |
| `cli-external-orchestration` hub | Validate | `parent-skill-check.cjs` must exit 0 with all hard invariants passed. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The touch-list is built by grepping the CURRENT tree at implementation time, not by replaying this planning pass's snapshot or a template list. | `rg -l 'cli-opencode\|cli-claude-code\|cli-codex\|cli-cursor\|cli-devin'` is re-run immediately before editing; any surface found here that has since changed is re-verified, not assumed. |
| REQ-002 | Every identified surface gains a symmetric `cli-pi`/pi entry, matching that surface's existing phrasing pattern. | `rg -n "cli-pi\|pi\.dev"` (scoped per file) shows the new entry in each Files-to-Change target; the entry's structure (bold name / "Use it for" / dispatch mechanism / gating note) matches its neighbors, not a bespoke format. |
| REQ-003 | The pre-existing `cli-devin` symmetry gaps (hub `README.md`, root `README.md` CROSS-AI + catalog table, `.opencode/skills/README.md`) are resolved by an explicit, recorded decision -- backfilled or left -- not silently picked either way. | `plan.md`/`tasks.md`/`checklist.md` cite the specific decision and its rationale; `git diff` on those 3 files matches the recorded decision exactly (no partial or accidental backfill). |
| REQ-004 | `executor-config.vitest.ts` and `executor-audit.vitest.ts` are cross-checked (read-only) to assert `cli-pi`'s presence, not a stale executor union. | Manual review of both test files confirms no assertion of a pre-pi member count or `cli-pi`'s absence; this is a final check on phase 002's work, not new test authorship. |
| REQ-005 | `validate.sh --recursive --strict` on the whole `031-cli-pi-creation` packet returns `Errors: 0`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/031-cli-pi-creation --recursive --strict` exits with `Errors: 0` across the phase-parent and all 11 phase children. |
| REQ-006 | `parent-skill-check.cjs` against the `cli-external-orchestration` hub exits 0. | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` reports all hard invariants passed. |
| REQ-007 | The 2 explicit regression-guard surfaces (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`) stay untouched. | `git diff` on `advisor-runtime-values.ts`, `runtime-parity.vitest.ts`, and `post-implementation-deep-review.md` is empty. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `deep-improvement.md`'s Lane-B paragraph only claims `pi` as a benchmarkable model-dispatch executor if `dispatch-model.cjs` actually supports a `cli-pi` case by the time this phase runs. | Cross-check against phase 002/009's `implementation-summary.md` and `dispatch-model.cjs`'s live `KNOWN_EXECUTORS`/switch statement before editing; if unsupported, the paragraph is left unedited (or edited only to the extent its existing wording already needs a fix unrelated to pi). |
| REQ-009 | Completion metadata across all 11 phases is reconciled -- no phase doc claims a conflicting completion state. | `grep "Status" .opencode/specs/cli-external-orchestration/031-cli-pi-creation/*/spec.md` shows a status per phase that matches each phase's actual `implementation-summary.md` presence (or explicit absence for genuinely deferred phases). |
| REQ-010 | No fabricated pi changelog/version-history narrative is introduced in any closeout doc. | `grep -in "changelog\|version history"` across every file this phase edits returns no fabricated pi-specific narrative (existing, accurate hub changelog references are fine; inventing pi release history is not). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A grep for the sibling executor names across the Files-to-Change surfaces shows `cli-pi`/pi present wherever a majority of its siblings already are, per REQ-002.
- **SC-002**: The 3 pre-existing sibling-symmetry gaps (hub `README.md`, root `README.md`, `.opencode/skills/README.md`) each show a recorded, deliberate resolution, per REQ-003.
- **SC-003**: `validate.sh --recursive --strict` on the whole packet returns `Errors: 0`, and `parent-skill-check.cjs` against the hub exits 0.
- **SC-004**: Zero regressions to the 2 explicit non-restoration surfaces (`ADVISOR_RUNTIME_VALUES`, `post-implementation-deep-review.md`), verified by empty `git diff` on both.
- **SC-005**: `deep-improvement.md`'s Lane-B claims about pi's benchmark-dispatch support match the live `dispatch-model.cjs` state, not an assumption.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-010 land first | Documenting docs/rosters before the capabilities exist would describe a system that isn't there yet | Sequence this phase last; confirm each predecessor's `implementation-summary.md` before editing |
| Risk | Treating "wherever siblings appear" as a clean 5-of-5 baseline | The current tree already shows 4 different symmetry levels across surfaces (5/5 in SKILL.md, 4/5 in hub README + root README CROSS-AI section, 2/5 in the 2 catalog rows) -- copying the wrong baseline count would either under- or over-claim what pi's addition brings the total to | REQ-002 scopes each edit to that specific surface's live state, not a repo-wide assumed count; REQ-003 makes the devin-backfill decision explicit per surface |
| Risk | Silently reverting the 2 regression guards (`ADVISOR_RUNTIME_VALUES`, executor-agnostic review doc) | Re-couples the excluded IDE-hooks surface or reintroduces a prescriptive executor, both against explicit prior operator scope decisions | REQ-007 + explicit checklist items requiring an empty diff on both |
| Risk | Claiming pi is benchmarkable via `dispatch-model.cjs` when it isn't | `KNOWN_EXECUTORS` is confirmed live to be only 3 members today (missing codex AND devin, not just pi) -- asserting pi's inclusion without cross-checking phase 002/009's actual delivery would fabricate a capability | REQ-008 gates the `deep-improvement.md` edit on a live cross-check, not an assumption from the master plan's "6th member" framing |
| Risk | Stale touch-list at execution time | The tree can move between this planning pass and implementation (concurrent sessions may edit these same governance docs) | REQ-001 mandates a fresh grep immediately before editing, not a replay of this spec's snapshot |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All resolved at implementation time; kept here (not deleted) so the resolution reasoning stays attached to the original question.

- **Devin backfill scope -- RESOLVED: opportunistic backfill.** At implementation time, the hub's own `SKILL.md`, `mode-registry.json`, and `hub-router.json` were confirmed live to be ALREADY fully 6-of-6 (cli-devin included, full field parity) -- only the hub's own `README.md` and the 2 catalog rows (root `README.md`, `.opencode/skills/README.md`) were stale. Since devin already exists and is fully wired elsewhere in the very same hub, adding it to these 3 already-open surfaces alongside pi is a pure documentation-accuracy fix, not a new capability claim or a blast-radius expansion. Applied consistently across all 4 identified stale surfaces (hub README.md, root README.md CROSS-AI + catalog row, skills README.md catalog row).
- **Model-benchmark dispatch coverage -- RESOLVED: yes, pi is a real (if currently stubbed) `dispatch-model.cjs` case.** Live read of `dispatch-model.cjs` confirmed `KNOWN_EXECUTORS` already contains `cli-pi` and `buildSpawnSpec` has a real `case 'cli-pi':` (added by phase 009) that validates against the model allowlist then unconditionally throws until Pi's headless invocation contract is confirmed. `deep-improvement.md`'s Lane-B paragraph (both `.opencode/agents/` and `.claude/agents/` copies) now names `pi` in the benchmarkable-executor list with the honest parenthetical "(currently stubbed pending confirmation of Pi's headless invocation syntax)" -- GLM-5.2's independent review confirmed this phrasing is neither an overclaim nor a silent omission. The pre-existing, separately-tracked `codex`/`devin` gaps in that same `dispatch-model.cjs` (no real case for either) were left untouched, per this phase's own out-of-scope boundary.
- **Hub README.md version bump -- RESOLVED: no bump.** Cross-referencing the hub's own changelog precedent: neither the `cli-cursor` nor `cli-devin` addition bumped this file's `version:` field when they were added to the hub's registry. This phase follows the same precedent -- the field stays at `1.1.0.0`.
- **Model-count wording -- RESOLVED: verified per-surface, not a repo-wide find-replace.** Every "four"/"N workflow modes" occurrence was checked in place before editing. In the hub's own `README.md`, all 4 mode-count mentions moved from four to six. In the root `README.md`, only the one in-scope occurrence ("Uniquely among the four" -> "the six", describing `cli-cursor`'s shared editor config) was touched; GLM-5.2 independently confirmed the other 5 unrelated "four" mentions elsewhere in that file (four layers, four outcomes, four phases, four loop families, four advisor tools) were correctly left untouched.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../010-pi-manual-testing-playbook/spec.md` (predecessor)
- `../spec.md` (phase-parent packet)
- `../003-cli-pi-skill-packet/spec.md` (owns the hub-level registry/SKILL.md edits this phase reads as ground truth but never modifies)
- `../002-deep-loop-executor-support/spec.md`, `../009-pi-model-registry-and-routing/spec.md` (own the `executor-config.ts`/`dispatch-model.cjs` widening this phase cross-checks, read-only)
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/spec.md` (revival-shaped closeout precedent; note its Files-to-Change table did NOT include the hub's own `README.md`, which is why `cli-devin` is missing from that file today)
- `../../030-cli-cursor-creation/007-docs-agents-governance-and-closeout/spec.md` (first-time-creation-shaped closeout precedent; its Files-to-Change table DID include the hub's own `README.md`, the broader scope this phase's Files-to-Change table follows)
