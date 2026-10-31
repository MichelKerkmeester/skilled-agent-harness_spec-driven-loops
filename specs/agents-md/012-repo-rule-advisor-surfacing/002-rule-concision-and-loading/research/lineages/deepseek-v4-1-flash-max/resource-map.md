# Resource Map — repo rule loading design research (lineage deepseek-v4-1-flash-max)

Emitted from this lineage's deltas (`deltas/iter-001.jsonl` … `iter-004.jsonl`). Lists the sources consulted and the themes each contributed; it is inventory, not net-new findings.

## Consulted sources by theme

### Current load path and corpus
- `AGENTS.md` (root) — Gate 5 firing contract, §8 reply-rule pointer line, §1/§4 binding clauses, truncation observed in the delivered block
- `REPO RULES.md` (root) — trigger table, action-matching rule, index summaries (card proxy 2,509 B)
- `.skilled/repo-rules/*.md` — 13 rule files, 107,092 B; card proxy sections measured (935-1,784 B per rule)
- `~/.claude/CLAUDE.md` — symlink to root `AGENTS.md` (verified); `.devin/SYNC.md` (inheritance note); `.codex/AGENTS.md` / `.codex/SYNC.md` (separate global doc)

### Steer and packet
- `steer.md` (lineage directory; read before every iteration; checksum recorded)
- `prep/evidence-pack.md` (§1 token load, §2 read frequency, §3 compliance baseline)
- `specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/spec.md` (packet requirements)
- `../../001-advisor-surfacing/research/research.md` (surfacing verdict; refusals; measure-first)

### Hook machinery and dedup precedents
- `.skilled/hooks/injection-contract.md` (§2 prompt-time, §3 tool-time, §4 lifecycle, §5 runtime inspection)
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`, `directive-lifecycle-contract.ts`, `directive-lifecycle-file-store.ts`, `directive-lifecycle-store.py`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `directive-lifecycle-boundary.ts`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`
- `.skilled/plugins/system-skill-advisor.js` (OpenCode mirror)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (`gate3DeliveryMarker` line 364; marker fields 352-354)
- Boundary owners: `runtime/hooks/claude/session-prime.ts`, `runtime/hooks/devin/post-compaction.cjs` + `session-start.js` (dist), `runtime/hooks/cursor/session-start.js` (dist), `.cursor/hooks/precompact.js`, `runtime/hooks/codex/session-start.js` (dist), `.codex/hooks.json`
- Runtime registrations: `.claude/settings.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json`, `.codex/hooks.json`

### Rule authoring contract
- `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` (MUST elements; length bands)

### Prior decisions
- `specs/hooks/022-smart-rule-injection/decisions.md` (measurement rule, admission bar — cited via 001)

## Themes by iteration
- Iteration 1: seven load paths with measured bytes and triggers; the 16,384-byte delivered-block truncation; spec-gate notice size; compaction as the observed re-read boundary.
- Iteration 2: five-option matrix with five fields each; card-size bounds (2,509 B index form; 17,882 B full proxy); reset-semantics mismatch between the two dedup precedents.
- Iteration 3: marker/storage/reset/coverage for the hook design; boundary wiring enumerated on all six runtimes; transcript-evidence dependency; delivered-set keying gap.
- Iteration 4: answers per part of the Question line with falsifiers; consistency with the 001 refusals.

## Coverage note
Every load-bearing claim cites `file:line` or a measurement from `prep/` or this lineage's own read-only measurements (`wc -c`, section parsers, node import probe). UNKNOWN rather than estimated: session-start recovery block size, per-window fire counts, per-runtime transcript availability, Cursor live delivery.
