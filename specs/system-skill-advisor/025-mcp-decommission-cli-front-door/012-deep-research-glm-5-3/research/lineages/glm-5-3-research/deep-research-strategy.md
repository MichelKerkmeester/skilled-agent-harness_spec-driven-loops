---
title: Deep Research Strategy - glm-5-3-research lineage
description: Session tracking for the detached fan-out lineage studying what the skill advisor's MCP-transport decommission teaches. Initialized from the dispatch charter; machine-owned sections refreshed by this lineage at each iteration end.
trigger_phrases:
  - "deep research strategy"
  - "glm-5-3-research"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - glm-5-3-research

Persistent research plan for this lineage. Read before every iteration; the iteration's evidence lands in `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl`, and the machine-owned sections below are refreshed afterward by this lineage (see Lineage Execution Note).

## 1. OVERVIEW

### Usage

- **Init:** this lineage (session `fanout-glm-5-3-research-1789192876106-xyzuzo`) authored this file from the dispatch charter and packet documents.
- **Per iteration:** one focus from Next Focus; research inline; write iteration + delta; record the state event through the append gateway; then refresh Sections 3, 6, 7-11A.
- **Mutability:** analyst-owned sections (1, 2, 4, 5, 12, 13) stable; machine-owned sections rewritten after each iteration.

### Lineage Execution Note

This lineage runs its iterations INLINE in the dispatching session (the workflow's executor-dispatch steps are satisfied by that session; no nested CLI/agent dispatch). Consequently the reducer's duties (Sections 3, 6, 7-11A, findings-registry.json, dashboard) are performed by this same session at each iteration's end, and every refresh mirrors a record in that iteration's delta file. This is a documented deviation from the prompt-pack's "reducer-owned files are read-only"Leaf-agent constraint, which presupposes a separate reducer process; the runner bounds all writes to this directory either way.

---

## 2. TOPIC

What the skill advisor's MCP-transport decommission teaches, as a lessons study rather than a defect hunt. Case study: the eight-phase packet specs/system-skill-advisor/025-mcp-decommission-cli-front-door, which removed the advisor's MCP transport and made the daemon-backed CLI at .opencode/bin/skill-advisor.cjs the single front door. Shipped: five runtime server declarations deleted, the MCP SDK removed, the plugin bridge deleted, the daemon wire replaced with the advisor's own newline-delimited protocol, the directory renamed mcp-server to runtime, environment handling rehomed to the launcher, roughly 190 documents rewritten, 26 bridge tests retired and 7 contract tests inverted. Phase 009 already ran the defect hunt and closed nine required findings, so do not repeat it. Answer three questions. FIRST, which failures were latent while the CLI was only a fallback and surfaced solely because it became the primary path; name each at its file and give the mechanism that kept it hidden. SECOND, what classes of residue a transport removal leaves behind beyond obvious name references; ground each class in something actually present in this packet and say which class the existing sweep would have missed. THIRD, what a repeatable checklist for the next transport-to-CLI migration would contain, ordered so the steps preventing the most expensive failures come first. BINDING RULES: ground every claim in a file, or a command with its output, or a packet document, and label anything you cannot cite as a hypothesis; a green test proves nothing until its output and exit status are read; historical records such as changelogs, dated benchmark reports and frozen fixtures legitimately keep old names while live instruction surfaces must not, so say which bucket each hit falls in; write only inside your bound lineage directory, because editing a packet document while the loop is live is reverted by write containment and this packet has already lost work that way twice; do not read the research output under sibling phases 010 or 011, because an independent third reading is the point and agreement only counts if you did not look.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] KQ1: Which failures were latent while the CLI was only a fallback and surfaced solely because it became the primary path - at which file, and by what mechanism did the fallback era keep each hidden? (answered, iteration 1 — see §6)
- [x] KQ2: What classes of residue does this transport removal exhibit beyond obvious "MCP" name references, grounded in artifacts actually present in this packet - and which of those classes would the existing residue sweep have missed? (answered, iteration 2 — see §6)
- [x] KQ3: What does a repeatable checklist for the next transport-to-CLI migration contain, ordered so the steps preventing the most expensive failures come first, with each step's cost-justification grounded in this packet? (answered, iteration 3 — see §6)
- [x] KQ4: Applied back to this packet's own debris, does the resulting checklist actually catch the latent failures and residue classes found - and what does it still miss? (answered, iteration 4 — see §6)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- NOT a defect hunt: 009 already ran it and closed nine required findings; this study extracts lessons, it does not re-derive those findings.
- No implementation: findings and recommendations only; nothing outside this lineage directory is written, and no packet document is edited while the loop is live (write containment).
- No dependency on siblings' conclusions: the research output under 010 and 011 stays unread so this third reading stays independent; agreement only counts if it was not looked at.
- No routing-quality judgment: the advisor's recommendation quality is out of scope (packet decision D7).
- No repository tooling execution beyond the append gateway: generate-context.js, validate.sh, and any git write/checkout/commit are banned by the dispatch charter; tests are not re-run, their recorded outputs in the packet are cited instead.

---

## 5. STOP CONDITIONS

- Hard cap: 4 iterations (config.stopPolicy=max-iterations). Terminal event must record stopReason "maxIterationsReached". Convergence before the cap is telemetry only (convergenceMode=off): broaden the review angle instead of synthesizing early.
- Three consecutive failed gateway/verification cycles route to stuck recovery.
- 120 minutes total (config.maxDurationMinutes).
- All charter questions answered does NOT stop the loop early; the cap does.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] KQ3 (iteration 3): ten steps, cost-ordered T1→T4 (door-down → criterion-down → discovery-latency → trust-erosion, each tier priced by the packet's own statements: 006:62, 008/AC:91-96, 009-report:94, 009-F003), each with action + prevented failure + precedent + observable pass condition, mapped onto D6's skeleton; steps 0–3 prevent the door-down failures, 4–6 the criterion-down failures, 7–10 the discovery-latency and trust-erosion failures. Detail: iterations/iteration-003.md.
- [x] KQ4 (iteration 4): the checklist catches everything it1/it2 found; the only failures of the fit are timing (steps 4, 6, 9, 10 practiced late) and completeness (step 7 — the packet is its own counterexample: 002/004/005's records, mechanism: record-then-forget); it still misses review-generation decay (fixed as step 11: prior-F010→F001 promotion, 009-report:15), waiver score-qualification (006:95's fusion-score cost, never re-qualified; 008's criterion was latency-only), and certification-of-waived-semantics generally. The tier order is validated by the packet's own pain arc. The affirmative dividend: hook warm 2,096→819 ms (002:52-53 → 008:116). Detail: iterations/iteration-004.md.
- [x] KQ1 (iteration 1): five failures, each at its file with its mechanism — freshness.ts cold-stale (warm-masks-disk + exit-0 degradation), skill-advisor.cjs split join (true-until-renamed + search-invisible), spec-kit shim TARGET_UNRESOLVED (dist-duality masks edits and misses), exit-taxonomy smoke orphaned case (narrowed table, stranded case) — and the structural mechanism: the fallback-era verification class (payload parity vs live warm daemon, judged by exit code) could not see the lifecycle failure class. Detail: iterations/iteration-001.md.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the packet's own verification tables, decision rationales and limitation blocks (006, 008, 003): the phases had already recorded their failures, their mechanisms and their lessons — the research problem was synthesis, not discovery (iteration 1).
- Treating 009's report as a mechanism witness instead of a target: its registry (F001–F008) explained latency without being re-derived (iteration 1).
- Verifying TODAY's state of disputed surfaces before classifying them (ENV-REFERENCE:366, the doctor invariant/template, tests/compat, doctor-skill-advisor.yaml): 009's findings described the PRE-remediation world; the class assignments needed the current tree (iteration 2).
- Reading the never-read witnesses (002, 005) in the final iteration: 002's one-paragraph What-Was-Built carried the D3 measurement and the wire freeze (the checklist's steps 0–1, practiced at inception), and 005's "Not started" record demonstrated the record-then-forget mechanism (iteration 4).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- First guess at 009's report path (009-deep-review-decommission/review-report.md): miss — the report lives at 009-deep-review-decommission/review/lineages/deepseek-confirm/review-report.md. Located by `find` on the second try (iteration 1).
- First guess at ENV-REFERENCE.md's path (.opencode/skills/system-spec-kit/ENV-REFERENCE.md): miss — it lives at .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md. A `find` resolved it; the 009-F001 citation carried no directory (iteration 2).
- First doctor-template read used .opencode/commands/doctor/mcp-debug.yaml: miss — the assets live at .opencode/commands/doctor/assets/doctor-*.yaml (iteration 2).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
- none yet
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Re-deriving 009's defect hunt: cited as witness only, where a 009 finding explains a latent mechanism (iteration 1, evidence: 009 review-report.md registry read; charter's do-not-repeat rule).
- Executing the advisor/daemon/tests to verify behavior: write containment bans repository tooling beyond the append gateway; the packet's recorded outputs and exit statuses are the evidence (iteration 1, evidence: dispatch charter + 008:84-85,115-119).
- Reading 010/011 research outputs: the charter's independence rule; the third reading only counts unseen (iteration 2).
- Verifying the 47 corpus paths one-by-one: 006:139's recorded decision plus 008/AC:92 and 009-report:16 establish the class; the post-state stays a labeled hypothesis (iteration 2).
- Git-archaeology on the doctor-asset provenance: git writes banned; reads of history available but out of the iteration's call budget (iteration 2).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: KQ3 cost-ordered checklist (iteration 3); KQ4 checklist-against-packet backtest (iteration 4)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- The 47-path post-state after the 009-remediation's index+fixtures regeneration: probably cleared, uncited (iterations 2, 4) — doubled as the study's Finding C.2 (waiver score-qualification: 006:95's fusion-score cost, never re-qualified; 008's criterion was latency-only).
- The doctor-skill-advisor.yaml provenance: pre-decommission asset or the 009-remediation's repoint? unknowable here without git (iteration 2).
- The ninth required correction's identity: 009/implementation-summary.md:3 says "nine required corrections"; the active registry holds eight — one required correction has no F-number (hypothesis: counted outside the registry) (iteration 2).
- Whether any post-009 workstream owns residue classes R4–R7 (iteration 2).
- 002/005's description.json parity: unchecked by this study (004's verified: template text) (iteration 4).
- The identities of the 5 inherited suite failures (008:118 counts, names none) and the 1,100-provenance of 008:116's CLI-warm target (labeled, iteration 4).
- Whether 010/011 answer any of the above — by charter, unread here; the residuals are exactly the questions their outputs may already answer, which is the point of the independent third reading (iterations 2–4).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Loop complete: 4 of 4 iterations (the cap; convergenceMode=off kept convergence as telemetry throughout, and the cap governed). Charter questions: 4 of 4 answered (KQ1–KQ4). Terminal synthesis: research.md (17 sections, eliminated-alternatives table, divergence map, convergence report, stopReason=maxIterationsReached); terminal event appended after the last projection; registry and dashboard final; config status → complete; advisory lock released.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Grounded at initialization (each item cites where it was read):

- Packet: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/` - level-2 phase parent, Status: Complete (spec.md | 1. METADATA). Phase folders 001-012 exist beneath it (directory listing): 001-transport-and-consumer-inventory, 002-daemon-transport-decision, 003-cli-front-door-parity, 004-caller-rewire, 005-mcp-transport-removal, 006-runtime-package-rename, 007-docs-and-residue-sweep, 008-verification-and-closeout, 009-deep-review-decommission, then the three research phases 010/011/012.
- Frozen decisions D1-D10, including D1 (delete, do not deprecate; JSON-RPC framing and `initialize` survive because the socket bridge parses them), D4 (one caller-facing seam, not one code path - the CLI absorbs the local scorer), D5 (rename mcp-server/ to runtime/), D6 (order is load-bearing: prove replacement, rewire callers, delete, rename, retrofit docs), D9 (degraded answer acceptable, no answer is a failure; the CLI still starts the daemon, bounded not skipped, and renders a route line when it fell back), D10 (two audit loops close the packet - 009 review hunting surviving MCP references, and this research on what it teaches) (goal.md | 1. DURABLE DIRECTIVE).
- Live surfaces to study: `.opencode/bin/skill-advisor.cjs` (the single front door), `.opencode/skills/system-skill-advisor/` (runtime/ daemon, prompt hooks, doctor routes), runtime registration files (opencode.json, .claude/mcp.json, .utcp_config.json) - registration-not-availability caveat noted in the root framework.
- Executor provenance for this lineage: invocation-metadata.json records effectiveConfig.kind=cli-pi, model=glm-5.3-flash, reasoningEffort=max, sandboxMode=workspace-write.
- resource-map.md is absent at 012-deep-research-glm-5-3/ (directory listing); resource_map_present=false; the coverage gate is skipped by design.

### Bounded Context Snapshot

- Source pointers: the eight implementation phases' docs under 001-008 (each folder's spec.md and closeout/verification records), 009's review report (its nine finding titles are context, not targets), and the live advisor tree under .opencode/skills/system-skill-advisor/ plus .opencode/bin/skill-advisor.cjs.
- Reuse candidates: the packet's own verification records (008) are the citable evidence of test outcomes; recorded outputs and exit statuses there count as read evidence per the charter's green-test rule.
- Integration points: the five deleted runtime declarations' former registration sites (opencode.json, .claude/mcp.json, .codex/config.toml, .cursor, .devin), the deleted plugin bridge's callers, the retired 26 bridge tests and 7 inverted contract tests.
- Constraints and risks: this session's write containment (lineage dir only); the advisor CLI/daemon is NOT executed (it would write outside the lineage); dependency on recorded artifacts for all behavioral claims.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.1 (newInfoRatio; convergenceMode=off, so convergence signals are telemetry)
- Stop policy: max-iterations (forced depth: iterations 1..4 each run once; terminal stopReason "maxIterationsReached")
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false (research.md is created once at phase_synthesis)
- research.md ownership: this lineage's synthesis output (workflow-owned; written at phase_synthesis)
- Lifecycle branches: new (this run); `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: refreshed by this lineage (Sections 3, 6, 7-11A), each refresh mirrored into the iteration's delta records
- Question injection surface: this lineage's inbox.jsonl - none created; the charter arrived via the dispatch prompt and no external injections are expected
- Canonical pause sentinel: this lineage's `.deep-research-pause` (none written; the loop runs to the cap)
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json` (not consulted further; executor provenance already recorded in config)
- Current generation: 1
- Started: 2026-09-12T06:13:09Z
