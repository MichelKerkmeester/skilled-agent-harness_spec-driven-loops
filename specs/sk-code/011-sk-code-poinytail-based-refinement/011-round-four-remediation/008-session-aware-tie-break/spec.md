---
title: "Feature Specification: Phase 8: session-aware-tie-break"
description: "When a prompt's keywords tie between two sk-code surfaces, the static tie-break list decides the lead surface, so generic words such as typescript, vitest or json put OpenCode ahead of Webflow for Webflow work. The caller now passes the session's detected surface as a hint that leads such a tie."
trigger_phrases:
  - "session aware tie break"
  - "phase 8 session aware tie break"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: session-aware-tie-break

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/008-session-aware-tie-break` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-hook-deadline-margins |
| **Successor** | None |
| **Handoff Criteria** | With `--surface-hint WEBFLOW` the WF-005 and WF-013 prompts route Webflow first, without a hint every hub routes as before, and the new tests and canary cases pass in both fixture copies |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Round four children specification.

**Scope Boundary**: The serve-time order of surfaces inside an sk-code bundle, the front door flag that carries the hint, the caller step in the hub `SKILL.md` and `ROUTER.md`, the sk-code canary fixture and harness with their authored copies, one new test file and the hub release that the hub-file edits need.

**Dependencies**:
- Children 001 to 007 committed, with child 003's tie-break order quality, review, opencode, obsidian, webflow and hub release 2.2.6.0 in place
- The surface detection rules in `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2, which the caller runs
- The orchestrator re-mint of the compiled sk-code manifest after this build

**Deliverables**:
- An exported `applySurfaceHint` in the sk-code canary router, used by the runtime engine at serve time and by the sk-code canary harness
- An optional `options.surfaceHint` on `compiledRoute` and `resolveRoute`, and a `--surface-hint <SURFACE>` flag on the front door
- `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` with resolver and front door cases
- Five canary cases, in the live fixture and its archive copy
- The caller paragraph in the hub `SKILL.md` and one sentence in `ROUTER.md`
- Hub release 2.2.7.0 across the six hub-root carriers, plus `changelog/v2.2.7.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The front door passes only the prompt to `resolveRoute(hub, prompt)` (`.skilled/bin/compiled-route.cjs:42`). When the prompt's keywords tie between surfaces, the canary router sorts them by `routerPolicy.tieBreak` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:250` and `:264`), so generic words decide the lead surface. The Webflow playbook scenarios WF-005 and WF-013 declare `WEBFLOW` but route `orderedBundle sk-code-opencode,sk-code-webflow` today.

### Purpose
On a keyword tie between surfaces, the surface of the session's current work leads, and with no usable hint every hub routes exactly as it does now.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `applySurfaceHint(snapshot, targets, surfaceHint)` in the sk-code canary router, applied after the route decision is validated
- The engine and the resolver pass an optional `options.surfaceHint`, and the front door reads it from `--surface-hint`
- The sk-code canary harness applies a case's `surfaceHint` field, so the fixture can pin hinted routes
- Each authored closure file is edited first and then copied byte for byte over its runtime copy
- One test file, five canary cases, the hub caller step and hub release 2.2.7.0

### Out of Scope
- The tie-break list itself - the operator kept OPENCODE > OBSIDIAN > WEBFLOW as the fallback
- Routing for every other hub - their routers export no `applySurfaceHint`, so the engine serves their compiled order whatever hint arrives
- The compiled-routing directive blockquote in `SKILL.md` - it is lockstep text across seven surfaces, so the caller step goes in a paragraph after it
- `.skilled/bin/README.md` - no child owns it, so its flag sentence is a handoff in `plan.md`
- The archived `compiled/route-gold.typed.json` - earlier rounds added canary cases without rebuilding it
- Re-minting, the Hermes copies and the trigger index - orchestrator steps

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modify | Authored source: `hintedSurface` and exported `applySurfaceHint` |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modify | Byte copy of the authored source |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | Modify | Authored source: `typedGold` applies a case's `surfaceHint` |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | Modify | Byte copy of the authored source |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/compiled-route.cjs` | Modify | Authored source: `compiledRoute(hubId, taskText, options)` |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modify | Byte copy of the authored source |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs` | Modify | Authored source: `resolveRoute(hubId, taskText, options)` |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modify | Byte copy of the authored source |
| `.skilled/bin/compiled-route.cjs` | Modify | `--surface-hint <SURFACE>` flag |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Create | Resolver and front door cases |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Five canary cases |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Byte copy of the live fixture |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Version and the caller paragraph |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Version and one caller sentence |
| `.skilled/skills/sk-code/README.md` | Modify | Version |
| `.skilled/skills/sk-code/description.json` | Modify | Version |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Version |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Version |
| `.skilled/skills/sk-code/changelog/v2.2.7.0.md` | Create | Hub release entry |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify | Orchestrator re-mint only |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify | Orchestrator copy of the re-mint only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A hinted surface the prompt matched leads the bundle | `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `# pass 6` and `# fail 0`, and the same file printed `# fail 3` before the code change |
| REQ-002 | Canary cases pin the hint in both fixture copies | The canary assertion prints `OK surface-hint-webflow-testing route orderedBundle sk-code-webflow,sk-code-opencode` and `cases 18 failures 0`, it printed `cases 18 failures 3` before the code change, and `cmp` of the two fixture copies exits 0 |
| REQ-003 | No hint means no change | The four-prompt probe output is identical before and after, the all-hub canary run differs only in `001-sk-code cases 13` becoming `cases 18`, and the existing compiled-route tests keep their baseline pass and fail counts |
| REQ-004 | The runtime matches its authored source | `cmp` of each of the four authored closure files with its runtime copy exits 0 |
| REQ-005 | The hub tells the caller to pass the hint | `SKILL.md` and `ROUTER.md` each contain the `--surface-hint` step, and the compiled-routing directive block is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Hub guards stay green | Router-sync prints `5/5`, doc-claims `4/4`, parent-skill-check `OK` with 5e and 5i PASS, and the leaf manifest `--check` line is unchanged |
| REQ-007 | Advisor routing is not worse | The SA-001 battery replay prints the same `positives 13/17 negatives-false-positive 2/5` line before and after |
| REQ-008 | One hub release | Six carriers read 2.2.7.0, the changelog validates with 0 issues and 0 voice hard blockers, and `SKILL.md` keeps 0 issues and its baseline hard blockers |
| REQ-009 | Compiled routing serves the hint | After the orchestrator re-mint, `compiled-route-guard.cjs` prints `sk-code                     fresh`, the front door with `--surface-hint WEBFLOW` returns `sk-code-webflow` first for the WF-005 prompt and `compiled-route-sync.cjs --verify` prints `move-simulation OK` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For the WF-005 prompt, the WF-013 prompt and `obsidian plugin webflow implementation`, a `WEBFLOW` hint puts `sk-code-webflow` first in the resolver, the front door and the canary, while the bundle kind stays `orderedBundle`
- **SC-002**: A workflow mode keeps first place under a hint: `pr review webflow implementation opencode typescript` with `WEBFLOW` routes `surfaceBundle` `sk-code-review,sk-code-webflow,sk-code-opencode`
- **SC-003**: Without a usable hint (none, `UNKNOWN`, an unknown name, or a surface the prompt did not match) every route and every hub canary matches its baseline
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Orchestrator re-mint of the compiled sk-code manifest | Until it runs, the guard reads `stale-manifest` and the front door serves the legacy sentinel | Orchestrator tasks T042 and T043, verified by T055. The new tests use a temporary activation root, so they do not wait for it |
| Dependency | Children 001 to 007 committed first | Counts and the 2.2.6.0 carriers in the OLD texts assume their final state | Phase 1 records the counts, and every unit check runs before the next unit |
| Risk | A hinted order is not one of the compiled composition rules | High if applied inside the router: the decision contract rejects it with `BUNDLE_NOT_IN_POLICY` | The hint is applied after validation, at serve time and in the canary harness, never inside `evaluateCanary` |
| Risk | The authored closure does not rebuild cleanly | Med: `compiled-route-sync.cjs --check` already fails on the authored tree for `cli-classifier` | No full sync rebuild. Each edited file is copied byte for byte, as earlier runtime edits were |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the session hint on 2026-10-10 and kept the tie-break order as the fallback.
<!-- /ANCHOR:questions -->

---
