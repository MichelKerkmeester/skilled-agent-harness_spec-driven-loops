---
title: "Phase 2 implementation summary — scripts-ownership decision"
description: "Decision: the Mobile CLI verification tooling in scripts/ (26 files) stays in the app repo; the sk-code-mobile-cli surface skill references it rather than hosting it. A read-only surface leaf cannot own executable, app-coupled, CI-wired tooling. No files moved — the deliverable is the recorded decision, proven by an unchanged working tree outside this packet."
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/002-scripts-ownership"
    last_updated_at: "2026-08-25T19:45:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Decision recorded and evidenced; no code change shipped."
    next_safe_action: "None — decision packet complete."
    blockers: []
    completion_pct: 100
trigger_phrases: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Phase 2 implementation summary

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|---|---|
| Parent | `sk-code/008-sk-code-mobile-cli-mode` |
| Level | 1 |
| Status | Complete |
| Deliverable | Recorded decision (no code change) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

A recorded decision, not code: the verification tooling in `scripts/` stays in the app repo, and the
`sk-code-mobile-cli` surface skill references it rather than hosting it. The packet captures the decision,
its three reasons, and the evidence so the ownership boundary is not re-litigated on the next skill edit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

By evidence, not preference. The `scripts/` and `scripts/naming/` inventory (26 files) was read alongside
what each targets (`app-mobile/src`, `app.css`, Storybook/CDP, CI). Their invocation was traced to
`package.json` npm scripts and CI, not a skill-load path. The skill's own kind was checked — a read-only
surface leaf — and its reference docs were found already naming the scripts. The evidence is
one-directional, so the decision writes itself and no file is touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

**`scripts/` stays in the app repo; the skill references it.** Three reasons:

1. **A read-only surface skill cannot own executable tooling.** `sk-code-mobile-cli` is a surface leaf —
   `packetKind: surface`, `mutatesWorkspace: false`, forbids `Write`/`Edit`/`Task`. Hosting scripts that
   mutate files and drive a browser would break that contract.
2. **The scripts are coupled to the app tree and CI.** `token-identity.mjs` reads `app-mobile/src/app.css`;
   `naming/scan-*.mjs` walk `app-mobile/src`; the `*-cdp.mjs` gates render the app via Storybook/CDP;
   `release-verify.mjs` is a CI step. They are wired as npm scripts. Moving them to the skill's repo would
   break the path coupling and the npm/CI invocation.
3. **The skill already references them.** Reference docs cite the scripts by name; the app owns and runs
   the tooling, the skill teaches how to use it. The reference-integrity scan cites them as bare basenames
   to avoid a cross-repo path false-positive — the reference relationship is intended.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|---|---|
| Scripts inventoried | `26` files in `scripts/` + `scripts/naming/` |
| Invocation | app npm scripts in `package.json` (`boot`, `story:coverage`, `test:web:runtime`, `release:*`, …) |
| Skill kind | `sk-code-mobile-cli` surface leaf — `mutatesWorkspace: false`, forbids Write/Edit/Task |
| Skill references the scripts | `5` reference docs cite them by name |
| Files moved | `0` — `git status` shows only this decision packet added; `scripts/`, `package.json`, CI, skill untouched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

The decision holds while the skill stays a read-only surface leaf. If the skill's contract ever changes to
allow it to own runnable tooling, or if the app's CI stops invoking these scripts, the boundary should be
revisited in a new packet with a migration plan.
<!-- /ANCHOR:limitations -->
