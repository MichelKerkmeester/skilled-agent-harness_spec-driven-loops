VERDICT: FIX

- [P1] `.skilled/skills/cli-orca/README.md:63` | 8 | The new fenced inventory changes the code-block count from 0 to 1 (`block_count_mismatch=1`). | Replace the fenced tree with this table. File names are relative to the path prefix.

  | Path prefix | Files | Purpose |
  |---|---|---|
  | `.` | `README.md`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json`, `leaf-aliases.json`, `leaf-manifest.config.json`, `leaf-manifest.json` | Skill entry point, instructions, router and metadata |
  | `assets/` | `PROVENANCE.md`, `computer-use.txt`, `linear-tickets.txt`, `orca-cli.txt`, `orca-emulator-android.txt`, `orca-emulator.txt`, `orca-linear.txt`, `orca-per-workspace-env.txt`, `orchestration.txt` | Snapshot provenance and upstream skill text |
  | `benchmark/reports/2026-09-20--extraction-routing-verification/` | `report.md`, `routing-replays.json` | Extraction routing evidence |
  | `benchmark/reports/2026-09-20--playbook-post-remediation/` | `playbook-verdicts.json`, `report.md` | Playbook verification evidence |
  | `changelog/` | `v0.1.0.0.md`, `v0.1.1.0.md`, `v0.1.2.0.md`, `v0.1.3.0.md`, `v0.1.4.0.md`, `v0.1.5.0.md`, `v0.1.6.0.md`, `v0.1.7.0.md` | Release history |
  | `feature-catalog/` | `feature-catalog.md` | Feature inventory |
  | `feature-catalog/orca-skills/` | `official-skill-layer.md` | Official skill boundaries |
  | `feature-catalog/routing/` | `orca-qualified-vocabulary.md` | Routing vocabulary |
  | `feature-catalog/runtime/` | `preflight-and-resolution.md` | Runtime preflight |
  | `feature-catalog/safety/` | `mutation-and-ownership-boundaries.md` | Safety and ownership boundaries |
  | `manual-testing-playbook/` | `manual-testing-playbook.md` | Test index |
  | `manual-testing-playbook/handoffs/` | `hub-deferral-receipt.md` | Handoff receipt checks |
  | `manual-testing-playbook/ownership/` | `embedded-browser-boundary.md`, `official-skill-handoff.md` | Ownership checks |
  | `manual-testing-playbook/routing/` | `negative-holdouts.md`, `orca-positive-route.md` | Routing checks |
  | `manual-testing-playbook/runtime/` | `ambiguous-send-recovery.md`, `preflight-executable-resolution.md`, `runtime-stopped-recovery.md` | Runtime checks |
  | `references/` | `mutation-and-browser-boundaries.md`, `orca-cli-reference.md`, `session-and-runtime.md`, `troubleshooting.md` | CLI operating references |
  | `references/orca-skills/` | `computer-use.md`, `linear-tickets.md`, `orca-cli.md`, `orca-emulator-android.md`, `orca-emulator.md`, `orca-linear.md`, `orca-per-workspace-env.md`, `orchestration.md`, `overview.md` | Official skill references and index |

- [P2] `.skilled/skills/cli-orca/assets/PROVENANCE.md:73` | 9 | The verification result was changed into an instruction, losing the claim that all eight shipped snapshots passed both checks. The revised overview points to this record for that evidence. | Restore the exact HEAD text: `The copies were verified, not assumed. Each \`assets/<skill>.txt\` was compared byte for byte against its snapshot source with \`cmp\`, and its sha256 was compared against the manifest's \`exactSha256\` field. Both checks pass for all eight files, so the rows in section 3 describe the files actually shipped with this skill.`