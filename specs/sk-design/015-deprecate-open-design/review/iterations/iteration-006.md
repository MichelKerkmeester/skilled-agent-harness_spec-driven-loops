# Deep Review Iteration 006

## Dispatcher
- Mode: review
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus every live referencing surface and the deprecation plan
- Focus: completeness sweep — sibling skills (maintainability/cross-surface)
- Budget profile: scan
- Route proof: `Resolved route: mode=review target_agent=deep-review`
- State lineage: session `rvw-2026-08-10-deprecate-open-design`, generation 1, lineageMode `new`

## Files Reviewed
- Sibling focus files named by dispatch: `.opencode/skills/mcp-code-mode/{references/tool-catalog.md,manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md}`; all seven named `mcp-tooling/mcp-figma` files; all six named `cli-external-orchestration` files; `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md`; all three named `sk-prompt/sk-prompt-improve` files.
- Plan boundary/evidence: `specs/sk-design/015-deprecate-open-design/{spec.md,plan.md,tasks.md}`.
- Severity doctrine: `.opencode/skills/sk-code/sk-code-review/references/review-core.md`.

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **Dedicated design-generation reference is not classified for deletion** — `.opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md:17-19,31-33,86-96,109-121` — This file is wholly about the retired Open Design `start_run` transport: its front matter, deliverable, tool commands, run mechanics, and final ownership links all point to `mcp-open-design`/Open Design. The plan covers the path only as “remove start_run/od patterns,” which describes stripping references rather than deleting the now-purpose-less file or replacing it with a defined transport-independent document. A literal strip would leave an empty or misleading reference, while retaining it leaves live transport references and a dangling `.opencode/skills/mcp-open-design/SKILL.md` ownership link.
   - Finding class: cross-consumer
   - Scope proof: The complete file was searched; every substantive section is tied to the retired transport, and `spec.md:126` plus `plan.md:81,112` name the path but specify only reference stripping.
   - Affected surface hints: [`sk-prompt-improve/SKILL.md`, `sk-prompt-improve/README.md`, `references/design-generation-patterns.md`, `spec.md Files to Change`, `tasks.md T028`]
   - Claim adjudication:
```json
{"type":"maintainability","claim":"The deprecation plan does not define a safe disposition for the transport-dedicated design-generation-patterns.md file: stripping references cannot both satisfy zero residue and preserve a meaningful document.","evidenceRefs":[".opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md:17-19",".opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md:31-33",".opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md:86-96",".opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md:109-121","specs/sk-design/015-deprecate-open-design/spec.md:126","specs/sk-design/015-deprecate-open-design/plan.md:81,112","specs/sk-design/015-deprecate-open-design/tasks.md:54"],"counterevidenceSought":"Checked the full reference, sibling SKILL/README ownership descriptions, and T028/path actions for a generic replacement scope or deletion instruction; none was found.","alternativeExplanation":"The file could be rewritten into generic design-generation guidance, but no rewrite boundary, surviving owner, or task acceptance check is specified.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Amend T028 and the Files to Change table to explicitly delete this file, or specify its complete generic rewrite plus updated links and a no-transport-content assertion."}
```

### P2 Findings
None.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` (core) | partial | `spec.md:92,123-126` and `plan.md:79,81,112` cover the sibling paths at directory/path level; `tasks.md:54` covers T028, but the dedicated design-generation file's required disposition is underspecified (P1-009). |
| `checklist_evidence` (core) | partial / carried | Prior unchecked evidence gap remains active (P1-004); no checklist rows were changed or re-adjudicated here. |
| `feature_catalog_code` (overlay) | partial / carried | Prior P1-008 token mismatch remains active; this sibling sweep found no new catalog surface in the declared files. |
| `playbook_capability` (overlay) | partial | `mcp-route-guard.md:127-129` and `mcp-figma/manual-testing-playbook.md:34` carry live or structural references and are covered by T028; `cli-dispatch-audit-trail.md` has no transport hit. |

## Integration Evidence
- `specs/sk-design/015-deprecate-open-design/spec.md:92,123-126` names the sibling surfaces and the design-generation path.
- `specs/sk-design/015-deprecate-open-design/plan.md:79,81,112` provides broad sibling actions but no delete/rewrite classification for the dedicated reference.
- `specs/sk-design/015-deprecate-open-design/tasks.md:54` assigns all sibling work to T028 without per-file acceptance criteria.
- No command, workflow, MCP/code tool, caller agent, or runtime mirror was modified; review remained read-only.

## Edge Cases
- `.opencode/skills/mcp-tooling/mcp-figma/references/tool-surface.md:153` says “open design files,” but in its Figma file-listing table this is a generic file description, not a transport identifier. Safest action is leave the line; the final gate must classify this ambiguity rather than blindly delete every case-insensitive `open design` phrase.
- `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md` had no retired-transport hit; leave unchanged despite T028's broad directory scope.
- All live hits found in the other requested files are explicitly covered by `spec.md:123-126`, `plan.md:79,81`, and `tasks.md:54`; no additional missed sibling file was proven.
- The existing P1-001..P1-008 findings remain active; no P0 condition was established.
- Memory/code graph unavailable; direct repository evidence was used.

## Confirmed-Clean Surfaces
- `mcp-code-mode` files were limited to the expected `open_design` catalog/route entries.
- `mcp-figma` scripts README, SKILL, README, and playbook contain expected comparison references; no hidden hit was found in the named files beyond the reported lines.
- All five named CLI runtime SKILL files contain the same live mode/pairing reference and are covered by T028; their audit-trail playbook has none.
- `sk-code` checklist has one expected `open_design` example, covered by the exact file row in the spec.

## Ruled Out
- No P0 security, auth, credential, or destructive-data-loss issue in this maintainability sweep.
- No finding that the plan omitted the declared sibling directories themselves; the issue is the action classification of one dedicated file.
- No recommendation to rewrite historical changelogs or benchmark material.

## Next Focus
- dimension: traceability
- focus area: final cross-reference synthesis for exact transport-token consistency and complete removal inventory
- reason: sibling sweep confirms broad T028 coverage but adds P1-009 for the dedicated design-generation reference disposition; P1-001..P1-008 remain active
- rotation status: completeness sibling-surface sweep completed conditionally in iteration 006
- blocked/productive carry-forward: productive — preserve P1-001..P1-009; do not retry exhausted approaches
- required evidence: explicit delete-versus-rewrite decision for `design-generation-patterns.md`, exact T028 path inventory, and post-removal residue proof
- recovery note: if the file is retained, provide a generic replacement scope and link/ownership updates before the final gate

Review verdict: CONDITIONAL