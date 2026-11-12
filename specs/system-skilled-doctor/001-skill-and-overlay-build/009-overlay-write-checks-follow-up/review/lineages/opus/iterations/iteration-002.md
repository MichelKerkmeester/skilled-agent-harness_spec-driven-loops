# Iteration 002 — Security, traceability and maintainability: write checks, commit check, audit, OpenCode adapter, docs

## Dispatcher

- Lineage: opus (fan-out), session `fanout-opus-1794439428470-vyb51k`, generation 1
- Executor: cli-claude-code, model claude-opus-5-5, run inline in this process (no nested dispatch)
- Dimensions: security, traceability, maintainability (the three remaining after iteration 1)
- Budget profile: verify
- Review focus handling: this iteration took the focus's second half: the strict write checks (`strictWriteRefusal`, `globToRegExp`, `isVendoredKey`), the commit check (`stagedUnownedChanges`, `commandPreCommit`), `status --audit` (`auditVendoredTree`), the OpenCode adapter, and whether `overlay.md`, `_routes.yaml`, `assets/doctor-overlay-*` and `references/overlays.md` match the engine. It also tested iteration 1's downgrade trigger against the docs.
- steer.md: not present in the lineage directory before this iteration.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs` lines 351-373 (canonicalPath), 3924-4068 (strict write checks), 4229-4487 (commit check, audit, pre-commit)
- `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` (symlink to `.opencode/plugins/overlay-guard.js`, read through the link) and `.skilled/hooks/overlay-guard/opencode/README.md`
- `.skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs` and `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` (test names)
- `.skilled/commands/doctor/overlay.md` lines 3, 35-47, 66-70, 99-108
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` lines 31-41, 84-122; `.skilled/commands/doctor/assets/doctor-overlay-status.yaml` lines 28-69
- `.skilled/commands/doctor/_routes.yaml` lines 627-657
- `.skilled/skills/system-skilled-doctor/references/overlays.md` lines 57, 89-101, 132-169
- `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

5. **The apply workflow tells the operator "nothing was written" after a relayout has already moved the copies** -- .skilled/commands/doctor/assets/doctor-overlay-apply.yaml:113 -- the YAML reads exit 2 with an `[overlay-engine]` stderr line from `apply --relayout` as "the manifest changed under the run ... and nothing was written". In the engine that error comes from `rewriteRelayoutManifest` (overlay-engine.cjs:4672-4673, 4687-4688), which runs only after the backup has been written and every rename has been done (4721-4738). `main` turns the throw into exit 2 with an `[overlay-engine]` stderr line (4849-4853). So the route reports a clean refusal when the overlay folder holds moved copies, an un-rewritten manifest and a new `relayout-runs/<stamp>/` backup. Acting on that report, the operator does not restore the backup, and the next `status` or `apply` fails on sources the manifest still names at their old paths. This is the reporting side of iteration 1 finding 4.
   Finding class: doc-to-engine contract drift on a data-state report
   Scope proof: both the YAML and the engine path are in the review target
   Affected surface hints: doctor-overlay-apply.yaml exit-2 relayout row; overlay.md step 11; overlay-engine.cjs relayoutUnderLock ordering
   Case: the manifest's `source` for an entry is edited by hand after the engine loaded it and before the rewrite, or a field fails the planned-path check; the engine has moved the copies and exits 2, and the route prints that nothing was written and ends STATUS=FAIL with no restore step.

```json
{"type":"claim-adjudication","findingId":"OPUS-I2-P1-005","claim":"doctor-overlay-apply.yaml says nothing was written for the exit-2 relayout error that the engine only raises after moving the copies","evidenceRefs":[".skilled/commands/doctor/assets/doctor-overlay-apply.yaml:113",".skilled/commands/doctor/scripts/overlay-engine.cjs:4732",".skilled/commands/doctor/scripts/overlay-engine.cjs:4742",".skilled/commands/doctor/scripts/overlay-engine.cjs:4672",".skilled/commands/doctor/scripts/overlay-engine.cjs:4852"],"counterevidenceSought":"Checked for any other source of an [overlay-engine] exit-2 line during relayout before the moves: loadManifest and planRelayout problems are printed to stdout as refuse lines (4711-4713), not thrown; withLock lock refusals print to stdout. A throw from copyForBackup or renameSync would also land after earlier writes.","alternativeExplanation":"A loadManifest parse failure inside commandRelayout also throws to stderr with nothing written; the YAML's sentence fits that case but names the field mismatch specifically.","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"Downgrade to P2 if relayout is changed to rewrite the manifest before moving, or to restore the backup on a throw, so that 'nothing was written' becomes true."}
```

### P2 Findings

6. **The status workflow names `/doctor:overlay relayout`, a target that does not exist** -- .skilled/commands/doctor/assets/doctor-overlay-status.yaml:58 -- the status route tells the renderer to "name /doctor:overlay relayout beside each LAYOUT line". The engine prints `run ... apply --relayout` (overlay-engine.cjs:2480), `references/overlays.md:89` names `/doctor:overlay apply --relayout`, `_routes.yaml:655` lists `--relayout` only as an apply flag, and the engine test refuses a bare `relayout` command word (tests/overlay-engine-follow-up.test.cjs:710-714).
   Finding class: doc-to-engine command drift
   Scope proof: status YAML is in scope
   Affected surface hints: doctor-overlay-status.yaml line 58; doctor-overlay-presentation.txt if it renders the same hint
   Case: an operator runs `/doctor:overlay status` on a tree with an off-layout source, copies the suggested `/doctor:overlay relayout`, and the command is refused as an unknown target.

7. **Any staged pin change switches the whole commit check off** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:4293 -- `stagedUnownedChanges` returns no findings whenever the staged manifest's `pin.commit` differs from HEAD's. Nothing ties that to a real re-pin: a hand edit of the pin value, or a re-pin commit that also stages unrelated edits to vendored files, passes every unowned change unchecked. `references/overlays.md:159` documents the skip but not that it covers unrelated changes in the same commit.
   Finding class: check bypass
   Scope proof: pre-commit path in the engine under review
   Affected surface hints: overlay-engine.cjs stagedUnownedChanges; overlays.md commit-check paragraph; strict-writes test 'a staged re-pin names each listed root file upstream changed' (strict-writes.test.cjs:562)
   Case: with `strictWrites` on, an agent edits `.skilled/skills/x/SKILL.md` (no overlay owns it), bumps `pin.commit` in the manifest, and stages both; `pre-commit` prints `allow` and exits 0.

8. **The lock docs leave out relayout and rollback** -- .skilled/skills/system-skilled-doctor/references/overlays.md:57 -- the file table says `.build-lock` is "present only while an `apply`, a capture, an adopt or a re-pin runs", and the held-lock section (99) says "`apply` and a capture take" it. `apply --relayout` (overlay-engine.cjs:4755) and the re-pin rollback (3864) take the same lock, and its stale-lock takeover applies to them too.
   Finding class: doc drift
   Scope proof: reference doc in scope
   Affected surface hints: overlays.md file table and §4 held-lock text
   Case: an operator sees `.build-lock` while a relayout or rollback runs, reads that only apply, capture, adopt or re-pin hold it, and treats it as stale.

9. **No test or playbook scenario covers the relayout link rewrite** -- .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:549 -- the relayout fixture sets `layoutLinks: []`, and the SKD-009 playbook scenario writes `"layoutLinks":[]` too (manual-testing-playbook/overlays/relayout-moves-sources.md:44). Nothing exercises `relayoutLinkTargets` or the link half of `rewriteRelayoutManifest` (overlay-engine.cjs:4633-4648, 4678-4692), the branch where iteration 1 finding 1 sits.
   Finding class: test coverage gap
   Scope proof: tests and playbook in scope
   Affected surface hints: follow-up relayout tests; SKD-009 scenario
   Case: a regression that rewrites a link target to the wrong relative path, or that leaves the live link dangling, passes the whole suite and the playbook.

## Traceability Checks

- spec_code: partial. The engine matches `overlay.md` and `_routes.yaml` on flag ownership (`--audit` on status; `--capture`, `--adopt` and `--relayout` mutually exclusive on apply) and on the audit kinds (`differs`, `missing`, `extra` for tracked paths only; overlay.md:66 matches overlay-engine.cjs:4418-4460). It drifts in findings 5, 6 and 8.
- Iteration 1 downgrade trigger tested: `overlay.md:108` and `doctor-overlay-apply.yaml:104` run `apply --relayout` and then `apply` in the same route, with no plain apply first. Finding 1 keeps P1, and `doctor-overlay-apply.yaml:114` ("exit 1 from the apply a relayout run makes") is the output an operator sees in that case, with no repair named.
- playbook_capability: SKD-009 covers relayout without links only (finding 9). The stale-lock, strict-guard, adopt and pre-commit scenarios exist as named in the diff stat.
- checklist_evidence: not assessed against the packet's `acceptance-criteria.md` within the budget; carried to synthesis as not covered.

## Integration Evidence

- OpenCode adapter: `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` is a relative symlink to `../../../../.opencode/plugins/overlay-guard.js`, which resolves to the repository's `.opencode/plugins/overlay-guard.js`. The plugin handles `tool.execute.before` for `write`, `edit`, `multiedit`, `patch` and `apply_patch`, reads the file field plus the patch-body headers, calls `guardCore.evaluateWrite` with the OpenCode project directory, throws `result.reason` on deny, and logs to a rotated file. On a judging error it logs and allows. This matches its README.
- The OpenCode test (`opencode-overlay-guard.test.mjs:136-163`) covers an owned-file refusal, a strict new-file refusal, an outside path, a non-write tool and a tree with no manifest. It has no case for a core error (fail-open with a log line); that is noted, not raised as a finding.

## Edge Cases

- Lineage blocker (carried from iteration 1): `node` invocations are refused by the session permission layer, so the gateway, the reducer and every test run stayed out of reach. The canonical record for this iteration is at `gateway-events/iteration-002.json`.
- `strictWriteRefusal` resolves the path with `realpathSync.native` (canonicalPath, 351-367), so on a case-insensitive file system a differently-cased spelling of an existing vendored path resolves to its real case before the root comparison. A new file under a differently-cased folder that does not exist yet keeps the typed case and could miss the `.skilled/` prefix. This is not raised as a finding, because the guard is not the only check (the commit check sees the real path).
- The plugin loads the core with a top-level `require`; a missing core fails the plugin load rather than the documented per-call fail-open. Whether OpenCode then blocks or skips the plugin is UNKNOWN without running it, so it is recorded here and not as a finding.

## Confirmed-Clean Surfaces

- `globToRegExp` escapes every regex metacharacter except `*`, and `**/` matches zero or more whole segments, as `overlays.md:147` says.
- `isVendoredKey` checks `repin.exclude` first, matching `overlays.md:149`.
- The commit check compares contents with CRLF read as LF and treats a NUL byte as binary (4247-4251), matching `overlays.md:159`.
- The audit skips generated, managed and `.env` paths (4411-4412), matching `overlays.md:169`; it prints `AUDIT    skipped` with no checkout (2484).
- `--audit` is read-only: `auditVendoredTree` only runs git reads and `hash-object --stdin-paths` (which does not write objects without `-w`).

## Ruled Out

- Glob injection through `generated`: every metacharacter is escaped before the `RegExp` is built (3946).
- Audit misreport from a filename with a newline in `hash-object --stdin-paths`: a shifted id fails the match and falls back to a byte compare (4450-4451), so the cost is extra reads, not a false finding.
- OpenCode adapter path traversal: the core resolves and canonicalizes paths; the adapter only collects raw strings (targetPaths).

## Next Focus

- Dimension: none remaining. All four dimensions are covered and the iteration cap (2) is reached.
- Focus area: synthesis. Recheck the two P1s and carry the lineage blocker into the report.
- Reason: stopPolicy max-iterations
- Rotation status: correctness (1), security, traceability, maintainability (2)
- Required evidence: the claim-adjudication packets above

Review verdict: CONDITIONAL
