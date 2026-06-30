## Verdict
**AGREE-WITH-CHANGES** — confidence 0.72 — the direction (externalize geometry) is correct, but the implementation plan has two critical underspecified components and one untested behavioral assumption that threaten the predicted +15pt lift.

## What GPT-5.5 got right
- Root-cause diagnosis (RC-1/RC-2/RC-3) is well-grounded in tile forensics with hard-fact evidence (overflow counts, `position:absolute` counts, title Y-position checks).
- The escalation ladder (preflight → best-of-3 recompute → downgrade-to-linear) is well-structured and mirrors proven patterns (AdaCoder, Self-Refine).
- The arm switch (`A5_ARM=control`) for rollback is good defensive engineering.
- Correctly identifies that linear-flow tiles must be bypassed entirely (REQ-007 negative control).

## Gaps / risks / errors

### GAP-1 (BLOCKER): The skeleton-compute module IS a graph layout engine, and it's completely unspecified.
The spec says "place node/row boxes within caps → compute connector anchors + orthogonal routes." For a routing diagram with 4 nodes and 3 edges, this is a non-trivial graph layout problem. The A5 skeleton example shows hardcoded `{x:40, y:132}` for SAP — but **who computes those coordinates deterministically** given arbitrary node labels, edge relations, and Dutch copy lengths? The spec names no layout algorithm (grid? force-directed? Sugiyama? layered?), no copy-measurement method (canvas `measureText`? font metrics table?), and no connector-routing strategy (Manhattan? direct? edge-bundled?). This is 80% of the engineering effort and it's a single bullet point.

### GAP-2 (BLOCKER): The "GLM as mechanical renderer" assumption is untested.
No evidence is cited that GLM-5.2 can reliably consume a 500+ token skeleton JSON with explicit pixel coordinates and render them faithfully. The research says "GLM must not invent x/y/w/h" but never demonstrates that GLM **can** follow such a contract. If GLM ignores even one coordinate (e.g., places the title at y=200 instead of y=352), the verifier catches it — but then best-of-3 fires and produces the **same skeleton** (since the compute is deterministic), creating an infinite loop into downgrade. The "best-of-3" mechanism is meaningless without a **variation strategy** (different layout algorithm? random seed? constraint relaxation?). A deterministic compute that always produces identical output makes best-of-3 a no-op.

### GAP-3: The A5 (explicit coordinates in skeleton JSON) and A7 (semantic plan + renderer computes bboxes) approaches are merged without resolving their architectural conflict.
A5 says: compute pixel coordinates upstream, embed them in the skeleton JSON, give to GLM. A7 says: GLM outputs a semantic plan (`{nodes: [...], edges: [...]}`), a **renderer** (not GLM) computes all bboxes from templates. These are fundamentally different architectures. A5 makes GLM the renderer (consume coordinates, produce DOM). A7 makes GLM a semantic planner and uses a separate deterministic renderer. The spec claims both but can't ship both — the `nodes[].box` in the skeleton JSON implies A5-style explicit coordinates, but the "Renderer mapping" section implies A7-style template rendering. This ambiguity will surface at implementation time.

### GAP-4: Auto-linearize thresholds are likely too conservative.
`nodes>5 / rows>3 / edges>6 → auto-linearize` means most real maritime dashboards (which typically have 4-6 nodes with 3-5 edges) will **never** enter the 2D skeleton path. A routing diagram with 4 nodes (SAP → catalog → order → delivery) and 3 edges hits exactly the threshold and gets linearized. This undermines SC-001/SC-002 because the tiles that need the fix most are precisely the ones that get downgraded before the skeleton even tries. The spec should distinguish between "over-budget for the skeleton" and "over-budget for GLM without a skeleton" — with a skeleton providing explicit layout, the diagram region can fit more elements than GLM can self-author.

### GAP-5: The 480×480 canvas vs 560×480 tile size discrepancy is unexplained.
The research references 560×480 bento tiles but the skeleton uses a 480×480 canvas. Where does the 80px horizontal gap go? Is it outer card padding? Browser chrome? The spec never reconciles this, which means the skeleton's coordinate system may not map 1:1 to the rendered output.

### GAP-6: The `data-a5-region` / `data-a5-id` audit tags create a circular dependency.
The verifier needs these DOM attributes to identify nodes for collision detection. But GLM must render them. If GLM fails to include the tags (same class of failure as misplacing coordinates), the verifier can't verify — and can't distinguish "GLM rendered wrong geometry" from "GLM didn't include audit tags." Without tags, `node_collision_count` is uncomputable.

## Strongest improvement or alternative

**Ship the A7 renderer-first architecture instead of the A5 skeleton-JSON-to-GLM approach.** The A5 approach (embed explicit coordinates in the GLM prompt) makes GLM the single point of failure for geometry fidelity, with no evidence it can reliably follow such a contract. The A7 approach (GLM outputs a semantic plan `{nodes, edges, roles}` → a deterministic Node.js renderer computes all bboxes and emits the HTML) removes GLM from geometry entirely. This is more engineering upfront (the renderer must handle 5 layout modes) but eliminates GAP-2 (the untested GLM-as-renderer assumption) and GAP-6 (the audit-tag circular dependency) in one move. The semantic plan is also ~70% smaller than the skeleton JSON, reducing token cost. The cost is that the renderer must produce visually varied output within each layout mode, but this is a solved problem (CSS variables, template variants, icon/color token selection).

## One thing to test or verify before building this phase

**Run a single end-to-end skeleton→GLM test with ONE tile (e.g., `oci-4 node`, baseline score 58).** Manually author a skeleton JSON with the correct coordinates for the OCI node diagram (SAP ↔ catalog ↔ Anobel), embed it in the GLM prompt with `forbid_glm_coordinate_text=true`, render the output, and run the geometry verifier. This answers GAP-2 in 1-2 hours: either GLM follows the skeleton (proceed) or it doesn't (switch to A7 renderer-first architecture). Do not build the compute-skeleton module, best-of-3, or downgrade logic until this single test passes.