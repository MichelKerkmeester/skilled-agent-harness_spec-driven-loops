---
title: "Feature Specification: Phase 13: dsh-live-contract-pin"
description: "The LLM Gateway route completed a keyed dsh headless turn with saved evidence. OpenCode Go remains configured, not verified, and only proven routes are promoted."
trigger_phrases:
  - "dsh live contract pin"
  - "phase 13 dsh live contract pin"
  - "keyed dsh pin"
  - "dsh route verification"
  - "promote cli-deepseek-harness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: dsh-live-contract-pin

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 14 |
| **Predecessor** | 012-deep-loop-modes-and-commands |
| **Successor** | 014-playbook-docs-and-closeout |
| **Handoff Criteria** | Every keyed route has a saved exit 0 run with `final.reason.kind` `completed`, each route has a route-specific status in the packet and default, and unresolved questions have evidence-based reasons |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Run the two roster routes, LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`, through `dsh` headless with an operator-supplied key, record verbatim evidence, correct the packet and patches to match, and promote the kind for proven routes only. This is the only phase allowed to answer the key-gated unknowns.

**Dependencies**:
- `006-deep-loop-executor-kind` (the builder and allowlist this phase promotes)
- `008-dsh-repo-guards-safety-wave` (the guards patch every live run carries)
- The operator entering a provider key in the launch environment or a disposable home's `.env`. The session never reads, copies or prints it.

**Deliverables**:
- `013-dsh-live-contract-pin/evidence/` captures per route
- Corrections to `.dsh/patches/route-*.patch.yml`, the packet `references/` and `hard-rules.json`
- The default allowlist and preventive-sandbox capability in `executor-config.ts`, an entry in `live-contracts.json` and a re-pin runbook in the packet
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The LLM Gateway route now has a saved completed turn. OpenCode Go remains unverified because `OPENCODE_API_KEY` was unset and no request was sent. The confinement probe also found that `workspace-write` blocks a file write under `$HOME` but allows a sibling path under the OS temp directory.

### Purpose
Prove every route the operator keyed with a saved completed run, record the limits each probe observed and promote only a verified route to the default.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ dsh --version </dev/null
0.2.2-rc.1
exit 0

$ DSH_HOME=<fresh-temp-home> dsh --profile headless --patch <LLM-GATEWAY-ROUTE> --patch <LINEAGE> --patch <GUARDS> --json --permission-mode workspace-write --approval-policy never -
exit 0
final.reason.kind: completed
Task to final: 4 s; input: 5574 tokens; output: 20 tokens
Evidence: evidence/version.txt, evidence/route-llmgateway.stdout.jsonl, evidence/route-llmgateway.stderr.txt, evidence/route-llmgateway.exit.txt, evidence/latency-and-tokens.md

OpenCode Go: configured, not verified. OPENCODE_API_KEY is unset and no request was sent. Evidence: evidence/latency-and-tokens.md

Confinement: inside write completed; $HOME write was denied; sibling OS temp write completed; bash echo ok completed. Evidence: evidence/confinement.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run a harmless headless task per keyed route under a disposable `DSH_HOME` and save stdout, stderr and exit status verbatim.
- Probe workspace confinement, the `bash` tool, `max` reasoning and the developer-role compat setting in a temp workspace.
- Run one `fanout-run.cjs` deep-research lineage with the kind and its containment scan.
- Record latency and token counts per route, then mark each route verified or "configured, not verified" in the packet and allowlist.
- Write a re-pin runbook for later rc bumps.

### Out of Scope
- Reading, copying or printing any API key or `.env` file - the operator supplies the key and the session never sees it
- A third route such as GLM - outside the closed roster
- Interactive profiles (`web`, `tui`, `acp`, `sdk`) - the mode is headless only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `013-dsh-live-contract-pin/evidence/` | Create | Verbatim run captures per route and probe |
| `.dsh/patches/route-llmgateway-deepseek.patch.yml`, `.dsh/patches/route-opencode-go-deepseek.patch.yml` | Modify | Endpoint and compat corrections from evidence |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/`, `hard-rules.json` | Modify | Replace UNKNOWN entries with observed answers |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Default allowlist and preventive-sandbox capability for proven routes |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json` | Modify | Live-contract entry for the kind |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/` re-pin runbook | Create | Steps to re-pin after an rc bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Per keyed route, `printf 'Reply with the single word OK' \| DSH_HOME=<tmp> dsh --profile headless --patch .dsh/patches/<route> --patch .dsh/patches/lineage.patch.yml --json --permission-mode workspace-write --approval-policy never -` exits 0 with `final.reason.kind` `completed`, saved verbatim with stderr |
| REQ-002 | In a temp workspace a write inside succeeds, a write under `$HOME` outside the cwd is denied with a recorded `tool_result` error, a sibling OS temp write is recorded as allowed and a `bash` `echo ok` call returns `completed` |
| REQ-003 | Each route is marked verified or "configured, not verified" in the packet and in the `executor-config.ts` allowlist, and only verified routes enter the default allowlist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A `max` reasoning request produces no `UNSUPPORTED_REASONING_EFFORT`, and the developer-role compat setting is recorded as needed or not |
| REQ-005 | One `fanout-run.cjs` deep-research lineage with the kind completes and its containment scan reports no out-of-lineage write |
| REQ-006 | Task-to-final latency and token counts are recorded per route in `evidence/` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `evidence/` holds one completed run for the keyed LLM Gateway route with exit 0 and `final.reason.kind` `completed`, and records OpenCode Go as configured, not verified.
- **SC-002**: `rg -c cli-deepseek-harness` on `live-contracts.json` prints at least 1, and the default model is the verified LLM Gateway route.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Provider keys | LLM Gateway completed. OpenCode Go key is unset and no request was sent | Keep OpenCode Go configured, not verified, and out of defaults |
| Risk | Cost and an overloaded OpenCode Go route, seen on 2026-11-05 | Med | One short harmless prompt per probe, retry once, then record the route as not verified |
| Risk | OS temp remains writable under `workspace-write` | High | Record the exception beside the preventive capability and keep every fan-out lineage in its own temp home |
| Risk | The key leaks into a transcript or evidence file | High | Never echo env, scan `evidence/` with `rg -i 'sk-|api_?key'` before saving |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Task-to-final latency is measured per route and recorded, not assumed.
- **NFR-P02**: Each probe prompt stays a single short sentence to bound cost.

### Security
- **NFR-S01**: No key, token or `.env` content appears in `evidence/`, the transcript or any committed file.
- **NFR-S02**: Every run uses a disposable `DSH_HOME` and leaves `~/.dsh` untouched.

### Reliability
- **NFR-R01**: A route counts as verified only with exit 0 and `final.reason.kind` `completed` together.
- **NFR-R02**: The re-pin runbook reproduces the probes from scratch after an rc bump.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: with no key in the environment the run exits 1 with `MISSING_CREDENTIAL`, and the route stays "configured, not verified".
- Maximum input: two keyed routes run serially, never in parallel, so one overload does not mask the other.
- Failure path: exit 1 or a `final.reason.kind` other than `completed` records the route as not verified with the verbatim stderr.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 8 files plus evidence captures |
| Risk | 18/25 | Paid live calls, sandbox behavior and key handling |
| Research | 12/20 | Answers nine key-gated unknowns |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which OpenCode Go endpoint authenticates, `https://opencode.ai/inference/go/openai/v1` or `https://opencode.ai/zen/go/v1`? Answered only by a keyed run here.
- Does `workspace-write` confine shell writes, MCP and plugin effects? UNKNOWN because the saved probes covered file-tool writes to the cwd, `$HOME` and OS temp plus `bash echo ok`, without mounting MCP or testing shell writes.
- Which OpenCode Go endpoint authenticates? UNKNOWN because the key was unset and no request was sent.
- Does `supportsDeveloperRole: true` work for LLM Gateway? UNKNOWN because the closed roster did not allow a variant patch.
- The dsh live-contract entry shape is recorded in `live-contracts.json`.
<!-- /ANCHOR:questions -->

---
