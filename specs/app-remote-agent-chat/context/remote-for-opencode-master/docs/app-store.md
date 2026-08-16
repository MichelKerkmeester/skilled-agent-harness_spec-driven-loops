# App Store readiness

Audited 2026-08-03. The iPhone app is the submission; the Mac companion
ships via Homebrew/dmg and is **not** an App Store product (it isn't
sandboxable — it spawns the OpenCode CLI — and it self-updates via
Sparkle, which App Store apps may not do).

---

## ⚠️ Blocking risk: the app's name

*(Historical — resolved by two renames: "OpenCode Go" → "Go for OpenCode"
on 2026-08-03 for the 5.2.1 risk below, then → "Remote for OpenCode" on
2026-08-04 because OpenCode themselves ship a product called "Go". The
"X for OpenCode" pattern this section recommends is retained.)*

**"OpenCode Go" contains another project's name.** Two separate problems:

1. **App Review Guideline 5.2.1 (Intellectual Property).** Apple rejects
   apps whose name or icon uses a third party's trademark in a way that
   could suggest affiliation. A disclaimer in the README is not visible in
   App Store search results, where the name does its work.
2. **OpenCode's own request.** Their repository asks third-party products
   using "OpenCode" in their names to state clearly that they are
   unaffiliated. We do state it — but complying with their request does
   not resolve Apple's rule, which is about consumer confusion, not the
   upstream project's permission.

**Recommendation: rename before submitting.** A distinct product name with
"for OpenCode" *in the subtitle or description* rather than the name is the
pattern that passes review — the name is yours, the compatibility claim is
descriptive. The mark itself needs no change: `OC/GO` reads as an
abbreviation of whatever the product is called.

If the name stays, the realistic outcome is a 5.2.1 rejection, and the
remedy at that point is the same rename plus another review cycle.

This is the single highest-risk item in this document. Everything else is
mechanical.

---

## Encryption / export compliance

`ITSAppUsesNonExemptEncryption` is currently `false`.

**Verify this before submitting.** The app performs genuine end-to-end
encryption of user content (Curve25519 key agreement, ChaCha20-Poly1305
sealing) using CryptoKit. Apps using *only* encryption provided by the
operating system are generally exempt, and CryptoKit is Apple-provided —
but the exemption turns on what the encryption is *for*, and "protecting
arbitrary user content in transit" is a stronger claim than
"authentication only".

Options, in order of preference:
1. Confirm the exemption applies and keep `false` (most likely correct,
   but confirm rather than assume — this is a legal determination, not an
   engineering one).
2. Set `true` and file the annual self-classification report with BIS.

France also requires a separate declaration for apps distributed there.

---

## Done

- [x] **Privacy manifest** (`Phone/PrivacyInfo.xcprivacy`) — mandatory
      since 2024. Declares no collection, no tracking, and reasons for the
      two required-reason APIs touched (UserDefaults `CA92.1`, file
      timestamps `C617.1`). Verified present in the built bundle.
- [x] **Purpose strings** for every gated capability: local network,
      camera, microphone, speech recognition, Face ID. All say what the
      feature does *and* where the data goes.
- [x] **Third-party notices** (`NOTICE.md`) — Sparkle's MIT text
      reproduced as its licence requires; OpenCode's noted although not
      bundled; SF Symbols usage constrained to interface glyphs.
- [x] **No bundled fonts** — the wordmark is generated geometry, so no
      font licence applies.
- [x] **Sparkle is Mac-only.** Confirmed: the iOS target does not link it.
- [x] **No analytics, no telemetry, no third-party SDKs.** The only
      network destinations are the user's own Mac and their own iCloud.

## Before submitting

- [x] **Rename** — "Go for OpenCode" (2026-08-03), then "Remote for
      OpenCode" (2026-08-04): OpenCode ships their own product named "Go",
      so the first rename traded a trademark collision for a product-name
      collision. Same "X for OpenCode" shape, no new 5.2.1 exposure.
- [ ] **Propagate the rename into App Store Connect** — the app record
      still says "Go for OpenCode". Editable while nothing is submitted:
      App Information → Name, plus every metadata field that repeats the
      name (subtitle is name-free and survives; description and
      promotional text mention the name and need the edit).
- [x] Subtitle: "Steer your Mac's coding agent" — the compatibility claim
      lives in the subtitle and description, where it is descriptive,
      rather than in the name.
- [ ] **Confirm export-compliance answer** (see above).
- [x] **`aps-environment` per configuration** — Debug uses
      `Phone/Phone.entitlements` (development), Release uses
      `Phone/Phone.release.entitlements` (production). Verified the build
      setting resolves correctly per config.
      **Still to verify at export:** a locally archived build signed with a
      *development* profile reports `aps-environment: development`
      regardless, because entitlements are intersected with what the
      profile grants. The production value only appears once exported with
      `method: app-store` against a distribution profile — check it there,
      not in the archive.
- [x] **CloudKit container deployed to Production** (2026-08-03).
      `iCloud.com.timwilliams.opencodego` — note the team is Tim Williams
      (7NHJT99NX8), not the console's default team, and the account also
      holds `.household` and `.pairspike` containers with their own
      undeployed changes; deploy the wrong one and you ship someone else's
      schema.

      Deployed: create `Attention` (10 fields) and `DevicePeer` (14), their
      indexes (12 and 18), and the standard `_world`/`_icloud`/`_creator`
      role updates. All creates, no deletes. Both types were checked
      against the source first — `Attention.swift:16` and
      `Pairing.swift:294` — because production schema is additive-only and
      a record type deployed by mistake can never be removed. Verified by
      loading the Production environment directly rather than trusting the
      success dialog.

      **Consequence worth knowing:** schema deploys, *records* do not.
      Existing pairings live in the Development environment and will not
      exist in Production, so a TestFlight or App Store build starts with
      no paired devices and must pair fresh.
- [ ] Screenshots for the 6.5" slot — 4 were uploaded, but they show the
      "GO FOR OPENCODE" wordmark on the home screen and must be re-captured
      from a post-rename build before submitting.
- [ ] **App previews** — encoded and waiting at
      `~/Downloads/goforopencode-previews/`, but the recordings predate the
      rename (old wordmark on screen) and need re-recording, re-encoding
      with the same rules below, and then dragging into
      App Store Connect by hand. ASC's uploader accepts a programmatic
      file assignment and then silently discards it, so this step cannot
      be automated from the browser.

      Source recordings are 60fps HEVC at 1206x2622, which is valid for
      none of it. Each preview is re-encoded to H.264, 30fps, 1242x2688 —
      scaled to width and cropped 12px of height, so nothing is stretched.

      Duration is the constraint worth remembering: previews must be
      **15-30s**. `diff_viewer` and `coding_session` were over and are
      trimmed; the pairing recording was *under*, at 10.9s, and shorter
      still once Control Center was cut at 9.1s. It holds its final frame
      to reach 15.2s. `01-pairing-slowed.mp4` is the same footage eased to
      0.72x with a 3s hold instead of 6.2s of freeze.
- [ ] Support URL → the GitHub repo; Marketing URL and Privacy Policy URL
      were entered as `https://goforopencode.com` /
      `https://goforopencode.com/privacy` and need updating to
      `remoteforopencode.com` once that domain is live (the old URLs keep
      resolving meanwhile — same distribution). The Support URL follows the
      GitHub repo rename. Category is Developer Tools.
- [x] **Open source stated on the product page** — a description section
      and the promotional text. Both name the **PolyForm Noncommercial**
      licence rather than saying "open source" unqualified: PolyForm
      Noncommercial restricts commercial use, so it is source-available
      and *not* OSI-approved. Saying "open source" with the licence named
      in the same sentence is honest; saying it alone would be
      open-washing, which this audience notices.
- [ ] Review-notes text explaining that the app **requires a Mac running
      the companion** to do anything. Without a demo path, a reviewer sees
      a pairing screen and nothing else — this is the second most likely
      rejection after the name. Consider either supplying a demo video, or
      a review-mode build with a canned transcript.
- [x] **Age rating** — every answer is None/No, giving a calculated **4+**
      (172 countries; AL Brazil, ALL Korea, 00+ Vietnam), with age category
      "Not Applicable". Two answers were checked against the code rather
      than assumed: there is no `WKWebView`/`SFSafariViewController`
      anywhere, so "Unrestricted Web Access" is genuinely No, and Apple
      defines "Messaging and Chat" as *users communicating with one
      another* — this app's chat is with an agent on the user's own Mac,
      so it is No despite the chat interface.
- [x] **Content Rights** — "No, it does not contain, show, or access
      third-party content." The app ships no third-party media; it renders
      the user's own code and output generated under the user's own
      provider account. Bundled *code* dependencies are not what this
      question covers.
- [x] **Pricing** — Free ($0.00) in all 175 countries, availability "All
      Countries or Regions". Free matches what the website already
      states publicly and needs no Paid Applications agreement.
- [ ] **Confirm export-compliance answer** in App Store Connect (see the
      encryption section above). The build processed without Apple asking
      for encryption documentation, which is consistent with the exemption
      `ITSAppUsesNonExemptEncryption: false` claims, but that is not the
      same as the determination having been made.
- [x] **App Privacy questionnaire** — answered "No, we do not collect
      data from this app" and published; the product page now shows **Data
      Not Collected**. This is a separate requirement from the
      privacy-policy URL, which does not satisfy it.

      The answer is defensible and consistent with everything already
      shipped: no backend, no analytics, no third-party SDKs, and
      `PrivacyInfo.xcprivacy` already declares no collection. Apple's
      definition turns on data *we* can access — prompts and code go only
      to the user's own Mac, and pairing records live in the user's own
      CloudKit private database, which the developer cannot read. Answering
      "yes" would have contradicted the shipped manifest. Responses are
      editable and re-publishable if that ever stops being true.

## Uploading a build: error 90129

**`CFBundleName` must be set explicitly in `project.yml`.** Unset, it
falls through to `$(PRODUCT_NAME)`, which is the *target* name — `Phone`
— and App Store Connect rejects the upload:

> 90129: The bundle uses a bundle name or display name that is already
> taken.

`Phone` is one of Apple's own apps, so the name is reserved. Setting
`CFBundleDisplayName` alone is not enough; both keys are checked.

What makes this expensive is *where* it fails. The rejection happens
during processing, **after** the upload completes, so Xcode reports a
successful upload and the build simply never appears in TestFlight. The
only trace is TestFlight → Build Uploads, where it shows as **Failed** —
that list is the first place to look whenever a build goes missing, not
the Builds list, which only ever shows successes.

Two 1.0 (1) uploads were lost to this on 2026-08-03 before the cause was
found. `CURRENT_PROJECT_VERSION` was bumped to `2` afterwards, since a
failed upload can still hold its build number.

The `.app` is still named `Phone.app` — that is `PRODUCT_NAME` and Apple
does not check it, so renaming the product is optional.

## The real blocker is not paperwork

**Nothing has been verified on a device beyond LAN pairing and a typed
prompt.** Built but never run against real hardware:

- the hole-punched path — the product's entire "from anywhere" claim
- push, including approve-from-notification
- attachments, camera, dictation
- Plan mode, todos, working-tree review, slash commands

Shipping the headline feature without once confirming it works is the
kind of thing that produces one-star reviews rather than a rejection,
which is worse. **The order that makes sense: device test pass →
TestFlight → submit.** TestFlight is also the cheapest way to find out
whether the production CloudKit container is actually configured, since
that failure is invisible until a build runs outside the development
environment.

## Not blocking, worth knowing

- **Local Network permission** appears on first pairing. The purpose
  string explains it, but the pairing screen should too — a denied prompt
  looks like a broken app.
- **Background execution**: the app deliberately does not request
  background modes. Turns survive backgrounding because the *Mac* keeps
  working and the phone resumes — no background entitlement needed, which
  is also one fewer review question.
