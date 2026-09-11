# Iteration 10: Angle 10 — DRAFT-VERSUS-REALITY

## Focus
Walk CHANGELOG-v4.0.0.0.md section by section; for every checkable claim record TRUE / STALE / FALSE / MISSING with the draft line and the repository line, prioritizing the sections the earlier angles found most wrong.

## INVENTORY — section-by-section verdicts (draft → reality)

| Draft section | Claim | Verdict | Actual state | SOURCE |
|---|---|---|---|---|
| Intro (L7) | "Seven hubs now share the same two-axis form" | STALE | Six hubs (cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop); sk-prompt is standalone | hub scan (it.1) |
| Intro (L7) | "routes correctly all thirteen times out of thirteen" | UNVERIFIED | Router-replay claim; not executable here | — |
| Intro (L11) | "memory_search, memory_save ... behave as before" | FALSE | No memory commands; /speckit:search is the retrieval front door | commands/speckit (it.2) |
| Intro (L11) | "/interface:* families ... behave as before" | FALSE | /interface:* deprecated (commit 4ac89951ca1); /design:{chart,diagram,extract} today | git log (it.9) |
| Intro (L11) | "a symlink and a deliberately tolerant gate keep the old paths alive" | TRUE | .opencode/specs → ../specs symlink exists | ls -la .opencode/specs |
| Glance (L21) | "joined by a new alignment (conformance-audit) mode" | FALSE | No alignment mode/command/schema anywhere | mode-registry; rg (it.3) |
| Glance (L23) | "authoritative record for all eight loop modes" | STALE | Seven ledger modes; alignment absent; deep-improvement-common present | append-mode-event.cjs (it.3) |
| Glance (L26) | "Diagrams across 27 types ... through new /create:* commands" | STALE | /create:diagram does NOT exist; diagram is /design:diagram (chart catalog says 26 forms) | commands find (it.5) |
| Glance (L31) | "Goals ... stored per workspace" | TRUE | .state/goal session-keyed; goal hook for opencode/cursor/pi | it.8 |
| Spec Kit & Memory (L57) | "specs moved ... compatibility symlink" | TRUE | specs/ + .opencode/specs symlink | ls |
| Spec Kit & Memory (L69-74) | Memory-engine paragraph (retrieval-shape axis, BM25/FTS fallback, bi-temporal edges, corpus reindex) | STALE | Memory engine decommissioned; lexical trigger-index + rg lane | retrieval/README (it.2) |
| Spec Kit & Memory (L80) | "Eight families of default-off features ... twelve flags kept, deleting one" | STALE | Dark-flag families belonged to the retired memory engine; no live flag evidence | it.2 |
| Spec Kit & Memory (L86) | "2,931 to 1,314 lines ... 175-line research doc instead of a 944-line one" | STALE (partial) | Core templates total 1,275 lines; research tmpl 946 with level gating; 175-line output unverifiable | wc (it.2) |
| Advisor (L98) | "state fully out of your spec folders is still in progress" | TRUE | .advisor-state containment code present, hole acknowledged | it.4 |
| Docs (L114) | "mode-registry.json ... workflowMode ... surface packet" | TRUE | Registry shape confirmed across 6 hubs | it.1 |
| Docs (L118) | "four /create commands renamed ... quality packet is sk-create-quality-control (with /doc:quality kept as an alias)" | STALE | skill/readme renames TRUE; /doc:quality alias NOT found | it.5 |
| Docs (L126-127) | "sk-create-diagram ... 27 types ... /create:diagram" | FALSE | No sk-create-diagram leaf, no /create:diagram | it.5 |
| Docs (L133) | "Kebab-case ... guard refuses new snake_case names" | TRUE | Strict validation hard-fails non-kebab | creation-workflow.md:304 |
| Docs (L139) | "benchmark result paths moved to the new grammar" | MISSING | No root benchmark/ tree; run-skill-benchmark.cjs moved under system-deep-loop/deep-improvement | find benchmark/ |
| Deep Loops (L149) | "deep-loop-workflows and deep-loop-runtime identities no longer exist" | TRUE | No such dirs | it.3 |
| Deep Loops (L149) | "router agent renamed deep → deep-loop, then retired" | TRUE (retired) | No deep-loop agent | it.1 |
| Deep Loops (L155) | "A new deep-alignment mode joins ... adapters cover sk-doc, sk-git, sk-design (static) and sk-code" | FALSE | No alignment surface at all | it.3 |
| Deep Loops (L163) | "any of the six external CLIs — ... cli-claude-code" | FALSE | cli-claude-code reserved but NOT wired (ExecutorNotWiredError) | executor-config.ts:400-405 |
| Deep Loops (L180) | "all eight modes ... now on new_authoritative_final" | STALE | Seven ledger modes; no alignment | it.3 |
| Orchestration (L196) | "gated fail-closed on its own binary being present" | TRUE | Readiness gates per leaf; executor-config binary checks | it.6 |
| Orchestration (L207) | "DeepSeek V4 Flash on the roster" (pi) | TRUE | PI_SUPPORTED_MODELS + default deepseek-v4-flash-vision-exp | executor-config.ts:182-214 |
| Hooks/Goals (L226) | "Devin goal hooks ... decommissioned" | TRUE | No devin/ in hooks/goal/ | it.8 |
| Hooks/Goals (L232) | "Pi subagent dispatch uses pi-subagents" | STALE | pi-subagents directive + injector hook REMOVED (commit 1f382f64a49); native subagents by absence | git log (it.9) |
| Hooks/Goals (L246) | "around ninety-six of them" (hook symlinks) | STALE | 102 symlinks | it.8 |
| Hooks/Goals (L247) | "twenty concerns beneath it" | STALE | 21 concern dirs | it.8 |
| Hooks/Goals (L248) | "hook-flags.env ... missing file fails open" | TRUE | hook-flags.env + .example present | ls |
| Hooks/Goals (L250) | "Gate-3 spec question now stays quiet on read-only turns" | TRUE | gate-3-classifier.ts ships | ls shared/ |
| Design (L260) | "1,290 Refero styles ... 129 MB across 7,744 files" | STALE (approx) | styles/ = 135M with database+library; exact counts unverified | du (it.7) |
| Design (L266) | "A shared nine-stage contract under /interface:*" | FALSE | /interface:* deprecated; design commands chart/diagram/extract | it.9 |
| Design (L272) | "private layer of fourteen procedure cards" | UNVERIFIED | Not checked; design hub reinstated (08c9d0605d6) | git log |
| Design (L278) | "Open Design ... removed end to end" | TRUE | Breaking retire commit a38f8d7da78 | git log |
| Code (L293) | "All 128 relocated files were repointed" | UNVERIFIED | Not countable statically without the commit; mode/surface shape confirmed | — |
| Code (L293) | "router benchmark rose from 44 to 71" | UNVERIFIED | Benchmark not runnable here | — |
| Code (L305) | "Rust ... first-class on the opencode surface" | UNVERIFIED | No rust reference docs found under sk-code-opencode/references in this pass | it.7 |
| Git (L321) | "Only main, skilled/v* releases, and names you have added to an allowlist file go up without asking; enforced ... as a pre-push hook" | TRUE | remote-branch-allowlist.txt + scripts/hooks/ + push policy docs in sk-git | it.7 |
| Git (L327) | "blocks any commit or push that removes more than a threshold (default 100) of tracked files" | UNVERIFIED | Mass-deletion guard not traced this pass | — |
| Git (L333) | "grammar is <skill>/{NNNN}-{slug} ... owner-first form" | STALE | worktrees/NNN-slug or branches/NNN-slug; owner-first REJECTED | worktree-naming.sh (it.7) |
| Git (L335) | "GitKraken MCP was wired in" | FALSE | Zero gitkraken references | it.7 |
| Prompt (L345) | "sk-prompt ... two modes over one shared structure" | FALSE | Standalone single-leaf sk-prompt (v3.0.0.0) | it.1 |
| Prompt (L345) | "/prompt is now /prompt-improve" | FALSE | Command is /prompt:improve | commands/prompt/improve.md |
| Prompt (L361) | "sk-prompt-models is a mode now" | FALSE | No prompt-models artifact exists | it.7 |
| MCP (L371) | "sixth canon-clean parent ... all thirteen" | STALE | mcp-tooling is one of six hubs; replay count unverifiable | it.1 |
| MCP (L395) | "mcp-figma ... now lives at .opencode/skills/mcp-tooling/mcp-figma/" | TRUE | Nested leaf exists | ls |
| Communication (L430) | "drop a git-ignored enablement.local.json" | TRUE | enablement.local.json.example ships | it.7 |
| Upgrade (L440) | "sk-prompt-small-model → sk-prompt-models" | FALSE | No sk-prompt-models on branch | it.7 |
| Upgrade (L441) | "the deep router agent is now deep-loop" | STALE | Agent retired, not renamed | it.1 |
| Upgrade (L442) | "cli-gemini and cli-copilot are gone" | TRUE | Absent from tree | it.6 |
| Upgrade (L444) | "Only main, skilled/v* releases ... push without asking" | TRUE | Allowlist + hooks | it.7 |
| Upgrade (L444) | "upgrading-a-skill-to-v4.md" guide | TRUE | File exists | ls |

## DRIFT (new rows only; prior angles carried the rest)

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| L11 | "a symlink ... keeps the old paths alive" | TRUE | .opencode/specs → ../specs symlink present | — | Confirmed | ls -la .opencode/specs |
| L139 | "every run lands in one dated folder grammar under benchmark/reports/" | MISSING | No benchmark/ tree at repo root; per-skill benchmark/ dirs only | P2 | Reports grammar not found at the claimed root | find benchmark/ |
| L232 | "Pi subagent dispatch uses pi-subagents unless you explicitly name a cli-* mode" | STALE | pi-subagents directive and injector hook were removed (1f382f64a49); native subagents are now the default by absence | P1 | Remove the pi-subagents mention; default is native by removal | git log 1f382f64a49 |
| L444 | "resource paths moved to hyphen-case" | TRUE | Kebab guard + hyphenated command paths | — | Confirmed | creation-workflow.md:304 |

## Sources Consulted
- CHANGELOG-v4.0.0.0.md (all 457 lines), synthesis of iteration 1-9 evidence, plus: ls -la .opencode/specs, find benchmark/, commands/prompt/improve.md, ls hooks/hook-flags*

## Assessment
- **newInfoRatio**: 0.6 — the walk consolidates prior angles; new rows: symlink, benchmark grammar MISSING, pi-subagents removal, hook-flags confirmation.
- **Confidence**: Confirmed rows from tree state + git log; UNVERIFIED rows marked (router replay counts, 128-file repoint, 44→71 benchmark, mass-delete threshold, 14 procedure cards).

## Reflection
- Worked: consolidating ten angles into one section-by-section verdict table.
- Failed: claims requiring execution (router replays, benchmark runs) stay UNVERIFIED by contract.
- Ruled out: re-reading draft sections already fully adjudicated in earlier angles (counted once).

## Recommended Next Focus
Synthesis: assemble research.md — complete inventory by hub, ranked drift table across all ten angles, upgrade-notes candidate list, disagreements for the reproduction pass; stopReason maxIterationsReached.
