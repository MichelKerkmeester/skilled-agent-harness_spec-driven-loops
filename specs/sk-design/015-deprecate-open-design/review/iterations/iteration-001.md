# Deep Review Iteration 001

## Dispatcher
- Session: `rvw-2026-08-10-deprecate-open-design`
- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus named live referencing surfaces and the deprecation packet
- Focus: **Correctness** — REQ/ADR feasibility, transport dispatch routing, and completeness of the planned removal
- Budget profile: `scan` (12-call ceiling)

## Files Reviewed
- `specs/sk-design/015-deprecate-open-design/spec.md`
- `specs/sk-design/015-deprecate-open-design/plan.md`
- `specs/sk-design/015-deprecate-open-design/decision-record.md`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/design-proof-token.md`
- `.opencode/skills/sk-design/shared/references/smart-routing.md` (targeted grep evidence)
- `.opencode/agents/design.md`
- `.opencode/commands/interface/design.md`
- `.utcp_config.json`
- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` (targeted grep evidence)
- `.opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json` (targeted grep evidence)
- `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json` (targeted grep evidence)

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **Residue gate misses camelCase transport identifiers, so the stated zero-reference acceptance can pass with live routing/proof references remaining** -- `.opencode/skills/sk-design/shared/design-proof-token.md:40` -- The live proof contract still names `openDesignLineageDigest` (also present in its JSON example at line 72), while the live smart-routing reference defines an `OPEN_DESIGN` route class and aliases (`.opencode/skills/sk-design/shared/references/smart-routing.md:83`, `:120`). The REQ-003/REQ-004 and plan residue expressions only match `mcp[-_]open[-_]design`, `design-mcp-open-design`, and `open[-_ ]design`; none match `openDesign`/`OPEN_DESIGN`. The strategy itself records camel variants as a known search axis, making this an executable acceptance hole rather than a naming-only concern.
   - Finding class: `cross-consumer`
   - Scope proof: A repository search for `openDesign|OpenDesign|OPEN_DESIGN` found live sk-design shared contracts/routing plus a live deep-improvement fixture outside the deleted skill tree; the current acceptance regex does not match those identifiers.
   - Affected surface hints: `["REQ-003/REQ-004 residue gate", "sk-design shared proof token", "sk-design smart-routing", "deep-improvement dispatch fixture"]`
   - Claim adjudication:
     ```json
     {"type":"correctness","claim":"The final residue gate can report zero while live camelCase/uppercase transport identifiers remain.","evidenceRefs":[".opencode/skills/sk-design/shared/design-proof-token.md:40",".opencode/skills/sk-design/shared/design-proof-token.md:72",".opencode/skills/sk-design/shared/references/smart-routing.md:83",".opencode/skills/sk-design/shared/references/smart-routing.md:120","specs/sk-design/015-deprecate-open-design/spec.md:146","specs/sk-design/015-deprecate-open-design/plan.md:58"],"counterevidenceSought":"Checked whether the live identifiers were confined to the deleted skill tree or documented historical exclusions; they also occur in live shared routing/proof materials and a live public fixture.","alternativeExplanation":"The fields could be intentionally retained as historical protocol labels; no such exclusion is documented for these live shared files, and the requirement says zero live references.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Amend the live-surface allowlist and acceptance gate to classify these exact identifiers as historical, or remove/rename every live occurrence and prove the expanded gate."}
     ```
   - Recommendation: Expand the residue search to case/camel variants (or use a canonical token inventory), classify each hit, and update/remove the live shared contracts and fixtures before declaring REQ-003/004 satisfied.

2. **The planned live-surface inventory omits three tracked mcp-tooling discovery fixtures that record Open Design tools** -- `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6` -- The fixture's captured `list_tools` payload includes `open_design.open_design.*`; equivalent hits exist in `mcp-aside-devtools` and `mcp-refero` fixtures at line 6. The scope/files-to-change list names only `mcp-tooling/mcp-figma` (`spec.md:92`, `spec.md:123`; `plan.md:79`) and the documented historical exclusion is limited to dated benchmark reports and `.private.json` benchmark fixtures (`spec.md:101`), not these discovery fixtures. Under ADR-003's tracked-file allowlist rule (`decision-record.md:133`), the final zero-residue gate will either fail or require an explicit classification/edit path that the plan does not provide.
   - Finding class: `matrix/evidence`
   - Scope proof: Targeted grep over `.opencode/skills/mcp-tooling` found Open Design identifiers in `mcp-aside-devtools`, `mcp-refero`, and `mcp-mobbin` discovery fixtures; none is named in the plan's affected-surface table or historical exclusions.
   - Affected surface hints: `["mcp-aside-devtools discovery fixture", "mcp-refero discovery fixture", "mcp-mobbin discovery fixture", "live-surface allowlist", "REQ-004 final gate"]`
   - Claim adjudication:
     ```json
     {"type":"correctness","claim":"The removal plan's stated surface inventory is incomplete for tracked mcp-tooling fixtures, leaving a deterministic residue-gate/classification failure.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6",".opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6",".opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json:6","specs/sk-design/015-deprecate-open-design/spec.md:101","specs/sk-design/015-deprecate-open-design/spec.md:123","specs/sk-design/015-deprecate-open-design/plan.md:79","specs/sk-design/015-deprecate-open-design/decision-record.md:133"],"counterevidenceSought":"Checked whether these files match the packet's benchmark/.private historical exclusion or appear only under worktrees; they are named discovery fixtures under live .opencode skill trees and are not in the stated exclusion class.","alternativeExplanation":"They may be immutable point-in-time probe snapshots; if so, the packet must explicitly list them as historical and exclude them from the live gate rather than silently omitting them.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Review confirms and documents these exact fixture paths as historical/generated exclusions, or adds them to the edit inventory and verifies their post-removal contents."}
     ```
   - Recommendation: Add all three fixture paths to the review inventory and decide per fixture whether to remove the retired tool entries or explicitly document a historical exclusion; make the gate and REQ-008 reflect that decision.

### P2 Findings
None.

## Traceability Checks
- `spec_code` (core): **partial / findings raised** — routing implementation matches the claimed transport, but the acceptance gate and inventory are incomplete for observed live variants/surfaces.
- `checklist_evidence` (core): **pending** — checklist rows were not fully audited in this correctness pass.
- `skill_agent` (overlay): **checked for routing evidence** — `.opencode/agents/design.md` explicitly maps the transport and its read/Bash-only surface; full agent-family parity remains for later dimensions.
- `agent_cross_runtime` (overlay): **pending** — mirror-wide parity not audited in this pass.
- `feature_catalog_code` (overlay): **pending**.
- `playbook_capability` (overlay): **pending**.

## Integration Evidence
Exact live routing surfaces reviewed:
- `.opencode/skills/sk-design/hub-router.json:7,56-61` — transport tie-break, alias class, and resource path.
- `.opencode/skills/sk-design/mode-registry.json:84-105` — transport mode, `od-cli-transport`, packet, aliases, and read/Bash-only tool surface.
- `.opencode/agents/design.md:3-4,36-49` — parent-hub route and transport mode map.
- `.opencode/commands/interface/design.md:24-26` — command directs Open Design-driving requests to the transport.
- `.utcp_config.json:68-88` — `open_design` stdio registration, helper command, daemon args, and OD environment paths.

## Edge Cases
- CamelCase/uppercase names are live transport contracts but are not matched by the current residue regex; this is an acceptance-gate ambiguity resolved conservatively as a P1.
- Dated discovery fixtures may be intended snapshots, but the packet only documents benchmark corpora as historical; their status must be explicitly adjudicated before editing.
- The transport routing itself is internally coherent across hub, registry, agent, command, and UTCP registration; the correctness failures are in removal coverage/gating, not current dispatch behavior.
- Memory/code graph context was unavailable; direct repository evidence was sufficient for this iteration.

## Confirmed-Clean Surfaces
- The current hub route points to an existing transport packet and the mode registry agrees on packet name, backend, aliases, and no command; no contradiction was found before removal.
- The design agent's documented read/Bash-only transport surface agrees with the registry; no workspace-write path is claimed for this transport.
- `.utcp_config.json` contains one clearly identifiable `open_design` manual; its removal criterion is mechanically testable, subject to the broader residue-gate gaps above.

## Ruled Out
- No P0 condition: no exploitable security issue, auth bypass, or destructive data-loss behavior was established in this correctness pass.
- No current routing contradiction between `hub-router.json`, `mode-registry.json`, `.opencode/agents/design.md`, `/interface:design`, and `.utcp_config.json`.
- No finding that requires modifying the review target during this iteration; all code-under-review paths remained read-only.

## Next Focus
- dimension: security
- focus area: retired transport trust boundaries, secret/path residue, and safe removal of MCP/CLI configuration
- reason: correctness routing and gate coverage were checked first; security is the next unreviewed dimension
- rotation status: correctness completed with two P1 findings; security is the next frontier
- blocked/productive carry-forward: productive — recheck the two P1 surfaces after security analysis; do not treat omitted fixture/camel variants as exhausted
- required evidence: `.utcp_config.json`, transport/adapter references in scope, security-sensitive config and agent command surfaces, plus counterevidence for any P0/P1 candidate

Review verdict: CONDITIONAL