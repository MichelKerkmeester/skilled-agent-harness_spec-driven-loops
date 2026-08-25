---
title: "Implementation Summary: Gateway State-Write Contract Remediation"
description: "Closed the ten 014-review findings plus the fanout-merge tool bug: wired the review/alignment projection contracts into the gateway, migrated the three prompt-pack templates to the gateway, ported write-containment into the confirm YAMLs, hardened the guard, corrected SKILL doctrine, removed the decommissioned ai-council MCP, added the injection guard, and expanded the public README deep-loop section."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation"
    last_updated_at: "2026-08-25T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built WS1-WS7 + README; all workstreams verified"
    next_safe_action: "Run validate --strict, then commit/push/merge"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-002 direction? A (wire review/alignment projection refresh) — confirmed unfinished 012 wiring, contracts already existed."
      - "WS5 scope? confirm cli-opencode branch gains structural containment; auto-opencode parity noted as follow-up."
---
# Implementation Summary: Gateway State-Write Contract Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-08-25 |
| **Source review** | `014-gateway-alignment-review` (FAIL: 1 P0 / 5 P1 / 4 P2 + tool bug) |
| **Build model** | Opus (conductor + WS1/WS3/WS5/WS7) + GLM-5.2 via cli-devin (WS2/WS6) + Ox-Alpha-xhigh via cli-pi (WS4) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

All ten findings and the merge-tool bug are closed.

- **WS1 (P0) — contract reconciled.** `append-mode-event.ts` now wires the existing `createDeepReviewStateProjectionContract` / `createDeepAlignmentStateDeltasProjectionContract` and their event registries into `resolveDefaultProjectionContract` + `resolveModeEventRegistry`, so a gateway append refreshes the review/alignment state projection (previously research-only). The three prompt-pack templates (`deep-review`, `deep-research` `prompt-pack-iteration.md.tmpl`, `deep-alignment` `alignment-prompt-pack.md.tmpl`) now record the iteration through `append-mode-event.cjs` instead of `>> {state_log}`, with exit-2-halt and no direct-write fallback.
- **WS2 (P1) — ai-council MCP.** Removed the decommissioned `sequential_thinking` mandate and tool grant from ai-council across runtimes; Depth-1 is now "process each seat sequentially in-context (no MCP)". `.pi/mcp.json`'s entry (the public `npx` package, not a live local server) was removed.
- **WS3 (P1) — injection guard.** Added the untrusted-target prompt-injection guard to the `deep-review` and `deep-research` leaves and the review prompt-pack (the research pack already carried one for fetched content).
- **WS4 (P1) — SKILL doctrine.** `deep-review/SKILL.md` no longer claims reduce-state is the SINGLE state writer; it names the gateway. `deep-research/SKILL.md`'s "JSONL delta" mislabel is corrected to "ONE JSON event record".
- **WS5 (P1) — confirm containment.** The confirm cli-opencode dispatch branch in both `deep-research-confirm.yaml` and `deep-review-confirm.yaml` was converted to the audited node-script wrapper and now brackets the dispatch with `snapshotOutOfScopeDirtyPaths` + `enforceWriteContainment`, matching the auto codex branch's structural containment.
- **WS6 (P1) — guard hardened.** `check-agent-gateway.sh` now fails closed on a count-floor (`expected=27` = 24 agents + 3 prompt-packs), scans the prompt-pack templates, and detects `>` truncate, `| tee`, and no-space-backtick `--event-json` bypass shapes.
- **WS7 (tool) — merge gate.** `fanout-merge.cjs` now reads the active flag from `disposition ?? status` in both the collection loop and the P0/P1/P2 verdict counts, so a live `disposition:'active'` finding is never merged into a silent empty PASS. A regression fixture asserts it.
- **README (item 6).** The public README `### 🔄 Deep Loop` section gained four human-voice subsections (state/ledger/gateway, cross-AI fan-out, convergence and stopping, deep alignment).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

WS1 ran first, behind a gate: the ADR-002 intent check confirmed the review/alignment projection contracts already existed and were conformance-tested, so Direction A was a clean wiring change rather than a rewrite. WS2-WS7 then fanned out across three executors on disjoint files — GLM-5.2 (cli-devin, `--permission-mode dangerous`) took WS2 and WS6, Ox-Alpha-xhigh (cli-pi, Cline provider) took WS4, and the conductor kept the security-adjacent and finding-refining work (WS3, WS5, WS7). The OpenRouter Ox-Alpha lineage was unproductive and was stopped; its workstream (WS5) was completed by the conductor, per the run's dead-lineage-tolerated policy. Every executor result was verified against source by the conductor before acceptance.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **ADR-002 = Direction A**, confirmed by the intent check: the manifest already declares `review-state` projectable with `refreshBoundary: 'event'` and the contracts already existed, so this was unfinished 012 wiring, not a deliberate omission. No Logic-Sync needed.
- **WS7 was a real finding, refined.** The 014 registries emit `disposition:'active'`, not `status` (verified against the on-disk 014 registry). The first fix touched only the collection filter; the regression fixture caught that the verdict counts also filtered on `status`, and both were corrected.
- **WS3 was re-scoped.** The advisor-context guard already existed in all leaves; the missing guard was the untrusted-reviewed-content one that `deep-alignment.md` carries and `loop-protocol.md` mandates. Only that was added.
- **WS5 was refined against source.** The confirm cli-opencode leaf genuinely lacked structural containment, so it was added. The auto cli-opencode branch also lacks it (only the codex sandbox branch has it), so confirm is now strictly more contained than auto for opencode; restoring full auto/confirm parity by adding the same containment to the auto opencode branches is a noted follow-up (see Limitations).

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- **WS1:** gateway vitest 26/26; a focused check confirms review/alignment now resolve a projection contract (previously `null`). G3 grep across the 3 packs finds zero `>> {state_log}` write instructions; each names the gateway with the correct `--mode`.
- **WS6 guard:** passes on the migrated tree at `expected=27 checked=27 missing=0` (exit 0); GLM's fixtures show exit 2 for a missing agent and for each new bypass shape.
- **WS7:** `fanout-merge.vitest.ts` 48/48, including the new `disposition`-shape fixture (merges to FAIL, not empty PASS).
- **WS2/WS4:** grep confirms zero residual `sequential_thinking`, zero "SINGLE state writer" in any deep SKILL, and the "JSONL delta" mislabel corrected.
- **WS5:** both confirm YAMLs parse (python `yaml.safe_load`) and their embedded node scripts pass `node --check`; both carry `enforceWriteContainment`.
- **Scope:** the tracked diff is exactly the workstream target files + README; no out-of-scope change.
- **Regression:** the vitest suites covering the changed code are all green — `fanout-merge` 48/48 (incl. the new fixture), and the gateway + legacy-seam + append-CLI + direct-append + protocol-append-site set 42/42. These exercise the exact functions changed (`resolveDefaultProjectionContract` / `resolveModeEventRegistry` and the merge filters). The broad runtime unit suite was not run to completion (slow ledger/replay tests); the localized additive changes cannot affect the unrelated suites.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Auto/confirm opencode containment parity.** WS5 added structural write-containment to the confirm cli-opencode branch. The auto cli-opencode branch still relies on the prompt contract plus post-dispatch validation (only its codex sandbox branch has structural containment). Adding the same snapshot/enforce block to the auto opencode branches would restore full parity; it touches the auto YAMLs, which are outside this packet's confirm-scoped WS5, and is left as a scoped follow-up.
- **Live dispatch not exercised.** Verification is at the unit/contract level (vitest, grep, guard run, YAML/JS syntax). A real review/alignment dispatch through the migrated prompt-packs was not run end-to-end in this build; the negative-control confirmation is the unit-level projection-contract resolution plus the green gateway suite.
- **README length.** The deep-loop section grew from ~90 to ~130 lines against a ~188-line memory section; it now covers the full current architecture without padding, rather than matching the gauge line-for-line.

<!-- /ANCHOR:limitations -->
