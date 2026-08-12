# Privacy modes

The privacy router evaluates metadata before any transport is called. It stores
privacy classes, reason codes, dates, counts, and digests—not prompts,
transcripts, generated text, credential values, or raw provider responses.

## Local-only

- Allow only `local-offline` and explicitly approved `local-networked` records.
- Set egress consent to `false`.
- Use `fallbackPolicy.mode: 'none'` unless every fallback is also local and named.
- Verify the transport call list contains zero hosted provider identifiers.

## Hosted

- Name the hosted provider and model; do not route by an open-ended alias.
- Set egress consent to `true` only after operator approval.
- Require fresh retention and training-use facts and a credential reference.
- Pass references such as `env:NAME`, `keychain:NAME`, or `managed:NAME`; never
  pass or log the referenced value.

## Mixed

- Name local and hosted candidates separately.
- Use an explicit ordered fallback list; ranking does not imply fallback.
- Crossing privacy classes requires egress consent and an intentional
  `preservePrivacyClass: false` policy.
- Any missing, unknown, contradictory, or stale fact fails closed to the exact
  original. There is no hidden hosted fallback.

Telemetry and release evidence must remain content-free. Run the privacy canary
gate before release and stop if any canary is present in an export or manifest.
