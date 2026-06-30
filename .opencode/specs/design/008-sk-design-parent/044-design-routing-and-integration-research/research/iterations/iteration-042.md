# Iteration 42: D4-A11 Temporal Freshness Binding

## Focus

[D4-A11 / D4] temporal decay/freshness binding: proof token TTL plus invalidation when the brief or subject changes. The narrow question is not whether Open Design must load `sk-design`; that is already stated. The question is how a valid-looking `skDesignGate` or `DESIGN_PROOF_TOKEN v1` stops being valid when time passes, the subject changes, the compiled brief changes, or a discovery-form answer is edited.

newInfoRatio estimate: 0.62. Status: insight. ENFORCEABLE-vs-ADVISORY summary: timestamp/digest/lineage checks are enforceable on a test corpus; semantic judgment about whether two natural-language subjects are "really the same brief" stays advisory unless reduced to a canonical subject object first.

## Actions Taken

1. Read the active strategy and tail state to confirm iteration 42 had only an `iteration_start` record and that the remaining D4 question is still proof-token carriage/freshness.
2. Re-read `mcp-open-design` mandatory pairing, routing pseudocode, run direction, and tool-surface docs.
3. Re-read the `sk-design` shared context-loading contract, Context Loaded card, Proof Of Application card, and deterministic `proof_check.py` gate.
4. Re-read prior D4 token work from iterations 35, 39, and 40 so this iteration adds freshness semantics rather than repeating payload-digest or child-dispatch findings.
5. Searched the local repo for `skDesignGate`, `DESIGN_PROOF_TOKEN`, `expiresAt`, TTL/freshness terms, `compiledOpenDesignBrief`, `briefDigest`, and subject-change language across the D4 targets.

## Findings

### Finding 1: The Open Design precondition is hard, but not temporally scoped

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for tool-bound denial on missing/expired/mismatched token; ADVISORY for final design quality.

`mcp-open-design` clearly says it is transport, not taste, and that every generation/start_run plus every design-feeding read must load `sk-design`, run ground -> token-system -> critique, and shape the brief and discovery-form answers with that judgment. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The resource table repeats the hard precondition for any generation/RUN or design-feeding READ. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:90] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:92] The run path also states that `start_run` is turn 1, and that the `start_run` message plus every `od ui respond` answer must be shaped by the `sk-design` judgment. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:228] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:230]

The missing part is freshness. Those contracts block an unloaded design step, but they do not say how long a loaded judgment remains valid, whether a token is single-use, or what happens when the subject, audience, job, register, mode bundle, resolved design system, brief, or form answers change after token minting.

Buildable recommendation: add a `DESIGN_PROOF_TOKEN v1` freshness clause to the future shared token contract, then import it from `mcp-open-design`'s run/gate docs. Minimum fields:

```json
{
  "freshness": {
    "issuedAt": "ISO-8601",
    "expiresAt": "ISO-8601",
    "maxAgeSeconds": 300,
    "singleUse": true,
    "subjectDigest": "sha256:...",
    "briefDigest": "sha256:...",
    "formAnswersDigest": "sha256:...",
    "routeDigest": "sha256:...",
    "loadedFilesDigest": "sha256:...",
    "openDesignLineageDigest": "sha256:..."
  }
}
```

The exact `maxAgeSeconds` can be a policy constant, but it must be explicit. The local Open Design surface already has a comparable short-freshness precedent: active-project fallback expires after roughly five minutes. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:46]

### Finding 2: The proof cards gate readiness shape, not token freshness

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for adding required token fields and parser checks; ADVISORY for aesthetic interpretation.

The shared context contract requires a context manifest before dispatch or design/build decisions and says missing loaded files block palette, layout, motion, copy, accessibility, score, release, or readiness claims. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] It also names exact proof fields for parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:69] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71]

The Context Loaded card captures surface, task type, scope owner, register, dials, required files, and staged proof fields, but no `issuedAt`, `expiresAt`, `subjectDigest`, or payload digest. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:30] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:61] The Proof Of Application card records files read/cited, four proof fields, lineage attribution, and READY/NOT READY, again without token age or subject binding. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:46] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:57]

The deterministic checker mirrors that shape: it matches four proof-field families plus READY/NOT READY, then passes when none are missing and READY is checked. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:25] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:39] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:53]

Buildable recommendation: extend the cards with a `TOKEN FRESHNESS` block and extend `proof_check.py` with `--require-design-token`. The checker should fail if the token is absent, expired, too old, missing `subjectDigest`, or mismatched against the canonical subject/brief/form payloads supplied by the test fixture or proxy log. This is deterministic for a local corpus because the fixture can provide `now`, the canonical subject JSON, and captured tool input.

### Finding 3: Prior token sketches have expiry fields, but not an invalidation policy

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for TTL and digest mismatch denial; ADVISORY for unstated user intent changes.

Iteration 35 already proposed `issuedAt` and `expiresAt` in `skDesignGate`. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:108] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:113] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:114] Iteration 39 added `briefDigest`, `expiresAt`, and a `compiledOpenDesignBrief` with subject, audience, job, register, resolved system, token system, layout direction, motion budget, anti-default critique, constraints, and proof sources. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:29] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:34] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:35] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:37] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:50]

Iteration 40 then made the cross-child token explicit with `tokenId`, `dispatchId`, `issuedAt`, `expiresAt`, `surface`, `taskType`, `register`, `modeBundle`, loaded-file hashes, allowed mutating tools, Open Design lineage, brief/form digests, and parent validation. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-040.md:24] It also required child-side validation to verify expiry and recompute payload digests before Open Design mutation. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-040.md:48] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-040.md:51] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-040.md:52]

What remains unbound is the invalidation trigger. `expiresAt` is a field, not a policy. A token minted for "premium cookware landing page" must fail if reused for "B2B scheduling dashboard" even before the clock expires. A token minted before the user changes register from Brand to Product must fail even if `briefDigest` is accidentally left unchanged.

Buildable recommendation: compute `subjectDigest` from canonical JSON, not from raw prompt text:

```json
{
  "subject": "string",
  "audience": "string",
  "job": "string",
  "surface": "page|route|file|frame",
  "taskType": "generation|redesign|audit|dispatch",
  "register": "Brand|Product",
  "dials": {"variance": 0, "motion": 0, "density": 0},
  "modeBundle": ["interface", "foundations"],
  "resolvedSystem": {"name": "string|null", "sourceDigest": "sha256:null-or-content"},
  "mustKeepDigest": "sha256:..."
}
```

The Open Design mutation guard rejects the token when the current canonical subject digest differs, when the route/mode bundle differs, or when the outgoing brief/form digests differ. The fixture corpus should include: fresh valid token, expired token, token with future `issuedAt`, token for old subject, token for old register, token for old mode bundle, token with stale loaded-file hash, token with matching subject but edited brief, and token reused for a second `start_run`.

### Finding 4: Subject-change invalidation is enforceable only after canonicalization

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for canonical field mismatch; ADVISORY for semantic equivalence outside the canonical object.

`compiledOpenDesignBrief` already gives the right canonicalization surface because it decomposes the brief into subject, audience, job, register, dials, resolved system, reuse plan, token system, layout direction, motion budget, anti-default critique, must-keep constraints, and proof sources. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:37] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:38] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:39] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:40] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-039.md:50]

By contrast, the current Context Loaded card has a free-form Surface row and task/scope checkboxes, but no explicit subject/audience/job fields. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:29] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:30] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:31] So a checker cannot distinguish "same surface, new subject" from "same task continues" unless the subject object exists before token minting.

Buildable recommendation: make `compiledOpenDesignBrief.subject` fields required before token mint. Add fixture replay that mutates exactly one canonical field at a time and expects denial. The guard should not try to infer semantic sameness from raw prose. If two prompts are semantically equivalent but produce different canonical JSON, the deterministic gate should ask/remint rather than silently reuse the old token.

### Finding 5: Freshness enforcement has two homes: token mint and tool boundary

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for mint/proxy/hook checks; ADVISORY for inner-model private reasoning.

The Open Design tool surface classifies `start_run` as mutating and states it spawns the inner agent and returns the discovery form. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:50] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:52] It also gates `start_run` and `od ui respond`/related UI writes behind confirmation and explicit target. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:73] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:77] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:78]

Freshness needs to be checked twice:

- Mint-side: only mint a token after the context manifest, canonical subject, route/mode bundle, loaded-file hashes, and compiled brief exist.
- Boundary-side: immediately before `start_run`, `od run start`, `od ui respond`, or equivalent automation, recompute digests from the actual outgoing input and deny stale, expired, future-issued, single-use-reused, subject-mismatched, or payload-mismatched tokens.

Buildable recommendation: implement this later in the guarded MCP proxy or PreToolUse branch already proposed by D4-A4/D4-A9, plus a local benchmark lane. The benchmark lane can run without Open Design by replaying captured tool-call JSON against a deterministic validator with injected `now`.

## Questions Answered

- Q3/D4: The deny-by-default token needs both temporal and subject freshness. Presence of `skDesignGate` is not enough; it must be unexpired, unconsumed, and bound to the current canonical subject, route/mode bundle, loaded-file hashes, Open Design lineage, and exact outgoing brief/form payloads.
- Q4/D5: For delegated children, the parent token can survive only if the child boundary re-validates freshness immediately before Open Design mutation and returns a result block with token id, validation timestamp, and tool-call digests.
- Q5/all: ENFORCEABLE backlog items are token TTL, `issuedAt`/`expiresAt`, future-issued denial, single-use/non-replay, canonical `subjectDigest`, brief/form digest matching, route/mode-bundle matching, loaded-file hash matching, and fixture replay. ADVISORY items are semantic equivalence outside the canonical subject object and final visual taste.

## Questions Remaining

- What exact live MCP `start_run` schema field should carry the token without leaking Open Design source content into repo artifacts?
- Should token minting live in a `sk-design` proof-card parser, an `openDesignGate mint` helper, or the guarded `mcp-open-design` proxy?
- Should the first implementation use a five-minute TTL by default, matching the existing active-context expiry precedent, or make TTL configurable by tool class?
- How should text-only cli-claude-code replay prove a child did not reuse an old token when no structured tool stream is captured?

## Next Focus

D4-A12 should resolve the concrete token carrier: where `DESIGN_PROOF_TOKEN v1` lives in `start_run` / `od run start` / `od ui respond` payloads, how that carrier avoids copying Open Design source content, and how the proxy/PreToolUse validator reads it before the daemon receives a design-generation mutation.
