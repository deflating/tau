# Pi Remote Mobile UI (Tau hard fork)

This repository is a hard fork of Tau. Treat it as a new product/extension that may diverge freely from upstream Tau. The immediate branch is `hardForkPreparation`.

## Product goal

Build a secure, phone-friendly remote control surface for Pi over Tailscale: "Pi on the move" without SSH, while preserving the normal local terminal TUI workflow.

The web UI runs in-process as a Pi extension, exposing HTTP + WebSocket access to the current Pi process/session. A phone browser/PWA should be able to view and control live Pi sessions, browse history, and continue work over a private tailnet.

## Core goals

- Access and control Pi from a phone over Tailscale.
- Continue existing Pi sessions and create/start new ones where Pi's extension/session APIs support it.
- Preserve Tau's useful full-control semantics: send prompts, view streaming output, browse sessions, switch models/settings where supported, and interact with Pi as if sitting at the machine.
- Keep the terminal TUI as the primary local workflow; the remote UI is additive, not a replacement.
- Make the MVP secure enough for a single-user private tailnet setup.
- Prefer secure-by-default behaviour over convenience defaults.
- Make setup easy: install extension, configure PIN/auth, then open a Tailscale URL or scan a QR code.

## Non-goals for MVP

- Public internet exposure.
- Multi-user/team access control.
- Upstream compatibility with Tau.
- Reimplementing Pi's core session/runtime model.
- A separate always-on daemon, unless later needed for launching sessions when no Pi process is active.
- Fine-grained tool permissions unless a clear safety need emerges.

## Security posture

Tailscale is the primary network boundary, but the app must still require an app-level unlock such as a PIN/passphrase. Assume the UI can perform powerful coding-agent actions; avoid accidental broad exposure.

Required direction:

- Do **not** default to binding `0.0.0.0`.
- Prefer binding to the Tailscale interface/IP when available.
- Fall back to `127.0.0.1` and warn if Tailscale is unavailable.
- Require explicit opt-in for broad LAN/all-interface binding.
- Replace plaintext/basic-auth-first flows with hashed PIN/passphrase + signed session token/cookie auth.
- Authenticate WebSocket upgrades with the same token/session model.
- Add origin checks, clear exposure status, failed-login throttling, logout/revocation, and security headers.
- Review whether any unauthenticated endpoint is truly necessary.

## Naming and config migration direction

Rename visible Tau identity over time. Do not add new user-facing Tau-specific names unless preserving compatibility during transition.

Target config namespace in `~/.pi/agent/settings.json` should move away from `tau`, e.g. `piRemote`, `mobileUi`, or the final project name.

Likely target config shape:

```json
{
  "piRemote": {
    "port": 3001,
    "disabled": false,
    "bindMode": "tailscale",
    "requireTailscale": true,
    "pinHash": "...",
    "sessionSecretPath": "~/.pi/agent/pi-remote/session-secret",
    "tokenTtlHours": 168,
    "staticDir": null
  }
}
```

Target runtime/state directory:

- `~/.pi/agent/pi-remote/session-secret`
- `~/.pi/agent/pi-remote/auth.json`
- `~/.pi/agent/pi-remote/instances/*.json`

Target env var prefix: `PI_REMOTE_` rather than `TAU_`.

Target commands to consider:

- `/remote-start`
- `/remote-stop`
- `/remote-qr`
- `/remote-status`
- `/remote-set-pin`
- `/remote-lock` or `/remote-logout-all`

## Implementation milestones

1. **Fork and rename foundation**
   - Rename visible Tau strings, package/extension identity, config namespace, env vars, instance directory, and slash commands.
   - Keep behaviour close to Tau initially so the UI stays functional.
   - Confirm local browser and phone-over-Tailscale access still work.

2. **Secure network defaults**
   - Implement bind modes: `localhost`, `tailscale`, and explicit unsafe `all`.
   - Detect Tailscale IPs using `100.64.0.0/10`, not simple `100.*` matching.
   - Prefer Tailscale URL in status, logs, notifications, and QR codes.

3. **PIN/session authentication**
   - Store only a PIN/passphrase hash.
   - Issue signed session token/cookie after login.
   - Require auth for HTTP and WebSocket.
   - Add logout, logout-all/revocation, and simple failed-login throttling.

4. **Mobile workflow polish**
   - Improve lock screen, reconnect behaviour, streaming state, textarea/input handling, session switcher, and tap targets.
   - Show a visible security/exposure indicator.

5. **Session management expansion**
   - Audit Tau's current historical/live session capabilities.
   - Add "create new session from phone" only where the running Pi process/extension API supports it.
   - Design daemon/launcher mode separately if needed later.

6. **Hardening pass**
   - Review all endpoints and WebSocket paths for auth bypass.
   - Test path traversal, stale token handling, origin checks, unsafe bind config, and stale/zombie instance cleanup.
   - Document the threat model: private Tailscale single-user use, not public internet exposure.

## Existing architecture to preserve initially

- Backend Pi extension starts HTTP + WebSocket server inside the Pi process.
- Static frontend is served from `public/`.
- Terminal TUI remains active locally.
- Existing Pi sessions remain under `~/.pi/agent/sessions`.
- Tau's instance registry/cleanup idea is useful, but should move under the new state directory.

## Coding notes

- Be conservative in early refactors: rename and secure defaults without breaking the UI.
- Prefer small, testable changes and keep the web app functional after each milestone.
- When adding auth/security code, avoid logging secrets/tokens/PINs.
- Any unsafe exposure mode should be visibly labelled and require explicit configuration.
