# Working on this app

## Never build the Mac companion unsigned into Xcode's DerivedData

```sh
# WRONG — writes an adhoc-signed app into the folder Xcode runs from
xcodebuild -scheme MacCompanion CODE_SIGNING_ALLOWED=NO build

# RIGHT — verification builds go somewhere else entirely
xcodebuild -scheme MacCompanion -derivedDataPath /tmp/verify-dd build
```

The companion stores its pairing private key in the login keychain. Keychain
ACLs are bound to the app's code signature, so an adhoc-signed build cannot
read an item created by the Apple-Development-signed build Xcode produces.
The symptom is a **keychain error -25293** (`errSecAuthFailed`) at pairing
time, and it looks like a bug in the pairing code rather than what it is:
two differently-signed copies of the same app fighting over one keychain
item.

`PairingKeyStore` now recovers — an unreadable key is a dead pairing by
definition, so it drops it and mints a new one rather than dead-ending the
user at an error. But recovery costs a re-pair, so don't cause it.

The iOS target is unaffected (simulator builds don't share a keychain with
device builds), but use `-derivedDataPath` there too out of habit.

## Tests

```sh
cd packages/RemoteKit && swift test
```

The shared code is a real Swift package, so its logic is testable without
a simulator or a paired Mac. What's covered: framing, sealing, the auth
handshake's binding, compression, permission-risk policy, slash-command
parsing, and wordmark geometry. Anything that is *policy* rather than
plumbing belongs in the package so it can be tested there.

## Regenerating the Xcode project

`app/RemoteForOpenCode.xcodeproj` is generated and gitignored:

```sh
cd app && xcodegen generate
```

Run it after adding or removing any source file — a new `.swift` that
isn't in the project produces a "cannot find X in scope" error that looks
like a typo.

## Iterating on UI without a paired Mac

`tools/uiharness` compiles the real Phone views against mock state:

```sh
cd tools/uiharness && xcodegen generate
xcodebuild -project Harness.xcodeproj -scheme Harness \
  -destination 'id=<booted simulator udid>' build
xcrun simctl install booted <path to Harness.app>
xcrun simctl launch booted com.timwilliams.harness.ui
```

It builds the actual source files rather than copies, so what you see is
what ships.

## "Missing package product 'RemoteKit'"

Xcode caches resolved packages per project, and `xcodegen generate`
replaces the project file underneath a running Xcode. The result is an
Xcode that still believes in the old layout while the disk has moved on.
Command-line builds succeed the whole time, which makes it look like a
GUI-only bug — it is.

```sh
# quit Xcode completely first (⌘Q, not just the window)
rm -rf ~/Library/Developer/Xcode/DerivedData/RemoteForOpenCode-*
cd app && xcodegen generate
open RemoteForOpenCode.xcodeproj      # let package resolution finish before building
```

`File → Packages → Reset Package Caches` does the same thing from inside
Xcode, and is worth trying first.

## Two stale-state traps

1. **The Mac companion is a menu bar app people leave running.** Rebuilding
   in Xcode does not replace a running instance. A phone talking to a stale
   companion gets "the Remote for OpenCode app on this Mac doesn't understand …" — quit
   from the menu bar and Run again.
2. **Two companions at once.** The second can't bind port 8766 and the phone
   silently reaches the first. The menu bar says "Another copy of OpenCode
   Go is running" when this happens.
