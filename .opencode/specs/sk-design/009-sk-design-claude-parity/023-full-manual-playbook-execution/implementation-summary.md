---
title: "Implementation Summary"
description: "First genuine end-to-end manual execution of sk-design's manual_testing_playbook: 56 real cli-opencode dispatches (gpt-5.5-fast/medium) across 37 scenario IDs and 10 waves. Release verdict NOT READY (9 scenario-level FAILs, 5 of 16 critical-path). Real bugs found; 2 real side effects handled."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 023 implementation summary"
  - "full manual playbook execution summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution"
    last_updated_at: "2026-07-07T18:30:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed verdict-matrix.md and parent implementation-summary.md"
    next_safe_action: "validate.sh --strict on parent + all 10 children, then commit and push"
    blockers: []
    key_files:
      - "verdict-matrix.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "full-playbook-execution-023"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-full-manual-playbook-execution (Phase Parent) |
| **Completed** | 2026-07-07 |
| **Children** | 001-010 |

---

## What Was Built

Every scenario in sk-design's `manual_testing_playbook` had only ever been exercised by the automated Lane C skill-benchmark harness, which reaches roughly 25-27 of 37 scenarios and deliberately wraps each prompt into a "state what you'd do, don't do it" routing-analysis-only request to avoid real side effects. This phase dispatched all 37 scenario IDs for real (56 constituent prompts once multi-prompt batteries like `AI-001`'s 6 probes and `TV-001`/`TV-002`'s 4 variants each are counted individually) through `cli-opencode` with `openai/gpt-5.5-fast --variant medium`, using the raw scenario prompt rather than the harness's analysis-only wrapper, and graded each against that scenario's own file's Pass/Fail Criteria.

**Result: NOT READY.** 20 PASS / 8 PARTIAL / 9 FAIL across 37 scenario IDs; 9 of 16 critical-path scenarios did not reach a clean PASS (5 FAIL, 2 PARTIAL). Full detail in `verdict-matrix.md`.

### Structure

10 child waves (001-009 parallel, one agent per wave; 010 strictly serial for md-generator-mutating dispatches), each with its own full Level 2 spec-folder documentation (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`/`dispatch-log.md`), all independently `validate.sh --strict` clean before this parent rollup was written.

---

## How It Was Delivered

A smoke test (`MR-001`, run standalone before scaffolding anything) caught a P0-class problem immediately: the raw scenario prompt halted on this repo's own Gate 3 (spec-folder question) instead of doing real design work, since non-interactive `opencode run </dev/null` cannot answer an interactive question. Five iterations of a dispatch-prompt addendum were tested live before landing on a working recipe: a Gate-3 pre-answer clause plus a conditional "no literal target file exists, give illustrative guidance" clause (needed for hypothetical local UI targets, but explicitly omitted for real external targets like md-generator's live-URL extractions, and omitted again once an early wording collided with `system-spec-kit` advisor vocabulary and produced a false routing signal). This recipe was given verbatim to all 10 wave agents.

Each wave agent independently: read its assigned scenario file(s) in full (never worked from a summary), ran the deterministic advisor probe against the clean prompt, ran the real dispatch with the addendum appended, captured the full JSON-lines transcript, graded strictly against that scenario's own criteria (not a generic bar), and authored its own wave's complete documentation set. Two agents caught and reverted unintended real repo mutations mid-run (`AI-002` edited `executor-config.ts`+its vitest; `TV-001`-V1 edited `README.md`) via post-dispatch `git status --porcelain` checks, confirmed clean before their docs were written.

After all 10 waves completed, a separate real side effect was discovered and traced to its root cause: `MR-007` and `AI-001`-P6 (both "wire Open Design" prompts) wrote a native `open-design` MCP entry into the user's real global `~/.config/opencode/opencode.json`. Investigation found `.utcp_config.json` already had a correctly-configured Code Mode entry for the same server -- the packet's own `design-mcp-open-design/SKILL.md` (and ~10 sibling files: `INSTALL_GUIDE.md`, `README.md`, `references/mcp_wiring.md`, `scripts/install.sh`, `scripts/doctor.sh`, `mcp-servers/open-design/README.md`, feature-catalog and playbook entries) documented the native-`opencode.json` path as primary without flagging that this repo already uses Code Mode instead. The global config mutation was reverted, and all ~11 files were corrected to state this repo's canonical wiring explicitly, with the native-registration commands preserved only as general reference for other environments. `doctor.sh` now checks `.utcp_config.json`'s entry as the expected-present one and flags a native entry as redundant if it reappears.
<!-- DECISION: leave the general native-registration documentation in place (not deleted) -- this packet is usable standalone in other repos/environments where Code Mode isn't available, so the capability itself is still legitimate reference material; only this repo's own precedence needed correcting. -->

Finally, the two remaining real side effects were resolved directly: the untracked `DESIGN.md` (repo root) and empty `design-extracts/example-com/` left by `AI-001`-P5 were deleted (low-risk, reproducible test artifacts, confirmed via `git status --porcelain` afterward). The real Open Design project + generation run created by `HM-004` (project `linear-grounded-settings-page`, run `b8362f10-b306-4254-83d7-2bfc343183dc`) was deliberately left running rather than auto-cancelled -- this phase has no safe, verified mechanism to inspect or cancel daemon-side generation state, and an uncertain automated cancellation carries more risk than a documented, operator-visible open item.
<!-- DECISION: leave the live Open Design run as-is rather than attempt automated cleanup -- cancelling unfamiliar external daemon state blind is a worse failure mode than a clearly-flagged manual follow-up. -->

---

## Key Decisions

| Decision | Why |
|----------|-----|
| Dispatch the raw scenario prompt, not the automated harness's routing-analysis-only wrapper | The whole point of this phase was genuine end-to-end execution; the harness's wrapper exists specifically to avoid the real side effects this phase needed to actually observe |
| Grade each scenario strictly against its own file's Pass/Fail Criteria, never a generic bar | Several PARTIAL verdicts (`MR-004`, `PB-002`, `MG-002`, `MG-003`) trace to a single unmet AND-condition (advisor tier) while every other conjunct was correct -- a generic bar would have hidden that precision |
| Treat `AI-001`'s 6-probe battery and `TV-001`/`TV-002`'s 4-variant batteries as individually-graded constituent dispatches, rolled up per the playbook's own feature-verdict rule | Matches the playbook's own stated intent ("PASS iff all six probes...", "PASS iff all variants...") rather than sampling one representative prompt the way the automated harness does |
| Wave 007 added a `PB-005` negative-control dispatch beyond the originally planned 5 | `PB-005`'s own criterion needs both a positive (accessibility) and negative (AI-slop) card-selection proof; a single dispatch couldn't test the disambiguation the scenario actually requires |
| Fix the `design-mcp-open-design` wiring-documentation root cause, not just the config mutation | The mutation was a symptom; every file the packet ships still pointed at the wrong integration path for this repo and would reproduce the same mistake on the next dispatch |
| Delete the two low-risk untracked artifacts; leave the live Open Design run alone | Different risk profiles: reproducible local test files vs. unfamiliar external daemon state with no safe inspection/cancellation path available in this session |
<!-- DECISION markers above are load-bearing for future readers auditing this phase's side-effect handling, not restatements of the obvious. -->

---

## Verification

| Check | Result |
|-------|--------|
| Scenario coverage | 37/37 dispatched (100%) |
| Total real dispatches | 56 (across 10 waves) |
| Scenario-level rollup | 20 PASS / 8 PARTIAL / 9 FAIL |
| Critical-path (16) | 9 PASS / 2 PARTIAL / 5 FAIL |
| Release-readiness gate | **NOT READY** |
| Repo mutations from dispatches | 2 caught + reverted (`README.md`, `executor-config.ts`); confirmed clean via `git status --porcelain` |
| Global config mutation | Found, root-caused, reverted; ~11 packet docs corrected |
| Untracked leftover artifacts | `DESIGN.md` + `design-extracts/example-com/` deleted, confirmed via `git status --porcelain` |
| External daemon side effect | Documented, deliberately left as an operator-visible open item |
| Each child's own `validate.sh --strict` | PASSED (Errors 0, Warnings 0) at time of that wave's own completion |

---

## Known Limitations

1. **This phase found bugs; it did not fix them.** `verdict-matrix.md`'s "Real bugs found" section lists 8 candidate issues (advisor-tier misroutes, `design-interface/SKILL.md` routing-prose conflicts, a skipped ALWAYS resource, an unenforced excluded-alias rule, `md-generator`'s router-precedence loss to `foundations`, a hub intake-order violation, a zero-routing weak-signal case, and a repeated `sk-doc` advisor-tier win over `sk-design`). Remediation is explicitly out of scope for this phase and needs its own scoped follow-up.
2. **Advisor-tier PARTIALs may be partly infra-driven, not pure routing defects.** Several dispatch logs note the native advisor daemon was unavailable mid-run, falling back to a local heuristic scorer with different ranking behavior. This is flagged per-dispatch in the wave dispatch-logs but not independently re-verified with the native daemon warm.
3. **The Open Design project+run created by `HM-004` remains live.** No cleanup was attempted; this needs a manual operator action through Open Design itself if cleanup is wanted.
4. **The `design-mcp-open-design` wiring-doc sweep corrected precedence, not content.** The native-registration commands and config-shape documentation were left intact as legitimate reference for other environments -- only this repo's own canonical path was clarified.
