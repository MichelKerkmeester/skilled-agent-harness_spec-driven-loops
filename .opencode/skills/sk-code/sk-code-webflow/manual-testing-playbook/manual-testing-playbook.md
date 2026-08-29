# code-webflow: Manual Testing Playbook

Routing-recall corpus for the `code-webflow` surface. These scenarios exercise the machine-readable
`INTENT_SIGNALS`/`RESOURCE_MAP` in `SKILL.md` §2b, and the surface detection (**WEBFLOW**) that causes
the hub to bundle this packet. The corpus is derived from the walked tree below, split into four
category directories that mirror this surface's own reference-map grouping (implementation and
quality, performance and animation, deployment/forms/video, and language standards).

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome
> and reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-webflow/benchmark/reports/<dated-run-label>/`.

## Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | Implementation and Quality | `implementation-quality/` | WF-001 .. WF-005 |
| 2 | Performance and Animation | `performance-animation/` | WF-006 .. WF-009 |
| 3 | Deployment Forms and Video | `deployment-forms-video/` | WF-010 .. WF-012 |
| 4 | Language Standards | `language-standards/` | WF-013 |

## Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | WF-001 | IMPLEMENTATION | [implementation-quality/implementation-routing.md](implementation-quality/implementation-routing.md) |
| 2 | WF-002 | CODE_QUALITY | [implementation-quality/code-quality-routing.md](implementation-quality/code-quality-routing.md) |
| 3 | WF-003 | DEBUGGING | [implementation-quality/debugging-routing.md](implementation-quality/debugging-routing.md) |
| 4 | WF-004 | VERIFICATION | [implementation-quality/verification-routing.md](implementation-quality/verification-routing.md) |
| 5 | WF-005 | TESTING | [implementation-quality/testing-routing.md](implementation-quality/testing-routing.md) |
| 6 | WF-006 | PERFORMANCE | [performance-animation/performance-routing.md](performance-animation/performance-routing.md) |
| 7 | WF-007 | ANIMATION | [performance-animation/animation-routing.md](performance-animation/animation-routing.md) |
| 8 | WF-008 | MOTION_DEV | [performance-animation/motion-dev-routing.md](performance-animation/motion-dev-routing.md) |
| 9 | WF-009 | ACCESSIBILITY | [performance-animation/accessibility-routing.md](performance-animation/accessibility-routing.md) |
| 10 | WF-010 | DEPLOYMENT | [deployment-forms-video/deployment-routing.md](deployment-forms-video/deployment-routing.md) |
| 11 | WF-011 | FORMS | [deployment-forms-video/forms-routing.md](deployment-forms-video/forms-routing.md) |
| 12 | WF-012 | VIDEO | [deployment-forms-video/video-routing.md](deployment-forms-video/video-routing.md) |
| 13 | WF-013 | LANGUAGE_STANDARDS | [language-standards/language-standards-routing.md](language-standards/language-standards-routing.md) |

Every scenario assumes the hub's surface detection has already resolved **WEBFLOW** (CWD or
changed/target files under `src/2_javascript`, `webflow`, `--vw-` custom properties, or CDN-delivered
client scripts, per `SKILL.md` §1) and bundled this packet behind a workflow mode; the scenario then
exercises which reference/asset set the sample prompt's intent should load. A scenario's verdict is
`PASS` when every path in its `expected_resources` resolves under the skill root and its frontmatter
surface/intent agree with the table above, `FAIL` when either check fails, and `SKIP` only when a
specific sandbox or runtime blocker (for example, the repository checkout is unavailable to resolve
a referenced path) prevents the check from running.

Every `expected_resources` set below is an exact mirror of its intent's `RESOURCE_MAP` entry in
`SKILL.md` §2b — verified path by path against the live packet directory, not assumed from the map.
`ANIMATION` (WF-007) and `MOTION_DEV` (WF-008) are the pair most likely to be confused: both share the
`animation-workflows`/`performance-and-pitfalls` core, but only `MOTION_DEV` carries the Motion.dev
library-specific `animate()`/`stagger()` API resources, and only `ANIMATION` carries the swiper-patterns
carousel trio.
