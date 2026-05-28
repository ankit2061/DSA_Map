import json

FIXES = {
  1: {"q": "Given an array, rotate the array to the right by k steps, where k is non-negative.", "s": "Use a temporary array to store the rotated elements, or reverse the array three times to achieve O(1) space complexity."},
  2: {"q": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, /.", "s": "Use a Stack. Iterate through each element: if it's a number, push to stack; if an operator, pop two numbers, apply the operation, and push the result back."},
  4: {"q": "Given a string s and a dictionary of words, determine if s can be segmented into a space-separated sequence of one or more dictionary words.", "s": "Use Dynamic Programming. Maintain a boolean array dp where dp[i] is true if the prefix of length i can be segmented."},
  5: {"q": "Given a string s and a dictionary of words, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences.", "s": "Use DFS with memoization to find all possible paths."},
  6: {"q": "Given two words (start and end), and a dictionary, find the length of shortest transformation sequence from start to end.", "s": "Use Breadth-First Search (BFS). Push the start word to a queue and transform characters one by one, checking if the new word is in the dictionary."},
  7: {"q": "There are two sorted arrays A and B of size m and n respectively. Find the median of the two sorted arrays.", "s": "Use Binary Search to partition both arrays such that the left half has the same number of elements as the right half."},
  8: {"q": "Implement regular expression matching with support for '.' and '*'.", "s": "Use Dynamic Programming. dp[i][j] represents if the first i characters of s match the first j characters of p."},
  9: {"q": "Given a collection of intervals, merge all overlapping intervals.", "s": "Sort the intervals based on the start time, then iterate and merge overlapping intervals."},
  10: {"q": "Given a set of non-overlapping & sorted intervals, insert a new interval into the intervals (merge if necessary).", "s": "Iterate through intervals, add non-overlapping ones, and merge overlapping ones with the new interval."},
  11: {"q": "Given an array of integers, find two numbers such that they add up to a specific target number.", "s": "Use a HashMap to store the numbers and their indices. For each number, check if target - number exists in the map."},
  13: {"q": "Design and implement a TwoSum class with add and find operations.", "s": "Use a HashMap to store the frequencies of added numbers. For the find operation, iterate through the keys and check if target - key exists."},
  14: {"q": "Find all unique triplets in the array which gives the sum of zero.", "s": "Sort the array, then iterate. For each element, use two pointers (left and right) to find pairs that sum to the negative of the current element."},
  15: {"q": "Given an array S of n integers, find all unique quadruplets in S which gives the sum of target.", "s": "Sort the array and use two nested loops to fix the first two elements, then use two pointers for the remaining two elements."},
  16: {"q": "Given an array S of n integers, find three integers in S such that the sum is closest to a given target.", "s": "Sort the array. Iterate through it, and use two pointers to find the sum closest to the target, keeping track of the minimum difference."},
  17: {"q": "Implement atoi to convert a string to an integer.", "s": "Trim whitespaces, handle the sign, and iterate through digits while checking for overflow/underflow against Integer.MAX_VALUE and Integer.MIN_VALUE."},
  18: {"q": "Given two sorted integer arrays A and B, merge B into A as one sorted array.", "s": "Use three pointers starting from the end of arrays A and B to place the largest elements at the end of A without overwriting."},
  19: {"q": "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", "s": "Use a Stack. Push opening brackets and for closing brackets, check if they match the popped top of the stack."},
  20: {"q": "Returns a pointer to the first occurrence of needle in haystack, or null if needle is not part of haystack.", "s": "Use two nested loops to compare substrings, or apply KMP algorithm for O(N) time complexity."},
  21: {"q": "Given a m x n matrix, if an element is 0, set its entire row and column to 0. Do it in place.", "s": "Use the first row and first column to keep track of which rows and columns need to be set to zero."},
  22: {"q": "Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.", "s": "Use Binary Search to find the target or the insertion point in O(log N) time."},
  23: {"q": "Given an unsorted array of integers, find the length of the longest consecutive elements sequence.", "s": "Use a HashSet. For each number, if it's the start of a sequence (i.e., num-1 is not in set), count the consecutive numbers."},
  24: {"q": "Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.", "s": "Use two pointers from the start and end, skipping non-alphanumeric characters, and compare them."},
  25: {"q": "Given a matrix of m x n elements, return all elements of the matrix in spiral order.", "s": "Keep track of four boundaries (top, bottom, left, right) and traverse the perimeter, shrinking the boundaries inward."},
  26: {"q": "Write an efficient algorithm that searches for a value in an m x n matrix where rows are sorted and the first integer of each row is greater than the last of the previous.", "s": "Treat the 2D matrix as a 1D sorted array and apply Binary Search."},
  27: {"q": "You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise).", "s": "Reverse the matrix top to bottom, then swap the symmetry (transpose)."},
  28: {"q": "Given a triangle, find the minimum path sum from top to bottom.", "s": "Use bottom-up Dynamic Programming. Update each element with the minimum of its two adjacent children in the row below."},
  29: {"q": "Given a string S and a string T, count the number of distinct subsequences of T in S.", "s": "Use Dynamic Programming. dp[i][j] represents the number of distinct subsequences of T[0..j] in S[0..i]."},
  30: {"q": "Find the contiguous subarray within an array which has the largest sum.", "s": "Use Kadane's Algorithm. Keep track of the current subarray sum, resetting to zero if it becomes negative, and update the max sum."},
  31: {"q": "Find the contiguous subarray within an array which has the largest product.", "s": "Keep track of both the maximum and minimum products ending at each position, as a negative number can flip the minimum to maximum."},
  32: {"q": "Given a sorted array, remove the duplicates in place such that each element appears only once and return the new length.", "s": "Use two pointers. One pointer iterates through the array, and the other keeps track of the position of unique elements."},
  33: {"q": "Follow up for 'Remove Duplicates': What if duplicates are allowed at most twice?", "s": "Use two pointers. Allow an element if it's different from the element two steps back in the modified array."},
  34: {"q": "Given a string, find the length of the longest substring without repeating characters.", "s": "Use a sliding window with a HashSet or HashMap to track characters and their indices, updating the window when a duplicate is found."},
  35: {"q": "Given a string, find the longest substring that contains at most two unique characters.", "s": "Use a sliding window and a HashMap to track character frequencies, shrinking the window when there are more than two distinct characters."},
  37: {"q": "Given an input string, reverse the string word by word.", "s": "Split the string by spaces, reverse the array of words, and join them back with a single space."},
  38: {"q": "Suppose a sorted array is rotated at some pivot. Find the minimum element.", "s": "Use Binary Search. Compare the middle element with the rightmost element to determine which half contains the minimum."},
  40: {"q": "A peak element is an element that is greater than its neighbors. Given an input array, find a peak element and return its index.", "s": "Use Binary Search. Compare the middle element with its right neighbor to decide which half to explore."},
  41: {"q": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", "s": "Use two stacks: one for the regular elements and one to keep track of the minimum values at each step."},
  42: {"q": "Given an array of size n, find the majority element which appears more than n/2 times.", "s": "Use Boyer-Moore Voting Algorithm. Maintain a candidate and a counter, incrementing for matches and decrementing for mismatches."},
  43: {"q": "Given a set of candidate numbers and a target number, find all unique combinations where the candidates sum to target.", "s": "Use Backtracking (DFS). Recursively subtract the candidate from target and explore combinations."},
  44: {"q": "Say you have an array for which the ith element is the price of a given stock on day i. Find the maximum profit for at most one transaction.", "s": "Keep track of the minimum price seen so far and calculate the maximum profit possible at each step."},
  45: {"q": "Find the maximum profit where you can complete as many transactions as you like (buy one and sell one share of the stock multiple times).", "s": "Iterate through the array and accumulate profit for any adjacent days where the price increases."},
  46: {"q": "Find the maximum profit for at most two transactions.", "s": "Use Dynamic Programming. Maintain two arrays for max profit from left to right and max profit from right to left, then combine them."},
  59: {"q": "You are given two linked lists representing two non-negative numbers. The digits are stored in reverse order. Add the two numbers.", "s": "Iterate through both lists simultaneously, keeping track of the carry, and construct a new linked list with the sums."},
  60: {"q": "Given a singly linked list, reorder it to: L0→Ln→L1→Ln-1→L2...", "s": "Find the middle of the list, reverse the second half, and merge the two halves alternately."},
  61: {"q": "Given a linked list, determine if it has a cycle in it.", "s": "Use Floyd's Cycle-Finding Algorithm (slow and fast pointers). If the fast pointer meets the slow pointer, there is a cycle."},
  62: {"q": "A linked list is given such that each node contains an additional random pointer. Return a deep copy of the list.", "s": "Use a HashMap to map original nodes to copied nodes, or interleave the copied nodes with the original nodes to avoid extra space."},
  63: {"q": "Merge two sorted linked lists and return it as a new list.", "s": "Use a dummy head node and iteratively append the smaller node from the two lists until one is exhausted, then append the remaining list."},
  64: {"q": "Merge k sorted linked lists and return it as one sorted list.", "s": "Use a PriorityQueue (Min-Heap) to keep track of the smallest current node among all the lists, or use divide and conquer."},
  65: {"q": "Given a sorted linked list, delete all duplicates such that each element appear only once.", "s": "Iterate through the list. If the current node's value equals the next node's value, skip the next node."},
  66: {"q": "Given a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.", "s": "Create two separate lists for nodes less than x and nodes greater or equal to x, then connect them."},
  73: {"q": "Given a binary tree, determine if it is a valid binary search tree (BST).", "s": "Recursively check if each node's value falls within a valid range [min, max], updating the range for left and right subtrees."},
  74: {"q": "Given a binary tree, flatten it to a linked list in-place, following pre-order traversal.", "s": "Use a recursive approach or a stack to keep track of right children while re-wiring left children to the right."},
  76: {"q": "Given inorder and postorder traversal of a tree, construct the binary tree.", "s": "The last element in postorder is the root. Find its index in inorder to divide into left and right subtrees, then recurse."},
  77: {"q": "Given an array where elements are sorted in ascending order, convert it to a height balanced BST.", "s": "Use the middle element of the array as the root, and recursively construct the left and right subtrees from the two halves."},
  78: {"q": "Given a singly linked list where elements are sorted in ascending order, convert it to a height balanced BST.", "s": "Use a slow and fast pointer to find the middle of the list, make it the root, and recursively build subtrees."},
  79: {"q": "Given a binary tree, find its minimum depth.", "s": "Use BFS (Level Order Traversal) to find the first leaf node, or use recursion to find the minimum of left and right subtree depths."},
  80: {"q": "Given a binary tree, find the maximum path sum. The path may start and end at any node in the tree.", "s": "Use recursion. For each node, compute the max path sum of left and right children. Update the global max with left + right + node.val."},
  81: {"q": "Given a binary tree, determine if it is height-balanced.", "s": "Recursively compute the height of subtrees. If the difference in heights is > 1 or a subtree is unbalanced, return -1 to indicate it's not balanced."},
  85: {"q": "Sort a linked list in O(n log n) time using constant space complexity.", "s": "Use Merge Sort. Find the middle of the list using slow/fast pointers, recursively sort both halves, and then merge them."},
  86: {"q": "Implement Quicksort for an array.", "s": "Pick a pivot, partition the array such that elements smaller are on the left and larger on the right, and recursively apply to sub-arrays."},
  87: {"q": "Sort a linked list using insertion sort.", "s": "Use a dummy head node. Iterate through the original list and insert each node into its correct sorted position in the new list."},
  90: {"q": "Given two words, find the minimum number of steps required to convert word1 to word2 (insert, delete, replace).", "s": "Use Dynamic Programming. dp[i][j] stores the min operations to match word1[0..i] to word2[0..j]."},
  91: {"q": "Given an array of integers, every element appears twice except for one. Find that single one.", "s": "Use XOR bitwise operation. XORing a number with itself results in 0, so XORing all elements leaves the single number."},
  93: {"q": "Get maximum binary gap. For example, 9's binary form is 1001, the gap is 2.", "s": "Iterate through the bits. Keep track of the distance between consecutive 1s and update the maximum gap found."},
  96: {"q": "Given a collection of numbers, return all possible permutations.", "s": "Use Backtracking (DFS). Swap elements to generate permutations, or build permutations by adding available elements to a temporary list."},
  97: {"q": "Given a collection of numbers that might contain duplicates, return all possible unique permutations.", "s": "Sort the array first. Use Backtracking and skip duplicates by checking if the current element equals the previous one."},
  98: {"q": "The set [1,2,3,...,n] contains a total of n! unique permutations. Find the kth permutation sequence.", "s": "Use math. Calculate factorials to determine which block the kth permutation falls into, picking digits iteratively."},
  99: {"q": "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.", "s": "Use Backtracking (DFS). Add an open parenthesis if available, and add a close parenthesis if there are unclosed open parentheses."},
  100: {"q": "Reverse digits of an integer.", "s": "Iteratively extract the last digit using modulo 10 and append it to the reversed number, checking for overflow before updating."},
  101: {"q": "Determine whether an integer is a palindrome. Do this without extra space.", "s": "Reverse the second half of the number and compare it to the first half, handling negative numbers by returning false."},
  102: {"q": "Implement pow(x, n).", "s": "Use Exponentiation by Squaring. Recursively calculate pow(x, n/2) and square it, multiplying by x if n is odd."}
}

with open("dataset.json", "r") as f:
    data = json.load(f)

for p in data:
    if p["id"] in FIXES:
        p["questionSummary"] = FIXES[p["id"]]["q"]
        p["solutionSummary"] = FIXES[p["id"]]["s"]

with open("dataset.json", "w") as f:
    json.dump(data, f, indent=2)

print("Applied fixes.")
