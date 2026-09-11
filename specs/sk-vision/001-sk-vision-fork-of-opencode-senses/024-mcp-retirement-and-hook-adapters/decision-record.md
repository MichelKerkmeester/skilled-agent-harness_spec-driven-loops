---
title: "Decision Record: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters"
description: "Why the MCP transport is retired rather than repaired, why the replacement is a host hook rather than a CLI, and what happens to the config sk-vision no longer owns."
trigger_phrases:
  - "sk-vision MCP retirement decision"
  - "hook adapter versus CLI"
  - "devin mcp config ownership"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters"
    last_updated_at: "2026-09-11T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Four decisions recorded from the consumer audit."
    next_safe_action: "Operator approves the deletion set."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-024-mcp-retirement-and-hook-adapters"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Decision Record: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Retire the MCP transport rather than repair it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator, Claude |

---

### Context

The transport was built on the premise that Cursor and Devin had no in-process extension point, so MCP was the only way to give them the thirteen vision tools. An audit found that premise no longer holds and that the transport has no host that can currently reach it.

Cursor's registration was removed from `.cursor/mcp.json`, leaving an always-apply rule and a command still naming the tools. Devin still registers the server but its permission allowlist in `.devin/config.local.json` never granted `mcp__sk-vision__*`, and cli-devin records that `devin -p` rejects MCP tool calls under the permission modes this repo dispatches in unless the allowlist names them.

### Constraints

- Cursor and Devin must keep working vision. Retirement cannot mean capability loss.
- Devin's `code_mode` registration currently rides inside the file being removed.
- The shipped MCP artifact is gitignored and already older than its own source, so nothing can be concluded from the build in place.

---

### Decision

**Summary**: Delete the MCP stdio server, its dependency, its build step and every registration pointing at it, after a replacement is proven live.

**Details**: The transport carries an MCP SDK dependency, a second bundle step, a 1.1 MB artifact, an integration test, two host configs, two mirror symlinks, two best-effort instruction rules and roughly fifteen documentation files. That is a standing maintenance surface for a path no host can currently exercise, and the two hosts it served both have a better channel available.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Retire the transport, replace with host hooks** | One attach model for all four hosts, deterministic injection, removes a dependency and a build step | Largest diff, requires live verification on two hosts before deletion | 9/10 |
| Repair it: restore Cursor's entry, add Devin's allowlist grant, rebuild | Smallest diff | Keeps a second transport alive, and leaves the best-effort weakness the rules themselves admit to | 5/10 |
| Keep Devin, finish removing Cursor | Honest about what is dead today | Leaves the same maintenance surface for one host that cannot call it in dispatch mode | 4/10 |
| Full removal with no replacement | Smallest end state | Two hosts lose vision. The operator ruled this out explicitly | 2/10 |

**Why Chosen**: The repair option preserves a transport whose own documentation concedes that nothing in it can compel the tool call. The hook replacement removes that weakness rather than restoring it, and it collapses two attach models into one.

---

### Consequences

**Positive**:
- One attach model across four hosts, with the skill owning every adapter source.
- The MCP SDK dependency, the second bundle step and the process-lifecycle guards all leave the package.
- Cursor and Devin gain deterministic evidence injection instead of an instruction a model may ignore.

**Negative**:
- Large documentation diff, since roughly fifteen files describe the old path. Mitigation: the superseded packets stay intact under `specs/` as the record.
- A prompt-time hook can spin the local model on turns the user did not ask about. Mitigation: it fires only when the prompt names an image path, and it honors the same kill-switch family as every other hook here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cursor's `beforeSubmitPrompt` does not reach a dispatched model | H | Verify live before deleting anything. A negative result halts the packet. |
| Devin loses Code Mode when sk-vision's config is deleted | H | ADR-003 moves ownership first, and Code Mode presence is asserted from the final state. |

---

### Implementation

**Affected Systems**: `vision-runtime` package, `.cursor/` and `.devin/` host configs, the shared hook hub, the skill documentation set.

**Rollback**: `git revert` the packet's commits, then rebuild `vision-runtime` to restore the gitignored artifact.

---

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Replace the transport with host hook adapters, not a CLI

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator, Claude |

---

### Context

Once MCP is retired, Cursor and Devin need another route to the vision core. Both can run shell commands, and Devin's permission allowlist already grants `Exec(node)`, so a small CLI was the first candidate and the operator's initial guess. The operator then pointed out that both hosts also support hooks, and asked whether a new CLI was warranted at all.

Investigation confirmed both hook systems are live and already carrying repo-owned adapters. `.cursor/hooks.json` registers seven events and `.devin/hooks.v1.json` registers eight, with the spec-gate question and the advisor brief flowing through `beforeSubmitPrompt` and `UserPromptSubmit` respectively.

### Constraints

- The replacement must not depend on the model choosing to invoke it, which is the weakness that made the MCP path unreliable.
- It should reuse the existing tool registry and runtime client rather than fork them.

---

### Decision

**Summary**: Add one hook adapter per host, on the prompt-time event each already uses.

**Details**: Each adapter reads the hook payload, detects an image path in the submitted prompt, runs the analysis through the existing `RuntimeClient` and `PhotonProvider`, injects a `<SK-VISION>` evidence block on the host's own envelope and tears the runtime down. The shape follows `goal-inject.mjs` on both hosts, including its unconditional fail-open discipline.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Host hook adapter per runtime** | Extends a pattern both hosts already run, injects rather than asks, no new invocation contract | Two adapters instead of one binary, and injection reach must be verified per host | 9/10 |
| A `sk-vision` CLI both hosts shell out to | One implementation for both, `Exec(node)` already allowlisted on Devin | A new surface with its own argument grammar, and it still depends on the model deciding to run it, which is the failure being removed | 5/10 |
| SKILL.md instruction only | Zero code | Strictly weaker than the rules being deleted | 1/10 |

**Why Chosen**: On the reversal-cost order, extending an existing pattern sits below adding a new module with its own contract. The decisive point is not cost though, it is that a CLI reproduces the exact weakness being retired: the model has to choose to call it. A hook does not ask.

---

### Consequences

**Positive**:
- Evidence arrives whether or not the model would have requested it.
- Kill-switch, fail-open and mirror-symlink conventions come for free from the existing pattern.
- No new invocation contract for a future reader to learn.

**Negative**:
- Two adapters to maintain rather than one entry point. Mitigation: both are thin callers of one shared core, and the same is already true of the goal and spec-gate adapters.
- Injection reach is a per-host property that must be proven rather than assumed. Mitigation: that proof is stage 2 of the plan and gates the deletion.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hook fires the local model on unrelated turns | M | Trigger only on a prompt naming an image path; honor the kill-switch |
| An adapter error blocks a turn | H | Fail open on every path, asserted by unit test |

---

### Implementation

**Affected Systems**: `.cursor/hooks.json`, `.devin/hooks.v1.json`, the skill `hooks/` tree, the shared hook hub, the injection contract.

**Rollback**: Unregister both adapters from the host config files. The adapters themselves are inert once unregistered.

---

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Devin's MCP config stops being owned by sk-vision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator, Claude |

---

### Context

`.devin/mcp_config.json` is a symlink into `.opencode/skills/sk-vision/hooks/devin/mcp_config.json`, so the skill owns Devin's entire MCP configuration rather than just its own entry. That file currently carries `code_mode` alongside `sk-vision`, which means deleting sk-vision's copy would take Code Mode out of Devin with it.

### Constraints

- Devin must keep `code_mode`.
- No skill should own a host's whole config for the sake of one entry it is about to remove.

---

### Decision

**Summary**: Replace the symlink with a Devin-owned real file carrying only `code_mode`, before deleting the skill's copy.

**Details**: This mirrors the resolution already reached for Cursor in `020-cursor-mcp-decoupling`, where `.cursor/mcp.json` became a real Cursor-owned file for the same reason. Doing it in this order means Code Mode is never momentarily unregistered.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Devin-owned real file, written before the deletion** | Code Mode never drops; ownership lands where it belongs | One more file Devin owns outright | 9/10 |
| Keep the skill-owned file, minus the sk-vision entry | No new file | A vision skill would still own Devin's Code Mode registration, which is the coupling being removed | 3/10 |
| Delete and re-add afterwards | Simplest sequence | A window where Devin has no Code Mode | 2/10 |

**Why Chosen**: Ordering the write before the delete removes the window, and it puts the config under the host that reads it.

---

### Consequences

**Positive**: Devin's MCP configuration is no longer coupled to a skill that does not use MCP.

**Negative**: Devin's copy of Code Mode no longer follows edits made elsewhere. Mitigation: the same trade-off was accepted for Cursor, and it is recorded here so the next editor knows to update both.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The revert restores a symlink whose target is gone | M | The rollback plan says to confirm the target exists after reverting |

---

### Implementation

**Affected Systems**: `.devin/mcp_config.json`, `.opencode/skills/sk-vision/hooks/devin/`.

**Rollback**: Restore the symlink and the skill-owned file together.

---

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Historical spec packets describing the MCP transport are left untouched

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Claude |

---

### Context

The residue sweep finds many references to the retired transport inside `specs/`, concentrated in `014-cursor-devin-mcp-adapters`, `017-cursor-devin-testing-playbook`, `020-cursor-mcp-decoupling` and `021-mcp-server-process-lifecycle`. A literal reading of "remove every reference" would rewrite them.

### Constraints

- The audit that justified this packet was built by reading those packets. Rewriting them destroys the reasoning trail.
- Spec packets are records of what was true when written, not live wiring.

---

### Decision

**Summary**: Scope the sweep to the live tree and leave `specs/` alone.

**Details**: The residue check in the plan carries `--glob '!specs/**'` for this reason. The superseded packets are named in this packet's metadata so a reader can follow the chain forwards instead of finding a silently edited history.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Leave `specs/` untouched, name the superseded packets** | Preserves the record, cheap, matches how supersession already works here | A raw grep still returns hits, so the sweep needs its exclusion documented | 9/10 |
| Rewrite the historical packets | A grep returns nothing anywhere | Destroys the audit trail and rewrites completed work outside this packet's scope | 1/10 |
| Add deprecation banners to the old packets | Discoverable | Edits four closed packets to state what supersession metadata already states | 4/10 |

**Why Chosen**: A spec packet that gets edited whenever its subject changes stops being evidence of anything.

---

### Consequences

**Positive**: The reasoning behind the original MCP design stays readable, which is what makes a future reversal an informed decision rather than a rediscovery.

**Negative**: An unscoped grep for the retired names still returns hits. Mitigation: the quality gate names the exclusion explicitly.

---

### Implementation

**Affected Systems**: None. This decision records a deliberate non-change.

**Rollback**: Not applicable.

---

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Cursor has no prompt-time injection channel, so ADR-002's Cursor half does not stand

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Claude, pending an operator choice on the replacement |

---

### Context

ADR-002 put both Cursor and Devin on a prompt-time hook. Devin's event is documented as live by its own goal adapter. Cursor's was not: two repository sources disagreed about `beforeSubmitPrompt`.

`.opencode/hooks/injection-contract.md` lists Cursor as a model-context channel carrying the spec-gate question. The cli-cursor hook contract section 7 and the sk-code hooks reference both say the opposite, that live probing found the event undelivered and the two hooks registered on it are dormant.

Where two documents disagree, neither is the authority. The code and the runtime are.

### Constraints

- The disagreement sat directly under the packet's only unproven requirement, so it had to be settled before writing an adapter against it.
- The recorded probe did not name the build it tested, and the installed build is newer, so the record could have been stale in either direction.

---

### Decision

**Summary**: Probe it, and treat the result as authoritative. The result is that Cursor does not deliver the event, so the Cursor half of ADR-002 is superseded.

**Details**: A throwaway hook was registered on `beforeSubmitPrompt` and on `sessionStart` as a positive control, against build `2026.09.02-c22c1a3`. Across three runs the control fired every time a session started, and `beforeSubmitPrompt` never fired, including on a run where the model completed a full turn. Method, runs and traps are in `scratch/cursor-event-probe.md`.

This confirms the hook-contract record rather than superseding it, and it promotes the injection contract's Cursor row to a known defect.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Probe the runtime and follow the result** | Settles a documented contradiction with an observation instead of a preference | Costs a dispatch and a reversible config edit | 10/10 |
| Trust the injection contract and build the adapter | Fastest path to the packet as written | Ships an adapter that silently never fires, which is the exact failure being retired | 1/10 |
| Trust the hook contract and skip the probe | Cheap, and it turned out correct | Would have been a guess: the record named no build, and the installed one is newer | 4/10 |

**Why Chosen**: The packet's own stage gate required live proof before deletion. Running that proof early cost one dispatch and removed a wrong adapter from the plan before it was written.

---

### Consequences

**Positive**:
- The Cursor design failed at the cheapest possible moment, before any code existed.
- The Devin half is untouched and still buildable.
- The injection contract's Cursor row is now a known defect with evidence attached.

**Negative**:
- The packet cannot complete its Cursor requirement without an operator decision on a different route. REQ-004 and AC-004 are blocked, not waived.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future Cursor build restores the event and this ADR reads as permanent | L | The probe records the exact build, so a re-probe is cheap and the scratch file says how |
| The injection contract keeps asserting a channel that does not exist | M | Correcting that row is in this packet's stage 4, and it is now evidence-backed |

---

### Implementation

**Affected Systems**: This decision writes no code. It blocks REQ-004 and reopens the Cursor route.

**Rollback**: Not applicable. The probe's config edit was reverted and verified byte-identical to its backup.

---

<!-- /ANCHOR:adr-005 -->
---

<!-- ANCHOR:adr-006 -->
## ADR-006: The agent-definition cleanup is waived to the agents track

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Claude, on the operator's instruction to clear dead system-skill MCP references |

---

### Context

The operator asked for the dead system-skill MCP references to be removed. Four were found in live wiring: two allowlist grants in Devin's local config, a stale line in the root README, and a retired code-index tool named in two Claude agent definitions.

The first three were straightforward. The fourth was not. Removing `mcp__system_code_index__detect_changes` from `.claude/agents/review.md` and `deep-review.md` made the mirror-sync verifier report drift, because `.opencode` is the canonical source, it still grants `detect_changes` in its permission block, and its body prose still instructs the agent to use it. That verifier backs a commit gate.

The full cleanup is fifteen sites across four agent files, plus two generated Pi mirrors carrying an "unmapped permission key" comment for the same tool.

### Constraints

- The agent definitions are not sk-vision's, and this packet's scope is the sk-vision transport.
- A change that fails a commit gate is not a change, it is a broken tree.
- The tool is genuinely gone, so the references are dead weight either way.

---

### Decision

**Summary**: Clear the three references that are live wiring, revert the two that are not, and waive the agent-definition half to an agents-track packet.

**Details**: The reverted edits are restored exactly, and the mirror-sync verifier reports both agents back in sync. Nothing is left half-done in the tree: either a reference is cleared, or it is untouched and recorded here.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Clear the live wiring, waive the agents half** | Nothing half-done, the commit gate stays green, the remaining work is recorded with its evidence | One criterion closes as waived rather than met | 9/10 |
| Do the full agent cleanup here | One criterion closes clean | Fifteen sites in another track, folded into a sk-vision diff nobody would expect to contain them | 3/10 |
| Leave the Claude mirrors edited and the gate failing | Smallest diff | Ships a tree that fails a commit gate | 0/10 |
| Revert all four and waive everything | Consistent | Three of them are live wiring naming servers that do not exist, which is what the operator asked to fix | 2/10 |

**Why Chosen**: The boundary that matters is not effort, it is ownership. Three references sat in configuration this packet already touches. The other two sit in a canonical source with its own gate, and editing a mirror without its source is how drift gets introduced rather than removed.

---

### Consequences

**Positive**: The commit gate stays green, and the remaining cleanup is recorded with the exact reason the naive version fails.

**Negative**: Four agent files still name a tool that no longer exists. Nothing breaks meanwhile, because the agents already handle its absence: their own prose says to surface "structural-impact analysis unavailable" and continue.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The waiver is read as the work being unnecessary | L | This ADR names the fifteen sites and the gate that makes the naive fix fail |

---

### Implementation

**Affected Systems**: None in this packet. The follow-up touches `.opencode/agents/{review,deep-review}.md`, their Claude mirrors and the generated Pi mirrors.

**Rollback**: Not applicable. This records a deliberate non-change.

---

<!-- /ANCHOR:adr-006 -->
