import os
import sys

# Import all builder modules
import gen_full_report
import report_chapters_1_5
import report_chapters_6_10
import report_chapters_11_15
import report_chapters_16_20

out_dir = r"C:\Users\Admin\.gemini\antigravity\scratch\career-guidance-platform\PROJECT_COMPLETE_DOCUMENTATION"
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "Complete_Project_Report.md")

parts = [
    gen_full_report.get_frontmatter(),
    report_chapters_1_5.get_chapters_1_to_5(),
    report_chapters_6_10.get_chapters_6_to_10(),
    report_chapters_11_15.get_chapters_11_to_15(),
    report_chapters_16_20.get_chapters_16_to_20()
]

full_report = "\n".join(parts)

with open(out_file, "w", encoding="utf-8") as f:
    f.write(full_report)

print(f"Successfully assembled {out_file}!")
print(f"Total report size: {len(full_report)} characters, {len(full_report.splitlines())} lines.")
