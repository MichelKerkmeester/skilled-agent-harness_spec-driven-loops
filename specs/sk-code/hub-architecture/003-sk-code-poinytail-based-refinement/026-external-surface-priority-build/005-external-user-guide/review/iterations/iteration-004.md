# Deep Review Iteration 004

## Dispatcher

- Mode: review, agent `@deep-review`, run 4, session `2026-10-13T09:30:10.618Z`, generation 1, lineageMode new.
- Target: commits `8f59b9bd0a` and `1895122d37` on branch `worktrees/129-surface-guide` (diff `d99ddaff7d..1895122d37`); scope files per `deep-review-config.json`.
- Focus: maintainability (D4) - plain-language clarity for an external user, duplicated or contradictory statements across the guide, the R4 lines and the release note, Human Voice Rules (no em dash, semicolon or Oxford comma), changelog template shape, and any remaining three-peer-surface or replace-OpenCode wording.
- Budget profile: verify; discovery closed at 9 analysis calls, artifact writes inside the iteration ceiling.

## Dimension

D4 Maintainability: documentation quality and safe follow-on change cost of the rewritten docs. Checked punctuation voice rules, changelog shape, cross-document consistency of the native/optional role rewrite, heading and anchor integrity, and whether any remaining line still misstates the surface set.

## Files Reviewed

- `README.md:800` (R4 bullet), `:1384` (R4 bullet), `:1445` (block heading), `:1447`-`:1483` (guide and recipes) [SOURCE: README.md:1445]
- `README.md:244` (ToC link), `:1376` (explicit anchor) [SOURCE: README.md:244]
- `.skilled/skills/sk-code/SKILL.md:40` (canonical surface list sentence) [SOURCE: .skilled/skills/sk-code/SKILL.md:40]
- `.skilled/skills/sk-code/README.md:23`, `:55`-`:57`, `:90` (hub rows) [SOURCE: .skilled/skills/sk-code/README.md:23]
- `.hermes/skills/sk-code/SKILL.md:45` (regenerated mirror) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]
- `.skilled/changelog/skilled/v4.0.0.5.md:1` (release note) [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1]
- `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1` (compact format reference) [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1]
- `.skilled/skills/sk-code/shared/references/phase-detection.md:16` (three-surface wording) [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:16]
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46` and `:320` (surface-count check) [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:1` (SC-002, D2), `goal.md:1` (directive) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:1]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch` (all added and removed lines) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch:1]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new in D4.

Carried active advisories, not re-litigated this iteration:

1. R1-P2-001 (correctness): removal and add recipes leave `.hermes` runtime mirror packets untouched; only the pre-commit mirror gate catches it.
2. R1-P2-002 (correctness): root README R4 lines go stale after example removal and the hub-rooted sweep cannot flag them.
3. R2-P2-001 (security): removal recipe deletes the example folder without a work-loss preflight.
4. R3-P2-001 (traceability): spec Files to Change does not list the generated artifacts the diff carries.

## Traceability Checks

- `spec_code` (core) - carried pass from iteration 3 for REQ-001, REQ-004 and REQ-005; this iteration adds the maintainability-side of SC-002 ("no canonical inventory presents the examples as peers of the native surface"): the sweep of README.md and the sk-code doc tree found no peer-triplet presentation [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:1].
- `checklist_evidence` (core) - partial carried: AC-002, AC-003 and AC-006 await the closeout ledger rows; AC-001, AC-004 and AC-005 remain covered by the iteration 3 criterion reruns.
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) - carried on the exhausted list; R1-P2-001 stays active for the mirror gap and no overlay direction was re-entered.

Maintainability checks executed this iteration:

- Human Voice punctuation sweep over every added line in the diff: `grep '^+'` piped through `—|;` matched only the `&nbsp;` entity semicolons; the serial-comma scan matched clause joins and two-item pairs only. Added prose carries no em dash, semicolon or Oxford comma (evidence: scratch/review-diff.patch added lines).
- Changelog compact-shape cross-check against the template: frontmatter block, one-sentence summary, spec-folder line, `&nbsp;` separator before each H2, six glance bullets (the compact ceiling), and the `## Upgrade` section with "No migration required." all conform; `validate_document.py` exit 0 is already recorded by goal criterion 3 [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1].
- Surface-role consistency across the guide, the R4 lines, the hub rows, the Hermes mirror and the release note: all five state OPENCODE native and WEBFLOW and OBSIDIAN optional examples, and the add-ahead-of-OpenCode ranking is identical in the guide, the add recipe and the release note [SOURCE: README.md:800] [SOURCE: .skilled/skills/sk-code/SKILL.md:40].
- Heading and anchor integrity: the `#### What Adapting `sk-code` Looks Like` heading at `README.md:1445` is a diff context line (unchanged), the explicit anchor at `README.md:1376` still backs the ToC link at `README.md:244`, so the doctor 3c pointer and the ToC resolve [SOURCE: README.md:1445].
- Terminology consistency: uppercase `OPENCODE` is used as the surface identifier, title-case OpenCode as the runtime name, and "native" / "optional example" wording is uniform after the rewrite.

## Integration Evidence

- `/deep:review` single-iteration dispatch; LEAF-only, no sub-agents.
- Diff artifact: `scratch/review-diff.patch` (diff `d99ddaff7d..1895122d37`), read as data only.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` `checkSurfaces` is the integration surface that closes the stale-count direction: its `SURFACE_COUNT_WORDING` pattern matches "three surfaces" wording and compares it to the count `mode-registry.json` declares, so removal recipe step 7 flags a stale count anywhere in the hub walk [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:320].
- Changelog template is the integration surface for the release-note shape check.

## Edge Cases

- `.skilled/skills/sk-code/shared/references/phase-detection.md:16` ("All three surfaces in the hub `SKILL.md` surface list ... follow the same lifecycle") enumerates the three surfaces without role markers, but it is not a canonical inventory and its count wording is machine-checked after any removal, so it is ruled out rather than reported [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:16].
- The four prior P2 advisories remain open by design; this iteration neither resolved nor duplicated them.
- No exhausted direction from iterations 1 to 3 was re-entered.

## Confirmed-Clean Surfaces

- Human Voice Rules: no em dash, no prose semicolon and no Oxford comma in the added lines of the diff.
- Changelog compact shape: v4.0.0.5 matches the template's compact format, including H2 separation and the glance-bullet ceiling.
- Native/optional role statement: consistent across README.md, the hub `SKILL.md`, the hub README, the Hermes mirror and the release note.
- Anchors: guide heading and ToC anchor unchanged and resolving.
- No remaining canonical line tells the user to replace OpenCode, and no canonical inventory presents the examples as peers of the native surface.

## Ruled Out

- Stale three-surface wording in `shared/references/phase-detection.md:16`: `verify-doc-claims.cjs` `checkSurfaces` matches count wording against `mode-registry.json`, and removal recipe step 7 runs that check (iteration 4; evidence: verify-doc-claims.cjs:46, :320).
- `SKILL.md:40` canonicality claim ("any other sk-code doc that counts surfaces points to this sentence") as unmet by the hub README: `README.md:23` points at the hub `SKILL.md` surface list, and the `:55-57` and `:90` role restatements are the spec's D2-mandated markers, not a competing count (iteration 4; evidence: spec D2 and hub README rows).
- Heading or anchor breakage from the guide rewrite: the `README.md:1445` heading is unchanged in the diff and the `README.md:1376` anchor still resolves the `README.md:244` ToC link (iteration 4).
- Remaining replace-example wording at `README.md:1384` as a replace-OpenCode instruction: the sentence keeps the native surface and only invites removing or replacing optional examples, which is the subject of the active R2-P2-001 advisory, not a new voice defect (iteration 4).

## Verdict

PASS with advisories: 0 P0, 0 P1, 0 new P2. R1-P2-001, R1-P2-002, R2-P2-001 and R3-P2-001 remain active and none block. Maintainability is covered, so all four dimensions are complete.

## Next Dimension

Cross-reference synthesis (all dimensions complete; iteration 5 runs under the max-iterations stop policy).

## Next Focus

- Dimension: cross-reference / synthesis (all four dimensions complete).
- Focus area: final pass over the four active P2 advisories against the frozen diff state and the closeout handoff.
- Reason: D4 is complete; stop policy max-iterations runs iteration 5.
- Rotation status: all dimensions complete; synthesis next.
- Blocked/productive carry-forward: R1-P2-001, R1-P2-002, R2-P2-001 and R3-P2-001 remain active P2 advisories; ledger rows P11-1 to P11-6 belong to closeout.
- Required evidence: README.md:1456, :1461, :1384, spec.md:91, .hermes/skills/sk-code/SKILL.md:45.

Review verdict: PASS
