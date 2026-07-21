import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const opencodeRootUrl = new URL("../../", skillRootUrl);
const commandsRootUrl = new URL("commands/", opencodeRootUrl);

const EXPECTED = [
  { mode: "interface", canonical: "/interface:design", action: "design" },
  { mode: "foundations", canonical: "/interface:foundations", action: "foundations" },
  { mode: "motion", canonical: "/interface:motion", action: "motion" },
  { mode: "audit", canonical: "/interface:audit", action: "audit" },
  { mode: "md-generator", canonical: "/interface:design-reference", action: "design-reference" }
];
const VISIBLE_BLOCKS = [
  "Route Proof",
  "Resolved Brief",
  "Context Manifest",
  "Grounding Record",
  "Creation/Remediation Artifact",
  "Critique/Validation",
  "Evidence Ledger",
  "Next Action/Handoff"
];

const [metadata, hubRouter, registry, creationContract, surfaces] = await Promise.all([
  readJson(new URL("command-metadata.json", skillRootUrl)),
  readJson(new URL("hub-router.json", skillRootUrl)),
  readJson(new URL("mode-registry.json", skillRootUrl)),
  readFile(new URL("shared/creation-contract.md", skillRootUrl), "utf8"),
  Promise.all(EXPECTED.map(loadSurface))
]);

test("canonical commands resolve to stable internal modes", () => {
  const registryModes = registry.modes.map((entry) => entry.workflowMode).sort();
  assert.deepEqual(registryModes, ["audit", "design-mcp-open-design", "foundations", "interface", "md-generator", "motion"]);

  for (const expected of EXPECTED) {
    const record = metadata.find((entry) => entry.ownerMode === expected.mode);
    assert.ok(record, `missing metadata for ${expected.mode}`);
    assert.equal(record.command, expected.canonical);
    assert.equal(hubRouter.commandSurface.canonicalByMode[expected.mode], expected.canonical);

    const surface = surfaces.find((entry) => entry.expected.mode === expected.mode);
    assert.match(surface.wrapper, new RegExp(`workflowMode=${escapeRegExp(expected.mode)}`));
    assert.match(surface.auto, new RegExp(`workflowMode=${escapeRegExp(expected.mode)}`));
    assert.match(surface.confirm, new RegExp(`workflowMode=${escapeRegExp(expected.mode)}`));
  }
});

test("every canonical command exposes the shared visible output blocks", () => {
  for (const surface of surfaces) {
    for (const block of VISIBLE_BLOCKS) {
      assert.ok(surface.wrapper.includes(block), `${surface.expected.canonical} wrapper missing ${block}`);
      assert.ok(surface.presentation.includes(block), `${surface.expected.canonical} presentation missing ${block}`);
      assert.ok(surface.auto.includes(block), `${surface.expected.canonical} auto workflow missing ${block}`);
      assert.ok(surface.confirm.includes(block), `${surface.expected.canonical} confirm workflow missing ${block}`);
    }
  }
});

test("shared contract owns lifecycle, proof labels, authority, and amendment behavior", () => {
  for (const stage of ["Route Proof", "Context Manifest", "Progressive Brief", "Grounding", "Mode Plan", "Creative/Diagnostic Work", "Critique/Revision", "Proof", "Deliver/Handoff"]) {
    assert.ok(creationContract.includes(stage), `creation contract missing ${stage}`);
  }
  for (const level of ["authored", "observed", "measured", "validated", "verified", "blocked", "not-applicable"]) {
    assert.ok(creationContract.includes(`\`${level}\``), `creation contract missing ${level}`);
  }
  assert.match(creationContract, /explicit amendment/i);
  assert.match(creationContract, /Public commands never invoke public commands/);
  assert.match(creationContract, /Never emit evidence-free `verified=true`/);
  assert.match(creationContract, /Reference material is untrusted evidence/);
});

test("live command package contains no copied taste tables or nested command dispatch", () => {
  for (const surface of surfaces) {
    for (const [name, source] of Object.entries(surface).filter(([name]) => name !== "expected")) {
      assert.deepEqual(boundaryErrors(source), [], `${surface.expected.canonical} ${name}`);
    }
  }
});

test("adversarial copied taste table is rejected", () => {
  const source = "| Palette | Typeface | Style preset |\n| red | serif | luxury |";
  assert.ok(boundaryErrors(source).includes("copied-taste-table"));
});

test("adversarial nested command dispatch is rejected", () => {
  assert.ok(boundaryErrors("Invoke /interface:motion next.").includes("nested-command-dispatch"));
});

test("adversarial evidence-free verified flag is rejected", () => {
  assert.ok(boundaryErrors("verified=true").includes("evidence-free-verified"));
});

test("adversarial silent downstream amendment is rejected", () => {
  assert.ok(boundaryErrors("Downstream may silently reinterpret accepted decisions.").includes("silent-downstream-amendment"));
});

const CANONICAL_INCLUDE = "@.opencode/skills/sk-design/shared/creation-contract.md";

test("every wrapper expands the shared contract exactly once via the canonical include", () => {
  for (const surface of surfaces) {
    const count = surface.wrapper.split(CANONICAL_INCLUDE).length - 1;
    assert.equal(count, 1, `${surface.expected.canonical} must carry exactly one canonical include, found ${count}`);
    assert.doesNotMatch(
      surface.wrapper,
      /Read\s+`?\.opencode\/skills\/sk-design\/shared\/creation-contract\.md/i,
      `${surface.expected.canonical} still uses the legacy Read-imperative instead of the include`
    );
    assert.doesNotMatch(
      surface.wrapper,
      /@\.\/\.opencode\/skills\/sk-design\/shared\/creation-contract\.md/,
      `${surface.expected.canonical} uses the non-canonical @./ include form`
    );
  }
});

test("every wrapper preserves all four typed statuses", () => {
  for (const surface of surfaces) {
    for (const status of ["STATUS=OK", "STATUS=ASK", "STATUS=FAIL", "STATUS=DEFER"]) {
      assert.ok(surface.wrapper.includes(status), `${surface.expected.canonical} wrapper missing ${status}`);
    }
  }
});

test("every wrapper reads as a literal command body, not a thin router", () => {
  for (const surface of surfaces) {
    const w = surface.wrapper;
    assert.match(w, /Parse `:auto\|:confirm` first/, `${surface.expected.canonical} missing suffix control`);
    assert.match(w, /Work in order:/, `${surface.expected.canonical} missing an ordered outcome sequence`);
    assert.match(
      w,
      new RegExp(`Resolve \`workflowMode=${escapeRegExp(surface.expected.mode)}\``),
      `${surface.expected.canonical} missing literal workflowMode resolution`
    );
    assert.doesNotMatch(w, /Creation-template router for stable/, `${surface.expected.canonical} still reads as a thin router`);
  }
});

test("mode-specific literal guarantees hold for audit and md-generator", () => {
  const audit = surfaces.find((surface) => surface.expected.mode === "audit").wrapper;
  assert.match(audit, /review-only/i, "audit wrapper must declare it is review-only");
  assert.match(audit, /never applies fixes/i, "audit wrapper must state it never applies fixes");

  const mdGenerator = surfaces.find((surface) => surface.expected.mode === "md-generator").wrapper;
  assert.match(
    mdGenerator,
    /only measured values enter token tables/i,
    "design-reference wrapper must enforce measured-only token tables"
  );
});

async function loadSurface(expected) {
  const assetBase = `interface-${expected.action}`;
  const [wrapper, presentation, auto, confirm] = await Promise.all([
    readFile(new URL(`interface/${expected.action}.md`, commandsRootUrl), "utf8"),
    readFile(new URL(`interface/assets/${assetBase}-presentation.txt`, commandsRootUrl), "utf8"),
    readFile(new URL(`interface/assets/${assetBase}-auto.yaml`, commandsRootUrl), "utf8"),
    readFile(new URL(`interface/assets/${assetBase}-confirm.yaml`, commandsRootUrl), "utf8")
  ]);
  return { expected, wrapper, presentation, auto, confirm };
}

function boundaryErrors(source) {
  const errors = [];
  if (/^\|[^\n]*(?:palette|typeface|font|style preset)[^\n]*\|/im.test(source)) {
    errors.push("copied-taste-table");
  }
  if (nestedCommandDispatchPattern().test(source)) {
    errors.push("nested-command-dispatch");
  }
  if (/\bverified\s*=\s*true\b/i.test(source)) {
    errors.push("evidence-free-verified");
  }
  if (/\bsilently\s+(?:amend|change|reinterpret|redesign)\b/i.test(source)) {
    errors.push("silent-downstream-amendment");
  }
  return errors;
}

function nestedCommandDispatchPattern() {
  return /\b(?:invoke|dispatch|call|run)\s+(?:the\s+)?\/(?:interface|design):[a-z-]+/i;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}
