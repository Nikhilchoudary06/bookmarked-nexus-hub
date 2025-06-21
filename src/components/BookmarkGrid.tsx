
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { supabase, type Bookmark } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ExternalLink, Trash2, Loader2 } from "lucide-react"

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  loading: boolean
  onBookmarkDeleted: (id: string) => void
}

export const BookmarkGrid = ({ bookmarks, loading, onBookmarkDeleted }: BookmarkGridProps) => {
  const { user } = useUser()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (bookmark: Bookmark) => {
    if (!user || bookmark.user_id !== user.id) return
    
    setDeletingId(bookmark.id)
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting bookmark:', error)
        toast({
          title: "Error",
          description: "Failed to delete bookmark",
          variant: "destructive"
        })
      } else {
        onBookmarkDeleted(bookmark.id)
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete bookmark",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
          <div className="text-gray-500 mb-4">
            <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500">Start adding your favorite websites to see them here!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <Card 
          key={bookmark.id} 
          className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {bookmark.title}
            </CardTitle>
            <p className="text-sm text-gray-500">{getDomain(bookmark.url)}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookmark.description && (
              <p className="text-gray-600 text-sm line-clamp-3">{bookmark.description}</p>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {formatDate(bookmark.created_at)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(bookmark.url, '_blank')}
                  className="hover:bg-indigo-50 hover:border-indigo-200"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(bookmark)}
                  disabled={deletingId === bookmark.id}
                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  {deletingId === bookmark.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
