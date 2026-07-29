# Deep Review Iteration 004

## Dimension

Traceability: spec/code alignment, checklist evidence, and cross-runtime feature/playbook claims.

## Files Reviewed

- `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/spec.md:66-90,119-143,176-183`
- `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:54-83,97-125`
- `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md:3,53-83,102-125`
- `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:18-69`
- `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:23-50,81-114,118-216,220-249`
- `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md:28-52,129,241-244`
- `.opencode/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24-39,44-113,231-256`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md:77-89`

## Findings by Severity

### P0

None.

### P1

#### R4-P1-001: Relocation playbooks retain executable references to removed skill-owned paths

- File: `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md:52`
- Evidence: The playbook still runs Vitest with `--root .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib` at lines 52 and 129 even though the test and shared core now live under `.opencode/runtime-hooks/dispatch/lib/`. The changed Codex parity playbook likewise identifies both dispatch adapters under `cli-opencode/scripts/hooks/codex/` at lines 36-37, while its own executable example and source inventory use `.opencode/runtime-hooks/dispatch/codex/` at lines 86 and 226-227. These are live capability references, not historical notes. They contradict CHK-011's zero-stale-path assertion and CHK-041's claim that the live documentation set was updated. [SOURCE: `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md:52,129`; `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:36-37,86,226-227`; `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:58,101`]
- Finding class: cross-consumer
- Scope proof: An exact old-root search across the skill documentation found the two changed playbooks above plus the already-recorded stale Claude hook table. Current-path references in the same playbooks show that the migration was partial rather than an intentionally historical description.
- Affected surface hints: `dispatch manual playbooks`, `Codex adapter inventory`, `relocation checklist evidence`
- Recommendation: Update the live adapter and test-runner references to `.opencode/runtime-hooks/dispatch/...`, rerun the playbook commands, then regenerate the stale-path evidence behind CHK-011 and CHK-041.

Claim adjudication:

```json
{"findingId":"R4-P1-001","claim":"Changed live playbooks still direct readers and commands to removed pre-relocation dispatch paths, invalidating the packet's zero-stale-path and documentation-completeness evidence.","evidenceRefs":[".opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md:52,129",".opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:36-37,86,226-227",".opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:58,101"],"counterevidenceSought":"Searched the changed documentation for old and relocated dispatch roots and checked whether the hits were historical notes, aliases, or current commands/source inventories.","alternativeExplanation":"The old strings could have been retained only as historical provenance, but they occur in a current adapter matrix and executable test commands while the same files use the relocated paths elsewhere.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if the old locations are restored as supported aliases or the references are explicitly made non-executable historical evidence and the checklist claim is narrowed with approved acceptance criteria."}
```

#### R4-P1-002: Six-runtime zero-regression claim lacks post-move evidence for four runtimes

- File: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md:3`
- Evidence: REQ-002 requires live spawn/smoke confirmation that each affected adapter still fires across all six runtimes, and NFR-R01 requires each runtime to be independently verifiable. The implementation summary nevertheless says the move is "verified across 6 runtimes" while its delivery and verification sections identify post-move live smoke tests only for Pi and OpenCode. The checklist contains suite results but no runtime-by-runtime live-smoke rows, yet reports every P0/P1 item verified. The reviewed Codex playbook's captured live evidence is dated July 13, before the July 28 relocation packet, and therefore cannot prove the relocated path fired; the Cursor feature catalog carefully distinguishes live-confirmed behavior from registration but similarly does not pin confirmation to the relocation commit. [SOURCE: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/spec.md:122,182`; `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md:3,83,114`; `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:65-72,117-125`; `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:161-176`; `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:18-40`]
- Finding class: matrix/evidence
- Scope proof: Reconciled the packet's six-runtime acceptance language against its checklist and verification table, then checked the changed Cursor and Codex evidence surfaces for relocation-commit or post-move proof. No post-move live evidence was identified for Claude, Cursor, Devin, or Codex.
- Affected surface hints: `six-runtime acceptance matrix`, `checklist evidence`, `implementation summary`, `runtime live-smoke playbooks`
- Recommendation: Run and record commit-pinned post-move smoke tests for Claude, Cursor, Devin, and Codex, or explicitly narrow REQ-002 and the "verified across 6 runtimes" claim through an approved spec amendment.

Claim adjudication:

```json
{"findingId":"R4-P1-002","claim":"The packet claims post-move zero-regression verification across all six runtimes without recording post-move live evidence for Claude, Cursor, Devin, or Codex.","evidenceRefs":[".opencode/specs/system-speckit/033-hook-runtime-relocation-review/spec.md:122,182",".opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md:3,83,114",".opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:65-72,117-125",".opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:161-176",".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:18-40"],"counterevidenceSought":"Reviewed the packet checklist and verification table plus the changed Cursor/Codex capability evidence for post-relocation timestamps, commit pins, or runtime-by-runtime live outputs.","alternativeExplanation":"Passing shared-core tests plus earlier live adapter evidence may have been intended as sufficient regression coverage, but REQ-002 expressly requires live confirmation that each adapter still fires after the move.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if commit-pinned post-move live outputs are produced for the four missing runtimes, or an approved amendment narrows both REQ-002 and the six-runtime verification claim."}
```

### P2

None.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | REQ-003/REQ-006 documentation alignment is contradicted by current old-root playbook references. |
| `checklist_evidence` | fail | CHK-011 and CHK-041 overstate stale-path closure; the testing checklist does not evidence REQ-002's six-runtime live matrix. |
| `skill_agent` | fail | Live skill-owned playbooks still identify relocated adapters under their former skill roots. |
| `agent_cross_runtime` | partial | Wiring inventory exists, but post-move live confirmation is recorded only for Pi and OpenCode. |
| `feature_catalog_code` | pass | The reviewed Cursor feature catalog points task-dispatch and MCP guard entries to `.opencode/runtime-hooks/` and preserves confirmed-vs-registered distinctions. |
| `playbook_capability` | fail | MCP route-guard capability mapping is aligned, but dispatch/Codex playbooks retain stale source and executable test paths. |

## Verdict

CONDITIONAL. Two P1 traceability failures require remediation before merge; no P0 was found.

## Next Dimension

Maintainability: assess whether the relocated concern structure, adapters, mirrors, and documentation ownership minimize safe follow-on change cost.

Review verdict: CONDITIONAL
