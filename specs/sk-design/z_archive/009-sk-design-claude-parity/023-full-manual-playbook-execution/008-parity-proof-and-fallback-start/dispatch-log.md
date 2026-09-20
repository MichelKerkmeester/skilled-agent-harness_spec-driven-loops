---
title: "Dispatch Log: Wave 008 - Parity-Proof and Fallback-Start"
description: "Per-dispatch evidence table: exact prompt, advisor probe, resolved mode/packet/resources, verdict, and cited rationale for all 5 dispatches owned by this wave."
trigger_phrases:
  - "dispatch log wave 008"
  - "PB-006 PB-007 FR-001 dispatch evidence"
importance_tier: "high"
contextType: "general"
---
# Dispatch Log: Wave 008 - Parity-Proof and Fallback-Start

Evidence table for the 5 dispatches this agent ran under wave `008-parity-proof-and-fallback-start`. Every dispatch followed the validated 2-step recipe (deterministic advisor probe with the clean prompt, then a real `opencode run` dispatch with the standalone-evaluation addendum) and ran strictly one at a time. `FR-001-interface` and `FR-001-motion` are flagged **authored-to-pattern**: the source file (`no-card-matches-fallback.md`) only ships one exact prompt (foundations); these two variants were authored to match that file's own pattern (mode hint + narrow advisory design question + explicit "state whether a procedure card applies before answering" + no card-trigger words), not copied verbatim from the file.

---

## PB-006

| Field | Value |
|---|---|
| **Dispatch ID** | `PB006` |
| **Scenario ID** | `PB-006` (`shared-polish-gate-selection-proof.md`) |
| **Prompt source** | Verbatim exact prompt from the scenario file |
| **Exact prompt used** | `Run the final design polish gate for this nearly finished checkout UI. State the public sk-design mode, the shared internal procedure card you selected, the owning reviewer, and how findings route across audit, foundations, motion, interface, and sk-code.` |
| **`NO_TARGET_CLAUSE` applied** | Non-empty — "this nearly finished checkout UI" names a hypothetical local UI target that does not exist in this repo |
| **Advisor top-1 / confidence** | `sk-code` 0.9157 (top-1); `sk-design` 0.8841 (second); `deep-loop-workflows` 0.82 (third) — all 3 pass the 0.8 threshold |
| **Resolved mode / packet** | `audit` (`design-audit` packet) |
| **Resources loaded (skill calls)** | `sk-design` (hub), `design-audit` |
| **Tool calls** | `skill` x2 only — no `Write`/`Edit`/`Bash` |
| **Transcript** | `/tmp/skd-PB006-response.jsonl` |
| **Verdict** | **PARTIAL** |
| **Rationale (cited criterion)** | Response names `../shared/procedures/polish_gate_orchestration.md`, identifies `design-audit` as owning reviewer, and correctly separates review ownership (`audit` owns the gate/severity/acceptance) from fix ownership (`foundations`, `motion`, `interface`, `sk-code` each receive specific fix categories) — satisfying most of PASS: *"the response names `shared/procedures/polish_gate_orchestration.md`, identifies `design-audit` as the owning reviewer, ... routes fixes to owning modes or `sk-code`, and does not expose a public polish skill."* However the response grouped findings by `P1`/`P2`/`P3` severity labels, not the taxonomy the card's own Required Fields table mandates: *"Output contract \| A consolidated review plan or findings report grouped into blockers, quality issues, polish recommendations, open decisions, and out-of-scope observations."* (`polish_gate_orchestration.md` line 25). This is a real deviation from the PASS wording *"groups findings into blockers/quality issues/polish notes/open decisions/out-of-scope observations"* even though none of the file's own FAIL triggers (duplicated card, public route, omitted owner mapping, file edits, collapsed-into-audit ownership) occurred. |

---

## PB-007

| Field | Value |
|---|---|
| **Dispatch ID** | `PB007` |
| **Scenario ID** | `PB-007` (`interface-variation-set-selection-proof.md`) |
| **Prompt source** | Verbatim exact prompt from the scenario file |
| **Exact prompt used** | `Give me three genuinely distinct visual directions for this fintech onboarding flow, not three safe variations of the same idea. Before giving the directions, state the public sk-design mode, the internal procedure card you selected, and why it is not the single-direction aesthetic_direction card.` |
| **`NO_TARGET_CLAUSE` applied** | Non-empty — "this fintech onboarding flow" names a hypothetical local UI target that does not exist in this repo |
| **Advisor top-1 / confidence** | `sk-design` 0.8656 (top-1, only result) |
| **Resolved mode / packet** | `interface` (`design-interface` packet) |
| **Resources loaded (read calls)** | `mode-registry.json`, `design-interface/SKILL.md`, `design-interface/references/design-process/variation_diversity.md`, `design-interface/procedures/variation_set.md`, `shared/register.md`, `design-interface/procedures/aesthetic_direction.md`, `design-interface/references/design-process/design_principles.md`, `design-interface/references/design-process/brief_to_dials.md` |
| **Tool calls** | `skill` x1, `read` x9, `grep` x1 — no `Write`/`Edit`/`Bash` |
| **Transcript** | `/tmp/skd-PB007-response.jsonl` |
| **Verdict** | **PARTIAL** |
| **Rationale (cited criterion)** | Response satisfies 5 of 6 PASS elements: *"advisor top-1 is `sk-design`"* (0.8656 ≥ 0.80), *"resolved mode is `interface`"*, *"the response names `design-interface/procedures/variation_set.md` as the selected card"*, *"states why it differs from `aesthetic_direction.md`"* (explicit rationale given), and produces 3 directions ("Verification Console", "Private Banking Atelier", "Market Signal Map") with materially distinct palettes, layouts, motion treatments, and signature moves — not near-identical variations of a median. However the final response text never uses the phrase "seed of thought" and never cites `variation_diversity.md` by name, even though the file was read as a tool call during the turn. This trips the file's own explicit FAIL trigger: *"FAIL iff ... the seed-of-thought debias is omitted or not named ..."* — graded `PARTIAL` rather than a full `FAIL` because every other PASS element (including the harder behavioral bar of genuine directional distinctness) was independently met. |

---

## FR-001-foundations

| Field | Value |
|---|---|
| **Dispatch ID** | `FR001-foundations` |
| **Scenario ID** | `FR-001` foundations case (`no-card-matches-fallback.md`) |
| **Prompt source** | Verbatim exact prompt from the scenario file |
| **Exact prompt used** | `foundations: explain whether this existing neutral token name should be semantic or surface-level. Keep it advisory and state whether a procedure card applies before answering.` |
| **`NO_TARGET_CLAUSE` applied** | Empty — the prompt asks about a design-token naming decision, not a named local UI page/surface (no page/component target implied) |
| **Advisor top-1 / confidence** | `[]` — no skill cleared the 0.8 threshold for this narrow advisory prompt |
| **Resolved mode / packet** | `foundations` (`design-foundations` packet), resolved via the `foundations:` mode hint |
| **Resources loaded (skill calls)** | `sk-design` (hub), `design-foundations` |
| **Tool calls** | `skill` x2 only — no `Write`/`Edit`/`Bash` |
| **Transcript** | `/tmp/skd-FR001-foundations-response.jsonl` |
| **Verdict** | **PASS** |
| **Rationale (cited criterion)** | Response states the byte-exact expected line *"Procedure applied: none - baseline foundations workflow."* before substantial output, loads no unrelated procedure card, does not load every card in the folder, and continues with a baseline advisory token-naming answer — meeting *"PASS iff each mode states the exact no-card fallback line, loads no unrelated procedure card, does not load every card in the folder, and continues with that mode's baseline workflow."* |

---

## FR-001-interface (authored-to-pattern)

| Field | Value |
|---|---|
| **Dispatch ID** | `FR001-interface` |
| **Scenario ID** | `FR-001` interface variant (`no-card-matches-fallback.md`) — **authored prompt, not verbatim from file** (the source file only ships an exact prompt for the foundations case) |
| **Prompt source** | **Authored to the file's own pattern**: mode hint + narrow advisory design question + explicit "state whether a procedure card applies before answering" + no card-trigger words from `design-interface/SKILL.md`'s Procedure Card Selection table (missing-facts, greenfield-direction, wireframe, multi-direction, prototype, deck, final-polish all avoided) |
| **Exact prompt used** | `interface: explain whether this existing card component's corner radius should match the primary button's radius token or use its own smaller value. Keep it advisory and state whether a procedure card applies before answering.` |
| **`NO_TARGET_CLAUSE` applied** | Non-empty — "this existing card component" names a hypothetical local UI element, matching the rule's own example pattern (e.g. "this modal") |
| **Advisor top-1 / confidence** | `[]` — no skill cleared the 0.8 threshold |
| **Resolved mode / packet** | `interface` (`design-interface` packet), resolved via the `interface:` mode hint; the live dispatch also independently ran `mk_skill_advisor_advisor_recommend` internally, which surfaced `system-spec-kit` noise from the dispatch-note text, and the model correctly discarded it as irrelevant to the substantive design request |
| **Resources loaded (skill + read calls)** | `design-interface`, `design_principles.md`, `shared/register.md`, `brief_to_dials.md`, `shared/context_loading_contract.md`, `interface_preflight_card.md` |
| **Tool calls** | `skill` x1, `read` x5, plus 2x `mk-spec-memory_memory_match_triggers` and 1x `mk_skill_advisor_advisor_recommend` (advisory/read-only MCP calls) — no `Write`/`Edit`/`Bash` |
| **Transcript** | `/tmp/skd-FR001-interface-response.jsonl` |
| **Verdict** | **PASS** |
| **Rationale (cited criterion)** | Response states *"Procedure applied: none - baseline interface workflow."* twice, explicitly naming why no card matched ("not a missing-facts, variation, prototype, deck, wireframe, or final-polish procedure"), loads no unrelated card, and continues with a baseline advisory token-decision answer — meeting the `interface` variant check: *"`interface`: `Procedure applied: none - baseline interface workflow`."* and the shared PASS bar of *"loads no unrelated procedure card, does not load every card in the folder, and continues with that mode's baseline workflow."* |

---

## FR-001-motion (authored-to-pattern)

| Field | Value |
|---|---|
| **Dispatch ID** | `FR001-motion` |
| **Scenario ID** | `FR-001` motion variant (`no-card-matches-fallback.md`) — **authored prompt, not verbatim from file** (the source file only ships an exact prompt for the foundations case) |
| **Prompt source** | **Authored to the file's own pattern**: mode hint + narrow advisory design question + explicit "state whether a procedure card applies before answering" + no card-trigger words from `design-motion/SKILL.md`'s single Procedure Card Selection row (hover/active/focus/disabled/loading/selected/navigation/forms/custom-widgets/missing-feedback all avoided, plus no final-polish language) |
| **Exact prompt used** | `motion: explain whether this existing modal's entrance duration should be 200ms or 300ms. Keep it advisory and state whether a procedure card applies before answering.` |
| **`NO_TARGET_CLAUSE` applied** | Non-empty — "this existing modal" is explicitly listed in the rule's own example set of hypothetical local UI targets |
| **Advisor top-1 / confidence** | `[]` — no skill cleared the 0.8 threshold |
| **Resolved mode / packet** | `motion` (`design-motion` packet), resolved via the `motion:` mode hint |
| **Resources loaded (skill calls)** | `design-motion` |
| **Tool calls** | `skill` x1 only — no `Write`/`Edit`/`Bash` |
| **Transcript** | `/tmp/skd-FR001-motion-response.jsonl` |
| **Verdict** | **PASS** |
| **Rationale (cited criterion)** | Response states *"Procedure applied: none - baseline motion workflow."* before substantial output, explicitly distinguishing the request from *"an interaction-state pass or final polish procedure"* (correctly avoiding both `interaction_states_pass.md` and the shared polish-gate card), loads no unrelated card, and continues with a baseline advisory timing answer — meeting the `motion` variant check: *"`motion`: `Procedure applied: none - baseline motion workflow`."* and the shared PASS bar. |

---

## Verdict Summary

| Dispatch | Verdict |
|---|---|
| `PB-006` | PARTIAL |
| `PB-007` | PARTIAL |
| `FR-001-foundations` | PASS |
| `FR-001-interface` (authored-to-pattern) | PASS |
| `FR-001-motion` (authored-to-pattern) | PASS |
