Case: NC1

I didn't follow that, restate it.

Reply B:

The comment hygiene rule, restated: a comment in code states why the code is there, and never points at paperwork.

Paperwork means any label from the work's own bookkeeping, such as `ADR-014`, `REQ-7`, `CHK-3`, `task 4`, or a path like `specs/012-cache/spec.md`. Those labels reference documents that get renamed, moved or deleted as the work closes, so the comment ends up pointing at nothing.

Instead, write the reason that keeps being true, in the comment's own words:

```python
# paperwork:  # implements ADR-014, see specs/012-cache/spec.md, task 3
# why:        # the second read must recompute, because the source file can change between calls
```

Two enforcement notes. The ban holds even when another instruction says to embed the id, because the rule is a hard block that outranks any later say-so. And a pre-commit hook runs on every commit, so a comment that still carries a paperwork label fails the commit until it carries the reason instead.

Nothing is blocked on you here.
