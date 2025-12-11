import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CKEditor: React.FC<CKEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Initialize editor with proper LTR direction
  useEffect(() => {
    if (editorRef.current) {
      // Set direction and alignment
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      
      // Set initial content if provided
      if (value) {
        editorRef.current.innerHTML = value;
      } else {
        editorRef.current.innerHTML = '';
      }
      
      // Ensure cursor starts at the beginning (left side)
      const range = document.createRange();
      const selection = window.getSelection();
      if (editorRef.current.firstChild) {
        range.setStart(editorRef.current.firstChild, 0);
      } else {
        range.setStart(editorRef.current, 0);
      }
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []); // Only run once on mount

  // Update content when value prop changes (external updates)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      const wasFocused = document.activeElement === editorRef.current;
      const selection = window.getSelection();
      let cursorPosition = 0;
      
      // Save cursor position if editor was focused
      if (wasFocused && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        cursorPosition = preCaretRange.toString().length;
      }
      
      editorRef.current.innerHTML = value || '';
      
      // Restore cursor position
      if (wasFocused && cursorPosition > 0) {
        const range = document.createRange();
        let charCount = 0;
        const walker = document.createTreeWalker(
          editorRef.current,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        while ((node = walker.nextNode())) {
          const nodeLength = node.textContent?.length || 0;
          if (charCount + nodeLength >= cursorPosition) {
            range.setStart(node, cursorPosition - charCount);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
            editorRef.current.focus();
            break;
          }
          charCount += nodeLength;
        }
      }
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleInput();
      
      // Ensure direction remains LTR after command
      if (editorRef.current) {
        editorRef.current.setAttribute('dir', 'ltr');
        editorRef.current.style.direction = 'ltr';
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      // Ensure direction is always LTR
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Insert plain text at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (editorRef.current) {
      // If no selection, append to end
      const textNode = document.createTextNode(text);
      editorRef.current.appendChild(textNode);
      
      // Move cursor to end
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    
    handleInput();
  };

  const handleFocus = () => {
    if (editorRef.current) {
      // Ensure LTR direction on focus
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      
      // If empty, ensure cursor is at start (left side)
      if (!editorRef.current.textContent || editorRef.current.textContent.trim() === '') {
        const range = document.createRange();
        range.setStart(editorRef.current, 0);
        range.collapse(true);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const insertImage = () => {
    if (imageUrl.trim() && editorRef.current) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px 0';
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.appendChild(img);
      }
      
      editorRef.current.focus();
      handleInput();
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const insertLink = () => {
    if (linkUrl.trim() && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = linkText.trim() || linkUrl;
        link.style.color = '#92400e';
        link.style.textDecoration = 'underline';
        
        try {
          range.surroundContents(link);
        } catch (e) {
          // If surroundContents fails, insert the link
          range.deleteContents();
          range.insertNode(link);
        }
        
        // Move cursor after link
        const newRange = document.createRange();
        newRange.setStartAfter(link);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        handleInput();
        setLinkUrl("");
        setLinkText("");
        setShowLinkDialog(false);
      } else {
        // Insert link at cursor position even if no selection
        const range = selection?.rangeCount > 0 ? selection.getRangeAt(0) : document.createRange();
        if (selection && selection.rangeCount === 0) {
          range.setStart(editorRef.current, editorRef.current.childNodes.length);
        }
        range.deleteContents();
        const link = document.createElement('a');
        link.href = linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = linkText.trim() || linkUrl;
        link.style.color = '#92400e';
        link.style.textDecoration = 'underline';
        range.insertNode(link);
        range.setStartAfter(link);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        handleInput();
        setLinkUrl("");
        setLinkText("");
        setShowLinkDialog(false);
      }
    }
  };

  // Render editor with toolbar immediately - no loading state
  return (
    <div 
      className={`border border-cream-300 rounded-lg overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Toolbar */}
      <div 
        className="bg-cream-100 border-b border-cream-300 p-2 flex items-center gap-2 flex-wrap" 
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('bold');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Bold"
        >
          <Bold size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('italic');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Italic"
        >
          <Italic size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('underline');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Underline"
        >
          <Underline size={16} className="text-cream-900" />
        </button>
        <div className="w-px h-6 bg-cream-300 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('insertUnorderedList');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Bullet List"
        >
          <List size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('insertOrderedList');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Numbered List"
        >
          <List size={16} className="text-cream-900" />
        </button>
        <div className="w-px h-6 bg-cream-300 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            setShowLinkDialog(true);
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Insert Link"
        >
          <LinkIcon size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            setShowImageDialog(true);
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={16} className="text-cream-900" />
        </button>
        <div className="w-px h-6 bg-cream-300 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('justifyLeft');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('justifyCenter');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            execCommand('justifyRight');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight size={16} className="text-cream-900" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onFocus={handleFocus}
        onPaste={handlePaste}
        className="w-full px-4 py-3 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-cream-500"
        style={{ 
          direction: 'ltr', 
          textAlign: 'left',
          unicodeBidi: 'embed'
        }}
        dir="ltr"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="ltr">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-cream-900 mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertImage();
                    } else if (e.key === 'Escape') {
                      setShowImageDialog(false);
                      setImageUrl("");
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={insertImage}
                  className="flex-1 px-4 py-2 bg-cream-900 text-white rounded-lg hover:bg-cream-800 transition-colors"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImageDialog(false);
                    setImageUrl("");
                    editorRef.current?.focus();
                  }}
                  className="flex-1 px-4 py-2 border border-cream-300 text-cream-700 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="ltr">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-cream-900 mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                  placeholder="https://example.com"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertLink();
                    } else if (e.key === 'Escape') {
                      setShowLinkDialog(false);
                      setLinkUrl("");
                      setLinkText("");
                    }
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                  placeholder="Click here"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertLink();
                    }
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={insertLink}
                  className="flex-1 px-4 py-2 bg-cream-900 text-white rounded-lg hover:bg-cream-800 transition-colors"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl("");
                    setLinkText("");
                    editorRef.current?.focus();
                  }}
                  className="flex-1 px-4 py-2 border border-cream-300 text-cream-700 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
          direction: ltr;
          text-align: left;
        }
        [contenteditable] {
          outline: none;
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable] * {
          direction: ltr !important;
          text-align: left !important;
        }
        [contenteditable] a {
          color: #92400e;
          text-decoration: underline;
        }
        [contenteditable] a:hover {
          color: #7c2d12;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin-left: 20px;
          padding-left: 20px;
        }
        [contenteditable] p {
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
};

export default CKEditor;
