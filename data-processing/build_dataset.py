import json
import os
import re

PROBLEMS_RAW = [
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

TOPIC_KEYWORDS = {
    "Array": ["Array", "Sum", "Interval", "Matrix", "Container", "Candy", "Jump", "Gas", "Sequence", "Permutation", "Sort", "Gap", "Subarray", "Stock", "Merge", "Insert"],
    "String": ["String", "Word", "Substring", "Palindrome", "Parentheses", "Prefix", "DNA", "Distance", "strStr", "Count and Say", "Regex"],
    "Linked List": ["Linked List", "Lists", "LRU", "Copy List", "Reorder List", "Cycle", "Partition List"],
    "Tree": ["Tree", "Traversal", "BST", "Path Sum", "Validate Binary Search", "Flatten", "Symmetric"],
    "Stack": ["Polish Notation", "Stack", "Parentheses", "Rectangle"],
    "Graph": ["Graph", "Ladder", "Clone Graph"],
    "Dynamic Programming": ["Dynamic Programming", "Subsequences", "Stock", "Triangle", "Word Break", "Edit Distance", "Maximum Subarray"],
    "Math": ["Integer", "Number", "Pow", "Multiply", "Factorial", "Codility", "Bit", "Bits", "Reverse Integer", "Reverse Bits"],
    "Binary Search": ["Median", "Search", "Rotated", "Peak", "Search a 2D", "Find Minimum"]
}

MANUAL_OVERRIDES = {
    3: {
        "questionSummary": "Given a string s, find the longest palindromic substring in s. A palindrome reads the same backward as forward.",
        "solutionSummary": "Approach 1 (Dynamic Programming): Store palindrome status of substrings in a 2D table, taking O(N^2) time and space. Approach 2 (Optimal): Expand around each character/gap as centers, taking O(N^2) time and O(1) space."
    },
    12: {
        "questionSummary": "Given a 1-indexed sorted array of integers, find two numbers such that they add up to a specific target number. Return their indices.",
        "solutionSummary": "Use a two-pointer approach. Initialize one pointer at the start and one at the end of the array. If the sum is smaller than target, move the left pointer right; if larger, move the right pointer left; otherwise, return the pointers. O(N) time, O(1) space."
    },
    36: {
        "questionSummary": "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning configurations.",
        "solutionSummary": "Use backtracking (depth-first search) to generate all partitions. At each step, if the prefix is a palindrome, recursively partition the remaining substring. Backtrack and try other split points."
    },
    39: {
        "questionSummary": "Given a sorted array rotated at some pivot, find the minimum element. The array may contain duplicates, which makes finding the pivot more complex.",
        "solutionSummary": "Use a modified Binary Search. If mid-value equals high-value, we cannot decide which half is sorted; decrement the high pointer by one. Otherwise, follow standard rotated binary search. Worst case time is O(N) due to duplicates."
    },
    47: {
        "questionSummary": "Given stock prices, find the maximum profit you can achieve by completing at most k transactions.",
        "solutionSummary": "Use Dynamic Programming. If k is large (>= N/2), solve as unlimited transactions. Otherwise, maintain a 2D table dp[i][j] representing the max profit at day j with at most i transactions. Time complexity is O(k * N)."
    },
    48: {
        "questionSummary": "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
        "solutionSummary": "Sort the array of strings and compare the first and last strings character by character, or sequentially match the prefix against all strings, updating the common prefix length."
    },
    49: {
        "questionSummary": "Given a list of non-negative integers, arrange them such that they form the largest number. Since the result can be very large, return it as a string.",
        "solutionSummary": "Sort the integers using a custom comparator that compares two numbers concatenated in different orders: if ab > ba, then a comes before b. Concatenate the sorted numbers to form the final result."
    },
    50: {
        "questionSummary": "Given two integers n and k, return all possible combinations of k numbers chosen from the range 1 to n.",
        "solutionSummary": "Use backtracking (DFS) to explore combinations. Maintain a path of current numbers, recursively add the next larger number, and backtrack when the path length reaches k."
    },
    51: {
        "questionSummary": "Compare two version numbers version1 and version2. Return -1, 0, or 1 based on which version is greater.",
        "solutionSummary": "Split both version strings by the dot character. Iterate through the segments, convert each to an integer, and compare them. Pad shorter versions with 0s if necessary. Time complexity is O(N + M)."
    },
    52: {
        "questionSummary": "Given gas and cost arrays representing gas stations along a circular route, find the starting station's index if you can travel around the circuit once in the clockwise direction.",
        "solutionSummary": "Maintain total_gas and current_gas. If current_gas falls below zero at station i, reset the starting station to i + 1 and reset current_gas to 0. If total_gas >= 0 at the end, return the start index."
    },
    53: {
        "questionSummary": "Given children ratings, distribute candies such that each child has at least one candy and children with higher ratings than neighbors get more candies. Find the minimum candies required.",
        "solutionSummary": "Use a two-pass greedy approach. Iterate left-to-right, ensuring rating increases get more candies than the left neighbor. Then iterate right-to-left, ensuring right neighbor conditions are met. Sum the maximum candies allocated."
    },
    54: {
        "questionSummary": "Given an array of non-negative integers representing max jump lengths, determine if you are able to reach the last index starting from index 0.",
        "solutionSummary": "Maintain a max_reach variable representing the furthest index reachable. Iterate through the array; if the current index is reachable, update max_reach = max(max_reach, i + nums[i]). Return true if max_reach reaches the last index."
    },
    55: {
        "questionSummary": "Given a non-negative integer numRows, generate the first numRows of Pascal's triangle, where each number is the sum of the two numbers directly above it.",
        "solutionSummary": "Iterate row by row. For each row, set the first and last elements to 1, and compute the middle elements as the sum of elements at indices j-1 and j in the previous row. Time complexity is O(N^2)."
    },
    56: {
        "questionSummary": "Given n non-negative integers representing vertical lines, find two lines that together with the x-axis form a container containing the most water.",
        "solutionSummary": "Use the two-pointer approach. Place pointers at the beginning and end of the array. Compute the area, update the max area, and move the pointer pointing to the shorter line inward. Time complexity is O(N)."
    },
    57: {
        "questionSummary": "Generate the n-th term of the count-and-say sequence. The sequence is defined recursively, starting with '1' and describing the count of consecutive digits of the previous term.",
        "solutionSummary": "Iterate from 1 to n. For each term, scan the previous string, count consecutive identical characters, append the count and character to a StringBuilder, and update the term. Time complexity is O(length of terms)."
    },
    58: {
        "questionSummary": "Given a DNA sequence string, find all the 10-letter-long sequences (substrings) that occur more than once in the DNA molecule.",
        "solutionSummary": "Use a HashSet to record all 10-character substrings encountered during a single iteration. If a substring is already in the set, add it to a second result set. Time complexity is O(N) using substring hashing."
    },
    67: {
        "questionSummary": "Design and implement a Least Recently Used (LRU) Cache that supports get and put operations in O(1) time complexity.",
        "solutionSummary": "Use a HashMap combined with a Double Linked List. The HashMap provides O(1) node lookup. The Double Linked List tracks usage order: move accessed elements to the head, and evict from the tail on capacity overflow."
    },
    68: {
        "questionSummary": "Given the heads of two singly linked lists, return the node at which the two lists intersect. If they do not intersect, return null.",
        "solutionSummary": "Calculate the lengths of both lists. Move the pointer of the longer list forward by the difference in length. Then traverse both lists in lockstep until the pointers meet, which is the intersection node."
    },
    69: {
        "questionSummary": "Demonstrates the usage of Java's PriorityQueue class, illustrating how elements are ordered according to their natural ordering or by a custom Comparator.",
        "solutionSummary": "Provides an implementation example showcasing standard queue operations (offer, poll, peek) and custom sorting behavior for elements."
    },
    70: {
        "questionSummary": "Given a binary tree, return the preorder traversal of its nodes' values (root, left, right).",
        "solutionSummary": "Iterative Approach: Use a Stack. Push the root. In a loop, pop the node, record its value, and push its right child followed by its left child (so left is processed first). Time complexity is O(N)."
    },
    71: {
        "questionSummary": "Given a binary tree, return the inorder traversal of its nodes' values (left, root, right).",
        "solutionSummary": "Iterative Approach: Use a Stack. Initialize current pointer to root. Push current node and move left until null. Then pop, record value, set current pointer to right child, and repeat. Time complexity is O(N)."
    },
    72: {
        "questionSummary": "Given a binary tree, return the postorder traversal of its nodes' values (left, right, root).",
        "solutionSummary": "Iterative Approach: Use two Stacks, or a single stack with a 'last visited' pointer. For the two-stack method, push root to first stack, then pop and push to second stack, pushing its left and right children to the first stack. Pop all from second stack."
    },
    82: {
        "questionSummary": "Given a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
        "solutionSummary": "Use recursion. A tree is symmetric if the left subtree is a mirror of the right subtree. Compare left-child's left with right-child's right, and left-child's right with right-child's left."
    },
    83: {
        "questionSummary": "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
        "solutionSummary": "Use a depth-first search (DFS) or breadth-first search (BFS) traversal. Use a HashMap to map original nodes to their cloned counterparts, ensuring each node is cloned exactly once and neighbor connections are correctly copied. O(N) time and space."
    },
    84: {
        "questionSummary": "Analyzes sorting paradigms in Java, explaining when and why the JDK uses different sorting algorithms (such as Dual-Pivot Quicksort and Timsort) for primitives and objects.",
        "solutionSummary": "Details the performance characteristics and design tradeoffs of Java's Arrays.sort() and Collections.sort(), highlighting stability requirements."
    },
    88: {
        "questionSummary": "Given an unsorted array, find the maximum difference between successive elements in its sorted form. The algorithm should run in linear time and space.",
        "solutionSummary": "Use Bucket Sort (pigeonhole principle). Divide elements into buckets based on min/max values. The maximum gap must occur between the maximum of one bucket and the minimum of the next non-empty bucket. Time complexity is O(N)."
    },
    89: {
        "questionSummary": "Explores the fundamental differences between recursion and iteration using the factorial function (N!). Discusses how recursion builds a chain of operations (linear recursion), while iteration maintains state in a fixed number of variables.",
        "solutionSummary": "Recursion uses call stack frames to keep track of deferred operations, leading to O(N) memory complexity for linear recursion. In contrast, iteration executes with a constant number of variables, using O(1) auxiliary space."
    },
    92: {
        "questionSummary": "Given a non-empty array of integers, every element appears three times except for one, which appears exactly once. Find that single one.",
        "solutionSummary": "Optimal Approach (Bit Manipulation): Maintain two variables ones and twos. For each number, update twos with bits appearing twice, and ones with bits appearing once. Filter out bits that appear three times."
    },
    94: {
        "questionSummary": "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
        "solutionSummary": "Iterate 32 times, shifting the number and checking the last bit. Alternatively, use Brian Kernighan's algorithm: repeatedly clear the lowest set bit using n &= (n - 1) until n becomes 0, counting the steps."
    },
    95: {
        "questionSummary": "Reverse bits of a given 32-bit unsigned integer in Java.",
        "solutionSummary": "Iterate 32 times. Shift the result to the left, bitwise OR it with the last bit of the input number, and shift the input number to the right. Return the resulting integer."
    }
}

def clean_title(title):
    # Remove leading number
    title = re.sub(r'^\d+\s+', '', title)
    title = re.sub(r'\s+in Java\??$', '', title, flags=re.IGNORECASE)
    title = re.sub(r'^Solution of\s+', '', title, flags=re.IGNORECASE)
    title = re.sub(r'^Solution for\s+', '', title, flags=re.IGNORECASE)
    title = re.sub(r'^Solution\s+', '', title, flags=re.IGNORECASE)
    title = title.replace('()', '')
    title = title.replace('’', "'")
    title = title.strip()
    return title

def infer_topic(title):
    t_lower = title.lower()
    for topic, keywords in TOPIC_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in t_lower:
                return topic
    return "Miscellaneous"

def infer_difficulty(title):
    t = title.lower()
    easy_keywords = ["two sum", "reverse", "palindrome number", "maximum depth", "same tree", "valid parentheses", "merge two sorted", "strstr", "search insert", "remove duplicates", "maximum subarray", "length of last word", "plus one", "climbing stairs", "merge sorted array", "symmetric tree", "path sum", "single number", "reverse bits", "number of 1 bits"]
    hard_keywords = ["median of two", "regular expression", "word ladder", "merge k sorted", "largest rectangle", "lru cache", "edit distance", "word break ii", "best time to buy and sell stock iii", "best time to buy and sell stock iv", "maximum gap", "distinct subsequences"]
    
    if any(w in t for w in easy_keywords):
        return "Easy"
    if any(w in t for w in hard_keywords):
        return "Hard"
    return "Medium"

def is_code_line(line):
    line = line.strip()
    if not line:
        return False
    if line.endswith(";"):
        return True
    if "{" in line or "}" in line:
        return True
    if any(line.startswith(x) for x in ["public", "private", "protected", "class", "interface", "import", "package"]):
        return True
    if " = " in line:
        return True
    
    java_keywords = [
        "void ", "return ", "int ", "double ", "float ", "boolean ", "char ", "new ", 
        "ArrayList", "HashMap", "HashSet", "Stack", "Queue", "TreeNode", "ListNode", "DoubleLinkedListNode",
        "for(", "while(", "if(", "switch(", "catch(", "System.out"
    ]
    if any(kw in line for kw in java_keywords):
        return True
    return False

def clean_paragraph_text(text_lines):
    cleaned_lines = []
    
    for line in text_lines:
        line_strip = line.strip()
        if not line_strip:
            continue
            
        # Filter page number and headers
        if re.match(r'^\d+\s+\d+$', line_strip) or re.match(r'^\d+\s+181$', line_strip):
            continue
        if "ProgramCreek" in line_strip or "Program Creek" in line_strip or "Contents" in line_strip:
            continue
        if is_code_line(line_strip):
            continue
            
        # Is it a table row?
        if line_strip.startswith("|"):
            cells = [c.strip() for c in line_strip.split("|") if c.strip()]
            if all(all(char in '-: ' for char in cell) for cell in cells):
                continue
            if any(is_code_line(cell) for cell in cells):
                continue
            line_content = " ".join(cells)
        else:
            line_content = line_strip
            
        # Strip weird character occurrences
        line_content = line_content.replace("2ˆ", "^2").replace("nˆ", "^n").replace("’", "'").replace("ˆ", "^")
        cleaned_lines.append(line_content)
        
    text = " ".join(cleaned_lines)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_pdf_markdown(md_path):
    print(f"Loading {md_path}...")
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    toc_end_index = content.find("1 Rotate Array in Java", 100)
    if toc_end_index == -1:
        toc_end_index = 0
    else:
        print(f"Skipping TOC (first {toc_end_index} chars)")
        
    main_text = content[toc_end_index:]
    lines = main_text.split("\n")
    
    problem_positions = []
    
    for i, prob in enumerate(PROBLEMS_RAW):
        p_id = i + 1
        clean_p_title = clean_title(prob)
        
        found_line_idx = -1
        search_start = problem_positions[-1][1] if problem_positions else 0
        words = clean_p_title.split()[:3]
        
        for idx in range(search_start, len(lines)):
            line = lines[idx].strip()
            if re.search(rf'\b{p_id}\b', line) and any(w.lower() in line.lower() for w in words):
                found_line_idx = idx
                break
                
        if found_line_idx != -1:
            problem_positions.append((p_id, found_line_idx, clean_p_title))
        else:
            for idx in range(len(lines)):
                line = lines[idx].strip()
                if re.search(rf'\b{p_id}\b', line) and any(w.lower() in line.lower() for w in words):
                    found_line_idx = idx
                    break
            problem_positions.append((p_id, found_line_idx, clean_p_title))
            
    problems_data = []
    for index, (p_id, line_idx, title) in enumerate(problem_positions):
        next_line_idx = len(lines)
        if index + 1 < len(problem_positions):
            next_line_idx = problem_positions[index + 1][1]
            
        prob_lines = lines[line_idx:next_line_idx]
        
        solution_start_idx = -1
        # First pass: check for precise decimal numbering like "96.1" or "96.2"
        for s_idx, s_line in enumerate(prob_lines[1:], start=1):
            s_line_lower = s_line.lower()
            match_dec = re.search(rf'^\s*\|?\s*\b{p_id}\b\.(\d+)', s_line)
            if not match_dec:
                match_dec = re.search(rf'\|\s*\b{p_id}\b\.(\d+)\s*\|', s_line)
                
            if match_dec:
                dec_num = int(match_dec.group(1))
                if dec_num == 1 and any(x in s_line_lower for x in ["problem", "question", "description"]):
                    continue
                solution_start_idx = s_idx
                break
                
        # Second pass: check for explicit section terms like "Java Solution" or "Naive Approach"
        if solution_start_idx == -1:
            for s_idx, s_line in enumerate(prob_lines[1:], start=1):
                s_line_lower = s_line.lower()
                if "programcreek" in s_line_lower or "contents" in s_line_lower:
                    continue
                if any(x in s_line_lower for x in ["naive approach", "java solution", "accepted solution", "optimal approach", "naive method", "succinct solution", "thoughts"]):
                    solution_start_idx = s_idx
                    break
                    
        if solution_start_idx == -1:
            solution_start_idx = len(prob_lines) // 3
            
        question_lines = prob_lines[:solution_start_idx]
        solution_lines = prob_lines[solution_start_idx:]
        
        question_text = clean_paragraph_text(question_lines)
        solution_text = clean_paragraph_text(solution_lines)
        
        question_text = re.sub(rf'^\s*\|?\s*{p_id}\s+{re.escape(title)}[^\s]*', '', question_text, flags=re.IGNORECASE).strip()
        question_text = re.sub(r'^(Problem:|The problem:|Problem description:)\s*', '', question_text, flags=re.IGNORECASE).strip()
        
        source_page = 1
        for l in prob_lines:
            page_match = re.search(r'^\s*(\d+)\s+181\b', l.strip())
            if page_match:
                source_page = int(page_match.group(1))
                break
                
        # Apply custom manual overrides if they exist
        if p_id in MANUAL_OVERRIDES:
            question_text = MANUAL_OVERRIDES[p_id].get("questionSummary", question_text)
            solution_text = MANUAL_OVERRIDES[p_id].get("solutionSummary", solution_text)
        else:
            # Fallbacks for any other low-quality match
            if not question_text or len(question_text) < 15:
                question_text = f"Given the problem '{title}', implement a program to solve it efficiently. Refer to standard LeetCode problems for exact constraints."
            if not solution_text or len(solution_text) < 15:
                solution_text = f"To solve '{title}', the optimal approach uses suitable data structures (e.g. Hash Table or Two Pointers) to achieve O(N) time complexity and O(1) or O(N) space complexity."
            
            question_text = truncate_sentences(question_text, max_sentences=2)
            solution_text = truncate_sentences(solution_text, max_sentences=3)
            
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        
        problems_data.append({
            "id": p_id,
            "title": title,
            "slug": slug,
            "topic": infer_topic(title),
            "difficulty": infer_difficulty(title),
            "questionSummary": question_text,
            "solutionSummary": solution_text,
            "sourcePage": source_page,
            "favorite": False,
            "status": "not_started",
            "notes": ""
        })
        
    return problems_data

def truncate_sentences(text, max_sentences=2):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    if len(sentences) <= max_sentences:
        return text
    return " ".join(sentences[:max_sentences])

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    md_file = os.path.join(current_dir, "leetcode_problems.md")
    output_json = os.path.join(project_root, "dataset.json")
    
    dataset = parse_pdf_markdown(md_file)
    
    print(f"Writing dataset to {output_json}...")
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
        
    print(f"Generated {len(dataset)} entries successfully!")
