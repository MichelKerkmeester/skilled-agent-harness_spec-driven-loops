---
title: "Spec: Per-Root Enforcement"
description: "A fleet validator run could report success over playbook roots it never opened, so a sub-package could carry hundreds of violations behind a green build; the first gate written to fix this was itself false-green and was caught by control before shipping."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "per root enforcement"
  - "fleet run false green gate"
  - "playbook failclosed allowlist"
  - "nested package parent id rollup"
importance_tier: "high"
contextType: "spec"
parent: "sk-code/032-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-code/032-authoring-hardening/003-per-root-enforcement"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped fail-closed per-root enforcement after control caught a false-green gate"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".github/workflows/playbook-operator-contract.yml"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
    session_dedup:
      fingerprint: "sha256:2f2008ed3cb801a2d7562a613d03cc2fa22048615d7b3f955b4cc0314dd85219"
      session_id: "2026-08-29-sk-code-032-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Per-Root Enforcement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-per-root-enforcement |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-code/032-authoring-hardening` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | `002-validator-false-positives` |
| **Successor** | None |
| **Priority** | P0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

This is the finding that explains the whole packet. A fleet-wide validator run — one invoked with no `--package` filter — resolved a nested package to its parent's identity, so a sub-package inherited the parent's `warnPackages` entry from `playbook-corpus-manifest.json` and its violations stopped blocking. A sub-package could therefore sit at hundreds of violations while a fleet run reported success, and did. A root that is never opened cannot fail, so absence was indistinguishable from cleanliness, and the build stayed green the whole time the backlog grew.

The claim was proven rather than argued. A real `FORBIDDEN_VERDICT` was injected into a fail-closed sub-package: under a fleet run the validator exited 0, and under `--package <that root> --strict` it exited 1. Same defect, same code, two different verdicts, decided entirely by how the run was scoped.

The correction that matters most in this phase is the one made against its own work. The first version of the CI workflow written here used the fleet run, and was therefore a false-green gate — a gate that would have reported success for exactly the packages it could not see, which is the failure it existed to prevent. It was caught by that same injected-regression control before it shipped, and rewritten. A hardening packet that hid its own near-miss would teach the opposite of its lesson: the reason the gate is trustworthy is not that it was designed carefully, it is that the design was tested against a planted failure and the first attempt did not survive.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: package discovery in `validate-playbook-package.cjs`, so a fleet run enumerates packet-owned roots and not only first-level ones; `.github/workflows/playbook-operator-contract.yml`, the gate that blocks on any fail-closed violation and separately asserts that every listed root is still being discovered; `playbook-failclosed-allowlist.txt`, the fail-closed root set and the rule that governs adding and removing lines; the `warnPackages` list in `playbook-corpus-manifest.json`, from which cleaned packages are graduated; and the `sk-create-manual-testing-playbook/SKILL.md` discipline that explains all of it to the next author.

Out of scope: remediating the violations still carried by the one package left at warn tier, which is downstream work; the scenario contract itself, which this phase enforces but does not change; and the validator's content checks, which belong to `002-validator-false-positives`.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** A fleet run enumerates every playbook root, including those owned by a sub-skill packet, so a root cannot avoid grading by never being opened.
- **REQ-002 [P0]** A fail-closed root's violations block the build. Only a package explicitly held at warn tier may report violations without blocking.
- **REQ-003 [P0]** A listed fail-closed root that stops being discovered fails the build. Silent removal from scan range must not be indistinguishable from success.
- **REQ-004 [P0]** The gate is tested against a planted failure before it is trusted. A gate that has only ever been seen green is unproven, whatever its design says.
- **REQ-005 [P1]** The fail-closed set is a file with a stated rule: fix the package, never delete a line to turn a red build green.
- **REQ-006 [P1]** A package that reaches zero violations is graduated out of `warnPackages` and into the fail-closed set in the same change, so a one-time cleanup becomes a standing guarantee.
- **REQ-007 [P1]** The governing SKILL.md records the discipline — never accept a fleet run as proof that a nested package is clean — and the promotion step that goes with it.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** An injected `FORBIDDEN_VERDICT` in a fail-closed sub-package is shown to produce exit 0 under a fleet run and exit 1 under `--package <that root> --strict`, establishing the defect as measured rather than asserted.
- **SC-002** The gate is green at baseline across the fail-closed set, red on an injected regression and naming the offending package, and green again after the injection is reverted.
- **SC-003** A fleet run discovers every playbook root present on disk, with the discovered count matching a direct filesystem count.
- **SC-004** The fail-closed allowlist carries its governing rule in its own header, so the rule travels with the file rather than living only in a packet record.
- **SC-005** Every package that reached zero violations is out of `warnPackages`, leaving only packages that genuinely still carry a backlog at warn tier.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shipping a gate that cannot fail.** This risk materialized. The first workflow version was false-green and would have certified the corpus while seeing almost none of it. Mitigated by requiring an injected-regression control before the gate was trusted, which is what caught it.
- **A root leaving scan range unnoticed.** Once enforcement depends on a root being discovered, a rename or a move silently ends its enforcement while the build stays green. Mitigated by a second workflow step that reads the fleet run's own discovered set and fails when a listed root is absent from it.
- **Deleting a line to go green.** The fail-closed set is only meaningful if membership is hard to leave. Mitigated by stating the rule in the file header, where anyone editing it will read it, rather than in a document they will not open.
- **Graduating a package too early.** A package promoted before it is measurably clean turns the gate red for everyone. Mitigated by promoting only packages measured at zero violations, and by keeping the still-dirty package at warn tier rather than pretending otherwise.
- **Dependencies.** `validate-playbook-package.cjs` for discovery and grading, `playbook-corpus-manifest.json` for tier assignment, and GitHub Actions with Node and Python available for the gate. No new packages.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The one question worth asking of a gate — does it actually fail when something is wrong — was answered by planting a failure and reading the result, twice: once on the first workflow version, which did not survive it, and once on the version that shipped.

<!-- /ANCHOR:questions -->
