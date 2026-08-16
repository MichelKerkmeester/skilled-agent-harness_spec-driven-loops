# Releasing the Mac companion

The companion ships outside the App Store — it spawns the OpenCode CLI and
reads the user's real repos, so it can't be sandboxed. Distribution is a
Homebrew cask for discovery plus Sparkle for updates, the same pipeline
Tomte runs.

## One-time setup

1. **Notary credentials** (interactive; never scripted):
   ```sh
   xcrun notarytool store-credentials opencodego-notary \
     --apple-id <your Apple ID> --team-id 7NHJT99NX8
   ```
   using an app-specific password from appleid.apple.com.

2. **Update-signing keypair** — ✅ done.

   `scripts/setup-signing-key.sh` found the existing key in the login
   keychain and reused it, so **Remote for OpenCode signs updates with the same
   key as Tomte**. That is Sparkle's intended design, not an accident: its
   own tooling states *"You only need one signing key, no matter how many
   apps you embed Sparkle in,"* and there is no per-app account option.

   The consequence worth knowing: one key, one blast radius. Losing or
   leaking it affects **both** products, and no shipped copy of either can
   ever install another update — the only remedy is making every user
   reinstall by hand. Back up the keychain item ("Private key for signing
   Sparkle updates"); `generate_keys -x <file>` exports it if you want an
   offline copy.

3. **Tap repo** — ✅ done. `tjameswilliams/homebrew-tap` already existed
   for the ai-imessage formulae, so the cask was added alongside them
   rather than replacing anything (originally as `Casks/opencodego.rb`,
   pre-rename). `packaging/remote-for-opencode.rb` is copied there on each
   release, which is what
   `brew install --cask tjameswilliams/tap/remote-for-opencode` reads. The cask
   downloads the same artefact Sparkle updates from, so a brew install and
   an in-app update can never disagree.

   Still owed from the rename: in the tap, rename
   `Casks/opencodego.rb` → `Casks/remote-for-opencode.rb` and add a
   `cask_renames.json` at the tap root —
   `{"opencodego": "remote-for-opencode"}` — so anyone who installed 1.0
   under the old token follows `brew upgrade` instead of orphaning.

## Before 1.2 ships (one-time)

- [x] **Done 2026-08-05** — both fields deployed to Production and
      verified in the console (DevicePeer: 16 fields).

Multi-peer pairing adds two fields to the `DevicePeer` record type:
`deviceID` (String) and `deviceIDs` (String List, on the directory
record). The Development environment creates them automatically on first
write; **Production does not** — deploy the schema change in the CloudKit
console (same container, `iCloud.com.timwilliams.opencodego`, team
7NHJT99NX8 — mind the neighbouring containers) before any 1.2 build or
TestFlight phone build goes out. Additive-only, so shipped 1.1 builds are
unaffected. Skipping this makes modern pairing fail only in production
builds, which is the worst kind of invisible.

Also rehearse the migration before publishing: update a Mac with a live
1.1 phone pairing and confirm the phone reconnects without re-pairing
(the store migration preserves the peer key bytes; the pairing survives
by construction, but the construction deserves one witness).

## Each release

```sh
scripts/release.sh 1.1                 # archive, sign, notarize, dmg, appcast
website/scripts/deploy.sh              # site + dmg + appcast → S3/CloudFront
# then stamp packaging/remote-for-opencode.rb with the printed version and
# sha256 and copy it to the tap:
# tjameswilliams/homebrew-tap → Casks/remote-for-opencode.rb
brew audit --cask --online tjameswilliams/tap/remote-for-opencode
```

Hash the **served** dmg, not the local one, before trusting the stamp —
they should match, and if they don't the upload is what users get.

Run the audit every time. It is what caught the cask pointing at the
unversioned `downloads/GoForOpenCode.dmg` while pinning a sha256: that
file is overwritten by each deploy, so shipping it that way would have
broken `brew install` for 1.0 the moment 1.1 was uploaded. The cask now
uses `RemoteForOpenCode-#{version}.dmg`, which `deploy.sh` uploads without
`--delete` and therefore keeps forever. The website's download button
still points at the unversioned URL — that one is meant to float.

`release.sh` alone (with `--skip-notarize`) is fine for a local smoke test;
never publish an un-notarized dmg — Gatekeeper will refuse it on any Mac
but this one.

## How the two update paths coexist

- **Homebrew** installs the app and, because the cask declares
  `auto_updates true`, then stays out of the way — `brew upgrade` won't
  fight the in-app updater.
- **Sparkle** does the actual updating, polling
  `https://remoteforopencode.com/downloads/appcast.xml` and verifying each dmg's
  EdDSA signature before installing. That URL is compiled into every shipped
  build and installed copies poll it forever, so it must not move.

  Copies shipped before the rename (1.0) poll
  `https://goforopencode.com/downloads/appcast.xml` instead. Both domains
  are served by the same CloudFront distribution (the stack's
  `legacyDomainName`), so there is exactly one appcast and one set of dmgs;
  a 1.0 copy sees the 1.1 entry on the old domain, installs it, and is on
  the new feed URL from then on. The old domain therefore stays registered
  and aliased for as long as any pre-rename install might exist.

Version numbers: `MARKETING_VERSION` is the human version (`0.2.0`);
`CURRENT_PROJECT_VERSION` is a UTC datestamp, so it's monotonic without
bookkeeping — Sparkle compares that to decide what's newer.

## The phone

App Store, via Xcode's organizer or fastlane later. The iOS app has no
Sparkle equivalent and needs none.
