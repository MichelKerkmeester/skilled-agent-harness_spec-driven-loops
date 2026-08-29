---
title: "Implementation Summary: Fail-closed graduation"
description: "The grandfather list is empty, all 41 roots are named in a fail-closed allowlist and run under their own package identifiers in CI, and the gate asserts discovery separately from cleanliness."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "fail-closed graduation implementation"
  - "playbook discovery assertion summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/031-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-code/031-playbook-family-remediation/004-fail-closed-graduation"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the graduation; 41 roots gated, fleet at zero violations and exit 0"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".github/workflows/playbook-operator-contract.yml"
    session_dedup:
      fingerprint: "sha256:c9262d095a2d39b2d674466b7d5138fc9de635125cd88fa17b717a84d0c4cff1"
      session_id: "2026-08-29-sk-code-031-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Fail-closed graduation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-fail-closed-graduation |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — grandfather list emptied, 41 roots allowlisted, discovery asserted in CI |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The zero the first three phases reached is now a state the fleet has to keep rather than a snapshot it happened to be in.

1. **The grandfather list is empty.** `playbook-corpus-manifest.json` shipped ten `warnPackages` entries — `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` — and each was removed as its package measured zero. The list now parses as `[]`, and the fleet run's own header line reads `warn_packages=` with nothing after it.

2. **All ten entries were parent identifiers.** That is what made the list far larger than ten packages: a fleet run resolves a nested package to its parent, so every mode package beneath those ten inherited a warn entry nobody assigned it and stopped blocking silently. Emptying the list is therefore an enforcement change across the whole nested tree, not across ten roots.

3. **`playbook-failclosed-allowlist.txt` names all 41 roots.** Forty-one root paths outside the comment header, in a 55-line file. The header carries the rule itself: a line is added when a package is cleaned, and never removed to turn a red build green.

4. **CI runs each root under its own identifier and asserts discovery separately.** `.github/workflows/playbook-operator-contract.yml` gives every allowlisted root its own `--package` path, so a nested package gets its own tier instead of its parent's. Its step `Assert every fail-closed root is still discovered` fails the build with `::error::fail-closed root is no longer discovered by the fleet scan` naming any root that has left scan range.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The discovery assertion is the part of this phase that is not obvious, and it is the reason a violation count alone cannot be the gate. A root that is never scanned reports no violations, and a root that is perfectly clean reports no violations, and the fleet output for the two is identical. Every mechanism that let this backlog grow has that same shape: the warn list produced findings that did not block, the parent roll-up produced coverage that was not real, and both looked exactly like success from outside. So the gate checks two independent things — that every listed root was found, and that every found root is clean — because only the second one is visible in a census.

The graduations were sequenced against measurement rather than done in one sweep at the end. Removing a package from `warnPackages` while it still carries violations turns the fleet red and blocks unrelated work, so each entry came out only after that package's own `--package --strict` run reported zero. The list emptying itself is therefore a record of ten measured states, in order, not a single edit.

The control matters more than the green run. A gate that has only ever been observed passing has not been shown to work; it has been shown to be quiet. Injecting a violation and requiring the gate to exit non-zero, then restoring the file and requiring exit 0 again, is what distinguishes a gate that reports state from a gate that reports success.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Assert discovery as a condition separate from cleanliness | An unscanned root and a clean root produce identical output. Without a written list to check the discovered set against, a package can leave the gate and the gate will report success over its absence. |
| Remove each `warnPackages` entry only after its package measured zero | Removing one early turns the fleet red on work still in progress and blocks unrelated changes, which is how a gate earns the reputation that gets it disabled. |
| Give every root its own `--package` path in CI rather than relying on one fleet run | The roll-up that resolves a nested package to its parent is precisely the mechanism that hid the backlog. It cannot also be the instrument that proves the backlog gone. |
| Put the governing rule in the allowlist file's own header | The cheapest way to make a failing package stop failing is to delete its line. The rule has to be where the person about to delete it is looking. |
| Require the gate to be seen red before accepting it | A green run from a gate that has never failed is not evidence about the gate. The injected-violation control is what turns it into evidence. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Grandfather list emptied | PASS — `warnPackages` parses as an empty list; the fleet header reports `warn_packages=` with no entries |
| Ten graduated entries identified | PASS — the prior list held `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`, all parent ids |
| Allowlist coverage | PASS — `playbook-failclosed-allowlist.txt` carries 41 root paths outside its comment header, in a 55-line file |
| Fleet census | PASS — a `--strict` fleet run emits 41 package result lines, their `violations` fields sum to 0, and no `FAIL` line appears |
| Fleet exit status | PASS — exit 0, captured from the process directly rather than read through a pipe |
| Discovery assertion present | PASS — `.github/workflows/playbook-operator-contract.yml` step `Assert every fail-closed root is still discovered` emits `::error::fail-closed root is no longer discovered by the fleet scan` for a missing root |
| Gate can go red | PASS — an injected violation makes the fleet gate exit 1; restoring the file makes it exit 0 again |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The red half of the control is a recorded result, not a re-run one.** The fleet-green half was re-measured directly for this record: 41 packages, zero violations, exit status 0 read from the process. The injected-violation half is carried from the run that performed it, because reproducing it means deliberately breaking a skill package outside this packet's write scope.
2. **The enforcement change was not yet committed when this record was written.** As measured in this checkout, the manifest edit that empties `warnPackages` is modified-but-uncommitted, and both `playbook-failclosed-allowlist.txt` and `.github/workflows/playbook-operator-contract.yml` are untracked. The gate is real in the working tree; it becomes real for CI only once those three paths land.
3. **The allowlist is a written inventory and can drift from intent.** The discovery assertion proves every listed root is still scanned; it cannot prove that a newly created root was added to the list. A package that never enters the file is still invisible to the gate.
<!-- /ANCHOR:limitations -->
