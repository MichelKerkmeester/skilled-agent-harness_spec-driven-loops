---
title: "Spec: Fail-closed graduation"
description: "Empty the grandfather list that made ten parent packages non-blocking, name all 41 cleaned roots in a fail-closed allowlist, and assert in CI that each named root is still actually scanned."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "fail-closed graduation"
  - "playbook warn packages grandfather list"
  - "playbook failclosed allowlist"
  - "root not scanned cannot fail"
importance_tier: "high"
contextType: "spec"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/004-fail-closed-graduation"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Emptied the grandfather list and put all 41 roots under a per-root CI gate"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
      - ".github/workflows/playbook-operator-contract.yml"
    session_dedup:
      fingerprint: "sha256:e9b38ce33c7fc0f82dc9830b8c3a4498c4bb80aebb110bf25d0872e24845538c"
      session_id: "2026-08-29-sk-code-031-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Fail-closed graduation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-fail-closed-graduation |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/037-playbook-family-remediation` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | `003-deep-loop-and-spec-kit` |
| **Successor** | None |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The reason roughly 2,600 violations could accumulate without a single red build is written into the corpus manifest. `playbook-corpus-manifest.json` shipped a `warnPackages` grandfather list of ten entries — `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, and `system-spec-kit` — and every violation inside a listed package was downgraded to a non-blocking warning. Every one of those ten is a parent identifier, and that is what makes the list larger than it looks: a fleet run resolves a nested package to its parent, so each of the mode packages beneath those ten inherited the parent's warn entry and stopped blocking without anyone deciding that it should.

That leaves a second failure mode which is harder to see than a warn entry, because it produces no output at all. A root that is not scanned cannot report a violation, so a package silently dropping out of discovery is indistinguishable from a package that is clean. A gate that only checks the violations it found will report success over work it never looked at.

The purpose of this phase is to make the zero the other three phases reached into a state the fleet has to keep: remove each package from the grandfather list as it reaches zero until the list is empty, name every root in an explicit fail-closed allowlist, and assert in CI that each allowlisted root is still discovered by the scan — so that disappearing from the gate fails the build instead of passing it.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `playbook-corpus-manifest.json`'s `warnPackages` list, emptied entry by entry as each package reached zero; `playbook-failclosed-allowlist.txt`, listing all 41 roots held to the contract as a blocking gate; and `.github/workflows/playbook-operator-contract.yml`, which runs each allowlisted root under its own `--package` path and asserts that every listed root is still discovered.

Out of scope: `routingGoldRoots`, which is a separate contract and was read but not edited; the remediation of any individual package, which belongs to phases `001-sk-code-family`, `002-cli-and-mcp-transports`, and `003-deep-loop-and-spec-kit`; and the gate's own construction defects, which are the subject of `038-authoring-hardening` phase `003-per-root-enforcement`.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** `warnPackages` is empty, and each of the ten entries was removed only after its package measured zero violations rather than in a single sweep at the end.
- **REQ-002 [P1]** `playbook-failclosed-allowlist.txt` names all 41 roots held to the operator-scenario contract as a blocking gate.
- **REQ-003 [P1]** CI runs each allowlisted root under its own `--package` path, so a nested package gets its own identifier and its own tier instead of inheriting its parent's.
- **REQ-004 [P1]** CI asserts that every allowlisted root is still discovered by the fleet scan, and fails the build when one is not — because absence of a root is otherwise indistinguishable from absence of violations.
- **REQ-005 [P2]** The allowlist file states the rule that governs it in the file itself, so the next reader learns why a line must never be removed to turn a red build green.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `playbook-corpus-manifest.json` reports `warnPackages` as an empty list, and the fleet run's header line reads `warn_packages=` with nothing after it.
- **SC-002** `playbook-failclosed-allowlist.txt` contains exactly 41 root paths outside its comment header.
- **SC-003** A fleet run with `--strict` discovers 41 packages, reports `violations=0` on every one of them, emits no `FAIL` line, and exits 0 — with the exit status read directly rather than through a pipe.
- **SC-004** `.github/workflows/playbook-operator-contract.yml` carries a step that asserts every fail-closed root is still discovered and emits a build error naming any root that is not.
- **SC-005** An injected violation turns the gate red and restoring the file turns it green again, proving the gate reports state rather than reporting success.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **A gate that passes over what it never opened.** This is the failure mode the phase exists to close, and it cannot be caught by counting violations, because the count of an unscanned root is also zero. Mitigated by asserting discovery as a separate condition from cleanliness.
- **Removing an allowlist line to make a build green.** The allowlist is the enforcement surface, so deleting a line is the cheapest way to make a failing package stop failing. Mitigated by writing the rule into the file's own header rather than into a document a future author would have to find.
- **Emptying the grandfather list before the packages are clean.** Removing an entry from `warnPackages` while its package still carries violations turns the whole fleet red and blocks unrelated work. Mitigated by removing each entry only after that package measured zero.
- **A green fleet run that proves nothing.** A gate that has never been seen to fail has not been shown to work. Mitigated by the injected-violation control, which must turn the gate red and then green again on restore.
- **Dependencies.** `validate-playbook-package.cjs`, `playbook-corpus-manifest.json`, and the three preceding phases, which supply the zero this phase makes permanent. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Whether a green fleet run was sufficient evidence was settled against the roll-up behaviour that produced the backlog in the first place: a fleet run resolves a nested package to its parent, so it is the wrong instrument to prove the backlog gone. Per-root invocation plus a discovery assertion is what replaced it.

<!-- /ANCHOR:questions -->
