# Deep Review Strategy: 102 Track Re-review #2 (post-100/101 verdict-flip + cli-opencode smoke)

<!-- ANCHOR:review-charter -->
## Review Charter

**Review Target**: `track:skilled-agent-orchestration` — packets 093, 094, 095, 096, 098 (all 7 sub-phases), plus 100-099-remediation and 101-cli-opencode-executor
**Review Target Type**: track
**Review Dimensions**: correctness, security, traceability, maintainability
**Strategy**: arch (architectural / cross-phase, NOT line-by-line) — second verdict-flip confirmation focus
**Max Iterations**: 10
**Convergence Threshold**: 0.10
**Requested Executor**: cli-opencode (opencode-go/deepseek-v4-pro, --variant high, 900s timeout)
**Effective Executor**: native opus (@deep-review LEAF agent) — fallback per pre-flight smoke

### Pre-flight smoke result (cli-opencode + deepseek-v4-pro)

| Mode | Result | Evidence |
|------|--------|----------|
| Default plugins | **FAIL** | `Error from provider (DeepSeek): Invalid 'tools[23].function.name': string does not match pattern. Expected a string that matches the pattern '^[a-zA-Z0-9_-]+$'.` |
| `--pure` flag | PASS | Returns "CLI_SMOKE_OK" exactly |

YAML's `if_cli_opencode` branch in `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml`
does not pass `--pure`. The dispatch path as shipped is therefore broken when paired with
DeepSeek-family models. **This is itself a P1 finding for 101 to be surfaced in iter-1 narrative.**

### Hypothesis (verdict-flip)
099 closed with 0 P0, 13 P1, 6 P2 (verdict FAIL with `hasAdvisories=true`). 100-099-remediation
then shipped and claims 12 of 13 P1 are resolved (commits afd708fa6 + 0d7211c67); the 13th P1
(reducer extracts findings from delta records, P1-026) is also claimed resolved. Concurrently
101-cli-opencode-executor adds cli-opencode as the 5th deep-loop executor across 5 surfaces (P2-032 closed via 096/009 cleanup: prior strategy-doc claim that `aliases.ts` was a 101 surface was a category error caught in iter-1 as CROSS_REF_BROKEN):

- `executor-config.ts` — `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` + EXECUTOR_KINDS array
- `spec_kit_deep-research_auto.yaml` — `if_cli_opencode` dispatch branch
- `spec_kit_deep-research_confirm.yaml` — same
- `spec_kit_deep-review_auto.yaml` — same
- `spec_kit_deep-review_confirm.yaml` — same

This re-review confirms (a) verdict actually flips 099 FAIL → PASS this time, (b) 100 remediation
didn't introduce new defects (especially the reducer delta-extraction logic), (c) 101 executor
wiring landed cleanly across all 5 surfaces, and (d) cli-opencode dispatch is functional
end-to-end (smoke result is the headline finding).
<!-- /ANCHOR:review-charter -->

<!-- ANCHOR:scope-files -->
## Scope Files

- `.opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/` (phase parent + 7 sub-phases)
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md` (predecessor verdict)
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/005-remediation/` (NEW — phase parent + sub-phases)
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/006-cli-opencode-executor/` (NEW — executor wiring)
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` (101 surface)
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` (101 surface)
- `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` (101 surface)
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` (101 surface)
- `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` (101 surface)
- `.opencode/skills/deep-review/scripts/reduce-state.cjs` (100 surface — P1-026 fix)
- `.opencode/skills/sk-code-review/`, `.opencode/skills/sk-git/` (playbooks under review)

## Cross-Reference Targets

- **Core**: spec_code (099→100 closed-gate replay), checklist_evidence (101 wiring audit)
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
<!-- /ANCHOR:scope-files -->

<!-- ANCHOR:dimension-queue -->
## Dimension Queue (Risk-Priority Ordered)

1. **inventory** (iter 1) — closed-gate replay table for 099's 13 P1 + 6 P2; 101 executor wiring inventory; cli-opencode smoke result narrative
2. **correctness** (iter 2-3) — 100 reducer delta-extraction (P1-026); 101 executor-config (cli-opencode kind support)
3. **security** (iter 4) — workflow-resolved spec_folder authority + Stop hook gating + opencode --dangerously-skip-permissions semantics
4. **traceability** (iter 5-6) — diff 4 cli_opencode YAML branches for parity; advisor aliases coverage; 100 sub-phase canonicalization + cross-references
5. **maintainability** (iter 7) — doc anchors, dead refs in 100 + 101, executor descriptions across runtimes
6. **flexible re-pass** (iter 8-9) — least-covered dimension; adversarial re-verification on every P0/P1
7. **saturation** (iter 10) — promote STOP if all gates green
<!-- /ANCHOR:dimension-queue -->

<!-- ANCHOR:known-context -->
## Known Context

### Prior Review (099)
- Verdict: FAIL with `hasAdvisories=true`
- Active findings: P0=0, P1=13, P2=6
- Stop reason: `maxIterationsReached`
- Convergence score: 1.0
- Planning Packet emitted in 099 review-report.md §2

### Remediation (100)
- Phase parent shipped; commits afd708fa6 + 0d7211c67 (+ a35e292ab support work)
- Orchestrator claim: 12 of 13 P1 resolved including the reducer extracts-findings-from-delta-records fix at P1-026
- This re-review independently confirms or refutes that claim

### Executor wiring (101)
- 5th deep-loop executor (`cli-opencode`) added at commit e125ea341
- 5 surfaces touched: executor-config.ts, 4 deep-loop YAML files (P2-032 corrected: aliases.ts was not a 101 surface; iter-1 caught the prior claim as CROSS_REF_BROKEN)
- Pre-flight smoke detected DeepSeek MCP-tool-name regex rejection under default plugin loading
- This packet's run is the meta-test of 101 wiring; smoke result becomes headline finding

### resource-map status
resource-map.md not present at init; skipping coverage gate. Reducer will emit resource-map.md from
converged review deltas at synthesis time (default `config.resource_map.emit=true`).

### Memory continuity / prior session ID
This packet's continuity chain references session `deep-review-099-2026-05-07T1905` (predecessor) via
graph-metadata.json `manual.depends_on`. Within-packet session_dedup uses
`deep-review-102-2026-05-07T2055` with `parent_session_id: null` to satisfy SESSION_LINEAGE checks.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:iteration-log -->
## Iteration Log

| Iter | Focus | Dim | Status | New | P0/P1/P2 (running) | Ratio | Notes |
|------|-------|-----|--------|-----|--------------------|-------|-------|
| 1 | inventory | inventory | complete | 2 | 0/1/1 | 1.00 | 099→100 P1 sweep clean (13/13 RESOLVED); 101 wiring 1 LANDED_CLEAN + 4 DEFECT (--pure missing) + 1 CROSS_REF_BROKEN (aliases.ts). Surfaced P1-027 + P2-027. |
| 2 | correctness:100-reducer | correctness | complete | 0 | 0/1/1 | 0.00 | P1-026 fix VERDICT RESOLVED. Idempotency confirmed at 2 scales (102 + 099 packets, identical SHA-256 across 2 invocations each). 099 retroactive backfill produces 19 findings deterministically. Adversarial probes: fail-closed on JSON corruption, fail-silent on schema corruption. No new findings. |
| 3 | correctness:101-executor-config | correctness | complete | 2 | 0/2/2 | 0.50 | EXECUTOR_KINDS + EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] correctness verified via 5 in-process probes; serviceTier correctly rejected, no model whitelist confirmed intentional. Two new findings: P1-028 (sandboxMode wiring divergence — schema-supported but YAML hardcodes --dangerously-skip-permissions, ignoring user intent), P2-028 (zero unit-test coverage for cli-opencode in executor-config.vitest.ts). |
| 4 | security:dispatch-surface | security | complete | 3 | 0/3/4 | 0.50 | A=DEFECT (subsumed by P1-028), B=PASS (NODE_ENV gate confirmed at session-stop.ts:43-44 per 098/004), C=DEFECT (NEW P1-029 path traversal), D=PASS (shell `$(...)` does not re-evaluate prompt content), E=DEFECT (NEW P2-031 self-invocation guard convention-only). Plus NEW P2-029 (whitespace-only specFolder accepted). Out-of-scope insight: buildCopilotPromptArg referenced in YAML+README but no implementation in source — deferred to separate review of Copilot dispatch path. 6 in-process probes, 9 of 12 budget. |
| 5 | traceability:yaml-parity | traceability | complete | 2 | 0/3/5 | 0.10 | A=PASS (4 if_cli_opencode blocks byte-identical, 6 pair-diffs all empty), B=DEFECT (REFRAME P2-027 → P2-027r — actual defect is missing scoring lane entry not missing alias), C=PARTIAL (3 of 4 declared flags wired; sandboxMode subsumed by P1-028), D=PASS (self-invocation guard parity holds across all 4 YAMLs), E=PASS (cross-runtime mirror chain intact via multi-ai-council). NEW P2-032 (strategy doc surface-count drift). 0 new P0/P1. 9 of 12 budget. |
| 6 | traceability:cross-references | traceability | complete | 0 | 0/3/5 | 0.00 | A=PASS (100 is Level 2 root, 8-anchor canonical, is_phase_parent=false, no sub-phase children), B=PASS (validate.sh --strict on 099+100+101 all exit 0 with 11/11 checks), C=PASS (8 of 8 file:line refs in 100/implementation-summary.md resolve to existing files; ±14 line drift in reduce-state.cjs landmarks acceptable), D=PASS (memory_handback.md + shared_smart_router.md exist; check-smart-router PATHS PASS; 098/003 advisory closed), E=PASS (depends_on lineage intact across 100→099, 101→100, 102→9 ancestors), F=PASS (4-YAML if_cli_opencode parity re-confirmed). 0 new findings. Caller-overrode strategy "skip iter-6" decision. 9 of 13 budget. |

### What Worked (iter 1)
- Bulk read of 099 review-report + 100 implementation-summary in parallel anchored the entire replay table on file:line evidence
- Live grep + strict-validate spot-checks of 8 of 13 P1 fix sites (P1-015/016/018/019/020/021/022/024/025/026) all confirmed RESOLVED with deterministic exit-code or grep evidence
- Pre-flight smoke evidence captured at state.jsonl:2 by orchestrator gave the headline P1 finding without needing in-iter dispatch (LEAF-safe)
- Cross-checking strategy doc claims against live code (aliases.ts) caught a CROSS_REF_BROKEN that would have shipped silent

### What Worked (iter 2)
- SHA-256 idempotency proof on TWO packets (small + large scale) is conclusive evidence for reducer determinism — single experiment, definitive answer
- In-process Node adversarial probes via `parseJsonlDetailed`/`deltaRecordToFinding` exposed silent-drop behavior without polluting state (HEAD-only, write-safe)
- Retroactive 099 backfill (registry was empty pre-100, now reconstructs 19 findings) is direct evidence the fix works historically, not just for greenfield deltas
- Cross-referencing 100/implementation-summary.md:46 ("All 13 P1s: ... P1-026") against commit afd708fa65 message text against live code at `reduce-state.cjs:505-541` — three independent confirmations of the same fix

### What Failed (iter 1)
- P1-007, P1-017, P1-023 spot-checked at narrative level only (claim recorded in 100/implementation-summary.md but not adversarially verified at inventory granularity); deferred to iter 2-5

### What Failed (iter 2)
- None — clean iteration; budget under target (9 used, target 11-13)

### What Worked (iter 3)
- In-process Node adversarial probe (5 permutations) on parseExecutorConfig with cli-opencode kind exposed schema vs dispatch divergence at finding-quality precision without spawning any opencode subprocess — same approach as iter 2, productive again on a different surface
- Live `opencode run --help` capture confirmed `--variant <string>` is unconstrained at CLI layer — narrow provider-side concerns out-of-scope cleanly via REFEREE pass
- Cross-checking executor-config.ts:40 supported-flags entry against YAML branch line 787 hardcoded behavior caught a wiring divergence the comment at line 801 documents but the test suite never asserts

### What Failed (iter 3)
- None — clean iteration; budget at target (9 used, target 11-13)

### What Worked (iter 4)
- In-process Node adversarial probes (5 metacharacter variants + traversal + whitespace + empty + normal = 9 probes in single bash call) on `resolveArtifactRoot` exposed TWO defects (path traversal + whitespace-only acceptance) at finding-quality precision without any subprocess dispatch — same approach as iter 2-3, productive again on a third surface (this time security-angled rather than correctness-angled)
- Cross-checking the YAML's authority-guard claim at line 696-701 against the actual resolver source caught a partial-fix gap that the docstring at 200-214 falsely advertises as complete
- Direct grep for `NODE_ENV` across `mcp_server/` returned a single source file (`session-stop.ts`); reading lines 38-44 with the explicit "packet 097/P1-006 + 098/004" code comment served as both finding evidence AND lineage anchor
- Full-codebase grep for `buildCopilotPromptArg` (single bash with find+xargs) decisively confirmed missing implementation as out-of-scope insight rather than tentative concern

### What Failed (iter 4)
- None — clean iteration; budget at target (9 used, target 9-12 scan profile)

### What Worked (iter 5)
- 4-way YAML pair-diff in single bash call (mktemp + awk extract + 6 diff invocations) gave conclusive parity evidence in one tool call — perfect-parity verdict directly from zero-output diffs
- Cross-checking strategy doc surface inventory (line 33) against 101 implementation-summary.md Files-Modified table caught a small narrative drift (claimed 6 surfaces, actual 5) before it propagated to the planning packet
- REFRAMING P2-027 mid-review rather than carrying the bad framing forward — aliases.ts category-error caught by reading file shape (command-canonical, not cli-* registry); fresh advisor scoring lane defect captured at the right precision
- In-process source-text inspection on advisor scorer worked when module-import failed due to TS-compile artifact dependency (text.js missing from source tree) — fallback to fs.readFileSync + line counting gave equivalent evidence with one fewer dependency

### What Failed (iter 5)
- Live in-process advisor probe via `import("...lanes/explicit.ts")` failed with text.js module-not-found — explicit.ts imports from `'../text.js'` which only exists in dist/. Did NOT escalate as a finding because the runtime path uses the built dist (this is a source-tree-only concern, not a defect). Fell back to source-text inspection successfully.

### What Worked (iter 6)
- Triple parallel `validate.sh --strict` invocation across 099+100+101 in single dispatch — 3 packets, 33 individual checks, all PASS in <5s wall-clock. Decisive batch evidence.
- Cross-trace file:line refs in 100/implementation-summary.md to live disk via `find -name "$basename"` per ref — exposed acceptable line-drift in reduce-state.cjs (±14) without forcing a finding (structural verifiability beats line-precision).
- Closed 098/003's "missing memory_handback.md / shared_smart_router.md" advisory with positive existence evidence + check-smart-router PATHS PASS — converts a known carry-forward concern into a confirmed-clean surface.
- Honored caller override of strategy "skip iter-6" decision; documented rationale in edge-cases section. Strategy was authored at end of iter-5 with rotation hypothesis; dispatcher had additional traceability scope to verify (cross-references), warranting the 2nd pass.

### What Failed (iter 6)
- Initial `if_cli_opencode` regex used 6-space indent; 4-YAML actual indent is 8-space. Returned 0 hits, false-alarm. Caught immediately by retry with looser pattern; no finding produced. Lesson: prefer count-by-token over indent-anchored grep when verifying parity.

### Exhausted Approaches (iter 1)
- None added; this was first-pass discovery

### Exhausted Approaches (iter 2)
- "P1-026 has hidden regression" — BLOCKED. Three independent verification surfaces (commit message, code read, idempotency proof) all confirm RESOLVED. Do not retry without new contradicting evidence.

### Exhausted Approaches (iter 3)
- "cli-opencode parseExecutorConfig has parser-side defects" — BLOCKED. 5 in-process probes (minimal, serviceTier-reject, reasoningEffort-flow, arbitrary-model, null-model) all returned expected behavior. Parser is correct; defects live at the schema↔YAML wiring boundary, not the parser itself. Re-investigate only with new contradicting evidence.
- "cli-opencode null-model is a P1 against 101" — BLOCKED. F2 proven shared-pattern with cli-claude-code (predates 101), out of declared 101-wiring scope. Do not re-flag against 101 lineage.
<!-- /ANCHOR:iteration-log -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

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
- P1 (Required): 2
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`--dir {repo_root}` substitution path-injection**: `{repo_root}` is workflow-engine-controlled (project root), not user-controlled. No injection surface at this anchor. Disposition: `ruled_out_at_security_granularity`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`--dir {repo_root}` substitution path-injection**: `{repo_root}` is workflow-engine-controlled (project root), not user-controlled. No injection surface at this anchor. Disposition: `ruled_out_at_security_granularity`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--dir {repo_root}` substitution path-injection**: `{repo_root}` is workflow-engine-controlled (project root), not user-controlled. No injection surface at this anchor. Disposition: `ruled_out_at_security_granularity`.

### **`buildCopilotPromptArg` missing implementation**: full-codebase grep (`find . -type f -name '*.ts' -o -name '*.js'` + xargs grep) returns ZERO hits for the function name in source code. The YAML imports it at line 690 from `executor-config.ts`, but `executor-config.ts` (170 lines, fully read) has no such export. README.md at line 64 documents it but no implementation. Disposition: `deferred_to_separate_review`. **Reasoning**: out of scope for the dispatch-surface focus on cli-opencode (A-E). The Copilot branch is a separate executor surface with its own claimed authority guard. If this finding is accurate, it would be P0/P1 against the Copilot dispatch path — recommend a dedicated iteration to verify the missing implementation before Copilot dispatch is exercised in production. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`buildCopilotPromptArg` missing implementation**: full-codebase grep (`find . -type f -name '*.ts' -o -name '*.js'` + xargs grep) returns ZERO hits for the function name in source code. The YAML imports it at line 690 from `executor-config.ts`, but `executor-config.ts` (170 lines, fully read) has no such export. README.md at line 64 documents it but no implementation. Disposition: `deferred_to_separate_review`. **Reasoning**: out of scope for the dispatch-surface focus on cli-opencode (A-E). The Copilot branch is a separate executor surface with its own claimed authority guard. If this finding is accurate, it would be P0/P1 against the Copilot dispatch path — recommend a dedicated iteration to verify the missing implementation before Copilot dispatch is exercised in production.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`buildCopilotPromptArg` missing implementation**: full-codebase grep (`find . -type f -name '*.ts' -o -name '*.js'` + xargs grep) returns ZERO hits for the function name in source code. The YAML imports it at line 690 from `executor-config.ts`, but `executor-config.ts` (170 lines, fully read) has no such export. README.md at line 64 documents it but no implementation. Disposition: `deferred_to_separate_review`. **Reasoning**: out of scope for the dispatch-surface focus on cli-opencode (A-E). The Copilot branch is a separate executor surface with its own claimed authority guard. If this finding is accurate, it would be P0/P1 against the Copilot dispatch path — recommend a dedicated iteration to verify the missing implementation before Copilot dispatch is exercised in production.

### **Claim**: "cli-opencode missing from aliases.ts is a real gap" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: aliases.ts is a command-canonicalization table; no cli-* skill is registered there. Iter-1 P2-027 framing was a category error. REFRAMED as actual asymmetric advisor coverage defect (finding 1 above). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Claim**: "cli-opencode missing from aliases.ts is a real gap" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: aliases.ts is a command-canonicalization table; no cli-* skill is registered there. Iter-1 P2-027 framing was a category error. REFRAMED as actual asymmetric advisor coverage defect (finding 1 above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claim**: "cli-opencode missing from aliases.ts is a real gap" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: aliases.ts is a command-canonicalization table; no cli-* skill is registered there. Iter-1 P2-027 framing was a category error. REFRAMED as actual asymmetric advisor coverage defect (finding 1 above).

### **Claim**: "cli-opencode needs cross-runtime mirror tooling like cli-codex/cli-claude-code" → **Disposition**: ruled_out_by_design. **Note**: cli-opencode IS the OpenCode dispatcher; the calling AI is always external (Claude/Codex/Gemini/raw shell). The skill itself is the single source. multi-ai-council agent mirrors are the only intentional cross-runtime references and they are intact. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Claim**: "cli-opencode needs cross-runtime mirror tooling like cli-codex/cli-claude-code" → **Disposition**: ruled_out_by_design. **Note**: cli-opencode IS the OpenCode dispatcher; the calling AI is always external (Claude/Codex/Gemini/raw shell). The skill itself is the single source. multi-ai-council agent mirrors are the only intentional cross-runtime references and they are intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claim**: "cli-opencode needs cross-runtime mirror tooling like cli-codex/cli-claude-code" → **Disposition**: ruled_out_by_design. **Note**: cli-opencode IS the OpenCode dispatcher; the calling AI is always external (Claude/Codex/Gemini/raw shell). The skill itself is the single source. multi-ai-council agent mirrors are the only intentional cross-runtime references and they are intact.

### **Claim**: "if_cli_opencode YAML branches drift between research vs review or auto vs confirm" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: 6 pair-diffs all return zero output; blocks are byte-identical. P1-027 (--pure missing) and P1-028 (sandboxMode unused) apply uniformly across all 4 branches as cross-consumer findings, not per-branch drifts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Claim**: "if_cli_opencode YAML branches drift between research vs review or auto vs confirm" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: 6 pair-diffs all return zero output; blocks are byte-identical. P1-027 (--pure missing) and P1-028 (sandboxMode unused) apply uniformly across all 4 branches as cross-consumer findings, not per-branch drifts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claim**: "if_cli_opencode YAML branches drift between research vs review or auto vs confirm" → **Disposition**: ruled_out_at_traceability_granularity. **Note**: 6 pair-diffs all return zero output; blocks are byte-identical. P1-027 (--pure missing) and P1-028 (sandboxMode unused) apply uniformly across all 4 branches as cross-consumer findings, not per-branch drifts.

### **Claim**: "Self-invocation guard at YAML level should be runtime-enforced not convention" → **Disposition**: subsumed_by_P2_031. **Note**: Already captured in iter-4 as P2-031 (cross-consumer cross-runtime). Not re-flagged. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Claim**: "Self-invocation guard at YAML level should be runtime-enforced not convention" → **Disposition**: subsumed_by_P2_031. **Note**: Already captured in iter-4 as P2-031 (cross-consumer cross-runtime). Not re-flagged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claim**: "Self-invocation guard at YAML level should be runtime-enforced not convention" → **Disposition**: subsumed_by_P2_031. **Note**: Already captured in iter-4 as P2-031 (cross-consumer cross-runtime). Not re-flagged.

### **Claim**: "Whole `if_cli_opencode` block missing from one of the 4 YAMLs" → **Disposition**: ruled_out. **Note**: All 4 branches present at lines 717/649/781/758 with identical structure (verified via grep for "if_cli_opencode:" header; 4/4 hits). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Claim**: "Whole `if_cli_opencode` block missing from one of the 4 YAMLs" → **Disposition**: ruled_out. **Note**: All 4 branches present at lines 717/649/781/758 with identical structure (verified via grep for "if_cli_opencode:" header; 4/4 hits).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claim**: "Whole `if_cli_opencode` block missing from one of the 4 YAMLs" → **Disposition**: ruled_out. **Note**: All 4 branches present at lines 717/649/781/758 with identical structure (verified via grep for "if_cli_opencode:" header; 4/4 hits).

### **F2: cli-opencode accepts null model** — out of declared 101-wiring scope; this is a shared cli-claude-code/cli-opencode pattern that predates the verdict-flip targets. Disposition: `deferred_to_separate_review`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **F2: cli-opencode accepts null model** — out of declared 101-wiring scope; this is a shared cli-claude-code/cli-opencode pattern that predates the verdict-flip targets. Disposition: `deferred_to_separate_review`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F2: cli-opencode accepts null model** — out of declared 101-wiring scope; this is a shared cli-claude-code/cli-opencode pattern that predates the verdict-flip targets. Disposition: `deferred_to_separate_review`.

### **F3: `--variant xhigh` could be silently rejected by DeepSeek provider** — provider-side concern, not 101 executor-config concern. parseExecutorConfig correctly enforces the `REASONING_EFFORTS` enum. Disposition: `out_of_scope`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **F3: `--variant xhigh` could be silently rejected by DeepSeek provider** — provider-side concern, not 101 executor-config concern. parseExecutorConfig correctly enforces the `REASONING_EFFORTS` enum. Disposition: `out_of_scope`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F3: `--variant xhigh` could be silently rejected by DeepSeek provider** — provider-side concern, not 101 executor-config concern. parseExecutorConfig correctly enforces the `REASONING_EFFORTS` enum. Disposition: `out_of_scope`.

### **F5: missing `resolveOpencodeSandboxMode` helper** — consistent with F4 finding (sandboxMode is dead config for cli-opencode). Resolution depends on F1 fix direction. Disposition: `subsumed_by_P1_028`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **F5: missing `resolveOpencodeSandboxMode` helper** — consistent with F4 finding (sandboxMode is dead config for cli-opencode). Resolution depends on F1 fix direction. Disposition: `subsumed_by_P1_028`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F5: missing `resolveOpencodeSandboxMode` helper** — consistent with F4 finding (sandboxMode is dead config for cli-opencode). Resolution depends on F1 fix direction. Disposition: `subsumed_by_P1_028`.

### **New P0/P1 from dormant Copilot authority helper** — ruled out for this pass. The helper appears absent, but `cli-copilot` is not accepted by `parseExecutorConfig`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **New P0/P1 from dormant Copilot authority helper** — ruled out for this pass. The helper appears absent, but `cli-copilot` is not accepted by `parseExecutorConfig`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **New P0/P1 from dormant Copilot authority helper** — ruled out for this pass. The helper appears absent, but `cli-copilot` is not accepted by `parseExecutorConfig`.

### **P1-027 alternative fix via removing `--dangerously-skip-permissions`** — ruled out. That flag controls permission approval, not plugin tool-name emission. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **P1-027 alternative fix via removing `--dangerously-skip-permissions`** — ruled out. That flag controls permission approval, not plugin tool-name emission.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-027 alternative fix via removing `--dangerously-skip-permissions`** — ruled out. That flag controls permission approval, not plugin tool-name emission.

### **P1-027 downgrade to P2** — ruled out. The defect blocks the configured default DeepSeek-family cli-opencode dispatch path. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **P1-027 downgrade to P2** — ruled out. The defect blocks the configured default DeepSeek-family cli-opencode dispatch path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-027 downgrade to P2** — ruled out. The defect blocks the configured default DeepSeek-family cli-opencode dispatch path.

### **P1-028 downgrade to doc-only P2** — ruled out. `EXECUTOR_KIND_FLAG_SUPPORT` plus parser validation make `sandboxMode` a runtime contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **P1-028 downgrade to doc-only P2** — ruled out. `EXECUTOR_KIND_FLAG_SUPPORT` plus parser validation make `sandboxMode` a runtime contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P1-028 downgrade to doc-only P2** — ruled out. `EXECUTOR_KIND_FLAG_SUPPORT` plus parser validation make `sandboxMode` a runtime contract.

### **Prompt-injection from reviewed file content escaping the shell**: `$(cat 'X')` does not re-evaluate file contents at the shell layer. Tool-boundary escape inside the spawned opencode process is a separate concern (Anthropic / opencode runtime), not a 101-wiring-layer defect. Disposition: `out_of_scope_for_dispatch_layer`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Prompt-injection from reviewed file content escaping the shell**: `$(cat 'X')` does not re-evaluate file contents at the shell layer. Tool-boundary escape inside the spawned opencode process is a separate concern (Anthropic / opencode runtime), not a 101-wiring-layer defect. Disposition: `out_of_scope_for_dispatch_layer`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prompt-injection from reviewed file content escaping the shell**: `$(cat 'X')` does not re-evaluate file contents at the shell layer. Tool-boundary escape inside the spawned opencode process is a separate concern (Anthropic / opencode runtime), not a 101-wiring-layer defect. Disposition: `out_of_scope_for_dispatch_layer`.

### **Stop hook env override gating could be bypassed**: confirmed `NODE_ENV === 'test' || SPECKIT_TEST === 'true'` is the only path that honors `SPECKIT_GENERATE_CONTEXT_SCRIPT`. Production env ignores this var. Disposition: `ruled_out_at_security_granularity`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Stop hook env override gating could be bypassed**: confirmed `NODE_ENV === 'test' || SPECKIT_TEST === 'true'` is the only path that honors `SPECKIT_GENERATE_CONTEXT_SCRIPT`. Production env ignores this var. Disposition: `ruled_out_at_security_granularity`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stop hook env override gating could be bypassed**: confirmed `NODE_ENV === 'test' || SPECKIT_TEST === 'true'` is the only path that honors `SPECKIT_GENERATE_CONTEXT_SCRIPT`. Production env ignores this var. Disposition: `ruled_out_at_security_granularity`.

### **Stop hook production override** — ruled out. The override variable is ignored outside test mode. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Stop hook production override** — ruled out. The override variable is ignored outside test mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stop hook production override** — ruled out. The override variable is ignored outside test mode.

### **TypeScript compilation correctness** — verified indirectly via `node --experimental-strip-types` parse + execution; module loaded and all 5 probes ran without TypeScript errors. Disposition: `verified_implicitly`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **TypeScript compilation correctness** — verified indirectly via `node --experimental-strip-types` parse + execution; module loaded and all 5 probes ran without TypeScript errors. Disposition: `verified_implicitly`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **TypeScript compilation correctness** — verified indirectly via `node --experimental-strip-types` parse + execution; module loaded and all 5 probes ran without TypeScript errors. Disposition: `verified_implicitly`.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Recommend **STOP and synthesize**. coverage_age is now >=1, all dimensions are covered, the last three effective new-finding ratios are 0.00, 0.00, 0.00 after this pass, and no STOP-veto condition surfaced.

<!-- /ANCHOR:next-focus -->
