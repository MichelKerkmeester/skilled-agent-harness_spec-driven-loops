---
title: "Implementation Summary"
description: "The CLI is upgraded to 2.6.1 and its authoritative command surface captured; the registration itself waits on two operator decisions."
trigger_phrases:
  - "magicpath manual summary"
  - "magicpath cli upgrade"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/017-mcp-magicpath/002-manual-and-auth"
    last_updated_at: "2026-08-29T11:55:00Z"
    last_updated_by: "session"
    recent_action: "Upgraded the CLI to 2.6.1 and captured its authoritative surface"
    next_safe_action: "Decide the mutating family, then declare the read-only tools"
    blockers:
      - "The mutating command family is undecided, and it sets the shape of the registration"
      - "No MagicPath credential on this machine, so the credentialed checks cannot run"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 25
    open_questions:
      - "Whether the mutating family is registered or withheld"
      - "Whether the skills family belongs here at all, given the hub owns skill routing"
    answered_questions:
      - "Pin or upgrade the CLI: upgraded to 2.6.1"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 2 of 5 |
| **Status** | In Progress |
| **Completed** | Not yet |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | Orchestrator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two setup steps that had to precede any registration, and a correction to the source the rest of the phase was going to trust.

The CLI is upgraded from 2.3.2 to 2.6.1, which closes the gap between the vendor's published documentation and the build on this machine. The bridge picked the new version up with no re-registration: a call through the existing tool returned 2.6.1, because the tool template invokes the binary by name rather than by a pinned path. Upgrading the CLI therefore does not invalidate a registered manual, as long as the commands it declares still exist.

The correction matters more. The phase intended to validate every declared tool against "the installed build's own command list", meaning `info -o json`. That list is stale. It reports 22 commands on both 2.3.2 and 2.6.1, while `--help` on 2.6.1 lists 25. The two it omits, `create-project` and `skills`, both run. Validating against `info` would have rejected two working command families as nonexistent, so the requirement now names `--help` as authoritative.

### Files Changed

| File | Change |
|------|--------|
| None yet | The registration is the next step; the shared configuration is untouched and its checksum is unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The upgrade was a global npm install, with the prior version and its command list recorded first so the change is reversible and the delta is measurable rather than asserted.

The surface was then read twice, from two sources, which is the only reason the stale list was noticed at all. Had the phase trusted a single source it would have carried the error into the registration and surfaced it later as two tools that "do not exist".
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Upgrade rather than pin.** The operator chose the newer build, which brings the installed surface into agreement with the vendor's documentation and adds the `skills` and `create-project` families.
- **Treat `--help` as authoritative and `info` as a status report.** `info` carries a command list, but it is not maintained against the real surface, and the evidence for that is a direct comparison rather than an inference.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Version before | 2.3.2, installed as a global npm package symlinked onto PATH |
| Version after | 2.6.1, 75 packages changed |
| Command surface, `--help` | 25 commands |
| Command surface, `info -o json` | 22 commands, omitting `create-project` and `skills` |
| Both omitted families actually run | `skills --help` returns its own subcommand list |
| Bridge after the upgrade | A call through the existing tool returned 2.6.1 with no re-registration |
| Shared configuration | Checksum unchanged; nothing registered yet |
| Authentication | Still `authenticated:false`; no credential on this machine |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The registration has not been written. What remains is blocked on whether the mutating family is exposed, which determines whether this is one manual or two.
- No credentialed call has run, so the phase has evidence for the unauthenticated state only.
- The upgrade was verified on this machine alone. Whether a manual written against 2.6.1 degrades gracefully on a host still holding an older build is untested, and the transport's habit of returning errors as ordinary strings means such a mismatch would surface as text rather than as a failure.
<!-- /ANCHOR:limitations -->

---
