---
title: "Implementation Summary: Phase 10: routing-corpus-and-holdouts"
description: "The six-mode mcp-tooling hub now has blind-holdout coverage for every mode, an explicit chrome-vs-aside boundary contract, seven new labeled corpus rows, and a re-captured scorer baseline that also healed a pre-existing fixture-hash drift; the ratchet gate is green at 7/7."
trigger_phrases:
  - "routing corpus holdouts summary"
  - "implementation summary"
  - "six mode holdout coverage shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/010-routing-corpus-and-holdouts"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase complete; gates green"
    next_safe_action: "None; hub program tail is 007 Lane-C benchmark (still deferred)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md"
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-010-routing-corpus-and-holdouts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 10: routing-corpus-and-holdouts

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-routing-corpus-and-holdouts |
| **Completed** | 2026-07-16 |
| **Level** | 2 |
| **Status** | Complete |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The six-mode mcp-tooling hub can now catch a routing regression in ANY mode blind: every mode has a holdout whose prompt avoids the target's router aliases, the hardest adjacency (chrome vs aside) is a written contract instead of tribal knowledge, and the advisor's labeled corpus finally exercises all six surfaces. The scorer baseline was re-captured against the grown corpus, which also fixed a gate that had been quietly red since July 10.

### Blind holdouts for the four uncovered modes

`hub_routing/` gains MT-H03 (`holdout_task_tracking.md`, natural-language tracker ops to `mcp-click-up`), MT-H04 (`holdout_agentic_browser.md`, autonomous sign-in-and-do to `mcp-aside-devtools`), MT-H05 (`holdout_web_design_reference.md`, shipped-web-product style research to `mcp-refero`), and MT-H06 (`holdout_mobile_pattern_research.md`, phone-app first-run patterns to `mcp-mobbin`). Together with the existing MT-H01 (chrome) and MT-H02 (figma), holdout coverage is 6-of-6 modes. Each new file mirrors the established contract (`stage: holdout`, `blindToRouterKeywords: true`) and its Expected Behavior section names which adjacent mode must NOT win; the refero/mobbin pair explicitly tolerates a defer between the two research transports as a secondary outcome.

### The chrome-vs-aside boundary contract

`holdout_browser_inspect.md` (MT-H01) is bumped to v1.1.0.0 with a "Boundary (six-mode hub)" section: developer-driven inspection primitives (network requests, live DOM) stay `mcp-chrome-devtools`; agentic, sign-in-and-do, natural-language-task vocabulary is `mcp-aside-devtools`; the router returning aside or a defer on MT-H01's prompt is a regression by definition. MT-H04 is written as the exact inverse, so the pair brackets the boundary from both sides.

### Corpus coverage for all six modes

`labeled-prompts.jsonl` grows 193 to 200 rows with ids `rr-hub6-201` to `rr-hub6-207` (bucket `skill_routing_prompts`, `skill_top_1: "mcp-tooling"`), covering clickup, figma, aside (x2), refero, and mobbin (x2) phrasings. Unlike the blind holdouts, these rows carry aliases on purpose, so the corpus now exercises both vocabularies per mode. All 200 lines parse as JSON.

### Baseline re-capture, including a pre-existing heal

`node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` (run from `mcp_server/`) regenerated `scorer-eval-baseline.json` against the 200-row corpus. This also healed a pre-existing drift that predates this phase: the July 10 hub-merge relabel had landed without a re-capture, so the fixture-hash ratchet was already failing before this program started. The re-captured fixture pins `capturedAt: 2026-07-16`, `capturedAtSha: 2146dee114`, and honest metrics: full_corpus_top1 153/200 (0.765), holdout_top1 57/78 (0.7308), ambiguity_top1 16/25 (0.64), delegation bucket 10/11 (0.9091). The ratchet gate passes 7/7 against it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hub_routing/holdout_task_tracking.md` | Created | MT-H03 blind holdout (mcp-click-up) |
| `hub_routing/holdout_agentic_browser.md` | Created | MT-H04 blind holdout (mcp-aside-devtools) |
| `hub_routing/holdout_web_design_reference.md` | Created | MT-H05 blind holdout (mcp-refero) |
| `hub_routing/holdout_mobile_pattern_research.md` | Created | MT-H06 blind holdout (mcp-mobbin) |
| `hub_routing/holdout_browser_inspect.md` | Modified | v1.1.0.0; chrome-vs-aside boundary section |
| `routing-accuracy/labeled-prompts.jsonl` | Modified | 7 rows appended (193 to 200) |
| `routing-accuracy/scorer-eval-baseline.json` | Modified | Script-owned re-capture |
| `specs/.../010-routing-corpus-and-holdouts/*` | Created/Modified | Level 2 spec docs + this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Mirror-first, then gate. The existing MT-H01/MT-H02 contract and the corpus row schema were read before authoring, and every new artifact copies that shape so no runner or scorer code needed to change. The baseline fixture was regenerated only through its owning capture script (never hand-edited), then the vitest ratchet ran as the independent consumer-side check, followed by a full-corpus JSON parse and spec-child validation after regenerating `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Holdout prompts stay alias-blind while corpus rows carry aliases | The two surfaces test different failure modes: holdouts catch semantic-routing regressions no keyword can save, corpus rows keep the advisor's lexical vocabulary calibrated; together they cover both |
| Write the chrome-vs-aside contract into MT-H01 itself, paired with MT-H04 as its inverse | The boundary is only testable if both sides are pinned; a contract living in one file with no counterexample invites drift |
| Tolerate a refero-vs-mobbin defer as a secondary outcome | Both are design-research transports with genuinely overlapping intent space; forcing a hard winner would make the holdouts flaky rather than protective. mcp-figma or a workflow mode winning stays a hard failure |
| Record the honest post-capture metrics (full corpus 0.765) instead of a cherry-picked bucket | The ratchet pins fixture consistency, not an accuracy floor; publishing the real headline number keeps the 007 Lane-C benchmark honest when it eventually runs. The 0.9091 figure sometimes quoted for this capture is the delegation bucket (10/11), not the corpus headline |
| Call out the July 10 drift as pre-existing, healed here | The ratchet was failing before this phase for reasons unrelated to these additions; folding the heal silently into this phase would misattribute the defect window |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| Holdout coverage 6-of-6 modes | PASS, MT-H01..MT-H06 `expected_intent` enumerate all six mode ids |
| MT-H01 boundary section + version bump | PASS, `holdout_browser_inspect.md:10` `version: 1.1.0.0`, boundary section present at line 17 |
| Corpus integrity | PASS, `wc -l` = 200; line-by-line JSON parse reports `invalid: 0`; ids rr-hub6-201..207 at lines 194-200 |
| `capture-scorer-eval-baseline.mjs --write` | PASS, fixture written with `capturedAt: 2026-07-16`, `capturedAtSha: 2146dee114` |
| `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | PASS, `Test Files 1 passed (1)`, `Tests 7 passed (7)` |
| `generate-description.js <child> .` + `backfill-graph-metadata.js <child>` | PASS, description.json and graph-metadata.json regenerated |
| `validate.sh <child> --strict --no-recursive` | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **The holdouts are fixtures, not a run.** This phase authors the blind suite; the deferred phase 007 Lane-C routing benchmark is what actually executes holdout-style routing at scale. Coverage here enables that run, it does not substitute for it.
2. **Headline scorer accuracy is 0.765, not a ceiling claim.** full_corpus_top1 is 153/200 after the additions; the ratchet pins fixture-hash consistency and metric honesty, not a floor. Raising the number is scorer-improvement territory (system-skill-advisor), out of this phase's scope.
3. **The baseline is point-in-time.** Any future edit to `labeled-prompts.jsonl`, the holdout slice, or the ambiguity slice requires a fresh `capture-scorer-eval-baseline.mjs --write`, or the ratchet fails by design; that is the same failure mode as the July 10 drift this phase healed.
4. **Refero-vs-mobbin adjacency is softened by policy.** A defer between the two research transports is documented as tolerable, so a future router change that defers more aggressively between them will not trip these two holdouts; only a wrong-mode win will.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
