import json
import os
import re

KNOWN_TOPICS = {
    "Array", "String", "Linked List", "Tree", "Stack", "Graph", 
    "Dynamic Programming", "Math", "Binary Search", "Two Pointers", 
    "Matrix", "Hash Table", "Miscellaneous"
}

def validate_and_report(json_path):
    print(f"Loading dataset for validation: {json_path}")
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"ERROR: Malformed JSON file! {e}")
        return
        
    total_entries = len(data)
    print(f"Total entries loaded: {total_entries}")
    
    issues = []
    low_confidence_reviews = []
    
    seen_ids = set()
    repeated_ids = set()
    
    seen_titles = set()
    duplicate_titles = set()
    
    topic_counts = {}
    difficulty_counts = {}
    
    # Analyze entries
    for idx, entry in enumerate(data):
        p_id = entry.get("id")
        title = entry.get("title")
        slug = entry.get("slug")
        topic = entry.get("topic")
        difficulty = entry.get("difficulty")
        q_sum = entry.get("questionSummary", "")
        s_sum = entry.get("solutionSummary", "")
        
        # 1. ID checks
        if p_id is None:
            issues.append(f"Problem at index {idx} is missing an 'id'.")
        else:
            if p_id in seen_ids:
                repeated_ids.add(p_id)
            seen_ids.add(p_id)
            
        # 2. Title checks
        if not title:
            issues.append(f"Problem at index {idx} has an empty title.")
        else:
            # Check for suspicious OCR artifacts in title
            if any(char in title for char in ["^", "ˆ", "|", "’", "[", "]"]):
                issues.append(f"Title '{title}' (ID {p_id}) has suspicious OCR characters.")
                low_confidence_reviews.append((p_id, title, "OCR character in title"))
            if title in seen_titles:
                duplicate_titles.add(title)
            seen_titles.add(title)
            
        # 3. Slug checks
        if not slug:
            issues.append(f"Problem (ID {p_id}) is missing a 'slug'.")
            
        # 4. Summary checks
        if not q_sum:
            issues.append(f"Problem '{title}' (ID {p_id}) has an empty questionSummary.")
            low_confidence_reviews.append((p_id, title, "Empty question summary"))
        elif "fallback templates" in q_sum or "implement a program" in q_sum or len(q_sum) < 25:
            low_confidence_reviews.append((p_id, title, "Low quality/fallback question summary"))
            
        if not s_sum:
            issues.append(f"Problem '{title}' (ID {p_id}) has an empty solutionSummary.")
            low_confidence_reviews.append((p_id, title, "Empty solution summary"))
        elif "optimal approach uses" in s_sum or len(s_sum) < 25:
            low_confidence_reviews.append((p_id, title, "Low quality/fallback solution summary"))
            
        # 5. Topic checks
        if not topic:
            issues.append(f"Problem '{title}' (ID {p_id}) is missing a topic.")
        elif topic not in KNOWN_TOPICS:
            issues.append(f"Problem '{title}' (ID {p_id}) has inconsistent topic: '{topic}'")
            
        # Accumulate counts
        if topic:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
        if difficulty:
            difficulty_counts[difficulty] = difficulty_counts.get(difficulty, 0) + 1
            
    # Compile Validation Summary Report
    report_lines = []
    report_lines.append("# Dataset Validation Summary Report\n")
    report_lines.append(f"**Total Problems Evaluated:** {total_entries}\n")
    
    report_lines.append("## Topic Distribution")
    for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True):
        report_lines.append(f"- **{topic}**: {count}")
    report_lines.append("")
    
    report_lines.append("## Difficulty Distribution")
    for diff, count in sorted(difficulty_counts.items(), key=lambda x: x[1], reverse=True):
        report_lines.append(f"- **{diff}**: {count}")
    report_lines.append("")
    
    # Report checks
    report_lines.append("## Validation Checks Results")
    if repeated_ids:
        report_lines.append(f"- ⚠️ **Repeated IDs found:** {list(repeated_ids)}")
    else:
        report_lines.append("- ✅ **Repeated IDs:** None")
        
    if duplicate_titles:
        report_lines.append(f"- ⚠️ **Duplicate Titles found:** {list(duplicate_titles)}")
    else:
        report_lines.append("- ✅ **Duplicate Titles:** None")
        
    ocr_issues = [i for i in issues if "OCR characters" in i]
    if ocr_issues:
        report_lines.append(f"- ⚠️ **Title OCR Issues:** {len(ocr_issues)} titles contain OCR noise.")
    else:
        report_lines.append("- ✅ **Title OCR Issues:** None")
        
    inconsistent_topics = [i for i in issues if "inconsistent topic" in i]
    if inconsistent_topics:
        report_lines.append(f"- ⚠️ **Inconsistent Topics:** {len(inconsistent_topics)} issues detected.")
    else:
        report_lines.append("- ✅ **Inconsistent Topics:** All topics match known set.")
        
    report_lines.append("")
    
    # Report Review-Needed List
    report_lines.append("## Manual Review Needed List")
    if low_confidence_reviews:
        # Deduplicate list by ID
        unique_reviews = {}
        for item in low_confidence_reviews:
            unique_reviews[item[0]] = item
        for p_id, title, reason in sorted(unique_reviews.values(), key=lambda x: x[0]):
            report_lines.append(f"- [ ] **ID {p_id}** - *{title}* (Reason: {reason})")
    else:
        report_lines.append("- All entries are high confidence!")
    report_lines.append("")
    
    # Validation report file path
    report_text = "\n".join(report_lines)
    report_path = os.path.join(os.path.dirname(json_path), "data-processing", "validation_report.md")
    
    # Ensure folder exists
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_text)
        
    # Also print console summary
    print("\n" + "="*40)
    print("VALIDATION SUMMARY")
    print("="*40)
    print(f"Total problems: {total_entries}")
    print(f"Topics: {topic_counts}")
    print(f"Difficulties: {difficulty_counts}")
    print(f"Duplicate titles: {len(duplicate_titles)}")
    print(f"Repeated IDs: {len(repeated_ids)}")
    print(f"OCR issues: {len(ocr_issues)}")
    print(f"Total issues flagged: {len(issues)}")
    print(f"Manual reviews suggested: {len(low_confidence_reviews)}")
    print(f"Report saved to: {report_path}")
    print("="*40 + "\n")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    json_path = os.path.join(project_root, "dataset.json")
    validate_and_report(json_path)
