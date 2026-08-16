# Checklist — Normalized Pi Image Bridge and Redacted Transcript

- [ ] Pi receives ordered normalized JPEG/PNG image blocks for `prompt`, `steer`, and `follow_up` and never receives a host path or raw source object.
- [ ] Image-only turns submit an empty text message while preserving the ordered image set.
- [ ] Final ownership, readiness, expiry, active-model capability, plan policy, and expected revision checks occur before normalized bytes are loaded or Pi is invoked.
- [ ] Stale, mismatched, expired, replayed, text-only-model, and plan-policy-invalid sets cause no Pi invocation.
- [ ] Positive acknowledgement deletes host bytes and publishes only fixed redacted attachment cards.
- [ ] Ambiguous acknowledgement becomes `delivery-unknown` and cannot auto-resend.
- [ ] Durable DTOs, sync frames, exports, push text, logs, SQLite, and Pi-visible transcript data contain no pixels, base64, filename, path, hash, URL, EXIF, OCR, provider payload, or decoder error.
- [ ] The browser submission DTO remains reference-only and contains no image data.
- [ ] The pinned Pi/provider persistence and echo probe passes; if it fails, the host media capability remains disabled.
- [ ] Echo suppression occurs before the framed relay path and the 1 MiB event-record limit is verified.
- [ ] Workspace/session JSONL identity remains unchanged by image delivery.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test` exits 0.
- [ ] `npm run test:web` exits 0.
- [ ] Focused relay prompt, transcript, redaction, security, and pinned-Pi probe suites exit 0.
- [ ] A real CDP run uses exactly 390 CSS px in light and dark themes with media disabled or a redacted-card fixture.
- [ ] The CDP evidence shows no raw image and no regression in existing text layout.
- [ ] Required security review signs off the host-to-Pi/provider boundary before real-image end-to-end testing.

