---
title: "Session Handover: sk-design mode consolidation"
description: "Continuation state for the in-progress four-mode sk-design migration, permanent interface-owned foundations and audit subworkflows, and remaining verification work."
trigger_phrases:
  - "sk-design consolidation handover"
  - "resume design mode consolidation"
  - "four mode implementation state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T10:32:50Z"
    last_updated_by: "opencode"
    recent_action: "Recorded the current four-mode migration boundary"
    next_safe_action: "Patch live consumers, then regenerate routing artifacts"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    completion_pct: 65
    open_questions: []
    answered_questions:
      - "Foundations and audit remain permanent interface subworkflows."
---
# Session Handover: sk-design Mode Consolidation

Resume from the four-mode authored topology and complete live-consumer migration, generated routing, final verification, and packet reconciliation without reverting unrelated dirty-worktree changes.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## Current Status

**Status:** `in_progress`

The structural migration is materially underway. The two former peer-mode trees have moved beneath `design-interface`, the authored registry now contains exactly four modes, command-subworkflow metadata exists, the leaf manifest is regenerated to the required 69 interface leaves, and focused command, corpus, fingerprint, and parent-hub gates are green. Canonical hub doctrine, live old-path consumers, advisor metadata, compiled-routing artifacts, benchmark route gold, final styles equality, and strict packet reconciliation remain open.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** OpenCode execution session, 2026-07-26
- **To Session:** Next OpenCode session continuing the same active goal and Packet 2
- **Phase Completed:** Baseline capture, foundations relocation, audit relocation, four-mode authored registry, typed command-subworkflow routing, focused verification
- **Handover Time:** 2026-07-26
- **Recent action**: Rendered this canonical handover after the first large hub-doctrine patch failed atomically; no source files changed from that failed patch
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision     | Rationale | Impact                 |
| ------------ | --------- | ---------------------- |
| Keep exactly four registered modes: `interface`, `motion`, `md-generator`, `design-mcp-open-design` | The approved topology separates top-level identity from durable command capability | `mode-registry.json`, `hub-router.json`, leaf and compiled-routing projections |
| Preserve foundations and audit as permanent `interface` command subworkflows | Public command behavior, procedures, corpora, reports, scoring, and verifiers must survive removal of peer mode identities | `design-interface/foundations/`, `design-interface/audit/`, command wrappers and assets |
| Transform both former nested `SKILL.md` files into non-identity `contract.md` files | The advisor must discover one `sk-design` identity with no nested foundations or audit skill | Relocated contracts and parent-hub identity checks |
| Keep `styles/` byte-identical | The topology change does not justify data, retrieval, or visual-style migration | Frozen 7,812-file SHA-256 manifest under `scratch/` |
| Extend downstream schemas instead of adding compatibility aliases | Permanent commands need typed ownership, not temporary hidden modes | `commandSubworkflows`, command metadata, command checker, parent-hub checker |
| Leave historical benchmark reports and archived evidence unchanged | Historical paths remain evidence, not live consumers | Final grep must classify rather than rewrite historical records |

### 2.2 Blockers Encountered
**Blockers**: No product or architecture decision is blocked. Spec Memory retrieval remains unavailable, the code graph is empty, and final completion gates are not yet run.

| Blocker     | Status          | Resolution/Workaround |
| ----------- | --------------- | --------------------- |
| `memory_match_triggers` and both final `memory_save` calls return `MCP error -32001: Request timed out` | Open, non-blocking for repository work | Use packet docs and direct filesystem evidence; retry indexing after daemon recovery |
| Code graph reports zero files/nodes/edges | Open, non-blocking for this document and path migration | Use Grep, Glob, direct reads, and deterministic package checkers |
| Large doctrine patch failed with `apply_patch verification failed: Failed to find expected lines in .opencode/skills/sk-design/SKILL.md: Canonical /interface:* commands resolve to the same stable mode IDs.` | Resolved as a safe halt; patch was atomic and changed no files | Re-read exact source sections and apply small, file-scoped patches rather than retrying the broad patch |
| Pre-change benchmark scored 95/100 with route-gold failures | Open and expected after topology contraction | Update final route gold for `TV-001.V2`, `TV-001.V3`, and `SR-002.P3`, then run a new benchmark without weakening other assertions |
| Local md-generator compiled dist was reported stale | Open | Run `npm run build` in `design-md-generator/backend` before final package verification |

### 2.3 Files Modified
**Key files**: `.opencode/skills/sk-design/mode-registry.json`, `.opencode/skills/sk-design/hub-router.json`, `.opencode/skills/sk-design/command-metadata.json`, `.opencode/skills/sk-design/leaf-manifest.json`, `.opencode/skills/sk-design/design-interface/{foundations,audit}/`, `.opencode/commands/interface/`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`

| File        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| `mode-registry.json` | Reduced to four mode rows and added typed `commandSubworkflows` for foundations and audit | Complete, focused checker green |
| `hub-router.json` | Set actual default to `interface`, reduced mode signals to four, added command-subworkflow signals and canonical ownership | Complete, parent checker green |
| `command-metadata.json` | Repointed foundations/audit commands to owner mode `interface` plus `commandSubworkflow` | In progress; four stale transform-remediation paths remain |
| `leaf-manifest.json` | Regenerated from source to four modes and exactly 69 interface leaves | Complete, byte-drift checker green |
| `design-interface/foundations/` | Relocated the complete foundations workflow, README, changelog, corpus, procedures, feature catalog, playbook, scripts, and non-identity contract | Complete relocation; live prose consumers still need path migration |
| `design-interface/audit/` | Relocated the complete audit workflow, README, changelog, corpus, procedures, feature catalog, playbook, scripts, reports, and non-identity contract | Complete relocation; live prose consumers still need path migration |
| `design-interface/references/{foundations,audit}/` | Relocated all routable reference leaves | Complete |
| `design-interface/assets/{foundations,audit}/` | Relocated all routable assets and fingerprint fixtures | Complete |
| `.opencode/commands/interface/{foundations,audit}.md` and assets | Preserved public commands while dispatching `workflowMode=interface` plus the named subworkflow | Complete, focused command gates green |
| `shared/scripts/design-command-surface-check.mjs` | Added command-subworkflow ownership, resource, choreography, and roster validation | Complete, 7/7 tests green |
| `shared/scripts/interface-command-contract.test.mjs` | Made canonical-command lookup robust after multiple commands share owner mode `interface` | Complete, 8/8 tests green |
| `parent-skill-check.cjs` | Added command-subworkflow extension and router-signal validation; retained downstream package invariants | Complete, package checker green with zero warnings |
| Root `SKILL.md`, `README.md`, `design-interface/SKILL.md`, shared docs, playbooks, feature catalogs | Still describe foundations/audit as peer modes or old paths in several live locations | In progress; broad attempted patch did not apply |
| Advisor metadata and compiled sk-design routing artifacts | Still need canonical regeneration from final authored topology | Pending |

### 2.4 Traps & Scar Tissue
Carry only what the next reader cannot re-derive: where a trap bit, what triggers it, and whether the guard is load-bearing or defensive. A green tree does not erase a trap.

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| ----------------- | -------------------- | -------------------------- | ------------------------- |
| Dirty branch contains Packet 1 and unrelated concurrent changes | Broad Git restore, checkout, reset, or repository-wide generated cleanup | Load-bearing | Never revert or normalize paths outside Packet 2 scope; inspect scoped diffs before every final claim |
| Empty retired peer directories survived file moves | Parent checker scans physical directories, not only tracked files | Defensive but required | Confirm directories are empty, then remove with `rmdir`; never use recursive deletion |
| Manifest generation initially leaves stale topology until canonical generator runs | Hand editing `leaf-manifest.json` or skipping byte-drift verification | Load-bearing | Always run `generate-leaf-manifest.cjs --write` and then parent-hub checker |
| Two commands now share `workflowMode=interface` | Tests look up command surfaces by mode alone | Load-bearing | Select command surfaces by canonical command id; keep subworkflow as a separate discriminator |
| Grep across all benchmark reports overflows output | Searching all historical JSON reports for old paths | Defensive | Search live authored trees separately and exclude benchmark reports, changelogs, archived specs, and frozen before-snapshots |
| Broad multi-file patch used prose that did not exactly match source | One stale expected line invalidates the whole atomic patch | Defensive | Read exact target sections, patch one file or one section at a time, and rerun focused checks after each group |
| Generated compiled-routing tree is concurrently dirty from Packet 1 | Treating all compiled-routing changes as Packet 2 output | Load-bearing | Regenerate only through the canonical sync path after authored sk-design consumers are final; review sk-design-scoped outputs only |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `.opencode/skills/sk-design/SKILL.md`, starting at `## 1. WHEN TO USE` and `## 2. SMART ROUTING`
- **Next safe action**: Re-read exact stale sections in the root hub, root README, `design-interface/SKILL.md`, and shared context-loading docs; apply small patches that describe four registered modes plus two permanent interface subworkflows
- **Cold-read order**: 1. `handover.md` -> 2. `implementation-summary.md` -> 3. `spec.md` requirements -> 4. `mode-registry.json` and `hub-router.json` -> 5. root and interface `SKILL.md`
- **Context:** Preserve the already-green topology and tests. The next work is consumer migration, not another relocation or registry redesign.

### 3.2 Priority Tasks Remaining
1. Migrate live hub/interface doctrine and resource paths in small batches; remove the four stale `command-metadata.json` audit paths and update smart-routing resource maps to interface-owned leaves.
2. Regenerate advisor metadata, leaf/routing projections, compiled sk-design fixtures, and activation metadata through canonical generators; classify final grep hits as live, generated, or historical.
3. Update final benchmark route gold, rebuild stale md-generator dist, run the full package/command/corpus/fingerprint/checker/benchmark/styles/strict-SpecKit matrix, then reconcile tasks and checklist evidence.

### 3.3 Critical Context to Load
- [x] Continuity target: this `handover.md` and the updated `_memory.continuity` block in `implementation-summary.md`
- [x] Spec file: `spec.md` Sections 3-5 and Requirements `REQ-001` through `REQ-012`
- [x] Plan file: `plan.md` Phases 4-5, Testing Strategy, and Rollback Plan
- [x] Architecture source: `decision-record.md`, especially the accepted four-mode command-subworkflow decision
- [x] Baseline evidence: `scratch/foundations-files.before.txt`, `scratch/audit-files.before.txt`, `scratch/styles.sha256.before`, and `scratch/benchmark-before/`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [ ] All in-progress work committed or stashed. Intentionally false: the user authorized work on dirty branch `skilled/v4.0.0.0`; no commit or push was requested.
- [x] Current context saved in this handover and `_memory.continuity` in `implementation-summary.md`.
- [ ] No breaking changes left mid-implementation. Intentionally false: authored docs and generated consumers still contain old paths, so the branch is not ready to consume or ship.
- [ ] Tests passing. Focused gates pass, but final benchmark, compiled-routing, styles equality, metadata, and strict packet gates remain pending.
- [x] This handover document is complete for the current in-progress boundary.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Confirmed Evidence

- Baseline inventory contains 48 foundations files, 70 audit files, and 7,812 tracked styles hash rows. The accounting target is 112 subordinate relocations plus two READMEs, two `SKILL.md` to `contract.md` transformations, and two changelogs.
- `generate-leaf-manifest.cjs --write` produced digest `764a4733339f086ac97b83b2347089479317dff54eff0a5df78b4dc0460ef3b0`.
- Final parent-hub check at this boundary: `OK: parent-skill-check - all hard invariants passed, 0 warnings`.
- Manifest projection: registered modes `design-mcp-open-design`, `interface`, `md-generator`, `motion`; interface leaves 69, foundations leaves 12, audit leaves 37.
- Direct command checker: `STATUS=VALID STAGE=complete`, `commands=5`, `aliases=15`, four workflow modes, `invalid=0`, `drift=0`.
- `interface-command-contract.test.mjs`: 8/8 pass.
- `design-command-surface-check.test.mjs`: 7/7 pass.
- Parent-checker leaf-manifest guard-chain test: 1/1 pass.
- Relocated foundations corpus and validators passed at 25/25; relocated audit corpus passed at 21/21; fingerprint registry passed at 10/10 and fixtures at 20/20.
- Focused md-generator Vitest baseline passed 2/2; styles build check reported 1,290 records with zero added, changed, or removed.

### Unfinished Evidence

- Final pre/post styles hash comparison has not run after all source migration work.
- Advisor metadata, compiled routing, route gold, benchmark, and activation metadata have not been regenerated from the final authored topology.
- Both direct indexing attempts timed out; the canonical files remained intact and strict validation passed afterward.
- The final no-live-old-path grep has not passed.
- `tasks.md`, `checklist.md`, and `implementation-summary.md` still need final evidence reconciliation after implementation finishes.
- Strict SpecKit validation for this new handover and summary must run now; completion validation must run again after all implementation work.

### Session Boundary

Packet 1 of the active goal, `.opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/007-fanout-synthesis-lineage-aggregation/`, was completed earlier in the same dirty branch. Its deep-research, compiled-contract, database, and runtime changes are outside Packet 2 cleanup scope. Do not revert or recategorize them while finishing sk-design.
<!-- /ANCHOR:session-notes -->

---
