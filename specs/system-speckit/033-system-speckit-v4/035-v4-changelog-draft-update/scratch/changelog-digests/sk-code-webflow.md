# sk-code-webflow changelog digest

Skill path: `.opencode/skills/sk-code/sk-code-webflow/`. Versions covered: v1.0.0.0 to v1.1.0.0 (only 2 changelog entries exist, both are covered). Date range: none. Neither entry carries a date in its frontmatter or body.

---

## PER-VERSION DIGEST (NEWEST FIRST)

### v1.1.0.0

Source: `changelog/v1.1.0.0.md`. A README-only release. The README was rewritten from the older tabular reference-card style into the purpose-first narrative standard that the mcp-obsidian pilot set and the refined skill README template codified, so a reader now gets a one-line pitch blockquote under the H1, a problem-first OVERVIEW, numbered ALL-CAPS H2 sections separated by dividers and a verification close. A new frontend evidence layer table maps every reference domain (language standards, implementation, performance, deployment, debugging, verification and shared) to its folder, and new QUICK START, HOW IT WORKS, FAQ and VERIFICATION sections explain surface detection, hub bundling, the read-only surface axis and the non-negotiable gates. REMOVED the LAYOUT section from the README, folding its content into the evidence layer table, HOW IT WORKS and RELATED DOCUMENTS. Two Oxford comma violations were cleaned up so the README passes the Human Voice Rules punctuation checks. The README version field went from 1.0.0.0 to 1.1.0.0. The entry states explicitly that the frontmatter identity, the surface contract facts, SKILL.md, the references, the assets and the playbook were all left untouched, so nothing behavioral changed in this release.

### v1.0.0.0

Source: `changelog/v1.0.0.0.md`. First release of the webflow surface packet. MOVED PATH: Webflow frontend evidence that previously lived scattered across the workflow modes at `code-implement/references/webflow/`, `assets/webflow/`, `code-debug/references/webflow-debugging/`, `code-verify/references/webflow-verification/` and `shared/references/webflow-shared/` was consolidated into a single read-only surface packet on the sk-code hub's surface axis. The new packet ships `SKILL.md` as the surface contract (when the hub bundles this evidence, the full reference map, the non-negotiable frontend standards covering CDN runtime reality, interaction-gated loading, Core Web Vitals as a gate and focus and forms accessibility, plus the on-demand asset tier), a `README.md`, a `references/` tree (CSS, HTML and JavaScript standards, implementation and performance patterns, CDN deployment, browser `debugging/` and `verification/` and the cross-language `shared/` tier) and an `assets/` tree (integrations, patterns, templates, scripts and the surface checklists). The entry records the packet's contract as `packetKind: surface`, `backendKind: evidence-base`, read-only with a tool surface limited to Read, Bash, Grep and Glob, and advisor-invisible under `routingClass: metadata`. It is reachable only when the hub bundles it alongside a workflow mode through `routerPolicy.outcomes.surfaceBundle`, it never routes as a primary and it mutates nothing.

---

## FACTS THE V4 DRAFT GETS WRONG OR MISSES

- Unverifiable claim in the draft. Draft line 307 says the four surface packets carry stack knowledge "with the Motion.dev animation overlay folded into webflow". Neither `changelog/v1.0.0.0.md` nor `changelog/v1.1.0.0.md` mentions Motion.dev or an animation overlay. The v1.0.0.0 entry enumerates the five consolidated source paths and none of them is an animation or Motion.dev path. The claim may be true from another packet's history, but this mode's changelog does not support it.
- Missing detail. `changelog/v1.0.0.0.md` names the exact five pre-consolidation source paths that the webflow evidence came from. The draft (line 307 and the surrounding "One Hub, Two Axes" block, lines 303 to 309) states only that paths shifted and that "anything that still points at the old flat paths must be updated", without naming any old path. A reader with a stale reference has nothing to map from.
- Missing contract facts. `changelog/v1.0.0.0.md` states that the surface packet is read-only (tools limited to Read, Bash, Grep and Glob), advisor-invisible via `routingClass: metadata`, reachable only through `routerPolicy.outcomes.surfaceBundle` and never a primary route. Draft line 307 calls the packets "read-only surface packets that inform" but omits the advisor-invisibility and the bundle-only reachability, which are the facts that explain why asking for the surface by name does not route to it.
- Missing release. The draft mentions no part of v1.1.0.0. That release was README-only per `changelog/v1.1.0.0.md`, so the omission is defensible for a user-facing release note, but the digest records it so the decision is deliberate.
- Version drift worth flagging. `changelog/v1.1.0.0.md` bumped only the README version field. `SKILL.md` frontmatter still reads `version: 1.0.0.0` while `README.md` line 8 reads `version: 1.1.0.0`. This is consistent with a README-only release, but the packet now presents two different versions depending on which file you read.

---

## CURRENT VERSION AND IDENTITY

- Version in `SKILL.md` frontmatter: `1.0.0.0`. Version in `README.md` frontmatter: `1.1.0.0`. Latest changelog entry: `v1.1.0.0.md`.
- Identity: a MODE (a surface packet) under a parent hub, not standalone and not a hub itself. There is no `mode-registry.json` at `.opencode/skills/sk-code/sk-code-webflow/`. The parent `.opencode/skills/sk-code/` carries `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, which is the hub signature. That registry lists `sk-code-webflow` in `modes[]` with `"workflowMode": "sk-code-webflow"`, `"packet": "sk-code-webflow"` and aliases "webflow implementation", "frontend implementation standards" and "webflow frontend workflow", and lists it under the hub's `surfaces` array alongside `sk-code-opencode`, `sk-code-mobile-cli` and `sk-code-obsidian`.
- Axis: the SURFACE axis (read-only domain evidence), not the WORKFLOW axis (`sk-code-quality` and `sk-code-review`). The advisor routes the single identity `sk-code`, and the hub bundles this packet as evidence.
