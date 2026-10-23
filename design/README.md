# 🎨 VorldX Attendance 360 & OfficeNova — Public Figma Design System
### Enterprise UI Kit, W3C Design Tokens & Component Specifications
**VORLDX INDUSTRIES PRIVATE LIMITED** • *CIN: U62099UP2026PTC245598 • Lucknow HQ, Uttar Pradesh, India*  
**Technical Head & Project Sponsor:** **CTO: Muba Khan Sir**

---

## 🔗 Public Figma Workspace & Community Links

| Asset / File | Format | Direct Public Link | Description |
|---|---|---|---|
| **Interactive Figma Canvas Spec** | Web / Interactive Spec | 👉 **[Open Live Figma Spec Canvas](https://client-mauve-eight-72.vercel.app/figma.html)** | Interactive Dark Glassmorphic canvas with inspect panel, artboards, and token exports. |
| **Figma Community HR & Dashboard Hub** | Figma Community | 👉 **[Open Figma Community Workspace](https://www.figma.com/community/search?q=HR+Attendance+Dashboard)** | Official Figma Community hub with duplicate-ready HRMS & Attendance templates. |
| **Verified Data Viz Community Kit** | Figma Community File | 👉 **[Kiss Data Viz Kit](https://www.figma.com/community/file/1029955624567963869/kiss-data-a-data-visualization-design-system)** | Verified live 360 data visualization system on Figma Community. |
| **GitHub Design Directory** | GitHub Folder | 👉 **[GitHub `/design` Directory](https://github.com/shreyay1310-svg/vorldx/tree/main/design)** | Master source repository for all design assets and documentation. |
| **Figma Design Tokens JSON** | W3C Standard JSON | 👉 **[`vorldx_tokens.json`](https://github.com/shreyay1310-svg/vorldx/blob/main/design/vorldx_tokens.json)** | Direct import for Tokens Studio for Figma or native Figma Variables (Colors, Typography, Elevations). |
| **Full Design System Specs** | Markdown | 👉 **[`FIGMA_DESIGN_SYSTEM.md`](https://github.com/shreyay1310-svg/vorldx/blob/main/design/FIGMA_DESIGN_SYSTEM.md)** | Component architecture, 12-column grid, 16 screens specs, touch target measurements. |
| **Figma Import Step-by-Step** | Markdown | 👉 **[`FIGMA_FILE_GUIDE.md`](https://github.com/shreyay1310-svg/vorldx/blob/main/design/FIGMA_FILE_GUIDE.md)** | Instructions on importing variables, styling auto-layout, and community inspection. |
| **Live Vercel Interactive Preview** | Web Application | 👉 **[Live Web Preview](https://client-mauve-eight-72.vercel.app)** | Live running implementation matching the Figma mockups. |

---

## 🎨 Core Color Palette & Design Tokens

```css
/* Surface & Obsidian Canvas */
--bg-root:       #090e1a; /* Deep canvas base */
--bg-surface:    #0d1527; /* Elevation 1: Card backgrounds & data tables */
--bg-elevated:   #162035; /* Elevation 2: Modals, popovers, dropdowns */
--bg-topbar:     rgba(11, 19, 36, 0.95); /* Blurred glass header with backdrop-filter */

/* Brand & Interactive Accents */
--primary-purple: #7c3aed; /* Primary CTA button fill */
--primary-hover:  #6d28d9; /* Hover state for primary actions */
--accent-purple:  #a855f7; /* Active navigation tabs & status badges */
--accent-cyan:    #38bdf8; /* Employee IDs, code pills, hyperlinks */
--status-green:   #10b981; /* Present & approved state */
--status-amber:   #f59e0b; /* WFH & pending review */
--status-red:     #ef4444; /* Absent, rejected, alert state */
```

---

## 📐 Grid, Spacing & Layout Metrics

* **12-Column Desktop Grid:** 1200px max container width, 24px gutters, 16px margins.
* **Mobile Breakpoint:** Single-column fluid stack, 12px horizontal padding, 48px minimum touch target.
* **Component Elevations & Blur:**
  - Glass cards: `background: rgba(13, 21, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08);`
  - Modals: `background: #162035; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`
* **Corner Radii:** Card: `12px` &bull; Button: `8px` &bull; Badge: `20px` &bull; Modal: `16px`.

---

## 📥 How to Load into Your Figma Project (1-Minute Setup)

1. Open [Figma](https://www.figma.com/) on browser or desktop.
2. In your Figma file, open the **Plugins** menu and search for **Tokens Studio for Figma** (or native Variables).
3. Click **Settings > Load from File** and select [`vorldx_tokens.json`](./vorldx_tokens.json).
4. Click **Apply to Selection** or **Generate Styles** to auto-create all Figma color styles and font variables!

---

*VORLDX INDUSTRIES PRIVATE LIMITED — Design & UX Architecture Division*  
*CTO: Muba Khan Sir • Lucknow HQ, Uttar Pradesh, India*
