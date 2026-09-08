---
title: "Round three (r3) research ledger: command assets, env reads, test coverage, hook adapters, CI triggers"
trigger_phrases:
  - "cli runtime round three"
  - "command asset parsers"
  - "undocumented env reads"
  - "test coverage by script"
  - "hook adapters vs core"
  - "ci push vs pr coverage"
---

# Deep research synthesis — deepseek-v4-flash-cli-runtime-r3

Lineage: `fanout-deepseek-v4-flash-cli-runtime-r3-1788784296528-mlu6l0` · 5 iterations, one angle each, no early convergence · stop reason `maxIterationsReached` (config.stopPolicy max-iterations; convergence telemetry treated as telemetry only).

Scope: system-spec-kit runtime CLI package and the assets and hooks that call it. Two prior rounds: GLM 5.3 Flash (54 findings, remediated 007/008) and DeepSeek V4 Flash (21 findings, remediated 014); the census (`confirmed-findings.md`) was read once in iteration 1 and no fixed/kept/recorded row was re-reported. Every count below was taken in this round; none reuses a round-one/round-two number.

## Ledger by angle

### Angle 1 — Command assets versus the scripts they invoke (iteration 1)

| # | Severity | Claim side | Actual side | Recommend |
|---|----------|-----------|-------------|-----------|
| 001 | P2 | `.opencode/commands/speckit/save.md:47-48` — eight route categories: narrative_progress, narrative_delivery, decision, handover_state, research_finding, task_update, metadata_only, drop | `runtime/lib/validation/spec-doc-structure.ts:156-169` — the only runtime routeCategory vocabulary (ROUTE_CATEGORY_ALIASES: what_built/how_delivered/narrative_progress→narrative_progress, decisions/decision_log→decision_log, research/research_findings→research_findings, metadata/metadata_only→metadata_only, drop; unlisted values pass through raw at :1139). narrative_delivery and handover_state appear in no runtime source file; bare decision and singular research_finding are not aliases — 4 of 8 names diverge | document (align the list or mark the block presentation-only with canonical names) |
| 002 | P2 | `runtime/cli/core/workflow.ts:1740` — comment "Post-save quality review — wire into production pipeline" | The code directly below (1742-1754) already runs reviewPostSaveQuality/printPostSaveReview unconditionally (shouldRunExplicitSaveFollowUps = true at 1646-1651); the wiring the comment announces is done | fix (comment wording) |
| 003 | P2 | Audit premise (from the lineage charter) — validate.md is a command asset to audit | No validate.md exists under `.opencode/commands/speckit/` (listing: README.txt, assets/, complete.md, implement.md, plan.md, resume.md, save.md, search.md); zero references to `/speckit:validate` or `commands/speckit/validate.md` in `.opencode`; README.txt's command table and structure omit it; validation is script-level (validate.sh via workflow YAMLs and CI) — premise correction, not a defect | document |

Verified correct: save.md's writer flags (--full-auto/--json/--stdin/--planner-mode/positional file) all parsed (generate-context.ts:70-102); the post-save quality review promise (save.md:21,61) is implemented through generate-context.ts:29 → core/workflow.ts:1740-1754 → core/post-save-review.ts; generate-trigger-index.mjs no-arg invocation valid (usage :27); complete.md/resume.md asset references all exist; no asset promises a script exit code.

### Angle 2 — Undocumented environment reads (iteration 2)

| # | Severity | Claim side | Actual side | Recommend |
|---|----------|-----------|-------------|-----------|
| 004 | P2 | `runtime/ENV-REFERENCE.md` §3 — validate.sh's env surface is SPECKIT_RULES etc.; "Total unique variables documented: 145" | `runtime/cli/spec/validate.sh:19-20` reads `${SPECKIT_SKIP_VALIDATION:-}` (non-empty ⇒ whole validation run skipped, with a "Validation skipped" message; documented only in the script's own usage help at :79, never in the reference) | fix (add the row) |
| 005 | P2 | `runtime/ENV-REFERENCE.md:225` — "Mirroring the markers in `.env.example`: every provider-selection row..." | No `.env.example` exists anywhere under `.opencode` (find returns zero; the only surviving example is `.opencode/hooks/hook-flags.env.example`, already named at :66) | fix (reword or drop the pointer) |

Verified correct: SPECKIT_AC_CLOSURE/:CUTOFF read at check-ac-closure.sh:32,49 and SPECKIT_AC_COVERAGE/:ENFORCE/:FLOOR at check-ac-coverage.sh:21,27,39,50 (reference rows 166-170); SPECKIT_TEMPLATES_BASE at create.sh:954,1091,1649 (row 165); SPECKIT_COMPLETION_FRESHNESS/:ENFORCE at continuity-freshness.ts (rows 174-175); SYSTEM_COMPLETION_DISABLED has a live reader (lib/hooks/completion-evidence-sentinel.cjs); check-completion.sh's BLUE/etc. are locally defined (:35,39), not env reads; MEMORY_BASE_PATH is documented-as-dead by its own row.

### Angle 3 — Test coverage by script (iteration 3)

| # | Severity | Claim side | Actual side | Recommend |
|---|----------|-----------|-------------|-----------|
| 006 | P2 | cli/tests README + CI step "Legacy module lanes and the bash validation suites" (spec-kit-check.yml:55-62) implies the cli/tests bash suites run in CI | Four standalone bash tests (cli/tests/check-ac-closure.sh, check-ac-coverage.sh, check-graph-metadata-child-drift.sh, check-graph-metadata-shape-last-active-child.sh) are named by no vitest, no package.json script (test:validation verified at package.json:22), no reference from test-validation-extended.sh, and no CI step read — conditional on `npm run test:legacy` (unread under budget) | merge (wire into a lane or delete; ground the CI comment) |
| 007 | P2 | The angle's exemption: "a rule the validation lane exercises through validate.sh" | rules/check-links.sh is the one rule script with no validator-registry.json row (39 rows; 27 rules/*.sh listed) so validation never runs it; its only live caller is `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` — consistent with round-two census row 10 (recorded, not a defect) | document |

Coverage result: every cli/spec script has a lane except sweep-track-roots.mjs — named by no test (recorded-kept manual tool: cli/spec/README.md:74,108,152; round-one census row 10 holds, not re-listed as a finding). 26 registry rule scripts + 3 helpers ride validate.sh's registry dispatch (stated exemption). cli/tests' four check-*.sh files are test harnesses, not rule copies (all diff from rules/).

### Angle 4 — The five hook adapters against the core (iteration 4)

| # | Severity | Claim side | Actual side | Recommend |
|---|----------|-----------|-------------|-----------|
| 008 | P1 (conditional) | `runtime/hooks/pi/completion-evidence.ts:12` — `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs"` | From the checked-in location that resolves to `system-spec-kit/runtime/.opencode/...` (verified nonexistent); correct depth from runtime/hooks/pi/ is five ups; the claude/codex cjs siblings guard the equivalent import (try/catch at claude:39, codex:35) and use six ups (correct at their depth). The pi import is unguarded top-level: if the pi loader does not relocate the module, the whole pi completion-evidence adapter fails to register silently | fix (correct depth / guard like the cjs siblings) |
| 009 | P2 | `runtime/hooks/pi/completion-evidence.ts:20` — fallback `import("../../.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs")` | Same wrong base; duplicates the already-correct primary import (:18); dead in the one case it would run, and its failure escapes the catch | fix (remove or correct) |

Verified correct: exports list (completion-evidence-sentinel.cjs:547-570) covers every `sentinelCore.X` used by claude/codex/devin/cursor/pi; all five adapters send exactly {specFolder, claimText, projectDir, env}, which is precisely what the core reads (483-545); the core emits only decision `ok`/`advise` (+deduped) and no adapter branches on any other status (claude's "never {decision:'block'}" comment is a negative statement, consistent); KILL_SWITCH_ENV still exported, claude:36 comment accurate; cursor's six-up hook-flags import resolves correctly.

### Angle 5 — CI workflow push versus pull-request coverage (iteration 5)

| # | Severity | Claim side | Actual side | Recommend |
|---|----------|-----------|-------------|-----------|
| 010 | P1 | Round-one census fix rows 10/12 — spec-kit-check "runs the five checks" and the test gates, closing the "CI-invisible" gaps; routing-registry-drift.yml:3-8 documents release-line direct pushes ("no PR") | spec-kit-check.yml:3-8 has no push trigger: on a direct push to main or skilled/v* none of its lanes run — CLI check+typecheck (40-44), shared tests (46-47), CLI vitest (49-53), legacy lanes + bash validation suites (55-61), runtime vitest (63-69), mirror parity (86-93); paths narrow even PR runs to system-spec-kit/** | fix (add push: main, skilled/** with the same paths) |
| 011 | P2 | changed-packet-validation.yml ("Spec packets touched by this PR validate clean") — PR main only | No push key, no paths: a direct push to main lands packet changes unvalidated while sibling gates run on push main (command-tree-parity.yml, playbook-operator-contract.yml) | fix (add push, no paths) |
| 012 | P2 | No documentation classifies which gates are push-eligible | 8 of 15 workflows never run on any push (agent-mirror-sync, changed-packet-validation, comment-hygiene, markdown-link-integrity, prompt-card-sync, rule-canary-sync, skill-doc-frontmatter, spec-kit-check); only routing-registry-drift.yml's comment names the direct-push reality | document (per-workflow rationale, or align guards with local twins) |

Verified correct: the mirrors job's five parity checks match the census content claim ("the five doctor checks" plus two extras); spec-kit-check's paths include the workflow file itself; runtime-no-spec-import.yml and routing-registry-drift.yml are coherent push+PR pairs; strict-pass-freshness-report.yml is a scheduled report, not a gate.

## Cross-angle observations

1. Two rounds of remediation (007/008/014) left the tree mostly coherent: the only contradicting code-level findings this round are the two pi-adapter import paths (008/009), and only 004 is an env-surface gap; the rest (001, 002, 003, 005, 006, 007, 010-012) are documentation, wiring, or trigger-shape gaps.
2. The pi hook family (all five files) shares the same 2-up import pattern — 008 is a family-level pattern, and the whole family's load behavior is one open question.
3. spec-kit-check.yml (010) is the single highest-blast finding: it is the artifact the census explicitly presented as closing the CI-invisibility gap, and it is itself invisible to the documented direct-push flow.

## Open questions carried

1. Does the pi runtime load `runtime/hooks/pi/*.ts` with module relocation (making the 2-up path resolve) or silently drop failed adapters? The same pattern appears in all five pi hook files.
2. Does `isHookEnabled("completion")` in the pi adapter reach the documented `SYSTEM_COMPLETION_DISABLED` kill-switch, given CONCERN_CANONICAL does not list "completion"?
3. Does `npm run test:legacy` dispatch the four standalone cli/tests bash tests (006's conditional)?
4. Was spec-kit-check's PR-only trigger a deliberate cost choice or an oversight from the census fix? The recommendation keeps `paths` to avoid unrelated-push runs on an expensive six-suite gate.
5. Where the document that says validate.md should exist — the charter's premise; nothing in-tree claims a validate command.
