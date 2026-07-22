import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import {
  AUTHORED_DESIGN_FILENAME,
  AUTHORED_TOKENS_FILENAME,
  assertAuthoredDestination,
  assertReviewedConversionArtifact,
  refreshAuthoredExports,
  validateAuthoredBrand,
  writeAuthoredArtifact
} from "../authored-brand/authored-brand-boundary.mjs";

test("writer accepts authored paths and rejects measured paths", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "brand-first-paths-"));
  try {
    const accepted = assertAuthoredDestination(AUTHORED_DESIGN_FILENAME);
    assert.equal(accepted, AUTHORED_DESIGN_FILENAME, "positive control must accept the authored filename");
    await writeAuthoredArtifact(root, accepted, "authored positive control\n");
    assert.equal(await readFile(path.join(root, accepted), "utf8"), "authored positive control\n");

    for (const measuredPath of ["DESIGN.md", "tokens.json", "styles/brand.json"]) {
      await assert.rejects(
        writeAuthoredArtifact(root, measuredPath, "adversarial authored write\n"),
        /refuses measured destination/,
        `guard must reject ${measuredPath}`
      );
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("authored rerun changes authored exports while measured files remain byte-unchanged", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "brand-first-rerun-"));
  try {
    const measuredDesign = Buffer.from("measured design bytes\n", "utf8");
    const measuredTokens = Buffer.from('{"measured":true}\n', "utf8");
    await writeFile(path.join(root, "DESIGN.md"), measuredDesign);
    await writeFile(path.join(root, "tokens.json"), measuredTokens);

    await refreshAuthoredExports({
      rootDirectory: root,
      renderedDesign: "---\norigin: authored\n---\nauthored version one\n",
      authoredBrand: validBrand("#315d54")
    });
    await refreshAuthoredExports({
      rootDirectory: root,
      renderedDesign: "---\norigin: authored\n---\nauthored version two\n",
      authoredBrand: validBrand("#9b4d3f")
    });

    assert.equal(
      await readFile(path.join(root, AUTHORED_DESIGN_FILENAME), "utf8"),
      "---\norigin: authored\n---\nauthored version two\n",
      "positive control must prove the authored export refreshed"
    );
    assert.match(
      await readFile(path.join(root, AUTHORED_TOKENS_FILENAME), "utf8"),
      /#9b4d3f/,
      "positive control must prove authored tokens refreshed"
    );
    assert.deepEqual(await readFile(path.join(root, "DESIGN.md")), measuredDesign);
    assert.deepEqual(await readFile(path.join(root, "tokens.json")), measuredTokens);

    await assert.rejects(
      writeAuthoredArtifact(root, "tokens.json", "attempted overwrite\n"),
      /refuses measured destination/
    );
    assert.deepEqual(await readFile(path.join(root, "tokens.json")), measuredTokens);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rendered authored design requires explicit authored provenance", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "brand-first-rendered-provenance-"));
  try {
    const accepted = await refreshAuthoredExports({
      rootDirectory: root,
      renderedDesign: "---\norigin: authored\n---\n# Authored direction\n",
      authoredBrand: validBrand("#315d54")
    });
    assert.equal(accepted.length, 2, "positive control must write both provenance-bearing exports");

    await assert.rejects(
      refreshAuthoredExports({
        rootDirectory: root,
        renderedDesign: "# Authored direction without provenance\n",
        authoredBrand: validBrand("#315d54")
      }),
      /must declare origin: authored/,
      "rendered Markdown without authored provenance must be rejected"
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("every authored palette, type, and voice value requires authored provenance", () => {
  const accepted = validBrand("#315d54");
  assert.equal(validateAuthoredBrand(accepted), accepted, "positive control must accept complete provenance");

  const missingOrigin = structuredClone(accepted);
  delete missingOrigin.voice[0].origin;
  assert.throws(
    () => validateAuthoredBrand(missingOrigin),
    /must declare origin: authored/,
    "removing one origin guard must fail the artifact"
  );

  const missingConfidence = structuredClone(accepted);
  missingConfidence.type[0].provenance.confidenceNote = "";
  assert.throws(
    () => validateAuthoredBrand(missingConfidence),
    /requires a confidence note/,
    "removing one provenance field must fail the artifact"
  );
});

test("conversion requires a signed reviewed-conversion checklist with evidence", () => {
  const accepted = validReviewArtifact();
  assert.equal(
    assertReviewedConversionArtifact(accepted),
    accepted,
    "positive control must accept a complete human-review record"
  );

  const unsigned = structuredClone(accepted);
  unsigned.reviewerSignature = "";
  assert.throws(
    () => assertReviewedConversionArtifact(unsigned),
    /requires reviewerSignature/,
    "an unsigned conversion must be rejected"
  );

  const unreviewed = structuredClone(accepted);
  unreviewed.attestations = unreviewed.attestations.filter((item) => item !== "manual-approval-recorded");
  assert.throws(
    () => assertReviewedConversionArtifact(unreviewed),
    /missing attestation: manual-approval-recorded/,
    "an unreviewed conversion must be rejected"
  );

  const selfCertified = { ...accepted, verified: true };
  assert.throws(
    () => assertReviewedConversionArtifact(selfCertified),
    /Evidence-free verified flags cannot authorize conversion/,
    "an automated verified flag must not substitute for review"
  );
});

test("conversion signature must match the named human reviewer", () => {
  const accepted = validReviewArtifact();
  assert.equal(
    assertReviewedConversionArtifact(accepted),
    accepted,
    "positive control must accept a matching non-empty reviewer signature"
  );

  const mismatched = structuredClone(accepted);
  mismatched.reviewerSignature = "Different Human Reviewer";
  assert.throws(
    () => assertReviewedConversionArtifact(mismatched),
    /Reviewer signature must match the named human reviewer/,
    "a non-empty signature from a different reviewer must be rejected"
  );
});

test("boundary module rejects measured authority while resources remain structurally distinct", async () => {
  assert.equal(
    assertAuthoredDestination(AUTHORED_DESIGN_FILENAME),
    AUTHORED_DESIGN_FILENAME,
    "positive control must accept the authored destination"
  );
  assert.throws(
    () => assertAuthoredDestination("DESIGN.md"),
    /refuses measured destination/,
    "the real boundary module must reject a measured-named authored write"
  );

  const scriptUrl = new URL(import.meta.url);
  const skillRootUrl = new URL("../../", scriptUrl);
  const [template, schema, procedure] = await Promise.all([
    readFile(new URL("shared/authored-brand/authored-design-template.md", skillRootUrl), "utf8"),
    readFile(new URL("shared/authored-brand/authored-provenance-schema.md", skillRootUrl), "utf8"),
    readFile(new URL("shared/references/brand-first-lane.md", skillRootUrl), "utf8")
  ]);

  for (const source of [template, schema, procedure]) {
    assert.match(source, /AUTHORED-DESIGN\.md/);
    assert.match(source, /authored-tokens\.json/);
    assert.match(source, /origin: authored|"origin": "authored"/);
  }
  assert.match(procedure, /reviewed-conversion/);
  assert.match(procedure, /The authored lane never writes the measured destination/);

  const invalidTemplate = template.replaceAll("AUTHORED-DESIGN.md", "DESIGN.md");
  assert.doesNotMatch(
    invalidTemplate,
    /AUTHORED-DESIGN\.md/,
    "negative control proves a collapsed filename would fail the structural assertion"
  );
});

function validBrand(primaryColor) {
  const sourceDescription = "A calm planning tool for independent studios.";
  const provenance = {
    sourceDescription,
    authoredAt: "2026-07-22",
    confidenceNote: "Authored direction still requires contrast and product-fit validation."
  };
  return {
    sourceDescription,
    palette: [{ id: "palette.primary", value: primaryColor, origin: "authored", provenance: { ...provenance } }],
    type: [{ id: "type.display", value: "Reserved geometric sans", origin: "authored", provenance: { ...provenance } }],
    voice: [{ id: "voice.primary", value: "Direct, calm, and concrete", origin: "authored", provenance: { ...provenance } }]
  };
}

function validReviewArtifact() {
  return {
    artifactType: "reviewed-conversion",
    sourceArtifact: AUTHORED_DESIGN_FILENAME,
    reviewerName: "Human Reviewer",
    reviewerRole: "Design system owner",
    reviewedAt: "2026-07-22T18:00:00Z",
    reviewerSignature: "Human Reviewer",
    attestations: [
      "source-provenance-reviewed",
      "measurement-evidence-reviewed",
      "target-conflicts-reviewed",
      "manual-approval-recorded"
    ],
    selections: [
      {
        authoredValueId: "palette.primary",
        targetArtifact: "tokens.json",
        decision: "approved",
        measurementEvidence: ["Computed-color capture and contrast run in the project evidence record."]
      }
    ]
  };
}
