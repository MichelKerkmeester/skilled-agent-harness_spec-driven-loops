# 008-inbound-media — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.

Feature: **Preview media/screenshots that pi sends, inline** — pi surfaces an image/screenshot into the transcript as a redacted INBOUND content block, previewed inline as a card and full-screen (the inbound analog of F5, reusing F6's viewer), designed security-first.

Mobbin (platform ios) returned **zero** results for every query — `inline image message`, `screenshot in chat`, `AI image response`, `image thumbnail chat bubble`, `chat image bubble`, `image in chat conversation` — so no mobbin.com URL is cited. All screens below are real Refero (refero.design) records returned by `refero_refero_search_screens` for those queries plus `image message chat`, `AI generated image in chat`, `image preview in chat`, `image attachment message conversation`, `ChatGPT image message chat`, `Grok image chat`, `Gemini AI image chat`, `screenshot image message`, and `sent image chat bubble`. No URLs are fabricated.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| ChatGPT | https://refero.design/screens/6b970686-78ea-485e-84fe-200e2f50db29 | **Inline image thumbnail attached to a message bubble**: a user message "Add one more person" carries a small thumbnail labeled "Selection" — the canonical inbound-image-inside-a-bubble layout for an AI chat. |
| ChatGPT | https://refero.design/screens/761817c5-2305-4b7a-8b00-13cc0f57e926 | **Image embedded in a chat message**: message bubble "Describe this image…" with the image placed in the same message — an inbound image that immediately anchors a follow-up instruction. |
| ChatGPT | https://refero.design/screens/5b59a495-bbe4-476f-a4ff-6cf948671f5e | **Three rounded-corner thumbnails + text bubble** ("Generate image based on this photo…") — the multi-image inbound card row that drives the AI's response. |
| Gemini | https://refero.design/screens/a47b8f97-fee6-4851-ac5e-0cfd89ec232a | **Complete inbound→response flow in one screen**: user bubble with text plus an image thumbnail below it, then the assistant's answer bubble beneath — proves the "image card + reply" vertical rhythm. |
| Gemini | https://refero.design/screens/abb2fac3-b98c-41c7-8e18-40c73745868a | **Awaiting/generating state**: "Creating your image with Imagen 3…" over a partial, rounded-corner image — the exact placeholder state to show while an inbound image is still arriving. |
| Gemini | https://refero.design/screens/c1cec7a8-7b2f-4b91-816a-d22a42b39197 | **Dark-mode prompt bubble with a blurred embedded photo**: real precedent for rendering an inbound photo blurred/redacted inside the message rather than raw — directly useful for Pi Remote's sanitization posture. |
| Microsoft Copilot | https://refero.design/screens/32747915-f487-4df1-9e0e-8b928d20d368 | **Inbound image card + caption**: rectangular rounded-corner image at the top, Copilot's textual description of that image directly below — image-as-message with prose under it. |
| Microsoft Copilot | https://refero.design/screens/deab720c-3405-4e08-a85e-2f409237e053 | **AI response text plus a horizontal row of generated image cards** — how multiple images are laid out in the message flow after an AI response. |
| Grok | https://refero.design/screens/615780dd-1aa6-4533-9797-d9a1995e22cc | **Small rectangular rounded image thumbnail right-aligned in the Grok chat** alongside a text bubble — inline thumbnail mixed into a prose conversation. |
| Grok | https://refero.design/screens/a4d78315-7fe5-495c-9bd3-97aa7e7ca80b | **Two watercolor images displayed side-by-side with rounded corners** inside the chat — multi-inbound-image layout for a pair of screenshots. |
| Dot | https://refero.design/screens/065a2b58-b2c6-40bc-bb79-10cbf82c3036 | **Inbound photo + question**: a small pancake thumbnail at top-right with the user bubble "How can I cook this?" below it — exactly the "pi sends a screenshot + asks about it" interaction. |
| Genie | https://refero.design/screens/5d10059c-f157-493a-88cf-7ec2968e2df9 | **Full-width hero image card** with a very large corner radius (≈28–36px) and minimal margins in a conversation — the media-card visual for a single prominent inbound image. |
| WhatsApp | https://refero.design/screens/1a8df89e-6916-4456-bff1-a2840e421716 | **Minimalist full-screen media viewer** for a shared photo: solid white surface, generous negative space, image centered, header framing — the tap-to-open full-screen destination for an image message. |
| XChat | https://refero.design/screens/47c9a6db-982c-4105-a159-4b82594aa145 | **Large rounded photo cards as message bubbles** in a 1:1 thread (iMessage-style) — shows full-bleed image messages carrying the whole visual weight of the conversation. |

## Reference-backed UI/UX direction

Concrete direction for building inbound media preview in Pi Remote's ink-on-parchment system (read-only posture — the image is the relay's authorized, immutable, redacted artifact, never edited on-device), grounded in the screens above.

1. **Inbound image is a message card, not a raw image dump.** ChatGPT (6b970686, 761817c5), Copilot (32747915) and Dot (065a2b58) all render the inbound image *inside* the message flow as a rounded-corner card attached to its bubble, with prose below or beside it. In Pi Remote: a new redacted INBOUND image content block (opaque artifact id + revision + digest) renders as a parchment card with a hairline ink rule, fixed corner radius (~12–16pt), max-width ≈72% of the reading column (matching existing bubbles), and a "from pi" eyebrow + timestamp so the source is explicit in the transcript. No optimistic render — the card only fills when the relay's bytes pass size/type/digest validation.

2. **Thumbnail sizing and multi-image layout.** Single image → one square 1:1 thumbnail card (≈ 220–260pt side, Genie 5d10059c's full-width hero reads as the max expression). Multiple inbound images → ChatGPT's horizontal scrollable strip of square rounded thumbnails (5b59a495, 6b970686) or Grok's side-by-side pair (a4d78315): a horizontally scrolling 1:1 thumbnail row with an ink chevron affordance, each thumbnail a ≥44pt tap target.

3. **Awaiting / delivery states.** Gemini's "Creating your image with Imagen 3…" over a partial image (abb2fac3) is the placeholder precedent. For Pi Remote's host-authoritative posture: while the relay is still delivering the redacted image, the card shows its metadata header (type badge `image`, size, digest-stub) with a muted "awaiting image…" placeholder in the image well. On delivery or validation failure the card renders a read-only reason line ("image withheld — could not verify") instead of bytes — never a retry that mutates state; re-open is user-initiated.

4. **Tap-to-open full-screen viewer (reuse F5/F6).** WhatsApp's shared-photo viewer (1a8df89e) and XChat's photo cards (47c9a6db) confirm the inline-card → full-screen-modal pattern. Pi Remote: tapping the thumbnail opens the existing F6 full-screen viewer on an ink/near-black backdrop — one back/close affordance, image metadata in the header, pinch-to-zoom + pan, and a single **Copy image** action (reads the authorized bytes by artifact id). No save-to-gallery, edit, or share — the read-only contract is preserved.

5. **Blur/redaction as a real, seen pattern.** Gemini's blurred photo inside the prompt bubble (c1cec7a8) is concrete evidence that inbound media can be presented obfuscated *within* the message flow. Pi Remote makes this the security default: relay-sanitized bytes only (never host paths), and images that fail digest/type/size checks surface as a redacted placeholder — blur-or-withhold rather than render-raw. This is the inbound-side expression of the existing redaction posture.

6. **Image + text arrive together.** Dot (065a2b58) and ChatGPT (761817c5) show the inbound image pairing with a short message ("How can I cook this?", "Describe this image…"). Pi Remote's content block should carry an optional caption/text slot so pi can attach an explanation to a screenshot; the text renders as a serif ink line beneath the thumbnail within the same message card, keeping the pair atomic for the transcript.

7. **Palette, spacing, a11y for ink-on-parchment.** The beige/warm-white family the references cluster on (Genie 5d10059c warm white, Grok's #FAF9F6, Dot's off-white) matches Pi Remote's parchment (#F5F3EB-family) with near-black ink. The viewer uses a white/parchment sheet with the image centered and generous negative space (WhatsApp 1a8df89e). Accessibility: announce "image, from pi" on arrival via VoiceOver (`aria-live="polite"`), surface the relay caption as the accessibility label (OCR is out of scope), keep ≥4.5:1 contrast for badges/eyebrows, and reuse F6's pinch-zoom/Dynamic Type behavior in full-screen.

8. **Read-only interaction set, framed as a message artifact.** Every reference places the image inside the assistant conversation rather than as a user-editable asset. Pi Remote keeps the surface read-only by construction: only open-full-screen, close, and copy (image bytes fetched read-only via the opaque artifact id). The card's "from pi" eyebrow + time + digest-stub make the provenance legible, so the user always knows the image is pi's relay-authorized output — not a host file.

## Coverage gaps

- **Mobbin returned zero results** for every 008 query (including the control-style "inline image message"), so no mobbin.com URLs are cited; all 14 cited screens are Refero records — consistent with the 005/007 runs.
- **No Pi app screens.** The reference set contains no captures of the Pi app itself (Pi is not on Refero/Mobbin for this feature area).
- **No Manus, Perplexity, or Claude inbound-media screens.** Claude queries returned only text/onboarding chats (e.g. 4f52f3db, 171ff368); Manus and Perplexity did not surface in any query; the strongest inbound-image evidence comes from ChatGPT, Copilot, Gemini, Grok, Dot, and Genie.
- **No artifact/relay security model.** No consumer screen shows an image delivered under an opaque artifact id + revision + digest with redaction-on-failure — that delivery/sanitization contract is Pi Remote-specific and has no public-app reference; only the *blur-as-redaction* presentation (Gemini c1cec7a8) has a real precedent.
- **No screen-reader (VoiceOver) capture** of an image message, and no reference for a dedicated "image withheld / failed verification" error card (reason-line redaction state is inferred from the read-only posture, not from a real screen).
