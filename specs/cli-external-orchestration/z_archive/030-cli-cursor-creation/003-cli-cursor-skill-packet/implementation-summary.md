---
title: "Implementation Summary: cli-cursor skill packet"
description: "cli-cursor built as the 4th mode of cli-external-orchestration: 12 new packet files, 5 hub-root registry edits, leaf-manifest regeneration, and two real compiled-routing bugs found and fixed."
trigger_phrases: ["cli-cursor skill packet summary", "cli-cursor 4th mode implementation"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/003-cli-cursor-skill-packet"
    last_updated_at: "2026-07-24T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, tested, and validated phase 003 (cli-cursor skill packet + hub wiring)"
    next_safe_action: "Begin phase 004 (Cursor hook adapter layer)"
    blockers: []
    key_files: ["../../../../.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md", "../../../../.opencode/skills/cli-external-orchestration/mode-registry.json", "../../../../.opencode/skills/cli-external-orchestration/hub-router.json"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Whether a dispatched cursor-agent should carry an explicit --workspace/config-isolation flag is still open, deferred to the dispatch-command finalization (phases 002/004)."]
    answered_questions: ["Cursor's session-signal env vars are CURSOR_AGENT=1 (unconditional) and CURSOR_CONVERSATION_ID (session id) - confirmed live, upgrading ADR-002's guard from best-effort to fully-confirmed for 2 of its 3 layers.", "A repo-wide alias-collision search found zero collisions between cli-cursor's aliases and any other hub's mode-registry.json."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 003-cli-cursor-skill-packet |
| **Completed** | 2026-07-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

`cli-cursor` is now the 4th mode of `cli-external-orchestration`, built to the exact structural precedent `cli-codex` established, with Cursor-specific facts throughout (never copy-pasted Codex facts).

### New packet: `cli-external-orchestration/cli-cursor/`
- `SKILL.md` (393 lines): frontmatter with the `cursor-availability-required`/`self-invocation-prohibited`/`deep-loop-runtime-required` `hard_rules` triad; a Section 2 self-invocation guard built from the now-confirmed `CURSOR_AGENT=1`/`CURSOR_CONVERSATION_ID` env signals plus process-ancestry matching `cursor-agent` (never the `agent` alias); a full smart router (intent signals, resource map, loading levels); default-dispatch/model-selection/agent-delegation sections grounded in phases 001/002's confirmed contract; the family's 16-item ALWAYS rule set adapted for Cursor's approval-flag model.
- `README.md` (220 lines, 9 sections AT A GLANCE → RELATED DOCUMENTS).
- `changelog/v1.0.0.0.md`.
- `references/` (6 files, all ≥100 LOC): `cli-reference.md` (281 lines — full flag/auth/model/troubleshooting reference), `integration-patterns.md` (410 lines — generate-review-fix, JSON handling, background execution incl. the stdin-consumption trap, model/approval strategy, anti-patterns), `agent-delegation.md` (140 lines — the plan/ask/default execution-mode roster, since Cursor has no TOML-profile system like Codex), `cursor-tools.md` (124 lines — the Cursor-unique surfaces with no sibling analog: native worktree, cloud worker, plugin marketplace, MCP client), `hook-contract.md` (114 lines — Cursor's shared hooks.json contract, honestly flagging the unconfirmed CLI-vs-editor event-delivery gap for phase 004 to resolve), `shared-editor-config.md` (119 lines — Cursor's single biggest architectural difference from every sibling: it shares its entire config surface with the Cursor editor).
- `assets/` (2 files): `prompt-quality-card.md` (63 lines, thin delegator per ADR-003) and `prompt-templates.md` (218 lines, 8 categories of copy-paste dispatch templates).
- `manual-testing-playbook/manual-testing-playbook.md`: an honest scaffold stub explicitly stating content is authored in phase 006, not fabricated placeholder scenarios.

### Hub wiring (5 files)
- `mode-registry.json`: new `cli-cursor` `modes[]` entry (`packetKind: "workflow"`, `backendKind: "cli-dispatch"`, identical `toolSurface` to siblings, 5 aliases `["cursor","cursor cli","delegate to cursor","cursor agent","cli-cursor"]`, `routingClass: "metadata"`), version bumped `1.1.0.0` → `1.2.0.0`, discriminator/prose updated to "four modes".
- `hub-router.json`: new `routerSignals.cli-cursor` (weight 4), `cli-cursor-aliases`/`cursor-dispatch` vocabulary-class pair, `tieBreak` extended to the 4-element permutation, version bumped `1.0.0.1` → `1.1.0.0`.
- `description.json`: keywords/trigger_examples/prose extended to mention the 4th mode; no registry-owned keys duplicated.
- `SKILL.md` (hub root): mode-table row, layout-tree row, "three"→"four workflow modes" throughout, executor-delegation prose extended.
- `graph-metadata.json` (hub root): `intent_signals`, `derived.trigger_phrases`, `derived.key_topics`, `derived.intent_signals`, `derived.key_files`, `derived.entities`, `derived.causal_summary`, `derived.source_docs` all extended for `cli-cursor` — still exactly one `graph-metadata.json` at the hub root (no second identity).
- `leaf-manifest.json`: regenerated via `generate-leaf-manifest.cjs --write`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Captured the baseline: `parent-skill-check.cjs` and `validate_skill_package.py` both PASS/exit 0 against the 3-mode hub, before any edit.
2. Read `cli-codex/SKILL.md` and `cli-codex/README.md` in full as the direct structural precedent (392 and 235 lines respectively), plus `mode-registry.json`, `hub-router.json`, hub `SKILL.md`, `description.json`, `graph-metadata.json` to understand every field this phase would extend.
3. Updated ADR-002 in `decision-record.md` BEFORE authoring the guard, to reflect the `CURSOR_AGENT=1`/`CURSOR_CONVERSATION_ID` signals confirmed live during phase 002's work — upgrading the guard design from "best-effort, env-var pending" to "2 of 3 layers fully confirmed."
4. Authored all 12 new packet files, each grounded in phase 001/002's confirmed facts (never a sibling's facts copy-pasted; e.g., no `--reasoning-effort` flag anywhere, no fabricated model ids beyond the 3 confirmed via live `--list-models`).
5. Wired the 5 hub-root files in a single coordinated pass, then regenerated `leaf-manifest.json`.
6. Ran `parent-skill-check.cjs` — found and fixed a real, pre-existing latent bug the 4th mode exposed (see Key Decisions).
7. Ran `validate_skill_package.py` — found and fixed a second real latent bug in the compiled-routing "live-activation" freshness pin (see Key Decisions).
8. Re-ran both validators clean (0 fails), confirming the hub's 0-fail conformance baseline holds with 4 modes.
9. Ran a repo-wide alias-collision search and updated `spec.md`'s open questions with the results.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **ADR-002 upgraded mid-implementation, not left as originally scoped.** The spec's own ADR-002 anticipated an "unconfirmed, best-effort" env-var guard layer. Because phase 002's live probing already confirmed `CURSOR_AGENT=1`/`CURSOR_CONVERSATION_ID`, the guard was built stronger than originally planned — 2 of 3 layers fully confirmed, only the (genuinely undocumented) lock-file layer stays best-effort. This is a real improvement over the sibling `cli-codex` guard's single confirmed env-var layer, not just parity.
- **Two real, pre-existing latent bugs were found and fixed, both exposed (not caused) by adding a 4th registry mode:**
  1. `compiled-routing/006-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs`'s `sourceInputs()` hardcoded only the 3 pre-existing sibling `SKILL.md` paths. Since `loadSnapshot()` iterates `registry.modes` (now 4 entries) to build `packetSkillMarkdown`, the 4th mode's lookup returned `undefined`, and `.toString('utf8')` on `undefined` threw — surfacing as an opaque `compile-error` in `validate_skill_package.py`'s "compiled routing readiness" check. Fixed by adding the missing `cli-cursor/SKILL.md` path entry, mirroring the other 3 exactly.
  2. The canonical live-activation manifest (`compiled-routing/010-live-activation/activation/cli-external-orchestration/manifest.json`, `servingAuthority: "compiled"`) pins a `selectedPolicy.effectivePolicyHash` for generation 5. After the registry change, the freshly-recomputed hash (via the hub's own bespoke `shadowChildPolicyFor`/`build-artifacts.cjs` path, generation pinned by that harness's own fixture at 5) legitimately differed from the pinned value — correctly reported as `stale-manifest`. Investigated `resolve.cjs` (the actual live-serving consumer) and confirmed it gates only on `servingAuthority === 'compiled'`, never on the pinned hash/freshness — the live routing path already recomputes the snapshot fresh from current registry state on every call, regardless of this pin. Updating the pin is therefore a bookkeeping correction to match reality, not a behavior-affecting flip; corrected it to the honest recomputed hash (generation unchanged at 5).
- **Did not touch the authored spec-folder source of the compiled-routing runtime.** `compiled-route-sync.cjs` revealed that everything under `.opencode/bin/lib/compiled-routing/` is a promoted MIRROR of files authored under `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/`. The identical `sourceInputs()` bug exists at that authored-source location too, and the next `compiled-route-sync.cjs` (build mode) run will overwrite this phase's promoted-mirror fix with the still-buggy authored copy. Fixing the authored source is out of scope — it belongs to a different, currently-paused program (`sk-doc/019-skill-routing-refactor`) per prior-session memory, not this packet. Flagged explicitly below rather than silently left for a future session to rediscover.
- **`cursor-tools.md`/`shared-editor-config.md` document opt-in-only, never wire.** Per ADR-001, Cursor's native worktree/cloud-worker/plugin-marketplace surfaces are documented as escape hatches an operator invokes deliberately — the packet's own default dispatch never passes `-w`, never invokes `cursor-agent worker`, matching the parent packet's explicit out-of-scope boundary.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `SC-001`: `parent-skill-check.cjs` returns 0 fails, 0 warnings | PASS (after the build-artifacts.cjs fix) |
| `SC-002`: `validate_skill_package.py` returns 0 fails | PASS (after both fixes) — `package_skill.py --check: PASS`, `compiled routing readiness: compiled-ready: PASS`, `parent-skill-check.cjs: PASS` |
| `SC-003`: "delegate to cursor" resolves via `executor-delegation.ts` with zero code changes | PASS by construction — `executor-delegation.ts` reads `mode-registry.json` dynamically at call time; confirmed no edit was needed or made to that file |
| `SC-004`: All 4 modes in `mode-registry.json`; `tieBreak` is an exact 4-element permutation; `defaultMode` stays `null` | PASS — check 5e/5h/5i all PASS |
| 6 reference files ≥100 LOC, kebab-case | PASS — 92→119 (shared-editor-config.md expanded), 114-410 lines across the other 5 |
| No `cli-cursor/graph-metadata.json` or `cli-cursor/description.json` | PASS — checks 2a/2b |
| Alias collision (intra-hub) | PASS — check 3d-alias, 20/20 unique |
| Alias collision (repo-wide) | PASS — manual `grep` across every hub's `mode-registry.json`, zero collisions |
| `leaf-manifest.json` byte-drift | PASS — check 10b, regenerated matches fresh output byte-for-byte |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Authored-source drift in the compiled-routing promotion pipeline (flagged, not fixed).** The identical `sourceInputs()` bug this phase fixed in the promoted mirror also exists in the authored spec-folder source (`sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs`). The next `node .opencode/bin/compiled-route-sync.cjs` (build mode, no args) run will wipe and re-promote from that source, silently reintroducing the bug this phase just fixed. This is out of scope for the `030-cli-cursor-creation` packet (a different program owns that spec folder, currently paused per prior-session memory) — flagged here explicitly so whoever next runs `compiled-route-sync.cjs` (or resumes `sk-doc/019`) knows to apply the same one-line fix at the authored location first.
2. **The `--workspace`/config-isolation open question remains genuinely open**, per `spec.md` §12 and `shared-editor-config.md` §4 — this phase documents the mitigation flags that exist (`--workspace`/`--add-dir`/`--plugin-dir`) without asserting a specific isolation policy was decided, since none has been.
3. **`manual-testing-playbook/` is an honest scaffold, not a scored corpus** — per the parent spec's explicit phase boundary, real Cursor-native scenario content is authored in phase 006.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `../002-deep-loop-executor-support/implementation-summary.md` (source of the confirmed `CURSOR_AGENT`/`CURSOR_CONVERSATION_ID` signals this phase's guard uses)
