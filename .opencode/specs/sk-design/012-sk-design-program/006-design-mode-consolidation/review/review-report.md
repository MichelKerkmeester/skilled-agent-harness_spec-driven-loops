# Deep Review Report: sk-design Mode Consolidation

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **Release readiness:** in-progress
- **hasAdvisories:** false
- **Active findings:** P0=0, P1=4, P2=3
- **Stop reason:** `maxIterationsReached`
- **Iterations:** 5 of 5
- **Dimension coverage:** 4/4 (`correctness`, `security`, `traceability`, `maintainability`)
- **Merged lineage:** `sol` (`cli-codex`, `gpt-5.6-sol`)

The four-mode registry and three-command public surface are internally consistent, and no P0 was found. Release readiness remains conditional because four required fixes survived the final adversarial replay: retired mode ownership remains active in a live handoff contract, md-generator has an unchecked secondary write target, the spec retains a security requirement contradicted by the accepted retirement decision, and three retained foundations procedure cards are not selectable through the live interface contract.

## 2. Planning Trigger

`/speckit:plan` is required. The active P1 findings span runtime write containment, command-to-skill handoff semantics, packet requirements, and interface procedure discovery; they should be fixed as separate but coordinated workstreams.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "P1-001",
      "severity": "P1",
      "findingClass": "cross-consumer",
      "file": ".opencode/skills/sk-design/shared/sk-code-handoff.md:61",
      "title": "Retired foundations and audit identities remain in the live sk-code handoff contract"
    },
    {
      "id": "P1-002",
      "severity": "P1",
      "findingClass": "cross-consumer",
      "file": ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275",
      "title": "Guided md-generator can delete and rewrite an arbitrary --design-md path outside the output policy"
    },
    {
      "id": "P1-003",
      "severity": "P1",
      "findingClass": "matrix/evidence",
      "file": ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157",
      "title": "Active security NFR still requires retired audit shell/path gates to remain intact"
    },
    {
      "id": "P1-004",
      "severity": "P1",
      "findingClass": "cross-consumer",
      "file": ".opencode/skills/sk-design/design-interface/SKILL.md:87",
      "title": "Retained foundations procedure cards are absent from the live interface selection contract"
    }
  ],
  "remediationWorkstreams": [
    "Write-boundary enforcement for md-generator",
    "Retired-identity contract cleanup",
    "Packet requirement reconciliation",
    "Foundations procedure-card selection and schema alignment",
    "Advisory metadata and examples cleanup"
  ],
  "specSeed": [
    "Replace or supersede the audit-gate security NFR with the accepted retirement security contract.",
    "Require every md-generator mutation target to pass the shared output policy or a separately documented confirmation policy.",
    "Define whether retained foundations procedure cards are selectable production resources or historical artifacts."
  ],
  "planSeed": [
    "Guard --design-md before every delete/write path and add negative tests.",
    "Remove retired foundations/audit ownership from live handoff and shared schema contracts.",
    "Wire the retained procedure cards into interface selection or explicitly retire them.",
    "Reconcile packet/checklist metadata and rerun the pending release gates."
  ],
  "findingClasses": [
    "cross-consumer",
    "matrix/evidence",
    "instance-only"
  ],
  "affectedSurfacesSeed": [
    "sk-design shared handoff",
    "design-md-generator guided runner",
    "design-interface procedure selection",
    "mode-consolidation packet",
    "shared procedure/proof documentation"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1-001: Retired identities remain in the live sk-code handoff contract

- **Severity / dimension:** P1 / correctness
- **Evidence:** `.opencode/skills/sk-design/shared/sk-code-handoff.md:61`, `:71`, `:105`; current commands load the contract at `.opencode/skills/sk-design/command-metadata.json:61`.
- **Impact:** A current implementation handoff can still speak `foundations` or `audit` as owned modes after the registry and commands retired them.
- **Fix:** Rewrite the handoff schema around the four registered modes, or mark legacy cards explicitly historical and remove them from live command choreography.
- **Disposition:** active; confirmed again in iteration 5.
- **Finding class / scope proof:** `cross-consumer`; current command metadata consumes the stale shared contract.
- **Affected surfaces:** `/interface:design`, sk-design to sk-code handoff, retired-identity cleanup.

### P1-002: `--design-md` bypasses the shared output policy

- **Severity / dimension:** P1 / security
- **Evidence:** only `--output` is policy-resolved at `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:165`; `--design-md` is independently resolved at `:275`, then deleted and rewritten at `:337` and `:349`.
- **Impact:** The guided STUDY retry path can mutate a caller-selected file outside the allowlisted output boundary.
- **Fix:** Route `--design-md` through an equivalent positive allowlist/confirmation contract before mutation and add unsafe-path negative tests.
- **Disposition:** active; confirmed again in iteration 5. It remains P1, not P0, because the path is local and user supplied.
- **Finding class / scope proof:** `cross-consumer`; the secondary write target bypasses the shared `output-policy.ts` contract.
- **Affected surfaces:** `/interface:design-reference`, guided-run wrapper, STUDY retry, output-policy tests.

### P1-003: Active security NFR contradicts the accepted audit retirement

- **Severity / dimension:** P1 / traceability
- **Evidence:** `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157` requires audit shell/path gates to remain intact; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:151-153` retires audit; `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:81` marks the corresponding gate N/A.
- **Impact:** Release readers cannot determine whether the audit security gate is required, waived, or superseded.
- **Fix:** Mark the NFR superseded or replace it with the accepted retirement security rationale and surviving write-boundary controls.
- **Disposition:** active; confirmed again in iteration 5.
- **Finding class / scope proof:** `matrix/evidence`; active spec, accepted decision, and checklist disagree.
- **Affected surfaces:** security requirements, strict packet validation, release-readiness evidence.

### P1-004: Retained foundations procedure cards are not selectable

- **Severity / dimension:** P1 / maintainability
- **Evidence:** the live selection sets at `.opencode/skills/sk-design/design-interface/SKILL.md:87` and `:180-188` omit `component-system-inventory`, `hierarchy-rhythm-review`, and `tweakable-design-controls`; command choreography repeats the omission at `.opencode/skills/sk-design/command-metadata.json:51`. The retained cards exist and carry active triggers.
- **Impact:** The consolidation preserved these resources on disk but made them unreachable through the procedure-selection contract agents are told to follow.
- **Fix:** Add explicit selection mappings and satisfy the procedure-card schema, or mark/remove the files and their release-playbook expectations as non-selectable history.
- **Disposition:** active; confirmed again in iteration 5.
- **Finding class / scope proof:** `cross-consumer`; source inventory, live selection tables, command choreography, and schema checker disagree.
- **Affected surfaces:** `/interface:design`, `VISUAL_SYSTEM`, interface procedures, release playbook.

### P2 Advisories

| ID | Evidence | Advisory |
|----|----------|----------|
| P2-001 | `.opencode/skills/sk-design/shared/design-proof-token.md:68` | Validator-facing proof-token example still uses retired `foundations` as a workflow mode. |
| P2-002 | `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:3` | Checklist frontmatter still describes the superseded permanent-subworkflow relocation target. |
| P2-003 | `.opencode/skills/sk-design/shared/procedure-card-schema.md:56`, `:72`, `:119-120`; `.opencode/skills/sk-design/shared/creation-contract.md:167`, `:169` | Maintainer-facing shared contracts still bless retired foundations/audit owners. |

## 4. Remediation Workstreams

1. **Write containment: P1-002**
   Apply policy validation to every md-generator mutation target and add tests for unsafe `--design-md` paths and the delete/rewrite retry branch.
2. **Live ownership-contract cleanup: P1-001, P2-001, P2-003**
   Remove retired mode vocabulary from current handoff, proof-token, procedure-card, and creation contracts. Keep historical examples only where explicitly labeled and excluded from routing and validation.
3. **Interface procedure reachability: P1-004**
   Decide whether the three retained foundations cards are production-selectable. Align `design-interface/SKILL.md`, command metadata, card schema, and playbook evidence with that decision.
4. **Packet reconciliation: P1-003, P2-002**
   Reconcile the security NFR and checklist metadata with the accepted retirement outcome. Preserve the explicit pending status of styles equality, benchmark, compiled-route drift, and strict validation.
5. **Release-gate closure**
   Run the pending styles hash comparison, fresh benchmark, compiled-route drift checks, and strict packet validation only after the P1 fixes land.

## 5. Spec Seed

- Require the four registered modes to be the only active ownership vocabulary across router, handoff, proof, and procedure contracts.
- Require all md-generator file mutations, including secondary retry targets, to use a declared write policy.
- Define the retained foundations procedure cards as either selectable interface resources with explicit routing or historical/non-selectable artifacts.
- Replace the stale audit security NFR with the surviving accepted-retirement boundary guarantees.

## 6. Plan Seed

1. Fix `guided-run.ts` write containment and add negative tests.
2. Clean live shared contracts of retired `foundations`/`audit` ownership.
3. Wire or retire the three retained foundations procedure cards and make the schema checker green.
4. Reconcile `spec.md` security requirements and checklist frontmatter.
5. Rerun command, corpus, parent-hub, procedure-card, styles, benchmark, compiled-routing, and strict SpecKit gates.
6. Replay the four P1 findings across producer, consumer, and test surfaces before changing the release-readiness state.

## 7. Traceability Status

| Protocol | Level | Status | Evidence / unresolved gap |
|----------|-------|--------|---------------------------|
| `spec_code` | core | partial | Four-mode/three-command topology matches source, but P1-003 leaves an active spec contradiction and P1-001/P1-004 leave live contract drift. |
| `checklist_evidence` | core | partial | Pending styles, benchmark, compiled-routing, and strict validation are honestly recorded; P1-003 and P2-002 require reconciliation. |
| `skill_agent` | overlay | partial | Hub, registry, commands, interface skill, handoff, and md-generator boundaries were directly reviewed; four P1s remain. |
| `agent_cross_runtime` | overlay | notApplicable | No agent-definition or runtime-mirror change is claimed by this packet. |
| `feature_catalog_code` | overlay | notApplicable | Historical catalogs were excluded unless consumed by a live contract. |
| `playbook_capability` | overlay | partial | Release-playbook expectations support P1-004, but no manual playbook run was performed. |
| `AC_COVERAGE` | advisory | advisory-shortfall | Lifecycle predicate applies; exact covered/total is UNKNOWN because strict validation was intentionally not run during the read-only lineage. Pending checklist rows remain. |

`resource-map.md` was absent at initialization, so the conditional Resource Map Coverage Gate section is not emitted.

## 8. Deferred Items

- P2-001, P2-002, and P2-003 are advisory cleanup and can follow the P1 work if the same files are not already being edited.
- The packet already identifies styles SHA-256 equality, a fresh design benchmark, compiled-route drift evidence, and `validate.sh --strict` as pending. This review did not convert those honest pending items into defects.
- The code graph was unavailable; every finding was grounded in direct line reads, exact searches, producer/consumer tracing, or local test/checker evidence.

## Dimension Expansion Map

- **Completed pivots:** 0
- **Failed pivots:** 0
- **Audited overrides:** 0
- **Swept directions:** correctness, security, traceability, maintainability, final adversarial replay.
- **Selected final direction:** counterevidence replay of all four P1s plus negative-test inspection of the md-generator boundary.
- **Remaining frontier:** implementation remediation and post-fix replay; no additional review direction was left open inside this five-iteration lineage.

## 9. Search Ledger

- **Graph mode:** unavailable; graphless fallback used.
- **Candidate coverage:** direct source contracts, command consumers, write producers, test consumers, packet evidence matrices, and one schema checker were covered across the five iterations.
- **Search debt:** none recorded by the reducer.
- **Ruled out:** public command-count drift; missing `VISUAL_SYSTEM` resource files; Open Design transport tool-grant escalation; false completion claims for the explicitly pending release gates; P0 exploitability for the local guided-run path.
- **Clean-search proof:** iteration 5 found no new finding after adversarial replay and inspection of uncovered guided-run tests.

## 10. Audit Appendix

| Iteration | Focus | New P0/P1/P2 | `newFindingsRatio` | Verdict |
|-----------|-------|--------------|--------------------|---------|
| 1 | correctness | 0 / 1 / 1 | 1.0000 | CONDITIONAL |
| 2 | security | 0 / 1 / 0 | 0.4545 | CONDITIONAL |
| 3 | traceability | 0 / 1 / 1 | 0.3529 | CONDITIONAL |
| 4 | maintainability | 0 / 1 / 1 | 0.2609 | CONDITIONAL |
| 5 | stabilization / replay | 0 / 0 / 0 | 0.5000 | CONDITIONAL |

### Convergence and Stop Evidence

- `stopPolicy=max-iterations`; convergence before iteration 5 was telemetry only.
- The reducer ended with `convergenceScore=0.5`, dimension coverage 4/4, P0=0, P1=4, P2=3, and zero JSONL corruption warnings.
- Iteration 5 produced no new findings; its ratio reflects refinement/adjudication weight across the seven active findings.
- The terminal stop reason is `maxIterationsReached`, not early convergence.

### Adversarial Replay

All four P1s were re-read against source and counterevidence in iteration 5. None met its downgrade trigger. No P0 was confirmed.

### Core Protocols

- `spec_code`: partial; active drift remains.
- `checklist_evidence`: partial; evidence is honest but incomplete and one active requirement conflicts with the accepted decision.

### Overlay Protocols

- `skill_agent`: partial.
- `agent_cross_runtime`: notApplicable.
- `feature_catalog_code`: notApplicable.
- `playbook_capability`: partial.
