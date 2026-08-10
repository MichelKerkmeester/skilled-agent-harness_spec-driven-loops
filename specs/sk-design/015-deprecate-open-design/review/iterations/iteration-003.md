# Deep Review Iteration 003

## Dispatcher
- Mode: review
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus live referencing surfaces and `specs/sk-design/015-deprecate-open-design`
- Focus: traceability (`spec_code`, `checklist_evidence`; overlays `skill_agent`, `agent_cross_runtime`)
- Budget profile: `verify`
- Lineage: session `rvw-2026-08-10-deprecate-open-design`, generation 1, lineage `new`

## Files Reviewed
- `specs/sk-design/015-deprecate-open-design/spec.md`
- `specs/sk-design/015-deprecate-open-design/plan.md`
- `specs/sk-design/015-deprecate-open-design/tasks.md`
- `specs/sk-design/015-deprecate-open-design/checklist.md`
- `specs/sk-design/015-deprecate-open-design/decision-record.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/agents/design.md`, `.claude/agents/design.md`, `.codex/agents/design.toml`, `.pi/agents/design.md`
- `.opencode/agents/deep-alignment.md`, `.claude/agents/deep-alignment.md`, `.codex/agents/deep-alignment.toml`, `.pi/agents/deep-alignment.md`
- `.opencode/skills/sk-code/sk-code-review/references/review-core.md`

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **Claimed checklist items have no pinned evidence** -- `specs/sk-design/015-deprecate-open-design/checklist.md:22-24` -- CHK-001, CHK-002, and CHK-003 are marked `[x]`, but the checklist has no evidence column or command/result field. CHK-003 claims the Luna model, pi-subagents, and reducer were verified without a command, output, or linked artifact. This contradicts REQ-007's requirement that every completed P0/P1 item have an evidence column filled and leaves the pre-implementation claims unauditable.
   - Finding class: `matrix/evidence`
   - Scope proof: The same checklist declares the required evidence-bearing acceptance rows (`CHK-010` through `CHK-013`) unchecked at `checklist.md:30-33` and summarizes only `3/14` P0 and `2/12` P1 items verified at `checklist.md:88-94`; no alternate evidence field is present in the checklist surface.
   - Affected surface hints: [`checklist.md`, `spec.md` REQ-007, review-state artifacts, reducer/model verification]
   ```json
   {
     "type": "traceability",
     "claim": "The checklist presents CHK-001..003 as complete without auditable evidence, so REQ-007 cannot be satisfied by the current checklist artifact.",
     "evidenceRefs": [
       "specs/sk-design/015-deprecate-open-design/checklist.md:22-24",
       "specs/sk-design/015-deprecate-open-design/checklist.md:30-33",
       "specs/sk-design/015-deprecate-open-design/checklist.md:88-94",
       "specs/sk-design/015-deprecate-open-design/spec.md:145-147"
     ],
     "counterevidenceSought": "Checked the checklist headings, completion rows, summary, and the REQ-007 acceptance statement for a separate evidence ledger or linked command output; none was present.",
     "alternativeExplanation": "The checked rows may be scaffold-level attestations rather than final verification, but they are not labeled provisional and still lack evidence links.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "Add command/result or artifact references for each checked row (or uncheck provisional rows), then rerun and pin the final evidence after implementation."
   }
   ```

### P2 Findings
None.

## Traceability Checks

```json
[
  {
    "protocolId": "spec_code",
    "level": "core",
    "status": "partial",
    "counts": {"pass": 7, "partial": 2, "fail": 0, "total": 9},
    "evidence": [
      "specs/sk-design/015-deprecate-open-design/spec.md:91-147",
      "specs/sk-design/015-deprecate-open-design/plan.md:52-86",
      "specs/sk-design/015-deprecate-open-design/plan.md:112-130"
    ],
    "findingRefs": ["P1-001", "P1-002", "P1-003"]
  },
  {
    "protocolId": "checklist_evidence",
    "level": "core",
    "status": "partial",
    "counts": {"pass": 0, "partial": 3, "fail": 0, "total": 3},
    "evidence": [
      "specs/sk-design/015-deprecate-open-design/checklist.md:22-24",
      "specs/sk-design/015-deprecate-open-design/checklist.md:30-33",
      "specs/sk-design/015-deprecate-open-design/checklist.md:88-94"
    ],
    "findingRefs": ["P1-004"]
  },
  {
    "protocolId": "skill_agent",
    "level": "overlay",
    "status": "pass",
    "counts": {"pass": 2, "partial": 0, "fail": 0, "total": 2},
    "evidence": [
      ".opencode/skills/sk-design/SKILL.md:27,72-74,279-283",
      ".opencode/agents/design.md:63-79,91-92",
      ".pi/agents/design.md:57-73,85-86",
      "specs/sk-design/015-deprecate-open-design/plan.md:69-79"
    ],
    "findingRefs": []
  },
  {
    "protocolId": "agent_cross_runtime",
    "level": "overlay",
    "status": "pass",
    "counts": {"pass": 8, "partial": 0, "fail": 0, "total": 8},
    "evidence": [
      ".opencode/agents/design.md:63-92",
      ".claude/agents/design.md:49-78",
      ".codex/agents/design.toml:53-82",
      ".pi/agents/design.md:57-86",
      ".opencode/agents/deep-alignment.md:180,450",
      ".claude/agents/deep-alignment.md:165,435",
      ".codex/agents/deep-alignment.toml:169,439",
      ".pi/agents/deep-alignment.md:171,441",
      "specs/sk-design/015-deprecate-open-design/spec.md:119-121"
    ],
    "findingRefs": []
  }
]
```

**Protocol adjudication:** The plan does include all four runtime forms for both `design` and `deep-alignment`; `.claude` front matter, `.codex` TOML, and `.pi` Markdown are runtime-specific representations, not missed Open Design references. Both design-agent files still describe the transport, but that is an intended pre-removal state and the plan explicitly lists those files for stripping. No additional cross-runtime P1 was established.

## Integration Evidence
- `sk-design/SKILL.md` remains the public hub and currently documents the transport as a mode/backend (`SKILL.md:27,72-74`); the plan names this hub for removal (`plan.md:52-60`).
- All four design agents and all four deep-alignment agents carry the same transport capability references; the plan's agent row covers all eight runtime surfaces (`plan.md:69-79`).
- The review-core doctrine loaded for severity classification requires concrete file:line evidence for active P1 findings (`.opencode/skills/sk-code/sk-code-review/references/review-core.md:31-34`).

## Edge Cases
- The review packet is pre-implementation: unchecked CHK-010..013 and other rows are expected to remain open, but checked rows still need evidence or an explicit provisional label.
- `spec_code` remains partial because the prior residue-regex, fixture-inventory, and env/path assertion findings remain active; this iteration did not retry those exhausted searches.
- Runtime-specific front matter/serialization differs (`.claude` tools metadata, `.codex` TOML, `.pi` Markdown), but each named path contains the transport claim and is in the plan inventory.
- Memory/code graph was unavailable; direct repository reads and targeted grep were used.

## Confirmed-Clean Surfaces
- Every REQ-001..009 has a named acceptance criterion in `spec.md:91-147`; the criteria are generally executable, subject to the active P1 gaps in REQ-003/004 and REQ-007 evidence.
- The plan explicitly includes all eight requested agent/runtime files, so no runtime-specific Open Design reference was omitted from the declared agent inventory.
- No P0 security, auth, or destructive-data-loss condition was found.

## Ruled Out
- No new P0 condition.
- No additional P1 for `skill_agent` or `agent_cross_runtime`; both overlays have complete named paths and planned removal actions.
- No review-target edits were made.

## Next Focus
- dimension: maintainability
- focus area: removal-plan clarity, stale/duplicate instructions, safe follow-on changes, and review-artifact consistency
- reason: traceability reviewed; one new P1 evidence gap plus three carried P1s remain active
- rotation status: traceability completed conditionally
- blocked/productive carry-forward: productive — preserve P1-001, P1-002, P1-003, and P1-004; do not retry exhausted approaches
- required evidence: plan/task/checklist synchronization, duplicate residue gates, stale instructions, and maintainability risks across the declared live inventory

Review verdict: CONDITIONAL