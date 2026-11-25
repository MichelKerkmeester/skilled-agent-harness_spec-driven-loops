---
title: "Feature Specification: Phase 25: data-driven hub registry"
description: "The compiled-route hub set moves out of five hard-coded lists into one hub-registry.json, so a consumer gives its own hub a compiled route with one json-entry overlay instead of overlaying four or five upstream code files."
trigger_phrases:
  - "data driven hub registry"
  - "compiled route hub registry"
  - "hub-registry.json"
  - "phase 25 data driven hub registry"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 25: data-driven hub registry

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-25 |
| **Branch** | `worktrees/544-upstream-overlay-mechanisms` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 25 |
| **Predecessor** | 024-cli-external-hub-manifest-remint |
| **Successor** | None |
| **Handoff Criteria** | Every reader of the compiled-route hub set reads one registry, the 121 route outputs are byte-identical to the pre-change baseline, `sync --check` and `--verify` pass, and the `@review` verdict is APPROVED with no P0 or P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the router unification program. The program holds the authored copy of the compiled-routing runtime, so this phase changes both the promoted tree under `.skilled/bin/lib/compiled-routing/` and its authored twin here. It shares its branch and its review with the overlay framework packet's phase 18, `removeItems`.

**Scope Boundary**: where the compiled-route hub set is defined and read: the engine, the resolver, the guard, the sync tool and the advisor flag. No hub's routing changes.

**Dependencies**:
- Barter's overlays of the engine, resolver, guard, sync and advisor files, read only, which show what a consumer had to carry to add sk-git.
- The json-entry `appendItems` operation, which lets a consumer add one registry entry.

**Deliverables**:
- `hub-registry.json` in the promoted tree and its authored twin at the program root.
- A validating reader, `014-runtime-engine/lib/hub-registry.cjs`, in both trees, and a dependency-free reader in the advisor that fails closed.
- Byte-identical route, guard, admission and status output for the eight current hubs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The compiled-route hub set was written out five times: `HUB_CHILD` in `014-runtime-engine/lib/compiled-route.cjs`, `DEFAULT_ON_HUBS` in `resolve.cjs`, `HUBS` in the guard, `HUBS` in the sync tool, and the sets in the advisor's `compiled-routing-flag.ts`. To give its own hub, sk-git, a compiled route, Barter had to overlay four or five upstream code files, and each re-pin had to rebase them.

### Purpose
One data file names the compiled-route hubs, every reader reads it, and a consumer adds a hub with one json-entry entry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The new registry test file, run on the code before the change, captured in `/tmp/upstream-544/routing-red.txt`:
```text
$ sed -n 1p /tmp/upstream-544/routing-red.txt; grep -E -m3 '^ℹ (tests|pass|fail) ' /tmp/upstream-544/routing-red.txt
=== node --test bin/tests/compiled-route-hub-registry.test.cjs
ℹ tests 20
ℹ pass 1
ℹ fail 19
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `hub-registry.json`, schemaVersion `V1`, whose `hubs` list holds `{id, rolloutChild, defaultOn}` for the eight current hubs in today's order, in the promoted tree and the authored program root.
- Validate the registry: a canonical id, `rolloutChild` matching `^009-parent-hub-rollout/\d{3}-<id>$`, a boolean `defaultOn`, and no duplicate.
- Read the hub set from the registry in the engine, the resolver, the guard, the sync tool and the advisor, with the advisor failing closed to empty sets.
- Have sync read each root's registry with the reader beside it, and regenerate the serving closure.
- Update the architecture doc and the feature catalogs that named the hard-coded lists.

### Out of Scope
- The `hubs` field of a consumer's `serving-closure.manifest.json` - consumers do not run sync and nothing validates that field, so Barter's will not list sk-git.
- `leaf-route-replay.cjs`'s parent-hub list - it is not the compiled-route set, and the architecture doc now says so.
- The rollout canary harnesses - they fail the same way before and after, for reasons unrelated to the hub set.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-routing/hub-registry.json` | Create | The promoted registry |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/hub-registry.cjs` | Create | The validating reader |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modify | `HUB_CHILD` comes from the registry |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modify | `DEFAULT_ON_HUBS` comes from the registry |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | Modify | Regenerated by sync, 61 to 63 files |
| `.skilled/bin/compiled-route-guard.cjs` | Modify | Guard `HUBS` comes from the registry |
| `.skilled/bin/compiled-route-sync.cjs` | Modify | Sync `HUBS` comes from each root's own registry and reader |
| `.skilled/bin/compiled-routing-foundation.vitest.ts` | Modify | Every hub-set copy equals the registry |
| `.skilled/bin/tests/compiled-route-hub-registry.test.cjs` | Create | Registry, consumer-append and refusal tests |
| `.skilled/bin/tests/fixtures/hub-registry/registry-cases.json` | Create | Valid and malformed registry cases |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modify | A dependency-free registry reader that fails closed |
| `.skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-hub-registry.vitest.ts` | Create | The advisor reads the registry and refuses a malformed one |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/hub-registry.json` | Create | The authored registry |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/` | Modify | Authored twins of `hub-registry.cjs` (created), `compiled-route.cjs` and `resolve.cjs` |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modify | Names the registry as the hub set's one source |
| Five `feature-catalog/compiled-routing-and-legacy-fallback` entries, `advisor-recommend.md` and `feature-flag-governance.md` | Modify | Point at the registry instead of the hard-coded lists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Routing for the eight current hubs is unchanged | the 121 `compiled-route.cjs --hub` outputs, over each hub's canary prompts and one unknown hub, diff empty against the pre-change baseline |
| REQ-002 | Every reader of the hub set equals the registry, and a malformed registry is refused with an error naming the file | `node --test .skilled/bin/tests/compiled-route-hub-registry.test.cjs` exits 0, and it failed 19 of 20 on the unchanged code |
| REQ-003 | The advisor reads the same sets and fails closed to empty sets on a malformed or missing registry | the advisor registry vitest passes 15 of 15, after failing 15 of 15 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A consumer adds a hub with one json-entry `appendItems` entry | applied to a temp root, the first apply reports 1 changed and the second 0 |
| REQ-005 | Guard, admission, status and sync keep their output | guard JSON, admission `--all` and status output are identical, and `sync --check` and `--verify` pass |
| REQ-006 | A `@review` pass approves with no P0 or P1 | the verdict line is recorded in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.skilled/bin/tests` passes 218 with 1 skipped (196 before), bin vitest passes 95 of 95, and the advisor vitest passes 3545 with 4 skipped (3530 before).
- **SC-002**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The serving closure must carry the registry and its reader | A promoted tree without them cannot load the engine | Sync regenerates the closure, 61 to 63 files, and `sync --verify` checks every served copy against its authored file |
| Risk | A registry read error in the advisor could turn compiled routing on for the wrong hubs | High | The advisor reader fails closed to empty sets, tested for each malformed case |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The three items left alone are recorded under Out of Scope with the reason for each.
<!-- /ANCHOR:questions -->

---
