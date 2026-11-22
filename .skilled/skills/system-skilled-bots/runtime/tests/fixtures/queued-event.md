---
id: review-on-request
trigger:
  kind: queue
  name: review
precheck: "git diff --quiet HEAD~1 || echo changed"
---
Review the change named in the request and report the result.
