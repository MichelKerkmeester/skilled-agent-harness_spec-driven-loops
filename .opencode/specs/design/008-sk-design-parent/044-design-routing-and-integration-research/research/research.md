---
title: "Research: sk-design routing/utilization guarantees + command specificity + cross-surface enforcement"
description: "50 non-converging GPT-5.5-xhigh deep-research iterations over six dimensions — residual design craft (D1), /design:* command specificity (D2), parent->sub-skill routing+utilization guarantees (D3), mcp-open-design pairing guarantees (D4), cross-CLI survival (D5), and designer-skills-main corpus expansion (D6). Every claim verified against the real on-disk files. Yields a per-dimension buildable backlog plus an honest enforceable-vs-advisory ledger: routing/pairing can be made deterministically blocking on a fixture corpus and self-attestation replaced by content-bound proof, but live application quality stays advisory. RESEARCH ONLY — no live sk-design edits."
trigger_phrases:
  - "sk-design routing utilization research"
  - "design command specificity backlog"
  - "mcp-open-design pairing enforcement research"
  - "cross-cli design dispatch enforcement"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/044-design-routing-and-integration-research"
    last_updated_at: "2026-06-28T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized 50 non-converging iterations into a six-dimension buildable backlog"
    next_safe_action: "Review backlog and scope a build phase for the D3/D4 enforcement spine"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
      - "research/angle-bank.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-044-design-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Where the hub-router policy lives: mode-registry.json.router vs a generated sibling hub-router.json"
      - "Whether the open-design proof token is minted by a sk-design card parser or a guarded mcp-open-design proxy"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Research: sk-design routing/utilization guarantees + command specificity + cross-surface enforcement

## 1. EXECUTIVE SUMMARY

This is the fourth research arc on the `sk-design` family, and the first that goes beyond corpus-adoption craft into **enforcement architecture**: how to *guarantee* that the design judgment is routed to, loaded, and carried across every surface that can produce a UI. Fifty GPT-5.5-xhigh iterations ran without converging (newInfoRatio mean **0.655**, min 0.57, max 0.74 — never near the 0.05 floor), each fed a genuinely fresh angle from a 57-angle bank plus a parallel monitor that injected deeper/cross-cutting/corpus-expansion angles when info flow dipped. Every load-bearing claim was verified against the real on-disk file (a finding was treated as a hypothesis until the cited line was opened).

**The single most important result is the honest reframing of the "1000%" guarantee.** The routing/utilization/pairing problem decomposes cleanly into a part that can be made *deterministically blocking* and a part that is *intrinsically advisory*:

- **Deterministically enforceable (on the local checkout + a private gold corpus, in CI):** that the right mode is *selected* (a parseable hub-router replayed over fixtures), that the right context was *loaded* (content-bound proof tokens — sha256 of the loaded files, not a self-checked box), that the pairing *fired* (deny-by-default tool-boundary preconditions across MCP/CLI/HTTP/automation), and that the contract *survived* a CLI dispatch (inlined payload + parent-side re-validation of returned artifacts).
- **Intrinsically advisory (cannot be proven by a hash or a fixture):** whether the loaded judgment was *applied well* — whether the resulting interface is actually tasteful — and whether an open-ended live prompt outside the fixture corpus routes correctly (a false-default proxy swung 0.087→0.63 purely on prose interpretation, proving live language is not deterministic).

The build target therefore is: **make non-utilization loud and blocking, replace self-attestation with content-bound proof, and measure the residual miss-rate** — never "guarantee the model has taste."

**Key numbers established by the loop (verified):** the parent hub currently fails a deterministic router replay (`router-replay.cjs` returns `parseable:false` on `sk-design`, `true` on `design-interface`); live utilization is invisible today (`intentRecall=0`, `telemetryMissingRate=1.000` across 55 prompt scenarios); the registry is structurally clean (5 modes, 56 aliases, **0 alias collisions**, 5/5 packet+name parity) but **46.5% of raw hub keywords are uncovered/untyped**; the `mcp-open-design` HARD GATE is never-executed pseudocode (`design_gate()` is markdown) with a caller-supplied `feeds_design_decision=False` default; and the three `cli-*` skills carry a `Code Standards Loading` ALWAYS rule but **no design twin** (grep finds no `sk-design` design-dispatch rule).

**Deliverable:** a frozen, per-dimension buildable backlog (D1–D6 below), each item labeled enforceable / advisory / hybrid with a concrete target file and a load-bearing citation, plus a cross-cutting enforcement spine (§10) and a verification plan (§11). No live sk-design edits were made; nothing was committed.

---

## 2. SCOPE & METHOD

**Six dimensions** (charter from the goal):
- **D1** — residual feature/reference/asset craft (impeccable-main + designer-skills-main vs live modes).
- **D2** — make the five `/design:*` commands more specific and more useful.
- **D3** — guarantee parent→sub-skill routing + utilization.
- **D4** — guarantee `mcp-open-design` always loads sk-design + relevant sub-skills.
- **D5** — guarantee the above survives `cli-opencode` / `cli-codex` / `cli-claude-code` dispatch.
- **D6** — expand the corpus to `designer-skills-main` for fresh angles when impeccable is exhausted.

**Loop mechanics.** Executor: `cli-codex`, model `gpt-5.5`, reasoning `xhigh`, service tier `fast`. A no-converge driver advanced a 57-angle bank one fresh angle per iteration; a parallel monitor watched `deep-research-state.jsonl` and, when the last-3 newInfoRatio shallowed or on a periodic cadence, injected deeper/cross-cutting angles and switched the corpus to `designer-skills-main` for the back third. Convergence was logged as a signal only — the only stop was iteration 50. Each iteration wrote an evidence file (`iterations/iteration-NNN.md`) with findings carrying severity (P0/P1/P2) and an ENFORCEABLE/ADVISORY label, plus a delta.

**Verification discipline.** Every finding cites `file:line`. Several iterations *executed* the existing skill-benchmark scripts (`router-replay.cjs`, `d5-connectivity.cjs`, `advisor-probe.cjs`) against the live hub and packets to turn assertions into measured facts.

**Coverage (50 iterations):** D1 ×4 (1–4), D2 ×13 (5–17), D3 ×14 (18–31), D4 ×10 (32–36,39–40,42–44), D5 ×4 (46–48,50), D6 ×5 (37,38,41,45,49) — weighted toward the guarantee dimensions D3/D4 as requested.

---

## 3. COVERAGE LEDGER

| Dim | Iterations | Angle span | New-info range | Net assessment |
|-----|-----------|-----------|----------------|----------------|
| D1 craft | 1–4 | impeccable harden/optimize/polish, per-model tells, transform verbs, design-laws | 0.58–0.74 | Real residual craft; mostly hybrid (artifact-shape enforceable, taste advisory) |
| D2 commands | 5–17 | arg grammar, examples, discriminators, deliverables, preconditions, register, pipeline, metadata SSOT | 0.57–0.73 | Strong, deeply enforceable; one root fix (metadata SSOT + surface checker) |
| D3 routing | 18–31 | hub-router projection, scorer lane, gold corpus, telemetry, ROUTED token, content-bound proof, drift gates | 0.59–0.73 | Richest dimension; a complete deterministic spine on existing machinery |
| D4 open-design | 32–36,39–40,42–44 | deny-by-default gate, executable hook, proof token, exemption inversion, automation freeze, laundering guards | 0.59–0.72 | Spine complete; one residual (unmodifiable daemon) cannot be fully closed |
| D5 cross-CLI | 46–48,50 | design-standards ALWAYS rule, dispatch manifest, payload-inline, demand-back re-validation | 0.63–0.69 | Spine clear; small-model + AGENTS.md carry left untested |
| D6 corpus | 37,38,41,45,49 | designer-skills-main 9-plugin command recipes + craft-field shapes | 0.59–0.74 | Command-recipe pattern is the one net-new port; 2 of 5 passes redundant |

Honest note on the monitor: the periodic corpus-expansion inject reused the `MON-B3` angle three times (iters 37/38/45) because the override persisted across the driver's fast advance before the monitor's 45s tick cleared it; those iterations deepened rather than repeated (the prompt forbids re-covering prior ground), but ~2 of the 5 D6 passes were lower-yield than their newInfoRatio claimed.

---

<!-- The six dimension backlogs below were synthesized by independent per-dimension reviewers, each reading only its dimension's iteration files and deduping across them. Items are research recommendations for a later build phase; none are implemented. -->

## 4. D1 — RESIDUAL CRAFT

### Backlog

| ID | Title | Sev | Class | Build action (what + target file) | Key evidence |
|----|-------|-----|-------|-----------------------------------|--------------|
| D1-R1 | No central index of cross-mode numeric laws (shared base is conceptual) | P1 | hybrid | Add `sk-design/shared/numeric_design_laws.md` indexing cross-mode numeric laws (law_id, value/range, owner mode, enforcement target, source, caveat); benchmark asserts each row complete | impeccable `SKILL.md:31` vs `shared/cognitive_laws.md:16` |
| D1-R2 | Transform verbs absent from registry aliases + no interface authoring lane | P1 | enforceable | Add aliases `bolder/quieter/distill/clarify/delight` to `mode-registry.json` + parent tie-breaker (audit="should it be"/interface="make it"); add `design-interface/references/design-process/transform_application.md` + router-replay gold prompts | `mode-registry.json:14` |
| D1-R3 | Per-model AI tells: impeccable has 2 enforceable layers, audit has 1 human catalog | P1 | hybrid | Add `design-audit/assets/ai_fingerprint_registry.json` (tell_id, model_family, self_defect_prompt, deterministic_check, fixture_id, severity_floor, owner) + generated self-defect card; validator fails a catalog tell lacking a registry row/fixture | impeccable `skill/SKILL.src.md:101` |
| D1-R4 | No fixture corpus / provider gate / expected counts for the AI-tell scenario | P1 | enforceable | Add fixture-backed scenario (clean pass + Codex/Gemini positives + clean negatives) + benchmark asserting expected tell IDs and no off-family false positives; extend `manual_testing_playbook/03--slop-hardening/001-ai-fingerprint-tells.md` | `001-ai-fingerprint-tells.md:30` |
| D1-R5 | Optimize metric proof softened — audit report has no baseline/delta fields | P1 | hybrid | Add a `Performance Evidence` block (baseline, post-change, static-risk label, "measurement needed") to `design-audit/assets/audit_report_template.md`; Perf score >2 requires a numeric metric or explicit not-assessed label | impeccable `optimize.md:21` |
| D1-R6 | Harden device/constrained-context probes missing (low-power, data-saver) | P1 | hybrid | Add a `Device And Constrained Context` section to `design-audit/references/hardening_edge_cases.md` (low-power, Save-Data, CPU-throttle, offline→online, slow media) with pass/fail/skip + evidence | impeccable `harden.md:18` |
| D1-R7 | Baseline rhythm: line-height→spacing relation not required | P1 | hybrid | Add a `baseline rhythm` row to `design-foundations/assets/token_starter.md` + link from `layout/layout_responsive.md`; validator checks spacing = multiple/fraction or marked exception | impeccable `typeset.md:136` |
| D1-R8 | Transform-lane proof cards missing (distill/clarify/delight) | P2 | hybrid | Add Distill/Clarify/Delight lanes to `transform_application.md` (keep/remove ledger; before/after; earned-moment + reduced-motion + opt-out) | impeccable `distill.md:18`, `clarify.md:44`, `delight.md:1` |
| D1-R9 | Harden fix-shapes not systematic in the matrix | P2 | hybrid | Add a `Fix shape to recommend` column to `hardening_edge_cases.md`; keep the audit/implement boundary (recommend shape+owner; sk-code implements) | impeccable `harden.md:30` |
| D1-R10 | Polish readiness is prose, not a gate | P2 | hybrid | Add a `Polish Readiness` subsection to `design-audit/references/critique_hardening.md` + report row (ready/blocked/not-assessed) + static TODO/FIXME scan | impeccable `polish.md:22` |
| D1-R11 | Missing Codex "theater / meta-criticism copy" tell | P2 | hybrid | Add the Codex tell to `design-audit/references/ai_fingerprint_tells.md` (narrow static `\b(\w+)\s+theater\b` + advisory) + a positive/negative fixture | impeccable `skill/SKILL.src.md:108` |
| D1-R12 | Live-variant numeric knobs not a transport-facing contract | P2 | hybrid | Add `sk-design/shared/assets/variant_parameter_contract.md` (density 0.6–1.4, type-scale 0.85–1.3, color-amount 0–1 step .05, structure, pairing) with owner modes; test Figma/Open Design/live | impeccable `layout.md:143` |
| D1-R13 | Already-adopted laws → guard against duplicate re-port | P2 | enforceable | Add duplicate-detection to the docs benchmark: fail on redundant mode-local restatements of timing/color/layout/type defaults; reference owners not copies | `design-interface/.../mechanical_defaults.md:45` |

### Enforcement ceiling
Enforceable on corpus/CI: routing aliases + gold modes (R2), fixture corpora with expected tell IDs and clean negatives (R4), registry-row/fixture completeness (R3), report-field presence + TODO scans (R5, R10), required card rows / before-after presence (R7, R8), JSON knob schema+range (R12), duplicate-law detection (R13). Advisory: whether collected metrics are real (R5), whether a model internalizes a self-defect card (R3), whether the chosen aesthetic is correct (R8). Honest residual: every item can prove the law/proof/owner *exists and was cited*; none proves the visual judgment is good without rendered/behavioral review.

### Open design decisions
- Should `design-audit` get an executable detector script, or stay report-output + leave detection to a future tool? (`iteration-002.md:75`)
- Should transform verbs be first-class `/design:*` commands or routed intents under the hub? (`iteration-003.md:95`)
- Should the numeric-law index be a standalone shared reference or an on-demand asset card? (`iteration-004.md:88`)

---

## 5. D2 — COMMAND SPECIFICITY & USEFULNESS

All five `/design:*` wrappers are byte-templated thin bridges (identical generic `argument-hint: "<design request>"`, identical mutating toolset, `STATUS=OK|FAIL` tail). Every gap traces to one root: the command surface erases mode-specific contracts that already exist inside the child packets, and there is no single metadata source to project or drift-check them. The consistent buildable answer is a sibling `command-metadata.json` (ownerMode → `workflowMode`) that keeps `mode-registry.json` routing-only, plus a deterministic `design-command-surface-check`.

### Backlog

| ID | Title | Sev | Class | Build action (what + target file) | Key evidence |
|----|-------|-----|-------|-----------------------------------|--------------|
| D2-R1 | Wrapper tool over-grant: read-and-guide modes get Write/Edit/Bash | P0 | enforceable | Add `toolPolicy{mutatesWorkspace}`; strip `Write,Edit,Bash` from interface/foundations/motion/audit wrappers (keep Read/Glob/Grep), keep only md-generator mutating; checker fails a mutation-free cmd carrying mutating tools. Target: `.opencode/commands/design/*.md` frontmatter + metadata | `commands/design/interface.md:4` vs `design-interface/SKILL.md:4` |
| D2-R2 | Generic `<design request>` arg-hint → per-mode arg grammar | P0 | enforceable | Add `argumentHint` per mode (md-generator `<live-url> --output <dir>`, audit `<target> [--scope] [--score]`, motion `<component-state> [--library]`, foundations `<axis> <target>`, interface `<target> [--mode]`); generate/drift-check; fail if generic. Target: `command-metadata.json` → wrappers | `commands/design/audit.md:3` |
| D2-R3 | Metadata fragmented across wrapper/hub/registry; no SSOT or drift gate | P0 | enforceable | Create `sk-design/command-metadata.json` (command, ownerMode, description, argumentHint, aliases, accepts, returns, next, proofFields, deferToHubWhen); ownerMode must equal a `workflowMode`; keep registry routing-only; add `design-command-surface-check.mjs`. Target: new metadata + checker | `sk-design/SKILL.md:41`; `commands/design/interface.md:2` |
| D2-R4 | No concrete invocation example or `Returns:` line | P1 | enforceable | Add `examples[]{invocation,returnsArtifact}`; generate `## Example` (one fenced call + `Returns:`); fail if absent or prefix ≠ filename | `commands/design/audit.md:24` |
| D2-R5 | Deliverable shape unspecified — only STATUS=OK/FAIL | P1 | enforceable | Add `outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs}`; generate an `Emit Deliverable` section; ban generic artifact names | `commands/design/audit.md:26` |
| D2-R6 | No sibling discriminator / `deferToHubWhen` at command layer | P1 | hybrid | Add `discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence}` (derive from child `Use when`/`When NOT`); generate sections + per-pair replay fixtures | `commands/design/interface.md:13` |
| D2-R7 | Preconditions & failure modes unnamed (URL/target/component, tool readiness) | P1 | hybrid | Add `preconditions{requiredInputKind,missingInputQuestion,cannotRunWhen,escalateIf,routeInstead}`; generate Requires/Ask-first/Cannot-run/Escalate; ban status-only failure | `commands/design/md-generator.md:26`; `design-md-generator/SKILL.md:354` |
| D2-R8 | Register (Brand/Product) not pinnable at command entry | P1 | hybrid | Add `registerPolicy{accepted,default:auto,resolutionOrder,askWhen,proofFields}` + `--register`; emit `STATUS=ASK MISSING_REGISTER`; reuse `shared/register.md` proof fields; fixtures assert Brand≠Product dials | `commands/design/interface.md:3`; `shared/register.md:16` |
| D2-R9 | No pipeline/handoff visibility across the five commands | P1 | hybrid | Add `pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired}` (md-generator→foundations/interface→motion→audit→sk-code); status `STATUS=OK PRODUCES= NEXT= PROOF=` / `DEFER` / `ASK`; recommend-only, no silent chain | `mode-registry.json:14`; `design-md-generator/SKILL.md:444` |
| D2-R10 | Command-as-mode framing leads with "Thin bridge / Pin mode" not user intent | P2 | hybrid | Add `userIntent{job,ownedSignals}` + `copyGuard`; lead with the user job, mode in an `Internal binding` section; checker bans bridge-first phrases | `commands/design/interface.md:9` |
| D2-R11 | Interface mode hides 11 intent lanes behind one bridge | P2 | hybrid | Bind `tasks` to the interface router `INTENT_SIGNALS`; promote directions/preflight/redesign/handoff as task projections; classify each lane (sibling-command/argument/internal/hidden) + negative fixtures | `design-interface/SKILL.md:100` |
| D2-R12 | High-value task verbs buried in references/aliases | P2 | advisory | Promote typeset/colorize/bolder/quieter/distill/harden/polish/delight as command-visible task projections (NOT new modes) with ownerModes/strictness/referenceSources/requires/fixtures; reject command creep via negative corpus | `design-audit/references/transform_remediation.md:22` |
| D2-R13 | Descriptions treated as auto-trigger, but NL collapses to the hub | P2 | hybrid | Add `descriptionRole` + `autoTriggerEligible:false` + `hubKeywordProjection`; 4-lane replay (advisor→hub, hub→mode, direct-command→packet, generated-pin→parent) | `mode-registry.json:4` |

### Enforcement ceiling
Enforceable: the metadata-drift gate (wrapper frontmatter must equal `command-metadata.json`), arg-grammar presence (no surviving `<design request>`), tool-policy parity, ownerMode→workflowMode + alias-uniqueness, presence of example/Returns/discriminator/precondition/register/pipeline sections, non-generic artifact names, and gold-corpus replay (direct-command-loads-packet, Brand≠Product dials). Advisory: editorial wording, the Brand/Product call on genuinely mixed surfaces, one-command-vs-bundle for multi-axis prompts, whether a surface "earns" a transform. Honest residual: a least-privilege command surface still cannot guarantee taste, and NL→specific-command auto-selection is provable only inside the fixture corpus.

### Open design decisions
- Metadata home: sibling `command-metadata.json` (favored) vs `mode-registry.json.commandSurface` (`iteration-015.md:50`).
- Command-as-mode vs command-as-task, and which verbs earn first-class commands vs arguments vs hidden references (`iteration-011.md:104`, `iteration-012.md:124`).
- Pinned shortcuts/auto-trigger vs always-start-at-hub; unresolved register fail-closed (`STATUS=ASK`) vs default Product (`iteration-016.md:97`, `iteration-014.md:116`).

---

## 6. D3 — ROUTING & UTILIZATION GUARANTEE

### The enforcement spine
A four-layer deterministic spine bolted onto the existing Lane C skill-benchmark machinery: (1) a **parseable hub-router projection** — a sibling `hub-router.json` carrying `routerPolicy` (default, ambiguityDelta, tieBreak, outcomes single/orderedBundle/defer) + `routerSignals` + typed vocabulary classes — because today `router-replay.cjs` returns `parseable:false` on the parent hub while packets pass (`iteration-018.md:24`); (2) a **parent-hub `routeTelemetry` adapter** extending `router-replay.cjs` to emit `{workflowMode, matchedAliases, defaultApplied, deferReason, backendKind, packet}` (`iteration-031.md:25`); (3) a **standing private gold corpus** of hint-free prompts + adversarial minimal pairs scored by a hard `hubRoute` first-failing stage inserted *before* the advisory `routed-intra` stage in `score-skill-benchmark.cjs` (`iteration-027.md:25`); (4) **content-bound utilization proof** (SOURCE PROOF sha256/anchor + loaded-determinative witnesses) replacing self-attestation — all enforced in CI through the existing `d5-connectivity.cjs` P0 `router_unparseable` hard-gate pattern (`iteration-018.md:71`).

### Backlog

| ID | Title | Sev | Class | Build action (what + target file) | Key evidence |
|----|-------|-----|-------|-----------------------------------|--------------|
| D3-R1 | Parseable hub-router projection | P0 | enforceable | Add `routerPolicy`+`routerSignals`+typed vocab classes as `sk-design/hub-router.json` (registry stays identity-only); move prose default + multi-axis policy into data | `router-replay.cjs:166` |
| D3-R2 | Gated `hubRoute` scorer lane | P0 | enforceable | Insert a hard stage before `routed-intra` in `score-skill-benchmark.cjs`; stop relying on advisory `modePrecision`; `firstFailingStage: wrong-mode/silent-default/bundle-mismatch` | `score-skill-benchmark.cjs:278` |
| D3-R3 | Standing route-gold corpus + minimal pairs | P0 | hybrid | Add `expected.workflowMode/routeOutcome/forbiddenWorkflowModes/minimalPairGroup` to private gold; new sk-design fixtures (alias/holdout/adversarial); reuse contamination lint | `scenario_authoring.md:27` |
| D3-R4 | routeTelemetry adapter + miss-rate metrics | P1 | enforceable | Extend `router-replay.cjs` output with `routeTelemetry`; reducer metrics (telemetryMissingRate, routeMissRate, aliasMissRate, bundleMissRate, proofFailRate); report "unobserved" vs "observed-wrong" separately | `router-replay.cjs:257` |
| D3-R5 | Live `ROUTED:` declaration token + parser | P1 | enforceable | Add a line+JSON route token to the live prompt; make `live-executor.cjs` populate `observedWorkflowMode`/`observedIntents` (fixes `intentRecall=0`); fail-closed when absent | `live-executor.cjs:243` |
| D3-R6 | Content-bound SOURCE PROOF | P1 | enforceable | Add `SOURCE PROOF` (path/sha256/anchor/echo) to `context_loaded_card.md` + `proof_of_application_card.md`; `proof_check.py --require-source-proof` recomputes digest/anchor | `proof_check.py:47` |
| D3-R7 | Registry static-audit gate | P1 | enforceable | Add `scanHubRegistry()` beside `scanConnectivity` (missingModes, deadPackets, packetNameMismatches, aliasCollisions, uncoveredIntentRate); emit `BLOCKED-BY-REGISTRY` | `d5-connectivity.cjs:10` |
| D3-R8 | Four-copy vocabulary-drift gate | P1 | enforceable | New `parent-hub-vocab-sync` Vitest+CLI modeled on `sk-code-router-sync`; classified projection across graph-metadata trigger_phrases, hub keywords, registry aliases, packet INTENT_SIGNALS | `sk-code-router-sync.vitest.ts:5` |
| D3-R9 | backendKind→toolSurface lock | P1 | enforceable | Add `toolSurface` (allowed/forbidden/mutatesWorkspace/bashAllowlist) per mode; gate backend-kind/tool-policy/bash-allowlist mismatch using captured `raw.toolCalls` | `sk-design/SKILL.md:62` |
| D3-R10 | Application-witness (loaded-determinative) | P1 | hybrid | Add an `APPLICATION WITNESS` section + `proof_check.py --require-application-witness`; classify not-loaded/loaded-inert/loaded-determinative | `proof_of_application_card.md:15` |
| D3-R11 | Relative advisor ranking (transport suppression) | P2 | enforceable | Add `rankBelowSkillIds` to the playbook schema + `scoreRelativeAdvisorRanking()` in `advisor-probe.cjs`; gate sk-design #1, figma/open-design below | `advisor-probe.cjs:155` |
| D3-R12 | Dispatch-boundary child proof | P2 | hybrid | Add a `DESIGN_BOUNDARY_PROOF v1` envelope + `requiresDesignBoundaryProof` fixture; one shared `design_dispatch_boundary.md` asset + CLI template-parity checker | `design-interface/SKILL.md:258` |

### Enforcement ceiling — the honest "1000%"
Enforceable on the checkout + private gold: structural router parseability (`router-replay.cjs` `parseable:true` once `hub-router.json` exists), fixture routing correctness (`expected.workflowMode` + minimal-pair pass), registry/router/packet/vocabulary drift (the registry is structurally clean today — 5 modes, 56 aliases, **0 alias collisions**, 5/5 packet+name parity — but **46.5% of raw hub keywords are uncovered/untyped**), content-bound proof presence (sha256 recompute / anchor echo), backend/tool-surface lock, and relative advisor ranking (the deterministic advisor already returns sk-design #1 with transports at rank 3/5). The honest framing: non-utilization can be made loud and blocking — today's `intentRecall=0` symptom and the measured `telemetryMissingRate=1.000` across 55 prompt scenarios become a gated `route-declaration-missing` failure and a computable `routeMissRate` once gold exists — and self-attestation is replaced by a content-bound `loaded-determinative` witness. **What stays advisory:** open-ended live intent outside fixtures (the false-default proxy swings 0.087→0.63 purely on prose interpretation, proving live language is not deterministic), and whether the loaded judgment was applied *well* — the witness gate proves a cited mode rule had an observable effect on one output choice, never that the design is tasteful.

### Open design decisions
- Router-policy home: `mode-registry.json.router` vs a generated/hand-authored sibling `hub-router.json` (recurs across iters 18/20/21/28/29).
- Multi-axis handling: first-class ordered bundle vs fail-closed `defer`; is `defaultApplied:true` ever legal for a bundle route (`iteration-028.md:107`)?
- Generic vs local: a generic parent-hub benchmark lane vs a sk-design-local adapter until a second registry-mode hub exists (`iteration-027.md:116`).
- Emission scope: must `ROUTED`/route-telemetry be emitted by every real invocation before context cards, or only in benchmark/live transcripts (`iteration-031.md:152`)?

---

## 7. D4 — mcp-open-design PAIRING GUARANTEE

### The enforcement spine
A deny-by-default precondition on every design-feeding/mutating Open Design operation, requiring a content-bound, run-scoped proof token (`DESIGN_PROOF_TOKEN v1`) carrying loaded-file sha256s, workflow-mode bundle, canonical subject+brief+form-answer digests, lineage, and TTL — recomputed against the actual outgoing payload at the tool boundary, fail-closed on absence/staleness/mismatch. This replaces the never-executed `design_gate()` pseudocode (`SKILL.md:164`) with a real gate and inverts the caller-supplied `feeds_design_decision=False` default (`SKILL.md:171`) into three states (`design_authorized`/`transport_exempt`/`unclassified`, where unclassified may never feed design). Because one daemon backs four interchangeable surfaces (`SKILL.md:209`), the invariant must be enforced at the convergent run/build boundary (authoritatively a guarded MCP/HTTP proxy, since the daemon ships inside the app bundle), with Codex PreToolUse hooks as defense-in-depth. Coverage: wired MCP, `od`/`daemon-cli.mjs` Bash write verbs, raw HTTP, `od automation` fires, the `start_run --agent` inner model, and cli-* sub-agent delegation.

### Backlog

| ID | Title | Sev | Class | Build action (what + target file) | Key evidence |
|----|-------|-----|-------|-----------------------------------|--------------|
| D4-R1 | All-surface authoritative run/build gate via guarded proxy | P0 | enforceable | Add a guarded MCP/HTTP proxy + `openDesignDesignPrecondition` validator normalizing MCP/CLI/HTTP/Skills requests before inner-agent spawn / build-fire; new `mcp-open-design/` proxy reference + policy | `mcp-open-design/SKILL.md:209` |
| D4-R2 | Replace never-run `design_gate()` pseudocode with an executable PreToolUse branch | P0 | enforceable | Insert `evaluateOpenDesignPrecondition(input,policy)` before the Bash-only `return {}`; deny on validator exception (unlike Bash fail-open) in `system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | `pre-tool-use.ts:215` |
| D4-R3 | `DESIGN_PROOF_TOKEN v1` content-bound token schema | P0 | hybrid | Define a shared token (loadedFiles[].sha256, workflowModes, subject/brief/formAnswers/lineage digests, issuedAt/expiresAt, singleUse) as structured input/metadata; new shared `references/design_proof_token.md` imported by sk-design + mcp-open-design | `iteration-035.md:108` |
| D4-R4 | Codex policy schema: `openDesignPreconditions.guardedTools` + namespace forms | P1 | enforceable | Add `toolPreconditions`/`openDesignPreconditions` to `CodexPolicyFile` + the 7 mutating tools and namespace variants; `pre-tool-use.ts:44` + `.codex/policy.json` | `mcp-open-design/references/tool_surface.md:48` |
| D4-R5 | `odCliPreconditions` parser-backed Bash lane + gate-file carrier | P1 | enforceable | Tokenize Bash, bind `daemon-cli.mjs`/`$OD_BIN` + write verb (run start/redesign, ui respond/prefill/revoke, media generate) in the same segment, require a same-command gate file | Open Design app daemon `cli-*.mjs:6247` |
| D4-R6 | Inner-generator payload binding; deny raw `--skip`/defaults; bind inner model | P1 | hybrid | Hash `--message`/form-answer payload into the token; deny generic "use recommended defaults" without per-question justification; require explicit `innerModel`; policy + `od_cli_reference.md` run section | `od_cli_reference.md:183` |
| D4-R7 | Cross-child laundering guard: mandatory token in dispatch + child re-validate + demand-back | P1 | hybrid | Separate `DESIGN_PROOF_TOKEN` block (not optional Agent I/O evidence); shared `design_delegation_payload.md` required by all cli-*; child PreToolUse re-validates before `start_run`; `cli-*/SKILL.md` + `agent-io-contract.md` | `agent-io-contract.md:174` |
| D4-R8 | Positive two-token exemption; invert default-false to `unclassified` | P1 | hybrid | Replace the boolean with a required `openDesignPurpose`; `openDesignExemption` (forbids later design use) vs `skDesignGate`; missing→`unclassified` denied for design; `SKILL.md:164-175` + tool_surface policy | `mcp-open-design/SKILL.md:171` |
| D4-R9 | Two-axis tool classification + ambiguous-read receipts | P1 | enforceable | Split tool_surface §3 (`mutationSafety` × `designInfluence`); stop labeling `ambiguous_read` (list_projects, get_file, search_files) "always safe"; emit non-design-use receipts | `tool_surface.md:46` |
| D4-R10 | Temporal/subject freshness invalidation + checker support | P1 | enforceable | Add a canonical `subjectDigest`, TTL (~300s precedent), single-use, mint-side + boundary-side double check; extend `proof_check.py --require-design-token` | `proof_check.py:47` |
| D4-R11 | Headless automation freeze at `od automation create` + two-phase validator | P1 | enforceable | Freeze `automationBinding` (routine/schedule/subject/payload digests, maxRunsBeforeReview, singleFire/reviewWindow) at schedule creation; fire-time replay only | `od_cli_reference.md:189` |

### Enforcement ceiling — the honest "1000%"
Enforceable across all surfaces: tool-boundary deny-by-default; token presence, schema completeness, TTL/expiry, future-issued + single-use/replay rejection; a pure-transport allowlist carrying a positive `openDesignExemption`; and payload-lineage binding (recomputing brief/form/subject digests from the actual outgoing request and denying mismatch), which closes the inner-generator and sub-agent laundering bypasses structurally. **Advisory:** whether the loaded judgment was applied well — the inner model's private reasoning and final taste cannot be proven by a hash; semantic equivalence of two NL subjects is enforceable only once reduced to a canonical subject object (`iteration-042.md:91`). **Residual bypasses that could NOT be fully closed:** (1) the daemon ships unmodifiable in `/Applications/Open Design.app`, so a client hitting the ephemeral HTTP port or the in-app Skills UI *around* the guarded proxy escapes — only a true daemon-side validator closes this (`iteration-044.md:103`); (2) a text-only `cli-claude-code` child with no machine-readable tool stream cannot prove it did not replay a stale token (`iteration-040.md:79`); (3) shell aliases/functions the Bash parser cannot resolve from one command string (`iteration-033.md:18`).

### Open design decisions
- Token mint site: a sk-design proof-card parser, a dedicated `openDesignGate mint` helper, or the guarded proxy at dispatch (`iteration-040.md:76`)?
- Which live MCP `start_run` input field carries the token without leaking Open Design source content into repo artifacts (`iteration-039.md:137`)?
- Does OpenCode expose a pre-tool interception path for third-party MCP calls, or is the guarded proxy the only route to Codex/Claude-Code parity (`iteration-032.md:106`)?

---

## 8. D5 — CROSS-CLI SURVIVAL GUARANTEE

### The enforcement spine
A four-layer additive spine cloned from mechanisms that already survive dispatch: (1) a `Design Standards Loading` ALWAYS rule authored as the exact twin of the existing `Code Standards Loading` rule already in every cli-* ALWAYS block (`cli-opencode/SKILL.md:327`, `cli-codex/SKILL.md:359`, `cli-claude-code/SKILL.md:354`) — the deterministic safety net that fires regardless of phrasing; (2) a `DESIGN_DISPATCH_MANIFEST v1` modeled on the proven Gate-3 spec-folder pass-through (`cli-opencode/SKILL.md:318`): present+pre-approved (sk-design loaded, register set) or ASK before launching the child; (3) payload-INLINE of the contract as a skill-local `references/design_dispatch_contract.md` copied into each CLI skill, because the shared router guards every path to the current skill root (`shared_smart_router.md:46`) and codex/claude-code children cannot resolve `.opencode/skills` paths — so the bundle must travel in the prompt; (4) a child-resident `OPEN_DESIGN_TRANSPORT_ASSERTION/RESULT` demand-back with parent-side digest re-validation that fails closed when Open Design was used but no transport result returns (`iteration-048.md:57`). Agent I/O is deliberately excluded as authority: it is `optional-advisory` and its absence is never a refusal condition (`agent-io-contract.md:25`).

### Backlog

| ID | Title | Sev | Class | Build action (what + target file) | Key evidence |
|----|-------|-----|-------|-----------------------------------|--------------|
| D5-R1 | `Design Standards Loading` ALWAYS baseline rule (twin of code-standards) in all 3 cli-* | P0 | enforceable | Add a short ALWAYS entry beside the code-standards rule in `cli-opencode/SKILL.md`, `cli-codex/SKILL.md`, `cli-claude-code/SKILL.md`; fires independent of router keyword hits | `cli-opencode/SKILL.md:327` |
| D5-R2 | `OPEN_DESIGN_TRANSPORT_RESULT v1` demand-back + parent-side fail-closed re-validation | P0 | hybrid | Define a result schema + parent replay rejecting missing/mismatched manifest/assertion/result digests or unlisted mutating calls; fail-closed when Open Design requested but no result; new `mcp-open-design/references/cli_child_pairing.md` + CLI ALWAYS | `iteration-048.md:57` |
| D5-R3 | `DESIGN_DISPATCH_MANIFEST v1` schema + Gate-3 present-or-ASK pass-through | P1 | enforceable | Define the manifest (surface, taskType, skDesignLoaded, registry-valid workflowModes, register, dials, loadedFiles, proofDemandBack) in `shared/context_loading_contract.md`; ASK if absent | `iteration-047.md:31` |
| D5-R4 | `DESIGN` router intent lane in all 3 CLI dictionaries → skill-local contract | P1 | enforceable | Add a `DESIGN` intent + keywords + `RESOURCE_MAP` target to each provider dictionary in the three cli-* SKILLs | `cli-opencode/SKILL.md:100` |
| D5-R5 | `OPEN_DESIGN_TRANSPORT_ASSERTION v1` child-resident pairing rule | P1 | enforceable | Add an `Open Design Transport Pairing (child-resident)` ALWAYS rule + assertion fields (childLoadedSkills, operationClass, liveToolsListVerified, payloadDigests) to all 3 cli-* | `mcp-open-design/SKILL.md:21` |
| D5-R6 | Reject `register=unknown` at dispatch; hoist compact manifest to shared CLI ref + parity | P1 | hybrid | Promote the compact block of cli-opencode Template 16 into a copied per-skill contract; checker fails if only one sibling has it; forbid unknown register pre-dispatch | `cli-opencode/assets/prompt_templates.md:587` |
| D5-R7 | Static token lint + router-replay + prompt-replay + negative-control fixtures | P1 | enforceable | Add fixtures asserting design prompts route to `DESIGN` / carry manifest tokens (sk-design, context_loading_contract.md, register.md, proof cards), with a neither-loaded negative control | `iteration-050.md:65` |
| D5-R8 | Treat Agent I/O as advisory-only; never read its absence as proof | P2 | hybrid | Document in the CLI contracts that Agent I/O may carry manifest/result digests but is not the gate; absence must not pass an Open Design handoff | `agent-io-contract.md:25` |

### Enforcement ceiling — the honest "1000%"
Enforceable across the CLI boundary: presence of the `DESIGN_DISPATCH_MANIFEST` and transport assertion/result blocks via static token lint; router-lane firing on a fixed local corpus (the router is deterministic — lowercases, boundary-matches, scores, loads `RESOURCE_MAP[intent]`); payload-INLINE presence (the contract ships as a skill-local copied reference, not a cross-skill path the child cannot resolve); and parent-side re-validation rejecting mismatched digests or a mutating Open Design call absent from `toolsCalled`, failing closed when `start_run`'s multi-turn build wrote files without a matching result. **Advisory:** the child model's application quality and taste after the gate is satisfied, and semantic classification of novel design phrasing beyond the fixture corpus. The honest path-resolvability ceiling: codex/claude-code children cannot resolve `.opencode/skills` paths, so the only enforceable guarantee is inline payload + returned-artifact re-validation; a text-only cli-claude-code child with no structured tool stream degrades digest matching to advisory (`iteration-048.md:84`).

### Open design decisions
- Where the canonical manifest/assertion lives: inside `shared/context_loading_contract.md` vs a shared CLI reference imported by both families (`iteration-047.md:79`).
- Skill-local duplicated `design_dispatch_contract.md` copies vs relaxing the shared-router same-skill path guard to allow one cross-skill shared reference (`iteration-050.md:83`).
- **Coverage gap (flagged):** iters 046–050 never exercised the `sk-prompt-models` per-model profiles or `AGENTS.md` carry named in the D5 charter — whether small-model children honor the inlined manifest, and whether Open Design routes via `DESIGN`→transport vs a compound `DESIGN_TRANSPORT` intent, remain untested (`iteration-050.md:85`).

---

## 9. D6 — CORPUS EXPANSION (designer-skills-main)

### What the new corpus added
The genuinely new contribution is a **command-as-workflow-verb architecture** with no impeccable analogue: a 9-plugin surface where commands are task recipes (`/ui-design:design-screen`, `/visual-critique:critique-screen`) carrying typed `argument-hint` grammar, ordered named-skill *choreography*, and explicit follow-up suggestions — "commands are workflows - verbs / skills run underneath them" (`designer-skills-main/README.md:113`). This is the portable pattern for sk-design's thin `/design:*` mode-pin wrappers that today return only `STATUS=OK|FAIL`. The corpus also isolated several enforceable proof-field *shapes* impeccable left implicit (neutral Observation slot before Problem/Fix; a decision-rationale lane; an AT coverage matrix; naming/doc lint; finite-state/measured-readability/locale matrices). Where it merely reinforced D1–D5: i18n, interaction-state, and edge-case coverage already exist in impeccable harden/polish — the novelty is the matrix/measured/lintable *shape*, not the topic.

### Backlog

| ID | Title | Sev | Class | Build action (what + target file) | Key evidence | Feeds |
|----|-------|-----|-------|-----------------------------------|--------------|-------|
| D6-R1 | Command-surface projection layer (typed `argumentGrammar` + `choreography[]` per task command) | P1 | enforceable | Add the sibling `command-metadata.json` (command, ownerModes[], argumentGrammar, choreography[], outputContract, nextOptions[]) projecting over the 5 workflowMode keys; generate `commands/design/*.md` from it; keep `mode-registry.json` as identity | `designer-skills-main/README.md:113` | D2 |
| D6-R2 | `commandRecipe` scorer adapter capping D2/D3 for undefined/invalid recipes | P1 | enforceable | Insert a recipe phase (metadata validity → wrapper drift → arg fixture → route/bundle → choreography witness) before resource-recall in `score-skill-benchmark.cjs` | `score-skill-benchmark.cjs:125` | D3 |
| D6-R3 | Lane C craft-stress fixtures (stateful-upload, dense-dashboard, locale-component) | P1 | enforceable | Author public/private fixture pairs under the Lane C fixture root expecting specific mode bundles + proof fields | `scenario_authoring.md:22` | D3 |
| D6-R4 | `INTERACTION STATE MATRIX` conditional proof lane | P1 | hybrid | Add a states/events/transitions/forbidden/guards/uiByState/recovery/a11y/reducedMotion field to `context_loading_contract.md` + proof card + `interface_preflight_card.md`; add state/async routing aliases | `state-machine/SKILL.md:24` | D1 |
| D6-R5 | `DECISION RATIONALE` proof lane (options/trade-offs/validation) | P1 | hybrid | Add a conditional field (decision, optionsConsidered[], evidenceSources[], tradeoffs[], validationPlan, sourceProofs[]) to the contract + proof card + `proof_check.py`; trigger on direction/pattern-break/handoff | `design-rationale/SKILL.md:9` | D3 |
| D6-R6 | `ACCESSIBILITY COVERAGE` sub-object under AUDIT EVIDENCE | P1 | hybrid | Split the single a11y dimension into a layered matrix (keyboard/screenReader/zoom/contrast/reducedMotion/AT/userTesting, each confirmed/inferred/blocked/not-assessed) in the contract + `design-audit/references/audit_contract.md`; gate WCAG/ready claims | `accessibility-test-plan/SKILL.md:31` | D4 |
| D6-R7 | `nextOptions[]` + handoff status grammar (no silent chain) | P2 | enforceable | Add STATUS/PRODUCES/NEXT_OPTIONS/HANDOFF_REQUIRED/HANDOFF_REASON to wrappers + metadata; checker resolves every next option to a known recipe; auto-chain forbidden unless requested | `ui-design/commands/design-screen.md:15` | D2 |
| D6-R8 | `design-command-surface-check` structural drift audit | P2 | enforceable | New checker comparing command files vs metadata vs generated docs vs wrapper frontmatter vs route fixtures | `designer-skills-main/README.md:63` | D2/D3 |
| D6-R9 | Observation/Problem/Fix finding triad in the audit schema | P2 | enforceable | Add a neutral OBSERVATION slot before Problem/Fix to `audit_contract.md` + `audit_report_template.md`; optional `proof_check.py --require-observation-triad` | `critique-composition/SKILL.md:35` | D4 |
| D6-R10 | `READABILITY AND DENSITY PROOF` + `LOCALE STRESS PROOF` conditional fields | P2 | hybrid | Add measured rows (chars-per-line, max-width, line-height, decision count; expansion/RTL locale, logical properties, mirrored icons) to the contract for content-heavy/global UI + static `margin-left`/`padding-left` RTL lint | `readable-measure/SKILL.md:14`; `localization-design/SKILL.md:24` | D1 |
| D6-R11 | `NAMING LINT` + `DOC COMPLETENESS` design-system artifact contract | P2 | enforceable | Add a conditional contract (naming regexes, token tiers, required doc headings) for token/component/library outputs only | `naming-convention/SKILL.md:23` | D4 |

### Net assessment
Partly justified. The command-recipe projection (D6-R1) plus its scorer/cap (D6-R2) is the highest-value port — it converts D2 argument grammar and D3 utilization from prose into a checkable schema with no impeccable precedent. The 041/049 craft lanes mostly contributed enforceable field *shapes* over topics impeccable already covers (state/i18n/a11y), so they are incremental hardening, not discovery. Clear redundancy: 037/038/045 re-mined the nine-plugin angle three times (their ~0.74 newInfoRatio is inflated) — ~2 of the 5 passes could have been one.

---

## 10. ENFORCEABLE vs ADVISORY LEDGER (the cross-cutting spine)

The four guarantee dimensions share ONE enforcement spine; building them as one system (not four bespoke gates) is the highest-leverage move.

| Layer | Mechanism (shared) | Surfaces it covers | Class |
|-------|--------------------|--------------------|-------|
| **Selection** | Parseable router projection (`hub-router.json`) + replay over a private gold corpus + gated `hubRoute` scorer | D3 hub→mode; D2 command→packet; D5 `DESIGN` lane | **enforceable** (on fixtures) |
| **Loading** | Content-bound proof token (sha256 of loaded files + anchor echo) replacing self-attested checkboxes | D3 utilization; D4 pairing; D5 dispatch | **enforceable** (presence + digest) |
| **Firing** | Deny-by-default tool-boundary precondition (PreToolUse + guarded proxy) | D4 MCP/CLI/HTTP/automation; D5 child re-validate | **enforceable** (blocking) |
| **Survival** | Inlined payload + parent-side re-validation of returned artifacts | D5 cross-CLI; D4 sub-agent laundering | **enforceable** (structural) |
| **Application** | Loaded-determinative witness (a cited rule changed one named output choice) | all | **hybrid** — presence enforceable, quality advisory |
| **Taste** | — | all | **advisory** — only rendered/behavioral/human review |
| **Open-ended live intent** | — | prompts outside the fixture corpus | **advisory** — NL is not deterministic (proxy 0.087→0.63) |

**The honest "1000%":** selection + loading + firing + survival can be driven to ~100% **on a fixture corpus and at the tool boundary**, and the residual live miss-rate can be *measured* (`routeMissRate`, `proofFailRate`, `telemetryMissingRate`) rather than assumed. Application quality and taste cannot be guaranteed by any gate; the deliverable makes their absence *loud* (a missing witness blocks a ready-claim) but never claims to certify good design.

---

## 11. VERIFICATION PLAN

A later build phase should prove each landed item against these gates (all deterministic unless noted):

1. **Router parseability** — `node router-replay.cjs .opencode/skills/sk-design` returns `parseable:true` (today: false). Gate in `d5-connectivity.cjs` style (P0 `router_unparseable`).
2. **Fixture routing** — a private gold corpus of hint-free prompts + adversarial minimal pairs; the gated `hubRoute` stage must pass `expected.workflowMode` / `routeOutcome` / `forbiddenWorkflowModes`. Report `routeMissRate`.
3. **Command-surface drift** — `design-command-surface-check.mjs`: every wrapper's frontmatter equals `command-metadata.json`; no surviving `<design request>`; mutation-free modes carry no Write/Edit/Bash; ownerMode ∈ workflowMode; aliases unique.
4. **Content-bound proof** — `proof_check.py --require-source-proof` recomputes a loaded-file digest / anchor echo (not just field presence); a ready-claim without a `loaded-determinative` witness fails.
5. **Open-design pairing** — the executable PreToolUse/proxy precondition denies a mutating Open Design call lacking a valid, fresh, single-use `DESIGN_PROOF_TOKEN`; a pure-transport allowlist passes with a positive exemption. Test all surfaces (MCP, od Bash, HTTP, automation, inner-agent, sub-agent).
6. **Cross-CLI survival** — static token lint asserts the `DESIGN_DISPATCH_MANIFEST` + transport assertion/result blocks are present in dispatch payloads; parent-side re-validation rejects mismatched digests / unlisted mutating calls; negative control loads neither.
7. **Drift gates** — `parent-hub-vocab-sync` (four-copy vocabulary), `scanHubRegistry` (alias collisions, dead packets, uncovered-intent rate).
8. **No-regression** — re-run the existing skill-benchmark suite; the new gates are additive and must not drop existing D5-connectivity passes.

**Advisory checks (cannot be automated to pass/fail):** rendered/visual review of applied judgment; whether an ambiguous live prompt routed correctly outside the fixture corpus; Brand/Product calls on genuinely mixed surfaces.

---

## 12. CONVERGENCE REPORT

- **Iterations:** 50/50 completed. **Stop reason:** `maxIterationsReached` (the only stop; convergence was logged as a signal, never enforced).
- **Non-convergence:** newInfoRatio mean **0.655**, min **0.57**, max **0.74**, std small — the series never approached the 0.05 convergence floor. Anti-convergence held because each iteration drew a genuinely fresh angle from a 57-angle bank, and a parallel monitor injected deeper/cross-cutting angles + switched the corpus to `designer-skills-main` for the back third.
- **Resilience:** one transient codex hang (iter 9) recovered on a driver restart from externalized state; codex contention with two concurrent xhigh research fanouts slowed some iterations to ~6 min but none failed; one accidental duplicate monitor was killed by exact PID. No data loss (reduced state corruptionCount = 0).
- **Honesty caveats:** the D6 corpus-expansion angle `MON-B3` ran three times (the monitor override persisted across the driver's fast advance) — those passes deepened rather than repeated, but ~2 of 5 D6 iterations were lower-yield than their ratio claimed. D5 left the `sk-prompt-models` and `AGENTS.md` carry-path untested (flagged as a coverage gap, §8).
- **Scope honored:** RESEARCH ONLY. No live `sk-design` / commands / `mcp-open-design` / `cli-*` files were edited. Nothing was committed.

---

<!-- ANCHOR:references -->
## 13. REFERENCES

**Primary research artifacts (this packet):**
- `research/deep-research-state.jsonl` — 50 iteration records + convergence-signal events.
- `research/iterations/iteration-001.md` … `iteration-050.md` — per-iteration evidence (findings + file:line citations + enforceable/advisory labels).
- `research/angle-bank.json` — the 57-angle bank (D1–D6) the driver advanced.
- `research/deep-research-strategy.md` — runtime strategy + key questions.
- `research/deep-research-dashboard.md` — reducer-maintained dashboard.

**Live targets cited across the backlog (verified on-disk):**
- Routing: `.opencode/skills/sk-design/SKILL.md:41`, `.opencode/skills/sk-design/mode-registry.json:4`, `.opencode/skills/sk-design/design-interface/SKILL.md:100`.
- Routing machinery: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:166`, `d5-connectivity.cjs:125`, `advisor-probe.cjs:155`, `score-skill-benchmark.cjs:278`.
- Proof primitives: `.opencode/skills/sk-design/shared/context_loading_contract.md`, `shared/assets/context_loaded_card.md`, `shared/assets/proof_of_application_card.md`, `shared/scripts/proof_check.py:47`.
- Open-design: `.opencode/skills/mcp-open-design/SKILL.md:164`, `references/tool_surface.md:46`, `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215`.
- Cross-CLI: `.opencode/skills/cli-opencode/SKILL.md:327`, `.opencode/skills/cli-codex/SKILL.md:359`, `.opencode/skills/cli-claude-code/SKILL.md:354`, `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25`.
- Commands: `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`.
- Corpus: `.opencode/specs/design/008-sk-design-parent/external/impeccable-main/`, `.../external/designer-skills-main/`.
<!-- /ANCHOR:references -->
