---
title: "Implementation Summary: Phase 9: incumbent-inventory-parity"
description: "The three incumbent mcp-tooling packets now expose the same inventory surface: chrome-devtools gained a 30-file feature catalog, a byte-true Code Mode manuals snapshot, and mcp-servers pointers; click-up gained its top-level install front door; figma gained worked example walkthroughs. All derived from existing packet docs, all gates green."
trigger_phrases:
  - "incumbent inventory parity summary"
  - "implementation summary"
  - "mcp tooling parity shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/009-incumbent-inventory-parity"
    last_updated_at: "2026-07-16T13:17:05Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase complete; gates green"
    next_safe_action: "None; successor phase is 010-routing-corpus-and-holdouts"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature_catalog/feature_catalog.md"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp_chrome_devtools_manuals.md"
      - ".opencode/skills/mcp-tooling/mcp-click-up/INSTALL_GUIDE.md"
      - ".opencode/skills/mcp-tooling/mcp-figma/examples/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-009-incumbent-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 9: incumbent-inventory-parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-incumbent-inventory-parity |
| **Completed** | 2026-07-16 |
| **Level** | 2 |
| **Status** | Complete |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The three incumbent mcp-tooling modes now expose the same inventory surface, closing the parity gaps left after onboarding (phase 004) and fold-in (phase 005). Every capability claim in the new files traces to each packet's own SKILL.md, references, playbook, examples, or the live `.utcp_config.json`; no new tool facts were invented.

### mcp-chrome-devtools inventory (the largest gap)

You can now browse the packet's entire capability surface from `feature_catalog/feature_catalog.md`: 29 per-feature files across 7 snake_case domains (cli_bdg_lifecycle, protocol_discovery, dom_and_screenshot, console_and_network, mcp_parallel_instances, automation_and_performance, recovery_and_troubleshooting), mirroring the mcp-click-up catalog's structure and frontmatter while taking its taxonomy from the packet's own manual-testing-playbook categories. `assets/utcp_chrome_devtools_manuals.md` snapshots BOTH `chrome_devtools_1` and `chrome_devtools_2` entries byte-true from `.utcp_config.json` (generated and verified programmatically with `jq`), carries the dual-manual-for-parallelism rationale from SKILL.md §3 and cdp_patterns §8, and is provenance-marked verify-not-re-add. `mcp-servers/bdg-cli/README.md` and `mcp-servers/chrome-devtools-mcp/README.md` add the sibling-standard pointer folders with nothing vendored.

### mcp-click-up install front door

`INSTALL_GUIDE.md` now sits at the packet root like its siblings: AI-first install block, component overview, prerequisites, cupt install, authentication, optional Code Mode MCP configuration, verification, troubleshooting, and resources, all promoted from `references/install_guide.md`. The reference keeps its full content (it stays the smart router's INSTALL-intent target) and ends with a short pointer note to the front door.

### mcp-figma worked examples

`examples/` gives operators runnable walkthroughs mirroring the playbook scenarios: `safe-connect-daemon-health.sh` (DETECT-001, CONNECT-001, DAEMON-001), `inspect-export-readonly.sh` (INSPECT-001, EXPORT-001 with the explicit-path, no-overwrite rule), and `optional-mcp-context.md` (MCP-001 discovery-first Code Mode pull). All gated and destructive operations are marked gated exactly as the packet's docs define, and none run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-chrome-devtools/feature_catalog/**` (30 files) | Created | Root catalog + 29 leaves across 7 domains |
| `mcp-chrome-devtools/assets/utcp_chrome_devtools_manuals.md` | Created | Byte-true dual-manual snapshot |
| `mcp-chrome-devtools/mcp-servers/{bdg-cli,chrome-devtools-mcp}/README.md` | Created | Install and registration pointers |
| `mcp-chrome-devtools/SKILL.md` | Modified | Version 1.0.10.0; §8 links new surfaces |
| `mcp-chrome-devtools/changelog/v1.0.10.0.md` | Created | Release notes |
| `mcp-click-up/INSTALL_GUIDE.md` | Created | Front-door install doc |
| `mcp-click-up/references/install_guide.md` | Modified | Trailing pointer note appended only |
| `mcp-click-up/SKILL.md` | Modified | Version 1.0.1.0; §8 front-door link |
| `mcp-click-up/changelog/v1.0.1.0.md` | Created | Release notes |
| `mcp-figma/examples/**` (4 files) | Created | README + 2 scripts + MCP walkthrough |
| `mcp-figma/SKILL.md` | Modified | Version 1.0.1.0; §8 examples link |
| `mcp-figma/changelog/v1.0.1.0.md` | Created | Release notes |
| `specs/.../009-incumbent-inventory-parity/*` | Created/Modified | Level 2 spec docs + this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Read-first, derive-only, then gate. The full doc surface of all three packets plus the live `.utcp_config.json` was read before any file was authored, and each new element copied the proven shape of the sibling packet that already had it. The snapshot asset was generated by piping `jq` output directly into the file (not hand-copied) and then re-verified with an independent byte comparison. All gates ran after authoring: `package_skill.py --check --strict` on all three packets, `bash -n` on both new scripts, a relative-link walk over every touched file, and spec-child validation after regenerating `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| **Click-up link direction: reference stays full, front door added on top** | Grep showed 11 inbound sites (SKILL.md router `RESOURCE_MAP.INSTALL` plus §2/§8, README.md x2, examples/README.md, both mcp-servers READMEs, scripts/doctor.sh, references/mcp_tools.md, and the /doctor asset yaml outside this phase's write authority). Hollowing `references/install_guide.md` into a pointer stub would have degraded the smart router's INSTALL-intent load and falsified the "step-by-step install with validation checkpoints" descriptions at every inbound site. So the reference keeps ALL its content plus a trailing pointer note, and the new top-level `INSTALL_GUIDE.md` is the promoted front door that defers the phase-validation ladder back to the reference. Zero inbound links break, zero contracts change. |
| Chrome catalog root named `feature_catalog.md` (lowercase) | Matches the task contract and the mcp-figma sibling; click-up's `FEATURE_CATALOG.md` casing is the outlier |
| Chrome catalog domains taken from the playbook taxonomy, with examples/ and troubleshooting folded into two extra domains | The playbook's 6 categories are the packet's own capability language; automation_and_performance (from examples/) and recovery_and_troubleshooting (playbook + troubleshooting reference) complete coverage without inventing taxonomy |
| Snapshot records the live pin `chrome-devtools-mcp@0.26.0` and flags the INSTALL_GUIDE `@latest` divergence | Byte-true means byte-true; the asset states explicitly that the live config wins over doc snippets |
| Figma MCP walkthrough is a doc, not a shell script | The flow runs inside Code Mode's `call_tool_chain()`, not bash; a .sh would fake executability |
| Catalog leaf `SOURCE FILES` tables cite packet doc surfaces instead of external source code | The implementation is third-party (bdg, chrome-devtools-mcp); the honest trace for a derived catalog is the packet doc that documents each claim |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `package_skill.py .opencode/skills/mcp-tooling/mcp-chrome-devtools --check --strict` | PASS, 0 warnings |
| `package_skill.py .opencode/skills/mcp-tooling/mcp-click-up --check --strict` | PASS, 1 pre-existing warning (SKILL.md 3129 words vs 3000 recommendation; baseline was 3110) |
| `package_skill.py .opencode/skills/mcp-tooling/mcp-figma --check --strict` | PASS, 1 pre-existing warning (SKILL.md 3324 words; baseline was 3285) |
| `bash -n` on `safe-connect-daemon-health.sh` + `inspect-export-readonly.sh` | PASS, both parse |
| Snapshot byte-parity vs `jq` extraction from `.utcp_config.json` | PASS, `BYTE-TRUE VERIFIED` for both `chrome_devtools_1` and `chrome_devtools_2` blocks |
| Relative-link check over touched/created files | PASS, 0 broken of 151 links in 43 files |
| `generate-description.js <child> .` + `backfill-graph-metadata.js <child>` | PASS, description.json and graph-metadata.json regenerated |
| `validate.sh <child> --strict --no-recursive` | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **The snapshot is point-in-time.** `assets/utcp_chrome_devtools_manuals.md` reflects `.utcp_config.json` as of 2026-07-16 (pin `chrome-devtools-mcp@0.26.0`). If the registration changes, re-extract with the embedded `jq` command and update the snapshot; the live config always wins.
2. **The /doctor asset manifest still points click-up at the reference path.** `doctor_mcp_install.yaml:229` maps click-up's install guide to `references/install_guide.md` while the other packets map to top-level guides. That path keeps working by design, and updating the yaml is outside this phase's write authority; a follow-up in the doctor surface could repoint it to `INSTALL_GUIDE.md`.
3. **Front door and reference share install content.** The click-up front door condenses rather than includes the reference, but the two files can still drift; the pointer notes in both directions are the drift guard.
4. **Figma example flags are illustrative by policy.** Per the packet's own playbook execution policy, exact `figma-ds-cli` flags must be verified against the live `--help` before grading a run; the scripts restate this instead of hard-guaranteeing flag stability.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
