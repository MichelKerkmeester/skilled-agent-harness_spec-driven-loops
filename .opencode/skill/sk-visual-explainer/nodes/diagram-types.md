---
description: "All 11 diagram types with rendering approach, best-fit scenarios, constraints, and a decision tree for selection"
---
# Diagram Types

This node covers all 11 supported diagram types — what they are, when to use them, how to render them, and their constraints. Use the decision tree at the bottom when the correct type is unclear.

---

## Type 1 — Architecture (Text-Heavy)

**Rendering:** CSS Grid cards with optional arrow connectors via pseudo-elements or SVG overlay.

**Use when:** System has many components, each requiring a description. Relationships are secondary to understanding each component's role. Text density is high.

**Best for:** Microservice overviews, component inventories, module documentation.

**Constraints:** Not suitable when precise edge routing matters (use Type 2). Limited to ~20 components before layout becomes unreadable.

**Example structure:**
```css
.arch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--ve-space-md);
}
```

---

## Type 2 — Architecture (Topology)

**Rendering:** Mermaid `graph TD` or `graph LR` with ELK layout engine for complex graphs.

**Use when:** The precise relationships (edges) between system components are the primary information. Component descriptions are secondary.

**Best for:** Network topology, deployment infrastructure, service mesh, call graphs.

**Constraints:** Maximum 15–20 nodes per diagram. Mermaid renders poorly beyond this. For larger graphs, split into sub-graphs with a high-level overview + detail views.

**ELK layout (for complex graphs):**
```javascript
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  layout: 'elk',
  elk: { mergeEdges: true }
});
```

---

## Type 3 — Flowcharts and Pipelines

**Rendering:** Mermaid `flowchart TD` or `flowchart LR`. Use `handDrawn` mode for exploratory/informal feel.

**Use when:** The content represents a sequence of steps with branches, decisions, or parallel paths.

**Best for:** Algorithms, business processes, CI/CD pipelines, user journeys, state-independent step sequences.

**Constraints:** Mermaid auto-layout can produce crossed edges for complex graphs. Add `direction` hints and subgraphs to control layout. Avoid > 20 decision nodes.

**handDrawn mode:**
```javascript
mermaid.initialize({
  startOnLoad: false,
  look: 'handDrawn',
  theme: 'base'
});
```

---

## Type 4 — Sequence Diagrams

**Rendering:** Mermaid `sequenceDiagram`.

**Use when:** Multiple actors exchange messages over time. The order and direction of messages is the primary information.

**Best for:** API request/response flows, authentication protocols, event-driven systems, user-to-system interactions.

**Constraints:** Sequence diagrams become unreadable with > 8 actors or > 25 messages. For longer sequences, split into phases with a "Continued..." note.

**Example:**
```
sequenceDiagram
  actor User
  participant API as API Gateway
  participant Auth as Auth Service

  User->>API: POST /login
  API->>Auth: validate(credentials)
  Auth-->>API: JWT token
  API-->>User: 200 OK + token
```

---

## Type 5 — Data Flow

**Rendering:** Mermaid `graph LR` with labeled edges.

**Use when:** Data transformations between systems are the primary information. Not just "A calls B" but "A sends X to B which produces Y".

**Best for:** ETL pipelines, data processing architectures, stream processing, analytics flows.

**Key distinction from Type 2:** Edge labels carry significant information in data flow (the data being transferred). Architecture topology edges represent relationships only.

**Example:**
```
graph LR
  S[(Raw Events)] -->|"JSON stream"| P[Stream Processor]
  P -->|"Enriched events"| W[(Warehouse)]
  P -->|"Alert triggers"| N[Notification Service]
```

---

## Type 6 — ER / Schema

**Rendering:** Mermaid `erDiagram`.

**Use when:** The content represents database tables and their relationships (one-to-many, many-to-many, etc.).

**Best for:** Database schema documentation, ORM model visualization, API response shape documentation.

**Constraints:** Mermaid ER supports crow's foot notation. Field types are supported but optional. For very large schemas (> 15 tables), group into domain diagrams.

**Example:**
```
erDiagram
  USER {
    int id PK
    string email
    string name
  }
  SESSION {
    int id PK
    int user_id FK
    datetime expires_at
  }
  USER ||--o{ SESSION : "has"
```

---

## Type 7 — State Machines

**Rendering:** Mermaid `stateDiagram-v2` for formal state diagrams. Mermaid `flowchart` for informal state-like flows.

**Use when:** The content represents discrete states an entity moves through, with defined transitions and conditions.

**Best for:** Order status flows, UI component states, auth session states, game state machines, workflow status.

**Key question:** Is every state named and is every transition labeled? If yes → `stateDiagram-v2`. If it's more of a "flow with decision points" → Type 3 flowchart.

**Example:**
```
stateDiagram-v2
  [*] --> Pending
  Pending --> Processing : payment_received
  Processing --> Shipped : fulfilled
  Processing --> Cancelled : user_cancel
  Shipped --> Delivered : delivery_confirmed
  Delivered --> [*]
  Cancelled --> [*]
```

---

## Type 8 — Mind Maps

**Rendering:** Mermaid `mindmap`.

**Use when:** The content is hierarchical — a central topic with branches into subtopics, which branch further. No directed relationships.

**Best for:** Topic overviews, feature brainstorms, concept maps, knowledge organization, project scoping.

**Constraints:** Mermaid mindmap does not support edge labels. Use only for pure hierarchy. Limited custom styling — Mermaid mindmap has fewer theming options than other diagram types.

**Example:**
```
mindmap
  root((Auth System))
    Providers
      OAuth 2.0
      SAML
      Local
    Storage
      Sessions
      JWTs
    Security
      Rate limiting
      MFA
```

---

## Type 9 — Data Tables

**Rendering:** Semantic HTML `<table>` with `<thead>`, `<tbody>`, `<th scope="col/row">`.

**Use when:** Content is inherently tabular — discrete rows and columns with clear headers.

**Best for:** Comparison tables, configuration references, API endpoint docs, metric summaries, changelog entries.

**Never use Mermaid for tables.** HTML tables are more accessible, more readable, and easier to style than any diagram library alternative.

**Styling guidance:**
```css
table { width: 100%; border-collapse: collapse; }
th { background: var(--ve-surface-elevated); font-family: var(--ve-font-body); font-weight: 600; }
td, th { padding: 0.6rem 1rem; border-bottom: 1px solid var(--ve-border); }
tbody tr:hover { background: var(--ve-accent-muted); }
```

---

## Type 10 — Timelines and Roadmaps

**Rendering:** CSS central vertical or horizontal line with alternating cards positioned along it.

**Use when:** Content has a temporal axis — events, milestones, phases, or roadmap items ordered by date or time.

**Best for:** Project roadmaps, release timelines, historical event sequences, sprint planning, career timelines.

**Never use Mermaid for timelines.** CSS timelines are far more flexible and visually distinctive.

**Structure:**
```css
.timeline { position: relative; }
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: var(--ve-accent);
}
.timeline-item {
  width: 45%;
  margin-bottom: var(--ve-space-lg);
}
.timeline-item:nth-child(odd)  { margin-left: 0; text-align: right; }
.timeline-item:nth-child(even) { margin-left: 55%; }
```

---

## Type 11 — Dashboards and Metrics

**Rendering:** CSS Grid layout with Chart.js for charts (bar, line, doughnut, pie, radar).

**Use when:** Multiple numeric metrics need to be presented together, with trends or comparisons being the primary message.

**Best for:** Performance dashboards, test results summaries, analytics overviews, KPI tracking, capacity planning.

**Chart.js configuration pattern:**
```javascript
new Chart(ctx, {
  type: 'bar',
  data: { labels: [...], datasets: [{ data: [...], backgroundColor: [...] }] },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      y: { beginAtZero: true, grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--ve-border') } }
    }
  }
});
```

**Light/dark switching for Chart.js:** Listen to `prefers-color-scheme` and re-render or update chart colors on theme change.

---

## Decision Tree

Use this tree when the correct type is unclear. Start at the top.

```
What is the PRIMARY relationship between elements?
│
├─► Time or sequence is dominant
│     ├─► Actor-to-actor message passing → TYPE 4 (Sequence)
│     ├─► Steps with branches/decisions → TYPE 3 (Flowchart)
│     └─► Dated events/milestones → TYPE 10 (Timeline)
│
├─► State transitions between named states → TYPE 7 (State Machine)
│
├─► Hierarchy (central topic + branches, no edges) → TYPE 8 (Mind Map)
│
├─► Entity relationships with cardinality → TYPE 6 (ER / Schema)
│
├─► Data transformations (labeled data moving) → TYPE 5 (Data Flow)
│
├─► System components + their connections
│     ├─► Text-heavy (need component descriptions) → TYPE 1 (Architecture Cards)
│     └─► Topology-focused (precise edge routing) → TYPE 2 (Architecture Topology)
│
├─► Tabular data (rows + columns) → TYPE 9 (Data Table)
│
└─► Multiple numeric metrics + trends → TYPE 11 (Dashboard)
```

If still unsure after the decision tree, present the top 2 options to the user with a one-line description of each and ask them to choose.

---

## Cross References
- [[aesthetics]] — Compatibility matrix shows which aesthetics work with which diagram types
- [[how-it-works]] — Phase 2 rendering approach decision references this node
- [[integration-points]] — Mermaid and Chart.js configuration details
- [[rules]] — NEVER rules 3 and 4 apply specifically to Mermaid diagrams
