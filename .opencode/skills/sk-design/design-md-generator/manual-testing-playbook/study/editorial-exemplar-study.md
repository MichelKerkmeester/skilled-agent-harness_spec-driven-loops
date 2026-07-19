---
title: Editorial Exemplar Study Scenario
description: Manual scenario verifying non-SaaS exemplar study for editorial or ecommerce extraction output.
version: 1.0.0.0
expected_intent: STUDY
expected_resources:
  - references/design-md-format.md
  - references/writing-style-guide.md
  - references/examples/stripe/DESIGN.md
  - references/examples/stripe/writing-notes.md
  - references/examples/vercel/DESIGN.md
  - references/examples/vercel/writing-notes.md
  - references/examples/linear/DESIGN.md
  - references/examples/linear/writing-notes.md
  - references/examples/supabase/DESIGN.md
  - references/examples/supabase/writing-notes.md
  - references/examples/editorial-exemplar.md
---

**Exact prompt**

```
Study a non-SaaS editorial or ecommerce extraction exemplar and explain what the v3 Style Reference should learn from it.
```

# STUDY-015 -- Editorial Exemplar Study

## Expected Process

1. Route to `md-generator` STUDY.
2. Load `references/examples/editorial-exemplar.md` with the v3 format and writing guide.
3. Compare the exemplar shape against existing example pairs.
4. State that the exemplar is illustrative and not a preset.

## Pass Criteria

- The response selects editorial, ecommerce, culture or hospitality.
- It does not choose another developer-tool brand.
- It preserves live extraction and token fidelity boundaries.
- It learns role naming and section treatment, not a style recipe.
