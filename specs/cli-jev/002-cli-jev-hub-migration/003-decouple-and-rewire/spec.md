---
title: "Feature Specification: Phase 3: decouple-and-rewire"
description: "Two hubs still named one packet and the dispatch chain still read the retired path, so every jev dispatch resolved a nonexistent SKILL.md and all eight hard rules failed open at preflight. This phase removes the old registration, points the audit row, both hook suites, the rosters and the generated surfaces at cli-jev/cli-usage, and re-derives the artifacts those edits invalidated."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "cli-jev decoupling"
  - "dispatch packetPath"
  - "roster rewiring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/003-decouple-and-rewire"
    last_updated_at: "2026-09-20T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase specification authored at closeout from the landed decoupling and rewiring"
    next_safe_action: "Run phase 004: onboard the hub to the compiled-routing fleet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-003-decouple-and-rewire"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: decouple-and-rewire

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-hub-scaffold-and-mode-migration |
| **Successor** | 004-compiled-fleet-onboarding |
| **Handoff Criteria** | The old hub carries no `cli-jev` registration or transport trace and still reports fresh, the dispatch chain, both hook suites and every runtime's roster resolve the packet at `cli-jev/cli-usage`, and the generated surfaces are re-derived, so phase 004 can onboard the hub without inheriting a stale path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-jev hub migration program (packet `cli-jev/002-cli-jev-hub-migration`).

**Scope Boundary**: The wiring that still pointed at the retired location. Phase 002 created the hub and moved the packet; phase 004 onboards the compiled fleet; phase 005 re-runs the playbook from the new home. This phase decouples the old hub, moves the dispatch identity, rewires the rosters and re-derives the generated surfaces the edits invalidate. It changes no judgment behavior and no hard rule.

**Dependencies**:
- Phase 002, because the packet has to answer from `.skilled/skills/cli-jev/cli-usage/` before the old registration can be deleted.
- The sanctioned regeneration paths for each generated surface (`generate-trigger-index.mjs`, `frontmatter-version.mjs compute`, `test_readme_manifest.py --write`, the folder-discovery upsert, the compiled-route remint).

**Deliverables**:
- The old hub back to seven workflow modes: registry row, `transport-axis` extension, router signal and vocabulary classes, `tieBreak` entry, leaf manifest, description and graph keywords, prose traces, plus the `v1.7.0.0` Removed changelog entry.
- The dispatch chain at its new home: the audit row's `packetPath`, both hook suites' scan roots, and a live preflight refusal that proves the eight rules are enforced again.
- Rosters and generated surfaces: `skills/README.txt`, both agent rosters plus their runtime mirrors, the CLI prompt-quality card, the trigger index and its fixtures, the frontmatter-version manifests, the sk-doc durable-directory fixture and the `specs/descriptions.json` rows for the new track.
- The hub's release line reset to `0.1.0.0` by operator direction, with its changelog renamed to match.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 002 two registries named one packet and the enforcement chain still read the retired path: `dispatch-audit.mjs` resolved the packet `SKILL.md` under `cli-external-orchestration/cli-jev/`, a directory that no longer exists, so `readHardRules` failed open and zero of the eight jev hard rules were enforced at preflight while the packet-bijection test stayed red. The rosters still described the transport as a mode of the old hub, and the generated surfaces still held 16 path rows in the trigger index, 41 in the corpus manifest, 25 in the diagnostics, and 70 in the frontmatter-version manifest.

### Purpose
Leave the repository with one home for the transport and no stale path to it: the old hub, the dispatch chain, the rosters and every generated surface name `cli-jev/cli-usage`, and a live preflight refusal shows the packet's own rules are enforced again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The old hub's decoupling: mode row, `transport-axis` extension, router signal and its two vocabulary classes, `tieBreak`, leaf manifest, description and graph keywords, `SKILL.md` and `README.md` prose, plus a `v1.7.0.0` Removed entry
- The dispatch chain: the audit row's `packetPath`, the two hook suites (scan roots, the packet-path assertion and one example command string), and a live preflight run as the enforcement proof
- The rosters: `skills/README.txt`, `agents/orchestrate.md` (Rule 7, the anti-pattern table, related resources), `agents/prompt-improver.md`, their `.claude` twins, the generated `.pi` and `.codex` trees, and the sk-prompt CLI prompt-quality card
- The hub's release line: `0.1.0.0` across `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json`, and the changelog file renamed to `v0.1.0.0.md`
- The generated surfaces: the trigger index plus corpus manifest, diagnostics and phrase variants; the two frontmatter-version manifests; the sk-doc durable-directory fixture; the `specs/descriptions.json` rows for the new track
- Reconciliation of the phase-002 docs that cite the hub changelog by name, and a re-mint of the old hub's compiled manifest after its prose fix

### Out of Scope
- Compiled-fleet onboarding — phase 004; until then the hub reports `{"servingAuthority":"legacy","hubId":"cli-jev"}`
- Re-running the playbook from the new home — phase 005
- Any change to the judgment contract, the eight hard rules, the `JEV-` scenario ids or the recorded verdicts
- The parallel writer's review workspace under `specs/cli-orca/002-consolidate-official-orca-skills/review/`, including its quarantined snapshots of this repository
- The sk-doc hub's `stale-manifest` guard, which tracks that writer's uncommitted `sk-create-readme` edit, and the `.hermes/skills` mirror drift recorded as an operator item in phase 002
- The Pi preflight suite's pre-existing `cli-devin` advisory mismatch, verified present at HEAD and unrelated to this migration

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | Modify | Mode row and the `transport-axis` extension removed; the discriminator prose records where the axis went |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | Modify | The `cli-jev` signal, its two vocabulary classes and its `tieBreak` entry removed |
| `.skilled/skills/cli-external-orchestration/SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`, `ROUTER.md` | Modify | Mode table, prose, keywords and leaf set back to the seven workflow modes |
| `.skilled/skills/cli-external-orchestration/changelog/v1.7.0.0.md` | Create | Removed/Changed/Not Changed entry for the decoupling |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | The jev row's `packetPath` becomes `cli-jev/cli-usage` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs` | Modify | Packet-path assertion, the second scan root for the moved packet, and one example command string |
| `.skilled/skills/README.txt` | Modify | The `cli-jev` hub row and the corrected identity counts |
| `.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md` | Modify | Rule 7's transport paragraph, the anti-pattern row and the related-resource list |
| `.skilled/agents/prompt-improver.md`, `.claude/agents/prompt-improver.md` | Modify | The transport sentence names `cli-usage` |
| `.pi/agents/orchestrate.md`, `.pi/agents/prompt-improver.md`, `.codex/agents/*.toml` | Modify | Regenerated from the canonical `.skilled` trees by the two sync scripts |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | Persona row for the transport names `cli-usage` |
| `.skilled/skills/cli-jev/SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `README.md` | Modify | Version `0.1.0.0` and the renamed changelog link |
| `.skilled/skills/cli-jev/changelog/v0.1.0.0.md` | Rename | `git mv` from `v1.0.0.0.md`, title follows the release line |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `cli/retrieval/fixtures/*` | Modify | Regenerated by `generate-trigger-index.mjs` |
| `frontmatter-version-manifest.json`, `frontmatter-version-manifest.csv` | Modify | Regenerated by `frontmatter-version.mjs compute` |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Refreshed by `test_readme_manifest.py --write` |
| `specs/descriptions.json` | Modify | Twelve `cli-jev/…` rows inserted through the folder-discovery upsert |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | Re-minted after the old hub's prose fix, copied to its authored twin |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | Authored copy of the re-minted manifest |
| `specs/cli-jev/002-cli-jev-hub-migration/002-hub-scaffold-and-mode-migration/spec.md`, `implementation-summary.md` | Modify | Changelog path reference follows the rename |
| `specs/cli-jev/001-cli-jev-creation/spec.md` | Modify | The continuity `key_files` entry follows the moved packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The old hub carries no registration or trace of the transport | `parent-skill-check.cjs .skilled/skills/cli-external-orchestration` exits 0 with 41 `PASS` lines and no `FAIL`, its registry declares seven modes and no extension, its router has no `cli-jev` signal, vocabulary class or `tieBreak` entry, and `changelog/v1.7.0.0.md` records what was removed |
| REQ-002 | The dispatch chain resolves the packet at its new home | The audit row declares `packetPath: 'cli-jev/cli-usage'`, the shape-to-`SKILL.md` existence assertion passes, and a live Pi/Claude preflight of `jev run @request.json --value` is refused with the packet's own `jev-value-not-with-run` text instead of failing open |
| REQ-003 | Both hook suites are green | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` reports 20 pass / 0 fail, and `npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` reports 75 passing tests in one file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every roster names the new identity and every runtime mirror agrees | `skills/README.txt` lists the `cli-jev` hub row with counts of 15 identities and `cli-*` (3); both agent rosters name `cli-usage` as the transport; `check-agent-mirror-sync.cjs --all`, `sync-agents-pi.cjs --check`, `sync-agents.cjs --check` and `agent-roster-mirror-check.cjs` all exit 0 |
| REQ-005 | The generated surfaces are re-derived with no stale path | Zero old-hub packet paths in the trigger index, corpus manifest, diagnostics, frontmatter-version manifests and durable-directory fixture; each regeneration is deterministic or reproducible, and the description cache holds the new track's rows |
| REQ-006 | The hub's release line is `0.1.0.0` by operator direction | All five hub artifacts carry `0.1.0.0`, the changelog directory holds `v0.1.0.0.md` as its newest entry, and the doctor reports `13a-version` and `13b-version` passing at that value |
| REQ-007 | The old hub still serves a fresh compiled policy | `node .skilled/bin/compiled-route-guard.cjs` reports `cli-external-orchestration  fresh`, and `compiled-route.cjs --hub cli-external-orchestration` resolves a codex prompt to `cli-codex` |

### P2 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Phase 002's docs stay truthful after the rename | The two phase-002 documents that cite the hub changelog name `changelog/v0.1.0.0.md`, and the program packet validates recursively at zero errors and zero warnings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs` exits 0 on both hubs — 41 `PASS` lines for `cli-external-orchestration`, 42 for `cli-jev` — with no `FAIL` line and `0 warnings`.
- **SC-002**: A live preflight of `jev run @request.json --value` returns `permissionDecision: deny` with `[jev-value-not-with-run]`, replacing the phase-002 record of the same command being approved while the rules failed open.
- **SC-003**: The packet-bijection test's red is gone: `dispatch-rule-checks.test.mjs` reports 20 pass / 0 fail, and `dispatch-audit.test.mjs` passes all 75 tests including the shape-to-`SKILL.md` existence assertion.
- **SC-004**: A census over the live trees (excluding the parallel writer's review workspace, recorded history and `z_archive`) returns no path that resolves as if the packet still lived under the old hub.
- **SC-005**: `validate.sh --strict --recursive` returns `RESULT: PASSED` for both the program packet and the migrated packet, and `compiled-route.cjs --hub cli-jev` still answers `{"servingAuthority":"legacy","hubId":"cli-jev"}`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The decoupling half was executed by a parallel writer in the same tree | This phase's plan described it as pending while commit `e66dccd6a2` had already landed it | Re-read every target immediately before editing, attribute the landed half to that writer in the phase docs, and never revert their work |
| Risk | A whole-tree regeneration absorbs unrelated drift | The agent-mirror generators and the trigger-index walk cover more than this change | Measured each regeneration's delta before accepting it: the `.pi` tree reported 2 of 12 stale files before the edit and wrote 2 of 12 after it, and the index re-derivation was re-run to prove byte-identical output |
| Risk | Old-hub doc edits invalidate its compiled policy | A hub whose routing inputs move must be re-minted or the guard reports it stale | Ran the sanctioned `compiled-route-manifest.cjs refresh` for the hub and copied the runtime manifest to its authored twin, then re-ran the guard |
| Risk | Two hook suites need different runners | `dispatch-rule-checks.test.mjs` is a `node:test` file while `dispatch-audit.test.mjs` is a vitest file | Ran each under its own runner, and scoped the vitest filter so a quarantined snapshot of the same file under the parallel writer's review workspace could not be collected |
| Risk | The `.hermes` skills mirror is generated by a whole-tree walker | Refreshing it would absorb five unrelated stale skills and delete one orphan | Left unrefreshed, as phase 002 already recorded, and re-stated in this phase's limitations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The one question this phase raised in flight — the hub's release line — was answered by operator direction: the new hub starts its own line at `0.1.0.0` rather than continuing the transport's `1.x` history, which stays recorded in the mode's changelog.
<!-- /ANCHOR:questions -->

---
