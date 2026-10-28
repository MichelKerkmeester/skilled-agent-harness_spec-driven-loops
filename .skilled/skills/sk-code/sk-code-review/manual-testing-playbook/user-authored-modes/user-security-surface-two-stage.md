---
title: "CR-028 -- User security surface through both routing stages"
description: "This scenario validates the user security surface through both routing stages for `CR-028`. It focuses on the skill advisor selecting the `sk-code` hub, then the hub router selecting the review mode plus a repository-added security surface, with review staying primary and the surface riding as read-only evidence."
version: 1.0.1.0
---

# CR-028 -- User security surface through both routing stages

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-028`.

---

## 1. OVERVIEW

This scenario validates the user security surface through both routing stages for `CR-028`. It focuses on the skill advisor selecting the `sk-code` hub, then the hub router selecting the review mode plus a repository-added security surface, with review staying primary and the surface riding as read-only evidence.

### Why This Matters

A repository can extend `sk-code` with its own security surface, but the extension only earns its place if it survives both routing stages. Stage one is the skill advisor choosing the `sk-code` hub for a security review request. Stage two is the hub router choosing the review mode plus the added surface, in that order, so the review stays primary and the surface contributes read-only evidence. If the surface displaces review, or if either stage silently drops a target, the repository's own security knowledge never reaches the operator. CR-028 proves the full path end to end by adding the surface to an in-memory copy of the live registry and router, so nothing on disk changes, then probing a review request and a non-review request against the compiled snapshot. It also proves the surface can stand alone: a plain fix request routes to the surface alone, without review.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a security surface added by a repository reaches the review mode through both routing stages while review stays primary, and reaches the surface alone for a non-review request.
- Real user request: `Prove the security surface our repository adds to sk-code reaches review without displacing it.`
- Prompt: `Review the session token handler for security issues.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against routing references, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when the node runtime needed to execute the advisor and the compiled routing libraries is unavailable in the current environment.
- Expected signals: Step 1: the first recommendation's `skillId` is `sk-code`; Step 2 prints `review the session token handler for security issues => surfaceBundle sk-code-review,sk-code-security` and `fix the session token handler => single sk-code-security`.
- Desired user-visible outcome: a repository-added security surface reaches review as supporting evidence, and a non-review request reaches the surface on its own.
- Pass/fail: PASS if both signals hold, so the review mode stays first and the surface rides as read-only evidence, while a non-review request reaches the surface alone; FAIL if stage one picks another hub, if the review request drops either target, or if the surface comes before the review mode.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the two routing stages and which stage owns each decision.
2. Confirm the live registry, hub router, and compiled routing libraries all resolve on disk.
3. Execute the deterministic steps exactly as written, keeping the surface injection in memory only.
4. Compare the observed routing decisions against the cited skill and router sources.
5. Return a concise final verdict that names the stage and the dropped target when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-028 | User security surface through both routing stages | Confirm a repository-added security surface reaches the review mode through both routing stages while review stays primary. | `Review the session token handler for security issues.` | bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"review the session token handler for security issues"}' --format json -> bash: node -e 'in-memory registry and hub-router surface injection, then two evaluateCanary probes' | Step 1: the first recommendation's `skillId` is `sk-code`; Step 2 prints `review the session token handler for security issues => surfaceBundle sk-code-review,sk-code-security` and `fix the session token handler => single sk-code-security` | Advisor JSON output, two-line routing transcript from the compiled snapshot | PASS if both signals hold, so the review mode stays first and the surface rides as read-only evidence, while a non-review request reaches the surface alone; FAIL if stage one picks another hub, if the review request drops either target, or if the surface comes before the review mode | 1. If stage one misses, read the hub `graph-metadata.json` intent signals; 2. If stage two drops the surface, confirm the tie-break slot sits ahead of `sk-code-skilled`; 3. If the compiler throws `SURFACE_FALLBACK_INVALID`, the surface was placed after the fallback |

### Exact Commands

Step 1, stage one:

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"review the session token handler for security issues"}' --format json
```

Step 2, stage two:

```bash
node -e '
const fs=require("fs"),path=require("path");
const root=".skilled/skills/sk-code";
const lib="./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/";
const {compileRegistry}=require(lib+"registry-compiler.cjs");
const {evaluateCanary}=require(lib+"canary-router.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(root,"mode-registry.json"),"utf8"));
const hubRouter=JSON.parse(fs.readFileSync(path.join(root,"hub-router.json"),"utf8"));
registry.modes.push({workflowMode:"sk-code-security",packetKind:"surface",backendKind:"evidence-base",packet:"sk-code-security",packetSkillName:"sk-code-security",aliases:[],advisorRouting:{routingClass:"metadata"},surfaceDetection:{label:"SECURITY",role:"specific",pathMarkers:["src/auth/"],contentMarkers:["session token"]}});
hubRouter.routerSignals["sk-code-security"]={weight:4,classes:["code-security-runtime"],resources:["sk-code-security/SKILL.md"]};
hubRouter.vocabularyClasses["code-security-runtime"]={keywords:["session token","token handler"]};
const tb=hubRouter.routerPolicy.tieBreak; tb.splice(tb.length-1,0,"sk-code-security");
const md=fs.readFileSync(path.join(root,"SKILL.md"),"utf8");
const snap=compileRegistry({activationGeneration:1,hubRouter,registry,skillMarkdown:md,sourceBytes:{"SKILL.md":Buffer.from(md),"hub-router.json":Buffer.from(JSON.stringify(hubRouter)),"mode-registry.json":Buffer.from(JSON.stringify(registry))}});
for (const p of ["review the session token handler for security issues","fix the session token handler"]) { const {decision}=evaluateCanary(snap,{prompt:p}); console.log(p,"=>",decision.route.selectionKind,decision.route.targets.map(t=>t.destinationId.workflowMode).join(",")); }
'
```

### Optional Supplemental Checks

If the primary run passes, move the tie-break insertion after the fallback slot and confirm the compiler throws `SURFACE_FALLBACK_INVALID`, proving the fallback guard is live. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Hub skill contract; section 7 User-Authored Modes and section 4 Extension Floors define where a surface is registered and the floor it must clear |
| `../../../mode-registry.json` | Surface registration shape the in-memory copy adds |
| `../../../hub-router.json` | Router vocabulary classes and tie-break order the in-memory copy extends |
| `../../../../../bin/tests/compiled-route-surface-hint.test.cjs` | Automated test that adds a surface the same way and asserts the same two-stage outcome |

---

## 5. SOURCE METADATA

- Group: User-Authored Modes
- Playbook ID: CR-028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `user-authored-modes/user-security-surface-two-stage.md`
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
