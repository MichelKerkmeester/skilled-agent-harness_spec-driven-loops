import test from "node:test";
import assert from "node:assert/strict";
import { renderLoadedBundle, stripFrontmatter } from "../src/skill-io.ts";

test("stripFrontmatter removes YAML frontmatter without dropping body", () => {
  assert.equal(stripFrontmatter("---\nname: x\ndescription: y\n---\n\n# Instructions\nDo work."), "# Instructions\nDo work.");
});

test("renderLoadedBundle reports missing dependencies and cycles to the model", () => {
  const text = renderLoadedBundle("root", [{
    name: "root",
    description: "Root",
    filePath: "/root/SKILL.md",
    body: "Do root work",
    automaticDependencies: [],
    configuredDependencies: [],
  }], {
    missing: ["missing-helper"],
    cycles: [["root", "helper", "root"]],
  });
  assert.match(text, /WARNING: Missing declared dependencies: missing-helper/);
  assert.match(text, /Dependency cycle detected: root -> helper -> root/);
  assert.match(text, /Do root work/);
});


test("renderLoadedBundle keeps metadata from breaking its wrapper structure", () => {
  const text = renderLoadedBundle('odd"<root>', [{
    name: 'odd"<root>',
    description: "",
    filePath: "/tmp/weird\npath/SKILL.md",
    body: "instructions",
    automaticDependencies: [],
    configuredDependencies: [],
  }]);
  assert.match(text, /roots="odd&quot;&lt;root&gt;"/);
  assert.doesNotMatch(text, /Source directory: .*\npath/);
  assert.match(text, /Source directory: \/tmp\/weird path/);
});
