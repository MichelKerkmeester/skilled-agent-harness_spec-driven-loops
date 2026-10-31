---
title: "Implementation Summary"
description: "A read-only /doctor:install guide: it checks both builds, inspects a target repo once with the symlink engine and prints the ordered setup commands, so a new user never assembles the install by hand."
trigger_phrases:
  - "install guide router implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/002-install-guide-router"
    last_updated_at: "2026-10-31T15:26:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded ADR-001, the manifest-entry standard the live check is judged on"
    next_safe_action: "Run the generated-metadata refresh, then re-run strict validation"
    blockers:
      - "Strict validation reports two generated-metadata errors; repair-derived.cjs --apply clears them and this closeout does not own that rewrite"
    key_files:
      - ".skilled/commands/doctor/install.md"
      - ".skilled/commands/doctor/assets/doctor-install.yaml"
      - ".skilled/commands/doctor/assets/doctor-install-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-closeout"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Whether the live check must name a broken link outside the manifest"
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
| **Spec Folder** | 002-install-guide-router |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user who wants Skilled in their own repository now runs one command and gets the ordered steps. `/doctor:install` checks the two builds, asks once for the target and the choices, runs the symlink engine's `check` in place, then prints five writing commands with their mutation class and one line of why. It writes nothing itself.

### Phase 2: install-guide-router

The guide is three files behind one route. The router binds a single `guide` target and loads the presentation first and the workflow second. The workflow runs five steps in contract order: locate the checkout and both builds, ask one consolidated question, inspect the target once, print the checklist, print the fixed caveat. The presentation owns every visible string, including the argument failure and the result templates.

The inspect step is the only part that touches the target, and it only reads. It calls `symlink-engine.cjs check`, which reports one status line per entry and writes nothing. Everything that writes is printed for the operator to run under its own plan and its own yes. That split is the whole point of the command: the guide can be run on an unfamiliar repository without changing it.

A missing build becomes step 0 of the checklist rather than a stop, so a half-installed checkout still gets a plan. An engine refusal stops before the checklist, so no partial plan is shown.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/install.md` | Created | Read-only router: one `guide` target, `--root`, `--runtimes`, `--json`, and the `list`, `?`, `menu` shortcut |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | Created | The five steps, the two build probes, the single engine `check` call and the printed checklist |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Created | Every visible string: the argument failure, build block, prompt, status legend, ordered steps, caveat and result templates |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three files landed first and the family gates ran after them. `bash .skilled/commands/doctor/scripts/route-validate.sh` printed `OK: route-validate — 28 routes validated, 10 warnings`, and its `J1` line reports target parity across 13 commands. The validator prints `OK` only when no assertion fails, so `B3`, `E1`, `F2`, `K1/K2` and `L1` all passed in that run.

`node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` printed `STATUS=OK phrases=184 bridges=32`, and the advisor returns `command-doctor-install` for "install skilled into my project". The full suite, `bash .skilled/commands/doctor/scripts/tests/run-all.sh`, reported 7 suites passed, 0 failed, 934 node tests passing against a baseline of 925 on main; the delta is the nine new engine tests from phase 001.

The inspect step was read on a real repository rather than a fixture. Against Obsidian Plugin, `check` reported every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` as `linked-whole`, `.mcp.json` as `missing` and `REPO RULES.md` as `local`, and exited 0.

Two corrections came out of the phase review, both now in the shipped files and both recorded in `scratch/verification-evidence.md:46`. The YAML's build check used to be a trigger-index staleness probe, which says nothing about whether a build exists; it now runs `test -d .skilled/skills/system-spec-kit/runtime/dist`, which is what the presentation already promised. The presentation's `merge` and `/doctor:git setup` wording now describes what those commands actually do.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Print the writing commands instead of running them | Each of the five commands already carries its own plan, its own digest and its own yes. A guide that ran them would need a second approval layer on top of the one the operator is about to give. |
| Keep the caveat line fixed rather than work around the project-root defect | The defect belongs to the symlinked-runtime-root packet. A guide that silently compensated would hide a real save landing in the wrong repository. |
| Treat a missing build as step 0 and keep going | A new user usually installs the guide's own dependencies from it. Stopping before the checklist would leave them with nothing to run. |
| Copy each step's mutation class from the route manifest at print time | The class belongs to the owning route. A hand-written copy in the presentation would drift the first time a route is reclassified. |
| Build check by directory presence, not by staleness | The question the guide asks is whether a build exists. A staleness probe answers a different one and can be green on a checkout that never compiled. |
| Judge the live check on manifest entries, not on links outside the manifest | `check` reports the framework's manifest entries and nothing else. AC-004 had asked it to name a broken `.pi-subagents` link, which is not a framework entry and has no path in the checkout, so no run could satisfy it. ADR-001 in `decision-record.md` supersedes that row, and AC-007 states the requirement in the command's own terms. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate — 28 routes validated, 10 warnings`; `J1` parity across 13 commands, so `B3`, `E1`, `F2`, `K1/K2` and `L1` passed |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | `STATUS=OK phrases=184 bridges=32`; "install skilled into my project" returns `command-doctor-install` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 7 suites passed, 0 failed, 934 node tests passing; main's baseline is 925 passing |
| `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "…/Obsidian Plugin"` | Entry lines for every link, `.mcp.json` reported `missing`, `REPO RULES.md` reported `local`, exit 0, nothing written |
| YAML parse of `assets/doctor-install.yaml` | Exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/002-install-guide-router --strict` | `RESULT: PASSED`, 0 errors, after `repair-derived.cjs --folder specs/commands/005-doctor-symlink-install/002-install-guide-router --apply` re-derived the generated metadata |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The check reports manifest entries, not the whole repository.** A broken link outside the manifest stays unreported, and Obsidian Plugin's `.pi-subagents` link is one. ADR-001 settles the standard: the check answers whether each framework entry is what it should be, and the target repository's own links belong to whoever made them. AC-004 was `Superseded` for that reason, and AC-007 asks for what the command proves.
2. **The guide never closes the loop.** It prints the five commands and stops. Whether they were run, and whether they worked, is `/doctor:setup`'s job from inside the target repo.
3. **The caveat line now states where a save lands.** It first warned that saves from a linked repository resolved the project root through the link. Once `system-speckit/037-symlinked-runtime-root` shipped, a save resolves the project root from the working directory's git top-level, so the line now says to run saves from inside the target repo and not from the Skilled checkout. The workflow, the presentation, the contract test and the root README carry the same wording.
4. **Nothing checks the printed checklist against execution.** The steps are data the operator runs by hand, so a step that fails at run time prints the failing command's own error, not the guide's.
<!-- /ANCHOR:limitations -->

---
