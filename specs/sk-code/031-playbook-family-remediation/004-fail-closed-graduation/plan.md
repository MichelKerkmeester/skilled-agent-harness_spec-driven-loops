---
title: "Plan: Fail-closed graduation"
description: "Graduate each cleaned package out of the grandfather list as it reaches zero, then replace the fleet roll-up with per-root CI enforcement plus an assertion that every listed root is still scanned."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "fail-closed graduation plan"
  - "per-root playbook enforcement plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code/031-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-code/031-playbook-family-remediation/004-fail-closed-graduation"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Graduated ten packages out of warn tier and wired the per-root CI gate"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".github/workflows/playbook-operator-contract.yml"
    session_dedup:
      fingerprint: "sha256:2858b298682f3980ceb5665adaf29378ffc0410cc36c23bb1988d9ae2fc2f350"
      session_id: "2026-08-29-sk-code-031-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Fail-closed graduation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`playbook-corpus-manifest.json` carries two lists that change what enforcement means. `routingGoldRoots` moves a root's scenarios out of the operator-scenario contract entirely. `warnPackages` keeps them in the contract but downgrades every violation to a non-blocking warning. The ten entries in `warnPackages` were all parent identifiers, and a fleet run resolves a nested package to its parent, so each mode package beneath them inherited a warn entry it was never assigned.

### Overview

Empty `warnPackages` one entry at a time, each removal gated on that package measuring zero, so the fleet is never left red on work that is still in progress. Then replace reliance on the fleet roll-up with `playbook-failclosed-allowlist.txt`, a file naming all 41 roots, and a CI workflow that runs each of them under its own `--package` path and separately asserts that each one is still discovered by the scan.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The ten `warnPackages` entries are known and confirmed to be parent identifiers: `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`.
- Phases 001, 002 and 003 have taken their roots to zero, so each graduation is a record of a measured state rather than an aspiration.

### Definition of Done

- `warnPackages` is empty and the fleet header reads `warn_packages=` with nothing after it.
- The allowlist names 41 roots and the CI workflow runs and discovery-checks every one.
- The gate is observed both green at baseline and red on an injected violation.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Enforce per root, and treat discovery as a first-class condition. Cleanliness and coverage are two different properties, and only one of them shows up in a violation count. A gate that checks only what it found reports the same output for a clean root and a root it never opened, so coverage is asserted separately against a written list rather than inferred from the scan's own result.

### Key Components

- `playbook-corpus-manifest.json` `warnPackages`: the grandfather list, emptied entry by entry as each package reached zero.
- `playbook-failclosed-allowlist.txt`: the explicit set of 41 roots held as a blocking gate, carrying its own rule in its header — a line is added when a package is cleaned, and is never removed to make a red build green.
- `.github/workflows/playbook-operator-contract.yml`: runs each allowlisted root with its own `--package` path, and carries a separate step that asserts every listed root is still discovered, emitting a build error naming any root that is not.

### Data Flow

Each phase's per-root zero is measured, then that package's entry is removed from `warnPackages`, then its root is added to the allowlist. CI reads the allowlist, runs each root under its own package identifier, and asserts the discovered set still covers the listed set. A root that leaves scan range fails the discovery assertion rather than passing the violation check.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the ten `warnPackages` entries and confirm each is a parent identifier whose nested modes inherit its exemption. Confirm which roots the fleet scan currently discovers, so the allowlist can be written against measured discovery rather than an assumed inventory.

### Phase 2: Core Implementation

Remove each package from `warnPackages` as its remediation phase reports zero, until the list is empty. Write `playbook-failclosed-allowlist.txt` with all 41 roots and the rule that governs it. Add the CI workflow that runs each root under its own `--package` path and asserts every listed root is still discovered.

### Phase 3: Verification

Run the fleet with `--strict`, capturing the exit status directly rather than through a pipe. Confirm 41 packages discovered, `violations=0` on every one, no `FAIL` line, and `warn_packages=` empty. Then inject a violation, confirm the gate turns red, restore, and confirm it turns green again.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: a full `validate-playbook-package.cjs --strict` fleet run with the exit status captured from the process itself, since piping the output into another command reports that command's status instead. The census is read by counting the package result lines and summing their `violations` fields, not by trusting a summary. Controlled: the injected-violation control is the load-bearing test — a gate that has only ever been seen green has not been shown to work, so a violation is introduced, the gate is required to exit non-zero, and the file is restored and the gate required to exit 0 again.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and its `playbook-corpus-manifest.json`.
- Phases `001-sk-code-family`, `002-cli-and-mcp-transports`, and `003-deep-loop-and-spec-kit`, which supply the measured zero each graduation records.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible in the direction that matters and deliberately awkward in the other. Restoring the ten `warnPackages` entries would return every affected package to non-blocking warnings; deleting the allowlist or the workflow would remove the gate. Both are one-line changes, which is exactly why the allowlist states in its own header that a line is never removed to make a red build green. The rollback path exists for a broken gate, not for a failing package.

<!-- /ANCHOR:rollback -->
