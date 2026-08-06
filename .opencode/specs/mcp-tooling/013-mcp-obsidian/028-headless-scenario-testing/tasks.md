# Tasks — mcp-obsidian headless scenario testing

- [x] T1: Investigate why OBS-013 was SKIP — staging needed network or a non-existent captured fixture. — `brat-headless-install.md`
- [x] T2: Author `release.example.json` (tag + asset list, GitHub release shape). — `assets/plugins/obsidian42-brat/`
- [x] T3: Author the inert `sample-beta-plugin/{main.js,manifest.json}` (valid, parseable, safe folder id).
- [x] T4: Add a "Fixture mode (no network)" stage variant + update OVERVIEW/orchestration/source anchors in the OBS-013 tie-in.
- [x] T5: Update the playbook OBS-013 prereq line to make the offline fixture the default staging path.
- [x] T6: Relocate + generalize the harness to `scripts/run-scenarios.sh` (self-locating, workdir arg, RESULT summary); document it in `scripts/README.md`.
- [x] T7: Prove OBS-013 runs offline — deterministic bash+jq against a throwaway vault; stage/register/activate all verify.
- [x] T8: Bump SKILL.md 0.15.0.0 → 0.16.0.0, author changelog, regenerate + `--check` leaf-manifest.
- [x] T9: Validate all docs/JSON/JS/bash, scope + dangling-link sweep, commit skill work + this record to v4.
- [ ] T10 (separate, on-disk, not this packet): real-vault Iconic file/folder/tag parity + `.bak-ribbon-menu` cleanup.
