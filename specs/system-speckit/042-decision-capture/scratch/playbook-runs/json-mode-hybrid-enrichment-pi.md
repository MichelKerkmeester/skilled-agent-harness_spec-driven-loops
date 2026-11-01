# json-mode-hybrid-enrichment on Pi
- CLI: Pi
- Model: openai/gpt-6-luna, --thinking xhigh, --fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/json-mode-hybrid-enrichment.md
- Exact prompt: `Validate JSON mode structured summary hardening against toolCalls and report cited pass/fail evidence.`
- Verdict: **FAIL**
## Result
The scratch setup and save commands ran, but the required structured fields and counts were not observable in a newly rendered Markdown file: the default save logged `Legacy memory artifact write skipped.` and `POST-SAVE QUALITY REVIEW -- SKIPPED`, with `savedFilePath is a directory`; repeated field checks read the unchanged copied `implementation-summary.md`. The title stayed `Implementation Summary`, the original importance tier stayed `normal`, key-decision and quality-score fields were absent, and no pre-save overlap warning or invalid-enum validation error appeared. The misspelled-field save exited `1` with `INSUFFICIENT_CONTEXT_ABORT` instead of the expected field warning. Required signals were absent.
## Evidence
```text
Scratch setup, using the scenario-3 pattern:
R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/XXXXXX")"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
cp -R specs/system-speckit/042-decision-capture "$F/specs/demo/001-demo"
rm -rf "$F/specs/demo/001-demo/scratch"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
Exit statuses: 0 for all seven setup commands
Scratch repository: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/SsalF8

Save wrapper used for the scenario's `<spec-folder>` commands:
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }

Structured-fields save, first payload with toolCalls, exchanges, user_prompts, trigger_phrases, preflight confidence 89 and git_changed_file_count 3:
Exit status: 0
Output:
Phase 1B Alignment: demo/001-demo (0% match)
ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)
"passedThrough":["processed_fields:4"]
"Legacy memory artifact write skipped.\n"
"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/SsalF8/specs/demo/001-demo"

Structured-fields retry with sessionSummary aligned to operator decision capture:
Exit status: 0
Output:
Phase 1B Alignment: demo/001-demo (0% match)
ALIGNMENT_HARD_BLOCK: 0% alignment is below minimum non-interactive threshold (20%)
"Generated summary: 0 created, 0 modified, 0 decisions\n"
"Legacy memory artifact write skipped.\n"
"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/SsalF8/specs/demo/001-demo"

Remaining scenario saves used the same SAVE wrapper and scratch spec folder:
- sessionSummary title payload: exit 0; `POST-SAVE QUALITY REVIEW -- SKIPPED`; `grep -n '^title:' .../implementation-summary.md` printed `2:title: "Implementation Summary"` (grep exit 0), not the payload title.
- triggerPhrases payload: exit 0; review skipped; frontmatter grep printed `4:trigger_phrases:` then `5:  - "decision capture implementation summary"`, not the supplied array (grep exit 0).
- keyDecisions ["Decision A","Decision B"] payload: exit 0; review skipped; `grep -n 'decision_count:' .../implementation-summary.md` printed nothing and exited 1.
- importanceTier "important" payload: exit 0; review skipped; frontmatter grep printed `6:importance_tier: "normal"` (grep exit 0).
- contextType payloads "implementation", "review", "debugging" and "planning": each save exited 0; each log contained `POST-SAVE QUALITY REVIEW -- SKIPPED` and `savedFilePath is a directory`.
- contamination payload: exit 0; review skipped; `grep -nE 'I think|As an AI' .../implementation-summary.md` printed nothing and exited 1, so no newly rendered result was available to judge.
- filesModified ["src/foo.ts"] payload: exit 0; review skipped; `grep -n -A4 '^## FILES' .../implementation-summary.md` printed nothing and exited 1.
- misspelled `sesionSummary` payload: exit 1; log ended with `Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=755, uniqueWords=37.` No `sesionSummary` warning appeared in the log search.
- contextType "bogus" payload: exit 0; review skipped; `grep -inE 'bogus|valid values|validation error' .../invalid-context-type.log` printed nothing and exited 1.
- contaminated and clean quality payloads: each save exited 0 and review was skipped; `grep -n 'quality_score:' .../implementation-summary.md` printed nothing and exited 1.
- nested trigger path payload: exit 0; review skipped; there was no generated auto-extracted trigger set. `grep -nE 'trigger_phrases:|specs/|\.ts' .../implementation-summary.md` matched the existing body rows `64:| .skilled/hooks/README.md, hooks/shared/hook-stdin-deadline.test.mjs, runtime/cli/tests/hook-registration-sync.vitest.ts | ...` and `68`-`74` file rows, not a newly rendered frontmatter trigger set.
- pre-save overlap payload, first save, repeated save with flag unset, and repeated save with `SPECKIT_PRE_SAVE_DEDUP=false`: each save exited 0 and review was skipped. `grep -n 'PRE-SAVE OVERLAP'` on the default and disabled logs printed nothing and exited 1.
- projectPhase "IMPLEMENTATION" payload: exit 0 and review skipped; `grep -n 'PROJECT_PHASE' .../implementation-summary.md` printed nothing and exited 1.

The scenario's expected `POST-SAVE QUALITY REVIEW -- PASSED` block and structured rendered fields were not observed. All scratch logs and the scratch repository were preserved under /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-pi/SsalF8.
```
