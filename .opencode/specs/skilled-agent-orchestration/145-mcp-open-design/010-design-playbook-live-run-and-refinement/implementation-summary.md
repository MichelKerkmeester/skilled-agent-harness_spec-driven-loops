---
title: "Implementation Summary: live-run and refinement of the design playbooks"
description: "All 13 manual-testing-playbook scenarios across mcp-open-design and sk-design-interface were run live (12 PASS, 1 PARTIAL, 0 SKIP), and each scenario the run exposed a gap in was refined in place. Kimi K2.7 and DeepSeek v4 Pro both passed every model-judgment scenario, which also surfaced real WCAG failures in the 154 designs."
trigger_phrases:
  - "design playbook live run result"
  - "kimi deepseek playbook verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/010-design-playbook-live-run-and-refinement"
    last_updated_at: "2026-06-15T10:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the run + refinements; authored the packet record"
    next_safe_action: "Validate, commit, then restructure under 145-mcp-open-design"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/manual_testing_playbook/03--gated-runs/gated-verb-confirm.md"
      - ".opencode/skills/sk-design-interface/manual_testing_playbook/06--licensing-and-provenance/licensing-and-provenance-integrity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-design-playbook-live-run-and-refinement"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-design-playbook-live-run-and-refinement |
| **Completed** | 2026-06-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both design skills' manual testing playbooks had never been run end to end. Now all 13 scenarios have been executed live with real evidence, and the scenarios that the run exposed gaps in have been refined. The headline: **12 PASS, 1 PARTIAL, 0 SKIP**, and both Kimi K2.7 and DeepSeek v4 Pro, driven by sk-design-interface, passed every model-judgment scenario.

### The live run

| ID | Skill | Verdict | Evidence |
|----|-------|---------|----------|
| ID-001 brainstorm + deviate | sk-id | PASS (Kimi + DeepSeek) | both named all three default clusters + a justified deviation |
| ID-002 pinned brief verbatim | sk-id | PASS (both) | both followed the pinned cream/serif/terracotta, cited rule, no deviation |
| ID-003 quality-floor gate | sk-id | PASS (both) | both graded a real fixture, found concrete WCAG failures + fixes |
| ID-004 system as critique-against | sk-id | PASS (both) | both read the real bundled `luxury` system, named the cliche, deviated |
| ID-005 route to sk-code | sk-id | PASS (both) | both routed away, no design plan |
| ID-006 route to sk-doc | sk-id | PASS (both) | both routed away, no design plan |
| ID-007 licensing/provenance | sk-id | PASS | Apache attribution + LICENSE present, package valid, no leftovers |
| ID-008 reuse-before-generate | sk-id | PASS (both) | both read the real bundled `professional` system, reused 20+ tokens/components, net-new only at gaps |
| ID-009 previewUrl fidelity | sk-id | PASS | a completed live od run judged against both gates |
| WIRE-001 mcp install | mcp-od | PARTIAL | open-design installed in `.utcp_config.json`, valid; live tools list needs a fresh Code Mode session |
| READ-001 read design system | mcp-od | PASS | read a real bundled system's 9-section DESIGN.md + tokens.css |
| RUN-001 gated verb | mcp-od | PASS | gated od build into a throwaway project, model-pinned, multi-turn |
| FAIL-001 daemon unreachable | mcp-od | PASS | bogus socket -> clear error, no hang/silent-success |

### The refinements (evidence-driven, in place)

- **mcp-open-design:** added the `OD_SIDECAR_IPC_PATH` precondition; RUN-001 model-pinning (omitting `--model` runs opencode's default, not the configured model) + the answer-via-follow-up-message path; READ-001 token-wall + bundled-system location; a Code Mode (UTCP) wiring section in mcp_wiring.md.
- **sk-design-interface:** ID-003 names a concrete fixture; ID-004/008 name the bundled-system source; ID-007 names the exact de-vendor artifacts (check by file absence, not a prose grep that false-positives on the legitimate Apache attribution); ID-009 names the runId source.

Self-check counts were preserved (mcp-od "5 features / 4 scenarios", sk-id 9), the sk-id prompt-equality invariant held, and both skills still pass `package_skill --check`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-open-design/manual_testing_playbook/{manual_testing_playbook.md, 02--reading/read-design-system.md, 03--gated-runs/gated-verb-confirm.md}` | Modified | Socket precondition, READ token-wall, RUN model-pinning + form-answer |
| `mcp-open-design/references/mcp_wiring.md` | Modified | Code Mode (UTCP) wiring path |
| `sk-design-interface/manual_testing_playbook/{03,04,06,07}--*/*.md` | Modified | Fixture, system source, de-vendor tokens, runId source |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 13 scenarios ran by class: ID-007 deterministically (greps + `package_skill`); ID-001/002/003/005/006 as a battery dispatched to both Kimi (`kimi-for-coding/k2p7`) and DeepSeek (`deepseek/deepseek-v4-pro`) with the skill loaded; WIRE-001 by hand-adding the open-design manual to `.utcp_config.json`; READ-001/ID-004/ID-008 against the app's ~150 bundled design systems; RUN-001 + ID-009 via a real `od run start --agent opencode --model deepseek/...` gated build into a throwaway project; FAIL-001 simulated with a bogus socket so the live app was not disrupted. Every model-generated artifact was host-verified against the real source, which is how the click-up doctor grep bug, the model-pinning gotcha, and the 154 contrast failures were caught.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run model-judgment via Kimi + DeepSeek | The user's choice; the stronger test is whether the skill steers non-Anthropic models off the defaults |
| WIRE-001 installs into Code Mode UTCP, not opencode.json | The user's choice; the Code Mode MCP server receives the daemon-injected token |
| Corrected the 3 SKIPs to PASS | The systems are bundled in the app (.../open-design/design-systems/), so the reads were runnable after all |
| Fixed the 154 contrast cross-finding | Both models caught real WCAG failures; honest to fix the designs (committed under 154) |
| Refine in place, preserve self-checks | Avoid churning the playbook count assertions and the prompt-equality invariant |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 13 scenarios run live with a verdict | PASS (12 PASS, 1 PARTIAL, 0 SKIP) |
| Both models on the 5 judgment/routing scenarios | PASS (Kimi + DeepSeek) |
| `package_skill --check` (mcp-open-design, sk-design-interface) | PASS both |
| Self-check counts preserved + prompt-equality held | PASS |
| House-voice (no em dashes) on edited files | PASS |
| 154 contrast fix re-graded | PASS (cited ratios now clear AA) |
| WIRE-001 live tools/list this session | PARTIAL (needs a fresh Code Mode session) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **WIRE-001 is PARTIAL.** The open-design manual is installed and valid in `.utcp_config.json`, but Code Mode loads MCP-stdio manuals at startup, so the live `tools/list` confirmation needs a fresh Code Mode session.
2. **Battery dispatch.** The 5 model-judgment/routing scenarios ran as one battery per model (not 5 separate dispatches) for efficiency, with each task labeled independent.
3. **Other 154 designs not graded.** ID-003 graded mimo/01-meridian; the 154 contrast fix then swept all six designs, but only mimo/01 had two-model grading evidence.
4. **The optional variation-diversity scenario (ID-010) was not added** - it would change the sk-id self-check count; deferred unless requested.
<!-- /ANCHOR:limitations -->
