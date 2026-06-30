---
title: "Implementation Summary: Implement the improvement-research findings (make C-plus real + hardening)"
description: "Phase 004 of the parent-nested-skill-pattern epic: made the C-plus routing guarantee real (CI gate + /doctor advisor-sync coverage), gave deep-loop-runtime its own dependency manifest with zero system-spec-kit/node_modules reach-ins, unified loop-locking across the four graph-backed modes, landed P2 hardening, and restored the canonical + skill-benchmark suites to green at HEAD. Only the deliberately-deferred registry codegen remains."
trigger_phrases:
  - "improvement research findings implemented"
  - "C-plus made real CI advisor-sync"
  - "deep-loop runtime self-contained loop-lock complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/004-improvement-implementation"
    last_updated_at: "2026-06-15T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented findings across 4 clusters; greened suites at HEAD"
    next_safe_action: "Track the registry codegen follow-on; close out"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/skills/deep-loop-runtime/package.json"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-004-improvement-implementation-implementation-summary"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Codegen the projection maps from the registry (P1) — staged as a follow-on; A3+A4 already make drift reliably caught"
    answered_questions:
      - "Codegen the maps now or guard them? (Guard now via CI drift-catching; codegen deferred so the advisor never reads the registry at runtime)"
---
# Implementation Summary: Implement the improvement-research findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 004 of the parent-nested-skill-pattern epic |
| **Status** | Complete (one deliberate follow-on deferred) |
| **Date** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Depends on** | `../improvement-research/improvement-research.md`, `../001-rename-fix-and-shared-decision` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The 5-iteration improvement research judged the deep-loop architecture SOUND, so this phase implemented its actionable findings rather than rearchitecting anything. The headline: the "C-plus" routing guarantee is now REAL. It previously existed only as a drift-guard test that nothing ran, so the hardcoded advisor projection maps could silently diverge from `mode-registry.json`. The work split into four independent clusters plus the orchestrator, landed across six commits.

### Cluster A — making C-plus real

A PR-triggered CI workflow (`.github/workflows/routing-registry-drift.yml`) now runs the routing drift-guard, the parity suites, and `/doctor:parent-skill` on every PR, so a divergence between the advisor maps and the registry fails CI instead of shipping. Alongside it, `commands/doctor/scripts/parent-skill-check.cjs` gained an advisor-sync coverage check: check 4b asserts the canonical skill's `advisorRouting` matches the map exactly, and check 4c emits a coverage WARN (not a failure) when a non-canonical lexical mode's `legacyAdvisorId` is absent from the advisor map — surfacing the inert-routing gap a second parent skill would otherwise hide. This is finding #1 and finding #2 (`b08346a9bc`).

### Cluster B — runtime self-containment

`deep-loop-runtime` was "MCP-free in name but parasitic on `system-spec-kit`'s node_modules." This cluster replaced 12 reach-ins with bare specifiers: 5 library `.ts` files now import `zod` / `better-sqlite3` directly, and 7 scripts swapped a hardcoded `path.resolve(...system-spec-kit/node_modules/tsx...)` tsx-loader for `require.resolve('tsx')`. The runtime now ships its own `package.json` (force-added past the local-only `.opencode/.gitignore`, with better-sqlite3 12.10.0 / zod 4.4.3 / tsx 4.21.0 pinned to match `system-spec-kit` for native-binding ABI safety), plus `package-lock.json`, a standalone `vitest.config.ts`, and a `dependency-seams.vitest.ts` guard. This is finding #4 (`07fda483b8`).

### Cluster C — loop-lock unification

Research, review, and ai-council now acquire a real lock through the promoted `deep-loop-runtime/scripts/loop-lock.cjs` instead of relying on prose-only or missing locking. The stale-lock reclaim path is race-safe via an atomic rename in `tryReclaimStaleLoopLock` (single winner), and `fanout-merge.cjs` now writes atomically. This is finding #5, landed with Cluster D in a single 20-file commit (`3b60619fd5`).

### Cluster D — hardening

The same commit added the low-regret P2 items: a lifecycle-taxonomy drift-guard plus a `userPaused` 7th stopReason reconcile, an advisory benchmark mode-precision signal, the stale `@deep-ai-council`→`@ai-council` documentation fix, and a `runtime_capabilities` conformance test.

### Verification-phase repairs

Three follow-up commits greened the tree at HEAD. The CI gate originally ran `npm ci` in `system-skill-advisor/mcp_server`, but that manifest is untracked and pulls a `file:` sibling plus `@huggingface/transformers` and native better-sqlite3 — a fresh CI clone would fail on install — so it was rewritten to `npx --yes vitest@4.1.6` + `actions/setup-python` against the verified dependency-free routing surface (`71a066c004`). The 152→155 folder rename had left 4 runtime references pointing at renamed-away paths (graph-metadata derived edges and three vitest fixtures); they were repointed (`808b746366`). Finally, the 152 merge had nested `deep-improvement` one level deeper, breaking skills-root depth resolution in 5 files; that was fixed (SKILLS_DIR up-3→up-4, REPO_SKILLS up-1→up-2), the deep-improvement e2e test was pointed at its `agent-improve-001` fixture via `--fixtures-dir`, and 3 stale parser anchors were refreshed after the sk-code playbook grew 24→28 scenarios (`216e9448d8`).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The four clusters ran in parallel — Clusters B, C, and D as worktree agents against the orchestrator's Cluster A — because each is independent and individually reversible via `git restore`. The orchestrator integrated and verified after each landed. Cluster B carried an explicit "revert + report if infeasible" mandate so a native-binding ABI mismatch would not ship a half-working runtime. Confidence came from running the full `deep-loop-runtime` suite (349/349), a clean `npm ci`, the routing drift-guard and parity suites, and the skill-benchmark Lane C suite end-to-end after each change rather than trusting per-cluster claims.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lightweight CI (`npx vitest` + `setup-python`) over heavy `npm ci` | Chose it because the routing surface is verified dependency-free; `npm ci` would force a broad manifest-tracking convention change plus heavy native/ML downloads for no coverage gain. |
| Keep the hardcoded projection maps + a CI drift-guard rather than codegen now | Chose the guard because the advisor must not read the registry at runtime (avoids cross-skill coupling); codegen (#3) is deferred as a tracked follow-on. |
| Strengthen `dependency-seams` to catch the `.cjs` `path.resolve(...)` array form | Chose it because that form had hidden the 2 Cluster-C reach-ins; catching only the `.ts` contiguous path left a real blind spot. |
| Force-add `deep-loop-runtime/package.json` past `.opencode/.gitignore` | Chose it mirroring the `system-spec-kit/mcp_server` precedent because the manifest must be tracked or CI cannot install it. |
| Re-anchor the sk-code playbook counts rather than treat them as out-of-scope | Chose it because they are the benchmark's OWN regression anchors and the drift was confirmed real by running the parser. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- `deep-loop-runtime` standalone suite: **349/349** pass (standalone `vitest.config.ts`).
- Canonical `system-spec-kit/mcp_server` config: green on the changed-import tests (**17** tests).
- `npm ci` clean (**88** pkgs); zero `system-spec-kit/node_modules` reach-ins (both the `.ts` contiguous and `.cjs` `path.resolve(...)` array forms); deps resolve from the runtime's own node_modules at pinned versions.
- The 3 tsx-boot `.cjs` scripts run end-to-end after `require.resolve('tsx')`.
- Routing drift-guard + parity: **19/19**; `parent-skill-check.cjs` all invariants pass, **0** warnings; workflow YAML valid.
- skill-benchmark Lane C: **71/71** (was 22 failed before the depth-resolution + e2e-fixture + parser-anchor repairs).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` — run at close-out this turn.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The registry codegen (#3, the i01 top pick) is deferred.** The projection maps are still hand-maintained; the CI gate (A4) and the advisor-sync coverage check (A3) make any drift reliably caught, so the codegen is a low-urgency follow-on rather than a gap. It must byte-match the current maps, which is why it was staged for careful separate work.
- **The advisor-sync coverage for non-canonical lexical modes is a WARN, not a failure.** A scaffolded second parent skill with a lexical mode whose `legacyAdvisorId` is absent from the advisor map is structurally valid (exit 0) with advisor-wiring pending; only the canonical skill asserts exact equality.
- **CI exercises the routing surface, not the full advisor install.** The lightweight gate is justified by that surface being dependency-free; it does not stand up the `system-skill-advisor` MCP server.

<!-- /ANCHOR:limitations -->
