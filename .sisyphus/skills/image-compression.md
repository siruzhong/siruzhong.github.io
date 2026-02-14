# Image Compression Skill

Automatically compress images in the website to ensure they are under 500KB.

## Usage

```
/compress-images [path] [--max-size=500] [--max-dimension=1200]
```

### Arguments

- `path`: Directory or file to compress (default: `assets/images`)
- `--max-size`: Maximum file size in KB (default: 500)
- `--max-dimension`: Maximum width/height in pixels (default: 1200)

### Examples

```
# Compress all images in assets/images/covers
/compress-images assets/images/covers

# Compress specific file
/compress-images assets/images/covers/photo.png

# Compress with custom size limit (300KB)
/compress-images assets/images --max-size=300

# Compress with smaller dimensions
/compress-images assets/images --max-dimension=800
```

## Implementation

### Step 1: Find oversized images

Use bash to find all image files larger than the threshold:

```bash
find {{path}} -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" \) -size +{{max_size}}k
```

### Step 2: Compress each image

For each oversized image:

1. **Backup original**: Copy to `{{filename}}.bak`
2. **Check dimensions**: Use `sips -g pixelWidth -g pixelHeight {{file}}`
3. **Resize if needed**: Use `sips -Z {{max_dimension}} {{file}} --out {{file}}`
4. **Verify size**: Check if still oversized after resize
5. **Further compression if needed**: Reduce dimensions iteratively until under limit
6. **Remove backup**: Clean up `.bak` files after successful compression

### Step 3: Report results

Output summary showing:
- Total images scanned
- Number of images compressed
- Space saved (before vs after)
- Any failures

## Implementation Script

Create `scripts/compress-images.sh` with the following content:

```bash
#!/bin/bash
# Image Compression Script - Ensures all images are under 500KB

MAX_SIZE_KB=500
MAX_DIMENSION=1200
TARGET_PATH="${1:-assets/images}"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --max-size=*) MAX_SIZE_KB="${1#*=}"; shift ;;
    --max-dimension=*) MAX_DIMENSION="${1#*=}"; shift ;;
    --help|-h)
      echo "Usage: $0 [path] [--max-size=KB] [--max-dimension=PX]"
      echo "  path              Directory or file to compress (default: assets/images)"
      echo "  --max-size=KB     Maximum file size in KB (default: 500)"
      echo "  --max-dimension=PX Maximum width/height in pixels (default: 1200)"
      exit 0 ;;
    -*) echo "Unknown option: $1"; exit 1 ;;
    *) TARGET_PATH="$1"; shift ;;
  esac
done

# Check if sips is available
if ! command -v sips &> /dev/null; then
  echo "Error: 'sips' command not found. This script requires macOS."
  exit 1
fi

MAX_SIZE_BYTES=$((MAX_SIZE_KB * 1024))
TOTAL_SCANNED=0; TOTAL_COMPRESSED=0; TOTAL_SAVED_BYTES=0

get_file_size() { stat -f%z "$1" 2>/dev/null || echo 0; }

compress_image() {
  local file="$1"
  local original_size=$(get_file_size "$file")
  
  [[ $original_size -le $MAX_SIZE_BYTES ]] && return 0
  
  echo "  Compressing: $(basename "$file") ($((original_size / 1024))KB)"
  cp "$file" "$file.bak"
  
  local current_max_dim=$MAX_DIMENSION
  while true; do
    sips -Z "$current_max_dim" "$file" --out "$file" 2>/dev/null
    local current_size=$(get_file_size "$file")
    
    [[ $current_size -le $MAX_SIZE_BYTES ]] && break
    current_max_dim=$((current_max_dim - 100))
    
    if [[ $current_max_dim -lt 400 ]]; then
      echo "    Warning: Cannot compress below ${MAX_SIZE_KB}KB"
      mv "$file.bak" "$file"
      return 1
    fi
  done
  
  local saved=$((original_size - $(get_file_size "$file")))
  echo "    ✓ Saved $((saved / 1024))KB"
  rm -f "$file.bak"
  return 0
}

echo "Compressing images in: $TARGET_PATH"
echo "Max size: ${MAX_SIZE_KB}KB, Max dimension: ${MAX_DIMENSION}px"
echo ""

if [[ -f "$TARGET_PATH" ]]; then
  TOTAL_SCANNED=1
  original_size=$(get_file_size "$TARGET_PATH")
  if [[ $original_size -gt $MAX_SIZE_BYTES ]]; then
    compress_image "$TARGET_PATH" && TOTAL_COMPRESSED=1
  fi
elif [[ -d "$TARGET_PATH" ]]; then
  while IFS= read -r -d '' file; do
    TOTAL_SCANNED=$((TOTAL_SCANNED + 1))
    original_size=$(get_file_size "$file")
    if [[ $original_size -gt $MAX_SIZE_BYTES ]]; then
      compress_image "$file" && {
        TOTAL_COMPRESSED=$((TOTAL_COMPRESSED + 1))
        TOTAL_SAVED_BYTES=$((TOTAL_SAVED_BYTES + original_size - $(get_file_size "$file")))
      }
    fi
  done < <(find "$TARGET_PATH" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -print0)
fi

echo ""
echo "Done: Scanned $TOTAL_SCANNED, Compressed $TOTAL_COMPRESSED, Saved $((TOTAL_SAVED_BYTES / 1024))KB"
```

### Setup Instructions

1. Create the script directory:
   ```bash
   mkdir -p scripts
   ```

2. Save the script to `scripts/compress-images.sh`

3. Make it executable:
   ```bash
   chmod +x scripts/compress-images.sh
   ```

4. Add to package.json scripts (optional):
   ```json
   "scripts": {
     "compress-images": "./scripts/compress-images.sh"
   }
   ```

## CI/CD Integration

Add to your GitHub Actions workflow to auto-compress on PR:

```yaml
- name: Check Image Sizes
  run: |
    ./scripts/compress-images.sh assets/images --max-size=500
    git diff --name-only | grep -E '\.(png|jpg|jpeg)$' || true
```

## Requirements

- macOS (uses `sips` command)
- For Linux: Replace `sips` with `convert` (ImageMagick) or `mogrify`
- Images: PNG, JPG, JPEG formats

## Safety

- Always creates `.bak` backups before modifying
- Only removes backups after successful compression
- Reports warnings for images that cannot meet size requirements
