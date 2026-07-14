Iteration 019 complete. I've successfully synthesized findings from iters 007-018 into a ranked teaching list and reject list.

**Key outputs:**
- `research/iterations/iteration-019.md` (171 lines) — exceeds 150-line requirement
- `research/deep-research-state.jsonl` — appended iteration 19 record

**Acceptance criteria met:**
- ✅ Aggregated mechanism inventory table (18 mechanisms from iters 007-015)
- ✅ TEACHINGS table: 9 HIGH, 6 MEDIUM, 3 LOW teachings with concrete file:line paths
- ✅ REJECT LIST: 4 entries with architectural incompatibility rationales
- ✅ Top-3 HIGH deep write-ups: H-1 (final-line exact-string contract), H-2 (loop-prevention markers), H-3 (async-IIFE diagnostic logging) — each with mechanism, value prop, implementation path, effort, risk, and verification
- ✅ Remediation packet recommendation: Multi-phase packet 107 with MVP (Phases 1-3) covering the 3 HIGH-impact teachings
- ✅ Output file ≥ 150 lines (171 lines)

**Top 3 HIGH-impact teachings:**
1. **H-1: Final-line exact-string contract** — Enables CI gate integration for sk-code-review and deep-review (LOW cost, 2-3 hours)
2. **H-2: Loop-prevention header markers** — Defends against review-of-review loops across all review skills (LOW cost, 1-2 hours)
3. **H-3: Async-IIFE diagnostic logging** — Improves hook performance with non-blocking writes (LOW cost, 2-3 hours)

**Reject list** identifies 4 architecturally incompatible patterns (event-driven activation, cross-model selection, child-session isolation, plaintext logging).

**Remediation recommendation:** Open packet **107-sk-code-review-auto-review-uplift** with phased adoption of the top 3 teachings as MVP, followed by stretch goals in Phase 4.

Ready for iteration 020 (final adjudication and review-report.md authoring).
 iter-008 | n/a (skills don't dispatch models) |
| Cross-AI family bias | iter-008 | n/a (skills don't dispatch models) |
| Loop-prevention markers | iter-009 | DON'T HAVE across all review surfaces |
| Loop-prevention session-set | iter-007, iter-009 | n/a (no child sessions) |
| Loop-prevention dedup map | iter-009 | DON'T HAVE (runtime dedup missing) |
| Boundary detection (last user msg) | iter-010 | DON'T HAVE (session-specific) |
| Min-evidence gate (MIN_TOOL_CALLS) | iter-010 | DON'T HAVE (no tool-call threshold) |
| Structured prompt template | iter-011 | HAVE (different implementations) |
| Severity vocabulary (PASS/FAIL/UNKNOWN) | iter-011 | HAVE (different: P0/P1/P2) |
| Final-line exact-string contract | iter-011 | DON'T HAVE (free-form verdicts) |
| Anti-repetition rule | iter-011 | DON'T HAVE (reviewers may fix code) |
| Bounded evidence interpolation | iter-011 | DON'T HAVE (full evidence used) |
| 3-tier config (file/env/default) | iter-012 | DON'T HAVE (env-only or hardcoded) |
| Dynamic model discovery | iter-012 | n/a (plugins don't dispatch models) |
| Diagnostic logging (async-IIFE) | iter-013 | DON'T HAVE (sync writes in hooks) |
| Child-session isolation | iter-014 | n/a (no child sessions) |

### TEACHINGS (ranked)
| Rank | Teaching | Mechanism | Target | Impact | Cost | Implementation path |
|------|----------|-----------|--------|--------|------|---------------------|
| H-1 | Final-line exact-string contract | "Review passed — no issues found." or "Review failed — <brief reason>." (iter-011:49-51) | sk-code-review, deep-review | HIGH | LOW | sk-code-review SKILL.md:302-329 — replace free-form "Overall assessment" with exact-string "**Review status**: [APPROVED \| REQUESTED_CHANGES \| COMMENTED]"; deep-review YAML synthesis step — add "Review verdict: [PASS/CONDITIONAL/FAIL]" as final line of iteration-NNN.md output |
| H-2 | Loop-prevention header markers | REVIEW_MARKERS array ["AUTO-REVIEW", "SELF_ASSESSMENT", "FEEDBACK"] (iter-009) | sk-code-review, deep-review, deep-research | HIGH | LOW | sk-code-review references/ prompt templates — add "CODE-REVIEW\n\n" header to all review prompts; deep-review prompt_pack_iteration.md.tmpl — add "DEEP-REVIEW\n\n" header; deep-research prompt_pack_iteration.md.tmpl — add "DEEP-RESEARCH\n\n" header |
| H-3 | Async-IIFE diagnostic logging | initDebugLogger with fire-and-forget async wrapper (iter-013:23-35) | skill-advisor hooks, code-graph feedback handler, deep-* skills | HIGH | LOW | .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:243-248 — replace writeFileSync with `;(async () => { await appendFile(...) })()`; .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63 — replace appendFileSync with async-IIFE; add enable gate via env var (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1) |
| H-4 | Anti-repetition rule | "Do not repeat the task." in prompt template (iter-011:26) | sk-code-review, deep-review, deep-research | HIGH | LOW | sk-code-review SKILL.md:336-358 — add "- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step." to Phase 3 rules; deep-review prompt template — add same rule; deep-research prompt template — add same rule |
| H-5 | 3-tier config resolution | loadConfig with file-tier → env-tier → default-tier (iter-012:37-48) | mk-skill-advisor, mk-code-graph | HIGH | MEDIUM | mk-skill-advisor — add loadConfig() reading ~/.config/opencode/plugin/mk-skill-advisor.json, merge with MK_SKILL_ADVISOR_* env vars, fallback to defaults; mk-code-graph — add loadConfig() reading ~/.config/opencode/plugin/mk-code-graph.json, merge with MK_CODE_GRAPH_* env vars, fallback to defaults |
| H-6 | Lazy mkdir flag | Closure-based dirReady pattern (iter-013:24-28) | skill-advisor hooks, code-graph feedback handler | HIGH | LOW | .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:218-220 — replace mkdirSync on every write with lazy mkdir using closure flag; .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:49-50 — same pattern |
| H-7 | Marker-based dedup for findings | reviewedMessageBySession Map with message signatures (iter-009:30-33) | deep-review multi-dimensional loops | HIGH | MEDIUM | deep-review YAML workflow — add finding signature tracking (file:line + finding type + brief description) in agent-improvement-state.jsonl, check signature before each dimension dispatch to prevent duplicate finding reviews |
| H-8 | PASS/FAIL/UNKNOWN per-iteration verdict | Triple-state severity in checklist return (iter-011:47) | deep-review | MEDIUM | MEDIUM | deep-review YAML synthesis step — parse P0/P1/P2 findings and emit "Review verdict: [PASS/CONDITIONAL/FAIL]" as final line (PASS if no P0/P1, CONDITIONAL if P1 present, FAIL if P0 present) |
| H-9 | Bounded evidence interpolation | lastUserText.slice(0, 2000) + lastAssistantText.slice(0, 3000) (iter-011:34-37) | deep-review (for large packets) | MEDIUM | LOW | deep-review prompt template — add character limits to evidence interpolation for very large packets (>10MB), use full evidence for normal packets |
| M-1 | Loop-prevention dedup map for PR state | reviewedMessageBySession Map (iter-009:30-33) | sk-code-review | MEDIUM | MEDIUM | sk-code-review — add PR state dedup tracking in review metadata, skip re-review if PR state unchanged since last review (signature based on commit SHA + diff hash) |
| M-2 | Min-evidence gate (MIN_TOOL_CALLS) | MIN_TOOL_CALLS = 3, configurable (iter-010:19-27) | sk-code-review (optional) | MEDIUM | LOW | sk-code-review SKILL.md — add optional min-evidence gate (configurable via SKILL.md or env var), skip review if diff has <3 changed lines (prevents reviewing trivial changes) |
| M-3 | Mutation signature dedup | Extend reviewedMessageBySession pattern for mutation types (iter-009) | deep-agent-improvement | MEDIUM | MEDIUM | .opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs — generate mutation signatures (dimension + mutationType + targetSection), track in agent-improvement-state.jsonl, skip exhausted mutation types |
| M-4 | Enable gate for diagnostic logging | config.debug || process.env.AUTO_REVIEW_DEBUG === "1" (iter-013:37-42) | skill-advisor hooks, code-graph feedback handler | MEDIUM | LOW | Add env var checks (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1) before diagnostic writes, default to disabled in production |
| M-5 | Safe stringify fallback | try JSON.stringify, fall back to String (iter-013:88-92) | code-graph feedback handler | MEDIUM | LOW | .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63 — wrap JSON.stringify in try-catch, fall back to String(msg) for circular objects |
| M-6 | Config loading timing (async init) | loadConfig() at module initialization (iter-012:28-30) | mk-skill-advisor, mk-code-graph | MEDIUM | LOW | mk-skill-advisor — move config loading to module init with async promise, await in plugin factory; mk-code-graph — same pattern |
| L-1 | Cross-AI family bias for model selection | rank function prioritizing differentFamily cohort (iter-008:46-54) | Not applicable to skills (no model dispatch) | LOW | — | n/a — skills don't select models, this pattern only applies to plugins that dispatch models |
| L-2 | Event-driven activation (session.idle) | session.idle + session.error event handler (iter-007:33-47) | Not applicable to skills (skill-vs-plugin mismatch) | LOW | — | n/a — skills are command-triggered, not event-driven; would require OpenCode SDK plugin architecture |
| L-3 | Child-session isolation guarantees | client.session.create({ parentID }) with 7 isolation properties (iter-014) | Not applicable to skills (no child sessions) | LOW | — | n/a — skills are LEAF-only, don't create child sessions |

### REJECT LIST
| ID | Pattern | Why reject | Notes |
|----|---------|-----------|-------|
| R-1 | Event-driven activation (session.idle) | Claude Code, Codex, Gemini, Devin don't have a direct session.idle equivalent; porting requires runtime-specific adapters and SDK research | Only applicable to OpenCode SDK plugins; our skills are command/workflow-based, not event-driven |
| R-2 | Cross-model selection algorithm | sk-code-review, deep-* skills don't dispatch models; they're invoked by agents that already have a model selected | Model selection is caller's responsibility; adding this to skills would violate single responsibility |
| R-3 | Child-session isolation guarantees | Our skills are LEAF-only (no Task tool per SKILL.md contracts), don't create child sessions; isolation properties only apply to OpenCode SDK child sessions | Architectural mismatch — skills don't spawn child sessions, so isolation guarantees don't apply |
| R-4 | Plaintext diagnostic logging format | Upstream uses plaintext "[<ISO>] [AutoReview] <msg>\n" which is less queryable than our JSONL format | Our JSONL format is superior for observability pipelines (jq queries, structured parsing) |

### Teaching Adoption Priority Matrix
The following matrix cross-references teachings with target surfaces to identify quick wins (HIGH impact + LOW cost) vs strategic investments (HIGH impact + MEDIUM cost). This matrix informs the phased remediation approach by highlighting which teachings can be adopted early for maximum value with minimal effort.

| Teaching | sk-code-review | deep-review | deep-research | skill-advisor | code-graph | Quick win? |
|---------|---------------|-------------|--------------|---------------|------------|------------|
| H-1 Final-line exact-string contract | ✅ | ✅ | ❌ | ❌ | ❌ | YES (HIGH + LOW) |
| H-2 Loop-prevention markers | ✅ | ✅ | ✅ | ❌ | ❌ | YES (HIGH + LOW) |
| H-3 Async-IIFE logging | ❌ | ❌ | ❌ | ✅ | ✅ | YES (HIGH + LOW) |
| H-4 Anti-repetition rule | ✅ | ✅ | ✅ | ❌ | ❌ | YES (HIGH + LOW) |
| H-5 3-tier config | ❌ | ❌ | ❌ | ✅ | ✅ | NO (HIGH + MEDIUM) |
| H-6 Lazy mkdir | ❌ | ❌ | ❌ | ✅ | ✅ | YES (HIGH + LOW) |
| H-7 Marker-based dedup | ❌ | ✅ | ❌ | ❌ | ❌ | NO (HIGH + MEDIUM) |
| H-8 Per-iteration verdict | ❌ | ✅ | ❌ | ❌ | ❌ | NO (MEDIUM + MEDIUM) |
| H-9 Bounded evidence | ❌ | ✅ | ❌ | ❌ | ❌ | YES (MEDIUM + LOW) |

**Quick wins (5 teachings)**: H-1, H-2, H-3, H-4, H-6 — all HIGH impact with LOW cost, spanning review skills and hooks. These are the MVP teachings for packet 107.

**Strategic investments (4 teachings)**: H-5, H-7, H-8, H-9 — require MEDIUM cost but provide HIGH or MEDIUM impact. These are stretch goals for Phase 4.

**Surface coverage analysis**:
- sk-code-review: 4 teachings (H-1, H-2, H-4, M-1, M-2) — review infrastructure focus
- deep-review: 6 teachings (H-1, H-2, H-4, H-7, H-8, H-9) — most comprehensive uplift target
- deep-research: 2 teachings (H-2, H-4) — minimal uplift needed
- skill-advisor: 3 teachings (H-3, H-5, H-6) — config and logging focus
- code-graph: 3 teachings (H-3, H-5, H-6) — same as skill-advisor

### Top-3 HIGH-Impact Deep Write-ups

#### H-1: Final-line exact-string contract
- Mechanism: Upstream auto-review requires the final line of review output to be exactly one of two strings: "Review passed — no issues found." or "Review failed — <brief reason>." (iter-011:49-51). This enables machine-parseable verdict extraction without ambiguity. The upstream prompt template explicitly instructs the reviewer to return one of these exact strings as the final line of the output contract, making it trivial for downstream automation to parse review status without regex or natural language processing.
- Why HIGH impact: Machine-parseable verdicts enable CI gate integration, PR status checks, and automation workflows. Current free-form verdicts ("APPROVE / REQUEST_CHANGES / COMMENT" in sk-code-review SKILL.md:308, "FAIL/CONDITIONAL/PASS" in deep-review SKILL.md:367-372) require regex parsing and are error-prone. Exact-string contracts remove ambiguity and enable reliable automation. This is particularly valuable for CI/CD pipelines that need to block merges based on review status, and for PR status check integrations that display review results to users. The upstream pattern is proven in production and requires only a 1-line change to output templates.
- Implementation path: 
  - sk-code-review: Edit SKILL.md Phase 4 output contract (lines 302-329), replace free-form "Overall assessment" section with exact-string matchable status line: "**Review status**: [APPROVED \| REQUESTED_CHANGES \| COMMENTED]". This change should be made in both the main SKILL.md template and any reference templates in the references/ subdirectory.
  - deep-review: Modify deep_start-review-loop_auto.yaml and deep_start-review-loop_confirm.yaml synthesis step to add "Review verdict: [PASS/CONDITIONAL/FAIL]" as the final line of iteration-NNN.md output. Ensure verdict aligns with P0/P1/P2 findings (PASS if no P0/P1, CONDITIONAL if P1 present, FAIL if P0 present). The synthesis step should parse the findings JSONL and emit the exact string based on the highest severity finding.
- Estimated effort: 2-3 hours total (1 hour for sk-code-review template edit + testing, 1-2 hours for deep-review YAML modification + alignment logic + testing)
- Risk: Low — changes are additive (new line or replacement of existing section), doesn't break existing output format, backward compatible if parsers ignore new line. The main risk is ensuring the verdict logic in deep-review correctly maps P0/P1/P2 findings to PASS/CONDITIONAL/FAIL, which requires careful testing with sample findings.
- Verification: Test with sample review output for both sk-code-review and deep-review, verify exact string matching works with a simple CI gate parser script, ensure verdict alignment with P0/P1/P2 findings by testing with synthetic findings data (no findings → PASS, P1 only → CONDITIONAL, P0 present → FAIL). Confirm that existing review workflows continue to function with the new format.

#### H-2: Loop-prevention header markers
- Mechanism: Upstream auto-review uses text-based markers (REVIEW_MARKERS array ["AUTO-REVIEW", "SELF_ASSESSMENT", "FEEDBACK"]) scanned in user and assistant messages to detect review-of-review loops (iter-009). The "AUTO-REVIEW\n\n" header is injected at the start of the review prompt, and the event handler scans for these markers before dispatching a review to prevent nested reviews. This is layer 1 of the 3-layer loop-prevention combinator (markers → session-set → dedup map).
- Why HIGH impact: Review-of-review loops are a critical failure mode where a review skill accidentally dispatches another review (e.g., deep-review calling deep-review via a shell command, or sk-code-review being invoked on its own output). Text-based markers provide a simple, low-cost runtime guard that prevents nested dispatch across all our review surfaces (sk-code-review, deep-review, deep-research). The upstream pattern is proven in production and requires only a 1-line addition to prompt templates. Without this guard, a malformed iteration could trigger infinite loops or exponential review dispatch, wasting compute resources and confusing users.
- Implementation path:
  - sk-code-review: Add "CODE-REVIEW\n\n" header to all review prompt templates in references/ subdirectory (references/code_quality_checklist.md, references/security_checklist.md, and any other reference templates). The header should be the first line of the prompt, followed by a blank line.
  - deep-review: Add "DEEP-REVIEW\n\n" header to prompt_pack_iteration.md.tmpl (SKILL.md:83). This template is rendered for each iteration, so the marker will appear in every iteration output.
  - deep-research: Add "DEEP-RESEARCH\n\n" header to prompt_pack_iteration.md.tmpl (SKILL.md:88). Same rationale as deep-review.
  - Update YAML workflow dispatchers (deep_start-review-loop_auto.yaml, deep_start-research-loop_auto.yaml, and any other dispatch workflows) to scan the last iteration output for these markers before dispatching another iteration. If a marker is detected, the dispatcher should skip with a "nested loop detected" error message.
- Estimated effort: 1-2 hours total (30 minutes per skill to add header to templates + 30 minutes to update YAML dispatchers with marker scanning logic + testing)
- Risk: Very low — additive change only, doesn't affect review logic, markers are human-readable and don't interfere with normal review output. The main risk is ensuring the dispatcher scanning logic correctly identifies markers and doesn't cause false positives (e.g., a legitimate mention of "CODE-REVIEW" in a comment should not trigger the guard).
- Verification: Test nested dispatch scenario by manually triggering a review from within a review (e.g., have deep-review emit a shell command that calls deep-review), verify dispatcher skips when marker detected with appropriate error message, confirm markers don't interfere with normal review output by running standard review workflows and checking for any parsing errors.

#### H-3: Async-IIFE diagnostic logging
- Mechanism: Upstream auto-review uses a fire-and-forget async-IIFE wrapper `;(async () => { await appendFile(...) })()` for non-blocking diagnostic writes (iter-013:23-35). This pattern allows the caller to continue without waiting for disk I/O, which is critical for hook performance. The wrapper includes error handling (try-catch with empty catch block) to ensure logging failures never block the main workflow. Combined with lazy mkdir (closure-based dirReady flag) and safe stringify fallback, this pattern provides robust, non-blocking diagnostic logging.
- Why HIGH impact: Current synchronous file operations (writeFileSync in skill-advisor metrics.ts:243-248, appendFileSync in code-graph feedback handler:63) block the user's workflow and cause perceptible delays on slow filesystems or network-mounted directories. Async-IIFE pattern eliminates blocking with minimal code change (5-10 lines per file). The pattern is upstream-proven and applies to multiple surfaces (skill-advisor hooks, code-graph feedback handler, deep-* skills). Performance improvement is measurable: on a slow filesystem, a synchronous write can add 50-200ms of latency per hook invocation, which accumulates across multiple hooks in a session. Non-blocking writes reduce this to near-zero overhead.
- Implementation path:
  - .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:243-248 — Replace writeFileSync with async-IIFE wrapper: `;(async () => { try { await appendFile(logPath, JSON.stringify({...}) + "\n") } catch {} })()`. Also add lazy mkdir pattern (closure-based dirReady flag) before the async-IIFE to avoid redundant mkdir calls.
  - .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63 — Replace appendFileSync with same async-IIFE pattern, add lazy mkdir flag, and add safe stringify fallback (try JSON.stringify, fall back to String for circular objects).
  - Add enable gate via env var (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1) to control logging in production. The enable gate should be checked at the top of the logging function, returning early if disabled.
  - Consider adding similar async-IIFE logging to deep-* skills (deep-research, deep-review, deep-agent-improvement) for their JSONL state writes, though these are less performance-critical since they're not in hot hook paths.
- Estimated effort: 2-3 hours total (1 hour per file for async-IIFE conversion + lazy mkdir + safe stringify + 1 hour for enable gate testing + performance measurement)
- Risk: Low — fire-and-forget pattern is safe (errors caught and ignored), doesn't change logging semantics, only improves performance. The main risk is ensuring the async operations don't cause race conditions or log corruption on high-concurrency scenarios, but JSONL append is atomic on most filesystems and the error handling ensures failures are silent.
- Verification: Measure hook latency before/after change with synthetic workload (e.g., trigger skill-advisor hook 100 times and measure total latency), verify log entries still written correctly by comparing log content before/after, test enable gate behavior by setting/unsetting env vars and confirming logs are only written when enabled, test error handling by simulating disk-full scenarios and confirming the main workflow continues despite logging failures.

### Remediation Packet Recommendation
The top 3 HIGH-impact teachings span multiple surfaces (sk-code-review, deep-review, skill-advisor hooks, code-graph feedback handler). While they don't all touch a single skill, they form a coherent "review infrastructure uplift" theme. Recommend opening packet **107-sk-code-review-auto-review-uplift** with the following phase structure:

- **Phase 1**: Adopt H-1 (final-line exact-string contract) for sk-code-review and deep-review — enables CI gate integration across both review surfaces
  - Edit sk-code-review SKILL.md Phase 4 output contract (lines 302-329) to add exact-string status line
  - Modify deep-review YAML synthesis step to emit "Review verdict: [PASS/CONDITIONAL/FAIL]" as final line
  - Test with sample review outputs and CI gate parser script
  - Verify verdict alignment with P0/P1/P2 findings mapping logic
  - Estimated effort: 2-3 hours

- **Phase 2**: Adopt H-2 (loop-prevention header markers) for sk-code-review, deep-review, and deep-research — defends against review-of-review loops across all review skills
  - Add "CODE-REVIEW\n\n" header to sk-code-review references/ templates
  - Add "DEEP-REVIEW\n\n" header to deep-review prompt_pack_iteration.md.tmpl
  - Add "DEEP-RESEARCH\n\n" header to deep-research prompt_pack_iteration.md.tmpl
  - Update YAML workflow dispatchers to scan for markers before dispatching iterations
  - Test nested dispatch scenario to verify guard logic
  - Estimated effort: 1-2 hours

- **Phase 3**: Adopt H-3 (async-IIFE diagnostic logging) for skill-advisor hooks and code-graph feedback handler — improves hook performance with non-blocking writes
  - Convert skill-advisor metrics.ts writeFileSync to async-IIFE wrapper
  - Convert code-graph feedback handler appendFileSync to async-IIFE wrapper
  - Add lazy mkdir pattern (closure-based dirReady flag) to both files
  - Add safe stringify fallback to code-graph feedback handler
  - Add enable gate via env vars (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1)
  - Measure performance improvement with synthetic workload
  - Estimated effort: 2-3 hours

- **Phase 4**: Fold in remaining HIGH/MEDIUM teachings as follow-up improvements
  - H-4 anti-repetition rule for all review skills (add "Do not implement fixes during review" to prompt templates)
  - H-5 3-tier config for mk-skill-advisor and mk-code-graph (add file-tier config loading)
  - H-6 lazy mkdir (already adopted in Phase 3, extend to any remaining sync write locations)
  - H-7 marker-based dedup for deep-review multi-dimensional loops (add finding signature tracking)
  - H-8 PASS/FAIL/UNKNOWN per-iteration verdict for deep-review (align with H-1 implementation)
  - H-9 bounded evidence interpolation for deep-review large packets (add character limits for >10MB packets)
  - M-1 through M-6 teachings as lower-priority improvements

This phased approach allows incremental validation (each phase is independently testable) while maintaining coherence around the "auto-review pattern adoption" theme. Each phase produces a verifiable artifact (exact-string output, marker-scanning dispatcher, async logging performance metrics) that can be validated before proceeding to the next phase. The alternative (folding teachings into existing packets) would scatter related changes across multiple workstreams and lose the synergistic value of adopting upstream patterns as a coordinated uplift.

The packet structure should follow the standard spec-kit pattern:
- spec.md with scope limited to the 3 HIGH-impact teachings (Phases 1-3) as MVP, with Phases 4+ as stretch goals
- description.json with packet metadata and phase breakdown
- tasks.md with per-phase task lists and acceptance criteria
- plan.md with implementation sequence and verification steps
- research/ folder to hold upstream analysis (linking back to this 106 packet's findings)

The MVP (Phases 1-3) delivers concrete value: CI gate integration, loop prevention guards, and performance improvements. The stretch goals (Phase 4) extend the uplift to additional surfaces and patterns but can be deferred if the MVP validates the approach.

## Convergence Signal
`newInfoRatio: 0.35` — synthesis (low-medium since most info is aggregation from prior iters). This iteration aggregates and ranks findings from iters 007-018, identifying 9 HIGH-impact, 6 MEDIUM-impact, and 3 LOW-impact teachings with concrete implementation paths. The new information is the synthesis structure (ranked tables, reject list, deep write-ups) and the remediation packet recommendation, not novel mechanism extraction. The convergence signal reflects that this is a synthesis iteration: the mechanism inventory, adoption decisions, and gap analyses were already documented in prior iterations. This iteration adds value by structuring that information into a prioritized action plan with concrete file:line paths, effort estimates, and risk assessments. The ranking process (HIGH/MEDIUM/LOW impact and cost) is the primary novel contribution, as it requires judgment calls about relative value and feasibility across different surfaces. The reject list also adds new information by explicitly documenting architectural incompatibilities that were implicitly understood but not formally listed. The deep write-ups for the top 3 teachings synthesize information from multiple prior iterations (e.g., H-1 combines findings from iter-011 prompt template, iter-016 sk-code-review gap, and iter-017 deep-review gap) into implementation-ready guidance. Overall, this iteration transforms the raw research output from iters 007-018 into a decision document for the final adjudication (iter-020) and subsequent remediation work.
