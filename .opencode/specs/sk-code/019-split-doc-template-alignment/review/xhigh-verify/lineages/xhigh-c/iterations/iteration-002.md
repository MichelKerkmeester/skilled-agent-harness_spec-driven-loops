# Review Iteration 002

## Dispatcher

- Session: `fanout-xhigh-c-1783915428096-y929h9`
- Lineage: detached, generation 1, `lineageMode=new`
- Route: `mode=review`, `target_agent=deep-review`
- Stop policy: `max-iterations` (iteration 2 of 4)
- Budget profile: `scan`

## Dimension

`security`

## Files Reviewed

- Exact security-token and unsafe-guidance searches covered the 157 Markdown files currently matched by the six configured `**/*.md` scope globs.
- Direct evidence reads: `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:35-260`, `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:15-70`, `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:139-182`, `.opencode/skills/sk-code/code-webflow/references/shared/dev_workflow/common_commands.md:55-119`, and `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/owasp_prototype_and_safe_access.md:300-329`.
- Search classes: JavaScript-accessible session cookies, client-side authorization, secret handling, direct input execution, destructive shell guidance, user-input rendering, dynamic third-party scripts, and integrity/cross-origin controls.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The CSRF checklist labels a JavaScript-accessible session cookie as good guidance** -- `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:94` -- The example marks `document.cookie = "session=abc123; SameSite=Strict; Secure"` as `GOOD`. JavaScript cannot set `HttpOnly`, so a copied session-cookie pattern remains readable to injected scripts. The same document later calls a JavaScript-accessible session cookie bad and prescribes a server-side `Set-Cookie` with `HttpOnly` at lines 247-253, making the guidance internally contradictory. SameSite and Secure mitigate CSRF and transport exposure but do not close the XSS/session-theft boundary. Replace the good example with a server-side `Set-Cookie` example or explicitly make it a non-session, non-sensitive cookie.
   - Finding class: `instance-only`
   - Scope proof: The scope-corrected 157-Markdown search isolated this as the only positively labelled JavaScript session-cookie assignment; direct counterevidence in the same file confirms the intended server-side `HttpOnly` rule.
   - Affected surface hints: `["code-webflow security checklist", "session cookie guidance", "copy-paste security examples"]`

```json
{"type":"unsafe_session_cookie_guidance","claim":"The security checklist positively labels a JavaScript-set session cookie even though JavaScript cannot set HttpOnly and the same checklist later forbids JavaScript-accessible session cookies.","evidenceRefs":[".opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-98",".opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:247-258"],"counterevidenceSought":"The full cookie guidance in the same file was reread. SameSite=Strict and Secure provide real CSRF/transport protection, and lines 247-258 correctly require server-side HttpOnly cookies, but neither fact makes the positively labelled JavaScript session-cookie example safe against XSS.","alternativeExplanation":"The first snippet may be intended only to demonstrate the SameSite attribute rather than complete session-cookie creation, but the GOOD label and session cookie name make that limitation non-obvious and copy-pasteable.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the snippet is explicitly scoped to a non-sensitive demonstration cookie and no longer labels JavaScript session-cookie creation as production-safe."}
```

Compact skeptic/referee result: retained at P1 because the document's later correct rule disproves an intentional exception rather than curing the earlier copy-paste hazard; no P0 was assigned because this is guidance, not an active deployed session implementation.

### P2 Findings

1. **Production CDN-loader guidance omits integrity enforcement and accepts any caller-provided URL** -- `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:40` -- The production-tested pattern accepts an arbitrary `url`, assigns it to `script.src`, and labels version pinning plus error handling as good, but it neither restricts trusted origins nor sets `integrity`. An exact Markdown-scope search found several dynamic script examples and no integrity assignment. Version pinning improves stability but does not authenticate bytes returned by a compromised CDN or package path. Document the trusted-URL precondition and add an allowlist plus `integrity`/`crossOrigin` where providers expose stable hashes.
   - Finding class: `class-of-bug`
   - Scope proof: Exact searches across all 157 in-scope Markdown files found dynamic `script.src` examples in five references, one optional `crossOrigin` assignment, and no `integrity` assignment; the representative production-best-practice example was directly reread.
   - Affected surface hints: `["code-webflow third-party integration guidance", "dynamic script loaders", "CDN supply-chain hardening"]`

## Traceability Checks

- `spec_code` (core): **failed, carried forward without re-execution** -- iteration 1's active R3 mismatch remains open; the saturated correctness structural sweep was not repeated.
- `checklist_evidence` (core): **failed, carried forward without re-execution** -- the blocked validator-evidence approach was not retried.
- `feature_catalog_code` / `playbook_capability` (overlay): **pending** -- not executed in the security dimension; their strategy entries are marked blocked and must not be retried without a later protocol-resolution decision.
- Security evidence: **complete for this iteration** -- each active security finding has direct Markdown file:line evidence and the P1 received an in-iteration skeptic/referee pass.

## Integration Evidence

- `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-125` and `:235-260` were reviewed together to test the cookie guidance across the client/server trust boundary.
- `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:32-70` was reviewed as the named external-library integration pattern.
- `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:139-182` supplied counterevidence that path containment and secret handling are explicitly addressed.

## Edge Cases

- The config and prior strategy call the scope a 163-Markdown corpus, but the explicit configured `**/*.md` globs currently match 157 Markdown files. Six non-Markdown asset files account for the apparent difference. The explicit Markdown patterns were treated as the maximum scope; non-Markdown hits from an initial directory-level discovery search were discarded and produced no finding.
- The P1's SameSite/Secure attributes are valid CSRF and transport mitigations; severity rests on the contradictory positive label for a JavaScript-accessible *session* cookie, not on a claim that those attributes are ineffective.
- Structural-impact analysis was not applicable to a Markdown-corpus security review. Exact scope searches and direct reads supplied evidence.
- The memory trigger timed out; packet state and direct file evidence were sufficient, so semantic retrieval remained optional rather than a blocker.

## Confirmed-Clean Surfaces

- In-scope secret-handling guidance explicitly rejects hardcoded secrets and uses environment variables at `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:172-182`.
- The main Webflow security checklist explicitly requires server-side authorization on every request at `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:201-233`.
- XSS and direct-input execution examples consistently mark unsafe `innerHTML`, `eval`, `Function`, and `exec` usage as bad in the directly reviewed security references.
- The Markdown-scope search found no endorsed `rm -rf`, `sudo`, `chmod 777`, or pipe-to-shell instruction pattern.

## Ruled Out

- Endorsed hardcoded-secret guidance: ruled out by exact search plus the direct secret-management read.
- Client-side-only authorization as approved guidance: ruled out by the explicit server-verification requirement.
- Direct execution of user input as approved guidance: ruled out; all matched examples were negative demonstrations.
- Destructive shell bootstrap guidance in the Markdown scope: ruled out by exact search.

## Verdict

FINAL VERDICT: CONDITIONAL

No P0 was found. One new security P1, one new security P2, and the active iteration-1 P1 keep the review conditional; `hasAdvisories=true`.

## Next Focus

- Dimension: `traceability`
- Focus area: reconcile the explicit Markdown glob count with the 163-deliverable claim, then assess packet-to-corpus evidence without re-running blocked correctness approaches.
- Reason: security now has direct coverage of trust boundaries, unsafe examples, secret handling, destructive commands, and external-script loading.
- Rotation status: correctness and security complete; traceability is the next unchecked dimension.
- Blocked/productive carry-forward: retain exact scope searches and direct counterevidence reads; do not retry the saturated structural sweep or any strategy entry marked BLOCKED.
- Required evidence: governing packet claims, current `**/*.md` inventory evidence, and named integration/protocol applicability with exact file:line citations.

Review verdict: CONDITIONAL
