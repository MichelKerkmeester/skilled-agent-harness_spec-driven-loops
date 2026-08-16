# Privacy Policy — Remote for OpenCode

_Last updated 3 August 2026._

**Remote for OpenCode collects nothing.**

That is the whole policy, but here is what it means concretely.

## What the app does with your data

The app connects your iPhone to a Mac you own, running the Remote for OpenCode
companion. Your prompts, your code, your files, and the agent's replies
travel directly between those two devices over a connection that is
end-to-end encrypted with keys only your devices hold.

- **No servers of ours.** There is no backend. We do not operate a service
  that your data passes through, because there is nothing between your
  phone and your Mac.
- **No analytics, no telemetry, no crash reporting, no advertising.** The
  app contains no third-party SDKs of any kind.
- **No accounts.** There is nothing to sign up for and no profile to
  create.

## What leaves your devices

Two things, both to services you already control:

1. **Apple's iCloud (your own private database).** Pairing exchanges public
   keys and device names through your iCloud account so the two devices can
   find each other. Only public keys, device names, and network addresses
   are stored — never your prompts, code, or files. Apple's handling of
   your iCloud data is governed by
   [Apple's Privacy Policy](https://www.apple.com/legal/privacy/).
2. **Your AI provider, via your Mac.** When the agent runs, your Mac's
   OpenCode installation sends prompts to whichever model provider *you*
   configured, using *your* credentials. Those credentials stay on your
   Mac; the phone never sees them. That exchange is governed by your chosen
   provider's terms, not ours.

## On-device processing

- **Dictation** is transcribed entirely on your iPhone. Audio is never sent
  to Apple or anyone else.
- **Photos and files** you attach are resized on your phone and sent only
  to your own Mac.
- **Face ID / Touch ID** confirms it is you before approving an agent's
  command. Biometric data never leaves the Secure Enclave and is never seen
  by the app.

## Notifications

Push notifications are delivered through Apple's servers via your own
iCloud account. **Notification payloads deliberately contain no content** —
no command text, no code, no file names. The phone fetches details over the
encrypted connection to your Mac only after you tap.

## Data retention and deletion

We hold no data, so there is nothing to retain and nothing to request
deletion of. Everything the app stores lives on your own devices:
uninstalling the app and unpairing on the Mac removes it.

## Children

The app is a developer tool and is not directed at children.

## Changes

Material changes to this policy will be published on this page with an
updated date.

## Contact

Questions: open an issue at
<https://github.com/tjameswilliams/remote-for-opencode/issues>.
