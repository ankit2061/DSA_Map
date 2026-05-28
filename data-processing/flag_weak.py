import json
import re

def is_weak(text):
    text = text.lower()
    if len(text) < 30:
        return True
    if "//" in text or "^" in text or "cid:" in text or "naive approach" in text or "java solution" in text or "thoughts" in text or "solution" in text or "analysis" in text:
        return True
    if re.search(r'^\d+\.\d+\s', text):
        return True
    words = text.split()
    if any(len(w) > 25 for w in words):
        return True
    return False

with open("dataset.json", "r") as f:
    data = json.load(f)

flagged = []
for p in data:
    if p["id"] in [3, 12, 36, 39, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 82, 83, 84, 88, 89, 92, 94, 95]:
        continue # Already manually overridden

    q_weak = is_weak(p["questionSummary"])
    s_weak = is_weak(p["solutionSummary"])
    
    if re.search(r'^\d+\.\d+\s', p["solutionSummary"]):
        s_weak = True
    if re.search(r'^\d+\s', p["questionSummary"]) or "Problem:" in p["questionSummary"] or "LeetCode" in p["questionSummary"]:
        q_weak = True
        
    if q_weak or s_weak:
        flagged.append({"id": p["id"], "title": p["title"]})

with open("flagged_ids.json", "w") as f:
    json.dump(flagged, f, indent=2)

print(f"Dumped {len(flagged)} ids.")
