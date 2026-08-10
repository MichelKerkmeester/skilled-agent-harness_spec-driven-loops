# Deep Review Iteration 004

## Dispatcher
- Session: `rvw-2026-08-10-deprecate-open-design`
- Mode: `review`; target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` plus declared live referencing surfaces and the deprecation packet
- Focus: **Maintainability** — derived manifests, paired md-generator documentation, changelog/decision continuity, exclusion-list upkeep, and safe follow-on change cost
- Budget profile: `scan` (12-call ceiling)
- Lineage: generation 1, lineage mode `new`

## Files Reviewed
- `specs/sk-design/015-deprecate-open-design/{spec.md,plan.md,tasks.md,decision-record.md}`
- `.opencode/skills/sk-design/{leaf-manifest.json,mode-registry.json,hub-router.json,command-metadata.json}`
- `.opencode/skills/sk-design/sk-design-md-generator/{SKILL.md,README.md,feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md,procedures/design-system-extraction.md,references/extraction-workflow.md}`
- `.opencode/skills/sk-design/feature-catalog/feature-catalog.md`
- `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md`
- `.opencode/skills/sk-design/shared/design-proof-token.md`
- `.opencode/skills/sk-design/shared/references/smart-routing.md`
- `.opencode/skills/sk-design/changelog/**`
- `.opencode/skills/sk-code/sk-code-review/references/review-core.md` (severity doctrine)

## Findings - New

### P0 Findings
- None.

### P1 Findings

1. **T032 does not provide a complete, executable derived-manifest regeneration contract** -- [SOURCE: `specs/sk-design/015-deprecate-open-design/tasks.md:48,58`] -- The current leaf manifest still registers the removed packet (`leaf-manifest.json:58-59`), `mode-registry.json` still carries the transport axis and mode (`mode-registry.json:24,76-89`), `hub-router.json` still routes its leaf (`hub-router.json:7,56-61,330-340`), and `command-metadata.json` still names it as a preferred sibling (`command-metadata.json:331-332,531-532`). T022 lists these files for stripping, but T032 only says “Regenerate derived manifests/descriptions” and names neither the full artifact set nor a generator command, expected postcondition, or parity check. A future operator can delete the leaf and leave stale routing/metadata while believing regeneration was completed.
   - Finding class: `cross-consumer`
   - Scope proof: Direct reads and identifier sweeps covered the hub’s leaf manifest, mode registry, router, and command metadata; all four contain transport references while the only regeneration task is the one-line T032.
   - Affected surface hints: ["T022/T032 derived-artifact set", "leaf-manifest.json", "mode-registry.json", "hub-router.json", "command-metadata.json"]
   - Claim adjudication:
     ```json
     {"type":"maintainability","claim":"The removal plan can complete T032 while derived routing artifacts still reference the deleted leaf because the regeneration scope and verification are unspecified.","evidenceRefs":["specs/sk-design/015-deprecate-open-design/tasks.md:48","specs/sk-design/015-deprecate-open-design/tasks.md:58",".opencode/skills/sk-design/leaf-manifest.json:58-59",".opencode/skills/sk-design/mode-registry.json:24,76-89",".opencode/skills/sk-design/hub-router.json:7,56-61,330-340",".opencode/skills/sk-design/command-metadata.json:331-332,531-532"],"counterevidenceSought":"Checked T022, T032, the JSON artifact set, and the JSON-parse verification task; no generator command, expected artifact diff, or command-metadata/mode-registry regeneration contract was present.","alternativeExplanation":"Some artifacts may be hand-maintained rather than generated, but the plan does not say which, so operators cannot know whether to regenerate or edit them.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Name every derived and hand-maintained artifact, provide the exact generator/edit command and expected zero-reference assertions, then rerun the hub parity checks."}
     ```
   - Recommendation: Expand T032 into a reproducible command/runbook covering leaf-manifest, mode-registry, hub-router, command-metadata, description/graph metadata, and advisor projections; verify parsed JSON plus zero removed-leaf entries and mode/command parity.

2. **The required deprecation changelog entry is prose-only and has no implementation task or location** -- [SOURCE: `specs/sk-design/015-deprecate-open-design/spec.md:88,100`] -- The specification says `changelog/` should receive “add deprecation entry only” while preserving history, but T022 and T030 enumerate hub/root edits and no task schedules an append-only entry, names a new changelog file/version, or defines its evidence. Existing changelog history still documents the transport at `changelog/v1.4.3.0.md:2,14` and `v1.5.0.0.md:8,18`; those records must not be rewritten, so without a new entry a future operator has no obvious current release note explaining the removal.
   - Finding class: `cross-consumer`
   - Scope proof: Compared the spec’s changelog instruction with every Phase 2 task and searched the live sk-design changelog; only historical transport entries exist and no deprecation task/file is named.
   - Affected surface hints: ["spec.md changelog scope", "tasks.md Phase 2", "sk-design/changelog append-only entry", "decision-record.md"]
   - Claim adjudication:
     ```json
     {"type":"maintainability","claim":"The plan does not reliably create the promised append-only deprecation record, so future operators may see historical transport additions but not why the capability was removed.","evidenceRefs":["specs/sk-design/015-deprecate-open-design/spec.md:88","specs/sk-design/015-deprecate-open-design/spec.md:100","specs/sk-design/015-deprecate-open-design/tasks.md:48-58",".opencode/skills/sk-design/changelog/v1.4.3.0.md:2,14",".opencode/skills/sk-design/changelog/v1.5.0.0.md:8,18"],"counterevidenceSought":"Checked the task list and all live sk-design changelog files for an explicitly scheduled deprecation entry or named output path; none was found.","alternativeExplanation":"The decision record may be intended as the sole durable rationale, but the specification explicitly promises a changelog entry and does not mark it optional.","finalSeverity":"P1","confidence":0.90,"downgradeTrigger":"Add a named append-only deprecation task/file (without editing v1.x history) and link it from the implementation summary/decision record."}
     ```
   - Recommendation: Add an explicit append-only changelog task (for example, a new versioned entry) stating the removal, affected routing surfaces, and pointer to the decision record; preserve all existing version files byte-for-byte.

3. **The live-surface exclusion allowlist is not reproducible or maintainable as specified** -- [SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:57-58`] -- The gate is defined as `git ls-files` minus prose categories (`specs/`, changelog history, dated benchmarks, sqlite, `.worktrees/`) and a regex that only covers selected spellings. The specification repeats those categories but supplies no frozen allowlist path or machine-readable exclusion manifest (`spec.md:98-102`), while T010 merely says to freeze an allowlist in `scratch/` (`tasks.md:37`). Future operators must hand-reconstruct which files were excluded, and changing corpus/date layout can silently change the gate’s scope. This compounds, but is distinct from, P1-001’s camel/uppercase token blind spot.
   - Finding class: `matrix/evidence`
   - Scope proof: Compared the gate command, documented exclusion prose, and T010/T041; no committed/generated allowlist format, exclusion rationale per path, or command that proves the same set is reused for inventory and final verification was found.
   - Affected surface hints: ["plan.md:57-58 residue gate", "spec.md:98-102 exclusions", "tasks.md:T010/T041", "scratch live-surface allowlist"]
   - Claim adjudication:
     ```json
     {"type":"maintainability","claim":"The residue gate’s scope can drift between inventory and final verification because its exclusion policy is prose-only and its frozen allowlist is neither defined nor validated by a reproducible command.","evidenceRefs":["specs/sk-design/015-deprecate-open-design/plan.md:57-58","specs/sk-design/015-deprecate-open-design/spec.md:98-102","specs/sk-design/015-deprecate-open-design/tasks.md:37,67","specs/sk-design/015-deprecate-open-design/decision-record.md:141-145"],"counterevidenceSought":"Checked the packet’s scope, task, and decision-record language for a machine-readable exclusion manifest, stable path, or hash/count assertion; none was specified.","alternativeExplanation":"The operator may maintain scratch/ manually, but manual state is not a durable or auditable gate input unless its format and reuse are specified.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Commit or otherwise pin a machine-readable allowlist/exclusion manifest, define its generation command and hash/count check, and use that exact file for both inventory and final sweep."}
     ```
   - Recommendation: Make T010 produce a named, review-packet-owned allowlist with explicit excluded paths/classes and a deterministic generator/hash; make T041 consume exactly that artifact and report the same file count.

### P2 Findings
- None. The maintainability gaps above affect required removal correctness and reproducibility, not optional style polish.

## Findings - Carried Active
1. **P1-001 — Residue gate misses camelCase/uppercase transport identifiers** -- [SOURCE: `.opencode/skills/sk-design/shared/design-proof-token.md:40`; `.opencode/skills/sk-design/shared/references/smart-routing.md:83,120`] -- Carried from iterations 001-003; the current gate still does not match these live variants ([SOURCE: `specs/sk-design/015-deprecate-open-design/plan.md:58`]).
   - Finding class: `cross-consumer`
   - Scope proof: Prior variant sweep reproduced live shared identifiers and the packet regex mismatch.
   - Affected surface hints: ["REQ-003/004 residue gate", "shared proof token", "smart-routing"]
   - Claim adjudication: `{"type":"correctness","claim":"The final residue gate can report zero while live camelCase/uppercase transport identifiers remain.","evidenceRefs":[".opencode/skills/sk-design/shared/design-proof-token.md:40",".opencode/skills/sk-design/shared/references/smart-routing.md:83,120","specs/sk-design/015-deprecate-open-design/plan.md:58"],"counterevidenceSought":"Rechecked the gate expression and prior live hits.","alternativeExplanation":"They could be historical protocol labels, but no exclusion is documented.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Classify or remove the exact identifiers and prove the expanded gate."}`
2. **P1-002 — Inventory omits live mcp-tooling discovery fixtures** -- [SOURCE: `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6`] -- Carried; equivalent Aside and Refero fixtures remain outside the plan inventory.
   - Finding class: `matrix/evidence`
   - Scope proof: Prior fixture sweep found all three tracked snapshots and no documented exclusion.
   - Affected surface hints: ["mcp-aside-devtools fixture", "mcp-refero fixture", "mcp-mobbin fixture"]
   - Claim adjudication: `{"type":"correctness","claim":"The plan inventory omits tracked mcp-tooling fixtures containing retired tool names.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6",".opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json:6",".opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json:6","specs/sk-design/015-deprecate-open-design/plan.md:79"],"counterevidenceSought":"Rechecked tracked fixture classification.","alternativeExplanation":"Snapshots may be historical, but they must be explicitly classified.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Add exact paths as edit targets or documented historical exclusions."}`
3. **P1-003 — NFR-S01 lacks explicit env/path/token residue assertion** -- [SOURCE: `specs/sk-design/015-deprecate-open-design/spec.md:196`] -- Carried; the plan still specifies only generic residue matching and JSON parsing, not exact retired env/path/token assertions.
   - Finding class: `cross-consumer`
   - Scope proof: Prior security sweep reproduced the `.utcp_config.json:149-157` env/path block and found no independent assertion.
   - Affected surface hints: [".utcp_config.json env block", "NFR-S01", "REQ-006 gate"]
   - Claim adjudication: `{"type":"security","claim":"NFR-S01 is not objectively enforced for retired env/path/token residue.","evidenceRefs":[".utcp_config.json:149-157","specs/sk-design/015-deprecate-open-design/spec.md:196","specs/sk-design/015-deprecate-open-design/plan.md:58"],"counterevidenceSought":"Rechecked gate and JSON-parse checks.","alternativeExplanation":"Current edits might remove the block incidentally, but the plan does not prove the invariant.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Add exact post-removal assertions and rerun them."}`
4. **P1-004 — Claimed checklist items have no pinned evidence** -- [SOURCE: `specs/sk-design/015-deprecate-open-design/checklist.md:22-24`] -- Carried; the checklist still has no evidence column or command/result links for checked rows.
   - Finding class: `matrix/evidence`
   - Scope proof: Prior traceability audit found CHK-010..013 unchecked and no alternate evidence ledger ([SOURCE: `checklist.md:30-33,88-94`]).
   - Affected surface hints: ["checklist.md", "REQ-007", "review artifacts"]
   - Claim adjudication: `{"type":"traceability","claim":"Checked checklist rows remain unauditable and cannot satisfy REQ-007.","evidenceRefs":["specs/sk-design/015-deprecate-open-design/checklist.md:22-24","specs/sk-design/015-deprecate-open-design/checklist.md:30-33","specs/sk-design/015-deprecate-open-design/spec.md:145-150"],"counterevidenceSought":"Rechecked checklist headings, rows, and REQ-007.","alternativeExplanation":"Rows may be scaffold attestations, but they are not labeled provisional.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Pin command/result or artifact evidence for every checked P0/P1 row, or uncheck provisional rows."}`

## Traceability Checks
| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | T022 names the artifact files, but T032 does not define their regeneration or parity proof ([SOURCE: `tasks.md:48,58`]). Existing P1-001..003 remain active. |
| `checklist_evidence` | core | partial | P1-004 remains active; maintainability findings add missing T032/changelog/allowlist evidence requirements. |
| `skill_agent` | overlay | pass | The md-generator packet and runtime agent surfaces are named in scope; no new agent parity gap was found. |
| `agent_cross_runtime` | overlay | pass | No new cross-runtime maintainability gap was found in this focus; prior eight-path parity result carries. |
| `feature_catalog_code` | overlay | pass | The md-generator procedure-card reference is present and its transport pairing is explicitly discoverable ([SOURCE: `.opencode/skills/sk-design/sk-design-md-generator/feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md:30`]). |
| `playbook_capability` | overlay | pass | The playbook explicitly describes the transport mode and pairing, so no separate maintainability finding was raised ([SOURCE: `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:1-20`]). |

## Integration Evidence
- `.opencode/skills/sk-design/leaf-manifest.json:58-59`, `mode-registry.json:24,76-89`, `hub-router.json:7,56-61,330-340`, and `command-metadata.json:331-332,531-532` are the exact hub-derived routing surfaces checked.
- `specs/sk-design/015-deprecate-open-design/tasks.md:T022,T024,T030,T032,T040-T045` and `spec.md:88,98-102` are the packet planning surfaces checked.
- No command/workflow or MCP/code tool was invoked as an integration surface; this was a direct repository/document audit.

## Edge Cases
- The five md-generator files found with transport references are all covered by T024’s broad task plus T023’s feature-catalog scope; no additional missed md-generator file was found.
- Existing changelog files are historical and must remain untouched; the finding concerns the missing new append-only entry, not rewriting v1.x history.
- `command-metadata.json` is not a generated manifest by proof in this packet; that uncertainty itself is why T032 must classify it as generated or hand-maintained.
- Memory/code graph was unavailable; direct repository evidence was sufficient for this maintainability pass.

## Confirmed-Clean Surfaces
- No P0 condition was established.
- No additional md-generator pairing omission beyond the five enumerated files was found.
- Decision-record rationale for full removal and historical preservation is present ([SOURCE: `specs/sk-design/015-deprecate-open-design/decision-record.md:18-38,127-150`]), but it does not replace the missing task-level changelog/manifest runbook.
- No review-target files were modified.

## Ruled Out
- No new security exploit, auth bypass, destructive data loss, or P0 condition.
- No new agent cross-runtime parity defect; prior pass remains valid.
- No claim that changelog history should be rewritten; only an append-only current deprecation entry is recommended.
- No duplicate finding for P1-001: P1-007’s scope is allowlist lifecycle/reproducibility, not token-variant matching.

## Next Focus
- dimension: maintainability
- focus area: cross-check the three new plan/runbook gaps against the final synthesis and verify no additional derived or documentation surfaces are omitted
- reason: all four core dimensions are now covered, but seven active P1 findings keep the provisional verdict conditional
- rotation status: maintainability completed conditionally in iteration 004
- blocked/productive carry-forward: productive — preserve P1-001..P1-007; do not retry exhausted approaches
- required evidence: explicit T032 artifact/runbook commands, append-only changelog task/file, machine-readable allowlist generation/hash, and final md-generator path inventory

Review verdict: CONDITIONAL