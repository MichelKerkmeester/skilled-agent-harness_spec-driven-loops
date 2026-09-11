---
title: "Goal: Skill Advisor MCP Decommission"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Compressed the durable directive to fit the operator goal surface"
    next_safe_action: "Execute 001-transport-and-consumer-inventory against its goal"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Skill Advisor MCP Decommission

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE and must stay true for the packet's life.
> Keep it under 4000 characters: the operator surface truncates from the tail,
> and the tail is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the advisor's MCP transport and make the daemon-backed CLI its single front door, losing no capability, no automatic routing and no operator-visible behavior.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Delete, do not deprecate: stdio server, MCP SDK, plugin bridge, the MCP method vocabulary and result envelope, all five runtime declarations. JSON-RPC framing and `initialize` stay: the preserved socket bridge parses them |
| D2 | Preservation is the bar. All nine capabilities, the unprompted brief, and every operator-visible output stay identical. A behavior change is a failure, not a trade-off |
| D3 | The daemon's fate is decided by measurement, not preference. Both options are benchmarked against the recorded baseline before the protocol freezes. Inconclusive keeps the daemon |
| D4 | One CLI front door for every caller: both prompt hooks, the OpenCode plugin, doctor routes, any agent, through `.opencode/bin/skill-advisor.cjs`. One caller-facing seam, not one code path: it absorbs the local-scorer fallback |
| D5 | Rename `mcp-server/` to `runtime/` in this packet |
| D6 | Order is load-bearing: prove the replacement, rewire callers, delete, rename, retrofit docs. Nothing goes before its replacement does |
| D7 | Scope is the advisor's own transport. Routing quality untouched; every other MCP server keeps its registration; shared model server and socket bridge preserved |
| D8 | Implementation runs DeepSeek V4.1 Flash at max thinking via LLM Gateway, dispatched by cli-pi. Another executor is an amendment |
| D9 | A degraded answer is acceptable; no answer is a failure. The CLI still starts the daemon, bounded rather than skipped, and still renders a route line when it fell back |
| D10 | Two audit loops close the packet, each 5 iterations, convergence disabled, run through their own commands: a review hunting surviving MCP references, and a research on what this teaches |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

Phases: 1 inventory, 2 daemon decision, 3 CLI parity, 4 caller rewire, 5 removal, 6 rename, 7 docs sweep, 8 verification, 9 review, 10 research. Each carries its own `goal.md`, binding as if written here. Decisions above outrank child detail; name a conflict, never resolve it silently.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Only these decide done; an evaluator sees the objective string, not these files.

- [ ] Recursive `validate.sh --strict` over the packet prints `RESULT: PASSED` and exits 0
- [ ] No runtime config declares a skill advisor MCP server (opencode, claude, codex, cursor, pi)
- [ ] The MCP SDK has no importer left in the advisor package
- [ ] All nine capabilities answer through the CLI on a frozen input set at parity with the payload MCP returned, each caller's own helper proven too, not just the binary
- [ ] Every runtime starts with no advisor MCP server and the brief still arrives unprompted: proven warm, cold where the call starts the daemon, and unreachable where a degraded line is required
- [ ] The prompt-hook latency delta against the pre-change baseline is reported and inside the phase 2 budget
- [ ] No live instruction surface calls the advisor an MCP server or names a retired tool id, AGENTS.md included, and the package directory is `runtime/`
- [ ] Both audit loops ran their 5 iterations and every P0 and P1 finding is fixed or answered with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Operator copy

The operator holds the durable text above as the session objective, and that
copy is what judges completion. Whenever anything above this log changes,
resend the durable text in chat so the operator can update their copy, and keep
it under 4000 characters. A child goal change that alters a parent decision or
criterion is an amendment to the parent: apply it there first, then resend.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet scaffolded and parent authored | Done | Eight children with goals; parent spec, goal and phase map authored; nine folders validate strict with 0 errors |
| Durable directive compressed for the operator surface | Done | Durable text measured at 2,481 characters against the 4,000 cap |
| 001 transport and consumer inventory | Done | `001-transport-and-consumer-inventory/inventory.md` at freeze `6012ec5c7d`: 5 SDK sites, 5 declarations, 13 executable callers, 4 automatic behaviors, 63 flags, 7 preserve-set items, 0 unclassified |
| 002 daemon transport decision | Done | `baseline.md` (numbers, daemon kept, budget), `protocol-contract.md` (frozen wire contract, D1 amendment) and `warm-mechanism.md` (per-runtime warm, pi gap recorded) |
| 003 cli front door parity | Done | 22 frozen cases across nine commands: 7 matched, 15 allowlisted with reasons, 0 differed, harness exits 0. Exit taxonomy 5/5 tests pass. Contract document shipped. Reopened once and closed on the wire migration in `3def6d6c9b` |
| 004 caller rewire | Done | `514f2be726` moved the callers onto the CLI, `e8d564ca98` moved the prompt hook and repaired what that exposed, `7920288acb` bounded the cold-start wait after the first fix proved worse than the bug, closed by `91fd9b6226` |
| 005 mcp transport removal | Done | `eb53802beb` deregistered the advisor from all five runtimes; `077dbf804d` deleted the plugin bridge and retired what depended on it |
| 006 runtime package rename | Done | `3feab865ea` renamed the package directory to `runtime/`; 407 path updates |
| 007 docs and residue sweep | Partial | `127aef03e7` and `afd10f291f` rewrote the docs read first and renamed the directories named for a transport. Its "zero live hits" claim does not hold outside the advisor package: 87 live files still name `system-skill-advisor/mcp-server`, found in phase 8. See the deviations table |
| 008 verification and closeout | Done | All seven criteria re-run from the final state; 8 of 8 acceptance rows Met. Residue criterion failed first at 87 live files and now reads zero |
| 009 deep review | Done | Six iterations, CONDITIONAL, 0 P0 / 9 P1 / 8 P2, each finding reproduced. `009-deep-review-decommission/review/lineages/deepseek-review/review-report.md` |
| 010 deep research | Done | Five iterations, convergence off. `010-deep-research-residue/research/lineages/deepseek-research/research.md`: the fallback-exposure model, eight residue classes, a twenty-two step checklist, and eight defects in this packet's own record |

### DONE WHEN

One row per completion criterion above, with the evidence that closes it.

| Criterion | Evidence |
|-----------|----------|
| Recursive strict validate prints RESULT PASSED | **Met.** 11 folders, every one `RESULT: PASSED`, exit 0, `Errors: 0`, run from the final state |
| No runtime config declares the advisor MCP server | **Met.** None of `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json` or `.pi/mcp.json` declares it; `eb53802beb` |
| The MCP SDK has no importer left | **Met.** `077dbf804d`; no importer in the advisor package |
| All nine capabilities answer through the CLI at payload parity | **Met.** 22 frozen cases across nine commands, 0 differed, 15 allowlisted with stated reasons |
| The prompt brief still arrives in every runtime | **Met.** Proven warm, cold and unreachable; a daemon-down session still gets a route line |
| The latency delta is reported and inside budget | **Met.** CLI warm 736 ms against an 1,100 ms budget; hook warm 819 ms against 2,096 ms; cold 1,566 to 1,812 ms against 3,500 ms. `008-verification-and-closeout/latency-delta.md` |
| No live surface presents an MCP server; the directory is runtime/ | **Met.** Zero live files name the retired directory, measured by `git grep -l` excluding specs, changelogs and dated benchmark reports. It read 87 at first measurement; closing it took a doc sweep, a regenerated trigger index and a hand-corrected residue allowlist. 24 historical files keep the old name by design |

### Deviations and findings

| Item | Note |
|------|------|
| The first durable draft overran the operator surface | It ran past 4,000 characters, which truncates from the tail and would have dropped the completion criteria. The decisions were compressed and the eight-row binding table was replaced by a one-line phase list, since a path in the objective string dereferences to nothing anyway |
| D4 amended in phase 4 | The Python scorer the prompt hook calls is not a delegate. It probes for the native advisor and scores locally when unreachable, verified by getting `source: native` in one environment and `source: local` in another, and confirmed in `probe_native_advisor()`. Removing it outright would drop the brief on a daemon-down session, which D2 forbids. The fallback moves behind the CLI instead, so one seam and the resilience both survive. The durable text was resent |
| D1 amended in phase 2 | The contract said the JSON-RPC framing goes, but the shared socket bridge D7 preserves parses JSON-RPC frames for its liveness probe at the client cap, so D1 and D7 could not both hold literally. D1 now names the MCP method vocabulary and result envelope instead of the envelope itself. The durable text was resent |
| Scaffolding evidence recorded before any phase ran | The transport's thinness and the CLI's existing nine-tool coverage were confirmed by reading the dispatcher and the CLI manifest, and by one live `advisor_status` call that round-tripped to the daemon. Phase 001 still owns the exhaustive inventory |
| Phase 7's residue claim did not hold | The sweep searched for the advisor's retired tool ids and its old directory name. What survived asserts the advisor is an MCP server in wording containing neither, and prints a directory that was renamed. The review loop found eight such surfaces by hunting claims instead of tokens; a path count in phase 8 then found 87 live files still naming `mcp-server/` |
| CI would have failed on this branch | Four GitHub Actions workflows and `.gitignore` still pointed at `system-skill-advisor/mcp-server`, one of them as a `working-directory` that no longer exists. Neither audit loop looked under `.github/`. Found and fixed while closing the review findings |
| The research lineage was failed by another loop's leftovers | Write containment found 19 untracked paths and reverted the research lineage on them; all 19 belong to the review's output, left uncommitted from the earlier run. The research wrote none of them and its five iterations were already complete. Committing a loop's artifacts before starting the next one is the fix |

<!-- /ANCHOR:log -->
