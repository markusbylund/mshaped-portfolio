from __future__ import annotations

from pathlib import Path
import textwrap

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_PATH = OUTPUT_DIR / "mshaped-designsystem.pdf"

PAGE_W, PAGE_H = A4
MARGIN = 44


COLORS = {
    "background": "#090807",
    "background_subtle": "#0f0e0c",
    "surface": "#151310",
    "surface_elevated": "#1c1814",
    "surface_highlight": "#241d17",
    "text_primary": "#fbf8f3",
    "text_secondary": "#b9b0a6",
    "text_muted": "#8f877e",
    "accent": "#f97316",
    "accent_hover": "#fb923c",
    "light_bg": "#f8f7f4",
    "light_surface": "#ffffff",
    "light_surface_elevated": "#fffaf5",
    "light_text": "#1b1815",
    "border_dark": "#302923",
    "border_light": "#ddd4ca",
}


def c(hex_value: str) -> colors.Color:
    return colors.HexColor(hex_value)


def register_fonts() -> None:
    fonts = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("Segoe", str(fonts / "segoeui.ttf")))
    pdfmetrics.registerFont(TTFont("Segoe-Bold", str(fonts / "segoeuib.ttf")))
    pdfmetrics.registerFont(TTFont("Segoe-Light", str(fonts / "segoeuil.ttf")))


def set_fill(pdf: canvas.Canvas, key: str) -> None:
    pdf.setFillColor(c(COLORS[key]))


def draw_page_base(pdf: canvas.Canvas, title: str, page_no: int) -> None:
    set_fill(pdf, "background")
    pdf.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    pdf.setStrokeColor(c(COLORS["border_dark"]))
    pdf.setLineWidth(0.8)
    pdf.line(MARGIN, PAGE_H - 42, PAGE_W - MARGIN, PAGE_H - 42)
    pdf.line(MARGIN, 42, PAGE_W - MARGIN, 42)
    pdf.setFont("Segoe-Bold", 8)
    pdf.setFillColor(c(COLORS["text_muted"]))
    pdf.drawString(MARGIN, PAGE_H - 28, "Mshaped Design System")
    pdf.drawRightString(PAGE_W - MARGIN, PAGE_H - 28, title)
    pdf.drawString(MARGIN, 24, "Version 1.0 - baserad pa nuvarande portfolio")
    pdf.drawRightString(PAGE_W - MARGIN, 24, f"{page_no:02d}")


def text(pdf: canvas.Canvas, value: str, x: float, y: float, size: float = 10, font: str = "Segoe",
         color_key: str = "text_secondary", leading: float | None = None, max_width: float = 72) -> float:
    pdf.setFont(font, size)
    set_fill(pdf, color_key)
    line_height = leading or size * 1.45
    for raw in value.split("\n"):
        lines = textwrap.wrap(raw, width=int(max_width)) or [""]
        for line in lines:
            pdf.drawString(x, y, line)
            y -= line_height
    return y


def heading(pdf: canvas.Canvas, value: str, x: float, y: float, size: float = 24) -> float:
    pdf.setFont("Segoe-Bold", size)
    set_fill(pdf, "text_primary")
    pdf.drawString(x, y, value)
    return y - size * 1.28


def eyebrow(pdf: canvas.Canvas, value: str, x: float, y: float) -> None:
    pdf.setFont("Segoe-Bold", 8)
    pdf.setFillColor(c(COLORS["accent"]))
    pdf.drawString(x, y, value.upper())


def card(pdf: canvas.Canvas, x: float, y: float, w: float, h: float, fill: str = "surface",
         stroke: str = "border_dark", radius: float = 8) -> None:
    pdf.setFillColor(c(COLORS[fill]))
    pdf.setStrokeColor(c(COLORS[stroke]))
    pdf.setLineWidth(0.8)
    pdf.roundRect(x, y, w, h, radius, stroke=1, fill=1)


def swatch(pdf: canvas.Canvas, x: float, y: float, name: str, token: str, value: str, dark_label: bool = True) -> None:
    pdf.setFillColor(c(value))
    pdf.roundRect(x, y, 72, 52, 8, stroke=0, fill=1)
    pdf.setStrokeColor(c(COLORS["border_dark"]))
    pdf.roundRect(x, y, 72, 52, 8, stroke=1, fill=0)
    pdf.setFont("Segoe-Bold", 8)
    pdf.setFillColor(c(COLORS["text_primary"]))
    pdf.drawString(x + 84, y + 31, name)
    pdf.setFont("Segoe", 7.5)
    pdf.setFillColor(c(COLORS["text_muted"]))
    pdf.drawString(x + 84, y + 17, token)
    pdf.drawString(x + 84, y + 5, value)


def image_box(pdf: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, radius_label: str = "") -> None:
    try:
        img = ImageReader(str(path))
        iw, ih = img.getSize()
        scale = max(w / iw, h / ih)
        draw_w = iw * scale
        draw_h = ih * scale
        pdf.saveState()
        p = pdf.beginPath()
        p.roundRect(x, y, w, h, 8)
        pdf.clipPath(p, stroke=0, fill=0)
        pdf.drawImage(img, x - (draw_w - w) / 2, y - (draw_h - h) / 2, draw_w, draw_h, mask="auto")
        pdf.restoreState()
    except Exception:
        card(pdf, x, y, w, h, "surface_elevated")
        text(pdf, "Bild kunde inte laddas", x + 12, y + h / 2, 8)
    pdf.setStrokeColor(c(COLORS["border_dark"]))
    pdf.roundRect(x, y, w, h, 8, stroke=1, fill=0)
    if radius_label:
        text(pdf, radius_label, x, y - 12, 7, "Segoe", "text_muted", max_width=32)


def bullet_list(pdf: canvas.Canvas, items: list[str], x: float, y: float, width: int = 62) -> float:
    pdf.setFont("Segoe", 9)
    for item in items:
        pdf.setFillColor(c(COLORS["accent"]))
        pdf.circle(x + 3, y + 3, 2, stroke=0, fill=1)
        y = text(pdf, item, x + 14, y, 9, "Segoe", "text_secondary", max_width=width)
        y -= 4
    return y


def draw_button(pdf: canvas.Canvas, x: float, y: float, label: str, primary: bool = True) -> None:
    fill = "accent" if primary else "surface_elevated"
    stroke = "accent" if primary else "border_dark"
    label_color = "#140a02" if primary else COLORS["text_primary"]
    pdf.setFillColor(c(COLORS[fill]))
    pdf.setStrokeColor(c(COLORS[stroke]))
    pdf.roundRect(x, y, 148, 34, 8, stroke=1, fill=1)
    pdf.setFont("Segoe-Bold", 9)
    pdf.setFillColor(c(label_color))
    pdf.drawCentredString(x + 74, y + 12, label)


def page_cover(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Overview", 1)
    eyebrow(pdf, "UX/UI brand guide", MARGIN, PAGE_H - 112)
    pdf.setFont("Segoe-Bold", 38)
    set_fill(pdf, "text_primary")
    pdf.drawString(MARGIN, PAGE_H - 158, "Mshaped")
    pdf.setFont("Segoe-Light", 24)
    set_fill(pdf, "text_primary")
    pdf.drawString(MARGIN, PAGE_H - 190, "Designsystem")
    text(pdf,
         "Ett praktiskt designsystem for portfolio, konsultsida och case-presentation. Dokumentet samlar "
         "visuell identitet, typografi, farger, komponentprinciper, UX-regler och asset-anvandning.",
         MARGIN, PAGE_H - 226, 11, "Segoe", "text_secondary", max_width=62)
    draw_button(pdf, MARGIN, PAGE_H - 320, "Primar CTA", True)
    draw_button(pdf, MARGIN + 164, PAGE_H - 320, "Sekundar CTA", False)

    brand = ROOT / "public" / "assets" / "brand" / "mshaped-brand.webp"
    image_box(pdf, brand, PAGE_W - MARGIN - 220, PAGE_H - 380, 220, 220)

    y = 190
    card(pdf, MARGIN, y, PAGE_W - 2 * MARGIN, 92, "surface_elevated")
    text(pdf, "Karnposition", MARGIN + 20, y + 58, 8, "Segoe-Bold", "accent", max_width=30)
    text(pdf,
         "Mshaped ar en personlig digital studio dar strategi, UX och frontendutveckling mots. "
         "Uttrycket ska kannas lugnt, sjalvsakert, tekniskt och tillrackligt varmt for att bygga fortroende.",
         MARGIN + 20, y + 38, 10, "Segoe", "text_secondary", max_width=92)
    pdf.showPage()


def page_identity(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Identity", 2)
    y = heading(pdf, "1. Identitet och logotyp", MARGIN, PAGE_H - 86)
    text(pdf,
         "Mshaped anvander en ren ordmarkering och en abstrakt brand-bild som signalerar mote mellan "
         "interface design och frontend engineering. Logotypen ska ha gott om luft och inte konkurrera "
         "med case-bilder eller CTA:er.",
         MARGIN, y, 10, max_width=88)

    y = 590
    card(pdf, MARGIN, y, 236, 120, "surface")
    pdf.setFont("Segoe-Bold", 28)
    set_fill(pdf, "text_primary")
    pdf.drawString(MARGIN + 22, y + 62, "Mshaped")
    text(pdf, "Primar wordmark - anvands i header, footer och dokument.", MARGIN + 22, y + 34, 8, max_width=34)

    card(pdf, MARGIN + 260, y, 236, 120, "surface")
    brand = ROOT / "public" / "assets" / "brand" / "mshaped-brand.webp"
    image_box(pdf, brand, MARGIN + 280, y + 18, 84, 84)
    text(pdf, "Abstrakt varumarkesbild - anvands sparsamt som redaktionell signatur.", MARGIN + 382, y + 70, 8, max_width=22)

    y = 425
    card(pdf, MARGIN, y, 496, 120, "surface_elevated")
    text(pdf, "Clear space", MARGIN + 20, y + 84, 9, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Minsta luft runt wordmark: minst hojd pa bokstaven M.",
        "Placera inte orange ytor direkt bakom logotypen.",
        "Anvand vit/ljus text pa mork bakgrund och mork text pa ljus bakgrund.",
        "Brand-bilden ska inte beskäras sa att den tappar sin M-liknande form.",
    ], MARGIN + 20, y + 60, width=74)

    y = 240
    card(pdf, MARGIN, y, 496, 134, "surface")
    text(pdf, "Do / Don't", MARGIN + 20, y + 100, 9, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Gor: hall identiteten minimal, premium och tekniskt redaktionell.",
        "Gor: anvand orange som accent for handling, fokus och viktiga markeringar.",
        "Undvik: flera accentfarger, stora orange bakgrunder och tung glassmorphism.",
        "Undvik: generiska stockbilder nar riktiga case-skarmbilder finns.",
    ], MARGIN + 20, y + 76, width=78)
    pdf.showPage()


def page_color(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Color System", 3)
    y = heading(pdf, "2. Fargsystem", MARGIN, PAGE_H - 86)
    text(pdf,
         "Dark mode ar primar identitet. Light mode ar en sekundar tillganglighets- och preferensvariant. "
         "Orange ska vara sparsam: CTA, aktivt lage, hover, fokus och utvalda highlights.",
         MARGIN, y, 10, max_width=92)

    y = 602
    text(pdf, "Dark mode tokens", MARGIN, y + 62, 10, "Segoe-Bold", "text_primary")
    swatches = [
        ("Background", "--background", COLORS["background"]),
        ("Subtle background", "--background-subtle", COLORS["background_subtle"]),
        ("Surface", "--surface", COLORS["surface"]),
        ("Surface elevated", "--surface-elevated", COLORS["surface_elevated"]),
        ("Surface highlight", "--surface-highlight", COLORS["surface_highlight"]),
        ("Text primary", "--text-primary", COLORS["text_primary"], False),
        ("Text secondary", "--text-secondary", COLORS["text_secondary"], False),
        ("Accent orange", "--accent-orange", COLORS["accent"], False),
    ]
    for i, item in enumerate(swatches):
        col = i % 2
        row = i // 2
        dark_label = len(item) < 4 or item[3]
        swatch(pdf, MARGIN + col * 250, y - row * 72, item[0], item[1], item[2], dark_label=dark_label)

    y = 252
    text(pdf, "Light mode tokens", MARGIN, y + 62, 10, "Segoe-Bold", "text_primary")
    light = [
        ("Background", "--background", COLORS["light_bg"], False),
        ("Surface", "--surface", COLORS["light_surface"], False),
        ("Elevated", "--surface-elevated", COLORS["light_surface_elevated"], False),
        ("Text", "--text-primary", COLORS["light_text"], True),
    ]
    for i, item in enumerate(light):
        col = i % 2
        row = i // 2
        swatch(pdf, MARGIN + col * 250, y - row * 72, item[0], item[1], item[2], dark_label=item[3])

    card(pdf, MARGIN, 56, 496, 112, "surface_elevated")
    text(pdf, "Kontrastregler", MARGIN + 20, 138, 9, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Primar text ska alltid ligga pa hogsta kontrastniva.",
        "Muted text anvands endast for metadata och stodtext.",
        "Orange text pa mork bakgrund anvands for interaktion, inte lang brodtext.",
    ], MARGIN + 20, 116, width=78)
    pdf.showPage()


def page_typography(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Typography & Spacing", 4)
    y = heading(pdf, "3. Typografi och layoutsystem", MARGIN, PAGE_H - 86)
    text(pdf,
         "Webben anvander Manrope som huvudfamilj och Instrument Serif som selektiv redaktionell accent. "
         "PDF:en renderas med Segoe UI som lokal dokumentfont, men rollerna nedan speglar webbens system.",
         MARGIN, y, 10, max_width=92)

    y = 596
    card(pdf, MARGIN, y, 496, 148, "surface")
    pdf.setFont("Segoe-Bold", 30)
    set_fill(pdf, "text_primary")
    pdf.drawString(MARGIN + 20, y + 94, "Webbplatser som gor det enklare")
    pdf.setFont("Segoe-Light", 23)
    pdf.setFillColor(c(COLORS["accent_hover"]))
    pdf.drawString(MARGIN + 20, y + 62, "att bli vald.")
    text(pdf, "Hero-rubrik: clamp-baserad, tydlig och kundorienterad.", MARGIN + 20, y + 34, 8)

    y = 408
    columns = [(MARGIN, "Display", "clamp(3rem, 9vw, 6rem)", "Stora hero- och case-rubriker."),
               (MARGIN + 170, "Heading", "clamp(2rem, 5vw, 3.8rem)", "Sektionsrubriker med tydlig scanning."),
               (MARGIN + 340, "Body", "1rem-1.08rem", "Lugn lasning, 1.7 line-height.")]
    for x, name, size, desc in columns:
        card(pdf, x, y, 150, 116, "surface_elevated")
        text(pdf, name, x + 14, y + 82, 10, "Segoe-Bold", "text_primary")
        text(pdf, size, x + 14, y + 60, 8, "Segoe-Bold", "accent")
        text(pdf, desc, x + 14, y + 42, 8, max_width=22)

    y = 222
    card(pdf, MARGIN, y, 496, 126, "surface")
    text(pdf, "Spacing och grid", MARGIN + 20, y + 92, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Maxbredd: --container 1180px. Innehall ska kannas redaktionellt pa stora skarmar.",
        "Sektioner: generos vertikal rytm, men kompakta kort och tydliga grupper.",
        "Radius: 8px for professionella kort och knappar. Storre radier endast dar produkten kraver mjukare kansla.",
        "Scroll offset: 94px sa ankare inte hamnar bakom sticky navigation.",
    ], MARGIN + 20, y + 68, width=78)
    pdf.showPage()


def page_components(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Components", 5)
    y = heading(pdf, "4. Komponenter och interaktion", MARGIN, PAGE_H - 86)
    text(pdf,
         "Komponenterna ska upplevas lugna, tydliga och premium. Motion anvands for orientering och feedback, "
         "inte for show. Standardtransitionen ar 480ms cubic-bezier(0.22, 1, 0.36, 1).",
         MARGIN, y, 10, max_width=92)

    y = 590
    card(pdf, MARGIN, y, 496, 142, "surface")
    text(pdf, "Navigation", MARGIN + 20, y + 106, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Sticky header med transparent topp-lage och tydligare yta efter scroll.",
        "Aktiv lank markeras med diskret orange state.",
        "Mobilmeny stangs med Escape och har tydliga fokuslagen.",
        "Custom cursor endast for desktop med hover och fine pointer.",
    ], MARGIN + 20, y + 82, width=78)

    y = 408
    card(pdf, MARGIN, y, 236, 126, "surface_elevated")
    text(pdf, "Knappar", MARGIN + 18, y + 90, 10, "Segoe-Bold", "text_primary")
    draw_button(pdf, MARGIN + 18, y + 48, "Beratta om ert projekt", True)
    draw_button(pdf, MARGIN + 18, y + 10, "Se utvalda case", False)
    text(pdf, "Hover: liten translateY, accent-glow och tydligare border.", MARGIN + 180, y + 57, 8, max_width=18)

    card(pdf, MARGIN + 260, y, 236, 126, "surface_elevated")
    text(pdf, "Kort", MARGIN + 278, y + 90, 10, "Segoe-Bold", "text_primary")
    pdf.setStrokeColor(c(COLORS["accent"]))
    pdf.setFillColor(c(COLORS["surface_highlight"]))
    pdf.roundRect(MARGIN + 278, y + 30, 76, 48, 8, stroke=1, fill=1)
    pdf.setFillColor(c(COLORS["surface"]))
    pdf.roundRect(MARGIN + 366, y + 30, 76, 48, 8, stroke=1, fill=1)
    text(pdf, "Hover: hojd elevation, tydligare border, minimal forflyttning.", MARGIN + 278, y + 13, 8, max_width=32)

    y = 214
    card(pdf, MARGIN, y, 496, 134, "surface")
    text(pdf, "UX-principer", MARGIN + 20, y + 100, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Besokaren ska forsta erbjudande, problem och nasta steg inom fem sekunder.",
        "Projektsektionen ska fungera som bevis: bild, kategori, beskrivning, teknik och CTA.",
        "Formular ska vara enkla, tillgangliga och ge tydlig feedback.",
        "Alla hover-effekter ska ha keyboard- och focus-motsvarighet.",
    ], MARGIN + 20, y + 76, width=78)
    pdf.showPage()


def page_imagery(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Imagery & Cases", 6)
    y = heading(pdf, "5. Bildsystem och case-assets", MARGIN, PAGE_H - 86)
    text(pdf,
         "Mshaped ska prioritera riktiga skarmbilder fran byggda case. Fallback-ytor far vara neutrala, men ska "
         "inte kannas tomma. Bilderna ligger strukturerat i public/assets/cases och kallmaterial i assets/source.",
         MARGIN, y, 10, max_width=92)

    cases = [
        ("Solar Expanse", ROOT / "public/assets/cases/solar-expanse/cover-16x10.webp", "Cinematic space interface"),
        ("Playdate Planner", ROOT / "public/assets/cases/playdate-planner/cover-16x10.webp", "Mobile-first product UX"),
        ("The Five Crystals", ROOT / "public/assets/cases/the-five-crystals/cover-16x10.webp", "Interactive 3D game prototype"),
    ]
    y = 520
    for i, (name, path, label) in enumerate(cases):
        x = MARGIN + i * 168
        image_box(pdf, path, x, y, 150, 94)
        text(pdf, name, x, y - 18, 8.5, "Segoe-Bold", "text_primary", max_width=24)
        text(pdf, label, x, y - 32, 7.5, "Segoe", "text_muted", max_width=24)

    y = 278
    card(pdf, MARGIN, y, 496, 154, "surface_elevated")
    text(pdf, "Bildregler", MARGIN + 20, y + 120, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Case covers: 16:10 for kort och oversikter.",
        "Mobilbilder: 4:5 for responsiva card-media och sociala beskarningar.",
        "WebP i public/assets for produktion. PNG-kallor i assets/source for framtida optimering.",
        "Anvand alt-texter som beskriver vad skarmbilden visar, inte bara projektnamnet.",
        "Undvik stockbilder for projekt. Visa produkt, gränssnitt eller spelbar vy.",
    ], MARGIN + 20, y + 96, width=78)
    pdf.showPage()


def page_content_accessibility(pdf: canvas.Canvas) -> None:
    draw_page_base(pdf, "Content & Accessibility", 7)
    y = heading(pdf, "6. Copy, tillganglighet och implementation", MARGIN, PAGE_H - 86)
    y = text(pdf,
         "Mshaped skrivs i forsta person singular: jag. Rosten ska vara konkret, lugn och kundorienterad. "
         "Tekniknamn anvands nar de fortydligar, inte for att imponera.",
         MARGIN, y, 10, max_width=92)

    y = min(y - 26, 538)
    card(pdf, MARGIN, y, 236, 170, "surface")
    text(pdf, "Copyprinciper", MARGIN + 18, y + 134, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Borga med kundens problem eller onskade forandring.",
        "Var tydlig med nasta steg.",
        "Skriv case som faktisk dokumentation, inte som fejkade resultat.",
        "Undvik superlativ utan underlag.",
    ], MARGIN + 18, y + 110, width=32)

    card(pdf, MARGIN + 260, y, 236, 170, "surface")
    text(pdf, "Tillganglighet", MARGIN + 278, y + 134, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Tydliga focus states med orange accent.",
        "Touchytor ska vara stora nog pa mobil.",
        "Respektera prefers-reduced-motion.",
        "Text ska inte gommas av scroll-animationer.",
    ], MARGIN + 278, y + 110, width=32)

    y = 300
    card(pdf, MARGIN, y, 496, 174, "surface_elevated")
    text(pdf, "Implementation tokens", MARGIN + 20, y + 140, 10, "Segoe-Bold", "text_primary")
    code = [
        "--background: #090807",
        "--surface: #151310",
        "--surface-elevated: #1c1814",
        "--text-primary: #fbf8f3",
        "--accent-orange: #f97316",
        "--radius: 8px",
        "--container: 1180px",
        "--transition-standard: 480ms cubic-bezier(0.22, 1, 0.36, 1)",
    ]
    pdf.setFont("Courier", 8)
    pdf.setFillColor(c(COLORS["text_secondary"]))
    yy = y + 116
    for line in code:
        pdf.drawString(MARGIN + 24, yy, line)
        yy -= 16

    y = 96
    card(pdf, MARGIN, y, 496, 132, "surface")
    text(pdf, "Nasta design iteration", MARGIN + 20, y + 98, 10, "Segoe-Bold", "text_primary")
    bullet_list(pdf, [
        "Byt placeholder-kontaktuppgifter mot riktiga kanaler.",
        "Lagg till riktiga GitHub-lankar nar repos ar redo.",
        "Komplettera med kundbevis eller resultat for verkliga case.",
        "Utvardera kodsplit for tunga Three.js-delar.",
    ], MARGIN + 20, y + 74, width=78)
    pdf.showPage()


def build_pdf() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    register_fonts()
    pdf = canvas.Canvas(str(OUTPUT_PATH), pagesize=A4)
    pdf.setTitle("Mshaped Designsystem")
    pdf.setAuthor("Mshaped")
    pdf.setSubject("UX/UI design system, brand guide and frontend tokens")
    page_cover(pdf)
    page_identity(pdf)
    page_color(pdf)
    page_typography(pdf)
    page_components(pdf)
    page_imagery(pdf)
    page_content_accessibility(pdf)
    pdf.save()
    print(OUTPUT_PATH)


if __name__ == "__main__":
    build_pdf()
