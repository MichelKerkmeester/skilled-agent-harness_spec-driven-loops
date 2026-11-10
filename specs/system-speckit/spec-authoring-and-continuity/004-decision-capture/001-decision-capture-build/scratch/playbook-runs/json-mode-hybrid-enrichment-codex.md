# 153 -- JSON mode structured summary hardening on Codex CLI
- CLI: Codex CLI
- Model: gpt-6-luna, model_reasoning_effort xhigh, service_tier fast
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/json-mode-hybrid-enrichment.md
- Exact prompt: Validate JSON mode structured summary hardening against toolCalls and report cited pass/fail evidence.
- Verdict: **FAIL**
## Result
FAIL. I ran the listed payload/save cases in the scratch repository. Successful saves exited 0 but reported POST-SAVE QUALITY REVIEW -- SKIPPED because the target was a directory, and no rendered memory file appeared, so structured-field, confidence, file-count and frontmatter assertions could not be observed. The file-backed JSON signal was absent from the listed inline --json command sequence. The fast-path and unknown-field payloads exited 1 with INSUFFICIENT_CONTEXT_ABORT, contextType "bogus" was accepted without the expected validation error, and the repeated-save overlap warning did not appear.
## Evidence
~~~text
Scratch setup from the repository root:
R="$PWD"; F="$(mktemp -d "/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/XXXXXX")"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
rsync -a --exclude scratch specs/system-speckit/042-decision-capture/ "$F/specs/demo/001-demo/"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
Output: SCRATCH_REPO=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/AkYyZU
Exit status: 0

Primary payload:
J='{"sessionSummary":"Validate structured JSON summary hardening","toolCalls":[{"tool":"Read","inputSummary":"Read src/auth.ts","outputSummary":"Found token refresh handler","status":"success","durationEstimate":"2s"},{"tool":"Bash","inputSummary":"Inspect session pipeline","outputSummary":"Reviewed three source files","status":"success","durationEstimate":"1s"}],"exchanges":[{"userInput":"Preserve structured JSON fields","assistantResponse":"The supplied fields should remain visible.","timestamp":"2026-11-01"}],"user_prompts":["Check structured field preservation"],"trigger_phrases":["structured JSON","hybrid enrichment"],"observations":[{"type":"decision","title":"Keep structured data authoritative","narrative":"Use the explicit JSON input as the record source.","_manualDecision":{"fullText":"Use the explicit JSON input as the record source.","chosenApproach":"Structured JSON","confidence":0.93}}],"filesModified":["src/auth.ts","src/refresh.ts","src/session.ts"]}'
SAVE --full-auto
SAVE exit: 0
Output:
POST-SAVE QUALITY REVIEW -- SKIPPED
skipReason: savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/AkYyZU/specs/demo/001-demo
find "$F/specs/demo/001-demo" -maxdepth 4 -type f -path '*/scratch/*' -name '*.md' -print
Output: no output; exit 0. An earlier command was:
find "$F/specs/demo/001-demo/scratch" -type f -name '*.md' -print
Output: find: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/AkYyZU/specs/demo/001-demo/scratch: No such file or directory
Exit status: 1.

The remaining SAVE --full-auto cases used the same helper and target. Every successful case below emitted the same SKIPPED block and directory skipReason above. The rendered Markdown reads and assertions could not be performed because the follow-up find returned no files.

02 clean review: J='{"sessionSummary":"Decision capture structured summary review","triggerPhrases":["decision capture","structured JSON summary"],"keyDecisions":["Preserve the caller's structured summary fields","Keep explicit metadata values"],"importanceTier":"important","contextType":"implementation"}'; SAVE exit 0.
03 title: J='{"sessionSummary":"Decision capture refactor auth pipeline for token refresh"}'; SAVE exit 0.
04 trigger phrases: J='{"sessionSummary":"Decision capture auth refactor token refresh","triggerPhrases":["auth refactor","token refresh"]}'; SAVE exit 0.
05 decisions: J='{"sessionSummary":"Decision capture key decision count validation","keyDecisions":["Keep structured records authoritative","Count every supplied decision"]}'; SAVE exit 0.
06 importance: J='{"sessionSummary":"Decision capture importance tier propagation","importanceTier":"important"}'; SAVE exit 0.
07 contextType, four separate saves, each exit 0:
J='{"sessionSummary":"Decision capture context enum implementation","contextType":"implementation"}'
J='{"sessionSummary":"Decision capture context enum review","contextType":"review"}'
J='{"sessionSummary":"Decision capture context enum debugging","contextType":"debugging"}'
J='{"sessionSummary":"Decision capture context enum planning","contextType":"planning"}'
08 contamination: J='{"sessionSummary":"I think decision capture should retain this context","recentContext":[{"request":"As an AI, I am summarizing the decision capture session."}],"triggerPhrases":["decision capture"]}'; SAVE exit 0.
09 fast-path files: J='{"sessionSummary":"Decision capture filesModified fast path","userPrompts":[{"prompt":"Record the changed file in the decision capture summary."}],"filesModified":["src/foo.ts"]}'; SAVE exit 1.
Output:
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Semantic substance is too low (77 chars, 9 unique words). Evidence counts: primary=1, support=1, total=2, semanticChars=77, uniqueWords=9.
Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Semantic substance is too low (77 chars, 9 unique words). Evidence counts: primary=1, support=1, total=2, semanticChars=77, uniqueWords=9.
10 typo warning: J='{"sesionSummary":"Decision capture typo warning","user_prompts":["Check unknown input warning"]}'; SAVE exit 1.
Output:
Warning: No observations found (no events documented)
Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=862, uniqueWords=39.
Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. No primary evidence was captured for this memory. Evidence counts: primary=0, support=2, total=2, semanticChars=862, uniqueWords=39.
No warning naming sesionSummary appeared.
11 invalid enum: J='{"sessionSummary":"Decision capture invalid context type","contextType":"bogus"}'; SAVE exit 0.
Output: {"timestamp":"2026-11-01T14:24:28.331Z","level":"info","message":"POST-SAVE QUALITY REVIEW -- SKIPPED","status":"SKIPPED","issues":[],"renderQualityScore":null,"inputCompletenessScore":null,"scorePenalty":0,"blocking":false,"component":"post-save-review","skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-codex/AkYyZU/specs/demo/001-demo"}
No validation error naming "bogus" or valid values appeared.
12 quality score, two separate saves, each exit 0 and same SKIPPED block:
Contaminated J='{"sessionSummary":"I think decision capture could maybe work","recentContext":[{"request":"As an AI, this might be a hypothetical decision."}],"triggerPhrases":["decision capture"]}'
Clean J='{"sessionSummary":"Decision capture quality score comparison","triggerPhrases":["decision capture quality"],"keyDecisions":["Keep supplied quality metadata","Compare clean inputs"],"importanceTier":"important","contextType":"implementation"}'
13 path filtering: J='{"sessionSummary":"Decision capture path filter for specs/system-speckit/archive/030-deep/example.ts","triggerPhrases":["decision capture"],"recentContext":[{"request":"Check specs/system-speckit/archive/030-deep/example.ts"}]}'; SAVE exit 0. Same SKIPPED block.
14 overlap, same exact payload saved three times:
J='{"sessionSummary":"Decision capture overlap warning repeated test","triggerPhrases":["decision capture overlap","structured save"],"keyDecisions":["Preserve the same exact save payload","Detect overlap by content"],"importanceTier":"important","contextType":"implementation"}'
First save with SPECKIT_PRE_SAVE_DEDUP unset: exit 0.
Exact repeat with SPECKIT_PRE_SAVE_DEDUP unset: exit 0.
Exact repeat with SPECKIT_PRE_SAVE_DEDUP=false: exit 0.
The overlap search exited 0 and returned only "Content quality: 40/100 (0 noise, 0 duplicates filtered from 1 items)" for each log. No PRE-SAVE OVERLAP warning appeared. All three also emitted the same SKIPPED block.
15 project phase: J='{"sessionSummary":"Decision capture project phase propagation","projectPhase":"IMPLEMENTATION"}'; SAVE exit 0. Search for IMPLEMENTATION, PROJECT_PHASE or RESEARCH returned no lines; the save emitted the same SKIPPED block.

The save command in each case expanded to:
(cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" --full-auto --json "$J" specs/demo/001-demo)
All input was inline JSON. No command in the playbook lists exercised a file-path JSON input, so the file-backed structured-path signal was not observed.
~~~

