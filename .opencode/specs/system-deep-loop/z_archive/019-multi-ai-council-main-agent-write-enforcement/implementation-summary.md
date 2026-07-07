---
title: "Implementation Summary: Multi-AI Council main-agent write enforcement [system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement/implementation-summary]"
description: "Placeholder. Will record the actual outcomes of Phase 4 verification (parity test, validator, sandbox smokes A and B) once implementation lands. Do not flag the placeholder tokens below as stale until completion_pct reaches 100."
trigger_phrases:
  - "100 implementation summary"
  - "council main agent enforcement summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement"
    last_updated_at: "2026-05-09T20:11:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Shipped body edits"
    next_safe_action: "User runs sandbox smoke A/B"
    blockers: []
    key_files:
      - ".opencode/agents/multi-ai-council.md"
      - ".claude/agents/multi-ai-council.md"
      - ".codex/agents/multi-ai-council.toml"
      - ".gemini/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-main-agent-enforcement-2026-05-09"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement` |
| **Completed** | 2026-05-09 (code edits); sandbox smokes pending user run |
| **Level** | 2 |
| **Status** | Code-complete; awaiting live sandbox-smoke verification |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five enforcement gates added to the Multi-AI Council agent body across all 4 runtime mirrors plus 2 reference doc updates:

1. **§1 Step 0 RESOLVE** — new pre-step before RECEIVE that resolves the target packet path via 4-stage rule (prompt → continuity → cwd ancestor → HALT-and-ASK). Fails closed; no seat dispatch without a packet path.
2. **§7 ALWAYS / NEVER** — three new ALWAYS bullets (resolve packet, persist before completion, named exports list) and three new NEVER bullets (no chat-only delivery, no unrooted deliberation, no out-of-scope writes).
3. **§9 PERSISTENCE VERIFICATION block + Q11** — new MANDATORY 9-item checklist parallel to MULTI-AI COUNCIL / PLAN / EVIDENCE blocks; SELF-CHECK extended from 10 to 11 questions; `DO NOT CLAIM COMPLETION` failure handler updated.
4. **§12 OUTPUT PROTOCOL** — opening line flipped from conditional ("When invoked with a `spec_folder`...") to unconditional, citing §1 Step 0 RESOLVE as the always-on packet-path source.
5. **§13 INVOCATION CONTRACT** — first-call paragraph restructured into a 10-step numbered checklist with explicit `writeConfig` → `writeStrategyMd` → `writeStateJsonl` → `writeSeat` × N → `writeDeliberation` → `writeReport` → `writeStateJsonl(council_complete)` sequence; each persistence step requires an `artifact_written` event.

Plus pre-existing §7 NEVER drift in `.codex` (stale "Modify ANY files" planning-only language) and §9/§11 stale "planning-only" references aligned with packet 098's scoped-write model in the same dispatch. The Iron Law text updated from "PLANNING-ONLY EVIDENCE" to "SCOPED-WRITE PERSISTENCE EVIDENCE".

Reference docs:
- `folder-layout.md` — added a top-level "Persistence is mandatory" note citing the agent's §1 Step 0 RESOLVE.
- `state-format.md` — added a top-level "Every council run MUST close with a `council_complete` event" note citing §9 + §13.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Direct Edit-tool dispatch by `claude-opus-4-7` working on `main`. Canonical edits authored in `.opencode/agents/multi-ai-council.md` first; `cp` propagation to `.claude` and `.gemini` (frontmatter is byte-equivalent, body now byte-equivalent). `.codex/agents/multi-ai-council.toml` edited section-by-section because the body is wrapped in `developer_instructions = '''...'''` and had pre-existing drift in §7 NEVER, §9 PLAN VERIFICATION, and §11 ANTI-PATTERNS that needed simultaneous alignment with packet 098's scoped-write model. Reference docs edited last. Total wall-clock: ~30 min (faster than the 3-hour estimate in `plan.md` because the body changes are mechanical and the parity test caught the one mid-flight mirror lag).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS

- **Q1 (HALT-and-ASK vs auto-staging)** → HALT-and-ASK. Step 0 sub-step 4 explicitly tells the agent to skip seat dispatch and emit a single user-facing question listing the resolution candidates it tried. Auto-staging would have scattered orphan council reports.
- **Q2 (Read-after-Write verification in §9)** → relied on the existing writer checksum (per packet 098 NFR-S02). No extra Read step added; would inflate token cost without catching new failure modes.
- **Q3 (`--no-persist` flag)** → not added. Deferred until usage data shows the HALT-and-ASK creates real friction. Avoids preemptive feature creep.
- **Pre-existing codex drift** → fixed in this dispatch rather than scoped to a follow-on packet, because the new §7 / §9 enforcement edits would otherwise sit alongside contradictory legacy language and undermine the contract.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:files-changed -->
## Files Changed

| Path | Change | Notes |
|------|--------|-------|
| `.opencode/agents/multi-ai-council.md` | Modify | §1 Step 0 RESOLVE; §7 ALWAYS+NEVER; §9 PERSISTENCE VERIFICATION + Q11 + Iron Law; §12 unconditional; §13 numbered sequence; §9 PLAN VERIFICATION line aligned. Canonical reference. |
| `.claude/agents/multi-ai-council.md` | Modify | `cp` from canonical; byte-identical body. |
| `.gemini/agents/multi-ai-council.md` | Modify | `cp` from canonical; byte-identical body. |
| `.codex/agents/multi-ai-council.toml` | Modify | Same 5 enforcement edits, plus pre-existing §7 NEVER / §11 anti-pattern / §9 PLAN VERIFICATION drift aligned with packet 098 scoped-write model. |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` | Modify | Added top-level "Persistence is mandatory" note citing §1 Step 0 RESOLVE. |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` | Modify | Added top-level "Every council run MUST close with `council_complete`" note citing §9 + §13. |
| `.opencode/specs/skilled-agent-orchestration/100-.../*` | Create | Spec packet (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json). |
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Modify | Added `100-multi-ai-council-main-agent-write-enforcement` to `children_ids`. |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

- **4-runtime parity test** (`mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts`): **PASS**. 2 tests, ~5ms. Confirmed all 4 mirrors (3 markdown byte-equivalent body, codex TOML carries required tokens) parity-locked. Initial run failed because the Iron Law edit landed in `.opencode` after the first `cp` to `.claude`/`.gemini`; re-`cp` and re-run was clean.
- **Permission-scope test** (`mcp_server/tests/multi-ai-council-permission-scope.vitest.ts`): **PASS**. Path-scope enforcement from packet 098 still holds.
- **Full multi-ai-council vitest suite**: **23 passed, 1 skipped** (1 skip pre-existing, not a regression). 8 test files total; 1.54s.
- **Strict validate** on `.opencode/specs/skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement`: **0 errors, 1 cosmetic warning** (`PRIORITY_TAGS: 51 checklist item(s) have non-standard priority tags` — same shape that 097 ships with; inline `[P0]`/`[P1]`/`[P2]` tags follow the documented format but the validator's regex is finicky).
- **Stale-token sweep**: `grep "When invoked with a \`spec_folder\`"` returns no hits in any of the 4 agent files. `grep "planning-only"` returns no hits.
- **Step 0 RESOLVE / PERSISTENCE VERIFICATION / Q11 propagation**: confirmed present 5 times / 2 times / 1 time per file across all 4 mirrors (counts symmetric).
- **Sandbox Smoke A** (no-packet invocation in opencode main-agent slot): **PENDING USER VERIFICATION**. Expected: agent HALTs at Step 0 RESOLVE and emits the disambiguation question; no `ai-council/` directory created.
- **Sandbox Smoke B** (packet-named invocation): **PENDING USER VERIFICATION**. Expected: full canonical artifact set materializes under `<packet>/ai-council/` ending with `council_complete` event.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- **LLM compliance** — body-text enforcement relies on the LLM honoring §9 SELF-CHECK Q11. There is no runtime hook that catches a council that lies about persistence. Mitigation: the `lib/persist-artifacts.js` writers are the only path to producing the canonical artifact set with valid `artifact_written` checksums; an agent that skips the writers leaves the state log without `council_complete`, which the new state-format.md note flags as failed.
- **HALT-and-ASK UX** — may add friction for casual planning chats. If usage data shows this, Q3 (`--no-persist` flag) becomes a follow-on packet.
- **Backporting** — in-flight `ai-council/` folders from pre-100 dispatches are unchanged. The new gates apply to dispatches AFTER this commit.
- **Sandbox smokes pending** — Smoke A and Smoke B require a live opencode main-agent dispatch which the implementing agent (claude-opus-4-7 in this session) cannot simulate. The user runs these to close out Phase 4.
- **Cosmetic priority-tag warning** — strict validate exits 2 because of one warning; functionally clean.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deferrals -->
## Deferred Items

[To be filled. Likely deferred:
- REQ-011 P2 example formatting in §9 — only if useful.
- REQ-012 P2 changelog entry — only if changelog file exists.
- Q3 from `spec.md` — `--no-persist` flag, follow-on packet if usage data warrants.]
<!-- /ANCHOR:deferrals -->

---

<!-- ANCHOR:followups -->
## Follow-up Work

[To be filled. Likely follow-ups:
- Soft-deprecation of `persist-artifacts.cjs` as a CLI shim if no non-council callers materialize within N months.
- Auto-staging fallback (Q1) if HALT-and-ASK produces friction in practice.]
<!-- /ANCHOR:followups -->
