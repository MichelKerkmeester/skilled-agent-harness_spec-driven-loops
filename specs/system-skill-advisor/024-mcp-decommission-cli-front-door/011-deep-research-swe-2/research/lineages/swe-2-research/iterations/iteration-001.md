---
title: "Iteration 1: Packet archaeology — what the decommission shipped and in what order"
trigger_phrases: []
---
# Iteration 1: Packet archaeology — what the decommission shipped and in what order

## Focus

Fix the factual skeleton the three research questions hang on: what the MCP transport was, what replaced it, the order the phases ran in, and which ordering constraints were load-bearing. Latent-failure hunting (Q1) starts next iteration.

## Actions Taken

1. Read the parent `spec.md` and `goal.md` for the phase map, decisions D1–D10, the completion criteria and the goal log's deviation table.
2. Read `001-transport-and-consumer-inventory/inventory.md` for the classified inventory (5 SDK sites, 5 declarations, 13 callers, 4 automatic behaviors, 63 flags, 7 preserve-set items).
3. Read `002-daemon-transport-decision/{baseline,protocol-contract,warm-mechanism}.md` for the daemon decision numbers, the frozen wire, and the warm mechanism.
4. Read `003-cli-front-door-parity/spec.md` and `008-verification-and-closeout/latency-delta.md` for the parity gate and the final latency evidence.
5. Ran `git log`/`git show --stat` on the ten commits the goal log names, to read the recorded failure/repair narratives at the point they were written.
6. Inspected the live tree: `.opencode/bin/skill-advisor.cjs`, `system-skill-advisor-launcher.cjs`, `hooks/lib/skill-advisor-cli-fallback.ts`, and the post-rename `runtime/` layout.

## Findings

1. The removed transport was a pass-through, not a behavior owner. `mcp-server/advisor-server.ts` was 347 lines whose two SDK handlers (list-tools, call-tool) both delegated to `dispatchTool` in `mcp-server/tools/index.ts`, which was already transport-agnostic and already served the CLI in the same process. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:79]
2. The CLI already covered the whole surface before it was the front door: `.opencode/bin/skill-advisor.cjs` reaches the daemon over a unix socket and its manifest declared all nine tools — the four advisor tools plus the five skill-graph tools — and a live `advisor_status` round-trip proved the path. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:80]
3. The automatic routing everyone depends on never used MCP: the Claude prompt hook imports the advisor library in-process and fell back to the CLI shim; the Gate 2 brief is produced on that path. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:81] [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/001-transport-and-consumer-inventory/inventory.md:94-99]
4. The wire was "less MCP than the package name suggests": unix socket + newline-delimited JSON + JSON-RPC 2.0 envelope are generic; only the `initialize`/`notifications/initialized` lifecycle names, the `2025-06-18` protocol revision, `tools/call` and the `{content:[{type:"text"}]}` result envelope were MCP. The frozen replacement keeps the envelope and `initialize` (the shared bridge's at-capacity liveness probe parses them) and deletes the vocabulary on top: `advisor.call` method, `advisorProtocol` integer version gate, payload returned unwrapped. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/002-daemon-transport-decision/protocol-contract.md:22-35,53-57,66-119]
5. The daemon survived by measurement, not preference: cold first call 3008 ms vs warm p50 926 ms → ~2082 ms per call is what residency saves; a stateless CLI lands between the two and beats neither. D3's inconclusive-keeps-the-daemon rule agreed, so no stateless prototype was built. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/002-daemon-transport-decision/baseline.md:26-73]
6. The warm path replaced "the MCP client connection starts the daemon" with a per-runtime fire-and-forget `node .opencode/bin/skill-advisor.cjs --warm-only` at session start — non-blocking, silent on failure, idempotent. Pi had no session-start hook point and is recorded as a known gap. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/002-daemon-transport-decision/warm-mechanism.md:22-63]
7. Ordering was load-bearing (D6): inventory → daemon decision → CLI parity → caller rewire → removal → rename → docs sweep → verification → two audit loops. "Nothing goes before its replacement"; the rename waits for the removal so the move diff stays mechanical. Phase 003's parity harness needed the MCP surface still live as its comparison target. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md:56] [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:157-158]
8. Phase 003 closed on artifacts rather than implementation and had to be reopened: it shipped the parity harness and the written contract while the daemon still spoke the MCP wire; phase 005 then found the MCP `Server` object was the socket's request handler, not merely a stdio transport, and stopped rather than deleting the socket the CLI depends on. The wire migration shipped in `3def6d6c9b` after reopen commit `f4bf73e682`. [SOURCE: command:`git show 3def6d6c9b` commit message] [SOURCE: command:`git log --oneline` showing f4bf73e682 "reopen phase 3"]
9. Final verification numbers landed inside budget: CLI warm p50 736 ms vs 1100 budget; hook warm 819 ms vs 2096; cold 1566–1812 ms vs 3500. The same-worktree controlled baseline shows ~30% faster hook, with byte-identical output. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout/latency-delta.md:22-50]
10. Phase 007's "zero live hits" claim did not hold outside the advisor package: the sweep searched retired tool ids and the old directory name, while surviving surfaces asserted the advisor is an MCP server in wording containing neither; the phase 009 review found eight such surfaces by hunting claims instead of tokens, and a phase 008 path count found 87 live files still naming `system-skill-advisor/mcp-server`. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md:117,144]
11. The phase implementation-summaries are unfilled scaffolds ("Not started. The planning artifacts exist and bind the work") even in completed phases — e.g. `004-caller-rewire/implementation-summary.md:51` and `005-mcp-transport-removal/implementation-summary.md:51`. The packet's real record is the goal log, the named commits, and the dedicated contract documents. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/004-caller-rewire/implementation-summary.md:51] [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/005-mcp-transport-removal/implementation-summary.md:51]

## Questions Answered

- Q4 (supporting): the shipped inventory and ordering invariants are now fixed — five declarations, SDK, bridge, MCP wire vocabulary, and the `mcp-server/` name removed; CLI + daemon + JSON-RPC envelope + env rehoming preserved or added.

## Questions Remaining

- Q1: the latent-failure enumeration at file granularity (the commit narratives name four; code verification is next).
- Q2: the residue-class taxonomy grounded in what this packet actually left.
- Q3: the ordered checklist.

## Ruled Out

- Treating the MCP transport as a capability owner: disproved by the pass-through measurement; removal risk concentrated in callers, config, and docs instead. [SOURCE: file:spec.md:79-83]

## Dead Ends

- The phase implementation-summaries as an evidence source: they are unfilled Level-3 scaffolds; the usable record is the goal log, contract docs, and commit messages.

## Edge Cases

- Contradictory evidence: none inside the packet record; the one figure discrepancy observed is "7 contract tests inverted" (dispatch brief) vs "26 bridge tests retired, 3 inverted, 4 migrated, 828→863 passing" (009 spec seed quoting the packet record) — different accounting units; carry both citations rather than reconcile silently.
- The `.gitignore` wildcard `.opencode/skills/*/mcp-server/database/` still matches, but `.opencode/skills/mcp-code-mode/mcp-server` still exists — generic pattern covering a still-live directory shape, not advisor residue. [SOURCE: command:`ls -d .opencode/skills/*/mcp-server` → mcp-code-mode only] [SOURCE: command:`git grep -n mcp-server .gitignore` → lines 139,141]

## Sources Consulted

- specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md
- specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md
- specs/system-skill-advisor/025-mcp-decommission-cli-front-door/001-transport-and-consumer-inventory/inventory.md
- specs/system-skill-advisor/025-mcp-decommission-cli-front-door/002-daemon-transport-decision/{baseline,protocol-contract,warm-mechanism}.md
- specs/system-skill-advisor/025-mcp-decommission-cli-front-door/003-cli-front-door-parity/spec.md
- specs/system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout/latency-delta.md
- `git show` on 514f2be726, e8d564ca98, 7920288acb, 91fd9b6226, eb53802beb, 077dbf804d, 3feab865ea, 3def6d6c9b, 127aef03e7, afd10f291f (messages + stats; read-only)
- .opencode/bin/skill-advisor.cjs, .opencode/bin/system-skill-advisor-launcher.cjs, .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts

## Assessment

- New information ratio: 1.00
- Novelty justification: First pass; establishes the packet skeleton and already surfaces two structural lessons (artifact-vs-implementation closure gap at phase 003; claim-vs-token sweep gap at phase 007).
- Confidence: high — every figure above is from a packet document, a commit message, or a file read this session.

## Reflection

- What worked and why: the goal log's deviation table plus `git show` on named commits is a compressed, honest record — richer than the unfilled per-phase summaries.
- What did not work and why: implementation-summary.md files are template residue; stopped reading them after two identical scaffolds.
- What I would do differently: none for this focus; the commit-first reading order was the right call.

## Recommended Next Focus

Iteration 2: enumerate the latent failures — the four in `skill-advisor-cli-fallback.ts`/the CLI path (flat socket probe, 250 ms clamp, 30 s timeout semantics, discarded degraded answers, no daemon start on cold) plus the env-block coupling and the cross-package hardcoded hook path; name each at its file and the mechanism that kept it hidden.
