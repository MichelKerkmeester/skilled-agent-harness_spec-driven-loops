# Iteration 001 — Doctor contract gaps: speckit phrase quality and MCP unknown flags

## Focus
Resolve the two contract gaps: the `/doctor:speckit` `corpus_pollution` signal that makes `STATUS=OK` unreachable, and the missing `/doctor:mcp` unknown-flag error. Sources: command YAML and presentation contracts, the retrieval diagnostics and scoring code, the phrase-quality tests, the DOC-349/DOC-350 scenarios, and the other doctor routers.

## Actions Taken
- Read the retrieval doctor's staleness signals, Phase 1 activity list, Phase 2 recommendation rules, Phase 3 status enum and presentation status enum.
- Read `generation-diagnostics.json` `phraseQuality` buckets and traced how the generator produces them and how the lookup scores phrases.
- Read DOC-349 and DOC-350 and the phrase-quality tests in `trigger-index.vitest.ts`.
- Read `mcp.md`, `doctor-mcp-presentation.txt`, the MCP rows of `_routes.yaml`, and the unknown-argument contracts of the other seven doctor routers.
- Read the prior packet's implementation summary that recorded why DOC-349 expects a pollution finding today.

## Findings

### 1. `corpus_pollution` is a freshness class that no real corpus can clear

The doctor declares `corpus_pollution` at `severity: medium`, with a detection sentence that fires on any non-zero class in the committed `phraseQuality` bucket. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:135-137] Phase 1 requires reporting every non-zero aggregate class "whether or not any source document is stale", Phase 1 outputs it as `staleness_classes.corpus_pollution`, and `severity_max` is then computed over the map including it. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:191-205] Phase 2 maps a medium `severity_max` to a full-corpus regeneration or "a corpus fix first when the signal is pollution", with the rationale that "the phrases never rank". [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:212] The only rule that yields `status=OK` is "no staleness", so with a permanently non-zero pollution class the doctor can never report `OK`. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:214]

The committed diagnostics are always non-zero. `phraseQuality.phrases` holds 33,468 `ok` phrases and 251 flagged: 2 `editor-fallback`, 32 `folder-token-fallback`, 3 `generic-workflow-word`, 28 `numeric-only`, 19 `prose-sentence`, 166 `single-token` and 1 `stop-word-only`. That is 251 / 33,719 ≈ 0.74%, and the document bucket is also non-zero (51 `folder-token-fallback` owners, 78 `generic-workflow-word`, and so on). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json:32-51]

The "never rank" rationale is too broad. `scorePhrase` returns exact equality at 1 before its token floor, so a flagged single-token phrase still scores when the prompt is exactly that token; phrases with fewer than two tokens are otherwise rejected; and multi-token phrases score by containment (0.94 / 0.88) or token overlap when the query coverage is at least 0.8. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:129-151] The judgment is class-specific: `single-token` is documented as exact-equality-only, but `prose-sentence` (punctuation or over-budget tokens), `numeric-only`, `stop-word-only` and `generic-workflow-word` carry two or more tokens in general and are eligible for containment and overlap scoring. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:62-111] The lookup never consults `phraseQuality`: it builds candidates by substring token match, scores each phrase, keeps each document's best phrase, and sorts by score and class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:160-211] The generator counts the buckets as a diagnostic while constructing the phrase table and never removes an entry. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:253-296]

Decision. The right fix is to re-rank phrase quality as an advisory outside `staleness_signals`, `staleness_classes` and `severity_max`: keep reading `generation-diagnostics.json`, and report every non-zero class with its count and share in a dedicated diagnostic/quality-advisory block of the report, but let only freshness evidence drive the verdict. This is a mix in the small sense — the advisory stays and a selective, evidence-driven source cleanup remains available — but not the larger mix. Rationale against the alternatives: a raw share threshold is an arbitrary constant with no retrieval-precision evidence behind it, and 0.74% would have to become the magic number; a corpus clean-up cannot be a gate because the generator's authoring conventions are stricter than the ranking and will always flag some phrases (the bucket exists precisely to count them); and filtering flagged phrases in the generator would delete real trigger phrases such as exact single tokens and multi-token prose fragments that can rank, changing lookup behavior to make a report green. If escalation is wanted later, tie it to a measured probe — a flagged phrase that outranks a correct candidate in the committed prompt set — not to the share. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/prompt-set.json:1] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:31-39]

Note the decision history: the current DOC-349 expectation was a deliberate earlier fix to match the (broken) behavior — "DOC-349 now expects a `corpus_pollution` finding" and "a clean run can never report OK". [SOURCE: specs/system-speckit/049-doctor-audit-followups/014-doctor-playbook-spec-kit/implementation-summary.md:74] [SOURCE: specs/system-speckit/049-doctor-audit-followups/014-doctor-playbook-spec-kit/implementation-summary.md:84] Changing the behavior at the owning contract restores the original intent; the scenario must then be updated again, not left asserting the defect. An earlier reality-check also recorded that `folder-token-fallback` was unreachable at generation time; the current generator judges single-token owners with their own folder tokens, so that class now appears in the committed bucket. [SOURCE: specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/scratch/reality-check.md:84] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:272-282]

Secondary enum gap: the YAML's status enum is `OK|DEGRADED|STALE|MISSING`, while the presentation summary renders `Status: [OK|STALE|MISSING|ATTENTION|CANCELLED|FAIL]`. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:217] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:229] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:70] The fix should align the YAML with the presentation (`ATTENTION`), and the advisory-only path must yield `STATUS_OK` while the stale-index path keeps `STATUS_STALE`.

### 2. Scenario and test changes for the speckit fix

DOC-349 currently asserts the defect: the overview says the run "ends with that one medium finding rather than `status=OK`", the expected signals require a non-zero `corpus_pollution` with the medium pollution recommendation and "a status other than `STALE` or `MISSING`", and pass/fail requires `corpus_pollution` to be the only non-zero class. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:14] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:28] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:57] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:72-73] After the fix it should expect `STATUS_OK` on a fresh index with the phrase-quality counts and share visible as an advisory, every staleness class zero, and no pollution severity or regeneration recommendation.

DOC-350 keeps its meaning: `index_content_stale` alone at medium severity, `STATUS_STALE`, `recommended_command` = the generator. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:14] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:28] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:73] Add an assertion that the advisory counts do not add severity and do not alter the regeneration recommendation.

Tests. The generator's phrase-quality tests stay: they assert the per-class phrase/document counts and the folder-token ownership rule. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:562-575] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:577-592] Doctor-level contract coverage should be added for (a) fresh index + non-zero phrase-quality buckets → `STATUS_OK` with the advisory block and zero staleness classes, and (b) stale index + the same buckets → `STATUS_STALE` driven only by freshness, with the advisory visible and severity unchanged. No lookup test changes: ranking is untouched. The doctor-commands playbook folder is already exempted from the manifest-vocabulary invariance guard, so scenario text edits do not trip it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts:114-126]

### 3. `/doctor:mcp` has no unknown-flag error

The router parses the first positional as the sub-action, then parses remaining flags "using only the selected sub-action schema" (`install`: `--runtime <name>` with six runtime names; `debug`: `--fix`) and step 6 says only "Reject cross-sub-action flags before YAML load". [SOURCE: .skilled/commands/doctor/mcp.md:42-44] [SOURCE: .skilled/commands/doctor/mcp.md:60-63] The presentation defines the unknown-sub-action error and the two cross-sub-action flag errors, and no unknown-flag error at all. [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:22-27] [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:35-45] The route manifest confirms the per-sub-action allowed flags but is visibility metadata, not enforcement. [SOURCE: .skilled/commands/doctor/_routes.yaml:262-280]

So `/doctor:mcp install --server` falls through: `--server` belongs to neither schema, is not a cross-sub-action flag by definition, and there is no defined rejection. The missing error should be:

- For a recognized sub-action, classify a flag as unknown only when it is in neither sub-action's schema, and reject it before workflow YAML load.
- Render `STATUS=FAIL ERROR="unknown_flag"`, naming the flag, the selected sub-action, and that sub-action's valid flags (`install`: `--runtime <name>`; `debug`: `--fix`).
- Keep `cross_sub_action_flag_injection` for a flag that is known but belongs to the other sub-action (`install --fix`, `debug --runtime pi`), because that is a different diagnosis and already has dedicated wording.
- Update both `mcp.md` (step 6) and the presentation contract; keep `_routes.yaml` `allowed_flags` as the validity source of truth.

### 4. Every other doctor router already separates unknown from cross-* misuse

- `/doctor:git`: "Unknown or cross-target flags fail before YAML load" and flags are parsed against the route's `allowed_flags`. [SOURCE: .skilled/commands/doctor/git.md:43] [SOURCE: .skilled/commands/doctor/git.md:66]
- `/doctor:skill-advisor`: same unknown-or-cross-target rule and the same `allowed_flags` parse. [SOURCE: .skilled/commands/doctor/skill-advisor.md:44] [SOURCE: .skilled/commands/doctor/skill-advisor.md:69]
- `/doctor:speckit`: any other positional or flag renders `Unknown argument: [argument]` / `STATUS=FAIL ERROR="unknown_argument"`. [SOURCE: .skilled/commands/doctor/speckit.md:64] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:29-34]
- `/doctor:env`: rejects unknown flags, more than one selector or extra positionals with one invalid-arguments error. [SOURCE: .skilled/commands/doctor/env.md:30] [SOURCE: .skilled/commands/doctor/assets/doctor-env-presentation.txt:191-194]
- `/doctor:runtime-mirrors`: takes no arguments; any argument renders `unknown_argument`. [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:33] [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors-presentation.txt:5-11]
- `/doctor:deep-loop`: takes no target and `--scope` only; any other argument renders `unknown_argument`. [SOURCE: .skilled/commands/doctor/deep-loop.md:33] [SOURCE: .skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt:5-11]
- `/doctor:update`: rejects an unknown action or an action-invalid flag before YAML load, and its presentation has a dedicated "Cross-action or unknown flag" block listing accepted flags per action. [SOURCE: .skilled/commands/doctor/update.md:18] [SOURCE: .skilled/commands/doctor/update.md:44] [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:15-28]

Adding a dedicated MCP unknown-flag error therefore brings the MCP router in line with every sibling, and keeps the existing cross-sub-action wording intact. Manual coverage: add a new scenario `doctor-mcp-unknown-flag.md` (next free DOC number 379) that runs `install --server` and asserts the pre-YAML failure, the `unknown_flag` status, the named sub-action and the valid-flags hint, while DOC-378's existing cross-sub-action checks remain unchanged. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md:10-14]

## Questions Answered
- q1: What should `/doctor:speckit` do with non-zero phraseQuality diagnostics, and how should DOC-349/DOC-350 and tests change?
- q2: What unknown-flag error should `/doctor:mcp` add, and how do the other doctor command contracts handle unknown arguments today?

## Questions Remaining
- q3: How to build and reset a long-lived `/doctor:update` environment with real customized, conflict, removed and local-only units.
- q4: Which other doctor playbooks reuse it, and which exact scenario files plus new scenarios change.

## Next Focus
Iteration 2: inspect the release-update engine, the five update action YAMLs, the release tags and the sk-git worktree/sk-code packet sources to design the long-lived fixture and its reset recipe.

## Sources Consulted
- `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `doctor-speckit-presentation.txt`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json`, `prompt-set.json`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs`, `lib/phrase-judge.mjs`, `lookup-trigger-index.mjs`, `generate-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`, `workflow-invariance.vitest.ts`
- `doctor-speckit-retrieval-healthy.md` (DOC-349), `doctor-speckit-stale-index.md` (DOC-350)
- `.skilled/commands/doctor/mcp.md`, `assets/doctor-mcp-presentation.txt`, `_routes.yaml`
- Unknown-argument contracts of `git.md`, `skill-advisor.md`, `speckit.md`, `env.md`, `runtime-mirrors.md`, `deep-loop.md`, `update.md` and their presentations
- `specs/system-speckit/049-doctor-audit-followups/014-doctor-playbook-spec-kit/implementation-summary.md`
- `specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/scratch/reality-check.md`

## Assessment
Both contracts are unambiguous in source. The speckit recommendation is a contract fix at the owning layer; it deliberately leaves lookup ranking and generator diagnostics unchanged. The MCP design keeps the two error classes separate. No live command was executed and no repository file was changed.

## Reflection
The original severity treated authoring hygiene as index staleness because the generator flags more than the ranker refuses. Separating advisory data from the verdict is the minimal fix that restores a reachable `OK` without hiding hygiene evidence. The MCP gap is the mirror image: the router knows two flag classes but only names one.

## SCOPE VIOLATIONS
None. All reads were read-only and every write stayed inside this lineage directory.
