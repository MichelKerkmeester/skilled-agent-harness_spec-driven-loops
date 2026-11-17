# Review Iteration 002

## Dispatcher

- Run: `fanout-scorer-attach-4-1794669272137-9v23rz` (lineage `scorer-attach-4`, pass four, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: security
- Review focus addressed: the operator focus asks whether a question or a bare mention of a command can still attach or start a mutating command. This iteration takes the question/mention half against the scorer path, then checks holdout hygiene across the changed files and the changed test that reads the corpus. The transcript scorer's load/followed/offer arithmetic and the six live runtime surfaces are outside this lineage's scope and are named below. Budget profile: `verify` (11-13 calls), used 11.
- Prior state: iteration 1 recorded three P1 refusal/correction guard gaps; they remain active.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:356-432` (ask leads, bare lead, mention reader)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1140-1231,1588-1618` (handoff, mention withholding, no-edit gate, call order)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:311-364,429-488` (`publicRecommendation` command copy, compiled-route attach)
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:1-160` (corpus read and new weak-cue cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:135-230` (ask/mention tables)
- Probe: `lineage/probes/probe-scorer.vitest.ts` (doctor question and statement rows)
- Executed: `vitest run --cache=false` on the six changed test files → 191 passed, exit 0 (reused from iteration 1; no source changed between runs).

## Findings - New

### P0 Findings

None.

### P1 Findings

None new this iteration. The three active P1 findings from iteration 1 remain active and keep this iteration's verdict at CONDITIONAL.

### P2 Findings

1. **A question or statement that names a doctor command with the noun `command` still passes that command row** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1209` -- `withholdMentionedCommands` withholds a passing command row only when `commandOnlyMentioned` recognizes the naming. The bare-ask lead is `(?:is|does|can|will|would) ` (`command-attach.ts:389`) and the ask leads require the name to follow the lead directly, so `Is the /doctor:update command safe?` has `the ... command` between the ask word and the name. The same is true of the statement `The /doctor:update command is documented in the README`. In both probes the `command-doctor-update` row passed, and `publicRecommendation` copies `command: '/doctor:update'` and `policy: 'ask'` from `commandRowFor` (`handlers/advisor-recommend.ts:358-362`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1209]
   Finding class: mention_reader_gap
   Scope proof: the changed mention reader and the changed scorer gate are in the declared scope; `publicRecommendation` is the handler's only command-copy path, and the probe uses the real projection and scorer.
   Affected surface hints: doctor command rows, question/statement phrasings with the noun `command`, `/doctor:update` ask policy, hook brief third row.
   Case: `scoreAdvisorPrompt('Is the /doctor:update command safe?')` passes `command-doctor-update` as the third row; after `publicRecommendation` it carries `/doctor:update` with policy `ask`. `scoreAdvisorPrompt('The /doctor:update command is documented in the README')` passes the same row. The command is `ask`, so it asks before it writes; that keeps this P2 rather than P1.
   Claim adjudication:
   ```json
   {"type":"claim","claim":"A question or statement that puts the noun 'command' between the ask word and the command name is not recognized by the mention reader, so the command row stays passing.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:389",".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1209",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:358"],"counterevidenceSought":"Probed the direct form 'what does /doctor:update do?' and the row was withheld, so the gap is the inserted noun, not the doctor row itself. Read the ask lead list: it allows 'the command' only after 'what does/what is/...', not after the bare ask words.","alternativeExplanation":"The question is a yes/no safety question, not a request; a command offer would still ask before writing, so the impact is an unfit offer rather than a silent write.","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"Raise to P1 if a mutating command with policy run reaches this phrasing, or if the hooks render the third row in every runtime."}
   ```

## Traceability Checks

- `spec_code` -- partial. The phase 020 purpose says a command the prompt only asks about is not offered; the direct `what does` form passes, but the `is the X command` form does not. The three P1s from iteration 1 remain the larger spec mismatch.
- `checklist_evidence` -- pending. No checklist claim is in this iteration's focus; deferred to iteration 3.
- `feature_catalog_code` -- pending; iteration 3.
- `agent_cross_runtime` -- partial. The scorer and handler have no runtime branch. The third-row rendering question is a renderer/plugin concern owned by `render-hooks-plugin-4`; this lineage records the scorer row, not the rendered brief.
- `skill_agent` -- notApplicable; no agent-definition change in this area.
- `playbook_capability` -- notApplicable.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1611` calls `withholdMentionedCommands` after `applyDoctorHelperHandoff` and before the passing set is computed, so a command row that survives this gate reaches both the CLI and the hooks.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:318` looks up `commandRowFor(recommendation.skill)`; `:358-362` copies `command`, `policy` and `ownerSkillId` onto the public row. The doctor row therefore carries `/doctor:update` rather than only a skill id.
- Holdout hygiene: the changed source files contain no `command-prompts.jsonl` or `holdout-prompts.jsonl` read. The two changed tests that read the corpus (`advisor-recommend-compiled-route-option.vitest.ts:155-166` and `doctor-handoff-command.vitest.ts:125-137`) select a known tune id and assert `split === 'tune'` before using the prompt; neither prints a prompt. No tune, fix or report path reads a holdout row.
- Transcript scorer: `score-command-transcripts.mjs`, `command-offer.mjs` and `command-transcript-score.vitest.ts` are the `accuracy-runner-4` lineage's files and are not in this lineage's scope. The operator focus's Codex-body, rg/grep, heredoc, cd, partner-side, paired-arm and Wilson-range checks belong there; this iteration records the boundary instead of raising a cross-area finding.
- Runtime map: the handler's command copy is shared by every runtime; the renderer's child downgrade (read-only visibility) is `render-hooks-plugin-4`'s surface. No changed file in this lineage branches on claude, codex, opencode, pi, devin or dsh.

## Edge Cases

- **Policy limits the question case.** `/doctor:update` is `ask`, so even a surviving row asks before it writes. The finding is an unfit offer, not an unconfirmed write; a `run` policy on a mutating doctor command would raise the severity.
- **The row is third in the list.** The probe's passing rows are `system-skilled-doctor`, `mcp-code-mode`, `command-doctor-update`; the handler's default topK is 3, so the command is the last visible row. The hook brief's row count is renderer-owned; the scorer row exists either way.
- **The statement case may be a deliberate mention.** "The /doctor:update command is documented in the README" is a statement, not a request. The phase purpose names a command the prompt "only mentions" as an unfit offer, so it is recorded with the question case; a reviewer can split it if the statement class is judged out of scope.
- **The changed corpus-reading tests are tune-only by id.** Both assert `split === 'tune'`; no holdout row id is used, and no prompt text is printed.

## Confirmed-Clean Surfaces

- `fusion.ts:1216-1231` -- the no-edit gate withholds `add-only` and `mutates` command rows and keeps a `read-only` row; the changed test pins all three classes and passes.
- `fusion.ts:1200-1211` -- a command row named directly after `what does`/`explain`/`ran` is withheld; the doctor direct-question probe lost the row as intended.
- `command-attach.ts:472` -- the hub attach path withholds every command on a no-edit prompt, including a read-only one; this is stricter than the scorer gate but cannot offer a writing command.
- `advisor-recommend.ts:358-362` -- a command row with no `CommandRow` entry adds no `command` field; an inherited name such as `constructor` cannot resolve through `commandRowFor`'s own-key check (`command-attach.ts:193-195`).
- Holdout hygiene: no holdout prompt text was read or printed; corpus reads in changed tests are tune-id selected and split-asserted.

## Ruled Out

- **The doctor command row can be offered on a direct `what does` question.** Ruled out by the probe: `what does /doctor:update do?` passes only `system-skilled-doctor`; the command row is withheld.
- **A read-only command is withheld by the scorer on a no-edit request.** Ruled out: `withholdWritingCommandsOnNoEdit` returns the `command-doctor-env` row unchanged and the changed test asserts it.
- **Holdout rows are read by a changed source path.** Ruled out: no changed source file references either corpus file; the only corpus readers are tests that select tune ids and assert the split.
- **The question case can silently write.** Ruled out for this command: `commandRowFor('command-doctor-update')?.policy` is `ask` (generated row, `command-attach.ts:178`), so the command asks before it acts.

## Next Focus

- Dimension: traceability
- Focus area: the shared docs that describe the changed attach/handler/scorer behaviour -- `feature-catalog/cli-surface/advisor-recommend.md` and `feature-catalog/scorer-fusion/command-meaning-matching.md` -- plus the phase 020 requirement that fixes the weak-cue bar.
- Reason: iteration 1 found the code-level attach gaps; the docs and the phase requirement are the places where the packet's own claims can disagree with the changed code.
- Rotation status: correctness and security complete (CONDITIONAL), traceability next.
- Blocked/productive carry-forward: security was productive (one P2); no blocked approach.
- Required evidence: line-level comparison of each doc claim with the changed code, and the phase 020 `REQ-007` text against `DOCTOR_HELPER_WEAK_CUE_MIN_SCORE`.

Review verdict: CONDITIONAL
