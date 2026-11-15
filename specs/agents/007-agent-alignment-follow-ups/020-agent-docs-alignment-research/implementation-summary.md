---
title: "Implementation Summary"
description: "Five DeepSeek iterations through Mistral Vibe found 21 places where docs misdescribe the agents or their runtime copies, and two problems in how Vibe runs are billed and classified."
trigger_phrases:
  - "agent docs alignment research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/020-agent-docs-alignment-research"
    last_updated_at: "2026-11-15T15:10:00Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Plan fixes for the ranked findings in research.md section 8"
    packet_purpose: "Purpose: Every doc that tells a reader what an agent does, where its copies live or how they sync matches the current files."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:837bb1157570d47ac87d4cdf8ee0f61bd4e2ce96f66ba9a297357b1c2cd6f384"
      session_id: "scaffold-020-agent-docs-alignment-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T15:10:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-agent-docs-alignment-research |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`research/research.md` lists 21 doc lines that misdescribe the agents or their runtime copies, with the doc line and the file each one contradicts. Most say the agents reach five or six runtimes when eight ship them, because the `.dsh` and `.vibe` trees are left out. The worst ones are checks that cannot fail: the doctor roster check never reads two trees, and both deep-loop playbook sandboxes diff files they never create. The run also found that Mistral bills a separate Vibe budget that only a keychain sign-in reaches, and that the fan-out runner reads Mistral's budget refusal as a crash.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | The merged findings, rulings and recommendations |
| `research/lineages/vibe-a/`, `research/lineages/vibe-b/` | Created | Iterations, deltas, state logs and `export.json` per lineage |
| `research/findings-registry.json`, `fanout-attribution.md`, `resource-map.md` | Created | The merge outputs |
| `research_archive/20261115T145700Z-api-budget-402/` | Created | The failed first attempt |
| `spec.md` | Modified | The generated findings block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`/deep:research:auto` fanned out two `cli-mistral-vibe` lineages on `deepseek-flash`, with three and two iterations. The first attempt stopped on `402 API budget exhausted`. A budget read showed two Mistral pools, the Vibe one unused. After the operator signed in through the browser, one probe call with `MISTRAL_API_KEY` removed billed the Vibe pool. The rerun used the same route, and both lineages finished with exit 0 in under eight minutes. I merged them, re-read the cited lines for 18 of the 21 findings, and settled the one point where the lineages disagreed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two lineages, three and two iterations | Vibe runs only as a fan-out lineage, and the operator asked for five iterations |
| Rerun with `MISTRAL_API_KEY` removed from the environment [DEVIATION] | The cli-mistral-vibe skill requires the key, but a key in the environment overrides the keychain sign-in that reaches the Vibe budget. The operator chose to probe this route |
| Leave `vibe-home/` and session journals out of the commit | They hold the account's Mistral customer id in `whoami_cache.json` and about 16 MB of plugin cache. Each lineage's `export.json`, iterations, deltas and state stay committed |
| Rule for `vibe-b` on `.opencode/agents` | `ls -ld` shows a symlink to `../.skilled/agents`, which refutes three `vibe-a` claims |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out | 2 of 2 lineages succeeded, 5 iterations (`vibe-a` 3, `vibe-b` 2) |
| Billing | Vibe budget 0% → 0.17%, API budget unchanged at 100% |
| Spot-checks | 18 findings re-read and confirmed, 3 refuted and moved to Eliminated Alternatives, 3 left as lineage-only |
| Key scan | Neither the env key nor the keychain key appears in any artifact |
| Post-synthesis validation | `RESULT: PASSED` on the targeted rules |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The findings are not fixed here.** Each fix belongs to a later phase. `research.md` §8 ranks them.
2. **Both lineages ran one model through one CLI,** so they share blind spots. Skills outside the deep loop, CLI orchestration and spec-kit were not swept line by line.
3. **The Vibe billing route depends on the keychain sign-in.** A shell that exports `MISTRAL_API_KEY` still bills the API budget.
<!-- /ANCHOR:limitations -->

---
