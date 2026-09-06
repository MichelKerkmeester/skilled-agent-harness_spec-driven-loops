---
title: "Decision Record: Template screenshots"
description: "Why the images sit beside assets rather than inside it, and why the host colour scheme is documented rather than worked around."
trigger_phrases:
  - "screenshot decisions"
  - "leaf surface boundary"
  - "headless colour scheme"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/012-template-screenshots"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the two decisions this phase took"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/render-screenshots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: screenshots live beside assets, not inside it"
      - "ADR-002: the host colour scheme is documented, not worked around"
---
# Decision Record: Template screenshots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Screenshots live beside assets, not inside it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, after a gate caught the alternative |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 12 implementer |
| **Satisfies** | REQ-003, AC-003 |

---

### Context

The first render wrote to `assets/screenshots/`, which is the obvious place. The leaf-manifest
generator walks `assets/`, so the routable leaf set grew from 181 entries to 256, with 75 PNGs
becoming resources a mode could be told to load.

### Decision

Move the output to `<mode>/screenshots/`, outside `assets/`.

### Consequences

- The leaf manifest hash returned to exactly its previous value.
- A leaf stays what it is meant to be: something a mode loads into context. A picture for a human to
  read is not one, and the typed-gold gate joins fixtures against leaves.

### Alternatives Rejected

- **Configure an exclusion in the manifest generator.** More machinery, and a new place for the rule
  to be forgotten, when moving a directory says the same thing structurally.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The host colour scheme is documented, not worked around

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 12 implementer |
| **Satisfies** | AC-005 |

---

### Context

Committed images that vary by whoever regenerates them are a reproducibility problem. Four approaches
were tried on Chrome 152: `--force-prefers-color-scheme=light`,
`--blink-settings=preferredColorScheme=1`, `--headless=new` with each, and the force-dark feature
flags. All produced byte-identical output on a dark-mode host.

### Decision

Capture whatever the host renders, and say so in both mode READMEs and in the script's own header.

### Consequences

- A regenerated set matches the operator's system theme rather than a fixed one.
- Both themes are valid corpus output and each is validated independently by the corpus checker, so
  neither capture is wrong; only an undocumented one would be.
- An operator who wants a specific theme committed regenerates on a machine set to it.

### Alternatives Rejected

- **Drive the browser through the DevTools protocol to emulate the media feature.** A new dependency
  and a new failure mode, to fix a property that one paragraph documents.
- **Strip the dark media query before rendering.** Renders something the corpus does not ship.
<!-- /ANCHOR:adr-002 -->
