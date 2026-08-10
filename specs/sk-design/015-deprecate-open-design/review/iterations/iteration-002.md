# Deep Review Iteration 002

## Dispatcher
- Session: `rvw-2026-08-10-deprecate-open-design`
- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus every named live referencing surface and the deprecation packet
- Focus: **Security** — retired transport trust boundaries, secret/path residue, and safe removal of MCP/CLI configuration
- Budget profile: `scan` (12-call ceiling)

## Files Reviewed
- `.utcp_config.json` (current `open_design` manual and env block)
- `.opencode/skills/sk-design/sk-design-mcp-open-design/scripts/install.sh`
- `.opencode/skills/sk-design/sk-design-mcp-open-design/scripts/doctor.sh`
- `.opencode/skills/sk-design/sk-design-mcp-open-design/scripts/_common.sh`
- `.opencode/skills/sk-design/sk-design-mcp-open-design/INSTALL-GUIDE.md`
- `.opencode/commands/doctor/mcp.md`
- `.opencode/commands/doctor/assets/doctor-mcp-install.yaml`
- `.opencode/install-guides/README.md`
- `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md`
- `.opencode/skills/mcp-code-mode/references/tool-catalog.md`
- `.opencode/skills/sk-design/shared/design-proof-token.md` (residue-variant recheck)
- `.opencode/skills/sk-design/shared/references/smart-routing.md` (residue-variant recheck)
- `.opencode/skills/mcp-tooling/mcp-{aside-devtools,refero,mobbin}/references/discovery-fixture-2026-07-16.json` (targeted grep; Mobbin direct read)
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/*.public.json` (targeted grep)
- `specs/sk-design/015-deprecate-open-design/spec.md`
- `specs/sk-design/015-deprecate-open-design/plan.md`
- `specs/sk-design/015-deprecate-open-design/decision-record.md`
- `.opencode/skills/sk-code/sk-code-review/references/review-core.md`

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **NFR-S01 has no explicit post-removal assertion for retired env names, socket/app paths, or token identifiers** -- [SOURCE: `.utcp_config.json:149-157`] -- The live `open_design` manual currently carries the absolute helper/CLI paths plus `OD_DATA_DIR`, `OD_SIDECAR_IPC_PATH`, and `ELECTRON_RUN_AS_NODE`. The retired skill also documents the socket and `OD_TOOL_TOKEN` boundary ([SOURCE: `.opencode/skills/sk-design/sk-design-mcp-open-design/manual-testing-playbook/manual-testing-playbook.md:50`], [SOURCE: `.opencode/skills/sk-design/sk-design-mcp-open-design/manual-testing-playbook/reading/read-design-system.md:50`]). NFR-S01 expressly requires these app paths and env data to be absent from live docs/config ([SOURCE: `specs/sk-design/015-deprecate-open-design/spec.md:196`]), but the plan's executable checks only remove the JSON key/grep `open.design` ([SOURCE: `specs/sk-design/015-deprecate-open-design/spec.md:145`]) and run the generic residue regex plus JSON parse ([SOURCE: `specs/sk-design/015-deprecate-open-design/spec.md:146-147`], [SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:58`, [SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:130-131`]). That regex does not match `OD_DATA_DIR`, `OD_SIDECAR_IPC_PATH`, `ELECTRON_RUN_AS_NODE`, or `OD_TOOL_TOKEN` when those identifiers survive without an adjacent `open design` label; a moved/orphaned env block or token/path line could therefore pass the documented security gate.
   - Finding class: `cross-consumer`
   - Scope proof: Direct security sweep found the current env/path block in `.utcp_config.json`, app/socket/env references throughout the retired tree, and the plan's gate contains no explicit `OD_*`, app-path, socket-path, or credential scan. Unrelated `${...API_KEY}` placeholders in other manuals were observed but are not attributed to the retired transport.
   - Affected surface hints: `["NFR-S01 security gate", ".utcp_config.json open_design entry", "retired install/doctor docs", "manual-testing token boundary", "REQ-002/REQ-004 verification"]`
   - Claim adjudication:
     ```json
     {"type":"security","claim":"The deprecation can pass its documented checks while a retired Open Design env/path/token residue remains, so NFR-S01 is not objectively enforced.","evidenceRefs":[".utcp_config.json:149-157",".opencode/skills/sk-design/sk-design-mcp-open-design/manual-testing-playbook/manual-testing-playbook.md:50",".opencode/skills/sk-design/sk-design-mcp-open-design/manual-testing-playbook/reading/read-design-system.md:50","specs/sk-design/015-deprecate-open-design/spec.md:145-147","specs/sk-design/015-deprecate-open-design/spec.md:196","specs/sk-design/015-deprecate-open-design/plan.md:58","specs/sk-design/015-deprecate-open-design/plan.md:130-131"],"counterevidenceSought":"Checked the current JSON nesting and deletion plan: removing the whole open_design object and deleting the skill tree would remove the currently observed instances, and no literal secret value was found.","alternativeExplanation":"Because the current env block is nested under open_design, a correct object deletion is sufficient for this exact file; the issue remains that the acceptance gate does not prove that invariant or catch residue moved to another live file/key.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Add an explicit post-edit allowlist sweep/assertion for OD_DATA_DIR, OD_SIDECAR_IPC_PATH, ELECTRON_RUN_AS_NODE, OD_TOOL_TOKEN, Open Design app paths, and /tmp/open-design socket paths, plus a credential-pattern check, then rerun it after JSON parsing and tree deletion."}
     ```
   - Recommendation: Add a deterministic post-removal sweep over the frozen live allowlist for the exact retired env/token/path identifiers (and credential-value patterns), then parse `.utcp_config.json` and assert the `open_design` object and all nested env keys are absent.

2. **Residue gate misses camelCase/uppercase transport identifiers (confirmed carried finding)** -- [SOURCE: `.opencode/skills/sk-design/shared/design-proof-token.md:40`] -- The live proof contract still names `openDesignLineageDigest`, while smart-routing still defines `OPEN_DESIGN` and its aliases ([SOURCE: `.opencode/skills/sk-design/shared/references/smart-routing.md:83`], [SOURCE: `.opencode/skills/sk-design/shared/references/smart-routing.md:120`]). The recheck found six files with `openDesign|OpenDesign|OPEN_DESIGN` variants in the reviewed live surfaces, while the plan still uses only the hyphen/underscore/spaced expression ([SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:58`]).
   - Finding class: `cross-consumer`
   - Scope proof: The targeted variant sweep reproduced live shared proof/routing hits and public dispatch fixtures; the stated regex does not match camelCase or uppercase identifiers.
   - Affected surface hints: `["REQ-003/REQ-004 residue gate", "sk-design shared proof token", "sk-design smart-routing", "deep-improvement dispatch fixtures"]`
   - Claim adjudication:
     ```json
     {"type":"correctness","claim":"The final residue gate can report zero while live camelCase/uppercase transport identifiers remain.","evidenceRefs":[".opencode/skills/sk-design/shared/design-proof-token.md:40",".opencode/skills/sk-design/shared/design-proof-token.md:72",".opencode/skills/sk-design/shared/references/smart-routing.md:83",".opencode/skills/sk-design/shared/references/smart-routing.md:120","specs/sk-design/015-deprecate-open-design/spec.md:146","specs/sk-design/015-deprecate-open-design/plan.md:58"],"counterevidenceSought":"Repeated the variant search outside the deleted tree and confirmed hits in live shared contracts and public fixtures; no historical exclusion was found for those surfaces.","alternativeExplanation":"The identifiers could be retained as protocol labels, but the packet requires zero live references and does not document them as exclusions.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Amend the gate/allowlist to classify these exact identifiers as historical, or remove/rename every live occurrence and prove the expanded gate."}
     ```
   - Recommendation: Expand the residue search to case/camel variants or use a canonical token inventory, classify every occurrence, and update/remove the live occurrences before declaring REQ-003/004 satisfied.

3. **Live mcp-tooling discovery-fixture inventory remains incomplete (confirmed carried finding)** -- [SOURCE: `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6`] -- The captured `list_tools` payload still includes `open_design.open_design.*`; equivalent line-6 hits remain in the Aside and Refero fixtures ([SOURCE: `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6`], [SOURCE: `.opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json:6`]). The affected-surface table still names `mcp-tooling/mcp-figma` but not these three fixtures ([SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:79`]).
   - Finding class: `matrix/evidence`
   - Scope proof: Targeted grep over `.opencode/skills/mcp-tooling` reproduced all three tracked fixture hits; they are not in the documented benchmark/.private historical exclusions.
   - Affected surface hints: `["mcp-aside-devtools discovery fixture", "mcp-refero discovery fixture", "mcp-mobbin discovery fixture", "live-surface allowlist", "REQ-004 final gate"]`
   - Claim adjudication:
     ```json
     {"type":"correctness","claim":"The removal plan's stated surface inventory is incomplete for tracked mcp-tooling fixtures, leaving a deterministic residue-gate/classification failure.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6",".opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6",".opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json:6","specs/sk-design/015-deprecate-open-design/spec.md:101","specs/sk-design/015-deprecate-open-design/spec.md:123","specs/sk-design/015-deprecate-open-design/plan.md:79","specs/sk-design/015-deprecate-open-design/decision-record.md:133"],"counterevidenceSought":"Checked whether the fixtures match the packet benchmark/.private historical exclusion or occur only under worktrees; they are tracked discovery fixtures under live .opencode skill trees.","alternativeExplanation":"They may be immutable probe snapshots; if so, the packet must explicitly list those exact paths as historical and exclude them rather than silently omitting them.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Document these exact fixture paths as historical/generated exclusions, or add them to the edit inventory and verify post-removal contents."}
     ```
   - Recommendation: Add the three fixture paths to the inventory and explicitly edit them or document them as historical exclusions, updating the final gate scope accordingly.

### P2 Findings
None.

## Traceability Checks
- `spec_code` (core): **partial / findings raised** — NFR-S01 names the required security outcome, but the executable plan checks do not assert the retired env/path/token identifiers; the two prior residue/inventory gaps remain active.
- `checklist_evidence` (core): **pending** — checklist rows were not audited in this security pass.
- `skill_agent` (overlay): **partial** — the doctor router/workflow and CLI-primary diagnostic distinction were checked; full agent-family parity remains unreviewed.
- `agent_cross_runtime` (overlay): **pending** — mirror-wide parity was not audited in this pass.
- `feature_catalog_code` (overlay): **pending**.
- `playbook_capability` (overlay): **pending** — only security-sensitive token/path evidence was sampled.

## Integration Evidence
Exact security-sensitive surfaces reviewed:
- `.utcp_config.json:147-157` — `open_design` helper command, bundled CLI path, and all three retired env keys.
- `.opencode/skills/sk-design/sk-design-mcp-open-design/scripts/_common.sh:17,41` — app search paths and daemon socket path.
- `.opencode/skills/sk-design/sk-design-mcp-open-design/scripts/install.sh:83-84,116` and `scripts/doctor.sh:62-63` — absolute app/CLI paths emitted by diagnostics.
- `.opencode/skills/sk-design/sk-design-mcp-open-design/INSTALL-GUIDE.md:104,120,145` — env/socket wiring and report-only doctor claims.
- `.opencode/commands/doctor/mcp.md` and `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` — CLI-primary diagnostics still enumerate the retired skill and its install/doctor scripts.
- `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:261,292,309,355` — unrelated Figma credential references are distinct from the retired Open Design transport.
- `.opencode/skills/mcp-code-mode/references/tool-catalog.md` — configured manual table still lists `open_design` as the current transport catalog entry.

## Edge Cases
- The current `.utcp_config.json` uses a nested `open_design` object, so correct deletion of that object removes its known env block; the P1 is the absence of an independent assertion, not proof that deletion cannot work.
- No literal credential value for Open Design was observed. `${...API_KEY}`/`${...TOKEN}` values in other manuals are unrelated providers; the retired tree does contain the `OD_TOOL_TOKEN` boundary name and must be deleted or explicitly classified.
- Install/doctor scripts are read-only/report-only and quote their discovered paths; they do not print secrets or start/wire the daemon. Their absolute path/socket output is nevertheless within NFR-S01's post-removal sweep.
- The plan's residue regex also misses camel/uppercase identifiers already carried from iteration 001; the security gate must not treat a generic `open.design` match as complete coverage.
- Memory/code graph context was unavailable; direct repository evidence and targeted grep were used.

## Confirmed-Clean Surfaces
- No P0 exploitable secret disclosure, auth bypass, injection, or destructive behavior was established in the reviewed installer/doctor scripts; they perform local checks only ([SOURCE: `.opencode/skills/sk-design/sk-design-mcp-open-design/scripts/doctor.sh:2-4`]).
- The unrelated `${GITHUB_PERSONAL_ACCESS_TOKEN}`, `${FIGMA_API_KEY}`, `${CLICKUP_API_KEY}`, and `${WEBFLOW_TOKEN}` substitutions in `.utcp_config.json` were not attributed to Open Design ([SOURCE: `.utcp_config.json:78,99,118,212,251`]).
- The plan does require JSON parsing after edits ([SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:130-131`]); this is useful integrity coverage but does not replace the NFR-S01 residue assertion.

## Ruled Out
- No P0 condition: no literal retired credential, auth bypass, unsafe deserialization, or destructive installer behavior was evidenced in this iteration.
- No downgrade of P1-001 or P1-002: their cited live hits and gate/inventory mismatch were reproduced by the variant and fixture sweeps.
- No claim that current unrelated provider credentials are Open Design residue; they are separate manuals and remain outside this deprecation finding.
- No review-target edits were made.

## Next Focus
- dimension: traceability
- focus area: checklist/spec evidence, cross-reference integrity, and the remaining core/overlay protocols
- reason: security is conditionally complete with one new P1 gate gap; traceability protocols are the next unreviewed dimension
- rotation status: security completed conditionally; P1-001, P1-002, and P1-003 remain active
- blocked/productive carry-forward: productive — preserve all three P1s; do not retry exhausted/blocked overlay approaches until their exact evidence surface is available
- required evidence: `checklist.md`, spec/plan/decision-record acceptance rows, agent/runtime mirrors, feature catalog, and playbook capability mappings

Review verdict: CONDITIONAL