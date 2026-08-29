---
title: "Phase 2 — Scripts ownership: the app keeps scripts/, the skill references it"
description: "Decision packet answering whether the Mobile CLI verification tooling in scripts/ (token-identity, the *-cdp render gates, naming/scan-*, release-verify, 26 scripts) should move into the sk-code-mobile-cli surface skill. It should not: the skill is a read-only surface leaf that cannot own or run executable tooling, the scripts are coupled to the app tree and CI and wired as npm scripts, and the skill already references them by name. Analysis only — no files move."
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/002-scripts-ownership"
    last_updated_at: "2026-08-25T19:45:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Decision recorded: scripts/ stays app-owned; skill references it."
    next_safe_action: "None — decision packet complete; no code change follows."
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Phase 2 — Scripts ownership

> **Phase links** — Parent: [`../spec.md`](../spec.md) · Sibling: `001-mode-design-plan`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Parent | `sk-code/008-sk-code-mobile-cli-mode` |
| Level | 1 |
| Kind | Decision / analysis (no code change) |
| Decision | `scripts/` stays in the app repo; the skill references it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Mobile CLI verification tooling lives in `scripts/` (26 files: `token-identity.mjs`, the `*-cdp.mjs`
render gates, `naming/scan-*.mjs`, `release-verify.mjs`, `story-coverage.mjs`, and more). Because the
`sk-code-mobile-cli` surface skill documents how to run these gates, a fair question is whether the scripts
themselves belong inside the skill rather than the app. This packet records the answer and why, so the
boundary is not re-litigated on the next skill edit. The decision: `scripts/` stays app-owned and the skill
references it — a read-only surface leaf cannot host executable, app-coupled, CI-wired tooling.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** recording the ownership decision and its rationale and evidence.

**Out of scope:** moving, copying, or deleting any script; any change to `package.json`, CI, or the skill.
This packet ships no code change.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — The decision is recorded with its three reasons: a surface leaf cannot own executable
  tooling (`mutatesWorkspace: false`, forbids `Write`/`Edit`/`Task`); the scripts are coupled to
  `app-mobile/src` and CI and wired as npm scripts; the skill already references them by name.
- **REQ-002** — No file under `scripts/`, `package.json`, CI, or the skill is changed — the deliverable is
  the recorded decision, proven by an unchanged working tree outside this packet.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The decision (scripts stay app-owned; skill references) is recorded with its three reasons and evidence.
2. No file under `scripts/`, `package.json`, CI, or the skill changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **The decision is coupled to the skill's contract.** It holds while `sk-code-mobile-cli` stays a
  read-only surface leaf. If the skill ever gains authority to own runnable tooling, or the app's CI stops
  invoking these scripts, the boundary should be revisited in a new packet with a migration plan.
- **Dependency:** the evidence — the `scripts/` inventory, the `package.json` npm wiring, and the skill's
  existing references — all read from the current tree.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The evidence is one-directional: the app owns and runs the tooling, the skill teaches how to use it.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## 8. CROSS-REFERENCES

- `../spec.md` — the `sk-code/008-sk-code-mobile-cli-mode` phase parent.
- `../001-mode-design-plan/` — the sibling mode-design plan.
- `package.json` — where the 26 scripts are wired as npm scripts.
<!-- /ANCHOR:cross-refs -->
