# Iteration 5: Convention-class producers and the cleanup pattern

## Focus

Close Q2 for the convention classes (GREP_CONVENTION, FRONTMATTER_VALID, TEMPLATE_SOURCE persistence after the phrase cleanup) by reading the census/cleanup tools, the phrase judge, and the two phase summaries that record what the cleanup did and did not fix.

## Actions Taken

- Read `template-phrase-census.mjs` and `template-phrase-cleanup.mjs` headers and shared imports.
- Read `retrieval/lib/phrase-judge.mjs` (the phrase verdict owner and its frozen classes).
- Read the phase 011 and phase 012 implementation summaries (applied counts, idempotence evidence, the 21-packet coupling).
- Categorized the remaining GREP_CONVENTION failure details in the latest `detail3.txt` report.

## Findings

1. `phrase-judge.mjs` is the single verdict owner for phrase quality. It defines generic workflow words (session, context, memory, summary, feature, update, file, document, section), five frozen template-default sets (four phrases each for spec, acceptance-criteria, plan, tasks, implementation-summary) and the editor fallback words; it reports and gates but explicitly never rewrites an author's declared phrase, because deleting an author phrase is a content decision the convention does not authorize. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:12] CONFIRMED
2. `template-phrase-census.mjs` reads the phrase blocks from the templates themselves so reports follow template edits, and skips `scratch` and `containment` directories as non-packet copies. It is read-only by design. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs:4] CONFIRMED
3. `template-phrase-cleanup.mjs` keeps an exact preview, writes only under `--apply`, and imports its classifier from the census module; phase 12 extended it to partial-block rules (author rows kept byte for byte), defaults-only reseeding and a trailing-stop-word trim whose stop-word list is shared with `create.sh` and pinned by a test. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:4] [SOURCE: specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md:54] CONFIRMED
4. The cleanup pair already demonstrates the target properties end to end: phase 11 applied to 509 files in 375 packets and a second dry run reported 0 files to change; phase 12 applied to 1,319 files across 541 folders and its second run also reported 0. Dry-run first, idempotent second run, operator-gated apply. [SOURCE: specs/system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup/implementation-summary.md:77] CONFIRMED
5. The remaining GREP_CONVENTION class after the cleanup is not template defaults: the census reports 0 live carriers for all five templates (470 archive carriers deliberately left to phase 013). The latest failure details are (a) documents with no frontmatter block at all (tasks.md 22, plan.md 22, spec.md 12, implementation-summary.md 9, plus non-standard docs such as test-report.md, analysis.md, changes.md, context-index.md, README.md), (b) single-token generic phrase warnings in `decision-record.md` (`decision`, `record`, `task`, `spec`), and (c) uppercase basenames such as BENCHMARK-RELOCATED.md. Classes (a) and (c) are the error-bearing remainder. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/detail3.txt:1] CONFIRMED
6. The seeder closes the producer side: `create.sh` seeds all five documents with one slug phrase when the exact four-line template block is present, and the duplicate collision found in 3 packets (a seeded phrase repeating an author phrase) was fixed in the tool so a hand fix cannot recur. [SOURCE: specs/system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup/implementation-summary.md:77] CONFIRMED
7. Phase 12's 21 already-failing packets show the coupling limit: the cleanup could not fix them because they failed on rules it never touches (missing `importance_tier`/`contextType`, empty trigger lists, missing anchors, missing template headers). Phrase cleanup and structural repair are separate passes and the corpus needs both; a heal path that only re-seeds phrases would leave these red. [SOURCE: specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md:78] CONFIRMED

## Ruled Out

- Blaming the template-phrase producer for the persistent GREP_CONVENTION remainder: the census reads the templates themselves and reports zero live carriers, so the remainder is old documents without frontmatter and non-conforming basenames, not template defaults.
- Deleting author phrases to satisfy the judge: the judge itself refuses to rewrite author-declared phrases; any heal tool that did so would violate the phase 013 "never change what a document says" constraint.

## Dead Ends

- Expecting FRONTMATTER_VALID details to be line-prefixed like GREP_CONVENTION details: the report format differs per rule, so per-class samples must be taken with rule-aware extraction rather than one generic pattern.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the phase summaries and the census/judge code describe the same pipeline.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs`
- `specs/system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup/implementation-summary.md`
- `specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/detail3.txt`

## Assessment

- New information ratio: 0.85 (6 of 7 findings fully new; 1 consolidates the known phrase-cleanup outcome and counts as half new)
- Questions addressed: Q2 convention-class completion; Q1 pattern evidence (a shipped idempotent repair pair); Q3 constraint reinforcement
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-011 | Adopt the census/cleanup pair as the reference shape for every permanent repair: read the defaults from the source templates, default to an exact dry-run report, require `--apply`, and treat "second run reports zero" as the idempotence gate | Q1, Q5 | Existing tools under `.skilled/skills/system-spec-kit/runtime/cli/spec/`; the pattern governs new heal tooling | S (adopt), M to extend per class | Low; pattern already proven in production | New tools follow it | Phase 11 and 12 second runs both reported 0 files | CONFIRMED | Yes, the gate itself proves it | Revert the apply commit | No; exact-block replacement keeps author rows |
| R-012 | Add a heal class for required documents with no frontmatter block: generate a conforming frontmatter block from the packet's own slug and description, never inventing topic phrases beyond the slug seed, and only for packet documents the level contract requires | Q1, Q2 | Heal tooling under `.skilled/skills/system-spec-kit/runtime/cli/spec/`; reuses the phrase-judge classes and create.sh seeding rules | M | Med; touching old documents' headers is structural, but the level contract bounds which docs qualify and the slug seed is derivable, not invented | Heal tool plus tests | detail3: tasks.md 22, plan.md 22, spec.md 12, implementation-summary.md 9 `missing` errors | CONFIRMED remainder, INFERRED fix shape (needs the old-layout detector from Q3 to distinguish old docs from mistakes) | Yes (slug seed is deterministic; second run reports zero) | Revert the heal commit | Headers added; existing prose untouched |
| R-013 | Keep phrase warnings advisory and never let a warning gate convergence: the persistent single-token warnings in `decision-record.md` come from author-declared phrases, which the judge refuses to rewrite; converting them to errors would force content edits the convention disallows | Q5 | `phrase-judge.mjs` consumers (validator severity, CI gates) | S | Low | None (policy) | detail3 shows `severity=warn` single-token warnings; judge refuses author rewrites | CONFIRMED | n/a | n/a | No |

## Reflection

- What worked and why: reading the two phase summaries after the tools connected the implementation to its measured outcome (applied counts, second-run zeros, the 21-packet coupling) in one pass.
- What did not work and why: extracting FRONTMATTER_VALID samples with a generic detail prefix returned nothing; rule details are shaped differently and need rule-aware extraction.
- What I would do differently: when categorizing a failure class, first sample two or three raw detail lines for that rule to learn the shape, then write the extraction.

## Recommended Next Focus

Iteration 6: start Q1 properly. Compare each one-off repair script (fix-dup-anchors, add-fm-fields, fix-specfolder, the batch lanes) against the existing tools that could own it (`repair-derived.cjs`, `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `upgrade-level.sh`, `sweep-track-roots.mjs`), and decide per script whether it becomes a mode of an existing tool, a new permanent subcommand, or stays one-off.
