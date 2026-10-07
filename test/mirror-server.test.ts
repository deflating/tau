import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

// These must be set before the module is imported — mirror-server.ts reads
// them once at module load time via loadTauSettings().
const TEST_PORT = 31992;
process.env.TAU_HOST = "127.0.0.1";
process.env.TAU_MIRROR_PORT = String(TEST_PORT);

const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let fixtureRoot: string;
let outsideFile: string;

async function waitForServer(timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("mirror server did not start listening in time");
}

before(async () => {
  fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tau-mirror-test-"));
  fs.writeFileSync(path.join(fixtureRoot, "hello.txt"), "hello");

  outsideFile = fs.mkdtempSync(path.join(os.tmpdir(), "tau-mirror-outside-"));
  fs.writeFileSync(path.join(outsideFile, "secret.png"), "not-really-a-png");

  const mod: any = await import("../extensions/mirror-server.ts");

  const handlers = new Map<string, Array<(event: any, ctx: any) => any>>();
  const mockPi = {
    registerCommand: () => {},
    on: (eventType: string, handler: (event: any, ctx: any) => any) => {
      if (!handlers.has(eventType)) handlers.set(eventType, []);
      handlers.get(eventType)!.push(handler);
    },
    getSessionName: () => "test-session",
  };

  mod.default(mockPi);

  const mockCtx = {
    cwd: fixtureRoot,
    sessionManager: {
      getSessionFile: () => "",
      getEntries: () => [],
    },
    ui: {
      setStatus: () => {},
      notify: () => {},
    },
  };

  for (const handler of handlers.get("session_start") || []) {
    await handler({}, mockCtx);
  }

  await waitForServer();
});

after(() => {
  try {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
    fs.rmSync(outsideFile, { recursive: true, force: true });
  } catch {}
  try {
    const instanceFile = path.join(
      process.env.HOME || process.env.USERPROFILE || os.homedir(),
      ".pi",
      "tau-instances",
      `${process.pid}.json`,
    );
    fs.rmSync(instanceFile, { force: true });
  } catch {}
});

test("GET /api/files?path=../../etc is rejected as outside the allowed root", async () => {
  const res = await fetch(`${BASE_URL}/api/files?path=${encodeURIComponent(path.join(fixtureRoot, "../../etc"))}`);
  assert.equal(res.status, 403);
});

test("GET /api/file/preview?path=../../etc/passwd-style traversal is rejected", async () => {
  const traversal = path.join(fixtureRoot, "..", "..", "etc", "passwd.png");
  const res = await fetch(`${BASE_URL}/api/file/preview?path=${encodeURIComponent(traversal)}`);
  assert.equal(res.status, 403);
});

test("GET /api/files?path=<absolute path outside the root> is rejected", async () => {
  const res = await fetch(`${BASE_URL}/api/files?path=${encodeURIComponent(outsideFile)}`);
  assert.equal(res.status, 403);
});

test("GET /api/file/preview?path=<absolute path outside the root> is rejected", async () => {
  const outsideImage = path.join(outsideFile, "secret.png");
  const res = await fetch(`${BASE_URL}/api/file/preview?path=${encodeURIComponent(outsideImage)}`);
  assert.equal(res.status, 403);
});

test("GET /api/files?path=<legitimate path inside the root> succeeds", async () => {
  const res = await fetch(`${BASE_URL}/api/files?path=${encodeURIComponent(fixtureRoot)}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.path, path.resolve(fixtureRoot));
  assert.ok(body.items.some((item: any) => item.name === "hello.txt"));
});

test("GET /api/files with no path defaults to the session cwd and succeeds", async () => {
  const res = await fetch(`${BASE_URL}/api/files`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.path, path.resolve(fixtureRoot));
});
