# Iteration 1: Correctness + Traceability

## Focus
- Dimensions: D1 Correctness (shell header robustness), D3 Traceability (spec/implementation alignment, feature catalog, spec_code protocol)
- Files reviewed:
  - `.opencode/commands/memory/search.md`
  - `.opencode/commands/memory/assets/search_presentation.txt`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/spec.md`
  - `.../plan.md`
  - `.../tasks.md`
  - `.../implementation-summary.md`

## Scorecard
- Dimensions covered: correctness, traceability
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required
- **F001**: Shell arg-join header only escapes double quotes; other shell metacharacters are unhandled, `search.md:17`. The `bash -c` wrapper joins argv and escapes `"` to `\"`, but it does not escape `$`, backticks, backslashes, or single quotes. A `QUERY` containing those characters may break the emitted `QUERY="..."` line or the renderer's re-parse of the header output. The implementation summary's verification (lines 111-137) only exercises embedded double quotes and does not mention other metacharacters.

- **F002**: Canonical spec docs still contain template placeholders and do not reflect the implemented changes, `spec.md:85-109`, `plan.md:44-128`, `tasks.md:51-87`. The implementation-summary.md (lines 53-82) describes real changes to `search.md` and `search_presentation.txt`, including a shell header, salience inversion, and no-ask guard. However, `spec.md` lists `[Deliverable 1]`, `plan.md` lists `[Core feature 1]`, and `tasks.md` lists `T001 Create project structure` — none of which match the actual deliverables. This breaks spec/implementation traceability for the phase.

### P2, Suggestion
- **F003**: Level 1 spec folder lacks `checklist.md`, so the acceptance-coverage signal is unavailable and `checklist_evidence` protocol is marked not-applicable. Adding a lightweight checklist would let future reviews verify completion claims against evidence.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `spec.md:85-109`, `implementation-summary.md:53-82` | Spec placeholders do not resolve to the shipped implementation; only implementation-summary.md documents real behavior. |
| `checklist_evidence` | notApplicable | hard | - | No `checklist.md` exists in the spec folder. |
| `feature_catalog_code` | pass | advisory | `search.md:3-4` | Argument-hint and allowed-tools catalog match the implemented command surface. |
| `skill_agent` | notApplicable | advisory | - | Target is a spec folder, not a skill. |
| `agent_cross_runtime` | notApplicable | advisory | - | Target is a spec folder, not an agent. |
| `playbook_capability` | notApplicable | advisory | - | No playbook scenario file present. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: All three findings are new. F001 identifies a correctness gap in the shell header beyond the verified double-quote case. F002 identifies a spec/implementation alignment gap. F003 is a process-advisory gap.

## Ruled Out
- "Renderer fully sanitizes $ARGUMENTS": Ruled out because the contract itself warns that inside `` !`…` `` the injection expands `$ARGUMENTS` like `"$@"` and the renderer must join argv itself, implying the renderer is responsible for safe expansion. No evidence of additional escaping is documented.
- "Spec docs intentionally left as scaffolds": Partially plausible; if a parent-level doc supersedes them, that should be cross-linked. No such cross-link was found in the child-phase files.

## Dead Ends
- Attempted to test the exact header with a single-quote argument; the outer zsh rejected the command before reaching the bash wrapper, confirming fragility in the surrounding shell parse rather than the inner bash logic. This supports F001 but does not prove a runtime exploit path under the opencode renderer.

## Recommended Next Focus
If a second iteration were allowed: D2 Security (audit the `!` shell injection surface and argument sanitization guarantees) and D4 Maintainability (template cleanup and documentation alignment).

## Claim Adjudication Packets

### F001
```json
{
  "findingId": "F001",
  "claim": "The shell header's arg-join only escapes embedded double quotes and does not sanitize other shell metacharacters, so a query containing a single quote, backtick, dollar, or backslash can break the QUERY=\"...\" emission or the renderer's re-parse of the header output.",
  "evidenceRefs": [".opencode/commands/memory/search.md:17"],
  "counterevidenceSought": "Read implementation-summary.md verification section; it only tests double-quote escaping and does not mention single quotes, backticks, or backslashes. Tested the equivalent bash -c invocation with a single-quote argument and zsh rejected it as unmatched quote.",
  "alternativeExplanation": "The opencode command renderer may sanitize $ARGUMENTS before shell expansion, making this a theoretical concern only.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "If the renderer is confirmed to escape all shell metacharacters before expansion, downgrade to P2.",
  "transitions": [{"iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

### F002
```json
{
  "findingId": "F002",
  "claim": "The canonical spec.md, plan.md, and tasks.md files still contain template placeholders and do not describe the actual implementation delivered in this phase.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/spec.md:85-109",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/plan.md:44-128",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/tasks.md:51-87",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/implementation-summary.md:53-82"
  ],
  "counterevidenceSought": "Checked the entire spec folder; no separate filled-in requirements document exists. The implementation-summary.md is the only document describing real deliverables.",
  "alternativeExplanation": "The parent packet (017) may consolidate requirements elsewhere and intentionally leaves child-phase spec docs as scaffolds.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "If a parent-level requirements document explicitly references and supersedes these child-phase placeholders, downgrade to P2.",
  "transitions": [{"iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

Review verdict: CONDITIONAL
