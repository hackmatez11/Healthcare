import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, Image, X, Download, Eye, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

interface Document {
  id: string
  patient_id: string
  file_name: string
  file_type: string
  file_url: string
  file_size: number
  category: string
  uploaded_at: string
  description?: string
}

export default function PatientDocuments() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Documents" },
    { id: "photo", label: "Photos" },
    { id: "report", label: "Lab Reports" },
    { id: "prescription", label: "Prescriptions" },
    { id: "xray", label: "X-Rays" },
    { id: "mri", label: "MRI/CT Scans" },
    { id: "other", label: "Other" }
  ]

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("patient_documents")
      .select("*")
      .eq("patient_id", user.id)
      .order("uploaded_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents:", error)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return

    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    setUploading(true)

    try {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("patient-files")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("patient-files")
        .getPublicUrl(fileName)

      // Determine category based on file type
      const fileType = file.type
      let category = "other"
      if (fileType.startsWith("image/")) category = "photo"
      else if (fileType === "application/pdf") category = "report"

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from("patient_documents")
        .insert({
          patient_id: user.id,
          file_name: file.name,
          file_type: file.type,
          file_url: urlData.publicUrl,
          file_size: file.size,
          category: category
        })

      if (dbError) throw dbError

      await fetchDocuments()
      alert("File uploaded successfully!")
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const deleteDocument = async (doc: Document) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      // Delete from storage
      const filePath = doc.file_url.split("/patient-files/")[1]
      await supabase.storage.from("patient-files").remove([filePath])

      // Delete from database
      const { error } = await supabase
        .from("patient_documents")
        .delete()
        .eq("id", doc.id)

      if (error) throw error

      await fetchDocuments()
      alert("Document deleted successfully!")
    } catch (error) {
      console.error("Error deleting document:", error)
      alert("Error deleting document. Please try again.")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const filteredDocuments = selectedCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory)

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 text-lg">
          Upload Medical Documents
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1">
            <input
              type="file"
              onChange={uploadFile}
              disabled={uploading}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              id="file-upload"
            />
            <Button
              asChild
              disabled={uploading}
              className="w-full gradient-primary text-primary-foreground cursor-pointer"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Choose File to Upload"}
              </label>
            </Button>
          </label>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Supported formats: Images (JPG, PNG), PDF, Word documents. Max size: 10MB
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {cat.label}
              {cat.id === "all" && ` (${documents.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 text-lg">
          Your Documents ({filteredDocuments.length})
        </h3>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents found. Upload your first document above.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {doc.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.file_size)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {categories.find(c => c.id === doc.category)?.label || doc.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                </div>

                {doc.file_type.startsWith("image/") && (
                  <img
                    src={doc.file_url}
                    alt={doc.file_name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(doc.file_url, "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const a = document.createElement("a")
                      a.href = doc.file_url
                      a.download = doc.file_name
                      a.click()
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDocument(doc)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}