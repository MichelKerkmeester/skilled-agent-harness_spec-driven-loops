### V32
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703` - corpus mode returns based only on `report.errors`; `:715` returns failure for a failed packet. The current sweep had findings and a malformed-goal error, so it exited 2.
COMMAND: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all --root /Users/michelkerkmeester/MEGA/Development/Skilled` -> exit 2
CORRECTED CLAIM: Corpus mode exits 0 with findings when there are no errors. This sweep had an error, so it exited 2.

### V33
VERDICT: REFUTED
SEVERITY: propose P2 because the reported corpus-versus-packet mismatch is absent at HEAD.
EVIDENCE: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:493` resolves one budget for the corpus scan; the corpus reported `parent-budget_findings=0`, and packet mode reported `parent-budget findings=0`.
COMMAND: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all --root /Users/michelkerkmeester/MEGA/Development/Skilled` -> exit 2; `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-speckit/047-v4-release-line-research --root /Users/michelkerkmeester/MEGA/Development/Skilled` -> exit 1
CORRECTED CLAIM: -

### V34
VERDICT: CHANGED
SEVERITY: propose P2 because `--root` is available; the observed usability issue is that `--help` is unsupported, with no wrong-root runtime failure demonstrated.
EVIDENCE: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:59` derives the default root from `__dirname`; `:568-572` parses `--root`; `:706` resolves relative packet paths against that root. `--help` returns `unknown option`.
COMMAND: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --help` -> exit 2
CORRECTED CLAIM: The root and relative-path behavior are as described, but `--help` is rejected as an unknown option; there is no help listing that omits `--root`.

### V35
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1112` calls the rule with only `{ folder, level, rule }`; `spec-doc-structure.ts:1287-1292` skips when no plan is supplied. The standalone CLI accepts `--contamination-json` at `:1483-1485`.
COMMAND: `rg -n 'contaminationPlan' .skilled/skills/system-spec-kit/runtime --glob '!**/tests/**'` -> exit 0
CORRECTED CLAIM: Normal validation invokes the rule without a plan and skips it, but the standalone CLI can run it with `--contamination-json`.

### V36
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:66` excludes `research/lineages`, and `:177` prunes only lineage directories under research. The manifest query found 2,979 included research paths; generator lines `:157-160` hash each included path and its bytes. `--check` reported 44 missing index documents, including research files.
COMMAND: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` -> exit 1
CORRECTED CLAIM: -

### V37
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:127,134,159` counts non-title matches from eligible `.md` files and exits 1. The rule uses a seven-name list at `runtime/cli/rules/check-placeholders.sh:146-150`; it defers Draft tokens at `:196-201` and warns at `:283-287`. The native orchestrator also returns `warn` for Draft tokens at `runtime/lib/validation/orchestrator.ts:891-899`.
COMMAND: `nl -ba .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh | sed -n '93,160p'; nl -ba .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh | sed -n '136,205p;275,295p'; nl -ba .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | sed -n '875,905p'` -> exit 0
CORRECTED CLAIM: The wrapper scans eligible Markdown files, excluding backup, memory, scratch, research, and review directories. It counts Draft value tokens as failures even though the validator warns, and it scans beyond the rule’s fixed file list.

### V38
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/changelog/skilled/v4.0.0.0.md:93` describes scope adherence as a completion-gate check. The registry/runtime search found no `SCOPE_ADHERENCE` rule or scope environment-variable references.
COMMAND: `rg -n 'SCOPE_ADHERENCE|SYSTEM_SCOPE_CHANGED_FILES|SYSTEM_SCOPE_BASE' .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json .skilled/skills/system-spec-kit/runtime` -> exit 1
CORRECTED CLAIM: -

### V39
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/references/memory/save-workflow.md:426,432,435` documents drop refusal, endpoint-based Tier 3, and `routeAs` forcing. The non-Markdown code search found no endpoint or `pending-route` implementation; its only `routeAs` hit is a compatibility comment at `runtime/cli/continuity/generate-context.ts:168`.
COMMAND: `rg -n 'LLM_REFORMULATION_ENDPOINT|pending-route|routeAs' .skilled --glob '!*.md'` -> exit 0
CORRECTED CLAIM: -

BATCH DONE