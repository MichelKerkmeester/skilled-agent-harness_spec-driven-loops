# Review Iteration 005 — Completeness

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1792944728998-cwb2cp` · **Iteration:** 5 of 5
**Dimension:** completeness (acceptance coverage, overlay protocols, documentation of new capability)

## Dimension

Completeness: is every phase's closure row accounted for, does the packet document the capability it added, and do the overlay protocols resolve? This pass counts the acceptance rows across all five phases, checks the waiver's ADR, and follows the parent's pointers.

## Files Reviewed

- `specs/sk-code/013-private-surface-skills/{001,002,003,004,005}/*/acceptance-criteria.md` (row counts and dispositions)
- `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/decision-record.md:38,140,242,541` (ADR inventory)
- `specs/sk-code/013-private-surface-skills/spec.md:219-224` (related documents)
- `specs/sk-code/013-private-surface-skills/graph-metadata.json:18-40`
- `.skilled/scripts/git-hooks/README.md:20,24`
- `.skilled/scripts/git-hooks/pre-commit:105-121`
- `.skilled/agents/code.md:110` and `.claude/agents/code.md:95`, `.opencode/agents/code.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

#### 1. R5-P2-001 — The hooks README's gate inventory omits the new blocking gate

- **Severity:** P2
- **File:** `.skilled/scripts/git-hooks/README.md:24`
- **Claim:** The README states "`pre-commit` runs ten blocking sub-gates" and lists them — comment hygiene, agent-mirror sync, mirror parity, skill authoring, prompt-card sync, MCP mutation-class, template phrase lint, compiled-routing re-mint, spec derived-metadata re-mint and doc version bump. The private-skill guard is not in that list, though `pre-commit:105-121` runs it as a blocking gate before comment hygiene, with no bypass variable and no gate-config row.
- **Evidence:** `README.md:20` and `:24` (both state ten), `pre-commit:105-121` (the gate and its `BLOCKED [gate:private-skill]` exit 1), `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:999-1060` (seven harness cases). The count is now eleven, and the gates without their own bypass flag are now two (agent-mirror sync and private-skill) rather than one.
- **Counterevidence sought:** Looked for the gate in `lib/gates.tsv` — correctly absent, because it has no configurable key. Looked for it in the two manual-testing playbooks — absent there as well. The script's own comments are the only prose that describes it.
- **Alternative explanation:** The README's inventory is scoped to gates with a bypass or a config row; the private-skill gate has neither, so it may be deliberately outside that list. The count sentence, however, is a total ("ten blocking sub-gates"), and a reader cannot tell which gates the total excludes.
- **Final severity:** P2. A blocking gate that the hooks' own reference does not name is a documentation-completeness gap, not a behavior defect.
- **Confidence:** high.
- **Downgrade trigger:** none.

#### 2. R5-P2-002 — The parent's related-documents pointer names a field that does not exist

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/spec.md:223`
- **Claim:** "See `graph-metadata.json` for `derived.last_active_child_id` pointer." The parent `graph-metadata.json` has a `derived` object (`:18`) carrying `trigger_phrases`, `key_topics` and related arrays, but no `last_active_child_id` key anywhere in the file.
- **Evidence:** `spec.md:223`, `graph-metadata.json:18-40`, and a whole-file search for `last_active_child_id` returning no match.
- **Counterevidence sought:** Checked whether the field lives on a child's `graph-metadata.json` instead. The children's `derived` blocks carry the same generated shape and no such pointer.
- **Alternative explanation:** The field was part of an older metadata schema and the pointer text outlived it.
- **Final severity:** P2 — a dangling pointer in the parent's related-documents list.
- **Confidence:** high.
- **Downgrade trigger:** none.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Acceptance coverage is accounted for; two documentation gaps remain (R5-P2-001/002). |
| `checklist_evidence` | core | partial | 107 rows across five phases: 103 Met, 3 Unmet (002 AC-014, 003 AC-026, AC-027), 1 Waived. The waiver names ADR-008, which exists (`decision-record.md:541-543`). |
| `skill_agent` | overlay | pass | `.skilled/agents/code.md:110` carries the advisor-named `local-*` fallback the phase-3 summary describes; `.opencode/agents/code.md` is byte-identical to the canonical file. |
| `agent_cross_runtime` | overlay | pass | `.claude/agents/code.md:95` carries the same fallback in Claude's frontmatter form (the two files differ only in tool/permission frontmatter, as the runtime requires). |
| `feature_catalog_code` | overlay | pass | The hub's feature catalogs carry no removed-surface token; the advisor's `auto-indexing/provenance-and-trust-lanes.md` names the cross-skill-edge module the packet changed. |
| `playbook_capability` | overlay | partial | The pre-commit harness carries seven cases for the guard; neither manual-testing playbook carries a row for it (folded into R5-P2-001). |

Acceptance coverage by phase (rows as recorded in each table):

| Phase | Rows | Met | Unmet | Waived |
|---|---|---|---|---|
| 001-ignore-and-commit-guard | 15 | 15 | 0 | 0 |
| 002-hub-surface-removal | 14 | 13 | 1 (AC-014; AC-013 contradicts itself) | 0 |
| 003-advisor-vocabulary-cleanup | 41 | 38 | 2 (AC-026, AC-027) | 1 (AC-035, ADR-008) |
| 004-private-local-skills | 22 | 22 | 0 | 0 |
| 005-leak-and-routing-verification | 15 | 15 | 0 | 0 |
| **Total** | **107** | **103** | **3** | **1** |

## Next Dimension

None — iteration 5 of 5. The run stops on `maxIterationsReached`; synthesis compiles the report.

## Verdict

Two P2 advisories. Acceptance coverage is complete in the sense that every row is accounted for and the waiver is backed by an existing ADR; the remaining gaps are documentation currency, and the substantive contradictions were recorded in iteration 3.

Review verdict: PASS
