# Deep Review Iteration 002

## Dispatcher
- Mode: review
- Target agent: deep-review
- Session: `fanout-sol-1784207165086-152crx`
- Focus: security — renderer escaping, CSP preservation, hostile-content handling, validator allowlist boundaries, and unsafe file/state operations
- Budget profile: `verify`

## Files Reviewed
- `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py`
- `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py`
- `.opencode/skills/sk-doc/create-diff/scripts/validate_report.py`
- `.opencode/skills/sk-doc/create-diff/SKILL.md`
- `.opencode/skills/sk-doc/create-diff/references/workflow.md`
- `.opencode/skills/sk-doc/create-diff/feature-catalog/snapshot-lifecycle/snapshot-state-management.md`
- `.opencode/skills/sk-doc/create-diff/manual-testing-playbook/safety/hostile-content-escaped.md`
- `.opencode/skills/sk-doc/create-diff/manual-testing-playbook/safety/source-never-mutated.md`
- `.opencode/skills/sk-doc/create-diff/manual-testing-playbook/snapshot/snapshot-status-and-cleanup.md`
- `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md`
- `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/checklist.md`
- `.opencode/skills/sk-code/code-review/references/review_core.md` (severity doctrine)

## Findings - New

### P0 Findings
1. **A crafted snapshot manifest makes cleanup unlink arbitrary writable files outside the state store** -- `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:1444` -- `_load_manifest` accepts the store's JSON without schema or path validation, then `cmd_cleanup` forms `blob = sub / s["blob"]` and calls `blob.unlink()` at lines 1447-1448 without requiring a basename or proving the resolved target remains under `sub`. A manifest entry such as `../../../victim.txt` therefore escapes the selected store. A focused temporary-directory reproduction passed such an entry to the shipped `cmd_cleanup`; it returned `0`, printed the escaped path as removed, and deleted the victim outside the state directory. This violates the documented contract that cleanup removes snapshots from a disposable store [SOURCE: `.opencode/skills/sk-doc/create-diff/feature-catalog/snapshot-lifecycle/snapshot-state-management.md:20-28`] and meets the shared P0 definition of destructive data loss [SOURCE: `.opencode/skills/sk-code/code-review/references/review_core.md:30-34`].
   - Finding class: class-of-bug
   - Scope proof: Focused inspection found one destructive unlink site, at `create_diff.py:1447-1448`; its path is wholly derived from unvalidated `manifest.json` data loaded at lines 1432-1444. No cleanup test, blob-basename check, `resolve()` containment check, or canonical-manifest rejection was found in `test_create_diff.py`.
   - Affected surface hints: `["cleanup command", "custom/default snapshot stores", "manifest trust boundary", "all user-writable files reachable by the process"]`
   - content_hash: `0c69843c1ef5a5194ac0ea92716c36b014365e1dc7e1ab943e17ab9d3c089fa1`

```json
{"type":"claim-adjudication","findingId":"P0-001","claim":"cleanup trusts manifest blob paths, allowing a crafted snapshot manifest to unlink a writable file outside the selected state store","evidenceRefs":[".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:1178-1184",".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:1431-1448",".opencode/skills/sk-doc/create-diff/feature-catalog/snapshot-lifecycle/snapshot-state-management.md:20-28","temporary reproduction: cleanupExit=0, victimExistsAfterCleanup=false"],"counterevidenceSought":"Hunter inspected every state-path constructor and destructive operation. Skeptic searched the regression suite and packet docs for manifest schema checks, basename restrictions, resolved-path containment, symlink/path-traversal defenses, mandatory dry-run, or an explicit trusted-store precondition; none was found. Dry-run exists but is optional and executes the same unvalidated path assembly.","alternativeExplanation":"The store is intended to be local and disposable, and exploitation requires a crafted or corrupted manifest plus a user invoking real cleanup. That lowers reachability but does not contain the deletion to the disposable store; default stores can be inherited with a working tree and --state-dir explicitly accepts arbitrary stores.","finalSeverity":"P0","confidence":0.99,"downgradeTrigger":"Downgrade only if current code rejects non-basename blob values and proves the resolved unlink target is a regular snapshot file contained beneath the selected snapshot subdirectory, or if authoritative threat-model evidence makes every accepted state store integrity-protected and cleanup cannot consume attacker-controlled/corrupt manifests.","hunter":"Identified manifest-to-filesystem joins in compare and cleanup, then isolated the only destructive sink.","skeptic":"Challenged exploitability using the local-only design, optional dry-run, and disposable-store intent; none prevents an escaped unlink during a real cleanup.","referee":"The executable reproduction proves deletion outside the store. Because impact is arbitrary writable-file loss rather than snapshot-only pruning, P0 is sustained."}
```

### P1 Findings
None new.

#### Corrected carried adjudication — P1-001 (not new)
The iteration-001 correctness finding remains active and unchanged; this packet corrects the omitted identifier only and is excluded from this iteration's new finding counts.

```json
{"findingId":"P1-001","claim":"Unsupported cqi makes the variable-backed consuming declarations invalid instead of selecting the clamp bounds, violating the specified fixed-size fallback.","evidenceRefs":[".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:720-727",".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:731-738",".opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md:137",".opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md:153"],"counterevidenceSought":"Checked for fixed fallback declarations, @supports guards, and containment by the fixed body font. The body rule prevents total loss of readable text, but it does not preserve the prior per-surface sizes or the font shorthand properties.","alternativeExplanation":"Modern Chromium IDE webviews support container query units, so the defect is confined to the explicitly promised unsupported-engine path.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade only if the fallback requirement is removed or engine-level evidence proves unsupported cqi inside these var()-substituted clamp() values resolves to the declared bounds."}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: not expanded because the iteration-001 approach is marked BLOCKED; security review used direct producer, validator, test, and exact integration-document evidence instead.
- `checklist_evidence`: not expanded because the strategy marks this approach BLOCKED.
- Security contract: partial/fail. Renderer escaping and CSP/allowlist boundaries are supported, but snapshot cleanup violates its store-containment contract.
- Structural-impact analysis unavailable/not needed: the rendered prompt named the exact renderer, validator, tests, and state-operation surfaces; direct reads and a focused reproduction supplied evidence.

## Integration Evidence
- Renderer producer: `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` escapes source rows at lines 516-517 and 612-693, escapes labels/warnings/title at lines 817-818 and 858-907, and emits the exact CSP at line 898.
- Safety validator: `.opencode/skills/sk-doc/create-diff/scripts/validate_report.py` enforces exact CSP directives, tag/attribute allowlists, local fragment links, and active-CSS rejection at lines 35-118 and 141-242.
- Regression consumer: `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py` exercises CSP parser differentials, live elements/attributes/references, hostile source escaping, and both report views at lines 184-297.
- Snapshot lifecycle: `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` manifest loading and cleanup deletion path at lines 1178-1193 and 1413-1455, cross-checked against `.opencode/skills/sk-doc/create-diff/feature-catalog/snapshot-lifecycle/snapshot-state-management.md`.

## Edge Cases
- The P0 requires a crafted or corrupted state manifest and a non-dry-run cleanup invocation; it does not arise from ordinary manifests generated by `capture_snapshot`.
- `--dry-run` exposes the escaped target but is optional, so it is counterevidence about operator visibility rather than containment.
- A local user already able to edit the same victim needs no exploit; the meaningful boundary is an untrusted project/default store or supplied state directory causing a different operator/process to delete a file it can write.
- The corrected P1-001 packet is administrative carry-forward, not security evidence and not a new or refined finding.

## Confirmed-Clean Surfaces
- Diff source text reaches report cells only through `html.escape`, including inline-diff segments and ordinary add/remove/context rows.
- Dynamic title, labels, warnings, format, tier, and timestamp values are escaped before HTML insertion.
- The renderer's CSP literal matches the validator's exact directive set, and the validator rejects duplicate CSP attributes, late/multiple/weakened policies, active elements/attributes, external links, and active/external CSS constructs.
- Hostile-content and four-view conformance tests directly cover escaped source inertness and validator acceptance.

## Ruled Out
- No renderer HTML-injection finding was supported by the inspected source-to-row and dynamic-metadata paths.
- No CSP-preservation or validator-allowlist bypass was supported by the inspected implementation and focused adversarial tests.
- The cleanup issue was not downgraded to P1: the temporary reproduction demonstrated actual deletion outside the disposable store, satisfying the doctrine's destructive-data-loss blocker condition.
- No additional report-overwrite finding was opened; `--report` is an explicit output path, and the stronger untrusted-manifest deletion primitive is the verified security blocker for this iteration.

## Next Focus
- Dimension: traceability
- Focus area: reconcile spec/checklist claims with implementation and named catalog/playbook consumers, including the new cleanup-containment contradiction
- Reason: security is complete with one destructive file-operation blocker; renderer escaping, CSP, hostile-content, and validator boundaries are otherwise supported
- Rotation status: rotate to the first unchecked dimension
- Blocked/productive carry-forward: do not retry iteration-001 BLOCKED correctness protocols; carry direct producer/consumer evidence and the P0 reproduction
- Required evidence: exact packet requirement/checklist and named integration-surface citations, plus reducer-visible treatment of the corrected P1-001 adjudication

Review verdict: FAIL
