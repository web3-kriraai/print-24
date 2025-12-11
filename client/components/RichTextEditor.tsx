import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, AlignLeft, Image as ImageIcon, Link as LinkIcon, Video } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  rows = 8,
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
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
    }
    
    handleInput();
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'unorderedList':
        execCommand('insertUnorderedList');
        break;
      case 'orderedList':
        execCommand('insertOrderedList');
        break;
      case 'justifyLeft':
        execCommand('justifyLeft');
        break;
      case 'justifyCenter':
        execCommand('justifyCenter');
        break;
      case 'justifyRight':
        execCommand('justifyRight');
        break;
      default:
        break;
    }
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const img = document.createElement('img');
      img.src = imageUrl.trim();
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.alt = 'Inserted image';
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else if (editorRef.current) {
        editorRef.current.appendChild(img);
      }
      
      handleInput();
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const insertLink = () => {
    if (linkUrl.trim()) {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        // Use selected text as link text
        execCommand('createLink', linkUrl.trim());
      } else if (linkText.trim()) {
        // Insert new link with provided text
        const link = document.createElement('a');
        link.href = linkUrl.trim();
        link.textContent = linkText.trim();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(link);
          range.setStartAfter(link);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (editorRef.current) {
          editorRef.current.appendChild(link);
        }
        
        handleInput();
      }
      
      setLinkUrl("");
      setLinkText("");
      setShowLinkDialog(false);
    }
  };

  const insertEmbed = () => {
    if (embedUrl.trim()) {
      let embedCode = '';
      const url = embedUrl.trim();
      
      // Check if it's a YouTube URL
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        // For other URLs, try to create an iframe (user should provide embed URL)
        embedCode = `<iframe src="${url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
      }
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = embedCode;
        const embedElement = tempDiv.firstChild;
        if (embedElement) {
          range.insertNode(embedElement);
          range.setStartAfter(embedElement);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else if (editorRef.current) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = embedCode;
        const embedElement = tempDiv.firstChild;
        if (embedElement) {
          editorRef.current.appendChild(embedElement);
        }
      }
      
      handleInput();
      setEmbedUrl("");
      setShowEmbedDialog(false);
    }
  };

  return (
    <div className={`border border-cream-300 rounded-lg overflow-hidden relative ${className}`}>
      {/* Toolbar */}
      <div className="bg-cream-100 border-b border-cream-300 p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formatText('bold');
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
            formatText('italic');
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
            formatText('underline');
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
            formatText('unorderedList');
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
            formatText('orderedList');
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Numbered List"
        >
          <AlignLeft size={16} className="text-cream-900" />
        </button>
        <div className="w-px h-6 bg-cream-300 mx-1" />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowImageDialog(true);
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={16} className="text-cream-900" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLinkDialog(true);
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
            setShowEmbedDialog(true);
          }}
          className="p-2 hover:bg-cream-200 rounded transition-colors"
          title="Insert Embedded Link (YouTube, etc.)"
        >
          <Video size={16} className="text-cream-900" />
        </button>
        <div className="w-px h-6 bg-cream-300 mx-1" />
        <select
          onChange={(e) => {
            if (e.target.value) {
              execCommand('formatBlock', e.target.value);
            }
          }}
          className="px-2 py-1 text-sm border border-cream-300 rounded bg-white text-cream-900"
          title="Heading"
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Paragraph</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        onCopy={(e) => {
          // Allow default copy behavior
          e.stopPropagation();
        }}
        onCut={(e) => {
          // Allow default cut behavior
          e.stopPropagation();
        }}
        className="w-full px-4 py-3 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-cream-500"
        style={{
          minHeight: `${rows * 1.5}rem`,
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Image Insert Dialog */}
      {showImageDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-cream-900 mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertImage();
                    }
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("");
                    setShowImageDialog(false);
                  }}
                  className="flex-1 px-4 py-2 border border-cream-300 text-cream-700 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  className="flex-1 px-4 py-2 bg-cream-900 text-white rounded-lg hover:bg-cream-800 transition-colors"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Insert Dialog */}
      {showLinkDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-cream-900 mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Link URL *
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertLink();
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Link Text (optional - uses selected text if available)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLinkUrl("");
                    setLinkText("");
                    setShowLinkDialog(false);
                  }}
                  className="flex-1 px-4 py-2 border border-cream-300 text-cream-700 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  disabled={!linkUrl.trim()}
                  className="flex-1 px-4 py-2 bg-cream-900 text-white rounded-lg hover:bg-cream-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed Insert Dialog */}
      {showEmbedDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-cream-900 mb-4">Insert Embedded Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-900 mb-2">
                  Video/Embed URL *
                </label>
                <input
                  type="url"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or embed URL"
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-cream-500 focus:border-cream-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertEmbed();
                    }
                  }}
                />
                <p className="text-xs text-cream-600 mt-1">
                  Supports YouTube URLs (auto-converts to embed) or any embed URL
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmbedUrl("");
                    setShowEmbedDialog(false);
                  }}
                  className="flex-1 px-4 py-2 border border-cream-300 text-cream-700 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertEmbed}
                  disabled={!embedUrl.trim()}
                  className="flex-1 px-4 py-2 bg-cream-900 text-white rounded-lg hover:bg-cream-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert
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
        }
        [contenteditable] {
          outline: none;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable] * {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

