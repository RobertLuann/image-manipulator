'use client';

import type React from 'react';

import { useState, useRef, type ChangeEvent } from 'react';
import { Camera, Download, Upload, Lock, Unlock, Weight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/mode-toggle';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Filter options with their CSS filter values
const filterOptions = [
  { name: 'Normal', value: 'none' },
  { name: 'Escala Cinza', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Invertido', value: 'invert(100%)' },
  { name: 'Blur', value: 'blur(5px)' },
  { name: 'Brilho', value: 'brightness(150%)' },
  { name: 'Contraste', value: 'contrast(200%)' },
  { name: 'Matiz', value: 'hue-rotate(90deg)' },
  { name: 'Saturado', value: 'saturate(200%)' },
];

export default function ImageFilterApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image dimensions state
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);

        // Get original dimensions when image loads
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setResizeWidth(img.width);
          setResizeHeight(img.height);
          setAspectRatio(img.width / img.height);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle width change with aspect ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number.parseInt(e.target.value) || 0;
    setResizeWidth(newWidth);

    if (maintainAspectRatio && newWidth > 0) {
      setResizeHeight(Math.round(newWidth / aspectRatio));
    }
  };

  // Handle height change with aspect ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number.parseInt(e.target.value) || 0;
    setResizeHeight(newHeight);

    if (maintainAspectRatio && newHeight > 0) {
      setResizeWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // Toggle aspect ratio lock
  const handleAspectRatioToggle = (checked: boolean) => {
    setMaintainAspectRatio(checked);
    if (checked && resizeWidth > 0) {
      // Recalculate height based on current width to ensure proper ratio
      setResizeHeight(Math.round(resizeWidth / aspectRatio));
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Download filtered and resized image
  const handleDownload = () => {
    if (!selectedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas to the resize dimensions
      canvas.width = resizeWidth || img.width;
      canvas.height = resizeHeight || img.height;

      if (ctx) {
        // Apply the selected filter to the canvas context
        ctx.filter = selectedFilter;
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        // Create download link
        const link = document.createElement('a');
        link.download = 'filtered-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = selectedImage;
  };

  // Handle file drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);

        // Get original dimensions when image loads
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setResizeWidth(img.width);
          setResizeHeight(img.height);
          setAspectRatio(img.width / img.height);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="press-start-2p-regular text-3xl font-bold pixelated">
            PixArray
          </h1>
          <ModeToggle />
        </header>

        <div className="grid gap-8">
          {/* Image Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isHovering
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/20'
                }`}
                onDragOver={e => {
                  e.preventDefault();
                  setIsHovering(true);
                }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={handleFileDrop}
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
                    <p className="text-lg font-medium">Arraste a imagem aqui</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ou clique no botão abaixo para pesquisar
                    </p>
                  </div>
                  <Button onClick={handleUploadClick} className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Imagem
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
                    <div
                      className="relative max-h-full max-w-full"
                      style={{ filter: selectedFilter }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage || '/placeholder.svg'}
                        alt="Preview"
                        className="max-h-[60vh] max-w-full object-contain"
                      />
                    </div>
                  </div>

                  {originalWidth > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground text-center">
                      Tamanho Original: {originalWidth} × {originalHeight} px
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Filter and Resize Options */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="filter">Selecione um filtro</Label>
                      <Select
                        value={selectedFilter}
                        onValueChange={setSelectedFilter}
                      >
                        <SelectTrigger id="filter">
                          <SelectValue placeholder="Selecione um filtro" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.map(filter => (
                            <SelectItem key={filter.value} value={filter.value}>
                              {filter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Resize Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between space-x-4">
                        <Label htmlFor="resize">Redimensionar</Label>
                        <div className="flex items-center space-x-4">
                          <Switch
                            id="aspect-ratio"
                            checked={maintainAspectRatio}
                            onCheckedChange={handleAspectRatioToggle}
                          />
                          <Label
                            htmlFor="aspect-ratio"
                            className="text-sm flex items-center"
                          >
                            {maintainAspectRatio ? (
                              <Lock className="h-3 w-3 mr-1" />
                            ) : (
                              <Unlock className="h-3 w-3 mr-1" />
                            )}
                            Manter proporção
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width" className="text-xs">
                            Largura (px)
                          </Label>
                          <Input
                            id="width"
                            type="number"
                            min="1"
                            value={resizeWidth || ''}
                            onChange={handleWidthChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height" className="text-xs">
                            Altura (px)
                          </Label>
                          <Input
                            id="height"
                            type="number"
                            min="1"
                            value={resizeHeight || ''}
                            onChange={handleHeightChange}
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Imagem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
