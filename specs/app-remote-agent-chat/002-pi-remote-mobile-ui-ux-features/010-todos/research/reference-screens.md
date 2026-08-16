# 010-todos — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.

Real-screen evidence for pi's todos surface (render pi's todo/plan list in the mobile chat — clear task states, progress, grouping, live updates, referencing Manus/Claude agent task lists), gathered from Refero (platform `ios`) via the code-mode `call_tool_chain`. Mobbin's `mobbin_search_screens` was queried for six todo-related queries (`AI agent task list`, `todo checklist progress`, `agent steps progress`, `task tracker mobile`, `plan checklist AI`, `AI todo list chat`) and returned **zero** results on every one, so no mobbin.com URLs are cited — nothing is fabricated. All 14 cited screens below are Refero records with their canonical `refero.design/screens/…` URLs.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| BoldVoice | https://refero.design/screens/a42eb4ce-58c2-4676-86fe-39f437b74a4d | **Progress + goals panel overlaid on an AI chat.** Conversational background with a "Your Goals" panel: motivational line, circular progress star, and a goal list with fraction progress — the closest real capture of an agent-scoped todo panel living over the transcript. |
| BoldVoice | https://refero.design/screens/841f3ea3-8aee-487b-8d19-ee4c34682ea1 | **Conversation-scoped goal list with agent identity.** Dark chat surface (avatar with "AI" badge) presenting the goals the assistant tracks for the current conversation — a todo list bound to the active chat, not a global task app. |
| BoldVoice | https://refero.design/screens/95ad0eae-4cd3-4a82-9e55-4ec9cfea2b59 | **All-complete confirmation state.** Congratulatory panel ("Perfect, you've completed your goals") shown when every goal in the conversation is done — an explicit all-done/complete state for a chat-bound task list. |
| Monday.com | https://refero.design/screens/bfb3d70d-72b4-494a-953c-db36aa30d7f0 | **Count + hairline progress.** "Checklist 3/3" in the header with a thin horizontal progress bar above the checklist items — the compact count-and-progress affordance pattern for a todo panel. |
| Meta AI | https://refero.design/screens/ce9d5fda-92f1-4753-bf40-194eea51ecfc | **Dark workflow/progress panel.** Rounded-corner panel on near-black with charcoal surfaces and muted typography presenting an agent work/progress surface — a calm, monochrome live-progress precedent that maps cleanly onto ink-on-parchment. |
| Meta AI | https://refero.design/screens/af9c4797-d97a-4320-bc76-2cd3f0475a8b | **In-progress agent task.** AI content-creation workflow ("presentation generator in progress") on a clean light canvas with rounded cards — an explicit running/in-progress state for an agent task. |
| Meta AI | https://refero.design/screens/327d242c-d0b2-4e7a-a3f3-9fa49627f492 | **Stacked step/activity feed.** Vertically stacked progress feed on near-white with editorial typography and subtle dividers — a grouped, low-chrome step list presentation (contrast caution: muted graphite text). |
| Structured | https://refero.design/screens/c02ea4ca-f552-4c74-b7e6-51d2f7d55031 | **AI plan → task list.** Vertically scrollable list of AI-generated tasks, each a light card with a category icon — how an AI planner renders its generated plan as a task list. |
| Structured | https://refero.design/screens/9787e75a-6ce9-4be6-bc9f-ab5ccd87f480 | **Grouped AI plan sections (dark).** AI task-planning modal with collapsible sections and a dark container — grouped/collapsible plan sections that stay readable in dark parchment. |
| Structured | https://refero.design/screens/215c455c-33f4-47a0-b036-bca4693e62cc | **Plan surface with provenance heading.** AI planning-assistant sheet: product heading + greeting before the plan body — precedent for a plan panel that names its generator (cf. "pi's plan"). |
| Asana | https://refero.design/screens/e411ec40-ec2c-4b10-a15c-3e3c6e1d5e5c | **Status grouping.** Task list grouped into collapsible "To do / Doing / Done" sections, checkbox rows with assignee — the exact state-grouping model for pi's pending/active/done/blocked tasks. |
| Asana | https://refero.design/screens/f650bb54-bb86-4e57-8b3e-be2d1876be9c | **Filter-by-status list.** "My Tasks" list with pill-shaped status filter chips and a view dropdown — lightweight status filtering over a task list. |
| Todoist | https://refero.design/screens/f8cc3bdf-7b16-453f-9538-b9fafe1cebd6 | **Completion summary.** Inbox list with a task-completion summary and success treatment — a quiet "how much is done" summary over plain task rows. |
| Gmail (Otto) | https://refero.design/screens/0b7609ee-7526-4349-bc37-f5af6982f773 | **Task updates inside a chat thread.** Conversation thread showing task-management messages ("via Tasks") timestamped "1 min" — live todo updates surfacing inline in the transcript. |

## Reference-backed UI/UX direction

Concrete direction for pi's todos in Pi Remote's fixed ink-on-parchment system (bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA) and read-only-by-default security posture, grounded in the screens above.

1. **Render the todo list as an inline parchment panel inside the transcript, not a blocking sheet.** Follow BoldVoice's goals panel (a42eb4ce, 841f3ea3) and Gmail/Otto's in-thread task messages: the todo surface is a bordered, hairline-ink parchment panel that arrives and updates inside the message stream. Header = agent identity + "todo" label in Source Serif 4; the transcript stays fully readable, nothing disappears behind a scrim (contrast with Structured's full bottom-sheet approach, c02ea4ca).

2. **One task per row with a typographic, color-free state marker.** Rows are thumb-sized (≥44pt hit area), hairline-separated, each with an ink state glyph: pending = hollow square, active = clay square (clay `#d97757` is the single allowed accent), done = carbon-ink check, blocked = dash/hatch — echoing Monday.com's checklist rows (bfb3d70d) and Asana's checkbox rows (e411ec40) but expressed only through ink/clay so it passes AA on both bone and dark parchment.

3. **Progress as a header count + thin hairline, never a ring or fill.** "3/8" count plus a 2–3px clay/ink progress hairline under the header (Monday.com "Checklist 3/3" + thin bar, bfb3d70d). Skip BoldVoice's circular star indicator (a42eb4ce) — it reads as gamification; a hairline fits the typographic, low-chrome system. In dark mode the hairline is clay on ink, still AA.

4. **Group tasks by state in collapsible sections.** Use Asana's "To do / Doing / Done" grouping (e411ec40), extended with "Blocked": collapsible ink headers with per-group counts. Collapsing is a view-only affordance — it never reorders or mutates the host-projected list, preserving the read-only posture. Keep section headers sticky within the panel for long plans.

5. **Live updates without full reflow.** When pi projects a new task state mid-run, update the affected row in place with a reduced-motion-friendly state change (row glyph + a brief hairline pulse), mirroring Meta AI's in-progress workflow (af9c4797, ce9d5fda) rather than re-rendering the panel. Show a quiet "updated" ink timestamp per changed row, after Gmail/Otto's in-thread "1 min" timestamps (0b7609ee).

6. **Plan provenance in the panel header.** Name the generator ("pi's plan") in Source Serif 4 so the list reads as host-projected, after Structured's provenance heading (215c455c, 9787e75a). Because todos are read-only-projected, the only actions offered are view-level (refresh, collapse groups); there is no check/box-to-mutate path. Completing all tasks collapses the panel to a single "all done" line (BoldVoice 95ad0eae) rather than showing a celebratory screen.

7. **A11y and reduced motion.** Announce state changes politely via a live region; expose each row as a listitem with a status text (`pending`/`active`/`done`/`blocked`) so state is never conveyed by glyph alone; state changes respect `prefers-reduced-motion` (no pulse). Keep secondary text and group headers AA on both bone and dark parchment (Meta AI's muted graphite step feed, 327d242c, is a caution — its low-contrast body text must be darkened in our system).

## Coverage gaps

- **No Mobbin captures.** Mobbin's daemon returned zero results on all six queries (consistent with prior gates), so all evidence is Refero-only; no mobbin.com URLs are cited.
- **No direct Manus capture surfaced.** The "Manus task list" query returned ElevenLabs and Asana noise, not Manus itself; no Manus mobile task-list screen is available in this corpus.
- **No Claude task-list capture surfaced.** The "Claude task list" query returned a Claude chat rename-modal (de79c85c) plus model-selector sheets from Raycast/Comet — not a todo list; Claude's canonical task-list UI remains unverified here.
- **No explicit "blocked" state precedent** was found in any capture, nor a cancel/abort affordance for an in-flight task; both remain spec-design decisions grounded only in the state-grouping patterns above.
- **No live task-ticker (agent actively streaming states) capture.** Meta AI's workflow/progress screens (ce9d5fda, af9c4797) are the closest, but no capture shows a running agent list that ticks done one-by-one in real time.
- **No ink-on-parchment task-list precedent** in the corpus; the nearest colorway remains Claude's warm parchment chat (captured in the 009 gate) and BoldVoice's dark panels, so the parchment mapping below is derived, not screenshotted.
