# PolarOps — Polar Expedition Operations System (prototype)

Demonstration prototype for NCPOR / MoES. All data is fictional.

## Run

```bash
node server.js
# or
npm start
```

Then open http://localhost:3000

Set a different port with `PORT=8080 node server.js`.

## Layout

```
polarops/
├── server.js          zero-dependency Node static server
├── package.json
└── public/
    └── index.html     the entire application (HTML + CSS + JS + demo data)
```

`index.html` is fully self-contained apart from the Google Fonts stylesheet, so it
also works by double-clicking the file. The server is only needed if you want a
real http:// origin (cleaner font loading, shareable on a LAN, deployable).

## Sign in

Any username and password are accepted. Pick a role on the login screen to see
how the role indicator and permissions change.
