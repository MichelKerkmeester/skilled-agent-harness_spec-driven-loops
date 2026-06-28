---
title: "Implementation Summary: Phase 5 — Backfill Remaining Profiles"
description: "Six remaining per-model prompt-craft profiles authored under sk-prompt-models/references/models/: minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1. All follow the canonical 6-section template and resolve the profile_ref/model_id round-trip."
trigger_phrases:
  - "backfill remaining profiles"
  - "minimax-2.7 profile"
  - "swe-1.6 profile"
  - "deepseek-v4-pro profile"
  - "kimi-k2.6 profile"
  - "qwen3.6 profile"
  - "glm-5.1 profile"
  - "small model profiles complete"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/005-backfill-remaining-profiles"
    last_updated_at: "2026-06-02T18:04:14Z"
    last_updated_by: "agent"
    recent_action: "Completion docs written"
    next_safe_action: "Proceed to phase 006-thin-and-standardize-cli-cards"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/minimax-2.7.md"
      - ".opencode/skills/sk-prompt-models/references/models/swe-1.6.md"
      - ".opencode/skills/sk-prompt-models/references/models/deepseek-v4-pro.md"
      - ".opencode/skills/sk-prompt-models/references/models/kimi-k2.6.md"
      - ".opencode/skills/sk-prompt-models/references/models/qwen3.6.md"
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.1.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-backfill-remaining-profiles"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 005-backfill-remaining-profiles |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 5 completed the sk-prompt-models model-craft hub by authoring the six remaining per-model prompt-craft profiles that were missing from the `references/models/` directory. Before this phase, only the priority profiles existed (mimo-v2.5-pro and minimax-m3 from phase 4); the remaining six models in the dispatch matrix — minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, and glm-5.1 — had no authoritative prompt-craft reference, leaving callers without a canonical source for framework selection, template scaffolds, or dispatch gotchas.

### minimax-2.7.md — TIDD-EC empirical profile

The MiniMax-M2.7 profile is the only empirically benchmarked file in this set. It documents the TIDD-EC + DENSE finding from benchmark 120/003 (7-fixture rig, medium confidence), provides the exact TIDD-EC fill scaffold, and records the counter-intuitive finding that this model rewards more structure — the opposite of smaller models. The profile also establishes the sibling relationship to minimax-m3, which carries this finding forward with status `carried`.

### swe-1.6.md — RCAF + mandatory caller-side pre-planning contract

SWE-1.6 is the Cognition free-tier model dispatched exclusively via `cli-devin`. Its profile documents the RCAF + medium pre-planning default and — critically — the **mandatory caller-side pre-planning contract**: every dispatch to SWE-1.6 must include a `<pre-plan>` block with ordered steps, acceptance criteria, stop conditions, and a verification command. Skipping the pre-plan is the top cause of weak SWE-1.6 output. The profile also documents the escalation rule (switch to deepseek-v4-pro when the pre-planning step reveals the task exceeds SWE-1.6's clearly-scoped zone) and the non-TTY `</dev/null` rule.

### deepseek-v4-pro.md, kimi-k2.6.md, qwen3.6.md, glm-5.1.md — RCAF/medium default-unverified

The four remaining profiles share the RCAF / medium pre-planning convention default (matching `model-profiles.json`'s `recommended_frameworks` for each). Each profile is distinct in its dispatch mechanics, context window, quota pool membership, and per-model counter-intuitive notes:

- **deepseek-v4-pro**: escalation target from SWE-1.6; 64k window (smallest in the cognition-pro tier); `--pure` flag required on the deepseek-api path; prompt should lean into specificity (file paths, function names, acceptance criteria) rather than guardrail verbosity.
- **kimi-k2.6**: large-context specialist at 200k tokens; suited for sprawling diff reviews and multi-repo evidence gathering; documents the ~5–10% hang rate on complex fixtures; stresses that large context is not a licence for unstructured dumps — explicit file anchors are required.
- **qwen3.6**: smallest context window in the rotation (32k); prompt economy is non-negotiable; no cross-pool fallback; `[... truncated N tokens]` markers mandatory for evidence blocks over ~2k tokens.
- **glm-5.1**: 128k context, two executor paths (cognition-pro primary, opencode-go secondary); notes that despite the 128k window, scope should be kept explicit rather than expanded to fill it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt-models/references/models/minimax-2.7.md` | Created | TIDD-EC empirical profile for MiniMax-M2.7; benchmark 120/003 evidence, TIDD-EC scaffold, sibling pointer |
| `.opencode/skills/sk-prompt-models/references/models/swe-1.6.md` | Created | RCAF + mandatory pre-planning contract for SWE-1.6; escalation rule, non-TTY rule |
| `.opencode/skills/sk-prompt-models/references/models/deepseek-v4-pro.md` | Created | RCAF/medium profile; `--pure` flag note, 64k budget guidance, escalation target context |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.6.md` | Created | RCAF/medium large-context profile; hang rate documentation, file-anchor discipline |
| `.opencode/skills/sk-prompt-models/references/models/qwen3.6.md` | Created | RCAF/medium profile; 32k window constraints, budget-overflow guidance |
| `.opencode/skills/sk-prompt-models/references/models/glm-5.1.md` | Created | RCAF/medium profile; dual-pool dispatch (cognition-pro + opencode-go) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All six profiles were authored using the canonical 6-section template (Identity, Recommended Framework, Benchmark Evidence, Tuned Template Snippet, Dispatch Gotchas, See Also). Framework choices were verified against `model-profiles.json` `recommended_frameworks` entries for each model id before writing. Every profile was confirmed to have a proper H1 heading and a valid YAML frontmatter `model_id` field that round-trips to the registry. The non-benchmarked models carry `status: default-unverified` and explicit `last_benchmarked: "none"` in frontmatter, consistent with the hub's documentation contract.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gave minimax-2.7 `status: empirical` rather than `default-unverified` | The 7-fixture benchmark 120/003 exists; using `empirical` accurately reflects that a real run was performed, distinguishing it from the convention-default profiles |
| Kept RCAF/medium as the uniform default for the four unverified profiles | All four entries in `model-profiles.json` specify `primary: "rcaf"`, `preplanning_density: "medium"`; diverging without evidence would break the data/profile round-trip |
| Made swe-1.6 pre-planning a "mandatory contract" rather than a recommendation | The Cognition `prompt_templates.md` documents the defensive-output failure mode empirically; framing it as a contract (not a suggestion) is the strongest signal to callers |
| Included counter-intuitive notes in every profile | Counter-intuitive notes are the highest-value content in a prompt-craft profile — they prevent callers from applying intuitions from one model (e.g., MiniMax's reward for density) to models where those intuitions backfire |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 6 profile files present in `references/models/` | PASS — confirmed via `ls` |
| Each profile has H1 heading | PASS — all have `# <ModelName> Prompt-Craft Profile` |
| Each profile has valid YAML frontmatter with `model_id` | PASS — confirmed for all 6 |
| `model_id` values match `model-profiles.json` registry IDs | PASS — minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1 all confirmed |
| All profiles follow the 6-section template | PASS — Identity, Framework, Evidence, Template, Gotchas, See Also present in all |
| Spec kit validate.sh --strict | PASS — exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No empirical benchmarks for 5 of 6 profiles.** swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, and glm-5.1 all carry `status: default-unverified`. Their RCAF/medium defaults are principled but unvalidated. A future benchmark sweep would move these to `empirical` status.
2. **minimax-2.7 benchmark is small-sample (7 fixtures, medium confidence).** The discriminator gap (TIDD-EC 0.767 vs RCAF 0.742) is modest; a 15+ fixture run would be needed to promote to high confidence.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
