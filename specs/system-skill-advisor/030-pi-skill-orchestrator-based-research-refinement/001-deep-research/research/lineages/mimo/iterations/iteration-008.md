# Iteration 8 — RQ7: Robustness patterns — conservative removal, atomic writes, visibility flags, compat tests

Focus: which of the extension's robustness patterns the advisor lacks, and which would matter here.

## Findings

### F8-1 — Conservative "warn, never blind-delete" has a fail-closed counterpart in the advisor

- **Orchestrator mechanism** [CONFIRMED]: unknown catalog formats are detected but never deleted —
  warn once and return the prompt unchanged
  (`context/pi-skill-orchestrator-main/src/index.ts:309-318`, `catalog.ts:163-188`;
  documented at `docs/architecture.md:121-123`; malformed-future-format test at
  `tests/catalog.test.mjs:97-109`).
- **Advisor counterpart** [CONFIRMED]: the advisor never mutates prompt source, and its renderer
  fails closed on the one thing it does emit: a skill label that looks instruction-shaped after
  folding is rejected and the brief emits nothing
  (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:83-84`, `:129-145`, `:380-383`).
- **Proposed change**: none. The two patterns are the same principle pointed at different
  boundaries — never let untrusted shape cross into prompt space.
- **Benefit**: recorded equivalence prevents a future phase from "adding" warn-not-delete where
  there is nothing to delete.
- **Cost**: none.
- **Risk**: none.
- **Verdict: REJECT** — the pattern is already embodied as fail-closed emission; the extension's
  variant is only meaningful for a prompt-rewriting extension.

### F8-2 — Write durability: tmp+rename vs append-atomic vs delegated fail-safe

- **Orchestrator mechanism** [CONFIRMED]: single-file JSON config writes are atomic — unique tmp
  name, `writeFileSync`, `renameSync`, best-effort tmp cleanup
  (`context/pi-skill-orchestrator-main/src/profiles.ts:61-68`, used at `:199`, `:204`); a config
  read error falls back to in-memory defaults *without overwriting files*
  (`context/pi-skill-orchestrator-main/src/index.ts:262-268`).
- **Advisor counterpart** [CONFIRMED]: the metrics log relies on single `O_APPEND` sub-PIPE_BUF
  line appends (`.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:303`); the directive
  lifecycle store delegates all filesystem work to a descriptor-anchored helper and, when the
  invariant cannot be proven, declares durable suppression unavailable and retains full delivery
  (`.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:3-6`,
  helper timeout/output caps at `:26-27`).
- **Proposed change**: none. The advisor writes no single-file JSON config of the extension's
  shape; its two durable surfaces each carry an equivalent-or-stronger guarantee.
- **Benefit**: avoids importing a write pattern for a file class that does not exist here.
- **Cost**: none.
- **Risk**: none.
- **Verdict: REJECT** — durability is already property-equivalent; the transplant would be
  ceremony.

### F8-3 — `disable-model-invocation` is honored by the extension and invisible to the advisor

- **Orchestrator mechanism** [CONFIRMED]: the flag maps to `modelVisible: false` at ingestion
  (`context/pi-skill-orchestrator-main/src/catalog.ts:38`, `:16-18`); manual-only skills are
  excluded from active and global automatic discovery
  (`tests/scope.test.mjs:131`), the `skill` loader blocks them with an explicit message
  (`index.ts:716-721`), automatic dependency edges skip them while explicit autoload may include
  one deliberately (`dependencies.ts:77-82`, `tests/dependencies.test.mjs:73-89`).
- **Advisor counterpart** [CONFIRMED by absence]: no advisor runtime module reads
  `disable-model-invocation` or `modelVisible` (no match under `runtime/`); the only exclusion
  mechanism is the operator-maintained route-exclusions denylist
  (`.skilled/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:5-13`). The flag
  is part of the shared skill contract vocabulary
  (`.skilled/skills/sk-doc/shared/assets/skill-contract.json`) and Pi enforces it at load time, so
  a brief that recommends a manual-only skill sends the model at a door it may not open.
- **Proposed change**: read the flag into the projection (the frontmatter parser at
  `runtime/lib/skill-graph/doc-frontmatter.ts:89-139` already parses skill doc metadata) and
  filter or deprioritize manual-only skills in `advisor_recommend` output and the brief.
- **Benefit**: briefs stop recommending skills the runtime will refuse to self-invoke.
- **Cost**: one field in the projection + one filter in the handler.
- **Risk**: the flag's meaning is Pi-specific; other runtimes may allow what Pi forbids — mitigate
  by demoting (not deleting) with a visible reason, matching the extension's explicit-message
  style (`index.ts:718`).
- **Verdict: ADOPT** — this is the one robustness flag with a direct cross-runtime consequence and
  zero advisor-side handling today.

### F8-4 — Compatibility-test discipline: contract guards, not just behavior tests

- **Orchestrator mechanism** [CONFIRMED]: `pi-compatibility.test.mjs` pins the extension's
  contract with Pi itself — peer-dependency `'*'` ranges and no bundled copies
  (`context/pi-skill-orchestrator-main/tests/pi-compatibility.test.mjs:16-26`), manifest + Node
  minimum (`:28-32`), a deep-import ban on Pi internals (`:34-42`), mandatory tool parameter
  schemas (`:45-52`), public-hook usage and shutdown cleanup (`:55-80`).
- **Advisor counterpart** [CONFIRMED]: behavioral hook tests exist —
  `runtime/tests/hooks/prompt-advisor.vitest.ts`, `runtime-parity.vitest.ts`,
  `settings-driven-invocation-parity.vitest.ts`
  (`.skilled/skills/system-skill-advisor/runtime/tests/hooks/` listing) — but no equivalent
  static contract guard banning deep imports of Pi internals from the hook surface
  [INFERRED from absence — would confirm by searching those tests for an import-shape assertion;
  the hook itself imports only the type root
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:5`), so today's code passes
  such a guard trivially].
- **Proposed change**: add a static test mirroring `pi-compatibility.test.mjs:34-42` over
  `hooks/pi/**` — no `@earendil-works/pi-*/` deep paths — and, if the hook is ever packaged,
  the peer-range guard at `:16-26`.
- **Benefit**: a Pi refactor that breaks deep imports fails the advisor's suite instead of a
  dispatch at runtime.
- **Cost**: one small test file.
- **Risk**: none.
- **Verdict: ADAPT** — borrow the contract-guard test shape to the advisor's hook layout; the
  behavioral tests stay as they are.

## Ruled out this iteration

- The extension's runtime-records/notification patterns (`src/notifications.ts`,
  `tests/runtime-records.test.mjs`) — UI/session plumbing, not advisor robustness.
- Token Saver's transform-failure passthrough — tool-result compression, out of scope.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Extension: warn-not-delete on unknown catalogs; atomic tmp+rename config writes | CONFIRMED | — (`catalog.ts:163-188`, `profiles.ts:61-68`) |
| Advisor renderer fails closed on instruction-shaped labels | CONFIRMED | — (`render.ts:83-84,129-145,380-383`) |
| Advisor durable stores are append-atomic or fail-safe-delegated | CONFIRMED | — (`metrics.ts:303`, `directive-lifecycle-file-store.ts:3-6`) |
| No advisor module reads `disable-model-invocation` | CONFIRMED (absence grep over `runtime/`) | — |
| The advisor hook tests contain no Pi import-shape guard | INFERRED | Read the three hook test files and confirm no deep-import assertion |
| A brief can recommend a manual-only skill on Pi today | INFERRED | Construct a skill with the flag set and run `advisor_recommend` against a mentioning prompt |
