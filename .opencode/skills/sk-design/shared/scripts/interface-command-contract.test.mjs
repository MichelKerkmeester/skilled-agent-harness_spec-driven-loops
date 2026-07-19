import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const opencodeRootUrl = new URL("../../", skillRootUrl);
const commandsRootUrl = new URL("commands/", opencodeRootUrl);

const EXPECTED = [
  { mode: "interface", canonical: "/interface:design", action: "design", legacy: "/design:interface", legacyAction: "interface" },
  { mode: "foundations", canonical: "/interface:foundations", action: "foundations", legacy: "/design:foundations", legacyAction: "foundations" },
  { mode: "motion", canonical: "/interface:motion", action: "motion", legacy: "/design:motion", legacyAction: "motion" },
  { mode: "audit", canonical: "/interface:audit", action: "audit", legacy: "/design:audit", legacyAction: "audit" },
  { mode: "md-generator", canonical: "/interface:design-reference", action: "design-reference", legacy: "/design:md-generator", legacyAction: "md-generator" }
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
    assert.equal(record.canonicalCommand, expected.canonical);
    assert.deepEqual(record.compatibilityAliases, [expected.legacy]);
    assert.equal(hubRouter.commandSurface.canonicalByMode[expected.mode], expected.canonical);
    assert.equal(hubRouter.commandSurface.compatibilityAliases[expected.legacy], expected.canonical);

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

test("legacy design commands are thin in-place compatibility aliases", () => {
  for (const surface of surfaces) {
    assert.ok(surface.alias.includes(surface.expected.canonical));
    assert.ok(surface.alias.includes("$ARGUMENTS"));
    assert.match(surface.alias, /Do not invoke another public command/i);
    assert.doesNotMatch(surface.alias, nestedCommandDispatchPattern());
    assert.doesNotMatch(surface.alias, /##\s+\d+\.\s+(?:MODE ROUTING|EXECUTION TARGETS|PRESENTATION BOUNDARY)/i);
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

async function loadSurface(expected) {
  const assetBase = `interface-${expected.action}`;
  const [wrapper, presentation, auto, confirm, alias] = await Promise.all([
    readFile(new URL(`interface/${expected.action}.md`, commandsRootUrl), "utf8"),
    readFile(new URL(`interface/assets/${assetBase}-presentation.txt`, commandsRootUrl), "utf8"),
    readFile(new URL(`interface/assets/${assetBase}-auto.yaml`, commandsRootUrl), "utf8"),
    readFile(new URL(`interface/assets/${assetBase}-confirm.yaml`, commandsRootUrl), "utf8"),
    readFile(new URL(`design/${expected.legacyAction}.md`, commandsRootUrl), "utf8")
  ]);
  return { expected, wrapper, presentation, auto, confirm, alias };
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
