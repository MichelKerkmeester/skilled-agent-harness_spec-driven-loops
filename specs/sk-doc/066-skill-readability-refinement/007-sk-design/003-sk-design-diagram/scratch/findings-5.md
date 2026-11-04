### .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-sketchy.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-sketchy.md:21 | 4, 6 | `## 1. OVERVIEW` opens on a bare "Use when…" sentence with no Purpose, and the labelled `### When to use` list sits at line 57, after the grammar, tuning table and critical rule it governs. | Replace lines 21-23 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Gives a diagram the look of a working sketch without costing label legibility.

  ### When to Use

  Use when the diagram accompanies an essay rather than technical docs.

  - Essay / blog post / newsletter where the diagram is the hero of a narrative page.
  - "Working sketch" register — showing something is mid-thought, not final architecture.

  ### When Not to Use

  - Technical documentation (precision matters).
  - Diagrams with dense labels or tight alignments (filter reads as noise).
  - Dark variants — wobble reads as artifact on dark backgrounds. Test first.
  ```
  then delete the now-duplicated `### When to use` … `- Dark variants…` block at lines 57-66.

### .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-terminal.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-terminal.md:21 | 4, 6 | `## 1. OVERVIEW` opens on a bare "Use for…" sentence with no Purpose, and the labelled `### When to use` list sits at line 86, after the grammar, typography, titlebar and critical-rule sections. | Replace lines 21-25 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Keeps the skin identical across posts: nine fixed tokens with no brand inheritance, so a terminal card always reads as the same tool.

  This is a **second, fixed skin** — see [style-guide.md § Terminal skin](../foundations/style-guide.md) for the token table. It does not inherit from `onboarding.md` brand tokens and isn't part of the light/dark inversion rule; every terminal example uses the same nine tokens regardless of the host site's brand.

  ### When to Use

  Use for dev-tool announcements, CLI-product posts, and technical social cards where a screenshot needs to read as "terminal," not "editorial doc."

  - Dev-tool / CLI-product launch posts (npm package, CLI flag, terminal-based workflow).
  - Technical social cards where "this is a tool for engineers" is part of the message.
  - Screenshots meant to pop in a dark-mode-heavy feed (X, Discord, dev blogs).

  ### When Not to Use

  - Editorial / long-form posts — pair with the default light or full-editorial variant instead.
  - Brand-matched output from `onboarding.md` — terminal is a fixed skin, not brand-tokenized. Don't try to reconcile the two.
  - Any diagram where the audience isn't developer-coded to read `$`/`#`/titlebar-dots as chrome rather than content.
  ```
  then delete the now-duplicated `### When to use` … `- Any diagram where the audience…` block at lines 86-96.

### .skilled/skills/sk-design/sk-design-diagram/references/types/README.md

- clean

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use, so the file opens on a section heading and a diagram list. | Replace lines 16-20 with:
  ```markdown
  # Architecture

  Open this when a topology has more boxes than the space between them allows, and the wires still have to be traceable.

  ## 1. OVERVIEW

  ### Purpose

  Gives every topology the same grammar: orthogonal connectors, bridged crossings, and zones that carry their own boundary label.

  ### When to Use

  **Best for:** system overviews, data-flow diagrams, integration maps, infra topology.
  ```
  This adds 8 lines: the zone-margin bullet at :90 becomes :98 and the EXAMPLES bullets at :105-107 become :113-115.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md:90 | 1 | The zone margin is restated with a different minimum than §3: this bullet allows 12–16px, while line 57 requires ≥16px between the label and the node, and the §3 formula (`zone y = node_top − 32`, `label mask y = zone_y + 4`, 12px label) yields exactly 16px. A reader sizing the zone cannot satisfy both. | `- Leave 12–16px above the first enclosed node — the eyebrow label sits in this margin.` → `- Leave the header margin §3 sets: ≥16px between the label's bottom edge and the first enclosed node.`

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # Bar / Column Chart

  Open this when the reader has to compare values across categories, not trace a trend.

  ## 1. OVERVIEW

  ### Purpose

  Turns a quantity comparison into a single message: a capped bar count, one focal bar, and an axis that never distorts magnitude.

  ### When to Use

  **Best for:** comparing discrete quantities across categories or time intervals — sprint velocity, monthly revenue, feature adoption, cohort counts. Use when each category has a single numeric value and the comparison between bars is the primary message.
  ```
  This adds 8 lines: the §3-§5 block at :52-73 becomes :60-81.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md:52 | 6 | ANTI-PATTERNS precedes VARIANTS, so a reader choosing between grouped and stacked bars meets the failure list first. The sibling `type-loop.md` puts VARIANTS before ANTI-PATTERNS (188 before 220), and the anti-pattern "More than 8 bars without grouping" governs the variant choice. | Replace lines 52-66 with:
  ```markdown
  ## 3. VARIANTS

  - **Grouped bars:** two bars per category, side by side. Use `accent` for the primary series and `series-1` for the secondary. Max 2 groups.
  - **Stacked bars:** segments stacked to total. Use `accent` for the focal segment; muted tints for others. Document the total at the top of each stack.

  ---

  ## 4. ANTI-PATTERNS

  - More than 8 bars without grouping (illegible at normal scale).
  - Truncated y-axis (not starting at 0) — distorts the magnitude comparison.
  - Accent on more than 1 bar ("everything is important" = nothing is).
  - 3-D bar extrusion — no shadows, no depth.
  - Category labels rotated more than 45°; prefer short labels or horizontal chart instead.
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md:71 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `bar.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. A reader following the list hits two missing files. | Replace lines 71-73 with:
  ```markdown
  - `assets/diagrams/bar.html` — the canonical rendered example.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # Data Flow

  Open this when a pipeline diagram has to name the role behind every step, not just the tool.

  ## 1. OVERVIEW

  ### Purpose

  Makes a role-scoped pipeline reproducible: one inputs schema, deterministic geometry, and arrow styles bound to topology.

  ### When to Use

  **Best for:** visualising how data moves through a pipeline *across organisational roles* — who initiates, who processes, who publishes, and who consumes. The canonical use case is a multi-role data platform (Admin → Engineers → Scientists → Consumers) with 4–6 process steps. Use when the reader needs to understand **who does what at each stage**, not just the technical components.
  ```
  This adds 8 lines: the EXAMPLES bullets at :386-391 become :394-399.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md:386 | 1 | Five of the six example paths do not exist: `assets/diagrams/` holds `data-flow.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 386-391 with:
  ```markdown
  - `assets/diagrams/data-flow.html` — the canonical rendered example: the platform, 4-role × 5-step (Admin, Engineers, Scientists, Consumers).
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # DP integration

  Open this when a platform diagram is at risk of collapsing six integrations into one bus arrow.

  ## 1. OVERVIEW

  ### Purpose

  Keeps the integration surface countable: every source, consumer and cross-cutting service gets its own wire, and the platform layer is drawn as one zone.

  ### When to Use

  **Best for:** the integration topology of a data platform — which source systems plug in, which consumer surfaces plug out, and which protocol each one speaks. Hub-and-spoke layout wrapped in an explicit **Data platform** layer; no time/phase axis.
  ```
  This adds 8 lines: the §3.1 paragraph at :176 becomes :184, the footer examples at :266-268 become :274-276, the inbound citation at :278 becomes :286, and the EXAMPLES bullets at :422-427 become :430-435.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:176 | 7 | One paragraph carries three separate facts: the canonical y/height values, the zone-bottom clearance, and the reason for the 76-px gap. | Replace line 176 with:
  ```markdown
  This produces the canonical layout for the standard shape (top bar / 3-node row / bottom bar):

  - Trino at `y=104 h=56`, primary row at `y=176 h=72`, Airflow at `y=324 h=44`.
  - Airflow's bottom anchor at y=368, 40-px clear of the zone bottom at y=408.
  - The 76-px gap between the primary row's bottom (y=248) and Airflow's top (y=324) is intentional: Airflow sits at the same y-band as source/consumer row 4 (cy=388), so it reads as a sibling of the bottom side-column row.
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:266 | 1 | The worked examples use 560 as the zone centre, but §3 sets `zone_cx = zone_x + zone_w/2 = 608` and line 257 routes the N=1 line at `x = zone_cx`. Applying the formula at line 262 gives 608 / 592, 624 / 576, 608, 640, so every listed value is 48px left of where the rule draws it. | Replace lines 266-268 with:
  ```markdown
  - N=1 → 608
  - N=2 → 592, 624
  - N=3 → 576, 608, 640
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:422 | 1 | Five of the six example paths do not exist: `assets/diagrams/` holds `dp-integration.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 422-427 with:
  ```markdown
  - `assets/diagrams/dp-integration.html` — the canonical rendered example (1 footer = AD).
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # DP security matrix

  Open this when the access question has to be answered per role and per component, not in prose.

  ## 1. OVERVIEW

  ### Purpose

  Turns an access policy into a grid a reviewer can audit: every role-component intersection resolves to a level, and one focal cell carries the exception.

  ### When to Use

  **Best for:** documenting per-role / per-component access permissions for a data platform — a grid where each row is a platform component (Keycloak, MinIO bucket, Trino catalog, JupyterHub, NiFi, …) and each column is a role / AD group (Data Administrators, Data Engineers, Data Scientists, Data Consumers, …). Each intersection cell holds a permission value (Admin / Full / R/W / Read / SELECT / Login / No access) with a visual category that matches the permission level. One cell may be marked focal to flag a critical access rule (e.g., "Data Consumers can ONLY `SELECT` from the aggregated catalog — sole consumer access").
  ```
  This adds 8 lines: the inbound citations at :24 and :192 become :32 and :200, and the EXAMPLES bullets at :311-313 become :319-321.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md:311 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `dp-security-matrix.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 311-313 with:
  ```markdown
  - `assets/diagrams/dp-security-matrix.html` — the canonical rendered example (NatStat: 4 roles × 8 components, focal at Data Consumers × Trino aggregated).
  ```
