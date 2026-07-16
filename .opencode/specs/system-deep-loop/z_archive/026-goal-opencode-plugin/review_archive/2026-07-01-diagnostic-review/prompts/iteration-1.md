DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

You are acting as a LEAF deep-review iteration agent (one dimension, one pass) for a DIAGNOSTIC-ONLY audit. Read these files in full before writing anything:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` (full Known Context for D1-D4, review boundaries, files under review)
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-config.json`
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/graph-metadata.json` (the file under investigation, full contents)
  - `.opencode/skills/system-spec-kit/scripts/spec/create.sh` lines 380-480 (function `create_graph_metadata_file`)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` (the legacy-tolerant loader, functions `loadGraphMetadata`, `validateGraphMetadataContent`, `parseLegacyGraphMetadataContent`)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` (the strict validator, function `readJsonFile`/`validateGraphMetadataFile`)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.js` (look for `isGeneratedMetadataGrandfatherEnabled`)

Background: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer --strict` fails with GENERATED_METADATA_INTEGRITY (`FILE_UNPARSEABLE: graph-metadata.json could not be parsed as JSON`) and GENERATED_METADATA_DRIFT errors. The strategy.md Known Context section for D1 already documents a repo-wide sweep (2425 graph-metadata.json files, exactly 1 fails JSON.parse -- this one), a sibling-phase comparison (010-security-and-correctness-fixes has a valid schema-conformant file), the current `create_graph_metadata_file()` early-return guard (never overwrites an existing file), and a confirmed loader/validator inconsistency (the runtime loader tolerates this legacy plain-text format via a migration path; the strict validator does a raw JSON.parse with no such tolerance). VERIFY this independently rather than trusting it at face value -- re-derive each claim from the actual files.

## Objective

This is iteration 1 of 10 (stop_policy=max-iterations -- do NOT converge early, do NOT recommend stopping before iteration 10). Your assigned dimension is **D1: correctness of the metadata-generation tooling**. Answer with evidence:
1. Is the malformed `graph-metadata.json` an isolated one-off, or does it point to a systemic defect in `create.sh --phase` / the scaffolding tool that could reproduce on other newly-scaffolded phases? State your confidence and the exact evidence (file:line, command output).
2. Is the loader-vs-validator inconsistency (tolerant legacy load path vs strict raw-JSON validator) a genuine tooling correctness/maintainability defect worth a P1/P2 finding on the TOOLING itself (separate from this one phase-009 instance), or is it an intentional one-way migration gate? Check `isGeneratedMetadataGrandfatherEnabled()` and whether the grandfather rollout mechanism covers `FILE_UNPARSEABLE` or only schema-level violations (`SOURCE_FINGERPRINT_MISSING`, `STATUS_NOT_IN_ENUM`, etc). Cite the exact code path.
3. When and how was this specific malformed file most likely created (mtime is ~53 minutes after the other phase-009 scaffold files; it IS committed as-is with zero working-tree diff in the single WIP checkpoint commit `540fac01e4`)? Do not guess without evidence -- if you cannot determine the exact mechanism, say so explicitly and state what evidence would resolve it.

Enumerate the non-obvious edge cases explicitly (e.g.: could ANY other repo-wide code path besides `create.sh` ever write a graph-metadata.json, such as an agent hand-authoring one from a stale mental template, or a different packet-scaffolding entrypoint under a different skill?). Do NOT implement, fix, regenerate, or modify `graph-metadata.json` or ANY file under the 009 phase folder -- this is read-only diagnostic review. Do NOT recommend or execute a live (non-dry-run) fix in this iteration; that decision belongs to synthesis/the operator.

## Style

Production-grade review findings. No narration, no filler. Cite file:line or exact command output for every claim. Distinguish CONFIRMED (with evidence) from INFERRED (state what would confirm it).

## Tone

Terse, literal, adversarial toward your own prior assumptions (and toward the seeded Known Context above -- treat it as a hypothesis to verify, not a given).

## Audience

A senior engineer running your output against strict validators (findings-first review) and against the constraints below.

## Response

You MUST produce THREE artifacts (the post-dispatch validator fails the iteration if any is missing or malformed):

1. **Iteration narrative markdown** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-1.md`. Structure: headings for Dimension (D1), Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension (recommend D2 -- ownership traceability).

2. **Canonical JSONL iteration record** APPENDED (single line, `>>`, never overwrite) to `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-state.jsonl`. MUST use `"type":"iteration"` exactly. Required shape:
```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"D1-metadata-tooling-correctness","dimensions":["correctness"],"filesReviewed":["path:line", "..."],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[{"id":"D1-P?-001","severity":"P1","title":"..."}],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-phase009-audit-20260701-184748","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>}
```

3. **Per-iteration delta file** at `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deltas/iter-001.jsonl` -- one line per event (the iteration record, one line per finding, one line per ruled-out direction).

**ALLOWED WRITE PATHS (the ONLY paths you may create/modify/append)**: `review/iterations/iteration-1.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-001.jsonl`, `review/deep-review-strategy.md` (in-place section updates only -- update D1 checkbox, RUNNING FINDINGS, NEXT FOCUS to D2, FILES UNDER REVIEW rows for files you actually read), `review/deep-review-findings-registry.json` (in-place updates only).
**BANNED everywhere else, especially anywhere under `009-speckit-command-goal-prompt-offer/` outside `review/`**: `rm`, `mv`, `sed -i`, `git rm`, any write/rename/delete/truncate against any other path. Reading is unrestricted repo-wide. If you find yourself about to write outside the allowed list, STOP, record it as a `scope_violation` in the iteration narrative under `## SCOPE VIOLATIONS`, and continue reviewing instead.

Target ~9-12 tool calls. Budget 15-20 minutes. Every new P0/P1 finding needs: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
