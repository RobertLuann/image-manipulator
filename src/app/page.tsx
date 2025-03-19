"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Camera, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"

// Filter options with their CSS filter values
const filterOptions = [
  { name: "Normal", value: "none" },
  { name: "Grayscale", value: "grayscale(100%)" },
  { name: "Sepia", value: "sepia(100%)" },
  { name: "Invert", value: "invert(100%)" },
  { name: "Blur", value: "blur(5px)" },
  { name: "Brightness", value: "brightness(150%)" },
  { name: "Contrast", value: "contrast(200%)" },
  { name: "Hue Rotate", value: "hue-rotate(90deg)" },
  { name: "Saturate", value: "saturate(200%)" },
]

export default function ImageFilterApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("none")
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Download filtered image
  const handleDownload = () => {
    if (!selectedImage) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (ctx) {
        // Apply the selected filter to the canvas context
        ctx.filter = selectedFilter
        ctx.drawImage(img, 0, 0)

        // Create download link
        const link = document.createElement("a")
        link.download = "filtered-image.png"
        link.href = canvas.toDataURL("image/png")
        link.click()
      }
    }
    img.src = selectedImage
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Image Filter App</h1>
          <ModeToggle />
        </header>

        <div className="grid gap-8">
          {/* Image Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isHovering ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsHovering(true)
                }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsHovering(false)

                  const file = e.dataTransfer.files?.[0]
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      setSelectedImage(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />

                <div className="flex flex-col items-center gap-4">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Drag and drop your image here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click the button below to browse</p>
                  </div>
                  <Button onClick={handleUploadClick} className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Controls */}
          {selectedImage && (
            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
              {/* Image Preview */}
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <div className="relative max-h-full max-w-full" style={{ filter: selectedFilter }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-[60vh] max-w-full object-contain"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filter Options */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="filter">Select Filter</Label>
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger id="filter">
                          <SelectValue placeholder="Choose a filter" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.map((filter) => (
                            <SelectItem key={filter.value} value={filter.value}>
                              {filter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Filtered Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

