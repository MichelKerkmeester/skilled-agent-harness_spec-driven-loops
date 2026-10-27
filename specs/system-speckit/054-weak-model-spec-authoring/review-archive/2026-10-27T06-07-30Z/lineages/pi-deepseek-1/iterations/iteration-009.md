# Iteration 9: Traceability overlay - the one agent that names the card

## Dimension

Traceability, overlay protocol `agent_cross_runtime`. The doc-authoring agent file phase 006 edited, its four runtime mirrors, and the phase 006 handoff criterion that names what an authoring surface must say.

## Files Reviewed

- `.skilled/agents/markdown.md:208` (the `spec-doc` row)
- `.claude/agents/markdown.md:194`, `.opencode/agents/markdown.md:208`, `.cursor/agents/markdown.md:194`, `.pi/agents/markdown.md` (same row)
- `.skilled/agents/*.md` (twelve files, scanned for the card, the token rule and the guards)
- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:155` (phase 006 handoff criterion)
- `.skilled/agents/`, `.claude/agents/`, `.opencode/agents/`, `.codex/agents/`, `.cursor/agents/`, `.pi/agents/`, `.devin/agents/`, `.hermes/agents/` (inventory)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The only agent that names the card names neither the token rule nor the guards** - `.skilled/agents/markdown.md:208` - The phase 006 handoff criterion asks that a doc-authoring agent "names the card, the v2.3 token and the guard scripts where it describes authoring" ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/spec.md:155]). `markdown.md`'s `spec-doc` row now sends a reader to the card first and to the matching filled example second ([SOURCE: .skilled/agents/markdown.md:208]), which is the card half of the criterion. The same file mentions `[YOUR_VALUE_HERE:` nowhere and neither `check-example-drift.sh` nor `check-card-sync.sh` anywhere; a scan of all twelve `.skilled/agents` files finds `markdown.md` as the only file that names the card at all, and it is 1 / 0 / 0 on card / token / guards. So the agent surface satisfies one third of the criterion, and the command-side instance of the same gap is already on record from wave 1 (`speckit-implement.yaml`), which makes this the surviving carrier rather than a duplicate of it.
   Finding class: incomplete-alignment
   Scope proof: every agent file under `.skilled/agents` was scanned for all three markers with `grep -c`, and the `spec-doc` row was read in all five mirrors that ship the file.
   Affected surface hints: markdown agent definition, phase 006 handoff criterion, doc-authoring agent row
   Case: a worker dispatched to author a spec folder reads `markdown.md`, follows the card, and never learns that an unfilled token fails validation after Draft or that two guards exist.

## Verified In This Pass

- **Mirror parity.** Five runtimes ship `markdown.md` (`.skilled`, `.claude`, `.opencode`, `.cursor`, `.pi`). The authoring row is byte-identical in content across all five; the files differ only in their runtime frontmatter and tool lines (330 lines against 316). A reader gets the same authoring sentence in every runtime that has the agent.
- **Coverage of the scan.** Twelve `.skilled` agent files were scanned for the three markers; `markdown.md` is the sole hit for the card, and no file hits the token or the guards. `.codex` and `.devin` ship no doc-authoring agent, which predates this packet and is outside its change surface, so no finding is raised for their absence.
- **Router side.** The four authoring intents in `SKILL.md` load the card and the long guide stays in the on-demand list, which matches the leaf claim reviewed in iteration 5.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `spec.md:155`; `.skilled/agents/markdown.md:208` | One of three named artifacts appears on the agent surface. |
| `checklist_evidence` | partial | hard | phase 006 acceptance rows for the agent edit | The row asserts the card reference, which is present. |
| `skill_agent` | pass | advisory | `SKILL.md` intent rows | The router matches the card claim. |
| `agent_cross_runtime` | partial | advisory | five mirrors, identical authoring row | Parity holds; completeness does not. |
| `feature_catalog_code` | pass | advisory | `spec-authoring-card.md:20-24` | The leaf's router claim is accurate. |
| `playbook_capability` | notApplicable | advisory | - | No scenario covers the agent surface. |

## Verdict

One P2 finding. The agent surface is consistent across every runtime that ships it, and it is one third complete against the criterion that governs it.

## Next Dimension

Completeness. The parent's file-by-file scope table, read against the tree the packet actually changed.

Review verdict: PASS
