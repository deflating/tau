import { test } from "node:test";
import assert from "node:assert/strict";
import * as path from "node:path";
import * as os from "node:os";
import { isPathWithinRoot, isPathAllowed, resolveAllowedRoots } from "../extensions/mirror-server.ts";

const root = path.join(os.tmpdir(), "tau-test-root");

test("isPathWithinRoot: rejects ../ traversal out of the root", () => {
  assert.equal(isPathWithinRoot(path.join(root, "../../etc"), root), false);
});

test("isPathWithinRoot: rejects an absolute path outside the root", () => {
  assert.equal(isPathWithinRoot("/etc/passwd", root), false);
});

test("isPathWithinRoot: accepts the root itself and nested paths", () => {
  assert.equal(isPathWithinRoot(root, root), true);
  assert.equal(isPathWithinRoot(path.join(root, "sub", "file.txt"), root), true);
});

test("isPathWithinRoot: does not allow a sibling dir with a matching prefix", () => {
  assert.equal(isPathWithinRoot(root + "-evil", root), false);
});

test("resolveAllowedRoots: anchors to ctx.cwd, not process.cwd()", () => {
  const roots = resolveAllowedRoots({ cwd: root });
  assert.deepEqual(roots, [path.resolve(root)]);
});

test("resolveAllowedRoots: picks up session-log cwd from sessionEntries", () => {
  const sessionCwd = path.join(os.tmpdir(), "tau-test-session-cwd");
  const roots = resolveAllowedRoots({ cwd: null, sessionEntries: [{ type: "session", cwd: sessionCwd }] });
  assert.deepEqual(roots, [path.resolve(sessionCwd)]);
});

test("resolveAllowedRoots: TAU_ALLOWED_ROOTS env var adds extra configurable roots", () => {
  const extraRoot = path.join(os.tmpdir(), "tau-test-extra-root");
  const prev = process.env.TAU_ALLOWED_ROOTS;
  process.env.TAU_ALLOWED_ROOTS = extraRoot;
  try {
    const roots = resolveAllowedRoots({ cwd: root });
    assert.ok(roots.includes(path.resolve(root)));
    assert.ok(roots.includes(path.resolve(extraRoot)));
  } finally {
    if (prev === undefined) delete process.env.TAU_ALLOWED_ROOTS;
    else process.env.TAU_ALLOWED_ROOTS = prev;
  }
});

test("isPathAllowed: true when inside any configured root", () => {
  const otherRoot = path.join(os.tmpdir(), "tau-test-other-root");
  const roots = [path.resolve(root), path.resolve(otherRoot)];
  assert.equal(isPathAllowed(path.join(otherRoot, "a.txt"), roots), true);
});

test("isPathAllowed: false when outside every configured root", () => {
  const otherRoot = path.join(os.tmpdir(), "tau-test-other-root");
  const roots = [path.resolve(root), path.resolve(otherRoot)];
  assert.equal(isPathAllowed("/etc/passwd", roots), false);
});
