---
title: "Implementation Summary: Research Phase for Jev Typed Judgments Across .skilled"
description: "Complete: 30 forced-depth iterations over DeepSeek, MiMo and Grok, a fresh Opus synthesis ranking 1 build-now, 1 next, 16 later and 32 drop, and two Planned build phases scaffolded from it."
trigger_phrases:
  - "jev research summary"
  - "jev research progress"
  - "grok 4.7 substitution"
  - "jev research verification"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/001-deep-research"
    last_updated_at: "2026-09-26T18:38:11Z"
    last_updated_by: "generate-context"
    recent_action: "Closed research phase; authored phases 002 and 003 as Planned"
    next_safe_action: "Await the operator's pick to build 002-advisor-jev-tiebreak-arm"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/spec.md"
    session_dedup:
      fingerprint: "sha256:35ccdd7afa91041b38e29f775b574185e678b387946749f7b6798f5de149091f"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Research Phase for Jev Typed Judgments Across .skilled

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deep-research |
| **Status** | Complete |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research answered where Jev typed judgments earn a place in `.skilled`. The short answer is offline measurement first. Every live seam either sits inside a hook deadline a Jev call cannot promise to meet, or lacks the labeled data that would prove a judgment helps.

### Phase 1: deep-research

- Four context digests and 30 label-keyed research angles in four waves.
- `grok-4.7-xhigh-fast` in both cli-cursor allowlists, with tests, docs and a changelog entry.
- 30 iterations: 10 each from DeepSeek V4.1 Flash (max, cli-pi), MiMo V2.6 Pro (high, cli-pi) and Grok 4.7 xhigh fast (cli-cursor).
- `research/research.md`, written by a fresh Opus 5.5 max leaf. It ranks 1 build-now, 1 next, 16 later and 32 drop, records 3 dead ends and proposes two build phases.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Created | The research brief, the run plan, the ordered tasks and the phase goal |
| `context/*.md` | Created | Repository rules, seam map, Jev material, measurement harnesses and the 30 angles |
| `scratch/research-topic.txt`, `scratch/synthesis-brief.md` | Created | The fan-out topic and the synthesis brief |
| `research/**` | Created | Three lineages, the merged registry, the resource map, the synthesis and the close-report ledger |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs` | Modified | Allow `grok-4.7-xhigh-fast` |
| `runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | Cover the new id |
| `.skilled/skills/cli-external-orchestration/cli-cursor/**` | Modified | Document the new id and add changelog `v1.4.3.0` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The whole phase ran in the worktree `.worktrees/069-cli-jev-workflow-integration`. Opus 5.5 medium leaves wrote the digests and the angles, and the prompt-improver tightened the topic on Sonnet. One `fanout-run.cjs` process ran the three lineages at concurrency 3 with the stop policy fixed at 10 iterations. All three finished on the first attempt: Grok in 11 minutes, DeepSeek in 20 and MiMo in 44. The host merged the lineages, a fresh Opus 5.5 max leaf wrote the synthesis from all 30 iteration files, and the host ran the workflow's close-report step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `grok-4.7-xhigh-fast` runs the `grok` lineage | `cursor-agent --list-models` on 2026-09-26 lists no Grok 4.7 MAX tier. This is the highest-effort fast Grok 4.7 id |
| Lineages make no live Jev call | A live call spends quota and could send repository text to Jev. Jev behavior is cited from its contract and the vendored code instead |
| Every build phase is dormant without a Jev key | The operator asked on 2026-09-26 that every feature be optional and active only when a Jev key is present. `jev auth status` is the check: it exits 0 for a stored or exported key and 3 with none, and it never prints the key |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineage state logs | Each holds 10 iteration records, and its last record carries `stopReason` `maxIterationsReached` |
| Iteration files | `iteration-001.md` to `iteration-010.md` in each of `deepseek`, `mimo` and `grok` |
| Grok 4.7 roster | Commit `9fe8526284`: vitest 257/257, typecheck clean, compiled-route guard fresh, live probe replied `OK` |
| Synthesis citations | The ledger in `research.md` section 14 marks each citation resolved, drifted or failed |
| Host recheck | Seven cited seams reopened, all resolved: `ambiguity.ts:7-8,44-58`, `scorer-eval-baseline.json:25-35`, `score-outcome-rerank.mjs:127-133,149-150`, `opencode-goal.js:49,134-135,179,226-229,2378-2380`, `goal-core.cjs:603-604`, `user-prompt-submit.ts:115` and the PreCompact `timeout: 3` in `.claude/settings.json`. R1, R2 and the compaction deferral hold against that code |
| Close report | Recorded `synthesis_incomplete`, see limitation 1 |
| `validate.sh --strict --recursive` on the parent | Recorded in the parent goal log at close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The merged registry under-counts DeepSeek.** The close report failed invariant `count_only_state_findings_not_reconstructed`. DeepSeek and MiMo state records carry only `findingsCount`, 112 in total, and `fanout-merge.cjs` rebuilt 85 findings from the iteration markdown: MiMo 55 of 55, Grok 22 of 22, DeepSeek 8 of 57. The synthesis read all 30 iteration files directly, so its ranking does not depend on the registry. Why the parser missed DeepSeek's findings was not traced, and the parser is outside this packet.
2. **Two vocabularies for one verdict.** The shared goal core returns `not-met` for blocking language and `unclear` for its other four failing checks (`goal-core.cjs:598-616`), while the OpenCode plugin's verdict set is `met`, `not_met` and `blocked` (`opencode-goal.js:179`). Phase 003 maps both core values to `not_met`.
3. **Vendor claims stay unreproduced.** Every Jev cost, latency and accuracy figure in the synthesis is a vendor claim or a user report. Phase 002's per-call record is the first measurement this repository would own.
<!-- /ANCHOR:limitations -->

---
