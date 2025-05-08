#!/bin/bash

# Script to generate responsive WebP images for use in srcset tags
# Requires ImageMagick to be installed

# Create output directory if it doesn't exist
mkdir -p images/responsive

# Sizes for responsive images (widths in pixels)
SIZES=(320 640 768 1024 1280 1536 1920)

# Quality setting for WebP (0-100, higher is better quality but larger file size)
QUALITY=80

# Function to convert image to responsive WebP versions
convert_to_responsive() {
    local input_file="$1"
    local filename=$(basename -- "$input_file")
    local name="${filename%.*}"
    
    echo "Processing $input_file..."
    
    # Get original dimensions
    local dimensions=$(identify -format "%w %h" "$input_file")
    read -r original_width original_height <<< "$dimensions"
    
    # Calculate aspect ratio
    local aspect=$(echo "scale=6; $original_height / $original_width" | bc)
    
    # Generate responsive images for each size
    for size in "${SIZES[@]}"; do
        # Skip if target size is larger than original
        if (( size > original_width )); then
            continue
        fi
        
        # Calculate height based on aspect ratio
        local height=$(echo "scale=0; $size * $aspect / 1" | bc)
        
        # Generate WebP version
        convert "$input_file" -resize "${size}x${height}" -quality $QUALITY \
            "images/responsive/${name}-${size}.webp"
        
        echo "  Created: images/responsive/${name}-${size}.webp"
    done
    
    # Also create original size WebP for maximum quality option
    convert "$input_file" -quality $QUALITY "images/responsive/${name}-original.webp"
    echo "  Created: images/responsive/${name}-original.webp"
}

# Create HTML reference file for srcset tags
HTML_REFERENCE="images/srcset-reference.html"
echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Responsive Image References</title>
    <style>
        body { font-family: system-ui, sans-serif; line-height: 1.6; margin: 2rem; }
        .image-reference { margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 2rem; }
        pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; }
        h2 { margin-top: 2rem; }
    </style>
</head>
<body>
    <h1>Responsive Image References</h1>
    <p>Copy and paste the HTML code for each image as needed in your website.</p>
" > "$HTML_REFERENCE"

# Process all images in the images directory
for img in images/*.jpg; do
    convert_to_responsive "$img"
    
    # Add HTML reference for this image
    filename=$(basename -- "$img")
    name="${filename%.*}"
    
    # Get image dimensions
    dimensions=$(identify -format "%w %h" "$img")
    read -r width height <<< "$dimensions"
    
    # Get available sizes for this image's srcset
    srcset=""
    for size in "${SIZES[@]}"; do
        if (( size > width )); then
            continue
        fi
        srcset="${srcset}    images/responsive/${name}-${size}.webp ${size}w,\n"
    done
    # Add original webp
    srcset="${srcset}    images/responsive/${name}-original.webp ${width}w"
    
    # Get alt text and caption from JSON
    alt_text=$(grep -A 3 "\"file\": \"$filename\"" "images/index.json" | grep "\"alt\"" | sed 's/.*"alt": "\(.*\)",/\1/')
    caption=$(grep -A 4 "\"file\": \"$filename\"" "images/index.json" | grep "\"caption\"" | sed 's/.*"caption": "\(.*\)",/\1/')
    
    # Write the HTML reference for this image
    cat >> "$HTML_REFERENCE" << EOF
    <div class="image-reference">
        <h2>$filename</h2>
        <p><strong>Original Size:</strong> ${width}x${height} pixels</p>
        <p><strong>Alt Text:</strong> $alt_text</p>
        <p><strong>Caption:</strong> $caption</p>
        
        <h3>HTML Code:</h3>
        <pre>&lt;picture&gt;
  &lt;source type="image/webp" srcset="
$srcset"
    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"&gt;
  &lt;img src="images/$filename" alt="$alt_text" loading="lazy" width="$width" height="$height"&gt;
&lt;/picture&gt;</pre>

        <h3>With Caption:</h3>
        <pre>&lt;figure&gt;
  &lt;picture&gt;
    &lt;source type="image/webp" srcset="
$srcset"
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"&gt;
    &lt;img src="images/$filename" alt="$alt_text" loading="lazy" width="$width" height="$height"&gt;
  &lt;/picture&gt;
  &lt;figcaption&gt;$caption&lt;/figcaption&gt;
&lt;/figure&gt;</pre>
    </div>
EOF
done

# Finish HTML reference file
echo "</body>
</html>" >> "$HTML_REFERENCE"

echo "Done! Responsive images created in images/responsive/ directory"
echo "HTML reference with srcset code for each image created at $HTML_REFERENCE"