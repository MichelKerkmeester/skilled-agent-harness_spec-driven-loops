---
title: "Implementation Summary: Docs and Standards Alignment for the Advisor Refinements"
description: "The advisor feature catalog, two playbook scenarios, eleven READMEs and the root README describe what the advisor does today, and a new catalog leaf covers the Pi prompt advisor. The sk-code audit found one P1 in the Pi extension, fixed with a test. Several documents still promised a warm-only hook that never spawns the daemon, and they now describe the bounded cold start."
trigger_phrases:
  - "docs alignment summary"
  - "advisor docs update summary"
  - "pi prompt advisor budget fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/007-docs-and-standards-alignment"
    last_updated_at: "2026-09-26T18:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Aligned the advisor docs with the code and fixed the Pi budget parse"
    next_safe_action: "Operator picks which phase 6 review workstreams to fix"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/pi-prompt-advisor.md"
      - ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which phase 6 review workstreams the operator wants fixed."
    answered_questions:
      - "Packet 030 added no code folder, so no new code README was needed. The test-folder READMEs that list files by name were updated."
      - "The root README's Skill Advisor section was still accurate. It gained the no-brief status line and the full runtime list."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Docs and Standards Alignment for the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-docs-and-standards-alignment |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the advisor's catalog, playbooks or READMEs now meets the behavior the code has today: the status line on a turn with no brief, the prompt gate in front of the CLI, the `includeCompiledRoute` option, the stale-daemon retry and the per-runtime diagnostics label. The Pi prompt advisor has its own catalog entry. The one sk-code P1 in the phase 2 to 5 code is fixed and tested.

### Phase 7: docs-and-standards-alignment

- **Code audit.** Comment hygiene ran clean on all 31 checkable files. The drift guards passed, and a MiMo checklist audit reported one P1 and six P2 findings. The P1 was real. The Pi extension parsed the hook budget with `Number(...) || 2500`, so a negative value such as `-100` became a negative deadline and Pi dropped a live brief for the fallback at once. The extension now uses a named default and the hook's own positive-integer rule, with a test for a non-positive value.
- **Feature catalog.** The Claude hook, OpenCode plugin, `advisor_recommend` and skill-advisor CLI leaves describe the current request path. A new `pi-prompt-advisor.md` leaf covers the Pi extension, and the root index lists it. Two system-spec-kit leaves that describe the advisor hook path were corrected as well.
- **Playbooks.** CL-001 expects the status-headed fallback where it used to expect `{}`. The transport-down scenario sent `hello`, which the gate declines before any CLI call, so it tested nothing. It now sends a work prompt that reaches the CLI.
- **READMEs.** The advisor skill README, its hook, runtime and test-folder READMEs, the four spec-kit hook adapter READMEs, the OpenCode plugins README and the repository README were brought up to date. Packet 030 added no code folder, so no new README was needed.
- **Stale design claims.** Several documents said the prompt hook probes the socket, runs the CLI warm-only and never spawns the daemon. The hook passes `--no-warm-only`, and the CLI starts the daemon within a bounded 5 second window before it falls back to a degraded local answer. Those passages now describe that design. This drift predates packet 030.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | Named default budget and the hook's positive-integer parse |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Modified | A non-positive budget keeps the live brief |
| `.skilled/skills/system-skill-advisor/feature-catalog/` | Modified | Five leaves and the root index, plus the new Pi leaf |
| `.skilled/skills/system-spec-kit/feature-catalog/` | Modified | Directive dedup leaf, CLI hook fallback leaf and its root entry |
| `manual-testing-playbook/` scenarios CL-001 and the transport-down check | Modified | Expected signals and a prompt that passes the gate |
| READMEs in both skills, `.opencode/plugins/` and the repository root | Modified | Current behavior, runtime list and test file inventories |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, `ARCHITECTURE.md` | Modified | Hook reference and architecture checked against the facts sheet |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modified | A fan-out run keeps its dashboards per lineage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote a facts sheet of the phase 2 to 5 behavior changes, each tied to the code lines that prove it. MiMo v2.6 Pro at high effort ran the checklist audit and a read-only document inventory against that sheet. The orchestrator opened every cited line before a finding counted. Each confirmed stale passage became a one-file brief naming the sentences to change and the code behind them. MiMo carried out eighteen briefs, three at a time, and the orchestrator checked every changed sentence against its code. Passages MiMo flagged but left alone, and one false claim the orchestrator found, went into three follow-up briefs. The Pi fix waited until the phase 6 review closed, because that review read the file.

The orchestrator made one edit itself: it wrapped a 122-character comment that the Pi fix introduced.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the six P2 line-length lines as they are | The two tool-schema descriptors sit among sibling lines of 124 to 196 characters, and the two workflow YAML lines sit in files that already hold 295 lines over 120. The two outage-head template literals stay whole so the hook and the plugin carry byte-identical, greppable text |
| Correct the warm-only claims to the cold-start design | The operator's standing direction for this packet is to fix the docs to match the code. The code runs the CLI with `--no-warm-only` |
| Leave the phase 6 review findings unfixed | They are the operator's call, and fixing them would change code this phase only documents |
| Keep the CLI fallback leaf's file name and trigger phrases | Renaming the file would break its inbound links. The old phrases still help retrieval |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` over the 35 changed code files | 31 clean, 0 violations, 4 workflow YAML files skipped by the checker and scanned by hand |
| `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Exit 0, both guards PASS |
| Pi hook test, `npx vitest run tests/hooks/prompt-advisor.vitest.ts` | 11 of 11 pass. With the fix reverted the new test fails and the other 10 pass, so the test catches the defect |
| Advisor runtime suite, `npx vitest run` in `runtime/` | 949 passed, 1 failed, 6 skipped. The baseline was 947 passed and 2 failed. The failure is the routing-divergence ratchet, `rr-iter3-093`, which failed before this phase and involves no file it changed. The timing-sensitive freshness bench passed this run |
| sk-doc validators, baseline against final | `validate_document.py` 0 issues on all 26 edited documents. Catalog packages: system-skill-advisor 9 to 8 warnings, system-spec-kit 84 to 84, 0 failures. Playbook packages 0 violations |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | Exit 0. All eight folders `RESULT: PASSED`, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase 6 review's twelve P2 findings are open.** `../006-fanout-deep-review/review/review-report.md` groups them into six workstreams. Three touch code this packet changed: the runtime enums in `advisor_validate`, the shim cutting an operator budget above about 2200 ms, and the Pi dedup comment.
2. **The CLI fallback leaf keeps its old file name.** `cli-runtime-warm-only-fallbacks.md` now describes a hook that is not warm-only. A rename would need every inbound link updated.
3. **No new playbook scenarios.** The stale-daemon retry and the Pi deadline need fault injection. The automated tests already do that.
<!-- /ANCHOR:limitations -->

---
