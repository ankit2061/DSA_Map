import os
from markitdown import MarkItDown

def convert_pdf_to_md(pdf_path, output_path):
    print(f"Initializing MarkItDown...")
    markitdown = MarkItDown()
    
    print(f"Converting '{pdf_path}' to markdown...")
    try:
        result = markitdown.convert(pdf_path)
        
        # Ensure target directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        print(f"Writing output to '{output_path}'...")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(result.text_content)
        print("Conversion complete!")
    except Exception as e:
        print(f"Error during conversion: {e}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    pdf_file = os.path.join(project_root, "leetcode_problems.pdf")
    output_file = os.path.join(current_dir, "leetcode_problems.md")
    
    convert_pdf_to_md(pdf_file, output_file)
