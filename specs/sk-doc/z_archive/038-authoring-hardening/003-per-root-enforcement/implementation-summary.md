---
title: "Implementation Summary: Per-Root Enforcement"
description: "Playbook enforcement is now fail-closed per root and asserts its own coverage; the first gate written for this phase was itself false-green and was rejected by the control before it shipped."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "per root enforcement implementation"
  - "false green gate caught by control"
importance_tier: "high"
contextType: "implementation"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/003-per-root-enforcement"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the fail-closed gate; recorded the false-green first version it replaced"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".github/workflows/playbook-operator-contract.yml"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
    session_dedup:
      fingerprint: "sha256:85ff554fa62fe808a04ac50a2d38b97b0458afa15fd5f58f1b217c1db1ca6896"
      session_id: "2026-08-29-sk-code-032-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Per-Root Enforcement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-per-root-enforcement |
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — enforcement is fail-closed per root and proven red on a planted failure, after the first attempt at it was rejected for being false-green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Enforcement that reports its own coverage instead of assuming it, together with the record of the version that did not.

1. **The first gate written for this phase was false-green and was rejected.** It relied on the fleet run as it stood before discovery was fixed, which meant it would have reported success for precisely the packages it could not open — the failure it was written to prevent, reproduced by the fix for it. It was caught by the same injected-regression control used to prove the original defect, before it shipped, and rewritten. This is recorded first because it is the transferable part: the design argument for the first version was perfectly reasonable, and the control disagreed with it. Nothing about reading the workflow would have exposed the problem; only planting a failure did.

2. **Discovery now enumerates every root.** A hub keeps `<skill>/manual-testing-playbook` while a packet keeps `<skill>/<packet>/manual-testing-playbook` beside it — a sibling, not a child. `discoverPackages()` enumerated only the first level, so packet-owned roots were never opened by a fleet run, and the only identity such a run produced for that skill was the hub's warn-listed one. It now descends one level further and emits each packet root under its own nested id, which `packageId()` at line 508 derives from the path below the skills root. A fleet run reports 41 packages scanned, matching the 41 roots `find` counts on disk.

3. **The measurably clean packages were graduated out of warn tier.** `playbook-corpus-manifest.json` `warnPackages` lost 9 entries and retains one, `system-spec-kit`. A warn-tier package reports its violations and ships anyway, so leaving a clean package on that list would have left its future regressions non-blocking. Graduation is what turns a completed cleanup into a standing guarantee.

4. **The fail-closed set is a file that carries its own rule.** `playbook-failclosed-allowlist.txt` lists 39 roots and opens with the parent-identity roll-up explanation and the rule that governs it: never remove a line to make a red build green, fix the package instead. The rule lives in the header because that is where someone about to delete a line will actually encounter it.

5. **The gate enforces and then checks that it enforced anything.** `.github/workflows/playbook-operator-contract.yml` runs the validator in a first step that fails the build on any fail-closed violation, and in a second step re-reads that same run's discovered set and fails, naming the root, if any allowlisted root is missing from it. The second step exists because a root that has been renamed or moved out of scan range cannot fail, and a gate that cannot fail is indistinguishable from a gate that passed.

6. **The discipline was written into the governing SKILL.md, not only into this packet.** `sk-create-manual-testing-playbook/SKILL.md` now states that a root which is not scanned cannot fail so absence looks exactly like success, tells the reader to re-check the scanned count against a direct filesystem count if discovery is ever changed, and defines the promotion step from `warnPackages` to the fail-closed allowlist.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect was established by measurement before anything was changed. A real `FORBIDDEN_VERDICT` was planted in a fail-closed sub-package and the validator was run two ways: a fleet run exited 0, and `--package <that root> --strict` exited 1. One violation, one codebase, two verdicts, decided entirely by how the run was scoped. That is a stronger statement than any reading of the source, and it is what made the next step obvious — a fleet run's success claim carried no information about a nested package, so a sub-package could sit at hundreds of violations behind a green build, and had been.

The same control then went on to reject this phase's own first attempt at a fix. The initial workflow was built around the fleet run, and against the planted regression it behaved exactly as the defect had: green. Had it been shipped on the strength of its design, the corpus would have acquired a gate whose green result meant nothing for most of it, and the packet would have closed believing the opposite. The workflow was rewritten only after the underlying discovery gap was closed, so that a fleet run genuinely opens every root, and a second step was added to assert that it continues to.

Verification followed the same rule throughout: never accept green as evidence. The gate was run at baseline, then against a planted regression it had to catch and name, then again after the plant was reverted — the middle result being the only one that carries information about whether the gate works. Discovery was checked against a filesystem count the validator did not produce, so the validator was not asked to grade its own coverage. What remains is measured rather than estimated: the fleet run reports 165 violations, all inside the single package still declared at warn tier, with a passing exit code because no fail-closed root carries one.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the rejected first gate in the packet rather than only the shipped one | The near-miss is the lesson. A reader who sees only the working gate learns that careful design produces trustworthy enforcement, which is the opposite of what happened here: careful design produced a false-green gate and only a planted failure exposed it. |
| Prove the defect by injection before changing any code | A roll-up defect argued from source reads as a theory. The same defect shown as exit 0 under one scope and exit 1 under another is a fact, and it also supplied the control that later rejected the first fix. |
| Fix discovery rather than work around it per invocation | Enumerating roots correctly makes every future fleet run mean what it says. Scoping each invocation individually would have left the underlying claim — that a fleet run covers the corpus — still false for anyone who did not know to avoid it. |
| Add a step that asserts continued discovery | Once enforcement depends on a root being found, a rename silently ends that root's enforcement while the build stays green. Checking the allowlist against the run's own discovered set converts that silence into a named failure. |
| Put the governing rule in the allowlist header | A rule stored in a packet record is read by nobody at the moment it matters. Someone deleting a line to turn a build green is looking at the file, so the rule against doing that belongs in the file. |
| Graduate clean packages out of `warnPackages` in the same change | A warn-listed package reports violations and ships anyway. Leaving a cleaned package on that list would preserve the exact condition that let the backlog grow, while looking like progress. |
| Leave the one still-dirty package at warn tier and say so | Its 165 violations are real and remediating them is separate work. Promoting it early would turn the gate red for everyone and invite the one response the allowlist header forbids. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Roll-up defect proven by injection | PASS — planted `FORBIDDEN_VERDICT` in a fail-closed sub-package: exit 0 under a fleet run, exit 1 under `--package <that root> --strict` |
| First gate version tested before shipping | REJECTED — it relied on the pre-fix fleet run and stayed green against the planted regression; caught by control and rewritten |
| Discovery covers every root | PASS — a fleet run reports 41 packages scanned, matching `find .opencode/skills -type d -name manual-testing-playbook \| wc -l` at 41 |
| Gate green at baseline | PASS — `node validate-playbook-package.cjs --strict` exits 0 with no fail-closed violation |
| Gate red on a planted regression | PASS — the injected-regression run blocks and names the offending package rather than reporting a fleet-level summary |
| Gate green again after revert | PASS — the same command exits 0 once the plant is removed, so the red result tracked the injection |
| Warn tier reduced to genuinely dirty packages | PASS — `warnPackages` lost 9 entries and retains only `system-spec-kit` |
| Remaining backlog measured, not estimated | PASS — the fleet run reports `warnedViolationCount` of 165, all inside `system-spec-kit`, with `exitCode` 0 |
| Fail-closed set carries its own rule | PASS — `playbook-failclosed-allowlist.txt` lists 39 roots and states the rule in its header |
| Discipline recorded in the governing skill | PASS — `sk-create-manual-testing-playbook/SKILL.md` carries the unscanned-root warning and the promotion step |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One package still carries a backlog.** `system-spec-kit` remains at warn tier with 165 violations. That is deliberate and declared rather than hidden, but the corpus is not clean, and the gate only guarantees that the 39 allowlisted roots stay clean.
2. **The fail-closed set is enumerated, so a new root is not enforced until it is listed.** A newly created playbook root is scanned but is neither fail-closed nor asserted for discovery until someone adds its line. The discovery assertion protects listed roots from silently leaving; it does not draft new ones in.
3. **The gate has been exercised locally, not yet observed on a real pull request.** The controls run the same validator the workflow runs, so the enforcement behavior is proven, but the workflow's own execution in CI is not something this phase can claim to have watched.
4. **The gate artifacts were uncommitted at the time this summary was written.** Committing them is a separate action outside this phase's documentation scope.
<!-- /ANCHOR:limitations -->
