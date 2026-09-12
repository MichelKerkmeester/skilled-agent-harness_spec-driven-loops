---
title: "Implementation Plan: Entry-point resolution through a link"
description: "Fix the comparison in the shared helper, give the standalone scripts a plain-JavaScript twin they can actually import, migrate every hand-rolled copy onto one of the two, and prove it with a probe that distinguishes a file from its own spelling."
trigger_phrases:
  - "entry point plan"
  - "isMainModule plan"
importance_tier: "supporting"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Entry-point resolution through a link

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. APPROACH

The comparison is wrong in one way and spelled in five. Fix the meaning once, then reduce the
spellings to it.

Two homes are needed rather than one, and the reason is a build boundary rather than taste. Most
callers are TypeScript and compile against the typed helper. The rest are standalone scripts
invoked by path, sometimes before anything has been built, so they cannot import the typed helper
or its output. They get a plain-JavaScript twin, and a test asserts the two agree.

One script sits in a different package from both, and reaching for either would point a lower
layer at one that depends on it. It keeps a local copy, and says so.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. SEQUENCE

1. Canonicalize both sides in the typed helper, falling back rather than raising.
2. Add the plain-JavaScript twin carrying the same logic.
3. Migrate the standalone scripts onto the twin; the one in the other package gets a local copy.
4. Migrate the TypeScript callers onto the typed helper, removing imports that fall unused.
5. Cover both directions, with a probe that a wrong fix cannot satisfy.
6. Rebuild, because compiled output beside the source is committed here.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:quality-gates -->
## 3. VERIFICATION

- The trigger-index lookup, which runs every turn, returns byte-identical output whether reached
  directly or through a symlinked path.
- The spec-kit suite passes, with the delta accounted for by the added cases.
- Each new case fails against the previous implementation. A fix that answered "entrypoint"
  unconditionally would pass the symlink case and fail the imported-module case, so both are
  asserted.
<!-- /ANCHOR:quality-gates -->
