---
title: "Implementation Plan: MagicPath manual and authentication"
description: "Declare the read-only surface against the installed CLI, resolve the token through the existing loader, and observe both the credentialed and uncredentialed paths."
trigger_phrases:
  - "magicpath manual plan"
  - "magicpath auth wiring"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MagicPath manual and authentication

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON configuration plus TypeScript executed through Code Mode |
| **Framework** | `@utcp/cli`, with secrets resolved by the configured dotenv loader |
| **Storage** | The untracked environment file holds the token; nothing else persists |
| **Testing** | Observed calls in both credential states |

### Overview

The command list comes from the installed build, not the published readme. Read-only commands become tools; the mutating family is decided explicitly. The token is referenced, never written.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The authoritative surface is captured from `magicpath-ai --help`, not from `info -o json`, which under-reports it
- [x] The version question is settled: upgraded to 2.6.1
- [ ] The existing secret-resolution convention is read from a registered manual that uses it

### Definition of Done
- [ ] A read-only tool returns real account data through Code Mode
- [ ] The same tool without a credential names the missing authentication
- [ ] The mutation boundary is readable from the config alone
- [ ] No tracked file contains a token
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Separation by consequence. Reading and writing are different kinds of act, and the registration says so, so an agent choosing a tool sees the difference before it calls one.

### Key Components

- **Read-only surface**: the discovery, inspection and context commands, each requesting structured output.
- **Mutating family**: registered separately or withheld, per the recorded decision.
- **Credential reference**: the token named through the established convention and resolved at call time.
- **Refusal path**: what the CLI does with no credential, observed rather than assumed.

### Data Flow

Code Mode resolves a tool to its command template, the plugin substitutes arguments and environment, the CLI authenticates from its stored session or the token, and structured output returns to the caller. The credential enters at exactly one hop and is never written to a tracked file.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Settle the surface
Capture the installed build's command list and decide the version question. Writing tools against a readme that describes a build this machine does not have is the failure this stage exists to prevent.

### Phase 2: Register
Declare the read-only tools, then act on the mutating decision. Wire the credential last, so a failure during registration cannot be confused with a credential problem.

### Phase 3: Observe both states
Call with a credential and without one. A surface that has only been exercised in the good state has an unknown failure mode, and its refusal is the thing an operator will meet first.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no automated suite over this configuration, so the evidence is observed calls. Both credential states are exercised because the uncredentialed path is the one a new operator hits, and its message is the difference between a fixable setup problem and an opaque failure. The machine begins unauthenticated, which makes that state the cheaper of the two to capture first.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The dotenv loader configured for this repository must keep resolving manual variables, and `magicpath-ai` must stay on PATH at the version the surface was written against. A version change moves the command list and invalidates declared tools.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the manual entries in `.utcp_config.json` returns the transport to its phase 001 state, and reverting the example environment file removes the recorded variable name. No MagicPath account state is created by the read-only surface, so nothing remote needs undoing. If the mutating family was registered and exercised, any component or project it created is removed through the platform before the phase closes.
<!-- /ANCHOR:rollback -->

---
