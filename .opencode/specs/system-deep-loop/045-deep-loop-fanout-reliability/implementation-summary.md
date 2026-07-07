---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Fan-out CLI lineages now fail when their subprocess fails, run concurrently up to the cap, honor per-lineage iteration caps, and never emit an out-of-enum service_tier; comment hygiene and the SKILL.md inventory are corrected."
trigger_phrases:
  - "fanout reliability summary"
  - "deep loop fanout outcome"
  - "fanout fix verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-deep-loop-fanout-reliability"
    last_updated_at: "2026-06-04T23:10:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped A1-A7 fixes, 12 new regression tests, all verification green"
    next_safe_action: "None remaining, phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts"
      - ".opencode/skills/system-code-graph/mcp_server/core/config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-013-001-deep-loop-fanout-reliability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A5 review sandbox default resolved: keep workspace-write because review writes iteration artifacts into lineageDir."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-deep-loop-fanout-reliability |
| **Completed** | 2026-06-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop fan-out runner now tells the truth about lineage outcomes. Before this change a lineage whose CLI exited non-zero or hit its timeout was counted as a success and the whole run exited 0; the pool also ran lineages one at a time even with a concurrency cap, ignored the per-lineage iteration cap, and pushed an out-of-enum `service_tier=default` onto the Codex CLI. All four behaviors are fixed in the worker and prompt without touching the shared pool primitive.

### Failures now fail (A1)

When a lineage's CLI exits non-zero or is killed by the timeout, the worker throws after the salvage sweep instead of returning a success object. The pool settles that throw as rejected, the orchestration summary records the failure, and the process exits 2 (some failed) or 3 (all failed). You get a real signal when a fan-out lineage breaks.

### Lineages run in parallel (A2)

The worker no longer blocks the Node thread on `spawnSync`. A new `runLineageProcess` helper wraps `child_process.spawn` in a Promise that resolves a spawnSync-shaped result, so the pool's K-in-flight cap actually overlaps lineages. Timeout-kill (SIGTERM), stdin input, environment, working directory, and the 20MB stdout cap are all preserved, so A1's timeout detection still fires.

### Iteration cap honored (A3)

A positive per-lineage `iterations` now threads `config.maxIterations` into the loop prompt and changes the stop instruction to "to convergence OR config.maxIterations, whichever comes first." When `iterations` is null the prompt omits the cap and keeps the plain "to convergence" wording. The timeout sizing stays as a backstop.

### Codex service_tier stays in-enum (A4)

The cli-codex dispatch now only emits `-c service_tier=<value>` when a validated tier is set; when unset it omits the pair entirely so the Codex CLI applies its own default, instead of injecting the literal `default` that is outside the `priority/standard/fast` enum.

### Review sandbox default documented (A5)

Review lineages keep workspace-write by default. Inspection of the deep-review loop confirmed review subprocesses write their own iteration artifacts (`iterations/iteration-NNN.md`, `deep-review-state.jsonl`, `review-report.md`, `resource-map.md`) into the lineage directory, so a read-only default would break them. The write boundary is enforced by the prompt, and the rationale is now captured in a code comment at the resolve block.

### Docs and comment hygiene (A6, A7)

SKILL.md now reports the real `scripts/` inventory (8 `.cjs` files) and names the fan-out entry points. Perishable phase / ADR / packet labels were stripped from code comments in `code-graph-tools.ts`, `core/config.ts`, and `fanout-pool.cjs` (both occurrences), keeping the durable WHY.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs | Modified | A1 throw-on-failure, A2 async spawn helper + worker swap, A3 iteration cap, A4 service_tier omission, A5 sandbox note |
| .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs | Modified | A7 comment hygiene (two packet labels) |
| .opencode/skills/deep-loop-runtime/SKILL.md | Modified | A6 script count + fan-out entry points |
| .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts | Modified | 12 regression cases + hardened existing assertion |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts | Modified | A7 comment hygiene (SLOT placeholders) |
| .opencode/skills/system-code-graph/mcp_server/core/config.ts | Modified | A7 comment hygiene (ADR ids) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The four worker-region fixes were sequenced A1, A2, A4, A5 to avoid edit collisions on the same spawn block, with A3, A6, and A7 done independently. Verification ran the three named vitest suites from `system-spec-kit/mcp_server`, a `tsc --noEmit` typecheck for code-graph, and a grep proving the comment-hygiene labels are gone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route failures by throwing from the worker, not by editing buildPoolSummary | The pool primitive is shared with the council dispatcher and contract-tested, so its fulfilled/rejected semantics had to stay frozen |
| Keep salvage sweep before the throw | Iteration recovery from captured stdout must not be lost when a lineage fails |
| Keep workspace-write for review lineages and document instead of forcing read-only | Review subprocesses write their own iteration artifacts into lineageDir, so read-only would break legitimate writes |
| Neutralize (not delete) the code-graph SLOT placeholders | Future hld/lld, trace, and impact handlers may use them as anchors; the perishable phase/spec labels were the only problem |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` fanout-run.cjs and fanout-pool.cjs | PASS |
| Vitest fanout-run + fanout-pool + cli-matrix (from system-spec-kit/mcp_server) | PASS, 29 tests across 3 suites (12 new) |
| `tsc --noEmit` for system-code-graph/mcp_server | PASS, exit 0 |
| Grep `PHASE-0\|ADR-0\|packet-1\|027/00` on the three A7 files | PASS, zero hits |
| `ls scripts/*.cjs \| wc -l` matches SKILL.md count | PASS, 8 files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A3 prompt cap depends on the loop honoring `config.maxIterations`.** The fan-out runner now passes the cap, and the deep-research/deep-review loops hard-stop on `maxIterations`. If a future loop renames that config key, the prompt line would become inert and need updating.
2. **A5 write boundary is prompt-enforced, not sandbox-enforced.** A path-scoped workspace-write (writes only inside lineageDir) would be a stronger boundary, but the CLIs do not expose one today; the current default stays workspace-write with the boundary in the prompt.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
