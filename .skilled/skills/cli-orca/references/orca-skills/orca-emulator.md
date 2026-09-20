---
title: Official Orca Skill - Orca Emulator (iOS)
description: Discovery-stub reference for the official orca-emulator skill, which owns iOS Simulator control from inside Orca on macOS, with its prerequisites, verb surface, targeting and boundaries.
trigger_phrases:
  - "orca emulator"
  - "official orca emulator skill"
  - "ios simulator orca"
  - "orca simulator evidence"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Official Orca Skill - Orca Emulator (iOS)

Local reference for the official `orca-emulator` skill. The upstream file is a discovery stub: it declares when to engage, then loads the version-matched guide from the Orca executable used for the session, because the real flags live in the binary. Snapshot paths cited below resolve under `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/`.

---

## 1. OVERVIEW

`orca-emulator` declares iOS Simulator control from inside Orca, with the live device view in Orca's emulator pane (snapshot: skills/orca-emulator/SKILL.md, frontmatter). Engage it when driving a booted Apple Simulator on macOS for taps, gestures, typing, hardware buttons and rotation, or for the accessibility tree. Engage it also when an iOS change needs simulator evidence (snapshot: skills/orca-emulator/SKILL.md, frontmatter).

The stub resolves one executable for the session in this order: the `ORCA_CLI_COMMAND` environment variable when set, then `orca-dev` in a dev checkout that exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca`. If the selected executable cannot run, report its exact error and stop rather than falling through to another executable, which could silently target a different Orca build (snapshot: skills/orca-emulator/SKILL.md, Resolve the CLI for this session). The version-matched guide then loads with:

```text
ORCA skills get orca-emulator
```

Prefer `--json` and use the executable's `--help` for commands or flags the guide does not cover. Start Orca with `ORCA open --json` and retry if a command reports that Orca is not running (snapshot: skills/orca-emulator/SKILL.md, Load the version-matched guide before running Orca commands).

---

## 2. PREREQUISITES

The guide names these host tools and states (guide: skill-guides/orca-emulator.md, Prerequisites):

- macOS with the Xcode Command Line Tools, verified with `xcrun --version`.
- A booted simulator, verified with `xcrun simctl list devices booted`, or one booted by `attach`.
- An active session for the worktree before any input verb, created by `ORCA emulator attach` or by opening the emulator pane.
- In a `pnpm dev` checkout, run `pnpm build:cli` before the first emulator command so the dev CLI shim reaches this worktree's runtime instead of a packaged install.

Orca reports a clear error when the host is missing macOS or the Xcode tools (guide: skill-guides/orca-emulator.md, Prerequisites). The app under test is built and installed first with the normal build tools, `xcodebuild` or `simctl`, before the skill drives the simulator (snapshot: skills/orca-emulator/SKILL.md, frontmatter description).

---

## 3. COMMAND SURFACE

`ORCA emulator --help` lists the wrapped verbs. Anything else goes through `ORCA emulator exec --command "<serve-sim command>"`, which forwards the string to serve-sim unvalidated with the active device injected (guide: skill-guides/orca-emulator.md, Command surface).

Verb ownership is the anti-confusion point between the two emulator skills. `tap`, `type`, `gesture`, `button`, `rotate`, `ax` and `exec` work on both backends. `install`, `launch`, `permissions` and `logcat` are Android-only and fail against an iOS device with `emulator_unsupported`, so never call them against an iOS simulator (guide: skill-guides/orca-emulator.md, Command surface).

The operations table documents these verbs and constraints (guide: skill-guides/orca-emulator.md, Operations):

- `ORCA emulator list --json` lists Orca-managed sessions plus raw serve-sim streams, with ids for `--device` and `--emulator`.
- `ORCA emulator devices --json` lists every backend's devices with a platform column, booted and shutdown.
- `ORCA emulator attach "iPhone 16 Pro" --json` starts the helper if needed and makes the device active for the worktree. `--focus` switches the UI, which does not happen by default.
- `ORCA emulator tap <x> <y> --json` taps at normalized 0..1 coordinates.
- `ORCA emulator gesture '<json>' --json` runs a multi-step gesture with begin, move and end points. Use `tap` for a single tap.
- `ORCA emulator type "text" --json` types US-ASCII only.
- `ORCA emulator button home --json` presses a hardware button. `home` and `side_button` are documented by the CLI spec, while names such as `swipe_home`, `app_switcher`, `lock` and `siri` are forwarded to serve-sim unvalidated.
- `ORCA emulator rotate landscape_left --json` rotates the device. The orientation persists for subsequent gestures.
- `ORCA emulator ax --json` reads the serve-sim node tree, capped at 500 nodes with frames normalized 0..1 from a top-left origin. It needs an active session.
- `ORCA emulator exec --command "ca-debug blended on" --json` passes a raw serve-sim subcommand string without a `serve-sim` prefix.
- `ORCA emulator kill --json` stops the helper and leaves the device booted. `ORCA emulator shutdown --json` stops the helper and shuts the simulator device down.

Targeting: `attach` or opening the emulator pane makes one device active per worktree and unqualified commands target it. `--device "iPhone 16 Pro"` or `--device <udid>` selects a device from `list` or `devices`. `--emulator <id>` is an alternative spelling resolved through the same lookup. `--worktree id:<fullWorktreeId>` or `--worktree active` overrides worktree scoping, where the full id is the exact `<repo-id>::<path>` value returned by `ORCA worktree list --json` and a bare repo id is not valid. With no active session an unqualified command fails with `emulator_no_active`, so attach or open the pane and retry (guide: skill-guides/orca-emulator.md, Targeting).

The guide's constraints: all coordinates are normalized 0..1 with a top-left origin, never pixels. An `ax` element is tapped at its frame center, `x + width / 2` and `y + height / 2`. Prefer `tap` over `gesture` for a single tap, because a separate gesture begin and end pair can be interpreted as a long press due to WebSocket overhead. `type` errors on unsupported characters rather than degrading. The pane and the CLI share one stream and one helper, so closing the pane can stop the stream. Run `kill` when done, because a helper left running holds the device until Orca quits. The iOS backend drives private simulator APIs, so an Xcode update can change its behavior (guide: skill-guides/orca-emulator.md, Constraints).

---

## 4. BOUNDARIES

- Prefer Orca over raw `serve-sim` or direct `simctl` for simulator control inside Orca, because Orca handles device scoping, helper lifecycle and worktree context (snapshot: skills/orca-emulator/SKILL.md, stub body).
- Emulator control is local to the Mac that owns the simulator. Remote and SSH worktrees are out of scope (guide: skill-guides/orca-emulator.md, Command surface).
- `--worktree all` drops worktree scoping on every verb, so a mutating command passed `all` runs unscoped. Use it only for listing (guide: skill-guides/orca-emulator.md, Targeting).
- For an Android device or emulator use the Android emulator skill instead (snapshot: skills/orca-emulator/SKILL.md, frontmatter description).

---

## 5. RELATED RESOURCES

- `orca-emulator-android` for Android devices. `orca-cli` for terminals, worktrees and the built-in browser. `computer-use` for desktop UI outside the simulator (guide: skill-guides/orca-emulator.md, see-also).
- The version-matched guide served by the binary is authoritative for flags: load it with `ORCA skills get orca-emulator` (snapshot: skills/orca-emulator/SKILL.md, guide-loading section).
