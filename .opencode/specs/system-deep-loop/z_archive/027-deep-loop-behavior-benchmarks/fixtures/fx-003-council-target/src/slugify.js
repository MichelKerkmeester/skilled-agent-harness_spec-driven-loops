// Toy slug utility exposed as POST /slugify. Same seeded behavior as the other
// fixtures; present only so the council has concrete code to reason about.
function slugify(input, maxLen) {
  maxLen = maxLen || 60;
  const s = (typeof input === 'number') ? String(input) : input;
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, maxLen);
}
module.exports = { slugify };
