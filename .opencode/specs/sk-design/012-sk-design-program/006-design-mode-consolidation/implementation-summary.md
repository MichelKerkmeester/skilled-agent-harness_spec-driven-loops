---
title: "Implementation Summary: sk-design mode consolidation"
description: "In-progress evidence record for the four-mode sk-design hub and permanent interface-owned foundations and audit subworkflows."
trigger_phrases:
  - "sk-design consolidation summary"
  - "four design mode implementation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T10:32:50Z"
    last_updated_by: "opencode"
    recent_action: "Recorded four-mode migration and focused verification state"
    next_safe_action: "Patch live hub and interface consumers, then regenerate routing artifacts"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/leaf-manifest.json"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    completion_pct: 65
    open_questions: []
    answered_questions:
      - "Foundations and audit remain permanent interface-owned command subworkflows, not registered modes or nested skills."
      - "The styles package remains in place and must be byte-identical."
---
# Implementation Summary: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-design-mode-consolidation |
| **Status** | In Progress |
| **Started** | 2026-07-26 |
| **Completed** | Pending |
| **Level** | 3 |
| **Branch** | `skilled/v4.0.0.0` |
| **Current Stage** | Live-consumer migration and generated-routing reconciliation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:exec-summary -->
## Executive Summary

The authored `sk-design` topology now has the approved four registered modes while keeping foundations and audit as complete, permanent workflows beneath `design-interface`. Public commands still exist, both former peer trees have moved without flattening their procedures or proof systems, typed command-subworkflow routing is in place, and focused verification confirms the four-mode registry, 69-leaf interface manifest, command contracts, corpora, fingerprints, and parent-hub invariants.

The packet is not complete. Several live documents and resource maps still name the retired peer paths, generated advisor and compiled-routing consumers have not been refreshed from the final authored topology, route-gold benchmark expectations still encode the six-mode model, and the final styles equality and strict packet gates remain pending. The last broad doctrine patch failed atomically on one non-matching source line, so it changed no source files; continuation should use smaller exact-source patches.
<!-- /ANCHOR:exec-summary -->

<!-- ANCHOR:what-built -->
## What Was Built

### Four-Mode Registry and Typed Subworkflows

`mode-registry.json` now registers exactly `interface`, `motion`, `md-generator`, and `design-mcp-open-design`. Foundations and audit are declared separately in `commandSubworkflows`, each permanently owned by `interface`. This keeps public workflow capability independent from top-level skill identity.

`hub-router.json` now uses `interface` as the executable default, exposes router signals only for the four registered modes, and carries command-subworkflow routing for foundations and audit. `command-metadata.json`, public command wrappers, and auto/confirm workflow assets route `/interface:foundations` and `/interface:audit` through `workflowMode=interface` plus the corresponding `commandSubworkflow` discriminator.

### Complete Foundations Relocation

The former foundations peer tree moved beneath `design-interface` without losing its workflow surface. Its complete contract, README, changelog, corpus, procedures, feature catalog, manual playbook, validators, references, and assets now live under:

- `design-interface/foundations/` for the non-routable contract and supporting workflow package.
- `design-interface/references/foundations/` for routable reference leaves.
- `design-interface/assets/foundations/` for routable assets.

The former nested `SKILL.md` became a frontmatter-free `contract.md`, so no nested advisor identity remains. The pre-change inventory records 48 foundations files; the relocation accounting treats the README, contract transformation, and changelog separately from subordinate files as required by the packet.

### Complete Audit Relocation

The former audit peer tree also moved beneath `design-interface` while preserving independent invocation and audit authority. Its severity model, five scoring dimensions, evidence labels, reports, comparison corpus, procedures, feature catalog, manual playbook, shell validators, AI-fingerprint registry, and fixture set now live under:

- `design-interface/audit/` for the non-routable contract and supporting workflow package.
- `design-interface/references/audit/` for routable audit references.
- `design-interface/assets/audit/` for report assets and AI-fingerprint fixtures.

The former nested `SKILL.md` became a frontmatter-free `contract.md`. The pre-change inventory records 70 audit files, with the README, contract transformation, and changelog accounted for separately.

### Deterministic Manifest and Checker Support

The canonical leaf generator rebuilt `leaf-manifest.json` from the final directory shape. It now reports four registered modes and exactly 69 interface-owned leaves: 20 existing interface leaves, 12 foundations leaves, and 37 audit leaves.

The parent-skill checker now validates command-subworkflow extension declarations, owner modes, commands, router signals, vocabulary classes, resource paths, and exact registry/router agreement. The command-surface checker validates subworkflow ownership, command choreography, resource paths, canonical command sets, and registry reconciliation. The interface command tests now select canonical commands directly instead of assuming one command per `workflowMode`, which is no longer true because foundations and audit both use `interface`.

### Frozen Baseline Evidence

Packet-local scratch evidence contains the original foundations and audit inventories, source hashes, routing hashes, a full 7,812-row styles SHA-256 manifest, and the pre-change benchmark run. These artifacts preserve rollback and baseline comparison without modifying the frozen styles package.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery followed the packet's dependency order. The session first captured inventories, source hashes, styles hashes, focused package baselines, and benchmark behavior. It then moved foundations, reran its corpus and validators, moved audit, reran its corpus and fingerprint checks, contracted the authored registry, updated command ownership, extended downstream checkers, regenerated the leaf manifest, and removed only empty retired directories after confirming they contained no files.

Each major structural stage ran focused verification before the next stage. The parent-hub checker initially found only the empty retired directories; removing those directories with `rmdir` cleared the invariant without deleting content. After the registry changed, the interface command test exposed an invalid assumption that command surfaces were unique by `workflowMode`; selecting by canonical command fixed the test without adding compatibility behavior.

The next stage attempted one broad doctrine patch across hub, interface, and shared documentation. `apply_patch` rejected the patch because one expected source sentence did not match exactly. The patch was atomic, so none of those documentation edits landed. The safe continuation is smaller patches based on fresh reads, followed by canonical generated-consumer refresh and the full final gate matrix.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four modes plus permanent interface command subworkflows | Removes identity without removing user behavior |
| Audit remains embedded, not standalone | Preserves one advisor identity and complete audit authority |
| Styles remain byte-unchanged | Bounds migration blast radius and protects shared consumers |
| Public command IDs remain permanent | Operators keep `/interface:foundations` and `/interface:audit`; only internal ownership changes |
| Contracts replace nested skills | Full workflow doctrine remains readable and executable without adding advisor identities |
| Generated artifacts come from canonical generators | Prevents hand-authored projections from drifting from the registry and filesystem |
| Historical reports stay historical | Old paths in benchmark reports, changelogs, and before-snapshots remain valid evidence and are not live routing defects |
| Small exact-source patches after the failed broad patch | Reduces the risk that one stale prose expectation blocks or obscures unrelated documentation edits |

See `decision-record.md` for full context and alternatives.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline source inventory | PASS: 48 foundations files and 70 audit files recorded in packet scratch evidence |
| Baseline styles manifest | PASS: 7,812 tracked paths recorded; final equality comparison remains pending |
| Focused md-generator baseline | PASS: 2/2 Vitest tests |
| Styles build check | PASS at captured boundary: 1,290 records, zero added, changed, or removed |
| Foundations relocated corpus and validators | PASS: corpus and validator suite reported 25/25 |
| Audit relocated comparison corpus | PASS: 21/21 |
| AI-fingerprint registry | PASS: 10/10 |
| AI-fingerprint fixtures | PASS: 20/20 |
| Leaf manifest generation | PASS: digest `764a4733339f086ac97b83b2347089479317dff54eff0a5df78b4dc0460ef3b0` |
| Leaf manifest projection | PASS: four modes; interface 69 leaves, foundations 12, audit 37 |
| Interface command contract | PASS: 8/8 `node:test` cases |
| Design command surface unit tests | PASS: 7/7 `node:test` cases |
| Direct command-surface checker | PASS: `commands=5`, `aliases=15`, four workflow modes, `invalid=0`, `drift=0` |
| Parent checker guard-chain test | PASS: 1/1 |
| Parent-hub package checker | PASS: all hard invariants, zero warnings |
| Retired peer directories | PASS: no `design-foundations/` or `design-audit/` peer directory remains |
| Broad hub-doctrine patch | FAIL SAFE: `apply_patch verification failed` on a non-matching `SKILL.md` sentence; atomic patch changed no source files |
| Pre-change benchmark | BLOCKED BY ROUTE GOLD: 95/100; `TV-001.V2`, `TV-001.V3`, and `SR-002.P3` encode the retired topology |
| Final live-consumer grep | PENDING: known live old-path references remain in hub docs, shared docs, playbooks, feature catalogs, command metadata, advisor playbook, and compiled sk-design fixtures |
| Advisor and graph metadata refresh | PENDING |
| Compiled-routing sync, drift, activation, and benchmark | PENDING |
| Final styles SHA-256 equality | PENDING |
| Strict SpecKit after this documentation update | PENDING in this summary; run immediately after authoring and again at completion |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:remaining-work -->
## Remaining Work

### Live Consumer Migration

Update the root hub `SKILL.md`, root README, `design-interface/SKILL.md`, shared context-loading contract, context-loaded card, smart-routing resource map, procedure-card doctrine, shared script documentation, polish-gate procedure, root manual-testing playbook, feature catalogs, and relocated support docs that still expose the peer-mode topology. Four stale audit transform-remediation paths remain in `command-metadata.json`.

Use focused searches that exclude historical benchmark reports, changelogs, archived specs, and packet before-snapshots. A repository-wide grep produced an oversized JSON record; path-scoped searches are safer and distinguish live defects from legitimate history.

### Canonical Generation

After authored sources agree, regenerate:

1. `leaf-manifest.json` and verify byte equality again.
2. `description.json` and `graph-metadata.json` for the one advisor identity.
3. Compiled sk-design fixtures, policies, activation metadata, and serving artifacts through the canonical compiled-route sync path.
4. Any generated routing metadata under the router-unification packet that is an active consumer rather than historical evidence.

The compiled-routing tree is concurrently dirty from Packet 1 and other work. Review only sk-design-scoped generated deltas and never revert unrelated paths.

### Final Verification and Packet Reconciliation

Update route gold for the approved topology, rerun the benchmark, rebuild the stale md-generator dist, compare the 7,812-row styles manifest byte-for-byte, run whole-package command/corpus/fingerprint/checker suites, and execute compiled-route sync and drift checks. Then reconcile `tasks.md`, `checklist.md`, `plan.md`, this summary, handover continuity, description metadata, graph metadata, strict SpecKit validation, and active-goal verification.
<!-- /ANCHOR:remaining-work -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Spec Memory is unavailable.** `memory_match_triggers` and both final `memory_save` calls returned `MCP error -32001: Request timed out`; repository files and deterministic checks are the current evidence source.
2. **Code graph context is unavailable.** The startup graph contains zero files, nodes, and edges, so structural claims use direct filesystem evidence rather than graph relationships.
3. **The worktree is intentionally dirty.** The branch contains Packet 1 and unrelated concurrent changes. No commit or push was requested, and no broad restore operation is safe.
4. **Canonical prose is partly stale.** The registry and focused checkers are ahead of hub/shared documentation until live-consumer migration finishes.
5. **Generated routing is not final.** Advisor metadata, compiled-routing fixtures, activation artifacts, and route gold must be regenerated only after authored source stops changing.
6. **The final styles invariant is not yet proven.** The 7,812-row baseline exists and no styles edit was intended, but completion requires a fresh post-change manifest comparison.
7. **Production command frequency remains unknown.** It is not used to justify removing capability; both public commands remain permanent by approved design.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Occurred | Impact | Response |
|------|----------|--------|----------|
| Public commands lose a valid target after row removal | No | None | Added typed command-subworkflow ownership before final verification |
| Path-sensitive tests assume one command per mode | Yes | Focused test failed after both commands moved to `interface` | Lookup now uses canonical command identity; 8/8 tests pass |
| Empty peer directories violate hub topology | Yes | Parent checker reported one hard invariant failure | Confirmed directories were empty and removed them with `rmdir`; checker is green |
| Broad documentation patch drifts from exact source | Yes | Patch rejected before any source change | Continue with small patches from fresh reads |
| Historical old paths create false-positive migration scope | Yes | Initial grep returned more than 100 matches and overflowed one JSON record | Exclude frozen reports and classify live, generated, and historical consumers |
| Styles content changes during relocation | Not observed | Completion proof still pending | Keep styles untouched and compare the final 7,812-row manifest |
<!-- /ANCHOR:risks-realized -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Add all interface subworkflow doctrine before moving source trees | Typed registry/router/command doctrine landed first; broad narrative doctrine remains pending | Structural schemas and command tests gave a safer executable ownership boundary before prose migration |
| Complete each live-consumer migration in the same stage as its tree move | Core runtime paths moved first; cross-package prose is being migrated after both trees are stable | Avoided changing historical evidence and reduced duplicate edits across the two moves |
| Use one broad documentation patch | Broad patch failed atomically and was abandoned | Exact source differed from one expected line; smaller patches are safer |
| Run final benchmark immediately after registry contraction | Benchmark update deferred until authored resource maps and compiled fixtures are final | Prevents benchmarking a half-migrated routing corpus |
<!-- /ANCHOR:deviations -->

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Complete live old-path and nested-identity consumer migration.
- [ ] Regenerate advisor and compiled-routing artifacts through canonical producers.
- [ ] Update route gold and obtain a green post-change benchmark.
- [ ] Rebuild md-generator dist and rerun package checks.
- [ ] Prove final styles SHA-256 equality across all 7,812 tracked paths.
- [ ] Reconcile task and checklist evidence without marking unrun gates complete.
- [ ] Run strict SpecKit validation and active-goal verification.
- [ ] Retry packet indexing after daemon recovery; the current handover and summary save attempts both timed out.
<!-- /ANCHOR:follow-up -->
