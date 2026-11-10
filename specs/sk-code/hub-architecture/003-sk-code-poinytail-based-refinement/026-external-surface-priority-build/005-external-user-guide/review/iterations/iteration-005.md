# Review Iteration 005 — Adversarial Re-Verification (All Dimensions)

## Dimension

Correctness is the named dimension. The iteration mandate is adversarial re-verification across all four dimensions: re-open every finding recorded in iterations 1 to 4, re-read the cited lines, drop or correct any that no longer hold, and probe what a first-time external user following only the guide would still trip on (step order, checks that stay red, paths that differ between the guide and the tree).

## Files Reviewed

- `README.md:1378-1502` — the R4 line and the full rewritten adaptation guide block, read line by line [SOURCE: README.md:1384] [SOURCE: README.md:1445] [SOURCE: README.md:1456] [SOURCE: README.md:1461]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:87-94` — Files to Change table [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:87]
- `.skilled/scripts/git-hooks/pre-commit:207-236` — mirror parity gate, `.hermes/skills` tree list, source-tree condition
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:12-86` — `--root` flag and `DEFAULT_HUB` default
- `.hermes/skills/sk-code/SKILL.md` — mirror of the edited hub skill (same roles, carried)
- Path probes: `.opencode/skills` symlink, `.hermes/skills/sk-code-webflow/`, `.hermes/skills/sk-code-obsidian/`, `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`, the canary fixture, `.skilled/skills/sk-code/sk-code-quality/`
- Live `git diff --name-only d99ddaff7d..1895122d37` output

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings (carried; re-verified this iteration)

1. **Removal and add recipes leave the `.hermes` runtime mirror packets untouched, and only the pre-commit mirror gate catches the deletion** -- README.md:1461 -- Step 6 enumerates only hub-rooted artifacts. The mirror packets `.hermes/skills/sk-code-webflow/` and `.hermes/skills/sk-code-obsidian/` exist as real directories and are not named. The gate that catches the stale mirror is the commit-time mirror parity gate [SOURCE: .skilled/scripts/git-hooks/pre-commit:233], not any of the six commands in the guide's **Verify** battery [SOURCE: README.md:1473]. Finding class: missing_instruction_step. Scope proof: recipe step 6 lists hub artifacts only; `ls` confirms both mirror packets exist; the battery commands do not read `.hermes`. Affected surface hints: `.hermes/skills/*` mirror tree, pre-commit mirror parity gate, guide steps 6 and 9. Case: a user without hooks installed follows removal manually, or runs the six-command battery, and ships a stale `.hermes` example packet until the next hook-enabled commit.

2. **Root README R4 lines go stale after example removal, and the hub-rooted sweep cannot flag them** -- README.md:1384 -- The line `- Keep the native OpenCode surface, and remove or replace the optional example Webflow and Obsidian surfaces with your own` advertises both examples. Removal step 7 runs `verify-doc-claims.cjs`, whose `--root` defaults to the hub directory [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:86], so this root-README line sits outside the walk. Step 7 names "the hub's `README.md`" [SOURCE: README.md:1462]. Finding class: stale_reference. Scope proof: default root resolution read in-script; the R4 line is outside the hub tree; step 7's fix list is hub-scoped. Affected surface hints: README.md R4 line, `verify-doc-claims.cjs` walk root, removal step 7. Case: a user removes both examples, runs the full recipe including step 7, and the first thing an external reader sees still advertises Webflow and Obsidian as shipped examples.

3. **Removal recipe deletes the example folder without a work-loss preflight, and an in-place-adapted example is lost** -- README.md:1456 -- Step 1 is `1. Delete the folder .skilled/skills/sk-code/<mode>/.` with no check that the folder may hold user work. The same README invites in-place adaptation: `remove or replace the optional example ... with your own` [SOURCE: README.md:1384], and the guide's intro says "You can remove them or keep them as models" [SOURCE: README.md:1447]. Finding class: destructive_data_loss. Scope proof: step 1 is an unconditional delete of a shipped example path whose contents the guide invites replacing in place; no preflight text exists between steps 1 and 9. Affected surface hints: removal step 1, the replace invitation at README.md:1384, the models sentence at README.md:1447. Case: a user edits `.skilled/skills/sk-code/sk-code-webflow/` into their own stack surface instead of adding a new packet, later decides to drop "the example", runs step 1, and deletes their own adapted work with no warning.

4. **Spec Files to Change does not authorize the generated artifacts the diff carries** -- specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:91 -- Live `git diff --name-only d99ddaff7d..1895122d37` returns seven paths; the Files to Change table names four. The unlisted three are `.hermes/skills/sk-code/SKILL.md` (the regenerated Hermes mirror of the edited hub `SKILL.md`) and the two compiled-routing activation manifests (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`). Phase 003's review treated the analogous omission as P2 and fixed it by adding the generated Hermes copy to its Files to Change table. Finding class: spec_scope_mismatch. Scope proof: the diff path list is a live command result; the table rows are at spec.md:89-94; the three unlisted paths are generated or regenerated side effects of the named edits. Affected surface hints: spec Files to Change table, scope audit trail, phase-003 precedent. Case: a reviewer comparing the diff against the authorized file list cannot tell whether the mirror and manifest changes are in-scope or unreviewed drift.

## Traceability Checks

- `spec_code` (core) — carried pass for REQ-001, REQ-004, REQ-005 from iteration 3; this iteration re-read the R4 line at its live location and confirms the wording. No gap.
- `checklist_evidence` (core) — partial, carried: P11-5 (R4 lines read and quoted) is covered; P11-1 to P11-4 and P11-6 are closeout ledger rows recorded per goal C3 sequence. Deferred, not failed (SL-004).
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) — carried on the exhausted list; no overlay direction was re-entered. The changed surface sentence remains identical in the Hermes mirror; R1-P2-001 stays active for the mirror-packet gap.

## Edge Cases

- **Off-by-one suspicion on `README.md:1384` resolved.** A manual line count suggested the R4 line might sit at 1383. `grep -n` confirms `- Keep the native OpenCode surface...` is line 1384 and `README.md:1445` is the heading. The prior citations are exact; no correction needed.
- **Literal path `manual-testing-playbook.md` does not exist beside the `manual-testing-playbook/` directory.** The removal step names the directory first, then the rows file inside it; the file resolves at `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`. Ruled out as a wrong-path finding; the relative reading is unambiguous in context.
- **Hub `SKILL.md` mirror regeneration after removal step 5** is the same `.hermes` mirror class as R1-P2-001 and is caught by the same commit-time gate. Not raised as a separate finding.
- **First-time-user sweep.** The `.opencode/skills` keep-rule symlink resolves (`-> ../.skilled/skills`), the canary fixture and surface-hint test paths exist, `sk-code-quality/` exists, and the hooks-first step order, the per-surface removal loop, the add recipe and the six-command battery show no new red-check or ordering trap beyond the four carried advisories.
- **Scope violations:** none. All writes stayed inside the review packet.
- Deferred: closeout acceptance ledger rows P11-1 to P11-6 (goal C3).

## Confirmed-Clean Surfaces

- Guide step paths named in removal step 6 and the add recipe all resolve.
- `verify-doc-claims.cjs` `--root` default is the hub directory, evidence for R1-P2-002, not a defect by itself.
- Pre-commit mirror parity gate covers `.hermes/skills` at commit time; the gap is guide coverage, not gate coverage.

## Ruled Out

- New path, step-order or red-check trip for a first-time user following only the guide — none found this iteration beyond the four carried P2 advisories.
- `README.md:1384` mis-citation — ruled out by live `grep -n`.
- `manual-testing-playbook.md` as a missing path — ruled out; it resolves inside the named directory.
- Duplicate finding for the hub `SKILL.md` `.hermes` mirror — folded into R1-P2-001.

## Verdict

PASS with advisories. No P0 or P1 exists; four P2 advisories remain active and are carried to synthesis: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001. `hasAdvisories=true`.

## Next Dimension

None — all four dimensions are complete, and stop policy `max-iterations` is reached at iteration 5 of 5. Next step is the synthesis/closeout phase: carry the four P2 advisories, record the deferred acceptance ledger rows P11-1 to P11-6, and reconcile completion metadata.

Review verdict: PASS
