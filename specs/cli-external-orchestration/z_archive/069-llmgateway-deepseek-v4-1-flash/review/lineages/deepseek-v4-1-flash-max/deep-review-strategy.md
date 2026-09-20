---
title: Deep Review Strategy - 069 llmgateway DeepSeek V4.1 Flash
description: Session tracking for the deep-review lineage deepseek-v4-1-flash-max over packet 069.
---

# Deep Review Strategy - Session Tracking

## 1. TOPIC
Review of `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash` (spec-folder, Level 2). The packet moves the DeepSeek Flash model id on the DevPass (LLM Gateway) route, then reopens the two sibling routes: `opencode-go` (dispatch-verified) and `cline-pass` (listing-only). The review audits the change set — both CLI rosters, both SKILL.md anchors, the three `.pi` config files, the cli-pi dispatch playbook, the deep-loop executor config and its test — plus the packet's own verification and continuity claims. `scratch/review-claims-to-verify.md` supplied three explicitly unverified claims that this lineage was asked to confirm or refute.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 3. NON-GOALS
- No live network probes. The gateway, Cline and opencode-go routes are not re-called from this lineage; every routing claim about a live `200`/`410`/`400`/`429` response is audited against the packet's own recorded evidence and the repository, not re-measured.
- No re-run of the packet's gates. `validate.sh`, `check-frontmatter-versions.sh` and the two vitest suites are read, not executed: this lineage's write surface is the lineage directory, and a repo-wide tool run is outside it.
- No fixes. Findings only; the target files were never modified.
- Pricing, tier-ladder and catalog-size claims that only a live API can settle are out of scope (the review records them as unverifiable here, not as defects).

---

## 4. STOP CONDITIONS
- `config.stopPolicy: max-iterations` with `config.maxIterations: 1`. The loop ends after iteration 001 by cap, regardless of the composite convergence score; convergence is telemetry only for this lineage.
- No other stop condition applies.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 6A. WHAT WORKED
- Reading the packet's `scratch/review-claims-to-verify.md` first and treating each claim as unverified: all three were settled by primary evidence (the installed pi binary, the AC-coverage rule's own analyzer, the FRONTMATTER_MEMORY_BLOCK rule source). (iteration 1)
- Grepping the retired literal across `.opencode` and `.pi` rather than trusting the packet's scan claim: this is what surfaced the stale playbook expectation the packet's AC-001 records as a clean miss. (iteration 1)
- `git status`/`git diff` to separate this packet's working-tree edits from concurrent and pre-existing content, which is how the duplicated closure paragraph and the carried-forward `defaultProvider` claim were attributed correctly. (iteration 1)

---

## 7. WHAT FAILED
- Attempting to settle the live route claims (pricing, ladder, catalog size) statically: they are probe-dependent and were left as recorded-not-verified. (iteration 1)
- Testing pi's default-model resolution directly: exercising `pi` from inside this session is a dispatch and was not attempted; the resolution risk is recorded as a deferred verification item instead of a finding. (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Executing `pi` to settle the default-model resolution question (`llmgateway` plus `z-ai/glm-5.3-flash`): a pi dispatch is not available to this lineage, so the question stays open and is carried in Deferred Items rather than reported as a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Executing `pi` to settle the default-model resolution question (`llmgateway` plus `z-ai/glm-5.3-flash`): a pi dispatch is not available to this lineage, so the question stays open and is carried in Deferred Items rather than reported as a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing `pi` to settle the default-model resolution question (`llmgateway` plus `z-ai/glm-5.3-flash`): a pi dispatch is not available to this lineage, so the question stays open and is carried in Deferred Items rather than reported as a finding.

### Missing `checklist.md` as a Level 2 defect: Level 2 requires `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`; `tasks.md` carries the verification checklist and its `<!-- ANCHOR:protocol -->` marker, which is the traceability source the AC rule itself looks for. Evidence: `folder-structure.md:111-125`, `check-ac-coverage.sh:183-191`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing `checklist.md` as a Level 2 defect: Level 2 requires `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`; `tasks.md` carries the verification checklist and its `<!-- ANCHOR:protocol -->` marker, which is the traceability source the AC rule itself looks for. Evidence: `folder-structure.md:111-125`, `check-ac-coverage.sh:183-191`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing `checklist.md` as a Level 2 defect: Level 2 requires `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`; `tasks.md` carries the verification checklist and its `<!-- ANCHOR:protocol -->` marker, which is the traceability source the AC rule itself looks for. Evidence: `folder-structure.md:111-125`, `check-ac-coverage.sh:183-191`.

### Re-running the two deep-loop vitest suites and `validate.sh`: outside this lineage's write surface. Their reported results are treated as recorded evidence, not confirmed evidence, and the traceability rows above say so. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-running the two deep-loop vitest suites and `validate.sh`: outside this lineage's write surface. Their reported results are treated as recorded evidence, not confirmed evidence, and the traceability rows above say so.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the two deep-loop vitest suites and `validate.sh`: outside this lineage's write surface. Their reported results are treated as recorded evidence, not confirmed evidence, and the traceability rows above say so.

### Static verification of the live route claims (context, output ceiling, price, ladder, catalog size, `410`/`400`/`429` statuses): these are probe results by construction and cannot be re-derived from the tree. Recorded as unverified-by-this-lineage, not as defects. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Static verification of the live route claims (context, output ceiling, price, ladder, catalog size, `410`/`400`/`429` statuses): these are probe results by construction and cannot be re-derived from the tree. Recorded as unverified-by-this-lineage, not as defects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static verification of the live route claims (context, output ceiling, price, ladder, catalog size, `410`/`400`/`429` statuses): these are probe results by construction and cannot be re-derived from the tree. Recorded as unverified-by-this-lineage, not as defects.

### The `cline-pass` route as over-claimed: both rosters, the Pi setup doc and the changelogs say listing-only, name the `429` blocker and name the V4-Flash fallback. Evidence: `providers-and-models.md:96`, `.pi/custom-providers.md:131`, `cli-pi/changelog/v1.5.3.0.md:14-21`, `cli-opencode/changelog/v1.4.6.0.md:15-23`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The `cline-pass` route as over-claimed: both rosters, the Pi setup doc and the changelogs say listing-only, name the `429` blocker and name the V4-Flash fallback. Evidence: `providers-and-models.md:96`, `.pi/custom-providers.md:131`, `cli-pi/changelog/v1.5.3.0.md:14-21`, `cli-opencode/changelog/v1.4.6.0.md:15-23`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `cline-pass` route as over-claimed: both rosters, the Pi setup doc and the changelogs say listing-only, name the `429` blocker and name the V4-Flash fallback. Evidence: `providers-and-models.md:96`, `.pi/custom-providers.md:131`, `cli-pi/changelog/v1.5.3.0.md:14-21`, `cli-opencode/changelog/v1.4.6.0.md:15-23`.

### The OpenRouter occurrences as REQ-001 violations: `fanout-run.cjs:2091,2295`, `executor-config.ts:198,201`, `fanout-run.vitest.ts:1588` and `.pi/settings.json:18` all carry the provider-prefixed form, which resolves through a provider the packet excludes by decision (`spec.md:65`). Evidence: the one-literal-one-provider rule in `spec.md` §5 edge cases. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The OpenRouter occurrences as REQ-001 violations: `fanout-run.cjs:2091,2295`, `executor-config.ts:198,201`, `fanout-run.vitest.ts:1588` and `.pi/settings.json:18` all carry the provider-prefixed form, which resolves through a provider the packet excludes by decision (`spec.md:65`). Evidence: the one-literal-one-provider rule in `spec.md` §5 edge cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The OpenRouter occurrences as REQ-001 violations: `fanout-run.cjs:2091,2295`, `executor-config.ts:198,201`, `fanout-run.vitest.ts:1588` and `.pi/settings.json:18` all carry the provider-prefixed form, which resolves through a provider the packet excludes by decision (`spec.md:65`). Evidence: the one-literal-one-provider rule in `spec.md` §5 edge cases.

### The pin-pattern triplication as a new defect: `executor-config.ts:243` and `fanout-run.cjs:1984` are byte-identical, and the third copy inside `executor-config.vitest.ts:861` asserts the live literal. Evidence: both files read at those lines; the residual risk is already recorded in `implementation-summary.md` §6 item 4. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The pin-pattern triplication as a new defect: `executor-config.ts:243` and `fanout-run.cjs:1984` are byte-identical, and the third copy inside `executor-config.vitest.ts:861` asserts the live literal. Evidence: both files read at those lines; the residual risk is already recorded in `implementation-summary.md` §6 item 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The pin-pattern triplication as a new defect: `executor-config.ts:243` and `fanout-run.cjs:1984` are byte-identical, and the third copy inside `executor-config.vitest.ts:861` asserts the live literal. Evidence: both files read at those lines; the residual risk is already recorded in `implementation-summary.md` §6 item 4.

### Version-anchor drift as a defect: `cli-pi/SKILL.md:5` is `1.5.3.0` against newest changelog `v1.5.3.0`, and `cli-opencode/SKILL.md:5` is `1.4.6.0` against `v1.4.6.0`, so the frontmatter gate's `max(SKILL.md, changelog)` invariant holds. Evidence: both files read. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Version-anchor drift as a defect: `cli-pi/SKILL.md:5` is `1.5.3.0` against newest changelog `v1.5.3.0`, and `cli-opencode/SKILL.md:5` is `1.4.6.0` against `v1.4.6.0`, so the frontmatter gate's `max(SKILL.md, changelog)` invariant holds. Evidence: both files read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Version-anchor drift as a defect: `cli-pi/SKILL.md:5` is `1.5.3.0` against newest changelog `v1.5.3.0`, and `cli-opencode/SKILL.md:5` is `1.4.6.0` against `v1.4.6.0`, so the frontmatter gate's `max(SKILL.md, changelog)` invariant holds. Evidence: both files read.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- The OpenRouter occurrences are not a REQ-001 violation: `deepseek/deepseek-v4-flash-vision-exp` and the `.pi` `openrouter/...` entry map to a provider the packet deliberately excluded, and the packet records that exclusion as an open question for another owner. (iteration 1, evidence: `spec.md:65`, `fanout-run.cjs:2091`)
- The allowlist count and the pin-pattern mirror are not defects: the allowlist still holds ten ids and `fanout-run.cjs:1984` is byte-identical to `executor-config.ts:243`. (iteration 1, evidence: `executor-config.ts:189-205`)
- The absence of `checklist.md` is not a defect: Level 2 requires spec/plan/tasks/implementation-summary, and `tasks.md` carries the verification checklist. (iteration 1, evidence: `folder-structure.md:111-125`)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
1. Fix F001, then re-run the retired-id sweep with a predicate that includes playbooks and non-changelog documentation, and correct AC-001/F002 evidence from the real run. 2. Correct the handover's verification statements (F003, F004, F005) before any session resumes from that file, since all three are read as fact by the next reader. 3. Resolve F006 by stating the real `defaultProvider`, and run the deferred `pi` default-resolution check to decide whether the `llmgateway` + `z-ai/glm-5.3-flash` pair resolves or silently falls through. 4. Delete the duplicated paragraph (F007) while editing the closure section for F002. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior work on this packet exists (two passes, both uncommitted at review time), so the known-context snapshot is populated from the packet documents and the working tree.

### Bounded Context Snapshot
- **Target pointers:** `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash` (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `description.json`, `graph-metadata.json`, `scratch/review-claims-to-verify.md`); implementation surface: `.opencode/skills/cli-external-orchestration/cli-pi/**`, `.opencode/skills/cli-external-orchestration/cli-opencode/**`, `.pi/models.json`, `.pi/settings.json`, `.pi/custom-providers.md`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.opencode/skills/system-deep-loop/runtime/tests/unit/{executor-config,fanout-run}.vitest.ts`.
- **Behavior claims to verify:** REQ-001 (no live surface names the deactivated id), REQ-002 (fan-out default/allowlist/provider map/pin agree), REQ-003 (roster claims measured), REQ-006 (`opencode-go` moved everywhere), REQ-007 (`cline-pass` listing-only with blocker and fallback), REQ-004/008/009 (suites and frontmatter gate, Pi catalog, second changelog entries); SC-001..SC-008; AC-001..AC-021.
- **Reuse and conventions:** one literal maps to one provider (`PI_MODEL_PROVIDERS` / `PI_SUPPORTED_MODELS`); the pin pattern is mirrored between script and TypeScript source; the retired-id sweep is scoped to non-changelog surfaces; the `.pi` provider blocks are env-keyed.
- **Review risks and gaps:** all live probe evidence is second-hand (recorded in the packet, not reproducible here); the deep-loop vitest suites and `validate.sh` were not executed by this lineage; the `cline-pass` route cannot be exercised until the quota window resets; the graph/index entries (`description.json`, `graph-metadata.json`) describe the first pass only, as the packet itself records.
- **Resource map:** `resource-map.md` not present. Skipping coverage gate.
- **Out of scope:** OpenRouter literals and their fan-out mapping; the tier ladder; pricing claims; the concurrent edits in the working tree that are not this packet's (e.g. hook and repo-rule files).

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Every wiring claim resolves to shipped code (allowlist, default, provider map, pin, rosters, Pi config); REQ-001 fails on one non-changelog surface and the recorded scan evidence is overstated |
| `checklist_evidence` | core | partial | 1 | `tasks.md` checklist items are marked `[x]` without per-item `file:line` evidence; the packet-level runs are recorded in `implementation-summary.md` and 15 of 21 ACs lack a citation |
| `skill_agent` | overlay | notApplicable | 1 | Target is a spec folder, not a skill package |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent definitions in scope |
| `feature_catalog_code` | overlay | notApplicable | 1 | No catalog entry claims a capability that this change touches |
| `playbook_capability` | overlay | partial | 1 | The cli-pi model-dispatch playbook is the editable surface in scope, and one of its scenarios (`supported-model-allowlist-smoke.md`) contradicts shipped behavior |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `spec.md`, `plan.md`, `tasks.md` | D3, D4 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `acceptance-criteria.md` | D3, D4 | 1 | 0 P0, 1 P1, 2 P2 | complete |
| `implementation-summary.md` | D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `handover.md` | D3 | 1 | 0 P0, 0 P1, 3 P2 | complete |
| `decision-record.md` | D3 | 1 | none | complete |
| `description.json`, `graph-metadata.json` | D3 | 1 | none | complete |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | D1, D2, D4 | 1 | none | complete |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | D1, D2 | 1 | none | complete |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | D1, D3 | 1 | none | complete |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | D1, D3, D4 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | D1, D3 | 1 | none | complete |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | D3 | 1 | none | complete |
| `.pi/models.json`, `.pi/settings.json`, `.pi/custom-providers.md` | D1, D2, D3, D4 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/args.js` (external reference) | D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` + `lib/validator-registry.json` (reference) | D3 | 1 | none | complete |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/{orchestrator,spec-doc-structure}.ts` (reference) | D3 | 1 | none | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-v4-1-flash-max-1789146954427-phycl9, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-09-11T17:16:25Z
- Write surface: this lineage directory only
<!-- MACHINE-OWNED: END -->
