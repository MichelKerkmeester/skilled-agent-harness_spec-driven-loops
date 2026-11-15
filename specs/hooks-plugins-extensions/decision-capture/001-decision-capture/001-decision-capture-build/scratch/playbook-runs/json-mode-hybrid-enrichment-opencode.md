# json-mode-hybrid-enrichment on OpenCode

- CLI: OpenCode
- Model: llmgateway/deepseek-v4.1-flash-1017#max
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/json-mode-hybrid-enrichment.md
- Exact prompt: `Validate JSON mode structured summary hardening against toolCalls and report cited pass/fail evidence.`
- Verdict: **FAIL**

## Result

The inline save exited 0 and its summary line did count `2 key decisions documented` from the 2-item `keyDecisions` array, so the input was parsed. But no rendered memory document exists to inspect: the log says `Skipping legacy [spec]/memory/*.md writes` and no `memory/` directory or new `.md` appears anywhere in the packet. The only files rewritten were `description.json`, `graph-metadata.json` and `implementation-summary.md`, and a git-tracked scratch repository came back clean, so all seven packet `.md` files still hold none of the payload. Grepping every `.md` for `json mode hardening`, `tool call preservation`, `Probe exchange one`, `Probe prompt one`, `src/foo.ts`, `GIT_CHANGED_FILE_COUNT` and `toolCalls` returned 0 files each, so structured-field preservation, decision confidence and an explicit changed-file count are all unobservable. The file-backed JSON leg also failed: both runs exited 1 with `INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later.` The scenario contract is stale against the current save path, which renders no memory file.

## Evidence

```text
Scratch repository F=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fe0c9990-06d3-454e-a8e7-7c7bc649bc49/scratchpad/pb-opencode/AtwMMc
Built as scenario 3 step 1: specs/demo/001-demo copied from 042-decision-capture, scratch/ removed, .skilled/skills/system-spec-kit symlinked, .opencode created, git init plus a base commit.

Command 1, payload composed with toolCalls, exchanges, user_prompts, trigger_phrases, keyDecisions (2 objects with chosenOption, rationale, alternatives), filesModified ["src/foo.ts","src/bar.ts"], importanceTier important, contextType implementation, projectPhase IMPLEMENTATION.

Command 2:
$ (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" --json "$J" specs/demo/001-demo)
exit=0
"   Summary:"
"  - 2 messages captured"
"  - 2 key decisions documented"
"   Refreshed graph-metadata.json"
"   Skipping legacy [spec]/memory/*.md writes"
"   Skipping retired legacy memory indexing"
"POST-SAVE QUALITY REVIEW -- SKIPPED" ... "skipReason":"savedFilePath is a directory (phase-parent or unspecified target): /private/.../AtwMMc/specs/demo/001-demo"

Command 3, inspect rendered .md output:
$ git -C "$F" status --short
(no output, exit=0)
$ find "$F/specs/demo/001-demo" -type f -newermt '-10 minutes' -print
.../graph-metadata.json
.../implementation-summary.md
.../acceptance-criteria.md
.../description.json
.../tasks.md
.../timeline.md
.../plan.md
.../spec.md
.../decision-record.md
$ find "$F/specs/demo/001-demo" -maxdepth 2 -type d -name memory
(no output)
$ for pat in "json mode hardening" "tool call preservation" "Probe exchange one" "Probe prompt one" "src/foo.ts" "GIT_CHANGED_FILE_COUNT" "toolCalls"; do grep -rl "$pat" "$F/specs/demo/001-demo" --include='*.md' | wc -l; done
json mode hardening:        0
tool call preservation:        0
Probe exchange one:        0
Probe prompt one:        0
src/foo.ts:        0
GIT_CHANGED_FILE_COUNT:        0
toolCalls:        0

Command 4, decision confidence: no rendered document carries a confidence value; grep for GIT_CHANGED_FILE_COUNT and decision metadata returned 0 files.
Command 5, explicit changed-file count: no GIT_CHANGED_FILE_COUNT or FILES rendering exists in the packet.

Supplementary file-backed JSON run (positional data file):
$ printf '%s' "$J" > "$F/payload.json"
$ (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.../generate-context.js" --project-root "$F" payload.json specs/demo/001-demo)
exit=1
"   Found 2 messages"
"   Found 2 decisions"
"   Template populated (quality: 40/100)"
"Unexpected Error: INSUFFICIENT_CONTEXT_ABORT: Not enough context for a proper memory. Memory title is too generic to stand alone later. Evidence counts: primary=5, support=4, total=9, semanticChars=1971, uniqueWords=39."
Second attempt with sessionSummary "Keep structured tool calls on the file-backed JSON save path" also exited 1 with the same INSUFFICIENT_CONTEXT_ABORT title message.
```
