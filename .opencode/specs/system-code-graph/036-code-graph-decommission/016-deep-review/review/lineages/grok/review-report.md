# Review Report — Code Graph Decommission (grok lineage)

**Session:** `fanout-grok-1785216731182-5rt43x`  
**Lineage:** grok (`cli-cursor` / `cursor-grok-4.5-high`)  
**Target:** `.opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review`  
**Stop reason:** `maxIterationsReached` (5/5; early convergence treated as telemetry only)  
**Generated:** 2026-07-28T05:40:00Z

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **FAIL** |
| **hasAdvisories** | false (P2 present but verdict already FAIL) |
| **Active P0** | 5 |
| **Active P1** | 9 |
| **Active P2** | 3 |
| **Dimensions covered** | correctness, security, traceability, maintainability (4/4) |
| **Release readiness** | `release-blocking` |

The decommission removed the skill directory, runtime MCP registrations, doctor routes, and agent grants, but **live agent-facing guidance, Cursor Write hooks, test/harness imports, matrix cells, and completion metadata still speak the old contract**. That contradicts 015 residual-sweep / suite-green claims and leaves operators with broken imports plus misrouted tool tips.

---

## 2. Planning Trigger

Route to `/speckit:plan` (or amend owning phase children) before any “decommission complete” claim.

Trigger conditions met:
- Active P0 findings remain after adversarial self-check
- `checklist_evidence` and `spec_code` core protocols failed
- 015 Status Complete contradicts its own In Progress / IN FLIGHT evidence

Do **not** route to `/create:changelog` until P0/P1 are fixed or explicitly deferred with operator sign-off.

---

## 3. Active Finding Registry

### P0 — Blockers (5)

| ID | Title | Evidence | Dimension | First seen |
|----|-------|----------|-----------|------------|
| P0-001 | Live memory tools still recommend deleted `code_graph_query` | `context-server.ts:1126` | correctness | 1 |
| P0-002 | `tool-schemas` still advertise deleted structural search MCP | `tool-schemas.ts:216` (also `:230`) | correctness | 1 |
| P0-003 | Live tests still import deleted system-code-graph modules | `tests/opencode-plugin.vitest.ts:14` | traceability | 3 |
| P0-004 | compact-merger test imports deleted WorkingSetTracker | `tests/compact-merger.vitest.ts:4` | maintainability | 4 |
| P0-005 | Durability stress test imports deleted CODE_GRAPH_TOOL_SCHEMAS | `stress-test/durability/release-cleanup-new-surfaces-stress.vitest.ts:39` | correctness | 5 |

### P1 — Required (9)

| ID | Title | Evidence | Dimension | First seen |
|----|-------|----------|-----------|------------|
| P1-001 | session-prime Recovery Tools lists deleted `code_graph_*` | `hooks/claude/session-prime.ts:212` | correctness | 1 |
| P1-002 | Cursor post-tool-use still spawns deleted freshness hook | `hooks/cursor/post-tool-use.mjs:126` | correctness | 1 |
| P1-003 | Fail-open dead spawn masks incomplete hook removal | `post-tool-use.mjs:62` | security | 2 |
| P1-004 | 015 claims `checklist.md` Created but file missing | `015/.../implementation-summary.md:81` | traceability | 3 |
| P1-005 | 015 Status Complete vs In Progress / IN FLIGHT | `015/.../implementation-summary.md:145` | traceability | 3 |
| P1-006 | matrix-manifest F5/F6 still `applicable:true` | `matrix-manifest.json:12-15` | traceability | 3 |
| P1-007 | plugins README documents deleted mk-code-graph plugins | `plugins/README.md:103` | maintainability | 4 |
| P1-008 | system-spec-kit graph-metadata edges to system-code-graph | `graph-metadata.json:27` | maintainability | 4 |
| P1-009 | Stress harness still wires `mk_code_index` + deleted DB path | `run-substrate-stress-harness.mjs:408` | maintainability | 5 |

### P2 — Advisories (3)

| ID | Title | Evidence |
|----|-------|----------|
| P2-001 | compact-inject still tokenizes `code_graph_*` topics | `compact-inject.ts:121` |
| P2-002 | sk-doc S-tier roster still lists system-code-graph | `skill-root-metadata-contract.md:52` |
| P2-003 | tool-schemas L8 migration comments still name deleted server | `tool-schemas.ts:893` |

All P0/P1 entries above were re-read at cited lines during their iteration adversarial pass; none downgraded to false positive.

---

## 4. Remediation Workstreams

| Workstream | Finding IDs | Owning surface | Action |
|------------|-------------|----------------|--------|
| **WS-A Live guidance scrub** | P0-001, P0-002, P1-001, P2-001, P2-003 | `system-spec-kit/mcp-server` | Replace code-graph tips with Grep/Glob doctrine; scrub session-prime + compact topic regex + L8 comments |
| **WS-B Hook cleanup** | P1-002, P1-003 | Cursor `post-tool-use.mjs` (+ Claude mirror) | Delete freshness constant + `runChild`; keep sk-code / dispatch-audit chain |
| **WS-C Test & harness retirement** | P0-003, P0-004, P0-005, P1-006, P1-009 | phase-006 surfaces | Delete/rewrite broken imports; set matrix F5/F6 `applicable:false`; strip stress harness mk_code_index wiring |
| **WS-D Docs & advisor metadata** | P1-007, P1-008, P2-002 | plugins README, graph-metadata, sk-doc | Remove deleted plugin docs; rebuild advisor edges; fix S-tier roster |
| **WS-E Completion honesty** | P1-004, P1-005 | `015-verification-and-closeout` | Create checklist with evidence **or** retract Created/Complete claims; finish suite delta or mark In Progress |

---

## 5. Spec Seed

Minimal packet deltas (do not implement in this lineage):

1. Amend 015: Status must match evidence; checklist artifact must exist if claimed.
2. Amend 006/004 closeout notes: list remaining live residue as open debt if already marked Complete.
3. 016 triage table: each P0/P1 → confirmed/refuted with file:line before fix commits (REQ-003).

---

## 6. Plan Seed

1. Land WS-A + WS-B first (highest blast radius: every agent session).
2. Land WS-C and re-run the suites that previously claimed green; capture before/after counts.
3. Land WS-D; rebuild skill-advisor.
4. Reconcile WS-E metadata; re-run `--hidden --no-ignore` residual sweep excluding archival paths.
5. Re-validate parent packet with `validate.sh --recursive`.

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | **fail** | Live tips/tests contradict residual-sweep and suite-green claims |
| `checklist_evidence` | core | **fail** | 015 checklist claimed Created; file absent |
| `feature_catalog_code` | overlay | **fail** | matrix F5/F6 still applicable |
| `playbook_capability` | overlay | partial | Doctor/agent surfaces clean; harness/playbook-adjacent stress still coupled |
| `skill_agent` | overlay | notApplicable | Target is spec-folder |
| `agent_cross_runtime` | overlay | pass (spot) | `.opencode/agents` grepped clean of retired identities |
| AC_COVERAGE | advisory | exempt | Level-1 / no checklist at 016 |

Resource-map coverage gate: skipped at init (`resource-map.md` not present on target). Reducer emitted lineage `resource-map.md` from deltas for synthesis audit only.

---

## 8. Deferred Items

- P2 advisories (P2-001..003) — fix with adjacent scrub, or track as follow-up packet.
- Process/socket live check for `mk-code-index` was sandbox-limited (sysmon unavailable); file absence of skill/plugins/socket path was confirmed instead.
- Fresh-clone verification still open from 015 limitations — out of scope for this lineage but still unfinished debt.
- Archived specs/changelogs/benchmarks intentionally untouched.

---

## 9. Audit Appendix

| Item | Evidence |
|------|----------|
| Iterations | 5/5 (`iteration-001` … `iteration-005`), each with `Review verdict:` final line |
| Route proof | Each iteration record: `mode=review`, `target_agent=deep-review`, `agent_definition_loaded=true` |
| Deltas | `deltas/iter-001.jsonl` … `iter-005.jsonl` |
| verify-iteration | ok for iterations 1–5 |
| stopPolicy | `max-iterations` — did not synthesize early despite dimension coverage |
| What was clean | Skill dir absent; plugins `mk-code-graph*.js` absent; runtime MCP configs clean; doctor tree clean; CLAUDE.md/AGENTS.md clean of retired identities |
| Verdict derivation | `p0_count=5 > 0` → **FAIL**; `releaseReadinessState=release-blocking` |
| Executor | cli-cursor / cursor-grok-4.5-high |
| Artifact containment | All writes under `review/lineages/grok` only |

### Embedded Planning Packet (summary)

```text
GOAL: Clear release-blocking residue from code-graph decommission
VERDICT: FAIL
P0: 5 | P1: 9 | P2: 3
NEXT: WS-A guidance scrub + WS-B hook deletion, then WS-C test/harness rewrite
GATE: Re-sweep with --hidden --no-ignore; suite delta vs baseline; 015 checklist present or claim retracted
```
