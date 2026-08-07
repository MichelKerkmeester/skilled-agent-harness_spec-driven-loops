---
title: Deep Review Iteration 003 - Security
description: Security review narrative for sk-design 009 Claude-parity deep review.
---

# Deep Review Iteration 003 - Security

## Dimension

Security. This pass reviewed md-generator output-path guards, Bash/process boundaries, prompt/template injection risk from extracted live-site data, crawler side-effect controls, generated artifact write locations, and the trust-boundary split between the four read-only modes and the mutating md-generator mode.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Prior state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:112`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:32`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Security was the planned next dimension; the existing P1-001 is correctness-only unless component data is later surfaced without escaping. |
| md-generator output path contract | `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:46`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:215`, `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:69` | Docs/testing describe spec-folder or sandbox output boundaries. The backend and command do not enforce that boundary; P1-002 below. |
| Backend write locations | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:276`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:589`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:606`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:635` | `extract.ts` rejects only skill-internal output paths and then writes fixed artifact names under the caller-provided output directory. |
| Guided wrapper process and write path | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:120`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:138`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:168`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:189`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:222` | `spawnSync` uses argv arrays with no shell, so command injection was not confirmed. The wrapper repeats the output-boundary gap and writes `write-prompt.md` under arbitrary non-skill output paths. |
| Prompt data flow | `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:196`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:887`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:931`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:18`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80` | Extracted live-site typography values reach the WRITE prompt as instruction-adjacent prose without a prompt-data isolation layer; P1-003 below. |
| Crawler URL and side-effect controls | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:73`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:410`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:650`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:671`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:774` | No same-domain escape or obvious form-submit side-effect path was confirmed in this pass. The crawler keeps same-domain link discovery and skips forms, submit controls, navigation hrefs, and action-intent controls before clicking reveal UI. |
| Read-only versus mutating mode boundary | `.opencode/skills/sk-design/mode-registry.json:37`, `.opencode/skills/sk-design/mode-registry.json:57`, `.opencode/skills/sk-design/mode-registry.json:77`, `.opencode/skills/sk-design/mode-registry.json:97`, `.opencode/skills/sk-design/mode-registry.json:117`, `.opencode/commands/design/md-generator.md:4`, `.opencode/commands/design/interface.md:4` | Registry and command frontmatters preserve the intended split: interface/foundations/motion/audit are Read/Glob/Grep only, while md-generator is the only mutating mode. |

## Findings by Severity

### P0

None.

### P1

#### P1-002 [P1] md-generator output guard does not enforce the documented spec-folder or sandbox boundary

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267`
- Claim: The md-generator backend can write generated artifacts outside the documented spec-folder or sandbox boundary because it only rejects paths inside the skill directory, then writes artifacts under any other caller-provided output path.
- Evidence: The public workflow says extraction output must be run from repo root with `--output .opencode/specs/<track>/<packet>/output`, and `extract.ts` usage says `--output` is required and must resolve to a spec folder outside the skill. The manual testing playbook constrains md-generator scenario execution to `/tmp/skd-*` sandbox paths. Evidence: `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:46`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:215`, `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:69`.
- Guard gap: The actual backend computes `resolvedOut = path.resolve(options.output)` and exits only if that path is the skill root or inside it. It does not require `.opencode/specs/`, a current spec folder, or `/tmp/skd-*` sandbox output. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:268`.
- Write behavior: After the guard, extraction creates the output directory and writes screenshots, `tokens.json`, `raw-data.json`, and `extraction-report.json` under `options.output`. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:276`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:310`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:589`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:606`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:635`.
- Wrapper evidence: `guided-run.ts` repeats the same narrower preflight: `unsafeOutputPathReason()` rejects only backend/skill-root containment, then writes `write-prompt.md` under `path.resolve(process.cwd(), options.output)`. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:138`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:222`.
- Counterevidence sought: I checked for URL-derived filename traversal and did not find it: screenshot filenames are derived from `urlToSlug()`, which strips path separators and non-alphanumeric/hyphen characters. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:651`.
- Alternative explanation: The backend may intentionally allow arbitrary operator-selected output directories. If so, the docs and playbook are overstating the boundary, and the command should present this as an explicit workspace-write capability rather than a spec-folder-constrained one.
- Final severity: P1. This is a workspace write-scope guard mismatch in the only mutating design mode. It is not P0 because the write filenames are fixed and require an explicit output argument, and I did not confirm URL-controlled traversal.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the intended contract is changed to explicitly allow arbitrary operator-selected output paths and the command layer adds clear confirmation/rollback language before non-spec writes; otherwise enforce an allowlist for the current spec output directory or `/tmp/skd-*` sandboxes.
- Finding class: cross-consumer.
- Affected surface hints: `extract.ts`, `guided-run.ts`, `/design:md-generator`, manual playbook sandbox scenarios, spec-folder output contract.
- Recommendation: Centralize output-path validation and require either a resolved `.opencode/specs/.../output` path for production runs or `/tmp/skd-*` for manual-test scenarios before any `mkdirSync` or `writeFileSync` occurs.

#### P1-003 [P1] Extracted live-site values enter the WRITE prompt without prompt-data isolation

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:18`
- Claim: A malicious or compromised source site can inject instruction-like text into the md-generator WRITE prompt through extracted typography values because the prompt builder interpolates live-site-derived strings directly into a natural-language prompt without delimiting or escaping them as untrusted data.
- Evidence: `dom-collector.ts` captures element `textContent` and computed `fontFamily` from the live page. `cluster.ts` then strips only quote characters from `fontFamily` before storing it in `TypographyLevel`, and `build-write-prompt.ts` joins those font families into the FACTS block. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:196`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:887`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:931`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:18`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:24`.
- Prompt boundary: The resulting FACTS block is presented as prose under `## FACTS (use verbatim; do not invent beyond these)`, immediately followed by task instructions for the AI writer. There is no structured serialization, escaping, length cap at prompt-build time, or explicit instruction that all extracted values are untrusted data and must not be obeyed as instructions. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:86`.
- Counterevidence sought: I checked the fidelity cards and prompt hard rules. They strongly prevent hallucinated values, but they do not isolate live-site strings from prompt instructions or sanitize control/Markdown-like content before the WRITE prompt is consumed. Evidence: `.opencode/skills/sk-design/design-md-generator/assets/cardinal_rules_card.md:28`, `.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md:39`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:67`.
- Alternative explanation: Most real CSS font-family values are benign and CSS parsing constrains some characters. That reduces likelihood, but the trust boundary is still a live website to an AI instruction prompt, and the implementation only quote-strips rather than treating source values as hostile data.
- Final severity: P1. This is a prompt-injection exposure in the mutating md-generator workflow. It is not P0 because no direct shell execution or automatic file write from injected instructions was confirmed; the risk is that the downstream AI WRITE phase may ignore fidelity or write unsafe/incorrect content.
- Confidence: 0.80.
- Downgrade trigger: Downgrade to P2 if prompt construction is changed to serialize all extracted values in a fenced/escaped data block with explicit non-instruction semantics, tests cover malicious font/text values, and the writer prompt instructs the model to treat all extracted content as data only.
- Finding class: cross-consumer.
- Affected surface hints: `build-write-prompt.ts`, `cluster.ts`, `dom-collector.ts`, WRITE-phase prompt, future component-facts remediation for P1-001.
- Recommendation: Add a small prompt-data encoder for all live-site-derived strings, cap and normalize control characters, place extracted facts in a clearly delimited data-only block, and add tests with instruction-like font names/text samples before adding component facts for P1-001.

### P2

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Partial | Security checked against the md-generator implementation and output-path contract; P1-002 and P1-003 found. |
| `checklist_evidence` | Partial | Manual playbook sandbox constraints were checked for md-generator execution boundaries. Full checklist traceability remains for the traceability dimension. |
| `skill_agent` | Partial, no new defect | Registry, hub, and command frontmatters preserve read-only vs mutating mode split. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design; no dedicated design agent family is in this packet. |
| `feature_catalog_code` | Partial | Existing P1-001 does not itself create a current component-facts prompt-injection path because component facts are not yet emitted; the future fix must apply P1-003's data-isolation rule. |
| `playbook_capability` | Partial | Manual playbook sandbox policy was checked; full scenario-to-capability validation remains deferred to traceability/maintainability. |

## Search Depth

Scope class is complex. This iteration used graphless fallback because prior iterations recorded the code graph as stale. Search coverage used targeted greps for process execution, path writes, output construction, prompt interpolation, URL/selector handling, and mode tool surfaces; direct reads covered md-generator backend entrypoints (`extract.ts`, `guided-run.ts`, `crawl.ts`, `interaction-capture.ts`, `framework-detect.ts`, `build-write-prompt.ts`, `formatters-v3.ts`, `cluster.ts`, `dom-collector.ts`), registry/command frontmatters, and md-generator workflow/playbook references. High-risk targets deferred: complete report/preview/proof artifact-write audit beyond the shared output-directory guard and full manual-playbook scenario execution.

## SCOPE VIOLATIONS

- `deep-review-dashboard.md` changed outside the allowed write list after the iteration state append / verification path. I did not intentionally edit or patch that file, and I am not reverting it because it is outside this iteration's allowed write paths. The observed diff updates dashboard counters to iteration 3 and P1=3 from the newly appended review state.
- `review/prompts/iteration-4.md` appeared outside the allowed write list after the same state/reducer path. I did not intentionally create or edit that prompt file, and I am not deleting it because it is outside this iteration's allowed write paths.
- No reviewed target source/spec files were modified.

## Verdict

CONDITIONAL for iteration 3 security: two new P1 findings are open. No P0 findings were discovered.

## Next Dimension

Iteration 4 should review traceability: spec-to-code alignment, checklist evidence, feature-catalog-code coverage, command projection parity, and playbook capability mapping.

Review verdict: CONDITIONAL
