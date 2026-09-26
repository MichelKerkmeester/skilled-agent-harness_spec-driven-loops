import test from "../../../runtime/javascript/nodeTest.mjs";
import assert from "../../../runtime/javascript/nodeAssertStrict.mjs";

// One registration location; the first callback finishes last. A failed
// assertion must remain on its own attempt, not overwrite the passing one.
for (const [value, delay] of [[true, 20], [false, 0]])
  test("duplicate registration", { concurrency: true }, async () => {
    await new Promise(resolve => setTimeout(resolve, delay));
    assert.equal(value, true);
  });

async function children(t) {
  for (const value of [1, 2])
    await t.test("same child", () => assert.ok(value));
}
test("first parent", children);
test("second parent", children);

for (const value of [1, 2])
  test("done callback", (t, done) => {
    assert.ok(value);
    done();
  });
