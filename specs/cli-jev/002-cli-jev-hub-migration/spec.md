---
title: "Feature Specification: cli-jev hub migration"
description: "Stand the jev transport up as its own parent hub with CLI usage as its first mode, move its packet history into the cli-jev track, and onboard the hub to compiled routing."
trigger_phrases:
  - "cli-jev hub migration"
  - "cli-jev parent hub"
  - "cli-usage mode"
  - "jev transport"
  - "compiled fleet onboarding"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration"
    last_updated_at: "2026-09-20T15:35:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Phases 001 to 005 closed: hub serving compiled policy, both playbooks re-run from the new home"
    next_safe_action: "Operator decision: commit the working tree, or leave it uncommitted"
    blockers: []
    key_files:
      - "specs/cli-jev/002-cli-jev-hub-migration/spec.md"
      - "specs/cli-jev/002-cli-jev-hub-migration/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-hub-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the working tree is committed is the operator's call"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: cli-jev hub migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (phased packet) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/cli-jev/` (track root) |
| **Parent Packet** | `cli-jev` |
| **Predecessor** | `cli-jev/001-cli-jev-creation` |
| **Successor** | None |
| **Handoff Criteria** | Both hubs pass their own gates, the moved mode still answers typed judgments from its new home, and the compiled fleet serves six hubs with every manifest fresh |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The jev transport packet sat inside `.skilled/skills/cli-external-orchestration/cli-jev/`, a hub whose
seven other modes are the CLI executors that the executor-delegation scorer enumerates from that same
`mode-registry.json`. The transport answers one typed judgment and runs nothing, so it belongs to a different
family: it has no executor semantics, no workspace mutation, and no reason to sit beside a roster that exists to
dispatch work. Its spec history sat in the `cli-external-orchestration` track for the same reason, while the
`cli-jev` track existed on disk with no metadata and no packets. This program closed that gap: the hub now
lives at `.skilled/skills/cli-jev/` with `cli-usage` as its first mode, and its history at `specs/cli-jev/`.

### Purpose

Stand the jev family up as its own parent hub at `.skilled/skills/cli-jev/` with the CLI-usage surface as its
first mode at `.skilled/skills/cli-jev/cli-usage/`, decouple the old hub completely, move the packet history into
the `cli-jev` track at `specs/cli-jev/001-cli-jev-creation`, and onboard the new hub to the compiled-routing
fleet so its routing decision is served from a fresh manifest like every other hub's.

> **Phase-parent note:** This spec.md is the only authored document at the parent level. All detailed planning,
> task breakdowns, checklists and decisions live in the child phase folders listed in the Phase Documentation Map
> below. This keeps the parent from drifting stale as phases execute and pivot.

**Baseline captured before phase 001 (read-only probes, 2026-09-20):**

| Probe | Result |
|-------|--------|
| Hub census under `.skilled/skills/` | six folders carry a `mode-registry.json` + `hub-router.json` pair; five are in the compiled fleet, `sk-design` is not |
| `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make me a diagram of this flow"` | `{"servingAuthority":"legacy","hubId":"sk-design"}` — legacy serving is a supported state, but this hub joins the fleet |
| `node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-design --skill-root .skilled/skills/sk-design` | empty stdout, exit 0 — the packaged readiness check passes a hub without a manifest only when its `SKILL.md` carries the four directive markers |
| `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py --strict .skilled/skills/sk-design` | FAIL — missing `REFERENCES` section and two of the four markers, so that hub is not a shape to copy |
| Reference census | 28 files cite `cli-external-orchestration/cli-jev`; 11 skill-side files cite `specs/cli-jev/001-cli-jev-creation`; 57 files inside the packet cite the old spec path |
| `.skilled/bin/compiled-routing-foundation.vitest.ts` | asserts `COMPILED_ROUTING_HUBS` equals the engine's `HUB_CHILD` keys, exactly five hubs in all four `DEFAULT_ON_HUBS` copies, order-identity within each family, and `compiled-serving` for every hub in `HUB_CHILD` |
| Authored closure tree `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program` | holds only the per-hub activation manifests; the full authored closure is archived at `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` |
| `git ls-files specs/cli-jev` before this packet | empty — the track existed on disk and was untracked |
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new parent hub at `.skilled/skills/cli-jev/` whose first mode is `cli-usage`, declared through the hub's own
  `transport-axis` extension with `packetKind: "transport"`, `mutatesWorkspace: false` and `Write`/`Edit`/`Task`
  forbidden.
- The packet content moving into that mode: `SKILL.md`, `README.md`, `references/`, `assets/`,
  `feature-catalog/`, `manual-testing-playbook/`, `benchmark/` and `changelog/`, with a living-doc identity pass
  to the new hub pointer and mode name.
- Complete decoupling of `cli-external-orchestration`: registry entry, extension, tie-break ordering, router
  signals, vocabulary classes, leaf manifest, description, graph metadata, hub prose, feature-catalog claims and
  a changelog entry recording the removal.
- Routing rewiring: the dispatch audit's shape row and packet path, both hook test files, the hub/skill roster
  documents, the prompt card, and the rewrite command's recorded exclusion.
- Spec history moving to `specs/cli-jev/001-cli-jev-creation`, track root metadata for `specs/cli-jev/`, and
  citation repair across packet, skill docs and generated surfaces.
- Compiled-routing fleet onboarding: rollout child `009-parent-hub-rollout/008-cli-jev`, engine hub table,
  eligibility list, the four default-on cohort copies, guard and sync hub lists, the foundation test's cohort
  assertion, compiled artifacts, live and authored manifests, and the serving-closure record.
- Re-verification: the 22-scenario playbook re-run from the new home, both package validators, both dispatch
  suites, the hub doctor, routing probes and the full gate matrix.

### Out of Scope

- Any commit, push, branch or worktree unless the operator asks.
- Repository MCP registration for `jev-mcp`; the stdio block stays documented, not applied.
- A deep-loop `ExecutorKind` entry, fan-out roster change, or any change to the seven remaining
  `cli-external-orchestration` modes beyond the shared files the decoupling touches.
- Renumbering JEV scenario ids or rewriting recorded run verdicts.
- Edits under `.opencode/` — `.opencode/skills` is a symlink to `.skilled/skills`.
- Cleanup of pre-existing dirty-tree state and the five pre-existing catalog violations the old hub already
  carried.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/cli-jev/` | Create | 002 | New parent hub: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json`, `changelog/`, `manual-testing-playbook/`, `shared/` |
| `.skilled/skills/cli-jev/cli-usage/` | Create | 002 | The mode packet moved from the old hub, retagged `cli-usage` and `packetKind: "transport"` |
| `.skilled/skills/cli-external-orchestration/` | Modify | 003 | Mode entry, extension, `tieBreak`, `routerSignals`, `vocabularyClasses`, `leaf-manifest.json`, `description.json`, `graph-metadata.json`, `SKILL.md`, `README.md`, `ROUTER.md`, `feature-catalog/`, `changelog/v1.7.0.0.md` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | 003 | Shape row and `packetPath` for the moved packet |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | 003 | Packet path constant and the jev governance case |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | 003 | Shape assertions for the moved packet |
| `.skilled/skills/README.txt`, `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md`, `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`, `.skilled/commands/rewrite/response-by-external-agent.md` | Modify | 003 | Roster and prompt-surface truth |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/` | Create | 004 | Rollout child: harness, `lib/registry-compiler.cjs`, `lib/router.cjs`, `lib/policy-card.cjs`, `fixtures/canary-cases.v1.json`, generated `compiled/` and `activation/` |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modify | 004 | Engine hub table entry |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modify | 004 | Default-on cohort |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` + `runtime/dist/runtime/lib/compiled-routing-flag.js` | Modify | 004 | Eligibility list and its compiled twin |
| `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs` | Modify | 004 | Guard and sync hub lists |
| `.skilled/bin/compiled-routing-foundation.vitest.ts` | Modify | 004 | Cohort lockstep assertion from five hubs to six |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json` + the authored mirror under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/` | Create | 004 | Minted live manifest and its authored copy |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | Modify | 004 | Serving-closure record for six hubs |
| `specs/cli-jev/001-cli-jev-creation/` | Move | 001 | Becomes `specs/cli-jev/001-cli-jev-creation/`, renumbered to `001` |
| `specs/cli-jev/description.json`, `specs/cli-jev/graph-metadata.json` | Create | 001 | Track root metadata with both children declared |
| Generated surfaces: trigger index, retrieval fixtures, `skill-graph.json`, frontmatter-version manifest, frozen directory manifest | Modify | 001, 003 | Regenerated from the moved tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All
> implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-track-and-packet-migration/` | Stand the packet history up inside the `cli-jev` track: move it to `001-cli-jev-creation`, author the track root metadata, repair derived facts, repoint citations, refresh retrieval surfaces | Complete |
| 2 | `002-hub-scaffold-and-mode-migration/` | Stand up `.skilled/skills/cli-jev/` and move the packet's skill content into `cli-usage` as the hub's first transport mode | Complete |
| 3 | `003-decouple-and-rewire/` | Remove the transport from `cli-external-orchestration` and rewire dispatch, hook tests, rosters and generated artifacts | Complete |
| 4 | `004-compiled-fleet-onboarding/` | Register the hub in the compiled fleet: rollout child, cohort copies, manifests, admission | Complete |
| 5 | `005-playbook-reverification-and-closeout/` | Re-run the playbook from the new home and close out with evidence | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map; a phase's status changes only with its acceptance
  criteria worked to evidence.
- Use `/speckit:resume specs/cli-jev/002-cli-jev-hub-migration/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh specs/cli-jev/002-cli-jev-hub-migration --strict --recursive` from the parent to validate all
  phases as an integrated unit.
- Phase 004 is the only phase that may edit the compiled-fleet tables, and it closes only on guard, admission,
  status and foundation green; no other phase touches those files.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001` | `002` | The packet lives at `specs/cli-jev/001-cli-jev-creation`, the track root declares both children, and no live citation still names the old path | `validate.sh --strict --recursive` prints `RESULT: PASSED`; `sweep-track-roots.mjs` exits 0 |
| `002` | `003` | `.skilled/skills/cli-jev/` exists with `cli-usage` as its declared transport mode and passes its own hub gates | `parent-skill-check.cjs` and `validate_skill_package.py --strict` both green on the new hub |
| `003` | `004` | The old hub carries no transport trace, the dispatch chain resolves the moved packet, and both dispatch suites pass | `node --test` on the rule checks and `vitest` on the audit both pass; the doctor is green on both hubs |
| `004` | `005` | Six hubs serve from fresh compiled manifests and the hub clears admission | `compiled-route-admission.cjs --hub cli-jev` exit 0; `compiled-route-status.cjs --all` fresh; `compiled-route-guard.cjs` exit 0; foundation suite green |
| `005` | — | The playbook ran from the new home with zero failures and every gate in the Verification section passes | The fresh benchmark report plus the recorded command matrix |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether the working tree is committed, and when, is the operator's call; this program ships working-tree edits
  only.
- A future non-CLI jev surface (for example an MCP-usage mode) is deliberately not part of this program; the hub
  layout leaves room for it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase `spec.md`, `plan.md`, `tasks.md`
- **Track root**: See `../description.json` and `../graph-metadata.json`
- **Goal**: See `goal.md` for the durable directive and completion criteria
- **Graph Metadata**: See `graph-metadata.json` for the child list and derived status
