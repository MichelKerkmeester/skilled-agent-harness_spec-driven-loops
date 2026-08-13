# Iteration 18: Gap Check — Transcript Search/Navigation + Session Cost Guard

## Focus
Fill the two weakest corners identified by the axis audit: in-session transcript search/navigation, and the token/cost rendering depth (axis 1b) as an agent-control signal. Prior art: Claude Code's documented search/navigation gaps (community transcript tools), Coder's session cost-guard UX, mobile search UX rules.

## Findings

### F1. The reference's transcript navigation is an open gap — community tools prove demand
- Claude Code stores JSONL transcripts; browsing requires third-party tools (claude-devtools, claude-transcript-viewer with hybrid FTS+vector search, collapsible cells) ([SOURCE: claude-dev.tools/docs/transcripts], [SOURCE: github.com/varunr89/claude-transcript-viewer]).
- Documented official gaps: no conversation browser with rename/search (issue #26730), no in-session search/bookmarks for long sessions (issue #59708 — "terminal scrollback is the only mechanism"), no session manager UI for browse/resume (issue #46862) ([SOURCE: github.com/anthropics/claude-code/issues/59708]).
- Implication: transcript navigation is an **unclaimed differentiator** — Pi can ship it first-class in the PWA.

### F2. Cost as an agent-control signal (Coder's session cost guard)
- Persistent cost chip beside Run/Stop (`$1.84 / $3.00 · 61%`); Cost Drawer with live spend, budget state, forecast, attribution, top cost drivers; progressive alerts: 50% quiet milestone, 75% yellow chip + toast, 90% sticky warning requiring a choice, 100% red + pause with recoverable extension ("Paused — budget reached. Add $2.00 and continue from checkpoint"); pre-run estimate sheet with range, breakdown, confidence, budget selector, and behavior-at-cap ([SOURCE: coder.com/docs/ai-coder/agents/platform-controls/usage-insights], [SOURCE: forge-x.dev]).
- Principle: present cost as a control signal (what it spent, why, what happens next, lowest-friction action), not a billing dashboard.

### F3. Mobile search UX rules
- Search at top, always visible, debounced (~200ms), clear button, recent searches; filter chips; results with context snippets ("right nuggets, minimal text") ([SOURCE: algolia.com/blog/ux/mobile-search-and-discovery...], [SOURCE: ethora.com/blog/chat-app-ui-ux-design/]).

## Design: gap fills

### Transcript search + navigation (PWA)
- **Search surface**: always-visible search bar on the transcript screen; device-local FTS over the *redacted projection* cache (axis 5/16) — the server never indexes content (privacy by construction); filter chips by kind (text / thinking / tool / diff / todo / error); debounced input; results show context snippets around the match.
- **Navigation unit = (epoch, seq)**: every search result and bookmark anchors to an envelope position; deep links `pi-remote://transcript/{s}/{epoch}/{seq}` scroll the transcript exactly; works with replay/snapshot barriers (axis 3) because positions are monotonic.
- **Bookmarks**: device-local markers on (epoch, seq) with labels; jump list in the transcript header; survives cache eviction only as "position" (re-fetched on demand).
- **Session-level**: label search (axis 5) + recent sessions; optional future semantic search runs device-side only (privacy-safe).

### Session cost guard (axis 1b completion)
- **Persistent chip** in the run header: `$1.84 / $3.00 · 61% · model` — from `transcript.usage` events (iteration 3); tap opens the Cost Drawer.
- **Cost Drawer**: live spend (dollars, input/output/cache/thinking tokens), budget state ("On track / Approaching / Paused at limit"), **local forecast** computed from the usage stream's run rate, top cost drivers (context reads, retries, test loops), controls (pause, adjust budget, stop).
- **Progressive alerts** (Coder thresholds): 50% quiet inline; 75% yellow chip; 90% sticky warning requiring a choice; 100% → `run.parked` with reason `budget` (reuses axis-6 parking — recoverable: "continue from checkpoint" after budget change). Never auto-stop mid-mutation: cap applies at the next step boundary (lease settlement), matching "finish current step then pause".
- **Pre-run estimate sheet** on `session.create` (axis 6): estimated range, breakdown, confidence, budget selector, behavior-at-cap — so "start work while away" always has a bound.
- **Cross-session budget ring** (axis 8): per-host aggregate with per-session allocation; new `session.create` blocked with explicit reason when the aggregate is exhausted.

### Why this exceeds the reference
- Reference: no in-session search, no bookmarks, no session manager (three open issues); cost only via `/usage` and end-of-session reports.
- Pi: first-class seq-anchored search + bookmarks in the PWA, and a live, local, forecast-capable cost guard with recoverable parking — cost as a control signal, matching the emerging best-in-class pattern (Coder) while staying fully device-local.

## Sources Consulted
- [SOURCE: https://github.com/anthropics/claude-code/issues/59708]
- [SOURCE: https://github.com/anthropics/claude-code/issues/26730]
- [SOURCE: https://github.com/anthropics/claude-code/issues/46862]
- [SOURCE: https://claude-dev.tools/docs/transcripts]
- [SOURCE: https://github.com/varunr89/claude-transcript-viewer]
- [SOURCE: https://coder.com/docs/ai-coder/agents/platform-controls/usage-insights]
- [SOURCE: https://www.algolia.com/blog/ux/mobile-search-and-discovery-how-to-create-ultra-user-friendly-ux]

## Assessment
- newInfoRatio: 0.45
- Novelty justification: seq-anchored search/bookmarks and the local-forecast cost guard mapped onto parking are new consolidations; reference gaps and Coder's cost-guard pattern are cited prior art.
- Confidence: high.

## Reflection
- What worked: mining the reference's *open issues* as a feature roadmap — three confirmed unclaimed differentiators.
- What failed / ruled out: server-side transcript indexing (content boundary); semantic search on server (privacy); hard auto-stop mid-mutation at budget cap (safety — park at step boundary instead).
- Ruled out: cost dashboard without control affordances.

## Recommended Next Focus
Gap check pass 2: audit remaining corners — approval UX on desktop-browser fallback surface, error-class attention detail, and the transcript "waiting" affordance (what the phone shows while a lease is pending).
