# Iteration 004

## Dimension

correctness -- PASS D closing correctness pass: sk-prompt goal enhancement, system-spec-kit integration boundary, final command-router sweep, export-loader spot-check.

## Files Reviewed

- `.opencode/plugins/mk-goal.js:215` prompt scoring helper.
- `.opencode/plugins/mk-goal.js:264` enhanced prompt builder.
- `.opencode/plugins/mk-goal.js:290` generated `promptEnhancement` metadata.
- `.opencode/plugins/mk-goal.js:304` prompt metadata normalization.
- `.opencode/plugins/mk-goal.js:620` normalized stored prompt fields.
- `.opencode/plugins/mk-goal.js:786` new goal prompt-field creation.
- `.opencode/plugins/mk-goal.js:846` set action prompt-field replacement.
- `.opencode/plugins/mk-goal.js:1350` active-goal injection renderer.
- `.opencode/plugins/mk-goal.js:1402` status output.
- `.opencode/plugins/mk-goal.js:1454` action executor.
- `.opencode/plugins/mk-goal.js:1513` plugin factory export.
- `.opencode/plugins/mk-goal.js:1625` tool registration.
- `.opencode/plugins/mk-goal.js:1676` test export attachment.
- `.opencode/commands/opencode_goal.md:43` unknown-action contract.
- `.opencode/commands/opencode_goal.md:59` bare text dispatch.
- `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:16` export-shape assertion.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/spec.md:139` metadata acceptance criterion.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/008-system-spec-kit-integration/spec.md:70` runtime-code scope boundary.

## Findings by Severity

### P0

None.

### P1

#### DR-004-P1-001 [P1] Prompt enhancement metadata omits the required RICCE marker

- File: `.opencode/plugins/mk-goal.js:290`
- Claim: Phase 007 requires stored prompt metadata to name DEPTH, CRAFT/TIDD-EC, RICCE, and CLEAR score >=40, but the plugin stores only `version`, `methodology`, `mode`, `framework`, `perspectives`, `clearScore`, `clearBreakdown`, `maxChars`, and `charCount`.
- Evidence: `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/spec.md:139` requires metadata naming DEPTH, CRAFT/TIDD-EC, RICCE and CLEAR; `.opencode/plugins/mk-goal.js:290-299` lists generated metadata fields without RICCE; `.opencode/plugins/mk-goal.js:304-320` normalizes the same metadata shape; exact search for `RICCE|ricce` in `.opencode/plugins/mk-goal.js` returned no matches.
- Counterevidence sought: Checked whether RICCE appears elsewhere in plugin metadata, generated prompt labels, or normalization fallback fields.
- Alternative explanation: The prompt structure itself is RICCE-like, but the acceptance criterion says stored metadata names RICCE.
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 if phase 007 is amended to require only RICCE-style prompt structure, not a stored metadata marker.
- Finding class: spec mismatch.
- Scope proof: The metadata producer and normalizer were reviewed; exact search found no RICCE marker in `.opencode/plugins/mk-goal.js`.
- Affected surface hints: `buildEnhancedGoalPrompt`, `normalizePromptEnhancement`, persisted goal records, status metadata.
- Recommendation: Add an explicit stored metadata field that names the RICCE concept, or amend the phase 007 docs if RICCE naming is no longer required.

### P2

#### DR-004-P2-001 [P2] Command contract says unknown verbs fail, but executable instructions treat every unknown non-empty query as a set objective

- File: `.opencode/commands/opencode_goal.md:43`
- Evidence: The command contract says unsupported verbs emit `STATUS=FAIL ERROR="unknown action: <verb>"` at `.opencode/commands/opencode_goal.md:43`, but the executable dispatch step routes any other non-empty `QUERY` to `mk_goal({ action: "set", objective: QUERY })` at `.opencode/commands/opencode_goal.md:59`. The plugin action executor defaults unrecognized internal actions to show at `.opencode/plugins/mk-goal.js:1455`, while the registered schema only permits `set`, `show`, `clear`, `complete`, and `pause` at `.opencode/plugins/mk-goal.js:1629`.
- Finding class: documentation contract drift.
- Scope proof: The command contract and dispatch instructions were compared against the plugin action matrix.
- Recommendation: Remove the unsupported-verbs failure claim or add a concrete unknown-verb branch before the bare-text set fallback.

## Traceability Checks

- `spec_code`: partial. Phase 007 implementation satisfies deterministic local prompt generation, 4000-character cap, raw-objective preservation, injection-from-`goalPrompt`, and status metadata, but misses the RICCE metadata naming acceptance criterion.
- `spec_code`: partial. Phase 008 states documentation/reference integration only and explicitly excludes runtime changes to `mk-goal.js`; exact plugin search found no system-spec-kit, generate-context, memory-save, or constitutional hooks in runtime code, so no runtime integration mismatch was found in scoped plugin code.
- `checklist_evidence`: not applicable. The reviewed phase folders are Level 1 packets and do not include `checklist.md`.
- `feature_catalog_code`: deferred to traceability/security passes. This iteration stayed within the supplied scope files and did not review phase 008's actual system-spec-kit catalog/playbook files.
- `playbook_capability`: deferred to traceability/security passes for the same reason.
- `export_loader_contract`: pass. The export-contract test asserts a default-only module with `default.__test`, and `mk-goal.js` exports a default function with `MkGoalPlugin.__test` attached.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL.

Correctness remains conditional: existing P1s remain active and this pass adds one P1 metadata/spec mismatch plus one P2 command-contract advisory. No P0 found.

## Next Dimension

Security: prompt-injection sanitization, secret redaction in evidence/logs, status/injection surfaces, and debug/JSONL logging paths.
