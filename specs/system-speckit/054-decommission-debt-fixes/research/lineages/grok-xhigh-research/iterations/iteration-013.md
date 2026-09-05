# Iteration 13: 054 open tasks versus leftover runtime modules

## Focus
054 `tasks.md` T009-T012 and `spec.md` purpose. Decide whether leftover writers (entity-extractor, sqlite-vec, leftover mcp-server) sit inside the open alignment tasks or outside the packet.

## Findings

### F-I13-001 — 054 is a debt packet with T009-T012 still unchecked. CONFIRMED. P2
T004-T008 are marked done (freshness fixtures, fan-out stderr, review leaf, rollback runbook + MCPResponse + stale test name, trigger-index move). [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-51]
T009 (align runtime/scripts + code READMEs), T010 (typecheck and suites), T011 (gates: freshness, sweep, doctor, audits, routing guard, validate strict on 052/053/054), T012 (close and write 052 log) are unchecked. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:52-62]
`spec.md` status is In Progress. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md:25]
This packet has not claimed complete. F-I9-004's grandfather worry does not fire on this packet today.

### F-I13-002 — T009's written purpose is standards and READMEs, not a second decommission. CONFIRMED. P2
Purpose: recorded debt fixed, one data folder under runtime, every code folder conforms and carries a current-state code README. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md:36-39]
T009 text: align `runtime/` and `scripts/` with `sk-code-opencode` and refresh every code README. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:52]
INFERRED: leftover `rebuildAutoEntities`, `sqlite-vec`, and the ignored `mcp-server/` tree are D6 residue the 052 LOG deferred or did not see. They fit D6 ("a doc or hook that describes or serves a surface that no longer exists") better than T009's README contract. Folding them into T009 without an amendment would hide them as "alignment".
Smallest fix: keep T009 as written; add explicit 054 follow-on rows (or a new packet) for leftover sqlite writers, unused vector deps, leftover mcp-server directory, and doctor-update snapshot paths.

### F-I13-003 — T011 would grade a tree that still contains F-I10 and F-I11. CONFIRMED. P1
T011 requires sweep, doctor routes, skill-root audits, routing guard, validate strict on 052/053/054. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:61]
A residue sweep that only greps tracked files will miss F-I10-001 (untracked leftover mcp-server). A sweep that walks the skill directory will hit the broken `node_modules` symlink (F-I10-002) or skip it via gitignore and report live 0.
`validate.sh --strict` does not fail on warnings (F-I9-003) and CONTINUITY_FRESHNESS is off by default (F-I9-001). T011 can pass while the leftover writer and leftover directory remain.
Smallest fix: T011 sweep must include untracked leftover package directories and the doctor-update `mcp-server/database` snapshot glob. Do not treat T011 green as "decommission complete".

### F-I13-004 — T007 already absorbed MCPResponse and the rollback runbook. CONFIRMED. P2 (negative)
T007 deleted the rollback runbook and dropped the unused MCP response type. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:50]
Grep under `shared/` for `MCPResponse` and `rollback-runbook` is empty. Those 052 deferred rows are not still open.
Smallest fix: none. Do not rediscover them.

## Sources Consulted
- .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-62
- .opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md:25,36-39
- scoped grep MCPResponse / rollback-runbook under shared

## Assessment
- newInfoRatio: 0.60
- Novelty justification: T009/T011 scope vs leftover writers; T007 negative closes two 052 deferred rows.
- Confidence: high on task state. Scope-split of leftover writers vs T009 is inferred from spec text.

## Reflection
- Worked: read 054 purpose, not only the unchecked boxes.
- Failed: none.
- Ruled out: treating T007's MCPResponse / rollback-runbook as still open.

## Dead Ends
- None.

## Recommended Next Focus
`/doctor update` assets that still snapshot `mcp-server/database/*.sqlite` and order a `context-index` step.
