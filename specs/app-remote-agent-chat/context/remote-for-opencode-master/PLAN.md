# remote-for-opencode

A native iPhone app plus a Mac menu-bar companion that lets you start, steer, and
approve OpenCode coding-agent sessions from your phone — with zero network
configuration. Your Mac is the coding machine; your phone is the secure remote.

## Positioning

Everything on the market makes the user do networking homework (WhisperCode:
`opencode web --hostname 0.0.0.0` + Tailscale/VPS + manual IP entry) or ships a
webview of the desktop UI. We ship:

1. **Zero-config remote** — Bonjour on the LAN, punched UDP from anywhere,
   CloudKit rendezvous. No Tailscale, no port forwarding, no IP addresses, no
   hosted servers of ours.
2. **Native SwiftUI** — the bar is Anthropic's and Codex's mobile agent apps,
   not a squeezed desktop UI.
3. **Push without a relay** — CloudKit `CKQuerySubscription` fires APNs when the
   Mac writes "agent needs attention" to the shared record. No third-party
   server in the notification path (WhisperCode routes push through their
   hosted relay).
4. **Project launcher** — resume any session on the Mac, or start OpenCode in
   any git repo the Mac can see, including ones never opened with OpenCode.
5. **Managed lifecycle** — the Mac app detects/installs/updates OpenCode and
   keeps `opencode serve` alive on localhost. The user never runs a command.

## Architecture

```
iPhone (SwiftUI, native)
   │  Mobile protocol v1 over Wire (LAN TCP via Bonjour / punched UDP anywhere,
   │  ChaChaPoly-sealed, paired via CloudKit + 6-digit code)
   ▼
Mac companion (menu bar)
   │  Adapter: mobile protocol v1  ⇄  installed OpenCode API version
   │  (OpenCode churn is absorbed here — no App Store release needed)
   │  localhost only
   ▼
opencode serve (owned child process, never exposed to the network)
```

### Transport: lifted from ../ai-macintosh (Tomte)

Proven files to port into `app/RemoteKit/` (rename Bonjour type, CloudKit container,
keychain service; keep the design):

| Source (ai-macintosh) | Provides |
|---|---|
| `app/AgentKit/Wire.swift` | Framed JSON protocol, handshake, sealed channel, compression |
| `app/MacAgent/AgentServer.swift` | Dual-path listener (Bonjour TCP + punched UDP) |
| `app/AgentKit/Punch.swift`, `PunchTransport.swift`, `Stun.swift`, `UDPSocket.swift` | Hole punching, CloudKit rendezvous, STUN, keepalives |
| `app/AgentKit/Pairing.swift`, `PairingViews.swift` | Curve25519 pairing, 6-digit confirmation |
| `LiveTurns` + `serveResume` pattern | Streams that outlive the phone's socket; replay-from-event on reconnect |

Known generalizations (not needed for M1, tracked for later): pairing is
currently 1 Mac + 1 phone per Apple ID (fixed record names); no relay fallback
for double-symmetric NAT.

### Mobile protocol v1 (the stable contract)

Typed request kinds over Wire — deliberately *not* a tunnel of OpenCode's HTTP,
so the phone never couples to OpenCode's API shape:

- `hello` → capabilities: `{opencodeVersion, supportsDiff, supportsPermissions, supportsQuestions, supportsTerminal}`
- `projects` → opened projects (OpenCode `GET /project`) + discovered git repos (Mac-side scan)
- `sessions` → across projects, recency-sorted (`GET /experimental/session`)
- `prompt` / `resume` / `abort` — turn streaming with turn IDs and replay (LiveTurns pattern)
- `permission.reply`, `question.reply` — approvals (`/permission/{id}/reply`, `/question/{id}/reply`)
- `diff` — session diff for review (`GET /session/{id}/diff`)

The Mac adapter maps v1 ⇄ OpenCode, subscribing to OpenCode's SSE `/event`
stream and re-emitting as Wire events.

### OpenCode API endpoints the adapter uses (verified against source)

`/project`, `/project/current`, `/experimental/session`, `/session/*`
(`prompt_async`, `abort`, `fork`, `revert`, `diff`, `message`), `/permission`,
`/question`, `/event` + `/global/event` (SSE), `/find`, `/file`, `/vcs/diff`,
`/config/providers`. Terminal (`/pty`) exists but is deliberately post-v1.

## Repo structure

```
remote-for-opencode/
├── PLAN.md                     ← this file
├── app/
│   ├── RemoteKit/                  ← shared Swift package (iOS + macOS)
│   │   ├── Transport/          ← Wire, Punch, PunchTransport, Stun, UDPSocket, LineFramer
│   │   ├── Pairing/            ← Pairing, PairingViews, keychain, CloudKit rendezvous
│   │   ├── Protocol/           ← mobile protocol v1 types (requests, events, capabilities)
│   │   └── Models/             ← Project, Session, Turn, Diff, Permission — phone-facing shapes
│   ├── MacCompanion/           ← menu-bar app
│   │   ├── Server/             ← AgentServer (dual-path listener), LiveTurns
│   │   ├── OpenCode/           ← process lifecycle: detect/install/update/serve/restart
│   │   ├── Adapter/            ← protocol v1 ⇄ OpenCode HTTP+SSE; capability detection
│   │   ├── Discovery/          ← git-repo scan for the project launcher
│   │   └── UI/                 ← menu bar: status, devices/pairing pane, kill switch
│   └── Phone/                  ← SwiftUI iPhone app
│       ├── Home/               ← projects + recent sessions launcher
│       ├── Session/            ← streaming conversation, tool activity, voice input
│       ├── Review/             ← diff viewer, permission/question approval sheets
│       └── Connect/            ← pairing flow, presence indicator
├── spikes/                     ← throwaway validation (M0)
└── docs/
    └── protocol-v1.md          ← the wire contract, versioning rules
```

## Milestones

### M0 — Adapter spike (throwaway) — ✅ DONE 2026-08-02
Proved against OpenCode 1.18.10 (`spikes/adapter/spike.ts`, TS purely as a
disposable probe — the product is Swift throughout): projects, cross-project
sessions, `prompt_async` + SSE streaming, forced permission ask → approve →
tool unblocks, per-turn diffs, transcript. Contract + event corpus:
`docs/protocol-v1.md`, `spikes/adapter/events/`. Version-skew was observed
first-hand (permission event renamed 1.16→1.18; a schema-mismatched install
fails opaquely while `/global/health` reports healthy) — both are documented
adapter rules.

### M1 — "Couch milestone": LAN end-to-end (the real first milestone)
Port RemoteKit transport + pairing from Tomte (Bonjour TCP path only — punch code
comes along but isn't the acceptance path). Mac companion manages
`opencode serve` on localhost. Phone app:
- pair with the Mac (CloudKit + 6-digit code, as in Tomte)
- see projects and recent sessions; open or start one
- send a prompt (typed or dictated), watch tokens/tool activity stream natively
- approve/deny a permission request; view the session diff
- background the app mid-answer, return, and resume the stream (LiveTurns)
- **Exit criterion:** full session driven from the phone on the same Wi-Fi,
  with the OpenCode server never listening on anything but localhost.

### M2 — Anywhere — implemented 2026-08-02, needs cellular verification
Punched UDP path enabled: punch listener re-kicks on pairing changes,
phone invalidates its remembered path on foreground, presence dot on Home
(probed over the punch), Pause/Resume Remote Access in the menu bar.
To verify on hardware: phone on cellular, pull-to-refresh, prompt, then
the pause switch. Debug: `log stream --predicate 'subsystem ==
"com.timwilliams.opencodego" AND category == "punch"'`.

### M3 — Push — implemented 2026-08-02, needs device verification
CloudKit `CKQuerySubscription` → APNs when a session needs attention.
Built: Attention records (RemoteKit/Attention.swift) published by LiveTurns
when an event lands with no live sink; phone subscription + tap →
ApprovalsView fetching `pending` over Wire. No content in payloads.
To verify on hardware, together with M2's cellular punch test: background
the app mid-turn, wait for the approval push, answer from the sheet.

### M4 — Polish & release
Face ID gate on approvals, device revocation, multi-Mac pairing
generalization, voice-first prompting pass, project icons, App Store
assets for the phone. Distinct brand name, "powered by OpenCode /
unaffiliated" attribution per upstream's naming request.

**Distribution (decided 2026-08-02):**
- Public source-available repo: github.com/tjameswilliams/remote-for-opencode,
  PolyForm Noncommercial 1.0.0 (LICENSE.md). We don't vendor OpenCode code,
  so no MIT notices needed — it's a runtime dependency the companion drives.
- Mac companion: Homebrew **cask** (`brew install --cask remote-for-opencode`) with
  `auto_updates true`, real updates via **Sparkle** in-app (appcast +
  EdDSA-signed dmg, same pipeline Tomte uses — see ai-macintosh project.yml
  and release.sh). Needs: Developer ID signing + notarization, a tap repo
  (tjameswilliams/homebrew-tap) or eventually homebrew/cask.
- Phone: App Store.

### M4.5 — Attachments — implemented 2026-08-03, needs device verification
Photos, camera captures, and files ride along with a prompt as
`FilePartInput` data: URIs — nothing is hosted anywhere. Images are
downscaled to a 1568px long side before sending; 20 MB per turn, enforced
on both ends. Built: PromptAttachments + AttachmentStrip on the phone, the
(+) menu in the composer, attachment mapping in the adapter.
Still open from the original plan:
1. Upload progress: the punched path reports acks, so Tomte's "Sending
   your photo… 40%" treatment beats a spinner on cellular. Not wired yet.
2. An attachment cache keyed by id, so a re-send over a lossy link doesn't
   re-upload payloads the Mac already holds (Tomte's `ref` mechanism).
3. Gate the (+) on the selected model's `attachment` capability — the
   catalogue already carries the flag.

### M5 — Remote desktop client (roadmap, added 2026-08-02)
Drive the home Mac's OpenCode from another computer — same product, bigger
screen. The pieces already in place: protocol v1 is client-agnostic, and
RemoteKit (Wire, Punch, Pairing) is shared Swift that compiles on macOS today.
What it actually needs, in order:
1. **Multi-peer pairing** — the prerequisite, also needed for multi-Mac and
   already flagged in M4: replace the fixed `peer-mac`/`peer-phone` CloudKit
   record names with per-device records (device UUID in the record name,
   role as a field), let the Mac hold several paired peers and punch toward
   each, and let PairingStore hold a list. Do this FIRST and only after
   M2/M3 hardware verification passes — it invalidates existing pairings.
2. **Client mode** — a macOS target (or one multiplatform target) reusing
   the phone's Home/Session/Approvals views; MacLink works as-is on macOS
   (drop the UIDevice name for Host name).
3. Explicitly NOT: exposing OpenCode's own web UI through the tunnel —
   that reintroduces the exposed-server model this product exists to avoid.
CloudKit rendezvous keeps it same-Apple-ID, Apple-devices-only; fine.

## Deliberately out of scope (for now)
- Full terminal (`/pty`) and file editor — later, behind capability flags
- Android — the CloudKit rendezvous is Apple-native; revisit only if the
  product proves out
- Other agents (Claude Code, Codex CLI) — the adapter seam is designed for
  them, but v1 ships OpenCode-only
- TURN-style relay for double-symmetric NAT — a failed punch reports itself
  honestly, as in Tomte
