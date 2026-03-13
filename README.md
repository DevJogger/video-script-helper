# Video Script Helper

A web application for processing and formatting video scripts with support for Cantonese, Mandarin, and subtitle generation.

## Features

- **Multiple Output Modes**:
  - **Cantonese (粵)**: Convert text to Cantonese recording script, replacing certain words with Cantonese equivalents (e.g., "公寓" → "柏文")
  - **Mandarin (國)**: Convert text to Mandarin recording script, replacing certain words with Mandarin equivalents (e.g., "廿" → "二十")
  - **Subtitle (字幕)**: Generate subtitle-formatted text for download
- **Pronunciation Hints**: Toggle different types of Cantonese pronunciation hints (beta)
- **Print Support**: Print Mandarin scripts with optional pinyin annotations
- **Download**: Export subtitle files in UTF-16LE format

## How to Use

### Getting Started

1. Open the application in your web browser
2. You'll see two panels: **Input** (left) and **Output** (right)

### Creating Your Script

1. Type or paste your original script in the **Input** editor on the left
2. Any modifications made in the right output panel will not affect the original script in the left input panel

### Converting Your Script

1. Select an output mode by clicking one of the buttons in the Output panel:
   - **粵** for Cantonese
   - **國** for Mandarin  
   - **字幕** for subtitles

2. The converted text will automatically appear in the **Output** editor
3. In Cantonese/Mandarin modes, replaced words will be marked in red in the output panel for easy review of potential semantic shifts
4. If semantic shifts occur after replacement (e.g., "目的地" → "目嘅地" in Cantonese), you can add underline to the word in the left input panel to prevent incorrect replacement, or directly edit the output panel
5. In subtitle mode, paragraphs without Chinese characters are automatically removed, punctuation marks (commas and periods) are removed with automatic line breaks, and enumeration commas are replaced with spaces
6. In subtitle mode, you can directly edit the output panel without affecting the original script. The output panel background turns gray after the 16th character as a reference for subtitle line breaks

### Adjusting Settings

Click the **Settings** icon (⚙️) in the output panel to access:

- **Cantonese Pronunciation Hints (beta)**: Toggle different pronunciation hint types (all disabled by default)
- **Print Settings**: Enable pinyin annotations when printing Mandarin scripts (disabled by default)

### Printing or Downloading

- **For Cantonese/Mandarin**: Click the **Printer** icon (🖨️) to print your script
- **For Subtitles**: Click the **Download** icon (⬇️) to save as `subtitle.txt`

## Tips

- The output updates automatically as you type
- You can edit the output text directly if needed, but output text is not saved and will be automatically reprocessed when there are changes to the input, output mode, or settings
- Subtitle downloads use UTF-16LE encoding for compatibility with video editing software

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- JavaScript enabled

---

This is the user documentation. For development-related documents, please refer to other project documentation.

For Traditional Chinese version, see [README.zh-HK.md](./README.zh-HK.md)