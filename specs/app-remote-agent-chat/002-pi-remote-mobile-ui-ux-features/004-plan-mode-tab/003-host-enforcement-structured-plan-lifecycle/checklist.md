# Checklist — Phase 2 — Host enforcement and structured plan lifecycle

- [ ] Every unclassified mutation-capable tool is denied in Plan, including extension tools, MCP tools, and shell control-token variants.
- [ ] A structured plan event produces a bounded artifact, while assistant prose alone never produces `Plan ready`.
- [ ] Plan feedback invalidates the old artifact and disables its Execute action before a replacement artifact is accepted.
- [ ] Execution restoration failure leaves Plan restrictions active and publishes only `Plan safety could not be verified` without sensitive details.
- [ ] `/plan`, `/plan on`, `/plan off`, and `/plan execute` are rejected before host prompt submission and do not appear in the phone command catalog.
- [ ] Internal control events are absent from transcript blocks and model-visible prompts.
- [ ] Host/relay security review approves the default-deny classifier, shell allowlist, artifact/token lifecycle, invalidation rules, and restoration failure path before Phase 4 Execute exposure.
- [ ] `npm run typecheck` passes.
- [ ] `npm test -- extensions/pi-remote-plan/tests apps/pi-remote-relay/tests packages/pi-rpc-protocol/tests` passes.
- [ ] The fixture emits Build, Plan, plan-ready, executing-plan, superseded, and extension-error states and produces true `390px` CDP screenshots in light and dark mode for Plan and extension-error.
- [ ] The scoped phase diff contains only the intended host, relay, prompt/catalog, redaction, and test changes.

