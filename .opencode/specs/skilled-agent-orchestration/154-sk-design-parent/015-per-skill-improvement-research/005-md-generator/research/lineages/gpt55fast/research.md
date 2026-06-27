# Deep Research Synthesis: sk-design md-generator Improvement

> Lineage: `gpt55fast`
> Session: `fanout-gpt55fast-1782532104406-xmcn5n`
> Executor: `cli-opencode model=openai/gpt-5.5-fast`
> Stop reason: `converged` after 6 iterations of max 10
> Scope: research-only findings. No skill or spec files were modified.

## Verdict

The highest-leverage md-generator improvement is not another fidelity reference. The live skill already has the boundary/reference work that prior research recommended: `authoring_boundary.md`, `source_of_truth_router_card.md`, deterministic v3 value emitters, Quick Start validation, and claims scoring. The improvement frontier is operational:

1. Restore setup/tooling viability around the missing nested `backend/package.json`.
2. Improve routing aliases and benchmark coverage for non-extract md-generator intents.
3. Add a guided preflight/run wrapper that reduces multi-command friction while preserving the extract/write/validate contract.
4. Align manual playbook probes to the actual emitted schema and add a short smoke lane.
5. Add one non-SaaS real extraction exemplar after the higher-priority operational fixes.

## Evidence Baseline

The active md-generator mode lives under `.opencode/skills/sk-design/design-md-generator`, while the public parent hub routes `md-generator` to that packet [SOURCE: .opencode/skills/sk-design/SKILL.md:23-29], [SOURCE: .opencode/skills/sk-design/mode-registry.json:63-73]. The mode's contract is a live-site extraction pipeline that creates `tokens.json`, builds a v3 Style Reference, and validates fidelity [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12-15], [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:221-305]. The cardinal rule is strict: every hex, px, weight, radius, duration, and shadow must be copied verbatim from `tokens.json`; false systems are forbidden [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:27-44].

Prior research called md-generator the leanest expansion target and recommended only the authoring boundary, source-of-truth card, and a non-SaaS exemplar, while rejecting forward authoring and a second backend [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:115-125]. The live packet already includes the boundary and card [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md:18-28], [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md:16-74].

## Prioritized Improvements

| Priority | Improvement | Why | Evidence | Effort |
|---|---|---|---|---|
| P1 | Restore backend setup viability | The docs instruct `cd backend && npm install`, but the nested backend has `package-lock.json` and no `package.json` in this checkout. Without the manifest, setup, tests, and advertised scripts are unreliable. | Setup docs [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:276-307], backend README [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:38-58], package-lock root metadata [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package-lock.json:1-26] | S |
| P1 | Expand md-generator routing and benchmark cases | The operator-supplied Mode A score is 76/100. The expected benchmark artifact was absent, but live aliases mainly cover extract/generate/capture token intents; they under-cover validation, report, preview, proof, study, and update cases. | Mode aliases [SOURCE: .opencode/skills/sk-design/mode-registry.json:63-73], parent triggers [SOURCE: .opencode/skills/sk-design/graph-metadata.json:49-65], md-generator use cases [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:32-40] | S-M |
| P1 | Add a guided `run` or `preflight` wrapper | The current operator path is multiple explicit commands. A wrapper can check Node, dependencies, Chromium, output path, package manifest, and then run extraction, build-write-prompt, validation, and optional report. This improves efficiency without changing fidelity semantics. | CLI is extraction-only [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:7-18], next steps are manual [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:43-53], workflow requires sequential phases [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:46-69] | M |
| P1 | Align playbook probes to actual schema and add a smoke lane | The full playbook has 13 scenarios, which is good for release readiness but heavy for ordinary validation. A 3-scenario smoke lane should verify setup, extract on a simple URL, and validate one faithful/design-failure pair. Schema probes should target current `DesignTokens` fields. | Scenario count [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:23-40], preconditions [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:63-75], schema fields [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:337-410], component state fields [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:461-478] | M |
| P2 | Add one non-SaaS real exemplar | The current examples are valuable but clustered around Stripe, Vercel, Linear, and Supabase. A real editorial/ecommerce/hospitality/maximalist example would broaden study intent and test the v3 format outside developer-tool aesthetics. | Prior recommendation [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:121-125], existing examples [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/stripe/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/vercel/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/linear/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/supabase/DESIGN.md:1-6] | M |
| P2 | Add a routing/evidence note for benchmark gaps | The missing benchmark artifact should be turned into a repeatable benchmark fixture rather than remembered as oral context. Include cases for extract, validation-only, report, example study, boundary refusal, Figma/Open Design refusal, and generic design-token requests that should route to foundations instead. | Benchmark path was present but empty in this checkout; mode-registry evidence above | S |

## Detailed Rationale

### 1. Setup viability is the first blocker

The skill repeatedly tells operators to run setup from `backend/` [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:276-285], and the backend README lists `package.json` as the scripts/dependencies home [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:86-107]. In the live nested backend, `package-lock.json` exists and declares the package, dependencies, devDependencies, and bin [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package-lock.json:1-26], but no `package.json` was found. This is a concrete efficiency and UX risk: even perfect docs cannot make `npm install`, `npm test`, or bin execution ergonomic when the manifest is missing.

Recommended fix direction: restore or regenerate the nested backend `package.json` from the lockfile/package metadata, then make docs and tests assert that the manifest exists. Do this before adding any new workflow wrapper.

### 2. Routing score likely suffers from intent undercoverage

The user supplied Mode A score 76/100. No benchmark file was present under `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark` in this checkout, so the exact miss cases are unknown. Live routing evidence still shows a likely gap: the md-generator registry aliases are extraction-heavy [SOURCE: .opencode/skills/sk-design/mode-registry.json:63-73], while the skill explicitly owns validation-only, visual reports, and example study [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:34-40].

Recommended benchmark cases:

| Prompt Class | Expected Route |
|---|---|
| "Extract design tokens from https://..." | `sk-design` -> `md-generator` |
| "Generate DESIGN.md from this live site" | `sk-design` -> `md-generator` |
| "Validate this DESIGN.md against tokens.json" | `sk-design` -> `md-generator` |
| "Render a preview/report from DESIGN.md and tokens.json" | `sk-design` -> `md-generator` |
| "Study the Stripe/Vercel DESIGN.md examples" | `sk-design` -> `md-generator` |
| "Author a DESIGN.md from this brand brief only" | Not md-generator; boundary/refusal to separate design-spec decision |
| "Extract from Figma" | `mcp-figma` with design judgment, not md-generator |
| "Create a color token system from a brief" | `foundations`, not md-generator |

Alias additions should stay precise: `validate DESIGN.md`, `check tokens.json fidelity`, `style reference validation`, `DESIGN.md preview`, `visual report`, `fidelity proof`, `study style reference examples`, `DESIGN.md from live URL`. Avoid broad aliases like `design system` alone because they collide with foundations and interface.

### 3. Guided pipeline UX should preserve the three-phase contract

The current workflow is intentionally explicit: extract, build write prompt, validate [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:39-71]. That explicitness protects fidelity, but the CLI only runs extraction and prints manual next steps [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:43-53]. A small wrapper can improve efficiency without hiding the contract:

- `preflight`: report Node version, package manifest presence, dependencies, Chromium installation, output path safety, and writable output folder.
- `extract`: existing behavior.
- `write-prompt`: run `build-write-prompt.ts` and save the prompt to the output folder for copy/paste.
- `validate`: run `validate.ts` and save machine-readable validation JSON plus the text report.
- `report`: run proof/report/preview only when DESIGN.md exists.

Do not auto-author DESIGN.md inside this wrapper unless the existing skill workflow supplies the writing agent and has loaded `design_md_format.md` plus `writing_style_guide.md` [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:328-335]. The wrapper should orchestrate tools, not weaken the authoring boundary.

### 4. Playbook should have two lanes

The manual playbook is release-grade: 13 scenarios, evidence requirements, and critical-path release gates [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:23-40], [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:79-92], [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:131-141]. That is too heavy for every operator run.

Add a short smoke lane:

1. Setup/preflight PASS.
2. Extract a simple public URL to a temporary spec output folder and confirm `tokens.json`, screenshots, and `extraction-report.json` exist.
3. Run validation against a known-good fixture and a planted phantom Quick Start failure.

Keep the full 13-scenario lane for release readiness. Align all schema probes to current emitted fields: `meta.framework`, `iconSystem`, `motionSystem`, `a11yTokens`, `darkMode`, `breakpoints`, and `components[].variants.*Changes` [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:337-410], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:461-478].

### 5. Non-SaaS exemplar is useful but not first

The four existing examples are high-quality v3 Style References, but all are developer/product infrastructure brands [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/stripe/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/vercel/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/linear/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/supabase/DESIGN.md:1-6]. A fifth exemplar should be a real extraction from a distinct aesthetic, not a hand-authored style preset. Good candidates: editorial publication, ecommerce brand, hospitality/restaurant, culture/museum, or maximalist campaign.

This is P2 because the tool must first be easy to set up and route correctly.

## Explicit Do-Not List

- Do not add forward DESIGN.md authoring to md-generator. The live boundary states brief-only authoring is out of scope and a separate future design-spec decision [SOURCE: .opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md:86-99]. The Stitch external corpus is useful only as contrast for why that contract differs [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/stitch-skill.md:17-25].
- Do not add a second crawler/backend. Prior synthesis rejected it and the live pipeline already extracts, writes, validates, and reports [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:125-126], [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:456-462].
- Do not duplicate existing format, taxonomy, fidelity, or boundary references. The live reference set already covers format, writing style, color/component taxonomy, anti-patterns, authoring boundary, quality, extraction workflow, and troubleshooting [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:85-103].
- Do not bulk-import the external corpus. Prior synthesis rejected corpus bulk import in favor of operational cards and checklists [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:158-176].
- Do not weaken `tokens.json` fidelity to improve UX. The output is valuable because measured values remain verbatim [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:27-44].
- Do not flatten md-generator behavior into the `sk-design` hub. The hub must remain routing-only while each mode owns its workflow [SOURCE: .opencode/skills/sk-design/SKILL.md:39-58], [SOURCE: .opencode/skills/sk-design/SKILL.md:81-95].

## Suggested Implementation Sequence

1. Fix/restore backend `package.json` or adjust setup architecture so documented setup commands are executable.
2. Add preflight checks for package manifest, Node, dependencies, Chromium, output path safety, and script availability.
3. Expand routing aliases and add benchmark fixtures for validation/report/study/boundary cases.
4. Add a guided wrapper that preserves phase boundaries and saves prompt/validation/report artifacts.
5. Split manual testing into smoke and full-release lanes; update schema probes.
6. Add one real non-SaaS exemplar with writing notes and validation evidence.

## References

- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/graph-metadata.json`
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md`
- `.opencode/skills/sk-design/design-md-generator/references/writing_style_guide.md`
- `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md`
- `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md`
- `.opencode/skills/sk-design/design-md-generator/references/quality_checklist.md`
- `.opencode/skills/sk-design/design-md-generator/references/troubleshooting.md`
- `.opencode/skills/sk-design/design-md-generator/assets/cardinal_rules_card.md`
- `.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md`
- `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/package-lock.json`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/stitch-skill.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable.md`

## Gaps And Caveats

- No benchmark artifact was found under `154-sk-design-parent/014-routing-benchmark`; the 76/100 score is operator-supplied context.
- No live extraction was run because extraction would create output artifacts beyond this lineage research packet.
- The declared spec subfolder had no canonical `spec.md`, `plan.md`, `tasks.md`, or `resource-map.md` in this checkout.
