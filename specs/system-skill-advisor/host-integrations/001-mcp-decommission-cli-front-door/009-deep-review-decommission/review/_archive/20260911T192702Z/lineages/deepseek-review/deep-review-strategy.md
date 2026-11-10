# Deep Review Strategy - Skill Advisor MCP Decommission (phase 9 lineage: deepseek-review)

## 1. REVIEW CHARTER

- **Target**: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission` (`spec-folder`)
- **Brief under execution**: `{spec_folder}/prompts/review-target.txt` - release auditor for the completed advisor transport decommission: six finding classes, reproduction required for every finding, live-surface versus historical-record classification required
- **Dimensions**: correctness, security, traceability, maintainability
- **Stop conditions**: six iterations (config.maxIterations) OR legal convergence of the 3-signal composite; any confirmed P0 blocks STOP
- **Success criteria**: every finding carries `file:line` plus the exact read-only command whose output proves it; every surviving MCP string is bucketed live-surface or historical-record; retired-test coverage is either replaced or named

## 2. TOPIC

Review of `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission`.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants - covered iterations 1, 2, 4, 6
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization - covered iteration 2, re-verified 6
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity - covered iterations 3, 5, 6
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost - covered iteration 4, re-verified 6
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Routing quality. Lane weights, thresholds, fusion, scorer and skill-graph schema are out of scope; no recommendation may be judged by this review.
- This packet's declared preserve set: `system-spec-kit` and `system-deep-loop` internals (specified as read-only pattern sources), every other MCP server (Code Mode, Figma, ClickUp, Chrome DevTools, GitKraken, Obsidian), the shared HF model server and IPC bridge, the Python compatibility shim's behavior beyond the rename, and historical records (changelogs, dated benchmark reports, ADR rows, appended run records, frozen fixtures).
- Implementing fixes. This loop is observation-only; findings route to planning.

## 5. STOP CONDITIONS

- 6 iterations reached (`config.maxIterations`), or the 3-signal composite reaches legal STOP with all nine review gates passing.
- Stuck recovery (2 consecutive no-progress iterations under `noProgressThreshold = 0.05`) triggers a change of granularity, not a stop.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1, 2, 4, 6 | Doctor MCP install/debug/doctor surfaces and the launcher still assert or depend on the removed transport (F001, F002, F004); the DB-dir self-fallback is a pre-existing defect (F013). No security-relevant correctness hole. |
| D2 Security | PASS | 2, 6 | Trust guard fails closed and is transport-independent; both rehomed env defaults verified in the launcher; no trust or credential finding. Residue is naming and documentation only (F005, F006, F007). |
| D3 Traceability | CONDITIONAL | 3, 5, 6 | Live spec-kit and `.pi` documents teach the retired transport (F008, F009, F010, F005); the packet's completion state is unverifiable (F015) and two sibling records are stale (F016, F017). `spec_code` passes on the shipped behaviour; the failures are claims, not code. |
| D4 Maintainability | CONDITIONAL | 4, 6 | The bin entrypoint map and several retained identifiers describe the retired transport (F012, F006, F007, F011, F014); defects raised rather than fixed, consistent with the phase-007 preserve decision. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active (never any)
- **P1 (Major):** 9 active
- **P2 (Minor):** 8 active
- **Delta this iteration (6):** +0 P0, +0 P1, +0 P2, +1 P1 refinement (F010), +1 P1 refinement note (F002)
- **Terminal state:** CONDITIONAL, `stopReason: maxIterationsReached`

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Reading the sibling workflow in the same family as a control: `doctor-mcp-debug.yaml` carries the correct `runtime/` repair paths, which classified `doctor-mcp-install.yaml` as drift rather than a decision (iteration 1).
- Tracing a claim to its producer before believing a document: grepping the five runtime configs disproved `.pi/SYNC.md`'s registration row directly (iteration 2).
- Attacking a finding instead of restating it: the iteration-6 replay ran one falsification per active P1 and produced the F010 refinement (30 hits, two false config-registration sentences) that plain re-reading had missed (iteration 6).
- Checking a claim's *evidence placement*: the retired-coverage accounting was verified in the commit body and then located as absent from the packet, which is what made F017 a finding rather than a paragraph (iteration 5).

## 9. WHAT FAILED

- Executing the reproduction commands the brief asks for (`/doctor:mcp`, the advisor CLI cold call, test runs): every candidate writes outside the lineage, so reproduction is confined to read-only probes. Recorded as a review limitation rather than a silent gap.

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

- **A resurrected MCP surface** (a second server copy somewhere) - would have falsified F001/F005/F008/F010/F012 at once; three probes negative (directory, dist path, `.pi/mcp.json`).
- **The prompt-time brief being broken** - the Claude shim and the Pi adapter both resolve `runtime/`; the stale ENV-REFERENCE walk target is documentation drift.
- **A trust hole from the removed MCP metadata path** - trust is environment-only and fail-closed.
- **The two accuracy gates as regressions** - pre-existing, independently corroborated by the retirement commit bodies.
- **Preserved trigger phrases, MCP-named leaf directories and the `runtime:'mcp'` cache namespace** - covered by phase 007's written preserve decision, so not findings.
- **The advisor-authored docs (`INSTALL-GUIDE.md`, `README.md`, `SKILL.md`) and the agent hook-paragraph surfaces** - verified clean of MCP transport claims.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Loop complete at the iteration ceiling. Next action is `/speckit:plan` for the nine active P1 findings (workstreams in `review-report.md`), and the phase 008 gate run that only the owning packet can perform.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

`resource-map.md not present; skipping coverage gate.`

### Bounded Context Snapshot

- **Target pointers**: `{spec_folder}/{spec.md,plan.md,tasks.md,implementation-summary.md,goal.md}`; `{spec_folder}/prompts/review-target.txt` (the packet's own review brief); sibling phases `005-mcp-transport-removal`, `006-runtime-package-rename`, `007-docs-and-residue-sweep`, `008-verification-and-closeout`; implementation surfaces named in the brief: `.opencode/skills/system-skill-advisor/{INSTALL-GUIDE.md,README.md,SKILL.md,ARCHITECTURE.md,runtime/,hooks/,feature-catalog/,manual-testing-playbook/}`, `.opencode/bin/{skill-advisor.cjs,system-skill-advisor-launcher.cjs}`, `.opencode/plugins/system-skill-advisor.js`, `.opencode/commands/doctor/`, `.opencode/install-guides/`, root `README.md`, `.pi/`, `.claude/mcp.json`, `opencode.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json`.
- **Behavior claims to verify**: (a) no runtime config declares the advisor as an MCP server; (b) the CLI is the single front door for nine commands and the daemon speaks the advisor's newline-delimited protocol (`initialize` returns `advisorProtocol "1"`); (c) the prompt-time brief still arrives in three daemon states - warm, cold where the call must start the daemon, unreachable where a degraded `Advisor: stale` line is required; (d) `mcp-server/` was renamed to `runtime/` and nothing outside history resolves the old name; (e) two env settings moved from the deleted config blocks into the launcher; (f) 26 bridge tests retired and 7 contract tests inverted; (g) the two accuracy gates `python-ts-parity` and `scorer-eval-baseline-ratchet` fail identically in an untouched checkout and are pre-existing.
- **Reuse and conventions**: live instruction surfaces must describe what ships; historical records keep their old names (changelog, ADR rows, appended run records, frozen fixtures); the phase-007 residue record is the authoritative exemption list and every exemption there carries a written reason.
- **Review risks and gaps**: this lineage is write-contained to its artifact directory, so commands that write to disk (test runs, `npm`, the advisor CLI with a cold daemon, `validate.sh`, `generate-context.js`) must not be executed. Reproduction therefore uses read-only probes (`rg`, `sed`, `test -f`, `ls`, `git show`) and pre-existing evidence (commit messages, latency-delta.md, implementation-summary.md). Findings that depend on an unrun command are marked as such instead of being asserted as verified.
- **Known-stale before this review (carried from 007 limitation #4)**: spec-kit env reference paths, `.pi` docs, doctor configs. These are re-verified here rather than assumed, and reported with their current line evidence.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3, 5, 6 | The packet's scope claims hold from the final state (transport removed from all five configs, package renamed, CLI answering, env rehomed). The residue claim fails and is filed as F001-F012/F015 rather than as a plan/code mismatch. |
| `checklist_evidence` | core | pass (`notApplicable` inside the target) | 3, 5, 6 | Target packet is a Level 1 scaffold with no `checklist.md`; the nearest authoritative list (phase 008's five goal criteria) stands at 0 of 5 verified, recorded as F015. |
| `feature_catalog_code` | overlay | pass | 4, 6 | Leaves describe CLI invocations; the retained MCP-named directories are a written preserve decision. |
| `playbook_capability` | overlay | pass | 3, 6 | Procedures cite live CLI invocations; appended run records keep their pre-rewrite quotes as documented. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission/ (packet docs) + parent map + phases 007/008 | D3 | 5, 6 | 1 P1, 2 P2 | complete |
| .opencode/commands/doctor/ (route, script, install/debug assets) | D1, D3 | 1, 6 | 2 P1, 1 P2 | complete |
| .opencode/skills/system-spec-kit/ (ARCHITECTURE.md, ENV-REFERENCE.md, references/cli/daemon-cli-reference.md, runtime/hooks/claude/) | D3, D4 | 3, 5, 6 (shim verified clean) | 3 P1 | complete |
| .opencode/bin/ (skill-advisor.cjs, system-skill-advisor-launcher.cjs, README.md) | D1, D2, D4 | 2, 4, 6 | 2 P1 | complete |
| .opencode/skills/system-skill-advisor/ (runtime code, hooks, docs, catalog, playbook, tests) | D1, D4 | 4, 6 | 1 P1, 3 P2 | complete |
| .pi/ (SYNC.md, extensions/, mcp.json) | D3, D4 | 2, 6 | 1 P1 | complete |
| root README.md, .opencode/install-guides/README.md, .opencode/plugins/ | D2, D3, D4 | 2, 3, 4, 6 | 1 P2 | complete |
| runtime configs (opencode.json, .claude/mcp.json, .codex/config.toml, .cursor/mcp.json, .pi/mcp.json) | D1, D3 | 2, 6 | 0 | complete |
| runtime tests and retired-coverage evidence (git history) | D1, D3 | 4, 5 | 2 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 6
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-review-1789148343059-q7g4rk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Executor: cli-pi, deepseek-v4.1-flash, detached fan-out lineage (this process is the per-iteration executor)
- Write containment: this artifact directory only; no repository tooling that writes is executed
- Started: 2026-09-11T17:44:30Z
<!-- MACHINE-OWNED: END -->
