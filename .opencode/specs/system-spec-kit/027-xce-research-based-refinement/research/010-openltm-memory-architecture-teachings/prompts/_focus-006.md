
# YOUR NARROW FOCUS — iteration 006 of 10: Secret redaction before write
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/secretsScrubber.ts` — the redaction patterns (API keys, JWTs, AWS ARNs, etc.) and replacement
- `packages/openltm-core/src/db.ts` — where `learn()` invokes the scrubber (write path ordering)
- any `packages/openltm-core/src/__tests__/*` covering scrubbing/redaction
Focus on: what is matched, how, and at what point in the write path. Contrast with our memory write safety — do we redact secrets before persisting a memory? If not, this is a safety teaching. Assess false-positive/over-redaction risk.
