# Iteration 1: Full-dimension pass over packet 069 and its verification claims

## Focus
- Dimensions: correctness (D1), security (D2), traceability (D3), maintainability (D4).
- Files reviewed: 24 (packet documents, both CLI rosters and SKILL.md anchors, the `.pi` config tree, the deep-loop executor config, the fan-out script, both unit suites that carry the pin assertions, the cli-pi playbook scenarios, plus four external reference files: the installed pi CLI argument parser, the AC-coverage validation rule, the validator registry, the spec-doc structure rule).
- Scope: the declared target spec folder and the implementation surfaces its `spec.md` §3 names, read against the working tree at `bce3ad789d` (uncommitted changes included).
- Review inputs: `scratch/review-claims-to-verify.md` (three explicitly unverified claims, each settled below), `handover.md` §2.4 traps, `acceptance-criteria.md` AC-001..AC-021, `tasks.md` Phase 1-4 and its verification checklist.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 24
- New findings: P0=0 P1=1 P2=6
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker
- None. No correctness failure, security vulnerability or spec contradiction was confirmed. The routing wiring itself is correct: the allowlist, default, provider map and effort pin agree between the script and its TypeScript source of record, and the retired bare literal is absent from every dispatch path.

### P1, Required
- **F001**: Retired id still named on a non-changelog surface (traceability) — `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:29` — Lines 29 and 46 declare "default is `deepseek-v4-flash-vision-exp`" as the PI-017 expectation. Ground truth: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:214` sets `PI_DEFAULT_MODEL = 'deepseek-v4.1-flash'`, and `:189` is the allowlist's `'deepseek-v4.1-flash'`. REQ-001 says no live surface names the deactivated id, and AC-001 (`acceptance-criteria.md:57`) records the sweep as a clean miss. The file is a present-tense testing contract, not a historical log, and its own command sequence reads the config that now contradicts it, so a tester re-running PI-017 records a false FAIL. This playbook directory was already in the packet's scope for a sibling file (`spec.md:80`).
  - Recommendation: update lines 29 and 46 to the live id, re-run the retired-id sweep over all non-changelog surfaces including playbooks, and correct AC-001's evidence cell with the real scope and result.

### P2, Suggestion
- **F002**: Recorded retired-id scan evidence is overstated (traceability) — `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:57` — AC-001 reads "Scan over `.opencode` and `.pi` returned no hit; the only surviving instance is the OpenRouter-prefixed literal", and `implementation-summary.md:138` repeats it. Two bare (unprefixed) hits survive at `supported-model-allowlist-smoke.md:29` and `:46`. Same root cause as F001, different remediation: the recorded evidence is wrong even where the shipped code is right.
  - Recommendation: restate the scan with its real scope and outcome once F001 is fixed; do not cite a sweep whose predicate excludes the file that fails it.
- **F003**: Handover trap "pi has no `--mode text`" is false (traceability) — `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:125` — The row is marked load-bearing and repeated at `:153` and `:171`; the installed binary accepts the flag (`dist/cli/args.js:42`) and documents it as the default (`dist/cli/args.js:274`). The repository's own working commands use it (`.pi/custom-providers.md:127`, `:128`, `:138`), so the trap marks correct commands as defects.
  - Recommendation: restate the trap truthfully (`-p`/`--print` is the non-interactive flag; `--mode` defaults to `text`) and delete the two comments that deny the flag.
- **F004**: Validator warning misattributed to AC_COVERAGE (traceability) — `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:211` — §4 and §5 both name `AC_COVERAGE` as the packet's single warning. That rule is declared info-severity (`validator-registry.json`) and every advisory path leaves `RULE_STATUS="pass"` (`check-ac-coverage.sh:464-495`); `mapShellRuleStatus()` maps even a `fail` from an info-severity rule to `info` (`orchestrator.ts:275-286`), so it cannot surface as a warning. Confidence note: this lineage did not execute `validate.sh`, so the classification of the current warning is inferred from the rule sources (`FRONTMATTER_MEMORY_BLOCK` at `orchestrator.ts:942` / `spec-doc-structure.ts:685-880` is the reachable warner, with five warning-severity length diagnostics on this packet); the refutation of the AC_COVERAGE attribution is not inferred.
  - Recommendation: copy the real `Summary:` line and warning rule id from the next validator run into §4/§5.
- **F005**: AC-coverage counts wrong in the handover (traceability) — `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:267` — The note claims 16 of 21 flagged with 6 from the first pass. The rule's own analyzer returns `rows=21 covered=6 malformed=15` with `AC-001, AC-006 … AC-011` (seven first-pass rows) plus all eight second-pass rows (`AC-014` … `AC-021`) flagged. The conclusion "this predates this pass" is therefore backwards for the majority of the deficit.
  - Recommendation: correct the counts and the conclusion; the AC-evidence work belongs to this packet's remediation list.
- **F006**: Pi default-provider claim contradicts settings.json (maintainability) — `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:86` — The roster ("pi's default here is `defaultProvider: cline-pass`") and `.pi/custom-providers.md:27`, `:35`, `:67`, `:152` all describe a Cline default; `.pi/settings.json:4-5` sets `"defaultProvider": "llmgateway"` with `"defaultModel": "z-ai/glm-5.3-flash"`. The roster sentence sits in a paragraph this packet rewrote and the claim was carried through untouched. Related, not asserted: `z-ai/glm-5.3-flash` is not a declared id in the `llmgateway` block (`.pi/models.json:54` declares `glm-5.3-flash`) and pi falls through silently when the configured pair does not resolve (`dist/core/model-resolver.js:502-528`), which needs a `pi` run to settle and is carried as a deferred check.
  - Recommendation: state the real default in both documents, then run the deferred resolution check.
- **F007**: Duplicated closure paragraph in the acceptance criteria (maintainability) — `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:135` — The paragraph beginning "One thing is left open rather than closed" appears at `:126-129` and again at `:135` in the same section, with no cross-reference and no distinct content, so one open item reads as two.
  - Recommendation: delete one copy in the same edit that corrects the F002 evidence cell.

## Claim Adjudication Packets

```json
[
  {
    "findingId": "F001",
    "claim": "A non-changelog, present-tense testing contract in the cli-pi playbook still declares the retired gateway id as the expected `PI_DEFAULT_MODEL`, so REQ-001's clean-sweep claim is false as recorded.",
    "evidenceRefs": [
      ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:29",
      ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:46",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:214",
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:57"
    ],
    "counterevidenceSought": "Grepped `.opencode` and `.pi` for the retired literal and classified every hit: the runtime allowlist/provider map, the executor config, the unit tests and `.pi/settings.json` hits are all the OpenRouter-prefixed `deepseek/deepseek-v4-flash-vision-exp` form (a different route the packet deliberately excludes), the changelog hits are historical by construction, and the pin-regex test asserts the regex, not a route. Only the two playbook lines are bare, non-changelog, present-tense id claims.",
    "alternativeExplanation": "The playbook's Evidence cell is clearly a past capture, so a reader could argue the whole row is a historical record and the expectation is descriptive of that run. Rejected: the Expected Signals cell states the default in the present tense, the row carries a live PASS/FAIL criterion, and its own command sequence reads the config file that now contradicts it — so re-running the scenario as written produces a FAIL against correct code.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "If the playbook rows are updated to the live id (or the file is retired as a historical archive with an explicit staleness banner), downgrade to P2 documentation residue.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: an unmet P0-priority requirement (REQ-001) on a non-changelog surface, with the packet's closure evidence overstated as a consequence" }
    ]
  },
  {
    "findingId": "F002",
    "claim": "AC-001 and `implementation-summary.md` record a retired-id scan with a scope and result that the repository does not support.",
    "evidenceRefs": [
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:57",
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/implementation-summary.md:138",
      ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:29"
    ],
    "counterevidenceSought": "Re-read the AC-001 row for a narrower predicate ('outside changelogs') and re-ran the scan twice, once for the bare literal and once for any literal, to check whether the surviving hits could be read as prefixed. Both playbook hits are bare; the prefixed-only reading cannot cover them. Also checked whether the playbook file post-dates the scan (it does not).",
    "alternativeExplanation": "The scan may have been run with a path filter that excluded `manual-testing-playbook/`, which would make the row an honest description of a narrower sweep. Rejected as a defence of the row as written: the row says 'Scan over `.opencode` and `.pi`', and a reader cannot reproduce a hit-free result with that scope.",
    "finalSeverity": "P2",
    "confidence": 0.85,
    "downgradeTrigger": "If the evidence cell is rewritten with the real scope and result, or the sweep is re-run and passes, this becomes resolved rather than a finding.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: same root cause as F001, different remediation" }
    ]
  },
  {
    "findingId": "F003",
    "claim": "The handover's load-bearing trap 'pi has no `--mode text`' is false; the installed pi accepts `text` and documents it as the default output mode.",
    "evidenceRefs": [
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:125",
      "/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/args.js:42",
      "/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/args.js:274",
      ".pi/custom-providers.md:127"
    ],
    "counterevidenceSought": "Read the whole flag parser rather than the cited line, to check whether `text` is accepted but ignored (which would make the trap half right): the parser stores it in `result.mode` like the other two values, and the help text names it the default. Also checked whether a sibling `--mode text` usage in the repository is marked broken anywhere — no such note exists outside this trap row.",
    "alternativeExplanation": "The trap may have been written against an older pi build in which `--mode text` was rejected. Rejected as a defence of the current row: the row is present-tense, load-bearing, and the shipped binary in this environment accepts the flag today.",
    "finalSeverity": "P2",
    "confidence": 0.95,
    "downgradeTrigger": "If a future pi release removes `text` from the accepted set, the trap becomes true again — re-verify against `--mode` in the installed parser before re-instating it.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: documentation accuracy, no runtime effect" }
    ]
  },
  {
    "findingId": "F004",
    "claim": "The handover names `AC_COVERAGE` as the packet's one validator warning, but that rule cannot report a warning status; the packet's reachable warning producer is `FRONTMATTER_MEMORY_BLOCK`.",
    "evidenceRefs": [
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:211",
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:267",
      ".opencode/skills/system-spec-kit/runtime/lib/validator-registry.json",
      ".opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:275",
      ".opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:464"
    ],
    "counterevidenceSought": "Checked both paths by which the rule could warn: an explicit `RULE_STATUS=\"warn\"` (the script contains no such assignment — its only non-default assignments are the two enforced `fail` branches) and the severity mapping for a `fail` from an `info`-severity registry rule (`mapShellRuleStatus` returns `info`). Read the environment files for an enforcement toggle that could change this; none is set in the repository.",
    "alternativeExplanation": "The handover's author may have read the validator output row whose message begins 'AC_COVERAGE advisory' and concluded it was the warning, when the warning row was a different rule. Accepted as the likely cause, which is exactly why the note is misleading rather than fabricated.",
    "finalSeverity": "P2",
    "confidence": 0.8,
    "downgradeTrigger": "Re-run `validate.sh --strict` and paste the rule id from the warning line; if the warning is in fact `AC_COVERAGE`, this finding is disproved and should be closed as such.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: traceability accuracy in the continuity document" }
    ]
  },
  {
    "findingId": "F005",
    "claim": "The handover's AC-coverage counts are wrong: the rule's own analyzer reports 15 flagged of 21 with 7 first-pass rows, not 16 of 21 with 6.",
    "evidenceRefs": [
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:267",
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:55",
      ".opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:275"
    ],
    "counterevidenceSought": "Ran the rule's own `_ac_analyze_canonical` parser against the packet's acceptance criteria rather than counting rows by eye, then checked whether the superseded AC-013 or the manual-infeasible branch could account for a 16th flagged row. It does not: the parser returns `rows=21 covered=6 malformed=15`, and the flagged id list contains exactly seven first-pass ids and all eight second-pass ids.",
    "alternativeExplanation": "The author may have counted the row that carries a `Superseded` status and no citation as flagged too, reaching 16, and attributed the second-pass rows to the first pass by file date. Rejected: the parser's malformed count is the measure the rule uses, and the id split is unambiguous.",
    "finalSeverity": "P2",
    "confidence": 0.9,
    "downgradeTrigger": "If the analyzer's semantics change (for example, waived/superseded rows start counting as covered), re-derive the numbers and restate the note.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: incorrect counts and an inverted conclusion in a continuity note" }
    ]
  },
  {
    "findingId": "F006",
    "claim": "Two packet-adjacent documents state that pi's `defaultProvider` is `cline-pass`, while the config file they cite sets `llmgateway`.",
    "evidenceRefs": [
      ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:86",
      ".pi/custom-providers.md:27",
      ".pi/custom-providers.md:35",
      ".pi/settings.json:4"
    ],
    "counterevidenceSought": "Looked for a second settings scope that could make the claim true (a user-level settings file, or a project override): `~/.pi/agent/settings.json` is a symlink to this same `.pi/settings.json`, so there is only one source. Also checked whether the packet's own `enabledModels` edit could have moved the default — the edit touched two entries and left `defaultProvider` alone.",
    "alternativeExplanation": "The default may have been `cline-pass` when the sentence was first written and changed later by an operator; that would make the claim historical residue rather than a new error. Accepted as the likely cause, and it does not change the remediation: the claim is false today and sits in a paragraph this packet rewrote.",
    "finalSeverity": "P2",
    "confidence": 0.85,
    "downgradeTrigger": "If `.pi/settings.json` is changed so `defaultProvider` is `cline-pass` again, this finding is resolved by config rather than by doc edit.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: documentation contradicts the config it cites" }
    ]
  },
  {
    "findingId": "F007",
    "claim": "The acceptance criteria's closure section repeats one open-item paragraph verbatim, so the same unresolved point reads as two.",
    "evidenceRefs": [
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:126-129",
      "specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:135"
    ],
    "counterevidenceSought": "Compared the two passages word by word and checked whether the second is a deliberate restatement in a different context (a closing summary, a list). It is neither: both sit in the same closure section as standalone paragraphs, with the AC-008 lesson between them and no forward or backward reference.",
    "alternativeExplanation": "A merge or re-application of edits could have inserted the paragraph twice without a human reading the section end to end — consistent with the packet's own recorded re-apply incident. Accepted; the fix is a deletion either way.",
    "finalSeverity": "P2",
    "confidence": 0.95,
    "downgradeTrigger": "Not applicable; a duplicated paragraph is resolved by deleting one copy, and there is no state in which it becomes correct.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: documentation hygiene" }
    ]
  }
]
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `executor-config.ts:189,214,243`; `fanout-run.cjs:1984,2080,2099,2285`; `cli-opencode/SKILL.md:174,176,194,240`; `acceptance-criteria.md:57` | REQ-002, REQ-003, REQ-006, REQ-007, REQ-009 resolve to shipped code and recorded probes; REQ-001 does not — one non-changelog surface still names the retired id (F001), and the recorded scan overstates its scope (F002) |
| checklist_evidence | partial | hard | `tasks.md:125-155`; `tasks.md:208-214`; `implementation-summary.md:129-146` | Every checklist item is marked `[x]` except `CHK-FIX-006`, which is declared unrun with a reason. Per-item `file:line` evidence is absent; the packet-level runs are recorded in `implementation-summary.md`. The AC-coverage analyzer independently reports 6 of 21 criteria with citations |
| skill_agent | notApplicable | advisory | `config.reviewTargetType = spec-folder` | Target is a spec folder; no SKILL.md/agent pair is in scope |
| agent_cross_runtime | notApplicable | advisory | — | No agent definitions in scope |
| feature_catalog_code | notApplicable | advisory | — | No catalog claim depends on this change |
| playbook_capability | partial | advisory | `supported-model-allowlist-smoke.md:29,46`; `cline-provider-id-format-dispatch.md` | The cli-pi playbook's id-format control was updated correctly; the allowlist-smoke scenario's expected default was not, and now contradicts shipped behavior (F001) |

## Assessment
- New findings ratio: 1.0. Every active finding was introduced by this iteration; this lineage has no prior state, and the ratio is computed as severity-weighted new over severity-weighted total — `(1 × 5.0 + 6 × 1.0) / (1 × 5.0 + 6 × 1.0)`.
- Dimensions addressed: correctness, security, traceability, maintainability (all four, single pass; `maxIterations=1` by configuration, so coverage stabilization cannot be tested across passes and the convergence vote is telemetry only).
- Novelty justification: the seven findings are not restatements of the packet's own known limitations (§6 of `implementation-summary.md` records the three-way pin duplication, the cline-pass listing-only status, the cost change and the stale-catalog trap — none of those is re-reported here). F001 and F002 are new coverage gaps discovered by scanning rather than trusting the packet's scan; F003, F004 and F005 are new refutations of three continuity claims; F006 is a contradiction between two edited documents and the config they cite; F007 is a duplication introduced by editing.
- Security posture: no finding. The changed literals carry no credential (`grep` over the whole diff finds no key material; the `.pi` blocks remain `${CLINE_API_KEY}` / `${LLMGATEWAY_API_KEY}` references), the allowlist still fails closed on an off-roster id (`executor-config.ts:196-198`), and no trust boundary moves — the bare DeepSeek literal already mapped to `llmgateway` before this packet, so the provider routing is unchanged.

## Ruled Out
- The OpenRouter occurrences as REQ-001 violations: `fanout-run.cjs:2091,2295`, `executor-config.ts:198,201`, `fanout-run.vitest.ts:1588` and `.pi/settings.json:18` all carry the provider-prefixed form, which resolves through a provider the packet excludes by decision (`spec.md:65`). Evidence: the one-literal-one-provider rule in `spec.md` §5 edge cases.
- The pin-pattern triplication as a new defect: `executor-config.ts:243` and `fanout-run.cjs:1984` are byte-identical, and the third copy inside `executor-config.vitest.ts:861` asserts the live literal. Evidence: both files read at those lines; the residual risk is already recorded in `implementation-summary.md` §6 item 4.
- Missing `checklist.md` as a Level 2 defect: Level 2 requires `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`; `tasks.md` carries the verification checklist and its `<!-- ANCHOR:protocol -->` marker, which is the traceability source the AC rule itself looks for. Evidence: `folder-structure.md:111-125`, `check-ac-coverage.sh:183-191`.
- The `cline-pass` route as over-claimed: both rosters, the Pi setup doc and the changelogs say listing-only, name the `429` blocker and name the V4-Flash fallback. Evidence: `providers-and-models.md:96`, `.pi/custom-providers.md:131`, `cli-pi/changelog/v1.5.3.0.md:14-21`, `cli-opencode/changelog/v1.4.6.0.md:15-23`.
- Version-anchor drift as a defect: `cli-pi/SKILL.md:5` is `1.5.3.0` against newest changelog `v1.5.3.0`, and `cli-opencode/SKILL.md:5` is `1.4.6.0` against `v1.4.6.0`, so the frontmatter gate's `max(SKILL.md, changelog)` invariant holds. Evidence: both files read.

## Dead Ends
- Static verification of the live route claims (context, output ceiling, price, ladder, catalog size, `410`/`400`/`429` statuses): these are probe results by construction and cannot be re-derived from the tree. Recorded as unverified-by-this-lineage, not as defects.
- Executing `pi` to settle the default-model resolution question (`llmgateway` plus `z-ai/glm-5.3-flash`): a pi dispatch is not available to this lineage, so the question stays open and is carried in Deferred Items rather than reported as a finding.
- Re-running the two deep-loop vitest suites and `validate.sh`: outside this lineage's write surface. Their reported results are treated as recorded evidence, not confirmed evidence, and the traceability rows above say so.

## Recommended Next Focus
1. Fix F001, then re-run the retired-id sweep with a predicate that includes playbooks and non-changelog documentation, and correct AC-001/F002 evidence from the real run.
2. Correct the handover's verification statements (F003, F004, F005) before any session resumes from that file, since all three are read as fact by the next reader.
3. Resolve F006 by stating the real `defaultProvider`, and run the deferred `pi` default-resolution check to decide whether the `llmgateway` + `z-ai/glm-5.3-flash` pair resolves or silently falls through.
4. Delete the duplicated paragraph (F007) while editing the closure section for F002.

Review verdict: CONDITIONAL
