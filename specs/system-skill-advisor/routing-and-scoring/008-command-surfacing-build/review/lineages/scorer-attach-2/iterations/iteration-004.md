# Review Iteration 004

## Dispatcher

- Run: `fanout-scorer-attach-2-1794570021136-noekp0` (lineage `scorer-attach-2`, pass two, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: maintainability
- Review focus addressed: the operator focus names "docs that disagree with code" and a full re-read of every changed file. This iteration line-reads the remaining changed code in the area — the handler shell, the schema, and the deriver — looking for maintainability defects the pass-one fixes introduced, and closes the generated-code question.
- Budget profile: `verify` (11-13 calls), used 12.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:1-424`, `:540-737` (whole file across iterations 1 and 4)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:255-470` (changed regions and the recommendation/status shapes)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1-239`, `:640-939`, `:940-1104` (whole file now read across iterations 1, 3 and 4)
- Executed: a scan of every `command-metadata.json` value that reaches the TypeScript emitter for line-break characters (0 found).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`tsString` escapes a backslash and a quote but not a line break, so an authored description with a newline emits invalid TypeScript** -- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:957` -- The helper builds every string literal in the generated TypeScript projection and in `COMMAND_ROWS`. It escapes `\` and `'` only. The sibling `pythonString` (`:1044`) delegates to `JSON.stringify`, which escapes `\n`, `\r` and the Unicode line separators. A metadata `description` (or an `ownedSignals` phrase) is validated as *a string* (`derive-command-bridges.cjs:154-159`) but never as single-line, and `standaloneRuntimeRow` feeds that value straight into the TypeScript row (`:899`). Today no authored value carries a line break — the scan found zero — so this is latent hardening, not a live break.
   Finding class: generated_code_escape_gap
   Scope proof: the helper and every value it escapes live in `runtime/scripts/command-bridges/derive-command-bridges.cjs`, inside the declared `scorer-attach` scope; the output targets are `projection.ts` and `command-attach.ts`.
   Affected surface hints: `projection.ts` and `command-attach.ts` generated blocks; the deriver's `--check` mode; any future metadata description or phrase.
   Case: add `"description": "line one\nline two"` to a standalone skill's `command-metadata.json` entry that has no hand row (so `activateStandaloneCommands` takes it), run `node derive-command-bridges.cjs --write`, and `projection.ts` holds a single-quoted literal broken across two physical lines, so the next `import` of that module fails to parse. The same text in a `command-metadata.json` `ownedSignals` phrase reaches `keywords` and fails the same way.
   Claim: the TypeScript emitter does not escape a character that ends a single-quoted literal.
   Evidence refs: `derive-command-bridges.cjs:957-959`, `derive-command-bridges.cjs:892-905`, `derive-command-bridges.cjs:1044-1046`, `derive-command-bridges.cjs:154-159`
   Counterevidence sought: checked whether the two consumers validate the value first — neither rejects a line break, and the JSON source can express one; checked whether a hand row always wins — a standalone command with no hand row is generated, so the path is real.
   Alternative explanation: the metadata contract may intend descriptions to be one line, and every shipped value is one line, so the escape gap is unreachable by policy rather than by code.
   Final severity: P2 (latent; no current value carries a line break)
   Confidence: high (the escape gap is visible in the function; reach is the only judgement)
   Downgrade trigger: withdraw if the metadata contract states descriptions and phrases are single-line and a validator enforces it.

## Maintainability Checks (executed)

- **Handler shell.** `computeRecommendationOutput` stores the *pre-enrichment* output in `advisorPromptCache` (`advisor-recommend.ts:698-703`) and re-runs enrichment on both the hit (`:629-634`) and the miss (`:704-709`), so `surfaceHint` and `compiledRouteTopOnly` never need to be part of the cache key. Read as correct by construction, not a missing-key defect.
- **Schema shape.** The recommendation schema's `.strict()` object declares every field `publicRecommendation` emits plus the attach fields (`command`, `kind`, `policy`, `ownerSkillId`, `needsMode`) and `compiledRoute`; no emitted field is stripped by `.parse`. The status schema's `hookHealth` block matches the six fields emitted at `advisor-status.ts:501-512` (`invocations`, `rollingP95Ms`, `rollingFailOpenRate`, `rollingCacheHitRate`, `rollingDegradedRate`, `lastRecordAt`).
- **Flag default comment.** `AdvisorStatusInputSchema`'s comment says the integrity probe is off by default "so the read-style advisor_recommend path pays no per-call probe", while `advisor-recommend.ts:595` passes `checkArtifactIntegrity: true`. The comment predates this range (present verbatim at `35c3188681`) and the handler call does too, so the contradiction is pre-existing and out of scope for pass two; recorded here so a later pass does not re-derive it.
- **Deriver validation.** Every closed vocabulary fails loudly (`MUTATING_CLASSES`, `ASK_FIRST_REASONS`, `WRITE_SCOPES`, `POLICY_STRICTNESS`), `assertUniqueIds` catches a duplicate bridge, `compatibilityByInventoryId` rejects a duplicate order or id, and `modeCommandRecords` throws on a mode with no command file. No silent default found in the whole file.
- **Generated row emission.** `renderCommandRows` throws on a duplicate or conflicting id and omits `mutating` rather than guessing a class (`:1162-1166`); the tracked map throws on conflicting policy or owner (`:1182-1185`).

## Traceability Checks

- `spec_code` — partial (unchanged from iteration 3; no new spec claim read this iteration).
- `checklist_evidence` — pending. No checklist claim in focus.
- `feature_catalog_code` — partial (unchanged from iteration 3).
- `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:13` and `:318-362` read `commandRowFor`, so the scorer-row policy and owner reach the public recommendation before any compiled-route enrichment; `:474-485` then overwrites the pair only when a route attaches a command.
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1246-1252` renders the `COMMAND_ROWS` block from the same `entries` and `policies` the JSON is built from, so the two outputs cannot disagree about a policy.
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:321-330` is what keeps the attach fields alive through `AdvisorRecommendOutputSchema.parse` in the handler.

## Edge Cases

- **Latent vs live.** The escape gap has no live trigger: a scan over every `command-metadata.json` `description`, `userIntent.job` and `ownedSignals` value found zero line breaks. It is reported as hardening, and the severity would rise if an authored value ever carried one.
- **Pre-existing comment contradiction.** The `checkArtifactIntegrity` comment contradicts the recommend handler at both the base commit and HEAD; it is listed for a later pass rather than reported, because pass two re-reads coverage is the changed range.
- **Unread test.** `tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` was confirmed by grep to carry `compiledRouteTopOnly` cases at `:121` and `:180` and is named in `tests/handlers/README.md:46`, but its body was not line-read in this pass. Recorded so the coverage claim is not overstated.

## Confirmed-Clean Surfaces

- `advisor-recommend.ts:582-710` — cache key, hit path, miss path, shadow sink and both enrichment calls agree on one order; a cache hit re-parses through the schema before enrichment.
- `advisor-recommend.ts:716-736` — the disable flags are checked before any scoring work, and the disabled output still parses through the schema.
- `advisor-tool-schemas.ts:333-383` — the output and status schemas are strict and complete against the fields the handlers emit.
- `derive-command-bridges.cjs:641-665` — `commandPolicies` orders by command then by bare route before named routes, which is what the byte-for-byte `--check` needs.
- `derive-command-bridges.cjs:957-963` — every string value passes through the same escaper, so there is no second emission path with different quoting.

## Ruled Out

- **Cache key missing `surfaceHint` / `compiledRouteTopOnly`.** Ruled out: the cached value is pre-enrichment and enrichment reruns on every read.
- **Schema stripping an emitted attach field.** Ruled out by field-by-field comparison with `publicRecommendation`.
- **`hookHealth` schema/emitter mismatch.** Ruled out: six fields on both sides.
- **Silent policy default in the deriver.** Ruled out: every branch either derives a policy or throws.
- **Duplicate or conflicting generated row.** Ruled out: both maps throw on conflict.

## Next Focus

- Dimension: cross-cutting (all four)
- Focus area: the `scorer-attach` files marked `no` in `review-scope-2.txt` that no iteration has opened yet — `lib/scorer/ambiguity.ts`, `doctor-helper-handoff.ts`, `projection.ts`, `scoring-constants.ts`, `lanes/*.ts`, `schemas`, `leaf-manifest.json`, the compiled-routing manifests, and the two remaining changed shared docs (`ARCHITECTURE.md`, `runtime/lib/README.md`).
- Reason: pass two's step (3) asks for new defects in the rest of the area; the unopened remainder is where one would still hide.
- Rotation status: all four configured dimensions complete (each PASS); one cross-cutting sweep left.
- Blocked/productive carry-forward: maintainability was productive (one latent P2); no blocked approach.
- Required evidence: direct reads of the unopened files, plus the shared docs against the surfaces they describe.

Review verdict: PASS
