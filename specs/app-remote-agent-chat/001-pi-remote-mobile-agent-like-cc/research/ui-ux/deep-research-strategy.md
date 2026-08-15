---
title: Deep Research Strategy - Pi Remote Mobile PWA UI/UX
description: Session tracking for improving Pi Remote UI/UX and ease-of-use. Tracks focus decisions, key questions, what worked/failed, and next focus across iterations.
trigger_phrases:
  - "pi remote ui ux research"
  - "pi remote mobile pwa usability"
  - "deep research strategy"
  - "pi mobile ui ux"
  - "ease of use pi remote"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC

Improve the UI/UX and ease-of-use of the "Pi Remote" mobile PWA. Installable iPhone PWA (Vite + React 19 + Tailwind 4 + React Aria) that remote-controls the Pi coding agent over a Tailscale tailnet. Surfaces: Home (session cards), Session (typed-block transcript + compose), Review (approval card), Attention Inbox (push hints). Research finds concrete, adoptable improvements to interface, interaction design, information architecture, and ease-of-use logic and flows, benchmarked against mobile coding-agent/terminal/CI/remote-dev clients, without weakening the security posture.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Which interaction patterns from leading mobile coding-agent and terminal clients (Claude mobile, Warp, Termius, Blink Shell, GitHub mobile, Vercel/Netlify mobile, Replit mobile) transfer directly to Pi Remote's session-list, transcript, compose, review, and inbox surfaces, and which are mobile-PWA-specific adaptions?
- [ ] Q2: What information architecture and navigation patterns make multi-surface mobile agent control (home sessions, live session, review queue, attention inbox) feel coherent and low-effort, especially under foreground authority and push hinting?
- [ ] Q3: Which transcript and streaming patterns (block types, streaming affordances, action visibility, collapse/expand, error and usage surfacing) improve readability and steerability of a long-running agent transcript on a phone?
- [ ] Q4: How should mutation approval (approve/deny/accept-edits) and redaction be presented so safety stays explicit and fast, matching the trust pattern of review apps without slowing the flow?
- [ ] Q5: Which compose-box affordances (send/steer, turn-taking, quick actions, keyboard handling, multi-line editing, undo/stop) lower friction for steering a coding agent from an iPhone keyboard?
- [ ] Q6: What attention, notification, and inbox patterns keep the operator informed (needs_input, finished, error) without becoming noisy or content-leaking, given content-free push hints and foreground authority?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not a full product redesign; concrete adoptable improvements only.
- Not a visual rebrand; restrained tokens and one accent stay.
- Not removing security posture (redaction, mutation approval-gated) — patterns must preserve or strengthen it.
- Not implementing changes; this is research only (research → plan → implement).
- Not an exhaustive survey of every mobile app; a focused benchmark of similar mobile clients plus the current implementation.

---

## 5. STOP CONDITIONS

- Convergence on newInfoRatio < 0.05 across rolling window (default), or
- All key questions answered, or
- Max iterations reached (config.maxIterations), or
- Stuck threshold (3 consecutive no-progress iterations), or
- maxDurationMinutes exceeded.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q6: Define foreground suppression, unread state, stale hints, and notification preference behavior. (iteration 1)
- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error/usage prominence. (iteration 1)
- Q5: Specify touch-keyboard, external-keyboard, steer, queue, retry, and stop behavior for compose. (iteration 1)
- Product-coverage caveat: Termius and Vercel/Netlify remain unvalidated as named comparators; revisit only if later questions require a pattern not covered by the stronger primary sources above. (iteration 1)
- Q2: Define the coherent navigation and information architecture across Home, Session, Review, and Attention Inbox. (iteration 1)
- Q4: Refine exact-action review flows without weakening mutation approval or redaction. (iteration 1)
- Q6: Define foreground suppression, unread state, stale hints, and notification preferences. (iteration 2)
- Q2: Define navigation among Home, Session, Review, and Attention Inbox, including approval counts and return paths. (iteration 2)
- Contract gap: confirm whether accept-edits settles, includes, or only authorizes retry of the visible approval, and confirm the PWA revocation contract. (iteration 2)
- Q5: Specify touch-keyboard, external-keyboard, steer, queue, retry, and stop behavior. (iteration 2)
- Q4 contract gap: confirm accept-edits inclusion and revocation semantics. (iteration 3)
- Q5 implementation dependency: expose Pi RPC follow-up, queue-update, abort, and agent-settled semantics through the relay before presenting those controls as authoritative. (iteration 3)
- Q5 device validation: verify installed-PWA keyboard occlusion, focus retention, dictation, IME composition, and hardware shortcuts on the supported physical iPhone/iOS matrix. (iteration 3)
- Q2: Define coherent navigation and information architecture across Home, Session, Review, and Attention Inbox. (iteration 3)
- Q6: Define foreground notification suppression windows, server-side unread and settled semantics, stale-item retention, badge counts, and preference defaults. (iteration 5)
- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error and usage prominence. (iteration 5)
- Product-coverage caveat: Termius and Vercel or Netlify remain unvalidated as named comparators. (iteration 5)
- Q4 implementation validation: determine which privacy-safe scope and impact descriptors can be produced without weakening canonical redaction policy. (iteration 5)
- Q4 implementation detail: choose the exact typed descriptor schema and preflight invalidation mechanism during planning; the current `ApprovalAction` and `ApprovalCardDto` contracts do not contain them. (iteration 6)
- Accept-edits inclusion and revocation semantics remain a separate contract gap from descriptor safety. (iteration 6)
- Planning must define whether revocation also aborts grant-derived one-action leases that are approved but not yet consumed; the current grant terminal transition alone does not establish that cascade. (iteration 7)
- Planning must choose bounded count and duration presets and add active-grant list/status plus revoke protocol and HTTP contracts. (iteration 7)
- Implementation planning must choose a status refresh transport and retention window for recently terminal grant receipts; the required authority semantics do not depend on polling versus a sync event. (iteration 8)
- Physical iPhone testing must validate the sheet copy, radio-card density, countdown legibility, and the proposed 3-edit / 5-minute default. (iteration 8)
- Product-coverage caveat: Termius and Vercel/Netlify remain unvalidated as named comparators; no claim in this iteration depends on them. (iteration 9)
- Physical iPhone testing must validate dynamic-height anchoring with the keyboard open, VoiceOver announcement cadence, disclosure expansion above the viewport, safe-area placement of `Jump to latest`, and the threshold used to enter or leave `following`. (iteration 9)
- The relay/projector must confirm that settled `blockId` and `sequence` identities survive snapshot reconciliation and transcript compaction. If they do not, the protocol needs a non-content stable sequence before the return contract can be implemented. (iteration 9)
- Planning must define the receipt and device-acknowledgement protocol, private dedupe-key derivation, settlement source for each class, and cleanup job. (iteration 10)
- Termius and Vercel/Netlify remain unvalidated named comparators; no Q6 conclusion depends on them. (iteration 10)
- Physical installed-iPhone testing must validate visibility and pagehide lease release, focus-existing-client behavior, notification replacement by tag, OS/app badge support, typing-window timing, and VoiceOver announcement cadence across the supported iOS matrix. (iteration 10)
- The existing Q2 route-model replacement remains a prerequisite for canonical notification and inbox navigation. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
The existing Q2 route-model replacement remains a prerequisite for canonical notification and inbox navigation.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

None loaded at init: the spec-kit memory daemon was wedged during session bootstrap (MCP memory_context and warm-CLI both timed out, exit 75). Prior_context = None. The deep-research loop's own artifacts and this packet are the working source of truth; iteration leaf agents will read the app source and docs directly.

### Bounded Context Snapshot

- Source pointers (Pi Remote app, absolute paths outside this repo):
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx` (main app, ~49KB)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/state.ts` (typed-block transcript state)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts` (streaming relay)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/attention.ts` (attention inbox)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css` (design tokens)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/auth.ts`, `cache.ts`, `main.tsx`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/` (architecture.md, security.md, install-and-onboarding.md, platform-support.md, operations.md, etc.)
- Reuse candidates: existing typed-block renderer, React Aria primitives, Tailwind 4 tokens, the four-surface IA.
- Integration points: Home/Session/Review/Attention surfaces; compose box; attention.ts hints; review approval card.
- Constraints and risks: research-only (no implementation); security posture must not weaken; redaction everywhere; mutation approval-gated; memory daemon currently flaky so prefer direct file/webfetch evidence.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-08-14T05:52:28Z
