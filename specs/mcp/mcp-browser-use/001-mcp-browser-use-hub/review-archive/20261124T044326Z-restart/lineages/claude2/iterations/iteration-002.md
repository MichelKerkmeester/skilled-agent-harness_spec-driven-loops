# Iteration 002 — Security: Bladebro mode, installers and the mutation-class guard

## Dispatcher

- Lineage: claude2, sessionId `fanout-claude2-1795300286921-qfagh7`, iteration 2 of 5
- Dimension: security
- Operator focus coverage: this pass took the "Bladebro stealth-browser mode" commit and the trust-boundary parts of the "move of the Chrome DevTools and Aside modes" commit: the supply-chain gate (pin, digest, update path), the real-browser consent lanes, the new `bladebro` Code Mode manual, and the pre-commit and mutation-class guard paths the move had to widen. Diffs were taken against the merge base (`main...HEAD`), because the two-dot range also shows main's later commits as reversions.
- Sources: `steer.md` absent; strategy Next Focus from iteration 1.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:1-88`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:20-89`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:18-98`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:23-148` (R-SEC-1..3, ALWAYS/NEVER)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md:15-70`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/lane-off-and-stop.md:46`, `real-browser/lane-on-clone.md:65`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:11-340`
- `.utcp_config.json` (bladebro manual diff)
- `.skilled/scripts/git-hooks/pre-commit` (merge-base diff), `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` (merge-base diff), `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:8-70`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` (compared with `main:` copy under mcp-tooling)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The documented update path leaves the v4.8.2 pin and digest gate with no re-verify step** -- .skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:79 -- R-SEC-3 (SKILL.md:116) pins v4.8.2 and requires a SHA-256 check before use. Section 5 then offers `npm update -g bladebro` and `bladebro -u` as the update route with no instruction to re-pin, re-fetch the new release sidecar or re-run the digest check. The live benchmark doctor already reports `update available: v4.8.2 → v4.8.3` (benchmark README:96), so this path is one prompt away.
   - Finding class: security / supply chain
   - Scope proof: file added on this branch in the Bladebro commit.
   - Affected surface hints: `install-and-verify.md` §5, `SKILL.md` R-SEC-3, `manual-testing-playbook/preflight-and-install/native-binary-digest.md`.
   - Case: an operator follows the update line, npm installs 4.8.3, and the next run uses an unverified binary while the packet still claims a pinned, digest-checked install.

2. **The digest gate checks the native binary but not the npm launcher that actually runs** -- .skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md:44 -- The gate hashes `$(npm root -g)/bladebro/node_modules/bladebro-darwin-arm64/bladebro`. The `bladebro` command on PATH, which both the CLI lane and the new Code Mode manual (`.utcp_config.json` `"command": "bladebro"`) launch, is the npm JavaScript launcher that chooses and executes that native binary. A modified launcher passes the gate. The scenario's own triage (line 63) knows the shim and the native package differ.
   - Finding class: security / supply chain
   - Scope proof: playbook and `.utcp_config.json` manual both added on this branch.
   - Affected surface hints: `native-binary-digest.md`, `install-and-verify.md` §3, `mcp-wiring.md` §2.
   - Case: the npm package's JS entry is tampered while the optional native dependency is intact; the BB-003 gate reports PASS and the tampered launcher runs.

3. **The default `rb` lane (`auto`) attaches to any reachable debug endpoint, which bypasses the operator's profile choice** -- .skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:51 -- `auto` "attaches to a live, reachable debug endpoint, otherwise imports and uses a clone" and is marked "Fine on macOS". Consent checklist item 2 (line 82) requires that the operator chose the profile and account, but an attach goes to whatever browser listens on the debug port (the live status shows `attach_port: 9222`, benchmark README:213), not to the profile set with `rb profile`. The packet recommends `clone` as preferred, yet leaves the attach-first lane as the default without a warning.
   - Finding class: security / consent boundary
   - Scope proof: reference added on this branch.
   - Affected surface hints: `browser-lanes.md` lane table and consent checklist, `SKILL.md` R-SEC-1.
   - Case: the operator's everyday signed-in Chrome runs with remote debugging on 9222, the operator selects a staged profile with `rb profile`, runs `rb on` in the default lane, and Bladebro attaches to the everyday browser instead.

## Traceability Checks

- `spec_code` (partial): R-SEC-1..3 in `mcp-bladebro/SKILL.md:112-116` are mirrored in the references and the playbook teardown (`rb forget` present in `lane-off-and-stop.md:46`), except the update path and launcher coverage above.
- `checklist_evidence`: not run this iteration.

## Integration Evidence

- `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh .` -> `GUARD PASS`; the moved chrome-devtools and aside installers are discovered through the widened `skills/(mcp-tooling/|mcp-browser-use/)?mcp-*` pattern, which is identical in the pre-commit hook, the guard regex and the manifest comment.
- `.utcp_config.json` registers exactly one `bladebro` manual with an empty `env`, matching `mcp-wiring.md` §2.

## Edge Cases

- The two-dot `main..HEAD` diff shows many doctor and overlay-engine deletions that are main's newer commits, not this branch's; they are excluded. Only the merge-base diff is in scope.
- `install-and-verify.md:14` says none of the steps "has run on this host", while the macOS-live benchmark records a full run. That is a traceability issue and is carried to iteration 3.

## Confirmed-Clean Surfaces

- `mcp-chrome-devtools/scripts/install.sh` differs from its `main:` mcp-tooling copy only in one echoed path (line 392): a pure move, no new behaviour.
- Mutation-class manifest rows for chrome-devtools and aside point at existing `scripts/install.sh` and `scripts/doctor.sh` files.
- Bladebro ships no install script, so no unguarded installer enters the guard's worklist.
- The `npx -y bladebro mcp` alternative is correctly flagged as an install under R-SEC-3 (`mcp-wiring.md`).
- The benchmark record keeps cookie names and values out (README:46), and the clone teardown includes `rb forget`.

## Ruled Out

- Pre-commit/guard pattern drift after the move: all three copies of the pattern match.
- New mutating script without a manifest row: none; guard passes.

## Next Focus

- Dimension: traceability
- Focus area: packet docs (spec.md, decision-record.md, phase 002-006 spec/tasks/implementation-summary/acceptance-criteria) against the hub files; stale "has not run" claims in Bladebro references; mode-registry vs hub-router vs leaf-manifest vs description.json; playbook and benchmark counts.
- Reason: core protocols `checklist_evidence` and overlays `skill_agent`, `feature_catalog_code`, `playbook_capability` not yet run.
- Rotation status: correctness, security done (2/4).
- Verdict basis: no new P0/P1 this iteration, but C2-I1-P1-001 stays active, so the verdict over active findings is CONDITIONAL.

Review verdict: CONDITIONAL
