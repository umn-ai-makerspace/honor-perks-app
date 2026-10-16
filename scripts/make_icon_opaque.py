from PIL import Image
from pathlib import Path

root = Path(__file__).resolve().parents[1]
path = root / "assets" / "icon.png"
image = Image.open(path).convert("RGBA")
background = Image.new("RGBA", image.size, "#07111F")
background.alpha_composite(image)
background.convert("RGB").save(path, "PNG", optimize=True)
print(path)
