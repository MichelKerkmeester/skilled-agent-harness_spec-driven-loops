# Iteration 7: Documentation that over- or under-states the retirement

## Focus
Angle 5. Operator-facing docs in `system-spec-kit`, commands, and root agent files that claim a behavior the code no longer has, or that claim the retirement is cleaner than the live readers.

## Findings

### F-I7-001 — Spec-kit README says the advisor is the only owner of `MEMORY_DB_PATH`. CONFIRMED. P1
The README describes `SPEC_KIT_DB_DIR` / `MEMORY_DB_PATH` as the directory and file override "for the skill advisor's database, the one SQLite store the shared client still serves" and says the name "predates the advisor being its only owner". [SOURCE: .opencode/skills/system-spec-kit/README.md:363-370]
Live non-advisor readers remain: `folder-detector.ts` Priority 2.5 (F-I5-002) and `legacy-lane.mjs` (F-I5-006). The doc teaches a single-owner contract the tree does not have.
Smallest fix: name the remaining readers, or delete those readers and then keep the sentence.

### F-I7-002 — Retrieval reference says there is no database in the successor architecture, while two lexical scripts still open sqlite. CONFIRMED. P2
`memory-system.md` lists trigger index, generator, lookup, ripgrep and the continuity writer, then says "There is no server, no database and no daemon in that table." [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:27-35]
The sentence is true of that table. It is false as a system claim: `legacy-lane.mjs` and `folder-detector.ts` still open `context-index.sqlite`.
The skill README also says retrieval is now two lexical lanes. [SOURCE: .opencode/skills/system-spec-kit/README.md:288-290]
`parity-check.mjs` and `/doctor memory` still treat a three-arm baseline as the pass policy. [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:36-42]
Smallest fix: add the legacy sqlite arm as a historical harness, or retire it so the two-lane sentence is true.

### F-I7-003 — Session-lifecycle README still documents startup continuity the hook removed. CONFIRMED. P1
Already opened in F-I4-004. The operator-facing browsability README is the live contract for the restored registrations. Restated here because it is a doc/code split on the successor, not only a hook bug.
[SOURCE: .opencode/hooks/session-lifecycle/README.md:36]
[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:141-142]
Smallest fix: same as F-I4-004.

### F-I7-004 — Root README and AGENTS.md match the two-lane story and do not advertise a memory MCP. CONFIRMED. P2 (negative)
Root `README.md` had no hits for `memory database`, `spec-memory`, `zvec lane`, `context-index.sqlite`, `MEMORY_DB_PATH` or `system-spec-kit/mcp-server`.
`AGENTS.md` describes Gate 1 as the trigger-index lookup, `/memory:save` as continuity, and `/memory:search` as analysis, and it lists semantic/vector/decay as unsupported. [SOURCE: AGENTS.md:83] [SOURCE: AGENTS.md:330] [SOURCE: AGENTS.md:478]
Those files are not the miss. The miss is the spec-kit README and the hook README above.

### F-I7-005 — `/doctor memory` is a live successor diagnostic, not a dangling memory-server command. CONFIRMED. P2 (negative)
`_routes.yaml` still has `target: memory` → `doctor-memory.yaml`. [SOURCE: .opencode/commands/doctor/_routes.yaml:33-34]
The YAML diagnoses `runtime/data/trigger-index.json` and ripgrep, and states it needs no background service. [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:21-25]
`/memory:search` naming it on lookup exit 2 is correct routing, not residue. [SOURCE: .opencode/commands/memory/search.md:83]
The remaining smell is the pass policy `parity_unexplained_differences: 0` against a frozen three-arm baseline that includes the retired sqlite lane. [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:36-42]

### F-I7-006 — Changelog and catalog files still narrate the live spec-memory CLI. NOT USED AS A FINDING.
Those trees were out of the reading budget (`changelog`, `feature-catalog`, `manual-testing-playbook`). Hits there were not treated as live operator contracts.

## Sources Consulted
- .opencode/skills/system-spec-kit/README.md:284-374
- .opencode/skills/system-spec-kit/references/memory/memory-system.md:27-35
- .opencode/hooks/session-lifecycle/README.md:36
- AGENTS.md:83,330,478
- README.md (negative)
- .opencode/commands/doctor/_routes.yaml:33-34
- .opencode/commands/doctor/assets/doctor-memory.yaml:21-42
- .opencode/commands/memory/search.md:83
- .opencode/install-guides (only a historical packet name)

## Assessment
- newInfoRatio: 0.45
- Novelty justification: the new load-bearing item is README's "only owner" sentence vs live sqlite readers. Session README and two-vs-three-lane restates earlier findings in the doc register. Negatives for AGENTS/root/doctor route prevent rediscovery.
- Confidence: high.

## Reflection
- Worked: read the current README retirement section instead of grepping changelog.
- Failed: first pass through install-guides only found a historical packet slug.
- Ruled out: `/doctor memory` as a dangling memory-server command.

## Dead Ends
- Root README memory-surface grep (clean).
- install-guides `spec-memory.cjs` / `@spec-kit/mcp-server` grep (clean).

## Recommended Next Focus
Angle 6. Successor coverage: what the retired memory surface did that the trigger index, ripgrep lane and continuity writer do not, including session-prime startup, session_learning, and the doctor three-arm baseline.
