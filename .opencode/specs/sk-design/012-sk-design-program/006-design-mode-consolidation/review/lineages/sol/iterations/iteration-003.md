# Deep Review Iteration 003

## Dispatcher

- Route proof: `Resolved route: mode=review target_agent=deep-review`
- Mode: review
- Target agent: deep-review
- Session: `fanout-sol-1785128932566-ou7z2l`
- Generation: 1
- Lineage mode: new
- Target: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation`
- Focus: traceability
- Focus area: `spec_code` and `checklist_evidence` fidelity for packet claims, remaining gates, ADR-002 supersession, styles/benchmark/strict-validation proof, and current source topology
- Budget profile: verify

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review-core.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/plan.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/tasks.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/implementation-summary.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/handover.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/command-metadata.json`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Active security NFR still requires retired audit shell/path gates to remain intact** -- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157` -- The spec still carries `NFR-S01` as an active security requirement that existing audit shell invocation and path-validation gates remain intact. ADR-002 says the operator retired `/interface:audit` entirely and deleted the audit surface, while the checklist marks the matching security row as N/A because there is no remaining audit gate to keep intact. That leaves a release-facing requirement contradicting both the accepted decision and checklist evidence, so completion readers cannot tell whether the audit security gate is required, waived, or superseded. [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:151`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:153`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:81`]

Finding class: matrix/evidence  
Scope proof: `spec.md` leaves the audit-gate requirement active, while ADR-002 and `checklist.md` explicitly classify the same audit gate as retired/N/A; current source checks also show the final topology is four modes, three commands, and no `commandSubworkflows`.  
Affected surface hints: ["spec security NFR", "ADR-002 retirement contract", "checklist security gate", "completion validation", "release readiness"]  
Content hash: `sha256:5d7f456b23db7885dae5da17c08cf3cd3691fbc268dd5fc83e06b8c010ca7b56`

```json
{
  "type": "gate-relevant-p1",
  "claim": "The packet has an active security requirement to preserve audit shell/path gates even though ADR-002 retired audit and the checklist marks that gate N/A.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157",
    ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:151",
    ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:153",
    ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:81"
  ],
  "counterevidenceSought": "Checked the implementation summary, handover, checklist security section, current mode registry, command metadata, and command-surface checker output. Those sources consistently say audit is retired, no audit command remains, and the remaining source topology has four modes and three commands.",
  "alternativeExplanation": "The line may be stale prose from ADR-001 rather than an intended live requirement. That still needs correction because it sits in the active NFR section without a superseded/N-A marker.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 only if the spec NFR is explicitly marked historical/superseded or rewritten to the ADR-002 toolSurface rationale before release gating."
}
```

### P2 Findings

1. **Checklist frontmatter still describes the superseded permanent-subworkflow verification target** -- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:3` -- The checklist body correctly marks `/interface:foundations`, `/interface:audit`, relocation accounting, and public subworkflow routing as superseded or N/A, but the document description still says the checklist verifies "permanent interface-owned foundations and audit workflows" and "exact relocations." This is metadata drift rather than a direct gate failure, but it can mislead memory/search consumers that summarize the packet from frontmatter. [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:3`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:59`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:60`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:72`; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:155`]

Finding class: instance-only  
Scope proof: The stale phrase is in checklist frontmatter only; body rows reviewed in this iteration consistently describe ADR-002 retirement and N/A treatment.  
Affected surface hints: ["checklist frontmatter", "memory search summaries", "resume context", "documentation verification"]  
Content hash: `sha256:a70ea03b63981409ff1605929343984fb9520274d1602b5401d4ac3f438a3a47`

## Traceability Checks

- `spec_code`: partial. Current source topology supports four registered modes, three commands, and no `commandSubworkflows`, but `spec.md` still has an active security NFR from the retired audit-gate plan.
- `checklist_evidence`: partial. The checklist honestly leaves styles equality, benchmark, strict validation, compiled-routing, and several compliance/docs checks pending, but its frontmatter description remains stale.
- `skill_agent`: partial. Current registry/command surfaces and `design-command-surface-check.mjs --json` support the four-mode/three-command topology; prior active P1s remain open.
- `agent_cross_runtime`: notApplicable. No agent-definition change was claimed.
- `feature_catalog_code`: notApplicable. Strategy marks prior feature-catalog/playbook retry paths blocked; this iteration did not broaden into those historical surfaces.
- `playbook_capability`: notApplicable. Strategy marks prior playbook retry paths blocked; this iteration treated benchmark/playbook old paths as historical unless used by current source.

## Integration Evidence

- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs --json` returned `status: valid`, `commandCount: 3`, `aliasCount: 9`, workflow modes `design-mcp-open-design`, `interface`, `md-generator`, and `motion`.
- Direct JSON read of `mode-registry.json` and `command-metadata.json` found modes `interface`, `motion`, `md-generator`, `design-mcp-open-design`, commands `/interface:design`, `/interface:design-reference`, `/interface:motion`, and no top-level `commandSubworkflows` field.
- Narrow `rg` over `.opencode/skills/sk-design` and `.opencode/commands/interface`, excluding `styles/`, `benchmark/`, `changelog/`, `review/`, and `scratch/`, found no live `design-audit/` or `design-foundations/` path references.

## Edge Cases

- The strategy's generated exhausted-approaches block incorrectly marks earlier "not covered" checklist paths as blocked. The dispatcher explicitly required `checklist_evidence`, so this pass reviewed checklist evidence rows while avoiding prior broad/noisy searches and prior command-surface retreads.
- Code graph data was unavailable; direct reads, exact source checks, and narrow searches were used as the graphless fallback.
- A broad old-path search accidentally entered benchmark corpora and produced historical hits; it was discarded for finding evidence and replaced by a narrowed search excluding benchmark/changelog/review/scratch paths.
- Historical benchmark reports and changelogs still contain old paths, but the packet explicitly treats them as historical evidence rather than live routing consumers.

## Confirmed-Clean Surfaces

- The packet repeatedly and explicitly marks styles SHA-256 equality, design benchmark, and `validate.sh --strict` as NOT run in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `handover.md`.
- The current command surface is valid for three commands and four modes according to `design-command-surface-check.mjs --json`.
- No live old-path references were found in the narrowed source/command search excluding historical corpora.

## Ruled Out

- No P0 candidate found.
- No new traceability finding for the unrun styles, benchmark, or strict-validation gates because the packet consistently marks them pending.
- No new finding for old-path references in benchmark/changelog corpora; those are historical by packet design.
- No restatement of prior P1/P2 findings without new traceability evidence.

## Next Focus

- dimension: maintainability
- focus area: topology clarity, stale terminology, dead references, duplicated evidence tables, and follow-on remediation cost
- reason: traceability added one P1 requirement drift and one P2 metadata drift; prior correctness/security P1s remain active
- rotation status: D1 correctness complete, D2 security complete, D3 traceability complete, proceed to D4 maintainability
- blocked/productive carry-forward: productive direct-read plus exact-search fallback; avoid broad searches through `styles/`, `benchmark/`, `review/`, `scratch/`, generated example corpora, and prior blocked playbook/feature-catalog retry paths
- required evidence: shared handoff/proof-token stale references, spec metadata/frontmatter drift, mode-registry transform-verb terminology, doctor/checker compatibility cost, and duplicated packet evidence tables

Review verdict: CONDITIONAL
