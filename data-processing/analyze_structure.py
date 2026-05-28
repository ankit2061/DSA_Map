import os
import re

def analyze_markdown(file_path):
    print(f"Reading markdown file: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.split("\n")
    print(f"Total lines: {len(lines)}")
    
    # 1. Count potential problem header patterns
    # A problem header is typically a line containing:
    # - A number followed by space and title (e.g., "1 Rotate Array in Java")
    # - Or inside a table row cell (e.g., "| 2 Evaluate |     | Reverse | Polish | Notation |")
    # - Or a standalone line "96 Permutations"
    
    # Let's count potential headers using regex
    # Matches "1 Rotate Array", "96 Permutations", "102 Pow(x,n)"
    header_regex = re.compile(r'^\s*(\d+)\s+([A-Za-z0-9_().`\’\'\-\s\[\]+,]+)$')
    # Table pattern cell starts with digit
    table_header_regex = re.compile(r'^\|\s*(\d+)\s+([^\|]+)\|')
    
    potential_headers = []
    
    for idx, line in enumerate(lines):
        line_num = idx + 1
        
        # Check standard line header
        match = header_regex.match(line)
        if match:
            num = int(match.group(1))
            title = match.group(2).strip()
            # Filter out page number footers like "170 181" or "3 181" or simple page numbers
            if "181" in line or (len(title) < 3 and title.isdigit()):
                continue
            potential_headers.append((line_num, num, title, "Standard Line"))
            continue
            
        # Check table cell header
        match = table_header_regex.match(line)
        if match:
            num = int(match.group(1))
            title = match.group(2).strip()
            if "181" in line or (len(title) < 3 and title.isdigit()):
                continue
            potential_headers.append((line_num, num, title, "Table Row"))
            
    # Sort detected headers by line number
    potential_headers.sort(key=lambda x: x[0])
    
    print("\n--- Detected Problem Headers (Sample of First 15) ---")
    for item in potential_headers[:15]:
        print(f"Line {item[0]}: [{item[3]}] #{item[1]} - {item[2]}")
        
    print("\n--- Detected Problem Headers (Sample of Last 10) ---")
    for item in potential_headers[-10:]:
        print(f"Line {item[0]}: [{item[3]}] #{item[1]} - {item[2]}")
        
    print(f"\nTotal potential headers matched: {len(potential_headers)}")
    
    # Let's group by problem ID to see if we have 1 to 102
    by_id = {}
    for item in potential_headers:
        p_id = item[1]
        if p_id not in by_id:
            by_id[p_id] = []
        by_id[p_id].append(item)
        
    missing_ids = [i for i in range(1, 103) if i not in by_id]
    print(f"Total unique problem IDs detected: {len(by_id)} / 102")
    print(f"Missing IDs in naive detection: {missing_ids}")
    
    # 2. Segment Check: Let's inspect the text around a specific problem (e.g., Problem 96 - Permutations)
    print("\n--- Section Analysis: Permutations (Problem 96) ---")
    perm_lines = []
    found_perm = False
    for line in lines:
        if "96 Permutations" in line:
            found_perm = True
        if found_perm:
            perm_lines.append(line)
            if len(perm_lines) > 50:
                break
    print("\n".join(perm_lines[:25]))
    
    # 3. Analyze general cleanup issues
    print("\n--- Cleanup / Extraction Challenges Check ---")
    table_lines = sum(1 for l in lines if l.startswith("|"))
    page_footers = sum(1 for l in lines if "181" in l)
    print(f"Table formatting lines (start with '|'): {table_lines}")
    print(f"Potential page footers (contain '181'): {page_footers}")
    
if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    md_file = os.path.join(current_dir, "leetcode_problems.md")
    analyze_markdown(md_file)
