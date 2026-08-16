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

## FU-1 — Stale `smart_routing.md` (underscore) comments in the deep-alignment sk-code adapter (LOW, docs)

- **File:** `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` lines 131, 134, 195.
- **What:** Three CODE COMMENTS reference `smart_routing.md` (underscore variant) — e.g. `smart_routing.md's machine-readable MOTION_DEV keyword list`, `smart_routing.md §5`. That file never existed under the underscore name and the content it describes now lives in `sk-code/ROUTER.md` (the hub-root router; machine block preserved verbatim).
- **Why deferred:** comment-only, zero functional impact; the sibling hyphen-name citations were already fixed in Phase 3, and `.cjs` edits were outside that documentation pass. Found and disclosed by the Phase 3 deepseek-flash agent.
- **Fix:** repoint the three comments to `sk-code/ROUTER.md` (durable-WHY wording; do not embed spec paths/ids per comment hygiene).
- **Verify:** `grep -n "smart_routing" .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` shows no `smart_routing.md` reference.

## FU-2 — Two hubs legacy-serving with stale compiled manifests (INVESTIGATE)

- **Observed:** `node .opencode/bin/compiled-route-status.cjs --all` reports `sk-prompt` and `system-deep-loop` as `servingAuthority: legacy`, `fresh: false`, `causeCode: stale-manifest`; the other five hubs are `compiled` / `fresh`.
- **Why deferred:** pre-existing and unrelated to 031 — this session only touched sk-doc's routing (via the Phase 4 template rename), and sk-doc stays `compiled` / `fresh`. Renaming did not cause the sk-prompt / system-deep-loop state.
- **Fix (pending investigation):** determine whether the two hubs are intentionally legacy-serving or should be re-promoted; if the latter, rebuild their compiled routing through their owner harness and re-run the seven-canary / compiled-serving status (the same machinery used by the 015 router-unification program). Confirm the frozen replay/scorer digests stay untouched.
- **Verify:** `compiled-route-status.cjs --all` reports all seven hubs `compiled` / `fresh`, or a decision record documents intentional legacy-serving for those two.
