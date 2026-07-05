---
title: "031 GPT Reliability (Deep-Loop) Chronological Timeline"
description: "Git-commit-ordered timeline of packet 031, from the initial route-and-orchestration research through loop-guard hardening implementation."
trigger_phrases:
  - "031 timeline"
  - "deep loop gpt opencode timeline"
  - "031 packet chronology"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability"
    last_updated_at: "2026-07-01T20:15:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Regrouped into 7 tracks + folded in 037; timeline framing updated"
    next_safe_action: "Complete track 006 and 007 001-contract-compiler-design"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "changelog-031-2026-07-01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# 031 GPT Reliability (Deep-Loop) Chronological Timeline

> **Sort key.** Git commit order, oldest first, for every commit that touched the `031-deep-loop-issues-with-gpt-opencode` packet.
> **What this packet did.**
> **Reorg note (2026-07-05):** the phases below were regrouped into **7 themed L1 tracks** (see `context-index.md` for the old→new remap) and the former top-level packet `037-mk-deep-loop-guard-retention` was folded in as `003-guard-and-enforcement/005`. The packet is **not fully complete**: tracks 001-005 are complete, **006 is Planned** and **007 is In Progress**. The narrative below is preserved by its original flat phase numbers for historical accuracy.
 It diagnosed why GPT-backed models running inside OpenCode mis-invoke and mis-route deep skills, then fixed it across seventeen phases: research, route-proof validation, agent-dispatch and command pre-route hardening, a blocked smoke test, a parked host-identity investigation, six-lineage behavioral research, identity fixes, universal orchestrate routing, an ai-council reachability conversion, a live-verified enforcement plugin, a real GPT-vs-Claude benchmark, a FIX-5 closure decision, a skill-doc drift audit and remediation, and a final loop-repeat-detection hardening pass.
> **Where the truth lives.** Each commit's detail is in the matching phase changelog under `changelog/`. The before-and-after framing is in `before-vs-after.md`.

---

## 0. The five epochs

Epoch one runs on 2026-06-30, the initial research scaffold. The packet root and phase 001's decomposition research landed in one commit.

Epoch two runs on 2026-07-01 at 16:35, the main implementation wave. Phases 002 through 013 landed together in one large checkpoint commit: route-proof validation, agent-dispatch and command pre-route hardening, the blocked GPT verification smoke, the parked host-hard-identity spec, six-lineage behavioral research, the Mode-D and ai-council identity fixes, universal orchestrate routing, the ai-council subagent-only conversion, the enforcement plugin, the GPT-vs-Claude benchmark, and the FIX-5 checkpoint closure.

Epoch three runs on 2026-07-01 at 16:59, a same-day plugin rename for naming-convention parity.

Epoch four runs on 2026-07-01 from 17:45 to 19:24, the skill-doc drift audit and remediation track, plus phase 016's loop-guard-hardening research.

Epoch five runs on 2026-07-01 from 19:43 to 19:55, the loop-guard implementation phase and its documentation-sync follow-up.

A sixth, cross-packet commit at 20:05 renamed the shared `.opencode/plugins/__tests__/` directory to `.opencode/plugins/tests/` for three concurrent packets at once (031, 030, 032); it is noted here for completeness but is not counted as one of this packet's own five epochs since its primary scope belonged to a different packet's work.

---

## 1. Epoch one: initial research scaffold (2026-06-30)

 95e8a384d5  chore(repo): land 028 workspace snapshot

This commit created the packet root `spec.md` and phase `001-deep-agent-router-and-orchestration`, whose 6-iteration deep-research loop (10/10 key questions answered) decomposed the fix into phases 002 through 006.

---

## 2. Epoch two: main implementation wave (2026-07-01, 16:35)

 540fac01e4  checkpoint: land 031 GPT deep-loop hardening (phases 008-013) + broader WIP

One bundled checkpoint commit shipped phases 002 through 013 together:

- **002 route-proof-validation** — route-proof fields close the false-negative that let wrong-mode artifacts pass as valid.
- **003 agent-dispatch-hardening** — new `deep.md` primary router (both `.opencode` and `.claude` mirrors) + registry-backed `Deep Route:` dispatch field on `orchestrate.md`.
- **004 command-pre-route-headers** — resolved-route headers added before body prose across all 4 deep-mode prompt packs and command YAMLs.
- **005 gpt-verification-smoke** — blocked/inconclusive; every command-owned GPT smoke attempt failed before reaching leaf dispatch.
- **006 host-hard-identity-fix5** — parked, never implemented, pending a trigger from phase 005's evidence.
- **007 gpt-behavioral-hardening-research** — six-lineage, two-round research; self-corrected a wrong round-1 claim about the ai-council route-proof validator.
- **008 mode-d-ai-council-identity-fix** — self-classification gate replaced with an evidence-based check across all 8 `/deep:*` commands; ai-council route identity corrected against the registry.
- **009 orchestrate-universal-routing** — completed Priority table, registry-resolved Deep Route field, NDP boundary against dispatching `@deep` itself, plus a later 8.3-8.4% bloat-reduction pass.
- **010 ai-council-subagent-only** — `ai-council.md` converted from `mode: all` to `mode: subagent`, an explicit operator override of research's unanimous recommendation.
- **011 deep-route-guard-plugin** — built and live-verified the `tool.execute.before` mode-mismatch enforcement plugin.
- **012 gpt-claude-benchmark** — real GPT-vs-Claude benchmark: zero semantic wrong-mode artifacts, zero route-proof mismatches, a measured 3-10x GPT latency gap.
- **013 fix5-checkpoint** — closed phase 006 against phase 012's real results; agent-layer fix confirmed sufficient.

Also bundled: orchestrate.md bloat reduction on both runtime mirrors, and a fix to the agent-mirror-sync pre-commit gate (removed an obsolete `.opencode/agents/*.toml` third-mirror requirement, reconciled a pre-existing content drift between `deep.md`'s two runtime mirrors).

---

## 3. Epoch three: plugin rename (2026-07-01, 16:59)

 3706f0c76f  refactor(deep-loops/031): rename deep-route-guard plugin to mk-deep-loop-guard

Renamed `.opencode/plugins/deep-route-guard.js` to `.opencode/plugins/mk-deep-loop-guard.js` for naming-convention parity with the repo's other `mk-*` plugins, plus the matching env var and log-prefix renames (`DEEP_ROUTE_GUARD_REJECT` → `MK_DEEP_LOOP_GUARD_REJECT`).

---

## 4. Epoch four: skill-doc drift audit and remediation, plus loop-guard research (2026-07-01, 17:45-19:24)

 86cbd4c464  feat(deep-loops/031): add skill-doc drift audit phase 014, confirm 6 real findings
 a3c983639e  fix(deep-loops/031): remediate all 6 confirmed skill-doc drift clusters
 c9f97a0029  fix(deep-loops/031): adversarial review of phase 015 + phase 016 research

Phase 014's 20-iteration dual fan-out (10 deep-review + 10 deep-research, `cli-opencode openai/gpt-5.5-fast`) audited 45 candidate skill docs and confirmed 6 real drift clusters caused by phases 008-013's changes. Phase 015 fixed all 6, then a follow-up 10-iteration dual-model adversarial review (GPT-5.5-fast + GLM-5.2-max) found and fixed 2 more real residuals in the same commit that also carried phase 016's own 5-iteration dual-model research on hardening `mk-deep-loop-guard.js` with loop-repeat detection.

---

## 5. Epoch five: loop-guard implementation (2026-07-01, 19:43-19:55)

 171fbd7972  feat(deep-loops/031): harden mk-deep-loop-guard with loop-repeat detection
 8c3408c687  docs(deep-loops/031): sync plugins README with mk-deep-loop-guard's two-check design

Phase 017 implemented phase 016's Design Option B: `resolveTargetIdentity()` (fixing the `subagent_type="general"` no-op gap) plus session-scoped, iteration-aware loop-repeat detection, live-verified against the real installed `opencode` host with zero regression. A follow-up documentation-sync audit found and fixed one stale entry in `.opencode/plugins/README.md`.

---

## 6. Cross-packet note: shared test-directory rename (2026-07-01, 20:05)

 8bfbffc433  refactor(plugins): rename __tests__ to tests, complete goal-plugin doc sweep

A concurrent session working on packet 032 (goal-opencode-plugin) renamed the shared `.opencode/plugins/__tests__/` directory to `.opencode/plugins/tests/` and repointed every reference across all three packets that mentioned it, including this packet's phase 011 and phase 017 docs. Recorded here for completeness; this commit's primary scope and authorship belong to packet 032, not this packet.
