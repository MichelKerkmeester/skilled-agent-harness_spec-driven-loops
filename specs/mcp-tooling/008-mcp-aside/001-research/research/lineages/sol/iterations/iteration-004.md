# Iteration 4: Security, Privacy, Concurrency, and Unattended Operation

## Focus

Define the operating envelope for exposing a logged-in browser to CLI and MCP callers. This pass distinguishes Aside's product controls from protections the future skill must enforce itself.

## Actions Taken

1. Re-read lineage state and verified unused iteration paths.
2. Retrieved Aside's password-manager, routines, provider, task, security, and privacy documentation.
3. Reviewed Aside's current Terms and Privacy Policy for prompt-injection, model-visible data, third-party services, and retention boundaries.
4. Correlated security conclusions with profile, routine-overlap, daemon-health, and browser-action changelog entries.

## Findings

1. Aside has granular agent controls for sandbox, readable/writable roots, reads/writes outside roots, tool rules, browser rules, and network rules. Values are Allow/Ask/Deny, with Deny taking precedence; per-task rules layer over agent defaults. However, the docs do not state how a foreign MCP client maps to an Aside task permission mode. [SOURCE: https://docs.aside.com/help/security]

2. The safe skill default is read-only inspection plus explicit allowlisted actions. `Guard` is Aside's default for new tasks, while Full access expands filesystem reach. Because `aside mcp` permission inheritance is undocumented, the caller must not assume the browser's UI defaults protect MCP/REPL calls; phase 2 needs its own action taxonomy and confirmations. [SOURCE: https://docs.aside.com/help/security] [INFERENCE: undocumented MCP-to-task permission mapping]

3. Credentials remain separated from the model in normal password-manager flows: the agent can request a login action, but raw passwords are autofilled only after URL and policy checks. Access policies are Always allow, While unlocked, or Never, with per-item overrides. [SOURCE: https://docs.aside.com/help/password-manager]

4. Unattended authentication has hard human boundaries. MFA, passkey approval, CAPTCHA, identity verification, and vault unlock can require a visible user step. Incognito sessions cannot use password-manager access at all. Therefore unattended mode is viable only for workflows whose sessions are already authenticated and whose actions do not cross these gates. [SOURCE: https://docs.aside.com/help/password-manager]

5. Sensitive actions are approval-bearing. Aside calls out payments, posts, messages, account changes, deletion, publication, and other irreversible actions for confirmation/review. A skill must classify these as stop-and-request-user actions even if a raw REPL or MCP call could technically execute them. [SOURCE: https://docs.aside.com/help/password-manager] [SOURCE: https://aside.com/policy/terms]

6. Prompt injection is an acknowledged residual risk. Aside's Terms state that webpages, documents, and emails may contain hidden or visible instructions and that the service may not catch all of them. The mcp-aside mode must treat every page/tool result as untrusted data, refuse instruction-following from page content, and isolate read/act phases. [SOURCE: https://aside.com/policy/terms]

7. “Local-first” does not mean all task data stays local. Model-visible context can include prompts, tool results, selected browser snapshots, screenshots, files, and responses; hosted model providers receive the selected context needed for a task. Logs and support output must never include raw cookies, credentials, private DOM, screenshots, or network payloads by default. [SOURCE: https://aside.com/policy/privacy]

8. Regular task history, transcripts, screenshots, artifacts, token usage, and file-change summaries live in the local Aside data directory. Browser/password sync, analytics, hosted models, account systems, and other enabled services can use server-side processors. Analytics defaults on in the product privacy settings. Integration documentation must avoid promising a purely local data path. [SOURCE: https://docs.aside.com/help/privacy] [SOURCE: https://aside.com/policy/privacy]

9. Browser profile identity is a hard correctness and security boundary. Current changelog behavior keeps tasks/routines attached to their original profile and blocks browser actions when profile verification fails. Preflight should verify the selected account/profile and stop on mismatch rather than falling back to another profile. [SOURCE: https://docs.aside.com/changelog/components.md]

10. No public contract guarantees concurrent MCP clients against one browser profile. Aside routines skip overlapping runs, and profile/task state is explicitly serialized and verified. The conservative design is one active mutating Aside session per account/profile, while read-only calls may be parallelized only after a concurrency probe proves isolation. [SOURCE: https://docs.aside.com/help/automation] [SOURCE: https://docs.aside.com/changelog/components.md] [INFERENCE: overlap avoidance and profile-bound state]

11. Long-running unattended operation still depends on local process health. `aside mcp` now survives idle periods, but daemon outages, daemon version mismatches, stale daemon replacement, and account refresh failures are live failure modes. The skill needs separate diagnostics for CLI missing, browser/daemon unavailable, signed-out account, profile mismatch, MCP handshake failure, and approval wait. [SOURCE: https://docs.aside.com/changelog/components.md]

12. A safe unattended policy is therefore narrow: preflight CLI/account/daemon/profile; choose read-only or Guard-like scope; serialize per profile; permit public navigation/inspection/screenshot only when output paths are controlled; stop for credentials/MFA/approval/sensitive writes; redact tool output; and time out waiting states with resumable session metadata. [INFERENCE: synthesis of findings 1–11]

## Ruled Out

- “Local stdio means trusted”: stdio removes remote transport exposure but still grants a caller access to logged-in browser state.
- “Local-first means no data leaves the device”: hosted model context and enabled sync/analytics are documented exceptions.
- Fully unattended sensitive-account automation: human approvals and authentication challenges are explicit product boundaries.
- Multi-client mutation on one profile: no isolation guarantee is published.

## Dead Ends

- Public docs do not define how `aside mcp` selects task permission mode or whether it creates a visible task record. This must be verified interactively before phase 2 claims parity with UI tasks.

## Edge Cases

- Ambiguous input: authorization exists at MCP process, Aside account, browser profile, site session, password-vault, agent-rule, and user-approval layers.
- Contradictory evidence: marketing says data is local by default, while the Privacy Policy documents hosted-model and sync flows. The policy is more specific; “local-first” is retained with explicit exceptions.
- Missing dependencies: concurrency and permission-inheritance behavior require a live multi-client test.
- Partial success: operating controls are clear; two MCP-specific behaviors remain probe-required.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/security]
- [SOURCE: https://docs.aside.com/help/password-manager]
- [SOURCE: https://docs.aside.com/help/privacy]
- [SOURCE: https://docs.aside.com/help/tasks]
- [SOURCE: https://docs.aside.com/help/automation]
- [SOURCE: https://docs.aside.com/help/ai]
- [SOURCE: https://docs.aside.com/changelog/components.md]
- [SOURCE: https://aside.com/policy/terms]
- [SOURCE: https://aside.com/policy/privacy]

## Assessment

- New information ratio: 0.96
- Questions addressed: Q4 and Q5
- Questions answered: Q4, with explicit live probes for MCP permission inheritance and multi-client isolation

## Reflection

- What worked and why: policy and help-center sources exposed the different identity, permission, credential, and data-processing layers; changelog evidence turned them into concrete failure modes.
- What did not work and why: no MCP-specific permission or concurrency contract is published.
- What I would do differently: phase 2 should encode these unknowns as preflight failures and manual-test cases, not prose caveats only.

## Recommended Next Focus

Q5 — Inspect this repository's Chrome DevTools skill/UTCP conventions, compare capability and lifecycle patterns, and produce a concrete CLI-primary + Code Mode MCP fallback blueprint without editing implementation files.

## Scope Violations

- No account, browser profile, vault, permission setting, analytics setting, or live site session was inspected; the research used public documentation only.
