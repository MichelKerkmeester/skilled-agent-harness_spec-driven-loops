# Review Iteration 002

## Dispatcher

- Session: `fanout-confirm-c-1783921047347-ky9ry5`
- Lineage: detached, generation 1, `lineageMode=new`
- Route: `mode=review`, `target_agent=deep-review`
- Stop policy: `max-iterations` (iteration 2 of 4)

## Dimension

`security`

## Files Reviewed

- Exact security-pattern searches across the configured Markdown roots for JavaScript cookies, server cookie headers, dynamic script sources, SRI/host allowlists, unsafe input execution, sensitive browser storage, hardcoded secrets, and client-only authorization.
- Direct reads: `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-127,203-260`, `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:34-65`, `.opencode/skills/sk-code/code-webflow/references/performance/resource_loading.md:287-325`, `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:31-58`, `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/botpoison_and_finsweet.md:35-77`, and `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:168-182`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Prior-Finding Replay

- The earlier session-cookie contradiction is resolved at `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:91-100`: the positive client-set example is now a non-sensitive UI preference, and the text explicitly requires server-set `HttpOnly` session cookies. The later storage section remains consistent at lines 249-260.
- The earlier arbitrary CDN-loader issue is resolved at `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:38-59`: the pattern parses the URL, enforces HTTPS and an allowlisted host, and documents SRI/crossOrigin when a stable hash is known.

## Traceability Checks

- `spec_code` and `checklist_evidence`: active iteration-1 R3 mismatch carried forward without repeating the correctness scan.
- Security evidence: complete for the prior-remediation replay and adjacent high-risk guidance classes.

## Confirmed-Clean Surfaces

- Session cookies are consistently documented as server-set and `HttpOnly`; JavaScript-set cookies are scoped to non-sensitive values.
- The production-labelled dynamic CDN loader validates protocol and origin and documents SRI.
- Other inspected dynamic loaders use fixed source constants or a trusted-code utility parameter; no user-controlled source path is claimed.
- Unsafe `eval`, `Function`, `exec`, unsanitized `innerHTML`, sensitive localStorage, and client-only authorization examples are explicitly marked bad and paired with safer guidance.
- Secret guidance reads from environment variables rather than embedding credentials.

## Ruled Out

- Positively labelled JavaScript session-cookie creation.
- Production guidance that injects an unvalidated caller URL.
- Endorsed hardcoded secrets, client-only authorization, direct user-input execution, or sensitive browser storage.
- A new finding for the generic performance `loadScript(src)` utility: its example call is a hardcoded trusted URL and no path from untrusted input is shown.

## Verdict

No new security finding was confirmed. The active correctness P1 keeps the lineage conditional; the prior P2 remains advisory.

## Next Focus

- Dimension: `traceability`
- Focus: execute the two core protocols against current evidence and classify the two applicable overlays.

Review verdict: CONDITIONAL
