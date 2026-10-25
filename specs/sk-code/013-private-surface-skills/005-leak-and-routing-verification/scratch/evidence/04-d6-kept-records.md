# 04 - D6 kept records

Run on 2026-10-24 against the clone at `9129007915a2b6ada693440ad106fd8eefa5e589` (`CLONE=<SP>/psurf-clone-main`, `SP` as in `03-fresh-clone-leak.md`).

## A - Audit of the ten D6 prefixes

```bash
git -C "$CLONE" diff --stat 42b41dd286 HEAD -- .skilled/skills/mcp-tooling .skilled/skills/sk-design .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample .skilled/changelog | wc -l
git -C "$CLONE" diff --stat 42b41dd286 HEAD -- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md | wc -l
```

Output:

```text
       2
       2
```

The audit output itself (the same command without `| wc -l`):

```text
 .../skills/system-skill-advisor/runtime/scripts/skill_advisor.py    | 6 ++++--
 1 file changed, 4 insertions(+), 2 deletions(-)
```

Expected: 0 from the audit and at least 1 from the control path

Result: the control held (2, at least 1). Against the original expectation of 0 the audit did NOT hold, and the operator ruling of 2026-10-24 accepts `skill_advisor.py` as the one permitted change, so against the amended expectation it holds. Detail of the original finding: it printed 2 lines (one path plus the summary line), not 0. The changed path is `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, changed by one commit in the range:

```text
e00fef3e76 refactor(system-skill-advisor): bound private-skill scans and drop surface terms
```

The diff swaps two `if not entry.is_dir(): continue` guards for `if not _runtime_module.is_scannable_skill_entry(entry, link_check): continue`, each preceded by `link_check = _runtime_module.create_private_skill_link_check(SKILLS_DIR)`, in `_load_source_graph_signal_map` and `_load_source_conflict_declarations`. The change adds symlink-aware private-skill scanning. It touches no Webflow or Obsidian record, but it is a change to a D6 kept path made after the removal commit. The other nine prefixes show no difference. This phase does not repair a D6 record.

Not audited: the dated records outside the ten prefixes, namely each surface `changelog/`, `benchmark/reports/` and `specs/**/z_archive/`. This file makes no claim that they are unchanged since `42b41dd286`.

<!-- evidence:end -->
