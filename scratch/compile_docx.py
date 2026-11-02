import os
import re
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_header_footer(doc):
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)
        
        # Header
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("NEXORA — Complete Technical Architecture & Academic Project Report")
        hrun.font.name = "Segoe UI"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(100, 116, 139)
        
        # Footer
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("NEXORA AI-Career Platform © 2026 | Confidential Academic Document")
        frun.font.name = "Segoe UI"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(100, 116, 139)

def build_docx():
    md_file = r"C:\Users\Admin\.gemini\antigravity\scratch\career-guidance-platform\PROJECT_COMPLETE_DOCUMENTATION\Complete_Project_Report.md"
    docx_file = r"C:\Users\Admin\.gemini\antigravity\scratch\career-guidance-platform\PROJECT_COMPLETE_DOCUMENTATION\Complete_Project_Report.docx"
    
    with open(md_file, "r", encoding="utf-8") as f:
        md_text = f.read()

    doc = Document()
    add_header_footer(doc)

    # Configure Default Style
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Segoe UI'
    font.size = Pt(10.5)
    font.color.rgb = RGBColor(30, 41, 59) # Slate 800

    lines = md_text.splitlines()
    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []

    def flush_table(t_lines):
        if not t_lines:
            return
        # Parse table rows
        rows_data = []
        for l in t_lines:
            if re.match(r'^\s*\|?\s*:?-+:?\s*\|', l):
                continue # delimiter line
            cells = [c.strip() for c in l.strip().strip('|').split('|')]
            if cells and any(cells):
                rows_data.append(cells)
        
        if not rows_data:
            return

        max_cols = max(len(r) for r in rows_data)
        # normalize
        for r in rows_data:
            while len(r) < max_cols:
                r.append("")

        table = doc.add_table(rows=len(rows_data), cols=max_cols)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = True

        for i, row in enumerate(rows_data):
            tr = table.rows[i]
            is_header = (i == 0)
            for j, val in enumerate(row):
                cell = tr.cells[j]
                cell.text = val
                set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
                cp = cell.paragraphs[0]
                cp.paragraph_format.space_after = Pt(2)
                cp.paragraph_format.space_before = Pt(2)
                
                if is_header:
                    set_cell_background(cell, "1E293B") # Dark slate
                    for r_in in cp.runs:
                        r_in.font.name = "Segoe UI"
                        r_in.font.size = Pt(9.5)
                        r_in.font.bold = True
                        r_in.font.color.rgb = RGBColor(255, 255, 255)
                else:
                    bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
                    set_cell_background(cell, bg)
                    for r_in in cp.runs:
                        r_in.font.name = "Segoe UI"
                        r_in.font.size = Pt(9.0)
                        r_in.font.color.rgb = RGBColor(51, 65, 85)
        
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    def flush_code(c_lines):
        if not c_lines:
            return
        code_text = "\n".join(c_lines)
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.left_indent = Inches(0.2)
        run = p.add_run(code_text)
        run.font.name = "Consolas"
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(30, 41, 59)
        # Background shading on paragraph
        pPr = p._p.get_or_add_pPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>')
        pPr.append(shd)

    i = 0
    while i < len(lines):
        line = lines[i]

        # Handle Code Blocks
        if line.strip().startswith("```"):
            if in_code_block:
                in_code_block = False
                flush_code(code_lines)
                code_lines = []
            else:
                if in_table:
                    in_table = False
                    flush_table(table_lines)
                    table_lines = []
                in_code_block = True
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Handle Markdown Tables
        if "|" in line and (line.strip().startswith("|") or line.strip().endswith("|")):
            in_table = True
            table_lines.append(line)
            i += 1
            continue
        elif in_table:
            in_table = False
            flush_table(table_lines)
            table_lines = []

        # Empty lines
        if not line.strip():
            i += 1
            continue

        # Headings
        if line.startswith("# "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(18)
            p.paragraph_format.space_after = Pt(8)
            run = p.add_run(line[2:].strip())
            run.font.name = "Segoe UI"
            run.font.size = Pt(20)
            run.font.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
        elif line.startswith("## "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(line[3:].strip())
            run.font.name = "Segoe UI"
            run.font.size = Pt(15)
            run.font.bold = True
            run.font.color.rgb = RGBColor(37, 99, 235) # Electric Blue
        elif line.startswith("### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(line[4:].strip())
            run.font.name = "Segoe UI"
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = RGBColor(14, 116, 144) # Cyan/Dark Teal
        elif line.startswith("#### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(line[5:].strip())
            run.font.name = "Segoe UI"
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(51, 65, 85)
        elif line.strip() == "---":
            # Horizontal rule
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(8)
            run = p.add_run("_______________________________________________________________________________")
            run.font.color.rgb = RGBColor(203, 213, 225)
            run.font.size = Pt(8)
        elif line.strip().startswith("- ") or line.strip().startswith("* "):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(line.strip()[2:])
            run.font.name = "Segoe UI"
            run.font.size = Pt(10.0)
        elif re.match(r'^\d+\.\s', line.strip()):
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            text_val = re.sub(r'^\d+\.\s', '', line.strip())
            run = p.add_run(text_val)
            run.font.name = "Segoe UI"
            run.font.size = Pt(10.0)
        else:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(line.strip())
            run.font.name = "Segoe UI"
            run.font.size = Pt(10.5)

        i += 1

    if in_table:
        flush_table(table_lines)
    if in_code_block:
        flush_code(code_lines)

    doc.save(docx_file)
    print(f"Generated formatted DOCX report successfully: {docx_file}")
    print(f"File size: {os.path.getsize(docx_file)} bytes")

if __name__ == "__main__":
    build_docx()
