# Deep Review Strategy — Design Mode Consolidation

## 1. OVERVIEW

Review the shipped four-mode/three-command `sk-design` consolidation against its Level 3 packet, implementation surfaces, and recorded verification evidence.

## 2. TOPIC

`.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation` (`spec-folder`)

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — registry, router, command, and retained interface behavior
- [x] D2 Security — path handling, shell/process gates, trust boundaries, and removed safeguards
- [x] D3 Traceability — spec/code and checklist/evidence fidelity
- [x] D4 Maintainability — topology clarity, dead references, duplication, and safe follow-on cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not modify the reviewed target, implementation, commands, tests, or frozen styles tree.
- Do not reimplement the retired audit/foundations workflows.
- Do not treat historical benchmark reports or before-snapshots as live routing consumers.
- Do not write outside this lineage artifact directory.

## 5. STOP CONDITIONS

- Dispatch exactly five iterations; convergence before iteration 5 is telemetry only.
- Synthesize after iteration 5 or an unrecoverable workflow error.
- Any active P0 forces a FAIL verdict; active P1 forces CONDITIONAL.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 001 | Four-mode registry and three-command surface are coherent, but live sk-code handoff docs still name retired `foundations`/`audit`; proof-token example also uses invalid `foundations`. |
| Security | CONDITIONAL | 002 | Read-only command and transport boundaries are mostly legible, but md-generator guided-run checks `--output` through the shared policy while `--design-md` can be deleted and rewritten outside that policy. |
| Traceability | CONDITIONAL | 003 | Packet docs mostly avoid overclaiming unrun gates, but `spec.md` still carries an active audit shell/path-gate NFR that ADR-002 and the checklist mark retired/N/A; checklist frontmatter also names the superseded permanent-subworkflow verification target. |
| Maintainability | CONDITIONAL | 004 | Retained foundations procedure cards are present and release-relevant but omitted from the live interface procedure-selection contracts; shared procedure/proof contracts still bless retired foundations/audit owners as valid examples. |
| Stabilization | CONDITIONAL | 005 | Final adversarial replay found no new P0/P1/P2 findings, reconfirmed four active P1s and three active P2s, and kept the verdict conditional pending remediation. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 4 active
- **P2 (Minor):** 3 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2; four P1 findings reconfirmed as refinements
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Iteration 001: Direct line reads plus exact searches verified the registry/command surface and found stale retired identity usage in a live shared handoff contract.
- Iteration 001: `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs --json` confirmed the three-command/four-mode command surface is valid.
- Iteration 002: Focused reads of command wrappers, registry tool surfaces, md-generator output policy, guided-run, Open Design transport docs, and doctor checks isolated one concrete write-boundary bypass without broadening into generated/example corpora.
- Iteration 003: Packet-doc line reads plus current registry/command checks verified that styles equality, benchmark, and strict validation are honestly pending while isolating one active NFR mismatch and one stale checklist metadata issue.
- Iteration 004: Narrow procedure-card reads, exact selection-contract searches, resource-map existence checks, and `procedure-card-schema-check.mjs` isolated retained foundations procedure-card discoverability drift without reopening broad retired-identity searches.
- Iteration 005: Stabilization replay reread every active P1 source, inspected high-risk command contract tests, reran command-surface and procedure-card checks, and confirmed no new findings or downgrades.

## 9. WHAT FAILED

- Code graph is empty for this workspace; iterations must use cited direct reads and exact search as graphless fallback evidence.
- Iteration 001: A broad search over `.opencode/skills/sk-design` entered the style-library corpus and produced unusably noisy output; future searches should exclude `styles/`, `benchmark/`, and lineage `review/` directories unless specifically in scope.
- Iteration 002: The first security search was too broad and entered generated/example material; subsequent evidence came from exact reads and narrow searches only.
- Iteration 003: A broad old-path search entered historical benchmark corpora; use narrowed source searches excluding `benchmark/`, `changelog/`, `review/`, `scratch/`, and frozen/generated corpora when proving live references.
- Iteration 004: One exploratory search included an unescaped backtick pattern and was discarded as sole evidence; direct line reads and narrowed exact searches supplied the cited findings.
- Iteration 005: The final replay did not resolve or downgrade active P1s; counterevidence confirmed clean public routing but not stale shared contracts, unchecked `--design-md`, or active NFR drift.

## 10. EXHAUSTED APPROACHES (do not retry)

- Iteration 001: Broad unfiltered retired-identity search across the full `sk-design` tree; use narrowed globs excluding `styles/`, `benchmark/`, and `review/` instead.
- Iteration 002: Broad security keyword search across md-generator examples/corpus; use exact file reads or exclude generated/example corpora for future security work.
- Iteration 003: Broad old-path search across all `sk-design` benchmark history; use narrowed live-source searches excluding `benchmark/`, `changelog/`, `review/`, `scratch/`, and frozen/generated corpora.
- Iteration 004: Broad foundations/audit term sweeps across feature-catalog and manual-playbook history; use current selection contracts, schema checks, and exact retained-card names instead.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Iteration 001: Three-command surface mismatch ruled out for correctness; existing command-surface checker returned valid with commandCount=3.
- Iteration 001: Registry mode-count mismatch ruled out; `mode-registry.json` lists `interface`, `motion`, `md-generator`, and `design-mcp-open-design`.
- Iteration 001: Static visual-system reachability failure ruled out at the interface router layer; `VISUAL_SYSTEM` maps to relocated foundations references/assets.
- Iteration 002: No P0 security candidate found; no evidence of auth bypass, unprompted remote code execution, secret exposure, or destructive data loss outside an explicit local CLI path.
- Iteration 002: Open Design transport structural-interceptor concern ruled out as an active finding because the skill documents its prose-gate tradeoff and confines writes to the external tool rather than this repo.
- Iteration 002: Seven retained preflight checks ruled out as shell/path safety evidence; they are visual/content/motion readiness gates.
- Iteration 003: No traceability finding for styles equality, design benchmark, or `validate.sh --strict`; packet docs consistently mark all three gates pending.
- Iteration 003: No live old-path reference finding; narrowed source/command search excluding historical corpora found no `design-audit/` or `design-foundations/` paths.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis: preserve CONDITIONAL verdict with active P1/P2 findings, refresh reducer-owned outputs, and plan remediation for P1-001 through P1-004 without reopening exhausted broad searches.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the seven canonical packet documents, four hub/router metadata files, interface skill and preflight card, polish-gate procedure, three interface commands, and four verification scripts listed in `deep-review-config.json`.
- Behavior claims: exactly four registered modes, exactly three interface commands, no live audit/foundations identity, seven anti-slop checks retained, frozen styles unchanged, and command/corpus/checker gates green.
- Open verification claims: final styles SHA-256 equality, a fresh design benchmark, compiled-route drift, and strict SpecKit validation are explicitly still pending.
- Review risks: the packet records an accepted capability deletion; claims can be internally consistent yet under-evidenced. The workspace code graph is empty, so cited direct reads and exact searches are mandatory.
- Resource map: `resource-map.md` was not present at initialization; skip its coverage gate.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 004 | Current topology matches four modes/three commands/no commandSubworkflows, and visual-system resource files exist, but retained foundations procedure-card discoverability is inconsistent with live interface contracts |
| `checklist_evidence` | core | partial | 004 | Checklist frontmatter issue remains from iteration 003; iteration 004 did not reopen checklist rows beyond release-relevant manual-playbook support |
| `skill_agent` | overlay | partial | 004 | Hub, registry, command wrappers, md-generator policy, Open Design transport, doctor checks, and interface procedure-card contracts reviewed; retained foundations procedure cards fail live schema/selection consistency |
| `agent_cross_runtime` | overlay | notApplicable | 003 | No agent-definition change claimed |
| `feature_catalog_code` | overlay | partial | 001 | Foundations manual scenario checked as context; no manual run |
| `playbook_capability` | overlay | partial | 001 | Deleted public routes absent; retired identities remain in live handoff/proof docs |
<!-- MACHINE-OWNED: END -->

Final stabilization replay (iteration 005): `spec_code`, `checklist_evidence`, and `skill_agent` remain partial because P1-001 through P1-004 are still active; `agent_cross_runtime` and `feature_catalog_code` remain notApplicable; `playbook_capability` remains partial as supporting evidence only.

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

See `deep-review-config.json.reviewScopeFiles`; all entries start `pending`.
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-sol-1785128932566-ou7z2l, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-07-27T05:10:48Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 4
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: notApplicable. No agent-definition change was claimed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: notApplicable. No agent-definition change was claimed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: notApplicable. No agent-definition change was claimed.

### `agent_cross_runtime`: notApplicable. No agent-definition or runtime mirror change was claimed. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: `agent_cross_runtime`: notApplicable. No agent-definition or runtime mirror change was claimed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: notApplicable. No agent-definition or runtime mirror change was claimed.

### `checklist_evidence`: not covered in this correctness iteration beyond command-surface checker evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: not covered in this correctness iteration beyond command-surface checker evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not covered in this correctness iteration beyond command-surface checker evidence.

### `checklist_evidence`: partial. Not reopened as a checklist audit; maintainability evidence came from current contracts and release-relevant playbook lines only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: partial. Not reopened as a checklist audit; maintainability evidence came from current contracts and release-relevant playbook lines only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. Not reopened as a checklist audit; maintainability evidence came from current contracts and release-relevant playbook lines only.

### `checklist_evidence`: partial. The checklist accurately marks many ADR-002-superseded rows N/A and leaves unrun gates pending, but the stale frontmatter and active NFR conflict remain. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: partial. The checklist accurately marks many ADR-002-superseded rows N/A and leaves unrun gates pending, but the stale frontmatter and active NFR conflict remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The checklist accurately marks many ADR-002-superseded rows N/A and leaves unrun gates pending, but the stale frontmatter and active NFR conflict remain.

### `checklist_evidence`: partial. The checklist honestly leaves styles equality, benchmark, strict validation, compiled-routing, and several compliance/docs checks pending, but its frontmatter description remains stale. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: partial. The checklist honestly leaves styles equality, benchmark, strict validation, compiled-routing, and several compliance/docs checks pending, but its frontmatter description remains stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The checklist honestly leaves styles equality, benchmark, strict validation, compiled-routing, and several compliance/docs checks pending, but its frontmatter description remains stale.

### `checklist_evidence`: pending. This iteration did not re-run the packet checklist gates; it used implementation reads and existing tests as direct security evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: pending. This iteration did not re-run the packet checklist gates; it used implementation reads and existing tests as direct security evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pending. This iteration did not re-run the packet checklist gates; it used implementation reads and existing tests as direct security evidence.

### `feature_catalog_code`: notApplicable. Prior broad feature-catalog routes remain exhausted; this pass used current source, tests, and packet evidence only. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code`: notApplicable. Prior broad feature-catalog routes remain exhausted; this pass used current source, tests, and packet evidence only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: notApplicable. Prior broad feature-catalog routes remain exhausted; this pass used current source, tests, and packet evidence only.

### `feature_catalog_code`: notApplicable. Prior broad feature-catalog/playbook routes remain exhausted; this pass used only release-relevant manual-playbook lines as support for the retained procedure-card issue. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: notApplicable. Prior broad feature-catalog/playbook routes remain exhausted; this pass used only release-relevant manual-playbook lines as support for the retained procedure-card issue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: notApplicable. Prior broad feature-catalog/playbook routes remain exhausted; this pass used only release-relevant manual-playbook lines as support for the retained procedure-card issue.

### `feature_catalog_code`: notApplicable. Strategy marks prior feature-catalog/playbook retry paths blocked; this iteration did not broaden into those historical surfaces. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: notApplicable. Strategy marks prior feature-catalog/playbook retry paths blocked; this iteration did not broaden into those historical surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: notApplicable. Strategy marks prior feature-catalog/playbook retry paths blocked; this iteration did not broaden into those historical surfaces.

### `feature_catalog_code`: partial. The foundations manual routing scenario still documents correct mode resolution and a known resource-map gap; no manual run was performed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: partial. The foundations manual routing scenario still documents correct mode resolution and a known resource-map gap; no manual run was performed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: partial. The foundations manual routing scenario still documents correct mode resolution and a known resource-map gap; no manual run was performed.

### `feature_catalog_code`: pending. Not retried because the strategy marks prior partial feature-catalog coverage as blocked for this lineage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: pending. Not retried because the strategy marks prior partial feature-catalog coverage as blocked for this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pending. Not retried because the strategy marks prior partial feature-catalog coverage as blocked for this lineage.

### `playbook_capability`: notApplicable. Strategy marks prior playbook retry paths blocked; this iteration treated benchmark/playbook old paths as historical unless used by current source. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: notApplicable. Strategy marks prior playbook retry paths blocked; this iteration treated benchmark/playbook old paths as historical unless used by current source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: notApplicable. Strategy marks prior playbook retry paths blocked; this iteration treated benchmark/playbook old paths as historical unless used by current source.

### `playbook_capability`: partial. Prior playbook evidence remains a supporting signal for retained foundations cards; this pass did not rerun manual playbook scenarios. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: partial. Prior playbook evidence remains a supporting signal for retained foundations cards; this pass did not rerun manual playbook scenarios.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. Prior playbook evidence remains a supporting signal for retained foundations cards; this pass did not rerun manual playbook scenarios.

### `playbook_capability`: partial. Static visual-system reachability is present through `VISUAL_SYSTEM` in `design-interface/SKILL.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: partial. Static visual-system reachability is present through `VISUAL_SYSTEM` in `design-interface/SKILL.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. Static visual-system reachability is present through `VISUAL_SYSTEM` in `design-interface/SKILL.md`.

### `playbook_capability`: partial. The playbook still expects the foundations procedure-card scenarios, which supports the active-discoverability finding; no manual scenario was executed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: partial. The playbook still expects the foundations procedure-card scenarios, which supports the active-discoverability finding; no manual scenario was executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. The playbook still expects the foundations procedure-card scenarios, which supports the active-discoverability finding; no manual scenario was executed.

### `playbook_capability`: pending. Not retried because the strategy marks prior partial playbook coverage as blocked for this lineage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability`: pending. Not retried because the strategy marks prior partial playbook coverage as blocked for this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pending. Not retried because the strategy marks prior partial playbook coverage as blocked for this lineage.

### `skill_agent`: partial. Command metadata, registry, hub router, interface command, command tests, md-generator tests, and schema checker were reviewed; active P1s remain at handoff, md-generator write policy, spec NFR, and procedure-card selection boundaries. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent`: partial. Command metadata, registry, hub router, interface command, command tests, md-generator tests, and schema checker were reviewed; active P1s remain at handoff, md-generator write policy, spec NFR, and procedure-card selection boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Command metadata, registry, hub router, interface command, command tests, md-generator tests, and schema checker were reviewed; active P1s remain at handoff, md-generator write policy, spec NFR, and procedure-card selection boundaries.

### `skill_agent`: partial. Current registry/command surfaces and `design-command-surface-check.mjs --json` support the four-mode/three-command topology; prior active P1s remain open. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent`: partial. Current registry/command surfaces and `design-command-surface-check.mjs --json` support the four-mode/three-command topology; prior active P1s remain open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Current registry/command surfaces and `design-command-surface-check.mjs --json` support the four-mode/three-command topology; prior active P1s remain open.

### `skill_agent`: partial. Hub, registry, command metadata, interface mode, and procedure-card schema were reviewed; schema/checker results show three moved foundations procedure cards fail the live procedure schema. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`: partial. Hub, registry, command metadata, interface mode, and procedure-card schema were reviewed; schema/checker results show three moved foundations procedure cards fail the live procedure schema.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Hub, registry, command metadata, interface mode, and procedure-card schema were reviewed; schema/checker results show three moved foundations procedure cards fail the live procedure schema.

### `skill_agent`: partial. Hub, registry, interface skill routing, and command metadata were checked directly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: partial. Hub, registry, interface skill routing, and command metadata were checked directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Hub, registry, interface skill routing, and command metadata were checked directly.

### `skill_agent`: partial. The parent hub, Open Design transport, command wrappers, and doctor checks keep read-only and transport boundaries legible; md-generator remains the exception requiring remediation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: partial. The parent hub, Open Design transport, command wrappers, and doctor checks keep read-only and transport boundaries legible; md-generator remains the exception requiring remediation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. The parent hub, Open Design transport, command wrappers, and doctor checks keep read-only and transport boundaries legible; md-generator remains the exception requiring remediation.

### `spec_code`: partial. Current resource files for the visual-system `RESOURCE_MAP` exist, but retained procedure-card discoverability is inconsistent with the live interface selection contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: partial. Current resource files for the visual-system `RESOURCE_MAP` exist, but retained procedure-card discoverability is inconsistent with the live interface selection contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Current resource files for the visual-system `RESOURCE_MAP` exist, but retained procedure-card discoverability is inconsistent with the live interface selection contract.

### `spec_code`: partial. Current source topology supports four registered modes, three commands, and no `commandSubworkflows`, but `spec.md` still has an active security NFR from the retired audit-gate plan. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: partial. Current source topology supports four registered modes, three commands, and no `commandSubworkflows`, but `spec.md` still has an active security NFR from the retired audit-gate plan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Current source topology supports four registered modes, three commands, and no `commandSubworkflows`, but `spec.md` still has an active security NFR from the retired audit-gate plan.

### `spec_code`: partial. Registry and command surface match the four-mode/three-command claim, but the live handoff contract contradicts the retired-identity cleanup claim. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. Registry and command surface match the four-mode/three-command claim, but the live handoff contract contradicts the retired-identity cleanup claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Registry and command surface match the four-mode/three-command claim, but the live handoff contract contradicts the retired-identity cleanup claim.

### `spec_code`: partial. Security write-boundary claims are mostly enforced by registry/tool-surface metadata and `output-policy.ts`, but guided-run leaves `--design-md` outside the shared write policy. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: partial. Security write-boundary claims are mostly enforced by registry/tool-surface metadata and `output-policy.ts`, but guided-run leaves `--design-md` outside the shared write policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Security write-boundary claims are mostly enforced by registry/tool-surface metadata and `output-policy.ts`, but guided-run leaves `--design-md` outside the shared write policy.

### `spec_code`: partial. Stabilization confirms the four-mode/three-command topology and no live old command surface, but active spec/security and shared-contract mismatches remain. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: partial. Stabilization confirms the four-mode/three-command topology and no live old command surface, but active spec/security and shared-contract mismatches remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Stabilization confirms the four-mode/three-command topology and no live old command surface, but active spec/security and shared-contract mismatches remain.

### No active finding for generic `foundations` keyword routing: `hub-router.json` routes foundations vocabulary classes into `interface`, and the manual scenario expects `workflowMode: interface`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No active finding for generic `foundations` keyword routing: `hub-router.json` routes foundations vocabulary classes into `interface`, and the manual scenario expects `workflowMode: interface`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No active finding for generic `foundations` keyword routing: `hub-router.json` routes foundations vocabulary classes into `interface`, and the manual scenario expects `workflowMode: interface`.

### No active finding for the three-command surface: the registry, hub router, wrappers, and checker agree on three public commands. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No active finding for the three-command surface: the registry, hub router, wrappers, and checker agree on three public commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No active finding for the three-command surface: the registry, hub router, wrappers, and checker agree on three public commands.

### No downgrade of active P1s: counterevidence did not mark stale handoff/procedure sections historical, did not policy-check `--design-md`, and did not reconcile active `NFR-S01`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No downgrade of active P1s: counterevidence did not mark stale handoff/procedure sections historical, did not policy-check `--design-md`, and did not reconcile active `NFR-S01`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No downgrade of active P1s: counterevidence did not mark stale handoff/procedure sections historical, did not policy-check `--design-md`, and did not reconcile active `NFR-S01`.

### No finding for the Open Design transport's lack of structural confirmation interceptor: the skill names the tradeoff and confines writes to the external tool rather than this repo. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No finding for the Open Design transport's lack of structural confirmation interceptor: the skill names the tradeoff and confines writes to the external tool rather than this repo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding for the Open Design transport's lack of structural confirmation interceptor: the skill names the tradeoff and confines writes to the external tool rather than this repo.

### No finding for the seven retained interface preflight checks: they are visual/content/motion readiness checks, not claimed shell or path-safety controls. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No finding for the seven retained interface preflight checks: they are visual/content/motion readiness checks, not claimed shell or path-safety controls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding for the seven retained interface preflight checks: they are visual/content/motion readiness checks, not claimed shell or path-safety controls.

### No missing-file finding for the `VISUAL_SYSTEM` resource map; all checked referenced files exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No missing-file finding for the `VISUAL_SYSTEM` resource map; all checked referenced files exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No missing-file finding for the `VISUAL_SYSTEM` resource map; all checked referenced files exist.

### No new finding for `foundations` as a router keyword; current hub routing intentionally maps foundations vocabulary to `interface`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new finding for `foundations` as a router keyword; current hub routing intentionally maps foundations vocabulary to `interface`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new finding for `foundations` as a router keyword; current hub routing intentionally maps foundations vocabulary to `interface`.

### No new finding for old-path references in benchmark/changelog corpora; those are historical by packet design. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No new finding for old-path references in benchmark/changelog corpora; those are historical by packet design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new finding for old-path references in benchmark/changelog corpora; those are historical by packet design.

### No new finding for the public command surface; checker and tests validate the current three-command/four-mode topology. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new finding for the public command surface; checker and tests validate the current three-command/four-mode topology.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new finding for the public command surface; checker and tests validate the current three-command/four-mode topology.

### No new security escalation for the active correctness P1: stale retired foundations/audit identities remain a live handoff correctness issue, but this pass found no evidence that they grant extra tools or bypass write gates. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new security escalation for the active correctness P1: stale retired foundations/audit identities remain a live handoff correctness issue, but this pass found no evidence that they grant extra tools or bypass write gates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new security escalation for the active correctness P1: stale retired foundations/audit identities remain a live handoff correctness issue, but this pass found no evidence that they grant extra tools or bypass write gates.

### No new traceability finding for the unrun styles, benchmark, or strict-validation gates because the packet consistently marks them pending. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No new traceability finding for the unrun styles, benchmark, or strict-validation gates because the packet consistently marks them pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new traceability finding for the unrun styles, benchmark, or strict-validation gates because the packet consistently marks them pending.

### No P0 candidate found: there is no evidence of auth bypass, remote code execution without a user-selected command, destructive data loss outside an explicit local CLI path, or secret exposure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No P0 candidate found: there is no evidence of auth bypass, remote code execution without a user-selected command, destructive data loss outside an explicit local CLI path, or secret exposure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 candidate found: there is no evidence of auth bypass, remote code execution without a user-selected command, destructive data loss outside an explicit local CLI path, or secret exposure.

### No P0 candidate found. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: No P0 candidate found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 candidate found.

### No P0 candidate: no destructive data loss, exploit path, or auth/security bypass was found in this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No P0 candidate: no destructive data loss, exploit path, or auth/security bypass was found in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 candidate: no destructive data loss, exploit path, or auth/security bypass was found in this correctness pass.

### No P1 escalation for the shared procedure/proof table stale owner vocabulary; current evidence supports maintainability drift, not immediate runtime failure. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No P1 escalation for the shared procedure/proof table stale owner vocabulary; current evidence supports maintainability drift, not immediate runtime failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P1 escalation for the shared procedure/proof table stale owner vocabulary; current evidence supports maintainability drift, not immediate runtime failure.

### No repeat finding for the prior sk-code handoff retired-identity issue; this iteration's P1 has a separate root cause in interface procedure-card discoverability. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No repeat finding for the prior sk-code handoff retired-identity issue; this iteration's P1 has a separate root cause in interface procedure-card discoverability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No repeat finding for the prior sk-code handoff retired-identity issue; this iteration's P1 has a separate root cause in interface procedure-card discoverability.

### No restatement of prior P1/P2 findings without new traceability evidence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No restatement of prior P1/P2 findings without new traceability evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No restatement of prior P1/P2 findings without new traceability evidence.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: synthesis - focus area: reducer/final report synthesis with four active P1s and three active P2s - reason: iteration 5 is the final mandatory stabilization pass; no new findings were added and all active P1/P2 findings are synthesis-ready - rotation status: all dimensions complete; final synthesis should preserve CONDITIONAL verdict while P1s remain active - blocked/productive carry-forward: do not retry broad historical searches; use the cited direct evidence and current checker outputs - required evidence: final reducer registry refresh, review report generation, and remediation plan for P1-001 through P1-004 Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
