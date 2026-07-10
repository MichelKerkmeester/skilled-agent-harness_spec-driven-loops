# Deep Review Iteration 010

## Dimension

- Correctness and security for `.opencode/skills/sk-design/design-audit/**` only.
- Focus: audit framing, reference consistency, internal links, tool-surface safety, and `/design:audit` command metadata coverage.

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:1`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:133`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:9`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/sk-design/mode-registry.json:26`
- `.opencode/skills/sk-design/mode-registry.json:103`
- `.opencode/skills/sk-design/command-metadata.json:3`
- `.opencode/skills/sk-design/command-metadata.json:49`
- `.opencode/skills/sk-design/design-audit/SKILL.md:31`
- `.opencode/skills/sk-design/design-audit/SKILL.md:105`
- `.opencode/skills/sk-design/design-audit/SKILL.md:152`
- `.opencode/skills/sk-design/design-audit/SKILL.md:182`
- `.opencode/skills/sk-design/design-audit/SKILL.md:291`
- `.opencode/skills/sk-design/design-audit/SKILL.md:305`
- `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:144`
- `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:146`
- `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:42`
- `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:41`
- `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18`
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md:97`
- `.opencode/skills/sk-design/design-audit/references/transform_remediation.md:24`
- `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md:26`

## Findings by Severity

### P0

- None.

### P1

#### P1-010-001 [P1] `/design:audit` metadata omits the packet's required procedure-card surface

- Claim: `/design:audit` command metadata does not enumerate the design-audit procedure cards even though the packet makes procedure-card selection part of the runtime routing/proof contract.
- Evidence: `.opencode/skills/sk-design/command-metadata.json:49` through `.opencode/skills/sk-design/command-metadata.json:52` load only `design-audit/references/` and assets for the audit workflow, while `.opencode/skills/sk-design/design-audit/SKILL.md:291` through `.opencode/skills/sk-design/design-audit/SKILL.md:299` require selecting and citing one of `procedures/accessibility_audit.md`, `procedures/ai_slop_check.md`, or `../shared/procedures/polish_gate_orchestration.md`. The feature catalog also states the packet has two private procedure cards at `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18` through `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:26`.
- Counterevidence sought: I checked whether `/design:audit` had task projections or choreography rows naming `procedures/`; it has harden/polish task projections at `.opencode/skills/sk-design/command-metadata.json:81` through `.opencode/skills/sk-design/command-metadata.json:104`, but those reference only `references/` files and do not cover the procedure-card surface.
- Alternative explanation: The metadata may treat procedures as internal implementation details under `SKILL.md`; however, the packet states the private procedure-card selection table is part of the routing contract and must be cited before audit output.
- FinalSeverity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if the command metadata contract is explicitly amended to require only public references and to delegate all procedure-card discovery to `SKILL.md` without metadata enumeration.

#### P1-010-002 [P1] AI-fingerprint routing lists a JSON registry that its own loader rejects

- Claim: The documented anti-pattern resource loader cannot load the machine-checkable AI fingerprint registry it promises to load.
- Evidence: `.opencode/skills/sk-design/design-audit/SKILL.md:105` lists `assets/ai_fingerprint_registry.json` as a conditional resource for model-specific AI tells, and `.opencode/skills/sk-design/design-audit/SKILL.md:152` includes the same JSON path in `RESOURCE_MAP`. The same pseudocode rejects non-Markdown resources at `.opencode/skills/sk-design/design-audit/SKILL.md:182` through `.opencode/skills/sk-design/design-audit/SKILL.md:183` and discovers only `*.md` resources at `.opencode/skills/sk-design/design-audit/SKILL.md:186` through `.opencode/skills/sk-design/design-audit/SKILL.md:191`.
- Counterevidence sought: I checked the Markdown fallback: `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md:26` says the JSON registry is the structured mirror, and `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md:15` depends on one prompt per registry row. The Markdown catalog exists, but the structured registry path remains unreachable by the documented router.
- Alternative explanation: The registry could be intended only for maintainer validation rather than runtime loading; the SKILL.md resource table and `RESOURCE_MAP` still present it as a routable conditional resource.
- FinalSeverity: P1.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the JSON registry is removed from runtime `RESOURCE_MAP` and documented strictly as a maintainer-only validation artifact.

#### P1-010-003 [P1] Audit report template requires a Python deterministic check despite the audit mode forbidding Bash

- Claim: The design-audit packet tells report authors to run a deterministic Python check for performance evidence while the mode's tool surface and direct-fallback contract forbid Bash/command execution.
- Evidence: `.opencode/skills/sk-design/mode-registry.json:106` through `.opencode/skills/sk-design/mode-registry.json:110` allow only Read/Glob/Grep and forbid Bash for audit mode. `.opencode/skills/sk-design/design-audit/SKILL.md:305` says direct audit execution cannot rely on Write, Edit, Bash, or Task. Yet `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:144` says the deterministic check confirms required performance evidence fields, and `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:146` names `../scripts/perf_evidence_check.py <filled-report.md>` as that check.
- Counterevidence sought: I checked whether the performance reference requires measurement labels without command execution; `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md:125` through `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md:127` allow static-risk labeling when metrics are unavailable, but that does not remove the template's deterministic-check instruction.
- Alternative explanation: The check may be maintainer-side validation for a completed report artifact, not part of interactive audit mode. The template does not mark it maintainer-only, and it appears inside the runtime report skeleton.
- FinalSeverity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if the template labels the Python check as optional/offline maintainer validation and provides an equivalent Read/Grep-only audit-mode proof path.

### P2

#### P2-010-004 [P2] Procedure cards use broken sibling-mode relative links

- Claim: Two design-audit procedure cards point at sibling mode procedures with `../design-*` paths that resolve under `design-audit/` rather than to sibling packets.
- Evidence: `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:42` through `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:45` cite `../design-motion/procedures/interaction_states_pass.md`; from inside `design-audit/procedures/`, that resolves to `design-audit/design-motion/procedures/interaction_states_pass.md`, which does not exist. `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:41` through `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:44` similarly cite `../design-foundations/procedures/hierarchy_rhythm_review.md`, resolving to a non-existent `design-audit/design-foundations/...` path. The intended sibling files do exist at `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md` and `.opencode/skills/sk-design/design-foundations/procedures/hierarchy_rhythm_review.md`.
- FinalSeverity: P2.
- Confidence: 0.9.

## Traceability Checks

- `spec_code`: PASS with findings. `mode-registry.json` correctly declares `workflowMode: audit`, `proceduresPath: design-audit/procedures`, `packetSkillName: design-audit`, and a Read/Glob/Grep-only tool surface at `.opencode/skills/sk-design/mode-registry.json:103` through `.opencode/skills/sk-design/mode-registry.json:121`; findings identify docs/metadata that fail to match that contract.
- `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not modify checklist completion state.
- `skill_agent`: PASS. No sub-agents were dispatched; review stayed within the LEAF assignment.
- `agent_cross_runtime`: N/A. The target is a skill packet; no runtime agent definitions were modified or dispatched.
- `feature_catalog_code`: PARTIAL. The procedure-card catalog accurately inventories two cards, but command metadata omits the procedure-card surface.
- `playbook_capability`: PARTIAL. Manual playbook scope was sampled via catalog and README; detailed maintainability/sk-doc playbook validation is assigned to iteration 11.

## Verdict

CONDITIONAL. This iteration found no P0s, but the three P1 findings block a PASS for the design-audit correctness/security surface.

## Next Dimension

Iteration 11 should continue with the parallel traceability/maintainability/sk-doc assignment for the same packet, avoiding duplicate severity counting for P1-010-001 through P1-010-003 and P2-010-004.

Review verdict: CONDITIONAL
