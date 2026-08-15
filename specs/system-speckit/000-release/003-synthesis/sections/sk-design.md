### Design (sk-design)

- Generate a v3 `DESIGN.md` style reference from any reachable live site, with every color, spacing, font, shadow, and radius value tracing verbatim to `tokens.json` so designs stay truthful to the source rather than invented.
- A built-in validator gates the result on value fidelity and claims quality, and dark-mode, responsive, motion, icon, and accessibility sections appear only when real evidence is detected — with honest absence otherwise.
- A local, offline library of all 1,290 design styles from styles.refero.design (129 MB / 7,744 files, shape-validated 1,290/1,290) lets you pull real-world references without leaving the skill.
- You can query that library with a retrieval CLI, and the design modes (interface, audit, foundations, motion) now ground their work in it with a fixed authority order — your brief first, then mode judgment, target evidence, and corpus reference — while `design-md-generator` validates output against one versioned v3 schema.
- Design handoffs to Open Design carried a metadata-only grounding receipt with proposed-vs-returned reconciliation, keeping style provenance verifiable without exposing raw payloads.
- The sk-design hub now makes intake, visible planning, and proof expectations explicit before work starts, with fourteen private procedure cards giving each of the five modes a written trigger, output contract, and proof gate.
- Design-mode routing vocabulary was sharpened and synchronized across the hub, registry, and router, and the modes gained complete feature catalogs plus 23 new manual-testing scenarios.
- **Breaking:** The Open Design transport (the `od` CLI and stdio MCP) and its 45-file skill tree are fully removed; design workflows now route exclusively through the two remaining transports, Figma and Code Mode.
