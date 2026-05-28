import json
import re

problems = [
    "1 Rotate Array in Java",
    "2 Evaluate Reverse Polish Notation",
    "3 Solution of Longest Palindromic Substring in Java",
    "4 Solution Word Break",
    "5 Word Break II",
    "6 Word Ladder",
    "7 Median of Two Sorted Arrays Java",
    "8 Regular Expression Matching in Java",
    "9 Merge Intervals",
    "10 Insert Interval",
    "11 Two Sum",
    "12 Two Sum II Input array is sorted",
    "13 Two Sum III Data structure design",
    "14 3Sum",
    "15 4Sum",
    "16 3Sum Closest",
    "17 String to Integer (atoi)",
    "18 Merge Sorted Array",
    "19 Valid Parentheses",
    "20 Implement strStr()",
    "21 Set Matrix Zeroes",
    "22 Search Insert Position",
    "23 Longest Consecutive Sequence Java",
    "24 Valid Palindrome",
    "25 Spiral Matrix",
    "26 Search a 2D Matrix",
    "27 Rotate Image",
    "28 Triangle",
    "29 Distinct Subsequences Total",
    "30 Maximum Subarray",
    "31 Maximum Product Subarray",
    "32 Remove Duplicates from Sorted Array",
    "33 Remove Duplicates from Sorted Array II",
    "34 Longest Substring Without Repeating Characters",
    "35 Longest Substring Which Contains 2 Unique Characters",
    "36 Palindrome Partitioning",
    "37 Reverse Words in a String",
    "38 Find Minimum in Rotated Sorted Array",
    "39 Find Minimum in Rotated Sorted Array II",
    "40 Find Peak Element",
    "41 Min Stack",
    "42 Majority Element",
    "43 Combination Sum",
    "44 Best Time to Buy and Sell Stock",
    "45 Best Time to Buy and Sell Stock II",
    "46 Best Time to Buy and Sell Stock III",
    "47 Best Time to Buy and Sell Stock IV",
    "48 Longest Common Prefix",
    "49 Largest Number",
    "50 Combinations",
    "51 Compare Version Numbers",
    "52 Gas Station",
    "53 Candy",
    "54 Jump Game",
    "55 Pascal’s Triangle",
    "56 Container With Most Water",
    "57 Count and Say",
    "58 Repeated DNA Sequences",
    "59 Add Two Numbers",
    "60 Reorder List",
    "61 Linked List Cycle",
    "62 Copy List with Random Pointer",
    "63 Merge Two Sorted Lists",
    "64 Merge k Sorted Lists",
    "65 Remove Duplicates from Sorted List",
    "66 Partition List",
    "67 LRU Cache",
    "68 Intersection of Two Linked Lists",
    "69 Java PriorityQueue Class Example",
    "70 Solution for Binary Tree Preorder Traversal in Java",
    "71 Solution of Binary Tree Inorder Traversal in Java",
    "72 Solution of Iterative Binary Tree Postorder Traversal in Java",
    "73 Validate Binary Search Tree",
    "74 Flatten Binary Tree to Linked List",
    "75 Path Sum",
    "76 Construct Binary Tree from Inorder and Postorder Traversal",
    "77 Convert Sorted Array to Binary Search Tree",
    "78 Convert Sorted List to Binary Search Tree",
    "79 Minimum Depth of Binary Tree",
    "80 Binary Tree Maximum Path Sum",
    "81 Balanced Binary Tree",
    "82 Symmetric Tree",
    "83 Clone Graph Java",
    "84 How Developers Sort in Java?",
    "85 Solution Merge Sort LinkedList in Java",
    "86 Quicksort Array in Java",
    "87 Solution Sort a linked list using insertion sort in Java",
    "88 Maximum Gap",
    "89 Iteration vs. Recursion in Java",
    "90 Edit Distance in Java",
    "91 Single Number",
    "92 Single Number II",
    "93 Twitter Codility Problem Max Binary Gap",
    "94 Number of 1 Bits",
    "95 Reverse Bits",
    "96 Permutations",
    "97 Permutations II",
    "98 Permutation Sequence",
    "99 Generate Parentheses",
    "100 Reverse Integer",
    "101 Palindrome Number",
    "102 Pow(x, n)"
]

topic_map = {
    "Array": ["Array", "Sum", "Interval", "Matrix", "Container", "Candy", "Jump", "Gas", "Sequence", "Permutation", "Sort", "Gap"],
    "String": ["String", "Word", "Substring", "Palindrome", "Parentheses", "Prefix", "DNA", "Distance"],
    "Linked List": ["Linked List", "Lists", "LRU", "Copy List"],
    "Tree": ["Tree", "Traversal", "BST", "Path Sum"],
    "Stack": ["Polish Notation", "Stack", "Parentheses", "Rectangle"],
    "Graph": ["Graph", "Ladder"],
    "DP": ["Dynamic Programming", "Subsequences", "Stock", "Triangle"],
    "Math": ["Integer", "Number", "Pow", "Multiply", "Factorial", "Codility", "Bit"],
    "Binary Search": ["Median", "Search", "Rotated", "Peak"]
}

def infer_topic(title):
    t_lower = title.lower()
    for topic, keywords in topic_map.items():
        for kw in keywords:
            if kw.lower() in t_lower:
                return topic
    if "sum" in t_lower:
        return "Array"
    return "Miscellaneous"

def clean_title(title):
    # Remove leading number
    title = re.sub(r'^\d+\s+', '', title)
    title = re.sub(r'in Java\??$', '', title, flags=re.IGNORECASE)
    title = re.sub(r'^Solution of\s+', '', title, flags=re.IGNORECASE)
    title = re.sub(r'^Solution\s+', '', title, flags=re.IGNORECASE)
    title = title.replace('()', '')
    title = title.strip()
    return title

def infer_difficulty(title):
    t = title.lower()
    if any(w in t for w in ["two sum", "reverse", "palindrome number", "maximum depth", "same tree", "valid parentheses", "merge two sorted", "strstr", "search insert", "remove duplicates", "maximum subarray", "length of last word", "plus one", "climbing stairs", "merge sorted array", "symmetric tree", "path sum", "single number"]):
        return "Easy"
    if any(w in t for w in ["median of two", "regular expression", "word ladder", "merge k sorted", "largest rectangle", "lru cache", "edit distance", "word break ii", "best time to buy and sell stock iii", "best time to buy and sell stock iv", "maximum gap", "distinct subsequences"]):
        return "Hard"
    return "Medium"

def create_slug(title):
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

json_arr = []
for p in problems:
    match = re.match(r'^(\d+)\s+(.*)', p)
    if not match:
        continue
    p_id = int(match.group(1))
    raw_title = match.group(2)
    cleaned = clean_title(raw_title)
    
    entry = {
        "id": p_id,
        "title": cleaned,
        "slug": create_slug(cleaned),
        "topic": infer_topic(cleaned),
        "difficulty": infer_difficulty(cleaned),
        "status": "not_started",
        "favorite": False,
        "notes": "",
        "solution": "",
        "leetcodeUrl": f"https://leetcode.com/problems/{create_slug(cleaned)}/"
    }
    json_arr.append(entry)

with open('leetcode_problems.json', 'w') as f:
    json.dump(json_arr, f, indent=2)

print(json.dumps(json_arr[:20], indent=2))
