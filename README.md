# Tau

A web UI that mirrors your [Pi](https://github.com/badlogic/pi-mono) terminal session in the browser. No separate server — it runs as a Pi extension inside your existing process.

![Tau dark mode](docs/images/dark.png)

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
pi install git:github.com/mattkennelly/tau
```

## Usage

1. Start Pi normally in your terminal
2. Open the URL shown in the status bar (default: `http://localhost:3001`)
3. That's it

On your phone, type `/qr` in the terminal to show a QR code.

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

### Themes
Six built-in themes with frosted glass design:

| Theme | Style |
|-------|-------|
| **Dusk** | Clean neutral dark (default) |
| **Dawn** | Warm blue dark |
| **Midnight** | OLED black |
| **Clean** | Apple-style light with cyan-blue accents |
| **Terracotta** | Warm light |
| **Sage** | Warm olive-green light |

Theme picker shows colour palette dots. Frosted glass header and input area with `backdrop-filter` blur.

### Mobile
Fully optimised mobile experience — not just responsive, but rethought for touch:

- Slide-over sidebar (80% width) with swipe-from-edge gesture
- Per-theme tinted sidebar backgrounds
- iOS-native session list styling (proper font sizes, flat dividers, touch targets)
- Full-width assistant messages
- Model picker in header, cost/tokens collapsible above input
- Copy button always visible as a small icon
- Auto-reconnect WebSocket on app resume
- 16px input font to prevent iOS zoom
- No autofocus — keyboard stays out of the way

See [MOBILE.md](MOBILE.md) for the full list of mobile-specific customisations.

### PWA
- Installable as a standalone app on iOS, Android, and macOS
- Custom app icons
- Service worker with network-first caching

## Configuration

Environment variables (set before starting Pi):

| Variable | Default | Description |
|----------|---------|-------------|
| `TAU_MIRROR_PORT` | `3001` | Server port |
| `TAU_STATIC_DIR` | *(bundled)* | Override static files path |

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
git clone https://github.com/mattkennelly/tau.git
cd tau
TAU_STATIC_DIR=$(pwd)/public pi
```

Edit the files in `public/` — refresh the browser to see changes.

## License

MIT
