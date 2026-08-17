---
title: "Follow-ups: Command-Surface Root ROUTER.md Awareness"
description: "Two latent items found during the 031 remediation, intentionally left out of program scope for a later pass."
trigger_phrases:
  - "router awareness follow-ups"
  - "smart_routing underscore stale comments"
  - "sk-prompt system-deep-loop stale manifest"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: notes | v1.0 -->

# Follow-ups: Command-Surface Root `ROUTER.md` Awareness

These two items surfaced during the 031 remediation but were out of its scope. Neither is a regression from that work. Captured here so they are not lost.

## FU-1 — Stale `smart_routing.md` (underscore) comments in the deep-alignment sk-code adapter (LOW, docs) — DONE (commit fb54a91437)

Fixed: the three comments now reference `sk-code/ROUTER.md`; `grep -c smart_routing.md` on the adapter = 0; `node --check` passes. (Done directly — the deepseek-flash gateway returned two empty sessions for this trivial fix; noted as a reliability observation.)

### Original finding


- **File:** `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` lines 131, 134, 195.
- **What:** Three CODE COMMENTS reference `smart_routing.md` (underscore variant) — e.g. `smart_routing.md's machine-readable MOTION_DEV keyword list`, `smart_routing.md §5`. That file never existed under the underscore name and the content it describes now lives in `sk-code/ROUTER.md` (the hub-root router; machine block preserved verbatim).
- **Why deferred:** comment-only, zero functional impact; the sibling hyphen-name citations were already fixed in Phase 3, and `.cjs` edits were outside that documentation pass. Found and disclosed by the Phase 3 deepseek-flash agent.
- **Fix:** repoint the three comments to `sk-code/ROUTER.md` (durable-WHY wording; do not embed spec paths/ids per comment hygiene).
- **Verify:** `grep -n "smart_routing" .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` shows no `smart_routing.md` reference.

## FU-2 — Two hubs legacy-serving with stale compiled manifests — TRACKED in packet `022-legacy-hub-compiled-routing-refresh`

> A dedicated Level-2 planning packet now owns this work: `../019-skill-routing-refactor/015-router-unification-program/022-legacy-hub-compiled-routing-refresh/` (Status: Planned). The finding below is preserved for context.


- **Observed:** `node .opencode/bin/compiled-route-status.cjs --all` reports `sk-prompt` and `system-deep-loop` as `servingAuthority: legacy`, `fresh: false`, `causeCode: stale-manifest`; the other five hubs are `compiled` / `fresh`.
- **Why deferred:** pre-existing and unrelated to 031 — this session only touched sk-doc's routing (via the Phase 4 template rename), and sk-doc stays `compiled` / `fresh`. Renaming did not cause the sk-prompt / system-deep-loop state.
- **Rebuild attempted (2026-08-16) and HALTED — not safely completable in this worktree:**
  - Owner harnesses live at `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/{005-sk-prompt,002-system-deep-loop}/harness/build-artifacts.cjs` (they compile from each hub's authored `ROUTER.md`).
  - `sk-prompt` rebuilt cleanly — its `effectivePolicyHash` matched the target `currentPolicyHash` `19ffb85d…`.
  - `system-deep-loop` build-artifacts CRASHED: `ENOENT .../002-system-deep-loop/activation/manifest.prior.json` (harness line 234 reads a prior activation manifest it never creates; sk-prompt's harness creates its own, system-deep-loop's does not). No such file exists on this branch.
  - The activation-manifest state under `013-live-activation/activation/` is untracked / runtime-generated (0 git-tracked files) and incomplete here; `manifest.prior.json` is not equal to the live-serving manifest, so it cannot be safely seeded. The full refresh + `compiled-route-sync` promote + canary pipeline (high routing-runtime blast radius) cannot run cleanly.
  - Partial rebuild artifacts were reverted; worktree restored to baseline, `compiled-route-status` unchanged (5/7 compiled, 2/7 legacy), no runtime mutation left behind.
- **Recommendation:** run this rebuild inside the 015 router-unification program's compiled-routing environment, which holds the complete activation state + retained-rollback closure and the canary/promote/verify flow; fix the `system-deep-loop` owner harness's missing prior-manifest creation first. Confirm the frozen replay/scorer digests stay untouched throughout.
- **Verify (when done there):** `compiled-route-status.cjs --all` reports all seven hubs `compiled` / `fresh`, or a decision record documents intentional legacy-serving for those two.

## FU-3 — Root ROUTER.md prose-structure drift + no enforcement — DONE (main `3530c221e7`, v4 `1cbe3b2ec5`)

Four class-H hubs had drifted from the canonical root-ROUTER.md section shape the conformant hubs (sk-code, sk-design, sk-prompt) carry: OVERVIEW → INTENT MODEL → MACHINE-READABLE ROUTER → HOW TO READ. sk-doc had lost both OVERVIEW and INTENT MODEL and mis-numbered its sections; cli-external-orchestration, mcp-tooling, and system-deep-loop each lacked OVERVIEW.

- **Root cause:** the parent-skill root-router authoring template never prescribed the prose sections, and `root-router-contract.cjs` validated only the machine block (RRC-001..008), so the drift was invisible to the fleet gate.
- **Fix (landed on both branches):** added the missing OVERVIEW / INTENT MODEL sections and renumbered the four hubs (every frozen python machine block byte-identical); restructured the authoring template to lead with the four canonical sections (two-state guidance folded into the machine-readable section); added `RRC-009` so an active router missing OVERVIEW or INTENT MODEL now fails the fleet gate (stage1-only stubs exempt; heading match tolerates section numbers and leading glyphs) + a negative test.
- **Executor:** hub/template prose authored by GLM-5.2 via cli-devin; contract enforcement, verification, and the machine-block byte-identity guard by the orchestrator.
- **Verify:** `ci-skill-root-metadata.cjs` exit 0 (checked=13 passed=13); `root-router-contract.test.cjs` exit 0 (RRC-009 negative test included); all four hub machine blocks byte-identical pre/post.
