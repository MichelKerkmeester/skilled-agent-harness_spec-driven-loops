---
title: "Plan: Per-Root Enforcement"
description: "Prove the roll-up defect with an injected regression, fix discovery so a fleet run opens every root, ship a gate that blocks on any fail-closed violation and asserts continued discovery, and test the gate against a planted failure before trusting it."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "per root enforcement plan"
  - "failclosed gate plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/003-per-root-enforcement"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Fixed discovery, shipped the gate and allowlist, and proved the gate can go red"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".github/workflows/playbook-operator-contract.yml"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
    session_dedup:
      fingerprint: "sha256:921d3bc31c064fc16ce15fde65e630c7a73c8bec46e6a59b6e5e53d5d6dcf8aa"
      session_id: "2026-08-29-sk-code-032-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Per-Root Enforcement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`validate-playbook-package.cjs` grades a playbook package and assigns it a tier. `packageId()` derives a package's identity from its path below the skills root, and `playbook-corpus-manifest.json` lists the ids held at warn tier, whose violations report without blocking. A hub keeps its own `<skill>/manual-testing-playbook` while a packet keeps `<skill>/<packet>/manual-testing-playbook` beside it, as a sibling rather than a child. Discovery enumerated only the first level, so packet-owned roots were absent from every fleet run and the only identity a fleet run ever produced for that skill was the hub's — which was warn-listed.

### Overview

Prove the defect with an injected regression before changing anything, fix discovery so a fleet run means what it claims, graduate the packages that are measurably clean out of warn tier into a fail-closed set, ship a gate that blocks on any fail-closed violation and separately asserts that every listed root is still being discovered, and only then test the gate itself against a planted failure.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The roll-up defect demonstrated by measurement, not by reading the code: the same injected violation must produce different verdicts under a fleet run and a scoped run.
- The true count of playbook roots on disk established independently of the validator, so discovery can be checked against something the validator did not produce.

### Definition of Done

- A fleet run discovers every root on disk.
- The gate goes red on a planted regression and names the offending package, and green again once the plant is reverted.
- The fail-closed set carries its own governing rule, and every measurably clean package is out of `warnPackages`.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A gate is not trusted for being written; it is trusted for having gone red. Every step here is arranged so the enforcement claim is settled by a planted failure rather than by a green run, because a green run is exactly what both the defect and the first attempted fix produced.

### Key Components

- `discoverPackages(skillsRoot)`: now descends one level past each skill directory so packet-owned roots are enumerated alongside hub-owned ones, and each is emitted with its own nested id.
- `packageId(playbookRoot, skillsRoot)`: derives the identity from the path below the skills root, so a packet root resolves to its own nested id rather than to its hub's.
- `playbook-corpus-manifest.json` `warnPackages`: the list of ids allowed to report violations without blocking. Anything not on it is fail-closed.
- `playbook-failclosed-allowlist.txt`: the fail-closed root set, carrying its governing rule in its own header.
- `.github/workflows/playbook-operator-contract.yml`: one step that enforces, and a second that asserts every listed root is still discovered by the run that enforces it.

### Data Flow

Fleet run enumerates every root, hub and packet alike → each root resolves to its own id → the manifest decides the tier → a violation in a fail-closed package fails the build, while a warn-tier package reports and continues → the second step reads that same run's discovered set and fails if any allowlisted root is missing from it.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Inject a real `FORBIDDEN_VERDICT` into a fail-closed sub-package and run it both ways, so the roll-up defect is established as a measurement before anything is changed. Count the playbook roots on disk directly.

### Phase 2: Core Implementation

Fix discovery to descend into packet-owned roots. Graduate the measurably clean packages out of `warnPackages`. Write the fail-closed allowlist with its governing rule in the header. Write the gate, and record the per-root discipline and the promotion step in the governing SKILL.md.

### Phase 3: Verification

Run the injected-regression control against the gate itself. This is where the first workflow version failed and was rewritten. Re-run at baseline, on the plant, and after the revert, reading the result each time.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Adversarial rather than confirmatory. The defect and the first attempted fix both presented as a green run, so a green run proves nothing here and every check is built to try to make the gate lie. The roll-up defect is demonstrated by running one injected violation two ways and reading two different exit codes. Discovery is checked against a filesystem count the validator did not produce. The gate is exercised at baseline, then against a planted regression that it must catch and name, then after the revert. Tier assignment is checked by reading which packages still report violations without blocking, and confirming that set is only the packages that genuinely still carry a backlog.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `validate-playbook-package.cjs` for discovery, identity, and grading.
- `playbook-corpus-manifest.json` for tier assignment.
- GitHub Actions with Node and Python available, for the two workflow steps.
- No new packages and no network access beyond the runner's own checkout.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible in layers. Deleting `.github/workflows/playbook-operator-contract.yml` and `playbook-failclosed-allowlist.txt` removes the gate and the fail-closed set; `git checkout --` on the manifest restores the former warn-tier list, and on the validator restores the former discovery. Rolling back returns the corpus to a state where a green build carries no information about most of it, so the rollback is a last resort rather than a routine option.

<!-- /ANCHOR:rollback -->
