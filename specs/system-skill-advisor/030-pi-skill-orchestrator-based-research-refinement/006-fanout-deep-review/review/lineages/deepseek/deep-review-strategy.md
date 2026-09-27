# Deep Review Strategy - Fan-Out Lineage `deepseek`

## 1. TOPIC
Deep review of `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review` (spec-folder target). Fan-out lineage `deepseek` (cli-pi / deepseek-v4.1-flash, max effort), 3 iterations, `max-iterations` stop policy, no early convergence stop. Scope: the files listed in `goal-file-manifest.txt` — the changes produced by phases 2 to 5 of packet 030 plus the research-workflow fix made while closing phase 1. Synthesis of this lineage feeds the cross-lineage merge with sibling lineage `mimo`.

---

## 2. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants — PASS (iteration 1; 2 P2 advisories)
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization — PASS (iteration 2; 2 P2 advisories)
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity — PASS (iteration 3; 1 P2)
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost — PASS (iteration 3; no new findings)
<!-- MACHINE-OWNED: END -->

---

## 3. NON-GOALS
- Fixing any finding. This phase reports; remediation is a later phase.
- Reviewing files outside `goal-file-manifest.txt` beyond the declared context narrowing (in the four deep-loop workflow files only `step_convergence_report`; in `.pi/extensions/pi-cache-optimizer/index.ts` only the hash-verified edits section).
- The research lineages under `../001-deep-research/research/`.
- Other sessions' uncommitted work in the tree.

---

## 4. STOP CONDITIONS
- Hard stop at 3 iterations (`config.stopPolicy = max-iterations`, `config.maxIterations = 3`).
- Convergence signals recorded as telemetry only; the loop does not synthesize before iteration 3.
- Security-sensitive override: `minStabilizationPasses = 2` replay before synthesis.

---

## 5. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Nested deadlines (2800/2500/2200), stale-daemon retry, casual-prompt gate reconnect, runtime labels and Pi dual import paths verified end-to-end; 2 P2 advisories (dead export, budget ceiling trap). |
| D2 Security | PASS | 2 | Renderer prompt-safety, plugin argv spawn, plugin/renderer fallback parity, workspace-root allowlist and schema strictness verified; 2 P2 advisories (runtime enum drift, temp-file permissions). |
| D3 Traceability | PASS | 3 | Phases 002-005 swept against code, tests and docs; fan-out close, edit_lines refusal and dedup isolation all pinned; 1 P2 (confirm review max-iterations contract). |
| D4 Maintainability | PASS | 3 | Cross-mode YAML consistency, docs accuracy, test naming-to-requirement mapping reviewed; no new findings; plugin mirror duplication noted. |
<!-- MACHINE-OWNED: END -->

---

## 6. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 5 active (F001 dead export; F002 budget ceiling; F003 runtime enum drift; F004 temp permissions; F005 confirm-review max-iterations contract)
- **Delta this iteration:** +0 P0, +0 P1, +1 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 7. WHAT WORKED
- Nested-deadline arithmetic checked by hand across the adapter (2800 ms), shim kill (2500 ms) and advisor budget (2200 ms) — confirms phase 002 R1's mechanism and its 300 ms emit margin. (iteration 1)
- Tracing each `includeCompiledRoute` claim from spec to schema, to CLI retry, to daemon error mapping (`advisor-server.ts:293-294` maps ZodError to `-32602`) — catches the exact mismatch class that would silently defeat REQ-005. (iteration 1)
- Repo-wide symbol search for every export touched by phase 3 — surfaced one dead helper and avoided a false "used by tests" assumption. (iteration 1)
- Tracing caller-supplied strings to the model-visible boundary (renderer sanitization) and spawn construction (argv array, no shell) — clean, no injection path. (iteration 2)
- Grepping for a literal operator sequence (`'copilot', 'opencode'`) across source and dist — found the three unswept enum copies where a semantic search for "runtime" would have drowned. (iteration 2)
- Statement-level diff of the same step across four workflow variants — caught a contract clause that exists in one variant and not its sibling. (iteration 3)
- Cross-checking a suspected asymmetry against the consumer schema test — turned a would-be finding into a documented non-issue. (iteration 3)

---

## 8. WHAT FAILED
- Attempting to treat the `.pi/extensions` symlink as plain source location: the two-candidate import design is intentional and phase-002-tested; reading 002's REQ-004 settled it without a finding. (iteration 1)
- Reviewing the `metrics.ts` trim comment as a cost regression: cap is 200 records, read cost negligible. Ruled out. (iteration 1)
- Treating the plugin's `degraded` fallback label branch as drift: `parseCliResponse` never emits `degraded`, so the branch is defensive only. (iteration 2)
- Filing the research/review `scope` key asymmetry as a defect: review scope keys on `sessionId`, research on `lineageId`, matching each mode's ledger schema. (iteration 3)

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 9A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: D1 correctness (phase 2/3 hook + runtime); D2 security (output surfaces, schemas, plugin, metrics); D3 traceability (phases 002-005); D4 maintainability (YAML, Pi extension, docs, tests)
- Pivot lineage: none yet
- Remaining frontier: none for this lineage
<!-- MACHINE-OWNED: END -->

---

## 10. RULED OUT DIRECTIONS
- Shim stdin/stdout boundary math (`MAX_STDIN_BYTES + 1`, `INPUT_OVERFLOW`, `ENOBUFS`, `ETIMEDOUT`, `NONZERO_EXIT`, `INVALID_JSON`): correct and fail-open. (iteration 1, evidence: `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:81-146`)
- Pi dedup eviction and headless-brief normalization: no leak or unbounded growth; eviction only for unseen sessions. (iteration 1, evidence: `hooks/pi/prompt-advisor.ts:18-32`, `:78-154`)
- Local-scorer fallback env restore and rethrow semantics: correct. (iteration 1, evidence: `runtime/skill-advisor-cli.ts:1380-1400`, `:1442-1453`)
- Pi dual import candidates as a defect: phase 002 R7 requires a test for both paths. (iteration 1, evidence: `002-hook-deadline-and-diagnostics/spec.md` REQ-004)
- Prompt injection through the renderer: label sanitization (fold, control-char strip, instruction-shape reject) plus enum/number-only interpolation. (iteration 2, evidence: `runtime/lib/render.ts:94-96`, `:140-156`, `:426-451`)
- Command injection in the plugin CLI call: argv array, no shell; stdout capped; JSON guarded. (iteration 2, evidence: `.skilled/plugins/system-skill-advisor.js:780-799`, `:1075-1081`)
- Workspace-root allowlist bypass: separator-aware prefix match on the realpath-canonicalized form. (iteration 2, evidence: `runtime/schemas/advisor-tool-schemas.ts:116-151`)
- Plugin mirror drift: `.opencode` and `.skilled` copies byte-identical (md5 28114f4c629b341a44ce9f7bfef76ef5). (iteration 2)
- Fan-out review close still blocked by the root-dashboard requirement: dashboard exempted when lineage logs exist; both branches proven by the YAML control test. (iteration 3, evidence: `run-now-yaml-control.vitest.ts:293-400`)
- `edit_lines` short-count refusal as user-hostile: the branch is self-describing and offers a safe retry; other mismatches stay strict. (iteration 3, evidence: `pi-cache-optimizer/index.ts:8158-8175`)
- Phase 003 REQ-007 doc claims: gate ahead of the CLI in `skill-advisor-hook.md:37-39`, CLI as front door in `ARCHITECTURE.md:133` with no native builder on the hook path. (iteration 3)

---

## 11. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
None for this lineage: all four dimensions are covered, the spec_code sweep is complete, and F001-F005 (all P2) are final. Handoff: orchestrator merges this lineage with the sibling and runs the fan-out close.
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 38 files in `goal-file-manifest.txt`, grouped as (a) spec-kit hook adapters and deadlines, (b) skill-advisor hooks/runtime/CLI, (c) deep-loop workflow `step_convergence_report`, (d) Pi `edit_lines` hash-verified edits, (e) the tests for each.
- Behavior claims to verify: phase 002 (nested hook deadline + runtime labels + diagnostics), phase 003 (hook-path request option, stale-daemon retry, casual-prompt gate), phase 004 (fallback status heads and lifecycle dedup), phase 005 (follow-up fixes incl. `edit_lines` trailing-newline refusal and fan-out dashboard rule).
- Reuse and conventions: single-line JSON responses, hook timeouts under the shim deadline, CLI-only fallback messaging, Windows path handling, no interactive prompts.
- Review risks and gaps: 38 changed files is shallow ground for 3 iterations; phase 002-005 specs are the normative source for traceability; the four deep-loop YAMLs are large and only `step_convergence_report` is in scope.
- `resource-map.md not present. Skipping coverage gate.`

---

## 13. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1-3 | Full manifest-visible sweep across phases 002-005 complete; every requirement has code plus a pinned test. Phase 005 REQ-006/007 out of manifest scope, recorded as not reviewable. One consistency finding (F005). |
| `checklist_evidence` | core | notApplicable | 1-3 | Level 1 target; no `checklist.md` or `acceptance-criteria.md`. |
| `feature_catalog_code` | overlay | notApplicable | -- | No feature catalog for this target |
| `playbook_capability` | overlay | notApplicable | -- | No playbook claims for this target |
<!-- MACHINE-OWNED: END -->

---

## 14. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts | D1 | 1 | 1 P2 (F002) | partial |
| .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts | D1, D2 | 2 | 1 P2 (F004) | partial |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | D1 | 1 | 1 P2 (F001) | partial |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | D1, D2 | 2 | 1 P2 (F003) | partial |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts | D1, D2 | 2 | 1 P2 (F003) | partial |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | D3 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/ARCHITECTURE.md | D3 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | D2 | 2 | -- | partial |
| .opencode/plugins/system-skill-advisor.js | D2 | 2 | -- | partial |
| .skilled/plugins/system-skill-advisor.js | D2 | 2 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/tools/advisor-validate.ts | D2 | 2 | 1 P2 (F003) | context (out of manifest) |
| .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts | D2 | 2 | -- | partial |
| .opencode/plugins/tests/system-skill-advisor.test.cjs | D2 | 2 | -- | partial |
| .skilled/commands/deep/assets/deep-research-auto.yaml | D3 | 3 | -- | reviewed |
| .skilled/commands/deep/assets/deep-research-confirm.yaml | D3 | 3 | -- | reviewed |
| .skilled/commands/deep/assets/deep-review-auto.yaml | D3 | 3 | -- | reviewed |
| .skilled/commands/deep/assets/deep-review-confirm.yaml | D3 | 3 | 1 P2 (F005) | reviewed |
| .pi/extensions/pi-cache-optimizer/index.ts | D3 | 3 | -- | reviewed |
| .pi/extensions/pi-cache-optimizer/README.md | D3 | 3 | -- | reviewed |
| .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-runtime-label.vitest.ts | D2 | 3 | -- | reviewed |
| .skilled/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts | D1 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts | D3 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts | D3 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts | D3 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts | D2 | 3 | -- | reviewed |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts | D1 | 1 | -- | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts | D3 | 3 | -- | reviewed |
| .skilled/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts | D3 | 3 | -- | reviewed |
| .pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts | D3 | 3 | -- | reviewed |
<!-- MACHINE-OWNED: END -->

---

## 15. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1790437845885-htqb7q, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Stop policy: max-iterations (convergence is telemetry only)
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code (notApplicable), playbook_capability (notApplicable)
- Started: 2026-09-26T15:52:27Z
<!-- MACHINE-OWNED: END -->
