# Deep Review Strategy

## 2. TOPIC
Confirmation review of three fix commits on branch worktrees/477-opencode-v1-removal: 49edc61c95b (the Vibe session-cleanup hook now calls the plugin factory, plus a contract test), d857649d81c (the dispatch guard probes only the `opencode` binary or $OPENCODE_BIN; the loop wrapper refuses an OpenCode 1 binary; v2-bridge export trim; version comments), 12dcc168817 (the cli-opencode README sentence plus packet traceability; trigger-index.json and the retrieval fixtures in it are generated). Confirm that the earlier review's findings in specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/review/review-report.md are resolved and look for regressions the fixes introduce. Earlier findings: DR4-P1-001 (.vibe/plugins/repo-guards/session-cleanup.mjs:51,60 called sessionCleanupPlugin.server after v2-bridge.js dualPlugin dropped the server key; hook-io.mjs runGuard hid the TypeError); DR3-P1-001 (003-v1-docs-and-playbooks-sweep acceptance-criteria.md:57 recorded AC-004 Met while implementation-summary.md:130 said AC-004 not met); DR1-P2-001 (opencode-version.mjs:17 comment promised an `unsupported` token the parser never returns); DR1-P2-002 (two byte-identical parseOpencodeVersion copies, opencode-version.cjs:148 and opencode-version.mjs:183, with divergent failure semantics); DR1-P2-003 (skilled-loop:1217 always passed --standalone, so a v1 binary failed with a raw usage error); DR2-P2-001 (opencode-version.mjs bare-name probe ran a command-chosen opencode<N> binary from PATH); DR3-P2-001 (003 acceptance-criteria.md:55 rows carried Waiver - while their printed command failed as written); DR3-P2-002 (003 scratch/justified.txt:23 justified a renamed feature-catalog path); DR4-P2-001 (v2-bridge.js:602 re-exported MAPPED_HOOKS and TOOL_ALIASES with no importer). For each earlier finding state resolved, still open or not checked, with file:line evidence.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Re-reviewing the whole OpenCode v1 removal branch; the earlier five-iteration review covered it.
- Reviewing the content of the generated trigger-index.json and retrieval fixtures beyond confirming they are regenerated output.
- Modifying any reviewed file.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations with maxIterations 1: the run stops after iteration 1.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Running the fix's own tests instead of reading them: `node --test dispatch-rule-checks.test.mjs` (67/67) and the Vibe contract test (2/2) turned a plausible diff into observed evidence (iteration 1).
- Replaying each printed AC command from the repo root as written: it exposed the ADR-001 replacement commands' cwd defect in one call (iteration 1).
- Reading the whole acceptance file rather than the row the finding named: it surfaced the closure statement that still calls the phase unimplemented (iteration 1).

---

## 9. WHAT FAILED
- `timeout` is not installed on this host, so the first test-run attempt exited before running anything; re-ran `node --test` directly (iteration 1).
- Trusting the prior report's list of contradiction sites: DR3-P1-001 was recorded at two lines, and the same class survived at a third (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`v2-bridge.js` export trim breaking a consumer.** `rg` over the repository finds no code importer of `MAPPED_HOOKS` or `TOOL_ALIASES`; `plugin-inventory.test.cjs:81-82` reads only the two surviving exports. No regression. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`v2-bridge.js` export trim breaking a consumer.** `rg` over the repository finds no code importer of `MAPPED_HOOKS` or `TOOL_ALIASES`; `plugin-inventory.test.cjs:81-82` reads only the two surviving exports. No regression.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`v2-bridge.js` export trim breaking a consumer.** `rg` over the repository finds no code importer of `MAPPED_HOOKS` or `TOOL_ALIASES`; `plugin-inventory.test.cjs:81-82` reads only the two surviving exports. No regression.

### **Removing `opencode\d*` from the probe regex dropping the stdin or model rules.** Those checks keep their own `opencode\d*` patterns (`dispatch-rule-checks.mjs:82,186,777`), so `opencode2 run` is still recognised; only the version probe narrowed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Removing `opencode\d*` from the probe regex dropping the stdin or model rules.** Those checks keep their own `opencode\d*` patterns (`dispatch-rule-checks.mjs:82,186,777`), so `opencode2 run` is still recognised; only the version probe narrowed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing `opencode\d*` from the probe regex dropping the stdin or model rules.** Those checks keep their own `opencode\d*` patterns (`dispatch-rule-checks.mjs:82,186,777`), so `opencode2 run` is still recognised; only the version probe narrowed.

### **The duplicated parsers drifting after the comment-only fix.** `diff` of the two function bodies is empty and the parity case at `opencode-dual-dispatch.vitest.ts:524-528` compares them over the same corpus. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The duplicated parsers drifting after the comment-only fix.** `diff` of the two function bodies is empty and the parity case at `opencode-dual-dispatch.vitest.ts:524-528` compares them over the same corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The duplicated parsers drifting after the comment-only fix.** `diff` of the two function bodies is empty and the parity case at `opencode-dual-dispatch.vitest.ts:524-528` compares them over the same corpus.

### **The factory property being invisible to `sessionCleanupPlugin.factory(...)`.** `enumerable: false` affects enumeration only; property access is unaffected, and the contract test reads it through the real default export. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The factory property being invisible to `sessionCleanupPlugin.factory(...)`.** `enumerable: false` affects enumeration only; property access is unaffected, and the contract test reads it through the real default export.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The factory property being invisible to `sessionCleanupPlugin.factory(...)`.** `enumerable: false` affects enumeration only; property access is unaffected, and the contract test reads it through the real default export.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- A trimmed bridge export breaking a consumer: ruled out, no code importer of `MAPPED_HOOKS`/`TOOL_ALIASES` and `plugin-inventory.test.cjs:81-82` reads only the retained exports (iteration 1).
- The `factory` property being unreachable because it is non-enumerable: ruled out, property access is unaffected and the contract test reads it through the real export (iteration 1, evidence: `.vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:26-46`).
- The two parser copies having drifted: ruled out, the bodies are identical and a parity case compares them (iteration 1, evidence: `opencode-dual-dispatch.vitest.ts:524-528`).
- The narrowed probe regex dropping the stdin/model rules: ruled out, those checks keep their own `opencode\d*` patterns (iteration 1, evidence: `dispatch-rule-checks.mjs:82,186,777`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: traceability (closure metadata sweep) - Focus area: every phase document that states a completion or openness verdict, read against its own rows - Reason: the only P1 this iteration is a scaffold answer left behind in the same file 12dcc168817 edited, which suggests the other closure sentences were not swept - Rotation status: correctness done for the fix set; traceability opened but not exhausted - Blocked/productive carry-forward: the command-reproducibility angle is productive (two of three findings); the export-surface angle is exhausted - Required evidence: `grep` of `Closeable`, `Unmet`, `In Progress`, and `stay open` across the three phase folders, each hit read against its phase status - Recovery note: not applicable

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior review: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/review/review-report.md (verdict FAIL, generation 2, five iterations, cli-pi). Two P1 (DR4-P1-001, DR3-P1-001) and seven P2 (DR1-P2-001/002/003, DR2-P2-001, DR3-P2-001/002, DR4-P2-001); its coverage gate failed because checklist_evidence finished partial. The three fix commits 49edc61c95b, d857649d81c and 12dcc168817 claim to close them. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | `001/implementation-summary.md:112` records all four code fixes; code matches at `session-cleanup.mjs:51,60`, `dispatch-rule-checks.mjs:51-52`, `skilled-loop:1219-1237`, `v2-bridge.js:602`; the catalog entry matches the parser. |
| `checklist_evidence` | core | partial | 1 | ADR-001 waivers and AC-004 Met are in place, but `003/acceptance-criteria.md:89-91` still calls the phase unimplemented and the AC-002/006/008 replacement commands fail as written. |
| `skill_agent` | overlay | pass | 1 | `cli-opencode/README.md:51`, `SKILL.md:5` and `changelog/v2.0.0.0.md:11` all say version 2.0.0.0. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent definition or runtime mirror in the fix set. |
| `feature_catalog_code` | overlay | pass | 1 | `feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md:16,28` against `opencode-version.cjs:120-130,169`. |
| `playbook_capability` | overlay | pass | 1 | `run-plugin-scenario.sh` carries no `<v1|v2>` version argument (rg, no match). |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .opencode/plugins/lib/v2-bridge.js | correctness, maintainability | 1 | none | reviewed |
| .skilled/bin/skilled-loop | correctness | 1 | none | reviewed |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs | correctness, security | 1 | none | reviewed |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs | correctness, security | 1 | none | reviewed, 67/67 pass |
| .skilled/hooks/cli-dispatch/lib/opencode-version.mjs | correctness | 1 | none | reviewed |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs | correctness | 1 | none | reviewed |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs | correctness | 1 | none | reviewed |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | traceability | 1 | none | reviewed |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs | correctness, maintainability | 1 | none | reviewed |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | - | - | - | pending (non-goal) |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | - | - | - | pending (non-goal) |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | - | - | - | pending (non-goal) |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | - | 1 | none | read only through `scratch/check-index-v1.py` (prints 0); content a non-goal |
| .vibe/plugins/repo-guards/session-cleanup.mjs | correctness | 1 | none | reviewed |
| .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs | correctness | 1 | none | reviewed, 2/2 pass |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/decision-record.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/implementation-summary.md | traceability | 1 | none | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/files-outside-table.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/decision-record.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/files-outside-table.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/lockfile-regen.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/spec.md | - | - | - | pending (its AC-008 stays Unmet, per parent spec) |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md | traceability | 1 | DR-001-P1-001, DR-001-P2-001 | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/decision-record.md | traceability | 1 | none | reviewed (ADR-001, ADR-002) |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md | traceability | 1 | none | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/check-index-v1.py | traceability | 1 | DR-001-P2-001 | reviewed and run (prints 0 from the repo root) |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/files-outside-table.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt | traceability | 1 | none | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/spec.md | traceability | 1 | none | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md | traceability | 1 | DR-001-P2-002 | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md | traceability | 1 | none | reviewed |
| .vibe/plugins/repo-guards/lib/hook-io.mjs | correctness | 1 | none | reviewed |
| .opencode/plugins/session-cleanup.js | correctness | 1 | none | reviewed |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/review/review-report.md | traceability | 1 | none | reviewed as the prior-generation baseline |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.1 (stop policy max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-19T17:34:48.691Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-19T17:34:48.691Z
<!-- MACHINE-OWNED: END -->

