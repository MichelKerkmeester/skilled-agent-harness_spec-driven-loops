---
title: "Resource Map — swe-2-max detached lineage"
trigger_phrases: []
---
# Resource Map — swe-2-max detached lineage

Emitted at synthesis. No parent `resource-map.md` was present at phase initialization, so this lineage treated the source inventory below as newly discovered evidence.

## Framework root documents

| Resource | Role | Iterations |
|---|---|---:|
| `AGENTS.md` | Gate 5 contract (93-101), §8 reply-fired rule loader (259-263), §4 read-only binding (153), Confidence Thresholds, Restraint Signals | 1, 3, 4 |
| `REPO RULES.md` | Trigger table (40-52), precedence (22-27), §4 scope boundary (79-114) | 1, 3, 4 |
| `.claude/settings.json` | PreToolUse/PostToolUse/UserPromptSubmit hook wiring precedent | 3 |

## Rule corpus

| Resource | Role | Iterations |
|---|---|---:|
| `.skilled/repo-rules/` (13 files) | Corpus inventory; trigger_phrases frontmatter on every file | 1, 3 |
| `.skilled/repo-rules/blast-radius.md` | Frontmatter/phrase exemplar (17 phrases) | 1, 2 |
| `Public/repo-rules/` | Root alias layer: 13 symlinks into `.skilled/repo-rules/` | 3 |
| `Obsidian Plugin/repo-rules/` + `REPO RULES.md` | Live federation: double symlink chain + 3 sibling-local rules + own router | 3 |

## Advisor runtime

| Resource | Role | Iterations |
|---|---|---:|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Brief composition, token caps (80/120), directive append sites, fallback heads | 2 |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` | Dedup decision logic: suppression vs full delivery, fail-open | 2 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts` | Recommendation kinds `skill|command` only — no rule corpus | 4 |

## Retrieval runtime

| Resource | Role | Iterations |
|---|---|---:|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | CORPUS_ROOTS exclusion, symlink/out-of-root refusal, dedupe-by-realpath | 1, 2, 3 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Gate 1 lookup: artifact path, result shape, exit codes | 2 |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Committed artifact: 3,738,528 bytes, 33,688 phrases | 2 |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Coverage table; the recorded repo-rules exclusion decision (:284) | 1, 2, 4 |

## Hooks and injection

| Resource | Role | Iterations |
|---|---|---:|
| `.skilled/hooks/injection-contract.md` | Channel catalog + per-runtime visibility tags | 1, 2, 3 |
| `.skilled/hooks/README.md` | Kill-switch index, portability model (concern folders + per-runtime adapters) | 3 |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Once-per-session mutation marker (GATE_3_MUTATION_NOTICE, recordGate3NoticeDelivered) | 3 |
| `.skilled/skills/.state/spec-gate/spec-gate-warnings.log` | Measured advise rate: ~1-33/day | 3, 4 |
| `.skilled/logs/` | Hook telemetry directory (no Gate-5 miss telemetry exists) | 3 |

## Prior spec work

| Resource | Role | Iterations |
|---|---|---:|
| `specs/hooks/022-smart-rule-injection/decisions.md` | Injection bar, 18 refusals, measurement rule | 1, 2, 4 |
| `specs/hooks/022-smart-rule-injection/001-deep-research/implementation-summary.md` | The bar + promotion remedy | 1, 3, 4 |
| `specs/agents/010-repo-rule-system-integration/research/synthesis.md` | Federation discovery, trigger-row coverage gap, itemized open work | 1, 2, 3 |
| `specs/agents/010-repo-rule-system-integration/research/cross-lineage-synthesis.md` | Three-family confirmations (C2 Gate-5-on-write), open items 18/28 | 1, 3, 4 |
| `specs/agents/016-repo-rule-advisor-surfacing/spec.md` | Packet contract, problem statement, scope | 1, 3 |

## Live probes run

| Probe | Result | Iterations |
|---|---|---:|
| `lookup-trigger-index.mjs --json --scoring-only -- "name the rollback first before force pushing"` | `results: []` — exclusion confirmed live | 2 |
| `ls -la` on `Public/repo-rules/`, `Obsidian Plugin/`, `Obsidian Plugin/repo-rules/` | Double symlink chain + sibling-local rules + sibling-owned router | 3 |
| node `readdirSync`/`realpathSync` on sibling `.skilled/repo-rules` vs `repo-rules` | Linked-dir entries index; root file-links skip as out-of-root | 3 |
| `awk` date histogram on `spec-gate-warnings.log` | ~1-33 advises/day (corrected iter-3 estimate) | 4 |
