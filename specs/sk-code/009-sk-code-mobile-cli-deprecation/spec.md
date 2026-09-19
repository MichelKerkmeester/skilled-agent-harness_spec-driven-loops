---
title: "Feature Specification: Deprecate the sk-code-mobile-cli surface packet and sweep its references"
description: "The sk-code hub still registers and advertises a surface packet for the retired Pi Remote Mobile-CLI stack, so app-mobile prompts route to a stack the repository no longer carries."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "sk-code-mobile-cli deprecation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deprecate the sk-code-mobile-cli surface packet and sweep its references

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-19 |
| **Branch** | none — packet created with `--skip-branch`; working tree stays on `skilled/v4.0.0.0` |
| **Anchor commit** | `79646e642283fccf5373be73fb7ece3accc4e3ce` (packet present; rollback source) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `sk-code` parent hub registers `sk-code-mobile-cli` as a read-only surface packet for
the retired Pi Remote Mobile-CLI stack (`apps/pi-remote-web/`, `app-mobile`, `app-relay`,
`packages/pi-rpc-protocol`, the `--pi-*` ink-on-parchment token library, the `@ds`
editability grammar). The packet still holds 82 regular files and 668K on disk (85 tracked entries), and it is routable today:
`compiled-route.cjs` on the prompt *"Add a new --pi-* design token to app-mobile/src"*
answers with `targets[0].packetId: "sk-code-mobile-cli"`. So a hub that no longer wants to
advertise that stack still hands prompts to it, and 81 files under `.skilled/skills` plus
the root `README.md` name it — 674 mentions in total — which is why this is a sweep and
not a delete.

### Purpose

The hub advertises only the surface packets it still owns, and every live mention of the
removed packet is gone, replaced, or enumerated as intentional residue.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Hard-removal of `.skilled/skills/sk-code/sk-code-mobile-cli/` (85 tracked entries, 494K in git) and of
  every live reference to it across `.skilled/skills/**`, `.skilled/skills/README.txt`
  and the root `README.md`.
- Hub de-registration in reverse of the documented nested-packet order: `mode-registry.json`
  entry and `tieBreak` permutation, `hub-router.json` signals/vocabulary/classes,
  `ROUTER.md` intent key `MOBILE_CLI` + `RESOURCE_MAP` entries + surface prose,
  `graph-metadata.json` derived vocabulary and key files, `description.json`,
  `SKILL.md` mode table and version authority, `shared/references/stack-detection.md`
  (the `PI_REMOTE` marker block, precedence and CWD signals).
- Removal of the `PI_REMOTE` surface detection itself, so an `app-mobile`-shaped prompt
  resolves no mobile surface and the hub defers or asks for disambiguation.
- Sibling rewrite: the 13 `sk-code-obsidian` files that attribute their newly mirrored
  conventions to `sk-code-mobile-cli`, including the `OB-021` negative-control scenario
  that shells `sed` over the removed packet's `SKILL.md`.
- `sk-doc` consumers: the nested-packet reference example, the manual-testing-playbook
  fail-closed allowlist root, and the two frozen test baselines.
- Regeneration of every derived artifact by its own generator, then of the compiled-routing
  closure (leaf manifest, hub derived block, advisor skill graph, trigger index + fixtures,
  `sk-doc` baselines, canary fixtures, `compiled/` policy artifacts, activation manifest).
- History scrub inside the skills tree: the hub and obsidian changelog entries that
  describe the removed surface, and the three `benchmark/reports/compiled-routing/*luna-high*`
  benchmark reports that enumerate it.
- Version authority for the removal: hub `SKILL.md` → `v4.2.3.0` with a new
  `changelog/v4.2.3.0.md` entry that names what it removed.
- A one-line supersession note in `specs/sk-code/008-sk-code-mobile-cli-mode/spec.md`
  pointing at this packet.

### Out of Scope

- Research/lineage logs, `scratch/` trees and run logs under `specs/**` — they are the
  historical record of how the surface was built.
- Completed packet bodies that mention the surface (007, 033, 034, 037, 052) — record, not
  live surface.
- The `specs/cli-external-orchestration/041-pi-remote-*` and `042-*` product track — the
  Pi Remote product work never named the skill, so nothing there is a consumer.
- `specs/sk-code/001-…` through `007-…` and `z_archive/` — untouched.
- Git history rewriting, commits and pushes. The removal is a working-tree change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-mobile-cli/` | Delete | The whole 85-entry surface packet |
| `.skilled/skills/sk-code/{mode-registry.json,hub-router.json}` | Modify | Drop the mode entry, its `tieBreak` slot, its signals and vocabulary |
| `.skilled/skills/sk-code/{ROUTER.md,SKILL.md,graph-metadata.json,description.json}` | Modify | Intent key, resource map, mode table, version authority, vocabulary |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | Remove the `PI_REMOTE` markers, precedence row and CWD signals |
| `.skilled/skills/sk-code/changelog/v4.2.3.0.md` | Create | The removal entry |
| `.skilled/skills/sk-code/changelog/{v3.3.0.0.md,v4.2.2.0.md}` | Modify | Drop prose that describes the removed surface |
| `.skilled/skills/sk-code/benchmark/reports/compiled-routing/*luna-high*/skill-benchmark-report.json` | Modify | Scrub the enumerated surface (3 reports) |
| `.skilled/skills/sk-code-obsidian/**` (13 files) | Modify | Keep the mirrored conventions, drop dead attribution and cited paths |
| `.skilled/skills/sk-doc/**` (3 files + 2 baselines) | Modify | Reference example, playbook allowlist, frozen test baselines |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | Advisor projection |
| `.skilled/skills/system-spec-kit/runtime/**` (index + 3 fixtures) | Regenerate | Trigger index and its fixtures |
| `.skilled/skills/sk-code/leaf-manifest.json`, `graph-metadata.json` derived block | Regenerate | Hub leaf typing and derived vocabulary |
| `specs/sk-doc/019-…/015-router-unification-program/**` (canary + compiled + activation) | Modify / Regenerate | Routing program closure |
| `README.md` | Modify | Drop the packet from the replace-list block |
| `specs/sk-code/008-sk-code-mobile-cli-mode/spec.md` | Modify | Supersession note |
| `specs/sk-code/description.json` | Modify | Track description no longer names the removed surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet directory is gone: `find .skilled/skills/sk-code/sk-code-mobile-cli -type f` returns 0 files, and no tracked file outside the enumerated residue names the packet. |
| REQ-002 | The hub is de-registered on every surface at once: registry entry, `tieBreak` permutation, `hub-router.json` signals and classes, `ROUTER.md` `INTENT_SIGNALS` + `RESOURCE_MAP` + surface prose, `graph-metadata.json`, `description.json`, `SKILL.md` mode table. |
| REQ-003 | `PI_REMOTE` detection is removed from `shared/references/stack-detection.md`, so an `app-mobile`-shaped prompt resolves no mobile surface. |
| REQ-004 | Version authority is satisfied: `SKILL.md` frontmatter, `description.json`, `mode-registry.json`, `hub-router.json` and `ROUTER.md` all carry `4.2.3.0`, and `changelog/v4.2.3.0.md` is the newest entry. |
| REQ-005 | Every derived artifact is regenerated by its own generator, never hand-edited, and its CI freshness gate passes. |
| REQ-006 | The compiled-routing closure is re-minted, and `compiled-route-guard.cjs` reports no stale manifest and no authored drift for any hub. |
| REQ-007 | The sibling `sk-code-obsidian` packet keeps its mirrored conventions with live citations, including the `OB-021` negative control. |
| REQ-008 | The playbook package under the hub validates `--strict`, and its allowlist no longer names a deleted root. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The three benchmark reports and the two historical hub changelog entries no longer enumerate the removed surface. |
| REQ-010 | The root `README.md` no longer advertises the packet among the replace-your-stack surfaces. |
| REQ-011 | `.skilled/skills/README.txt` is confirmed to carry no mention, and that no-op is recorded rather than assumed. |
| REQ-012 | `specs/sk-code/008-sk-code-mobile-cli-mode/spec.md` carries a supersession note pointing at this packet, and this packet records the removed tree's anchor commit, file count and the residue allowlist. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -l "sk-code-mobile-cli|PI_REMOTE" .skilled/skills README.md` returns only the enumerated residue — the removal changelog entry and trigger-index/fixture entries that trace to this packet.
- **SC-002**: `compiled-route.cjs --hub sk-code` on the mobile baseline prompt no longer returns a `sk-code-mobile-cli` target, while the quality baseline prompt still routes `sk-code-quality` — both quoted verbatim.
- **SC-003**: `parent-skill-check.cjs .skilled/skills/sk-code` passes every check including `5e` (tieBreak permutation) and `10b-byte-drift`, with the hub's version authority at `4.2.3.0`.
- **SC-004**: The three `ci-*` freshness gates, the advisor graph validation, the playbook `--strict` validation, the link-integrity check and both `sk-doc` test baselines pass from the final state.
- **SC-005**: `validate.sh specs/sk-code/009-sk-code-mobile-cli-deprecation --strict` prints an explicit `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hub edits without re-minting leave the resolver silently on legacy prose routing | Medium | Mint after every routing-input edit; `compiled-route-guard.cjs` is the check |
| Risk | A derived artifact hand-edited instead of regenerated drifts from its generator | High | Run each generator's `--write`/`--export` path; the `ci-*` gates byte-compare |
| Risk | The obsidian packet's citations of the removed packet break link integrity | Medium | Retarget every citation to a live target in the same change; link check is the gate |
| Risk | Regenerating the trigger index before the docs settle bakes stale entries | Medium | Fixed order: docs, then derived artifacts, trigger index last |
| Dependency | `pi` on PATH plus `LLMGATEWAY_API_KEY` for the delegated lanes | Blocks the delegation path only | Observed true at plan time; if a dispatch is refused, the orchestrator performs the edit and records the deviation |
| Dependency | The recorded anchor commit `79646e64` keeps the packet recoverable | Low | Verified present before the delete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new runtime cost. The removal shrinks the hub's authored surface; the resolver reads the same three inputs as before.
- **NFR-P02**: Each generator runs once, in the documented order, from the repository root.

### Security
- **NFR-S01**: No credential, API key or secret is written into a dispatch command, brief, or packet file.
- **NFR-S02**: The work makes no call that leaves this machine except the model dispatches the operator authorized.

### Reliability
- **NFR-R01**: Every check in the Verification section passes from the final state, with its output and exit status read rather than inferred.
- **NFR-R02**: The removal stays reversible: `git restore --source=79646e64 -- <paths>` restores every deleted and edited tracked path, and no untracked file is overwritten.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A prompt naming `app-mobile` after removal: the hub has no mobile surface to resolve, so it defers or asks for disambiguation instead of routing to a deleted packet (the exact JSON is the receipt).
- An empty search result: `rg` returning nothing is only evidence after the same search is shown to match a known instance, so the residue check is paired with a positive control on the pre-change tree.
- A file that still names the packet on purpose: the new changelog entry and the fixtures that trace to this packet are the allowlisted residue, not misses.

### Error Scenarios
- A generator writing a byte-different artifact than CI expects: the `ci-*` gates fail loudly, which is the intended behaviour; the fix is to re-run the generator, never to edit the baseline.
- A playbook validator `PATH_MISSING` on a citation of the deleted root: retarget the citation to a live file in the same change.
- A dispatch refused by the runtime guard: record it as a deviation and perform that edit in the orchestrator's own voice instead of silently widening the brief.

### State Transitions
- Partial completion — packet deleted, manifests not yet re-minted — leaves the resolver on legacy routing rather than broken; `compiled-route-guard.cjs` is what makes that state visible.
- Recovered state: restoring the anchor commit returns the tree to the pre-change routing closure; the derived artifacts must then be regenerated rather than restored by hand.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 85 tracked entries deleted, ~46 files edited, 5 derived generators re-run, one hub contract changed |
| Risk | 18/25 | A shared routing contract and an 85-entry deletion; reversible from a recorded anchor |
| Research | 6/20 | Census complete before the plan: exact file lists, mention counts and gate inventory |
| **Total** | **46/70** | **Level 2** |

Level scorer (`recommend-level.sh`, observed at plan time): Level 2, total 46/100, confidence 82.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The four decisions the plan needed were settled before approval: hard-remove over soft-deprecate; `PI_REMOTE` detection removed rather than retargeted; scrub reach limited to the skills tree plus the live compiled-routing program artifacts; and this packet's own path.
<!-- /ANCHOR:questions -->

---


