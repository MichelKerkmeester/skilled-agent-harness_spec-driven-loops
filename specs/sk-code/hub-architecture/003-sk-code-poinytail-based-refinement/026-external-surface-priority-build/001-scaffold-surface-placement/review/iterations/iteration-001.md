# Iteration 001 — Correctness

- Target: Commit `17bb342b1c` on branch `worktrees/125-surface-placement`
- Dimension: correctness (D1 of 4)
- Mode: review, iteration 1 of 5
- Prior findings: P0=0 P1=0 P2=0
- Pivot lineage: none yet (first iteration)

## Dimension

Correctness of the commit under review: (1) does the new `tieBreak` insertion rule state exactly one deterministic placement, (2) is it carried identically to every site the spec requires, (3) are the two new `step_6_completion` follow-up lines executable as written against the current repository, and (4) does the v1.5.4.0 release surface (SKILL.md version, changelog, Hermes copy) stay internally consistent.

## Files Reviewed

| File | What was checked |
| --- | --- |
| `.skilled/commands/create/assets/create-skill-parent-auto.yaml` | step_4 tieBreak rule at line 423; step_6 canary/manifest lines at 500-501; quality_standards tieBreak mention at 250 (descriptive, not a writer) |
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml` | step_4 tieBreak rule at line 462; step_6 canary/manifest lines at 547-548; quality_standards tieBreak mention at 283 (descriptive, not a writer) |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Tie-break ordering paragraph in §7; frontmatter version bump 1.2.0.21 → 1.2.1.0; §3 required-field rule vs the new sentence |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | §7 row 3 (stage-one tie-break); frontmatter version bump 1.2.0.28 → 1.2.1.0 |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | version line 1.5.3.0 → 1.5.4.0 |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.4.0.md` | New changelog entry: frontmatter version, trigger phrases, claim parity with the four changed sites |
| `.hermes/skills/sk-create-skill/SKILL.md` | Generated Hermes copy: version line 1.5.4.0; diff vs canonical limited to generated header + one rewritten link |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json` | Template `tieBreak` placeholder order (workflows, surface, transport) vs the new rule |
| `.skilled/scripts/install-git-hooks.sh` | Exists; header declares the pre-commit compiled-routing re-mint gate |
| `.skilled/bin/compiled-route-manifest.cjs` | `mint\|refresh\|freshness` verbs exist for the manual follow-up |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | `findCanaryFixtureDir` (1189) and the 5k-canary read (1271, 1278) resolve the compiled-routing fixture tree |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` + its `specs/sk-doc/z_archive/...` twin | Follow-up path real; the pair is byte-identical |
| `specs/sk-code/011-.../001-scaffold-surface-placement/spec.md`, `plan.md`, `tasks.md` | R1/R8, plan.md:62, tasks T003/T006 alignment |

## Findings by Severity

### P0 — none

### P1 — none

### P2 — 1

#### R1-P2-001 — tieBreak insertion rule leaves the order among multiple new surfaces undefined

- **Case:** `/create:skill-parent update --surfaces alpha,beta` on a hub whose `tieBreak` already ends with surface `gamma`. Both `[…workflows, alpha, beta, gamma]` and `[…workflows, beta, alpha, gamma]` satisfy the written rule, so a keyword tie between `alpha` and `beta` resolves by whichever reading the executor picked.
- **File:** `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423` (same rule in `create-skill-parent-confirm.yaml:462`, `parent-hub-router-schema.md` §7, `parent-skills-nested-packets.md` §7 row 3)
- **Evidence:** The added clause fixes only the new surface's position relative to the pre-existing modes — "each new surface mode placed after the workflow modes and ahead of the existing surface modes, and every mode already listed kept where it is" — and never states the relative order of two surfaces added in the same invocation. `--surfaces` accepts a comma-separated list (`field_handling.surfaces` in both twins; `defaults.surface_packet_naming`), and spec REQ-002 exercises only a single stand-in surface.
- **User impact:** Two surfaces minted in one run can land in an order the author did not choose; when both match the same request keyword, the wrong evidence base is routed until a human notices.
- **Finding class:** algorithmic
- **Counterevidence sought:** whether `--surfaces` accepts only one name (no — comma-separated list is the declared contract); whether spec REQ-002 or the commit verification covers a multi-surface run (no — one stand-in); whether any of the four sites already pins the order elsewhere (`rg` over all four found no second clause).
- **Alternative explanation:** A reader may infer input order because the rule is phrased per mode; but an implementation that re-inserts each new surface "ahead of the existing surface modes" one at a time lands them in reverse order and is equally compliant with the text as written.
- **Final severity:** P2 (below the P1 bar: no gate fails, single-surface runs are unaffected, and the written rule still fixes placement relative to all pre-existing modes).
- **Confidence:** 0.7
- **Downgrade trigger:** An explicit order clause added to all four sites, or a documented single-surface limit on `--surfaces`, would drop this to not-a-finding.
- **Recommendation:** Extend the same phrase in all four sites, e.g. "…ahead of the existing surface modes, and when several surfaces are added in one run, in the order given."

## Traceability Checks

Core:
- **spec_code — pass.** spec.md R1 ("word for word the same in each"; exact shared phrase "ahead of the existing surface modes") and R8 (both follow-up lines name `canary-cases.v1.json` and `install-git-hooks.sh` literally) match the implemented text at all four sites; plan.md:57 names step_4 as the only `tieBreak` writer and plan.md:62 names the `gate:route-remint` copy path the completion line describes.
- **checklist_evidence — pass with note.** tasks.md T003/T006 exist and map 1:1 to the change; both remain unchecked (`- [ ]`), which is expected until the packet's completion gate runs (traceability dimension D3 will own any closure gap).

Overlay:
- **skill_agent — pass.** The only `tieBreak` writers under `.skilled/commands/create/assets/` are the two step_4 activities, both updated; the other two mentions (auto:250, confirm:283) are descriptive `quality_standards` text, not writers. Both twins parse as YAML (commit verification) and the three changed line groups are byte-identical between them.
- **agent_cross_runtime — pass.** `.hermes/skills/sk-create-skill/SKILL.md:5` carries 1.5.4.0; its diff against canonical is limited to the generated header block and one rewritten relative link. Only `SKILL.md` lives in the Hermes copy, so no stale mirrored references were possible.
- **feature_catalog_code — not applicable.** No `tieBreak`, surface-placement, or version references in `.skilled/commands/create/feature-catalog.md`.
- **playbook_capability — not applicable.** No matching rows in `.skilled/commands/create/manual-testing-playbook.md` or `agent.md`.

Additional integrity spot-checks (all pass):
- Shared phrase grep: `rg -ln "ahead of the existing surface"` returns exactly the four changed sites plus the changelog and the spec/research docs — one grep finds every site, as R1 requires.
- Release surface: SKILL.md 1.5.4.0 ↔ changelog/v1.5.4.0.md ↔ Hermes copy 1.5.4.0; no current-version reference left stale (1.5.3.0 survives only in its own historical changelog; README.md:7 `1.2.0.21` is that child doc's independent version, unchanged since the 2025 rename commits, not a reference to the schema doc).
- Activation manifests: the commit updates both `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its `specs/sk-doc/z_archive/...` authored twin to the same new `effectivePolicyHash`, consistent with the `gate:route-remint` copy direction in the follow-up line.
- Follow-ups executable: `install-git-hooks.sh` exists and its header lists the compiled-routing re-mint gate; `compiled-route-manifest.cjs` supports `refresh` (usage line 29); the canary first-leg path resolves to a real file and its authored twin is byte-identical.

## SCOPE VIOLATIONS

None. No source or documentation file outside the run directory was modified; the reviewed target stayed read-only and the only writes are this narrative, the iteration delta, the strategy update, and the append-gateway record into the run directory.

## Verdict

No P0 and no P1 findings; one P2 advisory (R1-P2-001). Mapping rule applied: PASS when no P0/P1 exist this iteration; P2-only findings do not lower the verdict.

Review verdict: PASS
