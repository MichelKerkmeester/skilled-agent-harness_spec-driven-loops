---
title: "Implementation Summary"
description: "Bladebro now installs and checks itself like its sibling modes, the browser hub changelogs resolve from the global tree and say what shipped, and the Chrome DevTools playbook is fully recorded."
trigger_phrases:
  - "bladebro parity and changelogs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/007-bladebro-parity-and-changelogs"
    last_updated_at: "2026-11-22T07:02:51Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the build and its verification"
    next_safe_action: "Operator review, then commit on instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-bladebro-parity-and-changelogs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-bladebro-parity-and-changelogs |
| **Completed** | 2026-11-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Bladebro now has the same setup surface as Aside and Chrome DevTools. You can install it with one script that refuses an unverified binary, and check it with a doctor that never contacts the release registry. The browser hub's changelogs resolve from `.skilled/changelog/`, and five new entries say what shipped.

### Phase 7: bladebro-parity-and-changelogs

`scripts/install.sh` installs `bladebro@4.8.2`, checks the native binary against the recorded digest and removes the install on a mismatch. `scripts/doctor.sh` checks the version, the digest, `bladebro doctor`, a stdio MCP handshake and the registered manual, all with `BLADE_NO_UPDATE_CHECK=1`. That switch is in the binary itself. The manual JSON now lives once, in `assets/utcp-bladebro-manual.md`.

The benchmark folders now hold a verdict for every Chrome DevTools scenario and for 16 of 29 Aside scenarios. Most Chrome failures are stale scenario text: `bdg` 0.6.10 prints text unless given `--json`, and Code Mode rejects top-level `await`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-bladebro/scripts/{install.sh,doctor.sh,README.md}` | Created | Pinned install and read-only doctor |
| `mcp-bladebro/{INSTALL-GUIDE.md,assets/utcp-bladebro-manual.md}` | Created | Install walk-through and the manual snapshot |
| `mcp-bladebro/{ROUTER.md,SKILL.md,README.md,references/*}` | Modified | Wire the asset and scripts, report the live run |
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Modified | Guard row for both scripts |
| `.skilled/changelog/mcp-browser-use/*` | Created | Four changelog links |
| `.skilled/changelog/mcp-tooling/mcp-{chrome,aside}-devtools` | Deleted | Dangling links to the old paths |
| Four new `changelog/v*.md` entries, their `SKILL.md` versions and the hub JSON versions | Created, Modified | Entries for what shipped |
| `system-skill-advisor/changelog/v2.0.0.0.md` | Modified | The scorer fix, folded into the release that already contains its code |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modified | Name the two moved modes among the components with entries |
| `mcp-{chrome,aside}-devtools/benchmark/reports/2026-11-22--*` and index READMEs | Created, Modified | Five new reports |
| Hub `leaf-manifest.json` and the activation manifest pair | Modified | Regenerated and re-minted |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scripts were tested on their safe paths only: `--help`, a bad option and the already-installed no-op. No real install ran. The doctor ran live, and `pgrep` found no Bladebro process afterwards. The doctor's probe and `bladebro doctor` also ran against an empty `BLADE_HOME`, which stayed empty. Playbook scenarios ran once each on example.com, in `bdg`'s own profile and in two isolated MCP browsers. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the pin and digests in `references/install-and-verify.md` | The router's INSTALL intent already loads it, and the guide links to it instead of copying the values |
| Model the guide on Aside's, not `install-template.md` | That template covers a repository-root INSTALL.md, and Aside's guide validates as `install_guide` |
| Find the install through `npm root -g` in `install.sh` | A PATH miss after `npm install -g` must not look like a broken install and trigger a removal |
| Leave `shared/` empty | The redaction and discovery texts differ per mode, and the general discovery steps belong to `mcp-code-mode` |
| Fold the advisor scorer fix into its v2.0.0.0 entry | The operator chose it on 2026-11-22: main reached advisor 2.0.0.0 before this merge, and that release already contains the fix code |
| Reverse 004's "No `scripts/`" decision here | 004 left scripts out only for want of a manifest row, which this phase adds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `shellcheck` on both scripts | PASS, exit 0 |
| Mutation-class guard and its tests | PASS, 23 scripts, 51 of 51 tests |
| `scripts/doctor.sh` live | PASS, exit 0, five tools, no leftover process |
| Changelog coverage | PASS, 58 of 58, no dangling link |
| `check_changelog_shape.py` on the four entries, advisor v2.0.0.0 and `skilled/v4.2.0.0.md` | PASS, exit 0 |
| `parent-skill-check.cjs .skilled/skills/mcp-browser-use` | PASS, `OK`, 0 warnings |
| `compiled-route-guard.cjs` | PASS after one re-mint, `mcp-browser-use fresh` |
| `compiled-route-sync.cjs --check` | FAIL, one served file differs, `007-sk-doc/lib/registry-compiler.cjs`. The untouched primary checkout at the same commit fails identically |
| Two-stage replay, "install bladebro and run its doctor script" | PASS, `mcp-browser-use` 0.8226 then `mcp-bladebro` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The x64 digest is unconfirmed.** Only arm64 has matched an installed binary. An x64 mismatch makes `install.sh` remove the install.
2. **Thirteen Aside scenarios did not run.** They drive the signed-in Aside browser or start an agent task, so they wait for an operator yes.
3. **Bladebro still lacks `feature-catalog/`, `examples/` and `mcp-servers/`.** Aside and Chrome DevTools carry them. They were not asked for.
4. **The compiled-route sync check fails on a file this phase did not touch.** It predates this work.
<!-- /ANCHOR:limitations -->

---
