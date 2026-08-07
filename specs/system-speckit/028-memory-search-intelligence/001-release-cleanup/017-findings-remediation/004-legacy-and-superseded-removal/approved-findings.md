# Approved finding set

4 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-01:F2` | CAT-2 | `grep -n "Legacy synthetic fixtures" .opencode/skills/sk-code/benchmark/README.md` | README lines 81 and 107 explicitly state "Legacy synthetic fixtures, superseded by the playbook corpus" with status `legacy`. |
| `devin-01:F3` | CAT-2 | `head -8 .opencode/skills/sk-code/changelog/v4.0.0.0.md` | v4.0.0.0 says "converted from a flat two-axis skill into a nested parent hub"; the 8 v3.x entries describe that superseded flat structure. |
| `devin-01:F4` | CAT-2 | `cat .opencode/skills/sk-code/changelog/v4.0.0.0.md` | v4.0.0.0.md self-declares "Scaffold phase - packets are skeletons; content relocation follows"; v4.1.0.0 performed the restructure. |
| `devin-05:F2` | CAT-2 | `grep -rl "fixtures/sk-code\` | sk-code-loadspeed-001\ |
