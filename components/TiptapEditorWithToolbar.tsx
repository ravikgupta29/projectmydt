import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'

export default function TiptapEditorWithToolbar({ content, onChange }: any) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML()) // Save the content as HTML
    },
  })

  if (!editor) return null

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex space-x-4 p-2 rounded-md bg-gray-100 shadow-md mb-4">
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-blue-400 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          <Bold size={20} />
        </button>

        {/* Italic Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-blue-400 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          <Italic size={20} />
        </button>

        {/* Bullet List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-blue-400 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          <List size={20} />
        </button>

        {/* Ordered List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-blue-400 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          <ListOrdered size={20} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative border-2 border-gray-300 rounded-lg min-h-[200px] p-4 bg-white shadow-sm focus-within:border-blue-400">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
