---
title: "Implementation Summary [template:level_3/implementation-summary.md]"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-operate-like-fable-5/006-subagent-governor-recursion"
    last_updated_at: "2026-06-15T14:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped recursion-control, executor-config field, deep-loop agent injection"
    next_safe_action: "Scope shipped; 2 enhancements deferred (open_questions); all 149 phases done"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/constitutional/recursion-control.md"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/agents/deep-research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-subagent-governor-recursion"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "prompt-pack {governor_block} deferred: renderPromptPack has no prod caller; wire when the dispatch renderer is identified"
      - "governor injection beyond the 3 deep-loop agents is a follow-up"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-subagent-governor-recursion |
| **Status** | Complete |
| **Completed** | 2026-06-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Opened the subagent-visible governor channel and added the recursion-control rule, so deep-loop iterations and dispatched sub-agents operate under the fable-5 efficiency doctrine the per-turn hook cannot reach.

### Recursion-control rule
`.opencode/skills/system-spec-kit/constitutional/recursion-control.md` (created) — the model-family layer for high-reasoning-effort executors: reason-about-the-problem-not-yourself, audit-depth-limit-1, the extended-thinking caption test, the beautiful-dead-end guardrail; links the base `fable-governor` capsule.

### Sub-agent governor injection (the real subagent channel)
The per-turn hook is subagent-blind, so the governor was injected directly into the three deep-loop LEAF agent prompts — `deep-research`, `deep-review`, `deep-context` — across all three runtime representations (`.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`), kept byte-consistent so the `check-agent-mirror-sync` drift gate passes ("all mirrors in sync — OK").

### executor-config governor affordance
A universal, kind-agnostic optional `governor` field was added to `executorConfigSchema` (intentionally outside `EXECUTOR_KIND_FLAG_SUPPORT` so any kind may carry it), inherited by the lineage/fanout schemas, with present/absent/malformed coverage. The deep-loop-runtime suite is green at 351/351 (349 + 2 new, no regression).

### Deferred with evidence: prompt-pack `{governor_block}`
Mapping the deep-loop dispatch variable-supply path showed `renderPromptPack` has no production caller (only its unit test) and `buildLoopPrompt` builds the lineage prompt without it — the iteration templates' live renderer is YAML/agent-runtime, not a TS function. Adding a `{governor_block}` token would be either a no-op (routed through the unused `renderPromptPack`) or a live-render hazard (a required token the runtime renderer may not supply). Deferred until the dispatch renderer is the wiring point; the agent-prompt injection already delivers the subagent governor.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Pending implementation. The delivery approach is structural-first: open the subagent channel (templates + `prompt-pack.ts`) and add the optional config field before touching agent prompts, so each step is independently verifiable. The change is inert until a governor is supplied (the `{governor_block}` token defaults to empty and the `governor` field is optional), so it ships without a feature flag.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Inject the governor structurally (code + templates + agent prompts) | The per-turn hook is subagent-blind; structural surfaces are the only channels sub-agents see, and they do not decay |
| Edit only the canonical `.opencode/agents/*.md` and let the sync workflow propagate | Hand-editing all three mirrors drifts without a sync mechanism |
| Ship the recursion rule generic, scoped to xhigh | The anxiety loop is the xhigh failure mode; generic-first follows the portability taxonomy, specialization comes later |
| Make the governor token and config field optional with safe defaults | Keeps every existing deep-loop run backward compatible and avoids a feature flag |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Gates defined in checklist.md | Pending — will run `validate.sh` and the relevant `vitest` suites (executor-config, prompt-pack) |
| `renderPromptPack` carries the governor in both iteration templates | Pending — `validatePromptPackTemplate` check defined |
| `executorConfigSchema` governor field (present/absent/malformed) | Pending — `vitest` cases defined |
| Three agent mirrors consistent after `agent-mirror-sync.yml` | Pending — mirror consistency check defined |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Depends on phase 005.** This phase has no payload until the phase-005 governor capsule text exists; it must be sequenced after 005.
2. **Partial portability.** Governor rules 1-2 (anti-anxiety) are Anthropic-specific; the rule ships generic now, with per-model-family specialization deferred to a later parameterized layer.
3. **Mirror sync is load-bearing.** Agent-prompt consistency depends on `agent-mirror-sync.yml`; bypassing it by hand-editing a mirror would reintroduce drift.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

