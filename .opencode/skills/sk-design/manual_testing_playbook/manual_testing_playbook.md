---
title: "sk-design: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, execution expectations, and per-feature validation files for the sk-design parent-skill hub."
version: 1.2.0.0
---

# sk-design: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live sk-design skill - no mocks, no stubs, no "unautomatable" verdicts. Scenarios verify the AI's actual routing behavior: which mode it resolves, which packet it loads, which shared resources it cites, and which advisor decision it follows. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP (with a documented sandbox blocker).

This document combines the manual-validation contract for the `sk-design` parent-skill hub into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide. Per-feature files provide the deeper execution contract for each scenario, including the user request, expected router signals, expected resource loading paths, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern. The root document acts as the directory, review surface, and orchestration guide; per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--mode-routing/`
- `02--advisor-integration/`
- `03--transform-verb-framing/`
- `04--md-generator-pipeline/`
- `05--shared-reference-base/`
- `06--parity-behavior/`
- `07--fallback-and-resilience/`
- `08--hub-manager-intake/`

---

## 1. OVERVIEW

This playbook provides 37 deterministic scenarios across 8 categories validating the `sk-design` parent-skill hub. Each feature keeps its stable `{PREFIX}-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note: the playbook covers sk-design's parent-hub routing at the current skill files. It exercises:
- Mode routing across the five `packetKind: "workflow"` registry modes: `interface`, `foundations`, `motion`, `audit`, and `md-generator`; plus the one `packetKind: "transport"` mode, `design-mcp-open-design`.
- The mode-hint override rule from the hub: a hint such as `motion: ...` resolves the matching mode.
- Skill advisor integration: `sk-design` wins positive design controls at confidence `>= 0.80`; pure code, documentation, and code-correctness review requests (even with review/audit-adjacent wording) route elsewhere.
- Transform-verb routing from `mode-registry.json`: interface-frame `make it`, audit-frame `should it be`, `aliasOnly`, and excluded aliases.
- The md-generator pipeline as the only mutating mode with `backendKind: playwright-extract` and Write/Edit/Bash access, including its authoring-boundary refusal to fabricate a token table from a brief-only request with no live site.
- Shared reference base usage: the hub stays routing-only, modes cite shared references, and the shared base is not a user workflow.
- Parity behavior proof: selected procedure card rationale, context/proof gates, md-generator preservation confirmation, motion/audit procedure selection, interface variation-set selection, and shared polish-gate selection.
- Fallback and resilience proof: exact no-card fallback lines and direct fallback behavior without subagents, including the md-generator backend-preserving distinction.
- Hub manager-intake proof: context-first intake fields, visible plan before substantial work, verifier-cadence pause when required proof is missing, and design-mode pairing before a design-affecting Open Design run.

### Realistic Test Model

1. A realistic user request is given to an orchestrator that has the sk-design skill registered.
2. The orchestrator consults the skill advisor and decides whether to invoke `sk-design`, route to another skill, or ask for disambiguation.
3. The hub resolves `workflowMode` from `mode-registry.json` and `hub-router.json` using aliases, router signal classes, transform framing, or an explicit mode hint.
4. The operator captures: which skill won the advisor vote, which mode sk-design resolved, which mode packet was loaded, which shared resources were cited, which tools were used, and what the AI's response actually was.
5. The scenario passes only when the routing is correct, the resource-loading is exact enough to satisfy the feature contract, and the user-visible outcome is sound.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior.
- The expected mode resolution and why, including aliases and router signal classes quoted from `mode-registry.json` or `hub-router.json`.
- The exact packet and shared resources the AI MUST load, using paths relative to `.opencode/skills/sk-design/`.
- The expected advisor behavior: win, defer, or route elsewhere.
- The pass/fail criteria with binary grading.
- Failure triage steps.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. The sk-design hub is present at `.opencode/skills/sk-design/` with `SKILL.md`, `mode-registry.json`, `hub-router.json`, `shared/`, and all five workflow mode folders plus the `design-mcp-open-design` transport packet intact.
3. The skill advisor is callable either through the runtime hook or through `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.
4. Operators capture evidence under `/tmp/skd-<SCENARIO-ID>/` or `/tmp/skd-<SCENARIO-ID>.txt`.
5. Scenarios outside `04--md-generator-pipeline/` are read-only routing tests against skill assets.
6. `md-generator` scenarios may write only to sandboxed output paths under `/tmp/skd-*` during execution.
7. Concurrency cap: advisor probes can run concurrently up to 5 workers; md-generator pipeline runs MUST run serially because they use browser tooling and write output artifacts.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user prompt that was tested.
- The skill advisor output: top-1 skill, confidence score, gap to second, and advisor status.
- The resolved `workflowMode` reported by sk-design.
- The exact packet loaded, relative to `.opencode/skills/sk-design/`.
- The exact list of shared resources and mode resources loaded.
- The tool surface used: read-only for `interface`, `foundations`, `motion`, and `audit`; mutating tool surface only for `md-generator`.
- The selected procedure card when the scenario requests procedure-selection proof.
- The AI's user-visible response.
- The scenario verdict: PASS, PARTIAL, FAIL, or SKIP, with one-line rationale.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Skill advisor probe: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<prompt>" --threshold 0.8`.
- AI prompt: `As the orchestrator: <instruction>`.
- Resource path notation: paths are relative to `.opencode/skills/sk-design/`, such as `design-interface/SKILL.md` or `shared/register.md`.
- Evidence path notation: `/tmp/skd-<SCENARIO-ID>/`.
- All non-md-generator scenarios write evidence only under `/tmp/`.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`.
2. Per-feature files under `manual_testing_playbook/{NN--category-name}/`.
3. Scenario execution evidence: advisor outputs, mode-resolution logs, resource-loading transcripts, and responses.
4. Feature-to-scenario coverage map in this document.
5. Triage notes for all PARTIAL or FAIL outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:
1. Preconditions were satisfied.
2. Exact prompt was used verbatim.
3. Skill advisor returned the expected top-1 behavior.
4. sk-design resolved the expected `workflowMode`.
5. The AI loaded the expected packet path.
6. The AI loaded or cited the expected shared resources.
7. The tool surface matched `mode-registry.json`.
8. The user-visible outcome would satisfy a real operator request.

### Verdict Rules

- `PASS`: all acceptance checks true.
- `PARTIAL`: routing and packet loading are correct, but resource-loading has minor drift that does not change the workflow.
- `FAIL`: advisor lost unexpectedly, wrong mode resolved, wrong packet loaded, mutation permission used by a read-only mode, or a required shared resource was missed.
- `SKIP`: a documented external blocker, such as advisor unavailability or missing Playwright dependencies.

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are PASS.
- `PARTIAL`: at least one mapped scenario is PARTIAL, none are FAIL.
- `FAIL`: any mapped scenario is FAIL.

Critical-path scenarios are MR-001, MR-002, MR-003, MR-004, MR-005, MR-007, AI-001, AI-002, TV-001, TV-002, MG-001, MG-004, SR-003, PB-001, PB-002, and PB-003.

Candidate additions for the next operator-confirmed critical-path policy are PB-004, PB-005, PB-006, FR-001, FR-002, HM-001, HM-002, and HM-003. They are not silently promoted by this playbook update.

Release is READY only when:
1. No feature verdict is FAIL.
2. All critical-path scenarios are PASS.
3. Coverage is 100% of playbook scenarios.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic and routing-architecture explanations in this root playbook. Put scenario-specific acceptance caveats and resource-path expectations in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one operator as coordinator.
3. Saturate remaining worker slots up to 5 for advisor probes.
4. Run md-generator scenarios serially.
5. Pre-assign explicit scenario IDs to each wave before execution.
6. After each wave, save evidence under `/tmp/skd-wave-NN/`, then begin the next wave.

### What Belongs in Per-Feature Files

- Real user request.
- Exact prompt to feed into the orchestrator.
- Expected router signals quoted from `mode-registry.json` or `hub-router.json`.
- Expected packet and shared resource load list.
- Expected advisor behavior.
- Pass/fail criteria.
- Failure triage steps.

---

## 7. MODE ROUTING (`MR-001..MR-007`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `MR-001` | Interface Mode | Generic visual direction routes to `interface` | `Make this SaaS pricing page look less generic and give it a distinctive visual direction.` | `interface-aliases`: `make it look good`; `interface-taste`: `less generic`, `visual direction`; packet `design-interface` | `01--mode-routing/interface-mode.md` |
| `MR-002` | Foundations Mode | Static token-system request routes to `foundations` | `Create an OKLCH color token system, typography scale, spacing rhythm, and responsive grid for this dashboard.` | `foundations-color`: `oklch`; `foundations-type`: `typography`; `foundations-layout`: `grid`; `foundations-tokens`: `design-tokens` | `01--mode-routing/foundations-mode.md` |
| `MR-003` | Motion Mode | Temporal interaction request routes to `motion` | `Design the hover micro-interactions and reduced-motion fallback for this command menu.` | `motion-aliases`: `micro-interactions`, `reduced motion`; `motion-temporal`: `hover effect` | `01--mode-routing/motion-mode.md` |
| `MR-004` | Audit Mode | QA request routes to `audit` | `Audit this checkout UI for WCAG contrast, keyboard focus, responsive issues, and design slop.` | `audit-aliases`: `design audit`; `audit-accessibility`: `wcag contrast`; `audit-quality`: `design-qa` | `01--mode-routing/audit-mode.md` |
| `MR-005` | md-generator Mode | Live-site extraction request routes to `md-generator` | `Extract the design system from https://example.com into a DESIGN.md style reference.` | `md-generator-aliases`: `extract design system`; `md-generator-artifacts`: `design.md`; backend `playwright-extract` | `01--mode-routing/md-generator-mode.md` |
| `MR-006` | Mode Hint Override | `motion:` hint resolves `motion` | `motion: make the menu transition feel bolder and more deliberate.` | Hub rule: mode hint like `motion: ...` overrides; `motion-temporal`: `transition design` | `01--mode-routing/mode-hint-motion.md` |
| `MR-007` | Open Design Transport Mode | Open Design wiring request routes to the nested transport packet `design-mcp-open-design`, not a design-judgment mode or the external `mcp-figma` sibling | `Wire Open Design's MCP server into opencode so I can drive od cli from the terminal.` | `design-mcp-open-design-aliases`: `wire open design`, `od cli`; `packetKind: "transport"` | `01--mode-routing/mcp-open-design-mode.md` |

---

## 8. ADVISOR INTEGRATION (`AI-001..AI-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `AI-001` | Positive Design Controls | Verify sk-design wins positive design prompts at confidence `>= 0.80` | Multi-prompt battery in file | Advisor top-1 `sk-design`; hub resolves matching mode | `02--advisor-integration/positive-design-controls.md` |
| `AI-002` | Pure Code Negative | Verify pure code edit routes to sk-code, not sk-design | `Refactor the parseExecutorConfig function in a TypeScript config loader to throw when the executor type is missing.` | Advisor route elsewhere: expected `sk-code` | `02--advisor-integration/pure-code-routes-skcode.md` |
| `AI-003` | Documentation Negative | Verify documentation authoring routes to sk-doc or another documentation owner | `Write a README section explaining how the sk-design hub routes its six modes.` | Advisor route elsewhere: expected `sk-doc` or another documentation owner, not `sk-design` | `02--advisor-integration/doc-write-routes-elsewhere.md` |
| `AI-004` | Code-Correctness Review Negative | Verify a code-correctness review request using review/audit-adjacent wording still routes to sk-code's code-review mode, not sk-design's audit mode | `Review this checkout API handler for SQL-injection risk and missing input validation. This is a code-correctness review, not a visual or UI design review.` | Advisor route elsewhere: expected `sk-code` (code-review mode); `sk-design` must not be top-1 at confidence `>= 0.80` | `02--advisor-integration/code-review-routes-skcode.md` |

---

## 9. TRANSFORM-VERB FRAMING (`TV-001..TV-005`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `TV-001` | Interface Transform Frame | `make it` plus bolder/quieter/distill/delight resolves interface | Variant set in file | `interfaceFrame`: `make it`; `interfaceAliases`: `bolder`, `quieter`, `distill`, `delight` | `03--transform-verb-framing/make-it-interface.md` |
| `TV-002` | Audit Question Frame | `should it be` plus transform alias resolves audit | Variant set in file | `auditFrame`: `should it be`; `audit-transform-question` keywords | `03--transform-verb-framing/should-it-be-audit.md` |
| `TV-003` | Clarify Alias Only | `clarify` is an interface alias but excluded from command projection parity | `Clarify this hero section's visual hierarchy without changing its content.` | `aliasOnly`: `clarify`; `interfaceAliases`: `clarify` | `03--transform-verb-framing/clarify-alias-only.md` |
| `TV-004` | Foundations Excluded Aliases | `typeset` and `colorize` do not become foundations transform aliases | `Make it typeset and colorize, but do not create a full token system.` | `excludedAliases.foundations`: `typeset`, `colorize`; router default mode `interface` if design-family intent continues | `03--transform-verb-framing/foundations-excluded-aliases.md` |
| `TV-005` | Audit Excluded Aliases | `harden` and `polish` do not become audit transform aliases | `Make this card feel polished and visually hardened without running an audit report.` | `excludedAliases.audit`: `harden`, `polish`; `interface-taste`: `polish` | `03--transform-verb-framing/audit-excluded-aliases.md` |

---

## 10. MD-GENERATOR PIPELINE (`MG-001..MG-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `MG-001` | Extract Write Validate | Full URL to DESIGN.md request runs EXTRACT, WRITE, VALIDATE | `Extract the design system from https://example.com into /tmp/skd-MG001/DESIGN.md with tokens.json evidence.` | Mode `md-generator`; backend `playwright-extract`; phases EXTRACT -> WRITE -> VALIDATE | `04--md-generator-pipeline/extract-write-validate.md` |
| `MG-002` | Validate Existing DESIGN.md | Validation-only request stays md-generator | `Validate /tmp/skd-MG002/DESIGN.md against /tmp/skd-MG002/tokens.json for hex accuracy and section completeness.` | `md-generator-aliases`: `validate design.md`; phase VALIDATE | `04--md-generator-pipeline/validate-design-md.md` |
| `MG-003` | Design Fidelity Report | Fidelity report request stays md-generator | `Run a design fidelity check for /tmp/skd-MG003/DESIGN.md and its tokens.json, then render the preview report.` | `md-generator-aliases`: `design fidelity check`; phase REPORT or validation plus report | `04--md-generator-pipeline/design-fidelity-check.md` |
| `MG-004` | Brief-Only Authoring Boundary | Brief-only request with no live site stays inside the authoring-boundary contract instead of fabricating a measured token table | `Generate a DESIGN.md style reference for our new checkout product from this brief: primary blue #1a73e8, Inter font family, 8px spacing scale, and 12px rounded cards. We do not have a live site to crawl yet -- just the brief.` | Mode `md-generator`; cites `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md`; no brief value lands in an unlabeled Tokens table | `04--md-generator-pipeline/brief-only-authoring-boundary.md` |

---

## 11. SHARED REFERENCE BASE (`SR-001..SR-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `SR-001` | Interface Shared References | Interface mode cites shared reference base before design choices | `Make this landing page look less generic and state the register before recommending colors.` | `interface` mode plus shared resources | `05--shared-reference-base/interface-shared-references.md` |
| `SR-002` | Reference-Base Backend Modes | Foundations, motion, and audit modes use `backendKind: reference-base` | Multi-prompt set in file | Registry `backendKind: reference-base` for three modes | `05--shared-reference-base/reference-base-backend-modes.md` |
| `SR-003` | Shared Base Not Workflow | Direct shared-base request must not invoke shared as a mode | `Use the shared design reference base as the workflow for this task.` | Hub has no shared workflowMode; router must defer or select a real mode | `05--shared-reference-base/shared-base-not-workflow.md` |
| `SR-004` | Hub Holds No Mode Logic | Hub routes and packet owns per-mode detail | `For a design audit, show which packet owns the scoring logic and which hub file only routes.` | `audit` mode; packet `design-audit/SKILL.md`; hub remains routing-only | `05--shared-reference-base/hub-routing-only.md` |

---

## 12. PARITY BEHAVIOR (`PB-001..PB-007`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `PB-001` | Procedure Selection Proof | Interface mode states the selected procedure card and why it fits | `Make this fintech dashboard feel premium and less generic. Before giving direction, state the public sk-design mode, the internal procedure card you selected, and why that card fits the available context.` | `interface-taste`: `premium ui`, `less generic`; procedure `design-interface/procedures/aesthetic_direction.md`; read-only surface | `06--parity-behavior/procedure-selection-proof.md` |
| `PB-002` | Context and Proof Gates | Foundations mode separates confirmed context, inferred claims, and readiness proof gaps | `Review the supplied dashboard screenshot description for hierarchy and spacing rhythm. Before recommendations, list the context you used, what is confirmed, what is inferred, and what proof would be required before calling the design ready.` | `foundations-layout`: `hierarchy`, `spacing`; procedure `design-foundations/procedures/hierarchy_rhythm_review.md`; read-only surface | `06--parity-behavior/context-proof-gates.md` |
| `PB-003` | md-generator Preservation Confirmation | Extraction stays in md-generator and confirms only that mode may write measured artifacts | `Extract the design system from https://example.com into /tmp/skd-PB003/DESIGN.md, preserve measured CSS evidence, and confirm that md-generator is the only mode allowed to write the output.` | `md-generator-aliases`: `extract design system`; `md-generator-artifacts`: `design.md`; procedure `design-md-generator/procedures/design_system_extraction.md` | `06--parity-behavior/md-generator-preservation-confirmation.md` |
| `PB-004` | Motion Procedure Selection Proof | Motion mode states the interaction-states procedure card and why it fits | `motion: define hover, focus, active, loading, disabled, and reduced-motion behavior for this command menu. Before giving timing guidance, state the public sk-design mode, the internal procedure card you selected, and why that card fits.` | `motion` mode; procedure `design-motion/procedures/interaction_states_pass.md`; read-only surface | `06--parity-behavior/motion-procedure-selection-proof.md` |
| `PB-005` | Audit Procedure Selection Proof | Audit mode disambiguates accessibility procedure selection from AI-slop review | `audit: review this checkout screen for WCAG contrast, keyboard focus, and form accessibility. State the public sk-design mode, the internal procedure card you selected, and why it is not the AI-slop card.` | `audit` mode; procedure `design-audit/procedures/accessibility_audit.md`; negative variant `design-audit/procedures/ai_slop_check.md` | `06--parity-behavior/audit-procedure-selection-proof.md` |
| `PB-006` | Shared Polish-Gate Selection Proof | Shared polish gate stays hub-level with `design-audit` as owning reviewer | `Run the final design polish gate for this nearly finished checkout UI. State the public sk-design mode, the shared internal procedure card you selected, the owning reviewer, and how findings route across audit, foundations, motion, interface, and sk-code.` | shared procedure `shared/procedures/polish_gate_orchestration.md`; owning reviewer `design-audit` | `06--parity-behavior/shared-polish-gate-selection-proof.md` |
| `PB-007` | Interface Variation-Set Selection Proof | Interface mode selects `variation_set.md`, not `aesthetic_direction.md`, and applies the seed-of-thought debias for a multi-direction brief | `Give me three genuinely distinct visual directions for this fintech onboarding flow, not three safe variations of the same idea. Before giving the directions, state the public sk-design mode, the internal procedure card you selected, and why it is not the single-direction aesthetic_direction card.` | procedure `design-interface/procedures/variation_set.md` (not `aesthetic_direction.md`); seed-of-thought debias cited from `variation_diversity.md`; read-only surface | `06--parity-behavior/interface-variation-set-selection-proof.md` |

---

## 13. FALLBACK AND RESILIENCE (`FR-001..FR-002`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `FR-001` | No-Card-Matches Fallback | Modes state exact no-procedure fallback lines instead of inventing cards | `foundations: explain whether this existing neutral token name should be semantic or surface-level. Keep it advisory and state whether a procedure card applies before answering.` | exact fallback line per mode; md-generator uses `baseline md-generator pipeline`; no all-card loading | `07--fallback-and-resilience/no-card-matches-fallback.md` |
| `FR-002` | Direct Fallback Without Subagents | Direct fallback preserves proof bar and tool boundary without subagents | `Subagents are unavailable. motion: define the feedback states and reduced-motion path for this toolbar directly in the current session, and show the procedure card, context basis, proof line, and tool boundary you used.` | read-only modes stay Read/Glob/Grep-only; md-generator keeps backend boundary | `07--fallback-and-resilience/direct-fallback-without-subagents.md` |

---

## 14. HUB MANAGER INTAKE (`HM-001..HM-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Expected Signals | Per-Feature File |
|---|---|---|---|---|---|
| `HM-001` | Context-First Intake | Hub gathers goal, surface, inputs, constraints, and proof expectations before routing when missing facts affect the route | `Make this product experience feel more premium and production-ready. I have some screenshots and a brand deck, but I am not sure whether this needs interface direction, foundations, motion, or audit.` | intake fields appear before route or a focused question is asked | `08--hub-manager-intake/context-first-intake.md` |
| `HM-002` | Visible Plan Before Build | Hub shows selected mode or bundle, context, design moves, proof, and handoff target before substantial work | `Design the visual direction for a dense operations dashboard and prepare the implementation handoff. Before any design recommendation, show the selected mode or bundle, context loaded, intended design moves, proof required, and handoff target.` | visible plan appears before design recommendations | `08--hub-manager-intake/visible-plan-before-build.md` |
| `HM-003` | Verifier-Cadence Pause | Hub pauses ready claims when required proof is missing or transport-only | `I only have a Figma export and no rendered responsive checks. Tell me whether this design is ready to ship, and if any proof field is missing, pause the ready claim and name the missing proof.` | readiness is paused; missing proof fields are named | `08--hub-manager-intake/verifier-cadence-pause.md` |
| `HM-004` | Design-Mode Pairing Before Run | Hub pairs a design-judgment mode with `design-mcp-open-design` and names it as a hard precondition before a RUN-direction Open Design generation request | `Commission an Open Design generation run for a new settings page, grounding it in one of Open Design's local design systems, and start the run now.` | ordered bundle pairs a design-judgment mode (default `interface`) with `design-mcp-open-design`; paired mode named as hard precondition before any `start_run` call | `08--hub-manager-intake/design-mode-pairing-before-run.md` |

---

## 15. AUTOMATED TEST CROSS-REFERENCE

No automated tests are claimed by this playbook. Manual execution is the validation source for advisor behavior, hub routing, resource loading, transform-verb framing, and md-generator pipeline behavior.

---

## 16. FEATURE CATALOG CROSS-REFERENCE INDEX

| Category | Feature ID | Per-Feature File | Critical Path |
|---|---|---|---|
| Mode Routing | MR-001 | `01--mode-routing/interface-mode.md` | Yes |
| Mode Routing | MR-002 | `01--mode-routing/foundations-mode.md` | Yes |
| Mode Routing | MR-003 | `01--mode-routing/motion-mode.md` | Yes |
| Mode Routing | MR-004 | `01--mode-routing/audit-mode.md` | Yes |
| Mode Routing | MR-005 | `01--mode-routing/md-generator-mode.md` | Yes |
| Mode Routing | MR-006 | `01--mode-routing/mode-hint-motion.md` | No |
| Mode Routing | MR-007 | `01--mode-routing/mcp-open-design-mode.md` | Yes |
| Advisor Integration | AI-001 | `02--advisor-integration/positive-design-controls.md` | Yes |
| Advisor Integration | AI-002 | `02--advisor-integration/pure-code-routes-skcode.md` | Yes |
| Advisor Integration | AI-003 | `02--advisor-integration/doc-write-routes-elsewhere.md` | No |
| Advisor Integration | AI-004 | `02--advisor-integration/code-review-routes-skcode.md` | No |
| Transform Verb Framing | TV-001 | `03--transform-verb-framing/make-it-interface.md` | Yes |
| Transform Verb Framing | TV-002 | `03--transform-verb-framing/should-it-be-audit.md` | Yes |
| Transform Verb Framing | TV-003 | `03--transform-verb-framing/clarify-alias-only.md` | No |
| Transform Verb Framing | TV-004 | `03--transform-verb-framing/foundations-excluded-aliases.md` | No |
| Transform Verb Framing | TV-005 | `03--transform-verb-framing/audit-excluded-aliases.md` | No |
| md-generator Pipeline | MG-001 | `04--md-generator-pipeline/extract-write-validate.md` | Yes |
| md-generator Pipeline | MG-002 | `04--md-generator-pipeline/validate-design-md.md` | No |
| md-generator Pipeline | MG-003 | `04--md-generator-pipeline/design-fidelity-check.md` | No |
| md-generator Pipeline | MG-004 | `04--md-generator-pipeline/brief-only-authoring-boundary.md` | Yes |
| Shared Reference Base | SR-001 | `05--shared-reference-base/interface-shared-references.md` | No |
| Shared Reference Base | SR-002 | `05--shared-reference-base/reference-base-backend-modes.md` | No |
| Shared Reference Base | SR-003 | `05--shared-reference-base/shared-base-not-workflow.md` | Yes |
| Shared Reference Base | SR-004 | `05--shared-reference-base/hub-routing-only.md` | No |
| Parity Behavior | PB-001 | `06--parity-behavior/procedure-selection-proof.md` | Yes |
| Parity Behavior | PB-002 | `06--parity-behavior/context-proof-gates.md` | Yes |
| Parity Behavior | PB-003 | `06--parity-behavior/md-generator-preservation-confirmation.md` | Yes |
| Parity Behavior | PB-004 | `06--parity-behavior/motion-procedure-selection-proof.md` | Candidate |
| Parity Behavior | PB-005 | `06--parity-behavior/audit-procedure-selection-proof.md` | Candidate |
| Parity Behavior | PB-006 | `06--parity-behavior/shared-polish-gate-selection-proof.md` | Candidate |
| Parity Behavior | PB-007 | `06--parity-behavior/interface-variation-set-selection-proof.md` | Candidate |
| Fallback and Resilience | FR-001 | `07--fallback-and-resilience/no-card-matches-fallback.md` | Candidate |
| Fallback and Resilience | FR-002 | `07--fallback-and-resilience/direct-fallback-without-subagents.md` | Candidate |
| Hub Manager Intake | HM-001 | `08--hub-manager-intake/context-first-intake.md` | Candidate |
| Hub Manager Intake | HM-002 | `08--hub-manager-intake/visible-plan-before-build.md` | Candidate |
| Hub Manager Intake | HM-003 | `08--hub-manager-intake/verifier-cadence-pause.md` | Candidate |
| Hub Manager Intake | HM-004 | `08--hub-manager-intake/design-mode-pairing-before-run.md` | Candidate |

**Total scenarios**: 37
**Critical-path scenarios**: 16
**Critical-path candidates pending operator confirmation**: 10
**Categories**: 8
