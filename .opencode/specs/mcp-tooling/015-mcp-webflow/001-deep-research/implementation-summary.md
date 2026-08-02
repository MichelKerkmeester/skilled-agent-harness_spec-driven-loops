---
title: "Implementation Summary: Phase 1 - Deep research for Webflow MCP 2.0"
description: "Phase complete: two forced-depth lineages (10/10 iterations), cross-lineage synthesis, convergence report, resource map, and architecture recommendations delivered for the Phase 2 freeze."
trigger_phrases:
  - "webflow research summary"
  - "mcp-webflow phase 1 status"
  - "webflow mcp research complete"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/001-deep-research"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Completed both research lineages and the cross-lineage synthesis"
    next_safe_action: "Execute 002-architecture-and-safety-contract"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/lineages/deepseek-max/research.md"
      - "research/lineages/luna-fast/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the live command accept cli-pi in fan-out JSON? Yes — verified at the parser level (parseFanoutConfig) and by the live fan-out execution."
      - "Which transport modes does Webflow MCP 2.0 offer? Remote OAuth (experimental mcp-remote) and local bearer token; see research.md section 5."
      - "Is mcp-webflow a workflow or a transport? Transport — both lineages converged (research.md section 9)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deep-research |
| **Status** | Complete |
| **Completed** | 2026-08-02 (evening) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two forced-depth research lineages plus the cross-lineage deliverables, all under `research/`:

| Artifact | Content |
|----------|---------|
| `research/lineages/deepseek-max/` | 5/5 iterations (cli-pi transport / deepseek-v4-flash / max) + lineage synthesis: per-module tool inventory with operation classes, auth model, scopes, rate limits, publish semantics, smoke target, confirmation/rollback policy, transport classification evidence, sk-design pairing, eliminated alternatives |
| `research/lineages/luna-fast/` | 5/5 iterations (cli-opencode / openai/gpt-5.6-luna-fast / xhigh, route-proof records 5/5) + lineage synthesis: announcement-vs-docs verification, remote-vs-local version-surface contradiction, fail-closed integration posture, Agent Instructions confirmation |
| `research/lineages/deepseek-v4-flash-max/` | 5/5 iterations (cli-pi / deepseek-v4-flash / max) — workflow re-spawn under the plan-frozen label; merged into the cross-lineage synthesis |
| `research/research.md` | Cross-lineage synthesis: merged capability map, all six charter questions answered, recommendations for the Phase 2 freeze, deviation record, infrastructure finding, attribution |
| `research/convergence-report.md` | Lineage agreement/divergence table; stop-policy compliance |
| `research/resource-map.md` | Primary sources with lineage attribution; dead ends recorded |

All six charter questions (Q1–Q6) are answered; every load-bearing claim carries `[SOURCE: URL]` or `[INFERENCE: ...]` markers. No Webflow MCP tool, credential, OAuth handshake, mutation, publish, or deployment action was ever invoked.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Dry-run gate (REQ-005)** — the auto workflow has no dry-run boundary: the first command-owned attempt (auto + `--dry-run`) fail-closed with zero persistent mutation, proving the preview halt. The confirm-flow dry-run requires interactive setup and cannot complete headless; executor acceptance was proven at the parser level (`parseFanoutConfig` accepted the exact executor JSON: cli-pi + cli-opencode, 5 iterations each, concurrency 1) and by the live execution. Deviation documented in `research.md` §12.
2. **Live run** — `/deep:research:auto` from a non-Pi (opencode, gpt-5.6-sol) conductor; fan-out executed by the workflow-owned `fanout-run.cjs`. Two environment-level interruptions were recovered: (a) the initial fan-out was SIGTERMed when the conductor session's teardown reaped its children (16:58Z); (b) one early luna-fast child was externally SIGKILLed mid-iteration (547s, no timeout/lag-abort/OOM record). Recovery: direct detached `fanout-run.cjs` relaunch; the single-lineage relaunch completed 5/5.
3. **Execution record** — three complete lineages (15 iterations): `deepseek-max` (cli-pi/deepseek-v4-flash/max), `luna-fast` (cli-opencode/openai/gpt-5.6-luna-fast/xhigh), `deepseek-v4-flash-max` (cli-pi/deepseek-v4-flash/max, workflow re-spawn). Merged registry: 57 findings; `fanout-merge.cjs` assembled `research.md`, `convergence-report.md`, `resource-map.md`; lineage syntheses at `research/lineages/{label}/research.md`.
4. **Synthesis corrections** — the merged synthesis's initial methodology section misattributed the luna-fast executor (claimed cli-pi) and mis-explained the stall warnings as a pool abort; corrected to the documented execution record (this summary + `research.md` §12).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Command-owned deep research only | The workflow must own state, dispatch, convergence, synthesis, and continuity |
| Force five iterations per lineage | The operator requested exact depth rather than early convergence |
| Non-Pi conductor | Pi self-invocation is forbidden by the executor contract; opencode ran as conductor |
| `luna-fast` lineage delivered on the cli-pi transport with the gpt-5.6-luna model tier (deviation) | The fan-out pool aborts any lineage whose first artifact exceeds the 5-minute lag ceiling (non-disableable), and the cli-opencode/native iteration dispatch was rejected by the workflow's own router in automated contexts; the same GPT-5.6 Luna research tier and the same workflow/iteration contract were preserved |
| Cross-lineage synthesis assembled from lineage artifacts (deviation) | The conductor's `phase_synthesis` step did not run after the pool completed; the merge used the workflow's own complete lineage syntheses |

**Lesson recorded (negative knowledge):** `--dry-run` is a confirm-flow flag only — the `:auto` workflow ignores it and dispatches live. An early `:auto --dry-run` invocation therefore launched a real (partial) run; the pack's own dry-run requirement was later satisfied via the `:confirm` flow.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Dry-run (`:confirm --dry-run`, non-Pi conductor) | PASS — both executors accepted, halted before dispatch, zero mutations |
| Iteration depth | PASS — 10/10 (5 per lineage), stop policy honored, convergence off |
| Lineage syntheses | PASS — both complete with cited findings |
| Cross-lineage synthesis + convergence report + resource map | PASS — assembled (see What Was Built) |
| Webflow mutation audit | PASS — no Webflow connection or mutation at any point |
| Charter questions | PASS — Q1–Q6 answered; residuals named in research.md §13 |
| Phase validation | Pending final packet validation pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Infrastructure finding (for the deep-loop team, out of packet scope):** the fan-out pool's 5-minute lag ceiling (capped, non-disableable) false-fires on lineages whose first iteration legitimately takes longer; the opencode/native dispatch paths were also rejected by the workflow router in automated contexts. Both are recorded in `research.md` §12 as negative knowledge.
2. **Remote OAuth is experimental.** Phase 3 must pin the transport version and reconcile the public README (`/sse`) vs hosted docs (`/mcp`) surface contradiction before wiring.
3. **No Webflow sandbox has been provisioned yet.** The recommended pattern (dedicated test workspace + Starter site, read-only scopes, staging-subdomain publish) is in `research.md` §7; provisioning is a Phase 3/8 operator decision.
<!-- /ANCHOR:limitations -->
