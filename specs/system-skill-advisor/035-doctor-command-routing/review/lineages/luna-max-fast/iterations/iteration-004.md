# Iteration 4 — Cross-repository indexes and references

## Review summary

Checked the root README's command-library and doctor sections, `.skilled/commands/README.txt`, the system-spec-kit doctor feature-catalog entry and the system-spec-kit skill. The three command inventories consistently include `/doctor:setup`; the feature-catalog playbook reference exists. The system-spec-kit skill does not contain a doctor-command inventory to update.

The read-only claim from P2-005 is repeated across the root README, command index and system-spec-kit category overview. The advisor leg's `--warm-only` cold-start behavior remains the same underlying issue, so this is corroborating evidence rather than a duplicate finding. The command-catalog validator confirms 39 canonical commands and 39/39 entries in `.skilled/commands/README.txt`, while the root README still reports 37.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **P2-007 — Root README understates the command catalog by two entries**
   - Location: `README.md:1074` (the same total is repeated at `:80`).
   - Finding class: `command-catalog-count-drift`.
   - Scope proof: The README says there are 37 entry points, with 34 across six groups and 3 root utilities. The command catalog counts 13 + 3 + 10 + 3 + 1 + 6 grouped commands, plus 3 root commands, and its read-only check reports `canonical: .skilled/commands frontmatter (39 commands)` and `commands/README.txt 39/39 listed`.
   - Case: A reader using the root README to size or audit the command surface gets 37, while the canonical command index exposes 39. The README's own group breakdown is also two short of the indexed group counts.
   - Recommendation: Update both root README totals and the group breakdown to match the 39 canonical entries, or state a different counting rule and show the excluded entries.

## Existing finding corroborated

P2-005 is also visible in cross-repository documentation: `README.md:1235` says `/doctor:setup` “writes nothing”; `.skilled/commands/README.txt:162` describes the setup checks as read-only; and the system-spec-kit category overview calls the setup route read-only at `category-overview.md:17,25,43`. The documented advisor check starts or attaches to the daemon when cold, and lease acquisition persists state, as established in Iteration 3. These pages repeat the same inaccurate side-effect guarantee; they do not introduce a separate failure mode.

## Validation and scope notes

- `command-catalog-mirror-check.cjs`: exit 0, canonical frontmatter count 39, all 39 listed in `.skilled/commands/README.txt`, `STATUS=OK`.
- `validate_document.py`: root README, system-spec-kit doctor category overview and system-spec-kit SKILL all valid with zero issues.
- `hvr_scan.py`: exit 0 and zero hard blockers for the root README and doctor category overview; it reported heuristic review candidates.
- The system-spec-kit category's `manual-testing-playbook/doctor-commands/README.md` reference exists. Its overview and source table include `/doctor:setup` and the five setup legs.
- No tests, builds or runtime probes were run.

## Sources

- `specs/system-skill-advisor/035-doctor-command-routing/review/lineages/luna-max-fast/steer.md`
- `README.md:80`, `:1074`, `:1231-1235`
- `.skilled/commands/README.txt:44-54`, `:156-172`
- `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`
- `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17`, `:25`, `:29`, `:39-58`
- `.skilled/skills/system-spec-kit/SKILL.md:481`
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`
- `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md:12-16`
- `.skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:28-34`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/lease.ts:156-175`, `:317-348`

Review verdict: CONDITIONAL
