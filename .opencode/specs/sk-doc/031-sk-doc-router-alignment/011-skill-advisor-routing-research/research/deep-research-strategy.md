---
title: Deep Research Strategy - system-skill-advisor usefulness and routing integration
description: Session tracking for the skill-advisor routing research loop under sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research.
trigger_phrases:
  - "skill advisor routing research"
  - "advisor recommend confidence calibration"
  - "5-lane RRF fusion"
  - "shouldFireAdvisor gate drift"
  - "routing registry drift guard parity"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime instance for `.opencode/specs/sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research/research/`.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Establish how system-skill-advisor works today, how genuinely useful it is, and how it integrates into skill routing — then produce concrete, implementable improvements toward perfect routing (the correct skill is found easily and confidently, at the right moment). Grounded in the Tier-2 gpt-5.6-luna skill-benchmark finding that routing quality is strongly skill-specific and that the advisor is the front-line router that decides which skill fires.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: How does the advisor_recommend MCP path (advisor-server.ts, tools/index.ts) work end-to-end, and is its 5-lane RRF fusion confidence (derived / explicit / graph-causal / lexical / semantic-shadow lanes in lib/scorer/fusion.ts) well-calibrated, or does lane fusion saturate/mislead against the 0.05 ambiguity margin (lib/scorer/ambiguity.ts) and compat-contract thresholds (lib/compat/contract.ts) backing Gate 2 (≥0.8) and Gate 1 (≥0.70 / ≤0.35)?
- [ ] Q2: How does the Claude-side user-prompt-submit hook advisor brief (hooks/claude/user-prompt-submit.ts, lib/skill-advisor-brief.ts) work, and does its documented CLI fallback path hold up when the MCP/daemon transport is unhealthy?
- [ ] Q3: Do the hook's shouldFireAdvisor gate (lib/prompt-policy.ts) and the MCP tool's threshold resolution stay provably in sync — two independent call paths converging on the same compat-contract thresholds — or is there drift?
- [ ] Q4: How does routing-registry-drift-guard exercise parity against sk-doc's hub-router.json / mode-registry.json vocabulary, and does the advisor's vocabulary stay aligned with the hubs it routes to?
- [ ] Q5: What prioritized, implementable improvements to advisor usefulness, confidence calibration, transport resilience, and routing integration follow from the evidence?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Applying fixes in this session (deliverable is implementable findings, not implementation).
- Routing research for individual skills other than the advisor's integration surface (per-skill phases follow this FOUNDATION phase).
- Redesigning the skill-benchmark scorer itself (covered by the sibling 010-sk-doc-routing-research packet).
- Modifying any investigated file — researched paths are read-only for this loop.

---

## 5. STOP CONDITIONS
- stop_policy=max-iterations: convergence is telemetry only; the loop runs until maxIterations (10) unless paused or 3+ consecutive errors force partial synthesis.
- Findings must be implementable: each recommendation names the file(s) and the concrete change before the loop may claim the deliverable is met.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Following configuration values from their owning resolver into both consumers exposed the actual shared boundary. (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Searching for the hook beneath `mcp_server/hooks` failed because the canonical skill hook is a sibling of `mcp_server`. (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A single matrix asserting call-specific threshold overrides through the Claude hook entrypoint. The hook does not expose that input, so such a test would encode a nonexistent contract rather than parity. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A single matrix asserting call-specific threshold overrides through the Claude hook entrypoint. The hook does not expose that input, so such a test would encode a nonexistent contract rather than parity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single matrix asserting call-specific threshold overrides through the Claude hook entrypoint. The hook does not expose that input, so such a test would encode a nonexistent contract rather than parity.

### Spec Memory trigger lookup was cancelled/unavailable. It supplied no research evidence; repository sources remained sufficient for the iteration focus. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Spec Memory trigger lookup was cancelled/unavailable. It supplied no research evidence; repository sources remained sufficient for the iteration focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Spec Memory trigger lookup was cancelled/unavailable. It supplied no research evidence; repository sources remained sufficient for the iteration focus.

### The first parent checker invocation used a repo-relative path even though the checker resolves from `.opencode/`; it was an invocation error, not a product failure. Re-running with `skills/sk-doc` passed with zero warnings. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The first parent checker invocation used a repo-relative path even though the checker resolves from `.opencode/`; it was an invocation error, not a product failure. Re-running with `skills/sk-doc` passed with zero warnings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first parent checker invocation used a repo-relative path even though the checker resolves from `.opencode/`; it was an invocation error, not a product failure. Re-running with `skills/sk-doc` passed with zero warnings.

### Treating `shouldFireAdvisor` prompt eligibility as a duplicate or drifting copy of the confidence/uncertainty acceptance gate. The code separates these stages and their configuration domains. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `shouldFireAdvisor` prompt eligibility as a duplicate or drifting copy of the confidence/uncertainty acceptance gate. The code separates these stages and their configuration domains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `shouldFireAdvisor` prompt eligibility as a duplicate or drifting copy of the confidence/uncertainty acceptance gate. The code separates these stages and their configuration domains.

### Treating a green `routing-registry-drift-guard` result as sk-doc coverage was ruled out; its source path is hard-wired to system-deep-loop. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating a green `routing-registry-drift-guard` result as sk-doc coverage was ruled out; its source path is hard-wired to system-deep-loop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a green `routing-registry-drift-guard` result as sk-doc coverage was ruled out; its source path is hard-wired to system-deep-loop.

### Treating exact graph-metadata alias coverage as routing recall was ruled out; the advisor uses multiple weighted fields and semantic/derived lanes, while the hub uses the richer alias vocabulary only after discovery. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating exact graph-metadata alias coverage as routing recall was ruled out; the advisor uses multiple weighted fields and semantic/derived lanes, while the hub uses the richer alias vocabulary only after discovery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating exact graph-metadata alias coverage as routing recall was ruled out; the advisor uses multiple weighted fields and semantic/derived lanes, while the hub uses the richer alias vocabulary only after discovery.

### Treating the existing runtime-parity file as end-to-end coverage; it does not cross the MCP dispatcher or Claude hook entrypoint. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the existing runtime-parity file as end-to-end coverage; it does not cross the MCP dispatcher or Claude hook entrypoint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the existing runtime-parity file as end-to-end coverage; it does not cross the MCP dispatcher or Claude hook entrypoint.

### Treating the public confidence as the RRF score was ruled out: the scorer computes it through a separate calibrated policy function. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the public confidence as the RRF score was ruled out: the scorer computes it through a separate calibrated policy function.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the public confidence as the RRF score was ruled out: the scorer computes it through a separate calibrated policy function.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Spec Memory trigger lookup was cancelled/unavailable. It supplied no research evidence; repository sources remained sufficient for the iteration focus. (iteration 1)
- Treating the public confidence as the RRF score was ruled out: the scorer computes it through a separate calibrated policy function. (iteration 1)
- The first parent checker invocation used a repo-relative path even though the checker resolves from `.opencode/`; it was an invocation error, not a product failure. Re-running with `skills/sk-doc` passed with zero warnings. (iteration 2)
- Treating a green `routing-registry-drift-guard` result as sk-doc coverage was ruled out; its source path is hard-wired to system-deep-loop. (iteration 2)
- Treating exact graph-metadata alias coverage as routing recall was ruled out; the advisor uses multiple weighted fields and semantic/derived lanes, while the hub uses the richer alias vocabulary only after discovery. (iteration 2)
- Treating `shouldFireAdvisor` prompt eligibility as a duplicate or drifting copy of the confidence/uncertainty acceptance gate. The code separates these stages and their configuration domains. (iteration 4)
- A single matrix asserting call-specific threshold overrides through the Claude hook entrypoint. The hook does not expose that input, so such a test would encode a nonexistent contract rather than parity. (iteration 5)
- Treating the existing runtime-parity file as end-to-end coverage; it does not cross the MCP dispatcher or Claude hook entrypoint. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q3: Are hook gating and MCP threshold resolution provably synchronized across environment and call-specific overrides? (iteration 1)
- Q2: How does the Claude prompt-submit hook brief behave when MCP or daemon transport is unhealthy? (iteration 1)
- Q5: Which improvements have the highest correctness and resilience payoff? (iteration 1)
- Q1: What exact normalization and reciprocal-rank constant does the shared RRF helper apply, and how do fused scores, confidence floors, ambiguity clusters, and correctness relate on the held-out scorer corpus? (iteration 1)
- Q4: Does the advisor vocabulary remain aligned with hub-router and mode-registry vocabulary? (iteration 1)
- Q3: Prove hook gating and MCP threshold synchronization across environment and call-specific overrides. (iteration 2)
- Q5: Consolidate and rank improvements after the transport and threshold evidence is complete. (iteration 2)
- Q1: Quantify RRF normalization, confidence-floor saturation, ambiguity clusters, and held-out correctness. (iteration 2)
- Q2: Trace hook brief behavior and CLI fallback under unhealthy transport. (iteration 2)
- Q5 remains: rank the timing-reservation, end-to-end coverage, diagnostic taxonomy, output-contract reconciliation, and documentation-path fixes against calibration improvements from later iterations. (iteration 3)
- Q3 remains: prove threshold and prompt-policy synchronization across environment and call-specific overrides. The Q2 trace shows threshold forwarding on the CLI path, but not full cross-path parity. (iteration 3)
- Q5 remains: prioritize implementation changes, including an explicit cross-surface parity matrix for defaults, valid/invalid environment overrides, and call-specific overrides. (iteration 4)
- Q1 remains: quantify RRF normalization, confidence-floor saturation, ambiguity clusters, and held-out correctness. (iteration 4)
- The test inventory should be strengthened with one named end-to-end parity suite even though the targeted existing tests passed in this run. (iteration 4)
- Whether the existing `runtime-parity.vitest.ts` should be renamed/fixed or absorbed into the new suite is an implementation decision; the research evidence supports either, provided the duplicate runtime label is removed. (iteration 5)
- Q5 remains: rank this suite against transport-budget reservation, diagnostic taxonomy, output-contract reconciliation, vocabulary coverage, and calibration changes. (iteration 5)
- Q1 remains: after baseline freshness is repaired, quantify exact RRF normalization, `0.82` floor frequency, ambiguity-cluster composition, uncertainty bands, and held-out correctness in one joined report. (iteration 6)
- The final numeric calibration proposal remains intentionally open until that report exists. (iteration 6)
- Floor frequency, ambiguity composition, uncertainty bands, and held-out correctness remain open. (iteration 7)
- The final numeric proposal remains open. (iteration 7)
- The joined evaluator should add calibration error or reliability bins; accuracy and floor frequency establish miscalibration risk but do not estimate probability calibration directly. (iteration 8)
- Does the shadow `0.80` floor candidate preserve the three gates when implemented in a separate, authorized change packet? (iteration 8)
- Why can result-level ambiguity remain true while the leading executor recommendation has no `ambiguousWith` attribution? (iteration 8)
- Should an authoritative executor alias suppress fusion ambiguity, or should it expose the displaced fusion candidate in a final `ambiguousWith` cluster? Current comments imply suppression, but this needs an explicit contract. (iteration 9)
- The shadow `0.80` task-intent floor experiment and probability-calibration bins remain separate follow-up work. (iteration 9)
- How many frozen executor-delegation cases take the injection path versus the existing-candidate path? (iteration 9)
- Replace the obsolete Codex abstain example with a currently retired executor identity, if one remains part of the supported metadata contract. (iteration 10)
- Add one deliberately constructed existing-candidate fixture and determine whether a natural production prompt can reach it without a seeded projection. (iteration 10)
- Run the separate shadow `0.80` task-intent floor experiment with reliability bins in an authorized implementation packet. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Run the separate shadow `0.80` task-intent floor experiment with reliability bins in an authorized implementation packet.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior memory context: None loaded — Spec Kit Memory daemon transport timed out (exit 75, warm-only read at init); continuing with file evidence only.

### Bounded Context Snapshot

- Source pointers (topic-declared, verify actual paths in iteration 1):
  - `.opencode/skills/system-skill-advisor/mcp_server/` — advisor MCP server (advisor-server.ts, tools/index.ts, lib/scorer/fusion.ts, lib/scorer/ambiguity.ts, lib/compat/contract.ts, lib/prompt-policy.ts, lib/skill-advisor-brief.ts)
  - `hooks/claude/user-prompt-submit.ts` — Claude-side advisor brief hook
  - `routing-registry-drift-guard` — parity checks against sk-doc `hub-router.json` / `mode-registry.json`
  - `.opencode/bin/skill-advisor.cjs` — daemon-backed CLI fallback transport
- Grounding benchmark: Tier-2 gpt-5.6-luna skill-benchmark — routing quality is strongly skill-specific; sk-doc scored 20/100 with ~19% exact-resource recall (see sibling packet `010-sk-doc-routing-research`).
- Related packet: `.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/` (parallel FOUNDATION phase on sk-doc hub routing).
- Governance anchors: CLAUDE.md Gate 2 (advisor confidence ≥0.8 must-invoke) and Gate 1 (dual-threshold ≥0.70 confidence / ≤0.35 uncertainty).
- Constraints and risks: researched files are read-only; memory daemon currently unhealthy (evidence for Q2 transport-resilience angle); findings must be implementable.

- resource-map.md not present; skipping coverage gate

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stop_policy=max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability_matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-16T05:47:04.335Z
