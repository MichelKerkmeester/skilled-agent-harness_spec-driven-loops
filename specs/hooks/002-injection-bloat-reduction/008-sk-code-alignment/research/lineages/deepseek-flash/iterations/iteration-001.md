# Iteration 1: sk-code OpenCode-surface standards + system-skill-advisor core libs and hooks audit

## Focus

Load the sk-code opencode-surface standards (TypeScript/JS authoring, comment hygiene, fail-open, no ephemeral labels) and audit the first group of changed files: `policy-plan.ts`, `render.ts`, `user-prompt-submit.ts`, `prompt-advisor.ts`, plus the four `spec-gate-classify.mjs` adapters, `spec-gate-classify.ts`, `spec-gate-core.mjs`, and both plugins.

## Findings

### F1 — Candidate literals are ephemeral packet numbers baked into runtime code (P2, all shadow-delivery observers)

The `candidate` value passed to `recordObservedPolicyDelivery`/`observeEmittedAdvisorPolicy` is a hardcoded packet number of the injection-bloat program, repeated as a magic string across five files:

- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:369` — `candidate: deliveryState.candidate ?? '004'`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:292` — `candidate: '004'`
- `.opencode/plugins/mk-skill-advisor.js:673` — `candidate: '004'`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:403` — `candidate: '005'`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:313` — `candidate: "006"`

`'004'`, `'005'`, `'006'` correspond to packet 004 (`full-first-route-only-repeats`), 005 (`gate3-relay-edge-triggering`), 006 (`pi-dispatch-and-compaction`) in the parent spec. Per `constitutional/comment-hygiene.md` the rule targets comments, but the same rot logic applies to magic strings in code: packet numbers are perishable labels (the program can be renumbered/reconsolidated) and are not named constants. Also violates DRY: the same literal is duplicated in 5 files with no shared constant. Confirmed introduced by commit `78ef96ae6b` (`git log -S`).

Alignment verdict: **gap** — should be a named constant (e.g., in `policy-plan.ts`) carrying a durable cell identifier, not the packet number.

### F2 — Comment-hygiene labels `(fix 2)`, `(fix 3)`, `(P1 fix)` in changed files (P2, pre-existing in changed files)

- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:984` — `// ── Local mirrors of gate-3-classifier's post-trio checks (fix 3)`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:1256` — `// INSIDE the try below (fix 2): request.env on a bare \`null\` throws before`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:1387` — `// See classifyIntent()'s matching comment (fix 2): normalization here is a`
- `.opencode/plugins/mk-spec-gate.js:59` — `// different state files, so once classify starts (P1 fix) enforce would`

`(fix 2)`, `(fix 3)`, `(P1 fix)` are ephemeral remediation-round / finding-severity labels that rot (provenance: pre-commit `57c3ed338ca` / `a62929d9c54`, pre-existing in files this commit touched). Comment hygiene is a hard constitutional gate for code comments. The durable WHY is already present in each comment — the parenthetical label should be dropped.

Alignment verdict: **gap** (comment hygiene).

### F3 — policy-plan.ts / render.ts delivery state machine ALIGNED

- TypeScript: explicit public API return types (`buildPolicyPlan`, `isObservedDeliveryReceipt`, `recordObservedPolicyDelivery`), `readonly` on all interfaces, `Object.freeze` on returned snapshots, no `any`, discriminated status types (`DeliveryStateName`, `HostReceiptStatus`). [policy-plan.ts:21-116]
- Epoch floor correctly applied: `isObservedDeliveryReceipt` requires `epoch >= 1` (line 427); `recordObservedPolicyDelivery` rejects `lifecycleEpoch <= 0` (line 866); `recordGate3ObservedEmission` rejects `epoch <= 0` (spec-gate-core.mjs:397). Matches the frozen epoch>=1 confirmation contract.
- Fail-open: every observation sink entrypoint wraps in try/catch returning null/no-op (`recordPolicyObservationReceipt`, `recordObservedPolicyDelivery`, `observeShadowRouteOnly`, `observeEmittedAdvisorPolicy`). [policy-plan.ts:842-907, render.ts:276-384]
- Comment hygiene: comments carry durable WHY, no spec paths or packet ids in comments.
- Naming: `isObservedDeliveryReceipt`, `receiptConfirmsDelivery`, `observationBindsToCell` follow boolean-question + descriptive naming conventions.

Verdict: **ALIGNED** (module-level).

### F4 — render.ts `'004'` fallback and `observeEmittedAdvisorPolicy` observation boundary (P1 finding on boundary semantics, not code behavior)

`render.ts:352-384` `observeEmittedAdvisorPolicy` records observed deliveries after the runtime places blocks into the emitted response. The fallback `candidate: deliveryState.candidate ?? '004'` at line 369 silently substitutes a default packet label when no candidate is supplied. This is an alignment gap (magic literal, see F1). The boundary semantics themselves (post-emission vs pre-return) match the frozen contract and are correctly documented in spec 007's risk-register. The `'004'` default makes the observation sink record a packet-004 cell even when the caller intended a different/unset cell — a silent default worth a named constant at minimum.

Verdict: **ALIGNED except F1** (magic literal).

### F5 — user-prompt-submit.ts / prompt-advisor.ts ALIGNED except F1

- `user-prompt-submit.ts`: fail-open at every error path (`emitDiagnostic` swallow, outer try/catch returning `{}`), binary-search prompt truncation `normalizePrompt`, bounded diagnostics, `observeEmittedAdvisorPolicy` called after output committed (line 289), `candidate: '004'` (F1). [user-prompt-submit.ts:289-293]
- `prompt-advisor.ts`: fail-open in every handler (`catch` → latch/force-unknown receipt), bounded stores (MAX_CAPTURED_SESSIONS, MAX_PI_RECEIPT_SESSIONS), `observeEmittedPiDispatch` as final pre-return step after output committed (line 489), `candidate: "006"` (F1). Double-quoted strings are consistent with the Pi-extension surface's own convention (matches the `@earendil-works/pi-coding-agent` style and sibling `.pi/extensions` files).

Verdict: **ALIGNED except F1**.

### F6 — spec-gate-classify.mjs (claude/codex/cursor/devin) + pi/spec-gate-classify.ts + mk-spec-gate.js: observer timing matches the frozen contract

- Four stdout-write adapters call `observeGate3QuestionDelivery` inside the `process.stdout.write` completion callback — strictly post-emission. [claude:70-78, codex:67-75, cursor:74-81, devin:73-80]
- Pi `spec-gate-classify.ts:55` observes as the final statement before `return output` (return-based hook). [spec-gate-classify.ts:49-56]
- `mk-spec-gate.js:223-232` observes after `output.system.push(result.question)` (post-commit into output).
- All fail open (`.catch(() => approve())`, `catch` returning allow/continue).
- The `runtime` label and `emitted: true` are passed correctly; `buildGate3ObservedReceipt(lifecycleEpoch)` builds the observed receipt; `gate3DeliveryConfirmed` floors at `epoch >= 1`. [spec-gate-core.mjs:287-295]

Verdict: **ALIGNED** (observer wiring).

### F7 — spec-gate-core.mjs mostly ALIGNED; one env-var documentation gap

- Fail-open everywhere: `readGateState` (missing/corrupt → `{}`), `writeGateStateAtomic` (→ false), `classifyIntent` catch evicts state and returns closed, `evaluateMutation` catch → allow, `observeGate3QuestionDelivery` catch → latch. [spec-gate-core.mjs:553-581, 1252-1361, 1386-1429]
- Atomic session-state persistence, bounded maps, path-secret redaction, no stdout/stderr from the core. Matches `lib/spec-gate/README.md` "never writes to stdout or stderr itself".
- Comment hygiene: mostly durable WHY; F2 labels `(fix 2)`/`(fix 3)` are the exception.
- The module's `GATE_3_DELIVERY_SUPPRESSION_ENV` (`MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`) is NOT documented in `mcp-server/ENV-REFERENCE.md` (grep found no `MK_SPEC_GATE` rows). That's a documentation gap for a load-bearing env flag the observer reads.

Verdict: **ALIGNED except F2 + env-var doc gap**.

### F8 — mk-skill-advisor.js / mk-spec-gate.js ALIGNED except F1/F2

- Plugins never print to stdout/stderr (all telemetry via state/logs/`statusSafePath`), boxed module headers present, `'use strict'`, bounded caches/in-flight maps, fail-open on all hook handlers. Matches `plugins/README.md` "Plugins do not print warnings to standard output or standard error" and the JS style guide header format.
- `mk-skill-advisor.js:673` `candidate: '004'` (F1); `mk-spec-gate.js:59` `(P1 fix)` (F2).

Verdict: **ALIGNED except F1/F2**.

## Sources Consulted

- [SOURCE: .opencode/skills/sk-code/sk-code-opencode/SKILL.md:1-185]
- [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:166-284]
- [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/typescript/quality-standards/overview-and-type-system.md]
- [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:38-77]
- [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30-54]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:412-429, 842-907]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:352-384]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:289-293]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:300-324, 435-491]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:287-295, 397, 1252-1361]
- [SOURCE: git log -S "'004'" 78ef96ae6b]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/risk-register.md:14-15]

## Assessment

newInfoRatio: 0.95
noveltyJustification: First iteration; all eight findings are new to this lineage packet and the file-by-file verdicts cover the full 12-file surface.

Key questions answered: Q1 (per-file verdicts), partial Q5 (comment hygiene + fail-open). Q2/Q3 (README freshness) and Q4 (must-fix split) remain open.

## Reflection

What worked: git `-S` provenance search proved the candidate literals were introduced by the audited commit; reading standards + code side-by-side gave file:line evidence.

What failed / ruled out: Reading the READMEs for delivery-confirmation language found NO README documents the epoch/confirmation/observer semantics (see iteration 2 — the READMEs are silent rather than contradicted). Ruled out: treating the `'004'` default as a behavior defect — behavior is frozen; it is an alignment/durability gap only.

## Recommended Next Focus

Iteration 2: README freshness. Determine which in-directory and adjacent READMEs (lib/README.md, hooks/README.md, lib/spec-gate/README.md, per-runtime hook READMEs, ENV-REFERENCE.md, plugins/README.md, injection-contract.md, skill-advisor-hook.md) are stale against the epoch>=1 receipt floor, post-emission observers, and byte-identical shadow delivery — quote the exact contradicted statement or confirm the silence is itself the finding.
