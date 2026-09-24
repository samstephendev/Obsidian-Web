# Obsidian Web

> A website & web application creation service — precision-built, minimal, and dark by design.

![Status](https://img.shields.io/badge/status-active-8b8b9a)
![License](https://img.shields.io/badge/license-MIT-1a1a1f)

**Est. 2026**

---

## About

Obsidian Web is a single-page marketing site for a website and web application development service. The design follows a dark, minimalist, premium aesthetic — pure black backgrounds, muted lavender-gray accents, and a geometric crystal logo mark — built to reflect precision, craft, and modern engineering.

## Features

- **Hero section** — brand mark, wordmark, and value proposition with a clear call-to-action
- **Services overview** — Website Design, Web App Development, E-commerce, and Maintenance/Support
- **Why Obsidian Web** — key differentiators at a glance
- **Portfolio grid** — showcase of past or placeholder project work
- **Contact & social** — direct links to Instagram and email
- **Fully responsive** — mobile-first layout with smooth-scroll navigation
- **Dark/light aware** — respects system theme preferences where applicable

## Tech Stack

- HTML5 / CSS3 / vanilla JavaScript *(or React, depending on setup)*
- Inline SVG icons (no external image dependencies)
- No build step required for the static version

## Getting Started

### Prerequisites

- A modern web browser
- (Optional) [Node.js](https://nodejs.org/) if running a local dev server or React build

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/obsidian-web.git
cd obsidian-web

# If using a static build — just open index.html
open index.html

# If using a Node/React setup
npm install
npm run dev
```

### Project Structure

```
obsidian-web/
├── index.html
├── /assets
│   ├── /icons
│   └── /images
├── /styles
│   └── main.css
├── /scripts
│   └── main.js
└── README.md
```

## Customization

| Element        | Location                          |
|----------------|------------------------------------|
| Colors/theme   | `styles/main.css` (`:root` variables) |
| Copy/content   | `index.html`                      |
| Logo/icon      | `assets/icons/`                   |
| Social links   | Footer section in `index.html`    |

## Deployment

This is a static site and can be deployed to any static hosting provider:

- **Vercel** — `vercel deploy`
- **Netlify** — drag-and-drop the build folder or connect the repo
- **GitHub Pages** — enable Pages on the repo settings, point to `main`/`docs`

## Connect

- Instagram: [@obsidianwebofficial](https://instagram.com/obsidianwebofficial)
- Email: *your-email@obsidianweb.com*

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center"><em>Obsidian Web — built with precision.</em></p>
