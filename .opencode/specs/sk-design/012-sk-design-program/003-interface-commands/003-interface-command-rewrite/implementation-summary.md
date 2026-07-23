---
title: "Implementation Summary: rewrite the /interface:* command bodies into literal design prompts"
description: "Implemented: the five /interface:* command bodies are literal self-contained design prompts with one runtime creation-contract include each; presentation authority inverted; command test suite extended to 19/19 green. Live include sentinel deferred to an OpenCode runtime session."
trigger_phrases:
  - "interface command rewrite summary"
  - "creation-contract include implemented"
  - "literal interface prompt summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/003-interface-command-rewrite"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementer"
    recent_action: "Rewrote the five wrappers + include; tests 19/19 green."
    next_safe_action: "Run the live OpenCode include sentinel to close CHK-002."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/creation-contract.md"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-008-impl-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-interface-command-rewrite |
| **Status** | IMPLEMENTED — live include sentinel deferred |
| **Level** | 2 |
| **Verification** | command test suite 19/19 green (15 baseline + 4 new) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five `/interface:*` command bodies were rewritten from thin routers into **literal, self-contained design prompts** following the 004 research's 9-step grammar (research §6, §7). Each body now states a mode-specific mission and the consequence of weak work, lists its local intake fields on `$ARGUMENTS`, parses `:auto|:confirm` first, names its fit / siblings / cannot-run / stable `workflowMode`, grounds in owned evidence, states the authority split, expands the shared lifecycle **exactly once** through the runtime include `@.opencode/skills/sk-design/shared/creation-contract.md`, gives an ordered outcome sequence and artifact refinement, and preserves all four typed statuses. Taste stays in the mode: bodies name intake fields and attribute palettes/type/timing/verdicts to the selected mode, never a command-owned recipe or taste table.

The authority split was reconciled: each wrapper now declares itself the normative prompt and demotes its presentation asset to consolidated-question + display fixtures (the old "Presentation source of truth" declarations are removed from both the wrappers and the presentation headers). The paired auto/confirm YAML keep their execution-control role unchanged. `command-metadata.json` carries no presentation-authority field, so it already mirrors the split — confirmed by reading it — and was left unchanged to avoid disturbing `validateMetadata`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/interface/{design,foundations,motion,audit,design-reference}.md` | Modified | Rewrote each body to the literal grammar + one canonical `@`-include; inverted the presentation-authority declaration |
| `.opencode/commands/interface/assets/interface-*-presentation.txt` (5) | Modified | Demoted header to "consolidated-question and display fixtures … command body is the normative prompt" |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Modified | Added 4 assertions: exactly-one canonical include, four statuses, literal-body (not thin router), audit read-only + md-generator measured-only |
| `.opencode/skills/sk-design/command-metadata.json` | Unchanged | No presentation-authority field to flip; already consistent with the split |
| `.opencode/commands/interface/assets/interface-*-{auto,confirm}.yaml` (10) | Unchanged | Execution-control role unchanged by design |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in the `0093-sk-design-012-gap-research` worktree. Sequence: captured the green 15-test baseline → rewrote the five wrappers from the §7 body cores (preserving frontmatter, register, lanes, execution targets, `workflowMode`, the eight visible blocks, and the four statuses) → verified the 15 baseline still green → inverted the five presentation headers → extended the contract test with four new assertions → re-ran the full suite (19/19). The presentation-demotion + wrapper rewrite landed together so no mixed-authority intermediate was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite bodies, keep architecture | Route/intake/proof/handoff were fine; only the literal prompt experience was missing (research §3, §11) |
| One native `@`-include, no copies | Avoids five-source schema drift; native include is source-confirmed for OpenCode 1.18.4 (research §4) |
| Left `command-metadata.json` unchanged | It has no presentation-authority field — reading it confirmed it already reflects the wrapper-normative split; editing it only risks `validateMetadata` |
| Wrapper assertions live in the contract test | `interface-command-contract.test.mjs` is the file that already loads wrapper bodies; the surface-check test validates metadata↔YAML only |
| Status is IMPLEMENTED, not Complete | The live include sentinel is a runtime gate not runnable from this environment; the mechanism is source-confirmed + statically verified, but the end-to-end runtime check is honestly deferred |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` | PASS — 19 tests, 19 pass, 0 fail (15 baseline preserved + 4 new) |
| Exactly one canonical `@`-include per wrapper | PASS — `grep -c` = 1 for all five |
| No residual thin-router phrase / "source of truth" / legacy Read-imperative | PASS — 0 hits across `commands/interface/` |
| Include target exists | PASS — `shared/creation-contract.md` present |
| No command-owned taste tables / nested dispatch / evidence-free verified / silent amendment | PASS — boundary-error tests green for all surfaces |
| Live OpenCode include sentinel (contract bytes reach the model-visible prompt) | DEFERRED — needs an OpenCode runtime session (see Limitations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Live include sentinel deferred (CHK-002).** Proving the contract's bytes reach the model-visible prompt requires a live OpenCode command-discovery + prompt-delivery path, which this environment cannot exercise. The include mechanism is source-confirmed against the tagged OpenCode 1.18.4 parser/resolver (research §4, §16) and statically verified (exactly one canonical include per wrapper; target file present). To close: in an OpenCode 1.18.4 session, invoke a `/interface:*` command and confirm the creation-contract text appears in the rendered prompt. This is the only reason the packet is IMPLEMENTED rather than Complete.
- The auto/confirm fixture matrix (five auto, five confirm-wait, ASK/FAIL/DEFER, proof downgrade/blocked, audit no-write, md-generator output) is covered structurally by the contract + surface tests; a dedicated live-fixture run is part of the same deferred runtime gate.
<!-- /ANCHOR:limitations -->
