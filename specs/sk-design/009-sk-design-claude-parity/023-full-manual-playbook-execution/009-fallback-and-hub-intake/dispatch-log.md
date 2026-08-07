# Dispatch Log: Wave 009 - Fallback & Hub-Manager Intake Dispatches

One row per dispatch executed. Advisor probe run via `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<clean exact prompt>" --threshold 0.8`. Real dispatch run via `timeout 300 opencode run --model openai/gpt-5.5-fast --variant medium --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "<prompt + addendum>" </dev/null`. Transcripts captured at `/tmp/skd-<dispatch_id>-response.jsonl`.

---

## FR-001-audit

- **Scenario**: `07--fallback-and-resilience/no-card-matches-fallback.md` (FR-001, `audit` variant)
- **Prompt used** (AUTHORED, not scenario-verbatim — the scenario file gives an exact prompt only for the `foundations` variant; the `audit` variant is described solely by its expected fallback-line text. Authored following the same structural pattern, deliberately avoiding every `design-audit` procedure-card trigger word):
  ```
  audit: explain whether a headline that sits slightly heavier than the body copy on this settings screen deserves a design critique note, or whether it is within normal visual-hierarchy variance. Keep it advisory and state whether a procedure card applies before answering.
  ```
- **NO_TARGET_CLAUSE**: Applied (references hypothetical "this settings screen", not a live-URL extraction).
- **Advisor probe**: Unstable across repeated runs — one run returned `sk-design` tied with `sk-code` at confidence `0.95` (local fallback scorer, native daemon reported unavailable); a repeat run reproduced the same tie. Recorded as observed.
- **Resolved mode/packet (real dispatch)**: `sk-design` -> `audit` (internal `advisor_recommend` call inside the transcript showed `sk-design` at confidence `0.82`). Loaded `sk-design` hub then `design-audit` packet only — no other procedure card loaded.
- **Verdict**: **PASS**
- **Rationale**: Response text states `"Procedure applied: none - baseline audit workflow. This is a narrow visual-hierarchy judgment, not an accessibility, AI-slop, or full polish-gate procedure-card case."` before substantial output, matching FR-001's PASS criterion: *"each mode states the exact no-card fallback line, loads no unrelated procedure card, does not load every card in the folder, and continues with that mode's baseline workflow."*

---

## FR-002-motion

- **Scenario**: `07--fallback-and-resilience/direct-fallback-without-subagents.md` (FR-002, `motion` variant)
- **Prompt used** (scenario-verbatim exact prompt):
  ```
  Subagents are unavailable. motion: define the feedback states and reduced-motion path for this toolbar directly in the current session, and show the procedure card, context basis, proof line, and tool boundary you used.
  ```
- **NO_TARGET_CLAUSE**: Applied (references hypothetical "this toolbar", not a live-URL extraction).
- **Advisor probe**: Unstable — first run returned `memory:save`/`system-spec-kit`/`command-memory-save` (no `sk-design` in top-3, local fallback scorer noise on "context"/"session" keywords); a retry returned an empty array (`[]`) at threshold 0.8. Recorded as observed; did not affect grading.
- **Resolved mode/packet (real dispatch)**: `sk-design` -> `motion` ("SKILL ROUTING: `sk-design` -> `motion`, mode hint supplied by user."). Loaded `sk-design`, `design-motion`, `procedures/interaction_states_pass.md`, `references/animation_decision_framework.md`, `references/micro_interactions.md`, `references/performance_reduced_motion.md`, `shared/register.md`, `assets/motion_pattern_cards.md`.
- **Verdict**: **PASS**
- **Rationale**: Only `memory_match_triggers` (MCP), `skill`, and `read` tool calls appear — no `Task`, `Write`, `Edit`, or `Bash`. Response supplies selected card (`procedures/interaction_states_pass.md`), context basis, a full reduced-motion equivalence table, and an explicit proof line, matching FR-002's PASS criterion: *"motion executes directly without Task, Write, Edit, or Bash and still provides selected card, context basis, reduced-motion proof, and verification risks."*

---

## HM-001

- **Scenario**: `08--hub-manager-intake/context-first-intake.md`
- **Prompt used** (scenario-verbatim exact prompt):
  ```
  Make this product experience feel more premium and production-ready. I have some screenshots and a brand deck, but I am not sure whether this needs interface direction, foundations, motion, or audit.
  ```
- **NO_TARGET_CLAUSE**: Omitted (hub-intake premise question, per the recipe's own named empty-clause category).
- **Advisor probe**: `sk-code` top-1 at confidence `0.82` (native), `sk-design` close second at `0.82` also passing threshold (near-tie).
- **Resolved mode/packet (real dispatch)**: `sk-design` selected; committed to an ordered bundle `audit -> interface -> foundations -> motion-if-needed` after reading `mode-registry.json` and all four mode `SKILL.md` files.
- **Verdict**: **FAIL**
- **Rationale**: The response states `"Route selected: sk-design bundle, ordered as audit -> interface -> foundations -> motion-if-needed."` and only requests the screenshots/brand deck/URL in its final sentence, after the route/plan is already declared. It never explicitly surfaces goal/surface/inputs/constraints/proof-expectations by name, and does not ask one focused disambiguating question or state assumptions before choosing the route — it inverts the required order. Matches HM-001's FAIL criterion: *"it jumps straight to a mode, produces design advice without intake... "* (here, straight to a full ordered bundle functioning as the route) rather than the PASS criterion's required *"surfaces goal, surface, inputs, constraints, and proof expectations before routing, then either asks one focused question or explicitly states assumptions before choosing the smallest useful mode."*

---

## HM-002

- **Scenario**: `08--hub-manager-intake/visible-plan-before-build.md`
- **Prompt used** (scenario-verbatim exact prompt):
  ```
  Design the visual direction for a dense operations dashboard and prepare the implementation handoff. Before any design recommendation, show the selected mode or bundle, context loaded, intended design moves, proof required, and handoff target.
  ```
- **NO_TARGET_CLAUSE**: Omitted (hub-intake premise question; also not "this X" phrasing for a named local surface).
- **Advisor probe**: `sk-design` top-1 at confidence `0.95` (local fallback scorer).
- **Resolved mode/packet (real dispatch)**: `sk-design` UI build bundle: `interface` + `foundations`, handoff target `sk-code`. Loaded `mode-registry.json`, `design-interface`, `design-foundations`, and the full shared reference base (register, context-loading contract, brief-to-dials, design principles, token vocabulary, anti-slop, cognitive laws, data-viz, layout, typography, color, token starter, interface pre-flight, sk-code handoff schema).
- **Verdict**: **PASS**
- **Rationale**: A `"Design Route"` block — selected bundle (`interface` + `foundations`), context loaded, intended design moves, proof required (contrast, data encodings, responsive, keyboard/focus, reduced-motion, interface pre-flight), and handoff target (`sk-code`) — appears in full before the `"Visual Direction"` substantive recommendation section. Matches HM-002's PASS criterion: *"the visible plan appears before any substantive design recommendation and includes selected mode or ordered bundle, context loaded or still missing, intended design moves, proof required before ready, and handoff target."*

---

## HM-003

- **Scenario**: `08--hub-manager-intake/verifier-cadence-pause.md`
- **Prompt used** (scenario-verbatim exact prompt):
  ```
  I only have a Figma export and no rendered responsive checks. Tell me whether this design is ready to ship, and if any proof field is missing, pause the ready claim and name the missing proof.
  ```
- **NO_TARGET_CLAUSE**: Omitted (hub-intake premise question).
- **Advisor probe**: `mcp-figma` top-1 at confidence `0.95` (local fallback scorer, keyword pull on "Figma export"); `sk-design` not surfaced in the probe's own top results at this threshold.
- **Resolved mode/packet (real dispatch)**: Internal `advisor_recommend` call selected `mcp-figma`; the model also explicitly loaded `design-audit` and applied its `audit_contract.md` evidence framework for the readiness gating.
- **Verdict**: **PASS**
- **Rationale**: Response states `"Ready claim paused. This design is not proven ready to ship from a Figma export alone."`, names the specific missing proof fields (`AUDIT EVIDENCE.rendered UI: confirmed`, `AUDIT EVIDENCE.dimensions.responsive`, plus unresolved accessibility layers), and explicitly treats the Figma export as non-acceptance evidence (`"A Figma export can confirm design intent, but it does not prove the implemented UI reflows correctly..."`), routing the gap back to `design-audit`. Matches HM-003's PASS criterion: *"the response refuses a ready claim, names missing proof fields, treats transport output as non-acceptance evidence, and routes the gap back to the selected mode or audit."* None of the FAIL triggers (fabricated checks, invented verifier, ready-based-on-transport-alone) occurred.

---

## HM-004

- **Scenario**: `08--hub-manager-intake/design-mode-pairing-before-run.md`
- **Prompt used** (scenario-verbatim exact prompt):
  ```
  Commission an Open Design generation run for a new settings page, grounding it in one of Open Design's local design systems, and start the run now.
  ```
- **NO_TARGET_CLAUSE**: Omitted (real external target/daemon check, not a named local UI surface).
- **Advisor probe**: `sk-design` top-1 at confidence `0.95` (local fallback scorer).
- **Resolved mode/packet (real dispatch)**: Internal `advisor_recommend` call: `sk-design` at confidence `0.82`, uncertainty `0.12` (native, meets `>= 0.80`). Loaded `design-mcp-open-design`, then `sk-design`, `design-interface`, `design-foundations`, in that order, then queried `open-design_list_skills`, `list_mcp_resources`, `open-design_list_agents`, read the `linear-app` design system, produced a design-read critique, then called `open-design_create_project` and `open-design_start_run` — both against the **live** Open Design daemon (real project `linear-grounded-settings-page`, real run `b8362f10-b306-4254-83d7-2bfc343183dc`; the task brief's possible SKIP/timeout branch did not occur since the daemon was live).
- **Verdict**: **PARTIAL**
- **Rationale**: Advisor confidence (`0.82 >= 0.80`) met; bundle correctly pairs `interface`/`foundations` (design-judgment) with `design-mcp-open-design`; the design-read critique text (`"Design read: product-register settings surface... Grounding moves: Linear dark-native palette..."`) appears in the transcript before the mutating `open-design_start_run` call — satisfying the PASS criterion's *"no mutating Open Design tool call... reported as already executed before that mode's context/critique appears."* However, grepping the transcript's `type:"text"` parts in isolation shows neither `"Transports and Consumers"` nor `"MANDATORY PAIRING"` ever appears in the model's own narrated plan — those strings are present only inside the `skill` tool's returned file content, not cited by name in the visible plan. This is a distinct, unmet AND-condition of HM-004's own PASS criterion: *"the visible plan names the paired mode as a hard precondition citing both the hub's `Transports and Consumers` rule and the packet's MANDATORY PAIRING banner."* None of the explicit FAIL triggers occurred (did not resolve `design-mcp-open-design` alone, did not omit the paired mode, did not fire `start_run` before the critique, did not treat the RUN request as pairing-exempt) — hence PARTIAL rather than FAIL.
- **Side effect note**: This dispatch performed a real, unreversed mutation against a live external system (Open Design project + generation run). Flagged in `implementation-summary.md` Known Limitations for operator awareness; cleanup is an operator decision.

---

## Summary

| Dispatch ID | Scenario | Verdict |
|---|---|---|
| FR-001-audit | no-card-matches-fallback.md (audit) | PASS |
| FR-002-motion | direct-fallback-without-subagents.md (motion) | PASS |
| HM-001 | context-first-intake.md | FAIL |
| HM-002 | visible-plan-before-build.md | PASS |
| HM-003 | verifier-cadence-pause.md | PASS |
| HM-004 | design-mode-pairing-before-run.md | PARTIAL |
