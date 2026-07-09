# Deep Research Strategy: deep-loop-runtime release-cleanup phase 5a

> Generated 2026-05-23 by main_agent for spec folder `001-deep-loop-runtime`. Owns the research question, charter (non-goals + stop conditions), known-context buffer, and per-iteration guidance.

---

## 1. Research Question

Audit the `deep-loop-runtime` peer-runtime skill against the current sk-doc templates plus the Phase 2 + Phase 3 + Phase 4 evidence (audit-findings.jsonl + validation-report.jsonl + the now-rewritten README) and surface any logic gap, dependency or consumer surface NOT already captured in `spec.md` or `findings/audit-findings.jsonl`. Specifically:

1. **Test coverage gaps** across `lib/deep-loop/` (10 TS modules), `lib/coverage-graph/` (3 TS modules), `lib/council/` (5 cjs modules), `scripts/` (4 .cjs + `cli-guards.cjs`). Per ADR-004 LOG_ONLY — surface findings, do not propose fixes inside this packet.
2. **Undocumented integration points** beyond the consumer set already captured in `references/integration_points.md` (deep-review, deep-research, deep-ai-council). Look for hidden consumers: tests in `system-spec-kit/mcp_server/tests/deep-loop/`, `/doctor` health checks, `system-code-graph` playbook scenario 009.
3. **Stale references** in `references/`, `feature_catalog/**`, `manual_testing_playbook/**`. Path references that no longer resolve, version pins that no longer reflect current state, MCP tool names that were removed in arc 118.
4. **Inconsistencies** between the rewritten `README.md`, the patched `SKILL.md`, the new `changelog/v1.1.0.0.md`, and `graph-metadata.json`. The phase-3 rewrite expanded README from 174 LOC to 470 LOC and might have introduced cross-doc drift.

---

## 2. Charter

### Non-Goals (out of scope)

- **No code edits** to `lib/`, `scripts/`, `tests/`, `storage/` of `deep-loop-runtime/` (ADR-004 SC-007 invariant must hold through phase 5).
- **No edits to `assets/`** — ADR-003 accepts absence by design.
- **No new MCP tool surface** — ADR-001 in 118/004 explicitly removed it.
- **No edits to Smart Router** (SKILL.md §2) unless cascade forces it (ADR-007 reserved).
- **No cross-skill refactoring** beyond cross-system reference naming.

### Stop Conditions

- **Soft convergence**: 2 consecutive iterations with `newInfoRatio < 0.05` AND zero new P0/P1 logic_gaps surface AND Bayesian-scorer confidence ≥ 0.9.
- **Hard cap**: 10 iterations regardless.
- **Quality guard**: any iteration that produces a malformed JSONL delta, missing markdown narrative, or fails bundle gate (grep internal_imports + smoke-run validation_commands) is rejected and re-dispatched once; second failure escalates to operator.

### Output Contract per Iteration

Each iteration MUST produce:
- `research/iterations/iteration-{NNN}.md` — narrative findings with file:line evidence
- `research/deltas/iter-{NNN}.jsonl` — at least one record with `type: "iteration"` for the reducer

---

## 3. Known Context

### Inputs that anchor the research

| Source | What's there |
|--------|--------------|
| `spec.md` | 12-section feature specification at Level 3 with SC-001 through SC-007, REQ-001 through REQ-015, risk register, complexity 56/100 |
| `decision-record.md` | ADR-001 through ADR-005 accepted + ADR-006 phase-4 approval + ADR-007 reserved for Smart Router |
| `resource-map.md` | 88-row artifact inventory with Phase-2 audit_status updates and reserved Phase-5 Augmentation section |
| `findings/audit-findings.jsonl` | 21 findings emitted in Phase 2 (0 P0 / 6 P1 / 15 P2). 4 P1 resolved via surgical edit (AF-0001, AF-0003, AF-0004, AF-0010). Others deferred or held P2 with rationale. |
| `validation/validation-report.jsonl` | 53 rows from Phase 4 (46 PASS, 7 PASS_WITH_DEVIATIONS, 0 FAIL). Avg template_match_pct 97.8%. |
| `.opencode/skills/deep-loop-runtime/README.md` | Rewritten in Phase 3 (470 LOC, 9-section structure, HVR-clean, `validate_document.py` exit 0) |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Patched in Phase 2 (266 LOC, 3 surgical edits, version bumped 1.0.0 -> 1.1.0) |
| `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` | New, conforming to changelog-entry.schema.json |

### Where to look for gaps

- `tests/unit/*.vitest.ts` (13 files): map each test back to its `lib/deep-loop/*.ts` source — gaps mean modules without unit coverage.
- `tests/integration/*.vitest.ts` (7 files): map to `scripts/*.cjs` and review-depth flows.
- `tests/lifecycle/db-open-close.vitest.ts`: only one lifecycle test — verify coverage of all DB-open sites.
- `tests/council/*.vitest.ts` (5 files): map to `lib/council/*.cjs`.
- `references/integration_points.md`: confirm every consumer in the file resolves to an actual call site via `rg -F`.
- `feature_catalog/feature_catalog.md` claims "17 entries" — verify count + every Coverage row sums to 17.
- `manual_testing_playbook/manual_testing_playbook.md` claims "17 scenarios" — verify count + cross-reference with `feature_catalog/`.
- `graph-metadata.json` 170-LOC peer-skill discoverability metadata — verify entities, trigger_phrases, related_to all current after phase 3.

### Anti-patterns to call out

- **False positives on stale paths**: if a path looks broken but resolves through a symlink or alias root, NOT a finding.
- **Re-reporting of known P2s**: anything in `findings/audit-findings.jsonl` is already captured. Surface only NOVEL gaps.
- **Code review masquerading as logic gap**: bugs in `lib/`, `scripts/`, `tests/` are LOG_ONLY per ADR-004 — note them but do not escalate as P0/P1 unless the gap is in documentation, not code.

---

## 4. Per-Iteration Guidance

| Iter | Suggested focus |
|------|-----------------|
| 1 | Cross-doc consistency sweep: SKILL.md ↔ README.md ↔ changelog/v1.1.0.0.md ↔ graph-metadata.json. Look for fact drift. |
| 2 | Test-coverage map: which `lib/**/*.ts` modules lack a paired vitest file in `tests/unit/`. |
| 3 | Integration-point completeness: `rg -F` every consumer named in `references/integration_points.md`. Look for hidden consumers. |
| 4 | Path-ref sweep in `feature_catalog/**/*.md` and `manual_testing_playbook/**/*.md`. |
| 5 | Sub-README consistency: 8 sub-READMEs vs current code layout. |
| 6 | graph-metadata.json freshness: every `key_files` entry resolves, every `related_to` is current. |
| 7 | `lib/council/` integration: are all 5 cjs modules surfaced in feature_catalog + playbook? |
| 8 | Storage and SQLite: `storage/deep-loop-graph.sqlite` schema (v2) — does the README accurately reflect node-kind allow-list? |
| 9 | Cross-arc references: phase 118 ADRs, phase 117 council ruling, phase 129/001 ADR-001 (council primitives). |
| 10 | Synthesis pass: re-read all prior iterations, look for transverse patterns missed by single-iter focus. |

These are SUGGESTIONS — the deep-research agent can deviate based on what convergence signals reveal.

---

## 5. Executor Configuration

Per ADR-002 in `decision-record.md`:

- Executor: `cli-devin`
- Model: `swe-1.6`
- Timeout per iteration: 1500 seconds (25 min hard cap)
- Bundle gate per iteration: grep `internal_imports` + smoke-run `validation_commands` per `feedback_bundle_gate_smoke_run` memory
- Between-iter cleanup: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*`, `/tmp/deep-research-*` per `feedback_proactive_orphan_cleanup` memory

---

## 6. Synthesis Contract

When the loop terminates (convergence or hard cap):

1. Author `research/research.md` with the 17-section template per `deep-research/references/loop_protocol.md`.
2. Emit `research/resource-map.md` (this is the deep-research skill's resource-map, distinct from the packet-level resource-map.md at the spec folder root).
3. Merge novel logic gaps into the spec folder's `resource-map.md` Phase-5 Augmentation section with `Source Iter` links.
4. Author `research/convergence-summary.md` with stop reason + per-iter novelty rate.
5. Update `implementation-summary.md` evidence rows.
6. Run final strict validate.
7. Run `/memory:save`.

---

## 7. Phase-4 Approval Reference

This loop is authorized by ADR-006 in `decision-record.md`:
- Approval date: 2026-05-23
- Approver: Operator (explicit answer to phase-4 gate)
- Iteration budget granted: 10
- Validation-report.md SHA: pending commit
