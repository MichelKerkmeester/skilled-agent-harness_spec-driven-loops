---
title: "Implementation Summary: The Command Decision and the Frontmatter Playbook"
description: "No command ships, because the registry test says the two modes with command null are the two that operate on documents that already exist. The 11-scenario playbook then hit a real conflict: the package validator and the benchmark loader read the same frontmatter block under mutually exclusive rules, and the six-key shape returns SKIP at exit 0, which a fleet sweep reads as clean."
trigger_phrases:
  - "no command ships decision"
  - "playbook validator loader conflict"
  - "skip at exit zero hazard"
  - "expected workflow mode omitted"
  - "frontmatter tooling defects"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/005-command-and-playbook"
    last_updated_at: "2026-09-01T08:43:01Z"
    last_updated_by: "implementation"
    recent_action: "Shipped the 11-scenario playbook and settled the command question at no command"
    next_safe_action: "Proceed to phase 006 (verification and closeout)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-command-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-command-and-playbook |
| **Completed** | 2026-09-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mode now has a written statement of what correct behaviour looks like, at
`.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/`, and it deliberately has no
command. The finding worth carrying out of this phase is neither of those: the package validator and the
benchmark loader read the same scenario frontmatter under mutually exclusive rules, so the phase's two P0
requirements cannot both be satisfied by the shape the obvious reading suggests, and the failure mode is
silent.

### The Two Gates Disagree, and the Failure Is Silent

`hasRoutingGoldSignature()` at
`.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:120`
returns true when a scenario file carries a non-empty `expected_workflow_mode` **and** a block-form
`expected_leaf_resources` with at least one valid pair. Line 534 then filters every such file out of the
operator-scenario set, and line 581 hard-codes the package status to `SKIP` when that set is empty, so the
package can never be `PASS`.

This was measured rather than reasoned about. With all six keys present the package reported:

```
SKIP package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=0 routing_gold_excluded=11 violations=0 warnings=0
```

and exit 0. The exit code is the dangerous part. A fleet sweep that greps for `FAIL` reads a fully-excluded
package as clean, so a package nothing examined reports the same way as a package that passed.

The resolution is to omit only the `expected_workflow_mode` scalar. The loader parses
`expected_leaf_resources` independently and reads that scalar only when leaf gold is present, so every
scenario keeps its full typed leaf gold and its `expected_resources`, and all eleven stay inside the
operator contract. The workflow mode is still carried inside every typed pair and every resource prefix.

The cost was verified, not assumed: with the scalar absent, `scenario.expected` comes back undefined, which
leaves `requireRouteDeclaration` false at
`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs:145`, so a
missing route declaration is not recorded as a failure. That trade is written into a "Package shape"
section of the playbook root so nobody re-adds the key on the strength of the documentation.

### No Command Ships

spec.md asked whether the mode warrants a command "on the same test its siblings were held to", so the test
had to come from the registry rather than from intuition. Every sibling carrying a `/create:*` command
produces a new artifact: a skill, a hub, a readme, an agent, a command, a feature catalog, a playbook, a
benchmark, a changelog, a diff report, a diagram, a repo rule, a voice-rewritten document. Exactly two modes
in `.opencode/skills/sk-doc/mode-registry.json` carry `command: null`, and both are the ones that operate on
something that already exists: `sk-create-quality-control`, which validates, scores and optimizes an
existing document, and this mode, which answers a question about a contract and fixes a block inside a
document another mode owns.

`/create:frontmatter` would imply creating a frontmatter file, which is not an artifact anyone asks for. So
the mode keeps `command: null`, matching its true peer. REQ-003, "If a command ships, it carries the
workflow assets its siblings carry", is satisfied vacuously: its antecedent is false. It is recorded that
way in acceptance-criteria.md rather than as an omission.

### The Package

A root document plus 11 scenarios in 3 kebab-case categories: `field-and-class-resolution/` (FMC-001 to
FMC-003), `description-budget/` (FMB-001 to FMB-003) and `version-derivation/` (FMV-001 to FMV-005). The
package passes its own validator with every scenario inside the operator contract, the loader sees all
eleven, link integrity on the package reports `failures=0`, and enrolment in
`playbook-failclosed-allowlist.txt` is what makes that clean state enforced rather than incidental.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md` | Created | The playbook root: the scenario index the loader parses, and the "Package shape" section that explains the omitted key |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/field-and-class-resolution/` | Created | FMC-001 to FMC-003: the reference block, class-row-before-field-row diagnosis, and an out-of-scope class |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/description-budget/` | Created | FMB-001 to FMB-003: an over-budget trim, a trim that loses routing tokens, and a silent discovery drop |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/` | Created | FMV-001 to FMV-005: the numstat gate, changelog-anchored derivation, skip-on-differ, an idempotent rerun, and a file with no frontmatter |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modified | One line enrolling the package, so its clean state is enforced by the fleet sweep |

No command file and no workflow YAML was added, because no command ships. `mode-registry.json` was not
touched: `command: null` was already correct from phase 004, and this phase confirms it rather than
changing it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The command question was settled first, because it decides whether a command surface is in scope at all,
and it was settled by reading the command slot of all fifteen modes out of the registry rather than by
counting siblings. The scenarios were then authored category by category, and every scenario's command was
actually run while it was being priced. That is how the five tooling defects below were found rather than
inferred, and why two scenarios ended up on `package_skill.py --check --strict` instead of the tool the
field reference names.

The frontmatter shape was the one place where reading the documentation would have produced the wrong
answer, so both candidate shapes were run through both consumers: two shapes crossed with two consumers,
four cells, all four read. Only one combination satisfies both P0 requirements. Enrolment in the fail-closed
allowlist came last, from a package that already passed, and the fleet sweep was rerun afterwards to confirm
the enrolment did not turn anything else red.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Derive the command test from the registry, not from the sibling count | spec.md asked for "the same test its siblings were held to", and a test invented for the occasion would have answered a different question |
| No command ships; keep `command: null` | Every mode with a `/create:*` command produces a new artifact; the two with `command: null` operate on documents that already exist, which is what this mode does |
| Record REQ-003 as vacuously satisfied rather than omitted | Its antecedent is false, so nothing was skipped. Marking it an omission would misreport a settled question as an open one |
| Omit only `expected_workflow_mode`, keep the typed leaf gold | The leaf gold is the more valuable half, and dropping it to keep a scalar would trade a real check for a label |
| Write the shape decision into the playbook root | A later reader following the field documentation would otherwise re-add the key and silently return the package to `SKIP` |
| Record the tooling defects; repair none of them | Each belongs to the script that owns it. Repairing them inside a playbook-authoring phase would put unreviewed changes to shared scripts in this packet's diff |
| Enrol the package in the fail-closed allowlist | Without enrolment the package's clean state is incidental, and a future regression would go unnoticed rather than failing a gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs` on the package | PASS — `PASS package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0` (REQ-001, SC-001) |
| The benchmark scenario loader | PASS — `shape=sk-doc scenarios=11 warnings=[]`, with a parsed prompt, `expectedIntent`, `expectedResources` and typed leaf gold on every scenario (REQ-002, SC-002) |
| The six-key frontmatter shape, run deliberately | Confirmed the conflict — `SKIP ... operator=0 routing_gold_excluded=11 violations=0 warnings=0` at exit 0, which is the evidence that the two requirements are mutually exclusive under that shape |
| Link integrity on the package | PASS — `failures=0` |
| Fail-closed fleet sweep after enrolment | PASS — 39 PASS packages, zero FAIL |
| Command surface | Not applicable by decision — no command ships, so REQ-003 is vacuous (plan.md ADR-001) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A missing route declaration is no longer recorded as a failure for these scenarios.** With
   `expected_workflow_mode` absent, `scenario.expected` is undefined and `requireRouteDeclaration` stays
   false at `codex-executor.cjs:145`. This is the accepted cost of satisfying both consumers, and it is
   documented inside the package rather than only here.
2. **`--skill` on `frontmatter-version.mjs` and `check-frontmatter-versions.sh` matches only top-level
   skill directory names.** `--skill sk-create-frontmatter` silently discovers zero files and exits 0.
   Every scenario uses `--skill sk-doc` for that reason. Found, not fixed.
3. **`frontmatter-version.mjs compute` writes into the repository root when `--manifest-out` is omitted.**
   It drops `frontmatter-version-manifest.csv` and `.json` there. One scenario passes the flag explicitly
   and the playbook documents the hazard. Found, not fixed.
4. **`frontmatter-version.mjs --help` hangs.** Its argument parser only scans flags from index 1, so
   `--help` in position 0 is treated as the mode. Found, not fixed.
5. **`quick_validate.py` reads only a packet's `SKILL.md`.** It cannot prove an authored reference or asset
   block, so two scenarios were repriced onto `package_skill.py --check --strict`, which walks
   `references/` and `assets/`. Found, not fixed.
6. **`check-skill-doc-frontmatter.mjs` never descends into mode packets.** It walks
   `<skillsRoot>/<skill>/references` and `/assets` one level deep, so `--coverage --skill sk-doc` reports
   `docs=0`. The field-reference asset names it as the verifier for the five-field block, which holds for
   flat skills only. No packet document in the repository is covered by it. Found, not fixed.
7. **A label divergence between the standard and the engine.** The versioning standard writes the skip
   label as `skipped:no-frontmatter`; the engine emits `skip-no-frontmatter`. Harmless until something
   greps for the documented spelling. Found, not fixed.
<!-- /ANCHOR:limitations -->

---
