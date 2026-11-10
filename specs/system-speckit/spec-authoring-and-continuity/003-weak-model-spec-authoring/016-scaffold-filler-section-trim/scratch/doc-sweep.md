# Doc sweep: removed plan sections, optional Fix Completeness, one-row sign-off

Run from `.skilled/skills/system-spec-kit` on 2026-10-26.

## Command

```bash
rg -n -i 'effort estimat|enhanced.rollback|EFFORT ESTIMATION|ANCHOR:effort|`effort`|fix.completeness|sign.off|Technical Lead|Product Owner|QA Lead|three (named )?roles|approver' references assets SKILL.md README.md
```

A wider pass for `pre-deployment|feature flag|story points|hours per phase|estimat` found no further template-section text (only LOC estimates, runtime feature flags and token estimates).

## Hits before the edits, and what changed

| Hit | Verdict | Action |
|-----|---------|--------|
| `references/validation/template-compliance-contract.md:141` L2 plan addenda list `effort`, `enhanced-rollback` | stale | Now lists `phase-deps` only, says deployment detail goes in `rollback`, and that older packets keeping the two sections still pass |
| `references/validation/template-compliance-contract.md:162` `fix-completeness` as a required row | stale | Row removed; a line below the table names it an optional `FIX ADDENDUM: FIX COMPLETENESS` at every level |
| `assets/complexity-decision-matrix.md:122` "Effort estimation" feature row | stale | Row removed |
| `references/templates/level-selection-guide.md:106` "Effort estimation framework" | stale | Line removed |
| `references/templates/level-specifications.md:68` L2 adds "effort estimation" | stale | Now "phase dependencies" |
| `references/templates/level-specifications.md:401` Effort Estimation feature row | stale | Row removed |
| `references/templates/level-specifications.md:403` sign-off with Technical Lead, Product Owner, QA Lead | stale | Now one approver row filled with the real approver |
| `references/templates/level-specifications.md:448` "Effort estimation per phase" | stale | Line removed |
| `references/templates/level-specifications.md:459` sign-off with three named roles | stale | Now one approver row |
| `references/templates/level-specifications.md:505` "Add effort estimates per phase" | stale | Step removed, later steps renumbered |
| `references/templates/level-selection-guide.md:108` "Sign-off requirements" | still true | Unchanged: the sign-off section stays at Level 3 and 3+ |
| `references/templates/template-guide.md:242` tasks.md keeps its sign-off section | still true | Unchanged |
| `assets/level-decision-matrix.md:264` "Sign-off section in spec.md" | wrong file | Corrected after the first review: now "Approval workflow in spec.md, sign-off section in tasks.md" |
| `assets/template-mapping.md:400` "sign-offs and compliance render inside spec.md" | wrong file | Corrected after the first review: now "the approval workflow renders in spec.md and the sign-off section in tasks.md" |
| `references/templates/level-specifications.md:387` acceptance-criteria.md "with a sign-off section" | wrong file | Corrected after the first review: now "the closure-gate criteria; the sign-off section lives in tasks.md" |

`SKILL.md` and `README.md` had no hit.

## Outside the swept folders

- `runtime/cli/spec/create.sh:311` and `:2235`, `runtime/cli/spec/upgrade-level.sh:280`: the help text said Level 2 adds "effort estimation"; now "phase dependencies".
- `templates/README.md:25` says the core templates and the acceptance-criteria add-on are stamped v2.3. It sits under live `templates/`, which this lane does not edit; the conductor changes it to v2.4 at copy-back.

## After

The same command prints only the edited lines, the three true sign-off lines and the three wrong-file sign-off lines listed above. `rg -n 'enhanced-rollback' references/validation/template-compliance-contract.md` prints nothing.
