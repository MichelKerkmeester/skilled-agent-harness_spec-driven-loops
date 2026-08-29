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
    last_updated_at: "2026-08-29T14:01:22Z"
    last_updated_by: "session"
    recent_action: "Registered the 14-tool surface; proved it on a fresh server"
    next_safe_action: "Decide the mutating family, then declare the read-only tools"
    blockers:
      - "The mutating command family is undecided, and it sets the shape of the registration"
      - "No MagicPath credential on this machine, so the credentialed checks cannot run"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 85
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
| `.opencode/bin/magicpath-utcp-manual.cjs` | Created - emits the 14-tool read-only UTCP manual the transport discovers |
| `.opencode/bin/magicpath-utcp-exec.cjs` | Created - strips unfilled placeholders before the CLI sees them |
| `.utcp_config.json` | The `magicpath` manual registered, declaring no `env_vars`; 10 insertions, 0 deletions |
| `.env.example` | Records that no namespaced variable exists and that headless use exports `MAGICPATH_TOKEN` |
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
- **Strip unfilled placeholders in a wrapper rather than per tool.** The transport substitutes a literal `MISSING_ARG_<name>` token for any unset optional instead of dropping the flag. Left alone, a listing filtered by a team named `MISSING_ARG_team` returns an empty result that reads as a legitimate answer, which is worse than an error. One wrapper fixes it for all fourteen tools, and a missing required positional is refused rather than guessed.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Emitted manual | 14 tools, every one tagged read-only, no required field missing |
| Every declared command exists | All 14 matched `magicpath-ai --help` on 2.6.1 |
| Unfilled optional placeholder | Before the wrapper: `--opt MISSING_ARG_opt` reached the command line verbatim |
| After the wrapper | The flag and its unfilled value are dropped; a missing required positional returns a structured refusal |
| Registration in the shared config | Parses, 14 manuals, 10 insertions and 0 deletions |
| Fresh server against the real config | `Successfully registered manual 'magicpath' with 14 tools` |
| Unauthenticated call | Structured `NOT_AUTHENTICATED` JSON naming the fix |
| Credential in a tracked file | None |
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

- No credentialed call has been made, so every tool is proven to resolve and refuse, and none is proven to return real account data.
- Declaring the credential as a manual `env_vars` entry was a mistake, caught only by starting a fresh server against the real configuration rather than registering at runtime. Two things made it wrong: the transport namespaces a bare `${VAR}` as `<manual>_<VAR>`, so a pre-namespaced reference doubled the prefix and resolved to nothing; and an empty value counts as undefined, so satisfying the declaration required a non-empty token, which the CLI then prefers over a stored login session. Removing the declaration fixes both. Four sibling manuals in the same configuration fail to register for the same class of reason and were left alone as outside this packet.
- No credentialed call has run, so the phase has evidence for the unauthenticated state only.
- The upgrade was verified on this machine alone. Whether a manual written against 2.6.1 degrades gracefully on a host still holding an older build is untested, and the transport's habit of returning errors as ordinary strings means such a mismatch would surface as text rather than as a failure.
<!-- /ANCHOR:limitations -->

---
