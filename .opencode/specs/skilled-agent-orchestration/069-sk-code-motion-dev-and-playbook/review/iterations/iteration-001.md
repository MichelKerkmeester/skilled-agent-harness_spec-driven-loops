# Iteration 001 — Deep Review Findings

## METADATA
- Iteration: 1 / 7
- Date: 2026-05-05
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimensions: 1 (cross-stack peer-category architecture), 3 (sk-doc template compliance)
- Cross-cutting: snake_case naming consistency

## SUMMARY
Reviewed the requested sk-code router, metadata, README, graph metadata, changelog, and all eight motion_dev markdown assets/references against the packet strategy and sk-doc skill templates. Found 1 P1 architecture issue: bare Motion.dev markers still participate in WEBFLOW surface detection even though MOTION_DEV is documented as a resource intent loaded after surface detection. No P0 or P2 findings were identified, and the snake_case path grep returned zero hits.

## P0 FINDINGS (Blocker — block commit)
- No P0 findings.

## P1 FINDINGS (Required — should fix before commit)
- P1 .opencode/skills/sk-code/SKILL.md:67 — The WEBFLOW surface detector treats a generic Motion package import (`from "motion"`) and `motion.dev` string as WEBFLOW markers; the same rule is mirrored in `.opencode/skills/sk-code/references/router/code_surface_detection.md:40`, and the README detection table lists `motion.dev` under WEBFLOW at `.opencode/skills/sk-code/README.md:21`. This contradicts `.opencode/skills/sk-code/SKILL.md:117`, where `MOTION_DEV` is a resource intent loaded after WEBFLOW/OPENCODE/UNKNOWN surface handling, and can misroute non-Webflow Motion projects as WEBFLOW. Remove or gate bare Motion markers from WEBFLOW surface detection, keep explicit Webflow/vanilla-site markers for WEBFLOW, and let Motion terms drive `MOTION_DEV` intent/resource loading after the surface is established.

## P2 FINDINGS (Suggestion — quality polish)
- No P2 findings.

## POSITIVE OBSERVATIONS
- `.opencode/skills/sk-code/SKILL.md:102` through `.opencode/skills/sk-code/SKILL.md:108` lists `motion_dev/` beside `webflow/` and `opencode/` in Resource Domains, and explicitly says Webflow docs should link to generic Motion details rather than absorbing them.
- `.opencode/skills/sk-code/references/router/resource_loading.md:39` through `.opencode/skills/sk-code/references/router/resource_loading.md:51` gives MOTION_DEV its own map and describes it as a peer resource category that supplements WEBFLOW, OPENCODE, or future surfaces.
- The audited motion_dev markdown set follows the sk-doc template shape: all six references use title/description frontmatter, short H1 intros, `## 1. OVERVIEW` with Core Principle/Purpose/When to Use, numbered H2 sections, and final `REFERENCES AND RELATED RESOURCES`; both assets use Purpose/Usage and final `RELATED RESOURCES`.

## DIMENSION COVERAGE
- Dimension 1 (cross-stack peer-category): COVERED; audited SKILL.md routes/resource domains/intent/detection, README tree/navigation, description.json, graph-metadata.json, all four router references, and the packet changelog for motion_dev peer-category consistency.
- Dimension 3 (sk-doc template compliance): COVERED; audited all six `.opencode/skills/sk-code/references/motion_dev/*.md` files and both `.opencode/skills/sk-code/assets/motion_dev/*.md` files against the sk-doc asset/reference templates.

## NEXT ITERATION RECOMMENDATIONS
- Revisit the P1 detection issue after remediation to confirm bare Motion package/API terms no longer classify unsupported or non-Webflow targets as WEBFLOW.
- In iteration 2, pay special attention to Motion source citations in `install_card.md` and version-specific claims because the docs include timestamped package-version language.
