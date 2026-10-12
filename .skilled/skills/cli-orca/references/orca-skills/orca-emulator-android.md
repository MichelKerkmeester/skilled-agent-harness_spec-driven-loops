---
title: Official Orca Skill - Orca Emulator (Android)
description: Discovery-stub reference for the official orca-emulator-android skill, which owns Android device and emulator control over adb on Windows, Linux and macOS, with SDK discovery, verb surface and boundaries.
trigger_phrases:
  - "orca emulator android"
  - "official orca android skill"
  - "android emulator orca"
  - "adb orca"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Official Orca Skill - Orca Emulator (Android)

Local reference for the official `orca-emulator-android` skill. The upstream file is a discovery stub: it declares when to engage, then loads the version-matched guide from the Orca executable used for the session, because the real flags live in the binary. Snapshot paths cited below resolve under `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/`.

---

## 1. OVERVIEW

`orca-emulator-android` declares Android device and emulator control from inside Orca over adb, with the live device view in Orca's emulator pane (snapshot: skills/orca-emulator-android/SKILL.md, frontmatter). Engage it when driving an adb-connected emulator or phone on Windows, Linux or macOS for booting AVDs, taps, swipes, typing, hardware buttons, rotation, app install and launch, runtime permissions, the accessibility tree and logcat (snapshot: skills/orca-emulator-android/SKILL.md, frontmatter).

The stub resolves one executable for the session in this order: the `ORCA_CLI_COMMAND` environment variable when set, then `orca-dev` in a dev checkout that exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca`. If the selected executable cannot run, report its exact error and stop rather than falling through to another executable, which could silently target a different Orca build (snapshot: skills/orca-emulator-android/SKILL.md, Resolve the CLI for this session). The version-matched guide then loads with:

```text
ORCA skills get orca-emulator-android
```

Prefer `--json` and use the executable's `--help` for commands or flags the guide does not cover. Start Orca with `ORCA open --json` and retry if a command reports that Orca is not running (snapshot: skills/orca-emulator-android/SKILL.md, Load the version-matched guide before running Orca commands).

---

## 2. PREREQUISITES AND SDK DISCOVERY

The Android backend shells out to the Android SDK (`adb`, `emulator`, `avdmanager`) that Android Studio installs, so it runs on Windows, Linux and macOS. Input uses `adb shell input`, with no extra streaming server (guide: skill-guides/orca-emulator-android.md, Command surface).

The guide's prerequisites (guide: skill-guides/orca-emulator-android.md, Prerequisites):

- Android Studio or the Android SDK installed, with `ANDROID_HOME` or `ANDROID_SDK_ROOT` set. Orca also checks the per-OS default location, `%LOCALAPPDATA%\Android\Sdk` on Windows, `~/Library/Android/sdk` on macOS and `~/Android/Sdk` on Linux.
- `adb` and `emulator` on the SDK path, plus at least one AVD from Android Studio's Device Manager or a connected device with USB debugging.
- A booted, adb-visible device before any input or capability command. A shutdown AVD is listed with `state: shutdown` and must be started first, by `ORCA emulator attach`, by Android Studio or by `emulator @<avd>`.

Orca returns a clear message when the SDK is missing: `Android SDK not found. Install Android Studio and set ANDROID_HOME.` (guide: skill-guides/orca-emulator-android.md, Prerequisites). The APK is built with Gradle before the skill drives the device (snapshot: skills/orca-emulator-android/SKILL.md, frontmatter description).

---

## 3. COMMAND SURFACE

`ORCA emulator --help` lists the wrapped verbs. Anything else goes through `ORCA emulator exec --command "<adb shell command>"`, which runs `adb -s <serial> shell <command>` with the string unvalidated (guide: skill-guides/orca-emulator-android.md, Command surface).

Verb ownership mirrors the iOS sibling and is the anti-confusion point. `tap`, `type`, `gesture`, `button`, `rotate`, `ax` and `exec` work on both backends, with backend-specific output for `ax`: a `uiautomator` node tree on Android, a serve-sim node tree on iOS. `install`, `launch`, `permissions` and `logcat` are Android-only and fail against an iOS device with `emulator_unsupported`, so never call them expecting iOS behavior (guide: skill-guides/orca-emulator-android.md, Command surface).

The Android-only verbs and the shared operations table document these commands and their constraints (guide: skill-guides/orca-emulator-android.md, Operations):

- `ORCA emulator devices --json` lists every backend's devices with a platform column, booted and shutdown.
- `ORCA emulator attach <avd-name-or-serial> --json` boots the AVD first when given an AVD name and makes the device active for the worktree.
- `ORCA emulator tap <x> <y> --json` taps at normalized 0..1 coordinates.
- `ORCA emulator gesture '<json>' --json` swipes, where adb approximates the path by its endpoints, first point to last.
- `ORCA emulator type "user@example.com" --json` types US-ASCII, with spaces handled and no newlines.
- `ORCA emulator button back --json` presses a hardware button from `home`, `back`, `recents`, `power`, `volume_up` and `volume_down`.
- `ORCA emulator rotate landscape_left --json` sets `user_rotation` and disables auto-rotate.
- `ORCA emulator install ./app-debug.apk --reinstall --json` installs an APK, where `--reinstall` passes `-r`.
- `ORCA emulator launch com.acme.app --activity .MainActivity --json` launches an app. `--activity` can be omitted to launch the default LAUNCHER activity.
- `ORCA emulator permissions grant com.acme.app android.permission.CAMERA --json` manages runtime permissions. The positional order is `<grant|revoke> <package> <permission>` and `reset` takes no positionals and clears all runtime grants.
- `ORCA emulator ax --json` reads the accessibility tree, parsed from a `uiautomator dump`.
- `ORCA emulator logcat --lines 200 --json` dumps recent logcat lines, parsed to entries.
- `ORCA emulator exec --command "getprop ro.build.version.sdk" --json` runs a raw adb shell command.
- `ORCA emulator kill --json` stops the helper and leaves the device booted. `ORCA emulator shutdown --json` stops the helper and shuts the device down.

Targeting: `attach` or opening the emulator pane makes one device active per worktree and unqualified commands target it. `--device <serial>`, such as `emulator-5554`, comes from `ORCA emulator devices` and an AVD name resolves only once that AVD is booted. `--emulator <id>` is an alternative spelling of `--device`, resolved through the same lookup. `--worktree id:<fullWorktreeId>` or `--worktree active` overrides worktree scoping, where the full id is the exact `<repo-id>::<path>` value returned by `ORCA worktree list --json` and a bare repo id is not valid. `ORCA emulator devices` is global and lists every backend, while the other verbs route to the backend that owns the resolved device (guide: skill-guides/orca-emulator-android.md, Targeting).

The guide's constraints: all coordinates are normalized 0..1 with a top-left origin, never pixels. Orca scales them to the device's live resolution. Prefer `tap` over `gesture` for a single tap. `type` uses `adb shell input text`, so it is US-ASCII only with spaces handled and newlines not. Use the app UI directly for unicode-heavy input. `gesture` is a straight swipe between the first and last point, which fits scrolling and swiping but not a true multi-touch path. Run `kill` when done, because a helper left running holds the device until Orca quits (guide: skill-guides/orca-emulator-android.md, Constraints).

---

## 4. BOUNDARIES

- Camera and sensor injection are not wrapped. Android virtual-scene is out of scope (guide: skill-guides/orca-emulator-android.md, Command surface).
- Device control is local to the host that owns the SDK, so remote and SSH device control is out of scope (guide: skill-guides/orca-emulator-android.md, Command surface).
- `--worktree all` drops worktree scoping on every verb, so a mutating command passed `all` runs unscoped. Use it only for listing (guide: skill-guides/orca-emulator-android.md, Targeting).
- For an iOS simulator use the iOS emulator skill instead (snapshot: skills/orca-emulator-android/SKILL.md, frontmatter description).

---

## 5. RELATED RESOURCES

- `orca-emulator` for iOS simulators. `orca-cli` for terminals, worktrees and the built-in browser. `computer-use` for desktop UI outside the emulator (guide: skill-guides/orca-emulator-android.md, see-also).
- The version-matched guide served by the binary is authoritative for flags: load it with `ORCA skills get orca-emulator-android` (snapshot: skills/orca-emulator-android/SKILL.md, guide-loading section).
