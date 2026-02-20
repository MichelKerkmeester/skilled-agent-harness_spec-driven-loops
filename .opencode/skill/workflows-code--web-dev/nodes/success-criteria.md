---
description: "Phase completion checklists, performance targets, and quality gates for all development phases"
---
# Success Criteria

Defines what "done" means for each phase, including completion checklists and performance targets.

## Phase Completion Checklists

| Phase                   | Checklist                                               | Key Criteria                                           |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Phase 1: Implementation | `references/implementation/implementation_workflows.md` | No arbitrary setTimeout, inputs validated, CDN updated |
| Phase 1.5: Code Quality | `assets/checklists/code_quality_checklist.md`           | P0 items passing, snake_case, file headers             |
| Phase 2: Debugging      | `references/debugging/debugging_workflows.md`           | Root cause documented, fix at source                   |
| Phase 3: Verification   | `assets/checklists/verification_checklist.md`           | Browser tested, multi-viewport, console clean          |

## Performance Targets

| Metric | Target | Tool       | Metric | Target | Tool       |
| ------ | ------ | ---------- | ------ | ------ | ---------- |
| FCP    | < 1.8s | Lighthouse | CLS    | < 0.1  | Lighthouse |
| LCP    | < 2.5s | Lighthouse | FPS    | 60fps  | DevTools   |
| TTI    | < 3.8s | Lighthouse | Errors | 0      | Console    |

Run Lighthouse 3x in Incognito with mobile emulation, use median scores.

## Quick Success Checklist

```
Implementation:
- No arbitrary setTimeout (condition-based waiting instead)
- All inputs validated
- CDN versions updated

Code Quality:
- P0 items passing
- snake_case naming
- File headers present

Verification:
- Actual browser opened
- Mobile + Desktop tested
- Console errors: 0
- Documented what was tested
```

## Cross References
- [[rules]] - Rules that enforce these criteria
- [[verification-workflow]] - The mandatory final phase
- [[implementation-workflow]] - Phase 1 and 1.5 criteria details