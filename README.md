# Tau

A fork of the original Tau project: a web UI that mirrors your [Pi](https://github.com/badlogic/pi-mono) terminal session in the browser. No separate server — it runs as a Pi extension inside your existing process.

![Tau dark mode](docs/images/dark.png)

![Tau terracotta theme](docs/images/terracotta.png)

![Settings](docs/images/settings.png)

![Commands](docs/images/commands.png)

## What it does

Tau connects to your running Pi TUI and gives you a second view in the browser. Same session, same messages, same tools — just a different screen. Type in the terminal or the browser, both stay in sync.

- **Live mirroring** — streams messages, tool calls, and thinking blocks in real-time
- **Works on any device** — open it on your phone, tablet, or another monitor
- **Session browser** — view history from any past session
- **No extra process** — the Pi extension *is* the server

## Install

```bash
pi install npm:tau-mirror
```

Or from git:

```bash
pi install git:github.com/deflating/tau
```

## Usage

1. Start Pi normally in your terminal
2. Open the URL shown in the status bar (default: Tailscale-only if a Tailscale IP is available, otherwise `http://127.0.0.1:3001`)
3. That's it

Type `/qr` in the terminal to show a QR code. When Tailscale is available, the QR code points at the Tailscale URL for phone access.

## Features

### Chat
- Full markdown rendering with syntax-highlighted code blocks
- Streaming responses with typing indicator
- Image attachments (paste, drag & drop, or button)
- Copy any message with one click
- Inline diff viewer for edit tool calls (red/green lines)
- Scroll-to-bottom button with new message indicator
- Message queuing — type while the agent is working, messages queue and auto-send

### Session Management
- Browse all past sessions grouped by project
- Full-text search across all session history with highlighted snippets
- Sorted by last modified (most recent first)
- Live session marked with a green dot
- Historical sessions are read-only
- Inline session rename
- Favourite sessions, tags, and filtering

### Model & Thinking
- Model picker with search/filter and keyboard support
- Thinking level toggle (off/low/medium/high)
- Token usage percentage with context window visualiser
- Cost tracking per session

### Voice Input
- Mic button in the input area using Web Speech API (on-device dictation)
- Live transcription into the textarea
- Pulses red while recording

### File Browser
- Right sidebar with lazy-loaded file tree
- Navigate directories, open files natively
- Drag files onto the input to insert their path

### Compaction
- Manual context compaction with status display
- Auto-compaction support

### PWA
- Installable as a standalone app on iOS, Android, and macOS
- Custom app icons
- Service worker with network-first caching

## Configuration

Tau now prefers the `piRemote` namespace in `~/.pi/agent/settings.json`:

```json
{
  "piRemote": {
    "port": 3001,
    "disabled": false,
    "bindMode": "tailscale",
    "requireTailscale": true,
    "projectsDir": "~/vibe_coding"
  }
}
```

Bind modes:

- `tailscale` (default): bind only to the detected Tailscale IPv4 address (`100.64.0.0/10`); falls back to localhost with a warning if unavailable.
- `localhost`: bind only to `127.0.0.1`.
- `both`: bind separate listeners on `127.0.0.1` and the Tailscale IP.
- `all`: explicitly unsafe opt-in; binds `0.0.0.0`.

`requireTailscale` defaults to `true` and rejects non-Tailscale remote addresses on externally reachable listeners. Localhost access remains allowed for localhost listeners.

Environment variables (set before starting Pi):

| Variable | Default | Description |
|----------|---------|-------------|
| `PI_REMOTE_PORT` | `3001` | Server port |
| `PI_REMOTE_BIND_MODE` | `tailscale` | `tailscale`, `localhost`, `both`, or explicit unsafe `all` |
| `PI_REMOTE_REQUIRE_TAILSCALE` | `true` | Reject non-Tailscale clients on external listeners |
| `PI_REMOTE_STATIC_DIR` | *(bundled)* | Override static files path |
| `PI_REMOTE_DISABLED` | `0` | Set to `1` to disable Tau (it stays installed but won't start the server) |
| `PI_REMOTE_PROJECTS_DIR` | *(none)* | Projects directory for the project browser |
| `TAU_MIRROR_PORT` | `3001` | Legacy fallback server port |
| `TAU_STATIC_DIR` | *(bundled)* | Legacy fallback static files path |
| `TAU_DISABLED` | `0` | Legacy fallback disable flag |
| `TAU_USER` | *(none)* | HTTP Basic Auth username (both `TAU_USER` and `TAU_PASS` required to enable) |
| `TAU_PASS` | *(none)* | HTTP Basic Auth password |

### Authentication

Tau supports optional HTTP Basic Auth (browser-native login popup).

**1. Set credentials** — add to `~/.pi/agent/settings.json`:

```json
{
  "tau": {
    "user": "pi",
    "pass": "your-password"
  }
}
```

Or via environment variables: `TAU_USER=pi TAU_PASS=secret pi`

**2. Toggle on/off** — once credentials are configured, a "Require login" toggle appears in Settings within the Tau web UI. Flip it on to start requiring authentication, off to open it back up. The setting persists across restarts.

Both HTTP and WebSocket connections are gated when enabled. The `/api/health` endpoint remains open for monitoring.

### Start / Stop

Control Tau at runtime without uninstalling:

```
/tau-stop     Stop the mirror server
/tau-start    Start it again
```

To prevent Tau from auto-starting (e.g. in multi-session or dev container workflows):

```bash
TAU_DISABLED=1 pi
```

You can still start it manually with `/tau-start` in that session.

## How it works

Tau is a [Pi extension](https://github.com/badlogic/pi-mono#extensions) that starts an HTTP + WebSocket server inside the Pi process. The extension subscribes to all Pi events and forwards them to connected browser clients. Commands from the browser are executed via the extension API against the same agent session.

```
┌─────────────┐     ┌──────────────────────────────┐     ┌─────────────┐
│  Pi TUI     │     │  Pi Process                  │     │  Browser    │
│  (terminal) │◄───►│                              │◄───►│  (Tau)      │
│             │     │  tau extension               │     │             │
└─────────────┘     │    ↳ HTTP + WS on :3001      │     └─────────────┘
                    └──────────────────────────────┘
```

There's no separate server to run. The extension auto-loads when Pi starts and shuts down when Pi exits.

## Development

Clone and point the extension at the local static files:

```bash
git clone https://github.com/deflating/tau.git
cd tau
TAU_STATIC_DIR=$(pwd)/public pi
```

Edit the files in `public/` — refresh the browser to see changes.

## License

MIT
