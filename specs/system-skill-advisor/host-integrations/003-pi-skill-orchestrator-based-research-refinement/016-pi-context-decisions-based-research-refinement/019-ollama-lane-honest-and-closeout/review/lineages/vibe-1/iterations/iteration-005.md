# Review Iteration 005

## Dispatcher

- Mode: review
- Target agent: deep-review
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Session: fanout-vibe-1-1795172940208-84a42n, generation 1, lineageMode new
- Artifact directory: `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/review/lineages/vibe-1`
- Dimension this iteration: maintainability
- Operator review focus: the five test and routing follow-up commits `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d` and `0390556ee2b`. This iteration addressed that focus by asking, for each fix, whether it leaves a second copy of the value it corrected behind, and whether the test that guards it derives the value or restates it.
- Frontier node: none bound for this dimension; the two bound nodes F-1-001 and F-1-004 were worked in iterations 1, 2 and 4.

## Files Reviewed

- `.skilled/skills/sk-doc/hub-router.json:245-262`
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md:28`
- `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md:23,47,107`
- `.skilled/skills/sk-doc/ROUTER.md:126-129`
- `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:1-30,89-120`
- `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py:7-60,183-230`
- `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py:16-45,178-290`
- `.skilled/changelog/skilled/v4.1.0.0.md:226-229`
- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:1-20,70-78`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` (via `c74042fd559`)
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/review/lineages/vibe-1/steer.md` (absent; no lead ruling to apply)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hub-vocabulary fix removed the phrase from the two checked surfaces and left two copies in the mode's own router reference** -- `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md:47` -- `571575632a4` dropped `"security policy"` from the `readme` intent in `hub-router.json:254` and from the `Keyword triggers:` line in `sk-create-readme/SKILL.md:28`, and re-minted both compiled manifests. `sk-create-readme/ROUTER.md` still carries the phrase twice: in the prose line "`readme` fires on ... `contributing guide`, `security policy`, `sync.md` ..." at line 47, and in the embedded JSON block `"readme": {"weight": 4, "keywords": [..., "contributing guide", "security policy", "sync.md", ...]}` at line 107. No check compares that list with `hub-router.json`: `test_routing_shape.py` validates only that a sibling `ROUTER.md` exists, is linked from `SKILL.md`, and holds a `## MACHINE ROUTER` section, so the duplicate drifts silently.
   Finding class: duplicated-source-of-truth
   Scope proof: the finding is about the completeness of `571575632a4`, one of the five follow-up commits named in the review focus; the two changed surfaces are in the declared review target, and `ROUTER.md` is cited as the surviving duplicate the change left behind.
   Affected surface hints: `sk-create-readme/ROUTER.md` lines 47 and 107, `hub-router.json` `readme` intent, `sk-create-readme/SKILL.md` keyword line, `scripts/tests/test_routing_shape.py`.
   Case: an editor adds a README trigger phrase and follows `ROUTER.md` as the mode's routing reference, restoring `security policy` there; the hub vocabulary check stays green because it reads `hub-router.json` and `SKILL.md`, and the two surfaces disagree from then on.

2. **The stress diagnostics test restates the semantic lane's live weight instead of deriving it, and the value it replaced was the lane's shadow weight** -- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:75` -- The test asserts `expect(data.laneWeights).toEqual(expect.objectContaining({ ..., semantic_shadow: 0 }))` against a hand-written literal. `lane-registry.ts:13` declares `{ id: 'semantic_shadow', defaultWeight: 0, defaultShadowWeight: 0.05, live: true }`, so the registry carries two weights for the lane and the literal the test used to hold, `0.05`, was the shadow weight rather than the live one. The test imports `handleAdvisorStatus`, `readAdvisorStatus` and the schemas but not the registry, so it cannot derive either value. The commit message for `86038dfba80` records the consequence: the stress workflow failed on every run since the live weight moved to 0.
   Finding class: duplicated-source-of-truth
   Scope proof: `86038dfba80` is one of the five follow-up commits named in the review focus, and the changed line is the one it edited.
   Affected surface hints: `stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts` line 75, `lib/scorer/lane-registry.ts` `defaultWeight` and `defaultShadowWeight`, `.github/workflows/skill-advisor-stress.yml`.
   Case: the lane's live weight is raised to 0.05 after a future ablation passes the bar; the registry changes, the stress test's literal does not, and the stress workflow goes red on every run again, masking a real stress regression behind a known-failing assertion.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | pass | hard | `check_changelog_shape.py:45`, `test_check_changelog_shape.py:193-196` | The 22-word ceiling `5c91b2f3f5d` split the sentence against is declared once at `SENTENCE_MAX_WORDS = 22` and covered by a synthetic test that fails a 23-word sentence and passes a 22-word one, so the ceiling is checked independently of the model entry. |
| `feature_catalog_code` | notApplicable | hard | none | This iteration reviewed routing and test surfaces, not a feature-catalog page. |
| `checklist_evidence` | notApplicable | hard | none | The review target is a file list, not a spec folder, so there is no `checklist.md`. |
| `skill_agent` | pass | overlay | `sk-create-readme/SKILL.md:28`, `hub-router.json:254` | The mode's `SKILL.md` keyword line and the hub router now agree on the `readme` intent; the disagreement that remains is in `ROUTER.md`, which no check reads. |
| `playbook_capability` | notApplicable | overlay | none | No playbook scenario covers the routing vocabulary or the stress diagnostics assertion. |

## Integration Evidence

- `.skilled/skills/sk-doc/hub-router.json` -- the `readme` intent keyword list, changed by `571575632a4`; read at HEAD to confirm `security.md` still routes while `security policy` is gone.
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md` -- the `Keyword triggers:` line, changed by the same commit; now matches the router.
- `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md` -- the mode's own routing reference, not changed by the commit; carries the removed phrase twice.
- `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py` -- read to establish that no check compares `ROUTER.md`'s keyword list with `hub-router.json`.
- `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py` and `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` -- read to establish that the word ceiling has synthetic coverage and that `MODEL_ENTRY` is a supplementary assertion.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` -- the registry the stress test's literal duplicates.
- `.github/workflows/skill-advisor-stress.yml` -- the workflow the stress test runs under, named in the commit message as red on every run.

## Edge Cases

- **The changelog fix edits the artifact the test reads.** `test_check_changelog_shape.py:21` points `MODEL_ENTRY` at the live `.skilled/changelog/skilled/v4.1.0.0.md`, so `5c91b2f3f5d` fixed a test failure by editing the file the test reads. That is circular on its face, but the ceiling itself is covered by `test_a_sentence_fails_one_word_past_22` and `test_the_average_sentence_fails_past_10_words` against synthetic fixtures, so the model-entry assertion is supplementary rather than the only coverage. Recorded, not raised.
- **`c74042fd559` narrows a fixture rather than a behavior.** The Vibe document test named a local command whose document is gitignored and now names `/doctor:setup`, which every checkout has. The assertion still checks that a tracked command's document is found, so the behavior is unchanged and the fixture is now portable. Recorded, not raised.
- **`0390556ee2b` was adjudicated in iteration 4.** Both halves were traced to the source they assert against and both still check the behavior; the residual weakness is that the OpenCode assertion's `[\s\S]*` span is unbounded. Not re-raised here.
- **The `ROUTER.md` duplicate is outside the declared target.** `sk-create-readme/ROUTER.md` is not in the review target list and was not changed by any commit under review. It is cited as the surviving duplicate that makes `571575632a4` incomplete, which is a finding about the change rather than a new review of that file.

## Confirmed-Clean Surfaces

- `hub-router.json`'s `readme` intent still carries `security.md`, so a request naming the file still routes to the README mode after the bare phrase was dropped.
- Both compiled `activation/sk-doc/manifest.json` copies were re-minted to the same `effectivePolicyHash` (`73c7a1c0…`) at generation 5, so the two copies agree.
- `check_changelog_shape.py` declares the ceiling once at `SENTENCE_MAX_WORDS = 22` and the mean at `SENTENCE_MEAN_WORDS`; the test reads both constants rather than restating them (`test_check_changelog_shape.py:183-184`).
- The split sentence in `v4.1.0.0.md:229` keeps every number the original carried (196 rows, 156 with the lane, 161 without, 7 flips, no new none-gold fire, default stays 0).
- `mcp-diagnostics-stress.vitest.ts` still asserts the other four lane weights and the email-redaction property, so the change narrowed nothing but the one literal.

## Ruled Out

- **The changelog shape test has no independent coverage of the word ceiling.** `test_a_sentence_fails_one_word_past_22` fails a 23-word sentence and passes a 22-word one against a synthetic fixture, and `test_the_average_sentence_fails_past_10_words` covers the mean.
- **`571575632a4` left the two compiled manifests out of step.** Both copies carry the same `effectivePolicyHash` and generation.
- **`571575632a4` broke `security.md` routing.** The `security.md` keyword survives in `hub-router.json`.
- **`c74042fd559` weakened the Vibe document assertion.** The case still asserts that a tracked command's document is found; only the fixture changed.
- **`86038dfba80` changed a shipped default.** It changed a test literal; the registry default at `lane-registry.ts:13` is unchanged.

## Next Focus

- Dimension: correctness (second pass, cross-reference)
- Focus area: the two bound frontier nodes' remaining uncovered surfaces, and a cross-reference pass over the carried P1 findings to confirm each still reproduces at HEAD.
- Reason: all four canonical dimensions have one pass; the carried P1s were raised in iterations 1 and 2 and have not been re-read since the follow-up commits landed.
- Rotation status: correctness, security, traceability and maintainability each have one pass; a cross-reference pass remains.
- Blocked/productive carry-forward: productive on duplicated-source-of-truth comparison; blocked on executing the repository's test tooling from inside the lineage write surface.
- Required evidence: `skill-graph-db.ts:1437-1445`, `advisor-status.ts:242`, `semantic-shadow.ts:392`, `watcher.ts:494`, and the two tests that codify the current behavior.
- Recovery note: none.

Review verdict: CONDITIONAL
