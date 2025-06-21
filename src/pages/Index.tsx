
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { supabase, type Bookmark } from "@/lib/supabase"
import { BookmarkForm } from "@/components/BookmarkForm"
import { BookmarkGrid } from "@/components/BookmarkGrid"
import { Bookmark as BookmarkIcon, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Index = () => {
  const { user } = useUser()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchBookmarks = async () => {
    if (!user) return
    
    console.log('Fetching bookmarks for user:', user.id)
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Error fetching bookmarks:', error)
        toast({
          title: "Error",
          description: `Failed to load bookmarks: ${error.message}`,
          variant: "destructive"
        })
      } else {
        setBookmarks(data || [])
        console.log('Bookmarks loaded:', data?.length || 0)
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBookmarkAdded = (newBookmark: Bookmark) => {
    setBookmarks(prev => [newBookmark, ...prev])
    setShowForm(false)
    toast({
      title: "Success!",
      description: "Bookmark added successfully",
    })
  }

  const handleBookmarkDeleted = (deletedId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== deletedId))
    toast({
      title: "Deleted",
      description: "Bookmark removed successfully",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <BookmarkIcon className="h-16 w-16 mx-auto mb-6 text-indigo-600" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bookmark Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Save and organize your favorite websites
            </p>
            <SignInButton forceRedirectUrl="/">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Sign In to Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="container mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BookmarkIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My books
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Add Bookmark
              </button>
              <UserButton />
            </div>
          </header>

          {showForm && (
            <div className="mb-8">
              <BookmarkForm
                onBookmarkAdded={handleBookmarkAdded}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <BookmarkGrid
            bookmarks={bookmarks}
            loading={loading}
            onBookmarkDeleted={handleBookmarkDeleted}
          />
        </div>
      </SignedIn>
    </div>
  )
}

export default Index
